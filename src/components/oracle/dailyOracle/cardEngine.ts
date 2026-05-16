/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║              DAILY ORACLE — CARD GENERATION ENGINE                        ║
 * ║                                                                           ║
 * ║  Maps celestial data to archetypes, synthesizes poetic content,           ║
 * ║  and generates deterministic daily draws.                                 ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import type { OracleArchetype } from './archetypes';
import { ORACLE_ARCHETYPES } from './archetypes';

// ─── Card Interface ──────────────────────────────────────────────────────────

export interface DailyOracleCard {
  id: string;              // deterministic: date-based
  date: string;            // YYYY-MM-DD
  drawDate: string;        // ISO timestamp
  archetypeId: string;
  archetypeName: string;
  archetypeNumber: number;
  element: string;
  modality: string;
  symbol: string;
  keywords: string[];

  // Generated content
  title: string;
  insight: string;
  shadow: string;
  invitation: string;
  journalPrompt: string;
  affirmation: string;

  // Celestial context (one-liner summary)
  cosmicContext: string;

  // Artwork seed (deterministic)
  artworkSeed: string;

  // Birth chart connection
  birthChartNote?: string;

  // User interaction
  isDrawn: boolean;
  isRevealed: boolean;
  journalEntryId?: string;
}

// ─── Celestial Input ─────────────────────────────────────────────────────────

export interface CelestialSnapshot {
  moonPhase: {
    phase: string;    // 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent'
    sign: string;
    illumination: number;
  };
  strongestTransit?: {
    transitingPlanet: string;
    natalPlanet: string;
    aspect: string;
    strength: number;
  };
  retrogrades: string[];
  dominantElement?: string;
  isVoidMoon?: boolean;
  isEclipse?: boolean;
}

// ─── Archetype Mapping Logic ─────────────────────────────────────────────────

/**
 * Map celestial snapshot to the most resonant archetype.
 * Priority: Eclipses > Strong transits > Moon phase > Retrogrades > Void moon > Fallback
 */
export function selectArchetype(snapshot: CelestialSnapshot): OracleArchetype {
  // Eclipse takes absolute precedence
  if (snapshot.isEclipse) {
    if (snapshot.moonPhase.phase === 'new') return ORACLE_ARCHETYPES.find(a => a.id === 'solar-eclipse')!;
    return ORACLE_ARCHETYPES.find(a => a.id === 'lunar-eclipse')!;
  }

  // Void moon
  if (snapshot.isVoidMoon) {
    return ORACLE_ARCHETYPES.find(a => a.id === 'void-moon')!;
  }

  // Strong personal transits (strength > 60)
  if (snapshot.strongestTransit && snapshot.strongestTransit.strength >= 60) {
    const t = snapshot.strongestTransit;
    const aspectMap: Record<string, string> = {
      conjunction: 'cazimi',
      opposition: 't-square',
      square: 't-square',
      trine: 'grand-trine',
      sextile: 'mutual-application',
      quincunx: 'yod',
    };

    // Planet-specific overrides
    if (t.transitingPlanet.toLowerCase() === 'mercury' && t.aspect === 'conjunction') {
      return ORACLE_ARCHETYPES.find(a => a.id === 'mercury-retrograde')!;
    }
    if (t.transitingPlanet.toLowerCase() === 'venus') {
      return ORACLE_ARCHETYPES.find(a => a.id === 'venus-transit')!;
    }
    if (t.transitingPlanet.toLowerCase() === 'mars' && (t.aspect === 'square' || t.aspect === 'opposition')) {
      return ORACLE_ARCHETYPES.find(a => a.id === 'mars-square')!;
    }
    if (t.transitingPlanet.toLowerCase() === 'jupiter' && (t.aspect === 'trine' || t.aspect === 'sextile')) {
      return ORACLE_ARCHETYPES.find(a => a.id === 'jupiter-blessing')!;
    }
    if (t.transitingPlanet.toLowerCase() === 'saturn') {
      return ORACLE_ARCHETYPES.find(a => a.id === 'saturn-lesson')!;
    }
    if (t.transitingPlanet.toLowerCase() === 'uranus') {
      return ORACLE_ARCHETYPES.find(a => a.id === 'uranus-shock')!;
    }
    if (t.transitingPlanet.toLowerCase() === 'neptune') {
      return ORACLE_ARCHETYPES.find(a => a.id === 'neptune-dream')!;
    }
    if (t.transitingPlanet.toLowerCase() === 'pluto') {
      return ORACLE_ARCHETYPES.find(a => a.id === 'pluto-death')!;
    }

    const mapped = aspectMap[t.aspect];
    if (mapped) {
      const found = ORACLE_ARCHETYPES.find(a => a.id === mapped);
      if (found) return found;
    }
  }

  // Moon phase mapping
  const moonMap: Record<string, string> = {
    new: 'new-moon',
    waxing_crescent: 'new-moon',
    first_quarter: 't-square',
    waxing_gibbous: 'jupiter-blessing',
    full: 'full-moon',
    waning_gibbous: 'separating',
    last_quarter: 'saturn-lesson',
    waning_crescent: 'void-moon',
  };
  const moonArchetype = moonMap[snapshot.moonPhase.phase];
  if (moonArchetype) {
    const found = ORACLE_ARCHETYPES.find(a => a.id === moonArchetype);
    if (found) return found;
  }

  // Retrograde prominence
  if (snapshot.retrogrades.length >= 2) {
    return ORACLE_ARCHETYPES.find(a => a.id === 'mercury-retrograde')!;
  }

  // Fallback: use dominant element + date hash for deterministic variety
  const dateHash = hashString(new Date().toISOString().split('T')[0]);
  return ORACLE_ARCHETYPES[dateHash % ORACLE_ARCHETYPES.length];
}

