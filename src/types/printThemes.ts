/**
 * Design Token System for Print Themes
 * Enables consistent, maintainable theming across all print outputs
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  
  // Semantic colors
  background: string;
  surface: string;
  surfaceElevated: string;
  
  text: string;
  textSecondary: string;
  textMuted: string;
  
  border: string;
  borderLight: string;
  
  // Arc colors (HEKA-specific)
  arcOpening: string;
  arcCore: string;
  arcClosing: string;
}

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export interface TypographyScale {
  // Display
  display: {
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    letterSpacing: string;
    lineHeight: number;
  };
  
  // Headings
  h1: { fontSize: string; fontWeight: number; letterSpacing: string; };
  h2: { fontSize: string; fontWeight: number; letterSpacing: string; };
  h3: { fontSize: string; fontWeight: number; letterSpacing: string; };
  
  // Body
  body: {
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    lineHeight: number;
  };
  
  // Caption/Small
  caption: { fontSize: string; fontWeight: number; };
  label: { fontSize: string; fontWeight: number; letterSpacing: string; };
}

// ============================================================================
// SPACING TOKENS
// ============================================================================

export interface SpacingScale {
  unit: number; // Base unit in pixels
  
  // Named spacing values
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  
  // Page layout
  pagePadding: number;
  gridGap: number;
  cellPadding: number;
}

// ============================================================================
// SHADOW & EFFECT TOKENS
// ============================================================================

export interface EffectTokens {
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  
  glowPrimary: string;
  glowAccent: string;
  
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}

// ============================================================================
// COMPLETE THEME DEFINITION
// ============================================================================

export interface PrintTheme {
  id: string;
  name: string;
  description: string;
  preview: string; // Icon or preview image
  
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  effects: EffectTokens;
  
  // Layout-specific overrides
  layouts: {
    yearCover: YearCoverLayout;
    monthPage: MonthPageLayout;
    dayCell: DayCellLayout;
  };
}

export interface YearCoverLayout {
  enabled: boolean;
  showArcs: boolean;
  showWeekdayLegend: boolean;
  backgroundStyle: 'gradient' | 'solid' | 'pattern';
}

export interface MonthPageLayout {
  headerStyle: 'standard' | 'minimal' | 'banner';
  showArcIndicator: boolean;
  showCivilRange: boolean;
  gridStyle: 'standard' | 'compact' | 'spacious';
}

export interface DayCellLayout {
  showMoonPhase: boolean;
  showCivilDate: boolean;
  showNoteIndicators: boolean;
  maxNotesVisible: number;
  noteDisplayStyle: 'badge' | 'dot' | 'full';
}

// ============================================================================
// PRE-BUILT THEMES
// ============================================================================

export const THEMES: Record<string, PrintTheme> = {
  default: {
    id: 'default',
    name: 'Elegant Gold',
    description: 'Premium design with gold accents and arc-based coloring',
    preview: '✦',
    
    colors: {
      primary: '#c9a227',
      primaryLight: '#e8c97a',
      primaryDark: '#8b6914',
      secondary: '#7c3aed',
      accent: '#d4af37',
      
      background: '#faf9f7',
      surface: '#ffffff',
      surfaceElevated: '#f5f4f0',
      
      text: '#1a1a26',
      textSecondary: '#4a4a5a',
      textMuted: '#888898',
      
      border: '#d4c9a8',
      borderLight: 'rgba(212, 201, 168, 0.3)',
      
      arcOpening: '#dc2626',
      arcCore: '#16a34a',
      arcClosing: '#7c3aed'
    },
    
    typography: {
      display: {
        fontFamily: "'Cinzel', 'Times New Roman', serif",
        fontSize: '120px',
        fontWeight: 700,
        letterSpacing: '0.02em',
        lineHeight: 1
      },
      h1: { fontSize: '42px', fontWeight: 600, letterSpacing: '0.05em' },
      h2: { fontSize: '36px', fontWeight: 600, letterSpacing: '0.03em' },
      h3: { fontSize: '14px', fontWeight: 600, letterSpacing: '0.15em' },
      body: {
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.5
      },
      caption: { fontSize: '11px', fontWeight: 400 },
      label: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em' }
    },
    
    spacing: {
      unit: 8,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      pagePadding: 40,
      gridGap: 8,
      cellPadding: 8
    },
    
    effects: {
      shadowSm: '0 1px 3px rgba(0,0,0,0.1)',
      shadowMd: '0 4px 12px rgba(0,0,0,0.1)',
      shadowLg: '0 8px 32px rgba(0,0,0,0.12)',
      glowPrimary: '0 0 20px rgba(201, 162, 39, 0.4)',
      glowAccent: '0 0 40px rgba(201, 162, 39, 0.2)',
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        full: '9999px'
      }
    },
    
    layouts: {
      yearCover: {
        enabled: true,
        showArcs: true,
        showWeekdayLegend: true,
        backgroundStyle: 'gradient'
      },
      monthPage: {
        headerStyle: 'standard',
        showArcIndicator: true,
        showCivilRange: false,
        gridStyle: 'standard'
      },
      dayCell: {
        showMoonPhase: true,
        showCivilDate: true,
        showNoteIndicators: true,
        maxNotesVisible: 3,
        noteDisplayStyle: 'badge'
      }
    }
  },
  
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, modern design with maximum whitespace',
    preview: '◯',
    
    colors: {
      primary: '#1a1a1a',
      primaryLight: '#4a4a4a',
      primaryDark: '#000000',
      secondary: '#666666',
      accent: '#1a1a1a',
      
      background: '#ffffff',
      surface: '#ffffff',
      surfaceElevated: '#fafafa',
      
      text: '#1a1a1a',
      textSecondary: '#666666',
      textMuted: '#999999',
      
      border: '#e5e5e5',
      borderLight: '#f0f0f0',
      
      arcOpening: '#dc2626',
      arcCore: '#16a34a',
      arcClosing: '#7c3aed'
    },
    
    typography: {
      display: {
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '100px',
        fontWeight: 200,
        letterSpacing: '-0.03em',
        lineHeight: 1
      },
      h1: { fontSize: '32px', fontWeight: 300, letterSpacing: '-0.02em' },
      h2: { fontSize: '28px', fontWeight: 400, letterSpacing: '-0.01em' },
      h3: { fontSize: '12px', fontWeight: 500, letterSpacing: '0.05em' },
      body: {
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: '13px',
        fontWeight: 400,
        lineHeight: 1.5
      },
      caption: { fontSize: '10px', fontWeight: 400 },
      label: { fontSize: '9px', fontWeight: 500, letterSpacing: '0.1em' }
    },
    
    spacing: {
      unit: 4,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 40,
      pagePadding: 30,
      gridGap: 4,
      cellPadding: 12
    },
    
    effects: {
      shadowSm: 'none',
      shadowMd: '0 1px 3px rgba(0,0,0,0.05)',
      shadowLg: '0 2px 8px rgba(0,0,0,0.08)',
      glowPrimary: 'none',
      glowAccent: 'none',
      borderRadius: {
        sm: '2px',
        md: '4px',
        lg: '8px',
        full: '9999px'
      }
    },
    
    layouts: {
      yearCover: {
        enabled: true,
        showArcs: true,
        showWeekdayLegend: false,
        backgroundStyle: 'solid'
      },
      monthPage: {
        headerStyle: 'minimal',
        showArcIndicator: true,
        showCivilRange: true,
        gridStyle: 'spacious'
      },
      dayCell: {
        showMoonPhase: true,
        showCivilDate: true,
        showNoteIndicators: true,
        maxNotesVisible: 2,
        noteDisplayStyle: 'dot'
      }
    }
  },
  
  sacredGeometry: {
    id: 'sacred-geometry',
    name: 'Sacred Geometry',
    description: 'Mystical design with hexagonal patterns',
    preview: '⬡',
    
    colors: {
      primary: '#c9a227',
      primaryLight: '#e8d5a3',
      primaryDark: '#8b6914',
      secondary: '#6b4c1e',
      accent: '#c9a227',
      
      background: '#0a0a0f',
      surface: '#14141a',
      surfaceElevated: '#1c1c24',
      
      text: '#f5f0e6',
      textSecondary: '#b8b0a0',
      textMuted: '#706b60',
      
      border: 'rgba(201, 162, 39, 0.3)',
      borderLight: 'rgba(201, 162, 39, 0.1)',
      
      arcOpening: '#ff6b6b',
      arcCore: '#51cf66',
      arcClosing: '#9775fa'
    },
    
    typography: {
      display: {
        fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
        fontSize: '130px',
        fontWeight: 400,
        letterSpacing: '0.1em',
        lineHeight: 1
      },
      h1: { fontSize: '40px', fontWeight: 400, letterSpacing: '0.08em' },
      h2: { fontSize: '32px', fontWeight: 400, letterSpacing: '0.05em' },
      h3: { fontSize: '13px', fontWeight: 600, letterSpacing: '0.2em' },
      body: {
        fontFamily: "'Crimson Pro', Georgia, serif",
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1.6
      },
      caption: { fontSize: '11px', fontWeight: 400 },
      label: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em' }
    },
    
    spacing: {
      unit: 8,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      pagePadding: 35,
      gridGap: 6,
      cellPadding: 6
    },
    
    effects: {
      shadowSm: '0 2px 8px rgba(0,0,0,0.3)',
      shadowMd: '0 4px 16px rgba(0,0,0,0.4)',
      shadowLg: '0 8px 32px rgba(0,0,0,0.5)',
      glowPrimary: '0 0 30px rgba(201, 162, 39, 0.3)',
      glowAccent: '0 0 60px rgba(201, 162, 39, 0.15)',
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '50%', // Circles for sacred geometry
        full: '50%'
      }
    },
    
    layouts: {
      yearCover: {
        enabled: true,
        showArcs: true,
        showWeekdayLegend: true,
        backgroundStyle: 'pattern'
      },
      monthPage: {
        headerStyle: 'banner',
        showArcIndicator: true,
        showCivilRange: true,
        gridStyle: 'standard'
      },
      dayCell: {
        showMoonPhase: true,
        showCivilDate: false,
        showNoteIndicators: true,
        maxNotesVisible: 2,
        noteDisplayStyle: 'dot'
      }
    }
  }
};

// Export theme list for UI
export const AVAILABLE_THEMES = Object.values(THEMES).map(t => ({
  id: t.id,
  name: t.name,
  description: t.description,
  preview: t.preview
}));
