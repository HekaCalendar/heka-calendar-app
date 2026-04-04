/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SANCTUARY ATMOSPHERE - The Living Environment
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The Sanctuary breathes. Its colors shift. Its space expands and contracts.
 * This is not a static UI. It is a responsive environment.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useEffect, useState } from 'react';
import { signEssences } from '../content/voidNarratives';

interface SanctuaryAtmosphereProps {
  moonSign: string;
  isVoid: boolean;
  children: React.ReactNode;
}

// Generate color palette based on sign and void status
function generateAtmosphere(sign: string, isVoid: boolean): {
  background: string;
  accent: string;
  text: string;
  muted: string;
  glow: string;
  letterSpacing: string;
} {
  const signData = signEssences[sign.toLowerCase()] || signEssences.cancer;
  const baseColor = signData.color;
  
  // Parse hex to RGB for manipulation
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 100, g: 100, b: 150 };
  };
  
  const rgb = hexToRgb(baseColor);
  
  // Create atmospheric colors - transparent to show CI background
  if (isVoid) {
    return {
      background: 'transparent',
      accent: baseColor,
      text: 'rgba(255, 255, 255, 0.9)',
      muted: 'rgba(255, 255, 255, 0.5)',
      glow: `0 0 60px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
      letterSpacing: '0.03em',
    };
  } else {
    return {
      background: 'transparent',
      accent: baseColor,
      text: 'rgba(255, 255, 255, 0.95)',
      muted: 'rgba(255, 255, 255, 0.6)',
      glow: `0 0 40px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`,
      letterSpacing: '0.01em',
    };
  }
}

export const SanctuaryAtmosphere: React.FC<SanctuaryAtmosphereProps> = ({
  moonSign,
  isVoid,
  children,
}) => {
  const [atmosphere, setAtmosphere] = useState(generateAtmosphere(moonSign, isVoid));
  const signData = signEssences[moonSign.toLowerCase()] || signEssences.cancer;
  
  useEffect(() => {
    setAtmosphere(generateAtmosphere(moonSign, isVoid));
  }, [moonSign, isVoid]);
  
  return (
    <div
      className="sanctuary-atmosphere"
      style={{
        minHeight: '100vh',
        width: '100%',
        background: atmosphere.background,
        color: atmosphere.text,
        boxShadow: atmosphere.glow,
        letterSpacing: atmosphere.letterSpacing,
        transition: 'all 1.5s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Ambient particles/stars during void */}
      {isVoid && <AmbientParticles signColor={signData.color} />}
      
      {/* Content wrapper */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        {children}
      </div>
    </div>
  );
};

// Ambient particles that drift during void periods
const AmbientParticles: React.FC<{ signColor: string }> = ({ signColor }) => {
  // Use static particles to avoid re-renders
  const particles = React.useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.2 + 0.05,
      delay: Math.random() * 10,
    })),
    []
  );
  
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        contain: 'strict',
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: signColor,
            opacity: p.opacity,
            willChange: 'transform',
            animation: `float 25s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default SanctuaryAtmosphere;
