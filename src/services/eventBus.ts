/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TYPED EVENT BUS — Replacement for window.dispatchEvent / window.addEventListener
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Follows the same subscribe/emit pattern already used by:
 *   - tutorialService.subscribe()
 *   - aiConfigService.subscribe()
 *   - profileManager.subscribe()
 *
 * Benefits over window events:
 *   1. Type-safe — TypeScript knows payload shapes
 *   2. No string typos — event names are validated
 *   3. No memory leaks — unsubscribe returns cleanup function
 *   4. No global pollution — events are scoped to the bus instance
 *   5. Testable — can mock the bus in unit tests
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { HekaDate } from '../types';
import type { PlannerTask } from '../types';
import type { UnlockedAchievement } from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT MAP — Single source of truth for all app events
// ═══════════════════════════════════════════════════════════════════════════════

export interface EventMap {
  // ─── Journal / Oracle ───
  'heka-open-journal': { prompt?: string };
  'heka-journal-prompt': { prompt: string };
  'heka-select-date': HekaDate & { create?: boolean; createNote?: boolean; createTask?: boolean; suggestedTask?: string };

  // ─── Navigation ───
  'navigate-to-stars': { tab?: string };
  'navigate-to-circle': void;
  'navigate-to-planner': { taskId?: string };

  // ─── Modal Opens ───
  'heka-open-circle': void;
  'heka-open-community': void;
  'heka-open-stats': void;
  'heka-open-search': void;
  'heka-open-year': void;
  'heka-open-info': void;
  'heka-toggle-pure-mode': void;

  // ─── Notifications ───
  'heka:notification:navigate': { target: string };
  'heka-notification-sent': { type: string; title: string };
  'heka-notification-delivered': { id: string; type: string };
  'heka-notification-action': { action: string; [key: string]: any };
  'heka-push-token': { token: string; platform: string };
  'heka-push-received': { type: string; data: Record<string, string>; title: string; body: string };
  'heka-push-tapped': { type: string; data: Record<string, string> };

  // ─── Planner ───
  'heka-task-created': { task: PlannerTask; isFirstTask: boolean };
  'heka-task-completed': { task: PlannerTask; streak: number };

  // ─── Gamification ───
  'heka-achievement-detected': { achievement: UnlockedAchievement };
  'heka-achievement-unlocked': { achievement: UnlockedAchievement };

  // ─── Tutorial ───
  'heka-tutorial-complete': { aiEnabled: boolean };
}

export type EventName = keyof EventMap;

// ═══════════════════════════════════════════════════════════════════════════════
// LISTENER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type EventListener<T extends EventName> = (payload: EventMap[T]) => void;

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT BUS CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class EventBus {
  private listeners: Map<EventName, Set<(payload: unknown) => void>> = new Map();

  /**
   * Subscribe to an event. Returns an unsubscribe function.
   *
   * @example
   * const unsubscribe = eventBus.subscribe('heka-open-journal', ({ prompt }) => {
   *   setJournalPrompt(prompt);
   * });
   * // later: unsubscribe();
   */
  subscribe<T extends EventName>(
    event: T,
    listener: EventListener<T>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const set = this.listeners.get(event)!;
    const wrapped = (payload: unknown) => listener(payload as EventMap[T]);
    set.add(wrapped);

    return () => {
      set.delete(wrapped);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  /**
   * Emit an event with a typed payload.
   *
   * @example
   * eventBus.emit('heka-open-journal', { prompt: 'Reflect on today' });
   */
  emit<T extends EventName>(event: T, payload: EventMap[T]): void {
    const set = this.listeners.get(event);
    if (!set) return;

    // Use setTimeout(0) to maintain the same async behavior as window.dispatchEvent
    // This prevents listeners from blocking the emitter
    set.forEach((listener) => {
      try {
        listener(payload);
      } catch (error) {
        console.error(`[EventBus] Error in listener for "${event}":`, error);
      }
    });
  }

  /**
   * Check if an event has any active listeners.
   * Useful for debugging dead events.
   */
  hasListeners(event: EventName): boolean {
    const set = this.listeners.get(event);
    return !!set && set.size > 0;
  }

  /**
   * Get count of listeners for an event.
   */
  listenerCount(event: EventName): number {
    const set = this.listeners.get(event);
    return set ? set.size : 0;
  }

  /**
   * Clear all listeners. Primarily for testing.
   */
  clear(): void {
    this.listeners.clear();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const eventBus = new EventBus();
