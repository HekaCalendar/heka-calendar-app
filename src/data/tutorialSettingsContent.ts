/**
 * Settings Tutorial Content - Deep Explanations
 * Educational content explaining what each toggle/setting actually DOES
 */

import type { TutorialStep } from '../types/tutorial';

// ═══════════════════════════════════════════════════════════════════════════════
// DISPLAY SETTINGS - Detailed Explanations
// ═══════════════════════════════════════════════════════════════════════════════

export const civilToggleExplanation: TutorialStep = {
  id: 'civil-toggle-explanation',
  type: 'modal',
  title: '👁️ Civil Dates Toggle',
  content: `**What it does:** Shows the Gregorian (civil) calendar date alongside HEKA dates on each day cell.

**When enabled:**
• Each day shows two dates: HEKA date (top) and Civil date (bottom)
• Example: "15" (HEKA day 15) + "Apr 28" (Gregorian)

**When disabled:**
• Only HEKA dates are shown
• Cleaner, more immersive experience

**Best for:** Users transitioning from the regular calendar who need reference points. Once you're comfortable with HEKA dates, you may prefer to disable this for a cleaner look.`,
  position: 'center',
  actionLabel: 'Got it',
};

export const moonPhasesToggleExplanation: TutorialStep = {
  id: 'moon-phases-explanation',
  type: 'modal',
  title: '🌙 Moon Phases Toggle',
  content: `**What it does:** Displays precise moon phase icons on each day of the calendar.

**Powered by:** NASA-grade Swiss Ephemeris calculations (arc-second precision)

**Icons shown:**
• 🌑 New Moon - Planting above-ground crops, starting new projects
• 🌒 Waxing Crescent - Building, growth, expansion  
• 🌓 First Quarter - Taking action, making decisions
• 🌔 Waxing Gibbous - Refinement, detail work
• 🌕 Full Moon - Harvest, completion, maximum energy
• 🌖 Waning Gibbous - Sharing, gratitude, teaching
• 🌗 Last Quarter - Release, letting go, pruning
• 🌘 Waning Crescent - Rest, reflection, root crops

**Affects:** Agricultural guidance, energy forecasts, Oracle Journal insights`,
  position: 'center',
  actionLabel: 'Continue',
};

export const holidaysToggleExplanation: TutorialStep = {
  id: 'holidays-explanation',
  type: 'modal',
  title: '🎉 Holidays Toggle',
  content: `**What it does:** Shows holidays on your calendar based on your selected location.

**Holiday types shown:**
• **Public Holidays** - Country-specific (Australia Day, Thanksgiving, etc.)
• **Religious Holidays** - Easter, Christmas, Diwali, Ramadan (by location)
• **Celestial Events** - Equinoxes, solstices, cross-quarter days
• **Community Holidays** - Custom holidays suggested by HEKA community

**Location-aware:** The holidays change based on your selected country/region in settings.

**Custom holidays:** You can suggest new holidays via the Community Holidays section!`,
  position: 'center',
  actionLabel: 'Continue',
};

export const seasonalEventsToggleExplanation: TutorialStep = {
  id: 'seasonal-events-explanation',
  type: 'modal',
  title: '🌱 Seasonal Events Toggle',
  content: `**What it does:** Marks astronomical seasonal transitions on your calendar.

**Events shown:**
• **Spring Equinox** (Sept ~20) - Day and night equal, spring begins (Southern)
• **Summer Solstice** (Dec ~21) - Longest day, peak solar energy
• **Autumn Equinox** (March ~20) - Balance point, harvest time
• **Winter Solstice** (June ~21) - Shortest day, return of light
• **Cross-Quarter Days** - Imbolc, Beltane, Lammas, Samhain

**Use for:**
• Ritual planning and preparation
• Gardening timing (biodynamic agriculture)
• Energy work and meditation focus
• Understanding the "Arcs" of the year

**Note:** These are astronomical events calculated for your specific location!`,
  position: 'center',
  actionLabel: 'Continue',
};

