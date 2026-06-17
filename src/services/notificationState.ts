/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION STATE — Persistence layer for the notification engine
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { NotificationEngineState } from '../types/notifications';
import { DEFAULT_ENGINE_STATE } from '../types/notifications';

const ENGINE_STORAGE_KEY = 'heka-notification-engine-state';
const GENIUS_QUEUE_KEY = 'heka-genius-queue';

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadEngineState(): NotificationEngineState {
  try {
    const raw = localStorage.getItem(ENGINE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_ENGINE_STATE, ...parsed };
    }
  } catch (e) {
    console.error('[NotificationEngine] Failed to load state:', e);
  }
  return { ...DEFAULT_ENGINE_STATE };
}

let pendingEngineState: NotificationEngineState | null = null;
let engineSaveTimeout: ReturnType<typeof setTimeout> | null = null;

export function saveEngineState(state: NotificationEngineState): void {
  pendingEngineState = state;
  if (engineSaveTimeout) {
    clearTimeout(engineSaveTimeout);
  }
  engineSaveTimeout = setTimeout(() => {
    engineSaveTimeout = null;
    if (!pendingEngineState) return;
    try {
      localStorage.setItem(ENGINE_STORAGE_KEY, JSON.stringify(pendingEngineState));
    } catch (e) {
      console.error('[NotificationEngine] Failed to save state:', e);
    }
    pendingEngineState = null;
  }, 500);
}

export function loadGeniusQueue(): Array<unknown> {
  try {
    const raw = localStorage.getItem(GENIUS_QUEUE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

export function persistGeniusQueue(queue: Array<unknown>): void {
  try {
    localStorage.setItem(GENIUS_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // ignore
  }
}

export function clearPersistedGeniusQueue(): void {
  try {
    localStorage.removeItem(GENIUS_QUEUE_KEY);
  } catch {
    // ignore
  }
}
