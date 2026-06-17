/**
 * Notification Bundling Tests
 */

import { describe, it, expect } from 'vitest';
import { bundleNotifications, separateBundleable, isNonBundleable } from '../src/services/notificationBundling';
import type { NotificationRequest } from '../src/types/notifications';

function makeReq(type: string, tier: any, minutesFromNow: number): NotificationRequest {
  const scheduleAt = new Date(Date.now() + minutesFromNow * 60 * 1000);
  return {
    type,
    tier,
    title: type,
    body: `Body for ${type}`,
    scheduleAt,
    section: 'planner',
  };
}

describe('bundleNotifications', () => {
  it('returns all individual when under threshold', () => {
    const reqs = [
      makeReq('daily-briefing', 'standard', 0),
      makeReq('daily-celestial-tips', 'standard', 1),
      makeReq('streak-saver', 'standard', 2),
    ];
    const result = bundleNotifications(reqs);
    expect(result.individual).toHaveLength(3);
    expect(result.bundles).toHaveLength(0);
    expect(result.consumed).toHaveLength(0);
  });

  it('creates a bundle when >3 in same window', () => {
    const reqs = [
      makeReq('daily-briefing', 'standard', 0),
      makeReq('daily-celestial-tips', 'standard', 1),
      makeReq('streak-saver', 'standard', 2),
      makeReq('holiday-reminder', 'ambient', 3),
      makeReq('month-start-reminder', 'ambient', 4),
    ];
    const result = bundleNotifications(reqs);
    expect(result.bundles).toHaveLength(1);
    expect(result.bundles[0].type).toBe('bundle-summary');
    expect(result.bundles[0].extra?._bundleCount).toBe(5);
    expect(result.individual).toHaveLength(0);
    expect(result.consumed).toHaveLength(5);
  });

  it('respects time windows — separate bundles for distant groups', () => {
    const reqs = [
      makeReq('a', 'standard', 0),
      makeReq('b', 'standard', 1),
      makeReq('c', 'standard', 2),
      makeReq('d', 'standard', 2),
      // gap > 5 min
      makeReq('e', 'standard', 10),
      makeReq('f', 'standard', 11),
      makeReq('g', 'standard', 12),
      makeReq('h', 'standard', 13),
    ];
    const result = bundleNotifications(reqs);
    expect(result.bundles).toHaveLength(2);
    expect(result.bundles[0].extra?._bundleCount).toBe(4);
    expect(result.bundles[1].extra?._bundleCount).toBe(4);
  });

  it('uses highest tier from bundle group', () => {
    const reqs = [
      makeReq('a', 'ambient', 0),
      makeReq('b', 'ambient', 1),
      makeReq('c', 'standard', 2),
      makeReq('d', 'ambient', 3),
    ];
    const result = bundleNotifications(reqs);
    expect(result.bundles[0].tier).toBe('standard');
  });

  it('includes inboxList with max 5 items + overflow', () => {
    // All within 4 minutes so they stay in one window (5 min window)
    const reqs = Array.from({ length: 7 }, (_, i) => makeReq(`evt-${i}`, 'ambient', i * 0.5));
    const result = bundleNotifications(reqs);
    expect(result.bundles[0].inboxList).toBeDefined();
    expect(result.bundles[0].inboxList!.length).toBe(6); // 5 items + "...and 2 more"
    expect(result.bundles[0].inboxList!.at(-1)).toContain('2 more');
  });
});

describe('separateBundleable', () => {
  it('separates non-bundleable types', () => {
    const reqs: NotificationRequest[] = [
      { ...makeReq('streak-protection', 'core', 0), section: 'planner' },
      { ...makeReq('friend-request', 'core', 0), section: 'circle' },
      { ...makeReq('daily-briefing', 'standard', 0), section: 'planner' },
    ];
    const [bundleable, nonBundleable] = separateBundleable(reqs);
    expect(nonBundleable).toHaveLength(2);
    expect(bundleable).toHaveLength(1);
    expect(bundleable[0].type).toBe('daily-briefing');
  });
});

describe('isNonBundleable', () => {
  it('returns true for critical types', () => {
    expect(isNonBundleable('streak-protection')).toBe(true);
    expect(isNonBundleable('void-moon-entered')).toBe(true);
    expect(isNonBundleable('friend-request')).toBe(true);
  });

  it('returns false for regular types', () => {
    expect(isNonBundleable('daily-briefing')).toBe(false);
    expect(isNonBundleable('holiday-reminder')).toBe(false);
  });
});
