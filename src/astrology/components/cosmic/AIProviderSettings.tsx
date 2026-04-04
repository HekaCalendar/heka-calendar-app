/**
 * AI Provider Settings Component
 * Enterprise-grade interface for connecting AI providers with step-by-step guidance
 */

import React, { useState, useEffect, useCallback } from 'react';
import { aiProviderManager, type AIProviderType } from '../../services/ai/aiProvider';
import './AIProviderSettings.css';

interface AIProviderSettingsProps {
  onConfigChange?: (hasConfig: boolean) => void;
}

interface ProviderInfo {
  type: AIProviderType;
  name: string;
  description: string;
  website: string;
  signupUrl: string;
  apiKeysUrl: string;
  freeTierInfo: string;
  keyPlaceholder: string;
  keyFormat: string;
  setupSteps: SetupStep[];
  pricingNote: string;
  logo: string;
  color: string;
}

interface SetupStep {
  number: number;
  title: string;
  description: string;
  action?: string;
  link?: string;
  tip?: string;
}

const PROVIDER_SETUP: Record<AIProviderType, ProviderInfo> = {
  template: {
    type: 'template',
    name: 'Template Library',
    description: '26,000+ pre-written astrological interpretations. Always free, always instant, no setup required.',
    website: '',
    signupUrl: '',
    apiKeysUrl: '',
    freeTierInfo: 'Completely free',
    keyPlaceholder: '',
    keyFormat: '',
    logo: '📚',
    color: '#fbbf24',
    pricingNote: 'No costs ever. Powered by our curated template system.',
    setupSteps: [
      {
        number: 1,
        title: 'Select Template Library',
        description: 'This is the default option. No configuration needed.',
        tip: 'Templates cover all major celestial events and planetary positions'
      },
      {
        number: 2,
        title: 'Start Using Immediately',
        description: 'All astrological readings will use our pre-written template library.',
        tip: 'You can switch to AI providers anytime in the future'
      }
    ]
  },
  groq: {
    type: 'groq',
    name: 'Groq',
    description: 'Lightning-fast AI inference with Llama 3. Free tier includes 1M tokens daily.',
    website: 'https://groq.com',
    signupUrl: 'https://console.groq.com/login',
    apiKeysUrl: 'https://console.groq.com/keys',
    freeTierInfo: '1,000,000 tokens/day free',
    keyPlaceholder: 'gsk_your_api_key_here',
    keyFormat: 'Starts with "gsk_" followed by alphanumeric characters',
    logo: '⚡',
    color: '#f43f5e',
    pricingNote: 'Free tier: 1M tokens/day. Paid plans available for higher usage.',
    setupSteps: [
      {
        number: 1,
        title: 'Create a Groq Account',
        description: 'Visit the Groq Console and sign up for a free account.',
        action: 'Go to Groq Console →',
        link: 'https://console.groq.com/login',
        tip: 'Use your email or Google account for quick signup'
      },
      {
        number: 2,
        title: 'Navigate to API Keys',
        description: 'Once logged in, click "API Keys" in the left sidebar.',
        action: 'Open API Keys Page →',
        link: 'https://console.groq.com/keys',
        tip: 'Look for the key icon in the navigation menu'
      },
      {
        number: 3,
        title: 'Create New API Key',
        description: 'Click the "Create API Key" button. Give it a name like "HEKA Calendar".',
        tip: 'Choose a descriptive name so you remember what it\'s for'
      },
      {
        number: 4,
        title: 'Copy Your API Key',
        description: 'Copy the generated key (starts with "gsk_"). Store it securely - you won\'t see it again.',
        tip: '⚠️ For security, Groq only shows the full key once. If you lose it, create a new one.'
      },
      {
        number: 5,
        title: 'Paste Key in HEKA',
        description: 'Return to this screen and paste your key below. Click "Test Connection" to verify.',
        tip: 'Your key is stored only on this device'
      }
    ]
  },
  openai: {
    type: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 Turbo for nuanced astrological interpretations. Industry-leading quality.',
    website: 'https://openai.com',
    signupUrl: 'https://platform.openai.com/signup',
    apiKeysUrl: 'https://platform.openai.com/api-keys',
    freeTierInfo: '$5 in free credits for new users',
    keyPlaceholder: 'sk-your_api_key_here',
    keyFormat: 'Starts with "sk-" followed by alphanumeric characters',
    logo: '🤖',
    color: '#10a37f',
    pricingNote: 'Pay-per-use after free credits. GPT-3.5: ~$0.002 per 1K tokens.',
    setupSteps: [
      {
        number: 1,
        title: 'Create OpenAI Account',
        description: 'Sign up at OpenAI Platform. You\'ll need email verification and a phone number.',
        action: 'Sign Up at OpenAI →',
        link: 'https://platform.openai.com/signup',
        tip: 'Have your phone ready for SMS verification'
      },
      {
        number: 2,
        title: 'Add Payment Method (Optional)',
        description: 'While you get $5 in free credits, adding a payment method ensures uninterrupted service.',
        tip: 'You can set usage limits to control costs in Billing Settings'
      },
      {
        number: 3,
        title: 'Go to API Keys Section',
        description: 'Click your profile picture → "Your Profile" → "User API Keys" or visit the direct link.',
        action: 'Open API Keys →',
        link: 'https://platform.openai.com/api-keys',
        tip: 'Don\'t confuse this with "Project API Keys" - we need User API Keys'
      },
      {
        number: 4,
        title: 'Create New Secret Key',
        description: 'Click "Create new secret key". Name it "HEKA Calendar" for easy identification.',
        tip: '⚠️ OpenAI only shows the full key once. Copy it immediately!'
      },
      {
        number: 5,
        title: 'Configure in HEKA',
        description: 'Paste your key below and test the connection. Monitor usage in OpenAI dashboard.',
        tip: 'Set up billing alerts at platform.openai.com/settings/organization/billing/limits'
      }
    ]
  },
  anthropic: {
    type: 'anthropic',
    name: 'Anthropic',
    description: 'Claude AI for thoughtful, nuanced astrological guidance with extended context.',
    website: 'https://anthropic.com',
    signupUrl: 'https://console.anthropic.com/login',
    apiKeysUrl: 'https://console.anthropic.com/settings/keys',
    freeTierInfo: '$5 in free credits for new users',
    keyPlaceholder: 'sk-ant-your_api_key_here',
    keyFormat: 'Starts with "sk-ant-" followed by alphanumeric characters',
    logo: '🧠',
    color: '#d97757',
    pricingNote: 'Competitive rates. Claude 3 Haiku: ~$0.25 per 1K tokens.',
    setupSteps: [
      {
        number: 1,
        title: 'Sign Up for Anthropic',
        description: 'Create an account at Anthropic Console using your work email.',
        action: 'Go to Anthropic Console →',
        link: 'https://console.anthropic.com/login',
        tip: 'Anthropic may have a waitlist - approval is usually quick'
      },
      {
        number: 2,
        title: 'Verify Your Account',
        description: 'Check your email for verification link. Complete any required verification steps.',
        tip: 'Check spam folder if you don\'t see the email within a few minutes'
      },
      {
        number: 3,
        title: 'Access API Keys',
        description: 'In the console, go to Settings → API Keys or use the direct link below.',
        action: 'Open API Keys →',
        link: 'https://console.anthropic.com/settings/keys',
        tip: 'The settings gear icon is in the top-right corner'
      },
      {
        number: 4,
        title: 'Generate API Key',
        description: 'Click "Create Key". Give it a descriptive name like "HEKA Astrology".',
        tip: 'You can create multiple keys for different apps'
      },
      {
        number: 5,
        title: 'Copy and Configure',
        description: 'Copy the key (starts with "sk-ant-") and paste it below in HEKA.',
        tip: 'Keys never expire unless you revoke them manually'
      }
    ]
  },
  ollama: {
    type: 'ollama',
    name: 'Ollama (Local)',
    description: 'Run AI models entirely on your own device. Complete privacy, no internet needed after setup.',
    website: 'https://ollama.com',
    signupUrl: 'https://ollama.com/download',
    apiKeysUrl: '',
    freeTierInfo: '100% free - runs locally',
    keyPlaceholder: 'http://localhost:11434',
    keyFormat: 'URL format: http://localhost:11434',
    logo: '💻',
    color: '#ffffff',
    pricingNote: 'No costs. Requires capable hardware (8GB+ RAM recommended).',
    setupSteps: [
      {
        number: 1,
        title: 'Download Ollama',
        description: 'Download and install Ollama for your operating system (Mac, Linux, or Windows).',
        action: 'Download Ollama →',
        link: 'https://ollama.com/download',
        tip: 'Windows version is available via Windows Subsystem for Linux (WSL2)'
      },
      {
        number: 2,
        title: 'Install a Model',
        description: 'Open terminal and run: ollama pull llama3 or ollama pull mistral',
        tip: 'Llama 3 is recommended for best results. Models are several GB to download.'
      },
      {
        number: 3,
        title: 'Start Ollama Server',
        description: 'Run: ollama serve to start the local API server. Keep this terminal open.',
        tip: 'The server runs on http://localhost:11434 by default'
      },
      {
        number: 4,
        title: 'Verify Installation',
        description: 'Test by running: ollama run llama3 in another terminal. Type a test message.',
        tip: 'First run downloads the model. Subsequent runs are instant.'
      },
      {
        number: 5,
        title: 'Connect HEKA',
        description: 'Enter the server URL (usually http://localhost:11434) below and test connection.',
        tip: 'Ollama must be running whenever you want AI-enhanced readings'
      }
    ]
  }
};

