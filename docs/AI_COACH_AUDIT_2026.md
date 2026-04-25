# HEKA AI Coach — Full Audit Report
**Date:** 2026-04-17  
**Auditor:** Kimi Code CLI (3-agent parallel audit)  
**Scope:** LLM layer, UI/UX, context integration, security, performance, accessibility  

---

## 🎯 Overall Score: 6.0 / 10

> *"A promising apprentice wizard who can read the stars but bumps into furniture."*

The HEKA AI Coach is **celestially brilliant but behaviorally myopic**. It has world-class astrology integration, elegant cost-efficient template engineering, and enterprise-grade key security. But it suffers from severe accessibility neglect, no streaming, stale context snapshots, and blindness to large swaths of user data (selected date, calendar notes, achievements, birthdays).

It is **not a potato** (the foundations are solid and the celestial layer is genuinely impressive). It is **not a hero** (accessibility is 3.5/10, the component is 2,556 lines, and the coach can't even see which day you tapped). It is a **solid 6** — a feature that feels magical when it works but frustrates when it doesn't.

---

## 📊 Dimension Breakdown

| Dimension | Score | Weight | Weighted |
|-----------|-------|--------|----------|
| Context Awareness & Data Integration | 5.5/10 | 15% | 0.83 |
| UI/UX Polish & Visual Design | 6.0/10 | 12% | 0.72 |
| Prompt Engineering & Persona Design | 7.5/10 | 10% | 0.75 |
| Architecture & Code Quality | 6.5/10 | 10% | 0.65 |
| Memory & Conversation History | 5.0/10 | 10% | 0.50 |
| Performance & Responsiveness | 5.5/10 | 10% | 0.55 |
| Security & Privacy | 6.5/10 | 8% | 0.52 |
| Accessibility | 3.5/10 | 8% | 0.28 |
| Provider Support & Reliability | 6.0/10 | 7% | 0.42 |
| First-Time User Experience | 4.0/10 | 5% | 0.20 |
| Mobile Experience | 5.0/10 | 5% | 0.25 |
| **OVERALL** | — | **100%** | **5.67 ≈ 6.0** |

---

## 🌟 What's Genuinely Excellent (Preserve & Replicate)

### 1. Celestial Weather Integration — 9/10
The astrology layer is **best-in-class** among calendar apps:
- Real-time natal chart transits via Swiss Ephemeris (`transitService.ts`)
- Void-of-Course Moon awareness affecting task suggestions
- Location-aware planetary hours with activity recommendations
- Sunrise/sunset boundaries for time-of-day nudges
- Synchronicity engine matching journal themes to moon sign elements
- Critical degrees, lunar nodes, Chiron — all live

### 2. Secure Key Storage — 9/10
Enterprise-grade key hygiene:
- API keys **never** written to `localStorage` plaintext
- Capacitor Secure Storage → Android Keystore / iOS Keychain
- Active migration that destroys plaintext legacy keys after moving them
- Fallback to prefixed `localStorage` only when native plugin fails

### 3. Provider Personas — 8/10
Distinct, poetic, effective system prompts per provider:
- **Groq**: "warm, grounded, and slightly playful"
- **OpenAI**: "precise, insightful, and elegantly concise"
- **Anthropic**: "deeply poetic, mythic, and emotionally resonant"
- **Ollama**: "thoughtful, calm, and gently mystical"

### 4. Cost-Efficient Template Engineering — 8/10
Brilliant product design: ~200 static message candidates scored by context. LLM is only invoked for "high-value moments" (synchronicities, transit alerts, severe mood support, weight ≥ 80). This keeps API costs low while maintaining perceived intelligence.

### 5. Zone-Aware Scoring — 8/10
13 distinct app zones (calendar, journal, stars, circle, settings, etc.) each with ±20-35 point scoring weights. The coach knows which "room" of the app you're in and tailors messages accordingly.

### 6. Action Emitter System — 9/10
Clean decoupled event architecture:
- `emitAddNote()` → dispatches `heka-select-date` with `createNote: true`
- `emitCreateTask(suggested?)` → dispatches with `createTask: true` + optional prefill
- Auto-open integration in `useDayPanel.ts` with scroll-to-section

---

## 🔴 Critical Issues (Blocking Hero Status)

### 1. Accessibility: 3.5/10 — CRITICAL
Across ALL AI coach components:
- ❌ No focus traps on expanded card or any modal
- ❌ No `role="dialog"`, `aria-modal`, `aria-labelledby`
- ❌ No Escape key handler to minimize/dismiss
- ❌ Minimized pill has no `aria-label`, `aria-expanded`, `aria-controls`
- ❌ Custom toggle switches lack `aria-checked`, `role="switch"`
- ❌ No keyboard alternative for drag positioning
- ❌ Action buttons have no `aria-pressed`, `aria-live`, or loading state
- ❌ No `@media (prefers-reduced-motion: reduce)` support
- ❌ Message icons are raw emoji with no `role="img"` or `aria-label`

**Impact:** Screen reader users cannot effectively use the AI coach. Keyboard-only users are stuck. This alone prevents the feature from being production-grade.

### 2. Message Rendering: 4/10 — CRITICAL
- ❌ Raw text only with `whiteSpace: 'pre-line'`
- ❌ No markdown, bold, italic, links
- ❌ No link parsing (LLM-generated URLs are plain text)
- ❌ No "read more" truncation for long messages
- ❌ No code formatting (rarely needed but limiting)

**Impact:** For an AI generating rich celestial insights, the output feels like a plaintext terminal. The poetic persona is undermined by rigid text rendering.

### 3. No Streaming: 5/10 — MAJOR
- ❌ Entire response buffered before any text appears
- ❌ 15-second timeout with only generic "typing dots" indicator
- ❌ "Magical buffer" adds 600-1300ms of **artificial delay** (`600 + Math.floor(Math.random() * 700)`)
- ❌ No partial text reveal, no word-by-word animation

**Impact:** On slow connections, users stare at dots for 10+ seconds with zero feedback. The artificial delay degrades perceived performance on fast connections.

### 4. Selected Date Blindness: 0/10 — MAJOR
- ❌ Coach always operates on "today" via `new Date()`
- ❌ `selectedDate` from Redux never reaches the coach
- ❌ User opens day panel for next week → coach still talks about today
- ❌ `emitAddNote()` always selects **today's date**, even if user was viewing a different month

**Impact:** The coach feels disconnected from the user's actual focus. If I'm planning next Tuesday, the coach rambling about today's moon phase is annoying, not helpful.

### 5. Calendar Notes & Achievements Blindness: 0/10 — MAJOR
- ❌ `state.calendar.notes` → never reaches coach
- ❌ `state.calendar.statistics` (writing streak, mood average) → invisible
- ❌ Gamification/achievements → invisible
- ❌ `state.calendar.astroProfiles` birth dates → never used for birthday/solar return nudges
- ❌ Calendar note mood ratings (1-5 scale) → never fed into `moodHistory`

**Impact:** The coach cannot say "You wrote about stress on Tuesday — how are you feeling today?" or "Happy solar return!" or "You've journaled 7 days in a row." Massive missed opportunities for warmth and personalization.

### 6. No Retry Logic: 6/10 — MODERATE
- ❌ All providers fail immediately on transient errors
- ❌ No distinction between retryable (5xx, timeout) and non-retryable (4xx, invalid key)
- ❌ Silent fallback to template text with no user-facing indication

**Impact:** A single network blip degrades the experience from "poetic AI insight" to "generic template." Users never know AI was attempted.

### 7. Groq Cache Never Expires — BUG
```typescript
// aiProvider.ts:225
if (cached && Date.now() - cached.latency < 3600000) {
```
`cached.latency` is `performance.now() - startTime` (a small number like 1200ms). `Date.now() - 1200` is always huge, so this condition is **always true** if a cache entry exists. The Groq cache for astrology readings never expires.

### 8. CalendarAICoach.tsx is 2,556 Lines — MAINTENANCE RISK
- `candidatesFromContext()` is ~1,300 lines of static message templates
- `scoreCandidate()` is 125 lines with 40+ scoring rules
- `buildOracleContext()` is comprehensive but monolithic
- No extracted hooks (`useOracle`, `useCoach`)

**Impact:** This file is unmaintainable. Adding a new message category requires editing a 1,300-line function. Testing is nearly impossible.

### 9. Mobile Drag Conflicts: 5/10 — MODERATE
- `touchmove` with `{ passive: false }` on entire window during drag
- Blocks page scrolling on mobile
- No safe area insets (`env(safe-area-inset-bottom)`) — overlaps iOS home bar
- Keyboard opening can push fixed-position coach off-screen
- Tapping pill on mobile can accidentally trigger drag instead of expand

### 10. No First-Time User Experience: 4/10 — MODERATE
- No "Hi, I'm your Oracle" introduction
- No onboarding tooltip explaining what the coach does
- No visible way to restore coach if accidentally dismissed
- Dismiss button says "Hide for 1 hour" with no explanation or configuration
- Immediately throws random messages (potentially streak danger or mood nudge) which can feel intrusive

---

## 📋 Detailed Dimension Reports

### Architecture & Code Quality — 6.5/10

**Strengths:**
- Clean singleton `aiConfigService` with event-driven reactivity
- Strategy pattern in `aiProvider.ts` with proper `AIProvider` interface
- Excellent backward compatibility: `migrateLegacyConfigs()` handles 3 generations of config keys
- Deliberate choice to keep AI outside Redux (prevents API key exposure in DevTools)

**Weaknesses:**
- `CalendarAICoach.tsx` is 2,556 lines — violates single-responsibility
- OpenAI/Ollama implementations inlined in `aiCoachLLM.ts` while Groq/Anthropic are modular
- `generateOracleMessage()` has 24 optional fields — "god parameter" anti-pattern
- No `useOracle()` or `useCoach()` hook exists
- Heavy use of `any` types (`celestialState: any`)
- Legacy `aiIntegration.ts` duplicates provider logic already in `aiProvider.ts`

### Provider Support & Reliability — 6.0/10

**Strengths:**
- 4 LLM providers + template fallback
- Default model selection per provider is sensible
- `validateApiKey()` implemented per provider
- Ollama uses `/api/tags` for validation

**Weaknesses:**
- No fallback chain in `aiCoachLLM.ts` (fails → template text immediately)
- No retry logic on transient errors
- Groq cache never expires (critical bug)
- Ollama treated as "apiKey = base URL" — semantically confusing
- `aiProvider.ts` (astrology) has no memory at all
- No streaming support across all providers

### Prompt Engineering & Persona Design — 7.5/10

**Strengths:**
- Provider personas are distinct and poetic
- System prompt rules are strong (max 2 sentences, no generic platitudes)
- Pattern detection injects dynamic context (returning users, long absences, task overload)
- `sanitizeForPrompt()` on user-influenced inputs

**Weaknesses:**
- User prompt is a massive template string with 20+ interpolations — hard to test/debug
- `recentMemory` lacks timestamps — LLM cannot infer temporal distance
- Groq provider does not set `response_format: { type: 'json_object' }`
- No structured prompt builder

### Memory & Conversation History — 5.0/10

**Strengths:**
- `AIUserContext` is impressively rich (40+ fields)
- `coachMemory` capped at 20 entries with topic derivation
- `hoursSinceTopic()` prevents repetition within hours

**Weaknesses:**
- Only last 5 messages sent to LLM; no true conversation thread
- Memory text truncated to 120 chars — loses nuance
- No memory compression or summarization
- `deriveTopic()` uses brittle string-matching (`msg.text.includes('flame')`)
- Astrology provider (`aiProvider.ts`) has ZERO memory
- No semantic memory — knows "we talked about transit 3h ago" but not what was discussed

### Context Awareness & Data Integration — 5.5/10

| Data Source | Accessible? | Rating |
|-------------|-------------|--------|
| Celestial weather (transits, moon, planets) | ✅ Yes | 9/10 |
| Task counts & streaks | ✅ Yes | 7/10 |
| Zone/screen location | ✅ Yes | 8/10 |
| Mood (journal sentiment only) | ⚠️ Partial | 6/10 |
| Journal snippet (last 200 chars) | ✅ Yes | 5/10 |
| Selected date | ❌ No | 0/10 |
| Calendar notes | ❌ No | 0/10 |
| Calendar note mood ratings | ❌ No | 0/10 |
| Achievements/gamification | ❌ No | 0/10 |
| Birthdays/solar returns | ❌ No | 0/10 |
| App open streak | ❌ No | 0/10 |
| Writing streak | ❌ No | 0/10 |
| Community holidays | ❌ No | 0/10 |
| Friend/Circle tasks | ⚠️ Partial | 3/10 |

### UI/UX Polish & Visual Design — 6.0/10

**Strengths:**
- Glassmorphism card with gold/purple gradient header — on-brand
- Avatar pulsing ring animation adds life
- Typing indicator with staggered dot animation is professionally done
- Color-coded message icons based on celestial context

**Weaknesses:**
- No theme awareness (hardcoded gradients, ignores `ThemeProvider`)
- No markdown rendering in messages
- No exit animation on minimize/dismiss
- Action buttons have zero visual feedback (no depress, no spinner)
- Single action per message limitation
- `z-index: 9999` is aggressive and fragile

### Accessibility — 3.5/10

This is the single biggest blocker to hero status. See Critical Issue #1 above for full list. In summary: the AI coach is essentially unusable for screen reader users and keyboard-only users.

### Performance & Responsiveness — 5.5/10

**Strengths:**
- 15s timeout prevents hanging
- Max tokens limited to 180 (low latency)
- `Promise.race` with timeout prevents UI lockup

**Weaknesses:**
- No streaming — full round-trip before any text appears
- Artificial "magical buffer" delay (600-1300ms)
- `candidatesFromContext()` creates ~200 objects synchronously on every message
- Expensive astrology functions run on every generation (no per-session cache)
- `showNextMessage` runs on 3-hour interval even when backgrounded
- `generateMessage()` not memoized — rapid zone changes fire overlapping generations

### Security & Privacy — 6.5/10

**Strengths:**
- API keys never hardcoded
- Secure storage with native keystore/keychain
- Active migration destroys plaintext legacy keys
- No user content directly injected without context boundaries
- Limited data sent to external APIs (only counts, snippets, celestial data)

**Weaknesses:**
- No PII filtering before sending `lastJournalSnippet` to LLM
- Location includes precise coordinates (lat/lon)
- `window.dispatchEvent(new CustomEvent(...))` has no origin validation
- `getCurrentUserLocation()` reads from `localStorage` with no validation
- Fallback stores keys in `localStorage` with `__heka_secure__` prefix

### First-Time User Experience — 4.0/10

**Strengths:**
- First-task suggestion has welcoming copy
- Enabled by default if calendar area is consented

**Weaknesses:**
- No onboarding flow for the coach itself
- No explanation of what the pill does
- No way to restore if dismissed
- Birth chart nudges appear early without explaining value
- Daily refresh every 3 hours can repeat same category
- Minimized state persisted — user who accidentally minimized may never see coach again

### Mobile Experience — 5.0/10

**Strengths:**
- Mobile media query adjusts width to `calc(100vw - 24px)`
- Pill design works on small screens

**Weaknesses:**
- Drag blocks page scroll (`touchmove` with `passive: false`)
- No safe area insets for iOS home indicator
- Keyboard can push coach off-screen
- 320px card barely fits on 320px-wide screens
- Footer buttons may wrap awkwardly on narrow screens
- No landscape orientation support

---

## 🗺️ Improvement Roadmap (Priority Order)

### Phase 1: Foundation Fixes (Target: 7.0/10)
These fix the most painful user-facing issues and should be done first.

1. **Accessibility overhaul** — Add `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trap, Escape handler, `aria-label` on all controls, `aria-checked` on toggles, keyboard drag alternative (`Arrow keys`), `@media (prefers-reduced-motion)` support.

2. **Message rendering with markdown** — Integrate a lightweight markdown parser (e.g., `react-markdown` or custom) for bold, italic, links, and line breaks. Add link tap handling.

3. **Streaming support** — Implement streaming for providers that support it (OpenAI, Groq, Anthropic). Show words as they arrive instead of buffering the entire response. Remove or reduce the "magical buffer."

4. **Selected date awareness** — Pass `selectedDate` from Redux to the coach context. Update `emitAddNote()` to use the currently viewed date, not always today. Adjust message content based on focused date.

5. **Fix Groq cache bug** — Replace `Date.now() - cached.latency` with `Date.now() - cached.timestamp` where `timestamp` is stored at cache write time.

### Phase 2: Context Deepening (Target: 7.5/10)
These make the coach feel truly aware of the user.

6. **Bridge calendar statistics** — Wire `calendar.statistics` (writing streak, mood average, note count) into `aiConfigService`. Feed calendar note mood ratings into `moodHistory`.

7. **Achievement celebrations** — Wire `useGamification` achievement unlocks to immediate coach celebration messages. "You unlocked the 7-Day Streak badge! The cosmos notices your dedication."

8. **Birthday/solar return detection** — Read `astroProfiles` birth dates in the coach. Detect upcoming solar returns and wish happy birthday. This is an instant "wow" moment.

9. **Calendar note theme analysis** — Extract themes from calendar notes (not just journal) and feed `lastJournalThemes`-equivalent data to the coach.

10. **Add retry logic** — Distinguish retryable (5xx, timeout) from non-retryable (4xx, invalid key) errors. Retry once with exponential backoff on retryable errors.

### Phase 3: Architecture & Polish (Target: 8.5/10)
These are structural improvements for long-term maintainability.

11. **Extract `CalendarAICoach.tsx`** — Split into:
    - `useOracle()` hook (message state, dismissal, actions)
    - `oracleTemplates.ts` (~1,300 lines of candidates)
    - `oracleScoring.ts` (scoring engine)
    - `oracleContext.ts` (context builder)
    - Keep `CalendarAICoach.tsx` as thin presentation layer

12. **Extract `callOpenAI()` and `callOllama()`** — Match the modular architecture of `callGroq()` and `callAnthropic()`.

13. **Add memory compression** — After 20 interactions, summarize older memory into a rolling "personality snapshot" instead of dropping it entirely.

14. **Add semantic cache** — Use a semantic cache key (e.g., `occasion+zone+moonPhase+archetype`) instead of hashing the full prompt. Higher hit rates, same freshness.

15. **PII filtering** — Before sending `lastJournalSnippet` to LLM, run a lightweight PII filter (regex for emails, phone numbers, SSNs, credit cards).

16. **Mobile drag overhaul** — Use a dedicated drag handle instead of the entire header. Allow page scroll when not dragging. Add safe area insets. Handle keyboard appearance.

17. **Coach onboarding flow** — First time the coach appears, show a 2-step tooltip: "This is your Oracle" → "Tap for guidance, drag to move, dismiss to hide."

### Phase 4: Hero Features (Target: 9.5/10)
These are the finishing touches that make the coach feel truly alive.

18. **Multi-action messages** — Allow messages to have multiple action buttons (e.g., "View Tasks" + "Create Micro-Task").

19. **Conversation history** — Add a scrollable history panel so users can revisit past messages. Store last 50 messages in `localStorage`.

20. **Proactive context switching** — When user opens a specific date, the coach proactively offers: "Planning for Tuesday? The moon will be in Virgo — a good day for detail work."

21. **Voice input option** — Add a microphone button for voice-to-text queries (using Web Speech API or native Capacitor plugin).

22. **Emotional intelligence dashboard** — Surface mood trends to the user with the coach narrating: "You've been feeling low for 3 days. Would you like to journal about it?"

23. **Friend/Circle awareness in main coach** — When pending shared tasks exist, the coach can say: "Your Circle has 2 shared tasks waiting. The collective energy is building."

---

## 🎯 Score Trajectory

| Phase | Score | Key Changes |
|-------|-------|-------------|
| **Current** | **6.0** | Baseline |
| **Phase 1** | **7.0** | Accessibility + markdown + streaming + selected date + cache bug |
| **Phase 2** | **7.5** | Calendar stats + achievements + birthdays + retry + note themes |
| **Phase 3** | **8.5** | Component extraction + memory compression + semantic cache + PII + mobile + onboarding |
| **Phase 4** | **9.5** | Multi-actions + history + proactive context + voice + emotional dashboard + circle awareness |

**Hero (10/10)** would require:
- True conversational memory with context window management
- Real-time emotional sensing from typing patterns
- Predictive task suggestions based on historical patterns
- Native-feeling voice interaction
- Zero accessibility gaps
- Sub-500ms perceived response time globally

These are stretch goals beyond Phase 4.

---

## 🏆 Verdict

The HEKA AI Coach is a **6/10** with a clear path to **8.5+**. Its celestial integration is genuinely world-class. Its cost-efficient template system is smart product engineering. Its security is enterprise-grade. But it is held back by:

1. **Accessibility neglect** (3.5/10) — unusable for assistive technology users
2. **Context blindness** (5.5/10) — can't see selected date, notes, achievements, birthdays
3. **No streaming** (5.5/10) — feels slow and unresponsive
4. **Monolithic architecture** (6.5/10) — 2,556-line component is unmaintainable

Fix Phase 1, and you'll jump to a **solid 7**. Fix Phases 1-2, and you're at **7.5 — genuinely good**. Fix Phases 1-3, and you're at **8.5 — excellent, approaching best-in-class**. Phase 4 gets you to **9.5 — truly heroic**.

The foundation is there. The stars are aligned. Now it needs the furniture arranged.
