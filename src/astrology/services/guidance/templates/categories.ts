/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CATEGORY LENSES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Life-category filters that highlight relevant advice from a template
 * and suppress what is less pertinent. Each lens reweights the template
 * fields so the reading speaks directly to the user's current concern.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export type CategoryKey = 'general' | 'career' | 'relationships' | 'health' | 'finances' | 'personalGrowth' | 'timing';

export interface CategoryLens {
  name: string;
  primaryField: string;           // Which template field is most relevant
  secondaryFields: string[];      // Supporting fields
  suppressFields: string[];       // Fields to de-emphasise
  narrativeFocus: string;         // How to frame the reading
  questionPrompt: string;         // Opening question for the user
  affirmationPrefix: string;
}

export const CATEGORY_LENSES: Record<CategoryKey, CategoryLens> = {
  general: {
    name: 'General Guidance',
    primaryField: 'essence',
    secondaryFields: ['careerAdvice', 'relationshipAdvice', 'growthAdvice'],
    suppressFields: [],
    narrativeFocus: 'A holistic view of the celestial weather and how it touches every area of your life.',
    questionPrompt: 'What is the sky asking you to notice right now?',
    affirmationPrefix: 'I am aligned with the wisdom of the stars',
  },
  career: {
    name: 'Career & Vocation',
    primaryField: 'careerAdvice',
    secondaryFields: ['growthAdvice', 'financesAdvice'],
    suppressFields: ['relationshipAdvice'],
    narrativeFocus: 'How the current celestial climate supports your professional path and public contribution.',
    questionPrompt: 'What is your work asking of you right now?',
    affirmationPrefix: 'I bring my authentic gifts to my work',
  },
  relationships: {
    name: 'Love & Connection',
    primaryField: 'relationshipAdvice',
    secondaryFields: ['growthAdvice', 'healthAdvice'],
    suppressFields: ['careerAdvice', 'financesAdvice'],
    narrativeFocus: 'How the current sky opens or challenges the doorways of intimacy and partnership.',
    questionPrompt: 'What is love teaching you in this season?',
    affirmationPrefix: 'I love with courage and receive with grace',
  },
  health: {
    name: 'Wellbeing & Vitality',
    primaryField: 'healthAdvice',
    secondaryFields: ['growthAdvice', 'bodyFocus'],
    suppressFields: ['careerAdvice', 'financesAdvice', 'relationshipAdvice'],
    narrativeFocus: 'How the celestial energies are speaking through your body and what they are asking you to honour.',
    questionPrompt: 'What is your body trying to tell you?',
    affirmationPrefix: 'I listen to my body with reverence and care',
  },
  finances: {
    name: 'Wealth & Resources',
    primaryField: 'financesAdvice',
    secondaryFields: ['careerAdvice', 'growthAdvice'],
    suppressFields: ['relationshipAdvice', 'healthAdvice'],
    narrativeFocus: 'How the current astrological weather influences your relationship with abundance, value, and exchange.',
    questionPrompt: 'What is your money trying to teach you about worth?',
    affirmationPrefix: 'I am a conscious steward of my resources',
  },
  personalGrowth: {
    name: 'Soul Development',
    primaryField: 'growthAdvice',
    secondaryFields: ['essence', 'healthAdvice'],
    suppressFields: ['careerAdvice', 'financesAdvice'],
    narrativeFocus: 'The deeper initiatory current running beneath the surface of daily life.',
    questionPrompt: 'Who are you becoming in this season?',
    affirmationPrefix: 'I grow through every experience, visible and hidden',
  },
  timing: {
    name: 'Timing & Decision',
    primaryField: 'essence',
    secondaryFields: ['growthAdvice', 'careerAdvice'],
    suppressFields: ['relationshipAdvice'],
    narrativeFocus: 'The celestial clock and what it reveals about when to act, when to wait, and when to release.',
    questionPrompt: 'What is the right timing for what wants to happen?',
    affirmationPrefix: 'I trust the rhythm of my life',
  },
};

/** Apply a category lens to template fields, returning ordered advice */
export function applyCategoryLens(
  template: Record<string, string>,
  category: CategoryKey
): { primary: string; secondary: string[]; affirmation: string } {
  const lens = CATEGORY_LENSES[category] || CATEGORY_LENSES.general;

  const primary = template[lens.primaryField] || template.essence || '';
  const secondary = lens.secondaryFields
    .map(f => template[f])
    .filter(Boolean) as string[];

  const affirmation = `${lens.affirmationPrefix}.`;

  return { primary, secondary, affirmation };
}
