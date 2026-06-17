# HEKA Calendar — Step-by-Step Instructions for Google Play Closed Testing

**Prerequisites:** The code-level hardening is done. Lint, type-check, and build all pass. The working tree is staged and ready. You only need to handle secrets, signing, and Play Console steps.

---

## Step 1 — Rotate exposed secrets

### 1.1 Rotate Firebase API keys and OAuth clients

1. Go to [Firebase Console](https://console.firebase.google.com/) → select your HEKA project.
2. Click the ⚙️ gear icon → **Project settings** → **General**.
3. Under **Your apps**, find the **Web app**.
4. Click the three dots menu → **Config** → **Regenerate key**.
5. Repeat for the **Android app**.
6. Under **Your apps**, find any **OAuth 2.0 client IDs** (Google sign-in). Revoke and recreate them:
   - Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials.
   - Find OAuth 2.0 Client IDs under the same project.
   - Delete the old web and Android OAuth clients.
   - Create new ones with the same package name (`com.heka.calendar`) and redirect URIs.
7. Download the new `google-services.json` for Android and replace the file at `android/app/google-services.json`.
8. Update your local `.env` file with the new Firebase web config values.

### 1.2 Rotate the Android signing keystore password

You have two options:

#### Option A — Keep the existing keystore (fastest)

1. Locate your keystore file: `android/heka-calendar.keystore`.
2. Run:
   ```bash
   keytool -storepasswd -keystore android/heka-calendar.keystore -alias heka
   ```
3. Enter the old password when prompted, then set a new strong password.
4. Update `android/key.properties` with the new password.

#### Option B — Generate a new upload keystore (safer if the password was exposed)

> Only do this if you are **not** using Google Play App Signing, or if you can update the upload key in Play Console. If Play App Signing manages your final signing key, you can rotate the upload key in Play Console → Release → Setup → App integrity → Upload key.

1. Generate a new keystore:
   ```bash
   keytool -genkey -v -keystore android/heka-calendar-new.keystore -alias heka -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Update `android/key.properties`:
   ```properties
   storePassword=NEW_STORE_PASSWORD
   keyPassword=NEW_KEY_PASSWORD
   keyAlias=heka
   storeFile=../heka-calendar-new.keystore
   ```
3. If using Play App Signing, request an upload key reset in the Play Console and upload the new certificate fingerprint.

---

## Step 2 — Remove the hardcoded keystore password from source

1. Open `scripts/verify-firebase-auth.ps1`.
2. Replace the hardcoded line:
   ```powershell
   $keystorePass = "#3areUnsto99abl3"
   ```
   with an environment variable read:
   ```powershell
   $keystorePass = $env:HEKA_KEYSTORE_PASSWORD
   if (-not $keystorePass) {
       Write-Host "ERROR: HEKA_KEYSTORE_PASSWORD environment variable is not set" -ForegroundColor Red
       exit 1
   }
   ```
3. Run the script locally like this:
   ```powershell
   $env:HEKA_KEYSTORE_PASSWORD = "your-new-password"
   .\scripts\verify-firebase-auth.ps1
   ```
4. In CI, the password will come from the `ANDROID_KEY_PASSWORD` secret (set in Step 4).

---

## Step 3 — Fix Android App Links / Digital Asset Links

1. Get your **release certificate SHA-256 fingerprint**:
   - If you use **Google Play App Signing**, go to Play Console → Release → Setup → App integrity → copy the SHA-256 fingerprint for "App signing key".
   - If you sign locally, run:
     ```bash
     keytool -list -v -keystore android/heka-calendar.keystore -alias heka | grep "SHA256"
     ```
2. Remove the colons from the fingerprint so it looks like:
   ```
   A1B2C3D4E5F6...
   ```
3. Edit both files:
   - `public/.well-known/assetlinks.json`
   - `website/.well-known/assetlinks.json`
4. Replace:
   ```json
   "sha256_cert_fingerprints": ["REPLACE_WITH_YOUR_SHA256_FINGERPRINT_NO_COLONS"]
   ```
   with:
   ```json
   "sha256_cert_fingerprints": ["YOUR_REAL_SHA256_FINGERPRINT"]
   ```
5. Deploy these files so they are accessible at:
   ```
   https://hekacalendar.com/.well-known/assetlinks.json
   ```
   They must be served with `Content-Type: application/json` and no redirects.
6. Verify:
   ```bash
   curl -I https://hekacalendar.com/.well-known/assetlinks.json
   # Should show Content-Type: application/json
   ```
7. Also verify with Google's tool:
   ```bash
   npx @digitalassetlinks/statement-list hekacalendar.com
   ```

---

## Step 4 — Set GitHub secrets for CI

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret** and add each of these:

| Secret name | Value |
|-------------|-------|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded contents of `android/heka-calendar.keystore` (see below) |
| `ANDROID_KEYSTORE_PASSWORD` | Your keystore password |
| `ANDROID_KEY_PASSWORD` | Your key password (usually same as keystore password) |
| `ANDROID_KEY_ALIAS` | `heka` |
| `VITE_FIREBASE_API_KEY` | New web API key from Step 1 |
| `VITE_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | e.g. `your-project` |
| `VITE_FIREBASE_STORAGE_BUCKET` | e.g. `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | e.g. `123456789` |
| `VITE_FIREBASE_APP_ID` | e.g. `1:123456789:web:abcdef` |
| `VITE_AI_PROXY_URL` | e.g. `https://your-ai-proxy.vercel.app` |

### How to create `ANDROID_KEYSTORE_BASE64`

On Windows (PowerShell):
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("android/heka-calendar.keystore")) | Set-Clipboard
```

On macOS/Linux:
```bash
base64 -i android/heka-calendar.keystore | pbcopy
```

Paste the resulting string into the GitHub secret.

---

## Step 5 — Verify a signed release AAB build locally

1. Make sure `android/key.properties` exists and has the new password:
   ```properties
   storePassword=YOUR_STORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=heka
   storeFile=../heka-calendar.keystore
   ```
2. Make sure `android/app/google-services.json` is the fresh one from Step 1.
3. Make sure your `.env` file has the new Firebase config.
4. Run the cross-platform bundle script:
   ```bash
   npm run android:bundle
   ```
   This will:
   - Build the web app (`npm run build`)
   - Sync Capacitor to Android (`npx cap sync android`)
   - Run `./gradlew bundleRelease`
5. If successful, the AAB will be at:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```
6. Check the file size. It should be roughly 10–20 MB. The latest one in `output/` was ~13.5 MB.
7. Optional: verify the AAB is signed:
   ```bash
   jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
   ```

