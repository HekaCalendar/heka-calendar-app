/**
 * DailyBriefing - Personalized daily astrological intelligence
 * Phase 1: Exact transit calculations using Swiss Ephemeris
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectSelectedProfileChart } from '../../store/selectors';
import { calculateCurrentSky } from '../../services/calculations/swissCalculations';
import { calculateTransits } from '../../services/calculations/transits';
import { PLANET_NAMES, type CelestialBody } from '../../types';
import './DailyBriefing.css';

interface DailyBriefingProps {
  positions?: Record<string, CelestialBody> | null;
}

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
};

const ASPECT_SYMBOLS: Record<string, string> = {
  conjunction: '☌', sextile: '⚹', square: '☐', trine: '△', opposition: '☍'
};

interface Transit {
  transitingPlanet: string;
  natalPlanet: string;
  aspect: {
    type: string;
    orb: number;
  };
  significance: 'major' | 'minor';
  interpretation: string;
}

export const DailyBriefing: React.FC<DailyBriefingProps> = ({ positions: providedPositions }) => {
  const { t } = useTranslation('celestial');
  const natalChart = useSelector(selectSelectedProfileChart);
  const [internalPositions, setInternalPositions] = useState<Record<string, CelestialBody> | null>(null);
  const [loading, setLoading] = useState(!providedPositions);

  // Re-use parent sky data when available to avoid duplicate Swiss Ephemeris work.
  const currentPositions = providedPositions ?? internalPositions;

  const transits = useMemo<Transit[]>(() => {
    if (!currentPositions || !natalChart) return [];
    try {
      return calculateTransits(currentPositions, natalChart.bodies) as Transit[];
    } catch (e) {
      console.error('Failed to calculate transits:', e);
      return [];
    }
  }, [currentPositions, natalChart]);

  useEffect(() => {
    if (providedPositions) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const calculateDaily = async () => {
      try {
        setLoading(true);
        const { positions } = await calculateCurrentSky();
        if (isMounted) setInternalPositions(positions);
      } catch (e) {
        console.error('Failed to calculate daily briefing:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    calculateDaily();

    // Recalculate every hour only when the parent is not already providing data.
    const interval = setInterval(calculateDaily, 3600000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [providedPositions]);
  
  if (loading) {
    return (
      <div className="db-loading">
        <div className="db-loading-spinner"></div>
        <p>{t('daily.loading')}</p>
      </div>
    );
  }
  
  // No birth chart - show universal guidance
  if (!natalChart) {
    return (
      <div className="daily-briefing">
        <div className="db-universal">
          <h3>{t('daily.universalSky')}</h3>
          <p>{t('daily.addBirthChart')}</p>
          <div className="db-current-positions">
            {currentPositions && ['sun', 'moon', 'mercury', 'venus', 'mars'].map(planet => {
              const body = currentPositions[planet];
              if (!body) return null;
              return (
                <div key={planet} className="db-position-mini">
                  <span className="db-symbol">{PLANET_SYMBOLS[planet]}</span>
                  <span className="db-name">{PLANET_NAMES[planet as keyof typeof PLANET_NAMES]}</span>
                  <span className="db-degree">{body.degreeInSign.toFixed(1)}° {body.sign}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  
  // Separate transits by quality
  const positive = transits.filter(t => 
    ['trine', 'sextile'].includes(t.aspect.type) ||
    (t.aspect.type === 'conjunction' && ['sun', 'jupiter', 'venus'].includes(t.transitingPlanet))
  );
  
  const challenging = transits.filter(t => 
    ['square', 'opposition'].includes(t.aspect.type) ||
    (t.aspect.type === 'conjunction' && ['saturn', 'mars', 'pluto'].includes(t.transitingPlanet))
  );
  
  const neutral = transits.filter(t => 
    !positive.includes(t) && !challenging.includes(t)
  );
  
  // Calculate overall day rating
  let rating = 5;
  positive.forEach(() => rating += 1);
  challenging.forEach(() => rating -= 1);
  rating = Math.max(1, Math.min(10, rating));
  
  const getRatingLabel = (r: number) => {
    if (r >= 8) return { label: 'Excellent', color: '#22c55e' };
    if (r >= 6) return { label: 'Good', color: '#d4af37' };
    if (r >= 4) return { label: 'Mixed', color: '#f59e0b' };
    return { label: 'Challenging', color: '#ef4444' };
  };
  
  const ratingInfo = getRatingLabel(rating);
  
  return (
    <div className="daily-briefing">
      {/* Header with Rating */}
      <div className="db-header">
        <div className="db-title-section">
          <h3>Today's Forecast</h3>
          <p className="db-subtitle">
            {transits.length} active transit{transits.length !== 1 ? 's' : ''} • Swiss Ephemeris precision
          </p>
        </div>
        <div className="db-rating">
          <span className="db-rating-score" style={{ color: ratingInfo.color }}>
            {rating}/10
          </span>
          <span className="db-rating-label" style={{ color: ratingInfo.color }}>
            {ratingInfo.label}
          </span>
        </div>
      </div>
      
      {/* Guidance */}
      <div className="db-guidance">
        {rating >= 8 && (
          <p>{t('daily.excellent')}</p>
        )}
        {rating >= 6 && rating < 8 && (
          <p>{t('daily.good')}</p>
        )}
        {rating >= 4 && rating < 6 && (
          <p>{t('daily.mixed')}</p>
        )}
        {rating < 4 && (
          <p>{t('daily.challengingDay')}</p>
        )}
      </div>
      
      {/* Positive Transits */}
      {positive.length > 0 && (
        <div className="db-section db-positive">
          <h4 className="db-section-title">
            <span className="db-icon">✓</span>
            {t('daily.opportunities', { count: positive.length })}
          </h4>
          <div className="db-transits">
            {positive.map((tr, i) => (
              <div key={i} className="db-transit">
                <div className="db-t-aspect">
                  <span className="db-t-symbol">{PLANET_SYMBOLS[tr.transitingPlanet]}</span>
                  <span className="db-t-type">{ASPECT_SYMBOLS[tr.aspect.type]}</span>
                  <span className="db-t-symbol">{PLANET_SYMBOLS[tr.natalPlanet]}</span>
                </div>
                <div className="db-t-info">
                  <div className="db-t-desc">
                    {PLANET_NAMES[tr.transitingPlanet as keyof typeof PLANET_NAMES]} {tr.aspect.type} your {PLANET_NAMES[tr.natalPlanet as keyof typeof PLANET_NAMES]}
                  </div>
                  <div className="db-t-orb">{t('daily.orb', { orb: tr.aspect.orb.toFixed(1) })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Challenging Transits */}
      {challenging.length > 0 && (
        <div className="db-section db-challenging">
          <h4 className="db-section-title">
            <span className="db-icon">⚠</span>
            {t('daily.watchOut', { count: challenging.length })}
          </h4>
          <div className="db-transits">
            {challenging.map((tr, i) => (
              <div key={i} className="db-transit">
                <div className="db-t-aspect">
                  <span className="db-t-symbol">{PLANET_SYMBOLS[tr.transitingPlanet]}</span>
                  <span className="db-t-type">{ASPECT_SYMBOLS[tr.aspect.type]}</span>
                  <span className="db-t-symbol">{PLANET_SYMBOLS[tr.natalPlanet]}</span>
                </div>
                <div className="db-t-info">
                  <div className="db-t-desc">
                    {PLANET_NAMES[tr.transitingPlanet as keyof typeof PLANET_NAMES]} {tr.aspect.type} your {PLANET_NAMES[tr.natalPlanet as keyof typeof PLANET_NAMES]}
                  </div>
                  <div className="db-t-orb">{tr.aspect.orb.toFixed(1)}° orb</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Neutral Transits */}
      {neutral.length > 0 && (
        <div className="db-section db-neutral">
          <h4 className="db-section-title">
            <span className="db-icon">◆</span>
            {t('daily.background', { count: neutral.length })}
          </h4>
          <div className="db-transits">
            {neutral.slice(0, 3).map((tr, i) => (
              <div key={i} className="db-transit">
                <div className="db-t-aspect">
                  <span className="db-t-symbol">{PLANET_SYMBOLS[tr.transitingPlanet]}</span>
                  <span className="db-t-type">{ASPECT_SYMBOLS[tr.aspect.type]}</span>
                  <span className="db-t-symbol">{PLANET_SYMBOLS[tr.natalPlanet]}</span>
                </div>
                <div className="db-t-info">
                  <div className="db-t-desc">
                    {PLANET_NAMES[tr.transitingPlanet as keyof typeof PLANET_NAMES]} {tr.aspect.type} your {PLANET_NAMES[tr.natalPlanet as keyof typeof PLANET_NAMES]}
                  </div>
                  <div className="db-t-orb">{tr.aspect.orb.toFixed(1)}° orb</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {transits.length === 0 && (
        <div className="db-quiet">
          <div className="db-quiet-icon">🌤️</div>
          <p>{t('daily.quietDay')}</p>
          <p className="db-quiet-sub">{t('daily.goodForRoutine')}</p>
        </div>
      )}
    </div>
  );
};

export default DailyBriefing;
