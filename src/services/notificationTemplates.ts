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
  { title: '🎉 {holidayName} Tomorrow', body: 'A day of significance approaches. {holidayName} falls on the civil calendar tomorrow — how will you honor it in the HEKA?' },
  { title: 'Tomorrow: {holidayName}', body: 'The civil world pauses for {holidayName}. Your HEKA calendar notes the rhythm too. Plan with intention.' },
  { title: 'A Holiday Approaches', body: '{holidayName} arrives tomorrow. Whether you celebrate or simply observe, let the day hold meaning.' },
  { title: '🌟 {holidayName} is Near', body: 'The calendar turns toward {holidayName}. The HEKA and civil cycles align in recognition.' },
  { title: 'Holiday Reminder', body: 'Tomorrow marks {holidayName}. A gentle nudge from your HEKA calendar.' },
  { title: '{holidayName} — One Day Away', body: 'The civil calendar calls it {holidayName}. Your HEKA calendar simply says: prepare with presence.' },
  { title: 'Upcoming: {holidayName}', body: '{holidayName} arrives tomorrow. Take a moment to consider how the day serves your arc.' },
  { title: 'A Notable Day Ahead', body: '{holidayName} tomorrow. The HEKA calendar tracks all rhythms, civil and celestial.' },
];

export const CIVIL_HEKA_TRANSITION_TEMPLATES: NotificationTemplate[] = [
  // 7 days before HEKA month end
  { title: '⏳ {hekaMonth} Enters Its Final Week', body: 'The month of {hekaMonth} is entering its closing arc. Time to wrap what you started.' },
  { title: '{hekaMonth} Wanes', body: 'Seven days remain in {hekaMonth}. What threads need tying before the next arc begins?' },
  // 3 days before
  { title: '🌙 {hekaMonth}\'s Closing Arc Begins', body: 'Three days left in {hekaMonth}. The civil world still calls it {civilMonth} — but your HEKA month is almost complete.' },
  { title: 'The End of {hekaMonth} Nears', body: 'In three days, a new HEKA month begins. The civil calendar does not mark this transition. You do.' },
  // 1 day before
  { title: 'Tomorrow: A New HEKA Month', body: '{nextMonth} begins tomorrow. The civil calendar won\'t tell you — but we will. Ready?' },
  { title: 'Final Day of {hekaMonth}', body: 'Today is the last full day of {hekaMonth}. Reflect. Release. Prepare for {nextMonth}.' },
  // Day 1 of new month
  { title: '✨ Welcome to {nextMonth}', body: 'A new HEKA month begins. The {arcName} arc continues. What will this chapter hold?' },
  { title: '{nextMonth} Has Arrived', body: 'The HEKA wheel turns. Welcome to {nextMonth}. The {arcName} arc deepens.' },
  // Civil month change (special case)
  { title: 'Civil {civilMonth} Has Arrived', body: 'Civil {civilMonth} begins, but you are already deep in HEKA {hekaMonth}. You are ahead of the civil game.' },
  { title: 'Two Calendars, One You', body: 'The civil world enters {civilMonth}. Your HEKA journey is already well into {hekaMonth}. Move with that advantage.' },
];

export const MOON_DEGREE_TEMPLATES: NotificationTemplate[] = [
  { title: '🌙 Moon at {degree}° {sign}', body: 'The Moon enters {degree}° of {sign}. {meaning}' },
  { title: 'Lunar Shift: {degree}° {sign}', body: 'The Moon has moved to {degree}° {sign}. {meaning}' },
  { title: 'Moon Degree Update', body: 'Currently at {degree}° {sign}. {meaning}' },
  { title: '☽ {degree}° {sign}', body: 'The Moon travels through {degree}° of {sign}. {meaning}' },
  { title: 'Lunar Position: {degree}° {sign}', body: '{meaning} The Moon is now at {degree}° {sign}.' },
  { title: '🌕 Moon Degree Alert', body: 'The Moon reaches {degree}° in {sign}. {meaning}' },
  { title: 'Celestial Minute: {degree}° {sign}', body: 'The Moon sits at {degree}° {sign}. {meaning}' },
  { title: 'Moon Watch: {degree}° {sign}', body: 'Lunar update: {degree}° {sign}. {meaning}' },
  { title: '☽ Lunar Movement', body: 'The Moon has shifted to {degree}° {sign}. {meaning}' },
  { title: 'Moon at {degree}° {sign}', body: '{meaning} The lunar degree is now {degree}° {sign}.' },
];

