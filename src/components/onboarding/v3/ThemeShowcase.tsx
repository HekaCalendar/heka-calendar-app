/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE VEIL OF FORMS — Theme & Font Showcase
 * A living cathedral that morphs through all 6 color palettes.
 * Top: morphing preview card. Middle: 6 theme swatches. Bottom: 6 font glyphs.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';
import { FONTS, THEME_LIST, FONT_LIST } from '../../../types/themes';

const CYCLE_MS = 1800;

const MOCK_DAY = 'Monday';
const MOCK_DATE = '15 March';
const MOCK_EVENT = 'Full Moon Ceremony';
const MOCK_TIME = '20:00';
const MOCK_TEMP = '24°C';

export const ThemeShowcase: React.FC = () => {
  const [themeIdx, setThemeIdx] = useState(0);
  const [revealed, setRevealed] = useState(0);

  const theme = THEME_LIST[themeIdx];
  const tc = theme.colors;

  // Auto-cycle themes
  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIdx((prev) => (prev + 1) % THEME_LIST.length);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  // Staggered reveal animation
  useEffect(() => {
    const total = THEME_LIST.length + FONT_LIST.length; // 12
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < total; i++) {
      timers.push(
        setTimeout(() => setRevealed((p) => Math.max(p, i + 1)), 300 + i * 120)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const previewTransition: React.CSSProperties = {
    transition: 'background-color 0.8s ease, border-color 0.8s ease, box-shadow 0.8s ease',
  };

  const textTransition: React.CSSProperties = {
    transition: 'color 0.8s ease',
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: 350, marginTop: 12 }}>
      {/* ═══════════════════════════════════════════════════════════════
          MORPHING PREVIEW CARD — The living temple
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 260,
          height: 130,
          borderRadius: 16,
          background: tc.bgCard,
          border: `1px solid ${tc.border}`,
          boxShadow: `0 4px 24px ${tc.primaryGlow}, inset 0 1px 0 ${tc.primaryMuted}`,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 3,
          ...previewTransition,
        }}
      >
        {/* Theme name badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: tc.primary,
              ...textTransition,
            }}
          >
            {theme.name}
          </span>
          <span style={{ fontSize: 14 }}>{theme.icon}</span>
        </div>

        {/* Day & Date */}
        <div>
          <div
            style={{
              fontFamily: FONTS.elegant.fonts.heading,
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: tc.textSecondary,
              marginBottom: 2,
              ...textTransition,
            }}
          >
            {MOCK_DAY}
          </div>
          <div
            style={{
              fontFamily: FONTS.elegant.fonts.display,
              fontSize: 22,
              fontWeight: 600,
              color: tc.text,
              lineHeight: 1.1,
              ...textTransition,
            }}
          >
            {MOCK_DATE}
          </div>
        </div>

        {/* Event row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: tc.primary,
              boxShadow: `0 0 6px ${tc.primaryGlow}`,
              ...previewTransition,
            }}
          />
          <span
            style={{
              fontFamily: FONTS.elegant.fonts.body,
              fontSize: 12,
              color: tc.text,
              ...textTransition,
            }}
          >
            {MOCK_EVENT}
          </span>
          <span
            style={{
              fontFamily: FONTS.minimalist.fonts.mono,
              fontSize: 10,
              color: tc.textMuted,
              marginLeft: 'auto',
              ...textTransition,
            }}
          >
            {MOCK_TIME}
          </span>
        </div>

        {/* Weather row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>☀</span>
          <span
            style={{
              fontFamily: FONTS.elegant.fonts.body,
              fontSize: 11,
              color: tc.textSecondary,
              ...textTransition,
            }}
          >
            {MOCK_TEMP} · Clear
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          THEME SWATCHES — 3×2 grid of living colour
         ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: 146,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          flexWrap: 'wrap',
          zIndex: 2,
          padding: '0 12px',
        }}
      >
        {THEME_LIST.map((t, idx) => {
          const isRevealed = revealed > idx;
          const isActive = themeIdx === idx;
          return (
            <div
              key={t.id}
              style={{
                width: 82,
                height: 52,
                borderRadius: 10,
                background: t.colors.bg,
                border: `1.5px solid ${isActive ? t.colors.primary : t.colors.border}`,
                boxShadow: isActive
                  ? `0 0 14px ${t.colors.primaryGlow}, inset 0 1px 0 ${t.colors.primaryMuted}`
                  : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.9)',
                transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 0.05}s`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: t.colors.gradientPrimary,
                }}
              />
              {/* Theme icon + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11 }}>{t.icon}</span>
                <span
                  style={{
                    fontSize: 8,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: t.colors.primary,
                    fontFamily: FONTS.elegant.fonts.heading,
                  }}
                >
                  {t.name.split(' ')[0]}
                </span>
              </div>
              {/* 3 colour dots: opening, core, closing */}
              <div style={{ display: 'flex', gap: 5 }}>
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: t.colors.opening,
                    boxShadow: `0 0 3px ${t.colors.openingGlow}`,
                  }}
                />
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: t.colors.core,
                    boxShadow: `0 0 3px ${t.colors.coreGlow}`,
                  }}
                />
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: t.colors.closing,
                    boxShadow: `0 0 3px ${t.colors.closingGlow}`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          FONT SAMPLES — Six voices of the temple
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
          zIndex: 2,
          padding: '0 8px',
        }}
      >
        {FONT_LIST.map((f, idx) => {
          const globalIdx = THEME_LIST.length + idx;
          const isRevealed = revealed > globalIdx;
          return (
            <div
              key={f.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateY(0)' : 'translateY(6px)',
                transition: `all 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${globalIdx * 0.04}s`,
              }}
            >
              {/* "Aa" glyph in the font's display face */}
              <div
                style={{
                  fontFamily: f.fonts.display,
                  fontSize: 20,
                  fontWeight: 600,
                  color: '#c9a227',
                  lineHeight: 1,
                  textShadow: '0 0 10px rgba(201,162,39,0.15)',
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Aa
              </div>
              {/* Font name */}
              <span
                style={{
                  fontFamily: FONTS.elegant.fonts.heading,
                  fontSize: 7,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(201, 162, 39, 0.5)',
                  whiteSpace: 'nowrap',
                }}
              >
                {f.name}
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
          fontFamily: FONTS.elegant.fonts.heading,
          fontSize: 10,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(201, 162, 39, 0.35)',
        }}
      >
        6 Palettes · 6 Typefaces · 36 Sacred Combinations
      </div>
    </div>
  );
};

export default ThemeShowcase;
