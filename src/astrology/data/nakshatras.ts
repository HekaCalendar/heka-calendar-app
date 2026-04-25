/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE 27 LUNAR MANSIONS — Astronomical Moon Houses
 *
 * These 27 divisions of the moon's path were mapped by the Babylonians,
 * the Egyptians, the Chinese, the Arabs, and every civilization that looked up.
 * They are not Indian. They are not Vedic. They are astronomical.
 *
 * Each mansion is 13°20' of sidereal longitude.
 * Each has an archetype, a gift, a totem, and a planetary ruler.
 *
 * Traditional Sanskrit names are preserved for reference but are NOT the default.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface LunarMansion {
  readonly id: number;              // 0-26
  readonly universalName: string;   // Primary display name
  readonly archetype: string;       // Psychological role
  readonly symbol: string;          // Emoji
  readonly gift: string;            // The power / ability of this mansion
  readonly totem: string;           // Animal symbol (cross-cultural)
  readonly quality: 'active' | 'passive' | 'balanced';
  readonly ruler: string;           // Planet
  readonly theme: string;           // Plain English meaning
  readonly startDegree: number;     // Sidereal longitude start
  readonly endDegree: number;       // Sidereal longitude end
  // Traditional names — available for reference, not displayed by default
  readonly sanskrit?: string;
  readonly transliteration?: string;
}

/** One quarter of a Lunar Mansion — 3°20' each */
export interface MansionQuarter {
  readonly quarter: 1 | 2 | 3 | 4;
  readonly startDegree: number;
  readonly endDegree: number;
  readonly sign: string;
}

const MANSION_DEGREE = 40 / 3; // 13°20' = 13.333... degrees
const QUARTER_DEGREE = 10 / 3; // 3°20' = 3.333... degrees

