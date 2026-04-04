/**
 * useChart Hook
 * Provides chart data and calculations for components
 */

import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';

import type {
  PlanetId,
  NatalChart,
  HouseSystem,
  Aspect,
  Pattern,
  ElementalBalance,
  ModalBalance
} from '../types';

import {
  selectSelectedProfileChart,
  selectChartBodies,
  selectHouses,
  selectHouseCusps,
  selectChartAspects,
  selectChartPatterns,
  selectElementalBalance,
  selectModalBalance,
  selectSunSign,
  selectMoonSign,
  selectRisingSign
} from '../store/selectors';

import { setChartDisplayOption } from '../store/slice';

export interface UseChartReturn {
  // Data
  chart: NatalChart | null;
  bodies: Record<PlanetId, { longitude: number; sign: string; degreeInSign: number; isRetrograde: boolean }> | null;
  houses: HouseSystem | null;
  houseCusps: HouseSystem['cusps'];
  aspects: readonly Aspect[];
  patterns: readonly Pattern[];
  elementalBalance: ElementalBalance | null;
  modalBalance: ModalBalance | null;
  
  // Key positions
  sunSign: string | null;
  moonSign: string | null;
  risingSign: string | null;
  
  // Display options
  displayOptions: {
    showAspects: boolean;
    showHouses: boolean;
    showPatterns: boolean;
  };
  
  // Actions
  setShowAspects: (show: boolean) => void;
  setShowHouses: (show: boolean) => void;
  setShowPatterns: (show: boolean) => void;
  
  // Computed
  hasChart: boolean;
  planetList: { id: PlanetId; name: string; sign: string; degree: number; retrograde: boolean }[];
  sortedAspects: Aspect[];
}

export function useChart(): UseChartReturn {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const chart = useSelector(selectSelectedProfileChart);
  const bodies = useSelector(selectChartBodies);
  const houses = useSelector(selectHouses);
  const houseCusps = useSelector(selectHouseCusps);
  const aspects = useSelector(selectChartAspects);
  const patterns = useSelector(selectChartPatterns);
  const elementalBalance = useSelector(selectElementalBalance);
  const modalBalance = useSelector(selectModalBalance);
  const sunSign = useSelector(selectSunSign);
  const moonSign = useSelector(selectMoonSign);
  const risingSign = useSelector(selectRisingSign);
  
  // Display options from chart
  const displayOptions = useMemo(() => ({
    showAspects: chart ? true : false,
    showHouses: chart ? true : false,
    showPatterns: chart ? true : false
  }), [chart]);
  
  // Actions
  const setShowAspects = useCallback((show: boolean) => {
    dispatch(setChartDisplayOption({ option: 'showAspects', value: show }));
  }, [dispatch]);
  
  const setShowHouses = useCallback((show: boolean) => {
    dispatch(setChartDisplayOption({ option: 'showHouses', value: show }));
  }, [dispatch]);
  
  const setShowPatterns = useCallback((show: boolean) => {
    dispatch(setChartDisplayOption({ option: 'showPatterns', value: show }));
  }, [dispatch]);
  
  // Computed values
  const hasChart = chart !== null;
  
  const planetList = useMemo(() => {
    if (!bodies) return [];
    
    return Object.entries(bodies)
      .map(([id, body]) => ({
        id: id as PlanetId,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        sign: body.sign,
        degree: body.degreeInSign,
        retrograde: body.isRetrograde
      }))
      .sort((a, b) => {
        // Sort by standard planetary order
        const order = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'chiron'];
        return order.indexOf(a.id) - order.indexOf(b.id);
      });
  }, [bodies]);
  
  const sortedAspects = useMemo(() => {
    // Sort by orb (tightest first), then by importance
    const importance: Record<Aspect['type'], number> = {
      conjunction: 1,
      opposition: 2,
      trine: 3,
      square: 4,
      sextile: 5,
      quincunx: 6,
      semisextile: 7,
      semisquare: 8,
      quintile: 9,
      sesquiquadrate: 10,
      biquintile: 11,
    };
    
    return [...aspects].sort((a, b) => {
      if (a.orb !== b.orb) return a.orb - b.orb;
      return importance[a.type] - importance[b.type];
    });
  }, [aspects]);
  
  return {
    chart,
    bodies,
    houses,
    houseCusps,
    aspects,
    patterns,
    elementalBalance,
    modalBalance,
    sunSign,
    moonSign,
    risingSign,
    displayOptions,
    setShowAspects,
    setShowHouses,
    setShowPatterns,
    hasChart,
    planetList,
    sortedAspects
  };
}

export default useChart;
