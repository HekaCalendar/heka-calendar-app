/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SACRED GEOMETRY SHOWCASE — Shape Your Temple
 * Two sacred dimensions: 6 background fields + 6 header symbols = 36 temples.
 * Top row: background pattern thumbnails. Bottom row: header symbol thumbnails.
 * Center: a living preview of one combined temple (bg + header).
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';
import { SacredGeometry } from '../../sacred-geometry/SacredGeometry';
import type { GeometryPattern, BackgroundGeometryPattern } from '../../../types/themes';

const BACKGROUNDS: BackgroundGeometryPattern[] = [
  'hex-flower-grid',
  'metatrons-lattice',
  'sri-yantra-mandala',
  'torus-field',
  'tree-of-life',
  'vesica-wave',
];

const HEADERS: GeometryPattern[] = [
  'flower-of-life',
  'seed-of-life',
  'metatrons-cube',
  'sri-yantra',
  'merkaba',
  'fruit-of-life',
];

const FEATURED_BG: BackgroundGeometryPattern = 'sri-yantra-mandala';
const FEATURED_HEADER: GeometryPattern = 'sri-yantra';

export const SacredGeometryShowcase: React.FC = () => {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    const total = BACKGROUNDS.length + HEADERS.length; // 12
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let idx = 0; idx < total; idx++) {
      timers.push(
        setTimeout(() => setRevealed((p) => Math.max(p, idx + 1)), 300 + idx * 140)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const thumbSize = { width: 58, height: 44 };
  const headerThumbSize = { width: 44, height: 44 };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: 340, marginTop: 16 }}>
      {/* Background thumbnails — top curved arc */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          zIndex: 2,
        }}
      >
        {BACKGROUNDS.map((bg, idx) => {
          const isRevealed = revealed > idx;
          return (
            <div
              key={bg}
              style={{
                width: thumbSize.width,
                height: thumbSize.height,
                borderRadius: 8,
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(201, 162, 39, 0.15)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.85)',
                transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.04}s`,
                backdropFilter: 'blur(4px)',
              }}
            >
              <div style={{ width: thumbSize.width - 4, height: thumbSize.height - 4 }}>
                <SacredGeometry pattern={bg} variant="background" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Central featured temple — background + header combined */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 150,
          height: 150,
          zIndex: 1,
        }}
      >
        {/* Background layer — faint wallpaper */}
        <div
          style={{
            position: 'absolute',
            inset: -20,
            opacity: 0.12,
            filter: 'blur(1px)',
          }}
        >
          <SacredGeometry pattern={FEATURED_BG} variant="background" />
        </div>

        {/* Golden glow ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 65%)',
            boxShadow: '0 0 40px rgba(201,162,39,0.1), inset 0 0 30px rgba(201,162,39,0.04)',
            animation: 'sg-showcase-breathe 5s ease-in-out infinite',
          }}
        />

        {/* Header symbol */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 72, height: 72 }}>
            <SacredGeometry pattern={FEATURED_HEADER} variant="header" />
          </div>
        </div>
      </div>

      {/* Constellation lines from center to header thumbs */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {HEADERS.map((_, idx) => {
          const cx = 240;
          const cy = 170;
          const thumbCount = HEADERS.length;
          const totalWidth = thumbCount * (headerThumbSize.width + 10) - 10;
          const startX = 240 - totalWidth / 2 + headerThumbSize.width / 2;
          const tx = startX + idx * (headerThumbSize.width + 10);
          const ty = 310;
          return (
            <line
              key={`line-${idx}`}
              x1={cx}
              y1={cy}
              x2={tx}
              y2={ty}
              stroke="rgba(201, 162, 39, 0.08)"
              strokeWidth={1}
              strokeDasharray="3,6"
            />
          );
        })}
      </svg>

      {/* Header thumbnails — bottom row */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          zIndex: 2,
        }}
      >
        {HEADERS.map((h, idx) => {
          const globalIdx = BACKGROUNDS.length + idx;
          const isRevealed = revealed > globalIdx;
          return (
            <div
              key={h}
              style={{
                width: headerThumbSize.width,
                height: headerThumbSize.height,
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(201, 162, 39, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.85)',
                transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${globalIdx * 0.04}s`,
                backdropFilter: 'blur(4px)',
              }}
            >
              <div style={{ width: 32, height: 32 }}>
                <SacredGeometry pattern={h} variant="header" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom caption */}
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
          color: 'rgba(201, 162, 39, 0.35)',
        }}
      >
        6 Backgrounds · 6 Symbols · 36 Combinations
      </div>
    </div>
  );
};
