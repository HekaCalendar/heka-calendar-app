// GLOBAL ERROR HANDLER - Must be first to catch WASM errors before React
(function() {
  const originalOnError = window.onerror;
  let wasmErrorCount = 0;
  const MAX_WASM_ERRORS = 5;
  
  window.onerror = function(msg, url, line, col, error) {
    const msgStr = String(msg);
    
    // Suppress WASM initialization errors
    if (msgStr.includes('is not a function') || 
        msgStr.includes('WASM') || 
        msgStr.includes('swisseph') ||
        (error && error.message && (
          error.message.includes('is not a function') ||
          error.message.includes('WASM')
        ))) {
      wasmErrorCount++;
      if (wasmErrorCount <= MAX_WASM_ERRORS) {
        console.warn('[GLOBAL ERROR HANDLER] Suppressed WASM error:', msgStr.substring(0, 100));
      }
      return true; // Completely suppress the error
    }
    
    // Call original handler for other errors
    if (originalOnError) {
      return originalOnError(msg, url, line, col, error);
    }
    return false;
  };
  
  // Also catch unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    const msg = String(event.reason);
    if (msg.includes('is not a function') || msg.includes('WASM') || msg.includes('swisseph')) {
      event.preventDefault();
      event.stopPropagation();
      console.warn('[GLOBAL ERROR HANDLER] Suppressed WASM promise rejection');
    }
  }, true);
})();

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './components/App';
import { onAuthChange, isFirebaseConfigured } from './services/firebase';
import { store } from './store';
import { setAuthenticated, setUnauthenticated } from './store';
import { initializeSwissEphemeris } from './astrology/services/swiss-ephemeris/engine';

const APP_VERSION = '2.2.0';
const BUILD_TIME = Date.now().toString();

console.log('[HEKA] Version:', APP_VERSION, 'Build:', BUILD_TIME);

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
console.log('[HEKA] Stored version:', stored);

if (stored && stored !== APP_VERSION) {
  console.log('[HEKA] VERSION MISMATCH - clearing caches');
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
      console.log('[HEKA] User authenticated:', user.email);
    } else {
      store.dispatch(setUnauthenticated());
      console.log('[HEKA] User not authenticated');
    }
  });
}

// Initialize Swiss Ephemeris before rendering, then mount app
const root = document.getElementById('root');
if (root) {
  // Initialize WASM first (with timeout to prevent blocking)
  const initPromise = Promise.race([
    initializeSwissEphemeris(),
    new Promise(resolve => setTimeout(resolve, 3000)) // Max 3 second wait
  ]);
  
  initPromise.then(() => {
    console.log('[HEKA] Swiss Ephemeris initialized');
  }).catch(() => {
    console.warn('[HEKA] Swiss Ephemeris init failed, using fallback');
  }).finally(() => {
    // Render app regardless of WASM status (fallbacks will handle it)
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

// Expose utilities
(window as any).heka = {
  version: APP_VERSION,
  reset: () => {
    safeLocalStorageRemove('heka-version');
    safeLocalStorageRemove('heka-last-version');
    safeLocalStorageRemove('heka-calendar-state');
    safeLocalStorageRemove('heka-tutorial-state-v1');
    safeLocalStorageRemove('heka-tutorial-state-v2');
    safeLocalStorageRemove('heka-tutorial-analytics-v2');
    window.location.reload();
  },
  resetTutorial: () => {
    // Clear only tutorial state to force onboarding to show again
    safeLocalStorageRemove('heka-tutorial-state-v2');
    safeLocalStorageRemove('heka-tutorial-analytics-v2');
    safeLocalStorageRemove('heka-tutorial-data-version');
    console.log('[HEKA] Tutorial state cleared. Refresh to see onboarding.');
    window.location.reload();
  },
  checkTutorial: () => {
    const tutorialState = safeLocalStorageGet('heka-tutorial-state-v2');
    if (tutorialState) {
      const parsed = JSON.parse(tutorialState);
      console.log('[HEKA] Tutorial state:', parsed);
      return parsed;
    } else {
      console.log('[HEKA] No tutorial state found');
      return null;
    }
  },
  status: () => ({
    version: APP_VERSION,
    stored: safeLocalStorageGet('heka-version'),
    last: safeLocalStorageGet('heka-last-version')
  })
};

// Service Worker Registration - with error handling
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Skip SW registration in Capacitor to avoid conflicts
    const isCapacitor = (window as any).Capacitor !== undefined;
    if (isCapacitor) {
      console.log('[HEKA] Skipping service worker in Capacitor');
      return;
    }
    
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('[HEKA] SW registered:', registration.scope);
      })
      .catch(error => {
        console.warn('[HEKA] SW registration failed:', error);
      });
  });
}

console.log('[HEKA] Ready');
