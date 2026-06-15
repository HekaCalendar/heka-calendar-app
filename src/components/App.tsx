/**
 * Main App Component - Performance Optimized
 * Entry point for the HEKA Calendar application
 * 
 * Optimizations:
 * - Lazy loading of heavy modals
 * - Debounced interactions
 * - Memoized selectors
 * - RAF-based smooth updates
 */

import { useEffect, useState, useCallback, useMemo, memo, useRef } from 'react';
import { HashRouter, useLocation, useNavigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch, shallowEqual } from 'react-redux';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { store, loadNotes, selectAuthStatus, selectSetupStatus } from '../store';
import { initDiary } from '../store/diarySlice';
import type { RootState, AppDispatch } from '../store';
import i18n from '../i18n';
import { CalendarGrid } from './CalendarGrid';
import { MonthHeader } from './MonthHeader';
import { SettingsPanel } from './SettingsPanel';

import { DayPanel } from './day-panel/DayPanel';
import { PureCalendarView } from './PureCalendarView';
import { PureModeDayPanel } from './PureModeDayPanel';
import {
  YearModal,
  SearchModal,
  FriendsModal,
  StatsModal,
  CommunityHub,
  CommunityVotingModal,
  OracleJournal,
  InfoModal,
  AuthModalEnterprise,
  WelcomeModal,
  TaskPreviewModal,
  PrintPreview,
  StarsHub,
  AstrologyHub,
  CertificateBuilder,
  RoutineBuilder,
  NatalReportBuilder,
  CelestialGuide,
  CalendarAICoach,
  SetupWizard,
  InteractiveTutorial,
  LazyBoundary,
} from './lazyComponents';
import { hekaToCivil } from '../services/calendarService';
import type { CalendarDay, HekaMonthIndex } from '../types';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeProvider } from './ThemeProvider';
import { DialogProvider } from './ui/DialogProvider';

import { setTimeMode } from '../services/calendarService';
import { applyModeDefaults } from '../astrology/store/slice';
import { setSiderealMode, setZodiacFrame, setSignCount } from '../astrology/services/swiss-ephemeris/engine';
import { setView, navigateToMonth, selectDate, updateAstroPreferences, setGlobalNotificationsEnabled } from '../store';
import { syncNoteNotifications, hasNotificationPermission } from '../services/notificationService';
import { safeVoid } from '../utils/safeVoid';
import { initializePlannerNotificationTapHandler, scheduleDailyBriefing, scheduleStreakSaverIfNeeded } from '../services/plannerNotificationService';
import { initializePushNotifications } from '../services/pushNotificationService';
import { scheduleDailyTips } from '../astrology/services/notifications/astroNotifications';
import { NotificationEngine } from '../services/notificationEngine';
import { LocalNotifications } from '@capacitor/local-notifications';
import { tutorialService } from '../services/tutorialService';
import { initializeEngagementTracking, stopSessionTracking, markActivity } from '../services/engagementService';
import { initializeDeepLinks, getPendingInviteCode, getPendingTaskCode } from '../services/deepLinkService';
import { App as CapacitorApp } from '@capacitor/app';
import { useCapacitorBackButton } from '../services/backButtonService';
import { useNotificationAnalyticsPause } from '../hooks/useNotificationAnalyticsPause';
import { setAICoachZone } from '../services/aiCoachContextService';

import { SacredField } from './sacred-geometry/SacredField';
import { HeaderGeometry } from './sacred-geometry/HeaderGeometry';
import { setActiveTab, acceptInvite } from '../store/friendsSlice';
import { clearPendingInvite } from '../services/deepLinkService';
import { TaskNotification } from './TaskNotification';


import { monitoring } from '../services/monitoring';
import { useOfflineSyncConflicts } from '../hooks/useOfflineSyncConflicts';
import { SyncConflictModal } from './SyncConflictModal';
import { AchievementWatcher } from './AchievementWatcher';
import { unlockAchievement } from '../store';
import { eventBus } from '../services/eventBus';
import '../styles/global.css';
import '../styles/theme-enhanced.css';
import '../styles/responsive-fixes.css';
import '../styles/celestial-cards.css';
import '../styles/date-responsive.css';
import '../styles/energy-vote.css';
import '../styles/day-panel-energy.css';
import '../styles/day-panel-astrology.css';
import '../styles/android-scroll-fix.css';
import '../styles/info-modal.css';
import '../styles/modals.landscape.css';
import '../styles/auth.css';
import '../styles/auth-enterprise.css';
import '../styles/astrology.css';
import '../styles/cosmic-circle.css';
import '../styles/celestial-landscape.css';
import '../styles/landscape-scroll-fix.css';
import '../styles/celestial-scroll-override.css';
import '../components/achievement-dashboard.css';
import '../styles/pure-calendar.css';
import '../styles/tracker-panel.css';
import '../styles/foldable-optimizations.css';

/**
 * Custom hook for debouncing function calls
 * Prevents rapid-fire execution during quick interactions
 */
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

