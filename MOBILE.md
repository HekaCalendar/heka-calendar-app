# HEKA Calendar Mobile App

This is a **Capacitor-wrapped native mobile app** version of the HEKA Calendar PWA.

## Quick Start

### Prerequisites
- Node.js 18+
- Android Studio (for Android builds)
- **Xcode + macOS (for iOS builds)** - See [IOS-GUIDE.md](IOS-GUIDE.md) for Windows alternatives

### Build Android APK

```bash
# Build everything
node build-mobile.js android

# Or manually:
npm run build          # Build web app
npx cap sync           # Sync to Android
npx cap open android   # Open in Android Studio
```

In Android Studio:
1. Wait for Gradle sync
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build iOS App

```bash
node build-mobile.js ios
npx cap open ios
```

In Xcode:
1. Select your device/simulator
2. **Product → Archive** (for App Store)
3. Or **Product → Build** (for testing)

## Project Structure

```
heka-calendar-pro/
├── android/           # Native Android project
│   └── app/src/main/
│       ├── assets/public/   # Copied web files
│       └── res/             # Icons, splash
├── ios/               # Native iOS project (if added)
├── dist/              # Built web app
├── capacitor.config.ts    # App configuration
└── build-mobile.js    # Build helper script
```

## Configuration

### App Info
Edit `capacitor.config.ts`:
- `appId`: Reverse domain (com.heka.calendar)
- `appName`: Display name
- `version`: Auto-read from package.json

### Icons
Replace these files:
- `public/icon-192.png` - App icon
- `public/icon-512.png` - Store listing

Then run `npx cap copy` to sync.

### Splash Screen
Create `splash.png` (2732×2732) in `resources/`, then:
```bash
npm install -g cordova-res
cordova-res --skip-config --copy
```

## Publishing

### Google Play Store - Release Build

#### Step 1: Create Signing Keystore (One-time)

**Option A: Use PowerShell Script (Windows)**
```powershell
cd android
.\setup-keystore.ps1
# Enter password when prompted
# This creates: heka-calendar.keystore + key.properties
```

**Option B: Manual Creation**
```bash
cd android
# Generate keystore
keytool -genkey -v -keystore heka-calendar.keystore -alias heka -keyalg RSA -keysize 2048 -validity 10000

# Create key.properties
echo "RELEASE_STORE_FILE=heka-calendar.keystore" > key.properties
echo "RELEASE_STORE_PASSWORD=your_password" >> key.properties
echo "RELEASE_KEY_ALIAS=heka" >> key.properties
echo "RELEASE_KEY_PASSWORD=your_password" >> key.properties
```

#### Step 2: Build Release APK/AAB

```bash
# Build web app
npm run build

# Sync to Android
npx cap sync android

# Build release APK (command line)
cd android
.\gradlew assembleRelease

# OR build AAB for Play Store
.\gradlew bundleRelease

# Output locations:
# APK: android/app/build/outputs/apk/release/app-release.apk
# AAB: android/app/build/outputs/bundle/release/app-release.aab
```

#### Step 3: Play Store Requirements

1. **Create Developer Account** ($25 one-time) at https://play.google.com/console
2. **Privacy Policy** - Upload privacy-policy.html to web host
3. **Screenshots** - Provide phone/tablet screenshots
4. **Feature Graphic** - 1024×500 banner image
5. **App Icon** - 512×512 PNG

#### Step 4: Upload

1. Go to Play Console → Create App
2. Fill store listing (title, description, screenshots)
3. Upload AAB (recommended) or APK
4. Complete content rating questionnaire
5. Set pricing/availability
6. Submit for review

### Apple App Store
1. Apple Developer Program ($99/year)
2. Archive in Xcode
3. Upload via Organizer
4. Submit for review

## Development Workflow

### Live Reload (Development)
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run on device
npx cap run android --livereload
```

### Sync Changes
After modifying web code:
```bash
npm run build
npx cap copy android
```

### Native Changes
If you add native plugins:
```bash
npm install @capacitor/splash-screen
npx cap sync
```

## Troubleshooting

### Android build fails
- Check Android Studio SDK is installed
- Run: `cd android && ./gradlew clean`

### Web assets not updating
- Run: `npx cap copy android`
- Or: Delete `android/app/src/main/assets/public` and re-sync

### App shows white screen
- Check `webDir: 'dist'` in capacitor.config.ts
- Verify dist/index.html exists
- Check browser console for JS errors

## Next Steps

1. **Test on real device** - Connect phone, enable USB debugging
2. **Add native features** - Push notifications, calendar integration
3. **Customize splash screen** - Add branded launch image
4. **Sign for release** - Create keystores for store publishing

---

**Your PWA is now a real mobile app! 🎉**
