/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MOTION CONTAINER — Choreographed entrance/exit wrapper
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from 'react';
import { useOnboarding } from './OnboardingEngine';

interface MotionContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}

export const MotionContainer: React.FC<MotionContainerProps> = ({
  children,
  className = '',
  delay = 0,
  staggerChildren = 0,
}) => {
  const { state } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Small delay to allow mount before animation
    const timer = setTimeout(() => setIsVisible(true), delay + 50);
    return () => clearTimeout(timer);
  }, [delay]);

  // Directional entrance based on navigation direction
  const getEntranceTransform = () => {
    if (state.exitDirection === 'right') return 'translateX(60px)';
    if (state.exitDirection === 'left') return 'translateX(-60px)';
    if (state.exitDirection === 'up') return 'translateY(40px)';
    return 'translateY(40px)';
  };

  return (
    <div
      ref={containerRef}
      className={`im-motion-container ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : getEntranceTransform(),
        transition: `opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {staggerChildren > 0 ? (
        React.Children.map(children, (child, i) => (
          <div
            key={i}
            className="im-stagger-child"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translate3d(0, 0, 0)' : 'translateY(20px)',
              transition: `opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${delay + staggerChildren * (i + 1)}ms, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${delay + staggerChildren * (i + 1)}ms`,
            }}
          >
            {child}
          </div>
        ))
      ) : (
        children
      )}
    </div>
  );
};

// ─── Parallax Layer ───
interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // 0 = static, 1 = moves with scroll, -0.5 = moves opposite
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 0.3,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      setOffset((progress - 0.5) * speed * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={`im-parallax-layer ${className}`}
      style={{
        transform: `translate3d(0, ${offset}px, 0)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
};

// ─── Fade In View ───
interface FadeInViewProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  className = '',
  threshold = 0.2,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`im-fade-in-view ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translateY(30px)',
        transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};

// ─── Pulse Ring ───
interface PulseRingProps {
  children: React.ReactNode;
  active?: boolean;
  color?: string;
}

export const PulseRing: React.FC<PulseRingProps> = ({
  children,
  active = true,
  color = 'rgba(201, 162, 39, 0.4)',
}) => {
  return (
    <div className="im-pulse-ring-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
      {active && (
        <span
          className="im-pulse-ring"
          style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: 'inherit',
            border: `2px solid ${color}`,
            animation: 'im-pulse-ring 2s ease-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </div>
  );
};
