# HEKA Calendar — Full Production / Closed-Testing Readiness Audit

**Date:** 2026-06-16  
**Auditor:** Kimi Code CLI  
**Branch audited:** `feature/recent-updates`  
**Working tree:** Dirty (86 changed files, untracked build logs/temp files/`google-services.json.bak`)  
**Scope:** Web app, Android (Capacitor), iOS (Capacitor), Tauri desktop, website (hekacalendar.com), legal pages, security, privacy, testing, accessibility, code quality.

---

## Executive Verdict

**Not ready for closed testing as-is.**

The project has a strong architectural foundation, good core calculation/test coverage, and many thoughtful optimizations, but it currently carries **critical security blockers** and **multiple platform/legal risks** that should be resolved before any testers install it or any build is submitted to Apple/Google.

My honest recommendation: **do not ship a closed-test build from this branch.** Treat the next 1–2 weeks as a hardening sprint focused on the items in §2 below, then re-audit before opening TestFlight or Google Play internal testing.

---

## 1. What is working well

- **Architecture:** React 18 + Vite 5 + TypeScript 5.9 with strict flags, Redux Toolkit, good domain separation.
- **Build tooling:** Vite manual code-splitting is well done (Firebase, PDF, astro, translations split into lazy chunks). `console.log`/`debugger` stripped in production, hashed assets, sourcemaps disabled.
- **Service worker:** Solid caching strategy with stale-asset kill-switch and HTML fallback guards.
- **Core logic:** Hooks, reducers, utilities, astrology calculations, and data layers have good test coverage (70–95%).
- **Notification engine:** Battery-aware, batched analytics, deduplication, tier caps, app-state aware.
- **Secrets pattern (current state):** `.env` and `server/.env.server` are gitignored; only `.env.example` templates are tracked.
- **Android release config:** Signing is conditional and fails loudly if keystore is missing; ProGuard/R8, NDK 28, targetSdk 35, cloud backup disabled.

---

## 2. Critical blockers — must fix before closed testing

### 2.1 Hardcoded Android signing keystore password in tracked source
- **Files:**
  - `scripts/verify-firebase-auth.ps1:9` → `$keystorePass = "#3areUnsto99abl3"`
  - `android/key.properties` → `storePassword`/`keyPassword = #3areUnsto99abl3`
- **Risk:** The release keystore password is in plaintext in a tracked PowerShell script and an untracked-but-present properties file. `android/key.properties` is **not covered** by `.gitignore` (only `android/app/key.properties` is ignored), so it is one accidental `git add -A` away from being committed. The keystore binary `android/heka-calendar.keystore` is also present locally.
- **Action:**
  1. Rotate the keystore password immediately in the Firebase/Play Console and regenerate the keystore if possible.
  2. Remove the password from `scripts/verify-firebase-auth.ps1`; read it from an env var or CI secret.
  3. Add `android/key.properties` to `.gitignore`.
  4. Ensure `android/heka-calendar.keystore` cannot be committed.
  5. If the keystore password was ever committed, scrub git history with `git-filter-repo`.

### 2.2 Firebase client config and `google-services.json` are in git history
- **Commits:** `bac4376` (`.env`, `android/app/google-services.json`) and `b2eebe5` (`android/app/google-services.json`).
- **Risk:** The full Firebase client configuration has been committed, including API keys, project number, project ID, storage bucket, web/Android app IDs, and OAuth client IDs. Even though the files are deleted now, they remain in git history.
- **Action:**
  1. Rotate **all** Firebase API keys and OAuth client secrets in the Firebase Console.
  2. Scrub git history or treat the repo as publicly exposed.
  3. Delete `android/app/google-services.json.bak` from disk.
  4. Verify `android/app/google-services.json` is properly ignored (it is not currently tracked, but the parent `.gitignore` rule should be confirmed).

### 2.3 iOS version is completely misaligned
- **File:** `ios/App/App.xcodeproj/project.pbxproj`
- **Finding:** iOS is `1.0 (build 1)` while Android/web/package/manifest are `2.2.23 (271)`.
- **Risk:** TestFlight upload will be rejected or will overwrite earlier builds incorrectly. Looks unprofessional and breaks version-based support.
- **Action:** Update `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` in Debug and Release to match Android (`2.2.23` / `271`).

