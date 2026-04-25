/**
 * AchievementWatcher — Bridges the gap between achievement detection and unlocking.
 *
 * The gamification system can DETECT achievements via checkNewAchievements(),
 * but nothing in the codebase automatically dispatches unlockAchievement.
 * This component watches for newly-detected achievements, unlocks them in Redux,
 * and fires a CustomEvent so the AI coach can celebrate.
 */

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { selectEngagement } from '../services/engagementService';
import { useGamification } from '../hooks/useGamification';
import { eventBus } from '../services/eventBus';

export function AchievementWatcher() {
  const { checkNewAchievements } = useGamification();
  const unlockedIds = useSelector((s: RootState) => s.calendar.progress.achievements.map((a) => a.id));
  const checkedRef = useRef<Set<string>>(new Set(unlockedIds));

  // Re-check whenever unlocked achievements change (e.g., after page reload)
  useEffect(() => {
    checkedRef.current = new Set(unlockedIds);
  }, [unlockedIds]);

  // Watch for statistics and engagement changes (primary achievement triggers)
  const statistics = useSelector((s: RootState) => s.calendar.statistics);
  const engagement = useSelector(selectEngagement);

  useEffect(() => {
    const newOnes = checkNewAchievements();
    for (const ach of newOnes) {
      if (!checkedRef.current.has(ach.id)) {
        checkedRef.current.add(ach.id);
        eventBus.emit('heka-achievement-detected', { achievement: ach });
      }
    }
  }, [statistics, engagement, checkNewAchievements]);

  return null;
}
