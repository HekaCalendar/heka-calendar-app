/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TRANSIT SERVICE — The HEKA Personal Sky Interpreter
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Calculates real-time transits between the current sky and the user's
 * natal chart, then translates the strongest aspects into poetic,
 * actionable guidance for the AI coach.
 */

import { store } from '../store';
import { OracleEngine, type BirthChart } from '../oracle/oracleEngine';
import { calculateCurrentSky } from '../astrology/services/calculations/swissCalculations';
import type { AstroProfile, NatalChart } from '../types/astrology';
import { toDegree } from '../astrology/types/core';

export interface CoachTransit {
  transitingPlanet: string;
  natalPlanet: string;
  aspect: string;
  orb: number;
  strength: number;
  house: number;
  interpretation: string;
  advice: string;
  isSupportive: boolean;
  isChallenging: boolean;
}

export interface DailyTransitReading {
  transits: CoachTransit[];
  topTransit: CoachTransit | null;
  overallTone: 'flow' | 'friction' | 'mixed' | 'quiet';
  summary: string;
  hasBirthChart: boolean;
}

// ── Interpretation Library ───────────────────────────────────────────────────

const TRANSIT_INTERPRETATIONS: Record<string, Record<string, Record<string, { text: string; advice: string; tone: 'supportive' | 'challenging' | 'neutral' }>>> = {
  sun: {
    sun: {
      conjunction: { text: 'The Sun returns to its natal home. Your core self is illuminated.', advice: 'This is your annual renewal. Set intentions that honor who you are becoming.', tone: 'supportive' },
    },
    moon: {
      conjunction: { text: 'Your emotions and identity are aligned today.', advice: 'Trust your gut. Your feelings are accurate navigators right now.', tone: 'supportive' },
      opposition: { text: 'Tension between what you feel and what the world demands.', advice: 'Do not force clarity. Let contradictions coexist for now.', tone: 'challenging' },
    },
    mercury: {
      conjunction: { text: 'Your mind is bright and your words carry extra weight.', advice: 'Speak your truth, but listen twice as much as you speak.', tone: 'supportive' },
      square: { text: 'Mental friction. Thoughts may race or scatter.', advice: 'Write before speaking. Structure is your friend today.', tone: 'challenging' },
    },
    venus: {
      conjunction: { text: 'Love and beauty are amplified in your sky.', advice: 'A good day for reconciliation, art, and self-care.', tone: 'supportive' },
      square: { text: 'Values clash. What you want may conflict with what is available.', advice: 'Delay major relationship or financial decisions if possible.', tone: 'challenging' },
    },
    mars: {
      conjunction: { text: 'Your drive and willpower are supercharged.', advice: 'Channel this fire into physical action, not arguments.', tone: 'supportive' },
      opposition: { text: 'Conflict between your desires and external resistance.', advice: 'Choose your battles. Not every obstacle needs to be conquered today.', tone: 'challenging' },
      square: { text: 'Frustration is high. Energy wants an outlet.', advice: 'Move your body before making any bold moves.', tone: 'challenging' },
    },
    jupiter: {
      conjunction: { text: 'Expansion touches your sense of self. Luck favors the brave.', advice: 'Take the calculated risk. Growth is available.', tone: 'supportive' },
      trine: { text: 'Confidence flows easily. Opportunities feel natural.', advice: 'Say yes to something that scares you slightly.', tone: 'supportive' },
    },
    saturn: {
      conjunction: { text: 'A sobering moment of reckoning with your responsibilities.', advice: 'Do the hard thing first. Discipline now creates freedom later.', tone: 'challenging' },
      opposition: { text: 'The weight of the world feels personal today.', advice: 'Rest is not failure. Lower the bar if you need to.', tone: 'challenging' },
      square: { text: 'Restrictions test your patience and self-belief.', advice: 'One small completed task is worth more than a grand unfinished plan.', tone: 'challenging' },
    },
  },
  moon: {
    sun: {
      conjunction: { text: 'Your inner and outer selves are in harmony.', advice: 'Express what you usually keep hidden. Vulnerability is power today.', tone: 'supportive' },
    },
    moon: {
      conjunction: { text: 'The Moon returns home. Emotions run deep and true.', advice: 'Honor your cycles. Withdraw if you need to. Emerge when you are ready.', tone: 'supportive' },
    },
    mercury: {
      conjunction: { text: 'Heart and mind speak the same language.', advice: 'Journal, call a friend, or write the letter you have been avoiding.', tone: 'supportive' },
      square: { text: 'What you feel and what you think are in conflict.', advice: 'Do not try to logic your way out of an emotion.', tone: 'challenging' },
    },
    venus: {
      conjunction: { text: 'Emotional warmth and affection are flowing.', advice: 'Reach out to someone you love. Small gestures matter.', tone: 'supportive' },
    },
    mars: {
      conjunction: { text: 'Emotions and impulses are fused. You feel everything intensely.', advice: 'Channel intensity into creative or physical outlets.', tone: 'neutral' },
      opposition: { text: 'Frustration may bubble up unexpectedly.', advice: 'Pause before reacting. The feeling will pass faster than the consequence.', tone: 'challenging' },
    },
    saturn: {
      conjunction: { text: 'Emotional gravity is heavy. Loneliness may visit.', advice: 'Be your own caretaker today. Structure soothes the soul.', tone: 'challenging' },
    },
  },
  mercury: {
    sun: {
      conjunction: { text: 'Mental clarity and self-expression are aligned.', advice: 'Share your ideas. They land better than usual today.', tone: 'supportive' },
    },
    mercury: {
      conjunction: { text: 'Mercury returns home. Your mind is sharp.', advice: 'Learn, teach, write, negotiate. Communication is your superpower.', tone: 'supportive' },
    },
    venus: {
      conjunction: { text: 'Words flow with charm and diplomacy.', advice: 'Have the conversation you have been putting off.', tone: 'supportive' },
      square: { text: 'Misunderstandings in love or money are possible.', advice: 'Confirm before assuming. Read texts twice before sending.', tone: 'challenging' },
    },
    mars: {
      conjunction: { text: 'Quick thinking meets decisive action.', advice: 'Strike while the iron is hot, but measure twice.', tone: 'supportive' },
      opposition: { text: 'Sharp words and heated debates are in the air.', advice: 'Silence is often the stronger position.', tone: 'challenging' },
    },
    saturn: {
      conjunction: { text: 'Serious thinking. The mind craves depth over speed.', advice: 'Focus on one complex problem. Depth wins today.', tone: 'supportive' },
      square: { text: 'Mental blocks and pessimism may cloud your view.', advice: 'Do not trust every thought today. Wait for the fog to lift.', tone: 'challenging' },
    },
  },
  venus: {
    sun: {
      conjunction: { text: 'Charm and creativity radiate from you.', advice: 'Create something beautiful. Romance yourself.', tone: 'supportive' },
    },
    venus: {
      conjunction: { text: 'Venus returns home. Love and beauty bloom.', advice: 'Indulge your senses. You are worthy of pleasure.', tone: 'supportive' },
    },
    mars: {
      conjunction: { text: 'Passion and desire are intertwined.', advice: 'Pursue what you want, but respect the boundaries of others.', tone: 'neutral' },
      square: { text: 'Tension between what you want and what you can have.', advice: 'Patience is a form of self-respect today.', tone: 'challenging' },
    },
    saturn: {
      conjunction: { text: 'Love and commitment are tested by time.', advice: 'Show up consistently. That is where real value lives.', tone: 'challenging' },
      square: { text: 'Feelings of inadequacy or rejection may surface.', advice: 'Your worth is not determined by anyone else\'s attention.', tone: 'challenging' },
    },
  },
  mars: {
    sun: {
      conjunction: { text: 'Your physical energy and will are aligned.', advice: 'Tackle the hardest task. Your body wants to move.', tone: 'supportive' },
    },
    mars: {
      conjunction: { text: 'Mars returns home. Drive and courage surge.', advice: 'Start the thing. Initiation is favored.', tone: 'supportive' },
    },
    saturn: {
      conjunction: { text: 'Restrained action. Force meets structure.', advice: 'Slow and steady wins. Do not exhaust yourself.', tone: 'challenging' },
      opposition: { text: 'Blocked energy. Frustration is the signal, not the enemy.', advice: 'Work within the limits. Creativity thrives under constraint.', tone: 'challenging' },
      square: { text: 'Impatience clashes with reality.', advice: 'Break the big task into the smallest possible steps.', tone: 'challenging' },
    },
    jupiter: {
      trine: { text: 'Bold action meets fortunate timing.', advice: 'Take the initiative. The odds are in your favor.', tone: 'supportive' },
    },
  },
  jupiter: {
    sun: {
      conjunction: { text: 'Expansion and optimism touch your core.', advice: 'Dream bigger. This is a window for growth.', tone: 'supportive' },
    },
    jupiter: {
      conjunction: { text: 'Jupiter returns home. Luck and wisdom expand.', advice: 'Teach, travel, or take the leap. Fortune favors growth.', tone: 'supportive' },
    },
    saturn: {
      conjunction: { text: 'The tension between expansion and restriction peaks.', advice: 'Build systems, not fantasies. Sustainable growth only.', tone: 'challenging' },
    },
  },
  saturn: {
    sun: {
      conjunction: { text: 'Responsibility and maturity are demanded of you.', advice: 'Show up anyway. This is where character is forged.', tone: 'challenging' },
    },
    saturn: {
      conjunction: { text: 'Saturn returns home. The teacher arrives.', advice: 'Review the last cycle. What have you built that endures?', tone: 'challenging' },
    },
    moon: {
      conjunction: { text: 'Emotions feel heavy and serious.', advice: 'Do one small responsible act. It will ground you.', tone: 'challenging' },
    },
  },
};

