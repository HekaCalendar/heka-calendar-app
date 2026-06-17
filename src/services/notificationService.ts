/**
 * Notification Service
 * Handles browser and native app notifications for calendar events and notes
 */

import type { NoteData, HekaMonthIndex } from '../types';
import { NotificationEngine } from './notificationEngine';
import { NOTIFICATION_ID_RANGES } from '../types/notifications';
import { hekaToCivil } from './calendarService';

interface CapacitorWindow {
  Capacitor?: {
    getPlatform?: () => string;
  };
}

// Check if running in Capacitor native app
const IS_NATIVE_APP = typeof (window as unknown as CapacitorWindow).Capacitor !== 'undefined';

// Import the plugin directly
import { LocalNotifications, type PendingLocalNotificationSchema } from '@capacitor/local-notifications';

// Check if native plugin methods are available
function isNativePluginAvailable(): boolean {
  if (!IS_NATIVE_APP) return false;
  try {
    // Check if we can call a method on the plugin
    return typeof LocalNotifications.requestPermissions === 'function';
  } catch {
    return false;
  }
}

// Notification permission type (browser standard)
export type NotificationPermissionType = 'granted' | 'denied' | 'default';



/**
 * Request notification permission from the user
 * Handles both browser and native app notification permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
  
  // Try native plugin first on Android
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      
      // Check current permission
      const checkResult = await LocalNotifications.checkPermissions();
      
      if (checkResult.display === 'granted') {
        return true;
      }
      
      // Request permission
      const result = await LocalNotifications.requestPermissions();
      return result.display === 'granted';
    } catch (error) {
      console.error('[NOTIFY] Native plugin error:', error);
      // Do NOT fall through to web API in native app — prevents duplicate prompt
      return false;
    }
  }
  
  // Native app but plugin not available — do not use web API
  if (IS_NATIVE_APP) {
    return false;
  }
  
  // Web / fallback path
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('[NOTIFY] Web permission error:', error);
    return false;
  }
}

/**
 * Check if notification permission is granted
 */
export async function hasNotificationPermission(): Promise<boolean> {
  // Try native plugin first on Android
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      const { display } = await LocalNotifications.checkPermissions();
      return display === 'granted';
    } catch (error) {
      console.error('[NOTIFY] Native check error:', error);
      // Fall through to web
    }
  }
  
  // Browser / fallback path
  return 'Notification' in window && Notification.permission === 'granted';
}

/**
 * Get current notification permission status
 */
export async function getNotificationPermission(): Promise<NotificationPermissionType | 'prompt' | null> {
  // Try native plugin first on Android
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      const { display } = await LocalNotifications.checkPermissions();
      if (display === 'granted') return 'granted';
      if (display === 'denied') return 'denied';
      return 'prompt';
    } catch (error) {
      console.error('[NOTIFY] Native check error:', error);
      // Fall through to web
    }
  }
  
  // Browser / fallback path
  if (!('Notification' in window)) {
    return null;
  }
  return Notification.permission as NotificationPermissionType;
}

/**
 * Send a notification (browser only - for immediate display)
 * For native apps, use scheduleNotification instead
 */
export function sendNotification(title: string, options?: NotificationOptions): Notification | null {
  if (IS_NATIVE_APP) {
    return null;
  }
  
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return null;
  }

  const defaultOptions: NotificationOptions = {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'heka-calendar',
    requireInteraction: false,
  };

  return new Notification(title, { ...defaultOptions, ...options });
}

/**
 * Schedule a local notification for a specific date/time
 * Works in both native apps and browser (browser uses setTimeout)
 * @deprecated Dead code — no callers in the entire codebase. Use NotificationEngine.schedule() instead.
 */
