/**
 * Lightweight state encryption using Web Crypto API.
 *
 * Generates a random AES-GCM key on first run and stores it in localStorage.
 * This is obfuscation-grade security — it prevents casual inspection of
 * localStorage contents (e.g., by browser extensions or shoulder-surfing)
 * but does NOT protect against a determined attacker with full device access.
 *
 * Encrypted payloads are prefixed with '__HEKA_ENC__' so we can detect
 * them and fall back gracefully on decryption failure.
 */

const KEY_STORAGE_KEY = '__heka_state_key__';
const ENCRYPTED_PREFIX = '__HEKA_ENC__';

/**
 * Generate or retrieve the AES-GCM key for state encryption.
 */
async function getOrCreateKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem(KEY_STORAGE_KEY);

  if (stored) {
    try {
      const keyData = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
      return await crypto.subtle.importKey('raw', keyData, { name: 'AES-GCM' }, false, [
        'encrypt',
        'decrypt',
      ]);
    } catch {
      // Fall through to generate new key
    }
  }

  // Generate new key
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ]);
  const exported = await crypto.subtle.exportKey('raw', key);
  const exportedB64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  localStorage.setItem(KEY_STORAGE_KEY, exportedB64);
  return key;
}

/**
 * Encrypt a plaintext string. Returns prefixed base64 ciphertext.
 */
export async function encryptState(plaintext: string): Promise<string> {
  try {
    const key = await getOrCreateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(plaintext)
    );

    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return ENCRYPTED_PREFIX + btoa(String.fromCharCode(...combined));
  } catch (err) {
    console.error('[StateCrypto] Encryption failed:', err);
    // If crypto fails, store plaintext (better than losing data)
    return plaintext;
  }
}

/**
 * Decrypt a ciphertext string. Returns null if decryption fails.
 * Handles both encrypted and legacy plaintext states.
 */
export async function decryptState(ciphertext: string): Promise<string | null> {
  // Legacy plaintext detection
  if (!ciphertext.startsWith(ENCRYPTED_PREFIX)) {
    return ciphertext;
  }

  try {
    const payload = ciphertext.slice(ENCRYPTED_PREFIX.length);
    const combined = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));

    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const key = await getOrCreateKey();
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (err) {
    console.error('[StateCrypto] Decryption failed (key mismatch or corruption):', err);
    return null;
  }
}

/**
 * Synchronous check: does this string look like an encrypted state?
 */
export function isEncryptedState(data: string): boolean {
  return data.startsWith(ENCRYPTED_PREFIX);
}
