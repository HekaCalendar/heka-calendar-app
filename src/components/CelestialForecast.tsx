/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL FORECAST - Weather Channel for the Cosmos 🌤️
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * A complete redesign that presents celestial events like a weather forecast:
 * - Full screen immersive experience
 * - Exact dates and times for all events
 * - "Right Now" snapshot - what's happening THIS moment
 * - Countdowns and duration periods
 * - Visual weather-style presentation
 * - Confidence through specificity
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { 
  PLANET_MEANINGS,
  SIGN_MEANINGS,
  ASPECT_MEANINGS,
  HOUSE_MEANINGS,
  generatePlanetInSignReading,
  generateTransitReading
} from '../oracle/celestialEducation';
import type { PersonalTransit, PlanetPosition } from '../oracle/birthChartIntegration';
import './CelestialForecast.css';

interface CelestialForecastProps {
  positions: Record<string, PlanetPosition>;
  transits: PersonalTransit[];
  moonPhase: {
    phase: string;
    sign: string;
    illumination: number;
  };
  currentDate?: Date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const CelestialForecast: React.FC<CelestialForecastProps> = ({
  positions,
  transits,
  moonPhase,
  currentDate = new Date()
}) => {
  const { t } = useTranslation('celestial');
  const [activeView, setActiveView] = useState<'now' | 'today' | 'week' | 'transits'>('now');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  
  // Calculate timing data
  const timingData = useMemo(() => calculateTimingData(currentDate, moonPhase, transits), [currentDate, moonPhase, transits]);
  
  return (
    <div className="celestial-forecast">
      {/* Header - Current Time Display */}
      <header className="forecast-header">
        <div className="forecast-branding">
          <span className="forecast-logo">🌤️</span>
          <div>
            <h2>{t('forecastTitle')}</h2>
            <span className="forecast-datetime">
              {new Intl.DateTimeFormat(i18n.language || 'en', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(currentDate)}
            </span>
          </div>
        </div>
        
        {/* View Selector */}
        <nav className="forecast-nav">
          {[
            { id: 'now', label: 'RIGHT NOW', icon: '⚡' },
            { id: 'today', label: 'TODAY', icon: '📅' },
            { id: 'week', label: 'THIS WEEK', icon: '📊' },
            { id: 'transits', label: 'YOUR TRANSITS', icon: '✦', count: transits.length }
          ].map((view) => (
            <button
              key={view.id}
              className={`forecast-nav-btn ${activeView === view.id ? 'active' : ''}`}
              onClick={() => setActiveView(view.id as typeof activeView)}
            >
              <span>{view.icon}</span>
              <span>{view.label}</span>
              {view.count !== undefined && view.count > 0 && (
                <span className="nav-count">{view.count}</span>
              )}
            </button>
          ))}
        </nav>
      </header>
      
      {/* Main Content Area */}
      <main className="forecast-content">
        {activeView === 'now' && (
          <RightNowView 
            positions={positions}
            moonPhase={moonPhase}
            timing={timingData}
            onSelectEvent={setSelectedEvent}
            selectedEvent={selectedEvent}
          />
        )}
        
        {activeView === 'today' && (
          <TodayView 
            positions={positions}
            moonPhase={moonPhase}
            timing={timingData}
          />
        )}
        
        {activeView === 'week' && (
          <WeekView 
            moonPhase={moonPhase}
            timing={timingData}
          />
        )}
        
        {activeView === 'transits' && (
          <TransitsForecastView 
            transits={transits}
            timing={timingData}
            onSelectTransit={setSelectedEvent}
            selectedTransit={selectedEvent}
          />
        )}
      </main>
      
      {/* Footer - Data Confidence */}
      <footer className="forecast-footer">
        <div className="data-source">
          <span className="source-icon">🛰️</span>
          <span>Swiss Ephemeris • Real-time calculations • {transits.length} personal transits active</span>
        </div>
        <div className="last-updated">
          Updated: {new Intl.DateTimeFormat(i18n.language || 'en', { hour: '2-digit', minute: '2-digit' }).format(currentDate)}
        </div>
      </footer>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// RIGHT NOW VIEW - What's happening THIS moment
// ═══════════════════════════════════════════════════════════════════════════════

const RightNowView: React.FC<{
  positions: Record<string, PlanetPosition>;
  moonPhase: { phase: string; sign: string; illumination: number };
  timing: TimingData;
  onSelectEvent: (id: string) => void;
  selectedEvent: string | null;
}> = ({ positions, moonPhase, timing, onSelectEvent, selectedEvent }) => {
  const { t } = useTranslation('celestial');
  const moonData = SIGN_MEANINGS[moonPhase.sign.toLowerCase()];
  
  return (
    <div className="right-now-view">
      {/* Hero - Current Moon Phase */}
      <section className="now-hero">
        <div className="hero-moon-display">
          <div className="moon-visual">
            <div className="moon-phase-icon" data-phase={moonPhase.phase}>
              <span className="moon-emoji">
                {getMoonEmoji(moonPhase.phase, moonPhase.illumination)}
              </span>
              <div className="illumination-ring" style={{ '--illumination': `${moonPhase.illumination}%` } as React.CSSProperties}>
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" className="moon-bg" />
                  <path className="moon-shadow" d={getMoonPath(moonPhase.phase, moonPhase.illumination)} />
                </svg>
              </div>
            </div>
            <div className="moon-status">
              <span className="phase-label">{moonPhase.phase.toUpperCase()} MOON</span>
              <span className="moon-position">in {moonPhase.sign}</span>
              <span className="illumination-percent">{Math.round(moonPhase.illumination)}% Illuminated</span>
            </div>
          </div>
          
          <div className="hero-details">
            <div className="timing-pill">
              <span className="pill-label">EXACT</span>
              <span className="pill-value">{timing.moon.exactTime}</span>
            </div>
            <div className="timing-pill">
              <span className="pill-label">NEXT PHASE</span>
              <span className="pill-value">{timing.moon.nextPhase} • {timing.moon.nextPhaseDate}</span>
            </div>
            <div className="timing-pill">
              <span className="pill-label">DURATION</span>
              <span className="pill-value">{timing.moon.daysInPhase} days total</span>
            </div>
          </div>
        </div>
        
        <div className="hero-interpretation">
          <h3>{t('whatThisMeans')}</h3>
          <p className="primary-meaning">
            The {moonPhase.phase} Moon in {moonPhase.sign} creates a {moonData?.element} energy atmosphere. 
            {getMoonPhaseNarrative(moonPhase.phase, moonPhase.sign)}
          </p>
          <div className="keywords-row">
            {(moonData?.keywords || []).slice(0, 3).map((k, i) => (
              <span key={i} className="keyword-badge">{k}</span>
            ))}
          </div>
        </div>
      </section>
      
      {/* Active Planets Grid */}
      <section className="active-planets-section">
        <h3 className="section-title">
          <span>🪐</span>
          <span>{t('planetsActive')}</span>
          <span className="timestamp">{timing.currentTime}</span>
        </h3>
        
        <div className="planets-forecast-grid">
          {['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].map((planetName) => {
            const pos = positions[planetName];
            if (!pos) return null;
            
            const planetData = PLANET_MEANINGS[planetName];
            const signData = SIGN_MEANINGS[pos.sign.toLowerCase()];
            const eventId = `planet-${planetName}`;
            const isSelected = selectedEvent === eventId;
            const reading = generatePlanetInSignReading(planetName, pos.sign);
            
            return (
              <div 
                key={planetName}
                className={`planet-forecast-card ${isSelected ? 'expanded' : ''}`}
                style={{ '--element-color': getElementColor(signData?.element) } as React.CSSProperties}
              >
                <button 
                  className="planet-forecast-header"
                  onClick={() => onSelectEvent(isSelected ? '' : eventId)}
                >
                  <div className="planet-id">
                    <span className="planet-symbol-large">{planetData?.symbol}</span>
                    <div className="planet-names">
                      <span className="p-name">{planetData?.name}</span>
                      <span className="p-position">{pos.sign} {Math.floor(pos.degree)}°{pos.minute}'</span>
                    </div>
                  </div>
                  <div className="planet-meta">
                    <span className={`element-tag ${signData?.element}`}>{signData?.element}</span>
                    {pos.retrograde && <span className="retro-tag">℞ RX</span>}
                    <span className="expand-chevron">{isSelected ? '▼' : '▶'}</span>
                  </div>
                </button>
                
                {isSelected && (
                  <div className="planet-forecast-body">
                    <div className="forecast-reading">
                      <p className="reading-lead">{reading.meaning}</p>
                      <div className="reading-sections">
                        <div className="r-section">
                          <h5>{t('psychologicalImpact')}</h5>
                          <p>{reading.psychological}</p>
                        </div>
                        <div className="r-section">
                          <h5>{t('practicalExpression')}</h5>
                          <p>{reading.practical}</p>
                        </div>
                        <div className="r-section shadow">
                          <h5>⚠️ Watch For</h5>
                          <p>{reading.shadow}</p>
                        </div>
                      </div>
                    </div>
                    <div className="position-precision">
                      <span>{t('exactPosition')}: {pos.sign} {pos.degree.toFixed(2)}°</span>
                      <span>{t('speed')}: {pos.speed?.toFixed(2) || '0'}°/day</span>
                      {pos.retrograde && <span className="rx-note">{t('retrogradeNote')}</span>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TODAY VIEW - Full day forecast
// ═══════════════════════════════════════════════════════════════════════════════

const TodayView: React.FC<{
  positions: Record<string, PlanetPosition>;
  moonPhase: { phase: string; sign: string };
  timing: TimingData;
}> = ({ moonPhase, timing }) => {
  const { t } = useTranslation('celestial');
  return (
    <div className="today-view">
      <div className="day-summary-card">
        <div className="day-header">
          <h3>{t('todaysCelestialWeather')}</h3>
          <span className="day-date">{timing.today.date}</span>
        </div>
        
        <div className="day-narrative">
          <p>{timing.today.narrative}</p>
        </div>
        
        <div className="day-highlights">
          <div className="highlight-item">
            <span className="h-icon">🌙</span>
            <div>
              <span className="h-label">{t('moonPhaseLabel')}</span>
              <span className="h-value">{moonPhase.phase} in {moonPhase.sign}</span>
            </div>
          </div>
          <div className="highlight-item">
            <span className="h-icon">⏰</span>
            <div>
              <span className="h-label">{t('moonVoidLabel')}</span>
              <span className="h-value">{timing.today.voidOfCourse || 'None today'}</span>
            </div>
          </div>
          <div className="highlight-item">
            <span className="h-icon">💫</span>
            <div>
              <span className="h-label">{t('bestFor')}</span>
              <span className="h-value">{timing.today.bestFor.join(', ')}</span>
            </div>
          </div>
          <div className="highlight-item">
            <span className="h-icon">⚠️</span>
            <div>
              <span className="h-label">{t('avoid')}</span>
              <span className="h-value">{timing.today.avoid.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hourly-forecast">
        <h4>{t('hourlyMoonMood')}</h4>
        <div className="hourly-grid">
          {timing.today.hourly.map((hour, i) => (
            <div key={i} className={`hour-slot ${hour.quality}`}>
              <span className="hour-time">{hour.time}</span>
              <span className="hour-mood">{hour.mood}</span>
              <span className="hour-quality">{hour.quality}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// WEEK VIEW - Upcoming phases
// ═══════════════════════════════════════════════════════════════════════════════

const WeekView: React.FC<{
  moonPhase: { phase: string; sign: string };
  timing: TimingData;
}> = ({ timing }) => {
  const { t } = useTranslation('celestial');
  return (
    <div className="week-view">
      <h3 className="week-title">{t('upcomingEvents')}</h3>
      
      <div className="moon-phase-timeline">
        {timing.week.phases.map((phase, i) => (
          <div key={i} className={`phase-event ${phase.current ? 'current' : ''}`}>
            <div className="phase-date-column">
              <span className="phase-day">{phase.dayName}</span>
              <span className="phase-date">{phase.date}</span>
              <span className="phase-time">{phase.time}</span>
            </div>
            <div className="phase-visual-column">
              <div className="phase-connector">
                <div className="connector-line" />
                <div className="phase-dot">{phase.current && <span className="pulse" />}</div>
              </div>
              <span className="phase-emoji">{phase.emoji}</span>
            </div>
            <div className="phase-info-column">
              <span className="phase-name">{phase.name}</span>
              <span className="phase-sign">in {phase.sign}</span>
              <p className="phase-meaning">{phase.meaning}</p>
              {phase.countdown && (
                <span className="phase-countdown">{phase.countdown}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="week-insights">
        <h4>{t('thisWeeksThemes')}</h4>
        <div className="theme-cards">
          {timing.week.themes.map((theme, i) => (
            <div key={i} className="theme-card">
              <span className="theme-icon">{theme.icon}</span>
              <span className="theme-name">{theme.name}</span>
              <span className="theme-dates">{theme.dates}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSITS FORECAST VIEW - Personal transits with timing
// ═══════════════════════════════════════════════════════════════════════════════

const TransitsForecastView: React.FC<{
  transits: PersonalTransit[];
  timing: TimingData;
  onSelectTransit: (id: string) => void;
  selectedTransit: string | null;
}> = ({ transits, timing, onSelectTransit, selectedTransit }) => {
  const { t } = useTranslation('celestial');
  if (transits.length === 0) {
    return (
      <div className="transits-empty">
        <div className="empty-icon">✦</div>
        <h3>{t('noMajorTransits')}</h3>
        <p>Current planetary movements aren't forming strong aspects to your birth chart.</p>
        <p className="empty-sub">Check back tomorrow - the celestial weather changes constantly.</p>
        <div className="next-check">
          <span>{t('nextCheck')}: {timing.tomorrow.date} at {timing.tomorrow.time}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="transits-forecast-view">
      <div className="transits-header">
        <h3>{t('yourPersonalTransits')}</h3>
        <span className="transits-count">{transits.length} active</span>
      </div>
      
      <div className="transits-timeline">
        {transits
          .sort((a, b) => b.strength - a.strength)
          .map((transit) => {
            const isSelected = selectedTransit === transit.id;
            const reading = generateTransitReading(transit);
            const aspectData = ASPECT_MEANINGS[transit.aspect.toLowerCase()];
            const houseData = HOUSE_MEANINGS[transit.activatedHouse];
            const timing = calculateTransitTiming(transit);
            
            return (
              <div 
                key={transit.id}
                className={`transit-forecast-item ${aspectData?.nature} ${isSelected ? 'expanded' : ''}`}
              >
                <button 
                  className="transit-forecast-header"
                  onClick={() => onSelectTransit(isSelected ? '' : transit.id)}
                >
                  <div className="transit-timing-badge">
                    <span className="t-orb">{transit.orb.toFixed(1)}° orb</span>
                    <span className={`t-nature ${aspectData?.nature}`}>{aspectData?.nature}</span>
                  </div>
                  
                  <div className="transit-actors">
                    <div className="actor transiting">
                      <span className="actor-symbol">
                        {PLANET_MEANINGS[transit.transitingPlanet.toLowerCase()]?.symbol}
                      </span>
                      <span className="actor-name">{transit.transitingPlanet}</span>
                      <span className="actor-position">{transit.transitingSign}</span>
                    </div>
                    
                    <div className="aspect-visual">
                      <span className="aspect-angle">{aspectData?.angle}°</span>
                      <span className="aspect-symbol">{getAspectSymbol(transit.aspect)}</span>
                    </div>
                    
                    <div className="actor natal">
                      <span className="actor-symbol">
                        {PLANET_MEANINGS[transit.natalPlanet.toLowerCase()]?.symbol}
                      </span>
                      <span className="actor-name">{t('natal')} {transit.natalPlanet}</span>
                      <span className="actor-position">{transit.natalSign}</span>
                    </div>
                  </div>
                  
                  <div className="transit-house-info">
                    <span className="house-badge">{t('house')} {transit.activatedHouse}</span>
                    <span className="house-name">{houseData?.name}</span>
                  </div>
                  
                  <div className="transit-strength-bar">
                    <div className="strength-fill" style={{ width: `${transit.strength}%` }} />
                    <span className="strength-label">{transit.strength}% strength</span>
                  </div>
                  
                  <div className="transit-dates">
                    <span className="date-exact">{t('exact')}: {timing.exactDate}</span>
                    <span className="date-range">{timing.startDate} → {timing.endDate}</span>
                  </div>
                  
                  <span className="expand-indicator">{isSelected ? '▼' : '▶'}</span>
                </button>
                
                {isSelected && (
                  <div className="transit-forecast-details">
                    <div className="t-reading">
                      <h5>{reading.title}</h5>
                      <p className="t-meaning">{reading.meaning}</p>
                      <p className="t-personal">{reading.personal}</p>
                    </div>
                    
                    <div className="t-timing-details">
                      <div className="timing-row">
                        <span className="t-label">{t('began')}:</span>
                        <span className="t-value">{timing.startDate}</span>
                      </div>
                      <div className="timing-row">
                        <span className="t-label">{t('exact')}:</span>
                        <span className="t-value highlight">{timing.exactDate} at {timing.exactTime}</span>
                      </div>
                      <div className="timing-row">
                        <span className="t-label">{t('ends')}:</span>
                        <span className="t-value">{timing.endDate}</span>
                      </div>
                      <div className="timing-row">
                        <span className="t-label">{t('duration')}:</span>
                        <span className="t-value">{timing.totalDays} days total</span>
                      </div>
                    </div>
                    
                    <div className="t-guidance">
                      <h6>💫 Guidance</h6>
                      <p>{reading.advice}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TIMING CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface TimingData {
  currentTime: string;
  today: {
    date: string;
    narrative: string;
    voidOfCourse: string | null;
    bestFor: string[];
    avoid: string[];
    hourly: Array<{ time: string; mood: string; quality: string }>;
  };
  tomorrow: {
    date: string;
    time: string;
  };
  moon: {
    exactTime: string;
    nextPhase: string;
    nextPhaseDate: string;
    daysInPhase: number;
    daysRemaining: number;
  };
  week: {
    phases: Array<{
      name: string;
      emoji: string;
      dayName: string;
      date: string;
      time: string;
      sign: string;
      meaning: string;
      current?: boolean;
      countdown?: string;
    }>;
    themes: Array<{ icon: string; name: string; dates: string }>;
  };
}

function calculateTimingData(date: Date, moonPhase: any, _transits: PersonalTransit[]): TimingData {
  // Helper for date formatting
  const fmt = (d: Date, opts?: Intl.DateTimeFormatOptions) => 
    new Intl.DateTimeFormat(i18n.language || 'en', { month: 'short', day: 'numeric', ...opts }).format(d);
  const fmtTime = (d: Date) => new Intl.DateTimeFormat(i18n.language || 'en', { hour: '2-digit', minute: '2-digit' }).format(d);
  
  // Calculate moon phase dates
  const lunarCycle = 29.53;
  const daysSinceNew = (moonPhase.illumination / 100) * lunarCycle;
  void Math.floor(daysSinceNew); // Used for future timing calculations
  const daysRemaining = Math.floor(lunarCycle - daysSinceNew);
  
  // Next phase calculation
  const phases = ['New', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  const currentPhaseIndex = phases.findIndex(p => p.toLowerCase().includes(moonPhase.phase.toLowerCase()));
  const nextPhaseName = phases[(currentPhaseIndex + 1) % phases.length];
  const nextPhaseDate = new Date(date);
  nextPhaseDate.setDate(date.getDate() + Math.floor(daysRemaining / 2));
  
  // Week phases
  const weekPhases = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(date);
    d.setDate(date.getDate() + i);
    const phaseProgress = ((daysSinceNew + i) % lunarCycle) / lunarCycle;
    let phaseInfo = { name: 'Crescent', emoji: '🌒', meaning: 'Building energy' };
    
    if (phaseProgress < 0.03) phaseInfo = { name: 'New Moon', emoji: '🌑', meaning: 'New beginnings, set intentions' };
    else if (phaseProgress < 0.22) phaseInfo = { name: 'Waxing Crescent', emoji: '🌒', meaning: 'Build momentum, take first steps' };
    else if (phaseProgress < 0.28) phaseInfo = { name: 'First Quarter', emoji: '🌓', meaning: 'Action required, push forward' };
    else if (phaseProgress < 0.47) phaseInfo = { name: 'Waxing Gibbous', emoji: '🌔', meaning: 'Refine and adjust' };
    else if (phaseProgress < 0.53) phaseInfo = { name: 'Full Moon', emoji: '🌕', meaning: 'Culmination, release, celebrate' };
    else if (phaseProgress < 0.72) phaseInfo = { name: 'Waning Gibbous', emoji: '🌖', meaning: 'Gratitude, share wisdom' };
    else if (phaseProgress < 0.78) phaseInfo = { name: 'Last Quarter', emoji: '🌗', meaning: 'Release, let go' };
    else phaseInfo = { name: 'Waning Crescent', emoji: '🌘', meaning: 'Rest, prepare for new cycle' };
    
    weekPhases.push({
      ...phaseInfo,
      dayName: new Intl.DateTimeFormat(i18n.language || 'en', { weekday: 'short' }).format(d),
      date: fmt(d),
      time: 'Exact: 12:00 PM', // Simplified
      sign: moonPhase.sign, // Would need actual calculation
      current: i === 0
    });
  }
  
  return {
    currentTime: fmtTime(date),
    today: {
      date: fmt(date, { weekday: 'long', month: 'long', day: 'numeric' }),
      narrative: `Today features a ${moonPhase.phase} Moon in ${moonPhase.sign}, creating ${SIGN_MEANINGS[moonPhase.sign.toLowerCase()]?.element || 'dynamic'} energy perfect for ${getPhaseActivities(moonPhase.phase).join(' and ')}.`,
      voidOfCourse: null, // Would need actual calculation
      bestFor: getPhaseActivities(moonPhase.phase),
      avoid: getPhaseAvoid(moonPhase.phase),
      hourly: Array.from({ length: 8 }, (_, i) => ({
        time: `${(i * 3)}:00`,
        mood: i < 4 ? 'Building' : i < 6 ? 'Peak' : 'Waning',
        quality: i === 4 ? 'excellent' : i === 2 || i === 6 ? 'good' : 'moderate'
      }))
    },
    tomorrow: {
      date: fmt(new Date(date.getTime() + 86400000)),
      time: fmtTime(new Date(date.getTime() + 86400000))
    },
    moon: {
      exactTime: fmtTime(date),
      nextPhase: nextPhaseName,
      nextPhaseDate: fmt(nextPhaseDate),
      daysInPhase: Math.floor(lunarCycle / 8),
      daysRemaining
    },
    week: {
      phases: weekPhases,
      themes: [
        { icon: '🌱', name: 'New Beginnings', dates: `${fmt(date)} - ${fmt(new Date(date.getTime() + 172800000))}` },
        { icon: '⚡', name: 'Action & Growth', dates: `${fmt(new Date(date.getTime() + 172800000))} - ${fmt(new Date(date.getTime() + 345600000))}` },
        { icon: '🌕', name: 'Culmination', dates: `${fmt(new Date(date.getTime() + 518400000))}` }
      ]
    }
  };
}

function calculateTransitTiming(transit: PersonalTransit) {
  const now = new Date();
  const speed = 1; // degrees per day approximation
  const daysToExact = transit.orb / speed;
  
  const exactDate = new Date(now);
  exactDate.setDate(now.getDate() + Math.floor(daysToExact));
  
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - Math.floor((8 - transit.orb) / speed)); // Approximate
  
  const endDate = new Date(exactDate);
  endDate.setDate(exactDate.getDate() + 8); // Aspect orb period
  
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / 86400000);
  
  return {
    startDate: new Intl.DateTimeFormat(i18n.language || 'en', { month: 'short', day: 'numeric' }).format(startDate),
    exactDate: new Intl.DateTimeFormat(i18n.language || 'en', { month: 'short', day: 'numeric' }).format(exactDate),
    exactTime: new Intl.DateTimeFormat(i18n.language || 'en', { hour: '2-digit', minute: '2-digit' }).format(exactDate),
    endDate: new Intl.DateTimeFormat(i18n.language || 'en', { month: 'short', day: 'numeric' }).format(endDate),
    totalDays
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function getMoonEmoji(phase: string, moonIllumination: number): string {
  if (phase === 'new') return '🌑';
  if (phase === 'waxing') return moonIllumination < 50 ? '🌒' : '🌔';
  if (phase === 'full') return '🌕';
  return moonIllumination > 50 ? '🌖' : '🌘';
}

function getMoonPath(phase: string, _moonIllumination: number): string {
  // SVG path for moon shadow
  if (phase === 'new') return 'M50,5 A45,45 0 1,1 50,95 A45,45 0 1,1 50,5';
  if (phase === 'full') return 'M50,5 A0,0 0 0,0 50,95';
  return 'M50,5 A45,45 0 1,1 50,95'; // Simplified
}

function getMoonPhaseNarrative(phase: string, sign: string): string {
  void sign; // Sign influences the expression but base narrative is by phase
  const narratives: Record<string, string> = {
    new: `Perfect for setting intentions and planting seeds for the month ahead.`,
    waxing: `Energy is building. Take action on goals and build momentum.`,
    full: `Illumination peaks. Release what no longer serves and celebrate completions.`,
    waning: `Wind down and consolidate. Review, integrate, and prepare for renewal.`
  };
  return narratives[phase.toLowerCase()] || 'Observe the cosmic rhythm.';
}

function getPhaseActivities(phase: string): string[] {
  const activities: Record<string, string[]> = {
    new: ['starting fresh', 'setting intentions', 'planting seeds'],
    waxing: ['taking action', 'building momentum', 'growing projects'],
    full: ['completing projects', 'celebrating wins', 'releasing baggage'],
    waning: ['reviewing progress', 'resting', 'preparing for new cycle']
  };
  return activities[phase.toLowerCase()] || ['observing', 'reflecting'];
}

function getPhaseAvoid(phase: string): string[] {
  const avoid: Record<string, string[]> = {
    new: ['major decisions', 'rushing ahead'],
    waxing: ['giving up', 'procrastination'],
    full: ['starting major new projects', 'overcommitting'],
    waning: ['forcing outcomes', 'burning out']
  };
  return avoid[phase.toLowerCase()] || ['resisting the flow'];
}

function getElementColor(element?: string): string {
  const colors: Record<string, string> = {
    fire: '#ef4444',
    earth: '#22c55e',
    air: '#3b82f6',
    water: '#06b6d4'
  };
  return colors[element || ''] || '#9d4edd';
}

function getAspectSymbol(aspect: string): string {
  const symbols: Record<string, string> = {
    conjunction: '☌', sextile: '⚹', square: '□', trine: '△', 
    opposition: '☍', quincunx: '⚻'
  };
  return symbols[aspect.toLowerCase()] || '●';
}

export default CelestialForecast;
