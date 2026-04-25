/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SPLASH SCREEN — Living celestial body reacting to real user time
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState, useMemo } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { MotionContainer } from './MotionContainer';
import { getDetailedMoonPhase } from '../../../services/calendarService';
import './onboardingAnimations.css';

const LOADING_MESSAGES = [
  'Aligning with your sky...',
  'Reading the positions of the wandering stars...',
  'Mapping the hours ruled by each planet...',
  'Weaving the thirteen months...',
];

export const SplashScreen: React.FC = () => {
  const { goNext } = useOnboarding();
  const [messageIndex, setMessageIndex] = useState(0);
  const [, setShowContent] = useState(false);
  const [, setCelestialReady] = useState(false);

  const hour = useMemo(() => new Date().getHours(), []);
  const isNight = hour < 6 || hour >= 18;
  const moonPhase = useMemo(() => getDetailedMoonPhase(new Date()), []);

  // Progress through loading messages
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    LOADING_MESSAGES.forEach((_, i) => {
      timers.push(setTimeout(() => setMessageIndex(i), 600 + i * 700));
    });
    timers.push(setTimeout(() => setCelestialReady(true), 3000));
    timers.push(setTimeout(() => setShowContent(true), 3200));
    // Auto-advance after splash duration
    timers.push(setTimeout(() => goNext(), 4500));
    return () => timers.forEach(clearTimeout);
  }, [goNext]);

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
          radial-gradient(ellipse at 30% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(201, 162, 39, 0.1) 0%, transparent 45%),
          #05040a
        `,
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {/* Starfield */}
      <Starfield />

      {/* Celestial Body */}
      <MotionContainer delay={200}>
        <div style={{ marginBottom: 40 }}>
          {isNight ? (
            <MoonVisual phase={moonPhase.illumination / 100} size={120} />
          ) : (
            <SunVisual size={120} />
          )}
        </div>
      </MotionContainer>

      {/* Loading Message */}
      <MotionContainer delay={400}>
        <div
          style={{
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {LOADING_MESSAGES.map((msg, i) => (
            <span
              key={msg}
              style={{
                position: 'absolute',
                fontSize: 14,
                color: '#a89bc8',
                letterSpacing: '0.5px',
                opacity: i === messageIndex ? 1 : 0,
                transform: i === messageIndex ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
              }}
            >
              {msg}
            </span>
          ))}
        </div>
      </MotionContainer>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          width: 120,
          height: 2,
          background: 'rgba(201, 162, 39, 0.1)',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${((messageIndex + 1) / LOADING_MESSAGES.length) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #c9a227, #e8c84a)',
            borderRadius: 1,
            transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
    </div>
  );
};

// ─── Moon Visual with Real Phase ───
const MoonVisual: React.FC<{ phase: number; size: number }> = ({ phase, size }) => {
  // phase: 0 = new, 0.5 = full, 1 = new
  const isWaxing = phase <= 0.5;
  const effectivePhase = isWaxing ? phase : 1 - phase;
  const shadowOffset = (effectivePhase - 0.5) * 2; // -1 to 1

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: '50%',
        background: '#1a1a2e',
        boxShadow: `
          inset -8px 0 20px rgba(0,0,0,0.5),
          0 0 40px rgba(192, 192, 208, 0.15),
          0 0 80px rgba(192, 192, 208, 0.05)
        `,
        overflow: 'hidden',
      }}
    >
      {/* Moon surface texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `
            radial-gradient(circle at 30% 40%, rgba(200,200,220,0.15) 0%, transparent 30%),
            radial-gradient(circle at 70% 60%, rgba(200,200,220,0.1) 0%, transparent 25%),
            radial-gradient(circle at 50% 30%, rgba(200,200,220,0.08) 0%, transparent 20%)
          `,
        }}
      />
      {/* Shadow terminator */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: isWaxing
            ? `linear-gradient(90deg, rgba(0,0,0,0.7) ${50 + shadowOffset * 40}%, transparent ${50 + shadowOffset * 40}%)`
            : `linear-gradient(270deg, rgba(0,0,0,0.7) ${50 + shadowOffset * 40}%, transparent ${50 + shadowOffset * 40}%)`,
          transition: 'background 0.5s ease',
        }}
      />
      {/* Glow ring */}
      <div
        style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: '1px solid rgba(192, 192, 208, 0.1)',
          animation: 'im-breathe 4s ease-in-out infinite',
        }}
      />
    </div>
  );
};

// ─── Starfield ───
const Starfield: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.9)',
            opacity: star.opacity,
            animation: `im-star-twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Sun Visual ───
const SunVisual: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Corona */}
      <div
        style={{
          position: 'absolute',
          width: size * 1.4,
          height: size * 1.4,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.2) 0%, transparent 70%)',
          animation: 'im-sun-corona 4s ease-in-out infinite',
        }}
      />
      {/* Sun body */}
      <div
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #e8c84a, #c9a227)',
          boxShadow: `
            0 0 30px rgba(201, 162, 39, 0.4),
            0 0 60px rgba(201, 162, 39, 0.2),
            inset -4px -4px 12px rgba(180, 140, 20, 0.3)
          `,
        }}
      />
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        return (
          <div
            key={angle}
            style={{
              position: 'absolute',
              width: 2,
              height: size * 0.55,
              background: 'linear-gradient(to bottom, rgba(201, 162, 39, 0.4), transparent)',
              transform: `rotate(${angle}deg)`,
              transformOrigin: 'center center',
              top: '50%',
              left: '50%',
              marginTop: -size * 0.275,
              marginLeft: -1,
              animation: `im-star-twinkle ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        );
      })}
    </div>
  );
};
