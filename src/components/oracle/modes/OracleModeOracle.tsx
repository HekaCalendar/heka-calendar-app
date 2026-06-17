import React from 'react';
import { useTranslation } from 'react-i18next';
import type { BirthChartData, EffectiveProfile, JournalStats } from '../types';

interface OracleModeOracleProps {
  hasBirthChart: boolean;
  effectiveProfile: EffectiveProfile | null;
  birthChartData: BirthChartData | null;
  stats: JournalStats;
  onSetMode: (mode: 'scribe' | 'draw' | 'entries') => void;
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
  const { t } = useTranslation('journal');
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
              ? t('hero.welcome', { name: effectiveProfile.name })
              : t('hero.beginJourney')}
          </h2>
          <p>
            {hasBirthChart
              ? t('hero.birthChartActive', {
                  planetCount: Object.keys(birthChartData?.planets || {}).length,
                  majorTransits: stats.majorTransits,
                  transitSuffix: t(stats.majorTransits !== 1 ? 'hero.transitSuffixPlural' : 'hero.transitSuffix')
                })
              : t('hero.addBirthChartPrompt')}
          </p>
          
          {!hasBirthChart && (
            <button 
              className="hero-cta"
              onClick={onNavigateToStars}
            >
              <span>{t('hero.createBirthChart')}</span>
              <span className="cta-arrow">→</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="oracle-stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalEntries}</div>
          <div className="stat-label">{t('hero.oracleEntries')}</div>
          <div className="stat-icon">📜</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.entriesWithInsights}</div>
          <div className="stat-label">{t('hero.insights')}</div>
          <div className="stat-icon">🔮</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">{t('hero.dayStreak')}</div>
          <div className="stat-icon">✦</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-value">{stats.activeTransits}</div>
          <div className="stat-label">{t('hero.activeTransits')}</div>
          <div className="stat-icon">🪐</div>
        </div>
      </div>
      
      <div className="oracle-quick-actions">
        <button className="action-card" onClick={() => onSetMode('scribe')}>
          <span className="action-icon">✍️</span>
          <span className="action-label">{t('hero.newEntry')}</span>
        </button>
        <button className="action-card" onClick={() => onSetMode('draw')}>
          <span className="action-icon">✨</span>
          <span className="action-label">{t('hero.dailyOracle')}</span>
        </button>
        <button className="action-card" onClick={() => onSetMode('entries')}>
          <span className="action-icon">📜</span>
          <span className="action-label">{t('hero.browseEntries')}</span>
        </button>
      </div>
    </div>
  );
};
