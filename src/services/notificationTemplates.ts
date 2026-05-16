/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * NOTIFICATION TEMPLATES
 * Multi-variant copy libraries for every notification type.
 * Seeded randomness ensures users see different copy across days.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { NotificationTemplate } from '../types/notifications';

// ── Seeded Random Utility ────────────────────────────────────────────────────

export function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 2147483647) / 2147483647;
}

export function pickTemplate(templates: NotificationTemplate[], seed: string): NotificationTemplate {
  return templates[Math.floor(seededRandom(seed) * templates.length)];
}

export function formatTemplate(template: NotificationTemplate, vars: Record<string, string>): { title: string; body: string } {
  let title = template.title;
  let body = template.body;
  for (const [key, value] of Object.entries(vars)) {
    title = title.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    body = body.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return { title, body };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CALENDAR TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const HOLIDAY_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: '{holidayName} Tomorrow', body: 'A day of significance approaches. {holidayName} falls on the civil calendar tomorrow -- how will you honor it in the HEKA?' },
  { title: 'Tomorrow: {holidayName}', body: 'The civil world pauses for {holidayName}. Your HEKA calendar notes the rhythm too. Plan with intention.' },
  { title: 'A Holiday Approaches', body: '{holidayName} arrives tomorrow. Whether you celebrate or simply observe, let the day hold meaning.' },
  { title: '{holidayName} is Near', body: 'The calendar turns toward {holidayName}. The HEKA and civil cycles align in recognition.' },
  { title: 'Holiday Reminder', body: 'Tomorrow marks {holidayName}. A gentle nudge from your HEKA calendar.' },
  { title: '{holidayName} -- One Day Away', body: 'The civil calendar calls it {holidayName}. Your HEKA calendar simply says: prepare with presence.' },
  { title: 'Upcoming: {holidayName}', body: '{holidayName} arrives tomorrow. Take a moment to consider how the day serves your arc.' },
  { title: 'A Notable Day Ahead', body: '{holidayName} tomorrow. The HEKA calendar tracks all rhythms, civil and celestial.' },
  { title: 'The Eve of {holidayName}', body: 'Before the world pauses for {holidayName}, the HEKA calendar offers you a moment of preparation. What does this day mean to you?' },
  { title: '{holidayName} Approaches', body: 'Tomorrow the civil calendar marks {holidayName}. Your HEKA practice invites you to meet it with consciousness, not just habit.' },
  { title: 'A Rhythm Acknowledged', body: '{holidayName} is one sleep away. The HEKA calendar does not demand celebration -- only awareness.' },
  { title: 'The World Will Pause', body: 'For {holidayName}, the civil world slows. Your HEKA calendar asks: will you slow with intention, or rush through the quiet?' },
  { title: 'Tomorrow: {holidayName}', body: 'The calendar turns. {holidayName} arrives. The HEKA system tracks this not as obligation, but as rhythm.' },
  { title: 'Preparing for {holidayName}', body: 'One day before {holidayName}. The HEKA calendar offers this not as reminder, but as invitation -- to meet the day with presence.' },
  { title: 'The Threshold of {holidayName}', body: 'You stand at the eve of {holidayName}. How will you cross this threshold? The HEKA calendar simply holds the door.' },
  { title: '{holidayName} -- A Civil Moment', body: 'Tomorrow marks {holidayName} on the civil calendar. Your HEKA practice asks: what significance lives beneath the name?' },
  { title: 'A Day Approaches', body: '{holidayName} tomorrow. In the HEKA system, every marked day is an opportunity for intentional presence.' },
  { title: 'The Calendar Turns', body: 'The wheel moves toward {holidayName}. Your HEKA calendar has been tracking this moment since the year began.' },
  { title: 'Eve of {holidayName}', body: 'The night before {holidayName}. The HEKA calendar does not hurry you -- it simply says: notice what is coming.' },
  { title: '{holidayName} Remembers', body: 'Tomorrow, {holidayName} is observed. The HEKA calendar remembers so you can choose how to meet it.' },
  { title: 'A Civil Rhythm', body: '{holidayName} approaches on the civil calendar. The HEKA system honors all rhythms, not only its own.' },
  { title: 'Tomorrow Marks {holidayName}', body: 'The civil world will turn its attention to {holidayName}. Your HEKA calendar offers you the chance to turn yours with purpose.' },
  { title: 'The Approach of {holidayName}', body: 'One day remains before {holidayName}. The HEKA calendar notes this not as interruption, but as part of the larger pattern.' },
  { title: '{holidayName} -- Eve', body: 'The quiet before {holidayName}. Your HEKA practice invites stillness, even as the world prepares noise.' },
];

export const CIVIL_HEKA_TRANSITION_TEMPLATES: NotificationTemplate[] = [
  // 7 days before HEKA month end
  { title: '{hekaMonth} Enters Its Final Week', body: 'The month of {hekaMonth} is entering its closing arc. Time to wrap what you started.' },
  { title: '{hekaMonth} Wanes', body: 'Seven days remain in {hekaMonth}. What threads need tying before the next arc begins?' },
  { title: 'The Closing Arc of {hekaMonth}', body: 'Seven days left in {hekaMonth}. The HEKA month does not end with a bang -- it fades like twilight, inviting completion.' },
  { title: '{hekaMonth} -- Final Week', body: 'The last seven days of {hekaMonth} have begun. What remains unfinished? What deserves to be released?' },
  // 3 days before
  { title: '{hekaMonth}\'s Closing Arc Begins', body: 'Three days left in {hekaMonth}. The civil world still calls it {civilMonth} -- but your HEKA month is almost complete.' },
  { title: 'The End of {hekaMonth} Nears', body: 'In three days, a new HEKA month begins. The civil calendar does not mark this transition. You do.' },
  { title: 'Three Days in {hekaMonth}', body: 'The final triad of {hekaMonth} begins. Three days to complete, to release, to prepare. The HEKA wheel waits for no one.' },
  { title: '{hekaMonth} Prepares to Close', body: 'In three days, {hekaMonth} ends. What will you carry forward? What will you leave behind?' },
  // 1 day before
  { title: 'Tomorrow: A New HEKA Month', body: '{nextMonth} begins tomorrow. The civil calendar won\'t tell you -- but we will. Ready?' },
  { title: 'Final Day of {hekaMonth}', body: 'Today is the last full day of {hekaMonth}. Reflect. Release. Prepare for {nextMonth}.' },
  { title: 'The Last Day of {hekaMonth}', body: 'Tomorrow, {nextMonth} arrives. Today is your final breath of {hekaMonth}. Use it with intention.' },
  { title: '{hekaMonth} -- Last Light', body: 'The final day of {hekaMonth}. Tomorrow the arc shifts. What closing ritual will you offer this month?' },
  // Day 1 of new month
  { title: 'Welcome to {nextMonth}', body: 'A new HEKA month begins. The {arcName} arc continues. What will this chapter hold?' },
  { title: '{nextMonth} Has Arrived', body: 'The HEKA wheel turns. Welcome to {nextMonth}. The {arcName} arc deepens.' },
  { title: '{nextMonth} Begins Today', body: 'The door to {nextMonth} opens. Step through with clarity. The {arcName} arc awaits your imprint.' },
  { title: 'A New HEKA Month Dawns', body: '{nextMonth} is here. The {arcName} arc receives you. What seed will you plant in this fresh soil?' },
  // Civil month change (special case)
  { title: 'Civil {civilMonth} Has Arrived', body: 'Civil {civilMonth} begins, but you are already deep in HEKA {hekaMonth}. You are ahead of the civil game.' },
  { title: 'Two Calendars, One You', body: 'The civil world enters {civilMonth}. Your HEKA journey is already well into {hekaMonth}. Move with that advantage.' },
  { title: 'While the World Changes Months...', body: 'Civil {civilMonth} begins its parade. Meanwhile, you are deep in HEKA {hekaMonth}. You walk in two worlds.' },
  { title: 'The Civil Shift', body: 'The civil calendar turns to {civilMonth}. Your HEKA calendar smiles -- you have been tracking the deeper rhythm all along.' },
];

