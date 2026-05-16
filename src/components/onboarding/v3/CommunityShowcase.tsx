/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE ASSEMBLY — Community Showcase
 * A celestial council chamber where every voice shapes the sky.
 * Top: five feature pillars of the roadmap. Center: the collective voice orb.
 * Bottom: community holidays rising on votes. Caption: the call to participate.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';

interface FeaturePillar {
  icon: string;
  title: string;
  category: string;
  catColor: string;
  status: 'planned' | 'considering' | 'in-progress' | 'released';
  votes: number;
}

interface HolidayPetal {
  name: string;
  date: string;
  votesUp: number;
  votesDown: number;
}

const FEATURES: FeaturePillar[] = [
  { icon: '🔮', title: 'Birth Chart Sharing', category: 'Social', catColor: '#a78bfa', status: 'planned', votes: 124 },
  { icon: '🎙️', title: 'AI Voice Guidance', category: 'Premium', catColor: '#fbbf24', status: 'considering', votes: 89 },
  { icon: '📅', title: 'iCal & Google Sync', category: 'Integrations', catColor: '#34d399', status: 'in-progress', votes: 156 },
  { icon: '🌙', title: 'Dream Journal', category: 'Astrology', catColor: '#f472b6', status: 'considering', votes: 71 },
  { icon: '🔔', title: 'Smart Notifications', category: 'Productivity', catColor: '#60a5fa', status: 'in-progress', votes: 203 },
];

const HOLIDAYS: HolidayPetal[] = [
  { name: 'Starlight Festival', date: '06-21', votesUp: 47, votesDown: 3 },
  { name: 'Harvest Moon', date: '09-15', votesUp: 32, votesDown: 5 },
  { name: 'New Year Vision', date: '03-01', votesUp: 28, votesDown: 2 },
];

const STATUS_GLOW: Record<FeaturePillar['status'], string> = {
  planned: 'rgba(167,139,250,0.25)',
  considering: 'rgba(96,165,250,0.25)',
  'in-progress': 'rgba(251,191,36,0.35)',
  released: 'rgba(52,211,153,0.35)',
};

const STATUS_DOT: Record<FeaturePillar['status'], string> = {
  planned: '#a78bfa',
  considering: '#60a5fa',
  'in-progress': '#fbbf24',
  released: '#34d399',
};

