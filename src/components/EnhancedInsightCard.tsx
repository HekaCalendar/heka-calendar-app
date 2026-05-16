/**
 * Enhanced Insight Card Component
 * 
 * Rich, interactive display for the new enhanced insights including:
 * - Crisis support resources (when needed)
 * - Visual strength indicators
 * - Birth chart connections
 * - Actionable rituals & affirmations
 * - Expandable sections
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { EnhancedInsight } from '../oracle/enhancedInsightEngine';
import './EnhancedInsightCard.css';

interface EnhancedInsightCardProps {
  insight: EnhancedInsight;
  onSave?: () => void;
  onDismiss?: () => void;
  onShare?: () => void;
  isLoading?: boolean;
}

export const EnhancedInsightCard: React.FC<EnhancedInsightCardProps> = ({
  insight,
  onSave,
  onDismiss,
  onShare,
  isLoading = false
}) => {
  const { t } = useTranslation('journal');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showCrisisResources, setShowCrisisResources] = useState(true);
  
  if (isLoading) {
    return (
      <div className="enhanced-insight-card loading">
        <div className="insight-loading-orb">
          <div className="loading-ring"></div>
          <div className="loading-core">✨</div>
        </div>
        <p>{t('insight.consulting')}</p>
        <span className="loading-dots">...</span>
      </div>
    );
  }
  
  const isCrisis = insight.type === 'crisis';
  
  return (
    <div 
      className={`enhanced-insight-card ${insight.type} ${isCrisis ? 'crisis-mode' : ''}`}
      style={{ 
        '--insight-accent': insight.visualTheme.color,
        '--insight-gradient': insight.visualTheme.gradient 
      } as React.CSSProperties}
    >
      {/* Crisis Banner */}
      {isCrisis && insight.supportResources && (
        <div className="crisis-banner">
          <div className="crisis-header">
            <span className="crisis-icon">🆘</span>
            <span className="crisis-title">{t('insight.supportResources')}</span>
          </div>
          
          {showCrisisResources && (
            <div className="crisis-resources">
              <p className="crisis-message">{insight.supportResources.message}</p>
              <div className="resource-list">
                {insight.supportResources.resources.map((resource, idx) => (
                  <div key={idx} className="resource-item">
                    <span className="resource-name">{resource.name}</span>
                    <span className="resource-contact">{resource.contact}</span>
                    <span className="resource-hours">{resource.available}</span>
                  </div>
                ))}
              </div>
              <button 
                className="crisis-dismiss-btn"
                onClick={() => setShowCrisisResources(false)}
              >
                {t('insight.haveResources')}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Insight Header */}
      <div className="insight-header">
        <div className="insight-icon-wrapper" style={{ background: insight.visualTheme.gradient }}>
          <span className="insight-icon">{insight.visualTheme.icon}</span>
        </div>
        <div className="insight-meta">
          <span className="insight-type">{insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}</span>
          {insight.aiEnhanced && (
            <span className="ai-badge">{t('insight.aiEnhanced')}</span>
          )}
        </div>
        <div className="insight-strength">
          <span className="strength-label">{t('insight.strength')}</span>
          <div className="strength-bar">
            <div 
              className="strength-fill" 
              style={{ width: `${insight.strength}%` }}
            />
          </div>
          <span className="strength-value">{insight.strength}%</span>
        </div>
      </div>
      
      {/* Main Insight Text */}
      <div className="insight-content">
        {insight.poeticSummary && (
          <p className="poetic-summary">{insight.poeticSummary}</p>
        )}
        <p className="insight-text">{insight.text}</p>
      </div>
      
      {/* Celestial Context */}
      <div className="celestial-context">
        <div className="context-badge">
          <span className="context-icon">🌙</span>
          <span className="context-text">{insight.celestialEvent.description}</span>
        </div>
        {insight.celestialEvent.timing && (
          <div className="timing-badge">
            <span className="timing-icon">⏰</span>
            <span className="timing-text">{insight.celestialEvent.timing.duration}</span>
          </div>
        )}
      </div>
      
      {/* Birth Chart Connection */}
      {insight.birthChartConnection && (
        <div className="birth-chart-connection">
          <h4 className="connection-title">{t('insight.birthChartConnection')}</h4>
          <div className="connection-details">
            <div className="connection-item">
              <span className="connection-label">{t('insight.transit')}</span>
              <span className="connection-value">{insight.birthChartConnection.interpretation}</span>
            </div>
            <div className="connection-item">
              <span className="connection-label">{t('insight.activates')}</span>
              <span className="connection-value">{t('insight.houseValue', { house: insight.birthChartConnection.activatedHouse })}</span>
            </div>
            <div className="connection-item">
              <span className="connection-label">{t('insight.natalPosition')}</span>
              <span className="connection-value">{insight.birthChartConnection.natalPosition}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Expandable Sections */}
      <div className="insight-sections">
        {/* Affirmations */}
        {insight.affirmations.length > 0 && (
          <div className={`section ${expandedSection === 'affirmations' ? 'expanded' : ''}`}>
            <button 
              className="section-toggle"
              onClick={() => setExpandedSection(expandedSection === 'affirmations' ? null : 'affirmations')}
            >
              <span className="section-icon">💫</span>
              <span className="section-name">{t('insight.affirmations', { count: insight.affirmations.length })}</span>
              <span className="section-arrow">{expandedSection === 'affirmations' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'affirmations' && (
              <div className="section-content">
                {insight.affirmations.map((affirmation, idx) => (
                  <div key={idx} className="affirmation-item">
                    <span className="affirmation-icon">✦</span>
                    <span className="affirmation-text">{affirmation}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Rituals */}
        {insight.rituals.length > 0 && (
          <div className={`section ${expandedSection === 'rituals' ? 'expanded' : ''}`}>
            <button 
              className="section-toggle"
              onClick={() => setExpandedSection(expandedSection === 'rituals' ? null : 'rituals')}
            >
              <span className="section-icon">🕯️</span>
              <span className="section-name">{t('insight.rituals', { count: insight.rituals.length })}</span>
              <span className="section-arrow">{expandedSection === 'rituals' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'rituals' && (
              <div className="section-content">
                {insight.rituals.map((ritual, idx) => (
                  <div key={idx} className="ritual-item">
                    <span className="ritual-number">{idx + 1}</span>
                    <span className="ritual-text">{ritual}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Journal Prompts */}
        {insight.journalPrompts.length > 0 && (
          <div className={`section ${expandedSection === 'prompts' ? 'expanded' : ''}`}>
            <button 
              className="section-toggle"
              onClick={() => setExpandedSection(expandedSection === 'prompts' ? null : 'prompts')}
            >
              <span className="section-icon">📝</span>
              <span className="section-name">{t('insight.journalPrompts', { count: insight.journalPrompts.length })}</span>
              <span className="section-arrow">{expandedSection === 'prompts' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'prompts' && (
              <div className="section-content">
                {insight.journalPrompts.map((prompt, idx) => (
                  <div key={idx} className="prompt-item">
                    <span className="prompt-icon">◆</span>
                    <span className="prompt-text">{prompt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Action Items */}
        {insight.actionItems.length > 0 && (
          <div className={`section ${expandedSection === 'actions' ? 'expanded' : ''}`}>
            <button 
              className="section-toggle"
              onClick={() => setExpandedSection(expandedSection === 'actions' ? null : 'actions')}
            >
              <span className="section-icon">⚡</span>
              <span className="section-name">{t('insight.actionItems', { count: insight.actionItems.length })}</span>
              <span className="section-arrow">{expandedSection === 'actions' ? '▼' : '▶'}</span>
            </button>
            {expandedSection === 'actions' && (
              <div className="section-content">
                {insight.actionItems.map((action, idx) => (
                  <div key={idx} className="action-item">
                    <input type="checkbox" id={`action-${idx}`} className="action-checkbox" />
                    <label htmlFor={`action-${idx}`} className="action-text">{action}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Insight Footer */}
      <div className="insight-footer">
        <div className="insight-confidence">
          <span className="confidence-label">{t('insight.confidence')}</span>
          <span className="confidence-value">{insight.confidence}%</span>
          {insight.uniqueness > 70 && (
            <span className="uniqueness-badge">{t('insight.highlyPersonal')}</span>
          )}
        </div>
        <div className="insight-actions">
          {onSave && (
            <button className="insight-btn save" onClick={onSave} title="Save Insight">
              {t('insight.save')}
            </button>
          )}
          {onShare && (
            <button className="insight-btn share" onClick={onShare} title="Share">
              {t('insight.share')}
            </button>
          )}
          {onDismiss && (
            <button className="insight-btn dismiss" onClick={onDismiss} title="Dismiss">
              {t('insight.dismiss')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedInsightCard;
