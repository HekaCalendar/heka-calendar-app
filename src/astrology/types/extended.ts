/**
 * Extended Astrology Types
 * Comprehensive type definitions for advanced astrological calculations
 * 
 * This module contains:
 * - Extended celestial bodies (asteroids, hypothetical planets)
 * - Fixed stars with astronomical and astrological data
 * - Complete dignity systems (essential and accidental)
 * - All house system mathematical definitions
 * - Aspect harmonics and orbs
 * - Arabic Parts (Lots)
 * - Lunar nodes and apsides
 * - Precession and ayanamsa calculations
 */

import type { Degree, PlanetId, ZodiacSign, Element, Modality } from './core';

// ============================================================================
// EXTENDED CELESTIAL BODIES
// ============================================================================

/** Traditional planets plus modern additions */
export const MAJOR_BODIES = [
  'sun', 'moon', 'mercury', 'venus', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
] as const;

export type MajorBody = typeof MAJOR_BODIES[number];

/** Minor bodies - asteroids and significant objects */
export const MINOR_BODIES = [
  'chiron',         // Wounded healer
  'ceres',          // Nurturing, agriculture
  'pallas',         // Wisdom, strategy
  'juno',           // Marriage, partnership
  'vesta',          // Devotion, focus
  'lilith',         // Dark moon, repressed desires
  'north_node',     // Karmic future
  'south_node',     // Karmic past
  'vertex',         // Fated encounters
  'part_of_fortune' // Material well-being
] as const;

export type MinorBody = typeof MINOR_BODIES[number];

/** Hypothetical planets (used in some schools) */
export const HYPOTHETICAL_BODIES = [
  'cupido',         // Uranian astrology
  'hades',          // Uranian astrology
  'zeus',           // Uranian astrology
  'kronos',         // Uranian astrology
  'apollon',        // Uranian astrology
  'admetos',        // Uranian astrology
  'vulcanus',       // Uranian astrology
  'poseidon',       // Uranian astrology
  'transpluto',     // Beyond Pluto (some systems)
  'proserpina'      // Persephone energy
] as const;

export type HypotheticalBody = typeof HYPOTHETICAL_BODIES[number];

/** Trans-Neptunian objects and Kuiper Belt objects */
export const TNO_BODIES = [
  'eris',           // Discord, strife
  'sedna',          // Deep unconscious, isolation
  'haumea',         // Fertility, renewal
  'makemake',       // Creation, manifestation
  'ixion',          // Betrayal, oath-breaking
  'varuna',         // Cosmic order, truth
  'quaoar',         // Creation myths, culture
  'orcus'           // Oaths, underworld
] as const;

export type TNOBody = typeof TNO_BODIES[number];

/** All celestial bodies combined */
export type CelestialBodyId = MajorBody | MinorBody | HypotheticalBody | TNOBody;

/** Body classification for UI filtering */
export type BodyCategory = 
  | 'luminary'      // Sun, Moon
  | 'personal'      // Mercury, Venus, Mars
  | 'social'        // Jupiter, Saturn
  | 'transpersonal' // Uranus, Neptune, Pluto
  | 'asteroid'      // Ceres, Pallas, Juno, Vesta
  | 'point'         // Nodes, Vertex, Lilith
  | 'hypothetical'  // Uranian planets
  | 'tno';          // Trans-Neptunian objects

/** Complete body information */
export interface CelestialBodyInfo {
  readonly id: CelestialBodyId;
  readonly name: string;
  readonly symbol: string;
  readonly category: BodyCategory;
  readonly orbitPeriod: number;      // Days
  readonly orbitPeriodYears?: number; // For outer planets
  readonly rulingSigns: readonly ZodiacSign[];
  readonly exaltedSign: ZodiacSign | null;
  readonly detrimentSigns: readonly ZodiacSign[];
  readonly fallSign: ZodiacSign | null;
  readonly keywords: readonly string[];
  readonly description: string;
  readonly mythology: string;
  readonly astronomical: {
    readonly distanceAU?: number;
    readonly diameterKm?: number;
    readonly discoveryYear?: number;
  };
}

// ============================================================================
// FIXED STARS
// ============================================================================

