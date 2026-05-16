/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SWISS EPHEMERIS VISUAL — The Precision
 * An animated astronomical instrument that communicates NASA-grade precision.
 * Golden astrolabe ring, orbiting planetary markers, sweeping precision beam,
 * and the 6,000-year data depth stat emerging from stardust.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef } from 'react';

interface Orbiter {
  radius: number;
  speed: number;
  phase: number;
  size: number;
  color: string;
  trail: { x: number; y: number; age: number }[];
}

const ORBITERS: Orbiter[] = [
  { radius: 0.18, speed: 1.2, phase: 0, size: 3, color: '#c9a227', trail: [] },
  { radius: 0.28, speed: 0.7, phase: 1.5, size: 2.5, color: '#e8d5a3', trail: [] },
  { radius: 0.38, speed: 0.4, phase: 3.0, size: 2, color: '#a88d4a', trail: [] },
  { radius: 0.48, speed: 0.2, phase: 4.5, size: 1.8, color: '#d4af37', trail: [] },
];

const TICK_COUNT = 72;
const SWEEP_DURATION = 4000;
const TOTAL_CYCLE = 6000;

export const SwissEphemerisVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.min(w, h) * 0.42;

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const cycleProgress = (elapsed % TOTAL_CYCLE) / TOTAL_CYCLE;

      ctx.clearRect(0, 0, w, h);

      // ─── Background field ───
      const fieldGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius * 1.4);
      fieldGrad.addColorStop(0, 'rgba(201, 162, 39, 0.03)');
      fieldGrad.addColorStop(0.6, 'rgba(201, 162, 39, 0.01)');
      fieldGrad.addColorStop(1, 'rgba(201, 162, 39, 0)');
      ctx.fillStyle = fieldGrad;
      ctx.fillRect(0, 0, w, h);

      // ─── Outer decorative ring ───
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // ─── Tick marks (degree ring) ───
      for (let i = 0; i < TICK_COUNT; i++) {
        const angle = (i / TICK_COUNT) * Math.PI * 2;
        const isMajor = i % 6 === 0;
        const tickLen = isMajor ? 10 : 5;
        const tickAlpha = isMajor ? 0.3 : 0.12;

        const x1 = cx + Math.cos(angle) * (maxRadius - tickLen);
        const y1 = cy + Math.sin(angle) * (maxRadius - tickLen);
        const x2 = cx + Math.cos(angle) * maxRadius;
        const y2 = cy + Math.sin(angle) * maxRadius;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(201, 162, 39, ${tickAlpha})`;
        ctx.lineWidth = isMajor ? 1.5 : 0.8;
        ctx.stroke();

        if (isMajor) {
          const tx = cx + Math.cos(angle) * (maxRadius - 22);
          const ty = cy + Math.sin(angle) * (maxRadius - 22);
          ctx.fillStyle = `rgba(201, 162, 39, 0.2)`;
          ctx.font = '8px "Cinzel", Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${i * 5}`, tx, ty);
        }
      }

      // ─── Inner precision ring ───
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.12)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // ─── Orbiting bodies with trails ───
      ORBITERS.forEach((orb) => {
        const angle = orb.phase + cycleProgress * Math.PI * 2 * orb.speed * 2;
        const r = maxRadius * orb.radius;
        const ox = cx + Math.cos(angle) * r;
        const oy = cy + Math.sin(angle) * r;

        // Update trail
        orb.trail.push({ x: ox, y: oy, age: 0 });
        orb.trail = orb.trail.filter((t) => {
          t.age += 1;
          return t.age < 40;
        });

        // Draw trail
        orb.trail.forEach((t) => {
          const alpha = (1 - t.age / 40) * 0.3;
          const size = orb.size * (1 - t.age / 40) * 0.6;
          ctx.fillStyle = `rgba(201, 162, 39, ${alpha})`;
          ctx.beginPath();
          ctx.arc(t.x, t.y, size, 0, Math.PI * 2);
          ctx.fill();
        });

        // Glow
        const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.size * 5);
        glow.addColorStop(0, `rgba(201, 162, 39, 0.35)`);
        glow.addColorStop(0.5, `rgba(201, 162, 39, 0.1)`);
        glow.addColorStop(1, 'rgba(201, 162, 39, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.size * 5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = orb.color;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // ─── Sweeping precision beam ───
      const sweepAngle = ((elapsed % SWEEP_DURATION) / SWEEP_DURATION) * Math.PI * 2;
      const beamGrad = ctx.createLinearGradient(
        cx, cy,
        cx + Math.cos(sweepAngle) * maxRadius,
        cy + Math.sin(sweepAngle) * maxRadius
      );
      beamGrad.addColorStop(0, 'rgba(201, 162, 39, 0.25)');
      beamGrad.addColorStop(0.7, 'rgba(201, 162, 39, 0.05)');
      beamGrad.addColorStop(1, 'rgba(201, 162, 39, 0)');

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(sweepAngle);
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadius, -3);
      ctx.lineTo(maxRadius, 3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ─── Center crosshair ───
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.25)';
      ctx.lineWidth = 0.8;
      const crossSize = 8;
      ctx.beginPath();
      ctx.moveTo(cx - crossSize, cy);
      ctx.lineTo(cx + crossSize, cy);
      ctx.moveTo(cx, cy - crossSize);
      ctx.lineTo(cx, cy + crossSize);
      ctx.stroke();

      // ─── Floating data particles ───
      const particleCount = 24;
      for (let p = 0; p < particleCount; p++) {
        const pAngle = (p / particleCount) * Math.PI * 2 + cycleProgress * Math.PI;
        const pRadius = maxRadius * (0.55 + 0.45 * Math.sin(cycleProgress * Math.PI * 2 + p * 0.5));
        const px = cx + Math.cos(pAngle) * pRadius;
        const py = cy + Math.sin(pAngle) * pRadius;
        const pAlpha = 0.15 + 0.1 * Math.sin(elapsed * 0.003 + p);

        ctx.fillStyle = `rgba(201, 162, 39, ${pAlpha})`;
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // ─── 6,000 YEARS text (phased reveal) ───
      const textRevealProgress = Math.min(1, elapsed / 2500);
      if (textRevealProgress > 0) {
        const textAlpha = textRevealProgress;
        ctx.fillStyle = `rgba(201, 162, 39, ${textAlpha * 0.6})`;
        ctx.font = '11px "Cinzel", Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '0.3em';
        ctx.fillText('6,000 YEARS  \u00B7  \u00B10.001\u2033', cx, cy + maxRadius + 16);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520, height: 290, marginTop: 24 }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};
