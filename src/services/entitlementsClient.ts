/**
 * Client-side entitlement validation.
 *
 * Fetches server-validated entitlements and keeps a cached copy in the Redux
 * store or local state. Always prefer the server response over local guesses.
 */

import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

export interface EntitlementClaim {
  tier: 'free' | 'pro' | 'enterprise';
  features: string[];
  expiresAt?: number;
  quota: {
    aiRequestsPerHour: number;
    cloudStorageBytes: number;
    circleMembers: number;
  };
}

const CACHE_KEY = 'heka-entitlements-cache';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedEntitlements {
  claim: EntitlementClaim;
  fetchedAt: number;
}

function loadCache(): CachedEntitlements | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedEntitlements;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(claim: EntitlementClaim): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ claim, fetchedAt: Date.now() }));
  } catch {
    // Ignore storage errors.
  }
}

export async function fetchEntitlements(forceRefresh = false): Promise<EntitlementClaim> {
  if (!forceRefresh) {
    const cached = loadCache();
    if (cached) return cached.claim;
  }

  if (!functions) {
    return {
      tier: 'free',
      features: ['calendar', 'journal_basic', 'circle_3'],
      quota: { aiRequestsPerHour: 5, cloudStorageBytes: 50 * 1024 * 1024, circleMembers: 3 },
    };
  }

  const getEntitlements = httpsCallable<Record<string, never>, EntitlementClaim>(functions, 'getEntitlements');
  const { data } = await getEntitlements({});
  saveCache(data);
  return data;
}

export function hasFeature(claim: EntitlementClaim, feature: string): boolean {
  return claim.features.includes(feature);
}

export function isProOrHigher(claim: EntitlementClaim): boolean {
  return claim.tier === 'pro' || claim.tier === 'enterprise';
}
