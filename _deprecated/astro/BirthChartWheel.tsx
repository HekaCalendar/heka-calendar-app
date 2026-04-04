/**
 * Birth Chart Wheel Component
 * SVG visualization of natal chart with planets, houses, and aspects
 */

import React from 'react';
import { NatalChart, ZodiacSign } from '../../types/astrology';

interface BirthChartWheelProps {
  natalChart: NatalChart;
  size?: number;
  use13Sign?: boolean;
  showAspects?: boolean;
}

// 12-sign zodiac
const ZODIAC_12: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// 13-sign zodiac (with Ophiuchus)
const ZODIAC_13: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio', 'ophiuchus',
  'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

// 13-sign boundaries (degrees)
const ZODIAC_13_BOUNDARIES = [
  { sign: 'aries', start: 0, end: 25.5 },
  { sign: 'taurus', start: 25.5, end: 51.5 },
  { sign: 'gemini', start: 51.5, end: 77 },
  { sign: 'cancer', start: 77, end: 102.5 },
  { sign: 'leo', start: 102.5, end: 128.5 },
  { sign: 'virgo', start: 128.5, end: 154 },
  { sign: 'libra', start: 154, end: 180 },
  { sign: 'scorpio', start: 180, end: 205 },
  { sign: 'ophiuchus', start: 205, end: 231 },
  { sign: 'sagittarius', start: 231, end: 257 },
  { sign: 'capricorn', start: 257, end: 282.5 },
  { sign: 'aquarius', start: 282.5, end: 308.5 },
  { sign: 'pisces', start: 308.5, end: 334 },
];

const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
  ophiuchus: '⛎'
};

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀',
  mars: '♂', jupiter: '♃', saturn: '♄', uranus: '♅',
  neptune: '♆', pluto: '♇', chiron: '⚷',
  northNode: '☊', southNode: '☋', lilith: '⚸',
  partOfFortune: '⊗', vertex: '℣'
};

