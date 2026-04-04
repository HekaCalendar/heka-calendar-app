/**
 * HEKA Calendar - Professional Type Definitions
 */

export type HekaMonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface HekaDate {
  year: number;
  month: HekaMonthIndex;
  day: number;
}

export interface CivilDate {
  year: number;
  month: number;
  day: number;
}

export type ArcType = 'OPENING' | 'CORE' | 'CLOSING';

export const ARC_NAMES: Record<ArcType, string> = {
  OPENING: 'Opening',
  CORE: 'Core',
  CLOSING: 'Closing'
};

export const HEKA_MONTHS = [
  'April', 'May', 'June', 'July', 'August',
  'Hexa', 'September', 'October', 'November', 'December',
  'January', 'February', 'March'
] as const;

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export interface MonthInfo {
  index: HekaMonthIndex;
  name: string;
  civilHint: string;
  arc: ArcType;
}

export interface CalendarDay {
  hekaDate: HekaDate;
  civilDate: Date;
  moonPhase: string;
  isToday: boolean;
  isHoliday: boolean;
  hasNote: boolean;
  seasonalEvent?: import('../services/astronomyService').SeasonalEventData;
  lunarMonth?: string;
}

export type TimeMode = 'SYNC' | 'TRUE';

// ============================================================================
// Enhanced Note System
// ============================================================================

export type NoteCategory = 'personal' | 'work' | 'spiritual' | 'family' | 'health' | 'creative' | 'general';

export const NOTE_CATEGORIES: { id: NoteCategory; name: string; color: string; icon: string }[] = [
  { id: 'personal', name: 'Personal', color: '#3b82f6', icon: '👤' },
  { id: 'work', name: 'Work', color: '#8b5cf6', icon: '💼' },
  { id: 'spiritual', name: 'Spiritual', color: '#f59e0b', icon: '🧘' },
  { id: 'family', name: 'Family', color: '#ec4899', icon: '👨‍👩‍👧‍👦' },
  { id: 'health', name: 'Health', color: '#22c55e', icon: '❤️' },
  { id: 'creative', name: 'Creative', color: '#06b6d4', icon: '🎨' },
  { id: 'general', name: 'General', color: '#6b7280', icon: '📝' },
];

export interface RecurringConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every N days/weeks/months/years
  endDate?: Date; // Optional end date
  occurrences?: number; // Optional max occurrences
}

export interface NoteData {
  id: string;
  content: string;
  category: NoteCategory;
  mood?: 1 | 2 | 3 | 4 | 5; // 1=very bad, 5=excellent
  recurring?: RecurringConfig;
  duplicatedFrom?: string; // ID of the original note this was duplicated from
  createdAt: string;
  updatedAt: string;
}

// Notes are now stored as arrays per day to support multiple notes
export type DayNotes = NoteData[];

// ============================================================================
// Statistics & Analytics
// ============================================================================

export interface UsageStatistics {
  totalNotes: number;
  notesByCategory: Record<NoteCategory, number>;
  notesByMonth: Record<string, number>; // Format: "2026-04"
  currentStreak: number; // Consecutive days with notes
  longestStreak: number;
  lastNoteDate?: string;
  moodAverage: number;
  moodByMonth: Record<string, number>;
  mostActiveMonth: { month: string; count: number };
  totalWords: number;
}

// ============================================================================
// App Engagement Tracking (Phase 1 Gamification)
// ============================================================================

export interface AppEngagement {
  // App Open Tracking
  totalAppOpens: number;
  currentOpenStreak: number; // Consecutive days of app opens
  longestOpenStreak: number;
  lastOpenDate: string | null;
  firstOpenDate: string;
  
  // Time Spent Tracking (minutes)
  totalTimeSpent: number;
  dailyTimeSpent: Record<string, number>; // Format: "2026-04-01" -> minutes
  averageSessionLength: number;
  longestSession: number;
  
  // Exploration Tracking
  uniqueMonthsVisited: string[]; // Format: ["2026-01", "2026-02", ...]
  uniqueYearsVisited: number[];
  uniqueLocationsViewed: string[]; // Which locations user has viewed calendar for
  
  // Feature Discovery Tracking (see FeatureDiscoveryProgress below)
  featuresDiscovered: Record<string, number>; // featureId -> timestamp
  
  // Settings Exploration
  settingsExplored: Record<string, number>; // settingKey -> timestamp
  themesTried: string[];
  fontsTried: string[];
  displayModesTried: string[];
  customizationsMade: number;
}

export interface FeatureDiscoveryProgress {
  // Core UI Features
  openedDateModal: boolean;
  openedDayPanel: boolean;
  openedCelestialGuide: boolean;
  openedOracleJournal: boolean;
  openedProfileManager: boolean;
  
  // Calendar Views & Interactions
  usedTodayButton: boolean;
  usedMonthNavigator: boolean;
  usedYearNavigator: boolean;
  changedLocation: boolean;
  changedSubRegion: boolean;
  viewedDifferentMonth: boolean;
  viewedDifferentYear: boolean;
  
  // Feature Discovery & Toggles
  enabledMoonPhases: boolean;
  enabledTransits: boolean;
  enabledSeasonalEvents: boolean;
  enabledHolidays: boolean;
  enabledEnergyVote: boolean;
  enabledBirthChart: boolean;
  
