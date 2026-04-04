/**
 * Void Moon Observatory
 * Professional-grade astrological intelligence dashboard
 */

import React, { useState } from 'react';
import './VoidMoonObservatory.css';
import { useVoidMoon } from '../../hooks/use-swiss';
import { VoidMoonCalendar } from './VoidMoonCalendar';

// Aspect symbols
const ASPECT_SYMBOLS: Record<string, string> = {
  conjunction: '☌',
  sextile: '⚹',
  square: '□',
  trine: '△',
  opposition: '☍',
};

// Planet symbols
const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
};

// Format time remaining
const formatTimeRemaining = (minutes: number): string => {
  if (minutes <= 0) return '00:00';
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Format time
const formatTime = (date: Date | null): string => {
  if (!date) return '--:--';
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export const VoidMoonObservatory: React.FC = () => {
  const { data: voidData, isLoading, error } = useVoidMoon();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar'>('dashboard');

  // Loading state
  if (isLoading) {
    return (
      <div className="vm-observatory">
        <div className="vm-loading">
          <div className="vm-loading-orb" />
          <div>Calculating celestial alignments...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !voidData) {
    return (
      <div className="vm-observatory">
        <div className="vm-loading">
          <div>Unable to calculate void moon status</div>
          <div style={{ fontSize: '13px', marginTop: '8px', opacity: 0.6 }}>
            {error?.message || 'Please try again later'}
          </div>
        </div>
      </div>
    );
  }

  const isVoid = voidData.isVoid;
  const quality = voidData.quality || 'neutral';
  const lastAspect = voidData.lastAspect;
  const currentAspects = voidData.currentAspects || [];

  return (
    <div className="vm-observatory">
      {/* Hero Status Card */}
      <div className="vm-hero">
        <div className="vm-hero-status">
          <div className={`vm-hero-orb ${isVoid ? 'void' : 'active'}`}>
            {/* Moon emoji or icon */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
            }}>
              {isVoid ? '🌑' : '🌕'}
            </div>
          </div>
          
          <div className="vm-hero-content">
            <div className="vm-hero-title">Moon Status</div>
            <div className={`vm-hero-state ${isVoid ? 'void' : ''}`}>
              {isVoid ? 'VOID OF COURSE' : 'ACTIVE'}
            </div>
            <div className="vm-hero-details">
              {isVoid ? (
                <>
                  Moon has completed its last aspect and is drifting 
                  toward {voidData.voidEnd && new Date(voidData.voidEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </>
              ) : (
                <>
                  Moon is actively aspecting planets. 
                  Next void begins {voidData.nextVoidStart && formatTime(new Date(voidData.nextVoidStart))}
                </>
              )}
            </div>
            
            {/* Quality Badge */}
            <div className={`vm-quality-badge ${quality}`}>
              <span>{quality === 'favorable' ? '✓' : quality === 'challenging' ? '⚠' : '◈'}</span>
              <span>{quality.charAt(0).toUpperCase() + quality.slice(1)} Void</span>
            </div>
          </div>
          
          {/* Timer */}
          <div className="vm-hero-timer">
            <div className="vm-timer-value">
              {isVoid 
                ? formatTimeRemaining(voidData.remainingMinutes || 0)
                : formatTimeRemaining((voidData.nextVoidStart ? 
                    (new Date(voidData.nextVoidStart).getTime() - Date.now()) / (60 * 1000) : 0))
              }
            </div>
            <div className="vm-timer-label">
              {isVoid ? 'Remaining' : 'Until Void'}
            </div>
          </div>
        </div>
        
        {/* Last Aspect Card */}
        {lastAspect && (
          <div className="vm-aspect-card">
            <div className="vm-aspect-title">Last Aspect (Void Entry)</div>
            <div className="vm-aspect-detail">
              <div className="vm-aspect-symbol">
                {ASPECT_SYMBOLS[lastAspect.type] || '◈'}
              </div>
              <div className="vm-aspect-info">
                <div className="vm-aspect-name">
                  {lastAspect.type.charAt(0).toUpperCase() + lastAspect.type.slice(1)} to {lastAspect.planet.charAt(0).toUpperCase() + lastAspect.planet.slice(1)}
                </div>
                <div className="vm-aspect-time">
                  {lastAspect.exactTime ? formatTime(new Date(lastAspect.exactTime)) : 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="vm-recommendations" style={{ marginBottom: '24px' }}>
        <div className="vm-rec-title">Void Guidance</div>
        <div className="vm-rec-text">
          {voidData.qualityDescription || (
            isVoid 
              ? 'The Moon is void - a time for reflection, completion of existing tasks, and avoiding major new initiatives. Trust intuition over logic.'
              : 'The Moon is active and making aspects. Good for starting new projects, important communications, and taking action on decisions.'
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="vm-section-header" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="sh-tab"
            onClick={() => setActiveTab('dashboard')}
            style={{
              background: activeTab === 'dashboard' ? 'var(--ci-glass-bg)' : 'transparent',
              borderColor: activeTab === 'dashboard' ? 'var(--ci-primary)' : 'transparent',
            }}
          >
            <span>◈</span>
            Dashboard
          </button>
          <button
            className="sh-tab"
            onClick={() => setActiveTab('calendar')}
            style={{
              background: activeTab === 'calendar' ? 'var(--ci-glass-bg)' : 'transparent',
              borderColor: activeTab === 'calendar' ? 'var(--ci-primary)' : 'transparent',
            }}
          >
            <span>📅</span>
            Calendar
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      {activeTab === 'dashboard' && (
        <>
          {/* Aspect Timeline */}
          <div className="vm-timeline-section">
            <div className="vm-section-header">
              <div className="vm-section-title">Moon's Aspect Journey</div>
            </div>
            
            <div className="vm-timeline">
              <div className="vm-timeline-track">
                <div 
                  className="vm-timeline-progress" 
                  style={{ width: `${isVoid ? (voidData.progress || 0) : 100}%` }}
                />
                <div 
                  className="vm-timeline-moon"
                  style={{ left: `${isVoid ? (voidData.progress || 0) : 100}%` }}
                >
                  <span style={{ fontSize: '16px' }}>☽</span>
                </div>
              </div>
              
              <div className="vm-timeline-aspects">
                {/* Show up to 5 aspects */}
                {currentAspects.slice(0, 5).map((aspect: any, i: number) => (
                  <div 
                    key={i} 
                    className={`vm-timeline-aspect ${aspect.isApplying ? 'future' : 'past'}`}
                  >
                    <div className="vm-aspect-icon">
                      {PLANET_SYMBOLS[aspect.planet] || '●'}
                    </div>
                    <div className="vm-aspect-planet">{aspect.planet}</div>
                    <div className="vm-aspect-type">{aspect.aspect}</div>
                  </div>
                ))}
                
                {currentAspects.length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '13px',
                    padding: '20px'
                  }}>
                    No major aspects currently active
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Aspects Grid */}
          <div className="vm-timeline-section">
            <div className="vm-section-header">
              <div className="vm-section-title">Current Aspects</div>
            </div>
            
            <div className="vm-aspects-grid">
              {currentAspects.map((aspect: any, i: number) => (
                <div key={i} className="vm-aspect-item">
                  <div className="vm-aspect-item-symbol">
                    {ASPECT_SYMBOLS[aspect.aspect] || '◈'}
                  </div>
                  <div className="vm-aspect-item-planet">
                    {PLANET_SYMBOLS[aspect.planet]} {aspect.planet}
                  </div>
                  <div className="vm-aspect-item-type">
                    {aspect.aspect}
                  </div>
                  <div className="vm-aspect-item-orb">
                    {aspect.orb.toFixed(1)}° orb
                  </div>
                </div>
              ))}
              
              {currentAspects.length === 0 && (
                <div style={{ 
                  gridColumn: '1 / -1',
                  textAlign: 'center', 
                  color: 'rgba(255,255,255,0.5)',
                  padding: '40px'
                }}>
                  Moon is not making any major aspects at this time
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Calendar View */}
      {activeTab === 'calendar' && <VoidMoonCalendar />}
    </div>
  );
};

export default VoidMoonObservatory;
