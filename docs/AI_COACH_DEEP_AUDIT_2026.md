# HEKA AI Coach — Surgical Deep Audit Report
**Date:** 2026-04-17  
**Scope:** `CalendarAICoach.tsx`, Redux store/data flow, AI services layer, `src/oracle/` ecosystem  
**Method:** Four parallel agents, line-by-line reading, cross-referencing, runtime behavior analysis  
**Previous Audit:** Surface-level audit (archived and superseded by this report)

---

## Executive Summary

The previous audit scored the system **6.0/10** and identified 10 critical issues. This deep audit finds **the same 10 issues still exist, plus 30+ additional critical problems** that were completely missed. The HEKA AI Coach is not a "promising apprentice" — it is a **production liability** with memory leaks, race conditions, data corruption, silent failures, and architectural debt that makes Phase 3 extraction **dangerous without pre-flight fixes**.

**Key finding:** `CalendarAICoach.tsx` is not merely "too long." It is **architecturally entangled** with module-level mutable state, direct Redux store imports, side effects inside context builders, and imperative action closures embedded in data objects. Splitting it naively will break the app.

---

## Part 1: CalendarAICoach.tsx — The Monolith Autopsy

### 1.1 True Line Count: 2,835 (not 2,556)

| Section | Lines | Content |
|---------|-------|---------|
| `buildOracleContext()` | ~230 | Async data gathering + side effects |
| `candidatesFromContext()` | ~1,350 | Static message templates (~200 candidates) |
| `scoreCandidate()` | ~125 | Scoring engine |
| `generateMessage()` | ~150 | Selection + LLM + memory |
| `showNextMessage()` / `showImmediateMessage()` | ~120 | Orchestration + timers |
| `startTypewriter()` (inline, not a hook) | ~30 | Word-by-word reveal |
| Drag, focus trap, escape, arrow keys | ~200 | Event listeners |
| UI rendering (pill + card) | ~450 | JSX + styles |
| Utility functions | ~80 | `renderMarkdown`, `getLocalTimeContext`, etc. |
| **Total** | **2,835** | |

### 1.2 Memory Leaks (🔴 High Severity)

| Leak | Location | Impact |
|------|----------|--------|
| **Typewriter interval never cleaned on unmount** | `typewriterTimerRef` | Interval continues calling `setState` after unmount. React will warn in StrictMode. |
| **Touchmove listener leak** | Drag effect (lines ~2243–2248) | `{ passive: false }` added but `removeEventListener` omits the option. In strict browsers, the listener leaks permanently. |
| **Task/achievement setTimeout leaks** | Lines ~2600, ~2621 | `showNextMessage()` fires 5000ms after event. If component unmounts, state updates on unmounted component. |
| **Promise.race unhandled rejection** | `showNextMessage()` (line ~2456) | 18s timeout promise rejects after race is won. Unhandled rejection in console. |

### 1.3 Race Conditions (🟡 Medium Severity)

| Race | Details |
|------|---------|
| **Concurrent `showNextMessage`** | No mutex. Zone changes, 3-hour ticks, manual "New Prompt", and task celebrations can all trigger simultaneously. Two generations race; slower one overwrites display. |
| **`dismissedRef` stale check** | `generateMessage` reads `dismissedRef.current` at filter time, but after async `buildOracleContext`, the ref may have new dismissals. Mitigated by second check in `showNextMessage`. |
| **`winner.text = llmResult.text`** | Mutates candidate object. Safe now (candidates recreated per call), but dangerous if caching is introduced. |

### 1.4 Hidden Dependencies (Cross-Cutting Concerns)

| Dependency | Pattern | Why It's Dangerous |
|------------|---------|-------------------|
| **`_coachFocusedDate`** (module-level var) | Component effect writes it; `emit*` functions read it; `generateMessage` reads it. | Invisible wire between React lifecycle and imperative action emitters. Prevents multiple coach instances. Breaks if component unmounts and remounts. |
| **`dismissedRef`** | `handleDismiss` mutates it; `generateMessage` reads it. | Hidden channel bypassing React state. Never syncs with `aiConfigService`. Clearing dismissals in Settings requires remount. |
| **`recordMemory`** | Called inside `generateMessage` and `showImmediateMessage`. Writes to `aiConfigService`. | Side effect buried deep in generation pipeline. If generation fails, memory is still recorded. |
| **`emit*` closures in candidates** | `candidatesFromContext` embeds `emitAddNote()`, `emitCreateTask()`, etc. inside candidate objects. | Candidates are not pure data; they embed imperative side effects. Cannot be serialized, tested, or moved to a worker. |
| **`buildOracleContext` side effects** | Writes transit cache and VoC state to `aiConfigService`. | A "context builder" that mutates global state. If called from a worker or concurrent context, races. |

