// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  getHemisphere,
  getLatitudeZone,
  isExtremeLatitude,
  getAstroLocation,
  getSeason,
  getZodiacSeason,
  isZodiacInSeason,
  adjustHousesForSouthernHemisphere,
  getRecommendedHouseSystem,
  getSeasonalContext,
  getSeasonalGuidance,
  getExtremeLatitudeWarning,
  formatLocationDisplay,
  getHemisphereIcon,
  getSeasonIcon,
  getVisiblePlanets,
} from '../src/utils/locationAstro';
import type { PlanetPosition } from '../src/types/astrology';

describe('locationAstro', () => {
  describe('getHemisphere', () => {
    it('returns northern for positive latitude above tropics', () => {
      expect(getHemisphere(40)).toBe('northern');
      expect(getHemisphere(90)).toBe('northern');
    });

    it('returns southern for negative latitude below tropics', () => {
      expect(getHemisphere(-40)).toBe('southern');
      expect(getHemisphere(-90)).toBe('southern');
    });

    it('returns equatorial for latitudes within tropics', () => {
      expect(getHemisphere(0)).toBe('equatorial');
      expect(getHemisphere(20)).toBe('equatorial');
      expect(getHemisphere(-20)).toBe('equatorial');
      expect(getHemisphere(23.5)).toBe('equatorial');
      expect(getHemisphere(-23.5)).toBe('equatorial');
    });
  });

  describe('getLatitudeZone', () => {
    it('returns tropical for low latitudes', () => {
      expect(getLatitudeZone(0)).toBe('tropical');
      expect(getLatitudeZone(20)).toBe('tropical');
      expect(getLatitudeZone(-20)).toBe('tropical');
    });

    it('returns temperate for mid latitudes', () => {
      expect(getLatitudeZone(40)).toBe('temperate');
      expect(getLatitudeZone(-40)).toBe('temperate');
      expect(getLatitudeZone(23.5)).toBe('temperate');
    });

    it('returns polar for high latitudes', () => {
      expect(getLatitudeZone(60)).toBe('polar');
      expect(getLatitudeZone(-60)).toBe('polar');
      expect(getLatitudeZone(66.5)).toBe('polar');
    });

    it('returns extreme for very high latitudes', () => {
      expect(getLatitudeZone(70)).toBe('extreme');
      expect(getLatitudeZone(-70)).toBe('extreme');
      expect(getLatitudeZone(90)).toBe('extreme');
    });
  });

  describe('isExtremeLatitude', () => {
    it('returns true for latitudes above 66.5', () => {
      expect(isExtremeLatitude(70)).toBe(true);
      expect(isExtremeLatitude(-70)).toBe(true);
    });

    it('returns false for lower latitudes', () => {
      expect(isExtremeLatitude(60)).toBe(false);
      expect(isExtremeLatitude(0)).toBe(false);
      expect(isExtremeLatitude(-60)).toBe(false);
    });
  });

  describe('getAstroLocation', () => {
    it('returns complete location object', () => {
      const loc = getAstroLocation('New York', 40.7, -74.0, 'America/New_York', 10);
      expect(loc.name).toBe('New York');
      expect(loc.latitude).toBe(40.7);
      expect(loc.longitude).toBe(-74.0);
      expect(loc.timezone).toBe('America/New_York');
      expect(loc.altitude).toBe(10);
      expect(loc.hemisphere).toBe('northern');
      expect(loc.latitudeZone).toBe('temperate');
      expect(loc.isExtremeLatitude).toBe(false);
    });
  });

  describe('getSeason', () => {
    it('returns correct northern seasons', () => {
      expect(getSeason(new Date('2024-03-15'), 'northern')).toBe('spring');
      expect(getSeason(new Date('2024-06-15'), 'northern')).toBe('summer');
      expect(getSeason(new Date('2024-09-15'), 'northern')).toBe('autumn');
      expect(getSeason(new Date('2024-12-15'), 'northern')).toBe('winter');
    });

    it('returns correct southern seasons', () => {
      expect(getSeason(new Date('2024-03-15'), 'southern')).toBe('autumn');
      expect(getSeason(new Date('2024-06-15'), 'southern')).toBe('winter');
      expect(getSeason(new Date('2024-09-15'), 'southern')).toBe('spring');
      expect(getSeason(new Date('2024-12-15'), 'southern')).toBe('summer');
    });

    it('returns spring for equatorial', () => {
      expect(getSeason(new Date('2024-06-15'), 'equatorial')).toBe('spring');
    });
  });

  describe('getZodiacSeason', () => {
    it('returns spring for aries, taurus, gemini', () => {
      expect(getZodiacSeason('aries')).toBe('spring');
      expect(getZodiacSeason('taurus')).toBe('spring');
      expect(getZodiacSeason('gemini')).toBe('spring');
    });

    it('returns summer for cancer, leo, virgo', () => {
      expect(getZodiacSeason('cancer')).toBe('summer');
      expect(getZodiacSeason('leo')).toBe('summer');
      expect(getZodiacSeason('virgo')).toBe('summer');
    });

    it('returns autumn for libra, scorpio, sagittarius', () => {
      expect(getZodiacSeason('libra')).toBe('autumn');
      expect(getZodiacSeason('scorpio')).toBe('autumn');
      expect(getZodiacSeason('sagittarius')).toBe('autumn');
      expect(getZodiacSeason('ophiuchus')).toBe('autumn');
    });

    it('returns winter for capricorn, aquarius, pisces', () => {
      expect(getZodiacSeason('capricorn')).toBe('winter');
      expect(getZodiacSeason('aquarius')).toBe('winter');
      expect(getZodiacSeason('pisces')).toBe('winter');
    });
  });

  describe('isZodiacInSeason', () => {
    it('returns true when zodiac matches season', () => {
      expect(isZodiacInSeason('aries', new Date('2024-03-15'), 'northern')).toBe(true);
      expect(isZodiacInSeason('cancer', new Date('2024-06-15'), 'northern')).toBe(true);
    });

    it('returns false when zodiac does not match season', () => {
      expect(isZodiacInSeason('aries', new Date('2024-06-15'), 'northern')).toBe(false);
      expect(isZodiacInSeason('cancer', new Date('2024-12-15'), 'northern')).toBe(false);
    });
  });

  describe('adjustHousesForSouthernHemisphere', () => {
    it('returns unchanged for northern hemisphere', () => {
      const houses = [{ longitude: 0 }, { longitude: 30 }];
      const result = adjustHousesForSouthernHemisphere(houses, 40);
      expect(result).toEqual(houses);
    });

    it('marks southern hemisphere houses', () => {
      const houses = [{ longitude: 0 }, { longitude: 30 }];
      const result = adjustHousesForSouthernHemisphere(houses, -40);
      expect(result[0]).toHaveProperty('adjustedForSouthernHemisphere', true);
      expect(result[1]).toHaveProperty('adjustedForSouthernHemisphere', true);
    });
  });

  describe('getRecommendedHouseSystem', () => {
    it('returns placidus for standard latitudes', () => {
      expect(getRecommendedHouseSystem(40)).toBe('placidus');
      expect(getRecommendedHouseSystem(0)).toBe('placidus');
    });

    it('returns equal for high latitudes', () => {
      expect(getRecommendedHouseSystem(65)).toBe('equal');
    });

    it('returns whole-sign for extreme latitudes', () => {
      expect(getRecommendedHouseSystem(70)).toBe('whole-sign');
      expect(getRecommendedHouseSystem(-70)).toBe('whole-sign');
    });
  });

  describe('getSeasonalContext', () => {
    it('returns context with correct season', () => {
      const ctx = getSeasonalContext(new Date('2024-06-15'), 40);
      expect(ctx.season).toBe('summer');
      expect(ctx.hemisphere).toBe('northern');
      expect(ctx.zodiacInPower).toContain('cancer');
      expect(ctx.zodiacInPower).toContain('leo');
      expect(ctx.zodiacInPower).toContain('virgo');
    });

    it('returns southern context for negative latitude', () => {
      const ctx = getSeasonalContext(new Date('2024-06-15'), -40);
      expect(ctx.season).toBe('winter');
      expect(ctx.hemisphere).toBe('southern');
    });
  });

  describe('getSeasonalGuidance', () => {
    it('returns base guidance unchanged for standard case', () => {
      const guidance = getSeasonalGuidance('Test guidance.', new Date('2024-06-15'), 40);
      expect(guidance).toContain('Test guidance.');
    });

    it('adds southern hemisphere note', () => {
      const guidance = getSeasonalGuidance('Test.', new Date('2024-06-15'), -40);
      expect(guidance).toContain('Southern Hemisphere');
    });

    it('adds sun sign amplification when in season', () => {
      const guidance = getSeasonalGuidance('Test.', new Date('2024-06-15'), 40, 'cancer');
      expect(guidance).toContain('amplified');
    });

    it('adds solstice note near solstice', () => {
      const guidance = getSeasonalGuidance('Test.', new Date('2024-01-01'), 40);
      expect(guidance).toContain('solstice');
    });
  });

  describe('getExtremeLatitudeWarning', () => {
    it('returns null for normal latitudes', () => {
      expect(getExtremeLatitudeWarning(40)).toBeNull();
    });

    it('returns warning for extreme latitudes', () => {
      const warning = getExtremeLatitudeWarning(70);
      expect(warning).toContain('70.0° North');
      expect(warning).toContain('Whole Sign');
    });

    it('mentions south pole for negative extreme', () => {
      const warning = getExtremeLatitudeWarning(-80);
      expect(warning).toContain('South');
    });
  });

  describe('formatLocationDisplay', () => {
    it('formats northern/eastern location', () => {
      const loc = getAstroLocation('Tokyo', 35.68, 139.69, 'Asia/Tokyo');
      expect(formatLocationDisplay(loc)).toContain('Tokyo');
      expect(formatLocationDisplay(loc)).toContain('35.68°N');
      expect(formatLocationDisplay(loc)).toContain('139.69°E');
    });

    it('formats southern/western location', () => {
      const loc = getAstroLocation('Sydney', -33.87, -151.21, 'Australia/Sydney');
      expect(formatLocationDisplay(loc)).toContain('33.87°S');
      expect(formatLocationDisplay(loc)).toContain('151.21°W');
    });
  });

  describe('getHemisphereIcon', () => {
    it('returns emoji for each hemisphere', () => {
      expect(getHemisphereIcon('northern')).toBe('🌎');
      expect(getHemisphereIcon('southern')).toBe('🌏');
      expect(getHemisphereIcon('equatorial')).toBe('🌍');
    });
  });

  describe('getSeasonIcon', () => {
    it('returns emoji for each season', () => {
      expect(getSeasonIcon('spring')).toBe('🌱');
      expect(getSeasonIcon('summer')).toBe('☀️');
      expect(getSeasonIcon('autumn')).toBe('🍂');
      expect(getSeasonIcon('winter')).toBe('❄️');
    });
  });

  describe('getVisiblePlanets', () => {
    function makePlanet(name: string): PlanetPosition {
      return { planet: name, longitude: 0, latitude: 0, distance: 1, speed: 1, sign: 'aries', degreeInSign: 0, house: 1 } as PlanetPosition;
    }

    it('moon is always visible', () => {
      const result = getVisiblePlanets([makePlanet('moon')], new Date('2024-06-15T12:00:00'), 0, 0);
      expect(result[0].isVisible).toBe(true);
    });

    it('venus visible at dawn/dusk', () => {
      const dawn = getVisiblePlanets([makePlanet('venus')], new Date('2024-06-15T05:00:00'), 0, 0);
      expect(dawn[0].isVisible).toBe(true);
      const dusk = getVisiblePlanets([makePlanet('venus')], new Date('2024-06-15T20:00:00'), 0, 0);
      expect(dusk[0].isVisible).toBe(true);
    });

    it('jupiter visible at night', () => {
      const night = getVisiblePlanets([makePlanet('jupiter')], new Date('2024-06-15T22:00:00'), 0, 0);
      expect(night[0].isVisible).toBe(true);
      const day = getVisiblePlanets([makePlanet('jupiter')], new Date('2024-06-15T12:00:00'), 0, 0);
      expect(day[0].isVisible).toBe(false);
    });

    it('returns altitude and azimuth fields', () => {
      const result = getVisiblePlanets([makePlanet('mars')], new Date('2024-06-15T22:00:00'), 0, 0);
      expect(typeof result[0].altitude).toBe('number');
      expect(typeof result[0].azimuth).toBe('number');
    });
  });
});
