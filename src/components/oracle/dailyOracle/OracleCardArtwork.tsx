/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║              DAILY ORACLE — GENERATIVE CARD ARTWORK                       ║
 * ║                                                                           ║
 * ║  SVG-based sacred geometry that renders uniquely per card seed.           ║
 * ║  No external images. Pure code, pure magic.                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useMemo } from 'react';
import type { OracleArchetype } from './archetypes';

interface OracleCardArtworkProps {
  archetype: OracleArchetype;
  seed: string;
  size?: number;
  revealed?: boolean;
}

export const OracleCardArtwork: React.FC<OracleCardArtworkProps> = ({
  archetype,
  seed,
  size = 320,
  revealed = true,
}) => {
  const hash = useMemo(() => hashString(seed), [seed]);
  const art = archetype.artwork;

  const [c1, c2] = art.primaryGradient;
  const [s1, s2] = art.secondaryGradient;

  // Generate particle positions deterministically
  const particles = useMemo(() => {
    const pts: { x: number; y: number; r: number; opacity: number }[] = [];
    for (let i = 0; i < art.particleCount; i++) {
      const h = hashString(`${seed}-p${i}`);
      pts.push({
        x: 30 + (h % 400) / 400 * 40,
        y: 20 + (h >> 4) % 300 / 300 * 60,
        r: 1 + (h % 4),
        opacity: 0.3 + (h % 50) / 100,
      });
    }
    return pts;
  }, [seed, art.particleCount, hash]);

  // Mandala rings
  const rings = useMemo(() => {
    if (!art.hasMandala) return [];
    const r: { cx: number; cy: number; r: number; stroke: string; width: number }[] = [];
    const count = 3 + (hash % 4);
    for (let i = 0; i < count; i++) {
      const h = hashString(`${seed}-r${i}`);
      r.push({
        cx: 50,
        cy: 50,
        r: 15 + i * 8 + (h % 6),
        stroke: i % 2 === 0 ? c2 : s1,
        width: 0.3 + (h % 3) * 0.2,
      });
    }
    return r;
  }, [seed, art.hasMandala, hash, c2, s1]);

  // Rays
  const rays = useMemo(() => {
    if (!art.hasRays) return [];
    const count = 8 + (hash % 12);
    const rayData: { angle: number; length: number; width: number }[] = [];
    for (let i = 0; i < count; i++) {
      const h = hashString(`${seed}-ray${i}`);
      rayData.push({
        angle: (360 / count) * i + (h % 10) - 5,
        length: 25 + (h % 20),
        width: 0.5 + (h % 2) * 0.5,
      });
    }
    return rayData;
  }, [seed, art.hasRays, hash]);

  // Ring glow
  const ringGlow = useMemo(() => {
    if (!art.hasRing) return null;
    const h = hashString(`${seed}-ring`);
    return {
      cx: 50,
      cy: 50,
      r: 28 + (h % 8),
      stroke: s2,
      width: 1.5 + (h % 3) * 0.5,
    };
  }, [seed, art.hasRing, hash, s2]);

  const centerShape = renderCenterShape(art.baseShape, hash, c1, c2, s1, s2);

  if (!revealed) {
    // Card back design
    return (
      <svg
        viewBox="0 0 100 160"
        width={size}
        height={size * 1.6}
        className="oracle-card-artwork oracle-card-back"
      >
        <defs>
          <linearGradient id={`back-grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="50%" stopColor="#16213e" />
            <stop offset="100%" stopColor="#0f3460" />
          </linearGradient>
          <pattern id={`back-pattern-${seed}`} x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="0.5" fill="#caa24a" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="100" height="160" fill={`url(#back-grad-${seed})`} rx="4" />
        <rect width="100" height="160" fill={`url(#back-pattern-${seed})`} rx="4" />
        {/* Center sacred geometry symbol */}
        <g transform="translate(50, 80)">
          <circle r="18" fill="none" stroke="#caa24a" strokeWidth="0.4" opacity="0.4" />
          <circle r="12" fill="none" stroke="#caa24a" strokeWidth="0.3" opacity="0.3" />
          <circle r="6" fill="none" stroke="#caa24a" strokeWidth="0.2" opacity="0.5" />
          {[0, 60, 120, 180, 240, 300].map(a => {
            const rad = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={Math.cos(rad) * 6}
                y1={Math.sin(rad) * 6}
                x2={Math.cos(rad) * 18}
                y2={Math.sin(rad) * 18}
                stroke="#caa24a"
                strokeWidth="0.3"
                opacity="0.3"
              />
            );
          })}
          <text textAnchor="middle" dominantBaseline="central" fontSize="6" fill="#caa24a" opacity="0.6" fontFamily="serif">
            ✦
          </text>
        </g>
        {/* Border */}
        <rect x="3" y="3" width="94" height="154" fill="none" stroke="#caa24a" strokeWidth="0.4" rx="3" opacity="0.3" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 160"
      width={size}
      height={size * 1.6}
      className="oracle-card-artwork"
    >
      <defs>
        <linearGradient id={`grad1-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`grad2-${seed}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={s1} />
          <stop offset="100%" stopColor={s2} />
        </linearGradient>
        <radialGradient id={`glow-${seed}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor={s2} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
        <filter id={`blur-${seed}`}>
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="100" height="160" fill={`url(#grad1-${seed})`} rx="4" />
      <rect width="100" height="160" fill={`url(#glow-${seed})`} rx="4" />

      {/* Particles */}
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={s2}
          opacity={p.opacity}
        >
          <animate
            attributeName="opacity"
            values={`${p.opacity};${p.opacity * 0.3};${p.opacity}`}
            dur={`${3 + (i % 4)}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Mandala rings */}
      {rings.map((r, i) => (
        <circle
          key={`ring-${i}`}
          cx={r.cx}
          cy={r.cy}
          r={r.r}
          fill="none"
          stroke={r.stroke}
          strokeWidth={r.width}
          opacity="0.35"
        />
      ))}

      {/* Ring glow */}
      {ringGlow && (
        <>
          <circle
            cx={ringGlow.cx}
            cy={ringGlow.cy}
            r={ringGlow.r}
            fill="none"
            stroke={ringGlow.stroke}
            strokeWidth={ringGlow.width}
            opacity="0.5"
            filter={`url(#blur-${seed})`}
          />
          <circle
            cx={ringGlow.cx}
            cy={ringGlow.cy}
            r={ringGlow.r}
            fill="none"
            stroke={ringGlow.stroke}
            strokeWidth={ringGlow.width * 0.5}
            opacity="0.7"
          />
        </>
      )}

      {/* Rays */}
      {rays.map((ray, i) => {
        const rad = (ray.angle * Math.PI) / 180;
        const x2 = 50 + Math.cos(rad) * ray.length;
        const y2 = 65 + Math.sin(rad) * ray.length;
        return (
          <line
            key={`ray-${i}`}
            x1={50}
            y1={65}
            x2={x2}
            y2={y2}
            stroke={s2}
            strokeWidth={ray.width}
            opacity="0.25"
          />
        );
      })}

      {/* Center sacred geometry shape */}
      <g transform="translate(50, 65)">
        {centerShape}
      </g>

      {/* Archetype symbol */}
      <text
        x="50"
        y="145"
        textAnchor="middle"
        fontSize="14"
        fill={s2}
        opacity="0.6"
        fontFamily="serif"
      >
        {archetype.symbol}
      </text>

      {/* Card number */}
      <text
        x="50"
        y="12"
        textAnchor="middle"
        fontSize="5"
        fill={s2}
        opacity="0.4"
        fontFamily="monospace"
        letterSpacing="2"
      >
        {String(archetype.number).padStart(2, '0')} · {archetype.element.toUpperCase()}
      </text>

      {/* Border */}
      <rect x="2" y="2" width="96" height="156" fill="none" stroke={s2} strokeWidth="0.3" rx="3" opacity="0.25" />
    </svg>
  );
};

// ─── Center Shape Renderers ──────────────────────────────────────────────────

function renderCenterShape(
  shape: OracleArchetype['artwork']['baseShape'],
  _hash: number,
  _c1: string,
  _c2: string,
  s1: string,
  s2: string
): React.ReactNode {
  const stroke = s2;
  const fill = s1;

  switch (shape) {
    case 'circle':
      return (
        <>
          <circle r="20" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <circle r="14" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.4" />
          <circle r="8" fill={fill} opacity="0.15" />
          <circle r="3" fill={stroke} opacity="0.6" />
        </>
      );

    case 'crescent':
      return (
        <>
          <circle r="18" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.3" />
          <path
            d="M -12,-12 A 18,18 0 1,1 -12,12 A 14,14 0 1,0 -12,-12"
            fill={fill}
            opacity="0.25"
            stroke={stroke}
            strokeWidth="0.4"
          />
        </>
      );

    case 'triangle':
      return (
        <>
          <polygon points="0,-18 15.6,9 -15.6,9" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <polygon points="0,-10 8.7,5 -8.7,5" fill={fill} opacity="0.2" />
          <circle r="2" fill={stroke} opacity="0.6" />
        </>
      );

    case 'square':
      return (
        <>
          <rect x="-15" y="-15" width="30" height="30" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5" transform="rotate(45)" />
          <rect x="-8" y="-8" width="16" height="16" fill={fill} opacity="0.2" transform="rotate(45)" />
          <circle r="2.5" fill={stroke} opacity="0.6" />
        </>
      );

    case 'diamond':
      return (
        <>
          <polygon points="0,-20 14,0 0,20 -14,0" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <polygon points="0,-12 8,0 0,12 -8,0" fill={fill} opacity="0.2" />
          <line x1="-14" y1="0" x2="14" y2="0" stroke={stroke} strokeWidth="0.3" opacity="0.4" />
          <line x1="0" y1="-20" x2="0" y2="20" stroke={stroke} strokeWidth="0.3" opacity="0.4" />
        </>
      );

    case 'star': {
      const outer: string[] = [];
      const inner: string[] = [];
      for (let i = 0; i < 10; i++) {
        const angle = (i * 36 - 90) * Math.PI / 180;
        const r = i % 2 === 0 ? 18 : 8;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        (i % 2 === 0 ? outer : inner).push(`${x},${y}`);
      }
      const pts: string[] = [];
      for (let i = 0; i < 5; i++) pts.push(outer[i], inner[i]);
      return (
        <>
          <polygon points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <circle r="5" fill={fill} opacity="0.2" />
          <circle r="2" fill={stroke} opacity="0.6" />
        </>
      );
    }

    case 'spiral': {
      const spiralPts: string[] = [];
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const angle = t * 4 * Math.PI;
        const r = 2 + t * 16;
        spiralPts.push(`${Math.cos(angle) * r},${Math.sin(angle) * r}`);
      }
      return (
        <>
          <polyline points={spiralPts.join(' ')} fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" strokeLinecap="round" />
          <circle r="3" fill={stroke} opacity="0.4" />
        </>
      );
    }

    case 'eye':
      return (
        <>
          <path d="M -20,0 Q 0,-14 20,0 Q 0,14 -20,0" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <circle r="7" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.4" />
          <circle r="3" fill={fill} opacity="0.3" />
          <circle r="1.5" fill={stroke} opacity="0.7" />
        </>
      );

    case 'lotus': {
      const petals = 8;
      const petalEls: React.ReactNode[] = [];
      for (let i = 0; i < petals; i++) {
        const angle = (i * 360 / petals) * Math.PI / 180;
        petalEls.push(
          <ellipse
            key={i}
            cx={Math.cos(angle) * 8}
            cy={Math.sin(angle) * 8}
            rx="6"
            ry="12"
            fill={fill}
            opacity="0.15"
            transform={`rotate(${(i * 360 / petals)}, ${Math.cos(angle) * 8}, ${Math.sin(angle) * 8})`}
          />
        );
      }
      return (
        <>
          {petalEls}
          <circle r="4" fill={stroke} opacity="0.5" />
          <circle r="2" fill={fill} opacity="0.4" />
        </>
      );
    }

    case 'flame':
      return (
        <>
          <path
            d="M 0,15 Q -8,5 -4,-8 Q -2,-14 0,-18 Q 2,-14 4,-8 Q 8,5 0,15"
            fill={fill}
            opacity="0.25"
            stroke={stroke}
            strokeWidth="0.5"
          />
          <path
            d="M 0,10 Q -4,3 -2,-5 Q 0,-10 2,-5 Q 4,3 0,10"
            fill={stroke}
            opacity="0.3"
          />
        </>
      );

    case 'wave': {
      const wavePath = `M -25,0 Q -12.5,-12 0,0 Q 12.5,12 25,0`;
      return (
        <>
          <path d={wavePath} fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <path d="M -25,6 Q -12.5,-6 0,6 Q 12.5,18 25,6" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.3" />
          <path d="M -25,-6 Q -12.5,-18 0,-6 Q 12.5,6 25,-6" fill="none" stroke={stroke} strokeWidth="0.4" opacity="0.3" />
          <circle r="3" fill={fill} opacity="0.2" />
        </>
      );
    }

    case 'mountain':
      return (
        <>
          <polygon points="-20,10 -8,-15 0,-5 8,-18 20,10" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
          <polygon points="-8,-15 0,-5 8,-18 0,10" fill={fill} opacity="0.15" />
          <line x1="-8" y1="-15" x2="-8" y2="-10" stroke={stroke} strokeWidth="0.3" opacity="0.4" />
          <line x1="8" y1="-18" x2="8" y2="-12" stroke={stroke} strokeWidth="0.3" opacity="0.4" />
        </>
      );

    default:
      return <circle r="10" fill={fill} opacity="0.2" />;
  }
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
