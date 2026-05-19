import { describe, it, expect } from 'vitest';
import { encryptState, decryptState, isEncryptedState } from '../src/utils/stateCrypto';

describe('stateCrypto', () => {
  it('encrypts and decrypts round-trip', async () => {
    const plaintext = JSON.stringify({ display: { showMoonPhases: true }, notes: { '2025-01-01': [] } });
    const encrypted = await encryptState(plaintext);
    expect(isEncryptedState(encrypted)).toBe(true);

    const decrypted = await decryptState(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('returns null for corrupted encrypted data', async () => {
    const corrupted = '__HEKA_ENC__' + btoa('not-valid-data');
    const decrypted = await decryptState(corrupted);
    expect(decrypted).toBeNull();
  });

  it('passes through legacy plaintext', async () => {
    const plaintext = '{"display":{"showMoonPhases":true}}';
    const decrypted = await decryptState(plaintext);
    expect(decrypted).toBe(plaintext);
  });

  it('handles empty string', async () => {
    const decrypted = await decryptState('');
    expect(decrypted).toBe('');
  });

  it('handles large payloads', async () => {
    const largeObj = { notes: Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`day-${i}`, [{ id: `n${i}`, content: 'x'.repeat(500) }]])) };
    const plaintext = JSON.stringify(largeObj);
    const encrypted = await encryptState(plaintext);
    const decrypted = await decryptState(encrypted);
    expect(decrypted).toBe(plaintext);
  });
});
