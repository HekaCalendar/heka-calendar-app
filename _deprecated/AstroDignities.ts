/**
 * HEKA Planetary Dignities Engine
 * Calculates essential dignities: rulership, exaltation, detriment, fall
 * 
 * Essential dignities indicate how well a planet functions in a sign:
 * - Domicile (Rulership): Planet at home, strongest expression
 * - Exaltation: Planet honored and elevated
 * - Detriment: Planet uncomfortable, challenged
 * - Fall: Planet weakened, difficult expression
 */

import { Planet, ZodiacSign, PlanetPosition } from '../types/astrology';

// Essential Dignities - Traditional Astrology
export interface Dignity {
  type: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'triplicity' | 'term' | 'face';
  planet: Planet;
  sign: ZodiacSign;
  strength: number; // 0-5 scale
  description: string;
}

// Domiciles - Planets ruling signs
export const DOMICILES: Record<Planet, ZodiacSign[]> = {
  sun: ['leo'],
  moon: ['cancer'],
  mercury: ['gemini', 'virgo'],
  venus: ['taurus', 'libra'],
  mars: ['aries', 'scorpio'],
  jupiter: ['sagittarius', 'pisces'],
  saturn: ['capricorn', 'aquarius'],
  uranus: ['aquarius'], // Modern ruler
  neptune: ['pisces'], // Modern ruler
  pluto: ['scorpio'], // Modern ruler
  chiron: ['virgo'], // Some associations
  northNode: [],
  southNode: [],
  lilith: ['scorpio'], // Some associations
  partOfFortune: [],
  partOfSpirit: [],
  vertex: [],
  eastPoint: [],
  ceres: ['taurus', 'virgo'],
  pallas: ['libra', 'aquarius'],
  juno: ['libra'],
  vesta: ['virgo'],
  eris: ['aries'],
  sedna: ['scorpio'],
  haumea: ['cancer'],
  makemake: ['capricorn']
};

// Exaltations - Where planets are elevated
export const EXALTATIONS: Record<Planet, ZodiacSign | null> = {
  sun: 'aries',
  moon: 'taurus',
  mercury: 'virgo', // Some say also aquarius
  venus: 'pisces',
  mars: 'capricorn',
  jupiter: 'cancer',
  saturn: 'libra',
  uranus: 'scorpio', // Some associations
  neptune: 'cancer', // Some associations  
  pluto: 'leo', // Some associations
  chiron: null,
  northNode: null,
  southNode: null,
  lilith: null,
  partOfFortune: null,
  partOfSpirit: null,
  vertex: null,
  eastPoint: null,
  ceres: null,
  pallas: null,
  juno: null,
  vesta: null,
  eris: null,
  sedna: null,
  haumea: null,
  makemake: null
};

// Detriments - Opposite of domicile
export function getDetriment(planet: Planet): ZodiacSign[] {
  const domiciles = DOMICILES[planet];
  return domiciles.map(sign => {
    // Get opposite sign
    const opposites: Record<ZodiacSign, ZodiacSign> = {
      aries: 'libra', taurus: 'scorpio', gemini: 'sagittarius',
      cancer: 'capricorn', leo: 'aquarius', virgo: 'pisces',
      libra: 'aries', scorpio: 'taurus', sagittarius: 'gemini',
      capricorn: 'cancer', aquarius: 'leo', pisces: 'virgo',
      ophiuchus: 'aries' // Approximate
    };
    return opposites[sign];
  });
}

// Falls - Opposite of exaltation
export function getFall(planet: Planet): ZodiacSign | null {
  const exaltation = EXALTATIONS[planet];
  if (!exaltation) return null;
  
  const opposites: Record<ZodiacSign, ZodiacSign> = {
    aries: 'libra', taurus: 'scorpio', gemini: 'sagittarius',
    cancer: 'capricorn', leo: 'aquarius', virgo: 'pisces',
    libra: 'aries', scorpio: 'taurus', sagittarius: 'gemini',
    capricorn: 'cancer', aquarius: 'leo', pisces: 'virgo',
    ophiuchus: 'aries'
  };
  
  return opposites[exaltation];
}

