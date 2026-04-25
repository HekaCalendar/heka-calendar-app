/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE IMMACULATE ONBOARDING — Copy Content
 * Human, visual, factual. No em-dash spam. No AI speak.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { UserIntent } from '../types/onboardingV2';

export interface CopyBranch {
  default: string;
  feel?: string;
  work?: string;
  stars?: string;
}

export interface CopySet {
  [key: string]: CopyBranch;
}

export function getCopy(_intent: UserIntent | null): CopySet {
  return {
    // ═══════════════════════════════════════════════════════════════════════════
    // SPLASH SCREEN
    // ═══════════════════════════════════════════════════════════════════════════
    'splash.loading.sky': {
      default: 'Aligning with your sky...',
    },
    'splash.loading.ephemeris': {
      default: 'Calculating celestial positions...',
    },
    'splash.loading.hours': {
      default: 'Loading planetary hours...',
    },
    'splash.loading.calendar': {
      default: 'Preparing your calendar...',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // INTENT SELECTOR
    // ═══════════════════════════════════════════════════════════════════════════
    'intent.heading': {
      default: 'What calls to you?',
    },
    'intent.subheading': {
      default: 'Pick what resonates. You can explore everything later.',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // PERSONALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    'personalization.heading': {
      default: 'A calendar should know you',
      feel: 'Let the calendar feel your rhythm',
      work: "Let's build your calendar together",
      stars: 'The stars are waiting for you',
    },
    'personalization.subheading': {
      default: 'This lets HEKA speak in your voice. Skip anything that does not call to you.',
    },
    'personalization.name.label': {
      default: 'What should we call you?',
    },
    'personalization.name.placeholder': {
      default: 'Your name',
    },
    'personalization.birth.label': {
      default: 'When were you born?',
    },
    'personalization.birth.hint': {
      default: 'For your birth chart and celestial timing. Calculated locally. Never shared.',
    },
    'personalization.birthLocation.label': {
      default: 'Where were you born?',
    },
    'personalization.birthLocation.hint': {
      default: 'The sky looked different where you were born. Type a city, and we will find your first horizon.',
    },
    'personalization.currentLocation.label': {
      default: 'Where are you now?',
    },
    'personalization.currentLocation.hint': {
      default: 'So we can tell you when your sun rises and which planet rules your hour.',
    },
    'personalization.currentLocation.button': {
      default: 'Use my location',
    },
    'personalization.skip': {
      default: 'Skip for now',
    },
    'personalization.continue': {
      default: 'Continue',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // BIRTHDAY PROVOCATION
    // ═══════════════════════════════════════════════════════════════════════════
    'provocation.gregorian.label': {
      default: 'The calendar you inherited',
    },
    'provocation.gregorian.body': {
      default: 'Your birthday is {birthDate}. What day of the week was it? You cannot answer because the calendar you inherited is fractured. Its months are 28, 29, 30, or 31 days — scattered without reason. You need a nursery rhyme just to remember how long each one lasts. No wonder you feel untethered.',
    },
    'provocation.heka.label': {
      default: 'On the HEKA calendar',
    },
    'provocation.heka.body': {
      default: 'Your HEKA birthday is {hekaDate}. It falls on {birthDay}. Every year. Without exception. Twelve months of exactly twenty-eight days. March, the closing month, carries the leap day — twenty-nine, or thirty when the year requires it. One point of flux. Everywhere else: pure rhythm.',
    },
    'provocation.reveal': {
      default: 'Reveal my HEKA birthday',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // THE BREAKDOWN
    // ═══════════════════════════════════════════════════════════════════════════
    'breakdown.heading': {
      default: 'The Breakdown',
    },
    'breakdown.subheading': {
      default: 'Every reason the Gregorian calendar fails. And how HEKA fixes it.',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // GRID REVEAL
    // ═══════════════════════════════════════════════════════════════════════════
    'grid.heading': {
      default: 'Thirteen months. Mostly twenty-eight days.',
      feel: 'Feel the rhythm of thirteen balanced months',
      work: 'Finally, a grid that makes sense',
      stars: 'The year, arranged as the heavens intended',
    },
    'grid.subheading': {
      default: 'Thirteen months. Twelve hold twenty-eight days in perfect symmetry. March, the closing month, carries the leap day — twenty-nine, or thirty when the year requires it. One point of flux. Everywhere else: rhythm. Today is {hekaDate}.',
    },
    'grid.swipe-hint': {
      default: 'Swipe to explore the months',
    },
    'grid.arc.opening': {
      default: 'Opening Arc',
    },
    'grid.arc.core': {
      default: 'Core Arc',
    },
    'grid.arc.closing': {
      default: 'Closing Arc',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // DAY PANEL DISCOVERY
    // ═══════════════════════════════════════════════════════════════════════════
    'daypanel.heading': {
      default: 'Every day has a soul',
    },
    'daypanel.subheading': {
      default: 'Tap any day to open its story. Notes, tasks, mood, and celestial weather.',
    },
    'daypanel.hint': {
      default: 'Tap a day in the grid above',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // FIRST NOTE RITUAL
    // ═══════════════════════════════════════════════════════════════════════════
    'note.heading': {
      default: 'Leave your first mark',
      feel: 'What are you feeling right now?',
      work: 'What are you working on today?',
      stars: 'What do the stars reveal to you today?',
    },
    'note.subheading': {
      default: 'This journal is yours alone. Private, encrypted, and celestial.',
    },
    'note.placeholder': {
      default: 'What does today feel like?',
      feel: 'What does the moon stir in you today?',
      work: 'What would make today a success?',
      stars: 'What celestial pattern do you notice?',
    },
    'note.saved': {
      default: 'Your mark is preserved.',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // SYNC / TRUE DEMO
    // ═══════════════════════════════════════════════════════════════════════════
    'synctrue.heading': {
      default: 'Two ways to honor the sun',
    },
    'synctrue.subheading': {
      default: 'SYNC stays aligned with the world. TRUE follows the heavens.',
    },
    'synctrue.sync.label': {
      default: 'SYNC',
    },
    'synctrue.sync.desc': {
      default: 'Walk with the world. Keep your appointments, your deadlines, your shared rhythm with everyone who still counts time the old way.',
    },
    'synctrue.true.label': {
      default: 'TRUE',
    },
    'synctrue.true.desc': {
      default: 'Follow the actual sky. The true tropical year, measured in starlight, not politics.',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // ORACLE PREVIEW
    // ═══════════════════════════════════════════════════════════════════════════
    'oracle.heading': {
      default: 'The Oracle knows your sky',
    },
    'oracle.subheading': {
      default: 'A living intelligence that speaks to your moment.',
    },
    'oracle.message': {
      default: 'Welcome, {name}. The moon is in {moonSign} today. {planetaryHour} is active. What will you create?',
      feel: '{name}, the moon in {moonSign} calls for introspection. Feel into what wants to emerge.',
      work: '{name}, {planetaryHour} rules the hour. This is a time for the work that matters. What will you build?',
      stars: '{name}, the moon in {moonSign} forms a story with your {sunSign} sun. What pattern do you see?',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // STARS PREVIEW
    // ═══════════════════════════════════════════════════════════════════════════
    'stars.heading': {
      default: 'Your celestial map',
      feel: 'The sky remembers your first breath',
      work: 'Precision astronomy for your planning',
      stars: 'Your natal chart, rendered in real time',
    },
    'stars.subheading': {
      default: 'Your birth chart rendered against the real sky. No approximations. No generic horoscopes.',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // CIRCLE PREVIEW
    // ═══════════════════════════════════════════════════════════════════════════
    'circle.heading': {
      default: 'The Cosmic Circle',
    },
    'circle.subheading': {
      default: 'Share celestial timing with those you love. Plan together by the moon.',
    },

    // ═══════════════════════════════════════════════════════════════════════════
    // COVENANT
    // ═══════════════════════════════════════════════════════════════════════════
    'covenant.heading': {
      default: 'This is your time, reimagined',
      feel: '{name}, you are now a Timekeeper. The moon guides you.',
      work: '{name}, your calendar is awake. Thirteen months of perfect rhythm await.',
      stars: '{name}, the stars have welcomed you. Your celestial journey begins.',
    },
    'covenant.subheading': {
      default: 'Today is {hekaDate}. The moon is {moonPhase}. {planetaryHour} is active.',
    },
    'covenant.cta.begin': {
      default: 'Begin',
    },
    'covenant.cta.story': {
      default: 'Read the full story',
    },
  };
}

// ─── Nurture Sequence Content ───
export const NURTURE_SEQUENCE = [
  {
    id: 'first-note-nudge',
    delayMinutes: 10,
    condition: 'no-note' as const,
    title: 'Your journal awaits',
    body: 'What will you remember about today?',
    actionLabel: 'Write',
    actionType: 'open-day-panel' as const,
  },
  {
    id: 'day-1-greeting',
    delayMinutes: 60 * 24,
    condition: 'always' as const,
    title: 'Good morning, Timekeeper',
    body: 'A new day in the thirteenth month. What will you make of it?',
    actionLabel: 'Open calendar',
    actionType: 'open-day-panel' as const,
  },
  {
    id: 'stars-discovery',
    delayMinutes: 60 * 24 * 2,
    condition: 'no-stars' as const,
    title: 'The stars are aligned',
    body: 'Have you explored your celestial map?',
    actionLabel: 'Enter the Stars',
    actionType: 'open-stars' as const,
  },
  {
    id: 'journal-streak',
    delayMinutes: 60 * 24 * 3,
    condition: 'no-journal-3days' as const,
    title: 'Your journal grows',
    body: 'Three days of presence. The calendar remembers with you.',
    actionLabel: 'Journal',
    actionType: 'open-journal' as const,
  },
  {
    id: 'planner-unlock',
    delayMinutes: 60 * 24 * 7,
    condition: 'always' as const,
    title: 'A week of timekeeping',
    body: 'Seven days of HEKA time. The Planner now knows your rhythm. Ask it when to act.',
    actionLabel: 'Open Planner',
    actionType: 'open-coach' as const,
  },
];

// ─── Interpolation Helpers ───
export function interpolateCopy(
  template: string,
  values: Record<string, string | undefined>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const val = values[key];
    return val !== undefined && val !== null ? val : match;
  });
}
