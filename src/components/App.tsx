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
import { Provider, useSelector, useDispatch, shallowEqual } from 'react-redux';
import { store, loadNotes } from '../store';
import type { RootState } from '../store';
import { CalendarGrid } from './CalendarGrid';
import { MonthHeader } from './MonthHeader';
import { SettingsPanel } from './SettingsPanel';
import { YearModal } from './YearModal';
import { PrintPreview } from './PrintPreview';
import { AstrologyHub, StarsHub } from '../astrology';
import { CelestialGuide } from './CelestialGuide';
import { DayPanel } from './DayPanel';
import { SearchModal } from './SearchModal';
import { FriendsModal } from './FriendsModal';
import { StatsModal } from './StatsModal';
import { CommunityHolidays } from './CommunityHolidays';
import { OracleJournal } from './OracleJournal';
import { InfoModal } from './InfoModal';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeProvider } from './ThemeProvider';
import { AuthModalEnterprise } from './AuthModalEnterprise';
import { TutorialOverlay } from './TutorialOverlay';
import { setTimeMode } from '../services/calendarService';
import { setView, navigateToMonth, selectDate } from '../store';
import { syncNoteNotifications, hasNotificationPermission } from '../services/notificationService';
import { tutorialService } from '../services/tutorialService';
import { initializeEngagementTracking, stopSessionTracking, markActivity } from '../services/engagementService';
import { initializeDeepLinks, getPendingInviteCode, getPendingTaskCode } from '../services/deepLinkService';

import { WelcomeModal } from './WelcomeModal';
import { TaskNotification } from './TaskNotification';
import { TaskPreviewModal } from './TaskPreviewModal';
import '../styles/global.css';
import '../styles/theme-enhanced.css';
import '../styles/responsive-fixes.css';
import '../styles/celestial-cards.css';
import '../styles/date-responsive.css';
import '../styles/energy-vote.css';
import '../styles/day-panel-energy.css';
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

/**
 * Custom hook for debouncing function calls
 * Prevents rapid-fire execution during quick interactions
 */
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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

/**
 * Auth Button Component - Shows login state in header
 */
const AuthButton: React.FC<{ onClick: () => void }> = memo(({ onClick }) => {
  const auth = useSelector((state: RootState) => state.calendar.auth);
  
  if (auth.isAuthenticated) {
    return (
      <button className="auth-button auth-button--small" onClick={onClick}>
        <span className="auth-button__avatar">
          {auth.displayName?.charAt(0) || auth.email?.charAt(0) || '?'}
        </span>
        <span>Account</span>
      </button>
    );
  }
  
  return (
    <button className="auth-button auth-button--small" onClick={onClick}>
      <span>🔐</span>
      <span>Sign In</span>
    </button>
  );
});
AuthButton.displayName = 'AuthButton';

