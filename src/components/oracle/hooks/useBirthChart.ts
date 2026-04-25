import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedAstroProfile } from '../../../store';
import { 
  selectSelectedProfile as selectAstrologyProfile,
  selectSelectedProfileChart 
} from '../../../astrology/store/selectors';
import type { BirthChartInfo, BirthChartData, EffectiveProfile } from '../types';

export function useBirthChart(isOpen: boolean) {
  const [birthChartInfo, setBirthChartInfo] = useState<BirthChartInfo>({
    hasChart: false,
    profileName: null,
    chart: null,
  });

  // Read directly from localStorage when journal opens
  useEffect(() => {
    if (!isOpen) return;
    
    try {
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
      
      let profile = profiles.find((p: any) => p.id === activeId);
      if (!profile) {
        profile = profiles.find((p: any) => p.isDefault);
      }
      if (!profile) {
        profile = profiles[0];
      }
      
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
  const effectiveProfile = useMemo<EffectiveProfile | null>((): EffectiveProfile | null => {
    if (birthChartInfo.hasChart && birthChartInfo.chart) {
      return {
        name: birthChartInfo.profileName,
        natalChart: birthChartInfo.chart
      };
    }
    
    if (legacyProfile?.natalChart) {
      return legacyProfile as EffectiveProfile;
    }
    
    if (astrologyProfile && astrologyChart) {
      return { ...astrologyProfile, natalChart: astrologyChart };
    }
    
    if (birthChartInfo.profileName) {
      return { name: birthChartInfo.profileName, natalChart: null };
    }
    
    return null;
  }, [birthChartInfo, legacyProfile, astrologyProfile, astrologyChart]);

  const hasBirthChart = birthChartInfo.hasChart || !!legacyProfile?.natalChart || !!(astrologyProfile && astrologyChart);

  // Convert birth chart for transit calculations
  const birthChartData = useMemo<BirthChartData | null>(() => {
    if (!effectiveProfile?.natalChart) return null;
    
    const nc = effectiveProfile.natalChart;
    const planets: BirthChartData['planets'] = {};
    
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
    let ascendant: BirthChartData['ascendant'] = null;
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

  return {
    birthChartInfo,
    effectiveProfile,
    hasBirthChart,
    birthChartData,
  };
}
