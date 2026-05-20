import { describe, it, expect } from 'vitest';
import {
  calculateStreak,
  ZODIAC_ORDER_12,
  ZODIAC_ORDER_13,
  ZODIAC_ORDER,
  getZodiacSymbol,
  getSignElementColor,
  getMoonPhaseName,
  generateCosmicPrompt,
  getMoonEmoji,
  getPlanetSymbol,
  getAspectSymbol,
} from '../src/components/oracle/utils';

describe('oracleUtils', () => {
  describe('calculateStreak', () => {
    it('returns 0 for empty entries', () => {
      expect(calculateStreak([])).toBe(0);
    });

    it('returns 1 for single entry today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(calculateStreak([{ date: today }])).toBe(1);
    });

    it('returns 0 for stale entries', () => {
      const oldDate = '2020-01-01';
      expect(calculateStreak([{ date: oldDate }])).toBe(0);
    });

    it('counts consecutive days', () => {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      expect(calculateStreak([{ date: yStr }, { date: today }])).toBe(2);
    });

    it('stops at gap in entries', () => {
      const today = new Date().toISOString().split('T')[0];
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const tdaStr = twoDaysAgo.toISOString().split('T')[0];
      expect(calculateStreak([{ date: tdaStr }, { date: today }])).toBe(1);
    });

    it('deduplicates same-day entries', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(calculateStreak([{ date: today }, { date: today }, { date: today }])).toBe(1);
    });

    it('includes yesterday grace period', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split('T')[0];
      expect(calculateStreak([{ date: yStr }])).toBe(1);
    });
  });

  describe('ZODIAC_ORDER', () => {
    it('ZODIAC_ORDER_12 has 12 signs', () => {
      expect(ZODIAC_ORDER_12).toHaveLength(12);
    });

    it('ZODIAC_ORDER_13 has 13 signs', () => {
      expect(ZODIAC_ORDER_13).toHaveLength(13);
    });

    it('ZODIAC_ORDER defaults to 12', () => {
      expect(ZODIAC_ORDER).toBe(ZODIAC_ORDER_12);
    });

    it('ZODIAC_ORDER_13 includes ophiuchus', () => {
      expect(ZODIAC_ORDER_13).toContain('ophiuchus');
    });
  });

  describe('getZodiacSymbol', () => {
    it('returns symbol for each 12-sign zodiac', () => {
      for (const sign of ZODIAC_ORDER_12) {
        expect(getZodiacSymbol(sign)).not.toBe('✦');
      }
    });

    it('returns ophiuchus symbol', () => {
      expect(getZodiacSymbol('ophiuchus')).toBe('⛎');
    });

    it('returns fallback for unknown sign', () => {
      expect(getZodiacSymbol('unknown')).toBe('✦');
    });

    it('is case insensitive', () => {
      expect(getZodiacSymbol('ARIES')).toBe('♈');
      expect(getZodiacSymbol('Leo')).toBe('♌');
    });
  });

  describe('getSignElementColor', () => {
    it('returns fire color for fire signs', () => {
      expect(getSignElementColor('aries')).toBe('#ef4444');
      expect(getSignElementColor('leo')).toBe('#ef4444');
      expect(getSignElementColor('sagittarius')).toBe('#ef4444');
    });

    it('returns earth color for earth signs', () => {
      expect(getSignElementColor('taurus')).toBe('#22c55e');
      expect(getSignElementColor('virgo')).toBe('#22c55e');
      expect(getSignElementColor('capricorn')).toBe('#22c55e');
    });

    it('returns air color for air signs', () => {
      expect(getSignElementColor('gemini')).toBe('#f59e0b');
      expect(getSignElementColor('libra')).toBe('#f59e0b');
      expect(getSignElementColor('aquarius')).toBe('#f59e0b');
    });

    it('returns water color for water signs', () => {
      expect(getSignElementColor('cancer')).toBe('#3b82f6');
      expect(getSignElementColor('scorpio')).toBe('#3b82f6');
      expect(getSignElementColor('pisces')).toBe('#3b82f6');
    });

    it('returns ophiuchus color', () => {
      expect(getSignElementColor('ophiuchus')).toBe('#14b8a6');
    });

    it('returns fallback for unknown sign', () => {
      expect(getSignElementColor('unknown')).toBe('#9d4edd');
    });
  });

  describe('getMoonPhaseName', () => {
    it('returns names for known phases', () => {
      expect(getMoonPhaseName('new')).toBe('New');
      expect(getMoonPhaseName('full')).toBe('Full');
      expect(getMoonPhaseName('waxing_crescent')).toBe('Waxing Crescent');
    });

    it('returns default for unknown phase', () => {
      expect(getMoonPhaseName('unknown')).toBe('Current');
    });

    it('uses i18n when translator provided', () => {
      const t = vi.fn((key: string, opts?: any) => opts?.defaultValue || key);
      getMoonPhaseName('new', t);
      expect(t).toHaveBeenCalledWith('journal:moonPhase.new', { defaultValue: 'Current' });
    });
  });

  describe('generateCosmicPrompt', () => {
    it('returns transit-based prompt when transits exist', () => {
      const transits = [
        { transitingPlanet: 'Saturn', aspect: 'square', natalPlanet: 'Sun', strength: 80, orb: 1.5 },
        { transitingPlanet: 'Jupiter', aspect: 'trine', natalPlanet: 'Moon', strength: 60, orb: 2.0 },
      ];
      const prompt = generateCosmicPrompt(transits, { phase: 'new', illumination: 0, emoji: '🌑' });
      expect(prompt).toContain('Saturn');
      expect(prompt).toContain('square');
      expect(prompt).toContain('Sun');
    });

    it('returns moon-based prompt when no transits', () => {
      const prompt = generateCosmicPrompt([], { phase: 'new', illumination: 0, emoji: '🌑' });
      expect(prompt).toContain('seed');
    });

    it('returns full moon prompt', () => {
      const prompt = generateCosmicPrompt([], { phase: 'full', illumination: 100, emoji: '🌕' });
      expect(prompt).toContain('truth');
    });

    it('returns default prompt for unknown phase', () => {
      const prompt = generateCosmicPrompt([], { phase: 'unknown', illumination: 50, emoji: '🌙' });
      expect(prompt).toContain('cosmos');
    });
  });

  describe('getMoonEmoji', () => {
    it('returns correct emojis for phases', () => {
      expect(getMoonEmoji('new')).toBe('🌑');
      expect(getMoonEmoji('full')).toBe('🌕');
      expect(getMoonEmoji('waxing_crescent')).toBe('🌒');
      expect(getMoonEmoji('waning_gibbous')).toBe('🌖');
    });

    it('returns default emoji for unknown phase', () => {
      expect(getMoonEmoji('unknown')).toBe('🌙');
    });
  });

  describe('getPlanetSymbol', () => {
    it('returns symbols for all major planets', () => {
      expect(getPlanetSymbol('Sun')).toBe('☉');
      expect(getPlanetSymbol('Moon')).toBe('☽');
      expect(getPlanetSymbol('Mercury')).toBe('☿');
      expect(getPlanetSymbol('Venus')).toBe('♀');
      expect(getPlanetSymbol('Mars')).toBe('♂');
      expect(getPlanetSymbol('Jupiter')).toBe('♃');
      expect(getPlanetSymbol('Saturn')).toBe('♄');
    });

    it('has lowercase aliases', () => {
      expect(getPlanetSymbol('sun')).toBe('☉');
      expect(getPlanetSymbol('moon')).toBe('☽');
    });

    it('returns fallback for unknown planet', () => {
      expect(getPlanetSymbol('Eris')).toBe('●');
    });
  });

  describe('getAspectSymbol', () => {
    it('returns symbols for known aspects', () => {
      expect(getAspectSymbol('conjunction')).toBe('☌');
      expect(getAspectSymbol('sextile')).toBe('⚹');
      expect(getAspectSymbol('square')).toBe('□');
      expect(getAspectSymbol('trine')).toBe('△');
      expect(getAspectSymbol('opposition')).toBe('☍');
      expect(getAspectSymbol('quincunx')).toBe('⚻');
    });

    it('returns input for unknown aspect', () => {
      expect(getAspectSymbol('unknown')).toBe('unknown');
    });
  });
});
