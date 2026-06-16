// HEKA Calendar Service Worker - v2.2.23
// Manual update handling with skipWaiting on message

const CACHE_VERSION = '2.2.23';
const CACHE_NAME = 'heka-cache-v' + CACHE_VERSION;

// Assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('[SW] Install complete');
      // FORCE UPDATE: Clear all old caches immediately
      self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v' + CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // For HTML and root - always network first
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request).then((response) => {
        // Cache successful responses
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      }).catch(() => {
        // Fallback to cache
        return caches.match(request);
      })
    );
    return;
  }
  
  // For assets - stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        const contentType = networkResponse.headers.get('content-type') || '';
        // Never cache an HTML error page as a JS/CSS/WASM asset. This happens
        // when a hashed asset from an old build is requested but no longer exists.
        if (networkResponse.ok && !contentType.includes('text/html')) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return networkResponse;
        }
        // Fall back to the cached version if the server returned an HTML fallback.
        return cached || networkResponse;
      }).catch(() => cached);
      
      return cached || fetchPromise;
    })
  );
});

// Push event - handle incoming web push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  let data = {};
  try {
    data = event.data?.json() || {};
  } catch (e) {
    data = { title: event.data?.text() || 'HEKA Calendar' };
  }
  
  const title = data.notification?.title || data.title || 'HEKA Calendar';
  const body = data.notification?.body || data.body || '';
  const icon = data.notification?.icon || '/icon-192.png';
  
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge: '/icon-192.png',
      tag: data.tag || 'heka-push',
      data: data.data || data,
      requireInteraction: false,
    })
  );
});

// Notification click event - handle user tapping a push notification
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  event.notification.close();
  
  const data = event.notification.data || {};
  let url = data.url || data.deepLink || '/';
  // Validate URL to prevent open redirect attacks
  if (!url.startsWith('/') && !url.startsWith(self.location.origin)) {
    url = '/';
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing tab if open
      for (const client of clientList) {
        if (client.url && new URL(client.url).pathname === new URL(url, self.location.origin).pathname) {
          return client.focus();
        }
      }
      // Open new tab/window
      return self.clients.openWindow(url);
    })
  );
});

// Message event - handle skip waiting
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data === 'SKIP_WAITING' || event.data?.type === 'SKIP_WAITING') {
    console.log('[SW] Skipping waiting');
    self.skipWaiting();
  }
  
  if (event.data === 'GET_VERSION') {
    event.source?.postMessage({
      type: 'VERSION',
      version: CACHE_VERSION
    });
  }
});
