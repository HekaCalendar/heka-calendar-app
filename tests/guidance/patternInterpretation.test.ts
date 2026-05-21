import { describe, it, expect } from 'vitest';
import {
  interpretPattern,
  interpretAllPatterns,
  type EnrichedPattern,
} from '../../src/astrology/services/guidance/templates/patternInterpretationEngine';
import type { ChartPattern } from '../../src/astrology/services/calculations/patternDetection';

function makePattern(
  type: ChartPattern['type'],
  name: string,
  planets: string[],
  strength = 7
): ChartPattern {
  return {
    type,
    name,
    description: `Test ${name}`,
    planets: planets as ChartPattern['planets'],
    aspects: [],
    strength,
    interpretation: `Interpretation of ${name}`,
    lifeThemes: [`Theme for ${name}`],
  };
}

describe('interpretPattern', () => {
  it('returns correct shape and narrative for GrandTrine', () => {
    const pattern = makePattern('grand_trine', 'Grand Trine in Fire', ['sun', 'mars', 'jupiter']);
    const enriched = interpretPattern(pattern);
    expect(enriched.type).toBe('grand_trine');
    expect(enriched.name).toBe('Grand Trine in Fire');
    expect(enriched.planets).toEqual(['sun', 'mars', 'jupiter']);
    expect(enriched.narrative).toContain('river of fire');
    expect(enriched.elementalTheme).toBe('fire');
    expect(enriched.advice.length).toBeGreaterThan(0);
  });

  it('returns correct shape and narrative for T-Square', () => {
    const pattern = makePattern('t_square', 'T-Square', ['mars', 'saturn', 'pluto']);
    const enriched = interpretPattern(pattern);
    expect(enriched.type).toBe('t_square');
    expect(enriched.name).toBe('T-Square');
    expect(enriched.narrative).toContain('Mars');
    expect(enriched.powerDynamics).toContain('Dynamic tension');
    expect(enriched.shadowWarning).toBeDefined();
  });

  it('returns correct shape and narrative for Yod', () => {
    const pattern = makePattern('yod', 'Yod (Finger of God)', ['northNode', 'uranus', 'pluto']);
    const enriched = interpretPattern(pattern);
    expect(enriched.type).toBe('yod');
    expect(enriched.name).toBe('Yod (Finger of God)');
    expect(enriched.narrative).toContain('North Node');
    expect(enriched.advice.some(a => a.includes('fated'))).toBe(true);
  });

  it('returns correct shape and narrative for Stellium', () => {
    const pattern = makePattern('stellium', 'Capricorn Stellium', ['sun', 'mercury', 'venus', 'saturn']);
    const enriched = interpretPattern(pattern);
    expect(enriched.type).toBe('stellium');
    expect(enriched.name).toBe('Capricorn Stellium');
    expect(enriched.narrative).toContain('supernova');
    expect(enriched.narrative).toContain('Capricorn');
    expect(enriched.powerDynamics).toContain('4 planetary energies');
  });

  it('returns correct shape and narrative for GrandCross', () => {
    const pattern = makePattern('grand_cross', 'Grand Cross', ['sun', 'moon', 'mars', 'saturn']);
    const enriched = interpretPattern(pattern);
    expect(enriched.type).toBe('grand_cross');
    expect(enriched.name).toBe('Grand Cross');
    expect(enriched.narrative).toContain('crucible');
    expect(enriched.advice.length).toBeGreaterThanOrEqual(4);
  });

  it('returns correct shape and narrative for Kite', () => {
    const pattern = makePattern('kite', 'Kite', ['sun', 'mars', 'jupiter', 'moon']);
    const enriched = interpretPattern(pattern);
    expect(enriched.type).toBe('kite');
    expect(enriched.name).toBe('Kite');
    expect(enriched.narrative).toContain('Grand Trine');
    expect(enriched.shadowWarning).toContain('complacency');
  });

  it('falls back to generic for unknown pattern type', () => {
    const pattern = makePattern('hard_rectangle' as ChartPattern['type'], 'Hard Rectangle', ['sun', 'moon']);
    const enriched = interpretPattern(pattern);
    expect(enriched.narrative).toContain('Hard Rectangle');
    expect(enriched.advice.length).toBeGreaterThan(0);
  });
});

describe('interpretAllPatterns', () => {
  it('deduplicates patterns by type+planet combo', () => {
    const patterns: ChartPattern[] = [
      makePattern('grand_trine', 'Grand Trine in Fire', ['sun', 'mars', 'jupiter'], 9),
      makePattern('grand_trine', 'Grand Trine in Fire', ['sun', 'mars', 'jupiter'], 8), // duplicate
      makePattern('t_square', 'T-Square', ['saturn', 'pluto', 'mars'], 7),
    ];
    const results = interpretAllPatterns(patterns);
    expect(results).toHaveLength(2);
    expect(results[0].type).toBe('grand_trine');
    expect(results[1].type).toBe('t_square');
  });

  it('limits results to maxResults', () => {
    const patterns: ChartPattern[] = [
      makePattern('grand_trine', 'Grand Trine in Fire', ['a', 'b', 'c'], 9),
      makePattern('t_square', 'T-Square', ['d', 'e', 'f'], 8),
      makePattern('yod', 'Yod', ['g', 'h', 'i'], 7),
      makePattern('stellium', 'Stellium', ['j', 'k', 'l'], 6),
      makePattern('kite', 'Kite', ['m', 'n', 'o', 'p'], 5),
      makePattern('grand_cross', 'Grand Cross', ['q', 'r', 's', 't'], 4),
    ];
    const results = interpretAllPatterns(patterns, 3);
    expect(results).toHaveLength(3);
    // Sorted by strength descending
    expect(results[0].strength).toBe(9);
    expect(results[1].strength).toBe(8);
    expect(results[2].strength).toBe(7);
  });

  it('returns empty array for empty input', () => {
    const results = interpretAllPatterns([]);
    expect(results).toEqual([]);
  });
});