/** Major fixed stars with astrological significance */
export const FIXED_STARS = [
  'algol',          // Caput Medusae - the Demon
  'alcyone',        // Pleiades - weeping
  'aldebaran',      // Bull's eye - honor
  'rigel',          // Orion's foot - education
  'sirius',         // Dog Star - honor, wealth
  'canopus',        // Navigator - piety
  'castor',         // Twin - cleverness
  'pollux',         // Twin - violence
  'procyon',        // Little Dog - activity
  'regulus',        // Lion's heart - royalty
  'denebola',       // Lion's tail - misfortune
  'spica',          // Wheat ear - harvest, gift
  'arcturus',       // Bear guard - riches
  'alpha_centauri', // Nearest star
  'antares',        // Scorpion's heart - danger
  'altair',         // Eagle - boldness
  'vega',           // Vulture - generosity
  'deneb',          // Tail - dignity
  'formalhaut',     // Fish mouth - magic
  'markab',         // Saddle - violence
  'achernar',       // River end - pride
  'hamal',          // Ram - violence
  'aldebaran',      // Follower - honor
  'capella',        // Goat - curiosity
  'betelgeuse',     // Orion's shoulder - violence
  'rigel_kentaurus' // Alpha Centauri
] as const;

export type FixedStar = typeof FIXED_STARS[number];

/** Fixed star nature types */
export type StarNature = 
  | 'mars_jupiter'   // Martial + Jovial
  | 'mars_mercury'   // Martial + Mercurial
  | 'mars_saturn'    // Martial + Saturnine
  | 'mars_venus'     // Martial + Venusian
  | 'jupiter_mars'   // Same as mars_jupiter
  | 'jupiter_saturn' // Jovial + Saturnine
  | 'saturn_jupiter' // Same as jupiter_saturn
  | 'saturn_mars'    // Same as mars_saturn
  | 'saturn_venus'   // Saturnine + Venusian
  | 'venus_mercury'  // Venusian + Mercurial
  | 'venus_jupiter'  // Venusian + Jovial
  | 'mercury_mars'   // Mercurial + Martial
  | 'mercury_saturn' // Mercurial + Saturnine
  | 'moon_mars'      // Lunar + Martial
  | 'moon_venus'     // Lunar + Venusian
  | 'neptune'        // Neptunian
  | 'uranus'         // Uranian
  | 'pluto';         // Plutonian

/** Fixed star data structure */
export interface FixedStarData {
  readonly id: FixedStar;
  readonly name: string;
  readonly longitude1900: Degree;    // Position in 1900
  readonly latitude: number;          // Ecliptic latitude
  readonly magnitude: number;        // Brightness (lower = brighter)
  readonly nature: StarNature;       // Planetary nature
  readonly keywords: readonly string[];
  readonly influence: 'fortunate' | 'neutral' | 'misfortunate' | 'variable';
  readonly orb: number;              // Effective orb (typically 1-2°)
  readonly mythology: string;
  readonly interpretation: string;
  readonly longitudeRate: number;    // Annual precession rate
}

/** Star paran relationships */
export interface StarParan {
  readonly star: FixedStar;
  readonly planet: PlanetId;
  readonly angle: 'rising' | 'culminating' | 'setting' | 'nadir';
  readonly strength: 'strong' | 'moderate' | 'weak';
}

// ============================================================================
// COMPLETE HOUSE SYSTEM DEFINITIONS
// ============================================================================

/** All astrological house systems */
export const HOUSE_SYSTEM_TYPES = [
  'placidus',        // Most popular, time-based
  'koch',            // Popular in US
  'equal',           // 30° each from Ascendant
  'whole_sign',      // Each sign = one house
  'porphyry',        // 1st/7th trisection
  'campanus',        // Prime vertical division
  'regiomontanus',   // Celestial equator division
  'morinus',         // Celestial equator, no pole
  'topocentric',     // Based on birthplace
  'alcabitus',       // Semi-arc system
  'sripati',         // Indian system
  'bhava_sripati',   // Sripati variation
  'equal_mc',        // Equal from MC
  'equal_aries',     // Aries = 1st house
  'solar',           // Sun = 1st house cusp
  'lunar',           // Moon = 1st house cusp
  'decan',           // 10° divisions
  'duodecima',       // 2.5° divisions
  'navamsa',         // 9th harmonic of houses
  'harmonic'         // Custom harmonic
] as const;

export type HouseSystemType = typeof HOUSE_SYSTEM_TYPES[number];

