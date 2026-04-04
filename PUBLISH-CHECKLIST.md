# HEKA Calendar - Android Publishing Checklist

## 🚀 Quick Start (TL;DR)

```bash
# 1. Build and test on phone
npm run android:open          # Opens Android Studio
# Click play button with phone connected

# 2. Setup signing (one time)
npm run android:setup         # Creates keystore

# 3. Build release APK
npm run android:build         # Builds signed APK

# 4. Upload to Play Store
# Go to play.google.com/console → Upload APK
```

---

## 📋 Step-by-Step Checklist

### ☐ Phase 1: Prepare
- [x] Update version in `package.json` (e.g., "2.1.5") - ✓ Done 2025-02-11
- [x] Fix BirthChartForm city search bug - ✓ Done 2025-02-11
- [ ] Update `APP_VERSION` in `src/main.tsx`
- [ ] Update version in `capacitor.config.ts`
- [ ] Test app in browser: `npm run dev`
- [ ] Build web: `npm run build`

### ☐ Phase 2: Test on Android Device
- [ ] Connect Android phone via USB
- [ ] Enable USB debugging on phone
- [ ] Run: `npm run android:open`
- [ ] Select device in Android Studio
- [ ] Click play button (▶️)
- [ ] Verify app works on phone
- [ ] Test all features

### ☐ Phase 3: Create Signing Keystore
- [ ] Run: `npm run android:setup`
- [ ] Enter password (save it!)
- [ ] Enter your details
- [ ] Verify `android/heka-calendar.keystore` created
- [ ] **BACKUP KEYSTORE TO CLOUD/USB**
- [ ] Store password in password manager

### ☐ Phase 4: Build Release APK
- [ ] Run: `npm run android:build`
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Find APK: `android/app/build/outputs/apk/release/app-release.apk`
- [ ] Copy APK to safe location
- [ ] Test APK on phone: `adb install app-release.apk`

### ☐ Phase 5: Google Play Console Setup
- [ ] Go to [play.google.com/console](https://play.google.com/console)
- [ ] Sign in with Google account
- [ ] Pay $25 developer fee
- [ ] Complete account verification

### ☐ Phase 6: Create App Listing
- [ ] Click "Create App"
- [ ] Enter app name: "HEKA Calendar"
- [ ] Select default language
- [ ] Choose "Free" app

### ☐ Phase 7: Store Listing
- [ ] Upload app icon (512x512 PNG)
- [ ] Upload feature graphic (1024x500)
- [ ] Add 2+ phone screenshots
- [ ] Write short description (80 chars max)
- [ ] Write full description
- [ ] Add privacy policy URL (or use free generator)

### ☐ Phase 8: Upload & Release
- [ ] Go to "Production" track
- [ ] Create new release
- [ ] Upload `app-release.apk`
- [ ] Add release notes
- [ ] Save and review
- [ ] Complete content rating questionnaire
- [ ] Set pricing & distribution (countries)
- [ ] Submit for review

### ☐ Phase 9: Post-Launch
- [ ] Wait for approval (1-3 days)
- [ ] Download app from Play Store
- [ ] Share Play Store link
- [ ] Ask friends for reviews
- [ ] Monitor crash reports

---

## 📁 File Structure

```
heka-calendar-pro/
├── android/
│   ├── heka-calendar.keystore      ← BACKUP THIS!
│   ├── key.properties              ← BACKUP THIS!
│   └── app/build/outputs/apk/
│       └── release/
│           └── app-release.apk     ← UPLOAD THIS
├── src/
├── dist/                           ← Built web app
├── ANDROID-PUBLISH.md              ← Detailed guide
├── PUBLISH-CHECKLIST.md            ← This file
└── setup-android-signing.js        ← Keystore setup
```

---

## 🆘 Emergency: Lost Keystore?

**Cannot be recovered! You must:**
1. Create new keystore
2. Unpublish old app from Play Store
3. Publish as completely new app
4. Users must manually install new app
5. **All reviews/rankings lost**

**That's why we backup 3+ times!**

---

## 📱 Common Commands

```bash
# Development
npm run dev                     # Web dev server
npm run build                   # Build web app

# Android
npm run android:open            # Open Android Studio
npm run android:debug           # Build debug APK
npm run android:build           # Build release APK
npm run android:clean           # Clean build cache
npm run android:setup           # Setup signing

# iOS (Mac only)
npm run mobile:ios              # Open Xcode
```

---

## 📊 Timeline Expectations

| Step | Time |
|------|------|
| First build | 10 min |
| Keystore setup | 5 min |
| Release build | 5 min |
| Play Store review | 1-3 days |
| Total to publish | 2-4 days |

---

## ✅ Pre-Submit Quality Check

Before hitting "Submit":
- [ ] App icon looks good at small size
- [ ] No debug/development banners
- [ ] App launches in under 3 seconds
- [ ] No obvious crashes
- [ ] Text is readable
- [ ] Buttons are tappable
- [ ] Works offline

---

**Ready to publish? Start with Phase 1! 🚀**
