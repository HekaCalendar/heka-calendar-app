/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE CIRCLE — Constellation of Souls
 * A living constellation showing connection, messaging, and shared rituals.
 * Center: you. Five souls orbiting. Lines pulse with messages and tasks.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';

interface FriendNode {
  name: string;
  icon: string;
  online: boolean;
  angle: number; // degrees
}

const FRIENDS: FriendNode[] = [
  { name: 'Luna', icon: '🌙', online: true, angle: -90 },
  { name: 'Sol', icon: '☀', online: true, angle: -18 },
  { name: 'Nova', icon: '🌟', online: false, angle: 54 },
  { name: 'Orion', icon: '⭐', online: true, angle: 126 },
  { name: 'Aurora', icon: '✨', online: false, angle: 198 },
];

const CX = 240;
const CY = 155;
const RADIUS = 88;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export const CircleShowcase: React.FC = () => {
  const [revealed, setRevealed] = useState(0);
  const [pulseMsg, setPulseMsg] = useState(0);
  const [pulseTask, setPulseTask] = useState(-1);

  // Staggered reveal: center -> friends -> lines -> badges
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const sequence = [
      200,   // center node
      500,   // friend 1
      700,   // friend 2
      900,   // friend 3
      1100,  // friend 4
      1300,  // friend 5
      1600,  // lines
      1900,  // badge 1
      2050,  // badge 2
      2200,  // badge 3
      2350,  // badge 4
    ];
    sequence.forEach((ms, i) => {
      timers.push(setTimeout(() => setRevealed((p) => Math.max(p, i + 1)), ms));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  // Periodic message pulse along a random line
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseMsg((p) => (p + 1) % FRIENDS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Periodic task pulse along a different line
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTask((p) => {
        let next = p + 1;
        if (next >= FRIENDS.length) next = 0;
        while (next === pulseMsg) {
          next = (next + 1) % FRIENDS.length;
        }
        return next;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [pulseMsg]);

  const friendPositions = FRIENDS.map((f) => polarToCartesian(CX, CY, RADIUS, f.angle));

  const nodeSize = 44;
  const centerSize = 52;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: 350, marginTop: 12 }}>
      {/* ═══════════════════════════════════════════════════════════════
          SVG CONSTELLATION LINES — draw in after nodes appear
         ═══════════════════════════════════════════════════════════════ */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {friendPositions.map((pos, idx) => {
          const isRevealed = revealed >= 7;
          return (
            <line
              key={`line-${idx}`}
              x1={CX}
              y1={CY}
              x2={pos.x}
              y2={pos.y}
              stroke="rgba(201, 162, 39, 0.12)"
              strokeWidth={1}
              strokeDasharray="4,6"
              opacity={isRevealed ? 1 : 0}
              style={{
                transition: `opacity 1s ease ${idx * 0.1}s`,
              }}
            />
          );
        })}

        {/* Message pulse dots traveling along lines */}
        {friendPositions.map((pos, idx) => (
          <circle
            key={`msg-pulse-${idx}`}
            r={3}
            fill="#58a6ff"
            opacity={pulseMsg === idx ? 0.8 : 0}
            style={{
              transition: 'opacity 0.3s ease',
              filter: 'drop-shadow(0 0 4px rgba(88,166,255,0.6))',
            }}
          >
            {pulseMsg === idx && (
              <animateMotion
                dur="1.5s"
                repeatCount="1"
                path={`M${CX},${CY} L${pos.x},${pos.y}`}
              />
            )}
          </circle>
        ))}

        {/* Task pulse dots traveling along lines (reverse direction) */}
        {friendPositions.map((pos, idx) => (
          <circle
            key={`task-pulse-${idx}`}
            r={3}
            fill="#d4af37"
            opacity={pulseTask === idx ? 0.9 : 0}
            style={{
              transition: 'opacity 0.3s ease',
              filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.6))',
            }}
          >
            {pulseTask === idx && (
              <animateMotion
                dur="1.5s"
                repeatCount="1"
                path={`M${pos.x},${pos.y} L${CX},${CY}`}
              />
            )}
          </circle>
        ))}
      </svg>

      {/* ═══════════════════════════════════════════════════════════════
          CENTER NODE — You
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: CX - centerSize / 2,
          top: CY - centerSize / 2,
          width: centerSize,
          height: centerSize,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(180,140,30,0.15))',
          border: '1.5px solid rgba(212, 175, 55, 0.5)',
          boxShadow: '0 0 30px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          opacity: revealed >= 1 ? 1 : 0,
          transform: revealed >= 1 ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <span style={{ fontSize: 20 }}>👤</span>
        <span
          style={{
            fontSize: 7,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#c9a227',
            marginTop: 2,
            fontFamily: "'Cinzel', Georgia, serif",
          }}
        >
          You
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FRIEND NODES — orbiting souls
         ═══════════════════════════════════════════════════════════════ */}
      {FRIENDS.map((friend, idx) => {
        const pos = friendPositions[idx];
        const isRevealed = revealed >= idx + 2;
        return (
          <div
            key={friend.name}
            style={{
              position: 'absolute',
              left: pos.x - nodeSize / 2,
              top: pos.y - nodeSize / 2,
              width: nodeSize,
              height: nodeSize,
              zIndex: 3,
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'scale(1)' : 'scale(0.6)',
              transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.08}s`,
            }}
          >
            {/* Avatar circle */}
            <div
              style={{
                width: nodeSize,
                height: nodeSize,
                borderRadius: '50%',
                background: friend.online
                  ? 'linear-gradient(135deg, rgba(124,179,66,0.2), rgba(67,160,71,0.1))'
                  : 'linear-gradient(135deg, rgba(120,120,140,0.15), rgba(80,80,100,0.08))',
                border: `1.5px solid ${friend.online ? 'rgba(124,179,66,0.4)' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: friend.online
                  ? '0 0 16px rgba(124,179,66,0.15)'
                  : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                position: 'relative',
              }}
            >
              {friend.icon}
              {/* Online dot */}
              {friend.online && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#4ade80',
                    border: '2px solid #0a0a0f',
                    boxShadow: '0 0 6px rgba(74,222,128,0.5)',
                    animation: 'circle-online-pulse 2s ease-in-out infinite',
                  }}
                />
              )}
            </div>
            {/* Name label */}
            <div
              style={{
                position: 'absolute',
                bottom: -14,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: friend.online ? 'rgba(201,162,39,0.65)' : 'rgba(255,255,255,0.3)',
                fontFamily: "'Cinzel', Georgia, serif",
                whiteSpace: 'nowrap',
              }}
            >
              {friend.name}
            </div>
          </div>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING MESSAGE BUBBLE — shows chat is happening
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 105,
          zIndex: 4,
          opacity: revealed >= 8 ? 1 : 0,
          transform: revealed >= 8 ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all 0.6s ease 0.2s',
        }}
      >
        <div
          style={{
            background: 'rgba(88, 166, 255, 0.1)',
            border: '1px solid rgba(88, 166, 255, 0.2)',
            borderRadius: '10px 10px 2px 10px',
            padding: '5px 10px',
            fontSize: 9,
            color: 'rgba(200, 220, 255, 0.8)',
            fontFamily: "'Inter', system-ui, sans-serif",
            maxWidth: 100,
            lineHeight: 1.3,
            backdropFilter: 'blur(4px)',
          }}
        >
          Full moon tonight 🌕
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FLOATING TASK SCROLL — shows ritual sharing
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          left: 125,
          top: 195,
          zIndex: 4,
          opacity: revealed >= 8 ? 1 : 0,
          transform: revealed >= 8 ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all 0.6s ease 0.4s',
        }}
      >
        <div
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: 8,
            padding: '5px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(4px)',
          }}
        >
          <span style={{ fontSize: 11 }}>📜</span>
          <span
            style={{
              fontSize: 9,
              color: 'rgba(212, 175, 55, 0.85)',
              fontFamily: "'Cinzel', Georgia, serif",
              letterSpacing: '0.05em',
            }}
          >
            Morning Ritual
          </span>
          <span
            style={{
              fontSize: 7,
              fontWeight: 700,
              color: '#4ade80',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Done
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURE BADGES — bottom row
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
          zIndex: 5,
          padding: '0 16px',
        }}
      >
        {[
          { icon: '⚡', label: 'Invite', detail: 'AURORA-X7K2', color: '#c9a227' },
          { icon: '💬', label: 'Message', detail: 'Real-time', color: '#58a6ff' },
          { icon: '📜', label: 'Rituals', detail: 'Shared tasks', color: '#d4af37' },
          { icon: '🌐', label: 'Community', detail: 'Vote & share', color: '#a78bfa' },
        ].map((badge, idx) => {
          const isRevealed = revealed >= 8 + idx;
          return (
            <div
              key={badge.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateY(0)' : 'translateY(8px)',
                transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.06}s`,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${badge.color}33`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  backdropFilter: 'blur(6px)',
                }}
              >
                <span style={{ fontSize: 14 }}>{badge.icon}</span>
                <span
                  style={{
                    fontSize: 6,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: badge.color,
                    fontFamily: "'Cinzel', Georgia, serif",
                  }}
                >
                  {badge.label}
                </span>
              </div>
              <span
                style={{
                  fontSize: 7,
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: "'Inter', system-ui, sans-serif",
                  letterSpacing: '0.05em',
                }}
              >
                {badge.detail}
              </span>
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
        Connect · Message · Ritual · Unite
      </div>
    </div>
  );
};

export default CircleShowcase;
