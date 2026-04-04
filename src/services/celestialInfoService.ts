/**
 * Celestial Information Service
 * Provides educational content and calculations for astronomical/astrological events
 */

export interface CelestialEventInfo {
  name: string;
  description: string;
  significance: string;
  traditions: string[];
  observance: string;
  symbol: string;
}

export interface ZodiacInfo {
  sign: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  modality: 'Cardinal' | 'Fixed' | 'Mutable';
  dates: string;
  traits: string[];
  rulingPlanet: string;
  description: string;
}

export interface ChineseZodiacInfo {
  animal: string;
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  yinYang: 'Yin' | 'Yang';
  characteristics: string[];
  description: string;
  luckyNumbers: number[];
  luckyColors: string[];
}

// Seasonal Events Encyclopedia
export const SEASONAL_EVENT_INFO: Record<string, CelestialEventInfo> = {
  'Vernal Equinox': {
    name: 'Vernal Equinox (Spring Equinox)',
    description: 'One of two moments in the year when the Sun is exactly above the Equator and day and night are of equal length.',
    significance: 'Marks the astronomical beginning of spring in the Northern Hemisphere. The Sun crosses the celestial equator moving northward.',
    traditions: [
      'Ancient cultures celebrated the return of light and life',
      'Persian New Year (Nowruz) begins on this day',
      'Stonehenge alignments mark this astronomical event',
      'Symbolizes balance, renewal, and new beginnings'
    ],
    observance: 'Day and night are approximately equal (12 hours each). Sun rises due east, sets due west.',
    symbol: '🌸'
  },
  'Summer Solstice': {
    name: 'Summer Solstice',
    description: 'The longest day of the year when the Sun reaches its highest position in the sky at noon.',
    significance: 'The Sun appears at its northernmost point, resulting in maximum daylight hours. Marks the beginning of summer.',
    traditions: [
      'Stonehenge gathering to watch sunrise',
      'Midsummer celebrations across Europe',
      'Ancient fertility rituals',
      'Celebration of light and solar energy at its peak'
    ],
    observance: 'Longest day, shortest night. In polar regions, the Sun may not set at all (Midnight Sun).',
    symbol: '☀️'
  },
  'Autumnal Equinox': {
    name: 'Autumnal Equinox (Fall Equinox)',
    description: 'The second equinox of the year, when day and night are again of equal length.',
    significance: 'The Sun crosses the celestial equator moving southward. Marks the astronomical beginning of autumn.',
    traditions: [
      'Harvest festivals worldwide',
      'Thanksgiving traditions',
      'Day of the Dead preparations begin',
      'Time of gratitude and gathering resources'
    ],
    observance: 'Equal day and night. Shadows become longer as the Sun lowers in the sky.',
    symbol: '🍂'
  },
  'Winter Solstice': {
    name: 'Winter Solstice',
    description: 'The shortest day and longest night of the year. The Sun is at its lowest daily maximum elevation.',
    significance: 'The Sun appears at its southernmost point. After this day, days begin to lengthen again.',
    traditions: [
      'Christmas, Hanukkah, and Yule celebrations',
      'Ancient light festivals (returning of the Sun)',
      'Newgrange passage tomb illumination',
      'Celebration of hope and the returning light'
    ],
    observance: 'Shortest day of the year. The Sun rises and sets at its southernmost points on the horizon.',
    symbol: '❄️'
  },
  'Perihelion': {
    name: 'Perihelion',
    description: 'The point in Earth\'s orbit when it is closest to the Sun.',
    significance: 'Earth is about 147 million km from the Sun (3 million km closer than average). Occurs in early January.',
    traditions: [
      'Ancient observations of varying solar intensity',
      'Modern astronomical marker'
    ],
    observance: 'Happens in early January. Not related to seasons (they\'re caused by axial tilt, not distance).',
    symbol: '☀️'
  },
  'Aphelion': {
    name: 'Aphelion',
    description: 'The point in Earth\'s orbit when it is farthest from the Sun.',
    significance: 'Earth is about 152 million km from the Sun. Occurs in early July.',
    traditions: [
      'Counter-intuitive: summer in Northern Hemisphere despite being farther from Sun'
    ],
    observance: 'Happens in early July. Demonstrates that seasons are caused by axial tilt, not distance.',
    symbol: '🌍'
  }
};

