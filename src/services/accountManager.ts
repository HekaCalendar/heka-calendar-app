/**
 * Account Manager - Safe multi-account login
 * Stores ONLY public profile info (email, displayName, photoURL, uid) in localStorage.
 * Passwords are NEVER stored.
 */

export interface KnownAccount {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

const STORAGE_KEY = 'heka_known_accounts';

function safeParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function getKnownAccounts(): KnownAccount[] {
  return safeParse(localStorage.getItem(STORAGE_KEY), []);
}

export function saveKnownAccount(account: KnownAccount): void {
  const accounts = getKnownAccounts();
  // Remove existing entry with same email to avoid duplicates
  const filtered = accounts.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
  // Add to front (most recent first)
  filtered.unshift(account);
  // Keep last 5 accounts max
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 5)));
}

export function removeKnownAccount(email: string): void {
  const accounts = getKnownAccounts();
  const filtered = accounts.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function clearKnownAccounts(): void {
  localStorage.removeItem(STORAGE_KEY);
}