const AppContentComponent: React.FC = () => {
  const dispatch = useDispatch();
  
  // Use granular selectors to prevent unnecessary re-renders
  const currentView = useSelector((state: RootState) => state.calendar.currentView);
  const error = useSelector((state: RootState) => state.calendar.ui.error);
  const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
  // Display settings available when needed
  useSelector((state: RootState) => state.calendar.display, shallowEqual);
  const notes = useSelector((state: RootState) => state.calendar.notes, shallowEqual);
  const selectedDate = useSelector((state: RootState) => state.calendar.selectedDate, shallowEqual);
  
  const modalState = useModalState();
  
  // Auth state for protected features
  const auth = useSelector((state: RootState) => state.calendar.auth);
  
  // Pending invite code from deep links (deferred until after tutorial)
  const [pendingInviteCode, setPendingInviteCode] = useState<string | null>(null);
  
  // Pending task share from deep links
  const [pendingTaskShare, setPendingTaskShare] = useState<string | null>(null);
  const [showTaskPreview, setShowTaskPreview] = useState(false);
  
  // Refs for scroll behavior
  const dayPanelRef = useRef<HTMLDivElement>(null);
  
  // Memoized subtitle to prevent recalculation
  const subtitle = useMemo(() => 
    timeMode === 'TRUE'
      ? 'True HEKA Timekeeping • March correction (4-year cycle, except 128th) • Astronomical precision'
      : 'HEKA Gregorian synchronised timekeeping • April to March • 13-month harmonic calendar',
    [timeMode]
  );
  
  // Initialize engagement tracking, tutorial service, and deep links on mount
  useEffect(() => {
    try {
      // Connect tutorial service to Redux
      tutorialService.connectToDispatch(dispatch);
      
      initializeEngagementTracking(dispatch);
      
      // Initialize deep link handling - store codes but don't show modals yet
      const unsubscribeDeepLinks = initializeDeepLinks(
        // Handle invite codes
        (code) => {
          console.log('[DeepLink] Received invite code:', code);
          setPendingInviteCode(code);
          // Don't show welcome modal immediately - wait for tutorial
        },
        // Handle task share codes
        (code) => {
          console.log('[DeepLink] Received task share code:', code);
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
        console.log('[DeepLink] Pending task share from launch:', pendingTask);
        setPendingTaskShare(pendingTask);
      }
      
      // Track user activity
      const handleActivity = () => markActivity();
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);
      window.addEventListener('keydown', handleActivity);
      
      return () => {
        stopSessionTracking(dispatch);
        unsubscribeDeepLinks();
        window.removeEventListener('click', handleActivity);
        window.removeEventListener('scroll', handleActivity);
        window.removeEventListener('keydown', handleActivity);
      };
    } catch (e) {
      console.warn('[HEKA] Engagement tracking failed:', e);
    }
  }, [dispatch]);
  
  // Show welcome modal after tutorial completes (or if no tutorial)
  useEffect(() => {
    const checkTutorialAndShowWelcome = () => {
      const tutorialState = tutorialService.getState();
      const hasPendingInvite = pendingInviteCode !== null;
      
      // Only show welcome modal if:
      // 1. We have a pending invite code
      // 2. Tutorial is not active
      // 3. Either onboarding is skipped or completed
      if (hasPendingInvite && !tutorialState.isActive) {
        const onboardingCompleted = tutorialState.completedTutorials.includes('elite-onboarding-v2');
        const onboardingSkipped = tutorialState.preferences.skipOnboarding;
        
        if (onboardingCompleted || onboardingSkipped) {
          console.log('[DeepLink] Tutorial complete, showing welcome modal');
          // Small delay for smooth transition after tutorial
          setTimeout(() => modalState.setShowWelcomeModal(true), 500);
        }
      }
    };
    
    // Subscribe to tutorial state changes
    const unsubscribe = tutorialService.subscribe((state) => {
      if (!state.isActive && pendingInviteCode) {
        // Tutorial just finished, check if we should show welcome
        checkTutorialAndShowWelcome();
      }
    });
    
    // Initial check (in case no tutorial runs or user already completed it)
    // Wait a bit longer to let tutorial system initialize
    const timer = setTimeout(checkTutorialAndShowWelcome, 3000);
    
    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingInviteCode]);
  
  // Show task preview after tutorial completes (or if no tutorial)
  useEffect(() => {
    const checkTutorialAndShowTask = () => {
      const tutorialState = tutorialService.getState();
      const hasPendingTask = pendingTaskShare !== null;
      
      if (hasPendingTask && !tutorialState.isActive) {
        const onboardingCompleted = tutorialState.completedTutorials.includes('elite-onboarding-v2');
        const onboardingSkipped = tutorialState.preferences.skipOnboarding;
        
        if (onboardingCompleted || onboardingSkipped) {
          console.log('[DeepLink] Tutorial complete, showing task preview');
          setShowTaskPreview(true);
        }
      }
    };
    
    const unsubscribe = tutorialService.subscribe((state) => {
      if (!state.isActive && pendingTaskShare) {
        checkTutorialAndShowTask();
      }
    });
    
    const timer = setTimeout(checkTutorialAndShowTask, 3000);
    
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
        dispatch(selectDate({ year, month: month as any, day: 1 }));
      }
    }
    
    // Mode from URL overrides persisted mode
    if (modeParam && (modeParam === 'SYNC' || modeParam === 'TRUE')) {
      if (modeParam !== timeMode) {
        dispatch({ type: 'calendar/toggleTimeMode' });
        if (modeParam === 'TRUE') {
          // Toggle twice to get to correct state if needed
          dispatch({ type: 'calendar/toggleTimeMode' });
          dispatch({ type: 'calendar/toggleTimeMode' });
        }
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
  }, [dispatch, timeMode]);
  
  // Sync time mode with calendar service and update body class
  useEffect(() => {
    setTimeMode(timeMode);
    // Apply mode class to body for theme styling
    document.body.classList.remove('mode-sync', 'mode-true');
    document.body.classList.add(`mode-${timeMode.toLowerCase()}`);
  }, [timeMode]);
  
  // Sync notifications when notes change - debounced
  useEffect(() => {
    const syncNotifications = async () => {
      const hasPermission = await hasNotificationPermission();
      if (hasPermission && Object.keys(notes).length > 0) {
        await syncNoteNotifications(notes);
      }
    };
    
    const timeoutId = setTimeout(syncNotifications, 1000);
    return () => clearTimeout(timeoutId);
  }, [notes]);
  
  // Calendar expand states
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [isCalendarExpandedHorizontal, setIsCalendarExpandedHorizontal] = useState(false);
  const toggleCalendarExpand = useCallback(() => {
    setIsCalendarExpanded(prev => !prev);
  }, []);
  const toggleCalendarExpandHorizontal = useCallback(() => {
    setIsCalendarExpandedHorizontal(prev => !prev);
  }, []);
  
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
    dispatch(setView('print-preview'));
  }, [dispatch]);
  
  const handleAstrologyClick = useCallback(() => {
    console.log('[DEBUG] Stars button clicked, setting view to stars');
    dispatch(setView('stars'));
  }, [dispatch]);
  
  const handleYearClick = useCallback(() => modalState.setShowYearModal(true), [modalState]);
  const handleSearchClick = useCallback(() => modalState.setShowSearchModal(true), [modalState]);
  const handleFriendsClick = useCallback(() => {
    // Check if user is authenticated before entering Cosmic Circle
    if (!auth.isAuthenticated) {
      // Show auth modal first - they need to sign in
      modalState.setShowAuthModal(true);
      return;
    }
    // User is authenticated, show Cosmic Circle
    modalState.setShowFriendsModal(true);
  }, [modalState, auth.isAuthenticated]);
  const handleStatsClick = useCallback(() => modalState.setShowStatsModal(true), [modalState]);
  const handleCommunityClick = useCallback(() => modalState.setShowCommunityModal(true), [modalState]);
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
    <div className="app">
      {error && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button onClick={dismissError}>
            Dismiss
          </button>
        </div>
      )}
      
      <main className="app-main">
        {currentView === 'print-preview' ? (
          <PrintPreview />
        ) : currentView === 'stars' ? (
          <StarsHub />
        ) : currentView === 'astrology-hub' ? (
          <AstrologyHub />
        ) : (
          <>
            {/* Sign In Bar - Above Header */}
            <div className="app-top-bar">
              <AuthButton onClick={() => modalState.setShowAuthModal(true)} />
            </div>
            
            {/* Header */}
            <header 
              className="app-header" 
              style={{ 
                marginTop: '0px',
                paddingTop: '45px',
                paddingBottom: '45px',
                position: 'relative'
              }}
            >
              <div className="app-header__top-line" />
              <h1 className="app-title">The Modern HEKA Calendar</h1>
              <p className={`app-subtitle ${timeMode === 'TRUE' ? 'app-subtitle--true' : ''}`}>
                {subtitle}
              </p>
              <div className={`mode-indicator mode-indicator--${timeMode.toLowerCase()}`}>
                {timeMode === 'TRUE' ? '⚡ TRUE HEKA Mode' : '🌐 SYNC Mode'}
              </div>
              <div className="app-header__diamond">✦</div>
            </header>
            
            {/* Settings below header - collapsed by default on mobile */}
            <SettingsPanel />
            
            {/* Celestial Guide - Swiss Ephemeris Powered */}
            <CelestialGuide />
            
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
        <YearModal isOpen={true} onClose={() => modalState.setShowYearModal(false)} />
      )}
      {modalState.showSearchModal && (
        <SearchModal isOpen={true} onClose={() => modalState.setShowSearchModal(false)} />
      )}
      {modalState.showFriendsModal && (
        <FriendsModal isOpen={true} onClose={() => modalState.setShowFriendsModal(false)} />
      )}
      {modalState.showStatsModal && (
        <StatsModal isOpen={true} onClose={() => modalState.setShowStatsModal(false)} />
      )}
      {modalState.showCommunityModal && (
        <CommunityHolidays isOpen={true} onClose={() => modalState.setShowCommunityModal(false)} />
      )}
      {modalState.showJournalModal && (
        <OracleJournal isOpen={true} onClose={() => modalState.setShowJournalModal(false)} />
      )}
      {modalState.showInfoModal && (
        <InfoModal isOpen={true} onClose={() => modalState.setShowInfoModal(false)} />
      )}
      
      {modalState.showAuthModal && (
        <AuthModalEnterprise isOpen={true} onClose={() => modalState.setShowAuthModal(false)} />
      )}
      
      {/* Welcome Modal - For invited users */}
      {modalState.showWelcomeModal && (
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
      )}
      
      {/* Task Preview Modal - For shared tasks */}
      {showTaskPreview && pendingTaskShare && (
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
      )}
      
      {/* Tutorial Overlay - Guides new users */}
      <TutorialOverlay />
      
      {/* Footer removed for cleaner mobile UI */}
      
      {/* Task Notifications - Shows when receiving new tasks */}
      <TaskNotification 
        onTaskClick={() => {
          // Open Friends modal and navigate to tasks
          modalState.setShowFriendsModal(true);
        }}
      />
 </div>
  );
};

// Memoize AppContent to prevent unnecessary re-renders
const AppContent = memo(AppContentComponent);
AppContent.displayName = 'AppContent';

export function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
}