export const BirthChartWheel: React.FC<BirthChartWheelProps> = ({
  natalChart,
  size = 400,
  use13Sign = false,
  showAspects = true
}) => {
  const ZODIAC_SIGNS = use13Sign ? ZODIAC_13 : ZODIAC_12;
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = (size / 2) - 20;
  const innerRadius = outerRadius * 0.65;
  const houseRadius = outerRadius * 0.85;
  
  // Convert longitude to SVG coordinates
  // Astrology: 0° = left (Libra/Autumnal equinox historically), moving counter-clockwise
  // But modern: 0° Aries at left, moving counter-clockwise
  // SVG: 0° = right, moving clockwise
  // So we need: 180° - longitude
  const longitudeToAngle = (longitude: number): number => {
    return (180 - longitude) * (Math.PI / 180);
  };
  
  const polarToCartesian = (radius: number, longitude: number) => {
    const angle = longitudeToAngle(longitude);
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };
  
  // Generate zodiac ring segments
  const renderZodiacRing = () => {
    const segments = use13Sign ? ZODIAC_13_BOUNDARIES : 
      ZODIAC_12.map((sign, i) => ({ sign, start: i * 30, end: (i + 1) * 30 }));
    
    return segments.map((segment, index) => {
      const sign = segment.sign as ZodiacSign;
      const startLong = segment.start;
      const endLong = segment.end;
      const startAngle = longitudeToAngle(startLong);
      const endAngle = longitudeToAngle(endLong);
      
      const x1 = centerX + outerRadius * Math.cos(startAngle);
      const y1 = centerY + outerRadius * Math.sin(startAngle);
      const x2 = centerX + outerRadius * Math.cos(endAngle);
      const y2 = centerY + outerRadius * Math.sin(endAngle);
      
      // Arc path
      const largeArc = endLong - startLong > 180 ? 1 : 0;
      const path = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 0 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      // Label position
      const midLong = startLong + 15;
      const labelPos = polarToCartesian(outerRadius - 15, midLong);
      
      return (
        <g key={sign}>
          <path
            d={path}
            fill={`var(--zodiac-${sign}, ${getZodiacColor(sign)})`}
            fillOpacity={sign === 'ophiuchus' ? 0.2 : 0.1}
            stroke={sign === 'ophiuchus' ? 'rgba(201, 177, 255, 0.5)' : 'rgba(212, 175, 55, 0.2)'}
            strokeWidth={sign === 'ophiuchus' ? 1 : 0.5}
          />
          <text
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={12}
            fill="#d4af37"
            fontFamily="serif"
          >
            {ZODIAC_SYMBOLS[sign]}
          </text>
        </g>
      );
    });
  };
  
  // Render house cusps
  const renderHouses = () => {
    if (!natalChart.houses) return null;
    
    return natalChart.houses.map((house) => {
      const pos = polarToCartesian(outerRadius, house.exactLongitude);
      const innerPos = polarToCartesian(innerRadius, house.exactLongitude);
      
      // House number position
      const numPos = polarToCartesian(houseRadius + 8, house.exactLongitude + 2);
      
      return (
        <g key={house.house}>
          <line
            x1={innerPos.x}
            y1={innerPos.y}
            x2={pos.x}
            y2={pos.y}
            stroke="rgba(212, 175, 55, 0.4)"
            strokeWidth={house.house === 1 || house.house === 10 ? 2 : 1}
          />
          <text
            x={numPos.x}
            y={numPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill="#888"
          >
            {house.house}
          </text>
        </g>
      );
    });
  };
  
  // Render planets
  const renderPlanets = () => {
    const mainPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
    const placedPositions: { planet: string; x: number; y: number }[] = [];
    
    return natalChart.positions
      .filter(pos => mainPlanets.includes(pos.planet) || pos.planet === 'northNode')
      .map((pos) => {
        const radius = innerRadius - 15 - (pos.house ? pos.house * 2 : 0);
        const basePos = polarToCartesian(radius, pos.exactLongitude);
        
        // Simple collision detection - offset if too close
        let x = basePos.x;
        let y = basePos.y;
        
        for (const placed of placedPositions) {
          const dx = x - placed.x;
          const dy = y - placed.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 18) {
            x += 15;
            y -= 10;
          }
        }
        
        placedPositions.push({ planet: pos.planet, x, y });
        
        return (
          <g key={pos.planet}>
            {/* Planet marker */}
            <circle
              cx={x}
              cy={y}
              r={12}
              fill="#1a1a2e"
              stroke="#d4af37"
              strokeWidth={1.5}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={14}
              fill="#fff"
            >
              {PLANET_SYMBOLS[pos.planet] || pos.planet[0].toUpperCase()}
            </text>
            
            {/* Retrograde marker */}
            {pos.isRetrograde && (
              <text
                x={x + 8}
                y={y - 8}
                textAnchor="middle"
                fontSize={8}
                fill="#ff6b6b"
              >
                ℞
              </text>
            )}
            
            {/* Degree line to rim */}
            <line
              x1={x}
              y1={y}
              x2={polarToCartesian(innerRadius, pos.exactLongitude).x}
              y2={polarToCartesian(innerRadius, pos.exactLongitude).y}
              stroke="rgba(255,255,255,0.2)"
              strokeDasharray="2,2"
            />
          </g>
        );
      });
  };
  
  // Render ascendant/mc markers
  const renderAngles = () => {
    if (!natalChart.houses) return null;
    
    const asc = natalChart.houses.find(h => h.house === 1);
    const mc = natalChart.houses.find(h => h.house === 10);
    
    return (
      <>
        {asc && (
          <g>
            <text
              x={polarToCartesian(outerRadius + 25, asc.exactLongitude).x}
              y={polarToCartesian(outerRadius + 25, asc.exactLongitude).y}
              textAnchor="middle"
              fontSize={10}
              fill="#4ecdc4"
            >
              ASC {Math.round(asc.exactLongitude)}°
            </text>
          </g>
        )}
        {mc && (
          <g>
            <text
              x={polarToCartesian(outerRadius + 25, mc.exactLongitude).x}
              y={polarToCartesian(outerRadius + 25, mc.exactLongitude).y}
              textAnchor="middle"
              fontSize={10}
              fill="#ff6b6b"
            >
              MC {Math.round(mc.exactLongitude)}°
            </text>
          </g>
        )}
      </>
    );
  };
  
  return (
    <div className="birth-chart-wheel">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius}
          fill="none"
          stroke="rgba(212, 175, 55, 0.3)"
          strokeWidth={1}
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={innerRadius}
          fill="rgba(10, 10, 15, 0.8)"
          stroke="rgba(212, 175, 55, 0.3)"
          strokeWidth={1}
        />
        
        {/* Center info */}
        <text
          x={centerX}
          y={centerY - 10}
          textAnchor="middle"
          fontSize={14}
          fill="#d4af37"
          fontWeight="bold"
        >
          {natalChart.houses ? 'Natal Chart' : 'No Birth Time'}
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          fontSize={10}
          fill="#888"
        >
          {natalChart.houses ? 'Houses Calculated' : 'Planets Only'}
        </text>
        
        {renderZodiacRing()}
        {renderHouses()}
        {renderPlanets()}
        {renderAngles()}
      </svg>
      
      {/* Legend */}
      <div className="chart-legend">
        {natalChart.ascendant?.sign && !isNaN(natalChart.ascendant?.degree ?? NaN) && (
          <div className="legend-item">
            <span className="legend-color asc" />
            <span>Ascendant: {capitalize(natalChart.ascendant?.sign)} {(natalChart.ascendant?.degree || 0).toFixed(1)}°</span>
          </div>
        )}
        {natalChart.midheaven?.sign && !isNaN(natalChart.midheaven?.degree ?? NaN) && (
          <div className="legend-item">
            <span className="legend-color mc" />
            <span>Midheaven: {capitalize(natalChart.midheaven?.sign)} {(natalChart.midheaven?.degree || 0).toFixed(1)}°</span>
          </div>
        )}
      </div>
      {/* Aspect Lines */}
      {showAspects && renderAspects()}
    </div>
  );
  
  // Render aspect lines between planets
  function renderAspects() {
    if (!natalChart.aspects || natalChart.aspects.length === 0) return null;
    
    const mainPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
    const majorAspects = natalChart.aspects.filter(a => 
      mainPlanets.includes(a.planet1) && 
      mainPlanets.includes(a.planet2) &&
      a.orb < 5 && // Only tight aspects
      ['conjunction', 'opposition', 'trine', 'square'].includes(a.type)
    );
    
    const aspectColors: Record<string, string> = {
      conjunction: '#ffd700',
      opposition: '#ff6b6b',
      trine: '#4ecdc4',
      square: '#ff8c42',
    };
    
    return (
      <g className="aspect-lines">
        {majorAspects.slice(0, 12).map((aspect, idx) => {
          const p1 = natalChart.positions.find(p => p.planet === aspect.planet1);
          const p2 = natalChart.positions.find(p => p.planet === aspect.planet2);
          if (!p1 || !p2) return null;
          
          const pos1 = polarToCartesian(innerRadius - 20, p1.exactLongitude);
          const pos2 = polarToCartesian(innerRadius - 20, p2.exactLongitude);
          
          return (
            <line
              key={idx}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={aspectColors[aspect.type] || '#888'}
              strokeWidth={Math.max(0.5, 2 - aspect.orb / 5)}
              strokeOpacity={0.6}
              strokeDasharray={aspect.type === 'opposition' ? '4,4' : undefined}
            />
          );
        })}
      </g>
    );
  }
};

function getZodiacColor(sign: ZodiacSign): string {
  const colors: Record<ZodiacSign, string> = {
    aries: '#ff6b6b', taurus: '#4ecdc4', gemini: '#ffe66d', cancer: '#a8e6cf',
    leo: '#ffd93d', virgo: '#95e1d3', libra: '#f38181', scorpio: '#aa96da',
    sagittarius: '#fcbad3', capricorn: '#a8d8ea', aquarius: '#96f7d6', pisces: '#f9f9f9',
    ophiuchus: '#c9b1ff'
  };
  return colors[sign] || '#888';
}

function capitalize(str: string | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default BirthChartWheel;