### If the build fails

- **"Release keystore not configured"** → `android/key.properties` is missing or wrong path. Remember the build reads `android/key.properties`, not `android/app/key.properties`.
- **Gradle fails on Windows** → use `npm run android:bundle:win` or run from Git Bash.
- **Firebase plugin error** → make sure `android/app/google-services.json` is present and valid.

---

## Step 6 — Upload to Google Play and test

### 6.1 Create a new release in Internal Testing

1. Go to [Google Play Console](https://play.google.com/console/).
2. Select the HEKA Calendar app.
3. Go to **Release** → **Testing** → **Internal testing**.
4. Click **Create new release**.
5. Upload the AAB:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```
6. The release name and version will be auto-detected from the AAB (`2.2.23`, version code `271`).
7. Click **Review release** → **Start rollout to Internal testing**.

### 6.2 Test on a real device

1. Add your Google account as an internal tester:
   - Release → Testing → Internal testing → Testers → Create list.
   - Add your email.
2. On a physical Android device, open the Play Store with that account.
3. Join the internal test using the opt-in link from Play Console.
4. Install HEKA Calendar from the Play Store.
5. Run through this smoke test:
   - App launches without crashing.
   - Create an account or sign in.
   - Calendar loads and shows the current month.
   - Tap a day to open Day Panel.
   - Create a note or task.
   - Open Settings and toggle a setting.
   - Close and reopen the app — state persists.
   - Test a deep link: open `https://hekacalendar.com/invite/XXXX` from an email/notes app; it should offer to open in HEKA Calendar.

### 6.3 Move to Closed Testing

Once Internal Testing is stable:

1. In Play Console, go to **Release** → **Testing** → **Closed testing**.
2. Create a closed test track (or use the default "Alpha" track).
3. Upload the same AAB.
4. Add your closed-test email list.
5. Fill out the **Data safety** form using `PLAY_STORE_DATA_SAFETY.md` and the updated privacy policy.
6. Complete the app content questionnaire:
   - Content rating
   - Target audience
   - News apps (No)
   - COVID-19 contact tracing (No)
7. Submit for review.

---

## Quick checklist before submission

- [ ] Firebase web and Android API keys rotated.
- [ ] `android/app/google-services.json` is the new downloaded file.
- [ ] Android keystore password rotated.
- [ ] `scripts/verify-firebase-auth.ps1` no longer has a hardcoded password.
- [ ] `android/key.properties` has the new password.
- [ ] `assetlinks.json` SHA-256 fingerprint is real and hosted.
- [ ] GitHub secrets are set.
- [ ] `npm run lint -- --quiet` returns 0 errors.
- [ ] `npm run type-check` passes.
- [ ] `npm run android:bundle` produces a signed AAB.
- [ ] Internal Testing installed and smoke-tested on a real device.
- [ ] Play Console Data Safety form completed.

---

## Optional but recommended before broader closed testing

1. **iOS version alignment** — if you plan to open TestFlight later, fix iOS to `2.2.23 (271)` in `ios/App/App.xcodeproj/project.pbxproj`.
2. **Tauri version alignment** — bump `src-tauri/Cargo.toml` and `src-tauri/tauri.conf.json` to `2.2.23`.
3. **Backend hardening** — set `AI_PROXY_CORS_ORIGIN` to your domain and ensure `AI_PROXY_DEV_MODE=false` in production.
4. **AI Coach P0 issues** — if you keep AI enabled, review `docs/AI_COACH_DEEP_AUDIT_2026.md` and fix the P0 bugs.

---

*End of instructions.*
