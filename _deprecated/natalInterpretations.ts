/**
 * HEKA Natal Chart Interpretations
 * Deep, soulful interpretations for all planetary placements
 * 
 * This module provides rich, meaningful interpretations for:
 * - Planets in Signs
 * - Planets in Houses
 * - Aspects
 * - House Rulerships
 * - Element/Modality Balance
 */

import { Planet, ZodiacSign, HouseNumber, AspectType, PLANETS, ZODIAC_SIGNS } from '../types/astrology';

// ============================================================================
// PLANET IN SIGN INTERPRETATIONS
// ============================================================================

export interface PlanetInSignInterpretation {
  planet: Planet;
  sign: ZodiacSign;
  title: string;
  keywords: string[];
  essence: string;
  gifts: string[];
  challenges: string[];
  lifeTheme: string;
  shadowWork: string;
  hekaWisdom: string; // Special HEKA calendar integration
}

// Sun Sign Interpretations - Core Identity
const SUN_SIGN_INTERPRETATIONS: Record<ZodiacSign, Omit<PlanetInSignInterpretation, 'planet' | 'sign'>> = {
  aries: {
    title: 'The Pioneering Spirit',
    keywords: ['courage', 'initiation', 'leadership', 'passion', 'independence'],
    essence: 'You are a flame that ignites new paths. Your soul chose to incarnate as a pioneer, a warrior of light who leads by example.',
    gifts: [
      'Natural leadership abilities - others follow your initiative',
      'Courage to begin what others fear to start',
      'Infectious enthusiasm that energizes groups',
      'Direct, honest communication style',
      'Resilience - you bounce back quickly from setbacks'
    ],
    challenges: [
      'Impatience with slower processes and people',
      'Tendency to start but not always finish',
      'Anger that flares quickly but subsides',
      'Self-centeredness when under stress',
      'Competitive nature can create conflict'
    ],
    lifeTheme: 'Learning to temper your fire with wisdom, using your initiative to serve the greater good while developing patience.',
    shadowWork: 'Examine where your need to be first might be covering insecurity. True leadership serves, not dominates.',
    hekaWisdom: 'In the HEKA calendar, your power month is the First Month (April). New beginnings align with your essence.'
  },
  taurus: {
    title: 'The Earth Guardian',
    keywords: ['stability', 'sensuality', 'patience', 'perseverance', 'abundance'],
    essence: 'You are the fertile earth that nurtures all life. Your presence brings stability and your touch creates beauty.',
    gifts: [
      'Ability to build lasting foundations',
      'Deep appreciation for sensory pleasures',
      'Reliability - others know you\'ll follow through',
      'Natural talent for growing resources',
      'Calming presence in chaotic situations'
    ],
    challenges: [
      'Resistance to change even when necessary',
      'Possessiveness in relationships',
      'Stubbornness once decisions are made',
      'Comfort-seeking that limits growth',
      'Material attachment over spiritual value'
    ],
    lifeTheme: 'Learning that true security comes from within, while using your building abilities to create beauty that serves others.',
    shadowWork: 'Ask yourself: What am I holding onto that no longer serves me? True abundance flows, it doesn\'t hoard.',
    hekaWisdom: 'The Second Month (May) amplifies your earthy gifts. Perfect for grounding intentions and cultivating patience.'
  },
  gemini: {
    title: 'The Cosmic Messenger',
    keywords: ['curiosity', 'adaptability', 'communication', 'wit', 'versatility'],
    essence: 'You are the breath of spirit moving between worlds. Your mind dances with ideas, connecting dots others miss.',
    gifts: [
      'Exceptional communication abilities',
      'Quick wit and mental agility',
      'Natural curiosity about everything',
      'Ability to see multiple perspectives',
      'Adaptability to changing circumstances'
    ],
    challenges: [
      'Scattered focus - too many interests',
      'Nervous energy and mental restlessness',
      'Superficiality - breadth over depth',
      'Inconsistency in commitments',
      'Anxiety from overthinking'
    ],
    lifeTheme: 'Learning to focus your brilliant mind while maintaining your natural curiosity. Depth and breadth can coexist.',
    shadowWork: 'Notice when your chatter covers discomfort with silence. Your wisest self emerges in stillness.',
    hekaWisdom: 'The Third Month (June) activates your mercurial gifts. Communication projects flourish under this energy.'
  },
  cancer: {
    title: 'The Soul Nurturer',
    keywords: ['intuition', 'protection', 'emotion', 'nurturing', 'memory'],
    essence: 'You are the ocean\'s tide, ebbing and flowing with emotional wisdom. Your heart is a sanctuary for others.',
    gifts: [
      'Deep emotional intelligence',
      'Nurturing abilities that heal others',
      'Strong intuition and psychic sensitivity',
      'Protective instincts for loved ones',
      'Powerful connection to ancestry and roots'
    ],
    challenges: [
      'Emotional sensitivity that feels overwhelming',
      'Clinging to the past or people',
      'Mood swings with the lunar cycle',
      'Overprotectiveness masking fear',
      'Difficulty releasing old hurts'
    ],
    lifeTheme: 'Learning to nurture yourself as you nurture others. Your sensitivity is a gift when you set healthy boundaries.',
    shadowWork: 'Explore what you\'re trying to hold onto. True security comes from within, not from clinging.',
    hekaWisdom: 'The Fourth Month (July) resonates with your lunar nature. Emotional healing work is especially potent now.'
  },
  leo: {
    title: 'The Radiant Heart',
    keywords: ['creativity', 'confidence', 'generosity', 'leadership', 'drama'],
    essence: 'You are the sun itself - warm, radiant, life-giving. Your heart\'s courage inspires others to shine.',
    gifts: [
      'Natural creative expression',
      'Generous spirit that uplifts others',
      'Confidence that inspires confidence',
      'Loyalty to those you love',
      'Ability to command attention naturally'
    ],
    challenges: [
      'Pride that refuses to show vulnerability',
      'Need for constant validation',
      'Dramatic reactions to feeling ignored',
      'Fixed opinions that resist feedback',
      'Expectation that others should serve you'
    ],
    lifeTheme: 'Learning that true royalty serves with humility. Your light is brightest when it illuminates others.',
    shadowWork: 'Notice when your need for applause covers self-doubt. True confidence needs no external validation.',
    hekaWisdom: 'The Fifth Month (August) is your solar crown. Creative projects launched now carry your heart\'s fire.'
  },
  virgo: {
    title: 'The Sacred Artisan',
    keywords: ['analysis', 'service', 'purity', 'discernment', 'healing'],
    essence: 'You are the alchemist refining raw material into gold. Your attention to detail serves divine perfection.',
    gifts: [
      'Exceptional analytical abilities',
      'Healing touch in service to others',
      'Discernment that sees what others miss',
      'Practical wisdom applied to problems',
      'Dedication to continuous improvement'
    ],
    challenges: [
      'Perfectionism that paralyzes action',
      'Self-criticism and harsh inner judge',
      'Over-analysis leading to worry',
      'Difficulty accepting help from others',
      'Health anxiety and hypochondria'
    ],
    lifeTheme: 'Learning that perfection is a process, not a destination. Your standards serve best when tempered with compassion.',
    shadowWork: 'Examine your harsh self-critic. Would you speak to a friend this way? Self-compassion is the true healing.',
    hekaWisdom: 'The Sixth Month (September) honors your mercurial precision. Health and healing rituals are especially effective.'
  },
  libra: {
    title: 'The Harmonious Diplomat',
    keywords: ['balance', 'beauty', 'partnership', 'justice', 'grace'],
    essence: 'You are the balance point between opposites. Your presence brings harmony and your eye sees true beauty.',
    gifts: [
      'Natural diplomatic abilities',
      'Aesthetic sense that creates beauty',
      'Fair-mindedness in conflict',
      'Charm that puts others at ease',
      'Ability to see all sides of situations'
    ],
    challenges: [
      'Indecision from weighing all options',
      'People-pleasing at cost to self',
      'Avoidance of necessary conflict',
      'Dependency on partnership for identity',
      'Superficial harmony masking truth'
    ],
    lifeTheme: 'Learning that true balance includes honoring your own needs. Harmony requires authenticity, not just peace.',
    shadowWork: 'Notice when you\'re avoiding necessary confrontation. True peace comes from addressing disharmony, not denying it.',
    hekaWisdom: 'The Seventh Month (October) activates your relational gifts. Partnership negotiations and artistic endeavors flourish.'
  },
  scorpio: {
    title: 'The Soul Alchemist',
    keywords: ['transformation', 'intensity', 'depth', 'power', 'mystery'],
    essence: 'You are the phoenix that transforms through fire. Your depth penetrates illusions to reveal hidden truths.',
    gifts: [
      'Penetrating insight into hidden motives',
      'Emotional courage to face shadows',
      'Transformative healing abilities',
      'Loyalty that survives any trial',
      'Natural talent for research and investigation'
    ],
    challenges: [
      'Intensity that overwhelms others',
      'Tendency toward jealousy and suspicion',
      'Control needs masking vulnerability',
      'All-or-nothing emotional patterns',
      'Difficulty trusting and letting go'
    ],
    lifeTheme: 'Learning to use your power for transformation rather than control. Your intensity is a gift when channeled wisely.',
    shadowWork: 'Examine what you\'re trying to control. True power emerges when you surrender what you cannot change.',
    hekaWisdom: 'The Eighth Month (November) opens the veil. Shadow work, research, and deep healing are favored.'
  },
  ophiuchus: {
    title: 'The Serpent Healer',
    keywords: ['healing', 'wisdom', 'alchemy', 'transmutation', 'ascension'],
    essence: 'You are the bridge between heaven and earth, the serpent bearer who transforms poison into medicine.',
    gifts: [
      'Powerful healing and therapeutic abilities',
      'Wisdom that transcends conventional limits',
      'Alchemical transformation of suffering',
      'Connection to hidden knowledge',
      'Ability to navigate shadow and light'
    ],
    challenges: [
      'Feeling misunderstood or out of place',
      'Intense karmic patterns to resolve',
      'Temptation to misuse hidden knowledge',
      'Struggle between mundane and spiritual',
      'Power that must be used responsibly'
    ],
    lifeTheme: 'Learning to integrate heaven and earth within yourself. Your path is one of service through transformation.',
    shadowWork: 'The serpent represents both wisdom and temptation. Examine how you use your knowledge - for healing or harm?',
    hekaWisdom: 'The Ninth Month (December) calls you to bridge worlds. Your healing gifts are amplified under this energy.'
  },
  sagittarius: {
    title: 'The Truth Seeker',
    keywords: ['expansion', 'philosophy', 'adventure', 'optimism', 'truth'],
    essence: 'You are the arrow flying toward truth. Your spirit expands boundaries and your vision sees distant horizons.',
    gifts: [
      'Natural optimism that inspires hope',
      'Philosophical mind seeking meaning',
      'Adventurous spirit embracing new experiences',
      'Honesty that cuts through pretense',
      'Generosity that shares wisdom freely'
    ],
    challenges: [
      'Restlessness with routine and commitment',
      'Bluntness that wounds sensitive souls',
      'Overconfidence leading to risky behavior',
      'Preaching rather than listening',
      'Escapism when reality feels limiting'
    ],
    lifeTheme: 'Learning that the greatest journey is inward. Your expansion serves best when it includes depth with breadth.',
    shadowWork: 'Notice when your truth-seeking becomes escape. True wisdom includes the courage to be present.',
    hekaWisdom: 'The Tenth Month (January) expands your horizons. Teaching, publishing, and travel are favored activities.'
  },
  capricorn: {
    title: 'The Master Builder',
    keywords: ['ambition', 'discipline', 'authority', 'responsibility', 'mastery'],
    essence: 'You are the mountain that stands through time. Your discipline creates legacies that endure beyond generations.',
    gifts: [
      'Exceptional organizational abilities',
      'Ambition channeled into concrete achievement',
      'Reliability that others depend upon',
      'Wisdom earned through experience',
      'Ability to overcome any obstacle through persistence'
    ],
    challenges: [
      'Workaholism sacrificing personal life',
      'Pessimism and negative expectations',
      'Control needs masking insecurity',
      'Difficulty expressing vulnerability',
      'Judgment of those less disciplined'
    ],
    lifeTheme: 'Learning that true mastery includes inner authority, not just external achievement. Your legacy includes how you love.',
    shadowWork: 'Examine what you\'re trying to prove. True authority comes from within, not from accomplishments.',
    hekaWisdom: 'The Eleventh Month (February) honors your mastery. Career achievements and long-term planning are especially potent.'
  },
  aquarius: {
    title: 'The Visionary Rebel',
    keywords: ['innovation', 'humanitarian', 'independence', 'vision', 'eccentricity'],
    essence: 'You are the lightning that illuminates new paradigms. Your vision serves humanity\'s evolution.',
    gifts: [
      'Original thinking that breaks conventions',
      'Humanitarian concern for collective wellbeing',
      'Intellectual brilliance and innovation',
      'Loyalty to principles over popularity',
      'Ability to see future trends before others'
    ],
    challenges: [
      'Emotional detachment and aloofness',
      'Rebellion against authority just to rebel',
      'Fixed opinions about being right',
      'Difficulty with intimate connection',
      'Idealism that judges imperfect reality'
    ],
    lifeTheme: 'Learning that true revolution includes the heart. Your vision serves best when it includes human connection.',
    shadowWork: 'Notice when your independence masks fear of intimacy. True freedom includes the courage to connect.',
    hekaWisdom: 'The Twelfth Month (March) activates your futuristic vision. Innovation and community building are favored.'
  },
  pisces: {
    title: 'The Mystic Dreamer',
    keywords: ['compassion', 'imagination', 'spirituality', 'empathy', 'transcendence'],
    essence: 'You are the ocean dissolving all boundaries. Your compassion flows to all beings, connecting everything in love.',
    gifts: [
      'Boundless compassion and empathy',
      'Rich imagination and creative vision',
      'Spiritual sensitivity and intuition',
      'Artistic expression of the ineffable',
      'Ability to dissolve ego into unity'
    ],
    challenges: [
      'Escapism into fantasy or addiction',
      'Vulnerability to absorbing others\' emotions',
      'Difficulty with boundaries and saying no',
      'Confusion between intuition and fear',
      'Victim consciousness or martyrdom'
    ],
    lifeTheme: 'Learning to ground your spiritual sensitivity in healthy boundaries. Your compassion serves best when it includes yourself.',
    shadowWork: 'Examine where you\'re escaping reality. True transcendence includes embracing the here and now.',
    hekaWisdom: 'The Thirteenth Month is your mystical home. Spiritual practices, art, and compassion work are especially potent.'
  }
};

