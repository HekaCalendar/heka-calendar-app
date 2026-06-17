// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { getErrorMessage, getErrorCode } from '../src/utils/errorUtils';

describe('errorUtils', () => {
  describe('getErrorMessage', () => {
    it('extracts message from Error instance', () => {
      expect(getErrorMessage(new Error('boom'))).toBe('boom');
    });

    it('extracts message from string', () => {
      expect(getErrorMessage('plain string')).toBe('plain string');
    });

    it('extracts message from object with message property', () => {
      expect(getErrorMessage({ message: 'object error' })).toBe('object error');
    });

    it('returns fallback for null', () => {
      expect(getErrorMessage(null)).toBe('An unexpected error occurred');
    });

    it('returns fallback for undefined', () => {
      expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
    });

    it('returns fallback for number', () => {
      expect(getErrorMessage(42)).toBe('An unexpected error occurred');
    });

    it('returns custom fallback when provided', () => {
      expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
    });

    it('returns fallback when message is not a string', () => {
      expect(getErrorMessage({ message: 123 })).toBe('An unexpected error occurred');
    });

    it('prefers Error.message over object message', () => {
      const err = new Error('error msg');
      (err as Record<string, unknown>).message = 'overridden';
      expect(getErrorMessage(err)).toBe('overridden');
    });
  });

  describe('getErrorCode', () => {
    it('extracts code from object with code property', () => {
      expect(getErrorCode({ code: 'E123' })).toBe('E123');
    });

    it('returns undefined for Error without code', () => {
      expect(getErrorCode(new Error('no code'))).toBeUndefined();
    });

    it('extracts code from Error with code property', () => {
      const err = new Error('with code') as unknown as { code: string };
      err.code = 'AUTH_FAILED';
      expect(getErrorCode(err)).toBe('AUTH_FAILED');
    });

    it('returns undefined for null', () => {
      expect(getErrorCode(null)).toBeUndefined();
    });

    it('returns undefined for undefined', () => {
      expect(getErrorCode(undefined)).toBeUndefined();
    });

    it('returns undefined for string', () => {
      expect(getErrorCode('error')).toBeUndefined();
    });

    it('returns undefined when code is not a string', () => {
      expect(getErrorCode({ code: 404 })).toBeUndefined();
    });
  });
});
