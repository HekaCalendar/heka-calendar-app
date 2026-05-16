import React from 'react';
import { useTranslation } from 'react-i18next';
import { eventBus } from '../../../services/eventBus';
import type { PersonalTransit } from '../../../oracle/birthChartIntegration';
import type { BirthChartData, CelestialState } from '../types';
import {
  getMoonEmoji,
  getZodiacSymbol,
  getSignElementColor,
  getPlanetSymbol,
  getAspectSymbol,
  generateCosmicPrompt,
  ZODIAC_ORDER_12,
  ZODIAC_ORDER_13,
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
  const { t } = useTranslation(['journal', 'celestial']);
  // Auto-detect 13-sign mode from position data
  const is13SignMode = Object.values(celestial.positions).some(
    (pos: any) => String(pos.sign).toLowerCase() === 'ophiuchus'
  );
  const zodiacOrder = is13SignMode ? ZODIAC_ORDER_13 : ZODIAC_ORDER_12;

  if (celestial.loading) {
    return (
      <div className="oracle-mode-celestial">
        <div className="celestial-loading">
          <div className="loading-orb">
            <div className="orb-ring" />
            <div className="orb-core">✨</div>
          </div>
          <p>{t('journal:celestial.consultingEphemeris')}</p>
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
            <h2 className="hero-phase">{t('journal:moonPhase.' + celestial.moonPhase.phase)} {t('journal:celestial.moon')}</h2>
            <p className="hero-meta">
              in <span className="sign-badge">{getZodiacSymbol(celestial.moonPhase.sign)} {celestial.moonPhase.sign}</span>
              <span className="illumination-dot" />
              {Math.round(celestial.moonPhase.illumination)}% {t('celestial:cards.moonPhase.illuminated')}
            </p>
          </div>
          <div className="celestial-microstats">
            <div className="microstat">
              <span className="microstat-value">{personalTransits.filter(t => t.strength >= 30).length}</span>
              <span className="microstat-label">{t('journal:celestial.activeTransits')}</span>
            </div>
            <div className="microstat">
              <span className="microstat-value">{celestial.retrogrades.length}</span>
              <span className="microstat-label">{t('journal:celestial.retrograde')}</span>
            </div>
            <div className="microstat">
              <span className="microstat-value">{Object.keys(celestial.positions).length}</span>
              <span className="microstat-label">{t('journal:celestial.planets')}</span>
            </div>
          </div>
        </div>

        {/* RETROGRADE BANNER */}
        {celestial.retrogrades.length > 0 && (
          <div className="retro-banner">
            <span className="retro-banner-icon">℞</span>
            <span className="retro-banner-text">
              {t('journal:celestial.retrogradeBanner', { planets: celestial.retrogrades.map(p => `${getPlanetSymbol(p)} ${p}`).join(', ') })}
            </span>
          </div>
        )}

        {/* COSMIC PROMPT */}
        <div className="cosmic-prompt-panel">
          <div className="prompt-icon">✦</div>
          <div className="prompt-content">
            <h4>{t('journal:celestial.cosmicPrompt')}</h4>
            <p>{generateCosmicPrompt(personalTransits, celestial.moonPhase, t)}</p>
          </div>
          <button className="prompt-cta" onClick={() => {
            const prompt = generateCosmicPrompt(personalTransits, celestial.moonPhase, t);
            // Parent will handle setting scribe content and mode
            // We use a custom event for decoupling
            eventBus.emit('heka-journal-prompt', { prompt });
          }}>
            {t('journal:celestial.writeReflection')}
          </button>
        </div>

        {/* SKY MAP */}
        <div className="celestial-section sky-map-section">
          <h3 className="section-title"><span>🌌</span> {t('journal:celestial.livingSky')}</h3>
          <div className={`zodiac-sky-map ${is13SignMode ? 'zodiac-sky-map--13' : ''}`}>
            {zodiacOrder.map(sign => {
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
            <h3 className="section-title"><span>✦</span> {t('journal:celestial.celestialTrinity')}</h3>
            <div className="trinity-cards">
              {(['sun', 'moon'] as const).map(key => {
                const planet = birthChartData.planets?.[key];
                if (!planet) return null;
                return (
                  <div key={key} className="trinity-card" style={{ ['--sign-color' as any]: getSignElementColor(planet.sign) }}>
                    <span className="trinity-planet-symbol">{getPlanetSymbol(key)}</span>
                    <div className="trinity-sign">{getZodiacSymbol(planet.sign)}</div>
                    <div className="trinity-title">{key === 'sun' ? t('journal:celestial.sunSign') : t('journal:celestial.moonSign')}</div>
                    <div className="trinity-detail">{planet.sign} {planet.degree}°</div>
                  </div>
                );
              })}
              {birthChartData.ascendant && (
                <div className="trinity-card" style={{ ['--sign-color' as any]: getSignElementColor(birthChartData.ascendant.sign) }}>
                  <span className="trinity-planet-symbol">AC</span>
                  <div className="trinity-sign">{getZodiacSymbol(birthChartData.ascendant.sign)}</div>
                  <div className="trinity-title">{t('journal:celestial.rising')}</div>
                  <div className="trinity-detail">{birthChartData.ascendant.sign} {birthChartData.ascendant.degree}°</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PERSONAL TRANSITS THEATRE */}
        {hasBirthChart && (
          <div className="celestial-section transits-theatre">
            <h3 className="section-title"><span>🎭</span> {t('journal:celestial.personalTransits')}</h3>
            {personalTransits.length === 0 ? (
              <div className="transits-empty-state">
                <span className="transits-empty-icon">✧</span>
                <p>{t('journal:celestial.quietSky')}<br/>{t('journal:celestial.noTransits')}</p>
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
                      <div className="ttc-name">{t('journal:celestial.transitDescription', { transitingPlanet: transit.transitingPlanet, aspect: transit.aspect, natalPlanet: transit.natalPlanet })}</div>
                      <div className="ttc-houses">{t('journal:celestial.houseActivated', { house: transit.activatedHouse })} · {t('journal:celestial.natalHouse', { house: transit.natalHouse })}</div>
                      <p className="ttc-interpretation">{transit.interpretation}</p>
                    </div>
                    <div className="ttc-actions">
                      <button className="ttc-btn journal" onClick={(e) => {
                        e.stopPropagation();
                        onJournalTransit(transit);
                      }}>
                        {t('journal:celestial.journalThis')}
                      </button>
                      <button className="ttc-btn track" onClick={(e) => {
                        e.stopPropagation();
                        onTrackEnergy();
                      }}>
                        {t('journal:celestial.trackEnergy')}
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
