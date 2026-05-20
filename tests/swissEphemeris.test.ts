import { describe, it, expect } from 'vitest';
import {
  calculateJulianDay,
  calculateAyanamsa,
  calculateSiderealTime,
  calculateAllPlanets,
  calculateHouses,
  calculateRiseTransitSet,
  birthDateTimeToUTC,
  setZodiacSystem,
  getZodiacSystem,
  setZodiacFrame,
  getZodiacFrame,
  setSignCount,
  getSignCount,
  setSiderealMode,
  getSiderealMode,
} from '../src/astrology/services/swiss-ephemeris/engine';

describe('swissEphemeris engine', () => {
  describe('calculateJulianDay', () => {
    it('calculates JD for known epoch (J2000.0)', () => {
      // 2000-01-01 12:00 TT = JD 2451545.0
      const jd = calculateJulianDay(2000, 1, 1, 12, 0, 0);
      expect(jd).toBeCloseTo(2451545.0, 1);
    });

    it('calculates JD for Unix epoch (1970-01-01)', () => {
      const jd = calculateJulianDay(1970, 1, 1, 0, 0, 0);
      expect(jd).toBeCloseTo(2440587.5, 1);
    });

    it('calculates JD for 2024-06-15', () => {
      const jd = calculateJulianDay(2024, 6, 15, 0, 0, 0);
      expect(jd).toBeGreaterThan(2460000);
      expect(jd).toBeLessThan(2470000);
    });

    it('handles seconds correctly', () => {
      const jd1 = calculateJulianDay(2000, 1, 1, 12, 0, 0);
      const jd2 = calculateJulianDay(2000, 1, 1, 12, 0, 30);
      expect(jd2 - jd1).toBeCloseTo(30 / 86400, 6);
    });

    it('handles minutes correctly', () => {
      const jd1 = calculateJulianDay(2000, 1, 1, 12, 0, 0);
      const jd2 = calculateJulianDay(2000, 1, 1, 12, 30, 0);
      expect(jd2 - jd1).toBeCloseTo(30 / 1440, 6);
    });

    it('handles leap year February', () => {
      const jd = calculateJulianDay(2024, 2, 29, 0, 0, 0);
      expect(jd).toBeGreaterThan(calculateJulianDay(2024, 2, 28, 0, 0, 0));
    });

    it('handles pre-Gregorian date', () => {
      const jd = calculateJulianDay(1500, 1, 1, 0, 0, 0);
      expect(jd).toBeGreaterThan(2000000);
    });
  });

  describe('calculateAyanamsa', () => {
    it('returns 0 when mock engine lacks ayanamsa function', () => {
      // MockSwissEngine does not have get_ayanamsa_ex_ut
      const aya = calculateAyanamsa(2451545.0);
      expect(aya).toBe(0);
    });
  });

  describe('calculateSiderealTime', () => {
    it('returns a number for J2000', () => {
      const st = calculateSiderealTime(2451545.0);
      expect(typeof st).toBe('number');
      expect(st).toBeGreaterThanOrEqual(0);
    });

    it('changes with Julian Day', () => {
      const st1 = calculateSiderealTime(2451545.0);
      const st2 = calculateSiderealTime(2451546.0);
      expect(st2).not.toBe(st1);
    });
  });

  describe('calculateAllPlanets', () => {
    it('returns planet data with mock engine', () => {
      const planets = calculateAllPlanets(2451545.0);
      expect(Object.keys(planets).length).toBeGreaterThan(0);
      expect(planets.sun).toBeDefined();
      expect(planets.moon).toBeDefined();
      expect(planets.mercury).toBeDefined();
      expect(planets.venus).toBeDefined();
      expect(planets.mars).toBeDefined();
    });

    it('returns valid planet positions', () => {
      const planets = calculateAllPlanets(2451545.0);
      for (const body of Object.values(planets)) {
        expect(body.longitude).toBeGreaterThanOrEqual(0);
        expect(body.longitude).toBeLessThan(360);
        expect(body.sign).toBeTruthy();
        expect(body.degreeInSign).toBeGreaterThanOrEqual(0);
        expect(body.degreeInSign).toBeLessThan(30);
      }
    });

    it('filters to requested planets', () => {
      const planets = calculateAllPlanets(2451545.0, ['sun', 'moon']);
      expect(Object.keys(planets)).toHaveLength(2);
      expect(planets.sun).toBeDefined();
      expect(planets.moon).toBeDefined();
      expect(planets.mercury).toBeUndefined();
    });

    it('ignores unknown planet names', () => {
      const planets = calculateAllPlanets(2451545.0, ['sun', 'unknown']);
      expect(Object.keys(planets)).toHaveLength(1);
      expect(planets.sun).toBeDefined();
    });
  });

  describe('calculateHouses', () => {
    it('returns house data with mock engine', () => {
      const houses = calculateHouses(2451545.0, { latitude: 40.7, longitude: -74.0 });
      expect(houses.ascendant).toBeGreaterThanOrEqual(0);
      expect(houses.ascendant).toBeLessThan(360);
      expect(houses.mc).toBeGreaterThanOrEqual(0);
      expect(houses.mc).toBeLessThan(360);
      expect(houses.cusps).toHaveLength(12);
    });

    it('returns 12 cusps with valid longitudes', () => {
      const houses = calculateHouses(2451545.0, { latitude: 40.7, longitude: -74.0 });
      for (const cusp of houses.cusps) {
        expect(cusp.longitude).toBeGreaterThanOrEqual(0);
        expect(cusp.longitude).toBeLessThan(360);
        expect(cusp.sign).toBeTruthy();
      }
    });

    it('ic is opposite mc', () => {
      const houses = calculateHouses(2451545.0, { latitude: 40.7, longitude: -74.0 });
      const expectedIc = (houses.mc + 180) % 360;
      expect(houses.ic).toBeCloseTo(expectedIc, 5);
    });

    it('dsc is opposite ascendant', () => {
      const houses = calculateHouses(2451545.0, { latitude: 40.7, longitude: -74.0 });
      const expectedDsc = (houses.ascendant + 180) % 360;
      expect(houses.dsc).toBeCloseTo(expectedDsc, 5);
    });

    it('returns valid data for all house systems', () => {
      for (const hs of ['P', 'K', 'E', 'W', 'R', 'C', 'O']) {
        const houses = calculateHouses(2451545.0, { latitude: 40.7, longitude: -74.0 }, hs);
        expect(houses.cusps).toHaveLength(12);
        expect(houses.ascendant).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('calculateRiseTransitSet', () => {
    it('returns nulls when not initialized', () => {
      const rts = calculateRiseTransitSet(2451545.0, 0, 40.7, -74.0);
      expect(rts.rise).toBeNull();
      expect(rts.transit).toBeNull();
      expect(rts.set).toBeNull();
    });
  });

  describe('birthDateTimeToUTC', () => {
    it('converts UTC timezone correctly', () => {
      const utc = birthDateTimeToUTC('2024-06-15', '14:30', 'UTC');
      expect(utc.getUTCFullYear()).toBe(2024);
      expect(utc.getUTCMonth()).toBe(5); // June = 5
      expect(utc.getUTCDate()).toBe(15);
      expect(utc.getUTCHours()).toBe(14);
      expect(utc.getUTCMinutes()).toBe(30);
    });

    it('converts EST to UTC', () => {
      const utc = birthDateTimeToUTC('2024-06-15', '14:30', 'America/New_York');
      // June 15 is EDT (UTC-4), so 14:30 EDT = 18:30 UTC
      expect(utc.getUTCHours()).toBe(18);
      expect(utc.getUTCMinutes()).toBe(30);
    });

    it('converts PST to UTC', () => {
      const utc = birthDateTimeToUTC('2024-06-15', '14:30', 'America/Los_Angeles');
      // June 15 is PDT (UTC-7), so 14:30 PDT = 21:30 UTC
      expect(utc.getUTCHours()).toBe(21);
      expect(utc.getUTCMinutes()).toBe(30);
    });

    it('converts London timezone', () => {
      const utc = birthDateTimeToUTC('2024-06-15', '14:30', 'Europe/London');
      // June 15 is BST (UTC+1), so 14:30 BST = 13:30 UTC
      expect(utc.getUTCHours()).toBe(13);
      expect(utc.getUTCMinutes()).toBe(30);
    });

    it('converts Sydney timezone', () => {
      const utc = birthDateTimeToUTC('2024-06-15', '14:30', 'Australia/Sydney');
      // June 15 is AEST (UTC+10), so 14:30 AEST = 04:30 UTC
      expect(utc.getUTCHours()).toBe(4);
      expect(utc.getUTCMinutes()).toBe(30);
    });

    it('handles midnight correctly', () => {
      const utc = birthDateTimeToUTC('2024-01-01', '00:00', 'UTC');
      expect(utc.getUTCHours()).toBe(0);
      expect(utc.getUTCMinutes()).toBe(0);
    });

    it('handles leap year date', () => {
      const utc = birthDateTimeToUTC('2024-02-29', '12:00', 'UTC');
      expect(utc.getUTCMonth()).toBe(1); // February = 1
      expect(utc.getUTCDate()).toBe(29);
    });
  });

  describe('zodiac system state', () => {
    it('sets and gets zodiac system', () => {
      setZodiacSystem('13-sign');
      expect(getZodiacSystem()).toBe('13-sign');
      setZodiacSystem('sidereal');
      expect(getZodiacSystem()).toBe('sidereal');
      setZodiacSystem('12-sign');
      expect(getZodiacSystem()).toBe('12-sign');
    });

    it('sets and gets zodiac frame', () => {
      setZodiacFrame('sidereal');
      expect(getZodiacFrame()).toBe('sidereal');
      setZodiacFrame('tropical');
      expect(getZodiacFrame()).toBe('tropical');
    });

    it('sets and gets sign count', () => {
      setSignCount(13);
      expect(getSignCount()).toBe(13);
      setSignCount(12);
      expect(getSignCount()).toBe(12);
    });

    it('sets and gets sidereal mode', () => {
      setSiderealMode('lahiri');
      expect(getSiderealMode()).toBe(1);
      setSiderealMode(null);
      expect(getSiderealMode()).toBeNull();
    });

    it('defaults to 12-sign tropical', () => {
      setZodiacSystem('12-sign');
      expect(getZodiacSystem()).toBe('12-sign');
      expect(getZodiacFrame()).toBe('tropical');
      expect(getSignCount()).toBe(12);
    });
  });
});
