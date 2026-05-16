/**
 * Season Card
 * Current astronomical season with epic time-left counter
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { getSeasonData, getDaysInSeason } from '../../services/seasonService';
import { getNextSeasonalEvent } from '../../services/astronomyService';
import type { LocationData } from '../../types';
import './UnifiedCards.css';

interface Props {
  date: Date;
  location: LocationData;
}

const SeasonCardComponent: React.FC<Props> = ({ date, location }) => {
  const [season, setSeason] = useState<ReturnType<typeof getSeasonData> | null>(null);
  const [info, setInfo] = useState<ReturnType<typeof getDaysInSeason> | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [nextEvent, setNextEvent] = useState<ReturnType<typeof getNextSeasonalEvent>>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    setSeason(getSeasonData(date, location.latitude));
    setInfo(getDaysInSeason(date, location.latitude));
    setNextEvent(getNextSeasonalEvent(date, location.latitude >= 0 ? 'N' : 'S'));
  }, [date, location.latitude]);

  const timeLeft = useMemo(() => {
    if (!nextEvent) return null;
    const ms = nextEvent.date.getTime() - now.getTime();
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return { d, h, m, s, ms };
  }, [nextEvent, now]);

  if (!season || !info) {
    return (
      <div className="heka-card heka-card--loading">
        <div className="heka-card__header">
          <span className="heka-card__icon">🌍</span>
          <div className="heka-card__title-group">
            <span className="heka-card__title">Loading...</span>
            <span className="heka-card__subtitle">Season data</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`heka-card ${expanded ? 'expanded' : ''}`}>
      <div className="heka-card__header heka-card__header--enterprise" onClick={() => setExpanded(!expanded)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); } }}>
        <span className="heka-card__icon">{season.emoji}</span>
        <div className="heka-card__title-group">
          <span className="heka-card__title">{season.name}</span>
          <span className="heka-card__subtitle">
            <span className="heka-chip heka-chip--accent">
              {timeLeft ? `${String(timeLeft.d).padStart(2,'0')}d ${String(timeLeft.h).padStart(2,'0')}h ${String(timeLeft.m).padStart(2,'0')}m left` : 'Calculating...'}
            </span>
            <span className="heka-chip">{info.percentComplete}% through</span>
          </span>
        </div>
        <div className="heka-ring heka-ring--large">
          <svg viewBox="0 0 36 36">
            <path className="heka-ring__bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="heka-ring__fill" strokeDasharray={`${info.percentComplete}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ stroke: season.colors[0] }} />
          </svg>
          <span className="heka-ring__text">{info.percentComplete}%</span>
        </div>
      </div>

      {expanded && (
        <div className="heka-card__content">
          {/* Epic Time Left Counter */}
          {timeLeft && (
            <div className="heka-epic-counter" style={{ borderColor: `${season.colors[0]}20` }}>
              <div className="heka-epic-counter__digits">
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: season.colors[0] }}>{String(timeLeft.d).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Days</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: season.colors[0] }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: season.colors[0] }}>{String(timeLeft.h).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Hours</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: season.colors[0] }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: season.colors[0] }}>{String(timeLeft.m).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Mins</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: season.colors[0] }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: season.colors[0] }}>{String(timeLeft.s).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Secs</span>
                </div>
              </div>
              <span className="heka-epic-counter__title" style={{ color: season.colors[0] }}>
                Until {nextEvent?.name}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
                {nextEvent?.date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}

          {/* Season Progress Bar */}
          <div className="heka-progress">
            <div className="heka-progress__labels">
              <span>Season Progress</span>
              <span style={{ color: season.colors[0] }}>{info.percentComplete}%</span>
            </div>
            <div className="heka-progress__track">
              <div className="heka-progress__fill" style={{ width: `${info.percentComplete}%`, background: season.colors[0] }} />
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', textAlign: 'right' }}>
              {info.daysRemaining} days remaining in {season.name}
            </div>
          </div>

          {/* Element & Energy */}
          <div className="heka-section" style={{ marginTop: '12px' }}>
            <div className="heka-section__title">⚡ {season.element} Element</div>
            <div className="heka-data-grid heka-data-grid--2">
              <div className="heka-data-cell">
                <span className="heka-data-cell__label">Energy</span>
                <span className="heka-data-cell__value">{season.psychology.energy}</span>
              </div>
              <div className="heka-data-cell">
                <span className="heka-data-cell__label">Mood</span>
                <span className="heka-data-cell__value">{season.psychology.mood}</span>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="heka-section">
            <div className="heka-section__title">✨ Characteristics</div>
            <div className="heka-tags">
              {season.characteristics.slice(0, 6).map((c, i) => (
                <span key={i} className="heka-tag" style={{ borderColor: `${season.colors[i % season.colors.length]}40` }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SeasonCard = memo(SeasonCardComponent);
SeasonCard.displayName = 'SeasonCard';