/** House system mathematical description */
export interface HouseSystemDefinition {
  readonly type: HouseSystemType;
  readonly name: string;
  readonly description: string;
  readonly origin: string;
  readonly calculationMethod: string;
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly bestFor: readonly string[];
  readonly requiresBirthTime: boolean;
  readonly worksAtPoles: boolean;
  readonly quadrantBased: boolean;
}

/** House meanings and significations */
export interface HouseMeaning {
  readonly number: number;
  readonly name: string;
  readonly latinName: string;
  readonly keywords: readonly string[];
  readonly significations: {
    readonly primary: readonly string[];
    readonly derived: readonly string[];
    readonly modern: readonly string[];
    readonly traditional: readonly string[];
  };
  readonly rulingPlanet: PlanetId;
  readonly element: Element;
  readonly modality: Modality;
  readonly joy: PlanetId | null;        // Planet that "rejoices" here
  readonly detriment: PlanetId | null;  // Planet uncomfortable here
}

// ============================================================================
// COMPLETE DIGNITY SYSTEM
// ============================================================================

/** Essential dignities */
export const ESSENTIAL_DIGNITIES = [
  'domicile',      // Ruler of sign (+5 points)
  'exaltation',    // Exalted in sign (+4 points)
  'triplicity_ruler', // Element ruler (+3 points)
  'term',          // Term/bound ruler (+2 points)
  'face',          // Decan ruler (+1 point)
  'peregrine',     // No dignity (0 points)
  'detriment',     // Opposite domicile (-5 points)
  'fall'           // Opposite exaltation (-4 points)
] as const;

export type EssentialDignity = typeof ESSENTIAL_DIGNITIES[number];

/** Accidental dignities (by position) */
export const ACCIDENTAL_DIGNITIES = [
  'angular',           // In angular house (+5)
  'succedent',         // In succedent house (+2)
  'cadent',            // In cadent house (-2)
  'direct',            // Direct motion (+4)
  'retrograde',        // Retrograde motion (-5)
  'fast',              // Faster than average (+2)
  'slow',              // Slower than average (-2)
  'oriental',          // Rising before Sun (+2)
  'occidental',        // Rising after Sun (-2)
  'free_combustion',   // Not combust (+5)
  'combust',           // Within 8° of Sun (-5)
  'under_beams',       // Within 15° of Sun (-4)
  'cazimi',            // Within 17' of Sun (+5)
  'besieged_benefics', // Between Venus/Jupiter (+5)
  'besieged_malefics', // Between Mars/Saturn (-5)
  'in_joy',            // In house of joy (+2)
  'in_hayz',           // Correct sect (+2)
  'void_of_course',    // No upcoming aspects (-2)
  'in_conjunct',       // Conjunct North Node (+4)
  'in_oppose',         // Conjunct South Node (-4)
  'elevated',          // Higher ecliptic latitude (+2)
  'depressed'          // Lower ecliptic latitude (-2)
] as const;

export type AccidentalDignity = typeof ACCIDENTAL_DIGNITIES[number];

/** Complete dignity scoring */
export interface DignityScore {
  readonly planet: PlanetId;
  readonly sign: ZodiacSign;
  readonly essential: {
    readonly type: EssentialDignity;
    readonly score: number;
    readonly description: string;
  }[];
  readonly accidental: {
    readonly type: AccidentalDignity;
    readonly score: number;
    readonly description: string;
  }[];
  readonly totalEssential: number;
  readonly totalAccidental: number;
  readonly grandTotal: number;
  readonly almuten: boolean;  // Is this the almuten (strongest) of the chart?
}

/** Traditional dignity table entry */
export interface DignityTableEntry {
  readonly sign: ZodiacSign;
  readonly domicileDay: PlanetId;
  readonly domicileNight: PlanetId | null;
  readonly exaltation: PlanetId;
  readonly exaltationDegree: number;
  readonly triplicityDay: PlanetId;
  readonly triplicityNight: PlanetId;
  readonly triplicityParticipating: PlanetId;
  readonly detriment: PlanetId;
  readonly fall: PlanetId;
  readonly terms: readonly TermRuler[];
  readonly faces: readonly FaceRuler[];
}

/** Term (bound) ruler */
export interface TermRuler {
  readonly planet: PlanetId;
  readonly startDegree: number;
  readonly endDegree: number;
}

