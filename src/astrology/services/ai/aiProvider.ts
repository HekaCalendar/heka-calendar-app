/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AI PROVIDER ARCHITECTURE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Pluggable AI system supporting:
 * - Groq (Llama 3 - free tier 1M tokens)
 * - OpenAI (GPT-4, GPT-3.5)
 * - Anthropic (Claude)
 * - Ollama (local models)
 * - Template fallback (always free, always available)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Transit } from '../natal/natalChart';
import type { PersonalizedReading } from '../guidance/templates/templateLibrary';
import { sanitizeForPrompt } from '../../utils/sanitization';
import { aiConfigService } from '../../../services/aiConfigService';
import { secureKeyStore } from '../../../services/secureKeyStore';

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY: Fetch with timeout using AbortController
// ═══════════════════════════════════════════════════════════════════════════════

const DEFAULT_TIMEOUT = 15000; // 15 seconds

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type AIProviderType = 'groq' | 'openai' | 'anthropic' | 'ollama' | 'template';

export interface AIProviderConfig {
  type: AIProviderType;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIRequest {
  prompt: string;
  context: {
    planet: string;
    sign: string;
    moonPhase: string;
    transits: Transit[];
    userElement?: string;
    category?: string;
    previousInsights?: string[];
  };
  templateReading: PersonalizedReading;
}

export interface AIResponse {
  reading: PersonalizedReading;
  provider: AIProviderType;
  model?: string;
  tokensUsed?: number;
  latency: number;
  cached: boolean;
  cachedAt?: number;
}

export interface AIProviderStatus {
  available: boolean;
  configured: boolean;
  lastError?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: Date;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI PROVIDER INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface AIProvider {
  readonly type: AIProviderType;
  readonly name: string;
  readonly description: string;
  
  configure(config: AIProviderConfig): void;
  isConfigured(): boolean;
  getStatus(): AIProviderStatus;
  generateReading(request: AIRequest): Promise<AIResponse>;
  validateApiKey(apiKey: string): Promise<boolean>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE FALLBACK PROVIDER (Always available, always free)
// ═══════════════════════════════════════════════════════════════════════════════

class TemplateProvider implements AIProvider {
  readonly type: AIProviderType = 'template';
  readonly name = 'Template Library';
  readonly description = '169+ hand-crafted planet-sign templates, woven into thousands of unique readings (free, instant, no API key)';
  
  private config: AIProviderConfig = { type: 'template' };
  
  configure(config: AIProviderConfig): void {
    this.config = { ...this.config, ...config };
  }
  
  isConfigured(): boolean {
    return true; // Always available
  }
  
  getStatus(): AIProviderStatus {
    return {
      available: true,
      configured: true,
    };
  }
  
  async generateReading(request: AIRequest): Promise<AIResponse> {
    const startTime = performance.now();
    
    // Simply return the template reading with enhancements
    const enhancedReading: PersonalizedReading = {
      ...request.templateReading,
      title: request.templateReading.title,
      narrative: this.enhanceNarrative(request),
    };
    
    return {
      reading: enhancedReading,
      provider: 'template',
      latency: performance.now() - startTime,
      cached: false,
    };
  }
  
  private enhanceNarrative(request: AIRequest): string {
    const { context, templateReading } = request;
    let narrative = templateReading.narrative;
    
    // Add transit details if present
    if (context.transits.length > 0) {
      const mainTransit = context.transits[0];
      narrative += ` Currently, ${mainTransit.transitingPlanet} is ${mainTransit.aspect} your natal ${mainTransit.natalPlanet}, bringing ${mainTransit.applying ? 'increasing' : 'decreasing'} intensity to this area.`;
    }
    
    // Add elemental context
    if (context.userElement) {
      narrative += ` As someone with strong ${context.userElement} energy, this resonates particularly with your nature.`;
    }
    
    return narrative;
  }
  
  async validateApiKey(): Promise<boolean> {
    return true; // No API key needed
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GROQ PROVIDER (Free tier: 1M tokens/day)
// ═══════════════════════════════════════════════════════════════════════════════

class GroqProvider implements AIProvider {
  readonly type: AIProviderType = 'groq';
  readonly name = 'Groq';
  readonly description = 'Llama 3 via Groq (free tier: 1M tokens/day)';
  
  private config: AIProviderConfig = {
    type: 'groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.1-70b-versatile',
    maxTokens: 500,
    temperature: 0.7,
  };
  
  private cache = new Map<string, AIResponse>();
  private lastError?: string;
  
  configure(config: AIProviderConfig): void {
    this.config = { ...this.config, ...config };
  }
  
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }
  
  getStatus(): AIProviderStatus {
    return {
      available: this.isConfigured(),
      configured: this.isConfigured(),
      lastError: this.lastError,
    };
  }
  
  async generateReading(request: AIRequest): Promise<AIResponse> {
    const startTime = performance.now();
    
    // Check cache
    const cacheKey = this.generateCacheKey(request);
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - (cached.cachedAt || 0) < 3600000) { // 1 hour cache
      return { ...cached, cached: true, latency: performance.now() - startTime };
    }
    
    if (!this.config.apiKey) {
      throw new Error('Groq API key not configured');
    }
    
    try {
      const response = await fetchWithTimeout(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: this.buildPrompt(request),
            },
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        this.lastError = error;
        throw new Error(`Groq API error: ${error}`);
      }
      
      const data = await response.json();
      const aiReading = this.parseResponse(data.choices[0].message.content, request);
      
      const result: AIResponse = {
        reading: aiReading,
        provider: 'groq',
        model: this.config.model,
        tokensUsed: data.usage?.total_tokens,
        latency: performance.now() - startTime,
        cached: false,
      };
      
      // Cache result
      this.cache.set(cacheKey, { ...result, cachedAt: Date.now() });
      
      return result;
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }
  
  private generateCacheKey(request: AIRequest): string {
    const { context } = request;
    return `${context.planet}-${context.sign}-${context.moonPhase}-${context.category || 'general'}`;
  }
  
  private getSystemPrompt(): string {
    return `You are a wise astrological guide combining ancient wisdom with modern psychology. 
Your guidance is compassionate, empowering, and practical. 
You write in a warm, conversational tone while maintaining depth and insight.

Respond ONLY in JSON format with this structure:
{
  "narrative": "2-3 paragraph personalized astrological guidance (200-300 words)",
  "poeticSummary": "A poetic 2-sentence summary of the day's energy",
  "affirmations": ["3 powerful affirmations for this celestial energy"],
  "rituals": ["2-3 simple rituals aligned with the cosmic weather"],
  "journalPrompts": ["3 introspective questions for reflection"]
}`;
  }
  
  private buildPrompt(request: AIRequest): string {
    const { context, templateReading } = request;
    
    // Sanitize all user-influenced inputs to prevent prompt injection
    const planet = sanitizeForPrompt(context.planet);
    const sign = sanitizeForPrompt(context.sign);
    const moonPhase = sanitizeForPrompt(context.moonPhase);
    const category = sanitizeForPrompt(context.category || 'general life guidance');
    const userElement = context.userElement ? sanitizeForPrompt(context.userElement) : null;
    const title = sanitizeForPrompt(templateReading.title);
    const summary = sanitizeForPrompt(templateReading.summary);
    const advice = templateReading.advice.map(a => sanitizeForPrompt(a));
    
    // Sanitize transit data if present
    const transitInfo = context.transits.length > 0
      ? `- Key Transit: ${sanitizeForPrompt(context.transits[0].transitingPlanet)} ${sanitizeForPrompt(context.transits[0].aspect)} natal ${sanitizeForPrompt(context.transits[0].natalPlanet)}`
      : '';
    
    return `Provide personalized astrological guidance for today:

**Current Celestial Weather:**
- ${planet.charAt(0).toUpperCase() + planet.slice(1)} in ${sign.charAt(0).toUpperCase() + sign.slice(1)}
- Moon Phase: ${moonPhase.replace('-', ' ')}
${transitInfo}
${userElement ? `- User has strong ${userElement} elemental energy` : ''}

**Focus Area:** ${category}

**Base Template Guidance:**
Title: ${title}
Summary: ${summary}
Advice: ${advice.join(', ')}

Create personalized guidance that expands on this template with poetic depth and practical wisdom.`;
  }
  
  private parseResponse(content: string, request: AIRequest): PersonalizedReading {
    // Try to parse JSON response
    let aiContent;
    try {
      aiContent = JSON.parse(content);
    } catch {
      // Fallback if not JSON
      aiContent = {
        narrative: content,
        poeticSummary: 'The cosmos whispers its wisdom today.',
        affirmations: ['I align with the celestial flow.'],
        rituals: ['Take a moment to observe the sky.'],
        journalPrompts: ['What is the universe revealing to me?'],
      };
    }
    
    return {
      title: request.templateReading.title,
      summary: request.templateReading.summary,
      narrative: aiContent.narrative || content,
      advice: request.templateReading.advice,
      affirmation: request.templateReading.affirmation,
      confidence: 90, // AI-enhanced confidence
      // AI-enhanced fields
      poeticSummary: aiContent.poeticSummary,
      affirmations: aiContent.affirmations,
      rituals: aiContent.rituals,
      journalPrompts: aiContent.journalPrompts,
      aiGenerated: true,
      aiProvider: 'groq',
      aiModel: this.config.model,
    };
  }
  
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${this.config.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 10000, // 10s timeout for validation
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OPENAI PROVIDER
// ═══════════════════════════════════════════════════════════════════════════════

class OpenAIProvider implements AIProvider {
  readonly type: AIProviderType = 'openai';
  readonly name = 'OpenAI';
  readonly description = 'GPT-4 / GPT-3.5 (requires API key)';
  
  private config: AIProviderConfig = {
    type: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    maxTokens: 500,
    temperature: 0.7,
  };
  
  private lastError?: string;
  
  configure(config: AIProviderConfig): void {
    this.config = { ...this.config, ...config };
  }
  
  isConfigured(): boolean {
    return !!this.config.apiKey;
  }
  
  getStatus(): AIProviderStatus {
    return {
      available: this.isConfigured(),
      configured: this.isConfigured(),
      lastError: this.lastError,
    };
  }
  
  async generateReading(request: AIRequest): Promise<AIResponse> {
    const startTime = performance.now();
    
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    try {
      const response = await fetchWithTimeout(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: `You are an empathetic astrological guide. Provide warm, insightful, 
practical guidance based on current celestial positions. 

Respond ONLY in JSON format with this structure:
{
  "narrative": "2-3 paragraph personalized astrological guidance (200-300 words)",
  "poeticSummary": "A poetic 2-sentence summary of the day's energy",
  "affirmations": ["3 powerful affirmations for this celestial energy"],
  "rituals": ["2-3 simple rituals aligned with the cosmic weather"],
  "journalPrompts": ["3 introspective questions for reflection"]
}`,
            },
            {
              role: 'user',
              content: this.buildPrompt(request),
            },
          ],
          response_format: { type: 'json_object' },
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        this.lastError = error;
        throw new Error(`OpenAI API error: ${error}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse the JSON response
      let aiContent;
      try {
        aiContent = JSON.parse(content);
      } catch {
        // Fallback if JSON parsing fails
        aiContent = {
          narrative: content,
          poeticSummary: 'The cosmos speaks in mysterious ways today.',
          affirmations: ['I trust the wisdom of the stars.'],
          rituals: ['Take a moment to breathe under the sky.'],
          journalPrompts: ['What is the universe teaching me today?'],
        };
      }
      
      return {
        reading: {
          title: request.templateReading.title,
          summary: request.templateReading.summary,
          narrative: aiContent.narrative || content,
          advice: request.templateReading.advice,
          affirmation: request.templateReading.affirmation,
          confidence: 92,
          // AI-enhanced fields
          poeticSummary: aiContent.poeticSummary,
          affirmations: aiContent.affirmations,
          rituals: aiContent.rituals,
          journalPrompts: aiContent.journalPrompts,
          aiGenerated: true,
          aiProvider: 'openai',
          aiModel: this.config.model,
        },
        provider: 'openai',
        model: this.config.model,
        tokensUsed: data.usage?.total_tokens,
        latency: performance.now() - startTime,
        cached: false,
      };
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }
  
  private buildPrompt(request: AIRequest): string {
    const { context, templateReading } = request;
    
    // Sanitize all user-influenced inputs
    const planet = sanitizeForPrompt(context.planet);
    const sign = sanitizeForPrompt(context.sign);
    const moonPhase = sanitizeForPrompt(context.moonPhase);
    const category = sanitizeForPrompt(context.category || 'general guidance');
    const userElement = context.userElement ? sanitizeForPrompt(context.userElement) : null;
    const title = sanitizeForPrompt(templateReading.title);
    const summary = sanitizeForPrompt(templateReading.summary);
    
    const transitInfo = context.transits.length > 0 
      ? `Active transit: ${sanitizeForPrompt(context.transits[0].transitingPlanet)} ${sanitizeForPrompt(context.transits[0].aspect)} your natal ${sanitizeForPrompt(context.transits[0].natalPlanet)}` 
      : 'No major transits active';
    
    return `CELESTIAL SNAPSHOT:
- Current focus: ${planet} in ${sign}
- Moon phase: ${moonPhase}
- ${transitInfo}
- Life area: ${category}
${userElement ? `- Your dominant element: ${userElement}` : ''}

TEMPLATE GUIDANCE (for context):
Title: ${title}
Summary: ${summary}

Create personalized astrological guidance that expands on this template with specific references to the celestial positions.`;
  }
  
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${this.config.baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        timeout: 10000,
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// OLLAMA PROVIDER (Local AI)
// ═══════════════════════════════════════════════════════════════════════════════

class OllamaProvider implements AIProvider {
  readonly type: AIProviderType = 'ollama';
  readonly name = 'Ollama';
  readonly description = 'Local models (requires Ollama installation)';
  
  private config: AIProviderConfig = {
    type: 'ollama',
    baseUrl: 'http://localhost:11434',
    model: 'llama3',
    maxTokens: 500,
    temperature: 0.7,
  };
  
  private lastError?: string;
  
  configure(config: AIProviderConfig): void {
    this.config = { ...this.config, ...config };
  }
  
  isConfigured(): boolean {
    return !!this.config.baseUrl;
  }
  
  getStatus(): AIProviderStatus {
    return {
      available: this.isConfigured(),
      configured: this.isConfigured(),
      lastError: this.lastError,
    };
  }
  
  async generateReading(request: AIRequest): Promise<AIResponse> {
    const startTime = performance.now();
    
    try {
      const response = await fetchWithTimeout(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model,
          prompt: this.buildPrompt(request),
          stream: false,
          format: 'json',
          options: {
            temperature: this.config.temperature,
            num_predict: this.config.maxTokens,
          },
        }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        this.lastError = error;
        throw new Error(`Ollama error: ${error}`);
      }
      
      const data = await response.json();
      
      // Try to parse JSON response
      let aiContent;
      try {
        aiContent = JSON.parse(data.response);
      } catch {
        aiContent = {
          narrative: data.response,
          poeticSummary: 'The stars align in your favor today.',
          affirmations: ['I flow with the cosmic rhythm.'],
          rituals: ['Pause and breathe with intention.'],
          journalPrompts: ['What guidance do I seek from the universe?'],
        };
      }
      
      return {
        reading: {
          title: request.templateReading.title,
          summary: request.templateReading.summary,
          narrative: aiContent.narrative || data.response,
          advice: request.templateReading.advice,
          affirmation: request.templateReading.affirmation,
          confidence: 85,
          // AI-enhanced fields
          poeticSummary: aiContent.poeticSummary,
          affirmations: aiContent.affirmations,
          rituals: aiContent.rituals,
          journalPrompts: aiContent.journalPrompts,
          aiGenerated: true,
          aiProvider: 'ollama',
          aiModel: this.config.model,
        },
        provider: 'ollama',
        model: this.config.model,
        latency: performance.now() - startTime,
        cached: false,
      };
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }
  
  private buildPrompt(request: AIRequest): string {
    const { context, templateReading } = request;
    
    // Sanitize all user-influenced inputs
    const planet = sanitizeForPrompt(context.planet);
    const sign = sanitizeForPrompt(context.sign);
    const moonPhase = sanitizeForPrompt(context.moonPhase);
    const category = sanitizeForPrompt(context.category || 'general');
    const summary = sanitizeForPrompt(templateReading.summary);
    
    return `You are an astrological guide. 

Celestial positions: ${planet} in ${sign}, Moon phase: ${moonPhase}
Focus: ${category}

Respond ONLY in JSON format:
{
  "narrative": "Personalized astrological guidance (2-3 paragraphs)",
  "poeticSummary": "A poetic 2-sentence summary",
  "affirmations": ["3 affirmations"],
  "rituals": ["2-3 simple rituals"],
  "journalPrompts": ["3 reflection questions"]
}

Base guidance: ${summary}`;
  }
  
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${this.config.baseUrl}/api/tags`, {
        timeout: 5000, // Shorter timeout for local Ollama
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AI PROVIDER MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

export class AIProviderManager {
  private providers: Map<AIProviderType, AIProvider> = new Map();
  private activeProvider: AIProviderType = 'template';
  private fallbackChain: AIProviderType[] = ['template'];
  
  constructor() {
    // Register providers
    this.registerProvider(new TemplateProvider());
    this.registerProvider(new GroqProvider());
    this.registerProvider(new OpenAIProvider());
    this.registerProvider(new OllamaProvider());
    
    // Load saved configuration asynchronously
    void this.loadConfiguration();
  }
  
  registerProvider(provider: AIProvider): void {
    this.providers.set(provider.type, provider);
  }
  
  /**
   * Get available providers
   */
  getAvailableProviders(): { type: AIProviderType; name: string; description: string; configured: boolean }[] {
    return Array.from(this.providers.values()).map(p => ({
      type: p.type,
      name: p.name,
      description: p.description,
      configured: p.isConfigured(),
    }));
  }
  
  /**
   * Set active provider
   */
  setActiveProvider(type: AIProviderType): void {
    if (!this.providers.has(type)) {
      throw new Error(`Unknown provider: ${type}`);
    }
    this.activeProvider = type;
    this.saveConfiguration();
  }
  
  /**
   * Get active provider
   */
  getActiveProvider(): AIProviderType {
    return this.activeProvider;
  }
  
  /**
   * Configure a provider
   */
  configureProvider(type: AIProviderType, config: Partial<AIProviderConfig>): void {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(`Unknown provider: ${type}`);
    }
    
    provider.configure({
      type,
      ...config,
    } as AIProviderConfig);
    
    this.saveConfiguration();
  }
  
  /**
   * Get provider status
   */
  getProviderStatus(type: AIProviderType): AIProviderStatus {
    const provider = this.providers.get(type);
    if (!provider) {
      return { available: false, configured: false };
    }
    return provider.getStatus();
  }
  
  /**
   * Generate reading with fallback chain
   */
  async generateReading(request: AIRequest): Promise<AIResponse> {
    const providersToTry = [this.activeProvider, ...this.fallbackChain];
    
    for (const providerType of providersToTry) {
      const provider = this.providers.get(providerType);
      if (!provider || !provider.isConfigured()) continue;
      
      try {
        return await provider.generateReading(request);
      } catch (error) {
        console.warn(`Provider ${providerType} failed:`, error);
        // Continue to next provider
      }
    }
    
    // Ultimate fallback: template provider (always works)
    const templateProvider = this.providers.get('template')!;
    return templateProvider.generateReading(request);
  }
  
  /**
   * Validate API key for a provider
   */
  async validateApiKey(type: AIProviderType, apiKey: string): Promise<boolean> {
    const provider = this.providers.get(type);
    if (!provider) return false;
    return provider.validateApiKey(apiKey);
  }
  
  /**
   * Save configuration to localStorage
   */
  private saveConfiguration(): void {
    try {
      const config = {
        activeProvider: this.activeProvider,
        providerConfigs: Array.from(this.providers.entries()).map(([type, provider]) => ({
          type,
          configured: provider.isConfigured(),
        })),
      };
      localStorage.setItem('celestial-ai-config', JSON.stringify(config));
      aiConfigService.syncToLegacy();
    } catch (error) {
      console.warn('Failed to save AI config:', error);
    }
  }
  
  /**
   * Load configuration from localStorage and secure storage
   */
  private async loadConfiguration(): Promise<void> {
    try {
      // Prefer unified config
      const unified = aiConfigService.getConfig();
      if (unified.provider && this.providers.has(unified.provider)) {
        this.activeProvider = unified.provider;
        const key = await secureKeyStore.get(`heka-ai-${unified.provider}`);
        if (key) {
          this.configureProvider(unified.provider, { apiKey: key });
        }
      } else {
        const stored = localStorage.getItem('celestial-ai-config');
        if (stored) {
          const config = JSON.parse(stored);
          if (config.activeProvider && this.providers.has(config.activeProvider)) {
            this.activeProvider = config.activeProvider;
          }
        }
      }
      
      // Load API keys from secure storage (fallback to legacy localStorage)
      const groqKey = await secureKeyStore.get('heka-ai-groq') 
        ?? localStorage.getItem('celestial-groq-key');
      if (groqKey) {
        this.configureProvider('groq', { apiKey: groqKey });
      }
      
      const openaiKey = await secureKeyStore.get('heka-ai-openai')
        ?? localStorage.getItem('celestial-openai-key');
      if (openaiKey) {
        this.configureProvider('openai', { apiKey: openaiKey });
      }
      
      const anthropicKey = await secureKeyStore.get('heka-ai-anthropic')
        ?? localStorage.getItem('celestial-anthropic-key');
      if (anthropicKey) {
        this.configureProvider('anthropic', { apiKey: anthropicKey });
      }
      
      const ollamaUrl = await secureKeyStore.get('heka-ai-ollama')
        ?? localStorage.getItem('celestial-ollama-url');
      if (ollamaUrl) {
        this.configureProvider('ollama', { baseUrl: ollamaUrl });
      }
    } catch (error) {
      console.warn('Failed to load AI config:', error);
    }
  }
  
  /**
   * Save API key securely using native encrypted storage
   */
  async saveApiKey(type: AIProviderType, apiKey: string): Promise<void> {
    const storageKey = type === 'ollama' ? 'heka-ai-ollama' : `heka-ai-${type}`;
    await secureKeyStore.set(storageKey, apiKey);
    this.configureProvider(type, type === 'ollama' ? { baseUrl: apiKey } : { apiKey });
    await aiConfigService.setApiKey(apiKey);
  }
  
  /**
   * Clear API key from secure storage
   */
  async clearApiKey(type: AIProviderType): Promise<void> {
    const storageKey = type === 'ollama' ? 'heka-ai-ollama' : `heka-ai-${type}`;
    await secureKeyStore.remove(storageKey);
    this.configureProvider(type, { apiKey: undefined });
    await aiConfigService.clearApiKey();
  }
  
  /**
   * Check if AI is enabled for a specific area (stars, journal, calendar, circle)
   */
  isAIEnabledForArea(area: import('../../../services/aiConfigService').AIArea): boolean {
    return aiConfigService.isAreaEnabled(area);
  }
}

// Singleton instance
export const aiProviderManager = new AIProviderManager();

export default aiProviderManager;
