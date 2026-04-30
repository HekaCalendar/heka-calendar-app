/**
 * Capacitor Back Button Service
 * Handles hardware back button on Android via Capacitor App plugin.
 * Navigates back through route history; exits app at root.
 */

import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Module-level guard to prevent multiple concurrent registrations
let globalBackButtonListener: { remove: () => void } | null = null;

export function useCapacitorBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSetupRef = useRef(false);

  useEffect(() => {
    // Prevent rapid re-registration on remount / re-render storms
    if (isSetupRef.current) return;
    isSetupRef.current = true;

    const setup = async () => {
      // If already registered globally, skip
      if (globalBackButtonListener) return;
      try {
        const { App } = await import('@capacitor/app');
        globalBackButtonListener = await App.addListener('backButton', () => {
          // At root routes, exit the app instead of going back
          const path = location.pathname;
          if (path === '/' || path === '/month') {
            App.exitApp();
          } else {
            navigate(-1);
          }
        });
      } catch {
        // Not a native build — silently ignore
      }
    };

    setup();
    // Intentionally no cleanup — we keep the single global listener alive
    // to avoid churn during rapid re-renders. It is removed only on full page reload.
  }, [navigate, location.pathname]);
}
