/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CALENDAR AI COACH — The HEKA Oracle
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * A living, memory-bearing oracle that synthesizes celestial weather,
 * user behavior, and historical context into unexpected, magical insights.
 *
 * Design principles:
 * 1. Memory — it remembers what it said and never repeats itself blindly.
 * 2. Synthesis — it combines multiple signals (moon + tasks + journal + time)
 *    into single, coherent messages.
 * 3. Surprise — weighted randomness + rarity bonuses create serendipity.
 * 4. Voice — mystical, intelligent, occasionally playful, always conscious.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { aiConfigService } from '../services/aiConfigService';
import { civilToHeka } from '../services/calendarService';
import { buildOracleContext } from './CalendarAICoach/oracleContext';
import type { HekaDate } from '../types';
import type { CoachMessage } from '../types/oracle';
import {
  renderMarkdown,
  pickRandom,
  capitalize,
} from '../utils/oracleUtils';
import type { PlannerTask } from '../types';
import { profileManager } from '../astrology/services/natal/profileManager';
import { eventBus } from '../services/eventBus';
import { useTypewriter } from '../hooks/useTypewriter';
import { scoreCandidate } from '../services/oracleScoring';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

import { generateOracleMessage } from '../services/aiCoachLLM';
import { personalizedEngine } from '../astrology/services/guidance/personalizedEngine';
import { subscribeToAICoachZone } from '../services/aiCoachContextService';
import '../styles/calendar-ai-coach.css';

import { recordMemory } from './CalendarAICoach/helpers';
import { candidatesFromContext } from './CalendarAICoach/candidates';

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface CalendarAICoachProps {
  focusedDate?: HekaDate | null;
}

