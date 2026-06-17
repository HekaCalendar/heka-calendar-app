import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollLock } from '../src/components/setup/useScrollLock';

describe('useScrollLock', () => {
  it('suppresses scrolling on html and body when active without blocking touch pan', () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.documentElement.style.overflow).toBe('hidden');
    // touch-action is intentionally left untouched on the document root so
    // that foreground scroll containers can declare their own pan-y on
    // Android/Samsung WebView without ancestor intersection swallowing it.
    expect(document.body.style.touchAction).toBe('');
    expect(document.documentElement.style.touchAction).toBe('');
    expect(document.body.style.overscrollBehavior).toBe('');
    expect(document.documentElement.style.overscrollBehavior).toBe('');
  });

  it('does not fix body position (keeps inner scroll containers usable)', () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.position).toBe('');
    expect(document.body.style.width).toBe('');
    expect(document.body.style.left).toBe('');
    expect(document.documentElement.style.height).toBe('');
  });

  it('restores original styles on unmount', () => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe(originalBodyOverflow);
    expect(document.documentElement.style.overflow).toBe(originalHtmlOverflow);
  });

  it('does nothing when inactive', () => {
    const bodyOverflowBefore = document.body.style.overflow;
    renderHook(() => useScrollLock(false));
    expect(document.body.style.overflow).toBe(bodyOverflowBefore);
  });
});