// Memoized selector for modal state
const useModalState = () => {
  const [showYearModal, setShowYearModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showCommunityVotingModal, setShowCommunityVotingModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // Debounced close handlers to prevent rapid toggling
  const debouncedCloseYear = useDebouncedCallback(() => setShowYearModal(false), 50);
  const debouncedCloseSearch = useDebouncedCallback(() => setShowSearchModal(false), 50);
  const debouncedCloseFriends = useDebouncedCallback(() => setShowFriendsModal(false), 50);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void debouncedCloseFriends;
  const debouncedCloseStats = useDebouncedCallback(() => setShowStatsModal(false), 50);
  const debouncedCloseCommunity = useDebouncedCallback(() => setShowCommunityModal(false), 50);
  const debouncedCloseJournal = useDebouncedCallback(() => setShowJournalModal(false), 50);
  const debouncedCloseInfo = useDebouncedCallback(() => setShowInfoModal(false), 50);
  const debouncedCloseAuth = useDebouncedCallback(() => setShowAuthModal(false), 50);
  const debouncedCloseWelcome = useDebouncedCallback(() => setShowWelcomeModal(false), 50);
  
  return {
    showYearModal, setShowYearModal,
    showSearchModal, setShowSearchModal,
    showFriendsModal, setShowFriendsModal,
    showStatsModal, setShowStatsModal,
    showCommunityModal, setShowCommunityModal,
    showCommunityVotingModal, setShowCommunityVotingModal,
    showJournalModal, setShowJournalModal,
    showInfoModal, setShowInfoModal,
    showAuthModal, setShowAuthModal,
    showWelcomeModal, setShowWelcomeModal,
    closeHandlers: {
      year: debouncedCloseYear,
      search: debouncedCloseSearch,
      friends: debouncedCloseFriends,
      stats: debouncedCloseStats,
      community: debouncedCloseCommunity,
      journal: debouncedCloseJournal,
      info: debouncedCloseInfo,
      auth: debouncedCloseAuth,
      welcome: debouncedCloseWelcome,
    }
  };
};

const AppContentComponent: React.FC = () => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch<AppDispatch>();

  // Initialise IndexedDB journal layer (one-time localStorage migration)
  useEffect(() => {
    dispatch(initDiary());
  }, [dispatch]);

  // Initialise error / crash monitoring (Sentry, Crashlytics)
  useEffect(() => {
    void monitoring.init();
  }, []);

  // Offline sync conflict resolution
  const { conflict, resolveConflict, dismiss: dismissConflict } = useOfflineSyncConflicts();

  // Use granular selectors to prevent unnecessary re-renders
  const currentView = useSelector((state: RootState) => state.calendar.currentView);
  const error = useSelector((state: RootState) => state.calendar.ui.error);
  const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
  // Display settings are read by child components via their own selectors
  const notes = useSelector((state: RootState) => state.calendar.notes, shallowEqual);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate, shallowEqual);
  const isSettingsOpen = useSelector((state: RootState) => state.calendar.ui.isSettingsOpen);
  const headerGeometry = useSelector((state: RootState) => state.calendar.headerGeometry);
  
  const location = useLocation();
  const navigate = useNavigate();

  const modalState = useModalState();

  // Capacitor hardware back button (no-op on web)
  useCapacitorBackButton();

  // Pause analytics flush when app is backgrounded to save battery
  useNotificationAnalyticsPause();

  // Auth state for protected features — select only the primitives we need
  const { isAuthenticated: authIsAuthenticated } = useSelector(selectAuthStatus);
  const { isComplete: setupIsComplete, notificationsEnabled: setupNotificationsEnabled, language: setupLanguage } = useSelector(selectSetupStatus);

  // Pending invite code from deep links (deferred until after tutorial)
  const [pendingInviteCode, setPendingInviteCode] = useState<string | null>(null);

  // Pending task share from deep links
  const [pendingTaskShare, setPendingTaskShare] = useState<string | null>(null);
  const TUTORIAL_V3_KEY = 'heka-tutorial-v3';
  const [showNewOnboarding, setShowNewOnboarding] = useState(() => {
    try {
      const raw = localStorage.getItem(TUTORIAL_V3_KEY);
      if (!raw) return true;
      const parsed = JSON.parse(raw);
      const shouldShow = parsed.completed !== true;
      return shouldShow;
    } catch (e) {
      return true;
    }
  });

  // Safety net: force tutorial if localStorage says it should show
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TUTORIAL_V3_KEY);
      const shouldShow = !raw || JSON.parse(raw).completed !== true;
      if (shouldShow && !showNewOnboarding) {
        setShowNewOnboarding(true);
      }
    } catch {}
  }, []);
  const [showTaskPreview, setShowTaskPreview] = useState(false);

  // Post-tutorial friend request toast
  const [friendRequestToast, setFriendRequestToast] = useState<{
    show: boolean;
    message: string;
    type: 'invite' | 'task';
  }>({ show: false, message: '', type: 'invite' });

  // Pure mode state
  const [isPureMode, setIsPureMode] = useState(false);
  
  // Deferred mount for non-critical decorative components
  // This prevents jank by letting the calendar grid paint first
  const [deferCelestial, setDeferCelestial] = useState(false);
  const [deferCoach, setDeferCoach] = useState(false);
  useEffect(() => {
    const raf1 = requestAnimationFrame(() => {
      setDeferCelestial(true);
      const raf2 = requestAnimationFrame(() => setDeferCoach(true));
      return () => cancelAnimationFrame(raf2);
    });
    return () => cancelAnimationFrame(raf1);
  }, []);

  // Sync AI Coach zone with current app context
  useEffect(() => {
    let zone: import('../services/aiCoachContextService').AICoachZone = 'main-calendar';
    if (modalState.showJournalModal) zone = 'journal';
    else if (modalState.showFriendsModal) zone = 'circle';
    else if (modalState.showStatsModal) zone = 'stats';
    else if (modalState.showSearchModal) zone = 'search';
    else if (modalState.showCommunityModal) zone = 'community';
    else if (modalState.showInfoModal) zone = 'info';
    else if (modalState.showYearModal) zone = 'year-modal';
    else if (isSettingsOpen) zone = 'settings';
    else if (isPureMode) zone = 'pure-mode';
    else if (selectedDate) zone = 'day-panel';
    else if (currentView === 'stars' || currentView === 'astrology-hub') zone = 'stars';
    setAICoachZone(zone);
  }, [
    currentView, selectedDate, isSettingsOpen, isPureMode,
    modalState.showJournalModal, modalState.showFriendsModal, modalState.showStatsModal,
    modalState.showSearchModal, modalState.showCommunityModal, modalState.showCommunityVotingModal, modalState.showInfoModal,
    modalState.showYearModal,
  ]);

  // Pure Mode Day Panel - persistent multi-day selection state
  const [pureModeSelectedNotesMap, setPureModeSelectedNotesMap] = useState<Map<string, string>>(new Map());
  const [pureModeIsSelectionMode, setPureModeIsSelectionMode] = useState(false);

  // Refs for scroll behavior
  const dayPanelRef = useRef<HTMLDivElement>(null);
  
  // Memoized subtitle to prevent recalculation
  const subtitle = useMemo(() => 
    timeMode === 'TRUE'
      ? t('trueHekaSubtitle')
      : t('syncSubtitle'),
    [timeMode, t]
  );
  
  // Initialize engagement tracking, tutorial service, and deep links on mount
  useEffect(() => {
    try {
      let cancelled = false;

      function scheduleIdle(fn: () => void): number {
        if (typeof window.requestIdleCallback === 'function') {
          return window.requestIdleCallback(fn, { timeout: 2000 });
        }
        return window.setTimeout(fn, 1500);
      }

      // Connect tutorial service to Redux
      tutorialService.connectToDispatch(dispatch);
      
      // Auto-start onboarding for first-time users (with slight delay to let UI settle)
      // NEW: Use Immaculate Onboarding v2 for users who haven't seen it
      const tutorialV3Raw = localStorage.getItem(TUTORIAL_V3_KEY);
      const v3IsComplete = tutorialV3Raw ? JSON.parse(tutorialV3Raw).completed === true : false;
      if (v3IsComplete) {
        setTimeout(() => {
          tutorialService.checkAutoTriggers();
        }, 1500);
      }
      
      let unsubscribeVisibility: (() => void) | undefined;
      const engagementIdleId = scheduleIdle(() => {
        if (cancelled) return;
        unsubscribeVisibility = initializeEngagementTracking(dispatch);
      });
      
      // Initialize deep link handling - store codes but don't show modals yet
      const unsubscribeDeepLinks = initializeDeepLinks(
        // Handle invite codes
        (code) => {
          setPendingInviteCode(code);
          // Don't show welcome modal immediately - wait for tutorial
        },
        // Handle task share codes
        (code) => {
          setPendingTaskShare(code);
          // Don't show task preview immediately - wait for tutorial
        }
      );
      
      // Check for pending invites on mount (but don't show yet)
      const pendingCode = getPendingInviteCode();
      if (pendingCode) {
        setPendingInviteCode(pendingCode);
        // Don't show welcome modal immediately - wait for tutorial
      }
      
      // Check for pending task shares on mount (but don't show yet)
      const pendingTask = getPendingTaskCode();
      if (pendingTask) {
        setPendingTaskShare(pendingTask);
      }
      
      // Track user activity
      const handleActivity = () => markActivity();
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);
      window.addEventListener('keydown', handleActivity);
      
      // ─── EventBus subscriptions (replaces window.addEventListener) ───
      const unsubOpenJournal = eventBus.subscribe('heka-open-journal', ({ prompt }) => {
        modalState.setShowJournalModal(true);
        if (prompt) {
          // Delay to let modal mount, then emit prompt event
          setTimeout(() => {
            eventBus.emit('heka-journal-prompt', { prompt });
          }, 300);
        }
      });

      const unsubSelectDate = eventBus.subscribe('heka-select-date', (detail) => {
        if (detail) {
          dispatch(selectDate(detail));
        }
      });

      const unsubOpenCircle = eventBus.subscribe('heka-open-circle', () => {
        modalState.setShowFriendsModal(true);
      });

      const unsubNavigateStars = eventBus.subscribe('navigate-to-stars', ({ tab }) => {
        if (tab) {
          sessionStorage.setItem('stars-deeplink', JSON.stringify({ tab }));
        }
        navigate('/stars');
      });

      const unsubOpenCommunity = eventBus.subscribe('heka-open-community', () => {
        modalState.setShowCommunityModal(true);
      });

      const unsubOpenStats = eventBus.subscribe('heka-open-stats', () => {
        modalState.setShowStatsModal(true);
      });

      const unsubOpenSearch = eventBus.subscribe('heka-open-search', () => {
        modalState.setShowSearchModal(true);
      });

      const unsubOpenYear = eventBus.subscribe('heka-open-year', () => {
        modalState.setShowYearModal(true);
      });

      const unsubOpenInfo = eventBus.subscribe('heka-open-info', () => {
        modalState.setShowInfoModal(true);
      });

      const unsubNotificationNavigate = eventBus.subscribe('heka:notification:navigate', ({ target }) => {
        if (target === 'circle') {
          modalState.setShowFriendsModal(true);
        } else if (target === 'journal') {
          modalState.setShowJournalModal(true);
        }
      });

      const unsubTogglePureMode = eventBus.subscribe('heka-toggle-pure-mode', () => {
        setIsPureMode((prev) => !prev);
      });

      // Handle achievement detection → unlock + coach celebration
      const unsubAchievementDetected = eventBus.subscribe('heka-achievement-detected', ({ achievement: ach }) => {
        if (ach) {
          dispatch(unlockAchievement({ id: ach.id, unlockedAt: ach.unlockedAt }));
          eventBus.emit('heka-achievement-unlocked', { achievement: ach });
        }
      });

      // Initialize planner notification tap handler (always needed for taps)
      const unsubscribeNotificationTaps = initializePlannerNotificationTapHandler();

      // Only start notification scheduling AFTER setup wizard is complete
      // to avoid permission prompts during first-boot experience
      let streakSaverInterval: ReturnType<typeof setInterval> | null = null;
      let dailyBriefingInterval: ReturnType<typeof setInterval> | null = null;
      let dailyTipsInterval: ReturnType<typeof setInterval> | null = null;
      let appStateUnsub: { remove: () => void } | null = null;

      // Register native delivery confirmation listeners BEFORE any scheduling
      // These fire when the OS actually shows the notification (even if app was killed)
      let unsubLocalReceived: { remove: () => void } | null = null;
      let unsubLocalAction: { remove: () => void } | null = null;

      void LocalNotifications.addListener('localNotificationReceived', (notification) => {
        const id = String(notification.id);
        NotificationEngine.confirmDelivery(id);
      }).then((handle) => { unsubLocalReceived = handle; });

      void LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
        const type = action.notification.extra?._engineType;
        if (type) {
          NotificationEngine.updateEngagement(type, 1);
        }
        // Route deep-link if present
        const target = action.notification.extra?.target || action.notification.extra?.type;
        if (target) {
          eventBus.emit('heka:notification:navigate', { target });
        }
      }).then((handle) => { unsubLocalAction = handle; });

      // Listen for app foreground/background — pause/resume background work
      void CapacitorApp.addListener('appStateChange', ({ isActive }: { isActive: boolean }) => {
        if (isActive && setupIsComplete) {
          // Resume background work
          NotificationEngine.startRecurringChecks();
          // Reconcile missed notifications after background suspension
          safeVoid(NotificationEngine.reconcile(), 'reconcile-on-resume');
          // Flush any genius queue proposals that were buffered while backgrounded
          NotificationEngine.flushGeniusQueueOnResume();
          // Re-schedule daily celestial tips in case the alarm fired while backgrounded
          safeVoid(scheduleDailyTips(store.getState().calendar.notificationPreferences.stars.dailyCelestialTips), 'tips-on-resume');
          // Re-schedule sunrise wake-up (sunrise time changes daily)
          safeVoid(NotificationEngine.scheduleSunriseWakeUp(), 'sunrise-on-resume');
          // Restart engagement tracking interval
          if (!streakSaverInterval) {
            streakSaverInterval = setInterval(() => {
              safeVoid(scheduleStreakSaverIfNeeded(), 'streak-saver');
            }, 1000 * 60 * 60);
          }
          if (!dailyBriefingInterval) {
            dailyBriefingInterval = setInterval(() => {
              safeVoid(scheduleDailyBriefing(), 'daily-briefing');
            }, 1000 * 60 * 60 * 6);
          }
          if (!dailyTipsInterval) {
            dailyTipsInterval = setInterval(() => {
              safeVoid(scheduleDailyTips(store.getState().calendar.notificationPreferences.stars.dailyCelestialTips), 'daily-tips');
            }, 1000 * 60 * 60 * 6);
          }
        } else if (!isActive) {
          // Pause background work to save battery
          NotificationEngine.stopRecurringChecks();
          if (streakSaverInterval) { clearInterval(streakSaverInterval); streakSaverInterval = null; }
          if (dailyBriefingInterval) { clearInterval(dailyBriefingInterval); dailyBriefingInterval = null; }
          if (dailyTipsInterval) { clearInterval(dailyTipsInterval); dailyTipsInterval = null; }
        }
      }).then((handle: { remove: () => void }) => {
        appStateUnsub = handle;
      });

      let notificationIdleId: ReturnType<typeof window.requestIdleCallback> | number | null = null;
      if (setupIsComplete) {
        notificationIdleId = scheduleIdle(() => {
          if (cancelled) return;
          safeVoid(NotificationEngine.initialize(), 'engine-init');
          NotificationEngine.startRecurringChecks();
          safeVoid(initializePushNotifications(), 'push-init');
          safeVoid(scheduleDailyBriefing(), 'briefing-init');
          safeVoid(scheduleDailyTips(store.getState().calendar.notificationPreferences.stars.dailyCelestialTips), 'tips-init');
          streakSaverInterval = setInterval(() => {
            safeVoid(scheduleStreakSaverIfNeeded(), 'streak-saver');
          }, 1000 * 60 * 60); // Check every hour
          // Re-schedule daily briefing every 6 hours to ensure it always has the next one queued
          dailyBriefingInterval = setInterval(() => {
            safeVoid(scheduleDailyBriefing(), 'daily-briefing');
          }, 1000 * 60 * 60 * 6);
          // Re-schedule daily celestial tips every 6 hours to ensure the next day's alarm is set
          dailyTipsInterval = setInterval(() => {
            safeVoid(scheduleDailyTips(store.getState().calendar.notificationPreferences.stars.dailyCelestialTips), 'daily-tips');
          }, 1000 * 60 * 60 * 6);
          // Schedule sunrise wake-up notification (re-computes sunrise time daily)
          safeVoid(NotificationEngine.scheduleSunriseWakeUp(), 'sunrise-init');
          // Bidirectional sync: setup wizard notifications <-> main notification system
          // This ensures wizard choice persists, AND settings-panel changes persist back to wizard state
          if (setupNotificationsEnabled !== null) {
            const mainGlobal = store.getState().calendar.notificationPreferences.globalEnabled;
            if (mainGlobal !== setupNotificationsEnabled) {
              dispatch(setGlobalNotificationsEnabled(setupNotificationsEnabled));
            }
          }
        });
      }
      
      return () => {
        cancelled = true;
        if (typeof engagementIdleId === 'number') {
          window.clearTimeout(engagementIdleId);
        } else {
          window.cancelIdleCallback(engagementIdleId as ReturnType<typeof window.requestIdleCallback>);
        }
        if (notificationIdleId) {
          if (typeof notificationIdleId === 'number') {
            window.clearTimeout(notificationIdleId);
          } else {
            window.cancelIdleCallback(notificationIdleId);
          }
        }
        if (unsubscribeVisibility) unsubscribeVisibility();
        stopSessionTracking(dispatch);
        unsubscribeDeepLinks();
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('scroll', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        unsubOpenJournal();
        unsubSelectDate();
        unsubOpenCircle();
        unsubNavigateStars();
        unsubOpenCommunity();
        unsubOpenStats();
        unsubOpenSearch();
        unsubOpenYear();
        unsubOpenInfo();
        unsubNotificationNavigate();
        unsubTogglePureMode();
        unsubAchievementDetected();
        unsubscribeNotificationTaps();
        if (streakSaverInterval) clearInterval(streakSaverInterval);
        if (dailyBriefingInterval) clearInterval(dailyBriefingInterval);
        if (dailyTipsInterval) clearInterval(dailyTipsInterval);
        if (appStateUnsub) appStateUnsub.remove();
        if (unsubLocalReceived) unsubLocalReceived.remove();
        if (unsubLocalAction) unsubLocalAction.remove();
        NotificationEngine.stopRecurringChecks();
      };
    } catch (e) {
      console.warn('[HEKA] Engagement tracking failed:', e);
    }
  }, [dispatch, setupIsComplete, setupNotificationsEnabled]);
  
  // Auto-process pending invite after tutorial + auth, then show toast
  useEffect(() => {
    let cancelled = false;
    
    const processPendingInvite = async () => {
      const tutorialState = tutorialService.getState();
      const hasPendingInvite = pendingInviteCode !== null;
      
      if (!hasPendingInvite || tutorialState.isActive) return;
      
      const legacyOnboardingCompleted = tutorialState.completedTutorials.includes('celestial-awakening-v1');
      const onboardingSkipped = tutorialState.preferences.skipOnboarding;
      const tutorialV3Raw = localStorage.getItem(TUTORIAL_V3_KEY);
      const v3IsComplete = tutorialV3Raw ? JSON.parse(tutorialV3Raw).completed === true : false;
      if (!legacyOnboardingCompleted && !onboardingSkipped && !v3IsComplete) return;
      
      // Wait for auth
      if (!authIsAuthenticated) return;
      
      // Don't show multiple toasts
      if (friendRequestToast.show) return;
      
      
      try {
        await dispatch(acceptInvite(pendingInviteCode)).unwrap();
        if (!cancelled) {
          setFriendRequestToast({
            show: true,
            message: t('friendRequestToast'),
            type: 'invite',
          });
          clearPendingInvite();
        }
      } catch (err) {
        console.warn('[DeepLink] Auto-process invite failed:', err);
        // Still show toast so user can try manual entry
        if (!cancelled) {
          setFriendRequestToast({
            show: true,
            message: t('friendRequestToast'),
            type: 'invite',
          });
        }
      }
    };
    
    const unsubscribe = tutorialService.subscribe((state) => {
      if (!state.isActive && pendingInviteCode && authIsAuthenticated) {
        void processPendingInvite();
      }
    });
    
    const timer = setTimeout(processPendingInvite, 3000);
    
    return () => {
      cancelled = true;
      unsubscribe();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingInviteCode, authIsAuthenticated]);
  
  // Show task share toast after tutorial completes (or if no tutorial)
  useEffect(() => {
    const checkTutorialAndShowTaskToast = () => {
      const tutorialState = tutorialService.getState();
      const hasPendingTask = pendingTaskShare !== null;
      
      if (hasPendingTask && !tutorialState.isActive) {
        const legacyOnboardingCompleted = tutorialState.completedTutorials.includes('celestial-awakening-v1');
        const onboardingSkipped = tutorialState.preferences.skipOnboarding;
        const tutorialV3Raw = localStorage.getItem(TUTORIAL_V3_KEY);
        const v3IsComplete = tutorialV3Raw ? JSON.parse(tutorialV3Raw).completed === true : false;
        
        if ((legacyOnboardingCompleted || onboardingSkipped || v3IsComplete) && !friendRequestToast.show) {
          setFriendRequestToast({
            show: true,
            message: t('taskShareToast'),
            type: 'task',
          });
        }
      }
    };
    
    const unsubscribe = tutorialService.subscribe((state) => {
      if (!state.isActive && pendingTaskShare) {
        checkTutorialAndShowTaskToast();
      }
    });
    
    const timer = setTimeout(checkTutorialAndShowTaskToast, 3000);
    
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingTaskShare]);
  
  // Handle URL params on mount (state is already loaded from localStorage in store)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const yearParam = params.get('y');
    const monthParam = params.get('m');
    const modeParam = params.get('mode');
    const locParam = params.get('loc');
    const notesParam = params.get('notes');
    
    // URL params take precedence over persisted state for navigation
    if (yearParam && monthParam) {
      const year = parseInt(yearParam);
      const month = parseInt(monthParam) - 1;
      if (!isNaN(year) && !isNaN(month) && month >= 0 && month <= 12) {
        dispatch(navigateToMonth({ year, month }));
        dispatch(selectDate({ year, month: month as HekaMonthIndex, day: 1 }));
        // Also navigate to hash route for clean URLs
        navigate(`/month/${yearParam}/${monthParam}`, { replace: true });
      }
    }
    
    // Mode from URL overrides persisted mode
    if (modeParam && (modeParam === 'SYNC' || modeParam === 'TRUE')) {
      if (modeParam !== timeMode) {
        dispatch({ type: 'calendar/toggleTimeMode' });
      }
    }
    
    // Location from URL
    if (locParam) {
      dispatch({ type: 'calendar/setLocation', payload: locParam });
    }
    
    // Notes from URL (for sharing) - MERGE with existing, don't replace
    if (notesParam) {
      try {
        const decodedNotes = JSON.parse(atob(notesParam));
        // Merge URL notes with existing notes instead of replacing
        const existingNotes = store.getState().calendar.notes;
        const mergedNotes = { ...existingNotes, ...decodedNotes };
        dispatch(loadNotes(mergedNotes));
      } catch (e) {
        console.error('Failed to load notes from URL:', e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, timeMode]);

  // ─── Router ↔ Redux Sync (ONE-WAY: Router → Redux only) ───
  // The bidirectional sync caused infinite navigation oscillation on StarsHub
  // because both effects would fire in the same render cycle with stale state.
  // URL is the single source of truth; Redux currentView follows it.
  useEffect(() => {
    const path = location.pathname;
    const pathToView: Record<string, string> = {
      '/': 'month',
      '/month': 'month',
      '/stars': 'stars',
      '/astrology-hub': 'astrology-hub',
      '/print': 'print-preview',
      '/certificate': 'certificate-builder',
      '/routine': 'routine-builder',
      '/natal-report': 'natal-report',
      '/store': 'store',
    };
    const view = pathToView[path];
    if (view && view !== currentView) {
      dispatch(setView(view as RootState['calendar']['currentView']));
    }
    // Handle /month/:year/:month path
    const monthMatch = path.match(/\/month\/(\d+)\/(\d+)/);
    if (monthMatch) {
      const year = parseInt(monthMatch[1]);
      const month = parseInt(monthMatch[2]) - 1;
      if (!isNaN(year) && !isNaN(month) && month >= 0 && month <= 12) {
        dispatch(navigateToMonth({ year, month }));
        dispatch(setView('month'));
      }
    }
  }, [location.pathname, dispatch, currentView]);

  // Parse hash-based query params (for hash-aware share links)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const modeParam = searchParams.get('mode');
    const locParam = searchParams.get('loc');
    const notesParam = searchParams.get('notes');

    if (modeParam && (modeParam === 'SYNC' || modeParam === 'TRUE') && modeParam !== timeMode) {
      dispatch({ type: 'calendar/toggleTimeMode' });
    }

    if (locParam) {
      dispatch({ type: 'calendar/setLocation', payload: locParam });
    }

    if (notesParam) {
      try {
        const decodedNotes = JSON.parse(atob(notesParam));
        const existingNotes = store.getState().calendar.notes;
        const mergedNotes = { ...existingNotes, ...decodedNotes };
        dispatch(loadNotes(mergedNotes));
      } catch (e) {
        console.error('Failed to load notes from URL hash params:', e);
      }
    }
  }, [location.search, dispatch, timeMode]);
  
  // Sync time mode with calendar service, astrology engine, and update body class
  useEffect(() => {
    setTimeMode(timeMode);
    // Apply mode class to body for theme styling
    document.body.classList.remove('mode-sync', 'mode-true');
    document.body.classList.add(`mode-${timeMode.toLowerCase()}`);
    // Reset celestial configuration to mode defaults
    dispatch(applyModeDefaults(timeMode));
    // Configure Swiss Ephemeris sidereal mode
    if (timeMode === 'TRUE') {
      setSiderealMode('lahiri');
    } else {
      setSiderealMode(null);
    }
    // Sync Swiss Ephemeris engine module-level state (critical for AI Coach)
    if (timeMode === 'TRUE') {
      setZodiacFrame('sidereal');
      setSignCount(13);
      dispatch(updateAstroPreferences({
        zodiacSystem: 'sidereal',
        zodiacFrame: 'sidereal',
        signCount: 13,
        houseSystem: 'whole-sign',
        ayanamsa: 'lahiri',
        showNakshatras: true,
        nakshatraSystem: 'vedic-27',
      }));
    } else {
      setZodiacFrame('tropical');
      setSignCount(12);
      dispatch(updateAstroPreferences({
        zodiacSystem: '12-sign',
        zodiacFrame: 'tropical',
        signCount: 12,
        houseSystem: 'placidus',
        ayanamsa: null,
        showNakshatras: false,
        nakshatraSystem: 'none',
      }));
    }
  }, [timeMode, dispatch]);
  
  // Sync notifications when notes change - debounced
  // Only run after setup wizard is complete to avoid premature permission checks
  useEffect(() => {
    if (!setupIsComplete) return;
    const syncNotifications = async () => {
      try {
        const hasPermission = await hasNotificationPermission();
        if (hasPermission && Object.keys(notes).length > 0) {
          await syncNoteNotifications(notes);
        }
      } catch {
        /* silently ignore sync errors */
      }
    };
    
    const timeoutId = setTimeout(syncNotifications, 1000);
    return () => clearTimeout(timeoutId);
  }, [notes, setupIsComplete]);
  
  // Calendar expand states
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [isCalendarExpandedHorizontal, setIsCalendarExpandedHorizontal] = useState(false);
  const toggleCalendarExpand = useCallback(() => {
    setIsCalendarExpanded(prev => !prev);
  }, []);
  const toggleCalendarExpandHorizontal = useCallback(() => {
    setIsCalendarExpandedHorizontal(prev => !prev);
  }, []);

  // Pure Mode calendar expand states (isolated from regular view)
  const [isPureCalendarExpanded, setIsPureCalendarExpanded] = useState(false);
  const [isPureCalendarExpandedHorizontal, setIsPureCalendarExpandedHorizontal] = useState(false);
  const togglePureCalendarExpand = useCallback(() => {
    setIsPureCalendarExpanded(prev => !prev);
  }, []);
  const togglePureCalendarExpandHorizontal = useCallback(() => {
    setIsPureCalendarExpandedHorizontal(prev => !prev);
  }, []);

  // Pure mode handler
  const togglePureMode = useCallback(() => {
    setIsPureMode(prev => {
      const next = !prev;
      if (!next) {
        // Clear selection state when exiting pure mode
        setPureModeSelectedNotesMap(new Map());
        setPureModeIsSelectionMode(false);
      }
      return next;
    });
  }, []);