export const AIProviderSettings: React.FC<AIProviderSettingsProps> = ({ onConfigChange }) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>('template');
  const [apiKey, setApiKey] = useState('');
  const [isKeyVisible, setIsKeyVisible] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeProvider, setActiveProvider] = useState<AIProviderType>('template');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse when configured
  useEffect(() => {
    if (isEnabled && activeProvider !== 'template') {
      // Auto-collapse after successful configuration
      const timer = setTimeout(() => setIsCollapsed(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isEnabled, activeProvider]);

  // Load saved configuration on mount
  useEffect(() => {
    const loadConfig = () => {
      const savedConfig = localStorage.getItem('celestial-ai-config');
      let active = 'template' as AIProviderType;
      
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig);
          if (config.activeProvider) {
            active = config.activeProvider;
          }
        } catch {
          // Invalid config, use defaults
        }
      }
      
      // Load existing keys
      const groqKey = localStorage.getItem('celestial-groq-key');
      const openaiKey = localStorage.getItem('celestial-openai-key');
      const anthropicKey = localStorage.getItem('celestial-anthropic-key');
      const ollamaUrl = localStorage.getItem('celestial-ollama-url');
      
      if (groqKey && active === 'groq') setApiKey(groqKey);
      if (openaiKey && active === 'openai') setApiKey(openaiKey);
      if (anthropicKey && active === 'anthropic') setApiKey(anthropicKey);
      if (ollamaUrl && active === 'ollama') setApiKey(ollamaUrl);
      
      setSelectedProvider(active);
      setActiveProvider(active);
      setIsEnabled(active !== 'template');
      setShowSetupGuide(active === 'template');
      onConfigChange?.(active !== 'template');
    };
    
    loadConfig();
  }, [onConfigChange]);

  const handleProviderChange = (provider: AIProviderType) => {
    setSelectedProvider(provider);
    setTestResult(null);
    setExpandedStep(1);
    setShowSetupGuide(true);
    
    // Load existing key if available
    if (provider !== 'template') {
      const key = localStorage.getItem(`celestial-${provider === 'ollama' ? 'ollama-url' : provider + '-key'}`);
      if (key) {
        setApiKey(key);
        setShowSetupGuide(false);
      } else {
        setApiKey('');
      }
    } else {
      setApiKey('');
    }
  };

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setTestResult(null);
    
    try {
      if (selectedProvider === 'template') {
        localStorage.setItem('celestial-ai-config', JSON.stringify({ 
          activeProvider: 'template',
          enabled: false 
        }));
        aiProviderManager.setActiveProvider('template');
        
        setActiveProvider('template');
        setIsEnabled(false);
        setTestResult({ success: true, message: '✓ Using Template Library' });
        onConfigChange?.(false);
      } else {
        if (!apiKey.trim()) {
          setTestResult({ success: false, message: 'Please enter an API key' });
          return;
        }
        
        const storageKey = selectedProvider === 'ollama' 
          ? 'celestial-ollama-url' 
          : `celestial-${selectedProvider}-key`;
        localStorage.setItem(storageKey, apiKey);
        
        aiProviderManager.configureProvider(selectedProvider, { 
          apiKey: apiKey.trim(),
          type: selectedProvider 
        });
        aiProviderManager.setActiveProvider(selectedProvider);
        
        localStorage.setItem('celestial-ai-config', JSON.stringify({ 
          activeProvider: selectedProvider,
          enabled: true 
        }));
        
        setActiveProvider(selectedProvider);
        setIsEnabled(true);
        setTestResult({ success: true, message: `✓ ${PROVIDER_SETUP[selectedProvider].name} connected` });
        onConfigChange?.(true);
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to save' 
      });
    } finally {
      setIsSaving(false);
    }
  }, [selectedProvider, apiKey, onConfigChange]);

  const handleTestConnection = useCallback(async () => {
    if (selectedProvider === 'template') {
      setTestResult({ success: true, message: '✓ Template Library is always available' });
      return;
    }
    
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key first' });
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      aiProviderManager.configureProvider(selectedProvider, { 
        apiKey: apiKey.trim(),
        type: selectedProvider 
      });
      
      const isValid = await aiProviderManager.validateApiKey(selectedProvider, apiKey.trim());
      
      if (isValid) {
        setTestResult({ success: true, message: '✓ Connection successful! API key is valid.' });
      } else {
        setTestResult({ success: false, message: '✗ Invalid API key. Please check and try again.' });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: '✗ Connection failed. Check your internet and API key.' 
      });
    } finally {
      setIsTesting(false);
    }
  }, [selectedProvider, apiKey]);

  const handleClearKey = useCallback(() => {
    if (selectedProvider !== 'template') {
      const storageKey = selectedProvider === 'ollama' 
        ? 'celestial-ollama-url' 
        : `celestial-${selectedProvider}-key`;
      localStorage.removeItem(storageKey);
      aiProviderManager.clearApiKey(selectedProvider);
    }
    
    setApiKey('');
    setTestResult(null);
    
    localStorage.setItem('celestial-ai-config', JSON.stringify({ 
      activeProvider: 'template',
      enabled: false 
    }));
    aiProviderManager.setActiveProvider('template');
    setSelectedProvider('template');
    setActiveProvider('template');
    setIsEnabled(false);
    setShowSetupGuide(true);
    onConfigChange?.(false);
  }, [selectedProvider, onConfigChange]);

  const selectedProviderInfo = PROVIDER_SETUP[selectedProvider];
  const isActive = selectedProvider === activeProvider && isEnabled;

  return (
    <div className="ai-provider-settings">
      {/* Header */}
      <div className="ai-settings-header">
        <div className="ai-settings-icon" style={{ 
          background: `linear-gradient(135deg, ${selectedProviderInfo.color}20, ${selectedProviderInfo.color}10)`,
          borderColor: `${selectedProviderInfo.color}40`
        }}>
          {selectedProviderInfo.logo}
        </div>
        <div className="ai-settings-title">
          <h4>AI-Enhanced Readings</h4>
          <p>Connect your AI provider for enhanced astrological interpretations</p>
        </div>
        {isEnabled && activeProvider !== 'template' && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ai-collapse-toggle"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? '⚙️' : '✕'}
          </button>
        )}
      </div>

      {/* Collapsed State - Quick View */}
      {isCollapsed && isEnabled && activeProvider !== 'template' ? (
        <div className="ai-collapsed-view">
          <div className="ai-collapsed-status">
            <span className="ai-status-dot active"></span>
            <span className="ai-collapsed-provider">
              Connected to {PROVIDER_SETUP[activeProvider].name}
            </span>
          </div>
          <p className="ai-collapsed-note">
            Your readings are being enhanced with AI. 
            <button 
              onClick={() => setIsCollapsed(false)}
              className="ai-collapsed-configure"
            >
              Change settings
            </button>
          </p>
        </div>
      ) : (
      <>
      {/* Status Badge */}
      <div className={`ai-status-badge ${isActive ? 'active' : 'inactive'}`}>
        <span className="ai-status-dot"></span>
        {isActive ? (
          <>
            <span className="ai-status-text">Active</span>
            <span className="ai-status-provider">{PROVIDER_SETUP[activeProvider].name}</span>
          </>
        ) : (
          <span className="ai-status-text">Using Template Library (Free)</span>
        )}
      </div>

      {/* Provider Selection */}
      <div className="ai-provider-grid">
        {(Object.values(PROVIDER_SETUP) as ProviderInfo[]).map((provider) => (
          <button
            key={provider.type}
            className={`ai-provider-card ${selectedProvider === provider.type ? 'selected' : ''} ${activeProvider === provider.type ? 'active' : ''}`}
            onClick={() => handleProviderChange(provider.type)}
          >
            <div className="ai-provider-card-header">
              <span className="ai-provider-logo" style={{ color: provider.color }}>
                {provider.logo}
              </span>
              {activeProvider === provider.type && (
                <span className="ai-active-indicator">✓</span>
              )}
            </div>
            <div className="ai-provider-card-name">{provider.name}</div>
            <div className="ai-provider-card-desc">{provider.description}</div>
            <div className="ai-provider-card-pricing">
              <span className="ai-pricing-badge" style={{ 
                background: `${provider.color}15`,
                color: provider.color 
              }}>
                {provider.freeTierInfo}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Setup Guide / Configuration Panel */}
      <div className="ai-config-panel">
        {selectedProvider !== 'template' && showSetupGuide && !apiKey && (
          <div className="ai-setup-guide">
            <div className="ai-setup-header">
              <h5>Setup Guide: {selectedProviderInfo.name}</h5>
              <button 
                className="ai-toggle-guide"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
              >
                {showSetupGuide ? 'Hide' : 'Show'} Guide
              </button>
            </div>
            
            <div className="ai-setup-steps">
              {selectedProviderInfo.setupSteps.map((step) => (
                <div 
                  key={step.number}
                  className={`ai-setup-step ${expandedStep === step.number ? 'expanded' : ''}`}
                >
                  <button 
                    className="ai-step-header"
                    onClick={() => setExpandedStep(expandedStep === step.number ? null : step.number)}
                  >
                    <span className="ai-step-number">{step.number}</span>
                    <span className="ai-step-title">{step.title}</span>
                    <span className="ai-step-toggle">{expandedStep === step.number ? '−' : '+'}</span>
                  </button>
                  
                  {expandedStep === step.number && (
                    <div className="ai-step-content">
                      <p className="ai-step-description">{step.description}</p>
                      
                      {step.action && step.link && (
                        <a 
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ai-step-action"
                          style={{ background: selectedProviderInfo.color }}
                        >
                          {step.action}
                        </a>
                      )}
                      
                      {step.tip && (
                        <div className="ai-step-tip">
                          <span className="ai-tip-icon">💡</span>
                          {step.tip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="ai-setup-note" style={{ borderColor: selectedProviderInfo.color }}>
              <strong>Pricing:</strong> {selectedProviderInfo.pricingNote}
            </div>
          </div>
        )}

        {/* API Key Input */}
        {selectedProvider !== 'template' && (
          <div className="ai-key-section">
            <div className="ai-key-header">
              <label className="ai-key-label">
                {selectedProvider === 'ollama' ? 'Server URL' : 'API Key'}
              </label>
              <span className="ai-key-format">
                Format: {selectedProviderInfo.keyFormat}
              </span>
            </div>
            
            <div className="ai-key-input-wrapper">
              <input
                type={isKeyVisible ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={selectedProviderInfo.keyPlaceholder}
                className="ai-key-input"
              />
              <button
                type="button"
                onClick={() => setIsKeyVisible(!isKeyVisible)}
                className="ai-key-toggle"
                title={isKeyVisible ? 'Hide' : 'Show'}
              >
                {isKeyVisible ? '🙈' : '👁️'}
              </button>
            </div>
            
            <div className="ai-key-security">
              <span className="ai-security-icon">🔒</span>
              <span className="ai-security-text">
                Your {selectedProvider === 'ollama' ? 'URL' : 'key'} is stored <strong>only on this device</strong> in encrypted local storage.
                We never transmit it to our servers.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="ai-actions">
          {selectedProvider !== 'template' && (
            <button
              onClick={handleTestConnection}
              disabled={isTesting || !apiKey.trim()}
              className="ai-btn ai-btn-secondary"
            >
              {isTesting ? (
                <>
                  <span className="ai-spinner"></span>
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving || (selectedProvider !== 'template' && !apiKey.trim())}
            className="ai-btn ai-btn-primary"
            style={{ 
              background: selectedProvider === 'template' 
                ? '#fbbf24' 
                : selectedProviderInfo.color 
            }}
          >
            {isSaving ? (
              <>
                <span className="ai-spinner"></span>
                Saving...
              </>
            ) : selectedProvider === 'template' ? (
              'Use Template Library'
            ) : isActive ? (
              'Update Configuration'
            ) : (
              'Connect Provider'
            )}
          </button>
          
          {activeProvider !== 'template' && (
            <button
              onClick={handleClearKey}
              className="ai-btn ai-btn-danger"
            >
              Disconnect
            </button>
          )}
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`ai-test-result ${testResult.success ? 'success' : 'error'}`}>
            {testResult.message}
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="ai-info-footer">
        <div className="ai-info-item">
          <span className="ai-info-icon">📚</span>
          <div>
            <strong>Template Library</strong>
            <p>26,000+ pre-written readings covering all major celestial events. Always free, always instant.</p>
          </div>
        </div>
        <div className="ai-info-item">
          <span className="ai-info-icon">🤖</span>
          <div>
            <strong>AI Enhancement</strong>
            <p>Optional AI-generated readings for more nuanced, personalized interpretations.</p>
          </div>
        </div>
        <div className="ai-info-item">
          <span className="ai-info-icon">🔒</span>
          <div>
            <strong>Your Data Stays Private</strong>
            <p>API keys are stored locally. We never see them or your astrological data.</p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default AIProviderSettings;