  // Content Interactions
  votedOnEnergy: boolean;
  createdBirthChart: boolean;
  createdNote: boolean;
  printedCalendar: boolean;
  subscribedToCommunity: boolean;
  
  // Settings Explorations
  openedSettings: boolean;
  changedTheme: boolean;
  changedFont: boolean;
  changedDisplayMode: boolean;
  customizedColors: boolean;
  changedLocationSettings: boolean;
  
  // Social & Community
  viewedCommunityHolidays: boolean;
  suggestedHoliday: boolean;
  openedFriends: boolean;
}

export type FeatureDiscoveryKey = keyof FeatureDiscoveryProgress;

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'master' | 'special' | 'explorer' | 'discoverer';
  requirement: {
    type: 'notes' | 'streak' | 'categories' | 'words' | 'months' | 'mood' | 'special' | 
          'appOpens' | 'openStreak' | 'timeSpent' | 'features' | 'settings' | 'exploration';
    value: number;
    feature?: string; // For feature-specific achievements
    setting?: string; // For setting-specific achievements
    category?: string;
  };
  reward?: string;
  secret?: boolean;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

// ============================================================================
// Gamification
// ============================================================================

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export interface UserProgress {
  level: number;
  experience: number;
  achievements: UnlockedAchievement[];
  rewards: string[];
  dailyRitualsCompleted: string[];
  // Phase 1: App Engagement Tracking
  appEngagement: AppEngagement;
  featureDiscovery: FeatureDiscoveryProgress;
}

// ============================================================================
// Social Features
// ============================================================================

export interface CommunityHoliday {
  id: string;
  name: string;
  date: string; // MM-DD format
  description: string;
  suggestedBy: string;
  votes: number;
  approved: boolean;
  createdAt: string;
}

export interface SharedCalendar {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  description: string;
  subscribers: string[];
  isPublic: boolean;
  createdAt: string;
}

export interface CalendarInvite {
  id: string;
  calendarId: string;
  calendarName: string;
  invitedBy: string;
  date: HekaDate;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
}

// ============================================================================
// Main State
// ============================================================================

export interface UserAuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastSync: string | null;
  isSyncing: boolean;
  syncError: string | null;
}

export interface CalendarState {
  currentView: 'month' | 'year' | 'print-preview' | 'astrology-hub' | 'stars';
  viewDate: HekaDate;
  selectedDate: HekaDate | null;
  timeMode: TimeMode;
  location: import('./holidays').CountryCode;
  subRegion: string | null; // Selected state/province code
  theme: import('./themes').ThemeId;
  font: import('./themes').FontId;
  auth: UserAuthState;
  display: {
    showCivilDates: boolean;
    showMoonPhases: boolean;
    showHolidays: boolean;
    showSeasonalEvents: boolean;
    showAgriculturalGuidance: boolean;
    showEnergyForecast: boolean;
  };
  ui: {
    isYearModalOpen: boolean;
    isSearchModalOpen: boolean;
    isShareModalOpen: boolean;
    isStatsModalOpen: boolean;
    isSettingsOpen: boolean;
    isLoading: boolean;
    error: string | null;
  };
  // Enhanced notes system
  notes: Record<string, DayNotes>;
  // User statistics
  statistics: UsageStatistics;
  // Social features
  communityHolidays: CommunityHoliday[];
  subscribedCalendars: string[];
  pendingInvites: CalendarInvite[];
  // Gamification
  progress: UserProgress;
  // Astrology profiles and preferences
  astroProfiles: import('./astrology').AstroProfile[];
  selectedAstroProfileId: string | null;
  astroPreferences: {
    enableDailyTips: boolean;
    enableRetrogradeAlerts: boolean;
    enableMoonPhaseAlerts: boolean;
    showTransitsOnCalendar: boolean;
    zodiacSystem: '12-sign' | '13-sign';
  };
}

export type PrintMode = 'month' | 'year' | null;

export interface PrintOptions {
  includeNotes: boolean;
  includeMoonPhases: boolean;
  includeCivilDates: boolean;
  includeSeasonalEvents: boolean;
  includeHolidays: boolean;
  paperSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  theme: 'default' | 'minimalist' | 'sacred-geometry' | 'nature-organic' | 'cyberpunk' | 'ancient-egypt';
}

export type PrintTheme = PrintOptions['theme'];

export interface PrintJob {
  id: string;
  mode: PrintMode;
  year: number;
  month?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  pdfUrl?: string;
}

export interface PrintPage {
  monthIndex: number;
  monthName: string;
  arc: ArcType;
  orderInYear: number;
  days: PrintDay[];
}

export interface PrintDay {
  hekaDay: number;
  civilDate: string;
  moonGlyph: string;
  notes: string;
  seasonalEvent?: string;
  isBlank?: boolean;
}

export * from './holidays';

export type CalendarAction = 
  | { type: 'NAVIGATE_TO_MONTH'; payload: { year: number; month: number } }
  | { type: 'SELECT_DATE'; payload: HekaDate }
  | { type: 'TOGGLE_DISPLAY'; payload: keyof CalendarState['display'] }
  | { type: 'SET_PRINT_MODE'; payload: PrintMode }
  | { type: 'ADD_NOTE'; payload: { key: string; content: string } }
  | { type: 'SET_LOCATION'; payload: import('./holidays').CountryCode };
