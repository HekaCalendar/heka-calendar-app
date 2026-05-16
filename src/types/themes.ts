/**
 * HEKA Calendar - Epic Theme System
 * 6 distinct visual themes with dual-mode (TRUE/SYNC) variations
 * 6 epic font combinations
 */

export type ThemeId = 'egyptian-gold' | 'cyberpunk-neon' | 'nordic-frost' | 'solar-flare' | 'void-walker' | 'nature-spirit';
export type FontId = 'elegant' | 'modern' | 'ancient' | 'futuristic' | 'natural' | 'minimalist';

export interface ThemeColors {
  // Core backgrounds
  bg: string;
  bgElevated: string;
  bgCard: string;
  bgHover: string;
  
  // Primary accent (gold replacement)
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryMuted: string;
  primaryGlow: string;
  
  // Arc colors
  opening: string;
  openingBg: string;
  openingGlow: string;
  core: string;
  coreBg: string;
  coreGlow: string;
  closing: string;
  closingBg: string;
  closingGlow: string;
  
  // Mode-specific colors
  sync: string;
  syncBg: string;
  true: string;
  trueBg: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textSubtle: string;
  
  // Borders
  border: string;
  borderHover: string;
  borderStrong: string;
  
  // Gradients
  gradientPrimary: string;
  gradientBg: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  icon: string;
  colors: ThemeColors;
}

export interface FontTheme {
  id: FontId;
  name: string;
  description: string;
  icon: string;
  fonts: {
    display: string;
    heading: string;
    body: string;
    mono: string;
  };
}

// Egyptian Gold (Default) - Ancient mystique
const egyptianGold: Theme = {
  id: 'egyptian-gold',
  name: 'Egyptian Gold',
  description: 'Ancient mystique with deep amber and lapis',
  icon: '🔱',
  colors: {
    bg: '#070708',
    bgElevated: '#0f0f11',
    bgCard: '#16161a',
    bgHover: '#1e1e24',
    
    primary: '#d4af37',
    primaryLight: '#f4d03f',
    primaryDark: '#b8941f',
    primaryMuted: 'rgba(212, 175, 55, 0.12)',
    primaryGlow: 'rgba(212, 175, 55, 0.4)',
    
    opening: '#dc2626',
    openingBg: 'rgba(220, 38, 38, 0.12)',
    openingGlow: 'rgba(220, 38, 38, 0.3)',
    core: '#16a34a',
    coreBg: 'rgba(22, 163, 74, 0.12)',
    coreGlow: 'rgba(22, 163, 74, 0.3)',
    closing: '#7c3aed',
    closingBg: 'rgba(124, 58, 237, 0.12)',
    closingGlow: 'rgba(124, 58, 237, 0.3)',
    
    sync: '#0ea5e9',
    syncBg: 'rgba(14, 165, 233, 0.1)',
    true: '#f59e0b',
    trueBg: 'rgba(245, 158, 11, 0.1)',
    
    text: '#f8f7f5',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    textSubtle: '#52525b',
    
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(212, 175, 55, 0.3)',
    borderStrong: 'rgba(255, 255, 255, 0.15)',
    
    gradientPrimary: 'linear-gradient(135deg, #f4d03f 0%, #d4af37 50%, #b8941f 100%)',
    gradientBg: `radial-gradient(ellipse at 20% 0%, rgba(212, 175, 55, 0.03) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 100%, rgba(124, 58, 237, 0.02) 0%, transparent 40%),
                 #070708`,
  },
};

// Cyberpunk Neon - Future tech
const cyberpunkNeon: Theme = {
  id: 'cyberpunk-neon',
  name: 'Cyberpunk Neon',
  description: 'Electric future with magenta and cyan pulses',
  icon: '⚡',
  colors: {
    bg: '#0a0a0f',
    bgElevated: '#12121a',
    bgCard: '#1a1a25',
    bgHover: '#222230',
    
    primary: '#ff00ff',
    primaryLight: '#ff66ff',
    primaryDark: '#cc00cc',
    primaryMuted: 'rgba(255, 0, 255, 0.15)',
    primaryGlow: 'rgba(255, 0, 255, 0.5)',
    
    opening: '#ff0066',
    openingBg: 'rgba(255, 0, 102, 0.15)',
    openingGlow: 'rgba(255, 0, 102, 0.4)',
    core: '#00ff66',
    coreBg: 'rgba(0, 255, 102, 0.15)',
    coreGlow: 'rgba(0, 255, 102, 0.4)',
    closing: '#9900ff',
    closingBg: 'rgba(153, 0, 255, 0.15)',
    closingGlow: 'rgba(153, 0, 255, 0.4)',
    
    sync: '#00ffff',
    syncBg: 'rgba(0, 255, 255, 0.15)',
    true: '#ff00aa',
    trueBg: 'rgba(255, 0, 170, 0.15)',
    
    text: '#e0e0ff',
    textSecondary: '#9090b0',
    textMuted: '#606080',
    textSubtle: '#404060',
    
    border: 'rgba(255, 0, 255, 0.1)',
    borderHover: 'rgba(255, 0, 255, 0.4)',
    borderStrong: 'rgba(255, 0, 255, 0.2)',
    
    gradientPrimary: 'linear-gradient(135deg, #ff66ff 0%, #ff00ff 50%, #cc00cc 100%)',
    gradientBg: `radial-gradient(ellipse at 20% 0%, rgba(255, 0, 255, 0.05) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 100%, rgba(0, 255, 255, 0.03) 0%, transparent 40%),
                 #0a0a0f`,
  },
};

