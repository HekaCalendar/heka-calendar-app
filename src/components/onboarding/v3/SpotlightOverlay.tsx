/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SPOTLIGHT OVERLAY — Gold ring + corner brackets only.
 * NO dimming backdrop. NO click blocking. The tooltip provides context.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';

interface SpotlightOverlayProps {
  selector?: string;
  padding?: number;
  enabled: boolean;
}

export const SpotlightOverlay: React.FC<SpotlightOverlayProps> = ({
  selector,
  padding = 14,
  enabled,
}) => {
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number; r: number } | null>(null);

  useEffect(() => {
    if (!enabled || !selector) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(selector);
      if (el) {
        const r = el.getBoundingClientRect();
        setRect({
          x: r.left - padding,
          y: r.top - padding,
          w: r.width + padding * 2,
          h: r.height + padding * 2,
          r: Math.min(14, Math.min(r.width, r.height) * 0.12),
        });
      }
    };

    updateRect();
    const interval = setInterval(updateRect, 200);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [selector, padding, enabled]);

  if (!enabled || !rect) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }}>
      {/* Gold pulse ring around the target */}
      <div
        style={{
          position: 'absolute',
          left: rect.x,
          top: rect.y,
          width: rect.w,
          height: rect.h,
          borderRadius: rect.r,
          border: '2.5px solid rgba(201, 162, 39, 0.55)',
          boxShadow: `
            0 0 0 4px rgba(201, 162, 39, 0.08),
            0 0 30px rgba(201, 162, 39, 0.18),
            0 0 60px rgba(201, 162, 39, 0.08),
            inset 0 0 20px rgba(201, 162, 39, 0.03)
          `,
          animation: 'tt-spotlight-pulse 2.5s ease-in-out infinite',
          transition: 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1), top 0.4s cubic-bezier(0.22, 1, 0.36, 1), width 0.4s cubic-bezier(0.22, 1, 0.36, 1), height 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />

      {/* Corner brackets */}
      {[
        { left: rect.x - 6, top: rect.y - 6, borderW: '2px 0 0 2px' },
        { left: rect.x + rect.w - 6, top: rect.y - 6, borderW: '2px 2px 0 0' },
        { left: rect.x - 6, top: rect.y + rect.h - 6, borderW: '0 0 2px 2px' },
        { left: rect.x + rect.w - 6, top: rect.y + rect.h - 6, borderW: '0 2px 2px 0' },
      ].map((corner, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: corner.left,
            top: corner.top,
            width: 12,
            height: 12,
            borderRadius: 2,
            borderColor: 'rgba(201, 162, 39, 0.4)',
            borderStyle: 'solid',
            borderWidth: corner.borderW,
            opacity: 0.7,
            transition: 'left 0.4s cubic-bezier(0.22, 1, 0.36, 1), top 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      ))}
    </div>
  );
};
