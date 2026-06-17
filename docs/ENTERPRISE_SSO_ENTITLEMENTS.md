# Enterprise SSO, Entitlements & Audit Logs

## Overview

HEKA now includes server-side scaffolding for enterprise features:

- **SSO/SAML/OIDC** login via Firebase custom tokens.
- **Server-validated entitlements** backed by Stripe, RevenueCat, or custom claims.
- **Immutable audit logs** for compliance.

## Files

- `server/functions/src/sso.ts` — SAML/OIDC login Callable Functions.
- `server/functions/src/entitlements.ts` — entitlement validation Callable Function.
- `server/functions/src/audit.ts` — audit log writer.
- `src/services/enterpriseAuth.ts` — client SSO helpers.
- `src/services/entitlementsClient.ts` — client entitlement fetcher.
- `src/components/enterprise/SSOLoginButton.tsx` — reusable SSO button.

## Configuration

Set these in your server environment (`.env.server`):

```bash
STRIPE_SECRET_KEY=sk_live_...
REVENUECAT_SECRET_KEY=sk_...
```

## SSO setup

1. Create a Firestore document at `/sso_config/{orgId}` with:

   ```json
   {
     "domain": "example.com",
     "tier": "enterprise"
   }
   ```

2. Replace the SAML/OIDC stub parsers in `server/functions/src/sso.ts` with a
   real library (passport-saml, samlify, or an OIDC client).

3. Add `SSOLoginButton` to your auth modal for enterprise users.

## Entitlements

Call `fetchEntitlements()` after sign-in. It returns the active tier, feature
flags, and quotas. Use `hasFeature(claim, 'sso')` or `isProOrHigher(claim)` to
 gate features.

## Audit logs

Every entitlement check and SSO login writes a record to
`/enterprise_audit_logs`. These documents are marked `immutable: true` and
should be protected by Firestore rules.
