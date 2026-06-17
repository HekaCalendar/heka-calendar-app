/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ELEMENT TEMPLE - Alchemical Element Balance Visualization
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * A stunning visualization of elemental balance (fire/earth/air/water) rendered
 * as an alchemical temple. Animated orbs pulse with elemental energy strength.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useMemo } from 'react';
import type { NatalChart } from '../../services/natal/natalChart';

interface ElementTempleProps {
  chart: NatalChart;
  size?: number;
  showDetails?: boolean;
}

interface ElementData {
  name: string;
  count: number;
  percentage: number;
  color: string;
  gradient: string;
  symbol: string;
  planets: string[];
  description: string;
}

const ELEMENT_CONFIG: Record<string, Omit<ElementData, 'count' | 'percentage' | 'planets'>> = {
  fire: {
    name: 'Fire',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
    symbol: '🔥',
    description: 'Passion, inspiration, action, spirit',
  },
  earth: {
    name: 'Earth',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    symbol: '🌍',
    description: 'Stability, practicality, material, body',
  },
  air: {
    name: 'Air',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
    symbol: '💨',
    description: 'Intellect, communication, social, mind',
  },
  water: {
    name: 'Water',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
    symbol: '💧',
    description: 'Emotion, intuition, empathy, soul',
  },
};

const PLANET_NAMES: Record<string, string> = {
  sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars',
  jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
};

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '⛢', neptune: '♆', pluto: '♇',
};

import { SIGN_ELEMENTS_13 } from '../../types/core';

const SIGN_ELEMENTS: Record<string, string> = SIGN_ELEMENTS_13;

export const ElementTemple: React.FC<ElementTempleProps> = ({
  chart,
  size = 300,
  showDetails = true,
}) => {
  // Calculate element data
  const elements = useMemo((): ElementData[] => {
    const counts = chart.elements;
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    
    // Find planets in each element
    const planetsByElement: Record<string, string[]> = { fire: [], earth: [], air: [], water: [] };
    Object.entries(chart.planets).forEach(([planetId, planet]) => {
      const element = SIGN_ELEMENTS[planet.sign];
      if (element && planetsByElement[element]) {
        planetsByElement[element].push(planetId);
      }
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({
        ...ELEMENT_CONFIG[name],
        name,
        count,
        percentage: Math.round((count / total) * 100),
        planets: planetsByElement[name] || [],
      }))
      .sort((a, b) => b.count - a.count);
  }, [chart]);

  // Get dominant element
  const dominantElement = elements[0];
  const isBalanced = elements.every(e => e.count >= 2);

  // Calculate orb sizes based on percentage
  const getOrbSize = (percentage: number) => {
    const minSize = 60;
    const maxSize = 100;
    return minSize + (percentage / 100) * (maxSize - minSize);
  };

  const getOrbOpacity = (percentage: number) => {
    return 0.3 + (percentage / 100) * 0.7;
  };

  const containerSize = size;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '20px',
    }}>
      {/* Element Temple Visualization */}
      <div style={{
        position: 'relative',
        width: containerSize,
        height: containerSize,
      }}>
        {/* Background circle */}
        <div style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }} />

        {/* Element Orbs positioned in cardinal directions */}
        {elements.map((element, index) => {
          // Position: Fire(top), Earth(right), Air(bottom), Water(left)
          // Using percentage from edges with transform for true centering
          const positions = [
            { top: '8%', left: '50%', transform: 'translate(-50%, 0)' }, // Fire - top
            { top: '50%', right: '8%', transform: 'translate(0, -50%)' }, // Earth - right
            { bottom: '8%', left: '50%', transform: 'translate(-50%, 0)' }, // Air - bottom
            { top: '50%', left: '8%', transform: 'translate(0, -50%)' }, // Water - left
          ];
          const pos = positions[index];
          const orbSize = getOrbSize(element.percentage);
          
          return (
            <div
              key={element.name}
              style={{
                position: 'absolute',
                ...pos,
                width: orbSize,
                height: orbSize,
                borderRadius: '50%',
                background: element.gradient,
                opacity: getOrbOpacity(element.percentage),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 ${20 + element.count * 5}px ${element.color}50`,
                animation: `pulse-${element.name} ${3 + index * 0.5}s ease-in-out infinite`,
                transition: 'all 0.3s ease',
              }}
            >
              <span style={{ fontSize: orbSize * 0.4 }}>{element.symbol}</span>
              <span style={{
                fontSize: orbSize * 0.25,
                fontWeight: 700,
                color: '#fff',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              }}>
                {element.count}
              </span>
            </div>
          );
        })}

        {/* Center - Elemental Signature */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.5)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '4px',
          }}>
            Signature
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            color: dominantElement?.color || '#fff',
            textTransform: 'capitalize',
          }}>
            {isBalanced ? 'Balanced' : `${dominantElement?.name} Dominant`}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.4)',
            marginTop: '4px',
          }}>
            {dominantElement?.description}
          </div>
        </div>

        {/* Connecting lines */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {/* Cross lines */}
          <line x1="50%" y1="15%" x2="50%" y2="85%" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          <line x1="15%" y1="50%" x2="85%" y2="50%" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          
          {/* Diagonal lines */}
          <line x1="25%" y1="25%" x2="75%" y2="75%" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
          <line x1="75%" y1="25%" x2="25%" y2="75%" stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
        </svg>
      </div>

      {/* Element Details */}
      {showDetails && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          width: '100%',
        }}>
          {elements.map((element) => (
            <div
              key={element.name}
              style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                border: `1px solid ${element.color}30`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{element.symbol}</div>
              <div style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: element.color,
                fontWeight: 600,
              }}>
                {element.name}
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#fff',
                marginTop: '4px',
              }}>
                {element.count}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.4)',
              }}>
                {element.percentage}%
              </div>
              
              {/* Contributing planets */}
              {element.planets.length > 0 && (
                <div style={{
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '4px',
                  flexWrap: 'wrap',
                }}>
                  {element.planets.slice(0, 4).map((planet) => (
                    <span
                      key={planet}
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                      title={PLANET_NAMES[planet]}
                    >
                      {PLANET_SYMBOLS[planet]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Key CSS Animations */}
      <style>{`
        @keyframes pulse-Fire {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, 0) scale(1.1); }
        }
        @keyframes pulse-Earth {
          0%, 100% { transform: translate(0, -50%) scale(1); }
          50% { transform: translate(0, -50%) scale(1.1); }
        }
        @keyframes pulse-Air {
          0%, 100% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(-50%, 0) scale(1.1); }
        }
        @keyframes pulse-Water {
          0%, 100% { transform: translate(0, -50%) scale(1); }
          50% { transform: translate(0, -50%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default ElementTemple;
