/**
 * DailyBriefing - Personalized daily astrological intelligence
 * Phase 1: Exact transit calculations using Swiss Ephemeris
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedProfileChart } from '../../store/selectors';
import { calculateCurrentSky } from '../../services/calculations/swissCalculations';
import { calculateTransits } from '../../services/calculations/transits';
import { PLANET_NAMES } from '../../types';
import './DailyBriefing.css';

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

export const DailyBriefing: React.FC = () => {
  const natalChart = useSelector(selectSelectedProfileChart);
  const [transits, setTransits] = useState<Transit[]>([]);
  const [currentPositions, setCurrentPositions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const calculateDaily = async () => {
      try {
        setLoading(true);
        
        // Get precise current sky positions
        const { positions } = await calculateCurrentSky();
        setCurrentPositions(positions);
        
        // If we have a natal chart, calculate transits
        if (natalChart) {
          const todaysTransits = calculateTransits(positions, natalChart.bodies);
          setTransits(todaysTransits as Transit[]);
        }
      } catch (e) {
        console.error('Failed to calculate daily briefing:', e);
      } finally {
        setLoading(false);
      }
    };
    
    calculateDaily();
    
    // Recalculate every hour
    const interval = setInterval(calculateDaily, 3600000);
    return () => clearInterval(interval);
  }, [natalChart]);
  
  if (loading) {
    return (
      <div className="db-loading">
        <div className="db-loading-spinner"></div>
        <p>Calculating precise positions...</p>
      </div>
    );
  }
  
  // No birth chart - show universal guidance
  if (!natalChart) {
    return (
      <div className="daily-briefing">
        <div className="db-universal">
          <h3>Universal Sky Today</h3>
          <p>Add a birth chart for personalized transit information.</p>
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
          <p>✨ Excellent day for important activities. Strong cosmic support.</p>
        )}
        {rating >= 6 && rating < 8 && (
          <p>✓ Good energy today. Favorable for most activities.</p>
        )}
        {rating >= 4 && rating < 6 && (
          <p>◆ Mixed energies. Proceed with awareness.</p>
        )}
        {rating < 4 && (
          <p>⚠ Challenging day. Focus on self-care and avoid major decisions.</p>
        )}
      </div>
      
      {/* Positive Transits */}
      {positive.length > 0 && (
        <div className="db-section db-positive">
          <h4 className="db-section-title">
            <span className="db-icon">✓</span>
            Opportunities ({positive.length})
          </h4>
          <div className="db-transits">
            {positive.map((t, i) => (
              <div key={i} className="db-transit">
                <div className="db-t-aspect">
                  <span className="db-t-symbol">{PLANET_SYMBOLS[t.transitingPlanet]}</span>
                  <span className="db-t-type">{ASPECT_SYMBOLS[t.aspect.type]}</span>
                  <span className="db-t-symbol">{PLANET_SYMBOLS[t.natalPlanet]}</span>
                </div>
                <div className="db-t-info">
                  <div className="db-t-desc">
                    {PLANET_NAMES[t.transitingPlanet as keyof typeof PLANET_NAMES]} {t.aspect.type} your {PLANET_NAMES[t.natalPlanet as keyof typeof PLANET_NAMES]}
                  </div>
                  <div className="db-t-orb">{t.aspect.orb.toFixed(1)}° orb</div>
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
            Watch Out ({challenging.length})
          </h4>
          <div className="db-transits">
            {challenging.map((t, i) => (
              <div key={i} className="db-transit">
                <div className="db-t-aspect">
                  <span className="db-t-symbol">{PLANET_SYMBOLS[t.transitingPlanet]}</span>
                  <span className="db-t-type">{ASPECT_SYMBOLS[t.aspect.type]}</span>
                  <span className="db-t-symbol">{PLANET_SYMBOLS[t.natalPlanet]}</span>
                </div>
                <div className="db-t-info">
                  <div className="db-t-desc">
                    {PLANET_NAMES[t.transitingPlanet as keyof typeof PLANET_NAMES]} {t.aspect.type} your {PLANET_NAMES[t.natalPlanet as keyof typeof PLANET_NAMES]}
                  </div>
                  <div className="db-t-orb">{t.aspect.orb.toFixed(1)}° orb</div>
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
            Background ({neutral.length})
          </h4>
          <div className="db-transits">
            {neutral.slice(0, 3).map((t, i) => (
              <div key={i} className="db-transit">
                <div className="db-t-aspect">
                  <span className="db-t-symbol">{PLANET_SYMBOLS[t.transitingPlanet]}</span>
                  <span className="db-t-type">{ASPECT_SYMBOLS[t.aspect.type]}</span>
                  <span className="db-t-symbol">{PLANET_SYMBOLS[t.natalPlanet]}</span>
                </div>
                <div className="db-t-info">
                  <div className="db-t-desc">
                    {PLANET_NAMES[t.transitingPlanet as keyof typeof PLANET_NAMES]} {t.aspect.type} your {PLANET_NAMES[t.natalPlanet as keyof typeof PLANET_NAMES]}
                  </div>
                  <div className="db-t-orb">{t.aspect.orb.toFixed(1)}° orb</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {transits.length === 0 && (
        <div className="db-quiet">
          <div className="db-quiet-icon">🌤️</div>
          <p>Quiet day. No major transits affecting your chart.</p>
          <p className="db-quiet-sub">Good for routine tasks and maintenance.</p>
        </div>
      )}
    </div>
  );
};

export default DailyBriefing;
