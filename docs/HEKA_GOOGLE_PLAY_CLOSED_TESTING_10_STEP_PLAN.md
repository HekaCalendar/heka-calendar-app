# HEKA Calendar — 10-Step Plan for Google Play Closed Testing

**Goal:** Get the Android build ready for a Google Play **Closed Testing** track submission.  
**Current version:** `2.2.23 (271)`  
**Date:** 2026-06-16

This plan focuses on the **Android / Google Play** path. It assumes you will **not** open TestFlight yet; iOS is intentionally a secondary concern here.

---

## Step 1 — Security emergency: rotate secrets and remove hardcoded credentials

**Why:** A signing-keystore password in source and Firebase config in git history are release blockers.

**Source findings:**
- `scripts/verify-firebase-auth.ps1:9` hardcodes `$keystorePass = "#3areUnsto99abl3"`.
- `android/key.properties` (the file Gradle actually reads) contains the same plaintext password.
- `.gitignore` only covers `android/app/key.properties`, **not** `android/key.properties`.
- Git history contains `.env` and `android/app/google-services.json` (commits `bac4376` and `b2eebe5`).
- `android/app/google-services.json.bak` is sitting untracked on disk.

**Actions for you:**
1. In the Firebase Console, rotate **every** API key and OAuth client secret that has ever been in this repo.
2. In the Google Play Console, rotate the upload/app-signing credentials if the keystore password was ever exposed.
3. Change the Android keystore password. Generate a new keystore if you can afford to (if Play App Signing manages the final signing key, rotating the upload keystore is easier).
4. Delete `android/app/google-services.json.bak` and all untracked build logs/temp files.
5. Decide whether to scrub git history (`git-filter-repo`) or treat the repo as publicly exposed and rely on rotated credentials.

**Files to update:**
- `scripts/verify-firebase-auth.ps1` — read password from env var, do not hardcode.
- `android/key.properties` — keep locally, but regenerate with the new password.
- `.gitignore` — add `android/key.properties` so it cannot be committed accidentally.

---

## Step 2 — Clean the dirty working tree

**Why:** You cannot cut a reproducible release build from a dirty tree.

**Current state:** 86 changed files, many deleted/untracked `website/app/assets` plus build logs, temp files, and `.bak` files.

**Actions for you:**
1. Review `git status`.
2. If the `website/app/assets` churn is just a normal build refresh, run a clean `npm run build` and commit the refreshed assets.
3. Delete all untracked files that are not meant for release (`build_log_*.txt`, `temp_*.json`, `google-services.json.bak`, `output/` if not needed in repo).
4. Decide whether `output/` (AAB artifacts) belongs in git or should be moved to CI artifacts. Best practice: remove it from git and store AABs in CI/CD or cloud storage.
5. Commit or stash everything so `git status` is clean before the release build.

**Files to delete:**
- `android/app/google-services.json.bak`
- `build_log.txt`, `build_log_v252.txt`, `build_log_v253.txt`, `build_log_v254.txt`, `build_log_v254_final.txt`, `build_log_v254_nodaemon.txt`, `build_log_v254_symbols.txt`, `build_log_v255.txt`
- `temp_clean_celestial.json`, `temp_clean_en.json`, `temp_en_backup.json`
- Consider removing `output/` from git (add to `.gitignore`).

---

## Step 3 — Fix Android signing configuration

**Why:** Gradle currently has two overlapping signing sources (`key.properties` and `gradle.properties` env vars). This is fragile and the error message points to the wrong file path.

**Source findings:**
- `android/app/build.gradle:42-50` reads from `rootProject.file('key.properties')` → this is `android/key.properties`.
- `android/gradle.properties:16-19` uses `${RELEASE_STORE_PASSWORD}` env-var interpolation.
- `android/app/build.gradle:64` error says "Create android/app/key.properties" but the code reads `android/key.properties`.

**Actions for you:**
1. Standardize on **one** source of truth. Recommended: keep `android/key.properties` and delete the `RELEASE_*` entries from `android/gradle.properties`.
2. Verify the keystore path inside `android/key.properties` is correct (`storeFile=../heka-calendar.keystore` resolves to `android/heka-calendar.keystore`).
3. Fix the Gradle error message to say `android/key.properties`.
4. Test a release bundle build locally with the new password:
   ```bash
   npm run build
   npx cap sync android
   cd android && ./gradlew bundleRelease
   ```

**Files to update:**
- `android/gradle.properties` — remove `RELEASE_*` lines.
- `android/app/build.gradle` — fix error message text.

---

## Step 4 — Review and fix Android permissions

**Why:** `USE_EXACT_ALARM` is restricted by Google Play to alarm-clock/calendar apps. HEKA is more likely to be classified as a general calendar/reminder app.

