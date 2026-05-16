/**
 * Body Scroll Lock Hook
 * Prevents background scroll when modal is active. Restores on unmount.
 * Handles iOS Safari bounce/overscroll properly.
 */

import { useEffect } from 'react';

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalBodyTouchAction = document.body.style.touchAction;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlTouchAction = document.documentElement.style.touchAction;
    const originalHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.touchAction = 'none';
    // Prevent iOS Safari from allowing scroll on html element
    document.documentElement.style.height = '100%';

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.body.style.touchAction = originalBodyTouchAction;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.touchAction = originalHtmlTouchAction;
      document.documentElement.style.height = originalHtmlHeight;
    };
  }, [active]);
}
