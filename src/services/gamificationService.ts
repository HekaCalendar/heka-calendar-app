/**
 * Gamification Service - Phase 1: Enterprise-Grade App Engagement System
 * Achievements, streaks, badges, and rewards system
 * 
 * PHASE 1 SCOPE:
 * - Feature Discovery Badges: Unlock by toggling/trying features
 * - App Engagement Streaks: Track app opens, time spent, daily visits
 * - Settings Exploration: Badges for customizing themes, fonts, locations, display options
 */

import type { 
  UsageStatistics, 
  AppEngagement, 
  FeatureDiscoveryProgress,
  FeatureDiscoveryKey 
} from '../types';

// ============================================================================
// Achievement Categories
// ============================================================================

export type AchievementCategory = 
  | 'beginner'      // Entry-level achievements
  | 'intermediate'  // Regular user achievements
  | 'advanced'      // Power user achievements
  | 'master'        // Expert-level achievements
  | 'special'       // Hidden/secret achievements
  | 'explorer'      // Feature discovery achievements
  | 'discoverer'    // Settings exploration achievements
  | 'engager';      // App engagement achievements

// ============================================================================
// Achievement Requirements
// ============================================================================

export type AchievementRequirementType = 
  | 'notes'         // Note creation achievements
  | 'streak'        // Writing streak achievements
  | 'categories'    // Category usage achievements
  | 'words'         // Word count achievements
  | 'months'        // Monthly exploration achievements
  | 'mood'          // Mood tracking achievements
  | 'special'       // Special/hidden achievements
  | 'appOpens'      // App open count achievements
  | 'openStreak'    // Consecutive app open streaks
  | 'timeSpent'     // Time spent in app achievements
  | 'features'      // Feature discovery achievements
  | 'settings'      // Settings customization achievements
  | 'exploration';  // General exploration achievements

// ============================================================================
// Achievement Interface
// ============================================================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  requirement: {
    type: AchievementRequirementType;
    value: number;
    feature?: FeatureDiscoveryKey;  // For feature-specific achievements
    setting?: string;               // For setting-specific achievements
    category?: string;              // For note category achievements
  };
  reward?: string;
  secret?: boolean;                 // Hidden until unlocked
  tier?: number;                    // Tier level (1-5)
}

// ============================================================================
// ALL ACHIEVEMENTS - Enterprise-Grade Collection
// ============================================================================

