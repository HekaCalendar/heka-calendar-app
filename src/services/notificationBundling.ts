/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SMART BUNDLING — Notification Summary System
 * When >3 notifications fire within a short window, bundle them into a
 * single summary notification to prevent notification fatigue and tray spam.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { NotificationRequest, NotificationTier } from '../types/notifications';

// ── Constants ────────────────────────────────────────────────────────────────

/** Time window (ms) within which notifications are considered "simultaneous" */
export const BUNDLE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/** Minimum number of notifications to trigger bundling */
export const BUNDLE_THRESHOLD = 3;

/** Max items to list in a bundle summary */
export const BUNDLE_MAX_ITEMS = 5;

// ── Types ────────────────────────────────────────────────────────────────────

export interface BundleGroup {
  windowStart: number;
  windowEnd: number;
  requests: NotificationRequest[];
}

export interface BundleResult {
  /** Original requests that should be sent individually */
  individual: NotificationRequest[];
  /** Bundled summary requests (one per group that exceeded threshold) */
  bundles: NotificationRequest[];
  /** Original requests that were consumed into bundles */
  consumed: NotificationRequest[];
}

// ── Bundling Logic ───────────────────────────────────────────────────────────

/**
 * Group notifications by time window and create summary bundles for groups
 * that exceed the threshold.
 */
export function bundleNotifications(requests: NotificationRequest[]): BundleResult {
  if (requests.length <= BUNDLE_THRESHOLD) {
    return { individual: requests, bundles: [], consumed: [] };
  }

  // Sort by schedule time
  const sorted = [...requests].sort((a, b) => a.scheduleAt.getTime() - b.scheduleAt.getTime());

  const groups: BundleGroup[] = [];
  let currentGroup: BundleGroup | null = null;

  for (const req of sorted) {
    const time = req.scheduleAt.getTime();
    if (!currentGroup || time > currentGroup.windowEnd) {
      currentGroup = {
        windowStart: time,
        windowEnd: time + BUNDLE_WINDOW_MS,
        requests: [req],
      };
      groups.push(currentGroup);
    } else {
      currentGroup.requests.push(req);
    }
  }

  const individual: NotificationRequest[] = [];
  const bundles: NotificationRequest[] = [];
  const consumed: NotificationRequest[] = [];

  for (const group of groups) {
    if (group.requests.length > BUNDLE_THRESHOLD) {
      const bundle = createBundleRequest(group);
      bundles.push(bundle);
      consumed.push(...group.requests);
    } else {
      individual.push(...group.requests);
    }
  }

  return { individual, bundles, consumed };
}

/**
 * Create a single summary notification from a group of requests.
 * Uses inbox-style listing with the highest-tier channel.
 */
function createBundleRequest(group: BundleGroup): NotificationRequest {
  const items = group.requests.slice(0, BUNDLE_MAX_ITEMS);
  const overflow = group.requests.length - BUNDLE_MAX_ITEMS;

  // Use the highest tier from the group for priority
  const tierOrder: NotificationTier[] = ['core', 'standard', 'ambient'];
  const highestTier = group.requests
    .map(r => r.tier)
    .sort((a, b) => tierOrder.indexOf(a) - tierOrder.indexOf(b))[0] || 'standard';

  // Determine section from the first core/standard request, or first request
  const section = group.requests.find(r => r.tier !== 'ambient')?.section
    || group.requests[0]?.section
    || 'planner';

  const titles = items.map(r => r.title);
  const bodies = items.map(r => r.body);

  const title = `${group.requests.length} celestial events`;
  const body = titles.join(' · ');
  const largeBody = bodies.join('\n\n');

  const inboxList = items.map((r, i) => `${i + 1}. ${r.title}: ${r.body.substring(0, 60)}${r.body.length > 60 ? '...' : ''}`);
  if (overflow > 0) {
    inboxList.push(`...and ${overflow} more`);
  }

  const scheduleAt = new Date(group.windowStart);

  return {
    type: 'bundle-summary',
    tier: highestTier,
    section,
    title,
    body,
    scheduleAt,
    // Rich notification fields
    largeBody,
    inboxList,
    summaryText: `${group.requests.length} events`,
    group: 'heka-bundle',
    groupSummary: true,
    channelId: getChannelForTier(highestTier),
    extra: {
      _bundleCount: group.requests.length,
      _bundleTypes: group.requests.map(r => r.type),
      _bundleTitles: titles,
    },
  };
}

function getChannelForTier(tier: NotificationTier): string {
  switch (tier) {
    case 'core': return 'heka_core';
    case 'standard': return 'heka_standard';
    case 'ambient': return 'heka_ambient';
    default: return 'heka_standard';
  }
}

/**
 * Check if a notification type should never be bundled (always sent individually).
 */
export function isNonBundleable(type: string): boolean {
  const nonBundleable = [
    'streak-protection',
    'streak-saver',
    'void-moon-entered',
    'void-moon-ended',
    'friend-request',
    'task-due-soon',
    'completion-celebration',
    'bundle-summary',
  ];
  return nonBundleable.includes(type);
}

/**
 * Filter out non-bundleable requests before bundling.
 * Returns [bundleable, nonBundleable]
 */
export function separateBundleable(requests: NotificationRequest[]): [NotificationRequest[], NotificationRequest[]] {
  const bundleable: NotificationRequest[] = [];
  const nonBundleable: NotificationRequest[] = [];
  for (const req of requests) {
    if (isNonBundleable(req.type)) {
      nonBundleable.push(req);
    } else {
      bundleable.push(req);
    }
  }
  return [bundleable, nonBundleable];
}