**Source finding:**
- `android/app/src/main/AndroidManifest.xml:103` declares `<uses-permission android:name="android.permission.USE_EXACT_ALARM" />`.

**Action for you:**
1. Remove `USE_EXACT_ALARM` and rely on `SCHEDULE_EXACT_ALARM` (already declared on line 102) with runtime permission checks.
2. Verify notification scheduling still works on Android 12+ after removal.
3. If you genuinely believe HEKA qualifies for `USE_EXACT_ALARM`, prepare a Play Console declaration and supporting video/screenshots.

**Files to update:**
- `android/app/src/main/AndroidManifest.xml` — delete the `USE_EXACT_ALARM` line.

---

## Step 5 — Fix Android App Links / Digital Asset Links

**Why:** Domain verification will fail with the placeholder fingerprint, breaking `/invite` and `/task` deep links.

**Source finding:**
- `public/.well-known/assetlinks.json:6` has `"sha256_cert_fingerprints": ["REPLACE_WITH_YOUR_SHA256_FINGERPRINT_NO_COLONS"]`.
- `website/.well-known/assetlinks.json` has the same placeholder.

**Actions for you:**
1. Get the **Google Play App Signing** SHA-256 fingerprint from Play Console → Release → Setup → App integrity.
2. Replace the placeholder in both files.
3. Host the file at `https://hekacalendar.com/.well-known/assetlinks.json` with `Content-Type: application/json` and no redirects.
4. Verify with Google's tool:
   ```bash
   npx @digitalassetlinks/statement-list hekacalendar.com
   # or
   curl https://hekacalendar.com/.well-known/assetlinks.json
   ```

**Files to update:**
- `public/.well-known/assetlinks.json`
- `website/.well-known/assetlinks.json`

---

## Step 6 — Fix the in-app privacy policy (AI disclosure)

**Why:** The in-app privacy policy says AI is BYOK-only and that you are "not an intermediary," but the app ships with a HEKA AI Proxy (`server/ai-proxy.js`, `src/services/aiProxyClient.ts`). This is a material misrepresentation for Google Play's Data Safety form and could cause a takedown.

**Source findings:**
- `public/privacy-policy.html:333-335`: "you provide your own API key... We are not an intermediary."
- `src/services/aiCoachLLM.ts:394-429`: calls Groq/Anthropic/OpenAI directly using the user's stored API key; the proxy client is **not wired in**.
- `src/services/aiProxyClient.ts`: proxy client exists but is unused by the AI Coach LLM path.

**Actions for you:**
1. Decide the closed-testing AI policy:
   - **Option A (recommended for closed test):** Disable the AI Coach entirely for the Google Play build, or keep it template-only (no LLM calls). This removes the disclosure risk entirely.
   - **Option B:** Wire `aiCoachLLM.ts` to use `chatViaProxy()` when `VITE_AI_PROXY_URL` is set, and update the privacy policy to describe the HEKA AI Proxy accurately.
2. Update `public/privacy-policy.html` and `website/app/privacy-policy.html` to match the marketing `website/privacy.html`.
3. Add data retention language to the privacy policy.
4. Update `PLAY_STORE_DATA_SAFETY.md` to match the final policy.

**Files to update:**
- `public/privacy-policy.html`
- `website/app/privacy-policy.html` (or replace it with a copy of `website/privacy.html`)
- `src/services/aiCoachLLM.ts` (if wiring proxy)
- `PLAY_STORE_DATA_SAFETY.md`

---

## Step 7 — Stabilize or disable the AI Coach

**Why:** Your internal audit (`docs/AI_COACH_DEEP_AUDIT_2026.md`) calls the AI Coach a "production liability" with P0 memory leaks, race conditions, and statistics corruption.

**Source findings:**
- `src/components/CalendarAICoach.tsx` is 765 lines with mutable refs, subscription cleanup that may miss zone changes, and direct LLM calls.
- `src/services/aiCoachLLM.ts` does not use the proxy.

**Actions for you:**
1. For the fastest path to closed testing: **disable AI Coach LLM calls** and fall back to the template path.
2. If you want AI in closed testing: fix the P0 issues from the internal audit and wire LLM calls through the proxy.
3. Ensure `aiConfigService` defaults to `provider: 'template'` and `globalEnabled: false` (it already does, but verify the closed-test build cannot accidentally enable BYOK).

**Files to update:**
- `src/services/aiCoachLLM.ts`
- `src/components/CalendarAICoach.tsx`
- `src/services/aiConfigService.ts` (if changing defaults)

---

## Step 8 — Fix PWA basics that also affect the Android WebView install experience

**Why:** The manifest exists but is not linked. The orientation lock hurts tablets. These are low-effort fixes that improve installability and reviews.

**Source findings:**
- `public/index.html` has no `<link rel="manifest" href="/manifest.json">`.
- `public/manifest.json:9` declares `"orientation": "portrait-primary"`.
- `public/version.json` / `website/app/version.json` still say `2.2.0`.

