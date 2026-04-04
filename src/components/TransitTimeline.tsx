/**
 * Transit Timeline Component
 * Shows current planetary positions (general) + personal transits (when birth chart exists)
 */

import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { PersonalTransit, TransitNotification } from '../oracle/birthChartIntegration';
import '../styles/transit-timeline.css';

interface TransitTimelineProps {
  transits: PersonalTransit[];
  notifications?: TransitNotification[];
}

// Planet info for display
const PLANET_INFO: Record<string, { icon: string; color: string; keywords: string[] }> = {
  Sun: { icon: '☉', color: '#ffd700', keywords: ['Identity', 'Vitality', 'Purpose'] },
  Moon: { icon: '☽', color: '#c0c0c0', keywords: ['Emotions', 'Intuition', 'Nurturing'] },
  Mercury: { icon: '☿', color: '#87ceeb', keywords: ['Communication', 'Mind', 'Learning'] },
  Venus: { icon: '♀', color: '#ff69b4', keywords: ['Love', 'Beauty', 'Values'] },
  Mars: { icon: '♂', color: '#ff4500', keywords: ['Action', 'Drive', 'Courage'] },
  Jupiter: { icon: '♃', color: '#4169e1', keywords: ['Growth', 'Luck', 'Wisdom'] },
  Saturn: { icon: '♄', color: '#708090', keywords: ['Structure', 'Discipline', 'Karma'] },
  Uranus: { icon: '♅', color: '#00ced1', keywords: ['Change', 'Rebellion', 'Innovation'] },
  Neptune: { icon: '♆', color: '#9370db', keywords: ['Dreams', 'Spirituality', 'Illusion'] },
  Pluto: { icon: '♇', color: '#8b008b', keywords: ['Transformation', 'Power', 'Depth'] },
};

const SIGN_EMOJIS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

