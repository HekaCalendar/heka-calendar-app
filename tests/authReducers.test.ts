// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  setAuthState,
  setAuthenticated,
  setUnauthenticated,
  setSyncing,
  setSyncError,
  updateUserProfile,
  setLastSync,
  setProSubscription,
  addPurchasedProduct,
} from '../src/store/slices/reducers/authReducers';

function createAuthState(overrides = {}) {
  return {
    auth: {
      isAuthenticated: false,
      userId: null,
      email: null,
      displayName: null,
      photoURL: null,
      isSyncing: false,
      syncError: null,
      lastSync: null,
      ...overrides.auth,
    },
    subscription: {
      isPro: false,
      tier: null,
      expiryDate: null,
      purchasedProductIds: [],
      ...overrides.subscription,
    },
  };
}

describe('authReducers', () => {
  it('setAuthState merges partial auth', () => {
    const state = createAuthState({ auth: { isAuthenticated: false, userId: null } });
    setAuthState(state, { payload: { isAuthenticated: true, userId: 'u1' } });
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.userId).toBe('u1');
  });

  it('setAuthenticated sets all auth fields', () => {
    const state = createAuthState({});
    setAuthenticated(state, {
      payload: { userId: 'u1', email: 'test@example.com', displayName: 'Test', photoURL: 'http://pic' },
    });
    expect(state.auth.isAuthenticated).toBe(true);
    expect(state.auth.userId).toBe('u1');
    expect(state.auth.email).toBe('test@example.com');
    expect(state.auth.displayName).toBe('Test');
    expect(state.auth.photoURL).toBe('http://pic');
    expect(state.auth.syncError).toBeNull();
  });

  it('setAuthenticated grants admin pro for admin email', () => {
    const state = createAuthState({});
    setAuthenticated(state, {
      payload: { userId: 'u1', email: 'martinkhoury98@gmail.com', displayName: null, photoURL: null },
    });
    expect(state.subscription.isPro).toBe(true);
    expect(state.subscription.tier).toBe('yearly');
    expect(state.subscription.expiryDate).toBe('2099-12-31');
    expect(state.subscription.purchasedProductIds.length).toBeGreaterThan(0);
  });

  it('setAuthenticated does not grant pro for regular email', () => {
    const state = createAuthState({});
    setAuthenticated(state, {
      payload: { userId: 'u1', email: 'regular@gmail.com', displayName: null, photoURL: null },
    });
    expect(state.subscription.isPro).toBe(false);
  });

  it('setUnauthenticated clears auth', () => {
    const state = createAuthState({
      auth: { isAuthenticated: true, userId: 'u1', email: 'test@example.com', displayName: 'Test', photoURL: 'pic', lastSync: '2024-01-01' },
    });
    setUnauthenticated(state);
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.userId).toBeNull();
    expect(state.auth.email).toBeNull();
    expect(state.auth.lastSync).toBeNull();
  });

  it('setSyncing toggles sync state', () => {
    const state = createAuthState({});
    setSyncing(state, { payload: true });
    expect(state.auth.isSyncing).toBe(true);
    setSyncing(state, { payload: false });
    expect(state.auth.isSyncing).toBe(false);
  });

  it('setSyncError sets error string', () => {
    const state = createAuthState({});
    setSyncError(state, { payload: 'Connection failed' });
    expect(state.auth.syncError).toBe('Connection failed');
    setSyncError(state, { payload: null });
    expect(state.auth.syncError).toBeNull();
  });

  it('updateUserProfile updates specific fields', () => {
    const state = createAuthState({ auth: { userId: 'u1', email: 'old@test.com', displayName: 'Old', photoURL: 'old' } });
    updateUserProfile(state, { payload: { displayName: 'New', photoURL: 'new' } });
    expect(state.auth.displayName).toBe('New');
    expect(state.auth.photoURL).toBe('new');
    expect(state.auth.userId).toBe('u1');
    expect(state.auth.email).toBe('old@test.com');
  });

  it('updateUserProfile grants admin pro when email changes to admin', () => {
    const state = createAuthState({});
    updateUserProfile(state, { payload: { email: 'martinkhoury98@gmail.com' } });
    expect(state.subscription.isPro).toBe(true);
    expect(state.subscription.tier).toBe('yearly');
  });

  it('setLastSync updates lastSync', () => {
    const state = createAuthState({});
    setLastSync(state, { payload: '2024-06-15T12:00:00Z' });
    expect(state.auth.lastSync).toBe('2024-06-15T12:00:00Z');
  });

  it('setProSubscription updates subscription', () => {
    const state = createAuthState({});
    setProSubscription(state, { payload: { isPro: true, tier: 'yearly', expiryDate: '2025-01-01' } });
    expect(state.subscription.isPro).toBe(true);
    expect(state.subscription.tier).toBe('yearly');
    expect(state.subscription.expiryDate).toBe('2025-01-01');
  });

  it('setProSubscription without expiryDate keeps existing', () => {
    const state = createAuthState({ subscription: { expiryDate: '2025-01-01' } });
    setProSubscription(state, { payload: { isPro: true, tier: 'monthly' } });
    expect(state.subscription.expiryDate).toBe('2025-01-01');
  });

  it('addPurchasedProduct adds unique product', () => {
    const state = createAuthState({});
    addPurchasedProduct(state, { payload: 'product-1' });
    expect(state.subscription.purchasedProductIds).toContain('product-1');
  });

  it('addPurchasedProduct does not duplicate', () => {
    const state = createAuthState({ subscription: { purchasedProductIds: ['product-1'] } });
    addPurchasedProduct(state, { payload: 'product-1' });
    expect(state.subscription.purchasedProductIds).toHaveLength(1);
  });
});
