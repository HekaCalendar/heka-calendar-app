/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TEMPLATE LIBRARY v2 — Body Template Index
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Imports and re-exports all 13 celestial body template maps.
 * Each map contains 13 sign templates (12 tropical + Ophiuchus).
 *
 * Total: 169 hand-crafted planet-sign templates.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export type { PlanetSignTemplateV2, BodyTemplates } from './types';

import { sunTemplates } from './sunTemplates';
import { moonTemplates } from './moonTemplates';
import { mercuryTemplates } from './mercuryTemplates';
import { venusTemplates } from './venusTemplates';
import { marsTemplates } from './marsTemplates';
import { jupiterTemplates } from './jupiterTemplates';
import { saturnTemplates } from './saturnTemplates';
import { uranusTemplates } from './uranusTemplates';
import { neptuneTemplates } from './neptuneTemplates';
import { plutoTemplates } from './plutoTemplates';
import { chironTemplates } from './chironTemplates';
import { northNodeTemplates } from './northNodeTemplates';
import { lilithTemplates } from './lilithTemplates';

export {
  sunTemplates, moonTemplates, mercuryTemplates, venusTemplates,
  marsTemplates, jupiterTemplates, saturnTemplates, uranusTemplates,
  neptuneTemplates, plutoTemplates, chironTemplates, northNodeTemplates,
  lilithTemplates,
};

/** All body template maps keyed by planet name (lowercase) */
export const ALL_BODY_TEMPLATES = {
  sun: sunTemplates,
  moon: moonTemplates,
  mercury: mercuryTemplates,
  venus: venusTemplates,
  mars: marsTemplates,
  jupiter: jupiterTemplates,
  saturn: saturnTemplates,
  uranus: uranusTemplates,
  neptune: neptuneTemplates,
  pluto: plutoTemplates,
  chiron: chironTemplates,
  northNode: northNodeTemplates,
  lilith: lilithTemplates,
} as const;

/** Ordered list of all body names for deterministic iteration */
export const BODY_NAMES = Object.keys(ALL_BODY_TEMPLATES) as string[];
