/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VISIBILITY HOOK — Detects when the app/page is visible to the user
 * Combines document.visibilityState with Capacitor appStateChange when available.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';

function getIsVisible() {
  if (typeof document === 'undefined') return true;
  return document.visibilityState === 'visible';
}

/**
 * Returns true when the page/app is currently visible/active.
 * Use this to pause expensive animations/timers when backgrounded.
 */
export function useVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(getIsVisible);

  useEffect(() => {
    let removeCapacitorListener: (() => void) | null = null;

    const handleChange = () => {
      setIsVisible(getIsVisible());
    };

    document.addEventListener('visibilitychange', handleChange);

    // Capacitor app state listener (optional)
    import('@capacitor/app')
      .then(({ App }) => App.addListener('appStateChange', handleChange))
      .then((handle) => {
        removeCapacitorListener = () => handle.remove();
      })
      .catch(() => {
        // Capacitor not available — document.visibilitychange is enough for web
      });

    return () => {
      document.removeEventListener('visibilitychange', handleChange);
      if (removeCapacitorListener) {
        removeCapacitorListener();
      }
    };
  }, []);

  return isVisible;
}