export async function scheduleNotification(
  title: string,
  body: string,
  date: Date,
  options?: { id?: number; extra?: Record<string, unknown> }
): Promise<string | null> {
  const notificationId = options?.id || Math.floor(Math.random() * 100000);
  
  // Native app path - use Capacitor Local Notifications
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      // Check permission
      const { display } = await LocalNotifications.checkPermissions();
      if (display !== 'granted') {
        return null;
      }
      
      // Schedule the notification
      await LocalNotifications.schedule({
        notifications: [{
          id: notificationId,
          title,
          body,
          schedule: { at: date },
          smallIcon: 'ic_notification',
          iconColor: '#c9a227',
          extra: options?.extra || {},
        }]
      });
      
      return String(notificationId);
    } catch (error) {
      console.error('Error scheduling native notification:', error);
      return null;
    }
  }
  
  // Browser path - use setTimeout (limited to page lifetime)
  const now = new Date().getTime();
  const targetTime = date.getTime();
  const delay = targetTime - now;

  if (delay <= 0) {
    // If time has passed, send immediately
    sendNotification(title, { body, ...options });
    return String(notificationId);
  }

  // Note: This will only work while the page is open
  setTimeout(() => {
    sendNotification(title, { body, ...options });
  }, delay);

  return String(notificationId);
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(id: string): Promise<boolean> {
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: parseInt(id) }] });
      return true;
    } catch (error) {
      console.error('Error canceling notification:', error);
      return false;
    }
  }
  
  // Browser path - can't cancel setTimeout, just return true
  return true;
}

/**
 * Stable hash of a string into a notification ID within a given range.
 * Prevents collisions from truncated UUIDs.
 */
function hashToNotificationId(str: string, min: number, max: number): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return min + (Math.abs(hash) % (max - min));
}

/**
 * Schedule a notification for a note/reminder
 * Routes through the unified NotificationEngine for dedup, caps, and quiet hours.
 */
export async function scheduleNoteReminder(
  note: NoteData,
  dayKey: string,
  reminderTime?: Date
): Promise<string | null> {
  const title = 'HEKA Calendar Reminder';
  const body = note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');

  // If no reminder time specified, schedule for 9 AM on that day
  const targetTime = reminderTime || new Date(note.createdAt);

  const range = NOTIFICATION_ID_RANGES.calendar;
  const id = hashToNotificationId(note.id, range.min, range.max);

  return NotificationEngine.schedule({
    type: 'note-reminder',
    tier: 'standard',
    title,
    body,
    scheduleAt: targetTime,
    section: 'calendar',
    id,
    extra: { noteId: note.id, dayKey },
  });
}

/**
 * Schedule notifications for all notes in the calendar
 * Call this when the app loads (native apps will persist these)
 */
export async function syncNoteNotifications(notes: Record<string, NoteData[]>): Promise<void> {
  // For native apps, we schedule persistent notifications
  // For browsers, we can only set timeouts (lost on page refresh)
  
  const now = new Date();
  
  // Schedule notifications for days with notes
  for (const [dayKey, dayNotes] of Object.entries(notes)) {
    if (dayNotes.length === 0) continue;

    // Get the date from the note key (heka:year:month:day)
    const parts = dayKey.split(':');
    if (parts.length !== 4) continue;

    const year = parseInt(parts[1]);
    const month = parseInt(parts[2]);
    const day = parseInt(parts[3]);

    // Convert HEKA date to civil calendar for accurate scheduling
    const civilDate = hekaToCivil({ year, month: month as HekaMonthIndex, day });
    civilDate.setHours(9, 0, 0, 0); // 9 AM reminder
    
    // Only schedule if date is in the future
    if (civilDate > now) {
      const noteCount = dayNotes.length;
      const title = noteCount === 1 
        ? 'HEKA Calendar: 1 note today'
        : `HEKA Calendar: ${noteCount} notes today`;
      
      const body = dayNotes[0].content.substring(0, 60) + 
        (dayNotes[0].content.length > 60 ? '...' : '') +
        (noteCount > 1 ? ` (+${noteCount - 1} more)` : '');

      await NotificationEngine.schedule({
        type: 'note-reminder',
        tier: 'standard',
        title,
        body,
        scheduleAt: civilDate,
        section: 'calendar',
        id: parseInt(`${year}${month}${day}`),
        extra: { dayKey, noteCount }
      });
    }
  }
}

/**
 * Get all pending notifications (native apps only)
 */
export async function getPendingNotifications(): Promise<PendingLocalNotificationSchema[]> {
  if (!IS_NATIVE_APP || !isNativePluginAvailable()) return [];
  
  try {
    const { notifications } = await LocalNotifications.getPending();
    return notifications || [];
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return [];
  }
}

/**
 * Cancel all scheduled notifications that are NOT managed by the NotificationEngine.
 * Engine-managed notifications (daily briefing, streak saver, etc.) are preserved.
 */