// Nordic Frost - Minimalist winter
const nordicFrost: Theme = {
  id: 'nordic-frost',
  name: 'Nordic Frost',
  description: 'Clean ice blues with aurora accents',
  icon: '❄️',
  colors: {
    bg: '#0d1117',
    bgElevated: '#161b22',
    bgCard: '#21262d',
    bgHover: '#2d333b',
    
    primary: '#58a6ff',
    primaryLight: '#79c0ff',
    primaryDark: '#388bfd',
    primaryMuted: 'rgba(88, 166, 255, 0.15)',
    primaryGlow: 'rgba(88, 166, 255, 0.4)',
    
    opening: '#f85149',
    openingBg: 'rgba(248, 81, 73, 0.15)',
    openingGlow: 'rgba(248, 81, 73, 0.3)',
    core: '#3fb950',
    coreBg: 'rgba(63, 185, 80, 0.15)',
    coreGlow: 'rgba(63, 185, 80, 0.3)',
    closing: '#a371f7',
    closingBg: 'rgba(163, 113, 247, 0.15)',
    closingGlow: 'rgba(163, 113, 247, 0.3)',
    
    sync: '#56d364',
    syncBg: 'rgba(86, 211, 100, 0.15)',
    true: '#ffa657',
    trueBg: 'rgba(255, 166, 87, 0.15)',
    
    text: '#c9d1d9',
    textSecondary: '#8b949e',
    textMuted: '#6e7681',
    textSubtle: '#484f58',
    
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(88, 166, 255, 0.4)',
    borderStrong: 'rgba(255, 255, 255, 0.2)',
    
    gradientPrimary: 'linear-gradient(135deg, #79c0ff 0%, #58a6ff 50%, #388bfd 100%)',
    gradientBg: `radial-gradient(ellipse at 20% 0%, rgba(88, 166, 255, 0.05) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 100%, rgba(163, 113, 247, 0.03) 0%, transparent 40%),
                 #0d1117`,
  },
};

// Solar Flare - Cosmic fire
const solarFlare: Theme = {
  id: 'solar-flare',
  name: 'Solar Flare',
  description: 'Burning cosmic energy with intense warmth',
  icon: '☀️',
  colors: {
    bg: '#0f0805',
    bgElevated: '#1a0f0a',
    bgCard: '#25160f',
    bgHover: '#301d14',
    
    primary: '#ff6b35',
    primaryLight: '#ff9f70',
    primaryDark: '#e55a2b',
    primaryMuted: 'rgba(255, 107, 53, 0.15)',
    primaryGlow: 'rgba(255, 107, 53, 0.5)',
    
    opening: '#ff3d00',
    openingBg: 'rgba(255, 61, 0, 0.2)',
    openingGlow: 'rgba(255, 61, 0, 0.4)',
    core: '#ffab00',
    coreBg: 'rgba(255, 171, 0, 0.2)',
    coreGlow: 'rgba(255, 171, 0, 0.4)',
    closing: '#ff006e',
    closingBg: 'rgba(255, 0, 110, 0.2)',
    closingGlow: 'rgba(255, 0, 110, 0.4)',
    
    sync: '#ffd700',
    syncBg: 'rgba(255, 215, 0, 0.2)',
    true: '#ff4500',
    trueBg: 'rgba(255, 69, 0, 0.2)',
    
    text: '#fff5f0',
    textSecondary: '#ffb399',
    textMuted: '#cc7a5c',
    textSubtle: '#995c45',
    
    border: 'rgba(255, 107, 53, 0.15)',
    borderHover: 'rgba(255, 107, 53, 0.5)',
    borderStrong: 'rgba(255, 107, 53, 0.25)',
    
    gradientPrimary: 'linear-gradient(135deg, #ff9f70 0%, #ff6b35 50%, #e55a2b 100%)',
    gradientBg: `radial-gradient(ellipse at 20% 0%, rgba(255, 107, 53, 0.08) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 100%, rgba(255, 0, 110, 0.05) 0%, transparent 40%),
                 #0f0805`,
  },
};

