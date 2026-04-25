/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ONBOARDING SHELL — Maps engine state to lazy-loaded screen components
 * Each screen is code-split to keep initial chunk size minimal.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { Suspense, useMemo } from 'react';
import { useOnboarding } from './OnboardingEngine';
import { SplashScreen } from './SplashScreen';
import type { OnboardingNodeId } from '../../../types/onboardingV2';
import './onboardingAnimations.css';

// Splash is eagerly loaded — it's the first thing users see
// Everything else is lazy-loaded to minimize initial chunk
const IntentSelector = React.lazy(() => import('./IntentSelector').then(m => ({ default: m.IntentSelector })));
const PersonalizationForm = React.lazy(() => import('./PersonalizationForm').then(m => ({ default: m.PersonalizationForm })));
const BirthdayProvocation = React.lazy(() => import('./BirthdayProvocation').then(m => ({ default: m.BirthdayProvocation })));
const TheBreakdown = React.lazy(() => import('./TheBreakdown').then(m => ({ default: m.TheBreakdown })));
const GridReveal = React.lazy(() => import('./GridReveal').then(m => ({ default: m.GridReveal })));
const DayPanelDiscovery = React.lazy(() => import('./DayPanelDiscovery').then(m => ({ default: m.DayPanelDiscovery })));
const FirstNoteRitual = React.lazy(() => import('./FirstNoteRitual').then(m => ({ default: m.FirstNoteRitual })));
const SyncTrueDemo = React.lazy(() => import('./SyncTrueDemo').then(m => ({ default: m.SyncTrueDemo })));
const OraclePreview = React.lazy(() => import('./OraclePreview').then(m => ({ default: m.OraclePreview })));
const StarsPreview = React.lazy(() => import('./StarsPreview').then(m => ({ default: m.StarsPreview })));
const CirclePreview = React.lazy(() => import('./CirclePreview').then(m => ({ default: m.CirclePreview })));
const CovenantScreen = React.lazy(() => import('./CovenantScreen').then(m => ({ default: m.CovenantScreen })));
const TrackerPreview = React.lazy(() => import('./TrackerPreview').then(m => ({ default: m.TrackerPreview })));
const CommunityPreview = React.lazy(() => import('./CommunityPreview').then(m => ({ default: m.CommunityPreview })));
const HeaiAIPreview = React.lazy(() => import('./HeaiAIPreview').then(m => ({ default: m.HeaiAIPreview })));

const SCREEN_MAP: Record<OnboardingNodeId, React.FC> = {
  'splash': SplashScreen,
  'intent-select': IntentSelector,
  'personalization': PersonalizationForm,
  'birthday-provocation': BirthdayProvocation,
  'the-breakdown': TheBreakdown,
  'grid-reveal': GridReveal,
  'day-panel-discovery': DayPanelDiscovery,
  'first-note-ritual': FirstNoteRitual,
  'sync-true-demo': SyncTrueDemo,
  'oracle-preview': OraclePreview,
  'stars-preview': StarsPreview,
  'circle-preview': CirclePreview,
  'tracker-preview': TrackerPreview,
  'community-preview': CommunityPreview,
  'heai-preview': HeaiAIPreview,
  'covenant': CovenantScreen,
  'complete': CompleteScreen,
};

function CompleteScreen() {
  const { state } = useOnboarding();
  const name = state.personalization.name || 'Timekeeper';
  return (
    <div className="im-screen" role="dialog" aria-modal="true" aria-labelledby="complete-title">
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.2) 0%, transparent 70%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            animation: 'im-glow-pulse 3s ease-in-out infinite',
          }}
        >
          <span style={{ fontSize: 36 }}>✦</span>
        </div>
        <h1 id="complete-title" className="im-title">
          Welcome, {name}
        </h1>
        <p className="im-subtitle" style={{ marginTop: 12 }}>
          Your calendar is ready. Thirteen months of perfect rhythm await.
        </p>
      </div>
    </div>
  );
}

// Minimal loading fallback for lazy screens (should rarely show)
const ScreenFallback: React.FC = () => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05040a',
      zIndex: 9998,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: '2px solid rgba(201, 162, 39, 0.15)',
        borderTopColor: '#c9a227',
        animation: 'im-progress-rotate 0.8s linear infinite',
      }}
    />
  </div>
);

export const OnboardingShell: React.FC<{ onComplete: () => void }> = () => {
  const { state, goBack, getProgressPercent } = useOnboarding();

  const Screen = useMemo(() => SCREEN_MAP[state.currentNodeId], [state.currentNodeId]);
  const progress = getProgressPercent();
  const canGoBack = state.currentNodeId !== 'splash' && state.currentNodeId !== 'complete';

  if (!Screen) {
    console.warn(`[OnboardingShell] Unknown node: ${state.currentNodeId}`);
    return null;
  }

  // Eager screens don't need Suspense; lazy ones do
  const isLazy = state.currentNodeId !== 'splash';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
      }}
    >
      {/* Progress bar */}
      {state.currentNodeId !== 'splash' && state.currentNodeId !== 'complete' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10000, padding: '16px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            {canGoBack && (
              <button
                onClick={goBack}
                aria-label="Go back"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a89bc8',
                  fontSize: 20,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  lineHeight: 1,
                }}
              >
                ←
              </button>
            )}
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #c9a227, #e8c84a)',
                  borderRadius: 2,
                  transition: 'width 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            </div>
            <span style={{ fontSize: 11, color: '#6b5b8a', fontFamily: 'JetBrains Mono, monospace', minWidth: 36, textAlign: 'right' }}>
              {progress}%
            </span>
          </div>
        </div>
      )}

      {isLazy ? (
        <Suspense fallback={<ScreenFallback />}>
          <Screen />
        </Suspense>
      ) : (
        <Screen />
      )}
    </div>
  );
};
