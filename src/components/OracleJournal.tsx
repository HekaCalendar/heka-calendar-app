/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    THE ORACLE JOURNAL - LEGENDARY EDITION                 ║
 * ║                                                                           ║
 * ║  "Where celestial mechanics meets divine inspiration"                    ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { createDiaryEntry, updateDiaryEntry, selectAllEntries, setJournalTheme } from '../store/diarySlice';

import { calculatePersonalTransits, getCurrentPlanetaryPositions } from '../oracle/birthChartIntegration';
import type { PersonalTransit } from '../oracle/birthChartIntegration';
import { JOURNAL_FONTS } from '../oracle/diaryTypes';
import { EnhancedInsightEngine } from '../oracle/enhancedInsightEngine';
import type { EnhancedInsight } from '../oracle/enhancedInsightEngine';
import { DiarySearch } from './DiarySearch';
import { JournalSettings } from './JournalSettings';
import { OracleModeTracker } from './oracle/modes/OracleModeTracker';
import { civilToHeka, HEKA_MONTHS } from '../services/calendarService';
import { aiConfigService } from '../services/aiConfigService';

import type { JournalMode, EntryFilter, CalendarNoteEntry, CelestialState } from './oracle/types';
import { MODULE_THEMES } from './oracle/config/themes';
import { calculateStreak } from './oracle/utils';
import { eventBus } from '../services/eventBus';
import { useBirthChart } from './oracle/hooks/useBirthChart';
import { OracleHeader } from './oracle/OracleHeader';
import { OracleNavigation } from './oracle/OracleNavigation';
import { OracleModeOracle } from './oracle/modes/OracleModeOracle';
import { OracleModeEntries } from './oracle/modes/OracleModeEntries';
import { OracleModeCelestial } from './oracle/modes/OracleModeCelestial';
import { OracleModeScribe } from './oracle/modes/OracleModeScribe';
import { TransitDetailModal } from './oracle/modals/TransitDetailModal';

import '../styles/oracle-journal.css';
import '../styles/oracle-journal.landscape.css';

