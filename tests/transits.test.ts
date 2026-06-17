// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  calculateTransits,
  generateDailyForecast,
} from '../src/astrology/services/calculations/transits';
import type { CelestialBody, PlanetId, Aspect } from '../src/astrology/types';
import { toDegree } from '../src/astrology/types';
import type { DailyTransit } from '../src/astrology/services/calculations/transits';

function makeBody(id: PlanetId, longitude: number, speed: number = 1): CelestialBody {
  return {
    id,
    longitude: toDegree(longitude),
    latitude: 0,
    distance: 1,
    speed,
    isRetrograde: speed < 0,
    sign: 'aries',
    degreeInSign: toDegree(longitude % 30),
  } as CelestialBody;
}

function createDailyTransit(
  transiting: PlanetId,
  natal: PlanetId,
  aspectType: Aspect['type'],
  significance: 'major' | 'minor'
): DailyTransit {
  const aspectAngles: Record<string, number> = {
    conjunction: 0,
    sextile: 60,
    square: 90,
    trine: 120,
    opposition: 180,
  };
  return {
    transitingPlanet: transiting,
    natalPlanet: natal,
    aspect: {
      type: aspectType,
      body1: transiting,
      body2: natal,
      angle: toDegree(aspectAngles[aspectType] ?? 0),
      orb: 1,
      applying: true,
      isExact: false,
    },
    applying: true,
    duration: 24,
    significance,
    interpretation: 'Test interpretation',
  };
}

