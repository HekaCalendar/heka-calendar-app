/**
 * Journal Editor Component
 * Rich text editor for diary entries with celestial context
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { DiaryInsight } from '../oracle/diaryTypes';
import { getThemeStyles, getFontStyles } from '../oracle/diaryTypes';
import '../styles/journal-editor.css';
import '../styles/journal-modal.landscape.css';

interface JournalEditorProps {
  initialContent?: string;
  date: string;
  onSave: (content: string) => void;
  onGenerateInsight?: (entryId: string, content: string) => Promise<void>;
  existingInsight?: DiaryInsight;
  isGeneratingInsight?: boolean;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  initialContent = '',
  date,
  onSave,
  onGenerateInsight,
  existingInsight,
  isGeneratingInsight = false,
}) => {
  const preferences = useSelector((state: RootState) => state.diary.preferences);
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showInsightPanel, setShowInsightPanel] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);

  // Update word count
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    setWordCount(words);
  }, [content]);

  // Auto-save
  useEffect(() => {
    if (preferences.autoSave && isDirty && content.trim()) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
      autoSaveRef.current = setTimeout(() => {
        // Auto-save to localStorage
        localStorage.setItem('heka_diary_draft', JSON.stringify({ content, date }));
        setIsDirty(false);
      }, preferences.autoSaveInterval);
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [content, isDirty, preferences.autoSave, preferences.autoSaveInterval, date]);

  // Load draft on mount
  useEffect(() => {
    if (!initialContent) {
      const draft = localStorage.getItem('heka_diary_draft');
      if (draft) {
        try {
          const { content: draftContent, date: draftDate } = JSON.parse(draft);
          if (draftDate === date && draftContent) {
            setContent(draftContent);
            setIsDirty(true);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, [initialContent, date]);

  // Focus textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    if (content.trim()) {
      onSave(content);
      localStorage.removeItem('heka_diary_draft');
      setIsDirty(false);
    }
  }, [content, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  }, [handleSave]);

  const handleGenerateInsight = useCallback(() => {
    if (content.trim().length > 20 && onGenerateInsight) {
      onGenerateInsight('temp-entry-id', content);
      setShowInsightPanel(true);
    }
  }, [content, onGenerateInsight]);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const isToday = dateStr === today.toISOString().split('T')[0];
    
    if (isToday) {
      return 'Today';
    }
    
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="journal-editor">
      {/* Toolbar */}
      <div className="journal-editor-toolbar">
        <div className="journal-editor-meta">
          <span className="journal-editor-date">{formatDate(date)}</span>
          <span className="journal-editor-wordcount">{wordCount} words</span>
          {isDirty && <span className="journal-editor-dirty">• Unsaved</span>}
        </div>
        
        <div className="journal-editor-actions">
          {preferences.showInsights && !existingInsight && (
            <button
              className="journal-editor-btn journal-editor-btn-insight"
              onClick={handleGenerateInsight}
              disabled={content.trim().length < 20 || isGeneratingInsight}
              title="Generate celestial insight (20+ words needed)"
            >
              {isGeneratingInsight ? (
                <>
                  <span className="journal-spinner">✨</span>
                  Consulting...
                </>
              ) : (
                <>✨ Get Insight</>
              )}
            </button>
          )}
          <button
            className="journal-editor-btn journal-editor-btn-save"
            onClick={handleSave}
            disabled={!content.trim()}
          >
            Save Entry
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div 
        className="journal-editor-area"
        style={{
          ...getThemeStyles(preferences.theme),
          fontSize: `${preferences.fontSize}px`,
        }}
      >
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Begin writing... let your thoughts flow like stars across the night sky."
          style={{
            ...getFontStyles(preferences.font),
            fontSize: `${preferences.fontSize}px`,
            lineHeight: preferences.lineHeight,
          }}
          spellCheck={false}
        />
      </div>

      {/* Footer */}
      <div className="journal-editor-footer">
        <div className="journal-editor-hints">
          <span>⌘S to save</span>
          <span>•</span>
          <span>Auto-save {preferences.autoSave ? 'on' : 'off'}</span>
        </div>
        
        <div className="journal-editor-theme-indicator">
          <span>{preferences.theme}</span>
          <span>•</span>
          <span>{preferences.font}</span>
        </div>
      </div>

      {/* Insight Preview Panel */}
      {showInsightPanel && existingInsight && (
        <div className="journal-editor-insight-panel">
          <div className="journal-editor-insight-header">
            <h4>✨ Celestial Insight</h4>
            <button onClick={() => setShowInsightPanel(false)}>×</button>
          </div>
          <p>{existingInsight.text}</p>
        </div>
      )}
    </div>
  );
};

export default JournalEditor;
