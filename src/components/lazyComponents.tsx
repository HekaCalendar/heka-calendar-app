/**
 * Lazy-loaded heavy components.
 *
 * These components are not needed for first paint and are loaded on-demand
 * to keep the initial bundle small. Each import becomes its own async chunk.
 */

import { lazy, Suspense, type ReactNode } from 'react';

// ═════════════════════════════════════════════════════════════════════════════
// Modals
// ═════════════════════════════════════════════════════════════════════════════

export const YearModal = lazy(() => import('./YearModal').then((m) => ({ default: m.YearModal })));
export const SearchModal = lazy(() => import('./SearchModal').then((m) => ({ default: m.SearchModal })));
export const FriendsModal = lazy(() => import('./FriendsModal').then((m) => ({ default: m.FriendsModal })));
export const StatsModal = lazy(() => import('./StatsModal').then((m) => ({ default: m.StatsModal })));
export const CommunityHub = lazy(() => import('./CommunityHub').then((m) => ({ default: m.CommunityHub })));
export const CommunityVotingModal = lazy(() => import('./CommunityVotingModal').then((m) => ({ default: m.CommunityVotingModal })));
export const OracleJournal = lazy(() => import('./OracleJournal').then((m) => ({ default: m.OracleJournal })));
export const InfoModal = lazy(() => import('./InfoModal').then((m) => ({ default: m.InfoModal })));
export const AuthModalEnterprise = lazy(() => import('./AuthModalEnterprise').then((m) => ({ default: m.AuthModalEnterprise })));
export const WelcomeModal = lazy(() => import('./WelcomeModal').then((m) => ({ default: m.WelcomeModal })));
export const TaskPreviewModal = lazy(() => import('./TaskPreviewModal').then((m) => ({ default: m.TaskPreviewModal })));

// ═════════════════════════════════════════════════════════════════════════════
// Full-page builders / hubs
// ═════════════════════════════════════════════════════════════════════════════

export const PrintPreview = lazy(() => import('./PrintPreview').then((m) => ({ default: m.PrintPreview })));
export const StarsHub = lazy(() => import('../astrology').then((m) => ({ default: m.StarsHub })));
export const AstrologyHub = lazy(() => import('../astrology').then((m) => ({ default: m.AstrologyHub })));
export const CertificateBuilder = lazy(() => import('./certificate').then((m) => ({ default: m.CertificateBuilder })));
export const RoutineBuilder = lazy(() => import('./routine').then((m) => ({ default: m.RoutineBuilder })));
export const NatalReportBuilder = lazy(() => import('./report').then((m) => ({ default: m.NatalReportBuilder })));

// Home-screen heavy components (deferred after first paint)
export const CelestialGuide = lazy(() => import('./CelestialGuide').then((m) => ({ default: m.CelestialGuide })));
export const CalendarAICoach = lazy(() => import('./CalendarAICoach').then((m) => ({ default: m.CalendarAICoach })));

// ═════════════════════════════════════════════════════════════════════════════
// Onboarding
// ═════════════════════════════════════════════════════════════════════════════

export const SetupWizard = lazy(() => import('./setup/SetupWizard').then((m) => ({ default: m.SetupWizard })));
export const InteractiveTutorial = lazy(() => import('./onboarding/v3').then((m) => ({ default: m.InteractiveTutorial })));

// ═════════════════════════════════════════════════════════════════════════════
// Shared Suspense wrapper
// ═════════════════════════════════════════════════════════════════════════════

interface LazyBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function DefaultFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(3, 3, 8, 0.7)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      aria-busy="true"
      aria-label="Loading"
    >
      <div
        style={{
          width: 44,
          height: 44,
          border: '3px solid rgba(255,255,255,0.08)',
          borderTopColor: '#c9a227',
          borderRadius: '50%',
          animation: 'heka-spin 1s linear infinite',
        }}
      />
    </div>
  );
}

export function LazyBoundary({ children, fallback }: LazyBoundaryProps) {
  return <Suspense fallback={fallback ?? <DefaultFallback />}>{children}</Suspense>;
}
