/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    ORACLE MODE SCRIBE — ENTERPRISE EDITION                ║
 * ║                                                                           ║
 * ║  Features: tags, markdown toggle, auto-save, templates, paper themes      ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { JOURNAL_FONTS } from '../../../oracle/diaryTypes';
import type { EnhancedInsight } from '../../../oracle/enhancedInsightEngine';
import { EnhancedInsightCard } from '../../EnhancedInsightCard';
import { PAPER_THEMES } from '../config/themes';
import { JOURNAL_TEMPLATES } from '../journalTemplates';
import { MarkdownEditor } from '../MarkdownEditor';

interface OracleModeScribeProps {
  editingEntryId: string | null;
  scribeContent: string;
  setScribeContent: (content: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  isMarkdown: boolean;
  setIsMarkdown: (val: boolean) => void;
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
  autoSaveStatus?: 'idle' | 'saving' | 'saved';
}

export const OracleModeScribe: React.FC<OracleModeScribeProps> = ({
  editingEntryId,
  scribeContent,
  setScribeContent,
  tags,
  setTags,
  isMarkdown,
  setIsMarkdown,
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
  autoSaveStatus = 'idle',
}) => {
  const { t } = useTranslation('journal');
  const currentPaperTheme = PAPER_THEMES.find(t => t.id === paperTheme) || PAPER_THEMES[3];
  const currentFont = JOURNAL_FONTS.find(f => f.id === preferences.font) || JOURNAL_FONTS[0];

  const [tagInput, setTagInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

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

  const addTag = useCallback((tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  }, [tags, setTags]);

  const removeTag = useCallback((tag: string) => {
    setTags(tags.filter(t => t !== tag));
  }, [tags, setTags]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const applyTemplate = (templateId: string) => {
    const tmpl = JOURNAL_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;
    setScribeContent(tmpl.content);
    setTags(tmpl.tags);
    setShowTemplates(false);
  };

  // Auto-save keyboard shortcut (Ctrl/Cmd + S)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (scribeContent.trim()) onSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [scribeContent, onSave]);

  return (
    <div className="oracle-mode-scribe">
      <div className="scribe-header">
        <h3>{editingEntryId ? t('editEntry') : t('editor.newOracleEntry')}</h3>
        <span className="scribe-date">{formatCurrentDate()}</span>
      </div>

      {/* Toolbar: Theme + Markdown + Template */}
      <div className="scribe-toolbar">
        <div className="scribe-theme-bar">
          <span className="theme-label">{t('editor.paperStyle')}</span>
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

        <div className="scribe-toolbar-right">
          <button
            className={`btn-toggle ${isMarkdown ? 'active' : ''}`}
            onClick={() => setIsMarkdown(!isMarkdown)}
            title={isMarkdown ? t('editor.plainTextMode') : t('editor.markdownMode')}
          >
            {isMarkdown ? '📝 MD' : '✏️ TXT'}
          </button>

          <div className="template-dropdown-wrapper">
            <button
              className="btn-template"
              onClick={() => setShowTemplates(!showTemplates)}
            >
              📋 {t('editor.template')}
            </button>
            {showTemplates && (
              <div className="template-dropdown">
                {JOURNAL_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    className="template-option"
                    onClick={() => applyTemplate(tmpl.id)}
                  >
                    <span className="template-icon">{tmpl.icon}</span>
                    <div className="template-info">
                      <span className="template-name">{tmpl.label}</span>
                      <span className="template-desc">{tmpl.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="scribe-tags-bar">
        <div className="tags-list">
          {tags.map(tag => (
            <span key={tag} className="tag-chip">
              #{tag}
              <button className="tag-remove" onClick={() => removeTag(tag)} aria-label={t('common.removeTag')}>×</button>
            </span>
          ))}
          <input
            ref={tagInputRef}
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => tagInput && addTag(tagInput)}
            placeholder={tags.length === 0 ? t('editor.addTags') : ''}
            className="tag-input"
          />
        </div>
      </div>

      {/* Editor Area */}
      <div className="scribe-editor" style={{ fontFamily: currentFont.cssValue }}>
        {isMarkdown ? (
          <MarkdownEditor
            value={scribeContent}
            onChange={setScribeContent}
            placeholder={t('editor.scribePlaceholder')}
            className={`scribe-markdown paper-${paperTheme}`}
            style={{
              background: paperStyles.background,
              color: paperStyles.color,
              minHeight: '300px',
            }}
          />
        ) : (
          <textarea
            value={scribeContent}
            onChange={(e) => setScribeContent(e.target.value)}
            placeholder={t('editor.scribePlaceholder')}
            className={`scribe-textarea paper-${paperTheme}`}
            style={{
              background: paperStyles.background,
              color: paperStyles.color,
            }}
          />
        )}

        {generatedInsight && (
          <div className="scribe-insight-card-wrapper">
            <EnhancedInsightCard
              insight={generatedInsight}
              onDismiss={onDismissInsight}
            />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="scribe-status-bar">
        <span className="scribe-word-count">
          {scribeContent.trim().split(/\s+/).filter(Boolean).length} {t('editor.words')}
        </span>
        {autoSaveStatus === 'saving' && (
          <span className="autosave-status saving">💾 {t('editor.saving')}...</span>
        )}
        {autoSaveStatus === 'saved' && (
          <span className="autosave-status saved">✓ {t('editor.saved')}</span>
        )}
      </div>

      {/* Actions */}
      <div className="scribe-actions">
        <button
          className="btn-secondary"
          onClick={onCancel}
        >
          {t('editor.cancel')}
        </button>
        <button
          className="btn-insight"
          onClick={onGenerateInsight}
          disabled={!scribeContent.trim() || isGeneratingInsight}
        >
          {isGeneratingInsight ? t('editor.generatingInsight') : t('editor.seekInsight')}
        </button>
        <button
          className="btn-primary"
          onClick={onSave}
          disabled={!scribeContent.trim()}
        >
          {editingEntryId ? t('editor.updateEntry') : t('editor.saveToOracle')}
        </button>
      </div>
    </div>
  );
};
