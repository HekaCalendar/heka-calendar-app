// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getNextSignBoundary,
  calculateCurrentSky,
  calculatePreciseMoonPhase,
  detectVoidMoon,
  calculatePlanetaryHours,
  getCurrentPlanetaryHour,
  calculateRetrogrades,
  calculateCurrentAspects,
  findCriticalDegrees,
  calculateSunTimes,
  clearCalculationCache,
  getFallbackPositions,
} from '../src/astrology/services/calculations/swissCalculations';
import type { CelestialBody } from '../src/astrology/types';
import * as engine from '../src/astrology/services/swiss-ephemeris/engine';
import { calculateJulianDay } from '../src/astrology/services/swiss-ephemeris/engine';

function makeBody(overrides: Partial<CelestialBody> & { longitude: number }): CelestialBody {
  const lon = overrides.longitude;
  return {
    id: (overrides.id ?? 'sun') as CelestialBody['id'],
    longitude: lon as CelestialBody['longitude'],
    latitude: overrides.latitude ?? 0,
    distance: overrides.distance ?? 1,
    speed: overrides.speed ?? 1,
    isRetrograde: overrides.isRetrograde ?? false,
    sign: (overrides.sign ?? 'aries') as CelestialBody['sign'],
    degreeInSign: (overrides.degreeInSign ?? (lon % 30)) as CelestialBody['degreeInSign'],
  } as CelestialBody;
}

const baseDate = new Date('2025-06-15T12:00:00Z');
const testLat = 40.7128;
const testLon = -74.006;

function mockSunTimes() {
  vi.spyOn(engine, 'calculateSunrise').mockImplementation(async (d) => {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 6, 0, 0));
  });
  vi.spyOn(engine, 'calculateSunset').mockImplementation(async (d) => {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 20, 0, 0));
  });
}

