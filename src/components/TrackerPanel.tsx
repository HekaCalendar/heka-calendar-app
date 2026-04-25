/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    CELESTIAL BODY TRACKER - ENTERPRISE EDITION            ║
 * ║                                                                           ║
 * ║  Institutional-grade menstrual & wellness tracking dashboard             ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TrackerManager } from '../services/trackerManager';
import type {
  TrackerEntry,
  TrackerType,
  MenstrualData,
  MoodData,
  SleepData,
  EnergyData,
  CyclePrediction,
} from '../oracle/trackerTypes';
import { 
  MOOD_SCALE, 
  ENERGY_SCALE, 
  FLOW_OPTIONS,
  SLEEP_QUALITY_OPTIONS 
} from '../oracle/trackerTypes';
import { InsightsDashboard } from './tracker/InsightsDashboard';
import '../styles/tracker-panel.css';

// ═════════════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════════════

interface TrackerPanelProps {
  date: string;
  isOpen: boolean;
  onClose: () => void;
}

type TrackerTab = 'overview' | 'menstrual' | 'mood' | 'sleep' | 'energy';

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

export const TrackerPanel: React.FC<TrackerPanelProps> = ({ date, isOpen, onClose }) => {
  // ─────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────
  
  const [activeTab, setActiveTab] = useState<TrackerTab>('overview');
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [prediction, setPrediction] = useState<CyclePrediction | null>(null);
  const [currentDate, setCurrentDate] = useState(date);
  const [isEditing, setIsEditing] = useState<TrackerType | null>(null);
  const [addingType, setAddingType] = useState<TrackerType | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  
  // Form states
  const [menstrualForm, setMenstrualForm] = useState<MenstrualData>({
    flow: 'none',
    symptoms: [],
    isPeriodStart: false,
  });
  const [moodForm, setMoodForm] = useState<MoodData>({
    rating: 5,
    mood: 'neutral',
    intensity: 3,
  });
  const [sleepForm, setSleepForm] = useState<SleepData>({
    duration: 7,
    quality: 3,
  });
  const [energyForm, setEnergyForm] = useState<EnergyData>({
    level: 5,
    type: 'physical',
    timeOfDay: 'morning',
  });

  // ─────────────────────────────────────────────────────────────────────────
  // DATA LOADING
  // ─────────────────────────────────────────────────────────────────────────
  
  const loadData = useCallback(() => {
    const allEntries = TrackerManager.getEntriesForDate(currentDate);
    setEntries(allEntries);
    setPrediction(TrackerManager.getCyclePrediction());
    
    // Load existing data into forms
    const menstrual = allEntries.find(e => e.type === 'menstrual');
    if (menstrual) setMenstrualForm(menstrual.data as MenstrualData);
    else setMenstrualForm({ flow: 'none', symptoms: [], isPeriodStart: false });
    
    const mood = allEntries.find(e => e.type === 'mood');
    if (mood) setMoodForm(mood.data as MoodData);
    else setMoodForm({ rating: 5, mood: 'neutral', intensity: 3 });
    
    const sleep = allEntries.find(e => e.type === 'sleep');
    if (sleep) setSleepForm(sleep.data as SleepData);
    else setSleepForm({ duration: 7, quality: 3 });
    
    const energy = allEntries.find(e => e.type === 'energy');
    if (energy) setEnergyForm(energy.data as EnergyData);
    else setEnergyForm({ level: 5, type: 'physical', timeOfDay: 'morning' });
  }, [currentDate]);

  useEffect(() => {
    if (isOpen) loadData();
  }, [isOpen, currentDate, loadData]);

  // ─────────────────────────────────────────────────────────────────────────
  // DATE NAVIGATION
  // ─────────────────────────────────────────────────────────────────────────
  
  const navigateDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate.toISOString().split('T')[0]);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date().toISOString().split('T')[0]);
  };

  const formattedDate = useMemo(() => {
    const d = new Date(currentDate);
    return {
      day: d.getDate(),
      full: d.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long' 
      }),
    };
  }, [currentDate]);

  // ─────────────────────────────────────────────────────────────────────────
  // ENTRY MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────
  
  const saveEntry = (type: TrackerType, data: unknown) => {
    TrackerManager.saveEntry({
      date: currentDate,
      type,
      data: data as TrackerEntry['data'],
      timestamp: new Date().toISOString(),
    });
    loadData();
    setIsEditing(null);
    setAddingType(null);
  };

  const deleteEntry = (entryId: string) => {
    if (confirm('Delete this entry?')) {
      TrackerManager.deleteEntry(entryId);
      loadData();
    }
  };

  const clearDay = () => {
    if (confirm('Clear all entries for this day?')) {
      TrackerManager.deleteEntriesForDate(currentDate);
      loadData();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CYCLE DATA
  // ─────────────────────────────────────────────────────────────────────────
  
  const cycleDay = useMemo(() => {
    return TrackerManager.getCurrentCycleDay();
  }, [entries, currentDate]);

  const fertilityStatus = useMemo(() => {
    return TrackerManager.getFertilityStatus(currentDate);
  }, [currentDate]);

  const getPhaseColor = (phase: string): string => {
    switch (phase) {
      case 'menstrual': return 'var(--t-semantic-menstrual)';
      case 'follicular': return '#3b82f6';
      case 'fertile': return 'var(--t-semantic-fertile)';
      case 'ovulation': return 'var(--t-semantic-ovulation)';
      case 'luteal': return 'var(--t-semantic-luteal)';
      case 'pms': return '#f97316';
      default: return '#71717a';
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  
  const getEntryIcon = (type: TrackerType): string => {
    const icons: Record<TrackerType, string> = {
      menstrual: '🩸',
      mood: '🎭',
      sleep: '😴',
      energy: '⚡',
      medication: '💊',
      symptom: '🤒',
      exercise: '🏃',
      nutrition: '🥗',
      custom: '📝',
    };
    return icons[type] || '📊';
  };

  const getEntryLabel = (type: TrackerType): string => {
    const labels: Record<TrackerType, string> = {
      menstrual: 'Menstrual',
      mood: 'Mood',
      sleep: 'Sleep',
      energy: 'Energy',
      medication: 'Medication',
      symptom: 'Symptom',
      exercise: 'Exercise',
      nutrition: 'Nutrition',
      custom: 'Custom',
    };
    return labels[type] || type;
  };

  const formatEntryValue = (entry: TrackerEntry): string => {
    switch (entry.type) {
      case 'menstrual':
        const m = entry.data as MenstrualData;
        return m.flow === 'none' ? 'No flow' : `${m.flow} flow`;
      case 'mood':
        const mo = entry.data as MoodData;
        return `${mo.rating}/10`;
      case 'sleep':
        const s = entry.data as SleepData;
        return `${s.duration}h`;
      case 'energy':
        const e = entry.data as EnergyData;
        return `${e.level}/10`;
      default:
        return 'Recorded';
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // TAB CONTENT RENDERERS
  // ─────────────────────────────────────────────────────────────────────────
  
  const renderOverview = () => (
    <div className="tracker-section">
      {entries.length === 0 ? (
        <div className="tracker-empty">
          <div className="tracker-empty__icon">📊</div>
          <h3 className="tracker-empty__title">No entries yet</h3>
          <p className="tracker-empty__text">
            Select a tracker type above to log your wellness data for this day.
          </p>
        </div>
      ) : (
        <>
          <div className="tracker-section__header">
            <h2 className="tracker-section__title">
              <span className="tracker-section__title-icon">📋</span>
              Today's Entries
            </h2>
            <button className="tracker-btn tracker-btn--ghost" onClick={clearDay}>
              Clear All
            </button>
          </div>
          
          {entries.map(entry => (
            <div key={entry.id} className="tracker-entry">
              <div className="tracker-entry__header">
                <div className="tracker-entry__type">
                  <span className="tracker-entry__type-icon">
                    {getEntryIcon(entry.type)}
                  </span>
                  <span className="tracker-entry__type-label">
                    {getEntryLabel(entry.type)}
                  </span>
                </div>
                <span className="tracker-entry__time">
                  {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="tracker-entry__content">
                <div className="tracker-value">
                  <span className="tracker-value__number">
                    {formatEntryValue(entry)}
                  </span>
                </div>
              </div>
              <div className="tracker-entry__actions">
                <button 
                  className="tracker-entry__btn"
                  onClick={() => setIsEditing(entry.type)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="tracker-entry__btn tracker-entry__btn--danger"
                  onClick={() => deleteEntry(entry.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );

  const renderMenstrual = () => {
    const typeEntries = entries.filter(e => e.type === 'menstrual');
    const hasEntries = typeEntries.length > 0;
    const isAddingNew = addingType === 'menstrual';
    
    return (
      <div className="tracker-section">
        <div className="tracker-section__header">
          <h2 className="tracker-section__title">
            <span className="tracker-section__title-icon">🩸</span>
            Menstrual Tracking
          </h2>
          <button 
            className="tracker-btn tracker-btn--primary"
            onClick={() => {
              setMenstrualForm({ flow: 'none', symptoms: [], isPeriodStart: false });
              setAddingType('menstrual');
            }}
          >
            + Add Entry
          </button>
        </div>
        
        {/* Existing Entries */}
        {hasEntries && (
          <div className="tracker-entries-list">
            {typeEntries.map(entry => (
              <div key={entry.id} className="tracker-entry-card">
                <div className="tracker-entry-card__time">
                  {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="tracker-entry-card__content">
                  {(entry.data as MenstrualData).flow !== 'none' && (
                    <span className="tracker-entry-card__badge tracker-entry-card__badge--flow">
                      {(entry.data as MenstrualData).flow} flow
                    </span>
                  )}
                  {(entry.data as MenstrualData).symptoms?.map(s => (
                    <span key={s} className="tracker-entry-card__badge">
                      {s}
                    </span>
                  ))}
                </div>
                <button 
                  className="tracker-entry-card__delete"
                  onClick={() => deleteEntry(entry.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
        
        {isAddingNew ? (
          <div className="tracker-form">
            <div className="tracker-field">
              <label className="tracker-field__label">Flow Intensity</label>
              <div className="tracker-flow">
                {FLOW_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    className={`tracker-flow__option ${menstrualForm.flow === option.value ? 'selected' : ''}`}
                    onClick={() => setMenstrualForm({ ...menstrualForm, flow: option.value })}
                  >
                    <span className="tracker-flow__icon">{option.emoji}</span>
                    <span className="tracker-flow__label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="tracker-field">
              <label className="tracker-field__label">Symptoms</label>
              <div className="tracker-symptoms">
                {['cramps', 'bloating', 'headache', 'fatigue', 'mood-swings', 'food-cravings'].map(symptom => (
                  <button
                    key={symptom}
                    className={`tracker-symptom ${menstrualForm.symptoms?.includes(symptom as any) ? 'selected' : ''}`}
                    onClick={() => {
                      const current = menstrualForm.symptoms || [];
                      const updated = current.includes(symptom as any)
                        ? current.filter(s => s !== symptom)
                        : [...current, symptom as any];
                      setMenstrualForm({ ...menstrualForm, symptoms: updated });
                    }}
                  >
                    <span className="tracker-symptom__checkbox">
                      {menstrualForm.symptoms?.includes(symptom as any) && '✓'}
                    </span>
                    <span className="tracker-symptom__label">{symptom.replace('-', ' ')}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="tracker-field">
              <label className="tracker-field__label" style={{ flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={menstrualForm.isPeriodStart}
                  onChange={(e) => setMenstrualForm({ ...menstrualForm, isPeriodStart: e.target.checked })}
                  style={{ marginRight: '12px', width: '18px', height: '18px' }}
                />
                This is the first day of my period
              </label>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                className="tracker-btn tracker-btn--primary"
                onClick={() => saveEntry('menstrual', menstrualForm)}
              >
                Save Entry
              </button>
              <button 
                className="tracker-btn tracker-btn--ghost"
                onClick={() => setAddingType(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : !hasEntries ? (
          <div className="tracker-empty">
            <div className="tracker-empty__icon">🩸</div>
            <h3 className="tracker-empty__title">No entries yet</h3>
            <p className="tracker-empty__text">
              Click "+ Add Entry" to log your menstrual data for this day.
            </p>
          </div>
        ) : null}
      </div>
    );
  };

  const renderMood = () => {
    const hasEntry = entries.some(e => e.type === 'mood');
    const isEditingThis = isEditing === 'mood' || (!hasEntry && isEditing === null);
    const selectedMood = MOOD_SCALE.find(m => m.value === moodForm.rating);
    
    return (
      <div className="tracker-section">
        <div className="tracker-section__header">
          <h2 className="tracker-section__title">
            <span className="tracker-section__title-icon">🎭</span>
            Mood Tracking
          </h2>
          {hasEntry && !isEditingThis && (
            <button 
              className="tracker-btn tracker-btn--secondary"
              onClick={() => setIsEditing('mood')}
            >
              Edit Entry
            </button>
          )}
        </div>
        
        {isEditingThis ? (
          <div className="tracker-form">
            <div className="tracker-field">
              <label className="tracker-field__label">
                How are you feeling?
                <span className="tracker-field__hint">{selectedMood?.label}</span>
              </label>
              <div className="tracker-value" style={{ marginBottom: '24px' }}>
                <span className="tracker-value__number" style={{ fontSize: '48px' }}>
                  {selectedMood?.emoji}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={moodForm.rating}
                onChange={(e) => setMoodForm({ ...moodForm, rating: parseInt(e.target.value) })}
                className="tracker-slider"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                className="tracker-btn tracker-btn--primary"
                onClick={() => saveEntry('mood', moodForm)}
              >
                Save Entry
              </button>
              {hasEntry && (
                <button 
                  className="tracker-btn tracker-btn--ghost"
                  onClick={() => setIsEditing(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="tracker-value">
            <span className="tracker-value__number">{selectedMood?.emoji}</span>
            <span className="tracker-value__label">{selectedMood?.label} ({moodForm.rating}/10)</span>
          </div>
        )}
      </div>
    );
  };

  const renderSleep = () => {
    const hasEntry = entries.some(e => e.type === 'sleep');
    const isEditingThis = isEditing === 'sleep' || (!hasEntry && isEditing === null);
    const quality = SLEEP_QUALITY_OPTIONS.find(q => q.value === sleepForm.quality);
    
    return (
      <div className="tracker-section">
        <div className="tracker-section__header">
          <h2 className="tracker-section__title">
            <span className="tracker-section__title-icon">😴</span>
            Sleep Tracking
          </h2>
          {hasEntry && !isEditingThis && (
            <button 
              className="tracker-btn tracker-btn--secondary"
              onClick={() => setIsEditing('sleep')}
            >
              Edit Entry
            </button>
          )}
        </div>
        
        {isEditingThis ? (
          <div className="tracker-form">
            <div className="tracker-field">
              <label className="tracker-field__label">Duration (hours)</label>
              <div className="duration-input">
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={sleepForm.duration}
                  onChange={(e) => setSleepForm({ ...sleepForm, duration: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '120px',
                    padding: '16px',
                    background: 'var(--t-bg-secondary)',
                    border: '1px solid var(--t-border-default)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                />
                <span style={{ color: 'var(--t-text-secondary)' }}>hours</span>
              </div>
            </div>
            
            <div className="tracker-field">
              <label className="tracker-field__label">Sleep Quality</label>
              <div className="tracker-flow" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {SLEEP_QUALITY_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    className={`tracker-flow__option ${sleepForm.quality === option.value ? 'selected' : ''}`}
                    onClick={() => setSleepForm({ ...sleepForm, quality: option.value })}
                  >
                    <span className="tracker-flow__icon">{option.emoji}</span>
                    <span className="tracker-flow__label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                className="tracker-btn tracker-btn--primary"
                onClick={() => saveEntry('sleep', sleepForm)}
              >
                Save Entry
              </button>
              {hasEntry && (
                <button 
                  className="tracker-btn tracker-btn--ghost"
                  onClick={() => setIsEditing(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="tracker-value">
            <span className="tracker-value__number">{sleepForm.duration}h</span>
            <span className="tracker-value__label">{quality?.emoji} {quality?.label}</span>
          </div>
        )}
      </div>
    );
  };

  const renderEnergy = () => {
    const hasEntry = entries.some(e => e.type === 'energy');
    const isEditingThis = isEditing === 'energy' || (!hasEntry && isEditing === null);
    const selectedEnergy = ENERGY_SCALE.find(e => e.value === energyForm.level);
    
    return (
      <div className="tracker-section">
        <div className="tracker-section__header">
          <h2 className="tracker-section__title">
            <span className="tracker-section__title-icon">⚡</span>
            Energy Tracking
          </h2>
          {hasEntry && !isEditingThis && (
            <button 
              className="tracker-btn tracker-btn--secondary"
              onClick={() => setIsEditing('energy')}
            >
              Edit Entry
            </button>
          )}
        </div>
        
        {isEditingThis ? (
          <div className="tracker-form">
            <div className="tracker-field">
              <label className="tracker-field__label">
                Energy Level
                <span className="tracker-field__hint">{selectedEnergy?.label}</span>
              </label>
              <div className="tracker-value" style={{ marginBottom: '24px' }}>
                <span className="tracker-value__number" style={{ fontSize: '48px' }}>
                  {selectedEnergy?.emoji}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyForm.level}
                onChange={(e) => setEnergyForm({ ...energyForm, level: parseInt(e.target.value) })}
                className="tracker-slider"
              />
            </div>
            
            <div className="tracker-field">
              <label className="tracker-field__label">Energy Type</label>
              <div className="tracker-symptoms" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {['physical', 'mental', 'emotional', 'spiritual'].map(type => (
                  <button
                    key={type}
                    className={`tracker-symptom ${energyForm.type === type ? 'selected' : ''}`}
                    onClick={() => setEnergyForm({ ...energyForm, type: type as any })}
                    style={{ justifyContent: 'center' }}
                  >
                    <span className="tracker-symptom__label" style={{ textTransform: 'capitalize' }}>
                      {type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                className="tracker-btn tracker-btn--primary"
                onClick={() => saveEntry('energy', energyForm)}
              >
                Save Entry
              </button>
              {hasEntry && (
                <button 
                  className="tracker-btn tracker-btn--ghost"
                  onClick={() => setIsEditing(null)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="tracker-value">
            <span className="tracker-value__number">{selectedEnergy?.emoji}</span>
            <span className="tracker-value__label">{selectedEnergy?.label} ({energyForm.level}/10)</span>
          </div>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────
  
  if (!isOpen) return null;
  
  const tabs: { id: TrackerTab; icon: string; label: string }[] = [
    { id: 'overview', icon: '📋', label: 'Overview' },
    { id: 'menstrual', icon: '🩸', label: 'Cycle' },
    { id: 'mood', icon: '🎭', label: 'Mood' },
    { id: 'sleep', icon: '😴', label: 'Sleep' },
    { id: 'energy', icon: '⚡', label: 'Energy' },
  ];
  
  return (
    <div className="tracker-panel">
      {/* HEADER */}
      <header className="tracker-header">
        <div className="tracker-header__brand">
          <div 
            className="tracker-header__icon" 
            onClick={goToToday}
            title="Go to Today"
          >
            🌙
          </div>
          <h1 className="tracker-header__title">
            Body <span>Tracker</span>
          </h1>
        </div>
        <div className="tracker-header__actions">
          <button 
            className="tracker-header__btn"
            onClick={() => setShowInsights(true)}
            title="View Insights"
          >
            📊
          </button>
          <button 
            className="tracker-header__btn tracker-header__btn--primary"
            onClick={goToToday}
          >
            <span>📅</span>
            <span>Today</span>
          </button>
          <button className="tracker-header__btn" onClick={onClose}>✕</button>
        </div>
      </header>
      
      {/* DATE NAVIGATOR */}
      <div className="tracker-date-nav">
        <button className="tracker-date-nav__btn" onClick={() => navigateDate(-1)}>‹</button>
        <div className="tracker-date-nav__current">
          <div className="tracker-date-nav__day">{formattedDate.day}</div>
          <div className="tracker-date-nav__full">{formattedDate.full}</div>
        </div>
        <button className="tracker-date-nav__btn" onClick={() => navigateDate(1)}>›</button>
        
        {cycleDay.day > 0 && (
          <div className="tracker-date-nav__cycle">
            <div className="tracker-date-nav__cycle-dot" style={{ background: getPhaseColor(fertilityStatus.phase) }} />
            <span className="tracker-date-nav__cycle-text">Day {cycleDay.day}</span>
          </div>
        )}
      </div>
      
      {/* MAIN CONTENT */}
      <div className="tracker-content">
        {/* SIDEBAR */}
        <aside className="tracker-sidebar">
          <div className="tracker-sidebar__section">
            <h3 className="tracker-sidebar__label">Cycle Status</h3>
            <div className="tracker-cycle-card">
              <div className="tracker-cycle-card__day">{cycleDay.day || '--'}</div>
              <div className="tracker-cycle-card__label">Current Day</div>
              <div 
                className="tracker-cycle-card__phase"
                style={{ 
                  background: `${getPhaseColor(fertilityStatus.phase)}20`,
                  borderColor: `${getPhaseColor(fertilityStatus.phase)}40`,
                  color: getPhaseColor(fertilityStatus.phase)
                }}
              >
                <span>●</span>
                {fertilityStatus.phase === 'unknown' ? 'Not tracked yet' : fertilityStatus.phase}
              </div>
            </div>
          </div>
          
          {prediction && (
            <div className="tracker-sidebar__section">
              <h3 className="tracker-sidebar__label">Prediction</h3>
              <div className="tracker-stats-grid">
                <div className="tracker-stat">
                  <div className="tracker-stat__value">
                    {new Date(prediction.nextPeriodStart).getDate()}
                  </div>
                  <div className="tracker-stat__label">Next Period</div>
                </div>
                <div className="tracker-stat">
                  <div className="tracker-stat__value">{prediction.cyclesAnalyzed}</div>
                  <div className="tracker-stat__label">Cycles</div>
                </div>
              </div>
            </div>
          )}
        </aside>
        
        {/* MAIN PANEL */}
        <main className="tracker-main">
          {/* TABS */}
          <nav className="tracker-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tracker-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab.id); setIsEditing(null); }}
              >
                <span className="tracker-tab__icon">{tab.icon}</span>
                <span className="tracker-tab__label">{tab.label}</span>
              </button>
            ))}
          </nav>
          
          {/* TAB CONTENT */}
          <div className="tracker-tab-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'menstrual' && renderMenstrual()}
            {activeTab === 'mood' && renderMood()}
            {activeTab === 'sleep' && renderSleep()}
            {activeTab === 'energy' && renderEnergy()}
          </div>
        </main>
      </div>
      
      {/* INSIGHTS DASHBOARD OVERLAY */}
      {showInsights && (
        <InsightsDashboard onClose={() => setShowInsights(false)} />
      )}
    </div>
  );
};

export default TrackerPanel;
