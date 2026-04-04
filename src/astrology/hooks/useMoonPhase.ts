/**
 * useMoonPhase Hook
 * Swiss Ephemeris-accurate moon phase calculations
 * Replaces the simple synodic calculation with NASA-grade precision
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateMoonPhaseSwiss, calculateMoonPhaseBatch } from '../services/calculations/swissCalculations';

export interface MoonPhaseData {
  phase: string;
  glyph: string;
  illumination: number;
  age: number;
  waxing: boolean;
  angle: number;
  name: string;
}

export interface UseMoonPhaseReturn {
  data: MoonPhaseData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for getting precise moon phase for a single date
 * Uses Swiss Ephemeris for NASA-grade accuracy
 */
export function useMoonPhase(
  date: Date | null | undefined,
  hemisphere: 'N' | 'S' = 'N'
): UseMoonPhaseReturn {
  const [data, setData] = useState<MoonPhaseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastDateKey = useRef<string>('');
  const mounted = useRef(true);
  
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const fetchPhase = useCallback(async () => {
    if (!date) {
      setData(null);
      lastDateKey.current = '';
      return;
    }

    const dateKey = date.toISOString().split('T')[0];
    
    // Skip if same date already loaded
    if (dateKey === lastDateKey.current) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const phaseData = await calculateMoonPhaseSwiss(date, hemisphere);
      if (mounted.current) {
        setData(phaseData);
        lastDateKey.current = dateKey;
      }
    } catch (err) {
      if (mounted.current) {
        setError(err instanceof Error ? err : new Error('Failed to calculate moon phase'));
        setData(null);
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, [date, hemisphere]);

  useEffect(() => {
    fetchPhase();
  }, [fetchPhase]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPhase,
  };
}

export interface UseMoonPhaseBatchReturn {
  data: Map<string, MoonPhaseData>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for getting precise moon phases for multiple dates (calendar grid)
 * Efficiently batches calculations for performance
 */
export function useMoonPhaseBatch(
  dates: Date[],
  hemisphere: 'N' | 'S' = 'N'
): UseMoonPhaseBatchReturn {
  const [data, setData] = useState<Map<string, MoonPhaseData>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastDatesKey = useRef<string>('');
  const mountedBatch = useRef(true);
  
  useEffect(() => {
    mountedBatch.current = true;
    return () => {
      mountedBatch.current = false;
    };
  }, []);

  const fetchPhases = useCallback(async () => {
    if (dates.length === 0) {
      setData(new Map());
      lastDatesKey.current = '';
      return;
    }

    // Create a key from all dates to detect changes
    const datesKey = dates.map(d => d.toISOString().split('T')[0]).sort().join(',');
    
    // Skip if same dates already loaded
    if (datesKey === lastDatesKey.current) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const phases = await calculateMoonPhaseBatch(dates, hemisphere);
      if (mountedBatch.current) {
        setData(phases);
        lastDatesKey.current = datesKey;
      }
    } catch (err) {
      if (mountedBatch.current) {
        setError(err instanceof Error ? err : new Error('Failed to calculate moon phases'));
        setData(new Map());
      }
    } finally {
      if (mountedBatch.current) {
        setIsLoading(false);
      }
    }
  }, [dates, hemisphere]);

  useEffect(() => {
    fetchPhases();
  }, [fetchPhases]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPhases,
  };
}

export default useMoonPhase;
