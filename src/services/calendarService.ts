/**
 * Calendar Service - Pure Functions for HEKA Calendar Calculations
 * No side effects, no DOM manipulation - just pure logic
 */

import type { HekaDate, HekaMonthIndex, ArcType, MonthInfo, CalendarDay, MoonPhaseData } from '../types';

// ============================================================================
// Constants
// ============================================================================

export const HEKA_MONTHS: MonthInfo[] = [
  { index: 0, name: 'April', civilHint: 'Apr', arc: 'OPENING' },
  { index: 1, name: 'May', civilHint: 'May', arc: 'CORE' },
  { index: 2, name: 'June', civilHint: 'Jun', arc: 'CORE' },
  { index: 3, name: 'July', civilHint: 'Jul', arc: 'CORE' },
  { index: 4, name: 'August', civilHint: 'Aug', arc: 'CORE' },
  { index: 5, name: 'Hexa', civilHint: 'Aug/Sep', arc: 'CORE' },
  { index: 6, name: 'September', civilHint: 'Sep', arc: 'CORE' },
  { index: 7, name: 'October', civilHint: 'Oct', arc: 'CORE' },
  { index: 8, name: 'November', civilHint: 'Nov', arc: 'CORE' },
  { index: 9, name: 'December', civilHint: 'Dec', arc: 'CORE' },
  { index: 10, name: 'January', civilHint: 'Jan', arc: 'CLOSING' },
  { index: 11, name: 'February', civilHint: 'Feb', arc: 'CLOSING' },
  { index: 12, name: 'March', civilHint: 'Mar', arc: 'CLOSING' },
];

export const DAYS_IN_WEEK = 7;
export const MONTHS_IN_YEAR = 13;

// ============================================================================
// Time Mode Configuration (SYNC vs TRUE)
// ============================================================================

export type TimeMode = 'SYNC' | 'TRUE';

let currentTimeMode: TimeMode = 'SYNC';

export function setTimeMode(mode: TimeMode): void {
  currentTimeMode = mode;
}

export function getTimeMode(): TimeMode {
  return currentTimeMode;
}

// ============================================================================
// Leap Year / March Length Rules
// ============================================================================

/**
 * Check if a Gregorian year is a leap year
 */
export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * TRUE Mode: March correction happens every 4 years EXCEPT the 128th year
 * This is the "4-year, except 128th" rule mentioned in the requirements
 * 
 * Years in TRUE mode are numbered from a base year.
 * March gets 30 days on correction years, 29 otherwise.
 */
function isTrueModeMarchCorrection(hekaYear: number): boolean {
  // In TRUE mode, March correction happens every 4 years
  // EXCEPT every 128th year (which keeps 29 days)
  // This creates a mean year length of ~365.2422 days (very close to tropical year)
  
  // Calculate years since base (year 0 = first HEKA year)
  // Correction years: 3, 7, 11, 15... (every 4 years, 0-indexed)
  // Skip corrections on years 127, 255, 383... (every 128 years)
  
  const yearIndex = hekaYear >= 0 ? hekaYear : hekaYear + 1; // Handle negative years
  const isFourthYear = (yearIndex % 4) === 3;
  const is128thYear = (yearIndex % 128) === 127;
  
  return isFourthYear && !is128thYear;
}

/**
 * SYNC Mode: Align with Gregorian calendar
 * HEKA year N has leap March when Gregorian year N+1 is a leap year
 */
function isSyncModeMarchCorrection(hekaYear: number): boolean {
  // HEKA year runs Apr 1 (heYear) -> Apr 1 (heYear + 1)
  // Add March 30 only when Feb 29 happens inside that interval
  return isGregorianLeapYear(hekaYear + 1);
}

/**
 * Check if HEKA year has a leap March (30 days instead of 29)
 */
export function isHekaLeapMarch(hekaYear: number): boolean {
  if (currentTimeMode === 'TRUE') {
    return isTrueModeMarchCorrection(hekaYear);
  }
  return isSyncModeMarchCorrection(hekaYear);
}

/**
 * Get March length for a HEKA year (29 or 30 days)
 */
export function getMarchLength(hekaYear: number): number {
  return isHekaLeapMarch(hekaYear) ? 30 : 29;
}

// ============================================================================
// Year Start Calculations
// ============================================================================

/**
 * TRUE Mode: Year starts are calculated independently of Gregorian
 * We establish a base alignment and calculate cumulative drift
 */
