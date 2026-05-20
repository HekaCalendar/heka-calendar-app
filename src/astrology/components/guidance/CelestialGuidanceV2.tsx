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
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
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
import { calculatePreciseMoonPhase } from '../../services/calculations/swissCalculations';
import { getUnifiedChart } from '../../utils/chartBridge';
import { aiConfigService } from '../../../services/aiConfigService';
import { aiProviderManager } from '../../services/ai/aiProvider';
import { guidanceHistoryService } from '../../services/guidance/guidanceHistoryService';

// Import sub-components
import { MorningBriefing } from './MorningBriefing';
import { BirthChartInput } from '../natal/BirthChartInput';
import { PatternDashboard } from '../patterns/PatternDashboard';
import { ExportCardModal } from './ExportCardModal';

interface CelestialGuidanceV2Props {
  latitude: number;
  longitude: number;
  voidMoonData?: {
    isVoid: boolean;
    lastAspect?: string;
  };
  natalChart?: NatalChart | null;
  skyData?: {
    positions: Record<string, CelestialBody>;
    julianDay: number;
    timestamp: number;
  } | null;
  planetaryHour?: string;
  onOpenSettings?: () => void;
}

type ViewMode = 'briefing' | 'full' | 'patterns' | 'natal-input' | 'history';
type TimeFrame = 'daily' | 'weekly' | 'yearly';

