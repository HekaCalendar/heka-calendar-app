/**
 * Moon Phase Section
 * Swiss Ephemeris moon phase display
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { MoonPhaseSectionProps } from './types';

export const MoonPhaseSection = memo(({
  moonData,
  isLoading,
  hemisphere,
}: MoonPhaseSectionProps) => {
  const { t } = useTranslation('dayPanel');

  if (isLoading) {
    return (
      <div className="day-panel__section moon-section">
        <div className="moon-loading">
          <span className="spinner"></span>
          <span>{t('moon.calculating')}</span>
        </div>
      </div>
    );
  }

  if (!moonData) {
    return (
      <div className="day-panel__section moon-section">
        <div className="moon-unavailable">{t('moon.unavailable')}</div>
      </div>
    );
  }

  return (
    <div className="day-panel__section moon-section">
      <div className="moon-display">
        <span className="moon-emoji">{moonData.glyph}</span>
        <div className="moon-info">
          <div className="moon-phase">{moonData.name}</div>
          <div className="moon-details">
            {moonData.waxing ? t('moon.waxing') : t('moon.waning')} • {t('moon.illuminated', { percent: moonData.illumination })}
          </div>
          <div className="moon-age">{t('moon.age', { age: moonData.age })}</div>
          <div className="moon-precision">✨ {t('moon.swissEphemeris')}</div>
        </div>
      </div>
      <div className="moon-hemisphere">
        {hemisphere === 'S' ? `🌏 ${t('moon.southernHemisphere')}` : `🌍 ${t('moon.northernHemisphere')}`}
      </div>
    </div>
  );
});

MoonPhaseSection.displayName = 'MoonPhaseSection';

export default MoonPhaseSection;