// ─── Card Content Generation ─────────────────────────────────────────────────

export interface ZodiacOptions {
  zodiacFrame?: 'tropical' | 'sidereal';
  signCount?: 12 | 13;
}

export function generateCard(
  dateStr: string,
  snapshot: CelestialSnapshot,
  birthChart?: import('../types').BirthChartData | null,
  zodiacOptions?: ZodiacOptions
): DailyOracleCard {
  const archetype = selectArchetype(snapshot);
  const seed = hashString(`${dateStr}-${archetype.id}`);

  // Deterministic content selection based on seed
  const title = archetype.names[seed % archetype.names.length];
  const insight = archetype.insights[seed % archetype.insights.length];
  const shadow = archetype.shadows[seed % archetype.shadows.length];
  const invitation = archetype.invitations[seed % archetype.invitations.length];
  const journalPrompt = archetype.journalPrompts[seed % archetype.journalPrompts.length];
  const affirmation = archetype.affirmations[seed % archetype.affirmations.length];

  // Cosmic context one-liner
  const cosmicContext = buildCosmicContext(snapshot, archetype);

  // Birth chart connection
  let birthChartNote: string | undefined;
  const sunSign = birthChart?.planets?.sun?.sign;
  if (sunSign) {
    // Strip leading "The " to avoid double-"the" grammar (e.g. "today's the crossroads energy")
    const archetypeName = archetype.name.replace(/^The /, '').toLowerCase();
    const siderealTag = zodiacOptions?.zodiacFrame === 'sidereal' ? ' (sidereal)' : '';
    const bcNotes = [
      `Your ${sunSign}${siderealTag} sun recognizes today's ${archetype.element} energy as ${sunSign.toLowerCase() === archetype.element ? 'familiar terrain' : 'foreign soil calling for adaptation'}.`,
      `With the Sun in ${sunSign}${siderealTag}, today's ${archetypeName} energy activates your natural ${getElementKeyword(sunSign)} wisdom.`,
    ];
    birthChartNote = bcNotes[seed % bcNotes.length];
  }

  return {
    id: `oracle-${dateStr}`,
    date: dateStr,
    drawDate: new Date().toISOString(),
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    archetypeNumber: archetype.number,
    element: archetype.element,
    modality: archetype.modality,
    symbol: archetype.symbol,
    keywords: archetype.keywords,
    title,
    insight,
    shadow,
    invitation,
    journalPrompt,
    affirmation,
    cosmicContext,
    artworkSeed: `${archetype.id}-${seed}`,
    birthChartNote,
    isDrawn: true,
    isRevealed: false,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildCosmicContext(snapshot: CelestialSnapshot, archetype: OracleArchetype): string {
  const parts: string[] = [];

  if (snapshot.moonPhase) {
    parts.push(`${Math.round(snapshot.moonPhase.illumination)}% illuminated ${snapshot.moonPhase.phase.replace(/_/g, ' ')}`);
  }

  if (snapshot.strongestTransit) {
    const t = snapshot.strongestTransit;
    parts.push(`${t.transitingPlanet} ${t.aspect} your ${t.natalPlanet}`);
  }

  if (snapshot.retrogrades.length > 0) {
    parts.push(`${snapshot.retrogrades.length} planet${snapshot.retrogrades.length > 1 ? 's' : ''} retrograde`);
  }

  if (snapshot.isVoidMoon) {
    parts.push('void moon');
  }

  if (snapshot.dominantElement) {
    parts.push(`${snapshot.dominantElement} dominant`);
  }

  const base = parts.length > 0 ? parts.join(' · ') : 'Quiet sky, inward turn';
  return `${base} · ${archetype.element} energy`;
}

function getElementKeyword(sign: string): string {
  const fire = ['aries', 'leo', 'sagittarius'];
  const water = ['cancer', 'scorpio', 'pisces'];
  const air = ['gemini', 'libra', 'aquarius'];
  const earth = ['taurus', 'virgo', 'capricorn'];
  const s = sign.toLowerCase();
  if (fire.includes(s)) return 'fiery';
  if (water.includes(s)) return 'flowing';
  if (air.includes(s)) return 'intellectual';
  if (earth.includes(s)) return 'grounded';
  return 'mysterious';
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// ─── Date Helpers ────────────────────────────────────────────────────────────

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}