// Western Zodiac Information
export const ZODIAC_INFO: Record<string, ZodiacInfo> = {
  'Aries': {
    sign: 'Aries',
    symbol: '♈',
    element: 'Fire',
    modality: 'Cardinal',
    dates: 'March 21 - April 19',
    traits: ['Bold', 'Ambitious', 'Passionate', 'Leadership', 'Courageous'],
    rulingPlanet: 'Mars',
    description: 'The first sign of the zodiac, representing new beginnings, initiative, and pioneering spirit.'
  },
  'Taurus': {
    sign: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    modality: 'Fixed',
    dates: 'April 20 - May 20',
    traits: ['Reliable', 'Patient', 'Practical', 'Devoted', 'Stable'],
    rulingPlanet: 'Venus',
    description: 'Represents stability, sensuality, and connection to the physical world.'
  },
  'Gemini': {
    sign: 'Gemini',
    symbol: '♊',
    element: 'Air',
    modality: 'Mutable',
    dates: 'May 21 - June 20',
    traits: ['Adaptable', 'Versatile', 'Intellectual', 'Communicative', 'Curious'],
    rulingPlanet: 'Mercury',
    description: 'The twins represent duality, communication, and intellectual exchange.'
  },
  'Cancer': {
    sign: 'Cancer',
    symbol: '♋',
    element: 'Water',
    modality: 'Cardinal',
    dates: 'June 21 - July 22',
    traits: ['Intuitive', 'Emotional', 'Protective', 'Nurturing', 'Loyal'],
    rulingPlanet: 'Moon',
    description: 'The crab represents home, family, emotional depth, and protective instincts.'
  },
  'Leo': {
    sign: 'Leo',
    symbol: '♌',
    element: 'Fire',
    modality: 'Fixed',
    dates: 'July 23 - August 22',
    traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted', 'Cheerful'],
    rulingPlanet: 'Sun',
    description: 'The lion represents creativity, self-expression, and radiating warmth.'
  },
  'Virgo': {
    sign: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    modality: 'Mutable',
    dates: 'August 23 - September 22',
    traits: ['Analytical', 'Practical', 'Diligent', 'Modest', 'Reliable'],
    rulingPlanet: 'Mercury',
    description: 'The maiden represents purity, service, attention to detail, and practical wisdom.'
  },
  'Libra': {
    sign: 'Libra',
    symbol: '♎',
    element: 'Air',
    modality: 'Cardinal',
    dates: 'September 23 - October 22',
    traits: ['Diplomatic', 'Fair-minded', 'Social', 'Cooperative', 'Gracious'],
    rulingPlanet: 'Venus',
    description: 'The scales represent balance, justice, relationships, and aesthetic appreciation.'
  },
  'Scorpio': {
    sign: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    modality: 'Fixed',
    dates: 'October 23 - November 21',
    traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn', 'True friend'],
    rulingPlanet: 'Mars / Pluto',
    description: 'The scorpion represents transformation, depth, mystery, and emotional intensity.'
  },
  'Sagittarius': {
    sign: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    modality: 'Mutable',
    dates: 'November 22 - December 21',
    traits: ['Generous', 'Idealistic', 'Great sense of humor', 'Freedom-loving', 'Adventurous'],
    rulingPlanet: 'Jupiter',
    description: 'The archer represents exploration, philosophy, higher learning, and adventure.'
  },
  'Capricorn': {
    sign: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    modality: 'Cardinal',
    dates: 'December 22 - January 19',
    traits: ['Responsible', 'Disciplined', 'Self-control', 'Good managers', 'Traditional'],
    rulingPlanet: 'Saturn',
    description: 'The sea-goat represents ambition, structure, achievement, and mastery over time.'
  },
  'Aquarius': {
    sign: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    modality: 'Fixed',
    dates: 'January 20 - February 18',
    traits: ['Progressive', 'Original', 'Independent', 'Humanitarian', 'Intellectual'],
    rulingPlanet: 'Saturn / Uranus',
    description: 'The water-bearer represents innovation, community, revolution, and higher consciousness.'
  },
  'Pisces': {
    sign: 'Pisces',
    symbol: '♓',
    element: 'Water',
    modality: 'Mutable',
    dates: 'February 19 - March 20',
    traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle', 'Wise'],
    rulingPlanet: 'Jupiter / Neptune',
    description: 'The fish represents spirituality, dreams, empathy, and connection to the collective unconscious.'
  }
};

