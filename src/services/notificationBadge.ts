/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION BADGE COUNT
 * Updates the app icon badge to show pending tasks and unread notifications.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { App } from '@capacitor/app';

interface CapacitorWindow {
  Capacitor?: {
    getPlatform?: () => string;
  };
}

const IS_NATIVE_APP = typeof (window as unknown as CapacitorWindow).Capacitor !== 'undefined';

let currentBadge = 0;

/**
 * Update the app icon badge count.
 * On iOS: uses applicationIconBadgeNumber
 * On Android: uses ShortcutBadger or notification dot
 */
export async function setBadgeCount(count: number): Promise<void> {
  if (!IS_NATIVE_APP) return;

  currentBadge = Math.max(0, count);

  try {
    // Try Capacitor App plugin badge (if supported)
    const appWithBadge = App as unknown as { setBadgeCount?: (opts: { count: number }) => Promise<void> };
    if (appWithBadge.setBadgeCount) {
      await appWithBadge.setBadgeCount({ count: currentBadge });
    }
  } catch (e) {
    console.warn('[Badge] Failed to set badge:', e);
  }
}

/**
 * Increment badge count by 1.
 */
export async function incrementBadge(): Promise<void> {
  await setBadgeCount(currentBadge + 1);
}

/**
 * Decrement badge count by 1 (minimum 0).
 */
export async function decrementBadge(): Promise<void> {
  await setBadgeCount(Math.max(0, currentBadge - 1));
}

/**
 * Clear badge count.
 */
export async function clearBadge(): Promise<void> {
  await setBadgeCount(0);
}

/**
 * Get current badge count.
 */
export function getBadgeCount(): number {
  return currentBadge;
}
