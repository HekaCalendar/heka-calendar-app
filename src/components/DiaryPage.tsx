/**
 * Diary Page Component
 * Main diary interface with dual-mode support
 */

import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { createDiaryEntry, updateDiaryEntry, deleteDiaryEntry, rateInsight, selectAllEntries } from '../store/diarySlice';
import { JournalEditor } from './JournalEditor';
import { JournalSettings } from './JournalSettings';
import { InsightDisplay } from './InsightDisplay';
import { DiaryTimeline } from './DiaryTimeline';
import { exportToPDFWindow } from '../services/pdfExport';
import { TransitTimeline } from './TransitTimeline';
import { TransitNotifications } from './TransitNotifications';
import { DiarySearch } from './DiarySearch';
import { DiaryMobileNav } from './DiaryMobileNav';
import { 
  calculatePersonalTransits, 
  generateTransitNotifications,
  getCurrentPlanetaryPositions
} from '../oracle/birthChartIntegration';
import type { PersonalTransit, TransitNotification } from '../oracle/birthChartIntegration';
import type { BirthChart } from '../oracle/birthChartIntegration';
import '../styles/diary-page.css';

interface DiaryPageProps {
  date?: string; // Optional date for calendar-linked entries
  mode?: 'timeline' | 'editor' | 'transits';
}