// Chinese Zodiac Information
export const CHINESE_ZODIAC_INFO: Record<string, ChineseZodiacInfo> = {
  'Rat': {
    animal: 'Rat',
    element: 'Water',
    yinYang: 'Yang',
    characteristics: ['Quick-witted', 'Resourceful', 'Versatile', 'Kind'],
    description: 'The Rat is the first animal in the Chinese zodiac. People born in the Year of the Rat are intelligent, charming, and quick-witted.',
    luckyNumbers: [2, 3],
    luckyColors: ['Blue', 'Gold', 'Green']
  },
  'Ox': {
    animal: 'Ox',
    element: 'Earth',
    yinYang: 'Yin',
    characteristics: ['Diligent', 'Dependable', 'Strong', 'Determined'],
    description: 'The Ox is the second animal. Ox people are hardworking, reliable, and methodical. They achieve success through consistent effort.',
    luckyNumbers: [1, 4],
    luckyColors: ['White', 'Yellow', 'Green']
  },
  'Tiger': {
    animal: 'Tiger',
    element: 'Wood',
    yinYang: 'Yang',
    characteristics: ['Brave', 'Confident', 'Competitive', 'Charismatic'],
    description: 'The Tiger is the third animal. Tigers are natural leaders, brave and confident. They are charming and well-liked.',
    luckyNumbers: [1, 3, 4],
    luckyColors: ['Blue', 'Gray', 'Orange']
  },
  'Rabbit': {
    animal: 'Rabbit',
    element: 'Wood',
    yinYang: 'Yin',
    characteristics: ['Quiet', 'Elegant', 'Kind', 'Responsible'],
    description: 'The Rabbit is the fourth animal. Rabbit people are gentle, artistic, and lucky in life. They prefer harmony over conflict.',
    luckyNumbers: [3, 4, 9],
    luckyColors: ['Red', 'Pink', 'Purple', 'Blue']
  },
  'Dragon': {
    animal: 'Dragon',
    element: 'Earth',
    yinYang: 'Yang',
    characteristics: ['Confident', 'Intelligent', 'Enthusiastic', 'Ambitious'],
    description: 'The Dragon is the fifth and most revered animal. Dragons are powerful, energetic, and natural achievers.',
    luckyNumbers: [1, 6, 7],
    luckyColors: ['Gold', 'Silver', 'Gray']
  },
  'Snake': {
    animal: 'Snake',
    element: 'Fire',
    yinYang: 'Yin',
    characteristics: ['Enigmatic', 'Intelligent', 'Wise', 'Intuitive'],
    description: 'The Snake is the sixth animal. Snake people are mysterious, wise, and good at making money. They are deep thinkers.',
    luckyNumbers: [2, 8, 9],
    luckyColors: ['Black', 'Red', 'Yellow']
  },
  'Horse': {
    animal: 'Horse',
    element: 'Fire',
    yinYang: 'Yang',
    characteristics: ['Animated', 'Active', 'Energetic', 'Independent'],
    description: 'The Horse is the seventh animal. Horse people are free spirits who love travel and adventure. They are quick-witted.',
    luckyNumbers: [2, 3, 7],
    luckyColors: ['Yellow', 'Green']
  },
  'Goat': {
    animal: 'Goat',
    element: 'Earth',
    yinYang: 'Yin',
    characteristics: ['Calm', 'Gentle', 'Sympathetic', 'Creative'],
    description: 'The Goat is the eighth animal. Goat people are artistic, calm, and compassionate. They prefer peaceful environments.',
    luckyNumbers: [2, 7],
    luckyColors: ['Brown', 'Red', 'Purple']
  },
  'Monkey': {
    animal: 'Monkey',
    element: 'Metal',
    yinYang: 'Yang',
    characteristics: ['Sharp', 'Smart', 'Curious', 'Mischievous'],
    description: 'The Monkey is the ninth animal. Monkeys are clever, curious, and great problem solvers. They have magnetic personalities.',
    luckyNumbers: [4, 9],
    luckyColors: ['White', 'Blue', 'Gold']
  },
  'Rooster': {
    animal: 'Rooster',
    element: 'Metal',
    yinYang: 'Yin',
    characteristics: ['Observant', 'Hardworking', 'Courageous', 'Talented'],
    description: 'The Rooster is the tenth animal. Roosters are practical, observant, and hardworking. They are reliable friends.',
    luckyNumbers: [5, 7, 8],
    luckyColors: ['Gold', 'Brown', 'Yellow']
  },
  'Dog': {
    animal: 'Dog',
    element: 'Earth',
    yinYang: 'Yang',
    characteristics: ['Loyal', 'Honest', 'Cautious', 'Kind'],
    description: 'The Dog is the eleventh animal. Dog people are loyal, honest, and true friends. They have strong moral principles.',
    luckyNumbers: [3, 4, 9],
    luckyColors: ['Red', 'Green', 'Purple']
  },
  'Pig': {
    animal: 'Pig',
    element: 'Water',
    yinYang: 'Yin',
    characteristics: ['Compassionate', 'Generous', 'Diligent', 'Optimistic'],
    description: 'The Pig is the twelfth animal. Pig people are generous, compassionate, and enjoy life. They are blessed with good fortune.',
    luckyNumbers: [2, 5, 8],
    luckyColors: ['Yellow', 'Gray', 'Brown']
  }
};

