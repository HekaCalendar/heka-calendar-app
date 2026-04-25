/**
 * Pattern Detector
 * Detects chart patterns like Grand Trines, T-Squares, etc.
 * 
 * NOTE: This file is now a thin compatibility wrapper around
 * patternDetection.ts, which contains the canonical detection logic.
 */

import type {
  PlanetId,
  CelestialBody,
  Pattern
} from '../../types';

import { detectPatterns as detectAdvancedPatterns, toLegacyPatterns } from './patternDetection';

export interface PatternDetectionOptions {
  /** Maximum orb for pattern aspects (tighter than standard) */
  patternOrbModifier?: number;
  /** Minimum number of planets for a stellium */
  stelliumMinimum?: number;
  /** Maximum degree spread for stellium */
  stelliumOrb?: number;
}

/**
 * Detect all patterns in a set of chart bodies
 * Delegates to the advanced pattern detector for unified logic.
 */
export function detectPatterns(
  bodies: Record<PlanetId, CelestialBody>,
  _aspects?: any[],
  _options: PatternDetectionOptions = {}
): Pattern[] {
  const chartPatterns = detectAdvancedPatterns(bodies);
  return toLegacyPatterns(chartPatterns);
}

/**
 * Get pattern description
 */
export function getPatternDescription(type: Pattern['type']): string {
  const descriptions: Record<string, string> = {
    'stellium': 'A concentration of energy in one area of life',
    'grand-trine': 'Natural talent flowing between three areas',
    't-square': 'Dynamic tension driving growth through challenges',
    'grand-cross': 'Intense crucible of transformation and integration',
    'yod': 'A fated mission requiring spiritual adjustment',
    'kite': 'A grand trine with an outlet for expression',
    'cradle': 'A protected, creative configuration',
    'mystic_rectangle': 'Graceful problem-solving through opposing forces',
    'thors_hammer': 'Intense driving force for breakthrough',
    'hard_rectangle': 'Rapid evolution through sustained pressure',
  };
  return descriptions[type] || 'A significant planetary configuration';
}
