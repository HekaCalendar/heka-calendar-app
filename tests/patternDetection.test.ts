// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  detectPatterns,
  PATTERN_DESCRIPTIONS,
  toLegacyPatterns,
} from '../src/astrology/services/calculations/patternDetection';
import type { CelestialBody, PlanetId } from '../src/astrology/types';
import { toDegree } from '../src/astrology/types/core';

function makeBody(
  id: PlanetId,
  longitude: number,
  speed = 1
): CelestialBody {
  return {
    id,
    longitude: toDegree(longitude),
    latitude: 0,
    distance: 1,
    speed,
    isRetrograde: false,
    sign: 'aries',
    degreeInSign: toDegree(longitude % 30) as CelestialBody['degreeInSign'],
  };
}

describe('pattern detection', () => {
  describe('detectPatterns', () => {
    it('returns empty array for empty chart', () => {
      const patterns = detectPatterns({});
      expect(patterns).toEqual([]);
    });

    it('returns empty array for single body', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
      };
      const patterns = detectPatterns(bodies);
      expect(patterns).toEqual([]);
    });

    it('returns empty array for two bodies with no aspect pattern', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 15),
      };
      const patterns = detectPatterns(bodies);
      expect(patterns.length).toBe(0);
    });
  });

  describe('grand trine detection', () => {
    it('detects a grand trine with 3 bodies at 0°, 120°, 240°', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 120),
        mars: makeBody('mars', 240),
      };
      const patterns = detectPatterns(bodies);
      const grandTrines = patterns.filter((p) => p.type === 'grand_trine');
      expect(grandTrines.length).toBeGreaterThanOrEqual(1);
    });

    it('grand trine has correct type and name', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 120),
        mars: makeBody('mars', 240),
      };
      const patterns = detectPatterns(bodies);
      const grandTrine = patterns.find((p) => p.type === 'grand_trine');
      expect(grandTrine).toBeDefined();
      expect(grandTrine!.name.toLowerCase()).toContain('grand trine');
    });

    it('grand trine includes all three planets', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 120),
        mars: makeBody('mars', 240),
      };
      const patterns = detectPatterns(bodies);
      const grandTrine = patterns.find((p) => p.type === 'grand_trine');
      expect(grandTrine!.planets).toContain('sun');
      expect(grandTrine!.planets).toContain('moon');
      expect(grandTrine!.planets).toContain('mars');
      expect(grandTrine!.planets.length).toBe(3);
    });

    it('grand trine has exactly 3 aspects', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 120),
        mars: makeBody('mars', 240),
      };
      const patterns = detectPatterns(bodies);
      const grandTrine = patterns.find((p) => p.type === 'grand_trine');
      expect(grandTrine!.aspects.length).toBe(3);
    });

    it('grand trine has lifeThemes array', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 120),
        mars: makeBody('mars', 240),
      };
      const patterns = detectPatterns(bodies);
      const grandTrine = patterns.find((p) => p.type === 'grand_trine');
      expect(grandTrine!.lifeThemes.length).toBeGreaterThan(0);
    });
  });

  describe('t-square detection', () => {
    it('detects a t-square with opposition and apex square', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        saturn: makeBody('saturn', 180),
        mars: makeBody('mars', 90),
      };
      const patterns = detectPatterns(bodies);
      const tSquares = patterns.filter((p) => p.type === 't_square');
      expect(tSquares.length).toBeGreaterThanOrEqual(1);
    });

    it('t-square has correct name', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        saturn: makeBody('saturn', 180),
        mars: makeBody('mars', 90),
      };
      const patterns = detectPatterns(bodies);
      const tSquare = patterns.find((p) => p.type === 't_square');
      expect(tSquare).toBeDefined();
      expect(tSquare!.name).toBe('T-Square');
    });

    it('t-square includes the apex planet', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        saturn: makeBody('saturn', 180),
        mars: makeBody('mars', 90),
      };
      const patterns = detectPatterns(bodies);
      const tSquare = patterns.find((p) => p.type === 't_square');
      expect(tSquare!.planets).toContain('mars');
    });

    it('t-square has 3 planets total', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        saturn: makeBody('saturn', 180),
        mars: makeBody('mars', 90),
      };
      const patterns = detectPatterns(bodies);
      const tSquare = patterns.find((p) => p.type === 't_square');
      expect(tSquare!.planets.length).toBe(3);
    });

    it('t-square interpretation mentions the apex planet', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        saturn: makeBody('saturn', 180),
        mars: makeBody('mars', 90),
      };
      const patterns = detectPatterns(bodies);
      const tSquare = patterns.find((p) => p.type === 't_square');
      expect(tSquare!.interpretation.toLowerCase()).toContain('apex');
    });
  });

  describe('stellium detection', () => {
    it('detects stellium with 3 bodies in same sign', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 5),
        moon: makeBody('moon', 10),
        mars: makeBody('mars', 15),
      };
      const patterns = detectPatterns(bodies);
      const stelliums = patterns.filter((p) => p.type === 'stellium');
      expect(stelliums.length).toBeGreaterThanOrEqual(1);
    });

    it('does not detect stellium with only 2 bodies in same sign', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 5),
        moon: makeBody('moon', 10),
      };
      const patterns = detectPatterns(bodies);
      const stelliums = patterns.filter((p) => p.type === 'stellium');
      expect(stelliums.length).toBe(0);
    });

    it('stellium with 4 bodies has higher strength', () => {
      const bodies3: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 5),
        moon: makeBody('moon', 10),
        mars: makeBody('mars', 15),
      };
      const bodies4: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 5),
        moon: makeBody('moon', 10),
        mars: makeBody('mars', 15),
        mercury: makeBody('mercury', 20),
      };
      const patterns3 = detectPatterns(bodies3);
      const patterns4 = detectPatterns(bodies4);
      const stellium3 = patterns3.find((p) => p.type === 'stellium');
      const stellium4 = patterns4.find((p) => p.type === 'stellium');
      expect(stellium4!.strength).toBeGreaterThan(stellium3!.strength);
    });

    it('stellium name contains the sign', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 5),
        moon: makeBody('moon', 10),
        mars: makeBody('mars', 15),
      };
      const patterns = detectPatterns(bodies);
      const stellium = patterns.find((p) => p.type === 'stellium');
      expect(stellium!.name.toLowerCase()).toContain('stellium');
    });

    it('stellium has empty aspects array', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 5),
        moon: makeBody('moon', 10),
        mars: makeBody('mars', 15),
      };
      const patterns = detectPatterns(bodies);
      const stellium = patterns.find((p) => p.type === 'stellium');
      expect(stellium!.aspects).toEqual([]);
    });
  });

  describe('yod detection', () => {
    it('detects a yod with sextile base and two quincunxes', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 60),
        pluto: makeBody('pluto', 210),
      };
      const patterns = detectPatterns(bodies);
      const yods = patterns.filter((p) => p.type === 'yod');
      expect(yods.length).toBeGreaterThanOrEqual(1);
    });

    it('yod has correct name', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 60),
        pluto: makeBody('pluto', 210),
      };
      const patterns = detectPatterns(bodies);
      const yod = patterns.find((p) => p.type === 'yod');
      expect(yod).toBeDefined();
      expect(yod!.name).toContain('Yod');
    });

    it('yod includes the apex planet', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 60),
        pluto: makeBody('pluto', 210),
      };
      const patterns = detectPatterns(bodies);
      const yod = patterns.find((p) => p.type === 'yod');
      expect(yod!.planets).toContain('pluto');
    });

    it('yod has exactly 3 planets', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 60),
        pluto: makeBody('pluto', 210),
      };
      const patterns = detectPatterns(bodies);
      const yod = patterns.find((p) => p.type === 'yod');
      expect(yod!.planets.length).toBe(3);
    });

    it('yod description mentions divine purpose', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 60),
        pluto: makeBody('pluto', 210),
      };
      const patterns = detectPatterns(bodies);
      const yod = patterns.find((p) => p.type === 'yod');
      expect(yod!.description.toLowerCase()).toContain('divine');
    });
  });

  describe('pattern sorting and deduplication', () => {
    it('sorts patterns by strength descending', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 120),
        mars: makeBody('mars', 240),
        mercury: makeBody('mercury', 5),
        venus: makeBody('venus', 10),
        jupiter: makeBody('jupiter', 15),
      };
      const patterns = detectPatterns(bodies);
      for (let i = 1; i < patterns.length; i++) {
        expect(patterns[i].strength).toBeLessThanOrEqual(patterns[i - 1].strength);
      }
    });

    it('does not return duplicate patterns', () => {
      const bodies: Record<PlanetId, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 120),
        mars: makeBody('mars', 240),
      };
      const patterns = detectPatterns(bodies);
      const keys = patterns.map((p) => `${p.type}-${[...p.planets].sort().join('-')}`);
      const uniqueKeys = [...new Set(keys)];
      expect(keys.length).toBe(uniqueKeys.length);
    });
  });

  describe('PATTERN_DESCRIPTIONS', () => {
    it('has an entry for every pattern type', () => {
      const types = [
        'yod',
        'grand_trine',
        't_square',
        'grand_cross',
        'kite',
        'mystic_rectangle',
        'stellium',
        'grand_sextile',
        'cradle',
        'thors_hammer',
        'hard_rectangle',
      ] as const;
      for (const type of types) {
        expect(PATTERN_DESCRIPTIONS[type]).toBeDefined();
      }
    });

    it('each description has symbol, shortDesc, blessing, challenge', () => {
      for (const desc of Object.values(PATTERN_DESCRIPTIONS)) {
        expect(desc.symbol).toBeTruthy();
        expect(desc.shortDesc).toBeTruthy();
        expect(desc.blessing).toBeTruthy();
        expect(desc.challenge).toBeTruthy();
      }
    });
  });

  describe('toLegacyPatterns', () => {
    it('converts ChartPattern to legacy Pattern', () => {
      const chartPatterns = [
        {
          type: 'grand_trine' as const,
          name: 'Grand Trine in Fire',
          description: 'test',
          planets: ['sun', 'moon', 'mars'] as PlanetId[],
          aspects: [],
          strength: 8,
          interpretation: 'test',
          lifeThemes: [],
        },
      ];
      const legacy = toLegacyPatterns(chartPatterns);
      expect(legacy.length).toBe(1);
      expect(legacy[0].type).toBe('grand-trine');
      expect(legacy[0].planets).toEqual(['sun', 'moon', 'mars']);
    });

    it('scales strength from 0-10 to 0-1', () => {
      const chartPatterns = [
        {
          type: 'stellium' as const,
          name: 'Aries Stellium',
          description: 'test',
          planets: ['sun', 'moon'] as PlanetId[],
          aspects: [],
          strength: 10,
          interpretation: 'test',
          lifeThemes: [],
        },
      ];
      const legacy = toLegacyPatterns(chartPatterns);
      expect(legacy[0].strength).toBe(1);
    });

    it('replaces underscores with hyphens in type', () => {
      const chartPatterns = [
        {
          type: 't_square' as const,
          name: 'T-Square',
          description: 'test',
          planets: ['sun', 'mars', 'saturn'] as PlanetId[],
          aspects: [],
          strength: 5,
          interpretation: 'test',
          lifeThemes: [],
        },
      ];
      const legacy = toLegacyPatterns(chartPatterns);
      expect(legacy[0].type).toBe('t-square');
    });
  });
});
