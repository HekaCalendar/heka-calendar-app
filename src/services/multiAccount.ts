/**
 * Multi-Account Management Service
 * Allows users to save and switch between multiple accounts
 */

import { logIn, logOut } from './firebase';

export interface SavedAccount {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  lastUsed: string; // ISO date
}

const STORAGE_KEY = 'heka_saved_accounts';
const MAX_SAVED_ACCOUNTS = 5;

/**
 * Get all saved accounts from localStorage
 */
export function getSavedAccounts(): SavedAccount[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load saved accounts:', error);
  }
  return [];
}

/**
 * Save an account to the list
 */
export function saveAccount(account: SavedAccount): void {
  try {
    const accounts = getSavedAccounts();
    
    // Check if account already exists
    const existingIndex = accounts.findIndex(a => a.uid === account.uid);
    if (existingIndex >= 0) {
      // Update existing account
      accounts[existingIndex] = { ...account, lastUsed: new Date().toISOString() };
    } else {
      // Add new account
      accounts.push({ ...account, lastUsed: new Date().toISOString() });
    }
    
    // Sort by last used (most recent first)
    accounts.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
    
    // Keep only max number of accounts
    const trimmedAccounts = accounts.slice(0, MAX_SAVED_ACCOUNTS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedAccounts));
  } catch (error) {
    console.error('Failed to save account:', error);
  }
}

/**
 * Remove an account from the saved list
 */
export function removeSavedAccount(uid: string): void {
  try {
    const accounts = getSavedAccounts();
    const filtered = accounts.filter(a => a.uid !== uid);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove saved account:', error);
  }
}

/**
 * Switch to a saved account (requires password)
 */
export async function switchToAccount(email: string, password: string): Promise<void> {
  // First logout current user
  await logOut();
  // Then login with the selected account
  await logIn(email, password);
}

/**
 * Check if an account is currently active
 */
export function isCurrentAccount(uid: string, currentUserId: string | null): boolean {
  return uid === currentUserId;
}

/**
 * Get account initials for avatar
 */
export function getAccountInitials(displayName: string | null, email: string): string {
  if (displayName) {
    return displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

/**
 * Generate a consistent color for an account based on email
 */
export function getAccountColor(email: string): string {
  const colors = [
    '#dc2626', '#ea580c', '#d97706', '#65a30d', '#16a34a',
    '#059669', '#0891b2', '#0284c7', '#2563eb', '#4f46e5',
    '#7c3aed', '#9333ea', '#c026d3', '#db2777', '#e11d48'
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
