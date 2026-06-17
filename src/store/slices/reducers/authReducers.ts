/**
 * Auth & Subscription Reducers
 * Authentication state, user profile, pro subscription
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { CalendarState } from '../../../types';

export const setAuthState = (state: CalendarState, action: PayloadAction<Partial<CalendarState['auth']>>) => {
  state.auth = { ...state.auth, ...action.payload };
};

export const setAuthenticated = (state: CalendarState, action: PayloadAction<{
  userId: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}>) => {
  state.auth.isAuthenticated = true;
  state.auth.userId = action.payload.userId;
  state.auth.email = action.payload.email;
  state.auth.displayName = action.payload.displayName;
  state.auth.photoURL = action.payload.photoURL;
  state.auth.syncError = null;
};

export const setUnauthenticated = (state: CalendarState) => {
  state.auth.isAuthenticated = false;
  state.auth.userId = null;
  state.auth.email = null;
  state.auth.displayName = null;
  state.auth.photoURL = null;
  state.auth.lastSync = null;
};

export const setSyncing = (state: CalendarState, action: PayloadAction<boolean>) => {
  state.auth.isSyncing = action.payload;
};

export const setSyncError = (state: CalendarState, action: PayloadAction<string | null>) => {
  state.auth.syncError = action.payload;
};

export const updateUserProfile = (state: CalendarState, action: PayloadAction<{
  userId?: string;
  email?: string;
  displayName?: string | null;
  photoURL?: string | null;
}>) => {
  if (action.payload.userId !== undefined) state.auth.userId = action.payload.userId;
  if (action.payload.email !== undefined) {
    state.auth.email = action.payload.email;
  }
  if (action.payload.displayName !== undefined) state.auth.displayName = action.payload.displayName;
  if (action.payload.photoURL !== undefined) state.auth.photoURL = action.payload.photoURL;
};

export const setLastSync = (state: CalendarState, action: PayloadAction<string>) => {
  state.auth.lastSync = action.payload;
};

export const setProSubscription = (state: CalendarState, action: PayloadAction<{ isPro: boolean; tier: 'monthly' | 'yearly' | null; expiryDate?: string }>) => {
  state.subscription.isPro = action.payload.isPro;
  state.subscription.tier = action.payload.tier;
  if (action.payload.expiryDate) {
    state.subscription.expiryDate = action.payload.expiryDate;
  }
};

export const addPurchasedProduct = (state: CalendarState, action: PayloadAction<string>) => {
  if (!state.subscription.purchasedProductIds.includes(action.payload)) {
    state.subscription.purchasedProductIds.push(action.payload);
  }
};
