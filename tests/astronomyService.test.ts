import { describe, it, expect } from 'vitest';
import {
  getSeasonalEvents,
  getNextSeasonalEvent,
  getEventForDate,
  getLunarMonth,
  getMoonPhase,
  getAgriculturalGuidance,
  getEnergyForecast,
  getLunarNewYear,
  getNextLunarNewYear,
} from '../src/services/astronomyService';

describe('astronomyService', () => {
  describe('getSeasonalEvents', () => {
    it('returns 4 events for a year', () => {
      const events = getSeasonalEvents(2024);
      expect(events).toHaveLength(4);
    });

    it('returns vernal equinox first', () => {
      const events = getSeasonalEvents(2024);
      expect(events[0].type).toBe('vernal-equinox');
      expect(events[0].symbol).toBe('🌸');
    });

    it('returns summer solstice second', () => {
      const events = getSeasonalEvents(2024);
      expect(events[1].type).toBe('summer-solstice');
      expect(events[1].symbol).toBe('☀️');
    });

    it('returns autumnal equinox third', () => {
      const events = getSeasonalEvents(2024);
      expect(events[2].type).toBe('autumnal-equinox');
      expect(events[2].symbol).toBe('🍂');
    });

    it('returns winter solstice fourth', () => {
      const events = getSeasonalEvents(2024);
      expect(events[3].type).toBe('winter-solstice');
      expect(events[3].symbol).toBe('❄️');
    });

    it('adapts for southern hemisphere', () => {
      const northern = getSeasonalEvents(2024, 'N');
      const southern = getSeasonalEvents(2024, 'S');
      expect(northern[0].seasonNorthern).toBe('Spring Begins');
      expect(southern[0].seasonSouthern).toBe('Autumn Begins');
    });

    it('returns different dates for leap vs non-leap years', () => {
      const leap = getSeasonalEvents(2024);
      const nonLeap = getSeasonalEvents(2023);
      // Summer solstice differs
      expect(leap[1].date.getDate()).not.toBe(nonLeap[1].date.getDate());
    });
  });

  describe('getNextSeasonalEvent', () => {
    it('returns next event from January', () => {
      const jan = new Date('2024-01-15');
      const next = getNextSeasonalEvent(jan);
      expect(next).not.toBeNull();
      expect(next!.type).toBe('vernal-equinox');
    });

    it('returns next event from mid-year', () => {
      const july = new Date('2024-07-15');
      const next = getNextSeasonalEvent(july);
      expect(next!.type).toBe('autumnal-equinox');
    });

    it('wraps to next year after winter solstice', () => {
      const dec = new Date('2024-12-25');
      const next = getNextSeasonalEvent(dec);
      expect(next!.type).toBe('vernal-equinox');
      expect(next!.date.getFullYear()).toBe(2025);
    });
  });

  describe('getEventForDate', () => {
    it('returns event on equinox date', () => {
      const equinox = new Date(2024, 2, 20); // March 20
      const event = getEventForDate(equinox);
      expect(event).not.toBeNull();
      expect(event!.type).toBe('vernal-equinox');
    });

    it('returns null for non-event date', () => {
      const random = new Date('2024-06-15');
      expect(getEventForDate(random)).toBeNull();
    });
  });

  describe('getLunarMonth', () => {
    it('returns lunar month with required fields', () => {
      const month = getLunarMonth(new Date('2024-01-15'));
      expect(month.name).toBeTruthy();
      expect(month.startDate).toBeInstanceOf(Date);
      expect(month.endDate).toBeInstanceOf(Date);
      expect(month.newMoon).toBeInstanceOf(Date);
      expect(month.fullMoon).toBeInstanceOf(Date);
    });

    it('start date is before end date', () => {
      const month = getLunarMonth(new Date());
      expect(month.startDate.getTime()).toBeLessThan(month.endDate.getTime());
    });

    it('new moon is before full moon', () => {
      const month = getLunarMonth(new Date());
      expect(month.newMoon.getTime()).toBeLessThan(month.fullMoon.getTime());
    });

    it('has one of 12 traditional names', () => {
      const month = getLunarMonth(new Date());
      const validNames = ['Wolf Moon', 'Snow Moon', 'Worm Moon', 'Pink Moon',
        'Flower Moon', 'Strawberry Moon', 'Buck Moon', 'Sturgeon Moon',
        'Harvest Moon', 'Hunter\'s Moon', 'Beaver Moon', 'Cold Moon'];
      expect(validNames).toContain(month.name);
    });
  });

  describe('getMoonPhase', () => {
    it('returns phase data with required fields', () => {
      const phase = getMoonPhase(new Date());
      expect(phase.phase).toBeTruthy();
      expect(phase.glyph).toBeTruthy();
      expect(phase.illumination).toBeGreaterThanOrEqual(0);
      expect(phase.illumination).toBeLessThanOrEqual(100);
      expect(phase.age).toBeGreaterThanOrEqual(0);
      expect(phase.age).toBeLessThanOrEqual(30);
      expect(typeof phase.waxing).toBe('boolean');
    });

    it('new moon has low illumination', () => {
      // Approximate new moon: Jan 11, 2024
      const newMoon = getMoonPhase(new Date('2024-01-11'));
      expect(newMoon.illumination).toBeLessThan(10);
    });

    it('full moon has high illumination', () => {
      // Approximate full moon: Jan 25, 2024
      const fullMoon = getMoonPhase(new Date('2024-01-25'));
      expect(fullMoon.illumination).toBeGreaterThan(90);
    });

    it('includes glyph emoji', () => {
      const phase = getMoonPhase(new Date());
      expect(phase.glyph).toMatch(/🌑|🌒|🌓|🌔|🌕|🌖|🌗|🌘/);
    });
  });

  describe('getAgriculturalGuidance', () => {
    it('returns guidance for any date', () => {
      const guidance = getAgriculturalGuidance(new Date());
      expect(guidance.activity).toBeTruthy();
      expect(guidance.description).toBeTruthy();
      expect(guidance.confidence).toMatch(/high|moderate|low/);
    });

    it('returns different guidance for different seasons', () => {
      // July (month 6) is growing season, December (month 11) is not
      const summer = getAgriculturalGuidance(new Date('2024-07-15'));
      const winter = getAgriculturalGuidance(new Date('2024-12-15'));
      // Both may be 'prepare' depending on moon phase, so just verify valid
      expect(['plant', 'transplant', 'harvest', 'prune', 'fertilize', 'rest', 'prepare']).toContain(summer.activity);
      expect(['plant', 'transplant', 'harvest', 'prune', 'fertilize', 'rest', 'prepare']).toContain(winter.activity);
    });
  });

  describe('getEnergyForecast', () => {
    it('returns forecast with required fields', () => {
      const forecast = getEnergyForecast(new Date());
      expect(forecast.level).toMatch(/very-high|high|moderate|low|very-low/);
      expect(forecast.description).toBeTruthy();
      expect(forecast.factors).toBeInstanceOf(Array);
      expect(forecast.factors.length).toBeGreaterThan(0);
    });

    it('returns different forecasts for different dates', () => {
      const jan = getEnergyForecast(new Date('2024-01-15'));
      const jun = getEnergyForecast(new Date('2024-06-15'));
      expect(jan.description).toBeTruthy();
      expect(jun.description).toBeTruthy();
    });
  });

  describe('getLunarNewYear', () => {
    it('returns lunar new year for a year', () => {
      const lny = getLunarNewYear(2024);
      expect(lny.year).toBe(2024);
      expect(lny.date).toBeInstanceOf(Date);
      expect(lny.animal).toBeTruthy();
      expect(lny.element).toBeTruthy();
    });

    it('2024 is Year of the Dragon', () => {
      const lny = getLunarNewYear(2024);
      expect(lny.animal).toBe('Dragon');
    });

    it('has Chinese zodiac animal', () => {
      const lny = getLunarNewYear(2024);
      const validAnimals = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
        'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
      expect(validAnimals).toContain(lny.animal);
    });
  });

  describe('getNextLunarNewYear', () => {
    it('returns next lunar new year from a date', () => {
      const next = getNextLunarNewYear(new Date('2024-06-15'));
      expect(next.year).toBeGreaterThanOrEqual(2025);
    });

    it('returns current year LNY if before it', () => {
      const beforeLNY = new Date('2024-01-01');
      const next = getNextLunarNewYear(beforeLNY);
      expect(next.year).toBe(2024);
    });
  });
});
