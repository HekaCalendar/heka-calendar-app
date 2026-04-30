/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SETUP SLICE — First-boot wizard state
 * Stores language, mode, permissions, AI config chosen during setup
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_LANGUAGE } from '../data/languages';

const STORAGE_KEY = 'heka-setup-v1';

export interface SetupState {
  // Completion
  isComplete: boolean;
  completedAt: string | null;

  // Step 1: Language
  language: string;

  // Step 2: Mode (populated in Phase 2)
  timeMode: 'SYNC' | 'TRUE' | null;
  zodiacSigns: 12 | 13 | null;

  // Step 3: Permissions (populated in Phase 3)
  locationEnabled: boolean | null;
  notificationsEnabled: boolean | null;

  // Step 4: AI (populated in Phase 4)
  aiProvider: string | null;
  aiModel: string | null;
  aiApiKeyConfigured: boolean;
}

function loadPersistedSetup(): Partial<SetupState> | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return undefined;
}

const persisted = loadPersistedSetup();

const initialState: SetupState = {
  isComplete: persisted?.isComplete ?? false,
  completedAt: persisted?.completedAt ?? null,
  language: persisted?.language || DEFAULT_LANGUAGE,
  timeMode: persisted?.timeMode ?? null,
  zodiacSigns: persisted?.zodiacSigns ?? null,
  locationEnabled: persisted?.locationEnabled ?? null,
  notificationsEnabled: persisted?.notificationsEnabled ?? null,
  aiProvider: persisted?.aiProvider ?? null,
  aiModel: persisted?.aiModel ?? null,
  aiApiKeyConfigured: persisted?.aiApiKeyConfigured ?? false,
};

const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },

    setTimeMode: (state, action: PayloadAction<'SYNC' | 'TRUE'>) => {
      state.timeMode = action.payload;
    },

    setZodiacSigns: (state, action: PayloadAction<12 | 13>) => {
      state.zodiacSigns = action.payload;
    },

    setLocationEnabled: (state, action: PayloadAction<boolean>) => {
      state.locationEnabled = action.payload;
    },

    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },

    setAIProvider: (state, action: PayloadAction<string | null>) => {
      state.aiProvider = action.payload;
    },

    setAIModel: (state, action: PayloadAction<string | null>) => {
      state.aiModel = action.payload;
    },

    setAIApiKeyConfigured: (state, action: PayloadAction<boolean>) => {
      state.aiApiKeyConfigured = action.payload;
    },

    completeSetup: (state) => {
      state.isComplete = true;
      state.completedAt = new Date().toISOString();
    },

    resetSetup: () => {
      localStorage.removeItem(STORAGE_KEY);
      return { ...initialState, isComplete: false, completedAt: null };
    },
  },
});

export const {
  setLanguage,
  setTimeMode,
  setZodiacSigns,
  setLocationEnabled,
  setNotificationsEnabled,
  setAIProvider,
  setAIModel,
  setAIApiKeyConfigured,
  completeSetup,
  resetSetup,
} = setupSlice.actions;

export const setupReducer = setupSlice.reducer;

// Persistence middleware helper
export function persistSetupState(state: SetupState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      language: state.language,
      timeMode: state.timeMode,
      zodiacSigns: state.zodiacSigns,
      locationEnabled: state.locationEnabled,
      notificationsEnabled: state.notificationsEnabled,
      aiProvider: state.aiProvider,
      aiModel: state.aiModel,
      aiApiKeyConfigured: state.aiApiKeyConfigured,
      isComplete: state.isComplete,
      completedAt: state.completedAt,
    }));
  } catch { /* ignore */ }
}
