/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    THE ORACLE JOURNAL - LEGENDARY EDITION                 ║
 * ║                                                                           ║
 * ║  "Where celestial mechanics meets divine inspiration"                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { selectCalendarNoteEntries } from '../store';
import { createDiaryEntry, updateDiaryEntry, selectAllEntries, setJournalTheme } from '../store/diarySlice';

import i18n from '../i18n';
import { JOURNAL_FONTS } from '../oracle/diaryTypes';
import type { JournalTheme } from '../oracle/diaryTypes';
import type { BirthChart } from '../oracle/birthChartIntegration';
import { EnhancedInsightEngine } from '../oracle/enhancedInsightEngine';
import type { EnhancedInsight } from '../oracle/enhancedInsightEngine';
import { DiarySearch } from './DiarySearch';
import { JournalSettings } from './JournalSettings';
import { getErrorMessage } from '../utils/errorUtils';
import { OracleModeTracker } from './oracle/modes/OracleModeTracker';
import { civilToHeka, HEKA_MONTHS } from '../services/calendarService';
import { aiConfigService } from '../services/aiConfigService';

import type { JournalMode, EntryFilter } from './oracle/types';
import { MODULE_THEMES } from './oracle/config/themes';
import { calculateStreak } from './oracle/utils';
import { eventBus } from '../services/eventBus';
import { useBirthChart } from './oracle/hooks/useBirthChart';
import { OracleHeader } from './oracle/OracleHeader';
import { OracleNavigation } from './oracle/OracleNavigation';
import { OracleModeOracle } from './oracle/modes/OracleModeOracle';
import { OracleModeEntries } from './oracle/modes/OracleModeEntries';
import { OracleModeDailyDraw } from './oracle/dailyOracle/OracleModeDailyDraw';
import { OracleModeScribe } from './oracle/modes/OracleModeScribe';
import { JournalImportExport } from './oracle/modals/JournalImportExport';

import '../styles/oracle-journal.css';
import '../styles/oracle-journal.landscape.css';

