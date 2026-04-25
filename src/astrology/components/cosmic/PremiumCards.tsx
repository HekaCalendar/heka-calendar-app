/**
 * Premium Celestial Cards - The Celestial Observatory
 * 5 expandable cards with holographic effects and deep astronomical intelligence
 * 
 * Card 1: CHRONOS - The Temporal Anchor (Time)
 * Card 2: LUNA - The Lunar Oracle (Moon Phase)
 * Card 3: KRONOS - The Chaldean Hourglass (Planetary Hour)
 * Card 4: STATION - The Celestial Weather (Retrogrades)
 * Card 5: STELLIUM - The Living Solar System (Positions)
 */

import React, { useState, useCallback, useEffect } from 'react';
import { getArcLabel, HEKA_MONTHS, getTodayHekaDate, getHekaYearStart } from '../../../services/calendarService';
import { SIGN_SYMBOLS, SIGN_ELEMENTS, SIGN_ELEMENTS_13, SIGN_MODALITIES, PLANET_NAMES, type CelestialBody, type ZodiacSign, type PlanetId } from '../../types/core';
import { getZodiacSystemPreference } from '../../services/natal/zodiacHelpers';
import type { HekaMonthIndex } from '../../../types';
import './PremiumCards.css';
import './PremiumCards.landscape.css';

// Moon phase type from swissCalculations
interface SwissMoonPhase {
  phase: number; // 0-1
  illumination: number; // 0-100%
  angle: number; // Degrees from sun
  isWaxing: boolean;
  name: string;
  emoji: string;
}

// ============================================================================
// Symbol Mappings
// ============================================================================
const SYMBOLS: Record<PlanetId, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  chiron: '⚷', north_node: '☊', south_node: '☋', lilith: '⚸'
};

const ELEMENT_META: Record<string, { symbol: string; color: string }> = {
  fire: { symbol: '🔥', color: '#f59e0b' },
  earth: { symbol: '🌍', color: '#22c55e' },
  air: { symbol: '💨', color: '#3b82f6' },
  water: { symbol: '💧', color: '#06b6d4' }
};

const MODALITY_SYMBOLS: Record<string, string> = {
  cardinal: '♈',
  fixed: '⛛',
  mutable: '♋'
};

// ============================================================================
// Card 1: CHRONOS - The Temporal Anchor
// ============================================================================

interface ChronosCardProps {
  currentTime: Date;
  julianDay: number;
  positions: Record<string, CelestialBody> | null;
  isExpanded: boolean;
  onToggle: () => void;
}

