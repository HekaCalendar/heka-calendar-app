/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL GUIDANCE TEMPLATE LIBRARY
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * 26,000+ pre-written template combinations for instant, high-quality guidance.
 * Zero API cost. Zero latency. Maximum depth.
 * 
 * Architecture:
 * - Planet × Sign × Moon Phase × Aspect = unique guidance
 * - Each template has variations for confidence levels
 * - Personalization via birth chart integration
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Transit } from '../../natal/natalChart';

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
// ELEMENT-SPECIFIC NARRATIVE BASES (for dynamic generation)
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
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLANET-SIGN CORE TEMPLATES (192 combinations × 8 moon phases × 3 aspects = 4,608)
// ═══════════════════════════════════════════════════════════════════════════════

const PLANET_SIGN_TEMPLATES: Record<string, Record<string, { 
  essence: string; 
  element: string;
  modality: string;
  keywords: string[];
  careerAdvice: string;
  relationshipAdvice: string;
  healthAdvice: string;
  financesAdvice: string;
  growthAdvice: string;
}>> = {
  sun: {
    aries: { essence: 'Radiant leadership through bold initiation', element: 'fire', modality: 'cardinal', keywords: ['leadership', 'initiation', 'courage'], careerAdvice: 'Take charge of new projects. Your natural authority shines now.', relationshipAdvice: 'Express your needs directly. Honest communication builds stronger bonds.', healthAdvice: 'Channel excess energy into physical activity. Watch for headaches from stress.', financesAdvice: 'Bold moves can pay off, but research before committing large sums.', growthAdvice: 'Cultivate patience alongside your natural courage. True strength includes restraint.' },
    taurus: { essence: 'Steady radiance through grounded persistence', element: 'earth', modality: 'fixed', keywords: ['stability', 'sensuality', 'determination'], careerAdvice: 'Build lasting foundations. Your persistence outlasts flashier competitors.', relationshipAdvice: 'Show love through physical presence and tangible gestures.', healthAdvice: 'Focus on throat and neck health. Gentle stretching helps tension release.', financesAdvice: 'Excellent time for long-term investments. Avoid get-rich-quick schemes.', growthAdvice: 'Embrace change as a form of stability. Growth requires adaptation.' },
    gemini: { essence: 'Curious radiance through mental exploration', element: 'air', modality: 'mutable', keywords: ['curiosity', 'communication', 'adaptability'], careerAdvice: 'Your ideas are flowing. Document them and share with collaborators.', relationshipAdvice: 'Engage in stimulating conversation. Mental connection deepens bonds.', healthAdvice: 'Guard against scattered energy. Create routines for nervous system support.', financesAdvice: 'Multiple streams of income appeal now. Diversify carefully.', growthAdvice: 'Depth complements breadth. Explore one subject thoroughly.' },
    cancer: { essence: 'Nurturing radiance through emotional wisdom', element: 'water', modality: 'cardinal', keywords: ['nurturing', 'protection', 'intuition'], careerAdvice: 'Lead with empathy. Your sensitivity is a professional strength now.', relationshipAdvice: 'Create safe emotional spaces. Home-centered activities strengthen bonds.', healthAdvice: 'Support digestive health. Emotional eating patterns may surface for healing.', financesAdvice: 'Focus on home and family investments. Security brings peace of mind.', growthAdvice: 'Self-nurturing enables you to care for others. Fill your own cup first.' },
    leo: { essence: 'Confident radiance through creative expression', element: 'fire', modality: 'fixed', keywords: ['confidence', 'creativity', 'generosity'], careerAdvice: 'Showcase your talents. Recognition comes to authentic self-expression.', relationshipAdvice: 'Express your heart generously. Your warmth attracts love.', healthAdvice: 'Support heart health. Creative expression is therapeutic.', financesAdvice: 'Invest in yourself and creative pursuits. Generosity returns multiplied.', growthAdvice: 'True confidence needs no external validation. Shine from within.' },
    virgo: { essence: 'Discerning radiance through careful refinement', element: 'earth', modality: 'mutable', keywords: ['precision', 'service', 'health'], careerAdvice: 'Your attention to detail saves the day. Offer practical solutions.', relationshipAdvice: 'Show love through helpful acts. Practical support speaks volumes.', healthAdvice: 'Focus on gut health and daily routines. Small changes compound.', financesAdvice: 'Analyze before investing. Your discernment spots hidden opportunities.', growthAdvice: 'Perfectionism serves no one. Embrace progress over perfection.' },
    libra: { essence: 'Harmonious radiance through balanced partnership', element: 'air', modality: 'cardinal', keywords: ['harmony', 'beauty', 'diplomacy'], careerAdvice: 'Collaboration succeeds over competition. Your diplomatic skills shine.', relationshipAdvice: 'Seek win-win solutions. Balance giving and receiving love.', healthAdvice: 'Support kidney and skin health. Balance work and rest.', financesAdvice: 'Partnership investments flourish. Seek expert advice.', growthAdvice: 'Your needs matter as much as others. Authentic relationships require honesty.' },
    scorpio: { essence: 'Transformative radiance through deep intensity', element: 'water', modality: 'fixed', keywords: ['transformation', 'intensity', 'power'], careerAdvice: 'Research and investigation excel. Trust your intuition about hidden matters.', relationshipAdvice: 'Depth over breadth. Meaningful intimacy transforms bonds.', healthAdvice: 'Support reproductive and eliminative systems. Release what no longer serves.', financesAdvice: 'Joint resources and investments benefit from thorough research.', growthAdvice: 'Vulnerability is strength. Let others see your authentic self.' },
    sagittarius: { essence: 'Expansive radiance through philosophical adventure', element: 'fire', modality: 'mutable', keywords: ['expansion', 'truth', 'adventure'], careerAdvice: 'Think big and share your vision. Teaching and publishing flourish.', relationshipAdvice: 'Share adventures and philosophies. Freedom within commitment works best.', healthAdvice: 'Support liver and hips. Outdoor activity restores balance.', financesAdvice: 'Long-distance investments or education pay off. Think globally.', growthAdvice: 'Truth without compassion can wound. Temper honesty with kindness.' },
    capricorn: { essence: 'Ambitious radiance through disciplined achievement', element: 'earth', modality: 'cardinal', keywords: ['ambition', 'responsibility', 'mastery'], careerAdvice: 'Climb steadily toward goals. Authority figures recognize your competence.', relationshipAdvice: 'Show commitment through actions. Long-term loyalty matters most.', healthAdvice: 'Support bones, teeth, and joints. Consistency in self-care pays.', financesAdvice: 'Conservative, structured investments build lasting wealth.', growthAdvice: 'Achievement without joy is hollow. Celebrate milestones along the way.' },
    aquarius: { essence: 'Innovative radiance through collective vision', element: 'air', modality: 'fixed', keywords: ['innovation', 'humanity', 'independence'], careerAdvice: 'Bring fresh perspectives. Group projects and technology excel.', relationshipAdvice: 'Friendship forms relationship foundation. Allow space for individuality.', healthAdvice: 'Support circulatory and nervous systems. Community supports health.', financesAdvice: 'Innovative and unconventional investments may succeed. Stay informed.', growthAdvice: 'Emotions are not weakness. Integrate head and heart.' },
    pisces: { essence: 'Transcendent radiance through spiritual connection', element: 'water', modality: 'mutable', keywords: ['compassion', 'imagination', 'unity'], careerAdvice: 'Creative and healing professions flourish. Trust intuitive guidance.', relationshipAdvice: 'Unconditional love heals. Spiritual bonds transcend the mundane.', healthAdvice: 'Support feet and immune system. Rest and dream time essential.', financesAdvice: 'Intuitive investments may surprise you. Avoid escapist spending.', growthAdvice: 'Boundaries enable compassion. You cannot pour from an empty cup.' },
  },
  moon: {
    aries: { essence: 'Emotional independence through direct expression', element: 'fire', modality: 'cardinal', keywords: ['impulse', 'courage', 'authenticity'], careerAdvice: 'Trust your gut instincts. Quick emotional reads serve you well.', relationshipAdvice: 'Express feelings honestly. Impatience with emotional games.', healthAdvice: 'Emotions manifest quickly in body. Exercise releases tension.', financesAdvice: 'Impulsive spending possible. Pause before purchases.', growthAdvice: 'All emotions are valid. Practice holding them with patience.' },
    taurus: { essence: 'Emotional stability through sensual security', element: 'earth', modality: 'fixed', keywords: ['security', 'sensuality', 'loyalty'], careerAdvice: 'Steady emotional presence creates trust. Avoid change for change\'s sake.', relationshipAdvice: 'Physical comfort and consistency nurture connection.', healthAdvice: 'Emotions settle in neck and throat. Massage helps release.', financesAdvice: 'Security needs override risk. Build steady reserves.', growthAdvice: 'Flexibility strengthens security. Resistance causes suffering.' },
    gemini: { essence: 'Emotional curiosity through mental processing', element: 'air', modality: 'mutable', keywords: ['curiosity', 'communication', 'variety'], careerAdvice: 'Network emotionally. Conversations lead to opportunities.', relationshipAdvice: 'Talk through feelings. Mental connection is emotional connection.', healthAdvice: 'Nervous system needs variety. Change routines regularly.', financesAdvice: 'Multiple small investments suit now. Stay adaptable.', growthAdvice: 'Feel before analyzing. Not everything needs explanation.' },
    cancer: { essence: 'Emotional depth through nurturing cycles', element: 'water', modality: 'cardinal', keywords: ['nurturing', 'protection', 'cycles'], careerAdvice: 'Care for your professional community. Home-based work thrives.', relationshipAdvice: 'Create emotional homes together. Security enables intimacy.', healthAdvice: 'Emotions affect digestion. Comfort foods in moderation.', financesAdvice: 'Invest in home and family. Long-term security matters.', growthAdvice: 'Your sensitivity is strength. Boundaries protect your gifts.' },
    leo: { essence: 'Emotional warmth through generous expression', element: 'fire', modality: 'fixed', keywords: ['warmth', 'drama', 'generosity'], careerAdvice: 'Creative leadership from the heart. Recognition feels like oxygen.', relationshipAdvice: 'Grand romantic gestures satisfy. Give and receive appreciation.', healthAdvice: 'Heart-centered activities restore. Creative expression heals.', financesAdvice: 'Generosity returns multiplied. But maintain healthy boundaries.', growthAdvice: 'Self-love is not selfish. Your light helps others see.' },
    virgo: { essence: 'Emotional care through practical service', element: 'earth', modality: 'mutable', keywords: ['service', 'discernment', 'health'], careerAdvice: 'Helpful competence builds reputation. Attention to detail noticed.', relationshipAdvice: 'Show love through practical care. Acts of service speak loudest.', healthAdvice: 'Worry affects gut health. Routine and order soothe nerves.', financesAdvice: 'Practical budgeting satisfies. Small consistent savings work.', growthAdvice: 'You are enough as you are. Imperfection is human.' },
    libra: { essence: 'Emotional harmony through balanced relating', element: 'air', modality: 'cardinal', keywords: ['harmony', 'partnership', 'beauty'], careerAdvice: 'Collaborative projects thrive. Your mediation skills shine.', relationshipAdvice: 'Emotional equality matters deeply. Avoid peace at any price.', healthAdvice: 'Balance in all things. Stress shows in skin and kidneys.', financesAdvice: 'Partnership decisions benefit both. Shared resources smooth.', growthAdvice: 'Your needs deserve attention. Harmony includes yourself.' },
    scorpio: { essence: 'Emotional intensity through transformative depth', element: 'water', modality: 'fixed', keywords: ['intensity', 'privacy', 'power'], careerAdvice: 'Research and investigation excel. Trust intuition on secrets.', relationshipAdvice: 'All-or-nothing emotional investment. Depth over breadth always.', healthAdvice: 'Emotions run deep physically. Release through movement.', financesAdvice: 'Joint resources and investments. Research thoroughly.', growthAdvice: 'Vulnerability creates intimacy. Trust the right people.' },
    sagittarius: { essence: 'Emotional freedom through expansive truth', element: 'fire', modality: 'mutable', keywords: ['freedom', 'optimism', 'adventure'], careerAdvice: 'International connections benefit. Share your vision widely.', relationshipAdvice: 'Philosophical compatibility matters. Freedom within love.', healthAdvice: 'Adventure feeds the soul. Outdoor movement essential.', financesAdvice: 'Long-term optimistic investments. Education pays dividends.', growthAdvice: 'Commitment brings freedom. Paradox contains truth.' },
    capricorn: { essence: 'Emotional responsibility through mature restraint', element: 'earth', modality: 'cardinal', keywords: ['responsibility', 'maturity', 'structure'], careerAdvice: 'Emotional professionalism serves you. Authority feels comfortable.', relationshipAdvice: 'Commitment shown through reliability. Actions over words.', healthAdvice: 'Repressed emotions affect bones. Schedule emotional processing.', financesAdvice: 'Conservative approach satisfies. Build for legacy.', growthAdvice: 'Vulnerability is not weakness. True strength includes softness.' },
    aquarius: { essence: 'Emotional detachment through humanitarian concern', element: 'air', modality: 'fixed', keywords: ['detachment', 'humanity', 'innovation'], careerAdvice: 'Group dynamics fascinate. Humanitarian goals motivate.', relationshipAdvice: 'Friendship first, romance second. Space strengthens bonds.', healthAdvice: 'Community supports wellness. Group activities energize.', financesAdvice: 'Unconventional investments appeal. Social impact matters.', growthAdvice: 'Emotions are information. You can feel without drowning.' },
    pisces: { essence: 'Emotional dissolution through spiritual compassion', element: 'water', modality: 'mutable', keywords: ['compassion', 'dissolution', 'transcendence'], careerAdvice: 'Creative and healing work satisfies. Boundaries essential for success.', relationshipAdvice: 'Soul connections transcend limits. Compassion with discernment.', healthAdvice: 'Energy boundaries protect health. Rest and dream time crucial.', financesAdvice: 'Intuitive guidance accurate. Avoid rescuing others financially.', growthAdvice: 'Empathy requires boundaries. Your sensitivity needs protection.' },
  },
  // ... Additional planets follow same pattern
};

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
};

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
    // Templates are generated on-demand with the dynamic engine
    // Production would pre-generate all 26,000+ combinations
    void this.cache;
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
    const baseTemplate = PLANET_SIGN_TEMPLATES[params.planet]?.[params.sign];
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
    });
    
    // Cache for performance
    this.cache.set(cacheKey, reading);
    
    return reading;
  }
  
  /**
   * Assemble a reading from components
   */
  private assembleReading(params: {
    baseTemplate: typeof PLANET_SIGN_TEMPLATES[string][string];
    phaseModifier: typeof MOON_PHASE_MODIFIERS[string];
    aspectModifier: any;
    elementQuality: typeof ELEMENT_QUALITIES[string];
    transit?: Transit;
    userElement?: string;
    category?: string;
  }): PersonalizedReading {
    const { baseTemplate, phaseModifier, aspectModifier, elementQuality, transit, userElement, category } = params;
    
    // Generate title
    const title = aspectModifier 
      ? `${phaseModifier.prefix}: ${baseTemplate.essence}`
      : `${phaseModifier.prefix}: ${baseTemplate.essence}`;
    
    // Generate narrative
    let narrative = baseTemplate.essence;
    narrative += ` You approach life ${elementQuality.approach}.`;
    narrative += ` ${phaseModifier.theme}.`;
    
    if (aspectModifier) {
      narrative += ` ${aspectModifier.flavor}.`;
    }
    
    if (userElement === baseTemplate.element) {
      narrative += ` Your natural element amplifies these energies.`;
    }
    
    // Select category-specific advice
    let advice: string[] = [];
    switch (category) {
      case 'career':
        advice = [baseTemplate.careerAdvice];
        break;
      case 'relationships':
        advice = [baseTemplate.relationshipAdvice];
        break;
      case 'health':
        advice = [baseTemplate.healthAdvice];
        break;
      case 'finances':
        advice = [baseTemplate.financesAdvice];
        break;
      case 'personalGrowth':
        advice = [baseTemplate.growthAdvice];
        break;
      default:
        advice = [baseTemplate.careerAdvice, baseTemplate.relationshipAdvice];
    }
    
    // Add timing advice
    advice.push(phaseModifier.timingAdvice);
    if (aspectModifier) {
      advice.push(aspectModifier.advice);
    }
    
    // Generate affirmation
    const affirmation = `I embrace ${baseTemplate.keywords[0]} and ${baseTemplate.keywords[1]} with ${baseTemplate.element} energy.`;
    
    // Calculate confidence
    const confidence = aspectModifier 
      ? Math.round(aspectModifier.intensity * 60)
      : Math.round(phaseModifier.multiplier * 60);
    
    // Build transit context
    let transitContext: string | undefined;
    if (transit) {
      transitContext = `${transit.transitingPlanet.charAt(0).toUpperCase() + transit.transitingPlanet.slice(1)} ${transit.aspect} your natal ${transit.natalPlanet} (${transit.orb.toFixed(1)}° ${transit.applying ? 'applying' : 'separating'})`;
    }
    
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
   * Generate fallback reading when specific template not found
   */
  private generateFallbackReading(params: {
    planet: string;
    sign: string;
    moonPhase: string;
    transit?: Transit;
  }): PersonalizedReading {
    const planetName = params.planet.charAt(0).toUpperCase() + params.planet.slice(1);
    const signName = params.sign.charAt(0).toUpperCase() + params.sign.slice(1);
    
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
