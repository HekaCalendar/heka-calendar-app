/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL EDUCATION SYSTEM 🎓
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Transforms raw astrological data into meaningful, personalized education.
 * Not just WHAT is happening, but WHAT IT MEANS and HOW IT AFFECTS YOU.
 * 
 * Features:
 * - Planet-in-sign interpretations
 * - Aspect psychological meanings
 * - House life-area correlations
 * - Personalized transit narratives
 * - Current celestial weather stories
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { PersonalTransit } from './birthChartIntegration';

// ═══════════════════════════════════════════════════════════════════════════════
// PLANET MEANINGS - The Actors
// ═══════════════════════════════════════════════════════════════════════════════

export interface PlanetMeaning {
  name: string;
  symbol: string;
  keywords: string[];
  governs: string[];
  psychological: string;
  mythological: string;
  inOneSentence: string;
}

export const PLANET_MEANINGS: Record<string, PlanetMeaning> = {
  sun: {
    name: 'Sun',
    symbol: '☉',
    keywords: ['identity', 'ego', 'vitality', 'purpose', 'consciousness'],
    governs: ['Self-expression', 'Creativity', 'Leadership', 'Life force'],
    psychological: 'Your core sense of self and conscious identity',
    mythological: 'The hero, the king, the divine spark within',
    inOneSentence: 'The Sun represents your essential identity and life purpose.'
  },
  moon: {
    name: 'Moon',
    symbol: '☽',
    keywords: ['emotions', 'instincts', 'nurturing', 'habits', 'subconscious'],
    governs: ['Feelings', 'Home', 'Security', 'Intuition', 'Memory'],
    psychological: 'Your emotional needs and instinctive reactions',
    mythological: 'The mother, the mirror, the tidal rhythms of feeling',
    inOneSentence: 'The Moon governs your emotional world and deepest needs.'
  },
  mercury: {
    name: 'Mercury',
    symbol: '☿',
    keywords: ['communication', 'thinking', 'learning', 'analysis', 'travel'],
    governs: ['Mind', 'Speech', 'Writing', 'Commerce', 'Transportation'],
    psychological: 'How you think, process information, and communicate',
    mythological: 'The messenger, the trickster, the bridge between worlds',
    inOneSentence: 'Mercury shapes how you think, learn, and express ideas.'
  },
  venus: {
    name: 'Venus',
    symbol: '♀',
    keywords: ['love', 'beauty', 'harmony', 'values', 'pleasure'],
    governs: ['Relationships', 'Art', 'Money', 'Aesthetics', 'Attraction'],
    psychological: 'How you give and receive love, what you find beautiful',
    mythological: 'The lover, the artist, the principle of attraction',
    inOneSentence: 'Venus reveals how you love, what you value, and your aesthetic sense.'
  },
  mars: {
    name: 'Mars',
    symbol: '♂',
    keywords: ['action', 'desire', 'aggression', 'courage', 'drive'],
    governs: ['Energy', 'Sexuality', 'Conflict', 'Ambition', 'Physical vitality'],
    psychological: 'How you assert yourself and pursue desires',
    mythological: 'The warrior, the drive to action, the survival instinct',
    inOneSentence: 'Mars fuels your drive, passion, and ability to take action.'
  },
  jupiter: {
    name: 'Jupiter',
    symbol: '♃',
    keywords: ['expansion', 'growth', 'optimism', 'wisdom', 'abundance'],
    governs: ['Luck', 'Higher learning', 'Philosophy', 'Travel', 'Growth'],
    psychological: 'Where you seek meaning and expansion in life',
    mythological: 'The king of gods, the great benefic, the principle of growth',
    inOneSentence: 'Jupiter brings expansion, opportunity, and higher meaning.'
  },
  saturn: {
    name: 'Saturn',
    symbol: '♄',
    keywords: ['structure', 'limitation', 'responsibility', 'maturity', 'time'],
    governs: ['Career', 'Authority', 'Boundaries', 'Discipline', 'Karma'],
    psychological: 'Where you face challenges and develop mastery',
    mythological: 'The teacher, the taskmaster, the lord of time',
    inOneSentence: 'Saturn teaches through challenge, building character and structure.'
  },
  uranus: {
    name: 'Uranus',
    symbol: '♅',
    keywords: ['innovation', 'rebellion', 'freedom', 'sudden change', 'genius'],
    governs: ['Technology', 'Reform', 'Independence', 'Originality', 'Awakening'],
    psychological: 'Your unique individuality and need for freedom',
    mythological: 'The sky god, the revolutionary, the great awakener',
    inOneSentence: 'Uranus brings breakthrough, innovation, and liberation.'
  },
  neptune: {
    name: 'Neptune',
    symbol: '♆',
    keywords: ['imagination', 'spirituality', 'dissolution', 'compassion', 'illusion'],
    governs: ['Dreams', 'Mysticism', 'Art', 'Addiction', 'Transcendence'],
    psychological: 'Your connection to the collective unconscious and spiritual realm',
    mythological: 'The sea god, the dissolver of boundaries, the mystical realm',
    inOneSentence: 'Neptune dissolves boundaries, connecting you to the infinite.'
  },
  pluto: {
    name: 'Pluto',
    symbol: '♇',
    keywords: ['transformation', 'power', 'death', 'rebirth', 'depth'],
    governs: ['Evolution', 'Power dynamics', 'Secrets', 'Regeneration', 'Obsession'],
    psychological: 'Where you experience deep transformation and power struggles',
    mythological: 'The underworld lord, the agent of transformation, the shadow',
    inOneSentence: 'Pluto transforms through destruction and rebirth.'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ZODIAC SIGN MEANINGS - The Costumes
// ═══════════════════════════════════════════════════════════════════════════════

export interface SignMeaning {
  name: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water' | 'ether';
  modality: 'cardinal' | 'fixed' | 'mutable';
  keywords: string[];
  expression: string;
  psychological: string;
}

export const SIGN_MEANINGS: Record<string, SignMeaning> = {
  aries: {
    name: 'Aries',
    symbol: '♈',
    element: 'fire',
    modality: 'cardinal',
    keywords: ['pioneering', 'courageous', 'impulsive', 'independent', 'competitive'],
    expression: 'boldly and directly',
    psychological: 'The need to assert individuality and take initiative'
  },
  taurus: {
    name: 'Taurus',
    symbol: '♉',
    element: 'earth',
    modality: 'fixed',
    keywords: ['stable', 'sensual', 'determined', 'practical', 'possessive'],
    expression: 'steadily and sensually',
    psychological: 'The need for security, stability, and sensual pleasure'
  },
  gemini: {
    name: 'Gemini',
    symbol: '♊',
    element: 'air',
    modality: 'mutable',
    keywords: ['curious', 'adaptable', 'communicative', 'witty', 'restless'],
    expression: 'through communication and variety',
    psychological: 'The need to gather information and make connections'
  },
  cancer: {
    name: 'Cancer',
    symbol: '♋',
    element: 'water',
    modality: 'cardinal',
    keywords: ['nurturing', 'protective', 'emotional', 'intuitive', 'moody'],
    expression: 'with emotional depth and care',
    psychological: 'The need for emotional security and belonging'
  },
  leo: {
    name: 'Leo',
    symbol: '♌',
    element: 'fire',
    modality: 'fixed',
    keywords: ['creative', 'proud', 'generous', 'dramatic', 'authoritative'],
    expression: 'with creativity and heart',
    psychological: 'The need for self-expression and recognition'
  },
  virgo: {
    name: 'Virgo',
    symbol: '♍',
    element: 'earth',
    modality: 'mutable',
    keywords: ['analytical', 'helpful', 'perfectionist', 'modest', 'practical'],
    expression: 'through analysis and service',
    psychological: 'The need for order, improvement, and usefulness'
  },
  libra: {
    name: 'Libra',
    symbol: '♎',
    element: 'air',
    modality: 'cardinal',
    keywords: ['diplomatic', 'aesthetic', 'fair-minded', 'indecisive', 'social'],
    expression: 'through relationship and beauty',
    psychological: 'The need for balance, harmony, and partnership'
  },
  scorpio: {
    name: 'Scorpio',
    symbol: '♏',
    element: 'water',
    modality: 'fixed',
    keywords: ['intense', 'passionate', 'secretive', 'transformative', 'perceptive'],
    expression: 'with intensity and depth',
    psychological: 'The need for deep emotional connection and transformation'
  },
  sagittarius: {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'fire',
    modality: 'mutable',
    keywords: ['adventurous', 'optimistic', 'philosophical', 'freedom-loving', 'blunt'],
    expression: 'through exploration and belief',
    psychological: 'The need for meaning, expansion, and freedom'
  },
  capricorn: {
    name: 'Capricorn',
    symbol: '♑',
    element: 'earth',
    modality: 'cardinal',
    keywords: ['ambitious', 'disciplined', 'practical', 'authoritative', 'cautious'],
    expression: 'with ambition and structure',
    psychological: 'The need for achievement and mastery'
  },
  aquarius: {
    name: 'Aquarius',
    symbol: '♒',
    element: 'air',
    modality: 'fixed',
    keywords: ['innovative', 'humanitarian', 'independent', 'intellectual', 'detached'],
    expression: 'through innovation and vision',
    psychological: 'The need for intellectual freedom and social progress'
  },
  pisces: {
    name: 'Pisces',
    symbol: '♓',
    element: 'water',
    modality: 'mutable',
    keywords: ['compassionate', 'artistic', 'intuitive', 'escapist', 'spiritual'],
    expression: 'with imagination and compassion',
    psychological: 'The need for transcendence and unity with the whole'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASPECT MEANINGS - The Relationships
// ═══════════════════════════════════════════════════════════════════════════════

export interface AspectMeaning {
  name: string;
  angle: number;
  nature: 'harmonious' | 'challenging' | 'neutral';
  keywords: string[];
  psychological: string;
  energy: string;
  opportunity: string;
  challenge: string;
}

export const ASPECT_MEANINGS: Record<string, AspectMeaning> = {
  conjunction: {
    name: 'Conjunction',
    angle: 0,
    nature: 'neutral',
    keywords: ['merging', 'intensification', 'new beginning', 'focus'],
    psychological: 'Two energies fuse into a combined expression',
    energy: 'Intensified, focused, concentrated',
    opportunity: 'Powerful new beginnings and concentrated energy',
    challenge: 'Lack of perspective, extreme expression'
  },
  sextile: {
    name: 'Sextile',
    angle: 60,
    nature: 'harmonious',
    keywords: ['opportunity', 'cooperation', 'ease', 'talent'],
    psychological: 'Natural flow and supportive interaction between energies',
    energy: 'Flowing, cooperative, opportunity-filled',
    opportunity: 'Easy progress and natural talents expressing',
    challenge: 'May be taken for granted, lacks urgency'
  },
  square: {
    name: 'Square',
    angle: 90,
    nature: 'challenging',
    keywords: ['tension', 'friction', 'growth', 'action required'],
    psychological: 'Internal conflict demanding resolution and growth',
    energy: 'Dynamic, tense, motivating',
    opportunity: 'Growth through challenge and constructive action',
    challenge: 'Stress, conflict, feeling blocked or frustrated'
  },
  trine: {
    name: 'Trine',
    angle: 120,
    nature: 'harmonious',
    keywords: ['harmony', 'flow', 'gifts', 'ease', 'support'],
    psychological: 'Natural harmony and effortless expression',
    energy: 'Flowing, supportive, gifted',
    opportunity: 'Natural talents and fortunate circumstances',
    challenge: 'Complacency, things come too easily'
  },
  opposition: {
    name: 'Opposition',
    angle: 180,
    nature: 'challenging',
    keywords: ['polarization', 'awareness', 'relationship', 'balance'],
    psychological: 'Awareness through contrast and relationship with others',
    energy: 'Polarized, relational, awareness-building',
    opportunity: 'Balance through awareness of complementary forces',
    challenge: 'Projection onto others, feeling torn between extremes'
  },
  quincunx: {
    name: 'Quincunx',
    angle: 150,
    nature: 'challenging',
    keywords: ['adjustment', 'awkwardness', 'health', 'sacrifice'],
    psychological: 'Awkward energy requiring adjustment and adaptation',
    energy: 'Adjusting, awkward, requiring compromise',
    opportunity: 'Growth through adaptation and letting go',
    challenge: 'Feeling disconnected, health adjustments needed'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// HOUSE MEANINGS - The Life Areas
// ═══════════════════════════════════════════════════════════════════════════════

export interface HouseMeaning {
  number: number;
  name: string;
  keywords: string[];
  lifeAreas: string[];
  question: string;
  psychological: string;
}

export const HOUSE_MEANINGS: Record<number, HouseMeaning> = {
  1: {
    number: 1,
    name: 'House of Self',
    keywords: ['identity', 'appearance', 'first impressions', 'approach to life'],
    lifeAreas: ['Physical body', 'Personal style', 'How you begin things', 'Self-image'],
    question: 'Who am I?',
    psychological: 'Your approach to life and how you present yourself to the world'
  },
  2: {
    number: 2,
    name: 'House of Values',
    keywords: ['money', 'possessions', 'self-worth', 'resources'],
    lifeAreas: ['Income', 'Material security', 'Values', 'What you own'],
    question: 'What do I have?',
    psychological: 'Your relationship with material resources and self-value'
  },
  3: {
    number: 3,
    name: 'House of Communication',
    keywords: ['communication', 'learning', 'siblings', 'local environment'],
    lifeAreas: ['Writing', 'Speaking', 'Early education', 'Neighborhood'],
    question: 'How do I think and communicate?',
    psychological: 'How you process and exchange information'
  },
  4: {
    number: 4,
    name: 'House of Home',
    keywords: ['home', 'family', 'roots', 'emotional foundation'],
    lifeAreas: ['Physical home', 'Family of origin', 'Private self', 'Security'],
    question: 'Where do I come from?',
    psychological: 'Your emotional foundation and sense of belonging'
  },
  5: {
    number: 5,
    name: 'House of Creativity',
    keywords: ['creativity', 'romance', 'children', 'pleasure', 'self-expression'],
    lifeAreas: ['Artistic expression', 'Love affairs', 'Hobbies', 'Risk-taking'],
    question: 'What brings me joy?',
    psychological: 'Your creative self-expression and capacity for joy'
  },
  6: {
    number: 6,
    name: 'House of Service',
    keywords: ['work', 'health', 'routine', 'service'],
    lifeAreas: ['Daily work', 'Health habits', 'Service to others', 'Self-care'],
    question: 'How can I be of service?',
    psychological: 'Your approach to work, health, and daily responsibilities'
  },
  7: {
    number: 7,
    name: 'House of Partnership',
    keywords: ['marriage', 'contracts', 'partnerships', 'open enemies'],
    lifeAreas: ['Committed relationships', 'Business partners', 'Legal contracts'],
    question: 'Who are my partners?',
    psychological: 'How you relate one-on-one and what you seek in others'
  },
  8: {
    number: 8,
    name: 'House of Transformation',
    keywords: ['transformation', 'shared resources', 'intimacy', 'crisis'],
    lifeAreas: ['Inheritance', 'Taxes', 'Deep intimacy', 'Psychological depths'],
    question: 'What must I release to transform?',
    psychological: 'Your relationship with power, intimacy, and transformation'
  },
  9: {
    number: 9,
    name: 'House of Philosophy',
    keywords: ['travel', 'higher learning', 'philosophy', 'meaning'],
    lifeAreas: ['Long journeys', 'University', 'Belief systems', 'Publishing'],
    question: 'What is the meaning of life?',
    psychological: 'Your search for meaning and higher truth'
  },
  10: {
    number: 10,
    name: 'House of Achievement',
    keywords: ['career', 'status', 'authority', 'public image'],
    lifeAreas: ['Profession', 'Reputation', 'Ambition', 'Authority figures'],
    question: 'What is my calling?',
    psychological: 'Your public role and contribution to society'
  },
  11: {
    number: 11,
    name: 'House of Community',
    keywords: ['friends', 'groups', 'hopes', 'humanitarian concerns'],
    lifeAreas: ['Social circles', 'Organizations', 'Future goals', 'Activism'],
    question: 'What are my hopes for the future?',
    psychological: 'Your connection to community and collective vision'
  },
  12: {
    number: 12,
    name: 'House of Spirituality',
    keywords: ['spirituality', 'unconscious', 'isolation', 'hidden enemies'],
    lifeAreas: ['Meditation', 'Dreams', 'Hidden strengths', 'Self-undoing'],
    question: 'What is beyond the visible world?',
    psychological: 'Your connection to the collective unconscious and spiritual realm'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EDUCATIONAL CONTENT GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

export interface PlanetInSignReading {
  title: string;
  meaning: string;
  psychological: string;
  practical: string;
  shadow: string;
  advice: string;
}

export function generatePlanetInSignReading(planet: string, sign: string): PlanetInSignReading {
  const planetData = PLANET_MEANINGS[planet.toLowerCase()];
  const signData = SIGN_MEANINGS[sign.toLowerCase()];
  
  if (!planetData || !signData) {
    return {
      title: `${planet} in ${sign}`,
      meaning: 'Interpretation coming soon.',
      psychological: '',
      practical: '',
      shadow: '',
      advice: ''
    };
  }
  
  const elementEmphasis = {
    fire: 'passion and inspiration',
    earth: 'practicality and stability',
    air: 'intellect and communication',
    water: 'emotion and intuition',
    ether: 'transcendence and alchemical transformation'
  };
  
  return {
    title: `${planetData.name} in ${signData.name}`,
    meaning: `${planetData.name} expresses ${signData.expression} in ${signData.name}. This brings ${planetData.keywords[0]} and ${planetData.keywords[1]} expressed through ${signData.keywords[0]} and ${signData.keywords[1]} energies.`,
    psychological: `Psychologically, this placement suggests ${planetData.psychological.toLowerCase()} is filtered through ${signData.psychological.toLowerCase()}. You may experience ${planetData.governs[0].toLowerCase()} with notable ${signData.keywords[2]}.`,
    practical: `Practically, this is a time to approach ${planetData.governs[0].toLowerCase()} and ${planetData.governs[1].toLowerCase()} with ${signData.keywords[0]} and ${signData.keywords[1]} energy.`,
    shadow: `Watch for the shadow expression: ${signData.keywords[4]} tendencies in how you pursue ${planetData.governs[0].toLowerCase()}.`,
    advice: `Work consciously with ${planetData.name}'s ${elementEmphasis[signData.element]} energy.`
  };
}

export interface AspectReading {
  title: string;
  meaning: string;
  psychological: string;
  opportunity: string;
  challenge: string;
  advice: string;
}

export function generateAspectReading(
  planet1: string, 
  planet2: string, 
  aspect: string
): AspectReading {
  const aspectData = ASPECT_MEANINGS[aspect.toLowerCase()];
  const p1 = PLANET_MEANINGS[planet1.toLowerCase()];
  const p2 = PLANET_MEANINGS[planet2.toLowerCase()];
  
  if (!aspectData || !p1 || !p2) {
    return {
      title: `${planet1} ${aspect} ${planet2}`,
      meaning: 'Interpretation coming soon.',
      psychological: '',
      opportunity: '',
      challenge: '',
      advice: ''
    };
  }
  
  return {
    title: `${p1.name} ${aspectData.name} ${p2.name}`,
    meaning: `${p1.name} (${p1.keywords[0]}, ${p1.keywords[1]}) forms a ${aspectData.angle}° ${aspectData.name.toLowerCase()} with ${p2.name} (${p2.keywords[0]}, ${p2.keywords[1]}). This creates ${aspectData.energy.toLowerCase()} energy between ${p1.governs[0].toLowerCase()} and ${p2.governs[0].toLowerCase()}.`,
    psychological: aspectData.psychological,
    opportunity: aspectData.opportunity,
    challenge: aspectData.challenge,
    advice: aspectData.nature === 'harmonious' 
      ? `Use this flowing energy to advance ${p1.governs[0].toLowerCase()} and ${p2.governs[0].toLowerCase()}.`
      : `Work consciously with the tension between ${p1.governs[0].toLowerCase()} and ${p2.governs[0].toLowerCase()} for growth.`
  };
}

export interface TransitReading {
  title: string;
  meaning: string;
  personal: string;
  timing: string;
  advice: string;
}

export function generateTransitReading(transit: PersonalTransit): TransitReading {
  const transiting = PLANET_MEANINGS[transit.transitingPlanet.toLowerCase()];
  const natal = PLANET_MEANINGS[transit.natalPlanet.toLowerCase()];
  const aspect = ASPECT_MEANINGS[transit.aspect.toLowerCase()];
  const house = HOUSE_MEANINGS[transit.activatedHouse];
  
  if (!transiting || !natal || !aspect || !house) {
    return {
      title: `${transit.transitingPlanet} ${transit.aspect} ${transit.natalPlanet}`,
      meaning: 'Interpretation coming soon.',
      personal: '',
      timing: '',
      advice: ''
    };
  }
  
  return {
    title: `${transiting.name} ${aspect.name} your Natal ${natal.name}`,
    meaning: `Transiting ${transiting.name} (${transiting.inOneSentence.toLowerCase()}) activates your natal ${natal.name} through a ${aspect.nature} ${aspect.name.toLowerCase()} aspect.`,
    personal: `This activates your ${house.name} (${house.question}), bringing ${aspect.energy.toLowerCase()} energy to matters of ${house.lifeAreas[0].toLowerCase()} and ${house.lifeAreas[1].toLowerCase()}.`,
    timing: transit.orb < 2 
      ? 'This transit is at peak intensity right now.'
      : transit.orb < 5
      ? 'This transit is building or fading in intensity.'
      : 'This transit is in early or late stages.',
    advice: aspect.nature === 'harmonious'
      ? `A favorable time for ${house.lifeAreas[0].toLowerCase()}. Take action with confidence.`
      : `Growth opportunity through ${house.lifeAreas[0].toLowerCase()}. Face challenges consciously.`
  };
}

export interface CelestialWeatherReading {
  summary: string;
  themes: string[];
  guidance: string;
  opportunities: string[];
  challenges: string[];
}

export function generateCelestialWeatherReading(
  moonPhase: string,
  moonSign: string,
  _activePlanets?: Array<{planet: string; sign: string}>
): CelestialWeatherReading {
  const moonSignData = SIGN_MEANINGS[moonSign.toLowerCase()];
  
  const phaseThemes: Record<string, string[]> = {
    'new': ['beginnings', 'planting seeds', 'setting intentions'],
    'waxing': ['building', 'growth', 'momentum'],
    'full': ['culmination', 'illumination', 'release'],
    'waning': ['completion', 'gratitude', 'letting go']
  };
  
  const themes = phaseThemes[moonPhase.toLowerCase()] || ['balance', 'flow'];
  
  return {
    summary: `The ${moonPhase} Moon in ${moonSign} creates a ${moonSignData?.element || 'dynamic'} atmosphere emphasizing ${themes.join(', ')}.`,
    themes,
    guidance: `With the Moon in ${moonSign}, emotional energy flows ${moonSignData?.expression || 'dynamically'}. This is a time for ${themes[0]} and ${themes[1]}.`,
    opportunities: [
      `Work with ${moonSignData?.element || 'current'} energy for ${themes[0]}`,
      `Focus on ${themes[1]} in your daily life`,
      'Trust your intuition'
    ],
    challenges: [
      `Avoid ${moonSignData?.keywords[4] || 'resistance'}`,
      'Don\'t rush the natural cycle'
    ]
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const CelestialEducation = {
  PLANET_MEANINGS,
  SIGN_MEANINGS,
  ASPECT_MEANINGS,
  HOUSE_MEANINGS,
  generatePlanetInSignReading,
  generateAspectReading,
  generateTransitReading,
  generateCelestialWeatherReading
};

export default CelestialEducation;
