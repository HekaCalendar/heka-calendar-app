/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * TEMPLATE LIBRARY v2 — Shared Types
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface PlanetSignTemplateV2 {
  /** 2-4 poetic sentences defining the archetype in this sign */
  essence: string;
  /** fire | earth | air | water | ether */
  element: string;
  /** cardinal | fixed | mutable */
  modality: string;
  /** 3-5 defining traits */
  keywords: string[];
  /** 2-3 sentences of professional guidance */
  careerAdvice: string;
  /** 2-3 sentences of relational guidance */
  relationshipAdvice: string;
  /** 2-3 sentences of wellbeing guidance */
  healthAdvice: string;
  /** 2-3 sentences of financial guidance */
  financesAdvice: string;
  /** 2-3 sentences of developmental guidance */
  growthAdvice: string;
  /** Physical body areas associated with this sign */
  bodyFocus: string;
  /** How this planet's energy resonates through this element */
  elementalResonance: string;
}

/** Record of all sign templates for a single celestial body */
export type BodyTemplates = Record<string, PlanetSignTemplateV2>;