export const agriculturalGuidanceToggleExplanation: TutorialStep = {
  id: 'agricultural-explanation',
  type: 'modal',
  title: '🌾 Agricultural Guidance Toggle',
  content: `**What it does:** Shows biodynamic planting guidance in the Celestial Guide.

**Based on:**
• Moon phases (waxing/waning)
• Zodiac sign the moon is in
• Traditional planting wisdom

**Guidance categories:**
• **Leaf Days** (Water signs) - Plant leafy greens, mow lawns
• **Fruit Days** (Fire signs) - Plant fruiting crops, harvest
• **Root Days** (Earth signs) - Plant root vegetables, transplant
• **Flower Days** (Air signs) - Plant flowers, prune, graft
• **Barren Days** - Weeding, pest control, preserving, resting

**Best for:** Gardeners, farmers, and anyone growing food or herbs.

**Precision:** Calculated daily using Swiss Ephemeris moon position data.`,
  position: 'center',
  actionLabel: 'Continue',
};

export const energyForecastToggleExplanation: TutorialStep = {
  id: 'energy-forecast-explanation',
  type: 'modal',
  title: '⚡ Energy Forecast Toggle',
  content: `**What it does:** Enables community energy voting and daily energy forecasts.

**How it works:**
1. Community members vote on the day's energy (after 7:30 PM previous day)
2. Votes are aggregated into a forecast
3. Results show throughout the day

**Energy levels:**
• 🔥 **High** - Great for action, starting projects, socializing
• ⚡ **Medium** - Balanced day, good for routine work
• 🌊 **Low** - Rest, reflection, completion, self-care

**Personal value:** After using HEKA for a while, you'll notice patterns between cosmic events and the community's energy perception.

**Voting:** Available from 7:30 PM the day before until end of day.`,
  position: 'center',
  actionLabel: 'Continue',
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODE SETTINGS - Deep Explanations
// ═══════════════════════════════════════════════════════════════════════════════

export const syncModeExplanation: TutorialStep = {
  id: 'sync-mode-explanation',
  type: 'modal',
  title: '🌐 SYNC Mode',
  content: `**What it does:** Aligns HEKA months with the Gregorian calendar year.

**How it works:**
• HEKA Month 1 begins on April 1 (Gregorian)
• HEKA Month 13 ends on March 28 (Gregorian)
• March 29-31 are the "Closing" arc of the year
• March 31 is the "Day Out of Time"

**Best for:**
• Users transitioning from regular calendars
• Aligning with standard business years
• School schedules and public holidays
• Easier coordination with non-HEKA users

**The "Day Out of Time":**
The 365th day (March 31) exists outside the calendar structure - no month, no weekday. A day for celebration, reflection, and timeless activities.`,
  position: 'center',
  actionLabel: 'Continue',
};

export const trueModeExplanation: TutorialStep = {
  id: 'true-mode-explanation',
  type: 'modal',
  title: '⚡ TRUE Mode',
  content: `**What it does:** Uses astronomical HEKA timing based on actual celestial events.

**How it works:**
• Year begins at Spring Equinox (actual astronomical event)
• March contains the leap day correction (4-year cycle, except 128th)
• Months align with actual solar/lunar cycles
• "True" to astronomical reality

**The Leap Day:**
Every 4 years (except the 128th year), March gets an extra day to align with the solar year. This creates a more accurate calendar than the Gregorian system over long periods.

**Best for:**
• Purists and astronomers
• Those following celestial timing strictly
• Ritual work aligned with actual equinoxes/solstices
• Agricultural timing based on real seasons

**Note:** In TRUE mode, month 1 always starts on the equinox, which varies slightly year to year (March 20-21).`,
  position: 'center',
  actionLabel: 'Got it',
};

// ═══════════════════════════════════════════════════════════════════════════════
// LOCATION SETTINGS - Explanations
// ═══════════════════════════════════════════════════════════════════════════════

export const locationSettingsExplanation: TutorialStep = {
  id: 'location-explanation',
  type: 'modal',
  title: '📍 Why Location Matters',
  content: `**What it affects:** All celestial calculations in HEKA Calendar.

**Calculations based on location:**
• **Solar Noon** - When the sun is highest in YOUR sky
• **Sunrise/Sunset** - Accurate times for your coordinates
• **Moon Phase** - Visual appearance from your hemisphere
• **Planetary Hours** - Day/night planetary rulers for your timezone
• **House Calculations** - Birth chart house cusps

**Examples:**
• In Australia (Southern), the moon appears "upside down" vs Northern hemisphere
• Solar noon in Sydney is hours different from London
• Seasons are reversed between hemispheres

**Privacy note:** Your location is used only for calculations and stored locally. It never leaves your device unless you explicitly enable cloud sync.`,
  position: 'center',
  actionLabel: 'Continue',
};

export const subRegionExplanation: TutorialStep = {
  id: 'subregion-explanation',
  type: 'modal',
  title: '🏛️ State/Province Selection',
  content: `**What it does:** Refines celestial calculations to your specific region.

**Why it matters:**
• Australia spans 3 timezones (East, Central, West)
• USA spans 4+ timezones
• Solar noon varies significantly across large countries

**Without sub-region:** Uses capital city coordinates
**With sub-region:** Uses your actual timezone and approximate location

**Best for:**
• Accurate planetary hours
• Precise solar noon timing
• Birth chart accuracy (astrology)
• Sunrise/sunset accuracy

**Optional:** The calendar works fine without this, but calculations are more precise with it.`,
  position: 'center',
  actionLabel: 'Got it',
};

// ═══════════════════════════════════════════════════════════════════════════════
// THEME & FONT SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

export const themeExplanation: TutorialStep = {
  id: 'theme-explanation',
  type: 'modal',
  title: '🎨 Color Themes',
  content: `**What it does:** Changes the color scheme of the entire app interface.

**Available themes:**
• **Egyptian Gold** (default) - Ancient Egyptian inspired, golden accents
• **Midnight Blue** - Deep blues, easier on eyes at night
• **Forest Green** - Natural, earthy tones
• **Sacred Geometry** - Purple/gold, mystical aesthetic
• **Cosmic Void** - Dark mode, space-themed
• **Solar Flare** - Warm oranges and yellows

**Module themes vs Paper themes:**
• **Module themes** - UI colors, borders, buttons
• **Paper themes** - Background textures (parchment, linen, etc.)

**Mix and match** for your perfect combination!`,
  position: 'center',
  actionLabel: 'Continue',
};

export const fontExplanation: TutorialStep = {
  id: 'font-explanation',
  type: 'modal',
  title: '🔤 Typography',
  content: `**What it does:** Changes the font family throughout the app.

**Available fonts:**
• **Elegant** (default) - Refined serif, classic calendar feel
• **Modern** - Clean sans-serif, contemporary look
• **Typewriter** - Monospace, organized and systematic
• **Handwritten** - Personal, journal-like quality
• **Ancient** - Stylized, mystical appearance

**Readability note:** All fonts are optimized for calendar readability. Choose based on your aesthetic preference and what feels comfortable for daily use.

**Accessibility:** All fonts maintain WCAG contrast standards for readability.`,
  position: 'center',
  actionLabel: 'Got it',
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASTROLOGY SETTINGS - Birth Chart Integration
// ═══════════════════════════════════════════════════════════════════════════════

export const birthChartIntegrationExplanation: TutorialStep = {
  id: 'birth-chart-integration-explanation',
  type: 'modal',
  title: '⭐ Birth Chart Integration',
  content: `**What it does:** Shows personalized astrology information based on YOUR birth chart.

**Requires:** A birth chart created in the Stars Hub

**What you'll see:**
• **Personal Transits** - Planets currently affecting your natal chart
• **Daily Briefing** - Guidance tailored to your chart
• **Void Moon Alerts** - When moon is "void of course" for YOU
• **Favorable Hours** - Planetary hours aligned with your chart

**Example:**
Without chart: "Moon in Leo - good for creativity"
With chart: "Moon conjunct your natal Venus - excellent for relationships and creative projects"

**Privacy:** Your birth data never leaves your device unless you enable cloud sync.`,
  position: 'center',
  actionLabel: 'Continue',
};

export const zodiacSystemExplanation: TutorialStep = {
  id: 'zodiac-system-explanation',
  type: 'modal',
  title: '♈ Zodiac System',
  content: `**What it does:** Chooses between tropical (12-sign) and sidereal (13-sign) zodiac.

**12-Sign Tropical (Western standard):**
• Based on seasons, not actual constellations
• Aries = Spring equinox
• Used by most Western astrologers
• Aligns with seasonal energy

**13-Sign Sidereal (Actual constellations):**
• Based on actual positions of constellations
• Includes Ophiuchus (the 13th sign)
• Accounts for precession of equinoxes
• Used by some Eastern and astronomical traditions

**Which to choose?**
• Most Western astrology uses 12-sign tropical
• If you follow Vedic astrology, use sidereal
• Try both and see which resonates with your experience

**Can be changed anytime** - your birth chart recalculates automatically.`,
  position: 'center',
  actionLabel: 'Got it',
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════

export const dailyTipsExplanation: TutorialStep = {
  id: 'daily-tips-explanation',
  type: 'modal',
  title: '🔔 Daily Astrology Tips',
  content: `**What it does:** Sends a daily notification with celestial guidance.

**When sent:** Morning (around 7 AM local time)

**Content includes:**
• Moon phase and sign
• Significant transits for the day
• Favorable activities
• Energy forecast
• If birth chart exists: Personal transits

**Example notification:**
"🌙 Moon enters Scorpio - Deep work and research favored today. Mercury trine your natal Sun - excellent for communication."

**Requirements:** Notification permission must be granted in device settings.

**Can be snoozed** on days you don't want notifications.`,
  position: 'center',
  actionLabel: 'Continue',
};

export const retrogradeAlertsExplanation: TutorialStep = {
  id: 'retrograde-alerts-explanation',
  type: 'modal',
  title: '⚠️ Retrograde Alerts',
  content: `**What it does:** Warns you when planets enter or leave retrograde motion.

**What is retrograde?**
A planet appears to move backward in the sky from Earth's perspective. Associated with:
• Mercury retrograde: Communication, travel, tech issues
• Venus retrograde: Relationships, finances, values  
• Mars retrograde: Energy, drive, conflicts
• Jupiter/Saturn retrograde: Growth, expansion, lessons

**Alerts sent:**
• 3 days before retrograde begins
• Day retrograde starts
• Day retrograde ends
• Significant stations (when planet stops to change direction)

**Use for:** Planning important events, backing up data, double-checking communications.`,
  position: 'center',
  actionLabel: 'Continue',
};

export const moonPhaseAlertsExplanation: TutorialStep = {
  id: 'moon-phase-alerts-explanation',
  type: 'modal',
  title: '🌕 Moon Phase Alerts',
  content: `**What it does:** Notifies you of major moon phases.

**Alerts for:**
• **New Moon** - Beginnings, intentions, planting
• **First Quarter** - Action, decisions, momentum
• **Full Moon** - Culmination, release, celebration
• **Last Quarter** - Reflection, completion, letting go

**Timing:** Evening before (around 8 PM)

**Bonus:** If you have a birth chart, includes whether the moon is making significant aspects to your natal chart during these phases.

**Use for:** Ritual timing, intention-setting, gardening, energy work.`,
  position: 'center',
  actionLabel: 'Got it',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE SETTINGS TUTORIAL
// ═══════════════════════════════════════════════════════════════════════════════

export const completeSettingsTutorialSteps: TutorialStep[] = [
  {
    id: 'settings-intro',
    type: 'modal',
    title: '⚙️ Settings Deep Dive',
    content: `Let's explore what each setting in HEKA Calendar actually DOES.

This tutorial explains:
• Display toggles and their effects
• SYNC vs TRUE mode differences
• Location calculation impacts
• Theme and font options
• Notification types

Ready to understand your calendar fully?`,
    position: 'center',
    actionLabel: 'Start Learning',
  },
  civilToggleExplanation,
  moonPhasesToggleExplanation,
  holidaysToggleExplanation,
  seasonalEventsToggleExplanation,
  agriculturalGuidanceToggleExplanation,
  energyForecastToggleExplanation,
  syncModeExplanation,
  trueModeExplanation,
  locationSettingsExplanation,
  subRegionExplanation,
  themeExplanation,
  fontExplanation,
  birthChartIntegrationExplanation,
  zodiacSystemExplanation,
  dailyTipsExplanation,
  retrogradeAlertsExplanation,
  moonPhaseAlertsExplanation,
  {
    id: 'settings-complete',
    type: 'celebration',
    title: '🎓 Settings Master!',
    content: `You now understand every setting in HEKA Calendar!

Remember: You can change these anytime. Experiment to find your perfect setup.

Pro tip: Start with defaults and gradually enable features as you explore the calendar.`,
    position: 'center',
    actionLabel: 'Apply Settings',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const settingsDeepDiveTutorial = {
  id: 'settings-deep-dive',
  category: 'advanced-features' as const,
  name: 'Settings Master Class',
  description: 'Comprehensive explanation of every toggle and setting',
  triggerCondition: 'manual' as const,
  steps: completeSettingsTutorialSteps,
};
