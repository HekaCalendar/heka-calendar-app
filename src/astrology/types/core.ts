/**
 * Core Astrology Types
 * Strict, immutable, self-documenting type definitions
 */

// Branded types for type safety
export type Degree = number & { readonly __brand: 'Degree' };
export type ZodiacDegree = number & { readonly __brand: 'ZodiacDegree' }; // 0-29.999...
export type JulianDay = number & { readonly __brand: 'JulianDay' };
export type Timestamp = number & { readonly __brand: 'Timestamp' };

// Validation helpers
export function toDegree(n: number): Degree {
  if (isNaN(n) || !isFinite(n)) {
    throw new Error(`Invalid degree: ${n}`);
  }
  return n as Degree;
}

export function normalizeDegree(deg: number): Degree {
  let normalized = deg % 360;
  if (normalized < 0) normalized += 360;
  return normalized as Degree;
}

export function toZodiacDegree(longitude: Degree): ZodiacDegree {
  const deg = longitude % 30;
  return (deg < 0 ? deg + 30 : deg) as ZodiacDegree;
}

/** Calculate degree within sign, respecting irregular 13-sign boundaries */
export function getDegreeInSign(longitude: Degree, use13Signs: boolean = false): ZodiacDegree {
  const normalized = ((longitude % 360) + 360) % 360;
  if (use13Signs) {
    const sign = getSignFromLongitude(longitude, true) as ZodiacSign13;
    const boundary = SIGN_BOUNDARIES_13[sign];
    if (boundary) {
      return (normalized - boundary[0]) as ZodiacDegree;
    }
  }
  const deg = normalized % 30;
  return (deg < 0 ? deg + 30 : deg) as ZodiacDegree;
}

// Celestial Bodies
export const PLANET_IDS = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
  'chiron', 'north_node', 'south_node', 'lilith'
] as const;

export type PlanetId = typeof PLANET_IDS[number];

export const PLANET_NAMES: Record<PlanetId, string> = {
  sun: 'Sun',
  moon: 'Moon',
  mercury: 'Mercury',
  venus: 'Venus',
  mars: 'Mars',
  jupiter: 'Jupiter',
  saturn: 'Saturn',
  uranus: 'Uranus',
  neptune: 'Neptune',
  pluto: 'Pluto',
  chiron: 'Chiron',
  north_node: 'North Node',
  south_node: 'South Node',
  lilith: 'Lilith',
};

export interface CelestialBody {
  readonly id: PlanetId;
  readonly longitude: Degree;        // 0-360 ecliptic longitude
  readonly latitude: number;         // -90 to 90 ecliptic latitude
  readonly distance: number;         // AU
  readonly speed: number;            // degrees per day
  readonly isRetrograde: boolean;
  readonly sign: ZodiacSign | ZodiacSign13;
  readonly degreeInSign: ZodiacDegree;
}

// Zodiac - 12 Sign Traditional
export const ZODIAC_SIGNS_12 = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
] as const;

// Zodiac - 13 Sign (Including Ophiuchus)
export const ZODIAC_SIGNS_13 = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'ophiuchus', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS_12[number];
export type ZodiacSign13 = typeof ZODIAC_SIGNS_13[number];

// Sign symbols for both systems
export const SIGN_SYMBOLS: Record<ZodiacSign, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

export const SIGN_SYMBOLS_13: Record<ZodiacSign13, string> = {
  ...SIGN_SYMBOLS,
  ophiuchus: '⛎', // Serpent bearer symbol
};

// 12-Sign Elements
export const SIGN_ELEMENTS: Record<ZodiacSign, Element> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

// 13-Sign Elements (Ophiuchus is often considered a fire or water sign)
export const SIGN_ELEMENTS_13: Record<ZodiacSign13, Element> = {
  ...SIGN_ELEMENTS,
  ophiuchus: 'water', // Associated with healing and transformation
};

