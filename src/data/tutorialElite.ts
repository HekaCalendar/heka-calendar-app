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
      content: '',
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
      content: '',
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
      content: '',
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
      content: '',
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
      content: '',
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
      content: '',
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
      content: '',
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
      content: '',
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
      content: 'Powered by the same astronomical engine trusted by NASA. Every moon phase, every planetary position, every rise and set—calculated with extreme precision.',
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
      title: 'NASA-Level Accuracy',
      content: 'Sun position: ±0.001 arcseconds. Moon phase: ±0.01 arcseconds. Planetary positions: All major bodies. Rise and set times: ±1 second. This is not astrology—this is astronomy.',
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
      content: 'Eight phases. Twenty-nine point five days. Waxing for growth. Waning for release. Full for completion. New for beginnings. Track it all with Swiss precision.',
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
      content: 'Moon phases ON for planning and growth. Civil dates ON for Gregorian sync. Choose what you see. Stay connected to both calendars, or dive deep into HEKA time.',
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
      content: 'New moon: Set intentions. Waxing: Build momentum. Full: Execute and complete. Waning: Release and rest. Pattern recognition across lunar cycles reveals your optimal rhythms.',
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
      content: 'The exact moment of your birth, frozen in the heavens. Sun sign. Moon sign. Rising sign. All twelve houses. Your celestial DNA, decoded with Swiss precision.',
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
      content: 'Your private sanctuary for thoughts, dreams, and observations. Track moods alongside moon phases—discover patterns between your energy and lunar cycles. AI-powered transit prompts guide your reflections. Export to PDF and build your personal history, written in cosmic time.',
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
      content: '',
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
      content: '',
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
      content: 'Print your calendar in any of six unique themes—each optimized for stunning physical output. Create wall calendars that anchor your space in natural rhythm. Export to PDF for digital archives. Physical artifacts of your commitment to cosmic alignment.',
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
      content: 'Thirteen months of exactly twenty-eight days creates fifty-two perfect weeks. No fractional days. No drifting dates. Your routines become anchors—predictable, repeatable, reliable. Every fourth week, every twenty-eighth day, you know exactly where you stand in the year\'s rhythm.',
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
