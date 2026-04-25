/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COVENANT SCREEN — The final personalized dashboard
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { eventBus } from '../../../services/eventBus';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconCrown, IconArrowRight, IconMoon, IconSun } from './OnboardingIcons';
import { getTodayHekaDate, calculateMoonPhase, HEKA_MONTHS, getTimeMode } from '../../../services/calendarService';
import './onboardingAnimations.css';

export const CovenantScreen: React.FC = () => {
  const { complete, getInterpolatedCopy, state } = useOnboarding();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const today = getTodayHekaDate();
  const moonPhase = calculateMoonPhase(new Date());
  const name = state.personalization.name || 'Timekeeper';

  const monthNames = HEKA_MONTHS.map(m => m.name);

  const hekaDateStr = `${monthNames[today.month]} ${today.day}, ${today.year}`;

  const handleBegin = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => complete(), 600);
  };

  const handleStory = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    // Dispatch event to open info modal after completion
    setTimeout(() => {
      complete();
      setTimeout(() => {
        eventBus.emit('heka-open-info', undefined);
      }, 400);
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse at 50% 30%, rgba(201, 162, 39, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 70%, rgba(124, 58, 237, 0.06) 0%, transparent 50%),
          #05040a
        `,
        zIndex: 9998,
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        {/* Crown */}
        <MotionContainer delay={0}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              animation: 'im-glow-pulse 3s ease-in-out infinite',
            }}
          >
            <IconCrown size={56} color="#c9a227" />
          </div>
        </MotionContainer>

        {/* Heading */}
        <MotionContainer delay={200}>
          <h1
            style={{
              fontSize: 'clamp(24px, 5vw, 36px)',
              fontWeight: 700,
              color: '#f5f3ff',
              margin: '0 0 16px 0',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            }}
          >
            {interpolateCopy(getInterpolatedCopy('covenant.heading'), { name })}
          </h1>
        </MotionContainer>

        {/* Dashboard preview */}
        <MotionContainer delay={400}>
          <div
            style={{
              padding: '24px 28px',
              borderRadius: 20,
              border: '1px solid rgba(201, 162, 39, 0.15)',
              background: 'rgba(12, 10, 20, 0.8)',
              backdropFilter: 'blur(12px)',
              marginBottom: 32,
              textAlign: 'left',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#c9a227',
                marginBottom: 12,
              }}
            >
              Today
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#f5f3ff',
                marginBottom: 16,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              {hekaDateStr}
            </div>
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <DashboardPill
                icon={<IconMoon size={14} color="#c0c0d0" />}
                label={moonPhase}
              />
              <DashboardPill
                icon={<IconSun size={14} color="#c9a227" />}
                label={`${getTimeMode()} Mode`}
              />
            </div>
          </div>
        </MotionContainer>

        {/* CTAs */}
        <MotionContainer delay={600}>
          <button
            onClick={handleBegin}
            style={{
              width: '100%',
              padding: '18px 28px',
              borderRadius: 16,
              border: 'none',
              background: 'linear-gradient(135deg, #c9a227, #b8941f)',
              color: '#05040a',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: 16,
              transition: 'all 0.25s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {getInterpolatedCopy('covenant.cta.begin')}
            <IconArrowRight size={20} color="#05040a" />
          </button>

          <button
            onClick={handleStory}
            style={{
              width: '100%',
              padding: '14px 28px',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent',
              color: '#6b5b8a',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = '#a89bc8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#6b5b8a';
            }}
          >
            {getInterpolatedCopy('covenant.cta.story')}
          </button>
        </MotionContainer>
      </div>
    </div>
  );
};

// ─── Dashboard Pill ───
const DashboardPill: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      borderRadius: 999,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
  >
    {icon}
    <span style={{ fontSize: 12, color: '#a89bc8' }}>{label}</span>
  </div>
);

function interpolateCopy(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const val = values[key];
    return val !== undefined && val !== '' ? val : match;
  });
}
