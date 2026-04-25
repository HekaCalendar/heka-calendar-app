/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ORACLE PREVIEW — Redesigned: visual, styled, human. Not a plain text box.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconOracle } from './OnboardingIcons';
import './onboardingAnimations.css';

const AI_MESSAGES = [
  { text: 'The moon enters Scorpio tonight.', type: 'transit', color: '#7c3aed' },
  { text: 'Deep work is favored under this sky.', type: 'insight', color: '#c9a227' },
  { text: 'Three threads await you. Shall I find the hour that favors each one?', type: 'action', color: '#2d8a4e' },
];

export const OraclePreview: React.FC = () => {
  const { goNext, getInterpolatedCopy } = useOnboarding();
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    AI_MESSAGES.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleMessages((prev) => [...prev, i]);
      }, 600 + i * 900));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleContinue = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => goNext(), 400);
  };

  return (
    <div className="im-screen">
      <div style={{ width: '100%', maxWidth: 440 }}>
        <MotionContainer delay={0}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(201, 162, 39, 0.08))',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                animation: 'im-breathe 4s ease-in-out infinite',
                boxShadow: '0 0 40px rgba(124, 58, 237, 0.1)',
              }}
            >
              <IconOracle size={40} color="#a78bfa" />
            </div>
            <span
              style={{
                display: 'inline-block',
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                color: '#a78bfa',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                padding: '4px 10px',
                borderRadius: 999,
                marginBottom: 12,
              }}
            >
              Preview
            </span>
            <h1 className="im-title">{getInterpolatedCopy('oracle.heading')}</h1>
            <p className="im-subtitle" style={{ margin: '8px auto 0' }}>
              {getInterpolatedCopy('oracle.subheading')}
            </p>
          </div>
        </MotionContainer>

        {/* Chat interface */}
        <MotionContainer delay={300}>
          <div
            style={{
              padding: '20px 16px',
              borderRadius: 24,
              background: 'rgba(12, 10, 20, 0.6)',
              border: '1px solid rgba(124, 58, 237, 0.1)',
              backdropFilter: 'blur(12px)',
              marginBottom: 28,
            }}
          >
            {/* AI header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '0 8px' }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #c9a227)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 14 }}>✦</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f3ff' }}>HEKA AI</div>
                <div style={{ fontSize: 10, color: '#2d8a4e', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2d8a4e', boxShadow: '0 0 4px #2d8a4e' }} />
                  Online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AI_MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    opacity: visibleMessages.includes(i) ? 1 : 0,
                    transform: visibleMessages.includes(i) ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: `${msg.color}18`,
                        border: `1px solid ${msg.color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        fontSize: 10,
                      }}
                    >
                      {msg.type === 'transit' ? '🌙' : msg.type === 'insight' ? '✨' : '⚡'}
                    </div>
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 16,
                        borderBottomLeftRadius: 4,
                        background: `${msg.color}10`,
                        border: `1px solid ${msg.color}20`,
                        color: '#c0c0d0',
                        fontSize: 13,
                        lineHeight: 1.5,
                        maxWidth: 'calc(100% - 40px)',
                      }}
                    >
                      {msg.text}
                      {visibleMessages.includes(i) && i === AI_MESSAGES.length - 1 && (
                        <span
                          style={{
                            display: 'inline-block',
                            width: 2, height: 14,
                            background: '#c9a227',
                            marginLeft: 4,
                            verticalAlign: 'middle',
                            animation: 'im-star-twinkle 0.8s ease-in-out infinite',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionContainer>

        {/* Feature pills */}
        <MotionContainer delay={800}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {[
              { label: 'Transits', color: '#7c3aed' },
              { label: 'Mood', color: '#ec4899' },
              { label: 'Tasks', color: '#2d8a4e' },
              { label: 'Journal', color: '#3b82f6' },
            ].map((feature) => (
              <div
                key={feature.label}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  background: `${feature.color}10`,
                  border: `1px solid ${feature.color}20`,
                  fontSize: 12,
                  color: feature.color,
                  fontWeight: 500,
                }}
              >
                {feature.label}
              </div>
            ))}
          </div>
        </MotionContainer>

        <MotionContainer delay={1000}>
          <button onClick={handleContinue} className="im-btn-primary" style={{ marginTop: 24 }}>
            Continue
          </button>
        </MotionContainer>
      </div>
    </div>
  );
};
