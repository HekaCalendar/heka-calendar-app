/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * HEKA AI PREVIEW — The AI Coach: celestial intelligence, personalized guidance
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconArrowRight, IconOracle } from './OnboardingIcons';
import './onboardingAnimations.css';

const AI_MESSAGES = [
  { text: 'The moon enters Scorpio tonight.', delay: 0, type: 'transit' },
  { text: 'Deep work is favored. What will you transform?', delay: 800, type: 'prompt' },
  { text: 'You have 3 tasks pending under this moon.', delay: 1600, type: 'task' },
];

export const HeaiAIPreview: React.FC = () => {
  const { goNext } = useOnboarding();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    AI_MESSAGES.forEach((msg, i) => {
      timers.push(setTimeout(() => {
        setVisibleMessages((prev) => [...prev, i]);
      }, 600 + msg.delay));
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
      <div className="im-content">
        <MotionContainer delay={0}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12), rgba(201, 162, 39, 0.08))',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                animation: 'im-breathe 4s ease-in-out infinite',
              }}
            >
              <IconOracle size={32} color="#a78bfa" />
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
            <h1 className="im-title">HEKA AI</h1>
            <p className="im-subtitle">
              A celestial intelligence that knows your sky, your patterns, and your moment. It does not sleep. It does not guess.
            </p>
          </div>
        </MotionContainer>

        {/* AI conversation demo */}
        <MotionContainer delay={300}>
          <div
            style={{
              padding: '24px 20px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: 28,
              minHeight: 180,
            }}
          >
            {/* AI Avatar + orb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #c9a227)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 14 }}>✦</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa', letterSpacing: '0.5px' }}>
                HEKA AI
              </span>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#2d8a4e',
                  boxShadow: '0 0 6px #2d8a4e',
                }}
              />
            </div>

            {/* Messages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AI_MESSAGES.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    opacity: visibleMessages.includes(i) ? 1 : 0,
                    transform: visibleMessages.includes(i) ? 'translateY(0)' : 'translateY(8px)',
                    transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '10px 16px',
                      borderRadius: 14,
                      borderTopLeftRadius: 4,
                      background:
                        msg.type === 'transit'
                          ? 'rgba(124, 58, 237, 0.08)'
                          : msg.type === 'task'
                            ? 'rgba(201, 162, 39, 0.08)'
                            : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${
                        msg.type === 'transit'
                          ? 'rgba(124, 58, 237, 0.15)'
                          : msg.type === 'task'
                            ? 'rgba(201, 162, 39, 0.15)'
                            : 'rgba(255,255,255,0.06)'
                      }`,
                      color: '#c0c0d0',
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {msg.text}
                    {visibleMessages.includes(i) && i === AI_MESSAGES.length - 1 && (
                      <span
                        style={{
                          display: 'inline-block',
                          width: 2,
                          height: 16,
                          background: '#c9a227',
                          marginLeft: 4,
                          verticalAlign: 'middle',
                          animation: 'im-star-twinkle 0.8s ease-in-out infinite',
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MotionContainer>

        {/* Capabilities */}
        <MotionContainer delay={600} staggerChildren={80}>
          {[
            { label: 'Transit Awareness', desc: 'Knows what the sky is doing right now' },
            { label: 'Sacred Timing', desc: 'Your tasks matched to the ruling planet of each hour' },
            { label: 'Pattern Recognition', desc: 'Speaks when your inner weather changes' },
            { label: 'Living Guidance', desc: 'Every insight carries an invitation to act' },
          ].map((cap) => (
            <div
              key={cap.label}
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
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#a78bfa',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f3ff' }}>{cap.label}</div>
                <div style={{ fontSize: 12, color: '#6b5b8a' }}>{cap.desc}</div>
              </div>
            </div>
          ))}
        </MotionContainer>

        <MotionContainer delay={900}>
          <button
            onClick={handleContinue}
            className="im-btn-primary"
            style={{ marginTop: 28 }}
          >
            Continue
            <IconArrowRight size={18} color="#05040a" />
          </button>
        </MotionContainer>
      </div>
    </div>
  );
};
