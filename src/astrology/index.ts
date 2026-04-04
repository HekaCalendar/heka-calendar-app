/**
 * HEKA Astrology System
 * Professional-grade astrology calculations
 */

// Core Types (from types/index.ts)
export * from './types';

// Extended Types (additional astrological types)
export type {
  CelestialBodyId,
  CelestialBodyInfo,
  FixedStar,
  FixedStarData,
  HouseMeaning,
  HouseSystemDefinition,
  HouseSystemType,
  DignityScore,
  DignityTableEntry,
  TermRuler,
  FaceRuler,
  AspectDefinition,
  AspectConfiguration,
  ArabicPart,
  ArabicPartDefinition,
  PrecessionData,
  FirdariaPeriod,
  ProfectionData,
  ZodiacalReleasingPeriod,
  SiderealSystem
} from './types/extended';

// Services
export * from './services/swiss-ephemeris/engine';
export * from './services/calculations/aspects';
export * from './services/calculations/patterns';
export * from './services/persistence';

// Data
export * from './data';

// Integration
export * from './integration/calendarSync';

// Hooks
export * from './hooks';

// Store
export { default as astrologyReducer } from './store/slice';
export * from './store/slice';
export * from './store/selectors';
export * from './store/thunks';

// Components - Containers
export { AstrologyHub } from './components/containers/AstrologyHub';
export { StarsHub } from './components/containers/StarsHub';
export { DailyAstrologyPanel } from './components/containers/DailyAstrologyPanel';
export { default as BirthChartForm } from './components/forms/BirthChartForm';

// Components - Cosmic
export { VoidMoonStatus, VoidMoonMini, VoidMoonOverlay } from './components/cosmic/VoidMoonStatus';
export { VoidMoonCalendar } from './components/cosmic/VoidMoonCalendar';
