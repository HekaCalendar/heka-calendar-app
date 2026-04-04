/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL GUIDANCE v2 - Phase 2 Enhanced
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Now with:
 * - Natal chart integration
 * - Transit awareness
 * - Pattern insights
 * - Personalized templates (26K+ variations)
 * - Optional AI enhancement
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  getRegionForLocation,
  type CelestialRegion,
} from '../../services/guidance/regions';
import {
  personalizedEngine,
  type PersonalizedGuidanceReading,
  type LifeArea,
  type MorningBriefing as MorningBriefingType,
} from '../../services/guidance/personalizedEngine';
import type { NatalChart, CelestialBody } from '../../types';
import { calculateCurrentSky, calculatePreciseMoonPhase } from '../../services/calculations/swissCalculations';
import { getUnifiedChart } from '../../utils/chartBridge';

// Import sub-components
import { MorningBriefing } from './MorningBriefing';
import { BirthChartInput } from '../natal/BirthChartInput';
import { PatternDashboard } from '../patterns/PatternDashboard';

interface CelestialGuidanceV2Props {
  latitude: number;
  longitude: number;
  voidMoonData?: {
    isVoid: boolean;
    lastAspect?: string;
  };
  natalChart?: NatalChart | null;
}

type ViewMode = 'briefing' | 'full' | 'patterns' | 'natal-input';
type TimeFrame = 'daily' | 'weekly' | 'yearly';

const TIMEFRAME_LABELS: Record<TimeFrame, { label: string; subtitle: string }> = {
  daily: { label: 'Today', subtitle: 'Current celestial weather' },
  weekly: { label: 'This Week', subtitle: '7-day cosmic forecast' },
  yearly: { label: 'This Year', subtitle: `${new Date().getFullYear()} overview` },
};

const LIFE_AREA_ICONS: Record<LifeArea, string> = {
  career: '💼',
  relationships: '💕',
  health: '⚡',
  finances: '💰',
  personalGrowth: '🌱',
  timing: '⏰',
};

