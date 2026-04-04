/**
 * Celestial Intelligence Theme System
 * Epic color themes for the observatory interface
 */

export type CelestialThemeId = 'nebula' | 'aurora' | 'solar' | 'cosmic' | 'void' | 'eclipse';

export interface CelestialTheme {
  id: CelestialThemeId;
  name: string;
  description: string;
  emoji: string;
  colors: {
    // Primary accent
    primary: string;
    primaryLight: string;
    primaryDark: string;
    // Secondary accent
    secondary: string;
    secondaryLight: string;
    // Background gradients
    bgBase: string;
    bgNebula1: string;
    bgNebula2: string;
    bgNebula3: string;
    // Status colors
    success: string;
    warning: string;
    danger: string;
    info: string;
    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    // Glow effects
    glowPrimary: string;
    glowSecondary: string;
    glowSuccess: string;
    glowWarning: string;
    // Glass effects
    glassBg: string;
    glassBorder: string;
  };
  animation: {
    nebulaSpeed: string;
    starDensity: number;
    shootingStarFrequency: string;
    pulseSpeed: string;
  };
}

export const CELESTIAL_THEMES: Record<CelestialThemeId, CelestialTheme> = {
  nebula: {
    id: 'nebula',
    name: 'Nebula Dreams',
    description: 'Purple cosmic clouds with golden starlight',
    emoji: '🌌',
    colors: {
      primary: '#a855f7',
      primaryLight: '#c084fc',
      primaryDark: '#7c3aed',
      secondary: '#fbbf24',
      secondaryLight: '#fcd34d',
      bgBase: '#050508',
      bgNebula1: 'rgba(124, 58, 237, 0.15)',
      bgNebula2: 'rgba(168, 85, 247, 0.1)',
      bgNebula3: 'rgba(251, 191, 36, 0.08)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f43f5e',
      info: '#22d3ee',
      textPrimary: '#fafafa',
      textSecondary: '#c4b5fd',
      textMuted: '#7c3aed',
      glowPrimary: 'rgba(168, 85, 247, 0.5)',
      glowSecondary: 'rgba(251, 191, 36, 0.5)',
      glowSuccess: 'rgba(52, 211, 153, 0.4)',
      glowWarning: 'rgba(251, 191, 36, 0.4)',
      glassBg: 'rgba(124, 58, 237, 0.08)',
      glassBorder: 'rgba(168, 85, 247, 0.2)',
    },
    animation: {
      nebulaSpeed: '20s',
      starDensity: 100,
      shootingStarFrequency: '8s',
      pulseSpeed: '2s',
    },
  },

  aurora: {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Dancing green lights across the northern sky',
    emoji: '🌠',
    colors: {
      primary: '#10b981',
      primaryLight: '#34d399',
      primaryDark: '#059669',
      secondary: '#06b6d4',
      secondaryLight: '#22d3ee',
      bgBase: '#020b0a',
      bgNebula1: 'rgba(16, 185, 129, 0.12)',
      bgNebula2: 'rgba(6, 182, 212, 0.1)',
      bgNebula3: 'rgba(52, 211, 153, 0.06)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f43f5e',
      info: '#22d3ee',
      textPrimary: '#f0fdf4',
      textSecondary: '#a7f3d0',
      textMuted: '#059669',
      glowPrimary: 'rgba(16, 185, 129, 0.5)',
      glowSecondary: 'rgba(6, 182, 212, 0.5)',
      glowSuccess: 'rgba(52, 211, 153, 0.4)',
      glowWarning: 'rgba(251, 191, 36, 0.4)',
      glassBg: 'rgba(16, 185, 129, 0.08)',
      glassBorder: 'rgba(52, 211, 153, 0.2)',
    },
    animation: {
      nebulaSpeed: '15s',
      starDensity: 80,
      shootingStarFrequency: '6s',
      pulseSpeed: '2.5s',
    },
  },

  solar: {
    id: 'solar',
    name: 'Solar Flare',
    description: 'Burning orange flames of the stellar surface',
    emoji: '🔥',
    colors: {
      primary: '#f97316',
      primaryLight: '#fb923c',
      primaryDark: '#ea580c',
      secondary: '#ef4444',
      secondaryLight: '#f87171',
      bgBase: '#0a0300',
      bgNebula1: 'rgba(249, 115, 22, 0.15)',
      bgNebula2: 'rgba(239, 68, 68, 0.1)',
      bgNebula3: 'rgba(251, 191, 36, 0.12)',
      success: '#fbbf24',
      warning: '#f97316',
      danger: '#dc2626',
      info: '#fdba74',
      textPrimary: '#fff7ed',
      textSecondary: '#fed7aa',
      textMuted: '#c2410c',
      glowPrimary: 'rgba(249, 115, 22, 0.6)',
      glowSecondary: 'rgba(239, 68, 68, 0.5)',
      glowSuccess: 'rgba(251, 191, 36, 0.5)',
      glowWarning: 'rgba(249, 115, 22, 0.5)',
      glassBg: 'rgba(249, 115, 22, 0.1)',
      glassBorder: 'rgba(251, 191, 36, 0.25)',
    },
    animation: {
      nebulaSpeed: '12s',
      starDensity: 60,
      shootingStarFrequency: '4s',
      pulseSpeed: '1.5s',
    },
  },

  cosmic: {
    id: 'cosmic',
    name: 'Cosmic Ocean',
    description: 'Deep blue mysteries of infinite space',
    emoji: '🌊',
    colors: {
      primary: '#3b82f6',
      primaryLight: '#60a5fa',
      primaryDark: '#2563eb',
      secondary: '#8b5cf6',
      secondaryLight: '#a78bfa',
      bgBase: '#000214',
      bgNebula1: 'rgba(59, 130, 246, 0.12)',
      bgNebula2: 'rgba(139, 92, 246, 0.1)',
      bgNebula3: 'rgba(6, 182, 212, 0.08)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#f43f5e',
      info: '#60a5fa',
      textPrimary: '#eff6ff',
      textSecondary: '#bfdbfe',
      textMuted: '#3b82f6',
      glowPrimary: 'rgba(59, 130, 246, 0.5)',
      glowSecondary: 'rgba(139, 92, 246, 0.5)',
      glowSuccess: 'rgba(52, 211, 153, 0.4)',
      glowWarning: 'rgba(251, 191, 36, 0.4)',
      glassBg: 'rgba(59, 130, 246, 0.08)',
      glassBorder: 'rgba(96, 165, 250, 0.2)',
    },
    animation: {
      nebulaSpeed: '25s',
      starDensity: 120,
      shootingStarFrequency: '10s',
      pulseSpeed: '3s',
    },
  },

  void: {
    id: 'void',
    name: 'The Void',
    description: 'Mysterious pink-purple depths of nothingness',
    emoji: '🌑',
    colors: {
      primary: '#ec4899',
      primaryLight: '#f472b6',
      primaryDark: '#db2777',
      secondary: '#a855f7',
      secondaryLight: '#c084fc',
      bgBase: '#0a000a',
      bgNebula1: 'rgba(236, 72, 153, 0.1)',
      bgNebula2: 'rgba(168, 85, 247, 0.12)',
      bgNebula3: 'rgba(244, 114, 182, 0.08)',
      success: '#34d399',
      warning: '#fbbf24',
      danger: '#be123c',
      info: '#f472b6',
      textPrimary: '#fdf2f8',
      textSecondary: '#fbcfe8',
      textMuted: '#db2777',
      glowPrimary: 'rgba(236, 72, 153, 0.5)',
      glowSecondary: 'rgba(168, 85, 247, 0.5)',
      glowSuccess: 'rgba(52, 211, 153, 0.4)',
      glowWarning: 'rgba(251, 191, 36, 0.4)',
      glassBg: 'rgba(236, 72, 153, 0.08)',
      glassBorder: 'rgba(244, 114, 182, 0.2)',
    },
    animation: {
      nebulaSpeed: '18s',
      starDensity: 50,
      shootingStarFrequency: '5s',
      pulseSpeed: '2s',
    },
  },

  eclipse: {
    id: 'eclipse',
    name: 'Solar Eclipse',
    description: 'Black and gold majesty of celestial alignment',
    emoji: '🌒',
    colors: {
      primary: '#fbbf24',
      primaryLight: '#fcd34d',
      primaryDark: '#f59e0b',
      secondary: '#78716c',
      secondaryLight: '#a8a29e',
      bgBase: '#000000',
      bgNebula1: 'rgba(251, 191, 36, 0.1)',
      bgNebula2: 'rgba(120, 113, 108, 0.08)',
      bgNebula3: 'rgba(251, 191, 36, 0.05)',
      success: '#fbbf24',
      warning: '#f59e0b',
      danger: '#dc2626',
      info: '#a8a29e',
      textPrimary: '#fafaf9',
      textSecondary: '#d6d3d1',
      textMuted: '#78716c',
      glowPrimary: 'rgba(251, 191, 36, 0.6)',
      glowSecondary: 'rgba(168, 162, 158, 0.4)',
      glowSuccess: 'rgba(251, 191, 36, 0.5)',
      glowWarning: 'rgba(245, 158, 11, 0.5)',
      glassBg: 'rgba(251, 191, 36, 0.06)',
      glassBorder: 'rgba(251, 191, 36, 0.2)',
    },
    animation: {
      nebulaSpeed: '30s',
      starDensity: 150,
      shootingStarFrequency: '12s',
      pulseSpeed: '4s',
    },
  },
};