const DEFAULT_INTERPRETATIONS: Record<string, { text: string; advice: string; tone: 'supportive' | 'challenging' | 'neutral' }> = {
  conjunction: { text: 'A powerful alignment focuses energy on this part of your life.', advice: 'Pay attention to what is being emphasized.', tone: 'neutral' },
  opposition: { text: 'A tension between two forces asks you to find balance.', advice: 'Do not choose sides. Hold the paradox.', tone: 'challenging' },
  square: { text: 'Friction creates heat. This is where growth happens.', advice: 'Move slowly and deliberately.', tone: 'challenging' },
  trine: { text: 'Energy flows with ease and grace.', advice: 'Take advantage of the smooth current.', tone: 'supportive' },
  sextile: { text: 'An opportunity presents itself quietly.', advice: 'Say yes to the unexpected invitation.', tone: 'supportive' },
};

function getInterpretation(transiting: string, natal: string, aspect: string): { text: string; advice: string; tone: 'supportive' | 'challenging' | 'neutral' } {
  const lowerT = transiting.toLowerCase();
  const lowerN = natal.toLowerCase();
  const lowerA = aspect.toLowerCase();

  const planetDict = TRANSIT_INTERPRETATIONS[lowerT];
  if (planetDict) {
    const natalDict = planetDict[lowerN];
    if (natalDict) {
      const aspectEntry = natalDict[lowerA];
      if (aspectEntry) return aspectEntry;
    }
  }

  return DEFAULT_INTERPRETATIONS[lowerA] || DEFAULT_INTERPRETATIONS.conjunction;
}

