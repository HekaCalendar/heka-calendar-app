// TEMPORARY WASM INIT ERROR SUPPRESSOR
// Only active for the first 10 seconds to catch noisy swisseph-wasm init failures.
// Real errors are still logged; this just prevents React from crashing during WASM bootstrap.
(function() {
  const INIT_WINDOW_MS = 10000;
  const startTime = Date.now();
  const originalOnError = window.onerror;
  
  function isWASMInitNoise(msg: string, error?: Error): boolean {
    const msgStr = String(msg).toLowerCase();
    const errMsg = error?.message?.toLowerCase() || '';
    const isWASMRelated = msgStr.includes('swisseph') || errMsg.includes('swisseph') || msgStr.includes('wasm') || errMsg.includes('wasm');
    const isTypicalInitNoise = msgStr.includes('is not a function') || msgStr.includes('cannot read properties') || msgStr.includes('module');
    return isWASMRelated && isTypicalInitNoise;
  }
  
  window.onerror = function(msg, url, line, col, error) {
    if (Date.now() - startTime < INIT_WINDOW_MS && isWASMInitNoise(String(msg), error as Error)) {
      console.warn('[WASM Init] Non-fatal bootstrap noise suppressed:', msg);
      return true;
    }
    if (originalOnError) {
      return originalOnError(msg, url, line, col, error);
    }
    return false;
  };
  
  window.addEventListener('unhandledrejection', function(event) {
    if (Date.now() - startTime < INIT_WINDOW_MS) {
      const msg = String(event.reason).toLowerCase();
      if ((msg.includes('swisseph') || msg.includes('wasm')) && msg.includes('is not a function')) {
        console.warn('[WASM Init] Non-fatal promise rejection suppressed:', event.reason);
        event.preventDefault();
      }
    }
  });
})();

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { onAuthChange, isFirebaseConfigured } from './services/firebase';
import { store } from './store';
import { setAuthenticated, setUnauthenticated } from './store';
import { attachPlannerListener, detachPlannerListener } from './services/plannerService';
import { initializeSwissEphemeris } from './astrology/services/swiss-ephemeris/engine';
import { initI18n } from './i18n';

// Defensive console sanitizer: redact API keys from all log output in native builds
(function () {
  if (typeof window === 'undefined') return;
  const isNative = (window as any).Capacitor?.isNative;
  if (!isNative) return;

  const SENSITIVE_PATTERNS = [
    /sk-[a-zA-Z0-9]{48,}/g,
    /sk-proj-[a-zA-Z0-9_-]{100,}/g,
    /gsk_[a-zA-Z0-9_-]{30,}/g,
    /sk-ant-[a-zA-Z0-9_-]{60,}/g,
    /AIzaSy[a-zA-Z0-9_-]{30,}/g,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    /[\w-]{20,}\.[\w-]{20,}\.[\w-]{20,}/g,
  ];

  function redact(str: string): string {
    return SENSITIVE_PATTERNS.reduce((s, pattern) => s.replace(pattern, '[REDACTED]'), str);
  }

  function sanitize(args: any[]): any[] {
    return args.map((arg) => {
      if (typeof arg === 'string') {
        return redact(arg);
      }
      if (typeof arg === 'object' && arg !== null) {
        try {
          const str = JSON.stringify(arg);
          return JSON.parse(redact(str));
        } catch {
          return arg;
        }
      }
      return arg;
    });
  }

  const methods: (keyof Console)[] = ['log', 'info', 'warn', 'error', 'debug'];
  methods.forEach((method) => {
    const original = (console as any)[method];
    if (typeof original === 'function') {
      (console as any)[method] = function (...args: any[]) {
        return original.apply(console, sanitize(args));
      };
    }
  });
})();

const APP_VERSION = '2.2.1';
const BUILD_TIME = Date.now().toString();


// Safe localStorage wrapper
function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn('[HEKA] Storage unavailable:', e);
    return false;
  }
}

function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function safeLocalStorageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    // Silent fail
  }
}

// Always update build time
safeLocalStorageSet('heka-build', BUILD_TIME);

// Check version - force reload if mismatch
const stored = safeLocalStorageGet('heka-version');

if (stored && stored !== APP_VERSION) {
  safeLocalStorageSet('heka-version', APP_VERSION);
  
  // Clear caches before reload
  const doReload = () => { window.location.reload(); };
  if ('caches' in window) {
    caches.keys().then(names => {
      Promise.all(names.map(n => caches.delete(n))).then(doReload, doReload);
    }).catch(doReload);
  } else {
    doReload();
  }
} else {
  safeLocalStorageSet('heka-version', APP_VERSION);
}