// Moon Sign Interpretations - Emotional Nature
const MOON_SIGN_INTERPRETATIONS: Record<ZodiacSign, Omit<PlanetInSignInterpretation, 'planet' | 'sign'>> = {
  aries: {
    title: 'Emotional Pioneer',
    keywords: ['impulsive', 'passionate', 'independent', 'direct', 'courageous'],
    essence: 'Your emotions are immediate and fiery. You feel intensely and act on feelings without hesitation.',
    gifts: ['Emotional honesty', 'Quick emotional recovery', 'Passionate enthusiasm'],
    challenges: ['Emotional impatience', 'Anger flares', 'Self-centered feelings'],
    lifeTheme: 'Learning to pause before emotional reactions.',
    shadowWork: 'What are you rushing toward emotionally?',
    hekaWisdom: 'New moons in Aries recharge your emotional batteries.'
  },
  taurus: {
    title: 'Emotional Ground',
    keywords: ['steady', 'sensual', 'loyal', 'possessive', 'patient'],
    essence: 'Your emotions flow slowly but deeply. You need stability and sensory comfort to feel secure.',
    gifts: ['Emotional reliability', 'Deep loyalty', 'Calming presence'],
    challenges: ['Emotional stubbornness', 'Possessiveness', 'Resistance to change'],
    lifeTheme: 'Learning emotional flexibility without losing your ground.',
    shadowWork: 'What are you holding onto emotionally?',
    hekaWisdom: 'Taurus moons ground the HEKA calendar\'s first month.'
  },
  gemini: {
    title: 'Emotional Curiosity',
    keywords: ['changeable', 'intellectual', 'communicative', 'restless', 'adaptable'],
    essence: 'Your emotions are mental and ever-changing. You process feelings through talking and thinking.',
    gifts: ['Emotional articulation', 'Mental flexibility', 'Curiosity about feelings'],
    challenges: ['Emotional inconsistency', 'Overthinking feelings', 'Nervous energy'],
    lifeTheme: 'Learning to feel without always analyzing.',
    shadowWork: 'What feelings are you avoiding through analysis?',
    hekaWisdom: 'Gemini moons favor communication rituals.'
  },
  cancer: {
    title: 'Emotional Home',
    keywords: ['nurturing', 'protective', 'sensitive', 'tenacious', 'intuitive'],
    essence: 'Your emotions run ocean-deep. You feel everything and need a safe home base.',
    gifts: ['Deep emotional intelligence', 'Nurturing instincts', 'Psychic sensitivity'],
    challenges: ['Emotional overwhelm', 'Clinging to security', 'Moodiness'],
    lifeTheme: 'Learning to mother yourself as you mother others.',
    shadowWork: 'What childhood patterns still rule your feelings?',
    hekaWisdom: 'Cancer moons amplify the HEKA calendar\'s emotional waters.'
  },
  leo: {
    title: 'Emotional Drama',
    keywords: ['dramatic', 'warm', 'proud', 'generous', 'creative'],
    essence: 'Your emotions are theatrical and warm. You feel with your whole heart and need appreciation.',
    gifts: ['Emotional generosity', 'Creative expression', 'Heart-centered warmth'],
    challenges: ['Emotional neediness', 'Prideful reactions', 'Dramatic flair'],
    lifeTheme: 'Learning that your heart is worthy even without applause.',
    shadowWork: 'What do you need others to see in your feelings?',
    hekaWisdom: 'Leo moons shine bright during creative cycles.'
  },
  virgo: {
    title: 'Emotional Analyst',
    keywords: ['discriminating', 'helpful', 'worrying', 'practical', 'refined'],
    essence: 'Your emotions are analyzed and refined. You show love through practical service.',
    gifts: ['Emotional discernment', 'Helpful service', 'Healing touch'],
    challenges: ['Emotional criticism', 'Worry and anxiety', 'Perfectionism'],
    lifeTheme: 'Learning to accept messy emotions without fixing them.',
    shadowWork: 'What imperfections in yourself trigger criticism?',
    hekaWisdom: 'Virgo moons favor health and healing work.'
  },
  libra: {
    title: 'Emotional Harmony',
    keywords: ['diplomatic', 'romantic', 'indecisive', 'gracious', 'relational'],
    essence: 'Your emotions seek balance and beauty. You feel most at peace in harmonious relationships.',
    gifts: ['Emotional diplomacy', 'Appreciation of beauty', 'Fair-mindedness'],
    challenges: ['Emotional indecision', 'Conflict avoidance', 'People-pleasing'],
    lifeTheme: 'Learning that your feelings matter as much as others\'.',
    shadowWork: 'What are you not saying to keep the peace?',
    hekaWisdom: 'Libra moons favor relationship rituals.'
  },
  scorpio: {
    title: 'Emotional Depth',
    keywords: ['intense', 'secretive', 'transformative', 'penetrating', 'loyal'],
    essence: 'Your emotions run to the core. You feel everything intensely and guard your vulnerability.',
    gifts: ['Emotional power', 'Transformative healing', 'Deep loyalty'],
    challenges: ['Emotional control', 'Jealousy', 'All-or-nothing patterns'],
    lifeTheme: 'Learning to trust with your vulnerability.',
    shadowWork: 'What emotions are you hiding from yourself?',
    hekaWisdom: 'Scorpio moons dive deep during shadow work cycles.'
  },
  ophiuchus: {
    title: 'Emotional Alchemy',
    keywords: ['healing', 'wise', 'transformative', 'knowledge-seeking', 'intense'],
    essence: 'Your emotions carry healing wisdom. You transform suffering into medicine for others.',
    gifts: ['Emotional healing', 'Hidden knowledge', 'Transformational power'],
    challenges: ['Emotional intensity', 'Feeling misunderstood', 'Karmic patterns'],
    lifeTheme: 'Learning to carry wisdom lightly while healing yourself.',
    shadowWork: 'What wounds have you transformed into gifts?',
    hekaWisdom: 'Ophiuchus moons bridge worlds in the Sacred Month.'
  },
  sagittarius: {
    title: 'Emotional Adventure',
    keywords: ['optimistic', 'restless', 'honest', 'freedom-loving', 'philosophical'],
    essence: 'Your emotions seek expansion and meaning. You feel most alive when exploring new horizons.',
    gifts: ['Emotional optimism', 'Philosophical perspective', 'Adventurous spirit'],
    challenges: ['Emotional restlessness', 'Blunt honesty', 'Commitment fears'],
    lifeTheme: 'Learning to find adventure within as well as without.',
    shadowWork: 'What are you running from emotionally?',
    hekaWisdom: 'Sagittarius moons favor truth-seeking rituals.'
  },
  capricorn: {
    title: 'Emotional Mastery',
    keywords: ['controlled', 'responsible', 'reserved', 'ambitious', 'mature'],
    essence: 'Your emotions are disciplined and responsible. You may have had to grow up quickly.',
    gifts: ['Emotional stability', 'Reliability', 'Mature perspective'],
    challenges: ['Emotional suppression', 'Pessimism', 'Workaholism'],
    lifeTheme: 'Learning that vulnerability is a strength, not a weakness.',
    shadowWork: 'What emotions did you learn were unacceptable?',
    hekaWisdom: 'Capricorn moons build lasting emotional structures.'
  },
  aquarius: {
    title: 'Emotional Observer',
    keywords: ['detached', 'humanitarian', 'unconventional', 'intellectual', 'friendly'],
    essence: 'Your emotions are intellectual and universal. You care for humanity but may distance from intimacy.',
    gifts: ['Emotional objectivity', 'Humanitarian concern', 'Unique perspective'],
    challenges: ['Emotional detachment', 'Difficulty with intimacy', 'Fixed ideas'],
    lifeTheme: 'Learning to connect heart with mind.',
    shadowWork: 'What feelings are you observing from outside?',
    hekaWisdom: 'Aquarius moons favor community healing work.'
  },
  pisces: {
    title: 'Emotional Ocean',
    keywords: ['empathic', 'dreamy', 'sacrificing', 'spiritual', 'boundaryless'],
    essence: 'Your emotions merge with all. You feel others\' feelings and may lose yourself in the ocean.',
    gifts: ['Boundless compassion', 'Spiritual connection', 'Creative inspiration'],
    challenges: ['Emotional overwhelm', 'Poor boundaries', 'Escapism'],
    lifeTheme: 'Learning to be in the ocean without drowning.',
    shadowWork: 'What boundaries do you need to establish?',
    hekaWisdom: 'Pisces moons dissolve into the mystical currents.'
  }
};

