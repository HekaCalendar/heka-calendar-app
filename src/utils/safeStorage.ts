/**
 * Safe Storage Utility
 * Defensive wrapper around localStorage that gracefully handles errors
 */

const PREFIX = 'heka-';

/**
 * Safely get an item from localStorage
 * Returns null if unavailable or error occurs
 */
export function safeGet(key: string): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    return localStorage.getItem(`${PREFIX}${key}`);
  } catch (e) {
    // Silent fail - private browsing, storage disabled, etc.
    return null;
  }
}

/**
 * Safely set an item in localStorage
 * Returns true if successful, false otherwise
 */
export function safeSet(key: string, value: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    localStorage.setItem(`${PREFIX}${key}`, value);
    return true;
  } catch (e) {
    // Silent fail - quota exceeded, private browsing, etc.
    console.warn(`[SafeStorage] Failed to set ${key}:`, e);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 */
export function safeRemove(key: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    localStorage.removeItem(`${PREFIX}${key}`);
  } catch (e) {
    // Silent fail
  }
}

/**
 * Safely parse JSON from localStorage
 * Returns defaultValue if parsing fails or item doesn't exist
 */
export function safeGetJson<T>(key: string, defaultValue: T): T {
  try {
    const item = safeGet(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    // Invalid JSON or other error
    return defaultValue;
  }
}

/**
 * Safely stringify and save to localStorage
 * Returns true if successful
 */
export function safeSetJson<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    return safeSet(key, serialized);
  } catch (e) {
    console.warn(`[SafeStorage] Failed to serialize ${key}:`, e);
    return false;
  }
}

/**
 * Check if localStorage is available and working
 */
export function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
