/**
 * Moon Phase Section
 * Swiss Ephemeris moon phase display
 */

import { memo } from 'react';
import type { MoonPhaseSectionProps } from './types';

export const MoonPhaseSection = memo(({
  moonData,
  isLoading,
  hemisphere,
}: MoonPhaseSectionProps) => {
  if (isLoading) {
    return (
      <div className="day-panel__section moon-section">
        <div className="moon-loading">
          <span className="spinner"></span>
          <span>Calculating lunar position...</span>
        </div>
      </div>
    );
  }

  if (!moonData) {
    return (
      <div className="day-panel__section moon-section">
        <div className="moon-unavailable">Moon phase data unavailable</div>
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
            {moonData.waxing ? 'Waxing' : 'Waning'} • {moonData.illumination}% illuminated
          </div>
          <div className="moon-age">Age: {moonData.age} days</div>
          <div className="moon-precision">✨ Swiss Ephemeris</div>
        </div>
      </div>
      <div className="moon-hemisphere">
        {hemisphere === 'S' ? '🌏 Southern Hemisphere' : '🌍 Northern Hemisphere'}
      </div>
    </div>
  );
});

MoonPhaseSection.displayName = 'MoonPhaseSection';

export default MoonPhaseSection;
