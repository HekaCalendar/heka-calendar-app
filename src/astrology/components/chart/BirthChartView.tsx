/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BIRTH CHART VIEW - The Complete Natal Chart Experience
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The centerpiece of Phase 3—an integrated, interactive birth chart visualization
 * combining the Chart Wheel, Element Temple, Dignity Dashboard, Natal Promise,
 * and more into a cohesive, magnificent experience.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  profileManager, 
  type ProfileWithChart,
} from '../../services/natal/profileManager';
import { generateNatalPromise, type NatalPromise } from '../../services/natal/natalPromise';
import type { NatalPlanet } from '../../services/natal/natalChart';
import { getZodiacSystemPreference } from '../../services/natal/zodiacHelpers';

// Import sub-components
import { ChartWheel } from './ChartWheel';
import { ElementTemple } from './ElementTemple';
import { PlanetaryCourt } from './PlanetaryCourt';
import { PlanetDetailModal } from './PlanetDetailModal';
import { ProfileSelector } from '../natal/ProfileSelector';
import { BirthChartInput } from '../natal/BirthChartInput';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const PLANET_ORDER = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron', 'node'];

const PLANET_SYMBOLS: Record<string, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
  jupiter: '♃', saturn: '♄', uranus: '⛢', neptune: '♆', pluto: '♇',
  chiron: '⚷', node: '☊',
};



const SIGN_SYMBOLS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
  ophiuchus: '⛎',
};

const ASPECT_COLORS: Record<string, string> = {
  conjunction: '#fbbf24', sextile: '#22c55e', square: '#ef4444',
  trine: '#3b82f6', opposition: '#f59e0b', quincunx: '#a855f7',
};

interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | 'quincunx';
  orb: number;
}

function calculateAspects(chart: ProfileWithChart['chart']): Aspect[] {
  const aspects: Aspect[] = [];
  const planets = Object.entries(chart.planets).filter(([id]) => PLANET_ORDER.includes(id));
  
  const ASPECT_ANGLES: Record<string, number> = {
    conjunction: 0, sextile: 60, square: 90, trine: 120, opposition: 180,
  };
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const [id1, p1] = planets[i];
      const [id2, p2] = planets[j];
      
      let diff = Math.abs(p1.longitude - p2.longitude);
      if (diff > 180) diff = 360 - diff;
      
      Object.entries(ASPECT_ANGLES).forEach(([type, angle]) => {
        const orb = Math.abs(diff - angle);
        const maxOrb = type === 'conjunction' || type === 'opposition' ? 8 : 6;
        
        if (orb < maxOrb) {
          aspects.push({ planet1: id1, planet2: id2, type: type as Aspect['type'], orb });
        }
      });
    }
  }
  
  return aspects.sort((a, b) => a.orb - b.orb);
}

interface BirthChartViewProps {
  initialProfileId?: string;
}

type ViewMode = 'chart' | 'elements' | 'dignities' | 'promise' | 'edit' | 'new';

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 300,
    color: '#fff',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  navTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '4px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    width: 'fit-content',
    maxWidth: '100%',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },
  navTab: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  navTabActive: {
    background: 'rgba(147, 51, 234, 0.3)',
    color: '#fff',
  },
  mainContent: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 380px',
    gap: '24px',
    justifyContent: 'center',
  },
  mainContentMobile: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    justifyContent: 'center',
  },
  mainContentSingle: {
    display: 'block',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  card: {
    background: 'rgba(20, 20, 40, 0.6)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  cardHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardContent: {
    padding: '24px',
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
    overflow: 'hidden',
    maxWidth: '100%',
  },
  promiseCard: {
    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(147, 51, 234, 0.3)',
  },
  promiseTitle: {
    fontSize: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    color: '#a78bfa',
    marginBottom: '12px',
  },
  promiseText: {
    fontSize: '18px',
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.9)',
    fontStyle: 'italic',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  statItem: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#fbbf24',
  },
  statLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    marginTop: '4px',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  button: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    marginTop: '20px',
  },
  themesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  planetGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  planetGridItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  planetSymbol: {
    fontSize: '20px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
  },
  planetInfo: {
    flex: 1,
    minWidth: 0,
  },
  planetName: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'capitalize' as const,
  },
  planetSign: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#fff',
  },
  planetDegree: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  planetBadge: {
    fontSize: '10px',
    padding: '3px 6px',
    borderRadius: '4px',
    background: 'rgba(147, 51, 234, 0.3)',
    color: '#e9d5ff',
  },
  aspectsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    maxHeight: '200px',
    overflowY: 'auto' as const,
  },
  aspectItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    fontSize: '13px',
  },
  aspectType: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
  },
  themeItem: {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    borderLeft: '3px solid #9333ea',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  actionBar: {
    display: 'flex',
    gap: '8px',
    marginTop: '16px',
  },
  actionButton: {
    flex: 1,
    padding: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '13px',
    cursor: 'pointer',
  },
};