// 12-Sign Modalities
export const SIGN_MODALITIES: Record<ZodiacSign, Modality> = {
  aries: 'cardinal', cancer: 'cardinal', libra: 'cardinal', capricorn: 'cardinal',
  taurus: 'fixed', leo: 'fixed', scorpio: 'fixed', aquarius: 'fixed',
  gemini: 'mutable', virgo: 'mutable', sagittarius: 'mutable', pisces: 'mutable',
};

// 13-Sign Modalities
export const SIGN_MODALITIES_13: Record<ZodiacSign13, Modality> = {
  ...SIGN_MODALITIES,
  ophiuchus: 'fixed', // Serpent bearer is steady, transformative
};

// 12-Sign Rulers
export const SIGN_RULERS: Record<ZodiacSign, PlanetId> = {
  aries: 'mars', taurus: 'venus', gemini: 'mercury', cancer: 'moon',
  leo: 'sun', virgo: 'mercury', libra: 'venus', scorpio: 'pluto',
  sagittarius: 'jupiter', capricorn: 'saturn', aquarius: 'uranus', pisces: 'neptune',
};

// 13-Sign Rulers (Ophiuchus is associated with healing - Chiron or Mercury)
export const SIGN_RULERS_13: Record<ZodiacSign13, PlanetId> = {
  ...SIGN_RULERS,
  ophiuchus: 'chiron', // Wounded healer, medicine
};

// 13-Sign dates (sidereal-based, approximate)
export const SIGN_DATES_13: Record<ZodiacSign13, { start: string; end: string }> = {
  aries: { start: '04-18', end: '05-13' },
  taurus: { start: '05-14', end: '06-19' },
  gemini: { start: '06-20', end: '07-20' },
  cancer: { start: '07-21', end: '08-09' },
  leo: { start: '08-10', end: '09-15' },
  virgo: { start: '09-16', end: '10-30' },
  libra: { start: '10-31', end: '11-22' },
  scorpio: { start: '11-23', end: '11-29' },
  ophiuchus: { start: '11-30', end: '12-17' },
  sagittarius: { start: '12-18', end: '01-18' },
  capricorn: { start: '01-19', end: '02-15' },
  aquarius: { start: '02-16', end: '03-11' },
  pisces: { start: '03-12', end: '04-17' },
};

// IAU constellation boundaries projected onto the ecliptic, calibrated to match
// actual solar ingress dates (SIGN_DATES_13). Accounts for elliptical orbit speed
// variation so degree boundaries align with observed dates, not raw geometric projection.
export const SIGN_BOUNDARIES_13: Record<ZodiacSign13, [number, number]> = {
  aries: [0, 28],          // Apr 18 - May 13
  taurus: [28, 65],        // May 14 - Jun 19
  gemini: [65, 94],        // Jun 20 - Jul 20
  cancer: [94, 114],       // Jul 21 - Aug 9
  leo: [114, 150],         // Aug 10 - Sep 15
  virgo: [150, 193],       // Sep 16 - Oct 30
  libra: [193, 217],       // Oct 31 - Nov 22
  scorpio: [217, 223],     // Nov 23 - Nov 29
  ophiuchus: [223, 242],   // Nov 30 - Dec 17
  sagittarius: [242, 275], // Dec 18 - Jan 18
  capricorn: [275, 303],   // Jan 19 - Feb 15
  aquarius: [303, 327],    // Feb 16 - Mar 11
  pisces: [327, 360],      // Mar 12 - Apr 17
};

// Helper function to get sign from longitude (supports both systems)
export function getSignFromLongitude(
  longitude: Degree, 
  use13Signs: boolean = false
): ZodiacSign | ZodiacSign13 {
  const normalized = ((longitude % 360) + 360) % 360;
  
  if (use13Signs) {
    // Use actual constellation boundaries (irregular sizes)
    for (const [sign, [start, end]] of Object.entries(SIGN_BOUNDARIES_13)) {
      if (normalized >= start && normalized < end) {
        return sign as ZodiacSign13;
      }
    }
    return 'pisces'; // fallback
  }
  
  // 12-sign zodiac uses 30 degrees per sign
  const signIndex = Math.floor(normalized / 30);
  return ZODIAC_SIGNS_12[signIndex] ?? 'aries';
}

export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';

