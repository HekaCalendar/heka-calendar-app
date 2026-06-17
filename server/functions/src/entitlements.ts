/**
 * Server-validated entitlements.
 *
 * Returns the user's active subscription tier, features, and quota usage.
 * Supports Stripe and RevenueCat as backend validation sources.
 */

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { writeAudit } from './audit';

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

interface ValidationSource {
  name: 'stripe' | 'revenuecat' | 'firebase';
  status: string;
  tier?: string;
  expiresAt?: number;
}

async function validateStripe(uid: string): Promise<ValidationSource | null> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) return null;

  try {
    const db = admin.firestore();
    const customerSnap = await db.collection('stripe_customers').doc(uid).get();
    if (!customerSnap.exists) return null;

    const subscriptionsSnap = await db.collection('stripe_customers').doc(uid).collection('subscriptions').get();
    let activeTier: string | undefined;
    let expiresAt: number | undefined;

    subscriptionsSnap.forEach((doc) => {
      const data = doc.data();
      if (data.status === 'active' || data.status === 'trialing') {
        activeTier = data.role || data.price_id || 'pro';
        expiresAt = data.current_period_end?.seconds ? data.current_period_end.seconds * 1000 : undefined;
      }
    });

    if (!activeTier) return { name: 'stripe', status: 'inactive' };
    return { name: 'stripe', status: 'active', tier: activeTier, expiresAt };
  } catch (err) {
    console.warn('[Entitlements] Stripe validation failed:', (err as Error).message);
    return null;
  }
}

async function validateRevenueCat(uid: string): Promise<ValidationSource | null> {
  const revenueCatKey = process.env.REVENUECAT_SECRET_KEY;
  if (!revenueCatKey) return null;

  try {
    const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${uid}`, {
      headers: {
        Authorization: `Bearer ${revenueCatKey}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const entitlements = data.subscriber?.entitlements || {};
    const active = Object.values(entitlements).find((e: any) => e?.expires_date_ms > Date.now());
    if (!active) return { name: 'revenuecat', status: 'inactive' };
    return {
      name: 'revenuecat',
      status: 'active',
      tier: (active as any).identifier,
      expiresAt: (active as any).expires_date_ms,
    };
  } catch (err) {
    console.warn('[Entitlements] RevenueCat validation failed:', (err as Error).message);
    return null;
  }
}

function tierToClaims(tier: string, expiresAt?: number): EntitlementClaim {
  switch (tier) {
    case 'enterprise':
      return {
        tier: 'enterprise',
        features: ['ai_unlimited', 'cloud_backup', 'circle_unlimited', 'sso', 'audit_logs', 'custom_branding'],
        expiresAt,
        quota: { aiRequestsPerHour: 1000, cloudStorageBytes: 10 * 1024 * 1024 * 1024, circleMembers: 500 },
      };
    case 'pro':
      return {
        tier: 'pro',
        features: ['ai_limited', 'cloud_backup', 'circle_10', 'journal_advanced'],
        expiresAt,
        quota: { aiRequestsPerHour: 60, cloudStorageBytes: 500 * 1024 * 1024, circleMembers: 10 },
      };
    default:
      return {
        tier: 'free',
        features: ['calendar', 'journal_basic', 'circle_3'],
        expiresAt,
        quota: { aiRequestsPerHour: 5, cloudStorageBytes: 50 * 1024 * 1024, circleMembers: 3 },
      };
  }
}

export const getEntitlements = functions
  .region('australia-southeast1')
  .https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentication required');
  }

  const uid = context.auth.uid;
  const user = await admin.auth().getUser(uid);

  // Custom claim overrides (for manual enterprise grants / SAML).
  const customClaims = user.customClaims || {};
  if (customClaims.tier) {
    const claim = tierToClaims(customClaims.tier, customClaims.expiresAt);
    await writeAudit({
      actorId: uid,
      actorEmail: user.email,
      action: 'entitlements.checked',
      resource: 'entitlements',
      details: { source: 'custom_claims', tier: claim.tier },
      ip: context.rawRequest?.ip,
      userAgent: context.rawRequest?.headers['user-agent'],
    });
    return claim;
  }

  // Validate against Stripe / RevenueCat.
  const stripe = await validateStripe(uid);
  const revenuecat = await validateRevenueCat(uid);

  const active = [stripe, revenuecat].find((s) => s?.status === 'active');
  const claim = active ? tierToClaims(active.tier || 'pro', active.expiresAt) : tierToClaims('free');

  await writeAudit({
    actorId: uid,
    actorEmail: user.email,
    action: 'entitlements.checked',
    resource: 'entitlements',
    details: { sources: [stripe?.name, revenuecat?.name].filter(Boolean), tier: claim.tier },
    ip: context.rawRequest?.ip,
    userAgent: context.rawRequest?.headers['user-agent'],
  });

  return claim;
});
