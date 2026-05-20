import { describe, it, expect } from 'vitest';
import {
  getCurrentSunSign,
  getChineseZodiac,
  getChineseZodiacElement,
  getSeasonalEventInfo,
  ZODIAC_INFO,
  CHINESE_ZODIAC_INFO,
  SEASONAL_EVENT_INFO,
} from '../src/services/celestialInfoService';

describe('celestialInfoService', () => {
  describe('getCurrentSunSign', () => {
    it('returns Aries in late March', () => {
      expect(getCurrentSunSign(new Date('2024-03-25')).sign).toBe('Aries');
    });

    it('returns Taurus in late April', () => {
      expect(getCurrentSunSign(new Date('2024-04-25')).sign).toBe('Taurus');
    });

    it('returns Gemini in late May', () => {
      expect(getCurrentSunSign(new Date('2024-05-25')).sign).toBe('Gemini');
    });

    it('returns Cancer in late June', () => {
      expect(getCurrentSunSign(new Date('2024-06-25')).sign).toBe('Cancer');
    });

    it('returns Leo in late July', () => {
      expect(getCurrentSunSign(new Date('2024-07-25')).sign).toBe('Leo');
    });

    it('returns Virgo in late August', () => {
      expect(getCurrentSunSign(new Date('2024-08-25')).sign).toBe('Virgo');
    });

    it('returns Libra in late September', () => {
      expect(getCurrentSunSign(new Date('2024-09-25')).sign).toBe('Libra');
    });

    it('returns Scorpio in late October', () => {
      expect(getCurrentSunSign(new Date('2024-10-25')).sign).toBe('Scorpio');
    });

    it('returns Sagittarius in late November', () => {
      expect(getCurrentSunSign(new Date('2024-11-25')).sign).toBe('Sagittarius');
    });

    it('returns Capricorn in late December', () => {
      expect(getCurrentSunSign(new Date('2024-12-25')).sign).toBe('Capricorn');
    });

    it('returns Aquarius in late January', () => {
      expect(getCurrentSunSign(new Date('2024-01-25')).sign).toBe('Aquarius');
    });

    it('returns Pisces in late February', () => {
      expect(getCurrentSunSign(new Date('2024-02-25')).sign).toBe('Pisces');
    });

    it('returns Aries on exact cusp date', () => {
      expect(getCurrentSunSign(new Date('2024-03-21')).sign).toBe('Aries');
    });

    it('returns Capricorn on Dec 22 cusp', () => {
      expect(getCurrentSunSign(new Date('2024-12-22')).sign).toBe('Capricorn');
    });

    it('returns zodiac info with all fields', () => {
      const info = getCurrentSunSign(new Date('2024-06-15'));
      expect(info.symbol).toBeTruthy();
      expect(info.element).toBeTruthy();
      expect(info.modality).toBeTruthy();
      expect(info.rulingPlanet).toBeTruthy();
      expect(info.traits).toBeInstanceOf(Array);
      expect(info.dates).toBeTruthy();
      expect(info.description).toBeTruthy();
    });
  });

  describe('getChineseZodiac', () => {
    it('returns Dragon for 2024', () => {
      expect(getChineseZodiac(2024).animal).toBe('Dragon');
    });

    it('returns Rabbit for 2023', () => {
      expect(getChineseZodiac(2023).animal).toBe('Rabbit');
    });

    it('returns Tiger for 2022', () => {
      expect(getChineseZodiac(2022).animal).toBe('Tiger');
    });

    it('returns Rat for 2020', () => {
      expect(getChineseZodiac(2020).animal).toBe('Rat');
    });

    it('returns Monkey for 2016', () => {
      expect(getChineseZodiac(2016).animal).toBe('Monkey');
    });

    it('returns info with all fields', () => {
      const info = getChineseZodiac(2024);
      expect(info.animal).toBeTruthy();
      expect(info.element).toBeTruthy();
      expect(info.yinYang).toBeTruthy();
      expect(info.characteristics).toBeInstanceOf(Array);
      expect(info.description).toBeTruthy();
      expect(info.luckyNumbers).toBeInstanceOf(Array);
      expect(info.luckyColors).toBeInstanceOf(Array);
    });
  });

  describe('getChineseZodiacElement', () => {
    it('returns correct elements', () => {
      expect(getChineseZodiacElement(2020)).toBe('Metal');
      expect(getChineseZodiacElement(2021)).toBe('Metal');
      expect(getChineseZodiacElement(2022)).toBe('Water');
      expect(getChineseZodiacElement(2023)).toBe('Water');
      expect(getChineseZodiacElement(2024)).toBe('Wood');
    });
  });

  describe('getSeasonalEventInfo', () => {
    it('returns info for exact match', () => {
      const info = getSeasonalEventInfo('Vernal Equinox');
      expect(info).toBeDefined();
      expect(info!.name).toBeTruthy();
    });

    it('returns info for partial match', () => {
      const info = getSeasonalEventInfo('equinox');
      expect(info).toBeDefined();
    });

    it('returns undefined for unknown event', () => {
      expect(getSeasonalEventInfo('unknown-event')).toBeUndefined();
    });

    it('returns info with description and symbol', () => {
      const info = getSeasonalEventInfo('Summer Solstice');
      expect(info!.description).toBeTruthy();
      expect(info!.symbol).toBeTruthy();
    });

    it('matches via partial keyword', () => {
      const info = getSeasonalEventInfo('solstice');
      expect(info).toBeDefined();
      expect(info!.name.toLowerCase()).toContain('solstice');
    });
  });

  describe('data exports', () => {
    it('ZODIAC_INFO has 12 signs', () => {
      expect(Object.keys(ZODIAC_INFO)).toHaveLength(12);
    });

    it('CHINESE_ZODIAC_INFO has 12 animals', () => {
      expect(Object.keys(CHINESE_ZODIAC_INFO)).toHaveLength(12);
    });

    it('SEASONAL_EVENT_INFO has events', () => {
      expect(Object.keys(SEASONAL_EVENT_INFO).length).toBeGreaterThan(0);
    });

    it('each zodiac has required fields', () => {
      for (const info of Object.values(ZODIAC_INFO)) {
        expect(info.sign).toBeTruthy();
        expect(info.symbol).toBeTruthy();
        expect(info.element).toBeTruthy();
        expect(info.modality).toBeTruthy();
        expect(info.rulingPlanet).toBeTruthy();
        expect(info.traits.length).toBeGreaterThan(0);
        expect(info.dates).toBeTruthy();
        expect(info.description).toBeTruthy();
      }
    });

    it('each chinese zodiac has required fields', () => {
      for (const info of Object.values(CHINESE_ZODIAC_INFO)) {
        expect(info.animal).toBeTruthy();
        expect(info.element).toBeTruthy();
        expect(info.yinYang).toBeTruthy();
        expect(info.characteristics.length).toBeGreaterThan(0);
        expect(info.description).toBeTruthy();
        expect(info.luckyNumbers.length).toBeGreaterThan(0);
        expect(info.luckyColors.length).toBeGreaterThan(0);
      }
    });
  });
});