// ============================================================================
// ASPECT PATTERN INTERPRETATIONS
// ============================================================================

export interface AspectPatternInterpretation {
  type: 'grand-trine' | 't-square' | 'grand-cross' | 'yod' | 'stellium' | 'kite' | 'mystic-rectangle';
  title: string;
  description: string;
  gifts: string[];
  challenges: string[];
  lifePurpose: string;
}

export const ASPECT_PATTERN_INTERPRETATIONS: Record<string, AspectPatternInterpretation> = {
  'grand-trine': {
    type: 'grand-trine',
    title: 'The Natural Flow',
    description: 'Three planets form an equilateral triangle of 120° trines, creating a closed circuit of harmonious energy. This pattern represents natural talent that flows effortlessly.',
    gifts: [
      'Exceptional natural abilities in the element involved',
      'Effortless flow of creative energy',
      'Innate understanding of the planetary themes',
      'Charismatic presence that attracts opportunities'
    ],
    challenges: [
      'Taking gifts for granted - no effort required',
      'Laziness from too much ease',
      'Underutilization of natural talents',
      'Difficulty growing through challenge'
    ],
    lifePurpose: 'Your soul chose to develop natural grace and share it with others. The challenge is to consciously cultivate what comes easily.'
  },
  't-square': {
    type: 't-square',
    title: 'The Dynamic Tension',
    description: 'Two planets oppose each other while both square a third, forming a T shape. This pattern creates intense pressure that demands resolution.',
    gifts: [
      'Enormous drive to overcome obstacles',
      'Charismatic intensity that motivates others',
      'Capacity for deep transformation',
      'Natural crisis management abilities'
    ],
    challenges: [
      'Constant inner tension and stress',
      'Feeling pulled in opposing directions',
      'Tendency to create crises',
      'Difficulty finding peace'
    ],
    lifePurpose: 'Your soul chose to grow through tension and crisis. The resolution of your T-square becomes your greatest gift to the world.'
  },
  'grand-cross': {
    type: 'grand-cross',
    title: 'The Crucible',
    description: 'Four planets form a complete square, with two oppositions crossing. This rare pattern creates intense pressure from all sides.',
    gifts: [
      'Exceptional resilience and strength',
      'Ability to handle multiple pressures simultaneously',
      'Natural crisis leadership',
      'Deep wisdom earned through struggle'
    ],
    challenges: [
      'Feeling trapped by circumstances',
      'Constant internal and external conflict',
      'Difficulty relaxing or letting go',
      'Health issues from chronic stress'
    ],
    lifePurpose: 'Your soul chose the path of the spiritual warrior. Your struggles forge a strength that serves others in their darkest hours.'
  },
  'yod': {
    type: 'yod',
    title: 'The Finger of Fate',
    description: 'Two planets sextile each other while both quincunx (150°) a third, forming a Y shape. This pattern indicates a special destiny.',
    gifts: [
      'Unique mission or calling',
      'Synchronicities that guide your path',
      'Healing or teaching abilities',
      'Spiritual sensitivity and intuition'
    ],
    challenges: [
      'Feeling different or alienated',
      'Difficulty with mundane concerns',
      'Constant adjustments required',
      'Pressure to fulfill destiny'
    ],
    lifePurpose: 'Your soul carries a specific mission. The discomfort you feel is the universe pushing you toward your destined contribution.'
  },
  'stellium': {
    type: 'stellium',
    title: 'The Focused Beam',
    description: 'Four or more planets concentrated in one sign or house, creating an intense focus of energy in one area.',
    gifts: [
      'Exceptional development in one area',
      'Natural authority on specific themes',
      'Powerful concentration abilities',
      'Career potential in focused field'
    ],
    challenges: [
      'Neglect of other life areas',
      'Over-identification with one role',
      'Difficulty seeing other perspectives',
      'Burnout from over-focus'
    ],
    lifePurpose: 'Your soul chose to master one area deeply. Your challenge is to share this mastery while maintaining life balance.'
  }
};

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

