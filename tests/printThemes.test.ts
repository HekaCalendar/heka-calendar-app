import { describe, it, expect } from 'vitest';
import { THEMES, AVAILABLE_THEMES } from '../src/types/printThemes';

describe('printThemes', () => {
  describe('THEMES', () => {
    it('every theme has all required fields', () => {
      const themeValues = Object.values(THEMES);
      expect(themeValues.length).toBeGreaterThan(0);

      for (const theme of themeValues) {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('preview');
        expect(theme).toHaveProperty('colors');
        expect(theme).toHaveProperty('typography');
        expect(theme).toHaveProperty('spacing');
        expect(theme).toHaveProperty('effects');
        expect(theme).toHaveProperty('layouts');

        expect(typeof theme.id).toBe('string');
        expect(typeof theme.name).toBe('string');
        expect(typeof theme.description).toBe('string');
        expect(typeof theme.preview).toBe('string');
      }
    });

    it('each theme has a valid colors object', () => {
      for (const theme of Object.values(THEMES)) {
        expect(theme.colors).toBeInstanceOf(Object);
        expect(theme.colors).toHaveProperty('primary');
        expect(theme.colors).toHaveProperty('primaryLight');
        expect(theme.colors).toHaveProperty('primaryDark');
        expect(theme.colors).toHaveProperty('secondary');
        expect(theme.colors).toHaveProperty('accent');
        expect(theme.colors).toHaveProperty('background');
        expect(theme.colors).toHaveProperty('surface');
        expect(theme.colors).toHaveProperty('surfaceElevated');
        expect(theme.colors).toHaveProperty('text');
        expect(theme.colors).toHaveProperty('textSecondary');
        expect(theme.colors).toHaveProperty('textMuted');
        expect(theme.colors).toHaveProperty('border');
        expect(theme.colors).toHaveProperty('borderLight');
        expect(theme.colors).toHaveProperty('arcOpening');
        expect(theme.colors).toHaveProperty('arcCore');
        expect(theme.colors).toHaveProperty('arcClosing');
      }
    });

    it('each theme has a valid typography object', () => {
      for (const theme of Object.values(THEMES)) {
        expect(theme.typography).toBeInstanceOf(Object);
        expect(theme.typography).toHaveProperty('display');
        expect(theme.typography).toHaveProperty('h1');
        expect(theme.typography).toHaveProperty('h2');
        expect(theme.typography).toHaveProperty('h3');
        expect(theme.typography).toHaveProperty('body');
        expect(theme.typography).toHaveProperty('caption');
        expect(theme.typography).toHaveProperty('label');

        expect(theme.typography.display).toHaveProperty('fontFamily');
        expect(theme.typography.display).toHaveProperty('fontSize');
        expect(theme.typography.display).toHaveProperty('fontWeight');
        expect(theme.typography.display).toHaveProperty('letterSpacing');
        expect(theme.typography.display).toHaveProperty('lineHeight');

        expect(theme.typography.body).toHaveProperty('fontFamily');
        expect(theme.typography.body).toHaveProperty('fontSize');
        expect(theme.typography.body).toHaveProperty('fontWeight');
        expect(theme.typography.body).toHaveProperty('lineHeight');
      }
    });

    it('each theme has a valid spacing object', () => {
      for (const theme of Object.values(THEMES)) {
        expect(theme.spacing).toBeInstanceOf(Object);
        expect(theme.spacing).toHaveProperty('unit');
        expect(theme.spacing).toHaveProperty('xs');
        expect(theme.spacing).toHaveProperty('sm');
        expect(theme.spacing).toHaveProperty('md');
        expect(theme.spacing).toHaveProperty('lg');
        expect(theme.spacing).toHaveProperty('xl');
        expect(theme.spacing).toHaveProperty('xxl');
        expect(theme.spacing).toHaveProperty('pagePadding');
        expect(theme.spacing).toHaveProperty('gridGap');
        expect(theme.spacing).toHaveProperty('cellPadding');
      }
    });

    it('each theme has a valid effects object', () => {
      for (const theme of Object.values(THEMES)) {
        expect(theme.effects).toBeInstanceOf(Object);
        expect(theme.effects).toHaveProperty('shadowSm');
        expect(theme.effects).toHaveProperty('shadowMd');
        expect(theme.effects).toHaveProperty('shadowLg');
        expect(theme.effects).toHaveProperty('glowPrimary');
        expect(theme.effects).toHaveProperty('glowAccent');
        expect(theme.effects).toHaveProperty('borderRadius');
        expect(theme.effects.borderRadius).toHaveProperty('sm');
        expect(theme.effects.borderRadius).toHaveProperty('md');
        expect(theme.effects.borderRadius).toHaveProperty('lg');
        expect(theme.effects.borderRadius).toHaveProperty('full');
      }
    });

    it('each theme has valid layout objects', () => {
      for (const theme of Object.values(THEMES)) {
        expect(theme.layouts).toBeInstanceOf(Object);
        expect(theme.layouts).toHaveProperty('yearCover');
        expect(theme.layouts).toHaveProperty('monthPage');
        expect(theme.layouts).toHaveProperty('dayCell');
      }
    });
  });

  describe('AVAILABLE_THEMES', () => {
    it('matches Object.values(THEMES) mapped to UI fields', () => {
      const expected = Object.values(THEMES).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        preview: t.preview,
      }));

      expect(AVAILABLE_THEMES).toHaveLength(expected.length);
      expect(AVAILABLE_THEMES).toEqual(expected);
    });

    it('each available theme entry has the correct shape', () => {
      for (const theme of AVAILABLE_THEMES) {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
        expect(theme).toHaveProperty('description');
        expect(theme).toHaveProperty('preview');
        expect(Object.keys(theme)).toHaveLength(4);
      }
    });
  });
});
