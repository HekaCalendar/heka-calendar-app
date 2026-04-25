import React from 'react';
import type { BirthChartData, EffectiveProfile, JournalStats } from '../types';

interface OracleModeOracleProps {
  hasBirthChart: boolean;
  effectiveProfile: EffectiveProfile | null;
  birthChartData: BirthChartData | null;
  stats: JournalStats;
  onSetMode: (mode: 'scribe' | 'celestial' | 'entries') => void;
  onNavigateToStars: () => void;
}

export const OracleModeOracle: React.FC<OracleModeOracleProps> = ({
  hasBirthChart,
  effectiveProfile,
  birthChartData,
  stats,
  onSetMode,
  onNavigateToStars,
}) => {
  return (
    <div className="oracle-mode-oracle">
      <div className={`oracle-hero-card ${hasBirthChart ? 'has-chart' : ''}`}>
        <div className="hero-visual">
          {hasBirthChart ? (
            <>
              <div className="chart-wheel-animation">
                <div className="wheel-ring ring-1" />
                <div className="wheel-ring ring-2" />
                <div className="wheel-ring ring-3" />
                <div className="wheel-center">
                  {effectiveProfile?.name?.charAt(0) || '✦'}
                </div>
              </div>
              <div className="chart-glow" />
            </>
          ) : (
            <div className="empty-chart-icon">🌟</div>
          )}
        </div>
        
        <div className="hero-content">
          <h2>
            {hasBirthChart && effectiveProfile
              ? `Welcome, ${effectiveProfile.name}`
              : 'Begin Your Celestial Journey'}
          </h2>
          <p>
            {hasBirthChart
              ? `Your birth chart is active with ${Object.keys(birthChartData?.planets || {}).length} planetary positions. ${stats.majorTransits} major transit${stats.majorTransits !== 1 ? 's are' : ' is'} currently influencing your path.`
              : 'Add your birth chart in the Celestial Guide to unlock personalized insights based on your unique cosmic signature.'}
          </p>
          
          {!hasBirthChart && (
            <button 
              className="hero-cta"
              onClick={onNavigateToStars}
            >
              <span>Create Birth Chart</span>
              <span className="cta-arrow">→</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="oracle-stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalEntries}</div>
          <div className="stat-label">Oracle Entries</div>
          <div className="stat-icon">📜</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.entriesWithInsights}</div>
          <div className="stat-label">Insights</div>
          <div className="stat-icon">🔮</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">Day Streak</div>
          <div className="stat-icon">✦</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-value">{stats.activeTransits}</div>
          <div className="stat-label">Active Transits</div>
          <div className="stat-icon">🪐</div>
        </div>
      </div>
      
      <div className="oracle-quick-actions">
        <button className="action-card" onClick={() => onSetMode('scribe')}>
          <span className="action-icon">✍️</span>
          <span className="action-label">New Entry</span>
        </button>
        <button className="action-card" onClick={() => onSetMode('celestial')}>
          <span className="action-icon">✨</span>
          <span className="action-label">View Transits</span>
        </button>
        <button className="action-card" onClick={() => onSetMode('entries')}>
          <span className="action-icon">📜</span>
          <span className="action-label">Browse Entries</span>
        </button>
      </div>
    </div>
  );
};
