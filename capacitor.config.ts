import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.heka.calendar',
  appName: 'HEKA Calendar',
  webDir: 'dist2',
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
      skipNativeAuth: true,
    },
  },
  android: {
    // Use system WebView (smaller APK)
    allowMixedContent: true,
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
