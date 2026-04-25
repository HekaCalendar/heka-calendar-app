/**
 * Capacitor Back Button Service
 * Handles hardware back button on Android via Capacitor App plugin.
 * Navigates back through route history; exits app at root.
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useCapacitorBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let listener: { remove: () => void } | null = null;

    const setup = async () => {
      try {
        const { App } = await import('@capacitor/app');
        const result = await App.addListener('backButton', () => {
          // At root routes, exit the app instead of going back
          const path = location.pathname;
          if (path === '/' || path === '/month') {
            App.exitApp();
          } else {
            navigate(-1);
          }
        });
        listener = result;
      } catch {
        // Not a native build — silently ignore
      }
    };

    setup();
    return () => {
      if (listener) listener.remove();
    };
  }, [navigate, location.pathname]);
}
