import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.heka.calendar',
  appName: 'HEKA Calendar',
  webDir: 'dist',
  server: {
    // Allow cleartext for local dev
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1a1a26',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
    },
    HekaPrint: {
      // Native print plugin
    },
  },
  android: {
    // Use system WebView (smaller APK)
    allowMixedContent: true,
    captureInput: true,
    // Enable scrolling
    webContentsDebuggingEnabled: true,
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    scrollEnabled: true,
  }
};

export default config;
