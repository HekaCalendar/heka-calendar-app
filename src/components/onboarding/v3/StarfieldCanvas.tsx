/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * STARFIELD CANVAS — Persistent background for all cinematic slides
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef } from 'react';
import { useVisibility } from '../../../hooks/useVisibility';

interface Star {
  x: number; y: number; size: number; depth: number;
  brightness: number; twinkleSpeed: number; twinkleOffset: number;
}

interface ShootingStar {
  x: number; y: number; vx: number; vy: number;
  length: number; opacity: number; life: number; maxLife: number;
}

const LOW_POWER_MEMORY = 4;

function getStarCount() {
  const memory = (navigator as any).deviceMemory;
  const cores = navigator.hardwareConcurrency || 4;
  if ((memory && memory <= LOW_POWER_MEMORY) || cores <= 4) return 80;
  return 200;
}

export const StarfieldCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const isVisible = useVisibility();

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

    starsRef.current = Array.from({ length: getStarCount() }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2.5 + 0.3,
      depth: Math.random(),
      brightness: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.015 + 0.003,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const spawnShootingStar = () => {
      if (shootingStarsRef.current.length >= 3) return;
      const side = Math.random() > 0.5 ? 'top' : 'left';
      const sx = side === 'top' ? Math.random() * window.innerWidth : -50;
      const sy = side === 'top' ? -50 : Math.random() * window.innerHeight * 0.5;
      const speed = Math.random() * 4 + 3;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      shootingStarsRef.current.push({
        x: sx, y: sy,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
        length: Math.random() * 80 + 40, opacity: 1, life: 0,
        maxLife: Math.random() * 60 + 40,
      });
    };

    const shootingInterval = setInterval(() => {
      if (Math.random() > 0.6) spawnShootingStar();
    }, 2000);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#05040a';
      ctx.fillRect(0, 0, w, h);

      // Nebula clouds
      const n1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.6);
      n1.addColorStop(0, 'rgba(124, 58, 237, 0.06)');
      n1.addColorStop(1, 'transparent');
      ctx.fillStyle = n1; ctx.fillRect(0, 0, w, h);

      const n2 = ctx.createRadialGradient(w * 0.7, h * 0.7, 0, w * 0.7, h * 0.7, w * 0.5);
      n2.addColorStop(0, 'rgba(201, 162, 39, 0.05)');
      n2.addColorStop(1, 'transparent');
      ctx.fillStyle = n2; ctx.fillRect(0, 0, w, h);

      const n3 = ctx.createRadialGradient(w * 0.5, h * 0.2, 0, w * 0.5, h * 0.2, w * 0.4);
      n3.addColorStop(0, 'rgba(124, 58, 237, 0.04)');
      n3.addColorStop(1, 'transparent');
      ctx.fillStyle = n3; ctx.fillRect(0, 0, w, h);

      const parallaxX = mouseRef.current.x * 15;
      const parallaxY = mouseRef.current.y * 10;

      starsRef.current.forEach((star) => {
        star.brightness += star.twinkleSpeed;
        const twinkle = 0.3 + Math.sin(star.brightness + star.twinkleOffset) * 0.35;
        const px = ((star.x + parallaxX * star.depth) % w + w) % w;
        const py = ((star.y + parallaxY * star.depth) % h + h) % h;

        const isGold = star.size > 2 && Math.sin(star.twinkleOffset * 3) > 0.7;
        if (isGold) {
          ctx.beginPath();
          ctx.arc(px, py, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${twinkle * 0.08})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(px, py, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${twinkle})`;
        } else {
          ctx.beginPath();
          ctx.arc(px, py, star.size * (0.7 + star.depth * 0.3), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * (0.5 + star.depth * 0.5)})`;
        }
        ctx.fill();
      });

      shootingStarsRef.current = shootingStarsRef.current.filter((ss) => {
        ss.x += ss.vx; ss.y += ss.vy; ss.life++;
        const progress = ss.life / ss.maxLife;
        ss.opacity = progress < 0.1 ? progress / 0.1 : progress > 0.7 ? (1 - progress) / 0.3 : 1;
        if (ss.life >= ss.maxLife || ss.x > w + 100 || ss.y > h + 100) return false;

        const tailLen = ss.length / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy);
        const tailX = ss.x - ss.vx * tailLen;
        const tailY = ss.y - ss.vy * tailLen;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.5, `rgba(201, 162, 39, ${ss.opacity * 0.3})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.opacity})`;
        ctx.fill();
        return true;
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(shootingInterval);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 10000 }} />;
};