export const CelestialGuidanceV2: React.FC<CelestialGuidanceV2Props> = ({ 
  latitude, 
  longitude,
  voidMoonData,
  natalChart: propNatalChart,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('briefing');
  const [timeframe, setTimeframe] = useState<TimeFrame>('daily');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [morningBriefing, setMorningBriefing] = useState<MorningBriefingType | null>(null);
  const [fullGuidance, setFullGuidance] = useState<PersonalizedGuidanceReading | null>(null);
  const [region, setRegion] = useState<CelestialRegion | null>(null);
  const [selectedLifeArea, setSelectedLifeArea] = useState<LifeArea | null>(null);
  
  // Use natal chart from props OR fall back to unified chart bridge
  // The bridge checks both OLD (ProfileManager) and NEW (Redux) storage systems
  // Memoized to prevent localStorage reads on every render
  const unifiedChart = useMemo(() => getUnifiedChart(), []);
  const natalChart = propNatalChart ?? unifiedChart;
  
  // Cache AI enabled check to prevent localStorage reads on every call
  const aiEnabledRef = useRef<boolean>(false);
  
  // Check AI status once on mount
  useEffect(() => {
    const config = localStorage.getItem('celestial-ai-config');
    if (config) {
      try {
        const parsed = JSON.parse(config);
        aiEnabledRef.current = parsed.enabled === true && parsed.activeProvider && parsed.activeProvider !== 'template';
      } catch {
        aiEnabledRef.current = false;
      }
    }
  }, []);
  
  // Initialize
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      // Get region
      const reg = getRegionForLocation(longitude);
      setRegion(reg);
      
      // Generate morning briefing
      await generateMorningBriefing();
      
      setLoading(false);
    };
    
    init();
  }, [latitude, longitude]);
  
  // Check if AI enhancement is enabled (uses cached ref to avoid localStorage reads)
  const isAIEnabled = (): boolean => aiEnabledRef.current;
  
  // Generate morning briefing
  const generateMorningBriefing = async () => {
    try {
      const skyData = await calculateCurrentSky(new Date());
      const moonPhase = calculatePreciseMoonPhase(skyData.positions.sun, skyData.positions.moon);
      
      const retrogrades = Object.values(skyData.positions)
        .filter((p: CelestialBody) => p.isRetrograde)
        .map((p: CelestialBody) => p.id);
      
      const briefing = await personalizedEngine.generateMorningBriefing({
        positions: skyData.positions,
        moonPhase: {
          phase: moonPhase.name.toLowerCase().replace(' ', '-'),
          sign: skyData.positions.moon?.sign,
        },
        retrogrades,
        voidMoon: voidMoonData,
        useAI: isAIEnabled(),
      });
      
      setMorningBriefing(briefing);
    } catch (error) {
      console.error('[GuidanceV2] Error generating briefing:', error);
    }
  };
  
  // Generate full guidance
  const generateFullGuidance = useCallback(async () => {
    setLoading(true);
    try {
      const skyData = await calculateCurrentSky(new Date());
      const moonPhase = calculatePreciseMoonPhase(skyData.positions.sun, skyData.positions.moon);
      
      const retrogrades = Object.values(skyData.positions)
        .filter((p: CelestialBody) => p.isRetrograde)
        .map((p: CelestialBody) => p.id);
      
      const guidance = await personalizedEngine.generateGuidance({
        timeframe,
        positions: skyData.positions,
        moonPhase: {
          phase: moonPhase.name.toLowerCase().replace(' ', '-'),
          sign: skyData.positions.moon?.sign,
        },
        retrogrades,
        voidMoon: voidMoonData,
        useAI: isAIEnabled(),
      });
      
      setFullGuidance(guidance);
    } catch (error) {
      console.error('[GuidanceV2] Error generating guidance:', error);
    } finally {
      setLoading(false);
    }
  }, [timeframe, voidMoonData]);
  
  // Handle timeframe change
  useEffect(() => {
    if (viewMode === 'full') {
      generateFullGuidance();
    }
  }, [viewMode, generateFullGuidance]);
  
  // Handle natal chart save - parent will update the prop
  const handleChartCalculated = (_chart: NatalChart) => {
    setViewMode('briefing');
    generateMorningBriefing();
    // Note: The actual chart update happens in the parent (StarsHub) via Redux
  };
  
  // Render loading state
  if (loading && !morningBriefing && !fullGuidance) {
    return (
      <div style={{ 
        padding: '60px', 
        textAlign: 'center', 
        color: 'rgba(255,255,255,0.5)',
      }}>
        <div style={{ 
          fontSize: 48, 
          marginBottom: 20,
          animation: 'pulse 2s infinite',
        }}>✦</div>
        <p>Consulting the celestial spheres...</p>
      </div>
    );
  }
  
  // Render based on view mode
  switch (viewMode) {
    case 'briefing':
      return morningBriefing ? (
        <MorningBriefing
          briefing={morningBriefing}
          onDismiss={() => setViewMode('full')}
          onViewFullGuidance={() => setViewMode('full')}
        />
      ) : null;
      
    case 'natal-input':
      return (
        <BirthChartInput
          onChartCalculated={handleChartCalculated as any}
          onCancel={() => setViewMode(natalChart ? 'full' : 'briefing')}
        />
      );
      
    case 'patterns':
      return <PatternDashboard onClose={() => setViewMode('full')} />;
      
    case 'full':
    default:
      return (
        <div style={{ padding: '24px', maxWidth: 700, margin: '0 auto' }}>
          {/* Navigation Bar */}
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}>
            <NavButton 
              label="Morning Briefing" 
              active={false}
              onClick={() => setViewMode('briefing')}
            />
            <NavButton 
              label={natalChart ? 'Your Chart ✓' : 'Add Birth Chart'}
              active={false}
              highlight={!natalChart}
              onClick={() => setViewMode('natal-input')}
            />
            <NavButton 
              label="Your Patterns"
              active={false}
              onClick={() => setViewMode('patterns')}
            />
          </div>
          
          {/* Region Info */}
          {region && (
            <div style={{
              textAlign: 'center',
              marginBottom: 24,
              padding: '16px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 12,
            }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                Your Celestial Region
              </div>
              <div style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>
                {region.name}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {region.element} element • {region.quality}
              </div>
            </div>
          )}
          
          {/* Natal Chart Summary */}
          {natalChart && (
            <div style={{
              marginBottom: 24,
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(147,51,234,0.15), rgba(59,130,246,0.1))',
              borderRadius: 12,
              border: '1px solid rgba(147,51,234,0.3)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                  ✨ Personalized for You
                </span>
                <button
                  onClick={() => setViewMode('natal-input')}
                  style={{
                    fontSize: 12,
                    color: '#a78bfa',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
              </div>
              
              {/* Element Balance */}
              <div style={{
                display: 'flex',
                gap: 8,
                marginTop: 12,
              }}>
                {natalChart.elementalBalance && Object.entries(natalChart.elementalBalance).map(([element, count]) => (
                  <div key={element} style={{
                    flex: 1,
                    padding: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 8,
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: 10,
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.5)',
                      letterSpacing: 1,
                    }}>
                      {element}
                    </div>
                    <div style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: getElementColor(element),
                    }}>
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Timeframe Selector */}
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 24,
          }}>
            {(Object.keys(TIMEFRAME_LABELS) as TimeFrame[]).map((tf) => (
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
                <div style={{ 
                  fontSize: 13, 
                  color: timeframe === tf ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)',
                  fontWeight: timeframe === tf ? 500 : 400,
                }}>
                  {TIMEFRAME_LABELS[tf].label}
                </div>
              </button>
            ))}
          </div>
          
          {/* Main Guidance Content */}
          {fullGuidance ? (
            <FullGuidanceContent 
              guidance={fullGuidance}
              selectedLifeArea={selectedLifeArea}
              onSelectLifeArea={setSelectedLifeArea}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
              <p>Loading your personalized guidance...</p>
            </div>
          )}
        </div>
      );
  }
};

