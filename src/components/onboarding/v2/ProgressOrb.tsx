/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PROGRESS ORB — Circular progress indicator with celestial aesthetic
 * Replaces the star-constellation progress bar.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useOnboarding } from './OnboardingEngine';

interface ProgressOrbProps {
  size?: number;
  strokeWidth?: number;
}

export const ProgressOrb: React.FC<ProgressOrbProps> = ({ size = 48, strokeWidth = 3 }) => {
  const { getProgressPercent } = useOnboarding();
  const percent = getProgressPercent();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="im-progress-orb"
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(201, 162, 39, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#c9a227"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </svg>
      {/* Center indicator */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.3,
          fontWeight: 600,
          color: '#c9a227',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        {percent}%
      </div>
    </div>
  );
};

// ─── Minimal progress dot for inline use ───
export const ProgressDots: React.FC<{ total: number; current: number }> = ({ total, current }) => {
  return (
    <div
      className="im-progress-dots"
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 10 : 6,
            height: i === current ? 10 : 6,
            borderRadius: '50%',
            background: i <= current ? '#c9a227' : 'rgba(201, 162, 39, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: i === current ? '0 0 8px rgba(201, 162, 39, 0.4)' : 'none',
          }}
        />
      ))}
    </div>
  );
};