const TIMEFRAME_LABELS: Record<TimeFrame, { labelKey: string; subtitleKey: string }> = {
  daily: { labelKey: 'guidance.today', subtitleKey: 'guidance.todaySubtitle' },
  weekly: { labelKey: 'guidance.thisWeek', subtitleKey: 'guidance.thisWeekSubtitle' },
  yearly: { labelKey: 'guidance.thisYear', subtitleKey: 'guidance.thisYearSubtitle' },
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
  skyData,
  planetaryHour,
  onOpenSettings,
}) => {
  const { t } = useTranslation('celestial');
  const [viewMode, setViewMode] = useState<ViewMode>('briefing');
  const [timeframe, setTimeframe] = useState<TimeFrame>('daily');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [morningBriefing, setMorningBriefing] = useState<MorningBriefingType | null>(null);
  const [fullGuidance, setFullGuidance] = useState<PersonalizedGuidanceReading | null>(null);
  const [region, setRegion] = useState<CelestialRegion | null>(null);
  const [selectedLifeArea, setSelectedLifeArea] = useState<LifeArea | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasAIProvider, setHasAIProvider] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(null);
  const [historyDates, setHistoryDates] = useState<string[]>([]);
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);
  const [historyReading, setHistoryReading] = useState<PersonalizedGuidanceReading | null>(null);
  
  // Use natal chart from props OR fall back to unified chart bridge
  // The bridge checks both OLD (ProfileManager) and NEW (Redux) storage systems
  // Memoized to prevent localStorage reads on every render
  const unifiedChart = useMemo(() => getUnifiedChart(), []);
  const natalChart = propNatalChart ?? unifiedChart;
  
  // Cache AI enabled check to prevent localStorage reads on every call
  const aiEnabledRef = useRef<boolean>(false);
  
  // Check AI status once on mount (legacy + unified config + provider availability)
  useEffect(() => {
    const checkAI = () => {
      // Check unified config first
      aiEnabledRef.current = aiConfigService.isAreaEnabled('stars');
      
      // Fallback to legacy config format
      if (!aiEnabledRef.current) {
        const config = localStorage.getItem('celestial-ai-config');
        if (config) {
          try {
            const parsed = JSON.parse(config);
            aiEnabledRef.current = parsed.activeProvider && parsed.activeProvider !== 'template';
          } catch {
            aiEnabledRef.current = false;
          }
        }
      }
      
      // Also check if any non-template provider is configured
      const providers = aiProviderManager.getAvailableProviders();
      const nonTemplateConfigured = providers.some(p => p.type !== 'template' && p.configured);
      setHasAIProvider(nonTemplateConfigured);
    };
    
    checkAI();
    // Re-check when window regains focus (user may have configured in another tab)
    const handleFocus = () => checkAI();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);
  
  // Check if AI enhancement is enabled (uses cached ref to avoid localStorage reads)
  const isAIEnabled = (): boolean => aiEnabledRef.current;
  
  // Generate morning briefing
  const generateMorningBriefing = useCallback(async () => {
    if (!skyData) return;
    try {
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
        planetaryHour,
      });
      
      if (briefing.aiFallbackReason) {
        setToast({ message: t('guidanceV2.aiUnavailable', { reason: briefing.aiFallbackReason }), type: 'warning' });
      }
      
      setMorningBriefing(briefing);
    } catch (error) {
      console.error('[GuidanceV2] Error generating briefing:', error);
    }
  }, [skyData, voidMoonData, planetaryHour]);
  
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
  }, [latitude, longitude, generateMorningBriefing]);
  
  // Generate full guidance
  const generateFullGuidance = useCallback(async () => {
    if (!skyData) return;
    setIsRefreshing(true);
    setLoading(true);
    try {
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
        planetaryHour,
      });
      
      setFullGuidance(guidance);
      
      if (guidance.aiFallbackReason) {
        setToast({ message: t('guidanceV2.aiUnavailable', { reason: guidance.aiFallbackReason }), type: 'warning' });
      }
    } catch (error) {
      console.error('[GuidanceV2] Error generating guidance:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [timeframe, voidMoonData, skyData, planetaryHour]);
  
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
  
  // Load history when switching to history view
  useEffect(() => {
    if (viewMode === 'history') {
      const dates = guidanceHistoryService.getReadingDates();
      setHistoryDates(dates);
      if (dates.length > 0 && !selectedHistoryDate) {
        const today = new Date().toISOString().split('T')[0];
        const defaultDate = dates.includes(today) ? today : dates[0];
        setSelectedHistoryDate(defaultDate);
        setHistoryReading(guidanceHistoryService.getReading(defaultDate));
      }
    }
  }, [viewMode, selectedHistoryDate]);
  
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
        <p>{t('guidanceV2.consulting')}</p>
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
          isAIEnabled={isAIEnabled()}
          hasAIProvider={hasAIProvider}
          onOpenSettings={onOpenSettings}
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
      
    case 'history':
      return (
        <HistoryView
          historyDates={historyDates}
          selectedDate={selectedHistoryDate}
          reading={historyReading}
          onSelectDate={(date) => {
            setSelectedHistoryDate(date);
            setHistoryReading(guidanceHistoryService.getReading(date));
          }}
          onClose={() => setViewMode('full')}
          onClear={() => {
            guidanceHistoryService.clearHistory();
            setHistoryDates([]);
            setSelectedHistoryDate(null);
            setHistoryReading(null);
          }}
        />
      );
      
    case 'full':
    default:
      return (
        <div style={{ padding: '24px', maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          {/* Toast */}
          {toast && (
            <div style={{
              position: 'fixed',
              top: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              padding: '12px 20px',
              borderRadius: 10,
              background: toast.type === 'warning' ? 'rgba(245,158,11,0.95)' : toast.type === 'success' ? 'rgba(34,197,94,0.95)' : 'rgba(59,130,246,0.95)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              maxWidth: '90vw',
              animation: 'fadeInDown 0.3s ease',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>{toast.type === 'warning' ? '⚠️' : toast.type === 'success' ? '✓' : 'ℹ️'}</span>
                <span>{toast.message}</span>
                <button
                  onClick={() => setToast(null)}
                  style={{ marginLeft: 8, background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14 }}
                  aria-label={t('common.close')}
                >
                  ×
                </button>
              </div>
            </div>
          )}
          <style>{`
            @keyframes fadeInDown {
              from { opacity: 0; transform: translate(-50%, -10px); }
              to { opacity: 1; transform: translate(-50%, 0); }
            }
          `}</style>
          {/* Navigation Bar */}
          <div style={{
            display: 'flex',
            gap: 8,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}>
            <NavButton 
              label={t('guidanceV2.morningBriefing')}
              active={false}
              onClick={() => setViewMode('briefing')}
            />
            <NavButton 
              label={natalChart ? t('guidanceV2.yourChart') : t('guidanceV2.addBirthChart')}
              active={false}
              highlight={!natalChart}
              onClick={() => setViewMode('natal-input')}
            />
            <NavButton 
              label={t('guidanceV2.yourPatterns')}
              active={false}
              onClick={() => setViewMode('patterns')}
            />
            <NavButton 
              label={t('guidanceV2.history')}
              active={false}
              onClick={() => setViewMode('history')}
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
                {t('guidanceV2.yourCelestialRegion')}
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
                  {t('guidanceV2.personalizedForYou')}
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
                  {t('guidanceV2.edit')}
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
                  {t(TIMEFRAME_LABELS[tf].labelKey)}
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
              isAIEnabled={isAIEnabled()}
              hasAIProvider={hasAIProvider}
              onOpenSettings={onOpenSettings}
              onRefresh={generateFullGuidance}
              isRefreshing={isRefreshing}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
              <p>{t('guidanceV2.loadingGuidance')}</p>
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
  isAIEnabled: boolean;
  hasAIProvider: boolean;
  onOpenSettings?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}> = ({ guidance, selectedLifeArea, onSelectLifeArea, isAIEnabled, hasAIProvider, onOpenSettings, onRefresh, isRefreshing }) => {
  const { t } = useTranslation('celestial');
  const currentReading = selectedLifeArea 
    ? guidance.lifeAreaReadings[selectedLifeArea]
    : guidance.overallReading;
  
  const [expandedPatterns, setExpandedPatterns] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const togglePattern = (idx: number) => {
    const next = new Set(expandedPatterns);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setExpandedPatterns(next);
  };
  
  const handleCopy = async () => {
    const lines: string[] = [];
    lines.push(`✦ ${currentReading.title}`);
    lines.push('');
    lines.push(currentReading.narrative);
    lines.push('');
    if (currentReading.transitContext) {
      lines.push(`🌟 Transit: ${currentReading.transitContext}`);
      lines.push('');
    }
    if (currentReading.advice.length > 0) {
      lines.push('Practical Guidance:');
      currentReading.advice.forEach((a, i) => lines.push(`${i + 1}. ${a}`));
      lines.push('');
    }
    if (currentReading.affirmations && currentReading.affirmations.length > 0) {
      lines.push('Affirmations:');
      currentReading.affirmations.forEach(a => lines.push(`• ${a}`));
    } else if (currentReading.affirmation) {
      lines.push(`Affirmation: ${currentReading.affirmation}`);
    }
    
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };
  
  const handleShare = async () => {
    const text = `${currentReading.title}\n\n${currentReading.narrative}\n\n${currentReading.affirmation || ''}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Celestial Guidance', text });
      } catch {
        // ignore
      }
    } else {
      handleCopy();
    }
  };
  
  return (
    <>
      {showExportModal && (
        <ExportCardModal
          guidance={guidance}
          selectedLifeArea={selectedLifeArea}
          onClose={() => setShowExportModal(false)}
        />
      )}
      {/* Header: Badge + Refresh */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {currentReading.aiGenerated ? (
            <span style={{ fontSize: 12, color: '#a78bfa', background: 'rgba(167,139,250,0.15)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(167,139,250,0.3)' }}>
              {t('guidanceV2.aiEnhanced')}
            </span>
          ) : (
            <span style={{ fontSize: 12, color: '#60a5fa', background: 'rgba(96,165,250,0.15)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(96,165,250,0.3)' }}>
              {t('guidanceV2.templatePowered')}
            </span>
          )}
          {guidance.natalChart && (
            <span style={{ fontSize: 12, color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(74,222,128,0.2)' }}>
              {t('guidanceV2.natalChart')}
            </span>
          )}
          {guidance.planetaryHour && (
            <span style={{ fontSize: 12, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(251,191,36,0.2)' }}>
              ⏰ {t('guidanceV2.hour', { planet: guidance.planetaryHour.charAt(0).toUpperCase() + guidance.planetaryHour.slice(1) })}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: copied ? '#4ade80' : 'rgba(255,255,255,0.8)',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <span>{copied ? '✓' : '📋'}</span>
            {copied ? t('guidanceV2.copied') : t('guidanceV2.copy')}
          </button>
          <button
            onClick={handleShare}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>↗</span>
            {t('guidanceV2.share')}
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid rgba(251,191,36,0.25)',
              background: 'rgba(251,191,36,0.08)',
              color: '#fbbf24',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>🖼️</span>
            {t('guidanceV2.card')}
          </button>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: 12,
                cursor: isRefreshing ? 'wait' : 'pointer',
                opacity: isRefreshing ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ display: 'inline-block', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}>↻</span>
              {isRefreshing ? t('guidanceV2.refreshing') : t('guidanceV2.refresh')}
            </button>
          )}
        </div>
      </div>

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
          {t('guidanceV2.guidanceConfidence')}
        </div>
        <div style={{ 
          fontSize: 36, 
          fontWeight: 300, 
          color: '#fbbf24',
        }}>
          {guidance.confidence}%
        </div>
        {currentReading.aiGenerated && (
          <div style={{ fontSize: 12, color: '#a78bfa', marginTop: 8 }}>
            {t('guidanceV2.aiEnhancedVia', { provider: currentReading.aiProvider, model: currentReading.aiModel })}
          </div>
        )}
      </div>
      
      {/* AI Upsell Card */}
      {!isAIEnabled && (
        <div style={{
          marginBottom: 24,
          padding: '18px 20px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(147,51,234,0.12) 100%)',
          borderRadius: 12,
          border: '1px solid rgba(147,51,234,0.35)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e9d5ff', marginBottom: '4px' }}>
                {hasAIProvider ? t('guidanceV2.enableAiGuidance') : t('guidanceV2.unlockDeeper')}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                {hasAIProvider
                  ? t('guidanceV2.aiConfigured')
                  : t('guidanceV2.aiAddProvider')}
              </p>
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: '1px solid rgba(147,51,234,0.5)',
                    background: 'rgba(147,51,234,0.25)',
                    color: '#e9d5ff',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(147,51,234,0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(147,51,234,0.25)';
                  }}
                >
                  {hasAIProvider ? t('guidanceV2.turnOnSettings') : t('guidanceV2.setUpAi')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
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
          {t('guidanceV2.focusAreas')}
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
          {t('guidanceV2.practicalGuidance')}
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
            <span>{t('guidanceV2.celestialEssence')} {currentReading.aiGenerated && t('guidanceV2.aiEnhancedSuffix')}</span>
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
          {currentReading.affirmations && currentReading.affirmations.length > 1 ? t('guidanceV2.dailyAffirmations') : t('guidanceV2.dailyAffirmation')}
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
      {guidance.activePatterns.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            Your Patterns
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {guidance.activePatterns.slice(0, 3).map((pattern, i) => {
              const isExpanded = expandedPatterns.has(i);
              return (
                <div
                  key={i}
                  onClick={() => togglePattern(i)}
                  style={{
                    padding: '14px 16px',
                    background: 'rgba(59,130,246,0.08)',
                    borderRadius: 10,
                    border: '1px solid rgba(59,130,246,0.15)',
                    borderLeft: '3px solid #3b82f6',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
                      🔮 {pattern.insight}
                    </span>
                    <span style={{ fontSize: 12, color: '#60a5fa', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      ▼
                    </span>
                  </div>
                  {isExpanded && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(59,130,246,0.2)' }}>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px 0', lineHeight: 1.5 }}>
                        {pattern.description}
                      </p>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: '#93c5fd' }}>
                          {t('guidanceV2.confidence')} {pattern.confidence}%
                        </span>
                        <span style={{ fontSize: 11, color: '#93c5fd' }}>
                          {t('guidanceV2.strength')} {pattern.correlationStrength > 0 ? '+' : ''}{pattern.correlationStrength.toFixed(2)}
                        </span>
                        {pattern.celestialSignature && (
                          <span style={{ fontSize: 11, color: '#93c5fd' }}>
                            {t('guidanceV2.signature')} {pattern.celestialSignature}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

// Sub-component: History View
const HistoryView: React.FC<{
  historyDates: string[];
  selectedDate: string | null;
  reading: PersonalizedGuidanceReading | null;
  onSelectDate: (date: string) => void;
  onClose: () => void;
  onClear: () => void;
}> = ({ historyDates, selectedDate, reading, onSelectDate, onClose, onClear }) => {
  const { t } = useTranslation('celestial');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(i18n.language || 'en', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  const isToday = (dateStr: string) => dateStr === new Date().toISOString().split('T')[0];
  
  return (
    <div style={{ padding: '24px', maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          {t('guidanceV2.guidanceHistory')}
        </h2>
        <button
          onClick={onClose}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          {t('guidanceV2.close')}
        </button>
      </div>
      
      {historyDates.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'rgba(255,255,255,0.5)',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌙</div>
          <p style={{ fontSize: 16, margin: '0 0 8px 0' }}>{t('guidanceV2.noSavedGuidance')}</p>
          <p style={{ fontSize: 13, margin: 0, opacity: 0.7 }}>
            {t('guidanceV2.readingsAppearHere')}
          </p>
        </div>
      ) : (
        <>
          {/* Date Selector */}
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
              {t('guidanceV2.selectDate')}
            </div>
            <div style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 8,
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.2) transparent',
            }}>
              {historyDates.map((date) => (
                <button
                  key={date}
                  onClick={() => onSelectDate(date)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 10,
                    border: `1px solid ${selectedDate === date ? 'rgba(147,51,234,0.6)' : 'rgba(255,255,255,0.1)'}`,
                    background: selectedDate === date ? 'rgba(147,51,234,0.25)' : 'rgba(255,255,255,0.03)',
                    color: selectedDate === date ? '#e9d5ff' : 'rgba(255,255,255,0.8)',
                    fontSize: 13,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ fontWeight: selectedDate === date ? 600 : 400 }}>
                    {formatDate(date)}
                  </div>
                  {isToday(date) && (
                    <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>{t('guidanceV2.today')}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Reading Display */}
          {reading ? (
            <div style={{
              padding: '24px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
                    {new Intl.DateTimeFormat(i18n.language || 'en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(reading.date))}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: '#fbbf24', margin: 0 }}>
                    {reading.overallReading.title}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {reading.overallReading.aiGenerated ? (
                    <span style={{ fontSize: 11, color: '#a78bfa', background: 'rgba(167,139,250,0.15)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(167,139,250,0.3)' }}>
                      ✨ AI
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, color: '#60a5fa', background: 'rgba(96,165,250,0.15)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(96,165,250,0.3)' }}>
                      📚 Template
                    </span>
                  )}
                  {reading.natalChart && (
                    <span style={{ fontSize: 11, color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(74,222,128,0.2)' }}>
                      ✓ Natal
                    </span>
                  )}
                </div>
              </div>
              
              <p style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.85)',
                margin: '0 0 20px 0',
                whiteSpace: 'pre-line',
              }}>
                {reading.overallReading.narrative}
              </p>
              
              {reading.overallReading.advice.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {t('guidanceV2.practicalGuidanceTitle')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {reading.overallReading.advice.map((advice, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '12px 14px',
                          background: 'rgba(255,255,255,0.03)',
                          borderRadius: 8,
                          border: '1px solid rgba(255,255,255,0.06)',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                        }}
                      >
                        <span style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'rgba(147,51,234,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          color: '#e9d5ff',
                          flexShrink: 0,
                        }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                          {advice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.08))',
                borderRadius: 10,
                border: '1px solid rgba(251,191,36,0.15)',
              }}>
                <div style={{ fontSize: 10, color: 'rgba(251,191,36,0.8)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {t('guidanceV2.affirmation')}
                </div>
                <p style={{ fontSize: 14, fontStyle: 'italic', color: '#fbbf24', margin: 0, lineHeight: 1.5 }}>
                  &ldquo;{reading.overallReading.affirmation}&rdquo;
                </p>
              </div>
              
              {reading.aiFallbackReason && (
                <div style={{
                  marginTop: 16,
                  padding: '10px 14px',
                  background: 'rgba(245,158,11,0.1)',
                  borderRadius: 8,
                  border: '1px solid rgba(245,158,11,0.2)',
                }}>
                  <span style={{ fontSize: 12, color: '#fbbf24' }}>
                    {t('guidanceV2.aiUnavailableDate')}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.5)' }}>
              <p>{t('guidanceV2.selectDateToView')}</p>
            </div>
          )}
          
          {/* Clear History */}
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            {!showConfirmClear ? (
              <button
                onClick={() => setShowConfirmClear(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.08)',
                  color: '#fca5a5',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {t('guidanceV2.clearHistory')}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{t('guidanceV2.areYouSure')}</span>
                <button
                  onClick={onClear}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {t('guidanceV2.yesClear')}
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {t('guidanceV2.cancel')}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
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
