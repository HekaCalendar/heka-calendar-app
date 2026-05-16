/**
 * Agricultural Card
 * Season status, planting guidance, and solstice/equinox planting windows
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { LocationData } from '../../types';
import { getAgriculturalGuidance } from '../../services/agriculturalService';
import { getMoonPhase, getNextSeasonalEvent } from '../../services/astronomyService';
import './UnifiedCards.css';

interface Props {
  date: Date;
  location: LocationData;
}

const ACTION_ICONS: Record<string, string> = {
  plant: '🌱', sow: '🌰', transplant: '🪴', harvest: '🧺',
  prepare: '📝', maintain: '🔧', apply: '🍂', rest: '☕'
};

const URGENCY_COLORS: Record<string, string> = {
  now: '#22c55e', soon: '#f59e0b', window: '#3b82f6'
};

const AgriculturalCardComponent: React.FC<Props> = ({ date, location }) => {
  const [guidance, setGuidance] = useState<ReturnType<typeof getAgriculturalGuidance> | null>(null);
  const [nextEvent, setNextEvent] = useState<ReturnType<typeof getNextSeasonalEvent>>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());
  const { t } = useTranslation(['celestial', 'common']);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    setLoading(true);
    const moon = getMoonPhase(date, location.latitude >= 0 ? 'N' : 'S');
    setGuidance(getAgriculturalGuidance(date, location, moon.age));
    setNextEvent(getNextSeasonalEvent(date, location.latitude >= 0 ? 'N' : 'S'));
    setLoading(false);
  }, [date, location]);

  const eventCounter = useMemo(() => {
    if (!nextEvent) return null;
    const ms = nextEvent.date.getTime() - now.getTime();
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return { d, h, m, s, ms };
  }, [nextEvent, now]);

  const plantingContext = useMemo(() => {
    if (!nextEvent) return '';
    switch (nextEvent.type) {
      case 'vernal-equinox': return 'Spring planting window opens';
      case 'summer-solstice': return 'Shift to heat-tolerant crops';
      case 'autumnal-equinox': return 'Harvest season begins';
      case 'winter-solstice': return 'Plan and prepare for spring';
      default: return 'Seasonal transition approaching';
    }
  }, [nextEvent]);

  if (loading || !guidance) {
    return (
      <div className="heka-card heka-card--loading">
        <div className="heka-card__header">
          <span className="heka-card__icon">🌾</span>
          <div className="heka-card__title-group">
            <span className="heka-card__title">{t('common:loading')}</span>
            <span className="heka-card__subtitle">{t('celestial:agriculturalGuidance')}</span>
          </div>
        </div>
      </div>
    );
  }

  const topPlants = guidance.recommendations
    .filter(r => r.urgency === 'now')
    .slice(0, 2)
    .map(r => `${r.icon} ${r.plant}`)
    .join(' • ');

  const seasonProgress = guidance.isGrowingSeason
    ? (guidance.daysLeftInSeason / (guidance.daysLeftInSeason + guidance.daysUntilSeason)) * 100
    : 0;

  const growingNow = guidance.recommendations.filter(r => r.urgency === 'now');
  const growingSoon = guidance.recommendations.filter(r => r.urgency === 'soon');

  return (
    <div className={`heka-card ${expanded ? 'expanded' : ''}`}>
      <div className="heka-card__header heka-card__header--enterprise" onClick={() => setExpanded(!expanded)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(!expanded); } }}>
        <span className="heka-card__icon">🌾</span>
        <div className="heka-card__title-group">
          <span className="heka-card__title">
            {topPlants || (guidance.isGrowingSeason ? 'Maintenance' : 'Winter Planning')}
          </span>
          <span className="heka-card__subtitle">
            <span className={`heka-chip ${guidance.isGrowingSeason ? 'heka-chip--green' : 'heka-chip--blue'}`}>
              {guidance.isGrowingSeason ? `🌱 ${guidance.daysLeftInSeason} days left` : `❄️ ${guidance.daysUntilSeason} days until season`}
            </span>
            <span className="heka-chip">{guidance.climateZone}</span>
          </span>
        </div>
        <div className="heka-ring heka-ring--large">
          <svg viewBox="0 0 36 36">
            <path className="heka-ring__bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="heka-ring__fill" strokeDasharray={`${seasonProgress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ stroke: guidance.isGrowingSeason ? '#22c55e' : '#60a5fa' }} />
          </svg>
          <span className="heka-ring__text">{guidance.isGrowingSeason ? '🌱' : '❄️'}</span>
        </div>
      </div>

      {expanded && (
        <div className="heka-card__content">
          {/* Equinox / Solstice Epic Counter */}
          {eventCounter && nextEvent && (
            <div className="heka-epic-counter" style={{ borderColor: guidance.isGrowingSeason ? 'rgba(34,197,94,0.15)' : 'rgba(96,165,250,0.15)' }}>
              <div className="heka-epic-counter__digits">
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: guidance.isGrowingSeason ? '#4ade80' : '#93c5fd' }}>{String(eventCounter.d).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Days</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: guidance.isGrowingSeason ? '#4ade80' : '#93c5fd' }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: guidance.isGrowingSeason ? '#4ade80' : '#93c5fd' }}>{String(eventCounter.h).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Hours</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: guidance.isGrowingSeason ? '#4ade80' : '#93c5fd' }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: guidance.isGrowingSeason ? '#4ade80' : '#93c5fd' }}>{String(eventCounter.m).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Mins</span>
                </div>
                <span className="heka-epic-counter__separator" style={{ color: guidance.isGrowingSeason ? '#4ade80' : '#93c5fd' }}>:</span>
                <div className="heka-epic-counter__segment">
                  <span className="heka-epic-counter__number" style={{ color: guidance.isGrowingSeason ? '#4ade80' : '#93c5fd' }}>{String(eventCounter.s).padStart(2,'0')}</span>
                  <span className="heka-epic-counter__label">Secs</span>
                </div>
              </div>
              <span className="heka-epic-counter__title" style={{ color: guidance.isGrowingSeason ? '#4ade80' : '#93c5fd' }}>
                Until {nextEvent.name}
              </span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
                {plantingContext}
              </span>
            </div>
          )}

          {/* Season mini status */}
          <div className="heka-data-grid heka-data-grid--2">
            <div className="heka-data-cell" style={{ borderColor: guidance.isGrowingSeason ? '#22c55e30' : '#60a5fa30' }}>
              <span className="heka-data-cell__label">Season</span>
              <span className="heka-data-cell__value" style={{ color: guidance.isGrowingSeason ? '#4ade80' : '#93c5fd' }}>
                {guidance.isGrowingSeason ? 'Growing' : 'Dormant'}
              </span>
            </div>
            <div className="heka-data-cell">
              <span className="heka-data-cell__label">Hemisphere</span>
              <span className="heka-data-cell__value">{guidance.hemisphere}</span>
            </div>
          </div>

          {/* Plant Now */}
          {growingNow.length > 0 && (
            <div className="heka-section">
              <div className="heka-section__title">🌱 Plant Now</div>
              <div className="heka-list">
                {growingNow.slice(0, 4).map((rec, i) => (
                  <div key={i} className="heka-list__item" style={{
                    borderLeft: `2px solid ${URGENCY_COLORS.now}`,
                    marginLeft: '0', paddingLeft: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{rec.icon} <strong>{rec.plant}</strong> — {ACTION_ICONS[rec.action] || '🌱'} {rec.action}</span>
                      <span style={{
                        fontSize: '10px', padding: '3px 8px', borderRadius: '10px', textTransform: 'uppercase',
                        background: `${URGENCY_COLORS.now}20`, color: URGENCY_COLORS.now
                      }}>now</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                      {rec.daysToHarvest} to harvest • {rec.difficulty}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coming Soon */}
          {growingSoon.length > 0 && (
            <div className="heka-section">
              <div className="heka-section__title">⏳ Coming Soon</div>
              <div className="heka-list">
                {growingSoon.slice(0, 3).map((rec, i) => (
                  <div key={i} className="heka-list__item" style={{
                    borderLeft: `2px solid ${URGENCY_COLORS.soon}`,
                    marginLeft: '0', paddingLeft: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{rec.icon} <strong>{rec.plant}</strong> — {ACTION_ICONS[rec.action] || '🌱'} {rec.action}</span>
                      <span style={{
                        fontSize: '10px', padding: '3px 8px', borderRadius: '10px', textTransform: 'uppercase',
                        background: `${URGENCY_COLORS.soon}20`, color: URGENCY_COLORS.soon
                      }}>soon</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Avoid */}
          {guidance.avoid.length > 0 && (
            <div className="heka-section">
              <div className="heka-section__title">⚠️ Avoid</div>
              <div className="heka-tags">
                {guidance.avoid.map((item, i) => (
                  <span key={i} className="heka-tag" style={{ borderColor: '#ef444430', color: '#fca5a5' }}>{item}</span>
                ))}
              </div>
            </div>
          )}

          {/* Moon Guidance */}
          <div className="heka-section">
            <div className="heka-section__title">🌙 Moon Guidance</div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', margin: 0 }}>
              {guidance.moonPhaseAdvice}
            </p>
          </div>

          <div className="heka-footer">
            <span>📍 {location.name}</span>
            <span>{guidance.hemisphere} Hemisphere</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const AgriculturalCard = memo(AgriculturalCardComponent);
AgriculturalCard.displayName = 'AgriculturalCard';