// Construct minimal CalendarDay for PureModeDayPanel
  const pureModeDay: CalendarDay | null = useMemo(() => {
    if (!selectedDate) return null;
    return {
      hekaDate: selectedDate,
      civilDate: hekaToCivil(selectedDate),
      moonPhase: '',
      isToday: false,
      isHoliday: false,
      hasNote: false,
    };
  }, [selectedDate]);

  // Smart scroll: scroll DayPanel into view only if not fully visible (standard view only)
  useEffect(() => {
    // Only in standard view (not expanded modes) and when a date is selected
    if (!selectedDate || isCalendarExpanded || isCalendarExpandedHorizontal) return;
    
    const dayPanel = dayPanelRef.current;
    if (!dayPanel) return;
    
    // Check if DayPanel is fully visible
    const rect = dayPanel.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    // If the bottom of DayPanel is below the viewport, scroll it into view
    if (rect.bottom > viewportHeight) {
      dayPanel.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [selectedDate, isCalendarExpanded, isCalendarExpandedHorizontal]);
  
  // Memoized event handlers to prevent child re-renders
  const handlePrintClick = useCallback(() => {
    navigate('/print');
  }, [navigate]);
  
  const handleAstrologyClick = useCallback(() => {
    // Stars navigation triggered
    navigate('/stars');
  }, [navigate]);
  
  const handleYearClick = useCallback(() => modalState.setShowYearModal(true), [modalState]);
  const handleSearchClick = useCallback(() => modalState.setShowSearchModal(true), [modalState]);
  const handleFriendsClick = useCallback(() => {
    // Check if user is authenticated before entering Cosmic Circle
    if (!authIsAuthenticated) {
      // Show auth modal first - they need to sign in
      modalState.setShowAuthModal(true);
      return;
    }
    // User is authenticated, show Cosmic Circle
    modalState.setShowFriendsModal(true);
  }, [modalState, authIsAuthenticated]);
  const handleStatsClick = useCallback(() => modalState.setShowStatsModal(true), [modalState]);
  const handleCommunityClick = useCallback(() => modalState.setShowCommunityVotingModal(true), [modalState]);
  const handleJournalClick = useCallback(() => modalState.setShowJournalModal(true), [modalState]);

  const handleInfoClick = useCallback(() => modalState.setShowInfoModal(true), [modalState]);
  
  const dismissError = useCallback(() => {
    dispatch({ type: 'calendar/setError', payload: null });
  }, [dispatch]);
  
  // Old celestial panel removed - new astrology system in separate view
  
  // Memoize header props to prevent re-renders
  const headerProps = useMemo(() => ({
    onPrintClick: handlePrintClick,
    onAstrologyClick: handleAstrologyClick,
    onYearClick: handleYearClick,
    onSearchClick: handleSearchClick,
    onFriendsClick: handleFriendsClick,
    onStatsClick: handleStatsClick,
    onCommunityClick: handleCommunityClick,
    onJournalClick: handleJournalClick,
    onInfoClick: handleInfoClick,
    isCalendarExpanded,
    onToggleExpand: toggleCalendarExpand,
    isCalendarExpandedHorizontal,
    onToggleExpandHorizontal: toggleCalendarExpandHorizontal,
  }), [handlePrintClick, handleAstrologyClick, handleYearClick, handleSearchClick, handleFriendsClick, handleStatsClick, handleCommunityClick, handleJournalClick, handleInfoClick, isCalendarExpanded, toggleCalendarExpand, isCalendarExpandedHorizontal, toggleCalendarExpandHorizontal]);


  
  return (
    <>
      <SacredField isPureMode={isPureMode} />
      <div className="app">
      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button onClick={dismissError}>
            {t('dismiss')}
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          APP CONTENT — Completely blocked until setup wizard finishes.
          This prevents StarsHub, CelestialGuide, and all other components
          from mounting and triggering notification permission dialogs
          before the user has even chosen a language.
          ═══════════════════════════════════════════════════════════════════ */}
      {setupIsComplete && (
        <>
          <main className="app-main">
            {location.pathname === '/print' ? (
              <LazyBoundary><PrintPreview /></LazyBoundary>
            ) : location.pathname === '/stars' ? (
              <LazyBoundary><StarsHub /></LazyBoundary>
            ) : location.pathname === '/astrology-hub' ? (
              <LazyBoundary><AstrologyHub /></LazyBoundary>
            ) : location.pathname === '/certificate' ? (
              <LazyBoundary><CertificateBuilder /></LazyBoundary>
            ) : location.pathname === '/routine' ? (
              <LazyBoundary><RoutineBuilder /></LazyBoundary>
            ) : location.pathname === '/natal-report' ? (
              <LazyBoundary><NatalReportBuilder /></LazyBoundary>
            ) : isPureMode ? (
              <>
                <PureCalendarView
                  isExpanded={isPureCalendarExpanded}
                  isExpandedHorizontal={isPureCalendarExpandedHorizontal}
                  settingsSlot={
                    <SettingsPanel
                      onAuthClick={() => modalState.setShowAuthModal(true)}
                      onPureModeClick={togglePureMode}
                      isPureMode={true}
                      monthHeaderSlot={
                        <MonthHeader
                          {...headerProps}
                          isCalendarExpanded={isPureCalendarExpanded}
                          onToggleExpand={togglePureCalendarExpand}
                          isCalendarExpandedHorizontal={isPureCalendarExpandedHorizontal}
                          onToggleExpandHorizontal={togglePureCalendarExpandHorizontal}
                        />
                      }
                    />
                  }
                />
                {selectedDate && pureModeDay && (
                  <PureModeDayPanel
                    day={pureModeDay}
                    isOpen={true}
                    onClose={(preserveSelection) => {
                      if (!preserveSelection) {
                        setPureModeSelectedNotesMap(new Map());
                        setPureModeIsSelectionMode(false);
                      }
                      dispatch(selectDate(null));
                    }}
                    isSelectionMode={pureModeIsSelectionMode}
                    selectedNotesMap={pureModeSelectedNotesMap}
                    onToggleNoteSelection={(noteId, dayKey) => {
                      setPureModeSelectedNotesMap(prev => {
                        const next = new Map(prev);
                        if (next.has(noteId)) next.delete(noteId);
                        else next.set(noteId, dayKey);
                        return next;
                      });
                    }}
                    onEnterSelectionMode={(noteId, dayKey) => {
                      setPureModeIsSelectionMode(true);
                      setPureModeSelectedNotesMap(prev => {
                        const next = new Map(prev);
                        next.set(noteId, dayKey);
                        return next;
                      });
                    }}
                    onExitSelectionMode={() => {
                      setPureModeSelectedNotesMap(new Map());
                      setPureModeIsSelectionMode(false);
                    }}
                  />
                )}
              </>
            ) : (
              <>
                {/* Header */}
                <header
                  className={`app-header ${headerGeometry !== 'flower-of-life' ? 'app-header--custom-geo' : ''}`}
                  style={{
                    marginTop: '50px',
                    paddingTop: '45px',
                    paddingBottom: '45px',
                    position: 'relative'
                  }}
                >
                  {headerGeometry !== 'flower-of-life' && headerGeometry !== 'none' && <HeaderGeometry isPureMode={isPureMode} />}
                  <div className="app-header__top-line" />
                  <h1 className="app-title">{t('modernHekaCalendar')}</h1>
                  <p className={`app-subtitle ${timeMode === 'TRUE' ? 'app-subtitle--true' : ''}`}>
                    {subtitle}
                  </p>
                  <div className={`mode-indicator mode-indicator--${timeMode.toLowerCase()}`}>
                    {timeMode === 'TRUE' ? t('trueHekaMode') : t('syncMode')}
                  </div>
                  {/* Store hidden for v1.0 launch */}
                  {/* <button
                    className="app-header__pro-btn"
                    onClick={() => dispatch(setView('store'))}
                    title="HEKA Pro Store"
                  >
                    <span className="app-header__pro-diamond">◈</span>
                    <span className="app-header__pro-label">Pro</span>
                  </button> */}
                </header>

                {/* Settings below header - collapsed by default on mobile */}
                <SettingsPanel
                  onAuthClick={() => modalState.setShowAuthModal(true)}
                  onPureModeClick={togglePureMode}
                  isPureMode={isPureMode}
                />

                {/* Celestial Guide - Swiss Ephemeris Powered (deferred to reduce startup jank) */}
                {deferCelestial && <LazyBoundary><CelestialGuide /></LazyBoundary>}

                <MonthHeader {...headerProps} />

                <div className={`calendar-wrapper ${isCalendarExpandedHorizontal ? 'calendar-wrapper--expanded-h' : ''}`}>
                  <div className={`calendar-grid-wrapper ${isCalendarExpanded ? 'calendar-grid-wrapper--expanded' : ''} ${isCalendarExpandedHorizontal ? 'calendar-grid-wrapper--expanded-h' : ''}`}>
                    <CalendarGrid isExpanded={isCalendarExpanded} isExpandedHorizontal={isCalendarExpandedHorizontal} />
                  </div>
                  <div ref={dayPanelRef}>
                    <DayPanel />
                  </div>
                </div>
              </>
            )}
          </main>
          
          {/* Only render modals when open */}
          {modalState.showYearModal && (
            <LazyBoundary><YearModal isOpen={true} onClose={() => modalState.setShowYearModal(false)} /></LazyBoundary>
          )}
          {modalState.showSearchModal && (
            <LazyBoundary><SearchModal isOpen={true} onClose={() => modalState.setShowSearchModal(false)} /></LazyBoundary>
          )}
          {modalState.showFriendsModal && (
            <LazyBoundary><FriendsModal isOpen={true} onClose={() => modalState.setShowFriendsModal(false)} /></LazyBoundary>
          )}
          {modalState.showStatsModal && (
            <LazyBoundary><StatsModal isOpen={true} onClose={() => modalState.setShowStatsModal(false)} /></LazyBoundary>
          )}
          {modalState.showCommunityModal && (
            <LazyBoundary><CommunityHub isOpen={true} onClose={() => modalState.setShowCommunityModal(false)} /></LazyBoundary>
          )}
          {modalState.showCommunityVotingModal && (
            <LazyBoundary><CommunityVotingModal isOpen={true} onClose={() => modalState.setShowCommunityVotingModal(false)} /></LazyBoundary>
          )}
          {modalState.showJournalModal && (
            <LazyBoundary><OracleJournal isOpen={true} onClose={() => modalState.setShowJournalModal(false)} /></LazyBoundary>
          )}
          {modalState.showInfoModal && (
            <LazyBoundary><InfoModal isOpen={true} onClose={() => modalState.setShowInfoModal(false)} /></LazyBoundary>
          )}

          <SyncConflictModal
            conflict={conflict}
            onResolve={(resolution) => resolveConflict(resolution)}
            onClose={dismissConflict}
          />

          {modalState.showAuthModal && (
            <LazyBoundary><AuthModalEnterprise isOpen={true} onClose={() => modalState.setShowAuthModal(false)} /></LazyBoundary>
          )}

          {/* Welcome Modal - For invited users */}
          {modalState.showWelcomeModal && (
            <LazyBoundary>
              <WelcomeModal
                isOpen={true}
                inviteCode={pendingInviteCode}
                onClose={() => modalState.setShowWelcomeModal(false)}
                onAccepted={() => {
                  modalState.setShowWelcomeModal(false);
                  // Open the Circle modal to show the new friend
                  modalState.setShowFriendsModal(true);
                }}
              />
            </LazyBoundary>
          )}

          {/* Task Preview Modal - For shared tasks */}
          {showTaskPreview && pendingTaskShare && (
            <LazyBoundary>
              <TaskPreviewModal
                shareCode={pendingTaskShare}
                isOpen={true}
                onClose={() => {
                  setShowTaskPreview(false);
                  setPendingTaskShare(null);
                }}
                onAccepted={() => {
                  setShowTaskPreview(false);
                  setPendingTaskShare(null);
                  // Open the Circle modal to show the task
                  modalState.setShowFriendsModal(true);
                }}
              />
            </LazyBoundary>
          )}
          
          {/* Friend Request Toast - Shows after tutorial for pending invites/task shares */}
          {friendRequestToast.show && (
            <div
              className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-amber-400/40 shadow-xl cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => {
                const type = friendRequestToast.type;
                setFriendRequestToast({ show: false, message: '', type: 'invite' });
                if (type === 'task') {
                  setShowTaskPreview(true);
                } else {
                  dispatch(setActiveTab('requests'));
                  modalState.setShowFriendsModal(true);
                }
              }}
            >
              <span className="text-xl">{friendRequestToast.type === 'invite' ? '✨' : '📜'}</span>
              <span className="text-sm font-medium text-slate-100">{friendRequestToast.message}</span>
              <span className="text-xs font-semibold text-amber-400 ml-1">{t('view')}</span>
              <button
                className="ml-1 text-slate-400 hover:text-slate-200"
                aria-label={t('close')}
                onClick={(e) => {
                  e.stopPropagation();
                  setFriendRequestToast({ show: false, message: '', type: 'invite' });
                }}
              >
                ✕
              </button>
            </div>
          )}
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SETUP WIZARD — First-boot experience (Phased build)
          Runs BEFORE tutorial. Unskippable. Language, Mode, Permissions, AI.
          The ONLY thing rendered when setup.isComplete === false.
          ═══════════════════════════════════════════════════════════════════ */}
      {!setupIsComplete && (
        <LazyBoundary>
          <SetupWizard />
        </LazyBoundary>
      )}

      {/* Interactive Tutorial v3 — Comprehensive real-app onboarding. Only shown after setup wizard is complete. */}
      {setupIsComplete && showNewOnboarding && (
        <LazyBoundary>
          <InteractiveTutorial
            language={setupLanguage}
            onComplete={() => {
              try {
                localStorage.setItem(TUTORIAL_V3_KEY, JSON.stringify({ completed: true }));
              } catch {
                // Non-fatal
              }
              setShowNewOnboarding(false);
            }}
          />
        </LazyBoundary>
      )}
      

      
      {/* Footer removed for cleaner mobile UI */}
      
      {/* Task Notifications - Shows when receiving new tasks */}
      <TaskNotification
        onTaskClick={() => {
          // Open Friends modal and navigate to tasks
          modalState.setShowFriendsModal(true);
        }}
      />

      {/* AI Coach Overlay (deferred to reduce startup jank) */}
      {deferCoach && <LazyBoundary><CalendarAICoach focusedDate={selectedDate} /></LazyBoundary>}
      <AchievementWatcher />
 </div>
    </>
  );
};

// Memoize AppContent to prevent unnecessary re-renders
const AppContent = memo(AppContentComponent);
AppContent.displayName = 'AppContent';

export function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <DialogProvider>
              <HashRouter>
                <AppContent />
              </HashRouter>
            </DialogProvider>
          </ThemeProvider>
        </I18nextProvider>
      </Provider>
    </ErrorBoundary>
  );
}
