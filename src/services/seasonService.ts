/**
 * Season Service
 * Determines current season based on date and hemisphere
 */

export interface SeasonInfo {
  name: string;
  emoji: string;
  description: string;
  startMonth: number; // 0-11
  endMonth: number;
  characteristics: string[];
  activities: string[];
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
}

const NORTHERN_SEASONS: Record<string, SeasonInfo> = {
  spring: {
    name: 'Spring',
    emoji: '🌸',
    description: 'A time of renewal, growth, and new beginnings. The Earth awakens from winter slumber.',
    startMonth: 2, // March
    endMonth: 4,   // May
    characteristics: [
      'Increasing daylight hours',
      'Plants begin to sprout',
      'Animals emerge from hibernation',
      'Renewed energy and vitality'
    ],
    activities: [
      'Planting seeds',
      'Spring cleaning',
      'Starting new projects',
      'Outdoor activities resume'
    ],
    element: 'Air'
  },
  summer: {
    name: 'Summer',
    emoji: '☀️',
    description: 'The peak of light and energy. Long days bring abundance and fullness of life.',
    startMonth: 5, // June
    endMonth: 7,   // August
    characteristics: [
      'Longest days of the year',
      'Peak solar energy',
      'Maximum growth in nature',
      'High activity and energy'
    ],
    activities: [
      'Harvesting early crops',
      'Outdoor gatherings',
      'Travel and adventure',
      'Creative pursuits'
    ],
    element: 'Fire'
  },
  autumn: {
    name: 'Autumn',
    emoji: '🍂',
    description: 'A time of harvest, reflection, and preparation. Nature begins to withdraw.',
    startMonth: 8,  // September
    endMonth: 10,   // November
    characteristics: [
      'Decreasing daylight',
      'Harvest time',
      'Leaves change color and fall',
      'Energy begins to consolidate'
    ],
    activities: [
      'Harvesting crops',
      'Preserving food',
      'Reflection and assessment',
      'Preparing for winter'
    ],
    element: 'Earth'
  },
  winter: {
    name: 'Winter',
    emoji: '❄️',
    description: 'The season of rest, introspection, and inner work. Nature sleeps beneath the surface.',
    startMonth: 11, // December
    endMonth: 1,    // February
    characteristics: [
      'Shortest days of the year',
      'Dormancy in nature',
      'Inward focus',
      'Conservation of energy'
    ],
    activities: [
      'Rest and recovery',
      'Planning for spring',
      'Indoor projects',
      'Deep reflection'
    ],
    element: 'Water'
  }
};

// Southern hemisphere has opposite seasons with correct characteristics
const SOUTHERN_SEASONS: Record<string, SeasonInfo> = {
  spring: {
    name: 'Spring',
    emoji: '🌸',
    description: 'A time of renewal, growth, and new beginnings. The Earth awakens from winter slumber.',
    startMonth: 8,  // September
    endMonth: 10,   // November
    characteristics: [
      'Increasing daylight hours',
      'Plants begin to sprout',
      'Animals emerge from hibernation',
      'Renewed energy and vitality'
    ],
    activities: [
      'Planting seeds',
      'Spring cleaning',
      'Starting new projects',
      'Outdoor activities resume'
    ],
    element: 'Air'
  },
  summer: {
    name: 'Summer',
    emoji: '☀️',
    description: 'The peak of light and energy. Long days bring abundance and fullness of life.',
    startMonth: 11, // December
    endMonth: 1,    // February
    characteristics: [
      'Longest days of the year',
      'Peak solar energy',
      'Maximum growth in nature',
      'High activity and energy'
    ],
    activities: [
      'Harvesting early crops',
      'Outdoor gatherings',
      'Travel and adventure',
      'Creative pursuits'
    ],
    element: 'Fire'
  },
  autumn: {
    name: 'Autumn',
    emoji: '🍂',
    description: 'A time of harvest, reflection, and preparation. Nature begins to withdraw.',
    startMonth: 2,  // March
    endMonth: 4,    // May
    characteristics: [
      'Decreasing daylight',
      'Harvest time',
      'Leaves change color and fall',
      'Energy begins to consolidate'
    ],
    activities: [
      'Harvesting crops',
      'Preserving food',
      'Reflection and assessment',
      'Preparing for winter'
    ],
    element: 'Earth'
  },
  winter: {
    name: 'Winter',
    emoji: '❄️',
    description: 'The season of rest, introspection, and inner work. Nature sleeps beneath the surface.',
    startMonth: 5,  // June
    endMonth: 7,    // August
    characteristics: [
      'Shortest days of the year',
      'Dormancy in nature',
      'Inward focus',
      'Conservation of energy'
    ],
    activities: [
      'Rest and recovery',
      'Planning for spring',
      'Indoor projects',
      'Deep reflection'
    ],
    element: 'Water'
  }
};

