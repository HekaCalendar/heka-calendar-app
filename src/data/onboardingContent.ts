/**
 * Celestial Awakening — The HEKA Onboarding Experience
 * A unified, narrative-driven cosmic journey.
 *
 * WHAT'S COVERED:
 *   • Why the Gregorian calendar is broken (irregular months, ignored moon)
 *   • The HEKA solution: 13 months × 28 days, Saturday start, Three Arcs
 *   • SYNC vs TRUE mode — two ways to honor the sun
 *   • Interactive: click a day, leave a note
 *   • The Oracle (AI Coach), The Stars (astrology), The Circle (social)
 *   • Bridge to the InfoModal for deeper learning
 */

import type { Tutorial } from '../types/tutorial';

export const celestialOnboarding: Tutorial = {
  id: 'celestial-awakening-v1',
  category: 'onboarding',
  name: 'The Celestial Awakening',
  description: 'A guided journey through the HEKA Calendar',
  triggerCondition: 'first-visit',
  maxShows: 1,
  estimatedDurationMinutes: 5,
  difficulty: 'beginner',
  completionAchievement: 'timekeeper-initiated',
  completionXP: 50,
  steps: [
    // ═══════════════════════════════════════════════════════════════════════════
    // 1. THE SUMMONING
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'summoning',
      type: 'welcome',
      title: 'The Calendar That Time Forgot',
      content: 'For centuries, we have measured our lives with months of 28, 29, 30, and 31 days. Weeks do not fit. The moon is ignored. Holidays scatter without rhythm.\n\nHEKA is different. Thirteen months. Twenty-eight days each. Four perfect weeks every month. Saturday begins the week. Friday completes it. A calendar that breathes.',
      position: 'center',
      actionLabel: 'Awaken',
      tone: 'mysterious',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. THE BROKEN CALENDAR (NEW — explains the "why")
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'the-broken-calendar',
      type: 'modal',
      title: 'The Calendar You Inherited',
      content: 'The Gregorian calendar is a stack of historical accidents. Roman politics. Religious councils. Astronomical patches added centuries apart.\n\nIt was never designed as a system. It was inherited. Patched. Tolerated.\n\nJanuary starts in winter exhaustion. Months have no relationship to weeks. The moon — humanity\'s oldest timekeeper — is ignored entirely.\n\nYou did not choose this calendar. It was given to you.',
      position: 'center',
      actionLabel: 'See the Solution',
      tone: 'calm',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. THE PATTERN
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'the-pattern',
      type: 'modal',
      title: 'The 13-Month Harmony',
      content: 'Every month has exactly 4 weeks — 28 days. Within each year, the 1st of every month falls on the same day of the week. Saturday begins the week. Friday completes it.\n\nTwelve months have 28 days each. March, the closing month, has 29 days — 30 in leap years.\n\nHEKA honors the rhythms that actually exist in nature.',
      position: 'center',
      actionLabel: 'Continue',
      tone: 'calm',
      visualComponent: 'month-structure',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. THE THREE ARCS (NEW — explains year structure)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'the-three-arcs',
      type: 'modal',
      title: 'The Shape of a Year',
      content: 'A HEKA year has three arcs — like a story with a beginning, middle, and end.\n\nThe Opening Arc: April. The threshold. Spring vitality. New growth. New projects.\n\nThe Core Arc: May through December. Nine months of perfectly regular rhythm. Plan with confidence. Build momentum. This is where the work happens.\n\nThe Closing Arc: January through March. Resolution. Harvest. Reflection. And finally, March contains the leap day — all correction contained in one place.',
      position: 'center',
      actionLabel: 'Continue',
      tone: 'mysterious',
      visualComponent: 'year-structure',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. THE TWO RIVERS
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'two-rivers',
      type: 'modal',
      title: 'Two Ways to Measure Time',
      content: 'SYNC mode stays aligned with the Gregorian calendar — perfect for civil life, appointments, and coordination with the world that still uses the old calendar.\n\nTRUE mode follows its own astronomical leap rule (every 4th year has a 30-day March, except every 128th which does not). It slowly diverges over centuries to track the true tropical year with precision.\n\nBoth are valid. Start with SYNC for familiarity. Switch to TRUE when you are ready. The calendar adapts to you.',
      position: 'center',
      actionLabel: 'Enter the Calendar',
      tone: 'mysterious',
      visualComponent: 'sync-vs-true-epic',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. THE LIVING GRID (interactive)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'living-grid',
      type: 'interactive',
      title: 'The Calendar Breathes',
      content: 'This is no static grid. Each day holds your notes, moods, tasks, and celestial weather. Try it.',
      targetSelector: '.calendar-grid',
      position: 'bottom',
      actionRequired: '👆 Click any day to open its soul',
      tone: 'friendly',
      interactive: {
        interactionType: 'click',
        validation: { elementAppears: '.day-panel, [class*="DayPanel"]' },
        hints: [
          'Tap any date in the grid below',
          'Look for a number that calls to you',
          'Any day will open its secrets 🌙',
        ],
        hintDelays: [4000, 9000, 14000],
        successMessage: 'The day opens.',
        indicator: 'pulse',
        badgeText: 'Touch me',
        shakeOnMiss: true,
      },
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 7. THE FIRST MARK (interactive)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'first-mark',
      type: 'interactive',
      title: 'Leave Your First Mark',
      content: 'Timekeepers record their journey. Add a note — a thought, a plan, a dream. Then save it to keep forever.',
      targetSelector: '.day-panel, [class*="DayPanel"]',
      position: 'top',
      actionRequired: 'Write something, then save it',
      tone: 'friendly',
      interactive: {
        interactionType: 'click',
        validation: { localStorageKey: 'tutorial-note-saved' },
        hints: [
          'Click "Add Note" or the + button',
          'Write a few words in the text area',
          'Tap Save when you are ready',
        ],
        hintDelays: [4000, 9000, 14000],
        successMessage: 'Your mark is preserved.',
        indicator: 'glow',
        badgeText: 'Write here',
      },
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 8. THE ORACLE
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'the-oracle',
      type: 'modal',
      title: 'The Oracle Awakens',
      content: 'In the corner of your screen lives the HEKA Oracle — an AI Coach that reads the celestial weather, your tasks, your journal, and the turning of the seasons.\n\nIt does not repeat itself. It remembers. It speaks in the voice of the stars.\n\nEnable it in Settings → HEKA AI, add an API key from Groq (free), OpenAI, or Anthropic, and the Oracle will begin to guide you.',
      position: 'center',
      actionLabel: 'Gaze Deeper',
      tone: 'mysterious',
      visualComponent: 'oracle-journal-v3',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 9. THE STARS
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'the-stars',
      type: 'modal',
      title: 'Enter the Stars',
      content: 'HEKA is powered by the Swiss Ephemeris — the same astronomical engine used by NASA. Calculate your birth chart, track personal transits, and read the sky with precision.\n\nThe Stars tab is your portal to the cosmos. Your celestial fingerprint awaits.',
      position: 'center',
      actionLabel: 'Continue',
      tone: 'mysterious',
      visualComponent: 'stars-hub-v2',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 10. THE CIRCLE & THE TASK
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'the-circle',
      type: 'modal',
      title: 'The Cosmic Circle',
      content: 'Invite friends into your orbit. Share tasks. Send celestial greetings. The Cosmic Circle turns a solitary calendar into a shared constellation.\n\nAnd the Planner? It does not just remind you — it chooses the best astrological moment to act.',
      position: 'center',
      actionLabel: 'Almost There',
      tone: 'friendly',
      visualComponent: 'cosmic-flow',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 11. THE DEEPER STORY (NEW — bridge to InfoModal)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'the-deeper-story',
      type: 'modal',
      title: 'There Is More to Learn',
      content: 'This was just the surface. The HEKA Calendar has seven chapters of depth waiting for you:\n\n• Why April begins the year\n• How the Three Arcs shape your seasons\n• The full history of calendar reform\n• How to live inside HEKA while the world uses Gregorian\n• The mathematics of TRUE mode\n\nTap the ℹ️ About button in the top bar anytime to read the full story.',
      position: 'center',
      actionLabel: 'I Understand',
      tone: 'calm',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 12. THE ASCENSION
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'ascension',
      type: 'celebration',
      title: 'You Are a Timekeeper Now',
      content: 'The calendar is awake. The stars are aligned. Your journey through time begins now.\n\nWelcome to HEKA.',
      position: 'center',
      actionLabel: 'Begin Journey',
      tone: 'excited',
    },
  ],
};
