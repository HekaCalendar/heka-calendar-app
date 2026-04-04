#!/usr/bin/env node
/**
 * Firebase Setup Verification Script
 * Run this to check if Firebase is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 HEKA Calendar - Firebase Setup Check\n');

const checks = [];

// Check 1: .env file exists
checks.push({
  name: 'Environment file (.env)',
  status: fs.existsSync('.env'),
  path: '.env',
  hint: 'Create .env file with Firebase config'
});

// Check 2: google-services.json exists
checks.push({
  name: 'Android config (google-services.json)',
  status: fs.existsSync('android/app/google-services.json'),
  path: 'android/app/google-services.json',
  hint: 'Download from Firebase Console → Project Settings'
});

// Check 3: Firebase dependencies installed
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasFirebase = !!packageJson.dependencies?.firebase;
  const hasCapacitorFirebase = !!packageJson.dependencies?.['@capacitor-firebase/authentication'];
  checks.push({
    name: 'Firebase SDK installed',
    status: hasFirebase,
    path: 'package.json',
    hint: 'npm install firebase'
  });
  checks.push({
    name: 'Capacitor Firebase Auth installed',
    status: hasCapacitorFirebase,
    path: 'package.json',
    hint: 'npm install @capacitor-firebase/authentication'
  });
} catch {
  checks.push({ name: 'Package.json readable', status: false, hint: 'Check package.json exists' });
}

// Print results
let passed = 0;
let failed = 0;

checks.forEach(check => {
  const icon = check.status ? '✅' : '❌';
  console.log(`${icon} ${check.name}`);
  if (!check.status) {
    console.log(`   Path: ${check.path}`);
    console.log(`   Hint: ${check.hint}`);
    failed++;
  } else {
    passed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  console.log('\n⚠️  Firebase sync will be disabled until all checks pass.');
  console.log('   The app will work in local-only mode.');
  process.exit(1);
} else {
  console.log('\n✨ Firebase is configured! Cloud sync is ready.');
  console.log('   Run: npm run build && npx cap sync android');
  process.exit(0);
}
