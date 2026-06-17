// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  generatePlanetInSignReading,
  generateAspectReading,
  generateTransitReading,
  generateCelestialWeatherReading,
} from '../src/oracle/celestialEducation';
import type { PersonalTransit } from '../src/oracle/birthChartIntegration';

describe('celestialEducation', () => {
  describe('generatePlanetInSignReading', () => {
    it('returns reading for Sun in Leo', () => {
      const reading = generatePlanetInSignReading('sun', 'leo');
      expect(reading.title).toContain('Sun');
      expect(reading.title).toContain('Leo');
      expect(reading.meaning.length).toBeGreaterThan(0);
      expect(reading.psychological.length).toBeGreaterThan(0);
      expect(reading.practical.length).toBeGreaterThan(0);
      expect(reading.shadow.length).toBeGreaterThan(0);
      expect(reading.advice.length).toBeGreaterThan(0);
    });

    it('returns reading for Moon in Cancer', () => {
      const reading = generatePlanetInSignReading('moon', 'cancer');
      expect(reading.title).toContain('Moon');
      expect(reading.title).toContain('Cancer');
    });

    it('returns reading for Mercury in Gemini', () => {
      const reading = generatePlanetInSignReading('mercury', 'gemini');
      expect(reading.title).toContain('Mercury');
      expect(reading.title).toContain('Gemini');
    });

    it('returns reading for Mars in Aries', () => {
      const reading = generatePlanetInSignReading('mars', 'aries');
      expect(reading.title).toContain('Mars');
      expect(reading.title).toContain('Aries');
    });

    it('returns fallback for unknown planet', () => {
      const reading = generatePlanetInSignReading('unknown', 'aries');
      expect(reading.meaning).toBe('Interpretation coming soon.');
    });

    it('returns fallback for unknown sign', () => {
      const reading = generatePlanetInSignReading('sun', 'unknown');
      expect(reading.meaning).toBe('Interpretation coming soon.');
    });

    it('handles case-insensitive input', () => {
      const reading = generatePlanetInSignReading('SUN', 'LEO');
      expect(reading.title).toContain('Sun');
      expect(reading.title).toContain('Leo');
    });
  });

  describe('generateAspectReading', () => {
    it('returns reading for Sun trine Moon', () => {
      const reading = generateAspectReading('sun', 'moon', 'trine');
      expect(reading.title).toContain('Sun');
      expect(reading.title).toContain('Moon');
      expect(reading.title).toContain('Trine');
      expect(reading.meaning.length).toBeGreaterThan(0);
      expect(reading.psychological.length).toBeGreaterThan(0);
    });

    it('returns reading for Mars square Saturn', () => {
      const reading = generateAspectReading('mars', 'saturn', 'square');
      expect(reading.title).toContain('Mars');
      expect(reading.title).toContain('Saturn');
      expect(reading.advice).toContain('tension');
    });

    it('returns reading for Venus sextile Jupiter', () => {
      const reading = generateAspectReading('venus', 'jupiter', 'sextile');
      expect(reading.title).toContain('Venus');
      expect(reading.title).toContain('Jupiter');
      expect(reading.advice).toContain('flow');
    });

    it('returns reading for Mercury conjunction Uranus', () => {
      const reading = generateAspectReading('mercury', 'uranus', 'conjunction');
      expect(reading.title).toContain('Mercury');
      expect(reading.title).toContain('Uranus');
    });

    it('returns reading for Sun opposition Pluto', () => {
      const reading = generateAspectReading('sun', 'pluto', 'opposition');
      expect(reading.title).toContain('Sun');
      expect(reading.title).toContain('Pluto');
    });

    it('returns fallback for unknown aspect', () => {
      const reading = generateAspectReading('sun', 'moon', 'unknown');
      expect(reading.meaning).toBe('Interpretation coming soon.');
    });

    it('returns fallback for unknown planets', () => {
      const reading = generateAspectReading('unknown1', 'unknown2', 'trine');
      expect(reading.meaning).toBe('Interpretation coming soon.');
    });

    it('handles case-insensitive input', () => {
      const reading = generateAspectReading('SUN', 'MOON', 'TRINE');
      expect(reading.title).toContain('Sun');
      expect(reading.title).toContain('Moon');
    });
  });

  describe('generateTransitReading', () => {
    it('returns reading for Jupiter trine natal Sun', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'jupiter',
        natalPlanet: 'sun',
        aspect: 'trine',
        orb: 1,
        strength: 8,
        activatedHouse: 5,
        natalHouse: 1,
        transitingSign: 'leo',
      };
      const reading = generateTransitReading(transit);
      expect(reading.title).toContain('Jupiter');
      expect(reading.title).toContain('Sun');
      expect(reading.meaning.length).toBeGreaterThan(0);
      expect(reading.personal.length).toBeGreaterThan(0);
      expect(reading.timing).toContain('peak intensity');
      expect(reading.advice.length).toBeGreaterThan(0);
    });

    it('returns building intensity for medium orb', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'saturn',
        natalPlanet: 'moon',
        aspect: 'square',
        orb: 3,
        strength: 6,
        activatedHouse: 10,
        natalHouse: 4,
        transitingSign: 'capricorn',
      };
      const reading = generateTransitReading(transit);
      expect(reading.timing).toContain('building');
    });

    it('returns early stages for wide orb', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'mars',
        natalPlanet: 'venus',
        aspect: 'conjunction',
        orb: 6,
        strength: 4,
        activatedHouse: 7,
        natalHouse: 2,
        transitingSign: 'aries',
      };
      const reading = generateTransitReading(transit);
      expect(reading.timing).toContain('early or late');
    });

    it('returns fallback for unknown data', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'unknown',
        natalPlanet: 'unknown',
        aspect: 'unknown',
        orb: 1,
        strength: 5,
        activatedHouse: 1,
        natalHouse: 1,
        transitingSign: 'aries',
      };
      const reading = generateTransitReading(transit);
      expect(reading.meaning).toBe('Interpretation coming soon.');
    });

    it('includes house meaning in personal section', () => {
      const transit: PersonalTransit = {
        transitingPlanet: 'jupiter',
        natalPlanet: 'sun',
        aspect: 'trine',
        orb: 1,
        strength: 8,
        activatedHouse: 1,
        natalHouse: 1,
        transitingSign: 'leo',
      };
      const reading = generateTransitReading(transit);
      expect(reading.personal).toContain('Self');
    });
  });

  describe('generateCelestialWeatherReading', () => {
    it('returns reading for new moon in aries', () => {
      const reading = generateCelestialWeatherReading('new', 'aries');
      expect(reading.summary).toContain('new');
      expect(reading.summary).toContain('aries');
      expect(reading.themes).toContain('beginnings');
      expect(reading.guidance.length).toBeGreaterThan(0);
      expect(reading.opportunities.length).toBeGreaterThan(0);
      expect(reading.challenges.length).toBeGreaterThan(0);
    });

    it('returns reading for full moon in pisces', () => {
      const reading = generateCelestialWeatherReading('full', 'pisces');
      expect(reading.themes).toContain('culmination');
      expect(reading.summary).toContain('pisces');
    });

    it('returns reading for waxing moon in taurus', () => {
      const reading = generateCelestialWeatherReading('waxing', 'taurus');
      expect(reading.themes).toContain('building');
    });

    it('returns reading for waning moon in scorpio', () => {
      const reading = generateCelestialWeatherReading('waning', 'scorpio');
      expect(reading.themes).toContain('completion');
    });

    it('handles unknown moon phase gracefully', () => {
      const reading = generateCelestialWeatherReading('unknown', 'aries');
      expect(reading.themes).toContain('balance');
    });

    it('handles unknown moon sign gracefully', () => {
      const reading = generateCelestialWeatherReading('new', 'unknown');
      expect(reading.summary).toContain('new');
    });

    it('returns opportunities array with 3 items', () => {
      const reading = generateCelestialWeatherReading('full', 'leo');
      expect(reading.opportunities.length).toBe(3);
    });

    it('returns challenges array with 2 items', () => {
      const reading = generateCelestialWeatherReading('full', 'leo');
      expect(reading.challenges.length).toBe(2);
    });
  });
});
