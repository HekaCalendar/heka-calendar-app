/**
 * Day of Week Card
 * Planetary ruler, daily guidance, and live planetary hour
 */

import { useState, useEffect, memo } from 'react';
import { getDayOfWeekData } from '../../services/dayOfWeekService';
import { getEliteSunTimes } from '../../services/eliteSunService';
import type { LocationData } from '../../types';
import './UnifiedCards.css';

interface Props {
  date: Date;
  location: LocationData;
}

const CHALDEAN = [
  { name: 'Saturn', symbol: '♄', color: '#9ca3af' },
  { name: 'Jupiter', symbol: '♃', color: '#a78bfa' },
  { name: 'Mars', symbol: '♂', color: '#ef4444' },
  { name: 'Sun', symbol: '☉', color: '#fbbf24' },
  { name: 'Venus', symbol: '♀', color: '#ec4899' },
  { name: 'Mercury', symbol: '☿', color: '#4ade80' },
  { name: 'Moon', symbol: '☽', color: '#c4b5fd' },
];

const DAY_START_INDEX = [3, 6, 2, 5, 1, 4, 0]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat

const DayOfWeekCardComponent: React.FC<Props> = ({ date, location }) => {
  const [dayData, setDayData] = useState<ReturnType<typeof getDayOfWeekData> | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [planetaryHour, setPlanetaryHour] = useState<{ planet: typeof CHALDEAN[0]; hourIndex: number; progress: number } | null>(null);

  useEffect(() => {
    setDayData(getDayOfWeekData(date));
  }, [date]);

  useEffect(() => {
    let cancelled = false;
    const compute = async () => {
      try {
        const today = await getEliteSunTimes(date, location);
        const tomorrowDate = new Date(date);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const tomorrow = await getEliteSunTimes(tomorrowDate, location);

        if (cancelled) return;
        const now = date.getTime();

        // Validate sun times before computing
        const sunrise = today?.sunrise?.getTime?.();
        const sunset = today?.sunset?.getTime?.();
        const nextSunrise = tomorrow?.sunrise?.getTime?.();
        if (
          sunrise == null || sunset == null || nextSunrise == null ||
          Number.isNaN(sunrise) || Number.isNaN(sunset) || Number.isNaN(nextSunrise)
        ) {
          setPlanetaryHour(null);
          return;
        }

        const dayOfWeek = date.getDay();
        const startIndex = DAY_START_INDEX[dayOfWeek];

        let hourIndex = 0;
        let progress = 0;

        if (now >= sunrise && now <= sunset) {
          const daylightHourMs = (sunset - sunrise) / 12;
          const msSinceSunrise = now - sunrise;
          hourIndex = Math.min(11, Math.floor(msSinceSunrise / daylightHourMs));
          progress = Math.min(100, (msSinceSunrise % daylightHourMs) / daylightHourMs * 100);
        } else {
          const nightHourMs = (nextSunrise - sunset) / 12;
          const msSinceSunset = now - sunset;
          hourIndex = Math.min(11, Math.floor(msSinceSunset / nightHourMs)) + 12;
          progress = Math.min(100, (msSinceSunset % nightHourMs) / nightHourMs * 100);
        }

        const planetIndex = (startIndex + hourIndex) % 7;
        const planet = CHALDEAN[planetIndex];
        if (!planet) {
          setPlanetaryHour(null);
          return;
        }
        setPlanetaryHour({ planet, hourIndex, progress });
      } catch {
        setPlanetaryHour(null);
      }
    };
    compute();
    return () => { cancelled = true; };
  }, [date, location]);

  const hours = date.getHours() + date.getMinutes() / 60;
  const dayProgress = (hours / 24) * 100;

  if (!dayData) return null;

  return (
    <div className={`heka-card ${expanded ? 'expanded' : ''}`}>
      <div className="heka-card__header" onClick={() => setExpanded(!expanded)}>
        <span className="heka-card__icon">{dayData.icon}</span>
        <div className="heka-card__title-group">
          <span className="heka-card__title">{dayData.day}</span>
          <span className="heka-card__subtitle">
            {planetaryHour?.planet
              ? `${planetaryHour.planet.symbol} ${planetaryHour.planet.name} Hour`
              : `${dayData.planetSymbol} ${dayData.planet}'s Day`}
            {' • '}{Math.round(dayProgress)}% complete
          </span>
        </div>
        <div className="heka-ring">
          <svg viewBox="0 0 36 36">
            <path className="heka-ring__bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="heka-ring__fill" strokeDasharray={`${dayProgress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ stroke: dayData.color }} />
          </svg>
          <span className="heka-ring__text">{Math.round(dayProgress)}%</span>
        </div>
      </div>

      {expanded && (
        <div className="heka-card__content">
          {/* Planetary Hour */}
          {planetaryHour?.planet && (
            <div className="heka-section">
              <div className="heka-section__title">⏳ Planetary Hour {planetaryHour.hourIndex + 1}/24</div>
              <div className="heka-data-cell" style={{ borderColor: `${planetaryHour.planet.color}30`, marginBottom: '8px' }}>
                <span className="heka-data-cell__icon" style={{ fontSize: '20px' }}>{planetaryHour.planet.symbol}</span>
                <span className="heka-data-cell__label">Current Ruler</span>
                <span className="heka-data-cell__value" style={{ color: planetaryHour.planet.color }}>{planetaryHour.planet.name}</span>
              </div>
              <div className="heka-progress__track">
                <div className="heka-progress__fill" style={{ width: `${planetaryHour.progress}%`, background: planetaryHour.planet.color }} />
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'right' }}>
                {Math.round(planetaryHour.progress)}% through hour
              </div>
            </div>
          )}

          {/* Day Progress */}
          <div className="heka-progress" style={{ marginTop: planetaryHour?.planet ? '12px' : '0' }}>
            <div className="heka-progress__labels">
              <span>{dayData.planet}'s Influence</span>
              <span style={{ color: dayData.color }}>{Math.round(dayProgress)}%</span>
            </div>
            <div className="heka-progress__track">
              <div className="heka-progress__fill" style={{ width: `${dayProgress}%`, background: dayData.color }} />
            </div>
          </div>

          {/* Favorable Activities */}
          <div className="heka-section" style={{ marginTop: '16px' }}>
            <div className="heka-section__title">✓ Favorable Today</div>
            <div className="heka-tags">
              {dayData.favorableActivities.slice(0, 6).map((a, i) => (
                <span key={i} className="heka-tag" style={{ borderColor: `${dayData.color}40`, color: dayData.color }}>{a}</span>
              ))}
            </div>
          </div>

          {/* Psychology */}
          <div className="heka-section">
            <div className="heka-section__title">⚡ Energy Profile</div>
            <div className="heka-data-grid heka-data-grid--2">
              <div className="heka-data-cell">
                <span className="heka-data-cell__label">Mood</span>
                <span className="heka-data-cell__value">{dayData.psychology.mood}</span>
              </div>
              <div className="heka-data-cell">
                <span className="heka-data-cell__label">Energy</span>
                <span className="heka-data-cell__value">{dayData.psychology.energy}</span>
              </div>
            </div>
          </div>

          {/* Qualities */}
          <div className="heka-section">
            <div className="heka-section__title">✨ Planetary Qualities</div>
            <div className="heka-tags">
              {dayData.qualities.slice(0, 5).map((q, i) => (
                <span key={i} className="heka-tag">{q}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const DayOfWeekCard = memo(DayOfWeekCardComponent);
DayOfWeekCard.displayName = 'DayOfWeekCard';
