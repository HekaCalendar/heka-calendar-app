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

export const secureKeyStore = {
  /**
   * Store a value securely. Falls back to prefixed localStorage on web/errors.
   */
  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStoragePlugin.set({ key, value });
    } catch {
      localStorage.setItem(`${FALLBACK_PREFIX}${key}`, value);
    }
  },

  /**
   * Retrieve a value securely. Returns null if not found.
   */
  async get(key: string): Promise<string | null> {
    try {
      const result = await SecureStoragePlugin.get({ key });
      return result.value ?? null;
    } catch {
      const fallback = localStorage.getItem(`${FALLBACK_PREFIX}${key}`);
      return fallback;
    }
  },

  /**
   * Remove a value from secure storage and fallback.
   */
  async remove(key: string): Promise<void> {
    try {
      await SecureStoragePlugin.remove({ key });
    } catch {
      // ignore
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
