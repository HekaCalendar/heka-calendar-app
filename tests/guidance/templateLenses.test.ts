import { describe, it, expect } from 'vitest';
import {
  applyPhaseTransform,
  PHASE_TRANSFORMS,
} from '../../src/astrology/services/guidance/templates/phases';
import {
  applyAspectTransform,
  calculateAspectEnergy,
  ASPECT_TRANSFORMS,
} from '../../src/astrology/services/guidance/templates/aspects';
import {
  applyCategoryLens,
  CATEGORY_LENSES,
  type CategoryKey,
} from '../../src/astrology/services/guidance/templates/categories';

describe('applyPhaseTransform', () => {
  const baseText = 'The energy is rising. You feel a shift in your bones. Trust the process.';

  it('new-moon returns transformed text', () => {
    const result = applyPhaseTransform(baseText, 'new-moon');
    expect(result).toContain(PHASE_TRANSFORMS['new-moon'].narrativeLens);
    expect(result).toContain(PHASE_TRANSFORMS['new-moon'].timingAdvice);
  });

  it('full-moon returns transformed text', () => {
    const result = applyPhaseTransform(baseText, 'full-moon');
    expect(result).toContain(PHASE_TRANSFORMS['full-moon'].narrativeLens);
    expect(result).toContain(PHASE_TRANSFORMS['full-moon'].timingAdvice);
  });

  it('first-quarter returns transformed text', () => {
    const result = applyPhaseTransform(baseText, 'first-quarter');
    expect(result).toContain(PHASE_TRANSFORMS['first-quarter'].narrativeLens);
    expect(result).toContain(PHASE_TRANSFORMS['first-quarter'].timingAdvice);
  });

  it('last-quarter returns transformed text', () => {
    const result = applyPhaseTransform(baseText, 'last-quarter');
    expect(result).toContain(PHASE_TRANSFORMS['last-quarter'].narrativeLens);
    expect(result).toContain(PHASE_TRANSFORMS['last-quarter'].timingAdvice);
  });

  it('waxing-crescent returns transformed text', () => {
    const result = applyPhaseTransform(baseText, 'waxing-crescent');
    expect(result).toContain(PHASE_TRANSFORMS['waxing-crescent'].narrativeLens);
  });

  it('waning-crescent returns transformed text', () => {
    const result = applyPhaseTransform(baseText, 'waning-crescent');
    expect(result).toContain(PHASE_TRANSFORMS['waning-crescent'].narrativeLens);
  });

  it('returns base text when phaseKey is unknown (falls back to new-moon)', () => {
    const result = applyPhaseTransform(baseText, 'unknown-phase');
    expect(result).toContain(PHASE_TRANSFORMS['new-moon'].narrativeLens);
  });
});

describe('applyAspectTransform', () => {
  const baseText = 'You stand at a crossroads. The path forward requires courage. Trust your instincts.';

  it('conjunction inserts transition text', () => {
    const result = applyAspectTransform(baseText, 'conjunction', 'sun', 'mars');
    const conj = ASPECT_TRANSFORMS.conjunction;
    expect(result.length).toBeGreaterThan(baseText.length);
    // Transition should be inserted into the text
    const hasTransition = conj.transitionPool.some(t => result.includes(t));
    expect(hasTransition).toBe(true);
  });

  it('opposition inserts transition text', () => {
    const result = applyAspectTransform(baseText, 'opposition', 'sun', 'saturn');
    const opp = ASPECT_TRANSFORMS.opposition;
    const hasTransition = opp.transitionPool.some(t => result.includes(t));
    expect(hasTransition).toBe(true);
  });

  it('trine inserts transition text', () => {
    const result = applyAspectTransform(baseText, 'trine', 'venus', 'jupiter');
    const trine = ASPECT_TRANSFORMS.trine;
    const hasTransition = trine.transitionPool.some(t => result.includes(t));
    expect(hasTransition).toBe(true);
  });

  it('square inserts transition text', () => {
    const result = applyAspectTransform(baseText, 'square', 'mars', 'pluto');
    const sq = ASPECT_TRANSFORMS.square;
    const hasTransition = sq.transitionPool.some(t => result.includes(t));
    expect(hasTransition).toBe(true);
  });

  it('falls back to conjunction for unknown aspect', () => {
    const result = applyAspectTransform(baseText, 'nonexistent', 'a', 'b');
    const conj = ASPECT_TRANSFORMS.conjunction;
    const hasTransition = conj.transitionPool.some(t => result.includes(t));
    expect(hasTransition).toBe(true);
  });
});