export async function cancelAllNotifications(): Promise<boolean> {
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      const { notifications } = await LocalNotifications.getPending();
      if (notifications && notifications.length > 0) {
        // Filter out engine-managed notifications (they have _engineType in extra)
        const nonEngineNotifications = notifications.filter(
          (n) => !n.extra?._engineType
        );
        if (nonEngineNotifications.length > 0) {
          await LocalNotifications.cancel({ notifications: nonEngineNotifications });
        }
      }
      return true;
    } catch (error) {
      console.error('Error canceling all notifications:', error);
      return false;
    }
  }

  return true;
}

/**
 * Test notification - sends immediately if permission granted
 * Uses the unified engine with a reserved test ID (999999) to avoid collisions.
 */
export async function testNotification(): Promise<void> {
  const TEST_NOTIFICATION_ID = 999999;

  await NotificationEngine.schedule({
    type: 'test-notification',
    tier: 'standard',
    title: 'HEKA Calendar',
    body: "Notifications are working! You'll be reminded of your notes.",
    scheduleAt: new Date(Date.now() + 1000),
    section: 'calendar',
    id: TEST_NOTIFICATION_ID,
    replaceExisting: true,
    extra: { context: 'test' },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLANNER TASK NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

import type { PlannerTask } from '../types';

/**
 * Schedule a reminder notification for a planner task.
 * Returns the notification ID if scheduled successfully.
 */
export async function scheduleTaskReminder(task: PlannerTask): Promise<string | null> {
  if (!task.dueDateTime) return null;

  const due = new Date(task.dueDateTime);
  const remindAt = new Date(due.getTime() - task.reminderMinutesBefore * 60 * 1000);

  // Don't schedule if reminder time has already passed
  if (remindAt.getTime() <= Date.now()) {
    return null;
  }

  const notificationId = parseInt(task.id.replace(/\D/g, '').slice(0, 8), 10) || Math.floor(Math.random() * 100000);

  return NotificationEngine.schedule({
    type: 'task-reminder',
    tier: 'core',
    title: 'HEKA Intention',
    body: `"${task.content.substring(0, 60)}${task.content.length > 60 ? '...' : ''}" is in ${task.reminderMinutesBefore} minutes.`,
    scheduleAt: remindAt,
    section: 'planner',
    id: notificationId,
    replaceExisting: true,
    extra: {
      type: 'task-reminder',
      taskId: task.id,
      dayKey: task.dayKey,
    },
  });
}

/**
 * Cancel a task reminder by notification ID.
 */
export async function cancelTaskReminder(notificationId: string): Promise<boolean> {
  return cancelNotification(notificationId);
}

/**
 * Reconcile notifications for all incomplete planner tasks.
 * Ensures every future task has a scheduled reminder, and removes stale ones.
 */
export async function reconcileTaskNotifications(tasksByDay: Record<string, PlannerTask[]>): Promise<void> {
  try {
    let pendingTaskIds: Set<string>;

    if (IS_NATIVE_APP && isNativePluginAvailable()) {
      const pending = await getPendingNotifications();
      pendingTaskIds = new Set(
        pending
          .filter((n) => n.extra?.type === 'task-reminder')
          .map((n) => n.extra?.taskId as string)
      );
    } else {
      // Web: use engine's tracked web notifications
      const webMeta = NotificationEngine.getWebScheduledMeta();
      pendingTaskIds = new Set(
        webMeta
          .filter((m) => m.type === 'task-reminder')
          .map((m) => m.taskId as string)
          .filter(Boolean)
      );
    }

    for (const dayTasks of Object.values(tasksByDay)) {
      for (const task of dayTasks) {
        const shouldHaveNotification = !!task.dueDateTime && !task.isCompleted;
        const hasNotification = task.notificationId && pendingTaskIds.has(task.id);

        if (shouldHaveNotification && !hasNotification) {
          const newId = await scheduleTaskReminder(task);
          if (newId) {
            // Update Firestore with new notificationId via plannerService
            const { db, getCurrentUser } = await import('./firebase');
            const uid = getCurrentUser()?.uid;
            if (uid && db) {
              const { doc, updateDoc } = await import('firebase/firestore');
              await updateDoc(doc(db, 'users', uid, 'plannerTasks', task.id), { notificationId: newId });
            }
          }
        }

        if (!shouldHaveNotification && hasNotification && task.notificationId) {
          await cancelTaskReminder(task.notificationId);
        }
      }
    }
  } catch (error) {
    console.error('[PlannerNotifications] Reconcile failed:', error);
  }
}
