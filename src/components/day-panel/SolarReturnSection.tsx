/**
 * Solar Return Section
 * Displays True Solar Return information for TRUE HEKA mode
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { SolarReturnSectionProps } from './types';

export const SolarReturnSection = memo(({
  isToday,
  isApproaching,
  daysUntil,
  exactDate,
  orb,
  birthSign,
}: SolarReturnSectionProps) => {
  const { t, i18n } = useTranslation('dayPanel');

  if (!isToday && !isApproaching) return null;

  const exactDateStr = exactDate
    ? new Intl.DateTimeFormat(i18n.language || 'en', { month: 'long', day: 'numeric', year: 'numeric' }).format(exactDate)
    : '';

  return (
    <div className="day-panel__section day-panel__solar-return">
      <div className="day-panel__section-title">
        <span>☀️</span>
        {isToday ? t('solarReturn.title') : t('solarReturn.titleInDays', { count: daysUntil, suffix: daysUntil !== 1 ? 's' : '' })}
        <span className="solar-return-mode-badge">{t('solarReturn.trueMode')}</span>
      </div>

      <div className="solar-return-card">
        <div className="solar-return-card__icon">♈</div>
        <div className="solar-return-card__body">
          <div className="solar-return-card__title">
            {isToday
              ? t('solarReturn.today')
              : t('solarReturn.approaching', { sign: birthSign, date: exactDateStr })}
          </div>
          <div className="solar-return-card__detail">
            {t('solarReturn.description')}
            {orb > 0 && (
              <span className="solar-return-orb"> {t('solarReturn.exactOrb', { orb: orb.toFixed(1) })}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SolarReturnSection.displayName = 'SolarReturnSection';

export default SolarReturnSection;
