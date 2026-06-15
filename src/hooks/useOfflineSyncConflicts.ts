import { useEffect, useState, useCallback } from 'react';
import { eventBus } from '../services/eventBus';
import { offlineSyncEngine, type SyncConflict, type ConflictResolution } from '../services/offlineSyncEngine';

export function useOfflineSyncConflicts() {
  const [conflict, setConflict] = useState<SyncConflict | null>(null);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe('offline:conflict', (c: SyncConflict) => {
      setConflict(c);
    });
    return unsubscribe;
  }, []);

  const resolveConflict = useCallback((resolution: ConflictResolution) => {
    if (!conflict) return;
    offlineSyncEngine.resolveConflict(conflict, resolution);
    setConflict(null);
  }, [conflict]);

  const dismiss = useCallback(() => {
    setConflict(null);
  }, []);

  return { conflict, resolveConflict, dismiss };
}
