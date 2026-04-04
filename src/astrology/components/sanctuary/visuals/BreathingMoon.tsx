/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BREATHING MOON - The Living Lunar Visual
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The Moon breathes. She expands and contracts with her own rhythm.
 * During void periods, her breath slows and deepens.
 * During active periods, she pulses with quickened life.
 * 
 * This is not decoration. This is representation.
 * The visual embodies the astronomical reality of lunar motion.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useRef, useState } from 'react';
import { VoidMoonData } from '../../../types';

interface BreathingMoonProps {
  data: VoidMoonData | null;
  size?: number;
  className?: string;
}

// Moon phases for visual representation
const moonPhaseVisuals: Record<string, { emoji: string; name: string; shadow: string }> = {
  'new': { emoji: '🌑', name: 'Dark Moon', shadow: 'inset -10px 0 20px rgba(0,0,0,0.8)' },
  'waxing-crescent': { emoji: '🌒', name: 'Waxing Crescent', shadow: 'inset -8px 0 16px rgba(0,0,0,0.6)' },
  'first-quarter': { emoji: '🌓', name: 'First Quarter', shadow: 'inset -5px 0 10px rgba(0,0,0,0.4)' },
  'waxing-gibbous': { emoji: '🌔', name: 'Waxing Gibbous', shadow: 'inset -3px 0 6px rgba(0,0,0,0.3)' },
  'full': { emoji: '🌕', name: 'Full Moon', shadow: '0 0 30px rgba(255,255,220,0.4)' },
  'waning-gibbous': { emoji: '🌖', name: 'Waning Gibbous', shadow: 'inset 3px 0 6px rgba(0,0,0,0.3)' },
  'last-quarter': { emoji: '🌗', name: 'Last Quarter', shadow: 'inset 5px 0 10px rgba(0,0,0,0.4)' },
  'waning-crescent': { emoji: '🌘', name: 'Waning Crescent', shadow: 'inset 8px 0 16px rgba(0,0,0,0.6)' },
};

// Calculate breath duration based on void status
// Void = slower, deeper breath (4-6 seconds)
// Active = quicker, engaged breath (2-3 seconds)
function calculateBreathDuration(isVoid: boolean): number {
  return isVoid ? 5 : 2.5;
}

// Calculate the moon's current phase from illumination
function getMoonPhase(illumination: number): keyof typeof moonPhaseVisuals {
  if (illumination < 0.05) return 'new';
  if (illumination < 0.2) return 'waxing-crescent';
  if (illumination < 0.45) return 'first-quarter';
  if (illumination < 0.55) return 'full';
  if (illumination < 0.75) return 'waning-gibbous';
  if (illumination < 0.95) return 'last-quarter';
  return 'waning-crescent';
}

export const BreathingMoon: React.FC<BreathingMoonProps> = ({ 
  data, 
  size = 200,
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(0.9);
  const [isInhaling, setIsInhaling] = useState(true);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  const isVoid = data?.isVoid ?? false;
  const breathDuration = calculateBreathDuration(isVoid);
  const illumination = data?.moonPhase?.illumination ?? 0.5;
  const phase = getMoonPhase(illumination);
  const phaseInfo = moonPhaseVisuals[phase];
  
  // Calculate atmosphere color based on sign
  const signColors: Record<string, string> = {
    'aries': '#dc2626', 'taurus': '#16a34a', 'gemini': '#facc15',
    'cancer': '#64748b', 'leo': '#f97316', 'virgo': '#65a30d',
    'libra': '#ec4899', 'scorpio': '#7c2d12', 'sagittarius': '#a855f7',
    'capricorn': '#374151', 'aquarius': '#06b6d4', 'pisces': '#3b82f6',
  };
  const moonSign = data?.moonSign?.toLowerCase() || 'cancer';
  const signColor = signColors[moonSign] || '#64748b';
  
  // Breathing animation using requestAnimationFrame for smoothness
  useEffect(() => {
    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const cycle = (elapsed % breathDuration) / breathDuration;
      
      // Sine wave for smooth inhale/exhale
      // 0 = beginning of inhale, 0.5 = full inhale, 1 = end of exhale
      const breathPhase = Math.sin(cycle * Math.PI);
      
      // Scale: 1.0 to 1.15 during inhale, back to 1.0 during exhale
      const newScale = 1 + (breathPhase * 0.12);
      setScale(newScale);
      
      // Opacity: slightly brighter during inhale
      const newOpacity = 0.85 + (breathPhase * 0.15);
      setOpacity(newOpacity);
      
      // Track inhale/exhale state for visual effects
      setIsInhaling(cycle < 0.5);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [breathDuration]);
  
  // Generate glow color based on void status and sign
  const glowColor = isVoid 
    ? `${signColor}40` // More subtle during void
    : `${signColor}60`;
  
  const outerGlow = isVoid
    ? `0 0 ${60 * scale}px ${glowColor}, 0 0 ${120 * scale}px ${glowColor}40`
    : `0 0 ${40 * scale}px ${glowColor}, 0 0 ${80 * scale}px ${glowColor}30`;
  
  return (
    <div 
      ref={containerRef}
      className={`breathing-moon-container ${className}`}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Outer atmosphere rings during void */}
      {isVoid && (
        <>
          <div
            style={{
              position: 'absolute',
              width: size * 1.4,
              height: size * 1.4,
              borderRadius: '50%',
              border: `1px solid ${signColor}20`,
              transform: `scale(${scale})`,
              transition: 'transform 0.1s linear',
              opacity: opacity * 0.5,
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: size * 1.8,
              height: size * 1.8,
              borderRadius: '50%',
              border: `1px solid ${signColor}10`,
              transform: `scale(${scale * 0.95})`,
              transition: 'transform 0.1s linear',
              opacity: opacity * 0.3,
            }}
          />
        </>
      )}
      
      {/* The Moon itself */}
      <div
        style={{
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: '50%',
          background: isVoid 
            ? `radial-gradient(circle at 30% 30%, ${signColor}30, ${signColor}10, transparent)`
            : `radial-gradient(circle at 30% 30%, #fefce8, #fef3c7, #fde68a)`,
          boxShadow: outerGlow,
          transform: `scale(${scale})`,
          transition: 'transform 0.1s linear, box-shadow 0.1s linear',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Phase shadow overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            boxShadow: isVoid ? 'none' : phaseInfo.shadow,
            opacity: isVoid ? 0.3 : 0.8,
          }}
        />
        
        {/* Moon emoji */}
        <span style={{ 
          filter: isVoid ? 'grayscale(0.3)' : 'none',
          opacity: isVoid ? 0.7 : 1,
          transition: 'all 0.5s ease',
        }}>
          {phaseInfo.emoji}
        </span>
      </div>
      
      {/* Subtle glow pulse indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: -16,
          width: size * 0.6,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${signColor}40, transparent)`,
          borderRadius: 1,
          opacity: isInhaling ? 0.6 : 0.2,
          transition: `opacity ${breathDuration / 2}s ease-in-out`,
        }}
      />
    </div>
  );
};

export default BreathingMoon;
