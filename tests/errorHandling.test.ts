import { describe, it, expect, vi, beforeEach } from 'vitest';
import { safeAsync, withRetry, handleUnknownError } from '../src/utils/errorHandling';

describe('errorHandling', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('safeAsync', () => {
    it('returns success=true on resolved promise', async () => {
      const result = await safeAsync(Promise.resolve(42), 'test');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it('returns success=false on rejected promise', async () => {
      const result = await safeAsync(Promise.reject(new Error('boom')), 'test');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('boom');
      }
    });

    it('returns success=false on string rejection', async () => {
      const result = await safeAsync(Promise.reject('string error'), 'test');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe('string error');
      }
    });
  });

  describe('withRetry', () => {
    it('succeeds on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('ok');
      const result = await withRetry(fn, { maxRetries: 2, delayMs: 10 });
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('retries on transient errors and then succeeds', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce({ code: 'unavailable' })
        .mockResolvedValue('ok');
      const result = await withRetry(fn, { maxRetries: 2, delayMs: 10 });
      expect(result).toBe('ok');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('throws after exhausting retries on retryable errors', async () => {
      const err = new Error('persistent') as Error & { code: string };
      err.code = 'unavailable';
      const fn = vi.fn().mockRejectedValue(err);
      await expect(withRetry(fn, { maxRetries: 1, delayMs: 10 })).rejects.toThrow('persistent');
      expect(fn).toHaveBeenCalledTimes(2); // initial + 1 retry
    });

    it('does not retry generic errors without a retryable code', async () => {
      const fn = vi.fn().mockRejectedValue(new Error('persistent'));
      await expect(withRetry(fn, { maxRetries: 2, delayMs: 10 })).rejects.toThrow('persistent');
      expect(fn).toHaveBeenCalledTimes(1); // no retries
    });

    it('does not retry non-retryable errors', async () => {
      const fn = vi.fn().mockRejectedValue({ code: 'permission-denied' });
      await expect(withRetry(fn, { maxRetries: 2, delayMs: 10 })).rejects.toEqual({ code: 'permission-denied' });
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleUnknownError', () => {
    it('handles Error instances', () => {
      const result = handleUnknownError(new Error('test message'));
      expect(result.message).toBe('test message');
    });

    it('handles Error with code', () => {
      const err = new Error('firestore error') as Error & { code: string };
      err.code = 'unavailable';
      const result = handleUnknownError(err);
      expect(result.message).toBe('firestore error');
      expect(result.code).toBe('unavailable');
    });

    it('handles string errors', () => {
      const result = handleUnknownError('string error');
      expect(result.message).toBe('string error');
    });

    it('handles null/undefined', () => {
      const result = handleUnknownError(null);
      expect(result.message).toBe('An unknown error occurred');
    });

    it('handles plain objects', () => {
      const result = handleUnknownError({ foo: 'bar' });
      expect(result.message).toBe('An unknown error occurred');
    });
  });
});
