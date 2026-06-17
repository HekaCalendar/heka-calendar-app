/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE SILENCE — Pure Mode Showcase
 * Everything ornate dissolves. What remains is the calendar -- clean, full, breathing.
 * Ghostly traces of sacred geometry, celestial cards, and astrology fade to nothing.
 * A simplified grid breathes at the centre. The Yin-Yang rotates above.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';

interface GridCell {
  day: number;
  note?: string;
  isToday?: boolean;
  arc?: 'opening' | 'core' | 'closing';
}

const GRID_ROWS = 4;
const GRID_COLS = 5;

const CELLS: GridCell[] = [
  { day: 12 }, { day: 13 }, { day: 14 }, { day: 15, note: 'Silence', isToday: true }, { day: 16 },
  { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 }, { day: 21, note: 'Journal' },
  { day: 22 }, { day: 23, arc: 'opening' }, { day: 24, arc: 'core' }, { day: 25, arc: 'closing' }, { day: 26 },
  { day: 27 }, { day: 28 }, { day: 1 }, { day: 2 }, { day: 3 },
];

const ARC_COLORS: Record<string, { bg: string; border: string }> = {
  opening: { bg: 'rgba(224,122,95,0.06)', border: 'rgba(224,122,95,0.12)' },
  core: { bg: 'rgba(129,178,154,0.06)', border: 'rgba(129,178,154,0.12)' },
  closing: { bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.12)' },
};

