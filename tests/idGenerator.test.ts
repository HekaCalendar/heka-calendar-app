import { describe, it, expect } from 'vitest';
import { generateId, generateShortId, generateUUID } from '../src/utils/idGenerator';

describe('idGenerator', () => {
  describe('generateId', () => {
    it('should return a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should contain a hyphen separator', () => {
      const id = generateId();
      expect(id).toContain('-');
    });

    it('should generate unique IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, generateId));
      expect(ids.size).toBe(100);
    });

    it('should have reasonable length', () => {
      const id = generateId();
      expect(id.length).toBeGreaterThan(10);
      expect(id.length).toBeLessThan(30);
    });
  });

  describe('generateShortId', () => {
    it('should return exactly 8 characters', () => {
      const id = generateShortId();
      expect(id.length).toBe(8);
    });

    it('should generate unique short IDs', () => {
      const ids = new Set(Array.from({ length: 100 }, generateShortId));
      expect(ids.size).toBe(100);
    });
  });

  describe('generateUUID', () => {
    it('should match UUID v4 format', () => {
      const uuid = generateUUID();
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
      );
    });

    it('should generate unique UUIDs', () => {
      const uuids = new Set(Array.from({ length: 100 }, generateUUID));
      expect(uuids.size).toBe(100);
    });
  });
});
