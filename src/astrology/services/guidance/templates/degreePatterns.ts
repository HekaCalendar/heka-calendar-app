/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DEGREE-BASED PATTERN RECOGNITION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Specific degrees carry archetypal meanings across traditions:
 * - 0° (World Axis): New beginnings, fated visibility, initiation
 * - 15° (Avatar/Solid): Manifestation, concrete expression, midpoint power
 * - 22.5° (Pleiades/Sidereal): Spiritual sensitivity, collective wound, divine messenger
 * - 29° (Anaretic): Crisis, completion, karmic urgency, final lesson
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface DegreePattern {
  degree: number;
  type: 'critical' | 'anaretic' | 'avatar' | 'pleiadian' | 'royal';
  name: string;
  meaning: string;
  advice: string;
  intensity: number; // 1-10
}

/** Check if a degree falls within a critical zone */
export function detectDegreePattern(degree: number): DegreePattern | null {
  // Anaretic degree (29°) — most intense
  if (degree >= 28.5 && degree < 30) {
    return {
      degree,
      type: 'anaretic',
      name: 'Anaretic Degree',
      meaning: 'The final degree of the sign carries the urgency of completion. What has been delayed can be delayed no longer. The karmic lesson of this sign demands resolution.',
      advice: 'Do not postpone what must be finished. The crisis is not punishment — it is the pressure that forces closure. Act with the gravity of someone who knows this is the last chance.',
      intensity: 10,
    };
  }

  // 0° (World Axis / Aries Point resonance)
  if (degree >= 0 && degree < 1.5) {
    return {
      degree,
      type: 'critical',
      name: 'World Axis Degree',
      meaning: 'The zero degree is pure potential — the seed before the sprout, the word before the sentence. What begins here carries fated visibility; the world will see what you initiate.',
      advice: 'Begin with intention. What you seed at 0° will grow in public view. Make sure it is something you are willing to be known by.',
      intensity: 8,
    };
  }

  // 15° (Avatar / Solid degree — manifestation point)
  if (degree >= 14.5 && degree < 15.5) {
    return {
      degree,
      type: 'avatar',
      name: 'Avatar Degree',
      meaning: 'The 15th degree is the heart of the sign — where abstract potential becomes concrete reality. This is the degree of manifestation, of bringing heaven down to earth.',
      advice: 'Make it real. The idea has matured; now it needs form. This is the moment to build, to publish, to commit, to make visible what has been only imagined.',
      intensity: 7,
    };
  }

  // 22.5° (Pleiadian / Sidereal degree — spiritual sensitivity)
  if (degree >= 22 && degree < 23) {
    return {
      degree,
      type: 'pleiadian',
      name: 'Pleiadian Degree',
      meaning: 'The 22.5° degree carries the resonance of the Pleiades — spiritual sensitivity, the collective wound, the divine messenger who speaks what others cannot bear to hear.',
      advice: 'Your sensitivity is not weakness — it is antenna. What you feel that others deny is real. Trust the information that arrives through dreams, synchronicity, and bodily knowing.',
      intensity: 6,
    };
  }

  // Royal degrees (specific known power degrees)
  const royalDegrees = [9, 12, 18, 21, 24, 27];
  const closeToRoyal = royalDegrees.find(d => Math.abs(degree - d) < 0.75);
  if (closeToRoyal !== undefined) {
    return {
      degree,
      type: 'royal',
      name: `Royal Degree (${closeToRoyal}°)`,
      meaning: `The ${closeToRoyal}° degree carries regal, sovereign energy. This is a place of natural authority — not dominance, but the kind of leadership that others instinctively trust.`,
      advice: 'Lead without forcing. Your authority at this degree is recognised before you speak. Use it to elevate others, not to dominate them.',
      intensity: 5,
    };
  }

  return null;
}

/** Detect degree patterns across all planet positions */
export function detectAllDegreePatterns(
  positions: Record<string, { sign: string; degree: number }>
): Array<{ planet: string; pattern: DegreePattern }> {
  const results: Array<{ planet: string; pattern: DegreePattern }> = [];

  for (const [planet, pos] of Object.entries(positions)) {
    const pattern = detectDegreePattern(pos.degree);
    if (pattern) {
      results.push({ planet, pattern });
    }
  }

  // Sort by intensity (strongest first)
  return results.sort((a, b) => b.pattern.intensity - a.pattern.intensity);
}

/** Format degree pattern into narrative text */
export function formatDegreeNarrative(
  planet: string,
  sign: string,
  pattern: DegreePattern
): string {
  return `${planet} at ${pattern.degree.toFixed(1)}° ${sign} — ${pattern.name}: ${pattern.meaning} ${pattern.advice}`;
}