export const MOON_DEGREE_TEMPLATES: NotificationTemplate[] = [
  { title: 'Moon at {degree}° {sign}', body: 'The Moon enters {degree}° of {sign}. {meaning}' },
  { title: 'Lunar Shift: {degree}° {sign}', body: 'The Moon has moved to {degree}° {sign}. {meaning}' },
  { title: 'Moon Degree Update', body: 'Currently at {degree}° {sign}. {meaning}' },
  { title: '{degree}° {sign}', body: 'The Moon travels through {degree}° of {sign}. {meaning}' },
  { title: 'Lunar Position: {degree}° {sign}', body: '{meaning} The Moon is now at {degree}° {sign}.' },
  { title: 'Moon Degree Alert', body: 'The Moon reaches {degree}° in {sign}. {meaning}' },
  { title: 'Celestial Minute: {degree}° {sign}', body: 'The Moon sits at {degree}° {sign}. {meaning}' },
  { title: 'Moon Watch: {degree}° {sign}', body: 'Lunar update: {degree}° {sign}. {meaning}' },
  { title: 'Lunar Movement', body: 'The Moon has shifted to {degree}° {sign}. {meaning}' },
  { title: 'Moon at {degree}° {sign}', body: '{meaning} The lunar degree is now {degree}° {sign}.' },
  { title: 'The Moon Passes {degree}° {sign}', body: 'A precise lunar moment: {degree}° of {sign}. {meaning}' },
  { title: 'Lunar Coordinate: {degree}° {sign}', body: 'The Moon marks {degree}° in {sign}. {meaning}' },
  { title: 'Degree Alert: {degree}° {sign}', body: 'The Moon has reached {degree}° {sign}. {meaning}' },
  { title: 'Lunar Transit: {degree}° {sign}', body: 'The Moon transits {degree}° of {sign}. {meaning}' },
  { title: 'Moon Degree: {degree}° {sign}', body: 'The lunar coordinate reads {degree}° {sign}. {meaning}' },
  { title: 'The Moon at {degree}° {sign}', body: 'Lunar position update: {degree}° in {sign}. {meaning}' },
];

export const NOTE_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: 'HEKA Notes Today', body: 'You have {count} note{plural} waiting for you today. The calendar remembers so you don\'t have to.' },
  { title: 'Your Day Awaits', body: '{count} calendar note{plural} recorded for today. Step into the day prepared.' },
  { title: 'Notes for Today', body: '{count} note{plural} on your HEKA calendar. A small reminder from your past self.' },
  { title: 'HEKA Reminder', body: 'Today holds {count} note{plural}. Your calendar has been keeping track.' },
  { title: 'A Day With Intent', body: '{count} note{plural} shape today\'s arc. The HEKA calendar guides your rhythm.' },
  { title: 'Notes Await', body: '{count} note{plural} are recorded for today. Your past self left breadcrumbs.' },
  { title: 'Calendar Notes Today', body: 'You left {count} note{plural} for this day. The HEKA calendar brings them back to you now.' },
  { title: 'Your Notes', body: '{count} note{plural} on today\'s calendar. What did past-you want present-you to remember?' },
  { title: 'A Note From Time', body: '{count} calendar note{plural} for today. The HEKA system bridges past intention and present action.' },
  { title: 'Today\'s Reminders', body: 'The calendar holds {count} note{plural} for you today. Each one is a thread connecting you to your own intentions.' },
  { title: 'Notes for This Day', body: '{count} note{plural} recorded. The HEKA calendar does not forget -- it returns your words when the day arrives.' },
  { title: 'Your Calendar Speaks', body: '{count} note{plural} wait on today\'s page. The HEKA calendar is a conversation across time.' },
  { title: 'A Reminder From the Calendar', body: '{count} note{plural} for today. The HEKA system remembers so your mind can be free.' },
  { title: 'Today\'s Notes', body: 'You have {count} note{plural} attached to this day. The HEKA calendar brings them forward with precision.' },
  { title: 'Calendar Memory', body: '{count} note{plural} on the calendar for today. Each note is a promise your past self made to your present.' },
  { title: 'Notes Today', body: 'The HEKA calendar holds {count} note{plural} for this day. Read them. Remember why you placed them here.' },
  { title: 'Your Daily Notes', body: '{count} note{plural} recorded for today. The HEKA calendar is your external memory, precise and patient.' },
  { title: 'A Note Arrives', body: 'Today carries {count} note{plural} from your past self. The HEKA calendar delivers them with perfect timing.' },
  { title: 'Calendar Reminder', body: '{count} note{plural} for today. The HEKA system tracks what matters so you can live in the moment.' },
  { title: 'Today\s Intentions', body: 'You placed {count} note{plural} on this day. The HEKA calendar returns them to you now, exactly when needed.' },
];

export const NEW_YEAR_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: 'A New Cycle Begins', body: '{year} opens its gates. What intentions will you carry into this fresh arc?' },
  { title: 'Happy New Year', body: 'The civil calendar turns to {year}. Your HEKA calendar has been tracking the deeper rhythm all along.' },
  { title: '{year} Has Arrived', body: 'A new year dawns. The stars continue their dance -- how will you join them?' },
  { title: 'New Year, New Arc', body: 'Welcome to {year}. The HEKA wheel turns with you. Set your intentions with clarity.' },
  { title: 'The Year {year} Begins', body: 'A new cycle opens. The civil calendar calls it {year}. Your HEKA practice calls it opportunity.' },
  { title: 'A Fresh Arc', body: '{year} is here. The HEKA calendar does not celebrate blindly -- it invites you to enter with purpose.' },
  { title: 'The Gates of {year}', body: 'You cross the threshold into {year}. What will you leave behind? What will you claim?' },
  { title: '{year}: A New Chapter', body: 'The year turns. {year} offers 365 days of raw material. What will you build?' },
  { title: 'Welcome to {year}', body: 'The civil calendar resets. Your HEKA calendar deepens. {year} is not just a number -- it is an invitation.' },
  { title: 'A New Year Dawns', body: '{year} arrives with the sunrise. The HEKA system has been waiting for this moment. Have you?' },
  { title: 'The Cycle Renews', body: 'The wheel completes its turn. {year} begins. Your HEKA practice asks: what does this cycle mean to you?' },
  { title: '{year} -- A New Arc', body: 'The civil world celebrates {year}. Your HEKA calendar asks a quieter question: what will you cultivate?' },
  { title: 'The First Day of {year}', body: 'All journeys begin with a single step. {year} is yours to shape. The HEKA calendar walks beside you.' },
  { title: 'A Year Begins', body: '{year} opens like a blank page. The HEKA system does not write your story -- it gives you the tools to write it.' },
  { title: 'The Arc of {year}', body: 'A new year is not just time passing. It is an arc. {year} is your canvas. Begin with intention.' },
  { title: 'Entering {year}', body: 'You step into {year}. The HEKA calendar has tracked the celestial rhythm that brought you here. Walk forward with awareness.' },
  { title: '{year} Dawns', body: 'The Sun rises on {year} in {sunriseIn}. A new cycle begins. What will you cultivate in this fresh light?' },
  { title: 'The {planetaryHour} Year', body: '{year} opens under the {planetaryHour} hour. The HEKA calendar notes this celestial signature. Begin with intention.' },
];

export const SOLSTICE_EQUINOX_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: '{event} Today', body: 'The Sun reaches its {eventDescription}. A powerful moment in the celestial year -- pause and align.' },
  { title: 'Celestial Gateway', body: 'Today marks the {event}. Light shifts in the sky. Let it shift something in you too.' },
  { title: '{event}', body: 'The {eventDescription} arrives. The HEKA calendar notes this turning point. Honor the transition.' },
  { title: 'A Season Turns', body: 'The {event} is upon us. The wheel of the year moves forward -- where are you in its rhythm?' },
  { title: 'The Sun Stands Still', body: 'Today is the {event}. The Sun pauses at its extreme before turning back. What in your life is ready to turn?' },
  { title: 'A Celestial Threshold', body: 'The {event} marks a doorway in the solar year. Cross it with awareness. The light is changing.' },
  { title: 'Light Shifts Today', body: 'The {eventDescription} occurs today. The HEKA calendar honors these moments when the Sun changes its relationship with Earth.' },
  { title: 'The Solar Wheel Turns', body: 'Today: the {event}. One of four hinges on which the year hangs. The HEKA system invites you to notice.' },
  { title: 'A Moment of Balance', body: 'The {event} arrives. Day and night find their equilibrium. What in your life seeks the same?' },
  { title: 'The Sun Changes Direction', body: 'At the {event}, the solar path shifts. The HEKA calendar marks this as one of the year\'s true turning points.' },
  { title: 'Today: {event}', body: 'The {eventDescription} is exact today. The HEKA system tracks these solar milestones with precision. Pause. Align.' },
  { title: 'A Solar Milestone', body: 'The {event} has arrived. The Sun reaches a cardinal point in its annual journey. What does this season ask of you?' },
  { title: 'The Season Turns', body: 'Today marks the {event}. The light changes. The temperature shifts. The HEKA calendar says: change with it, consciously.' },
  { title: 'Celestial Equilibrium', body: 'The {event} occurs today. A moment of solar balance. The HEKA practice invites you to find your own.' },
  { title: 'A Hinge in the Year', body: 'The {event} is one of four doors in the solar cycle. Today, that door opens. Walk through with presence.' },
  { title: 'The Sun Reaches Its {event}', body: 'Today the Sun arrives at the {eventDescription}. The HEKA calendar has been counting down to this moment. Meet it with reverence.' },
];