export const CalendarAICoach: React.FC<CalendarAICoachProps> = ({ focusedDate }) => {
  const { t } = useTranslation('coach');
  const astroProfiles = useSelector((s: RootState) => s.calendar.astroProfiles);
  const selectedAstroProfileId = useSelector((s: RootState) => s.calendar.selectedAstroProfileId);
  const timeMode = useSelector((s: RootState) => s.calendar.timeMode);
  const zodiacFrame = useSelector((s: RootState) => s.calendar.astroPreferences.zodiacFrame);
  const signCount = useSelector((s: RootState) => s.calendar.astroPreferences.signCount);

  const [enabled, setEnabled] = useState(() =>
    aiConfigService.isAreaEnabled('calendar') && aiConfigService.isRealProviderConfigured()
  );
  const [minimized, setMinimizedState] = useState(() => {
    const until = aiConfigService.getConfig().userContext.coachMinimizedUntil || 0;
    return until > Date.now();
  });
  const [hiddenUntil, setHiddenUntil] = useState<number>(0);
  const [currentMessage, setCurrentMessage] = useState<CoachMessage | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const dismissedRef = useRef<Set<string>>(new Set(aiConfigService.getConfig().userContext.dismissedMessageIds || []));
  const focusedDateRef = useRef<HekaDate | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const generationLockRef = useRef(false);

  const { displayedText, revealedMessage, start: startTypewriter, stop: stopTypewriter } = useTypewriter();

  useEffect(() => {
    focusedDateRef.current = focusedDate || null;
  }, [focusedDate]);

  const setMinimized = useCallback((value: boolean) => {
    setMinimizedState(value);
    if (value) {
      aiConfigService.setUserContext({ coachMinimizedUntil: Date.now() + 5 * 60 * 1000 });
    } else {
      aiConfigService.setUserContext({ coachMinimizedUntil: 0 });
    }
  }, []);

  const canAutoExpand = useCallback(() => {
    const until = aiConfigService.getConfig().userContext.coachMinimizedUntil || 0;
    return until <= Date.now();
  }, []);

  // Drag state
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>(() => {
    try {
      const saved = localStorage.getItem('heka-coach-position');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors — localStorage may be disabled or corrupted
    }
    return { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const latestDragOffsetRef = useRef(dragOffset);
  useEffect(() => { latestDragOffsetRef.current = dragOffset; }, [dragOffset]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: latestDragOffsetRef.current.x,
      initialY: latestDragOffsetRef.current.y,
    };
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const start = dragStartRef.current;
      if (!start) return;
      const dx = clientX - start.startX;
      const dy = clientY - start.startY;
      let x = start.initialX + dx;
      let y = start.initialY + dy;
      // Clamp within viewport with some padding
      const pad = 8;
      const maxX = window.innerWidth - pad;
      const maxY = window.innerHeight - pad;
      const minX = -(window.innerWidth - pad);
      const minY = -(window.innerHeight - pad);
      if (x > maxX) x = maxX;
      if (x < minX) x = minX;
      if (y > maxY) y = maxY;
      if (y < minY) y = minY;
      setDragOffset({ x, y });
    };
    const handleUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        localStorage.setItem('heka-coach-position', JSON.stringify(latestDragOffsetRef.current));
      } catch {
        // Ignore localStorage errors — may be disabled in private mode
      }
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove as EventListener, { passive: false } as EventListenerOptions);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  // Listen for AI config changes
  useEffect(() => {
    const unsubscribe = aiConfigService.subscribe((config) => {
      setEnabled(
        config.globalEnabled &&
        config.areas.calendar &&
        config.provider !== 'template' &&
        !!config.apiKey
      );
    });
    return unsubscribe;
  }, []);

  // Invalidate transit cache when birth chart profiles change
  useEffect(() => {
    const refreshTransitCache = () => {
      aiConfigService.setUserContext({ lastTransitData: '', lastTransitCalculatedAt: 0 });
    };
    const unsubscribe = profileManager.subscribe((event) => {
      if (
        event.type === 'profile:created' ||
        event.type === 'profile:updated' ||
        event.type === 'profile:switched' ||
        event.type === 'profile:set-default'
      ) {
        refreshTransitCache();
      }
    });
    return unsubscribe;
  }, []);

  // Check if hidden period expired
  useEffect(() => {
    if (hiddenUntil <= 0) return;
    const delay = Math.max(0, hiddenUntil - Date.now());
    const timer = setTimeout(() => {
      setHiddenUntil(0);
    }, delay);
    return () => clearTimeout(timer);
  }, [hiddenUntil]);

  // Core oracle message generation
  const generateMessage = useCallback(async (): Promise<CoachMessage | null> => {
    const ctx = await buildOracleContext(focusedDate || null, astroProfiles, selectedAstroProfileId, timeMode);
    const candidates = candidatesFromContext(ctx);
    if (candidates.length === 0) return null;

    const scored = candidates
      .filter((c) => !dismissedRef.current.has(c.id))
      .map((c) => ({ candidate: c, score: scoreCandidate(c, ctx) }));

    scored.sort((a, b) => b.score - a.score);

    // Pick from top 5 with slight randomness (prevents complete determinism)
    const topPool = scored.slice(0, 5);
    const winner = topPool.length > 0 ? pickRandom(topPool).candidate : null;

    if (!winner) return null;

    // ═══════════════════════════════════════════════════════════════════════════
    // PHASE 2: LLM enhancement for high-value moments
    // ═══════════════════════════════════════════════════════════════════════════
    const hoursSinceInteraction = (Date.now() - ctx.user.lastCoachInteraction) / (1000 * 60 * 60);
    const isHighValueMoment =
      winner.isSynchronicity ||
      winner.topic === 'transit' ||
      (winner.topic === 'mood-support' && ctx.mood.declineSeverity === 'severe') ||
      (hoursSinceInteraction > 6 && winner.weight >= 80);

    if (isHighValueMoment) {
      try {
        const celestialStateDesc = [
          `Moon: ${ctx.celestial.moonPhase} in ${ctx.celestial.moonSign}`,
          `Sun: ${ctx.celestial.sunSign}`,
          ctx.celestial.retrogrades.length > 0 ? `Retrogrades: ${ctx.celestial.retrogrades.join(', ')}` : null,
          ctx.isVoidMoon ? 'Void Moon' : null,
        ].filter(Boolean).join('; ');

        const occasion: Parameters<typeof generateOracleMessage>[0]['occasion'] =
          winner.isSynchronicity ? 'synchronicity' :
          winner.topic === 'transit' ? 'transit-alert' :
          winner.topic === 'mood-support' ? 'mood-support' :
          winner.topic === 'celebration' ? 'celebration' :
          winner.topic === 'task-suggest' ? 'task-suggestion' :
          'daily-briefing';

        const locationDesc = ctx.location.hasLocation
          ? `${ctx.location.name} (${ctx.location.latitude.toFixed(1)}°, ${ctx.location.longitude.toFixed(1)}°)`
          : undefined;
        const planetaryHourDesc = ctx.planetaryHour
          ? `${ctx.planetaryHour.symbol} Hour of ${ctx.planetaryHour.planet} — favors ${ctx.planetaryHour.activities.slice(0, 3).join(', ')}`
          : undefined;
        const sunTimesDesc = ctx.sunTimes.sunrise && ctx.sunTimes.sunset
          ? `Sunrise ${ctx.sunTimes.sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, Sunset ${ctx.sunTimes.sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : undefined;
        const seasonDesc = ctx.season
          ? `${ctx.season.season} in the ${ctx.season.hemisphere} hemisphere`
          : undefined;

        const aspectsDesc = ctx.celestial.currentAspects?.slice(0, 3).map(
          (a) => `${capitalize(a.planet1)} ${a.aspect}s ${capitalize(a.planet2)} (${a.nature}, orb ${Math.round(a.orb * 100) / 100}°)`
        );
        const criticalDesc = ctx.celestial.criticalDegrees?.slice(0, 2).map(
          (cd) => `${capitalize(cd.planet)} at ${Math.round(cd.degree * 100) / 100}° — ${cd.type}`
        );
        const moonDetailsDesc = ctx.celestial.moonDetails
          ? `illumination ${ctx.celestial.moonDetails.illumination}%, speed ${ctx.celestial.moonDetails.speed}°/day`
          : undefined;
        const lunarNodesDesc = ctx.celestial.lunarNodes
          ? `North Node in ${capitalize(ctx.celestial.lunarNodes.north)}, South Node in ${capitalize(ctx.celestial.lunarNodes.south)}`
          : undefined;
        const chironDesc = ctx.celestial.chiron
          ? `${capitalize(ctx.celestial.chiron.sign)} at ${ctx.celestial.chiron.degree}°`
          : undefined;

        // Fetch celestial guidance summary from the personalized engine (rich Stars context)
        let celestialGuidanceDesc: string | undefined;
        if (ctx.celestial.rawPositions) {
          try {
            const briefing = await personalizedEngine.generateMorningBriefing({
              positions: ctx.celestial.rawPositions,
              moonPhase: { phase: ctx.celestial.moonPhase, sign: ctx.celestial.moonSign },
              retrogrades: ctx.celestial.retrogrades,
              voidMoon: { isVoid: ctx.isVoidMoon },
              useAI: false,
            });
            const guidanceText = briefing.guidance?.summary || briefing.guidance?.title || '';
            const practicalSteps = briefing.practicalSteps?.slice(0, 2).join('; ') || '';
            celestialGuidanceDesc = `Theme: ${briefing.themeOfTheDay}; Focus: ${briefing.focusArea}${guidanceText ? `; ${guidanceText}` : ''}${practicalSteps ? `; Steps: ${practicalSteps}` : ''}`;
          } catch (e) {
            // Non-blocking: if guidance engine fails, LLM still gets all other context
            console.warn('[CalendarAICoach] Personalized guidance fetch failed:', e);
          }
        }

        const llmResult = await generateOracleMessage({
          celestialState: celestialStateDesc,
          transitSummary: ctx.transit.summary || undefined,
          userArchetype: ctx.archetype.name || undefined,
          moodTone: ctx.mood.tone,
          pendingTasks: ctx.user.pendingTasks,
          todayCompleted: ctx.user.todayCompleted,
          streak: ctx.user.streak,
          lastJournalSnippet: ctx.user.lastJournalSnippet,
          occasion,
          location: locationDesc,
          planetaryHour: planetaryHourDesc,
          sunTimes: sunTimesDesc,
          season: seasonDesc,
          aspects: aspectsDesc,
          criticalDegrees: criticalDesc,
          moonDetails: moonDetailsDesc,
          lunarNodes: lunarNodesDesc,
          chiron: chironDesc,
          celestialGuidance: celestialGuidanceDesc,
          zone: ctx.zone,
          writingStreak: ctx.user.writingStreak,
          longestWritingStreak: ctx.user.longestWritingStreak,
          moodAverage: ctx.user.moodAverage,
          totalNotes: ctx.user.totalNotes,
          timeMode: ctx.timeMode,
          zodiacFrame,
          signCount,
        }, winner.text);

        if (llmResult.text !== winner.text && llmResult.text.length > 10) {
          winner.text = llmResult.text;
          // If LLM was used, add a subtle indicator in icon for debugging/delight,
          // but preserve meaningful celestial icons (e.g., transit planet emojis)
          if (!llmResult.cached && winner.topic !== 'transit') {
            winner.icon = '✨';
          }
        }
        if (llmResult.fallbackReason) {
          winner.fallbackReason = llmResult.fallbackReason;
        }
      } catch (e) {
        console.warn('[CalendarAICoach] LLM enhancement failed:', e);
      }
    }

    recordMemory(winner);
    return winner;
  }, [focusedDate, astroProfiles, selectedAstroProfileId, timeMode, zodiacFrame, signCount]);

  // Show next message with typing effect and smart generation buffer
  const showNextMessage = useCallback(async () => {
    if (generationLockRef.current) return; // Re-entry guard
    generationLockRef.current = true;
    setIsTyping(true);
    try {
      const generationStart = performance.now();
      const msg = await Promise.race([
        generateMessage(),
        new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 18000)
        ),
      ]);
      if (!msg) {
        throw new Error('Oracle message generation timed out');
      }
      const generationDuration = performance.now() - generationStart;
      if (msg && !dismissedRef.current.has(msg.id)) {
        const userContext = aiConfigService.getUserContext();
        const lastChat = userContext.lastCoachInteraction || 0;
        const hoursSinceLastChat = (Date.now() - lastChat) / (1000 * 60 * 60);
        const isReturningUser = (userContext.coachMemory?.length || 0) > 3 && hoursSinceLastChat < 48;
        const isLLMEnhanced = generationDuration > 1500;

        // Smart buffer: shorter for LLM (already took time), longer for new users
        let bufferMs = 300;
        if (isLLMEnhanced) {
          bufferMs = 150;
        } else if (isReturningUser) {
          bufferMs = 250;
        } else {
          bufferMs = 450;
        }
        await new Promise((resolve) => setTimeout(resolve, bufferMs));

        if (!dismissedRef.current.has(msg.id)) {
          setIsTyping(false);
          const typewriterSpeed = isReturningUser ? 15 : 35;
          startTypewriter(msg, typewriterSpeed, (completedMsg) => setCurrentMessage(completedMsg));
          if (canAutoExpand()) setMinimized(false);
        }
      }
    } catch (e) {
      console.warn('[CalendarAICoach] Message generation failed:', e);
      setIsTyping(false);
      const fallbackMsg: CoachMessage = {
        id: `fallback-${Date.now()}`,
        type: 'insight',
        text: 'The celestial threads are tangled today. Rest assured, I am still watching.',
        icon: '✨',
        color: '#9d4edd',
      };
      startTypewriter({ ...fallbackMsg, fallbackReason: 'Generation failed' }, 35, (completedMsg) => setCurrentMessage(completedMsg));
      if (canAutoExpand()) setMinimized(false);
    } finally {
      generationLockRef.current = false;
      setIsTyping(false);
    }
  }, [generateMessage, canAutoExpand, setMinimized, startTypewriter]);

  // Refresh message when user navigates to a new zone (with a small debounce)
  useEffect(() => {
    if (!enabled) return;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const unsubscribe = subscribeToAICoachZone((_zone) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        void showNextMessage();
      }, 800);
    });
    return () => {
      unsubscribe();
      if (timeout) clearTimeout(timeout);
    };
  }, [enabled, showNextMessage]);

  // Show immediate message bypassing the normal cycle
  const showImmediateMessage = useCallback(async (msgPromise: Promise<CoachMessage | null>) => {
    if (!enabled) return;
    setIsTyping(true);
    try {
      const msg = await msgPromise;
      if (msg) {
        setCurrentMessage(msg);
        if (canAutoExpand()) setMinimized(false);
        setHiddenUntil(0);
        recordMemory(msg);
      }
    } finally {
      setIsTyping(false);
    }
  }, [enabled, canAutoExpand, setMinimized]);

  // Initial message on mount / when enabled
  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      void showNextMessage();
    }, 2000);
    return () => clearTimeout(timer);
  }, [enabled, showNextMessage]);

  // Daily refresh every 3 hours (pause when app is backgrounded)
  useEffect(() => {
    if (!enabled) return;
    let interval: ReturnType<typeof setInterval> | null = null;
    const startInterval = () => {
      interval = setInterval(() => {
        void showNextMessage();
      }, 1000 * 60 * 60 * 3);
    };
    const handleVisibility = () => {
      if (document.hidden) {
        if (interval) clearInterval(interval);
      } else {
        startInterval();
      }
    };
    startInterval();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [enabled, showNextMessage]);

  // Listen for planner events
  useEffect(() => {
    const onTaskCreated = ({ task, isFirstTask }: { task: PlannerTask; isFirstTask: boolean }) => {
      const today = new Date();
      const todayIso = today.toISOString().split('T')[0];
      const heka = civilToHeka(today);
      const dateKey = heka ? `${heka.year}-${heka.month}-${heka.day}` : todayIso;

      aiConfigService.setUserContext({
        lastTaskCreationDate: todayIso,
        hasCreatedFirstTask: true,
        lastTaskContent: task?.content?.substring(0, 120) || aiConfigService.getUserContext().lastTaskContent,
      });

      const celebrationText = isFirstTask
        ? 'The first spark is always the most courageous. You have kindled it.'
        : 'Another intention set. I felt the loom shift.';

      void showImmediateMessage(Promise.resolve({
        id: `task-created-${task?.id || dateKey}`,
        type: 'celebration',
        text: celebrationText,
        icon: isFirstTask ? '🌟' : '✨',
        color: '#d4af37',
      }));

      // After celebration, auto-refresh to a contextual follow-up
      setTimeout(() => {
        if (!dismissedRef.current.has(`task-created-${task?.id || dateKey}`)) {
          void showNextMessage();
        }
      }, 5000);
    };

    const onTaskCompleted = ({ task, streak }: { task: PlannerTask; streak: number }) => {
      void showImmediateMessage(Promise.resolve({
        id: `complete-${task?.id || Date.now()}`,
        type: 'celebration',
        text: streak > 1
          ? `Task complete! You are on a ${streak}-day streak. The universe is starting to recognize your signature.`
          : 'Task complete. One sacred step closer.',
        icon: '✨',
        color: '#22c55e',
      }));

      // Refresh after completion celebration
      setTimeout(() => {
        void showNextMessage();
      }, 5000);
    };

    const onAchievementUnlocked = ({ achievement: ach }: { achievement: import('../types').UnlockedAchievement }) => {
      if (ach) {
        const a = ach as unknown as import('../services/gamificationService').UnlockedAchievement;
        void showImmediateMessage(
          Promise.resolve({
            id: `achievement-${a.id}`,
            type: 'celebration',
            text: `✨ ${a.name} unlocked! ${a.description}`,
            icon: a.icon || '🏆',
            color: '#d4af37',
          })
        );
      }
    };

    const onTutorialComplete = ({ aiEnabled }: { aiEnabled: boolean }) => {
      const welcomeText = aiEnabled
        ? 'Welcome to HEKA. I am your celestial companion. The sky is already speaking — shall I interpret it for you?'
        : 'Welcome to HEKA. The calendar is yours. Tap any day to begin.';
      void showImmediateMessage(Promise.resolve({
        id: `tutorial-welcome-${Date.now()}`,
        type: 'insight',
        text: welcomeText,
        icon: aiEnabled ? '🔮' : '✨',
        color: '#d4af37',
      }));
    };

    const unsubTaskCreated = eventBus.subscribe('heka-task-created', onTaskCreated);
    const unsubTaskCompleted = eventBus.subscribe('heka-task-completed', onTaskCompleted);
    const unsubAchievement = eventBus.subscribe('heka-achievement-unlocked', onAchievementUnlocked);
    const unsubTutorial = eventBus.subscribe('heka-tutorial-complete', onTutorialComplete);
    return () => {
      unsubTaskCreated();
      unsubTaskCompleted();
      unsubAchievement();
      unsubTutorial();
    };
  }, [showImmediateMessage, showNextMessage]);

  const handleDismiss = () => {
    stopTypewriter();
    if (currentMessage) {
      dismissedRef.current.add(currentMessage.id);
      const currentDismissed = Array.from(dismissedRef.current);
      aiConfigService.setUserContext({ dismissedMessageIds: currentDismissed });
    }
    setHiddenUntil(Date.now() + 1000 * 60 * 60);
    setCurrentMessage(null);
    setMinimized(false);
  };

  const handleAction = useCallback(async () => {
    if (!currentMessage?.action || isActionLoading) return;
    setIsActionLoading(true);
    try {
      await currentMessage.action.onClick();
    } finally {
      setIsActionLoading(false);
    }
  }, [currentMessage, isActionLoading]);

  // Focus trap when expanded
  useEffect(() => {
    if (minimized || !cardRef.current) return;
    const card = cardRef.current;
    card.focus();
    const focusable = Array.from(
      card.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    card.addEventListener('keydown', handleTab);
    return () => card.removeEventListener('keydown', handleTab);
  }, [minimized]);

  // Escape key minimizes expanded coach
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !minimized) {
        setMinimized(true);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [minimized, setMinimized]);

  // Arrow keys nudge coach position when expanded
  useEffect(() => {
    const handleArrow = (e: KeyboardEvent) => {
      if (minimized) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      const nudge = 20;
      let handled = false;
      if (e.key === 'ArrowUp') { setDragOffset((p) => ({ ...p, y: p.y - nudge })); handled = true; }
      if (e.key === 'ArrowDown') { setDragOffset((p) => ({ ...p, y: p.y + nudge })); handled = true; }
      if (e.key === 'ArrowLeft') { setDragOffset((p) => ({ ...p, x: p.x - nudge })); handled = true; }
      if (e.key === 'ArrowRight') { setDragOffset((p) => ({ ...p, x: p.x + nudge })); handled = true; }
      if (handled) e.preventDefault();
    };
    window.addEventListener('keydown', handleArrow);
    return () => window.removeEventListener('keydown', handleArrow);
  }, [minimized]);

  if (!enabled) return null;
  if (Date.now() < hiddenUntil) return null;

  return (
    <div
      className={`calendar-ai-coach ${minimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
      }}
    >
      {minimized ? (
        <button
          className="coach-pill"
          onClick={() => setMinimized(false)}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          aria-label={t('aiCoach')}
          aria-expanded={!minimized}
          aria-controls="coach-card"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(157,78,221,0.2))' }}
        >
          <span className="coach-pill-icon" role="img" aria-label="sparkles">✨</span>
          <span className="coach-pill-text">{t('aiCoach')}</span>
        </button>
      ) : (
        <div
          id="coach-card"
          className={`coach-card ${isTyping ? 'generating' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="coach-title"
          aria-describedby="coach-message-text"
          tabIndex={-1}
          ref={cardRef}
        >
          <div
            className="coach-header"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="coach-avatar">
              <span role="img" aria-label="sparkles">✨</span>
              <div className="coach-avatar-pulse" />
            </div>
            <div id="coach-title" className="coach-title">{t('hekaAI')}</div>
            <div className="coach-controls">
              <button className="coach-btn" onClick={() => setMinimized(true)} title={t('minimize')} aria-label={t('minimize')}>
                −
              </button>
              <button className="coach-btn" onClick={handleDismiss} title={t('hideForOneHour')} aria-label={t('hideCoachForOneHour')}>
                ×
              </button>
            </div>
          </div>

          <div className="coach-body">
            {isTyping ? (
              <div className="coach-typing">
                <span className="coach-typing-dot" />
                <span className="coach-typing-dot" />
                <span className="coach-typing-dot" />
              </div>
            ) : revealedMessage || currentMessage ? (
              <>
                <div className="coach-message">
                  <span
                    className="coach-message-icon"
                    style={{ color: (revealedMessage || currentMessage)!.color }}
                    title={(revealedMessage || currentMessage)?.fallbackReason || undefined}
                  >
                    {(revealedMessage || currentMessage)!.icon}
                    {(revealedMessage || currentMessage)?.fallbackReason && (
                      <span style={{ fontSize: '0.6em', opacity: 0.6, marginLeft: 2 }}>·</span>
                    )}
                  </span>
                  <p id="coach-message-text" style={{ whiteSpace: 'pre-line', margin: 0 }}>
                    {revealedMessage
                      ? renderMarkdown(displayedText)
                      : renderMarkdown(currentMessage!.text)}
                  </p>
                </div>
                {(revealedMessage || currentMessage)?.action && (
                  <button
                    className="coach-action"
                    onClick={handleAction}
                    aria-busy={isActionLoading}
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? t('opening') : (revealedMessage || currentMessage)!.action!.label}
                  </button>
                )}
              </>
            ) : (
              <p className="coach-empty">{t('coachEmpty')}</p>
            )}
          </div>

          {!isTyping && !revealedMessage && currentMessage && (
            <div className="coach-footer">
              <button className="coach-footer-btn" onClick={() => void showNextMessage()}>
                🔄 {t('newPrompt')}
              </button>
              <button className="coach-footer-btn coach-footer-btn--secondary" onClick={handleDismiss}>
                {t('hideForOneHour')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarAICoach;
