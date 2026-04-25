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
import { detectPatterns, type ChartPattern } from '../../services/calculations/patternDetection';

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
  cancer: 'water', scorpio: 'water', ophiuchus: 'water', pisces: 'water',
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
  const [rotation, setRotation] = useState(() => {
    // Standard natal chart orientation: ascendant at left (9 o'clock = 180°)
    const ascendantLongitude = (chart.houses?.ascendant as any)?.longitude ?? (chart.houses?.ascendant as number) ?? 0;
    return 180 - ascendantLongitude;
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, rotation: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const svgSize = size === 'responsive' ? 600 : (size as number);
  const center = svgSize / 2;
  const radius = (svgSize / 2) - 40;

  // ═══════════════════════════════════════════════════════════════════════════
  // CALCULATE POSITIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // Determine zodiac system from chart (supports legacy + new split fields)
  const use13Signs = chart.zodiacSystem === '13-sign' || chart.signCount === 13;
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

  // Calculate patterns for geometric overlays
  const patterns = useMemo((): ChartPattern[] => {
    if (!showAspects) return [];
    try {
      return detectPatterns(chart.planets as any).slice(0, 6);
    } catch {
      return [];
    }
  }, [chart.planets, showAspects]);

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

  const getSignSlicePath = useCallback((startAngle: number, endAngle: number, innerR: number, outerR: number) => {
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
          const color = ZODIAC_COLORS[element] || ZODIAC_COLORS.fire;
          
          let startAngle: number;
          let endAngle: number;
          let centerAngle: number;
          
          if (use13Signs) {
            const boundary = SIGN_BOUNDARIES_13[sign as keyof typeof SIGN_BOUNDARIES_13];
            startAngle = boundary[0];
            endAngle = boundary[1];
            centerAngle = (startAngle + endAngle) / 2;
          } else {
            startAngle = i * 30;
            endAngle = (i + 1) * 30;
            centerAngle = i * 30 + 15;
          }
          
          const path = getSignSlicePath(startAngle, endAngle, innerR, outerR);
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

  // Detect overlaps and adjust positions symmetrically, including wrap-around
  const adjustedPositions = useMemo(() => {
    const minSeparation = 10;
    const positions = [...planetPositions].sort((a, b) => a.longitude - b.longitude);
    if (positions.length < 2) return positions;

    // Resolve overlaps over multiple passes
    for (let pass = 0; pass < 5; pass++) {
      let moved = false;
      for (let i = 0; i < positions.length; i++) {
        const prev = positions[(i - 1 + positions.length) % positions.length];
        const curr = positions[i];

        // Check gap from previous (forward direction)
        let forwardGap = (curr.longitude - prev.longitude + 360) % 360;
        if (forwardGap === 0 && i > 0) forwardGap = 360; // allow full-circle for identical positions

        if (forwardGap < minSeparation) {
          const shift = (minSeparation - forwardGap) / 2;
          prev.longitude = (prev.longitude - shift + 360) % 360;
          curr.longitude = (curr.longitude + shift) % 360;
          moved = true;
        }
      }
      // Re-sort after each pass
      positions.sort((a, b) => a.longitude - b.longitude);
      if (!moved) break;
    }

    return positions;
  }, [planetPositions]);

  const renderPatterns = () => {
    if (!showAspects || patterns.length === 0) return null;
    
    const planetR = radius * 0.55;
    
    const getPlanetPos = (id: string) => {
      const p = adjustedPositions.find(ap => ap.id === id);
      if (!p) return null;
      return polarToCartesian(p.longitude, planetR);
    };
    
    return (
      <g className="patterns">
        {patterns.map((pattern, idx) => {
          const color = {
            'grand_trine': 'rgba(34, 197, 94, 0.35)',
            't_square': 'rgba(239, 68, 68, 0.35)',
            'grand_cross': 'rgba(168, 85, 247, 0.35)',
            'yod': 'rgba(245, 158, 11, 0.35)',
            'kite': 'rgba(59, 130, 246, 0.35)',
            'mystic_rectangle': 'rgba(236, 72, 153, 0.35)',
            'stellium': 'rgba(251, 191, 36, 0.25)',
            'cradle': 'rgba(99, 102, 241, 0.35)',
            'thors_hammer': 'rgba(220, 38, 38, 0.35)',
            'hard_rectangle': 'rgba(249, 115, 22, 0.35)',
            'grand_sextile': 'rgba(14, 165, 233, 0.35)',
          }[pattern.type] || 'rgba(147, 51, 234, 0.3)';
          
          const strokeColor = color.replace(/[0-9.]+\)$/, '0.8)');
          
          // Stellium: draw a glow halo around clustered planets
          if (pattern.type === 'stellium') {
            return pattern.planets.map((pid, pidx) => {
              const pos = getPlanetPos(pid);
              if (!pos) return null;
              return (
                <circle
                  key={`${idx}-stellium-${pidx}`}
                  cx={pos.x}
                  cy={pos.y}
                  r={18}
                  fill={color}
                  stroke={strokeColor}
                  strokeWidth={1}
                />
              );
            });
          }
          
          // Grand Trine / Kite: triangle connecting planets
          if (pattern.type === 'grand_trine' || pattern.type === 'kite') {
            const pts = pattern.planets.map(pid => getPlanetPos(pid)).filter(Boolean) as {x: number, y: number}[];
            if (pts.length < 3) return null;
            const path = `M ${pts.map(p => `${p.x} ${p.y}`).join(' L ')} ${pattern.type === 'grand_trine' ? 'Z' : ''}`;
            return (
              <path
                key={`${idx}-triangle`}
                d={path}
                fill={color}
                stroke={strokeColor}
                strokeWidth={2}
                strokeLinejoin="round"
              />
            );
          }
          
          // T-Square: opposition line + apex connector
          if (pattern.type === 't_square') {
            const [apex, ...base] = pattern.planets;
            const apexPos = getPlanetPos(apex);
            const basePos = base.map(pid => getPlanetPos(pid)).filter(Boolean) as {x: number, y: number}[];
            if (!apexPos || basePos.length < 2) return null;
            return (
              <g key={`${idx}-tsquare`}>
                <line x1={basePos[0].x} y1={basePos[0].y} x2={basePos[1].x} y2={basePos[1].y} stroke={strokeColor} strokeWidth={2} strokeDasharray="4,2" />
                <line x1={apexPos.x} y1={apexPos.y} x2={basePos[0].x} y2={basePos[0].y} stroke={strokeColor} strokeWidth={2} />
                <line x1={apexPos.x} y1={apexPos.y} x2={basePos[1].x} y2={basePos[1].y} stroke={strokeColor} strokeWidth={2} />
              </g>
            );
          }
          
          // Grand Cross: X shape
          if (pattern.type === 'grand_cross') {
            const pts = pattern.planets.map(pid => getPlanetPos(pid)).filter(Boolean) as {x: number, y: number}[];
            if (pts.length < 4) return null;
            return (
              <g key={`${idx}-cross`}>
                <line x1={pts[0].x} y1={pts[0].y} x2={pts[2].x} y2={pts[2].y} stroke={strokeColor} strokeWidth={2} />
                <line x1={pts[1].x} y1={pts[1].y} x2={pts[3].x} y2={pts[3].y} stroke={strokeColor} strokeWidth={2} />
                <polygon points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill={color} stroke={strokeColor} strokeWidth={1} />
              </g>
            );
          }
          
          // Yod: sextile base + two quincunx lines to apex
          if (pattern.type === 'yod') {
            const [apex, base1, base2] = pattern.planets;
            const apexPos = getPlanetPos(apex);
            const b1 = getPlanetPos(base1);
            const b2 = getPlanetPos(base2);
            if (!apexPos || !b1 || !b2) return null;
            return (
              <g key={`${idx}-yod`}>
                <line x1={b1.x} y1={b1.y} x2={b2.x} y2={b2.y} stroke={strokeColor} strokeWidth={2} />
                <line x1={apexPos.x} y1={apexPos.y} x2={b1.x} y2={b1.y} stroke={strokeColor} strokeWidth={2} strokeDasharray="3,3" />
                <line x1={apexPos.x} y1={apexPos.y} x2={b2.x} y2={b2.y} stroke={strokeColor} strokeWidth={2} strokeDasharray="3,3" />
                <circle cx={apexPos.x} cy={apexPos.y} r={8} fill={color} />
              </g>
            );
          }
          
          // Mystic Rectangle / Cradle: quadrilateral
          if (pattern.type === 'mystic_rectangle' || pattern.type === 'cradle' || pattern.type === 'hard_rectangle') {
            const pts = pattern.planets.map(pid => getPlanetPos(pid)).filter(Boolean) as {x: number, y: number}[];
            if (pts.length < 4) return null;
            return (
              <polygon
                key={`${idx}-quad`}
                points={pts.map(p => `${p.x},${p.y}`).join(' ')}
                fill={color}
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            );
          }
          
          return null;
        })}
      </g>
    );
  };

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
        
        {/* Pattern Overlays */}
        {renderPatterns()}
        
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