// Sub-component: Navigation Button
const NavButton: React.FC<{
  label: string;
  active: boolean;
  highlight?: boolean;
  onClick: () => void;
}> = ({ label, active, highlight, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px 16px',
      background: active ? 'rgba(255,255,255,0.15)' : highlight ? 'rgba(147,51,234,0.2)' : 'rgba(255,255,255,0.05)',
      border: `1px solid ${active ? 'rgba(255,255,255,0.3)' : highlight ? 'rgba(147,51,234,0.5)' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 8,
      cursor: 'pointer',
      fontSize: 13,
      color: highlight ? '#e9d5ff' : 'rgba(255,255,255,0.8)',
      transition: 'all 0.2s',
    }}
  >
    {label}
  </button>
);

// Sub-component: Full Guidance Content
const FullGuidanceContent: React.FC<{
  guidance: PersonalizedGuidanceReading;
  selectedLifeArea: LifeArea | null;
  onSelectLifeArea: (area: LifeArea | null) => void;
}> = ({ guidance, selectedLifeArea, onSelectLifeArea }) => {
  const currentReading = selectedLifeArea 
    ? guidance.lifeAreaReadings[selectedLifeArea]
    : guidance.overallReading;
  
  return (
    <>
      {/* Overall Score / Confidence */}
      <div style={{
        textAlign: 'center',
        marginBottom: 24,
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(147,51,234,0.2), rgba(59,130,246,0.1))',
        borderRadius: 16,
        border: '1px solid rgba(147,51,234,0.3)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>✦</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
          Guidance Confidence
        </div>
        <div style={{ 
          fontSize: 36, 
          fontWeight: 300, 
          color: '#fbbf24',
        }}>
          {guidance.confidence}%
        </div>
        {guidance.natalChart && (
          <div style={{ fontSize: 12, color: '#4ade80', marginTop: 8 }}>
            ✓ Personalized with natal chart
          </div>
        )}
        {currentReading.aiGenerated && (
          <div style={{ fontSize: 12, color: '#a78bfa', marginTop: 4 }}>
            ✨ AI-Enhanced via {currentReading.aiProvider} ({currentReading.aiModel})
          </div>
        )}
      </div>
      
      {/* Current Reading */}
      <div style={{
        padding: '24px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 16,
        marginBottom: 24,
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <h2 style={{
          fontSize: 18,
          fontWeight: 500,
          color: '#fbbf24',
          marginBottom: 12,
        }}>
          {currentReading.title}
        </h2>
        <p style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: 'rgba(255,255,255,0.85)',
          margin: 0,
        }}>
          {currentReading.narrative}
        </p>
        
        {/* Transit Context */}
        {currentReading.transitContext && (
          <div style={{
            marginTop: 16,
            padding: '12px 16px',
            background: 'rgba(147,51,234,0.1)',
            borderRadius: 8,
            borderLeft: '3px solid #9333ea',
          }}>
            <span style={{ fontSize: 12, color: '#a78bfa' }}>
              🌟 Transit: {currentReading.transitContext}
            </span>
          </div>
        )}
      </div>
      
      {/* Life Area Selector */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Focus Areas
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
        }}>
          {(Object.keys(guidance.lifeAreaReadings) as LifeArea[]).map((area) => (
            <button
              key={area}
              onClick={() => onSelectLifeArea(selectedLifeArea === area ? null : area)}
              style={{
                padding: '16px 12px',
                background: selectedLifeArea === area 
                  ? 'rgba(147,51,234,0.25)' 
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selectedLifeArea === area ? 'rgba(147,51,234,0.5)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 12,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>
                {LIFE_AREA_ICONS[area]}
              </div>
              <div style={{
                fontSize: 11,
                color: selectedLifeArea === area ? '#e9d5ff' : 'rgba(255,255,255,0.7)',
                textTransform: 'capitalize',
              }}>
                {area.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Practical Advice */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Practical Guidance
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {currentReading.advice.map((advice, i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}
            >
              <span style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'rgba(147,51,234,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                color: '#e9d5ff',
                flexShrink: 0,
              }}>
                {i + 1}
              </span>
              <span style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.5,
              }}>
                {advice}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI-Enhanced: Poetic Summary */}
      {currentReading.poeticSummary && (
        <div style={{
          marginBottom: 24,
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(124,58,237,0.08))',
          borderRadius: 12,
          border: '1px solid rgba(139,92,246,0.2)',
        }}>
          <div style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#a78bfa',
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <span>✨</span>
            <span>Celestial Essence {currentReading.aiGenerated && '(AI-Enhanced)'}</span>
          </div>
          <p style={{
            fontSize: 16,
            fontStyle: 'italic',
            color: '#ddd6fe',
            margin: 0,
            lineHeight: 1.6,
          }}>
            {currentReading.poeticSummary}
          </p>
        </div>
      )}
      
      {/* AI-Enhanced: Rituals */}
      {currentReading.rituals && currentReading.rituals.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Sacred Rituals
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentReading.rituals.map((ritual, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 16px',
                  background: 'rgba(16,185,129,0.08)',
                  borderRadius: 10,
                  border: '1px solid rgba(16,185,129,0.15)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(16,185,129,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  flexShrink: 0,
                }}>
                  🕯️
                </span>
                <span style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.5,
                }}>
                  {ritual}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* AI-Enhanced: Affirmations */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))',
        borderRadius: 12,
        border: '1px solid rgba(251,191,36,0.2)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'rgba(251,191,36,0.8)',
          marginBottom: currentReading.affirmations && currentReading.affirmations.length > 1 ? 16 : 8,
        }}>
          {currentReading.affirmations && currentReading.affirmations.length > 1 ? 'Daily Affirmations' : 'Daily Affirmation'}
          {currentReading.aiGenerated && ' ✨'}
        </div>
        
        {currentReading.affirmations && currentReading.affirmations.length > 1 ? (
          // Multiple AI-generated affirmations
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentReading.affirmations.map((affirmation, i) => (
              <p key={i} style={{
                fontSize: 15,
                fontStyle: 'italic',
                color: '#fbbf24',
                margin: 0,
                lineHeight: 1.5,
                padding: '10px',
                background: 'rgba(251,191,36,0.08)',
                borderRadius: 8,
              }}>
                &ldquo;{affirmation}&rdquo;
              </p>
            ))}
          </div>
        ) : (
          // Single affirmation (fallback)
          <p style={{
            fontSize: 16,
            fontStyle: 'italic',
            color: '#fbbf24',
            margin: 0,
            lineHeight: 1.5,
          }}>
            &ldquo;{currentReading.affirmation}&rdquo;
          </p>
        )}
      </div>
      
      {/* AI-Enhanced: Journal Prompts */}
      {currentReading.journalPrompts && currentReading.journalPrompts.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Reflection Prompts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentReading.journalPrompts.map((prompt, i) => (
              <div
                key={i}
                style={{
                  padding: '16px',
                  background: 'rgba(59,130,246,0.08)',
                  borderRadius: 10,
                  border: '1px solid rgba(59,130,246,0.15)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <span style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'rgba(59,130,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  color: '#93c5fd',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <span style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.9)',
                  lineHeight: 1.5,
                  fontStyle: 'italic',
                }}>
                  {prompt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Pattern Insights */}
      {guidance.patternInsights.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Your Patterns
          </div>
          {guidance.patternInsights.slice(0, 2).map((insight, i) => (
            <div
              key={i}
              style={{
                padding: '14px 16px',
                background: 'rgba(59,130,246,0.1)',
                borderRadius: 10,
                borderLeft: '3px solid #3b82f6',
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
                🔮 {insight}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// Helper function
function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    fire: '#ef4444',
    earth: '#22c55e',
    air: '#3b82f6',
    water: '#8b5cf6',
  };
  return colors[element] || '#fff';
}

export default CelestialGuidanceV2;