export const LUNAR_MANSIONS: readonly LunarMansion[] = [
  {
    id: 0, universalName: 'The Horse Gate', archetype: 'The Initiator',
    symbol: '🐎', gift: 'The power to reach things quickly and begin without hesitation',
    totem: 'Horse', quality: 'active', ruler: 'Ketu',
    theme: 'Speed, initiation, healing, rushing into the unknown. The first spark.',
    startDegree: 0, endDegree: MANSION_DEGREE,
    sanskrit: 'अश्विनी', transliteration: 'Ashwini',
  },
  {
    id: 1, universalName: 'The Bearer', archetype: 'The Transformer',
    symbol: '⚖️', gift: 'The power to carry burdens and transform through sacrifice',
    totem: 'Elephant', quality: 'active', ruler: 'Venus',
    theme: 'Bearing weight, justice, restraint, transformation through endurance.',
    startDegree: MANSION_DEGREE, endDegree: MANSION_DEGREE * 2,
    sanskrit: 'भरणी', transliteration: 'Bharani',
  },
  {
    id: 2, universalName: 'The Flame', archetype: 'The Purifier',
    symbol: '🔥', gift: 'The power to burn away what is false and leave only truth',
    totem: 'Sheep', quality: 'active', ruler: 'Sun',
    theme: 'Fire, purification, sharp criticism, digestion of truth. The forge.',
    startDegree: MANSION_DEGREE * 2, endDegree: MANSION_DEGREE * 3,
    sanskrit: 'कृत्तिका', transliteration: 'Krittika',
  },
  {
    id: 3, universalName: 'The Grower', archetype: 'The Nurturer',
    symbol: '🌱', gift: 'The power to make things grow and flourish under care',
    totem: 'Serpent', quality: 'active', ruler: 'Moon',
    theme: 'Growth, fertility, beauty, nourishment, steadfast patience. The garden.',
    startDegree: MANSION_DEGREE * 3, endDegree: MANSION_DEGREE * 4,
    sanskrit: 'रोहिणी', transliteration: 'Rohini',
  },
  {
    id: 4, universalName: 'The Seeker', archetype: 'The Wanderer',
    symbol: '🦌', gift: 'The power to find fulfillment through restless searching',
    totem: 'Serpent', quality: 'passive', ruler: 'Mars',
    theme: 'Curiosity, gentleness, the hunt for meaning, eternal restlessness.',
    startDegree: MANSION_DEGREE * 4, endDegree: MANSION_DEGREE * 5,
    sanskrit: 'मृगशीर्षा', transliteration: 'Mrigashira',
  },
  {
    id: 5, universalName: 'The Storm', archetype: 'The Renewer',
    symbol: '💧', gift: 'The power to destroy in order to recreate something stronger',
    totem: 'Dog', quality: 'passive', ruler: 'Rahu',
    theme: 'Intensity, tears, the diamond forged under pressure. Chaos before clarity.',
    startDegree: MANSION_DEGREE * 5, endDegree: MANSION_DEGREE * 6,
    sanskrit: 'आर्द्रा', transliteration: 'Ardra',
  },
  {
    id: 6, universalName: 'The Return', archetype: 'The Restorer',
    symbol: '☘️', gift: 'The power to return from darkness with abundance and light',
    totem: 'Cat', quality: 'balanced', ruler: 'Jupiter',
    theme: 'Return, renewal, abundance, forgiveness. The light after the storm.',
    startDegree: MANSION_DEGREE * 6, endDegree: MANSION_DEGREE * 7,
    sanskrit: 'पुनर्वसु', transliteration: 'Punarvasu',
  },
  {
    id: 7, universalName: 'The Nourisher', archetype: 'The Teacher',
    symbol: '🌸', gift: 'The power to create spiritual energy through selfless giving',
    totem: 'Sheep', quality: 'passive', ruler: 'Saturn',
    theme: 'Nourishment, teaching, flowering, the good pastor. What you feed, grows.',
    startDegree: MANSION_DEGREE * 7, endDegree: MANSION_DEGREE * 8,
    sanskrit: 'पुष्य', transliteration: 'Pushya',
  },
  {
    id: 8, universalName: 'The Serpent', archetype: 'The Secret Keeper',
    symbol: '🐍', gift: 'The power to hold and reveal hidden knowledge at the right moment',
    totem: 'Cat', quality: 'balanced', ruler: 'Mercury',
    theme: 'Entwinement, hypnosis, secrets, coiled wisdom. Not all truth is spoken.',
    startDegree: MANSION_DEGREE * 8, endDegree: MANSION_DEGREE * 9,
    sanskrit: 'आश्लेषा', transliteration: 'Ashlesha',
  },
  {
    id: 9, universalName: 'The Ancestor', archetype: 'The Royal',
    symbol: '👑', gift: 'The power to leave the body and join the lineage of those before',
    totem: 'Rat', quality: 'passive', ruler: 'Ketu',
    theme: 'Lineage, royalty, pride, connection to ancestors. The throne you inherit.',
    startDegree: MANSION_DEGREE * 9, endDegree: MANSION_DEGREE * 10,
    sanskrit: 'मघा', transliteration: 'Magha',
  },
  {
    id: 10, universalName: 'The Union', archetype: 'The Lover',
    symbol: '💞', gift: 'The power to create union and bring new life into being',
    totem: 'Rat', quality: 'passive', ruler: 'Venus',
    theme: 'Pleasure, creativity, sensual delight, the marriage bed. What joins, creates.',
    startDegree: MANSION_DEGREE * 10, endDegree: MANSION_DEGREE * 11,
    sanskrit: 'पूर्वफाल्गुनी', transliteration: 'Purva Phalguni',
  },
  {
    id: 11, universalName: 'The Contract', archetype: 'The Patron',
    symbol: '🤝', gift: 'The power to accumulate merit through enduring commitment',
    totem: 'Cow', quality: 'passive', ruler: 'Sun',
    theme: 'Contracts, kindness, integrity, patronage. What you bind yourself to, defines you.',
    startDegree: MANSION_DEGREE * 11, endDegree: MANSION_DEGREE * 12,
    sanskrit: 'उत्तरफाल्गुनी', transliteration: 'Uttara Phalguni',
  },
  {
    id: 12, universalName: 'The Hand', archetype: 'The Craftsman',
    symbol: '👐', gift: 'The power to put what you desire within your own grasp',
    totem: 'Buffalo', quality: 'balanced', ruler: 'Moon',
    theme: 'Skill, craftsmanship, dexterity, the open palm. You become what you make.',
    startDegree: MANSION_DEGREE * 12, endDegree: MANSION_DEGREE * 13,
    sanskrit: 'हस्त', transliteration: 'Hasta',
  },
  {
    id: 13, universalName: 'The Designer', archetype: 'The Shining One',
    symbol: '💎', gift: 'The power to accumulate brilliance through self-creation',
    totem: 'Tiger', quality: 'passive', ruler: 'Mars',
    theme: 'Design, brilliance, ornamentation, the lone star. You are your own architect.',
    startDegree: MANSION_DEGREE * 13, endDegree: MANSION_DEGREE * 14,
    sanskrit: 'चित्रा', transliteration: 'Chitra',
  },
  {
    id: 14, universalName: 'The Wind', archetype: 'The Independent',
    symbol: '🌬️', gift: 'The power to scatter and disperse like wind, untouched and free',
    totem: 'Buffalo', quality: 'passive', ruler: 'Rahu',
    theme: 'Independence, adaptability, travel, the sword. You cannot own the wind.',
    startDegree: MANSION_DEGREE * 14, endDegree: MANSION_DEGREE * 15,
    sanskrit: 'स्वाती', transliteration: 'Swati',
  },
  {
    id: 15, universalName: 'The Archer', archetype: 'The Ambitious',
    symbol: '🏹', gift: 'The power to achieve many fruits through single-pointed focus',
    totem: 'Tiger', quality: 'balanced', ruler: 'Jupiter',
    theme: 'Purpose, ambition, triumph, the forked path. Choose one arrow. Shoot it true.',
    startDegree: MANSION_DEGREE * 15, endDegree: MANSION_DEGREE * 16,
    sanskrit: 'विशाखा', transliteration: 'Vishakha',
  },
  {
    id: 16, universalName: 'The Friend', archetype: 'The Devoted',
    symbol: '🌉', gift: 'The power of worship and devotion to something beyond yourself',
    totem: 'Deer', quality: 'passive', ruler: 'Saturn',
    theme: 'Friendship, devotion, celebration, the arch of trust. What you bow to, lifts you.',
    startDegree: MANSION_DEGREE * 16, endDegree: MANSION_DEGREE * 17,
    sanskrit: 'अनुराधा', transliteration: 'Anuradha',
  },
  {
    id: 17, universalName: 'The Elder', archetype: 'The Protector',
    symbol: '👂', gift: 'The power to rise, conquer, and gain supremacy through listening',
    totem: 'Deer', quality: 'balanced', ruler: 'Mercury',
    theme: 'Authority, seniority, protection, the umbrella. Listen to thunder. Act with wisdom.',
    startDegree: MANSION_DEGREE * 17, endDegree: MANSION_DEGREE * 18,
    sanskrit: 'ज्येष्ठा', transliteration: 'Jyeshtha',
  },
  {
    id: 18, universalName: 'The Root', archetype: 'The Uprooter',
    symbol: '🌪️', gift: 'The power to uproot and destroy so that something true can grow',
    totem: 'Dog', quality: 'passive', ruler: 'Ketu',
    theme: 'Uprooting, investigation, depth, chaos before creation. Burn the field. Plant anew.',
    startDegree: MANSION_DEGREE * 18, endDegree: MANSION_DEGREE * 19,
    sanskrit: 'मूल', transliteration: 'Mula',
  },
  {
    id: 19, universalName: 'The Victor', archetype: 'The Invigorator',
    symbol: '🐘', gift: 'The power to invigorate and energize everything you touch',
    totem: 'Monkey', quality: 'balanced', ruler: 'Venus',
    theme: 'Victory, vitality, irrepressible optimism. The elephant does not doubt its strength.',
    startDegree: MANSION_DEGREE * 19, endDegree: MANSION_DEGREE * 20,
    sanskrit: 'पूर्वाषाढा', transliteration: 'Purva Ashadha',
  },
  {
    id: 20, universalName: 'The Universal', archetype: 'The Unconquered',
    symbol: '🦚', gift: 'The power of unchallenged victory through universal virtue',
    totem: 'Mongoose', quality: 'balanced', ruler: 'Sun',
    theme: 'Universal virtue, permanence, unyielding will. The tusk that does not break.',
    startDegree: MANSION_DEGREE * 20, endDegree: MANSION_DEGREE * 21,
    sanskrit: 'उत्तराषाढा', transliteration: 'Uttara Ashadha',
  },
  {
    id: 21, universalName: 'The Listener', archetype: 'The Student',
    symbol: '👂', gift: 'The power to connect and link through attentive listening',
    totem: 'Monkey', quality: 'passive', ruler: 'Moon',
    theme: 'Listening, learning, travel, transmission of wisdom. The ear receives what the mouth cannot.',
    startDegree: MANSION_DEGREE * 21, endDegree: MANSION_DEGREE * 22,
    sanskrit: 'श्रवण', transliteration: 'Shravana',
  },
  {
    id: 22, universalName: 'The Rhythm', archetype: 'The Abundant',
    symbol: '🥁', gift: 'The power to bestow fame and abundance through harmony',
    totem: 'Lion', quality: 'passive', ruler: 'Mars',
    theme: 'Rhythm, music, wealth, symphonic harmony. The drum that calls all to dance.',
    startDegree: MANSION_DEGREE * 22, endDegree: MANSION_DEGREE * 23,
    sanskrit: 'धनिष्ठा', transliteration: 'Dhanishta',
  },
  {
    id: 23, universalName: 'The Healer', archetype: 'The Hundred',
    symbol: '💫', gift: 'The power to heal and support through hidden knowledge',
    totem: 'Horse', quality: 'balanced', ruler: 'Rahu',
    theme: 'Healing, mystery, the void star, hidden medicine. What is empty, holds everything.',
    startDegree: MANSION_DEGREE * 23, endDegree: MANSION_DEGREE * 24,
    sanskrit: 'शतभिषा', transliteration: 'Shatabhisha',
  },
  {
    id: 24, universalName: 'The Fire Walker', archetype: 'The Extremist',
    symbol: '🔥', gift: 'The power to raise the spiritual fire through extreme commitment',
    totem: 'Lion', quality: 'balanced', ruler: 'Jupiter',
    theme: 'Penance, extremity, the funeral pyre, spiritual heat. What burns, transforms.',
    startDegree: MANSION_DEGREE * 24, endDegree: MANSION_DEGREE * 25,
    sanskrit: 'पूर्वभाद्रपदा', transliteration: 'Purva Bhadrapada',
  },
  {
    id: 25, universalName: 'The Deep', archetype: 'The Patient',
    symbol: '🐂', gift: 'The power to bring rain and prosperity from the depths',
    totem: 'Cow', quality: 'passive', ruler: 'Saturn',
    theme: 'Depth, stability, the water serpent, patience. What is deep, endures.',
    startDegree: MANSION_DEGREE * 25, endDegree: MANSION_DEGREE * 26,
    sanskrit: 'उत्तरभाद्रपदा', transliteration: 'Uttara Bhadrapada',
  },
  {
    id: 26, universalName: 'The Shepherd', archetype: 'The Nourisher',
    symbol: '🐟', gift: 'The power to nourish and protect the flock to the final boundary',
    totem: 'Elephant', quality: 'balanced', ruler: 'Mercury',
    theme: 'Nourishment, protection, abundance, the drum. The end is also the gate.',
    startDegree: MANSION_DEGREE * 26, endDegree: 360,
    sanskrit: 'रेवती', transliteration: 'Revati',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CALCULATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get the Lunar Mansion for a given sidereal longitude (0-360°)
 */
export function getLunarMansion(siderealLongitude: number): LunarMansion {
  const normalized = ((siderealLongitude % 360) + 360) % 360;
  const index = Math.min(26, Math.floor(normalized / MANSION_DEGREE));
  return LUNAR_MANSIONS[index];
}

/**
 * Get the quarter (1-4) within the Lunar Mansion
 */
export function getMansionQuarter(siderealLongitude: number): number {
  const normalized = ((siderealLongitude % 360) + 360) % 360;
  const withinMansion = normalized % MANSION_DEGREE;
  return Math.min(4, Math.floor(withinMansion / QUARTER_DEGREE) + 1);
}

/**
 * Get full Lunar Mansion info including quarter
 */
export function getMansionInfo(siderealLongitude: number): {
  mansion: LunarMansion;
  quarter: number;
  exactDegreeInMansion: number;
} {
  const normalized = ((siderealLongitude % 360) + 360) % 360;
  const mansion = getLunarMansion(normalized);
  const quarter = getMansionQuarter(normalized);
  const exactDegreeInMansion = normalized - mansion.startDegree;
  return { mansion, quarter, exactDegreeInMansion };
}

/**
 * Get the zodiac sign for a given mansion quarter
 */
export function getQuarterSign(mansionId: number, quarter: number): string {
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const signIndex = Math.floor((mansionId * 4 + (quarter - 1)) / 9) % 12;
  return signs[signIndex];
}

/**
 * Get the planetary cycle ruler from birth mansion
 * The 120-year cycle is divided among the 9 planets
 */
export function getCycleRuler(mansionId: number): string {
  const cycleOrder = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
  return cycleOrder[mansionId % 9];
}

/**
 * Cycle years for each planet in the 120-year system
 */
export const CYCLE_YEARS: Record<string, number> = {
  'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10,
  'Mars': 7, 'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17,
};

// ═══════════════════════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY ALIASES
// These let old code that says "Nakshatra" still work while we transition
// ═══════════════════════════════════════════════════════════════════════════════

/** @deprecated Use LunarMansion instead */
export type Nakshatra = LunarMansion;

/** @deprecated Use getLunarMansion instead */
export const getNakshatra = getLunarMansion;

/** @deprecated Use getMansionQuarter instead */
export const getNakshatraPada = getMansionQuarter;

/** @deprecated Use getMansionInfo instead */
export const getNakshatraInfo = getMansionInfo;

/** @deprecated Use getCycleRuler instead */
export const getDashaRuler = getCycleRuler;

/** @deprecated Use CYCLE_YEARS instead */
export const DASHA_YEARS = CYCLE_YEARS;