export const ACHIEVEMENTS: Achievement[] = [
  // ========================================================================
  // ORIGINAL NOTE-FOCUSED ACHIEVEMENTS (Preserved)
  // ========================================================================
  
  // Beginner Achievements
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Create your first note',
    icon: '👣',
    category: 'beginner',
    requirement: { type: 'notes', value: 1 },
    tier: 1,
  },
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Create 5 notes',
    icon: '🚀',
    category: 'beginner',
    requirement: { type: 'notes', value: 5 },
    tier: 1,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit all 13 HEKA months',
    icon: '🧭',
    category: 'beginner',
    requirement: { type: 'months', value: 13 },
    tier: 2,
  },
  {
    id: 'categorizer',
    name: 'Organized Mind',
    description: 'Use all 7 note categories',
    icon: '🗂️',
    category: 'beginner',
    requirement: { type: 'categories', value: 7 },
    tier: 2,
  },
  
  // Streak Achievements (Writing)
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day writing streak',
    icon: '🔥',
    category: 'intermediate',
    requirement: { type: 'streak', value: 7 },
    tier: 2,
  },
  {
    id: 'month-master',
    name: 'Month Master',
    description: 'Maintain a 30-day writing streak',
    icon: '📅',
    category: 'advanced',
    requirement: { type: 'streak', value: 30 },
    tier: 3,
  },
  {
    id: 'seasoned-scribe',
    name: 'Seasoned Scribe',
    description: 'Maintain a 91-day writing streak (one season)',
    icon: '🏆',
    category: 'master',
    requirement: { type: 'streak', value: 91 },
    tier: 4,
  },
  {
    id: 'heka-devotee',
    name: 'HEKA Devotee',
    description: 'Maintain a 365-day writing streak',
    icon: '👑',
    category: 'master',
    requirement: { type: 'streak', value: 365 },
    tier: 5,
  },
  
  // Volume Achievements
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Create 100 notes',
    icon: '💯',
    category: 'intermediate',
    requirement: { type: 'notes', value: 100 },
    tier: 2,
  },
  {
    id: 'five-hundred',
    name: 'Five Hundred',
    description: 'Create 500 notes',
    icon: '📚',
    category: 'advanced',
    requirement: { type: 'notes', value: 500 },
    tier: 3,
  },
  {
    id: 'millennium',
    name: 'Millennium',
    description: 'Create 1,000 notes',
    icon: '🏛️',
    category: 'master',
    requirement: { type: 'notes', value: 1000 },
    tier: 5,
  },
  
  // Writing Achievements
  {
    id: 'wordsmith',
    name: 'Wordsmith',
    description: 'Write 10,000 words',
    icon: '✍️',
    category: 'intermediate',
    requirement: { type: 'words', value: 10000 },
    tier: 2,
  },
  {
    id: 'novelist',
    name: 'Novelist',
    description: 'Write 50,000 words',
    icon: '📖',
    category: 'advanced',
    requirement: { type: 'words', value: 50000 },
    tier: 3,
  },
  {
    id: 'chronicler',
    name: 'The Chronicler',
    description: 'Write 100,000 words',
    icon: '📜',
    category: 'master',
    requirement: { type: 'words', value: 100000 },
    tier: 5,
  },
  
  // Category Mastery
  {
    id: 'spiritual-seeker',
    name: 'Spiritual Seeker',
    description: 'Create 25 spiritual notes',
    icon: '🧘',
    category: 'intermediate',
    requirement: { type: 'notes', value: 25, category: 'spiritual' },
    tier: 2,
  },
  {
    id: 'health-conscious',
    name: 'Health Conscious',
    description: 'Create 25 health notes',
    icon: '💪',
    category: 'intermediate',
    requirement: { type: 'notes', value: 25, category: 'health' },
    tier: 2,
  },
  {
    id: 'creative-soul',
    name: 'Creative Soul',
    description: 'Create 25 creative notes',
    icon: '🎨',
    category: 'intermediate',
    requirement: { type: 'notes', value: 25, category: 'creative' },
    tier: 2,
  },
  {
    id: 'work-life-balance',
    name: 'Work-Life Balance',
    description: 'Create 25 work notes AND 25 personal notes',
    icon: '⚖️',
    category: 'advanced',
    requirement: { type: 'special', value: 1 },
    tier: 3,
  },
  
  // Mood Achievements
  {
    id: 'positivity',
    name: 'Positivity',
    description: 'Log 10 days with excellent mood',
    icon: '😄',
    category: 'intermediate',
    requirement: { type: 'mood', value: 10 },
    tier: 2,
  },
  {
    id: 'emotional-awareness',
    name: 'Emotional Awareness',
    description: 'Log mood for 30 consecutive days',
    icon: '🎭',
    category: 'advanced',
    requirement: { type: 'mood', value: 30 },
    tier: 3,
  },
  
  // Special/Hidden Achievements
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Create a note between midnight and 4am',
    icon: '🦉',
    category: 'special',
    requirement: { type: 'special', value: 1 },
    secret: true,
    tier: 2,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Create a note between 5am and 7am',
    icon: '🐦',
    category: 'special',
    requirement: { type: 'special', value: 1 },
    secret: true,
    tier: 2,
  },
  {
    id: 'full-moon-ritual',
    name: 'Full Moon Ritual',
    description: 'Create a note on the night of a full moon',
    icon: '🌕',
    category: 'special',
    requirement: { type: 'special', value: 1 },
    secret: true,
    tier: 2,
  },
  {
    id: 'seasonal-alignment',
    name: 'Seasonal Alignment',
    description: 'Create a note on each equinox and solstice',
    icon: '🌓',
    category: 'special',
    requirement: { type: 'special', value: 4 },
    secret: true,
    tier: 3,
  },
  {
    id: 'hexa-master',
    name: 'Hexa Master',
    description: 'Create notes on every day of Hexa month',
    icon: '6️⃣',
    category: 'special',
    requirement: { type: 'special', value: 28 },
    secret: true,
    tier: 4,
  },
  {
    id: 'arc-completer',
    name: 'Arc Completer',
    description: 'Create notes in Opening, Core, and Closing arcs of one year',
    icon: '🔄',
    category: 'special',
    requirement: { type: 'special', value: 3 },
    secret: true,
    tier: 3,
  },

  // ========================================================================
  // PHASE 1: APP ENGAGEMENT ACHIEVEMENTS
  // ========================================================================
  
  // App Open Achievements
  {
    id: 'first-open',
    name: 'First Contact',
    description: 'Open the HEKA app for the first time',
    icon: '👋',
    category: 'engager',
    requirement: { type: 'appOpens', value: 1 },
    tier: 1,
  },
  {
    id: 'regular-visitor',
    name: 'Regular Visitor',
    description: 'Open the app 10 times',
    icon: '🔟',
    category: 'engager',
    requirement: { type: 'appOpens', value: 10 },
    tier: 1,
  },
  {
    id: 'daily-companion',
    name: 'Daily Companion',
    description: 'Open the app 50 times',
    icon: '🤝',
    category: 'engager',
    requirement: { type: 'appOpens', value: 50 },
    tier: 2,
  },
  {
    id: 'heka-habit',
    name: 'HEKA Habit',
    description: 'Open the app 100 times',
    icon: '💯',
    category: 'engager',
    requirement: { type: 'appOpens', value: 100 },
    tier: 3,
  },
  {
    id: 'centennial-opens',
    name: 'Centennial Opener',
    description: 'Open the app 500 times',
    icon: '🏛️',
    category: 'engager',
    requirement: { type: 'appOpens', value: 500 },
    tier: 4,
  },
  {
    id: 'master-of-opens',
    name: 'Master of Opens',
    description: 'Open the app 1,000 times',
    icon: '🔓',
    category: 'master',
    requirement: { type: 'appOpens', value: 1000 },
    secret: true,
    tier: 5,
  },
  
  // Open Streak Achievements (INDEPENDENT of writing streak)
  {
    id: 'week-dedication',
    name: 'Week of Dedication',
    description: 'Open the app for 7 consecutive days',
    icon: '🔥',
    category: 'engager',
    requirement: { type: 'openStreak', value: 7 },
    tier: 1,
  },
  {
    id: 'month-commitment',
    name: 'Month of Commitment',
    description: 'Open the app for 30 consecutive days',
    icon: '📅',
    category: 'engager',
    requirement: { type: 'openStreak', value: 30 },
    tier: 2,
  },
  {
    id: 'quarter-quest',
    name: 'Quarter Quest',
    description: 'Open the app for 91 consecutive days (one season)',
    icon: '🏆',
    category: 'engager',
    requirement: { type: 'openStreak', value: 91 },
    tier: 3,
  },
  {
    id: 'yearly-yield',
    name: 'Yearly Yield',
    description: 'Open the app for 365 consecutive days',
    icon: '🌟',
    category: 'master',
    requirement: { type: 'openStreak', value: 365 },
    tier: 5,
  },
  
  // Time Spent Achievements
  {
    id: 'first-hour',
    name: 'First Hour',
    description: 'Spend 1 hour total in the app',
    icon: '⏱️',
    category: 'engager',
    requirement: { type: 'timeSpent', value: 60 },
    tier: 1,
  },
  {
    id: 'day-dreamer',
    name: 'Day Dreamer',
    description: 'Spend 24 hours total in the app',
    icon: '☀️',
    category: 'engager',
    requirement: { type: 'timeSpent', value: 1440 },
    tier: 2,
  },
  {
    id: 'time-traveler',
    name: 'Time Traveler',
    description: 'Spend 7 days total in the app',
    icon: '⏳',
    category: 'intermediate',
    requirement: { type: 'timeSpent', value: 10080 },
    tier: 3,
  },
  {
    id: 'time-lord',
    name: 'Time Lord',
    description: 'Spend 30 days total in the app',
    icon: '⌛',
    category: 'master',
    requirement: { type: 'timeSpent', value: 43200 },
    secret: true,
    tier: 5,
  },

  // ========================================================================
  // PHASE 1: FEATURE DISCOVERY BADGES
  // ========================================================================
  
  // Core UI Discovery
  {
    id: 'date-explorer',
    name: 'Date Explorer',
    description: 'Open the date modal to view detailed date information',
    icon: '📆',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'openedDateModal' },
    tier: 1,
  },
  {
    id: 'day-diver',
    name: 'Day Diver',
    description: 'Open the day panel to explore daily insights',
    icon: '🌊',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'openedDayPanel' },
    tier: 1,
  },
  {
    id: 'celestial-seeker',
    name: 'Celestial Seeker',
    description: 'Open the Celestial Guide',
    icon: '🔭',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'openedCelestialGuide' },
    tier: 1,
  },
  {
    id: 'oracle-observer',
    name: 'Oracle Observer',
    description: 'Open the Oracle Journal',
    icon: '🔮',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'openedOracleJournal' },
    tier: 1,
  },
  {
    id: 'star-reader',
    name: 'Star Reader',
    description: 'Open the Profile Manager to view astrological profiles',
    icon: '⭐',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'openedProfileManager' },
    tier: 1,
  },
  
  // Calendar Navigation Discovery
  {
    id: 'time-navigator',
    name: 'Time Navigator',
    description: 'Use the "Jump to Today" button',
    icon: '🧭',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'usedTodayButton' },
    tier: 1,
  },
  {
    id: 'monthly-migrant',
    name: 'Monthly Migrant',
    description: 'Navigate to a different month using the month navigator',
    icon: '🗓️',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'viewedDifferentMonth' },
    tier: 1,
  },
  {
    id: 'yearly-yonder',
    name: 'Yearly Yonder',
    description: 'Navigate to a different year using the year navigator',
    icon: '📅',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'viewedDifferentYear' },
    tier: 1,
  },
  {
    id: 'location-hopper',
    name: 'Location Hopper',
    description: 'Change your calendar location',
    icon: '🌍',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'changedLocation' },
    tier: 2,
  },
  {
    id: 'region-roamer',
    name: 'Region Roamer',
    description: 'Select a specific sub-region (state/province)',
    icon: '🗺️',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'changedSubRegion' },
    tier: 2,
  },
  
  // Feature Toggle Discovery
  {
    id: 'moon-gazer',
    name: 'Moon Gazer',
    description: 'Enable moon phases display on the calendar',
    icon: '🌙',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'enabledMoonPhases' },
    tier: 1,
  },
  {
    id: 'transit-tracker',
    name: 'Transit Tracker',
    description: 'Enable planetary transit indicators',
    icon: '✨',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'enabledTransits' },
    tier: 2,
  },
  {
    id: 'seasonal-sage',
    name: 'Seasonal Sage',
    description: 'Enable seasonal event markers',
    icon: '🌱',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'enabledSeasonalEvents' },
    tier: 2,
  },
  {
    id: 'holiday-hunter',
    name: 'Holiday Hunter',
    description: 'Enable holiday display on the calendar',
    icon: '🎉',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'enabledHolidays' },
    tier: 1,
  },
  {
    id: 'energy-enthusiast',
    name: 'Energy Enthusiast',
    description: 'Enable community energy forecasts',
    icon: '⚡',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'enabledEnergyVote' },
    tier: 2,
  },
  {
    id: 'birth-chart-bright',
    name: 'Birth Chart Bright',
    description: 'Enable birth chart integration',
    icon: '♈',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'enabledBirthChart' },
    tier: 2,
  },
  
  // Content Interaction Discovery
  {
    id: 'energy-voter',
    name: 'Energy Voter',
    description: 'Cast your first energy forecast vote',
    icon: '🗳️',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'votedOnEnergy' },
    tier: 2,
  },
  {
    id: 'chart-creator',
    name: 'Chart Creator',
    description: 'Create your first astrological birth chart',
    icon: '🌟',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'createdBirthChart' },
    tier: 2,
  },
  {
    id: 'community-scribe',
    name: 'Community Scribe',
    description: 'Create your first note',
    icon: '✍️',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'createdNote' },
    tier: 1,
  },
  {
    id: 'print-pioneer',
    name: 'Print Pioneer',
    description: 'Print your first calendar view',
    icon: '🖨️',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'printedCalendar' },
    tier: 2,
  },
  {
    id: 'community-member',
    name: 'Community Member',
    description: 'Subscribe to a community calendar',
    icon: '👥',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'subscribedToCommunity' },
    tier: 2,
  },
  
  // Settings Discovery
  {
    id: 'settings-snooper',
    name: 'Settings Snooper',
    description: 'Open the settings panel',
    icon: '⚙️',
    category: 'discoverer',
    requirement: { type: 'features', value: 1, feature: 'openedSettings' },
    tier: 1,
  },

  // ========================================================================
  // PHASE 1: SETTINGS EXPLORATION BADGES
  // ========================================================================
  
  // Theme Exploration
  {
    id: 'theme-taster',
    name: 'Theme Taster',
    description: 'Try 3 different themes',
    icon: '🎨',
    category: 'discoverer',
    requirement: { type: 'settings', value: 3, setting: 'themes' },
    tier: 1,
  },
  {
    id: 'theme-collector',
    name: 'Theme Collector',
    description: 'Try 5 different themes',
    icon: '🖼️',
    category: 'discoverer',
    requirement: { type: 'settings', value: 5, setting: 'themes' },
    tier: 2,
  },
  {
    id: 'theme-master',
    name: 'Theme Master',
    description: 'Try all available themes',
    icon: '👔',
    category: 'discoverer',
    requirement: { type: 'settings', value: 10, setting: 'themes' },
    tier: 3,
  },
  
  // Font Exploration
  {
    id: 'font-finder',
    name: 'Font Finder',
    description: 'Try 3 different fonts',
    icon: '🔤',
    category: 'discoverer',
    requirement: { type: 'settings', value: 3, setting: 'fonts' },
    tier: 1,
  },
  {
    id: 'typography-tycoon',
    name: 'Typography Tycoon',
    description: 'Try all available fonts',
    icon: '📝',
    category: 'discoverer',
    requirement: { type: 'settings', value: 6, setting: 'fonts' },
    tier: 2,
  },
  
  // Display Mode Exploration
  {
    id: 'display-dabbler',
    name: 'Display Dabbler',
    description: 'Toggle 3 different display options',
    icon: '📺',
    category: 'discoverer',
    requirement: { type: 'settings', value: 3, setting: 'display' },
    tier: 1,
  },
  {
    id: 'display-connoisseur',
    name: 'Display Connoisseur',
    description: 'Toggle all display options',
    icon: '🖥️',
    category: 'discoverer',
    requirement: { type: 'settings', value: 6, setting: 'display' },
    tier: 2,
  },
  
  // General Settings Exploration
  {
    id: 'customization-curious',
    name: 'Customization Curious',
    description: 'Make 5 customizations in settings',
    icon: '🔧',
    category: 'discoverer',
    requirement: { type: 'settings', value: 5, setting: 'customizations' },
    tier: 1,
  },
  {
    id: 'personalization-pro',
    name: 'Personalization Pro',
    description: 'Make 20 customizations in settings',
    icon: '✨',
    category: 'discoverer',
    requirement: { type: 'settings', value: 20, setting: 'customizations' },
    tier: 2,
  },
  {
    id: 'settings-savant',
    name: 'Settings Savant',
    description: 'Make 50 customizations in settings',
    icon: '🎯',
    category: 'discoverer',
    requirement: { type: 'settings', value: 50, setting: 'customizations' },
    tier: 3,
  },
  
  // Social & Community
  {
    id: 'holiday-viewer',
    name: 'Holiday Viewer',
    description: 'View the community holidays page',
    icon: '📜',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'viewedCommunityHolidays' },
    tier: 1,
  },
  {
    id: 'holiday-suggester',
    name: 'Holiday Suggester',
    description: 'Suggest a new community holiday',
    icon: '💡',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'suggestedHoliday' },
    tier: 2,
  },
  {
    id: 'cosmic-circle',
    name: 'Cosmic Circle',
    description: 'Open the Friends modal and join the cosmic community',
    icon: '🌟',
    category: 'explorer',
    requirement: { type: 'features', value: 1, feature: 'openedFriends' },
    tier: 2,
  },

  // ========================================================================
  // PHASE 1: COMBINED EXPLORATION ACHIEVEMENTS
  // ========================================================================
  
  {
    id: 'feature-finder',
    name: 'Feature Finder',
    description: 'Discover 10 different features',
    icon: '🔍',
    category: 'explorer',
    requirement: { type: 'exploration', value: 10 },
    tier: 2,
  },
  {
    id: 'feature-fanatic',
    name: 'Feature Fanatic',
    description: 'Discover 20 different features',
    icon: '🎯',
    category: 'explorer',
    requirement: { type: 'exploration', value: 20 },
    tier: 3,
  },
  {
    id: 'heka-explorer',
    name: 'HEKA Explorer',
    description: 'Discover 30 different features',
    icon: '🗺️',
    category: 'explorer',
    requirement: { type: 'exploration', value: 30 },
    tier: 4,
  },
  {
    id: 'master-explorer',
    name: 'Master Explorer',
    description: 'Discover ALL features in the app',
    icon: '👑',
    category: 'master',
    requirement: { type: 'exploration', value: 34 }, // Total number of discoverable features
    secret: true,
    tier: 5,
  },
];

