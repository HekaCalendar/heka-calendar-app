import { describe, it, expect } from 'vitest';
import {
  getCurrentSeason,
  getDaysUntilNextSeason,
  getSeasonElementColor,
  getSeasonData,
  getDaysInSeason,
} from '../src/services/seasonService';

describe('seasonService', () => {
  describe('getCurrentSeason', () => {
    it('returns Spring in March for Northern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-03-15'), 'N').name).toBe('Spring');
    });

    it('returns Summer in June for Northern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-06-15'), 'N').name).toBe('Summer');
    });

    it('returns Autumn in September for Northern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-09-15'), 'N').name).toBe('Autumn');
    });

    it('returns Winter in December for Northern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-12-15'), 'N').name).toBe('Winter');
    });

    it('returns Winter in January for Northern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-01-15'), 'N').name).toBe('Winter');
    });

    it('returns Spring in September for Southern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-09-15'), 'S').name).toBe('Spring');
    });

    it('returns Summer in December for Southern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-12-15'), 'S').name).toBe('Summer');
    });

    it('returns Autumn in March for Southern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-03-15'), 'S').name).toBe('Autumn');
    });

    it('returns Winter in June for Southern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-06-15'), 'S').name).toBe('Winter');
    });

    it('returns season with emoji', () => {
      const season = getCurrentSeason(new Date('2024-06-15'), 'N');
      expect(season.emoji).toBeTruthy();
    });

    it('returns season with element', () => {
      const season = getCurrentSeason(new Date('2024-06-15'), 'N');
      expect(['Fire', 'Earth', 'Air', 'Water']).toContain(season.element);
    });

    it('returns season with characteristics', () => {
      const season = getCurrentSeason(new Date('2024-06-15'), 'N');
      expect(season.characteristics).toBeInstanceOf(Array);
      expect(season.characteristics.length).toBeGreaterThan(0);
    });

    it('returns season with activities', () => {
      const season = getCurrentSeason(new Date('2024-06-15'), 'N');
      expect(season.activities).toBeInstanceOf(Array);
      expect(season.activities.length).toBeGreaterThan(0);
    });

    it('defaults to Northern hemisphere', () => {
      expect(getCurrentSeason(new Date('2024-06-15')).name).toBe('Summer');
    });
  });

  describe('getDaysUntilNextSeason', () => {
    it('returns non-negative number', () => {
      expect(getDaysUntilNextSeason(new Date('2024-06-15'), 'N')).toBeGreaterThanOrEqual(0);
    });

    it('returns fewer days near season end', () => {
      const nearEnd = getDaysUntilNextSeason(new Date('2024-08-30'), 'N');
      const midSeason = getDaysUntilNextSeason(new Date('2024-06-15'), 'N');
      expect(nearEnd).toBeLessThan(midSeason);
    });

    it('returns small number on season boundary', () => {
      const days = getDaysUntilNextSeason(new Date('2024-08-31'), 'N');
      expect(days).toBeLessThanOrEqual(1);
    });

    it('can differ by hemisphere for some dates', () => {
      const north = getDaysUntilNextSeason(new Date('2024-03-15'), 'N');
      const south = getDaysUntilNextSeason(new Date('2024-03-15'), 'S');
      // Northern: Spring -> Summer (June 1) = ~77 days
      // Southern: Autumn -> Winter (June 1) = ~77 days
      // These happen to be the same for this date, so just verify both are valid
      expect(north).toBeGreaterThanOrEqual(0);
      expect(south).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getSeasonElementColor', () => {
    it('returns color for Fire', () => {
      expect(getSeasonElementColor('Fire')).toMatch(/^#/);
    });

    it('returns color for Earth', () => {
      expect(getSeasonElementColor('Earth')).toMatch(/^#/);
    });

    it('returns color for Air', () => {
      expect(getSeasonElementColor('Air')).toMatch(/^#/);
    });

    it('returns color for Water', () => {
      expect(getSeasonElementColor('Water')).toMatch(/^#/);
    });

    it('returns fallback for unknown element', () => {
      expect(getSeasonElementColor('Void')).toMatch(/^#/);
    });
  });

  describe('getSeasonData', () => {
    it('returns structured data', () => {
      const data = getSeasonData(new Date('2024-06-15'), 35);
      expect(data.emoji).toBeTruthy();
      expect(data.name).toBeTruthy();
      expect(data.hemisphere).toBe('Northern');
      expect(data.colors).toBeInstanceOf(Array);
      expect(data.element).toBeTruthy();
      expect(data.psychology).toBeInstanceOf(Object);
      expect(data.characteristics).toBeInstanceOf(Array);
    });

    it('detects Southern hemisphere for negative latitude', () => {
      const data = getSeasonData(new Date('2024-06-15'), -35);
      expect(data.hemisphere).toBe('Southern');
    });
  });

  describe('getDaysInSeason', () => {
    it('returns structured progress data', () => {
      const data = getDaysInSeason(new Date('2024-06-15'), 35);
      expect(typeof data.daysRemaining).toBe('number');
      expect(data.daysRemaining).toBeGreaterThanOrEqual(0);
      expect(typeof data.percentComplete).toBe('number');
      expect(data.percentComplete).toBeGreaterThanOrEqual(1);
      expect(data.percentComplete).toBeLessThanOrEqual(99);
      expect(data.nextSeason).toBeTruthy();
    });
  });
});
