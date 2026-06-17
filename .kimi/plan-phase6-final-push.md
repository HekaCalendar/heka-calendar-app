# Phase 6 Final Push — Remaining Enterprise Audit Items

## Current State
- **Build:** 0 TypeScript errors ✅
- **Tests:** 147/147 pass ✅
- **Backup tag:** `backup/pre-phase6-final-push-20260519-1625`
- **Branch:** `feature/recent-updates`

## Scope

Three priority items identified:
1. `swiss-ephemeris/engine.ts` — 21 `any` type occurrences → proper interfaces
2. `CalendarAICoach.tsx` — 6 `any` type occurrences + latent `.title` vs `.name` bug
3. `notificationEngine.ts` — 2,349-line god object → 4 extracted modules + thin facade

---

## Approach A: Sequential Conservative (Recommended)

Do the work in three ordered passes, building and testing after each.
This minimizes risk and makes rollback trivial (stash per pass).

### Pass 1: engine.ts Type Safety (~45 min)
**File:** `src/astrology/services/swiss-ephemeris/engine.ts`
**Impact:** 21 `any` → proper types. Eliminates type blindness at the astrology calculation boundary.

**New interfaces to add (internal to file):**
```ts
interface CalcUtResult { longitude: number; latitude: number; distance: number; longitudeSpeed: number; ... }
interface HousesResult { error: number | null; ascendant: number; mc: number; [index: number]: number; }
interface RiseTransitResult { rise: number | null; transit: number | null; set: number | null; error?: number | null; }
interface SwissModule { julday: ...; calc_ut: ...; houses_ex: ...; ... }
interface PlanetCalculationResult { id: string; longitude: number; latitude: number; distance: number; speed: number; isRetrograde: boolean; sign: string; degreeInSign: number; }
interface HousesCalculationResult { ascendant: number; mc: number; ic: number; dsc: number; cusps: Array<{ longitude: number; sign: string }>; }
interface RiseTransitSetResult { rise: number | null; transit: number | null; set: number | null; }
```

**Key changes:**
- `let swissModule: any = null` → `SwissModule | null`
- `calc_ut(...): any` → `CalcUtResult`
- `houses_ex(...): any` → `HousesResult`
- `let swissephModule: any` → `unknown`
- `wrapModule(Module: any): any` → `wrapModule(Module: unknown): SwissModule`
- `calculateAllPlanetPositions(jd: number): Map<number, any>` → `Map<number, CalcUtResult>`
- `calculateAllPlanets(...): any` → `Record<string, PlanetCalculationResult>`
- `calculateHouses(...): any` → `HousesCalculationResult`
- `calculateRiseTransitSet(...): any` → `RiseTransitSetResult`
- `generateNatalChart(params: any): Promise<any>` → `generateNatalChart(params: ChartParams): Promise<GeneratedNatalChart>`

**Risk:** Low. These are internal engine types. Consumers call the exported functions; their signatures will become more precise, which may surface latent type mismatches in callers. We'll fix any caller errors that emerge.

---

### Pass 2: CalendarAICoach.tsx `any` Cleanup (~30 min)
**File:** `src/components/CalendarAICoach.tsx`
**Impact:** 6 `any` → proper types. Fixes potential `.title` vs `.name` latent bug.

**Changes:**
1. `let celestialState: any = null` → `let celestialState: CelestialState | null = null`
2. `.filter((p: any) => ...)` / `.map((p: any) => ...)` → `.filter((p: CelestialBody) => ...)` / `.map((p: CelestialBody) => ...)`
3. `task: any` in `onTaskCreated` → `task: PlannerTask`
4. `task: any` in `onTaskCompleted` → `task: PlannerTask`
5. `achievement: any` in `onAchievementUnlocked` → `achievement: UnlockedAchievement`
6. **Bug fix:** The code accesses `ach.title`, but `UnlockedAchievement` (from `gamificationService.ts`) defines the field as `.name`. Verify and fix to `ach.name`.

**Risk:** Low. The types already exist in the codebase. The `UnlockedAchievement` conflict is a latent runtime bug fix.

---

### Pass 3: notificationEngine.ts Modularization (~90 min)
**File:** `src/services/notificationEngine.ts` (2,349 lines)
**Impact:** Split into 4 new modules + thin facade. Reduces per-module complexity by ~75%.

**Existing helper modules (untouched):**
- `notificationFatigue.ts`, `notificationAnalytics.ts`, `notificationBundling.ts`
- `notificationChannels.ts`, `notificationRichContent.ts`, `notificationScheduling.ts`
- `notificationSnooze.ts`, `notificationBadge.ts`, `notificationTemplates.ts`

**New modules to create:**

#### A. `notificationState.ts` (~80 lines)
- Move: `ENGINE_STORAGE_KEY`, `GENIUS_QUEUE_KEY`, `getTodayKey()`, `loadEngineState()`, `saveEngineState()` (with 500ms debounce)
- Exports: `loadEngineState()`, `saveEngineState()`, `getTodayKey()`

