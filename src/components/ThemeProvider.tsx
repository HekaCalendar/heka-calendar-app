/**
 * Theme Provider Component
 * Applies dynamic theme CSS variables and fonts based on selections
 */

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { THEMES, FONTS, DEFAULT_THEME, DEFAULT_FONT } from '../types/themes';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeId = useSelector((state: RootState) => state.calendar.theme);
  const fontId = useSelector((state: RootState) => state.calendar.font);
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];
  const font = FONTS[fontId] || FONTS[DEFAULT_FONT];

  useEffect(() => {
    const root = document.documentElement;
    const colors = theme.colors;

    // Apply all CSS color variables
    root.style.setProperty('--color-bg', colors.bg);
    root.style.setProperty('--color-bg-elevated', colors.bgElevated);
    root.style.setProperty('--color-bg-card', colors.bgCard);
    root.style.setProperty('--color-bg-hover', colors.bgHover);

    root.style.setProperty('--color-gold', colors.primary);
    root.style.setProperty('--color-gold-light', colors.primaryLight);
    root.style.setProperty('--color-gold-dark', colors.primaryDark);
    root.style.setProperty('--color-gold-muted', colors.primaryMuted);
    root.style.setProperty('--color-gold-glow', colors.primaryGlow);

    root.style.setProperty('--color-opening', colors.opening);
    root.style.setProperty('--color-opening-bg', colors.openingBg);
    root.style.setProperty('--color-opening-glow', colors.openingGlow);
    root.style.setProperty('--color-core', colors.core);
    root.style.setProperty('--color-core-bg', colors.coreBg);
    root.style.setProperty('--color-core-glow', colors.coreGlow);
    root.style.setProperty('--color-closing', colors.closing);
    root.style.setProperty('--color-closing-bg', colors.closingBg);
    root.style.setProperty('--color-closing-glow', colors.closingGlow);

    root.style.setProperty('--color-sync', colors.sync);
    root.style.setProperty('--color-sync-bg', colors.syncBg);
    root.style.setProperty('--color-true', colors.true);
    root.style.setProperty('--color-true-bg', colors.trueBg);

    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-text-muted', colors.textMuted);
    root.style.setProperty('--color-text-subtle', colors.textSubtle);

    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-border-hover', colors.borderHover);
    root.style.setProperty('--color-border-strong', colors.borderStrong);

    root.style.setProperty('--gradient-gold', colors.gradientPrimary);
    root.style.setProperty('--gradient-bg', colors.gradientBg);

    // Apply data attribute for theme-specific CSS
    root.setAttribute('data-theme', theme.id);
  }, [theme]);

  // Apply fonts separately
  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--font-display', font.fonts.display);
    root.style.setProperty('--font-heading', font.fonts.heading);
    root.style.setProperty('--font-body', font.fonts.body);
    root.style.setProperty('--font-mono', font.fonts.mono);
    
    root.setAttribute('data-font', font.id);
  }, [font]);

  return <>{children}</>;
};

export default ThemeProvider;