/** Face (decan) ruler */
export interface FaceRuler {
  readonly planet: PlanetId;
  readonly decan: 1 | 2 | 3;
  readonly startDegree: number;
  readonly endDegree: number;
}

// ============================================================================
// COMPLETE ASPECT SYSTEM
// ============================================================================

/** All aspect types including harmonics */
export const ASPECT_TYPES = [
  // Major aspects (Ptolemy)
  'conjunction',   // 0°
  'sextile',       // 60°
  'square',        // 90°
  'trine',         // 120°
  'opposition',    // 180°
  
  // Minor aspects
  'semisextile',   // 30°
  'quincunx',      // 150° (inconjunct)
  'semisquare',    // 45°
  'sesquiquadrate',// 135°
  'quintile',      // 72°
  'biquintile',    // 144°
  
  // Very minor aspects
  'novile',        // 40°
  'binovile',      // 80°
  'quadranovile',  // 160°
  'decile',        // 36°
  'tridecile',     // 108°
  
  // Kepler aspects
  'tredecile',     // 108°
  'quindecile',    // 165°
  
  // Harmonic aspects
  'septile',       // 51°26' (360/7)
  'biseptile',     // 102°51'
  'triseptile',    // 154°17'
  
  // Other
  'parallel',      // Same declination
  'contraparallel' // Opposite declination
] as const;

export type AspectType = typeof ASPECT_TYPES[number];

/** Aspect nature (traditional classification) */
export type AspectNature = 
  | 'harmonious'    // Easy flowing
  | 'dynamic'       // Challenging but productive
  | 'neutral'       // Neither good nor bad
  | 'hard'          // Difficult
  | 'minor'         // Subtle influence
  | 'declination';  // Parallel-based

/** Complete aspect definition */
export interface AspectDefinition {
  readonly type: AspectType;
  readonly angle: number;
  readonly nature: AspectNature;
  readonly traditionalOrb: number;     // For traditional astrology
  readonly modernOrb: number;          // For modern astrology
  readonly applyingOrb: number;        // Tighter for applying
  readonly separatingOrb: number;      // Wider for separating
  readonly keywords: readonly string[];
  readonly description: string;
  readonly traditionalMeaning: string;
  readonly modernMeaning: string;
  readonly applyingInterpretation: string;
  readonly separatingInterpretation: string;
  readonly exactInterpretation: string;
}

/** Aspect configuration in chart */
export interface AspectConfiguration {
  readonly body1: CelestialBodyId;
  readonly body2: CelestialBodyId;
  readonly type: AspectType;
  readonly angle: Degree;
  readonly orb: Degree;
  readonly isApplying: boolean;
  readonly isExact: boolean;
  readonly strength: 'strong' | 'moderate' | 'weak';
  readonly significance: 'major' | 'minor';
  readonly approachingExact?: Date;    // When will be exact (if applying)
  readonly separatingFromExact?: Date; // When was exact (if separating)
}

// ============================================================================
// ARABIC PARTS (LOTS)
// ============================================================================

/** Major Arabic Parts */
export const ARABIC_PARTS = [
  'part_of_fortune',       // Asc + Moon - Sun (day) / Asc + Sun - Moon (night)
  'part_of_spirit',        // Asc + Sun - Moon (day) / Asc + Moon - Sun (night)
  'part_of_eros',          // Asc + Venus - Mars
  'part_of_necessity',     // Asc + Mars - Venus
  'part_of_basis',         // Asc + Part of Fortune - Part of Spirit
  'part_of_exaltation',    // Asc + 19° Aries - Sun
  'part_of_love',          // Asc + Venus - ruler of 7th
  'part_of_marriage',      // Various calculations
  'part_of_death',         // Asc + 8th cusp - Moon
  'part_of_disease',       // Asc + Mars - Saturn
  'part_of_sickness',      // Asc + Mars - Mercury
  'part_of_treachery',     // Asc + Neptune - Sun
  'part_of_victory',       // Asc + Jupiter - Part of Spirit
  'part_of_bravery',       // Asc + Part of Spirit - Mars
  'part_of_sudden_advancement', // Asc + Jupiter - Sun
  'part_of_honor',         // Asc + Sun - Saturn
  'part_of_father',        // Asc + Saturn - Sun
  'part_of_mother',        // Asc + Moon - Venus
  'part_of_children',      // Asc + Jupiter - Saturn
  'part_of_brothers',      // Asc + Jupiter - Saturn
  'part_of_sisters',       // Asc + Venus - Saturn
  'part_of_friends',       // Asc + Mercury - Moon
  'part_of_enemies',       // Asc + Saturn - Mercury
  'part_of_imprisonment',  // Asc + Saturn - Mercury
  'part_of_real_estate',   // Asc + Mars - Saturn
  'part_of_wealth',        // Asc + 2nd cusp - ruler of 2nd
  'part_of_travel',        // Asc + 9th cusp - ruler of 9th
  'part_of_astrology'      // Asc + Mercury - Uranus
] as const;

