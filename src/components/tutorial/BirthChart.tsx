/**
 * Birth Chart - Natal chart visualization
 */
import React from 'react';
import './elite-visuals.css';

export const BirthChart: React.FC = () => {
  const placements = [
    { body: '☉ Sun', sign: 'Aries', house: 'Identity' },
    { body: '☽ Moon', sign: 'Cancer', house: 'Emotions' },
    { body: '↑ Rising', sign: 'Libra', house: 'Appearance' },
  ];

  return (
    <div className="elite-visual birth-chart">
      <div className="bc-container">
        {/* Wheel */}
        <div className="bc-wheel">
          <div className="bc-wheel-inner">
            <div className="bc-center-star">★</div>
            {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((sign, i) => (
              <div 
                key={sign}
                className="bc-zodiac"
                style={{ transform: `rotate(${i * 30}deg) translateY(-55px)` }}
              >
                {sign}
              </div>
            ))}
          </div>
        </div>

        {/* Big Three */}
        <div className="bc-placements">
          {placements.map((p) => (
            <div key={p.body} className="bc-placement">
              <div className="bc-body">{p.body}</div>
              <div className="bc-sign">{p.sign}</div>
              <div className="bc-house">{p.house}</div>
            </div>
          ))}
        </div>

        {/* All 12 Houses */}
        <div className="bc-houses">
          12 Houses • 12 Signs • Your Celestial DNA
        </div>
      </div>
    </div>
  );
};