const ChronosCard: React.FC<ChronosCardProps> = ({ currentTime, julianDay, positions, isExpanded, onToggle }) => {
  const [displayTime, setDisplayTime] = useState(currentTime);
  const hekaDate = getTodayHekaDate();
  const hekaMonth = HEKA_MONTHS[hekaDate.month];
  const arcLabel = getArcLabel(hekaDate.month as HekaMonthIndex);
  
  // Update time every second for ticking seconds
  useEffect(() => {
    setDisplayTime(currentTime);
    const timer = setInterval(() => {
      setDisplayTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [currentTime]);
  
  // Year progress calculation
  const yearStart = getHekaYearStart(hekaDate.year);
  const yearEnd = getHekaYearStart(hekaDate.year + 1);
  const yearProgress = ((displayTime.getTime() - yearStart.getTime()) / (yearEnd.getTime() - yearStart.getTime())) * 100;
  const dayOfYear = Math.floor((displayTime.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24));
  
  // Civil date formatting
  const civilWeekday = displayTime.toLocaleDateString('en-US', { weekday: 'long' });
  const civilDate = displayTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  // Next celestial event (mock - would come from ephemeris)
  const nextEvent = positions?.moon ? `☽ enters ${getNextSign(positions.moon.sign)} in ~3 hours` : 'Calculating...';
  
  const copyJulianDay = useCallback(() => {
    navigator.clipboard.writeText(julianDay.toFixed(5));
  }, [julianDay]);
  
  // Generate clock ticks
  const clockTicks = Array.from({ length: 12 }, (_, i) => {
    const rotation = i * 30;
    return <div key={i} className="epic-time-tick" style={{ transform: `rotate(${rotation}deg)` }} />;
  });

  return (
    <div className={`premium-card chronos ${isExpanded ? 'expanded' : ''}`} onClick={onToggle}>
      {/* Holographic sheen effect */}
      <div className="card-sheen" />
      
      {/* Default View - HEKA Date Primary */}
      <div className="card-default">
        {/* Epic Time Icon */}
        <div className="epic-time-container">
          <div className="epic-time-ring" />
          <div className="epic-time-inner">
            <span className="epic-time-icon">◈</span>
          </div>
          <div className="epic-time-ticks">{clockTicks}</div>
        </div>
        
        <div className="card-primary-content">
          <div className="heka-date-main">
            <span className="heka-month">{hekaMonth.name.toUpperCase()}</span>
            <span className="heka-day">{hekaDate.day}</span>
            <span className="heka-year">{hekaDate.year}</span>
          </div>
          <div className="heka-label">HEKA DATE</div>
        </div>
        <div className="card-secondary-content">
          <div className="civil-time">{displayTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
          <div className="arc-badge">{arcLabel} • Month {hekaDate.month + 1} of 13</div>
        </div>
        <div className="expand-hint">
          <span className="expand-icon">↓</span>
          <span>Expand</span>
        </div>
      </div>

      {/* Expanded View - The Aeon Gate */}
      {isExpanded && (
        <div className="card-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="expanded-header">
            <div className="expanded-title">THE AEON GATE</div>
            <button className="close-btn" onClick={onToggle}>×</button>
          </div>
          
          {/* HEKA Section */}
          <div className="expanded-section heka-section">
            <div className="section-label">◈ HEKA CALENDAR</div>
            <div className="heka-expanded-display">
              <span className="heka-month-large">{hekaMonth.name}</span>
              <span className="heka-day-large">{hekaDate.day}</span>
              <span className="heka-year-large">{hekaDate.year}</span>
            </div>
            <div className="heka-meta">
              <span className="arc-tag">{arcLabel}</span>
              <span className="month-tag">Month {hekaDate.month + 1} of 13</span>
              <span className="day-tag">Day {dayOfYear} of {yearEnd.getTime() - yearStart.getTime() > 366 * 86400000 ? 366 : 365}</span>
            </div>
          </div>

          {/* Year Progress */}
          <div className="expanded-section">
            <div className="section-label">YEAR PROGRESS</div>
            <div className="progress-container">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(yearProgress, 100)}%` }} />
                <div className="progress-glow" style={{ left: `${Math.min(yearProgress, 100)}%` }} />
              </div>
              <div className="progress-labels">
                <span>{dayOfYear} days elapsed</span>
                <span>{yearProgress.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Civil Time Section */}
          <div className="expanded-section">
            <div className="section-label">🌍 CIVIL TIME</div>
            <div className="civil-expanded">
              <div className="civil-weekday">{civilWeekday}</div>
              <div className="civil-full-date">{civilDate}</div>
            </div>
          </div>

          {/* Luminaries Now */}
          {positions && (
            <div className="expanded-section luminaries">
              <div className="section-label">LUMINARIES NOW</div>
              <div className="luminaries-grid">
                {positions.sun && (
                  <div className="luminary-item">
                    <span className="lum-symbol">☉</span>
                    <span className="lum-name">Sun</span>
                    <span className="lum-position">
                      {SIGN_SYMBOLS[positions.sun.sign as ZodiacSign]} {(positions.sun.degreeInSign ?? 0).toFixed(0)}°
                    </span>
                    <span className="lum-quality">
                      {SIGN_ELEMENTS[positions.sun.sign as ZodiacSign]} +
                      {' '}{SIGN_MODALITIES[positions.sun.sign as ZodiacSign]}
                    </span>
                  </div>
                )}
                {positions.moon && (
                  <div className="luminary-item">
                    <span className="lum-symbol">☽</span>
                    <span className="lum-name">Moon</span>
                    <span className="lum-position">
                      {SIGN_SYMBOLS[positions.moon.sign as ZodiacSign]} {(positions.moon.degreeInSign ?? 0).toFixed(0)}°
                    </span>
                    <span className="lum-quality">
                      {SIGN_ELEMENTS[positions.moon.sign as ZodiacSign]} +
                      {' '}{SIGN_MODALITIES[positions.moon.sign as ZodiacSign]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Julian Day */}
          <div className="expanded-section">
            <div className="section-label">JULIAN DAY</div>
            <div className="jd-display">
              <code className="jd-value">{julianDay.toFixed(5)}</code>
              <button className="jd-action" onClick={copyJulianDay}>Copy</button>
            </div>
          </div>

          {/* Next Event */}
          <div className="expanded-section next-event">
            <div className="section-label">NEXT CELESTIAL EVENT</div>
            <div className="event-text">{nextEvent}</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for next sign (supports both 12 and 13 sign systems)
function getNextSign(currentSign: string): string {
  const use13Signs = getZodiacSystemPreference() === '13-sign';
  const signs = use13Signs 
    ? ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
       'libra', 'scorpio', 'ophiuchus', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
    : ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
       'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const idx = signs.indexOf(currentSign);
  return signs[(idx + 1) % signs.length];
}

// ============================================================================
// Card 2: LUNA - The Lunar Oracle
// ============================================================================

interface LunaCardProps {
  moonPhase: SwissMoonPhase | null;
  moonPosition: CelestialBody | null;
  isExpanded: boolean;
  onToggle: () => void;
}

// Poetic oracle messages for each phase
const MOON_ORACLES: Record<string, { title: string; poem: string; favors: string[]; warnings: string[] }> = {
  'New Moon': {
    title: 'THE DARK MYSTERY',
    poem: 'In the void between breaths, all potential dwells. The seed waits in darkness, gathering courage to split its shell. Plant intentions now—they will grow with the light.',
    favors: ['Setting intentions', 'Planting seeds', 'Beginning new ventures', 'Inner vision work'],
    warnings: ['Don\'t push for immediate results', 'Avoid major launches']
  },
  'Waxing Crescent': {
    title: 'THE FIRST BREATH',
    poem: 'A sliver of silver pierces the night. The dream begins to breathe, taking its first steps into form. Trust the unfolding.',
    favors: ['Taking first steps', 'Building momentum', 'Learning new skills', 'Making connections'],
    warnings: ['Don\'t overcommit', 'Stay flexible']
  },
  'First Quarter': {
    title: 'THE CROSSROADS',
    poem: 'Half light, half shadow—decision hangs in the balance. The path forward requires action. Choose, and the universe conspires.',
    favors: ['Making decisions', 'Taking action', 'Pushing through obstacles', 'Committing'],
    warnings: ['Avoid hesitation', 'Don\'t look back']
  },
  'Waxing Gibbous': {
    title: 'THE GATHERING',
    poem: 'Almost full, almost complete. The momentum builds like a wave cresting. Refine, adjust, prepare for the revelation.',
    favors: ['Refining projects', 'Adjusting plans', 'Preparing for launch', 'Gathering resources'],
    warnings: ['Don\'t rush to completion', 'Patience rewards']
  },
  'Full Moon': {
    title: 'THE GREAT REVEALING',
    poem: 'All that was hidden in darkness is now revealed in light. The seed planted at the New Moon breaks through soil. Your work culminates. The world witnesses your fullness.',
    favors: ['Celebration', 'Releasing what no longer serves', 'Public visibility', 'Gratitude practices'],
    warnings: ['Emotions run high', 'Sleep may be disturbed']
  },
  'Waning Gibbous': {
    title: 'THE SHARING',
    poem: 'The light begins its gentle retreat, but wisdom remains. Share what you have learned. Teach others what the fullness taught you.',
    favors: ['Sharing knowledge', 'Teaching', 'Giving back', 'Gratitude'],
    warnings: ['Don\'t cling to the peak', 'Let the cycle complete']
  },
  'Last Quarter': {
    title: 'THE RELEASING',
    poem: 'Half remains, half must go. What will you carry forward? What will you leave behind? The choice is yours, and yours alone.',
    favors: ['Letting go', 'Releasing attachments', 'Clearing space', 'Forgiveness'],
    warnings: ['Don\'t start new projects', 'Complete what you can']
  },
  'Waning Crescent': {
    title: 'THE SURRENDER',
    poem: 'A silver whisper fading into black. Rest now. The work is done. Surrender to the darkness, knowing light will return.',
    favors: ['Deep rest', 'Surrender', 'Meditation', 'Preparation', 'Dream work'],
    warnings: ['Avoid major decisions', 'Conserve energy']
  }
};

const LunaCard: React.FC<LunaCardProps> = ({ moonPhase, moonPosition, isExpanded, onToggle }) => {
  if (!moonPhase) {
    return (
      <div className="premium-card luna loading">
        <div className="card-sheen" />
        <div className="loading-spinner">☽</div>
        <div>Calculating lunar data...</div>
      </div>
    );
  }

  const oracle = MOON_ORACLES[moonPhase.phase] || MOON_ORACLES['New Moon'];
  
  // Calculate moon age percentage through cycle (approximate from angle)
  const synodicMonth = 29.53059;
  const moonAge = (moonPhase.angle / 360) * synodicMonth;
  const cycleProgress = (moonAge / synodicMonth) * 100;

  return (
    <div className={`premium-card luna ${isExpanded ? 'expanded' : ''}`} onClick={onToggle}>
      <div className="card-sheen" />
      
      {/* Default View - Epic 3D Moon */}
      <div className="card-default">
        <div className="luna-visual">
          {/* 3D Moon Container */}
          <div className="moon-3d-container">
            {/* Moon surface craters */}
            <div className="moon-crater moon-crater-1" />
            <div className="moon-crater moon-crater-2" />
            <div className="moon-crater moon-crater-3" />
            
            {/* Phase shadow overlay - using clip-path for accurate phase rendering */}
            <div 
              className="moon-phase-shadow"
              style={{ 
                clipPath: moonPhase.isWaxing 
                  ? `inset(0 ${100 - moonPhase.illumination}% 0 0)` // Shadow from right
                  : `inset(0 0 0 ${100 - moonPhase.illumination}%)`, // Shadow from left
                background: 'rgba(0, 0, 0, 0.85)'
              }}
            />
            
            {/* Shadow overlay for depth */}
            <div className="moon-shadow-overlay" />
          </div>
          
          {/* Glowing rings - opacity based on illumination */}
          <div 
            className="moon-glow-ring" 
            style={{ opacity: 0.3 + (moonPhase.illumination / 200) }}
          />
          
          {/* Illumination text */}
          <div className="moon-illumination-text">{moonPhase.illumination.toFixed(0)}%</div>
        </div>
        
        <div className="card-primary-content centered">
          <div className="moon-phase-name">{moonPhase.name.toUpperCase()}</div>
          <div className="moon-trend">
            {moonPhase.isWaxing ? 'Waxing → Growing' : 'Waning → Diminishing'}
          </div>
        </div>
        <div className="expand-hint">
          <span className="expand-icon">↓</span>
          <span>Read the Oracle</span>
        </div>
      </div>

      {/* Expanded View - Lunar Temple */}
      {isExpanded && (
        <div className="card-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="expanded-header">
            <div className="expanded-title">THE LUNAR TEMPLE</div>
            <button className="close-btn" onClick={onToggle}>×</button>
          </div>

          {/* Phase Cycle Visual */}
          <div className="expanded-section">
            <div className="phase-cycle-visual">
              {['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'].map((emoji, i) => {
                const phasePos = (i / 8) * 100;
                const currentPos = cycleProgress;
                const isActive = Math.abs(phasePos - currentPos) < 12.5;
                return (
                  <div key={i} className={`cycle-phase ${isActive ? 'active' : ''}`}>
                    <span>{emoji}</span>
                    {isActive && <div className="phase-indicator">★</div>}
                  </div>
                );
              })}
            </div>
            <div className="cycle-line">
              <div className="cycle-progress" style={{ width: `${cycleProgress}%` }} />
            </div>
          </div>

          {/* Oracle Message */}
          <div className="expanded-section oracle-section">
            <div className="oracle-title">{oracle.title}</div>
            <div className="oracle-poem">&ldquo;{oracle.poem}&rdquo;</div>
          </div>

          {/* Moon Position */}
          {moonPosition && (
            <div className="expanded-section">
              <div className="section-label">☽ MOON'S CURRENT THRONE</div>
              <div className="moon-position-card">
                <span className="mp-sign">{SIGN_SYMBOLS[moonPosition.sign as ZodiacSign]}</span>
                <span className="mp-degree">{(moonPosition.degreeInSign ?? 0).toFixed(1)}°</span>
                <span className="mp-name">{moonPosition.sign.charAt(0).toUpperCase() + moonPosition.sign.slice(1)}</span>
              </div>
              <div className="moon-qualities">
                <span className="quality-tag element">
                  {ELEMENT_META[SIGN_ELEMENTS[moonPosition.sign as ZodiacSign]]?.symbol}
                  {' '}{SIGN_ELEMENTS[moonPosition.sign as ZodiacSign]}
                </span>
                <span className="quality-tag modality">
                  {MODALITY_SYMBOLS[SIGN_MODALITIES[moonPosition.sign as ZodiacSign]]}
                  {' '}{SIGN_MODALITIES[moonPosition.sign as ZodiacSign]}
                </span>
              </div>
            </div>
          )}

          {/* Phase Guidance */}
          <div className="expanded-section">
            <div className="section-label">THIS PHASE FAVORS</div>
            <div className="favors-list">
              {oracle.favors.map((favor, i) => (
                <div key={i} className="favor-item">
                  <span className="favor-icon">✦</span>
                  <span>{favor}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="expanded-section">
            <div className="section-label">BE MINDFUL OF</div>
            <div className="warnings-list">
              {oracle.warnings.map((warning, i) => (
                <div key={i} className="warning-item">
                  <span className="warning-icon">⚠</span>
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Phase (calculated) */}
          <div className="expanded-section next-phase">
            <div className="section-label">NEXT PHASE</div>
            <div className="next-phase-info">
              <span className="next-phase-name">
                {moonPhase.isWaxing 
                  ? (moonPhase.name === 'New Moon' ? 'Waxing Crescent' : moonPhase.name === 'Waxing Crescent' ? 'First Quarter' : moonPhase.name === 'First Quarter' ? 'Waxing Gibbous' : 'Full Moon')
                  : (moonPhase.name === 'Full Moon' ? 'Waning Gibbous' : moonPhase.name === 'Waning Gibbous' ? 'Last Quarter' : moonPhase.name === 'Last Quarter' ? 'Waning Crescent' : 'New Moon')
                }
              </span>
              <span className="next-phase-when">
                {moonPhase.isWaxing 
                  ? `in ~${Math.ceil((180 - moonPhase.angle) / 12)} days`
                  : `in ~${Math.ceil((360 - moonPhase.angle) / 12)} days`
                }
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Card 3: KRONOS - The Chaldean Hourglass
// ============================================================================

interface KronosCardProps {
  planetaryHour: { 
    planet: PlanetId; 
    symbol: string; 
    activities: string[]; 
    location?: string;
    isDay?: boolean;
    sunrise?: Date;
    sunset?: Date;
    progress?: number;
  } | null;
  isExpanded: boolean;
  onToggle: () => void;
}

const CHALDEAN_ORDER: PlanetId[] = ['saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'];

const PLANETARY_GUIDANCE: Record<string, { 
  title: string; 
  description: string; 
  do: string[]; 
  dont: string[];
  quality: string;
}> = {
  sun: {
    title: 'THE SOLAR HOUR',
    description: 'The Sun illuminates all it touches. This hour favors visibility, leadership, and matters of the heart and ego.',
    do: ['Take leadership', 'Make important requests', 'Focus on visibility', 'Express yourself', 'Seek recognition'],
    dont: ['Hide in the shadows', 'Avoid responsibility', 'Dim your light'],
    quality: 'Vitality & Recognition'
  },
  moon: {
    title: 'THE LUNAR HOUR',
    description: 'The Moon rules the tides of emotion and intuition. A time for nurturing, home, and psychic receptivity.',
    do: ['Nurture relationships', 'Trust intuition', 'Home and family matters', 'Emotional processing', 'Dream work'],
    dont: ['Force rational decisions', 'Ignore feelings', 'Push too hard'],
    quality: 'Emotion & Intuition'
  },
  mars: {
    title: 'THE MARTIAN HOUR',
    description: 'Mars brings fire, drive, and competitive energy. Physical action and confrontation are favored.',
    do: ['Physical activity', 'Handle conflicts directly', 'Exercise', 'Competitive pursuits', 'Take bold action'],
    dont: ['Avoid necessary confrontation', 'Repress anger', 'Start arguments'],
    quality: 'Action & Drive'
  },
  mercury: {
    title: 'THE MERCURIAL HOUR',
    description: 'Mercury quickens the mind and tongue. Communication, learning, and commerce flow easily now.',
    do: ['Send important messages', 'Sign contracts (if direct)', 'Write and study', 'Negotiate', 'Travel short distances'],
    dont: ['Engage in deception', 'Spread gossip', 'Sign if Mercury retrograde'],
    quality: 'Mind & Communication'
  },
  jupiter: {
    title: 'THE JOVIAN HOUR',
    description: 'Jupiter expands all it touches. Fortune, wisdom, and growth are blessed in this hour.',
    do: ['Business dealings', 'Seek wisdom', 'Expand horizons', 'Teach and learn', 'Acts of generosity'],
    dont: ['Be miserly', 'Think small', 'Limit yourself'],
    quality: 'Expansion & Fortune'
  },
  venus: {
    title: 'THE VENUSIAN HOUR',
    description: 'Venus bathes the world in beauty and desire. Love, art, and harmony reign supreme.',
    do: ['Romance and courtship', 'Artistic creation', 'Socialize', 'Create beauty', 'Resolve conflicts peacefully'],
    dont: ['Force outcomes', 'Ignore aesthetics', 'Rush intimacy'],
    quality: 'Love & Beauty'
  },
  saturn: {
    title: 'THE SATURNINE HOUR',
    description: 'Saturn demands discipline and structure. Hard work now yields lasting results.',
    do: ['Focus on responsibilities', 'Study and organize', 'Plan ahead', 'Build foundations', 'Accept limitations'],
    dont: ['Cut corners', 'Avoid duties', 'Expect instant results'],
    quality: 'Discipline & Structure'
  }
};

const KronosCard: React.FC<KronosCardProps> = ({ planetaryHour, isExpanded, onToggle }) => {
  if (!planetaryHour) {
    return (
      <div className="premium-card kronos loading">
        <div className="card-sheen" />
        <div className="loading-spinner">◷</div>
        <div>Calculating planetary hour...</div>
      </div>
    );
  }

  const hourData = PLANETARY_GUIDANCE[planetaryHour.planet] || PLANETARY_GUIDANCE.sun;
  const currentHourIndex = CHALDEAN_ORDER.indexOf(planetaryHour.planet as PlanetId);
  
  // Calculate current hour progress (mock - would use actual sunrise/sunset)
  const now = new Date();
  const hourProgress = ((now.getMinutes() + now.getSeconds() / 60) / 60) * 100;

  return (
    <div className={`premium-card kronos ${isExpanded ? 'expanded' : ''}`} onClick={onToggle}>
      <div className="card-sheen" />
      
      {/* Default View */}
      <div className="card-default">
        <div className="hour-symbol-container">
          <div className="hour-glow" />
          <span className="hour-symbol-large">{planetaryHour.symbol}</span>
        </div>
        <div className="card-primary-content centered">
          <div className="hour-planet-name">{planetaryHour.planet.toUpperCase()}</div>
          <div className="hour-ruler-label">Hour Ruler</div>
          <div className="hour-quality">{hourData.quality}</div>
        </div>
        <div className="expand-hint">
          <span className="expand-icon">↓</span>
          <span>The Chaldean Order</span>
        </div>
      </div>

      {/* Expanded View - The Solar Chariot */}
      {isExpanded && (
        <div className="card-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="expanded-header">
            <div className="expanded-title">THE CHALDEAN HOURGLASS</div>
            <button className="close-btn" onClick={onToggle}>×</button>
          </div>

          {/* Current Hour Display */}
          <div className="expanded-section current-hour">
            <div className="hour-display-large">
              <span className="hour-planet-symbol">{planetaryHour.symbol}</span>
              <div className="hour-info">
                <span className="hour-name">{hourData.title}</span>
                <span className="hour-time">{now.getHours()}:00 — {(now.getHours() + 1) % 24}:00</span>
                {planetaryHour.location && (
                  <span className="hour-location" style={{ fontSize: '11px', opacity: 0.7 }}>
                    📍 {planetaryHour.location}
                  </span>
                )}
              </div>
            </div>
            
            {/* Hour Progress */}
            <div className="hour-progress-container">
              <div className="hour-progress-track">
                <div className="hour-progress-fill" style={{ width: `${hourProgress}%` }} />
              </div>
              <span className="hour-progress-label">{Math.round(100 - hourProgress)} minutes remaining</span>
            </div>
          </div>

          {/* Chaldean Order Visual */}
          <div className="expanded-section">
            <div className="section-label">THE CHALDEAN ORDER</div>
            <div className="chaldean-order">
              {CHALDEAN_ORDER.map((planet, i) => {
                const isCurrent = i === currentHourIndex;
                const isPast = i < currentHourIndex;
                return (
                  <div key={planet} className={`chaldean-planet ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}>
                    <span className="cp-symbol">{SYMBOLS[planet]}</span>
                    <span className="cp-name">{planet}</span>
                    {isCurrent && <div className="current-indicator">★</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sunrise/Sunset Times */}
          {(planetaryHour.sunrise || planetaryHour.sunset) && (
            <div className="expanded-section">
              <div className="section-label">☀ LOCAL SOLAR TIMES</div>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '12px',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '10px'
              }}>
                {planetaryHour.sunrise && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>🌅</div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>Sunrise</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>
                      {planetaryHour.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
                {planetaryHour.sunset && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>🌇</div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>Sunset</div>
                    <div style={{ fontSize: '16px', fontWeight: 600 }}>
                      {planetaryHour.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Why This Hour */}
          <div className="expanded-section">
            <div className="section-label">WHY {planetaryHour.planet.toUpperCase()} NOW?</div>
            <p className="hour-description">{hourData.description}</p>
          </div>

          {/* Do's and Don'ts */}
          <div className="expanded-section">
            <div className="section-label">✓ FAVORED ACTIVITIES</div>
            <div className="activities-list do">
              {hourData.do.map((activity, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-icon">✓</span>
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="expanded-section">
            <div className="section-label">✗ BEST TO AVOID</div>
            <div className="activities-list dont">
              {hourData.dont.map((activity, i) => (
                <div key={i} className="activity-item">
                  <span className="activity-icon">✗</span>
                  <span>{activity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Card 4: STATION - The Celestial Weather
// ============================================================================

interface StationCardProps {
  retrogrades: Array<{ planet: string; isRetrograde: boolean }>;
  positions: Record<string, CelestialBody> | null;
  isExpanded: boolean;
  onToggle: () => void;
}

const PLANET_ORDER: PlanetId[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

const PLANET_DIGNITY: Record<string, Record<string, 'strong' | 'weak' | 'neutral' | 'debilitated'>> = {
  sun: { aries: 'strong', leo: 'strong', aquarius: 'weak', libra: 'debilitated' },
  moon: { taurus: 'strong', cancer: 'strong', scorpio: 'weak', capricorn: 'debilitated' },
  mercury: { gemini: 'strong', virgo: 'strong', sagittarius: 'weak', pisces: 'debilitated' },
  venus: { taurus: 'strong', libra: 'strong', scorpio: 'weak', aries: 'debilitated' },
  mars: { aries: 'strong', scorpio: 'strong', cancer: 'weak', libra: 'debilitated' },
  jupiter: { sagittarius: 'strong', pisces: 'strong', gemini: 'weak', virgo: 'debilitated' },
  saturn: { capricorn: 'strong', aquarius: 'strong', cancer: 'weak', leo: 'debilitated' },
};

const StationCard: React.FC<StationCardProps> = ({ retrogrades, positions, isExpanded, onToggle }) => {
  const retroCount = retrogrades.length;
  const directCount = positions ? Object.keys(positions).filter(p => !positions[p].isRetrograde).length : 0;
  
  // Weather rating
  const getWeatherRating = () => {
    if (retroCount === 0) return { label: 'Clear Skies', icon: '☀️', color: '#34d399' };
    if (retroCount <= 2) return { label: 'Partly Cloudy', icon: '⛅', color: '#fbbf24' };
    if (retroCount <= 4) return { label: 'Stormy', icon: '⛈️', color: '#f97316' };
    return { label: 'Heavy Weather', icon: '🌪️', color: '#ef4444' };
  };
  
  const weather = getWeatherRating();

  return (
    <div className={`premium-card station ${isExpanded ? 'expanded' : ''}`} onClick={onToggle}>
      <div className="card-sheen" />
      
      {/* Default View */}
      <div className="card-default">
        <div className="weather-icon-container">
          <span className="weather-icon">{weather.icon}</span>
          <div className="weather-glow" style={{ background: weather.color }} />
        </div>
        <div className="card-primary-content centered">
          <div className="retro-count">{retroCount} RETROGRADE{retroCount !== 1 ? 'S' : ''}</div>
          <div className="retro-planets">
            {retroCount > 0 
              ? retrogrades.map(r => SYMBOLS[r.planet as PlanetId]).join(' ')
              : 'All planets direct'
            }
          </div>
          <div className="weather-label" style={{ color: weather.color }}>{weather.label}</div>
        </div>
        <div className="expand-hint">
          <span className="expand-icon">↓</span>
          <span>Celestial Weather Report</span>
        </div>
      </div>

      {/* Expanded View - Planetary Stations */}
      {isExpanded && (
        <div className="card-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="expanded-header">
            <div className="expanded-title">THE CELESTIAL WEATHER</div>
            <button className="close-btn" onClick={onToggle}>×</button>
          </div>

          {/* Weather Summary */}
          <div className="expanded-section weather-summary">
            <div className="weather-rating-large">
              <span className="wr-icon">{weather.icon}</span>
              <div className="wr-info">
                <span className="wr-label">{weather.label}</span>
                <span className="wr-count">{directCount} direct, {retroCount} retrograde</span>
              </div>
            </div>
          </div>

          {/* Planet Status List */}
          <div className="expanded-section">
            <div className="section-label">PLANETARY STATIONS</div>
            <div className="planet-status-list">
              {positions && PLANET_ORDER.map(planetId => {
                const body = positions[planetId];
                if (!body) return null;
                
                const isRetro = body.isRetrograde;
                const dignity = PLANET_DIGNITY[planetId]?.[body.sign] || 'neutral';
                const signDeg = (body.degreeInSign ?? 0).toFixed(1);
                
                return (
                  <div key={planetId} className={`planet-row ${isRetro ? 'retro' : ''} ${dignity}`}>
                    <div className="planet-row-left">
                      <span className="pr-symbol">{SYMBOLS[planetId]}</span>
                      <span className="pr-name">{PLANET_NAMES[planetId as PlanetId] || planetId}</span>
                      {isRetro && <span className="pr-retro-badge">℞</span>}
                    </div>
                    <div className="planet-row-right">
                      <span className="pr-sign">{SIGN_SYMBOLS[body.sign as ZodiacSign]}</span>
                      <span className="pr-degree">{signDeg}°</span>
                      <div className={`pr-dignity ${dignity}`}>
                        {dignity === 'strong' && '★'}
                        {dignity === 'weak' && '▽'}
                        {dignity === 'debilitated' && '⚠'}
                        {dignity === 'neutral' && '○'}
                      </div>
                    </div>
                    <div className="pr-motion">
                      {isRetro ? '← Retrograde' : '→ Direct'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retrograde Guidance */}
          {retroCount > 0 && (
            <div className="expanded-section">
              <div className="section-label">RETROGRADE GUIDANCE</div>
              <div className="retro-guidance">
                <p>
                  With {retroCount} planet{retroCount !== 1 ? 's' : ''} retrograde, this is a time for 
                  {retroCount > 2 ? ' significant' : ''} review and introspection. 
                  {retroCount >= 3 
                    ? 'Major new beginnings should be approached with caution.' 
                    : 'New projects are possible with extra care in the affected areas.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Card 5: STELLIUM - The Living Solar System
// ============================================================================

interface StelliumCardProps {
  positions: Record<string, CelestialBody> | null;
  isExpanded: boolean;
  onToggle: () => void;
}

const StelliumCard: React.FC<StelliumCardProps> = ({ positions, isExpanded, onToggle }) => {
  // Calculate elemental balance
  const getElementalBalance = () => {
    if (!positions) return { fire: 0, earth: 0, air: 0, water: 0 };
    
    const counts = { fire: 0, earth: 0, air: 0, water: 0 };
    const use13 = getZodiacSystemPreference() === '13-sign';
    const signElements = use13 ? SIGN_ELEMENTS_13 : SIGN_ELEMENTS;
    Object.values(positions).forEach(body => {
      const element = signElements[body.sign as ZodiacSign];
      if (element && counts[element as keyof typeof counts] !== undefined) {
        counts[element as keyof typeof counts]++;
      }
    });
    return counts;
  };
  
  // Calculate modal balance
  const getModalBalance = () => {
    if (!positions) return { cardinal: 0, fixed: 0, mutable: 0 };
    
    const counts = { cardinal: 0, fixed: 0, mutable: 0 };
    Object.values(positions).forEach(body => {
      const modality = SIGN_MODALITIES[body.sign as ZodiacSign];
      if (modality && counts[modality as keyof typeof counts] !== undefined) {
        counts[modality as keyof typeof counts]++;
      }
    });
    return counts;
  };
  
  const elements = getElementalBalance();
  const modalities = getModalBalance();

  return (
    <div className={`premium-card stellium ${isExpanded ? 'expanded' : ''}`} onClick={onToggle}>
      <div className="card-sheen" />
      
      {/* Default View - Epic 3D Planet Icons */}
      <div className="card-default">
        <div className="stellium-preview-3d">
          {positions && PLANET_ORDER.slice(0, 6).map((planetId) => {
            const body = positions[planetId];
            if (!body) return null;
            return (
              <div key={planetId} className={`planet-thumb planet-icon-${planetId}`} />
            );
          })}
        </div>
        <div className="card-primary-content centered">
          <div className="stellium-title">CURRENT ALIGNMENTS</div>
          <div className="stellium-count">
            {positions ? Object.keys(positions).length : 0} celestial bodies tracked
          </div>
        </div>
        <div className="expand-hint">
          <span className="expand-icon">↓</span>
          <span>View Planetary Spheres</span>
        </div>
      </div>

      {/* Expanded View - Planetary Spheres */}
      {isExpanded && (
        <div className="card-expanded" onClick={(e) => e.stopPropagation()}>
          <div className="expanded-header">
            <div className="expanded-title">THE PLANETARY SPHERES</div>
            <button className="close-btn" onClick={onToggle}>×</button>
          </div>

          {/* Elemental Balance */}
          <div className="expanded-section balance-section">
            <div className="section-label">ELEMENTAL BALANCE</div>
            <div className="elemental-bars">
              {Object.entries(elements).map(([element, count]) => (
                <div key={element} className="element-bar">
                  <span className="eb-symbol">{ELEMENT_META[element]?.symbol || '?'}</span>
                  <div className="eb-track">
                    <div 
                      className="eb-fill" 
                      style={{ 
                        width: `${Math.min((count / 10) * 100, 100)}%`,
                        background: ELEMENT_META[element]?.color || '#ccc'
                      }} 
                    />
                  </div>
                  <span className="eb-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Balance */}
          <div className="expanded-section balance-section">
            <div className="section-label">MODAL BALANCE</div>
            <div className="modal-chips">
              {Object.entries(modalities).map(([modality, count]) => (
                <div key={modality} className={`modal-chip ${count > 0 ? 'active' : ''}`}>
                  <span className="mc-symbol">{MODALITY_SYMBOLS[modality]}</span>
                  <span className="mc-name">{modality}</span>
                  <span className="mc-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Planet Spheres */}
          <div className="expanded-section">
            <div className="section-label">CURRENT POSITIONS</div>
            <div className="planet-spheres">
              {positions && PLANET_ORDER.map(planetId => {
                const body = positions[planetId];
                if (!body) return null;
                
                const use13Signs = getZodiacSystemPreference() === '13-sign';
                const signElements = use13Signs ? SIGN_ELEMENTS_13 : SIGN_ELEMENTS;
                const signElement = signElements[body.sign as ZodiacSign];
                const dignity = PLANET_DIGNITY[planetId]?.[body.sign] || 'neutral';
                const degreesPerSign = use13Signs ? (360 / 13) : 30;
                const signDeg = Math.floor(body.longitude % degreesPerSign);
                const minutes = Math.floor(((body.longitude % degreesPerSign) % 1) * 60);
                
                return (
                  <div key={planetId} className={`planet-sphere ${body.isRetrograde ? 'retro' : ''}`}>
                    <div className="ps-orbit">
                      <div className={`planet-icon-${planetId}`} />
                      {body.isRetrograde && <span className="ps-retro">℞</span>}
                    </div>
                    <div className="ps-info">
                      <span className="ps-name">{PLANET_NAMES[planetId as PlanetId]}</span>
                      <span className="ps-position">
                        {SIGN_SYMBOLS[body.sign as ZodiacSign]} {signDeg}° {minutes.toString().padStart(2, '0')}'
                      </span>
                      <div className="ps-qualities">
                        <span className="ps-element" style={{ color: ELEMENT_META[signElement || 'fire']?.color || '#f59e0b' }}>
                          {ELEMENT_META[signElement || 'fire']?.symbol || '?'}
                        </span>
                        <span className={`ps-dignity ${dignity}`}>
                          {dignity === 'strong' ? '★ Strong' : 
                           dignity === 'debilitated' ? '⚠ Weak' : 
                           '○ Neutral'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Main Export: All 5 Cards
// ============================================================================

export interface PremiumCardsProps {
  currentTime: Date;
  julianDay: number;
  positions: Record<string, CelestialBody> | null;
  moonPhase: SwissMoonPhase | null;
  planetaryHour: { 
    planet: PlanetId; 
    symbol: string; 
    activities: string[]; 
    location?: string;
    isDay?: boolean;
    sunrise?: Date;
    sunset?: Date;
    progress?: number;
  } | null;
  retrogrades: Array<{ planet: PlanetId; isRetrograde: boolean }>;
  localHouses?: {
    ascendant: number;
    mc: number;
    ic: number;
    descendant: number;
    cusps: number[];
    houseSystem: string;
  } | null;
}

export const PremiumCards: React.FC<PremiumCardsProps> = (props) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  
  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="premium-cards-container">
      <ChronosCard 
        currentTime={props.currentTime}
        julianDay={props.julianDay}
        positions={props.positions}
        isExpanded={expandedCard === 'chronos'}
        onToggle={() => toggleCard('chronos')}
      />
      
      <LunaCard 
        moonPhase={props.moonPhase}
        moonPosition={props.positions?.moon || null}
        isExpanded={expandedCard === 'luna'}
        onToggle={() => toggleCard('luna')}
      />
      
      <KronosCard 
        planetaryHour={props.planetaryHour}
        isExpanded={expandedCard === 'kronos'}
        onToggle={() => toggleCard('kronos')}
      />
      
      <StationCard 
        retrogrades={props.retrogrades}
        positions={props.positions}
        isExpanded={expandedCard === 'station'}
        onToggle={() => toggleCard('station')}
      />
      
      <StelliumCard 
        positions={props.positions}
        isExpanded={expandedCard === 'stellium'}
        onToggle={() => toggleCard('stellium')}
      />
    </div>
  );
};

export default PremiumCards;
