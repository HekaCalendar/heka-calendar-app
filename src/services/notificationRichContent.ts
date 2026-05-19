/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RICH NOTIFICATION CONTENT — Enhanced visuals for high-value notifications
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Provides largeBody text, image attachments, and inbox-style formatting
 * for notifications that benefit from expanded detail.
 */

import type { NotificationRequest } from '../types/notifications';

// ── Moon Phase Images ────────────────────────────────────────────────────────

/** Map moon phase names to drawable resource names (Android res/drawable) */
const MOON_PHASE_DRAWABLES: Record<string, string> = {
  'New Moon': 'moon_new',
  'Waxing Crescent': 'moon_waxing_crescent',
  'First Quarter': 'moon_first_quarter',
  'Waxing Gibbous': 'moon_waxing_gibbous',
  'Full Moon': 'moon_full',
  'Waning Gibbous': 'moon_waning_gibbous',
  'Last Quarter': 'moon_last_quarter',
  'Waning Crescent': 'moon_waning_crescent',
};

/** Get a large icon drawable name for a moon phase (falls back to generic) */
export function getMoonPhaseDrawable(phaseName: string | null | undefined): string | undefined {
  if (!phaseName) return undefined;
  return MOON_PHASE_DRAWABLES[phaseName] || 'moon_generic';
}

/** Get attachment for moon phase image */
export function getMoonPhaseAttachment(phaseName: string | null | undefined): { id: string; url: string } | undefined {
  const drawable = getMoonPhaseDrawable(phaseName);
  if (!drawable) return undefined;
  return {
    id: `moon-${drawable}`,
    url: `res://drawable/${drawable}`,
  };
}

// ── Large Body Generators ──────────────────────────────────────────────────

/** Generate expanded body text for full moon reminders */
export function getFullMoonLargeBody(moonSign?: string | null | undefined, illumination?: string | null | undefined): string {
  const lines: string[] = [
    'The Moon rises full tonight — a mirror for what has been building within you.',
  ];
  if (moonSign) {
    lines.push(`She sails through ${moonSign}, amplifying its qualities in your emotional landscape.`);
  }
  if (illumination) {
    lines.push(`Illumination: ${illumination}`);
  }
  lines.push('');
  lines.push('Take a moment to observe what surfaces. Full moons illuminate what the new moon seeded.');
  return lines.join('\n');
}

/** Generate expanded body text for new moon reminders */
export function getNewMoonLargeBody(moonSign?: string | null | undefined): string {
  const lines: string[] = [
    'The Moon turns dark — a blank slate for new intentions.',
  ];
  if (moonSign) {
    lines.push(`In ${moonSign}, this new cycle carries the flavour of fresh beginnings and raw potential.`);
  }
  lines.push('');
  lines.push('What will you seed in the dark? Set one small intention for the cycle ahead.');
  return lines.join('\n');
}

/** Generate expanded body text for daily briefing */
export function getDailyBriefingLargeBody(
  planetaryHour?: string | null | undefined,
  moonPhase?: string | null | undefined,
  daySegment?: string | null | undefined
): string {
  const lines: string[] = ['Your celestial briefing for today:'];
  if (planetaryHour) {
    lines.push(`• Planetary hour: ${planetaryHour}`);
  }
  if (moonPhase) {
    lines.push(`• Moon phase: ${moonPhase}`);
  }
  if (daySegment) {
    lines.push(`• Day segment: ${daySegment}`);
  }
  lines.push('');
  lines.push('The day unfolds in its own rhythm. Move with it, not against it.');
  return lines.join('\n');
}

/** Generate expanded body text for void moon entry */
export function getVoidMoonLargeBody(sign?: string | null | undefined, duration?: string | null | undefined): string {
  const lines: string[] = [
    'The Moon has gone void — a pause between acts.',
  ];
  if (sign) {
    lines.push(`She leaves ${sign} behind, wandering without anchor for a time.`);
  }
  if (duration) {
    lines.push(`Duration: approximately ${duration} minutes.`);
  }
  lines.push('');
  lines.push('This is not a time for major decisions or launches. Let things drift. Review, rest, release.');
  return lines.join('\n');
}

// ── Request Enrichment ─────────────────────────────────────────────────────

/**
 * Enrich a notification request with rich content based on its type.
 * Call this before scheduling to add largeBody, attachments, etc.
 */
export function enrichWithRichContent(req: NotificationRequest): NotificationRequest {
  const enriched: NotificationRequest = { ...req };

  switch (req.type) {
    case 'full-moon-reminder': {
      const phase = req.extra?.phase as string | undefined;
      const moonSign = req.extra?.moonSign as string | undefined;
      const illumination = req.extra?.illumination as string | undefined;
      enriched.largeBody = getFullMoonLargeBody(moonSign, illumination);
      enriched.largeIcon = getMoonPhaseDrawable(phase);
      const attachment = getMoonPhaseAttachment(phase);
      if (attachment) enriched.attachments = [attachment];
      break;
    }
    case 'new-moon-reminder': {
      const phase = req.extra?.phase as string | undefined;
      const moonSign = req.extra?.moonSign as string | undefined;
      enriched.largeBody = getNewMoonLargeBody(moonSign);
      enriched.largeIcon = getMoonPhaseDrawable(phase);
      const attachment = getMoonPhaseAttachment(phase);
      if (attachment) enriched.attachments = [attachment];
      break;
    }
    case 'daily-briefing': {
      const planetaryHour = req.extra?.planetaryHour as string | undefined;
      const moonPhase = req.extra?.moonPhase as string | undefined;
      const daySegment = req.extra?.daySegment as string | undefined;
      enriched.largeBody = getDailyBriefingLargeBody(planetaryHour, moonPhase, daySegment);
      break;
    }
    case 'void-moon-entered': {
      const sign = req.extra?.sign as string | undefined;
      const duration = req.extra?.duration as string | undefined;
      enriched.largeBody = getVoidMoonLargeBody(sign, duration);
      break;
    }
    case 'streak-saver': {
      enriched.largeBody = `${req.body}\n\nYour streak is a thread woven day by day. One small action keeps the pattern alive. Open HEKA now and mark something complete — even the smallest ritual counts.`;
      break;
    }
    case 'task-due-soon': {
      enriched.largeBody = `${req.body}\n\nTap to open your planner and see what needs attention. Swipe a task to mark it done, or snooze if you need more time.`;
      break;
    }
    default:
      break;
  }

  return enriched;
}
