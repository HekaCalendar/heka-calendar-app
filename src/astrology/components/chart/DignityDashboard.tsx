/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DIGNITY DASHBOARD - Planetary Strength Visualization
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Displays each planet's dignity (domicile, exaltation, detriment, fall, neutral)
 * with visual power bars and scoring. Helps users understand which planetary
 * energies are strongest in their chart.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useMemo } from 'react';
import type { NatalChart } from '../../services/natal/natalChart';

interface DignityDashboardProps {
  chart: NatalChart;
  showScores?: boolean;
  highlightStrongest?: boolean;
}

interface PlanetDignity {
  id: string;
  name: string;
  symbol: string;
  sign: string;
  signSymbol: string;
  dignity: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral';
  score: number;
  house: number;
  color: string;
  description: string;
}

const PLANET_DATA: Record<string, { name: string; symbol: string; color: string }> = {
  sun: { name: 'Sun', symbol: '☉', color: '#fbbf24' },
  moon: { name: 'Moon', symbol: '☽', color: '#c4b5fd' },
  mercury: { name: 'Mercury', symbol: '☿', color: '#94a3b8' },
  venus: { name: 'Venus', symbol: '♀', color: '#f472b6' },
  mars: { name: 'Mars', symbol: '♂', color: '#ef4444' },
  jupiter: { name: 'Jupiter', symbol: '♃', color: '#a78bfa' },
  saturn: { name: 'Saturn', symbol: '♄', color: '#64748b' },
  uranus: { name: 'Uranus', symbol: '⛢', color: '#22d3ee' },
  neptune: { name: 'Neptune', symbol: '♆', color: '#3b82f6' },
  pluto: { name: 'Pluto', symbol: '♇', color: '#9333ea' },
};

const SIGN_SYMBOLS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
  ophiuchus: '⛎',
};

const DIGNITY_CONFIG: Record<string, { 
  label: string; 
  icon: string; 
  score: number; 
  color: string;
  description: string;
}> = {
  domicile: { 
    label: 'Domicile', 
    icon: '🏠', 
    score: 5, 
    color: '#22c55e',
    description: 'At home - maximum strength and expression',
  },
  exaltation: { 
    label: 'Exalted', 
    icon: '⬆️', 
    score: 4, 
    color: '#4ade80',
    description: 'Honored - excellent condition and visibility',
  },
  neutral: { 
    label: 'Neutral', 
    icon: '◆', 
    score: 0, 
    color: '#94a3b8',
    description: 'No essential strength or weakness',
  },
  detriment: { 
    label: 'Detriment', 
    icon: '⬇️', 
    score: -4, 
    color: '#f87171',
    description: 'Uncomfortable - challenged expression',
  },
  fall: { 
    label: 'Fall', 
    icon: '⚠️', 
    score: -5, 
    color: '#ef4444',
    description: 'Weakened - difficult to express fully',
  },
};

const HOUSE_MEANINGS: Record<number, string> = {
  1: 'Identity', 2: 'Resources', 3: 'Communication', 4: 'Home',
  5: 'Creativity', 6: 'Service', 7: 'Partnership', 8: 'Transformation',
  9: 'Philosophy', 10: 'Career', 11: 'Community', 12: 'Spirituality',
};

