/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ROUTINE SHARED UTILITIES
 * Helpers used across RoutineBuilder, RoutineUploader, and steps.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { hekaToCivil } from '../../services/calendarService';
import type { HekaDate, NoteCategory } from '../../types';

/** Convert "HH:MM" to minutes since midnight. Returns 0 for invalid input. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return 0;
  return h * 60 + m;
}

/** Convert minutes since midnight to "HH:MM". */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/** Add days to a HekaDate. */
export function addDaysToHekaDate(hekaDate: HekaDate, days: number): HekaDate {
  const civil = hekaToCivil(hekaDate);
  civil.setDate(civil.getDate() + days);
  return {
    year: civil.getFullYear(),
    month: civil.getMonth() as HekaDate['month'],
    day: civil.getDate(),
  };
}

/** Parse ISO date string (YYYY-MM-DD) to HekaDate. */
export function hekaDateFromISO(iso: string): HekaDate {
  const d = new Date(iso + 'T00:00:00');
  return {
    year: d.getFullYear(),
    month: d.getMonth() as HekaDate['month'],
    day: d.getDate(),
  };
}

/** Get day of week (0=Sunday) for a HekaDate. */
export function getDayOfWeek(hekaDate: HekaDate): number {
  const civil = hekaToCivil(hekaDate);
  return civil.getDay();
}

/** Calculate days to add to reach a target day of week (0=Sunday). */
export function daysToTargetDayOfWeek(startDate: HekaDate, targetDayOfWeek: number): number {
  const startDow = getDayOfWeek(startDate);
  return (targetDayOfWeek - startDow + 7) % 7;
}

/** Color for each note category. */
export function getCategoryColor(cat: NoteCategory): string {
  const map: Record<NoteCategory, string> = {
    personal: '#3b82f6',
    work: '#8b5cf6',
    spiritual: '#f59e0b',
    family: '#ec4899',
    health: '#22c55e',
    creative: '#06b6d4',
    general: '#6b7280',
  };
  return map[cat] || '#8b5cf6';
}

/** Derive sleep hours from bedtime and wake time. */
export function calculateSleepHours(bedtime: string, wakeTime: string): number {
  const bed = timeToMinutes(bedtime);
  const wake = timeToMinutes(wakeTime);
  if (bed === 0 && wake === 0) return 8;
  const mins = bed >= wake
    ? (1440 - bed) + wake  // wraps midnight
    : wake - bed;          // same day
  return Math.round((mins / 60) * 10) / 10;
}

/** Format duration in weeks to human-readable label. */
export function durationLabel(weeks: number): string {
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''}`;
  if (weeks < 52) return `${Math.round(weeks / 4 * 10) / 10} months`;
  return `${Math.round(weeks / 52 * 10) / 10} year${weeks !== 52 ? 's' : ''}`;
}
