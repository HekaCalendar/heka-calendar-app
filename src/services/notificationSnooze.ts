/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SNOOZE & REMIND-ME-LATER
 * Allows users to defer notifications without losing them.
 * Tracks snooze patterns for adaptive scheduling intelligence.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { NotificationEngine } from './notificationEngine';
import { NotificationFatigue } from './notificationFatigue';
import type { NotificationRequest } from '../types/notifications';

const SNOOZE_STORAGE_KEY = 'heka-notification-snoozes';
const MAX_SNOOZES_PER_NOTIFICATION = 3;

// ── Snooze Config ────────────────────────────────────────────────────────────

export interface SnoozeDuration {
  label: string;
  minutes: number;
}

export const DEFAULT_SNOOZE_DURATIONS: SnoozeDuration[] = [
  { label: '15 minutes', minutes: 15 },
  { label: '1 hour', minutes: 60 },
  { label: 'Tonight', minutes: 240 }, // 4 hours (approx evening)
  { label: 'Tomorrow', minutes: 1440 }, // 24 hours
];

export const SNOOZE_PRESETS: Record<string, SnoozeDuration[]> = {
  'task-reminder': [
    { label: '15 min', minutes: 15 },
    { label: '1 hour', minutes: 60 },
    { label: 'Tonight', minutes: 240 },
  ],
  'streak-saver': [
    { label: '30 min', minutes: 30 },
    { label: '1 hour', minutes: 60 },
    { label: 'Before bed', minutes: 180 },
  ],
  'evening-reflection': [
    { label: '1 hour', minutes: 60 },
    { label: 'Before bed', minutes: 180 },
    { label: 'Tomorrow', minutes: 1440 },
  ],
  'daily-briefing': [
    { label: '30 min', minutes: 30 },
    { label: '1 hour', minutes: 60 },
    { label: 'Tomorrow', minutes: 1440 },
  ],
  'daily-celestial-tips': [
    { label: '1 hour', minutes: 60 },
    { label: 'Tonight', minutes: 240 },
    { label: 'Tomorrow', minutes: 1440 },
  ],
};

interface SnoozeRecord {
  originalId: string;
  originalType: string;
  snoozeCount: number;
  lastSnoozedAt: number;
  durationsUsed: number[];
}

// ── State ────────────────────────────────────────────────────────────────────

function loadSnoozes(): Record<string, SnoozeRecord> {
  try {
    const raw = localStorage.getItem(SNOOZE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('[Snooze] Failed to load snoozes:', e);
  }
  return {};
}

function saveSnoozes(snoozes: Record<string, SnoozeRecord>): void {
  try {
    localStorage.setItem(SNOOZE_STORAGE_KEY, JSON.stringify(snoozes));
  } catch (e) {
    console.error('[Snooze] Failed to save snoozes:', e);
  }
}

// ── Core ─────────────────────────────────────────────────────────────────────

/**
 * Snooze a notification by rescheduling it for later.
 * Returns the new scheduled notification ID, or null if max snoozes reached.
 */
export async function snoozeNotification(
  originalId: string,
  originalType: string,
  originalRequest: NotificationRequest,
  durationMinutes: number
): Promise<string | null> {
  const snoozes = loadSnoozes();

  // Check if max snoozes reached
  const record = snoozes[originalId] || {
    originalId,
    originalType,
    snoozeCount: 0,
    lastSnoozedAt: 0,
    durationsUsed: [],
  };

  if (record.snoozeCount >= MAX_SNOOZES_PER_NOTIFICATION) {
    console.log(`[Snooze] Max snoozes reached for ${originalType} (${originalId})`);
    return null;
  }

  // Calculate new schedule time
  const newScheduleAt = new Date(Date.now() + durationMinutes * 60000);

  // Cancel original
  await NotificationEngine.cancel(originalId);

  // Schedule new notification
  const snoozeId = await NotificationEngine.schedule({
    ...originalRequest,
    scheduleAt: newScheduleAt,
    extra: {
      ...originalRequest.extra,
      _snoozeCount: record.snoozeCount + 1,
      _originalId: originalId,
      _originalScheduleAt: originalRequest.scheduleAt.toISOString(),
    },
  });

  if (snoozeId) {
    // Update record
    record.snoozeCount++;
    record.lastSnoozedAt = Date.now();
    record.durationsUsed.push(durationMinutes);
    snoozes[originalId] = record;
    saveSnoozes(snoozes);

    // Track fatigue (snoozing is a neutral signal)
    NotificationFatigue.recordSnoozed();

    console.log(`[Snooze] ${originalType} snoozed ${durationMinutes}min. Count: ${record.snoozeCount}`);
  }

  return snoozeId;
}

/**
 * Get available snooze durations for a notification type.
 */
export function getSnoozeDurations(type: string): SnoozeDuration[] {
  return SNOOZE_PRESETS[type] || DEFAULT_SNOOZE_DURATIONS;
}

/**
 * Get snooze record for a notification (for UI display).
 */
export function getSnoozeRecord(notificationId: string): SnoozeRecord | null {
  const snoozes = loadSnoozes();
  return snoozes[notificationId] || null;
}

/**
 * Clean up old snooze records (older than 30 days).
 */
export function cleanupOldSnoozes(): void {
  const snoozes = loadSnoozes();
  const cutoff = Date.now() - 30 * 86400000;
  let cleaned = 0;

  for (const [id, record] of Object.entries(snoozes)) {
    if (record.lastSnoozedAt < cutoff) {
      delete snoozes[id];
      cleaned++;
    }
  }

  if (cleaned > 0) {
    saveSnoozes(snoozes);
    console.log(`[Snooze] Cleaned up ${cleaned} old records`);
  }
}
