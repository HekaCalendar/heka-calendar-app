/**
 * Astrology Redux Slice
 * Normalized state management for astrology data
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  AstroProfile,
  ProfileId,
  NatalChart,
  ChartId,
  ProfilePreferences,
  CalculationState,
  ZodiacSign
} from '../types';
import type { TimeMode } from '../../types';

// View types
export type AstrologyView = 
  | 'profiles' 
  | 'chart' 
  | 'houses' 
  | 'planets' 
  | 'aspects' 
  | 'transits'
  | 'patterns';

// UI State
interface UIState {
  selectedProfileId: ProfileId | null;
  activeView: AstrologyView;
  expandedSections: Record<string, boolean>;
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  chartDisplayOptions: {
    showAspects: boolean;
    showHouses: boolean;
    showPatterns: boolean;
    highlightedHouse: number | null;
    highlightedPlanet: string | null;
  };
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
}

// Entity State (normalized)
interface EntityState {
  profiles: Record<ProfileId, AstroProfile>;
  charts: Record<ChartId, NatalChart>;
}

// Main State
export interface AstrologyState {
  entities: EntityState;
  ui: UIState;
  preferences: ProfilePreferences;
  calculation: CalculationState;
  currentPlanetaryPositions: Record<string, { longitude: number; sign: ZodiacSign; speed: number }> | null;
}

// Default preferences
const DEFAULT_PREFERENCES: ProfilePreferences = {
  zodiacSystem: '12-sign',
  zodiacFrame: 'tropical',
  signCount: 12,
  houseSystem: 'placidus',
  showAspects: true,
  showMinorAspects: false,
  showRetrogrades: true,
  showDignities: false,
  defaultChartView: 'wheel',
  ayanamsa: null,
  showNakshatras: false,
  nakshatraSystem: 'none',
};

// Initial state
const initialState: AstrologyState = {
  entities: {
    profiles: {},
    charts: {}
  },
  ui: {
    selectedProfileId: null,
    activeView: 'profiles',
    expandedSections: {
      chart: true,
      houses: false,
      planets: false,
      aspects: false,
      transits: false,
      patterns: false
    },
    loading: {},
    errors: {},
    chartDisplayOptions: {
      showAspects: true,
      showHouses: true,
      showPatterns: true,
      highlightedHouse: null,
      highlightedPlanet: null
    },
    sidebarOpen: true,
    mobileMenuOpen: false
  },
  preferences: DEFAULT_PREFERENCES,
  calculation: {
    status: 'idle',
    progress: 0
  },
  currentPlanetaryPositions: null
};

// Slice
const astrologySlice = createSlice({
  name: 'astrology',
  initialState,
  reducers: {
    // Profile actions
    addProfile: (state, action: PayloadAction<AstroProfile>) => {
      const profile = action.payload as AstroProfile;
      state.entities.profiles[profile.id] = profile as AstroProfile;
    },
    
    updateProfile: (state, action: PayloadAction<Partial<AstroProfile> & { id: ProfileId }>) => {
      const { id, ...updates } = action.payload;
      const profile = state.entities.profiles[id];
      if (profile) {
        state.entities.profiles[id] = { ...profile, ...updates } as AstroProfile;
      }
    },
    
    removeProfile: (state, action: PayloadAction<ProfileId>) => {
      const id = action.payload;
      delete state.entities.profiles[id];
      
      // Remove associated charts
      Object.keys(state.entities.charts).forEach(chartId => {
        if (state.entities.charts[chartId as ChartId].profileId === id) {
          delete state.entities.charts[chartId as ChartId];
        }
      });
      
      // Clear selection if needed
      if (state.ui.selectedProfileId === id) {
        state.ui.selectedProfileId = null;
      }
    },
    
    setProfiles: (state, action: PayloadAction<AstroProfile[]>) => {
      state.entities.profiles = {};
      action.payload.forEach(profile => {
        state.entities.profiles[profile.id] = profile;
      });
    },
    
    // Chart actions
    addChart: (state, action: PayloadAction<NatalChart>) => {
      const chart = action.payload;
      state.entities.charts[chart.id] = chart as NatalChart;
    },
    
    removeChart: (state, action: PayloadAction<ChartId>) => {
      delete state.entities.charts[action.payload];
    },
    
    setCharts: (state, action: PayloadAction<NatalChart[]>) => {
      state.entities.charts = {};
      action.payload.forEach(chart => {
        state.entities.charts[chart.id] = chart as NatalChart;
      });
    },
    
    // UI actions
    selectProfile: (state, action: PayloadAction<ProfileId | null>) => {
      state.ui.selectedProfileId = action.payload;
      if (action.payload) {
        state.ui.activeView = 'chart';
        state.ui.expandedSections.chart = true;
      }
    },
    
    setActiveView: (state, action: PayloadAction<AstrologyView>) => {
      state.ui.activeView = action.payload;
    },
    
    toggleSection: (state, action: PayloadAction<string>) => {
      const section = action.payload;
      state.ui.expandedSections[section] = !state.ui.expandedSections[section];
    },
    
    setSectionExpanded: (state, action: PayloadAction<{ section: string; expanded: boolean }>) => {
      state.ui.expandedSections[action.payload.section] = action.payload.expanded;
    },
    
    setLoading: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.ui.loading[action.payload.key] = action.payload.loading;
    },
    
    setError: (state, action: PayloadAction<{ key: string; error: string | null }>) => {
      state.ui.errors[action.payload.key] = action.payload.error;
    },
    
    clearErrors: (state) => {
      state.ui.errors = {};
    },
    
    toggleSidebar: (state) => {
      state.ui.sidebarOpen = !state.ui.sidebarOpen;
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.ui.sidebarOpen = action.payload;
    },
    
    toggleMobileMenu: (state) => {
      state.ui.mobileMenuOpen = !state.ui.mobileMenuOpen;
    },
    
    // Chart display options
    setChartDisplayOption: (
      state, 
      action: PayloadAction<{ option: keyof AstrologyState['ui']['chartDisplayOptions']; value: unknown }>
    ) => {
      (state.ui.chartDisplayOptions as Record<string, unknown>)[action.payload.option] = action.payload.value;
    },
    
    resetChartDisplayOptions: (state) => {
      state.ui.chartDisplayOptions = initialState.ui.chartDisplayOptions;
    },
    
    // Preferences
    setPreferences: (state, action: PayloadAction<Partial<ProfilePreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },

    resetPreferences: (state) => {
      state.preferences = DEFAULT_PREFERENCES;
    },

    /**
     * Apply mode-driven celestial defaults.
     * Called when the user switches between SYNC and TRUE calendar modes.
     * SYNC  = tropical, Placidus, no Nakshatras
     * TRUE  = sidereal, whole-sign, Lahiri, Nakshatras visible
     *
     * NOTE: Only updates GLOBAL preferences, not per-profile preferences.
     * Per-profile preferences should not be overwritten by mode switches —
     * users may intentionally want different zodiac systems per profile.
     */
    applyModeDefaults: (state, action: PayloadAction<TimeMode>) => {
      const mode = action.payload;
      state.preferences = mode === 'TRUE'
        ? {
            ...state.preferences,
            zodiacSystem: 'sidereal',
            zodiacFrame: 'sidereal',
            signCount: 13,
            houseSystem: 'whole-sign',
            ayanamsa: 'lahiri',
            showNakshatras: true,
            nakshatraSystem: 'vedic-27',
            showDignities: true,
          }
        : {
            ...state.preferences,
            zodiacSystem: '12-sign',
            zodiacFrame: 'tropical',
            signCount: 12,
            houseSystem: 'placidus',
            ayanamsa: null,
            showNakshatras: false,
            nakshatraSystem: 'none',
            showDignities: false,
          };
    },
    
    // Calculation state
    setCalculationStatus: (state, action: PayloadAction<CalculationState['status']>) => {
      state.calculation.status = action.payload;
    },
    
    setCalculationProgress: (state, action: PayloadAction<number>) => {
      state.calculation.progress = action.payload;
    },
    
    setCalculationError: (state, action: PayloadAction<CalculationState['error']>) => {
      state.calculation.error = action.payload;
    },
    
    // Current planetary positions
    setCurrentPlanetaryPositions: (state, action: PayloadAction<AstrologyState['currentPlanetaryPositions']>) => {
      state.currentPlanetaryPositions = action.payload;
    },
    
    // Reset
    resetAstrologyState: () => initialState
  }
});

// Export actions
export const {
  addProfile,
  updateProfile,
  removeProfile,
  setProfiles,
  addChart,
  removeChart,
  setCharts,
  selectProfile,
  setActiveView,
  toggleSection,
  setSectionExpanded,
  setLoading,
  setError,
  clearErrors,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setChartDisplayOption,
  resetChartDisplayOptions,
  setPreferences,
  resetPreferences,
  applyModeDefaults,
  setCalculationStatus,
  setCalculationProgress,
  setCalculationError,
  setCurrentPlanetaryPositions,
  resetAstrologyState
} = astrologySlice.actions;

// Export reducer
export default astrologySlice.reducer;
