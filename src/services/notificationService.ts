/**
 * Notification Service
 * Handles browser and native app notifications for calendar events and notes
 */

import type { NoteData } from '../types';

// Check if running in Capacitor native app
const IS_NATIVE_APP = typeof (window as any).Capacitor !== 'undefined';

// Import the plugin directly
import { LocalNotifications } from '@capacitor/local-notifications';

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
  console.log('[NOTIFY] requestNotificationPermission called, IS_NATIVE_APP:', IS_NATIVE_APP);
  
  // Try native plugin first on Android
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      console.log('[NOTIFY] Using native LocalNotifications plugin');
      
      // Check current permission
      const checkResult = await LocalNotifications.checkPermissions();
      console.log('[NOTIFY] Current permission:', checkResult);
      
      if (checkResult.display === 'granted') {
        return true;
      }
      
      // Request permission
      const result = await LocalNotifications.requestPermissions();
      console.log('[NOTIFY] Permission result:', result);
      return result.display === 'granted';
    } catch (error) {
      console.error('[NOTIFY] Native plugin error:', error);
      // Fall through to web
    }
  }
  
  // Web / fallback path
  if (!('Notification' in window)) {
    console.log('[NOTIFY] Web notifications not supported');
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
    console.log('Use scheduleNotification for native app notifications');
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
 */
export async function scheduleNotification(
  title: string,
  body: string,
  date: Date,
  options?: { id?: number; extra?: any }
): Promise<string | null> {
  const notificationId = options?.id || Math.floor(Math.random() * 100000);
  
  // Native app path - use Capacitor Local Notifications
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      // Check permission
      const { display } = await LocalNotifications.checkPermissions();
      if (display !== 'granted') {
        console.log('Notification permission not granted');
        return null;
      }
      
      // Schedule the notification
      const result = await LocalNotifications.schedule({
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
      
      console.log('Native notification scheduled:', result);
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
 * Schedule a notification for a note/reminder
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
  
  return scheduleNotification(title, body, targetTime, {
    id: parseInt(note.id.replace(/\D/g, '').slice(0, 8)) || Math.floor(Math.random() * 100000),
    extra: { noteId: note.id, dayKey }
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

    // Create a date object for the HEKA date (approximate to civil calendar)
    // HEKA year starts in April
    const hekaDate = new Date(year, 3 + month, day);
    hekaDate.setHours(9, 0, 0, 0); // 9 AM reminder
    
    // Only schedule if date is in the future
    if (hekaDate > now) {
      const noteCount = dayNotes.length;
      const title = noteCount === 1 
        ? 'HEKA Calendar: 1 note today'
        : `HEKA Calendar: ${noteCount} notes today`;
      
      const body = dayNotes[0].content.substring(0, 60) + 
        (dayNotes[0].content.length > 60 ? '...' : '') +
        (noteCount > 1 ? ` (+${noteCount - 1} more)` : '');

      await scheduleNotification(title, body, hekaDate, {
        id: parseInt(`${year}${month}${day}`),
        extra: { dayKey, noteCount }
      });
    }
  }
}

/**
 * Get all pending notifications (native apps only)
 */
export async function getPendingNotifications(): Promise<any[]> {
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
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<boolean> {
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      const { notifications } = await LocalNotifications.getPending();
      if (notifications && notifications.length > 0) {
        await LocalNotifications.cancel({ notifications });
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
 */
export async function testNotification(): Promise<void> {
  // Try native app path first
  if (IS_NATIVE_APP && isNativePluginAvailable()) {
    try {
      // Check permission
      const { display } = await LocalNotifications.checkPermissions();
      if (display !== 'granted') {
        console.log('Notification permission not granted');
        // Fall through to web
      } else {
        // Schedule immediate notification
        await LocalNotifications.schedule({
          notifications: [{
            id: Math.floor(Math.random() * 100000),
            title: 'HEKA Calendar',
            body: 'Notifications are working! You\'ll be reminded of your notes.',
            smallIcon: 'ic_notification',
            iconColor: '#c9a227',
            schedule: { at: new Date(Date.now() + 1000) } // 1 second from now
          }]
        });
        
        console.log('Test notification scheduled');
        return;
      }
    } catch (error) {
      console.error('Error sending native test notification:', error);
      // Fall through to web
    }
  }
  
  // Browser / fallback path
  sendNotification('HEKA Calendar', {
    body: 'Notifications are working! You\'ll be reminded of your notes.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    requireInteraction: false,
  });
}
