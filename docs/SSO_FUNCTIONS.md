# Enterprise SSO Functions

Firebase Callable Functions for SAML 2.0 and OIDC enterprise logins.

## Functions

- `samlLogin` — accepts a Base64 SAML `Response` and returns a Firebase custom
  token.
- `oidcLogin` — accepts an OIDC `idToken` or authorization `code` and returns a
  Firebase custom token.
- `deleteUserData` — authenticated account deletion with audit logging.
- `getEntitlements` — server-validated subscription tier and quotas.

## SAML configuration

For each organization, create a document in Firestore:

```text
collection: sso_config
document: <orgId>
```

Example SAML document:

```json
{
  "domain": "example.com",
  "tier": "enterprise",
  "saml": {
    "metadata": "<EntityDescriptor xmlns=\"urn:oasis:names:tc:SAML:2.0:metadata\" ...>...</EntityDescriptor>",
    "wantAssertionsSigned": true,
    "isAssertionEncrypted": false
  }
}
```

The function uses [samlify](https://samlify.js.org/) to verify the response
signature, time conditions, and issuer, then extracts the user's email from the
`NameID` or `email`/`Email`/`mail` attribute.

## OIDC configuration

Example OIDC document:

```json
{
  "domain": "example.com",
  "tier": "enterprise",
  "oidc": {
    "issuer": "https://accounts.google.com",
    "clientId": "your-client-id",
    "clientSecret": "your-client-secret",
    "redirectUri": "https://heka-calendar.web/sso/oidc/callback"
  }
}
```

- `idToken`: verified against the provider's JWKS using `openid-client` + `jose`.
- `code`: exchanged for tokens via the provider's token endpoint using
  `openid-client`.

For code exchange, pass the same `redirectUri`, `state`, and `codeVerifier` used
in the authorization request.

## Deployment

Build and deploy from `server/functions`:

```bash
cd server/functions
npm install
npm run build
firebase deploy --only functions
```

The project is already linked to `heka-calendar` via `.firebaserc`.

### Secrets

Set function secrets or environment variables for payment validation:

```bash
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set REVENUECAT_SECRET_KEY
```

If secrets are not configured, `getEntitlements` falls back to Firebase custom
claims (used by SAML users) or the free tier.

## User claims

SSO users receive custom claims:

```json
{
  "orgId": "<orgId>",
  "sso": true,
  "tier": "enterprise"
}
```

These claims are also embedded in the Firebase custom token returned to the
client.