export const ELEMENTS = ['fire', 'earth', 'air', 'water'] as const;
export const MODALITIES = ['cardinal', 'fixed', 'mutable'] as const;

// House Systems
export const HOUSE_SYSTEMS = [
  'placidus', 'koch', 'equal', 'whole-sign', 'campanus',
  'regiomontanus', 'porphyry', 'morinus'
] as const;

export type HouseSystemType = typeof HOUSE_SYSTEMS[number];

// ═══════════════════════════════════════════════════════════════════════════════
// ZODIAC SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// ZODIAC FRAMEWORK (v3 — frame + signCount, replaces conflated ZodiacSystemType)
// ═══════════════════════════════════════════════════════════════════════════════

/** Tropical = aligned to seasons (vernal equinox = 0° Aries)
 *  Sidereal  = aligned to fixed stars (requires ayanamsa)
 */
export const ZODIAC_FRAMES = ['tropical', 'sidereal'] as const;
export type ZodiacFrame = typeof ZODIAC_FRAMES[number];

/** 12 signs = traditional 30° sectors
 *  13 signs = includes Ophiuchus with IAU constellation boundaries
 */
export const SIGN_COUNTS = [12, 13] as const;
export type SignCount = typeof SIGN_COUNTS[number];

// ── Legacy conflated enum (kept for backward-compat migration) ──
export const ZODIAC_SYSTEMS = [
  '12-sign',   // Tropical — seasons, 30° each
  '13-sign',   // Astronomical — IAU constellation boundaries
  'sidereal',  // Star-based — actual constellation positions with ayanamsa
] as const;

export type ZodiacSystemType = typeof ZODIAC_SYSTEMS[number];

/** Migrate old conflated enum to new split fields.
 *  Mapping:
 *    '12-sign'  → { frame: 'tropical',  signCount: 12 }
 *    '13-sign'  → { frame: 'tropical',  signCount: 13 }  // historically allowed, now invalid
 *    'sidereal' → { frame: 'sidereal',  signCount: 12 }  // safest default for existing users
 */
export function migrateZodiacSystem(old: ZodiacSystemType): { frame: ZodiacFrame; signCount: SignCount } {
  switch (old) {
    case '12-sign':  return { frame: 'tropical', signCount: 12 };
    case '13-sign':  return { frame: 'tropical', signCount: 13 };
    case 'sidereal': return { frame: 'sidereal', signCount: 12 };
    default:         return { frame: 'tropical', signCount: 12 };
  }
}

