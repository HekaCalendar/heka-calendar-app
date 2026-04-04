/**
 * Moon Phases Demo
 * Shows lunar cycle visualization
 */
import React from 'react';
import './elite-visuals.css';

export const MoonPhasesDemo: React.FC = () => {
  const phases = [
    { name: 'New Moon', icon: '🌑', desc: 'Beginnings' },
    { name: 'Waxing Crescent', icon: '🌒', desc: 'Growth' },
    { name: 'First Quarter', icon: '🌓', desc: 'Action' },
    { name: 'Waxing Gibbous', icon: '🌔', desc: 'Refinement' },
    { name: 'Full Moon', icon: '🌕', desc: 'Completion' },
    { name: 'Waning Gibbous', icon: '🌖', desc: 'Release' },
    { name: 'Last Quarter', icon: '🌗', desc: 'Reflection' },
    { name: 'Waning Crescent', icon: '🌘', desc: 'Rest' },
  ];

  return (
    <div className="elite-visual moon-phases-demo">
      <div className="moon-container">
        <div className="moon-title">Lunar Cycle</div>
        <div className="moon-subtitle">29.5 days • 8 phases</div>
        
        <div className="phases-orbit">
          {phases.map((phase, i) => (
            <div 
              key={phase.name}
              className="phase-node"
              style={{ 
                transform: `rotate(${i * 45}deg) translateX(120px) rotate(-${i * 45}deg)` 
              }}
            >
              <div className="phase-icon">{phase.icon}</div>
              <div className="phase-name">{phase.name}</div>
              <div className="phase-desc">{phase.desc}</div>
            </div>
          ))}
          
          {/* Center Earth */}
          <div className="earth-center">🌍</div>
        </div>
        
        <div className="moon-features">
          <div className="moon-feature">
            <span className="feature-check">✓</span>
            Daily phase indicators
          </div>
          <div className="moon-feature">
            <span className="feature-check">✓</span>
            Illumination percentage
          </div>
          <div className="moon-feature">
            <span className="feature-check">✓</span>
            Moonrise & moonset times
          </div>
        </div>
      </div>
    </div>
  );
};
