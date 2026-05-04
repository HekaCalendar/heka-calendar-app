/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AI SELECTOR — HEKA Intelligence Setup (Phase 4)
 *
 * Two paths:
 *   HEKA Coach  → Built-in template intelligence. Free. No API key.
 *   HEKA AI     → Connect your own provider. Deeper personalization.
 *
 * Skippable. Integrates with aiConfigService + aiProviderManager + secureKeyStore.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setAIProvider, setAIModel, setAIApiKeyConfigured } from '../../store/setupSlice';
import { aiConfigService } from '../../services/aiConfigService';
import { aiProviderManager, type AIProviderType } from '../../astrology/services/ai/aiProvider';
import { secureKeyStore } from '../../services/secureKeyStore';

interface AISelectorProps {
  initialProvider: string | null;
  initialModel: string | null;
  initialConfigured: boolean;
  onNext: () => void;
  onBack: () => void;
  strings: {
    next: string;
    back: string;
    skip: string;
    hekaAI: string;
    aiDescription: string;
    aiSelectProvider: string;
    aiApiKey: string;
    aiTestConnection: string;
    aiConnectionSuccess: string;
    aiConnectionFailed: string;
    aiSkipDescription: string;
    aiUsingTemplate: string;
    aiModelSelect: string;
    aiSetUpLater: string;
    hekaCoachTitle: string;
    hekaCoachDesc: string;
    hekaAIDesc: string;
    apiKeyHelp: string;
  };
}

interface ProviderMeta {
  type: AIProviderType;
  name: string;
  icon: string;
  description: string;
  color: string;
  requiresKey: boolean;
  keyLabel: string;
  keyPlaceholder: string;
  helpUrl: string;
  helpText: string;
  models: { id: string; name: string }[];
}

