/**
 * ASTROLOGY HUB - CELESTIAL NAVIGATION CENTER
 * 
 * A state-of-the-art astrological learning platform that guides users
 * through their cosmic blueprint while teaching advanced astrology.
 * 
 * "The stars incline, they do not compel." - Ptolemy
 */

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, selectSelectedAstroProfile, selectAllAstroProfiles } from '../store';
import { setView, addAstroProfile, deleteAstroProfile, selectAstroProfile } from '../store';
import { PlanetPosition, AstroProfile, DailyTransit, NatalChart, HouseCusp } from '../types/astrology';
import { calculatePlanetaryPositions, calculateDailyTransits, generateNatalChart } from '../services/AstroCalculationEngine';
import { setZodiacSystem } from '../services/SwissEphemerisEngine';
import BirthChartForm from '../components/astro/BirthChartForm';
import BirthChartWheel from '../components/astro/BirthChartWheel';
import './AstrologyHub.css';

// Educational content for astrology learning
const ASTROLOGY_GUIDE = {
  houses: {
    1: { name: 'First House', area: 'Self & Identity', description: 'The Ascendant. Your outer personality, physical body, and how others first perceive you.' },
    2: { name: 'Second House', area: 'Values & Resources', description: 'Your material possessions, money, and what you value in life.' },
    3: { name: 'Third House', area: 'Communication', description: 'Daily communication, siblings, short travels, and early education.' },
    4: { name: 'Fourth House', area: 'Home & Roots', description: 'Your home, family, ancestry, and emotional foundation.' },
    5: { name: 'Fifth House', area: 'Creativity & Romance', description: 'Self-expression, romance, children, and pleasure.' },
    6: { name: 'Sixth House', area: 'Health & Service', description: 'Daily routines, work, health, and service to others.' },
    7: { name: 'Seventh House', area: 'Partnerships', description: 'Marriage, business partnerships, and close relationships.' },
    8: { name: 'Eighth House', area: 'Transformation', description: 'Shared resources, death, rebirth, and deep intimacy.' },
    9: { name: 'Ninth House', area: 'Philosophy & Travel', description: 'Higher learning, spirituality, long travels, and belief systems.' },
    10: { name: 'Tenth House', area: 'Career & Status', description: 'The Midheaven. Your public image, career, and life direction.' },
    11: { name: 'Eleventh House', area: 'Community & Friends', description: 'Social groups, friendships, hopes, and dreams.' },
    12: { name: 'Twelfth House', area: 'Spirituality & Secrets', description: 'The unconscious, hidden matters, spiritual growth, and solitude.' },
  },
  planets: {
    sun: { symbol: '☉', name: 'Sun', meaning: 'Your core identity, ego, and life force.' },
    moon: { symbol: '☽', name: 'Moon', meaning: 'Your emotions, instincts, and subconscious needs.' },
    mercury: { symbol: '☿', name: 'Mercury', meaning: 'Your mind, communication style, and thought processes.' },
    venus: { symbol: '♀', name: 'Venus', meaning: 'Your love nature, values, and aesthetic sense.' },
    mars: { symbol: '♂', name: 'Mars', meaning: 'Your drive, ambition, and how you take action.' },
    jupiter: { symbol: '♃', name: 'Jupiter', meaning: 'Your growth, expansion, and areas of good fortune.' },
    saturn: { symbol: '♄', name: 'Saturn', meaning: 'Your challenges, responsibilities, and lessons.' },
    uranus: { symbol: '♅', name: 'Uranus', meaning: 'Your uniqueness, rebellion, and sudden changes.' },
    neptune: { symbol: '♆', name: 'Neptune', meaning: 'Your dreams, spirituality, and imagination.' },
    pluto: { symbol: '♇', name: 'Pluto', meaning: 'Your transformation, power, and deepest changes.' },
  },
  elements: {
    fire: 'Creative, enthusiastic, and action-oriented. Aries, Leo, Sagittarius.',
    earth: 'Practical, reliable, and sensual. Taurus, Virgo, Capricorn.',
    air: 'Intellectual, social, and communicative. Gemini, Libra, Aquarius.',
    water: 'Emotional, intuitive, and nurturing. Cancer, Scorpio, Pisces.',
  },
  modalities: {
    cardinal: 'Initiators and leaders. Aries, Cancer, Libra, Capricorn.',
    fixed: 'Stabilizers and sustainers. Taurus, Leo, Scorpio, Aquarius.',
    mutable: 'Adapters and communicators. Gemini, Virgo, Sagittarius, Pisces.',
  },
};

