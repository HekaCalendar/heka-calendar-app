/**
 * Celestial Bodies Database
 * Complete astronomical and astrological data for all bodies
 */

import type { CelestialBodyInfo } from '../types/extended';

/**
 * Complete celestial body definitions
 */
export const CELESTIAL_BODIES: Record<string, CelestialBodyInfo> = {
  sun: {
    id: 'sun',
    name: 'Sun',
    symbol: '☉',
    category: 'luminary',
    orbitPeriod: 365.25,
    orbitPeriodYears: 1,
    rulingSigns: ['leo'],
    exaltedSign: 'aries',
    detrimentSigns: ['aquarius'],
    fallSign: 'libra',
    keywords: ['ego', 'identity', 'self', 'vitality', 'life force', 'consciousness', 'will', 'creativity', 'leadership', 'father', 'authority', 'heart', 'gold', 'success', 'recognition', 'purpose', 'essence', 'soul'],
    description: 'The Sun represents the core of our being, the ego, and the conscious mind.',
    mythology: 'Associated with Apollo, Helios, and Ra - gods of light and kingship.',
    astronomical: { distanceAU: 1.0, diameterKm: 1392700 }
  },

  moon: {
    id: 'moon',
    name: 'Moon',
    symbol: '☽',
    category: 'luminary',
    orbitPeriod: 27.32,
    rulingSigns: ['cancer'],
    exaltedSign: 'taurus',
    detrimentSigns: ['capricorn'],
    fallSign: 'scorpio',
    keywords: ['emotions', 'instincts', 'needs', 'nurturing', 'mother', 'home', 'habits', 'memory', 'subconscious', 'receptivity', 'fertility', 'cycles', 'mood', 'sensitivity', 'intuition', 'body', 'fluids'],
    description: 'The Moon governs our emotional nature, instincts, and unconscious habits.',
    mythology: 'Associated with Selene, Artemis, and Hecate.',
    astronomical: { distanceAU: 0.00257, diameterKm: 3474 }
  },

  mercury: {
    id: 'mercury',
    name: 'Mercury',
    symbol: '☿',
    category: 'personal',
    orbitPeriod: 87.97,
    rulingSigns: ['gemini', 'virgo'],
    exaltedSign: 'virgo',
    detrimentSigns: ['sagittarius', 'pisces'],
    fallSign: 'pisces',
    keywords: ['mind', 'communication', 'learning', 'reasoning', 'intellect', 'speech', 'writing', 'trade', 'travel', 'siblings', 'students', 'youth', 'adaptability', 'curiosity', 'analysis', 'perception'],
    description: 'Mercury governs the mind, communication, and intellectual processes.',
    mythology: 'Messenger of the gods, associated with Hermes.',
    astronomical: { distanceAU: 0.39, diameterKm: 4879 }
  },

  venus: {
    id: 'venus',
    name: 'Venus',
    symbol: '♀',
    category: 'personal',
    orbitPeriod: 224.7,
    rulingSigns: ['taurus', 'libra'],
    exaltedSign: 'pisces',
    detrimentSigns: ['aries', 'scorpio'],
    fallSign: 'virgo',
    keywords: ['love', 'beauty', 'harmony', 'values', 'attraction', 'art', 'pleasure', 'money', 'relationships', 'aesthetics', 'diplomacy', 'comfort', 'luxury', 'femininity', 'receptivity', 'taste'],
    description: 'Venus governs love, beauty, and values.',
    mythology: 'Associated with Aphrodite and Venus.',
    astronomical: { distanceAU: 0.72, diameterKm: 12104 }
  },

  mars: {
    id: 'mars',
    name: 'Mars',
    symbol: '♂',
    category: 'personal',
    orbitPeriod: 686.98,
    orbitPeriodYears: 1.88,
    rulingSigns: ['aries', 'scorpio'],
    exaltedSign: 'capricorn',
    detrimentSigns: ['libra', 'taurus'],
    fallSign: 'cancer',
    keywords: ['action', 'drive', 'desire', 'aggression', 'courage', 'energy', 'passion', 'sexuality', 'competition', 'anger', 'initiative', 'force', 'war', 'surgery', 'iron', 'masculinity', 'assertion'],
    description: 'Mars represents drive, desire, and assertion.',
    mythology: 'God of war, associated with Ares.',
    astronomical: { distanceAU: 1.52, diameterKm: 6779 }
  },

  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    symbol: '♃',
    category: 'social',
    orbitPeriod: 4332.59,
    orbitPeriodYears: 11.86,
    rulingSigns: ['sagittarius', 'pisces'],
    exaltedSign: 'cancer',
    detrimentSigns: ['gemini', 'virgo'],
    fallSign: 'capricorn',
    keywords: ['expansion', 'growth', 'wisdom', 'luck', 'opportunity', 'abundance', 'philosophy', 'travel', 'education', 'religion', 'law', 'optimism', 'generosity', 'success', 'wealth', 'protection', 'tolerance'],
    description: 'Jupiter is the great benefic, bringing expansion, luck, and wisdom.',
    mythology: 'King of the gods, associated with Zeus.',
    astronomical: { distanceAU: 5.20, diameterKm: 139820 }
  },

  saturn: {
    id: 'saturn',
    name: 'Saturn',
    symbol: '♄',
    category: 'social',
    orbitPeriod: 10759.22,
    orbitPeriodYears: 29.46,
    rulingSigns: ['capricorn', 'aquarius'],
    exaltedSign: 'libra',
    detrimentSigns: ['cancer', 'leo'],
    fallSign: 'aries',
    keywords: ['structure', 'discipline', 'responsibility', 'limitation', 'time', 'maturity', 'authority', 'boundaries', 'fear', 'inhibition', 'karma', 'lessons', 'endurance', 'crystallization', 'separation'],
    description: 'Saturn is the great malefic, representing limitation and structure.',
    mythology: 'God of time, associated with Cronus.',
    astronomical: { distanceAU: 9.58, diameterKm: 116460 }
  },

  uranus: {
    id: 'uranus',
    name: 'Uranus',
    symbol: '♅',
    category: 'transpersonal',
    orbitPeriod: 30688.5,
    orbitPeriodYears: 84.01,
    rulingSigns: ['aquarius'],
    exaltedSign: null,
    detrimentSigns: ['leo'],
    fallSign: null,
    keywords: ['revolution', 'change', 'innovation', 'freedom', 'originality', 'sudden events', 'electricity', 'technology', 'awakening', 'unconventional', 'eccentricity', 'liberation', 'genius'],
    description: 'Uranus governs sudden change, innovation, and liberation.',
    mythology: 'Sky god, associated with Ouranos.',
    astronomical: { distanceAU: 19.22, diameterKm: 50724, discoveryYear: 1781 }
  },

  neptune: {
    id: 'neptune',
    name: 'Neptune',
    symbol: '♆',
    category: 'transpersonal',
    orbitPeriod: 60182,
    orbitPeriodYears: 164.8,
    rulingSigns: ['pisces'],
    exaltedSign: null,
    detrimentSigns: ['virgo'],
    fallSign: null,
    keywords: ['dreams', 'illusion', 'spirituality', 'transcendence', 'compassion', 'confusion', 'addiction', 'sacrifice', 'imagination', 'mysticism', 'dissolution', 'unity', 'ocean', 'intuition', 'idealism'],
    description: 'Neptune governs dreams, illusion, and transcendence.',
    mythology: 'God of the sea, associated with Poseidon.',
    astronomical: { distanceAU: 30.05, diameterKm: 49244, discoveryYear: 1846 }
  },

  pluto: {
    id: 'pluto',
    name: 'Pluto',
    symbol: '♇',
    category: 'transpersonal',
    orbitPeriod: 90560,
    orbitPeriodYears: 248,
    rulingSigns: ['scorpio'],
    exaltedSign: null,
    detrimentSigns: ['taurus'],
    fallSign: null,
    keywords: ['transformation', 'power', 'death', 'rebirth', 'depth', 'obsession', 'extremes', 'taboo', 'underworld', 'regeneration', 'evolution', 'control', 'manipulation', 'crisis', 'elimination', 'intensity'],
    description: 'Pluto governs transformation, power, and the underworld.',
    mythology: 'God of the underworld, associated with Hades.',
    astronomical: { distanceAU: 39.48, diameterKm: 2376, discoveryYear: 1930 }
  },

  chiron: {
    id: 'chiron',
    name: 'Chiron',
    symbol: '⚷',
    category: 'asteroid',
    orbitPeriod: 18440,
    orbitPeriodYears: 50.42,
    rulingSigns: ['virgo'],
    exaltedSign: null,
    detrimentSigns: ['pisces'],
    fallSign: null,
    keywords: ['wounds', 'healing', 'teaching', 'mentor', 'shaman', 'holistic', 'wounded healer', 'wisdom through pain', 'alternative medicine', 'integration', 'acceptance', 'bridge between worlds'],
    description: 'Chiron represents the wounded healer archetype.',
    mythology: 'Centaur who was a great healer and teacher.',
    astronomical: { distanceAU: 13.72, diameterKm: 206, discoveryYear: 1977 }
  },

  ceres: {
    id: 'ceres',
    name: 'Ceres',
    symbol: '⚳',
    category: 'asteroid',
    orbitPeriod: 1681,
    orbitPeriodYears: 4.6,
    rulingSigns: ['cancer', 'virgo'],
    exaltedSign: null,
    detrimentSigns: ['capricorn', 'pisces'],
    fallSign: null,
    keywords: ['nurturing', 'food', 'agriculture', 'motherhood', 'grief', 'loss', 'abundance', 'harvest', 'body issues', 'separation', 'cycles of nature', 'sustainability', 'nourishment'],
    description: 'Ceres governs nurturing, food, and the cycles of nature.',
    mythology: 'Roman goddess of agriculture, associated with Demeter.',
    astronomical: { distanceAU: 2.77, diameterKm: 946, discoveryYear: 1801 }
  },

  pallas: {
    id: 'pallas',
    name: 'Pallas Athena',
    symbol: '⚴',
    category: 'asteroid',
    orbitPeriod: 1686,
    orbitPeriodYears: 4.62,
    rulingSigns: ['libra', 'aquarius'],
    exaltedSign: null,
    detrimentSigns: ['aries', 'leo'],
    fallSign: null,
    keywords: ['wisdom', 'strategy', 'pattern recognition', 'arts', 'justice', 'father-daughter', 'creative intelligence', 'politics', 'crafts', 'mediation', 'vision', 'healing through wisdom'],
    description: 'Pallas represents wisdom, strategy, and creative intelligence.',
    mythology: 'Goddess of wisdom and warfare, associated with Athena.',
    astronomical: { distanceAU: 2.77, diameterKm: 525, discoveryYear: 1802 }
  },

  juno: {
    id: 'juno',
    name: 'Juno',
    symbol: '⚵',
    category: 'asteroid',
    orbitPeriod: 1683,
    orbitPeriodYears: 4.61,
    rulingSigns: ['libra', 'scorpio'],
    exaltedSign: null,
    detrimentSigns: ['aries', 'taurus'],
    fallSign: null,
    keywords: ['marriage', 'commitment', 'partnership', 'fidelity', 'contracts', 'equality', 'jealousy', 'power dynamics', 'soulmate', 'union'],
    description: 'Juno governs marriage, commitment, and partnership.',
    mythology: 'Queen of the gods, associated with Hera.',
    astronomical: { distanceAU: 2.67, diameterKm: 254, discoveryYear: 1804 }
  },

  vesta: {
    id: 'vesta',
    name: 'Vesta',
    symbol: '⚹',
    category: 'asteroid',
    orbitPeriod: 1325,
    orbitPeriodYears: 3.63,
    rulingSigns: ['virgo', 'scorpio'],
    exaltedSign: null,
    detrimentSigns: ['pisces', 'taurus'],
    fallSign: null,
    keywords: ['focus', 'devotion', 'sacred flame', 'dedication', 'ritual', 'sexual sacredness', 'service', 'commitment', 'purity', 'temple'],
    description: 'Vesta represents focus, devotion, and the sacred flame.',
    mythology: 'Goddess of the hearth, associated with Hestia.',
    astronomical: { distanceAU: 2.36, diameterKm: 530, discoveryYear: 1807 }
  },

  north_node: {
    id: 'north_node',
    name: 'North Node',
    symbol: '☊',
    category: 'point',
    orbitPeriod: 6793.4,
    orbitPeriodYears: 18.6,
    rulingSigns: [],
    exaltedSign: null,
    detrimentSigns: [],
    fallSign: null,
    keywords: ['karma', 'destiny', 'life purpose', 'growth', 'future', 'soul mission', 'lessons to learn', 'evolution', 'calling', 'unfamiliar', 'stretching', 'soul growth'],
    description: 'The North Node represents our karmic path forward and soul growth.',
    mythology: 'Dragons head, associated with Rahu.',
    astronomical: {}
  },

  south_node: {
    id: 'south_node',
    name: 'South Node',
    symbol: '☋',
    category: 'point',
    orbitPeriod: 6793.4,
    orbitPeriodYears: 18.6,
    rulingSigns: [],
    exaltedSign: null,
    detrimentSigns: [],
    fallSign: null,
    keywords: ['past', 'comfort zone', 'karma', 'gifts', 'familiar', 'soul history', 'release', 'letting go', 'innate talents', 'over-reliance', 'previous life', 'instinctive'],
    description: 'The South Node represents our karmic past and comfort zones.',
    mythology: 'Dragons tail, associated with Ketu.',
    astronomical: {}
  },

  lilith: {
    id: 'lilith',
    name: 'Black Moon Lilith',
    symbol: '⚸',
    category: 'point',
    orbitPeriod: 3232,
    orbitPeriodYears: 8.85,
    rulingSigns: [],
    exaltedSign: null,
    detrimentSigns: [],
    fallSign: null,
    keywords: ['wild feminine', 'repressed desires', 'sexuality', 'taboo', 'dark feminine', 'independence', 'anger', 'shadow', 'unconscious', 'raw power', 'authenticity', 'rejection'],
    description: 'Black Moon Lilith represents the wild, untamed feminine.',
    mythology: 'First wife of Adam who refused to submit.',
    astronomical: {}
  },

  vertex: {
    id: 'vertex',
    name: 'Vertex',
    symbol: 'Vx',
    category: 'point',
    orbitPeriod: 1,
    rulingSigns: [],
    exaltedSign: null,
    detrimentSigns: [],
    fallSign: null,
    keywords: ['fated encounters', 'destiny', 'significant meetings', 'turning points', 'karmic connections', 'events beyond control', 'synchronicity', 'relationship destiny', 'external events'],
    description: 'The Vertex represents fated encounters and destined events.',
    mythology: 'Not mythological but astronomical.',
    astronomical: {}
  },

  part_of_fortune: {
    id: 'part_of_fortune',
    name: 'Part of Fortune',
    symbol: '⊕',
    category: 'point',
    orbitPeriod: 1,
    rulingSigns: [],
    exaltedSign: null,
    detrimentSigns: [],
    fallSign: null,
    keywords: ['material well-being', 'prosperity', 'happiness', 'physical body', 'worldly success', 'abundance', 'health', 'joy', 'resources'],
    description: 'The Part of Fortune indicates material well-being.',
    mythology: 'Arabic Part derived from Ascendant + Moon - Sun.',
    astronomical: {}
  }
};

export function getBodyInfo(id: string): CelestialBodyInfo | undefined {
  return CELESTIAL_BODIES[id];
}

export function getBodiesByCategory(category: CelestialBodyInfo['category']): CelestialBodyInfo[] {
  return Object.values(CELESTIAL_BODIES).filter(body => body.category === category);
}

export default CELESTIAL_BODIES;
