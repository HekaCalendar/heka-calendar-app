/**
 * Day Panel Astrology Component
 * Shows daily celestial guidance in the day panel
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { PlanetPosition } from '../../types/astrology';
import { calculatePlanetaryPositions } from '../../services/AstroCalculationEngine';
import { getHekaZodiacReading } from '../../utils/hekaAstro';

interface DayPanelAstrologyProps {
  hekaYear: number;
  hekaMonth: number;
  hekaDay: number;
}

interface AstroData {
  moonPhase: string;
  moonSign: string;
  sunSign: string;
  zodiacSign: string;
  zodiacElement: string;
  guidance: string;
  powerWord: string;
  keyTransit: string | null;
  isRetrogradeActive: boolean;
  personalTransit?: string | undefined;
  luckyHours?: string | null;
}

export const DayPanelAstrology: React.FC<DayPanelAstrologyProps> = ({
  hekaYear,
  hekaMonth,
  hekaDay,
}) => {
  const astroPreferences = useSelector((state: RootState) => state.calendar.astroPreferences);
  const astroProfile = useSelector((state: RootState) => state.calendar.astroProfile);
  const [astroData, setAstroData] = useState<AstroData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    calculateDailyAstro();
  }, [hekaYear, hekaMonth, hekaDay, astroProfile]);
  
  const calculateDailyAstro = async () => {
    setLoading(true);
    try {
      // Get planetary positions for today
      const today = new Date();
      const positions = await calculatePlanetaryPositions(today);
      
      // Get moon data
      const moon = positions.find(p => p.planet === 'moon');
      const sun = positions.find(p => p.planet === 'sun');
      
      // Get HEKA zodiac reading
      const hekaReading = getHekaZodiacReading(hekaMonth, hekaDay);
      
      // Check for retrogrades
      const retrogrades = positions.filter(p => 
        ['mercury', 'venus', 'mars'].includes(p.planet) && p.isRetrograde
      );
      
      // Get moon phase
      const moonPhase = getMoonPhase(today);
      
      // Get key transit
      const keyTransit = getKeyTransit(positions, astroProfile);
      
      // Calculate personalized transit if profile exists
      let personalTransit: string | undefined = undefined;
      let luckyHours: string | null = null;
      
      if (astroProfile?.natalChart) {
        personalTransit = calculatePersonalTransit(positions, astroProfile.natalChart);
        luckyHours = calculateLuckyHours(positions, astroProfile.natalChart);
      }
      
      setAstroData({
        moonPhase: moonPhase.name,
        moonSign: moon?.sign || 'unknown',
        sunSign: sun?.sign || 'unknown',
        zodiacSign: hekaReading.zodiacSign,
        zodiacElement: hekaReading.element,
        guidance: hekaReading.guidance,
        powerWord: hekaReading.zodiacData.keywords[0] || 'BALANCE',
        keyTransit,
        isRetrogradeActive: retrogrades.length > 0,
        personalTransit,
        luckyHours,
      });
    } catch (error) {
      console.error('Failed to calculate daily astro:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!astroPreferences.showTransitsOnCalendar) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="day-panel-astro loading">
        <span className="astro-loading-spinner">✨</span>
        <span>Reading the stars...</span>
      </div>
    );
  }
  
  if (!astroData) return null;
  
  const hasPersonalInsights = astroProfile?.natalChart && astroData.personalTransit;
  
  return (
    <div className="day-panel-astro">
      <div className="astro-header-row">
        <span className="astro-icon">✨</span>
        <span className="astro-title">
          {hasPersonalInsights ? 'Your Personal Guidance' : 'Celestial Guidance'}
        </span>
        {astroData.isRetrogradeActive && (
          <span className="retrograde-badge" title="Planetary retrograde active">℞</span>
        )}
      </div>
      
      {/* Moon Phase */}
      <div className="moon-section-compact">
        <span className="moon-emoji">{getMoonEmoji(astroData.moonPhase)}</span>
        <div className="moon-info-compact">
          <span className="moon-phase-name">{astroData.moonPhase}</span>
          <span className="moon-sign">Moon in {capitalize(astroData.moonSign)}</span>
        </div>
      </div>
      
      {/* Daily Guidance */}
      <div className="guidance-card">
        <div className="zodiac-badge" data-element={astroData.zodiacElement}>
          <span className="zodiac-symbol">{getZodiacSymbol(astroData.zodiacSign)}</span>
          <span className="zodiac-name">{capitalize(astroData.zodiacSign)}</span>
        </div>
        
        <p className="guidance-text">{astroData.guidance}</p>
        
        <div className="power-word">
          <span className="power-label">Power Word:</span>
          <span className="power-value">{astroData.powerWord}</span>
        </div>
      </div>
      
      {/* Personalized Transit - Only if birth chart exists */}
      {hasPersonalInsights && (
        <div className="personal-insight-card">
          <div className="insight-header">
            <span className="insight-icon">🌟</span>
            <span className="insight-title">For You Today</span>
          </div>
          
          {astroData.personalTransit && (
            <div className="personal-transit">
              <span className="transit-label">Cosmic Influence:</span>
              <span className="transit-value">{astroData.personalTransit}</span>
            </div>
          )}
          
          {astroData.luckyHours && (
            <div className="lucky-hours">
              <span className="hours-label">Favorable Times:</span>
              <span className="hours-value">{astroData.luckyHours}</span>
            </div>
          )}
          
          <div className="insight-footer">
            <span>Based on your birth chart for {hekaMonth + 1}/{hekaDay}</span>
          </div>
        </div>
      )}
      
      {/* Key Transit */}
      {astroData.keyTransit && (
        <div className="transit-alert">
          <span className="transit-icon">☿</span>
          <span className="transit-text">{astroData.keyTransit}</span>
        </div>
      )}
      
      {/* Birth Chart CTA - Only show if NO profile exists */}
      {!astroProfile && (
        <div className="birth-chart-prompt">
          <div className="prompt-icon">🌙</div>
          <div className="prompt-content">
            <p className="prompt-text">
              Create your birth chart in the Stars section for personalized daily insights
            </p>
            <p className="prompt-subtext">
              See how today's transits specifically affect you
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Calculate personalized transit against natal chart
function calculatePersonalTransit(positions: PlanetPosition[], natalChart: any): string | undefined {
  const moon = positions.find(p => p.planet === 'moon');
  const transitingSun = positions.find(p => p.planet === 'sun');
  
  if (!moon || !natalChart?.positions) return undefined;
  
  const natalSun = natalChart.positions.find((p: any) => p.planet === 'sun');
  const natalMoon = natalChart.positions.find((p: any) => p.planet === 'moon');
  
  if (!natalSun || !natalMoon) return undefined;
  
  // Check for moon conjunct natal sun (monthly return)
  if (moon.sign === natalSun.sign) {
    return 'Moon conjunct your Sun - Personal new moon, set intentions';
  }
  
  // Check for transiting sun conjunct natal sun (solar return)
  if (transitingSun?.sign === natalSun.sign) {
    return 'Solar Return energy - Your personal year begins';
  }
  
  // Check moon phase relative to natal moon
  if (moon.sign === natalMoon.sign) {
    return 'Moon in your natal sign - Emotional renewal';
  }
  
  // Check for challenging aspects
  const challengingSigns = getOppositeSigns(natalSun.sign);
  if (challengingSigns.includes(moon.sign)) {
    return 'Moon opposite your Sun - Balance work and rest';
  }
  
  return undefined;
}

// Calculate lucky hours based on planetary hours
function calculateLuckyHours(positions: PlanetPosition[], _natalChart: any): string | null {
  const sun = positions.find(p => p.planet === 'sun');
  if (!sun) return null;
  
  // Simple planetary hour calculation
  const hour = new Date().getHours();
  const planetaryRulers = ['☉ Sun', '☽ Moon', '♂ Mars', '☿ Mercury', '♃ Jupiter', '♀ Venus', '♄ Saturn'];
  const ruler = planetaryRulers[hour % 7];
  
  return `${ruler} hour active`;
}

function getOppositeSigns(sign: string): string[] {
  const opposites: Record<string, string[]> = {
    aries: ['libra'], taurus: ['scorpio'], gemini: ['sagittarius'],
    cancer: ['capricorn'], leo: ['aquarius'], virgo: ['pisces'],
    libra: ['aries'], scorpio: ['taurus'], sagittarius: ['gemini'],
    capricorn: ['cancer'], aquarius: ['leo'], pisces: ['virgo'],
  };
  return opposites[sign] || [];
}

// Helper functions
function getMoonPhase(date: Date): { name: string; emoji: string } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  let y = year;
  let m = month;
  
  if (m < 3) {
    y--;
    m += 12;
  }
  
  const c = 365.25 * y;
  const e = 30.6 * m;
  const jd = (c + e + day - 694039.09) / 29.5305882;
  const b = Math.round((jd % 1) * 8);
  
  const phases = [
    { name: 'New Moon', emoji: '🌑' },
    { name: 'Waxing Crescent', emoji: '🌒' },
    { name: 'First Quarter', emoji: '🌓' },
    { name: 'Waxing Gibbous', emoji: '🌔' },
    { name: 'Full Moon', emoji: '🌕' },
    { name: 'Waning Gibbous', emoji: '🌖' },
    { name: 'Last Quarter', emoji: '🌗' },
    { name: 'Waning Crescent', emoji: '🌘' },
  ];
  
  return phases[b % 8] || phases[0];
}

function getMoonEmoji(phase: string): string {
  const emojis: Record<string, string> = {
    'New Moon': '🌑', 'Waxing Crescent': '🌒', 'First Quarter': '🌓',
    'Waxing Gibbous': '🌔', 'Full Moon': '🌕', 'Waning Gibbous': '🌖',
    'Last Quarter': '🌗', 'Waning Crescent': '🌘',
  };
  return emojis[phase] || '🌙';
}

function capitalize(str: string | undefined): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getZodiacSymbol(sign: string): string {
  const symbols: Record<string, string> = {
    aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
    leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
    ophiuchus: '⛎', sagittarius: '♐', capricorn: '♑',
    aquarius: '♒', pisces: '♓',
  };
  return symbols[sign] || '✨';
}

function getKeyTransit(positions: PlanetPosition[], _profile: any): string | null {
  const mercury = positions.find(p => p.planet === 'mercury');
  const venus = positions.find(p => p.planet === 'venus');
  const mars = positions.find(p => p.planet === 'mars');
  
  if (mercury?.isRetrograde) {
    return 'Mercury Retrograde - Review contracts, back up data';
  }
  
  if (venus?.isRetrograde) {
    return 'Venus Retrograde - Revisit relationships, avoid major purchases';
  }
  
  if (mars?.isRetrograde) {
    return 'Mars Retrograde - Conserve energy, plan rather than act';
  }
  
  return null;
}

export default DayPanelAstrology;