// ============================================================================
// Unlocked Achievement Interface
// ============================================================================

export interface UnlockedAchievement extends Achievement {
  unlockedAt: string;
}

// ============================================================================
// Main Achievement Checker
// ============================================================================

export function checkAchievements(
  stats: UsageStatistics,
  notes: Record<string, { id: string; category?: string; mood?: number; createdAt: string }[]>,
  engagement: AppEngagement,
  discovery: FeatureDiscoveryProgress,
  previouslyUnlocked: string[]
): UnlockedAchievement[] {
  const newlyUnlocked: UnlockedAchievement[] = [];
  const now = new Date().toISOString();
  
  for (const achievement of ACHIEVEMENTS) {
    if (previouslyUnlocked.includes(achievement.id)) continue;
    
    let isUnlocked = false;
    
    switch (achievement.requirement.type) {
      // Original note-focused achievements
      case 'notes':
        if (achievement.requirement.category) {
          const categoryCount = stats.notesByCategory[achievement.requirement.category as keyof typeof stats.notesByCategory] || 0;
          isUnlocked = categoryCount >= achievement.requirement.value;
        } else {
          isUnlocked = stats.totalNotes >= achievement.requirement.value;
        }
        break;
        
      case 'streak':
        isUnlocked = stats.longestStreak >= achievement.requirement.value;
        break;
        
      case 'categories': {
        const usedCategories = Object.entries(stats.notesByCategory)
          .filter(([, count]) => count > 0).length;
        isUnlocked = usedCategories >= achievement.requirement.value;
        break;
      }
        
      case 'words':
        isUnlocked = stats.totalWords >= achievement.requirement.value;
        break;
        
      case 'months': {
        const uniqueMonths = Object.keys(stats.notesByMonth).length;
        isUnlocked = uniqueMonths >= achievement.requirement.value;
        break;
      }
        
      case 'mood': {
        const allNotes = Object.values(notes).flat();
        const moodEntries = allNotes.filter(n => n.mood).length;
        isUnlocked = moodEntries >= achievement.requirement.value;
        break;
      }
        
      case 'special':
        isUnlocked = checkSpecialAchievement(achievement.id, notes, stats);
        break;
        
      // Phase 1: App Engagement achievements
      case 'appOpens':
        isUnlocked = engagement.totalAppOpens >= achievement.requirement.value;
        break;
        
      case 'openStreak':
        isUnlocked = engagement.longestOpenStreak >= achievement.requirement.value;
        break;
        
      case 'timeSpent':
        isUnlocked = engagement.totalTimeSpent >= achievement.requirement.value;
        break;
        
      // Phase 1: Feature Discovery achievements
      case 'features':
        if (achievement.requirement.feature) {
          isUnlocked = discovery[achievement.requirement.feature] === true;
        }
        break;
        
      // Phase 1: Settings Exploration achievements
      case 'settings':
        isUnlocked = checkSettingsAchievement(achievement, engagement, discovery);
        break;
        
      // Phase 1: General Exploration achievements
      case 'exploration': {
        const discoveredFeaturesCount = Object.values(discovery).filter(v => v === true).length;
        isUnlocked = discoveredFeaturesCount >= achievement.requirement.value;
        break;
      }
    }
    
    if (isUnlocked) {
      newlyUnlocked.push({ ...achievement, unlockedAt: now });
    }
  }
  
  return newlyUnlocked;
}