describe('transits', () => {
  describe('calculateTransits', () => {
    it('returns an array', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { mars: makeBody('mars', 2) };
      const result = calculateTransits(current, natal);
      expect(Array.isArray(result)).toBe(true);
    });

    it('includes close transits with orb <= 3', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { mars: makeBody('mars', 2) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].aspect.orb).toBeLessThanOrEqual(3);
    });

    it('excludes transits with orb > 3', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { mars: makeBody('mars', 10) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBe(0);
    });

    it('skips same planet (no self-conjunction)', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { sun: makeBody('sun', 0) };
      const result = calculateTransits(current, natal);
      const selfTransit = result.find(
        t => t.transitingPlanet === 'sun' && t.natalPlanet === 'sun'
      );
      expect(selfTransit).toBeUndefined();
    });

    it('sorts results by orb ascending', () => {
      const natal = { sun: makeBody('sun', 0), moon: makeBody('moon', 60) };
      const current = {
        mars: makeBody('mars', 1),
        venus: makeBody('venus', 59),
      };
      const result = calculateTransits(current, natal);
      for (let i = 1; i < result.length; i++) {
        expect(result[i].aspect.orb).toBeGreaterThanOrEqual(result[i - 1].aspect.orb);
      }
    });

    it('has correct DailyTransit fields', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { mars: makeBody('mars', 2) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBeGreaterThan(0);
      const transit = result[0];
      expect(transit).toHaveProperty('transitingPlanet');
      expect(transit).toHaveProperty('natalPlanet');
      expect(transit).toHaveProperty('aspect');
      expect(transit).toHaveProperty('applying');
      expect(transit).toHaveProperty('duration');
      expect(transit).toHaveProperty('significance');
      expect(transit).toHaveProperty('interpretation');
    });

    it('calculates duration as a positive number', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { mars: makeBody('mars', 2) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].duration).toBeGreaterThan(0);
    });

    it('returns major significance for outer planet to personal planet', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { jupiter: makeBody('jupiter', 0) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].significance).toBe('major');
    });

    it('returns major significance for square to sun', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { mars: makeBody('mars', 90) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].significance).toBe('major');
    });

    it('returns major significance for opposition to moon', () => {
      const natal = { moon: makeBody('moon', 0) };
      const current = { mars: makeBody('mars', 180) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].significance).toBe('major');
    });

    it('returns minor significance for sextile between personal planets', () => {
      const natal = { mercury: makeBody('mercury', 0) };
      const current = { venus: makeBody('venus', 60) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].significance).toBe('minor');
    });

    it('generates non-empty interpretation string', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { moon: makeBody('moon', 2) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBeGreaterThan(0);
      expect(typeof result[0].interpretation).toBe('string');
      expect(result[0].interpretation.length).toBeGreaterThan(0);
    });

    it('returns empty array when no close aspects exist', () => {
      const natal = { sun: makeBody('sun', 0) };
      const current = { mars: makeBody('mars', 15) };
      const result = calculateTransits(current, natal);
      expect(result.length).toBe(0);
    });

    it('handles multiple natal and current planets', () => {
      const natal = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 90),
        mercury: makeBody('mercury', 180),
      };
      const current = {
        mars: makeBody('mars', 2),
        venus: makeBody('venus', 92),
        jupiter: makeBody('jupiter', 178),
      };
      const result = calculateTransits(current, natal);
      // mars-sun conjunction, venus-moon square, jupiter-mercury opposition
      expect(result.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('generateDailyForecast', () => {
    it('returns a TransitForecast object', () => {
      const date = new Date('2025-01-15');
      const result = generateDailyForecast(date, []);
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('transits');
      expect(result).toHaveProperty('dominantTheme');
      expect(result).toHaveProperty('advice');
      expect(result).toHaveProperty('powerMoments');
      expect(result).toHaveProperty('cautionPeriods');
    });

    it('formats date as YYYY-MM-DD string', () => {
      const date = new Date('2025-01-15T12:00:00');
      const result = generateDailyForecast(date, []);
      expect(result.date).toBe('2025-01-15');
    });

    it('returns default theme when no transits provided', () => {
      const result = generateDailyForecast(new Date(), []);
      expect(result.dominantTheme).toBe('Steady Progress');
    });

    it('returns default advice when no transits provided', () => {
      const result = generateDailyForecast(new Date(), []);
      expect(result.advice).toContain('steady');
    });

    it('extracts Emotional Processing theme when moon is involved', () => {
      const transit = createDailyTransit('moon', 'sun', 'conjunction', 'major');
      const result = generateDailyForecast(new Date(), [transit]);
      expect(result.dominantTheme).toBe('Emotional Processing');
    });

    it('extracts Growth Opportunities theme when jupiter is involved', () => {
      const transit = createDailyTransit('jupiter', 'sun', 'trine', 'major');
      const result = generateDailyForecast(new Date(), [transit]);
      expect(result.dominantTheme).toBe('Growth Opportunities');
    });

    it('generates balance advice for challenging plus supportive transits', () => {
      const t1 = createDailyTransit('saturn', 'sun', 'square', 'major');
      const t2 = createDailyTransit('jupiter', 'moon', 'trine', 'major');
      const result = generateDailyForecast(new Date(), [t1, t2]);
      expect(result.advice).toContain('Balance');
    });

    it('generates patience advice for only challenging transits', () => {
      const t1 = createDailyTransit('saturn', 'sun', 'square', 'major');
      const result = generateDailyForecast(new Date(), [t1]);
      expect(result.advice).toContain('patience');
    });

    it('generates favorable advice for only supportive transits', () => {
      const t1 = createDailyTransit('jupiter', 'sun', 'trine', 'major');
      const result = generateDailyForecast(new Date(), [t1]);
      expect(result.advice).toContain('Favorable');
    });

    it('finds morning power moment for moon-venus trine', () => {
      const transit = createDailyTransit('moon', 'venus', 'trine', 'minor');
      const result = generateDailyForecast(new Date(), [transit]);
      expect(result.powerMoments.length).toBeGreaterThan(0);
      expect(result.powerMoments[0]).toContain('Morning');
    });

    it('finds afternoon power moment for sun-mars conjunction', () => {
      const transit = createDailyTransit('sun', 'mars', 'conjunction', 'major');
      const result = generateDailyForecast(new Date(), [transit]);
      expect(result.powerMoments.length).toBeGreaterThan(0);
      expect(result.powerMoments[0]).toContain('Afternoon');
    });

    it('finds caution period for moon-saturn square', () => {
      const transit = createDailyTransit('moon', 'saturn', 'square', 'major');
      const result = generateDailyForecast(new Date(), [transit]);
      expect(result.cautionPeriods.length).toBeGreaterThan(0);
      expect(result.cautionPeriods[0]).toContain('Evening');
    });

    it('finds caution period for mars-saturn conjunction', () => {
      const transit = createDailyTransit('mars', 'saturn', 'conjunction', 'major');
      const result = generateDailyForecast(new Date(), [transit]);
      expect(result.cautionPeriods.length).toBeGreaterThan(0);
      expect(result.cautionPeriods[0]).toContain('forcing');
    });

    it('returns empty arrays for empty transits', () => {
      const result = generateDailyForecast(new Date(), []);
      expect(result.powerMoments).toEqual([]);
      expect(result.cautionPeriods).toEqual([]);
    });

    it('passes transits through to the forecast', () => {
      const t1 = createDailyTransit('moon', 'sun', 'conjunction', 'major');
      const t2 = createDailyTransit('mars', 'venus', 'square', 'minor');
      const result = generateDailyForecast(new Date(), [t1, t2]);
      expect(result.transits).toHaveLength(2);
    });
  });
});