interface OracleJournalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OracleJournal: React.FC<OracleJournalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  // ─────────────────────────────────────────────────────────────────────────
  // REDUX STATE
  // ─────────────────────────────────────────────────────────────────────────
  
  const entries = useSelector((state: RootState) => selectAllEntries(state));
  const preferences = useSelector((state: RootState) => state.diary.preferences);
  const calendarNotes = useSelector((state: RootState) => state.calendar.notes);
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

  
  // Module theme (for the journal chrome/ui)
  const [moduleTheme, setModuleTheme] = useState('cosmic');
  
  // Paper theme (for the writing area) - stored in Redux preferences
  const paperTheme = preferences.theme || 'celestial';
  
  // ✦ CELESTIAL STATE
  const [celestial, setCelestial] = useState<CelestialState>({
    positions: {},
    moonPhase: { phase: 'new', sign: 'Aries', illumination: 0, isVoid: false },
    retrogrades: [],
    loading: true,
    error: null,
  });
  
  // ✦ PERSONAL TRANSITS
  const [personalTransits, setPersonalTransits] = useState<PersonalTransit[]>([]);
  const [activeTransit, setActiveTransit] = useState<PersonalTransit | null>(null);
  
  // Editor state
  const [scribeContent, setScribeContent] = useState('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [generatedInsight, setGeneratedInsight] = useState<EnhancedInsight | null>(null);
  
  // ─────────────────────────────────────────────────────────────────────────
  // REFS
  // ─────────────────────────────────────────────────────────────────────────
  
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);
  
  // ─────────────────────────────────────────────────────────────────────────
  // CELESTIAL DATA LOADING
  // ─────────────────────────────────────────────────────────────────────────
  
  const loadCelestialData = useCallback(async () => {
    try {
      setCelestial(prev => ({ ...prev, loading: true, error: null }));
      
      const positions = await getCurrentPlanetaryPositions(new Date());
      
      const retrogrades = Object.entries(positions)
        .filter(([_, pos]) => pos.retrograde)
        .map(([planet]) => planet);
      
      const moon = positions.Moon || positions.moon;
      const sun = positions.Sun || positions.sun;
      let moonPhase = { phase: 'new', sign: moon?.sign || 'Aries', illumination: 0, isVoid: false };
      
      if (moon && sun) {
        const angle = Math.abs(moon.longitude - sun.longitude);
        const illumination = (1 - Math.cos((angle * Math.PI) / 180)) / 2 * 100;
        
        let phase = 'new';
        if (angle < 45) phase = 'new';
        else if (angle < 90) phase = 'waxing_crescent';
        else if (angle < 135) phase = 'first_quarter';
        else if (angle < 180) phase = 'waxing_gibbous';
        else if (angle < 225) phase = 'full';
        else if (angle < 270) phase = 'waning_gibbous';
        else if (angle < 315) phase = 'last_quarter';
        else phase = 'waning_crescent';
        
        moonPhase = { 
          phase, 
          sign: (String(moon.sign).charAt(0).toUpperCase() + String(moon.sign).slice(1)) as any, 
          illumination,
          isVoid: false
        };
      }
      
      setCelestial({
        positions,
        moonPhase,
        retrogrades,
        loading: false,
        error: null,
      });
      
    } catch (error) {
      console.error('[OracleJournal] Failed to load celestial data:', error);
      setCelestial(prev => ({
        ...prev,
        loading: false,
        error: 'The stars are temporarily obscured...'
      }));
    }
  }, []);
  
  // ─────────────────────────────────────────────────────────────────────────
  // PERSONAL TRANSITS CALCULATION
  // ─────────────────────────────────────────────────────────────────────────
  
  const calculatePersonalTransitsData = useCallback(async () => {
    if (!hasBirthChart || !birthChartData) {
      console.log('[OracleJournal] No birth chart available for transits');
      setPersonalTransits([]);
      return;
    }
    
    try {
      const positions = await getCurrentPlanetaryPositions(new Date());
      const transits = calculatePersonalTransits(birthChartData as any, positions);
      
      setPersonalTransits(transits);
      
    } catch (error) {
      console.error('[OracleJournal] Transit calculation failed:', error);
    }
  }, [hasBirthChart, birthChartData]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // EFFECTS
  // ─────────────────────────────────────────────────────────────────────────
  
  useEffect(() => {
    if (!isOpen) return;
    
    loadCelestialData();
    calculatePersonalTransitsData();
    
    // Refresh every 5 minutes instead of every minute - transits don't change that fast
    refreshInterval.current = setInterval(() => {
      loadCelestialData();
      calculatePersonalTransitsData();
    }, 300000);
    
    // Listen for AI coach prompt injections
    const unsubPrompt = eventBus.subscribe('heka-journal-prompt', ({ prompt }) => {
      if (prompt) {
        setScribeContent(prompt);
        setMode('scribe');
        setGeneratedInsight(null);
      }
    });
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
      unsubPrompt();
    };
  }, [isOpen, loadCelestialData, calculatePersonalTransitsData]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // CALENDAR NOTES CONVERSION (Optimized with stable references)
  // ─────────────────────────────────────────────────────────────────────────
  
  const calendarNoteEntries: CalendarNoteEntry[] = useMemo(() => {
    const noteCount = Object.values(calendarNotes).reduce((sum, notes) => sum + notes.length, 0);
    if (noteCount === 0) return [];
    
    const result: CalendarNoteEntry[] = [];
    
    Object.entries(calendarNotes).forEach(([key, dayNotes]) => {
      dayNotes.forEach((note, index) => {
        if (!note || !note.createdAt) return;
        
        const civilDate = new Date(note.createdAt);
        const hekaDate = civilToHeka(civilDate);
        
        result.push({
          id: `calendar-${key}-${index}`,
          date: note.createdAt,
          hekaDate: hekaDate || { year: civilDate.getFullYear(), month: 0, day: 1 },
          timestamp: note.createdAt,
          content: note.content,
          category: note.category || 'general',
          mood: note.mood,
          sourceKey: key,
        });
      });
    });
    
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [calendarNotes]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // STATS (Optimized - single pass calculations)
  // ─────────────────────────────────────────────────────────────────────────
  
  const stats = useMemo(() => {
    let entriesWithInsights = 0;
    for (const e of entries) {
      if (e.insight) entriesWithInsights++;
    }
    
    let activeTransits = 0;
    let majorTransits = 0;
    for (const t of personalTransits) {
      if (t.strength >= 80) {
        majorTransits++;
        activeTransits++;
      } else if (t.strength >= 30) {
        activeTransits++;
      }
    }
    
    return {
      totalEntries: entries.length,
      entriesWithInsights,
      calendarNotes: calendarNoteEntries.length,
      activeTransits,
      majorTransits,
      streak: calculateStreak(entries),
    };
  }, [entries, calendarNoteEntries.length, personalTransits]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────
  
  const handleSaveEntry = useCallback(async () => {
    if (!scribeContent.trim()) return;
    
    const now = new Date();
    const hekaDate = civilToHeka(now);
    const dateString = hekaDate 
      ? `${hekaDate.year}-${String(hekaDate.month + 1).padStart(2, '0')}-${String(hekaDate.day).padStart(2, '0')}`
      : now.toISOString().split('T')[0];
    
    if (editingEntryId) {
      await dispatch(updateDiaryEntry({ entryId: editingEntryId, content: scribeContent }));
      setEditingEntryId(null);
    } else {
      await dispatch(createDiaryEntry({
        content: scribeContent,
        date: dateString,
      }));
    }
    
    const todayIso = new Date().toISOString().split('T')[0];
    localStorage.setItem('heka-last-journal-date', todayIso);
    
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
    setGeneratedInsight(null);
    setMode('entries');
  }, [dispatch, editingEntryId, scribeContent]);
  
  const handlePaperThemeChange = useCallback((themeId: string) => {
    dispatch(setJournalTheme(themeId as any));
    setShowPaperThemeSelector(false);
  }, [dispatch]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // DATE FORMATTING HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  
  const formatEntryDate = useCallback((timestamp: string | number | Date) => {
    if (!timestamp) return 'Unknown Date';
    
    if (typeof timestamp === 'object' && !(timestamp instanceof Date)) {
      console.warn('Invalid timestamp object:', timestamp);
      return 'Unknown Date';
    }
    
    const civilDate = new Date(timestamp);
    
    if (isNaN(civilDate.getTime())) {
      console.warn('Invalid date from timestamp:', timestamp);
      return 'Unknown Date';
    }
    
    const hekaDate = civilToHeka(civilDate);
    
    if (timeMode === 'TRUE' && hekaDate) {
      const monthName = HEKA_MONTHS[hekaDate.month];
      let display = `${monthName} ${hekaDate.day}, ${hekaDate.year}`;
      
      if (displaySettings.showCivilDates) {
        display += ` (${civilDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      }
      return display;
    } else {
      return civilDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
  }, [timeMode, displaySettings.showCivilDates]);
  
  const formatCurrentDate = useCallback(() => {
    const now = new Date();
    const hekaDate = civilToHeka(now);
    
    if (timeMode === 'TRUE' && hekaDate) {
      const monthName = HEKA_MONTHS[hekaDate.month];
      let display = `${monthName} ${hekaDate.day}, ${hekaDate.year}`;
      
      if (displaySettings.showCivilDates) {
        display += ` (${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })})`;
      }
      return display;
    } else {
      return now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
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
              celestial={celestial}
              hasBirthChart={hasBirthChart}
              effectiveProfile={effectiveProfile}
              personalTransitsCount={personalTransits.length}
              activeTransitsCount={stats.activeTransits}
            />
            <OracleNavigation
              mode={mode}
              setMode={setMode}
              totalEntries={stats.totalEntries}
              calendarNotes={stats.calendarNotes}
              activeTransits={stats.activeTransits}
              onSearch={() => setIsSearchOpen(true)}
              onSettings={() => setIsSettingsOpen(true)}
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
                  setMode('scribe');
                }}
                onNavigateToDate={() => {
                  onClose();
                }}
                formatEntryDate={formatEntryDate}
                onSetMode={() => setMode('scribe')}
              />
            )}
            
            {mode === 'celestial' && (
              <OracleModeCelestial
                celestial={celestial}
                personalTransits={personalTransits}
                hasBirthChart={hasBirthChart}
                birthChartData={birthChartData}
                onTransitClick={setActiveTransit}
                onJournalTransit={(transit) => {
                  setScribeContent(`Today I feel the energy of ${transit.transitingPlanet} ${transit.aspect} my ${transit.natalPlanet}...\n\n`);
                  setMode('scribe');
                }}
                onTrackEnergy={() => setMode('tracker')}
              />
            )}
            
            {mode === 'scribe' && (
              <OracleModeScribe
                editingEntryId={editingEntryId}
                scribeContent={scribeContent}
                setScribeContent={setScribeContent}
                paperTheme={paperTheme}
                showPaperThemeSelector={showPaperThemeSelector}
                setShowPaperThemeSelector={setShowPaperThemeSelector}
                onPaperThemeChange={handlePaperThemeChange}
                generatedInsight={generatedInsight}
                onDismissInsight={() => setGeneratedInsight(null)}
                isGeneratingInsight={isGeneratingInsight}
                onGenerateInsight={async () => {
                  if (!scribeContent.trim()) return;
                  setIsGeneratingInsight(true);
                  
                  try {
                    const insight = await EnhancedInsightEngine.generateInsight({
                      content: scribeContent,
                      birthChart: (birthChartData as any) || undefined,
                    });
                    
                    setGeneratedInsight(insight);
                  } catch (error) {
                    console.error('Insight generation failed:', error);
                    setGeneratedInsight({
                      id: `fallback-${Date.now()}`,
                      text: 'The Oracle is momentarily clouded. Trust your own wisdom for now.',
                      type: 'general',
                      confidence: 50,
                      strength: 50,
                      uniqueness: 0,
                      celestialEvent: {
                        type: 'general',
                        description: 'Cosmic guidance temporarily obscured',
                        strength: 50,
                        timing: { peak: 'Now', duration: 'Immediate' }
                      },
                      affirmations: ['I trust my inner wisdom.'],
                      rituals: ['Take three deep breaths and center yourself.'],
                      journalPrompts: ['What is my intuition telling me right now?'],
                      actionItems: ['Return to this reflection when you feel grounded.'],
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
                }}
                formatCurrentDate={formatCurrentDate}
                preferences={preferences}
              />
            )}
          </main>
        </div>
        
        <TransitDetailModal
          transit={activeTransit}
          onClose={() => setActiveTransit(null)}
        />
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
      
      {mode === 'tracker' && (
        <div className="oracle-mode-tracker-wrapper">
          <OracleModeTracker
            date={new Date().toISOString().split('T')[0]}
            onClose={() => setMode('oracle')}
          />
        </div>
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
    </>
  );
};
