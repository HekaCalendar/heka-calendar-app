/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHART WHEEL - Interactive SVG Natal Chart Visualization
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Enterprise-grade circular chart wheel with precise Swiss Ephemeris positioning,
 * smooth animations, and rich interactivity. Renders planets, houses, aspects,
 * and pattern overlays with 60fps performance.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { NatalChart, NatalPlanet } from '../../services/natal/natalChart';
import { getSignFromLongitude, SIGN_BOUNDARIES_13 } from '../../types/core';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ChartWheelProps {
  chart: NatalChart;
  showAspects?: boolean;
  houseSystem?: 'placidus' | 'koch' | 'equal' | 'whole';
  size?: number | 'responsive';
  onPlanetClick?: (planetId: string, planet: NatalPlanet) => void;
  onHouseClick?: (houseNumber: number) => void;
  selectedPlanet?: string | null;
  className?: string;
}

export interface PlanetPosition {
  id: string;
  longitude: number;
  sign: string;
  degree: number;
  isRetrograde: boolean;
  house: number;
  dignity: string;
  symbol: string;
  color: string;
}

export interface HouseCusp {
  number: number;
  longitude: number;
  sign: string;
  degree: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx';
  orb: number;
  exact: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

// 12-sign zodiac order
const SIGNS_12 = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] as const;

// 13-sign zodiac order (includes Ophiuchus)
const SIGNS_13 = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                  'libra', 'scorpio', 'ophiuchus', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] as const;

const SIGN_SYMBOLS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
  ophiuchus: '⛎', // 13th sign
};

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '⛢', neptune: '♆', pluto: '♇',
  chiron: '⚷', lilith: '⚸', node: '☊',
};

const PLANET_COLORS: Record<string, string> = {
  sun: '#fbbf24',
  moon: '#c4b5fd',
  mercury: '#94a3b8',
  venus: '#f472b6',
  mars: '#ef4444',
  jupiter: '#a78bfa',
  saturn: '#64748b',
  uranus: '#22d3ee',
  neptune: '#3b82f6',
  pluto: '#9333ea',
  chiron: '#22c55e',
  lilith: '#dc2626',
  node: '#f59e0b',
};

const ASPECT_COLORS: Record<string, string> = {
  conjunction: '#fbbf24',
  sextile: '#22c55e',
  square: '#ef4444',
  trine: '#3b82f6',
  opposition: '#f59e0b',
  quincunx: '#a855f7',
};

const ASPECT_ANGLES: Record<string, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
  quincunx: 150,
};

const ZODIAC_COLORS: Record<string, string> = {
  fire: '#ef4444',
  earth: '#22c55e',
  air: '#3b82f6',
  water: '#8b5cf6',
};

