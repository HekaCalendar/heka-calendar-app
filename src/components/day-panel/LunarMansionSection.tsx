/**
 * Lunar Mansion Section
 * Displays the 27 Lunar Mansions (Nakshatras) for the active HEKA time mode
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { LunarMansionSectionProps } from './types';

export const LunarMansionSection = memo(({
  mansion,
  isLoading,
  timeMode = 'TRUE',
}: LunarMansionSectionProps) => {
  const { t } = useTranslation('dayPanel');

  const modeLabel = timeMode === 'SYNC'
    ? t('lunarMansion.syncMode')
    : t('lunarMansion.trueMode');

  if (isLoading) {
    return (
      <div className="day-panel__section day-panel__mansion">
        <div className="day-panel__section-title">
          <span>🌟</span> {t('lunarMansion.title')}
        </div>
        <div className="day-panel__mansion-loading">
          <span className="spinner"></span>
          <span>{t('lunarMansion.calculating')}</span>
        </div>
      </div>
    );
  }

  if (!mansion) {
    return null;
  }

  const { moonMansion, moonQuarter, sunMansion } = mansion;
  const quarterLabels = [
    t('lunarMansion.quarters.initiation'),
    t('lunarMansion.quarters.deepening'),
    t('lunarMansion.quarters.crisis'),
    t('lunarMansion.quarters.completion'),
  ];
  const quarterLabel = quarterLabels[Math.min(moonQuarter - 1, 3)] || 'Unknown quarter';

  return (
    <div className="day-panel__section day-panel__mansion">
      <div className="day-panel__section-title">
        <span>🌟</span> {t('lunarMansion.title')}
        <span className="mansion-mode-badge">{modeLabel}</span>
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
          <span className="mansion-totem-label">{t('lunarMansion.totem')}</span>
          <span className="mansion-totem-value">{moonMansion.totem}</span>
        </div>

        <div className="mansion-card__details">
          <div className="mansion-detail">
            <span className="mansion-detail__label">{t('lunarMansion.gift')}</span>
            <span className="mansion-detail__value">{moonMansion.gift}</span>
          </div>
          <div className="mansion-detail">
            <span className="mansion-detail__label">{t('lunarMansion.ruler')}</span>
            <span className="mansion-detail__value">{moonMansion.ruler}</span>
          </div>
          <div className="mansion-detail">
            <span className="mansion-detail__label">{t('lunarMansion.quality')}</span>
            <span className={`mansion-detail__value mansion-quality--${moonMansion.quality}`}>
              {moonMansion.quality}
            </span>
          </div>
          <div className="mansion-detail">
            <span className="mansion-detail__label">{t('lunarMansion.quarter')}</span>
            <span className="mansion-detail__value">{moonQuarter} — {quarterLabel}</span>
          </div>
        </div>
      </div>

      {/* Sun's Mansion — Secondary */}
      <div className="mansion-card mansion-card--secondary">
        <div className="mansion-card__header">
          <span className="mansion-card__symbol">{sunMansion?.symbol || '?'}</span>
          <div className="mansion-card__title-group">
            <div className="mansion-card__name mansion-card__name--small">{t('lunarMansion.sunTravelsThrough', { name: sunMansion.universalName })}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

LunarMansionSection.displayName = 'LunarMansionSection';
