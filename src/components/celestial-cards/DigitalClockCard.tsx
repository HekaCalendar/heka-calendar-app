/**
 * Countdowns Card
 * Precise epic counters to HEKA and Gregorian milestones
 */

import { useState, useEffect, useMemo, memo, useRef } from 'react';
import { useGlobalTime } from '../../hooks/useGlobalTime';
import { getHekaYearStart, civilToHeka, getDaysInMonth } from '../../services/calendarService';
import type { LocationData } from '../../types';
import './UnifiedCards.css';

interface Props {
  date: Date;
  location: LocationData;
}

const DigitalClockCardComponent: React.FC<Props> = ({ date, location }) => {
  const [expanded, setExpanded] = useState(false);
  // Live ticking time shared across all cards.
  const liveNow = useGlobalTime();
  const baseTimeRef = useRef(Date.now());

  useEffect(() => {
    baseTimeRef.current = Date.now();
  }, [date]);

  const now = useMemo(() => {
    const elapsed = liveNow.getTime() - baseTimeRef.current;
    return new Date(date.getTime() + elapsed);
  }, [date, liveNow]);

  const counters = useMemo(() => {
    const year = now.getFullYear();
    const heka = civilToHeka(now);
    const hy = heka?.year || year;
    const hekaMonth = heka?.month ?? 0;

    // HEKA New Year
    let hny = getHekaYearStart(hy);
    if (hny <= now) hny = getHekaYearStart(hy + 1);

    // Gregorian New Year
    let gny = new Date(year + 1, 0, 1);
    if (gny <= now) gny = new Date(year + 2, 0, 1);

    // HEKA Month End
    const daysInHekaMonth = getDaysInMonth(hy, hekaMonth);
    const hekaEnd = new Date(now);
    hekaEnd.setDate(hekaEnd.getDate() + (daysInHekaMonth - (heka?.day ?? 1)));
    hekaEnd.setHours(23, 59, 59, 999);

    // Gregorian Month End
    const gregEnd = new Date(year, now.getMonth() + 1, 0, 23, 59, 59, 999);
    if (gregEnd < now) {
      gregEnd.setMonth(gregEnd.getMonth() + 1);
    }

    const diff = (target: Date) => {
      const ms = target.getTime() - now.getTime();
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      return { ms, d, h, m, s };
    };

    return [
      { key: 'heka-year', name: 'HEKA Year', icon: '🌅', target: hny, color: '#fbbf24' },
      { key: 'greg-year', name: 'Gregorian Year', icon: '🎆', target: gny, color: '#818cf8' },
      { key: 'heka-month', name: 'HEKA Month End', icon: '📅', target: hekaEnd, color: '#4ade80' },
      { key: 'greg-month', name: 'Gregorian Month End', icon: '📆', target: gregEnd, color: '#60a5fa' },
    ].map(c => ({ ...c, ...diff(c.target) }));
  }, [now]);

  const urgent = counters.reduce((a, b) => a.ms < b.ms ? a : b);

  return (
    <div className={`heka-card ${expanded ? 'expanded' : ''}`}>
      <div className="heka-card__header heka-card__header--enterprise" onClick={() => setExpanded(!expanded)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); } }}>
        <span className="heka-card__icon">{urgent.icon}</span>
        <div className="heka-card__title-group">
          <span className="heka-card__title">{urgent.name}</span>
          <span className="heka-card__subtitle">
            <span className="heka-chip heka-chip--accent">
              {urgent.d}d {String(urgent.h).padStart(2,'0')}h {String(urgent.m).padStart(2,'0')}m
            </span>
            <span className="heka-chip">4 counters active</span>
          </span>
        </div>
        <div className="heka-ring heka-ring--large">
          <svg viewBox="0 0 36 36">
            <path className="heka-ring__bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="heka-ring__fill" strokeDasharray={`${Math.min(100, Math.max(0, (urgent.ms / 86400000 / 30) * 100))}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ stroke: urgent.color }} />
          </svg>
          <span className="heka-ring__text">NEXT</span>
        </div>
      </div>

      {expanded && (
        <div className="heka-card__content">
          {counters.map((c, i) => (
            <div key={c.key} className="heka-epic-counter" style={{ borderColor: `${c.color}20`, marginBottom: i === counters.length - 1 ? 0 : '12px' }}>
              <div className="heka-epic-counter__digits">
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: c.color }}>{String(c.d).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Days</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: c.color }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: c.color }}>{String(c.h).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Hours</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: c.color }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: c.color }}>{String(c.m).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Mins</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: c.color }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: c.color }}>{String(c.s).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Secs</span>
                </div>
              </div>
              <span className="heka-epic-counter__title" style={{ color: c.color }}>{c.icon} {c.name}</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '6px' }}>
                Ends {c.target.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: c.target.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })}
                {' • '}{c.target.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}

          <div className="heka-footer">
            <span>📍 {location.name}</span>
            <span>Live precision counters</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const DigitalClockCard = memo(DigitalClockCardComponent);
DigitalClockCard.displayName = 'DigitalClockCard';
