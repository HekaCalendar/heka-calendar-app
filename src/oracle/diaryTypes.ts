/**
 * HEKA Diary System - Type Definitions
 * Complete data model for the celestial journaling experience
 */

import type { ContentTheme } from './oracleEngine';

// ============================================================================
// DIARY ENTRY
// ============================================================================

export interface DiaryEntry {
  /** Unique identifier */
  id: string;

  /** Date string (YYYY-MM-DD) */
  date: string;

  /** ISO timestamp when entry was created */
  timestamp: string;

  /** Entry content (plain text or markdown) */
  content: string;

  /** Visual theme for this entry */
  theme?: JournalTheme;

  /** Font for this entry */
  font?: JournalFont;

  /** Auto-detected themes from content analysis */
  detectedThemes?: ContentTheme[];

  /** Oracle insight attached to this entry (if any) */
  insight?: DiaryInsight;

  /** Celestial context at time of writing */
  celestialContext?: CelestialContext;

  /** User-defined tags */
  tags?: string[];

  /** Whether content is markdown */
  isMarkdown?: boolean;

  /** Revision count (managed by DB layer) */
  revisionCount?: number;

  /** Sync status (managed by DB layer) */
  syncStatus?: 'synced' | 'pending' | 'failed';

  /** Creation metadata */
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// DIARY INSIGHT (Attached to entries)
// ============================================================================

export interface DiaryInsight {
  /** Unique insight ID */
  id: string;
  
  /** The insight text displayed to user */
  text: string;
  
  /** Confidence level */
  confidence: 'high' | 'medium' | 'low';
  
  /** Score that determined this was the best insight */
  score: number;
  
  /** Matched theme from content analysis */
  matchedTheme: ContentTheme;
  
  /** Celestial event that triggered this insight */
  celestialEvent: {
    type: string;
    description: string;
    strength: number;
  };
  
  /** Whether this used birth chart data */
  usedBirthChart: boolean;
  
  /** User rating for feedback loop */
  userRating?: 'resonated' | 'neutral' | 'dismissed';
  
  /** Whether user dismissed this insight */
  dismissed: boolean;
  
  /** UI display properties */
  archetypes?: string[];
  strengthScore?: number;
  celestialContext?: {
    moonPhase?: string;
    aspects?: string[];
  };
}

// ============================================================================
// CELESTIAL CONTEXT (Captured at entry time)
// ============================================================================

export interface CelestialContext {
  /** Timestamp when context was captured */
  capturedAt: string;
  
  /** Moon phase at entry time */
  moonPhase: {
    phase: string;  // 'new' | 'waxing' | 'full' | 'waning'
    sign: string;
    illumination: number; // 0-100
    isVoid: boolean;
  };
  
  /** Active celestial events */
  activeEvents: CelestialEventSnapshot[];
  
  /** Planet positions (if birth chart available) */
  planetPositions?: Record<string, {
    sign: string;
    degree: number;
    house?: number; // If birth chart available
  }>;
}

export interface CelestialEventSnapshot {
  type: string;
  description: string;
  strength: number;
}

// ============================================================================
// JOURNAL PREFERENCES
// ============================================================================

export type JournalTheme = 'plain' | 'parchment' | 'night' | 'celestial';
export type JournalFont = 'serif' | 'clean' | 'handwritten' | 'typewriter' | 'elegant' | 'journal';

export interface JournalPreferences {
  /** Visual theme */
  theme: JournalTheme;
  
  /** Font family */
  font: JournalFont;
  
  /** Font size (px) */
  fontSize: number;
  
  /** Line height multiplier */
  lineHeight: number;
  
  /** Auto-save enabled */
  autoSave: boolean;
  
  /** Auto-save interval (ms) */
  autoSaveInterval: number;
  
  /** Show Oracle insights */
  showInsights: boolean;
  
  /** Minimum insight score to display (0-100) */
  insightThreshold: number;
  
  /** Preferred tone for insights */
  insightTone: 'scientific' | 'spiritual' | 'balanced';
  
  /** Preferred themes for insights */
  preferredThemes: ContentTheme[];
  
  /** User's rated insights for ML learning */
  ratedInsights: Record<string, 'resonated' | 'neutral' | 'dismissed'>;
  
