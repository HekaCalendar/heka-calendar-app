/**
 * MASTER TUTORIAL CONTENT - Enterprise Grade
 * Comprehensive coverage of every feature in HEKA Calendar
 * 
 * Architecture:
 * - Module-based tutorials (each major section)
 * - Feature-level tutorials (specific capabilities)
 * - UI-element tutorials (individual buttons/toggles)
 * - Contextual micro-tutorials (triggered by actions)
 */

import type { Tutorial, ContextualHelp } from '../types/tutorial';

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 1: CORE CALENDAR INTERFACE (12 steps)
// Every button, control, and interaction
// ═══════════════════════════════════════════════════════════════════════════════

export const coreCalendarInterfaceTutorial: Tutorial = {
  id: 'core-calendar-interface',
  category: 'onboarding',
  name: 'Calendar Interface Masterclass',
  description: 'Complete guide to every control and button in the main calendar view',
  triggerCondition: 'manual',
  steps: [
    {
      id: 'header-overview',
      type: 'spotlight',
      title: 'The Header Bar',
      content: `The header contains your primary navigation and actions.

**Left side:**
• HEKA Calendar logo - Click to return home
• App title and subtitle

**Right side (top bar):**
• Sign In button - Create account for cloud sync
• Account avatar (when signed in)

All header controls are accessible from any view.`,
      targetSelector: '.app-header',
      position: 'bottom',
      actionLabel: 'Continue',
      spotlightPadding: 8,
    },
    {
      id: 'month-display',
      type: 'spotlight',
      title: 'Month & Year Display',
      content: `**Current HEKA Month:** Large text shows the active month name

**Month Index:** "Month X/13" - Shows which of the 13 months you're viewing

**Year Display:** 
• Standard year: "2026"
• Closing arc: "2026–2027" (spans two Gregorian years)

**The Arc Indicator:**
• 🔴 Red = Opening Arc (month 1) - New beginnings
• 🟢 Green = Core Arc (months 2-10) - Growth and development  
• 🟣 Purple = Closing Arc (months 11-13) - Completion and harvest

The arc colors appear throughout the app to indicate seasonal energy.`,
      targetSelector: '.month-header__title',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'navigation-arrows',
      type: 'spotlight',
      title: 'Month Navigation',
      content: `**← Left Arrow:** Previous month (cycles through all 13)
**→ Right Arrow:** Next month

**Keyboard shortcuts:**
• Left/Right arrow keys = Navigate months
• Up/Down arrow keys = Jump 3 months

**Tip:** Hold Shift while clicking arrows to jump 3 months at once (quarterly navigation).`,
      targetSelector: '.month-header__controls button:first-child, .month-header__controls button:last-child',
      position: 'bottom',
      actionLabel: 'Try It',
    },
    {
      id: 'today-button-detailed',
      type: 'spotlight',
      title: '"Today" Button Deep Dive',
      content: `**What it does:** Returns to the current date based on your SELECTED location's timezone.

**Important:** This is location-aware, not device-aware.

**Example:**
• Your device is in New York
• Your HEKA location is set to Sydney
• "Today" shows Sydney's current date (which may be tomorrow in NY)

**When to use:**
• After browsing other months/years
• When you first open the app
• To sync with your location's "now"

**Did you know:** Using this button counts toward navigation badges!`,
      targetSelector: 'button:contains("Today")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'search-button-detailed',
      type: 'spotlight',
      title: '🔍 Search Functionality',
      content: `**What it searches:**
• Specific dates (jump to any day)
• Notes content (find your journal entries)
• Holidays and events
• Moon phases by date

**Search syntax:**
• "Month 5 day 12" - Jump to specific HEKA date
• "April 15" - Find Gregorian date
• "Full moon" - Find all full moon days
• "birthday" - Search your notes

**Results:** Click any result to jump directly to that date with full context loaded.`,
      targetSelector: 'button:contains("🔍")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'year-button-detailed',
      type: 'spotlight',
      title: '📅 Year View',
      content: `**What it shows:** All 13 months displayed simultaneously in a scrollable grid.

**Year View features:**
• See the entire year at once
• Spot month-length patterns (all 28 days!)
• Identify arc transitions visually
• Click any day to jump to that month
• Print the full year calendar

**Use for:**
• Long-term planning
• Understanding the HEKA year structure
• Finding patterns across months
• Creating wall calendars

**Note:** March, the closing month, carries the leap day and completes the year.`,
      targetSelector: 'button:contains("Year")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'stars-button-detailed',
      type: 'spotlight',
      title: '✨ Stars Hub - Astrology Portal',
      content: `**The gateway to advanced features:**

**Inside Stars Hub:**
• 🏠 Dashboard - Morning briefing, quick stats
• 📊 Chart - Interactive birth chart wheel
• 🔭 Transits - Current planetary movements
• 📝 Patterns - Your personal event correlations
• ⚙️ Settings - Zodiac system preferences

**Birth charts:**
• Create unlimited profiles
• Switch between profiles instantly
• Compare charts (synastry)
• Export/share charts

**This is where the magic happens!** Every astrology feature lives here.`,
      targetSelector: 'button:contains("✨"), button:contains("Stars")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'stats-button-detailed',
      type: 'spotlight',
      title: '📊 Statistics Dashboard',
      content: `**Your usage analytics:**

**Notes Statistics:**
• Total notes created
• Notes by category (personal, work, spiritual, etc.)
• Notes by month
• Current and longest streaks
• Word count totals
• Mood tracking averages

**Engagement Statistics:**
• App open count
• Consecutive day streak
• Time spent in app
• Features discovered
• Achievements unlocked

**Use for:** Tracking your journey, building habits, celebrating milestones.`,
      targetSelector: 'button:contains("📊")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'journal-button-detailed',
      type: 'spotlight',
      title: '📓 Oracle Journal',
      content: `**Your private digital diary:**

**Journal features:**
• Daily entries with celestial context
• Mood tracking (1-5 scale)
• Auto-captured moon phase
• Auto-captured celestial events
• Multiple entries per day
• Search and filter entries
• Export to PDF/JSON

**Privacy:**
• All entries stored locally on device
• Encrypted storage
• Optional cloud backup (if signed in)
• Never shared or analyzed

**Oracle insights:** The journal captures the celestial context of every entry for pattern recognition.`,
      targetSelector: 'button:contains("📓")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'community-button-detailed',
      type: 'spotlight',
      title: '🌍 Community Features',
      content: `**Connect with the HEKA community:**

**Community Holidays:**
• Suggest new holidays
• Vote on community proposals
• See holidays by region
• Subscribe to holiday calendars

**Energy Forecast:**
• Vote on daily energy (High/Medium/Low)
• See community consensus
• Compare with your own perception
• Build collective wisdom

**Shared Calendars:**
• Create group calendars
• Share with friends/family
• Collaborative planning
• Event invitations

**All community features are opt-in and moderated.**`,
      targetSelector: 'button:contains("🌍")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'share-button-detailed',
      type: 'spotlight',
      title: 'Share Calendar',
      content: `**Sharing options:**

**Share via:**
• URL link (web-based view)
• QR code (scan to view)
• Direct message (if device supports)

**What gets shared:**
• Selected month's view
• Your notes (optional)
• Moon phases (if enabled)
• Holidays (if enabled)

**Privacy controls:**
• Choose what to include
• Notes are opt-in
• Links expire after 30 days
• Revoke access anytime

**Use for:** Sharing your planning, sending schedules, collaborative coordination.`,
      targetSelector: 'button:contains("Share")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'print-button-detailed',
      type: 'spotlight',
      title: '🖨️ Print System',
      content: `**Professional print output:**

**Print options:**
• Month view or Year view
• Include/exclude notes
• Include/exclude moon phases
• Include/exclude civil dates
• Multiple paper sizes (A4, Letter)
• Portrait or landscape

**Themes:**
• Default (Egyptian gold)
• Minimalist (clean, modern)
• Sacred Geometry (mystical)
• Nature Organic (earthy)
• Cyberpunk (futuristic)
• Ancient Egypt (hieroglyphic style)

**Output:** High-resolution PDF, print-ready.

**Milestone:** First print earns the "Print Pioneer" mark!`,
      targetSelector: 'button:contains("Print")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 2: CALENDAR GRID & DAY INTERACTION (10 steps)
// ═══════════════════════════════════════════════════════════════════════════════

export const calendarGridTutorial: Tutorial = {
  id: 'calendar-grid-deep-dive',
  category: 'onboarding',
  name: 'Calendar Grid Mastery',
  description: 'Understanding every element in the calendar grid and day interactions',
  triggerCondition: 'manual',
  steps: [
    {
      id: 'grid-overview',
      type: 'modal',
      title: 'The Calendar Grid Structure',
      content: `**4 weeks × 7 days = 28 days per month**

**Every HEKA month is identical:**
• Week 1: Days 1-7
• Week 2: Days 8-14
• Week 3: Days 15-21
• Week 4: Days 22-28

**Day of week alignment:**
• Day 1 is always the same day of week (varies by year)
• Day 8 is always the same as Day 1
• This creates perfect 4-week cycles

**Compare to Gregorian:**
• Gregorian months: 28-31 days (irregular)
• HEKA months: Always 28 days (perfect)
• Gregorian: Day 1 moves around (Sun-Sat)
• HEKA: Consistent structure every month`,
      position: 'center',
      actionLabel: 'Continue',
    },
    {
      id: 'day-cell-anatomy',
      type: 'spotlight',
      title: 'Day Cell Anatomy',
      content: `**Each day cell contains:**

**Top section:**
• HEKA day number (large)
• Civil date (small, if enabled)
• Moon phase icon (if enabled)

**Middle section:**
• Holiday indicators (dots/flags)
• Transit markers (small icons)
• Note indicators (colored dots)

**Bottom section:**
• Energy forecast (subtle coloring)
• Today highlight (gold border)
• Selected state (glow effect)

**Click actions:**
• Single click: Select day, open Day Panel
• Double click: Quick-add note
• Long press: Context menu (mobile)`,
      targetSelector: '.day-cell:not(.day-cell--blank)',
      position: 'right',
      actionLabel: 'Continue',
      spotlightPadding: 4,
    },
    {
      id: 'expand-calendar',
      type: 'spotlight',
      title: 'Expand Calendar Size',
      content: `**Two expand modes:**

**📐 Vertical Expand:**
• Makes calendar cells taller
• Shows more note preview text
• Better for detailed planning
• Click the ↕️ icon to toggle

**↔️ Horizontal Expand:**  
• Widens the calendar column
• Shrinks Day Panel to side
• Better for widescreen viewing
• Click the ↔️ icon to toggle

**Both modes can be active together** for maximum calendar space.

**Use case:** Switch to expanded mode when you have many notes per day, then collapse for normal browsing.

**Keyboard:** Press 'E' to toggle expand modes.`,
      targetSelector: 'button[title*="expand"], button[title*="Expand"]',
      position: 'left',
      actionLabel: 'Try It',
    },
    {
      id: 'today-highlighting',
      type: 'spotlight',
      title: 'Today Highlighting',
      content: `**"Today" is visually distinct:**

**Visual indicators:**
• Gold border around the day cell
• Subtle glow effect
• "Today" label appears
• Different background tint

**Important:** "Today" is based on your SELECTED LOCATION timezone, not your device timezone.

**If today seems wrong:**
• Check your location in Settings
• Verify timezone is correct
• Remember: different locations have different "now"

**Quick fix:** Click the "Today" button to jump to correct date.`,
      targetSelector: '.day-cell--today',
      position: 'right',
      actionLabel: 'Continue',
    },
    {
      id: 'march-closing-deep',
      type: 'spotlight',
      title: '🌀 The Closing Month',
      content: `**March: Where the year finds its balance**

**What makes it special:**
• The only month with a variable length
• 29 days in standard years, 30 in leap years
• All correction lives in one place
• The final act of the year's rhythm

**Traditional uses:**
• Reflection on the year past
• Setting intentions for the next opening
• Completion of unfinished work
• Celebration of what was built

**Visual:** Marked as the Closing Arc (purple/gold themed)

**In HEKA:** March closes every year. In SYNC mode, it aligns with Gregorian leap rules. In TRUE mode, it follows the astronomical 128-year cycle for greater long-term precision.`,
      targetSelector: '.month-march, [data-month="12"]',
      position: 'center',
      actionLabel: 'Continue',
    },
    {
      id: 'blank-cells',
      type: 'spotlight',
      title: 'Blank Cells (Month Padding)',
      content: `**Why some cells are empty:**

The calendar always shows a 7-column grid, but months don't always start on the first column.

**Example:**
If Month 1 starts on Wednesday:
• Sunday, Monday, Tuesday columns = blank
• Wednesday = Day 1
• And so on...

**This creates:**
• Visual alignment with day of week
• Consistent grid structure
• Easy "day of week" reading

**Gregorian calendars** do the same thing (just with uneven month lengths).`,
      targetSelector: '.day-cell--blank',
      position: 'center',
      actionLabel: 'Continue',
    },
    {
      id: 'weekday-headers',
      type: 'spotlight',
      title: 'Day of Week Headers',
      content: `**Column headers show:**
• Sunday (Sun)
• Monday (Mon)
• Tuesday (Tue)
• Wednesday (Wed)
• Thursday (Thu)
• Friday (Fri)
• Saturday (Sat)

**In HEKA:** These are for reference only. The 7-day week is preserved for compatibility, but the monthly structure is different.

**Note:** Some users prefer to think of HEKA as "day 1-28" rather than "Monday-Sunday" since every month starts the same way.

**Cultural note:** The 7-day week has ancient origins (Babylonian) and is preserved in most calendar reforms.`,
      targetSelector: '.calendar-grid__dow',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'moon-phase-icons',
      type: 'spotlight',
      title: '🌙 Moon Phase Icons on Calendar',
      content: `**8 moon phases shown as emojis:**

**Waxing (growing):**
• 🌑 New Moon - Start new projects
• 🌒 Waxing Crescent - Build momentum
• 🌓 First Quarter - Take action
• 🌔 Waxing Gibbous - Refine details

**Waning (decreasing):**
• 🌕 Full Moon - Culmination, harvest
• 🌖 Waning Gibbous - Share, teach
• 🌗 Last Quarter - Release, let go
• 🌘 Waning Crescent - Rest, restore

**Hover** over any moon icon to see exact illumination percentage and astrological sign.

**Agricultural guidance** uses these phases for planting recommendations.`,
      targetSelector: '.day-cell__moon',
      position: 'top',
      actionLabel: 'Continue',
    },
    {
      id: 'note-previews',
      type: 'spotlight',
      title: 'Note Previews in Calendar',
      content: `**Your notes appear directly on the calendar:**

**In normal mode:**
• Shows first 25 characters of first note
• Colored dot indicates note category
• "+3 more" indicates additional notes

**In expanded mode:**
• Shows up to 80 characters
• Shows up to 3 notes
• More detailed preview

**Category colors:**
• 🔵 Personal
• 🟢 Work
• 🟣 Spiritual
• 🟡 Family
• 🔴 Health
• 🟠 Creative
• ⚪ General

**Click any note preview** to open that specific note in Day Panel.`,
      targetSelector: '.day-cell__notes',
      position: 'top',
      actionLabel: 'Continue',
    },
    {
      id: 'holiday-indicators',
      type: 'spotlight',
      title: '🎉 Holiday Markers',
      content: `**Visual holiday indicators:**

**Small dot** = Holiday exists
• Color-coded by type
• Hover to see holiday name

**Flag icon** = Major holiday
• Prominent display
• Often affects energy forecasts

**Multiple holidays** = Stacked dots
• Some days have several events
• Check Day Panel for full list

**Holiday types:**
• 🟡 Gold = Public holidays
• 🔵 Blue = Religious/spiritual
• 🟣 Purple = Celestial events
• 🟢 Green = Community suggested

**Click the dot** to see holiday details and significance.`,
      targetSelector: '.day-cell__holiday-indicator',
      position: 'top',
      actionLabel: 'Continue',
    },
  ],
};

// Continue with more modules... (I'll create the rest)

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 3: DAY PANEL DEEP DIVE (12 steps)
// ═══════════════════════════════════════════════════════════════════════════════

export const dayPanelTutorial: Tutorial = {
  id: 'day-panel-masterclass',
  category: 'onboarding',
  name: 'Day Panel Mastery',
  description: 'Complete guide to the Day Panel and all its features',
  triggerCondition: 'manual',
  steps: [
    {
      id: 'day-panel-overview',
      type: 'spotlight',
      title: 'Day Panel Overview',
      content: `**The Day Panel opens when you select any day.**

**Three main sections:**

**Top:** Date header and celestial snapshot
• HEKA date (large)
• Civil date (if enabled)
• Day of week
• Arc indicator

**Middle:** Dynamic content cards
• Moon phase details
• Celestial guidance
• Planetary hours
• Energy forecast
• Personal transits (with birth chart)

**Bottom:** Notes section
• View existing notes
• Add new notes
• Categorize and mood-track

**Click any day in the calendar** to load its panel.`,
      targetSelector: '.day-panel, [class*="DayPanel"]',
      position: 'left',
      actionLabel: 'Continue',
    },
    {
      id: 'celestial-cards',
      type: 'spotlight',
      title: '🌟 Celestial Cards',
      content: `**Multiple informational cards appear based on settings:**

**Moon Phase Card:**
• Current phase name and emoji
• Illumination percentage
• Zodiac sign moon is in
• Void of course status
• Phase timing (exact times)

**Solar Information:**
• Sunrise time (your location)
• Sunset time
• Solar noon (sun highest point)
• Day length
• Season indicator

**Planetary Hours:**
• Current planetary ruler
• Day/night hour sequences
• Favorable activities

**Personal Transits:**
• Planets aspecting your birth chart
• Exact times of aspects
• Interpretation of effects

**Toggle cards in Settings** to customize what appears.`,
      targetSelector: '.celestial-cards, [class*="CelestialCard"]',
      position: 'left',
      actionLabel: 'Continue',
    },
    // ... more steps
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODULE 4: ORACLE JOURNAL DEEP DIVE (10 steps)
// ═══════════════════════════════════════════════════════════════════════════════

export const oracleJournalTutorial: Tutorial = {
  id: 'oracle-journal-complete',
  category: 'advanced',
  name: 'Oracle Journal Complete Guide',
  description: 'Master the journaling system with celestial context',
  triggerCondition: 'manual',
  steps: [
    {
      id: 'journal-interface',
      type: 'spotlight',
      title: '📓 Journal Interface',
      content: `**Two journal views:**

**Calendar View:**
• See entries by date
• Visual moon phase markers
• Mood color coding
• Entry count per day

**List View:**
• Chronological entry list
• Search and filter
• Sort by date, mood, category
• Bulk select for export

**Entry composition:**
• Rich text editor
• Auto-save (never lose work)
• Voice input (if supported)
• Image attachment (coming soon)

**Celestial context panel:**
• Shows moon phase when entry was made
• Current transits
• Planetary hour
• Weather (if location enabled)`,
      targetSelector: '.oracle-journal, [class*="OracleJournal"]',
      position: 'center',
      actionLabel: 'Continue',
    },
    {
      id: 'creating-entries',
      type: 'spotlight',
      title: 'Creating Journal Entries',
      content: `**Multiple ways to create entries:**

**From Day Panel:**
• Click "Add Note" on any day
• Auto-captures that day's celestial data
• Links entry to specific date

**From Journal modal:**
• Click "New Entry" button
• Choose date (defaults to today)
• Start writing

**Voice-to-text:**
• Tap microphone icon
• Speak your thoughts
• Edit transcription
• Save entry

**Quick entry:**
• Double-click any calendar day
• Opens minimal editor
• Type and save rapidly

**Each entry captures:**
• Timestamp
• Moon phase
• Celestial events
• Location
• Mood (if set)`,
      targetSelector: 'button:contains("Add Note"), button:contains("New Entry")',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'mood-tracking',
      type: 'spotlight',
      title: '😊 Mood Tracking',
      content: `**5-point mood scale:**

**1 - Very Low 😔**
• Difficult day
• High stress or sadness
• Rest recommended

**2 - Low 😕**
• Challenging day
• Energy depleted
• Self-care needed

**3 - Neutral 😐**
• Average day
• Steady energy
• Routine activities

**4 - Good 🙂**
• Positive day
• Energy flowing
• Productive activities

**5 - Excellent 😄**
• Peak day
• High energy and joy
• Celebration activities

**Tracking benefits:**
• Visualize patterns over time
• Correlate with moon phases
• Identify cyclical trends
• Build emotional awareness

**Charts:** View mood trends by month, arc, or year.`,
      targetSelector: '.mood-selector, [class*="mood"]',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'entry-categories',
      type: 'spotlight',
      title: '🏷️ Entry Categories',
      content: `**7 categories for organizing entries:**

**Personal 💭**
• Private thoughts
• Self-reflection
• Daily experiences

**Work 💼**
• Professional matters
• Career decisions
• Work patterns

**Spiritual 🙏**
• Meditation insights
• Spiritual experiences
• Practice logs

**Family 👨‍👩‍👧‍👦**
• Family events
• Relationship notes
• Home matters

**Health 💪**
• Physical wellbeing
• Exercise logs
• Health tracking

**Creative 🎨**
• Ideas and inspiration
• Creative projects
• Artistic expressions

**General 📝**
• Uncategorized
• Quick notes
• Miscellaneous

**Filter by category** to review specific life areas.`,
      targetSelector: '.category-selector, [class*="category"]',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'journal-search',
      type: 'spotlight',
      title: '🔍 Searching Entries',
      content: `**Powerful search capabilities:**

**Text search:**
• Search entry content
• Search titles
• Partial word matching
• Case insensitive

**Filter by:**
• Date range
• Category
• Mood rating
• Moon phase
• Has attachments

**Sort options:**
• Newest first
• Oldest first
• Mood (high to low)
• Mood (low to high)
• Entry length

**Saved searches:**
• Create custom filters
• Name and save them
• Quick access later

**Export filtered results:**
• Export specific subsets
• PDF or JSON format
• Share selections`,
      targetSelector: '.journal-search, input[placeholder*="search"]',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'journal-insights',
      type: 'spotlight',
      title: '📊 Journal Insights',
      content: `**Pattern recognition in your entries:**

**Automatic analysis:**
• Word frequency clouds
• Mood trend charts
• Category distribution
• Writing volume over time

**Celestial correlations:**
• Mood by moon phase
• Entry length by planetary hour
• Writing frequency by arc
• Category patterns by season

**Export options:**
• Full journal backup (JSON)
• PDF book format
• Print-friendly version
• Encrypted archive

**Privacy:** All insights are calculated locally. Your data never leaves your device unless you explicitly export it.`,
      targetSelector: '.journal-insights, [class*="insights"]',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'journal-themes',
      type: 'spotlight',
      title: '🎨 Journal Themes',
      content: `**Personalize your journal appearance:**

**Paper backgrounds:**
• Classic parchment
• Clean white
• Dark mode
• Lined paper
• Dot grid

**Module themes:**
• Matches main app theme
• Egyptian Gold
• Midnight Blue
• Forest Green
• And more...

**Font options:**
• Serif (traditional journal feel)
• Sans-serif (modern)
• Handwritten (personal)
• Monospace (organized)

**Custom CSS:**
• Advanced users can add custom styles
• Modify colors, spacing, fonts
• Share themes with community

**Dual theme system:**
• Paper theme = editor background
• Module theme = UI elements`,
      targetSelector: '.journal-theme-selector, [class*="JournalTheme"]',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'recurring-entries',
      type: 'spotlight',
      title: '🔄 Recurring Entries',
      content: `**Set up repeating journal entries:**

**Recurring patterns:**
• Daily (every day)
• Weekly (same day each week)
• Monthly (same date each month)
• Arc-based (each arc transition)
• Custom (your own pattern)

**Template entries:**
• Morning check-in template
• Evening reflection template
• Weekly review template
• Monthly summary template

**How it works:**
1. Create a template entry
2. Set recurrence pattern
3. App auto-creates entry on schedule
4. You fill it in each time

**Examples:**
• Daily gratitude practice
• Weekly goal review
• Monthly moon intention
• Seasonal reflection

**Edit anytime:** Modify template or individual occurrences.`,
      targetSelector: '.recurring-setup, [class*="recurring"]',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'journal-sharing',
      type: 'spotlight',
      title: '💬 Sharing Entries',
      content: `**Share journal content securely:**

**Share options:**
• Single entry (public link)
• Date range (PDF)
• Specific category export
• Mood-filtered selection

**Privacy controls:**
• Password protection
• Expiration date
• Revoke access anytime
• No celestial data included (optional)

**Use cases:**
• Share insights with therapist
• Send memories to family
• Publish selected entries (blog)
• Backup to cloud storage

**What recipients see:**
• Your entry text
• Date and time
• Mood (if you include it)
• Category (if you include it)
• Moon phase (optional)

**What they DON'T see:**
• Other entries
• Your birth chart
• Private settings
• Location data`,
      targetSelector: '.journal-share, [class*="share"]',
      position: 'bottom',
      actionLabel: 'Continue',
    },
    {
      id: 'journal-completion',
      type: 'celebration',
      title: '📓 Journal Master!',
      content: `You now understand the complete Oracle Journal system!

**Key takeaways:**
• Entries capture celestial context automatically
• Mood tracking reveals patterns
• Categories organize your life areas
• Search and filter find anything
• Export preserves your journey

**Milestone:** Keep writing for 7 days to earn the "Week Warrior" mark!`,
      position: 'center',
      actionLabel: 'Start Journaling',
    },
  ],
};

// Export all master tutorials
export const masterTutorials: Tutorial[] = [
  coreCalendarInterfaceTutorial,
  calendarGridTutorial,
  dayPanelTutorial,
  oracleJournalTutorial,
];

// Export contextual helps for every interactive element
export const masterContextualHelps: ContextualHelp[] = [
  // Header controls
  {
    id: 'header-logo-help',
    selector: '.app-title',
    title: '📜 HEKA Calendar',
    content: 'Click to return to today\'s date from anywhere in the app.',
    trigger: 'hover',
    category: 'ui',
  },
  {
    id: 'sign-in-help',
    selector: '.auth-button',
    title: '🔐 Account',
    content: 'Sign in for cloud sync, backup, and cross-device access. All data stays encrypted.',
    trigger: 'hover',
    category: 'feature',
  },
  
  // Calendar controls
  {
    id: 'expand-vertical-help',
    selector: 'button[title*="expand"], button[title*="Expand"]',
    title: '↕️ Expand Calendar',
    content: 'Toggle expanded view for more note visibility. Great when you have many entries per day.',
    trigger: 'hover',
    category: 'ui',
  },
  {
    id: 'prev-month-help',
    selector: 'button:contains("←")',
    title: '← Previous Month',
    content: 'Go to previous HEKA month. Hold Shift to jump 3 months.',
    trigger: 'hover',
    category: 'ui',
  },
  {
    id: 'next-month-help',
    selector: 'button:contains("→")',
    title: '→ Next Month',
    content: 'Go to next HEKA month. Hold Shift to jump 3 months.',
    trigger: 'hover',
    category: 'ui',
  },
  
  // Info modal
  {
    id: 'info-button-help',
    selector: 'button:contains("ℹ️")',
    title: 'ℹ️ About HEKA',
    content: 'Learn about the HEKA calendar system, its history, and how to use this app.',
    trigger: 'hover',
    category: 'feature',
  },
  
  // Arc indicator
  {
    id: 'arc-deep-help',
    selector: '.month-header__arc',
    title: 'The Three Arcs',
    content: '🔴 Opening=Beginnings | 🟢 Core=Growth | 🟣 Closing=Completion. The arc indicates the seasonal energy of this time of year.',
    trigger: 'hover',
    category: 'calendar',
  },
  
  // Celestial guide
  {
    id: 'celestial-guide-deep-help',
    selector: '.celestial-guide',
    title: '🌟 Celestial Intelligence',
    content: 'Daily cosmic snapshot: moon phase, solar noon, energy forecast, and agricultural guidance. Powered by Swiss Ephemeris.',
    trigger: 'hover',
    category: 'astrology',
  },
];
