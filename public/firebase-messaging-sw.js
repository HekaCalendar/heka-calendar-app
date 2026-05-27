// HEKA Calendar Firebase Messaging Service Worker
// This worker handles Firebase Cloud Messaging background notifications.
// To use: set VITE_FIREBASE_VAPID_KEY in .env and ensure Firebase is configured.
//
// Note: This worker uses Firebase compat SDK via importScripts.
// Update the version numbers below to match your firebase package version.

const FIREBASE_VERSION = '9.23.0';

importScripts(
  `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app-compat.js`,
  `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-messaging-compat.js`
);

let fcmInitialized = false;

function initFirebase(config) {
  if (fcmInitialized) return;
  if (!config || !config.apiKey) {
    console.log('[FCM-SW] Firebase config missing. Background messaging disabled.');
    return;
  }
  try {
    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log('[FCM-SW] Background message:', payload);

      const notificationTitle = payload.notification?.title || 'HEKA Calendar';
      const notificationOptions = {
        body: payload.notification?.body || '',
        icon: payload.notification?.icon || '/icon-192.png',
        badge: '/icon-192.png',
        tag: payload.data?.tag || 'heka-fcm',
        data: payload.data || {},
        requireInteraction: false,
      };

      self.registration.showNotification(notificationTitle, notificationOptions);
    });

    fcmInitialized = true;
    console.log('[FCM-SW] Firebase messaging initialized.');
  } catch (e) {
    console.error('[FCM-SW] Failed to initialize Firebase messaging:', e);
  }
}

// Initialize from build-time injection if available
if (self.__firebaseConfig) {
  initFirebase(self.__firebaseConfig);
}

// Also accept config from the main app via postMessage
self.addEventListener('message', (event) => {
  const ALLOWED_ORIGINS = [
    'https://hekacalendar.com',
    'https://localhost:5173',
    'http://localhost:5173',
    'capacitor://localhost',
    'http://localhost'
  ];
  if (event.origin && !ALLOWED_ORIGINS.includes(event.origin)) {
    console.warn('[FCM-SW] Rejected postMessage from untrusted origin:', event.origin);
    return;
  }
  if (event.data && event.data.type === 'HEKA_FIREBASE_CONFIG') {
    initFirebase(event.data.config);
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[FCM-SW] Notification clicked:', event);
  event.notification.close();

  const data = event.notification.data || {};
  let url = data.url || data.deepLink || '/';
  // Validate URL to prevent open redirect attacks
  if (!url.startsWith('/') && !url.startsWith(self.location.origin)) {
    url = '/';
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && new URL(client.url).pathname === new URL(url, self.location.origin).pathname) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
