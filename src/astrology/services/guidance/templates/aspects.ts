/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ASPECT TRANSFORMS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Aspects are the angles between planets — the conversations, conflicts, and
 * harmonies that create meaning from mere position. Each aspect type carries
 * a distinct energetic signature that transforms how template advice lands.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface AspectTransform {
  angle: number;
  nature: 'harmonious' | 'challenging' | 'neutral' | 'intense';
  narrativeTone: string;        // How the aspect colours the reading
  adviceModifier: string;       // How advice shifts under this aspect
  energyLevel: number;          // -5 to +5 intensity modifier
  keywords: string[];
  transitionPool: string[];     // Sentence fragments for weaving
}

export const ASPECT_TRANSFORMS: Record<string, AspectTransform> = {
  conjunction: {
    angle: 0,
    nature: 'intense',
    narrativeTone: 'The energies fuse into a single, unavoidable current. What was separate becomes one.',
    adviceModifier: 'This is not a time for moderation — commit fully or not at all.',
    energyLevel: 4,
    keywords: ['fusion', 'intensification', 'beginning', 'singularity'],
    transitionPool: [
      'The conjunction amplifies this into something undeniable.',
      'These forces are not separate — they speak with one voice.',
      'What arrives now carries the weight of both planets merged.',
      'The fusion is total. There is no escaping this current.',
    ],
  },
  sextile: {
    angle: 60,
    nature: 'harmonious',
    narrativeTone: 'Opportunity knocks softly. The path is open, but you must choose to walk it.',
    adviceModifier: 'Take the opportunity that presents itself. It will not force itself upon you.',
    energyLevel: 2,
    keywords: ['opportunity', 'cooperation', 'ease', 'invitation'],
    transitionPool: [
      'A door opens, though it does not open itself.',
      'The sextile offers a bridge — walking it is your choice.',
      'Cooperation is available now if you reach for it.',
      'The path of least resistance is also the path of greatest growth.',
    ],
  },
  square: {
    angle: 90,
    nature: 'challenging',
    narrativeTone: 'Friction generates heat. The tension is not punishment — it is the pressure that creates diamonds.',
    adviceModifier: 'Do not avoid the conflict. Move through it. The obstacle is the way.',
    energyLevel: -3,
    keywords: ['tension', 'friction', 'crisis', 'growth'],
    transitionPool: [
      'The square demands action. Inaction is the only true failure here.',
      'Friction is not malfunction — it is the mechanism of transformation.',
      'What resists you is teaching you. Listen to the obstacle.',
      'The tension between these forces is the very engine of your evolution.',
    ],
  },
  trine: {
    angle: 120,
    nature: 'harmonious',
    narrativeTone: 'Flow is effortless, which is both gift and trap. What comes easily may not be what you need.',
    adviceModifier: 'Use this flow wisely. Blessings are best when they are directed, not merely received.',
    energyLevel: 3,
    keywords: ['flow', 'talent', 'blessing', 'ease'],
    transitionPool: [
      'The current carries you. The question is whether you are steering.',
      'This trine is a gift — but gifts require stewardship.',
      'What flows naturally now is your native talent. Do not waste it.',
      'Effortless is not the same as meaningless. The easy path can be the deepest.',
    ],
  },
  opposition: {
    angle: 180,
    nature: 'challenging',
    narrativeTone: 'The mirror is held up. What you see in the other is what you have not owned in yourself.',
    adviceModifier: 'Integration, not victory. The goal is not to defeat the opposition but to hold both poles.',
    energyLevel: -2,
    keywords: ['polarity', 'balance', 'relationship', 'integration'],
    transitionPool: [
      'The opposition asks you to hold two truths at once.',
      'What appears external is merely your own reflection.',
      'Neither pole is wrong. The wisdom is in the tension between them.',
      'You are not meant to choose — you are meant to bridge.',
    ],
  },
  quincunx: {
    angle: 150,
    nature: 'neutral',
    narrativeTone: 'Adjustment is required. These energies do not speak the same language — translation is the work.',
    adviceModifier: 'Be flexible. What worked before will not work now. Adaptation is the only strategy.',
    energyLevel: 0,
    keywords: ['adjustment', 'translation', 'flexibility', 'paradox'],
    transitionPool: [
      'The quincunx demands translation between worlds that do not share a grammar.',
      'Adjustment is not compromise — it is the art of holding incompatible truths.',
      'What does not fit is not broken. It simply requires a different container.',
      'The discomfort is the signal that growth is happening in a new dimension.',
    ],
  },
  semisextile: {
    angle: 30,
    nature: 'neutral',
    narrativeTone: 'A subtle nudge, easily missed. The smallest angle can redirect the largest trajectory.',
    adviceModifier: 'Pay attention to what seems insignificant. Small shifts create large outcomes.',
    energyLevel: 1,
    keywords: ['subtle', 'nudge', 'adjustment', 'proximity'],
    transitionPool: [
      'The semisextile whispers where others shout. Listen closely.',
      'A small shift in angle creates a vast difference in destination.',
      'What seems minor is merely early. Give it time.',
    ],
  },
  semisquare: {
    angle: 45,
    nature: 'challenging',
    narrativeTone: 'Agitation without resolution. The itch that demands scratching but offers no relief.',
    adviceModifier: 'Do not act from irritation. Let the friction teach before you respond.',
    energyLevel: -1,
    keywords: ['agitation', 'irritation', 'restlessness', 'pressure'],
    transitionPool: [
      'The semisquare creates pressure without release. This is intentional.',
      'Agitation is not a signal to act — it is a signal to pay attention.',
      'What irritates you carries information you have not yet decoded.',
    ],
  },
  sesquiquadrate: {
    angle: 135,
    nature: 'challenging',
    narrativeTone: 'Uncomfortable urgency. The need to act collides with the inability to complete.',
    adviceModifier: 'Channel the drive into sustained effort. Burst energy will exhaust itself.',
    energyLevel: -2,
    keywords: ['urgency', 'drive', 'incompletion', 'obsession'],
    transitionPool: [
      'The sesquiquadrate is a engine without a transmission. You must build the gears.',
      'Urgency without direction is merely anxiety in motion. Give it a target.',
      'The drive is real. The path is not. You must create both simultaneously.',
    ],
  },
};

/** Weave an aspect transition into template narrative */
export function applyAspectTransform(
  baseText: string,
  aspectKey: string,
  planet1: string,
  planet2: string
): string {
  const aspect = ASPECT_TRANSFORMS[aspectKey] || ASPECT_TRANSFORMS['conjunction'];
  const transitions = aspect.transitionPool;
  // Deterministic selection based on planet names
  const hash = planet1.charCodeAt(0) + planet2.charCodeAt(0);
  const transition = transitions[hash % transitions.length];

  const sentences = baseText.split(/(?<=[.!?])\s+/).filter(Boolean);

  // Insert aspect transition after the second sentence (or at end if short)
  const insertIdx = Math.min(2, sentences.length - 1);
  sentences.splice(insertIdx, 0, transition);

  return sentences.join(' ');
}

/** Calculate the net energy modifier from a set of aspects */
export function calculateAspectEnergy(aspects: Array<{ type: string; orb: number }>): number {
  return aspects.reduce((sum, a) => {
    const transform = ASPECT_TRANSFORMS[a.type];
    if (!transform) return sum;
    // Tighter orbs amplify the energy
    const orbMultiplier = Math.max(0, 1 - a.orb / 8);
    return sum + transform.energyLevel * orbMultiplier;
  }, 0);
}
