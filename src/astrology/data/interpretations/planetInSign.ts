/**
 * Planet in Sign Interpretations
 * Deep psychological and spiritual meanings
 */

export interface PlanetInSignInterpretation {
  planet: string;
  sign: string;
  title: string;
  essence: string;
  psychological: string;
  spiritual: string;
  challenges: string[];
  gifts: string[];
  lifeThemes: string[];
  advice: string;
  affirmation: string;
  hekaIntegration: string;
}

export const SUN_IN_SIGN: Record<string, PlanetInSignInterpretation> = {
  'sun-aries': {
    planet: 'Sun', sign: 'Aries', title: 'The Pioneer Spirit',
    essence: 'You are here to learn courage, initiative, and authentic self-expression.',
    psychological: 'Your ego is strongly tied to your ability to act independently.',
    spiritual: 'Your soul path involves learning the wisdom of the warrior.',
    challenges: ['Impulsiveness', 'Impatience', 'Burnout'],
    gifts: ['Leadership', 'Courage', 'Enthusiasm'],
    lifeThemes: ['New beginnings', 'Leadership', 'Competition'],
    advice: 'Channel your fire into causes worth fighting for.',
    affirmation: 'I am the spark that ignites transformation.',
    hekaIntegration: 'Use Month 1 for new calendar projects.'
  },
  'sun-taurus': {
    planet: 'Sun', sign: 'Taurus', title: 'The Manifestor',
    essence: 'You are here to learn manifestation, patience, and finding beauty.',
    psychological: 'Your identity is deeply connected to your values and possessions.',
    spiritual: 'Your soul seeks to understand that the material world is spirit expressed.',
    challenges: ['Stubbornness', 'Attachment', 'Resistance to change'],
    gifts: ['Creating value', 'Appreciation of beauty', 'Reliability'],
    lifeThemes: ['Building security', 'Working with nature', 'Art'],
    advice: 'Learn that true security comes from within.',
    affirmation: 'I am the garden where dreams take root.',
    hekaIntegration: 'Focus on sustainable growth in your HEKA practice.'
  },
  'sun-gemini': {
    planet: 'Sun', sign: 'Gemini', title: 'The Messenger',
    essence: 'You are here to learn communication, curiosity, and synthesis.',
    psychological: 'Your identity is fluid, shaped by information exchange.',
    spiritual: 'Your soul path involves understanding truth is multifaceted.',
    challenges: ['Scattered energy', 'Superficiality', 'Anxiety'],
    gifts: ['Communication', 'Curiosity', 'Adaptability'],
    lifeThemes: ['Writing', 'Teaching', 'Networking'],
    advice: 'Practice presence. Depth is as valuable as breadth.',
    affirmation: 'I am the bridge between worlds.',
    hekaIntegration: 'Journal daily in your HEKA calendar.'
  },
  'sun-cancer': {
    planet: 'Sun', sign: 'Cancer', title: 'The Nurturer',
    essence: 'You are here to learn emotional intelligence and nurturing.',
    psychological: 'Your identity is deeply rooted in emotional life and family.',
    spiritual: 'Your soul seeks to understand love is the fundamental force.',
    challenges: ['Mood swings', 'Clinging to past', 'Defensiveness'],
    gifts: ['Emotional intelligence', 'Nurturing', 'Intuition'],
    lifeThemes: ['Family', 'Healing', 'Creating safe spaces'],
    advice: 'Your sensitivity is wisdom. Nurture yourself too.',
    affirmation: 'I am the sanctuary where hearts find healing.',
    hekaIntegration: 'Track emotional patterns with moon phases.'
  },
  'sun-leo': {
    planet: 'Sun', sign: 'Leo', title: 'The Radiant Heart',
    essence: 'You are here to learn creative self-expression and leadership.',
    psychological: 'Your ego needs recognition and creative outlets.',
    spiritual: 'Your soul path is about leadership from the heart.',
    challenges: ['Need for validation', 'Pride', 'Dramatic reactions'],
    gifts: ['Charisma', 'Creativity', 'Generosity'],
    lifeThemes: ['Arts', 'Leadership', 'Working with children'],
    advice: 'Your light is not diminished by lighting others.',
    affirmation: 'I am the sun that shines without diminishing others.',
    hekaIntegration: 'Create celebrations and mark special days boldly.'
  },
  'sun-virgo': {
    planet: 'Sun', sign: 'Virgo', title: 'The Perfector',
    essence: 'You are here to learn service, discernment, and sacred practice.',
    psychological: 'Your identity is shaped by usefulness and competence.',
    spiritual: 'Your soul seeks to understand divine is in the details.',
    challenges: ['Perfectionism', 'Self-judgment', 'Over-analysis'],
    gifts: ['Attention to detail', 'Service', 'Healing'],
    lifeThemes: ['Health', 'Service', 'Craft'],
    advice: 'Done is better than perfect. You are already enough.',
    affirmation: 'I am the craftsperson shaping chaos into beauty.',
    hekaIntegration: 'Organize your calendar system with precision.'
  },
  'sun-libra': {
    planet: 'Sun', sign: 'Libra', title: 'The Harmonizer',
    essence: 'You are here to learn balance, partnership, and right relationship.',
    psychological: 'Your identity is formed through relationships and justice.',
    spiritual: 'Your soul path involves understanding duality is illusion.',
    challenges: ['Indecisiveness', 'People-pleasing', 'Avoiding conflict'],
    gifts: ['Fairness', 'Diplomacy', 'Aesthetic sense'],
    lifeThemes: ['Partnership', 'Law', 'Art', 'Mediation'],
    advice: 'Stand in your truth even when it disrupts harmony.',
    affirmation: 'I am the balance point where truth and beauty meet.',
    hekaIntegration: 'Use your calendar to balance work and rest cycles.'
  },
  'sun-scorpio': {
    planet: 'Sun', sign: 'Scorpio', title: 'The Alchemist',
    essence: 'You are here to learn transformation, depth, and truth.',
    psychological: 'Your identity is forged through intensity and crisis.',
    spiritual: 'Your soul path is the hero journey through the underworld.',
    challenges: ['Intensity', 'Control', 'Jealousy'],
    gifts: ['Emotional depth', 'Intuition', 'Transformation'],
    lifeThemes: ['Psychology', 'Research', 'Crisis management'],
    advice: 'Your power is in your vulnerability, not your armor.',
    affirmation: 'I am the transformer who finds gold in darkness.',
    hekaIntegration: 'Track transformations in your HEKA calendar.'
  },
  'sun-sagittarius': {
    planet: 'Sun', sign: 'Sagittarius', title: 'The Seeker',
    essence: 'You are here to learn wisdom, expansion, and truth.',
    psychological: 'Your identity expands through exploration and meaning.',
    spiritual: 'Your soul path is the pilgrim journey of seeking.',
    challenges: ['Restlessness', 'Bluntness', 'Over-optimism'],
    gifts: ['Optimism', 'Learning', 'Adventure'],
    lifeThemes: ['Travel', 'Education', 'Spiritual teaching'],
    advice: 'Sometimes staying brings the greatest adventure.',
    affirmation: 'I am the eternal student of life wisdom.',
    hekaIntegration: 'Use your HEKA calendar for philosophical reflection.'
  },
  'sun-capricorn': {
    planet: 'Sun', sign: 'Capricorn', title: 'The Builder',
    essence: 'You are here to learn mastery, responsibility, and wisdom of time.',
    psychological: 'Your identity is tied to achievement and status.',
    spiritual: 'Your soul path is disciplined effort toward mastery.',
    challenges: ['Workaholism', 'Pessimism', 'Controlling tendencies'],
    gifts: ['Discipline', 'Practical wisdom', 'Achievement'],
    lifeThemes: ['Business', 'Government', 'Mentoring'],
    advice: 'Your worth is not measured by achievement.',
    affirmation: 'I am the mountain that stands through time.',
    hekaIntegration: 'Your calendar becomes a tool for long-term goals.'
  },
  'sun-aquarius': {
    planet: 'Sun', sign: 'Aquarius', title: 'The Visionary',
    essence: 'You are here to learn innovation, brotherhood, and freedom.',
    psychological: 'Your identity is unconventional, shaped by ideals.',
    spiritual: 'Your soul path involves understanding individual and universal.',
    challenges: ['Detachment', 'Rebellion', 'Difficulty with intimacy'],
    gifts: ['Innovation', 'Humanitarian concern', 'Vision'],
    lifeThemes: ['Technology', 'Activism', 'Community work'],
    advice: 'Connection requires vulnerability.',
    affirmation: 'I am the future remembering itself.',
    hekaIntegration: 'Create unique tracking systems in your practice.'
  },
  'sun-pisces': {
    planet: 'Sun', sign: 'Pisces', title: 'The Mystic',
    essence: 'You are here to learn compassion, transcendence, and unity.',
    psychological: 'Your identity is fluid, merging with surroundings.',
    spiritual: 'Your soul path is the return to source.',
    challenges: ['Confusion', 'Escapism', 'Overwhelming sensitivity'],
    gifts: ['Compassion', 'Intuition', 'Artistic imagination'],
    lifeThemes: ['Spirituality', 'Art', 'Healing', 'Service'],
    advice: 'Boundaries are illusions, but so is saving everyone.',
    affirmation: 'I am the ocean and every wave within it.',
    hekaIntegration: 'Let your HEKA practice be a spiritual meditation.'
  },
  'sun-ophiuchus': {
    planet: 'Sun', sign: 'Ophiuchus', title: 'The Initiate',
    essence: 'You are here to learn healing, transformation, and the alchemy of turning wound into gift.',
    psychological: 'Your identity is fluid, perpetually dying and reborn through crisis.',
    spiritual: 'Your soul path is the wounded healer — curing others by embracing your own brokenness.',
    challenges: ['Compulsive fixing', 'Refusing to be healed', 'Boundary dissolution'],
    gifts: ['Transformation', 'Healing presence', 'Bridge-building between worlds'],
    lifeThemes: ['Healing', 'Initiation', 'Alchemy', 'Death and rebirth'],
    advice: 'The healer must also be healed. Receive the medicine you so freely offer.',
    affirmation: 'I am the serpent that rises, the wound that becomes wisdom.',
    hekaIntegration: 'Let your HEKA practice be an initiatory journey through shadow into light.'
  }
};

export function getSunInSignInterpretation(sign: string): PlanetInSignInterpretation | null {
  return SUN_IN_SIGN[`sun-${sign.toLowerCase()}`] || null;
}

export default SUN_IN_SIGN;