describe('calculateAspectEnergy', () => {
  it('returns 0 for empty array', () => {
    expect(calculateAspectEnergy([])).toBe(0);
  });

  it('returns numeric score for single aspect', () => {
    const aspects = [{ type: 'trine', orb: 0 }];
    // trine energyLevel = 3, orbMultiplier = 1 - 0/8 = 1
    expect(calculateAspectEnergy(aspects)).toBeCloseTo(3, 5);
  });

  it('reduces energy for wider orbs', () => {
    const tight = [{ type: 'trine', orb: 0 }];
    const wide = [{ type: 'trine', orb: 4 }];
    const tightEnergy = calculateAspectEnergy(tight);
    const wideEnergy = calculateAspectEnergy(wide);
    // orbMultiplier at orb=4 is 1 - 4/8 = 0.5
    expect(wideEnergy).toBeCloseTo(tightEnergy * 0.5, 5);
  });

  it('returns 0 for very wide orbs (>= 8)', () => {
    const aspects = [{ type: 'square', orb: 8 }];
    expect(calculateAspectEnergy(aspects)).toBeCloseTo(0, 5);
  });

  it('sums multiple aspects', () => {
    const aspects = [
      { type: 'conjunction', orb: 1 }, // energy 4 * 0.875 = 3.5
      { type: 'square', orb: 2 },      // energy -3 * 0.75 = -2.25
    ];
    const energy = calculateAspectEnergy(aspects);
    expect(energy).toBeCloseTo(3.5 - 2.25, 5);
  });

  it('ignores unknown aspect types', () => {
    const aspects = [
      { type: 'conjunction', orb: 0 },
      { type: 'bogus_aspect', orb: 0 } as any,
    ];
    expect(calculateAspectEnergy(aspects)).toBeCloseTo(4, 5);
  });
});

describe('applyCategoryLens', () => {
  const template = {
    essence: 'You are becoming.',
    careerAdvice: 'Focus on mastery.',
    relationshipAdvice: 'Listen deeply.',
    growthAdvice: 'Embrace discomfort.',
    financesAdvice: 'Invest in yourself.',
    healthAdvice: 'Rest is productive.',
    bodyFocus: 'Move daily.',
  };

  it('general selects essence as primary', () => {
    const result = applyCategoryLens(template, 'general');
    expect(result.primary).toBe(template.essence);
    expect(result.affirmation).toContain(CATEGORY_LENSES.general.affirmationPrefix);
  });

  it('career selects careerAdvice as primary', () => {
    const result = applyCategoryLens(template, 'career');
    expect(result.primary).toBe(template.careerAdvice);
    expect(result.secondary).toContain(template.growthAdvice);
    expect(result.affirmation).toContain(CATEGORY_LENSES.career.affirmationPrefix);
  });

  it('relationships selects relationshipAdvice as primary', () => {
    const result = applyCategoryLens(template, 'relationships');
    expect(result.primary).toBe(template.relationshipAdvice);
  });

  it('health selects healthAdvice as primary', () => {
    const result = applyCategoryLens(template, 'health');
    expect(result.primary).toBe(template.healthAdvice);
    expect(result.secondary).toContain(template.bodyFocus);
  });

  it('finances selects financesAdvice as primary', () => {
    const result = applyCategoryLens(template, 'finances');
    expect(result.primary).toBe(template.financesAdvice);
  });

  it('personalGrowth selects growthAdvice as primary', () => {
    const result = applyCategoryLens(template, 'personalGrowth');
    expect(result.primary).toBe(template.growthAdvice);
  });

  it('timing selects essence as primary', () => {
    const result = applyCategoryLens(template, 'timing');
    expect(result.primary).toBe(template.essence);
  });

  it('falls back to general for unknown category', () => {
    const result = applyCategoryLens(template, 'unknown' as CategoryKey);
    expect(result.primary).toBe(template.essence);
    expect(result.affirmation).toContain(CATEGORY_LENSES.general.affirmationPrefix);
  });

  it('filters out missing secondary fields', () => {
    const sparse = { essence: 'Only this.' };
    const result = applyCategoryLens(sparse, 'career');
    expect(result.primary).toBe('Only this.');
    expect(result.secondary).toEqual([]);
  });
});
