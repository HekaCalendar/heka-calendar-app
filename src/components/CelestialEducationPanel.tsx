/**
 * Celestial Education Panel
 * 
 * Educational component that explains what planetary positions and transits mean.
 * Transforms data into wisdom.
 */

import React, { useState } from 'react';
import { 
  generatePlanetInSignReading,
  generateTransitReading,
  generateCelestialWeatherReading,
  PLANET_MEANINGS,
  SIGN_MEANINGS,
  ASPECT_MEANINGS,
  HOUSE_MEANINGS
} from '../oracle/celestialEducation';
import type { PersonalTransit, PlanetPosition } from '../oracle/birthChartIntegration';
import './CelestialEducationPanel.css';

interface CelestialEducationPanelProps {
  positions: Record<string, PlanetPosition>;
  transits?: PersonalTransit[];
  moonPhase?: {
    phase: string;
    sign: string;
  };
}

type TabType = 'planets' | 'transits' | 'houses' | 'aspects' | 'weather';

export const CelestialEducationPanel: React.FC<CelestialEducationPanelProps> = ({
  positions,
  transits = [],
  moonPhase
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('weather');
  const [expandedPlanet, setExpandedPlanet] = useState<string | null>(null);
  const [expandedTransit, setExpandedTransit] = useState<string | null>(null);
  const [expandedAspect, setExpandedAspect] = useState<string | null>(null);
  
  // Filter to classical planets for main display
  const classicalPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
  const planetEntries = Object.entries(positions).filter(([name]) => 
    classicalPlanets.includes(name.toLowerCase())
  );
  
  return (
    <div className="celestial-education-panel">
      {/* Tab Navigation */}
      <nav className="edu-tabs">
        {[
          { id: 'weather', label: '☁️ Weather', icon: '☁️' },
          { id: 'planets', label: '🪐 Planets', icon: '🪐' },
          { id: 'transits', label: '✦ Transits', icon: '✦', count: transits.length },
          { id: 'houses', label: '🏠 Houses', icon: '🏠' },
          { id: 'aspects', label: '⚹ Aspects', icon: '⚹' }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`edu-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as TabType)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {'count' in tab && tab.count && tab.count > 0 && (
              <span className="tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </nav>
      
      {/* Tab Content */}
      <div className="edu-content">
        
        {/* WEATHER TAB */}
        {activeTab === 'weather' && moonPhase && (
          <WeatherView 
            moonPhase={moonPhase} 
            positions={positions}
          />
        )}
        
        {/* PLANETS TAB */}
        {activeTab === 'planets' && (
          <PlanetsView 
            planets={planetEntries}
            expandedPlanet={expandedPlanet}
            onToggle={(name) => setExpandedPlanet(expandedPlanet === name ? null : name)}
          />
        )}
        
        {/* TRANSITS TAB */}
        {activeTab === 'transits' && (
          <TransitsView 
            transits={transits}
            expandedTransit={expandedTransit}
            onToggle={(id) => setExpandedTransit(expandedTransit === id ? null : id)}
          />
        )}
        
        {/* HOUSES TAB */}
        {activeTab === 'houses' && (
          <HousesView />
        )}
        
        {/* ASPECTS TAB */}
        {activeTab === 'aspects' && (
          <AspectsView 
            expandedAspect={expandedAspect}
            onToggle={(name) => setExpandedAspect(expandedAspect === name ? null : name)}
          />
        )}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// WEATHER VIEW
// ═════════════════════════════════════════════════════════════════════════════

const WeatherView: React.FC<{
  moonPhase: { phase: string; sign: string };
  positions: Record<string, PlanetPosition>;
}> = ({ moonPhase, positions }) => {
  const reading = generateCelestialWeatherReading(
    moonPhase.phase,
    moonPhase.sign,
    Object.entries(positions).map(([p, pos]) => ({ planet: p, sign: pos.sign }))
  );
  
  const moonSignData = SIGN_MEANINGS[moonPhase.sign.toLowerCase()];
  
  return (
    <div className="weather-view">
      <div className="weather-header">
        <div className="moon-display">
          <span className="moon-icon">
            {moonPhase.phase === 'new' && '🌑'}
            {moonPhase.phase === 'waxing' && '🌓'}
            {moonPhase.phase === 'full' && '🌕'}
            {moonPhase.phase === 'waning' && '🌗'}
          </span>
          <div className="moon-info">
            <h3>{moonPhase.phase.charAt(0).toUpperCase() + moonPhase.phase.slice(1)} Moon</h3>
            <span className="moon-sign">in {moonPhase.sign}</span>
          </div>
        </div>
      </div>
      
      <div className="weather-summary">
        <h4>Current Celestial Weather</h4>
        <p>{reading.summary}</p>
      </div>
      
      <div className="weather-themes">
        <h5>Key Themes</h5>
        <div className="theme-tags">
          {reading.themes.map((theme, i) => (
            <span key={i} className="theme-tag">{theme}</span>
          ))}
        </div>
      </div>
      
      <div className="weather-guidance">
        <h5>Cosmic Guidance</h5>
        <p>{reading.guidance}</p>
      </div>
      
      {moonSignData && (
        <div className="moon-sign-deep-dive">
          <h5>About {moonSignData.name} Moon</h5>
          <p><strong>Element:</strong> {moonSignData.element}</p>
          <p><strong>Expression:</strong> Emotional energy flows {moonSignData.expression}</p>
          <p><strong>Psychological:</strong> {moonSignData.psychological}</p>
          <div className="keywords">
            {moonSignData.keywords.map((k, i) => (
              <span key={i} className="keyword">{k}</span>
            ))}
          </div>
        </div>
      )}
      
      <div className="weather-opportunities">
        <h5>✨ Opportunities</h5>
        <ul>
          {reading.opportunities.map((opp, i) => (
            <li key={i}>{opp}</li>
          ))}
        </ul>
      </div>
      
      <div className="weather-challenges">
        <h5>⚠️ Watch Out For</h5>
        <ul>
          {reading.challenges.map((ch, i) => (
            <li key={i}>{ch}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// PLANETS VIEW
// ═════════════════════════════════════════════════════════════════════════════

const PlanetsView: React.FC<{
  planets: Array<[string, PlanetPosition]>;
  expandedPlanet: string | null;
  onToggle: (name: string) => void;
}> = ({ planets, expandedPlanet, onToggle }) => {
  return (
    <div className="planets-view">
      <div className="view-intro">
        <h4>The Planets: Cosmic Actors</h4>
        <p>Each planet represents a different facet of human experience. Learn what they symbolize and how they express through the zodiac signs.</p>
      </div>
      
      <div className="planets-list">
        {planets.map(([name, position]) => {
          const planetData = PLANET_MEANINGS[name.toLowerCase()];
          const signData = SIGN_MEANINGS[position.sign.toLowerCase()];
          const isExpanded = expandedPlanet === name;
          const reading = generatePlanetInSignReading(name, position.sign);
          
          return (
            <div 
              key={name} 
              className={`planet-card ${isExpanded ? 'expanded' : ''}`}
              style={{
                '--planet-color': getElementColor(signData?.element)
              } as React.CSSProperties}
            >
              <button 
                className="planet-header"
                onClick={() => onToggle(name)}
              >
                <div className="planet-identity">
                  <span className="planet-symbol">{planetData?.symbol || '●'}</span>
                  <div className="planet-names">
                    <span className="planet-name">{planetData?.name || name}</span>
                    <span className="planet-position">
                      {position.sign} {position.degree}°
                    </span>
                  </div>
                </div>
                <div className="planet-badges">
                  {signData && (
                    <span className={`element-badge ${signData.element}`}>
                      {signData.element}
                    </span>
                  )}
                  {position.retrograde && (
                    <span className="retrograde-badge">℞ Retrograde</span>
                  )}
                  <span className="expand-arrow">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </button>
              
              {isExpanded && planetData && signData && (
                <div className="planet-education">
                  <div className="edu-section">
                    <h6>What {planetData.name} Represents</h6>
                    <p>{planetData.inOneSentence}</p>
                    <div className="governs-list">
                      <span>Governs:</span>
                      {planetData.governs.map((g, i) => (
                        <span key={i} className="govern-item">{g}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="edu-section">
                    <h6>In {signData.name} - {signData.expression}</h6>
                    <p>{reading.meaning}</p>
                  </div>
                  
                  <div className="edu-section">
                    <h6>Psychological Meaning</h6>
                    <p>{reading.psychological}</p>
                  </div>
                  
                  <div className="edu-section">
                    <h6>Practical Expression</h6>
                    <p>{reading.practical}</p>
                  </div>
                  
                  <div className="edu-section shadow">
                    <h6>⚠️ Shadow Expression</h6>
                    <p>{reading.shadow}</p>
                  </div>
                  
                  <div className="edu-section advice">
                    <h6>💫 Working With This Energy</h6>
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

// ═════════════════════════════════════════════════════════════════════════════
// TRANSITS VIEW
// ═════════════════════════════════════════════════════════════════════════════

const TransitsView: React.FC<{
  transits: PersonalTransit[];
  expandedTransit: string | null;
  onToggle: (id: string) => void;
}> = ({ transits, expandedTransit, onToggle }) => {
  if (transits.length === 0) {
    return (
      <div className="transits-view empty">
        <div className="empty-state">
          <span className="empty-icon">✦</span>
          <h4>No Major Personal Transits</h4>
          <p>Current planetary movements aren't forming strong aspects to your birth chart. Check back in a few days as the celestial weather changes constantly.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="transits-view">
      <div className="view-intro">
        <h4>Personal Transits: Cosmic Conversations</h4>
        <p>Transits show how current planetary positions interact with your birth chart. Each represents an opportunity for growth and self-awareness.</p>
      </div>
      
      <div className="transits-list">
        {transits
          .sort((a, b) => b.strength - a.strength)
          .slice(0, 8)
          .map((transit) => {
            const isExpanded = expandedTransit === transit.id;
            const reading = generateTransitReading(transit);
            const aspectData = ASPECT_MEANINGS[transit.aspect.toLowerCase()];
            const houseData = HOUSE_MEANINGS[transit.activatedHouse];
            
            return (
              <div 
                key={transit.id}
                className={`transit-edu-card ${aspectData?.nature || 'neutral'} ${isExpanded ? 'expanded' : ''}`}
              >
                <button 
                  className="transit-header"
                  onClick={() => onToggle(transit.id)}
                >
                  <div className="transit-symbols">
                    <span>{PLANET_MEANINGS[transit.transitingPlanet.toLowerCase()]?.symbol || '●'}</span>
                    <span className="aspect-symbol">{getAspectSymbol(transit.aspect)}</span>
                    <span>{PLANET_MEANINGS[transit.natalPlanet.toLowerCase()]?.symbol || '●'}</span>
                  </div>
                  <div className="transit-title">
                    <span className="transit-name">
                      {transit.transitingPlanet} {transit.aspect} Natal {transit.natalPlanet}
                    </span>
                    <span className="transit-house-ref">
                      House {transit.activatedHouse} • {houseData?.name}
                    </span>
                  </div>
                  <div className="transit-meta">
                    <span className={`nature-badge ${aspectData?.nature || 'neutral'}`}>
                      {aspectData?.nature || 'neutral'}
                    </span>
                    <span className="strength-badge">
                      {transit.strength}%
                    </span>
                    <span className="expand-arrow">{isExpanded ? '▼' : '▶'}</span>
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="transit-education">
                    <div className="transit-reading">
                      <h5>{reading.title}</h5>
                      <p className="reading-meaning">{reading.meaning}</p>
                    </div>
                    
                    <div className="transit-personal">
                      <h6>📍 How This Affects You</h6>
                      <p>{reading.personal}</p>
                    </div>
                    
                    {aspectData && (
                      <div className="aspect-deep-dive">
                        <h6>⚹ About the {aspectData.name} Aspect</h6>
                        <p><strong>Nature:</strong> {aspectData.nature}</p>
                        <p><strong>Psychological:</strong> {aspectData.psychological}</p>
                        <p><strong>Opportunity:</strong> {aspectData.opportunity}</p>
                        <p><strong>Challenge:</strong> {aspectData.challenge}</p>
                      </div>
                    )}
                    
                    {houseData && (
                      <div className="house-deep-dive">
                        <h6>🏠 House {houseData.number}: {houseData.name}</h6>
                        <p><strong>Question:</strong> {houseData.question}</p>
                        <p>{houseData.psychological}</p>
                        <div className="life-areas">
                          <span>Life Areas:</span>
                          {houseData.lifeAreas.map((area, i) => (
                            <span key={i} className="area-tag">{area}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="transit-timing">
                      <h6>⏰ Timing</h6>
                      <p>{reading.timing}</p>
                    </div>
                    
                    <div className="transit-advice">
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

// ═════════════════════════════════════════════════════════════════════════════
// HOUSES VIEW
// ═════════════════════════════════════════════════════════════════════════════

const HousesView: React.FC = () => {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  
  return (
    <div className="houses-view">
      <div className="view-intro">
        <h4>The Houses: Life's Stage</h4>
        <p>The 12 houses represent different areas of life experience. Click any house to learn what it governs and what questions it answers.</p>
      </div>
      
      <div className="houses-grid">
        {Object.values(HOUSE_MEANINGS).map((house) => (
          <button
            key={house.number}
            className={`house-card ${selectedHouse === house.number ? 'selected' : ''}`}
            onClick={() => setSelectedHouse(selectedHouse === house.number ? null : house.number)}
          >
            <span className="house-number">{house.number}</span>
            <span className="house-name">{house.name}</span>
            <span className="house-question">{house.question}</span>
          </button>
        ))}
      </div>
      
      {selectedHouse && (
        <div className="house-detail">
          {(() => {
            const house = HOUSE_MEANINGS[selectedHouse];
            return (
              <>
                <h4>House {house.number}: {house.name}</h4>
                <p className="house-psychological">{house.psychological}</p>
                <div className="house-keywords">
                  {house.keywords.map((k, i) => (
                    <span key={i} className="keyword">{k}</span>
                  ))}
                </div>
                <div className="house-life-areas">
                  <h5>Life Areas Governed</h5>
                  <ul>
                    {house.lifeAreas.map((area, i) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// ASPECTS VIEW
// ═════════════════════════════════════════════════════════════════════════════

const AspectsView: React.FC<{
  expandedAspect: string | null;
  onToggle: (name: string) => void;
}> = ({ expandedAspect, onToggle }) => {
  return (
    <div className="aspects-view">
      <div className="view-intro">
        <h4>The Aspects: Cosmic Relationships</h4>
        <p>Aspects describe how planets interact. They reveal the internal dynamics of your psyche and external circumstances.</p>
      </div>
      
      <div className="aspects-list">
        {Object.values(ASPECT_MEANINGS).map((aspect) => {
          const isExpanded = expandedAspect === aspect.name;
          
          return (
            <div 
              key={aspect.name}
              className={`aspect-edu-card ${aspect.nature} ${isExpanded ? 'expanded' : ''}`}
            >
              <button 
                className="aspect-header"
                onClick={() => onToggle(aspect.name)}
              >
                <div className="aspect-identity">
                  <span className="aspect-angle">{aspect.angle}°</span>
                  <span className="aspect-name">{aspect.name}</span>
                </div>
                <div className="aspect-badges">
                  <span className={`nature-badge ${aspect.nature}`}>
                    {aspect.nature}
                  </span>
                  <span className="expand-arrow">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </button>
              
              {isExpanded && (
                <div className="aspect-education">
                  <div className="aspect-keywords">
                    {aspect.keywords.map((k, i) => (
                      <span key={i} className="keyword">{k}</span>
                    ))}
                  </div>
                  
                  <div className="aspect-section">
                    <h6>Psychological Meaning</h6>
                    <p>{aspect.psychological}</p>
                  </div>
                  
                  <div className="aspect-section opportunity">
                    <h6>✨ Opportunity</h6>
                    <p>{aspect.opportunity}</p>
                  </div>
                  
                  <div className="aspect-section challenge">
                    <h6>⚠️ Challenge</h6>
                    <p>{aspect.challenge}</p>
                  </div>
                  
                  <div className="aspect-energy">
                    <h6>Energy Quality</h6>
                    <p>{aspect.energy}</p>
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

// ═════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════════════════════════

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
    conjunction: '☌',
    sextile: '⚹',
    square: '□',
    trine: '△',
    opposition: '☍',
    quincunx: '⚻'
  };
  return symbols[aspect.toLowerCase()] || '●';
}

export default CelestialEducationPanel;
