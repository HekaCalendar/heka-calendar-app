/**
 * Astrology Selectors
 * Memoized selectors for efficient state access
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { 
  AstroProfile, 
  NatalChart, 
  ProfileId, 
  ChartId,
  PlanetId,
  Element,
  Modality
} from '../types';

// Base selectors
const selectEntities = (state: RootState) => state.astrology.entities;
const selectUI = (state: RootState) => state.astrology.ui;
const selectCalculation = (state: RootState) => state.astrology.calculation;

// Profile selectors
export const selectAllProfiles = createSelector(
  [selectEntities],
  (entities) => Object.values(entities.profiles)
);

export const selectProfilesArray = createSelector(
  [selectAllProfiles],
  (profiles) => profiles.sort((a, b) => b.createdAt - a.createdAt)
);

export const selectProfileCount = createSelector(
  [selectAllProfiles],
  (profiles) => profiles.length
);

export const selectSelectedProfileId = createSelector(
  [selectUI],
  (ui) => ui.selectedProfileId
);

export const selectSelectedProfile = createSelector(
  [selectEntities, selectSelectedProfileId],
  (entities, profileId): AstroProfile | null => {
    if (!profileId) return null;
    return entities.profiles[profileId] || null;
  }
);

export const selectProfileById = (profileId: ProfileId) =>
  createSelector(
    [selectEntities],
    (entities) => entities.profiles[profileId] || null
  );

export const selectHasProfiles = createSelector(
  [selectAllProfiles],
  (profiles) => profiles.length > 0
);

// Chart selectors
export const selectAllCharts = createSelector(
  [selectEntities],
  (entities) => Object.values(entities.charts)
);

export const selectChartById = (chartId: ChartId) =>
  createSelector(
    [selectEntities],
    (entities) => entities.charts[chartId] || null
  );

export const selectChartsForProfile = (profileId: ProfileId) =>
  createSelector(
    [selectAllCharts],
    (charts) => charts.filter(c => c.profileId === profileId)
  );

export const selectLatestChartForProfile = (profileId: ProfileId) =>
  createSelector(
    [selectChartsForProfile(profileId)],
    (charts) => {
      if (charts.length === 0) return null;
      return charts.sort((a, b) => b.calculatedAt - a.calculatedAt)[0];
    }
  );

export const selectSelectedProfileChart = createSelector(
  [selectSelectedProfile, selectAllCharts],
  (profile, charts): NatalChart | null => {
    if (!profile) return null;
    const profileCharts = charts.filter(c => c.profileId === profile.id);
    if (profileCharts.length === 0) return null;
    return profileCharts.sort((a, b) => b.calculatedAt - a.calculatedAt)[0];
  }
);

// Body/Planet selectors
export const selectChartBodies = createSelector(
  [selectSelectedProfileChart],
  (chart) => chart?.bodies || null
);

export const selectPlanetPosition = (planetId: PlanetId) =>
  createSelector(
    [selectChartBodies],
    (bodies) => bodies?.[planetId] || null
  );

export const selectSunSign = createSelector(
  [selectChartBodies],
  (bodies) => bodies?.sun?.sign || null
);

export const selectMoonSign = createSelector(
  [selectChartBodies],
  (bodies) => bodies?.moon?.sign || null
);

export const selectRisingSign = createSelector(
  [selectSelectedProfileChart],
  (chart) => {
    if (!chart?.houses) return null;
    return chart.houses.cusps[0]?.sign || null;
  }
);

// House selectors
export const selectHouses = createSelector(
  [selectSelectedProfileChart],
  (chart) => chart?.houses || null
);

export const selectHouseCusps = createSelector(
  [selectHouses],
  (houses) => houses?.cusps || []
);

export const selectHouseByNumber = (houseNumber: number) =>
  createSelector(
    [selectHouseCusps],
    (cusps) => cusps.find(c => c.number === houseNumber) || null
  );

// Aspect selectors
export const selectChartAspects = createSelector(
  [selectSelectedProfileChart],
  (chart) => chart?.aspects || []
);

export const selectMajorAspects = createSelector(
  [selectChartAspects],
  (aspects) => aspects.filter(a => 
    ['conjunction', 'square', 'trine', 'opposition'].includes(a.type)
  )
);

export const selectAspectsForPlanet = (planetId: PlanetId) =>
  createSelector(
    [selectChartAspects],
    (aspects) => aspects.filter(a => 
      a.body1 === planetId || a.body2 === planetId
    )
  );

// Pattern selectors
export const selectChartPatterns = createSelector(
  [selectSelectedProfileChart],
  (chart) => chart?.patterns || []
);

// Element/Modality balance
export const selectElementalBalance = createSelector(
  [selectSelectedProfileChart],
  (chart) => chart?.elementalBalance || null
);

export const selectDominantElement = createSelector(
  [selectElementalBalance],
  (balance) => balance?.dominant || null
);

export const selectModalBalance = createSelector(
  [selectSelectedProfileChart],
  (chart) => chart?.modalBalance || null
);

export const selectDominantModality = createSelector(
  [selectModalBalance],
  (balance) => balance?.dominant || null
);

// UI selectors
export const selectActiveView = createSelector(
  [selectUI],
  (ui) => ui.activeView
);

export const selectExpandedSections = createSelector(
  [selectUI],
  (ui) => ui.expandedSections
);

export const selectIsSectionExpanded = (section: string) =>
  createSelector(
    [selectExpandedSections],
    (sections) => sections[section] ?? false
  );

export const selectIsLoading = (key: string) =>
  createSelector(
    [selectUI],
    (ui) => ui.loading[key] || false
  );

export const selectError = (key: string) =>
  createSelector(
    [selectUI],
    (ui) => ui.errors[key] || null
  );

export const selectHasErrors = createSelector(
  [selectUI],
  (ui) => Object.values(ui.errors).some(e => e !== null)
);

export const selectSidebarOpen = createSelector(
  [selectUI],
  (ui) => ui.sidebarOpen
);

export const selectMobileMenuOpen = createSelector(
  [selectUI],
  (ui) => ui.mobileMenuOpen
);

export const selectChartDisplayOptions = createSelector(
  [selectUI],
  (ui) => ui.chartDisplayOptions
);

// Preference selectors (exported selector uses base selector)
export const selectPreferencesData = createSelector(
  [(state: RootState) => state.astrology.preferences],
  (prefs) => prefs
);

export const selectZodiacSystem = createSelector(
  [selectPreferencesData],
  (prefs) => prefs.zodiacSystem
);

export const selectZodiacFrame = createSelector(
  [selectPreferencesData],
  (prefs) => prefs.zodiacFrame
);

export const selectSignCount = createSelector(
  [selectPreferencesData],
  (prefs) => prefs.signCount
);

export const selectHouseSystem = createSelector(
  [selectPreferencesData],
  (prefs) => prefs.houseSystem
);

// Calculation selectors
export const selectCalculationStatus = createSelector(
  [selectCalculation],
  (calc) => calc.status
);

export const selectCalculationProgress = createSelector(
  [selectCalculation],
  (calc) => calc.progress
);

export const selectIsCalculating = createSelector(
  [selectCalculationStatus],
  (status) => status === 'calculating'
);

export const selectCalculationError = createSelector(
  [selectCalculation],
  (calc) => calc.error
);

// Current planetary positions
export const selectCurrentPlanetaryPositions = createSelector(
  [(state: RootState) => state.astrology.currentPlanetaryPositions],
  (positions) => positions
);

// Complex computed selectors
export interface ChartSummary {
  profile: AstroProfile | null;
  chart: NatalChart | null;
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
  dominantElement: Element | null;
  dominantModality: Modality | null;
  majorPatterns: string[];
}

export const selectChartSummary = createSelector(
  [
    selectSelectedProfile,
    selectSelectedProfileChart,
    selectSunSign,
    selectMoonSign,
    selectRisingSign,
    selectDominantElement,
    selectDominantModality,
    selectChartPatterns
  ],
  (
    profile,
    chart,
    sunSign,
    moonSign,
    risingSign,
    dominantElement,
    dominantModality,
    patterns
  ): ChartSummary => ({
    profile,
    chart,
    sunSign,
    moonSign,
    risingSign,
    dominantElement,
    dominantModality,
    majorPatterns: patterns.slice(0, 3).map(p => p.type)
  })
);

// Profile filtering
export const selectProfilesByElement = (element: Element) =>
  createSelector(
    [selectAllProfiles, selectAllCharts],
    (profiles, charts) => {
      return profiles.filter(profile => {
        const chart = charts.find(c => c.profileId === profile.id);
        return chart?.elementalBalance?.dominant === element;
      });
    }
  );

export const selectProfilesBySign = (sign: string) =>
  createSelector(
    [selectAllProfiles, selectAllCharts],
    (profiles, charts) => {
      return profiles.filter(profile => {
        const chart = charts.find(c => c.profileId === profile.id);
        return chart?.bodies.sun?.sign === sign;
      });
    }
  );
