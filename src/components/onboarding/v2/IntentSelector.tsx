/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INTENT SELECTOR — The branching gate. 3 cinematic cards. No emojis.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconMoon, IconSun, IconStars } from './OnboardingIcons';
import type { UserIntent } from '../../../types/onboardingV2';
import { INTENT_LABELS } from '../../../types/onboardingV2';
import './onboardingAnimations.css';

const INTENTS: { id: UserIntent; icon: React.FC<{ size?: number; color?: string }>; gradient: string; glow: string }[] = [
  {
    id: 'feel',
    icon: IconMoon,
    gradient: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(12, 10, 20, 0.9) 100%)',
    glow: 'rgba(124, 58, 237, 0.3)',
  },
  {
    id: 'work',
    icon: IconSun,
    gradient: 'linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(12, 10, 20, 0.9) 100%)',
    glow: 'rgba(201, 162, 39, 0.3)',
  },
  {
    id: 'stars',
    icon: IconStars,
    gradient: 'linear-gradient(135deg, rgba(201, 162, 39, 0.1) 0%, rgba(124, 58, 237, 0.1) 50%, rgba(12, 10, 20, 0.9) 100%)',
    glow: 'rgba(201, 162, 39, 0.2)',
  },
];

export const IntentSelector: React.FC = () => {
  const { goNext, setIntent, skip, getInterpolatedCopy } = useOnboarding();
  const [selectedIntent, setSelectedIntent] = useState<UserIntent | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (intent: UserIntent) => {
    if (isTransitioning) return;
    setSelectedIntent(intent);
    setIntent(intent);
    setIsTransitioning(true);
    setTimeout(() => goNext(), 600);
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
          radial-gradient(ellipse at 20% 30%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(201, 162, 39, 0.06) 0%, transparent 50%),
          #05040a
        `,
        zIndex: 9998,
        padding: 24,
        overflow: 'auto',
      }}
    >
      {/* Heading */}
      <MotionContainer delay={0} staggerChildren={100}>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 40px)',
            fontWeight: 700,
            color: '#f5f3ff',
            textAlign: 'center',
            margin: '0 0 12px 0',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
          }}
        >
          {getInterpolatedCopy('intent.heading')}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: '#a89bc8',
            textAlign: 'center',
            margin: '0 0 48px 0',
            maxWidth: 400,
            lineHeight: 1.5,
          }}
        >
          {getInterpolatedCopy('intent.subheading')}
        </p>
      </MotionContainer>

      {/* Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {INTENTS.map((item, index) => {
          const isSelected = selectedIntent === item.id;
          const Icon = item.icon;
          const label = INTENT_LABELS[item.id];

          return (
            <MotionContainer key={item.id} delay={200 + index * 150}>
              <button
                onClick={() => handleSelect(item.id)}
                disabled={isTransitioning}
                style={{
                  width: '100%',
                  padding: '24px 28px',
                  borderRadius: 20,
                  border: `1.5px solid ${isSelected ? item.glow : 'rgba(255,255,255,0.06)'}`,
                  background: item.gradient,
                  cursor: isTransitioning ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  textAlign: 'left',
                  transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected
                    ? `0 8px 32px ${item.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`
                    : '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)',
                  opacity: selectedIntent && !isSelected ? 0.4 : 1,
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isTransitioning && !selectedIntent) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.borderColor = item.glow;
                    e.currentTarget.style.boxShadow = `0 8px 32px ${item.glow}`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                  }
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    flexShrink: 0,
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <Icon size={32} color={item.id === 'feel' ? '#a78bfa' : item.id === 'work' ? '#c9a227' : '#c9a227'} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: '#f5f3ff',
                      marginBottom: 4,
                      letterSpacing: '-0.2px',
                    }}
                  >
                    {label.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#a89bc8',
                      lineHeight: 1.4,
                    }}
                  >
                    {label.subtitle}
                  </div>
                </div>

                {/* Selection indicator */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#c9a227' : 'rgba(255,255,255,0.15)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: '#c9a227',
                        animation: 'im-scale-spring 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                      }}
                    />
                  )}
                </div>
              </button>
            </MotionContainer>
          );
        })}
      </div>

      {/* Skip */}
      <MotionContainer delay={800}>
        <button
          onClick={skip}
          style={{
            marginTop: 32,
            padding: '10px 24px',
            background: 'transparent',
            border: 'none',
            color: '#6b5b8a',
            fontSize: 13,
            cursor: 'pointer',
            letterSpacing: '0.3px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#a89bc8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#6b5b8a'; }}
        >
          Skip for now
        </button>
      </MotionContainer>
    </div>
  );
};
