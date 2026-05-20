import { describe, it, expect } from 'vitest';
import { getSunInSignInterpretation } from '../src/astrology/data/interpretations/planetInSign';
import {
  getHouseMeaning,
  getHouseJourneyTheme,
  getHouseAffirmation,
  HOUSE_MEANINGS,
} from '../src/astrology/data/houseMeanings';

describe('astrology data', () => {
  describe('getSunInSignInterpretation', () => {
    const signs = [
      'aries',
      'taurus',
      'gemini',
      'cancer',
      'leo',
      'virgo',
      'libra',
      'scorpio',
      'sagittarius',
      'capricorn',
      'aquarius',
      'pisces',
      'ophiuchus',
    ];

    it.each(signs)('returns non-null interpretation for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(result).not.toBeNull();
    });

    it.each(signs)('returns an object with title for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(result!.title).toBeTruthy();
      expect(result!.title.length).toBeGreaterThan(0);
    });

    it.each(signs)('returns an object with essence for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(result!.essence).toBeTruthy();
      expect(result!.essence.length).toBeGreaterThan(0);
    });

    it.each(signs)('returns an object with psychological for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(result!.psychological).toBeTruthy();
      expect(result!.psychological.length).toBeGreaterThan(0);
    });

    it.each(signs)('returns an object with spiritual for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(result!.spiritual).toBeTruthy();
      expect(result!.spiritual.length).toBeGreaterThan(0);
    });

    it.each(signs)('returns challenges array for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(Array.isArray(result!.challenges)).toBe(true);
      expect(result!.challenges.length).toBeGreaterThan(0);
    });

    it.each(signs)('returns gifts array for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(Array.isArray(result!.gifts)).toBe(true);
      expect(result!.gifts.length).toBeGreaterThan(0);
    });

    it.each(signs)('returns lifeThemes array for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(Array.isArray(result!.lifeThemes)).toBe(true);
      expect(result!.lifeThemes.length).toBeGreaterThan(0);
    });

    it.each(signs)('returns non-empty advice for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(result!.advice).toBeTruthy();
      expect(result!.advice.length).toBeGreaterThan(0);
    });

    it.each(signs)('returns non-empty affirmation for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(result!.affirmation).toBeTruthy();
      expect(result!.affirmation.length).toBeGreaterThan(0);
    });

    it.each(signs)('returns non-empty hekaIntegration for %s', (sign) => {
      const result = getSunInSignInterpretation(sign);
      expect(result!.hekaIntegration).toBeTruthy();
      expect(result!.hekaIntegration.length).toBeGreaterThan(0);
    });

    it('returns correct planet and sign fields', () => {
      const result = getSunInSignInterpretation('aries');
      expect(result!.planet).toBe('Sun');
      expect(result!.sign).toBe('Aries');
    });

    it('returns null for invalid sign', () => {
      const result = getSunInSignInterpretation('not-a-sign');
      expect(result).toBeNull();
    });

    it('returns null for empty string', () => {
      const result = getSunInSignInterpretation('');
      expect(result).toBeNull();
    });

    it('is case-insensitive', () => {
      const lower = getSunInSignInterpretation('aries');
      const upper = getSunInSignInterpretation('ARIES');
      const mixed = getSunInSignInterpretation('Aries');
      expect(lower).toEqual(upper);
      expect(lower).toEqual(mixed);
    });
  });

  describe('getHouseMeaning', () => {
    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('returns valid data for house %i', (house) => {
      const result = getHouseMeaning(house);
      expect(result).toBeDefined();
      expect(result.number).toBe(house);
    });

    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('house %i has a name', (house) => {
      const result = getHouseMeaning(house);
      expect(result.name).toBeTruthy();
      expect(result.name.length).toBeGreaterThan(0);
    });

    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('house %i has a latinName', (house) => {
      const result = getHouseMeaning(house);
      expect(result.latinName).toBeDefined();
    });

    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('house %i has keywords array', (house) => {
      const result = getHouseMeaning(house);
      expect(Array.isArray(result.keywords)).toBe(true);
      expect(result.keywords.length).toBeGreaterThan(0);
    });

    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('house %i has significations object', (house) => {
      const result = getHouseMeaning(house);
      expect(result.significations).toBeDefined();
      expect(Array.isArray(result.significations.primary)).toBe(true);
      expect(Array.isArray(result.significations.derived)).toBe(true);
      expect(Array.isArray(result.significations.modern)).toBe(true);
      expect(Array.isArray(result.significations.traditional)).toBe(true);
    });

    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('house %i has a rulingPlanet', (house) => {
      const result = getHouseMeaning(house);
      expect(result.rulingPlanet).toBeTruthy();
      expect(result.rulingPlanet.length).toBeGreaterThan(0);
    });

    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('house %i has an element', (house) => {
      const result = getHouseMeaning(house);
      expect(result.element).toBeTruthy();
    });

    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('house %i has a modality', (house) => {
      const result = getHouseMeaning(house);
      expect(result.modality).toBeTruthy();
    });

    it('returns fallback for invalid house number', () => {
      const result = getHouseMeaning(99);
      expect(result.number).toBe(99);
      expect(result.name).toBe('House 99');
      expect(result.latinName).toBe('');
      expect(Array.isArray(result.keywords)).toBe(true);
    });

    it('returns fallback for house 0', () => {
      const result = getHouseMeaning(0);
      expect(result.number).toBe(0);
      expect(result.name).toBe('House 0');
    });

    it('returns fallback for negative house', () => {
      const result = getHouseMeaning(-1);
      expect(result.number).toBe(-1);
      expect(result.name).toBe('House -1');
    });
  });

  describe('getHouseJourneyTheme', () => {
    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('returns a theme for house %i', (house) => {
      const theme = getHouseJourneyTheme(house);
      expect(theme).toBeTruthy();
      expect(theme.length).toBeGreaterThan(0);
      expect(theme).not.toBe('Unknown');
    });

    it('returns Unknown for invalid house', () => {
      expect(getHouseJourneyTheme(99)).toBe('Unknown');
      expect(getHouseJourneyTheme(0)).toBe('Unknown');
      expect(getHouseJourneyTheme(-1)).toBe('Unknown');
    });
  });

  describe('getHouseAffirmation', () => {
    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])('returns an affirmation for house %i', (house) => {
      const affirmation = getHouseAffirmation(house);
      expect(affirmation).toBeTruthy();
      expect(affirmation.length).toBeGreaterThan(0);
    });

    it('returns fallback affirmation for invalid house', () => {
      expect(getHouseAffirmation(99)).toBe('I am whole and complete.');
      expect(getHouseAffirmation(0)).toBe('I am whole and complete.');
    });

    it('each affirmation starts with "I"', () => {
      for (let house = 1; house <= 12; house++) {
        const affirmation = getHouseAffirmation(house);
        expect(affirmation.startsWith('I')).toBe(true);
      }
    });
  });

  describe('HOUSE_MEANINGS export', () => {
    it('contains all 12 houses', () => {
      for (let house = 1; house <= 12; house++) {
        expect(HOUSE_MEANINGS[house]).toBeDefined();
      }
    });

    it('house 1 is named First House', () => {
      expect(HOUSE_MEANINGS[1].name).toBe('First House');
    });

    it('house 7 is named Seventh House', () => {
      expect(HOUSE_MEANINGS[7].name).toBe('Seventh House');
    });

    it('house 10 is named Tenth House', () => {
      expect(HOUSE_MEANINGS[10].name).toBe('Tenth House');
    });
  });
});
