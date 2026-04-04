/**
 * Astrology Thunks
 * Async actions for calculations and persistence
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { 
  AstroProfile, 
  NatalChart, 
  ProfileId, 
  ChartParams,
  CreateProfileInput
} from '../types';

import {
  generateNatalChart,
  initializeSwissEphemeris,
  calculateAllPlanets,
  calculateJulianDay
} from '../services/swiss-ephemeris/engine';

import { calculateAspects } from '../services/calculations/aspects';
import { detectPatterns } from '../services/calculations/patterns';
import { 
  persistence, 
  createProfileId,
  DEFAULT_PROFILE_PREFERENCES 
} from '../services/persistence';

import {
  setProfiles,
  addProfile as addProfileAction,
  removeProfile as removeProfileAction,
  setLoading,
  setError,
  setCalculationStatus,
  setCalculationProgress,
  selectProfile,
  addChart,
  setPreferences,
  setCurrentPlanetaryPositions
} from './slice';

// Initialize astrology system
export const initializeAstrology = createAsyncThunk(
  'astrology/initialize',
  async (_, { dispatch }) => {
    dispatch(setLoading({ key: 'initialization', loading: true }));
    
    try {
      // Initialize Swiss Ephemeris
      await initializeSwissEphemeris();
      
      // Load persisted data
      await persistence.migrateIfNeeded();
      
      const profiles = await persistence.getAllProfiles();
      dispatch(setProfiles(profiles));
      
      const selectedId = await persistence.getSelectedProfile();
      if (selectedId && profiles.find(p => p.id === selectedId)) {
        dispatch(selectProfile(selectedId));
      }
      
      const prefs = await persistence.getPreferences();
      if (prefs) {
        dispatch(setPreferences(prefs));
      }
      
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Initialization failed';
      dispatch(setError({ key: 'initialization', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'initialization', loading: false }));
    }
  }
);

// Create profile
export const createProfile = createAsyncThunk(
  'astrology/createProfile',
  async (input: CreateProfileInput, { dispatch }) => {
    dispatch(setLoading({ key: 'createProfile', loading: true }));
    
    try {
      const now = Date.now() as unknown as import('../types').Timestamp;
      const profile: AstroProfile = {
        id: createProfileId() as ProfileId,
        name: input.name,
        birthData: input.birthData,
        notes: input.notes,
        tags: input.tags || [],
        createdAt: now,
        updatedAt: now,
        preferences: {
          ...DEFAULT_PROFILE_PREFERENCES,
          ...input.preferences
        },
        chartIds: []
      };
      
      // Save to persistence
      await persistence.saveProfile(profile);
      
      // Update state
      dispatch(addProfileAction(profile));
      dispatch(selectProfile(profile.id));
      
      // Generate chart for profile
      await dispatch(generateChartForProfile(profile.id));
      
      return profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create profile';
      dispatch(setError({ key: 'createProfile', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'createProfile', loading: false }));
    }
  }
);

// Delete profile
export const deleteProfile = createAsyncThunk(
  'astrology/deleteProfile',
  async (profileId: ProfileId, { dispatch }) => {
    dispatch(setLoading({ key: 'deleteProfile', loading: true }));
    
    try {
      await persistence.deleteProfile(profileId);
      dispatch(removeProfileAction(profileId));
      return profileId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete profile';
      dispatch(setError({ key: 'deleteProfile', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'deleteProfile', loading: false }));
    }
  }
);

// Generate chart for profile
export const generateChartForProfile = createAsyncThunk(
  'astrology/generateChart',
  async (profileId: ProfileId, { dispatch, getState }) => {
    const state = getState() as RootState;
    const profile = state.astrology.entities.profiles[profileId];
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    dispatch(setLoading({ key: 'generateChart', loading: true }));
    dispatch(setCalculationStatus('calculating'));
    dispatch(setCalculationProgress(0));
    
    try {
      // Use global zodiac system preference from calendar state
      const globalZodiacSystem = state.calendar.astroPreferences?.zodiacSystem || '12-sign';
      
      // Generate base chart
      const params: ChartParams = {
        profileId,
        birthData: profile.birthData,
        zodiacSystem: globalZodiacSystem,
        houseSystem: profile.preferences.houseSystem
      };
      
      dispatch(setCalculationProgress(20));
      
      let chart = await generateNatalChart(params);
      
      dispatch(setCalculationProgress(60));
      
      // Calculate aspects
      const aspects = calculateAspects(chart.bodies, {
        includeMinorAspects: profile.preferences.showMinorAspects
      });
      
      dispatch(setCalculationProgress(80));
      
      // Detect patterns
      const patterns = detectPatterns(chart.bodies, aspects);
      
      // Complete chart
      const completeChart: NatalChart = {
        ...chart,
        aspects,
        patterns
      } as unknown as NatalChart;
      
      dispatch(setCalculationProgress(100));
      
      // Save to persistence
      await persistence.saveChart(completeChart);
      
      // Update state
      dispatch(addChart(completeChart));
      dispatch(setCalculationStatus('complete'));
      
      return completeChart;
    } catch (error) {
      dispatch(setCalculationStatus('error'));
      const message = error instanceof Error ? error.message : 'Chart calculation failed';
      dispatch(setError({ key: 'generateChart', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'generateChart', loading: false }));
    }
  }
);

// Update profile preferences
export const updateProfilePreferences = createAsyncThunk(
  'astrology/updatePreferences',
  async (
    { profileId, preferences }: { profileId: ProfileId; preferences: Partial<AstroProfile['preferences']> },
    { dispatch, getState }
  ) => {
    const state = getState() as RootState;
    const profile = state.astrology.entities.profiles[profileId];
    
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    const updatedProfile: AstroProfile = {
      ...profile,
      preferences: { ...profile.preferences, ...preferences },
      updatedAt: Date.now() as unknown as import('../types').Timestamp
    };
    
    await persistence.saveProfile(updatedProfile);
    dispatch(addProfileAction(updatedProfile));
    
    // Regenerate chart if zodiac or house system changed
    if (preferences.zodiacSystem || preferences.houseSystem) {
      await dispatch(generateChartForProfile(profileId));
    }
    
    return updatedProfile;
  }
);

// Load all profiles
export const loadProfiles = createAsyncThunk(
  'astrology/loadProfiles',
  async (_, { dispatch }) => {
    dispatch(setLoading({ key: 'loadProfiles', loading: true }));
    
    try {
      const profiles = await persistence.getAllProfiles();
      dispatch(setProfiles(profiles));
      
      // Load charts for profiles
      const charts = await persistence.getAllProfiles().then(profiles =>
        Promise.all(profiles.map(p => persistence.getChartsForProfile(p.id)))
      ).then(chartArrays => chartArrays.flat());
      
      return { profiles, charts };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load profiles';
      dispatch(setError({ key: 'loadProfiles', error: message }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'loadProfiles', loading: false }));
    }
  }
);

// Update current planetary positions
export const updateCurrentPlanetaryPositions = createAsyncThunk(
  'astrology/updateCurrentPositions',
  async (_, { dispatch }) => {
    try {
      const now = new Date();
      const jd = calculateJulianDay(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes()
      );
      
      const positions = calculateAllPlanets(jd, [
        'sun', 'moon', 'mercury', 'venus', 'mars',
        'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'
      ]);
      
      const simplified: Record<string, { longitude: number; sign: import('../types').ZodiacSign; speed: number }> = {};
      
      for (const [id, body] of Object.entries(positions as any)) {
        simplified[id] = {
          longitude: (body as any).longitude,
          sign: (body as any).sign as import('../types').ZodiacSign,
          speed: (body as any).speed
        };
      }
      
      dispatch(setCurrentPlanetaryPositions(simplified));
      return simplified;
    } catch (error) {
      console.error('Failed to update planetary positions:', error);
      throw error;
    }
  }
);

// Select profile and persist selection
export const selectAndPersistProfile = createAsyncThunk(
  'astrology/selectAndPersist',
  async (profileId: ProfileId | null, { dispatch }) => {
    await persistence.setSelectedProfile(profileId);
    dispatch(selectProfile(profileId));
    return profileId;
  }
);

// Export all thunks
export const thunks = {
  initializeAstrology,
  createProfile,
  deleteProfile,
  generateChartForProfile,
  updateProfilePreferences,
  loadProfiles,
  updateCurrentPlanetaryPositions,
  selectAndPersistProfile
};