// ── Natal Chart Conversion ───────────────────────────────────────────────────

function convertNatalChartToOracleFormat(natalChart: NatalChart): BirthChart | null {
  if (!natalChart.positions || natalChart.positions.length === 0) return null;

  const findPos = (planetId: string) => {
    const pos = natalChart.positions.find((p) => p.planet === planetId);
    if (!pos) return undefined;
    const longitude = toDegree(pos.exactLongitude);
    return {
      id: pos.planet as any,
      sign: pos.sign as any,
      longitude,
      degreeInSign: pos.degree ?? 0,
      degree: pos.degree,
      isRetrograde: pos.isRetrograde,
      latitude: 0,
      distance: 1,
      speed: 0,
    } as any; // Cast to BirthChart's CelestialBody to bridge 12-sign / 13-sign differences
  };

  const chart: BirthChart = {
    sun: findPos('sun')!,
    moon: findPos('moon')!,
    mercury: findPos('mercury')!,
    venus: findPos('venus')!,
    mars: findPos('mars')!,
    jupiter: findPos('jupiter')!,
    saturn: findPos('saturn')!,
  };

  if (natalChart.ascendant) {
    const ascLongitude = toDegree(natalChart.ascendant.exactLongitude);
    chart.rising = {
      id: 'sun' as any,
      sign: natalChart.ascendant.sign as any,
      longitude: ascLongitude,
      degreeInSign: natalChart.ascendant?.degree ?? 0,
      degree: natalChart.ascendant.degree,
      isRetrograde: false,
      latitude: 0,
      distance: 1,
      speed: 0,
    } as any;
  }

  // Validate that all required planets exist
  const required = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'] as const;
  for (const p of required) {
    if (!chart[p]) return null;
  }

  return chart;
}