// ============================================================================
// Special Achievement Checker
// ============================================================================

function checkSpecialAchievement(
  id: string,
  notes: Record<string, { id: string; category?: string; mood?: number; createdAt: string }[]>,
  stats: UsageStatistics
): boolean {
  const notesList = Object.values(notes).flat();
  
  switch (id) {
    case 'night-owl':
      return notesList.some(note => {
        const hour = new Date(note.createdAt).getHours();
        return hour >= 0 && hour < 4;
      });
      
    case 'early-bird':
      return notesList.some(note => {
        const hour = new Date(note.createdAt).getHours();
        return hour >= 5 && hour < 7;
      });
      
    case 'full-moon-ritual':
      // Would need moon phase calculation - placeholder
      return false;
      
    case 'work-life-balance': {
      const workCount = stats.notesByCategory['work'] || 0;
      const personalCount = stats.notesByCategory['personal'] || 0;
      return workCount >= 25 && personalCount >= 25;
    }
      
    default:
      return false;
  }
}

// ============================================================================
// Settings Achievement Checker
// ============================================================================

function checkSettingsAchievement(
  achievement: Achievement,
  engagement: AppEngagement,
  discovery: FeatureDiscoveryProgress
): boolean {
  const { setting, value } = achievement.requirement;
  
  switch (setting) {
    case 'themes':
      return engagement.themesTried.length >= value;
      
    case 'fonts':
      return engagement.fontsTried.length >= value;
      
    case 'display': {
      // Count display options that have been toggled
      const displayOptions = [
        discovery.enabledMoonPhases,
        discovery.enabledTransits,
        discovery.enabledSeasonalEvents,
        discovery.enabledHolidays,
        discovery.enabledEnergyVote,
        discovery.enabledBirthChart,
      ];
      return displayOptions.filter(Boolean).length >= value;
    }
      
    case 'customizations':
      return engagement.customizationsMade >= value;
      
    default:
      return false;
  }
}

