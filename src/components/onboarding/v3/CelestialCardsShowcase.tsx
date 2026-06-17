/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL CARDS SHOWCASE — The Living Dashboard
 * Six glassmorphism instrument cards in a 3x2 constellation grid.
 * Weather. Sun. Moon. Seasons. Agriculture. Time. All inside HEKA.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from 'react';

interface MiniCard {
  icon: string;
  title: string;
  stat: string;
  accent: string;
}

const CARDS: MiniCard[] = [
  { icon: '☀️', title: 'Sun Times', stat: '22°C  ·  Sunrise 06:42', accent: 'rgba(201, 162, 39, 0.35)' },
  { icon: '🌙', title: 'Moon Phase', stat: 'Waxing  ·  72%', accent: 'rgba(168, 155, 200, 0.35)' },
  { icon: '🌍', title: 'Seasons', stat: 'Spring  ·  42d left', accent: 'rgba(124, 179, 66, 0.35)' },
  { icon: '🌾', title: 'Agriculture', stat: 'Plant: Tomato', accent: 'rgba(141, 110, 99, 0.35)' },
  { icon: '⏰', title: 'Time Engine', stat: 'Year: 45d 03h', accent: 'rgba(66, 165, 245, 0.35)' },
  { icon: '📜', title: 'Planetary Hours', stat: 'Mars  ·  34%', accent: 'rgba(239, 83, 80, 0.35)' },
];

const SHIMMER_DURATION = 2000;

export const CelestialCardsShowcase: React.FC = () => {
  const [revealed, setRevealed] = useState(0);
  const [shimmerPhase, setShimmerPhase] = useState(0); // 0=none, 1=active, 2=done
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    CARDS.forEach((_, idx) => {
      timers.push(setTimeout(() => setRevealed((p) => Math.max(p, idx + 1)), 250 + idx * 160));
    });
    // Shimmer sweep after all cards revealed
    timers.push(
      setTimeout(() => setShimmerPhase(1), 250 + CARDS.length * 160 + 300)
    );
    timers.push(
      setTimeout(() => setShimmerPhase(2), 250 + CARDS.length * 160 + 300 + SHIMMER_DURATION)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 480,
        height: 300,
        marginTop: 16,
        overflow: 'hidden',
      }}
    >
      {/* Subtle field glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,162,39,0.04) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Card grid */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          padding: '12px 8px',
        }}
      >
        {CARDS.map((card, idx) => {
          const isRevealed = revealed > idx;
          const row = Math.floor(idx / 3);

          return (
            <div
              key={card.title}
              style={{
                height: 90,
                borderRadius: 12,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(201, 162, 39, 0.12)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed
                  ? 'translateY(0) scale(1)'
                  : `translateY(${row === 0 ? -12 : 12}px) scale(0.88)`,
                transition: `all 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.05}s`,
                boxShadow: isRevealed
                  ? `0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 ${card.accent}`
                  : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 12,
                  right: 12,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${card.accent.replace('0.35', '0.5')}, transparent)`,
                  opacity: isRevealed ? 1 : 0,
                  transition: `opacity 0.8s ease ${0.3 + idx * 0.08}s`,
                }}
              />

              {/* Icon */}
              <span style={{ fontSize: 22, lineHeight: 1, filter: isRevealed ? 'none' : 'blur(4px)', transition: `filter 0.5s ease ${0.2 + idx * 0.08}s` }}>
                {card.icon}
              </span>

              {/* Title */}
              <span
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(245, 243, 255, 0.75)',
                  textAlign: 'center',
                }}
              >
                {card.title}
              </span>

              {/* Stat */}
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 12,
                  color: 'rgba(201, 162, 39, 0.7)',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}
              >
                {card.stat}
              </span>
            </div>
          );
        })}
      </div>

      {/* Shimmer sweep across all cards */}
      {shimmerPhase > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none',
            background:
              shimmerPhase === 1
                ? 'linear-gradient(105deg, transparent 40%, rgba(201,162,39,0.06) 50%, transparent 60%)'
                : 'none',
            backgroundSize: '200% 100%',
            animation: shimmerPhase === 1 ? 'cc-shimmer-sweep 1.8s ease-in-out forwards' : 'none',
          }}
        />
      )}

      {/* Bottom caption */}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: 10,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(201, 162, 39, 0.35)',
        }}
      >
        Six Instruments · One Calendar · Zero Compromise
      </div>
    </div>
  );
};
