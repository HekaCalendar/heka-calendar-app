/**
 * Natal Chart Types
 * Complete chart representation with all calculated data
 */

import type { 
  CelestialBody, 
  HouseSystem, 
  Aspect, 
  Pattern,
  ElementalBalance,
  ModalBalance,
  DignityInfo,
  BirthData,
  Timestamp,
  Degree,
  PlanetId,
  ZodiacSign,
  ZodiacFrame,
  SignCount
} from './core';

// Chart Identification
export type ChartId = string & { readonly __brand: 'ChartId' };
export type ProfileId = string & { readonly __brand: 'ProfileId' };

// Core Chart Data
export interface NatalChart {
  readonly id: ChartId;
  readonly profileId: ProfileId;
  readonly birthData: BirthData;
  
  // Calculated positions
  readonly bodies: Record<PlanetId, CelestialBody>;
  readonly houses: HouseSystem;
  readonly aspects: Aspect[];
  readonly patterns: Pattern[];
  
  // Derived analysis
  readonly dignities: DignityInfo[];
  readonly elementalBalance: ElementalBalance;
  readonly modalBalance: ModalBalance;
  
  // Metadata
  readonly julianDay: number;
  readonly calculatedAt: Timestamp;
  readonly version: '2.0';
  readonly zodiacSystem: '12-sign' | '13-sign' | 'sidereal'; // legacy
  readonly zodiacFrame: ZodiacFrame;
  readonly signCount: SignCount;
  readonly houseSystem: HouseSystem['type'];
}

// Chart Parameters for Calculation
export interface ChartParams {
  readonly profileId: ProfileId;
  readonly birthData: BirthData;
  readonly zodiacSystem: '12-sign' | '13-sign' | 'sidereal'; // legacy
  readonly zodiacFrame: ZodiacFrame;
  readonly signCount: SignCount;
  readonly houseSystem: HouseSystem['type'];
  readonly options?: ChartOptions;
}

export interface ChartOptions {
  readonly includeMinorBodies?: boolean;
  readonly includeAsteroids?: boolean;
  readonly calculatePatterns?: boolean;
  readonly aspectSet?: 'major' | 'all' | 'minor';
  readonly orbModifier?: number;  // 0.5 = tighter orbs, 2.0 = wider
}

// Transit Data
export interface Transit {
  readonly id: string;
  readonly date: string;
  readonly transitingPlanet: PlanetId;
  readonly natalPlanet: PlanetId;
  readonly aspectType: Aspect['type'];
  readonly orb: Degree;
  readonly isApplying: boolean;
  readonly isExact: boolean;
  readonly influence: 'major' | 'minor';
  readonly interpretation?: string;
}

export interface DailyTransits {
  readonly date: string;
  readonly transits: readonly Transit[];
  readonly moonSign: ZodiacSign;
  readonly moonPhase: MoonPhase;
  readonly voidOfCourse: boolean;
}

export const MOON_PHASES = [
  'new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous',
  'full', 'waning-gibbous', 'last-quarter', 'waning-crescent'
] as const;

export type MoonPhase = typeof MOON_PHASES[number];

// Progressions
export interface Progression {
  readonly type: 'secondary' | 'solar-arc' | 'primary';
  readonly date: string;
  readonly progressedPositions: Record<PlanetId, CelestialBody>;
  readonly progressedHouses?: HouseSystem;
}

// Synastry (Relationship Charts)
export interface SynastryData {
  readonly chart1: NatalChart;
  readonly chart2: NatalChart;
  readonly interAspects: readonly Aspect[];
  readonly compositeChart?: NatalChart;  // Midpoint composite
  readonly davisonChart?: NatalChart;    // Time-space midpoint
}

// Chart Display Options
export interface ChartDisplayOptions {
  readonly showAspects: boolean;
  readonly showHouses: boolean;
  readonly showPatterns: boolean;
  readonly aspectFilter?: Aspect['type'][];
  readonly bodyFilter?: PlanetId[];
  readonly highlightedHouse?: number;
  readonly highlightedPlanet?: PlanetId;
  readonly chartStyle: 'wheel' | 'grid' | 'list';
}

// Calculation Status
export interface CalculationState {
  readonly status: 'idle' | 'calculating' | 'complete' | 'error';
  readonly progress?: number;
  readonly error?: CalculationError;
  readonly startTime?: Timestamp;
  readonly endTime?: Timestamp;
}

export interface CalculationError {
  readonly code: string;
  readonly message: string;
  readonly recoverable: boolean;
  readonly fallbackAvailable: boolean;
}
