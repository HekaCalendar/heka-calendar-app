/**
 * Vitest setup file
 */

import 'fake-indexeddb/auto';

// Ensure crypto.randomUUID is available in jsdom
if (!globalThis.crypto) {
  (globalThis as any).crypto = {} as any;
}
if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}` as `${string}-${string}-${string}-${string}-${string}`;
}