// Void Walker - Dark mystic
const voidWalker: Theme = {
  id: 'void-walker',
  name: 'Void Walker',
  description: 'Eldritch darkness with ethereal accents',
  icon: '🌑',
  colors: {
    bg: '#050508',
    bgElevated: '#0a0a10',
    bgCard: '#101018',
    bgHover: '#181825',
    
    primary: '#b8a1e0',
    primaryLight: '#d4c4f0',
    primaryDark: '#9a7fd0',
    primaryMuted: 'rgba(184, 161, 224, 0.15)',
    primaryGlow: 'rgba(184, 161, 224, 0.5)',
    
    opening: '#ff4d6d',
    openingBg: 'rgba(255, 77, 109, 0.15)',
    openingGlow: 'rgba(255, 77, 109, 0.4)',
    core: '#00f5d4',
    coreBg: 'rgba(0, 245, 212, 0.15)',
    coreGlow: 'rgba(0, 245, 212, 0.4)',
    closing: '#9b5de5',
    closingBg: 'rgba(155, 93, 229, 0.15)',
    closingGlow: 'rgba(155, 93, 229, 0.4)',
    
    sync: '#00bbf9',
    syncBg: 'rgba(0, 187, 249, 0.15)',
    true: '#f15bb5',
    trueBg: 'rgba(241, 91, 181, 0.15)',
    
    text: '#e6e6f0',
    textSecondary: '#a0a0b8',
    textMuted: '#707090',
    textSubtle: '#505070',
    
    border: 'rgba(184, 161, 224, 0.1)',
    borderHover: 'rgba(184, 161, 224, 0.4)',
    borderStrong: 'rgba(184, 161, 224, 0.2)',
    
    gradientPrimary: 'linear-gradient(135deg, #d4c4f0 0%, #b8a1e0 50%, #9a7fd0 100%)',
    gradientBg: `radial-gradient(ellipse at 20% 0%, rgba(184, 161, 224, 0.05) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 100%, rgba(155, 93, 229, 0.03) 0%, transparent 40%),
                 #050508`,
  },
};

// Nature Spirit - Earth organic
const natureSpirit: Theme = {
  id: 'nature-spirit',
  name: 'Nature Spirit',
  description: 'Organic earth tones with living energy',
  icon: '🌿',
  colors: {
    bg: '#0a0f0a',
    bgElevated: '#111a11',
    bgCard: '#1a251a',
    bgHover: '#243024',
    
    primary: '#7cb342',
    primaryLight: '#9ccc65',
    primaryDark: '#558b2f',
    primaryMuted: 'rgba(124, 179, 66, 0.15)',
    primaryGlow: 'rgba(124, 179, 66, 0.4)',
    
    opening: '#e53935',
    openingBg: 'rgba(229, 57, 53, 0.15)',
    openingGlow: 'rgba(229, 57, 53, 0.3)',
    core: '#43a047',
    coreBg: 'rgba(67, 160, 71, 0.15)',
    coreGlow: 'rgba(67, 160, 71, 0.3)',
    closing: '#7e57c2',
    closingBg: 'rgba(126, 87, 194, 0.15)',
    closingGlow: 'rgba(126, 87, 194, 0.3)',
    
    sync: '#29b6f6',
    syncBg: 'rgba(41, 182, 246, 0.15)',
    true: '#ffa726',
    trueBg: 'rgba(255, 167, 38, 0.15)',
    
    text: '#f1f8e9',
    textSecondary: '#aed581',
    textMuted: '#7cb342',
    textSubtle: '#558b2f',
    
    border: 'rgba(124, 179, 66, 0.15)',
    borderHover: 'rgba(124, 179, 66, 0.5)',
    borderStrong: 'rgba(124, 179, 66, 0.25)',
    
    gradientPrimary: 'linear-gradient(135deg, #9ccc65 0%, #7cb342 50%, #558b2f 100%)',
    gradientBg: `radial-gradient(ellipse at 20% 0%, rgba(124, 179, 66, 0.06) 0%, transparent 50%),
                 radial-gradient(ellipse at 80% 100%, rgba(126, 87, 194, 0.03) 0%, transparent 40%),
                 #0a0f0a`,
  },
};

export const THEMES: Record<ThemeId, Theme> = {
  'egyptian-gold': egyptianGold,
  'cyberpunk-neon': cyberpunkNeon,
  'nordic-frost': nordicFrost,
  'solar-flare': solarFlare,
  'void-walker': voidWalker,
  'nature-spirit': natureSpirit,
};

export const DEFAULT_THEME: ThemeId = 'egyptian-gold';

export const THEME_LIST: Theme[] = Object.values(THEMES);