### 1.5 Bugs Missed by Previous Audits

| Bug | Evidence | Fix Complexity |
|-----|----------|---------------|
| `focusedDateRef` is **dead code** | Written by effect (line 2162), never read. `_coachFocusedDate` is the actual mechanism. | Trivial |
| There is **no `useTypewriter` hook** | Previous audit described one. The typewriter is 100% inline (`startTypewriter`). | Medium (extract to hook) |
| **Focus trap stale when action buttons appear** | Focusable elements queried once on `minimized` change. New action buttons are excluded. | Medium |
| **Arrow keys globally hijacked** while expanded | `keydown` on `window` blocks scrolling, text input navigation everywhere. | Medium |
| **`showNextMessage` has no re-entry guard** | Calling while already running starts parallel generations. | Medium |
| **`getSolarReturnContext` returns ~365 when `isToday` is true** | Computes `daysUntil` for next year's birthday even today. | Trivial |
| **`displayedText ? renderMarkdown(...)` ternary bug** | Empty string is falsy. Messages starting with whitespace render immediately. | Trivial |
| **`buildOracleContext` re-saves cached transit data** | Writes new timestamp even when data came from cache. Unnecessary localStorage write. | Trivial |
| **Escape key interferes with app-wide modals** | Global `keydown` on `window` minimizes coach. If a modal is open, Escape should close the modal, not the coach. | Medium |

---

## Part 2: Store & Data Flow — The Corruption Matrix

### 2.1 The `statistics` Object Is Permanently Corrupted

```
addNote     → statistics updated ✓
updateNote  → statistics NOT updated ✗
deleteNote  → statistics NOT updated ✗
```

**Impact:** `totalNotes`, `moodAverage`, `notesByCategory` become **monotonically increasing lies**. A user who edits 10 notes appears to have 10 + 10 = 20 notes. A user who deletes a note still has the same count.

### 2.2 Mood Average Denominator Bug

```typescript
// updateStatisticsOnNoteAdd uses:
const denominator = Object.values(stats.notesByCategory).reduce(...)
```

This counts **all notes by category**, not **notes with mood ratings**. If you have 100 notes but only 3 with mood, the average is computed as if all 100 contributed. The mood average is **artificially diluted toward neutral**.

### 2.3 `normalizeCalendarMood` — Invalid Input → Euphoria

```typescript
const score = mood === 1 ? -1 : mood === 2 ? -0.5 : mood === 3 ? 0 : mood === 4 ? 0.5 : 1;
```

Any invalid input (`undefined`, `null`, `0`, `6`, `NaN`) falls through to `1` (most positive). **Corrupted or missing mood data is reported as euphoric to the coach.**

### 2.4 Store Subscription Only Tracks Day Keys

```typescript
const notesKeys = Object.keys(state.calendar.notes).sort().join(',');
```

**This hash ignores note content.** Editing a note's mood, editing content, or deleting a note (while other notes remain on that day) → **NO AI sync fires.** The coach's `moodAverage`, `totalNotes`, and `moodHistory` become permanently stale on edits.

### 2.5 `syncCalendarMoodToAI` — "Latest" Is Not Latest

```typescript
const allNotes = Object.values(notes).flat();
const latestNote = allNotes[notesWithMood.length - 1];
```

Picks the **last mood-bearing note in object-iteration order**, not the **chronologically latest note**. If notes are loaded from persistence in a different order than creation, the **wrong mood is synced**.

### 2.6 Mood History Dual-Source Race Condition

```
T1: Calendar note added → store.subscribe() fires
    → syncCalendarMoodToAI reads moodHistory = [A, B]
T2: Journal entry saved → diarySlice thunk fires
    → builds moodHistory = [A, B, C]
    → writes moodHistory = [A, B, C] to aiConfigService
T3: syncCalendarMoodToAI resumes
    → writes moodHistory = [A, B, CalendarEntry]  ← OVERWRITES C
```

