/**
 * Moon Planning - Lunar cycle phases for planning
 */
import React from 'react';
import './elite-visuals.css';

export const MoonPlanning: React.FC = () => {
  const phases = [
    { icon: '🌑', name: 'New Moon', action: 'Set Intentions', desc: 'Begin fresh' },
    { icon: '🌒', name: 'Waxing', action: 'Build Momentum', desc: 'Take action' },
    { icon: '🌕', name: 'Full Moon', action: 'Execute', desc: 'Peak power' },
    { icon: '🌘', name: 'Waning', action: 'Release', desc: 'Let go' },
  ];

  return (
    <div className="elite-visual moon-planning">
      <div className="mp-container">
        {/* Phase Cards */}
        <div className="mp-phases">
          {phases.map((phase) => (
            <div key={phase.name} className="mp-phase">
              <div className="mp-phase-icon">{phase.icon}</div>
              <div className="mp-phase-name">{phase.name}</div>
              <div className="mp-phase-action">{phase.action}</div>
              <div className="mp-phase-desc">{phase.desc}</div>
            </div>
          ))}
        </div>

        {/* Pattern Recognition */}
        <div className="mp-pattern">
          <div className="mp-pattern-title">
            <span>🔄</span> Pattern Recognition
          </div>
          <div className="mp-pattern-text">
            Track your energy, mood, and productivity across lunar cycles. Discover your optimal rhythms.
          </div>
        </div>

        {/* Cycle Length */}
        <div className="mp-cycle">
          <span className="mp-cycle-icon">⏱️</span>
          <span>29.5 days per cycle • 13 cycles per year</span>
        </div>
      </div>
    </div>
  );
};