// ============================================================================
// Font Themes - 6 Epic Font Combinations
// ============================================================================

const elegantFonts: FontTheme = {
  id: 'elegant',
  name: 'Elegant',
  description: 'Classic serif elegance',
  icon: '✒️',
  fonts: {
    display: "'Cinzel', 'Playfair Display', Georgia, serif",
    heading: "'Cinzel', serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },
};

const modernFonts: FontTheme = {
  id: 'modern',
  name: 'Modern',
  description: 'Clean geometric sans',
  icon: '◼️',
  fonts: {
    display: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', ui-monospace, monospace",
  },
};

const ancientFonts: FontTheme = {
  id: 'ancient',
  name: 'Ancient',
  description: 'Mystical runic style',
  icon: 'ᚱ',
  fonts: {
    display: "'Cinzel Decorative', 'Cinzel', serif",
    heading: "'Cinzel', serif",
    body: "'EB Garamond', Georgia, serif",
    mono: "'Cousine', ui-monospace, monospace",
  },
};

const futuristicFonts: FontTheme = {
  id: 'futuristic',
  name: 'Futuristic',
  description: 'Tech mono aesthetics',
  icon: '◈',
  fonts: {
    display: "'Orbitron', 'Rajdhani', sans-serif",
    heading: "'Rajdhani', sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'Share Tech Mono', 'JetBrains Mono', monospace",
  },
};

const naturalFonts: FontTheme = {
  id: 'natural',
  name: 'Natural',
  description: 'Organic handwritten feel',
  icon: '🍃',
  fonts: {
    display: "'Cinzel', serif",
    heading: "'Cinzel', serif",
    body: "'Nunito', 'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
};

const minimalistFonts: FontTheme = {
  id: 'minimalist',
  name: 'Minimalist',
  description: 'Ultra clean and simple',
  icon: '▪️',
  fonts: {
    display: "'Inter', system-ui, sans-serif",
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'SF Mono', ui-monospace, monospace",
  },
};

export const FONTS: Record<FontId, FontTheme> = {
  'elegant': elegantFonts,
  'modern': modernFonts,
  'ancient': ancientFonts,
  'futuristic': futuristicFonts,
  'natural': naturalFonts,
  'minimalist': minimalistFonts,
};

export const DEFAULT_FONT: FontId = 'elegant';

export const FONT_LIST: FontTheme[] = Object.values(FONTS);

// ============================================================================
// Sacred Geometry Patterns — Header & Background
// ============================================================================

export type GeometryPattern =
  | 'flower-of-life'
  | 'seed-of-life'
  | 'metatrons-cube'
  | 'sri-yantra'
  | 'merkaba'
  | 'fruit-of-life'
  | 'golden-spiral'
  | 'none';

export type BackgroundGeometryPattern =
  | 'hex-flower-grid'
  | 'metatrons-lattice'
  | 'sri-yantra-mandala'
  | 'torus-field'
  | 'tree-of-life'
  | 'vesica-wave'
  | 'phyllotaxis-field'
  | 'none';

export interface GeometryOption {
  id: GeometryPattern;
  name: string;
  icon: string;
}

export interface BackgroundGeometryOption {
  id: BackgroundGeometryPattern;
  name: string;
  icon: string;
}

export const HEADER_GEOMETRIES: GeometryOption[] = [
  { id: 'flower-of-life', name: 'Flower of Life', icon: '🌸' },
  { id: 'seed-of-life', name: 'Seed of Life', icon: '🌱' },
  { id: 'metatrons-cube', name: "Metatron's Cube", icon: '◈' },
  { id: 'sri-yantra', name: 'Sri Yantra', icon: '🔺' },
  { id: 'merkaba', name: 'Merkaba', icon: '✡' },
  { id: 'fruit-of-life', name: 'Fruit of Life', icon: '🍇' },
  { id: 'golden-spiral', name: 'Golden Spiral', icon: '🌀' },
  { id: 'none', name: 'None', icon: '⛔' },
];

export const BACKGROUND_GEOMETRIES: BackgroundGeometryOption[] = [
  { id: 'hex-flower-grid', name: 'Hex Flower Grid', icon: '🌸' },
  { id: 'metatrons-lattice', name: "Metatron's Lattice", icon: '◈' },
  { id: 'sri-yantra-mandala', name: 'Sri Yantra Mandala', icon: '🔺' },
  { id: 'torus-field', name: 'Torus Field', icon: '〰' },
  { id: 'tree-of-life', name: 'Tree of Life', icon: '🌳' },
  { id: 'vesica-wave', name: 'Vesica Wave', icon: '🌊' },
  { id: 'phyllotaxis-field', name: 'Phyllotaxis Field', icon: '🌻' },
  { id: 'none', name: 'None', icon: '⛔' },
];