export function getCurrentSeason(date: Date = new Date(), hemisphere: 'N' | 'S' = 'N'): SeasonInfo {
  const month = date.getMonth();
  const seasons = hemisphere === 'N' ? NORTHERN_SEASONS : SOUTHERN_SEASONS;
  
  // Check each season's date range from the hemisphere-specific definitions
  for (const season of Object.values(seasons)) {
    // Handle wrap-around (winter: Dec-Feb)
    if (season.startMonth > season.endMonth) {
      // Winter spans year boundary (e.g., Dec 11 to Feb 1)
      if (month >= season.startMonth || month <= season.endMonth) {
        return season;
      }
    } else {
      // Normal season within one year
      if (month >= season.startMonth && month <= season.endMonth) {
        return season;
      }
    }
  }
  
  // Fallback to winter if nothing matches
  return seasons.winter;
}

export function getDaysUntilNextSeason(date: Date = new Date(), hemisphere: 'N' | 'S' = 'N'): number {
  const month = date.getMonth();
  const seasons = hemisphere === 'N' ? NORTHERN_SEASONS : SOUTHERN_SEASONS;
  
  // Find current season
  let currentSeason: SeasonInfo | null = null;
  for (const season of Object.values(seasons)) {
    if (season.startMonth > season.endMonth) {
      // Wrap-around season (winter)
      if (month >= season.startMonth || month <= season.endMonth) {
        currentSeason = season;
        break;
      }
    } else {
      if (month >= season.startMonth && month <= season.endMonth) {
        currentSeason = season;
        break;
      }
    }
  }
  
  if (!currentSeason) {
    currentSeason = seasons.winter;
  }
  
  // Calculate next season start date
  const nextSeasonMonth = (currentSeason.endMonth + 1) % 12;
  
  // Find the next season object
  let nextSeason: SeasonInfo | null = null;
  for (const season of Object.values(seasons)) {
    if (season.startMonth === nextSeasonMonth) {
      nextSeason = season;
      break;
    }
  }
  
  if (!nextSeason) {
    nextSeason = seasons.spring;
  }
  
  // Create date for start of next season (first day of start month)
  const nextSeasonDate = new Date(date.getFullYear(), nextSeasonMonth, 1);
  nextSeasonDate.setHours(0, 0, 0, 0);
  
  // If we've passed this date, next season is next year
  if (nextSeasonDate < date) {
    nextSeasonDate.setFullYear(nextSeasonDate.getFullYear() + 1);
  }
  
  const diffTime = nextSeasonDate.getTime() - date.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function getSeasonElementColor(element: string): string {
  switch (element) {
    case 'Fire': return '#ff5a6d';
    case 'Earth': return '#55ffa4';
    case 'Air': return '#6ab4e8';
    case 'Water': return '#9d7bf2';
    default: return '#caa24a';
  }
}

export function getSeasonData(date: Date = new Date(), latitude: number = 0) {
  const hemisphere = latitude >= 0 ? 'N' : 'S';
  const season = getCurrentSeason(date, hemisphere);
  return {
    emoji: season.emoji,
    name: season.name,
    hemisphere: hemisphere === 'N' ? 'Northern' : 'Southern',
    colors: [getSeasonElementColor(season.element)],
    element: season.element,
    psychology: {
      energy: 'Balanced',
      mood: 'Reflective',
    },
    characteristics: season.characteristics,
  };
}

export function getDaysInSeason(date: Date = new Date(), latitude: number = 0) {
  const hemisphere = latitude >= 0 ? 'N' : 'S';
  const season = getCurrentSeason(date, hemisphere);
  const daysRemaining = getDaysUntilNextSeason(date, hemisphere);
  const seasons = hemisphere === 'N' ? NORTHERN_SEASONS : SOUTHERN_SEASONS;
  const nextSeasonMonth = (season.endMonth + 1) % 12;
  let nextSeasonName = 'Spring';
  for (const s of Object.values(seasons)) {
    if (s.startMonth === nextSeasonMonth) {
      nextSeasonName = s.name;
      break;
    }
  }
  // Approximate season length ~90 days for percent calculation
  const daysIntoSeason = Math.max(1, 90 - daysRemaining);
  const percentComplete = Math.min(99, Math.max(1, Math.round((daysIntoSeason / 90) * 100)));
  return {
    daysRemaining,
    nextSeason: nextSeasonName,
    percentComplete,
  };
}
