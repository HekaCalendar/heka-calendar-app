/**
 * Starshub Bridge - API Key Sharing System
 * 
 * Enables seamless sharing of AI provider API keys between:
 * - Starshub (main celestial guide)
 * - Oracle Journal (insight generation)
 * 
 * Features:
 * - Detects existing API keys from Starshub
 * - Offers one-click activation in Oracle Journal
 * - Maintains separate storage but enables shared usage
 * - Respects user privacy and consent
 */

import { aiProviderManager, type AIProviderType } from '../astrology/services/ai/aiProvider';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface StarshubApiKeyStatus {
  provider: AIProviderType;
  keyExists: boolean;
  isConfiguredInOracle: boolean;
  canBridge: boolean;
}

export interface BridgeResult {
  success: boolean;
  provider?: AIProviderType;
  message: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE KEYS (matching Starshub storage)
// ═══════════════════════════════════════════════════════════════════════════════

const STARSHUB_STORAGE_KEYS = {
  groq: 'celestial-groq-key',
  openai: 'celestial-openai-key',
  anthropic: 'celestial-anthropic-key',
  ollama: 'celestial-ollama-url',
  config: 'celestial-ai-config'
};

const ORACLE_BRIDGE_CONFIG = 'oracle-ai-bridge-config';

// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if Starshub has API keys configured
 */
export function detectStarshubApiKeys(): StarshubApiKeyStatus[] {
  const providers: AIProviderType[] = ['groq', 'openai', 'anthropic', 'ollama'];
  
  return providers.map(provider => {
    const storageKey = provider === 'ollama' 
      ? STARSHUB_STORAGE_KEYS.ollama 
      : `celestial-${provider}-key`;
    
    const keyExists = !!localStorage.getItem(storageKey);
    const oracleConfig = localStorage.getItem(ORACLE_BRIDGE_CONFIG);
    const bridgedProviders = oracleConfig ? JSON.parse(oracleConfig).bridgedProviders || [] : [];
    
    return {
      provider,
      keyExists,
      isConfiguredInOracle: aiProviderManager.getProviderStatus(provider).configured,
      canBridge: keyExists && !bridgedProviders.includes(provider)
    };
  });
}

/**
 * Check if there are any bridgeable API keys
 */
export function hasBridgeableApiKeys(): boolean {
  const statuses = detectStarshubApiKeys();
  return statuses.some(s => s.canBridge);
}

/**
 * Get the best available provider for bridging
 */
export function getBestBridgeableProvider(): AIProviderType | null {
  const statuses = detectStarshubApiKeys();
  const bridgeable = statuses.filter(s => s.canBridge);
  
  if (bridgeable.length === 0) return null;
  
  // Priority: groq (free tier) > openai > anthropic > ollama
  const priority: AIProviderType[] = ['groq', 'openai', 'anthropic', 'ollama'];
  for (const provider of priority) {
    const found = bridgeable.find(b => b.provider === provider);
    if (found) return provider;
  }
  
  return bridgeable[0].provider;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BRIDGE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Bridge a specific provider's API key from Starshub to Oracle Journal
 */
export async function bridgeApiKey(provider: AIProviderType): Promise<BridgeResult> {
  try {
    const storageKey = provider === 'ollama' 
      ? STARSHUB_STORAGE_KEYS.ollama 
      : `celestial-${provider}-key`;
    
    const apiKey = localStorage.getItem(storageKey);
    
    if (!apiKey) {
      return {
        success: false,
        message: `No API key found for ${provider} in Starshub settings`
      };
    }
    
    // Configure in AI provider manager
    aiProviderManager.configureProvider(provider, { 
      apiKey: apiKey.trim(),
      type: provider 
    });
    
    // Test the connection
    const isValid = await aiProviderManager.validateApiKey(provider, apiKey.trim());
    
    if (!isValid) {
      return {
        success: false,
        message: `API key for ${provider} is invalid or expired`
      };
    }
    
    // Set as active provider if none is currently active (or if it's template)
    const currentProvider = aiProviderManager.getActiveProvider();
    if (currentProvider === 'template') {
      aiProviderManager.setActiveProvider(provider);
    }
    
    // Mark as bridged
    markProviderAsBridged(provider);
    
    return {
      success: true,
      provider,
      message: `Successfully connected ${provider} to Oracle Journal`
    };
    
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to bridge API key'
    };
  }
}

/**
 * Bridge all available API keys from Starshub
 */
export async function bridgeAllApiKeys(): Promise<BridgeResult[]> {
  const statuses = detectStarshubApiKeys();
  const bridgeable = statuses.filter(s => s.canBridge);
  
  const results: BridgeResult[] = [];
  
  for (const status of bridgeable) {
    const result = await bridgeApiKey(status.provider);
    results.push(result);
  }
  
  return results;
}

/**
 * Quick bridge - bridges the best available provider
 */
export async function quickBridge(): Promise<BridgeResult> {
  const provider = getBestBridgeableProvider();
  
  if (!provider) {
    return {
      success: false,
      message: 'No bridgeable API keys found. Please configure AI in Starshub first.'
    };
  }
  
  return bridgeApiKey(provider);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

interface BridgeConfig {
  bridgedProviders: AIProviderType[];
  autoBridgeEnabled: boolean;
  lastBridgeAttempt: string | null;
}

function getBridgeConfig(): BridgeConfig {
  const stored = localStorage.getItem(ORACLE_BRIDGE_CONFIG);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    bridgedProviders: [],
    autoBridgeEnabled: true,
    lastBridgeAttempt: null
  };
}

function saveBridgeConfig(config: BridgeConfig): void {
  localStorage.setItem(ORACLE_BRIDGE_CONFIG, JSON.stringify(config));
}

function markProviderAsBridged(provider: AIProviderType): void {
  const config = getBridgeConfig();
  if (!config.bridgedProviders.includes(provider)) {
    config.bridgedProviders.push(provider);
  }
  config.lastBridgeAttempt = new Date().toISOString();
  saveBridgeConfig(config);
}

/**
 * Check if a provider has been bridged
 */
export function isProviderBridged(provider: AIProviderType): boolean {
  const config = getBridgeConfig();
  return config.bridgedProviders.includes(provider);
}

/**
 * Enable/disable auto-bridging
 */
export function setAutoBridgeEnabled(enabled: boolean): void {
  const config = getBridgeConfig();
  config.autoBridgeEnabled = enabled;
  saveBridgeConfig(config);
}

/**
 * Check if auto-bridge is enabled
 */
export function isAutoBridgeEnabled(): boolean {
  return getBridgeConfig().autoBridgeEnabled;
}

/**
 * Reset bridge configuration
 */
export function resetBridgeConfig(): void {
  localStorage.removeItem(ORACLE_BRIDGE_CONFIG);
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-BRIDGE ON APP START
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Attempt to auto-bridge API keys on app initialization
 * Should be called when the Oracle Journal first loads
 */
export async function attemptAutoBridge(): Promise<BridgeResult | null> {
  if (!isAutoBridgeEnabled()) {
    return null;
  }
  
  const config = getBridgeConfig();
  
  // Don't attempt more than once per day
  if (config.lastBridgeAttempt) {
    const lastAttempt = new Date(config.lastBridgeAttempt);
    const now = new Date();
    const hoursSinceLastAttempt = (now.getTime() - lastAttempt.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceLastAttempt < 24) {
      return null;
    }
  }
  
  // Only auto-bridge if no provider is currently active
  const currentProvider = aiProviderManager.getActiveProvider();
  if (currentProvider !== 'template') {
    return null;
  }
  
  return quickBridge();
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

export interface BridgePromptData {
  show: boolean;
  availableProviders: AIProviderType[];
  recommendedProvider: AIProviderType | null;
  message: string;
}

/**
 * Get data for showing a bridge prompt to the user
 */
export function getBridgePromptData(): BridgePromptData {
  const statuses = detectStarshubApiKeys();
  const bridgeable = statuses.filter(s => s.canBridge);
  
  if (bridgeable.length === 0) {
    return {
      show: false,
      availableProviders: [],
      recommendedProvider: null,
      message: ''
    };
  }
  
  const providers = bridgeable.map(b => b.provider);
  const recommended = getBestBridgeableProvider();
  
  let message = '';
  if (providers.length === 1) {
    message = `Your ${providers[0]} API key from Starshub can be used for enhanced Oracle insights.`;
  } else {
    message = `You have ${providers.length} AI providers configured in Starshub. Enable them for enhanced Oracle insights?`;
  }
  
  return {
    show: true,
    availableProviders: providers,
    recommendedProvider: recommended,
    message
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const StarshubBridge = {
  detectStarshubApiKeys,
  hasBridgeableApiKeys,
  getBestBridgeableProvider,
  bridgeApiKey,
  bridgeAllApiKeys,
  quickBridge,
  isProviderBridged,
  setAutoBridgeEnabled,
  isAutoBridgeEnabled,
  attemptAutoBridge,
  getBridgePromptData,
  resetBridgeConfig
};

export default StarshubBridge;
