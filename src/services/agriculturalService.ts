/**
 * Agricultural Service
 * Location-aware, hemisphere-aware planting guidance
 * Based on climate zones and seasonal growing calendars
 */

import type { LocationData } from '../types';

export interface PlantingRecommendation {
  plant: string;
  icon: string;
  action: 'plant' | 'sow' | 'transplant' | 'harvest' | 'prepare' | 'maintain' | 'apply';
  urgency: 'now' | 'soon' | 'window';
  description: string;
  daysToHarvest: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
}

export interface AgriculturalGuidance {
  season: string;
  climateZone: string;
  hemisphere: 'Northern' | 'Southern';
  isGrowingSeason: boolean;
  daysLeftInSeason: number;
  daysUntilSeason: number;
  recommendations: PlantingRecommendation[];
  avoid: string[];
  tips: string[];
  moonPhaseAdvice: string;
}

// Climate zones based on Köppen classification simplified
// Used to determine growing seasons
function getClimateZone(latitude: number): string {
  const absLat = Math.abs(latitude);
  
  if (absLat < 23.5) return 'Tropical'; // Tropical
  if (absLat < 35) return 'Subtropical'; // Subtropical
  if (absLat < 45) return 'Temperate-Warm'; // Warm temperate
  if (absLat < 55) return 'Temperate-Cool'; // Cool temperate
  if (absLat < 66.5) return 'Boreal'; // Cold/Continental
  return 'Polar'; // Polar
}

// Get growing season status
function getGrowingSeason(date: Date, hemisphere: 'N' | 'S'): {
  season: string;
  isGrowingSeason: boolean;
  daysUntilSeason: number;
  daysLeftInSeason: number;
} {
  const month = date.getMonth(); // 0-11
  
  if (hemisphere === 'N') {
    // Northern Hemisphere: Growing season roughly March-October (months 2-9)
    if (month >= 2 && month <= 9) {
      const daysLeft = (9 - month) * 30 + (30 - date.getDate());
      return {
        season: 'Growing Season',
        isGrowingSeason: true,
        daysUntilSeason: 0,
        daysLeftInSeason: daysLeft
      };
    } else if (month < 2) {
      const daysUntil = (2 - month) * 30 - date.getDate();
      return {
        season: 'Winter Dormancy',
        isGrowingSeason: false,
        daysUntilSeason: daysUntil,
        daysLeftInSeason: 0
      };
    } else {
      const daysUntil = (14 - month) * 30 - date.getDate(); // Until next March
      return {
        season: 'Winter Dormancy',
        isGrowingSeason: false,
        daysUntilSeason: daysUntil,
        daysLeftInSeason: 0
      };
    }
  } else {
    // Southern Hemisphere: Growing season roughly September-April (months 8-3)
    if (month >= 8 || month <= 3) {
      const daysLeft = month >= 8 
        ? (15 - month) * 30 + (30 - date.getDate()) // Sep-Dec to April
        : (3 - month) * 30 + (30 - date.getDate()); // Jan-Apr
      return {
        season: 'Growing Season',
        isGrowingSeason: true,
        daysUntilSeason: 0,
        daysLeftInSeason: daysLeft
      };
    } else {
      const daysUntil = (8 - month) * 30 - date.getDate();
      return {
        season: 'Winter Dormancy',
        isGrowingSeason: false,
        daysUntilSeason: daysUntil,
        daysLeftInSeason: 0
      };
    }
  }
}

