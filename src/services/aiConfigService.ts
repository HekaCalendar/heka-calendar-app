/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * UNIFIED AI CONFIGURATION SERVICE - Enterprise Edition
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for AI configuration across:
 * - Stars (celestial guidance)
 * - Journal (oracle insights)
 * - Calendar (AI coach overlay)
 * - Circle (social motivation)
 *
 * Features:
 * - Area-specific consent toggles
 * - Event-driven reactivity
 * - Backward compatibility with legacy keys
 * - Native secure storage for API keys (Tier 1 enterprise)
 * - Cross-section AI memory layer (userContext)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { secureKeyStore } from './secureKeyStore';

export type AIArea = 'stars' | 'journal' | 'calendar' | 'circle';

export interface AIAreaConsent {
  stars: boolean;
  journal: boolean;
  calendar: boolean;
  circle: boolean;
}

export interface CoachMemoryEntry {
  text: string;
  timestamp: number;
  type: string;
  topic: string;
}

export interface AIUserContext {
  /** Themes extracted from the most recent journal entry */
  lastJournalThemes: string[];
  /** A short preview of the latest journal entry */
  lastJournalSnippet?: string;
  /** ISO date of the last journal entry */
  lastJournalDate?: string;
  /** The most recently shown coach prompt (to avoid repetition) */
  lastCoachPrompt: string;
  /** Persistent memory of recent coach messages */
  coachMemory: CoachMemoryEntry[];
  /** Timestamp of the last time user interacted with the coach */
  lastCoachInteraction: number;
  /** Current oracle mood / persona flavor */
  oracleMood: 'prophetic' | 'playful' | 'stern' | 'gentle' | 'electric' | 'mysterious';
  /** Number of pending circle tasks at last check */
  pendingCircleTasks: number;
  /** Number of unread circle messages at last check */
  unreadMessages: number;
  /** Number of friends in the Circle */
  friendCount: number;
  /** The last major moon phase we celebrated/detected */
  lastCelebratedMoonPhase?: string;
  /** Task streak tracking for AI motivation */
  currentTaskStreak: number;
  longestTaskStreak: number;
  lastTaskCompletionDate?: string;
  /** Preferred time of day for tasks */
  preferredTaskTime: 'morning' | 'afternoon' | 'evening' | 'night' | 'unknown';
  /** Whether the user has created their first task yet */
  hasCreatedFirstTask: boolean;
  /** Number of incomplete tasks across all days */
  pendingTasks: number;
  /** Number of tasks completed today */
  todayTasksCompleted: number;
  /** ISO date of the last task creation */
  lastTaskCreationDate?: string;
  /** Content of the last created task */
  lastTaskContent?: string;
  /** ID of last completed task for complementary suggestions */
  lastCompletedTaskId?: string;
  /** Category of last completed task */
  lastCompletedTaskCategory?: string;
  /** Last streak milestone we celebrated in the UI */
  lastCelebratedStreak?: number;
  /** 30-day rolling mood history from journal sentiment analysis */
  moodHistory: { date: string; score: number; label: 'positive' | 'neutral' | 'negative'; magnitude: number; entryCount: number }[];
  /** Detected user archetype (warrior, monk, artist, strategist, mystic, phoenix) */
  userArchetype?: string;
  /** Confidence in archetype detection (0-1) */
  archetypeConfidence?: number;
  /** Last assessed streak danger level */
  lastStreakDangerLevel?: 'none' | 'low' | 'medium' | 'high' | 'critical';
  /** Current streak that is at risk of breaking */
  streakAtRisk?: number;
  /** Hours remaining until streak breaks (end of day grace period) */
  hoursUntilStreakBreak?: number;
  /** Cached daily transit summary to avoid recalculating on every message */
  lastTransitSummary?: string;
  /** Serialized full transit reading (JSON) for rich caching without recalculation */
  lastTransitData?: string;
  /** Timestamp of last transit calculation */
  lastTransitCalculatedAt?: number;
  /** Cached void-of-course moon state */
  lastVoCState?: boolean;
  /** Timestamp of last VoC check */
  lastVoCCheckedAt?: number;
  /** Timestamp until which the AI coach should remain minimized after user dismissal */
  coachMinimizedUntil?: number;
  /** Persistent set of dismissed message IDs to avoid reshown messages */
  dismissedMessageIds?: string[];
  /** Calendar note writing streak (consecutive days with notes) */
  writingStreak?: number;
  /** Longest calendar note writing streak ever */
  longestWritingStreak?: number;
  /** Average mood from calendar notes (1-5 scale) */
  moodAverage?: number;
  /** Total number of calendar notes created */
  totalNotes?: number;
  /** ISO date of the last calendar note */
  lastNoteDate?: string;
}

