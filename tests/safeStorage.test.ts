import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  safeGet,
  safeSet,
  safeRemove,
  safeGetJson,
  safeSetJson,
  isStorageAvailable,
} from '../src/utils/safeStorage';

describe('safeStorage', () => {
  // localStorage keys are prefixed with 'heka-' internally

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('safeSet / safeGet', () => {
    it('should store and retrieve a string value', () => {
      expect(safeSet('test-key', 'hello')).toBe(true);
      expect(safeGet('test-key')).toBe('hello');
    });

    it('should prefix keys with heka-', () => {
      safeSet('mykey', 'value');
      expect(localStorage.getItem('heka-mykey')).toBe('value');
    });

    it('should return null for non-existent keys', () => {
      expect(safeGet('does-not-exist')).toBeNull();
    });

    it('should return null when localStorage is unavailable', () => {
      const original = window.localStorage;
      // @ts-expect-error simulate unavailable localStorage
      window.localStorage = undefined;
      expect(safeGet('any')).toBeNull();
      expect(safeSet('any', 'value')).toBe(false);
      window.localStorage = original;
    });
  });

  describe('safeRemove', () => {
    it('should remove a stored item', () => {
      safeSet('remove-me', 'value');
      expect(safeGet('remove-me')).toBe('value');
      safeRemove('remove-me');
      expect(safeGet('remove-me')).toBeNull();
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => safeRemove('never-set')).not.toThrow();
    });
  });

  describe('safeGetJson / safeSetJson', () => {
    it('should store and retrieve an object', () => {
      const data = { name: 'HEKA', version: 2 };
      expect(safeSetJson('config', data)).toBe(true);
      expect(safeGetJson('config', {})).toEqual(data);
    });

    it('should return default value for missing key', () => {
      const defaultValue = { fallback: true };
      expect(safeGetJson('missing', defaultValue)).toEqual(defaultValue);
    });

    it('should return default value for invalid JSON', () => {
      localStorage.setItem('heka-bad-json', 'not json');
      const defaultValue = { fallback: true };
      expect(safeGetJson('bad-json', defaultValue)).toEqual(defaultValue);
    });

    it('should handle arrays', () => {
      const data = [1, 2, 3];
      safeSetJson('arr', data);
      expect(safeGetJson('arr', [])).toEqual(data);
    });
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage works', () => {
      expect(isStorageAvailable()).toBe(true);
    });
  });
});