// Planting database by month and hemisphere
const PLANTING_CALENDAR: Record<string, Record<string, PlantingRecommendation[]>> = {
  'N': {
    '0': [ // January
      { plant: 'Onions', icon: '🧅', action: 'sow', urgency: 'now', description: 'Start onion seeds indoors for spring transplant', daysToHarvest: '90-120 days', difficulty: 'easy' },
      { plant: 'Leeks', icon: '🥬', action: 'sow', urgency: 'now', description: 'Begin leek seeds indoors', daysToHarvest: '120-150 days', difficulty: 'easy' },
      { plant: 'Tomatoes', icon: '🍅', action: 'prepare', urgency: 'soon', description: 'Order seeds, prepare indoor setup', daysToHarvest: '60-80 days', difficulty: 'moderate' },
    ],
    '1': [ // February
      { plant: 'Tomatoes', icon: '🍅', action: 'sow', urgency: 'now', description: 'Start tomato seeds indoors 6-8 weeks before last frost', daysToHarvest: '60-80 days', difficulty: 'moderate' },
      { plant: 'Peppers', icon: '🫑', action: 'sow', urgency: 'now', description: 'Start pepper seeds indoors', daysToHarvest: '70-90 days', difficulty: 'moderate' },
      { plant: 'Eggplants', icon: '🍆', action: 'sow', urgency: 'now', description: 'Begin eggplant seeds indoors', daysToHarvest: '80-100 days', difficulty: 'advanced' },
      { plant: 'Lettuce', icon: '🥬', action: 'sow', urgency: 'now', description: 'Start lettuce in cold frames or indoors', daysToHarvest: '45-60 days', difficulty: 'easy' },
    ],
    '2': [ // March
      { plant: 'Potatoes', icon: '🥔', action: 'plant', urgency: 'now', description: 'Plant seed potatoes when soil is workable', daysToHarvest: '70-120 days', difficulty: 'easy' },
      { plant: 'Peas', icon: '🫛', action: 'sow', urgency: 'now', description: 'Direct sow peas as soon as soil thaws', daysToHarvest: '60-70 days', difficulty: 'easy' },
      { plant: 'Spinach', icon: '🍃', action: 'sow', urgency: 'now', description: 'Direct sow spinach in prepared beds', daysToHarvest: '40-50 days', difficulty: 'easy' },
      { plant: 'Radishes', icon: '🔴', action: 'sow', urgency: 'now', description: 'Quick crop - sow every 2 weeks', daysToHarvest: '25-30 days', difficulty: 'easy' },
    ],
    '3': [ // April
      { plant: 'Carrots', icon: '🥕', action: 'sow', urgency: 'now', description: 'Direct sow carrots in loose soil', daysToHarvest: '60-80 days', difficulty: 'moderate' },
      { plant: 'Beets', icon: '🔴', action: 'sow', urgency: 'now', description: 'Sow beet seeds directly', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Cabbage', icon: '🥬', action: 'transplant', urgency: 'now', description: 'Transplant cabbage seedlings outdoors', daysToHarvest: '80-100 days', difficulty: 'moderate' },
      { plant: 'Broccoli', icon: '🥦', action: 'transplant', urgency: 'now', description: 'Transplant broccoli after hardening off', daysToHarvest: '60-80 days', difficulty: 'moderate' },
      { plant: 'Lettuce', icon: '🥬', action: 'sow', urgency: 'now', description: 'Direct sow lettuce succession', daysToHarvest: '45-60 days', difficulty: 'easy' },
    ],
    '4': [ // May
      { plant: 'Beans', icon: '🫘', action: 'sow', urgency: 'now', description: 'Direct sow beans after last frost', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Corn', icon: '🌽', action: 'sow', urgency: 'now', description: 'Plant corn when soil is warm (15°C+)', daysToHarvest: '70-100 days', difficulty: 'moderate' },
      { plant: 'Cucumbers', icon: '🥒', action: 'sow', urgency: 'now', description: 'Direct sow or transplant cucumbers', daysToHarvest: '50-70 days', difficulty: 'easy' },
      { plant: 'Squash', icon: '🎃', action: 'sow', urgency: 'now', description: 'Plant summer squash and zucchini', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Tomatoes', icon: '🍅', action: 'transplant', urgency: 'now', description: 'Transplant tomatoes after last frost', daysToHarvest: '60-80 days', difficulty: 'moderate' },
      { plant: 'Peppers', icon: '🫑', action: 'transplant', urgency: 'now', description: 'Transplant peppers to warm soil', daysToHarvest: '70-90 days', difficulty: 'moderate' },
    ],
    '5': [ // June
      { plant: 'Beans', icon: '🫘', action: 'sow', urgency: 'now', description: 'Succession plant beans every 2 weeks', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Herbs', icon: '🌿', action: 'plant', urgency: 'now', description: 'Plant basil, cilantro, parsley', daysToHarvest: '30-60 days', difficulty: 'easy' },
      { plant: 'Summer Squash', icon: '🎃', action: 'sow', urgency: 'now', description: 'Succession sow zucchini', daysToHarvest: '45-55 days', difficulty: 'easy' },
      { plant: 'Melons', icon: '🍈', action: 'sow', urgency: 'window', description: 'Plant melons if soil is warm', daysToHarvest: '80-100 days', difficulty: 'moderate' },
    ],
    '6': [ // July
      { plant: 'Beans', icon: '🫘', action: 'sow', urgency: 'now', description: 'Last succession of bush beans', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Carrots', icon: '🥕', action: 'sow', urgency: 'now', description: 'Sow fall carrots', daysToHarvest: '70-80 days', difficulty: 'moderate' },
      { plant: 'Beets', icon: '🔴', action: 'sow', urgency: 'now', description: 'Sow beets for fall harvest', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Kale', icon: '🥬', action: 'sow', urgency: 'now', description: 'Start kale for fall/winter', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Lettuce', icon: '🥬', action: 'sow', urgency: 'now', description: 'Sow heat-resistant lettuce varieties', daysToHarvest: '45-60 days', difficulty: 'easy' },
    ],
    '7': [ // August
      { plant: 'Spinach', icon: '🍃', action: 'sow', urgency: 'now', description: 'Sow fall spinach', daysToHarvest: '40-50 days', difficulty: 'easy' },
      { plant: 'Lettuce', icon: '🥬', action: 'sow', urgency: 'now', description: 'Sow lettuce for fall', daysToHarvest: '45-60 days', difficulty: 'easy' },
      { plant: 'Radishes', icon: '🔴', action: 'sow', urgency: 'now', description: 'Quick fall radishes', daysToHarvest: '25-30 days', difficulty: 'easy' },
      { plant: 'Turnips', icon: '🟣', action: 'sow', urgency: 'now', description: 'Sow turnips for fall harvest', daysToHarvest: '40-60 days', difficulty: 'easy' },
      { plant: 'Winter Squash', icon: '🎃', action: 'harvest', urgency: 'soon', description: 'Monitor winter squash for harvest', daysToHarvest: '90-120 days', difficulty: 'moderate' },
    ],
    '8': [ // September
      { plant: 'Garlic', icon: '🧄', action: 'plant', urgency: 'now', description: 'Plant garlic cloves for next year', daysToHarvest: '240-270 days', difficulty: 'easy' },
      { plant: 'Onions', icon: '🧅', action: 'sow', urgency: 'now', description: 'Sow overwintering onion varieties', daysToHarvest: '200+ days', difficulty: 'easy' },
      { plant: 'Spinach', icon: '🍃', action: 'sow', urgency: 'now', description: 'Sow spinach for overwintering', daysToHarvest: '40-50 days', difficulty: 'easy' },
      { plant: 'Kale', icon: '🥬', action: 'sow', urgency: 'now', description: 'Sow kale for fall/winter harvest', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Root Vegetables', icon: '🥕', action: 'harvest', urgency: 'now', description: 'Harvest mature root crops', daysToHarvest: 'varies', difficulty: 'easy' },
    ],
    '9': [ // October
      { plant: 'Garlic', icon: '🧄', action: 'plant', urgency: 'window', description: 'Last chance to plant garlic', daysToHarvest: '240-270 days', difficulty: 'easy' },
      { plant: 'Cover Crops', icon: '🌾', action: 'sow', urgency: 'now', description: 'Sow winter rye or clover', daysToHarvest: 'N/A', difficulty: 'easy' },
      { plant: 'Cold Frames', icon: '💨', action: 'prepare', urgency: 'now', description: 'Set up protection for winter crops', daysToHarvest: 'N/A', difficulty: 'moderate' },
    ],
    '10': [ // November
      { plant: 'Mulch', icon: '🍂', action: 'apply', urgency: 'now', description: 'Mulch perennial beds for winter', daysToHarvest: 'N/A', difficulty: 'easy' },
      { plant: 'Tools', icon: '🔧', action: 'maintain', urgency: 'soon', description: 'Clean and store garden tools', daysToHarvest: 'N/A', difficulty: 'easy' },
      { plant: 'Plan', icon: '📋', action: 'prepare', urgency: 'window', description: 'Review season, plan next year', daysToHarvest: 'N/A', difficulty: 'easy' },
    ],
    '11': [ // December
      { plant: 'Seed Orders', icon: '📦', action: 'prepare', urgency: 'window', description: 'Order seeds for spring', daysToHarvest: 'varies', difficulty: 'easy' },
      { plant: 'Equipment', icon: '🏚️', action: 'maintain', urgency: 'window', description: 'Maintain tools, repair structures', daysToHarvest: 'N/A', difficulty: 'easy' },
      { plant: 'Rest', icon: '☕', action: 'prepare', urgency: 'window', description: 'Rest! Gardening is year-round work', daysToHarvest: 'N/A', difficulty: 'easy' },
    ],
  },
  'S': {
    // Southern Hemisphere - seasons reversed
    '0': [ // January (Summer)
      { plant: 'Beans', icon: '🫘', action: 'sow', urgency: 'now', description: 'Succession plant beans', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Corn', icon: '🌽', action: 'sow', urgency: 'window', description: 'Late corn planting', daysToHarvest: '70-100 days', difficulty: 'moderate' },
      { plant: 'Herbs', icon: '🌿', action: 'plant', urgency: 'now', description: 'Plant basil, cilantro', daysToHarvest: '30-60 days', difficulty: 'easy' },
    ],
    '1': [ // February (Summer)
      { plant: 'Carrots', icon: '🥕', action: 'sow', urgency: 'now', description: 'Sow for autumn harvest', daysToHarvest: '70-80 days', difficulty: 'moderate' },
      { plant: 'Lettuce', icon: '🥬', action: 'sow', urgency: 'now', description: 'Sow heat-tolerant varieties', daysToHarvest: '45-60 days', difficulty: 'easy' },
      { plant: 'Spinach', icon: '🍃', action: 'sow', urgency: 'now', description: 'Begin autumn spinach', daysToHarvest: '40-50 days', difficulty: 'easy' },
    ],
    '2': [ // March (Autumn)
      { plant: 'Broccoli', icon: '🥦', action: 'transplant', urgency: 'now', description: 'Transplant broccoli seedlings', daysToHarvest: '60-80 days', difficulty: 'moderate' },
      { plant: 'Cabbage', icon: '🥬', action: 'transplant', urgency: 'now', description: 'Transplant cabbage', daysToHarvest: '80-100 days', difficulty: 'moderate' },
      { plant: 'Cauliflower', icon: '🥬', action: 'transplant', urgency: 'now', description: 'Transplant cauliflower', daysToHarvest: '70-90 days', difficulty: 'moderate' },
      { plant: 'Peas', icon: '🫛', action: 'sow', urgency: 'now', description: 'Direct sow peas', daysToHarvest: '60-70 days', difficulty: 'easy' },
    ],
    '3': [ // April (Autumn)
      { plant: 'Garlic', icon: '🧄', action: 'plant', urgency: 'now', description: 'Plant garlic for spring harvest', daysToHarvest: '240-270 days', difficulty: 'easy' },
      { plant: 'Onions', icon: '🧅', action: 'sow', urgency: 'now', description: 'Sow onion seeds', daysToHarvest: '200+ days', difficulty: 'easy' },
      { plant: 'Broad Beans', icon: '🫛', action: 'sow', urgency: 'now', description: 'Sow broad beans', daysToHarvest: '90-120 days', difficulty: 'easy' },
      { plant: 'Kale', icon: '🥬', action: 'sow', urgency: 'now', description: 'Sow kale for winter', daysToHarvest: '50-60 days', difficulty: 'easy' },
    ],
    '4': [ // May (Winter)
      { plant: 'Asparagus', icon: '↗️', action: 'plant', urgency: 'window', description: 'Plant asparagus crowns', daysToHarvest: '2-3 years', difficulty: 'advanced' },
      { plant: 'Strawberries', icon: '🍓', action: 'plant', urgency: 'now', description: 'Plant strawberry runners', daysToHarvest: '60-90 days', difficulty: 'easy' },
      { plant: 'Bare Root Trees', icon: '🌳', action: 'plant', urgency: 'now', description: 'Plant deciduous fruit trees', daysToHarvest: '1+ years', difficulty: 'moderate' },
    ],
    '5': [ // June (Winter)
      { plant: 'Pruning', icon: '✂️', action: 'maintain', urgency: 'now', description: 'Prune fruit trees and vines', daysToHarvest: 'N/A', difficulty: 'moderate' },
      { plant: 'Planning', icon: '📋', action: 'prepare', urgency: 'now', description: 'Plan spring garden layout', daysToHarvest: 'N/A', difficulty: 'easy' },
      { plant: 'Soil', icon: '🟫', action: 'prepare', urgency: 'soon', description: 'Prepare beds with compost', daysToHarvest: 'N/A', difficulty: 'easy' },
    ],
    '6': [ // July (Winter)
      { plant: 'Seedlings', icon: '🌱', action: 'sow', urgency: 'now', description: 'Start tomatoes and peppers indoors', daysToHarvest: '60-80 days', difficulty: 'moderate' },
      { plant: 'Onions', icon: '🧅', action: 'sow', urgency: 'now', description: 'Sow onion seeds indoors', daysToHarvest: '200+ days', difficulty: 'easy' },
      { plant: 'Greenhouse', icon: '🏠', action: 'prepare', urgency: 'now', description: 'Clean and prepare greenhouse', daysToHarvest: 'N/A', difficulty: 'easy' },
    ],
    '7': [ // August (Winter/Spring)
      { plant: 'Tomatoes', icon: '🍅', action: 'sow', urgency: 'now', description: 'Start tomato seeds indoors', daysToHarvest: '60-80 days', difficulty: 'moderate' },
      { plant: 'Peppers', icon: '🫑', action: 'sow', urgency: 'now', description: 'Start peppers and eggplants', daysToHarvest: '70-90 days', difficulty: 'moderate' },
      { plant: 'Lettuce', icon: '🥬', action: 'sow', urgency: 'now', description: 'Sow lettuce in trays', daysToHarvest: '45-60 days', difficulty: 'easy' },
      { plant: 'Potatoes', icon: '🥔', action: 'prepare', urgency: 'soon', description: 'Prepare seed potatoes for chitting', daysToHarvest: '70-120 days', difficulty: 'easy' },
    ],
    '8': [ // September (Spring)
      { plant: 'Potatoes', icon: '🥔', action: 'plant', urgency: 'now', description: 'Plant seed potatoes', daysToHarvest: '70-120 days', difficulty: 'easy' },
      { plant: 'Peas', icon: '🫛', action: 'sow', urgency: 'now', description: 'Direct sow peas', daysToHarvest: '60-70 days', difficulty: 'easy' },
      { plant: 'Spinach', icon: '🍃', action: 'sow', urgency: 'now', description: 'Direct sow spinach', daysToHarvest: '40-50 days', difficulty: 'easy' },
      { plant: 'Radishes', icon: '🔴', action: 'sow', urgency: 'now', description: 'Quick spring radishes', daysToHarvest: '25-30 days', difficulty: 'easy' },
      { plant: 'Carrots', icon: '🥕', action: 'sow', urgency: 'now', description: 'Sow carrots in loose soil', daysToHarvest: '60-80 days', difficulty: 'moderate' },
    ],
    '9': [ // October (Spring)
      { plant: 'Beans', icon: '🫘', action: 'sow', urgency: 'now', description: 'Direct sow beans', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Corn', icon: '🌽', action: 'sow', urgency: 'now', description: 'Plant corn when soil warms', daysToHarvest: '70-100 days', difficulty: 'moderate' },
      { plant: 'Squash', icon: '🎃', action: 'sow', urgency: 'now', description: 'Plant summer squash', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Tomatoes', icon: '🍅', action: 'transplant', urgency: 'now', description: 'Transplant tomatoes', daysToHarvest: '60-80 days', difficulty: 'moderate' },
      { plant: 'Cucumbers', icon: '🥒', action: 'sow', urgency: 'now', description: 'Plant cucumbers', daysToHarvest: '50-70 days', difficulty: 'easy' },
    ],
    '10': [ // November (Summer)
      { plant: 'Succession', icon: '🌱', action: 'sow', urgency: 'now', description: 'Succession sow beans and lettuce', daysToHarvest: 'varies', difficulty: 'easy' },
      { plant: 'Herbs', icon: '🌿', action: 'plant', urgency: 'now', description: 'Plant basil, coriander', daysToHarvest: '30-60 days', difficulty: 'easy' },
      { plant: 'Melons', icon: '🍈', action: 'sow', urgency: 'window', description: 'Plant melons if warm', daysToHarvest: '80-100 days', difficulty: 'moderate' },
    ],
    '11': [ // December (Summer)
      { plant: 'Beans', icon: '🫘', action: 'sow', urgency: 'now', description: 'Succession beans', daysToHarvest: '50-60 days', difficulty: 'easy' },
      { plant: 'Celery', icon: '🥬', action: 'sow', urgency: 'now', description: 'Sow celery for autumn', daysToHarvest: '80-120 days', difficulty: 'advanced' },
      { plant: 'Leeks', icon: '🥬', action: 'sow', urgency: 'now', description: 'Sow leeks for winter', daysToHarvest: '120-150 days', difficulty: 'easy' },
    ],
  }
};

// What NOT to plant right now (examples by month/hemisphere)
const AVOID_PLANTING: Record<string, Record<string, string[]>> = {
  'N': {
    '0': ['Tomatoes outdoors', 'Peppers', 'Squash', 'Cucumbers'], // January
    '1': ['Tomatoes outdoors', 'Peppers', 'Melons'], // February
    '2': ['Heat-loving crops', 'Melons', 'Eggplants'], // March - too cold
    '3': ['Melons', 'Okra', 'Sweet potatoes'], // April
    '4': ['Cold crops slowing', 'Late brassicas'], // May
    '5': ['Not much - ideal time!'], // June
    '6': ['Warm-season crops ending', 'Late corn'], // July
    '7': ['Summer crops', 'Late beans'], // August
    '8': ['Warm-season crops', 'Tomatoes', 'Peppers'], // September
    '9': ['Most crops outdoors'], // October
    '10': ['Outdoor sowing'], // November
    '11': ['Outdoor planting'], // December
  },
  'S': {
    // Southern hemisphere - reversed
    '0': ['Cool-season crops'], // January (summer)
    '1': ['Cool-season crops'], // February
    '2': ['Heat-loving crops'], // March (autumn)
    '3': ['Warm-season crops'], // April
    '4': ['Most crops'], // May (winter)
    '5': ['Outdoor sowing'], // June
    '6': ['Outdoor planting'], // July
    '7': ['Late cool crops'], // August
    '8': ['Heat crops', 'Melons'], // September (spring)
    '9': ['Not much - ideal time!'], // October
    '10': ['Cold crops slowing'], // November
    '11': ['Cool-season crops'], // December
  }
};

// Moon phase planting advice
function getMoonPhaseAdvice(moonAge: number): string {
  if (moonAge < 7) {
    return 'Waxing moon: Ideal for planting above-ground crops and leafy greens. Energy is rising.';
  } else if (moonAge < 14) {
    return 'First quarter to full: Good for fruiting crops and transplanting. Strong growth energy.';
  } else if (moonAge < 21) {
    return 'Waning moon: Focus on root crops and harvesting. Energy moving downward.';
  } else {
    return 'Dark moon: Best for pruning, weeding, and preparing soil. Rest and renewal time.';
  }
}

/**
 * Get agricultural guidance for location and date
 */
export function getAgriculturalGuidance(
  date: Date,
  location: LocationData,
  moonAge: number = 14 // Default to full moon if not provided
): AgriculturalGuidance {
  const hemisphere = location.latitude >= 0 ? 'N' : 'S';
  const hemisphereLabel = location.latitude >= 0 ? 'Northern' : 'Southern';
  const month = date.getMonth();
  const climateZone = getClimateZone(location.latitude);
  const growingSeason = getGrowingSeason(date, hemisphere);
  
  // Get recommendations for this month
  const recommendations = PLANTING_CALENDAR[hemisphere][month.toString()] || [];
  
  // Get what to avoid
  const avoid = AVOID_PLANTING[hemisphere][month.toString()] || [];
  
  // Generate tips based on climate and season
  const tips: string[] = [];
  
  if (!growingSeason.isGrowingSeason) {
    tips.push('It\'s winter dormancy - focus on planning, soil prep, and indoor starts');
  } else if (growingSeason.daysLeftInSeason < 60) {
    tips.push('Growing season ending soon - focus on fast crops and harvest');
  }
  
  if (climateZone === 'Tropical') {
    tips.push('Tropical climate allows year-round growing with shade cloth in hot months');
  } else if (climateZone === 'Boreal' || climateZone === 'Polar') {
    tips.push('Short growing season - use season extenders like cold frames and row covers');
  }
  
  tips.push('Rotate crops yearly to prevent soil depletion and disease');
  tips.push('Mulch heavily to retain moisture and regulate soil temperature');
  
  return {
    season: growingSeason.season,
    climateZone,
    hemisphere: hemisphereLabel,
    isGrowingSeason: growingSeason.isGrowingSeason,
    daysLeftInSeason: growingSeason.daysLeftInSeason,
    daysUntilSeason: growingSeason.daysUntilSeason,
    recommendations: recommendations.slice(0, 6), // Max 6 recommendations
    avoid: avoid.slice(0, 4), // Max 4 to avoid
    tips,
    moonPhaseAdvice: getMoonPhaseAdvice(moonAge)
  };
}

export const AgriculturalService = {
  getAgriculturalGuidance,
  getClimateZone,
  getGrowingSeason,
};

export default AgriculturalService;
