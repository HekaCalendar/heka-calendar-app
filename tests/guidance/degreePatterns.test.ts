import { describe, it, expect } from 'vitest';
import {
  detectDegreePattern,
  detectAllDegreePatterns,
  formatDegreeNarrative,
  type DegreePattern,
} from '../../src/astrology/services/guidance/templates/degreePatterns';

describe('detectDegreePattern', () => {
  it('returns anaretic for degree 29', () => {
    const pattern = detectDegreePattern(29);
    expect(pattern).not.toBeNull();
    expect(pattern!.type).toBe('anaretic');
    expect(pattern!.name).toBe('Anaretic Degree');
    expect(pattern!.intensity).toBe(10);
  });

  it('returns world axis for degree 0', () => {
    const pattern = detectDegreePattern(0);
    expect(pattern).not.toBeNull();
    expect(pattern!.type).toBe('critical');
    expect(pattern!.name).toBe('World Axis Degree');
    expect(pattern!.intensity).toBe(8);
  });

  it('returns avatar for degree 15', () => {
    const pattern = detectDegreePattern(15);
    expect(pattern).not.toBeNull();
    expect(pattern!.type).toBe('avatar');
    expect(pattern!.name).toBe('Avatar Degree');
    expect(pattern!.intensity).toBe(7);
  });

  it('returns pleiadian for degree 22.5', () => {
    const pattern = detectDegreePattern(22.5);
    expect(pattern).not.toBeNull();
    expect(pattern!.type).toBe('pleiadian');
    expect(pattern!.name).toBe('Pleiadian Degree');
    expect(pattern!.intensity).toBe(6);
  });

  it('returns nothing for degree 25', () => {
    const pattern = detectDegreePattern(25);
    expect(pattern).toBeNull();
  });

  it('returns royal for degree 9', () => {
    const pattern = detectDegreePattern(9);
    expect(pattern).not.toBeNull();
    expect(pattern!.type).toBe('royal');
    expect(pattern!.name).toContain('Royal Degree');
  });
});

describe('detectAllDegreePatterns', () => {
  it('collects and sorts patterns by intensity descending', () => {
    const positions: Record<string, { sign: string; degree: number }> = {
      sun: { sign: 'aries', degree: 29 },
      moon: { sign: 'taurus', degree: 0 },
      venus: { sign: 'gemini', degree: 15 },
      mars: { sign: 'cancer', degree: 25 },
    };
    const results = detectAllDegreePatterns(positions);
    expect(results).toHaveLength(3);
    // Should be sorted by intensity: anaretic (10), critical (8), avatar (7)
    expect(results[0].planet).toBe('sun');
    expect(results[0].pattern.type).toBe('anaretic');
    expect(results[1].planet).toBe('moon');
    expect(results[1].pattern.type).toBe('critical');
    expect(results[2].planet).toBe('venus');
    expect(results[2].pattern.type).toBe('avatar');
  });

  it('returns empty array when no patterns match', () => {
    const positions: Record<string, { sign: string; degree: number }> = {
      saturn: { sign: 'capricorn', degree: 25 },
      uranus: { sign: 'aquarius', degree: 17 },
    };
    const results = detectAllDegreePatterns(positions);
    expect(results).toEqual([]);
  });
});

describe('formatDegreeNarrative', () => {
  it('produces expected string for anaretic pattern', () => {
    const pattern: DegreePattern = {
      degree: 29.0,
      type: 'anaretic',
      name: 'Anaretic Degree',
      meaning: 'The final degree carries urgency.',
      advice: 'Do not postpone what must be finished.',
      intensity: 10,
    };
    const text = formatDegreeNarrative('sun', 'aries', pattern);
    expect(text).toContain('sun');
    expect(text).toContain('aries');
    expect(text).toContain('Anaretic Degree');
    expect(text).toContain('The final degree carries urgency.');
    expect(text).toContain('Do not postpone what must be finished.');
  });

  it('produces expected string for world axis pattern', () => {
    const pattern: DegreePattern = {
      degree: 0.5,
      type: 'critical',
      name: 'World Axis Degree',
      meaning: 'Pure potential.',
      advice: 'Begin with intention.',
      intensity: 8,
    };
    const text = formatDegreeNarrative('moon', 'libra', pattern);
    expect(text).toContain('moon at 0.5° libra');
    expect(text).toContain('World Axis Degree');
  });
});