export interface UnifiedAIConfig {
  version: number;
  provider: 'template' | 'groq' | 'openai' | 'anthropic' | 'ollama';
  /** In-memory only — never persisted to localStorage plaintext */
  apiKey?: string;
  model?: string;
  globalEnabled: boolean;
  areas: AIAreaConsent;
  // Behavior preferences per area
  calendar: {
    proactiveQuestions: boolean;
    dailyBriefing: boolean;
    celebrationMode: boolean;
  };
  circle: {
    inviteSuggestions: boolean;
    taskMotivation: boolean;
    friendshipCheckins: boolean;
  };
  journal: {
    autoReflect: boolean;
    poeticEnhancement: boolean;
  };
  /** Shared memory across all AI sections */
  userContext: AIUserContext;
}

const CONFIG_KEY = 'heka-unified-ai-config';
const LEGACY_KEYS = ['celestial-ai-config', 'ci-ai-config'];

const DEFAULT_CONTEXT: AIUserContext = {
  lastJournalThemes: [],
  lastCoachPrompt: '',
  coachMemory: [],
  lastCoachInteraction: 0,
  oracleMood: 'mysterious',
  lastTaskCreationDate: undefined,
  lastTaskContent: undefined,
  pendingCircleTasks: 0,
  unreadMessages: 0,
  friendCount: 0,
  currentTaskStreak: 0,
  longestTaskStreak: 0,
  preferredTaskTime: 'unknown',
  hasCreatedFirstTask: false,
  pendingTasks: 0,
  todayTasksCompleted: 0,
  moodHistory: [],
  dismissedMessageIds: [],
  writingStreak: 0,
  longestWritingStreak: 0,
  moodAverage: 0,
  totalNotes: 0,
};

const DEFAULT_CONFIG: UnifiedAIConfig = {
  version: 1,
  provider: 'template',
  globalEnabled: false,
  areas: {
    stars: true,
    journal: false,
    calendar: false,
    circle: false,
  },
  calendar: {
    proactiveQuestions: true,
    dailyBriefing: true,
    celebrationMode: true,
  },
  circle: {
    inviteSuggestions: true,
    taskMotivation: true,
    friendshipCheckins: true,
  },
  journal: {
    autoReflect: true,
    poeticEnhancement: true,
  },
  userContext: DEFAULT_CONTEXT,
};

type ConfigListener = (config: UnifiedAIConfig) => void;

class AIConfigService {
  private listeners: Set<ConfigListener> = new Set();
  private cached: UnifiedAIConfig | null = null;

  constructor() {
    this.migrateLegacyConfigs();
    this.cached = this.loadInternal();
    // Migrate any plaintext keys into secure storage on first load
    void secureKeyStore.migrate();
    // Hydrate the in-memory apiKey from secure storage asynchronously
    void this.hydrateApiKey();
  }

  private async hydrateApiKey(): Promise<void> {
    const config = this.getConfig();
    if (config.provider !== 'template') {
      const key = await secureKeyStore.get(`heka-ai-${config.provider}`);
      if (key && this.cached) {
        this.cached = { ...this.cached, apiKey: key };
        this.notify();
      }
    }
  }

  /**
   * Migrate old fragmented configs into unified format
   */
  private migrateLegacyConfigs(): void {
    let migrated = false;
    const unified = { ...DEFAULT_CONFIG };

    for (const key of LEGACY_KEYS) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      try {
        const legacy = JSON.parse(raw);
        if (legacy.activeProvider && legacy.activeProvider !== 'template') {
          unified.provider = legacy.activeProvider;
          unified.globalEnabled = true;
          unified.areas.stars = true;
          migrated = true;
        }
      } catch {
        // ignore corrupt legacy data
      }
    }

    // Also check provider-specific keys (plaintext legacy)
    const providers = ['groq', 'openai', 'anthropic'] as const;
    for (const provider of providers) {
      const legacyKey = `celestial-${provider}-key`;
      const value = localStorage.getItem(legacyKey);
      if (value) {
        unified.provider = provider;
        unified.apiKey = value;
        unified.globalEnabled = true;
        unified.areas.stars = true;
        migrated = true;
      }
    }

