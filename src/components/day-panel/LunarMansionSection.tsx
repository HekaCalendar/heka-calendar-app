/**
 * Lunar Mansion Section
 * Displays the 27 Lunar Mansions (Nakshatras) for TRUE HEKA mode
 */

import { memo } from 'react';
import type { LunarMansionSectionProps } from './types';

export const LunarMansionSection = memo(({
  mansion,
  isLoading,
}: LunarMansionSectionProps) => {
  if (isLoading) {
    return (
      <div className="day-panel__section day-panel__mansion">
        <div className="day-panel__section-title">
          <span>🌟</span> Lunar Mansion
        </div>
        <div className="day-panel__mansion-loading">
          <span className="spinner"></span>
          <span>Calculating sidereal moon position...</span>
        </div>
      </div>
    );
  }

  if (!mansion) {
    return null;
  }

  const { moonMansion, moonQuarter, sunMansion } = mansion;
  const quarterLabels = [
    'Initiation — the seed is planted',
    'Deepening — roots take hold',
    'Crisis — the test arrives',
    'Completion — the fruit ripens',
  ];
  const quarterLabel = quarterLabels[Math.min(moonQuarter - 1, 3)] || 'Unknown quarter';

  return (
    <div className="day-panel__section day-panel__mansion">
      <div className="day-panel__section-title">
        <span>🌟</span> Lunar Mansion
        <span className="mansion-mode-badge">TRUE Mode</span>
      </div>

      {/* Moon's Mansion — Primary */}
      <div className="mansion-card mansion-card--primary">
        <div className="mansion-card__header">
          <span className="mansion-card__symbol">{moonMansion?.symbol || '?'}</span>
          <div className="mansion-card__title-group">
            <div className="mansion-card__name">{moonMansion.universalName}</div>
            <div className="mansion-card__archetype">{moonMansion.archetype}</div>
          </div>
        </div>

        <div className="mansion-card__theme">{moonMansion.theme}</div>

        <div className="mansion-card__totem">
          <span className="mansion-totem-label">Totem</span>
          <span className="mansion-totem-value">{moonMansion.totem}</span>
        </div>

        <div className="mansion-card__details">
          <div className="mansion-detail">
            <span className="mansion-detail__label">Gift</span>
            <span className="mansion-detail__value">{moonMansion.gift}</span>
          </div>
          <div className="mansion-detail">
            <span className="mansion-detail__label">Ruler</span>
            <span className="mansion-detail__value">{moonMansion.ruler}</span>
          </div>
          <div className="mansion-detail">
            <span className="mansion-detail__label">Quality</span>
            <span className={`mansion-detail__value mansion-quality--${moonMansion.quality}`}>
              {moonMansion.quality}
            </span>
          </div>
          <div className="mansion-detail">
            <span className="mansion-detail__label">Quarter</span>
            <span className="mansion-detail__value">{moonQuarter} — {quarterLabel}</span>
          </div>
        </div>
      </div>

      {/* Sun's Mansion — Secondary */}
      <div className="mansion-card mansion-card--secondary">
        <div className="mansion-card__header">
          <span className="mansion-card__symbol">{sunMansion?.symbol || '?'}</span>
          <div className="mansion-card__title-group">
            <div className="mansion-card__name mansion-card__name--small">Sun travels through {sunMansion.universalName}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

LunarMansionSection.displayName = 'LunarMansionSection';
