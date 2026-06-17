/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GLOBAL TIME HOOK — Shared ticker for live UI components
 * Replaces dozens of per-component setInterval calls with a single interval.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useVisibility } from './useVisibility';

const subscribers = new Set<(now: Date) => void>();
let globalInterval: ReturnType<typeof setInterval> | null = null;

function startGlobalInterval() {
  if (globalInterval) return;
  globalInterval = setInterval(() => {
    const now = new Date();
    subscribers.forEach((cb) => cb(now));
  }, 1000);
}

function stopGlobalInterval() {
  if (globalInterval) {
    clearInterval(globalInterval);
    globalInterval = null;
  }
}

function subscribe(callback: (now: Date) => void) {
  subscribers.add(callback);
  if (subscribers.size === 1) {
    startGlobalInterval();
  }
  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) {
      stopGlobalInterval();
    }
  };
}

/**
 * Returns a live Date that updates once per second.
 * Multiple components share one underlying setInterval.
 * Pauses updates when the app is backgrounded/hidden to save battery.
 */
export function useGlobalTime(): Date {
  const [now, setNow] = useState(() => new Date());
  const isVisible = useVisibility();
  const frozenRef = useRef(now);

  useEffect(() => {
    if (!isVisible) {
      frozenRef.current = now;
      return;
    }

    // Sync with global time immediately when becoming visible
    setNow(new Date());

    return subscribe((next) => {
      setNow(next);
      frozenRef.current = next;
    });
  }, [isVisible]);

  return isVisible ? now : frozenRef.current;
}

/**
 * Like useGlobalTime but with a custom interval in milliseconds.
 * Useful for components that only need minute-level updates.
 */
export function useGlobalTimeInterval(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date());
  const isVisible = useVisibility();
  const frozenRef = useRef(now);

  useEffect(() => {
    if (!isVisible) {
      frozenRef.current = now;
      return;
    }

    setNow(new Date());

    const id = setInterval(() => {
      const next = new Date();
      setNow(next);
      frozenRef.current = next;
    }, intervalMs);

    return () => clearInterval(id);
  }, [isVisible, intervalMs]);

  return isVisible ? now : frozenRef.current;
}

/**
 * Returns a function that forces the global time to update now.
 * Useful for immediate feedback after user interactions.
 */
export function useRefreshGlobalTime(): () => void {
  return useCallback(() => {
    const now = new Date();
    subscribers.forEach((cb) => cb(now));
  }, []);
}