// ============================================================================
// Level System - Enhanced for Phase 1
// ============================================================================

export interface UserLevel {
  level: number;
  title: string;
  minNotes: number;
  minAppOpens: number;  // Phase 1: Also consider app opens
  color: string;
}

export const USER_LEVELS: UserLevel[] = [
  { level: 1, title: 'Timekeeper Initiate', minNotes: 0, minAppOpens: 0, color: '#6b7280' },
  { level: 2, title: 'Calendar Apprentice', minNotes: 10, minAppOpens: 5, color: '#22c55e' },
  { level: 3, title: 'Season Observer', minNotes: 50, minAppOpens: 20, color: '#3b82f6' },
  { level: 4, title: 'Arc Navigator', minNotes: 100, minAppOpens: 50, color: '#8b5cf6' },
  { level: 5, title: 'HEKA Scholar', minNotes: 250, minAppOpens: 100, color: '#f59e0b' },
  { level: 6, title: 'Chronicle Keeper', minNotes: 500, minAppOpens: 250, color: '#ef4444' },
  { level: 7, title: 'Master of Time', minNotes: 1000, minAppOpens: 500, color: '#d4af37' },
];

export function getUserLevel(totalNotes: number, totalAppOpens: number = 0): UserLevel {
  for (let i = USER_LEVELS.length - 1; i >= 0; i--) {
    const level = USER_LEVELS[i];
    if (totalNotes >= level.minNotes && totalAppOpens >= level.minAppOpens) {
      return level;
    }
  }
  return USER_LEVELS[0];
}

