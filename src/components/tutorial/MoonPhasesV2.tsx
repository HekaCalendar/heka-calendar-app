/**
 * Moon Phases V2 - ACCURATE
 */
import React from 'react';
import './elite-visuals.css';

export const MoonPhasesV2: React.FC = () => {
  const phases = [
    { icon: '🌑', name: 'New Moon', desc: 'Beginnings' },
    { icon: '🌒', name: 'Waxing Crescent', desc: 'Growth' },
    { icon: '🌓', name: 'First Quarter', desc: 'Action' },
    { icon: '🌔', name: 'Waxing Gibbous', desc: 'Refinement' },
    { icon: '🌕', name: 'Full Moon', desc: 'Completion' },
    { icon: '🌖', name: 'Waning Gibbous', desc: 'Release' },
    { icon: '🌗', name: 'Last Quarter', desc: 'Reflection' },
    { icon: '🌘', name: 'Waning Crescent', desc: 'Rest' },
  ];

  return (
    <div className="elite-visual moon-phases-v2">
      <div className="v2-moon-container">
        <div className="v2-moon-header">
          <h3 className="v2-moon-title">Lunar Cycle</h3>
          <p className="v2-moon-subtitle">29.5 days • 8 phases</p>
        </div>
        
        <div className="v2-phases-ring">
          {phases.map((phase, i) => (
            <div 
              key={phase.name}
              className="v2-phase-item"
              style={{ transform: `rotate(${i * 45}deg) translateX(100px) rotate(-${i * 45}deg)` }}
            >
              <div className="v2-phase-icon">{phase.icon}</div>
              <div className="v2-phase-name">{phase.name}</div>
            </div>
          ))}
          <div className="v2-earth-center">🌍</div>
        </div>
        
        <div className="v2-moon-features">
          <div className="v2-moon-feature">✓ Daily phase indicators</div>
          <div className="v2-moon-feature">✓ Illumination percentage</div>
          <div className="v2-moon-feature">✓ Moonrise & moonset times</div>
        </div>
      </div>
    </div>
  );
};
