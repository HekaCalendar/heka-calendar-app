/**
 * Enterprise SSO login button.
 *
 * Supports SAML/OIDC flows. The actual IdP redirect is project-specific;
 * this component provides the wiring and a styled entry point.
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { signInWithSAML, signInWithOIDC, type SSOProvider } from '../../services/enterpriseAuth';

interface SSOLoginButtonProps {
  provider?: SSOProvider;
  domain?: string;
  onSuccess?: (user: { uid: string; email: string; orgId: string }) => void;
  onError?: (error: Error) => void;
}

export const SSOLoginButton: React.FC<SSOLoginButtonProps> = ({
  provider = 'saml',
  domain: initialDomain,
  onSuccess,
  onError,
}) => {
  const { t } = useTranslation('auth');
  const [domain, setDomain] = useState(initialDomain || '');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!domain) return;
    setLoading(true);
    try {
      // In a real SAML flow, redirect to the IdP first, then call signInWithSAML
      // with the returned assertion. This stub demonstrates the API surface.
      if (provider === 'saml') {
        // window.location.href = await getSAMLRedirectUrl(domain);
        const user = await signInWithSAML(domain, 'stub-assertion');
        onSuccess?.(user);
      } else {
        const user = await signInWithOIDC(domain, { code: 'stub-code' });
        onSuccess?.(user);
      }
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sso-login">
      <input
        className="sso-login__input"
        type="text"
        placeholder={t('enterprise.domainPlaceholder') || 'company.com'}
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <button
        className="sso-login__btn"
        onClick={handleLogin}
        disabled={!domain || loading}
      >
        {loading ? t('enterprise.signingIn') || 'Signing in…' : t('enterprise.signInWithSSO') || 'Sign in with SSO'}
      </button>
    </div>
  );
};
