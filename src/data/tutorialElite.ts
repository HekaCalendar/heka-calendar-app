/**
 * ELITE TUTORIAL SYSTEM - Comprehensive 23-Slide Experience
 * 
 * PHILOSOPHY:
 * The Gregorian calendar serves civil society brilliantly—taxes, payroll, global coordination.
 * HEKA offers an alternative rhythm for personal growth, cosmic connection, and natural alignment.
 * Both can coexist. Both have value. One for the world, one for your soul.
 * 
 * STRUCTURE:
 * 0. Cosmic Flow (Intro)
 * 1. Two Ways to Measure Time (Civil vs Natural)
 * 2. New Year Timing (Seasonal awareness)
 * 3. Calendar Evolution (Historical context)
 * 4-6. The HEKA Solution (13 months, Saturday start, Hexa)
 * 7-9. Meet the Precision (Swiss Ephemeris, NASA accuracy, 6000 years)
 * 10-12. Lunar Cycles (Moon phases, Toggles, Planning)
 * 13-15. Enter the Stars (Hub, Birth charts, Transits)
 * 16. Oracle Journal
 * 17. Themes & Personalization
 * 18. True vs Sync Mode
 * 19. Print & Export
 * 20. Free Themed Calendar Prints, Forever
 * 21. Completion
 */

import type { Tutorial } from '../types/tutorial';

