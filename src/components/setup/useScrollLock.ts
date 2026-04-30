/**
 * Body Scroll Lock Hook
 * Prevents background scroll when modal is active. Restores on unmount.
 */

import { useEffect } from 'react';

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [active]);
}
