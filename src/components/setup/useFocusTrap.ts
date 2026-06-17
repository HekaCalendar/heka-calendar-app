/**
 * Focus Trap Hook — Enterprise-grade modal accessibility
 * Traps Tab/Shift+Tab within a container. Restores focus on unmount.
 */

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement | null>) {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const handlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);

  useEffect(() => {
    if (!active) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Delay focus trap to allow React render cycle to complete
    const timer = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      const first = focusables[0];

      if (first) first.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        // Re-query focusables to catch dynamically added elements
        const currentFocusables = Array.from(
          container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (currentFocusables.length === 0) {
          e.preventDefault();
          return;
        }

        const currentFirst = currentFocusables[0];
        const currentLast = currentFocusables[currentFocusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === currentFirst) {
            e.preventDefault();
            currentLast?.focus();
          }
        } else {
          if (document.activeElement === currentLast) {
            e.preventDefault();
            currentFirst?.focus();
          }
        }
      };

      handlerRef.current = handleKeyDown;
      document.addEventListener('keydown', handleKeyDown);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (handlerRef.current) {
        document.removeEventListener('keydown', handlerRef.current);
        handlerRef.current = null;
      }
      previouslyFocusedRef.current?.focus();
    };
  }, [active, containerRef]);
}
