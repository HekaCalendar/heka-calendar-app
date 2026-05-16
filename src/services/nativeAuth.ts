/**
 * Native Authentication Service
 * Bridges Capacitor Firebase Authentication plugin with Firebase JS SDK.
 *
 * Flow:
 * 1. Plugin triggers native OAuth (Google Sign-In via Play Services)
 * 2. Plugin returns OAuth tokens (idToken + accessToken)
 * 3. We create a Firebase JS credential from those tokens
 * 4. We sign in via Firebase JS SDK → web auth state is correct immediately
 * 5. Firestore rules work because JS SDK is authenticated
 */

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  type UserCredential,
} from 'firebase/auth';
import { isFirebaseConfigured } from './firebase';

export class NativeAuthError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'NativeAuthError';
  }
}

/**
 * Sign in with Google using the native Android/iOS SDK.
 * Returns a Firebase JS UserCredential so the web layer is immediately authenticated.
 */
export async function signInWithGoogleNative(): Promise<UserCredential> {
  if (!isFirebaseConfigured()) {
    throw new NativeAuthError('Firebase is not configured');
  }

  const auth = getAuth();
  if (!auth) {
    throw new NativeAuthError('Firebase Auth not initialized');
  }

  try {
    // Trigger native Google Sign-In (Play Services on Android)
    const result = await FirebaseAuthentication.signInWithGoogle();

    if (!result.credential) {
      throw new NativeAuthError('Google Sign-In did not return credentials');
    }

    // Build a Firebase JS credential from the native OAuth tokens
    const googleCredential = GoogleAuthProvider.credential(
      result.credential.idToken,
      result.credential.accessToken
    );

    // Sign in via Firebase JS SDK — this makes the web layer authenticated
    const userCredential = await signInWithCredential(auth, googleCredential);

    return userCredential;
  } catch (error: any) {
    // Map common plugin errors to friendly messages
    if (error.code === '10' || error.message?.includes('DEVELOPER_ERROR')) {
      throw new NativeAuthError(
        'Google Sign-In configuration error. Please ensure the SHA-1 fingerprint is added to Firebase Console.',
        'auth/configuration-error'
      );
    }
    if (error.code === '16' || error.message?.includes('CANCELED')) {
      throw new NativeAuthError('Sign in was cancelled', 'auth/cancelled');
    }
    throw new NativeAuthError(
      error.message || 'Google Sign-In failed',
      error.code
    );
  }
}

/**
 * Sign out from both native and web auth layers.
 */
export async function signOutNative(): Promise<void> {
  try {
    await FirebaseAuthentication.signOut();
  } catch {
    // Ignore native sign-out errors — web sign-out is what matters
  }

  if (isFirebaseConfigured()) {
    const auth = getAuth();
    if (auth && auth.currentUser) {
      await signOut(auth);
    }
  }
}

/**
 * Check if native Google Sign-In is available on this device.
 * (Always true on Android with Play Services, false on some emulators or devices without Google services)
 */
export async function isGoogleSignInAvailable(): Promise<boolean> {
  try {
    // On web, the plugin falls back to web-based Google Sign-In
    // On Android, it uses Play Services
    // We just check that the plugin loads without error
    await FirebaseAuthentication.getCurrentUser();
    return true;
  } catch {
    return false;
  }
}
