/**
 * Numerology Service
 * Calculates daily numerology meanings and vibrations
 */

export interface NumerologyReading {
  dayNumber: number;
  masterNumber: string | null;
  meaning: string;
  energy: string;
  focus: string[];
  guidance: string;
  compatibleNumbers: number[];
  challengingNumbers: number[];
  luckyHours: number[];
}

// Numerology meanings for numbers 1-9 and master numbers
const NUMEROLOGY_MEANINGS: Record<number | string, {
  title: string;
  meaning: string;
  energy: string;
  focus: string[];
  guidance: string;
  compatible: number[];
  challenging: number[];
}> = {
  1: {
    title: 'The Leader',
    meaning: 'New beginnings, independence, creation, originality',
    energy: 'Pioneering, assertive, ambitious energy perfect for starting new projects',
    focus: ['New beginnings', 'Leadership', 'Independence', 'Self-reliance', 'Innovation'],
    guidance: 'Today favors new starts. Take the initiative. Be confident in your decisions. Lead with courage.',
    compatible: [3, 5, 7],
    challenging: [2, 4, 8]
  },
  2: {
    title: 'The Diplomat',
    meaning: 'Partnership, cooperation, balance, sensitivity, harmony',
    energy: 'Gentle, intuitive, diplomatic energy ideal for relationships and cooperation',
    focus: ['Partnership', 'Cooperation', 'Diplomacy', 'Sensitivity', 'Balance'],
    guidance: 'Focus on relationships today. Practice patience. Listen deeply. Seek harmony in all interactions.',
    compatible: [2, 4, 8],
    challenging: [1, 5, 7]
  },
  3: {
    title: 'The Communicator',
    meaning: 'Creativity, self-expression, joy, sociability, inspiration',
    energy: 'Creative, expressive, joyful energy excellent for communication and artistic pursuits',
    focus: ['Creativity', 'Communication', 'Self-expression', 'Joy', 'Socializing'],
    guidance: 'Express yourself freely today. Share your ideas. Embrace creativity. Connect with others joyfully.',
    compatible: [1, 5, 7],
    challenging: [4, 8]
  },
  4: {
    title: 'The Builder',
    meaning: 'Stability, practicality, hard work, foundation, discipline',
    energy: 'Stable, practical, methodical energy perfect for building and organizing',
    focus: ['Organization', 'Hard work', 'Practicality', 'Stability', 'Building foundations'],
    guidance: 'Focus on building solid foundations today. Be methodical. Pay attention to details. Create stability.',
    compatible: [2, 8],
    challenging: [3, 5, 9]
  },
  5: {
    title: 'The Adventurer',
    meaning: 'Freedom, change, adaptability, experience, versatility',
    energy: 'Dynamic, adventurous, flexible energy ideal for change and new experiences',
    focus: ['Change', 'Freedom', 'Adventure', 'Flexibility', 'New experiences'],
    guidance: 'Embrace change today. Be adaptable. Seek new experiences. Enjoy freedom and variety.',
    compatible: [1, 3, 7],
    challenging: [2, 4, 6]
  },
  6: {
    title: 'The Nurturer',
    meaning: 'Love, responsibility, family, service, healing, balance',
    energy: 'Caring, responsible, harmonious energy perfect for family and service',
    focus: ['Family', 'Responsibility', 'Service', 'Love', 'Healing', 'Beauty'],
    guidance: 'Focus on loved ones today. Take responsibility with grace. Create beauty. Nurture relationships.',
    compatible: [2, 4, 8],
    challenging: [5, 7]
  },
  7: {
    title: 'The Seeker',
    meaning: 'Spirituality, wisdom, introspection, analysis, mystery',
    energy: 'Introspective, analytical, spiritual energy ideal for study and inner work',
    focus: ['Spirituality', 'Study', 'Analysis', 'Inner wisdom', 'Contemplation'],
    guidance: 'Turn inward today. Seek knowledge. Trust your intuition. Analyze before deciding. Embrace solitude.',
    compatible: [1, 3, 5],
    challenging: [2, 4, 6]
  },
  8: {
    title: 'The Powerhouse',
    meaning: 'Abundance, power, authority, success, material mastery',
    energy: 'Powerful, authoritative, abundant energy excellent for business and achievement',
    focus: ['Career', 'Abundance', 'Authority', 'Achievement', 'Power'],
    guidance: 'Focus on goals today. Step into your power. Manage resources wisely. Aim for success with integrity.',
    compatible: [2, 4, 6],
    challenging: [1, 3, 5]
  },
  9: {
    title: 'The Humanitarian',
    meaning: 'Completion, compassion, universal love, wisdom, letting go',
    energy: 'Compassionate, wise, completion-oriented energy for endings and humanitarian work',
    focus: ['Completion', 'Compassion', 'Humanitarianism', 'Wisdom', 'Letting go'],
    guidance: 'Practice compassion today. Complete pending tasks. Release what no longer serves. Serve humanity.',
    compatible: [3, 6, 9],
    challenging: [4, 8]
  },
  11: {
    title: 'The Master Intuitive',
    meaning: 'Spiritual illumination, intuition, enlightenment, visionary',
    energy: 'Highly intuitive, spiritually charged energy for inspiration and higher consciousness',
    focus: ['Intuition', 'Spiritual insight', 'Inspiration', 'Vision', 'Enlightenment'],
    guidance: 'Trust your intuition deeply today. Seek spiritual insights. Be a light for others. Visionary thinking favored.',
    compatible: [2, 7, 22],
    challenging: []
  },
  22: {
    title: 'The Master Builder',
    meaning: 'Manifestation, practical idealism, grand achievements, mastery',
    energy: 'Powerful manifestation energy for building dreams into reality on a large scale',
    focus: ['Manifestation', 'Big projects', 'Practical idealism', 'Legacy', 'Mastery'],
    guidance: 'Dream big and build practically today. Manifest your visions. Create lasting structures. Think long-term.',
    compatible: [4, 8, 11],
    challenging: []
  },
  33: {
    title: 'The Master Teacher',
    meaning: 'Compassionate leadership, spiritual guidance, universal love, blessing',
    energy: 'Christ consciousness energy of pure compassion and unconditional love for teaching and healing',
    focus: ['Teaching', 'Healing', 'Compassion', 'Spiritual guidance', 'Service'],
    guidance: 'Lead with love today. Teach through example. Offer healing. Serve with pure compassion. Bless others.',
    compatible: [3, 6, 9],
    challenging: []
  }
};

