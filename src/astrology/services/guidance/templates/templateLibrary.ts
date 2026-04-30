/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL GUIDANCE TEMPLATE LIBRARY v2
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Rich, fluid astrological guidance with:
 * - Complete planet × sign coverage (all 10 planets × 12 signs)
 * - Dynamic, non-robotic narrative assembly
 * - Holistic sky snapshot synthesis
 * - Zero API cost. Zero latency. Maximum depth.
 *
 * Architecture:
 * - Planet × Sign × Moon Phase × Aspect = unique guidance
 * - Narratives assembled from fluid sentence pools (never Mad-Libs)
 * - Personalization via birth chart integration
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Transit } from '../../natal/natalChart';
import type { CelestialBody } from '../../../types';
import { ALL_BODY_TEMPLATES } from './bodies';
import { PHASE_TRANSFORMS, applyPhaseTransform } from './phases';
import { applyAspectTransform } from './aspects';
import { applyCategoryLens, type CategoryKey } from './categories';
import type { DegreePattern } from './degreePatterns';
import { type ShapeReading } from './chartShapes';
import { type EnrichedPattern } from './patternInterpretationEngine';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface TemplateKey {
  planet: string;
  sign: string;
  moonPhase: string;
  aspect?: string;
  natalPlanet?: string;
}

export interface GuidanceTemplate {
  id: string;
  key: TemplateKey;
  category: 'career' | 'relationships' | 'health' | 'finances' | 'personalGrowth' | 'timing';
  confidence: 'high' | 'medium' | 'general';
  title: string;
  narrative: string;
  practicalAdvice: string[];
  affirmation: string;
  energyLevel: number; // -5 to +5
  keywords: string[];
}

export interface PersonalizedReading {
  title: string;
  summary: string;
  narrative: string;
  advice: string[];
  affirmation: string;
  transitContext?: string;
  confidence: number; // 0-100
  
  // AI-enhanced fields (when AI is enabled)
  poeticSummary?: string;
  affirmations?: string[];
  rituals?: string[];
  journalPrompts?: string[];
  