export function getProgressToNextLevel(
  totalNotes: number, 
  totalAppOpens: number = 0
): { 
  current: number; 
  next: number; 
  progress: number;
  notesProgress: number;
  opensProgress: number;
} {
  const currentLevel = getUserLevel(totalNotes, totalAppOpens);
  const currentLevelIndex = USER_LEVELS.findIndex(l => l.level === currentLevel.level);
  const nextLevel = USER_LEVELS[currentLevelIndex + 1];
  
  if (!nextLevel) {
    return { 
      current: totalNotes, 
      next: totalNotes, 
      progress: 100,
      notesProgress: 100,
      opensProgress: 100,
    };
  }
  
  const notesProgress = ((totalNotes - currentLevel.minNotes) / (nextLevel.minNotes - currentLevel.minNotes)) * 100;
  const opensProgress = ((totalAppOpens - currentLevel.minAppOpens) / (nextLevel.minAppOpens - currentLevel.minAppOpens)) * 100;
  
  // Combined progress (both must be at 100% to level up)
  const progress = Math.min((notesProgress + opensProgress) / 2, 100);
  
  return { 
    current: totalNotes, 
    next: nextLevel.minNotes, 
    progress: Math.min(progress, 100),
    notesProgress: Math.min(notesProgress, 100),
    opensProgress: Math.min(opensProgress, 100),
  };
}