  /** Dismissed insight patterns */
  dismissedPatterns: string[];
}

// Default preferences
export const DEFAULT_JOURNAL_PREFERENCES: JournalPreferences = {
  theme: 'plain',
  font: 'serif',
  fontSize: 16,
  lineHeight: 1.6,
  autoSave: true,
  autoSaveInterval: 3000, // 3 seconds
  showInsights: true,
  insightThreshold: 70,
  insightTone: 'balanced',
  preferredThemes: [],
  ratedInsights: {},
  dismissedPatterns: []
};

// ============================================================================
// DIARY STATE (Redux)
// ============================================================================

export interface DiaryState {
  /** All diary entries keyed by ID */
  entries: Record<string, DiaryEntry>;
  
  /** Entry IDs grouped by date for quick lookup */
  entriesByDate: Record<string, string[]>; // date -> entryIds[]
  
  /** Currently selected date for viewing/editing */
  selectedDate: string;
  
  /** Currently editing entry ID (null = new entry) */
  editingEntryId: string | null;
  
  /** User's journal preferences */
  preferences: JournalPreferences;
  
  /** UI state */
  ui: {
    isLoading: boolean;
    isSyncing: boolean;
    lastSyncAt: string | null;
    searchQuery: string;
    viewMode: 'calendar' | 'diary';
  };
}

// ============================================================================
// DIARY ACTIONS
// ============================================================================

export interface CreateEntryPayload {
  date: string;
  content: string;
  insight?: DiaryInsight;
  celestialContext: CelestialContext;
}

export interface UpdateEntryPayload {
  entryId: string;
  content: string;
  updatedInsight?: DiaryInsight;
}

export interface RateInsightPayload {
  entryId: string;
  rating: number; // 1-5
}

// ============================================================================
// EXPORT CONFIG
// ============================================================================

export const JOURNAL_THEMES: { id: JournalTheme; label: string; icon: string; description: string }[] = [
  { id: 'plain', label: 'Plain', icon: '⬜', description: 'Clean white space' },
  { id: 'parchment', label: 'Parchment', icon: '📜', description: 'Aged paper with vintage feel' },
  { id: 'night', label: 'Night', icon: '🌙', description: 'Dark mode for evening writing' },
  { id: 'celestial', label: 'Celestial', icon: '✨', description: 'Deep indigo with subtle stars' }
];

export const JOURNAL_FONTS: { id: JournalFont; label: string; description: string; cssValue: string }[] = [
  { id: 'serif', label: 'Serif', description: 'Classic, academic, timeless', cssValue: 'Georgia, "Times New Roman", serif' },
  { id: 'clean', label: 'Clean', description: 'Modern, crisp, professional', cssValue: 'Inter, Roboto, -apple-system, sans-serif' },
  { id: 'handwritten', label: 'Handwritten', description: 'Personal, intimate, warm', cssValue: '"Caveat", "Dancing Script", cursive' },
  { id: 'typewriter', label: 'Typewriter', description: 'Retro, raw, authentic', cssValue: '"Courier New", Courier, monospace' },
  { id: 'elegant', label: 'Elegant', description: 'Refined, luxurious, poetic', cssValue: '"Cormorant Garamond", Georgia, serif' },
  { id: 'journal', label: 'Journal', description: 'Friendly, approachable, casual', cssValue: 'Quicksand, "Open Sans", sans-serif' }
];

// ============================================================================
// THEME & FONT HELPERS
// ============================================================================

/**
 * Get CSS styles for a journal theme
 */
export function getThemeStyles(theme: JournalTheme): React.CSSProperties {
  const baseStyles: React.CSSProperties = {
    background: '#faf9f6',
    color: '#2c3e50',
  };

  switch (theme) {
    case 'night':
      return {
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        color: '#e8e8e8',
      };
    case 'parchment':
      return {
        background: 'linear-gradient(180deg, #f5f0e1 0%, #ebe5d3 100%)',
        color: '#4a3c2a',
      };
    case 'celestial':
      return {
        background: 'linear-gradient(135deg, rgba(25, 25, 40, 0.95) 0%, rgba(40, 30, 60, 0.95) 100%)',
        color: '#e8e8e8',
      };
    case 'plain':
    default:
      return baseStyles;
  }
}

/**
 * Get CSS font styles
 */
export function getFontStyles(font: JournalFont): React.CSSProperties {
  const fontMap: Record<JournalFont, string> = {
    serif: 'Georgia, "Times New Roman", serif',
    clean: 'Inter, Roboto, -apple-system, sans-serif',
    handwritten: '"Caveat", "Dancing Script", cursive',
    typewriter: '"Courier New", Courier, monospace',
    elegant: '"Cormorant Garamond", Georgia, serif',
    journal: 'Quicksand, "Open Sans", sans-serif',
  };

  return {
    fontFamily: fontMap[font] || fontMap.serif,
  };
}
