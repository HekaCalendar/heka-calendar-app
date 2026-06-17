/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NATAL PROMISE GENERATOR - Soul Summary Engine
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Generates a one-paragraph soul summary based on:
 * - Sun/Moon/Ascendant combination (144 variations)
 * - Dominant element and modality
 * - Major aspect patterns
 * - Most angular planets
 * 
 * This is the "elevator pitch" of the birth chart—a poetic yet accurate
 * distillation of the soul's purpose and journey.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { NatalChart, NatalPlanet } from './natalChart';
import { getSignFromLongitude } from '../../types/core';
import { getZodiacSystemPreference } from './zodiacHelpers';

export interface NatalPromise {
  summary: string;
  coreIdentity: string;
  emotionalNeeds: string;
  approachToLife: string;
  lifeThemes: string[];
  naturalGifts: string[];
  growthChallenges: string[];
  soulPurpose: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUN/MOON/ASCENDANT COMBINATIONS (1,728 variations)
// ═══════════════════════════════════════════════════════════════════════════════
// Instead of maintaining a 10,000-line unmaintainable lookup table, we compose
// high-quality descriptions from three archetype dictionaries. This gives every
// Sun/Moon/Ascendant combination a unique, coherent reading while keeping the
// content maintainable. A small override table preserves hand-crafted entries.

const SUN_ARCHETYPES: Record<string, string> = {
  aries: 'A pure pioneer spirit, you embody raw initiative and fearless self-expression',
  taurus: 'A steadfast builder, you are grounded in sensory experience and tangible creation',
  gemini: 'A curious communicator, you endlessly explore ideas, connections, and perspectives',
  cancer: 'A nurturing heart, you seek emotional depth, security, and belonging',
  leo: 'A radiant creative force, you were born to shine, lead, and inspire',
  virgo: 'A dedicated craftsman, you are committed to refinement, service, and practical mastery',
  libra: 'A harmonizing presence, you seek balance, beauty, and meaningful partnership',
  scorpio: 'A transformative power, you are drawn to intensity, depth, and profound truth',
  sagittarius: 'An eternal explorer, you are guided by optimism, truth-seeking, and expansive vision',
  capricorn: 'An ambitious climber, you build mastery through discipline and perseverance',
  aquarius: 'A visionary innovator, you contribute unique perspectives to collective progress',
  pisces: 'A sensitive dreamer, you flow between worlds, guided by compassion and imagination',
};

const MOON_ARCHETYPES: Record<string, string> = {
  aries: 'Your emotions run hot and fast, needing immediate, honest expression and authentic response',
  taurus: 'Your inner world craves stability, comfort, and deep sensory security',
  gemini: 'Your feelings process through mental channels, needing variety and stimulating connection',
  cancer: 'Your heart seeks nurturing bonds and a profound sense of emotional home',
  leo: 'Your emotions need dramatic expression, heartfelt recognition, and creative joy',
  virgo: 'Your emotional well-being depends on practical care, order, and being useful',
  libra: 'Your inner peace requires harmonious partnership, beauty, and fair exchange',
  scorpio: 'Your feelings run deep, seeking intense intimacy and transformative bonding',
  sagittarius: 'Your emotional nature needs freedom, adventure, and philosophical meaning',
  capricorn: 'Your heart values responsible commitment, maturity, and long-term security',
  aquarius: 'Your feelings thrive on intellectual connection, friendship, and emotional space',
  pisces: 'Your emotional world dissolves boundaries, seeking spiritual union and compassion',
};

const ASCENDANT_ARCHETYPES: Record<string, string> = {
  aries: 'You meet the world with bold directness, charging headfirst into new experiences',
  taurus: 'You approach life patiently, building lasting security through steady effort',
  gemini: 'You navigate life as a curious communicator, adapting through mental agility',
  cancer: 'You present a nurturing, protective face, creating emotional havens wherever you go',
  leo: 'You enter rooms with warmth and confidence, naturally drawing others into your orbit',
  virgo: 'You approach the world with practical analysis, seeking to improve and refine',
  libra: 'You move through life gracefully, initiating connection and seeking harmony',
  scorpio: 'You meet the world with magnetic intensity, penetrating surfaces to find truth',
  sagittarius: 'You approach life as an adventure, sharing enthusiasm and seeking meaning',
  capricorn: 'You present a composed, ambitious face, climbing toward your goals methodically',
  aquarius: 'You move through life as an independent innovator, championing unique paths',
  pisces: 'You approach the world with gentle sensitivity, flowing around obstacles intuitively',
};

// Premium hand-crafted overrides for particularly resonant combinations
const SUN_MOON_ASCENDANT_OVERRIDES: Record<string, Record<string, Record<string, string>>> = {
  aries: {
    aries: {
      aries: 'A pure pioneer spirit, you embody raw initiative and fearless self-expression. Your journey is about learning courage through action.',
      taurus: 'Your fiery will meets steady determination. You build empires through persistent, pioneering effort.',
      gemini: 'A dynamic communicator, you scatter your considerable energy across many ventures. Focus is your growth edge.',
      cancer: 'Your warrior heart is softened by deep sensitivity. You fight for home, family, and emotional security.',
      leo: 'Triple fire—pure creative life force. You were born to shine, lead, and inspire through bold authenticity.',
      virgo: 'Your impulsive nature meets practical analysis. You refine your pioneering spirit through service and skill.',
      libra: 'A warrior for justice and harmony, you initiate through partnership. Balance your needs with others.',
      scorpio: 'Intense, magnetic, and transformative—you wield power through deep emotional engagement.',
      sagittarius: 'The eternal explorer, you seek truth through adventure. Your optimism fuels your initiatives.',
      capricorn: 'Ambition meets discipline. You climb mountains through sustained, courageous effort.',
      aquarius: 'A revolutionary innovator, you pioneer new collective paths. Your uniqueness is your strength.',
      pisces: 'Your assertive spirit flows through spiritual channels. You fight for the vulnerable and the dream.',
    },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ELEMENT/MODALITY SIGNATURES
// ═══════════════════════════════════════════════════════════════════════════════

const ELEMENT_MODALITY: Record<string, Record<string, string>> = {
  fire: {
    cardinal: 'You are the initiator of passion—sparking new beginnings with courage and creative force.',
    fixed: 'You sustain creative fires—maintaining inspiration and leadership through determination.',
    mutable: 'You spread enthusiasm adaptable—sharing inspiration across many paths and possibilities.',
  },
  earth: {
    cardinal: 'You initiate materially—building tangible foundations through practical action.',
    fixed: 'You sustain stability—maintaining resources and values with unwavering persistence.',
    mutable: 'You adapt practically—serving and refining through versatile, grounded effort.',
  },
  air: {
    cardinal: 'You initiate intellectually—launching ideas and connections with mental agility.',
    fixed: 'You sustain vision—holding firm to ideas and social ideals with fixed determination.',
    mutable: 'You spread knowledge—communicating and connecting across diverse networks.',
  },
  water: {
    cardinal: 'You initiate emotionally—beginning cycles of feeling and intuition with sensitivity.',
    fixed: 'You sustain depth—maintaining emotional intensity and transformative power.',
    mutable: 'You flow with feeling—adaptively understanding and dissolving into universal empathy.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN GENERATOR FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

export function generateNatalPromise(chart: NatalChart): NatalPromise {
  // Get key placements
  const sun = chart.planets.sun;
  const moon = chart.planets.moon;
  const ascendant = chart.houses?.ascendant ? 
    getSignWithZodiacSystem(chart.houses.ascendant) : 'aries';
  
  // Calculate dominant element and modality
  const dominantElement = getDominantElement(chart.elements);
  const dominantModality = getDominantModality(chart.modalities);
  
  // Find angular planets
  const angularPlanets = Object.entries(chart.planets)
    .filter(([, p]) => [1, 4, 7, 10].includes(p.house))
    .sort((a, b) => a[1].house - b[1].house);
  
  // Generate components
  const coreIdentity = generateCoreIdentity(sun, moon, ascendant, dominantElement, dominantModality);
  const emotionalNeeds = generateEmotionalNeeds(moon);
  const approachToLife = generateApproach(sun, ascendant, dominantModality);
  const lifeThemes = generateLifeThemes(chart, angularPlanets);
  const naturalGifts = generateGifts(chart, dominantElement);
  const growthChallenges = generateChallenges(chart, dominantElement);
  const soulPurpose = generateSoulPurpose(sun, dominantElement, dominantModality);
  
  // Assemble summary
  const summary = assembleSummary({
    coreIdentity,
    emotionalNeeds,
    approachToLife,
    dominantElement,
    dominantModality,
    soulPurpose,
  });
  
  return {
    summary,
    coreIdentity,
    emotionalNeeds,
    approachToLife,
    lifeThemes,
    naturalGifts,
    growthChallenges,
    soulPurpose,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getSignWithZodiacSystem(longitude: number): string {
  const use13Signs = getZodiacSystemPreference() === '13-sign';
  return getSignFromLongitude(longitude as any, use13Signs) as string;
}

function getDominantElement(elements: Record<string, number>): string {
  return Object.entries(elements)
    .sort((a, b) => b[1] - a[1])[0][0];
}

function getDominantModality(modalities: Record<string, number>): string {
  return Object.entries(modalities)
    .sort((a, b) => b[1] - a[1])[0][0];
}

function generateCoreIdentity(
  sun: NatalPlanet,
  moon: NatalPlanet,
  ascendant: string,
  dominantElement: string,
  dominantModality: string
): string {
  // Try premium hand-crafted override first
  const override = SUN_MOON_ASCENDANT_OVERRIDES[sun?.sign]?.[moon?.sign]?.[ascendant];
  if (override) return override;
  
  // Compose from archetypes for all 1,728 possible combinations
  const sunText = SUN_ARCHETYPES[sun?.sign];
  const moonText = MOON_ARCHETYPES[moon?.sign];
  const ascText = ASCENDANT_ARCHETYPES[ascendant];
  
  if (sunText && moonText && ascText) {
    return `${sunText}. ${moonText}. ${ascText}.`;
  }
  
  // Fall back to element/modality
  return ELEMENT_MODALITY[dominantElement]?.[dominantModality] || 
    'You possess a unique soul signature seeking expression.';
}

function generateEmotionalNeeds(moon: NatalPlanet): string {
  const moonSigns: Record<string, string> = {
    aries: 'immediate emotional response and authentic expression',
    taurus: 'stability, comfort, and sensory security',
    gemini: 'mental stimulation and emotional variety',
    cancer: 'deep nurturing and protective connection',
    leo: 'dramatic expression and heartfelt recognition',
    virgo: 'practical care and emotional order',
    libra: 'harmonious partnership and aesthetic peace',
    scorpio: 'intense intimacy and transformative bonding',
    sagittarius: 'emotional freedom and philosophical expansion',
    capricorn: 'responsible commitment and mature security',
    aquarius: 'intellectual connection and emotional space',
    pisces: 'spiritual union and compassionate dissolution',
  };
  
  return moonSigns[moon?.sign] || 'emotional fulfillment and security';
}

function generateApproach(_sun: NatalPlanet, _ascendant: string, modality: string): string {
  const modalityApproach: Record<string, string> = {
    cardinal: 'initiating new beginnings and taking direct action',
    fixed: 'sustaining efforts and maintaining focus',
    mutable: 'adapting to circumstances and serving multiple needs',
  };
  
  return modalityApproach[modality] || 'engaging with life authentically';
}

function generateLifeThemes(
  chart: NatalChart,
  angularPlanets: [string, NatalPlanet][]
): string[] {
  const themes: string[] = [];
  
  // Add element theme
  const dominantElement = getDominantElement(chart.elements);
  themes.push(`${dominantElement} energy and expression`);
  
  // Add angular emphasis
  angularPlanets.forEach(([, data]) => {
    const houseThemes: Record<number, string> = {
      1: 'Self-development and identity',
      4: 'Home and emotional foundations',
      7: 'Partnership and relationship',
      10: 'Career and public achievement',
    };
    if (houseThemes[data.house]) {
      themes.push(houseThemes[data.house]);
    }
  });
  
  // Add retrograde theme if multiple
  const retrogradeCount = Object.values(chart.planets).filter(p => p.isRetrograde).length;
  if (retrogradeCount >= 3) {
    themes.push('Deep internal processing and review');
  }
  
  return themes.slice(0, 4);
}

function generateGifts(_chart: NatalChart, dominantElement: string): string[] {
  const elementGifts: Record<string, string[]> = {
    fire: ['Inspiration and enthusiasm', 'Courage and initiative', 'Creative self-expression'],
    earth: ['Practical manifestation', 'Reliability and patience', 'Material mastery'],
    air: ['Intellectual clarity', 'Communication skill', 'Social connection'],
    water: ['Emotional intelligence', 'Intuitive wisdom', 'Compassionate healing'],
  };
  
  return elementGifts[dominantElement] || ['Unique personal strengths'];
}

function generateChallenges(_chart: NatalChart, dominantElement: string): string[] {
  const elementChallenges: Record<string, string[]> = {
    fire: ['Impulsiveness and burnout', 'Ego conflicts', 'Patience with process'],
    earth: ['Rigidity and resistance to change', 'Material attachment', 'Flexibility'],
    air: ['Overthinking and detachment', 'Scattered focus', 'Emotional depth'],
    water: ['Emotional overwhelm', 'Boundary dissolution', 'Practical grounding'],
  };
  
  return elementChallenges[dominantElement] || ['Personal growth edges'];
}

function generateSoulPurpose(
  _sun: NatalPlanet,
  dominantElement: string,
  dominantModality: string
): string {
  const purposes: Record<string, Record<string, string>> = {
    fire: {
      cardinal: 'To inspire and lead through courageous action',
      fixed: 'To sustain creative vision and heart-centered leadership',
      mutable: 'To spread enthusiasm and inspire diverse paths',
    },
    earth: {
      cardinal: 'To build lasting foundations and material security',
      fixed: 'To preserve values and create stable abundance',
      mutable: 'To serve practical needs with skillful adaptability',
    },
    air: {
      cardinal: 'To initiate ideas and connect minds',
      fixed: 'To uphold intellectual truths and social ideals',
      mutable: 'To disseminate knowledge and bridge perspectives',
    },
    water: {
      cardinal: 'To initiate emotional healing and intuitive guidance',
      fixed: 'To transform through deep emotional mastery',
      mutable: 'To flow universal compassion and spiritual connection',
    },
  };
  
  return purposes[dominantElement]?.[dominantModality] || 
    'To express your unique soul essence in this lifetime';
}

function assembleSummary(parts: {
  coreIdentity: string;
  emotionalNeeds: string;
  approachToLife: string;
  dominantElement: string;
  dominantModality: string;
  soulPurpose: string;
}): string {
  return `${parts.coreIdentity} Your emotional core needs ${parts.emotionalNeeds}. You approach life by ${parts.approachToLife}. ${parts.soulPurpose}.`;
}

export default generateNatalPromise;
