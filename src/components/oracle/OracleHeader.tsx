import React from 'react';
import type { CelestialState } from './types';

import { getMoonEmoji } from './utils';

interface OracleHeaderProps {
  onClose: () => void;
  celestial: CelestialState;
  hasBirthChart: boolean;
  effectiveProfile: { name: string | null } | null;
  personalTransitsCount: number;
  activeTransitsCount: number;
}

export const OracleHeader: React.FC<OracleHeaderProps> = ({
  onClose,
  celestial,
  hasBirthChart,
  effectiveProfile,
  personalTransitsCount,
  activeTransitsCount,
}) => {

  return (
    <div className="oracle-header-mast">
        {/* Back Button */}
        <button className="back-btn" onClick={onClose} title="Back to Calendar">
          <span>←</span>
          <span className="back-label">Back</span>
        </button>
        
        <div className="oracle-logo">
          <span className="oracle-logo-icon">
            {celestial.loading ? '✨' : getMoonEmoji(celestial.moonPhase.phase)}
          </span>
          <div className="oracle-logo-text">
            <h1>The Oracle Journal</h1>
            <span className="oracle-logo-subtitle">
              {hasBirthChart && effectiveProfile
                ? `✦ ${effectiveProfile.name}'s Celestial Guide`
                : '🌟 General celestial guidance'}
            </span>
          </div>
        </div>
        
        <div className="oracle-celestial-status">
          <div className="celestial-bubble" title="Moon Phase">
            <span className="celestial-icon">🌙</span>
            <span className="celestial-value">
              {celestial.moonPhase.sign} {Math.round(celestial.moonPhase.illumination)}%
            </span>
          </div>
          {celestial.retrogrades.length > 0 && (
            <div className="celestial-bubble retrograde">
              <span className="celestial-icon">℞</span>
              <span className="celestial-value">{celestial.retrogrades.length}</span>
            </div>
          )}
          {personalTransitsCount > 0 && (
            <div className="celestial-bubble transits">
              <span className="celestial-icon">✦</span>
              <span className="celestial-value">{activeTransitsCount}</span>
            </div>
          )}
        </div>
      </div>
  );
};