#### B. `notificationDelivery.ts` (~280 lines)
- Move: `schedule()`, `cancel()`, `cancelByType()`, `cancelAll()`, `getScheduledIds()`, `getWebScheduledMeta()`, `showWebNotification()`, `shouldDeliver()`, `recordSent()`, `rollbackLedgerEntry()`, `confirmDelivery()`, `recordDelivery()`, `isNativePluginAvailable()`
- Exports: `NotificationDelivery` class (or pure functions)
- Dependencies: `LocalNotifications` plugin, `eventBus`, `notificationFatigue`, `notificationScheduling`, `notificationRichContent`, `notificationAnalytics`, `notificationBadge`

#### C. `notificationGenius.ts` (~450 lines)
- Move: `GeniusProposal`, `AstronomicalContext`, `getAstronomicalContext()`, `injectAstronomicalContext()`, `scoreNotification()`, `updateEngagement()`, `scheduleGenius()`, `flushGeniusQueue()`, `findCombinable()`, queue persistence helpers
- Exports: `NotificationGenius` class
- Dependencies: Swiss Ephemeris calculations, `notificationTemplates`, `notificationBundling`, `notificationDelivery` (for final schedule call)

#### D. `notificationCheckers.ts` (~1,100 lines)
- Move: All 13+ checker methods (`checkHekaTransitions`, `checkVoidMoon`, `checkMoonDegree`, `checkTrackerReminders`, `checkHolidayReminders`, `checkTaskDueReminders`, `checkCelestialInsights`, `checkEveningReflection`, `checkNewYearReminders`, `checkSolsticeEquinoxReminders`, `checkMonthStartReminders`, `checkNewMoonReminders`, `checkFullMoonReminders`, `scheduleSunriseWakeUp`), `getSolsticeEquinoxName()`, `capitalize()`
- Exports: Individual checker functions
- Refactoring pattern: Each checker currently calls `this.scheduleTemplated(...)`. After extraction, they accept a `send` callback:
  ```ts
  export async function checkHolidayReminders(
    send: ScheduleTemplatedFn,
    flags: { hasSentToday; markSentToday }
  ): Promise<void> { ... }
  ```

#### E. `notificationEngine.ts` — Retained as thin facade (~350 lines)
- What stays: Singleton export, public API surface, lifecycle orchestration (`initialize`, `startRecurringChecks`, `stopRecurringChecks`), `checkerDepth` tracking
- What it does: Wires modules together, delegates to them

**Public API preservation:**
The following methods must remain callable on `NotificationEngine` by 14 consumer files:
- Lifecycle: `initialize()`, `startRecurringChecks()`, `stopRecurringChecks()`, `flushGeniusQueueOnResume()`
- Core: `schedule()`, `cancel()`, `cancelByType()`, `cancelAll()`
- Tiered: `notifyCore()`, `notifyStandard()`, `notifyAmbient()`
- Templated: `scheduleTemplated()`
- Delivery: `confirmDelivery()`, `recordDelivery()`, `recordEngagement()`
- Flags: `hasSentToday()`, `markSentToday()`
- Queries: `getHistory()`, `getDailyStats()`, `getScheduledIds()`, `getWebScheduledMeta()`
- Specific: `scheduleSunriseWakeUp()`

**Risk:** Medium. This is the largest refactoring. However, because the public API is preserved as a facade and the helper modules already exist, the risk is contained. The main danger is missing a state reference or timer during extraction. We'll mitigate by:
- Keeping the original file as the facade (no consumer imports change)
- Extracting one module at a time, building + testing after each
- Using the existing `checkerDepth` pattern as the wiring contract between checkers and genius/delivery

---

## Rollback Strategy

If any pass fails catastrophically:
```bash
git reset --hard backup/pre-phase6-final-push-20260519-1625
```

Between passes, we can also `git stash` to checkpoint.

---

## Estimates

| Pass | Files | Lines Changed | Time | Risk |
|------|-------|---------------|------|------|
| 1: engine.ts types | 1 + possible callers | ~80 new, ~40 changed | 45 min | Low |
| 2: CalendarAICoach types | 1 | ~8 changed | 30 min | Low |
| 3a: notificationState.ts | 1 new | ~80 lines | 20 min | Low |
| 3b: notificationDelivery.ts | 1 new, 1 modified | ~280 lines moved | 30 min | Medium |
| 3c: notificationGenius.ts | 1 new, 1 modified | ~450 lines moved | 30 min | Medium |
| 3d: notificationCheckers.ts | 1 new, 1 modified | ~1,100 lines moved | 30 min | Medium |
| 3e: facade cleanup | 1 modified | ~350 lines retained | 20 min | Low |
| **Total** | **7 files** | **~2,349 redistributed** | **~3.5 hrs** | **Medium overall** |

---

## Recommended Execution Order

1. **Pass 1** (engine.ts) — immediate type-safety win, no behavioral change
2. **Pass 2** (CalendarAICoach) — quick win, fixes latent bug
3. **Pass 3a+3b** (state + delivery) — extract the lower-risk modules first
4. **Pass 3c** (genius) — extract the orchestration layer
5. **Pass 3d** (checkers) — extract the largest section last
6. **Final verification** — build + test + quick smoke test of notification flow