### 2.4 AI Coach is flagged as a production liability internally
- **File:** `docs/AI_COACH_DEEP_AUDIT_2026.md`
- **Finding:** The internal audit identifies 7 P0 issues: memory leaks, race conditions, corrupted statistics on edit/delete, mood-average denominator bug, invalid mood mapped to euphoria, store subscription ignoring note content, and module-level mutable state.
- **Risk:** Crashes, wrong advice, corrupted user data, and poor tester experience.
- **Action:** Resolve the P0 items in that document, or disable the AI Coach for the closed test build.

### 2.5 In-app privacy policy contradicts the actual app
- **Files:** `public/privacy-policy.html` / `website/app/privacy-policy.html` (last updated 2026-05-07)
- **Finding:** The in-app privacy policy says AI is BYOK-only ("you provide your own API key"), but the app also uses the HEKA AI Proxy (`src/services/aiProxyClient.ts`, `server/ai-proxy.js`). This is a material misrepresentation.
- **Risk:** Privacy compliance / app-store rejection / user trust.
- **Action:** Unify the in-app privacy policy with the marketing privacy policy (`website/privacy.html`), or redirect `/app/privacy-policy.html` to `/privacy.html`.

### 2.6 Android App Links verification will fail
- **Files:** `public/.well-known/assetlinks.json`, `website/.well-known/assetlinks.json`
- **Finding:** Contains placeholder: `"sha256_cert_fingerprints": ["REPLACE_WITH_YOUR_SHA256_FINGERPRINT_NO_COLONS"]`.
- **Risk:** Domain verification fails; deep links/open-with intent handling breaks.
- **Action:** Replace with the real release certificate SHA-256 fingerprint before Google Play submission.

### 2.7 PWA manifest is not linked
- **Files:** `public/index.html`, `index.html`
- **Finding:** No `<link rel="manifest" href="/manifest.json">` in the HTML.
- **Risk:** Browsers will not offer "Install app" even though the manifest exists.
- **Action:** Add the manifest link.

---

## 3. High risks — strongly recommended to fix before closed testing

### 3.1 Version drift across platforms
| Platform | Current version |
|----------|-----------------|
| Web / Android / package.json / manifest | `2.2.23` |
| iOS | `1.0` |
| Tauri / Cargo | `2.2.1` |
| `public/version.json` / `website/app/version.json` | `2.2.0` |

- **Action:** Align all platforms and the `version.json` file to a single source of truth.

### 3.2 `USE_EXACT_ALARM` may fail Google Play review
- **File:** `android/app/src/main/AndroidManifest.xml`
- **Risk:** Google Play restricts `USE_EXACT_ALARM` to alarm-clock/calendar apps. If HEKA is a general reminder app, reviewers may reject it.
- **Action:** Remove `USE_EXACT_ALARM` and rely on `SCHEDULE_EXACT_ALARM` with runtime permission if needed.

### 3.3 Missing iOS permission usage strings
- **File:** `ios/App/App/Info.plist`
- **Risk:** No `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSMicrophoneUsageDescription`. If the web app requests these, iOS will crash.
- **Action:** Audit the web codebase for camera/photos/microphone usage and add the matching usage strings.

### 3.4 Tauri desktop is not ready for distribution
- **Files:** `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml`
- **Findings:** Version mismatch, no updater, no code signing, only `msi` target, identifier differs from mobile.
- **Action:** Bump version, add updater plugin, code-sign cert, and additional bundle targets (at minimum for Windows closed testing).

### 3.5 Unconditional Android logs in release builds
- **Files:** `android/app/src/main/java/com/heka/calendar/MainActivity.java`, `PdfPrintAdapter.java`, `PdfFilePrintAdapter.java`
- **Risk:** Logs file paths and byte counts in release builds.
- **Action:** Wrap all logs in `isDebug()` checks.

### 3.6 AI calls can bypass the backend proxy
- **Files:** `src/services/aiCoachLLM.ts`, `src/astrology/services/ai/aiProvider.ts`
- **Risk:** When users provide their own API keys, calls go directly to Groq/Anthropic/OpenAI from the client. On web/PWA, keys may be stored insecurely.
- **Action:** Enforce proxy-only mode for closed testing, or clearly warn users that BYOK on web stores keys in memory/localStorage.

### 3.7 `server/ai-proxy.js` CORS and rate-limiting gaps
- **Risk:** CORS defaults to `*` if origin env var is unset; rate limiting is in-memory and not shared across serverless instances; dev mode accepts any token.
- **Action:** Pin CORS origin in production, add Redis/external rate-limit store, and ensure `AI_PROXY_DEV_MODE` is never true in production.