export const DEFAULT_CELESTIAL_THEME: CelestialThemeId = 'nebula';

// CSS variable generator
export function generateThemeCSS(theme: CelestialTheme): string {
  return `
    --ci-primary: ${theme.colors.primary};
    --ci-primary-light: ${theme.colors.primaryLight};
    --ci-primary-dark: ${theme.colors.primaryDark};
    --ci-secondary: ${theme.colors.secondary};
    --ci-secondary-light: ${theme.colors.secondaryLight};
    --ci-bg-base: ${theme.colors.bgBase};
    --ci-bg-nebula-1: ${theme.colors.bgNebula1};
    --ci-bg-nebula-2: ${theme.colors.bgNebula2};
    --ci-bg-nebula-3: ${theme.colors.bgNebula3};
    --ci-success: ${theme.colors.success};
    --ci-warning: ${theme.colors.warning};
    --ci-danger: ${theme.colors.danger};
    --ci-info: ${theme.colors.info};
    --ci-text-primary: ${theme.colors.textPrimary};
    --ci-text-secondary: ${theme.colors.textSecondary};
    --ci-text-muted: ${theme.colors.textMuted};
    --ci-glow-primary: ${theme.colors.glowPrimary};
    --ci-glow-secondary: ${theme.colors.glowSecondary};
    --ci-glow-success: ${theme.colors.glowSuccess};
    --ci-glow-warning: ${theme.colors.glowWarning};
    --ci-glass-bg: ${theme.colors.glassBg};
    --ci-glass-border: ${theme.colors.glassBorder};
    --ci-nebula-speed: ${theme.animation.nebulaSpeed};
    --ci-star-density: ${theme.animation.starDensity};
    --ci-shooting-star-freq: ${theme.animation.shootingStarFrequency};
    --ci-pulse-speed: ${theme.animation.pulseSpeed};
  `;
}
