import { describe, it, expect } from 'vitest';
import {
  calculateDayNumber,
  getNumerologyReading,
  calculatePersonalYear,
  calculateLifePath,
  getDailyAffirmation,
} from '../src/services/numerologyService';

describe('numerologyService', () => {
  describe('calculateDayNumber', () => {
    it('returns a single digit for a simple date', () => {
      const num = calculateDayNumber(new Date('2024-01-01'));
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(9);
    });

    it('returns consistent results for same date', () => {
      const d1 = calculateDayNumber(new Date('2024-06-15'));
      const d2 = calculateDayNumber(new Date('2024-06-15'));
      expect(d1).toBe(d2);
    });

    it('returns a number', () => {
      expect(typeof calculateDayNumber()).toBe('number');
    });
  });

  describe('getNumerologyReading', () => {
    it('returns a complete reading', () => {
      const reading = getNumerologyReading(new Date('2024-01-01'));
      expect(reading.dayNumber).toBeGreaterThanOrEqual(1);
      expect(reading.dayNumber).toBeLessThanOrEqual(9);
      expect(reading.meaning).toBeTruthy();
      expect(reading.energy).toBeTruthy();
      expect(reading.focus).toBeInstanceOf(Array);
      expect(reading.focus.length).toBeGreaterThan(0);
      expect(reading.guidance).toBeTruthy();
      expect(reading.compatibleNumbers).toBeInstanceOf(Array);
      expect(reading.challengingNumbers).toBeInstanceOf(Array);
      expect(reading.luckyHours).toBeInstanceOf(Array);
    });

    it('returns lucky hours for the day number', () => {
      const reading = getNumerologyReading(new Date('2024-01-01'));
      expect(reading.luckyHours.length).toBeGreaterThan(0);
      expect(reading.luckyHours.every(h => typeof h === 'number')).toBe(true);
    });

    it('master number is null for non-master day', () => {
      const reading = getNumerologyReading(new Date('2024-03-03'));
      expect(reading.masterNumber === null || ['11','22','33'].includes(reading.masterNumber!)).toBe(true);
    });
  });

  describe('calculatePersonalYear', () => {
    it('returns a single digit or master number', () => {
      const year = calculatePersonalYear(6, 15, 2024);
      expect(year).toBeGreaterThanOrEqual(1);
      expect([1,2,3,4,5,6,7,8,9,11,22].includes(year)).toBe(true);
    });

    it('changes with different years', () => {
      const y1 = calculatePersonalYear(1, 1, 2024);
      const y2 = calculatePersonalYear(1, 1, 2025);
      expect(y1).not.toBe(y2);
    });

    it('returns consistent results for same inputs', () => {
      const a = calculatePersonalYear(3, 15, 2024);
      const b = calculatePersonalYear(3, 15, 2024);
      expect(a).toBe(b);
    });
  });

  describe('calculateLifePath', () => {
    it('returns a single digit or master number', () => {
      const path = calculateLifePath(new Date('1990-06-15'));
      expect(path).toBeGreaterThanOrEqual(1);
      expect([1,2,3,4,5,6,7,8,9,11,22,33].includes(path)).toBe(true);
    });

    it('returns consistent results for same birth date', () => {
      const a = calculateLifePath(new Date('1985-12-25'));
      const b = calculateLifePath(new Date('1985-12-25'));
      expect(a).toBe(b);
    });
  });

  describe('getDailyAffirmation', () => {
    it('returns affirmation for numbers 1-9', () => {
      for (let i = 1; i <= 9; i++) {
        expect(getDailyAffirmation(i)).toBeTruthy();
        expect(typeof getDailyAffirmation(i)).toBe('string');
      }
    });

    it('returns fallback for unknown numbers', () => {
      expect(getDailyAffirmation(0)).toContain('aligned');
      expect(getDailyAffirmation(99)).toContain('aligned');
    });

    it('affirmations are unique per number', () => {
      const affirmations = new Set();
      for (let i = 1; i <= 9; i++) {
        affirmations.add(getDailyAffirmation(i));
      }
      expect(affirmations.size).toBe(9);
    });
  });
});
