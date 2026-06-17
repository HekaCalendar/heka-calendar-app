/**
 * Day of Week Card
 * Planetary ruler, daily guidance, and live planetary hour
 * Location-aware, real-time updating, Chaldean timeline
 */

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { getDayOfWeekData } from '../../services/dayOfWeekService';
import { getCurrentPlanetaryHour } from '../../astrology/services/calculations/swissCalculations';
import { useGlobalTime } from '../../hooks/useGlobalTime';
import type { LocationData } from '../../types';
import i18n from '../../i18n';
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

const PLANETARY_GUIDANCE: Record<string, {
  title: string;
  description: string;
  do: string[];
  dont: string[];
  quality: string;
}> = {
  sun: {
    title: 'The Solar Hour',
    description: 'The Sun illuminates all it touches. This hour favors visibility, leadership, and matters of the heart and ego.',
    do: ['Take leadership', 'Make important requests', 'Focus on visibility', 'Express yourself', 'Seek recognition'],
    dont: ['Hide in the shadows', 'Avoid responsibility', 'Dim your light'],
    quality: 'Vitality & Recognition'
  },
  moon: {
    title: 'The Lunar Hour',
    description: 'The Moon rules the tides of emotion and intuition. A time for nurturing, home, and psychic receptivity.',
    do: ['Nurture relationships', 'Trust intuition', 'Home and family matters', 'Emotional processing', 'Dream work'],
    dont: ['Force rational decisions', 'Ignore feelings', 'Push too hard'],
    quality: 'Emotion & Intuition'
  },
  mars: {
    title: 'The Martian Hour',
    description: 'Mars brings fire, drive, and competitive energy. Physical action and confrontation are favored.',
    do: ['Physical activity', 'Handle conflicts directly', 'Exercise', 'Competitive pursuits', 'Take bold action'],
    dont: ['Avoid necessary confrontation', 'Repress anger', 'Start arguments'],
    quality: 'Action & Drive'
  },
  mercury: {
    title: 'The Mercurial Hour',
    description: 'Mercury quickens the mind and tongue. Communication, learning, and commerce flow easily now.',
    do: ['Send important messages', 'Write and study', 'Negotiate', 'Travel short distances', 'Problem-solve'],
    dont: ['Engage in deception', 'Spread gossip', 'Rush contracts'],
    quality: 'Mind & Communication'
  },
  jupiter: {
    title: 'The Jovian Hour',
    description: 'Jupiter expands all it touches. Fortune, wisdom, and growth are blessed in this hour.',
    do: ['Business dealings', 'Seek wisdom', 'Expand horizons', 'Teach and learn', 'Acts of generosity'],
    dont: ['Be miserly', 'Think small', 'Limit yourself'],
    quality: 'Expansion & Fortune'
  },
  venus: {
    title: 'The Venusian Hour',
    description: 'Venus bathes the world in beauty and desire. Love, art, and harmony reign supreme.',
    do: ['Romance and courtship', 'Artistic creation', 'Socialize', 'Create beauty', 'Resolve conflicts peacefully'],
    dont: ['Force outcomes', 'Ignore aesthetics', 'Rush intimacy'],
    quality: 'Love & Beauty'
  },
  saturn: {
    title: 'The Saturnine Hour',
    description: 'Saturn demands discipline and structure. Hard work now yields lasting results.',
    do: ['Focus on responsibilities', 'Study and organize', 'Plan ahead', 'Build foundations', 'Accept limitations'],
    dont: ['Cut corners', 'Avoid duties', 'Expect instant results'],
    quality: 'Discipline & Structure'
  }
};

/** Get day-of-week index (0=Sunday) for a specific date in the given timezone */
function getLocationDayOfWeek(date: Date, timezone: string): number {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: timezone, weekday: 'short' });
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[f.format(date)] ?? 0;
}

/** Build a local Date whose wall-clock values match the given date in the target timezone */
function getLocationDate(date: Date, timezone: string): Date {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
  });
  const parts = f.formatToParts(date);
  const get = (t: string) => parseInt(parts.find(p => p.type === t)?.value || '0', 10);
  return new Date(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
}

