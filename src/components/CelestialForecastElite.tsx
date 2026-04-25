/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL FORECAST ELITE 🌟
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * REAL celestial weather:
 * - What's happening in the sky (planet aspects)
 * - Your personal transit timeline (past/current/future)
 * - Energy forecast based on actual transits
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useMemo } from 'react';
import { 
  CelestialWeatherEngine,
  type SkyAspect,
  type TransitEvent
} from '../oracle/celestialWeatherEngine';
import { 
  PLANET_MEANINGS,
  ASPECT_MEANINGS,
  HOUSE_MEANINGS
} from '../oracle/celestialEducation';
import type { PersonalTransit, PlanetPosition } from '../oracle/birthChartIntegration';
import './CelestialForecastElite.css';

interface Props {
  positions: Record<string, PlanetPosition>;
  transits: PersonalTransit[];
  hasBirthChart: boolean;
  currentDate?: Date;
}

type ViewType = 'sky' | 'personal';

export const CelestialForecastElite: React.FC<Props> = ({
  positions,
  transits,
  hasBirthChart,
  currentDate = new Date()
}) => {
  const [view, setView] = useState<ViewType>(hasBirthChart ? 'personal' : 'sky');
  const [selectedTransit, setSelectedTransit] = useState<string | null>(null);
  
  // Calculate real celestial weather
  const skyWeather = useMemo(() => 
    CelestialWeatherEngine.generateDailyWeather(positions, currentDate),
    [positions, currentDate]
  );
  
  const transitTimeline = useMemo(() => 
    CelestialWeatherEngine.buildTransitTimeline(transits, currentDate),
    [transits, currentDate]
  );
  
  const personalForecast = useMemo(() => 
    CelestialWeatherEngine.generatePersonalForecast(transitTimeline),
    [transitTimeline]
  );
  
  return (
    <div className="celestial-elite">
      {/* Header */}
      <header className="elite-header">
        <div className="brand">
          <span className="logo">✦</span>
          <div>
            <h1>Celestial Weather</h1>
            <time className="exact-time">
              {currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', month: 'long', day: 'numeric'
              })}
            </time>
          </div>
        </div>
        
        <nav className="view-tabs">
          <button
            className={`view-tab ${view === 'sky' ? 'active' : ''}`}
            onClick={() => setView('sky')}
          >
            <span>🌌</span>
            <span>SKY NOW</span>
          </button>
          {hasBirthChart && (
            <button
              className={`view-tab ${view === 'personal' ? 'active' : ''}`}
              onClick={() => setView('personal')}
            >
              <span>👤</span>
              <span>YOUR TRANSITS ({transits.length})</span>
            </button>
          )}
        </nav>
      </header>
      
      {/* Content */}
      <main className="elite-content">
        {view === 'sky' && (
          <SkyWeatherView 
            weather={skyWeather}
            positions={positions}
          />
        )}
        
        {view === 'personal' && hasBirthChart && (
          <PersonalTransitsView 
            timeline={transitTimeline}
            forecast={personalForecast}
            selectedTransit={selectedTransit}
            onSelectTransit={setSelectedTransit}
          />
        )}
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SKY WEATHER VIEW - What's happening in the heavens
// ═══════════════════════════════════════════════════════════════════════════════

