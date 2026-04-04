/**
 * Insight Display Component
 * Shows celestial guidance insights with beautiful visualization
 */

import { useState } from 'react';
import type { DiaryInsight } from '../oracle/diaryTypes';
import '../styles/insight-display.css';

// Extended insight type with UI properties
type DisplayInsight = DiaryInsight & {
  archetypes?: string[];
  strengthScore?: number;
  celestialContext?: {
    moonPhase?: string;
    aspects?: string[];
  };
};

interface InsightDisplayProps {
  insight: DisplayInsight;
  onRate?: (rating: 'resonated' | 'neutral' | 'dismissed') => void;
  // onDismiss is reserved for future use
}

export const InsightDisplay: React.FC<InsightDisplayProps> = ({ 
  insight, 
  onRate,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasRated, setHasRated] = useState(false);

  const handleRate = (rating: 'resonated' | 'neutral' | 'dismissed') => {
    setHasRated(true);
    onRate?.(rating);
  };

  // Get strength color
  const getStrengthColor = (score?: number) => {
    if (!score) return '#f97316';
    if (score >= 85) return '#22c55e'; // Green - Strong
    if (score >= 70) return '#eab308'; // Yellow - Moderate
    return '#f97316'; // Orange - Gentle
  };

  // Get strength label
  const getStrengthLabel = (score?: number) => {
    if (!score) return 'Gentle Nudge';
    if (score >= 85) return 'Strong Guidance';
    if (score >= 70) return 'Clear Guidance';
    return 'Gentle Nudge';
  };

  const strengthColor = getStrengthColor(insight.strengthScore);
  const strengthLabel = getStrengthLabel(insight.strengthScore);

  return (
    <div className={`insight-card ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Header */}
      <div className="insight-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="insight-icon">
          <span>✨</span>
        </div>
        <div className="insight-meta">
          <h4 className="insight-title">Celestial Guidance</h4>
          <span className="insight-strength" style={{ color: strengthColor }}>
            {strengthLabel}
          </span>
        </div>
        <div className="insight-toggle">
          {isExpanded ? '▼' : '▶'}
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          <div className="insight-content">
            <p className="insight-text">{insight.text}</p>

            {/* Celestial Context */}
            {insight.celestialContext && (
              <div className="insight-context">
                <h5 className="insight-context-title">☆ Celestial Alignment</h5>
                <div className="insight-context-items">
                  {insight.celestialContext.moonPhase && (
                    <span className="insight-context-item">
                      🌙 {insight.celestialContext.moonPhase}
                    </span>
                  )}
                  {insight.celestialContext.aspects?.map((aspect: string, i: number) => (
                    <span key={i} className="insight-context-item">
                      ⚡ {aspect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Archetype Tags */}
            {insight.archetypes && insight.archetypes.length > 0 && (
              <div className="insight-archetypes">
                {insight.archetypes.map((archetype) => (
                  <span key={archetype} className="insight-tag">
                    {archetype}
                  </span>
                ))}
              </div>
            )}

            {/* Strength Meter */}
            <div className="insight-strength-meter">
              <div className="insight-strength-bar">
                <div 
                  className="insight-strength-fill"
                  style={{ 
                    width: `${insight.strengthScore || 70}%`,
                    background: strengthColor
                  }}
                />
              </div>
              <span className="insight-strength-score">
                {insight.strengthScore || 70}/100
              </span>
            </div>
          </div>

          {/* Actions */}
          {!hasRated ? (
            <div className="insight-actions">
              <span className="insight-actions-label">Did this resonate?</span>
              <div className="insight-rating-buttons">
                <button 
                  className="insight-btn insight-btn-resonated"
                  onClick={() => handleRate('resonated')}
                  title="This spoke to me"
                >
                  💫 Resonated
                </button>
                <button 
                  className="insight-btn insight-btn-neutral"
                  onClick={() => handleRate('neutral')}
                  title="Neutral - neither yes nor no"
                >
                  🤔 Neutral
                </button>
                <button 
                  className="insight-btn insight-btn-dismissed"
                  onClick={() => handleRate('dismissed')}
                  title="Didn't fit"
                >
                  ✕ Dismiss
                </button>
              </div>
            </div>
          ) : (
            <div className="insight-thanks">
              <span>✓ Thank you for your feedback</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InsightDisplay;
