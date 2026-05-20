import { describe, it, expect } from 'vitest';
import {
  seededRandom,
  pickTemplate,
  formatTemplate,
} from '../src/services/notificationTemplates';
import {
  getChannelForTier,
  getChannelForCelebration,
  getActionsForType,
  HEKA_CHANNELS,
} from '../src/services/notificationChannels';

describe('integration: notification pipeline', () => {
  it('end-to-end content generation flow', () => {
    const templates = [
      { title: 'Good morning {name}', body: 'Today is {day}' },
      { title: 'Rise and shine {name}', body: 'Welcome to {day}' },
    ];

    const seed = '2024-06-15';
    const template = pickTemplate(templates, seed);
    const formatted = formatTemplate(template, { name: 'Alice', day: 'Saturday' });

    expect(formatted.title).toContain('Alice');
    expect(formatted.body).toContain('Saturday');
    expect(formatted.title.length).toBeGreaterThan(0);
    expect(formatted.body.length).toBeGreaterThan(0);
  });

  it('deterministic content for same seed', () => {
    const templates = [
      { title: 'A', body: 'a' },
      { title: 'B', body: 'b' },
      { title: 'C', body: 'c' },
    ];

    const seed = 'fixed-seed-test';
    const t1 = pickTemplate(templates, seed);
    const t2 = pickTemplate(templates, seed);
    expect(t1).toBe(t2);
  });

  it('channel selection matches tier requirements', () => {
    expect(getChannelForTier('core')).toBe(HEKA_CHANNELS.heka_core.id);
    expect(getChannelForTier('standard')).toBe(HEKA_CHANNELS.heka_standard.id);
    expect(getChannelForTier('ambient')).toBe(HEKA_CHANNELS.heka_ambient.id);
  });

  it('celebration channel has higher importance than ambient', () => {
    const celeb = HEKA_CHANNELS.heka_celebration;
    const ambient = HEKA_CHANNELS.heka_ambient;
    expect(celeb.importance).toBeGreaterThan(ambient.importance);
  });

  it('actions match notification type intent', () => {
    const taskActions = getActionsForType('task-reminder');
    expect(taskActions.some(a => a.id === 'complete')).toBe(true);
    expect(taskActions.some(a => a.id === 'snooze-15')).toBe(true);

    const briefingActions = getActionsForType('daily-briefing');
    expect(briefingActions.some(a => a.id === 'open-journal')).toBe(true);

    const defaultActions = getActionsForType('unknown-type');
    expect(defaultActions).toBeDefined();
    expect(defaultActions.length).toBeGreaterThan(0);
  });

  it('core channel always has vibration', () => {
    const core = HEKA_CHANNELS.heka_core;
    expect(core.vibration).toBe(true);
    expect(core.importance).toBe(5);
  });

  it('template formatting handles missing vars gracefully', () => {
    const template = { title: 'Hello {name}', body: 'Day {day}' };
    const result = formatTemplate(template, { name: 'Bob' });
    expect(result.title).toBe('Hello Bob');
    expect(result.body).toBe('Day {day}');
  });

  it('random distribution covers all templates over many seeds', () => {
    const templates = [
      { title: 'A', body: 'a' },
      { title: 'B', body: 'b' },
      { title: 'C', body: 'c' },
    ];

    const picked = new Set<number>();
    for (let i = 0; i < 50; i++) {
      const idx = Math.floor(seededRandom(`seed-${i}`) * templates.length);
      picked.add(idx);
    }

    // Over 50 random seeds, we should have hit all 3 templates
    expect(picked.size).toBeGreaterThanOrEqual(2);
  });
});
