/**
 * TUTORIAL INDEX - Enterprise Master List
 * Complete inventory of all tutorials and their coverage
 * 
 * This file serves as the single source of truth for tutorial coverage
 * and helps track which UI features have tutorial explanations.
 */

import type { Tutorial } from '../types/tutorial';

// Import all tutorial modules
import { calendarBasicsTutorial, astrologyIntroTutorial, advancedFeaturesTutorial, journalDeepDiveTutorial } from './tutorialContent';
import { settingsDeepDiveTutorial } from './tutorialSettingsContent';
import { coreCalendarInterfaceTutorial, calendarGridTutorial, dayPanelTutorial, oracleJournalTutorial } from './tutorialMasterContent';
import { eliteTutorial } from './tutorialElite';

// ═══════════════════════════════════════════════════════════════════════════════
// MASTER TUTORIAL REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

export const allTutorials: Tutorial[] = [
  // CORE ONBOARDING - ELITE VERSION (20 slides)
  eliteTutorial,                               // 20 steps - Elite immersive onboarding
  coreCalendarInterfaceTutorial,               // 12 steps - Every header button
  calendarGridTutorial,                        // 10 steps - Grid anatomy, expansion, day cells
  dayPanelTutorial,                            // 12 steps - Day panel deep dive
  calendarBasicsTutorial,                      // 3 steps - HEKA vs Gregorian, arcs, modes
  
  // ASTROLOGY MODULE (2 tutorials, 19 steps total)
  astrologyIntroTutorial,                      // 7 steps - Birth charts, Stars Hub
  // Note: Additional astrology tutorials would go here
  
  // JOURNAL MODULE (1 tutorial, 10 steps)
  oracleJournalTutorial,                       // 10 steps - Complete journal guide
  
  // JOURNAL DEEP DIVE (1 tutorial, 6 steps)
  journalDeepDiveTutorial,
  
  // SETTINGS & CONFIGURATION (1 tutorial, 18 steps)
  settingsDeepDiveTutorial,                    // 18 steps - Every toggle explained
  
  // ADVANCED FEATURES (1 tutorial, 5 steps)
  advancedFeaturesTutorial,                    // 5 steps - Energy voting, print, etc.
  
  // Additional master tutorials (excluding ones already imported)
  // Note: masterTutorials contains dayPanelTutorial which is already imported above
];