export const PureModeShowcase: React.FC = () => {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sequence = [300, 700, 1200, 1700, 2200, 2700];
    sequence.forEach((ms, i) => {
      timers.push(setTimeout(() => setRevealed((p) => Math.max(p, i + 1)), ms));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const ghostOpacity = revealed >= 1 ? 0.05 : 0;
  const gridOpacity = revealed >= 2 ? 1 : 0;
  const yinYangOpacity = revealed >= 4 ? 1 : 0;
  const wordsOpacity = revealed >= 5 ? 1 : 0;

  const cellW = 56;
  const cellH = 52;
  const gridW = GRID_COLS * cellW + (GRID_COLS - 1);
  const gridH = GRID_ROWS * cellH + (GRID_ROWS - 1);
  const gridX = (480 - gridW) / 2;
  const gridY = 68;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: 350, marginTop: 12 }}>
      {/* ═══════════════════════════════════════════════════════════════
          GHOSTLY ORNAMENTS — what Pure Mode strips away
         ═══════════════════════════════════════════════════════════════ */}

      {/* Faint Sri Yantra ghost — top left */}
      <svg
        style={{
          position: 'absolute',
          top: 4,
          left: 16,
          width: 80,
          height: 80,
          opacity: ghostOpacity,
          transition: 'opacity 2.5s ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        viewBox="0 0 100 100"
      >
        <polygon points="50,5 95,95 5,95" fill="none" stroke="rgba(201,162,39,0.5)" strokeWidth="0.5" />
        <polygon points="50,25 80,85 20,85" fill="none" stroke="rgba(201,162,39,0.4)" strokeWidth="0.5" />
        <circle cx="50" cy="55" r="12" fill="none" stroke="rgba(201,162,39,0.3)" strokeWidth="0.5" />
        <circle cx="50" cy="55" r="6" fill="none" stroke="rgba(201,162,39,0.3)" strokeWidth="0.5" />
      </svg>

      {/* Faint celestial card ghost — top right */}
      <div
        style={{
          position: 'absolute',
          top: 8,
          right: 20,
          width: 64,
          height: 46,
          borderRadius: 8,
          border: '1px solid rgba(88,166,255,0.18)',
          background: 'rgba(88,166,255,0.02)',
          opacity: ghostOpacity,
          transition: 'opacity 2.5s ease 0.3s',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <div style={{ height: 3, width: 18, background: 'rgba(88,166,255,0.12)', borderRadius: 2, margin: '7px 0 0 7px' }} />
        <div style={{ height: 2, width: 30, background: 'rgba(88,166,255,0.08)', borderRadius: 1, margin: '4px 0 0 7px' }} />
        <div style={{ height: 2, width: 24, background: 'rgba(88,166,255,0.06)', borderRadius: 1, margin: '3px 0 0 7px' }} />
      </div>

      {/* Faint zodiac wheel ghost — bottom left */}
      <svg
        style={{
          position: 'absolute',
          bottom: 40,
          left: 24,
          width: 55,
          height: 55,
          opacity: ghostOpacity,
          transition: 'opacity 2.5s ease 0.6s',
          pointerEvents: 'none',
          zIndex: 1,
        }}
        viewBox="0 0 60 60"
      >
        <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(184,161,224,0.2)" strokeWidth="0.5" />
        <circle cx="30" cy="30" r="18" fill="none" stroke="rgba(184,161,224,0.15)" strokeWidth="0.5" />
        <circle cx="30" cy="30" r="10" fill="none" stroke="rgba(184,161,224,0.12)" strokeWidth="0.5" />
        <line x1="30" y1="5" x2="30" y2="55" stroke="rgba(184,161,224,0.12)" strokeWidth="0.5" />
        <line x1="5" y1="30" x2="55" y2="30" stroke="rgba(184,161,224,0.12)" strokeWidth="0.5" />
      </svg>

      {/* Faint astrology glyph ghost — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: 44,
          right: 30,
          fontSize: 26,
          color: 'rgba(255,107,53,0.07)',
          opacity: ghostOpacity,
          transition: 'opacity 2.5s ease 0.9s',
          pointerEvents: 'none',
          zIndex: 1,
          fontFamily: "'Cinzel', Georgia, serif",
        }}
      >
        ☉
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          YIN-YANG — the toggle between dark and light
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 22,
          transform: 'translateX(-50%)',
          zIndex: 4,
          opacity: yinYangOpacity,
          transition: 'opacity 0.8s ease',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            animation: 'pure-yinyang-rotate 12s linear infinite',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          ☯
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          THE PURE GRID — essence of the calendar
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: gridX,
          top: gridY,
          width: gridW,
          height: gridH,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_COLS}, ${cellW}px)`,
          gridTemplateRows: `repeat(${GRID_ROWS}, ${cellH}px)`,
          gap: 1,
          zIndex: 3,
          opacity: gridOpacity,
          transform: gridOpacity ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Breathing ambient glow behind grid */}
        <div
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 4,
            background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.02) 0%, transparent 65%)',
            animation: 'pure-cell-breathe 6s ease-in-out infinite',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />

        {CELLS.map((cell, idx) => {
          const arcStyle = cell.arc ? ARC_COLORS[cell.arc] : null;
          return (
            <div
              key={idx}
              style={{
                width: cellW,
                height: cellH,
                background: cell.isToday
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.03))'
                  : arcStyle
                  ? arcStyle.bg
                  : 'transparent',
                border: cell.isToday
                  ? '1px solid rgba(59,130,246,0.2)'
                  : arcStyle
                  ? `1px solid ${arcStyle.border}`
                  : '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                padding: '5px 6px',
                position: 'relative',
                transition: 'all 0.3s ease',
                opacity: gridOpacity ? 1 : 0,
                transform: gridOpacity ? 'translateY(0)' : 'translateY(4px)',
                transitionDelay: `${idx * 0.02}s`,
              }}
            >
              {/* Day number */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: cell.isToday ? 600 : 400,
                  color: cell.isToday ? '#60a5fa' : 'rgba(255,255,255,0.55)',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  lineHeight: 1,
                }}
              >
                {cell.day}
              </span>

              {/* Note preview */}
              {cell.note && (
                <span
                  style={{
                    fontSize: 7,
                    color: 'rgba(201,162,39,0.5)',
                    fontFamily: "'Inter', system-ui, sans-serif",
                    marginTop: 3,
                    lineHeight: 1.2,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cell.note}
                </span>
              )}

              {/* Today glow dot */}
              {cell.isToday && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#3b82f6',
                    boxShadow: '0 0 6px rgba(59,130,246,0.5)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ZEN WORDS — beneath the grid
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: 38,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          zIndex: 4,
          opacity: wordsOpacity,
          transition: 'opacity 0.7s ease',
        }}
      >
        {['Silence', 'Focus', 'Breathe'].map((word, i) => (
          <span
            key={word}
            style={{
              fontSize: 9,
              fontWeight: 300,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)',
              fontFamily: "'Inter', system-ui, sans-serif",
              opacity: wordsOpacity,
              transform: wordsOpacity ? 'translateY(0)' : 'translateY(6px)',
              transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.1}s`,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM CAPTION
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: 10,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(201, 162, 39, 0.28)',
        }}
      >
        Strip the Noise · Keep the Essence
      </div>
    </div>
  );
};

export default PureModeShowcase;