    // Check Ollama URL
    const ollamaUrl = localStorage.getItem('celestial-ollama-url');
    if (ollamaUrl) {
      unified.provider = 'ollama';
      unified.apiKey = ollamaUrl;
      unified.globalEnabled = true;
      unified.areas.stars = true;
      migrated = true;
    }

    const existing = this.loadInternal();
    // Migrate if no unified config exists, or if unified config is still template but legacy has a real provider
    if (migrated && (!existing || existing.provider === 'template')) {
      this.saveInternal(unified);
    }
  }

  private loadInternal(): UnifiedAIConfig {
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          userContext: { ...DEFAULT_CONFIG.userContext, ...(parsed.userContext || {}) },
        };
      }
    } catch {
      // fall through
    }
    return { ...DEFAULT_CONFIG };
  }

  private saveInternal(config: UnifiedAIConfig): void {
    try {
      // NEVER write the API key to plaintext localStorage
      const safeConfig = { ...config, apiKey: undefined };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(safeConfig));
    } catch (e) {
      console.warn('[AIConfigService] Failed to save config:', e);
    }
  }

  private notify(): void {
    const config = this.getConfig();
    this.listeners.forEach((listener) => {
      try {
        listener(config);
      } catch (e) {
        console.warn('[AIConfigService] Listener error:', e);
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────────

  getConfig(): UnifiedAIConfig {
    if (!this.cached) {
      this.cached = this.loadInternal();
    }
    return { ...this.cached };
  }

  updateConfig(partial: Partial<UnifiedAIConfig>): void {
    const next = { ...this.getConfig(), ...partial };
    this.cached = next;
    this.saveInternal(next);
    this.notify();
  }

  setProvider(provider: UnifiedAIConfig['provider']): void {
    this.updateConfig({ provider });
  }

  async setApiKey(apiKey: string): Promise<void> {
    const config = this.getConfig();
    if (config.provider !== 'template') {
      await secureKeyStore.set(`heka-ai-${config.provider}`, apiKey);
    }
    this.updateConfig({ apiKey });
  }

  async clearApiKey(): Promise<void> {
    const config = this.getConfig();
    if (config.provider !== 'template') {
      await secureKeyStore.remove(`heka-ai-${config.provider}`);
    }
    this.updateConfig({ apiKey: undefined });
  }

  async getApiKey(): Promise<string | null> {
    const config = this.getConfig();
    if (config.provider === 'template') return null;
    // Prefer secure storage
    const key = await secureKeyStore.get(`heka-ai-${config.provider}`);
    return key;
  }

  setGlobalEnabled(enabled: boolean): void {
    this.updateConfig({ globalEnabled: enabled });
  }

  setAreaEnabled(area: AIArea, enabled: boolean): void {
    const config = this.getConfig();
    const areas = { ...config.areas, [area]: enabled };
    this.updateConfig({ areas });
  }

  isAreaEnabled(area: AIArea): boolean {
    const config = this.getConfig();
    return config.globalEnabled && config.areas[area];
  }

  isAIActive(): boolean {
    const config = this.getConfig();
    if (!config.globalEnabled) return false;
    return Object.values(config.areas).some(Boolean);
  }

  isRealProviderConfigured(): boolean {
    const config = this.getConfig();
    return config.provider !== 'template' && !!config.apiKey;
  }

  subscribe(listener: ConfigListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // USER CONTEXT (Shared AI Memory)
  // ─────────────────────────────────────────────────────────────────────────────

  setUserContext(partial: Partial<AIUserContext>): void {
    const config = this.getConfig();
    this.updateConfig({
      userContext: { ...config.userContext, ...partial },
    });
  }

  getUserContext(): AIUserContext {
    return { ...this.getConfig().userContext };
  }

  /**
   * Sync provider selection to legacy storage so existing aiProviderManager still works.
   * Note: API keys are managed by secureKeyStore; we only sync the metadata here.
   */
  syncToLegacy(): void {
    const config = this.getConfig();
    if (config.provider !== 'template') {
      localStorage.setItem('celestial-ai-config', JSON.stringify({
        activeProvider: config.provider,
        enabled: config.globalEnabled,
      }));
    }
  }
}

export const aiConfigService = new AIConfigService();
export default aiConfigService;
