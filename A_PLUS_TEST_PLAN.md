# A+ Quality Test Plan — HEKA Calendar Pro

## Current State (Post-Phase 8)

| Metric | Value | Grade |
|--------|-------|-------|
| Total tests | 1,486 | B+ |
| Test files | 60 | B+ |
| Line coverage | 10.78% | D |
| Branch coverage (tested modules) | 69% | B |
| Component tests (.test.tsx) | 0 | F |
| Hook tests | 3/13 | D |
| E2E tests | 0 | F |
| Known bugs in tested code | 3 | C |
| CI coverage enforcement | None | D |

**Why 10.78% line coverage?** 137,924 lines in `src/`, but ~80,000 are React JSX that receive zero test execution. The 60 test files only exercise services, reducers, and utilities.

---

## The A+ Gap

An A+ app does not mean "every line tested." It means:

1. **Zero known bugs** — we fix what we find, not test around it
2. **Data never disappears** — journal entries, settings, auth state are bulletproof
3. **Core flows never break** — onboarding → calendar → day panel → note → settings
4. **CI prevents regressions** — coverage thresholds gate every PR
5. **User-facing logic is verified** — hooks and components that touch Redux are tested

---

## Source Bugs to Fix (Phase A)

These were discovered during Phase 8 and currently have tests adjusted to match buggy behavior:

1. **`progressReducers.ts` — `discoverFeature` is silently broken**
   - `ensureFeatureDiscovery()` returns `{}` (empty object)
   - `if (feature in discovery)` is **always false**
   - `featureDiscovery.openedDateModal` is never set to `true`
   - **Fix:** Remove the `if (feature in discovery)` guard or pre-populate the object

2. **`progressReducers.ts` — `trackAppOpen` double-counts first open**
   - `ensureAppEngagement()` initializes `totalAppOpens: 1`
   - Then `trackAppOpen` increments to `2`
   - First open counts as two opens
   - **Fix:** Initialize to `0` or don't increment on first-ever open

3. **Timezone drift in date math**
   - Timestamp `1718400000000` (2024-06-15T00:00:00Z) produces `lastOpenDate: '2024-06-14'`
   - Indicates `new Date().toISOString().split('T')[0]` is not UTC-normalized
   - **Fix:** Audit all date math to use a consistent UTC helper

---

## Proposed Implementation Phases

### Phase A — Source Bug Fixes (1 day)
- Fix `discoverFeature` guard
- Fix `trackAppOpen` initialization
- Audit + fix timezone normalization in date helpers
- Update affected test expectations to assert CORRECT behavior
- **Deliverable:** 3 source files fixed, all existing tests still pass

### Phase B — Remaining Redux Slice Tests (2 days)
Four slices have zero coverage. These are the highest-ROI targets because they are pure reducer logic.

| Slice | Lines | Tests Est. | File |
|-------|-------|------------|------|
| `setupSlice` | 137 | 12 | `tests/setupSlice.test.ts` |
| `diarySlice` | 675 | 35 | `tests/diarySlice.test.ts` |
| `friendsSlice` | 427 | 28 | `tests/friendsSlice.test.ts` |
| `calendarSlice` (rehydrate) | 845* | 10 | `tests/calendarSlice.test.ts` |

*calendarSlice is mostly re-exported reducers already tested; only `rehydrateState` and action exports need coverage.

**Diary slice testing strategy:**
- Mock `journalDatabase` module (Dexie/IndexedDB)
- Test async thunks: `initDiary`, `createDiaryEntry`, `updateDiaryEntry`, `deleteDiaryEntry`, `syncDiary`, `searchDiary`
- Test selectors: `selectAllEntries`, `selectEntriesByDate`, `selectEntryById`
- Test reducer cases: loading states, error states, sync success

**Friends slice testing strategy:**
- Mock `friendsService` and `taskShareService`
- Test async thunks: `generateInviteCode`, `acceptInvite`, `sendFriendRequest`, etc.
- Test reducer cases: friend add/remove, message threads, task sharing, theme changes

**New tests: ~85** | **New files: 4**

