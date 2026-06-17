import { useEffect } from 'react';

/**
 * Lock body scrolling while keeping an inner scroll container usable.
 *
 * We suppress scrolling on `<html>` and `<body>` with `overflow: hidden`.
 * We intentionally do **not** set `touch-action: none` on the document root,
 * because on Android/Samsung WebView the browser intersects `touch-action`
 * values from the touched element up to the scrolling element. A root value
 * of `none` can swallow the `pan-y` declared by foreground scroll containers
 * such as the wizard scene or modal body, breaking vertical scroll on narrow
 * foldable cover screens (e.g. Samsung Z Fold 7 closed).
 *
 * Foreground scroll containers are responsible for their own
 * `touch-action: pan-y` / `overscroll-behavior: contain` declarations.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const html = document.documentElement;
    const body = document.body;

    const original = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
    };

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = original.htmlOverflow;
      body.style.overflow = original.bodyOverflow;
    };
  }, [active]);
}