describe('swissCalculations', () => {
  beforeEach(() => {
    clearCalculationCache();
    vi.restoreAllMocks();
  });

  describe('getNextSignBoundary', () => {
    it('returns 30 for 15° in 12-sign', () => {
      expect(getNextSignBoundary(15, false)).toBe(30);
    });

    it('returns 360 for 350° in 12-sign', () => {
      expect(getNextSignBoundary(350, false)).toBe(360);
    });

    it('returns 30 for 0° in 12-sign', () => {
      expect(getNextSignBoundary(0, false)).toBe(30);
    });

    it('returns 60 for 30° in 12-sign', () => {
      expect(getNextSignBoundary(30, false)).toBe(60);
    });

    it('returns 360 for 359° in 12-sign', () => {
      expect(getNextSignBoundary(359, false)).toBe(360);
    });

    it('normalizes negative longitudes', () => {
      expect(getNextSignBoundary(-10, false)).toBe(360);
    });

    it('normalizes longitudes above 360', () => {
      expect(getNextSignBoundary(370, false)).toBe(30);
    });

    it('returns correct 13-sign boundary for Aries region', () => {
      expect(getNextSignBoundary(10, true)).toBe(28);
    });

    it('returns correct 13-sign boundary for Scorpio region', () => {
      expect(getNextSignBoundary(220, true)).toBe(223);
    });

    it('returns 360 for end-of-zodiac in 13-sign', () => {
      expect(getNextSignBoundary(350, true)).toBe(360);
    });
  });

  describe('calculateCurrentSky', () => {
    it('returns object with positions', async () => {
      const result = await calculateCurrentSky(baseDate);
      expect(result).toHaveProperty('positions');
      expect(result).toHaveProperty('julianDay');
      expect(result).toHaveProperty('timestamp');
    });

    it('positions contains sun', async () => {
      const result = await calculateCurrentSky(baseDate);
      expect(result.positions.sun).toBeDefined();
    });

    it('positions contains moon', async () => {
      const result = await calculateCurrentSky(baseDate);
      expect(result.positions.moon).toBeDefined();
    });

    it('positions contains all major planets', async () => {
      const result = await calculateCurrentSky(baseDate);
      const major = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
      major.forEach(p => expect(result.positions[p]).toBeDefined());
    });

    it('julianDay is a positive number', async () => {
      const result = await calculateCurrentSky(baseDate);
      expect(typeof result.julianDay).toBe('number');
      expect(result.julianDay).toBeGreaterThan(2400000);
    });

    it('timestamp matches input date', async () => {
      const result = await calculateCurrentSky(baseDate);
      expect(result.timestamp).toBe(baseDate.getTime());
    });

    it('caches repeated calls', async () => {
      const r1 = await calculateCurrentSky(baseDate);
      const r2 = await calculateCurrentSky(baseDate);
      expect(r1).toBe(r2);
    });

    it('position values have required fields', async () => {
      const result = await calculateCurrentSky(baseDate);
      const sun = result.positions.sun;
      expect(sun).toHaveProperty('longitude');
      expect(sun).toHaveProperty('latitude');
      expect(sun).toHaveProperty('distance');
      expect(sun).toHaveProperty('speed');
      expect(sun).toHaveProperty('isRetrograde');
      expect(sun).toHaveProperty('sign');
      expect(sun).toHaveProperty('degreeInSign');
    });

    it('falls back when engine throws', async () => {
      vi.spyOn(engine, 'calculateAllPlanets').mockImplementation(() => {
        throw new Error('engine failure');
      });
      const result = await calculateCurrentSky(baseDate);
      expect(result.positions.sun).toBeDefined();
      expect(result.julianDay).toBeGreaterThan(2400000);
    });
  });

  describe('calculatePreciseMoonPhase', () => {
    it('returns illumination between 0 and 100', () => {
      const sun = makeBody({ longitude: 0, id: 'sun' });
      const moon = makeBody({ longitude: 90, id: 'moon' });
      const phase = calculatePreciseMoonPhase(sun, moon);
      expect(phase.illumination).toBeGreaterThanOrEqual(0);
      expect(phase.illumination).toBeLessThanOrEqual(100);
    });

    it('new moon has low illumination', () => {
      const sun = makeBody({ longitude: 0, id: 'sun' });
      const moon = makeBody({ longitude: 0, id: 'moon' });
      const phase = calculatePreciseMoonPhase(sun, moon);
      expect(phase.name).toBe('New Moon');
      expect(phase.illumination).toBeLessThan(5);
      expect(phase.isWaxing).toBe(true);
    });

    it('first quarter is waxing', () => {
      const sun = makeBody({ longitude: 0, id: 'sun' });
      const moon = makeBody({ longitude: 90, id: 'moon' });
      const phase = calculatePreciseMoonPhase(sun, moon);
      expect(phase.name).toBe('First Quarter');
      expect(phase.isWaxing).toBe(true);
    });

    it('full moon has high illumination', () => {
      const sun = makeBody({ longitude: 0, id: 'sun' });
      const moon = makeBody({ longitude: 180, id: 'moon' });
      const phase = calculatePreciseMoonPhase(sun, moon);
      expect(phase.name).toBe('Full Moon');
      expect(phase.illumination).toBeGreaterThan(95);
      expect(phase.isWaxing).toBe(false);
    });

    it('last quarter is waning', () => {
      const sun = makeBody({ longitude: 0, id: 'sun' });
      const moon = makeBody({ longitude: 270, id: 'moon' });
      const phase = calculatePreciseMoonPhase(sun, moon);
      expect(phase.name).toBe('Last Quarter');
      expect(phase.isWaxing).toBe(false);
    });

    it('waxing crescent has correct emoji', () => {
      const sun = makeBody({ longitude: 0, id: 'sun' });
      const moon = makeBody({ longitude: 45, id: 'moon' });
      const phase = calculatePreciseMoonPhase(sun, moon);
      expect(phase.name).toBe('Waxing Crescent');
      expect(phase.emoji).toBe('🌒');
    });

    it('waning crescent has correct emoji', () => {
      const sun = makeBody({ longitude: 0, id: 'sun' });
      const moon = makeBody({ longitude: 315, id: 'moon' });
      const phase = calculatePreciseMoonPhase(sun, moon);
      expect(phase.name).toBe('Waning Crescent');
      expect(phase.emoji).toBe('🌘');
    });

    it('phase is between 0 and 1', () => {
      const sun = makeBody({ longitude: 0, id: 'sun' });
      const moon = makeBody({ longitude: 120, id: 'moon' });
      const phase = calculatePreciseMoonPhase(sun, moon);
      expect(phase.phase).toBeGreaterThanOrEqual(0);
      expect(phase.phase).toBeLessThanOrEqual(1);
    });
  });

  describe('detectVoidMoon', () => {
    it('returns object with isVoid property', async () => {
      const result = await detectVoidMoon();
      expect(result).toHaveProperty('isVoid');
      expect(typeof result.isVoid).toBe('boolean');
    });

    it('returns isVoid false', async () => {
      const result = await detectVoidMoon();
      expect(result.isVoid).toBe(false);
    });
  });

  describe('calculatePlanetaryHours', () => {
    it('returns array of 24 hours', async () => {
      mockSunTimes();
      const hours = await calculatePlanetaryHours(baseDate, testLat, testLon);
      expect(Array.isArray(hours)).toBe(true);
      expect(hours.length).toBe(24);
    });

    it('each hour has required fields', async () => {
      mockSunTimes();
      const hours = await calculatePlanetaryHours(baseDate, testLat, testLon);
      hours.forEach(h => {
        expect(h).toHaveProperty('hour');
        expect(h).toHaveProperty('planet');
        expect(h).toHaveProperty('symbol');
        expect(h).toHaveProperty('startTime');
        expect(h).toHaveProperty('endTime');
        expect(h).toHaveProperty('activities');
        expect(h).toHaveProperty('isDay');
      });
    });

    it('first 12 hours are day hours', async () => {
      mockSunTimes();
      const hours = await calculatePlanetaryHours(baseDate, testLat, testLon);
      const dayHours = hours.filter(h => h.isDay);
      expect(dayHours.length).toBe(12);
    });

    it('last 12 hours are night hours', async () => {
      mockSunTimes();
      const hours = await calculatePlanetaryHours(baseDate, testLat, testLon);
      const nightHours = hours.filter(h => !h.isDay);
      expect(nightHours.length).toBe(12);
    });

    it('planets follow Chaldean order sequentially', async () => {
      mockSunTimes();
      const hours = await calculatePlanetaryHours(baseDate, testLat, testLon);
      const chaldean = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'];
      for (let i = 1; i < hours.length; i++) {
        const prevIndex = chaldean.indexOf(hours[i - 1].planet);
        const currIndex = chaldean.indexOf(hours[i].planet);
        expect((prevIndex + 1) % 7).toBe(currIndex);
      }
    });

    it('symbols match planets', async () => {
      mockSunTimes();
      const hours = await calculatePlanetaryHours(baseDate, testLat, testLon);
      const symbolMap: Record<string, string> = {
        saturn: '♄', jupiter: '♃', mars: '♂', sun: '☉', venus: '♀', mercury: '☿', moon: '☽'
      };
      hours.forEach(h => {
        expect(h.symbol).toBe(symbolMap[h.planet]);
      });
    });

    it('fallback returns 24 hours when no rise/set data', async () => {
      vi.spyOn(engine, 'calculateSunrise').mockResolvedValue(null);
      vi.spyOn(engine, 'calculateSunset').mockResolvedValue(null);
      const hours = await calculatePlanetaryHours(baseDate, testLat, testLon);
      expect(hours.length).toBe(24);
      expect(hours.some(h => h.isDay)).toBe(true);
      expect(hours.some(h => !h.isDay)).toBe(true);
    });

    it('startTimes and endTimes are Date instances', async () => {
      mockSunTimes();
      const hours = await calculatePlanetaryHours(baseDate, testLat, testLon);
      hours.forEach(h => {
        expect(h.startTime).toBeInstanceOf(Date);
        expect(h.endTime).toBeInstanceOf(Date);
      });
    });
  });

  describe('getCurrentPlanetaryHour', () => {
    it('returns a planet name string', async () => {
      mockSunTimes();
      const result = await getCurrentPlanetaryHour(baseDate, testLat, testLon);
      expect(typeof result.planet).toBe('string');
      expect(result.planet.length).toBeGreaterThan(0);
    });

    it('returns symbol string', async () => {
      mockSunTimes();
      const result = await getCurrentPlanetaryHour(baseDate, testLat, testLon);
      expect(typeof result.symbol).toBe('string');
    });

    it('returns activities array', async () => {
      mockSunTimes();
      const result = await getCurrentPlanetaryHour(baseDate, testLat, testLon);
      expect(Array.isArray(result.activities)).toBe(true);
      expect(result.activities.length).toBeGreaterThan(0);
    });

    it('returns nextHour string', async () => {
      mockSunTimes();
      const result = await getCurrentPlanetaryHour(baseDate, testLat, testLon);
      expect(typeof result.nextHour).toBe('string');
      expect(result.nextHour).not.toBe(result.planet);
    });

    it('returns progress between 0 and 100', async () => {
      mockSunTimes();
      const result = await getCurrentPlanetaryHour(baseDate, testLat, testLon);
      expect(result.progress).toBeGreaterThanOrEqual(0);
      expect(result.progress).toBeLessThanOrEqual(100);
    });

    it('isDay true during daytime', async () => {
      mockSunTimes();
      const midday = new Date('2025-06-15T12:00:00Z');
      const result = await getCurrentPlanetaryHour(midday, testLat, testLon);
      expect(result.isDay).toBe(true);
    });

    it('isDay false during nighttime', async () => {
      mockSunTimes();
      const midnight = new Date('2025-06-15T23:00:00Z');
      const result = await getCurrentPlanetaryHour(midnight, testLat, testLon);
      expect(result.isDay).toBe(false);
    });

    it('handles pre-sunrise time', async () => {
      mockSunTimes();
      const preSunrise = new Date('2025-06-15T04:00:00Z');
      const result = await getCurrentPlanetaryHour(preSunrise, testLat, testLon);
      expect(typeof result.planet).toBe('string');
      expect(result.isDay).toBe(false);
    });

    it('includes sunrise and sunset when available', async () => {
      mockSunTimes();
      const result = await getCurrentPlanetaryHour(baseDate, testLat, testLon);
      expect(result.sunrise).toBeInstanceOf(Date);
      expect(result.sunset).toBeInstanceOf(Date);
    });

    it('returns location string when coords provided', async () => {
      mockSunTimes();
      const result = await getCurrentPlanetaryHour(baseDate, testLat, testLon);
      expect(typeof result.location).toBe('string');
      expect(result.location).toContain('°');
    });

    it('fallback when no rise/set data', async () => {
      vi.spyOn(engine, 'calculateSunrise').mockResolvedValue(null);
      vi.spyOn(engine, 'calculateSunset').mockResolvedValue(null);
      const result = await getCurrentPlanetaryHour(baseDate, testLat, testLon);
      expect(typeof result.planet).toBe('string');
      expect(result.progress).toBeGreaterThanOrEqual(0);
    });
  });

  describe('calculateRetrogrades', () => {
    it('returns an array', () => {
      const positions = {
        mercury: makeBody({ longitude: 100, id: 'mercury', isRetrograde: true, speed: -0.5 }),
        venus: makeBody({ longitude: 200, id: 'venus', isRetrograde: false, speed: 1.2 }),
      };
      const result = calculateRetrogrades(positions);
      expect(Array.isArray(result)).toBe(true);
    });

    it('detects retrograde planets', () => {
      const positions = {
        mercury: makeBody({ longitude: 100, id: 'mercury', isRetrograde: true, speed: -0.5 }),
      };
      const result = calculateRetrogrades(positions);
      expect(result[0].isRetrograde).toBe(true);
    });

    it('detects direct planets', () => {
      const positions = {
        venus: makeBody({ longitude: 200, id: 'venus', isRetrograde: false, speed: 1.2 }),
      };
      const result = calculateRetrogrades(positions);
      expect(result[0].isRetrograde).toBe(false);
    });

    it('includes planet symbol', () => {
      const positions = {
        mars: makeBody({ longitude: 50, id: 'mars', isRetrograde: false, speed: 0.5 }),
      };
      const result = calculateRetrogrades(positions);
      expect(result[0].symbol).toBe('♂');
    });

    it('includes speed value', () => {
      const positions = {
        jupiter: makeBody({ longitude: 120, id: 'jupiter', isRetrograde: false, speed: 0.08 }),
      };
      const result = calculateRetrogrades(positions);
      expect(typeof result[0].speed).toBe('number');
    });

    it('returns empty array for empty positions', () => {
      const result = calculateRetrogrades({});
      expect(result).toEqual([]);
    });
  });

  describe('calculateCurrentAspects', () => {
    it('returns an array', () => {
      const positions = {
        sun: makeBody({ longitude: 0, id: 'sun' }),
        moon: makeBody({ longitude: 0, id: 'moon' }),
      };
      const aspects = calculateCurrentAspects(positions);
      expect(Array.isArray(aspects)).toBe(true);
    });

    it('detects conjunction', () => {
      const positions = {
        sun: makeBody({ longitude: 10, id: 'sun' }),
        moon: makeBody({ longitude: 12, id: 'moon' }),
      };
      const aspects = calculateCurrentAspects(positions);
      expect(aspects.some(a => a.aspect === 'conjunction')).toBe(true);
    });

    it('detects sextile', () => {
      const positions = {
        sun: makeBody({ longitude: 0, id: 'sun' }),
        moon: makeBody({ longitude: 60, id: 'moon' }),
      };
      const aspects = calculateCurrentAspects(positions);
      expect(aspects.some(a => a.aspect === 'sextile')).toBe(true);
    });

    it('detects square', () => {
      const positions = {
        sun: makeBody({ longitude: 0, id: 'sun' }),
        moon: makeBody({ longitude: 90, id: 'moon' }),
      };
      const aspects = calculateCurrentAspects(positions);
      expect(aspects.some(a => a.aspect === 'square')).toBe(true);
    });

    it('detects trine', () => {
      const positions = {
        sun: makeBody({ longitude: 0, id: 'sun' }),
        moon: makeBody({ longitude: 120, id: 'moon' }),
      };
      const aspects = calculateCurrentAspects(positions);
      expect(aspects.some(a => a.aspect === 'trine')).toBe(true);
    });

    it('detects opposition', () => {
      const positions = {
        sun: makeBody({ longitude: 0, id: 'sun' }),
        moon: makeBody({ longitude: 180, id: 'moon' }),
      };
      const aspects = calculateCurrentAspects(positions);
      expect(aspects.some(a => a.aspect === 'opposition')).toBe(true);
    });

    it('respects maxOrb option', () => {
      const positions = {
        sun: makeBody({ longitude: 0, id: 'sun' }),
        moon: makeBody({ longitude: 10, id: 'moon' }),
      };
      const aspects = calculateCurrentAspects(positions, { maxOrb: 5 });
      expect(aspects.length).toBe(0);
    });

    it('sorts by orb ascending', () => {
      const positions = {
        sun: makeBody({ longitude: 0, id: 'sun' }),
        moon: makeBody({ longitude: 2, id: 'moon' }),
        mars: makeBody({ longitude: 122, id: 'mars' }),
      };
      const aspects = calculateCurrentAspects(positions);
      expect(aspects[0].orb).toBeLessThanOrEqual(aspects[1].orb);
    });

    it('includes description with planet names', () => {
      const positions = {
        sun: makeBody({ longitude: 0, id: 'sun' }),
        moon: makeBody({ longitude: 0, id: 'moon' }),
      };
      const aspects = calculateCurrentAspects(positions);
      expect(aspects[0].description).toContain('Sun');
      expect(aspects[0].description).toContain('Moon');
    });
  });

  describe('findCriticalDegrees', () => {
    it('returns an array', () => {
      const positions = {
        mercury: makeBody({ longitude: 10, id: 'mercury', degreeInSign: 10 as any }),
      };
      const result = findCriticalDegrees(positions);
      expect(Array.isArray(result)).toBe(true);
    });

    it('detects ingress at 0.5°', () => {
      const positions = {
        mercury: makeBody({ longitude: 0.5, id: 'mercury', degreeInSign: 0.5 as any, sign: 'aries' as any }),
      };
      const result = findCriticalDegrees(positions);
      expect(result.some(r => r.type === 'ingress')).toBe(true);
    });

    it('detects anaretic at 29.5°', () => {
      const positions = {
        saturn: makeBody({ longitude: 119.5, id: 'saturn', degreeInSign: 29.5 as any, sign: 'cancer' as any }),
      };
      const result = findCriticalDegrees(positions);
      expect(result.some(r => r.type === 'anaretic')).toBe(true);
    });

    it('returns empty array when no critical degrees', () => {
      const positions = {
        venus: makeBody({ longitude: 45, id: 'venus', degreeInSign: 15 as any }),
      };
      const result = findCriticalDegrees(positions);
      expect(result.length).toBe(0);
    });

    it('sorts anaretic before ingress', () => {
      const positions = {
        mars: makeBody({ longitude: 0.5, id: 'mars', degreeInSign: 0.5 as any, sign: 'aries' as any }),
        jupiter: makeBody({ longitude: 89.5, id: 'jupiter', degreeInSign: 29.5 as any, sign: 'gemini' as any }),
      };
      const result = findCriticalDegrees(positions);
      expect(result[0].type).toBe('anaretic');
      expect(result[1].type).toBe('ingress');
    });

    it('includes description with planet and sign', () => {
      const positions = {
        mars: makeBody({ longitude: 0.5, id: 'mars', degreeInSign: 0.5 as any, sign: 'aries' as any }),
      };
      const result = findCriticalDegrees(positions);
      expect(result[0].description).toContain('Mars');
      expect(result[0].description).toContain('Aries');
    });
  });

  describe('calculateSunTimes', () => {
    it('returns sunrise Date object', async () => {
      mockSunTimes();
      const result = await calculateSunTimes(baseDate, testLat, testLon);
      expect(result.sunrise).toBeInstanceOf(Date);
    });

    it('returns sunset Date object', async () => {
      mockSunTimes();
      const result = await calculateSunTimes(baseDate, testLat, testLon);
      expect(result.sunset).toBeInstanceOf(Date);
    });

    it('returns solarNoon Date object', async () => {
      mockSunTimes();
      const result = await calculateSunTimes(baseDate, testLat, testLon);
      expect(result.solarNoon).toBeInstanceOf(Date);
    });

    it('calculates correct dayLength in minutes', async () => {
      mockSunTimes();
      const result = await calculateSunTimes(baseDate, testLat, testLon);
      expect(result.dayLength).toBe(14 * 60);
    });

    it('returns nulls when rise/set unavailable', async () => {
      vi.spyOn(engine, 'calculateSunrise').mockResolvedValue(null);
      vi.spyOn(engine, 'calculateSunset').mockResolvedValue(null);
      const result = await calculateSunTimes(baseDate, testLat, testLon);
      expect(result.sunrise).toBeNull();
      expect(result.sunset).toBeNull();
      expect(result.solarNoon).toBeNull();
      expect(result.dayLength).toBe(0);
    });
  });

  describe('getFallbackPositions', () => {
    it('returns all major planets', () => {
      const jd = 2459000;
      const positions = getFallbackPositions(jd, false);
      const expected = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
      expected.forEach(p => expect(positions[p]).toBeDefined());
    });

    it('returns valid longitude for each planet', () => {
      const jd = 2459000;
      const positions = getFallbackPositions(jd, false);
      Object.values(positions).forEach(body => {
        expect(body.longitude).toBeGreaterThanOrEqual(0);
        expect(body.longitude).toBeLessThan(360);
      });
    });

    it('sidereal fallback subtracts ayanamsa — Feb 3 1998 sun is capricorn', () => {
      const jd1998Feb3 = calculateJulianDay(1998, 2, 3, 12, 0, 0);
      const positions = getFallbackPositions(jd1998Feb3, false, true);
      expect(positions.sun).toBeDefined();
      expect(positions.sun.sign).toBe('capricorn');
    });

    it('tropical fallback does not subtract ayanamsa — Feb 3 1998 sun is aquarius', () => {
      const jd1998Feb3 = calculateJulianDay(1998, 2, 3, 12, 0, 0);
      const positions = getFallbackPositions(jd1998Feb3, false, false);
      expect(positions.sun).toBeDefined();
      expect(positions.sun.sign).toBe('aquarius');
    });
  });

  describe('calculateCurrentSky — sidereal regression: Feb 3 1998', () => {
    let originalFrame: ReturnType<typeof engine.getZodiacFrame>;
    let originalCount: ReturnType<typeof engine.getSignCount>;

    beforeEach(() => {
      originalFrame = engine.getZodiacFrame();
      originalCount = engine.getSignCount();
    });

    afterEach(() => {
      engine.setZodiacFrame(originalFrame);
      engine.setSignCount(originalCount);
    });

    it('returns sun in capricorn when sidereal frame is active', async () => {
      engine.setZodiacFrame('sidereal');
      engine.setSignCount(12);
      const jd1998Feb3 = calculateJulianDay(1998, 2, 3, 12, 0, 0);
      const date = new Date(Date.UTC(1998, 1, 3, 12, 0, 0));
      const result = await calculateCurrentSky(date);
      expect(result.positions.sun).toBeDefined();
      expect(result.positions.sun.sign).toBe('capricorn');
    });

    it('returns sun in aquarius when tropical frame is active', async () => {
      engine.setZodiacFrame('tropical');
      engine.setSignCount(12);
      const date = new Date(Date.UTC(1998, 1, 3, 12, 0, 0));
      const result = await calculateCurrentSky(date);
      expect(result.positions.sun).toBeDefined();
      expect(result.positions.sun.sign).toBe('aquarius');
    });
  });
});
