import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseDeepLink,
  generateInviteLink,
  generateWebInviteLink,
  getPendingInviteCode,
  hasPendingInvite,
  clearPendingInvite,
  getPendingTaskCode,
  hasPendingTaskShare,
  clearPendingTaskShare,
} from '../src/services/deepLinkService';

describe('deepLinkService', () => {
  beforeEach(() => {
    clearPendingInvite();
    clearPendingTaskShare();
    if (typeof window !== 'undefined') {
      sessionStorage.clear();
    }
  });

  describe('parseDeepLink', () => {
    it('parses invite link', () => {
      const result = parseDeepLink('heka-calendar://invite/ABC123');
      expect(result).toEqual({ type: 'invite', code: 'ABC123' });
    });

    it('parses invite link with path', () => {
      const result = parseDeepLink('heka-calendar://invite/path/to/code');
      expect(result).toEqual({ type: 'invite', code: 'path/to/code' });
    });

    it('parses task link', () => {
      const result = parseDeepLink('heka-calendar://task/TASK456');
      expect(result).toEqual({ type: 'task', taskId: 'TASK456' });
    });

    it('parses date link', () => {
      const result = parseDeepLink('heka-calendar://date/2024-06-15');
      expect(result).toEqual({ type: 'date', date: { year: 2024, month: 5, day: 15 } });
    });

    it('parses https invite link', () => {
      const result = parseDeepLink('https://heka.calendar/invite/MYCODE');
      expect(result).not.toBeNull();
      expect(result!.type).toBe('invite');
      expect(result!.code).toBeTruthy();
    });

    it('returns null for unknown URL', () => {
      expect(parseDeepLink('https://example.com')).toBeNull();
    });

    it('returns null for invalid URL', () => {
      expect(parseDeepLink('')).toBeNull();
    });

    it('handles malformed URLs gracefully', () => {
      expect(parseDeepLink('not-a-url')).toBeNull();
    });
  });

  describe('generateInviteLink', () => {
    it('generates custom scheme link', () => {
      expect(generateInviteLink('FRIEND789')).toBe('heka-calendar://invite/FRIEND789');
    });
  });

  describe('generateWebInviteLink', () => {
    it('generates web link with code', () => {
      const url = generateWebInviteLink('FRIEND789');
      expect(url).toContain('code=FRIEND789');
      expect(url).toContain('type=friend');
    });

    it('includes creator name when provided', () => {
      const url = generateWebInviteLink('FRIEND789', 'Alice');
      expect(url).toContain('from=Alice');
    });

    it('supports task type', () => {
      const url = generateWebInviteLink('TASK001', 'Bob', 'task');
      expect(url).toContain('type=task');
    });

    it('returns valid URL', () => {
      const url = generateWebInviteLink('TEST');
      expect(() => new URL(url)).not.toThrow();
    });
  });

  describe('pending invite state', () => {
    it('has no pending invite initially', () => {
      expect(hasPendingInvite()).toBe(false);
    });

    it('returns null when no pending invite', () => {
      expect(getPendingInviteCode()).toBeNull();
    });

    it('clears pending invite', () => {
      clearPendingInvite();
      expect(hasPendingInvite()).toBe(false);
    });
  });

  describe('pending task state', () => {
    it('has no pending task initially', () => {
      expect(hasPendingTaskShare()).toBe(false);
    });

    it('returns null when no pending task', () => {
      expect(getPendingTaskCode()).toBeNull();
    });

    it('clears pending task', () => {
      clearPendingTaskShare();
      expect(hasPendingTaskShare()).toBe(false);
    });
  });
});
