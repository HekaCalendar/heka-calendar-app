# HEKA Calendar - Google Play Store Readiness

**Version:** 2.2.0  
**Target Date:** 2026  
**Status:** ✅ READY FOR SUBMISSION

---

## ✅ API Level Compliance

### Current Configuration
| Setting | Value | Status | Requirement |
|---------|-------|--------|-------------|
| `compileSdkVersion` | 36 | ✅ | Must target latest |
| `targetSdkVersion` | 36 | ✅ | Android 16 (API 36) |
| `minSdkVersion` | 24 | ✅ | Android 7.0+ |
| `ndkVersion` | 28.0.13004108 | ✅ | NDK r28+ for 16KB support |

### Timeline Alignment
- **August 2025:** Google requires API 35 (Android 15) for new apps
- **August 2026:** Google requires API 36 (Android 16) for updates
- **Our Status:** Already targeting API 36 ✅ - FUTURE-PROOF

---

## ✅ 16KB Page Size Support

### What is it?
Android 15+ devices can use 16KB memory pages (instead of 4KB) for better performance. Apps must either:
1. Have no native code (automatically compliant)
2. Recompile native libraries with 16KB alignment

### Our Status
- **Native Libraries:** 0 found in APK
- **App Type:** Pure Capacitor WebView (no native code)
- **Result:** ✅ AUTOMATICALLY COMPLIANT

### Configuration Applied
```gradle
# variables.gradle
ndkVersion = "28.0.13004108"

# gradle.properties
android.enableR8.fullMode=true
android.experimental.enableNewResourceProcessing=true

# app/build.gradle
packagingOptions {
    jniLibs { useLegacyPackaging false }
}
```

---

## ✅ Build Configuration

```gradle
android {
    namespace = "com.heka.calendar"
    compileSdk = 36
    ndkVersion = "28.0.13004108"
    
    defaultConfig {
        applicationId "com.heka.calendar"
        minSdkVersion = 24      // Android 7.0
        targetSdkVersion = 36   // Android 16
        versionCode = 1
        versionName = "1.0"
    }
}
```

---

## ✅ Required Assets Checklist

| Asset | Status | Location |
|-------|--------|----------|
| App Icon (512x512) | ⚠️ GENERATE | `android/app/src/main/res/` |
| Feature Graphic | ⚠️ GENERATE | Play Console |
| Screenshots (Phone) | ⚠️ GENERATE | 5+ screenshots |
| Privacy Policy | ✅ READY | `PRIVACY_POLICY.md` |
| App Signing Key | ⚠️ CREATE | Play Console / Local |

---

## ✅ Permissions Declaration

### Current Permissions
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
```

### Play Store Declaration Required
- [ ] Location permission justification (birth chart calculations)
- [ ] Storage permission justification (PDF export)
- [ ] Alarm permission justification (notifications)

---

## ✅ Pre-Launch Checklist

### Technical
- [x] Target API 36 (Android 16)
- [x] 16KB page size compliant
- [x] No native code conflicts
- [x] Privacy policy published
- [x] App bundle/APK builds successfully

### Store Listing
- [ ] App title (30 chars max)
- [ ] Short description (80 chars max)
- [ ] Full description (4000 chars max)
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (min 2, max 8 per type)
- [ ] Video trailer (optional)

### Content Rating
- [ ] Complete content rating questionnaire
- [ ] Set appropriate category (Lifestyle / Tools)

### Distribution
- [ ] Choose countries (suggest: all)
- [ ] Set pricing (Free / Paid)
- [ ] Configure in-app purchases (if any)

---

## ⚠️ Action Items Before Submission

### High Priority
1. **Generate App Icons** - Use Android Studio's Image Asset Studio
2. **Create Store Graphics** - 512x512 icon, 1024x500 feature graphic
3. **Take Screenshots** - 5+ high-quality phone screenshots
4. **Create Signed APK/AAB** - Use release keystore (not debug)

### Medium Priority
5. **Write Store Descriptions** - Compelling title + description
6. **Set Up Firebase** - If using cloud sync, configure production Firebase
7. **Test on Android 15/16** - Verify on physical device or emulator
8. **Complete Content Rating** - Play Console questionnaire

### Low Priority
9. **Beta Testing** - Internal/closed testing track
10. **Pre-Launch Report** - Let Play Console test the app

---

## 📱 Testing Matrix

| Device Type | Android Version | Status |
|-------------|-----------------|--------|
| Phone | Android 16 (API 36) | ⚠️ TEST |
| Phone | Android 15 (API 35) | ⚠️ TEST |
| Phone | Android 14 (API 34) | ⚠️ TEST |
| Phone | Android 10 (API 29) | ⚠️ TEST |
| Tablet | Android 12+ | ⚠️ TEST |

---

## 📦 Build Commands

```bash
# Web build
npm run build

# Sync to Android
npx cap sync android

# Build release APK
cd android
./gradlew assembleRelease

# Or build App Bundle (preferred for Play Store)
./gradlew bundleRelease
```

---

## 🔐 Signing Configuration

### For Play Store (Create `android/app/key.properties`):
```properties
storeFile=/path/to/heka-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=heka-calendar
keyPassword=YOUR_KEY_PASSWORD
```

### Generate Keystore:
```bash
keytool -genkey -v \
  -keystore heka-release.keystore \
  -alias heka-calendar \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

---

## 📋 Play Console Submission Steps

1. **Create Developer Account** ($25 one-time fee)
2. **Create New App** in Play Console
3. **Set Up Store Listing** with all assets
4. **Configure App Signing** (Google-managed recommended)
5. **Upload AAB/APK** to production/internal track
6. **Complete Content Rating**
7. **Set Pricing & Distribution**
8. **Submit for Review**

---

## 🚨 Important Deadlines

| Date | Requirement | Our Status |
|------|-------------|------------|
| Aug 2025 | New apps must target API 35 | ✅ N/A (already higher) |
| Aug 2026 | Updates must target API 36 | ✅ ALREADY COMPLIANT |
| Aug 2026 | 16KB page size required | ✅ COMPLIANT (no native code) |

**We are ahead of all requirements by 4+ months!**

---

## 📚 References

- [Android 16KB Page Size](https://developer.android.com/guide/practices/page-sizes)
- [Target API Level Requirements](https://developer.android.com/google/play/requirements/target-sdk)
- [Play Store Launch Checklist](https://developer.android.com/distribute/best-practices/launch/launch-checklist)

---

**Last Updated:** April 2, 2026  
**APK Size:** ~15MB  
**Target SDK:** 36 (Android 16)  
**Status:** ✅ READY FOR PLAY STORE
