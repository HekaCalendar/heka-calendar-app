/**
 * Stars Hub - Enterprise Astrology Dashboard
 * Premium celestial intelligence interface
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import { initializeAstrology, updateProfilePreferences, generateChartForProfile } from '../../store/thunks';
import { updateAstroPreferences, toggleAstroPreference, setView } from '../../../store';
import { selectSelectedProfileChart, selectAllProfiles } from '../../store/selectors';
import {
  calculateCurrentSky,
  calculatePreciseMoonPhase,
  getCurrentPlanetaryHour,
  calculateRetrogrades,
  calculateLocalHouses,
  clearCalculationCache,
} from '../../services/calculations/swissCalculations';
import { initializeSwissEphemeris, setZodiacSystem } from '../../services/swiss-ephemeris/engine';
import type { CelestialBody } from '../../types';
import { PLANET_NAMES, SIGN_ELEMENTS, SIGN_MODALITIES } from '../../types';
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
import {
  initializeAstroNotifications,
  scheduleDailyTips,
} from '../../services/notifications/astroNotifications';
import { profileManager } from '../../services/natal/profileManager';
import { getUnifiedUserBirthData, deleteUnifiedChart, getUnifiedChart } from '../../utils/chartBridge';
import { CelestialErrorBoundary } from '../error/CelestialErrorBoundary';

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

// Helper to get signs array based on zodiac system (used for sign displays)
export const getZodiacSigns = (use13Signs: boolean) => use13Signs ? ZODIAC_ORDER_13 : ZODIAC_ORDER_12;

type TabType = 'overview' | 'guidance' | 'void-moon' | 'transits' | 'positions' | 'chart' | 'settings';
type CelestialFontId = 'stellar' | 'cosmic' | 'nebula' | 'void' | 'oracle' | 'quantum';

export const StarsHub: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profiles = useSelector(selectAllProfiles);
  
  // Use unified chart retrieval that checks BOTH legacy and Redux storage
  const reduxChart = useSelector(selectSelectedProfileChart);
  
  // Cache unified chart lookup to prevent localStorage reads on every render
  const unifiedChart = useMemo(() => getUnifiedChart(), []);
  
  // Prefer Redux chart if available, fall back to unified (legacy) chart
  const natalChart = reduxChart || unifiedChart;
  
  const astroPreferences = useSelector((state: RootState) => state.calendar.astroPreferences);
  const zodiacSystem = astroPreferences?.zodiacSystem || '12-sign';
  const selectedProfileId = useSelector((state: RootState) => state.astrology.ui.selectedProfileId);
  
  // Refs for managing async operations and cleanup
  const zodiacAbortControllerRef = useRef<AbortController | null>(null);
  const calculationAbortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  

  
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [positions, setPositions] = useState<Record<string, CelestialBody> | null>(null);
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
  
  // Save preferences when changed
  useEffect(() => {
    localStorage.setItem('ci-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('ci-font', font);
  }, [font]);
  
  // Get user geolocation for location-aware calculations
  useEffect(() => {
    const requestLocation = async () => {
      if (!navigator.geolocation) {
        console.warn('[StarsHub] Geolocation not supported');
        return;
      }
      
      // Check if we already have permission
      if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          console.log('[StarsHub] Geolocation permission:', result.state);
          
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
          console.log('[StarsHub] Got location:', position.coords.latitude, position.coords.longitude);
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timezone: -new Date().getTimezoneOffset() / 60,
          };
          setUserLocation(loc);
          localStorage.setItem('ci-location', JSON.stringify(loc));
          
          // Try to get location name from coordinates
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${loc.latitude}&longitude=${loc.longitude}&localityLanguage=en`)
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

  // Get current theme config
  const currentTheme = CELESTIAL_THEMES[theme];

  // Initialize Swiss Ephemeris first
  useEffect(() => {
    const init = async () => {
      try {
        await initializeSwissEphemeris();
        if (isMountedRef.current) {
          setIsReady(true);
          console.log('[StarsHub] Swiss Ephemeris ready');
        }
      } catch (error) {
        console.error('[StarsHub] Failed to initialize:', error);
      }
    };
    init();
  }, []);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
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
        // Calculate current sky positions
        const skyData = await calculateCurrentSky(currentTime);
        if (signal.aborted || !isMountedRef.current) return;
        
        setPositions(skyData.positions);
        setJulianDay(skyData.julianDay);
        
        // Calculate moon phase
        if (skyData.positions.sun && skyData.positions.moon) {
          const phase = calculatePreciseMoonPhase(
            skyData.positions.sun,
            skyData.positions.moon
          );
          if (signal.aborted || !isMountedRef.current) return;
          setMoonPhase(phase);
        }
        
        // Calculate planetary hour with true Swiss Ephemeris accuracy
        const hour = await getCurrentPlanetaryHour(
          currentTime,
          userLocation?.latitude ?? 0,
          userLocation?.longitude ?? 0,
          userLocation?.timezone ?? 0
        );
        if (signal.aborted || !isMountedRef.current) return;
        setPlanetaryHour(hour);
        
        // Calculate retrogrades
        if (skyData.positions) {
          const retro = calculateRetrogrades(skyData.positions);
          if (signal.aborted || !isMountedRef.current) return;
          setRetrogrades(retro.filter((r: any) => r.isRetrograde));
        }
        
        // Calculate local houses (Ascendant, MC, etc.)
        if (userLocation) {
          const houses = await calculateLocalHouses(
            currentTime,
            userLocation.latitude,
            userLocation.longitude,
            'placidus'
          );
          if (signal.aborted || !isMountedRef.current) return;
          setLocalHouses(houses);
        }
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
  }, [currentTime, isReady, userLocation, zodiacSystem]);
  
  // Initialize astrology on mount
  useEffect(() => {
    dispatch(initializeAstrology());
  }, [dispatch]);
  
  // Initialize notifications on mount
  useEffect(() => {
    initializeAstroNotifications();
  }, []);
  
  // Update notification schedules when preferences change
  useEffect(() => {
    scheduleDailyTips(astroPreferences.enableDailyTips);
  }, [astroPreferences.enableDailyTips]);
  
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
            preferences: { zodiacSystem }
          }));
        }
        
        if (signal.aborted) return;
        
        // 2. Regenerate the chart with the new zodiac system
        if (selectedProfileId) {
          await dispatch(generateChartForProfile(selectedProfileId));
        }
        
        if (signal.aborted) return;
        
        // 3. Also update via ProfileManager for backward compatibility
        await profileManager.recalculateChartWithZodiacSystem(activeProfile.id, zodiacSystem);
        
        if (signal.aborted) return;
        
        // 4. Refresh the astrology data
        if (isMountedRef.current) {
          dispatch(initializeAstrology());
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
  }, [zodiacSystem, dispatch, selectedProfileId]);

  const tabs: { id: TabType; label: string; icon: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: '◈' },
    { id: 'guidance', label: 'Guidance', icon: '◐' },
    { id: 'void-moon', label: 'Void Moon', icon: '🌑' },
    { id: 'transits', label: 'Transits', icon: '◷' },
    { id: 'positions', label: 'Positions', icon: '✧' },
    { id: 'chart', label: 'Chart', icon: '◉' },
    { id: 'settings', label: 'Settings', icon: '⚙' },
  ];

  return (
    <div className={`stars-hub ci-font-${font}`} style={{ 
      ...Object.fromEntries(
        generateThemeCSS(currentTheme)
          .split('\n')
          .filter(line => line.includes(':'))
          .map(line => {
            const [key, value] = line.split(':').map(s => s.trim());
            return [key?.replace('--ci-', '--ci-'), value?.replace(';', '')];
          })
          .filter(([k]) => k)
      ) as React.CSSProperties
    }}>

      {/* Animated Background Elements */}
      <div className="ci-shooting-stars" />
      
      {/* Sticky Header Container */}
      <div className="sh-header-container">
        {/* Main Title - Always visible */}
        <div className="sh-title-bar">
          <h1 className="sh-main-title">Celestial Intelligence</h1>
        </div>
        
        {/* Header with Back and Live */}
        <header className="sh-header">
          <button 
            className="sh-back" 
            onClick={() => dispatch(setView('month'))}
          >
            ← Back
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
              Live
            </span>
          </div>
        </header>
        
        {/* Navigation Tabs - Sticky */}
        <nav className="sh-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`sh-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
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
                    ? `Welcome back, ${profiles[0]?.name?.split(' ')[0] || 'Seeker'}` 
                    : 'Universal Sky'}
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
                  <div className="sh-stat-label">Moon Phase</div>
                </div>
                <div className="sh-stat-card">
                  <div className="sh-stat-value">
                    {planetaryHour ? planetaryHour.symbol : '--'}
                  </div>
                  <div className="sh-stat-label">Hour Ruler</div>
                </div>
                <div className="sh-stat-card">
                  <div className="sh-stat-value" style={{ color: retrogrades.length > 0 ? '#ef4444' : 'var(--success)' }}>
                    {retrogrades.length}
                  </div>
                  <div className="sh-stat-label">Retrogrades</div>
                </div>
                <div className="sh-stat-card">
                  <div className="sh-stat-value">
                    {positions?.sun?.sign ? SIGNS[positions.sun.sign] : '--'}
                  </div>
                  <div className="sh-stat-label">Sun Sign</div>
                </div>
              </div>
              
              {/* Daily Briefing */}
              <div className="sh-section">
                <div className="sh-section-header">
                  <div className="sh-section-title">
                    <span>◈</span>
                    Daily Briefing
                  </div>
                </div>
                <div className="sh-section-content">
                  <DailyBriefing />
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
                  voidMoonData={{ isVoid: false }}
                  natalChart={natalChart}
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
                userBirthData={getUnifiedUserBirthData()}
              />
            </div>
          )}
          
          {/* Transits Tab */}
          {activeTab === 'transits' && (
            <div className="sh-section">
              <div className="sh-section-header">
                <div className="sh-section-title">
                  <span>◷</span>
                  Current Transits
                </div>
              </div>
              <div className="sh-section-content" style={{ textAlign: 'center', padding: '64px' }}>
                {natalChart ? (
                  <>
                    <p style={{ color: '#4ade80', fontSize: '16px', marginBottom: '16px' }}>
                      ✨ Personalized Transits Active
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>
                      Transit tracking is active in your Celestial Guidance
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                      Visit the Guidance tab to see your personalized transits
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ color: '#fbbf24', fontSize: '16px', marginBottom: '16px' }}>
                      🌙 Birth Chart Needed
                    </p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>
                      Add your birth chart to see personalized transits
                    </p>
                    <button
                      onClick={() => setActiveTab('chart')}
                      style={{
                        marginTop: '16px',
                        padding: '10px 20px',
                        background: 'rgba(167, 139, 250, 0.2)',
                        border: '1px solid rgba(167, 139, 250, 0.4)',
                        borderRadius: '8px',
                        color: '#c4b5fd',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Add Birth Chart →
                    </button>
                  </>
                )}
              </div>
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
                        <h4>Zodiac System</h4>
                        <p>Choose your celestial framework</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button
                        onClick={() => {
                          console.log('[StarsHub] 12-sign button clicked');
                          dispatch(updateAstroPreferences({ zodiacSystem: '12-sign' }));
                        }}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: `2px solid ${zodiacSystem === '12-sign' ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`,
                          background: zodiacSystem === '12-sign' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
                          color: zodiacSystem === '12-sign' ? '#fbbf24' : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: zodiacSystem === '12-sign' ? 600 : 400,
                        }}
                      >
                        {zodiacSystem === '12-sign' && '✓ '}12 Signs
                        <span style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                          Traditional (Aries-Pisces)
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          dispatch(updateAstroPreferences({ zodiacSystem: '13-sign' }));
                        }}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: `2px solid ${zodiacSystem === '13-sign' ? '#a78bfa' : 'rgba(255,255,255,0.1)'}`,
                          background: zodiacSystem === '13-sign' ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255,255,255,0.05)',
                          color: zodiacSystem === '13-sign' ? '#a78bfa' : 'rgba(255,255,255,0.7)',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: zodiacSystem === '13-sign' ? 600 : 400,
                        }}
                      >
                        {zodiacSystem === '13-sign' && '✓ '}13 Signs ⛎
                        <span style={{ display: 'block', fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                          Including Ophiuchus
                        </span>
                      </button>
                    </div>
                    <p style={{ marginTop: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                      {zodiacSystem === '13-sign' 
                        ? '⛎ Ophiuchus (Nov 30 - Dec 17): The Serpent Bearer of healing and wisdom'
                        : 'Using classical 12-sign zodiac system'}
                    </p>
                  </div>

                  {/* Notification Preferences */}
                  <div className="sh-setting-card">
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">🔔</span>
                      <div>
                        <h4>Celestial Notifications</h4>
                        <p>Receive guidance from the cosmos</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                      {/* Daily Tips */}
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={astroPreferences.enableDailyTips}
                          onChange={() => dispatch(toggleAstroPreference('enableDailyTips'))}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                            🌅 Daily Celestial Tips
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            Personalized guidance delivered at 7:00 AM
                          </div>
                        </div>
                      </label>

                      {/* Retrograde Alerts */}
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={astroPreferences.enableRetrogradeAlerts}
                          onChange={() => dispatch(toggleAstroPreference('enableRetrogradeAlerts'))}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                            ⚠️ Retrograde Alerts
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            3-day advance warning for planetary retrogrades
                          </div>
                        </div>
                      </label>

                      {/* Moon Phase Alerts */}
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                      }}>
                        <input
                          type="checkbox"
                          checked={astroPreferences.enableMoonPhaseAlerts}
                          onChange={() => dispatch(toggleAstroPreference('enableMoonPhaseAlerts'))}
                          style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                            🌕 Moon Phase Reminders
                          </div>
                          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                            New and Full Moon notifications
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Theme Selection */}
                  <div className="sh-setting-card">
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">🎨</span>
                      <div>
                        <h4>Celestial Theme</h4>
                        <p>Choose your cosmic atmosphere</p>
                      </div>
                    </div>
                    <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
                  </div>
                  
                  {/* Font Selection */}
                  <div className="sh-setting-card">
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">✦</span>
                      <div>
                        <h4>Celestial Font</h4>
                        <p>Select the typeface for this realm</p>
                      </div>
                    </div>
                    <FontSelector currentFont={font} onFontChange={setFont} />
                  </div>
                  
                  {/* Profile Management */}
                  <div className="sh-setting-card" style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <div className="sh-setting-header">
                      <span className="sh-setting-icon">👤</span>
                      <div>
                        <h4>Profile Management</h4>
                        <p>Manage your birth chart profiles</p>
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
                                {profiles.length} profile{profiles.length !== 1 ? 's' : ''} saved
                              </div>
                              {activeProfileWithChart && (
                                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                                  Active: <strong>{activeProfileWithChart.name}</strong>
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
                                    ⚠️ <strong>Corrupted birth date detected!</strong><br/>
                                    Birth date appears to be recent. This may cause the 13-sign toggle to not work correctly.
                                  </div>
                                );
                              }
                              return null;
                            })()}
                            
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                              <button
                                onClick={async () => {
                                  const active = profileManager.getActiveProfile();
                                  if (active && confirm('Delete this profile? This cannot be undone.')) {
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
                                🗑️ Delete Profile
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
                                ➕ Add New Profile
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
                        <h4>About Celestial Intelligence</h4>
                        <p>Version 2.2.0 • HEKA Astrology Engine</p>
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

// Detailed planetary interpretations
const PLANET_IN_SIGN_MEANING: Record<string, Record<string, string>> = {
  sun: {
    aries: 'The Sun in Aries brings bold, pioneering energy. A time for initiation, leadership, and courageous action.',
    taurus: 'The Sun in Taurus grounds us in stability and sensory pleasure. Focus on building, nurturing, and appreciating beauty.',
    gemini: 'The Sun in Gemini sparks curiosity and communication. Exchange ideas, learn, and connect with your community.',
    cancer: 'The Sun in Cancer deepens emotional connections. Nurture relationships, honor feelings, and create sanctuary.',
    leo: 'The Sun in Leo shines with creative confidence. Express yourself authentically and lead with heart.',
    virgo: 'The Sun in Virgo calls for refinement and service. Organize, improve systems, and attend to details.',
    libra: 'The Sun in Libra seeks harmony and partnership. Balance relationships and appreciate aesthetic beauty.',
    scorpio: 'The Sun in Scorpio dives deep into transformation. Embrace intensity, investigate mysteries, and release what no longer serves.',
    sagittarius: 'The Sun in Sagittarius expands horizons. Seek wisdom, explore new territories, and embrace optimism.',
    capricorn: 'The Sun in Capricorn builds for the long term. Take responsibility, set ambitious goals, and master your craft.',
    aquarius: 'The Sun in Aquarius innovates for the collective. Embrace uniqueness, think progressively, and serve humanity.',
    pisces: 'The Sun in Pisces dissolves boundaries. Connect with the infinite, practice compassion, and trust intuition.',
  },
  moon: {
    aries: 'The Moon in Aries brings quick emotional responses. Impulsive feelings, passionate reactions, and independent needs.',
    taurus: 'The Moon in Taurus seeks comfort and stability. Nurturing through sensuality, patience, and material security.',
    gemini: 'The Moon in Gemini fluctuates with thoughts and conversations. Emotional curiosity, mental stimulation needs.',
    cancer: 'The Moon is at home in Cancer. Deep nurturing, protective instincts, and profound emotional sensitivity.',
    leo: 'The Moon in Leo expresses feelings dramatically. Warmth, creativity, and need for recognition in relationships.',
    virgo: 'The Moon in Virgo seeks order and usefulness. Emotional satisfaction through service, health, and improvement.',
    libra: 'The Moon in Libra harmonizes emotions. Needs partnership, aesthetic balance, and diplomatic relating.',
    scorpio: 'The Moon in Scorpio feels intensely. Emotional depth, transformative experiences, and powerful intuition.',
    sagittarius: 'The Moon in Sagittarius explores emotionally. Freedom needs, philosophical feelings, and adventurous spirit.',
    capricorn: 'The Moon in Capricorn restrains emotions. Mature handling of feelings, responsibility, and long-term security.',
    aquarius: 'The Moon in Aquarius detaches to observe. Emotional objectivity, humanitarian concerns, and unique needs.',
    pisces: 'The Moon in Pisces dissolves emotional boundaries. Empathy, imagination, and spiritual sensitivity.',
  },
  mercury: {
    aries: 'Mercury in Aries thinks quickly and directly. Sharp, impulsive communication and pioneering ideas.',
    taurus: 'Mercury in Taurus thinks practically. Steady learning, sensual perception, and methodical communication.',
    gemini: 'Mercury is at home in Gemini. Quick wit, versatile thinking, and skillful communication.',
    cancer: 'Mercury in Cancer thinks intuitively. Memory-focused, emotional intelligence, and nurturing words.',
    leo: 'Mercury in Leo expresses creatively. Dramatic speech, confident ideas, and heart-centered thinking.',
    virgo: 'Mercury is at home in Virgo. Analytical precision, practical intelligence, and detailed analysis.',
    libra: 'Mercury in Libra seeks balanced thought. Diplomatic communication and considering all perspectives.',
    scorpio: 'Mercury in Scorpio probes deeply. Investigative thinking, psychological insight, and penetrating words.',
    sagittarius: 'Mercury in Sagittarius expands understanding. Philosophical thinking and broad communication.',
    capricorn: 'Mercury in Capricorn structures thought. Strategic planning, authoritative speech, and practical wisdom.',
    aquarius: 'Mercury in Aquarius innovates thinking. Original ideas, intellectual detachment, and progressive concepts.',
    pisces: 'Mercury in Pisces imagines intuitively. Poetic expression, receptive listening, and spiritual understanding.',
  },
  venus: {
    aries: 'Venus in Aries loves passionately. Bold attraction, spontaneous romance, and independent partnerships.',
    taurus: 'Venus is at home in Taurus. Sensual pleasure, stable relationships, and appreciation of beauty.',
    gemini: 'Venus in Gemini charms verbally. Flirtatious connections, intellectual attraction, and social variety.',
    cancer: 'Venus in Cancer nurtures lovingly. Emotional bonding, domestic harmony, and protective care.',
    leo: 'Venus in Leo loves dramatically. Romantic grand gestures, creative expression, and loyal affection.',
    virgo: 'Venus in Virgo serves practically. Helpful love, modest attraction, and attention to relationship details.',
    libra: 'Venus is at home in Libra. Harmonious partnerships, aesthetic appreciation, and diplomatic relating.',
    scorpio: 'Venus in Scorpio loves intensely. Deep transformation through relationships and magnetic attraction.',
    sagittarius: 'Venus in Sagittarius explores freely. Adventurous love, philosophical connection, and open relationships.',
    capricorn: 'Venus in Capricorn commits seriously. Mature relationships, status considerations, and lasting bonds.',
    aquarius: 'Venus in Aquarius connects uniquely. Unconventional relationships, friendship-based love, and freedom.',
    pisces: 'Venus in Pisces loves unconditionally. Romantic idealism, spiritual connection, and compassionate relating.',
  },
  mars: {
    aries: 'Mars is at home in Aries. Direct action, courageous initiative, and passionate drive.',
    taurus: 'Mars in Taurus persists steadily. Determined effort, sensual energy, and stubborn resistance.',
    gemini: 'Mars in Gemini acts mentally. Quick movements, verbal combat, and scattered initiatives.',
    cancer: 'Mars in Cancer defends protectively. Emotional action, defensive aggression, and nurturing drive.',
    leo: 'Mars in Leo performs boldly. Dramatic action, creative drive, and confident leadership.',
    virgo: 'Mars in Virgo works precisely. Methodical effort, service-oriented action, and health focus.',
    libra: 'Mars in Libra acts diplomatically. Indirect confrontation, partnership drive, and aesthetic action.',
    scorpio: 'Mars is at home in Scorpio. Intense action, strategic power, and transformative drive.',
    sagittarius: 'Mars in Sagittarius explores adventurously. Expansive initiative, philosophical action, and risk-taking.',
    capricorn: 'Mars in Capricorn achieves ambitiously. Disciplined effort, strategic climbing, and authoritative action.',
    aquarius: 'Mars in Aquarius revolutionizes action. Reforming drive, group initiatives, and unconventional methods.',
    pisces: 'Mars in Pisces drifts intuitively. Spiritual action, compassionate drive, and elusive initiative.',
  },
  jupiter: {
    aries: 'Jupiter in Aries expands boldly. Growth through initiative, fortunate new beginnings, and confident optimism.',
    taurus: 'Jupiter in Taurus abundantly manifests. Growth through patience, material blessings, and sensual wisdom.',
    gemini: 'Jupiter in Gemini learns diversely. Growth through communication, intellectual expansion, and varied interests.',
    cancer: 'Jupiter in Cancer nourishes generously. Growth through nurturing, emotional abundance, and protective wisdom.',
    leo: 'Jupiter in Leo creates grandly. Growth through self-expression, creative abundance, and generous leadership.',
    virgo: 'Jupiter in Virgo improves skillfully. Growth through service, practical wisdom, and health abundance.',
    libra: 'Jupiter in Libra harmonizes justly. Growth through partnership, aesthetic appreciation, and diplomatic wisdom.',
    scorpio: 'Jupiter in Scorpio transforms deeply. Growth through intensity, shared resources, and psychological wisdom.',
    sagittarius: 'Jupiter is at home in Sagittarius. Boundless expansion, philosophical wisdom, and fortunate journeys.',
    capricorn: 'Jupiter in Capricorn structures wisely. Growth through discipline, strategic success, and authoritative wisdom.',
    aquarius: 'Jupiter in Aquarius innovates progressively. Growth through community, humanitarian wisdom, and unique vision.',
    pisces: 'Jupiter in Pisces dissolves into infinity. Growth through compassion, spiritual abundance, and universal love.',
  },
  saturn: {
    aries: 'Saturn in Aries tests initiative. Lessons in patience, restrained action, and mature leadership.',
    taurus: 'Saturn in Taurus stabilizes resources. Lessons in persistence, material responsibility, and enduring values.',
    gemini: 'Saturn in Gemini disciplines the mind. Lessons in focus, serious communication, and mental maturity.',
    cancer: 'Saturn in Cancer protects boundaries. Lessons in emotional responsibility, family duty, and nurturing limits.',
    leo: 'Saturn in Leo tempers creativity. Lessons in humility, structured self-expression, and responsible leadership.',
    virgo: 'Saturn in Virgo perfects service. Lessons in precision, health discipline, and practical mastery.',
    libra: 'Saturn in Libra commits to balance. Lessons in partnership responsibility, fair structures, and mature relating.',
    scorpio: 'Saturn in Scorpio transforms deeply. Lessons in power, shared resource responsibility, and psychological maturity.',
    sagittarius: 'Saturn in Sagittarius structures beliefs. Lessons in wisdom, disciplined expansion, and responsible freedom.',
    capricorn: 'Saturn is at home in Capricorn. Mastery through discipline, authority earned, and lasting achievement.',
    aquarius: 'Saturn is at home in Aquarius. Social responsibility, innovative structures, and humanitarian duty.',
    pisces: 'Saturn in Pisces dissolves boundaries carefully. Lessons in compassion, spiritual discipline, and mystical responsibility.',
  },
};

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
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  
  if (selectedPlanet && positions?.[selectedPlanet]) {
    const body = positions[selectedPlanet];
    const isRetro = body.isRetrograde;
    const signDeg = (body.longitude % 30).toFixed(1);
    const planetColor = PLANET_COLORS[selectedPlanet] || '#ffffff';
    const interpretation = PLANET_IN_SIGN_MEANING[selectedPlanet]?.[body.sign] || 
      `${PLANET_NAMES[selectedPlanet as keyof typeof PLANET_NAMES]} in ${body.sign} brings unique energy.`;
    
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
              {SIGN_ELEMENTS[body.sign as keyof typeof SIGN_ELEMENTS]} element • {SIGN_MODALITIES[body.sign as keyof typeof SIGN_MODALITIES]} modality
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
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '12px',
              }}
            >
              Current Expression
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
                  fontSize: '11px',
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
          Current Planetary Positions
        </div>
      </div>
      <div className="sh-section-content">
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>
          Tap any planet to explore its detailed meaning
        </p>
        <div className="sh-positions-grid">
          {positions && Object.entries(positions)
            .filter(([id]) => ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].includes(id))
            .map(([id, body]) => {
              const isRetro = body.isRetrograde;
              const signDeg = (body.longitude % 30).toFixed(1);
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
                    Tap for details →
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
