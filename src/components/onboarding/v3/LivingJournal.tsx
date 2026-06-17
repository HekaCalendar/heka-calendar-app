/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LIVING JOURNAL — Orbiting journal cards around a breathing moon
 * Used in Tutorial Step 3: "Your Marks Become Maps"
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';

interface JournalCard {
  date: string;
  mood: string;
  text: string;
  sign: string;
  orbitDuration: number;
  orbitRadius: number;
  orbitDelay: number;
  size: number;
}

const CARDS: JournalCard[] = [
  { date: 'Apr 12', mood: '🌙', text: 'Dreamed of water...', sign: 'Pisces', orbitDuration: 14, orbitRadius: 110, orbitDelay: 0, size: 100 },
  { date: 'Apr 14', mood: '🔥', text: 'Started new project', sign: 'Aries', orbitDuration: 18, orbitRadius: 140, orbitDelay: -3, size: 110 },
  { date: 'Apr 16', mood: '🌿', text: 'Walked in the garden', sign: 'Taurus', orbitDuration: 22, orbitRadius: 90, orbitDelay: -6, size: 95 },
  { date: 'Apr 19', mood: '✨', text: 'Full moon clarity', sign: 'Libra', orbitDuration: 16, orbitRadius: 125, orbitDelay: -9, size: 105 },
  { date: 'Apr 21', mood: '💭', text: 'Mercury rx thoughts', sign: 'Gemini', orbitDuration: 20, orbitRadius: 155, orbitDelay: -12, size: 100 },
];

export const LivingJournal: React.FC = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: 480,
      height: 360,
      marginTop: 24,
      overflow: 'hidden',
    }}>
      {/* Central breathing moon */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #fefce8, #fde68a, #d4af37)',
        boxShadow: '0 0 40px rgba(212, 175, 55, 0.35), 0 0 80px rgba(212, 175, 55, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        animation: 'journalMoonBreathe 4s ease-in-out infinite',
        zIndex: 2,
      }}>
        🌕
      </div>

      {/* Orbiting atmosphere rings */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 220,
        height: 220,
        borderRadius: '50%',
        border: '1px solid rgba(201, 162, 39, 0.08)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        height: 300,
        borderRadius: '50%',
        border: '1px solid rgba(201, 162, 39, 0.05)',
        pointerEvents: 'none',
      }} />

      {/* Orbiting cards */}
      {CARDS.map((card, i) => (
        <div
          key={i}
          onClick={() => setFlippedIndex(flippedIndex === i ? null : i)}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: card.size,
            height: card.size * 0.75,
            marginLeft: -card.size / 2,
            marginTop: -(card.size * 0.75) / 2,
            animation: `cardOrbit${i} ${card.orbitDuration}s linear infinite`,
            animationDelay: `${card.orbitDelay}s`,
            cursor: 'pointer',
            zIndex: flippedIndex === i ? 10 : 1,
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s',
            transform: flippedIndex === i ? 'scale(1.15)' : 'scale(1)',
            boxShadow: flippedIndex === i
              ? '0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(201,162,39,0.2)'
              : '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 9, color: 'rgba(201,162,39,0.8)', fontWeight: 600, letterSpacing: '0.05em' }}>{card.date}</span>
              <span style={{ fontSize: 11 }}>{card.mood}</span>
            </div>
            <div style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.4,
              flex: 1,
              display: 'flex',
              alignItems: 'center',
            }}>
              {flippedIndex === i ? (
                <span style={{ fontStyle: 'italic', color: '#a89bc8' }}>
                  "{card.text}" — {card.sign} insight
                </span>
              ) : (
                <span>{card.text}</span>
              )}
            </div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>
              ♓ {card.sign}
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes journalMoonBreathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 40px rgba(212, 175, 55, 0.35), 0 0 80px rgba(212, 175, 55, 0.15); }
          50% { transform: translate(-50%, -50%) scale(1.08); box-shadow: 0 0 60px rgba(212, 175, 55, 0.5), 0 0 100px rgba(212, 175, 55, 0.25); }
        }
        ${CARDS.map((card, i) => `
        @keyframes cardOrbit${i} {
          from { transform: rotate(0deg) translateX(${card.orbitRadius}px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(${card.orbitRadius}px) rotate(-360deg); }
        }
        `).join('')}
        @media (prefers-reduced-motion: reduce) {
          @keyframes journalMoonBreathe {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
          }
          ${CARDS.map((card, i) => `
          @keyframes cardOrbit${i} {
            from { transform: rotate(${i * 72}deg) translateX(${card.orbitRadius}px) rotate(-${i * 72}deg); }
            to { transform: rotate(${i * 72}deg) translateX(${card.orbitRadius}px) rotate(-${i * 72}deg); }
          }
          `).join('')}
        }
      `}</style>
    </div>
  );
};

export default LivingJournal;