**Result:** Journal mood entry `C` is **silently lost** from `moodHistory`.

### 2.7 LocalStorage Write Amplification

Every `setUserContext()` call triggers:
1. `getConfig()` (clone)
2. `updateConfig()` (merge + clone)
3. `saveInternal()` → `JSON.stringify()` + `localStorage.setItem()`

For a user bulk-importing 50 notes: **50 notes × 2 sync calls = 100 synchronous localStorage writes.** Each write serializes the entire config including growing `coachMemory` and `moodHistory` arrays. JSON.stringify time increases linearly with usage.

### 2.8 Redux Purity Violations (11 Reducers)

| Reducer | Violation |
|---------|-----------|
| `addNote` | `new Date().toISOString()` (×2) |
| `updateNote` | `new Date().toISOString()` |
| `trackAppOpen` | `new Date().toISOString()` (×2), `new Date()` (×2) |
| `trackTimeSpent` | `new Date().toISOString()`, `new Date()` |
| `trackMonthVisit` | `new Date().toISOString()`, `new Date()` |
| `discoverFeature` | `Date.now()` |
| `trackSettingsExplored` | `Date.now()` |
| `trackThemeChange` | `Date.now()` |
| `trackFontChange` | `Date.now()` |
| `trackDisplayChange` | `Date.now()` |
| `trackLocationChange` | `new Date().toISOString()` |

All produce **different state for identical actions**.

### 2.9 Dead Fields in `AIUserContext`

| Field | Status |
|-------|--------|
| `oracleMood` | Never written anywhere |
| `lastCelebratedMoonPhase` | Dead field |
| `lastCelebratedStreak` | Dead field |
| `lastCompletedTaskId` | Written by planner, never read by coach |
| `lastCompletedTaskCategory` | Written by planner, never read by coach |

### 2.10 `CalendarAICoach` Directly Imports `store`

```typescript
import { store } from '../store';
const state = store.getState();
```

Used in `getSolarReturnContext()` and `buildOracleContext()`. **Bypasses React-Redux entirely.** The coach will never re-render when `astroProfiles` changes. Creates hard circular dependency. Unit testing requires mocking the entire store module.

---

## Part 3: AI Services — The Silent Failure Layer

### 3.1 Two Independent AI Services (Plus Dead Code)

```
aiCoachLLM.ts          aiProvider.ts          aiIntegration.ts (DEAD)
├── Coach messages     ├── Astrology readings   ├── 307 lines
├── 4 providers        ├── 4 providers          ├── Zero imports
├── FIFO cache (4hr)   ├── Unbounded cache      ├── Complete parallel
├── fetchWithRetry     ├── fetchWithTimeout     │   implementation
└── Template fallback  └── Template fallback    └── Should be deleted
```

**Critical finding:** `aiIntegration.ts` in `src/astrology/services/guidance/` is **307 lines of complete dead code** with its own `configureAI()`, `callOpenAI()`, `callAnthropic()`. Zero imports anywhere.

### 3.2 Cache Strategy Comparison

| Aspect | Coach LLM | Astrology LLM |
|--------|-----------|---------------|
| **Key** | Hash of full prompt (includes volatile memory) | `${planet}-${sign}-${moonPhase}-${category}` |
| **TTL** | 4 hours | 1 hour |
| **Eviction** | FIFO at 200 entries (**NOT LRU**) | **NONE** — unbounded growth |
| **Hit rate** | Almost never (memory changes key) | High but **ignores transits** — could serve yesterday's reading |

### 3.3 Retry Disparity

| Service | Retries | Backoff | Timeout |
|---------|---------|---------|---------|
| Coach | 1 | Exponential (1s → 2s) | 15s |
| Astrology | 0 | None | 15s |

**A flaky network kills astrology AI instantly but coach AI survives.** Users see astrology readings degrade to templates silently.

### 3.4 Config Drift: `aiProviderManager` vs `aiConfigService`

`aiProviderManager.loadConfiguration()` runs **once in the constructor**. If code changes `aiConfigService.setProvider()` without also calling `aiProviderManager.setActiveProvider()`, they **desynchronize**. Only `AISettingsPanel.tsx` keeps them in sync manually.

