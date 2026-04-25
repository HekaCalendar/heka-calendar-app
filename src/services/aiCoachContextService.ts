/**
 * AI Coach Context Service
 * Tracks the user's current "zone" in the app so the AI Coach can
 * tailor its voice, topics, and prompt weights to the active context.
 */

export type AICoachZone =
  | 'main-calendar'
  | 'day-panel'
  | 'stars'
  | 'journal'
  | 'circle'
  | 'stats'
  | 'search'
  | 'settings'
  | 'pure-mode'
  | 'year-modal'
  | 'community'
  | 'info'
  | 'unknown';

let currentZone: AICoachZone = 'main-calendar';

const listeners = new Set<(zone: AICoachZone) => void>();

export function setAICoachZone(zone: AICoachZone) {
  if (currentZone === zone) return;
  currentZone = zone;
  listeners.forEach((cb) => cb(zone));
}

export function getAICoachZone(): AICoachZone {
  return currentZone;
}

export function subscribeToAICoachZone(callback: (zone: AICoachZone) => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
