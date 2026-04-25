/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ORACLE SCORING ENGINE — Candidate message scoring for the HEKA AI Coach
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { CandidateMessage, OracleContext } from '../types/oracle';
import { hoursSinceTopic } from '../utils/oracleUtils';

export function isCelestialTopic(topic: string): boolean {
  const celestialTopics = [
    'transit', 'void-moon', 'planetary-hour', 'sun-boundary', 'moon-illumination',
    'moon-speed', 'lunar-nodes', 'chiron', 'time', 'plan', 'dow', 'element',
  ];
  if (celestialTopics.includes(topic)) return true;
  if (topic.startsWith('moon-')) return true;
  if (topic.startsWith('retrograde-')) return true;
  if (topic.startsWith('aspect-')) return true;
  if (topic.startsWith('critical-degree-')) return true;
  if (topic.startsWith('sun-sign-')) return true;
  if (topic.startsWith('feature-chart')) return true;
  return false;
}

export function scoreCandidate(msg: CandidateMessage, ctx: OracleContext): number {
  let score = msg.weight;

  // Novelty: moderate penalty for recently shown topics
  const hours = hoursSinceTopic(msg.topic, ctx.memory.recentMessages);
  if (hours < 1) score -= 60;
  else if (hours < 3) score -= 35;
  else if (hours < 6) score -= 15;
  else if (hours > 24) score += 20;
  else if (hours > 12) score += 10;

  // Synchronicities are rare gems — but only if not recently shown
  if (msg.isSynchronicity && hours > 2) score += 50;

  // Contextual relevance boosts
  if (msg.topic === 'celebration' && ctx.user.todayCompleted > 0) score += 25;
  if (msg.topic === 'streak' && ctx.user.streak >= 3) score += 30;
  if (msg.topic === 'pending' && ctx.user.pendingTasks >= 3) score += 20;
  if (msg.topic === 'journal' && ctx.user.daysSinceJournal >= 3) score += 20;
  if (msg.topic === 'task-suggest' && ctx.user.pendingTasks === 0 && ctx.user.lastTaskCreationDate !== ctx.todayIso) score += 15;

  // Phase 1: Mood-based scoring
  if (msg.topic === 'mood-support' && ctx.mood.shouldOfferSupport) score += 40;
  if (msg.topic === 'streak-danger' && ctx.streakDanger) score += 50;
  if (msg.topic === 'motivation' && ctx.mood.trend === 'declining') score += 15;
  if (msg.topic === 'celebration' && ctx.mood.trend === 'declining') score -= 20; // soften celebrations when struggling
  if (msg.topic === 'archetype' && ctx.archetype.confidence >= 0.5) score += 10;

  // Phase 2: Transit & VoC scoring (reduced so they don't dominate)
  if (msg.topic === 'transit' && ctx.transit.hasBirthChart) score += 15;
  if (msg.topic === 'void-moon' && ctx.isVoidMoon) score += 12;
  if (msg.topic === 'task-suggest' && ctx.isVoidMoon && msg.text.includes('void')) score += 10;

  // Phase 3: Location-aware scoring (reduced)
  if (msg.topic === 'planetary-hour' && ctx.location.hasLocation) score += 8;
  if (msg.topic === 'sun-boundary' && ctx.location.hasLocation) score += 8;
  if (msg.topic === 'planetary-hour' && ctx.user.pendingTasks === 0) score += 5;

  // Phase 4: Advanced celestial scoring (drastically reduced to allow diversity)
  if (msg.topic.startsWith('aspect-')) score += 8;
  if (msg.topic.startsWith('critical-degree-')) score += 10;
  if (msg.topic === 'moon-illumination') score += 6;
  if (msg.topic === 'moon-speed') score += 5;
  if (msg.topic === 'lunar-nodes') score += 4;
  if (msg.topic === 'chiron') score += 5;

  // Diversity: if recent messages were heavily celestial, boost non-celestial and penalize celestial
  const recent = ctx.memory.recentMessages.slice(-3);
  const celestialRatio = recent.length > 0
    ? recent.filter((m) => isCelestialTopic(m.topic)).length / recent.length
    : 0;
  if (celestialRatio >= 0.67) {
    if (isCelestialTopic(msg.topic)) score -= 18;
    else score += 12;
  } else if (celestialRatio === 0 && recent.length > 0) {
    // If last few were non-celestial, allow a celestial one to surface normally
    if (isCelestialTopic(msg.topic)) score += 5;
  }

  // Zone-based scoring: heavily tailor output to the user's current context
  const zone = ctx.zone;
  if (zone === 'main-calendar') {
    if (msg.topic.startsWith('main-') || msg.topic.startsWith('productivity-') || msg.topic.startsWith('learning-')) score += 22;
    if (['task-suggest', 'pending', 'note', 'feature-calendar', 'feature-journal-0', 'feature-journal-1'].includes(msg.topic)) score += 14;
    if (msg.topic.startsWith('evening-')) score += 18;
    if (['feature-stars', 'feature-pure', 'feature-search', 'feature-stats', 'feature-circle', 'feature-energy', 'feature-year'].includes(msg.topic)) score += 12;
    if (msg.topic.startsWith('aspect-') || msg.topic.startsWith('critical-degree-') || ['moon-speed', 'lunar-nodes', 'chiron'].includes(msg.topic)) score -= 10;
  } else if (zone === 'day-panel') {
    if (msg.topic.startsWith('day-') || ['task-suggest', 'pending', 'celebration', 'note', 'plan'].includes(msg.topic)) score += 20;
    if (msg.topic.startsWith('productivity-')) score += 12;
    if (['feature-pure', 'feature-stars'].includes(msg.topic)) score += 10;
    if (msg.topic.startsWith('aspect-') || msg.topic.startsWith('critical-degree-')) score -= 8;
  } else if (zone === 'stars') {
    if (isCelestialTopic(msg.topic)) score += 20;
    if (msg.topic.startsWith('stars-')) score += 35;
    if (['transit', 'void-moon', 'planetary-hour'].includes(msg.topic)) score += 18;
    if (msg.topic.startsWith('productivity-') || msg.topic.startsWith('main-') || msg.topic.startsWith('social-')) score -= 12;
  } else if (zone === 'journal') {
    if (msg.topic.startsWith('journal-') || msg.topic === 'journal') score += 30;
    if (['wisdom', 'question', 'mood-support'].includes(msg.topic)) score += 16;
    if (msg.topic.startsWith('creativity-') || msg.topic.startsWith('wellness-')) score += 14;
    if (['pending', 'streak-danger', 'task-suggest'].includes(msg.topic)) score -= 15;
  } else if (zone === 'circle') {
    if (msg.topic.startsWith('circle-') || msg.topic.startsWith('social-')) score += 28;
    if (['feature-chart-0', 'feature-chart-1', 'task-suggest'].includes(msg.topic)) score += 10;
    if (['journal', 'wisdom', 'productivity-deep'].includes(msg.topic)) score -= 8;
  } else if (zone === 'pure-mode') {
    if (msg.topic.startsWith('pure-') || msg.topic.startsWith('wellness-')) score += 26;
    if (['wisdom', 'mood-support', 'journal', 'creativity-notice', 'creativity-write'].includes(msg.topic)) score += 16;
    if (['pending', 'streak-danger', 'task-suggest', 'celebration', 'productivity-energy'].includes(msg.topic)) score -= 10;
  } else if (zone === 'settings') {
    if (msg.topic.startsWith('settings-')) score += 24;
    if (['feature-chart-0', 'feature-chart-1', 'feature-journal-0', 'feature-journal-1', 'feature-calendar', 'note'].includes(msg.topic)) score += 12;
    if (['feature-stars', 'feature-pure', 'feature-search', 'feature-stats', 'feature-circle', 'feature-energy', 'feature-year'].includes(msg.topic)) score += 14;
    if (msg.topic.startsWith('aspect-') || msg.topic.startsWith('critical-degree-')) score -= 10;
  } else if (zone === 'stats') {
    if (msg.topic.startsWith('stats-')) score += 30;
    if (['celebration', 'streak', 'task-suggest', 'productivity-focus'].includes(msg.topic)) score += 10;
    if (['feature-stats', 'feature-calendar'].includes(msg.topic)) score += 12;
  } else if (zone === 'search') {
    if (msg.topic.startsWith('search-')) score += 30;
    if (['plan', 'task-suggest', 'note', 'productivity-focus'].includes(msg.topic)) score += 10;
    if (['feature-search', 'feature-calendar'].includes(msg.topic)) score += 12;
  } else if (zone === 'year-modal') {
    if (msg.topic.startsWith('year-')) score += 28;
    if (['plan', 'task-suggest', 'note', 'main-explore'].includes(msg.topic)) score += 12;
    if (['feature-year', 'feature-calendar'].includes(msg.topic)) score += 12;
  } else if (zone === 'community') {
    if (msg.topic.startsWith('community-') || msg.topic.startsWith('social-') || msg.topic.startsWith('circle-')) score += 28;
    if (['feature-energy', 'feature-circle'].includes(msg.topic)) score += 12;
  } else if (zone === 'info') {
    if (msg.topic.startsWith('info-')) score += 26;
    if (['wisdom', 'question', 'learning-question'].includes(msg.topic)) score += 10;
  }

  // If user hasn't interacted in 24h, prefer higher-weight, more exciting messages
  const hoursSinceInteraction = (Date.now() - ctx.user.lastCoachInteraction) / (1000 * 60 * 60);
  if (hoursSinceInteraction > 24) score += msg.weight * 0.1;

  // Randomness (the "oracle's whim"): ±15% variance so it's not purely deterministic
  const variance = score * (0.15 * (Math.random() * 2 - 1));
  score += variance;

  return score;
}
