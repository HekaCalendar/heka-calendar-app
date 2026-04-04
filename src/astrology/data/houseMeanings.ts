/**
 * House Meanings Database
 * Complete astrological house significations
 * Educational content for the soul journey
 */

import type { HouseMeaning } from '../types/extended';

/**
 * Deep house meanings - each house as a stage of soul development
 */
export function getHouseMeaning(houseNumber: number): HouseMeaning {
  return HOUSE_MEANINGS[houseNumber] || {
    number: houseNumber,
    name: `House ${houseNumber}`,
    latinName: '',
    keywords: [],
    significations: { primary: [], derived: [], modern: [], traditional: [] }
  };
}

export const HOUSE_MEANINGS: Record<number, HouseMeaning> = {
  1: {
    number: 1,
    name: 'First House',
    latinName: 'Vita (Life)',
    keywords: ['identity', 'appearance', 'body', 'personality', 'approach', 'beginnings'],
    significations: {
      primary: [
        'Physical body and appearance',
        'Personality and temperament',
        'How you approach life',
        'First impressions you make',
        'Your personal style and presentation'
      ],
      derived: [
        'Health and vitality',
        'Accidents affecting the body',
        'General happiness in life',
        'Your will and determination',
        'How others see you initially'
      ],
      modern: [
        'Self-image and self-concept',
        'Personal brand',
        'Individual expression',
        'Physical vitality',
        'Life force energy'
      ],
      traditional: [
        'The helm of the ship',
        'The seed of the chart',
        'Life force (vita)',
        'Manner of expression',
        'Quality of life'
      ]
    },
    rulingPlanet: 'mars',
    element: 'fire',
    modality: 'cardinal',
    joy: 'mercury',
    detriment: 'saturn'
  },

  2: {
    number: 2,
    name: 'Second House',
    latinName: 'Lucrum (Profit)',
    keywords: ['values', 'money', 'possessions', 'self-worth', 'resources', 'security'],
    significations: {
      primary: [
        'Personal finances and income',
        'Moveable possessions',
        'What you value',
        'Self-esteem and self-worth',
        'Material security'
      ],
      derived: [
        'Potential for wealth',
        'Financial gains and losses',
        'Personal resources beyond money',
        'Skills and talents (as commodities)',
        'What sustains you'
      ],
      modern: [
        'Values system',
        'Self-worth issues',
        'Financial independence',
        'Material comfort',
        'Personal assets'
      ],
      traditional: [
        'Substance and means',
        'Moveable wealth',
        'Support for the first house',
        'Income from your own efforts',
        'The estate'
      ]
    },
    rulingPlanet: 'venus',
    element: 'earth',
    modality: 'fixed',
    joy: null,
    detriment: null
  },

  3: {
    number: 3,
    name: 'Third House',
    latinName: 'Fratres (Brothers)',
    keywords: ['communication', 'learning', 'siblings', 'local', 'mind', 'transport'],
    significations: {
      primary: [
        'Communication and expression',
        'Early education and learning',
        'Siblings and neighbors',
        'Local environment',
        'Short journeys'
      ],
      derived: [
        'Writing and speaking skills',
        'Early childhood experiences',
        'Relationship with siblings',
        'News and information',
        'Transportation'
      ],
      modern: [
        'Mental processes',
        'Early schooling',
        'Everyday communication',
        'Local community',
        'Basic skills'
      ],
      traditional: [
        'Brethren and close kin',
        'Short travels',
        'Letters and messengers',
        'The lower mind',
        'Contention and debate'
      ]
    },
    rulingPlanet: 'mercury',
    element: 'air',
    modality: 'mutable',
    joy: 'moon',
    detriment: 'mars'
  },

  4: {
    number: 4,
    name: 'Fourth House',
    latinName: 'Genitor (Parent)',
    keywords: ['home', 'family', 'roots', 'foundation', 'ancestry', 'security'],
    significations: {
      primary: [
        'Home and domestic environment',
        'Family and ancestry',
        'The father (or mother in some traditions)',
        'Private self',
        'Foundations of life'
      ],
      derived: [
        'Real estate and property',
        'End of life and burial',
        'Heritage and inheritance',
        'Emotional foundation',
        'The "bottom" of the chart'
      ],
      modern: [
        'Inner emotional life',
        'Family patterns',
        'Childhood home',
        'Sense of belonging',
        'Private sanctuary'
      ],
      traditional: [
        'The foundations',
        'The grave',
        'Ancient heritage',
        'Subterranean places',
        'The parent (IC)'
      ]
    },
    rulingPlanet: 'moon',
    element: 'water',
    modality: 'cardinal',
    joy: null,
    detriment: 'saturn'
  },

  5: {
    number: 5,
    name: 'Fifth House',
    latinName: 'Nati (Children)',
    keywords: ['creativity', 'romance', 'children', 'pleasure', 'expression', 'play'],
    significations: {
      primary: [
        'Children and procreation',
        'Romantic love affairs',
        'Creative self-expression',
        'Pleasure and entertainment',
        'Risk-taking and speculation'
      ],
      derived: [
        'Artistic creations',
        'Hobbies and amusements',
        'Gambling and investments',
        'Love affairs (not marriage)',
        'Teaching (as parent to child)'
      ],
      modern: [
        'Creative projects',
        'Romantic dating',
        'Self-expression',
        'Inner child',
        'Joy and fun'
      ],
      traditional: [
        'Offspring and conception',
        'Good fortune (joy)',
        'Banquets and parties',
        'Messengers and ambassadors',
        'Oracles and prophets'
      ]
    },
    rulingPlanet: 'sun',
    element: 'fire',
    modality: 'fixed',
    joy: 'venus',
    detriment: 'saturn'
  },

  6: {
    number: 6,
    name: 'Sixth House',
    latinName: 'Valetudo (Health)',
    keywords: ['health', 'work', 'service', 'routine', 'wellness', 'details'],
    significations: {
      primary: [
        'Health and illness',
        'Daily work and routine',
        'Service to others',
        'Small animals',
        'Employees and subordinates'
      ],
      derived: [
        'Hygiene and habits',
        'Diet and nutrition',
        'Work environment',
        'Useful skills',
        'Duty and obligation'
      ],
      modern: [
        'Wellness practices',
        'Daily routines',
        'Service work',
        'Mind-body connection',
        'Self-improvement'
      ],
      traditional: [
        'Sickness and disease',
        'Toil and labor',
        'Slaves and servants',
        'Small cattle',
        'Harm and injury'
      ]
    },
    rulingPlanet: 'mercury',
    element: 'earth',
    modality: 'mutable',
    joy: 'mars',
    detriment: 'venus'
  },

  7: {
    number: 7,
    name: 'Seventh House',
    latinName: 'Uxor (Spouse)',
    keywords: ['partnership', 'marriage', 'others', 'contracts', 'balance', 'open enemies'],
    significations: {
      primary: [
        'Marriage and partnerships',
        'Committed relationships',
        'Contracts and agreements',
        'The "other" and projection',
        'Open enemies'
      ],
      derived: [
        'Business partnerships',
        'Legal matters',
        'Consultants and advisors',
        'Public relations',
        'How you relate to others'
      ],
      modern: [
        'Intimate partnerships',
        'Relationship patterns',
        'Projection onto others',
        'Balance and compromise',
        'One-on-one connections'
      ],
      traditional: [
        'Marriage and contracts',
        'Open enemies (vs hidden)',
        'Fugitives and runaways',
        'Thieves and robbers',
        'The setting sun'
      ]
    },
    rulingPlanet: 'venus',
    element: 'air',
    modality: 'cardinal',
    joy: null,
    detriment: 'saturn'
  },

  8: {
    number: 8,
    name: 'Eighth House',
    latinName: 'Mors (Death)',
    keywords: ['transformation', 'shared resources', 'death', 'crisis', 'intimacy', 'power'],
    significations: {
      primary: [
        'Death and transformation',
        'Shared resources',
        'Inheritance and legacies',
        'Intimacy and merging',
        'Crisis and healing'
      ],
      derived: [
        'Taxes and debts',
        'Partners finances',
        'Occult and mysteries',
        'Rebirth and regeneration',
        'Psychological depth'
      ],
      modern: [
        'Deep transformation',
        'Emotional intimacy',
        'Shared power',
        'Psychological healing',
        'Mystical experiences'
      ],
      traditional: [
        'Death and destruction',
        'Others money',
        'Fear and anxiety',
        'Punishment and torment',
        'Inheritance'
      ]
    },
    rulingPlanet: 'mars',
    element: 'water',
    modality: 'fixed',
    joy: null,
    detriment: 'venus'
  },

  9: {
    number: 9,
    name: 'Ninth House',
    latinName: 'Iter (Journey)',
    keywords: ['philosophy', 'travel', 'higher learning', 'meaning', 'expansion', 'belief'],
    significations: {
      primary: [
        'Higher education',
        'Philosophy and religion',
        'Long journeys and foreign lands',
        'Spirituality and meaning',
        'Publishing and broadcasting'
      ],
      derived: [
        'Legal system and courts',
        'Foreign cultures',
        'Wisdom and truth',
        'Expansion of mind',
        'Teaching and mentorship'
      ],
      modern: [
        'Personal philosophy',
        'Spiritual seeking',
        'Higher meaning',
        'Travel for growth',
        'Expanded awareness'
      ],
      traditional: [
        'Long travels',
        'Dreams and visions',
        'Religion and faith',
        'Wisdom and science',
        'God and spirit'
      ]
    },
    rulingPlanet: 'jupiter',
    element: 'fire',
    modality: 'mutable',
    joy: 'sun',
    detriment: 'mercury'
  },

  10: {
    number: 10,
    name: 'Tenth House',
    latinName: 'Regnum (Kingdom)',
    keywords: ['career', 'status', 'authority', 'achievement', 'public', 'legacy'],
    significations: {
      primary: [
        'Career and vocation',
        'Public status and reputation',
        'Authority figures',
        'Life direction',
        'Achievement and honors'
      ],
      derived: [
        'Employers and bosses',
        'Mother (or father)',
        'Government and institutions',
        'Responsibility',
        'Your contribution to world'
      ],
      modern: [
        'Life purpose',
        'Public role',
        'Professional identity',
        'Authority within self',
        'Legacy building'
      ],
      traditional: [
        'Kingship and authority',
        'Honor and dignity',
        'Public reputation',
        'Command and power',
        'The noon of life'
      ]
    },
    rulingPlanet: 'saturn',
    element: 'earth',
    modality: 'cardinal',
    joy: null,
    detriment: 'moon'
  },

  11: {
    number: 11,
    name: 'Eleventh House',
    latinName: 'Benefacta (Friendship)',
    keywords: ['friends', 'groups', 'hopes', 'future', 'community', 'ideals'],
    significations: {
      primary: [
        'Friends and social groups',
        'Hopes and wishes',
        'Organizations and clubs',
        'Future goals',
        'Benefactors and support'
      ],
      derived: [
        'Social causes',
        'Networking',
        'Support systems',
        'Aspirations',
        'Group affiliations'
      ],
      modern: [
        'Social consciousness',
        'Community involvement',
        'Idealistic goals',
        'Friendship circles',
        'Future vision'
      ],
      traditional: [
        'Friends and allies',
        'Good fortune (help)',
        'Trust and fidelity',
        'Desires and hopes',
        'Praises and credit'
      ]
    },
    rulingPlanet: 'saturn',
    element: 'air',
    modality: 'fixed',
    joy: 'jupiter',
    detriment: null
  },

  12: {
    number: 12,
    name: 'Twelfth House',
    latinName: 'Carcer (Prison)',
    keywords: ['unconscious', 'spirituality', 'secrets', 'sacrifice', 'isolation', 'karma'],
    significations: {
      primary: [
        'The unconscious mind',
        'Hidden enemies',
        'Self-undoing and secrets',
        'Spiritual liberation',
        'Isolation and retreat'
      ],
      derived: [
        'Institutions (hospitals, prisons)',
        'Karmic debts',
        'Selfless service',
        'Mystical experiences',
        'What we hide from ourselves'
      ],
      modern: [
        'Shadow work',
        'Spiritual surrender',
        'Collective unconscious',
        'Compassion and service',
        'Release and letting go'
      ],
      traditional: [
        'Enemies hidden',
        'Sorrow and tribulation',
        'Prisons and confinement',
        'Large cattle',
        'Self-destruction'
      ]
    },
    rulingPlanet: 'jupiter',
    element: 'water',
    modality: 'mutable',
    joy: 'saturn',
    detriment: 'mercury'
  }
};

