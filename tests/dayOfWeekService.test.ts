import { describe, it, expect } from 'vitest';
import { getDayOfWeekData, getAllDaysData, DayOfWeekService } from '../src/services/dayOfWeekService';

describe('dayOfWeekService', () => {
  describe('getDayOfWeekData', () => {
    it('returns Sunday data for day 0', () => {
      const data = getDayOfWeekData(new Date('2024-01-07')); // Sunday
      expect(data.day).toBe('Sunday');
      expect(data.planet).toBe('Sun');
      expect(data.planetSymbol).toBe('☉');
      expect(data.numerology).toBe(1);
    });

    it('returns Monday data for day 1', () => {
      const data = getDayOfWeekData(new Date('2024-01-08')); // Monday
      expect(data.day).toBe('Monday');
      expect(data.planet).toBe('Moon');
      expect(data.numerology).toBe(2);
    });

    it('returns Tuesday data for day 2', () => {
      const data = getDayOfWeekData(new Date('2024-01-09'));
      expect(data.day).toBe('Tuesday');
      expect(data.planet).toBe('Mars');
    });

    it('returns Wednesday data for day 3', () => {
      const data = getDayOfWeekData(new Date('2024-01-10'));
      expect(data.day).toBe('Wednesday');
      expect(data.planet).toBe('Mercury');
    });

    it('returns Thursday data for day 4', () => {
      const data = getDayOfWeekData(new Date('2024-01-11'));
      expect(data.day).toBe('Thursday');
      expect(data.planet).toBe('Jupiter');
    });

    it('returns Friday data for day 5', () => {
      const data = getDayOfWeekData(new Date('2024-01-12'));
      expect(data.day).toBe('Friday');
      expect(data.planet).toBe('Venus');
    });

    it('returns Saturday data for day 6', () => {
      const data = getDayOfWeekData(new Date('2024-01-13'));
      expect(data.day).toBe('Saturday');
      expect(data.planet).toBe('Saturn');
    });

    it('returns complete data structure', () => {
      const data = getDayOfWeekData(new Date('2024-01-10'));
      expect(data.icon).toBeTruthy();
      expect(data.color).toMatch(/^#/);
      expect(data.gradient).toContain('gradient');
      expect(data.ancientNames).toBeInstanceOf(Object);
      expect(data.etymology).toBeInstanceOf(Object);
      expect(data.etymology.english).toBeTruthy();
      expect(data.etymology.meaning).toBeTruthy();
      expect(data.mythology).toBeTruthy();
      expect(data.qualities).toBeInstanceOf(Array);
      expect(data.qualities.length).toBeGreaterThan(0);
      expect(data.favorableActivities).toBeInstanceOf(Array);
      expect(data.favorableActivities.length).toBeGreaterThan(0);
      expect(data.psychology).toBeInstanceOf(Object);
      expect(data.psychology.mood).toBeTruthy();
      expect(data.psychology.energy).toBeTruthy();
      expect(data.psychology.productivity).toBeTruthy();
      expect(data.psychology.social).toBeTruthy();
      expect(data.modernStats).toBeInstanceOf(Array);
      expect(data.modernStats.length).toBeGreaterThan(0);
      expect(data.modernStats[0].title).toBeTruthy();
      expect(data.modernStats[0].stat).toBeTruthy();
      expect(data.modernStats[0].context).toBeTruthy();
      expect(data.bodySystems).toBeTruthy();
      expect(data.colors).toBeInstanceOf(Array);
      expect(data.gemstones).toBeInstanceOf(Array);
      expect(typeof data.numerology).toBe('number');
    });

    it('defaults to current date when no argument', () => {
      const data = getDayOfWeekData();
      expect(data.day).toBeTruthy();
      expect(data.planet).toBeTruthy();
    });
  });

  describe('getAllDaysData', () => {
    it('returns 7 days', () => {
      const all = getAllDaysData();
      expect(all).toHaveLength(7);
    });

    it('includes all day names', () => {
      const names = getAllDaysData().map(d => d.day);
      expect(names).toContain('Sunday');
      expect(names).toContain('Monday');
      expect(names).toContain('Tuesday');
      expect(names).toContain('Wednesday');
      expect(names).toContain('Thursday');
      expect(names).toContain('Friday');
      expect(names).toContain('Saturday');
    });

    it('each day has a unique planet', () => {
      const planets = getAllDaysData().map(d => d.planet);
      expect(new Set(planets).size).toBe(7);
    });
  });

  describe('DayOfWeekService', () => {
    it('exports getDayOfWeekData', () => {
      expect(DayOfWeekService.getDayOfWeekData).toBe(getDayOfWeekData);
    });

    it('exports getAllDaysData', () => {
      expect(DayOfWeekService.getAllDaysData).toBe(getAllDaysData);
    });
  });
});
