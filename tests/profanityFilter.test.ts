import { describe, it, expect } from 'vitest';
import { containsProfanity, filterProfanity } from '../src/services/profanityFilter';

describe('profanityFilter', () => {
  describe('containsProfanity', () => {
    it('detects basic profanity', () => {
      expect(containsProfanity('This is shit')).toBe(true);
      expect(containsProfanity('You are an asshole')).toBe(true);
    });

    it('returns false for clean text', () => {
      expect(containsProfanity('Hello world')).toBe(false);
      expect(containsProfanity('What a beautiful day')).toBe(false);
    });

    it('detects single-char leet substitutions', () => {
      expect(containsProfanity('sh1t')).toBe(true);
      expect(containsProfanity('fvck')).toBe(true);
      expect(containsProfanity('d1ck')).toBe(true);
    });

    it('is case insensitive', () => {
      expect(containsProfanity('SHIT')).toBe(true);
      expect(containsProfanity('AssHole')).toBe(true);
    });

    it('returns false for empty string', () => {
      expect(containsProfanity('')).toBe(false);
    });

    it('returns false for non-string input', () => {
      expect(containsProfanity(null as any)).toBe(false);
      expect(containsProfanity(undefined as any)).toBe(false);
    });

    it('does not flag partial word matches', () => {
      expect(containsProfanity('classical')).toBe(false);
      expect(containsProfanity('scattered')).toBe(false);
    });

    it('detects spaced out profanity', () => {
      expect(containsProfanity('f u c k')).toBe(true);
    });
  });

  describe('filterProfanity', () => {
    it('replaces profanity with asterisks', () => {
      const result = filterProfanity('This is shit');
      expect(result).toContain('*');
      expect(result).not.toContain('shit');
    });

    it('leaves clean text unchanged', () => {
      expect(filterProfanity('Hello world')).toBe('Hello world');
    });

    it('handles multiple profanities', () => {
      const result = filterProfanity('shit and damn');
      expect(result).not.toContain('shit');
      expect(result).not.toContain('damn');
    });

    it('preserves original length of replacement', () => {
      const result = filterProfanity('shit');
      const asterisks = result.match(/\*/g);
      expect(asterisks?.length).toBeGreaterThanOrEqual(1);
    });

    it('returns empty string for empty input', () => {
      expect(filterProfanity('')).toBe('');
    });

    it('passes through non-string input', () => {
      expect(filterProfanity(null as any)).toBe(null);
      expect(filterProfanity(undefined as any)).toBe(undefined);
    });
  });
});
