/**
 * Offline Sync Engine
 *
 * Queues local mutations when the device is offline and surfaces conflicts
 * when the server copy has changed while the user was offline.
 *
 * This is a foundational scaffold. In production, pair it with Firestore's
 * onSnapshot metadata and IndexedDB persistence for full offline-first sync.
 */

import { eventBus } from './eventBus';

export type SyncEntityType = 'plannerTask' | 'journalEntry' | 'note' | 'energyVote';
export type ConflictResolution = 'local' | 'server' | 'merge';

export interface PendingMutation<T = unknown> {
  id: string;
  type: SyncEntityType;
  entityId: string;
  action: 'create' | 'update' | 'delete';
  payload: T;
  localVersion: number;
  serverVersion?: number;
  timestamp: number;
  retries: number;
}

export interface SyncConflict<T = unknown> {
  mutationId: string;
  entityId: string;
  type: SyncEntityType;
  local: T;
  server: T;
  resolve: (resolution: ConflictResolution, merged?: T) => void;
}

const STORAGE_KEY = 'heka-offline-mutations';
const MAX_RETRIES = 5;

function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

function loadQueue(): PendingMutation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: PendingMutation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Ignore storage errors.
  }
}

class OfflineSyncEngine {
  private queue: PendingMutation[] = [];
  private syncInProgress = false;

  constructor() {
    this.queue = loadQueue();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.flush());
    }
  }

  enqueue<T>(mutation: Omit<PendingMutation<T>, 'id' | 'timestamp' | 'retries'>): string {
    const id = `${mutation.type}:${mutation.entityId}:${Date.now()}`;
    const item: PendingMutation = {
      ...mutation,
      id,
      timestamp: Date.now(),
      retries: 0,
    } as PendingMutation;
    this.queue.push(item);
    saveQueue(this.queue);
    eventBus.emit('offline:mutationEnqueued', { mutation: item });

    if (isOnline()) {
      // Defer flush to let the caller finish its local update first.
      setTimeout(() => this.flush(), 0);
    }
    return id;
  }

  hasPendingConflict(entityId: string): boolean {
    return this.queue.some((m) => m.entityId === entityId);
  }

  getPendingCount(): number {
    return this.queue.length;
  }

  remove(mutationId: string): void {
    this.queue = this.queue.filter((m) => m.id !== mutationId);
    saveQueue(this.queue);
  }

  async flush(): Promise<void> {
    if (this.syncInProgress || !isOnline() || this.queue.length === 0) return;
    this.syncInProgress = true;
    eventBus.emit('offline:syncStarted', {});

    const remaining: PendingMutation[] = [];

    for (const mutation of this.queue) {
      try {
        const resolved = await this.applyMutation(mutation);
        if (resolved) {
          eventBus.emit('offline:mutationApplied', { mutation });
        } else {
          remaining.push(mutation);
        }
      } catch (err) {
        const retries = mutation.retries + 1;
        if (retries >= MAX_RETRIES) {
          eventBus.emit('offline:mutationFailed', { mutation, error: (err as Error).message });
        } else {
          remaining.push({ ...mutation, retries });
        }
      }
    }

    this.queue = remaining;
    saveQueue(this.queue);
    this.syncInProgress = false;
    eventBus.emit('offline:syncFinished', { pending: this.queue.length });
  }

  private async applyMutation(mutation: PendingMutation): Promise<boolean> {
    return new Promise((resolve) => {
      let settled = false;
      const handler = (result: { mutationId: string; success: boolean; conflict?: SyncConflict }) => {
        if (result.mutationId !== mutation.id) return;
        settled = true;
        unsubscribe();
        if (result.success) {
          resolve(true);
        } else if (result.conflict) {
          eventBus.emit('offline:conflict', result.conflict);
          resolve(false);
        } else {
          resolve(false);
        }
      };
      const unsubscribe = eventBus.subscribe('offline:applyMutation', handler);
      eventBus.emit('offline:requestApplyMutation', { mutation });

      setTimeout(() => {
        if (!settled) {
          unsubscribe();
          resolve(false);
        }
      }, 5000);
    });
  }

  resolveConflict<T>(conflict: SyncConflict<T>, resolution: ConflictResolution, merged?: T): void {
    conflict.resolve(resolution, merged);
    this.remove(conflict.mutationId);
    eventBus.emit('offline:conflictResolved', { conflict: conflict as SyncConflict, resolution });
  }
}

export const offlineSyncEngine = new OfflineSyncEngine();
