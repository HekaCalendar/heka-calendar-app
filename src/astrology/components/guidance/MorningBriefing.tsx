/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MORNING BRIEFING COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Your personalized daily celestial briefing.
 * The first thing you see when you open the app.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState } from 'react';
import type { MorningBriefing as MorningBriefingType } from '../../services/guidance/personalizedEngine';

interface MorningBriefingProps {
  briefing: MorningBriefingType;
  onDismiss: () => void;
  onViewFullGuidance: () => void;
  isAIEnabled?: boolean;
  hasAIProvider?: boolean;
  onOpenSettings?: () => void;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.95) 0%, rgba(40, 30, 60, 0.95) 100%)',
    borderRadius: '16px',
    padding: '24px',
    color: '#fff',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute' as const,
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px',
    position: 'relative' as const,
    zIndex: 1,
  },
  greeting: {
    fontSize: '1.75rem',
    fontWeight: 300,
    margin: '0 0 8px 0',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  date: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
  },
  celestialBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
    position: 'relative' as const,
    zIndex: 1,
  },
  celestialBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.08)',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  icon: {
    fontSize: '1rem',
  },
  themeCard: {
    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    border: '1px solid rgba(147, 51, 234, 0.3)',
    position: 'relative' as const,
    zIndex: 1,
  },
  themeLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '8px',
  },
  themeValue: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#e9d5ff',
    margin: 0,
  },
  focusArea: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '8px',
  },
  guidanceSection: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    position: 'relative' as const,
    zIndex: 1,
  },
  guidanceTitle: {
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: '12px',
    color: '#fbbf24',
  },
  guidanceText: {
    fontSize: '1rem',
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.85)',
    margin: 0,
  },
  stepsSection: {
    marginBottom: '20px',
    position: 'relative' as const,
    zIndex: 1,
  },
  stepsTitle: {
    fontSize: '0.85rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: '12px',
  },
  stepList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  stepItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  stepNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'rgba(147, 51, 234, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#e9d5ff',
    flexShrink: 0,
  },
  stepText: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 1.5,
  },
  affirmation: {
    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
    borderRadius: '12px',
    padding: '16px 20px',
    textAlign: 'center' as const,
    marginBottom: '20px',
    border: '1px solid rgba(251, 191, 36, 0.2)',
    position: 'relative' as const,
    zIndex: 1,
  },
  affirmationLabel: {
    fontSize: '0.7rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    color: 'rgba(251, 191, 36, 0.8)',
    marginBottom: '8px',
  },
  affirmationText: {
    fontSize: '1.1rem',
    fontStyle: 'italic',
    color: '#fbbf24',
    margin: 0,
    lineHeight: 1.5,
  },
  patternAlert: {
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '20px',
    borderLeft: '3px solid #3b82f6',
    position: 'relative' as const,
    zIndex: 1,
  },
  patternTitle: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#60a5fa',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  patternText: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
    lineHeight: 1.5,
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    position: 'relative' as const,
    zIndex: 1,
  },
  primaryButton: {
    flex: 1,
    padding: '14px 20px',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  secondaryButton: {
    padding: '14px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  voidMoonAlert: {
    background: 'rgba(147, 51, 234, 0.15)',
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '20px',
    borderLeft: '3px solid #a855f7',
    position: 'relative' as const,
    zIndex: 1,
  },
  voidMoonTitle: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#c084fc',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
};

// Moon phase emojis
const MOON_PHASE_ICONS: Record<string, string> = {
  'new-moon': '🌑',
  'waxing-crescent': '🌒',
  'first-quarter': '🌓',
  'waxing-gibbous': '🌔',
  'full-moon': '🌕',
  'waning-gibbous': '🌖',
  'last-quarter': '🌗',
  'waning-crescent': '🌘',
};

// Planet symbols
const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '⛢',
  neptune: '♆',
  pluto: '♇',
};

