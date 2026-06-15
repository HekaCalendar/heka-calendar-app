import { describe, it, expect, beforeAll } from 'vitest';
import { initI18n } from '../src/i18n';
import i18n from '../src/i18n';

describe('i18n namespace loading', () => {
  beforeAll(async () => {
    await initI18n('en-US');
  });

  it('loads info namespace keys used by InfoModal', () => {
    const hero = i18n.t('info:infoModal.hero.title');
    const ch5 = i18n.t('info:infoModal.chapters.ch5.title');
    expect(hero).not.toBe('infoModal.hero.title');
    expect(ch5).not.toBe('infoModal.chapters.ch5.title');
    expect(ch5).toBe('Why Calendars Drift');
  });

  it('loads stats namespace keys used by StatsModal', () => {
    expect(i18n.t('stats:title')).not.toBe('title');
    expect(i18n.t('stats:categories.personal')).not.toBe('categories.personal');
    expect(i18n.t('stats:title')).toBe('Your Journey');
  });
});
