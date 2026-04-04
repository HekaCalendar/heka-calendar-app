# Phase 1 Gamification Implementation

## Overview
Enterprise-grade achievement system for app engagement tracking, independent of note-writing activities.

## Three Core Tracks

### 1. Feature Discovery Badges 🗺️
Unlock by toggling/trying features throughout the app:

**Core UI Features:**
- `openedDateModal` - Open date modal for detailed info
- `openedDayPanel` - Open day panel for daily insights  
- `openedCelestialGuide` - Open Celestial Guide
- `openedOracleJournal` - Open Oracle Journal
- `openedProfileManager` - Open Profile Manager/Stars Hub

**Calendar Navigation:**
- `usedTodayButton` - Use "Jump to Today"
- `usedMonthNavigator` - Navigate months
- `usedYearNavigator` - Navigate years
- `changedLocation` - Change calendar location
- `changedSubRegion` - Select state/province
- `viewedDifferentMonth` - View non-current month
- `viewedDifferentYear` - View non-current year

**Feature Toggles:**
- `enabledMoonPhases` - Enable moon phase display
- `enabledTransits` - Enable planetary transit indicators
- `enabledSeasonalEvents` - Enable seasonal markers
- `enabledHolidays` - Enable holiday display
- `enabledEnergyVote` - Enable energy forecasts
- `enabledBirthChart` - Enable birth chart integration

**Content Interactions:**
- `votedOnEnergy` - Cast energy forecast vote
- `createdBirthChart` - Create astrological profile
- `createdNote` - Create first note
- `printedCalendar` - Print calendar view
- `subscribedToCommunity` - Subscribe to community calendar

**Settings & Social:**
- `openedSettings` - Open settings panel
- `changedTheme` - Change UI theme
- `changedFont` - Change font
- `changedDisplayMode` - Toggle display options
- `customizedColors` - Customize colors
- `changedLocationSettings` - Change location in settings
- `viewedCommunityHolidays` - View community holidays
- `suggestedHoliday` - Suggest a holiday
- `sharedCalendar` - Share calendar

### 2. App Engagement Streaks 🔥
Track app opens, time spent, daily visits (independent of note creation):

**App Open Achievements:**
- `first-open` - First app open (👋 First Contact)
- `regular-visitor` - 10 opens
- `daily-companion` - 50 opens
- `heka-habit` - 100 opens
- `centennial-opens` - 500 opens
- `master-of-opens` - 1,000 opens (secret)

**Open Streak Achievements:**
- `week-dedication` - 7 consecutive days
- `month-commitment` - 30 consecutive days
- `quarter-quest` - 91 consecutive days (one season)
- `yearly-yield` - 365 consecutive days

**Time Spent Achievements:**
- `first-hour` - 60 minutes total
- `day-dreamer` - 24 hours (1,440 minutes)
- `time-traveler` - 7 days (10,080 minutes)
- `time-lord` - 30 days (43,200 minutes, secret)

### 3. Settings Exploration Badges 🔍
Badges for customizing themes, fonts, locations, display options:

**Theme Exploration:**
- `theme-taster` - Try 3 different themes
- `theme-collector` - Try 5 different themes
- `theme-master` - Try all available themes

**Font Exploration:**
- `font-finder` - Try 3 different fonts
- `typography-tycoon` - Try all fonts

**Display Exploration:**
- `display-dabbler` - Toggle 3 display options
- `display-connoisseur` - Toggle all display options

**General Customization:**
- `customization-curious` - Make 5 customizations
- `personalization-pro` - Make 20 customizations
- `settings-savant` - Make 50 customizations

**Combined Exploration:**
- `feature-finder` - Discover 10 features
- `feature-fanatic` - Discover 20 features
- `heka-explorer` - Discover 30 features
- `master-explorer` - Discover ALL features (secret)

## Technical Implementation

### New Types (src/types/index.ts)
```typescript
AppEngagement {
  totalAppOpens: number;
  currentOpenStreak: number;
  longestOpenStreak: number;
  lastOpenDate: string | null;
  firstOpenDate: string;
  totalTimeSpent: number;
  dailyTimeSpent: Record<string, number>;
  averageSessionLength: number;
  longestSession: number;
  uniqueMonthsVisited: string[];
  uniqueYearsVisited: number[];
  uniqueLocationsViewed: string[];
  featuresDiscovered: Record<string, number>;
  settingsExplored: Record<string, number>;
  themesTried: string[];
  fontsTried: string[];
  displayModesTried: string[];
  customizationsMade: number;
}

FeatureDiscoveryProgress {
  // 34 discoverable features
  openedDateModal: boolean;
  openedDayPanel: boolean;
  // ... etc
}
```