export const DignityDashboard: React.FC<DignityDashboardProps> = ({
  chart,
  showScores = true,
  highlightStrongest = true,
}) => {
  // Calculate planet dignities
  const planetDignities = useMemo((): PlanetDignity[] => {
    return Object.entries(chart.planets)
      .filter(([id]) => PLANET_DATA[id])
      .map(([id, planet]) => {
        const dignity = planet.dignity || 'neutral';
        const dignityConfig = DIGNITY_CONFIG[dignity];
        
        // Calculate angular house bonus
        const angularHouses = [1, 4, 7, 10];
        const angularBonus = angularHouses.includes(planet.house) ? 1 : 0;
        
        return {
          id,
          name: PLANET_DATA[id]?.name || id,
          symbol: PLANET_DATA[id]?.symbol || '?',
          sign: planet.sign,
          signSymbol: SIGN_SYMBOLS[planet.sign] || '?',
          dignity,
          score: dignityConfig.score + angularBonus,
          house: planet.house,
          color: PLANET_DATA[id]?.color || '#fff',
          description: dignityConfig.description,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [chart]);

  // Get strongest and weakest
  const strongest = planetDignities.filter(p => p.score >= 4);
  const challenged = planetDignities.filter(p => p.score <= -4);

  const renderPlanetRow = (planet: PlanetDignity, index: number) => {
    const dignityConfig = DIGNITY_CONFIG[planet.dignity];
    const isStrong = planet.score >= 4;
    const isChallenged = planet.score <= -4;
    
    // Calculate power bar
    const powerPercent = ((planet.score + 5) / 10) * 100;
    
    // Determine border color
    let borderColor = 'transparent';
    if (isStrong) borderColor = dignityConfig.color;
    else if (isChallenged) borderColor = '#ef4444';
    
    return (
      <div
        key={planet.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
          borderLeft: `3px solid ${borderColor}`,
          transition: 'all 0.2s ease',
        }}
      >
        {/* Planet Symbol */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.3)',
          border: `2px solid ${planet.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: planet.color,
          flexShrink: 0,
        }}>
          {planet.symbol}
        </div>

        {/* Planet Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '4px',
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#fff',
            }}>
              {planet.name}
            </span>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}>
              {planet.signSymbol} {planet.sign}
            </span>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              background: `${dignityConfig.color}20`,
              color: dignityConfig.color,
              borderRadius: '4px',
            }}>
              {dignityConfig.icon} {dignityConfig.label}
            </span>
          </div>
          
          {/* House & Power Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.4)',
            }}>
              House {planet.house} • {HOUSE_MEANINGS[planet.house]}
            </span>
            
            {/* Power Bar */}
            <div style={{
              flex: 1,
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              maxWidth: '100px',
            }}>
              <div style={{
                width: `${powerPercent}%`,
                height: '100%',
                background: dignityConfig.color,
                borderRadius: '2px',
                transition: 'width 0.5s ease',
              }} />
            </div>
            
            {showScores && (
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: dignityConfig.color,
                width: '28px',
                textAlign: 'right',
              }}>
                {planet.score > 0 ? `+${planet.score}` : planet.score}
              </span>
            )}
          </div>
        </div>

        {/* Description Tooltip */}
        <div 
          title={planet.description}
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'help',
            flexShrink: 0,
          }}
        >
          ?
        </div>
      </div>
    );
  };

  return (
    <div style={{
      background: 'rgba(20, 20, 40, 0.5)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#fff',
            margin: 0,
          }}>
            Planetary Dignities
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.5)',
            margin: '4px 0 0 0',
          }}>
            Essential strength of each planet
          </p>
        </div>
        
        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: '12px',
          fontSize: '11px',
        }}>
          <span style={{ color: '#22c55e' }}>🏠 Strong</span>
          <span style={{ color: '#94a3b8' }}>◆ Neutral</span>
          <span style={{ color: '#ef4444' }}>⚠️ Challenged</span>
        </div>
      </div>

      {/* Summary Cards */}
      {highlightStrongest && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          padding: '16px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          {/* Strongest Planets */}
          <div style={{
            padding: '12px',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
          }}>
            <div style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#4ade80',
              marginBottom: '6px',
            }}>
              🏠 Strongest
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              {strongest.length > 0 ? strongest.slice(0, 3).map(p => (
                <span key={p.id} style={{
                  fontSize: '14px',
                  color: '#fff',
                }}>
                  {p.symbol} {p.name}
                </span>
              )) : (
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  No planets in domicile/exaltation
                </span>
              )}
            </div>
          </div>

          {/* Challenged Planets */}
          <div style={{
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}>
            <div style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#f87171',
              marginBottom: '6px',
            }}>
              ⚠️ Growth Areas
            </div>
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}>
              {challenged.length > 0 ? challenged.slice(0, 3).map(p => (
                <span key={p.id} style={{
                  fontSize: '14px',
                  color: '#fff',
                }}>
                  {p.symbol} {p.name}
                </span>
              )) : (
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                  No planets in detriment/fall
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Planet List */}
      <div>
        {planetDignities.map((planet, index) => renderPlanetRow(planet, index))}
      </div>
    </div>
  );
};

export default DignityDashboard;