// ============================================================================
// Achievement Categories Helper
// ============================================================================

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

export function getAchievementsByTier(tier: number): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.tier === tier);
}

export function getSecretAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.secret === true);
}

export function getVisibleAchievements(unlockedIds: string[]): Achievement[] {
  return ACHIEVEMENTS.filter(a => !a.secret || unlockedIds.includes(a.id));
}

// ============================================================================
// Rewards System
// ============================================================================

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: 'theme' | 'font' | 'icon' | 'title' | 'badge' | 'avatar';
  unlockedBy: string; // Achievement ID
}

export const REWARDS: Reward[] = [
  {
    id: 'golden-theme',
    name: 'Golden Age Theme',
    description: 'A luxurious gold-accented theme',
    type: 'theme',
    unlockedBy: 'century-club',
  },
  {
    id: 'scholar-font',
    name: 'Scholar Font',
    description: 'Elegant serif typography',
    type: 'font',
    unlockedBy: 'wordsmith',
  },
  {
    id: 'master-title',
    name: 'Master of Time',
    description: 'Exclusive title for your profile',
    type: 'title',
    unlockedBy: 'heka-devotee',
  },
  {
    id: 'explorer-badge',
    name: 'Explorer Badge',
    description: 'Special badge for discovering all features',
    type: 'badge',
    unlockedBy: 'master-explorer',
  },
  {
    id: 'dedicated-icon',
    name: 'Dedicated Icon',
    description: 'App icon customization for yearly dedication',
    type: 'icon',
    unlockedBy: 'yearly-yield',
  },
];