  // AI metadata
  aiGenerated?: boolean;
  aiProvider?: string;
  aiModel?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RICH SIGN & PLANET DATA
// ═══════════════════════════════════════════════════════════════════════════════

const ELEMENT_QUALITIES: Record<string, { approach: string; challenge: string; gift: string }> = {
  fire: {
    approach: 'with passion and initiative',
    challenge: 'impatience and burnout',
    gift: 'inspiration and bold action',
  },
  earth: {
    approach: 'with practical planning and steady effort',
    challenge: 'rigidity and material over-attachment',
    gift: 'tangible results and grounded wisdom',
  },
  air: {
    approach: 'through intellectual exploration and communication',
    challenge: 'overthinking and detachment',
    gift: 'clarity and innovative solutions',
  },
  water: {
    approach: 'through emotional intuition and deep feeling',
    challenge: 'overwhelm and emotional confusion',
    gift: 'empathy and creative flow',
  },
  ether: {
    approach: 'through transcendent awareness and alchemical transformation',
    challenge: 'dissociation and boundary dissolution',
    gift: 'healing, bridge-building, and metamorphic insight',
  },
};

const SIGN_DATA: Record<string, {
  element: string;
  modality: string;
  keywords: string[];
  climate: string;
  verb: string;
  virtue: string;
  shadow: string;
  bodyFocus: string;
}> = {
  aries: {
    element: 'fire', modality: 'cardinal', keywords: ['courage', 'initiation', 'independence'],
    climate: 'the quickening spark of early spring', verb: 'ignites', virtue: 'fearless honesty', shadow: 'impulsive reactivity',
    bodyFocus: 'head, eyes, adrenal system',
  },
  taurus: {
    element: 'earth', modality: 'fixed', keywords: ['stability', 'sensuality', 'patience'],
    climate: 'the fertile bloom of mid-spring', verb: 'steadies', virtue: 'reliable persistence', shadow: 'possessive stubbornness',
    bodyFocus: 'throat, neck, thyroid',
  },
  gemini: {
    element: 'air', modality: 'mutable', keywords: ['curiosity', 'adaptability', 'wit'],
    climate: 'the breezy interchange of late spring', verb: 'circulates', virtue: 'mental flexibility', shadow: 'scattered restlessness',
    bodyFocus: 'lungs, hands, nervous system',
  },
  cancer: {
    element: 'water', modality: 'cardinal', keywords: ['nurturing', 'intuition', 'protection'],
    climate: 'the tidal pull of early summer', verb: 'enfolds', virtue: 'deep empathy', shadow: 'clingy withdrawal',
    bodyFocus: 'stomach, breasts, lymphatic system',
  },
  leo: {
    element: 'fire', modality: 'fixed', keywords: ['creativity', 'generosity', 'confidence'],
    climate: 'the radiant heat of high summer', verb: 'illuminates', virtue: 'heartfelt leadership', shadow: 'prideful drama',
    bodyFocus: 'heart, spine, circulatory system',
  },
  virgo: {
    element: 'earth', modality: 'mutable', keywords: ['precision', 'service', 'health'],
    climate: 'the harvest discernment of late summer', verb: 'refines', virtue: 'helpful competence', shadow: 'critical anxiety',
    bodyFocus: 'digestive system, intestines, spleen',
  },
  libra: {
    element: 'air', modality: 'cardinal', keywords: ['harmony', 'beauty', 'diplomacy'],
    climate: 'the equinox balance of early autumn', verb: 'harmonizes', virtue: 'fair-minded grace', shadow: 'indecisive people-pleasing',
    bodyFocus: 'kidneys, skin, lower back',
  },
  scorpio: {
    element: 'water', modality: 'fixed', keywords: ['transformation', 'intensity', 'power'],
    climate: 'the deepening dark of late autumn', verb: 'penetrates', virtue: 'emotional courage', shadow: 'controlling suspicion',
    bodyFocus: 'reproductive system, eliminative organs',
  },
  sagittarius: {
    element: 'fire', modality: 'mutable', keywords: ['expansion', 'truth', 'adventure'],
    climate: 'the wandering flame of early winter', verb: 'expands', virtue: 'philosophical optimism', shadow: 'reckless bluntness',
    bodyFocus: 'hips, thighs, liver',
  },
  capricorn: {
    element: 'earth', modality: 'cardinal', keywords: ['ambition', 'responsibility', 'mastery'],
    climate: 'the stark summit of mid-winter', verb: 'structures', virtue: 'disciplined integrity', shadow: 'cold rigidity',
    bodyFocus: 'bones, joints, teeth',
  },
  aquarius: {
    element: 'air', modality: 'fixed', keywords: ['innovation', 'humanity', 'independence'],
    climate: 'the electric thaw of late winter', verb: 'awakens', virtue: 'visionary objectivity', shadow: 'detached rebellion',
    bodyFocus: 'calves, ankles, circulatory system',
  },
  pisces: {
    element: 'water', modality: 'mutable', keywords: ['compassion', 'imagination', 'unity'],
    climate: 'the dissolving mist of early spring', verb: 'dissolves', virtue: 'spiritual openness', shadow: 'escapist confusion',
    bodyFocus: 'feet, immune system, pineal gland',
  },
  ophiuchus: {
    element: 'ether', modality: 'fixed', keywords: ['healing', 'transformation', 'alchemy', 'initiation'],
    climate: 'the liminal threshold between death and rebirth', verb: 'transmutes', virtue: 'metamorphic wisdom', shadow: 'dissociative escapism',
    bodyFocus: 'spinal column, nervous system regeneration, subtle energy channels',
  },
};

const PLANET_ARCHETYPES: Record<string, {
  essence: string;
  domain: string;
  elementFocus: string;
  careerAdvice: string;
  relationshipAdvice: string;
  healthAdvice: string;
  financesAdvice: string;
  growthAdvice: string;
}> = {
  sun: {
    essence: 'Radiant core identity', domain: 'selfhood and purpose', elementFocus: 'vitality',
    careerAdvice: 'Step into visibility. Your authentic leadership is your greatest asset.',
    relationshipAdvice: 'Show up as your true self. Honesty builds the strongest bonds.',
    healthAdvice: 'Support your vital energy through activities that make you feel alive.',
    financesAdvice: 'Invest in what aligns with your core values. Your confidence attracts abundance.',
    growthAdvice: 'True strength includes the courage to be vulnerable.',
  },
  moon: {
    essence: 'Emotional inner world', domain: 'feelings and instincts', elementFocus: 'nurture',
    careerAdvice: 'Trust your gut on professional matters. Create a work environment that feels safe.',
    relationshipAdvice: 'Share your feelings without expecting them to be fixed. Emotional intimacy deepens connection.',
    healthAdvice: 'Your body speaks through emotions. Rest and nourishment are non-negotiable.',
    financesAdvice: 'Security matters now. Build reserves that help you sleep peacefully.',
    growthAdvice: 'All emotions are valid. Learning to hold them is the practice.',
  },
  mercury: {
    essence: 'Mental agility and perception', domain: 'communication and learning', elementFocus: 'intellect',
    careerAdvice: 'Share your ideas freely. Writing, teaching, and negotiation are favored.',
    relationshipAdvice: 'Listen as much as you speak. Curiosity dissolves conflict.',
    healthAdvice: 'Guard your nervous system. Mental rest is as important as physical rest.',
    financesAdvice: 'Research before committing. Multiple small options may suit you better than one big bet.',
    growthAdvice: 'Not everything needs to be figured out. Some truths arrive in silence.',
  },
  venus: {
    essence: 'Relational harmony and aesthetics', domain: 'love and values', elementFocus: 'connection',
    careerAdvice: 'Collaboration succeeds over competition. Beauty and diplomacy open doors.',
    relationshipAdvice: 'Express appreciation generously. Small gestures of love compound.',
    healthAdvice: 'Pleasure is medicine. Balance and harmony support your wellbeing.',
    financesAdvice: 'Invest in beauty and relationships. What you value determines your wealth.',
    growthAdvice: 'Your needs matter as much as anyone else’s. True giving includes receiving.',
  },
  mars: {
    essence: 'Drive and assertion', domain: 'action and desire', elementFocus: 'courage',
    careerAdvice: 'Take initiative on stalled projects. Your competitive edge is sharp.',
    relationshipAdvice: 'Express desires directly. Healthy conflict clears the air.',
    healthAdvice: 'Channel energy into physical movement. Avoid letting frustration fester.',
    financesAdvice: 'Bold moves can pay off, but avoid impulsive risks driven by ego.',
    growthAdvice: 'Anger is information. Use it as fuel, not a weapon.',
  },
  jupiter: {
    essence: 'Expansion and wisdom', domain: 'growth and opportunity', elementFocus: 'abundance',
    careerAdvice: 'Think bigger. Teaching, publishing, and visionary projects flourish.',
    relationshipAdvice: 'Share adventures and philosophies. Generosity attracts love.',
    healthAdvice: 'Optimism boosts immunity. Outdoor activity and laughter restore balance.',
    financesAdvice: 'Long-term growth investments suit now. Education pays dividends.',
    growthAdvice: 'Stay humble as you expand. Wisdom without compassion is arrogance.',
  },
  saturn: {
    essence: 'Structure and maturation', domain: 'discipline and responsibility', elementFocus: 'mastery',
    careerAdvice: 'Show up consistently. Authority figures recognize competence over charisma.',
    relationshipAdvice: 'Commitment is shown through reliability. Patience builds trust.',
    healthAdvice: 'Consistency outperforms intensity. Support bones, joints, and structural health.',
    financesAdvice: 'Conservative, structured plans build lasting security. Avoid shortcuts.',
    growthAdvice: 'Limitations are teachers. Working with constraints builds true skill.',
  },
  uranus: {
    essence: 'Innovation and liberation', domain: 'change and individuality', elementFocus: 'awakening',
    careerAdvice: 'Bring fresh perspectives. Technology and group dynamics favor you.',
    relationshipAdvice: 'Friendship and freedom strengthen bonds. Avoid possessive control.',
    healthAdvice: 'Sudden insights about your body may arise. Experiment with new routines.',
    financesAdvice: 'Unconventional opportunities may appear. Stay informed, not impulsive.',
    growthAdvice: 'Discomfort with the status quo is a signal. Trust your unique path.',
  },
  neptune: {
    essence: 'Dreams and dissolution', domain: 'imagination and spirituality', elementFocus: 'transcendence',
    careerAdvice: 'Creative and healing professions flourish. Trust intuitive hunches.',
    relationshipAdvice: 'Soul connections transcend logic. Compassion requires discernment.',
    healthAdvice: 'Rest, dreams, and boundaries protect your energy. Avoid substances as escape.',
    financesAdvice: 'Intuitive guidance may surprise you. Verify dreams with practical checks.',
    growthAdvice: 'You are both the wave and the ocean. Let go of the need to control.',
  },
  pluto: {
    essence: 'Transformation and power', domain: 'death and rebirth', elementFocus: 'regeneration',
    careerAdvice: 'Research, investigation, and deep work excel. Trust intuition on hidden matters.',
    relationshipAdvice: 'Depth over breadth. Meaningful intimacy requires vulnerability.',
    healthAdvice: 'Release what no longer serves. Deep cleansing and renewal are supported.',
    financesAdvice: 'Joint resources and investments benefit from thorough research.',
    growthAdvice: 'Letting go is not failure. It is the prerequisite for authentic power.',
  },
  chiron: {
    essence: 'The wounded healer', domain: 'healing and integration', elementFocus: 'wholeness',
    careerAdvice: 'Healing professions, mentoring, and depth work align with your gifts.',
    relationshipAdvice: 'Your deepest wounds become your greatest teachers in love.',
    healthAdvice: 'Listen to chronic symptoms — they carry messages your body needs you to hear.',
    financesAdvice: 'Invest in healing, education, and tools that support your integration.',
    growthAdvice: 'Your vulnerability is not weakness. It is the doorway to your medicine.',
  },
  northNode: {
    essence: 'Soul purpose and evolutionary direction', domain: 'karmic growth and destiny', elementFocus: 'calling',
    careerAdvice: 'Follow what feels unfamiliar but magnetic. Growth lives outside comfort.',
    relationshipAdvice: 'The people who challenge you most are your greatest teachers.',
    healthAdvice: 'Your body knows the way forward before your mind agrees. Trust its signals.',
    financesAdvice: 'Invest in your future self. What supports your soul\'s path is never wasted.',
    growthAdvice: 'The path of least resistance leads away from your purpose. Choose the climb.',
  },
  lilith: {
    essence: 'Wild feminine and primal instinct', domain: 'repressed desire and shadow power', elementFocus: 'liberation',
    careerAdvice: 'Fields that honour autonomy, sexuality, and boundary-breaking suit you.',
    relationshipAdvice: 'Your unapologetic truth is not too much. It is exactly enough.',
    healthAdvice: 'Reclaim the parts of your body and desire that were shamed or denied.',
    financesAdvice: 'Wealth that funds your freedom is worth more than wealth that funds your cage.',
    growthAdvice: 'What was banished to your shadow holds your greatest power. Integrate it.',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLANET-SIGN CORE TEMPLATES (hand-crafted luminaries + generated coverage)
// ═══════════════════════════════════════════════════════════════════════════════

type PlanetSignTemplate = {
  essence: string;
  element: string;
  modality: string;
  keywords: string[];
  careerAdvice: string;
  relationshipAdvice: string;
  healthAdvice: string;
  financesAdvice: string;
  growthAdvice: string;
};

// ═══════════════════════════════════════════════════════════════════════════════
// REAL HAND-CRAFTED TEMPLATES (imported from 13 body files × 13 signs each)
// ═══════════════════════════════════════════════════════════════════════════════

const PLANET_SIGN_TEMPLATES: Record<string, Record<string, PlanetSignTemplate>> = {};

// Merge all imported real templates into the lookup structure
for (const [bodyName, bodyMap] of Object.entries(ALL_BODY_TEMPLATES)) {
  PLANET_SIGN_TEMPLATES[bodyName] = {};
  for (const [sign, template] of Object.entries(bodyMap)) {
    PLANET_SIGN_TEMPLATES[bodyName][sign] = template as PlanetSignTemplate;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOON PHASE MODIFIERS (8 phases)
// ═══════════════════════════════════════════════════════════════════════════════

const MOON_PHASE_MODIFIERS: Record<string, { 
  multiplier: number; 
  prefix: string; 
  theme: string;
  timingAdvice: string;
}> = {
  'new-moon': { multiplier: 1.5, prefix: 'Seeding', theme: 'New beginnings, intention setting, initiation', timingAdvice: 'Start new projects. Plant seeds for future harvest.' },
  'waxing-crescent': { multiplier: 1.3, prefix: 'Building', theme: 'Gathering resources, initial growth, commitment', timingAdvice: 'Take first steps. Gather what you need.' },
  'first-quarter': { multiplier: 1.4, prefix: 'Activating', theme: 'Action, overcoming obstacles, decision', timingAdvice: 'Push through resistance. Make key decisions.' },
  'waxing-gibbous': { multiplier: 1.2, prefix: 'Refining', theme: 'Adjustment, preparation, attention to detail', timingAdvice: 'Refine and improve. Prepare for culmination.' },
  'full-moon': { multiplier: 1.6, prefix: 'Illuminating', theme: 'Culmination, revelation, release', timingAdvice: 'Celebrate completions. Release what no longer serves.' },
  'waning-gibbous': { multiplier: 1.1, prefix: 'Sharing', theme: 'Gratitude, teaching, dissemination', timingAdvice: 'Share your wisdom. Express gratitude.' },
  'last-quarter': { multiplier: 1.3, prefix: 'Releasing', theme: 'Letting go, forgiveness, composting', timingAdvice: 'Clear out the old. Make space for new.' },
  'waning-crescent': { multiplier: 1.4, prefix: 'Restoring', theme: 'Rest, integration, dream time', timingAdvice: 'Rest and restore. Trust the underground process.' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASPECT MODIFIERS (Major aspects)
// ═══════════════════════════════════════════════════════════════════════════════

const ASPECT_MODIFIERS: Record<string, {
  conjunction: { flavor: string; intensity: number; advice: string };
  sextile: { flavor: string; intensity: number; advice: string };
  square: { flavor: string; intensity: number; advice: string };
  trine: { flavor: string; intensity: number; advice: string };
  opposition: { flavor: string; intensity: number; advice: string };
}> = {
  sun: {
    conjunction: { flavor: 'Core identity activated', intensity: 1.5, advice: 'Your essence shines clearly. Express authentically.' },
    sextile: { flavor: 'Creative opportunities flow', intensity: 1.2, advice: 'Opportunities for self-expression present themselves.' },
    square: { flavor: 'Identity tension requires integration', intensity: 1.3, advice: 'Internal conflict clarifies what you truly want.' },
    trine: { flavor: 'Natural confidence and ease', intensity: 1.4, advice: 'Your path flows with less resistance. Move forward.' },
    opposition: { flavor: 'Relationships mirror your growth', intensity: 1.3, advice: 'Others reflect what you need to see about yourself.' },
  },
  moon: {
    conjunction: { flavor: 'Emotional truth surfaces', intensity: 1.4, advice: 'Feel fully. Your emotions guide you now.' },
    sextile: { flavor: 'Emotional opportunities arise', intensity: 1.1, advice: 'Supportive feelings enable gentle progress.' },
    square: { flavor: 'Emotional tension demands action', intensity: 1.4, advice: 'Discomfort motivates necessary change.' },
    trine: { flavor: 'Emotional flow and support', intensity: 1.3, advice: 'Trust your intuition. Feelings align with action.' },
    opposition: { flavor: 'Emotional balance through awareness', intensity: 1.4, advice: 'Notice what triggers you. It shows your growth edge.' },
  },
  mercury: {
    conjunction: { flavor: 'Mental clarity and communication peak', intensity: 1.3, advice: 'Express your ideas. Your mind is sharp.' },
    sextile: { flavor: 'Learning opportunities present', intensity: 1.1, advice: 'Conversations lead to insights. Stay curious.' },
    square: { flavor: 'Mental tension or miscommunication', intensity: 1.3, advice: 'Clarify misunderstandings. Think before speaking.' },
    trine: { flavor: 'Clear thinking and easy communication', intensity: 1.2, advice: 'Your ideas flow well. Share them confidently.' },
    opposition: { flavor: 'Mental balancing through dialogue', intensity: 1.2, advice: 'Consider opposing viewpoints. Dialogue creates clarity.' },
  },
  venus: {
    conjunction: { flavor: 'Love and values come into focus', intensity: 1.4, advice: 'What you value becomes clear. Choose accordingly.' },
    sextile: { flavor: 'Harmonious connections possible', intensity: 1.2, advice: 'Social and romantic opportunities flow.' },
    square: { flavor: 'Relationship or value tensions', intensity: 1.3, advice: 'Conflict reveals what truly matters to you.' },
    trine: { flavor: 'Natural attraction and ease', intensity: 1.3, advice: 'Love and creativity flow. Enjoy the beauty.' },
    opposition: { flavor: 'Partnership dynamics highlighted', intensity: 1.4, advice: 'Relationships show you your values. Learn from them.' },
  },
  mars: {
    conjunction: { flavor: 'Action and drive intensify', intensity: 1.5, advice: 'Use this energy constructively. Channel ambition.' },
    sextile: { flavor: 'Energetic opportunities for action', intensity: 1.2, advice: 'Take initiative. Your drive meets opportunity.' },
    square: { flavor: 'Conflict or aggressive tension', intensity: 1.5, advice: 'Friction creates momentum. Direct conflict wisely.' },
    trine: { flavor: 'Smooth energy for achievement', intensity: 1.4, advice: 'Your actions flow with less resistance. Move!' },
    opposition: { flavor: 'Balancing self and other', intensity: 1.4, advice: 'Competition or conflict clarifies boundaries.' },
  },
  jupiter: {
    conjunction: { flavor: 'Expansion and growth activated', intensity: 1.4, advice: 'Think bigger. Opportunities for growth abound.' },
    sextile: { flavor: 'Fortunate opportunities emerge', intensity: 1.3, advice: 'Luck favors preparation. Seize opportunities.' },
    square: { flavor: 'Excess or overcommitment risk', intensity: 1.3, advice: 'Growth requires discipline. Avoid overextension.' },
    trine: { flavor: 'Natural abundance and blessing', intensity: 1.4, advice: 'Blessings flow. Gratitude amplifies abundance.' },
    opposition: { flavor: 'Balancing expansion with reality', intensity: 1.3, advice: 'Opportunities come with responsibilities. Choose wisely.' },
  },
  saturn: {
    conjunction: { flavor: 'Responsibility and maturation focus', intensity: 1.5, advice: 'Accept what must be done. Structure creates freedom.' },
    sextile: { flavor: 'Disciplined effort rewarded', intensity: 1.2, advice: 'Hard work meets opportunity. Persist.' },
    square: { flavor: 'Restrictions or challenging limits', intensity: 1.5, advice: 'Obstacles build strength. Work with limitations.' },
    trine: { flavor: 'Steady progress through discipline', intensity: 1.3, advice: 'Your efforts compound. Stay the course.' },
    opposition: { flavor: 'Authority or structure challenges', intensity: 1.4, advice: 'External pressure clarifies your stance.' },
  },
  uranus: {
    conjunction: { flavor: 'Sudden awakening and liberation', intensity: 1.5, advice: 'Expect the unexpected. Flexibility is your ally.' },
    sextile: { flavor: 'Innovative opportunities spark', intensity: 1.3, advice: 'Experiment with new approaches. Break routines gently.' },
    square: { flavor: 'Disruption and restless tension', intensity: 1.5, advice: 'Change is unavoidable. Ride the wave rather than resist.' },
    trine: { flavor: 'Effortless insight and originality', intensity: 1.4, advice: 'Trust your unconventional ideas. They carry wisdom.' },
    opposition: { flavor: 'Freedom versus stability tension', intensity: 1.4, advice: 'Balance your need for independence with commitments.' },
  },
  neptune: {
    conjunction: { flavor: 'Spiritual dissolution and dream activation', intensity: 1.4, advice: 'Dreams are vivid now. Ground inspiration in action.' },
    sextile: { flavor: 'Gentle intuition and creative flow', intensity: 1.2, advice: 'Create something beautiful. Let intuition guide you.' },
    square: { flavor: 'Confusion and idealization fog', intensity: 1.4, advice: 'Discernment is essential. Verify before trusting.' },
    trine: { flavor: 'Deep compassion and artistic ease', intensity: 1.3, advice: 'Meditation, art, and music restore your soul.' },
    opposition: { flavor: 'Reality versus fantasy tension', intensity: 1.4, advice: 'Honor your dreams without abandoning practical needs.' },
  },
  pluto: {
    conjunction: { flavor: 'Profound transformation and power', intensity: 1.6, advice: 'Let old versions of yourself die. Rebirth follows.' },
    sextile: { flavor: 'Opportunities for deep healing', intensity: 1.3, advice: 'Therapy, shadow work, and honest inquiry flourish.' },
    square: { flavor: 'Intense power struggles', intensity: 1.6, advice: 'Release the need to control outcomes. Trust the process.' },
    trine: { flavor: 'Empowered transformation', intensity: 1.5, advice: 'You have the strength to face what you fear.' },
    opposition: { flavor: 'Projection and confrontation', intensity: 1.5, advice: 'What angers you in others shows your own shadow.' },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FLUID NARRATIVE VARIATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const NARRATIVE_OPENERS = [
  'Right now, {essence}.',
  'The cosmos invites you to notice how {essence}.',
  'There is a current of energy suggesting that {essence}.',
  'You are moving through a season where {essence}.',
  'Today, the celestial weather whispers that {essence}.',
  'A subtle shift in the sky reveals that {essence}.',
  'Pay attention to the way {essence}.',
];

const NARRATIVE_TRANSITIONS = [
  'This shapes how you {approach}.',
  'You may find yourself approaching life {approach}.',
  'Your natural rhythm leans toward {approach}.',
  'This invites you to move {approach}.',
  'Notice how you instinctively respond {approach}.',
];

const NARRATIVE_PHASE_INTEGRATIONS = [
  'The {moonPhase} moon underscores this by calling for {theme}.',
  'With the moon in her {moonPhase} phase, the theme is {theme}.',
  'The lunar cycle adds its voice: {theme}.',
  'The {moonPhase} moon weaves through this, reminding you of {theme}.',
];

const NARRATIVE_ASPECT_INTEGRATIONS = [
  'A key transit deepens this: {aspectFlavor}.',
  'Meanwhile, the sky highlights: {aspectFlavor}.',
  'A celestial conversation adds nuance: {aspectFlavor}.',
  'The transits speak too: {aspectFlavor}.',
];

const NARRATIVE_ELEMENT_INTEGRATIONS = [
  'Your {element} nature resonates strongly with this current.',
  'This energy speaks directly to your {element} soul.',
  'As someone attuned to {element}, you feel this more acutely.',
  'The {element} in you recognizes this frequency immediately.',
];

const NARRATIVE_CLOSERS = [
  'Trust the timing. The sky never rushes, yet everything arrives.',
  'Let this unfold in its own rhythm.',
  'You do not need to force what is already in motion.',
  'Pay attention to what feels activated. That is your compass.',
  'There is wisdom here, even if it only makes sense in hindsight.',
  'Allow yourself to be changed by what you observe.',
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE GENERATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class TemplateLibrary {
  private cache: Map<string, PersonalizedReading> = new Map();
  
  constructor() {
    this.initializeTemplates();
  }
  
  /**
   * Generate template key for lookup
   */
  private generateKey(params: TemplateKey): string {
    return `${params.planet}-${params.sign}-${params.moonPhase}${params.aspect ? `-${params.aspect}` : ''}${params.natalPlanet ? `-${params.natalPlanet}` : ''}`;
  }
  
  /**
   * Initialize the template library with generated combinations
   */
  private initializeTemplates(): void {
    // Generate missing planet-sign templates on-the-fly so every combination is covered
    const planets = Object.keys(PLANET_ARCHETYPES);
    const signs = Object.keys(SIGN_DATA);
    
    for (const planet of planets) {
      if (!PLANET_SIGN_TEMPLATES[planet]) {
        PLANET_SIGN_TEMPLATES[planet] = {};
      }
      for (const sign of signs) {
        if (!PLANET_SIGN_TEMPLATES[planet][sign]) {
          PLANET_SIGN_TEMPLATES[planet][sign] = this.generateSyntheticTemplate(planet, sign);
        }
      }
    }
  }
  
  /**
   * Generate a rich synthetic template for any planet-sign combo not hand-written.
   * Uses elemental qualities, sign metadata, and archetype data to produce
   * compelling, non-formulaic output that rivals hand-written templates.
   */
  private generateSyntheticTemplate(planet: string, sign: string): PlanetSignTemplate {
    const archetype = PLANET_ARCHETYPES[planet];
    const signData = SIGN_DATA[sign];
    const elementQuality = ELEMENT_QUALITIES[signData.element];

    // Rich essence variants — never the same Mad-Libs structure twice
    const essencePool = [
      `${archetype.essence} that ${signData.verb} through ${signData.climate}`,
      `${archetype.essence}, ${signData.verb} within ${signData.climate}`,
      `The ${archetype.domain} takes on ${signData.climate} — ${archetype.essence.toLowerCase()} ${signData.verb} here`,
      `${archetype.essence} finds its expression ${elementQuality.approach}, ${signData.verb} through ${signData.climate}`,
    ];
    const essence = essencePool[this.hashString(`${planet}-${sign}-essence`) % essencePool.length];

    // Career advice — weave archetype advice with sign-specific climate
    const careerPool = [
      `${archetype.careerAdvice} In ${this.capitalize(sign)} territory, ${signData.virtue.toLowerCase()} is your professional edge.`,
      `${archetype.careerAdvice} The ${this.capitalize(sign)} climate rewards those who ${signData.verb} with intention.`,
      `Your career path aligns with ${archetype.domain}. ${signData.virtue} opens doors in ${this.capitalize(sign)} season.`,
    ];

    // Relationship advice
    const relationshipPool = [
      `${archetype.relationshipAdvice} ${signData.virtue} deepens connection when expressed ${elementQuality.approach}.`,
      `${archetype.relationshipAdvice} In ${this.capitalize(sign)} energy, relationships grow through ${signData.verb}.`,
      `Love flows best when you honour ${signData.virtue.toLowerCase()}. ${archetype.relationshipAdvice}`,
    ];

    // Health advice
    const healthPool = [
      `${archetype.healthAdvice} The ${this.capitalize(sign)} body asks attention at ${signData.bodyFocus}.`,
      `${archetype.healthAdvice} ${signData.shadow} may manifest physically — tend to ${signData.bodyFocus}.`,
      `Your vitality aligns with ${archetype.elementFocus}. Support ${signData.bodyFocus} through practices that ${signData.verb}.`,
    ];

    // Financial advice
    const financePool = [
      `${archetype.financesAdvice} ${signData.virtue} guides wise resource management in ${this.capitalize(sign)}.`,
      `${archetype.financesAdvice} The ${signData.climate} favours patient, ${signData.modality} approaches to wealth.`,
      `Financial clarity arrives ${elementQuality.approach}. ${archetype.financesAdvice}`,
    ];

    // Growth advice
    const growthPool = [
      `${archetype.growthAdvice} ${signData.shadow} surfaces as your teacher — meet it with ${signData.virtue.toLowerCase()}.`,
      `${archetype.growthAdvice} Growth in ${this.capitalize(sign)} asks you to ${signData.verb} beyond comfort.`,
      `Your edge lives where ${signData.shadow} meets ${signData.virtue.toLowerCase()}. ${archetype.growthAdvice}`,
    ];

    const hash = this.hashString(`${planet}-${sign}`);

    return {
      essence,
      element: signData.element,
      modality: signData.modality,
      keywords: signData.keywords,
      careerAdvice: careerPool[hash % careerPool.length],
      relationshipAdvice: relationshipPool[hash % relationshipPool.length],
      healthAdvice: healthPool[hash % healthPool.length],
      financesAdvice: financePool[hash % financePool.length],
      growthAdvice: growthPool[hash % growthPool.length],
    };
  }
  
  private getBaseTemplate(planet: string, sign: string): PlanetSignTemplate | undefined {
    return PLANET_SIGN_TEMPLATES[planet]?.[sign];
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
  
  private pickFrom<T>(arr: T[], hash: number): T {
    return arr[hash % arr.length];
  }
  
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  private joinWithAnd(items: string[]): string {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
  }
  
  private shuffleWithHash<T>(arr: T[], hash: number): T[] {
    const result = [...arr];
    let h = hash;
    for (let i = result.length - 1; i > 0; i--) {
      h = ((h * 31) + 17) & 0x7fffffff;
      const j = h % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  
  /**
   * Generate a personalized reading from templates
   */
  generateReading(params: {
    planet: string;
    sign: string;
    moonPhase: string;
    transit?: Transit;
    userElement?: string;
    category?: string;
  }): PersonalizedReading {
    const cacheKey = this.generateKey({
      planet: params.planet,
      sign: params.sign,
      moonPhase: params.moonPhase,
      aspect: params.transit?.aspect,
      natalPlanet: params.transit?.natalPlanet,
    });
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    // Get base template
    const baseTemplate = this.getBaseTemplate(params.planet, params.sign);
    if (!baseTemplate) {
      return this.generateFallbackReading(params);
    }
    
    // Get moon phase modifier
    const phaseModifier = MOON_PHASE_MODIFIERS[params.moonPhase] || MOON_PHASE_MODIFIERS['new-moon'];
    
    // Get aspect modifier if applicable
    let aspectModifier = null;
    if (params.transit && ASPECT_MODIFIERS[params.transit.transitingPlanet]) {
      const planetAspects = ASPECT_MODIFIERS[params.transit.transitingPlanet];
      const aspectKey = params.transit.aspect as keyof typeof planetAspects;
      aspectModifier = planetAspects[aspectKey] || undefined;
    }
    
    // Get element quality
    const elementQuality = ELEMENT_QUALITIES[baseTemplate.element] || ELEMENT_QUALITIES.fire;
    
    // Generate personalized reading
    const reading = this.assembleReading({
      baseTemplate,
      phaseModifier,
      aspectModifier,
      elementQuality,
      transit: params.transit,
      userElement: params.userElement,
      category: params.category,
      hash: this.hashString(cacheKey),
    });
    
    // Cache for performance
    this.cache.set(cacheKey, reading);
    
    return reading;
  }
  
  /**
   * Assemble a fluid, human reading from components — Assembly Engine v3
   *
   * Weaves rather than concatenates: the phase, aspect, and category
   * transforms interleave with the template text to create seamless
   * narratives that feel authored, not assembled.
   */
  private assembleReading(params: {
    baseTemplate: PlanetSignTemplate;
    phaseModifier: typeof MOON_PHASE_MODIFIERS[string];
    aspectModifier: any;
    elementQuality: typeof ELEMENT_QUALITIES[string];
    transit?: Transit;
    userElement?: string;
    category?: string;
    hash: number;
  }): PersonalizedReading {
    const { baseTemplate, phaseModifier, aspectModifier, elementQuality, transit, userElement, category, hash } = params;

    // ── Phase lens: reframe essence through lunar cycle ──
    const phaseKey = Object.keys(MOON_PHASE_MODIFIERS).find(
      k => MOON_PHASE_MODIFIERS[k].prefix === phaseModifier.prefix
    ) || 'new-moon';
    let essenceText = applyPhaseTransform(baseTemplate.essence, phaseKey, '');

    // ── Aspect lens: weave transit tension into narrative ──
    if (aspectModifier && transit) {
      essenceText = applyAspectTransform(essenceText, transit.aspect, transit.transitingPlanet, transit.natalPlanet);
    }

    // ── Category lens: focus advice on user's concern ──
    const catKey = (category || 'general') as CategoryKey;
    const lensed = applyCategoryLens(baseTemplate as unknown as Record<string, string>, catKey);

    // ── Build woven narrative ──
    const opener = this.pickFrom(NARRATIVE_OPENERS, hash)
      .replace('{essence}', essenceText.toLowerCase());

    const transition = this.pickFrom(NARRATIVE_TRANSITIONS, hash + 1)
      .replace('{approach}', elementQuality.approach);

    const phaseIntegration = this.pickFrom(NARRATIVE_PHASE_INTEGRATIONS, hash + 2)
      .replace('{moonPhase}', phaseModifier.prefix.toLowerCase())
      .replace('{theme}', phaseModifier.theme.toLowerCase());

    let narrative = `${opener} ${transition} ${phaseIntegration}`;

    if (aspectModifier) {
      const aspectIntegration = this.pickFrom(NARRATIVE_ASPECT_INTEGRATIONS, hash + 3)
        .replace('{aspectFlavor}', aspectModifier.flavor);
      narrative += ` ${aspectIntegration}`;
    }

    if (userElement === baseTemplate.element) {
      const elementIntegration = this.pickFrom(NARRATIVE_ELEMENT_INTEGRATIONS, hash + 4)
        .replace('{element}', userElement);
      narrative += ` ${elementIntegration}`;
    }

    // Add elemental resonance from template
    if ((baseTemplate as any).elementalResonance) {
      const resonance = (baseTemplate as any).elementalResonance;
      narrative += ` ${resonance}`;
    }

    const closer = this.pickFrom(NARRATIVE_CLOSERS, hash + 5);
    narrative += ` ${closer}`;

    // ── Advice pool: category-lensed + phase + aspect ──
    const advicePool: string[] = [lensed.primary, ...lensed.secondary];
    advicePool.push(phaseModifier.timingAdvice);
    if (aspectModifier) {
      advicePool.push(aspectModifier.advice);
    }

    const advice = this.shuffleWithHash(advicePool, hash).slice(0, 4);

    // ── Affirmation: from category lens or template ──
    const affirmation = lensed.affirmation || `I embrace ${baseTemplate.keywords[0]} and ${baseTemplate.keywords[1]} with ${baseTemplate.element} energy.`;

    // ── Confidence: influenced by aspect intensity + phase ──
    const confidence = aspectModifier
      ? Math.round(aspectModifier.intensity * 65)
      : Math.round(phaseModifier.multiplier * 65);

    // ── Transit context ──
    let transitContext: string | undefined;
    if (transit) {
      transitContext = `${this.capitalize(transit.transitingPlanet)} ${transit.aspect} your natal ${transit.natalPlanet} (${transit.orb.toFixed(1)}° ${transit.applying ? 'applying' : 'separating'})`;
    }

    // ── Dynamic title ──
    const phaseTransform = PHASE_TRANSFORMS[phaseKey];
    const title = phaseTransform
      ? `${phaseTransform.name}: ${baseTemplate.essence.split('.')[0]}`
      : `${phaseModifier.prefix}: ${baseTemplate.essence.split('.')[0]}`;

    return {
      title,
      summary: baseTemplate.essence,
      narrative,
      advice,
      affirmation,
      transitContext,
      confidence: Math.min(100, confidence),
    };
  }
  
  /**
   * Synthesize a holistic snapshot reading from the entire sky — v3 with patterns
   */
  synthesizeSnapshot(params: {
    positions: Record<string, CelestialBody>;
    moonPhase: { phase: string; sign?: string };
    retrogrades: string[];
    dominantElement?: string;
    transits?: Transit[];
    planetaryHour?: string;
    journalThemes?: string[];
    chartPatterns?: EnrichedPattern[];
    degreePatterns?: Array<{ planet: string; pattern: DegreePattern }>;
    chartShape?: ShapeReading;
  }): PersonalizedReading {
    const { positions, moonPhase, retrogrades, dominantElement, transits, planetaryHour, journalThemes, chartPatterns, degreePatterns, chartShape } = params;
    const hash = this.hashString(JSON.stringify({
      sun: positions.sun?.sign,
      moon: positions.moon?.sign,
      phase: moonPhase.phase,
      retro: retrogrades.join(','),
    }));

    const paragraphs: string[] = [];

    // Paragraph 1: Luminaries + moon phase
    const sun = positions.sun;
    const moon = positions.moon;
    if (sun && moon) {
      const sunTemplate = this.getBaseTemplate('sun', sun.sign);
      const moonTemplate = this.getBaseTemplate('moon', moon.sign);
      const phase = MOON_PHASE_MODIFIERS[moonPhase.phase] || MOON_PHASE_MODIFIERS['new-moon'];

      const sunDesc = sunTemplate
        ? sunTemplate.essence.toLowerCase().replace(/^(the |a |an )/i, '')
        : `radiates in ${this.capitalize(sun.sign)}`;
      const moonDesc = moonTemplate
        ? moonTemplate.essence.toLowerCase().replace(/^(the |a |an )/i, '')
        : `moves through ${this.capitalize(moon.sign)}`;

      paragraphs.push(
        `The Sun ${sunDesc} in ${this.capitalize(sun.sign)}, while the Moon ${moonDesc} through ${this.capitalize(moon.sign)}. ` +
        `The ${phase.prefix.toLowerCase()} moon brings a theme of ${phase.theme.toLowerCase()}.`
      );
    }

    // Paragraph 2: Personal planets
    const personalPlanets = ['mercury', 'venus', 'mars'].filter(p => positions[p]);
    if (personalPlanets.length > 0) {
      const descriptions = personalPlanets.map(p => {
        const template = this.getBaseTemplate(p, positions[p].sign);
        const desc = template
          ? template.essence.toLowerCase().replace(/^(the |a |an )/i, '')
          : `moves through ${this.capitalize(positions[p].sign)}`;
        return `${this.capitalize(p)} ${desc} in ${this.capitalize(positions[p].sign)}`;
      });
      paragraphs.push(`The personal planets color your day: ${this.joinWithAnd(descriptions)}.`);
    }

    // Paragraph 3: Social planets
    const socialPlanets = ['jupiter', 'saturn'].filter(p => positions[p]);
    if (socialPlanets.length > 0) {
      const descriptions = socialPlanets.map(p => {
        const template = this.getBaseTemplate(p, positions[p].sign);
        const desc = template
          ? template.essence.toLowerCase().replace(/^(the |a |an )/i, '')
          : `moves through ${this.capitalize(positions[p].sign)}`;
        return `${this.capitalize(p)} ${desc}`;
      });
      paragraphs.push(`The larger forces at play: ${this.joinWithAnd(descriptions)}.`);
    }

    // Paragraph 4: Outer planets (only if retrograde or making strong transits)
    const activeOuterPlanets = ['uranus', 'neptune', 'pluto'].filter(p => {
      if (!positions[p]) return false;
      return retrogrades.includes(p) || (transits || []).some(t => t.transitingPlanet === p && t.orb < 3);
    });
    if (activeOuterPlanets.length > 0) {
      const descriptions = activeOuterPlanets.map(p => {
        const template = this.getBaseTemplate(p, positions[p].sign);
        const desc = template
          ? template.essence.toLowerCase().replace(/^(the |a |an )/i, '')
          : `in ${this.capitalize(positions[p].sign)}`;
        return `${this.capitalize(p)} ${desc}${retrogrades.includes(p) ? ', moving retrograde' : ''}`;
      });
      paragraphs.push(`Slow-moving archetypes shape the background: ${this.joinWithAnd(descriptions)}.`);
    }

    // Paragraph 5: Chart patterns (NEW — combinations create meaning)
    if (chartPatterns && chartPatterns.length > 0) {
      const topPattern = chartPatterns[0];
      paragraphs.push(
        `A significant pattern structures your chart: ${topPattern.name} involving ${this.joinWithAnd(topPattern.planets)}. ` +
        `${topPattern.narrative.split('.')[0]}.`
      );
      if (chartPatterns.length > 1) {
        const second = chartPatterns[1];
        paragraphs.push(
          `Also present: ${second.name}. ${second.narrative.split('.')[0]}.`
        );
      }
    }

    // Paragraph 6: Chart shape (NEW — overall architecture)
    if (chartShape && chartShape.shape !== 'none') {
      paragraphs.push(
        `Your chart forms a ${chartShape.name}: ${chartShape.description} ` +
        `${chartShape.lifeStrategy}`
      );
    }

    // Paragraph 7: Degree patterns (NEW — critical degrees)
    if (degreePatterns && degreePatterns.length > 0) {
      const topDegree = degreePatterns[0];
      paragraphs.push(
        `${this.capitalize(topDegree.planet)} sits at a sensitive degree (${topDegree.pattern.degree.toFixed(1)}°). ` +
        `${topDegree.pattern.meaning}`
      );
    }

    // Paragraph 8: Elemental resonance
    if (dominantElement) {
      const elementLines: Record<string, string[]> = {
        fire: [
          `Your fire-dominant nature finds kindling in this sky. Action, courage, and creative risk are favored.`,
          `The fire in your chart dances with today's energies. Passion is your ally now.`,
        ],
        earth: [
          `Your earth-dominant constitution appreciates the steady, tangible quality of this moment. Build slowly.`,
          `The earth in your chart grounds these celestial currents. Practical steps matter most.`,
        ],
        air: [
          `Your air-dominant mind finds clarity in the patterns above. Ideas want to be shared.`,
          `The air in your chart circulates these energies through thought, dialogue, and connection.`,
        ],
        water: [
          `Your water-dominant soul feels these shifts before your mind names them. Trust the current.`,
          `The water in your chart absorbs and reflects the sky's mood. Emotional truth is your guide.`,
        ],
        ether: [
          `Your ether-dominant awareness perceives the hidden patterns that connect what appears separate. Trust your initiatory sight.`,
          `The quintessence in your chart bridges realms others cannot see. You are the translator between worlds.`,
        ],
      };
      paragraphs.push(this.pickFrom(elementLines[dominantElement] || elementLines.fire, hash));
    }

    // Paragraph: Planetary hour
    if (planetaryHour) {
      const hourLines = [
        `The planetary hour of ${planetaryHour} adds its own timbre to the day. Activities aligned with ${planetaryHour.toLowerCase()} find extra support now.`,
        `Right now, the hour belongs to ${planetaryHour}. It is a favorable window for ${planetaryHour.toLowerCase()}-ruled endeavors.`,
        `With ${planetaryHour} ruling the hour, the current moment carries a ${planetaryHour.toLowerCase()} quality that can be used to your advantage.`,
      ];
      paragraphs.push(this.pickFrom(hourLines, hash + 7));
    }

    // Paragraph: Journal themes cross-link
    if (journalThemes && journalThemes.length > 0) {
      paragraphs.push(
        `Your recent reflections have touched on ${this.joinWithAnd(journalThemes.slice(0, 3))}. ` +
        `Today's sky offers a useful mirror for continuing that inquiry.`
      );
    }

    // Transit context (strongest transit)
    let transitContext: string | undefined;
    if (transits && transits.length > 0) {
      const t = transits[0];
      transitContext = `${this.capitalize(t.transitingPlanet)} ${t.aspect} your natal ${t.natalPlanet} (${t.orb.toFixed(1)}° ${t.applying ? 'applying' : 'separating'})`;
    }

    // Advice pool: draw from visible planets + patterns
    const advicePool: string[] = [];
    const advicePlanets = ['sun', 'moon', 'mercury', 'venus', 'mars'].filter(p => positions[p]);
    advicePlanets.forEach(p => {
      const template = this.getBaseTemplate(p, positions[p].sign);
      if (template) {
        advicePool.push(template.careerAdvice, template.relationshipAdvice);
      }
    });

    // Add pattern advice
    if (chartPatterns) {
      chartPatterns.slice(0, 2).forEach(p => advicePool.push(...p.advice.slice(0, 2)));
    }

    // Add degree pattern advice
    if (degreePatterns) {
      degreePatterns.slice(0, 1).forEach(d => advicePool.push(d.pattern.advice));
    }

    // Add phase timing advice
    const phase = MOON_PHASE_MODIFIERS[moonPhase.phase] || MOON_PHASE_MODIFIERS['new-moon'];
    advicePool.push(phase.timingAdvice);

    // Shuffle and take 4-5 unique pieces
    const advice = this.shuffleWithHash(advicePool, hash)
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 5);

    // Title variations — include pattern name if present
    let title: string;
    if (chartPatterns && chartPatterns.length > 0) {
      const titles = [
        `${chartPatterns[0].name}: Your Celestial Weather`,
        `The Sky Speaks Through ${chartPatterns[0].name}`,
        `Your Cosmic Landscape: ${chartPatterns[0].name}`,
      ];
      title = this.pickFrom(titles, hash);
    } else {
      const titles = [
        'Celestial Weather Report',
        'The Sky Speaks',
        'Your Cosmic Landscape',
        'Current Celestial Climate',
        'The Stars Today',
      ];
      title = this.pickFrom(titles, hash);
    }

    // Affirmation
    const affirmation = `I flow with the wisdom of the stars and trust my own ${dominantElement || 'inner'} light.`;

    return {
      title,
      summary: paragraphs[0] || 'The celestial spheres are in constant motion.',
      narrative: paragraphs.join('\n\n'),
      advice,
      affirmation,
      transitContext,
      confidence: Math.min(95, 70 + (transits?.length || 0) * 5 + (chartPatterns?.length || 0) * 3 + (retrogrades.length > 0 ? 5 : 0)),
    };
  }
  
  /**
   * Synthesize a 7-day weekly forecast
   */
  synthesizeWeekly(params: {
    positions: Record<string, CelestialBody>;
    moonPhase: { phase: string; sign?: string };
    retrogrades: string[];
    dominantElement?: string;
    transits?: Transit[];
    planetaryHour?: string;
    journalThemes?: string[];
  }): PersonalizedReading {
    const { positions, moonPhase, retrogrades, dominantElement, transits, planetaryHour: _planetaryHour, journalThemes } = params;
    const hash = this.hashString(JSON.stringify({
      sun: positions.sun?.sign,
      moon: positions.moon?.sign,
      phase: moonPhase.phase,
      retro: retrogrades.join(','),
      type: 'weekly',
    }));
    
    const paragraphs: string[] = [];
    
    // Opening
    const sun = positions.sun;
    paragraphs.push(
      `This week unfolds under the Sun in ${this.capitalize(sun?.sign || 'aries')}. ` +
      `The overall tone is set by ${MOON_PHASE_MODIFIERS[moonPhase.phase]?.theme || 'celestial motion'}.`
    );
    
    // Personal planets movement
    const personalPlanets = ['mercury', 'venus', 'mars'].filter(p => positions[p]);
    if (personalPlanets.length > 0) {
      const descs = personalPlanets.map(p => {
        return `${this.capitalize(p)} in ${this.capitalize(positions[p].sign)}${positions[p].isRetrograde ? ' (Rx)' : ''}`;
      });
      paragraphs.push(`The week is colored by ${this.joinWithAnd(descs)}. Expect shifts in communication, connection, and drive as these energies interact.`);
    }
    
    // Moon phases this week
    paragraphs.push(
      `Pay attention to the lunar rhythm: starting from the ${MOON_PHASE_MODIFIERS[moonPhase.phase]?.prefix || 'current'} phase, ` +
      `the Moon will guide you through a cycle of ${this.pickFrom(['gathering', 'releasing', 'building', 'integrating'], hash)} energy. ` +
      `Use the waxing days for initiative and the waning days for reflection.`
    );
    
    // Social + outer planets
    const outerPlanets = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].filter(p => positions[p]);
    if (outerPlanets.length > 0) {
      const active = outerPlanets.filter(p => retrogrades.includes(p) || (transits || []).some(t => t.transitingPlanet === p && t.orb < 5));
      if (active.length > 0) {
        const descs = active.map(p => `${this.capitalize(p)} in ${this.capitalize(positions[p].sign)}${retrogrades.includes(p) ? ' retrograde' : ''}`);
        paragraphs.push(`Slower themes this week: ${this.joinWithAnd(descs)}. These are background currents—notice where they repeat.`);
      }
    }
    
    // Transits focus
    if (transits && transits.length > 0) {
      const topTransits = transits.slice(0, 2);
      paragraphs.push(
        `Key transits to watch: ${topTransits.map(t => `${this.capitalize(t.transitingPlanet)} ${t.aspect} your ${t.natalPlanet}`).join(' and ')}. ` +
        `These exact around midweek, bringing clarity to related life areas.`
      );
    }
    
    // Elemental
    if (dominantElement) {
      const lines: Record<string, string[]> = {
        fire: [`Your fire nature thrives on momentum this week. Pace yourself so you don't burn out by Thursday.`],
        earth: [`Your earth constitution benefits from steady routines. Build something tangible by week's end.`],
        air: [`Your air mind will be buzzing. Capture ideas midweek before they float away.`],
        water: [`Your water soul may feel the lunar tides acutely. Honor rest as much as action.`],
        ether: [`Your ether awareness may reveal hidden connections this week. Trust the patterns that emerge between the obvious events.`],
      };
      paragraphs.push(this.pickFrom(lines[dominantElement] || lines.fire, hash));
    }
    
    // Journal themes integration
    if (journalThemes && journalThemes.length > 0) {
      paragraphs.push(
        `Recent reflections have touched on ${this.joinWithAnd(journalThemes.slice(0, 3))}. ` +
        `This week's sky offers a useful lens for continuing that inquiry.`
      );
    }
    
    const advicePool: string[] = [
      'Set 2-3 intentions at the start of the week.',
      'Review and adjust priorities around midweek.',
      'Leave buffer time for unexpected shifts.',
      'Reflect on Sunday: what pattern emerged?',
    ];
    
    if (retrogrades.length > 0) {
      advicePool.push(`With ${retrogrades.join(', ')} retrograde, patience and review serve you better than force.`);
    }
    
    const advice = this.shuffleWithHash(advicePool, hash).slice(0, 4);
    
    const titles = [
      'Your 7-Day Cosmic Forecast',
      'The Week Ahead',
      'Weekly Celestial Compass',
      'Seven Days Under the Stars',
    ];
    
    let transitContext: string | undefined;
    if (transits && transits.length > 0) {
      transitContext = `${this.capitalize(transits[0].transitingPlanet)} ${transits[0].aspect} your natal ${transits[0].natalPlanet}`;
    }
    
    return {
      title: this.pickFrom(titles, hash),
      summary: paragraphs[0],
      narrative: paragraphs.join('\n\n'),
      advice,
      affirmation: `I move through this week with the rhythm of the stars.`,
      transitContext,
      confidence: Math.min(92, 70 + (transits?.length || 0) * 4 + (retrogrades.length > 0 ? 4 : 0)),
    };
  }
  
  /**
   * Synthesize an annual overview
   */
  synthesizeYearly(params: {
    positions: Record<string, CelestialBody>;
    moonPhase: { phase: string; sign?: string };
    retrogrades: string[];
    dominantElement?: string;
    transits?: Transit[];
    journalThemes?: string[];
  }): PersonalizedReading {
    const { positions, moonPhase: _moonPhase, retrogrades, dominantElement, transits, journalThemes } = params;
    const hash = this.hashString(JSON.stringify({
      sun: positions.sun?.sign,
      year: new Date().getFullYear(),
      type: 'yearly',
    }));
    
    const year = new Date().getFullYear();
    const paragraphs: string[] = [];
    
    // Year theme based on Sun sign
    const sunSign = positions.sun?.sign || 'aries';
    paragraphs.push(
      `${year} unfolds with the Sun's annual journey through the zodiac, beginning in ${this.capitalize(sunSign)}. ` +
      `This year asks you to embody the ${SIGN_DATA[sunSign]?.virtue || 'courage'} of your solar season.`
    );
    
    // Jupiter and Saturn (the great chronocrators)
    const jupiter = positions.jupiter;
    const saturn = positions.saturn;
    if (jupiter && saturn) {
      paragraphs.push(
        `Jupiter in ${this.capitalize(jupiter.sign)} expands opportunities in that area of life, ` +
        `while Saturn in ${this.capitalize(saturn.sign)} calls for disciplined mastery there. ` +
        `The balance between growth and responsibility defines the year's architecture.`
      );
    } else if (jupiter) {
      paragraphs.push(`Jupiter in ${this.capitalize(jupiter.sign)} marks a year of expansion and learning in that domain.`);
    } else if (saturn) {
      paragraphs.push(`Saturn in ${this.capitalize(saturn.sign)} brings a sober, maturing energy to the themes of that house.`);
    }
    
    // Outer planets (generational + personal transits)
    const outers = ['uranus', 'neptune', 'pluto'].filter(p => positions[p]);
    if (outers.length > 0) {
      const active = outers.filter(p => (transits || []).some(t => t.transitingPlanet === p));
      if (active.length > 0) {
        const descs = active.map(p => `${this.capitalize(p)} in ${this.capitalize(positions[p].sign)}`);
        paragraphs.push(`Deeper transformations are afoot with ${this.joinWithAnd(descs)}. These are slow, irrevocable shifts—pay attention to where they touch your natal chart.`);
      }
    }
    
    // Retrogrades theme
    if (retrogrades.length > 0) {
      paragraphs.push(
        `With ${this.joinWithAnd(retrogrades.map(this.capitalize))} moving retrograde at times this year, ` +
        `periods of review and recalibration will be essential rather than optional.`
      );
    }
    
    // Elemental
    if (dominantElement) {
      const lines: Record<string, string[]> = {
        fire: [`This is a year to initiate, inspire, and take creative risks. Don't wait for permission.`],
        earth: [`This year rewards practical effort and tangible results. Build something that lasts.`],
        air: [`A year of ideas, connections, and intellectual growth. Share what you learn widely.`],
        water: [`Emotional and spiritual depths call this year. Trust intuition over logic in major decisions.`],
        ether: [`A year of transformation and bridging worlds. The invisible threads between events become visible to you.`],
      };
      paragraphs.push(this.pickFrom(lines[dominantElement] || lines.fire, hash));
    }
    
    // Journal themes integration
    if (journalThemes && journalThemes.length > 0) {
      paragraphs.push(
        `Themes from your recent reflections—${this.joinWithAnd(journalThemes.slice(0, 3))}—may deepen and evolve throughout ${year}.`
      );
    }
    
    const advice = [
      'Set one large intention for the year and revisit it each season.',
      'Track where Jupiter brings luck and where Saturn demands effort.',
      'Use retrograde periods for revision, not launch.',
      'Celebrate small milestones; the year is a marathon, not a sprint.',
    ];
    
    let transitContext: string | undefined;
    if (transits && transits.length > 0) {
      const t = transits.find(tr => ['saturn', 'jupiter', 'uranus', 'pluto'].includes(tr.transitingPlanet)) || transits[0];
      transitContext = `${this.capitalize(t.transitingPlanet)} ${t.aspect} your natal ${t.natalPlanet}`;
    }
    
    return {
      title: `${year} Celestial Overview`,
      summary: paragraphs[0],
      narrative: paragraphs.join('\n\n'),
      advice,
      affirmation: `I walk through ${year} with patience, courage, and trust in the timing of my life.`,
      transitContext,
      confidence: Math.min(90, 65 + (transits?.length || 0) * 3),
    };
  }
  
  /**
   * Generate fallback reading when specific template not found
   */
  private generateFallbackReading(params: {
    planet: string;
    sign: string;
    moonPhase: string;
    transit?: Transit;
  }): PersonalizedReading {
    const planetName = this.capitalize(params.planet);
    const signName = this.capitalize(params.sign);
    
    return {
      title: `${planetName} in ${signName}`,
      summary: `${planetName} moves through ${signName}, coloring your experience with ${signName} qualities.`,
      narrative: `As ${planetName} travels through ${signName}, you may notice ${signName} themes becoming more prominent in your life. Trust the process and observe what emerges.`,
      advice: ['Stay present with what arises', 'Trust your intuition', 'Take notes on patterns you notice'],
      affirmation: `I am open to the wisdom of ${planetName} in ${signName}.`,
      confidence: 50,
    };
  }
  
  /**
   * Clear cache (useful for testing or memory management)
   */
  clearCache(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).slice(0, 20), // Limit for performance
    };
  }
}

// Singleton instance
export const templateLibrary = new TemplateLibrary();

export default templateLibrary;