const DayOfWeekCardComponent: React.FC<Props> = ({ date, location }) => {
  const [expanded, setExpanded] = useState(false);
  const [planetaryHour, setPlanetaryHour] = useState<Awaited<ReturnType<typeof getCurrentPlanetaryHour>> | null>(null);
  const [loading, setLoading] = useState(false);

  // Shared live time — ticks once per second.
  const liveNow = useGlobalTime();

  // Derive "now" from the selected date + current real time, so the card stays
  // live while respecting the calendar selection.
  const now = useMemo(() => {
    const base = new Date(date);
    base.setHours(liveNow.getHours(), liveNow.getMinutes(), liveNow.getSeconds(), liveNow.getMilliseconds());
    return base;
  }, [date, liveNow]);

  // Compute planetary hour whenever now or location changes
  useEffect(() => {
    let cancelled = false;
    const compute = async () => {
      setLoading(true);
      try {
        const ph = await getCurrentPlanetaryHour(
          now,
          location.latitude,
          location.longitude,
          0
        );
        if (!cancelled) setPlanetaryHour(ph);
      } catch {
        if (!cancelled) setPlanetaryHour(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    compute();
    return () => { cancelled = true; };
  }, [now, location]);

  // Day ruler based on LOCATION timezone for the selected date
  const locDayOfWeek = getLocationDayOfWeek(date, location.timezone);
  // Jan 7 2024 = Sunday; offset gives any target DoW
  const dayData = getDayOfWeekData(new Date(2024, 0, 7 + locDayOfWeek));

  // Day progress in location timezone
  const locDate = getLocationDate(date, location.timezone);
  const dayProgress = ((locDate.getHours() + locDate.getMinutes() / 60) / 24) * 100;

  // Current planet info
  const currentPlanet = planetaryHour
    ? CHALDEAN.find(p => p.name.toLowerCase() === planetaryHour.planet) ?? null
    : null;

  // Build 24-hour Chaldean sequence for the location day
  const chaldeanSequence = useCallback(() => {
    const startIndex = DAY_START_INDEX[locDayOfWeek];
    const seq: { planet: typeof CHALDEAN[0]; hourIndex: number; isDay: boolean }[] = [];
    for (let h = 0; h < 24; h++) {
      const idx = (startIndex + h) % 7;
      seq.push({ planet: CHALDEAN[idx], hourIndex: h, isDay: h < 12 });
    }
    return seq;
  }, [locDayOfWeek]);

  const fullSequence = chaldeanSequence();
  const currentHourIndex = planetaryHour?.hour ?? -1;

  // Hour guidance
  const hourGuidance = planetaryHour ? PLANETARY_GUIDANCE[planetaryHour.planet] : null;

  // Ring shows planetary hour progress (or day progress if no planetary hour)
  const ringProgress = planetaryHour?.progress ?? dayProgress;
  const ringColor = currentPlanet?.color ?? dayData.color;

  return (
    <div className={`heka-card heka-card--day ${expanded ? 'expanded' : ''}`}>
      {/* ── Collapsed Header ── */}
      <div className="heka-card__header" onClick={() => setExpanded(!expanded)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); } }}>
        <span className="heka-card__icon">{dayData.icon}</span>
        <div className="heka-card__title-group">
          <span className="heka-card__title">{dayData.day}</span>
          <span className="heka-card__subtitle">
            {currentPlanet ? (
              <>
                <span style={{ color: currentPlanet.color }}>{currentPlanet.symbol} {currentPlanet.name} Hour</span>
                {' • '}
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {planetaryHour?.isDay ? 'Daylight' : 'Night'} • {Math.round(ringProgress)}%
                </span>
              </>
            ) : (
              <>
                {dayData.planetSymbol} {dayData.planet}'s Day
                {' • '}
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {Math.round(dayProgress)}% complete
                </span>
              </>
            )}
          </span>
        </div>

        <div className="heka-ring">
          <svg viewBox="0 0 36 36">
            <path className="heka-ring__bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="heka-ring__fill"
              strokeDasharray={`${ringProgress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ stroke: ringColor }} />
          </svg>
          <span className="heka-ring__text" style={{ color: ringColor }}>
            {currentPlanet ? currentPlanet.symbol : dayData.planetSymbol}
          </span>
        </div>

        <span className={`heka-card__chevron ${expanded ? 'rotated' : ''}`}>▼</span>
      </div>

      {/* ── Expanded Content ── */}
      {expanded && (
        <div className="heka-card__content">

          {/* Current Planetary Hour — Hero */}
          {planetaryHour && currentPlanet && hourGuidance && (
            <div className="heka-section">
              <div className="heka-section__title">
                ⏳ Planetary Hour {planetaryHour.hour + 1}/24
                <span className="heka-chip" style={{ borderColor: `${currentPlanet.color}40`, color: currentPlanet.color }}>
                  {planetaryHour.isDay ? '☀ Day' : '🌙 Night'}
                </span>
              </div>

              <div className="heka-hero" style={{ borderColor: `${currentPlanet.color}20` }}>
                <span className="heka-hero__icon" style={{ filter: `drop-shadow(0 4px 12px ${currentPlanet.color}40)` }}>
                  {currentPlanet.symbol}
                </span>
                <div className="heka-hero__content">
                  <div className="heka-hero__title" style={{ color: currentPlanet.color }}>{hourGuidance.title}</div>
                  <div className="heka-hero__meta">{hourGuidance.quality}</div>
                </div>
              </div>

              <div className="heka-progress" style={{ marginTop: '10px' }}>
                <div className="heka-progress__labels">
                  <span style={{ color: currentPlanet.color }}>{currentPlanet.name} Hour Progress</span>
                  <span style={{ color: currentPlanet.color }}>{Math.round(planetaryHour.progress)}%</span>
                </div>
                <div className="heka-progress__track">
                  <div className="heka-progress__fill" style={{ width: `${planetaryHour.progress}%`, background: currentPlanet.color, boxShadow: `0 0 10px ${currentPlanet.color}60` }} />
                </div>
              </div>

              {/* Sunrise / Sunset */}
              {(planetaryHour.sunrise || planetaryHour.sunset) && (
                <div className="heka-data-grid heka-data-grid--2" style={{ marginTop: '14px', marginBottom: 0 }}>
                  {planetaryHour.sunrise && (
                    <div className="heka-data-cell">
                      <span className="heka-data-cell__icon">🌅</span>
                      <span className="heka-data-cell__label">Sunrise</span>
                      <span className="heka-data-cell__value">
                        {new Intl.DateTimeFormat(i18n.language || 'en', { hour: '2-digit', minute: '2-digit', timeZone: location.timezone }).format(planetaryHour.sunrise)}
                      </span>
                    </div>
                  )}
                  {planetaryHour.sunset && (
                    <div className="heka-data-cell">
                      <span className="heka-data-cell__icon">🌇</span>
                      <span className="heka-data-cell__label">Sunset</span>
                      <span className="heka-data-cell__value">
                        {new Intl.DateTimeFormat(i18n.language || 'en', { hour: '2-digit', minute: '2-digit', timeZone: location.timezone }).format(planetaryHour.sunset)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Chaldean Timeline */}
          <div className="heka-section">
            <div className="heka-section__title">🜁 The Chaldean Order</div>
            <div className="chaldean-timeline">
              {fullSequence.map((item) => {
                const isCurrent = item.hourIndex === currentHourIndex;
                const isPast = item.hourIndex < currentHourIndex;
                return (
                  <div
                    key={item.hourIndex}
                    className={`chaldean-timeline__slot ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}`}
                    title={`Hour ${item.hourIndex + 1}: ${item.planet.name}`}
                  >
                    <span className="chaldean-timeline__symbol" style={{ color: item.planet.color }}>
                      {item.planet.symbol}
                    </span>
                    <span className="chaldean-timeline__label">{item.hourIndex + 1}</span>
                    {isCurrent && <div className="chaldean-timeline__indicator" style={{ background: item.planet.color }} />}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '6px' }}>
              {planetaryHour && !planetaryHour.isDay
                ? `Hour ${planetaryHour.hour + 1} of the night • Next sunrise at ${planetaryHour.sunrise ? new Intl.DateTimeFormat(i18n.language || 'en', { hour: '2-digit', minute: '2-digit', timeZone: location.timezone }).format(planetaryHour.sunrise) : '...'}`
                : planetaryHour
                  ? `Hour ${planetaryHour.hour + 1} of the day • Next sunset at ${planetaryHour.sunset ? new Intl.DateTimeFormat(i18n.language || 'en', { hour: '2-digit', minute: '2-digit', timeZone: location.timezone }).format(planetaryHour.sunset) : '...'}`
                  : 'Hour 1 begins at sunrise • Hours 13–24 are night hours'
              }
            </div>
          </div>

          {/* Hour Guidance: Do / Don't */}
          {hourGuidance && (
            <div className="heka-section">
              <div className="heka-section__title">✓ Favored Now</div>
              <div className="heka-list" style={{ marginBottom: '10px' }}>
                {hourGuidance.do.map((item, i) => (
                  <div key={i} className="heka-list__item">
                    <span style={{ color: '#4ade80', marginRight: '8px' }}>✓</span>{item}
                  </div>
                ))}
              </div>
              <div className="heka-section__title" style={{ marginTop: '12px' }}>✗ Best to Avoid</div>
              <div className="heka-list">
                {hourGuidance.dont.map((item, i) => (
                  <div key={i} className="heka-list__item">
                    <span style={{ color: '#ef4444', marginRight: '8px' }}>✗</span>{item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day Progress */}
          <div className="heka-section">
            <div className="heka-progress__labels">
              <span>{dayData.planet}'s Day Progress</span>
              <span style={{ color: dayData.color }}>{Math.round(dayProgress)}%</span>
            </div>
            <div className="heka-progress__track">
              <div className="heka-progress__fill" style={{ width: `${dayProgress}%`, background: dayData.color }} />
            </div>
          </div>

          {/* Favorable Activities */}
          <div className="heka-section">
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

          {/* Location Footer */}
          <div className="heka-footer">
            <span>📍 {location.name || 'Your Location'}</span>
            <span>{loading ? 'Calculating...' : 'Live Chaldean precision'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const DayOfWeekCard = memo(DayOfWeekCardComponent);
DayOfWeekCard.displayName = 'DayOfWeekCard';
