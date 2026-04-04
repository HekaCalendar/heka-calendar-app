/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL GUIDANCE - Enhanced Daily/Weekly/Yearly
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect } from 'react';
import { 
  getRegionForLocation, 
  generateDailyGuidance,
  generateWeeklyGuidance,
  generateYearlyGuidance,
  calculateAspects,
  type CelestialSnapshot,
  type GuidanceReading,
  type CelestialRegion,
} from '../../services/guidance';
import { calculateCurrentSky, calculatePreciseMoonPhase } from '../../services/calculations/swissCalculations';

interface CelestialGuidanceProps {
  latitude: number;
  longitude: number;
}

type TimeFrame = 'daily' | 'weekly' | 'yearly';

const timeframeLabels: Record<TimeFrame, { label: string; subtitle: string }> = {
  daily: { label: 'Today', subtitle: 'Current celestial weather' },
  weekly: { label: 'This Week', subtitle: '7-day cosmic forecast' },
  yearly: { label: 'This Year', subtitle: `${new Date().getFullYear()} overview` },
};

export const CelestialGuidance: React.FC<CelestialGuidanceProps> = ({ 
  latitude, 
  longitude 
}) => {
  const [timeframe, setTimeframe] = useState<TimeFrame>('daily');
  const [guidance, setGuidance] = useState<GuidanceReading | null>(null);
  const [region, setRegion] = useState<CelestialRegion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateGuidance = async () => {
      setLoading(true);
      try {
        const reg = getRegionForLocation(longitude);
        setRegion(reg);

        if (timeframe === 'daily') {
          const skyData = await calculateCurrentSky(new Date());
          const moonPhase = skyData.positions.sun && skyData.positions.moon
            ? calculatePreciseMoonPhase(skyData.positions.sun, skyData.positions.moon)
            : { name: 'Unknown', illumination: 50, isWaxing: true, age: 0, phaseAngle: 0 };
          
          const aspects = calculateAspects(skyData.positions);
          const retrogrades = Object.values(skyData.positions)
            .filter(p => p.isRetrograde)
            .map(p => p.id);

          const snapshot: CelestialSnapshot = {
            date: new Date(),
            positions: skyData.positions,
            aspects,
            moonPhase: {
              name: moonPhase.name,
              illumination: moonPhase.illumination / 100,
              isWaxing: moonPhase.isWaxing,
            },
            retrogrades,
            notableEvents: [],
          };

          const reading = generateDailyGuidance(snapshot, reg);
          setGuidance(reading);
        } else if (timeframe === 'weekly') {
          const snapshots: CelestialSnapshot[] = [];
          for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const skyData = await calculateCurrentSky(date);
            const moonPhase = skyData.positions.sun && skyData.positions.moon
              ? calculatePreciseMoonPhase(skyData.positions.sun, skyData.positions.moon)
              : { name: 'Unknown', illumination: 50, isWaxing: true, age: 0, phaseAngle: 0 };
            
            snapshots.push({
              date,
              positions: skyData.positions,
              aspects: calculateAspects(skyData.positions),
              moonPhase: {
                name: moonPhase.name,
                illumination: moonPhase.illumination / 100,
                isWaxing: moonPhase.isWaxing,
              },
              retrogrades: Object.values(skyData.positions).filter(p => p.isRetrograde).map(p => p.id),
              notableEvents: [],
            });
          }
          const reading = generateWeeklyGuidance(snapshots, reg);
          setGuidance(reading);
        } else {
          const reading = generateYearlyGuidance(new Date().getFullYear(), reg);
          setGuidance(reading);
        }
      } catch (error) {
        console.error('[Guidance] Error:', error);
      } finally {
        setLoading(false);
      }
    };

    generateGuidance();
  }, [timeframe, latitude, longitude]);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>✦</div>
        <p>Calculating celestial guidance...</p>
      </div>
    );
  }

  if (!guidance || !region) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
        <p>Unable to generate guidance at this time.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 600, margin: '0 auto' }}>
      {/* Region Info */}
      <div 
        style={{
          textAlign: 'center',
          marginBottom: 24,
          padding: '16px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
          Your Celestial Region
        </div>
        <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>
          {region.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          {region.element} element • {region.quality} quality
        </div>
      </div>

      {/* Timeframe Selector */}
      <div 
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 24,
        }}
      >
        {(Object.keys(timeframeLabels) as TimeFrame[]).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            style={{
              flex: 1,
              padding: '12px 8px',
              background: timeframe === tf ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${timeframe === tf ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 10,
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 13, color: timeframe === tf ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}>
              {timeframeLabels[tf].label}
            </div>
          </button>
        ))}
      </div>

      {/* Overall Score */}
      <ScoreCard score={guidance.overallScore} />

      {/* Summary */}
      <div 
        style={{
          padding: '20px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 12,
          marginBottom: 24,
          borderLeft: `4px solid ${getScoreColor(guidance.overallScore)}`,
        }}
      >
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', fontStyle: 'italic' }}>
          {guidance.summary}
        </p>
      </div>

      {/* Key Themes */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Key Themes
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {guidance.keyThemes.map((theme, i) => (
            <span
              key={i}
              style={{
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 16,
                fontSize: 12,
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* Detailed Scores */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Life Areas
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ScoreBar label="Career" score={guidance.scores.career} />
          <ScoreBar label="Relationships" score={guidance.scores.relationships} />
          <ScoreBar label="Health" score={guidance.scores.health} />
          <ScoreBar label="Finances" score={guidance.scores.finances} />
          <ScoreBar label="Personal Growth" score={guidance.scores.personalGrowth} />
          <ScoreBar label="Timing" score={guidance.scores.timing} />
        </div>
      </div>

      {/* Best Days */}
      {guidance.bestDays && guidance.bestDays.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: '#22c55e', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            ✦ Best Days
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {guidance.bestDays.map((date, i) => (
              <span
                key={i}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(34,197,94,0.15)',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#4ade80',
                }}
              >
                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Planetary Highlights */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Planetary Highlights
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {guidance.planetaryHighlights.map((highlight, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 4, textTransform: 'capitalize' }}>
                {highlight.planet}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                {highlight.significance}
              </div>
              <div style={{ fontSize: 12, color: '#a78bfa', fontStyle: 'italic' }}>
                {highlight.advice}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lunar Guidance */}
      <div 
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(167,139,250,0.1), rgba(139,92,246,0.05))',
          borderRadius: 12,
          border: '1px solid rgba(167,139,250,0.2)',
        }}
      >
        <div style={{ fontSize: 12, color: '#a78bfa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          ☽ Lunar Guidance
        </div>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)' }}>
          {guidance.lunarGuidance}
        </p>
      </div>
    </div>
  );
};

const ScoreCard: React.FC<{ score: number }> = ({ score }) => {
  const color = getScoreColor(score);
  const label = score > 5 ? 'Excellent' : score > 2 ? 'Favorable' : score > -2 ? 'Mixed' : score > -5 ? 'Challenging' : 'Difficult';
  const emoji = score > 5 ? '✦' : score > 2 ? '◆' : score > -2 ? '◈' : score > -5 ? '◇' : '◊';
  
  return (
    <div 
      style={{
        textAlign: 'center',
        marginBottom: 24,
        padding: '24px',
        background: `linear-gradient(135deg, ${color}20, ${color}05)`,
        borderRadius: 16,
        border: `1px solid ${color}40`,
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: 32, fontWeight: 300, color, marginBottom: 4 }}>
        {score > 0 ? '+' : ''}{score.toFixed(1)}
      </div>
      <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {label}
      </div>
    </div>
  );
};

const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const color = getScoreColor(score);
  const width = Math.abs(score) * 10;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 100, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{label}</div>
      <div style={{ flex: 1, height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden' }}>
        <div 
          style={{
            width: `${width}%`,
            height: '100%',
            background: color,
            borderRadius: 4,
            marginLeft: score < 0 ? 'auto' : 0,
            marginRight: score < 0 ? 0 : 'auto',
            opacity: 0.8,
          }}
        />
      </div>
      <div style={{ width: 40, fontSize: 12, color, textAlign: 'right' }}>
        {score > 0 ? '+' : ''}{score.toFixed(0)}
      </div>
    </div>
  );
};

function getScoreColor(score: number): string {
  if (score > 5) return '#22c55e';
  if (score > 2) return '#4ade80';
  if (score > -2) return '#fbbf24';
  if (score > -5) return '#f87171';
  return '#ef4444';
}

export default CelestialGuidance;
