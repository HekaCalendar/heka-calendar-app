/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MOON PHASE TRANSFORMS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Each phase acts as a narrative lens that shifts how a template's advice
 * is received and prioritised. These are not just prefixes — they reframe
 * the entire reading through the lunar cycle.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface PhaseTransform {
  name: string;
  theme: string;
  timingAdvice: string;
  narrativeLens: string;      // How the phase reframes the story
  actionVerb: string;         // What to do during this phase
  shadowWarning: string;      // What to watch for
  elementalAccent: string;    // Which element is emphasised
  keywords: string[];
}

export const PHASE_TRANSFORMS: Record<string, PhaseTransform> = {
  'new-moon': {
    name: 'New Moon',
    theme: 'Seeding, intention-setting, initiation',
    timingAdvice: 'Plant seeds. Begin what has been waiting. The dark holds potential.',
    narrativeLens: 'You stand at the threshold. What wants to be born through you now?',
    actionVerb: 'initiate',
    shadowWarning: 'Do not mistake emptiness for failure. The seed is invisible by design.',
    elementalAccent: 'earth',
    keywords: ['beginning', 'potential', 'silence', 'intention'],
  },
  'waxing-crescent': {
    name: 'Waxing Crescent',
    theme: 'Building, commitment, first steps',
    timingAdvice: 'Take the first visible step. Gather what you need.',
    narrativeLens: 'The sprout breaks soil. This is the courage of emergence.',
    actionVerb: 'commit',
    shadowWarning: 'Impatience kills young shoots. Let growth be gradual.',
    elementalAccent: 'fire',
    keywords: ['momentum', 'courage', 'emergence', 'resource'],
  },
  'first-quarter': {
    name: 'First Quarter',
    theme: 'Action, decision, overcoming resistance',
    timingAdvice: 'Push through. Make the decision you have been avoiding.',
    narrativeLens: 'The tension between what was and what will be demands a choice.',
    actionVerb: 'decide',
    shadowWarning: 'Resistance is information, not obstruction. Listen before forcing.',
    elementalAccent: 'fire',
    keywords: ['crisis', 'action', 'choice', 'momentum'],
  },
  'waxing-gibbous': {
    name: 'Waxing Gibbous',
    theme: 'Refinement, preparation, adjustment',
    timingAdvice: 'Refine and improve. Prepare for the revelation to come.',
    narrativeLens: 'The bud tightens before bloom. Perfection is not required — readiness is.',
    actionVerb: 'refine',
    shadowWarning: 'Endless adjustment is avoidance. Know when preparation becomes procrastination.',
    elementalAccent: 'air',
    keywords: ['adjustment', 'detail', 'readiness', 'patience'],
  },
  'full-moon': {
    name: 'Full Moon',
    theme: 'Culmination, revelation, release',
    timingAdvice: 'Celebrate what has grown. Release what no longer serves.',
    narrativeLens: 'The mirror is held up. What you see is what you have been becoming.',
    actionVerb: 'illuminate',
    shadowWarning: 'Intensity is not truth. The bright light casts deep shadows.',
    elementalAccent: 'water',
    keywords: ['peak', 'revelation', 'harvest', 'release'],
  },
  'waning-gibbous': {
    name: 'Waning Gibbous',
    theme: 'Gratitude, teaching, dissemination',
    timingAdvice: 'Share what you have learned. Express gratitude.',
    narrativeLens: 'The fruit falls to feed others. What you have harvested becomes seed for someone else.',
    actionVerb: 'share',
    shadowWarning: 'Giving to prove worth is not generosity. Give from fullness, not emptiness.',
    elementalAccent: 'air',
    keywords: ['gratitude', 'teaching', 'service', 'reflection'],
  },
  'last-quarter': {
    name: 'Last Quarter',
    theme: 'Letting go, forgiveness, composting',
    timingAdvice: 'Clear out the old. Make space. Forgive what cannot be fixed.',
    narrativeLens: 'The leaf knows when to let go. Trust the wisdom of release.',
    actionVerb: 'release',
    shadowWarning: 'Do not burn bridges you may need to cross again. Release with care.',
    elementalAccent: 'water',
    keywords: ['surrender', 'forgiveness', 'clearing', 'transformation'],
  },
  'waning-crescent': {
    name: 'Waning Crescent',
    theme: 'Rest, integration, dream time',
    timingAdvice: 'Rest and restore. Trust the underground process.',
    narrativeLens: 'The root grows in darkness. What appears still is deeply active.',
    actionVerb: 'restore',
    shadowWarning: 'Rest is not laziness. Do not apologise for necessary retreat.',
    elementalAccent: 'water',
    keywords: ['rest', 'dream', 'integration', 'underground'],
  },
};

/** Apply a phase lens to template text, weaving lunar timing into the narrative */
export function applyPhaseTransform(
  baseText: string,
  phaseKey: string,
  _planetName?: string
): string {
  const phase = PHASE_TRANSFORMS[phaseKey] || PHASE_TRANSFORMS['new-moon'];
  const sentences = baseText.split(/(?<=[.!?])\s+/).filter(Boolean);

  // Weave phase-specific language into the first and last sentences
  if (sentences.length >= 2) {
    const first = sentences[0];
    const last = sentences[sentences.length - 1];

    // Prefix first sentence with phase lens if it doesn't already have temporal language
    if (!first.match(/\b(now|today|currently|moment)\b/i)) {
      sentences[0] = `${phase.narrativeLens} ${first.charAt(0).toLowerCase() + first.slice(1)}`;
    }

    // Append timing advice to last sentence
    if (!last.includes(phase.timingAdvice.split('.')[0])) {
      sentences[sentences.length - 1] = `${last} ${phase.timingAdvice}`;
    }
  }

  return sentences.join(' ');
}
