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
import { getErrorMessage, getErrorCode } from '../utils/errorUtils';
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
    // useCredentialManager: false uses the legacy GoogleSignInClient which reliably
    // shows the account picker/creation dialog instead of failing silently.
    const result = await FirebaseAuthentication.signInWithGoogle({ useCredentialManager: false });

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
  } catch (error) {
    // Map common plugin errors to friendly messages
    if (getErrorCode(error) === '10' || getErrorMessage(error).includes('DEVELOPER_ERROR')) {
      throw new NativeAuthError(
        'Google Sign-In: SHA-1 fingerprint not registered in Firebase Console. ' +
        'Go to Firebase Console → Project Settings → com.heka.calendar → Add fingerprint: ' +
        '7F:C3:60:5D:6B:E2:39:40:0A:0D:D3:67:93:F8:30:EC:7A:67:58:9A. ' +
        'If using Google Play, also add the App Signing key SHA-1 from Play Console.',
        'auth/configuration-error'
      );
    }
    if (getErrorCode(error) === '16' || getErrorMessage(error).includes('CANCELED')) {
      throw new NativeAuthError('Sign in was cancelled', 'auth/cancelled');
    }
    throw new NativeAuthError(
      getErrorMessage(error, 'Google Sign-In failed'),
      getErrorCode(error) || 'auth/unknown'
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
