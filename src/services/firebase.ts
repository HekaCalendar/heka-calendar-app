/**
 * Firebase Configuration and Initialization
 * Centralized Firebase setup for Auth and Firestore
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
  type UserCredential
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  enableIndexedDbPersistence
} from 'firebase/firestore';

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
let app: any = null;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Enable offline persistence for Firestore (works on web)
    if (typeof window !== 'undefined' && db) {
      enableIndexedDbPersistence(db).catch((err: any) => {
        if (err.code === 'failed-precondition') {
          console.warn('Firebase persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
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

export { auth, db, updateProfile };

// ============================================================================
// Authentication Functions
// ============================================================================

export interface AuthError {
  code: string;
  message: string;
}

// Error for when Firebase is not configured
const NOT_CONFIGURED_ERROR: AuthError = {
  code: 'auth/not-configured',
  message: 'Cloud sync is not configured. Please set up Firebase to enable account features.'
};

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
  } catch (error: any) {
    throw formatAuthError(error);
  }
}

export async function logIn(email: string, password: string): Promise<UserCredential> {
  if (!isFirebaseConfigured() || !auth) {
    throw NOT_CONFIGURED_ERROR;
  }
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw formatAuthError(error);
  }
}

export async function logOut(): Promise<void> {
  if (!isFirebaseConfigured() || !auth) {
    return;
  }
  try {
    await signOut(auth);
  } catch (error: any) {
    throw formatAuthError(error);
  }
}

export async function resetPassword(email: string): Promise<void> {
  if (!isFirebaseConfigured() || !auth) {
    throw NOT_CONFIGURED_ERROR;
  }
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
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
  notes: Record<string, any>;
  statistics: any;
  settings: {
    theme: string;
    font: string;
    location: string;
    subRegion: string | null;
    timeMode: string;
    display: any;
  };
  lastSync: string;
  // Diary system
  diaryEntries?: Record<string, any>;
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
// Helper Functions
// ============================================================================

function formatAuthError(error: any): AuthError {
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

  return {
    code: error.code || 'auth/unknown',
    message: errorMessages[error.code] || error.message || 'An unexpected error occurred'
  };
}
