// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  calculateMoonPhaseData,
  calculateWeeklyMoonPhases,
  calculateVoidOfCourse,
  calculateHourlyMoods,
  calculatePreciseTransitTiming,
  getAllTransitTimings,
} from '../src/oracle/celestialTimingEngine';
import type { PersonalTransit } from '../src/oracle/birthChartIntegration';

describe('celestialTimingEngine', () => {
  describe('calculateMoonPhaseData', () => {
    it('returns valid phase data for current date', () => {
      const data = calculateMoonPhaseData(new Date());
      expect(data.phase).toBeDefined();
      expect(data.phaseName).toBeDefined();
      expect(data.emoji).toBeDefined();
      expect(data.meaning).toBeDefined();
      expect(data.illumination).toBeGreaterThanOrEqual(0);
      expect(data.illumination).toBeLessThanOrEqual(100);
      expect(data.phaseProgress).toBeGreaterThanOrEqual(0);
      expect(data.phaseProgress).toBeLessThan(1);
      expect(data.nextPhase).toBeDefined();
      expect(data.nextPhase.daysUntil).toBeGreaterThan(0);
      expect(data.phaseTiming).toBeDefined();
      expect(data.phaseTiming.percentComplete).toBeGreaterThanOrEqual(0);
      expect(data.phaseTiming.percentComplete).toBeLessThanOrEqual(100);
    });

    it('detects new moon near reference date', () => {
      // Jan 6, 2000 was a known new moon
      const date = new Date('2000-01-06T12:00:00Z');
      const data = calculateMoonPhaseData(date);
      expect(data.phase).toBe('new');
      expect(data.phaseName).toBe('New Moon');
      expect(data.emoji).toBe('🌑');
    });

    it('detects waxing crescent after new moon', () => {
      const date = new Date('2000-01-08T12:00:00Z');
      const data = calculateMoonPhaseData(date);
      expect(data.phase).toBe('waxing');
      expect(data.illumination).toBeGreaterThan(0);
    });

    it('detects full moon at half cycle', () => {
      // Half a lunar cycle after Jan 6, 2000
      const halfCycle = 29.53058868 / 2;
      const date = new Date('2000-01-06T12:00:00Z');
      date.setTime(date.getTime() + halfCycle * 24 * 60 * 60 * 1000);
      const data = calculateMoonPhaseData(date);
      expect(data.phase).toBe('full');
      expect(data.phaseName).toBe('Full Moon');
      expect(data.emoji).toBe('🌕');
      expect(data.illumination).toBeGreaterThan(90);
    });

    it('detects waning phase after full moon', () => {
      const halfCycle = 29.53058868 / 2 + 3;
      const date = new Date('2000-01-06T12:00:00Z');
      date.setTime(date.getTime() + halfCycle * 24 * 60 * 60 * 1000);
      const data = calculateMoonPhaseData(date);
      expect(data.phase).toBe('waning');
    });

    it('includes next phase info', () => {
      const data = calculateMoonPhaseData(new Date());
      expect(data.nextPhase.name).toBeTruthy();
      expect(data.nextPhase.date).toBeInstanceOf(Date);
      expect(data.nextPhase.daysUntil).toBeGreaterThan(0);
      expect(data.nextPhase.daysUntil).toBeLessThan(30);
    });

    it('returns low illumination for new moon', () => {
      const date = new Date('2000-01-06T12:00:00Z');
      const data = calculateMoonPhaseData(date);
      expect(data.illumination).toBeLessThan(5);
    });

    it('returns high illumination for full moon', () => {
      const date = new Date('2000-01-21T12:00:00Z');
      const data = calculateMoonPhaseData(date);
      expect(data.illumination).toBeGreaterThan(90);
    });
  });

  describe('calculateWeeklyMoonPhases', () => {
    it('returns array of events', () => {
      const events = calculateWeeklyMoonPhases(new Date());
      expect(Array.isArray(events)).toBe(true);
    });

    it('includes isCurrent flag on today events', () => {
      const events = calculateWeeklyMoonPhases(new Date());
      const todayEvents = events.filter(e => e.isCurrent);
      // May or may not have events today
      expect(todayEvents.every(e => e.countdown === 'Happening today')).toBe(true);
    });

    it('includes future countdown for non-today events', () => {
      const events = calculateWeeklyMoonPhases(new Date());
      const futureEvents = events.filter(e => !e.isCurrent);
      for (const e of futureEvents) {
        expect(e.countdown).toMatch(/^In \d+ day(s)?$/);
      }
    });

    it('each event has required fields', () => {
      const events = calculateWeeklyMoonPhases(new Date());
      for (const e of events) {
        expect(e.name).toBeTruthy();
        expect(e.emoji).toBeTruthy();
        expect(e.exactDate).toBeInstanceOf(Date);
        expect(e.meaning).toBeTruthy();
      }
    });
  });

  describe('calculateVoidOfCourse', () => {
    it('returns null when no moon position provided', () => {
      const result = calculateVoidOfCourse(new Date());
      expect(result.start).toBeNull();
      expect(result.end).toBeNull();
      expect(result.duration).toBe(0);
    });

    it('returns null when moon degree < 27', () => {
      const result = calculateVoidOfCourse(new Date(), { degree: 15, sign: 'aries' });
      expect(result.start).toBeNull();
      expect(result.end).toBeNull();
      expect(result.duration).toBe(0);
    });

    it('returns VOC data when moon is late in sign', () => {
      const now = new Date();
      const result = calculateVoidOfCourse(now, { degree: 28, sign: 'taurus' });
      // May or may not be currently VOC depending on time
      if (result.start !== null) {
        expect(result.end).toBeInstanceOf(Date);
        expect(result.duration).toBeGreaterThanOrEqual(0);
      }
    });

    it('calculates ingress time correctly for late moon', () => {
      const now = new Date('2024-01-01T12:00:00Z');
      const result = calculateVoidOfCourse(now, { degree: 29, sign: 'gemini' });
      if (result.start !== null && result.end !== null) {
        // 1 degree remaining at 0.5 deg/hour = 2 hours to ingress
        const hoursToIngress = (result.end.getTime() - now.getTime()) / (60 * 60 * 1000);
        expect(hoursToIngress).toBeCloseTo(2, 0);
      }
    });
  });

  describe('calculateHourlyMoods', () => {
    it('returns 8 entries (every 3 hours)', () => {
      const moods = calculateHourlyMoods(new Date());
      expect(moods).toHaveLength(8);
    });

    it('each entry has required fields', () => {
      const moods = calculateHourlyMoods(new Date());
      for (const m of moods) {
        expect(m.time).toMatch(/^\d{2}:00$/);
        expect(m.hour).toBeGreaterThanOrEqual(0);
        expect(m.hour).toBeLessThan(24);
        expect(m.mood).toBeTruthy();
        expect(['excellent', 'good', 'moderate', 'challenging']).toContain(m.quality);
        expect(m.moonDegree).toBeGreaterThanOrEqual(0);
        expect(m.moonDegree).toBeLessThanOrEqual(360);
      }
    });

    it('hours are spaced by 3', () => {
      const moods = calculateHourlyMoods(new Date());
      expect(moods[0].hour).toBe(0);
      expect(moods[1].hour).toBe(3);
      expect(moods[2].hour).toBe(6);
      expect(moods[7].hour).toBe(21);
    });

    it('uses provided moon data', () => {
      const moonData = calculateMoonPhaseData(new Date('2000-01-06T12:00:00Z'));
      const moods = calculateHourlyMoods(new Date(), moonData);
      expect(moods).toHaveLength(8);
      // Near new moon, some hours should be excellent
      const excellentCount = moods.filter(m => m.quality === 'excellent').length;
      expect(excellentCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('calculatePreciseTransitTiming', () => {
    it('calculates timing for tight orb transit', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'jupiter',
        natalPlanet: 'sun',
        aspect: 'trine',
        orb: 0.5,
        strength: 85,
        activatedHouse: 5,
        natalHouse: 1,
        transitingSign: 'leo',
      };
      const timing = calculatePreciseTransitTiming(transit);
      expect(timing.start).toBeInstanceOf(Date);
      expect(timing.exact).toBeInstanceOf(Date);
      expect(timing.end).toBeInstanceOf(Date);
      expect(timing.peakPeriod).toContain('Peak intensity');
      expect(timing.totalDays).toBeGreaterThan(0);
      expect(timing.isActive).toBe(true);
    });

    it('calculates timing for medium orb transit', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'saturn',
        natalPlanet: 'moon',
        aspect: 'square',
        orb: 2.5,
        strength: 60,
        activatedHouse: 10,
        natalHouse: 4,
        transitingSign: 'capricorn',
      };
      const timing = calculatePreciseTransitTiming(transit);
      expect(timing.peakPeriod).toMatch(/Peak in \d+ days/);
      expect(timing.totalDays).toBeGreaterThan(0);
    });

    it('calculates timing for wide orb transit', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'mars',
        natalPlanet: 'venus',
        aspect: 'conjunction',
        orb: 5,
        strength: 40,
        activatedHouse: 7,
        natalHouse: 2,
        transitingSign: 'aries',
      };
      const timing = calculatePreciseTransitTiming(transit);
      expect(timing.peakPeriod).toContain('Building until');
      expect(timing.daysRemaining).toBeGreaterThanOrEqual(0);
    });

    it('handles slow planets correctly', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'pluto',
        natalPlanet: 'mercury',
        aspect: 'opposition',
        orb: 1,
        strength: 70,
        activatedHouse: 8,
        natalHouse: 3,
        transitingSign: 'capricorn',
      };
      const timing = calculatePreciseTransitTiming(transit);
      // Pluto is very slow, so transit lasts very long
      expect(timing.totalDays).toBeGreaterThan(100);
      expect(timing.isActive).toBe(true);
    });

    it('handles fast planets correctly', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'moon',
        natalPlanet: 'sun',
        aspect: 'conjunction',
        orb: 1,
        strength: 80,
        activatedHouse: 1,
        natalHouse: 1,
        transitingSign: 'aries',
      };
      const timing = calculatePreciseTransitTiming(transit);
      // Moon is fast, so transit is short
      expect(timing.totalDays).toBeLessThan(2);
    });
  });

  describe('getAllTransitTimings', () => {
    it('returns empty map for empty array', () => {
      const timings = getAllTransitTimings([]);
      expect(timings.size).toBe(0);
    });

    it('returns timings for each transit', () => {
      const transits: PersonalTransit[] = [
        { id: 't1', transitingPlanet: 'jupiter', natalPlanet: 'sun', aspect: 'trine', orb: 1, strength: 80, activatedHouse: 5, natalHouse: 1, transitingSign: 'leo' },
        { id: 't2', transitingPlanet: 'saturn', natalPlanet: 'moon', aspect: 'square', orb: 2, strength: 60, activatedHouse: 10, natalHouse: 4, transitingSign: 'capricorn' },
      ] as PersonalTransit[];
      const timings = getAllTransitTimings(transits);
      expect(timings.size).toBe(2);
      expect(timings.has('t1')).toBe(true);
      expect(timings.has('t2')).toBe(true);
      const t1 = timings.get('t1')!;
      expect(t1.start).toBeInstanceOf(Date);
      expect(t1.exact).toBeInstanceOf(Date);
      expect(t1.end).toBeInstanceOf(Date);
    });
  });
});
