import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useScrollLock } from '../src/components/setup/useScrollLock';

describe('useScrollLock', () => {
  it('sets body overflow to hidden when active', () => {
    const originalOverflow = document.body.style.overflow;
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');
    document.body.style.overflow = originalOverflow;
  });

  it('sets html overflow to hidden when active', () => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    renderHook(() => useScrollLock(true));
    expect(document.documentElement.style.overflow).toBe('hidden');
    document.documentElement.style.overflow = originalHtmlOverflow;
  });

  it('sets body touchAction to none when active', () => {
    const original = document.body.style.touchAction;
    renderHook(() => useScrollLock(true));
    expect(document.body.style.touchAction).toBe('none');
    document.body.style.touchAction = original;
  });

  it('sets html height to 100% when active', () => {
    const original = document.documentElement.style.height;
    renderHook(() => useScrollLock(true));
    expect(document.documentElement.style.height).toBe('100%');
    document.documentElement.style.height = original;
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
