// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  calculateAspects,
  calculateAspectBetweenBodies,
  calculateSeparation,
  isApplying,
  getAspectSymbol,
  getAspectDescription,
  getAspectColor,
  calculateTransits,
} from '../src/astrology/services/calculations/aspects';
import type { CelestialBody, PlanetId } from '../src/astrology/types';
import { toDegree } from '../src/astrology/types/core';

/** Build a mock CelestialBody for testing */
function makeBody(
  id: PlanetId,
  longitude: number,
  speed = 1,
  isRetrograde = false
): CelestialBody {
  return {
    id,
    longitude: toDegree(longitude),
    latitude: 0,
    distance: 1,
    speed,
    isRetrograde,
    sign: 'aries',
    degreeInSign: toDegree(longitude % 30) as CelestialBody['degreeInSign'],
  };
}

describe('aspect calculations', () => {
  describe('calculateSeparation', () => {
    it('returns 0 for identical longitudes', () => {
      expect(calculateSeparation(toDegree(0), toDegree(0))).toBe(0);
    });

    it('returns correct separation for nearby degrees', () => {
      expect(calculateSeparation(toDegree(10), toDegree(20))).toBe(10);
    });

    it('wraps across 360 boundary', () => {
      expect(calculateSeparation(toDegree(350), toDegree(10))).toBe(20);
    });

    it('handles exact opposition (180)', () => {
      expect(calculateSeparation(toDegree(0), toDegree(180))).toBe(180);
    });

    it('handles near-opposition across boundary', () => {
      expect(calculateSeparation(toDegree(350), toDegree(170))).toBe(180);
    });

    it('returns the shorter arc for >180 separation', () => {
      expect(calculateSeparation(toDegree(0), toDegree(270))).toBe(90);
    });
  });

  describe('calculateAspectBetweenBodies', () => {
    it('detects exact conjunction', () => {
      const sun = makeBody('sun', 0);
      const moon = makeBody('moon', 0);
      const aspect = calculateAspectBetweenBodies(sun, moon);
      expect(aspect).not.toBeNull();
      expect(aspect!.type).toBe('conjunction');
      expect(aspect!.orb).toBeLessThan(0.1);
    });

    it('detects conjunction within orb', () => {
      const sun = makeBody('sun', 0);
      const moon = makeBody('moon', 5);
      const aspect = calculateAspectBetweenBodies(sun, moon);
      expect(aspect).not.toBeNull();
      expect(aspect!.type).toBe('conjunction');
      expect(aspect!.orb).toBeCloseTo(5, 1);
    });

    it('detects exact opposition', () => {
      const sun = makeBody('sun', 0);
      const mars = makeBody('mars', 180);
      const aspect = calculateAspectBetweenBodies(sun, mars);
      expect(aspect).not.toBeNull();
      expect(aspect!.type).toBe('opposition');
    });

    it('detects exact trine', () => {
      const sun = makeBody('sun', 0);
      const jupiter = makeBody('jupiter', 120);
      const aspect = calculateAspectBetweenBodies(sun, jupiter);
      expect(aspect).not.toBeNull();
      expect(aspect!.type).toBe('trine');
    });

    it('detects exact square', () => {
      const sun = makeBody('sun', 0);
      const saturn = makeBody('saturn', 90);
      const aspect = calculateAspectBetweenBodies(sun, saturn);
      expect(aspect).not.toBeNull();
      expect(aspect!.type).toBe('square');
    });

    it('detects exact sextile', () => {
      const sun = makeBody('sun', 0);
      const venus = makeBody('venus', 60);
      const aspect = calculateAspectBetweenBodies(sun, venus);
      expect(aspect).not.toBeNull();
      expect(aspect!.type).toBe('sextile');
    });

    it('returns null when no aspect is within orb', () => {
      const sun = makeBody('sun', 0);
      const mars = makeBody('mars', 45); // Semisquare exact, but check a non-aspect angle
      const aspect = calculateAspectBetweenBodies(sun, mars);
      // 45° is semisquare which has 2° orb — this should match
      expect(aspect).not.toBeNull();
      expect(aspect!.type).toBe('semisquare');
    });

    it('returns null for truly out-of-orb positions', () => {
      const sun = makeBody('sun', 0);
      const mars = makeBody('mars', 15); // No aspect at 15°
      const aspect = calculateAspectBetweenBodies(sun, mars);
      expect(aspect).toBeNull();
    });

    it('respects includeMinorAspects=false', () => {
      const sun = makeBody('sun', 0);
      const moon = makeBody('moon', 150); // quincunx
      const aspect = calculateAspectBetweenBodies(sun, moon, { includeMinorAspects: false });
      // quincunx is considered minor in this codebase
      expect(aspect).toBeNull();
    });

    it('respects includeMinorAspects=true', () => {
      const sun = makeBody('sun', 0);
      const moon = makeBody('moon', 150); // quincunx
      const aspect = calculateAspectBetweenBodies(sun, moon, { includeMinorAspects: true });
      expect(aspect).not.toBeNull();
      expect(aspect!.type).toBe('quincunx');
    });

    it('respects aspectFilter', () => {
      const sun = makeBody('sun', 0);
      const mars = makeBody('mars', 180);
      const aspect = calculateAspectBetweenBodies(sun, mars, { aspectFilter: ['conjunction', 'trine'] });
      expect(aspect).toBeNull();
    });

    it('respects orbModifier (tighter)', () => {
      const sun = makeBody('sun', 0);
      const moon = makeBody('moon', 7); // 7° from conjunction, orb is 8°
      const aspect = calculateAspectBetweenBodies(sun, moon, { orbModifier: 0.5 });
      // 8° * 0.5 = 4° max orb, so 7° should not match
      expect(aspect).toBeNull();
    });

    it('respects orbModifier (wider)', () => {
      const sun = makeBody('sun', 0);
      const moon = makeBody('moon', 10); // 10° from conjunction
      const aspect = calculateAspectBetweenBodies(sun, moon, { orbModifier: 2.0 });
      // 8° * 2.0 = 16° max orb, so 10° should match
      expect(aspect).not.toBeNull();
      expect(aspect!.type).toBe('conjunction');
    });

    it('marks exact aspects (orb < 0.1)', () => {
      const sun = makeBody('sun', 0);
      const moon = makeBody('moon', 0.05);
      const aspect = calculateAspectBetweenBodies(sun, moon);
      expect(aspect!.isExact).toBe(true);
    });
  });

  describe('calculateAspects', () => {
    it('returns empty array for empty bodies', () => {
      expect(calculateAspects({})).toEqual([]);
    });

    it('returns empty array for single body', () => {
      expect(calculateAspects({ sun: makeBody('sun', 0) })).toEqual([]);
    });

    it('finds aspects among multiple bodies', () => {
      const bodies: Record<string, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 60),
        mars: makeBody('mars', 120),
      };
      const aspects = calculateAspects(bodies as Record<PlanetId, CelestialBody>);
      expect(aspects.length).toBeGreaterThanOrEqual(2);
    });

    it('sorts results by orb ascending', () => {
      const bodies: Record<string, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 1),   // tight conjunction
        mars: makeBody('mars', 5),   // wider conjunction
      };
      const aspects = calculateAspects(bodies as Record<PlanetId, CelestialBody>);
      for (let i = 1; i < aspects.length; i++) {
        expect(aspects[i].orb).toBeGreaterThanOrEqual(aspects[i - 1].orb);
      }
    });

    it('respects bodyFilter', () => {
      const bodies: Record<string, CelestialBody> = {
        sun: makeBody('sun', 0),
        moon: makeBody('moon', 60),
        mars: makeBody('mars', 120),
      };
      const aspects = calculateAspects(bodies as Record<PlanetId, CelestialBody>, {
        bodyFilter: ['sun', 'moon'] as PlanetId[],
      });
      // Only sun-moon aspect should be present
      expect(aspects.length).toBe(1);
      expect(aspects[0].body1).toBe('sun');
      expect(aspects[0].body2).toBe('moon');
    });
  });

  describe('isApplying', () => {
    it('returns true when faster body approaches slower', () => {
      const fast = makeBody('moon', 0, 13);   // Moon moves fast
      const slow = makeBody('sun', 10, 1);    // Sun moves slow
      expect(isApplying(fast, slow)).toBe(true);
    });

    it('returns false when faster body moves away', () => {
      const fast = makeBody('moon', 20, 13);
      const slow = makeBody('sun', 10, 1);
      expect(isApplying(fast, slow)).toBe(false);
    });
  });

  describe('getAspectSymbol', () => {
    it('returns symbols for all aspect types', () => {
      expect(getAspectSymbol('conjunction')).toBe('☌');
      expect(getAspectSymbol('opposition')).toBe('☍');
      expect(getAspectSymbol('trine')).toBe('△');
      expect(getAspectSymbol('square')).toBe('□');
      expect(getAspectSymbol('sextile')).toBe('⚹');
    });
  });

  describe('getAspectDescription', () => {
    it('returns descriptions for all aspect types', () => {
      expect(getAspectDescription('conjunction')).toContain('Unity');
      expect(getAspectDescription('opposition')).toContain('Polarity');
      expect(getAspectDescription('trine')).toContain('Flow');
      expect(getAspectDescription('square')).toContain('Challenge');
    });
  });

  describe('getAspectColor', () => {
    it('returns valid hex colors for all aspect types', () => {
      const types = ['conjunction', 'opposition', 'trine', 'square', 'sextile'] as const;
      for (const type of types) {
        const color = getAspectColor(type);
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });
  });

  describe('calculateTransits', () => {
    it('returns empty array when either set is empty', () => {
      expect(calculateTransits({}, {})).toEqual([]);
      expect(calculateTransits({ sun: makeBody('sun', 0) }, {})).toEqual([]);
    });

    it('finds transiting aspects', () => {
      const natal = { sun: makeBody('sun', 0) } as Record<PlanetId, CelestialBody>;
      const transit = { saturn: makeBody('saturn', 90) } as Record<PlanetId, CelestialBody>;
      const aspects = calculateTransits(natal, transit);
      expect(aspects.length).toBe(1);
      expect(aspects[0].type).toBe('square');
    });

    it('sorts transits by orb ascending', () => {
      const natal = { sun: makeBody('sun', 0) } as Record<PlanetId, CelestialBody>;
      const transit = {
        saturn: makeBody('saturn', 90),
        jupiter: makeBody('jupiter', 120),
      } as Record<PlanetId, CelestialBody>;
      const aspects = calculateTransits(natal, transit);
      for (let i = 1; i < aspects.length; i++) {
        expect(aspects[i].orb).toBeGreaterThanOrEqual(aspects[i - 1].orb);
      }
    });
  });
});