const ELEMENT_BY_SIGN: Record<string, string> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'air', libra: 'air', aquarius: 'air',
  cancer: 'water', scorpio: 'water', pisces: 'water',
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHART WHEEL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const ChartWheel: React.FC<ChartWheelProps> = ({
  chart,
  showAspects = true,
  size = 600,
  onPlanetClick,
  onHouseClick,
  selectedPlanet,
  className,
}) => {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, rotation: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const svgSize = size === 'responsive' ? 600 : (size as number);
  const center = svgSize / 2;
  const radius = (svgSize / 2) - 40;

  // ═══════════════════════════════════════════════════════════════════════════
  // CALCULATE POSITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // Determine zodiac system from chart
  const use13Signs = chart.zodiacSystem === '13-sign';
  const SIGNS = use13Signs ? SIGNS_13 : SIGNS_12;

  const planetPositions = useMemo((): PlanetPosition[] => {
    return Object.entries(chart.planets)
      .filter(([id]) => PLANET_SYMBOLS[id])
      .map(([id, planet]) => {
        // Calculate degree within the actual sign boundary
        const sign = planet.sign;
        let degreeInSign = 0;
        
        if (use13Signs) {
          // Use actual constellation boundaries
          const normalized = ((planet.longitude % 360) + 360) % 360;
          const boundaries = Object.entries(SIGN_BOUNDARIES_13) as [string, [number, number]][];
          for (const [s, [start, end]] of boundaries) {
            if (s === sign && normalized >= start && normalized < end) {
              degreeInSign = normalized - start;
              break;
            }
          }
          // If still 0, use fallback
          if (degreeInSign === 0) {
            degreeInSign = normalized % (360 / 13);
          }
        } else {
          degreeInSign = planet.longitude % 30;
        }
        
        return {
          id,
          longitude: planet.longitude,
          sign,
          degree: degreeInSign,
          isRetrograde: planet.isRetrograde,
          house: planet.house,
          dignity: planet.dignity,
          symbol: PLANET_SYMBOLS[id] || '?',
          color: PLANET_COLORS[id] || '#fff',
        };
      })
      .sort((a, b) => a.longitude - b.longitude);
  }, [chart.planets, use13Signs]);

  const houseCusps = useMemo((): HouseCusp[] => {
    const cusps: HouseCusp[] = [];
    // cusps array has 12 elements at indices 0-11 (houses 1-12)
    for (let i = 0; i < 12; i++) {
      const longitude = chart.houses.cusps[i];
      if (typeof longitude === 'number') {
        // Use actual sign calculation
        const sign = getSignFromLongitude(longitude as any, use13Signs) as string;
        
        // Calculate degree within sign
        let degreeInSign = 0;
        if (use13Signs) {
          const normalized = ((longitude % 360) + 360) % 360;
          const boundaries = Object.entries(SIGN_BOUNDARIES_13) as [string, [number, number]][];
          for (const [s, [start, end]] of boundaries) {
            if (s === sign && normalized >= start && normalized < end) {
              degreeInSign = normalized - start;
              break;
            }
          }
          if (degreeInSign === 0) {
            degreeInSign = normalized % (360 / 13);
          }
        } else {
          degreeInSign = longitude % 30;
        }
        
        cusps.push({
          number: i + 1,
          longitude,
          sign,
          degree: degreeInSign,
        });
      }
    }
    return cusps;
  }, [chart.houses, use13Signs]);

  // Calculate aspects
  const aspects = useMemo((): Aspect[] => {
    if (!showAspects) return [];
    
    const result: Aspect[] = [];
    const planets = planetPositions;
    
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const p1 = planets[i];
        const p2 = planets[j];
        
        let diff = Math.abs(p1.longitude - p2.longitude);
        if (diff > 180) diff = 360 - diff;
        
        // Check each aspect type
        Object.entries(ASPECT_ANGLES).forEach(([type, angle]) => {
          const orb = Math.abs(diff - angle);
          const maxOrb = type === 'conjunction' || type === 'opposition' ? 8 : 6;
          
          if (orb < maxOrb) {
            result.push({
              planet1: p1.id,
              planet2: p2.id,
              type: type as Aspect['type'],
              orb,
              exact: orb < 2,
            });
          }
        });
      }
    }
    
    return result.sort((a, b) => a.orb - b.orb);
  }, [planetPositions, showAspects]);

  // ═══════════════════════════════════════════════════════════════════════════
  // COORDINATE HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  const polarToCartesian = useCallback((angle: number, r: number) => {
    const rad = ((angle - 90 - rotation) * Math.PI) / 180;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  }, [center, rotation]);

  const getSignSlicePath = useCallback((index: number, innerR: number, outerR: number) => {
    const startAngle = index * 30;
    const endAngle = (index + 1) * 30;
    
    const start = polarToCartesian(startAngle, outerR);
    const end = polarToCartesian(endAngle, outerR);
    const startInner = polarToCartesian(startAngle, innerR);
    const endInner = polarToCartesian(endAngle, innerR);
    
    const largeArc = 0;
    
    return `
      M ${startInner.x} ${startInner.y}
      L ${start.x} ${start.y}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y}
      L ${endInner.x} ${endInner.y}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}
      Z
    `;
  }, [polarToCartesian]);

  const getHouseSlicePath = useCallback((index: number, innerR: number, outerR: number) => {
    const cusp1 = houseCusps[index];
    const cusp2 = houseCusps[(index + 1) % 12];
    
    if (!cusp1 || !cusp2) return '';
    
    let startAngle = cusp1.longitude;
    let endAngle = cusp2.longitude;
    
    if (endAngle < startAngle) endAngle += 360;
    
    const start = polarToCartesian(startAngle, outerR);
    const end = polarToCartesian(endAngle, outerR);
    const startInner = polarToCartesian(startAngle, innerR);
    const endInner = polarToCartesian(endAngle, innerR);
    
    const angleDiff = endAngle - startAngle;
    const largeArc = angleDiff > 180 ? 1 : 0;
    
    return `
      M ${startInner.x} ${startInner.y}
      L ${start.x} ${start.y}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y}
      L ${endInner.x} ${endInner.y}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}
      Z
    `;
  }, [houseCusps, polarToCartesian]);

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERACTION HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      rotation,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + center;
    const centerY = rect.top + center;
    const angle1 = Math.atan2(dragStart.y - centerY, dragStart.x - centerX);
    const angle2 = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let deltaAngle = (angle2 - angle1) * (180 / Math.PI);
    
    setRotation(dragStart.rotation + deltaAngle);
  }, [isDragging, dragStart, center]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
      rotation,
    });
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + center;
    const centerY = rect.top + center;
    const angle1 = Math.atan2(dragStart.y - centerY, dragStart.x - centerX);
    const angle2 = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    let deltaAngle = (angle2 - angle1) * (180 / Math.PI);
    
    setRotation(dragStart.rotation + deltaAngle);
  }, [isDragging, dragStart, center]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove as EventListener);
      window.addEventListener('touchend', handleTouchEnd as EventListener);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove as EventListener);
        window.removeEventListener('touchend', handleTouchEnd as EventListener);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  const renderZodiacRing = () => {
    const innerR = radius * 0.75;
    const outerR = radius * 0.95;
    
    return (
      <g className="zodiac-ring">
        {SIGNS.map((sign, i) => {
          const element = ELEMENT_BY_SIGN[sign];
          const color = ZODIAC_COLORS[element];
          const path = getSignSlicePath(i, innerR, outerR);
          const centerAngle = i * 30 + 15;
          const labelPos = polarToCartesian(centerAngle, (innerR + outerR) / 2);
          
          return (
            <g key={sign}>
              <path
                d={path}
                fill={`${color}15`}
                stroke={color}
                strokeWidth={0.5}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={color}
                fontSize={14}
              >
                {SIGN_SYMBOLS[sign]}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  const renderHouseRing = () => {
    const innerR = radius * 0.35;
    const outerR = radius * 0.73;
    
    return (
      <g className="house-ring">
        {houseCusps.map((cusp, i) => {
          const path = getHouseSlicePath(i, innerR, outerR);
          const isHovered = hoveredHouse === cusp.number;
          
          return (
            <path
              key={cusp.number}
              d={path}
              fill={isHovered ? 'rgba(147, 51, 234, 0.3)' : 'rgba(255, 255, 255, 0.03)'}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={0.5}
              onMouseEnter={() => setHoveredHouse(cusp.number)}
              onMouseLeave={() => setHoveredHouse(null)}
              onClick={() => onHouseClick?.(cusp.number)}
              style={{ cursor: onHouseClick ? 'pointer' : 'default' }}
            />
          );
        })}
        
        {/* House numbers */}
        {houseCusps.map((cusp, i) => {
          const nextCusp = houseCusps[(i + 1) % 12];
          const angle = cusp.longitude + ((nextCusp?.longitude || cusp.longitude + 30) - cusp.longitude) / 2;
          const pos = polarToCartesian(angle, (innerR + outerR) / 2);
          
          return (
            <text
              key={`num-${cusp.number}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="rgba(255, 255, 255, 0.4)"
              fontSize={10}
            >
              {cusp.number}
            </text>
          );
        })}
      </g>
    );
  };

  const renderAspects = () => {
    if (!showAspects || aspects.length === 0) return null;
    
    const innerR = radius * 0.1;
    const outerR = radius * 0.33;
    
    return (
      <g className="aspects">
        {aspects.slice(0, 15).map((aspect, i) => {
          const p1 = planetPositions.find(p => p.id === aspect.planet1);
          const p2 = planetPositions.find(p => p.id === aspect.planet2);
          if (!p1 || !p2) return null;
          
          const pos1 = polarToCartesian(p1.longitude, (innerR + outerR) / 2);
          const pos2 = polarToCartesian(p2.longitude, (innerR + outerR) / 2);
          
          const isExact = aspect.exact;
          const color = ASPECT_COLORS[aspect.type];
          
          return (
            <line
              key={`${aspect.planet1}-${aspect.planet2}-${i}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={color}
              strokeWidth={isExact ? 2 : 1}
              strokeOpacity={isExact ? 0.8 : 0.4}
              strokeDasharray={aspect.type === 'opposition' ? '4,4' : undefined}
            />
          );
        })}
      </g>
    );
  };

  // Detect overlaps and adjust positions - moved outside render
  const adjustedPositions = useMemo(() => {
    const minSeparation = 12;
    const positions = [...planetPositions];
    
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const diff = Math.abs(positions[i].longitude - positions[j].longitude);
        if (diff < minSeparation) {
          positions[j] = { ...positions[j], longitude: positions[j].longitude + minSeparation };
        }
      }
    }
    
    return positions;
  }, [planetPositions]);

  const renderPlanets = () => {
    const planetRadius = radius * 0.55;

    return (
      <g className="planets">
        {adjustedPositions.map((planet) => {
          const pos = polarToCartesian(planet.longitude, planetRadius);
          const isHovered = hoveredPlanet === planet.id;
          const isSelected = selectedPlanet === planet.id;
          const scale = isHovered || isSelected ? 1.3 : 1;
          
          return (
            <g
              key={planet.id}
              transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
              onMouseEnter={() => setHoveredPlanet(planet.id)}
              onMouseLeave={() => setHoveredPlanet(null)}
              onClick={() => onPlanetClick?.(planet.id, chart.planets[planet.id])}
              style={{ cursor: onPlanetClick ? 'pointer' : 'default' }}
            >
              {/* Glow effect */}
              <circle
                r={14}
                fill={planet.color}
                opacity={isHovered || isSelected ? 0.3 : 0}
              />
              
              {/* Planet symbol background */}
              <circle
                r={10}
                fill="#1a1a2e"
                stroke={planet.color}
                strokeWidth={isSelected ? 3 : 1.5}
              />
              
              {/* Planet symbol */}
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill={planet.color}
                fontSize={12}
                fontWeight={500}
              >
                {planet.symbol}
              </text>
              
              {/* Retrograde indicator */}
              {planet.isRetrograde && (
                <text
                  y={-8}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize={8}
                >
                  ℞
                </text>
              )}
              
              {/* Degree tooltip */}
              {(isHovered || isSelected) && (
                <g transform="translate(0, 20)">
                  <rect
                    x={-30}
                    y={0}
                    width={60}
                    height={18}
                    rx={4}
                    fill="rgba(0, 0, 0, 0.8)"
                  />
                  <text
                    textAnchor="middle"
                    y={12}
                    fill="#fff"
                    fontSize={9}
                  >
                    {planet.sign.slice(0, 3)} {planet.degree.toFixed(1)}°
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  };

  const renderCenter = () => {
    return (
      <g className="center">
        <circle
          r={radius * 0.32}
          fill="rgba(0, 0, 0, 0.2)"
          stroke="rgba(255, 255, 255, 0.05)"
        />
        
        <text
          x={center}
          y={center - 8}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.6)"
          fontSize={10}
        >
          {chart.name}
        </text>
        <text
          x={center}
          y={center + 8}
          textAnchor="middle"
          fill="#fbbf24"
          fontSize={11}
        >
          ASC {SIGN_SYMBOLS[houseCusps[0]?.sign || 'aries']}
        </text>
      </g>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  const isResponsive = size === 'responsive';
  const displaySize = isResponsive ? '100%' : size;

  return (
    <div 
      className={`chart-wheel-container ${className || ''}`}
      style={{
        width: displaySize,
        height: isResponsive ? 'auto' : size,
        maxWidth: isResponsive ? '100%' : undefined,
        aspectRatio: isResponsive ? '1/1' : undefined,
        userSelect: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <svg
        ref={svgRef}
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="chart-wheel"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ 
          cursor: isDragging ? 'grabbing' : 'grab',
          width: isResponsive ? '100%' : svgSize,
          height: isResponsive ? '100%' : svgSize,
          maxWidth: '100%',
          touchAction: 'none',
        }}
      >
        {/* Background */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="rgba(20, 20, 40, 0.5)"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={1}
        />
        
        {/* Zodiac Ring */}
        {renderZodiacRing()}
        
        {/* House Ring */}
        {renderHouseRing()}
        
        {/* Aspects */}
        {renderAspects()}
        
        {/* Center */}
        {renderCenter()}
        
        {/* Planets */}
        {renderPlanets()}
        
        {/* Rotation indicator */}
        <text
          x={center}
          y={svgSize - 10}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.3)"
          fontSize={10}
        >
          {isResponsive ? '↻' : 'Drag to rotate'} • {Math.round(rotation)}°
        </text>
      </svg>
    </div>
  );
};

export default ChartWheel;