export const eliteTutorial: Tutorial = {
  id: 'elite-onboarding',
  category: 'onboarding',
  name: 'The 13th Month Protocol',
  description: 'Elite immersive onboarding experience',
  triggerCondition: 'first-visit',
  maxShows: 1,
  estimatedDurationMinutes: 6,
  difficulty: 'beginner',
  steps: [
    // ═══════════════════════════════════════════════════════════════════════════
    // 0. INTRO: "The Cosmic Flow"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-00-cosmic-flow',
      type: 'modal',
      title: 'The Cosmic Flow',
      content: 'Time is not a straight line. It is a spiral. Every year, you return to the same celestial positions—but you are never the same person who stood here before.\n\nHEKA is built on this truth: that time moves in cycles, not grids. That the moon matters. That a calendar should serve the human soul, not just the tax office.',
      position: 'center',
      actionLabel: 'Continue',
      tone: 'mysterious',
      visualComponent: 'cosmic-flow',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. INTRO: "Two Ways to Measure Time" - VISUAL COMPARISON
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-01-two-ways',
      type: 'modal',
      title: 'Two Ways to Measure Time',
      content: 'You already know the civil calendar. It runs the world—taxes, payroll, global coordination. It is brilliant at what it does.\n\nBut it was never designed for the human soul. HEKA offers a parallel rhythm: one that honors the moon, the seasons, and the natural structure of your life. Both can coexist. One for the world. One for you.',
      position: 'center',
      actionLabel: 'New Year Timing',
      tone: 'calm',
      visualComponent: 'civil-vs-natural',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. PERSPECTIVE: "New Year Timing" - VISUAL DUAL HEMISPHERE
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-02-timing',
      type: 'modal',
      title: 'New Year Timing',
      content: 'In the Northern Hemisphere, the year begins in April—when spring announces new life. In the Southern Hemisphere, autumn begins the harvest cycle.\n\nEither way, HEKA aligns the new year with natural transition, not winter exhaustion. You begin when energy rises, not when it is at its lowest ebb.',
      position: 'center',
      actionLabel: 'The Historical Shift',
      tone: 'mysterious',
      visualComponent: 'new-year-resolutions',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. HISTORY: "The Calendar Evolution" - VISUAL TIMELINE
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-03-evolution',
      type: 'modal',
      title: 'The Calendar Evolution',
      content: 'The calendar you use was patched together over millennia. Roman emperors added months. Popes fixed drift. Astronomers adjusted leap years.\n\nEach patch solved one problem while leaving the deeper structure broken. HEKA is not another patch. It is a complete redesign—built from first principles for clarity, rhythm, and human wellbeing.',
      position: 'center',
      actionLabel: 'The 13-Month Harmony',
      tone: 'mysterious',
      visualComponent: 'calendar-evolution-visual',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. SOLUTION: "The 13-Month Harmony"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-04-structure',
      type: 'modal',
      title: 'The 13-Month Harmony',
      content: 'Thirteen months. Twelve months have exactly 28 days — four perfect weeks each. March, the closing month, has 29 days (30 in leap years).\n\nThe math is clean: (12 × 28) + 29 = 365. Within each year, every month begins on the same day of the week. Every date has a consistent weekday. You will always know what day your birthday falls on. Always.',
      position: 'center',
      actionLabel: 'Perfect Symmetry',
      tone: 'friendly',
      visualComponent: 'month-structure-v3',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. SOLUTION: "Year Structure" - ACCURATE MATH
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-05-structure',
      type: 'modal',
      title: 'Year Structure',
      content: 'A HEKA year flows in three acts. April opens. May through December forms the stable core. January through March brings resolution.\n\nAll correction is contained in March—29 days, or 30 in leap years. The other twelve months are perfectly, permanently regular. A rhythm you can feel in your bones.',
      position: 'center',
      actionLabel: 'The Saturday Start',
      tone: 'friendly',
      visualComponent: 'year-structure',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. SOLUTION: "The Saturday Start" - PSYCHOLOGY
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-06-saturday',
      type: 'modal',
      title: 'The Saturday Start',
      content: 'Saturday begins the week. Friday completes it.\n\nThis is not arbitrary. Saturday (Saturn\'s day) anchors the week with structure and discipline. Friday (Freya\'s day) closes it with celebration and release. The rhythm mirrors the natural arc of human energy across seven days.',
      position: 'center',
      actionLabel: 'Meet Hexa',
      tone: 'mysterious',
      visualComponent: 'saturday-start',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 7. SOLUTION: "Hexa - The Bridge Month"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-07-hexa',
      type: 'modal',
      title: 'Hexa — The Bridge Month',
      content: 'Hexa is the sixth month—the bridge between the first half and second half of the year.\n\nNamed for its position (hex = six), it stands at the pivot point. By Hexa, your New Year intentions have gained momentum. By Hexa, you know whether your direction is true. It is the month of mid-course correction.',
      position: 'center',
      actionLabel: 'Meet the Precision',
      tone: 'mysterious',
      visualComponent: 'hexa-month',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 8. PRECISION: "Swiss Ephemeris Engine"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-08-swiss',
      type: 'modal',
      title: 'Swiss Ephemeris Engine',
      content: 'Every moon phase, every planetary position, every rise and set—calculated with precision against the real sky.',
      position: 'center',
      actionLabel: 'NASA-Level Accuracy',
      tone: 'calm',
      visualComponent: 'swiss-engine-intro',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 9. PRECISION: "NASA-Level Accuracy"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-09-nasa',
      type: 'modal',
      title: 'Precision Against the Real Sky',
      content: 'Sun position: ±0.001 arcseconds. Moon phase: ±0.01 arcseconds. Planetary positions: All major bodies. Rise and set times: ±1 second. This is astronomy, rendered for your daily life.',
      position: 'center',
      actionLabel: '6,000 Years',
      tone: 'calm',
      visualComponent: 'swiss-engine-v2',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 10. PRECISION: "6,000 Years of Data"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-10-range',
      type: 'modal',
      title: '6,000 Years of Data',
      content: 'Calculate any date from 3000 BCE to 3000 CE. Ancient rituals. Future planning. The past and present of celestial mechanics at your fingertips.',
      position: 'center',
      actionLabel: 'Lunar Cycles',
      tone: 'mysterious',
      visualComponent: 'time-range',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 11. LUNAR: "Moon Phases & Astronomy"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-11-moon',
      type: 'modal',
      title: 'Moon Phases & Astronomy',
      content: 'Eight phases. Twenty-nine point five days. Waxing for growth. Waning for release. Full for completion. New for beginnings. Track the moon as she breathes.',
      position: 'center',
      actionLabel: 'Toggle Your View',
      tone: 'mysterious',
      visualComponent: 'moon-phases-v2',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 12. LUNAR: "Toggle Your View"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-12-toggles',
      type: 'modal',
      title: 'Toggle Your View',
      content: 'Let the moon guide your days, or keep the civil calendar close at hand. Choose what you see. Walk in both worlds, or descend fully into HEKA time.',
      position: 'center',
      actionLabel: 'Plan with the Moon',
      tone: 'helpful',
      visualComponent: 'toggle-features',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 13. LUNAR: "Plan with the Moon"
    // ═════════════════════════════════════════════════════════════════ =========══
    {
      id: 'step-13-planning',
      type: 'modal',
      title: 'Plan with the Moon',
      content: 'New moon: Set intentions. Waxing: Build momentum. Full: Execute and complete. Waning: Release and rest. Follow her through the month, and you will find your own tide.',
      position: 'center',
      actionLabel: 'Enter the Stars',
      tone: 'mysterious',
      visualComponent: 'moon-planning',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 14. STARS: "Stars Hub"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-14-stars',
      type: 'modal',
      title: 'Stars Hub',
      content: 'Your cosmic fingerprint awaits. Calculate natal charts. Track planetary transits. Discover compatibility. The stars do not compel—they guide.',
      position: 'center',
      actionLabel: 'Your Birth Chart',
      tone: 'mysterious',
      visualComponent: 'stars-hub-v2',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 15. STARS: "Your Birth Chart"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-15-chart',
      type: 'modal',
      title: 'Your Birth Chart',
      content: 'The exact moment of your birth, frozen in the heavens. Sun sign. Moon sign. Rising sign. All twelve houses. Your birth moment, mapped against the actual sky.',
      position: 'center',
      actionLabel: 'Personal Transits',
      tone: 'mysterious',
      visualComponent: 'birth-chart',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 16. STARS: "Personal Transits"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-16-transits',
      type: 'modal',
      title: 'Personal Transits',
      content: 'Where are the planets now, relative to your birth chart? Daily guidance based on real celestial mechanics. Know when to act, when to wait, when to celebrate.',
      position: 'center',
      actionLabel: 'Private Sanctuary',
      tone: 'mysterious',
      visualComponent: 'personal-transits',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 17. JOURNAL: "Oracle Journal"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-17-journal',
      type: 'modal',
      title: 'Oracle Journal',
      content: 'Your private sanctuary for thoughts, dreams, and observations. Track moods alongside moon phases — discover patterns between your energy and lunar cycles. The Oracle offers prompts drawn from the living sky. Export when you wish, and build your personal history in cosmic time.',
      position: 'center',
      actionLabel: 'Make It Yours',
      tone: 'calm',
      visualComponent: 'oracle-journal-v3',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 18. THEMES: "Themes & Personalization"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-18-themes',
      type: 'modal',
      title: 'Themes & Personalization',
      content: 'Six visual themes. Each designed to evoke a different relationship with time.\n\nFrom the dark cosmic void to the warm parchment of ancient libraries—choose the aesthetic that resonates with your soul. Your calendar should feel like home.',
      position: 'center',
      actionLabel: 'Time Modes',
      tone: 'excited',
      visualComponent: 'themes-v2',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 19. MODES: "SYNC vs TRUE" - THE MATHEMATICS OF TIME
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-19-modes',
      type: 'modal',
      title: 'The Mathematics of Time',
      content: 'SYNC mode: March gains its extra day when the Gregorian calendar says it should. Familiar timing. Civil coordination.\n\nTRUE mode: HEKA follows its own astronomical correction rule—every 4th year has a 30-day March, except every 128th which does not. This tracks the true tropical year with centuries-long precision.\n\nSwitch anytime. The structure never changes. Only the correction trigger shifts.',
      position: 'center',
      actionLabel: 'Print Forever',
      tone: 'helpful',
      visualComponent: 'sync-vs-true-epic',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 20. PRINT: "Print & Export"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-20-print',
      type: 'modal',
      title: 'Print & Export',
      content: 'Print your calendar in any of six unique themes — each optimized for stunning physical output. Create wall calendars that anchor your space in natural rhythm. Export to PDF when you need a digital companion. Let your rhythm have weight in the world.',
      position: 'center',
      actionLabel: 'The Advantage',
      tone: 'helpful',
      visualComponent: 'print-v3',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 21. ADVANTAGE: "The Rhythm of Natural Time"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-21-rhythm',
      type: 'modal',
      title: 'The Rhythm of Natural Time',
      content: 'Twelve months of exactly twenty-eight days. March with its leap day. Fifty-two perfect weeks plus the closing correction. No fractional days. No drifting dates. Your routines become anchors — predictable, repeatable, reliable. Every fourth week, every twenty-eighth day, you know exactly where you stand in the year\'s rhythm.',
      position: 'center',
      actionLabel: 'Begin Your Journey',
      tone: 'excited',
      visualComponent: 'routine-visualization',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // 22. COMPLETION: "Welcome to Natural Time"
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'step-22-complete',
      type: 'celebration',
      title: 'Welcome to Natural Time',
      content: 'You now hold the thirteenth month—a tool for alignment, a rhythm for growth. Start in SYNC mode for a gentle transition. Explore your birth chart in the Stars Hub. Set your theme and make it yours. Your timeline awaits.',
      position: 'center',
      actionLabel: 'Enter the Timeline',
      tone: 'excited',
    },
  ],
};

export default eliteTutorial;
