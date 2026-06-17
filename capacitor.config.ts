import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.heka.calendar',
  appName: 'HEKA Calendar',
  webDir: 'dist',
  // Suppress console.log/info in native logs (prevents API key leakage & log spam)
  // Warnings and errors still forwarded. DevTools console unaffected.
  loggingBehavior: 'production',
  server: {
    // Production: cleartext disabled (HTTPS only)
    // cleartext: true, // Enable only for local dev
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1a1a26',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    // HekaPrint plugin placeholder removed — native print logic is handled
    // by custom Android Java classes, not via Capacitor bridge.
    FirebaseAuthentication: {
      // Skip native Firebase auth — we use the Firebase JS SDK as the source of truth.
      // The plugin is only used for native OAuth flows (Google Sign-In).
      // After native sign-in, we exchange the OAuth tokens for a Firebase JS credential.
      skipNativeAuth: true,
      providers: ['google.com'],
    },
  },
  android: {
    // Use system WebView (smaller APK)
    allowMixedContent: false,
    captureInput: true,
    // Enable scrolling
    // Debug mode OFF for Play Store release
    webContentsDebuggingEnabled: false,
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: true,
  }
};

export default config;