export const NOTE_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: '📝 HEKA Notes Today', body: 'You have {count} note{plural} waiting for you today. The calendar remembers so you don\'t have to.' },
  { title: 'Your Day Awaits', body: '{count} calendar note{plural} recorded for today. Step into the day prepared.' },
  { title: 'Notes for Today', body: '{count} note{plural} on your HEKA calendar. A small reminder from your past self.' },
  { title: '📜 HEKA Reminder', body: 'Today holds {count} note{plural}. Your calendar has been keeping track.' },
  { title: 'A Day With Intent', body: '{count} note{plural} shape today\'s arc. The HEKA calendar guides your rhythm.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// STARS TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const DAILY_CELESTIAL_TIPS_TEMPLATES: NotificationTemplate[] = [
  { title: '🌕 Moon Waxing Bright', body: 'The Moon waxes toward fullness. What are you ready to bring to light?' },
  { title: '☿ Mercury in Motion', body: 'Mercury moves swiftly today. Trust your quick insights and speak your truth.' },
  { title: '♀ Venus Calls', body: 'Venus smiles on connections. Reach out to someone you care about.' },
  { title: '♂ Mars Ignites', body: 'Mars energizes your actions. Channel passion into constructive outlets.' },
  { title: '♃ Jupiter Opens Doors', body: 'Jupiter expands possibilities. Say yes to an opportunity that scares you.' },
  { title: '♄ Saturn Steadies', body: 'Saturn rewards discipline. What structure do you need to build today?' },
  { title: '☽ Void Moon Pause', body: 'The Void Moon invites rest. Pause before initiating something new.' },
  { title: '🔄 Retrograde Season', body: 'A planet retrogrades soon. What area of life needs review and refinement?' },
  { title: '✨ Ruling Planet Bright', body: 'Your ruling planet shines bright. Your natural gifts are amplified today.' },
  { title: '☉ Sunlit Path', body: 'The Sun illuminates your path. Step forward with confidence and clarity.' },
  { title: '🌙 Lunar Release', body: 'Lunar energy supports release. What can you let go of to create space?' },
  { title: '🎨 Cosmic Creativity', body: 'Cosmic alignment favors creativity. Express yourself authentically today.' },
  { title: '☊ North Node Nudge', body: 'The North Node whispers of destiny. One small step toward your purpose today.' },
  { title: '♇ Pluto Surfaces', body: 'Pluto\'s deep current stirs. What truth wants to surface?' },
  { title: '♆ Neptune Dreams', body: 'Neptune dissolves boundaries. Dream, imagine, but keep one foot on solid ground.' },
];

export const RETROGRADE_ALERT_TEMPLATES: NotificationTemplate[] = [
  { title: '⚠️ {planet} Retrograde Approaching', body: '{planet} enters retrograde in 3 days. Time to review, revise, and reconsider {domain}.' },
  { title: '🔄 {planet} Prepares to Turn', body: 'In three days, {planet} stations retrograde. {domain} will ask for your patience and reflection.' },
  { title: 'Retrograde Warning: {planet}', body: '{planet} retrograde begins in 3 days. The cosmos invites you to slow down in {domain}.' },
  { title: '⏪ {planet} Retrograde Ahead', body: 'Three days until {planet} turns backward. A favorable time to revisit {domain} with fresh eyes.' },
  { title: '{planet} Stations Retrograde Soon', body: 'The skies signal change. {planet} will retrograde in 3 days — tend to {domain} with care.' },
  { title: '🌌 {planet} Prepares to Retrograde', body: 'In three days, {planet} begins its backward dance. {domain} enters a season of review.' },
  { title: 'Celestial Alert: {planet}', body: '{planet} turns retrograde in 3 days. What in {domain} deserves a second look?' },
  { title: 'Three Days: {planet} Retrograde', body: 'The retrograde of {planet} approaches. {domain} will benefit from reflection over action.' },
];

