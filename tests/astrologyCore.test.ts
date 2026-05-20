// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  toDegree,
  normalizeDegree,
  toZodiacDegree,
  getDegreeInSign,
  getSignFromLongitude,
  migrateZodiacSystem,
  legacyZodiacSystem,
  ZODIAC_SIGNS_12,
} from '../src/astrology/types/core';

describe('astrology core types', () => {
  describe('toDegree', () => {
    it('converts a valid number to Degree', () => {
      expect(toDegree(42)).toBe(42);
      expect(toDegree(0)).toBe(0);
      expect(toDegree(359.99)).toBe(359.99);
    });

    it('throws on NaN', () => {
      expect(() => toDegree(NaN)).toThrow('Invalid degree: NaN');
    });

    it('throws on Infinity', () => {
      expect(() => toDegree(Infinity)).toThrow('Invalid degree: Infinity');
      expect(() => toDegree(-Infinity)).toThrow('Invalid degree: -Infinity');
    });
  });

  describe('normalizeDegree', () => {
    it('leaves 0-359 values unchanged', () => {
      expect(normalizeDegree(0)).toBe(0);
      expect(normalizeDegree(180)).toBe(180);
      expect(normalizeDegree(359)).toBe(359);
    });

    it('wraps values above 360', () => {
      expect(normalizeDegree(360)).toBe(0);
      expect(normalizeDegree(450)).toBe(90);
      expect(normalizeDegree(720)).toBe(0);
    });

    it('wraps negative values', () => {
      expect(normalizeDegree(-1)).toBe(359);
      expect(normalizeDegree(-90)).toBe(270);
      expect(normalizeDegree(-360)).toBe(0);
    });

    it('handles decimal values', () => {
      expect(normalizeDegree(365.5)).toBeCloseTo(5.5);
    });
  });

  describe('toZodiacDegree', () => {
    it('returns degree within sign (0-29.999)', () => {
      expect(toZodiacDegree(toDegree(0))).toBe(0);
      expect(toZodiacDegree(toDegree(15))).toBe(15);
      expect(toZodiacDegree(toDegree(29.9))).toBeCloseTo(29.9);
    });

    it('wraps at sign boundaries', () => {
      expect(toZodiacDegree(toDegree(30))).toBe(0);
      expect(toZodiacDegree(toDegree(45))).toBe(15);
      expect(toZodiacDegree(toDegree(359))).toBe(29);
    });

    it('handles negative longitudes', () => {
      expect(toZodiacDegree(toDegree(-1))).toBe(29);
      expect(toZodiacDegree(toDegree(-30))).toBe(0);
    });
  });

  describe('getSignFromLongitude (12-sign)', () => {
    it('returns correct sign for each 30-degree sector', () => {
      expect(getSignFromLongitude(toDegree(0), false)).toBe('aries');
      expect(getSignFromLongitude(toDegree(15), false)).toBe('aries');
      expect(getSignFromLongitude(toDegree(30), false)).toBe('taurus');
      expect(getSignFromLongitude(toDegree(60), false)).toBe('gemini');
      expect(getSignFromLongitude(toDegree(90), false)).toBe('cancer');
      expect(getSignFromLongitude(toDegree(120), false)).toBe('leo');
      expect(getSignFromLongitude(toDegree(150), false)).toBe('virgo');
      expect(getSignFromLongitude(toDegree(180), false)).toBe('libra');
      expect(getSignFromLongitude(toDegree(210), false)).toBe('scorpio');
      expect(getSignFromLongitude(toDegree(240), false)).toBe('sagittarius');
      expect(getSignFromLongitude(toDegree(270), false)).toBe('capricorn');
      expect(getSignFromLongitude(toDegree(300), false)).toBe('aquarius');
      expect(getSignFromLongitude(toDegree(330), false)).toBe('pisces');
    });

    it('handles boundary values', () => {
      expect(getSignFromLongitude(toDegree(359.99), false)).toBe('pisces');
    });

    it('wraps negative longitudes', () => {
      expect(getSignFromLongitude(toDegree(-30), false)).toBe('pisces');
      expect(getSignFromLongitude(toDegree(-60), false)).toBe('aquarius');
    });
  });

  describe('getSignFromLongitude (13-sign)', () => {
    it('returns ophiuchus in its IAU boundary', () => {
      expect(getSignFromLongitude(toDegree(223), true)).toBe('ophiuchus');
      expect(getSignFromLongitude(toDegree(230), true)).toBe('ophiuchus');
      expect(getSignFromLongitude(toDegree(241), true)).toBe('ophiuchus');
    });

    it('returns libra before scorpio boundary', () => {
      expect(getSignFromLongitude(toDegree(210), true)).toBe('libra');
      expect(getSignFromLongitude(toDegree(216), true)).toBe('libra');
    });

    it('returns scorpio in its narrow IAU boundary', () => {
      expect(getSignFromLongitude(toDegree(217), true)).toBe('scorpio');
      expect(getSignFromLongitude(toDegree(222), true)).toBe('scorpio');
    });

    it('returns sagittarius after ophiuchus', () => {
      expect(getSignFromLongitude(toDegree(242), true)).toBe('sagittarius');
      expect(getSignFromLongitude(toDegree(270), true)).toBe('sagittarius');
    });

    it('wraps 360 back to aries start', () => {
      expect(getSignFromLongitude(toDegree(360), true)).toBe('aries');
    });
  });

  describe('getDegreeInSign', () => {
    it('returns correct degree in 12-sign mode', () => {
      expect(getDegreeInSign(toDegree(0), false)).toBe(0);
      expect(getDegreeInSign(toDegree(15), false)).toBe(15);
      expect(getDegreeInSign(toDegree(45), false)).toBe(15);
      expect(getDegreeInSign(toDegree(359), false)).toBe(29);
    });

    it('returns correct degree in 13-sign mode (ophiuchus)', () => {
      // Ophiuchus spans 223-242, so degree 230 should be 230-223 = 7
      expect(getDegreeInSign(toDegree(223), true)).toBe(0);
      expect(getDegreeInSign(toDegree(230), true)).toBe(7);
    });

    it('handles negative longitudes', () => {
      expect(getDegreeInSign(toDegree(-1), false)).toBe(29);
    });
  });

  describe('migrateZodiacSystem', () => {
    it('maps 12-sign to tropical+12', () => {
      expect(migrateZodiacSystem('12-sign')).toEqual({ frame: 'tropical', signCount: 12 });
    });

    it('maps 13-sign to tropical+13', () => {
      expect(migrateZodiacSystem('13-sign')).toEqual({ frame: 'tropical', signCount: 13 });
    });

    it('maps sidereal to sidereal+12', () => {
      expect(migrateZodiacSystem('sidereal')).toEqual({ frame: 'sidereal', signCount: 12 });
    });
  });

  describe('legacyZodiacSystem', () => {
    it('converts tropical+12 to 12-sign', () => {
      expect(legacyZodiacSystem('tropical', 12)).toBe('12-sign');
    });

    it('converts tropical+13 to 13-sign', () => {
      expect(legacyZodiacSystem('tropical', 13)).toBe('13-sign');
    });

    it('converts sidereal+any to sidereal', () => {
      expect(legacyZodiacSystem('sidereal', 12)).toBe('sidereal');
      expect(legacyZodiacSystem('sidereal', 13)).toBe('sidereal');
    });
  });
});