/** Inverse: derive legacy string from split fields (for APIs still expecting it) */
export function legacyZodiacSystem(frame: ZodiacFrame, signCount: SignCount): ZodiacSystemType {
  if (frame === 'sidereal') return 'sidereal';
  return signCount === 13 ? '13-sign' : '12-sign';
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAKSHATRA SYSTEMS
// ═══════════════════════════════════════════════════════════════════════════════

export const NAKSHATRA_SYSTEMS = [
  'none',
  'vedic-27',   // Traditional 27 lunar mansions
  'vedic-28',   // Including Abhijit
] as const;

export type NakshatraSystemType = typeof NAKSHATRA_SYSTEMS[number];

export interface HouseCusp {
  readonly number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  readonly longitude: Degree;
  readonly sign: ZodiacSign;
  readonly degreeInSign: ZodiacDegree;
}

export interface HouseSystem {
  readonly type: HouseSystemType;
  readonly cusps: HouseCusp[];
  readonly ascendant: Degree;
  readonly mc: Degree;           // Midheaven / Medium Coeli
  readonly ic: Degree;           // Imum Coeli
  readonly dsc: Degree;          // Descendant
}

// Aspects
export const ASPECT_TYPES = [
  'conjunction',   // 0°
  'semisextile',   // 30°
  'semisquare',    // 45°
  'sextile',       // 60°
  'quintile',      // 72°
  'square',        // 90°
  'trine',         // 120°
  'sesquiquadrate',// 135°
  'biquintile',    // 144°
  'quincunx',      // 150°
  'opposition',    // 180°
] as const;

export type AspectType = typeof ASPECT_TYPES[number];

export interface Aspect {
  readonly type: AspectType;
  readonly body1: PlanetId;
  readonly body2: PlanetId;
  readonly angle: Degree;          // actual angle between bodies
  readonly orb: number;            // degrees from exact
  readonly applying: boolean;      // getting closer or separating
  readonly isExact?: boolean;      // within 0.1 degrees
}

// Aspect angles in degrees
export const ASPECT_ANGLES: Record<AspectType, number> = {
  conjunction: 0,
  semisextile: 30,
  semisquare: 45,
  sextile: 60,
  quintile: 72,
  square: 90,
  trine: 120,
  sesquiquadrate: 135,
  biquintile: 144,
  quincunx: 150,
  opposition: 180,
};

// Default aspect orbs in degrees
export const ASPECT_ORBS: Record<AspectType, number> = {
  conjunction: 8,
  semisextile: 2,
  semisquare: 2,
  sextile: 6,
  quintile: 2,
  square: 8,
  trine: 8,
  sesquiquadrate: 2,
  biquintile: 2,
  quincunx: 3,
  opposition: 8,
};

// Chart Patterns
export interface Pattern {
  readonly type: string;
  readonly planets: PlanetId[];
  readonly description: string;
  readonly strength: number;       // 0-1 significance
}

// Elemental Balance
export interface ElementalBalance {
  readonly fire: number;
  readonly earth: number;
  readonly air: number;
  readonly water: number;
  readonly dominant: Element;
  readonly weakest: Element;
}

export interface ModalBalance {
  readonly cardinal: number;
  readonly fixed: number;
  readonly mutable: number;
  readonly dominant: Modality;
}

// Time & Location
export interface GeoLocation {
  readonly latitude: number;   // -90 to 90
  readonly longitude: number;  // -180 to 180
  readonly altitude?: number;  // meters
  readonly timezone?: string;
  readonly locationName?: string;
}

export interface BirthData {
  readonly name: string;
  readonly birthDate: string;  // ISO date: YYYY-MM-DD
  readonly birthTime: string;  // ISO time: HH:MM
  readonly location: GeoLocation;
  readonly timezone: string;
}

// Moon Phase
export interface MoonPhaseData {
  readonly name: string;
  readonly illumination: number;  // 0-1 fraction
  readonly isWaxing: boolean;
  readonly age?: number;  // days since new moon (optional)
  readonly phaseAngle?: number;  // 0-360 (optional)
  readonly emoji?: string;
}

// Moon Aspect (for current Moon aspects)
export interface MoonAspect {
  readonly planet: string;
  readonly planetSymbol: string;
  readonly type: string;
  readonly orb: number;
  readonly isApplying: boolean;
}

// Last Aspect (what caused the void)
export interface LastAspectInfo {
  readonly planet: string;
  readonly type: string;
  readonly exactTime: Date;
}

// Void Moon Types
export interface VoidMoonData {
  readonly isVoid: boolean;
  readonly voidStart: Date | null;
  readonly voidEnd: Date | null;
  readonly nextVoidStart: Date | null;
  readonly nextVoidEnd: Date | null;
  readonly durationMinutes: number;
  readonly remainingMinutes: number;
  readonly progress: number;  // 0-100 percentage through void
  readonly nextVoidDuration: number;
  // Extended properties for Sanctuary
  readonly moonSign?: string;
  readonly moonPhase?: MoonPhaseData;
  readonly aspects?: MoonAspect[];
  readonly lastAspect?: LastAspectInfo;
}

export interface VoidMoonEvent {
  readonly startTime: Date;
  readonly endTime: Date;
  readonly durationMinutes: number;
  readonly fromSignLongitude: number;  // Moon's position when void starts
  readonly toSignLongitude: number;     // Position when entering next sign
}

// Dignity Information
export type DignityType = 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'triplicity' | 'term' | 'face';

export interface DignityInfo {
  readonly planet: PlanetId;
  readonly sign: ZodiacSign;
  readonly type: DignityType;
  readonly strength: number;  // 0-1, how strong the dignity is
  readonly description: string;
}