// ═══════════════════════════════════════════════════════════════════════════════
// TUTORIAL COVERAGE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export const tutorialCoverage = {
  // Statistics
  totalTutorials: allTutorials.length,
  totalSteps: allTutorials.reduce((acc, t) => acc + t.steps.length, 0),
  totalCharacters: allTutorials.reduce((acc, t) => 
    acc + t.steps.reduce((stepAcc, s) => stepAcc + s.content.length + s.title.length, 0), 0),
  
  // By category
  byCategory: {
    onboarding: allTutorials.filter(t => t.category === 'onboarding').length,
    advanced: allTutorials.filter(t => t.category === 'advanced').length,
    'calendar-basics': allTutorials.filter(t => t.category === 'calendar-basics').length,
    'astrology-intro': allTutorials.filter(t => t.category === 'astrology-intro').length,
    gamification: allTutorials.filter(t => t.category === 'gamification').length,
    'advanced-features': allTutorials.filter(t => t.category === 'advanced-features').length,
    contextual: allTutorials.filter(t => t.category === 'contextual').length,
  },
  
  // By trigger type
  byTrigger: {
    'first-visit': allTutorials.filter(t => t.triggerCondition === 'first-visit').length,
    manual: allTutorials.filter(t => t.triggerCondition === 'manual').length,
    'feature-discovery': allTutorials.filter(t => t.triggerCondition === 'feature-discovery').length,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURE COVERAGE MATRIX
// Maps every major app feature to its tutorial
// ═══════════════════════════════════════════════════════════════════════════════

export const featureCoverageMatrix = {
  // HEADER CONTROLS (12 features)
  'header-logo': { tutorial: 'core-calendar-interface', step: 'header-overview' },
  'sign-in-button': { tutorial: 'core-calendar-interface', step: 'header-overview' },
  'month-display': { tutorial: 'core-calendar-interface', step: 'month-display' },
  'arc-indicator': { tutorial: 'core-calendar-interface', step: 'month-display' },
  'prev-month': { tutorial: 'core-calendar-interface', step: 'navigation-arrows' },
  'next-month': { tutorial: 'core-calendar-interface', step: 'navigation-arrows' },
  'today-button': { tutorial: 'core-calendar-interface', step: 'today-button-detailed' },
  'search-button': { tutorial: 'core-calendar-interface', step: 'search-button-detailed' },
  'info-button': { tutorial: 'core-calendar-interface', step: 'info-button-detailed' },
  'year-button': { tutorial: 'core-calendar-interface', step: 'year-button-detailed' },
  'stars-button': { tutorial: 'core-calendar-interface', step: 'stars-button-detailed' },
  'stats-button': { tutorial: 'core-calendar-interface', step: 'stats-button-detailed' },
  
  // JOURNAL (3 features)
  'journal-button': { tutorial: 'core-calendar-interface', step: 'journal-button-detailed' },
  'journal-modal': { tutorial: 'oracle-journal-complete', step: 'journal-interface' },
  'create-entry': { tutorial: 'oracle-journal-complete', step: 'creating-entries' },
  'mood-tracking': { tutorial: 'oracle-journal-complete', step: 'mood-tracking' },
  'entry-categories': { tutorial: 'oracle-journal-complete', step: 'entry-categories' },
  'journal-search': { tutorial: 'oracle-journal-complete', step: 'journal-search' },
  'journal-insights': { tutorial: 'oracle-journal-complete', step: 'journal-insights' },
  'journal-themes': { tutorial: 'oracle-journal-complete', step: 'journal-themes' },
  'recurring-entries': { tutorial: 'oracle-journal-complete', step: 'recurring-entries' },
  'journal-sharing': { tutorial: 'oracle-journal-complete', step: 'journal-sharing' },
  
  // COMMUNITY (2 features)
  'community-button': { tutorial: 'core-calendar-interface', step: 'community-button-detailed' },
  'energy-voting': { tutorial: 'advanced-features', step: 'energy-voting' },
  
  // SHARING & PRINT (2 features)
  'share-button': { tutorial: 'core-calendar-interface', step: 'share-button-detailed' },
  'print-button': { tutorial: 'core-calendar-interface', step: 'print-button-detailed' },
  
  // CALENDAR GRID (9 features)
  'grid-structure': { tutorial: 'calendar-grid-deep-dive', step: 'grid-overview' },
  'day-cell': { tutorial: 'calendar-grid-deep-dive', step: 'day-cell-anatomy' },
  'expand-calendar': { tutorial: 'calendar-grid-deep-dive', step: 'expand-calendar' },
  'today-highlight': { tutorial: 'calendar-grid-deep-dive', step: 'today-highlighting' },
  'day-out-of-time': { tutorial: 'calendar-grid-deep-dive', step: 'day-out-of-time-deep' },
  'blank-cells': { tutorial: 'calendar-grid-deep-dive', step: 'blank-cells' },
  'weekday-headers': { tutorial: 'calendar-grid-deep-dive', step: 'weekday-headers' },
  'moon-icons': { tutorial: 'calendar-grid-deep-dive', step: 'moon-phase-icons' },
  'note-previews': { tutorial: 'calendar-grid-deep-dive', step: 'note-previews' },
  'holiday-indicators': { tutorial: 'calendar-grid-deep-dive', step: 'holiday-indicators' },
  
  // SETTINGS (18 toggles/features)
  'settings-panel': { tutorial: 'elite-onboarding', step: 'themes' },
  'civil-toggle': { tutorial: 'settings-deep-dive', step: 'civil-toggle-explanation' },
  'moon-phases-toggle': { tutorial: 'settings-deep-dive', step: 'moon-phases-explanation' },
  'holidays-toggle': { tutorial: 'settings-deep-dive', step: 'holidays-explanation' },
  'seasonal-events-toggle': { tutorial: 'settings-deep-dive', step: 'seasonal-events-explanation' },
  'agricultural-toggle': { tutorial: 'settings-deep-dive', step: 'agricultural-explanation' },
  'energy-forecast-toggle': { tutorial: 'settings-deep-dive', step: 'energy-forecast-explanation' },
  'sync-mode': { tutorial: 'settings-deep-dive', step: 'sync-mode-explanation' },
  'true-mode': { tutorial: 'settings-deep-dive', step: 'true-mode-explanation' },
  'location-settings': { tutorial: 'settings-deep-dive', step: 'location-explanation' },
  'subregion-settings': { tutorial: 'settings-deep-dive', step: 'subregion-explanation' },
  'theme-selection': { tutorial: 'settings-deep-dive', step: 'theme-explanation' },
  'font-selection': { tutorial: 'settings-deep-dive', step: 'font-explanation' },
  'birth-chart-integration': { tutorial: 'settings-deep-dive', step: 'birth-chart-integration-explanation' },
  'zodiac-system': { tutorial: 'settings-deep-dive', step: 'zodiac-system-explanation' },
  'daily-tips': { tutorial: 'settings-deep-dive', step: 'daily-tips-explanation' },
  'retrograde-alerts': { tutorial: 'settings-deep-dive', step: 'retrograde-alerts-explanation' },
  'moon-phase-alerts': { tutorial: 'settings-deep-dive', step: 'moon-phase-alerts-explanation' },
  
  // CALENDAR BASICS (3 concepts)
  'heka-vs-gregorian': { tutorial: 'calendar-basics', step: 'heka-vs-gregorian' },
  'three-arcs': { tutorial: 'calendar-basics', step: 'the-arcs' },
  'sync-vs-true': { tutorial: 'calendar-basics', step: 'sync-vs-true' },
  
  // GAMIFICATION (4 features)
  'achievements': { tutorial: 'gamification-intro', step: 'achievements-intro' },
  'achievement-dashboard': { tutorial: 'gamification-intro', step: 'achievement-dashboard' },
  'user-levels': { tutorial: 'gamification-intro', step: 'user-levels' },
  'feature-discovery': { tutorial: 'gamification-intro', step: 'feature-discovery' },
  
  // ASTROLOGY (7 features)
  'stars-hub': { tutorial: 'astrology-intro', step: 'enter-stars-hub' },
  'create-birth-chart': { tutorial: 'astrology-intro', step: 'create-birth-chart' },
  'birth-chart-form': { tutorial: 'astrology-intro', step: 'birth-chart-form' },
  'chart-wheel': { tutorial: 'astrology-intro', step: 'chart-wheel' },
  'element-temple': { tutorial: 'astrology-intro', step: 'element-temple' },
  'daily-briefing': { tutorial: 'astrology-intro', step: 'daily-briefing' },
  'pattern-recognition': { tutorial: 'astrology-intro', step: 'pattern-recognition' },
  
  // ADVANCED FEATURES (5 features)
  'seasonal-events': { tutorial: 'advanced-features', step: 'seasonal-events' },
  'agricultural-guidance': { tutorial: 'advanced-features', step: 'agricultural-guidance' },
  'print-system': { tutorial: 'advanced-features', step: 'print-system' },
  'year-view': { tutorial: 'advanced-features', step: 'year-view' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COVERAGE VERIFICATION
// Use this to check if all features have tutorials
// ═══════════════════════════════════════════════════════════════════════════════

export function verifyFeatureCoverage(featureId: string): boolean {
  return featureId in featureCoverageMatrix;
}

export function getTutorialForFeature(featureId: string): { tutorial: string; step: string } | null {
  return featureCoverageMatrix[featureId as keyof typeof featureCoverageMatrix] || null;
}

export function getCoveragePercentage(): number {
  // This would compare against a complete list of all features
  // For now, returns based on documented features
  const documentedFeatures = Object.keys(featureCoverageMatrix).length;
  return Math.round((documentedFeatures / 100) * 100); // Assuming 100 total features
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export { calendarBasicsTutorial, astrologyIntroTutorial, advancedFeaturesTutorial, journalDeepDiveTutorial };
export { settingsDeepDiveTutorial };
export { coreCalendarInterfaceTutorial, calendarGridTutorial, dayPanelTutorial, oracleJournalTutorial };
export { eliteTutorial };

// Tutorial lookup helpers
export function getTutorialById(id: string): Tutorial | undefined {
  return allTutorials.find(t => t.id === id);
}

export function getTutorialsByCategory(category: string): Tutorial[] {
  return allTutorials.filter(t => t.category === category);
}

export function getRecommendedTutorials(completedTutorials: string[]): Tutorial[] {
  return allTutorials.filter(t => 
    !completedTutorials.includes(t.id) &&
    (!t.requiredTutorials || t.requiredTutorials.every(req => completedTutorials.includes(req)))
  );
}

// Statistics
export function getTutorialStats() {
  return {
    totalTutorials: allTutorials.length,
    totalSteps: allTutorials.reduce((acc, t) => acc + t.steps.length, 0),
    totalContentSize: allTutorials.reduce((acc, t) => 
      acc + t.steps.reduce((stepAcc, s) => stepAcc + s.content.length, 0), 0),
    categories: [...new Set(allTutorials.map(t => t.category))],
  };
}
