import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { eventBus } from '../../src/services/eventBus';
import { aiConfigService } from '../../src/services/aiConfigService';
import {
  makeCandidate,
  withArchetypeDialect,
  candidatesFromContext,
} from '../../src/components/CalendarAICoach/candidates';
import type { OracleContext, CandidateMessage } from '../../src/types/oracle';

describe('CalendarAICoach candidates', () => {
  let emitSpy: ReturnType<typeof vi.spyOn>;
  let setContextSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    emitSpy = vi.spyOn(eventBus, 'emit').mockImplementation(() => {});
    setContextSpy = vi.spyOn(aiConfigService, 'setUserContext').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('makeCandidate', () => {
    it('returns a candidate with defaults', () => {
      const c = makeCandidate('test-1', {});
      expect(c.id).toBe('test-1');
      expect(c.type).toBe('insight');
      expect(c.text).toBe('');
      expect(c.icon).toBe('✨');
      expect(c.color).toBe('#d4af37');
      expect(c.topic).toBe('general');
      expect(c.weight).toBe(50);
    });

    it('overrides defaults with provided values', () => {
      const c = makeCandidate('test-2', { type: 'nudge', text: 'Hello', weight: 80 });
      expect(c.type).toBe('nudge');
      expect(c.text).toBe('Hello');
      expect(c.weight).toBe(80);
    });
  });

  describe('withArchetypeDialect', () => {
    it('returns fallback when confidence is low', () => {
      const ctx = baseContext({ archetype: { name: 'mystic', confidence: 0.2 } });
      expect(withArchetypeDialect(ctx, 'greeting', 'Hello')).toBe('Hello');
    });

    it('returns fallback when archetype name is undefined', () => {
      const ctx = baseContext({ archetype: { name: undefined, confidence: 0.5 } });
      expect(withArchetypeDialect(ctx, 'greeting', 'Hello')).toBe('Hello');
    });
  });

  describe('candidatesFromContext', () => {
    it('returns empty array for minimal context', () => {
      const ctx = baseContext();
      const candidates = candidatesFromContext(ctx);
      expect(Array.isArray(candidates)).toBe(true);
      expect(candidates.length).toBeGreaterThan(0);
    });

    it('includes streak danger candidate when present', () => {
      const ctx = baseContext({
        streakDanger: { text: 'Streak at risk!', icon: '🔥', color: '#ef4444' },
      });
      const candidates = candidatesFromContext(ctx);
      const danger = candidates.find((c) => c.topic === 'streak-danger');
      expect(danger).toBeDefined();
      expect(danger!.weight).toBe(110);
    });

    it('includes mood support candidate when shouldOfferSupport is true', () => {
      const ctx = baseContext({
        mood: { shouldOfferSupport: true, tone: 'gentle', declineSeverity: 'moderate' },
      });
      const candidates = candidatesFromContext(ctx);
      const support = candidates.find((c) => c.topic === 'mood-support');
      expect(support).toBeDefined();
      expect(support!.weight).toBe(85);
    });

    it('includes void moon candidate when isVoidMoon is true', () => {
      const ctx = baseContext({ isVoidMoon: true, timeMode: 'SYNC' });
      const candidates = candidatesFromContext(ctx);
      const voc = candidates.find((c) => c.topic === 'void-moon');
      expect(voc).toBeDefined();
      expect(voc!.text).toContain('void of course');
    });

    it('includes celebration when tasks completed today', () => {
      const ctx = baseContext({ user: { ...baseUser(), todayCompleted: 1 } });
      const candidates = candidatesFromContext(ctx);
      const celebration = candidates.find((c) => c.topic === 'celebration');
      expect(celebration).toBeDefined();
      expect(celebration!.type).toBe('celebration');
    });

    it('includes moon phase candidate for full moon', () => {
      const ctx = baseContext({ celestial: { ...baseCelestial(), moonPhase: 'full', moonSign: 'Leo' } });
      const candidates = candidatesFromContext(ctx);
      const moon = candidates.find((c) => c.topic === 'moon-full');
      expect(moon).toBeDefined();
      expect(moon!.text).toContain('Full Moon');
    });

    it('candidates have unique ids', () => {
      const ctx = baseContext();
      const candidates = candidatesFromContext(ctx);
      const ids = candidates.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('candidates have valid weights between 0 and 120', () => {
      const ctx = baseContext();
      const candidates = candidatesFromContext(ctx);
      for (const c of candidates) {
        expect(c.weight).toBeGreaterThanOrEqual(0);
        expect(c.weight).toBeLessThanOrEqual(120);
      }
    });
  });
});

function baseContext(overrides: Partial<OracleContext> = {}): OracleContext {
  return {
    focusDate: { year: 2024, month: 1, day: 1 },
    dateKey: '2024-1-1',
    todayIso: '2024-01-01',
    timeLabel: 'morning',
    greeting: 'Good morning',
    hour: 9,
    celestial: baseCelestial(),
    user: baseUser(),
    memory: { recentMessages: [], recentTopics: [], lastPrompt: '' },
    mood: { shouldOfferSupport: false, tone: 'gentle', declineSeverity: 'none' },
    archetype: { name: undefined, confidence: 0 },
    streakDanger: null,
    transit: { transits: [], topTransit: null, overallTone: 'quiet', summary: '', hasBirthChart: false },
    isVoidMoon: false,
    location: { hasLocation: false },
    planetaryHour: null,
    sunTimes: { sunrise: null, sunset: null, solarNoon: null, dayLength: 0 },
    season: null,
    solarReturn: null,
    zone: 'calendar',
    timeMode: 'SYNC',
    ...overrides,
  };
}

function baseCelestial(): OracleContext['celestial'] {
  return {
    moonPhase: 'waxing_crescent',
    moonSign: 'Aries',
    sunSign: 'Capricorn',
    retrogrades: [],
    dominantElement: 'fire',
    allPlanets: {},
    currentAspects: [],
    criticalDegrees: [],
    moonDetails: { illumination: 15, age: 3, speed: 13.5 },
    lunarNodes: null,
    chiron: null,
    rawPositions: {},
  };
}

function baseUser(): OracleContext['user'] {
  return {
    pendingTasks: 0,
    todayCompleted: 0,
    streak: 0,
    daysSinceJournal: 5,
    hasCreatedFirstTask: false,
    lastTaskCreationDate: undefined,
    lastTaskContent: undefined,
    lastJournalThemes: [],
    lastJournalSnippet: undefined,
    lastCoachInteraction: 0,
    writingStreak: 0,
    longestWritingStreak: 0,
    moodAverage: 0,
    totalNotes: 0,
  };
}
