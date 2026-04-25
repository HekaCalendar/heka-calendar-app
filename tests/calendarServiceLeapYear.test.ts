import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isGregorianLeapYear,
  isHekaLeapMarch,
  getMarchLength,

  setTimeMode,
  hekaToCivil,
  civilToHeka,
  HEKA_MONTHS,
} from '../src/services/calendarService';

describe('calendarService - Leap Year & Time Modes', () => {
  afterEach(() => {
    setTimeMode('SYNC');
  });

  describe('isGregorianLeapYear', () => {
    it('should identify standard leap years', () => {
      expect(isGregorianLeapYear(2024)).toBe(true);
      expect(isGregorianLeapYear(2028)).toBe(true);
      expect(isGregorianLeapYear(2000)).toBe(true);
    });

    it('should identify non-leap years', () => {
      expect(isGregorianLeapYear(2025)).toBe(false);
      expect(isGregorianLeapYear(2026)).toBe(false);
      expect(isGregorianLeapYear(2023)).toBe(false);
    });

    it('should handle century years correctly', () => {
      expect(isGregorianLeapYear(1900)).toBe(false); // divisible by 100, not 400
      expect(isGregorianLeapYear(2000)).toBe(true);  // divisible by 400
      expect(isGregorianLeapYear(2100)).toBe(false); // divisible by 100, not 400
    });
  });

  describe('SYNC mode leap March', () => {
    beforeEach(() => {
      setTimeMode('SYNC');
    });

    it('should have leap March when Gregorian year+1 is leap', () => {
      // HEKA year 2023 runs Apr 2023 -> Apr 2024
      // Gregorian 2024 is a leap year → HEKA 2023 has leap March
      expect(isHekaLeapMarch(2023)).toBe(true);
      expect(getMarchLength(2023)).toBe(30);
    });

    it('should NOT have leap March when Gregorian year+1 is not leap', () => {
      // HEKA year 2025 runs Apr 2025 -> Apr 2026
      // Gregorian 2026 is not a leap year → HEKA 2025 has normal March
      expect(isHekaLeapMarch(2025)).toBe(false);
      expect(getMarchLength(2025)).toBe(29);
    });

    it('should handle the 2024 case (known leap year)', () => {
      // HEKA year 2024 → Gregorian 2025 is not leap
      expect(isHekaLeapMarch(2024)).toBe(false);
      expect(getMarchLength(2024)).toBe(29);
    });
  });

  describe('TRUE mode leap March', () => {
    beforeEach(() => {
      setTimeMode('TRUE');
    });

    it('should use 4-year-except-128th rule', () => {
      // Base year 2026 = index 0
      // Correction years: 2029 (index 3), 2033 (index 7), etc.
      expect(isHekaLeapMarch(2026)).toBe(false); // index 0
      expect(isHekaLeapMarch(2027)).toBe(false); // index 1
      expect(isHekaLeapMarch(2028)).toBe(false); // index 2
      expect(isHekaLeapMarch(2029)).toBe(true);  // index 3 (first correction)
      expect(isHekaLeapMarch(2030)).toBe(false); // index 4
      expect(isHekaLeapMarch(2033)).toBe(true);  // index 7
    });

    it('should skip the 128th year correction', () => {
      // Year index 127 = year 2026 + 127 = 2153
      // This should NOT be a leap year despite being a 4th year
      expect(isHekaLeapMarch(2153)).toBe(false);
      // But 2154 (index 128) should not be leap anyway (not a 4th year)
      // And 2157 (index 131) should be leap
      expect(isHekaLeapMarch(2157)).toBe(true);
    });

    it('should default to 29 days for non-correction years', () => {
      expect(getMarchLength(2026)).toBe(29);
    });

    it('should have 30 days for correction years', () => {
      expect(getMarchLength(2029)).toBe(30);
    });
  });

  describe('hekaToCivil / civilToHeka roundtrip', () => {
    beforeEach(() => {
      setTimeMode('SYNC');
    });

    it('should roundtrip for all 13 months in a non-leap year', () => {
      const year = 2025;
      for (let month = 0; month < 13; month++) {
        for (let day = 1; day <= 28; day++) {
          const hekaDate: import('../src/types').HekaDate = { year, month: month as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12, day };
          const civil = hekaToCivil(hekaDate);
          const back = civilToHeka(civil);
          expect(back).not.toBeNull();
          expect(back!.year).toBe(year);
          expect(back!.month).toBe(month);
          expect(back!.day).toBe(day);
        }
      }
    });

    it('should roundtrip for March in a leap year (30 days)', () => {
      setTimeMode('SYNC');
      const year = 2023; // Has leap March (30 days)
      const month = 12; // March
      expect(getMarchLength(year)).toBe(30);

      for (let day = 1; day <= 30; day++) {
        const hekaDate: import('../src/types').HekaDate = { year, month: month as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12, day };
        const civil = hekaToCivil(hekaDate);
        const back = civilToHeka(civil);
        expect(back).not.toBeNull();
        expect(back!.year).toBe(year);
        expect(back!.month).toBe(month);
        expect(back!.day).toBe(day);
      }
    });

    it('should roundtrip for March in a non-leap year (29 days)', () => {
      setTimeMode('SYNC');
      const year = 2025; // No leap March
      const month = 12; // March
      expect(getMarchLength(year)).toBe(29);

      for (let day = 1; day <= 29; day++) {
        const hekaDate: import('../src/types').HekaDate = { year, month: month as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12, day };
        const civil = hekaToCivil(hekaDate);
        const back = civilToHeka(civil);
        expect(back).not.toBeNull();
        expect(back!.year).toBe(year);
        expect(back!.month).toBe(month);
        expect(back!.day).toBe(day);
      }
    });
  });

  describe('HEKA_MONTHS constants', () => {
    it('should have exactly 13 months', () => {
      expect(HEKA_MONTHS.length).toBe(13);
    });

    it('should have correct month indices', () => {
      HEKA_MONTHS.forEach((m, i) => {
        expect(m.index).toBe(i);
      });
    });

    it('should have Hexa as the 6th month (index 5)', () => {
      expect(HEKA_MONTHS[5].name).toBe('Hexa');
    });

    it('should have correct arc assignments', () => {
      expect(HEKA_MONTHS[0].arc).toBe('OPENING'); // April
      expect(HEKA_MONTHS[1].arc).toBe('CORE');    // May
      expect(HEKA_MONTHS[11].arc).toBe('CLOSING'); // February
      expect(HEKA_MONTHS[12].arc).toBe('CLOSING'); // March
    });
  });
});