export const DiaryPage: React.FC<DiaryPageProps> = ({ 
  date = new Date().toISOString().split('T')[0],
  mode = 'timeline' 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const entries = useSelector((state: RootState) => selectAllEntries(state));
  const preferences = useSelector((state: RootState) => state.diary.preferences);
  const loading = useSelector((state: RootState) => state.diary.ui.isLoading);
  
  const [viewMode, setViewMode] = useState<'timeline' | 'editor' | 'transits'>(mode);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  
  // Birth chart transit state
  const birthChart = useSelector((state: RootState) => {
    const profile = state.calendar.selectedAstroProfileId 
      ? state.calendar.astroProfiles.find(p => p.id === state.calendar.selectedAstroProfileId)
      : undefined;
    return profile?.natalChart as any; // Type assertion for birth chart integration
  });
  const [personalTransits, setPersonalTransits] = useState<PersonalTransit[]>([]);
  const [transitNotifications, setTransitNotifications] = useState<TransitNotification[]>([]);

  // Handle export PDF event
  useEffect(() => {
    const handleExportPDF = () => {
      exportToPDFWindow(entries, {
        title: 'My HEKA Journal',
        includeInsights: preferences.showInsights,
      });
    };

    window.addEventListener('export-diary-pdf', handleExportPDF);
    return () => window.removeEventListener('export-diary-pdf', handleExportPDF);
  }, [entries, preferences.showInsights]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculate personal transits when birth chart changes
  useEffect(() => {
    const calculateTransits = async () => {
      if (birthChart) {
        try {
          // Get real planetary positions from Swiss Ephemeris
          const currentPositions = await getCurrentPlanetaryPositions();
          
          const transits = calculatePersonalTransits(birthChart as BirthChart, currentPositions);
          setPersonalTransits(transits);
          
          // Generate notifications from transits
          const notifications = generateTransitNotifications(transits);
          setTransitNotifications(notifications);
        } catch (error) {
          console.error('Failed to calculate transits:', error);
        }
      } else {
        setPersonalTransits([]);
        setTransitNotifications([]);
      }
    };
    
    calculateTransits();
  }, [birthChart]);

  // Get entry being edited
  const editingEntry = editingEntryId 
    ? entries.find(e => e.id === editingEntryId) 
    : null;

  // Handle save entry with FULL Oracle analysis
  const handleSaveEntry = useCallback(async (content: string) => {
    if (editingEntryId) {
      // Update existing with re-analysis if content changed significantly
      await dispatch(updateDiaryEntry({ 
        entryId: editingEntryId, 
        content,
      }));
      setEditingEntryId(null);
    } else {
      // Create new with FULL celestial context and content analysis
      await dispatch(createDiaryEntry({
        content,
        date,
      }));
    }
    setViewMode('timeline');
  }, [dispatch, editingEntryId, date]);

  // Handle generate insight - now integrated into create/update automatically
  // This can be used for manual re-generation if needed
  const handleGenerateInsight = useCallback(async (_entryId: string, _content: string) => {
    // Insights are now automatically generated on create/update
    console.log('Insights are automatically generated with Oracle Engine');
  }, []);

  // Handle rate insight
  const handleRateInsight = useCallback((entryId: string, rating: 'resonated' | 'neutral' | 'dismissed') => {
    dispatch(rateInsight({ entryId, rating }));
  }, [dispatch]);

  // Handle delete entry with cloud sync
  const handleDeleteEntry = useCallback((entryId: string) => {
    if (confirm('Delete this entry? This cannot be undone.')) {
      dispatch(deleteDiaryEntry(entryId));
      if (editingEntryId === entryId) {
        setEditingEntryId(null);
        setViewMode('timeline');
      }
    }
  }, [dispatch, editingEntryId]);

  // Handle edit entry
  const handleEditEntry = useCallback((entryId: string) => {
    setEditingEntryId(entryId);
    setViewMode('editor');
  }, []);

  // Handle new entry
  const handleNewEntry = useCallback(() => {
    setEditingEntryId(null);
    setViewMode('editor');
  }, []);

  // Get entries for current date (if in date-specific mode)
  const dateEntries = entries.filter(e => e.date === date);

  return (
    <div className="diary-page">
      {/* Header */}
      <header className="diary-header">
        <div className="diary-header-left">
          <h1 className="diary-title">📖 HEKA Diary</h1>
          <p className="diary-subtitle">
            {viewMode === 'timeline' 
              ? 'Your journey through time' 
              : editingEntryId ? 'Editing entry...' : 'Capture a moment'}
          </p>
        </div>
        
        <div className="diary-header-actions">
          {viewMode === 'timeline' ? (
            <>
              <button 
                className="diary-btn diary-btn-secondary"
                onClick={() => setIsSearchOpen(true)}
              >
                🔍 Search
              </button>
              <button 
                className="diary-btn diary-btn-secondary"
                onClick={() => setViewMode('transits')}
              >
                ✦ Transits
              </button>
              <button 
                className="diary-btn diary-btn-secondary"
                onClick={() => setIsSettingsOpen(true)}
              >
                ⚙️ Settings
              </button>
              <button 
                className="diary-btn diary-btn-primary"
                onClick={handleNewEntry}
              >
                ✨ New Entry
              </button>
            </>
          ) : (
            <>
              <button 
                className="diary-btn diary-btn-secondary"
                onClick={() => {
                  setEditingEntryId(null);
                  setViewMode('timeline');
                }}
              >
                ← Back
              </button>
              {editingEntry && (
                <button 
                  className="diary-btn diary-btn-danger"
                  onClick={() => handleDeleteEntry(editingEntry.id)}
                >
                  🗑️ Delete
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="diary-content">
        {viewMode === 'transits' ? (
          <TransitTimeline 
            transits={personalTransits}
            notifications={transitNotifications}
          />
        ) : viewMode === 'timeline' ? (
          <div className="diary-timeline-container">
            {/* Quick Stats */}
            <div className="diary-stats">
              <div className="diary-stat">
                <span className="diary-stat-value">{entries.length}</span>
                <span className="diary-stat-label">Entries</span>
              </div>
              <div className="diary-stat">
                <span className="diary-stat-value">
                  {entries.reduce((sum, e) => sum + e.content.split(/\s+/).length, 0)}
                </span>
                <span className="diary-stat-label">Words</span>
              </div>
              <div className="diary-stat">
                <span className="diary-stat-value">
                  {entries.filter(e => e.insight?.userRating === 'resonated').length}
                </span>
                <span className="diary-stat-label">Resonated</span>
              </div>
            </div>

            {/* Timeline */}
            <DiaryTimeline onEntryClick={handleEditEntry} />
          </div>
        ) : (
          <div className="diary-editor-container">
            {/* Today's Previous Entries */}
            {!editingEntryId && dateEntries.length > 0 && (
              <div className="diary-today-entries">
                <h3>Today's Entries ({dateEntries.length})</h3>
                <div className="diary-today-list">
                  {dateEntries.map(entry => (
                    <button
                      key={entry.id}
                      className="diary-today-item"
                      onClick={() => handleEditEntry(entry.id)}
                    >
                      <span className="diary-today-time">
                        {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                      <span className="diary-today-preview">
                        {entry.content.slice(0, 60)}...
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Editor */}
            <JournalEditor
              initialContent={editingEntry?.content}
              date={date}
              onSave={handleSaveEntry}
              onGenerateInsight={handleGenerateInsight}
              existingInsight={editingEntry?.insight}
            />

            {/* Insight Display (if editing entry with insight) */}
            {editingEntry?.insight && preferences.showInsights && (
              <div className="diary-insight-section">
                <InsightDisplay
                  insight={editingEntry.insight}
                  onRate={(rating) => handleRateInsight(editingEntry.id, rating)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Search Modal */}
      <DiarySearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onEntrySelect={handleEditEntry}
      />

      {/* Settings Modal */}
      <JournalSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Transit Notifications */}
      <TransitNotifications 
        notifications={transitNotifications}
        onDismiss={(id) => setTransitNotifications(prev => prev.filter(n => n.id !== id))}
      />

      {/* Mobile Navigation */}
      <DiaryMobileNav
        currentView={viewMode}
        onViewChange={setViewMode}
        onSearch={() => setIsSearchOpen(true)}
        entryCount={entries.length}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="diary-loading-overlay">
          <div className="diary-loading-spinner">
            <span>✨</span>
            <p>Consulting the stars...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