export const MONTH_START_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: 'Welcome to {month}', body: 'A new HEKA month begins. The {arc} arc deepens. What will this chapter hold?' },
  { title: '{month} Has Begun', body: 'The HEKA wheel turns into {month}. Fresh energy, fresh possibility.' },
  { title: 'New Month: {month}', body: '{month} opens today under the {arc} arc. Step in with intention.' },
  { title: 'The {month} Arc', body: 'A new HEKA month rises. {month} carries the energy of {arc}. Begin with presence.' },
  { title: '{month} Dawns', body: 'The first day of {month} is here. The {arc} arc receives you. What offering will you make?' },
  { title: 'Entering {month}', body: 'You cross the threshold into {month}. The {arc} energy is available. Will you meet it?' },
  { title: 'A New Month Opens', body: '{month} begins its cycle today. Under the {arc} arc, what will you cultivate?' },
  { title: 'The Door to {month}', body: '{month} opens. The {arc} arc deepens. Each HEKA month is a world -- explore this one fully.' },
  { title: 'First Day of {month}', body: 'Today is day one of {month}. The {arc} energy is fresh and potent. Begin with clarity.' },
  { title: '{month} Arrives', body: 'The HEKA calendar turns to {month}. The {arc} arc continues its story. You are the author of this chapter.' },
  { title: 'The {month} Cycle', body: 'A new lunar-solar cycle begins: {month}. The {arc} arc shapes its character. How will you shape yours?' },
  { title: 'Welcome, {month}', body: '{month} greets you on its first day. The {arc} energy surrounds you. Step forward with open hands.' },
  { title: 'Month of {month}', body: 'The HEKA wheel delivers you to {month}. The {arc} arc is your backdrop. Paint something worth seeing.' },
  { title: '{month} -- Day One', body: 'The first sunrise of {month}. The {arc} arc is young. Plant something that will grow.' },
  { title: 'A Fresh Arc', body: '{month} begins. The {arc} arc opens like a flower. The HEKA calendar marks this as a day of beginnings.' },
  { title: 'The {month} Invitation', body: 'You are invited into {month}. The {arc} energy awaits. The HEKA calendar simply holds the door.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STARS TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const DAILY_CELESTIAL_TIPS_TEMPLATES: NotificationTemplate[] = [
  { title: 'Moon Waxing Bright', body: 'The Moon waxes toward fullness. What are you ready to bring to light?' },
  { title: 'Mercury in Motion', body: 'Mercury moves swiftly today. Trust your quick insights and speak your truth.' },
  { title: 'Venus Calls', body: 'Venus smiles on connections. Reach out to someone you care about.' },
  { title: 'Mars Ignites', body: 'Mars energizes your actions. Channel passion into constructive outlets.' },
  { title: 'Jupiter Opens Doors', body: 'Jupiter expands possibilities. Say yes to an opportunity that scares you.' },
  { title: 'Saturn Steadies', body: 'Saturn rewards discipline. What structure do you need to build today?' },
  { title: 'Void Moon Pause', body: 'The Void Moon invites rest. Pause before initiating something new.' },
  { title: 'Retrograde Season', body: 'A planet retrogrades soon. What area of life needs review and refinement?' },
  { title: 'Ruling Planet Bright', body: 'Your ruling planet shines bright. Your natural gifts are amplified today.' },
  { title: 'Sunlit Path', body: 'The Sun illuminates your path. Step forward with confidence and clarity.' },
  { title: 'Lunar Release', body: 'Lunar energy supports release. What can you let go of to create space?' },
  { title: 'Cosmic Creativity', body: 'Cosmic alignment favors creativity. Express yourself authentically today.' },
  { title: 'North Node Nudge', body: 'The North Node whispers of destiny. One small step toward your purpose today.' },
  { title: 'Pluto Surfaces', body: 'Pluto\'s deep current stirs. What truth wants to surface?' },
  { title: 'Neptune Dreams', body: 'Neptune dissolves boundaries. Dream, imagine, but keep one foot on solid ground.' },
  { title: 'The Moon Speaks', body: 'The lunar phase carries a message today. Listen to what the night sky is trying to tell you.' },
  { title: 'Mercury\'s Gift', body: 'Mercury offers mental clarity. This is a day for communication, writing, and sharp decisions.' },
  { title: 'Venusian Harmony', body: 'Venus casts her glow on your relationships. Beauty, pleasure, and connection are available -- claim them.' },
  { title: 'Martian Courage', body: 'Mars lends you his fire. Use it wisely. Direct passion toward what matters, not what merely annoys.' },
  { title: 'Jupiter\'s Bounty', body: 'Jupiter expands what you focus on. Focus on growth, and growth will find you.' },
  { title: 'Saturn\s Demand', body: 'Saturn asks for commitment. What have you been avoiding that requires your steady attention?' },
  { title: 'Uranian Spark', body: 'Uranus disrupts routine. A sudden insight may change your perspective. Stay open to the unexpected.' },
  { title: 'Neptune\'s Mist', body: 'Neptune blurs the lines between reality and dream. Create something beautiful before the fog clears.' },
  { title: 'Plutonic Depth', body: 'Pluto invites you underground. Face what you fear to lose. Transformation waits in the dark.' },
  { title: 'Solar Clarity', body: 'The Sun illuminates what was hidden. Today, truth is visible. Look directly at what you need to see.' },
  { title: 'Lunar Intuition', body: 'The Moon sharpens your intuition. Trust the feeling that logic cannot explain.' },
  { title: 'The Stars Align', body: 'A quiet but significant alignment occurs today. Small actions carry large consequences. Choose deliberately.' },
  { title: 'Celestial Breath', body: 'The cosmos breathes today. Match your rhythm to the larger one. Inhale possibility. Exhale expectation.' },
  { title: 'A Planetary Whisper', body: 'One planet speaks louder than the rest today. Can you hear which one? Its message is personal.' },
  { title: 'The Sky Remembers', body: 'The celestial pattern today echoes something from your past. The stars do not forget -- neither should you.' },
];

export const NEW_MOON_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: 'New Moon Tonight', body: 'The Moon begins a fresh cycle. Set your intentions. Plant seeds. The dark sky holds infinite potential.' },
  { title: 'A New Lunar Cycle', body: 'The New Moon arrives. What will you call forth in this 29-day arc? Begin with clarity.' },
  { title: 'Dark Moon, Bright Beginnings', body: 'The sky is darkest before the light returns. Tonight marks a new lunar chapter -- write your opening line.' },
  { title: 'New Moon Portal', body: 'The lunar cycle resets. This is the moment to declare what you are building. Speak it into the dark.' },
  { title: 'The Moon Is New', body: 'Tonight the Moon hides her face. In that darkness, your intentions carry extra weight. What do you seed?' },
  { title: 'A Blank Lunar Page', body: 'The New Moon offers a blank page. The next 29 days are a story you have not yet written. Begin.' },
  { title: 'The Dark Moon Speaks', body: 'When the Moon is invisible, she is not absent -- she is listening. Whisper your intentions to the dark.' },
  { title: 'Lunar Reset', body: 'The New Moon is nature\'s reset button. Press it. Release what the last cycle held. Begin again.' },
  { title: 'The Cycle Renews', body: 'A new lunar cycle begins tonight. The New Moon is the cosmic equivalent of a deep breath before the exhale.' },
  { title: 'Seeds in Darkness', body: 'Seeds germinate in darkness. The New Moon is your dark soil. Plant something that needs time to grow.' },
  { title: 'The Invisible Moon', body: 'You cannot see the Moon tonight, but she is there. Like your intentions, she exists before she is visible.' },
  { title: 'Tonight: New Moon', body: 'The New Moon is exact. This is the most potent moment of the month for beginning. Do not waste it.' },
  { title: 'A Lunar Invitation', body: 'The Moon invites you to begin. Not with fanfare, but with a quiet commitment in the dark.' },
  { title: 'The New Moon Arrives', body: 'The lunar cycle turns. What was waning is now ready to be reborn. What will you bring to life?' },
  { title: 'Darkness Before Creation', body: 'The New Moon reminds us: all creation begins in darkness. Your intention is the first spark.' },
  { title: 'The Moon\'s Hidden Face', body: 'Tonight the Moon shows her hidden face. In that secret moment, declare what you will build this cycle.' },
  { title: 'New Moon at {moonIllumination}', body: 'The Moon is nearly invisible at {moonIllumination} illumination. The {planetaryHour} hour is active. Seed your intentions in this quiet.' },
  { title: 'Sunrise in {sunriseIn}', body: 'The New Moon hides in the dark sky. Sunrise arrives in {sunriseIn}. Between now and then, write your intentions.' },
];

