/**
 * Personal Transits - Transit tracking
 */
import React from 'react';
import './elite-visuals.css';

export const PersonalTransits: React.FC = () => {
  const transits = [
    { planet: '🪐 Saturn', aspect: 'trine', your: '☉ Sun', advice: 'Build foundations' },
    { planet: '☽ Moon', aspect: 'conjunct', your: '♃ Jupiter', advice: 'Expand emotions' },
    { planet: '☿ Mercury', aspect: 'square', your: '♂ Mars', advice: 'Think before acting' },
  ];

  return (
    <div className="elite-visual personal-transits">
      <div className="pt-container">
        {/* Header */}
        <div className="pt-header">
          <span>Today: April 15, 2026</span>
          <span className="pt-live">● LIVE</span>
        </div>

        {/* Transits */}
        <div className="pt-transits">
          {transits.map((t, i) => (
            <div key={i} className="pt-transit">
              <div className="pt-planet">{t.planet}</div>
              <div className="pt-aspect">{t.aspect}</div>
              <div className="pt-your">{t.your}</div>
              <div className="pt-advice">{t.advice}</div>
            </div>
          ))}
        </div>

        {/* Guidance */}
        <div className="pt-guidance">
          <div className="pt-guidance-title">Daily Guidance</div>
          <div className="pt-guidance-text">
            Know when to act, when to wait, when to celebrate. Real celestial mechanics, personalized.
          </div>
        </div>
      </div>
    </div>
  );
};