### 3.8 `server/print-server.js` has no auth on PDF download
- **Risk:** PDFs are downloadable by UUID; no ownership check.
- **Action:** Add auth or short-lived signed URLs for PDF downloads.

### 3.9 Firestore rules have overly permissive paths
- **File:** `firestore.rules`
- **Risk:** `sharedTasks/{shareCode}` is world-readable; `energyVotes` and community collections have low abuse barriers.
- **Action:** Review and tighten these rules before external testers join.

### 3.10 Legal pages are inconsistent
- **Files:** `website/privacy.html` / `website/app/privacy-policy.html`; `website/terms.html` / `website/app/terms-of-service.html`
- **Findings:** Different dates, different scopes, different AI disclosures, different deletion SLAs.
- **Action:** Unify them or redirect the in-app versions to the marketing versions.

### 3.11 `version.json` is stale
- **Files:** `public/version.json`, `website/app/version.json`
- **Finding:** Reports `2.2.0` / 2026-03-27 while the app is `2.2.23`.
- **Action:** Regenerate/update as part of the build.

---

## 4. Performance and cross-device optimization

### Strong points
- Aggressive Vite chunking and lazy loading.
- `requestIdleCallback` for Swiss Ephemeris moon phases.
- Battery-aware notification scheduling.
- Touch/long-press handling with vibration feedback.
- Safe-area insets for notched devices.

### Weak points
| Issue | Impact |
|-------|--------|
| Main entry chunk ~982 KB JS + ~393 KB CSS first payload | Slow parse/compile on low-end phones |
| No `prefers-reduced-motion` gating on canvas/RAF animations (`StarfieldCanvas`, `BreathingMoon`, etc.) | Motion-sensitivity/accessibility failure; battery drain |
| `manifest.json` orientation locked to `portrait-primary` | Poor tablet/desktop PWA experience |
| No virtualization for long lists (journal, tasks, messages) | Scroll jank with large datasets |
| `calculateTrueSolarReturn` runs synchronously in `useMemo` | Main-thread jank when TRUE mode + profile active |
| AI Coach typewriter updates React state every 15–35 ms | Many re-renders for long messages |
| Main CSS is render-blocking and large | First paint delay |
| No WebP/AVIF or srcset usage | Limited, but could be improved |
| No bundle analyzer / size budgets in CI | Bundle growth unguarded |

### Wearables / tiny screens
- Not addressed at all. No watch-specific styles or pairing logic.

---

## 5. Native build readiness

### Android
- **Status:** Near ready for internal testing once blockers above are fixed.
- **Gaps:** Windows-only `\gradlew` npm scripts, CI builds debug APK only (no signed AAB), `USE_EXACT_ALARM` risk, unconditional logs.

### iOS
- **Status:** **Not ready** for TestFlight.
- **Gaps:** Version mismatch, no development team set, missing camera/photo/mic usage strings.

### Tauri
- **Status:** Partial (Windows-only, unsigned).
- **Gaps:** Version mismatch, no updater, no code signing, only MSI target.

---

## 6. Website and legal pages

### Marketing site (`website/`)
- Good meta tags, OG/Twitter, canonical URLs, Schema.org JSON-LD, sitemap, robots.txt.
- Missing `security.txt`.
- Heading hierarchy has minor issues.
- No cookie consent banner despite functional cookies on invite/task pages.

### Legal pages
- Marketing `privacy.html` and `terms.html` are comprehensive and recently updated (2026-06-15 / 2026-06-13).
- In-app `privacy-policy.html` / `terms-of-service.html` are older, shorter, and inconsistent.
- Account deletion page only describes email deletion, not the in-app flow.

### Domain/verification
- `assetlinks.json` SHA256 fingerprint is a placeholder.
- `__FIREBASE_API_KEY__` placeholder in invite/task pages must be substituted at deploy time.

---

## 7. Testing and code quality

### Coverage snapshot
| Metric | Value |
|--------|-------|
| Statements | 27.76% |
| Branches | 73.32% |
| Functions | 49.08% |