export const FULL_MOON_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: 'Full Moon Tonight', body: 'The Moon reaches fullness. What has come to light? Celebrate completion, then release what is ready to go.' },
  { title: 'The Moon Is Full', body: 'Peak illumination tonight. The Full Moon reveals what the New Moon seeded. Look at what has grown.' },
  { title: 'Lunar Apex', body: 'The Full Moon crowns the lunar cycle. Harvest insights, honor completions, and prepare for the waning arc.' },
  { title: 'Full Moon Brilliance', body: 'Tonight the Moon shines complete. Let it illuminate what you have built -- and what you are ready to surrender.' },
  { title: 'The Moon Reveals', body: 'Full Moon light hides nothing. What has come to fruition since the New Moon? What truth can no longer be denied?' },
  { title: 'Peak Lunar Light', body: 'The Moon is at her brightest. This is the moment of maximum visibility. See clearly. Act accordingly.' },
  { title: 'The Harvest Moon', body: 'What you planted two weeks ago is now visible in the full light. Harvest what is ripe. Release what is not.' },
  { title: 'Lunar Completion', body: 'The Full Moon marks completion. Not everything needs to be finished, but tonight you see what is.' },
  { title: 'The Moon at Her Fullest', body: 'Tonight the Moon refuses to hide. Neither should your achievements. Acknowledge what you have built.' },
  { title: 'A Time of Revelation', body: 'The Full Moon brings revelation. Secrets surface. Intentions manifest. Be ready for what the light shows you.' },
  { title: 'The Cycle Peaks', body: 'The lunar arc reaches its zenith. Energy is high, emotions are amplified, clarity is available. Use it well.' },
  { title: 'Tonight: Full Moon', body: 'The Moon is exact in her fullness. This is the culmination of the cycle that began in darkness. Witness it.' },
  { title: 'The Moon Mirrors You', body: 'The Full Moon reflects sunlight fully. What in your life is ready to be fully seen and fully celebrated?' },
  { title: 'Lunar Climax', body: 'The Full Moon is the climax of the lunar story. The tension that built since the New Moon releases tonight.' },
  { title: 'The Bright Moon', body: 'Tonight the Moon shines without shadow. Let her light show you what is complete -- and what is ready to be released.' },
  { title: 'Full Moon Ceremony', body: 'The Full Moon invites ceremony. Gratitude for what grew. Release for what did not. The cycle honors both.' },
];

export const SUNRISE_WAKE_UP_TEMPLATES: NotificationTemplate[] = [
  { title: 'The Sun Rises', body: 'Sunrise at {sunriseTime}. A new thread weaves into the tapestry of your journey. What intention will you carry today?' },
  { title: 'Dawn Breaks', body: 'The Sun crosses the horizon at {sunriseTime}. The planetary hour of {planetaryHour} begins. Greet the day with purpose.' },
  { title: 'First Light', body: 'Sunrise arrives at {sunriseTime}. The cosmos has been waiting for you to wake. Step into the morning with clarity.' },
  { title: 'The Day Begins', body: 'At {sunriseTime}, the Sun rises in {moonSign}. A new cycle of light begins. What will you build today?' },
  { title: 'Morning Starlight Fades', body: 'Sunrise at {sunriseTime}. The stars retreat and the Sun takes dominion. Align your first actions with the {planetaryHour} hour.' },
  { title: 'Solar Return', body: 'The Sun returns at {sunriseTime}. Each dawn is a small rebirth. What dies with the night? What is born with the day?' },
  { title: 'Horizon Fire', body: 'Sunrise at {sunriseTime}. The eastern horizon ignites. Stand in the light and set your first intention before the world rushes in.' },
  { title: 'The Threshold of Day', body: 'At {sunriseTime}, night surrenders to day. This threshold moment is yours. Breathe. Choose. Begin.' },
];

export const RETROGRADE_ALERT_TEMPLATES: NotificationTemplate[] = [
  { title: '{planet} Retrograde Approaching', body: '{planet} enters retrograde in 3 days. Time to review, revise, and reconsider {domain}.' },
  { title: '{planet} Prepares to Turn', body: 'In three days, {planet} stations retrograde. {domain} will ask for your patience and reflection.' },
  { title: 'Retrograde Warning: {planet}', body: '{planet} retrograde begins in 3 days. The cosmos invites you to slow down in {domain}.' },
  { title: '{planet} Retrograde Ahead', body: 'Three days until {planet} turns backward. A favorable time to revisit {domain} with fresh eyes.' },
  { title: '{planet} Stations Retrograde Soon', body: 'The skies signal change. {planet} will retrograde in 3 days -- tend to {domain} with care.' },
  { title: '{planet} Prepares to Retrograde', body: 'In three days, {planet} begins its backward dance. {domain} enters a season of review.' },
  { title: 'Celestial Alert: {planet}', body: '{planet} turns retrograde in 3 days. What in {domain} deserves a second look?' },
  { title: 'Three Days: {planet} Retrograde', body: 'The retrograde of {planet} approaches. {domain} will benefit from reflection over action.' },
  { title: 'The {planet} Shift', body: 'In three days, {planet} stations retrograde. The area of {domain} is about to become a classroom. Pay attention.' },
  { title: '{planet} Slows Down', body: '{planet} is preparing to retrograde. {domain} will soon require a different approach. Start adjusting now.' },
  { title: 'A Retrograde Approaches', body: '{planet} turns backward in three days. {domain} is entering a review period. What needs revision?' },
  { title: 'The {planet} Review', body: 'Three days until {planet} retrograde. {domain} is about to offer you a second chance. Will you take it?' },
  { title: '{planet} Retrograde -- Three Days', body: 'The cosmic clock ticks toward {planet} retrograde. {domain} will soon favor the editor over the author.' },
  { title: 'Station Retrograde: {planet}', body: 'In three days, {planet} stations. {domain} slows. This is not delay -- it is depth. Use it.' },
  { title: 'The {planet} Backward Glance', body: '{planet} prepares to look backward. {domain} will soon reveal what forward motion hid. Be ready.' },
  { title: 'Retrograde Season: {planet}', body: 'Three days. Then {planet} retrograde begins. {domain} becomes a maze you have already walked. Notice what you missed.' },
  { title: '{planet} Turns', body: 'The station approaches. {planet} will retrograde in three days. {domain} asks for patience, not progress.' },
  { title: 'A Cosmic Review', body: '{planet} retrograde begins in three days. {domain} is the subject of this cosmic review. What will you revise?' },
  { title: 'The {planet} Pause', body: 'In three days, {planet} pauses and turns back. {domain} will seem to stall. This is not failure -- it is fine-tuning.' },
  { title: '{planet} Retrograde Notice', body: 'Alert: {planet} stations retrograde in 72 hours. {domain} enters a period of recalibration. Prepare accordingly.' },
];

