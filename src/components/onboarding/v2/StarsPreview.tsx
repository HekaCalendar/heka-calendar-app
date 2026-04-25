/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STARS PREVIEW — Birth chart wheel with highlighted sign
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';

import './onboardingAnimations.css';

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', start: 80 },
  { name: 'Taurus', symbol: '♉', start: 110 },
  { name: 'Gemini', symbol: '♊', start: 140 },
  { name: 'Cancer', symbol: '♋', start: 170 },
  { name: 'Leo', symbol: '♌', start: 200 },
  { name: 'Virgo', symbol: '♍', start: 230 },
  { name: 'Libra', symbol: '♎', start: 260 },
  { name: 'Scorpio', symbol: '♏', start: 290 },
  { name: 'Sagittarius', symbol: '♐', start: 320 },
  { name: 'Capricorn', symbol: '♑', start: 350 },
  { name: 'Aquarius', symbol: '♒', start: 20 },
  { name: 'Pisces', symbol: '♓', start: 50 },
];

function getSunSignIndexFromDate(dateStr: string): number {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 0;
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 1;
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 2;
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 3;
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 4;
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 5;
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 6;
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 7;
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 8;
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 9;
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 10;
  return 11; // Pisces
}

export const StarsPreview: React.FC = () => {
  const { goNext, getInterpolatedCopy, state } = useOnboarding();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const birthDate = state.personalization.birthDate;
  const highlightedSign = birthDate ? getSunSignIndexFromDate(birthDate) : 0;

  const handleContinue = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => goNext(), 400);
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
          radial-gradient(ellipse at 50% 50%, rgba(124, 58, 237, 0.06) 0%, transparent 60%),
          #05040a
        `,
        zIndex: 9998,
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        <MotionContainer delay={0}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 'clamp(22px, 4vw, 30px)',
                fontWeight: 700,
                color: '#f5f3ff',
                margin: '0 0 8px 0',
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              }}
            >
              {getInterpolatedCopy('stars.heading')}
            </h1>
            <p style={{ fontSize: 14, color: '#a89bc8', margin: 0, lineHeight: 1.5 }}>
              {getInterpolatedCopy('stars.subheading')}
            </p>
          </div>
        </MotionContainer>

        {/* Birth Chart Wheel */}
        <MotionContainer delay={250}>
          <div
            style={{
              position: 'relative',
              width: 260,
              height: 260,
              margin: '0 auto 32px',
            }}
          >
            {/* Outer ring */}
            <svg
              width={260}
              height={260}
              viewBox="0 0 260 260"
              style={{ animation: 'im-rotate-slow 60s linear infinite' }}
            >
              <circle cx="130" cy="130" r="120" fill="none" stroke="rgba(201, 162, 39, 0.1)" strokeWidth="1" />
              <circle cx="130" cy="130" r="90" fill="none" stroke="rgba(201, 162, 39, 0.15)" strokeWidth="1" />
              <circle cx="130" cy="130" r="60" fill="none" stroke="rgba(201, 162, 39, 0.1)" strokeWidth="1" />
              {/* Zodiac divisions */}
              {ZODIAC_SIGNS.map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x1 = 130 + Math.cos(angle) * 90;
                const y1 = 130 + Math.sin(angle) * 90;
                const x2 = 130 + Math.cos(angle) * 120;
                const y2 = 130 + Math.sin(angle) * 120;
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(201, 162, 39, 0.1)" strokeWidth="1" />
                );
              })}
              {/* Sign labels */}
              {ZODIAC_SIGNS.map((sign, i) => {
                const angle = (i * 30 - 75) * (Math.PI / 180);
                const x = 130 + Math.cos(angle) * 105;
                const y = 130 + Math.sin(angle) * 105;
                return (
                  <text
                    key={sign.name}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={i === highlightedSign ? '#c9a227' : 'rgba(168, 155, 200, 0.4)'}
                    fontSize="10"
                    fontWeight={i === highlightedSign ? 600 : 400}
                  >
                    {sign.symbol}
                  </text>
                );
              })}
            </svg>

            {/* Center sun */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #e8c84a, #c9a227)',
                boxShadow: '0 0 30px rgba(201, 162, 39, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 18 }}>☉</span>
            </div>

            {/* Highlighted sign marker */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#c9a227',
                transform: `translate(-50%, -50%) rotate(${highlightedSign * 30}deg) translateY(-105px)`,
                boxShadow: '0 0 8px #c9a227',
              }}
            />
          </div>
        </MotionContainer>

        {/* Feature bullets */}
        <MotionContainer delay={500} staggerChildren={100}>
          {[
            'Natal Birth Chart',
            'Planetary Transits',
            'Compatibility Analysis',
            'Planetary Hours',
          ].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.02)',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#c9a227',
                }}
              />
              <span style={{ fontSize: 14, color: '#c0c0d0' }}>{feature}</span>
            </div>
          ))}
        </MotionContainer>

        <MotionContainer delay={800}>
          <button
            onClick={handleContinue}
            style={{
              marginTop: 24,
              width: '100%',
              padding: '16px 24px',
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(135deg, #c9a227, #b8941f)',
              color: '#05040a',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
          >
            Continue
          </button>
        </MotionContainer>
      </div>
    </div>
  );
};