### 3.5 Silent Failures Everywhere

```typescript
// Coach LLM
catch (error) {
  console.error('[AICoachLLM] Generation failed:', error);
  return { text: fallbackText, model: 'fallback', cached: false };
}

// Astrology LLM
catch (error) {
  console.warn(`Provider ${providerType} failed:`, error);
  // Continue to next provider
}
return templateProvider.generateReading(request);
```

**The user receives template text with zero indication that LLM was attempted.** No toast, no badge, no debug indicator. Users paying for API keys won't know their credits aren't being used.

### 3.6 The 22-Field "God Parameter"

`generateOracleMessage()` takes a context object with **22 fields**. All are used. Every field change requires updating:
1. The interface in `aiCoachLLM.ts`
2. The call site in `CalendarAICoach.tsx`
3. Potentially the context builder

There is no builder pattern, no sub-type, no optional grouping.

### 3.7 Security Risks

| Risk | Location | Severity |
|------|----------|----------|
| Legacy plaintext fallback | `aiProviderManager` reads `localStorage.getItem('celestial-groq-key')` | Medium |
| Error body leakage | Provider error responses logged to console | Low |
| Ollama URL as API key | `apiKey` field overloaded with base URL | Low |

---

## Part 4: src/oracle/ — The Parallel Universe

### 4.1 What `src/oracle/` Actually Is

**NOT** a partial extraction of `CalendarAICoach`. **NOT** dead code. It is an **active, well-structured backend engine** for the Oracle Journal / Diary / Tracker subsystems.

| File | Lines | Purpose |
|------|-------|---------|
| `oracleEngine.ts` | 736 | Core insight generation, celestial state, transit calculation |
| `archetypeEngine.ts` | 287 | Soul classifier, archetype detection, dialect system |
| `birthChartIntegration.ts` | 563 | Personal transit calculator, whole-sign houses |
| `celestialEducation.ts` | 622 | Planet/sign/aspect/house meaning database |
| `celestialTimingEngine.ts` | 465 | Moon phases, VOC moon, weekly phases |
| `celestialWeatherEngine.ts` | 488 | Global sky aspects, daily celestial weather |
| `enhancedInsightEngine.ts` | 1,397 | **Crisis detection** (suicide/self-harm), sentiment analysis |
| `trackerAnalytics.ts` | 468 | Menstrual/sleep/mood analytics |

### 4.2 Relationship to CalendarAICoach

`CalendarAICoach` imports sparingly from `src/oracle/`:
- `OracleEngine` (for `getCurrentCelestialState` and `analyzeContent`)
- `archetypeEngine` (for `getArchetypeDialect`)

It does **NOT** use the diary types, enhanced insight engine, birth chart integration, tracker analytics, or crisis detection. It has its own parallel implementations: `buildOracleContext()`, `candidatesFromContext()`, `scoreCandidate()`.

### 4.3 What Previous Audits Completely Missed

1. **`src/components/oracle/`** — A whole sub-component tree (OracleHeader, OracleNavigation, 5 mode components, TransitDetailModal, useBirthChart hook)
2. **Redux `diary` slice** — `src/store/diarySlice.ts` with its own state, actions, selectors
3. **Crisis detection system** — `enhancedInsightEngine.ts` contains suicide/self-harm/severe-depression pattern detection with emergency resource hotlines
4. **True line count** — `CalendarAICoach.tsx` is 2,835 lines, not 2,556

---

## Part 5: What Previous Audits Missed — Master List

### Previous Audit Claimed vs. Reality

| Claimed | Reality |
|---------|---------|
| "Focus trap fixed" | Focus trap is stale when action buttons appear; arrow keys globally hijacked |
| "Mood scale mismatch fixed" | `normalizeCalendarMood` maps invalid inputs to euphoria; store subscription ignores edits/deletes |
| "Statistics wired into LLM" | Statistics are corrupted by edit/delete; store subscription fires on wrong triggers |
| "Solar return edge cases fixed" | `getSolarReturnContext` still returns ~365 days when `isToday` is true |
| "API error bodies preserved" | Error bodies logged to console; silent fallback to template everywhere |
| "~2,556 lines" | **2,835 lines** |
| "Cache bug fixed" | Coach cache is FIFO (not LRU); astrology cache is unbounded |
| "Retry logic added" | Astrology LLM has **zero retries** |
| "Redux purity fixed" | 11 reducers still use `new Date()` / `Date.now()` inside |