/**
 * Get house journey theme - how this house fits into soul development
 */
export function getHouseJourneyTheme(houseNumber: number): string {
  const themes: Record<number, string> = {
    1: 'Birth of Self - "Who am I?"',
    2: 'Building Resources - "What do I have?"',
    3: 'Learning to Communicate - "How do I connect?"',
    4: 'Finding Roots - "Where do I belong?"',
    5: 'Creative Expression - "What brings me joy?"',
    6: 'Service and Health - "How can I improve?"',
    7: 'Meeting the Other - "Who is my mirror?"',
    8: 'Deep Transformation - "What must die to be reborn?"',
    9: 'Seeking Meaning - "What is the truth?"',
    10: 'Claiming Authority - "What is my calling?"',
    11: 'Joining Humanity - "How can I contribute?"',
    12: 'Return to Source - "What is beyond the self?"'
  };
  return themes[houseNumber] || 'Unknown';
}

/**
 * Get house affirmation for daily practice
 */
export function getHouseAffirmation(houseNumber: number): string {
  const affirmations: Record<number, string> = {
    1: 'I honor my unique presence in the world.',
    2: 'I am worthy of abundance and security.',
    3: 'I communicate with clarity and kindness.',
    4: 'I am rooted in love and belonging.',
    5: 'I express my creativity with joy.',
    6: 'I serve with love and care for my wellbeing.',
    7: 'I relate to others with balance and respect.',
    8: 'I embrace transformation as my ally.',
    9: 'I expand my understanding with an open mind.',
    10: 'I step into my purpose with integrity.',
    11: 'I contribute my gifts to the collective.',
    12: 'I surrender to the wisdom of the universe.'
  };
  return affirmations[houseNumber] || 'I am whole and complete.';
}

export default HOUSE_MEANINGS;
