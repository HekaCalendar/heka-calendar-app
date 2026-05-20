// @ts-nocheck
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getZodiacSystemPreference,
  getZodiacFramePreference,
  getSignCountPreference,
  calculateElementalBalanceWithSystem,
  calculateModalityBalanceWithSystem,
} from '../src/astrology/services/natal/zodiacHelpers';
import type { CelestialBody } from '../src/astrology/types';
import { toDegree } from '../src/astrology/types/core';

function makeBody(id: string, longitude: number, sign: string): CelestialBody {
  return {
    id: id as CelestialBody['id'],
    longitude: toDegree(longitude),
    latitude: 0,
    distance: 1,
    speed: 1,
    isRetrograde: false,
    sign: sign as CelestialBody['sign'],
    degreeInSign: toDegree(longitude % 30) as CelestialBody['degreeInSign'],
  };
}

describe('zodiacHelpers', () => {
  beforeEach(() => {
    localStorage.removeItem('heka-calendar-state');
  });

  describe('getZodiacSystemPreference', () => {
    it('returns 12-sign by default', () => {
      expect(getZodiacSystemPreference()).toBe('12-sign');
    });

    it('returns stored zodiac system', () => {
      localStorage.setItem(
        'heka-calendar-state',
        JSON.stringify({ astroPreferences: { zodiacSystem: '13-sign' } })
      );
      expect(getZodiacSystemPreference()).toBe('13-sign');
    });

    it('maps sidereal to 12-sign', () => {
      localStorage.setItem(
        'heka-calendar-state',
        JSON.stringify({ astroPreferences: { zodiacSystem: 'sidereal' } })
      );
      expect(getZodiacSystemPreference()).toBe('12-sign');
    });

    it('falls back to 12-sign on invalid JSON', () => {
      localStorage.setItem('heka-calendar-state', 'not-json');
      expect(getZodiacSystemPreference()).toBe('12-sign');
    });
  });

  describe('getZodiacFramePreference', () => {
    it('returns tropical by default', () => {
      expect(getZodiacFramePreference()).toBe('tropical');
    });

    it('returns stored zodiac frame', () => {
      localStorage.setItem(
        'heka-calendar-state',
        JSON.stringify({ astroPreferences: { zodiacFrame: 'sidereal' } })
      );
      expect(getZodiacFramePreference()).toBe('sidereal');
    });

    it('falls back to tropical on invalid JSON', () => {
      localStorage.setItem('heka-calendar-state', 'not-json');
      expect(getZodiacFramePreference()).toBe('tropical');
    });
  });

  describe('getSignCountPreference', () => {
    it('returns 12 by default', () => {
      expect(getSignCountPreference()).toBe(12);
    });

    it('returns stored sign count', () => {
      localStorage.setItem(
        'heka-calendar-state',
        JSON.stringify({ astroPreferences: { signCount: 13 } })
      );
      expect(getSignCountPreference()).toBe(13);
    });

    it('falls back to 12 on invalid JSON', () => {
      localStorage.setItem('heka-calendar-state', 'not-json');
      expect(getSignCountPreference()).toBe(12);
    });
  });

  describe('calculateElementalBalanceWithSystem', () => {
    it('returns zero counts for empty planets', () => {
      const result = calculateElementalBalanceWithSystem({}, {});
      expect(result).toEqual({ fire: 0, earth: 0, air: 0, water: 0, ether: 0 });
    });

    it('counts elements correctly with custom map', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        moon: makeBody('moon', 45, 'taurus'),
        mercury: makeBody('mercury', 75, 'gemini'),
      };
      const elementMap = {
        aries: 'fire',
        taurus: 'earth',
        gemini: 'air',
      };
      const result = calculateElementalBalanceWithSystem(planets, elementMap);
      expect(result).toEqual({ fire: 1, earth: 1, air: 1, water: 0, ether: 0 });
    });

    it('ignores unknown signs', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        unknown: makeBody('unknown', 0, 'unknown_sign'),
      };
      const elementMap = { aries: 'fire' };
      const result = calculateElementalBalanceWithSystem(planets, elementMap);
      expect(result.fire).toBe(1);
      expect(result.earth).toBe(0);
    });

    it('handles multiple planets in same element', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        mars: makeBody('mars', 135, 'leo'),
        jupiter: makeBody('jupiter', 240, 'sagittarius'),
      };
      const elementMap = {
        aries: 'fire',
        leo: 'fire',
        sagittarius: 'fire',
      };
      const result = calculateElementalBalanceWithSystem(planets, elementMap);
      expect(result.fire).toBe(3);
      expect(result.earth).toBe(0);
      expect(result.air).toBe(0);
      expect(result.water).toBe(0);
      expect(result.ether).toBe(0);
    });

    it('counts ether element', () => {
      const planets = {
        sun: makeBody('sun', 15, 'ophiuchus'),
      };
      const elementMap = { ophiuchus: 'ether' };
      const result = calculateElementalBalanceWithSystem(planets, elementMap);
      expect(result.ether).toBe(1);
    });
  });

  describe('calculateModalityBalanceWithSystem', () => {
    it('returns zero counts for empty planets', () => {
      const result = calculateModalityBalanceWithSystem({}, false);
      expect(result).toEqual({ cardinal: 0, fixed: 0, mutable: 0 });
    });

    it('counts 12-sign modalities correctly', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        moon: makeBody('moon', 45, 'taurus'),
        mercury: makeBody('mercury', 75, 'gemini'),
      };
      const result = calculateModalityBalanceWithSystem(planets, false);
      expect(result).toEqual({ cardinal: 1, fixed: 1, mutable: 1 });
    });

    it('counts cardinal signs', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        moon: makeBody('moon', 105, 'cancer'),
        mercury: makeBody('mercury', 195, 'libra'),
        venus: makeBody('venus', 285, 'capricorn'),
      };
      const result = calculateModalityBalanceWithSystem(planets, false);
      expect(result.cardinal).toBe(4);
      expect(result.fixed).toBe(0);
      expect(result.mutable).toBe(0);
    });

    it('counts fixed signs', () => {
      const planets = {
        sun: makeBody('sun', 45, 'taurus'),
        moon: makeBody('moon', 135, 'leo'),
        mercury: makeBody('mercury', 225, 'scorpio'),
        venus: makeBody('venus', 315, 'aquarius'),
      };
      const result = calculateModalityBalanceWithSystem(planets, false);
      expect(result.cardinal).toBe(0);
      expect(result.fixed).toBe(4);
      expect(result.mutable).toBe(0);
    });

    it('counts mutable signs', () => {
      const planets = {
        sun: makeBody('sun', 75, 'gemini'),
        moon: makeBody('moon', 165, 'virgo'),
        mercury: makeBody('mercury', 255, 'sagittarius'),
        venus: makeBody('venus', 345, 'pisces'),
      };
      const result = calculateModalityBalanceWithSystem(planets, false);
      expect(result.cardinal).toBe(0);
      expect(result.fixed).toBe(0);
      expect(result.mutable).toBe(4);
    });

    it('counts ophiuchus as fixed in 13-sign mode', () => {
      const planets = {
        sun: makeBody('sun', 230, 'ophiuchus'),
      };
      const result = calculateModalityBalanceWithSystem(planets, true);
      expect(result.fixed).toBe(1);
      expect(result.cardinal).toBe(0);
      expect(result.mutable).toBe(0);
    });

    it('ignores ophiuchus in 12-sign mode', () => {
      const planets = {
        sun: makeBody('sun', 230, 'ophiuchus'),
      };
      const result = calculateModalityBalanceWithSystem(planets, false);
      expect(result).toEqual({ cardinal: 0, fixed: 0, mutable: 0 });
    });

    it('ignores unknown signs', () => {
      const planets = {
        sun: makeBody('sun', 15, 'aries'),
        unknown: makeBody('unknown', 0, 'unknown_sign'),
      };
      const result = calculateModalityBalanceWithSystem(planets, false);
      expect(result.cardinal).toBe(1);
      expect(result.fixed).toBe(0);
      expect(result.mutable).toBe(0);
    });
  });
});