// ── Active Profile Resolution ────────────────────────────────────────────────

function getActiveAstroProfile(): AstroProfile | null {
  const state = store.getState();
  const profileId = state.calendar.selectedAstroProfileId;
  if (!profileId) return null;
  return state.calendar.astroProfiles.find((p) => p.id === profileId) || null;
}

// ── Transit Calculation ──────────────────────────────────────────────────────

export async function getDailyTransitReading(): Promise<DailyTransitReading> {
  const profile = getActiveAstroProfile();
  if (!profile || !profile.natalChart) {
    return {
      transits: [],
      topTransit: null,
      overallTone: 'quiet',
      summary: 'No birth chart on file. The sky still speaks, but not yet in your native tongue.',
      hasBirthChart: false,
    };
  }

  const birthChart = convertNatalChartToOracleFormat(profile.natalChart);
  if (!birthChart) {
    return {
      transits: [],
      topTransit: null,
      overallTone: 'quiet',
      summary: 'Your birth chart is incomplete. Please verify your birth data.',
      hasBirthChart: false,
    };
  }

  try {
    const { positions } = await calculateCurrentSky();
    const rawTransits = OracleEngine.calculateTransits(positions, birthChart);

    // Filter to meaningful transits (strength > 30, orb < 7°)
    const meaningful = rawTransits.filter((t) => t.strength > 30 && t.orb < 7);

    const coachTransits: CoachTransit[] = meaningful.map((t) => {
      const interp = getInterpretation(t.transitingPlanet, t.natalPlanet, t.aspect);
      return {
        transitingPlanet: t.transitingPlanet,
        natalPlanet: t.natalPlanet,
        aspect: t.aspect,
        orb: t.orb,
        strength: t.strength,
        house: t.house || 1,
        interpretation: interp.text,
        advice: interp.advice,
        isSupportive: interp.tone === 'supportive',
        isChallenging: interp.tone === 'challenging',
      };
    });

    const topTransit = coachTransits[0] || null;

    // Determine overall tone
    let overallTone: DailyTransitReading['overallTone'] = 'quiet';
    if (coachTransits.length > 0) {
      const supportiveCount = coachTransits.filter((t) => t.isSupportive).length;
      const challengingCount = coachTransits.filter((t) => t.isChallenging).length;
      if (supportiveCount > challengingCount) overallTone = 'flow';
      else if (challengingCount > supportiveCount) overallTone = 'friction';
      else overallTone = 'mixed';
    }

    // Generate summary
    let summary = '';
    if (topTransit) {
      const planetName = topTransit.transitingPlanet.charAt(0).toUpperCase() + topTransit.transitingPlanet.slice(1);
      const natalName = topTransit.natalPlanet.charAt(0).toUpperCase() + topTransit.natalPlanet.slice(1);
      const aspectVerb: Record<string, string> = {
        conjunction: 'is conjunct',
        opposition: 'opposes',
        trine: 'trines',
        square: 'squares',
        sextile: 'forms a sextile to',
      };
      const verb = aspectVerb[topTransit.aspect.toLowerCase()] || `${topTransit.aspect}s`;
      summary = `${planetName} ${verb} your natal ${natalName}. ${topTransit.interpretation}`;
    } else {
      summary = 'The sky is relatively quiet today. A good moment to focus on internal rhythm over external forces.';
    }

    return {
      transits: coachTransits,
      topTransit,
      overallTone,
      summary,
      hasBirthChart: true,
    };
  } catch (error) {
    console.error('[TransitService] Failed to calculate transits:', error);
    return {
      transits: [],
      topTransit: null,
      overallTone: 'quiet',
      summary: 'The celestial calculator is resting. Try again shortly.',
      hasBirthChart: true,
    };
  }
}

export function getTransitAdviceForTasks(reading: DailyTransitReading): string {
  if (!reading.hasBirthChart || !reading.topTransit) {
    return 'The sky is neutral. Trust your own rhythm.';
  }

  if (reading.overallTone === 'friction') {
    return 'Your personal transits suggest friction today. Favor completing what is started over beginning anew.';
  }
  if (reading.overallTone === 'flow') {
    return 'The current sky harmonizes with your natal chart. Bold action is cosmically supported.';
  }
  return 'Mixed energies in your personal sky. Start one important thing, but keep a backup plan.';
}
