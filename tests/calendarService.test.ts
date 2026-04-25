import { describe, it, expect, beforeEach } from 'vitest';
import {
  setTimeMode,

  isGregorianLeapYear,
  isHekaLeapMarch,
  getMarchLength,
  getDaysInMonth,
  getHekaYearStart,
  getCivilStartOfHekaMonth,
  hekaToCivil,
  civilToHeka,
  getArcType,
  getNoteKey,
} from '../src/services/calendarService';
import type { HekaMonthIndex } from '../src/types';
import { differenceInCalendarDays } from 'date-fns';

describe('calendarService', () => {
  beforeEach(() => {
    setTimeMode('SYNC');
  });

  describe('Gregorian leap years', () => {
    it('identifies standard leap years', () => {
      expect(isGregorianLeapYear(2024)).toBe(true);
      expect(isGregorianLeapYear(2020)).toBe(true);
    });

    it('identifies non-leap years', () => {
      expect(isGregorianLeapYear(2023)).toBe(false);
      expect(isGregorianLeapYear(2025)).toBe(false);
    });

    it('handles century rules', () => {
      expect(isGregorianLeapYear(1900)).toBe(false);
      expect(isGregorianLeapYear(2000)).toBe(true);
      expect(isGregorianLeapYear(2100)).toBe(false);
    });
  });

  describe('SYNC mode march length', () => {
    it('has 30-day march when Gregorian next year is leap', () => {
      // 2024 is a leap year, so HEKA year 2023 has leap march
      expect(getMarchLength(2023)).toBe(30);
      expect(isHekaLeapMarch(2023)).toBe(true);
    });

    it('has 29-day march when Gregorian next year is not leap', () => {
      expect(getMarchLength(2025)).toBe(29);
      expect(isHekaLeapMarch(2025)).toBe(false);
    });
  });

  describe('TRUE mode march length', () => {
    beforeEach(() => {
      setTimeMode('TRUE');
    });

    it('follows 4-year cycle with 29-day marches on non-correction years', () => {
      // Base year 2026 is yearIndex 0 (not a correction year)
      expect(getMarchLength(2026)).toBe(29);
    });

    it('adds 30 days every 4th year', () => {
      // 2029: yearIndex = 3 (correction year)
      expect(getMarchLength(2029)).toBe(30);
    });

    it('skips correction on 128th year', () => {
      // year 2153: yearIndex = 127 (128th year, should be skipped)
      expect(getMarchLength(2153)).toBe(29);
    });
  });

  describe('month lengths', () => {
    it('all non-March months have 28 days', () => {
      for (let m = 0; m < 12; m++) {
        expect(getDaysInMonth(2025, m as HekaMonthIndex)).toBe(28);
      }
    });
  });

  describe('HEKA year start (SYNC)', () => {
    it('starts on April 1 of the HEKA year', () => {
      const start = getHekaYearStart(2025);
      expect(start.getFullYear()).toBe(2025);
      expect(start.getMonth()).toBe(3); // April
      expect(start.getDate()).toBe(1);
    });
  });

  describe('civil start of month', () => {
    it('April starts on year start', () => {
      const yearStart = getHekaYearStart(2025);
      expect(getCivilStartOfHekaMonth(2025, 0).getTime()).toBe(yearStart.getTime());
    });

    it('May starts 28 days after April', () => {
      const mayStart = getCivilStartOfHekaMonth(2025, 1);
      const aprStart = getCivilStartOfHekaMonth(2025, 0);
      const diffDays = differenceInCalendarDays(mayStart, aprStart);
      expect(diffDays).toBe(28);
    });
  });

  describe('hekaToCivil and civilToHeka roundtrip', () => {
    it('roundtrips every day of a non-leap year', () => {
      for (let month = 0; month < 13; month++) {
        const days = getDaysInMonth(2025, month as HekaMonthIndex);
        for (let day = 1; day <= days; day++) {
          const hekaDate = { year: 2025, month: month as HekaMonthIndex, day };
          const civil = hekaToCivil(hekaDate);
          const back = civilToHeka(civil);
          expect(back).not.toBeNull();
          expect(back!.year).toBe(hekaDate.year);
          expect(back!.month).toBe(hekaDate.month);
          expect(back!.day).toBe(hekaDate.day);
        }
      }
    });

    it('roundtrips every day of a leap year', () => {
      for (let month = 0; month < 13; month++) {
        const days = getDaysInMonth(2024, month as HekaMonthIndex);
        for (let day = 1; day <= days; day++) {
          const hekaDate = { year: 2024, month: month as HekaMonthIndex, day };
          const civil = hekaToCivil(hekaDate);
          const back = civilToHeka(civil);
          expect(back).not.toBeNull();
          expect(back!.year).toBe(hekaDate.year);
          expect(back!.month).toBe(hekaDate.month);
          expect(back!.day).toBe(hekaDate.day);
        }
      }
    });
  });

  describe('arc types', () => {
    it('April is OPENING', () => {
      expect(getArcType(0)).toBe('OPENING');
    });

    it('May-December are CORE', () => {
      for (let m = 1; m <= 9; m++) {
        expect(getArcType(m as HekaMonthIndex)).toBe('CORE');
      }
    });

    it('January-March are CLOSING', () => {
      for (let m = 10; m <= 12; m++) {
        expect(getArcType(m as HekaMonthIndex)).toBe('CLOSING');
      }
    });
  });

  describe('note keys', () => {
    it('formats day keys correctly', () => {
      expect(getNoteKey(2025, 3, 14)).toBe('heka:2025:3:14');
    });

    it('formats month keys correctly', () => {
      expect(getNoteKey(2025, 3)).toBe('heka:2025:3');
    });
  });
});