// Calculate current sun sign (Western zodiac)
export function getCurrentSunSign(date: Date = new Date()): ZodiacInfo {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_INFO['Aries'];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_INFO['Taurus'];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_INFO['Gemini'];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_INFO['Cancer'];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_INFO['Leo'];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_INFO['Virgo'];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_INFO['Libra'];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_INFO['Scorpio'];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_INFO['Sagittarius'];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_INFO['Capricorn'];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_INFO['Aquarius'];
  return ZODIAC_INFO['Pisces'];
}

// Calculate Chinese zodiac
export function getChineseZodiac(year: number = new Date().getFullYear()): ChineseZodiacInfo {
  const animals = ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
  const animal = animals[year % 12];
  return CHINESE_ZODIAC_INFO[animal];
}

// Get Chinese zodiac element (cycles every 2 years within 10-year element cycle)
export function getChineseZodiacElement(year: number): string {
  const elements = ['Metal', 'Metal', 'Water', 'Water', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth'];
  return elements[year % 10];
}

// Get seasonal event info
export function getSeasonalEventInfo(eventName: string): CelestialEventInfo | undefined {
  // Try exact match first
  if (SEASONAL_EVENT_INFO[eventName]) {
    return SEASONAL_EVENT_INFO[eventName];
  }
  
  // Try partial match
  const key = Object.keys(SEASONAL_EVENT_INFO).find(k => 
    eventName.toLowerCase().includes(k.toLowerCase()) ||
    k.toLowerCase().includes(eventName.toLowerCase())
  );
  
  return key ? SEASONAL_EVENT_INFO[key] : undefined;
}