export function getSunSignInterpretation(sign: ZodiacSign) {
  const base = SUN_SIGN_INTERPRETATIONS[sign];
  if (!base) return null;
  return {
    planet: 'sun' as Planet,
    sign,
    ...base
  };
}

export function getMoonSignInterpretation(sign: ZodiacSign) {
  const base = MOON_SIGN_INTERPRETATIONS[sign];
  if (!base) return null;
  return {
    planet: 'moon' as Planet,
    sign,
    ...base
  };
}

export function getPlanetInSignInterpretation(planet: Planet, sign: ZodiacSign): string {
  const planetData = PLANETS[planet];
  const signData = ZODIAC_SIGNS[sign];
  
  // Generate a basic interpretation
  const elementMatch = {
    'fire': 'Your ' + planetData.name + ' expresses with passion and inspiration in ' + signData.name,
    'earth': 'Your ' + planetData.name + ' manifests practically and tangibly in ' + signData.name,
    'air': 'Your ' + planetData.name + ' communicates intellectually in ' + signData.name,
    'water': 'Your ' + planetData.name + ' flows emotionally and intuitively in ' + signData.name
  };
  
  return elementMatch[signData.element] || 
    `Your ${planetData.name} expresses through ${signData.name} energy`;
}

export function getAspectPatternInterpretation(type: string): AspectPatternInterpretation | null {
  return ASPECT_PATTERN_INTERPRETATIONS[type] || null;
}

export default {
  getSunSignInterpretation,
  getMoonSignInterpretation,
  getPlanetInSignInterpretation,
  getAspectPatternInterpretation
};
