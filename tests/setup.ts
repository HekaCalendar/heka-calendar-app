// @ts-nocheck
/**
 * Vitest setup file — Foundation Infrastructure
 * Centralized mocking for all external dependencies.
 * Every test file benefits from the mocks defined here.
 */

import 'fake-indexeddb/auto';
import { vi } from 'vitest';

// ── Crypto Polyfills ─────────────────────────────────────────────────────────

// Ensure crypto.randomUUID is available in jsdom
if (!globalThis.crypto) {
  (globalThis as unknown as { crypto: object }).crypto = {};
}
if (!globalThis.crypto.randomUUID) {
  globalThis.crypto.randomUUID = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}` as `${string}-${string}-${string}-${string}-${string}`;
}

// Polyfill crypto.subtle for stateCrypto.ts and other crypto-dependent code
if (!globalThis.crypto.subtle) {
  const subtlePolyfill = {
    async generateKey(
      _algorithm: unknown,
      _extractable: boolean,
      _keyUsages: string[]
    ): Promise<{ type: string; extractable: boolean }> {
      return { type: 'secret', extractable: true };
    },
    async exportKey(_format: string, _key: unknown): Promise<ArrayBuffer> {
      return new ArrayBuffer(32);
    },
    async importKey(
      _format: string,
      _keyData: unknown,
      _algorithm: unknown,
      _extractable: boolean,
      _keyUsages: string[]
    ): Promise<{ type: string }> {
      return { type: 'secret' };
    },
    async encrypt(
      _algorithm: unknown,
      _key: unknown,
      _data: ArrayBuffer
    ): Promise<ArrayBuffer> {
      return _data; // pass-through for tests
    },
    async decrypt(
      _algorithm: unknown,
      _key: unknown,
      _data: ArrayBuffer
    ): Promise<ArrayBuffer> {
      return _data; // pass-through for tests
    },
  };
  (globalThis.crypto as unknown as { subtle: typeof subtlePolyfill }).subtle = subtlePolyfill;
}

// ── Navigator Stubs ──────────────────────────────────────────────────────────

if (typeof globalThis.navigator === 'undefined') {
  (globalThis as unknown as { navigator: object }).navigator = {};
}

// Geolocation stub
(globalThis.navigator as unknown as { geolocation?: object }).geolocation = {
  getCurrentPosition: vi.fn((success: (pos: unknown) => void) => {
    success({
      coords: { latitude: -33.8688, longitude: 151.2093, altitude: null },
      timestamp: Date.now(),
    });
  }),
  watchPosition: vi.fn(() => 0),
  clearWatch: vi.fn(),
};

// Permissions stub
(globalThis.navigator as unknown as { permissions?: object }).permissions = {
  query: vi.fn(() => Promise.resolve({ state: 'granted' })),
};

// ServiceWorker stub
(globalThis.navigator as unknown as { serviceWorker?: object }).serviceWorker = {
  register: vi.fn(() => Promise.resolve({ scope: '/' })),
  ready: Promise.resolve({}),
};

// ── Notification Stub ────────────────────────────────────────────────────────

(globalThis as unknown as { Notification: typeof Notification }).Notification = class MockNotification {
  static permission = 'default';
  static requestPermission = vi.fn(() => Promise.resolve('granted'));
  title = '';
  body = '';
  tag = '';
  constructor(title: string, _options?: unknown) {
    this.title = title;
  }
  close = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  onclick = null;
  onshow = null;
  onclose = null;
  onerror = null;
} as unknown as typeof Notification;

// ── Window.Capacitor Stub ────────────────────────────────────────────────────

(globalThis as unknown as { Capacitor?: object }).Capacitor = {
  isNativePlatform: vi.fn(() => false),
  getPlatform: vi.fn(() => 'web'),
  convertFileSrc: vi.fn((src: string) => src),
};

// ── Capacitor Plugin Mocks ───────────────────────────────────────────────────

vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
    removeAllListeners: vi.fn(),
    exitApp: vi.fn(),
    getInfo: vi.fn(() => Promise.resolve({ version: '1.0.0' })),
    getState: vi.fn(() => Promise.resolve({ isActive: true })),
    setBadgeCount: vi.fn(() => Promise.resolve()),
  },
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => false),
    getPlatform: vi.fn(() => 'web'),
    convertFileSrc: vi.fn((src: string) => src),
  },
  registerPlugin: vi.fn(() => ({
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
    removeAllListeners: vi.fn(),
  })),
}));

vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: {
    schedule: vi.fn(() => Promise.resolve({ notifications: [] })),
    cancel: vi.fn(() => Promise.resolve()),
    getPending: vi.fn(() => Promise.resolve({ notifications: [] })),
    registerActionTypes: vi.fn(() => Promise.resolve()),
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
    requestPermissions: vi.fn(() => Promise.resolve({ display: 'granted' })),
    checkPermissions: vi.fn(() => Promise.resolve({ display: 'granted' })),
  },
}));

vi.mock('@capacitor/push-notifications', () => ({
  PushNotifications: {
    register: vi.fn(() => Promise.resolve()),
    getDeliveredNotifications: vi.fn(() => Promise.resolve({ notifications: [] })),
    removeAllDeliveredNotifications: vi.fn(() => Promise.resolve()),
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
    requestPermissions: vi.fn(() => Promise.resolve({ receive: 'granted' })),
    checkPermissions: vi.fn(() => Promise.resolve({ receive: 'granted' })),
  },
}));

vi.mock('@capacitor/share', () => ({
  Share: {
    share: vi.fn(() => Promise.resolve({ activityType: 'copy' })),
    canShare: vi.fn(() => Promise.resolve({ value: true })),
  },
}));

vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: null })),
    createUserWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: null })),
    signOut: vi.fn(() => Promise.resolve()),
    getCurrentUser: vi.fn(() => Promise.resolve({ user: null })),
    addListener: vi.fn(() => Promise.resolve({ remove: vi.fn() })),
  },
}));

// ── Firebase SDK Mocks ───────────────────────────────────────────────────────

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: '[DEFAULT]' })),
  getApps: vi.fn(() => []),
  getApp: vi.fn(() => ({ name: '[DEFAULT]' })),
  deleteApp: vi.fn(() => Promise.resolve()),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
    onAuthStateChanged: vi.fn(() => vi.fn()),
    signOut: vi.fn(() => Promise.resolve()),
  })),
  createUserWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: 'test-user' } })),
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: 'test-user' } })),
  sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
  updateProfile: vi.fn(() => Promise.resolve()),
  onAuthStateChanged: vi.fn(() => vi.fn()),
  setPersistence: vi.fn(() => Promise.resolve()),
  browserLocalPersistence: 'LOCAL',
  getIdToken: vi.fn(() => Promise.resolve('mock-token')),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({
    type: 'firestore',
  })),
  doc: vi.fn(() => ({ path: 'users/test' })),
  setDoc: vi.fn(() => Promise.resolve()),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false, data: () => null })),
  deleteDoc: vi.fn(() => Promise.resolve()),
  collection: vi.fn(() => ({ path: 'users/test/items' })),
  getDocs: vi.fn(() => Promise.resolve({ docs: [], forEach: vi.fn() })),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  limit: vi.fn(() => ({})),
  enableIndexedDbPersistence: vi.fn(() => Promise.resolve()),
  writeBatch: vi.fn(() => ({
    set: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn(() => Promise.resolve()),
  })),
  updateDoc: vi.fn(() => Promise.resolve()),
  arrayUnion: vi.fn((...items: unknown[]) => items),
  arrayRemove: vi.fn((...items: unknown[]) => items),
  increment: vi.fn((n: number) => n),
  serverTimestamp: vi.fn(() => new Date().toISOString()),
  Timestamp: {
    fromDate: vi.fn((d: Date) => ({ seconds: Math.floor(d.getTime() / 1000), nanoseconds: 0 })),
    now: vi.fn(() => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 })),
  },
}));

vi.mock('firebase/messaging', () => ({
  getMessaging: vi.fn(() => ({})),
  getToken: vi.fn(() => Promise.resolve('mock-fcm-token')),
  onMessage: vi.fn(() => vi.fn()),
}));

// ── Swiss Ephemeris Fallback ─────────────────────────────────────────────────

// Force the astrology engine to use its built-in MockSwissEngine
// instead of trying to load WASM in the test environment.
import { reinitializeWithFallback } from '../src/astrology/services/swiss-ephemeris/engine';

beforeAll(async () => {
  await reinitializeWithFallback();
});

// ── Console Hygiene ──────────────────────────────────────────────────────────

// Suppress expected warnings during tests
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const msg = String(args[0] || '');
  // Filter out Firebase / Capacitor / WASM warnings in tests
  if (
    msg.includes('Firebase not configured') ||
    msg.includes('WASM') ||
    msg.includes('Capacitor') ||
    msg.includes('IndexedDB') ||
    msg.includes('fake-indexeddb')
  ) {
    return;
  }
  originalWarn(...args);
};