export const VOID_MOON_ENTERED_TEMPLATES: NotificationTemplate[] = [
  { title: 'Void Moon Begins', body: 'The Moon has gone void-of-course in {sign}. A {quality} void lasting ~{duration} minutes. Perfect for finishing, not starting.' },
  { title: 'Void Moon Alert', body: 'Void moon begins in {sign}. Quality: {quality}. Duration: ~{duration}m. Rest, reflect, release.' },
  { title: 'The Moon Goes Void', body: 'Void-of-course begins in {sign}. A {quality} void of ~{duration} minutes. Let the old threads finish.' },
  { title: 'Void Moon: {sign}', body: 'The Moon is now void in {sign}. {quality} energy. ~{duration} minutes of cosmic pause. Good for integration.' },
  { title: 'Cosmic Pause', body: 'Void moon entered in {sign}. A {quality} void lasting ~{duration} minutes. Complete, don\'t commence.' },
  { title: 'Lunar Lull', body: 'The Moon goes void in {sign}. {quality} quality. ~{duration} minutes of stillness before the next sign.' },
  { title: 'The Void Begins', body: 'The Moon has entered a void-of-course period in {sign}. For ~{duration} minutes, the cosmic wind drops. Float, don\'t sail.' },
  { title: 'A Void in {sign}', body: 'Void moon in {sign}. A {quality} void for ~{duration} minutes. This is cosmic halftime. Review the playbook.' },
  { title: 'The Moon Pauses', body: 'The Moon is void in {sign}. ~{duration} minutes of {quality} stillness. What can you complete before the next current?' },
  { title: 'Void-of-Course', body: 'The Moon leaves her aspects behind and enters void in {sign}. {quality} energy. ~{duration} minutes. Tidy, don\'t initiate.' },
  { title: 'The Lunar Gap', body: 'A gap opens in the lunar flow. Void in {sign}, ~{duration} minutes, {quality} character. This is space, not absence.' },
  { title: 'Moon Void in {sign}', body: 'The Moon is wandering without major aspect in {sign}. A {quality} void of ~{duration} minutes. Let things settle.' },
  { title: 'Cosmic Stillness', body: 'Void moon begins in {sign}. ~{duration} minutes of {quality} quiet. The universe takes a breath. You should too.' },
  { title: 'The Void Opens', body: 'The Moon enters void in {sign}. For ~{duration} minutes, {quality} energy prevails. Finish what is open. Close loops.' },
  { title: 'Lunar Intermission', body: 'Void moon in {sign}: a {quality} intermission of ~{duration} minutes. This is not wasted time. It is necessary space.' },
  { title: 'The Moon Rests', body: 'The Moon goes void in {sign}. A {quality} void for ~{duration} minutes. Even the sky needs downtime. So do you.' },
];

