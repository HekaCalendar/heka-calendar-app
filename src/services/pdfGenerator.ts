/**
 * Production-Grade PDF Generator for HEKA Calendar
 * Uses html2canvas + jsPDF for client-side PDF generation
 */

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
// Import available if needed for type checking
// import type { PrintOptions } from '../types';

export interface PDFGenerationOptions {
  filename: string;
  paperSize: 'A4' | 'Letter' | 'A3';
  orientation: 'portrait' | 'landscape';
  quality: number; // 0.5 - 2.0 scale factor for html2canvas
}

/**
 * Generate PDF from HTML element
 */
export async function generatePDF(
  element: HTMLElement,
  options: PDFGenerationOptions
): Promise<Blob> {
  try {
    const { paperSize, orientation, quality } = options;
    
    // Page dimensions in mm
    const dimensions = {
      A4: { width: 210, height: 297 },
      Letter: { width: 216, height: 279 },
      A3: { width: 297, height: 420 }
    };
    
    const pageDims = dimensions[paperSize];
    const pageWidth = orientation === 'landscape' ? pageDims.height : pageDims.width;
    const pageHeight = orientation === 'landscape' ? pageDims.width : pageDims.height;
    
    // Create PDF
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: paperSize.toLowerCase(),
      compress: true
    });
    
    // Capture each page
    const pages = element.querySelectorAll('.print-page');
    
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      
      const page = pages[i] as HTMLElement;
      
      // Render to canvas at high quality
      const canvas = await html2canvas(page, {
        scale: quality * 2, // Retina quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Force all fonts to be ready before capture
          void clonedDoc.fonts.ready;
        }
      });
      
      // Convert to image and add to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      pdf.addImage(
        imgData,
        'PNG',
        0,
        0,
        pageWidth,
        pageHeight,
        undefined,
        'FAST' // Compression
      );
    }
    
    return pdf.output('blob');
  } catch (error) {
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
}

/**
 * Generate and download PDF
 */
export async function downloadPDF(
  element: HTMLElement,
  filename: string,
  options: Partial<PDFGenerationOptions> = {}
): Promise<void> {
  try {
    const mergedOptions: PDFGenerationOptions = {
      filename,
      paperSize: 'A4',
      orientation: 'portrait',
      quality: 2,
      ...options
    };
    
    const pdfBlob = await generatePDF(element, mergedOptions);
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`PDF download failed: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
}

/**
 * Progressive PDF generation with progress callback
 * For large year documents that need progress indication
 */
export async function generatePDFWithProgress(
  elements: HTMLElement[],
  options: PDFGenerationOptions,
  onProgress: (current: number, total: number) => void
): Promise<Blob> {
  try {
    const { paperSize, orientation } = options;
    
    const dimensions = {
      A4: { width: 210, height: 297 },
      Letter: { width: 216, height: 279 },
      A3: { width: 297, height: 420 }
    };
    
    const pageDims = dimensions[paperSize];
    const pageWidth = orientation === 'landscape' ? pageDims.height : pageDims.width;
    const pageHeight = orientation === 'landscape' ? pageDims.width : pageDims.height;
    
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: paperSize.toLowerCase(),
      compress: true
    });
    
    const total = elements.length;
    
    for (let i = 0; i < total; i++) {
      if (i > 0) pdf.addPage();
      
      const canvas = await html2canvas(elements[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png', 0.95);
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      
      // Report progress
      onProgress(i + 1, total);
      
      // Yield to main thread for UI updates
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return pdf.output('blob');
  } catch (error) {
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
  }
}
