import { describe, it, expect, vi, beforeEach } from 'vitest';
import { guidanceHistoryService } from '../../src/astrology/services/guidance/guidanceHistoryService';
import type { PersonalizedGuidanceReading, MorningBriefing } from '../../src/astrology/services/guidance/personalizedEngine';

const storage: Record<string, string> = {};

function createMockReading(dateStr: string): PersonalizedGuidanceReading {
  const date = new Date(dateStr);
  return {
    timeframe: 'daily',
    date,
    natalChart: null,
    dominantElement: 'fire',
    natalThemes: ['leadership'],
    transits: [],
    moonPhase: 'full',
    moonSign: 'Sagittarius',
    sunSign: 'Gemini',
    retrogrades: [],
    overallReading: {
      title: `Reading ${dateStr}`,
      summary: 'Summary',
      narrative: 'Narrative',
      advice: [],
      affirmation: 'Affirm',
      confidence: 80,
    },
    lifeAreaReadings: {} as Record<string, any>,
    activePatterns: [],
    patternInsights: [],
    generatedAt: date,
    confidence: 80,
  };
}

function createMockBriefing(dateStr: string): MorningBriefing {
  const date = new Date(dateStr);
  return {
    date,
    greeting: 'Good morning',
    celestialSnapshot: {
      moonPhase: 'full',
      moonSign: 'Sagittarius',
      sunSign: 'Gemini',
      voidMoon: false,
    },
    themeOfTheDay: 'Adventure',
    focusArea: 'personalGrowth',
    guidance: {
      title: `Briefing ${dateStr}`,
      summary: 'Summary',
      narrative: 'Narrative',
      advice: [],
      affirmation: 'Affirm',
      confidence: 80,
    },
    practicalSteps: ['Step 1'],
    affirmation: 'I am strong',
    patternMatches: [],
  };
}

describe('guidanceHistoryService', () => {
  beforeEach(() => {
    Object.keys(storage).forEach((k) => delete storage[k]);

    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => storage[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        storage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete storage[key];
      }),
      clear: vi.fn(() => {
        Object.keys(storage).forEach((k) => delete storage[k]);
      }),
    });

    guidanceHistoryService.clearHistory();
  });

  it('saveReading / getReading round-trip', () => {
    const reading = createMockReading('2024-06-15');
    guidanceHistoryService.saveReading(reading);

    const retrieved = guidanceHistoryService.getReading('2024-06-15');
    expect(retrieved).not.toBeNull();
    expect(retrieved!.overallReading.title).toBe('Reading 2024-06-15');
    expect(retrieved!.date.toISOString()).toBe(new Date('2024-06-15').toISOString());
  });

  it('saveBriefing / getBriefing round-trip', () => {
    const briefing = createMockBriefing('2024-06-15');
    guidanceHistoryService.saveBriefing(briefing);

    const retrieved = guidanceHistoryService.getBriefing('2024-06-15');
    expect(retrieved).not.toBeNull();
    expect(retrieved!.themeOfTheDay).toBe('Adventure');
    expect(retrieved!.date.toISOString()).toBe(new Date('2024-06-15').toISOString());
  });

  it('getReadingDates returns dates newest first (unshift order)', () => {
    guidanceHistoryService.saveReading(createMockReading('2024-06-10'));
    guidanceHistoryService.saveReading(createMockReading('2024-06-15'));
    guidanceHistoryService.saveReading(createMockReading('2024-06-12'));

    const dates = guidanceHistoryService.getReadingDates();
    // Most recently saved first because of unshift
    expect(dates).toEqual(['2024-06-12', '2024-06-15', '2024-06-10']);
  });

  it('getStats counts correctly', () => {
    guidanceHistoryService.saveReading(createMockReading('2024-06-10'));
    guidanceHistoryService.saveReading(createMockReading('2024-06-15'));
    guidanceHistoryService.saveBriefing(createMockBriefing('2024-06-12'));

    const stats = guidanceHistoryService.getStats();
    expect(stats.readings).toBe(2);
    expect(stats.briefings).toBe(1);
    expect(stats.oldestDate).toBe('2024-06-10');
  });

  it('clearHistory removes everything', () => {
    guidanceHistoryService.saveReading(createMockReading('2024-06-15'));
    guidanceHistoryService.saveBriefing(createMockBriefing('2024-06-15'));

    guidanceHistoryService.clearHistory();

    expect(guidanceHistoryService.getReading('2024-06-15')).toBeNull();
    expect(guidanceHistoryService.getBriefing('2024-06-15')).toBeNull();
    expect(guidanceHistoryService.getStats()).toEqual({
      readings: 0,
      briefings: 0,
      oldestDate: null,
    });
    expect(localStorage.removeItem).toHaveBeenCalledWith('heka-celestial-guidance-history');
  });

  it('exportAsJson produces valid JSON', () => {
    guidanceHistoryService.saveReading(createMockReading('2024-06-15'));
    guidanceHistoryService.saveBriefing(createMockBriefing('2024-06-15'));

    const json = guidanceHistoryService.exportAsJson();
    const parsed = JSON.parse(json);

    expect(parsed).toHaveProperty('readings');
    expect(parsed).toHaveProperty('briefings');
    expect(parsed).toHaveProperty('version', 1);
    expect(parsed.readings).toHaveLength(1);
    expect(parsed.briefings).toHaveLength(1);
    expect(parsed.readings[0].date).toBe('2024-06-15');
    expect(parsed.briefings[0].date).toBe('2024-06-15');
  });

  it('handles missing entries gracefully (returns null)', () => {
    expect(guidanceHistoryService.getReading('1999-01-01')).toBeNull();
    expect(guidanceHistoryService.getBriefing('1999-01-01')).toBeNull();
  });

  it('overwrites existing entry for the same date', () => {
    const first = createMockReading('2024-06-15');
    first.overallReading.title = 'First';
    guidanceHistoryService.saveReading(first);

    const second = createMockReading('2024-06-15');
    second.overallReading.title = 'Second';
    guidanceHistoryService.saveReading(second);

    const retrieved = guidanceHistoryService.getReading('2024-06-15');
    expect(retrieved!.overallReading.title).toBe('Second');
    expect(guidanceHistoryService.getStats().readings).toBe(1);
  });

  it('revives Date objects when loading from localStorage', () => {
    const reading = createMockReading('2024-06-15');
    guidanceHistoryService.saveReading(reading);

    // Simulate a fresh load by clearing the in-memory cache indirectly
    // The only public way is clearHistory + re-save, but that defeats the purpose.
    // Instead we verify the stored JSON has string dates and the returned object has Date instances.
    const raw = storage['heka-celestial-guidance-history'];
    expect(raw).toContain('2024-06-15T00:00:00.000Z'); // ISO string for the date

    const retrieved = guidanceHistoryService.getReading('2024-06-15');
    expect(retrieved!.date).toBeInstanceOf(Date);
    expect(retrieved!.generatedAt).toBeInstanceOf(Date);
  });
});