export type ArabicPart = typeof ARABIC_PARTS[number];

/** Arabic Part definition */
export interface ArabicPartDefinition {
  readonly id: ArabicPart;
  readonly name: string;
  readonly formula: {
    readonly day: {
      readonly base: 'ascendant' | CelestialBodyId;
      readonly plus: CelestialBodyId | 'cusp';
      readonly minus: CelestialBodyId | 'cusp' | 'ruler';
    };
    readonly night: {
      readonly base: 'ascendant' | CelestialBodyId;
      readonly plus: CelestialBodyId | 'cusp';
      readonly minus: CelestialBodyId | 'cusp' | 'ruler';
    };
  };
  readonly significations: readonly string[];
  readonly interpretation: string;
}

// ============================================================================
// PRECESSION AND AYANAMSA
// ============================================================================

/** Sidereal calculation systems */
export const SIDEREAL_SYSTEMS = [
  'lahiri',           // Chitrapaksha - India standard
  'raman',            // B.V. Raman
  'krishnamurti',     // K.P. system
  'jn_bhasin',        // J.N. Bhasin
  'fagan_bradley',    // Western sidereal
  'de_luce',          // Robert DeLuce
  'us_shepherd',      // U.S. Naval Observatory
  'suryasiddhanta',   // Traditional Indian
  'yukteswar',        // Swami Sri Yukteswar
  'jn_bhasin_corrected',
  'sastri',           // K.S. Sastri
  'bv_raman_s',       // Raman variation
  'sundara_raju',     // Sundara Raju
  'chakraverti',      // Chakraverti
  'placidus_indian'   // Indian variation
] as const;

export type SiderealSystem = typeof SIDEREAL_SYSTEMS[number];

/** Precession calculation */
export interface PrecessionData {
  readonly ayanamsa: Degree;
  readonly system: SiderealSystem;
  readonly precessionRate: number;  // Degrees per year
  readonly vernalPoint: Degree;     // Where 0° Aries actually is
}

// ============================================================================
// TIME LORD SYSTEMS
// ============================================================================

/** Time lord calculation methods */
export const TIME_LORD_SYSTEMS = [
  'firdaria',         // Medieval Persian
  'profection',       // Annual profections
  'zodiacal_releasing', // Valens method
  'decennials',       // 10-year periods
  'quarters',         // Quarterly divisions
  'thirds',           // Thirds of life
  'minute_profections', // Monthly
  'day_profections',    // Daily
  'solar_return',     // Annual solar
  'lunar_return',     // Monthly lunar
  'planetary_periods' // Major/minor periods
] as const;

export type TimeLordSystem = typeof TIME_LORD_SYSTEMS[number];

/** Firdaria periods */
export interface FirdariaPeriod {
  readonly planet: PlanetId | 'north_node' | 'south_node';
  readonly years: number;
  readonly subPeriods: FirdariaSubPeriod[];
}

export interface FirdariaSubPeriod {
  readonly planet: PlanetId | 'north_node' | 'south_node';
  readonly months: number;
}

/** Profection data */
export interface ProfectionData {
  readonly age: number;
  readonly profectedAscendant: ZodiacSign;
  readonly profectedHouse: number;
  readonly lordOfTheYear: PlanetId;
  readonly houseActivated: number;
}

/** Zodiacal Releasing periods */
export interface ZodiacalReleasingPeriod {
  readonly sign: ZodiacSign;
  readonly years: number;
  readonly months: number;
  readonly days: number;
  readonly level: 'loosing_of_bond' | 'peak' | 'normal';
  readonly fortuneOrSpirit: 'fortune' | 'spirit';
}

// Extended types module - no self-export needed
