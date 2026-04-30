/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CINEMATIC WELCOME — Canvas starfield with shooting stars and parallax depth
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState, useMemo, useRef } from 'react';

interface CinematicWelcomeProps {
  onBegin: () => void;
  onSkip: () => void;
  strings: {
    tutorialWelcomeSubtitle: string;
    tutorialWelcomeTagline: string;
    tutorialBegin: string;
    tutorialSkip: string;
  };
}

interface Star {
  x: number;
  y: number;
  size: number;
  depth: number; // 0 = far, 1 = near
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

export const CinematicWelcome: React.FC<CinematicWelcomeProps> = ({ onBegin, onSkip, strings }) => {
  const [phase, setPhase] = useState<'stars' | 'logo' | 'tagline' | 'grid' | 'ready'>('stars');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Phase transitions
  useEffect(() => {
    console.log('[HEKA] CinematicWelcome MOUNT');
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase('logo'), 600));
    timers.push(setTimeout(() => setPhase('tagline'), 1800));
    timers.push(setTimeout(() => setPhase('grid'), 3200));
    timers.push(setTimeout(() => setPhase('ready'), 4800));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Canvas animation
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
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize stars with depth layers
    starsRef.current = Array.from({ length: 200 }, () => ({
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
        x: sx,
        y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: Math.random() * 80 + 40,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 60 + 40,
      });
    };

    // Spawn shooting stars periodically
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

      // Deep space background
      ctx.fillStyle = '#05040a';
      ctx.fillRect(0, 0, w, h);

      // Nebula clouds
      const nebula1 = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.3, h * 0.3, w * 0.6);
      nebula1.addColorStop(0, 'rgba(124, 58, 237, 0.06)');
      nebula1.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, w, h);

      const nebula2 = ctx.createRadialGradient(w * 0.7, h * 0.7, 0, w * 0.7, h * 0.7, w * 0.5);
      nebula2.addColorStop(0, 'rgba(201, 162, 39, 0.05)');
      nebula2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, w, h);

      const nebula3 = ctx.createRadialGradient(w * 0.5, h * 0.2, 0, w * 0.5, h * 0.2, w * 0.4);
      nebula3.addColorStop(0, 'rgba(124, 58, 237, 0.04)');
      nebula3.addColorStop(1, 'transparent');
      ctx.fillStyle = nebula3;
      ctx.fillRect(0, 0, w, h);

      // Parallax offset based on mouse
      const parallaxX = mouseRef.current.x * 15;
      const parallaxY = mouseRef.current.y * 10;

      // Draw stars with depth-based parallax
      starsRef.current.forEach((star) => {
        star.brightness += star.twinkleSpeed;
        const twinkle = 0.3 + Math.sin(star.brightness + star.twinkleOffset) * 0.35;
        const px = star.x + parallaxX * star.depth;
        const py = star.y + parallaxY * star.depth;

        // Wrap around
        const wrappedX = ((px % w) + w) % w;
        const wrappedY = ((py % h) + h) % h;

        ctx.beginPath();
        ctx.arc(wrappedX, wrappedY, star.size * (0.7 + star.depth * 0.3), 0, Math.PI * 2);

        // Color based on depth and random gold stars
        const isGold = star.size > 2 && Math.sin(star.twinkleOffset * 3) > 0.7;
        if (isGold) {
          ctx.fillStyle = `rgba(212, 175, 55, ${twinkle * (0.6 + star.depth * 0.4)})`;
          // Gold glow
          ctx.beginPath();
          ctx.arc(wrappedX, wrappedY, star.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${twinkle * 0.08})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(wrappedX, wrappedY, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 175, 55, ${twinkle})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * (0.5 + star.depth * 0.5)})`;
        }
        ctx.fill();
      });

      // Draw shooting stars
      shootingStarsRef.current = shootingStarsRef.current.filter((ss) => {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life++;
        const progress = ss.life / ss.maxLife;
        ss.opacity = progress < 0.1 ? progress / 0.1 : progress > 0.7 ? (1 - progress) / 0.3 : 1;

        if (ss.life >= ss.maxLife || ss.x > w + 100 || ss.y > h + 100) return false;

        const tailX = ss.x - ss.vx * (ss.length / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy));
        const tailY = ss.y - ss.vy * (ss.length / Math.sqrt(ss.vx * ss.vx + ss.vy * ss.vy));

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

        // Head glow
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
      console.log('[HEKA] CinematicWelcome UNMOUNT');
      cancelAnimationFrame(animId);
      clearInterval(shootingInterval);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const months = useMemo(() => [
    { name: 'Apr', arc: 'opening' as const },
    { name: 'May', arc: 'core' as const },
    { name: 'Jun', arc: 'core' as const },
    { name: 'Jul', arc: 'core' as const },
    { name: 'Aug', arc: 'core' as const },
    { name: 'Hex', arc: 'core' as const },
    { name: 'Sep', arc: 'core' as const },
    { name: 'Oct', arc: 'core' as const },
    { name: 'Nov', arc: 'core' as const },
    { name: 'Dec', arc: 'core' as const },
    { name: 'Jan', arc: 'closing' as const },
    { name: 'Feb', arc: 'closing' as const },
    { name: 'Mar', arc: 'closing' as const },
  ], []);

  return (
    <div className="tt-welcome">
      <canvas ref={canvasRef} className="tt-welcome__canvas" />

      <div className="tt-welcome__content">
        {/* Ornamental top line */}
        <div
          className="tt-welcome__ornament"
          style={{
            width: phase !== 'stars' ? 100 : 0,
            opacity: phase !== 'stars' ? 1 : 0,
          }}
        />

        {/* HEKA Logo */}
        <h1
          className="tt-welcome__logo"
          style={{
            opacity: phase !== 'stars' ? 1 : 0,
            transform: phase === 'logo' ? 'translateY(20px)' : 'translateY(0)',
            transition: 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          HEKA
        </h1>

        {/* Subtitle */}
        <p
          className="tt-welcome__subtitle"
          style={{
            opacity: phase === 'tagline' || phase === 'grid' || phase === 'ready' ? 1 : 0,
            transform: phase === 'tagline' ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s, transform 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s',
          }}
        >
          {strings.tutorialWelcomeSubtitle}
        </p>

        {/* Tagline */}
        <p
          className="tt-welcome__tagline"
          style={{
            opacity: phase === 'tagline' || phase === 'grid' || phase === 'ready' ? 1 : 0,
            transition: 'opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.6s',
          }}
        >
          {strings.tutorialWelcomeTagline}
        </p>

        {/* Grid preview */}
        <div
          className="tt-welcome__grid"
          style={{
            opacity: phase === 'grid' || phase === 'ready' ? 1 : 0,
            transform: phase === 'grid' ? 'translateY(20px) scale(0.95)' : 'translateY(0) scale(1)',
            transition: 'opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1), transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {months.map((month, i) => (
            <div
              key={month.name}
              className={`tt-welcome__grid-cell tt-welcome__grid-cell--${month.arc}`}
              style={{
                opacity: phase === 'grid' || phase === 'ready' ? 1 : 0,
                transform: phase === 'grid' || phase === 'ready' ? 'scale(1)' : 'scale(0.8)',
                transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${i * 80}ms`,
              }}
            >
              {month.name}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className="tt-welcome__controls"
        style={{
          opacity: phase === 'ready' ? 1 : 0,
          transform: phase === 'ready' ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <button className="tt-welcome__btn" onClick={onBegin}>
          {strings.tutorialBegin}
        </button>
        <button className="tt-welcome__skip" onClick={onSkip}>
          {strings.tutorialSkip}
        </button>
      </div>
    </div>
  );
};
