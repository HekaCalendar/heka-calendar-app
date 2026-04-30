/**
 * HEKA Astrology System - Type Definitions
 * Gold-standard astrology integration for the 13-month HEKA calendar
 */

// Zodiac Signs (12 tropical signs + Ophiuchus as 13th)
export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'ophiuchus' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

// Planets and Points - Extended set for advanced astrology
export type Planet = 
  // Luminaries
  | 'sun' | 'moon'
  // Personal Planets
  | 'mercury' | 'venus' | 'mars'
  // Social Planets
  | 'jupiter' | 'saturn'
  // Transpersonal Planets
  | 'uranus' | 'neptune' | 'pluto'
  // Healer & Shadow
  | 'chiron' | 'lilith'
  // Lunar Nodes (Karma)
  | 'northNode' | 'southNode'
  // Arabian Parts (Fate & Fortune)
  | 'partOfFortune' | 'partOfSpirit' | 'vertex' | 'eastPoint'
  // Asteroid Goddesses
  | 'ceres' | 'pallas' | 'juno' | 'vesta'
  // Modern Dwarf Planets
  | 'eris' | 'sedna' | 'haumea' | 'makemake';

// House Numbers (1-12)
export type HouseNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

// Aspect Types
export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';

// Aspect Orb (degrees of allowance)
export interface AspectOrb {
  type: AspectType;
  angle: number;
  orb: number;
}

// Standard aspects with traditional orbs
export const STANDARD_ASPECTS: AspectOrb[] = [
  { type: 'conjunction', angle: 0, orb: 8 },
  { type: 'sextile', angle: 60, orb: 6 },
  { type: 'square', angle: 90, orb: 8 },
  { type: 'trine', angle: 120, orb: 8 },
  { type: 'opposition', angle: 180, orb: 8 },
];

// Elemental Qualities
export type Element = 'fire' | 'earth' | 'air' | 'water' | 'ether';
export type Modality = 'cardinal' | 'fixed' | 'mutable';

// Zodiac Sign Data
export interface ZodiacSignData {
  id: ZodiacSign;
  symbol: string;
  name: string;
  element: Element;
  modality: Modality;
  rulingPlanet: Planet;
  startDegree: number; // 0-360 ecliptic longitude
  endDegree: number;
  keywords: string[];
  description: string;
}

// Planet Data
export interface PlanetData {
  id: Planet;
  symbol: string;
  name: string;
  keywords: string[];
  cycleLength: number; // Days for full orbit (or synodic for moon)
  description: string;
}

// Birth Chart Position
export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  degree: number; // 0-29.99 within sign
  exactLongitude: number; // 0-360
  house?: HouseNumber;
  isRetrograde: boolean;
  speed: number; // Daily motion in degrees
}

// Natal Chart - Complete birth data
export interface NatalChart {
  id: string;
  profileId: string;
  birthDate: string; // ISO format
  birthTime: string; // HH:mm format
  birthTimeUnknown: boolean;
  timezone: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  positions: PlanetPosition[];
  ascendant: PlanetPosition | null; // Calculated from birth time
  midheaven: PlanetPosition | null; // MC
  houses?: HouseCusp[];
  aspects: Aspect[];
  calculatedAt: string;
}

// House Cusp
export interface HouseCusp {
  house: HouseNumber;
  sign: ZodiacSign;
  degree: number;
  exactLongitude: number;
}

// Aspect between two points
export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  angle: number;
  orb: number; // Exact difference from perfect aspect
  isApplying: boolean; // Getting closer or separating
}

// Daily Transit
export interface DailyTransit {
  date: string;
  moonSign: ZodiacSign;
  moonPhase: string;
  moonVoidOfCourse: boolean;
  voidStart?: string;
  voidEnd?: string;
  planetaryPositions: PlanetPosition[];
  transitsToNatal: TransitAspect[];
  powerLevel: 'low' | 'medium' | 'high' | 'very-high';
  tip: AstroTip;
}

