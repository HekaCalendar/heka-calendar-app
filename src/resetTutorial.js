/**
 * Tutorial Reset Utility
 * Run this in the browser console to reset tutorial state for testing
 */

/* global localStorage, console */

// Clear all tutorial-related localStorage keys
const keysToClear = [
  'heka-tutorial-state-v2',
  'heka-tutorial-analytics-v2',
  'tutorial-month-nav-prev',
  'tutorial-month-nav-next',
  'tutorial-theme-selected',
  'elite-step-04-note-opened',
  'elite-step-04-note-created',
  'elite-step-04-typed',
  'elite-step-04-saved',
  'elite-step-06-nav',
  'elite-step-07-today',
  'elite-step-08-expand-v',
  'elite-step-08-expand-h',
  'elite-step-09-settings',
  'elite-step-09-moon',
  'elite-step-10-year',
  'elite-step-12-journal',
  'elite-step-14-stars',
];

keysToClear.forEach(key => {
  localStorage.removeItem(key);
  console.log(`[Tutorial Reset] Cleared: ${key}`);
});

console.log('[Tutorial Reset] All tutorial state cleared! Refresh the page to see the onboarding.');

// Also reset any v1 keys if they exist
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (key.includes('tutorial') || key.includes('elite'))) {
    console.log(`[Tutorial Reset] Found tutorial key: ${key}`);
  }
}
