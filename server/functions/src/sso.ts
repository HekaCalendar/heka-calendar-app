/**
 * Enterprise SSO/SAML/OIDC login functions.
 *
 * Real implementations using:
 * - samlify  for SAML 2.0 assertion parsing & signature verification
 * - openid-client + jose for OIDC code exchange / ID token validation
 *
 * IdP configuration is loaded from Firestore `sso_config/{domain}` and must
 * contain either a `saml.metadata` XML blob or `oidc.issuer` / `oidc.clientId`.
 */

import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import * as samlify from 'samlify';
import * as client from 'openid-client';
import * as jose from 'jose';
import { writeAudit } from './audit';

// samlify needs a schema validator registered. We skip XSD validation to avoid
// native libxml dependencies in Firebase Functions; signature verification is
// still performed by xml-crypto.
samlify.setSchemaValidator({
  validate: async () => 'skipped',
});

interface SAMLConfig {
  metadata: string;
  wantAssertionsSigned?: boolean;
  isAssertionEncrypted?: boolean;
}

interface OIDCConfig {
  issuer: string;
  clientId: string;
  clientSecret?: string;
  redirectUri?: string;
}

interface SSOOrgConfig {
  domain: string;
  tier?: string;
  saml?: SAMLConfig;
  oidc?: OIDCConfig;
}

interface SSOLoginRequest {
  provider: 'saml' | 'oidc';
  domain: string;
  assertion?: string; // Base64 SAML Response
  idToken?: string; // OIDC ID token
  code?: string; // OIDC authorization code
  state?: string; // OIDC state
  codeVerifier?: string; // OIDC PKCE code_verifier
  redirectUri?: string; // OIDC redirect_uri override
}

interface SSOLoginResponse {
  firebaseToken: string;
  user: {
    uid: string;
    email: string;
    displayName?: string;
    orgId: string;
  };
}

async function getOrgForDomain(domain: string): Promise<(SSOOrgConfig & { orgId: string }) | null> {
  const db = admin.firestore();
  const snapshot = await db
    .collection('sso_config')
    .where('domain', '==', domain.toLowerCase())
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  const data = doc.data() as SSOOrgConfig;
  return { orgId: doc.id, ...data };
}

async function createOrUpdateSSOUser(
  email: string,
  orgId: string,
  tier: string,
  displayName?: string
): Promise<admin.auth.UserRecord> {
  let user: admin.auth.UserRecord | undefined;
  try {
    user = await admin.auth().getUserByEmail(email);
  } catch (err: any) {
    if (err.code !== 'auth/user-not-found') {
      throw new functions.https.HttpsError('internal', `Auth lookup failed: ${err.message}`);
    }
  }

  if (!user) {
    user = await admin.auth().createUser({
      email,
      displayName,
      emailVerified: true,
    });
  }

  await admin.auth().setCustomUserClaims(user.uid, {
    orgId,
    sso: true,
    tier,
  });

  return user;
}

function normalizeEmail(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : undefined;
}

function pickDisplayName(attributes?: Record<string, unknown>): string | undefined {
  if (!attributes) return undefined;
  const candidates = [
    attributes.displayName,
    attributes.name,
    attributes.givenName,
    attributes.firstName,
  ];
  const first = candidates.find((v) => typeof v === 'string' && v.trim().length > 0) as string | undefined;
  if (first) return first.trim();

  const given = (attributes.givenName || attributes.firstName || '') as string;
  const family = (attributes.familyName || attributes.lastName || '') as string;
  const combined = `${given} ${family}`.trim();
  return combined.length > 0 ? combined : undefined;
}

async function parseSamlAssertion(
  assertion: string,
  org: SSOOrgConfig & { orgId: string }
): Promise<{ email: string; displayName?: string }> {
  if (!org.saml?.metadata) {
    throw new functions.https.HttpsError('failed-precondition', 'SAML not configured for this domain');
  }

  const entityID = process.env.SSO_SAML_ENTITY_ID || 'https://heka-calendar.web/sso/saml';

  const idp = samlify.IdentityProvider({
    metadata: org.saml.metadata,
    wantAuthnRequestsSigned: org.saml.wantAssertionsSigned ?? false,
    isAssertionEncrypted: org.saml.isAssertionEncrypted ?? false,
  });

  const sp = samlify.ServiceProvider({
    entityID,
    wantAssertionsSigned: org.saml.wantAssertionsSigned ?? true,
  });

  let result: Record<string, unknown>;
  try {
    const flowResult = await sp.parseLoginResponse(idp, 'post', {
      body: { SAMLResponse: assertion },
      query: {},
    });
    result = flowResult.extract as Record<string, unknown>;
  } catch (err: any) {
    console.error('[SSO] SAML parse failed:', err.message);
    throw new functions.https.HttpsError('unauthenticated', 'Invalid SAML assertion');
  }

  const attrs = (result.attributes as Record<string, unknown>) || {};
  const email =
    normalizeEmail(result.nameID) ||
    normalizeEmail(attrs.email) ||
    normalizeEmail(attrs.Email) ||
    normalizeEmail(attrs.mail);

  if (!email) {
    throw new functions.https.HttpsError('unauthenticated', 'SAML assertion did not contain an email');
  }

  return { email, displayName: pickDisplayName(attrs) };
}