// Transit to Natal Chart
export interface TransitAspect {
  transitingPlanet: Planet;
  natalPlanet: Planet;
  aspect: AspectType;
  orb: number;
  isApplying: boolean;
  exactDate?: string;
}

// Daily Astro Tip
export interface AstroTip {
  title: string;
  message: string;
  category: 'general' | 'love' | 'career' | 'health' | 'spiritual' | 'emotions';
  action?: string;
  timing?: string;
  powerLevel?: 'low' | 'medium' | 'high' | 'very-high';
}

// User Preferences
export type ZodiacSystem = '12-sign' | '13-sign';
export type ZodiacFrame = 'tropical' | 'sidereal';
export type SignCount = 12 | 13;
export type HouseSystem = 'placidus' | 'whole-sign' | 'equal' | 'koch';
export type AspectSet = 'major-only' | 'with-minor' | 'all';

// User Astro Profile
export interface AstroProfile {
  id: string;
  userId?: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthTimeUnknown: boolean;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  timezone: string;
  natalChart?: NatalChart;
  // User preferences
  preferences: {
    zodiacSystem: ZodiacSystem;
    zodiacFrame: ZodiacFrame;
    signCount: SignCount;
    houseSystem: HouseSystem;
    aspectSet: AspectSet;
    showArabianParts: boolean;
    showAsteroids: boolean;
    showDwarfPlanets: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// HEKA Calendar Integration
export interface HekaAstroEvent {
  date: string;
  hekaYear: number;
  hekaMonth: number;
  hekaDay: number;
  type: 'moon-phase' | 'planet-ingress' | 'retrograde-start' | 'retrograde-end' | 'aspect' | 'void-of-course';
  planet?: Planet;
  sign?: ZodiacSign;
  aspect?: AspectType;
  description: string;
  significance: 'minor' | 'moderate' | 'major';
}

// Zodiac Sign Mappings
export const ZODIAC_SIGNS: Record<ZodiacSign, ZodiacSignData> = {
  aries: {
    id: 'aries',
    symbol: '♈',
    name: 'Aries',
    element: 'fire',
    modality: 'cardinal',
    rulingPlanet: 'mars',
    startDegree: 0,
    endDegree: 30,
    keywords: ['initiative', 'courage', 'passion', 'impulse', 'leadership'],
    description: 'The pioneer of the zodiac, Aries brings fiery initiation and courageous action.',
  },
  taurus: {
    id: 'taurus',
    symbol: '♉',
    name: 'Taurus',
    element: 'earth',
    modality: 'fixed',
    rulingPlanet: 'venus',
    startDegree: 30,
    endDegree: 60,
    keywords: ['stability', 'sensuality', 'perseverance', 'material', 'patience'],
    description: 'The builder of the zodiac, Taurus brings grounded stability and earthly pleasures.',
  },
  gemini: {
    id: 'gemini',
    symbol: '♊',
    name: 'Gemini',
    element: 'air',
    modality: 'mutable',
    rulingPlanet: 'mercury',
    startDegree: 60,
    endDegree: 90,
    keywords: ['communication', 'curiosity', 'adaptability', 'wit', 'duality'],
    description: 'The messenger of the zodiac, Gemini brings mental agility and curious exploration.',
  },
  cancer: {
    id: 'cancer',
    symbol: '♋',
    name: 'Cancer',
    element: 'water',
    modality: 'cardinal',
    rulingPlanet: 'moon',
    startDegree: 90,
    endDegree: 120,
    keywords: ['nurturing', 'intuition', 'protection', 'emotion', 'home'],
    description: 'The mother of the zodiac, Cancer brings emotional depth and protective care.',
  },
  leo: {
    id: 'leo',
    symbol: '♌',
    name: 'Leo',
    element: 'fire',
    modality: 'fixed',
    rulingPlanet: 'sun',
    startDegree: 120,
    endDegree: 150,
    keywords: ['creativity', 'confidence', 'generosity', 'drama', 'leadership'],
    description: 'The sovereign of the zodiac, Leo brings radiant creativity and heart-centered leadership.',
  },
  virgo: {
    id: 'virgo',
    symbol: '♍',
    name: 'Virgo',
    element: 'earth',
    modality: 'mutable',
    rulingPlanet: 'mercury',
    startDegree: 150,
    endDegree: 180,
    keywords: ['analysis', 'service', 'purity', 'detail', 'health'],
    description: 'The artisan of the zodiac, Virgo brings meticulous analysis and humble service.',
  },
  libra: {
    id: 'libra',
    symbol: '♎',
    name: 'Libra',
    element: 'air',
    modality: 'cardinal',
    rulingPlanet: 'venus',
    startDegree: 180,
    endDegree: 210,
    keywords: ['harmony', 'beauty', 'diplomacy', 'partnership', 'balance'],
    description: 'The diplomat of the zodiac, Libra brings aesthetic appreciation and relational harmony.',
  },
  scorpio: {
    id: 'scorpio',
    symbol: '♏',
    name: 'Scorpio',
    element: 'water',
    modality: 'fixed',
    rulingPlanet: 'pluto',
    startDegree: 210,
    endDegree: 240,
    keywords: ['transformation', 'intensity', 'mystery', 'power', 'depth'],
    description: 'The alchemist of the zodiac, Scorpio brings transformative depth and penetrating insight.',
  },
  ophiuchus: {
    id: 'ophiuchus',
    symbol: '⛎',
    name: 'Ophiuchus',
    element: 'water',
    modality: 'fixed',
    rulingPlanet: 'pluto',
    startDegree: 240,
    endDegree: 270,
    keywords: ['healing', 'wisdom', 'serpent', 'alchemy', 'transmutation'],
    description: 'The Serpent Bearer bridges heaven and earth, bringing healing wisdom and alchemical transformation.',
  },
  sagittarius: {
    id: 'sagittarius',
    symbol: '♐',
    name: 'Sagittarius',
    element: 'fire',
    modality: 'mutable',
    rulingPlanet: 'jupiter',
    startDegree: 270,
    endDegree: 300,
    keywords: ['expansion', 'philosophy', 'adventure', 'truth', 'optimism'],
    description: 'The seeker of the zodiac, Sagittarius brings expansive vision and philosophical wisdom.',
  },
  capricorn: {
    id: 'capricorn',
    symbol: '♑',
    name: 'Capricorn',
    element: 'earth',
    modality: 'cardinal',
    rulingPlanet: 'saturn',
    startDegree: 300,
    endDegree: 330,
    keywords: ['ambition', 'discipline', 'authority', 'structure', 'mastery'],
    description: 'The master of the zodiac, Capricorn brings disciplined ambition and enduring legacy.',
  },
  aquarius: {
    id: 'aquarius',
    symbol: '♒',
    name: 'Aquarius',
    element: 'air',
    modality: 'fixed',
    rulingPlanet: 'uranus',
    startDegree: 330,
    endDegree: 360,
    keywords: ['innovation', 'humanitarian', 'independence', 'vision', 'reform'],
    description: 'The revolutionary of the zodiac, Aquarius brings innovative vision and collective consciousness.',
  },
  pisces: {
    id: 'pisces',
    symbol: '♓',
    name: 'Pisces',
    element: 'water',
    modality: 'mutable',
    rulingPlanet: 'neptune',
    startDegree: 330,
    endDegree: 360,
    keywords: ['compassion', 'imagination', 'spirituality', 'unity', 'dreams'],
    description: 'The mystic of the zodiac, Pisces brings boundless compassion and spiritual transcendence.',
  },
};

// Planet Data
export const PLANETS: Record<Planet, PlanetData> = {
  sun: {
    id: 'sun',
    symbol: '☉',
    name: 'Sun',
    keywords: ['identity', 'ego', 'vitality', 'consciousness', 'purpose'],
    cycleLength: 365.25,
    description: 'The core of your being, representing your essential identity and life purpose.',
  },
  moon: {
    id: 'moon',
    symbol: '☽',
    name: 'Moon',
    keywords: ['emotions', 'instincts', 'habits', 'nurturing', 'memory'],
    cycleLength: 29.53,
    description: 'Your emotional nature, subconscious patterns, and instinctual responses.',
  },
  mercury: {
    id: 'mercury',
    symbol: '☿',
    name: 'Mercury',
    keywords: ['communication', 'intellect', 'reasoning', 'travel', 'commerce'],
    cycleLength: 88,
    description: 'Your mental processes, communication style, and analytical abilities.',
  },
  venus: {
    id: 'venus',
    symbol: '♀',
    name: 'Venus',
    keywords: ['love', 'beauty', 'values', 'pleasure', 'attraction'],
    cycleLength: 225,
    description: 'How you love, what you value, and your aesthetic sensibilities.',
  },
  mars: {
    id: 'mars',
    symbol: '♂',
    name: 'Mars',
    keywords: ['action', 'desire', 'aggression', 'drive', 'courage'],
    cycleLength: 687,
    description: 'Your drive, physical energy, assertion style, and sexual nature.',
  },
  jupiter: {
    id: 'jupiter',
    symbol: '♃',
    name: 'Jupiter',
    keywords: ['expansion', 'wisdom', 'opportunity', 'abundance', 'faith'],
    cycleLength: 4333,
    description: 'Where you find growth, good fortune, and expanded understanding.',
  },
  saturn: {
    id: 'saturn',
    symbol: '♄',
    name: 'Saturn',
    keywords: ['discipline', 'structure', 'limits', 'responsibility', 'maturity'],
    cycleLength: 10759,
    description: 'Your challenges, lessons, and where you build lasting structure.',
  },
  uranus: {
    id: 'uranus',
    symbol: '♅',
    name: 'Uranus',
    keywords: ['innovation', 'rebellion', 'sudden change', 'genius', 'freedom'],
    cycleLength: 30687,
    description: 'Your unique genius, rebellion against norms, and need for freedom.',
  },
  neptune: {
    id: 'neptune',
    symbol: '♆',
    name: 'Neptune',
    keywords: ['dreams', 'illusion', 'spirituality', 'compassion', 'transcendence'],
    cycleLength: 60190,
    description: 'Your spiritual nature, imagination, and potential for transcendence.',
  },
  pluto: {
    id: 'pluto',
    symbol: '♇',
    name: 'Pluto',
    keywords: ['transformation', 'power', 'death', 'rebirth', 'shadow'],
    cycleLength: 90553,
    description: 'Your transformative power, shadow work, and capacity for regeneration.',
  },
  chiron: {
    id: 'chiron',
    symbol: '⚷',
    name: 'Chiron',
    keywords: ['wound', 'healing', 'teacher', 'mentor', 'vulnerability'],
    cycleLength: 164.8,
    description: 'Your core wound that becomes your greatest gift and teaching.',
  },
  northNode: {
    id: 'northNode',
    symbol: '☊',
    name: 'North Node',
    keywords: ['destiny', 'growth', 'purpose', 'evolution', 'karma'],
    cycleLength: 6793.4,
    description: 'Your soul\'s evolutionary path and karmic direction in this life.',
  },
  southNode: {
    id: 'southNode',
    symbol: '☋',
    name: 'South Node',
    keywords: ['past', 'comfort', 'habits', 'release', 'karma'],
    cycleLength: 6793.4,
    description: 'Your past life gifts and tendencies to release for growth.',
  },
  lilith: {
    id: 'lilith',
    symbol: '⚸',
    name: 'Black Moon Lilith',
    keywords: ['shadow', 'taboo', 'independence', 'raw feminine', 'repression'],
    cycleLength: 3232,
    description: 'Your raw, untamed nature and relationship with the shadow feminine.',
  },
  
  // Arabian Parts - Points of Fate
  partOfFortune: {
    id: 'partOfFortune',
    symbol: '⊗',
    name: 'Part of Fortune',
    keywords: ['abundance', 'joy', 'prosperity', 'flourishing', 'happiness'],
    cycleLength: 0, // Calculated point
    description: 'Where you find greatest joy and natural abundance in life.',
  },
  partOfSpirit: {
    id: 'partOfSpirit',
    symbol: '⊕',
    name: 'Part of Spirit',
    keywords: ['soul purpose', 'inner calling', 'spiritual essence', 'meaning'],
    cycleLength: 0,
    description: 'Your inner spiritual essence and what gives life deep meaning.',
  },
  vertex: {
    id: 'vertex',
    symbol: 'VX',
    name: 'Vertex',
    keywords: ['fated encounters', 'destined meetings', 'karmic connections', 'turning points'],
    cycleLength: 0,
    description: 'The point of fated encounters and destined meetings in your life.',
  },
  eastPoint: {
    id: 'eastPoint',
    symbol: 'EP',
    name: 'East Point',
    keywords: ['self-presentation', 'personal environment', 'approach to life', 'demeanor'],
    cycleLength: 0,
    description: 'How you present yourself to the world and your personal environment.',
  },
  
  // Asteroid Goddesses
  ceres: {
    id: 'ceres',
    symbol: '⚳',
    name: 'Ceres',
    keywords: ['nurturing', 'motherhood', 'harvest', 'abundance', 'grief'],
    cycleLength: 1681,
    description: 'The Great Mother. How you nurture others and yourself. Connection to cycles of loss and return.',
  },
  pallas: {
    id: 'pallas',
    symbol: '⚴',
    name: 'Pallas Athena',
    keywords: ['wisdom', 'strategy', 'creative intelligence', 'justice', 'patterns'],
    cycleLength: 1686,
    description: 'Divine wisdom and creative intelligence. Pattern recognition and strategic thinking.',
  },
  juno: {
    id: 'juno',
    symbol: '⚵',
    name: 'Juno',
    keywords: ['marriage', 'commitment', 'partnership', 'loyalty', 'sacred union'],
    cycleLength: 1685,
    description: 'The Sacred Partner. Your approach to committed relationships and marriage.',
  },
  vesta: {
    id: 'vesta',
    symbol: '⚶',
    name: 'Vesta',
    keywords: ['dedication', 'focus', 'sacred flame', 'devotion', 'self-containment'],
    cycleLength: 1325,
    description: 'The Keeper of the Flame. What you hold sacred and dedicate yourself to.',
  },
  
  // Modern Dwarf Planets
  eris: {
    id: 'eris',
    symbol: '⯫',
    name: 'Eris',
    keywords: ['discord', 'truth', 'revelation', 'shadow feminine', 'disruption'],
    cycleLength: 204870,
    description: 'The revealer of uncomfortable truths. Brings discord that leads to necessary change.',
  },
  sedna: {
    id: 'sedna',
    symbol: '⯜',
    name: 'Sedna',
    keywords: ['deep healing', 'oceanic consciousness', 'betrayal', 'transcendence', 'isolation'],
    cycleLength: 4154000,
    description: 'Goddess of the frozen deep. Profound healing through facing deepest wounds.',
  },
  haumea: {
    id: 'haumea',
    symbol: '⯚',
    name: 'Haumea',
    keywords: ['fertility', 'creation', 'birth', 'multiple forms', 'manifestation'],
    cycleLength: 103774,
    description: 'Hawaiian goddess of childbirth. Creative fertility and bringing form from chaos.',
  },
  makemake: {
    id: 'makemake',
    symbol: '⯛',
    name: 'Makemake',
    keywords: ['survival', 'resourcefulness', 'adaptation', 'ecology', 'interconnectedness'],
    cycleLength: 111851,
    description: 'Creator deity of Easter Island. Resourcefulness and connection to natural cycles.',
  },
};

// NOTE: getSignFromLongitude, getDegreeInSign, formatPosition, and formatAspect
// have been removed from this file. Use the boundary-aware versions from
// src/astrology/types/core.ts instead.
