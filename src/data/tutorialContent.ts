/**
 * Tutorial Content - Enterprise Grade Interactive Onboarding
 * Comprehensive coverage of all HEKA Calendar features
 * 
 * STRUCTURE:
 * Phase 1: Orientation (30s) - Welcome, Pattern, Structure
 * Phase 2: Core Features (2min) - Grid, Notes, Navigation, Today
 * Phase 3: Customization (1min) - Settings, Moon, Themes
 * Phase 4: Advanced (optional, 1min) - Expand, Year, Journal, Stars
 * Phase 5: Completion
 */

import type { Tutorial, ContextualHelp } from '../types/tutorial';
import { celestialOnboarding } from './onboardingContent';
import eliteTutorial from './tutorialElite';

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING TUTORIAL - The Celestial Awakening
// ═══════════════════════════════════════════════════════════════════════════════

export const onboardingTutorial: Tutorial = celestialOnboarding;

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY: Interactive First-Time Experience (preserved for reference)
// ═══════════════════════════════════════════════════════════════════════════════

export const legacyOnboardingTutorial: Tutorial = {
  id: 'onboarding-main',
  category: 'onboarding',
  name: 'Welcome to HEKA Calendar',
  description: 'Learn the basics through hands-on interaction',
  triggerCondition: 'first-visit',
  maxShows: 1,
  estimatedDurationMinutes: 5,
  difficulty: 'beginner',
  steps: [
    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 1: ORIENTATION (Start with the problem, not the solution)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'welcome',
      type: 'welcome',
      title: 'The Calendar is Broken',
      content: 'The Gregorian calendar has months of 28, 29, 30, and 31 days. Weeks don\'t fit into months. Your birthday falls on a different day each year.\n\nHEKA fixes this.',
      position: 'center',
      actionLabel: 'How?',
      tone: 'calm',
    },
    {
      id: 'the-pattern',
      type: 'modal',
      title: '13 Months. Mostly Twenty-Eight Days.',
      content: 'Twelve months have exactly 4 weeks. March, the closing month, carries the leap day. Within each year, the 1st of every month falls on the same weekday.',
      position: 'center',
      actionLabel: 'The Year Starts When?',
      tone: 'friendly',
      visualComponent: 'month-structure',
    },
    {
      id: 'the-moon',
      type: 'modal',
      title: 'April First',
      content: `The year begins in April, when the northern hemisphere awakens. The southern hemisphere enters its rest. Balance.

The moon makes 13 cycles per year. HEKA tracks this honestly.`,
      position: 'center',
      actionLabel: 'Show Me',
      tone: 'calm',
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 2: CORE FEATURES (2 minutes)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'calendar-grid-interactive',
      type: 'interactive',
      title: 'Try Clicking a Day!',
      content: 'Unlike regular calendars, HEKA has 12 months with exactly 28 days each, plus March (the 13th month) with 29 or 30 days. The box with the glowing blue border shows today.',
      targetSelector: '.calendar-grid',
      position: 'bottom',
      actionRequired: '👆 Click any day to open details',
      tone: 'friendly',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '.day-panel, [class*="DayPanel"]',
        },
        hints: [
          'Look for the grid of dates and tap any number!',
          'Try clicking today\'s date—it has a glowing blue border!',
          'Any day in the calendar will work! 🎯',
        ],
        hintDelays: [5000, 10000, 15000],
        successMessage: 'Perfect! The day panel opened!',
        indicator: 'pulse',
        badgeText: 'Try me!',
        shakeOnMiss: true,
      },
    },
    
    // NEW: Note creation tutorial - CRITICAL MISSING FEATURE
    {
      id: 'note-creation-tutorial',
      type: 'interactive',
      title: 'Add Your First Note 📝',
      content: 'This is where you track your life! Add notes with color-coded categories—personal, work, spiritual, health, and more. Let\'s create one together.',
      targetSelector: '.day-panel, [class*="DayPanel"]',
      position: 'top',
      actionRequired: 'Click "Add Note" or the + button',
      tone: 'friendly',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '.note-form, [class*="NoteForm"], [class*="note-editor"], textarea[placeholder*="note"]',
        },
        hints: [
          'Look for an "Add Note" button or + icon in the day panel',
          'It might be at the bottom of the panel',
          'Click it to start writing!',
        ],
        successMessage: 'Note editor opened! Let\'s write something!',
        indicator: 'glow',
        badgeText: 'Write here!',
      },
    },
    
    // NEW: Category selection tutorial
    {
      id: 'note-category-tutorial',
      type: 'interactive',
      title: 'Choose a Category 🎨',
      content: 'Each note can have a color-coded category. This helps you see patterns over time. Try selecting one!',
      targetSelector: '.note-form, [class*="NoteForm"], [class*="note-editor"]',
      position: 'top',
      actionRequired: 'Click a category color',
      tone: 'helpful',
      interactive: {
        interactionType: 'click',
        validation: {
          localStorageKey: 'tutorial-category-selected',
        },
        hints: [
          'Look for colored circles or category buttons',
          'Try Personal (blue), Work (red), or Spiritual (purple)',
          'Each color represents a different life area',
        ],
        successMessage: 'Category selected! Colors help you track patterns!',
        indicator: 'pulse',
      },
    },
    
    // NEW: Save note tutorial
    {
      id: 'note-save-tutorial',
      type: 'interactive',
      title: 'Save Your Note 💾',
      content: 'Write anything you want—thoughts, plans, dreams. Then save it to keep forever.',
      targetSelector: '.note-form, [class*="NoteForm"], [class*="note-editor"]',
      position: 'top',
      actionRequired: 'Type something and click Save',
      tone: 'friendly',
      interactive: {
        interactionType: 'click',
        validation: {
          localStorageKey: 'tutorial-note-saved',
        },
        hints: [
          'Type a few words in the text area',
          'Then click the Save or Done button',
          'Your note is private and stays on your device',
        ],
        successMessage: 'Note saved! You\'ll see it on the calendar!',
        indicator: 'glow',
      },
    },
    
    {
      id: 'day-panel-close',
      type: 'interactive',
      title: 'Close the Day Panel',
      content: 'Great! You\'ve added your first note. Now let\'s close this panel and explore more features.',
      targetSelector: '.day-panel, [class*="DayPanel"]',
      position: 'top',
      actionRequired: 'Click the ✕ to close',
      tone: 'friendly',
      interactive: {
        interactionType: 'click',
        validation: {
          elementDisappears: '.day-panel__header, .day-panel__date, [class*="DayPanelHeader"]',
        },
        hints: [
          'Look for an X button in the top right',
          'Click it to close the day panel',
        ],
        successMessage: 'Perfect! Your note appears on the calendar day.',
        indicator: 'glow',
      },
    },
    
    // NEW: See note on calendar tutorial
    {
      id: 'note-on-calendar',
      type: 'spotlight',
      title: 'Your Note Lives Here 📌',
      content: 'See that indicator on the calendar day? That\'s your note! Click the day anytime to read or edit it. All your notes are organized and searchable.',
      targetSelector: '.calendar-day.has-note, .calendar-day[data-has-note="true"], [class*="hasNote"]',
      position: 'bottom',
      actionLabel: 'Keep Going',
      tone: 'helpful',
    },
    
    {
      id: 'month-navigation-prev',
      type: 'interactive',
      title: 'Go Back in Time ←',
      content: 'Click the left arrow to explore previous months. HEKA has 13 months, each with its own energy!',
      targetSelector: '.month-nav-prev',
      position: 'bottom',
      actionRequired: 'Click the ← arrow',
      tone: 'mysterious',
      interactive: {
        interactionType: 'click',
        validation: {
          localStorageKey: 'tutorial-month-nav-prev',
        },
        hints: [
          'Look for the ← arrow button',
          'Click it to go to the previous month',
        ],
        successMessage: 'Great! Now let\'s go forward!',
        indicator: 'bounce',
      },
    },
    {
      id: 'month-navigation-next',
      type: 'interactive',
      title: 'Go Forward in Time →',
      content: 'Now click the right arrow. Notice the colored arc changes—🔴 Opening, 🟢 Core, 🟣 Closing!',
      targetSelector: '.month-nav-next',
      position: 'bottom',
      actionRequired: 'Click the → arrow',
      tone: 'mysterious',
      interactive: {
        interactionType: 'click',
        validation: {
          localStorageKey: 'tutorial-month-nav-next',
        },
        hints: [
          'Look for the → arrow button',
          'Click it to go to the next month',
        ],
        successMessage: 'Returned to today.',
        indicator: 'bounce',
      },
    },
    
    // NEW: Arc explanation
    {
      id: 'arc-explanation',
      type: 'spotlight',
      title: 'The Three Arcs 🌈',
      content: '🔴 Opening (month 1): Beginnings, planting, new starts\n🟢 Core (months 2-10): Growth, action, fullness\n🟣 Closing (months 11-13): Harvest, reflection, completion\n\nEach arc has its own energy. Notice how you feel different in each!',
      targetSelector: '.month-header__arc, [class*="arcIndicator"], .month-arc',
      position: 'bottom',
      actionLabel: 'Got it!',
      tone: 'mysterious',
    },
    
    {
      id: 'today-button-interactive',
      type: 'interactive',
      title: 'Lost? Jump Back to Today!',
      content: 'Whenever you\'re exploring, this button instantly brings you back to the present moment.',
      targetSelector: '.btn-today',
      position: 'bottom',
      actionRequired: 'Click the "Today" button',
      tone: 'friendly',
      interactive: {
        interactionType: 'click',
        validation: {
          localStorageKey: 'tutorial-today-clicked',
        },
        hints: [
          'Look for a button with "Today" text',
          'It\'s usually near the month name',
        ],
        successMessage: 'Back to the present.',
        indicator: 'bounce',
        badgeText: 'Tap me!',
      },
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 3: CUSTOMIZATION (1 minute)
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'settings-interactive',
      type: 'interactive',
      title: 'Let\'s Open Settings',
      content: 'This is where you customize everything—themes, moon phases, location, and more!',
      targetSelector: '.settings-toggle-wrapper, .settings-toggle-btn',
      position: 'bottom',
      actionRequired: 'Click "Show Settings"',
      tone: 'excited',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '.settings-modal, .settings-overlay-root',
        },
        hints: [
          'Look for the "⚙️ Show Settings" button',
          'It\'s below the calendar header',
        ],
        successMessage: 'Welcome to your command center!',
        indicator: 'pulse',
        badgeText: 'Open me!',
      },
    },
    {
      id: 'settings-moon-toggle',
      type: 'interactive',
      title: 'Moon Phases on Calendar 🌙',
      content: 'Enable this to see moon phases directly on calendar days! Full moons for completion, new moons for beginnings.',
      targetSelector: '.btn-moon-toggle',
      position: 'bottom',
      actionRequired: 'Toggle the Moon button on/off',
      tone: 'mysterious',
      interactive: {
        interactionType: 'click',
        validation: {
          localStorageKey: 'tutorial-display-showMoonPhases',
        },
        hints: [
          'Look for the "Moon" button in the Display section',
          'Click to toggle it on (✓ will appear)',
        ],
        successMessage: 'Moon phases enabled! 🌙',
        indicator: 'pulse',
      },
    },
    
    // NEW: Theme selection (condensed from 4 steps to 1)
    {
      id: 'settings-theme-quick',
      type: 'interactive',
      title: 'Pick a Theme 🎨',
      content: 'Your calendar should match your style! Click "Colours" to see options, then pick any theme that speaks to you.',
      targetSelector: '.theme-settings__header, [class*="themeSettings"]',
      position: 'right',
      actionRequired: 'Open Colours and pick a theme',
      tone: 'excited',
      interactive: {
        interactionType: 'click',
        validation: {
          localStorageKey: 'tutorial-theme-selected',
        },
        hints: [
          'Click on "Colours" to expand theme options',
          'Then tap any theme preview to apply it',
          'Your choice saves automatically!',
        ],
        successMessage: 'Looking good! Your style! ✨',
        indicator: 'pulse',
      },
    },
    
    {
      id: 'close-settings',
      type: 'interactive',
      title: 'Close Settings When Ready',
      content: 'Take your time exploring! When done, close settings to see your changes.',
      targetSelector: '.settings-modal, .settings-overlay-root',
      position: 'right',
      actionRequired: 'Close settings (✕ or click outside)',
      interactive: {
        interactionType: 'click',
        validation: {
          elementDisappears: '.settings-modal, .settings-overlay-root',
        },
        hints: [
          'Look for an X button',
          'Or click on the calendar area',
        ],
        successMessage: 'Perfect! Back to your customized calendar!',
        indicator: 'glow',
      },
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 4: ADVANCED FEATURES (optional)
    // ═══════════════════════════════════════════════════════════════════════════
    
    // NEW: Calendar expansion tutorial
    {
      id: 'calendar-expansion',
      type: 'interactive',
      title: 'Expand Your View 🔍',
      content: 'These buttons make the calendar bigger—vertically or horizontally. Great for seeing more details or when you have lots of notes!',
      targetSelector: '.expand-btn-vertical, .expand-btn-horizontal, [class*="expand"], [class*="Expand"]',
      position: 'bottom',
      actionRequired: 'Try either expand button',
      canSkip: true,
      tone: 'helpful',
      interactive: {
        interactionType: 'click',
        validation: {
          localStorageKey: 'tutorial-calendar-expanded',
        },
        hints: [
          'Look for arrows pointing outward',
          'One expands vertically, one horizontally',
          'Click any to see more of your calendar!',
        ],
        allowSkipAfterSeconds: 5,
        successMessage: 'More space for your plans! 📐',
        indicator: 'pulse',
      },
    },
    
    // NEW: Year view tutorial
    {
      id: 'year-view-tutorial',
      type: 'interactive',
      title: 'See the Whole Year 📅',
      content: 'Click "Year" to see all 13 months at once. Perfect for long-term planning and spotting patterns across the entire year!',
      targetSelector: 'button:contains("Year"), .btn-year, [class*="yearButton"]',
      position: 'bottom',
      actionRequired: 'Click the Year button',
      canSkip: true,
      tone: 'helpful',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '.year-view, [class*="YearView"], [class*="yearModal"]',
        },
        hints: [
          'Look for a "Year" button near the month name',
          'Click it to see all 13 months together',
        ],
        allowSkipAfterSeconds: 5,
        successMessage: 'All 13 months at a glance! 🗓️',
        indicator: 'pulse',
      },
    },
    
    // NEW: Close year view
    {
      id: 'close-year-view',
      type: 'interactive',
      title: 'Back to Month View',
      content: 'Click any month to zoom back in, or close this view.',
      targetSelector: '.year-view, [class*="YearView"], [class*="yearModal"]',
      position: 'center',
      actionRequired: 'Click any month or close',
      canSkip: true,
      tone: 'friendly',
      interactive: {
        interactionType: 'click',
        validation: {
          elementDisappears: '.year-view, [class*="YearView"], [class*="yearModal"]',
        },
        allowSkipAfterSeconds: 3,
        successMessage: 'Back to the month view!',
        indicator: 'glow',
      },
    },
    
    // ENHANCED: Proper journal tutorial with note creation
    {
      id: 'journal-interactive',
      type: 'interactive',
      title: 'Your Oracle Journal 📓',
      content: 'The Journal is your private space for deeper thoughts, mood tracking, and discovering patterns over time. Everything stays on your device.',
      targetSelector: '.btn-journal',
      position: 'bottom',
      actionRequired: 'Click the Journal button',
      canSkip: true,
      tone: 'calm',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '.oracle-journal-overlay, .oracle-journal',
        },
        hints: [
          'Look for "Journal" text or a notebook icon',
        ],
        allowSkipAfterSeconds: 5,
        successMessage: 'Your private space awaits! 📝',
        indicator: 'pulse',
        badgeText: 'Try it!',
      },
    },
    
    // NEW: Journal entry creation
    {
      id: 'journal-create-entry',
      type: 'interactive',
      title: 'Create a Journal Entry ✍️',
      content: 'Journal entries can include your mood, deeper reflections, and track patterns over time. Let\'s create one!',
      targetSelector: '.oracle-journal-overlay, .oracle-journal',
      position: 'left',
      actionRequired: 'Click to add an entry',
      canSkip: true,
      tone: 'calm',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '.journal-entry-form, [class*="JournalForm"], [class*="entryForm"]',
        },
        hints: [
          'Look for a "+" button or "New Entry"',
          'Click to start writing',
        ],
        allowSkipAfterSeconds: 5,
        successMessage: 'Journal form opened! Write your heart out!',
        indicator: 'glow',
      },
    },
    
    // NEW: Mood tracking
    {
      id: 'journal-mood',
      type: 'interactive',
      title: 'How Are You Feeling? 😊',
      content: 'Select your mood for today. Over time, you\'ll see patterns in how your emotions flow with the calendar.',
      targetSelector: '.journal-entry-form, [class*="JournalForm"]',
      position: 'left',
      actionRequired: 'Pick a mood emoji',
      canSkip: true,
      tone: 'calm',
      interactive: {
        interactionType: 'click',
        validation: {
          localStorageKey: 'tutorial-mood-selected',
        },
        hints: [
          'Look for mood emojis (😊 😐 😔 etc.)',
          'Tap the one that matches how you feel',
        ],
        allowSkipAfterSeconds: 5,
        successMessage: 'Mood tracked! Patterns will emerge over time!',
        indicator: 'pulse',
      },
    },
    
    {
      id: 'journal-close',
      type: 'interactive',
      title: 'Close When Ready',
      content: 'Finish your entry or close the journal to continue. Your thoughts are always here when you need them.',
      targetSelector: '.oracle-journal-overlay, .oracle-journal',
      position: 'left',
      actionRequired: 'Close the journal',
      canSkip: true,
      interactive: {
        interactionType: 'click',
        validation: {
          elementDisappears: '.oracle-journal-overlay, .oracle-journal',
        },
        hints: [
          'Look for an X button to close',
          'Or click outside the journal',
        ],
        allowSkipAfterSeconds: 3,
        successMessage: 'Journal closed. Your entry is saved.',
        indicator: 'glow',
      },
    },
    
    {
      id: 'stars-hub-teaser',
      type: 'interactive',
      title: 'The Stars Await You! ✨',
      content: 'Ready for something cosmic? The Stars Hub has birth charts, planetary transits, and personalized astrology. Calculated against the actual sky.',
      targetSelector: 'button:contains("Stars"), button:contains("✨"), [class*="stars"], .btn-stars',
      position: 'bottom',
      actionRequired: 'Click to enter Stars Hub (or skip)',
      canSkip: true,
      tone: 'mysterious',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '.stars-hub, [class*="StarsHub"]',
        },
        hints: [
          'Look for "Stars" or a sparkles ✨ icon',
        ],
        allowSkipAfterSeconds: 5,
        successMessage: 'Welcome to the cosmos! 🌌',
        indicator: 'glow',
        badgeText: 'Explore!',
      },
    },
    
    // NEW: Brief stars hub intro
    {
      id: 'stars-hub-intro',
      type: 'spotlight',
      title: 'Your Cosmic Dashboard 🌟',
      content: 'Create your birth chart, check today\'s transits, and get personalized guidance. All calculations use Swiss Ephemeris—same as professional astrologers!',
      targetSelector: '.stars-hub, [class*="StarsHub"]',
      position: 'center',
      actionLabel: 'Amazing!',
      canSkip: true,
      tone: 'mysterious',
    },
    
    // NEW: Close stars hub
    {
      id: 'close-stars-hub',
      type: 'interactive',
      title: 'Return to Calendar',
      content: 'Explore the Stars Hub anytime! Click the back button or close to return to your calendar.',
      targetSelector: '.stars-hub, [class*="StarsHub"]',
      position: 'center',
      actionRequired: 'Close or go back',
      canSkip: true,
      interactive: {
        interactionType: 'click',
        validation: {
          elementDisappears: '.stars-hub, [class*="StarsHub"]',
        },
        allowSkipAfterSeconds: 3,
        successMessage: 'Back to the calendar! Stars are always there when you need them!',
        indicator: 'glow',
      },
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 5: COMPLETION
    // ═══════════════════════════════════════════════════════════════════════════
    {
      id: 'completion',
      type: 'celebration',
      title: 'You have walked through the door',
      content: `The calendar is yours now. Thirteen months of rhythm. A sky that speaks. A journal that remembers. Begin.`,
      position: 'center',
      actionLabel: 'Start Exploring',
      tone: 'excited',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS MASTER CLASS - Deep Dive Tutorial (condensed)
// ═══════════════════════════════════════════════════════════════════════════════

export const settingsMasterClassTutorial: Tutorial = {
  id: 'settings-master-class',
  category: 'settings-deep-dive',
  name: 'Settings Master Class',
  description: 'Master every setting and customization option',
  triggerCondition: 'manual',
  estimatedDurationMinutes: 5,
  difficulty: 'intermediate',
  requiredTutorials: ['elite-onboarding'],
  steps: [
    {
      id: 'settings-intro',
      type: 'welcome',
      title: 'Settings Overview',
      content: 'We will explore every toggle and option. By the end, your calendar will be perfectly tuned.',
      position: 'center',
      actionLabel: 'Let\'s Dive In!',
      tone: 'excited',
    },
    {
      id: 'open-settings',
      type: 'interactive',
      title: 'Open Your Settings',
      content: 'First things first—let\'s get into the settings panel.',
      targetSelector: '.settings-toggle-wrapper, [class*="settingsToggle"]',
      position: 'bottom',
      actionRequired: 'Click to open settings',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '.settings-panel, [class*="SettingsPanel"]',
        },
        hints: ['Find the settings/gear icon'],
        successMessage: 'Settings unlocked! 🔓',
        indicator: 'pulse',
      },
    },
    
    // NEW: Location setting (critical for accuracy)
    {
      id: 'location-setting',
      type: 'interactive',
      title: 'Set Your Location 📍',
      content: 'Your location affects moon phases, sunrise/sunset, and holidays. It\'s crucial for accurate celestial guidance!',
      targetSelector: '[class*="location"], button:contains("Location")',
      position: 'right',
      actionRequired: 'Find and click Location settings',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '[class*="location-panel"], [class*="LocationPanel"]',
        },
        hints: [
          'Look for "Location" in the settings menu',
          'It might have a 📍 icon',
        ],
        successMessage: 'Location settings found!',
        indicator: 'pulse',
      },
    },
    
    // NEW: SYNC vs TRUE mode explanation
    {
      id: 'sync-true-mode',
      type: 'spotlight',
      title: 'SYNC vs TRUE Mode',
      content: `SYNC: Aligns with Gregorian (April = Month 1). Easier transition.

TRUE: Astronomical timing based on actual equinoxes. For purists.

Toggle in Settings → Mode. Most users prefer SYNC to start!`,
      targetSelector: '[class*="mode"], button:contains("Mode")',
      position: 'right',
      actionLabel: 'Got it!',
    },
    
    {
      id: 'toggle-features-intro',
      type: 'spotlight',
      title: 'Feature Toggles Explained',
      content: `Here's what each toggle does:

🌙 Moon Phases - Daily moon icons + planting guidance
📅 Civil Dates - Show Gregorian dates alongside HEKA  
🎉 Holidays - Location-aware celebrations
🌱 Seasons - Equinoxes, solstices, cross-quarter days
⚡ Energy - Community voting on daily vibes
🌾 Agricultural - Biodynamic planting calendar`,
      targetSelector: '[class*="toggles"], [class*="feature-toggles"]',
      position: 'right',
      actionLabel: 'Let\'s try them!',
    },
    
    {
      id: 'close-settings-master',
      type: 'interactive',
      title: 'You\'re All Set!',
      content: 'Close settings when you\'re ready. Your calendar is now customized!',
      targetSelector: '.settings-panel, [class*="SettingsPanel"]',
      position: 'right',
      actionRequired: 'Close settings',
      interactive: {
        interactionType: 'click',
        validation: {
          elementDisappears: '.settings-panel, [class*="SettingsPanel"]',
        },
        successMessage: 'Settings explored.',
        indicator: 'glow',
      },
    },
    {
      id: 'completion',
      type: 'celebration',
      title: 'Settings',
      content: 'You now know every setting in HEKA Calendar. Your calendar is truly yours.',
      position: 'center',
      actionLabel: 'Continue',
      tone: 'excited',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CALENDAR BASICS TUTORIAL
// ═══════════════════════════════════════════════════════════════════════════════

export const calendarBasicsTutorial: Tutorial = {
  id: 'calendar-basics',
  category: 'calendar-basics',
  name: 'Understanding HEKA Time',
  description: 'Deep dive into the 13-month system',
  triggerCondition: 'manual',
  estimatedDurationMinutes: 4,
  difficulty: 'intermediate',
  requiredTutorials: ['elite-onboarding'],
  steps: [
    {
      id: 'heka-concept',
      type: 'modal',
      title: 'Why 13 Months? 🤔',
      content: `The HEKA calendar honors natural cycles:

🌙 13 Moon cycles per year (not 12!)
📅 28 days = perfect 4-week month
🎯 Within each year, every date is the same weekday
🌿 Aligns with planting & harvest cycles

The Gregorian calendar was designed for taxes and empire. HEKA was designed for humans and nature.`,
      position: 'center',
      actionLabel: 'Tell me more!',
    },
    {
      id: 'explore-arcs',
      type: 'interactive',
      title: 'Explore the Three Arcs',
      content: 'The year is divided into Opening (new beginnings), Core (growth), and Closing (completion). Let\'s navigate through them!',
      targetSelector: '.month-header, [class*="monthHeader"]',
      position: 'bottom',
      actionRequired: 'Click next arrow 3 times to see arcs change',
      interactive: {
        interactionType: 'click',
        validation: {
          customCheck: 'arcChangedThreeTimes',
        },
        hints: [
          'Click the right arrow repeatedly',
          'Watch the arc color change!',
        ],
        successMessage: 'You\'ve seen all three arcs! 🌈',
        indicator: 'bounce',
      },
    },
    {
      id: 'march-closing',
      type: 'modal',
      title: 'The Closing Month 🌀',
      content: `March is the only month with a variable length — twenty-nine days in standard years, thirty in leap years.

All correction lives in one place. The other twelve months are perfectly, permanently regular. March completes the year and prepares you for the next opening.

A time for reflection, completion, and setting intentions for the year to come.`,
      position: 'center',
      actionLabel: 'Beautiful!',
      tone: 'mysterious',
    },
    {
      id: 'completion',
      type: 'celebration',
      title: 'Time Master! ⏰',
      content: 'You now understand the HEKA calendar better than most humans understand the Gregorian calendar they\'ve used their whole lives!',
      position: 'center',
      actionLabel: 'Onward!',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASTROLOGY INTRO TUTORIAL
// ═══════════════════════════════════════════════════════════════════════════════

export const astrologyIntroTutorial: Tutorial = {
  id: 'astrology-intro',
  category: 'astrology-intro',
  name: 'Your Cosmic Journey',
  description: 'Introduction to birth charts and astrology',
  triggerCondition: 'feature-discovery',
  triggerAction: 'entered-stars-hub',
  requiredTutorials: ['elite-onboarding'],
  estimatedDurationMinutes: 8,
  difficulty: 'intermediate',
  completionAchievement: 'cosmic-explorer',
  steps: [
    {
      id: 'stars-hub-welcome',
      type: 'welcome',
      title: 'Welcome to the Stars Hub ✨',
      content: 'You have entered the astrology portal. Everything here is calculated with Swiss Ephemeris for arc-second precision. Let us discover your cosmic blueprint.',
      position: 'center',
      actionLabel: 'I\'m Ready!',
      tone: 'mysterious',
    },
    {
      id: 'create-birth-chart',
      type: 'interactive',
      title: 'Create Your Birth Chart',
      content: 'First, we need your birth details. This data stays on your device—completely private. Accurate birth time gives the best results!',
      targetSelector: 'button:contains("Create Birth Chart"), button:contains("New Chart"), [class*="createChart"]',
      position: 'bottom',
      actionRequired: 'Click to create your chart',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '[class*="birth-chart-form"], [class*="chartForm"]',
        },
        hints: [
          'Look for "Create Birth Chart" or "+" button',
        ],
        successMessage: 'Birth chart form opened! 🌟',
        indicator: 'pulse',
        badgeText: 'Start here!',
      },
    },
    {
      id: 'fill-birth-details',
      type: 'guided-task',
      title: 'Enter Your Birth Details',
      content: 'Fill in your birth information. Don\'t worry—this never leaves your device!',
      position: 'center',
      guidedTask: {
        subSteps: [
          {
            id: 'enter-date',
            instruction: 'Enter your birth date',
            targetSelector: 'input[type="date"], [class*="date-input"]',
            interactionType: 'input',
          },
          {
            id: 'enter-time',
            instruction: 'Enter your birth time (check your birth certificate!)',
            targetSelector: 'input[type="time"], [class*="time-input"]',
            interactionType: 'input',
          },
          {
            id: 'enter-location',
            instruction: 'Enter your birth location',
            targetSelector: 'input[placeholder*="location"], [class*="location-input"]',
            interactionType: 'input',
          },
          {
            id: 'submit-chart',
            instruction: 'Click Create/Save to generate your chart!',
            targetSelector: 'button[type="submit"], button:contains("Create"), button:contains("Save")',
            interactionType: 'click',
            validation: {
              elementAppears: '[class*="chart-wheel"], [class*="ChartWheel"]',
            },
          },
        ],
        completionMessage: 'Your cosmic fingerprint is ready! 🌌',
      },
    },
    {
      id: 'explore-chart-wheel',
      type: 'spotlight',
      title: 'Your Chart Wheel',
      content: 'This is your cosmic fingerprint! The wheel shows where each planet was when you were born. Each house and sign tells part of your story. Drag to rotate, tap planets for details!',
      targetSelector: '.chart-wheel, [class*="ChartWheel"]',
      position: 'center',
      actionLabel: 'Amazing!',
      tone: 'mysterious',
    },
    {
      id: 'completion',
      type: 'celebration',
      title: 'Cosmic Explorer! 🌟',
      content: 'You\'ve created your birth chart and taken your first step into astrology! Check back daily for transits and personalized guidance based on your unique chart.',
      position: 'center',
      actionLabel: 'To the Stars!',
      tone: 'excited',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNAL DEEP DIVE TUTORIAL
// ═══════════════════════════════════════════════════════════════════════════════

export const journalDeepDiveTutorial: Tutorial = {
  id: 'journal-deep-dive',
  category: 'journal',
  name: 'Master Your Journal',
  description: 'Deep dive into journaling, mood tracking, and patterns',
  triggerCondition: 'manual',
  estimatedDurationMinutes: 6,
  difficulty: 'intermediate',
  requiredTutorials: ['elite-onboarding'],
  steps: [
    {
      id: 'journal-intro',
      type: 'welcome',
      title: 'Your Private Sanctuary 📓',
      content: 'The Oracle Journal is more than a diary—it\'s a tool for self-discovery. Track moods, spot patterns, and watch yourself grow over time. Everything stays on your device, always private.',
      position: 'center',
      actionLabel: 'Open My Journal',
      tone: 'calm',
    },
    {
      id: 'open-journal',
      type: 'interactive',
      title: 'Open Your Journal',
      content: 'Click the Journal button to enter your private space.',
      targetSelector: '.btn-journal',
      position: 'bottom',
      actionRequired: 'Click the Journal button',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '.oracle-journal-overlay, .oracle-journal',
        },
        successMessage: 'Welcome to your sanctuary! 📝',
        indicator: 'pulse',
      },
    },
    {
      id: 'journal-features',
      type: 'spotlight',
      title: 'Journal Features',
      content: '✍️ Daily entries with rich text\n😊 Mood tracking with emoji\n🔍 Search all your entries\n📊 Pattern analysis over time\n🔒 100% private and local',
      targetSelector: '.oracle-journal-overlay, .oracle-journal',
      position: 'left',
      actionLabel: 'Let\'s Write!',
    },
    {
      id: 'create-entry-guided',
      type: 'guided-task',
      title: 'Create Your Entry',
      content: 'Let\'s create a journal entry together. Take your time—this is your space.',
      position: 'left',
      guidedTask: {
        subSteps: [
          {
            id: 'start-entry',
            instruction: 'Click to start a new entry',
            targetSelector: 'button:contains("New"), button:contains("+"), [class*="newEntry"]',
            interactionType: 'click',
          },
          {
            id: 'select-mood',
            instruction: 'How are you feeling? Pick a mood emoji',
            targetSelector: '[class*="mood"], [class*="emoji"]',
            interactionType: 'click',
          },
          {
            id: 'write-entry',
            instruction: 'Write a few thoughts (even just one sentence!)',
            targetSelector: 'textarea, [class*="entryText"]',
            interactionType: 'input',
          },
          {
            id: 'save-entry',
            instruction: 'Save your entry',
            targetSelector: 'button:contains("Save"), button:contains("Done")',
            interactionType: 'click',
          },
        ],
        completionMessage: 'Your first journal entry! A moment captured forever. 📖',
      },
    },
    {
      id: 'journal-search',
      type: 'interactive',
      title: 'Find Past Entries 🔍',
      content: 'The search feature lets you find entries by keyword, mood, or date. Try searching for something!',
      targetSelector: 'input[type="search"], [class*="search"], button:contains("Search")',
      position: 'left',
      actionRequired: 'Try the search feature',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '[class*="searchResults"], [class*="search-panel"]',
        },
        successMessage: 'Search opened! Find any memory! 🔍',
        indicator: 'pulse',
      },
    },
    {
      id: 'completion',
      type: 'celebration',
      title: 'Journal Master! 📖',
      content: 'You now know how to use your Oracle Journal to track your journey through time. Your future self will thank you for the memories!',
      position: 'center',
      actionLabel: 'Keep Writing!',
      tone: 'calm',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADVANCED FEATURES TUTORIAL
// ═══════════════════════════════════════════════════════════════════════════════

export const advancedFeaturesTutorial: Tutorial = {
  id: 'advanced-features',
  category: 'advanced-features',
  name: 'Power User Features',
  description: 'Deep dive into advanced capabilities',
  triggerCondition: 'manual',
  estimatedDurationMinutes: 5,
  difficulty: 'advanced',
  requiredTutorials: ['elite-onboarding'],
  steps: [
    {
      id: 'energy-voting',
      type: 'interactive',
      title: 'Community Energy Forecast ⚡',
      content: 'Vote on the day\'s energy and see what the community thinks. Your input helps everyone!',
      targetSelector: '.energy-vote-card, [class*="EnergyVote"]',
      position: 'left',
      actionRequired: 'Cast your vote on today\'s energy',
      interactive: {
        interactionType: 'click',
        validation: {
          targetHasClass: 'voted',
        },
        hints: ['Look for energy level options', 'Tap your choice'],
        successMessage: 'Your vote counts! 🗳️',
        indicator: 'pulse',
      },
    },
    {
      id: 'print-system',
      type: 'interactive',
      title: '📄 Print Beautiful Calendars',
      content: 'Generate print-ready PDFs with multiple themes. Perfect for journals, planners, or wall calendars!',
      targetSelector: 'button:contains("Print")',
      position: 'bottom',
      actionRequired: 'Open the print dialog',
      interactive: {
        interactionType: 'click',
        validation: {
          elementAppears: '[class*="print-panel"], [class*="PrintPanel"]',
        },
        hints: ['Look for the Print button', 'It might have a printer icon 🖨️'],
        successMessage: 'Print panel opened! 🖨️',
        indicator: 'pulse',
      },
    },
    {
      id: 'completion',
      type: 'celebration',
      title: 'Advanced Features',
      content: 'You now know the advanced features that make HEKA Calendar truly powerful. You are ready to use it with confidence.',
      position: 'center',
      actionLabel: 'I\'m a Pro!',
      tone: 'excited',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXTUAL HELP ENTRIES
// ═══════════════════════════════════════════════════════════════════════════════

export const contextualHelpEntries: ContextualHelp[] = [
  {
    id: 'moon-phase-help',
    selector: '.moon-phase-indicator, [class*="moonPhase"]',
    title: '🌙 Moon Phases',
    content: 'The moon phase affects energy levels, planting times, and emotional tides. New moons for beginnings, full moons for completion.',
    proTip: 'Farmers have planted by moon phases for thousands of years. There\'s wisdom in these cycles!',
    trigger: 'hover',
    category: 'astrology',
  },
  {
    id: 'arc-indicator-help',
    selector: '.month-header__arc, [class*="arc"]',
    title: 'The Three Arcs',
    content: 'Opening (red): Beginnings | Core (green): Growth | Closing (purple): Completion',
    proTip: 'Notice how your energy changes with each arc. Many users report feeling more introspective during Closing.',
    trigger: 'hover',
    category: 'calendar',
  },
  {
    id: 'note-category-help',
    selector: '.note-category, [class*="noteCategory"]',
    title: 'Note Categories 🎨',
    content: 'Color-coded categories help you track different areas of life. Personal, Work, Spiritual, Family, Health, Creative, General.',
    proTip: 'Over time, you\'ll see patterns in which categories you use most!',
    trigger: 'hover',
    category: 'notes',
  },
  {
    id: 'calendar-expansion-help',
    selector: '.expand-btn, [class*="expand"]',
    title: 'Expand View 🔍',
    content: 'Make the calendar bigger vertically or horizontally. Great for detailed planning!',
    proTip: 'Expand horizontally to see more months side-by-side for comparison.',
    trigger: 'hover',
    category: 'ui',
  },
  {
    id: 'march-leap-day',
    selector: '.month-march, [data-month="12"]',
    title: 'The Closing Month',
    content: 'March carries the leap day — twenty-nine days in standard years, thirty in leap years. All correction lives in one place.',
    proTip: 'The other twelve months are perfectly regular. Only March changes.',
    trigger: 'hover',
    showOnce: true,
    category: 'calendar',
  },
  {
    id: 'transit-indicator',
    selector: '.transit-badge, [class*="transit"]',
    title: 'Planetary Transits',
    content: 'Shows when planets are making significant aspects. Personal transits appear if you have a birth chart.',
    proTip: 'Mercury retrograde? You\'ll see it here. Knowledge is power!',
    trigger: 'hover',
    category: 'astrology',
  },
  {
    id: 'void-moon-help',
    selector: '.void-moon, [class*="voidMoon"]',
    title: 'Void of Course Moon',
    content: 'The moon is between signs. Not ideal for starting new projects, but good for reflection, completion, and routine tasks.',
    proTip: 'Great time for finishing things, not so great for launching things.',
    trigger: 'hover',
    category: 'astrology',
  },
  {
    id: 'planetary-hours-help',
    selector: '.planetary-hours, [class*="planetaryHours"]',
    title: 'Planetary Hours',
    content: 'Each hour is ruled by a planet. Plan important activities during favorable planetary hours.',
    proTip: 'Planetary hour of Jupiter? Great for growth activities. Hour of Mars? Good for exercise or competition.',
    trigger: 'hover',
    category: 'astrology',
  },
  {
    id: 'settings-quick-help',
    selector: '.settings-toggle-wrapper',
    title: '⚙️ Quick Settings',
    content: 'Toggle moon phases, civil dates, holidays, and more. Your preferences are saved automatically.',
    proTip: 'Long-press any toggle for a detailed explanation!',
    trigger: 'click',
    category: 'ui',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const allTutorials: Tutorial[] = [
  onboardingTutorial,  // Celestial Awakening — new unified onboarding
  eliteTutorial,       // Legacy elite experience (kept for reference)
  calendarBasicsTutorial,
  astrologyIntroTutorial,
  settingsMasterClassTutorial,
  advancedFeaturesTutorial,
  journalDeepDiveTutorial,
];

export const getTutorialById = (id: string): Tutorial | undefined => {
  return allTutorials.find(t => t.id === id);
};

export const getTutorialsByCategory = (category: string): Tutorial[] => {
  return allTutorials.filter(t => t.category === category);
};

export const getRecommendedTutorialForUser = (completedTutorials: string[]): Tutorial | null => {
  const progression = [
    'celestial-awakening-v1',
    'elite-onboarding',
    'calendar-basics',
    'journal-deep-dive',
    'settings-master-class',
    'astrology-intro',
  ];

  for (const id of progression) {
    if (!completedTutorials.includes(id)) {
      return getTutorialById(id) || null;
    }
  }
  return null;
};
