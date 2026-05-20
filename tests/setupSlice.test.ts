import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  setupReducer,
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
  persistSetupState,
} from '../src/store/setupSlice';

function createSetupState(overrides = {}) {
  return {
    isComplete: false,
    completedAt: null,
    language: 'en',
    timeMode: null as 'SYNC' | 'TRUE' | null,
    zodiacSigns: null as 12 | 13 | null,
    locationEnabled: null as boolean | null,
    notificationsEnabled: null as boolean | null,
    aiProvider: null as string | null,
    aiModel: null as string | null,
    aiApiKeyConfigured: false,
    ...overrides,
  };
}

describe('setupSlice', () => {
  describe('reducers', () => {
    it('setLanguage changes language', () => {
      let state = createSetupState();
      state = setupReducer(state, setLanguage('fr'));
      expect(state.language).toBe('fr');
    });

    it('setTimeMode changes time mode', () => {
      let state = createSetupState();
      state = setupReducer(state, setTimeMode('TRUE'));
      expect(state.timeMode).toBe('TRUE');
    });

    it('setZodiacSigns changes sign count', () => {
      let state = createSetupState();
      state = setupReducer(state, setZodiacSigns(13));
      expect(state.zodiacSigns).toBe(13);
    });

    it('setLocationEnabled toggles location', () => {
      let state = createSetupState();
      state = setupReducer(state, setLocationEnabled(true));
      expect(state.locationEnabled).toBe(true);
    });

    it('setNotificationsEnabled toggles notifications', () => {
      let state = createSetupState();
      state = setupReducer(state, setNotificationsEnabled(true));
      expect(state.notificationsEnabled).toBe(true);
    });

    it('setAIProvider sets provider', () => {
      let state = createSetupState();
      state = setupReducer(state, setAIProvider('openai'));
      expect(state.aiProvider).toBe('openai');
    });

    it('setAIModel sets model', () => {
      let state = createSetupState();
      state = setupReducer(state, setAIModel('gpt-4'));
      expect(state.aiModel).toBe('gpt-4');
    });

    it('setAIApiKeyConfigured sets flag', () => {
      let state = createSetupState();
      state = setupReducer(state, setAIApiKeyConfigured(true));
      expect(state.aiApiKeyConfigured).toBe(true);
    });

    it('completeSetup marks complete with timestamp', () => {
      let state = createSetupState();
      state = setupReducer(state, completeSetup());
      expect(state.isComplete).toBe(true);
      expect(state.completedAt).toBeTruthy();
      expect(new Date(state.completedAt!).toISOString()).toBe(state.completedAt);
    });

    it('resetSetup clears completion and preserves defaults', () => {
      let state = createSetupState({
        isComplete: true,
        completedAt: '2024-01-01T00:00:00Z',
        language: 'fr',
        timeMode: 'TRUE' as const,
        zodiacSigns: 13 as const,
      });
      state = setupReducer(state, resetSetup());
      expect(state.isComplete).toBe(false);
      expect(state.completedAt).toBeNull();
      // resetSetup returns { ...initialState, isComplete: false, completedAt: null }
      // initialState language defaults to 'en' when localStorage is empty
      expect(state.language).toBe('en');
    });
  });

  describe('persistSetupState', () => {
    let storage: Record<string, string> = {};

    beforeEach(() => {
      storage = {};
      vi.stubGlobal('localStorage', {
        getItem: (key: string) => storage[key] ?? null,
        setItem: (key: string, value: string) => { storage[key] = value; },
        removeItem: (key: string) => { delete storage[key]; },
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('writes all fields to localStorage', () => {
      const state = createSetupState({
        language: 'de',
        timeMode: 'SYNC' as const,
        zodiacSigns: 12 as const,
        locationEnabled: true,
        notificationsEnabled: false,
        aiProvider: 'anthropic',
        aiModel: 'claude-3',
        aiApiKeyConfigured: true,
        isComplete: true,
        completedAt: '2024-06-15T10:00:00Z',
      });
      persistSetupState(state);

      const raw = storage['heka-setup-v1'];
      expect(raw).toBeTruthy();
      const parsed = JSON.parse(raw);
      expect(parsed.language).toBe('de');
      expect(parsed.timeMode).toBe('SYNC');
      expect(parsed.zodiacSigns).toBe(12);
      expect(parsed.locationEnabled).toBe(true);
      expect(parsed.notificationsEnabled).toBe(false);
      expect(parsed.aiProvider).toBe('anthropic');
      expect(parsed.aiModel).toBe('claude-3');
      expect(parsed.aiApiKeyConfigured).toBe(true);
      expect(parsed.isComplete).toBe(true);
      expect(parsed.completedAt).toBe('2024-06-15T10:00:00Z');
    });

    it('resetSetup removes localStorage key', () => {
      storage['heka-setup-v1'] = JSON.stringify({ language: 'fr' });
      let state = createSetupState({ language: 'fr' });
      state = setupReducer(state, resetSetup());
      expect(storage['heka-setup-v1']).toBeUndefined();
    });
  });
});
