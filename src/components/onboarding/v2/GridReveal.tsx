/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GRID REVEAL — Animated formation of the 13-month calendar
 * Honest about March having 29 days (30 in leap years)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { getTodayHekaDate } from '../../../services/calendarService';
import './onboardingAnimations.css';

const MONTHS = [
  { name: 'April', days: 28, arc: 'opening' as const },
  { name: 'May', days: 28, arc: 'core' as const },
  { name: 'June', days: 28, arc: 'core' as const },
  { name: 'July', days: 28, arc: 'core' as const },
  { name: 'August', days: 28, arc: 'core' as const },
  { name: 'Hexa', days: 28, arc: 'core' as const },
  { name: 'September', days: 28, arc: 'core' as const },
  { name: 'October', days: 28, arc: 'core' as const },
  { name: 'November', days: 28, arc: 'core' as const },
  { name: 'December', days: 28, arc: 'core' as const },
  { name: 'January', days: 28, arc: 'closing' as const },
  { name: 'February', days: 28, arc: 'closing' as const },
  { name: 'March', days: 29, arc: 'closing' as const, note: '30 in leap years' },
];

const ARC_COLORS = {
  opening: { bg: 'rgba(194, 59, 34, 0.12)', border: 'rgba(194, 59, 34, 0.3)', text: '#e07a5f' },
  core: { bg: 'rgba(45, 138, 78, 0.12)', border: 'rgba(45, 138, 78, 0.3)', text: '#81b29a' },
  closing: { bg: 'rgba(124, 58, 237, 0.12)', border: 'rgba(124, 58, 237, 0.3)', text: '#a78bfa' },
};

export const GridReveal: React.FC = () => {
  const { goNext, markInteraction, getInterpolatedCopy } = useOnboarding();
  const [revealedMonths, setRevealedMonths] = useState(0);
  const today = useMemo(() => getTodayHekaDate(), []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i <= 12; i++) {
      timers.push(setTimeout(() => setRevealedMonths(i), 200 + i * 120));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleMonthTap = () => {
    markInteraction('gridInteracted');
    setTimeout(() => goNext(), 800);
  };

  return (
    <div className="im-screen">
      <div className="im-content">
        <MotionContainer delay={0}>
          <h1 className="im-title">{getInterpolatedCopy('grid.heading')}</h1>
          <p className="im-subtitle" style={{ marginBottom: 32 }}>
            Thirteen months. Twelve have 28 days. March, the closing month, has 29 days.
            30 in a leap year. All the correction lives in one place.
          </p>
        </MotionContainer>

        {/* Month Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
            width: '100%',
          }}
        >
          {MONTHS.map((month, index) => {
            const isRevealed = index < revealedMonths;
            const colors = ARC_COLORS[month.arc];
            const isTodayMonth = today.month === index;
            const isMarch = month.name === 'March';

            return (
              <button
                key={month.name}
                onClick={handleMonthTap}
                style={{
                  padding: '16px 6px',
                  borderRadius: 14,
                  border: `1.5px solid ${isTodayMonth ? '#c9a227' : isRevealed ? colors.border : 'rgba(255,255,255,0.04)'}`,
                  background: isRevealed
                    ? isTodayMonth
                      ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.15), rgba(201, 162, 39, 0.05))'
                      : colors.bg
                    : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  opacity: isRevealed ? 1 : 0,
                  transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                  transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 80}ms`,
                  outline: 'none',
                  position: 'relative',
                  boxShadow: isTodayMonth && isRevealed ? '0 0 20px rgba(201, 162, 39, 0.15)' : 'none',
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: isTodayMonth ? '#c9a227' : colors.text }}>
                  {index + 1}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: isTodayMonth ? '#f5f3ff' : '#c0c0d0' }}>
                  {month.name}
                </span>
                <span style={{ fontSize: 9, color: isMarch ? '#a78bfa' : '#6b5b8a', fontWeight: isMarch ? 600 : 400 }}>
                  {isMarch ? '29 days' : '28 days'}
                </span>
                {isTodayMonth && isRevealed && (
                  <div
                    style={{
                      position: 'absolute', top: 6, right: 6,
                      width: 6, height: 6, borderRadius: '50%',
                      background: '#c9a227',
                      boxShadow: '0 0 8px rgba(201, 162, 39, 0.6)',
                      animation: 'im-date-pulse 2s ease-in-out infinite',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Arc legend */}
        <MotionContainer delay={1800}>
          <div style={{ display: 'flex', gap: 20, marginTop: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { label: 'Opening', color: '#e07a5f' },
              { label: 'Core', color: '#81b29a' },
              { label: 'Closing', color: '#a78bfa' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 3, background: item.color }} />
                <span style={{ fontSize: 11, color: '#a89bc8' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </MotionContainer>
      </div>
    </div>
  );
};
