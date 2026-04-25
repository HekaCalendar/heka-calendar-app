import React from 'react';
import { eventBus } from '../../../services/eventBus';
import type { PersonalTransit } from '../../../oracle/birthChartIntegration';
import type { BirthChartData, CelestialState } from '../types';
import {
  getMoonEmoji,
  getMoonPhaseName,
  getZodiacSymbol,
  getSignElementColor,
  getPlanetSymbol,
  getAspectSymbol,
  generateCosmicPrompt,
  ZODIAC_ORDER,
} from '../utils';

interface OracleModeCelestialProps {
  celestial: CelestialState;
  personalTransits: PersonalTransit[];
  hasBirthChart: boolean;
  birthChartData: BirthChartData | null;
  onTransitClick: (transit: PersonalTransit) => void;
  onJournalTransit: (transit: PersonalTransit) => void;
  onTrackEnergy: () => void;
}

export const OracleModeCelestial: React.FC<OracleModeCelestialProps> = ({
  celestial,
  personalTransits,
  hasBirthChart,
  birthChartData,
  onTransitClick,
  onJournalTransit,
  onTrackEnergy,
}) => {
  if (celestial.loading) {
    return (
      <div className="oracle-mode-celestial">
        <div className="celestial-loading">
          <div className="loading-orb">
            <div className="orb-ring" />
            <div className="orb-core">✨</div>
          </div>
          <p>Consulting the Swiss Ephemeris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="oracle-mode-celestial">
      <div className="celestial-dashboard">
        {/* HERO: Moon Phase */}
        <div className="celestial-hero">
          <div className="moon-glow">
            <span className="moon-emoji">{getMoonEmoji(celestial.moonPhase.phase)}</span>
            <div className="moon-ring" />
          </div>
          <div className="hero-text">
            <h2 className="hero-phase">{getMoonPhaseName(celestial.moonPhase.phase)} Moon</h2>
            <p className="hero-meta">
              in <span className="sign-badge">{getZodiacSymbol(celestial.moonPhase.sign)} {celestial.moonPhase.sign}</span>
              <span className="illumination-dot" />
              {Math.round(celestial.moonPhase.illumination)}% illuminated
            </p>
          </div>
          <div className="celestial-microstats">
            <div className="microstat">
              <span className="microstat-value">{personalTransits.filter(t => t.strength >= 30).length}</span>
              <span className="microstat-label">Active Transits</span>
            </div>
            <div className="microstat">
              <span className="microstat-value">{celestial.retrogrades.length}</span>
              <span className="microstat-label">Retrograde</span>
            </div>
            <div className="microstat">
              <span className="microstat-value">{Object.keys(celestial.positions).length}</span>
              <span className="microstat-label">Planets</span>
            </div>
          </div>
        </div>

        {/* RETROGRADE BANNER */}
        {celestial.retrogrades.length > 0 && (
          <div className="retro-banner">
            <span className="retro-banner-icon">℞</span>
            <span className="retro-banner-text">
              {celestial.retrogrades.map(p => `${getPlanetSymbol(p)} ${p}`).join(', ')}
              {' '}currently retrograde — a time for review and inward reflection.
            </span>
          </div>
        )}

        {/* COSMIC PROMPT */}
        <div className="cosmic-prompt-panel">
          <div className="prompt-icon">✦</div>
          <div className="prompt-content">
            <h4>Today's Cosmic Prompt</h4>
            <p>{generateCosmicPrompt(personalTransits, celestial.moonPhase)}</p>
          </div>
          <button className="prompt-cta" onClick={() => {
            const prompt = generateCosmicPrompt(personalTransits, celestial.moonPhase);
            // Parent will handle setting scribe content and mode
            // We use a custom event for decoupling
            eventBus.emit('heka-journal-prompt', { prompt });
          }}>
            Write Reflection
          </button>
        </div>

        {/* SKY MAP */}
        <div className="celestial-section sky-map-section">
          <h3 className="section-title"><span>🌌</span> The Living Sky</h3>
          <div className="zodiac-sky-map">
            {ZODIAC_ORDER.map(sign => {
              const planetsHere = Object.entries(celestial.positions).filter(([_, pos]) =>
                String(pos.sign).toLowerCase() === sign
              );
              return (
                <div key={sign} className="zodiac-segment" style={{ ['--sign-color' as any]: getSignElementColor(sign) }}>
                  <div className="zodiac-segment-header">
                    <span className="zodiac-segment-symbol">{getZodiacSymbol(sign)}</span>
                    <span className="zodiac-segment-name">{sign}</span>
                  </div>
                  <div className="zodiac-segment-planets">
                    {planetsHere.length === 0 ? (
                      <span className="zodiac-empty">—</span>
                    ) : (
                      planetsHere.map(([planet, pos]) => (
                        <div key={planet} className={`zodiac-planet-chip ${pos.retrograde ? 'retro' : ''}`}>
                          <span className="chip-symbol">{getPlanetSymbol(planet)}</span>
                          <span className="chip-degree">{pos.degree}°</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BIRTH CHART TRINITY */}
        {hasBirthChart && birthChartData && (
          <div className="celestial-section trinity-section">
            <h3 className="section-title"><span>✦</span> Your Celestial Trinity</h3>
            <div className="trinity-cards">
              {(['sun', 'moon'] as const).map(key => {
                const planet = birthChartData.planets?.[key];
                if (!planet) return null;
                return (
                  <div key={key} className="trinity-card" style={{ ['--sign-color' as any]: getSignElementColor(planet.sign) }}>
                    <span className="trinity-planet-symbol">{getPlanetSymbol(key)}</span>
                    <div className="trinity-sign">{getZodiacSymbol(planet.sign)}</div>
                    <div className="trinity-title">{key === 'sun' ? 'Sun Sign' : 'Moon Sign'}</div>
                    <div className="trinity-detail">{planet.sign} {planet.degree}°</div>
                  </div>
                );
              })}
              {birthChartData.ascendant && (
                <div className="trinity-card" style={{ ['--sign-color' as any]: getSignElementColor(birthChartData.ascendant.sign) }}>
                  <span className="trinity-planet-symbol">AC</span>
                  <div className="trinity-sign">{getZodiacSymbol(birthChartData.ascendant.sign)}</div>
                  <div className="trinity-title">Rising</div>
                  <div className="trinity-detail">{birthChartData.ascendant.sign} {birthChartData.ascendant.degree}°</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PERSONAL TRANSITS THEATRE */}
        {hasBirthChart && (
          <div className="celestial-section transits-theatre">
            <h3 className="section-title"><span>🎭</span> Your Personal Transits</h3>
            {personalTransits.length === 0 ? (
              <div className="transits-empty-state">
                <span className="transits-empty-icon">✧</span>
                <p>The sky is quiet today.<br/>No major personal transits are active.</p>
              </div>
            ) : (
              <div className="transits-grid">
                {personalTransits
                  .sort((a, b) => b.strength - a.strength)
                  .slice(0, 6)
                  .map(transit => (
                  <div
                    key={transit.id}
                    className={`transit-theatre-card strength-${Math.floor(transit.strength / 20)}`}
                    onClick={() => onTransitClick(transit)}
                  >
                    <div className="ttc-glow" />
                    <div className="ttc-header">
                      <div className="ttc-planets">
                        <span className="ttc-planet ttc-transiting">{getPlanetSymbol(transit.transitingPlanet)}</span>
                        <span className="ttc-aspect">{getAspectSymbol(transit.aspect)}</span>
                        <span className="ttc-planet ttc-natal">{getPlanetSymbol(transit.natalPlanet)}</span>
                      </div>
                      <div className="ttc-strength-badge">{transit.strength}%</div>
                    </div>
                    <div className="ttc-body">
                      <div className="ttc-name">{transit.transitingPlanet} {transit.aspect} your {transit.natalPlanet}</div>
                      <div className="ttc-houses">House {transit.activatedHouse} activated · Natal House {transit.natalHouse}</div>
                      <p className="ttc-interpretation">{transit.interpretation}</p>
                    </div>
                    <div className="ttc-actions">
                      <button className="ttc-btn journal" onClick={(e) => {
                        e.stopPropagation();
                        onJournalTransit(transit);
                      }}>
                        ✍️ Journal This
                      </button>
                      <button className="ttc-btn track" onClick={(e) => {
                        e.stopPropagation();
                        onTrackEnergy();
                      }}>
                        🌙 Track Energy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
