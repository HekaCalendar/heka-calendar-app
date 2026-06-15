/**
 * Firebase Configuration and Initialization
 * Centralized Firebase setup for Auth and Firestore
 */

import { initializeApp, getApps, getApp, deleteApp, type FirebaseApp } from 'firebase/app';
import { Capacitor } from '@capacitor/core';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User,
  type UserCredential
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  enableIndexedDbPersistence,
  type Firestore
} from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';

// Firebase configuration - Replace with your Firebase project config
// Create a .env file with your Firebase config:
// VITE_FIREBASE_API_KEY=your_api_key
// VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
// VITE_FIREBASE_PROJECT_ID=your_project_id
// VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
// VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
// VITE_FIREBASE_APP_ID=your_app_id

// Firebase configuration - Uses environment variables for security
// Values are injected at build time from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if Firebase is properly configured
export function isFirebaseConfigured(): boolean {
  return !!firebaseConfig.apiKey && 
         !!firebaseConfig.projectId && 
         firebaseConfig.apiKey !== 'your_api_key' &&
         !firebaseConfig.apiKey.includes('placeholder');
}

// Initialize Firebase only if configured (singleton pattern)
let app: FirebaseApp | null = null;
let auth: any = null;
let db: any = null;
let functions: Functions | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
    
    // Force browser local persistence for Auth (more reliable in Capacitor WebView)
    if (typeof window !== 'undefined' && auth) {
      setPersistence(auth, browserLocalPersistence).catch((err: unknown) => {
        console.warn('Firebase auth persistence failed:', err);
      });
    }
    
    // Enable offline persistence for Firestore (works on web, skip on Capacitor to avoid auth desync)
    if (typeof window !== 'undefined' && db && !Capacitor.isNativePlatform()) {
      enableIndexedDbPersistence(db).catch((err: unknown) => {
        const code = (err as { code?: string })?.code;
        if (code === 'failed-precondition') {
          console.warn('Firebase persistence failed: Multiple tabs open');
        } else if (code === 'unimplemented') {
          console.warn('Firebase persistence not available in this browser');
        }
      });
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
} else {
  console.warn('Firebase not configured. Cloud sync features will be disabled.');
}

export { app, auth, db, functions, updateProfile };

// Refresh the Firebase ID token (useful when Firestore reports permission errors)
export async function refreshAuthToken(force = true): Promise<string | null> {
  if (!auth || !auth.currentUser) return null;
  try {
    const { getIdToken } = await import('firebase/auth');
    return await getIdToken(auth.currentUser, force);
  } catch (err) {
    console.error('Failed to refresh auth token:', err);
    return null;
  }
}

// Create a completely fresh Firestore instance via a temporary Firebase app.
// Use this when the singleton Firestore connection seems poisoned (e.g. permission-denied with valid auth).
export async function withTemporaryFirestore<T>(fn: (tempDb: Firestore) => Promise<T>): Promise<T> {
  if (!isFirebaseConfigured()) throw new Error('Firebase not configured');
  const tempApp = initializeApp(firebaseConfig, 'temp_' + Date.now());
  const { getFirestore } = await import('firebase/firestore');
  const tempDb = getFirestore(tempApp);
  try {
    return await fn(tempDb);
  } finally {
    try {
      await deleteApp(tempApp);
    } catch {
      // ignore cleanup errors
    }
  }
}

// ============================================================================
// Authentication Functions
// ============================================================================

export interface AuthError {
  code: string;
  message: string;
}

/** Proper Error subclass so console.error prints a message instead of [object Object] */
export class FirebaseNotConfiguredError extends Error implements AuthError {
  code: string;
  constructor(
    message = 'Cloud sync is not configured. Please set up Firebase to enable account features.',
    code = 'auth/not-configured'
  ) {
    super(message);
    this.name = 'FirebaseNotConfiguredError';
    this.code = code;
  }
}

// Error for when Firebase is not configured
const NOT_CONFIGURED_ERROR = new FirebaseNotConfiguredError();

export async function signUp(email: string, password: string, displayName: string): Promise<UserCredential> {
  if (!isFirebaseConfigured() || !auth) {
    throw NOT_CONFIGURED_ERROR;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential;
  } catch (error: unknown) {
    throw formatAuthError(error);
  }
}

export async function logIn(email: string, password: string): Promise<UserCredential> {
  if (!isFirebaseConfigured() || !auth) {
    throw NOT_CONFIGURED_ERROR;
  }
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    throw formatAuthError(error);
  }
}

export async function logOut(): Promise<void> {
  if (!isFirebaseConfigured() || !auth) {
    return;
  }
  try {
    await signOut(auth);
  } catch (error: unknown) {
    throw formatAuthError(error);
  }
}

export async function resetPassword(email: string): Promise<void> {
  if (!isFirebaseConfigured() || !auth) {
    throw NOT_CONFIGURED_ERROR;
  }
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: unknown) {
    throw formatAuthError(error);
  }
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured() || !auth) {
    // Return a no-op unsubscribe function
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  if (!isFirebaseConfigured() || !auth) {
    return null;
  }
  return auth.currentUser;
}

// ============================================================================
// Firestore Sync Functions
// ============================================================================

export interface UserData {
  notes: Record<string, unknown>;
  statistics: unknown;
  settings: {
    theme: string;
    font: string;
    location: string;
    subRegion: string | null;
    timeMode: string;
    display: unknown;
  };
  lastSync: string;
  // Diary system
  diaryEntries?: unknown;
  deletedDiaryEntries?: string[];
}

