import { registerPlugin, type PluginListenerHandle } from '@capacitor/core';

export type PaperSize = 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid';
export type Orientation = 'portrait' | 'landscape';
export type PrintTemplate = 'default' | 'minimal' | 'formal' | 'calendar' | 'photo';

export interface PrintMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PrintJob {
  pages: string[];
  paperSize: PaperSize;
  orientation: Orientation;
  template?: PrintTemplate;
  margins?: 'none' | 'minimal' | 'normal' | PrintMargins;
  filename?: string;
  saveToDownloads?: boolean;
  metadata?: {
    title?: string;
    author?: string;
  };
}

export interface PDFResult {
  filePath: string;
  filename: string;
  pageCount: number;
}

export interface HekaPrintPlugin {
  checkNetworkStatus(): Promise<{ isOnline: boolean }>;
  generatePDF(options: PrintJob): Promise<PDFResult>;
  printPDF(options: { filePath: string; orientation?: Orientation; paperSize?: PaperSize }): Promise<void>;
  sharePDF(options: { filePath: string; filename?: string }): Promise<void>;
  openPDF(options: { filePath: string; filename?: string }): Promise<void>;
  addListener(
    eventName: 'pdfProgress',
    listenerFunc: (event: { currentPage: number; totalPages: number; progress: number }) => void
  ): PluginListenerHandle;
}

import { getErrorMessage, getErrorCode } from '../utils/errorUtils';

const HekaPrint = registerPlugin<HekaPrintPlugin>('HekaPrint');

export class PrintManager {
  /**
   * Check if device has internet connectivity
   */
  static async isOnline(): Promise<boolean> {
    try {
      const result = await HekaPrint.checkNetworkStatus();
      return result.isOnline;
    } catch {
      // Fallback: check via navigator
      return navigator.onLine;
    }
  }

  /**
   * Generate PDF from HTML pages (works offline)
   * @param pages Array of HTML strings (one per page)
   * @param orientation 'portrait' or 'landscape'
   * @param paperSize Paper size ('A4', 'A3', 'Letter', 'Legal')
   * @returns PDF file path and metadata
   */
  static async generatePDF(
    pages: string[],
    orientation: Orientation = 'portrait',
    paperSize: PaperSize = 'A4',
    saveToDownloads: boolean = true,
    onProgress?: (event: { currentPage: number; totalPages: number; progress: number }) => void
  ): Promise<PDFResult> {
    let listener: PluginListenerHandle | null = null;
    if (onProgress) {
      listener = HekaPrint.addListener('pdfProgress', onProgress);
    }
    try {
      const result = await HekaPrint.generatePDF({
        pages,
        paperSize,
        orientation,
        template: 'calendar',
        margins: 'none',
        filename: `HEKA_Calendar_${new Date().getFullYear()}`,
        saveToDownloads
      });
      return result;
    } catch (error) {
      console.error('[PrintManager] PDF generation failed:', error);
      throw error;
    } finally {
      listener?.remove();
    }
  }

  /**
   * Print an existing PDF file (requires network)
   * @param filePath Path to the PDF file
   * @param orientation Page orientation ('portrait' or 'landscape')
   * @param paperSize Paper size ('A4', 'A3', 'Letter', 'Legal')
   */
  static async printPDF(filePath: string, orientation: Orientation = 'portrait', paperSize: PaperSize = 'A4'): Promise<void> {
    
    try {
      await HekaPrint.printPDF({ filePath, orientation, paperSize });
    } catch (error) {
      console.error('[PrintManager] Print failed:', error);

      // Handle specific error codes
      if (getErrorMessage(error).includes('PRINT_NETWORK_REQUIRED') ||
          getErrorCode(error) === 'PRINT_NETWORK_REQUIRED') {
        throw new Error('Network connection required for printing', { cause: error });
      }
      
      throw error;
    }
  }

  /**
   * Open PDF with system PDF viewer (works offline)
   * @param filePath Path to the PDF file
   * @param filename Optional display name
   */
  static async openPDF(filePath: string, filename?: string): Promise<void> {
    
    try {
      await HekaPrint.openPDF({ filePath, filename });
    } catch (error) {
      console.error('[PrintManager] Open failed:', error);
      throw error;
    }
  }

  /**
   * Share PDF via system share sheet (works offline)
   * @param filePath Path to the PDF file
   * @param filename Optional display name
   */
  static async sharePDF(filePath: string, filename?: string): Promise<void> {
    
    try {
      await HekaPrint.sharePDF({ filePath, filename });
    } catch (error) {
      console.error('[PrintManager] Share failed:', error);
      throw error;
    }
  }

  /**
   * Legacy method - generates PDF and optionally prints
   * @param pages Array of HTML strings
   * @param orientation Page orientation
   * @param autoPrint If true, attempts to print (requires network). If false, just generates PDF.
   */
  static async printCalendar(
    pages: string[], 
    orientation: Orientation = 'portrait',
    autoPrint: boolean = false
  ): Promise<PDFResult> {
    // Step 1: Generate PDF (works offline)
    const pdfResult = await this.generatePDF(pages, orientation);
    
    // Step 2: If autoPrint is true and online, try to print
    if (autoPrint) {
      const isOnline = await this.isOnline();
      if (isOnline) {
        try {
          await this.printPDF(pdfResult.filePath);
        } catch {
          // If print fails, at least we have the PDF
          console.warn('[PrintManager] Auto-print failed, PDF saved:', pdfResult.filePath);
        }
      }
    }
    
    return pdfResult;
  }
}

// Re-export for convenience
export { HekaPrint };
