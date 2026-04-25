/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CIRCLE PREVIEW — Social connection feature preview
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { IconCircle } from './OnboardingIcons';
import './onboardingAnimations.css';

export const CirclePreview: React.FC = () => {
  const { goNext, getInterpolatedCopy } = useOnboarding();
  const [isTransitioning, setIsTransitioning] = useState(false);

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
          radial-gradient(ellipse at 30% 70%, rgba(201, 162, 39, 0.05) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 30%, rgba(124, 58, 237, 0.05) 0%, transparent 50%),
          #05040a
        `,
        zIndex: 9998,
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <MotionContainer delay={0}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(201, 162, 39, 0.06)',
                border: '1px solid rgba(201, 162, 39, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <IconCircle size={44} color="#c9a227" />
            </div>
            <h1
              style={{
                fontSize: 'clamp(22px, 4vw, 30px)',
                fontWeight: 700,
                color: '#f5f3ff',
                margin: '0 0 8px 0',
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              }}
            >
              {getInterpolatedCopy('circle.heading')}
            </h1>
            <p style={{ fontSize: 14, color: '#a89bc8', margin: 0, lineHeight: 1.5 }}>
              {getInterpolatedCopy('circle.subheading')}
            </p>
          </div>
        </MotionContainer>

        {/* Social visualization */}
        <MotionContainer delay={300}>
          <div
            style={{
              position: 'relative',
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 32,
            }}
          >
            {/* Center node */}
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a227, #b8941f)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)',
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 700, color: '#05040a' }}>You</span>
            </div>

            {/* Orbiting nodes */}
            {[
              { delay: 0, color: '#7c3aed' },
              { delay: 2, color: '#2d8a4e' },
              { delay: 4, color: '#c23b22' },
            ].map((node, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `${node.color}20`,
                  border: `1.5px solid ${node.color}60`,
                  animation: `im-orbit 12s linear infinite`,
                  animationDelay: `${node.delay}s`,
                }}
              />
            ))}

            {/* Connection lines */}
            <svg
              width={200}
              height={200}
              viewBox="0 0 200 200"
              style={{ position: 'absolute', opacity: 0.15 }}
            >
              <circle cx="100" cy="100" r="70" fill="none" stroke="#c9a227" strokeWidth="0.5" strokeDasharray="4,4" />
            </svg>
          </div>
        </MotionContainer>

        {/* Features */}
        <MotionContainer delay={500} staggerChildren={100}>
          {[
            'Share celestial timing with friends',
            'Plan events by moon phase',
            'Send celestial greetings',
            'Collaborate on shared tasks',
          ].map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#c9a227',
                }}
              />
              <span style={{ fontSize: 13, color: '#a89bc8' }}>{feature}</span>
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
