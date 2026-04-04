/**
 * useProfile Hook
 * Profile management with persistence
 */

import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';

import type { AstroProfile, ProfileId, CreateProfileInput } from '../types';

import {
  selectSelectedProfile,
  selectAllProfiles,
  selectProfileCount,
  selectHasProfiles,
  selectIsLoading
} from '../store/selectors';

import {
  createProfile,
  deleteProfile,
  selectAndPersistProfile,
  updateProfilePreferences
} from '../store/thunks';

export interface UseProfileReturn {
  // Data
  profiles: AstroProfile[];
  selectedProfile: AstroProfile | null;
  profileCount: number;
  hasProfiles: boolean;
  
  // Loading states
  isCreating: boolean;
  isDeleting: boolean;
  isLoading: boolean;
  
  // Actions
  selectProfile: (id: ProfileId | null) => void;
  createProfile: (input: CreateProfileInput) => Promise<AstroProfile>;
  deleteProfile: (id: ProfileId) => Promise<void>;
  updatePreferences: (prefs: Partial<AstroProfile['preferences']>) => Promise<void>;
  refreshProfile: () => void;
}

export function useProfile(): UseProfileReturn {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const profiles = useSelector(selectAllProfiles);
  const selectedProfile = useSelector(selectSelectedProfile);
  const profileCount = useSelector(selectProfileCount);
  const hasProfiles = useSelector(selectHasProfiles);
  const isCreating = useSelector(selectIsLoading('createProfile'));
  const isDeleting = useSelector(selectIsLoading('deleteProfile'));
  const isLoading = useSelector(selectIsLoading('loadProfiles'));
  
  // Actions
  const selectProfile = useCallback((id: ProfileId | null) => {
    dispatch(selectAndPersistProfile(id));
  }, [dispatch]);
  
  const handleCreateProfile = useCallback(async (input: CreateProfileInput) => {
    const result = await dispatch(createProfile(input)).unwrap();
    return result;
  }, [dispatch]);
  
  const handleDeleteProfile = useCallback(async (id: ProfileId) => {
    await dispatch(deleteProfile(id)).unwrap();
  }, [dispatch]);
  
  const updatePreferences = useCallback(async (prefs: Partial<AstroProfile['preferences']>) => {
    if (!selectedProfile) return;
    await dispatch(updateProfilePreferences({ 
      profileId: selectedProfile.id, 
      preferences: prefs 
    })).unwrap();
  }, [dispatch, selectedProfile]);
  
  const refreshProfile = useCallback(() => {
    if (selectedProfile) {
      dispatch(selectAndPersistProfile(selectedProfile.id));
    }
  }, [dispatch, selectedProfile]);
  
  return {
    profiles,
    selectedProfile,
    profileCount,
    hasProfiles,
    isCreating,
    isDeleting,
    isLoading,
    selectProfile,
    createProfile: handleCreateProfile,
    deleteProfile: handleDeleteProfile,
    updatePreferences,
    refreshProfile
  };
}

export default useProfile;
