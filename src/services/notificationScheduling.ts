/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION SCHEDULING HELPERS
 * Reads per-type custom times from user preferences and calculates schedule times.
 * Supports fixed times, weekend offsets, and astronomical event alignment.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { store } from '../store';
import type { NotificationTimeKey, CustomTimeConfig } from '../types/notifications';
import { DEFAULT_NOTIFICATION_TIME_PREFS } from '../types/notifications';

/**
 * Get the custom time config for a notification type.
 * Falls back to defaults if user hasn't customized.
 */
export function getCustomTime(key: NotificationTimeKey): CustomTimeConfig {
  const prefs = store.getState().calendar.notificationPreferences.customTimes;
  return prefs[key] || DEFAULT_NOTIFICATION_TIME_PREFS[key] || { hour: 8, minute: 0 };
}

/**
 * Calculate the next schedule time for a notification type.
 * Respects custom times, weekend offsets, and astronomical alignment.
 */
export function getNextScheduleTime(
  key: NotificationTimeKey,
  referenceDate: Date = new Date()
): Date {
  const config = getCustomTime(key);
  const now = referenceDate;
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  // Handle astronomical alignment
  if (config.alignToEvent) {
    return getAstronomicalTime(config.alignToEvent, now);
  }

  // Calculate target time
  let targetHour = config.hour;
  let targetMinute = config.minute;

  // Apply weekend offset
  if (isWeekend && config.weekendOffsetMinutes != null) {
    const totalMinutes = targetHour * 60 + targetMinute + config.weekendOffsetMinutes;
    targetHour = Math.floor(totalMinutes / 60) % 24;
    targetMinute = totalMinutes % 60;
  }

  const scheduleTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    targetHour,
    targetMinute,
    0,
    0
  );

  // If time has passed, schedule for tomorrow
  if (scheduleTime.getTime() <= now.getTime()) {
    scheduleTime.setDate(scheduleTime.getDate() + 1);
  }

  return scheduleTime;
}

/**
 * Get astronomical event time (sunrise, sunset, moonrise).
 * Falls back to approximate times if calculation fails.
 */
function getAstronomicalTime(
  event: 'sunrise' | 'sunset' | 'moonrise',
  referenceDate: Date
): Date {
  const now = referenceDate;
  const state = store.getState().calendar;
  const country = state.location || 'AU';

  // For now, use approximate times based on country
  // In a full implementation, this would use calculateSunTimes from swissCalculations
  const approximations: Record<string, Record<string, { hour: number; minute: number }>> = {
    AU: { sunrise: { hour: 6, minute: 30 }, sunset: { hour: 18, minute: 30 }, moonrise: { hour: 19, minute: 0 } },
    US: { sunrise: { hour: 6, minute: 45 }, sunset: { hour: 18, minute: 15 }, moonrise: { hour: 19, minute: 30 } },
    UK: { sunrise: { hour: 7, minute: 0 }, sunset: { hour: 17, minute: 0 }, moonrise: { hour: 18, minute: 30 } },
    DE: { sunrise: { hour: 7, minute: 15 }, sunset: { hour: 17, minute: 30 }, moonrise: { hour: 19, minute: 0 } },
    JP: { sunrise: { hour: 5, minute: 30 }, sunset: { hour: 18, minute: 0 }, moonrise: { hour: 19, minute: 30 } },
  };

  const approx = approximations[country]?.[event] || approximations.AU[event];
  const scheduleTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    approx.hour,
    approx.minute,
    0,
    0
  );

  if (scheduleTime.getTime() <= now.getTime()) {
    scheduleTime.setDate(scheduleTime.getDate() + 1);
  }

  return scheduleTime;
}

/**
 * Format a CustomTimeConfig as a human-readable string.
 */
export function formatTimeConfig(config: CustomTimeConfig): string {
  const h = config.hour;
  const m = config.minute;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  const displayM = m.toString().padStart(2, '0');

  if (config.alignToEvent) {
    return `At ${config.alignToEvent}`;
  }

  let result = `${displayH}:${displayM} ${ampm}`;

  if (config.weekendOffsetMinutes != null) {
    const offsetHours = Math.abs(config.weekendOffsetMinutes) / 60;
    const offsetSign = config.weekendOffsetMinutes > 0 ? '+' : '-';
    result += ` (${offsetSign}${offsetHours}h weekends)`;
  }

  return result;
}

/**
 * Check if it's currently within a user's focus schedule.
 * Focus schedules block ambient and standard notifications.
 */
export function isInFocusSchedule(): boolean {
  const prefs = store.getState().calendar.notificationPreferences;
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const schedule of prefs.focusSchedules) {
    if (!schedule.enabled) continue;
    if (!schedule.daysOfWeek.includes(dayOfWeek)) continue;

    const startMinutes = schedule.startHour * 60 + schedule.startMinute;
    const endMinutes = schedule.endHour * 60 + schedule.endMinute;

    // Handle overnight schedules (e.g. 21:00 - 07:00)
    if (startMinutes > endMinutes) {
      // Overnight: active from start until midnight, or midnight until end
      if (currentMinutes >= startMinutes || currentMinutes < endMinutes) {
        return true;
      }
    } else {
      // Same day
      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if user is in vacation mode.
 */
export function isVacationMode(): boolean {
  const prefs = store.getState().calendar.notificationPreferences;
  if (!prefs.vacationMode.enabled) return false;

  const today = new Date().toISOString().split('T')[0];
  if (prefs.vacationMode.untilDate && today > prefs.vacationMode.untilDate) {
    // Vacation period has expired
    return false;
  }

  return true;
}