function getTrueModeYearStart(hekaYear: number): Date {
  // Base alignment: HEKA year 2026 starts on April 1, 2026 (Gregorian)
  const BASE_HEKA_YEAR = 2026;
  const BASE_GREGORIAN_YEAR = 2026;
  const BASE_GREGORIAN_MONTH = 3; // April (0-indexed)
  const BASE_GREGORIAN_DAY = 1;
  
  // Calculate days offset from base year
  let daysOffset = 0;
  
  if (hekaYear >= BASE_HEKA_YEAR) {
    for (let y = BASE_HEKA_YEAR; y < hekaYear; y++) {
      daysOffset += isHekaLeapMarch(y) ? 366 : 365;
    }
  } else {
    for (let y = hekaYear; y < BASE_HEKA_YEAR; y++) {
      daysOffset -= isHekaLeapMarch(y) ? 366 : 365;
    }
  }
  
  const baseDate = new Date(BASE_GREGORIAN_YEAR, BASE_GREGORIAN_MONTH, BASE_GREGORIAN_DAY);
  const result = new Date(baseDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
  return result;
}

/**
 * SYNC Mode: Year starts align with Gregorian April 1
 */
function getSyncModeYearStart(hekaYear: number): Date {
  return new Date(hekaYear, 3, 1); // April 1 of the HEKA year
}

/**
 * Get the start of a HEKA year (April 1 in Gregorian terms)
 */
export function getHekaYearStart(hekaYear: number): Date {
  if (currentTimeMode === 'TRUE') {
    return getTrueModeYearStart(hekaYear);
  }
  return getSyncModeYearStart(hekaYear);
}

// ============================================================================
// Pure Functions - Calendar Calculations
// ============================================================================

/**
 * Get the HEKA year label for display
 */
export function getHekaYearLabel(hekaYear: number, monthIndex: number): string {
  const arc = getArcType(monthIndex as HekaMonthIndex);
  
  if (arc === 'OPENING' || arc === 'CORE') {
    return String(hekaYear);
  }
  
  return `${hekaYear}–${hekaYear + 1}`;
}

/**
 * Get civil date for the first day of a HEKA month
 */
export function getCivilStartOfHekaMonth(hekaYear: number, monthIndex: number): Date {
  const yearStart = getHekaYearStart(hekaYear);
  
  let daysToAdd = 0;
  for (let i = 0; i < monthIndex; i++) {
    daysToAdd += getDaysInMonth(hekaYear, i as HekaMonthIndex);
  }
  
  const result = new Date(yearStart);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

/**
 * Get number of days in a HEKA month
 * All months have 28 days except March (29 or 30)
 */
export function getDaysInMonth(hekaYear: number, monthIndex: HekaMonthIndex): number {
  if (monthIndex === 12) {
    return getMarchLength(hekaYear);
  }
  
  return 28;
}

/**
 * Convert HEKA date to civil (Gregorian) date
 */
export function hekaToCivil(hekaDate: HekaDate): Date {
  const monthStart = getCivilStartOfHekaMonth(hekaDate.year, hekaDate.month);
  const result = new Date(monthStart);
  result.setDate(result.getDate() + hekaDate.day - 1);
  return result;
}

/**
 * Convert civil date to HEKA date
 */
export function civilToHeka(civilDate: Date): HekaDate | null {
  // Find which HEKA year this date falls into
  // Start with an approximation based on the year
  let hekaYear = civilDate.getMonth() < 3 ? civilDate.getFullYear() - 1 : civilDate.getFullYear();
  
  // Search backwards and forwards to find the correct year
  for (let offset = -2; offset <= 2; offset++) {
    const testYear = hekaYear + offset;
    const yearStart = getHekaYearStart(testYear);
    const yearEnd = new Date(getHekaYearStart(testYear + 1).getTime() - 24 * 60 * 60 * 1000);
    
    if (civilDate >= yearStart && civilDate <= yearEnd) {
      // Found the year, now find the month
      for (let m = 0; m < 13; m++) {
        const monthStart = getCivilStartOfHekaMonth(testYear, m);
        const monthEnd = new Date(
          getCivilStartOfHekaMonth(testYear, m + 1 < 13 ? m + 1 : 0).getTime() - 
          (m === 12 ? 0 : 24 * 60 * 60 * 1000)
        );
        
        // For March, use proper end calculation
        if (m === 12) {
          const marchLength = getDaysInMonth(testYear, 12 as HekaMonthIndex);
          monthEnd.setTime(monthStart.getTime() + (marchLength - 1) * 24 * 60 * 60 * 1000);
        }
        
        if (civilDate >= monthStart && civilDate <= monthEnd) {
          const dayDiff = Math.floor((civilDate.getTime() - monthStart.getTime()) / (1000 * 60 * 60 * 24));
          return { year: testYear, month: m as HekaMonthIndex, day: dayDiff + 1 };
        }
      }
    }
  }
  
  return null;
}

/**
 * Get day of week (0=Sunday, 6=Saturday) for a HEKA date
 */
export function getDayOfWeek(hekaDate: HekaDate): number {
  const civil = hekaToCivil(hekaDate);
  return civil.getDay();
}

/**
 * Get the first day of the week's position (Saturday-start)
 * Returns 0-6 where 0 is Saturday
 */
export function getSaturdayStartOffset(hekaDate: HekaDate): number {
  const dow = getDayOfWeek(hekaDate);
  return (dow + 1) % 7;
}

/**
 * Get arc type for a month
 */
export function getArcType(monthIndex: HekaMonthIndex): ArcType {
  if (monthIndex === 0) return 'OPENING';
  if (monthIndex >= 10) return 'CLOSING';
  return 'CORE';
}

/**
 * Get arc label for display
 */
export function getArcLabel(monthIndex: HekaMonthIndex): string {
  const arc = getArcType(monthIndex);
  const labels: Record<ArcType, string> = {
    OPENING: 'Opening Arc',
    CORE: 'Core Arc',
    CLOSING: 'Closing Arc',
  };
  return labels[arc];
}

/**
 * Get arc note for display
 */
export function getArcNote(monthIndex: HekaMonthIndex): string {
  if (monthIndex === 0) return 'Year opens Apr 1';
  if (monthIndex >= 10) return 'Closing arc runs Jan to Mar';
  return 'Core arc runs May to Dec';
}

// ============================================================================
// Month Grid Generation
// ============================================================================

export interface MonthGridOptions {
  includeToday?: boolean;
  todayCivil?: Date;
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Generate the complete month grid including blank cells
 * Returns array of 35-42 cells (5-6 weeks)
 */
export function generateMonthGrid(
  hekaYear: number,
  monthIndex: HekaMonthIndex,
  options: MonthGridOptions = {}
): CalendarDay[] {
  const daysInMonth = getDaysInMonth(hekaYear, monthIndex);
  const firstDayCivil = getCivilStartOfHekaMonth(hekaYear, monthIndex);
  const firstDayOffset = (firstDayCivil.getDay() + 1) % 7; // Saturday-start
  
  const today = options.todayCivil ? stripTime(options.todayCivil) : stripTime(new Date());
  const grid: CalendarDay[] = [];
  
  // Leading blank cells
  for (let i = 0; i < firstDayOffset; i++) {
    const blankCivil = new Date(firstDayCivil);
    blankCivil.setDate(blankCivil.getDate() - (firstDayOffset - i));
    
    grid.push({
      hekaDate: { year: hekaYear, month: monthIndex, day: 0 },
      civilDate: blankCivil,
      moonPhase: '',
      isToday: false,
      isHoliday: false,
      hasNote: false,
    });
  }
  
  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const civilDate = new Date(firstDayCivil);
    civilDate.setDate(civilDate.getDate() + day - 1);
    
    grid.push({
      hekaDate: { year: hekaYear, month: monthIndex, day },
      civilDate,
      moonPhase: calculateMoonPhase(civilDate),
      isToday: stripTime(civilDate).getTime() === today.getTime(),
      isHoliday: false,
      hasNote: false,
    });
  }
  
  // Trailing cells to complete the grid
  const remainingCells = (7 - (grid.length % 7)) % 7;
  const lastDay = hekaToCivil({ year: hekaYear, month: monthIndex, day: daysInMonth });
  
  for (let i = 1; i <= remainingCells; i++) {
    const nextCivil = new Date(lastDay);
    nextCivil.setDate(nextCivil.getDate() + i);
    
    grid.push({
      hekaDate: { year: hekaYear, month: monthIndex, day: 0 },
      civilDate: nextCivil,
      moonPhase: '',
      isToday: false,
      isHoliday: false,
      hasNote: false,
    });
  }
  
  return grid;
}

// ============================================================================
// Moon Phase Calculations
// ============================================================================

export function calculateMoonPhase(date: Date): string {
  return getDetailedMoonPhase(date).glyph;
}

export function getDetailedMoonPhase(date: Date, hemisphere: 'N' | 'S' = 'S'): MoonPhaseData {
  const synodicMonth = 29.53059;
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const daysSinceKnown = (utcDate.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  
  let moonAge = daysSinceKnown % synodicMonth;
  if (moonAge < 0) moonAge += synodicMonth;
  
  const illumination = (1 - Math.cos((moonAge / synodicMonth) * 2 * Math.PI)) / 2 * 100;
  
  let phase: string;
  let glyph: string;
  let waxing: boolean;
  
  if (moonAge < 1) {
    phase = 'New Moon';
    glyph = '🌑';
    waxing = true;
  } else if (moonAge < 6.5) {
    phase = 'Waxing Crescent';
    glyph = hemisphere === 'N' ? '🌒' : '🌘';
    waxing = true;
  } else if (moonAge < 8.5) {
    phase = 'First Quarter';
    glyph = hemisphere === 'N' ? '🌓' : '🌗';
    waxing = true;
  } else if (moonAge < 13.5) {
    phase = 'Waxing Gibbous';
    glyph = hemisphere === 'N' ? '🌔' : '🌖';
    waxing = true;
  } else if (moonAge < 16) {
    phase = 'Full Moon';
    glyph = '🌕';
    waxing = false;
  } else if (moonAge < 21) {
    phase = 'Waning Gibbous';
    glyph = hemisphere === 'N' ? '🌖' : '🌔';
    waxing = false;
  } else if (moonAge < 23) {
    phase = 'Last Quarter';
    glyph = hemisphere === 'N' ? '🌗' : '🌓';
    waxing = false;
  } else if (moonAge < 28) {
    phase = 'Waning Crescent';
    glyph = hemisphere === 'N' ? '🌘' : '🌒';
    waxing = false;
  } else {
    phase = 'New Moon';
    glyph = '🌑';
    waxing = true;
  }
  
  let nextPhase: string;
  let daysToNext: number;
  
  if (moonAge < 1) {
    nextPhase = 'First Quarter';
    daysToNext = 7 - moonAge;
  } else if (moonAge < 7) {
    nextPhase = waxing ? 'Full Moon' : 'New Moon';
    daysToNext = (waxing ? 14.765 : synodicMonth) - moonAge;
  } else if (moonAge < 14.765) {
    nextPhase = waxing ? 'Full Moon' : 'New Moon';
    daysToNext = (waxing ? 14.765 : synodicMonth) - moonAge;
  } else if (moonAge < 22) {
    nextPhase = 'New Moon';
    daysToNext = synodicMonth - moonAge;
  } else {
    nextPhase = 'New Moon';
    daysToNext = synodicMonth - moonAge;
  }
  
  const nextPhaseDate = new Date(date.getTime() + daysToNext * 24 * 60 * 60 * 1000);
  
  return {
    phase,
    glyph,
    illumination: Math.round(illumination),
    age: parseFloat(moonAge.toFixed(1)),
    waxing,
    nextPhase,
    nextPhaseDate,
    hemisphere,
  };
}

// ============================================================================
// Date Formatting with Timezone Support
// ============================================================================

export function formatCivilDate(date: Date, timezone?: string, short = false): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  let displayDate = date;
  if (timezone && timezone !== 'UTC') {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
      const parts = formatter.formatToParts(date);
      const year = parts.find(p => p.type === 'year')?.value;
      const month = parts.find(p => p.type === 'month')?.value;
      const day = parts.find(p => p.type === 'day')?.value;
      if (year && month && day) {
        displayDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    } catch {
      // Fallback to original date
    }
  }
  
  if (short) {
    return `${displayDate.getDate()} ${months[displayDate.getMonth()]}`;
  }
  return `${displayDate.getDate()} ${months[displayDate.getMonth()]} ${displayDate.getFullYear()}`;
}

export function formatCivilDateWithDay(date: Date, timezone?: string): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const base = formatCivilDate(date, timezone, false);
  return `${days[date.getDay()]}, ${base}`;
}

// ============================================================================
// Storage and Utility
// ============================================================================

export function getNoteKey(hekaYear: number, monthIndex: number, day?: number): string {
  if (day !== undefined) {
    return `heka:${hekaYear}:${monthIndex}:${day}`;
  }
  return `heka:${hekaYear}:${monthIndex}`;
}

/**
 * Get today's HEKA date
 */
export function getTodayHekaDate(): HekaDate {
  const today = new Date();
  const heka = civilToHeka(today);
  if (heka) return heka;
  
  // Fallback
  const year = today.getMonth() < 3 ? today.getFullYear() - 1 : today.getFullYear();
  return { year, month: 0, day: 1 };
}

/**
 * Get today's HEKA date for a specific timezone
 */
export function getTodayHekaDateInTimezone(timezone: string): HekaDate {
  const now = new Date();
  
  let localDate: Date;
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const parts = formatter.formatToParts(now);
    const year = parseInt(parts.find(p => p.type === 'year')?.value || '0');
    const month = parseInt(parts.find(p => p.type === 'month')?.value || '1') - 1;
    const day = parseInt(parts.find(p => p.type === 'day')?.value || '1');
    localDate = new Date(year, month, day);
  } catch {
    localDate = now;
  }
  
  const heka = civilToHeka(localDate);
  if (heka) return heka;
  
  const hekaYear = localDate.getMonth() < 3 ? localDate.getFullYear() - 1 : localDate.getFullYear();
  return { year: hekaYear, month: 0, day: 1 };
}
