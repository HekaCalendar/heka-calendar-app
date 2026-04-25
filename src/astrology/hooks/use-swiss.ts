/**
 * useSwiss Hook
 * Swiss Ephemeris initialization and status
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { initializeSwissEphemeris, isSwissReady, isUsingFallback, setZodiacSystem, getZodiacSystem, setZodiacFrame, getZodiacFrame, setSignCount, getSignCount } from '../services/swiss-ephemeris/engine';

import { VoidMoonData, VoidMoonEvent } from '../types';

export interface UseSwissReturn {
  ready: boolean;
  loading: boolean;
  error: Error | null;
  fallback: boolean;
  initialize: () => Promise<void>;
  zodiacSystem: '12-sign' | '13-sign' | 'sidereal';
  setZodiacSystem: (system: '12-sign' | '13-sign' | 'sidereal') => void;
  zodiacFrame: 'tropical' | 'sidereal';
  setZodiacFrame: (frame: 'tropical' | 'sidereal') => void;
  signCount: 12 | 13;
  setSignCount: (count: 12 | 13) => void;
}

export function useSwiss(): UseSwissReturn {
  const [ready, setReady] = useState(isSwissReady());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fallback, setFallback] = useState(false);
  const [zodiacSystem, setSystem] = useState<'12-sign' | '13-sign' | 'sidereal'>(getZodiacSystem());
  const [zodiacFrame, setFrame] = useState<'tropical' | 'sidereal'>(getZodiacFrame());
  const [signCount, setCount] = useState<12 | 13>(getSignCount());
  const initialized = useRef(false);
  const hasAttemptedInit = useRef(false);
  
  const initialize = useCallback(async () => {
    // Prevent multiple initialization attempts
    if (initialized.current || hasAttemptedInit.current) return;
    hasAttemptedInit.current = true;
    
    if (isSwissReady()) {
      setReady(true);
      setFallback(isUsingFallback());
      return;
    }
    
    console.log('[useSwiss] Starting initialization...');
    setLoading(true);
    setError(null);
    
    try {
      await initializeSwissEphemeris();
      setReady(true);
      setFallback(isUsingFallback());
      console.log('[useSwiss] Initialization complete, fallback:', isUsingFallback());
    } catch (err: any) {
      // Check if this is a WASM-related error
      const errorMsg = err?.message || '';
      if (errorMsg.includes('is not a function') || 
          errorMsg.includes('WASM') || 
          errorMsg.includes('swisseph')) {
        // Silently ignore WASM errors - they're non-fatal
        console.warn('[useSwiss] WASM error suppressed:', errorMsg);
        // Set to fallback mode
        setReady(true);
        setFallback(true);
      } else {
        console.error('[useSwiss] Initialization failed:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize Swiss Ephemeris'));
        setReady(false);
      }
    } finally {
      setLoading(false);
      initialized.current = true;
    }
  }, []);
  
  const handleSetZodiacSystem = useCallback((system: '12-sign' | '13-sign' | 'sidereal') => {
    setZodiacSystem(system);
    setSystem(system);
    // Sync split fields
    if (system === 'sidereal') { setFrame('sidereal'); setCount(12); }
    else if (system === '13-sign') { setFrame('tropical'); setCount(13); }
    else { setFrame('tropical'); setCount(12); }
  }, []);
  
  const handleSetZodiacFrame = useCallback((frame: 'tropical' | 'sidereal') => {
    setZodiacFrame(frame);
    setFrame(frame);
  }, []);
  
  const handleSetSignCount = useCallback((count: 12 | 13) => {
    setSignCount(count);
    setCount(count);
  }, []);
  
  // Auto-initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  return {
    ready,
    loading,
    error,
    fallback,
    initialize,
    zodiacSystem,
    setZodiacSystem: handleSetZodiacSystem,
    zodiacFrame,
    setZodiacFrame: handleSetZodiacFrame,
    signCount,
    setSignCount: handleSetSignCount,
  };
}

// Enhanced Void Moon Data type
export interface EnhancedVoidMoonData extends VoidMoonData {
  quality: 'favorable' | 'challenging' | 'neutral';
}

// Hook for void moon status
export function useVoidMoon() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    async function loadVoidMoonData() {
      try {
        setIsLoading(true);
        // Import dynamically to avoid circular dependencies
        const { calculateVoidMoonStatus } = await import('../services/calculations/swissCalculations');
        const status = await calculateVoidMoonStatus();
        
        if (mounted) {
          setData(status);
          setError(null);
        }
      } catch (err: any) {
        console.error('[useVoidMoon] Failed to load void moon data:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load void moon data'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadVoidMoonData();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  return { data, isLoading, error };
}

// Hook for void moon events
export function useVoidMoonEvents(days: number = 30) {
  const [data, setData] = useState<VoidMoonEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    async function loadVoidMoonEvents() {
      try {
        setIsLoading(true);
        // Import dynamically to avoid circular dependencies
        const { getUpcomingVoidMoonEvents } = await import('../services/calculations/swissCalculations');
        const events = await getUpcomingVoidMoonEvents(days);
        
        if (mounted) {
          setData(events);
          setError(null);
        }
      } catch (err: any) {
        console.error('[useVoidMoonEvents] Failed to load void moon events:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load void moon events'));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }
    
    loadVoidMoonEvents();
    
    return () => {
      mounted = false;
    };
  }, [days]);
  
  return { data, isLoading, error };
}