### Phase C — Redux Hook Tests (2 days)
10 hooks interact with Redux. Only `useTypewriter` is tested (and it's pure). We need `@testing-library/react` + a mock Redux Provider wrapper.

| Hook File | Hooks | Tests Est. | Test File |
|-----------|-------|------------|-----------|
| `useDiary.ts` | 5 | 25 | `tests/useDiary.test.ts` |
| `useGamification.ts` | 5 | 30 | `tests/useGamification.test.ts` |
| `useTutorial.ts` | 4 | 20 | `tests/useTutorial.test.ts` |

**Testing strategy:**
- Create a `renderWithProviders()` wrapper that mounts hooks with a mock store
- For `useDiaryStats`: verify streak math, word counts, insight ratings
- For `useDiarySearch`: verify term matching, case insensitivity, insight text search
- For `useGamification`: verify `discoverFeature` deduplication, achievement checking, level progress
- For `useTutorial`: verify step progression, completion tracking

**New tests: ~75** | **New files: 3**

### Phase D — Critical Component Tests (2 days)
We do NOT test all 181 components. We test the 6 where a bug would feel "cheap" to a user:

| Component | Lines | Why Critical |
|-----------|-------|--------------|
| `CalendarGrid.tsx` | 600 | Primary UI — every user sees this first |
| `DayPanel.tsx` | 1,341 | Day detail — notes, astrology, moon data |
| `AuthModal.tsx` | 568 | Auth flow — sign in / sign up |
| `SettingsPanel.tsx` | 556 | Settings persistence |
| `QuickNoteModal.tsx` | ~300 | Fastest user action (add note) |
| `WelcomeModal.tsx` | ~200 | First impression |

**Testing strategy:**
- `@testing-library/react` with mocked Redux store
- Mock child components to isolate the target
- Test: renders without crash, responds to props, fires correct actions on interaction
- Do NOT test visual polish (CSS, animations) — test behavior and data flow

**New tests: ~60** | **New files: 6**

### Phase E — E2E with Playwright (3 days)
The ultimate confidence layer. Six core user flows:

1. **Onboarding → Calendar**
   - First visit shows welcome/setup
   - Complete setup wizard
   - Calendar grid renders with current month
   - Celestial data visible

2. **Add & Retrieve Journal Entry**
   - Click a day → open day panel
   - Write note → save
   - Reload page → note still present
   - Search finds the note

3. **Settings Persistence**
   - Change theme
   - Change location
   - Change zodiac system
   - Reload → all settings retained

4. **Astrology Integration**
   - Open celestial panel
   - View moon phase
   - View transits for selected date
   - Switch between 12-sign / 13-sign

5. **Auth Flow**
   - Sign in modal opens
   - (Mocked) auth state changes
   - Pro features unlocked for admin

6. **Planner Task Lifecycle**
   - Add task to a day
   - Mark complete
   - Delete task
   - Verify day is clean

**New tests: ~36** | **New files: 2** (`e2e/critical-flows.spec.ts`, `e2e/auth-and-settings.spec.ts`)

### Phase F — CI Coverage Gates (0.5 days)
- Add coverage thresholds to `vitest.config.ts`:
  - `lines: 25` (up from 10.78)
  - `functions: 50`
  - `branches: 70`
- Update `.github/workflows/ci.yml` to run `npm run test:coverage`
- Upload coverage report as artifact
- **These thresholds ratchet upward over time.**

---

## Final Numbers

| Phase | New Tests | New Files | Days Est. |
|-------|-----------|-----------|-----------|
| A — Bug fixes | 0 (fixes) | 0 | 1 |
| B — Slice tests | ~85 | 4 | 2 |
| C — Hook tests | ~75 | 3 | 2 |
| D — Component tests | ~60 | 6 | 2 |
| E — E2E (Playwright) | ~36 | 2 | 3 |
| F — CI gates | 0 | 0 | 0.5 |
| **TOTAL** | **~256** | **15** | **10.5** |

**Grand total after plan: ~1,742 tests across ~75 files**

---

## What Changes in Coverage

| Metric | Before | After Target |
|--------|--------|--------------|
| Line coverage | 10.78% | ~25% |
| Function coverage | 41.25% | ~55% |
| Branch coverage | 69.22% | ~72% |
| Tested slices | 7/12 | 11/12 |
| Tested hooks | 3/13 | 13/13 |
| Component tests | 0 | 6 critical |
| E2E flows | 0 | 6 |
| CI gates | None | Yes |

> **Note:** Line coverage will never reach 80%+ without testing all 181 components. That is intentional. We are trading breadth for depth — testing the code that matters, not decorative JSX.

---

## Alternative Approaches

### Option 1: Full A+ (Recommended)
Execute all 6 phases as written. 10.5 days, ~256 new tests, Playwright E2E, CI gates.

### Option 2: Fast A+ (Minimum viable)
Skip component tests (Phase D). Focus on: bugs + slices + hooks + E2E + CI.
- 6.5 days, ~196 new tests
- E2E covers what component tests would have caught
- Slightly less precise debugging when tests fail

### Option 3: Deep A+ (Maximum rigor)
Add ALL 13 hooks, ALL 5 slices, 10 components, 10 E2E flows, visual regression tests.
- 16 days, ~400 new tests
- Overkill for current stage; better to ship and iterate

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Diary async thunks hard to mock | Medium | Already have `journalDatabase.test.ts` proving the DB layer works; mock at module boundary |
| Friends Firebase thunks flaky | Medium | Mock `friendsService` at module level; never hit real Firebase in tests |
| Playwright setup conflicts with Capacitor | Low | Playwright tests the web build; Capacitor uses the same dist/ output |
| Component tests too slow | Low | Mock heavy child components; only test data flow, not rendering depth |
| Time estimate slips | Medium | Phases are independent; can ship B+C first, add E2E later |