// Check dignity of a planet in a sign
export function getDignity(position: PlanetPosition): Dignity | null {
  const { planet, sign } = position;
  
  // Check domicile
  if (DOMICILES[planet]?.includes(sign)) {
    return {
      type: 'domicile',
      planet,
      sign,
      strength: 5,
      description: `${capitalize(planet)} is at home in ${capitalize(sign)}. This is its strongest, most natural expression.`
    };
  }
  
  // Check exaltation
  if (EXALTATIONS[planet] === sign) {
    return {
      type: 'exaltation',
      planet,
      sign,
      strength: 4,
      description: `${capitalize(planet)} is exalted in ${capitalize(sign)}. The planet is honored and functions exceptionally well.`
    };
  }
  
  // Check detriment
  if (getDetriment(planet).includes(sign)) {
    return {
      type: 'detriment',
      planet,
      sign,
      strength: 1,
      description: `${capitalize(planet)} is in detriment in ${capitalize(sign)}. The planet is uncomfortable and must work harder to express.`
    };
  }
  
  // Check fall
  if (getFall(planet) === sign) {
    return {
      type: 'fall',
      planet,
      sign,
      strength: 0.5,
      description: `${capitalize(planet)} is in fall in ${capitalize(sign)}. The planet is weakened and its expression is challenging.`
    };
  }
  
  return null;
}

// Calculate overall planetary strength score
export function calculatePlanetaryStrength(position: PlanetPosition): {
  score: number;
  dignity: Dignity | null;
  isRetrograde: boolean;
  interpretation: string;
} {
  const dignity = getDignity(position);
  let score = dignity?.strength || 2.5; // Neutral is 2.5
  
  // Retrograde reduces strength slightly
  if (position.isRetrograde) {
    score *= 0.8;
  }
  
  // Generate interpretation
  let interpretation = '';
  if (dignity) {
    switch (dignity.type) {
      case 'domicile':
        interpretation = `Your ${position.planet} is extremely strong in ${position.sign}. Express your ${getPlanetTheme(position.planet)} with confidence.`;
        break;
      case 'exaltation':
        interpretation = `Your ${position.planet} is elevated in ${position.sign}. This area of life brings you recognition and success.`;
        break;
      case 'detriment':
        interpretation = `Your ${position.planet} is challenged in ${position.sign}. Growth comes through conscious effort in ${getPlanetTheme(position.planet)}.`;
        break;
      case 'fall':
        interpretation = `Your ${position.planet} needs gentle care in ${position.sign}. This is a sensitive area requiring patience.`;
        break;
    }
  } else {
    interpretation = `Your ${position.planet} in ${position.sign} operates with neutral strength. Conscious awareness enhances its expression.`;
  }
  
  if (position.isRetrograde) {
    interpretation += ' The retrograde indicates reviewing and revising this area internally.';
  }
  
  return {
    score: Math.round(score * 10) / 10,
    dignity,
    isRetrograde: position.isRetrograde,
    interpretation
  };
}

// Get the theme of a planet
function getPlanetTheme(planet: Planet): string {
  const themes: Record<Planet, string> = {
    sun: 'identity and purpose',
    moon: 'emotions and instincts',
    mercury: 'mind and communication',
    venus: 'love and values',
    mars: 'drive and assertion',
    jupiter: 'growth and wisdom',
    saturn: 'responsibility and mastery',
    uranus: 'innovation and freedom',
    neptune: 'spirituality and dreams',
    pluto: 'transformation and power',
    chiron: 'healing and teaching',
    northNode: 'soul growth and destiny',
    southNode: 'past life gifts and patterns',
    lilith: 'raw feminine and shadow',
    partOfFortune: 'joy and abundance',
    partOfSpirit: 'soul purpose',
    vertex: 'fated encounters',
    eastPoint: 'self-presentation',
    ceres: 'nurturing and abundance',
    pallas: 'wisdom and strategy',
    juno: 'partnership and commitment',
    vesta: 'dedication and focus',
    eris: 'truth and disruption',
    sedna: 'deep healing',
    haumea: 'creation and fertility',
    makemake: 'survival and ecology'
  };
  return themes[planet] || 'life themes';
}