### Issues Completely Missed by Previous Audits

1. `focusedDateRef` is dead code (module var `_coachFocusedDate` is the real mechanism)
2. No `useTypewriter` hook exists (typewriter is 100% inline)
3. `touchmove` listener leak (`{ passive: false }` mismatch)
4. `Promise.race` unhandled rejection
5. `showNextMessage` has no re-entry guard
6. `dismissedRef` never re-syncs with `aiConfigService`
7. `displayedText` ternary bug with empty string
8. `buildOracleContext` re-saves cached transit data unnecessarily
9. `statistics` object permanently corrupted by edit/delete
10. Mood average denominator counts all notes, not notes-with-mood
11. Store subscription only tracks day keys (ignores edits/deletes)
12. `syncCalendarMoodToAI` picks wrong "latest" note (object-iteration order)
13. Mood history dual-source race condition (calendar vs diary)
14. `coachMemory` append race during rapid generation
15. Transit cache duplicate work race
16. Store subscription vs component `setUserContext` race
17. 11 Redux reducers with `new Date()` / `Date.now()` side effects
18. LocalStorage write amplification (100 writes for 50 notes)
19. `aiIntegration.ts` — 307 lines of dead code
20. Coach cache is FIFO, not LRU
21. Astrology cache has no size limit
22. Different Ollama APIs (`/api/chat` vs `/api/generate`)
23. Retry disparity (coach retries, astrology doesn't)
24. `aiProviderManager` can drift from `aiConfigService`
25. Silent failures everywhere — no UI indication of fallback
26. `generateOracleMessage` 22-field god parameter
27. 5 dead fields in `AIUserContext`
28. `src/components/oracle/` UI subtree entirely missed
29. Redux `diary` slice entirely missed
30. Crisis detection system entirely missed

---

## Part 6: Pre-Flight Fixes Required Before Phase 3

### 🔴 P0 — Must Fix Before Any Extraction

| # | Fix | Location | Why Blocking |
|---|-----|----------|-------------|
| 1 | **Add re-entry guard to `showNextMessage`** | `CalendarAICoach.tsx` | Without this, extracted hooks will race and crash |
| 2 | **Clean up typewriter interval on unmount** | `CalendarAICoach.tsx` | Extracted `useTypewriter` must handle this or leak |
| 3 | **Fix `touchmove` listener removal** | `CalendarAICoach.tsx` | Extracted `useDraggable` will leak without `{ passive: false }` in removal |
| 4 | **Kill module-level `_coachFocusedDate`** | `CalendarAICoach.tsx` | Prevents clean extraction of emitters and context builder |
| 5 | **Debounced batching for `aiConfigService` writes** | `src/store/index.ts` | Store subscription fires 100× for bulk imports; extracted modules will amplify this |
| 6 | **Fix `normalizeCalendarMood` invalid input** | `src/store/index.ts` | Invalid data → euphoria. Extraction will propagate this bug |
| 7 | **Fix store subscription to track note content, not just keys** | `src/store/index.ts` | Edit/delete silently break AI context. Extraction makes this permanent |

### 🟡 P1 — Should Fix Before Extraction

| # | Fix | Location | Why Important |
|---|-----|----------|--------------|
| 8 | **Fix `getSolarReturnContext` `daysUntil` when `isToday`** | `CalendarAICoach.tsx` | Returns ~365 on birthday. Embarrassing bug in extracted code |
| 9 | **Fix `displayedText` ternary with empty string** | `CalendarAICoach.tsx` | Whitespace-leading messages skip typewriter |
| 10 | **Add `updateNote`/`deleteNote` statistics updates** | `src/store/index.ts` | Statistics are permanently corrupted. Extracting them codifies the lie |
| 11 | **Remove `store.getState()` from `CalendarAICoach`** | `CalendarAICoach.tsx` | Hard dependency prevents clean extraction. Pass via props or selector |
| 12 | **Delete `aiIntegration.ts` dead code** | `src/astrology/services/guidance/` | 307 lines of confusion. Will be accidentally imported during code moves |
| 13 | **Fix `Promise.race` unhandled rejection** | `CalendarAICoach.tsx` | Unhandled rejections crash in StrictMode / production error boundaries |

### 🟢 P2 — Can Fix During Extraction

| # | Fix | Location | Why Deferred |
|---|-----|----------|-------------|
| 14 | **Extract `useTypewriter` hook** | New file | Clean extraction, no pre-reqs |
| 15 | **Extract `useDraggable` hook** | New file | Clean extraction after listener leak fix |
| 16 | **Extract `useFocusTrap` hook** | New file | Clean extraction after stale-focus fix |
| 17 | **Decouple candidates from actions** | `CalendarAICoach.tsx` | Major refactoring, but safe if emitters are parameterized |
| 18 | **Replace `statistics` eager accumulation with selector** | `src/store/index.ts` | Architectural improvement, not blocking |
| 19 | **Unify mood history dual-source writes** | `src/services/aiConfigService.ts` | Requires schema versioning, complex |
| 20 | **Expose `aiFallbackReason` to UI** | `CalendarAICoach.tsx` + services | Nice-to-have, not blocking |

---

## Part 7: Phase 3 Extraction Risk Assessment

### ✅ Low Risk (Can Extract Now)

| Piece | Target | Effort |
|-------|--------|--------|
| `renderMarkdown` | `src/components/oracle/markdownRenderer.tsx` | 30 min |
| Pure utilities (`getLocalTimeContext`, `getSignElement`, etc.) | `src/utils/oracleUtils.ts` | 1 hour |
| `deriveTopic` | `src/utils/topicUtils.ts` | 30 min |
| `isCelestialTopic`, `scoreCandidate` | `src/services/oracleScoring.ts` | 2 hours |
| `makeCandidate`, `withArchetypeDialect` | `src/services/candidateFactory.ts` | 1 hour |
| `getSolarReturnContext` | `src/services/solarReturnService.ts` | 1 hour |

### 🟡 Medium Risk (Fix Pre-Flight Items First)

| Piece | Target | Blockers |
|-------|--------|----------|
| `useTypewriter` hook | `src/hooks/useTypewriter.ts` | Must fix interval cleanup |
| `useDraggable` hook | `src/hooks/useDraggable.ts` | Must fix listener leak |
| `useFocusTrap` hook | `src/hooks/useFocusTrap.ts` | Must fix stale-focus bug |
| `buildOracleContext` celestial block | `src/services/oracleContext.ts` | Must remove `aiConfigService` side effects |
| `buildOracleContext` location block | `src/services/oracleContext.ts` | Safe after above |

### 🔴 High Risk (Major Refactoring Required)

| Piece | Target | Blockers |
|-------|--------|----------|
| **`buildOracleContext` full extraction** | `src/services/oracleContext.ts` | Must return `{ context, cacheUpdates }` instead of mutating `aiConfigService`; must remove `store.getState()` |
| **`candidatesFromContext` extraction** | `src/services/oracleTemplates.ts` | Must convert action closures to data-only candidates (`actionId` + `actionParams`) |
| **`emit*` function extraction** | `src/services/oracleActions.ts` | Must kill `_coachFocusedDate` module var; must accept `date` parameter |
| **`generateMessage` extraction** | `src/services/oraclePipeline.ts` | Must inject `contextBuilder`, `llmClient`, `memoryStore`, `dismissedSet` as dependencies |
| **`showNextMessage` / `showImmediateMessage` extraction** | `src/hooks/useMessageOrchestrator.ts` | Must add re-entry guard; must stabilize all dependencies first |

---

## Verdict

The HEKA AI Coach is **not ready for Phase 3 extraction**. The previous audits and fixes addressed symptoms, not causes. The system has:

- **7 P0 blocking bugs** that will cause extracted code to leak, race, or corrupt data
- **30+ missed issues** ranging from embarrassing (birthday shows 365 days away) to dangerous (crisis detection system was entirely unknown)
- **Architectural entanglement** (module-level mutable state, direct store imports, side effects in context builders) that makes naive extraction destructive

**Recommended path:**
1. Fix all P0 items (1–2 days)
2. Fix P1 items (1 day)
3. Then proceed with Phase 3 extraction in small, tested increments

Attempting Phase 3 without these pre-flight fixes will **break the app**.
