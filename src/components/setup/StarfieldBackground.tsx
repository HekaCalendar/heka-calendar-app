/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STARFIELD BACKGROUND — Reusable cosmic canvas backdrop
 *
 * Simplified from CinematicWelcome. 150 stars, parallax depth,
 * occasional shooting stars, violet + gold nebula clouds.
 * Placed behind the wizard to give the entire first-boot experience
 * the same cinematic depth as the tutorial.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  depth: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export const StarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize stars
    starsRef.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.8 + 0.3,
      depth: Math.random(),
      brightness: Math.random() * 0.6 + 0.4,
      twinkleSpeed: Math.random() * 2 + 0.5,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawNebula = (time: number) => {
      // Violet nebula top-left
      const grad1 = ctx.createRadialGradient(
        window.innerWidth * 0.2, window.innerHeight * 0.15, 0,
        window.innerWidth * 0.2, window.innerHeight * 0.15, window.innerWidth * 0.5
      );
      grad1.addColorStop(0, `rgba(124, 58, 237, ${0.04 + Math.sin(time * 0.0003) * 0.015})`);
      grad1.addColorStop(1, 'rgba(124, 58, 237, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Gold nebula bottom-right
      const grad2 = ctx.createRadialGradient(
        window.innerWidth * 0.8, window.innerHeight * 0.85, 0,
        window.innerWidth * 0.8, window.innerHeight * 0.85, window.innerWidth * 0.45
      );
      grad2.addColorStop(0, `rgba(201, 162, 39, ${0.03 + Math.sin(time * 0.0004 + 1) * 0.01})`);
      grad2.addColorStop(1, 'rgba(201, 162, 39, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Subtle violet center
      const grad3 = ctx.createRadialGradient(
        window.innerWidth * 0.5, window.innerHeight * 0.3, 0,
        window.innerWidth * 0.5, window.innerHeight * 0.3, window.innerWidth * 0.35
      );
      grad3.addColorStop(0, `rgba(124, 58, 237, ${0.02 + Math.sin(time * 0.0005 + 2) * 0.008})`);
      grad3.addColorStop(1, 'rgba(124, 58, 237, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const drawStars = (time: number) => {
      const mx = mouseRef.current.x * 15;
      const my = mouseRef.current.y * 15;

      for (const star of starsRef.current) {
        const parallaxX = mx * star.depth;
        const parallaxY = my * star.depth;
        const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset);
        const alpha = star.brightness * (0.6 + twinkle * 0.4);

        ctx.beginPath();
        ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2);

        // Gold tint for brightest stars
        if (star.brightness > 0.85 && star.size > 1.2) {
          ctx.fillStyle = `rgba(212, 175, 55, ${alpha * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
        }
        ctx.fill();
      }
    };

    const updateShootingStars = (dt: number) => {
      const ss = shootingStarsRef.current;
      // Spawn new shooting star occasionally
      if (ss.length < 2 && Math.random() < 0.003) {
        const startSide = Math.random() < 0.5 ? 'top' : 'left';
        ss.push({
          x: startSide === 'top' ? Math.random() * window.innerWidth : -50,
          y: startSide === 'top' ? -20 : Math.random() * window.innerHeight * 0.5,
          vx: Math.random() * 3 + 2,
          vy: Math.random() * 2 + 1,
          length: Math.random() * 60 + 40,
          opacity: 1,
          life: 0,
          maxLife: Math.random() * 800 + 600,
        });
      }

      for (let i = ss.length - 1; i >= 0; i--) {
        const s = ss[i];
        s.x += s.vx * dt * 0.06;
        s.y += s.vy * dt * 0.06;
        s.life += dt;
        s.opacity = 1 - s.life / s.maxLife;
        if (s.life > s.maxLife || s.x > window.innerWidth + 100 || s.y > window.innerHeight + 100) {
          ss.splice(i, 1);
        }
      }
    };

    const drawShootingStars = () => {
      for (const s of shootingStarsRef.current) {
        const tailX = s.x - s.vx * s.length * 0.1;
        const tailY = s.y - s.vy * s.length * 0.1;
        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
        grad.addColorStop(0.5, `rgba(212, 175, 55, ${s.opacity * 0.6})`);
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.fill();
      }
    };

    let lastTime = performance.now();
    const animate = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawNebula(time);
      drawStars(time);
      updateShootingStars(dt);
      drawShootingStars();

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="starfield-bg"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};
