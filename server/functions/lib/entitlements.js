"use strict";
/**
 * Server-validated entitlements.
 *
 * Returns the user's active subscription tier, features, and quota usage.
 * Supports Stripe and RevenueCat as backend validation sources.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntitlements = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const audit_1 = require("./audit");
async function validateStripe(uid) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret)
        return null;
    try {
        const db = admin.firestore();
        const customerSnap = await db.collection('stripe_customers').doc(uid).get();
        if (!customerSnap.exists)
            return null;
        const subscriptionsSnap = await db.collection('stripe_customers').doc(uid).collection('subscriptions').get();
        let activeTier;
        let expiresAt;
        subscriptionsSnap.forEach((doc) => {
            const data = doc.data();
            if (data.status === 'active' || data.status === 'trialing') {
                activeTier = data.role || data.price_id || 'pro';
                expiresAt = data.current_period_end?.seconds ? data.current_period_end.seconds * 1000 : undefined;
            }
        });
        if (!activeTier)
            return { name: 'stripe', status: 'inactive' };
        return { name: 'stripe', status: 'active', tier: activeTier, expiresAt };
    }
    catch (err) {
        console.warn('[Entitlements] Stripe validation failed:', err.message);
        return null;
    }
}
async function validateRevenueCat(uid) {
    const revenueCatKey = process.env.REVENUECAT_SECRET_KEY;
    if (!revenueCatKey)
        return null;
    try {
        const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${uid}`, {
            headers: {
                Authorization: `Bearer ${revenueCatKey}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok)
            return null;
        const data = await response.json();
        const entitlements = data.subscriber?.entitlements || {};
        const active = Object.values(entitlements).find((e) => e?.expires_date_ms > Date.now());
        if (!active)
            return { name: 'revenuecat', status: 'inactive' };
        return {
            name: 'revenuecat',
            status: 'active',
            tier: active.identifier,
            expiresAt: active.expires_date_ms,
        };
    }
    catch (err) {
        console.warn('[Entitlements] RevenueCat validation failed:', err.message);
        return null;
    }
}
function tierToClaims(tier, expiresAt) {
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
exports.getEntitlements = functions
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
        await (0, audit_1.writeAudit)({
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
    await (0, audit_1.writeAudit)({
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
