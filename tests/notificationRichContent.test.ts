/**
 * Notification Rich Content Tests
 */

import { describe, it, expect } from 'vitest';
import {
  getMoonPhaseDrawable,
  getMoonPhaseAttachment,
  getFullMoonLargeBody,
  getNewMoonLargeBody,
  getDailyBriefingLargeBody,
  getVoidMoonLargeBody,
  enrichWithRichContent,
} from '../src/services/notificationRichContent';
import type { NotificationRequest } from '../src/types/notifications';

describe('getMoonPhaseDrawable', () => {
  it('returns correct drawable for known phases', () => {
    expect(getMoonPhaseDrawable('Full Moon')).toBe('moon_full');
    expect(getMoonPhaseDrawable('New Moon')).toBe('moon_new');
    expect(getMoonPhaseDrawable('Waxing Crescent')).toBe('moon_waxing_crescent');
  });

  it('returns undefined for null', () => {
    expect(getMoonPhaseDrawable(null)).toBeUndefined();
  });

  it('returns generic for unknown phase', () => {
    expect(getMoonPhaseDrawable('Unknown Phase')).toBe('moon_generic');
  });
});

describe('getMoonPhaseAttachment', () => {
  it('returns attachment with res:// URL', () => {
    const att = getMoonPhaseAttachment('Full Moon');
    expect(att).toBeDefined();
    expect(att!.url).toBe('res://drawable/moon_full');
  });

  it('returns undefined for null', () => {
    expect(getMoonPhaseAttachment(null)).toBeUndefined();
  });
});

describe('getFullMoonLargeBody', () => {
  it('includes moon sign when provided', () => {
    const body = getFullMoonLargeBody('Leo', '98%');
    expect(body).toContain('Leo');
    expect(body).toContain('98%');
  });

  it('works without optional params', () => {
    const body = getFullMoonLargeBody();
    expect(body).toContain('mirror');
    expect(body.length).toBeGreaterThan(50);
  });
});

describe('getNewMoonLargeBody', () => {
  it('includes sign when provided', () => {
    const body = getNewMoonLargeBody('Virgo');
    expect(body).toContain('Virgo');
  });
});

describe('getDailyBriefingLargeBody', () => {
  it('includes all provided fields', () => {
    const body = getDailyBriefingLargeBody('Mars', 'Waxing Gibbous', 'morning');
    expect(body).toContain('Mars');
    expect(body).toContain('Waxing Gibbous');
    expect(body).toContain('morning');
  });
});

describe('getVoidMoonLargeBody', () => {
  it('includes duration and sign', () => {
    const body = getVoidMoonLargeBody('Scorpio', '45');
    expect(body).toContain('Scorpio');
    expect(body).toContain('45');
  });
});

describe('enrichWithRichContent', () => {
  it('enriches full-moon-reminder with largeBody and attachment', () => {
    const req: NotificationRequest = {
      type: 'full-moon-reminder',
      tier: 'standard',
      title: 'Full Moon',
      body: 'The moon is full tonight.',
      scheduleAt: new Date(),
      section: 'stars',
      extra: { phase: 'Full Moon', moonSign: 'Leo', illumination: '99%' },
    };
    const enriched = enrichWithRichContent(req);
    expect(enriched.largeBody).toContain('Leo');
    expect(enriched.largeIcon).toBe('moon_full');
    expect(enriched.attachments).toBeDefined();
    expect(enriched.attachments![0].url).toBe('res://drawable/moon_full');
  });

  it('enriches new-moon-reminder', () => {
    const req: NotificationRequest = {
      type: 'new-moon-reminder',
      tier: 'standard',
      title: 'New Moon',
      body: 'A new cycle begins.',
      scheduleAt: new Date(),
      section: 'stars',
      extra: { phase: 'New Moon' },
    };
    const enriched = enrichWithRichContent(req);
    expect(enriched.largeBody).toContain('blank slate');
    expect(enriched.largeIcon).toBe('moon_new');
  });

  it('enriches streak-saver with actionable text', () => {
    const req: NotificationRequest = {
      type: 'streak-saver',
      tier: 'standard',
      title: 'Streak Saver',
      body: 'Keep your streak alive.',
      scheduleAt: new Date(),
      section: 'planner',
    };
    const enriched = enrichWithRichContent(req);
    expect(enriched.largeBody).toContain('One small action');
  });

  it('does not modify unknown types', () => {
    const req: NotificationRequest = {
      type: 'some-random-type',
      tier: 'ambient',
      title: 'Random',
      body: 'Hello',
      scheduleAt: new Date(),
      section: 'calendar',
    };
    const enriched = enrichWithRichContent(req);
    expect(enriched.largeBody).toBeUndefined();
    expect(enriched.attachments).toBeUndefined();
  });
});