async function verifyOidcIdToken(
  idToken: string,
  org: SSOOrgConfig & { orgId: string }
): Promise<{ email: string; displayName?: string }> {
  if (!org.oidc?.issuer || !org.oidc?.clientId) {
    throw new functions.https.HttpsError('failed-precondition', 'OIDC not configured for this domain');
  }

  const config = await client.discovery(
    new URL(org.oidc.issuer),
    org.oidc.clientId,
    org.oidc.clientSecret
  );

  const meta = config.serverMetadata();
  const jwksUri = meta.jwks_uri;
  if (!jwksUri) {
    throw new functions.https.HttpsError('internal', 'OIDC provider does not publish a JWKS URI');
  }

  let payload: jose.JWTPayload;
  try {
    const jwks = jose.createRemoteJWKSet(new URL(jwksUri));
    const verified = await jose.jwtVerify(idToken, jwks, {
      issuer: meta.issuer,
      audience: org.oidc.clientId,
    });
    payload = verified.payload;
  } catch (err: any) {
    console.error('[SSO] OIDC ID token verification failed:', err.message);
    throw new functions.https.HttpsError('unauthenticated', 'Invalid OIDC ID token');
  }

  const email = normalizeEmail(payload.email);
  if (!email) {
    throw new functions.https.HttpsError('unauthenticated', 'OIDC token did not contain an email');
  }

  const displayName =
    (typeof payload.name === 'string' && payload.name.trim()) ||
    `${(payload.given_name as string) || ''} ${(payload.family_name as string) || ''}`.trim() ||
    undefined;

  return { email, displayName };
}

async function exchangeOidcCode(
  code: string,
  data: SSOLoginRequest,
  org: SSOOrgConfig & { orgId: string }
): Promise<{ email: string; displayName?: string }> {
  if (!org.oidc?.issuer || !org.oidc?.clientId) {
    throw new functions.https.HttpsError('failed-precondition', 'OIDC not configured for this domain');
  }

  const redirectUri =
    data.redirectUri ||
    org.oidc.redirectUri ||
    process.env.SSO_OIDC_REDIRECT_URI;

  if (!redirectUri) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'redirectUri required (or set SSO_OIDC_REDIRECT_URI / sso_config.oidc.redirectUri)'
    );
  }

  const config = await client.discovery(
    new URL(org.oidc.issuer),
    org.oidc.clientId,
    org.oidc.clientSecret
  );

  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set('code', code);
  if (data.state) {
    callbackUrl.searchParams.set('state', data.state);
  }

  const checks: client.AuthorizationCodeGrantChecks = {
    expectedState: data.state || undefined,
  };
  if (data.codeVerifier) {
    checks.pkceCodeVerifier = data.codeVerifier;
  }

  let tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers;
  try {
    tokens = await client.authorizationCodeGrant(config, callbackUrl, checks);
  } catch (err: any) {
    console.error('[SSO] OIDC code exchange failed:', err.message);
    throw new functions.https.HttpsError('unauthenticated', 'OIDC authorization code exchange failed');
  }

  const claims = tokens.claims ? tokens.claims() : undefined;
  if (!claims?.email) {
    throw new functions.https.HttpsError('unauthenticated', 'OIDC token response did not contain an email');
  }

  const email = normalizeEmail(claims.email);
  if (!email) {
    throw new functions.https.HttpsError('unauthenticated', 'OIDC token response did not contain an email');
  }

  const displayName =
    (typeof claims.name === 'string' && claims.name.trim()) ||
    `${(claims.given_name as string) || ''} ${(claims.family_name as string) || ''}`.trim() ||
    undefined;

  return { email, displayName };
}

async function performSsoLogin(
  data: SSOLoginRequest,
  context: functions.https.CallableContext
): Promise<SSOLoginResponse> {
  const { domain } = data;
  if (!domain) {
    throw new functions.https.HttpsError('invalid-argument', 'domain required');
  }

  const org = await getOrgForDomain(domain);
  if (!org) {
    throw new functions.https.HttpsError('not-found', 'SSO not configured for domain');
  }

  const tier = org.tier || 'enterprise';
  let email: string;
  let displayName: string | undefined;

  if (data.provider === 'saml') {
    if (!data.assertion) {
      throw new functions.https.HttpsError('invalid-argument', 'assertion required');
    }
    const parsed = await parseSamlAssertion(data.assertion, org);
    email = parsed.email;
    displayName = parsed.displayName;
  } else {
    if (data.idToken) {
      const parsed = await verifyOidcIdToken(data.idToken, org);
      email = parsed.email;
      displayName = parsed.displayName;
    } else if (data.code) {
      const parsed = await exchangeOidcCode(data.code, data, org);
      email = parsed.email;
      displayName = parsed.displayName;
    } else {
      throw new functions.https.HttpsError('invalid-argument', 'idToken or code required');
    }
  }

  const user = await createOrUpdateSSOUser(email, org.orgId, tier, displayName);
  const firebaseToken = await admin.auth().createCustomToken(user.uid, {
    orgId: org.orgId,
    sso: true,
    tier,
  });

  await writeAudit({
    actorId: user.uid,
    actorEmail: email,
    action: 'sso.login',
    resource: 'sso',
    resourceId: org.orgId,
    details: { provider: data.provider, domain },
    ip: context.rawRequest?.ip,
    userAgent: context.rawRequest?.headers['user-agent'],
  });

  return {
    firebaseToken,
    user: { uid: user.uid, email, displayName, orgId: org.orgId },
  };
}

export const samlLogin = functions
  .region('australia-southeast1')
  .https.onCall(async (data: SSOLoginRequest, context) => {
  return performSsoLogin({ ...data, provider: 'saml' }, context);
});

export const oidcLogin = functions
  .region('australia-southeast1')
  .https.onCall(async (data: SSOLoginRequest, context) => {
  return performSsoLogin({ ...data, provider: 'oidc' }, context);
});
