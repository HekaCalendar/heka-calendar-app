/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SETUP ICONS — Celestial SVG icons replacing emojis in the SetupWizard
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
}

export const IconGlobe: React.FC<IconProps> = ({ size = 20, color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="4" ry="10" stroke={color} strokeWidth="1.5" />
    <path d="M2 12H22" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const IconLightning: React.FC<IconProps> = ({ size = 20, color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCalendar: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconMoon: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconScroll: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSparkle: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconHeartPulse: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 12H6L9 7L12 17L15 12H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCrescent: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPin: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const IconSunrise: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2V6M5 8L7.5 10.5M19 8L16.5 10.5M4 14H20M17 18H7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 10C14.2091 10 16 11.7909 16 14H8C8 11.7909 9.79086 10 12 10Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconLeaf: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 22V12M12 12C12 12 15 9 15 6M12 12C12 12 9 9 9 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconBell: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconHourglass: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 22H19M5 2H19M17 22V17L12 12L7 17V22M17 2V7L12 12L7 7V2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ size = 18, color = '#81b29a' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconX: React.FC<IconProps> = ({ size = 18, color = '#e07a5f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconRobot: React.FC<IconProps> = ({ size = 20, color = '#10a37f' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="8" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5" />
    <path d="M9 8V5H15V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="13" r="1.5" fill={color} />
    <circle cx="15" cy="13" r="1.5" fill={color} />
    <path d="M10 17H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconBrain: React.FC<IconProps> = ({ size = 20, color = '#d97757' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5C8 5 5 8 5 12C5 16 8 19 12 19C16 19 19 16 19 12C19 8 16 5 12 5Z" stroke={color} strokeWidth="1.5" />
    <path d="M12 5V19M5 12H19M7 7L17 17M17 7L7 17" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const IconHomeServer: React.FC<IconProps> = ({ size = 20, color = '#8b5cf6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 22V12H15V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconBook: React.FC<IconProps> = ({ size = 20, color = '#fbbf24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconEye: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
  </svg>
);

export const IconEyeOff: React.FC<IconProps> = ({ size = 18, color = '#a89bc8' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1 1L23 23" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconLink: React.FC<IconProps> = ({ size = 18, color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconInfo: React.FC<IconProps> = ({ size = 18, color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
    <path d="M12 16V12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill={color} />
  </svg>
);

export const IconArrowRight: React.FC<IconProps> = ({ size = 14, color = '#c9a227' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