// Educational tooltip component
const AstroTooltip: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="astro-tooltip-container" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="astro-tooltip">
          <div className="tooltip-title">{title}</div>
        </div>
      )}
    </div>
  );
};

export const AstrologyHub: React.FC = () => {
  const dispatch = useDispatch();
  const astroProfile = useSelector(selectSelectedAstroProfile);
  const allProfiles = useSelector(selectAllAstroProfiles);
  const selectedProfileId = useSelector((state: RootState) => state.calendar.selectedAstroProfileId);
  const currentTheme = useSelector((state: RootState) => state.calendar.theme);
  
  const [activeSection, setActiveSection] = useState<'profiles' | 'chart' | 'houses' | 'planets' | 'transits'>('profiles');
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [currentPositions, setCurrentPositions] = useState<PlanetPosition[]>([]);
  const [dailyTransit, setDailyTransit] = useState<DailyTransit | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  
  useEffect(() => {
    loadData();
  }, [astroProfile]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const positions = await calculatePlanetaryPositions(new Date());
      setCurrentPositions(positions);
      
      if (astroProfile?.natalChart) {
        const transit = await calculateDailyTransits(new Date(), astroProfile.natalChart);
        setDailyTransit(transit);
      }
    } catch (error) {
      console.error('Failed to load planetary data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveProfile = async (profileData: Omit<AstroProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    try {
      setZodiacSystem(profileData.preferences.zodiacSystem === '13-sign');
      
      const birthTime = profileData.birthTimeUnknown ? '12:00' : profileData.birthTime;
      const natalChartResult = await generateNatalChart(
        profileData.birthDate,
        birthTime,
        profileData.location.latitude,
        profileData.location.longitude,
        profileData.timezone,
        profileData.preferences.houseSystem
      );
      
      const newProfile: AstroProfile = {
        ...profileData,
        id: `astro-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
        natalChart: natalChartResult,
      };
      
      dispatch(addAstroProfile(newProfile));
      setShowProfileForm(false);
      setActiveSection('chart');
    } catch (error) {
      console.error('Birth chart calculation failed:', error);
    }
  };
  
  const handleSelectProfile = (profileId: string) => {
    dispatch(selectAstroProfile(profileId));
    setActiveSection('chart');
  };
  
  const handleDeleteProfile = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this cosmic blueprint? This cannot be undone.')) {
      dispatch(deleteAstroProfile(profileId));
    }
  };
  
  const renderWelcomeGuide = () => (
    <div className="celestial-welcome">
      <div className="welcome-header">
        <h1>✨ Celestial Navigation Center</h1>
        <p className="welcome-quote">"As above, so below. As within, so without."</p>
      </div>
      
      {showGuide && (
        <div className="learning-guide">
          <h3>🌟 Begin Your Astrological Journey</h3>
          <p>
            Welcome to your personal astrology academy. Here, you'll discover your cosmic blueprint
            and learn the ancient language of the stars.
          </p>
          <div className="guide-steps">
            <div className="guide-step">
              <span className="step-number">1</span>
              <span className="step-text">Create your birth chart profile</span>
            </div>
            <div className="guide-step">
              <span className="step-number">2</span>
              <span className="step-text">Explore your planetary positions</span>
            </div>
            <div className="guide-step">
              <span className="step-number">3</span>
              <span className="step-text">Learn about your houses</span>
            </div>
            <div className="guide-step">
              <span className="step-number">4</span>
              <span className="step-text">Track daily transits and guidance</span>
            </div>
          </div>
          <button className="btn-guide-close" onClick={() => setShowGuide(false)}>
            Begin Journey →
          </button>
        </div>
      )}
    </div>
  );
  
  const renderProfileManager = () => (
    <div className="celestial-panel profiles-panel">
      <div className="panel-header">
        <h2>🌙 Cosmic Blueprints</h2>
        <button className="btn-create" onClick={() => setShowProfileForm(true)}>
          + Create New
        </button>
      </div>
      
      {allProfiles.length === 0 ? (
        <div className="empty-constellation">
          <div className="constellation-icon">✨</div>
          <h3>No Celestial Maps Yet</h3>
          <p>Create your first birth chart to begin exploring the cosmos.</p>
          <button className="btn-primary" onClick={() => setShowProfileForm(true)}>
            Cast Your Chart
          </button>
        </div>
      ) : (
        <div className="blueprint-grid">
          {allProfiles.map(profile => {
            const sunSign = profile.natalChart?.positions.find(p => p.planet === 'sun')?.sign;
            const moonSign = profile.natalChart?.positions.find(p => p.planet === 'moon')?.sign;
            const rising = profile.natalChart?.ascendant?.sign;
            
            return (
              <div 
                key={profile.id}
                className={`blueprint-card ${selectedProfileId === profile.id ? 'active' : ''}`}
                onClick={() => handleSelectProfile(profile.id)}
              >
                <div className="blueprint-glow"></div>
                <div className="blueprint-content">
                  <h3>{profile.name}</h3>
                  <p className="birth-data">{profile.birthDate}</p>
                  <p className="location-data">{profile.location.name}</p>
                  
                  <div className="cosmic-trio">
                    <div className="trio-item">
                      <span className="trio-label">☉ Sun</span>
                      <span className="trio-value">{sunSign ? capitalize(sunSign) : '--'}</span>
                    </div>
                    <div className="trio-item">
                      <span className="trio-label">☽ Moon</span>
                      <span className="trio-value">{moonSign ? capitalize(moonSign) : '--'}</span>
                    </div>
                    <div className="trio-item">
                      <span className="trio-label">↑ Rising</span>
                      <span className="trio-value">{rising ? capitalize(rising) : '--'}</span>
                    </div>
                  </div>
                  
                  <div className="blueprint-meta">
                    <span className="zodiac-system">{profile.preferences.zodiacSystem}</span>
                    <span className="house-system">{profile.preferences.houseSystem}</span>
                  </div>
                </div>
                
                <button 
                  className="btn-delete-subtle"
                  onClick={(e) => handleDeleteProfile(profile.id, e)}
                  title="Delete profile"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
  const renderBirthChart = () => {
    if (!astroProfile?.natalChart) return null;
    
    return (
      <div className="celestial-panel chart-panel">
        <div className="panel-header">
          <h2>🌟 {astroProfile.name}'s Natal Chart</h2>
          <div className="chart-controls">
            <button 
              className={activeSection === 'chart' ? 'active' : ''}
              onClick={() => setActiveSection('chart')}
            >
              Wheel
            </button>
            <button 
              className={activeSection === 'houses' ? 'active' : ''}
              onClick={() => setActiveSection('houses')}
            >
              Houses
            </button>
            <button 
              className={activeSection === 'planets' ? 'active' : ''}
              onClick={() => setActiveSection('planets')}
            >
              Planets
            </button>
          </div>
        </div>
        
        {activeSection === 'chart' && (
          <div className="chart-visualization">
            <div className="wheel-container">
              <BirthChartWheel 
                natalChart={astroProfile.natalChart}
                size={380}
                use13Sign={astroProfile.preferences?.zodiacSystem === '13-sign'}
                showAspects={true}
              />
            </div>
            
            <div className="chart-insights">
              <div className="insight-card">
                <h4>🌅 The Big Three</h4>
                <div className="big-three">
                  {astroProfile.natalChart.ascendant && (
                    <div className="big-three-item">
                      <span className="big-label">Rising (Ascendant)</span>
                      <span className="big-value">
                        {capitalize(astroProfile.natalChart.ascendant.sign)} {astroProfile.natalChart.ascendant.degree.toFixed(1)}°
                      </span>
                      <p className="big-meaning">Your outer mask, first impressions</p>
                    </div>
                  )}
                  
                  {(() => {
                    const sun = astroProfile.natalChart!.positions.find(p => p.planet === 'sun');
                    return sun && (
                      <div className="big-three-item">
                        <span className="big-label">Sun Sign</span>
                        <span className="big-value">
                          {capitalize(sun.sign)} {sun.degree.toFixed(1)}°
                        </span>
                        <p className="big-meaning">Your core identity, life purpose</p>
                      </div>
                    );
                  })()}
                  
                  {(() => {
                    const moon = astroProfile.natalChart!.positions.find(p => p.planet === 'moon');
                    return moon && (
                      <div className="big-three-item">
                        <span className="big-label">Moon Sign</span>
                        <span className="big-value">
                          {capitalize(moon.sign)} {moon.degree.toFixed(1)}°
                        </span>
                        <p className="big-meaning">Your emotions, inner world</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
              
              {astroProfile.natalChart.midheaven && (
                <div className="insight-card">
                  <h4>🎯 Midheaven (MC)</h4>
                  <div className="mc-display">
                    <span className="mc-sign">{capitalize(astroProfile.natalChart.midheaven.sign)}</span>
                    <span className="mc-degree">{astroProfile.natalChart.midheaven.degree.toFixed(1)}°</span>
                  </div>
                  <p className="mc-meaning">
                    Your public calling, career direction, and how you're remembered. 
                    The Midheaven represents your highest aspiration in this lifetime.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeSection === 'houses' && renderHouseExplorer()}
        {activeSection === 'planets' && renderPlanetExplorer()}
      </div>
    );
  };
  
  const renderHouseExplorer = () => {
    if (!astroProfile?.natalChart?.houses) return null;
    
    return (
      <div className="house-explorer">
        <div className="explorer-intro">
          <h3>🏛️ The Twelve Houses</h3>
          <p>
            The houses represent different areas of your life, like rooms in a mansion. 
            Each house has a zodiac sign on its cusp, showing how you approach that life area.
          </p>
        </div>
        
        <div className="houses-grid">
          {astroProfile.natalChart.houses.map((house) => {
            const planets = astroProfile.natalChart!.positions.filter(p => p.house === house.house);
            const guide = ASTROLOGY_GUIDE.houses[house.house as keyof typeof ASTROLOGY_GUIDE.houses];
            
            return (
              <div 
                key={house.house}
                className={`house-card ${selectedHouse === house.house ? 'selected' : ''}`}
                onClick={() => setSelectedHouse(selectedHouse === house.house ? null : house.house)}
              >
                <div className="house-number">{house.house}</div>
                <div className="house-cusp">
                  <span className="cusp-sign">{capitalize(house.sign)}</span>
                  <span className="cusp-degree">{house.degree.toFixed(1)}°</span>
                </div>
                <div className="house-info">
                  <span className="house-name">{guide?.name}</span>
                  <span className="house-area">{guide?.area}</span>
                </div>
                
                {planets.length > 0 && (
                  <div className="house-planets">
                    {planets.map(p => (
                      <span key={p.planet} className="planet-badge" title={ASTROLOGY_GUIDE.planets[p.planet as keyof typeof ASTROLOGY_GUIDE.planets]?.meaning}>
                        {ASTROLOGY_GUIDE.planets[p.planet as keyof typeof ASTROLOGY_GUIDE.planets]?.symbol || '●'} {capitalize(p.planet)}
                      </span>
                    ))}
                  </div>
                )}
                
                {selectedHouse === house.house && (
                  <div className="house-deep-dive">
                    <p className="house-description">{guide?.description}</p>
                    {planets.length > 0 && (
                      <div className="planet-in-house">
                        <h5>Planets in this House:</h5>
                        {planets.map(p => (
                          <div key={p.planet} className="planet-interpretation">
                            <strong>{ASTROLOGY_GUIDE.planets[p.planet as keyof typeof ASTROLOGY_GUIDE.planets]?.symbol} {capitalize(p.planet)}</strong>
                            <p>
                              Your {capitalize(p.planet)} energy expresses itself in the area of {guide?.area.toLowerCase()}.
                              {p.planet === 'sun' && ' This brings vitality and focus to this life area.'}
                              {p.planet === 'moon' && ' Your emotions are deeply connected to matters of this house.'}
                              {p.planet === 'mercury' && ' You think and communicate about matters of this house.'}
                              {p.planet === 'venus' && ' You find beauty, love, and harmony in this area.'}
                              {p.planet === 'mars' && ' You take action and assert yourself in this life area.'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const renderPlanetExplorer = () => {
    if (!astroProfile?.natalChart) return null;
    
    return (
      <div className="planet-explorer">
        <div className="explorer-intro">
          <h3>☿ The Planets</h3>
          <p>
            Each planet represents a different facet of your personality and life experience. 
            Click on a planet to learn about its placement in your chart.
          </p>
        </div>
        
        <div className="planets-list">
          {astroProfile.natalChart.positions
            .filter(p => ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'].includes(p.planet))
            .map(planet => {
              const guide = ASTROLOGY_GUIDE.planets[planet.planet as keyof typeof ASTROLOGY_GUIDE.planets];
              const house = astroProfile.natalChart!.houses?.find(h => h.house === planet.house);
              
              return (
                <div 
                  key={planet.planet}
                  className={`planet-detail-card ${selectedPlanet === planet.planet ? 'expanded' : ''}`}
                  onClick={() => setSelectedPlanet(selectedPlanet === planet.planet ? null : planet.planet)}
                >
                  <div className="planet-header">
                    <span className="planet-symbol-large">{guide?.symbol}</span>
                    <div className="planet-title">
                      <h4>{guide?.name}</h4>
                      <span className="planet-sign-degree">
                        {capitalize(planet.sign)} {planet.degree.toFixed(1)}°
                      </span>
                    </div>
                    {house && (
                      <div className="planet-house-badge">
                        House {house.house}
                      </div>
                    )}
                    {planet.isRetrograde && (
                      <div className="retrograde-indicator" title="Retrograde">
                        ℞ Rx
                      </div>
                    )}
                  </div>
                  
                  <p className="planet-meaning">{guide?.meaning}</p>
                  
                  {selectedPlanet === planet.planet && (
                    <div className="planet-deep-dive">
                      <div className="placement-meaning">
                        <h5>In {capitalize(planet.sign)}:</h5>
                        <p>
                          Your {guide?.name} expresses itself through the qualities of {capitalize(planet.sign)}. 
                          {planet.sign === 'aries' && ' Bold, direct, and pioneering energy.'}
                          {planet.sign === 'taurus' && ' Steady, sensual, and determined approach.'}
                          {planet.sign === 'gemini' && ' Curious, versatile, and communicative nature.'}
                          {planet.sign === 'cancer' && ' Nurturing, protective, and emotionally intuitive.'}
                          {planet.sign === 'leo' && ' Creative, confident, and generous expression.'}
                          {planet.sign === 'virgo' && ' Analytical, practical, and service-oriented.'}
                          {planet.sign === 'libra' && ' Harmonious, diplomatic, and relationship-focused.'}
                          {planet.sign === 'scorpio' && ' Intense, transformative, and deeply perceptive.'}
                          {planet.sign === 'sagittarius' && ' Adventurous, philosophical, and freedom-loving.'}
                          {planet.sign === 'capricorn' && ' Ambitious, disciplined, and achievement-oriented.'}
                          {planet.sign === 'aquarius' && ' Innovative, independent, and humanitarian.'}
                          {planet.sign === 'pisces' && ' Compassionate, imaginative, and spiritually attuned.'}
                          {planet.sign === 'ophiuchus' && ' Healing, wisdom-seeking, and transformational.'}
                        </p>
                      </div>
                      
                      {house && (
                        <div className="house-placement">
                          <h5>In House {house.house}:</h5>
                          <p>
                            This placement affects your {ASTROLOGY_GUIDE.houses[house.house as keyof typeof ASTROLOGY_GUIDE.houses]?.area.toLowerCase()}.
                          </p>
                        </div>
                      )}
                      
                      {planet.isRetrograde && (
                        <div className="retrograde-meaning">
                          <h5>℞ Retrograde:</h5>
                          <p>
                            This planet's energy is turned inward. You may experience {guide?.name.toLowerCase()} 
                            matters more introspectively or unconventionally. This is a karmic invitation to 
                            review and reconsider this area of life.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  };
  
  const renderTransits = () => {
    if (!astroProfile?.natalChart) {
      return (
        <div className="celestial-panel">
          <div className="panel-header">
            <h2>☿ Daily Transits</h2>
          </div>
          <div className="empty-constellation">
            <div className="constellation-icon">🌙</div>
            <h3>No Profile Selected</h3>
            <p>Select a birth chart to see your personalized daily transits.</p>
          </div>
        </div>
      );
    }
    
    if (!dailyTransit) {
      return (
        <div className="celestial-panel">
          <div className="transit-loading">
            <div className="loading-orb">🌙</div>
            <p>Calculating celestial movements...</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="celestial-panel transits-panel">
        <div className="panel-header">
          <h2>☿ Today's Cosmic Weather for {astroProfile.name}</h2>
          <span className="transit-date">{new Date().toLocaleDateString()}</span>
        </div>
        
        <div className="transit-overview">
          <div className="moon-phase-card">
            <span className="moon-emoji-large">{getMoonPhaseEmoji(dailyTransit.moonPhase)}</span>
            <div className="moon-info">
              <h3>{formatMoonPhase(dailyTransit.moonPhase)}</h3>
              <p>Moon in {capitalize(dailyTransit.moonSign)}</p>
            </div>
          </div>
          
          <div className={`power-level-card power-${dailyTransit.powerLevel}`}>
            <span className="power-label">Cosmic Intensity</span>
            <span className="power-value">{dailyTransit.powerLevel.replace('-', ' ')}</span>
          </div>
        </div>
        
        {dailyTransit.transitsToNatal.length > 0 ? (
          <div className="transits-list">
            <h3>🌟 Active Transits</h3>
            {dailyTransit.transitsToNatal.slice(0, 8).map((transit, idx) => (
              <div key={idx} className={`transit-item ${transit.orb < 2 ? 'major' : ''}`}>
                <div className="transit-planets">
                  <span className="transiting">
                    {ASTROLOGY_GUIDE.planets[transit.transitingPlanet as keyof typeof ASTROLOGY_GUIDE.planets]?.symbol} {capitalize(transit.transitingPlanet)}
                  </span>
                  <span className="aspect-type">{transit.aspect}</span>
                  <span className="natal">
                    your Natal {capitalize(transit.natalPlanet)}
                  </span>
                </div>
                <div className="transit-details">
                  <span className="orb">{transit.orb.toFixed(1)}° orb</span>
                  <span className={`applying ${transit.isApplying ? 'applying-tag' : 'separating-tag'}`}>
                    {transit.isApplying ? 'Applying' : 'Separating'}
                  </span>
                </div>
                <p className="transit-guidance">
                  {getTransitGuidance(transit.transitingPlanet, transit.natalPlanet, transit.aspect)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="peaceful-day">
            <div className="peaceful-icon">🕊️</div>
            <h3>A Peaceful Day</h3>
            <p>No major transits today. A quiet day for introspection, rest, and integrating past experiences.</p>
          </div>
        )}
        
        {dailyTransit.tip && (
          <div className="daily-guidance">
            <h3>💫 Daily Guidance</h3>
            <h4>{dailyTransit.tip.title}</h4>
            <p>{dailyTransit.tip.message}</p>
            {dailyTransit.tip.action && (
              <div className="action-item">
                <span className="action-icon">💡</span>
                <span>{dailyTransit.tip.action}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
  
  const getTransitGuidance = (transiting: string, natal: string, aspect: string) => {
    const guidance: Record<string, string> = {
      'moon-sun-conjunction': 'Your emotions align with your will. Trust your instincts today.',
      'moon-sun-opposition': 'Tension between heart and mind. Seek balance in decisions.',
      'sun-sun-conjunction': 'Your Solar Return energy! A personal new year begins.',
      'mercury-mercury-conjunction': 'Mental clarity. Excellent for important communications.',
      'venus-venus-conjunction': 'Values clarified. Beauty and harmony surround you.',
      'mars-mars-conjunction': 'Energy surge! Channel this vitality constructively.',
    };
    const key = `${transiting}-${natal}-${aspect}`;
    return guidance[key] || 
      `${capitalize(transiting)} energy activates your natal ${capitalize(natal)}. Notice how this manifests.`;
  };
  
  return (
    <div className={`astrology-hub theme-${currentTheme}`}>
      <header className="celestial-header">
        <button className="btn-back" onClick={() => dispatch(setView('month'))}>
          ← Back to Calendar
        </button>
        <div className="header-title">
          <h1>Celestial Navigation Center</h1>
          <span className="header-subtitle">Your Personal Astrology Academy</span>
        </div>
        <div className="header-spacer" />
      </header>
      
      <nav className="celestial-nav">
        <button 
          className={activeSection === 'profiles' ? 'active' : ''}
          onClick={() => setActiveSection('profiles')}
        >
          🌙 Profiles
        </button>
        <button 
          className={activeSection === 'chart' || activeSection === 'houses' || activeSection === 'planets' ? 'active' : ''}
          onClick={() => setActiveSection(astroProfile ? 'chart' : 'profiles')}
          disabled={!astroProfile}
        >
          🌟 Birth Chart
        </button>
        <button 
          className={activeSection === 'transits' ? 'active' : ''}
          onClick={() => setActiveSection('transits')}
          disabled={!astroProfile}
        >
          ☿ Transits
        </button>
      </nav>
      
      <main className="celestial-content">
        {showProfileForm ? (
          <div className="celestial-panel">
            <div className="panel-header">
              <h2>✨ Cast Your Birth Chart</h2>
              <button className="btn-close" onClick={() => setShowProfileForm(false)}>×</button>
            </div>
            <BirthChartForm 
              onSubmit={handleSaveProfile}
              onCancel={() => setShowProfileForm(false)}
            />
          </div>
        ) : (
          <>
            {activeSection === 'profiles' && (
              <>
                {renderWelcomeGuide()}
                {renderProfileManager()}
              </>
            )}
            {(activeSection === 'chart' || activeSection === 'houses' || activeSection === 'planets') && renderBirthChart()}
            {activeSection === 'transits' && renderTransits()}
          </>
        )}
      </main>
    </div>
  );
};

// Helper functions
function capitalize(str: string | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getMoonPhaseEmoji(phase: string): string {
  const emojis: Record<string, string> = {
    'new-moon': '🌑', 'waxing-crescent': '🌒', 'first-quarter': '🌓',
    'waxing-gibbous': '🌔', 'full-moon': '🌕', 'waning-gibbous': '🌖',
    'last-quarter': '🌗', 'waning-crescent': '🌘'
  };
  return emojis[phase] || '🌙';
}

function formatMoonPhase(phase: string): string {
  return phase.split('-').map(capitalize).join(' ');
}

export default AstrologyHub;
