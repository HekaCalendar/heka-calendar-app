/**
 * Sun Times Card
 * Live clock with solar cycle, weather outlook, and Swiss Ephemeris precision
 */

import { useState, useEffect, useMemo, memo, useRef } from 'react';
import type { LocationData } from '../../types';
import { getWeatherData, formatTemperature, type WeatherData } from '../../services/weatherService';
import { getEliteSunTimes, type EliteSunData } from '../../services/eliteSunService';
import './UnifiedCards.css';

interface Props {
  date: Date;
  location: LocationData;
}

const SunTimesCardComponent: React.FC<Props> = ({ date, location }) => {
  const [sunTimes, setSunTimes] = useState<EliteSunData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [now, setNow] = useState(new Date());
  const tickRef = useRef<number>(0);

  // Live clock - every second
  useEffect(() => {
    const tick = () => {
      const t = Date.now();
      if (t - tickRef.current >= 1000) {
        tickRef.current = t;
        setNow(new Date());
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  // Fetch sun times and weather
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getEliteSunTimes(date, location),
      getWeatherData(location),
    ]).then(([sunData, weatherData]) => {
      setSunTimes(sunData);
      setWeather(weatherData);
      setLoading(false);
    });
  }, [date, location]);

  const dayProgress = useMemo(() => {
    if (!sunTimes) return 0;
    const sunrise = sunTimes.sunrise.getTime();
    const sunset = sunTimes.sunset.getTime();
    const current = now.getTime();
    if (current < sunrise) return 0;
    if (current > sunset) return 100;
    return ((current - sunrise) / (sunset - sunrise)) * 100;
  }, [sunTimes, now]);

  const isDay = dayProgress > 0 && dayProgress < 100;

  const { nextEvent, nextEventCounter } = useMemo(() => {
    if (!sunTimes) return { nextEvent: null, nextEventCounter: null };
    const current = now.getTime();
    const sunrise = sunTimes.sunrise.getTime();
    const sunset = sunTimes.sunset.getTime();
    let event;
    if (current < sunrise) {
      event = { type: 'sunrise' as const, target: sunTimes.sunrise, icon: '🌅', label: 'Sunrise' };
    } else if (current < sunset) {
      event = { type: 'sunset' as const, target: sunTimes.sunset, icon: '🌇', label: 'Sunset' };
    } else {
      event = { type: 'sunrise' as const, target: sunTimes.tomorrowSunrise, icon: '🌅', label: 'Sunrise' };
    }

    let diff = event.target.getTime() - current;
    // Seamless rollover: if target just passed between 1s ticks, jump to next event
    if (diff <= 0) {
      if (event.type === 'sunrise') {
        event = { type: 'sunset' as const, target: sunTimes.sunset, icon: '🌇', label: 'Sunset' };
      } else {
        event = { type: 'sunrise' as const, target: sunTimes.tomorrowSunrise, icon: '🌅', label: 'Sunrise' };
      }
      diff = event.target.getTime() - current;
    }

    if (diff <= 0) {
      return { nextEvent: event, nextEventCounter: { d: 0, h: 0, m: 0, s: 0, showSeconds: false } };
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { nextEvent: event, nextEventCounter: { d, h, m, s, showSeconds: d === 0 } };
  }, [sunTimes, now]);

  const formatTime = (d?: Date | null) => d ? d.toLocaleTimeString('en-US', { timeZone: location.timezone, hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--';

  // Daily outlook based on current weather (only shown when real data is available)
  const forecast = useMemo(() => {
    if (!weather) return null;
    const isF = (location.country || 'US') === 'US';
    const base = isF ? weather.temperature * 9/5 + 32 : weather.temperature;
    const round = (n: number) => Math.round(n);
    const display = (n: number) => isF ? `${round(n)}°F` : `${round(n)}°C`;
    return [
      { time: 'Morning', icon: weather.conditionIcon, temp: display(base - (isF ? 4 : 2)), condition: weather.condition },
      { time: 'Afternoon', icon: weather.conditionIcon, temp: display(base + (isF ? 2 : 1)), condition: weather.condition },
      { time: 'Evening', icon: weather.conditionIcon, temp: display(base - (isF ? 2 : 1)), condition: weather.condition },
      { time: 'Night', icon: '🌙', temp: display(base - (isF ? 6 : 3)), condition: 'Clear' },
    ];
  }, [weather, location.country]);

  if (loading || !sunTimes) {
    return (
      <div className="heka-card heka-card--loading">
        <div className="heka-card__header">
          <span className="heka-card__icon">☀️</span>
          <div className="heka-card__title-group">
            <span className="heka-card__title">--:--:--</span>
            <span className="heka-card__subtitle">Calculating solar times...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`heka-card ${expanded ? 'expanded' : ''}`}>
      <div className="heka-card__header heka-card__header--enterprise" onClick={() => setExpanded(!expanded)}>
        <span className="heka-card__icon">{isDay ? '☀️' : '🌙'}</span>
        <div className="heka-card__title-group">
          <span className="heka-card__title">
            {now.toLocaleTimeString('en-US', { timeZone: location.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </span>
          <span className="heka-card__subtitle">
            {nextEvent && (
              <span className="heka-chip heka-chip--accent">
                {nextEvent.icon} {nextEvent.label} in {nextEventCounter ? `${String(nextEventCounter.h).padStart(2,'0')}:${String(nextEventCounter.m).padStart(2,'0')}` : '--:--'}
              </span>
            )}
            {weather && (
              <span className="heka-chip heka-chip--blue">
                {weather.conditionIcon} {formatTemperature(weather.temperature, location.country || 'US')}
              </span>
            )}
          </span>
        </div>
        <div className="heka-ring heka-ring--large">
          <svg viewBox="0 0 36 36">
            <path className="heka-ring__bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="heka-ring__fill" strokeDasharray={`${dayProgress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ stroke: isDay ? '#fbbf24' : '#60a5fa' }} />
          </svg>
          <span className="heka-ring__text">{isDay ? 'DAY' : 'NIGHT'}</span>
        </div>
      </div>

      {expanded && (
        <div className="heka-card__content">
          {/* Next Sun Event Epic Counter */}
          {nextEventCounter && (
            <div className="heka-epic-counter">
              <div className="heka-epic-counter__digits">
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number">{String(nextEventCounter.h).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Hours</span>
                </div>
                <span className="heka-epic-counter__separator">:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number">{String(nextEventCounter.m).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Mins</span>
                </div>
                {nextEventCounter.showSeconds && (
                  <>
                    <span className="heka-epic-counter__separator">:</span>
                    <div className="heka-epic-counter__segment">
                      <span className="heka-epic-counter__number">{String(nextEventCounter.s).padStart(2,'0')}</span>
                      <span className="heka-epic-counter__label">Secs</span>
                    </div>
                  </>
                )}
              </div>
              <span className="heka-epic-counter__title">Until {nextEvent?.label} at {nextEvent ? formatTime(nextEvent.target) : '--:--'}</span>
            </div>
          )}

          {/* Weather Forecast */}
          {weather ? (
            <div className="heka-section">
              <div className="heka-section__title">🌤️ Daily Outlook</div>
              <div className="heka-forecast">
                {forecast?.map((slot, i) => (
                  <div key={i} className="heka-forecast__slot">
                    <span className="heka-forecast__time">{slot.time}</span>
                    <span className="heka-forecast__icon">{slot.icon}</span>
                    <span className="heka-forecast__temp">{slot.temp}</span>
                    <span className="heka-forecast__condition">{slot.condition}</span>
                  </div>
                ))}
              </div>
              <div className="heka-data-grid heka-data-grid--3" style={{ marginTop: '14px', marginBottom: '0' }}>
                <div className="heka-data-cell">
                  <span className="heka-data-cell__label">Feels Like</span>
                  <span className="heka-data-cell__value">{formatTemperature(weather.feelsLike, location.country || 'US')}</span>
                </div>
                <div className="heka-data-cell">
                  <span className="heka-data-cell__label">Humidity</span>
                  <span className="heka-data-cell__value">{weather.humidity}%</span>
                </div>
                <div className="heka-data-cell">
                  <span className="heka-data-cell__label">Wind</span>
                  <span className="heka-data-cell__value">{weather.windDirection} {weather.windSpeed}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="heka-section">
              <div className="heka-section__title">🌤️ Daily Outlook</div>
              <div style={{ padding: '16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                Weather data unavailable — no API key configured
              </div>
            </div>
          )}

          {/* Solar Cycle */}
          <div className="heka-section">
            <div className="heka-section__title">☀️ Solar Cycle</div>
            <div className="heka-data-grid heka-data-grid--3">
              <div className="heka-data-cell">
                <span className="heka-data-cell__icon">🌅</span>
                <span className="heka-data-cell__label">Sunrise</span>
                <span className="heka-data-cell__value">{formatTime(sunTimes.sunrise)}</span>
              </div>
              <div className="heka-data-cell" style={{ background: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.15)' }}>
                <span className="heka-data-cell__icon">☀️</span>
                <span className="heka-data-cell__label">Solar Noon</span>
                <span className="heka-data-cell__value" style={{ color: '#fbbf24' }}>{formatTime(sunTimes.solarNoon)}</span>
              </div>
              <div className="heka-data-cell">
                <span className="heka-data-cell__icon">🌇</span>
                <span className="heka-data-cell__label">Sunset</span>
                <span className="heka-data-cell__value">{formatTime(sunTimes.sunset)}</span>
              </div>
            </div>
            <div className="heka-progress" style={{ marginTop: '14px' }}>
              <div className="heka-progress__labels">
                <span>Daylight Duration</span>
                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '10px', background: sunTimes.source === 'swiss-ephemeris' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: sunTimes.source === 'swiss-ephemeris' ? '#4ade80' : '#fbbf24' }}>
                  {sunTimes.accuracy}
                </span>
              </div>
              <div className="heka-progress__track">
                <div className="heka-progress__fill" style={{ width: `${Math.min(100, (sunTimes.dayLength / 900) * 100)}%`, background: 'linear-gradient(90deg, #60a5fa, #fbbf24)' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{Math.floor(sunTimes.dayLength / 60)}h {Math.round(sunTimes.dayLength % 60)}m</span>
                <span>Source: {sunTimes.source}</span>
              </div>
            </div>
          </div>

          <div className="heka-footer">
            <span>📍 {location.name}</span>
            <span>{Math.abs(location.latitude).toFixed(2)}°{location.latitude >= 0 ? 'N' : 'S'} {Math.abs(location.longitude).toFixed(2)}°{location.longitude >= 0 ? 'E' : 'W'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const SunTimesCard = memo(SunTimesCardComponent);
SunTimesCard.displayName = 'SunTimesCard';
