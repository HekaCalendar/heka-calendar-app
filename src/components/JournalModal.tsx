/**
 * Oracle Journal Component - Unified Journal System
 * 
 * Features:
 * - Global theme system affecting entire interface
 * - Dual-tab: Oracle Diary | Calendar Notes
 * - Calendar notes sync with searchability
 * - Full celestial guidance integration
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { createDiaryEntry, updateDiaryEntry, deleteDiaryEntry, selectAllEntries } from '../store/diarySlice';
import { DiaryTimeline } from './DiaryTimeline';
import { JournalEditor } from './JournalEditor';
import { JournalSettings } from './JournalSettings';
import { TransitTimeline } from './TransitTimeline';
import { DiarySearch } from './DiarySearch';
import { calculatePersonalTransits, generateTransitNotifications, getCurrentPlanetaryPositions } from '../oracle/birthChartIntegration';
import type { PersonalTransit, TransitNotification } from '../oracle/birthChartIntegration';
import { JOURNAL_FONTS } from '../oracle/diaryTypes';
import '../styles/journal-modal.css';

interface JournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type JournalView = 'entries' | 'editor' | 'transits' | 'settings';
type EntryTab = 'diary' | 'calendar';

// Calendar note converted to searchable entry format
interface CalendarNoteEntry {
  id: string;
  date: string;
  timestamp: string;
  content: string;
  category: string;
  mood?: number;
  isCalendarNote: true;
  sourceKey: string; // Original calendar key
}

export const JournalModal: React.FC<JournalModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const entries = useSelector((state: RootState) => selectAllEntries(state));
  const preferences = useSelector((state: RootState) => state.diary.preferences);
  const calendarNotes = useSelector((state: RootState) => state.calendar.notes);
  const birthChart = useSelector((state: RootState) => 
    state.calendar.selectedAstroProfileId 
      ? state.calendar.astroProfiles.find(p => p.id === state.calendar.selectedAstroProfileId)?.natalChart
      : undefined
  );
  
  const [view, setView] = useState<JournalView>('entries');
  const [activeTab, setActiveTab] = useState<EntryTab>('diary');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [personalTransits, setPersonalTransits] = useState<PersonalTransit[]>([]);
  const [transitNotifications, setTransitNotifications] = useState<TransitNotification[]>([]);
  const [, setCurrentPlanetaryPositions] = useState<Record<string, any>>({});
  const [isLoadingTransits, setIsLoadingTransits] = useState(false);

  // Get current font
  const currentFont = JOURNAL_FONTS.find(f => f.id === preferences.font) || JOURNAL_FONTS[0];

  // Convert calendar notes to searchable entries
  const calendarNoteEntries: CalendarNoteEntry[] = useMemo(() => {
    const entries: CalendarNoteEntry[] = [];
    
    Object.entries(calendarNotes).forEach(([key, dayNotes]) => {
      // Parse key: heka:year:month:day
      const parts = key.split(':');
      if (parts.length !== 4) return;
      
      dayNotes.forEach((note, index) => {
        entries.push({
          id: `calendar-${key}-${index}`,
          date: new Date(note.createdAt).toISOString().split('T')[0],
          timestamp: note.createdAt,
          content: note.content,
          category: note.category,
          mood: note.mood,
          isCalendarNote: true,
          sourceKey: key,
        });
      });
    });
    
    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [calendarNotes]);

  // Load transits and planetary positions
  useEffect(() => {
    if (!isOpen) return;
    
    const loadCelestialData = async () => {
      setIsLoadingTransits(true);
      try {
        const positions = await getCurrentPlanetaryPositions();
        setCurrentPlanetaryPositions(positions);
        
        if (birthChart) {
          const transits = calculatePersonalTransits(birthChart as any, positions);
          setPersonalTransits(transits);
          const notifications = generateTransitNotifications(transits);
          setTransitNotifications(notifications);
        } else {
          setPersonalTransits([]);
          setTransitNotifications([]);
        }
      } catch (error) {
        console.error('Failed to load celestial data:', error);
      } finally {
        setIsLoadingTransits(false);
      }
    };
    
    loadCelestialData();
  }, [isOpen, birthChart]);

  // Handle save entry
  const handleSaveEntry = useCallback(async (content: string) => {
    if (editingEntryId) {
      await dispatch(updateDiaryEntry({ entryId: editingEntryId, content }));
      setEditingEntryId(null);
    } else {
      await dispatch(createDiaryEntry({
        content,
        date: new Date().toISOString().split('T')[0],
      }));
    }
    setView('entries');
    setActiveTab('diary');
  }, [dispatch, editingEntryId]);

  // Handle delete entry
  const handleDeleteEntry = useCallback((entryId: string) => {
    if (confirm('Delete this entry? This cannot be undone.')) {
      dispatch(deleteDiaryEntry(entryId));
      if (editingEntryId === entryId) {
        setEditingEntryId(null);
        setView('entries');
      }
    }
  }, [dispatch, editingEntryId]);

  // Handle edit entry
  const handleEditEntry = useCallback((entryId: string) => {
    setEditingEntryId(entryId);
    setView('editor');
  }, []);

  // Handle new entry
  const handleNewEntry = useCallback(() => {
    setEditingEntryId(null);
    setView('editor');
  }, []);

  // Get entry being edited
  const editingEntry = editingEntryId 
    ? entries.find(e => e.id === editingEntryId) 
    : null;

  // Calculate stats
  const stats = {
    totalEntries: entries.length,
    totalWords: entries.reduce((sum, e) => sum + e.content.split(/\s+/).length, 0),
    withInsights: entries.filter(e => e.insight).length,
    streak: calculateStreak(entries),
    calendarNotesCount: calendarNoteEntries.length,
  };

  // Theme-based styles - mapped to CSS classes
  const getThemeClass = () => `journal-theme-${preferences.theme}`;

  if (!isOpen) return null;

  return (
    <div className={`journal-modal-overlay ${getThemeClass()}`} onClick={onClose}>
      <div 
        className={`journal-modal ${getThemeClass()}`}
        onClick={e => e.stopPropagation()}
        style={{
          fontFamily: currentFont.cssValue,
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Header */}
        <header className="journal-modal-header">
          <div className="journal-header-left">
            <h2 className="journal-title">
              <span className="journal-title-icon">📓</span>
              Oracle Journal
            </h2>
            <p className="journal-subtitle">
              {birthChart 
                ? '✨ Personal celestial guidance activated' 
                : '🌟 General celestial guidance — add birth chart for personalization'}
            </p>
          </div>
          
          <nav className="journal-nav">
            <button 
              className={`journal-nav-btn ${view === 'entries' ? 'active' : ''}`}
              onClick={() => setView('entries')}
            >
              📖 Entries
              {stats.totalEntries + stats.calendarNotesCount > 0 && (
                <span className="journal-nav-badge">{stats.totalEntries + stats.calendarNotesCount}</span>
              )}
            </button>
            <button 
              className={`journal-nav-btn ${view === 'transits' ? 'active' : ''}`}
              onClick={() => setView('transits')}
            >
              ✦ Transits
            </button>
            <button 
              className="journal-nav-btn"
              onClick={() => setIsSearchOpen(true)}
              title="Search entries"
            >
              🔍
            </button>
            <button 
              className="journal-nav-btn"
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
            >
              ⚙️
            </button>
            <button className="journal-close-btn" onClick={onClose}>×</button>
          </nav>
        </header>

        {/* Content */}
        <main className="journal-modal-content">
          {view === 'entries' && (
            <div className="journal-view-entries">
              {/* Stats Bar */}
              <div className="journal-stats-bar">
                <div className="journal-stat">
                  <span className="journal-stat-value">{stats.totalEntries}</span>
                  <span className="journal-stat-label">Oracle Entries</span>
                </div>
                <div className="journal-stat">
                  <span className="journal-stat-value">{stats.calendarNotesCount}</span>
                  <span className="journal-stat-label">Calendar Notes</span>
                </div>
                <div className="journal-stat">
                  <span className="journal-stat-value">{stats.withInsights}</span>
                  <span className="journal-stat-label">Insights</span>
                </div>
                <div className="journal-stat">
                  <span className="journal-stat-value">{stats.streak}</span>
                  <span className="journal-stat-label">Day Streak</span>
                </div>
                <button className="journal-new-entry-btn" onClick={handleNewEntry}>
                  ✨ New Entry
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="journal-tabs">
                <button 
                  className={`journal-tab ${activeTab === 'diary' ? 'active' : ''}`}
                  onClick={() => setActiveTab('diary')}
                >
                  <span className="journal-tab-icon">✨</span>
                  Oracle Diary
                  <span className="journal-tab-count">{stats.totalEntries}</span>
                </button>
                <button 
                  className={`journal-tab ${activeTab === 'calendar' ? 'active' : ''}`}
                  onClick={() => setActiveTab('calendar')}
                >
                  <span className="journal-tab-icon">📅</span>
                  Calendar Notes
                  <span className="journal-tab-count">{stats.calendarNotesCount}</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="journal-tab-content">
                {activeTab === 'diary' ? (
                  <div className="journal-diary-panel">
                    {entries.length === 0 ? (
                      <div className="journal-empty-state">
                        <div className="journal-empty-icon">✨</div>
                        <h3>No Oracle Entries Yet</h3>
                        <p>Start writing to receive celestial insights based on your thoughts and the current cosmic weather.</p>
                        <button className="journal-empty-btn" onClick={handleNewEntry}>
                          Write Your First Entry
                        </button>
                      </div>
                    ) : (
                      <DiaryTimeline onEntryClick={handleEditEntry} />
                    )}
                  </div>
                ) : (
                  <div className="journal-calendar-panel">
                    {calendarNoteEntries.length === 0 ? (
                      <div className="journal-empty-state">
                        <div className="journal-empty-icon">📅</div>
                        <h3>No Calendar Notes</h3>
                        <p>Notes you write on the calendar will appear here, organized by date with timestamps.</p>
                        <button className="journal-empty-btn" onClick={onClose}>
                          Return to Calendar
                        </button>
                      </div>
                    ) : (
                      <div className="journal-calendar-list">
                        {calendarNoteEntries.map((note) => (
                          <div 
                            key={note.id} 
                            className="journal-calendar-item"
                            onClick={() => {
                              // Navigate to that date on calendar
                              onClose();
                            }}
                          >
                            <div className="journal-calendar-item-header">
                              <span className="journal-calendar-date">
                                {new Date(note.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </span>
                              <span className="journal-calendar-time">
                                {new Date(note.timestamp).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <span className="journal-calendar-category">{note.category}</span>
                              {note.mood && (
                                <span className="journal-calendar-mood">
                                  {['😢', '😕', '😐', '🙂', '😄'][note.mood - 1]}
                                </span>
                              )}
                            </div>
                            <p className="journal-calendar-content">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'editor' && (
            <div className="journal-view-editor">
              <JournalEditor
                initialContent={editingEntry?.content}
                date={new Date().toISOString().split('T')[0]}
                onSave={handleSaveEntry}
                onGenerateInsight={async () => {}}
                existingInsight={editingEntry?.insight}
                isGeneratingInsight={false}
              />
              {editingEntry && (
                <button 
                  className="journal-delete-btn"
                  onClick={() => handleDeleteEntry(editingEntry.id)}
                >
                  🗑️ Delete Entry
                </button>
              )}
            </div>
          )}

          {view === 'transits' && (
            <div className="journal-view-transits">
              {/* Birth Chart Status */}
              {!birthChart && (
                <div className="journal-birthchart-banner">
                  <div className="journal-birthchart-icon">🌟</div>
                  <div className="journal-birthchart-text">
                    <h4>Current Planetary Positions</h4>
                    <p>Viewing general celestial transits. Add your birth chart in the Celestial Guide for personalized insights.</p>
                  </div>
                  <button 
                    className="journal-birthchart-btn"
                    onClick={() => {
                      onClose();
                      const event = new CustomEvent('navigate-to-stars');
                      window.dispatchEvent(event);
                    }}
                  >
                    Set Up Birth Chart →
                  </button>
                </div>
              )}
              
              {birthChart && (
                <div className="journal-birthchart-banner active">
                  <div className="journal-birthchart-icon">✨</div>
                  <div className="journal-birthchart-text">
                    <h4>Personal Transits Active</h4>
                    <p>Your birth chart is connected. Receiving personalized celestial guidance based on your natal positions.</p>
                  </div>
                </div>
              )}

              {/* Transit Timeline */}
              {isLoadingTransits ? (
                <div className="journal-loading">
                  <span className="journal-spinner">✨</span>
                  <p>Consulting the stars...</p>
                </div>
              ) : (
                <TransitTimeline 
                  transits={personalTransits}
                  notifications={transitNotifications}
                />
              )}
            </div>
          )}
        </main>

        {/* Settings Modal - Pass current theme */}
        <JournalSettings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          theme={preferences.theme}
        />

        {/* Search Modal - Now searches both diary and calendar */}
        <DiarySearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onEntrySelect={handleEditEntry}
          onCalendarNoteSelect={() => {
            onClose();
          }}
          calendarNotes={calendarNoteEntries}
          theme={preferences.theme}
        />
      </div>
    </div>
  );
};

// Calculate streak
function calculateStreak(entries: any[]): number {
  if (entries.length === 0) return 0;
  
  const dates = [...new Set(entries.map(e => e.date))].sort();
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i];
    const expectedDate = new Date();
    expectedDate.setDate(expectedDate.getDate() - (dates.length - 1 - i));
    
    if (date === expectedDate.toISOString().split('T')[0] || 
        (i === dates.length - 1 && date === today)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export default JournalModal;