interface OracleJournalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OracleJournal: React.FC<OracleJournalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('journal');
  const dispatch = useDispatch<AppDispatch>();
  
  // ─────────────────────────────────────────────────────────────────────────
  // REDUX STATE
  // ─────────────────────────────────────────────────────────────────────────
  
  const entries = useSelector((state: RootState) => selectAllEntries(state));
  const preferences = useSelector((state: RootState) => state.diary.preferences);
  const calendarNoteEntries = useSelector(selectCalendarNoteEntries, shallowEqual);
  const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
  const displaySettings = useSelector((state: RootState) => state.calendar.display);
  
  // ─────────────────────────────────────────────────────────────────────────
  // BIRTH CHART
  // ─────────────────────────────────────────────────────────────────────────
  const { effectiveProfile, hasBirthChart, birthChartData } = useBirthChart(isOpen);
  
  // ─────────────────────────────────────────────────────────────────────────
  // LOCAL STATE
  // ─────────────────────────────────────────────────────────────────────────
  
  const [mode, setMode] = useState<JournalMode>('oracle');
  const [entryFilter, setEntryFilter] = useState<EntryFilter>('all');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showPaperThemeSelector, setShowPaperThemeSelector] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  
  // Module theme (for the journal chrome/ui)
  const [moduleTheme, setModuleTheme] = useState('cosmic');
  
  // Paper theme (for the writing area) - stored in Redux preferences
  const paperTheme = preferences.theme || 'celestial';

  // Editor state
  const [scribeContent, setScribeContent] = useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [generatedInsight, setGeneratedInsight] = useState<EnhancedInsight | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen) return;

    // Listen for AI coach prompt injections
    const unsubPrompt = eventBus.subscribe('heka-journal-prompt', ({ prompt }) => {
      if (prompt) {
        setScribeContent(prompt);
        setMode('scribe');
        setGeneratedInsight(null);
      }
    });

    return () => {
      unsubPrompt();
    };
  }, [isOpen]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATS (Optimized - single pass calculations)
  // ─────────────────────────────────────────────────────────────────────────
  
  const stats = useMemo(() => {
    let entriesWithInsights = 0;
    for (const e of entries) {
      if (e.insight) entriesWithInsights++;
    }

    return {
      totalEntries: entries.length,
      entriesWithInsights,
      calendarNotes: calendarNoteEntries.length,
      activeTransits: 0,
      majorTransits: 0,
      streak: calculateStreak(entries),
    };
  }, [entries, calendarNoteEntries.length]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  
  // Auto-save draft to sessionStorage
  useEffect(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (!scribeContent.trim()) {
      setAutoSaveStatus('idle');
      return;
    }
    setAutoSaveStatus('saving');
    autoSaveTimerRef.current = setTimeout(() => {
      try {
        const draft = {
          content: scribeContent,
          tags,
          isMarkdown,
          editingEntryId,
          timestamp: new Date().toISOString(),
        };
        sessionStorage.setItem('heka-journal-draft', JSON.stringify(draft));
        setAutoSaveStatus('saved');
      } catch {
        setAutoSaveStatus('idle');
      }
    }, 2000);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [scribeContent, tags, isMarkdown, editingEntryId]);

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('heka-journal-draft');
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.content && !editingEntryId) {
          setScribeContent(draft.content);
          if (draft.tags) setTags(draft.tags);
          if (draft.isMarkdown) setIsMarkdown(draft.isMarkdown);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const handleSaveEntry = useCallback(async () => {
    if (!scribeContent.trim()) return;

    const now = new Date();
    const hekaDate = civilToHeka(now);
    const dateString = hekaDate
      ? `${hekaDate.year}-${String(hekaDate.month + 1).padStart(2, '0')}-${String(hekaDate.day).padStart(2, '0')}`
      : now.toISOString().split('T')[0];

    try {
      if (editingEntryId) {
        await dispatch(updateDiaryEntry({ entryId: editingEntryId, content: scribeContent, tags }));
        setEditingEntryId(null);
      } else {
        await dispatch(createDiaryEntry({
          content: scribeContent,
          date: dateString,
          tags,
          isMarkdown,
        }));
      }
      // Clear draft after successful save
      sessionStorage.removeItem('heka-journal-draft');
      setAutoSaveStatus('idle');
    } catch (error) {
      console.error('[OracleJournal] Save failed:', getErrorMessage(error));
      // User can retry — draft is preserved in sessionStorage
    }

    const todayIso = new Date().toISOString().split('T')[0];

    const themes: string[] = [];
    const contentLower = scribeContent.toLowerCase();
    const themeKeywords = ['gratitude', 'anxiety', 'love', 'work', 'family', 'health', 'dream', 'goal', 'fear', 'hope', 'loss', 'joy', 'stress', 'peace', 'creative', 'travel', 'money', 'friendship'];
    for (const kw of themeKeywords) {
      if (contentLower.includes(kw)) themes.push(kw);
    }
    if (themes.length === 0) {
      const firstWords = scribeContent.split(' ').slice(0, 3).join(' ');
      themes.push(firstWords || 'reflection');
    }
    aiConfigService.setUserContext({
      lastJournalDate: todayIso,
      lastJournalThemes: themes.slice(0, 3),
    });

    setScribeContent('');
    setTags([]);
    setGeneratedInsight(null);
    setIsMarkdown(false);
    setMode('entries');
  }, [dispatch, editingEntryId, scribeContent, tags, isMarkdown]);
  
  const handlePaperThemeChange = useCallback((themeId: string) => {
    dispatch(setJournalTheme(themeId as JournalTheme));
    setShowPaperThemeSelector(false);
  }, [dispatch]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // DATE FORMATTING HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  
  const formatEntryDate = useCallback((timestamp: string | number | Date) => {
    if (!timestamp) return t('oracle.unknownDate');
    
    if (typeof timestamp === 'object' && !(timestamp instanceof Date)) {
      console.warn('Invalid timestamp object:', timestamp);
      return t('oracle.unknownDate');
    }
    
    const civilDate = new Date(timestamp);
    
    if (isNaN(civilDate.getTime())) {
      console.warn('Invalid date from timestamp:', timestamp);
      return t('oracle.unknownDate');
    }
    
    const hekaDate = civilToHeka(civilDate);
    
    if (timeMode === 'TRUE' && hekaDate) {
      const monthName = HEKA_MONTHS[hekaDate.month];
      let display = `${monthName} ${hekaDate.day}, ${hekaDate.year}`;
      
      if (displaySettings.showCivilDates) {
        display += ` (${new Intl.DateTimeFormat(i18n.language || 'en', { month: 'short', day: 'numeric' }).format(civilDate)})`;
      }
      return display;
    } else {
      return new Intl.DateTimeFormat(i18n.language || 'en', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(civilDate);
    }
  }, [timeMode, displaySettings.showCivilDates]);
  
  const formatCurrentDate = useCallback(() => {
    const now = new Date();
    const hekaDate = civilToHeka(now);
    
    if (timeMode === 'TRUE' && hekaDate) {
      const monthName = HEKA_MONTHS[hekaDate.month];
      let display = `${monthName} ${hekaDate.day}, ${hekaDate.year}`;
      
      if (displaySettings.showCivilDates) {
        display += ` (${new Intl.DateTimeFormat(i18n.language || 'en', { month: 'long', day: 'numeric', year: 'numeric' }).format(now)})`;
      }
      return display;
    } else {
      return new Intl.DateTimeFormat(i18n.language || 'en', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(now);
    }
  }, [timeMode, displaySettings.showCivilDates]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  
  const currentModuleTheme = MODULE_THEMES.find(t => t.id === moduleTheme) || MODULE_THEMES[0];
  const currentFont = JOURNAL_FONTS.find(f => f.id === preferences.font) || JOURNAL_FONTS[0];
  
  const searchCalendarNotes = useMemo(() => {
    if (calendarNoteEntries.length === 0) return [];
    
    return calendarNoteEntries.map(n => ({
      id: n.id,
      date: n.date,
      timestamp: n.timestamp,
      content: n.content,
      category: n.category,
      mood: n.mood,
      isCalendarNote: true as const,
      sourceKey: n.sourceKey,
    }));
  }, [calendarNoteEntries]);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div 
        className={`oracle-journal-overlay theme-${moduleTheme}`} 
        onClick={onClose}
        style={{
          '--module-bg': currentModuleTheme.colors.bg,
          '--module-accent': currentModuleTheme.colors.accent,
          '--module-text': currentModuleTheme.colors.text,
        } as React.CSSProperties}
      >
        <div className="oracle-bg-stars" />
        <div className="oracle-bg-nebula" />
        
        <div 
          className={`oracle-journal theme-${moduleTheme}`}
          onClick={e => e.stopPropagation()}
          style={{ fontFamily: currentFont.cssValue }}
        >
          <header className="oracle-header">
            <OracleHeader
              onClose={onClose}
              hasBirthChart={hasBirthChart}
              effectiveProfile={effectiveProfile}
            />
            <OracleNavigation
              mode={mode}
              setMode={setMode}
              totalEntries={stats.totalEntries}
              calendarNotes={stats.calendarNotes}
              onSearch={() => setIsSearchOpen(true)}
              onSettings={() => setIsSettingsOpen(true)}
              onImportExport={() => setShowImportExport(true)}
            />
          </header>
          
          <main className="oracle-content">
            {mode === 'oracle' && (
              <OracleModeOracle
                hasBirthChart={hasBirthChart}
                effectiveProfile={effectiveProfile}
                birthChartData={birthChartData}
                stats={stats}
                onSetMode={(m) => setMode(m)}
                onNavigateToStars={() => {
                  onClose();
                  eventBus.emit('navigate-to-stars', {});
                }}
              />
            )}
            
            {mode === 'entries' && (
              <OracleModeEntries
                entries={entries}
                calendarNoteEntries={calendarNoteEntries}
                entryFilter={entryFilter}
                setEntryFilter={setEntryFilter}
                onEditEntry={(entry) => {
                  setEditingEntryId(entry.id);
                  setScribeContent(entry.content);
                  setTags(entry.tags || []);
                  setIsMarkdown(entry.isMarkdown || false);
                  setMode('scribe');
                }}
                onNavigateToDate={() => {
                  onClose();
                }}
                formatEntryDate={formatEntryDate}
                onSetMode={() => setMode('scribe')}
              />
            )}
            
            {mode === 'draw' && (
              <OracleModeDailyDraw
                onJournalPrompt={(prompt) => {
                  setScribeContent(prompt);
                  setMode('scribe');
                  setGeneratedInsight(null);
                }}
                birthChartData={birthChartData}
              />
            )}
            
            {mode === 'scribe' && (
              <OracleModeScribe
                editingEntryId={editingEntryId}
                scribeContent={scribeContent}
                setScribeContent={setScribeContent}
                tags={tags}
                setTags={setTags}
                isMarkdown={isMarkdown}
                setIsMarkdown={setIsMarkdown}
                paperTheme={paperTheme}
                showPaperThemeSelector={showPaperThemeSelector}
                setShowPaperThemeSelector={setShowPaperThemeSelector}
                onPaperThemeChange={handlePaperThemeChange}
                generatedInsight={generatedInsight}
                onDismissInsight={() => setGeneratedInsight(null)}
                isGeneratingInsight={isGeneratingInsight}
                autoSaveStatus={autoSaveStatus}
                onGenerateInsight={async () => {
                  if (!scribeContent.trim()) return;
                  setIsGeneratingInsight(true);
                  
                  try {
                    const insight = await EnhancedInsightEngine.generateInsight({
                      content: scribeContent,
                      birthChart: (birthChartData as unknown as BirthChart) || undefined,
                    });
                    
                    setGeneratedInsight(insight);
                  } catch (error) {
                    console.error('Insight generation failed:', error);
                    setGeneratedInsight({
                      id: `fallback-${Date.now()}`,
                      text: t('fallback.insightText'),
                      type: 'general',
                      confidence: 50,
                      strength: 50,
                      uniqueness: 0,
                      celestialEvent: {
                        type: 'general',
                        description: t('fallback.celestialDescription'),
                        strength: 50,
                        timing: { peak: t('fallback.peak'), duration: t('fallback.duration') }
                      },
                      affirmations: [t('fallback.affirmation')],
                      rituals: [t('fallback.ritual')],
                      journalPrompts: [t('fallback.journalPrompt')],
                      actionItems: [t('fallback.actionItem')],
                      visualTheme: { color: '#9d4edd', icon: '🔮', gradient: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)' }
                    });
                  }
                  
                  setIsGeneratingInsight(false);
                }}
                onSave={handleSaveEntry}
                onCancel={() => {
                  setMode('entries');
                  setScribeContent('');
                  setEditingEntryId(null);
                  setGeneratedInsight(null);
                  setShowPaperThemeSelector(false);
                  setTags([]);
                  setIsMarkdown(false);
                }}
                formatCurrentDate={formatCurrentDate}
                preferences={preferences}
              />
            )}
          </main>
        </div>
        
        {mode === 'community' && (
          <div className="oracle-mode-tracker-wrapper" onClick={e => e.stopPropagation()}>
            <OracleModeTracker
              date={new Date().toISOString().split('T')[0]}
              onClose={() => setMode('oracle')}
            />
          </div>
        )}

      </div>
      
      {isSearchOpen && (
        <DiarySearch
          isOpen={true}
          onClose={() => setIsSearchOpen(false)}
          onEntrySelect={(entryId) => {
            const entry = entries.find(e => e.id === entryId);
            if (entry) {
              setEditingEntryId(entry.id);
              setScribeContent(entry.content);
              setMode('scribe');
            }
            setIsSearchOpen(false);
          }}
          onCalendarNoteSelect={() => {
            onClose();
          }}
          calendarNotes={searchCalendarNotes}
          theme={paperTheme}
        />
      )}
      
      {isSettingsOpen && (
        <JournalSettings
          isOpen={true}
          onClose={() => setIsSettingsOpen(false)}
          theme={paperTheme}
          moduleTheme={moduleTheme}
          onModuleThemeChange={setModuleTheme}
        />
      )}

      {showImportExport && (
        <JournalImportExport
          isOpen={true}
          onClose={() => setShowImportExport(false)}
        />
      )}
    </>
  );
};
