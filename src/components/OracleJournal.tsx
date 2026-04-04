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
import { selectSelectedAstroProfile } from '../store';
import { 
  selectSelectedProfile as selectAstrologyProfile,
  selectSelectedProfileChart 
} from '../astrology/store/selectors';
import { calculatePersonalTransits, getCurrentPlanetaryPositions } from '../oracle/birthChartIntegration';
import type { PersonalTransit, PlanetPosition } from '../oracle/birthChartIntegration';
import { JOURNAL_FONTS } from '../oracle/diaryTypes';
import { OracleEngine } from '../oracle/oracleEngine';
import { DiarySearch } from './DiarySearch';
import { JournalSettings } from './JournalSettings';
import { civilToHeka, HEKA_MONTHS } from '../services/calendarService';
import '../styles/oracle-journal.css';
import '../styles/oracle-journal.landscape.css';

// ═════════════════════════════════════════════════════════════════════════════
// MODULE COLOR THEMES - Epic color schemes for the Journal
// ═════════════════════════════════════════════════════════════════════════════

const MODULE_THEMES = [
  { 
    id: 'cosmic', 
    label: 'Cosmic Void', 
    icon: '🌌',
    description: 'Deep space purples and starlight',
    colors: { bg: '#0a0a1a', accent: '#9d4edd', text: '#e0e0ff' }
  },
  { 
    id: 'nebula', 
    label: 'Nebula Dreams', 
    icon: '🌸',
    description: 'Pink and violet cosmic clouds',
    colors: { bg: '#1a0a1a', accent: '#ff6b9d', text: '#ffe0f0' }
  },
  { 
    id: 'aurora', 
    label: 'Aurora Borealis', 
    icon: '🌿',
    description: 'Emerald greens and icy blues',
    colors: { bg: '#0a1a1a', accent: '#00d9a5', text: '#e0fff5' }
  },
  { 
    id: 'solar', 
    label: 'Solar Flare', 
    icon: '☀️',
    description: 'Burning oranges and golds',
    colors: { bg: '#1a120a', accent: '#ff9500', text: '#fff5e0' }
  },
  { 
    id: 'midnight', 
    label: 'Midnight Scholar', 
    icon: '📚',
    description: 'Classic navy and amber',
    colors: { bg: '#0a0f1a', accent: '#ffd700', text: '#f0f0ff' }
  },
  { 
    id: 'obsidian', 
    label: 'Obsidian Mystic', 
    icon: '💎',
    description: 'Black glass and silver moonlight',
    colors: { bg: '#050505', accent: '#c0c0c0', text: '#f0f0f0' }
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// PAGE PAPER THEMES - Visual paper styles
// ═════════════════════════════════════════════════════════════════════════════

const PAPER_THEMES = [
  { 
    id: 'plain', 
    label: 'Plain Paper', 
    icon: '⬜',
    description: 'Clean white canvas',
    style: 'plain'
  },
  { 
    id: 'parchment', 
    label: 'Ancient Parchment', 
    icon: '📜',
    description: 'Aged vellum with texture',
    style: 'parchment'
  },
  { 
    id: 'night', 
    label: 'Night Mode', 
    icon: '🌙',
    description: 'Dark background for evening',
    style: 'night'
  },
  { 
    id: 'celestial', 
    label: 'Celestial Canvas', 
    icon: '✨',
    description: 'Deep indigo with starfield',
    style: 'celestial'
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════════════

interface OracleJournalProps {
  isOpen: boolean;
  onClose: () => void;
}

type JournalMode = 'oracle' | 'entries' | 'celestial' | 'scribe';
type EntryFilter = 'all' | 'insights' | 'transits';

interface CalendarNoteEntry {
  id: string;
  date: string;
  hekaDate: { year: number; month: number; day: number };
  timestamp: string;
  content: string;
  category: string;
  mood?: number;
  sourceKey: string;
}

interface CelestialState {
  positions: Record<string, PlanetPosition>;
  moonPhase: {
    phase: string;
    sign: string;
    illumination: number;
    isVoid: boolean;
  };
  retrogrades: string[];
  loading: boolean;
  error: string | null;
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENT: THE ORACLE JOURNAL
// ═════════════════════════════════════════════════════════════════════════════

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
  
  // ✦ BIRTH CHART - Direct localStorage check (works with ProfileManager/StarsHub)
  const [birthChartInfo, setBirthChartInfo] = useState<{
    hasChart: boolean;
    profileName: string | null;
    chart: any | null;
  }>({ hasChart: false, profileName: null, chart: null });
  
  // Read directly from localStorage when journal opens
  useEffect(() => {
    if (!isOpen) return;
    
    try {
      // ProfileManager stores data in these keys:
      // - celestial-profiles-v1: array of profiles
      // - celestial-active-profile-id: active profile ID
      // - natal-chart-{profileId}: the chart data
      
      const profilesJson = localStorage.getItem('celestial-profiles-v1');
      const activeId = localStorage.getItem('celestial-active-profile-id');
      
      if (!profilesJson) {
        setBirthChartInfo({ hasChart: false, profileName: null, chart: null });
        return;
      }
      
      const profiles = JSON.parse(profilesJson);
      
      if (!Array.isArray(profiles) || profiles.length === 0) {
        setBirthChartInfo({ hasChart: false, profileName: null, chart: null });
        return;
      }
      
      // Find active profile or use first/default
      let profile = profiles.find((p: any) => p.id === activeId);
      if (!profile) {
        profile = profiles.find((p: any) => p.isDefault);
      }
      if (!profile) {
        profile = profiles[0];
      }
      
      // Look for chart in localStorage
      const chartKey = `natal-chart-${profile.id}`;
      const chartJson = localStorage.getItem(chartKey);
      
      if (chartJson) {
        const chart = JSON.parse(chartJson);
        const planetCount = chart?.planets ? Object.keys(chart.planets).length : 0;
        
        setBirthChartInfo({
          hasChart: planetCount > 0,
          profileName: profile.name,
          chart: chart
        });
      } else {
        setBirthChartInfo({
          hasChart: false,
          profileName: profile.name,
          chart: null
        });
      }
    } catch (err) {
      console.error('[OracleJournal] Error reading birth chart:', err);
      setBirthChartInfo({ hasChart: false, profileName: null, chart: null });
    }
  }, [isOpen]);
  
  // Also check Redux stores
  const legacyProfile = useSelector(selectSelectedAstroProfile);
  const astrologyProfile = useSelector(selectAstrologyProfile);
  const astrologyChart = useSelector(selectSelectedProfileChart);
  
  // Simple effective profile
  const effectiveProfile = useMemo(() => {
    // Priority 1: Direct localStorage (ProfileManager/StarsHub)
    if (birthChartInfo.hasChart && birthChartInfo.chart) {
      return {
        name: birthChartInfo.profileName,
        natalChart: birthChartInfo.chart
      };
    }
    
    // Priority 2: Redux stores
    if (legacyProfile?.natalChart) {
      return legacyProfile;
    }
    
    if (astrologyProfile && astrologyChart) {
      return { ...astrologyProfile, natalChart: astrologyChart };
    }
    
    // Priority 3: Profile without chart
    if (birthChartInfo.profileName) {
      return { name: birthChartInfo.profileName, natalChart: null };
    }
    
    return null;
  }, [birthChartInfo, legacyProfile, astrologyProfile, astrologyChart]);
  
  const hasBirthChart = birthChartInfo.hasChart || !!legacyProfile?.natalChart || !!(astrologyProfile && astrologyChart);
  
  // Convert birth chart for transit calculations
  const birthChartData = useMemo(() => {
    if (!effectiveProfile?.natalChart) return null;
    
    const nc = effectiveProfile.natalChart;
    const planets: Record<string, any> = {};
    
    // Handle LEGACY format (positions array)
    if ((nc as any).positions) {
      (nc as any).positions.forEach((pos: any) => {
        const planetName = pos.planet || pos.name;
        if (planetName) {
          planets[planetName] = {
            longitude: pos.exactLongitude || pos.longitude || 0,
            sign: pos.sign,
            degree: Math.floor(pos.degree) || 0,
            minute: Math.floor((pos.degree % 1) * 60) || 0,
            retrograde: pos.isRetrograde || pos.retrograde || false,
            speed: pos.speed || 0,
          };
        }
      });
    }
    
    // Handle ASTROLOGY format (bodies object)
    if ((nc as any).bodies) {
      Object.entries((nc as any).bodies).forEach(([planetId, body]: [string, any]) => {
        if (body) {
          planets[planetId] = {
            longitude: body.longitude || 0,
            sign: body.sign,
            degree: Math.floor(body.degreeInSign || body.longitude % 30) || 0,
            minute: 0,
            retrograde: body.isRetrograde || body.retrograde || false,
            speed: body.speed || 0,
          };
        }
      });
    }
    
    // Handle ProfileManager format (planets object with longitude)
    if ((nc as any).planets && Object.keys(planets).length === 0) {
      Object.entries((nc as any).planets).forEach(([planetId, body]: [string, any]) => {
        if (body && typeof body.longitude === 'number') {
          planets[planetId] = {
            longitude: body.longitude || 0,
            sign: body.sign,
            degree: Math.floor(body.degree || body.longitude % 30) || 0,
            minute: Math.floor((body.degree % 1) * 60) || 0,
            retrograde: body.isRetrograde || body.retrograde || false,
            speed: body.speed || 0,
          };
        }
      });
    }
    
    // Get ascendant from houses if available
    let ascendant = null;
    if (nc.ascendant) {
      ascendant = {
        longitude: (nc.ascendant as any).exactLongitude || (nc.ascendant as any).longitude || 0,
        sign: nc.ascendant.sign,
        degree: Math.floor(nc.ascendant.degree) || 0,
        minute: Math.floor((nc.ascendant.degree % 1) * 60) || 0,
        retrograde: false,
        speed: 0,
      };
    } else if ((nc as any).houses?.cusps?.[0]) {
      const cusp1 = (nc as any).houses.cusps[0];
      ascendant = {
        longitude: cusp1.longitude || 0,
        sign: cusp1.sign,
        degree: Math.floor(cusp1.degreeInSign || cusp1.longitude % 30) || 0,
        minute: 0,
        retrograde: false,
        speed: 0,
      };
    }
    
    return {
      timestamp: nc.calculatedAt || (nc as any).birthDate || Date.now(),
      ascendant,
      planets,
      houses: (nc as any).houses || (nc as any).houses?.cusps || [],
    };
  }, [effectiveProfile]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // LOCAL STATE
  // ─────────────────────────────────────────────────────────────────────────
  
  const [mode, setMode] = useState<JournalMode>('oracle');
  const [entryFilter, setEntryFilter] = useState<EntryFilter>('all');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showPaperThemeSelector, setShowPaperThemeSelector] = useState(false);
  const [showModuleThemeSelector, setShowModuleThemeSelector] = useState(false);
  
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
  const [generatedInsight, setGeneratedInsight] = useState<string | null>(null);
  
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
  }, [hasBirthChart, birthChartData, effectiveProfile?.name]);
  
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
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [isOpen, loadCelestialData, calculatePersonalTransitsData]);
  
  // ─────────────────────────────────────────────────────────────────────────
  // CALENDAR NOTES CONVERSION (Optimized with stable references)
  // ─────────────────────────────────────────────────────────────────────────
  
  const calendarNoteEntries: CalendarNoteEntry[] = useMemo(() => {
    // Early return if no notes
    const noteCount = Object.values(calendarNotes).reduce((sum, notes) => sum + notes.length, 0);
    if (noteCount === 0) return [];
    
    const result: CalendarNoteEntry[] = [];
    
    Object.entries(calendarNotes).forEach(([key, dayNotes]) => {
      dayNotes.forEach((note, index) => {
        // Skip if note is invalid
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
    
    // Sort once at the end
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
      } else if (t.strength >= 60) {
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
    // Guard against invalid timestamps
    if (!timestamp) return 'Unknown Date';
    
    // Handle if timestamp is somehow an object
    if (typeof timestamp === 'object' && !(timestamp instanceof Date)) {
      console.warn('Invalid timestamp object:', timestamp);
      return 'Unknown Date';
    }
    
    const civilDate = new Date(timestamp);
    
    // Check if date is valid
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
  const currentPaperTheme = PAPER_THEMES.find(t => t.id === paperTheme) || PAPER_THEMES[4];
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
  
  // Get paper theme styles for editor
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
          {/* HEADER WITH BACK BUTTON */}
          <header className="oracle-header">
            <div className="oracle-header-mast">
              {/* Back Button */}
              <button className="back-btn" onClick={onClose} title="Back to Calendar">
                <span>←</span>
                <span className="back-label">Back</span>
              </button>
              
              <div className="oracle-logo">
                <span className="oracle-logo-icon">
                  {celestial.loading ? '✨' : getMoonEmoji(celestial.moonPhase.phase)}
                </span>
                <div className="oracle-logo-text">
                  <h1>The Oracle Journal</h1>
                  <span className="oracle-logo-subtitle">
                    {hasBirthChart && effectiveProfile
                      ? `✦ ${effectiveProfile.name}'s Celestial Guide`
                      : '🌟 General celestial guidance'}
                  </span>
                </div>
              </div>
              
              {/* Module Theme Selector */}
              <div className="module-theme-selector">
                <button 
                  className="theme-btn"
                  onClick={() => setShowModuleThemeSelector(!showModuleThemeSelector)}
                  title="Change journal theme"
                >
                  <span className="theme-icon">{currentModuleTheme.icon}</span>
                  {showModuleThemeSelector && (
                    <div className="theme-popover">
                      {MODULE_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          className={`theme-option ${moduleTheme === theme.id ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setModuleTheme(theme.id);
                            setShowModuleThemeSelector(false);
                          }}
                        >
                          <span className="option-icon">{theme.icon}</span>
                          <span className="option-label">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </button>
              </div>
              
              <div className="oracle-celestial-status">
                <div className="celestial-bubble" title="Moon Phase">
                  <span className="celestial-icon">🌙</span>
                  <span className="celestial-value">
                    {celestial.moonPhase.sign} {Math.round(celestial.moonPhase.illumination)}%
                  </span>
                </div>
                {celestial.retrogrades.length > 0 && (
                  <div className="celestial-bubble retrograde">
                    <span className="celestial-icon">℞</span>
                    <span className="celestial-value">{celestial.retrogrades.length}</span>
                  </div>
                )}
                {personalTransits.length > 0 && (
                  <div className="celestial-bubble transits">
                    <span className="celestial-icon">✦</span>
                    <span className="celestial-value">{stats.activeTransits}</span>
                  </div>
                )}
              </div>
            </div>
            
            <nav className="oracle-mode-nav">
              {[
                { id: 'oracle', label: 'Oracle', icon: '🔮' },
                { id: 'entries', label: 'Entries', icon: '📜', count: stats.totalEntries + stats.calendarNotes },
                { id: 'celestial', label: 'Celestial', icon: '✨', count: stats.activeTransits },
                { id: 'scribe', label: 'Scribe', icon: '✍️' },
              ].map((m) => (
                <button
                  key={m.id}
                  className={`mode-btn ${mode === m.id ? 'active' : ''}`}
                  onClick={() => setMode(m.id as JournalMode)}
                >
                  <span className="mode-icon">{m.icon}</span>
                  <span className="mode-label">{m.label}</span>
                  {'count' in m && (m as any).count > 0 && (
                    <span className="mode-badge">{(m as any).count}</span>
                  )}
                </button>
              ))}
              
              <div className="nav-divider" />
              
              <button className="mode-btn icon-only" onClick={() => setIsSearchOpen(true)}>
                🔍
              </button>
              <button className="mode-btn icon-only" onClick={() => setIsSettingsOpen(true)}>
                ⚙️
              </button>
            </nav>
          </header>
          
          {/* MAIN CONTENT */}
          <main className="oracle-content">
            
            {/* MODE: ORACLE */}
            {mode === 'oracle' && (
              <div className="oracle-mode-oracle">
                <div className={`oracle-hero-card ${hasBirthChart ? 'has-chart' : ''}`}>
                  <div className="hero-visual">
                    {hasBirthChart ? (
                      <>
                        <div className="chart-wheel-animation">
                          <div className="wheel-ring ring-1" />
                          <div className="wheel-ring ring-2" />
                          <div className="wheel-ring ring-3" />
                          <div className="wheel-center">
                            {effectiveProfile?.name?.charAt(0) || '✦'}
                          </div>
                        </div>
                        <div className="chart-glow" />
                      </>
                    ) : (
                      <div className="empty-chart-icon">🌟</div>
                    )}
                  </div>
                  
                  <div className="hero-content">
                    <h2>
                      {hasBirthChart && effectiveProfile
                        ? `Welcome, ${effectiveProfile.name}`
                        : 'Begin Your Celestial Journey'}
                    </h2>
                    <p>
                      {hasBirthChart
                        ? `Your birth chart is active with ${Object.keys(birthChartData?.planets || {}).length} planetary positions. ${stats.majorTransits} major transit${stats.majorTransits !== 1 ? 's are' : ' is'} currently influencing your path.`
                        : 'Add your birth chart in the Celestial Guide to unlock personalized insights based on your unique cosmic signature.'}
                    </p>
                    
                    {!hasBirthChart && (
                      <button 
                        className="hero-cta"
                        onClick={() => {
                          onClose();
                          window.dispatchEvent(new CustomEvent('navigate-to-stars'));
                        }}
                      >
                        <span>Create Birth Chart</span>
                        <span className="cta-arrow">→</span>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="oracle-stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{stats.totalEntries}</div>
                    <div className="stat-label">Oracle Entries</div>
                    <div className="stat-icon">📜</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.entriesWithInsights}</div>
                    <div className="stat-label">Insights</div>
                    <div className="stat-icon">🔮</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{stats.streak}</div>
                    <div className="stat-label">Day Streak</div>
                    <div className="stat-icon">✦</div>
                  </div>
                  <div className="stat-card highlight">
                    <div className="stat-value">{stats.activeTransits}</div>
                    <div className="stat-label">Active Transits</div>
                    <div className="stat-icon">🪐</div>
                  </div>
                </div>
                
                <div className="oracle-quick-actions">
                  <button className="action-card" onClick={() => setMode('scribe')}>
                    <span className="action-icon">✍️</span>
                    <span className="action-label">New Entry</span>
                  </button>
                  <button className="action-card" onClick={() => setMode('celestial')}>
                    <span className="action-icon">✨</span>
                    <span className="action-label">View Transits</span>
                  </button>
                  <button className="action-card" onClick={() => setMode('entries')}>
                    <span className="action-icon">📜</span>
                    <span className="action-label">Browse Entries</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* MODE: ENTRIES */}
            {mode === 'entries' && (
              <div className="oracle-mode-entries">
                <div className="entries-filters">
                  {[
                    { id: 'all', label: 'All Entries', icon: '📜' },
                    { id: 'insights', label: 'With Insights', icon: '🔮' },
                    { id: 'transits', label: 'Calendar Notes', icon: '📅' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      className={`filter-tab ${entryFilter === f.id ? 'active' : ''}`}
                      onClick={() => setEntryFilter(f.id as EntryFilter)}
                    >
                      <span>{f.icon}</span>{f.label}
                    </button>
                  ))}
                </div>
                
                <div className="entries-list">
                  {entryFilter !== 'transits' && entries.length === 0 && (
                    <div className="entries-empty">
                      <div className="empty-icon">📜</div>
                      <h3>No Oracle Entries Yet</h3>
                      <button className="empty-cta" onClick={() => setMode('scribe')}>
                        Start Writing
                      </button>
                    </div>
                  )}
                  
                  {entryFilter === 'transits' && calendarNoteEntries.length === 0 && (
                    <div className="entries-empty">
                      <div className="empty-icon">📅</div>
                      <h3>No Calendar Notes</h3>
                    </div>
                  )}
                  
                  {(entryFilter === 'all' || entryFilter === 'insights') && entries.map((entry) => (
                    <div 
                      key={entry.id} 
                      className={`entry-card ${entry.insight ? 'has-insight' : ''}`}
                      onClick={() => {
                        setEditingEntryId(entry.id);
                        setScribeContent(entry.content);
                        setMode('scribe');
                      }}
                    >
                      <div className="entry-header">
                        <span className="entry-date">{formatEntryDate(entry.timestamp)}</span>
                        {entry.insight && <span className="entry-badge insight">🔮 Insight</span>}
                      </div>
                      <p className="entry-preview">{entry.content.slice(0, 120)}...</p>
                      {entry.insight && (
                        <div className="entry-insight">
                          <span>✨</span>
                          <span>{entry.insight.text.slice(0, 80)}...</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {entryFilter === 'transits' && calendarNoteEntries.map((note) => (
                    <div 
                      key={note.id} 
                      className="entry-card calendar-note"
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new CustomEvent('navigate-to-date', { 
                          detail: { dateKey: note.sourceKey } 
                        }));
                      }}
                    >
                      <div className="entry-header">
                        <span className="entry-date">{formatEntryDate(note.timestamp)}</span>
                        <span className="entry-badge calendar">📅 Calendar</span>
                      </div>
                      <p className="entry-preview">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* MODE: CELESTIAL */}
            {mode === 'celestial' && (
              <div className="oracle-mode-celestial">
                {celestial.loading ? (
                  <div className="celestial-loading">
                    <div className="loading-orb">
                      <div className="orb-ring" />
                      <div className="orb-core">✨</div>
                    </div>
                    <p>Consulting the Swiss Ephemeris...</p>
                  </div>
                ) : (
                  <>
                    <div className="celestial-section">
                      <h3 className="section-title"><span>🌙</span> Current Celestial Weather</h3>
                      <div className="planetary-grid">
                        {Object.entries(celestial.positions).slice(0, 7).map(([planet, pos]) => (
                          <div key={planet} className={`planet-card ${pos.retrograde ? 'retrograde' : ''}`}>
                            <span className="planet-symbol">{getPlanetSymbol(planet)}</span>
                            <span className="planet-name">{planet}</span>
                            <span className="planet-position">
                              {pos.sign} {pos.degree}°
                              {pos.retrograde && <span className="retro-badge">℞</span>}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {hasBirthChart && (
                      <div className="celestial-section">
                        <h3 className="section-title"><span>✦</span> Your Personal Transits</h3>
                        
                        {personalTransits.length === 0 ? (
                          <p className="section-empty">No major transits at this moment.</p>
                        ) : (
                          <div className="transits-list">
                            {personalTransits
                              .sort((a, b) => b.strength - a.strength)
                              .slice(0, 8)
                              .map((transit) => (
                              <div 
                                key={transit.id} 
                                className={`transit-card strength-${Math.floor(transit.strength / 20)}`}
                                onClick={() => setActiveTransit(transit)}
                              >
                                <div className="transit-symbols">
                                  <span>{getPlanetSymbol(transit.transitingPlanet)}</span>
                                  <span className="aspect">{getAspectSymbol(transit.aspect)}</span>
                                  <span>{getPlanetSymbol(transit.natalPlanet)}</span>
                                </div>
                                <div className="transit-info">
                                  <span className="transit-name">
                                    {transit.transitingPlanet} {transit.aspect} {transit.natalPlanet}
                                  </span>
                                  <span className="transit-house">
                                    H{transit.activatedHouse} → H{transit.natalHouse}
                                  </span>
                                </div>
                                <div className="transit-strength" style={{
                                  color: transit.strength >= 80 ? '#22c55e' : 
                                         transit.strength >= 60 ? '#3b82f6' : '#eab308'
                                }}>
                                  {transit.strength}%
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            {/* MODE: SCRIBE with Paper Theme Selector */}
            {mode === 'scribe' && (
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
                          onClick={() => handlePaperThemeChange(theme.id)}
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
                
                <div className="scribe-editor">
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
                    <div className="scribe-insight">
                      <div className="insight-header">
                        <span>🔮 Oracle Insight</span>
                        <button onClick={() => setGeneratedInsight(null)}>×</button>
                      </div>
                      <p>{generatedInsight}</p>
                    </div>
                  )}
                </div>
                
                <div className="scribe-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      setMode('entries');
                      setScribeContent('');
                      setEditingEntryId(null);
                      setGeneratedInsight(null);
                      setShowPaperThemeSelector(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-insight"
                    onClick={async () => {
                      if (!scribeContent.trim()) return;
                      setIsGeneratingInsight(true);
                      
                      try {
                        // Get current celestial state
                        const celestialState = await OracleEngine.getCurrentCelestialState(new Date());
                        
                        // Analyze content for themes
                        const themes = OracleEngine.analyzeContent(scribeContent);
                        
                        // Get birth chart if available
                        const birthChart = birthChartInfo.hasChart ? birthChartInfo.chart : undefined;
                        
                        // Generate insights with celestial synchronicity
                        const insights = OracleEngine.generateInsights(themes, celestialState, birthChart);
                        const bestInsight = OracleEngine.selectBestInsight(insights);
                        
                        if (bestInsight) {
                          setGeneratedInsight(bestInsight.text);
                        } else {
                          // Fallback if no insight matches
                          setGeneratedInsight(`The Moon in ${celestialState.moonPhase.sign} invites you to reflect on your words. Your journal entry resonates with the current cosmic rhythm.`);
                        }
                      } catch (error) {
                        console.error('Insight generation failed:', error);
                        setGeneratedInsight('The Oracle is momentarily clouded. Trust your own wisdom for now.');
                      }
                      
                      setIsGeneratingInsight(false);
                    }}
                    disabled={!scribeContent.trim() || isGeneratingInsight}
                  >
                    {isGeneratingInsight ? '✨ Consulting...' : '🔮 Seek Insight'}
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleSaveEntry}
                    disabled={!scribeContent.trim()}
                  >
                    {editingEntryId ? 'Update Entry' : 'Save to Oracle'}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
        
        {/* Transit Detail Modal */}
        {activeTransit && (
          <div className="transit-modal-overlay" onClick={() => setActiveTransit(null)}>
            <div className="transit-modal" onClick={e => e.stopPropagation()}>
              <h3>{activeTransit.transitingPlanet} {activeTransit.aspect} Natal {activeTransit.natalPlanet}</h3>
              <div className="transit-orb">
                <span>Orb: {activeTransit.orb.toFixed(1)}°</span>
                <span className="strength">Strength: {activeTransit.strength}%</span>
              </div>
              <p className="transit-interpretation">{activeTransit.interpretation}</p>
              <div className="transit-keywords">
                {activeTransit.keywords.map((k, i) => <span key={i} className="keyword">{k}</span>)}
              </div>
              <button className="close-transit" onClick={() => setActiveTransit(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
      
      {/* Search Modal */}
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
          onCalendarNoteSelect={(sourceKey) => {
            onClose();
            window.dispatchEvent(new CustomEvent('navigate-to-date', { detail: { dateKey: sourceKey } }));
          }}
          calendarNotes={searchCalendarNotes}
          theme={paperTheme}
        />
      )}
      
      {/* Settings Modal - Now only for fonts and other preferences */}
      {isSettingsOpen && (
        <JournalSettings
          isOpen={true}
          onClose={() => setIsSettingsOpen(false)}
          theme={paperTheme}
        />
      )}
    </>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

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

function getMoonEmoji(phase: string): string {
  const emojis: Record<string, string> = {
    'new': '🌑', 'waxing_crescent': '🌒', 'first_quarter': '🌓',
    'waxing_gibbous': '🌔', 'full': '🌕', 'waning_gibbous': '🌖',
    'last_quarter': '🌗', 'waning_crescent': '🌘',
  };
  return emojis[phase] || '🌙';
}

function getPlanetSymbol(planet: string): string {
  const symbols: Record<string, string> = {
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
    Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇',
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
  };
  return symbols[planet] || '●';
}

function getAspectSymbol(aspect: string): string {
  const symbols: Record<string, string> = {
    conjunction: '☌', sextile: '⚹', square: '□', trine: '△', 
    opposition: '☍', quincunx: '⚻'
  };
  return symbols[aspect] || aspect;
}

export default OracleJournal;