**Actions for you:**
1. Add `<link rel="manifest" href="/manifest.json">` to `public/index.html` and `index.html`.
2. Change manifest orientation to `"any"` or `"natural"` so tablets/desktops work.
3. Update `public/version.json` and `website/app/version.json` to `2.2.23` with today's date.
4. Add an `apple-touch-icon` for iOS "Add to Home Screen" (even if iOS is not in this closed test, it is quick).

**Files to update:**
- `public/index.html`
- `index.html` (if it exists and is used)
- `public/manifest.json`
- `public/version.json`
- `website/app/version.json`

---

## Step 9 — Harden the backend services for the closed test

**Why:** If the closed test uses the AI Proxy or cloud functions, they need to be production-safe.

**Source findings:**
- `server/ai-proxy.js:25` defaults CORS to `*` if `AI_PROXY_CORS_ORIGIN` is unset.
- `server/ai-proxy.js:129` has `AI_PROXY_DEV_MODE` which accepts any token.
- `server/ai-proxy.js:62` rate limiting is in-memory and not shared across serverless instances.
- `server/ai-proxy.js:208` reports version `2.2.16` (stale).
- `server/print-server.js` has no auth on PDF downloads.

**Actions for you:**
1. Set `AI_PROXY_CORS_ORIGIN` to your production domain in Vercel/env.
2. Ensure `AI_PROXY_DEV_MODE` is **never** `true` in production.
3. Add an external rate-limit store (Redis/Upstash) or keep per-instance limits conservative and monitor.
4. Update the `/health` version string to `2.2.23`.
5. Add auth or short-lived signed URLs to the print-server PDF download endpoint.
6. Review `firestore.rules` for `sharedTasks`, `energyVotes`, and community collections.

**Files to update:**
- `server/ai-proxy.js`
- `server/print-server.js`
- `firestore.rules`

---

## Step 10 — Produce a signed release AAB and run Play Console pre-launch checks

**Why:** Google Play requires a signed release AAB for closed testing. Your current CI only builds a debug APK.

**Source findings:**
- `package.json:27`: `"android:bundle": "npm run build && npx cap sync android && cd android && .\\gradlew bundleRelease"` uses a Windows-only path.
- `.github/workflows/build-android.yml` builds a debug APK only.
- No CI job produces a signed release AAB.

**Actions for you:**
1. Fix the npm scripts to be cross-platform or document the manual commands:
   ```bash
   npm run build
   npx cap sync android
   cd android
   ./gradlew bundleRelease
   ```
2. Verify the release AAB builds and signs correctly with your new keystore.
3. Upload the AAB to Google Play **Internal Testing** first (not Closed Testing), install it on a physical device, and verify:
   - App launches.
   - Sign-up / sign-in works.
   - Calendar loads.
   - Notifications schedule.
   - Deep links (`https://hekacalendar.com/invite/...`) open the app.
   - No crash on first launch.
4. Move to **Closed Testing** only after Internal Testing passes.
5. Fill out the Play Console Data Safety form using the finalized privacy policy.
6. Submit the app content questionnaire (content rating, target audience, etc.).

**Files to update:**
- `package.json` (cross-platform scripts)
- `.github/workflows/build-android.yml` (optional: add signed AAB CI later)

---

## Post-plan checklist before you press "Submit"

- [ ] `git status` is clean.
- [ ] Firebase keys and keystore password rotated.
- [ ] `android/key.properties` is in `.gitignore` and not tracked.
- [ ] `USE_EXACT_ALARM` removed.
- [ ] `assetlinks.json` SHA-256 fingerprint is real and hosted.
- [ ] Privacy policy is consistent and accurate.
- [ ] AI Coach is either disabled or fully proxy-only and P0-fixed.
- [ ] Manifest link added, orientation sensible, `version.json` current.
- [ ] Signed release AAB (`bundleRelease`) builds locally without errors.
- [ ] Internal Testing track tested on a real Android device.
- [ ] Play Console Data Safety form matches the privacy policy.

---

## Files you must delete or regenerate

**Delete from disk (not tracked, but present):**
- `android/app/google-services.json.bak`
- `build_log.txt` and all `build_log_v*.txt`
- `temp_clean_celestial.json`, `temp_clean_en.json`, `temp_en_backup.json`
- Consider deleting `output/` from git history and adding it to `.gitignore`.

**Regenerate (rotate secrets):**
- `android/heka-calendar.keystore` (new password or new keystore)
- `android/key.properties` (new password)
- `android/app/google-services.json` (download fresh from Firebase Console after rotating keys)

**Delete from git history (or rotate and accept exposure):**
- Old `.env` and `android/app/google-services.json` commits (`bac4376`, `b2eebe5`).

---

*End of plan.*
