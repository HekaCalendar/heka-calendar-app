/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL SCRIBE — Constellation Drawing Animation
 * Stars appear one by one, connected by faint gold lines, forming a pattern.
 * Used in Tutorial Step 2: "The Sky Writes Back"
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  appearAt: number; // ms from start
  connections: number[]; // indices of connected stars
}

// A stylized constellation pattern (roughly Orion-like / geometric)
const CONSTELLATION: Star[] = [
  { x: 0.50, y: 0.15, size: 3.5, brightness: 1.0, appearAt: 0, connections: [1, 2] },
  { x: 0.25, y: 0.30, size: 2.5, brightness: 0.9, appearAt: 180, connections: [2, 3] },
  { x: 0.75, y: 0.30, size: 2.5, brightness: 0.9, appearAt: 360, connections: [4] },
  { x: 0.15, y: 0.55, size: 3.0, brightness: 1.0, appearAt: 540, connections: [5] },
  { x: 0.85, y: 0.55, size: 3.0, brightness: 1.0, appearAt: 720, connections: [6] },
  { x: 0.25, y: 0.75, size: 2.0, brightness: 0.8, appearAt: 900, connections: [6, 7] },
  { x: 0.75, y: 0.75, size: 2.0, brightness: 0.8, appearAt: 1080, connections: [7] },
  { x: 0.50, y: 0.90, size: 4.0, brightness: 1.2, appearAt: 1260, connections: [] },
];

const TOTAL_DURATION = 3000; // ms for full constellation reveal

export const CelestialScribe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shimmerPhase, setShimmerPhase] = useState(0); // 0=none, 1=active, 2=done
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

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

    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / TOTAL_DURATION, 1);

      // Clear
      ctx.clearRect(0, 0, rect.width, rect.height);

      const w = rect.width;
      const h = rect.height;

      // Draw connections first (behind stars)
      CONSTELLATION.forEach((star, i) => {
        const starProgress = Math.max(0, Math.min(1, (elapsed - star.appearAt) / 300));
        if (starProgress <= 0) return;

        star.connections.forEach((j) => {
          if (j <= i) return; // only draw each line once
          const other = CONSTELLATION[j];
          const otherProgress = Math.max(0, Math.min(1, (elapsed - other.appearAt) / 300));
          const lineProgress = Math.min(starProgress, otherProgress);
          if (lineProgress <= 0) return;

          ctx.beginPath();
          ctx.moveTo(star.x * w, star.y * h);
          ctx.lineTo(other.x * w, other.y * h);
          ctx.strokeStyle = `rgba(201, 162, 39, ${0.25 * lineProgress})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      // Draw stars
      CONSTELLATION.forEach((star) => {
        const starElapsed = elapsed - star.appearAt;
        if (starElapsed < 0) return;

        const appearProgress = Math.min(1, starElapsed / 400);
        const pulse = Math.sin(starElapsed * 0.005) * 0.3 + 0.7;
        const opacity = appearProgress * pulse;
        const currentSize = star.size * (0.5 + 0.5 * appearProgress);

        const sx = star.x * w;
        const sy = star.y * h;

        // Glow
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, currentSize * 6);
        glow.addColorStop(0, `rgba(201, 162, 39, ${0.4 * opacity})`);
        glow.addColorStop(0.5, `rgba(201, 162, 39, ${0.1 * opacity})`);
        glow.addColorStop(1, 'rgba(201, 162, 39, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(sx, sy, currentSize * 6, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(255, 248, 220, ${opacity})`;
        ctx.beginPath();
        ctx.arc(sx, sy, currentSize, 0, Math.PI * 2);
        ctx.fill();
      });

      // Shimmer sweep after constellation complete
      if (progress >= 1) {
        const shimmerElapsed = elapsed - TOTAL_DURATION;
        const shimmerProgress = Math.min(1, shimmerElapsed / 1200);

        if (shimmerProgress > 0 && shimmerProgress < 1) {
          const sweepX = shimmerProgress * w * 1.5 - w * 0.25;
          const grad = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0);
          grad.addColorStop(0, 'rgba(201, 162, 39, 0)');
          grad.addColorStop(0.5, 'rgba(201, 162, 39, 0.15)');
          grad.addColorStop(1, 'rgba(201, 162, 39, 0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }

        if (shimmerProgress >= 1 && shimmerPhase !== 2) {
          setShimmerPhase(2);
        } else if (shimmerProgress > 0 && shimmerPhase === 0) {
          setShimmerPhase(1);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [shimmerPhase]);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 520, height: 220, marginTop: 24 }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      {shimmerPhase === 2 && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(201,162,39,0.06), transparent 70%)',
          animation: 'constellationGlow 2s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
      <style>{`
        @keyframes constellationGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CelestialScribe;