export async function syncToCloud(userId: string, data: Partial<UserData>): Promise<void> {
  if (!isFirebaseConfigured() || !db) {
    throw NOT_CONFIGURED_ERROR;
  }
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    lastSync: new Date().toISOString()
  }, { merge: true });
}

export async function loadFromCloud(userId: string): Promise<UserData | null> {
  if (!isFirebaseConfigured() || !db) {
    throw NOT_CONFIGURED_ERROR;
  }
  const userRef = doc(db, 'users', userId);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return snapshot.data() as UserData;
  }
  return null;
}

// ============================================================================
// Astrology Cloud Sync — Subcollections
// ============================================================================

export interface AstroCloudData {
  profiles: Record<string, unknown>;
  charts: Record<string, unknown>;
  preferences: Record<string, unknown>;
  selectedProfileId: string | null;
  lastSync: string;
}

/** Sync a single astrology profile to the cloud */
export async function syncAstroProfile(userId: string, profile: unknown): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  const p = profile as Record<string, unknown>;
  const ref = doc(db, 'users', userId, 'astroProfiles', p.id as string);
  await setDoc(ref, { ...p, _syncedAt: new Date().toISOString() });
}

/** Delete an astrology profile from the cloud */
export async function deleteAstroProfile(userId: string, profileId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  const ref = doc(db, 'users', userId, 'astroProfiles', profileId);
  await deleteDoc(ref);
  // Also delete associated charts
  const chartsCol = collection(db, 'users', userId, 'astroCharts');
  const chartsSnap = await getDocs(chartsCol);
  const deletions: Promise<void>[] = [];
  chartsSnap.forEach((snap) => {
    if (snap.data().profileId === profileId) {
      deletions.push(deleteDoc(snap.ref));
    }
  });
  await Promise.all(deletions);
}

/** Load all astrology profiles from the cloud */
export async function loadAstroProfiles(userId: string): Promise<unknown[]> {
  if (!isFirebaseConfigured() || !db) return [];
  const col = collection(db, 'users', userId, 'astroProfiles');
  const snap = await getDocs(col);
  return snap.docs.map(d => d.data());
}

/** Sync a single astrology chart to the cloud */
export async function syncAstroChart(userId: string, chart: unknown): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  const c = chart as Record<string, unknown>;
  const ref = doc(db, 'users', userId, 'astroCharts', c.id as string);
  await setDoc(ref, { ...c, _syncedAt: new Date().toISOString() });
}

/** Load all astrology charts from the cloud */
export async function loadAstroCharts(userId: string): Promise<unknown[]> {
  if (!isFirebaseConfigured() || !db) return [];
  const col = collection(db, 'users', userId, 'astroCharts');
  const snap = await getDocs(col);
  return snap.docs.map(d => d.data());
}

/** Sync astrology preferences to the cloud */
export async function syncAstroPreferences(userId: string, preferences: unknown): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  const ref = doc(db, 'users', userId, 'astroPreferences', 'default');
  await setDoc(ref, { ...(preferences as Record<string, unknown>), _syncedAt: new Date().toISOString() });
}

/** Load astrology preferences from the cloud */
export async function loadAstroPreferences(userId: string): Promise<unknown | null> {
  if (!isFirebaseConfigured() || !db) return null;
  const ref = doc(db, 'users', userId, 'astroPreferences', 'default');
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/** Full astrology sync — push everything to cloud */
export async function syncAllAstroData(
  userId: string,
  data: { profiles: unknown[]; charts: unknown[]; preferences: unknown; selectedProfileId: string | null }
): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  await Promise.all([
    ...data.profiles.map(p => syncAstroProfile(userId, p)),
    ...data.charts.map(c => syncAstroChart(userId, c)),
    syncAstroPreferences(userId, data.preferences),
  ]);
  // Also store selected profile id on the user doc for quick lookup
  await setDoc(doc(db, 'users', userId), {
    astroSelectedProfileId: data.selectedProfileId,
    astroLastSync: new Date().toISOString(),
  }, { merge: true });
}

/** Full astrology load — pull everything from cloud */
export async function loadAllAstroData(userId: string): Promise<{
  profiles: unknown[];
  charts: unknown[];
  preferences: unknown | null;
  selectedProfileId: string | null;
}> {
  if (!isFirebaseConfigured() || !db) {
    return { profiles: [], charts: [], preferences: null, selectedProfileId: null };
  }
  const [profiles, charts, preferences, userSnap] = await Promise.all([
    loadAstroProfiles(userId),
    loadAstroCharts(userId),
    loadAstroPreferences(userId),
    getDoc(doc(db, 'users', userId)),
  ]);
  const userData = userSnap.exists() ? userSnap.data() : {};
  return {
    profiles,
    charts,
    preferences,
    selectedProfileId: userData.astroSelectedProfileId || null,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatAuthError(error: unknown): AuthError {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address format',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'An account already exists with this email',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
  };

  if (error && typeof error === 'object') {
    const code = (error as { code?: string }).code || 'auth/unknown';
    const message = (error as { message?: string }).message || 'An unexpected error occurred';
    return {
      code,
      message: errorMessages[code] || message,
    };
  }

  return {
    code: 'auth/unknown',
    message: 'An unexpected error occurred',
  };
}