export const MorningBriefing: React.FC<MorningBriefingProps> = ({
  briefing,
  onDismiss,
  onViewFullGuidance,
  isAIEnabled,
  hasAIProvider,
  onOpenSettings,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  const { 
    greeting, 
    date, 
    celestialSnapshot, 
    themeOfTheDay, 
    focusArea, 
    guidance, 
    practicalSteps,
    affirmation,
    patternMatches,
    planetaryHour,
    aiFallbackReason,
  } = briefing;
  
  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(d);
  };
  
  const getFocusAreaLabel = (area: string) => {
    const labels: Record<string, string> = {
      career: 'Career & Vocation',
      relationships: 'Love & Relationships',
      health: 'Health & Vitality',
      finances: 'Wealth & Resources',
      personalGrowth: 'Personal Growth',
      timing: 'Timing & Productivity',
    };
    return labels[area] || area;
  };
  
  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.greeting}>{greeting}</h1>
        <div style={styles.date}>{formatDate(date)}</div>
      </header>
      
      {/* Celestial Snapshot */}
      <div style={styles.celestialBar}>
        <div style={styles.celestialBadge}>
          <span style={styles.icon}>{MOON_PHASE_ICONS[celestialSnapshot.moonPhase] || '🌙'}</span>
          <span>Moon in {celestialSnapshot.moonSign.charAt(0).toUpperCase() + celestialSnapshot.moonSign.slice(1)}</span>
        </div>
        <div style={styles.celestialBadge}>
          <span style={styles.icon}>☉</span>
          <span>Sun in {celestialSnapshot.sunSign.charAt(0).toUpperCase() + celestialSnapshot.sunSign.slice(1)}</span>
        </div>
        {planetaryHour && (
          <div style={styles.celestialBadge}>
            <span style={styles.icon}>⏰</span>
            <span>{planetaryHour.charAt(0).toUpperCase() + planetaryHour.slice(1)} Hour</span>
          </div>
        )}
        {celestialSnapshot.keyTransit && (
          <div style={styles.celestialBadge}>
            <span style={styles.icon}>{PLANET_SYMBOLS[celestialSnapshot.keyTransit.transitingPlanet] || '✦'}</span>
            <span>
              {celestialSnapshot.keyTransit.transitingPlanet.charAt(0).toUpperCase() + celestialSnapshot.keyTransit.transitingPlanet.slice(1)} 
              {' '}{celestialSnapshot.keyTransit.aspect} your {celestialSnapshot.keyTransit.natalPlanet}
            </span>
          </div>
        )}
      </div>
      
      {/* Void Moon Alert */}
      {celestialSnapshot.voidMoon && (
        <div style={styles.voidMoonAlert}>
          <div style={styles.voidMoonTitle}>🌙 Void Moon Active</div>
          <p style={styles.patternText}>
            The Moon is currently void—perfect for reflection, rest, and inner work rather than starting new ventures.
          </p>
        </div>
      )}
      
      {/* Theme of the Day */}
      <div style={styles.themeCard}>
        <div style={styles.themeLabel}>Today&apos;s Theme</div>
        <h2 style={styles.themeValue}>{themeOfTheDay}</h2>
        <div style={styles.focusArea}>Focus: {getFocusAreaLabel(focusArea)}</div>
      </div>
      
      {/* Pattern Alert */}
      {patternMatches.length > 0 && (
        <div style={styles.patternAlert}>
          <div style={styles.patternTitle}>🔮 Pattern Recognized</div>
          <p style={styles.patternText}>{patternMatches[0].insight}</p>
        </div>
      )}
      
      {/* AI Fallback Notice */}
      {aiFallbackReason && (
        <div style={{
          background: 'rgba(245,158,11,0.12)',
          borderRadius: '10px',
          padding: '12px 16px',
          marginBottom: '16px',
          border: '1px solid rgba(245,158,11,0.3)',
          position: 'relative' as const,
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚠️</span>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
              AI enhancement unavailable. Showing template guidance.
            </span>
          </div>
        </div>
      )}
      
      {/* AI Upsell */}
      {!isAIEnabled && !aiFallbackReason && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(147,51,234,0.15) 100%)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          border: '1px solid rgba(147,51,234,0.3)',
          position: 'relative' as const,
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e9d5ff', marginBottom: '4px' }}>
                {hasAIProvider ? 'Enable AI Guidance' : 'Unlock Deeper Insights'}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                {hasAIProvider
                  ? 'You have an AI provider configured. Turn on AI guidance for poetic, personalized readings.'
                  : 'Add an AI provider to receive LLM-enhanced interpretations tailored to your unique chart.'}
              </p>
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(147,51,234,0.5)',
                    background: 'rgba(147,51,234,0.2)',
                    color: '#e9d5ff',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {hasAIProvider ? 'Turn On in Settings' : 'Set Up AI →'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Guidance */}
      <div style={styles.guidanceSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={styles.guidanceTitle}>Your Guidance</h3>
          {guidance.aiGenerated ? (
            <span style={{ fontSize: '0.7rem', color: '#a78bfa', background: 'rgba(167,139,250,0.15)', padding: '4px 8px', borderRadius: 12 }}>
              ✨ AI-Enhanced
            </span>
          ) : aiFallbackReason ? (
            <span style={{ fontSize: '0.7rem', color: '#fbbf24', background: 'rgba(251,191,36,0.12)', padding: '4px 8px', borderRadius: 12 }}>
              ⚠️ Template Fallback
            </span>
          ) : (
            <span style={{ fontSize: '0.7rem', color: '#60a5fa', background: 'rgba(96,165,250,0.15)', padding: '4px 8px', borderRadius: 12 }}>
              📚 Template-Powered
            </span>
          )}
        </div>
        <p style={styles.guidanceText}>{guidance.narrative}</p>
      </div>
      
      {/* Practical Steps */}
      <div style={styles.stepsSection}>
        <div style={styles.stepsTitle}>Today&apos;s Focus</div>
        <ul style={styles.stepList}>
          {practicalSteps.map((step, index) => (
            <li key={index} style={styles.stepItem}>
              <span style={styles.stepNumber}>{index + 1}</span>
              <span style={styles.stepText}>{step}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Affirmation */}
      <div style={styles.affirmation}>
        <div style={styles.affirmationLabel}>Daily Affirmation</div>
        <p style={styles.affirmationText}>&ldquo;{affirmation}&rdquo;</p>
      </div>
      
      {/* Buttons */}
      <div style={styles.buttonGroup}>
        <button 
          style={styles.primaryButton}
          onClick={onViewFullGuidance}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(147, 51, 234, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          View Full Guidance
        </button>
        <button 
          style={styles.secondaryButton}
          onClick={handleDismiss}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default MorningBriefing;
