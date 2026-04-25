/**
 * Day of the Week Service
 * Planetary rulership, etymology, ancient beliefs, modern statistics
 * Rich psychological and cultural content
 */

export interface DayOfWeekData {
  day: string;
  planet: string;
  planetSymbol: string;
  icon: string;
  color: string;
  gradient: string;
  ancientNames: Record<string, string>;
  etymology: {
    english: string;
    latin: string;
    greek: string;
    meaning: string;
  };
  mythology: string;
  qualities: string[];
  favorableActivities: string[];
  psychology: {
    mood: string;
    energy: string;
    productivity: string;
    social: string;
  };
  modernStats: {
    title: string;
    stat: string;
    context: string;
  }[];
  bodySystems: string;
  colors: string[];
  gemstones: string[];
  numerology: number;
}

const DAYS_DATA: Record<number, DayOfWeekData> = {
  0: { // Sunday
    day: 'Sunday',
    planet: 'Sun',
    planetSymbol: '☉',
    icon: '☀️',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
    ancientNames: {
      latin: 'Dies Solis',
      greek: 'Hemera Heliou',
      norse: 'Sunnudagr',
      sanskrit: 'Ravivara'
    },
    etymology: {
      english: 'Sun + Day',
      latin: 'Dies Solis (Day of the Sun)',
      greek: 'Hemera Heliou (Day of Helios)',
      meaning: 'Named for the Sun, source of life and light'
    },
    mythology: 'In Roman mythology, Sol Invictus (the Unconquered Sun) was worshipped as the supreme deity. The Emperor Constantine decreed Dies Solis as a day of rest. In Greek tradition, Helios drove his chariot of fire across the sky.',
    qualities: ['Vitality', 'Leadership', 'Success', 'Visibility', 'Creativity', 'Generosity'],
    favorableActivities: [
      'Start new ventures and projects',
      'Seek recognition and promotion',
      'Creative pursuits and artistic expression',
      'Physical exercise and outdoor activities',
      'Spend time with family and children',
      'Self-care and personal development'
    ],
    psychology: {
      mood: 'Optimistic, confident, radiant',
      energy: 'High vitality, extroverted',
      productivity: 'Best for visionary planning',
      social: 'Generous, warm, leadership qualities emerge'
    },
    modernStats: [
      {
        title: 'Mental Health',
        stat: 'Lowest depression rates',
        context: 'Studies show Sunday has the lowest reported anxiety levels of any weekday'
      },
      {
        title: 'Productivity Paradox',
        stat: '47% work from home',
        context: 'Despite being a "rest day", many professionals catch up on work'
      },
      {
        title: 'Sleep Patterns',
        stat: '+30 min average sleep',
        context: 'People tend to sleep longer on Sunday nights before the work week'
      }
    ],
    bodySystems: 'Heart, circulatory system, spine, eyes',
    colors: ['Gold', 'Orange', 'Yellow', 'Amber'],
    gemstones: ['Ruby', 'Carnelian', 'Tiger Eye', 'Sunstone'],
    numerology: 1
  },
  1: { // Monday
    day: 'Monday',
    planet: 'Moon',
    planetSymbol: '☽',
    icon: '🌙',
    color: '#c4b5fd',
    gradient: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #8b5cf6 100%)',
    ancientNames: {
      latin: 'Dies Lunae',
      greek: 'Hemera Selenes',
      norse: 'Manadagr',
      sanskrit: 'Somavara'
    },
    etymology: {
      english: 'Moon + Day',
      latin: 'Dies Lunae (Day of the Moon)',
      greek: 'Hemera Selenes (Day of Selene)',
      meaning: 'Named for the Moon, ruler of tides and emotions'
    },
    mythology: 'The Moon has been worshipped since prehistoric times. In Greek myth, Selene drove her silver chariot across the night sky. The word "month" derives from the Moon\'s 29.5-day cycle. Monday was considered auspicious for beginnings in many cultures.',
    qualities: ['Intuition', 'Emotions', 'Nurturing', 'Reflection', 'Memory', 'Imagination'],
    favorableActivities: [
      'Self-care and emotional processing',
      'Home activities and family time',
      'Introspection and journaling',
      'Planning and organization',
      'Nurturing relationships',
      'Creative visualization'
    ],
    psychology: {
      mood: 'Introspective, sensitive, nurturing',
      energy: 'Fluctuating, receptive, yin energy',
      productivity: 'Best for planning, less for execution',
      social: 'Intimate conversations, avoid large groups'
    },
    modernStats: [
      {
        title: 'Heart Attacks',
        stat: 'Highest rate of week',
        context: 'Monday mornings show 20% increase in cardiac events due to stress'
      },
      {
        title: 'Suicide Rate',
        stat: 'Peak day for suicides',
        context: 'Mondays have the highest suicide rates globally - "Blue Monday" effect'
      },
      {
        title: 'Work Productivity',
        stat: 'Lowest of weekdays',
        context: 'Studies show Monday is the least productive workday'
      }
    ],
    bodySystems: 'Stomach, breasts, lymphatic system, uterus',
    colors: ['Silver', 'White', 'Pearl', 'Lavender'],
    gemstones: ['Moonstone', 'Pearl', 'Selenite', 'Opal'],
    numerology: 2
  },
  2: { // Tuesday
    day: 'Tuesday',
    planet: 'Mars',
    planetSymbol: '♂',
    icon: '⚔️',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
    ancientNames: {
      latin: 'Dies Martis',
      greek: 'Hemera Areos',
      norse: 'Tysdagr',
      sanskrit: 'Mangalavara'
    },
    etymology: {
      english: 'Tiw + Day (Norse Tyr)',
      latin: 'Dies Martis (Day of Mars)',
      greek: 'Hemera Areos (Day of Ares)',
      meaning: 'Named for Mars/Ares, god of war and courage'
    },
    mythology: 'Tyr was the Norse god of war and justice, who sacrificed his hand to bind the wolf Fenrir. Mars was the Roman god of war, second only to Jupiter in importance. The day was considered favorable for battle and legal matters.',
    qualities: ['Action', 'Courage', 'Drive', 'Passion', 'Assertion', 'Competition'],
    favorableActivities: [
      'Tackle challenging tasks head-on',
      'Physical exercise and sports',
      'Assertiveness and standing your ground',
      'Competitive activities',
      'Surgery and medical procedures',
      'Breaking bad habits'
    ],
    psychology: {
      mood: 'Assertive, energetic, potentially aggressive',
      energy: 'High physical energy, impulsive',
      productivity: 'Excellent for difficult tasks requiring courage',
      social: 'Direct communication, avoid conflicts'
    },
    modernStats: [
      {
        title: 'Road Accidents',
        stat: 'Highest fatality rate',
        context: 'Tuesday has the most fatal road accidents - aggressive driving'
      },
      {
        title: 'Arguments',
        stat: 'Peak day for conflicts',
        context: 'Workplace conflicts peak on Tuesdays'
      },
      {
        title: 'Exercise Adherence',
        stat: 'Best day for gym visits',
        context: 'People most likely to stick to exercise routines'
      }
    ],
    bodySystems: 'Muscles, blood, adrenal glands, head',
    colors: ['Red', 'Scarlet', 'Crimson', 'Rust'],
    gemstones: ['Ruby', 'Garnet', 'Bloodstone', 'Red Jasper'],
    numerology: 9
  },
  3: { // Wednesday
    day: 'Wednesday',
    planet: 'Mercury',
    planetSymbol: '☿',
    icon: '📜',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)',
    ancientNames: {
      latin: 'Dies Mercurii',
      greek: 'Hemera Hermu',
      norse: 'Odensdagr',
      sanskrit: 'Budhavara'
    },
    etymology: {
      english: 'Woden + Day (Odin)',
      latin: 'Dies Mercurii (Day of Mercury)',
      greek: 'Hemera Hermu (Day of Hermes)',
      meaning: 'Named for Mercury/Hermes, messenger of the gods'
    },
    mythology: 'Odin (Woden) was the chief Norse god who sacrificed an eye for wisdom. Mercury was the Roman messenger god, patron of commerce, thieves, and travelers. The day was favorable for business, learning, and travel.',
    qualities: ['Communication', 'Intellect', 'Learning', 'Adaptability', 'Commerce', 'Travel'],
    favorableActivities: [
      'Important communications and negotiations',
      'Writing, blogging, content creation',
      'Learning new skills and studying',
      'Short trips and errands',
      'Business deals and signing contracts',
      'Problem-solving and analysis'
    ],
    psychology: {
      mood: 'Mentally active, curious, communicative',
      energy: 'Quick, adaptable, scattered',
      productivity: 'Peak mental clarity and communication',
      social: 'Excellent for networking and meetings'
    },
    modernStats: [
      {
        title: 'Email Response',
        stat: 'Fastest reply rates',
        context: 'Emails sent Wednesday get fastest responses'
      },
      {
        title: 'Meeting Efficiency',
        stat: 'Most productive meetings',
        context: 'Wednesday meetings have highest decision rates'
      },
      {
        title: 'Creative Output',
        stat: 'Peak writing productivity',
        context: 'Writers produce most content mid-week'
      }
    ],
    bodySystems: 'Nervous system, lungs, hands, arms',
    colors: ['Yellow', 'Violet', 'Orange', 'Multicolor'],
    gemstones: ['Emerald', 'Agate', 'Tourmaline', 'Peridot'],
    numerology: 5
  },
  4: { // Thursday
    day: 'Thursday',
    planet: 'Jupiter',
    planetSymbol: '♃',
    icon: '⚡',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)',
    ancientNames: {
      latin: 'Dies Jovis',
      greek: 'Hemera Dios',
      norse: 'Thorsdagr',
      sanskrit: 'Guruvara'
    },
    etymology: {
      english: 'Thor + Day',
      latin: 'Dies Jovis (Day of Jove/Jupiter)',
      greek: 'Hemera Dios (Day of Zeus)',
      meaning: 'Named for Jupiter/Zeus, king of the gods'
    },
    mythology: 'Thor was the Norse god of thunder, protector of humanity with his mighty hammer Mjolnir. Jupiter was the Roman king of gods, ruler of the sky. Thursday was considered the luckiest day for important undertakings.',
    qualities: ['Expansion', 'Luck', 'Wisdom', 'Abundance', 'Growth', 'Justice'],
    favorableActivities: [
      'Major decisions and life changes',
      'Financial matters and investments',
      'Teaching and learning higher knowledge',
      'Travel planning and long journeys',
      'Legal matters and seeking justice',
      'Philanthropic activities'
    ],
    psychology: {
      mood: 'Optimistic, generous, philosophical',
      energy: 'Expansive, abundant, buoyant',
      productivity: 'Excellent for big-picture thinking',
      social: 'Generous, good for team building'
    },
    modernStats: [
      {
        title: 'Stock Market',
        stat: 'Historically strongest day',
        context: 'Thursday shows best historical stock performance'
      },
      {
        title: 'Job Applications',
        stat: 'Best day to apply',
        context: 'Applications sent Thursday have highest callback rates'
      },
      {
        title: 'Dating Success',
        stat: 'Best first date day',
        context: 'Thursday dates lead to most second dates'
      }
    ],
    bodySystems: 'Liver, hips, thighs, pituitary gland',
    colors: ['Purple', 'Royal Blue', 'Indigo', 'Gold'],
    gemstones: ['Sapphire', 'Amethyst', 'Lapis Lazuli', 'Turquoise'],
    numerology: 3
  },
  5: { // Friday
    day: 'Friday',
    planet: 'Venus',
    planetSymbol: '♀',
    icon: '💕',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #be185d 100%)',
    ancientNames: {
      latin: 'Dies Veneris',
      greek: 'Hemera Aphrodites',
      norse: 'Frijadagr',
      sanskrit: 'Sukravara'
    },
    etymology: {
      english: 'Frigg + Day (Norse) / Freyja',
      latin: 'Dies Veneris (Day of Venus)',
      greek: 'Hemera Aphrodites (Day of Aphrodite)',
      meaning: 'Named for Venus/Aphrodite, goddess of love and beauty'
    },
    mythology: 'Frigg was Odin\'s wife in Norse mythology, associated with love and fertility. Venus was the Roman goddess of love, beauty, and fertility. Friday was considered auspicious for weddings and romantic matters across many cultures.',
    qualities: ['Love', 'Beauty', 'Harmony', 'Creativity', 'Pleasure', 'Artistry'],
    favorableActivities: [
      'Social gatherings and parties',
      'Artistic and creative pursuits',
      'Romantic dates and relationships',
      'Beauty treatments and self-care',
      'Buying luxury items and art',
      'Reconciling conflicts'
    ],
    psychology: {
      mood: 'Social, affectionate, pleasure-seeking',
      energy: 'Magnetic, charming, sensual',
      productivity: 'Creative peak, less for analytical work',
      social: 'Excellent for socializing and romance'
    },
    modernStats: [
      {
        title: 'Social Media',
        stat: 'Highest engagement',
        context: 'Friday posts get most likes and shares'
      },
      {
        title: 'Spending',
        stat: 'Peak retail day',
        context: 'Friday is highest spending day of the week'
      },
      {
        title: 'Birth Rates',
        stat: 'Most common birthday',
        context: 'More people are born on Friday than any other day'
      }
    ],
    bodySystems: 'Kidneys, skin, neck, thyroid',
    colors: ['Pink', 'Green', 'Rose', 'Copper'],
    gemstones: ['Emerald', 'Rose Quartz', 'Jade', 'Coral'],
    numerology: 6
  },
  6: { // Saturday
    day: 'Saturday',
    planet: 'Saturn',
    planetSymbol: '♄',
    icon: '🪐',
    color: '#6b7280',
    gradient: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
    ancientNames: {
      latin: 'Dies Saturni',
      greek: 'Hemera Kronu',
      norse: 'Laugardagr',
      sanskrit: 'Sanivara'
    },
    etymology: {
      english: 'Saturn + Day',
      latin: 'Dies Saturni (Day of Saturn)',
      greek: 'Hemera Kronu (Day of Cronus)',
      meaning: 'Named for Saturn, god of time and agriculture'
    },
    mythology: 'Saturn was an ancient Roman god of agriculture and time. The Saturnalia festival was his greatest celebration. In Jewish tradition, Saturday became the Sabbath (Shabbat), the day of rest. The name persists as the only day directly from Roman tradition in English.',
    qualities: ['Discipline', 'Structure', 'Responsibility', 'Wisdom', 'Patience', 'Authority'],
    favorableActivities: [
      'Organization and decluttering',
      'Planning and setting boundaries',
      'Reviewing and completing work',
      'Gardening and earth work',
      'Studying serious subjects',
      'Rest and contemplation'
    ],
    psychology: {
      mood: 'Serious, reflective, disciplined',
      energy: 'Steady, methodical, reserved',
      productivity: 'Best for review and maintenance tasks',
      social: 'Prefer solitude or small groups'
    },
    modernStats: [
      {
        title: 'Road Fatalities',
        stat: 'HIGHEST of all days',
        context: 'Saturday has 40% more fatal accidents - alcohol + fatigue'
      },
      {
        title: 'Crime Rates',
        stat: 'Peak for violent crime',
        context: 'Saturday night shows highest assault rates'
      },
      {
        title: 'Hospital Admissions',
        stat: 'Busiest ER day',
        context: 'Emergency rooms see most admissions on Saturday'
      }
    ],
    bodySystems: 'Bones, teeth, knees, skin, gall bladder',
    colors: ['Black', 'Deep Blue', 'Dark Grey', 'Indigo'],
    gemstones: ['Onyx', 'Jet', 'Sapphire', 'Obsidian'],
    numerology: 8
  }
};

/**
 * Get day of week data
 */
export function getDayOfWeekData(date: Date = new Date()): DayOfWeekData {
  const dayIndex = date.getDay(); // 0 = Sunday
  return DAYS_DATA[dayIndex];
}

/**
 * Get all days for reference
 */
export function getAllDaysData(): DayOfWeekData[] {
  return Object.values(DAYS_DATA);
}

export const DayOfWeekService = {
  getDayOfWeekData,
  getAllDaysData
};

export default DayOfWeekService;
