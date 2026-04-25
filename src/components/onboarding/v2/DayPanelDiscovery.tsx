/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DAY PANEL DISCOVERY — First tap on a calendar day
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer, PulseRing } from './MotionContainer';
import { } from './OnboardingIcons';
import './onboardingAnimations.css';

export const DayPanelDiscovery: React.FC = () => {
  const { goNext, markInteraction, getInterpolatedCopy } = useOnboarding();

  const handleTap = () => {
    markInteraction('gridInteracted');
    goNext();
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
          radial-gradient(ellipse at 50% 50%, rgba(124, 58, 237, 0.05) 0%, transparent 60%),
          #05040a
        `,
        zIndex: 9998,
        padding: 24,
      }}
    >
      <MotionContainer delay={0}>
        <h1
          style={{
            fontSize: 'clamp(24px, 4vw, 34px)',
            fontWeight: 700,
            color: '#f5f3ff',
            textAlign: 'center',
            margin: '0 0 12px 0',
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          }}
        >
          {getInterpolatedCopy('daypanel.heading')}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: '#a89bc8',
            textAlign: 'center',
            margin: '0 0 48px 0',
            maxWidth: 360,
            lineHeight: 1.5,
          }}
        >
          {getInterpolatedCopy('daypanel.subheading')}
        </p>
      </MotionContainer>

      {/* Demo day cell */}
      <MotionContainer delay={300}>
        <PulseRing active color="rgba(201, 162, 39, 0.3)">
          <button
            onClick={handleTap}
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              border: '2px solid rgba(201, 162, 39, 0.3)',
              background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1), rgba(201, 162, 39, 0.03))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              gap: 4,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.08)';
              e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.5)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(201, 162, 39, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(201, 162, 39, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: 11, color: '#6b5b8a' }}>FRI</span>
            <span style={{ fontSize: 24, fontWeight: 700, color: '#f5f3ff' }}>14</span>
          </button>
        </PulseRing>
      </MotionContainer>

      <MotionContainer delay={500}>
        <p
          style={{
            marginTop: 32,
            fontSize: 13,
            color: '#6b5b8a',
            textAlign: 'center',
          }}
        >
          {getInterpolatedCopy('daypanel.hint')}
        </p>
      </MotionContainer>
    </div>
  );
};