### New Redux Actions (src/store/index.ts)
- `trackAppOpen()` - Track app initialization
- `trackTimeSpent({ minutes })` - Track session time
- `trackMonthVisit({ year, month })` - Track navigation
- `discoverFeature({ feature })` - Mark feature discovered
- `trackSettingsExplored({ setting, value })` - Track settings
- `trackThemeChange({ themeId })` - Track theme selection
- `trackFontChange({ fontId })` - Track font selection
- `trackDisplayChange({ setting, enabled })` - Track display toggle
- `trackLocationChange({ location, subRegion })` - Track location change

### Engagement Service (src/services/engagementService.ts)
- `initializeEngagementTracking(dispatch)` - Call on app init
- `trackFeatureDiscovery(dispatch, getState, feature)` - Discover feature
- `trackMonthNavigation(dispatch, year, month)` - Track month visit
- `trackThemeExploration(dispatch, themeId)` - Track theme
- `trackFontExploration(dispatch, fontId)` - Track font
- `trackDisplayExploration(dispatch, setting, enabled)` - Track display
- `trackLocationExploration(dispatch, location, subRegion)` - Track location
- `markActivity()` - Mark user activity

### React Hooks (src/hooks/useGamification.ts)
- `useGamification()` - Full gamification state and actions
- `useFeatureDiscovery()` - Feature discovery tracking
- `useSettingsTracking()` - Settings exploration tracking
- `useAchievements()` - Achievement display data
- `useUserLevel()` - User level and progress

### Achievement Dashboard (src/components/AchievementDashboard.tsx)
Visual dashboard displaying:
- User level with progress bar
- Engagement stats (opens, streak, time spent, discovery %)
- Category progress pills
- Filterable achievement grid
- Secret achievement hiding

## Integration Points

### App.tsx
```typescript
useEffect(() => {
  initializeEngagementTracking(dispatch);
  // ... activity listeners
}, [dispatch]);
```

### CalendarGrid.tsx
```typescript
const { discover } = useFeatureDiscovery();
const handleDayClick = useCallback((day: CalendarDay) => {
  dispatch(selectDate(day.hekaDate));
  discover('openedDayPanel');
  discover('createdNote');
}, [dispatch, discover]);
```

### MonthHeader.tsx
```typescript
<button onClick={() => {
  dispatch(prevMonth());
  discover('usedMonthNavigator');
  discover('viewedDifferentMonth');
  trackMonthNavigation(dispatch, viewDate.year, viewDate.month);
}}>
```

### SettingsPanel.tsx
```typescript
const { discover } = useFeatureDiscovery();
const { trackLocation, trackDisplay } = useSettingsTracking();

<button onClick={() => {
  dispatch(toggleDisplay('showMoonPhases'));
  if (!display.showMoonPhases) {
    discover('enabledMoonPhases');
    trackDisplay('showMoonPhases', true);
  }
}}>
```

### ThemeSettings.tsx
```typescript
const { trackTheme, trackFont } = useSettingsTracking();

const handleThemeSelect = (themeId: ThemeId) => {
  dispatch(setTheme(themeId));
  discover('changedTheme');
  trackTheme(themeId);
};
```

## User Level System (Enhanced)

| Level | Title | Min Notes | Min App Opens |
|-------|-------|-----------|---------------|
| 1 | Timekeeper Initiate | 0 | 0 |
| 2 | Calendar Apprentice | 10 | 5 |
| 3 | Season Observer | 50 | 20 |
| 4 | Arc Navigator | 100 | 50 |
| 5 | HEKA Scholar | 250 | 100 |
| 6 | Chronicle Keeper | 500 | 250 |
| 7 | Master of Time | 1000 | 500 |

## Achievement Statistics

Total Achievements: 70+
- Original note-focused: ~25
- App engagement: ~15
- Feature discovery: ~25
- Settings exploration: ~10
- Secret/hidden: ~8

## Persistence

All engagement data is automatically persisted to localStorage via the Redux store:
- `appEngagement` - App opens, time spent, exploration
- `featureDiscovery` - Feature discovery flags
- `progress.achievements` - Unlocked achievements

## Future Enhancements (Phase 2)

- Real-time achievement notifications
- Achievement sharing to social media
- Leaderboards (opt-in)
- Weekly challenges
- Deep linking to specific features for guided discovery
- Analytics dashboard for admins