// Calculate element balance
export function calculateElementBalance(positions: PlanetPosition[]): {
  fire: number;
  earth: number;
  air: number;
  water: number;
  dominant: 'fire' | 'earth' | 'air' | 'water' | 'balanced';
  interpretation: string;
} {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  
  const elementMap: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
    aries: 'fire', leo: 'fire', sagittarius: 'fire',
    taurus: 'earth', virgo: 'earth', capricorn: 'earth',
    gemini: 'air', libra: 'air', aquarius: 'air',
    cancer: 'water', scorpio: 'water', pisces: 'water',
    ophiuchus: 'water'
  };
  
  // Weight personal planets more heavily
  const weights: Record<Planet, number> = {
    sun: 3, moon: 3, mercury: 2, venus: 2, mars: 2,
    jupiter: 1.5, saturn: 1.5, uranus: 1, neptune: 1, pluto: 1,
    chiron: 0.5, northNode: 0.5, southNode: 0.5, lilith: 0.5,
    partOfFortune: 0, partOfSpirit: 0, vertex: 0, eastPoint: 0,
    ceres: 0.5, pallas: 0.5, juno: 0.5, vesta: 0.5,
    eris: 0.5, sedna: 0.5, haumea: 0.5, makemake: 0.5
  };
  
  positions.forEach(pos => {
    const element = elementMap[pos.sign];
    if (element) {
      elements[element] += weights[pos.planet] || 1;
    }
  });
  
  // Find dominant element
  const max = Math.max(...Object.values(elements));
  const entries = Object.entries(elements);
  const dominant = entries.find(([_, v]) => v === max)?.[0] as 'fire' | 'earth' | 'air' | 'water' | 'balanced';
  
  // Generate interpretation
  const interpretations: Record<string, string> = {
    fire: 'You have a fiery temperament - passionate, enthusiastic, and driven by inspiration. You need action and creative expression.',
    earth: 'You are grounded and practical - focused on tangible results and material security. You build lasting foundations.',
    air: 'You are intellectual and social - driven by ideas, communication, and connection. You thrive on mental stimulation.',
    water: 'You are emotional and intuitive - deeply feeling and sensitive to the undercurrents around you. You navigate by intuition.'
  };
  
  return {
    ...elements,
    dominant,
    interpretation: interpretations[dominant] || 'You have a balanced elemental chart, able to access all modes of being.'
  };
}

// Calculate modality balance (Cardinal, Fixed, Mutable)
export function calculateModalityBalance(positions: PlanetPosition[]): {
  cardinal: number;
  fixed: number;
  mutable: number;
  dominant: 'cardinal' | 'fixed' | 'mutable' | 'balanced';
  interpretation: string;
} {
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 };
  
  const modalityMap: Record<string, 'cardinal' | 'fixed' | 'mutable'> = {
    aries: 'cardinal', cancer: 'cardinal', libra: 'cardinal', capricorn: 'cardinal',
    taurus: 'fixed', leo: 'fixed', scorpio: 'fixed', aquarius: 'fixed',
    gemini: 'mutable', virgo: 'mutable', sagittarius: 'mutable', pisces: 'mutable',
    ophiuchus: 'fixed'
  };
  
  const weights: Record<Planet, number> = {
    sun: 3, moon: 3, mercury: 2, venus: 2, mars: 2,
    jupiter: 1.5, saturn: 1.5, uranus: 1, neptune: 1, pluto: 1,
    chiron: 0.5, northNode: 0.5, southNode: 0.5, lilith: 0.5,
    partOfFortune: 0, partOfSpirit: 0, vertex: 0, eastPoint: 0,
    ceres: 0.5, pallas: 0.5, juno: 0.5, vesta: 0.5,
    eris: 0.5, sedna: 0.5, haumea: 0.5, makemake: 0.5
  };
  
  positions.forEach(pos => {
    const modality = modalityMap[pos.sign];
    if (modality) {
      modalities[modality] += weights[pos.planet] || 1;
    }
  });
  
  const max = Math.max(...Object.values(modalities));
  const entries = Object.entries(modalities);
  const dominant = entries.find(([_, v]) => v === max)?.[0] as 'cardinal' | 'fixed' | 'mutable' | 'balanced';
  
  const interpretations: Record<string, string> = {
    cardinal: 'You are an initiator - starting projects, taking action, and leading the way. You thrive on new beginnings.',
    fixed: 'You are a stabilizer - maintaining, persevering, and seeing things through. You provide consistency and loyalty.',
    mutable: 'You are an adapter - flexible, versatile, and able to navigate change. You bridge transitions gracefully.'
  };
  
  return {
    ...modalities,
    dominant,
    interpretation: interpretations[dominant] || 'You have balanced modalities, able to initiate, maintain, and adapt as needed.'
  };
}

function capitalize(str: string | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  getDignity,
  calculatePlanetaryStrength,
  calculateElementBalance,
  calculateModalityBalance,
  DOMICILES,
  EXALTATIONS
};
