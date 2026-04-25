/**
 * Astrology Section
 * Daily astrology, transits, and celestial guidance
 */

import { memo } from 'react';
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
  if (isLoading) {
    return (
      <div className="day-panel__section day-panel__astrology">
        <div className="day-panel__section-title">
          <span>{hasBirthChart ? '✦' : '✨'}</span>
          {hasBirthChart ? `Personalized for ${birthChartName}` : 'Daily Cosmic Guidance'}
          {hasBirthChart && <span className="astro-personalized-badge">Birth Chart Active</span>}
        </div>
        <div className="day-panel__astrology-loading">
          <span className="spinner"></span>
          <span>{hasBirthChart ? 'Calculating your personal transits...' : 'Connecting to celestial intelligence...'}</span>
        </div>
      </div>
    );
  }

  if (!dailyAstrology) {
    return (
      <div className="day-panel__section day-panel__astrology">
        <div className="day-panel__section-title">
          <span>✨</span> Daily Cosmic Guidance
        </div>
        <div className="day-panel__astrology-empty">
          Celestial guidance unavailable. Check the Stars section for detailed astrology.
        </div>
      </div>
    );
  }

  return (
    <div className="day-panel__section day-panel__astrology">
      <div className="day-panel__section-title">
        <span>{hasBirthChart ? '✦' : '✨'}</span>
        {hasBirthChart ? `Personalized for ${birthChartName}` : 'Daily Cosmic Guidance'}
        {hasBirthChart && <span className="astro-personalized-badge">Birth Chart Active</span>}
      </div>

      {/* Location-Aware Sun Times & Planetary Hour */}
      {(sunriseTime || sunsetTime || currentPlanetaryHour) && (
        <div className="astro-location-times">
          {sunriseTime && (
            <div className="astro-time-badge">
              <span className="astro-time-icon">🌅</span>
              <span className="astro-time-label">Sunrise: {sunriseTime}</span>
            </div>
          )}
          {sunsetTime && (
            <div className="astro-time-badge">
              <span className="astro-time-icon">🌇</span>
              <span className="astro-time-label">Sunset: {sunsetTime}</span>
            </div>
          )}
          {currentPlanetaryHour && (
            <div className="astro-time-badge astro-planetary-hour">
              <span className="astro-time-icon">{currentPlanetaryHour.symbol}</span>
              <span className="astro-time-label">Planetary Hour: {currentPlanetaryHour.planet}</span>
            </div>
          )}
          <div className="astro-location-name">📍 {locationName}</div>
        </div>
      )}

      {/* Personal Transits - Only if birth chart exists */}
      {hasBirthChart && personalTransits.length > 0 && (
        <div className="astro-transits-section">
          <div className="astro-transits-title">🌟 Active Transits for You Today</div>
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
            {Math.round(dailyAstrology.moonPhase.illumination)}% illuminated
          </div>
        </div>
      </div>

      {/* Signs Row */}
      <div className="astro-row">
        <div className="astro-badge">
          <span className="astro-badge__icon">☽</span>
          <span className="astro-badge__label">Moon in {dailyAstrology.moonSign}</span>
        </div>
        <div className="astro-badge">
          <span className="astro-badge__icon">☉</span>
          <span className="astro-badge__label">Sun in {dailyAstrology.sunSign}</span>
        </div>
      </div>

      {/* Daily Theme */}
      <div className="astro-theme">
        <span className="astro-theme__label">Today&apos;s Theme:</span>
        <span className="astro-theme__value">{dailyAstrology.dailyTheme}</span>
      </div>

      {/* Guidance */}
      <div className="astro-guidance">
        <div className="astro-guidance__label">🌟 Cosmic Guidance</div>
        <div className="astro-guidance__text">{dailyAstrology.guidance}</div>
      </div>

      {/* Journal Prompt */}
      <div className="astro-prompt">
        <div className="astro-prompt__label">📝 Reflection</div>
        <div className="astro-prompt__text">{dailyAstrology.journalPrompt}</div>
      </div>

      {/* Affirmation */}
      <div className="astro-affirmation">
        <div className="astro-affirmation__label">💫 Affirmation</div>
        <div className="astro-affirmation__text">&quot;{dailyAstrology.affirmation}&quot;</div>
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
          <p>✨ <strong>Want personalized transits?</strong></p>
          <p>Add your birth chart in the Stars section to see how today&apos;s cosmic weather affects you personally.</p>
        </div>
      )}
    </div>
  );
});

AstrologySection.displayName = 'AstrologySection';

export default AstrologySection;
