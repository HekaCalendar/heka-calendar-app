/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SECURE KEY STORE - Enterprise-grade native encrypted storage
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Uses capacitor-secure-storage-plugin on mobile (Android Keystore / iOS Keychain)
 * Falls back to localStorage for web/PWA development
 */

import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

const FALLBACK_PREFIX = '__heka_secure__';

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
  async set(key: string, value: string): Promise<void> {
    memoryCache.delete(key);
    knownKeys = null; // Force refresh on next get
    inFlightKeysPromise = null;
    try {
      await SecureStoragePlugin.set({ key, value });
    } catch (err) {
      console.warn(`[SecureKeyStore] Native set failed for "${key}", falling back to localStorage:`, err);
      localStorage.setItem(`${FALLBACK_PREFIX}${key}`, value);
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
          inFlightKeysPromise = SecureStoragePlugin.keys().then(r => new Set(r.value));
        }
        knownKeys = await inFlightKeysPromise;
      }

      if (!knownKeys.has(key)) {
        // Key not in secure storage — check localStorage fallback
        const fallback = localStorage.getItem(`${FALLBACK_PREFIX}${key}`);
        memoryCache.set(key, fallback);
        return fallback;
      }

      const result = await SecureStoragePlugin.get({ key });
      const value = result.value ?? null;
      memoryCache.set(key, value);
      return value;
    } catch (err) {
      const fallback = localStorage.getItem(`${FALLBACK_PREFIX}${key}`);
      memoryCache.set(key, fallback);
      return fallback;
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
