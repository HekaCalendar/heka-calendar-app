/**
 * Solar Return Section
 * Displays True Solar Return information for TRUE HEKA mode
 */

import { memo } from 'react';
import type { SolarReturnSectionProps } from './types';

export const SolarReturnSection = memo(({
  isToday,
  isApproaching,
  daysUntil,
  exactDate,
  orb,
  birthSign,
}: SolarReturnSectionProps) => {
  if (!isToday && !isApproaching) return null;

  const exactDateStr = exactDate
    ? exactDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className="day-panel__section day-panel__solar-return">
      <div className="day-panel__section-title">
        <span>☀️</span>
        {isToday ? 'True Solar Return' : `True Solar Return in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
        <span className="solar-return-mode-badge">TRUE Mode</span>
      </div>

      <div className="solar-return-card">
        <div className="solar-return-card__icon">♈</div>
        <div className="solar-return-card__body">
          <div className="solar-return-card__title">
            {isToday
              ? 'The Sun returns to your sidereal birth longitude today.'
              : `The Sun will return to your sidereal ${birthSign} position on ${exactDateStr}.`}
          </div>
          <div className="solar-return-card__detail">
            In TRUE HEKA mode, your birthday is determined by the stars, not the civil calendar.
            {orb > 0 && (
              <span className="solar-return-orb"> Exact to within {orb.toFixed(1)} arcminutes.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SolarReturnSection.displayName = 'SolarReturnSection';
