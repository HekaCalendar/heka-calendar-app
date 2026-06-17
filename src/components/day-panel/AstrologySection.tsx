/**
 * Astrology Section
 * Daily astrology, transits, and celestial guidance
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { AstrologySectionProps } from './types';

export const AstrologySection = memo(({
  isLoading,
  hasBirthChart,
  birthChartName,
  dailyAstrology,
  personalTransits,
  sunriseTime,
  sunsetTime,
  currentPlanetaryHour,
  locationName,
}: AstrologySectionProps) => {
  const { t } = useTranslation('dayPanel');

  if (isLoading) {
    return (
      <div className="day-panel__section day-panel__astrology">
        <div className="day-panel__section-title">
          <span>{hasBirthChart ? '✦' : '✨'}</span>
          {hasBirthChart ? t('astrology.personalizedFor', { name: birthChartName }) : t('astrology.dailyCosmicGuidance')}
          {hasBirthChart && <span className="astro-personalized-badge">{t('astrology.birthChartActive')}</span>}
        </div>
        <div className="day-panel__astrology-loading">
          <span className="spinner"></span>
          <span>{hasBirthChart ? t('astrology.calculatingTransits') : t('astrology.connectingCelestial')}</span>
        </div>
      </div>
    );
  }

  if (!dailyAstrology) {
    return (
      <div className="day-panel__section day-panel__astrology">
        <div className="day-panel__section-title">
          <span>✨</span> {t('astrology.dailyCosmicGuidance')}
        </div>
        <div className="day-panel__astrology-empty">
          {t('astrology.unavailable')}
        </div>
      </div>
    );
  }

  return (
    <div className="day-panel__section day-panel__astrology">
      <div className="day-panel__section-title">
        <span>{hasBirthChart ? '✦' : '✨'}</span>
        {hasBirthChart ? t('astrology.personalizedFor', { name: birthChartName }) : t('astrology.dailyCosmicGuidance')}
        {hasBirthChart && <span className="astro-personalized-badge">{t('astrology.birthChartActive')}</span>}
      </div>

      {/* Location-Aware Sun Times & Planetary Hour */}
      {(sunriseTime || sunsetTime || currentPlanetaryHour) && (
        <div className="astro-location-times">
          {sunriseTime && (
            <div className="astro-time-badge">
              <span className="astro-time-icon">🌅</span>
              <span className="astro-time-label">{t('astrology.sunrise', { time: sunriseTime })}</span>
            </div>
          )}
          {sunsetTime && (
            <div className="astro-time-badge">
              <span className="astro-time-icon">🌇</span>
              <span className="astro-time-label">{t('astrology.sunset', { time: sunsetTime })}</span>
            </div>
          )}
          {currentPlanetaryHour && (
            <div className="astro-time-badge astro-planetary-hour">
              <span className="astro-time-icon">{currentPlanetaryHour.symbol}</span>
              <span className="astro-time-label">{t('astrology.planetaryHour', { planet: currentPlanetaryHour.planet })}</span>
            </div>
          )}
          <div className="astro-location-name">📍 {t('astrology.locationPin', { location: locationName })}</div>
        </div>
      )}

      {/* Personal Transits - Only if birth chart exists */}
      {hasBirthChart && personalTransits.length > 0 && (
        <div className="astro-transits-section">
          <div className="astro-transits-title">🌟 {t('astrology.activeTransits')}</div>
          {personalTransits.map((transit, idx) => (
            <div key={idx} className={`astro-transit-item strength-${Math.floor(transit.strength / 20)}`}>
              <span className="astro-transit-planets">
                {transit.transitingPlanet} {transit.aspect} {transit.natalPlanet}
              </span>
              <span className="astro-transit-orb">{transit.orb.toFixed(1)}°</span>
              <span className="astro-transit-strength" style={{
                color: transit.strength >= 80 ? '#22c55e' :
                  transit.strength >= 60 ? '#3b82f6' : '#eab308'
              }}>
                {transit.strength}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Moon Phase Card */}
      <div className="astro-card astro-card--moon">
        <div className="astro-card__icon">
          {dailyAstrology.moonPhase.phase === 'new' && '🌑'}
          {dailyAstrology.moonPhase.phase === 'waxing-crescent' && '🌒'}
          {dailyAstrology.moonPhase.phase === 'first-quarter' && '🌓'}
          {dailyAstrology.moonPhase.phase === 'waxing-gibbous' && '🌔'}
          {dailyAstrology.moonPhase.phase === 'full' && '🌕'}
          {dailyAstrology.moonPhase.phase === 'waning-gibbous' && '🌖'}
          {dailyAstrology.moonPhase.phase === 'last-quarter' && '🌗'}
          {dailyAstrology.moonPhase.phase === 'waning-crescent' && '🌘'}
        </div>
        <div className="astro-card__info">
          <div className="astro-card__title">{dailyAstrology.moonPhase.name}</div>
          <div className="astro-card__detail">
            {t('moon.illuminated', { percent: Math.round(dailyAstrology.moonPhase.illumination) })}
          </div>
        </div>
      </div>

      {/* Signs Row */}
      <div className="astro-row">
        <div className="astro-badge">
          <span className="astro-badge__icon">☽</span>
          <span className="astro-badge__label">{t('astrology.moonIn', { sign: dailyAstrology.moonSign })}</span>
        </div>
        <div className="astro-badge">
          <span className="astro-badge__icon">☉</span>
          <span className="astro-badge__label">{t('astrology.sunIn', { sign: dailyAstrology.sunSign })}</span>
        </div>
      </div>

      {/* Daily Theme */}
      <div className="astro-theme">
        <span className="astro-theme__label">{t('astrology.todaysTheme')}</span>
        <span className="astro-theme__value">{dailyAstrology.dailyTheme}</span>
      </div>

      {/* Guidance */}
      <div className="astro-content-card astro-content-card--guidance">
        <div className="astro-content-card__label">🌟 {t('astrology.cosmicGuidance')}</div>
        <div className="astro-content-card__text">{dailyAstrology.guidance}</div>
      </div>

      {/* Journal Prompt */}
      <div className="astro-content-card astro-content-card--prompt">
        <div className="astro-content-card__label">📝 {t('astrology.reflection')}</div>
        <div className="astro-content-card__text">{dailyAstrology.journalPrompt}</div>
      </div>

      {/* Affirmation */}
      <div className="astro-content-card astro-content-card--affirmation">
        <div className="astro-content-card__label">💫 {t('astrology.affirmation')}</div>
        <div className="astro-content-card__text">&quot;{dailyAstrology.affirmation}&quot;</div>
      </div>

      {/* Power Moment - Location Aware */}
      {dailyAstrology.powerMoment && (
        <div className="astro-power-moment">
          <span className="astro-power-moment__icon">⚡</span>
          <span className="astro-power-moment__text">{dailyAstrology.powerMoment}</span>
        </div>
      )}

      {/* Add Birth Chart CTA if not present */}
      {!hasBirthChart && (
        <div className="astro-birthchart-cta">
          <p>✨ <strong>{t('astrology.birthChartCta.title')}</strong></p>
          <p>{t('astrology.birthChartCta.description')}</p>
        </div>
      )}
    </div>
  );
});

AstrologySection.displayName = 'AstrologySection';

export default AstrologySection;
