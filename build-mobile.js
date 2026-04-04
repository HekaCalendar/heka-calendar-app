#!/usr/bin/env node
/**
 * Build script for HEKA Calendar mobile apps
 * Usage: node build-mobile.js [android|ios]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const platform = process.argv[2] || 'android';

console.log(`🚀 Building HEKA Calendar for ${platform}...\n`);

// Step 1: Build the web app
console.log('📦 Step 1: Building web app...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Web build complete\n');
} catch (e) {
  console.error('❌ Web build failed');
  process.exit(1);
}

// Step 2: Sync web assets to native project
console.log('🔄 Step 2: Syncing to Capacitor...');
try {
  execSync('npx cap sync', { stdio: 'inherit' });
  console.log('✅ Sync complete\n');
} catch (e) {
  console.error('❌ Sync failed');
  process.exit(1);
}

// Step 3: Build APK (Android)
if (platform === 'android') {
  console.log('🤖 Step 3: Building Android APK...');
  console.log('This requires Android Studio to be installed.');
  console.log('\nOptions:');
  console.log('  1. Open Android Studio: npx cap open android');
  console.log('  2. Build debug APK: cd android && ./gradlew assembleDebug');
  console.log('  3. Build release APK: cd android && ./gradlew assembleRelease');
  console.log('\n📱 Or use Android Studio GUI:');
  console.log('   Build → Build Bundle(s) / APK(s) → Build APK(s)');
}

// Step 4: iOS instructions
if (platform === 'ios') {
  console.log('🍎 Step 3: iOS build requires macOS + Xcode');
  console.log('Run: npx cap open ios');
}

console.log('\n✨ Done!');
