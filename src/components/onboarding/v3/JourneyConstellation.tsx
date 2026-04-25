/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * JOURNEY CONSTELLATION — Mini-map showing all tutorial steps as stars
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useMemo } from 'react';
import type { TutorialStepId } from './TutorialEngine';

interface JourneyConstellationProps {
  currentStepIndex: number;
  completedSteps: TutorialStepId[];
}

const STEP_NAMES: Record<string, string> = {
  'welcome': '✦',
  'thirteen-months': '13',
  'arc-colors': 'Arc',
  'navigate': 'Nav',
  'day-cells': 'Day',
  'open-day': 'Open',
  'day-panel-moon': 'Moon',
  'day-panel-astrology': 'Stars',
  'day-panel-notes': 'Note',
  'celestial-sun': 'Sun',
  'celestial-moon': 'Luna',
  'celestial-season': 'Season',
  'celestial-agricultural': 'Earth',
  'celestial-clock': 'Time',
  'celestial-dayofweek': 'Hour',
  'feature-print': 'Print',
  'feature-stars': 'Chart',
  'feature-journal': 'Journal',
  'feature-circle': 'Circle',
  'feature-stats': 'Stats',
  'settings-toggles': 'Set',
  'pure-mode': 'Pure',
  'ai-coach': 'AI',
  'tracker': 'Body',
  'community': 'Vote',
  'achievements': 'Badge',
  'first-note': 'Mark',
  'complete': '✦',
};

export const JourneyConstellation: React.FC<JourneyConstellationProps> = ({
  currentStepIndex,
  completedSteps,
}) => {
  const steps = useMemo(() => Object.keys(STEP_NAMES), []);
  const total = steps.length;

  // Arrange steps in a constellation pattern (two arcs)
  const getStarPosition = (index: number) => {
    const isTop = index % 2 === 0;
    const row = Math.floor(index / 2);
    const maxRows = Math.ceil(total / 2);
    const x = ((row + (isTop ? 0 : 0.5)) / maxRows) * 100;
    const y = isTop ? 15 : 75;
    return { x: Math.min(x, 95), y };
  };

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 10002,
      width: 180,
      height: 90,
      background: 'linear-gradient(145deg, rgba(22, 22, 32, 0.9) 0%, rgba(14, 14, 22, 0.95) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: 16,
      padding: '10px 12px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      opacity: currentStepIndex > 0 && currentStepIndex < total - 1 ? 1 : 0,
      transform: currentStepIndex > 0 && currentStepIndex < total - 1 ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      pointerEvents: 'none',
    }}>
      <div style={{
        fontSize: 8,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        marginBottom: 6,
        fontFamily: "'Cinzel', Georgia, serif",
      }}>
        Your Journey
      </div>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Connection lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {steps.map((_, i) => {
            if (i >= total - 1) return null;
            const start = getStarPosition(i);
            const end = getStarPosition(i + 1);
            const isConnected = i < currentStepIndex;
            return (
              <line
                key={i}
                x1={`${start.x}%`}
                y1={`${start.y}%`}
                x2={`${end.x}%`}
                y2={`${end.y}%`}
                stroke={isConnected ? 'rgba(201, 162, 39, 0.4)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={isConnected ? 1.5 : 0.5}
                style={{ transition: 'stroke 0.5s ease' }}
              />
            );
          })}
        </svg>

        {/* Stars */}
        {steps.map((stepId, i) => {
          const pos = getStarPosition(i);
          const isCompleted = completedSteps.includes(stepId as TutorialStepId);
          const isCurrent = i === currentStepIndex;

          return (
            <div
              key={stepId}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                width: isCurrent ? 20 : 14,
                height: isCurrent ? 20 : 14,
                borderRadius: '50%',
                background: isCurrent
                  ? 'linear-gradient(135deg, #c9a227, #e8d179)'
                  : isCompleted
                    ? 'rgba(201, 162, 39, 0.3)'
                    : 'rgba(255, 255, 255, 0.06)',
                border: isCurrent
                  ? '2px solid rgba(212, 175, 55, 0.6)'
                  : isCompleted
                    ? '1px solid rgba(201, 162, 39, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isCurrent ? 8 : 6,
                fontWeight: 700,
                color: isCurrent ? '#0a0910' : isCompleted ? '#c9a227' : 'rgba(255,255,255,0.2)',
                boxShadow: isCurrent
                  ? '0 0 12px rgba(201, 162, 39, 0.5)'
                  : isCompleted
                    ? '0 0 6px rgba(201, 162, 39, 0.2)'
                    : 'none',
                transition: 'all 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
                fontFamily: "'Cinzel', Georgia, serif",
              }}
            >
              {STEP_NAMES[stepId] || '•'}
            </div>
          );
        })}
      </div>
    </div>
  );
};
