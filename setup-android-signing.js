#!/usr/bin/env node
/**
 * Setup Android signing keystore for Play Store
 * Run: node setup-android-signing.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

async function main() {
  console.log('🔐 HEKA Calendar Android Signing Setup\n');
  console.log('This creates your signing keystore for Google Play Store.\n');
  console.log('⚠️  IMPORTANT: Save the keystore file and passwords forever!');
  console.log('   Without them, you cannot update your app on Play Store.\n');

  const keystorePath = path.join(__dirname, 'android', 'heka-calendar.keystore');

  if (fs.existsSync(keystorePath)) {
    console.log('✅ Keystore already exists at:', keystorePath);
    const overwrite = await question('Overwrite? (yes/no): ');
    if (overwrite.toLowerCase() !== 'yes') {
      console.log('Aborted.');
      rl.close();
      return;
    }
  }

  // Get keystore details
  const password = await question('Create keystore password (save this!): ');
  const confirmPassword = await question('Confirm password: ');

  if (password !== confirmPassword) {
    console.log('❌ Passwords do not match!');
    rl.close();
    return;
  }

  const name = await question('Your full name: ');
  const org = await question('Organization (or your name): ');
  const city = await question('City: ');
  const state = await question('State/Province: ');
  const country = await question('Country code (e.g., US, AU, UK): ');

  console.log('\n🔨 Creating keystore...\n');

  try {
    // Create keystore using keytool
    const keytoolCmd = `keytool -genkey -v ` +
      `-keystore "${keystorePath}" ` +
      `-alias heka ` +
      `-keyalg RSA ` +
      `-keysize 2048 ` +
      `-validity 10000 ` +
      `-storepass "${password}" ` +
      `-keypass "${password}" ` +
      `-dname "CN=${name}, O=${org}, L=${city}, S=${state}, C=${country}"`;

    execSync(keytoolCmd, { stdio: 'inherit' });

    console.log('\n✅ Keystore created successfully!\n');

    // Create gradle.properties with signing config
    const gradlePropertiesPath = path.join(__dirname, 'android', 'gradle.properties');
    let gradleProperties = '';
    
    if (fs.existsSync(gradlePropertiesPath)) {
      gradleProperties = fs.readFileSync(gradlePropertiesPath, 'utf8');
      // Remove old signing config if exists
      gradleProperties = gradleProperties.replace(/RELEASE_STORE_FILE=.*\n?/g, '');
      gradleProperties = gradleProperties.replace(/RELEASE_STORE_PASSWORD=.*\n?/g, '');
      gradleProperties = gradleProperties.replace(/RELEASE_KEY_ALIAS=.*\n?/g, '');
      gradleProperties = gradleProperties.replace(/RELEASE_KEY_PASSWORD=.*\n?/g, '');
    }

    // Add signing config
    gradleProperties += `\n# Signing config for release builds\n`;
    gradleProperties += `RELEASE_STORE_FILE=heka-calendar.keystore\n`;
    gradleProperties += `RELEASE_STORE_PASSWORD=${password}\n`;
    gradleProperties += `RELEASE_KEY_ALIAS=heka\n`;
    gradleProperties += `RELEASE_KEY_PASSWORD=${password}\n`;

    fs.writeFileSync(gradlePropertiesPath, gradleProperties);
    console.log('✅ Updated gradle.properties\n');

    // Create key.properties file (legacy support)
    const keyPropertiesPath = path.join(__dirname, 'android', 'key.properties');
    const keyPropertiesContent = `storePassword=${password}
keyPassword=${password}
keyAlias=heka
storeFile=heka-calendar.keystore
`;
    fs.writeFileSync(keyPropertiesPath, keyPropertiesContent);
    console.log('✅ Created key.properties\n');

    console.log('='.repeat(60));
    console.log('🎉 SETUP COMPLETE!\n');
    console.log('Files created:');
    console.log('  - android/heka-calendar.keystore');
    console.log('  - android/gradle.properties (updated)');
    console.log('  - android/key.properties');
    console.log('\n⚠️  BACKUP THESE FILES:');
    console.log('  1. heka-calendar.keystore (your app identity)');
    console.log('  2. gradle.properties (contains passwords)');
    console.log('  3. The password you just created');
    console.log('\nStore them in:');
    console.log('  - Password manager');
    console.log('  - Cloud storage (Google Drive, Dropbox)');
    console.log('  - USB drive');
    console.log('\nNext step: Build release APK');
    console.log('  cd android && .\\gradlew assembleRelease');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Error creating keystore:', error.message);
    process.exit(1);
  }

  rl.close();
}

main();
