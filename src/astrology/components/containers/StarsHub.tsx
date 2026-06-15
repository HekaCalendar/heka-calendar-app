/**
 * Stars Hub - Enterprise Astrology Dashboard
 * Premium celestial intelligence interface
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useVisibility } from '../../../hooks/useVisibility';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { AppDispatch, RootState } from '../../../store';
import { initializeAstrology, updateProfilePreferences, generateChartForProfile } from '../../store/thunks';
import { updateAstroPreferences } from '../../../store';
import { selectSelectedProfileChart, selectAllProfiles } from '../../store/selectors';
import {
  calculateCurrentSky,
  calculatePreciseMoonPhase,
  getCurrentPlanetaryHour,
  calculateRetrogrades,
  calculateLocalHouses,
  clearCalculationCache,
} from '../../services/calculations/swissCalculations';
import { initializeSwissEphemeris, setZodiacSystem, setSiderealMode } from '../../services/swiss-ephemeris/engine';
import type { CelestialBody } from '../../types';
import { PLANET_NAMES, SIGN_ELEMENTS, SIGN_MODALITIES, SIGN_ELEMENTS_13, SIGN_MODALITIES_13 } from '../../types';
import DailyBriefing from '../presentation/DailyBriefing';
import { VoidMoonSanctuary } from '../sanctuary/VoidMoonSanctuary';
import { CelestialGuidanceV2 } from '../guidance/CelestialGuidanceV2';
import { BirthChartView } from '../chart/BirthChartView';
import ThemeSelector from '../cosmic/ThemeSelector';
import FontSelector from '../cosmic/FontSelector';
import { PremiumCards } from '../cosmic/PremiumCards';
import { AIProviderSettings } from '../cosmic/AIProviderSettings';
import { CELESTIAL_THEMES, DEFAULT_CELESTIAL_THEME, generateThemeCSS, type CelestialThemeId } from './CelestialThemes';
import './StarsHub.css';
import './StarsHub.landscape.css';
import { NotificationEngine } from '../../../services/notificationEngine';
import { profileManager } from '../../services/natal/profileManager';
import { getUnifiedUserBirthData, deleteUnifiedChart, getUnifiedChart } from '../../utils/chartBridge';
import { CelestialErrorBoundary } from '../error/CelestialErrorBoundary';
import { dialogService } from '../../../components/ui/DialogProvider';
import { StarfieldCanvas } from '../../../components/onboarding/v3/StarfieldCanvas';
import { TwoSelvesModal } from '../modals/TwoSelvesModal';
import type { BirthData as TwoSelvesBirthData } from '../../services/natal/natalChart';
import { StarsNotificationSettings } from '../../../components/notification/StarsNotificationSettings';

// Normalize the two different BirthData shapes used across the app for the Two Selves modal.
function normalizeTwoSelvesBirthData(chart: any): TwoSelvesBirthData | null {
  const bd = chart?.birthData;
  if (!bd) return null;
  if (typeof bd.date === 'string') {
    return {
      date: bd.date,
      time: bd.time,
      latitude: typeof bd.latitude === 'number' ? bd.latitude : bd.location?.latitude ?? 0,
      longitude: typeof bd.longitude === 'number' ? bd.longitude : bd.location?.longitude ?? 0,
      timezone: String(bd.timezone ?? 'UTC'),
      locationName: bd.locationName || bd.location?.locationName,
    };
  }
  if (typeof bd.birthDate === 'string') {
    return {
      date: bd.birthDate,
      time: bd.birthTime,
      latitude: bd.location?.latitude ?? 0,
      longitude: bd.location?.longitude ?? 0,
      timezone: String(bd.timezone ?? bd.location?.timezone ?? 'UTC'),
      locationName: bd.location?.locationName,
    };
  }
  return null;
}

// Module-level debounce guards — survive rapid remounts
let globalAstrologyInitTs = 0;
let globalNotifInitTs = 0;
let globalGeoRequestTs = 0;

const SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
};

const SIGNS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
  ophiuchus: '⛎' // 13th sign
};

// Zodiac signs order for 12 and 13 sign systems
const ZODIAC_ORDER_12 = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const ZODIAC_ORDER_13 = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'ophiuchus', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

const VOID_MOON_DEFAULT = { isVoid: false };

// Helper to get signs array based on zodiac system (used for sign displays)
export const getZodiacSigns = (use13Signs: boolean) => use13Signs ? ZODIAC_ORDER_13 : ZODIAC_ORDER_12;

function getPlanetDomain(planet: string, t: (key: string, options?: any) => string): string {
  return t(`planetDomains.${planet.toLowerCase()}`, { defaultValue: t('planetDomains.default') });
}

function parseThemeCSS(theme: typeof CELESTIAL_THEMES[CelestialThemeId]): React.CSSProperties {
  const style: React.CSSProperties = {};
  generateThemeCSS(theme)
    .split('\n')
    .filter((line) => line.includes(':'))
    .forEach((line) => {
      const [key, value] = line.split(':');
      if (key?.trim()) {
        (style as Record<string, string>)[key.trim()] = value?.replace(';', '').trim() || '';
      }
    });
  return style;
}

type TabType = 'overview' | 'guidance' | 'void-moon' | 'positions' | 'chart' | 'settings';
type CelestialFontId = 'stellar' | 'cosmic' | 'nebula' | 'void' | 'oracle' | 'quantum';

export const StarsHub: React.FC = () => {
  const { t } = useTranslation('celestial');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector(selectAllProfiles);
  
  // Use unified chart retrieval that checks BOTH legacy and Redux storage
  const reduxChart = useSelector(selectSelectedProfileChart);
  
  // Cache unified chart lookup to prevent localStorage reads on every render.
  // Refresh when the Redux chart changes so the fallback stays in sync.
  const unifiedChart = useMemo(() => getUnifiedChart(), [reduxChart]);

  // Prefer Redux chart if available, fall back to unified (legacy) chart
  const natalChart = reduxChart || unifiedChart;

  const zodiacSystem = useSelector((state: RootState) => state.calendar.astroPreferences.zodiacSystem);
  const zodiacFrame = useSelector((state: RootState) => state.calendar.astroPreferences.zodiacFrame);
  const signCount = useSelector((state: RootState) => state.calendar.astroPreferences.signCount);
  const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
  const dailyCelestialTips = useSelector((state: RootState) => state.calendar.notificationPreferences.stars.dailyCelestialTips);
  const retrogradeAlerts = useSelector((state: RootState) => state.calendar.notificationPreferences.stars.retrogradeAlerts);
  const selectedProfileId = useSelector((state: RootState) => state.astrology.ui.selectedProfileId);

  // Cache unified birth data; only re-read when the active profile changes
  const unifiedBirthData = useMemo(() => getUnifiedUserBirthData(), [selectedProfileId, natalChart]);

  // Refs for managing async operations and cleanup
  const zodiacAbortControllerRef = useRef<AbortController | null>(null);
  const calculationAbortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const isVisible = useVisibility();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [positions, setPositions] = useState<Record<string, CelestialBody> | null>(null);
  const [skyData, setSkyData] = useState<{ positions: Record<string, CelestialBody>; julianDay: number; timestamp: number } | null>(null);
  const [moonPhase, setMoonPhase] = useState<any>(null);
  const [planetaryHour, setPlanetaryHour] = useState<any>(null);
  const [retrogrades, setRetrogrades] = useState<any[]>([]);
  const [localHouses, setLocalHouses] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [julianDay, setJulianDay] = useState<number>(0);
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<CelestialThemeId>(() => {
    return (localStorage.getItem('ci-theme') as CelestialThemeId) || DEFAULT_CELESTIAL_THEME;
  });
  const [font, setFont] = useState<CelestialFontId>(() => {
    return (localStorage.getItem('ci-font') as CelestialFontId) || 'nebula';
  });
  // User location for location-aware calculations
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number; timezone: number} | null>(() => {
    const saved = localStorage.getItem('ci-location');
    return saved ? JSON.parse(saved) : null;
  });
  const [locationName, setLocationName] = useState<string>(() => {
    return localStorage.getItem('ci-location-name') || 'Universal';
  });
  const [showTwoSelves, setShowTwoSelves] = useState(false);
  
  // Save preferences when changed
  useEffect(() => {
    localStorage.setItem('ci-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('ci-font', font);
  }, [font]);
  
  // Get user geolocation for location-aware calculations
  useEffect(() => {
    const now = Date.now();
    if (now - globalGeoRequestTs < 30000) {
      // Still restore saved location from localStorage if available
      const saved = localStorage.getItem('ci-location');
      if (saved) {
        try {
          const loc = JSON.parse(saved);
          setUserLocation(loc);
        } catch { /* ignore */ }
      }
      return;
    }
    globalGeoRequestTs = now;

    const requestLocation = async () => {
      if (!navigator.geolocation) {
        console.warn('[StarsHub] Geolocation not supported');
        return;
      }
      
      // Check if we already have permission
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          
          if (result.state === 'denied') {
            console.warn('[StarsHub] Geolocation permission denied');
            return;
          }
        } catch (e) {
          // Permissions API not fully supported, proceed anyway
        }
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timezone: -new Date().getTimezoneOffset() / 60,
          };
          setUserLocation(loc);
          localStorage.setItem('ci-location', JSON.stringify(loc));
          
          // Try to get location name from coordinates
          import('../../../utils/fetchWithTimeout').then(({ fetchWithTimeout }) => fetchWithTimeout(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${loc.latitude}&longitude=${loc.longitude}&localityLanguage=en`,
            { timeout: 10000 }
          ))
            .then(r => r.json())
            .then(data => {
              const name = data.city || data.locality || 'Local';
              setLocationName(name);
              localStorage.setItem('ci-location-name', name);
            })
            .catch(() => {
              setLocationName(`${loc.latitude.toFixed(1)}°, ${loc.longitude.toFixed(1)}°`);
            });
        },
        (error) => {
          console.warn('[StarsHub] Geolocation error:', error.code, error.message);
          // Fall back to stored or universal
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
      );
    };
    
    requestLocation();
  }, []);

  // Track mount state for async cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handle deep-links from AI coach / journal / other components
  useEffect(() => {
    try {
      const deeplink = sessionStorage.getItem('stars-deeplink');
      if (deeplink) {
        const parsed = JSON.parse(deeplink);
        if (parsed?.tab) {
          const validTabs: TabType[] = ['overview', 'guidance', 'void-moon', 'positions', 'chart', 'settings'];
          if (validTabs.includes(parsed.tab)) {
            setActiveTab(parsed.tab);
          }
        }
        sessionStorage.removeItem('stars-deeplink');
      }
    } catch {
      // ignore malformed deeplink
    }
  }, []);

  // Get current theme config
  const currentTheme = CELESTIAL_THEMES[theme];

  // Initialize Swiss Ephemeris first
  useEffect(() => {
    const init = async () => {
      try {
        await initializeSwissEphemeris();
        if (isMountedRef.current) {
          setIsReady(true);
        }
      } catch (error) {
        console.error('[StarsHub] Failed to initialize:', error);
      }
    };
    init();
  }, []);
  
  // Update time every minute when visible, every 5 minutes when backgrounded
  useEffect(() => {
    const interval = isVisible ? 60000 : 300000;
    const timer = setInterval(() => setCurrentTime(new Date()), interval);
    return () => clearInterval(timer);
  }, [isVisible]);
  
  // Calculate astronomical data (only when ready)
  // Uses AbortController to cancel stale calculations
  useEffect(() => {
    if (!isReady) return;
    
    // Cancel any previous calculation
    if (calculationAbortControllerRef.current) {
      calculationAbortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    calculationAbortControllerRef.current = abortController;
    const { signal } = abortController;
    
    const calculate = async () => {
      try {
        // Sky positions and planetary hour can be computed in parallel.
        const [skyData, hour] = await Promise.all([
          calculateCurrentSky(currentTime),
          userLocation
            ? getCurrentPlanetaryHour(
                currentTime,
                userLocation.latitude,
                userLocation.longitude,
                userLocation.timezone ?? 0
              )
            : Promise.resolve(null),
        ]);
        if (signal.aborted || !isMountedRef.current) return;

        setPositions(skyData.positions);
        setSkyData(skyData);
        setJulianDay(skyData.julianDay);
        if (hour) setPlanetaryHour(hour);

        // Moon phase, retrogrades, and houses depend on skyData/location.
        const [phase, retro, houses] = await Promise.all([
          skyData.positions.sun && skyData.positions.moon
            ? Promise.resolve(
                calculatePreciseMoonPhase(skyData.positions.sun, skyData.positions.moon)
              )
            : Promise.resolve(null),
          skyData.positions
            ? Promise.resolve(calculateRetrogrades(skyData.positions))
            : Promise.resolve([]),
          userLocation
            ? calculateLocalHouses(
                currentTime,
                userLocation.latitude,
                userLocation.longitude,
                'placidus'
              )
            : Promise.resolve(null),
        ]);
        if (signal.aborted || !isMountedRef.current) return;

        if (phase) setMoonPhase(phase);
        if (retro) setRetrogrades(retro.filter((r: any) => r.isRetrograde));
        if (houses) setLocalHouses(houses);
      } catch (error) {
        if (!signal.aborted) {
          console.error('[StarsHub] Calculation error:', error);
        }
      }
    };
    
    calculate();
    
    // Cleanup: abort on unmount or dependency change
    return () => {
      abortController.abort();
    };
  }, [currentTime, isReady, userLocation, zodiacSystem, zodiacFrame, signCount]);
  
  // Initialize astrology on mount — guard against rapid remounts
  const initAstrologyDispatchedRef = useRef(false);
  useEffect(() => {
    if (initAstrologyDispatchedRef.current) return;
    initAstrologyDispatchedRef.current = true;
    const now = Date.now();
    if (now - globalAstrologyInitTs < 5000) {
      return;
    }
    globalAstrologyInitTs = now;
    dispatch(initializeAstrology());
  }, [dispatch]);
  
  // Initialize notifications on mount — guard against rapid remounts
  const notifInitRef = useRef(false);
  useEffect(() => {
    if (notifInitRef.current) return;
    notifInitRef.current = true;
    const now = Date.now();
    if (now - globalNotifInitTs < 5000) {
      return;
    }
    globalNotifInitTs = now;
    void NotificationEngine.initialize();
  }, []);
  
  // Schedule daily celestial tips when preference changes
  useEffect(() => {
    if (dailyCelestialTips) {
      const now = new Date();
      const scheduleTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0, 0);
      if (scheduleTime <= now) scheduleTime.setDate(scheduleTime.getDate() + 1);
      const seed = new Date().toISOString().split('T')[0];
      NotificationEngine.scheduleTemplated(
        'daily-celestial-tips',
        'standard',
        'stars',
        scheduleTime,
        seed,
        {},
        { type: 'daily-celestial-tips' }
      ).catch((err) => {
        console.error('[StarsHub] Failed to schedule daily tips:', err);
      });
    } else {
      void NotificationEngine.cancelByType('daily-celestial-tips');
    }
  }, [dailyCelestialTips]);
  
  // Stable signature so we don't cancel/reschedule alerts every minute when
  // the retrograde data itself hasn't materially changed.
  const retrogradeSignature = useMemo(
    () => retrogrades.map((r) => r.planet).sort().join(','),
    [retrogrades]
  );

  // Schedule retrograde alerts when preference changes
  useEffect(() => {
    if (retrogradeAlerts && retrogrades.length > 0) {
      for (const retro of retrogrades) {
        // Schedule 3 days before each retrograde start
        // (This is a simplified placeholder — real implementation would use exact station dates)
        const alertDate = new Date(Date.now() + 3 * 86400000);
        const seed = retro.planet + alertDate.toISOString().split('T')[0];
        NotificationEngine.scheduleTemplated(
          'retrograde-alert',
          'ambient',
          'stars',
          alertDate,
          seed,
          { planet: retro.planet, domain: getPlanetDomain(retro.planet, t) },
          { type: 'retrograde-alert', planet: retro.planet }
        ).catch((err) => {
          console.error('[StarsHub] Failed to schedule retrograde alert:', err);
        });
      }
    } else {
      void NotificationEngine.cancelByType('retrograde-alert');
    }
  }, [retrogradeAlerts, retrogradeSignature]);
  
  // Recalculate chart when zodiac system changes
  // Uses AbortController pattern to prevent race conditions on rapid toggles
  useEffect(() => {
    // Cancel any previous zodiac recalculation
    if (zodiacAbortControllerRef.current) {
      zodiacAbortControllerRef.current.abort();
    }
    
    // Create new abort controller for this operation
    const abortController = new AbortController();
    zodiacAbortControllerRef.current = abortController;
    const { signal } = abortController;
    
    // Clear calculation cache to ensure fresh calculations
    clearCalculationCache();
    
    // Set the zodiac system in the Swiss Ephemeris engine FIRST
    setZodiacSystem(zodiacSystem);
    // Configure sidereal mode so WASM ayanamsa is applied correctly
    if (zodiacFrame === 'sidereal') {
      setSiderealMode('lahiri');
    } else {
      setSiderealMode(null);
    }
    // Also set split fields for new engine API
    import('../../services/swiss-ephemeris/engine').then(({ setZodiacFrame: setEngineFrame, setSignCount: setEngineCount }) => {
      setEngineFrame(zodiacFrame);
      setEngineCount(signCount);
    });
    
    const recalculate = async () => {
      const activeProfile = profileManager.getActiveProfile();
      
      if (!activeProfile || signal.aborted) {
        return;
      }
      
      try {
        // 1. Update the profile's preferences in the astrology slice
        if (selectedProfileId && !signal.aborted) {
          await dispatch(updateProfilePreferences({
            profileId: selectedProfileId,
            preferences: { zodiacSystem, zodiacFrame, signCount }
          }));
        }
        
        if (signal.aborted) return;
        
        // 2. Regenerate the chart with the new zodiac system
        if (selectedProfileId) {
          await dispatch(generateChartForProfile(selectedProfileId));
        }
        
        if (signal.aborted) return;
        
        // 3. Also update via ProfileManager for backward compatibility
        await profileManager.recalculateChartWithZodiacSystem(activeProfile.id, zodiacSystem, zodiacFrame, signCount);
        
        if (signal.aborted) return;
        
        // 4. Refresh the astrology data
        if (isMountedRef.current) {
          dispatch(initializeAstrology());
        }
        
        // 5. Show Two Selves modal on first switch to sidereal
        if (zodiacFrame === 'sidereal' && isMountedRef.current) {
          const flagKey = `heka-two-selves-seen-${activeProfile.id}`;
          // Set flag immediately (before async timeout) to prevent race conditions
          // if this effect re-runs before the timeout fires
          if (!localStorage.getItem(flagKey)) {
            localStorage.setItem(flagKey, 'true');
            // Small delay to let the recalculation finish and chart render
            setTimeout(() => {
              if (isMountedRef.current) {
                setShowTwoSelves(true);
              }
            }, 800);
          }
        }
        
      } catch (error) {
        if (!signal.aborted) {
          console.error('[StarsHub] Zodiac recalculation error:', error);
        }
      }
    };
    
    recalculate();
    
    // Cleanup: abort on unmount or dependency change
    return () => {
      abortController.abort();
    };
  }, [zodiacSystem, zodiacFrame, signCount, dispatch, selectedProfileId]);

  const tabs: { id: TabType; label: string; icon: string; badge?: number }[] = useMemo(() => [
    { id: 'overview', label: t('starsHub.overview'), icon: '◈' },
    { id: 'guidance', label: t('starsHub.guidance'), icon: '◐' },
    { id: 'void-moon', label: t('starsHub.voidMoon'), icon: '🌑' },
    { id: 'positions', label: t('starsHub.positions'), icon: '✧' },
    { id: 'chart', label: t('starsHub.chart'), icon: '◉' },
    { id: 'settings', label: t('starsHub.settings'), icon: '⚙' },
  ], [t]);

  const themeStyle = useMemo(() => parseThemeCSS(currentTheme), [currentTheme]);

  const handleBack = useCallback(() => navigate('/'), [navigate]);
  const handleSetTropical = useCallback(() => {
    dispatch(updateAstroPreferences({ zodiacSystem: '12-sign', zodiacFrame: 'tropical', signCount: 12 }));
  }, [dispatch]);
  const handleSetSidereal = useCallback(() => {
    dispatch(updateAstroPreferences({ zodiacSystem: 'sidereal', zodiacFrame: 'sidereal', signCount }));
  }, [dispatch, signCount]);
  const handleSet12Signs = useCallback(() => {
    dispatch(updateAstroPreferences({ zodiacSystem: 'sidereal', zodiacFrame: 'sidereal', signCount: 12 }));
  }, [dispatch]);
  const handleSet13Signs = useCallback(() => {
    dispatch(updateAstroPreferences({ zodiacSystem: 'sidereal', zodiacFrame: 'sidereal', signCount: 13 }));
  }, [dispatch]);
  const handleOpenSettings = useCallback(() => setActiveTab('settings'), []);
  const handleTabClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const tab = e.currentTarget.dataset.tab as TabType;
    if (tab) setActiveTab(tab);
  }, []);

  return (
    <div className={`stars-hub ci-font-${font}`} style={themeStyle}>

      {/* Two Selves Modal */}
      {showTwoSelves && natalChart && normalizeTwoSelvesBirthData(natalChart) && (
        <TwoSelvesModal
          isOpen={showTwoSelves}
          onClose={() => setShowTwoSelves(false)}
          birthData={normalizeTwoSelvesBirthData(natalChart)!}
        />
      )}

      {/* Full-screen animated starfield — same quality as tutorial */}
      <div className="stars-hub__canvas">
        <StarfieldCanvas />
      </div>
      
      {/* Sticky Header Container */}
      <div className="sh-header-container">
        {/* Main Title - Always visible */}
        <div className="sh-title-bar">
          <h1 className="sh-main-title">{t('starsHub.celestialIntelligence')}</h1>
        </div>
        
        {/* Header with Back and Live */}
        <header className="sh-header">
          <button
            className="sh-back"
            onClick={handleBack}
          >
            {t('starsHub.back')}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {locationName && (
              <span style={{ 
                fontSize: '13px', 
                color: 'var(--ci-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span>📍</span>
                {locationName}
              </span>
            )}
            <span className="sh-live-indicator">
              <span className="sh-live-dot"></span>
              {t('starsHub.live')}
            </span>
          </div>
        </header>
        
        {/* Navigation Tabs - Sticky */}
        <nav className="sh-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`sh-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={handleTabClick}
            data-tab={tab.id}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.badge !== undefined && (
              <span className="sh-tab-badge">{tab.badge}</span>
            )}
          </button>
        ))}
      </nav>
      </div>
      
      {/* Main Content */}
      <main className="sh-container">
        {/* Sidebar - Premium Expandable Cards */}
        {activeTab === 'overview' && (
          <aside className="sh-sidebar">
            <PremiumCards
              currentTime={currentTime}
              julianDay={julianDay}
              positions={positions}
              moonPhase={moonPhase}
              planetaryHour={planetaryHour}
              retrogrades={retrogrades}
              localHouses={localHouses}
            />
          </aside>
        )}
        
        {/* Content Area */}
        <div className="sh-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Welcome Banner */}
              <div className="sh-welcome">
                <h2>
                  {natalChart 
                    ? t('starsHub.welcomeBack', { name: profiles[0]?.name?.split(' ')[0] || 'Seeker' }) 
                    : t('starsHub.universalSky')}
                </h2>
                <p>
                  {natalChart 
                    ? `Today's celestial weather personalized for your natal chart. ${retrogrades.length > 0 ? `Navigate ${retrogrades.length} retrograde${retrogrades.length > 1 ? 's' : ''} with awareness.` : 'All planets direct — a time for forward momentum.'}`
                    : 'Explore the current celestial landscape. Create a profile for personalized astrological guidance.'
                  }
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="sh-stats-grid">
                <div className="sh-stat-card">
                  <div className="sh-stat-value">
                    {moonPhase ? moonPhase.name.split(' ')[0] : '--'}
                  </div>
                  <div className="sh-stat-label">{t('starsHub.moonPhase')}</div>
                </div>
                <div className="sh-stat-card">
                  <div className="sh-stat-value">
                    {planetaryHour ? planetaryHour.symbol : '--'}
                  </div>
                  <div className="sh-stat-label">{t('starsHub.hourRuler')}</div>
                </div>
                <div className="sh-stat-card">
                  <div className="sh-stat-value" style={{ color: retrogrades.length > 0 ? '#ef4444' : 'var(--success)' }}>
                    {retrogrades.length}
                  </div>
                  <div className="sh-stat-label">{t('starsHub.retrogrades')}</div>
                </div>
                <div className="sh-stat-card">
                  <div className="sh-stat-value">
                    {positions?.sun?.sign ? SIGNS[positions.sun.sign] : '--'}
                  </div>
                  <div className="sh-stat-label">{t('starsHub.sunSign')}</div>
                </div>
              </div>
              
              {/* Daily Briefing */}
              <div className="sh-section">
                <div className="sh-section-header">
                  <div className="sh-section-title">
                    <span>◈</span>
                    {t('starsHub.dailyBriefing')}
                  </div>
                </div>
                <div className="sh-section-content">
                  <DailyBriefing positions={positions} />
                </div>
              </div>
            </>
          )}
          
          {/* Cosmic Guidance Tab - Phase 2 Enhanced */}
          {activeTab === 'guidance' && (
            <div className="sh-section" style={{ padding: 0, background: 'transparent', border: 'none' }}>
              <CelestialErrorBoundary componentName="Celestial Guidance">
                <CelestialGuidanceV2 
                  latitude={userLocation?.latitude ?? 0}
                  longitude={userLocation?.longitude ?? 0}
                  voidMoonData={VOID_MOON_DEFAULT}
                  natalChart={natalChart}
                  skyData={skyData}
                  planetaryHour={planetaryHour?.planet}
                  onOpenSettings={handleOpenSettings}
                />
              </CelestialErrorBoundary>
            </div>
          )}
          
          {/* Void Moon Tab - The Sanctuary */}
          {activeTab === 'void-moon' && (
            <div style={{ 
              maxWidth: '100%', 
              minHeight: 'calc(100vh - 200px)',
              margin: 0,
              padding: 0,
              overflow: 'visible',
            }}>
              <VoidMoonSanctuary
                userBirthData={unifiedBirthData}
                skyData={skyData}
              />
            </div>
          )}
          
          {/* Positions Tab */}
          {activeTab === 'positions' && (
            <PlanetaryPositions 
              positions={positions} 
              localHouses={localHouses}
            />
          )}
          
          {/* Chart Tab - Phase 3: The Birth Chart Renaissance */}
          {activeTab === 'chart' && (
            <div className="sh-section" style={{ padding: 0, background: 'transparent', border: 'none' }}>
              <CelestialErrorBoundary componentName="Birth Chart">
                <BirthChartView />
              </CelestialErrorBoundary>
            </div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="sh-section">
              <div className="sh-section-header">
                <div className="sh-section-title">
                  <span>⚙</span>
                  Observatory Settings
                </div>
              </div>
              <div className="sh-section-content">
                <div className="sh-settings-grid">
                  {/* Zodiac System Selection */}
                  <div className="sh-setting-card">
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">⛎</span>
                      <div>
                        <h4>{t('starsHub.zodiacSystem')}</h4>
                        <p>{t('starsHub.chooseFramework')}</p>
                      </div>
                    </div>
                    {/* ═══ Zodiac Frame Toggle (Tropical vs Sidereal) ═══ */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      marginTop: '16px'
                    }}>
                      <button
                        onClick={handleSetTropical}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '10px',
                          border: `2px solid ${zodiacFrame === 'tropical' ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`,
                          background: zodiacFrame === 'tropical' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
                          color: zodiacFrame === 'tropical' ? '#fbbf24' : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: zodiacFrame === 'tropical' ? 600 : 400,
                        }}
                      >
                        {zodiacFrame === 'tropical' && '✓ '}{t('starsHub.tropical')}
                        <span style={{ display: 'block', fontSize: '12px', opacity: 0.6, marginTop: '3px' }}>
                          {t('starsHub.tropicalDesc')}
                        </span>
                      </button>
                      <button
                        onClick={handleSetSidereal}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '10px',
                          border: `2px solid ${zodiacFrame === 'sidereal' ? '#c9a227' : 'rgba(255,255,255,0.1)'}`,
                          background: zodiacFrame === 'sidereal' ? 'rgba(201, 162, 39, 0.1)' : 'rgba(255,255,255,0.05)',
                          color: zodiacFrame === 'sidereal' ? '#c9a227' : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: zodiacFrame === 'sidereal' ? 600 : 400,
                        }}
                      >
                        {zodiacFrame === 'sidereal' && '✓ '}{t('starsHub.sidereal')}
                        <span style={{ display: 'block', fontSize: '12px', opacity: 0.6, marginTop: '3px' }}>
                          {t('starsHub.siderealDesc')}
                        </span>
                      </button>
                    </div>

                    {/* ═══ Sign Count Toggle (only when Sidereal) ═══ */}
                    {zodiacFrame === 'sidereal' && (
                      <div style={{
                        marginTop: '10px',
                        paddingLeft: '12px',
                        borderLeft: '2px solid rgba(201, 162, 39, 0.3)',
                      }}>
                        <div style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '6px',
                        }}>
                          {t('starsHub.siderealSignCount')}
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                        }}>
                          <button
                            onClick={handleSet12Signs}
                            style={{
                              padding: '8px 8px',
                              borderRadius: '10px',
                              border: `2px solid ${signCount === 12 ? '#c9a227' : 'rgba(255,255,255,0.1)'}`,
                              background: signCount === 12 ? 'rgba(201, 162, 39, 0.1)' : 'rgba(255,255,255,0.05)',
                              color: signCount === 12 ? '#c9a227' : 'rgba(255,255,255,0.7)',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: signCount === 12 ? 600 : 400,
                            }}
                          >
                            {signCount === 12 && '✓ '}{t('starsHub.12signs')}
                            <span style={{ display: 'block', fontSize: '9px', opacity: 0.6, marginTop: '2px' }}>
                              {t('starsHub.12signsDesc')}
                            </span>
                          </button>
                          <button
                            onClick={handleSet13Signs}
                            style={{
                              padding: '8px 8px',
                              borderRadius: '10px',
                              border: `2px solid ${signCount === 13 ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`,
                              background: signCount === 13 ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255,255,255,0.05)',
                              color: signCount === 13 ? '#a78bfa' : 'rgba(255,255,255,0.7)',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: signCount === 13 ? 600 : 400,
                            }}
                          >
                            {signCount === 13 && '✓ '}{t('starsHub.13signs')}
                            <span style={{ display: 'block', fontSize: '9px', opacity: 0.6, marginTop: '2px' }}>
                              {t('starsHub.13signsDesc')}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    <p style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                      {zodiacFrame === 'sidereal'
                        ? signCount === 13
                          ? t('starsHub.13signDesc')
                          : t('starsHub.12signSiderealDesc')
                        : t('starsHub.tropicalDesc2')}
                      {' '}
                      <span style={{ color: 'rgba(201, 162, 39, 0.7)' }}>
                        {timeMode === 'TRUE' && zodiacFrame !== 'sidereal'
                          ? t('starsHub.trueModeWarning')
                          : timeMode === 'SYNC' && zodiacFrame === 'sidereal'
                            ? t('starsHub.syncModeWarning')
                            : ''}
                      </span>
                    </p>

                    {/* Two Selves comparison button — only in sidereal mode when chart has birth data */}
                    {zodiacFrame === 'sidereal' && natalChart?.birthData && (
                      <button
                        onClick={() => setShowTwoSelves(true)}
                        style={{
                          marginTop: '14px',
                          width: '100%',
                          padding: '10px 16px',
                          borderRadius: '10px',
                          border: '1px solid rgba(201, 162, 39, 0.4)',
                          background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.05) 100%)',
                          color: '#c9a227',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span>🌟</span>
                        {t('starsHub.compareTwoSelves')}
                      </button>
                    )}
                  </div>

                  {/* Notification Preferences */}
                  <div className="sh-setting-card">
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">🔔</span>
                      <div>
                        <h4>{t('starsHub.celestialNotifications')}</h4>
                        <p>{t('starsHub.receiveGuidance')}</p>
                      </div>
                    </div>
                    <StarsNotificationSettings />
                  </div>
                  
                  {/* Theme Selection */}
                  <div className="sh-setting-card">
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">🎨</span>
                      <div>
                        <h4>{t('starsHub.celestialTheme')}</h4>
                        <p>{t('starsHub.chooseAtmosphere')}</p>
                      </div>
                    </div>
                    <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
                  </div>
                  
                  {/* Font Selection */}
                  <div className="sh-setting-card">
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">✦</span>
                      <div>
                        <h4>{t('starsHub.celestialFont')}</h4>
                        <p>{t('starsHub.selectTypeface')}</p>
                      </div>
                    </div>
                    <FontSelector currentFont={font} onFontChange={setFont} />
                  </div>
                  
                  {/* Profile Management */}
                  <div className="sh-setting-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">👤</span>
                      <div>
                        <h4>{t('starsHub.profileManagement')}</h4>
                        <p>{t('starsHub.manageProfiles')}</p>
                      </div>
                    </div>
                    <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px' }}>
                      {(() => {
                        const activeProfileWithChart = profileManager.getActiveProfileWithChart();
                        const profiles = profileManager.listProfiles();
                        return (
                          <>
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>
                                {t('starsHub.profilesSaved', { count: profiles.length })}
                              </div>
                              {activeProfileWithChart && (
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                                  {t('starsHub.active')}: <strong>{activeProfileWithChart.name}</strong>
                                  {activeProfileWithChart.chart?.birthData && (
                                    <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>
                                      ({activeProfileWithChart.chart.birthData.date})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Show warning if birth date is corrupted */}
                            {activeProfileWithChart?.chart?.birthData && (() => {
                              const birthDate = new Date(activeProfileWithChart.chart.birthData.date);
                              const today = new Date();
                              const isRecent = Math.abs(today.getTime() - birthDate.getTime()) < 86400000 * 7; // Within 7 days
                              if (isRecent) {
                                return (
                                  <div style={{ 
                                    fontSize: '12px', 
                                    color: '#fca5a5', 
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    marginBottom: '12px'
                                  }}>
                                    {t('starsHub.corruptedDate')}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                            
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <button
                                onClick={async () => {
                                  const active = profileManager.getActiveProfile();
                                  if (!active) return;
                                  const confirmed = await dialogService.showConfirm({ description: t('confirm.deleteProfile') });
                                  if (confirmed) {
                                    // Delete from both OLD and NEW storage systems
                                    await profileManager.deleteProfile(active.id);
                                    deleteUnifiedChart(active.id);
                                    // Refresh profiles in Redux store without page reload
                                    dispatch(initializeAstrology());
                                  }
                                }}
                                style={{
                                  padding: '8px 16px',
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  border: '1px solid rgba(239, 68, 68, 0.4)',
                                  borderRadius: '8px',
                                  color: '#fca5a5',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                {t('starsHub.deleteProfile')}
                              </button>
                              <button
                                onClick={() => setActiveTab('chart')}
                                style={{
                                  padding: '8px 16px',
                                  background: 'rgba(147, 51, 234, 0.2)',
                                  border: '1px solid rgba(147, 51, 234, 0.4)',
                                  borderRadius: '8px',
                                  color: '#e9d5ff',
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                }}
                              >
                                {t('starsHub.addNewProfile')}
                              </button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* AI Provider Settings */}
                  <CelestialErrorBoundary componentName="AI Provider Settings">
                    <AIProviderSettings />
                  </CelestialErrorBoundary>

                  {/* About Section */}
                  <div className="sh-setting-card">
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">◈</span>
                      <div>
                        <h4>{t('starsHub.aboutCelestial')}</h4>
                        <p>{t('starsHub.version')}</p>
                      </div>
                    </div>
                    <div className="sh-about-text">
                      <p>
                        Powered by Swiss Ephemeris calculations for precise astronomical data. 
                        Align your actions with the cosmic rhythm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLANETARY POSITIONS COMPONENT
// Enhanced interactive planet positions with detailed views
// ═══════════════════════════════════════════════════════════════════════════════

interface PlanetaryPositionsProps {
  positions: Record<string, CelestialBody> | null;
  localHouses: any;
}

// Planet colors for visual theming
const PLANET_COLORS: Record<string, string> = {
  sun: '#fbbf24',
  moon: '#c4b5fd',
  mercury: '#94a3b8',
  venus: '#f472b6',
  mars: '#ef4444',
  jupiter: '#a78bfa',
  saturn: '#64748b',
};

const PlanetaryPositions: React.FC<PlanetaryPositionsProps> = ({ positions, localHouses }) => {
  const { t } = useTranslation('celestial');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  
  if (selectedPlanet && positions?.[selectedPlanet]) {
    const body = positions[selectedPlanet];
    const isRetro = body.isRetrograde;
    const signDeg = (body.degreeInSign ?? 0).toFixed(1);
    const planetColor = PLANET_COLORS[selectedPlanet] || '#ffffff';
    const interpretation = t(`dictionaries.planetInSign.${selectedPlanet}.${body.sign}`, { defaultValue: t('starsHub.planetInSignDefault', { planet: PLANET_NAMES[selectedPlanet as keyof typeof PLANET_NAMES], sign: body.sign }) });
    
    return (
      <div className="sh-section">
        <div className="sh-section-header">
          <button
            onClick={() => setSelectedPlanet(null)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '8px 16px',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              fontSize: '13px',
              marginRight: '16px',
            }}
          >
            ← Back
          </button>
          <div className="sh-section-title">
            <span>{SYMBOLS[selectedPlanet]}</span>
            {PLANET_NAMES[selectedPlanet as keyof typeof PLANET_NAMES]}
          </div>
        </div>
        <div className="sh-section-content">
          <div
            style={{
              padding: '32px',
              background: `linear-gradient(135deg, ${planetColor}15, rgba(0,0,0,0.3))`,
              borderRadius: '16px',
              border: `1px solid ${planetColor}40`,
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            {/* Animated Planet Visual */}
            <div
              style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 24px',
                borderRadius: '50%',
                background: `radial-gradient(circle at 30% 30%, ${planetColor}, ${planetColor}80, transparent)`,
                boxShadow: `0 0 60px ${planetColor}50, inset 0 0 40px rgba(0,0,0,0.3)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                animation: 'pulse 4s ease-in-out infinite',
              }}
            >
              {SYMBOLS[selectedPlanet]}
            </div>
            
            {/* Sign Glyph and Position */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '48px', color: planetColor }}>{SIGNS[body.sign]}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)' }}>
                  {body.sign.charAt(0).toUpperCase() + body.sign.slice(1)}
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                  {signDeg}° {isRetro && <span style={{ color: '#ef4444' }}>℞ Retrograde</span>}
                </div>
              </div>
            </div>
            
            {/* Element and Modality */}
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              {SIGN_ELEMENTS_13[body.sign as keyof typeof SIGN_ELEMENTS_13] ?? SIGN_ELEMENTS[body.sign as keyof typeof SIGN_ELEMENTS]} element • {SIGN_MODALITIES_13[body.sign as keyof typeof SIGN_MODALITIES_13] ?? SIGN_MODALITIES[body.sign as keyof typeof SIGN_MODALITIES]} modality
            </div>
          </div>
          
          {/* Interpretation */}
          <div
            style={{
              padding: '24px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              borderLeft: `4px solid ${planetColor}`,
            }}
          >
            <div
              style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '12px',
              }}
            >
              {t('starsHub.currentExpression')}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '16px',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              {interpretation}
            </p>
          </div>
          
          {/* House Position if available */}
          {localHouses && (
            <div
              style={{
                marginTop: '16px',
                padding: '20px',
                background: 'rgba(0,0,0,0.15)',
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: '8px',
                }}
              >
                House Position
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                This planet activates the area of life represented by its current house position, 
                coloring your experiences with {planetColor === '#fbbf24' ? 'solar' : selectedPlanet} energy.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Grid view
  return (
    <div className="sh-section">
      <div className="sh-section-header">
        <div className="sh-section-title">
          <span>✧</span>
          {t('starsHub.currentPlanetaryPositions')}
        </div>
      </div>
      <div className="sh-section-content">
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>
          {t('starsHub.tapPlanet')}
        </p>
        <div className="sh-positions-grid">
          {positions && Object.entries(positions)
            .filter(([id]) => ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(id))
            .map(([id, body]) => {
              const isRetro = body.isRetrograde;
              const signDeg = (body.degreeInSign ?? 0).toFixed(1);
              const planetColor = PLANET_COLORS[id] || '#ffffff';
              return (
                <button
                  key={id}
                  onClick={() => setSelectedPlanet(id)}
                  className={`sh-pos-card ${isRetro ? 'retro' : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${planetColor}10, rgba(0,0,0,0.2))`,
                    border: `1px solid ${planetColor}30`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                >
                  <div className="sh-pos-header">
                    <span className="sh-pos-symbol" style={{ color: planetColor, fontSize: '24px' }}>
                      {SYMBOLS[id]}
                    </span>
                    <span className="sh-pos-name">{PLANET_NAMES[id as keyof typeof PLANET_NAMES]}</span>
                    {isRetro && <span className="sh-pos-retro">℞</span>}
                  </div>
                  <div className="sh-pos-sign">
                    <span className="sh-pos-sign-symbol">{SIGNS[body.sign]}</span>
                    <span className="sh-pos-degree">{signDeg}°</span>
                  </div>
                  <div className="sh-pos-insight" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    {t('starsHub.tapForDetails')}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default StarsHub;