const API_PROVIDERS: ProviderMeta[] = [
  {
    type: 'groq',
    name: 'Groq',
    icon: '⚡',
    description: 'Llama 3 via Groq. Blazing fast. Free tier: 1M tokens/day.',
    color: '#f43f5e',
    requiresKey: true,
    keyLabel: 'Groq API Key',
    keyPlaceholder: 'gsk_your_api_key_here',
    helpUrl: 'https://console.groq.com/keys',
    helpText: 'Sign up at groq.com → Console → API Keys → Create Key',
    models: [
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant' },
      { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B Versatile' },
    ],
  },
  {
    type: 'openai',
    name: 'OpenAI',
    icon: '🤖',
    description: 'GPT-4o / GPT-4o-mini. Industry standard. Requires billing.',
    color: '#10a37f',
    requiresKey: true,
    keyLabel: 'OpenAI API Key',
    keyPlaceholder: 'sk-your_api_key_here',
    helpUrl: 'https://platform.openai.com/api-keys',
    helpText: 'Go to platform.openai.com → API Keys → Create new secret key',
    models: [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4o', name: 'GPT-4o' },
    ],
  },
  {
    type: 'anthropic',
    name: 'Anthropic',
    icon: '🧠',
    description: 'Claude 3 Haiku / Sonnet. Elegant reasoning. Requires billing.',
    color: '#d97757',
    requiresKey: true,
    keyLabel: 'Anthropic API Key',
    keyPlaceholder: 'sk-ant-your_api_key_here',
    helpUrl: 'https://console.anthropic.com/settings/keys',
    helpText: 'Go to console.anthropic.com → Settings → API Keys → Create Key',
    models: [
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
    ],
  },
  {
    type: 'ollama',
    name: 'Ollama',
    icon: '🏠',
    description: 'Run AI locally on your machine. Free forever. Requires installation.',
    color: '#8b5cf6',
    requiresKey: true,
    keyLabel: 'Ollama Server URL',
    keyPlaceholder: 'http://localhost:11434',
    helpUrl: 'https://ollama.com/download',
    helpText: 'Download ollama.com → run `ollama pull llama3` → paste server URL',
    models: [
      { id: 'llama3', name: 'Llama 3' },
      { id: 'llama3.2', name: 'Llama 3.2' },
      { id: 'mistral', name: 'Mistral' },
    ],
  },
];

export const AISelector: React.FC<AISelectorProps> = ({
  initialProvider,
  initialModel,
  onNext,
  onBack,
  strings,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>(
    (initialProvider as AIProviderType) || 'template'
  );
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const providerMeta = API_PROVIDERS.find((p) => p.type === selectedProvider);

  // Hydrate API key from secure storage when provider changes
  useEffect(() => {
    let mounted = true;
    const hydrate = async () => {
      if (selectedProvider === 'template') {
        setApiKey('');
        setSelectedModel('');
        setTestResult(null);
        return;
      }
      const storageKey = selectedProvider === 'ollama' ? 'heka-ai-ollama' : `heka-ai-${selectedProvider}`;
      const key = await secureKeyStore.get(storageKey);
      if (!mounted) return;
      setApiKey(key || '');
      setTestResult(null);
      const defaultModel = providerMeta?.models[0]?.id;
      setSelectedModel((prev) => prev || initialModel || defaultModel || '');
    };
    void hydrate();
    return () => { mounted = false; };
  }, [selectedProvider, initialModel, providerMeta]);

  // Focus input when provider with key is selected
  useEffect(() => {
    if (providerMeta?.requiresKey && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [selectedProvider, providerMeta]);

  const handleProviderSelect = useCallback((type: AIProviderType) => {
    setSelectedProvider(type);
    setTestResult(null);
  }, []);

  const handleTestConnection = useCallback(async () => {
    if (!apiKey.trim() || selectedProvider === 'template') return;
    setIsTesting(true);
    setTestResult(null);

    try {
      const ok = await aiProviderManager.validateApiKey(selectedProvider, apiKey.trim());
      setTestResult({
        ok,
        message: ok ? strings.aiConnectionSuccess : strings.aiConnectionFailed,
      });
    } catch {
      setTestResult({ ok: false, message: strings.aiConnectionFailed });
    } finally {
      setIsTesting(false);
    }
  }, [apiKey, selectedProvider, strings]);

  const handleNext = useCallback(async () => {
    setIsSaving(true);
    try {
      if (selectedProvider === 'template') {
        aiConfigService.setProvider('template');
        aiConfigService.setGlobalEnabled(true);
        aiConfigService.setAreaEnabled('stars', true);
        aiConfigService.setAreaEnabled('journal', true);
        aiConfigService.setAreaEnabled('calendar', false);
        aiConfigService.setAreaEnabled('circle', true);
        aiConfigService.updateConfig({ model: undefined });
        aiProviderManager.setActiveProvider('template');
        dispatch(setAIProvider('template'));
        dispatch(setAIModel(null));
        dispatch(setAIApiKeyConfigured(false));
      } else {
        if (apiKey.trim()) {
          await aiProviderManager.saveApiKey(selectedProvider, apiKey.trim());
        }
        aiConfigService.setProvider(selectedProvider);
        aiConfigService.setGlobalEnabled(true);
        if (selectedModel) {
          aiConfigService.updateConfig({ model: selectedModel });
        }
        aiProviderManager.setActiveProvider(selectedProvider);
        dispatch(setAIProvider(selectedProvider));
        dispatch(setAIModel(selectedModel || null));
        dispatch(setAIApiKeyConfigured(!!apiKey.trim()));
      }
      onNext();
    } catch (err) {
      console.error('[AISelector] Save error:', err);
      onNext();
    } finally {
      setIsSaving(false);
    }
  }, [selectedProvider, apiKey, selectedModel, dispatch, onNext]);

  const handleSkip = useCallback(() => {
    aiConfigService.setProvider('template');
    aiConfigService.setGlobalEnabled(true);
    aiConfigService.setAreaEnabled('stars', true);
    aiConfigService.setAreaEnabled('journal', true);
    aiConfigService.setAreaEnabled('calendar', false);
    aiConfigService.setAreaEnabled('circle', true);
    aiProviderManager.setActiveProvider('template');
    dispatch(setAIProvider('template'));
    dispatch(setAIModel(null));
    dispatch(setAIApiKeyConfigured(false));
    onNext();
  }, [dispatch, onNext]);

  const openHelpUrl = (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="setup-step setup-step--ai" tabIndex={-1}>
      <h2 className="setup-step__title" tabIndex={-1}>{strings.hekaAI}</h2>
      <p className="setup-step__subtitle">{strings.aiDescription}</p>

      {/* ═══ HEKA Coach — Template Library ═══ */}
      <div className="ai-section">
        <div className="ai-section__header">
          <span className="ai-section__badge ai-section__badge--coach">Coach</span>
          <h3 className="ai-section__title">{strings.hekaCoachTitle}</h3>
        </div>
        <p className="ai-section__desc">{strings.hekaCoachDesc}</p>

        <button
          className={`ai-provider-card ${selectedProvider === 'template' ? 'ai-provider-card--active' : ''}`}
          onClick={() => handleProviderSelect('template')}
          role="radio"
          aria-checked={selectedProvider === 'template'}
          type="button"
        >
          <div className="ai-provider-card__header">
            <span className="ai-provider-card__icon" style={{ color: '#fbbf24' }} aria-hidden="true">📚</span>
            <div className="ai-provider-card__info">
              <span className="ai-provider-card__name">Template Library</span>
              <span className="ai-provider-card__desc">169+ hand-crafted celestial readings. Instant. Free. No setup.</span>
            </div>
          </div>
          {selectedProvider === 'template' && (
            <span className="ai-provider-card__check" aria-hidden="true">✓</span>
          )}
        </button>
      </div>

      {/* ═══ HEKA AI — API Providers ═══ */}
      <div className="ai-section">
        <div className="ai-section__header">
          <span className="ai-section__badge ai-section__badge--ai">AI</span>
          <h3 className="ai-section__title">HEKA AI</h3>
        </div>
        <p className="ai-section__desc">{strings.hekaAIDesc}</p>

        <div className="ai-provider-grid" role="radiogroup" aria-label={strings.aiSelectProvider}>
          {API_PROVIDERS.map((provider, index) => (
            <button
              key={provider.type}
              className={`ai-provider-card ${selectedProvider === provider.type ? 'ai-provider-card--active' : ''}`}
              onClick={() => handleProviderSelect(provider.type)}
              role="radio"
              aria-checked={selectedProvider === provider.type}
              type="button"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="ai-provider-card__header">
                <span
                  className="ai-provider-card__icon"
                  style={{ color: provider.color }}
                  aria-hidden="true"
                >
                  {provider.icon}
                </span>
                <div className="ai-provider-card__info">
                  <span className="ai-provider-card__name">{provider.name}</span>
                  <span className="ai-provider-card__desc">{provider.description}</span>
                </div>
              </div>
              {selectedProvider === provider.type && (
                <span className="ai-provider-card__check" aria-hidden="true">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Panel for selected API provider */}
      {providerMeta && (
        <div className="ai-config-panel">
          {/* API Key Input */}
          <div className="ai-config-field">
            <label className="ai-config-field__label" htmlFor="ai-api-key">
              {providerMeta.keyLabel}
            </label>
            <div className="ai-config-field__input-wrap">
              <input
                id="ai-api-key"
                ref={inputRef}
                type={showKey ? 'text' : 'password'}
                className="ai-config-field__input"
                placeholder={providerMeta.keyPlaceholder}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                className="ai-config-field__toggle"
                onClick={() => setShowKey((s) => !s)}
                type="button"
                aria-label={showKey ? 'Hide key' : 'Show key'}
                tabIndex={-1}
              >
                {showKey ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* API Key Help */}
          <div className="ai-key-help">
            <button
              className="ai-key-help__link"
              onClick={() => openHelpUrl(providerMeta.helpUrl)}
              type="button"
            >
              <span>🔗</span>
              <span>{strings.apiKeyHelp}</span>
            </button>
            <p className="ai-key-help__text">{providerMeta.helpText}</p>
          </div>

          {/* Model Selector */}
          {providerMeta.models.length > 0 && (
            <div className="ai-config-field">
              <label className="ai-config-field__label" htmlFor="ai-model-select">
                {strings.aiModelSelect}
              </label>
              <select
                id="ai-model-select"
                className="ai-config-field__select"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {providerMeta.models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Test Connection */}
          <div className="ai-config-actions">
            <button
              className="setup-btn setup-btn--ghost ai-test-btn"
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              type="button"
            >
              {isTesting ? (
                <>
                  <span className="ai-spinner" aria-hidden="true" />
                  {strings.aiTestConnection}
                </>
              ) : (
                strings.aiTestConnection
              )}
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div
              className={`ai-test-result ${testResult.ok ? 'ai-test-result--success' : 'ai-test-result--error'}`}
              role="status"
              aria-live="polite"
            >
              <span className="ai-test-result__icon" aria-hidden="true">
                {testResult.ok ? '✓' : '✕'}
              </span>
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Template info */}
      {selectedProvider === 'template' && (
        <div className="ai-template-info">
          <span aria-hidden="true">📚</span>
          <span>{strings.aiUsingTemplate}</span>
        </div>
      )}

      {/* Skip hint */}
      <p className="ai-skip-hint">{strings.aiSkipDescription}</p>

      {/* Navigation */}
      <div className="setup-step__actions">
        <button className="setup-btn setup-btn--ghost" onClick={onBack} type="button" disabled={isSaving}>
          {strings.back}
        </button>
        <button className="setup-btn setup-btn--ghost" onClick={handleSkip} type="button" disabled={isSaving}>
          {strings.aiSetUpLater}
        </button>
        <button
          className="setup-btn setup-btn--primary"
          onClick={handleNext}
          type="button"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="ai-spinner ai-spinner--light" aria-hidden="true" />
              {strings.next}
            </>
          ) : (
            strings.next
          )}
        </button>
      </div>
    </div>
  );
};