export const CommunityShowcase: React.FC = () => {
  const [revealed, setRevealed] = useState(0);

  // Staggered reveal sequence
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Pillars 1-5
    FEATURES.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealed((p) => Math.max(p, i + 1)), 250 + i * 180));
    });
    // Orb
    timers.push(setTimeout(() => setRevealed((p) => Math.max(p, 6)), 1200));
    // Orbiting particles
    timers.push(setTimeout(() => setRevealed((p) => Math.max(p, 7)), 1500));
    // Holidays 1-3
    HOLIDAYS.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealed((p) => Math.max(p, 8 + i)), 1700 + i * 150));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const pillarW = 62;
  const pillarH = 88;
  const gap = 12;
  const totalW = FEATURES.length * pillarW + (FEATURES.length - 1) * gap;
  const startX = (480 - totalW) / 2;
  // Gentle upward arc: center lower, edges higher
  const arcY = [6, 10, 12, 10, 6];

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: 350, marginTop: 12 }}>
      {/* ═══════════════════════════════════════════════════════════════
          FEATURE PILLARS — The roadmap council
         ═══════════════════════════════════════════════════════════════ */}
      {FEATURES.map((f, idx) => {
        const isRevealed = revealed >= idx + 1;
        const x = startX + idx * (pillarW + gap);
        const y = arcY[idx];
        const maxVotes = 250;
        const barPct = Math.min((f.votes / maxVotes) * 100, 100);

        return (
          <div
            key={f.title}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: pillarW,
              height: pillarH,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${f.catColor}22`,
              boxShadow: `0 4px 20px ${STATUS_GLOW[f.status]}, inset 0 1px 0 ${f.catColor}15`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 4px',
              zIndex: 3,
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.85)',
              transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.05}s`,
              backdropFilter: 'blur(6px)',
            }}
          >
            {/* Icon */}
            <span style={{ fontSize: 18 }}>{f.icon}</span>

            {/* Title */}
            <span
              style={{
                fontSize: 7,
                fontWeight: 600,
                textAlign: 'center',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: "'Inter', system-ui, sans-serif",
                lineHeight: 1.2,
                padding: '0 2px',
              }}
            >
              {f.title}
            </span>

            {/* Category */}
            <span
              style={{
                fontSize: 6,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: f.catColor,
                fontFamily: "'Cinzel', Georgia, serif",
              }}
            >
              {f.category}
            </span>

            {/* Status dot */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: STATUS_DOT[f.status],
                  boxShadow: `0 0 4px ${STATUS_DOT[f.status]}`,
                  animation: f.status === 'in-progress' ? 'assembly-pulse-dot 1.8s ease-in-out infinite' : 'none',
                }}
              />
              <span
                style={{
                  fontSize: 6,
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  textTransform: 'capitalize',
                }}
              >
                {f.status.replace('-', ' ')}
              </span>
            </div>

            {/* Vote bar */}
            <div style={{ width: 44, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${barPct}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${f.catColor}88, ${f.catColor})`,
                  borderRadius: 2,
                  transition: 'width 1s ease 0.5s',
                }}
              />
            </div>
            <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>
              {f.votes}
            </span>
          </div>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════
          THE COLLECTIVE VOICE ORB — center of the assembly
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 118,
          transform: 'translateX(-50%)',
          zIndex: 4,
          opacity: revealed >= 6 ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }}
      >
        {/* Outer glow rings */}
        <div
          style={{
            position: 'absolute',
            inset: -20,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 65%)',
            animation: 'assembly-orb-breathe 4s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: -35,
            borderRadius: '50%',
            border: '1px solid rgba(201,162,39,0.06)',
            animation: 'assembly-orb-spin 20s linear infinite',
          }}
        />

        {/* Main orb */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(180,140,30,0.1))',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 0 30px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: 22 }}>🌐</span>
          <span
            style={{
              fontSize: 7,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#c9a227',
              marginTop: 2,
              fontFamily: "'Cinzel', Georgia, serif",
            }}
          >
            Voice
          </span>
        </div>

        {/* Orbiting particles (individual voices) */}
        {revealed >= 7 &&
          [0, 72, 144, 216, 288].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const r = 46;
            const px = r * Math.cos(rad);
            const py = r * Math.sin(rad);
            return (
              <div
                key={`particle-${i}`}
                style={{
                  position: 'absolute',
                  left: 32 + px - 3,
                  top: 32 + py - 3,
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'rgba(201,162,39,0.6)',
                  boxShadow: '0 0 6px rgba(201,162,39,0.4)',
                  animation: `assembly-particle-orbit 12s linear infinite`,
                  animationDelay: `${-i * 2.4}s`,
                }}
              />
            );
          })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HOLIDAY PETALS — community offerings
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: 36,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          zIndex: 3,
          padding: '0 20px',
        }}
      >
        {HOLIDAYS.map((h, idx) => {
          const isRevealed = revealed >= 8 + idx;
          const total = h.votesUp + h.votesDown;
          const upPct = total > 0 ? (h.votesUp / total) * 100 : 0;

          return (
            <div
              key={h.name}
              style={{
                width: 120,
                height: 50,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(124,179,66,0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '6px 10px',
                gap: 4,
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.08}s`,
                backdropFilter: 'blur(4px)',
              }}
            >
              {/* Name + date row */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.8)',
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {h.name}
                </span>
                <span
                  style={{
                    fontSize: 7,
                    color: 'rgba(201,162,39,0.6)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {h.date}
                </span>
              </div>

              {/* Vote bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${upPct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, rgba(74,222,128,0.5), #4ade80)',
                      borderRadius: 2,
                      transition: 'width 1s ease 0.3s',
                    }}
                  />
                </div>
                <span style={{ fontSize: 7, color: '#4ade80', fontFamily: "'JetBrains Mono', monospace" }}>
                  ▲ {h.votesUp}
                </span>
              </div>
            </div>
          );
        })}
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
          color: 'rgba(201, 162, 39, 0.35)',
        }}
      >
        Suggest · Vote · Shape the Future
      </div>
    </div>
  );
};

export default CommunityShowcase;