export const VOID_MOON_ENTERED_TEMPLATES: NotificationTemplate[] = [
  { title: '🌑 Void Moon Begins', body: 'The Moon has gone void-of-course in {sign}. A {quality} void lasting ~{duration} minutes. Perfect for finishing, not starting.' },
  { title: '☽ Void Moon Alert', body: 'Void moon begins in {sign}. Quality: {quality}. Duration: ~{duration}m. Rest, reflect, release.' },
  { title: '🌙 The Moon Goes Void', body: 'Void-of-course begins in {sign}. A {quality} void of ~{duration} minutes. Let the old threads finish.' },
  { title: 'Void Moon: {sign}', body: 'The Moon is now void in {sign}. {quality} energy. ~{duration} minutes of cosmic pause. Good for integration.' },
  { title: '⏸️ Cosmic Pause', body: 'Void moon entered in {sign}. A {quality} void lasting ~{duration} minutes. Complete, don\'t commence.' },
  { title: '🌑 Lunar Lull', body: 'The Moon goes void in {sign}. {quality} quality. ~{duration} minutes of stillness before the next sign.' },
];

export const VOID_MOON_ENDED_TEMPLATES: NotificationTemplate[] = [
  { title: '✨ Void Moon Ends', body: 'The Moon enters {nextSign}. New energy is available. What will you begin?' },
  { title: '🌙 Moon Enters {nextSign}', body: 'The void is over. The Moon has moved into {nextSign}. Fresh momentum returns.' },
  { title: '☽ Lunar Motion Resumes', body: 'Void complete. The Moon enters {nextSign}. Time to initiate, decide, and move forward.' },
  { title: '✨ {nextSign} Moon Begins', body: 'The Moon leaves the void and enters {nextSign}. New threads may now be woven.' },
  { title: 'The Void Closes', body: 'Moon enters {nextSign}. The cosmic pause ends. Action is favored once more.' },
  { title: '🌕 New Sign, New Energy', body: 'Void moon complete. Welcome to {nextSign}. What intentions will you set?' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CIRCLE TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const FRIEND_REQUEST_TEMPLATES: NotificationTemplate[] = [
  { title: '🌟 New Cosmic Connection', body: '{name} wants to join your Circle. The cosmos grows more connected.' },
  { title: 'Friend Request', body: '{name} has sent you a Cosmic Circle invite. Will you expand your constellation?' },
  { title: '✨ Circle Invitation', body: '{name} reaches out to connect. Your cosmic network awaits your response.' },
  { title: 'New Friend Request', body: '{name} would like to join your Circle. The stars align for new bonds.' },
  { title: '🌌 Connection Request', body: '{name} seeks entry to your Circle. Every constellation starts with a single link.' },
];

export const TASK_ASSIGNED_TEMPLATES: NotificationTemplate[] = [
  { title: '📜 New Task Ritual', body: '{name} assigned you: "{task}". The Circle moves together.' },
  { title: 'Task from {name}', body: '"{task}" — assigned by {name}. Your Circle trusts you with this intention.' },
  { title: '📜 Cosmic Task', body: '{name} has shared an intention: "{task}". Will you carry it forward?' },
  { title: 'New Assignment', body: '"{task}" from {name}. The Circle weaves its shared work.' },
  { title: '🌟 Task Ritual Assigned', body: '{name} entrusted you with "{task}". The cosmos honors those who keep their commitments.' },
];

export const MESSAGE_RECEIVED_TEMPLATES: NotificationTemplate[] = [
  { title: '💬 Message from {name}', body: '{name} sent you a message in the Circle.' },
  { title: 'New Message: {name}', body: 'A whisper from {name} awaits in your Cosmic Circle.' },
  { title: '💬 {name}', body: 'You have a new message from {name}.' },
  { title: 'Circle Message', body: '{name} reached out. Your conversation continues.' },
];

export const TASK_DUE_SOON_TEMPLATES: NotificationTemplate[] = [
  { title: '⏰ Task Due Soon', body: '"{task}" is due {time}. The Circle is watching.' },
  { title: 'Approaching Deadline', body: '"{task}" needs your attention — due {time}.' },
  { title: '⏳ Time Remains', body: '"{task}" is due {time}. One step closer to completion.' },
  { title: 'Task Nearing Due', body: 'The hour approaches for "{task}". Due {time}.' },
  { title: '⏰ Circle Reminder', body: '"{task}" — due {time}. Your Circle honors your follow-through.' },
  { title: 'Deadline Alert', body: '"{task}" is due {time}. The cosmos rewards completion.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNAL TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const TRACKER_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: '🩸 Cycle Reminder', body: 'Your cycle is forecast to begin {when}. How is your body feeling today?' },
  { title: '😊 Mood Check', body: 'The stars haven\'t heard from you in {days} days. A quick mood check?' },
  { title: '😴 Sleep Log', body: 'Your sleep patterns are a mystery. Log last night\'s rest?' },
  { title: '⚡ Energy Check', body: 'Energy tracking builds awareness. 30 seconds to log?' },
  { title: '💊 Medication Reminder', body: 'Your medication reminder — the cosmos supports consistency.' },
  { title: '🌡️ Tracker Nudge', body: 'Your {trackerType} tracker misses you. One entry today?' },
  { title: 'Body Awareness', body: 'Your {trackerType} data helps the Oracle guide you. Log an entry?' },
  { title: 'Daily Tracker Prompt', body: 'The HEKA journal invites you to log your {trackerType}. Small inputs, deep insights.' },
];

export const DAILY_REFLECTION_PROMPT_TEMPLATES: NotificationTemplate[] = [
  { title: '🌙 Evening Reflection', body: 'The day is waning. What moved you? What will you carry forward? Open your journal.' },
  { title: 'Daily Review', body: 'Before the stars shift, pause. What did today teach you? Your journal awaits.' },
  { title: '🌑 Reflect & Release', body: 'Evening approaches. What deserves gratitude? What deserves release? Write it down.' },
  { title: 'Journal Prompt', body: 'The cosmos invites reflection. One sentence about today — that\'s all it takes.' },
  { title: '🌙 Close the Arc', body: 'Today\'s arc nears its end. How will you summarize this chapter? Your journal is open.' },
];

export const CELESTIAL_INSIGHT_ALERT_TEMPLATES: NotificationTemplate[] = [
  { title: '🔮 Notable Transit', body: '{transit}. This alignment may inspire a journal entry.' },
  { title: 'Celestial Moment', body: '{transit}. The skies speak — your journal can listen.' },
  { title: '✨ Transit Alert', body: '{transit}. A good time to capture your thoughts in the Oracle Journal.' },
  { title: 'Cosmic Signal', body: '{transit}. The Oracle suggests this is worth recording.' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PLANNER TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

export const DAILY_BRIEFING_TEMPLATES: NotificationTemplate[] = [
  { title: 'Your Celestial Briefing', body: '{opener} {task} The Moon is {moonPhase} in {moonSign}. You have {pendingCount} intention{plural} awaiting you.' },
  { title: '🌅 Celestial Briefing', body: '{opener} {task} Lunar phase: {moonPhase}. {pendingCount} intention{plural} on your path today.' },
  { title: 'Morning Starlight', body: '{opener} {task} The Moon moves through {moonSign}, {moonPhase}. {pendingCount} intention{plural} await.' },
  { title: 'Your Daily Arc', body: '{opener} {task} {moonPhase} moon in {moonSign}. {pendingCount} intention{plural} shape today.' },
  { title: '☀️ Celestial Briefing', body: '{opener} {task} Moon: {moonPhase} in {moonSign}. Intentions: {pendingCount}.' },
  { title: 'Good Morning, Stargazer', body: '{opener} {task} The {moonPhase} moon in {moonSign} guides your {pendingCount} intention{plural}.' },
  { title: '🌌 Today\'s Cosmic Weather', body: '{opener} {task} {moonPhase} in {moonSign}. {pendingCount} intention{plural} on the docket.' },
  { title: 'Celestial Briefing', body: '{opener} {task} Moon phase: {moonPhase}. Sign: {moonSign}. Pending: {pendingCount}.' },
  { title: '✨ Morning Guidance', body: '{opener} {task} The Moon is {moonPhase} in {moonSign}. {pendingCount} intention{plural} call to you.' },
  { title: 'Your Starlight Briefing', body: '{opener} {task} {moonPhase} moon energy in {moonSign}. {pendingCount} intention{plural} today.' },
];

export const STREAK_SAVER_TEMPLATES: NotificationTemplate[] = [
  { title: 'The Cosmos Still Believes in You', body: '{opener} {microTask}' },
  { title: '🌙 Your Flame Flickers', body: '{opener} {microTask}' },
  { title: 'One Ember Remains', body: '{opener} {microTask}' },
  { title: 'The Stars Forgive Rest', body: '{opener} {microTask}' },
  { title: 'Your Path Is Not Erased', body: '{opener} {microTask}' },
];

export const STREAK_PROTECTION_TEMPLATES: NotificationTemplate[] = [
  { title: '🔥 Your flame is dying', body: 'Your {streak}-day flame dims in the final hour. One small act keeps it alive.' },
  { title: '⚡ Streak in danger', body: 'Your {streak}-day streak is flickering. The cosmos has seen you come this far.' },
  { title: '🌙 Tend to your streak', body: 'Your {streak}-day flame still burns, but it would like to be fed.' },
  { title: '🔥 Critical', body: 'The sands are running out. Your {streak}-day streak needs you now.' },
  { title: '⚡ High Alert', body: 'You usually move by now. Your {streak}-day flame grows impatient.' },
  { title: '🌙 Medium Alert', body: 'The day is waning and your {streak}-day streak watches quietly.' },
];

export const COMPLETION_CELEBRATION_TEMPLATES: NotificationTemplate[] = [
  { title: 'Intention Fulfilled ✦', body: '{celebration} {streakText}' },
  { title: '✨ Well Done', body: '{celebration} {streakText}' },
  { title: 'Task Complete', body: '{celebration} {streakText}' },
  { title: '🌟 Achievement', body: '{celebration} {streakText}' },
  { title: '✦ Complete', body: '{celebration} {streakText}' },
];

export const COMPLEMENTARY_TASK_TEMPLATES: NotificationTemplate[] = [
  { title: 'Deepen the Practice', body: 'You completed "{task}". {suggestion}' },
  { title: '✨ Next Step', body: '"{task}" is done. {suggestion}' },
  { title: 'Continue the Flow', body: 'After "{task}": {suggestion}' },
];

export const TASK_REMINDER_TEMPLATES: NotificationTemplate[] = [
  { title: 'HEKA Intention', body: '{prefix} "{task}" — in {minutes} minute{plural}.' },
  { title: '⏰ Intention Approaches', body: '{prefix} "{task}" — {minutes} minutes remain.' },
  { title: 'The Hour Approaches', body: '{prefix} "{task}" arrives in {minutes} minute{plural}.' },
  { title: 'HEKA Reminder', body: '"{task}" — {minutes} minute{plural} away. {prefix}' },
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