// Initialize Firebase Auth listener
if (isFirebaseConfigured()) {
  onAuthChange((user) => {
    if (user) {
      store.dispatch(setAuthenticated({
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));
      attachPlannerListener();
    } else {
      store.dispatch(setUnauthenticated());
      detachPlannerListener();
    }
  });
}

// Determine user's language from persisted setup state
function getUserLanguage(): string {
  try {
    const raw = localStorage.getItem('heka-setup-v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.language) return parsed.language;
    }
  } catch { /* ignore */ }
  return 'en';
}

// Initialize Swiss Ephemeris before rendering, then mount app
const root = document.getElementById('root');
if (root) {
  const userLanguage = getUserLanguage();

  // Initialize WASM and i18n in parallel (with timeout to prevent blocking)
  const initPromise = Promise.race([
    Promise.all([
      initializeSwissEphemeris(),
      initI18n(userLanguage),
    ]),
    new Promise(resolve => setTimeout(resolve, 5000)) // Max 5 second wait
  ]);

  initPromise.then(() => {
  }).catch(() => {
    console.warn('[HEKA] Init failed, using fallbacks');
  }).finally(() => {
    // Render app regardless of init status (fallbacks will handle it)
    try {
      ReactDOM.createRoot(root).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (renderError) {
      console.error('[HEKA] Fatal render error:', renderError);
      root.innerHTML = `
        <div style="
          padding: 2rem;
          text-align: center;
          background: #0c0c0f;
          color: #f5f5f5;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: system-ui, sans-serif;
        ">
          <h1 style="color: #ff6b6b; margin-bottom: 1rem;">Unable to Start Calendar</h1>
          <p style="color: #a0a0a0; margin-bottom: 1.5rem;">
            The calendar couldn't load. This might be due to an outdated browser or device limitations.
          </p>
          <button onclick="location.reload()" style="
            padding: 0.75rem 1.5rem;
            background: #caa24a;
            color: #000;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          ">Try Again</button>
        </div>
      `;
    }
  });
} else {
  console.error('[HEKA] Root element not found');
}

// Expose utilities (development only)
if (import.meta.env.DEV) {
  (window as any).heka = {
  version: APP_VERSION,
  reset: () => {
    safeLocalStorageRemove('heka-version');
    safeLocalStorageRemove('heka-last-version');
    safeLocalStorageRemove('heka-calendar-state');
    safeLocalStorageRemove('heka-tutorial-state-v1');
    safeLocalStorageRemove('heka-tutorial-state-v2');
    safeLocalStorageRemove('heka-tutorial-analytics-v2');
    safeLocalStorageRemove('heka-tutorial-v3');
    window.location.reload();
  },
  resetTutorial: () => {
    // Clear only tutorial state to force onboarding to show again
    safeLocalStorageRemove('heka-tutorial-state-v2');
    safeLocalStorageRemove('heka-tutorial-analytics-v2');
    safeLocalStorageRemove('heka-tutorial-data-version');
    safeLocalStorageRemove('heka-tutorial-v3');
    window.location.reload();
  },
  checkTutorial: () => {
    const tutorialState = safeLocalStorageGet('heka-tutorial-state-v2');
    if (tutorialState) {
      const parsed = JSON.parse(tutorialState);
      return parsed;
    } else {
      return null;
    }
  },
  status: () => ({
    version: APP_VERSION,
    stored: safeLocalStorageGet('heka-version'),
    last: safeLocalStorageGet('heka-last-version')
  })
  };
}

// Service Worker Registration - with error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Skip SW registration in Capacitor to avoid conflicts
    const isCapacitor = (window as any).Capacitor !== undefined;
    if (isCapacitor) {
      return;
    }

    // Register app cache worker
    navigator.serviceWorker.register('/sw.js')
      .catch(error => {
        console.warn('[HEKA] SW registration failed:', error);
      });

    // Register Firebase Messaging worker for web push
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        // Send Firebase config to the messaging SW so it can initialize
        const firebaseConfig = {
          apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
          authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
          projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
          storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
          messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
          appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
        };
        if (firebaseConfig.apiKey) {
          registration.active?.postMessage({
            type: 'HEKA_FIREBASE_CONFIG',
            config: firebaseConfig,
          });
          // Also send to waiting/activating workers
          registration.waiting?.postMessage({
            type: 'HEKA_FIREBASE_CONFIG',
            config: firebaseConfig,
          });
          registration.installing?.postMessage({
            type: 'HEKA_FIREBASE_CONFIG',
            config: firebaseConfig,
          });
        }
      })
      .catch(error => {
        console.warn('[HEKA] FCM SW registration failed:', error);
      });
  });
}

