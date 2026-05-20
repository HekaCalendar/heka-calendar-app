/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PUSH NOTIFICATION SERVICE
 * Handles remote push registration for native (iOS/Android) and web.
 * Integrates with Capacitor Push Notifications for native, Firebase Messaging
 * for web push (when configured).
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { eventBus } from './eventBus';
import { store, setGlobalNotificationsEnabled } from '../store';
import { NotificationEngine } from './notificationEngine';

const IS_NATIVE = Capacitor.isNativePlatform();

let pushRegistrationAttempted = false;

/**
 * Initialize push notifications.
 * Call once after setup wizard is complete.
 */
export async function initializePushNotifications(): Promise<void> {
  if (pushRegistrationAttempted) return;
  pushRegistrationAttempted = true;

  // If this is a post-version-update reload, force re-registration
  const needsRefresh = localStorage.getItem('heka-push-needs-refresh') === 'true';
  if (needsRefresh) {
    localStorage.removeItem('heka-push-needs-refresh');
    console.log('[Push] Re-registering after version update');
  }

  if (IS_NATIVE) {
    await initializeNativePush();
  } else {
    await initializeWebPush();
  }
}

// ── Native Push (iOS/Android via Capacitor) ──────────────────────────────────

async function initializeNativePush(): Promise<void> {
  try {
    // Request permission
    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== 'granted') {
      console.log('[Push] Native push permission denied');
      return;
    }

    // Sync: OS permission granted = app-level notifications enabled
    const currentGlobal = store.getState().calendar.notificationPreferences.globalEnabled;
    if (!currentGlobal) {
      store.dispatch(setGlobalNotificationsEnabled(true));
      console.log('[Push] Auto-enabled app notifications after native permission granted');
    }

    // Register with APNS/FCM
    await PushNotifications.register();

    // Listen for token
    PushNotifications.addListener('registration', (token) => {
      // Token intentionally not logged (PII)
      eventBus.emit('heka-push-token', { token: token.value, platform: Capacitor.getPlatform() });
    });

    // Listen for errors
    PushNotifications.addListener('registrationError', (err) => {
      console.error('[Push] Registration error:', err.error);
    });

    // Foreground push received
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      handlePushPayload(notification);
    });

    // Push tapped
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      handlePushTap(action.notification);
    });
  } catch (e) {
    console.error('[Push] Native init failed:', e);
  }
}

// ── Web Push (Firebase Messaging) ────────────────────────────────────────────

async function initializeWebPush(): Promise<void> {
  // Web push requires Firebase Messaging and a service worker.
  // Gracefully skip if Firebase is not configured or service worker unavailable.
  if (!('serviceWorker' in navigator)) {
    console.log('[Push] Service Worker not supported, skipping web push');
    return;
  }

  try {
    // Dynamically import Firebase Messaging to avoid bundling issues
    // when Firebase is not fully configured.
    const { getMessaging, getToken, onMessage } = await import('firebase/messaging');
    const { isFirebaseConfigured } = await import('./firebase');

    if (!isFirebaseConfigured()) {
      console.log('[Push] Firebase not configured, skipping web push');
      return;
    }

    // Get the Firebase app instance exported from firebase.ts
    const { app } = await import('./firebase');
    if (!app) {
      console.log('[Push] Firebase app not initialized, skipping web push');
      return;
    }
    const messaging = getMessaging(app);

    // Request permission and get FCM token
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('[Push] Web notification permission denied');
      return;
    }

    // Sync: browser permission granted = app-level notifications enabled
    const currentGlobal = store.getState().calendar.notificationPreferences.globalEnabled;
    if (!currentGlobal) {
      store.dispatch(setGlobalNotificationsEnabled(true));
      console.log('[Push] Auto-enabled app notifications after web permission granted');
    }

    // VAPID key from environment (optional — only needed for web push)
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

    // Find the FCM service worker registration so Firebase can use it
    const registrations = await navigator.serviceWorker.getRegistrations();
    const fcmRegistration = registrations.find(
      (r) => r.scope.includes('firebase-messaging-sw') || r.scope.endsWith('/')
    );

    const tokenOptions: { vapidKey?: string; serviceWorkerRegistration?: ServiceWorkerRegistration } = {};
    if (vapidKey) tokenOptions.vapidKey = vapidKey;
    if (fcmRegistration) tokenOptions.serviceWorkerRegistration = fcmRegistration;

    const token = await getToken(messaging, tokenOptions);

    if (token) {
      eventBus.emit('heka-push-token', { token, platform: 'web' });
    }

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      handlePushPayload({
        title: payload.notification?.title || 'HEKA Calendar',
        body: payload.notification?.body || '',
        data: payload.data as Record<string, string> || {},
      });
    });
  } catch (e) {
    // firebase/messaging may not be available if Firebase is not configured
    console.log('[Push] Web push init skipped:', e);
  }
}

// ── Shared Handlers ──────────────────────────────────────────────────────────

interface PushPayload {
  title?: string;
  body?: string;
  data?: Record<string, string>;
  id?: string;
}

function handlePushPayload(payload: PushPayload): void {
  // Show a local notification so the user sees it even in foreground
  const title = payload.title || 'HEKA Calendar';
  const body = payload.body || '';
  const data = payload.data || {};

  // Route by type
  const type = data.type || data.hekaType || 'generic';

  // Use the engine for scheduling so caps, quiet hours, and dedup are respected.
  // Push notifications are treated as CORE since they're remote-triggered
  // and the backend has already decided they matter.
  void NotificationEngine.notifyCore(
    type,
    'circle',
    title,
    body,
    { ...data, _pushSource: 'true', _pushType: type },
    // Use a stable ID derived from type + payload id to avoid collisions
    data.id ? parseInt(data.id, 10) % 1000000 : undefined
  );

  // On web, also show via Web Notification API as fallback
  if (!IS_NATIVE) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: data.tag || 'heka-push',
        data,
      });
    }
  }

  // Emit event for in-app routing (e.g. open Circle, open task, etc.)
  eventBus.emit('heka-push-received', { type, data, title, body });
}

function handlePushTap(notification: { data?: Record<string, string> }): void {
  const data = notification.data || {};
  const type = data.type || data.hekaType || 'generic';

  // Route to appropriate screen
  eventBus.emit('heka-push-tapped', { type, data });

  // Specific routing
  if (type === 'friend-request' || type === 'task-assigned' || type === 'circle-message') {
    eventBus.emit('navigate-to-circle', undefined);
  }
  if (type === 'task-due-soon' && data.taskId) {
    eventBus.emit('navigate-to-planner', { taskId: data.taskId });
  }
}
