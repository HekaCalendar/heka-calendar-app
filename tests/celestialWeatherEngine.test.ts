// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  calculateSkyAspects,
  generateDailyWeather,
  buildTransitTimeline,
  generatePersonalForecast,
} from '../src/oracle/celestialWeatherEngine';
import type { PlanetPosition, PersonalTransit } from '../src/oracle/birthChartIntegration';

describe('celestialWeatherEngine', () => {
  describe('calculateSkyAspects', () => {
    function makePos(longitude: number, speed = 1): PlanetPosition {
      return { longitude, latitude: 0, distance: 1, speed, sign: 'aries', degreeInSign: 0, house: 1 };
    }

    it('returns empty array for single planet', () => {
      const aspects = calculateSkyAspects({ sun: makePos(0) });
      expect(aspects).toHaveLength(0);
    });

    it('detects conjunction between two planets', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(10),
        moon: makePos(10),
      });
      expect(aspects.length).toBeGreaterThan(0);
      expect(aspects[0].aspect).toBe('conjunction');
      expect(aspects[0].orb).toBeLessThanOrEqual(10);
    });

    it('detects opposition', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(0),
        moon: makePos(180),
      });
      expect(aspects.length).toBeGreaterThan(0);
      expect(aspects.some(a => a.aspect === 'opposition')).toBe(true);
    });

    it('detects trine', () => {
      // aspect angle must equal normalized(long1 - long2)
      const aspects = calculateSkyAspects({
        sun: makePos(120),
        moon: makePos(0),
      });
      expect(aspects.some(a => a.aspect === 'trine')).toBe(true);
    });

    it('detects square', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(90),
        moon: makePos(0),
      });
      expect(aspects.some(a => a.aspect === 'square')).toBe(true);
    });

    it('detects sextile', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(60),
        moon: makePos(0),
      });
      expect(aspects.some(a => a.aspect === 'sextile')).toBe(true);
    });

    it('skips aspects beyond max orb', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(0),
        moon: makePos(15), // 15° is beyond 10° max orb for sky aspects
      });
      expect(aspects).toHaveLength(0);
    });

    it('sorts by strength descending', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(0),
        moon: makePos(2), // tight orb
        mars: makePos(95), // wide orb square
      });
      if (aspects.length >= 2) {
        expect(aspects[0].strength).toBeGreaterThanOrEqual(aspects[1].strength);
      }
    });

    it('assigns correct nature to aspects', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(0),
        moon: makePos(0),
        mars: makePos(90),
        jupiter: makePos(120),
      });
      const conjunction = aspects.find(a => a.aspect === 'conjunction');
      const square = aspects.find(a => a.aspect === 'square');
      const trine = aspects.find(a => a.aspect === 'trine');
      if (conjunction) expect(conjunction.nature).toBe('neutral');
      if (square) expect(square.nature).toBe('challenging');
      if (trine) expect(trine.nature).toBe('harmonious');
    });

    it('includes isApplying field', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(0, 1),
        moon: makePos(5, 2),
      });
      if (aspects.length > 0) {
        expect(typeof aspects[0].isApplying).toBe('boolean');
      }
    });

    it('generates interpretation for known planets', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(0),
        moon: makePos(0),
      });
      if (aspects.length > 0) {
        expect(aspects[0].interpretation).toBeTruthy();
        expect(aspects[0].interpretation.length).toBeGreaterThan(0);
      }
    });

    it('handles missing planet positions gracefully', () => {
      const aspects = calculateSkyAspects({
        sun: makePos(0),
        moon: undefined as unknown as PlanetPosition,
      });
      // Should not throw, may or may not have aspects
      expect(Array.isArray(aspects)).toBe(true);
    });
  });

  describe('generateDailyWeather', () => {
    function makePos(longitude: number): PlanetPosition {
      return { longitude, latitude: 0, distance: 1, speed: 1, sign: 'aries', degreeInSign: 0, house: 1 };
    }

    it('returns daily weather structure', () => {
      const weather = generateDailyWeather({
        sun: makePos(0),
        moon: makePos(30),
      });
      expect(weather.date).toBeInstanceOf(Date);
      expect(weather.skyAspects).toBeDefined();
      expect(weather.moonPhase).toBeDefined();
      expect(weather.moonPhase.name).toBeTruthy();
      expect(weather.moonPhase.emoji).toBeTruthy();
      expect(weather.dominantEnergy).toBeTruthy();
      expect(weather.themes).toBeInstanceOf(Array);
      expect(weather.advice).toBeTruthy();
    });

    it('calculates moon phase from sun-moon angle', () => {
      const newMoon = generateDailyWeather({ sun: makePos(0), moon: makePos(0) });
      expect(newMoon.moonPhase.name).toContain('New');

      const fullMoon = generateDailyWeather({ sun: makePos(0), moon: makePos(180) });
      expect(fullMoon.moonPhase.name).toContain('Full');

      const firstQuarter = generateDailyWeather({ sun: makePos(0), moon: makePos(90) });
      expect(firstQuarter.moonPhase.name).toContain('First');
    });

    it('includes illumination percentage', () => {
      const weather = generateDailyWeather({ sun: makePos(0), moon: makePos(180) });
      expect(weather.moonPhase.illumination).toBeGreaterThan(90);
    });

    it('handles missing moon data', () => {
      const weather = generateDailyWeather({ sun: makePos(0) });
      expect(weather.moonPhase.name).toBe('Unknown');
      expect(weather.moonPhase.emoji).toBe('🌑');
    });

    it('uses provided date', () => {
      const date = new Date('2024-06-15');
      const weather = generateDailyWeather({ sun: makePos(0), moon: makePos(30) }, date);
      expect(weather.date.getTime()).toBe(date.getTime());
    });
  });

  describe('buildTransitTimeline', () => {
    const now = new Date('2024-06-15T12:00:00Z');

    function makeTransit(orb: number, strength: number, planet = 'jupiter'): PersonalTransit {
      return {
        id: `t-${planet}-${orb}`,
        transitingPlanet: planet,
        natalPlanet: 'sun',
        aspect: 'trine',
        orb,
        strength,
        activatedHouse: 5,
        natalHouse: 1,
        transitingSign: 'leo',
      };
    }

    it('categorizes current transits', () => {
      const timeline = buildTransitTimeline([makeTransit(1, 80)], now);
      expect(timeline.current.length).toBeGreaterThan(0);
    });

    it('categorizes past transits', () => {
      // Negative orb = past, moon is fast so it's clearly past
      const timeline = buildTransitTimeline([makeTransit(-10, 30, 'moon')], now);
      expect(timeline.recent.length).toBeGreaterThan(0);
    });

    it('categorizes future transits', () => {
      // Large orb with slow planet = future
      const timeline = buildTransitTimeline([makeTransit(10, 50, 'saturn')], now);
      expect(timeline.upcoming.length).toBeGreaterThan(0);
    });

    it('sorts current by days to exact', () => {
      const transits = [makeTransit(3, 60), makeTransit(1, 80)];
      const timeline = buildTransitTimeline(transits, now);
      if (timeline.current.length >= 2) {
        expect(Math.abs(timeline.current[0].daysToExact)).toBeLessThanOrEqual(
          Math.abs(timeline.current[1].daysToExact)
        );
      }
    });

    it('limits recent to 3 entries', () => {
      const transits = Array.from({ length: 5 }, (_, i) =>
        makeTransit(10 + i, 20, 'moon')
      );
      const timeline = buildTransitTimeline(transits, now);
      expect(timeline.recent.length).toBeLessThanOrEqual(3);
    });

    it('limits upcoming to 5 entries', () => {
      const transits = Array.from({ length: 8 }, (_, i) =>
        makeTransit(5 + i, 40, 'saturn')
      );
      const timeline = buildTransitTimeline(transits, now);
      expect(timeline.upcoming.length).toBeLessThanOrEqual(5);
    });

    it('calculates energy impact from strength', () => {
      const timeline = buildTransitTimeline(
        [
          { ...makeTransit(1, 85), id: 'high' },
          { ...makeTransit(2, 50), id: 'med' },
          { ...makeTransit(3, 30), id: 'low' },
        ],
        now
      );
      const high = timeline.current.find(e => e.transit.id === 'high');
      const med = timeline.current.find(e => e.transit.id === 'med');
      const low = timeline.current.find(e => e.transit.id === 'low');
      if (high) expect(high.energyImpact).toBe('high');
      if (med) expect(med.energyImpact).toBe('medium');
      if (low) expect(low.energyImpact).toBe('low');
    });

    it('each event has timing data', () => {
      const timeline = buildTransitTimeline([makeTransit(1, 80)], now);
      for (const event of [...timeline.current, ...timeline.recent, ...timeline.upcoming]) {
        expect(event.timing.start).toBeInstanceOf(Date);
        expect(event.timing.exact).toBeInstanceOf(Date);
        expect(event.timing.end).toBeInstanceOf(Date);
        expect(event.period).toMatch(/past|current|future/);
        expect(event.energyImpact).toMatch(/high|medium|low/);
        expect(typeof event.daysToExact).toBe('number');
        expect(typeof event.daysSinceExact).toBe('number');
      }
    });
  });

  describe('generatePersonalForecast', () => {
    const now = new Date('2024-06-15T12:00:00Z');

    function makeEvent(orb: number, strength: number, aspect: string, house: number): import('../src/oracle/celestialWeatherEngine').TransitEvent {
      const transit: PersonalTransit = {
        id: `t-${aspect}`,
        transitingPlanet: 'jupiter',
        natalPlanet: 'sun',
        aspect,
        orb,
        strength,
        activatedHouse: house,
        natalHouse: 1,
        transitingSign: 'leo',
      };
      const planetSpeed = 0.08; // Jupiter speed
      const aspectOrb = 8;
      const daysToExact = orb / planetSpeed;
      const exactDate = new Date(now.getTime() + daysToExact * 24 * 60 * 60 * 1000);
      const totalDuration = (aspectOrb * 2) / planetSpeed;
      const startDate = new Date(exactDate.getTime() - (totalDuration / 2) * 24 * 60 * 60 * 1000);
      const endDate = new Date(exactDate.getTime() + (totalDuration / 2) * 24 * 60 * 60 * 1000);
      const period = endDate < now ? 'past' : startDate > now ? 'future' : 'current';

      return {
        transit,
        timing: { start: startDate, exact: exactDate, end: endDate },
        period,
        energyImpact: strength >= 70 ? 'high' : strength >= 40 ? 'medium' : 'low',
        daysToExact: Math.round(daysToExact),
        daysSinceExact: Math.round(-daysToExact),
      };
    }

    it('returns theme, guidance, and actions', () => {
      const timeline = {
        current: [makeEvent(1, 80, 'trine', 5)],
        recent: [],
        upcoming: [],
      };
      const forecast = generatePersonalForecast(timeline);
      expect(forecast.theme).toBeTruthy();
      expect(forecast.guidance).toBeTruthy();
      expect(forecast.actions).toBeInstanceOf(Array);
      expect(forecast.actions.length).toBeGreaterThan(0);
    });

    it('suggests action for conjunction', () => {
      const timeline = {
        current: [makeEvent(1, 80, 'conjunction', 1)],
        recent: [],
        upcoming: [],
      };
      const forecast = generatePersonalForecast(timeline);
      expect(forecast.actions.some(a => a.includes('intentions'))).toBe(true);
    });

    it('suggests action for square', () => {
      const timeline = {
        current: [makeEvent(1, 80, 'square', 10)],
        recent: [],
        upcoming: [],
      };
      const forecast = generatePersonalForecast(timeline);
      expect(forecast.actions.some(a => a.includes('challenges'))).toBe(true);
    });

    it('suggests action for trine', () => {
      const timeline = {
        current: [makeEvent(1, 80, 'trine', 5)],
        recent: [],
        upcoming: [],
      };
      const forecast = generatePersonalForecast(timeline);
      expect(forecast.actions.some(a => a.includes('action') || a.includes('supporting'))).toBe(true);
    });

    it('provides integration guidance for recent endings', () => {
      const timeline = {
        current: [],
        recent: [makeEvent(-10, 60, 'opposition', 7)],
        upcoming: [],
      };
      const forecast = generatePersonalForecast(timeline);
      expect(forecast.actions.some(a => a.includes('Reflect') || a.includes('integrate'))).toBe(true);
    });

    it('returns default actions when no transits', () => {
      const timeline = { current: [], recent: [], upcoming: [] };
      const forecast = generatePersonalForecast(timeline);
      expect(forecast.actions.length).toBeGreaterThan(0);
      expect(forecast.guidance).toContain('quiet');
      expect(forecast.theme).toBeTruthy();
    });

    it('detects peak activity', () => {
      // Use fast planet (moon) with tight orb so daysToExact <= 1
      const event = makeEvent(0.5, 85, 'conjunction', 1);
      // Override with moon speed for fast transit
      event.transit.transitingPlanet = 'moon';
      event.daysToExact = 0; // force within 1 day
      const timeline = {
        current: [event],
        recent: [],
        upcoming: [],
      };
      const forecast = generatePersonalForecast(timeline);
      expect(forecast.guidance).toContain('Peak');
    });

    it('warns about upcoming energy when current is active', () => {
      // Current must be non-empty for upcoming check to be reached
      const currentEvent = makeEvent(2, 50, 'sextile', 3);
      currentEvent.transit.transitingPlanet = 'saturn';
      currentEvent.daysToExact = 5; // not <= 1, so peak check fails
      const upcomingEvent = makeEvent(10, 70, 'trine', 5);
      upcomingEvent.transit.transitingPlanet = 'moon';
      upcomingEvent.daysToExact = 1; // <= 3
      const timeline = {
        current: [currentEvent],
        recent: [],
        upcoming: [upcomingEvent],
      };
      const forecast = generatePersonalForecast(timeline);
      expect(forecast.guidance).toContain('Prepare');
    });
  });
});
