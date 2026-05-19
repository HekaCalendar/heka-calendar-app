/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SECURE KEY STORE - Enterprise-grade native encrypted storage
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Uses capacitor-secure-storage-plugin on mobile (Android Keystore / iOS Keychain)
 * Falls back to localStorage for web/PWA development
 */

import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { eventBus } from './eventBus';

const FALLBACK_PREFIX = '__heka_secure__';

/**
 * One-time cleanup: scan localStorage for leftover plaintext secure keys
 * from older app versions and remove them.
 */
function cleanupPlaintextKeys(): void {
  try {
    const keysToDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(FALLBACK_PREFIX)) {
        keysToDelete.push(key);
      }
    }
    for (const key of keysToDelete) {
      console.warn('[SecureKeyStore] Removing plaintext key from localStorage:', key);
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore localStorage access errors
  }
}

// Run cleanup once on module load
cleanupPlaintextKeys();

// In-memory cache to avoid repeated native bridge calls (main thread blocking)
const memoryCache: Map<string, string | null> = new Map();
let knownKeys: Set<string> | null = null;

// Promise deduplication for the keys() call itself — multiple concurrent
// get() calls during startup should share a single keys() round-trip.
let inFlightKeysPromise: Promise<Set<string>> | null = null;

// Promise deduplication: concurrent requests for the same key share one
// native bridge round-trip instead of spawning multiple.
const inFlight: Map<string, Promise<string | null>> = new Map();

export const secureKeyStore = {
  /**
   * Store a value securely. Falls back to prefixed localStorage on web/errors.
   * Invalidates in-memory cache for the key.
   */
  async set(key: string, value: string): Promise<{ success: boolean }> {
    memoryCache.delete(key);
    knownKeys = null; // Force refresh on next get
    inFlightKeysPromise = null;
    try {
      await SecureStoragePlugin.set({ key, value });
      return { success: true };
    } catch (err) {
      console.warn(`[SecureKeyStore] Native set failed for "${key}":`, err);
      eventBus.emit('heka:secure-storage:unavailable', undefined);
      return { success: false };
    }
  },

  /**
   * Retrieve a value securely. Returns null if not found.
   * Uses an in-memory cache + promise dedup to avoid repeated native
   * bridge calls that block the main thread and cause frame drops.
   */
  async get(key: string): Promise<string | null> {
    // Return cached value immediately (no native bridge call)
    if (memoryCache.has(key)) {
      return memoryCache.get(key)!;
    }

    // If another call for the same key is already in flight, wait for it
    const existing = inFlight.get(key);
    if (existing) {
      return existing;
    }

    const promise = this._doGet(key);
    inFlight.set(key, promise);

    try {
      return await promise;
    } finally {
      inFlight.delete(key);
    }
  },

  /** Internal get implementation — do not call directly. */
  async _doGet(key: string): Promise<string | null> {
    try {
      // Batch-fetch known keys once per session to avoid repeated .keys() calls.
      // Deduplicate the keys() call so concurrent get()s share one round-trip.
      if (!knownKeys) {
        if (!inFlightKeysPromise) {
          inFlightKeysPromise = SecureStoragePlugin.keys()
            .then(r => new Set(r.value))
            .catch(err => {
              inFlightKeysPromise = null;
              console.warn('[SecureKeyStore] Failed to list keys:', err);
              return new Set<string>();
            });
        }
        knownKeys = await inFlightKeysPromise;
      }

      if (!knownKeys.has(key)) {
        memoryCache.set(key, null);
        return null;
      }

      const result = await SecureStoragePlugin.get({ key });
      const value = result.value ?? null;
      memoryCache.set(key, value);
      return value;
    } catch (err) {
      console.warn(`[SecureKeyStore] Get failed for "${key}":`, err);
      memoryCache.set(key, null);
      return null;
    }
  },

  /**
   * Remove a value from secure storage and fallback.
   */
  async remove(key: string): Promise<void> {
    memoryCache.delete(key);
    knownKeys = null;
    inFlightKeysPromise = null;
    try {
      await SecureStoragePlugin.remove({ key });
    } catch (err) {
      console.warn(`[SecureKeyStore] Native remove failed for "${key}":`, err);
    }
    localStorage.removeItem(`${FALLBACK_PREFIX}${key}`);
  },

  /**
   * One-time migration: move existing plaintext keys from localStorage
   * into secure storage and destroy the plaintext copies.
   */
  async migrate(): Promise<void> {
    const providers = ['groq', 'openai', 'anthropic'] as const;
    for (const provider of providers) {
      const legacyKey = `celestial-${provider}-key`;
      const value = localStorage.getItem(legacyKey);
      if (value) {
        await this.set(`heka-ai-${provider}`, value);
        localStorage.removeItem(legacyKey);
      }
    }

    const ollamaUrl = localStorage.getItem('celestial-ollama-url');
    if (ollamaUrl) {
      await this.set('heka-ai-ollama', ollamaUrl);
      localStorage.removeItem('celestial-ollama-url');
    }
  }
};

export default secureKeyStore;