export const VOID_MOON_ENDED_TEMPLATES: NotificationTemplate[] = [
  { title: 'Void Moon Ends', body: 'The Moon enters {nextSign}. New energy is available. What will you begin?' },
  { title: 'Moon Enters {nextSign}', body: 'The void is over. The Moon has moved into {nextSign}. Fresh momentum returns.' },
  { title: 'Lunar Motion Resumes', body: 'Void complete. The Moon enters {nextSign}. Time to initiate, decide, and move forward.' },
  { title: '{nextSign} Moon Begins', body: 'The Moon leaves the void and enters {nextSign}. New threads may now be woven.' },
  { title: 'The Void Closes', body: 'Moon enters {nextSign}. The cosmic pause ends. Action is favored once more.' },
  { title: 'New Sign, New Energy', body: 'Void moon complete. Welcome to {nextSign}. What intentions will you set?' },
  { title: 'The Moon Moves On', body: 'The void-of-course ends. The Moon enters {nextSign}. The cosmic current returns. Launch what you held back.' },
  { title: 'Fresh Lunar Current', body: 'Void complete. The Moon is now in {nextSign}. New energy flows. What will you start?' },
  { title: 'The Pause Ends', body: 'The lunar void closes. {nextSign} receives the Moon. The stillness served its purpose. Now, motion.' },
  { title: '{nextSign} Receives the Moon', body: 'The void is behind us. The Moon enters {nextSign}. A new emotional landscape opens. Explore it.' },
  { title: 'The Current Returns', body: 'Void moon over. The Moon enters {nextSign}. The cosmic river flows again. Step into it.' },
  { title: 'A New Lunar Chapter', body: 'The Moon leaves the void for {nextSign}. What felt stuck may now move. Begin what you delayed.' },
  { title: 'Void Complete', body: 'The Moon\'s passage through void ends. {nextSign} offers fresh terrain. Plant new seeds now.' },
  { title: 'The Moon Enters {nextSign}', body: 'The lunar pause concludes. {nextSign} energy replaces the void. The sky says: proceed.' },
  { title: 'New Energy Available', body: 'Void moon ended. The Moon is in {nextSign}. What you could not start before, you may begin now.' },
  { title: 'The Void Passes', body: 'The Moon moves from void into {nextSign}. The cosmic breath inhales again. Move with it.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CIRCLE TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const FRIEND_REQUEST_TEMPLATES: NotificationTemplate[] = [
  { title: 'New Cosmic Connection', body: '{name} wants to join your Circle. The cosmos grows more connected.' },
  { title: 'Friend Request', body: '{name} has sent you a Cosmic Circle invite. Will you expand your constellation?' },
  { title: 'Circle Invitation', body: '{name} reaches out to connect. Your cosmic network awaits your response.' },
  { title: 'New Friend Request', body: '{name} would like to join your Circle. The stars align for new bonds.' },
  { title: 'Connection Request', body: '{name} seeks entry to your Circle. Every constellation starts with a single link.' },
  { title: 'A New Star Joins', body: '{name} wishes to enter your Circle. New stars bring new light. Will you welcome them?' },
  { title: 'Circle Request: {name}', body: '{name} wants to walk with you in the Circle. Connection is the oldest form of magic.' },
  { title: '{name} Reaches Out', body: 'A hand extends from {name}. Your Circle can grow or stay the same. Both are valid choices.' },
  { title: 'A Cosmic Link Forms', body: '{name} wants to link their orbit to yours. The Circle grows one soul at a time.' },
  { title: 'Friend Request: {name}', body: '{name} sees something in you worth orbiting near. Your Circle awaits your decision.' },
  { title: 'The Circle Expands', body: '{name} wants to join your Circle. Every addition changes the geometry. Is this the right shape?' },
  { title: 'Connection: {name}', body: '{name} requests entry to your Circle. Some connections are brief. Some are eternal. You choose.' },
  { title: 'A Request From {name}', body: '{name} wants to be part of your cosmic network. The Circle is a living thing. Nurture it.' },
  { title: '{name} Wants to Connect', body: 'The cosmos brings {name} to your doorstep. Will you open the Circle door?' },
  { title: 'Circle Growth', body: '{name} seeks connection. Your Circle can be a fortress or a garden. What grows here is up to you.' },
  { title: 'New Connection: {name}', body: '{name} wants to join your Circle. Not every star belongs in every constellation. Choose wisely.' },
];

export const TASK_ASSIGNED_TEMPLATES: NotificationTemplate[] = [
  { title: 'New Task Ritual', body: '{name} assigned you: "{task}". The Circle moves together.' },
  { title: 'Task from {name}', body: '"{task}" -- assigned by {name}. Your Circle trusts you with this intention.' },
  { title: 'Cosmic Task', body: '{name} has shared an intention: "{task}". Will you carry it forward?' },
  { title: 'New Assignment', body: '"{task}" from {name}. The Circle weaves its shared work.' },
  { title: 'Task Ritual Assigned', body: '{name} entrusted you with "{task}". The cosmos honors those who keep their commitments.' },
  { title: 'An Intention Shared', body: '{name} places "{task}" in your hands. The Circle is built on trust. Carry it well.' },
  { title: 'Circle Task: {name}', body: '"{task}" -- this is what {name} needs from you. The Circle functions when everyone plays their part.' },
  { title: '{name} Assigns You', body: '{name} believes you are the right person for "{task}". The Circle recognizes your strengths.' },
  { title: 'A Shared Intention', body: '"{task}" arrives from {name}. In the Circle, one person\'s need becomes another\'s purpose.' },
  { title: 'Task From the Circle', body: '{name} assigns: "{task}". The Circle does not demand -- it invites. Will you accept?' },
  { title: 'New Responsibility', body: '"{task}" from {name}. The Circle grows stronger when intentions are shared and honored.' },
  { title: '{name} Needs You', body: '{name} has asked you to hold "{task}". The Circle is a web of mutual support.' },
  { title: 'An Assignment Arrives', body: '"{task}" -- {name} places this in your orbit. The Circle trusts you. Trust yourself.' },
  { title: 'The Circle Calls', body: '{name} assigns "{task}" to you. Every task in the Circle is a thread in a larger tapestry.' },
  { title: 'A Task Ritual', body: '"{task}" from {name}. The Circle does not work by obligation. It works by shared intention.' },
  { title: '{name} Shares Work', body: '{name} invites you into "{task}". The Circle is strongest when labor is shared.' },
];

export const MESSAGE_RECEIVED_TEMPLATES: NotificationTemplate[] = [
  { title: 'Message from {name}', body: '{name} sent you a message in the Circle.' },
  { title: 'New Message: {name}', body: 'A whisper from {name} awaits in your Cosmic Circle.' },
  { title: '{name}', body: 'You have a new message from {name}.' },
  { title: 'Circle Message', body: '{name} reached out. Your conversation continues.' },
  { title: 'A Whisper From {name}', body: '{name} has something to say in the Circle. Listen.' },
  { title: 'Message: {name}', body: 'The Circle carries a message from {name}. Words are energy. Receive them.' },
  { title: '{name} Writes', body: 'A new message from {name} in your Circle. Communication is the heartbeat of community.' },
  { title: 'Circle Communication', body: '{name} sent you a message. The Circle stays alive through exchange.' },
  { title: 'A Message Arrives', body: 'From {name}, a message in the Circle. Some messages are small. All are significant.' },
  { title: '{name} Reaches Out', body: '{name} has written to you in the Circle. What will you say back?' },
  { title: 'New Words From {name}', body: 'A message from {name} waits in your Circle. Every exchange is a ritual.' },
  { title: 'The Circle Speaks', body: '{name} sends a message. The Circle is not silent -- it speaks through its members.' },
];

export const TASK_DUE_SOON_TEMPLATES: NotificationTemplate[] = [
  { title: 'Task Due Soon', body: '"{task}" is due {time}. The Circle is watching.' },
  { title: 'Approaching Deadline', body: '"{task}" needs your attention -- due {time}.' },
  { title: 'Time Remains', body: '"{task}" is due {time}. One step closer to completion.' },
  { title: 'Task Nearing Due', body: 'The hour approaches for "{task}". Due {time}.' },
  { title: 'Circle Reminder', body: '"{task}" -- due {time}. Your Circle honors your follow-through.' },
  { title: 'Deadline Alert', body: '"{task}" is due {time}. The cosmos rewards completion.' },
  { title: 'The Clock Turns', body: '"{task}" approaches its deadline: {time}. The Circle trusts you to meet it.' },
  { title: 'A Commitment Calls', body: '"{task}" is due {time}. Commitments to the Circle are commitments to yourself.' },
  { title: 'Time Grows Short', body: '"{task}" -- deadline {time}. The Circle does not judge delay. It simply reminds.' },
  { title: 'A Due Date Approaches', body: '"{task}" is due {time}. The Circle functions on shared reliability.' },
  { title: 'The Hour Nears', body: '"{task}" reaches its deadline at {time}. One focused effort can close this loop.' },
  { title: 'Circle Deadline', body: '"{task}" -- due {time}. Your Circle awaits your completion with patience, not pressure.' },
  { title: 'A Task Calls', body: '"{task}" is due {time}. The Circle moves forward when its members honor their word.' },
  { title: 'The Deadline Waits', body: '"{task}" at {time}. Deadlines are not enemies. They are the shape time takes when we give it purpose.' },
  { title: 'Time Reminder', body: '"{task}" is due {time}. The Circle does not hurry you. It simply holds the clock where you can see it.' },
  { title: 'A Commitment Nears', body: '"{task}" -- {time}. The Circle remembers what you promised. So do you.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNAL TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const TRACKER_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: 'Cycle Reminder', body: 'Your cycle is forecast to begin {when}. How is your body feeling today?' },
  { title: 'Mood Check', body: 'The stars haven\'t heard from you in {days} days. A quick mood check?' },
  { title: 'Sleep Log', body: 'Your sleep patterns are a mystery. Log last night\'s rest?' },
  { title: 'Energy Check', body: 'Energy tracking builds awareness. 30 seconds to log?' },
  { title: 'Medication Reminder', body: 'Your medication reminder -- the cosmos supports consistency.' },
  { title: 'Tracker Nudge', body: 'Your {trackerType} tracker misses you. One entry today?' },
  { title: 'Body Awareness', body: 'Your {trackerType} data helps the Oracle guide you. Log an entry?' },
  { title: 'Daily Tracker Prompt', body: 'The HEKA journal invites you to log your {trackerType}. Small inputs, deep insights.' },
  { title: 'A Body Check-In', body: 'Your {trackerType} tracker waits for data. The body speaks in patterns. Are you listening?' },
  { title: 'Track Your {trackerType}', body: 'One entry for {trackerType} today. The Oracle learns from consistency. So do you.' },
  { title: 'Body Data Missing', body: 'Your {trackerType} log is empty. The journal cannot reflect what it does not record.' },
  { title: 'A Gentle Nudge', body: 'The {trackerType} tracker has not seen you in a while. Thirty seconds of logging, years of insight.' },
  { title: 'The Body Remembers', body: 'Your {trackerType} data tells a story. But only if you write it. Log today\'s entry?' },
  { title: 'Tracker Reminder', body: 'Time to log {trackerType}. The Oracle uses this data to craft guidance that is yours alone.' },
  { title: 'A Pattern Awaits', body: 'Your {trackerType} tracker builds patterns over time. One more entry brings the picture closer.' },
  { title: 'Body Wisdom', body: 'The {trackerType} tracker is not just data collection. It is a conversation with your body. Continue it?' },
  { title: 'The Oracle Asks', body: 'The Oracle needs {trackerType} data to serve you better. One entry today sharpens tomorrow\'s guidance.' },
  { title: 'A Small Ritual', body: 'Logging {trackerType} takes less than a minute. The insight it generates lasts a lifetime.' },
  { title: 'Your Body Speaks', body: 'The {trackerType} tracker is where your body speaks to the Oracle. Give it a voice today.' },
  { title: 'Data for Insight', body: 'Your {trackerType} entry is missing. The Oracle\'s guidance improves with every data point you offer.' },
];

export const DAILY_REFLECTION_PROMPT_TEMPLATES: NotificationTemplate[] = [
  { title: 'Evening Reflection', body: 'The day is waning. What moved you? What will you carry forward? Open your journal.' },
  { title: 'Daily Review', body: 'Before the stars shift, pause. What did today teach you? Your journal awaits.' },
  { title: 'Reflect & Release', body: 'Evening approaches. What deserves gratitude? What deserves release? Write it down.' },
  { title: 'Journal Prompt', body: 'The cosmos invites reflection. One sentence about today -- that\'s all it takes.' },
  { title: 'Close the Arc', body: 'Today\'s arc nears its end. How will you summarize this chapter? Your journal is open.' },
  { title: 'The Day Fades', body: 'As the light leaves the sky, let your thoughts settle onto the page. What was today about?' },
  { title: 'An Evening Question', body: 'If today were a chapter in your life story, what would its title be? The journal wants to know.' },
  { title: 'The Sun Sets', body: 'The Sun descends. Before it rises again, give today its final word. Your journal listens.' },
  { title: 'A Moment of Stillness', body: 'The day has spoken. Now it is your turn. What will you say back? The journal is your witness.' },
  { title: 'The Arc Completes', body: 'Today\'s arc is almost complete. One reflection, one sentence, one truth. That is enough.' },
  { title: 'Evening Invitation', body: 'The stars emerge. Before they do, pause. The journal offers a space for everything the day held.' },
  { title: 'What Moved You?', body: 'This day will not return. Before it goes, capture what mattered. Your journal holds the memory.' },
  { title: 'The Day\'s Echo', body: 'Evening is when the day\'s echo is loudest. Write it down before it fades. Your journal is ready.' },
  { title: 'A Closing Ritual', body: 'Close the day with intention. One reflection in the journal. This is how arcs become stories.' },
  { title: 'The Journal Waits', body: 'Your Oracle Journal waits in the quiet. What will you tell it about today?' },
  { title: 'Twilight Thoughts', body: 'In the space between day and night, clarity often arrives. Catch it in your journal.' },
  { title: 'An Evening Prompt', body: 'If you could thank one thing about today, what would it be? The journal receives your answer.' },
  { title: 'The Day\'s Gift', body: 'Every day gives something. Every day takes something. Name both in your journal before sleep.' },
  { title: 'Closing the Loop', body: 'The day opened with possibility. Close it with reflection. Your journal completes the circle.' },
  { title: 'A Quiet Moment', body: 'The world grows quiet. Your journal grows patient. Meet in the middle. Reflect.' },
];

export const CELESTIAL_INSIGHT_ALERT_TEMPLATES: NotificationTemplate[] = [
  { title: 'Notable Transit', body: '{transit}. This alignment may inspire a journal entry.' },
  { title: 'Celestial Moment', body: '{transit}. The skies speak -- your journal can listen.' },
  { title: 'Transit Alert', body: '{transit}. A good time to capture your thoughts in the Oracle Journal.' },
  { title: 'Cosmic Signal', body: '{transit}. The Oracle suggests this is worth recording.' },
  { title: 'A Sky Story', body: '{transit}. The heavens are writing a story that includes you. The journal is where you write back.' },
  { title: 'The Planets Align', body: '{transit}. When the sky shifts, the inner world follows. Record what you feel.' },
  { title: 'A Celestial Whisper', body: '{transit}. This transit speaks to something in your chart. The journal helps you hear it.' },
  { title: 'The Oracle Notes', body: '{transit}. The Oracle has identified this as a significant alignment. Your journal should know too.' },
  { title: 'A Moment in the Sky', body: '{transit}. Transits are promises written in light. Your journal captures what they deliver.' },
  { title: 'Celestial Intelligence', body: '{transit}. The Oracle watches the sky so you can watch within. Write what you find.' },
  { title: 'The Sky Changes', body: '{transit}. Something in the heavens has shifted. Something in you may be shifting too. Note it.' },
  { title: 'Transit Notification', body: '{transit}. This is not just astrology. It is a moment when the outer world mirrors the inner. Record it.' },
  { title: 'A Cosmic Mirror', body: '{transit}. The planets do not cause -- they reflect. What does this reflection show you? The journal waits.' },
  { title: 'The Oracle Observes', body: '{transit}. The Oracle has flagged this transit as significant for your chart. Explore it in your journal.' },
  { title: 'A Sky Event', body: '{transit}. The celestial mechanics are precise. Your inner mechanics may be responding. Write it down.' },
  { title: 'Celestial Correspondence', body: '{transit}. As above, so below. The journal is where you prove the correspondence.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PLANNER TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const DAILY_BRIEFING_TEMPLATES: NotificationTemplate[] = [
  { title: 'Your Celestial Briefing', body: '{opener} {task} The Moon is {moonPhase} in {moonSign}. You have {pendingCount} intention{plural} awaiting you.' },
  { title: 'Celestial Briefing', body: '{opener} {task} Lunar phase: {moonPhase}. {pendingCount} intention{plural} on your path today.' },
  { title: 'Morning Starlight', body: '{opener} {task} The Moon moves through {moonSign}, {moonPhase}. {pendingCount} intention{plural} await.' },
  { title: 'Your Daily Arc', body: '{opener} {task} {moonPhase} moon in {moonSign}. {pendingCount} intention{plural} shape today.' },
  { title: 'Celestial Briefing', body: '{opener} {task} Moon: {moonPhase} in {moonSign}. Intentions: {pendingCount}.' },
  { title: 'Good Morning, Stargazer', body: '{opener} {task} The {moonPhase} moon in {moonSign} guides your {pendingCount} intention{plural}.' },
  { title: 'Today\'s Cosmic Weather', body: '{opener} {task} {moonPhase} in {moonSign}. {pendingCount} intention{plural} on the docket.' },
  { title: 'Celestial Briefing', body: '{opener} {task} Moon phase: {moonPhase}. Sign: {moonSign}. Pending: {pendingCount}.' },
  { title: 'Morning Guidance', body: '{opener} {task} The Moon is {moonPhase} in {moonSign}. {pendingCount} intention{plural} call to you.' },
  { title: 'Your Starlight Briefing', body: '{opener} {task} {moonPhase} moon energy in {moonSign}. {pendingCount} intention{plural} today.' },
  { title: 'The Day Opens', body: '{opener} {task} A {moonPhase} moon in {moonSign} greets you. {pendingCount} intention{plural} shape the hours ahead.' },
  { title: 'Morning Arc', body: '{opener} {task} The Moon moves through {moonSign} in {moonPhase} phase. {pendingCount} intention{plural} await your attention.' },
  { title: 'Celestial Start', body: '{opener} {task} {moonPhase} lunar light in {moonSign}. {pendingCount} intention{plural} on your path today.' },
  { title: 'The Day\'s Pattern', body: '{opener} {task} Moon: {moonPhase} in {moonSign}. {pendingCount} intention{plural} form today\'s constellation.' },
  { title: 'Arc Begins', body: '{opener} {task} A {moonPhase} moon watches from {moonSign}. {pendingCount} intention{plural} stand ready.' },
  { title: 'Starlight Morning', body: '{opener} {task} The {moonPhase} moon in {moonSign} sets the tone. {pendingCount} intention{plural} respond to this light.' },
  { title: 'The Celestial Opening', body: '{opener} {task} {moonPhase} phase, {moonSign} sign. {pendingCount} intention{plural} on today\'s docket.' },
  { title: 'Morning Constellation', body: '{opener} {task} Moon in {moonSign}, {moonPhase}. {pendingCount} intention{plural} form your daily pattern.' },
  { title: 'The Day\'s Briefing', body: '{opener} {task} Lunar status: {moonPhase} in {moonSign}. {pendingCount} intention{plural} await completion.' },
  { title: 'Cosmic Morning', body: '{opener} {task} The Moon is {moonPhase} in {moonSign} today. {pendingCount} intention{plural} are your practice ground.' },
  { title: 'Your Daily Briefing', body: '{opener} {task} A {moonPhase} moon moves through {moonSign}. {pendingCount} intention{plural} shape the arc.' },
  { title: 'The Morning Opens', body: '{opener} {task} {moonPhase} lunar energy in {moonSign}. {pendingCount} intention{plural} form today\'s work.' },
  { title: 'Starlight Briefing', body: '{opener} {task} Moon phase: {moonPhase}. Location: {moonSign}. Intentions: {pendingCount}.' },
  { title: 'The Day Awaits', body: '{opener} {task} The {moonPhase} moon in {moonSign} illuminates {pendingCount} intention{plural} for today.' },
  { title: 'Sunrise in {sunriseIn}', body: '{opener} {task} The Sun returns in {sunriseIn}. Until then, the {moonPhase} moon in {moonSign} holds the sky. {pendingCount} intention{plural} await.' },
  { title: 'The {planetaryHour} Hour', body: '{opener} {task} The {planetaryHour} hour is active. The {moonPhase} moon moves through {moonSign}. {pendingCount} intention{plural} align with this energy.' },
];

export const STREAK_SAVER_TEMPLATES: NotificationTemplate[] = [
  { title: 'The Cosmos Still Believes in You', body: '{opener} {microTask}' },
  { title: 'Your Flame Flickers', body: '{opener} {microTask}' },
  { title: 'One Ember Remains', body: '{opener} {microTask}' },
  { title: 'The Stars Forgive Rest', body: '{opener} {microTask}' },
  { title: 'Your Path Is Not Erased', body: '{opener} {microTask}' },
  { title: 'A Small Step Returns', body: '{opener} {microTask}' },
  { title: 'The Fire Can Rekindle', body: '{opener} {microTask}' },
  { title: 'You Are Not Behind', body: '{opener} {microTask}' },
  { title: 'The Cosmos Waits', body: '{opener} {microTask}' },
  { title: 'One Breath, One Step', body: '{opener} {microTask}' },
  { title: 'The Path Remembers', body: '{opener} {microTask}' },
  { title: 'A Gentle Return', body: '{opener} {microTask}' },
  { title: 'The Stars Hold Your Place', body: '{opener} {microTask}' },
  { title: 'Not Lost, Only Paused', body: '{opener} {microTask}' },
  { title: 'The Arc Continues', body: '{opener} {microTask}' },
  { title: 'A Small Ritual Awaits', body: '{opener} {microTask}' },
];

export const STREAK_PROTECTION_TEMPLATES: NotificationTemplate[] = [
  { title: 'Your flame is dying', body: 'Your {streak}-day flame dims in the final hour. One small act keeps it alive.' },
  { title: 'Streak in danger', body: 'Your {streak}-day streak is flickering. The cosmos has seen you come this far.' },
  { title: 'Tend to your streak', body: 'Your {streak}-day flame still burns, but it would like to be fed.' },
  { title: 'Critical', body: 'The sands are running out. Your {streak}-day streak needs you now.' },
  { title: 'High Alert', body: 'You usually move by now. Your {streak}-day flame grows impatient.' },
  { title: 'Medium Alert', body: 'The day is waning and your {streak}-day streak watches quietly.' },
  { title: 'The Flame Waits', body: 'Your {streak}-day streak stands at the edge. One action pulls it back. Silence lets it fall.' },
  { title: 'A Streak Needs You', body: '{streak} days of consistency. Do not let today be the exception. One small act preserves the chain.' },
  { title: 'The Countdown', body: 'Your {streak}-day streak is in its final hours. The cosmos does not judge, but it does notice. Act.' },
  { title: 'The Edge', body: 'You stand at the edge of {streak} days. Step forward and the streak continues. Step back and it resets. Choose.' },
  { title: 'The Hour Grows Late', body: 'Your {streak}-day flame has burned all day. Do not let it go out in darkness. One spark saves it.' },
  { title: 'A Chain of Days', body: '{streak} days linked together. Today is the weakest link. Strengthen it with one action.' },
  { title: 'The Final Call', body: 'Your {streak}-day streak makes its final appeal. The cosmos whispers: one more step. Just one.' },
  { title: 'The Flame Dances', body: 'Your {streak}-day flame dances at the edge of extinction. Feed it. One small ritual is enough fuel.' },
  { title: 'Do Not Let Go', body: '{streak} days. That is not luck. That is commitment. Do not let today break what you built.' },
  { title: 'The Streak Speaks', body: 'Your {streak}-day streak has one last thing to say: I am still here. Will you still be here for me?' },
];

export const COMPLETION_CELEBRATION_TEMPLATES: NotificationTemplate[] = [
  { title: 'Intention Fulfilled', body: '{celebration} {streakText}' },
  { title: 'Well Done', body: '{celebration} {streakText}' },
  { title: 'Task Complete', body: '{celebration} {streakText}' },
  { title: 'Achievement', body: '{celebration} {streakText}' },
  { title: 'Complete', body: '{celebration} {streakText}' },
  { title: 'The Cosmos Notices', body: '{celebration} {streakText}' },
  { title: 'A Step Taken', body: '{celebration} {streakText}' },
  { title: 'The Arc Advances', body: '{celebration} {streakText}' },
  { title: 'Done', body: '{celebration} {streakText}' },
  { title: 'The Wheel Turns', body: '{celebration} {streakText}' },
  { title: 'Honored', body: '{celebration} {streakText}' },
  { title: 'Completion', body: '{celebration} {streakText}' },
  { title: 'The Flame Grows', body: '{celebration} {streakText}' },
  { title: 'A Moment of Victory', body: '{celebration} {streakText}' },
  { title: 'The Stars Applaud', body: '{celebration} {streakText}' },
  { title: 'Carried Through', body: '{celebration} {streakText}' },
];

export const COMPLEMENTARY_TASK_TEMPLATES: NotificationTemplate[] = [
  { title: 'Deepen the Practice', body: 'You completed "{task}". {suggestion}' },
  { title: 'Next Step', body: '"{task}" is done. {suggestion}' },
  { title: 'Continue the Flow', body: 'After "{task}": {suggestion}' },
  { title: 'The Thread Continues', body: '"{task}" is complete. The natural next move: {suggestion}' },
  { title: 'A Natural Progression', body: 'You finished "{task}". Consider this: {suggestion}' },
  { title: 'The Arc Extends', body: '"{task}" closes one door. {suggestion} opens the next.' },
  { title: 'Momentum', body: '"{task}" is behind you. Keep the energy flowing: {suggestion}' },
  { title: 'The Next Beat', body: 'Completion of "{task}" creates space. Fill it wisely: {suggestion}' },
  { title: 'A Suggestion', body: '"{task}" -- done. The Oracle suggests: {suggestion}' },
  { title: 'The Practice Deepens', body: 'You completed "{task}". The next level awaits: {suggestion}' },
  { title: 'Follow the Thread', body: '"{task}" is finished. The thread continues here: {suggestion}' },
  { title: 'Natural Next Step', body: 'After "{task}", the most natural move is: {suggestion}' },
];

export const TASK_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: 'HEKA Intention', body: '{prefix} "{task}" -- in {minutes} minute{plural}.' },
  { title: 'Intention Approaches', body: '{prefix} "{task}" -- {minutes} minutes remain.' },
  { title: 'The Hour Approaches', body: '{prefix} "{task}" arrives in {minutes} minute{plural}.' },
  { title: 'HEKA Reminder', body: '"{task}" -- {minutes} minute{plural} away. {prefix}' },
  { title: 'Time Draws Near', body: '{prefix} "{task}" begins in {minutes} minute{plural}. Prepare yourself.' },
  { title: 'The Moment Approaches', body: '{prefix} "{task}" is {minutes} minutes away. The HEKA calendar keeps perfect time.' },
  { title: 'An Intention Nears', body: '{prefix} Your intention "{task}" activates in {minutes} minute{plural}.' },
  { title: 'The Clock Moves', body: '{prefix} "{task}" -- {minutes} minute{plural} remaining. The cosmos does not hurry, but it does keep count.' },
  { title: 'A Task Approaches', body: '{prefix} "{task}" arrives in {minutes} minute{plural}. The HEKA system reminds with precision.' },
  { title: 'The Time Comes', body: '{prefix} "{task}" is {minutes} minutes from now. Ready yourself.' },
  { title: 'Approaching: {task}', body: '{prefix} {minutes} minute{plural} until "{task}". The HEKA calendar holds this moment for you.' },
  { title: 'The Hour Nears', body: '{prefix} "{task}" -- only {minutes} minute{plural} away. The cosmos keeps perfect time.' },
  { title: 'Prepare', body: '{prefix} "{task}" begins in {minutes} minute{plural}. The HEKA system ensures you do not miss your own intentions.' },
  { title: 'A Reminder', body: '{prefix} "{task}" is {minutes} minute{plural} from now. The calendar honors what you planned.' },
  { title: 'The Moment Waits', body: '{prefix} "{task}" arrives in {minutes} minute{plural}. Time is not an enemy. It is an appointment.' },
  { title: 'Time Calls', body: '{prefix} "{task}" -- {minutes} minute{plural} away. The HEKA calendar ensures you hear the call.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE LIBRARY REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

export const TEMPLATE_LIBRARY: Record<string, NotificationTemplate[]> = {
  'holiday-reminder': HOLIDAY_REMINDER_TEMPLATES,
  'civil-heka-transition': CIVIL_HEKA_TRANSITION_TEMPLATES,
  'moon-degree-update': MOON_DEGREE_TEMPLATES,
  'note-reminder': NOTE_REMINDER_TEMPLATES,
  'daily-celestial-tips': DAILY_CELESTIAL_TIPS_TEMPLATES,
  'retrograde-alert': RETROGRADE_ALERT_TEMPLATES,
  'void-moon-entered': VOID_MOON_ENTERED_TEMPLATES,
  'void-moon-ended': VOID_MOON_ENDED_TEMPLATES,
  'friend-request': FRIEND_REQUEST_TEMPLATES,
  'task-assigned': TASK_ASSIGNED_TEMPLATES,
  'message-received': MESSAGE_RECEIVED_TEMPLATES,
  'task-due-soon': TASK_DUE_SOON_TEMPLATES,
  'tracker-reminder': TRACKER_REMINDER_TEMPLATES,
  'daily-reflection-prompt': DAILY_REFLECTION_PROMPT_TEMPLATES,
  'celestial-insight-alert': CELESTIAL_INSIGHT_ALERT_TEMPLATES,
  'daily-briefing': DAILY_BRIEFING_TEMPLATES,
  'new-year-reminder': NEW_YEAR_REMINDER_TEMPLATES,
  'solstice-equinox-reminder': SOLSTICE_EQUINOX_REMINDER_TEMPLATES,
  'month-start-reminder': MONTH_START_REMINDER_TEMPLATES,
  'new-moon-reminder': NEW_MOON_REMINDER_TEMPLATES,
  'full-moon-reminder': FULL_MOON_REMINDER_TEMPLATES,
  'sunrise-wake-up': SUNRISE_WAKE_UP_TEMPLATES,
  'streak-saver': STREAK_SAVER_TEMPLATES,
  'streak-protection': STREAK_PROTECTION_TEMPLATES,
  'completion-celebration': COMPLETION_CELEBRATION_TEMPLATES,
  'complementary-task': COMPLEMENTARY_TASK_TEMPLATES,
  'task-reminder': TASK_REMINDER_TEMPLATES,
};

/**
 * Get templates for a notification type
 */
export function getTemplates(type: string): NotificationTemplate[] {
  return TEMPLATE_LIBRARY[type] || [{ title: 'HEKA Calendar', body: 'You have a new notification.' }];
}

/**
 * Generate notification content from templates
 */
export function generateNotificationContent(
  type: string,
  seed: string,
  vars: Record<string, string> = {}
): { title: string; body: string; templateIndex: number } {
  const templates = getTemplates(type);
  const templateIndex = Math.floor(seededRandom(seed) * templates.length);
  const template = templates[templateIndex];
  const { title, body } = formatTemplate(template, vars);
  return { title, body, templateIndex };
}