export const BirthChartView: React.FC<BirthChartViewProps> = ({ initialProfileId }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [profile, setProfile] = useState<ProfileWithChart | null>(null);
  const [natalPromise, setNatalPromise] = useState<NatalPromise | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load profile
  const loadProfile = useCallback(async (profileId?: string) => {
    console.log('[BirthChartView] loadProfile called:', profileId);
    setIsLoading(true);
    try {
      let targetProfile: ProfileWithChart | null = null;

      if (profileId) {
        targetProfile = profileManager.getProfileWithChart(profileId);
      } else {
        // Try active, then default
        const active = profileManager.getActiveProfileWithChart();
        if (active) {
          targetProfile = active;
        } else {
          const defaultProfile = profileManager.getDefaultProfile();
          targetProfile = defaultProfile ? profileManager.getProfileWithChart(defaultProfile.id) : null;
        }
      }

      if (targetProfile) {
        console.log('[BirthChartView] Profile loaded, sun sign:', targetProfile.chart.planets.sun?.sign);
        setProfile(targetProfile);
        const promise = generateNatalPromise(targetProfile.chart);
        setNatalPromise(promise);
      } else {
        console.log('[BirthChartView] No profile found');
        setProfile(null);
        setNatalPromise(null);
      }
    } catch (error) {
      console.error('[BirthChartView] Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile(initialProfileId);

    // Subscribe to profile changes
    const unsubscribe = profileManager.subscribe((event) => {
      console.log('[BirthChartView] Profile event received:', event.type, event.profileId);
      if (event.type === 'profile:switched' || 
          event.type === 'profile:updated' ||
          event.type === 'profile:created') {
        loadProfile(event.profileId);
      }
    });

    return unsubscribe;
  }, [initialProfileId, loadProfile]);
  
  // Force reload when zodiac system changes (check on mount and when window regains focus)
  useEffect(() => {
    const checkZodiacSystem = () => {
      const currentSystem = getZodiacSystemPreference();
      if (profile && profile.chart.zodiacSystem !== currentSystem) {
        loadProfile(profile.id);
      }
    };

    window.addEventListener('focus', checkZodiacSystem);
    checkZodiacSystem(); // check immediately on mount
    return () => window.removeEventListener('focus', checkZodiacSystem);
  }, [profile, loadProfile]);

  const handleProfileChange = (profileId: string | null) => {
    if (profileId) {
      loadProfile(profileId);
    }
  };

  const handleChartCalculated = () => {
    loadProfile();
    setViewMode('chart');
  };

  const handlePlanetClick = (planetId: string, _planet: NatalPlanet) => {
    setSelectedPlanet(selectedPlanet === planetId ? null : planetId);
    // Could open modal or expand details here
  };

  // Render empty state
  if (!profile && !isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🌙</div>
          <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>
            No Birth Chart Found
          </h2>
          <p style={{ marginBottom: '24px' }}>
            Create your first birth chart to unlock personalized celestial guidance
          </p>
          <button style={styles.button} onClick={() => setViewMode('new')}>
            ✨ Create Your Chart
          </button>
        </div>

        {viewMode === 'new' && (
          <BirthChartInput
            onChartCalculated={handleChartCalculated}
            onCancel={() => setViewMode('chart')}
          />
        )}
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div style={{ ...styles.container, textAlign: 'center', padding: '100px' }}>
        <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'pulse 2s infinite' }}>
          ✦
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Loading celestial blueprint...</p>
      </div>
    );
  }

  const isSplitView = viewMode === 'chart' || viewMode === 'elements';

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{profile.name}'s Chart</h1>
          <p style={styles.subtitle}>
            Born {new Date(profile.chart.birthData.date).toLocaleDateString('en-US', { 
              month: 'long', day: 'numeric', year: 'numeric' 
            })} • {profile.chart.birthData.locationName || 'Unknown location'}
          </p>
        </div>
        <ProfileSelector 
          onProfileChange={handleProfileChange}
          onAddProfile={() => setViewMode('new')}
        />
      </div>

      {/* Navigation */}
      <div style={styles.navTabs}>
        {[
          { id: 'chart' as const, label: isMobile ? 'Chart' : 'Chart Wheel', icon: '◉' },
          { id: 'elements' as const, label: 'Elements', icon: '🔥' },
          { id: 'dignities' as const, label: 'Dignities', icon: '⚖️' },
          { id: 'promise' as const, label: isMobile ? 'Promise' : 'Soul Promise', icon: '✨' },
        ].map((tab) => (
          <button
            key={tab.id}
            style={{
              ...styles.navTab,
              ...(viewMode === tab.id && styles.navTabActive),
            }}
            onClick={() => setViewMode(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* New Profile Modal */}
      {viewMode === 'new' && (
        <BirthChartInput
          onChartCalculated={handleChartCalculated}
          onCancel={() => setViewMode('chart')}
        />
      )}

      {/* Edit Profile Modal */}
      {viewMode === 'edit' && profile && (
        <BirthChartInput
          existingChart={profile.chart}
          onChartCalculated={handleChartCalculated}
          onCancel={() => setViewMode('chart')}
        />
      )}

      {/* Main Content */}
      <div style={isSplitView ? (isMobile ? styles.mainContentMobile : styles.mainContent) : styles.mainContentSingle}>
        {/* Left Column - Main Visualization */}
        <div style={styles.leftColumn}>
          {viewMode === 'chart' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>◉ Natal Chart</h3>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Drag to rotate • Click planets for details
                </span>
              </div>
              <div style={styles.chartContainer}>
                <ChartWheel
                  chart={profile.chart}
                  size="responsive"
                  showAspects={true}
                  onPlanetClick={handlePlanetClick}
                  selectedPlanet={selectedPlanet}
                />
              </div>
            </div>
          )}

          {viewMode === 'elements' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>🔥 Elemental Temple</h3>
              </div>
              <div style={{ ...styles.cardContent, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ElementTemple chart={profile.chart} size={isMobile ? 320 : 400} />
              </div>
            </div>
          )}

          {viewMode === 'dignities' && (
            <PlanetaryCourt 
              chart={profile.chart} 
              onPlanetClick={handlePlanetClick}
            />
          )}
          
          {/* Planet Detail Modal */}
          {selectedPlanet && profile.chart.planets[selectedPlanet] && (
            <PlanetDetailModal
              planetId={selectedPlanet}
              planet={profile.chart.planets[selectedPlanet]}
              isOpen={!!selectedPlanet}
              onClose={() => setSelectedPlanet(null)}
            />
          )}

          {viewMode === 'promise' && natalPromise && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Main Promise */}
              <div style={styles.promiseCard}>
                <div style={styles.promiseTitle}>✨ Your Soul's Promise</div>
                <p style={styles.promiseText}>{natalPromise.summary}</p>
              </div>

              {/* Life Themes */}
              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>🌟 Life Themes</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.themesList}>
                    {natalPromise.lifeThemes.map((theme, i) => (
                      <div key={i} style={styles.themeItem}>{theme}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gifts & Challenges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>🎁 Natural Gifts</h3>
                  </div>
                  <div style={styles.cardContent}>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255,255,255,0.8)' }}>
                      {natalPromise.naturalGifts.map((gift, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>{gift}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>🌱 Growth Edges</h3>
                  </div>
                  <div style={styles.cardContent}>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'rgba(255,255,255,0.8)' }}>
                      {natalPromise.growthChallenges.map((challenge, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats & Details */}
        {isSplitView && (
          <div style={styles.rightColumn}>
            {/* Natal Promise Summary */}
            {natalPromise && (
              <div style={styles.promiseCard}>
                <div style={styles.promiseTitle}>✨ Soul Promise</div>
                <p style={{ ...styles.promiseText, fontSize: '15px' }}>
                  {natalPromise.soulPurpose}
                </p>
              </div>
            )}

            {/* Sun Sign - Prominently Displayed */}
            <div style={{
              ...styles.card,
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
            }}>
              <div style={{ ...styles.cardContent, textAlign: 'center' as const }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                  {SIGN_SYMBOLS[profile.chart.planets.sun?.sign] || '☉'}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: '#fbbf24', marginBottom: '4px' }}>
                  {profile.chart.planets.sun?.sign ? 
                    profile.chart.planets.sun.sign.charAt(0).toUpperCase() + profile.chart.planets.sun.sign.slice(1) 
                    : 'Unknown'}
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                  ☉ Sun Sign • You are a {profile.chart.planets.sun?.sign || 'unknown'}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  {profile.chart.planets.sun && `${Math.floor(profile.chart.planets.sun.degreeInSign)}° ${profile.chart.planets.sun.sign}`}
                </div>
                {!profile.chart.planets.sun && (
                  <div style={{ 
                    marginTop: '12px', 
                    padding: '8px 12px', 
                    background: 'rgba(239, 68, 68, 0.2)', 
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fca5a5',
                  }}>
                    ⚠️ Chart data incomplete. <button 
                      onClick={() => setViewMode('new')}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#fbbf24', 
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0,
                        fontSize: '12px',
                      }}
                    >Recreate your chart</button>
                  </div>
                )}
              </div>
            </div>

            {/* Planet Positions Grid -->
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>🪐 Planet Positions</h3>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.planetGrid}>
                  {Object.entries(profile.chart.planets)
                    .filter(([id]) => PLANET_ORDER.includes(id))
                    .sort(([a], [b]) => PLANET_ORDER.indexOf(a) - PLANET_ORDER.indexOf(b))
                    .map(([id, planet]) => (
                      <div 
                        key={id} 
                        style={{
                          ...styles.planetGridItem,
                          ...(selectedPlanet === id && { 
                            borderColor: 'rgba(147, 51, 234, 0.5)',
                            background: 'rgba(147, 51, 234, 0.1)',
                          }),
                        }}
                        onClick={() => setSelectedPlanet(selectedPlanet === id ? null : id)}
                      >
                        <div style={{...styles.planetSymbol, color: ({sun: '#fbbf24', moon: '#c4b5fd', mercury: '#94a3b8', venus: '#f472b6', mars: '#ef4444', jupiter: '#a78bfa', saturn: '#64748b', uranus: '#22d3ee', neptune: '#3b82f6', pluto: '#9333ea'}[id] || '#fff')}}>
                          {PLANET_SYMBOLS[id] || '●'}
                        </div>
                        <div style={styles.planetInfo}>
                          <div style={styles.planetName}>{id}</div>
                          <div style={styles.planetSign}>
                            {SIGN_SYMBOLS[planet.sign]} {planet.sign?.slice(0, 3)}
                          </div>
                          <div style={styles.planetDegree}>
                            {Math.floor(planet.degreeInSign)}° • House {planet.house}
                            {planet.isRetrograde && ' ℞'}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Major Aspects */}
            {(() => {
              const aspects = calculateAspects(profile.chart);
              if (aspects.length === 0) return null;
              return (
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>⚡ Major Aspects</h3>
                  </div>
                  <div style={styles.cardContent}>
                    <div style={styles.aspectsList}>
                      {aspects.slice(0, 8).map((aspect, i) => (
                        <div key={i} style={styles.aspectItem}>
                          <span>
                            {PLANET_SYMBOLS[aspect.planet1] || aspect.planet1} 
                            {' '}⬌{' '}
                            {PLANET_SYMBOLS[aspect.planet2] || aspect.planet2}
                          </span>
                          <span style={{
                            ...styles.aspectType, 
                            background: ASPECT_COLORS[aspect.type] + '30',
                            color: ASPECT_COLORS[aspect.type],
                          }}>
                            {aspect.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Actions */}
            <div style={styles.card}>
              <div style={styles.cardContent}>
                <div style={styles.actionBar}>
                  <button 
                    style={styles.actionButton}
                    onClick={() => setViewMode('new')}
                  >
                    + New Chart
                  </button>
                  <button 
                    style={styles.actionButton}
                    onClick={() => setViewMode('edit')}
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthChartView;
