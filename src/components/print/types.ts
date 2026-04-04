/**
 * Type definitions for the production print system
 */

import type { PrintTheme as DesignTokenTheme } from '../../types/printThemes';
import type { NoteData } from '../../types';

// Re-export theme type
export type { DesignTokenTheme as PrintTheme };

// Moon phase data
export interface MoonPhaseData {
  phase: string;
  glyph: string;
  illumination: number;
}

// Holiday data
export interface HolidayData {
  name: string;
  type: 'public' | 'observance' | 'religious';
}

// Day data for print rendering
export interface DayData {
  day: number;
  civilDate: Date;
  moonPhase: MoonPhaseData | null;
  holidays: HolidayData[];
  notes: NoteData[];
}

// Month data for print rendering
export interface MonthData {
  month: { name: string };
  monthIndex: number;
  monthNumber: number;
  arc: 'OPENING' | 'CORE' | 'CLOSING';
  arcLabel: string;
  days: DayData[];
  startDayOffset: number;
}

// Year data for print rendering
export interface YearData {
  year: number;
  months: MonthData[];
}

// Print job status
export type PrintJobStatus = 
  | 'queued'
  | 'generating-html'
  | 'rendering-pdf'
  | 'completed'
  | 'failed'
  | 'cancelled';

// Print job interface
export interface PrintJob {
  id: string;
  filename: string;
  status: PrintJobStatus;
  progress: number; // 0-100
  totalPages: number;
  completedPages: number;
  blob?: Blob;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

// PDF preview options
export interface PDFPreviewOptions {
  scale: number;
  currentPage: number;
  showThumbnails: boolean;
  rotation: 0 | 90 | 180 | 270;
}