// ============================================================================
// Daily Rituals (Preserved from original)
// ============================================================================

export interface DailyRitual {
  id: string;
  title: string;
  description: string;
  moonPhase: 'new' | 'waxing' | 'full' | 'waning' | 'any';
  completed: boolean;
}

export function getDailyRituals(moonPhase: 'new' | 'waxing' | 'full' | 'waning'): DailyRitual[] {
  const rituals: DailyRitual[] = [
    {
      id: 'gratitude',
      title: 'Gratitude Practice',
      description: 'Write 3 things you are grateful for',
      moonPhase: 'any',
      completed: false,
    },
    {
      id: 'reflection',
      title: 'Daily Reflection',
      description: 'Review your day and note key moments',
      moonPhase: 'any',
      completed: false,
    },
    {
      id: 'intention',
      title: 'Set Intentions',
      description: 'Write your intentions for the day ahead',
      moonPhase: 'new',
      completed: false,
    },
    {
      id: 'release',
      title: 'Let Go',
      description: 'Write what you want to release and let go of',
      moonPhase: 'full',
      completed: false,
    },
    {
      id: 'manifest',
      title: 'Manifestation',
      description: 'Visualize and write about your desires',
      moonPhase: 'waxing',
      completed: false,
    },
    {
      id: 'cleanse',
      title: 'Energetic Cleanse',
      description: 'Clear old energy and prepare for new beginnings',
      moonPhase: 'waning',
      completed: false,
    },
  ];
  
  return rituals.filter(r => r.moonPhase === 'any' || r.moonPhase === moonPhase);
}

// ============================================================================
// Feature Discovery Service
// ============================================================================

/**
 * Service for tracking feature discovery and app engagement
 * This is the main entry point for Phase 1 gamification tracking
 */
export class FeatureDiscoveryService {
  private discovery: FeatureDiscoveryProgress;
  private engagement: AppEngagement;
  private onDiscovery?: (feature: FeatureDiscoveryKey) => void;
  
  constructor(
    discovery: FeatureDiscoveryProgress,
    engagement: AppEngagement,
    onDiscovery?: (feature: FeatureDiscoveryKey) => void
  ) {
    this.discovery = discovery;
    this.engagement = engagement;
    this.onDiscovery = onDiscovery;
  }
  
  /**
   * Discover a feature - call when user interacts with a feature for the first time
   */
  discover(feature: FeatureDiscoveryKey): boolean {
    if (this.discovery[feature]) {
      return false; // Already discovered
    }
    
    this.discovery[feature] = true;
    this.engagement.featuresDiscovered[feature] = Date.now();
    
    this.onDiscovery?.(feature);
    
    return true;
  }
  
  /**
   * Check if a feature has been discovered
   */
  hasDiscovered(feature: FeatureDiscoveryKey): boolean {
    return this.discovery[feature] === true;
  }
  
  /**
   * Get total number of discovered features
   */
  getDiscoveryCount(): number {
    return Object.values(this.discovery).filter(v => v === true).length;
  }
  
  /**
   * Get list of undiscovered features
   */
  getUndiscoveredFeatures(): FeatureDiscoveryKey[] {
    return (Object.keys(this.discovery) as FeatureDiscoveryKey[])
      .filter(key => !this.discovery[key]);
  }
  
  /**
   * Get discovery progress percentage
   */
  getDiscoveryProgress(): number {
    const total = Object.keys(this.discovery).length;
    const discovered = this.getDiscoveryCount();
    return Math.round((discovered / total) * 100);
  }
}

// ============================================================================
// Export types for convenience
// ============================================================================

export type { AppEngagement, FeatureDiscoveryProgress, FeatureDiscoveryKey };