const SkyWeatherView: React.FC<{
  weather: ReturnType<typeof CelestialWeatherEngine.generateDailyWeather>;
  positions: Record<string, PlanetPosition>;
}> = ({ weather, positions }) => {
  return (
    <div className="view-sky">
      {/* Weather Summary */}
      <section className="weather-summary">
        <div className="moon-status-compact">
          <span className="moon-emoji">{weather.moonPhase.emoji}</span>
          <div>
            <span className="phase-name">{weather.moonPhase.name}</span>
            <span className="illumination">{weather.moonPhase.illumination}% illuminated</span>
          </div>
        </div>
        
        <div className="energy-reading">
          <h3>{weather.dominantEnergy}</h3>
          <p>{weather.advice}</p>
          <div className="theme-chips">
            {weather.themes.map((theme, i) => (
              <span key={i} className="theme-chip">{theme}</span>
            ))}
          </div>
        </div>
      </section>
      
      {/* Sky Aspects */}
      <section className="sky-aspects">
        <h3 className="section-title">
          <span>☿</span>
          <span>Planetary Conversations Today</span>
        </h3>
        
        {weather.skyAspects.length === 0 ? (
          <div className="quiet-sky">
            <span className="big">🌙</span>
            <p>The sky is quiet today.</p>
            <p className="sub">A restful day with no major planetary aspects.</p>
          </div>
        ) : (
          <div className="aspects-list">
            {weather.skyAspects.map(aspect => (
              <SkyAspectCard key={aspect.id} aspect={aspect} positions={positions} />
            ))}
          </div>
        )}
      </section>
      
      {/* Planet Positions */}
      <section className="planet-positions">
        <h3 className="section-title">
          <span>🪐</span>
          <span>Current Positions</span>
        </h3>
        <div className="positions-grid">
          {['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'].map(p => {
            const pos = positions[p] || positions[p.toLowerCase()];
            if (!pos) return null;
            
            const planet = PLANET_MEANINGS[p.toLowerCase()];
            
            return (
              <div key={p} className="position-pill">
                <span className="p-sym">{planet?.symbol || '●'}</span>
                <span className="p-name">{p}</span>
                <span className="p-loc">
                  {pos.sign} {pos.degree}°
                  {pos.retrograde && <span className="rx-badge">R</span>}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const SkyAspectCard: React.FC<{
  aspect: SkyAspect;
  positions: Record<string, PlanetPosition>;
}> = ({ aspect, positions }) => {
  const p1 = PLANET_MEANINGS[aspect.planet1.toLowerCase()];
  const p2 = PLANET_MEANINGS[aspect.planet2.toLowerCase()];
  const pos1 = positions[aspect.planet1] || positions[aspect.planet1.toLowerCase()];
  const pos2 = positions[aspect.planet2] || positions[aspect.planet2.toLowerCase()];
  
  return (
    <div className={`sky-aspect-card ${aspect.nature}`}>
      <div className="aspect-header">
        <div className="aspect-actors">
          <div className="actor">
            <span className="sym">{p1?.symbol || '●'}</span>
            <span className="name">{aspect.planet1}</span>
            <span className="deg">{pos1?.sign} {pos1?.degree}°</span>
          </div>
          
          <div className="aspect-center">
            <span className="aspect-name">{aspect.aspect}</span>
            <span className="angle">{aspect.angle}°</span>
            <span className="orb">±{aspect.orb.toFixed(1)}°</span>
            {aspect.isApplying && <span className="applying">applying</span>}
          </div>
          
          <div className="actor">
            <span className="sym">{p2?.symbol || '●'}</span>
            <span className="name">{aspect.planet2}</span>
            <span className="deg">{pos2?.sign} {pos2?.degree}°</span>
          </div>
        </div>
        
        <div className="aspect-strength">
          <div className="strength-bar">
            <div className="fill" style={{ width: `${aspect.strength}%` }} />
          </div>
          <span className="strength-val">{aspect.strength}%</span>
        </div>
      </div>
      
      <p className="aspect-meaning">{aspect.interpretation}</p>
      
      <div className="aspect-timing">
        <span>Exact: {aspect.exactDate.toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        })}</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONAL TRANSITS VIEW - Your cosmic journey
// ═══════════════════════════════════════════════════════════════════════════════

const PersonalTransitsView: React.FC<{
  timeline: ReturnType<typeof CelestialWeatherEngine.buildTransitTimeline>;
  forecast: ReturnType<typeof CelestialWeatherEngine.generatePersonalForecast>;
  selectedTransit: string | null;
  onSelectTransit: (id: string | null) => void;
}> = ({ timeline, forecast, selectedTransit, onSelectTransit }) => {
  const { current, recent, upcoming } = timeline;
  
  if (current.length === 0 && upcoming.length === 0) {
    return (
      <div className="view-personal">
        <div className="no-transits">
          <span className="big">✧</span>
          <h3>No Major Transits Active</h3>
          <p>Your chart is experiencing a quiet period.</p>
          <p className="sub">This is time for rest and integration.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="view-personal">
      {/* Forecast Header */}
      <section className="forecast-header">
        <h2 className="dominant-theme">{forecast.theme}</h2>
        <p className="guidance">{forecast.guidance}</p>
        <div className="action-list">
          {forecast.actions.map((action, i) => (
            <div key={i} className="action-item">
              <span>→</span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* Transit Timeline */}
      <div className="transit-timeline">
        {/* Recent (Just Ended) */}
        {recent.length > 0 && (
          <section className="timeline-section past">
            <h3 className="section-header">
              <span>←</span>
              <span>Recently Ended ({recent.length})</span>
            </h3>
            <div className="transit-cards">
              {recent.map(event => (
                <TransitEventCard 
                  key={event.transit.id}
                  event={event}
                  isOpen={selectedTransit === event.transit.id}
                  onToggle={() => onSelectTransit(
                    selectedTransit === event.transit.id ? null : event.transit.id
                  )}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Current (Active Now) */}
        {current.length > 0 && (
          <section className="timeline-section current">
            <h3 className="section-header highlight">
              <span>⚡</span>
              <span>Active Now ({current.length})</span>
            </h3>
            <div className="transit-cards">
              {current.map(event => (
                <TransitEventCard 
                  key={event.transit.id}
                  event={event}
                  isOpen={selectedTransit === event.transit.id}
                  onToggle={() => onSelectTransit(
                    selectedTransit === event.transit.id ? null : event.transit.id
                  )}
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="timeline-section future">
            <h3 className="section-header">
              <span>→</span>
              <span>Coming Soon ({upcoming.length})</span>
            </h3>
            <div className="transit-cards">
              {upcoming.map(event => (
                <TransitEventCard 
                  key={event.transit.id}
                  event={event}
                  isOpen={selectedTransit === event.transit.id}
                  onToggle={() => onSelectTransit(
                    selectedTransit === event.transit.id ? null : event.transit.id
                  )}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const TransitEventCard: React.FC<{
  event: TransitEvent;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ event, isOpen, onToggle }) => {
  const { transit, timing, period, energyImpact, daysToExact, daysSinceExact } = event;
  
  const transiting = PLANET_MEANINGS[transit.transitingPlanet.toLowerCase()];
  const natal = PLANET_MEANINGS[transit.natalPlanet.toLowerCase()];
  const aspect = ASPECT_MEANINGS[transit.aspect.toLowerCase()];
  const house = HOUSE_MEANINGS[transit.activatedHouse];
  
  // Safe fallbacks
  const tName = transiting?.name || transit.transitingPlanet;
  const nName = natal?.name || transit.natalPlanet;
  const aName = aspect?.name || transit.aspect;
  const nature = aspect?.nature || 'neutral';
  const hName = house?.name || `House ${transit.activatedHouse}`;
  
  // Status text
  let statusText: string;
  if (period === 'past') {
    statusText = `Ended ${Math.abs(daysSinceExact)} days ago`;
  } else if (period === 'future') {
    statusText = `Begins in ${daysToExact} days`;
  } else {
    if (daysToExact <= 1 && daysToExact >= -1) {
      statusText = '⚡ EXACT NOW';
    } else if (daysToExact > 0) {
      statusText = `Exact in ${daysToExact} days`;
    } else {
      statusText = `Fading (${Math.abs(daysToExact)} days past exact)`;
    }
  }
  
  return (
    <div className={`transit-event-card ${nature} ${period} ${isOpen ? 'open' : ''}`}>
      <button className="transit-header" onClick={onToggle}>
        <div className="transit-main">
          <div className="transit-actors">
            <span className="sym">{transiting?.symbol || '●'}</span>
            <span className="t-name">{tName}</span>
            <span className="aspect">{aName}</span>
            <span className="n-label">natal</span>
            <span className="n-name">{nName}</span>
          </div>
          
          <div className="transit-meta">
            <span className="house">{hName}</span>
            <span className={`status ${period}`}>{statusText}</span>
          </div>
        </div>
        
        <div className="transit-indicators">
          <div className={`energy-dot ${energyImpact}`} />
          <span className="orb">{transit.orb.toFixed(1)}°</span>
          <span className="chev">{isOpen ? '▼' : '▶'}</span>
        </div>
      </button>
      
      {isOpen && (
        <div className="transit-details">
          <div className="reading">
            <h4>{tName} {aName} your Natal {nName}</h4>
            <p className="meaning">
              Transiting {tName} activates your natal {nName} through a {nature} {aName.toLowerCase()}. 
              This brings {aspect?.energy.toLowerCase() || 'significant'} energy to your {hName.toLowerCase()}.
            </p>
            <p className="personal">
              <strong>Your experience:</strong> This affects {house?.lifeAreas[0] || 'key life areas'} 
              and {house?.lifeAreas[1] || 'personal growth'}. {house?.question}
            </p>
          </div>
          
          <div className="timing-details">
            <div className="time-row">
              <span>Started:</span>
              <span>{timing.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="time-row highlight">
              <span>Exact:</span>
              <span>{timing.exact.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="time-row">
              <span>Ends:</span>
              <span>{timing.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
          
          {period === 'current' && (
            <div className={`guidance ${nature}`}>
              <h5>💫 Working with this energy</h5>
              <p>
                {nature === 'harmonious' 
                  ? `Take action on ${house?.lifeAreas[0] || 'your goals'}. The universe supports you.`
                  : nature === 'challenging'
                  ? `Growth opportunity through ${house?.lifeAreas[0] || 'facing challenges'}. Stay conscious.`
                  : `A significant time for ${house?.lifeAreas[0] || 'transformation'}. Pay attention.`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CelestialForecastElite;
