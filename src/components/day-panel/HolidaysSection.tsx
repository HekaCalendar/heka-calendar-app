/**
 * Holidays Section
 * Location-based holiday display
 */

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import type { HolidaysSectionProps } from './types';

export const HolidaysSection = memo(({
  holidays,
  locationName,
}: HolidaysSectionProps) => {
  const { t } = useTranslation('dayPanel');

  if (holidays.length === 0) return null;

  return (
    <div className="day-panel__section">
      <div className="day-panel__label">{t('holidays.inLocation', { location: locationName })}</div>
      <div className="holiday-list">
        {holidays.map((holiday, idx) => (
          <div key={idx} className={`holiday-badge holiday-badge--${holiday.type}`}>
            <span className="holiday-name">{holiday.name}</span>
            <span className="holiday-type">{holiday.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

HolidaysSection.displayName = 'HolidaysSection';

export default HolidaysSection;
