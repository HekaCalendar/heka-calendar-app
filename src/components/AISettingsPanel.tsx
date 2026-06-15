/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AI SETTINGS PANEL - Reusable Universal AI Configuration
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Embeddable in JournalSettings, Calendar SettingsPanel, StarsHub, etc.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { aiConfigService, type UnifiedAIConfig, type AIArea } from '../services/aiConfigService';
import { secureKeyStore } from '../services/secureKeyStore';
import { aiProviderManager, type AIProviderType } from '../astrology/services/ai/aiProvider';

const PROVIDER_META: Record<AIProviderType, { name: string; icon: string; description: string; color: string }> = {
  template: { name: 'Template Library', icon: '📚', description: '169+ hand-crafted templates woven into thousands of unique readings. Free, instant, no API key.', color: '#fbbf24' },
  groq: { name: 'Groq', icon: '⚡', description: 'Llama 3 via Groq. Free tier: 1M tokens/day.', color: '#f43f5e' },
  openai: { name: 'OpenAI', icon: '🤖', description: 'GPT-4 / GPT-4o-mini. Requires API key.', color: '#10a37f' },
  anthropic: { name: 'Anthropic', icon: '🧠', description: 'Claude AI. Requires API key.', color: '#d97757' },
  ollama: { name: 'Ollama', icon: '🏠', description: 'Local models. Requires Ollama installation.', color: '#8b5cf6' },
  proxy: { name: 'HEKA AI Proxy', icon: '🛡️', description: 'Server-managed AI with rate limiting and audit logging. No client key required.', color: '#c9a227' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER SETUP GUIDES — Step-by-step instructions with links
// ═══════════════════════════════════════════════════════════════════════════════

interface SetupGuide {
  keyFormat: string;
  placeholder: string;
  signupUrl: string;
  keysUrl: string;
  freeTier: string;
  steps: { title: string; desc: string; action?: string; link?: string; tip?: string }[];
}

const PROVIDER_GUIDES: Record<Exclude<AIProviderType, 'template'>, SetupGuide> = {
  proxy: {
    keyFormat: 'No key required',
    placeholder: '',
    signupUrl: '',
    keysUrl: '',
    freeTier: 'Managed by your organization',
    steps: [
      { title: 'Enable AI Proxy', desc: 'Your admin configures the proxy server with provider keys.', tip: 'No API key is stored on this device' },
      { title: 'Select Proxy Provider', desc: 'Choose HEKA AI Proxy to route all requests through the backend.', tip: 'Prompts are audited for compliance' },
    ],
  },
  groq: {
    keyFormat: 'Starts with "gsk_" followed by alphanumeric characters',
    placeholder: 'gsk_your_api_key_here',
    signupUrl: 'https://console.groq.com/login',
    keysUrl: 'https://console.groq.com/keys',
    freeTier: '1,000,000 tokens/day free',
    steps: [
      { title: 'Create a Groq Account', desc: 'Visit the Groq Console and sign up for free.', action: 'Go to Groq →', link: 'https://console.groq.com/login', tip: 'Use your email or Google account' },
      { title: 'Navigate to API Keys', desc: 'Click "API Keys" in the left sidebar.', action: 'Open API Keys →', link: 'https://console.groq.com/keys' },
      { title: 'Create New API Key', desc: 'Click "Create API Key". Name it "HEKA Calendar".', tip: 'Groq only shows the full key once — copy it immediately!' },
      { title: 'Paste Key Below', desc: 'Copy the key (starts with gsk_) and paste it here.', tip: 'Your key stays on this device only' },
    ],
  },
  openai: {
    keyFormat: 'Starts with "sk-" followed by alphanumeric characters',
    placeholder: 'sk-your_api_key_here',
    signupUrl: 'https://platform.openai.com/signup',
    keysUrl: 'https://platform.openai.com/api-keys',
    freeTier: '$5 in free credits for new users',
    steps: [
      { title: 'Create OpenAI Account', desc: 'Sign up at OpenAI Platform. Phone verification required.', action: 'Sign Up →', link: 'https://platform.openai.com/signup', tip: 'Have your phone ready for SMS verification' },
      { title: 'Go to API Keys', desc: 'Click your profile → "User API Keys".', action: 'Open API Keys →', link: 'https://platform.openai.com/api-keys' },
      { title: 'Create Secret Key', desc: 'Click "Create new secret key". Name it "HEKA Calendar".', tip: 'OpenAI only shows the full key once!' },
      { title: 'Paste Key Below', desc: 'Copy the key (starts with sk-) and paste it here.', tip: 'Your key stays on this device only' },
    ],
  },
  anthropic: {
    keyFormat: 'Starts with "sk-ant-" followed by alphanumeric characters',
    placeholder: 'sk-ant-your_api_key_here',
    signupUrl: 'https://console.anthropic.com/login',
    keysUrl: 'https://console.anthropic.com/settings/keys',
    freeTier: '$5 in free credits for new users',
    steps: [
      { title: 'Sign Up for Anthropic', desc: 'Create an account at Anthropic Console.', action: 'Go to Anthropic →', link: 'https://console.anthropic.com/login', tip: 'Approval is usually quick' },
      { title: 'Access API Keys', desc: 'Go to Settings → API Keys.', action: 'Open API Keys →', link: 'https://console.anthropic.com/settings/keys' },
      { title: 'Generate API Key', desc: 'Click "Create Key". Name it "HEKA Calendar".', tip: 'You can create multiple keys for different apps' },
      { title: 'Paste Key Below', desc: 'Copy the key (starts with sk-ant-) and paste it here.', tip: 'Your key stays on this device only' },
    ],
  },
  ollama: {
    keyFormat: 'URL format: http://localhost:11434',
    placeholder: 'http://localhost:11434',
    signupUrl: 'https://ollama.com/download',
    keysUrl: '',
    freeTier: '100% free — runs locally on your device',
    steps: [
      { title: 'Download Ollama', desc: 'Install Ollama for Mac, Linux, or Windows.', action: 'Download →', link: 'https://ollama.com/download', tip: 'Windows requires WSL2' },
      { title: 'Install a Model', desc: 'Run: ollama pull llama3.2 in your terminal.', tip: 'Models are several GB to download' },
      { title: 'Start Ollama Server', desc: 'Run: ollama serve to start the API.', tip: 'Keep this terminal open' },
      { title: 'Paste URL Below', desc: 'Enter the server URL (usually http://localhost:11434).', tip: 'Runs entirely on your device — no cloud' },
    ],
  },
};

const AREA_META: Record<AIArea, { label: string; icon: string; description: string }> = {
  stars: { label: 'Stars', icon: '✨', description: 'Enhance celestial guidance & daily briefings' },
  journal: { label: 'Journal', icon: '📜', description: 'Poetic insights & reflection prompts' },
  calendar: { label: 'Calendar', icon: '📅', description: 'AI coach overlay with daily questions' },
  circle: { label: 'Circle', icon: '🔮', description: 'Social motivation & task encouragement' },
};

interface AISettingsPanelProps {
  /** If true, show only area toggles (provider already configured elsewhere) */
  compact?: boolean;
  /** Highlight a specific area as recommended */
  highlightArea?: AIArea;
  /** If true, show Template Library as a provider option. Defaults to false because Template Library is a Stars-only fallback. */
  showTemplateOption?: boolean;
}

export const AISettingsPanel: React.FC<AISettingsPanelProps> = ({ compact, highlightArea, showTemplateOption = false }) => {
  const { t } = useTranslation('settings');
  const [config, setConfig] = useState<UnifiedAIConfig>(aiConfigService.getConfig());
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [isProviderSet, setIsProviderSet] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  // Hydrate apiKey input from secure storage whenever provider changes
  const hydrateKey = useCallback(async (provider: AIProviderType) => {
    if (provider === 'template') {
      setApiKeyInput('');
      setIsProviderSet(true); // Template is always "configured"
      return;
    }
    if (provider === 'proxy') {
      setApiKeyInput('');
      setIsProviderSet(true); // Proxy is configured server-side
      return;
    }
    const storageKey = provider === 'ollama' ? 'heka-ai-ollama' : `heka-ai-${provider}`;
    try {
      const key = await secureKeyStore.get(storageKey);
      setApiKeyInput(key || '');
      setIsProviderSet(!!key);
    } catch (err) {
      console.warn('[AISettingsPanel] Failed to hydrate key:', err);
      setApiKeyInput('');
      setIsProviderSet(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = aiConfigService.subscribe((next) => {
      setConfig(next);
    });
    // Hydrate whenever provider changes
    void hydrateKey(config.provider);
    return () => {
      unsubscribe();
    };
  }, [config.provider, hydrateKey]);

  const handleProviderChange = useCallback((provider: AIProviderType) => {
    aiConfigService.setProvider(provider);
    setTestResult(null);
  }, []);

  const handleApiKeySave = useCallback(async () => {
    if (config.provider === 'proxy') {
      setIsProviderSet(true);
      setTestResult(null);
      return;
    }
    if (apiKeyInput.trim()) {
      await aiProviderManager.saveApiKey(config.provider, apiKeyInput.trim());
      setIsProviderSet(true);
    } else {
      await aiProviderManager.clearApiKey(config.provider);
      setIsProviderSet(false);
    }
    setTestResult(null);
  }, [apiKeyInput, config.provider]);

  const handleTestConnection = useCallback(async () => {
    if (config.provider === 'proxy') {
      setIsTesting(true);
      setTestResult(null);
      try {
        const ok = await aiProviderManager.validateApiKey('proxy', '');
        setTestResult({ ok, message: ok ? t('connectionSuccess') : t('connectionFailed') });
      } catch (err) {
        setTestResult({ ok: false, message: err instanceof Error ? err.message : t('connectionFailed') });
      } finally {
        setIsTesting(false);
      }
      return;
    }
    if (!apiKeyInput.trim()) return;
    setIsTesting(true);
    setTestResult(null);

    // Save before testing so the provider is configured with the new key/URL
    await aiProviderManager.saveApiKey(config.provider, apiKeyInput.trim());
    setIsProviderSet(true);

    const ok = await aiProviderManager.validateApiKey(config.provider, apiKeyInput.trim());
    setTestResult({ ok, message: ok ? t('connectionSuccess') : t('connectionFailed') });
    setIsTesting(false);
  }, [apiKeyInput, config.provider]);

  const toggleArea = useCallback((area: AIArea) => {
    const next = !config.areas[area];
    aiConfigService.setAreaEnabled(area, next);
  }, [config.areas]);

  const availableProviders = (Object.keys(PROVIDER_META) as AIProviderType[]).filter(
    (p) => showTemplateOption || p !== 'template'
  );

  const providerConfigured = config.provider !== 'template' && isProviderSet;
  const showCollapsedProvider = !compact && !isEditingProvider && providerConfigured;

  return (
    <div className="ai-settings-panel" style={{ color: '#e4e4e7' }}>
      {!compact && (
        <>
          {showCollapsedProvider ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.875rem 1rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                marginBottom: '1.25rem',
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{PROVIDER_META[config.provider].icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, color: '#f8f7f5' }}>{t(`provider${config.provider.charAt(0).toUpperCase() + config.provider.slice(1)}` as const)}</div>
                <div style={{ fontSize: '0.75rem', color: '#22c55e' }}>{t('connected')} • {t('apiKeyStored')}</div>
              </div>
              <button
                onClick={() => setIsEditingProvider(true)}
                aria-label="Change AI provider"
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#f8f7f5',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {t('change')}
              </button>
            </div>
          ) : (
            <>
              <div className="ai-settings-section" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                  {t('aiProvider')}
                </label>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {availableProviders.map((type) => {
                    const meta = PROVIDER_META[type];
                    const active = config.provider === type;
                    return (
                      <button
                        key={type}
                        onClick={() => handleProviderChange(type)}
                        aria-label={`Select ${meta.name} as AI provider`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          background: active ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${active ? meta.color : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: '10px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span style={{ fontSize: '1.25rem' }}>{meta.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, color: active ? '#f8f7f5' : '#d4d4d8' }}>{t(`provider${type.charAt(0).toUpperCase() + type.slice(1)}` as const)}</div>
                          <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{t(`${type}Desc` as const)}</div>
                        </div>
                        {active && <span style={{ color: meta.color, fontWeight: 600 }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {config.provider !== 'template' && (
                <div className="ai-settings-section" style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', marginBottom: '0.5rem' }}>
                    {config.provider === 'ollama' ? t('ollamaUrl') : t('aiApiKey')}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <input
                        type={config.provider === 'ollama' || showKey ? 'text' : 'password'}
                        value={apiKeyInput}
                        onChange={(e) => setApiKeyInput(e.target.value)}
                        onBlur={handleApiKeySave}
                        placeholder={
                          config.provider === 'ollama'
                            ? 'http://localhost:11434'
                            : (PROVIDER_GUIDES[config.provider]?.placeholder || PROVIDER_META[config.provider].name + ' API key')
                        }
                        style={{
                          width: '100%',
                          padding: '10px 36px 10px 12px',
                          background: '#0f0f11',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#f8f7f5',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                      {config.provider !== 'ollama' && (
                        <button
                          onClick={() => setShowKey((s) => !s)}
                          style={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#a1a1aa',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                        >
                          {showKey ? t('hide') : t('show')}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleTestConnection}
                      disabled={isTesting || !apiKeyInput.trim()}
                      style={{
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px',
                        color: '#f8f7f5',
                        fontSize: '13px',
                        cursor: apiKeyInput.trim() ? 'pointer' : 'not-allowed',
                        opacity: apiKeyInput.trim() ? 1 : 0.5,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {isTesting ? t('testing') : t('test')}
                    </button>
                  </div>
                  {testResult && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        fontSize: '0.8125rem',
                        color: testResult.ok ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {testResult.message}
                    </div>
                  )}
                  <>
                    <p style={{ fontSize: '12px', color: '#71717a', marginTop: '0.5rem' }}>
                      {PROVIDER_GUIDES[config.provider]?.keyFormat || ''} • Stored only on this device.
                    </p>
                      <button
                        onClick={() => setShowSetupGuide((s) => !s)}
                        style={{
                          marginTop: '0.75rem',
                          padding: '8px 12px',
                          background: 'rgba(212,175,55,0.08)',
                          border: '1px solid rgba(212,175,55,0.25)',
                          borderRadius: '8px',
                          color: '#d4af37',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{showSetupGuide ? '▾' : '▸'}</span>
                        {t('setupGuideFor')} {t(`provider${config.provider.charAt(0).toUpperCase() + config.provider.slice(1)}` as const)}
                      </button>
                      {showSetupGuide && (
                        <div
                          style={{
                            marginTop: '0.75rem',
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                          }}
                        >
                          <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '0.75rem' }}>
                            💡 <strong style={{ color: '#f8f7f5' }}>Free tier:</strong> {PROVIDER_GUIDES[config.provider].freeTier}
                          </div>
                          {PROVIDER_GUIDES[config.provider].steps.map((step, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  background: 'rgba(212,175,55,0.15)',
                                  color: '#d4af37',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  marginTop: 2,
                                }}
                              >
                                {i + 1}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: 500, color: '#f8f7f5' }}>{step.title}</div>
                                <div style={{ fontSize: '12px', color: '#a1a1aa', marginTop: 2 }}>{step.desc}</div>
                                {step.tip && (
                                  <div style={{ fontSize: '12px', color: '#d4af37', marginTop: 4, fontStyle: 'italic' }}>
                                    💡 {step.tip}
                                  </div>
                                )}
                                {step.link && (
                                  <a
                                    href={step.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: 'inline-block',
                                      marginTop: '6px',
                                      padding: '4px 10px',
                                      background: 'rgba(255,255,255,0.06)',
                                      border: '1px solid rgba(255,255,255,0.1)',
                                      borderRadius: '6px',
                                      color: '#f8f7f5',
                                      fontSize: '12px',
                                      textDecoration: 'none',
                                    }}
                                  >
                                    {step.action || 'Open →'}
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                </div>
              )}
            </>
          )}

          <div className="ai-settings-section" style={{ marginBottom: '1.25rem' }}>
            <label className="ai-toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.globalEnabled}
                onChange={(e) => aiConfigService.setGlobalEnabled(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#d4af37' }}
              />
              <span style={{ fontWeight: 500 }}>{t('enableAI')}</span>
            </label>
          </div>
        </>
      )}

      <div className="ai-settings-section">
        <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', marginBottom: '0.5rem' }}>
          {compact ? t('aiFeatures') : t('whereWouldYouLikeAI')}
        </label>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {(Object.keys(AREA_META) as AIArea[]).map((area) => {
            const meta = AREA_META[area];
            const enabled = config.globalEnabled && config.areas[area] && providerConfigured;
            const isHighlighted = highlightArea === area;
            return (
              <button
                key={area}
                onClick={() => toggleArea(area)}
                disabled={!config.globalEnabled || !providerConfigured}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: enabled ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isHighlighted ? 'rgba(212,175,55,0.5)' : enabled ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: '10px',
                  textAlign: 'left',
                  cursor: config.globalEnabled && providerConfigured ? 'pointer' : 'not-allowed',
                  opacity: config.globalEnabled && providerConfigured ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{meta.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, color: enabled ? '#f8f7f5' : '#d4d4d8' }}>
                    {t(`area${area.charAt(0).toUpperCase() + area.slice(1)}` as const)}
                    {isHighlighted && <span style={{ marginLeft: 6, fontSize: 10, color: '#d4af37' }}>{t('newBadge')}</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{t(`area${area.charAt(0).toUpperCase() + area.slice(1)}Desc` as const)}</div>
                </div>
                <div
                  style={{
                    width: 36,
                    height: 20,
                    borderRadius: 999,
                    background: enabled ? '#22c55e' : 'rgba(255,255,255,0.15)',
                    position: 'relative',
                    transition: 'background 0.2s ease',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: enabled ? 18 : 2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'left 0.2s ease',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
        {!providerConfigured && (
          <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '0.5rem' }}>
            {t('configureProviderFirst')}
          </p>
        )}
      </div>

      {/* Privacy & Security Footer */}
      <div
        style={{
          marginTop: '1.25rem',
          padding: '1rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          display: 'grid',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', color: '#a1a1aa' }}>
          <span>🔒</span>
          <span><strong style={{ color: '#f8f7f5' }}>{t('privacyFirst')}:</strong> {t('privacyNote')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', color: '#a1a1aa' }}>
          <span>📚</span>
          <span><strong style={{ color: '#f8f7f5' }}>{t('templateLibrary')}:</strong> {t('templateNote')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', color: '#a1a1aa' }}>
          <span>🤖</span>
          <span><strong style={{ color: '#f8f7f5' }}>{t('aiEnhancement')}:</strong> {t('aiEnhancementDesc')}</span>
        </div>
      </div>
    </div>
  );
};

export default AISettingsPanel;
