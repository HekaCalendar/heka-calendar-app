# Android AAB Build & Play Store Publishing Guide

> **Google Play requires AAB (Android App Bundle)** for all new apps and updates. AAB produces smaller downloads (~15% smaller on average) because Google Play generates optimised APKs for each device. This guide uses `bundleRelease` for Play Store submissions.

---

## Phase 1: Build Debug APK (Test on Your Phone)

### Step 1: Open Android Studio
```bash
cd heka-calendar-pro
npm run mobile:android
```
This opens Android Studio. Wait for "Gradle sync finished" (first time takes 3-5 minutes).

### Step 2: Enable USB Debugging on Phone
1. **Settings → About Phone → Tap "Build Number" 7 times**
2. **Developer Options → Enable "USB Debugging"**
3. **Connect phone via USB → Allow debugging prompt**

### Step 3: Run on Phone
In Android Studio:
1. Top toolbar: Select your phone from dropdown (not "Pixel 4 API 30")
2. Click **green play button** ▶️
3. App installs and opens automatically!

### Step 4: Build Debug APK (Share with Friends)
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```
Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

Share via:
- Email
- Google Drive
- Dropbox
- Direct USB transfer

**Note:** Debug APK expires and shows "debug" banner.

---

## Phase 2: Build Release AAB (Play Store Ready)

### Step 1: Create Signing Keystore

**Option A: Automated Setup (Recommended)**

Open PowerShell in `heka-calendar-pro/android` folder:

```powershell
# Run the setup script
.\setup-keystore.ps1
```

The script will:
1. Generate the keystore file (`heka-calendar.keystore`)
2. Create `key.properties` with your credentials
3. Set proper file permissions

**Option B: Manual Setup**

```powershell
# Create keystore (save this file forever!)
keytool -genkey -v -keystore heka-calendar.keystore -alias heka -keyalg RSA -keysize 2048 -validity 10000

# Create key.properties file
@"
storeFile=heka-calendar.keystore
storePassword=your_password_here
keyAlias=heka
keyPassword=your_password_here
"@ | Out-File -FilePath "key.properties" -Encoding UTF8
```

**⚠️ CRITICAL:** Save `heka-calendar.keystore` file + password in multiple places (cloud, USB, password manager, etc). **You cannot update the app without this file!**

### Step 2: Build Release AAB

```powershell
cd heka-calendar-pro/android
.\gradlew bundleRelease
```

Find AAB at: `android/app/build/outputs/bundle/release/app-release.aab`

**AAB Size:** ~12-18MB (Google Play generates device-specific APKs from this)

**Note:** If keystore is not configured, the build will fail with:
> `Release keystore not configured. Create android/app/key.properties for Play Store builds.`

If you need a **local release APK** for side-loading (not Play Store):
```powershell
.\gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

---

## Phase 3: Google Play Store Publishing

### Step 1: Create Google Play Developer Account

1. Go to [play.google.com/console](https://play.google.com/console)
2. Sign in with Google account
3. Pay **$25 one-time fee**
4. Complete account verification (may take 24-48 hours)

### Step 2: Create App Listing

Click **"Create App"**:
- **App Name:** HEKA Calendar
- **Default Language:** English
- **App Type:** App
- **Free or Paid:** Free

### Step 3: Fill Store Listing

**Required:**
- **Short Description (80 chars):** "The 13-month HEKA calendar with celestial guidance and moon phases"
- **Full Description:** See template below
- **Screenshots:** 2 phone screenshots minimum
- **Feature Graphic:** 1024x500 banner
- **App Icon:** 512x512 PNG

**Description Template:**
```
Discover the ancient 13-month HEKA calendar, aligned with natural rhythms and celestial cycles.

Features:
• 13 months of 28 days + 1 day out of time
• Daily moon phase tracking
• Celestial guidance for each day
• Zodiac and numerology insights
• Agricultural planting guidance
• Personal journal and notes
• Southern & Northern hemisphere support
• No ads, fully offline capable

The HEKA calendar honors the original human timekeeping system used by ancient civilizations, before the artificial 12-month Gregorian calendar.

Perfect for:
• Gardeners following biodynamic principles
• Astrology enthusiasts
• Those seeking natural time rhythms
• History and mythology lovers

Download now and reconnect with celestial time.
```

### Step 4: Upload AAB

1. Go to **Release → Production → Create Release**
2. Upload `app-release.aab`
3. Add release notes:
   ```
   Version 2.2.1
   - Enhanced celestial guidance
   - Moon phase tracking
   - Seasonal agriculture tips
   - Energy forecasting
   ```
4. Save and review

### Step 5: Content Rating

1. **Content Rating → Start Questionnaire**
2. **Category:** Utilities/Productivity
3. Answer all questions honestly (likely "No" to most)
4. Get rating (likely E for Everyone)

### Step 6: Set Pricing & Distribution

- **Countries:** Select all (or specific regions)
- **Pricing:** Free
- **Ads:** No, this app doesn't have ads
- **Content Guidelines:** ✅ Yes, complies
- **US Export Laws:** ✅ Yes, complies

### Step 7: Submit for Review

Click **"Send for Review"**

**Timeline:**
- New apps: 1-3 days
- Updates: Few hours

---

## Phase 4: Post-Launch

### Checklist After Publishing:

- [ ] Download your own app from Play Store
- [ ] Test on different devices
- [ ] Share link on social media
- [ ] Ask friends for reviews
- [ ] Respond to user reviews
- [ ] Monitor crash reports (Play Console → Android Vitals)

### Update Your App:

1. Update version in `package.json`: `"version": "2.2.2"`
2. Update `versionName` in `android/app/build.gradle`
3. Build new AAB:
   ```bash
   npm run build
   npx cap sync android
   cd android
   .\gradlew bundleRelease
   ```
4. Upload new AAB to Play Console
5. Same keystore = same app identity

---

## Troubleshooting

### "App not installed" error
- APK was built with different keystore
- Uninstall old version first
- Or use `adb install -r app.apk` to force

### Gradle sync fails
```bash
cd android
.\gradlew clean
.\gradlew build
```

### White screen on launch
- Check web build: `npm run build`
- Verify `dist/index.html` exists
- Check Android Studio Logcat for errors

### Signing error
- Ensure `key.properties` matches keystore
- Check keystore path is correct
- Passwords are case-sensitive

### `bundleRelease` fails with "Release keystore not configured"
1. Make sure `android/key.properties` exists
2. Verify the `storeFile` path points to your `.keystore` file
3. Re-run `.\setup-keystore.ps1` if needed

---

## Quick Reference Commands

```bash
# Full AAB build pipeline (for Play Store)
npm run build
npx cap sync android
cd android
.\gradlew bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab

# Local release APK (for side-loading only)
.\gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk

# Just copy web assets (faster)
npx cap copy android

# Clean build
.\gradlew clean
.\gradlew bundleRelease

# Install debug APK to connected phone
adb install app/build/outputs/apk/debug/app-debug.apk

# View logs
adb logcat | grep "HEKA"
```

---

## File Checklist

Keep these files safe forever:
- ✅ `android/heka-calendar.keystore` (your app identity - NEVER commit to git!)
- ✅ `android/key.properties` (keystore passwords - NEVER commit to git!)
- ✅ `key.properties.template` (reference file - safe to commit)
- ✅ Google Play Developer account login

### Security Note

These files are automatically excluded from git via `.gitignore`:
- `*.keystore`, `*.jks` (keystore files)
- `key.properties` (contains passwords)

If you accidentally commit these, **revoke and regenerate immediately**.

---

**Ready? Start with Phase 1 - build the debug APK and test on your phone!**
