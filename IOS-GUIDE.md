# iOS Build Guide for HEKA Calendar

## ⚠️ Requirement: macOS + Xcode

Apple requires iOS apps to be built on a Mac. You have 3 options:

---

## Option 1: Borrow/Rent a Mac (Easiest)

### One-time Build
1. Find any Mac (friend's MacBook, library, Apple Store)
2. Install Node.js from [nodejs.org](https://nodejs.org)
3. Open Terminal and run:

```bash
cd heka-calendar-pro
npm install
npm run build
npx cap sync ios
npx cap open ios
```

4. In Xcode:
   - Connect iPhone via USB
   - Select your iPhone from top dropdown
   - Press **Cmd+R** to run

### Create IPA for Sideloading
1. In Xcode: **Product → Archive**
2. Click **Distribute App**
3. Select **Ad Hoc** → Save IPA file
4. Use [AltStore](https://altstore.io) or [Sideloadly](https://sideloadly.io) to install on iPhone

---

## Option 2: GitHub Actions (Free Builds)

### Setup Automated iOS Builds

Create `.github/workflows/ios-build.yml`:

```yaml
name: iOS Build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build web app
      run: npm run build
    
    - name: Sync Capacitor
      run: npx cap sync ios
    
    - name: Build iOS (simulator)
      run: |
        cd ios
        xcodebuild -workspace App.xcworkspace \
          -scheme App \
          -destination 'platform=iOS Simulator,name=iPhone 15' \
          clean build
    
    - name: Upload build
      uses: actions/upload-artifact@v3
      with:
        name: ios-build
        path: ios/build/
```

Push to GitHub → Actions tab → Download build artifact

**Note:** For App Store builds, you need Apple Developer certificates.

---

## Option 3: Codemagic (Free Tier)

### Setup
1. Push code to GitHub/GitLab/Bitbucket
2. Go to [codemagic.io](https://codemagic.io)
3. Sign up (free 500 build minutes/month)
4. Create new app → Select your repo
5. Use this workflow:

```yaml
workflows:
  ios-build:
    name: Build iOS
    instance_type: mac_mini_m1
    max_build_duration: 30
    environment:
      vars:
        XCODE_WORKSPACE: "ios/App.xcworkspace"
        XCODE_SCHEME: "App"
      xcode: latest
    scripts:
      - name: Install dependencies
        script: npm ci
      - name: Build web
        script: npm run build
      - name: Sync iOS
        script: npx cap sync ios
      - name: Build iOS
        script: |
          cd ios
          xcodebuild -workspace App.xcworkspace \
            -scheme App \
            -configuration Release \
            -destination 'generic/platform=iOS' \
            clean build
    artifacts:
      - ios/build/*.app
```

6. Add your Apple Developer credentials
7. Build → Download IPA

---

## Option 4: MacStadium (Cloud Mac)

Rent a cloud Mac for $99/month:
1. Sign up at [macstadium.com](https://macstadium.com)
2. Connect via remote desktop
3. Install Xcode from App Store
4. Build as if you had a physical Mac

---

## TestFlight Distribution (Recommended)

Once you have a Mac or cloud build:

1. **Apple Developer Account** ($99/year)
   - Sign up at [developer.apple.com](https://developer.apple.com)

2. **Create App ID**
   - Certificates, Identifiers & Profiles → App IDs
   - Bundle ID: `com.heka.calendar`

3. **Upload to App Store Connect**
   - Xcode → Product → Archive
   - Distribute App → App Store Connect

4. **TestFlight Beta**
   - Users install TestFlight app
   - Invite testers via email
   - They get automatic updates

5. **App Store Release**
   - Fill App Store listing
   - Submit for review (1-2 days)
   - Go live!

---

## Quick Reference: iOS Commands

```bash
# Install iOS dependencies
npm install @capacitor/ios

# Add iOS platform
npx cap add ios

# Sync web code to iOS
npx cap sync ios

# Copy only (faster, no dependency update)
npx cap copy ios

# Open in Xcode
npx cap open ios

# Run on connected device (from terminal)
cd ios && xcodebuild -workspace App.xcworkspace -scheme App -destination 'id=YOUR_DEVICE_ID'

# Build for simulator
cd ios && xcodebuild -workspace App.xcworkspace -scheme App -destination 'platform=iOS Simulator,name=iPhone 15'
```

---

## Troubleshooting

### "No such module 'Capacitor'"
Run: `cd ios && pod install`

### Build fails with signing errors
- Open Xcode → Signing & Capabilities
- Select your Team
- Check "Automatically manage signing"

### White screen on launch
- Check `webDir: 'dist'` in capacitor.config.ts
- Ensure `dist/index.html` exists
- Check Safari DevTools for JS errors

---

## Android vs iOS Comparison

| Feature | Android | iOS |
|---------|---------|-----|
| Build on Windows | ✅ Yes | ❌ No (needs Mac) |
| Developer fee | $25 one-time | $99/year |
| Sideloading | Easy (APK) | Hard (need signing) |
| App Store review | Hours | 1-2 days |
| Testing | Any device | Need UDID registration |

---

## My Recommendation

**For testing with friends:**
1. Use GitHub Actions (free) to build simulator version
2. Or find a friend with a Mac for 30 minutes

**For App Store:**
1. Get Apple Developer account ($99/year)
2. Use Codemagic or GitHub Actions with certificates
3. Distribute via TestFlight

**Want me to set up GitHub Actions for you?**
