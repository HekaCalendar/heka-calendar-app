/**
 * Enterprise SSO client helpers.
 *
 * Bridges SAML/OIDC backends with Firebase Auth custom tokens.
 */

import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from './firebase';
import { monitoring } from './monitoring';

export type SSOProvider = 'saml' | 'oidc';

export interface SSOLoginResult {
  uid: string;
  email: string;
  displayName?: string;
  orgId: string;
}

/**
 * Sign in via a SAML assertion.
 * The assertion is typically returned by the enterprise IdP after a redirect.
 */
export async function signInWithSAML(domain: string, assertion: string): Promise<SSOLoginResult> {
  if (!functions) throw new Error('Firebase Functions not configured');
  const samlLogin = httpsCallable<{ domain: string; assertion: string }, { firebaseToken: string; user: SSOLoginResult }>(functions, 'samlLogin');
  const { data } = await samlLogin({ domain, assertion });
  await signInWithCustomToken(auth, data.firebaseToken);
  monitoring.setTag('sso_provider', 'saml');
  monitoring.setTag('org_id', data.user.orgId);
  return data.user;
}

/**
 * Sign in via an OIDC ID token or authorization code.
 */
export async function signInWithOIDC(
  domain: string,
  payload: { idToken?: string; code?: string }
): Promise<SSOLoginResult> {
  if (!functions) throw new Error('Firebase Functions not configured');
  const oidcLogin = httpsCallable<{ domain: string; idToken?: string; code?: string }, { firebaseToken: string; user: SSOLoginResult }>(functions, 'oidcLogin');
  const { data } = await oidcLogin({ domain, ...payload });
  await signInWithCustomToken(auth, data.firebaseToken);
  monitoring.setTag('sso_provider', 'oidc');
  monitoring.setTag('org_id', data.user.orgId);
  return data.user;
}

/**
 * Check whether the current user has an SSO enterprise claim.
 */
export function isEnterpriseUser(): boolean {
  const user = auth?.currentUser;
  if (!user) return false;
  const claims = (user as any).claims || {};
  return !!claims.sso && !!claims.orgId;
}