export const TransitTimeline: React.FC<TransitTimelineProps> = ({ 
  transits,
  notifications = []
}) => {
  const [selectedTransit, setSelectedTransit] = useState<PersonalTransit | null>(null);
  const [filterStrength, setFilterStrength] = useState<number>(30);
  const [currentPositions, setCurrentPositions] = useState<Record<string, any>>({});
  const [moonPhase, setMoonPhase] = useState<any>(null);
  
  const birthChart = useSelector((state: RootState) => 
    state.calendar.selectedAstroProfileId 
      ? state.calendar.astroProfiles.find(p => p.id === state.calendar.selectedAstroProfileId)
      : null
  );

  // Load current planetary positions
  useEffect(() => {
    const loadPositions = async () => {
      try {
        const { getCurrentPlanetaryPositions } = await import('../oracle/birthChartIntegration');
        const { OracleEngine } = await import('../oracle/oracleEngine');
        const positions = await getCurrentPlanetaryPositions();
        const celestialState = await OracleEngine.getCurrentCelestialState(new Date());
        
        setCurrentPositions(positions);
        setMoonPhase(celestialState.moonPhase);
      } catch (error) {
        console.error('Failed to load planetary positions:', error);
      }
    };
    loadPositions();
  }, []);

  // Filter and sort transits (only for personal transits when birth chart exists)
  const filteredTransits = useMemo(() => {
    return transits
      .filter(t => t.strength >= filterStrength)
      .sort((a, b) => b.strength - a.strength);
  }, [transits, filterStrength]);

  // Group by strength tier
  const groupedTransits = useMemo(() => {
    return {
      major: filteredTransits.filter(t => t.strength >= 80),
      significant: filteredTransits.filter(t => t.strength >= 60 && t.strength < 80),
      moderate: filteredTransits.filter(t => t.strength >= 40 && t.strength < 60),
      subtle: filteredTransits.filter(t => t.strength < 40),
    };
  }, [filteredTransits]);

  // Helper functions for display
  const getStrengthColor = (strength: number) => {
    if (strength >= 80) return '#22c55e';
    if (strength >= 60) return '#3b82f6';
    if (strength >= 40) return '#eab308';
    return '#f97316';
  };

  const formatDegree = (longitude: number) => {
    const signIndex = Math.floor(longitude / 30);
    const sign = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
                   'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'][signIndex];
    const degree = Math.floor(longitude % 30);
    const minute = Math.floor((longitude % 1) * 60);
    return { sign, degree, minute };
  };

  return (
    <div className="transit-timeline">
      {/* Header */}
      <div className="transit-timeline-header">
        <h2 className="transit-timeline-title">
          <span className="transit-timeline-icon">✦</span>
          Current Celestial Weather
        </h2>
        {birthChart && (
          <div className="transit-timeline-controls">
            <label className="transit-filter">
              <span>Filter:</span>
              <select 
                value={filterStrength} 
                onChange={(e) => setFilterStrength(Number(e.target.value))}
              >
                <option value={0}>All transits</option>
                <option value={30}>Moderate+</option>
                <option value={50}>Significant+</option>
                <option value={70}>Major only</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Moon Phase Section - Always Visible */}
      {moonPhase && (
        <section className="transit-moon-section">
          <div className="transit-moon-card">
            <div className="transit-moon-visual">
              <span className="transit-moon-emoji">
                {moonPhase.illumination > 75 ? '🌕' : 
                 moonPhase.illumination > 50 ? '🌖' :
                 moonPhase.illumination > 25 ? '🌗' : '🌘'}
              </span>
              <div className="transit-moon-phase-info">
                <h3>{moonPhase.phase === 'new' ? 'New Moon' : 
                     moonPhase.phase === 'waxing_crescent' ? 'Waxing Crescent' :
                     moonPhase.phase === 'first_quarter' ? 'First Quarter' :
                     moonPhase.phase === 'waxing_gibbous' ? 'Waxing Gibbous' :
                     moonPhase.phase === 'full' ? 'Full Moon' :
                     moonPhase.phase === 'waning_gibbous' ? 'Waning Gibbous' :
                     moonPhase.phase === 'last_quarter' ? 'Last Quarter' : 'Waning Crescent'}</h3>
                <p>in {moonPhase.sign}</p>
                <span className="transit-moon-illumination">{Math.round(moonPhase.illumination)}% illuminated</span>
                {moonPhase.isVoid && (
                  <span className="transit-moon-void">⚠️ Void of Course</span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Current Planetary Positions - Always Visible */}
      <section className="transit-positions-section">
        <h3 className="transit-section-title">
          🪐 Current Planetary Positions
          {!birthChart && <span className="transit-section-subtitle">(General transits)</span>}
        </h3>
        <div className="transit-positions-grid">
          {Object.entries(currentPositions).map(([planet, position]: [string, any]) => {
            const { sign, degree, minute } = formatDegree(position.longitude);
            const info = PLANET_INFO[planet] || { icon: '●', color: '#888' };
            return (
              <div key={planet} className="transit-position-card">
                <div className="transit-position-planet" style={{ color: info.color }}>
                  <span className="transit-position-icon">{info.icon}</span>
                  <span className="transit-position-name">{planet}</span>
                </div>
                <div className="transit-position-sign">
                  <span className="transit-position-sign-icon">{SIGN_EMOJIS[sign] || sign}</span>
                  <span className="transit-position-sign-name">{sign.charAt(0).toUpperCase() + sign.slice(1)}</span>
                </div>
                <div className="transit-position-degree">
                  {degree}° {minute}'
                  {position.retrograde && <span className="transit-retrograde">℞</span>}
                </div>
                {info.keywords && (
                  <div className="transit-position-keywords">
                    {info.keywords.map(k => <span key={k} className="transit-keyword">{k}</span>)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Personal Transits - Only with Birth Chart */}
      {birthChart && (
        <section className="transit-personal-section">
          <h3 className="transit-section-title">
            ✨ Your Personal Transits
            <span className="transit-section-subtitle">(Birth chart activated)</span>
          </h3>

          {/* Active Notifications */}
          {notifications.length > 0 && (
            <div className="transit-notifications">
              <h4 className="transit-subsection-title">🔔 Active Now</h4>
              <div className="transit-notification-list">
                {notifications.slice(0, 3).map(notification => (
                  <div 
                    key={notification.id}
                    className={`transit-notification transit-notification-${notification.type}`}
                  >
                    <div className="transit-notification-header">
                      <span className="transit-notification-title">{notification.title}</span>
                      <span 
                        className="transit-notification-strength"
                        style={{ color: getStrengthColor(notification.transit.strength) }}
                      >
                        {notification.transit.strength}%
                      </span>
                    </div>
                    <p className="transit-notification-desc">{notification.description}</p>
                    {notification.actionItems.length > 0 && (
                      <div className="transit-notification-actions">
                        {notification.actionItems.slice(0, 2).map((action, i) => (
                          <span key={i} className="transit-action-item">{action}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transit Categories */}
          <div className="transit-categories">
            {groupedTransits.major.length > 0 && (
              <section className="transit-category">
                <h4 className="transit-category-title">
                  <span className="transit-category-indicator" style={{ background: '#22c55e' }} />
                  Major Transits ({groupedTransits.major.length})
                  <span className="transit-category-sub">80-100 strength</span>
                </h4>
                <div className="transit-list">
                  {groupedTransits.major.map(transit => (
                    <PersonalTransitCard 
                      key={transit.id}
                      transit={transit}
                      isSelected={selectedTransit?.id === transit.id}
                      onClick={() => setSelectedTransit(transit)}
                    />
                  ))}
                </div>
              </section>
            )}

            {groupedTransits.significant.length > 0 && (
              <section className="transit-category">
                <h4 className="transit-category-title">
                  <span className="transit-category-indicator" style={{ background: '#3b82f6' }} />
                  Significant Transits ({groupedTransits.significant.length})
                  <span className="transit-category-sub">60-79 strength</span>
                </h4>
                <div className="transit-list">
                  {groupedTransits.significant.map(transit => (
                    <PersonalTransitCard 
                      key={transit.id}
                      transit={transit}
                      isSelected={selectedTransit?.id === transit.id}
                      onClick={() => setSelectedTransit(transit)}
                    />
                  ))}
                </div>
              </section>
            )}

            {groupedTransits.moderate.length > 0 && (
              <section className="transit-category">
                <h4 className="transit-category-title">
                  <span className="transit-category-indicator" style={{ background: '#eab308' }} />
                  Moderate Transits ({groupedTransits.moderate.length})
                  <span className="transit-category-sub">40-59 strength</span>
                </h4>
                <div className="transit-list">
                  {groupedTransits.moderate.map(transit => (
                    <PersonalTransitCard 
                      key={transit.id}
                      transit={transit}
                      isSelected={selectedTransit?.id === transit.id}
                      onClick={() => setSelectedTransit(transit)}
                    />
                  ))}
                </div>
              </section>
            )}

            {filteredTransits.length === 0 && (
              <div className="transit-empty-state">
                <p>No significant transits matching your current filter.</p>
                <button 
                  className="transit-filter-reset"
                  onClick={() => setFilterStrength(0)}
                >
                  Show all transits
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Transit Detail Modal */}
      {selectedTransit && (
        <div className="transit-detail-overlay" onClick={() => setSelectedTransit(null)}>
          <div className="transit-detail-modal" onClick={e => e.stopPropagation()}>
            <TransitDetail transit={selectedTransit} onClose={() => setSelectedTransit(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

// Personal Transit Card Component
const PersonalTransitCard: React.FC<{
  transit: PersonalTransit;
  isSelected: boolean;
  onClick: () => void;
}> = ({ transit, isSelected, onClick }) => {
  const getStrengthColor = (s: number) => {
    if (s >= 80) return '#22c55e';
    if (s >= 60) return '#3b82f6';
    if (s >= 40) return '#eab308';
    return '#f97316';
  };

  const getPlanetIcon = (p: string) => {
    const icons: Record<string, string> = {
      Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
      Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
    };
    return icons[p] || '●';
  };

  const getAspectSymbol = (a: string) => {
    const symbols: Record<string, string> = {
      conjunction: '☌', sextile: '⚹', square: '□', trine: '△', opposition: '☍', quincunx: '⚻',
    };
    return symbols[a] || a;
  };

  return (
    <div 
      className={`transit-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="transit-card-symbols">
        <span className="transit-planet">{getPlanetIcon(transit.transitingPlanet)}</span>
        <span className="transit-aspect">{getAspectSymbol(transit.aspect)}</span>
        <span className="transit-planet natal">{getPlanetIcon(transit.natalPlanet)}</span>
      </div>
      <div className="transit-card-info">
        <span className="transit-card-title">
          {transit.transitingPlanet} {transit.aspect} {transit.natalPlanet}
        </span>
        <span className="transit-card-subtitle">
          H{transit.activatedHouse} → H{transit.natalHouse} • {transit.lifeArea}
        </span>
      </div>
      <div className="transit-card-strength" style={{ color: getStrengthColor(transit.strength) }}>
        {transit.strength}
      </div>
    </div>
  );
};

// Transit Detail Component
const TransitDetail: React.FC<{
  transit: PersonalTransit;
  onClose: () => void;
}> = ({ transit, onClose }) => {
  return (
    <div className="transit-detail">
      <div className="transit-detail-header">
        <h3>
          {transit.transitingPlanet} {transit.aspect} Natal {transit.natalPlanet}
        </h3>
        <button className="transit-detail-close" onClick={onClose}>×</button>
      </div>

      <div className="transit-detail-content">
        <div className="transit-detail-orb">
          <span className="transit-orb-label">Orb:</span>
          <span className="transit-orb-value">{transit.orb.toFixed(1)}°</span>
        </div>

        <div className="transit-detail-houses">
          <div className="transit-house">
            <span className="transit-house-label">Transiting House</span>
            <span className="transit-house-value">House {transit.activatedHouse}</span>
            <span className="transit-house-sign">{transit.transitingSign}</span>
          </div>
          <div className="transit-house-arrow">→</div>
          <div className="transit-house">
            <span className="transit-house-label">Natal House</span>
            <span className="transit-house-value">House {transit.natalHouse}</span>
            <span className="transit-house-sign">{transit.natalSign}</span>
          </div>
        </div>

        <div className="transit-detail-interpretation">
          <h4>Interpretation</h4>
          <p>{transit.interpretation}</p>
        </div>

        <div className="transit-detail-keywords">
          <h4>Keywords</h4>
          <div className="transit-keywords-list">
            {transit.keywords.map((keyword, i) => (
              <span key={i} className="transit-keyword">{keyword}</span>
            ))}
          </div>
        </div>

        <div className="transit-detail-duration">
          <h4>Duration</h4>
          <div className="transit-duration-bar">
            <div className="transit-duration-progress" />
          </div>
          <div className="transit-duration-dates">
            <span>{new Date(transit.duration.start).toLocaleDateString()}</span>
            <span>Exact: {new Date(transit.duration.exact).toLocaleDateString()}</span>
            <span>{new Date(transit.duration.end).toLocaleDateString()}</span>
          </div>
        </div>

        {transit.isChartRulerActivated && (
          <div className="transit-detail-special">
            <span className="transit-special-badge">⭐ Chart Ruler Activated</span>
            <p>This transit affects your ruling planet, making it especially significant for your personal identity and self-expression.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransitTimeline;