// Lucky hours based on day number
const LUCKY_HOURS: Record<number, number[]> = {
  1: [1, 10, 19, 22],
  2: [2, 11, 20, 23],
  3: [3, 12, 21],
  4: [4, 13, 22],
  5: [5, 14, 23],
  6: [6, 15],
  7: [7, 16],
  8: [8, 17],
  9: [9, 18]
};

/**
 * Calculate the numerology number for a specific date
 */
export function calculateDayNumber(date: Date = new Date()): number {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  // Calculate using standard numerology method
  const dateString = `${day}${month}${year}`;
  let sum = dateString.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  
  // Reduce to single digit unless master number
  while (sum > 9 && ![11, 22, 33].includes(sum)) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

/**
 * Check if a number is a master number
 */
function getMasterNumber(num: number): string | null {
  if ([11, 22, 33].includes(num)) {
    return num.toString();
  }
  return null;
}

/**
 * Get full numerology reading for a date
 */
export function getNumerologyReading(date: Date = new Date()): NumerologyReading {
  const dayNumber = calculateDayNumber(date);
  const masterNumber = getMasterNumber(dayNumber);
  
  // If it's a master number, use that meaning, otherwise use the single digit
  const meaningKey = masterNumber || dayNumber;
  const meaning = NUMEROLOGY_MEANINGS[meaningKey];
  
  return {
    dayNumber,
    masterNumber,
    meaning: meaning.meaning,
    energy: meaning.energy,
    focus: meaning.focus,
    guidance: meaning.guidance,
    compatibleNumbers: meaning.compatible,
    challengingNumbers: meaning.challenging,
    luckyHours: LUCKY_HOURS[dayNumber] || [12]
  };
}

/**
 * Calculate personal year number
 */
export function calculatePersonalYear(birthMonth: number, birthDay: number, year: number = new Date().getFullYear()): number {
  const sum = birthDay + birthMonth + year;
  let result = sum;
  
  while (result > 9 && ![11, 22].includes(result)) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return result;
}

/**
 * Calculate life path number from birth date
 */
export function calculateLifePath(birthDate: Date): number {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();
  
  let sum = day + month + year;
  
  while (sum > 9 && ![11, 22, 33].includes(sum)) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  
  return sum;
}

/**
 * Get daily affirmation based on numerology
 */
export function getDailyAffirmation(dayNumber: number): string {
  const affirmations: Record<number, string> = {
    1: "I am a leader. I create my reality with confidence and courage.",
    2: "I am in harmony. I attract peaceful partnerships and balanced relationships.",
    3: "I am creative. My expression brings joy and inspiration to the world.",
    4: "I am building. I create solid foundations for lasting success.",
    5: "I am free. I embrace change and welcome exciting new experiences.",
    6: "I am love. I nurture myself and others with compassion and grace.",
    7: "I am wisdom. I trust my intuition and seek deeper understanding.",
    8: "I am abundance. I manifest success and prosperity with integrity.",
    9: "I am completion. I release the old and welcome transformation."
  };
  
  return affirmations[dayNumber] || "I am aligned with the universe's perfect timing.";
}
