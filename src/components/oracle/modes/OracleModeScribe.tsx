import React from 'react';
import { JOURNAL_FONTS } from '../../../oracle/diaryTypes';
import type { EnhancedInsight } from '../../../oracle/enhancedInsightEngine';
import { EnhancedInsightCard } from '../../EnhancedInsightCard';
import { PAPER_THEMES } from '../config/themes';

interface OracleModeScribeProps {
  editingEntryId: string | null;
  scribeContent: string;
  setScribeContent: (content: string) => void;
  paperTheme: string;
  showPaperThemeSelector: boolean;
  setShowPaperThemeSelector: (show: boolean) => void;
  onPaperThemeChange: (themeId: string) => void;
  generatedInsight: EnhancedInsight | null;
  onDismissInsight: () => void;
  isGeneratingInsight: boolean;
  onGenerateInsight: () => void;
  onSave: () => void;
  onCancel: () => void;
  formatCurrentDate: () => string;
  preferences: { font?: string };
}

export const OracleModeScribe: React.FC<OracleModeScribeProps> = ({
  editingEntryId,
  scribeContent,
  setScribeContent,
  paperTheme,
  showPaperThemeSelector,
  setShowPaperThemeSelector,
  onPaperThemeChange,
  generatedInsight,
  onDismissInsight,
  isGeneratingInsight,
  onGenerateInsight,
  onSave,
  onCancel,
  formatCurrentDate,
  preferences,
}) => {
  const currentPaperTheme = PAPER_THEMES.find(t => t.id === paperTheme) || PAPER_THEMES[3];
  const currentFont = JOURNAL_FONTS.find(f => f.id === preferences.font) || JOURNAL_FONTS[0];

  const getPaperStyles = (themeId: string) => {
    const styles: Record<string, { background: string; color: string; placeholderColor: string }> = {
      'plain': { 
        background: '#ffffff', 
        color: '#1a1a1a',
        placeholderColor: '#888888'
      },
      'parchment': { 
        background: '#e8dcc4', 
        color: '#3d2914',
        placeholderColor: '#8b7355'
      },
      'night': { 
        background: '#1a1a2e', 
        color: '#e0e0ff',
        placeholderColor: '#8888aa'
      },
      'celestial': { 
        background: '#0f0f1e', 
        color: '#e0e0ff',
        placeholderColor: '#8888aa'
      },
    };
    return styles[themeId] || styles['celestial'];
  };

  const paperStyles = getPaperStyles(paperTheme);

  return (
    <div className="oracle-mode-scribe">
      <div className="scribe-header">
        <h3>{editingEntryId ? 'Edit Entry' : 'New Oracle Entry'}</h3>
        <span className="scribe-date">{formatCurrentDate()}</span>
      </div>
      
      {/* Paper Theme Selector */}
      <div className="scribe-theme-bar">
        <span className="theme-label">Paper Style:</span>
        <button 
          className="theme-current"
          onClick={() => setShowPaperThemeSelector(!showPaperThemeSelector)}
        >
          <span className="theme-icon">{currentPaperTheme.icon}</span>
          <span className="theme-name">{currentPaperTheme.label}</span>
          <span className="theme-arrow">{showPaperThemeSelector ? '▲' : '▼'}</span>
        </button>
        
        {showPaperThemeSelector && (
          <div className="theme-dropdown">
            {PAPER_THEMES.map((theme) => (
              <button
                key={theme.id}
                className={`theme-option ${paperTheme === theme.id ? 'active' : ''}`}
                onClick={() => onPaperThemeChange(theme.id)}
              >
                <span className="theme-icon">{theme.icon}</span>
                <div className="theme-info">
                  <span className="theme-name">{theme.label}</span>
                  <span className="theme-desc">{theme.description}</span>
                </div>
                {paperTheme === theme.id && <span className="theme-check">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="scribe-editor" style={{ fontFamily: currentFont.cssValue }}>
        <textarea
          value={scribeContent}
          onChange={(e) => setScribeContent(e.target.value)}
          placeholder="Speak your truth into the cosmic record..."
          className={`scribe-textarea paper-${paperTheme}`}
          style={{
            background: paperStyles.background,
            color: paperStyles.color,
          }}
        />
        
        {generatedInsight && (
          <div className="scribe-insight-card-wrapper">
            <EnhancedInsightCard
              insight={generatedInsight}
              onDismiss={onDismissInsight}
            />
          </div>
        )}
      </div>
      
      <div className="scribe-actions">
        <button 
          className="btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="btn-insight"
          onClick={onGenerateInsight}
          disabled={!scribeContent.trim() || isGeneratingInsight}
        >
          {isGeneratingInsight ? '✨ Consulting...' : '🔮 Seek Insight'}
        </button>
        <button 
          className="btn-primary"
          onClick={onSave}
          disabled={!scribeContent.trim()}
        >
          {editingEntryId ? 'Update Entry' : 'Save to Oracle'}
        </button>
      </div>
    </div>
  );
};