### Key gaps
- **UI components:** ~13% coverage. Large parts of `day-panel`, `notification`, `onboarding/v3`, `oracle`, `print`, `report`, `tutorial`, `astrology/components/**` are **0%** covered.
- **E2E:** Only Chromium desktop, happy-path smoke tests. No real auth, no mobile viewports, no offline/PWA tests.
- **Linting:** ESLint exists but is **not enforced** (no lint script, not run in CI). `npx eslint src` reports **451 issues** (129 errors, 322 warnings).
- **Formatting:** No Prettier config, no Husky/lint-staged.
- **Type safety:** Strict TS config, `tsc` passes, but many `any` usages, especially in AI/report/astrology persistence paths.
- **Accessibility:** Some ARIA/focus patterns, but no automated a11y tests (`jest-axe` / `axe-core` not used).
- **i18n:** 30 languages supported, but hardcoded English strings remain in `src/types/index.ts`, `ErrorBoundary.tsx`, etc.
- **Circular dependencies:** 10 cycles detected, notably in the notification/store graph.
- **Giant files:** Many files exceed 1,000 lines, including `DayPanel.tsx`, `FriendsModal.tsx`, `App.tsx`, `StarsHub.tsx`, etc.

---

## 8. Security and privacy summary

### Critical
- Hardcoded keystore password in tracked script and local properties file.
- Firebase config in git history.

### High
- Direct client-side LLM calls bypass proxy when BYOK is used.
- In-memory rate limiting in AI proxy.
- Print server PDF downloads unauthenticated.
- Inconsistent privacy policy around AI Proxy.

### Medium
- CORS defaults to `*` if unset.
- `sharedTasks` / `energyVotes` / community Firestore rules are permissive.
- Prompt logging truncates but does not fully redact PII (birth data, locations, journal snippets).
- HSTS/CSP missing on `website/assets/_headers`.

### Good
- `.env` / `.env.server` are gitignored.
- AI proxy centralizes keys and authenticates callers.
- Auth re-authentication required for sensitive actions.
- Cloud backup disabled on Android.

---

## 9. Recommended hardening sprint (priority order)

1. **Security emergency**
   - Rotate Firebase keys and OAuth secrets.
   - Rotate Android keystore password; remove from tracked scripts.
   - Delete `google-services.json.bak` and untracked build artifacts.
   - Add `android/key.properties` to `.gitignore`.
   - Decide whether to scrub git history.

2. **Platform version alignment**
   - iOS → `2.2.23 (271)`.
   - Tauri → `2.2.23`.
   - `version.json` → `2.2.23`.

3. **iOS readiness**
   - Set development team.
   - Add missing usage strings.
   - Verify Capacitor sync and archive build.

4. **Android Play-readiness**
   - Review/remove `USE_EXACT_ALARM`.
   - Replace `assetlinks.json` SHA256 placeholder.
   - Gate unconditional logs.
   - Verify signed release AAB build end-to-end.

5. **PWA basics**
   - Add `<link rel="manifest">`.
   - Fix `portrait-primary` orientation for tablets/desktops.
   - Gate canvas animations on `prefers-reduced-motion`.

6. **AI Coach**
   - Fix P0 issues from `docs/AI_COACH_DEEP_AUDIT_2026.md` or disable for closed test.
   - Enforce proxy-only mode on web/PWA.

7. **Legal consistency**
   - Unify in-app privacy/terms with marketing versions.
   - Update account-deletion page to mention in-app deletion.
   - Add data retention section.

8. **Quality gates**
   - Add `npm run lint` to CI and fix the 129 ESLint errors.
   - Add Prettier or equivalent formatting rules.
   - Add at least one axe-based accessibility test.
   - Add mobile viewport E2E project in Playwright.

9. **Tauri (if desktop is in scope)**
   - Add updater, code signing, and broader bundle targets.

10. **Testing investment**
    - Target high-traffic UI components first (`DayPanel`, `SetupWizard`, modals, onboarding v3).
    - Resolve circular dependencies.

---

## 10. Honest bottom line

**Is HEKA Calendar close?** Yes — the hard engineering work is largely done. The architecture is sound, the app is feature-rich, and the optimization work is thoughtful.

**Is it ready for closed testing today?** No. The combination of exposed secrets in git history, a hardcoded keystore password, iOS version mismatch, and the AI Coach production-liability memo means a closed test right now would carry unnecessary security, compliance, and reputational risk.

**My recommendation:** Run a 1–2 week hardening sprint on the critical/high items above, then re-audit. If you need to get something into testers' hands urgently, consider an **Android-only internal test build with AI Coach disabled**, after rotating secrets and fixing the keystore password issue.

---

*End of audit.*
