/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ONBOARDING ICONS — Custom SVG iconography (no emojis)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

export const IconMoon: React.FC<IconProps> = ({ size = 48, className = '', color = '#c0c0d0' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="20" fill={color} opacity="0.15" />
    <path
      d="M28 8C28 8 26 12 26 16C26 24 32 30 40 30C36 38 26 42 18 38C10 34 6 24 10 16C14 8 22 6 28 8Z"
      fill={color}
    />
    <circle cx="18" cy="20" r="2" fill={color} opacity="0.3" />
    <circle cx="22" cy="28" r="1.5" fill={color} opacity="0.2" />
  </svg>
);

export const IconSun: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="10" fill={color} />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 24 + Math.cos(rad) * 14;
      const y1 = 24 + Math.sin(rad) * 14;
      const x2 = 24 + Math.cos(rad) * 20;
      const y2 = 24 + Math.sin(rad) * 20;
      return (
        <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" />
      );
    })}
    <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="0.5" opacity="0.2" />
  </svg>
);

export const IconStars: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M24 4L27 18L41 21L27 24L24 38L21 24L7 21L21 18L24 4Z" fill={color} />
    <circle cx="12" cy="12" r="1.5" fill={color} opacity="0.6" />
    <circle cx="38" cy="10" r="1" fill={color} opacity="0.4" />
    <circle cx="10" cy="36" r="1" fill={color} opacity="0.5" />
    <circle cx="40" cy="38" r="1.5" fill={color} opacity="0.3" />
    <circle cx="24" cy="44" r="1" fill={color} opacity="0.4" />
  </svg>
);

export const IconCalendar: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="6" y="10" width="36" height="32" rx="4" stroke={color} strokeWidth="2" fill="none" />
    <line x1="6" y1="18" x2="42" y2="18" stroke={color} strokeWidth="2" />
    <line x1="16" y1="6" x2="16" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <line x1="32" y1="6" x2="32" y2="14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="18" cy="28" r="2" fill={color} opacity="0.6" />
    <circle cx="30" cy="28" r="2" fill={color} opacity="0.6" />
    <circle cx="24" cy="36" r="2" fill={color} opacity="0.6" />
  </svg>
);

export const IconGrid: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    {[0, 1, 2].map((row) =>
      [0, 1, 2, 3].map((col) => (
        <rect
          key={`${row}-${col}`}
          x={4 + col * 11}
          y={4 + row * 14}
          width="9"
          height="12"
          rx="2"
          stroke={color}
          strokeWidth="1"
          fill={row === 0 ? `${color}20` : 'none'}
          opacity={row === 0 ? 1 : 0.6}
        />
      ))
    )}
  </svg>
);

export const IconNote: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <rect x="8" y="6" width="32" height="36" rx="3" stroke={color} strokeWidth="2" fill="none" />
    <line x1="14" y1="16" x2="34" y2="16" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <line x1="14" y1="22" x2="30" y2="22" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <line x1="14" y1="28" x2="28" y2="28" stroke={color} strokeWidth="1.5" opacity="0.5" />
    <circle cx="34" cy="34" r="8" fill={color} />
    <path d="M31 34L33 36L37 32" stroke="#05040a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSync: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M8 24C8 15.163 15.163 8 24 8C28.5 8 32.5 9.8 35.5 12.7" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M40 24C40 32.837 32.837 40 24 40C19.5 40 15.5 38.2 12.5 35.3" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M35 8L35.5 12.7L30.8 13.2" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 40L12.5 35.3L17.2 34.8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconOracle: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="1.5" fill="none" opacity="0.3" />
    <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="24" cy="24" r="4" fill={color} />
    <path d="M24 2L24 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M24 40L24 46" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M2 24L8 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M40 24L46 24" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconBirthChart: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="1" fill="none" opacity="0.3" />
    <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
    <circle cx="24" cy="24" r="6" stroke={color} strokeWidth="1.5" fill="none" />
    <line x1="24" y1="4" x2="24" y2="44" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <line x1="4" y1="24" x2="44" y2="24" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <line x1="9.86" y1="9.86" x2="38.14" y2="38.14" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <line x1="38.14" y1="9.86" x2="9.86" y2="38.14" stroke={color} strokeWidth="0.5" opacity="0.4" />
    <circle cx="24" cy="10" r="2" fill={color} />
    <circle cx="34" cy="24" r="1.5" fill={color} opacity="0.7" />
    <circle cx="24" cy="36" r="1.5" fill={color} opacity="0.7" />
  </svg>
);

export const IconCircle: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="16" cy="24" r="10" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="32" cy="24" r="10" stroke={color} strokeWidth="1.5" fill="none" />
    <circle cx="24" cy="24" r="4" fill={color} />
    <path d="M22 16C22 16 24 12 24 10" stroke={color} strokeWidth="1" strokeLinecap="round" />
    <path d="M26 16C26 16 24 12 24 10" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ size = 24, className = '', color = '#2d8a4e' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="2" fill="none" />
    <path d="M7 12L10.5 15.5L17 9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconArrowRight: React.FC<IconProps> = ({ size = 24, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconArrowLeft: React.FC<IconProps> = ({ size = 24, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSparkle: React.FC<IconProps> = ({ size = 24, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill={color} />
  </svg>
);

export const IconCrown: React.FC<IconProps> = ({ size = 48, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M8 36L12 16L20 24L24 8L28 24L36 16L40 36H8Z" stroke={color} strokeWidth="2" fill={`${color}15`} strokeLinejoin="round" />
    <circle cx="12" cy="16" r="2" fill={color} />
    <circle cx="24" cy="8" r="2.5" fill={color} />
    <circle cx="36" cy="16" r="2" fill={color} />
  </svg>
);

export const IconLocation: React.FC<IconProps> = ({ size = 24, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke={color} strokeWidth="2" fill="none" />
    <circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="2" fill="none" />
  </svg>
);

export const IconClock: React.FC<IconProps> = ({ size = 24, className = '', color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill="none" />
    <path d="M12 6V12L16 14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
