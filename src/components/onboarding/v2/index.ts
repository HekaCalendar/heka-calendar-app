/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE IMMACULATE ONBOARDING — Public API
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export { OnboardingEngine, useOnboarding, NODE_GRAPH, NODE_MAP } from './OnboardingEngine';
export { MotionContainer, ParallaxLayer, FadeInView, PulseRing } from './MotionContainer';
export { ProgressOrb, ProgressDots } from './ProgressOrb';
export * from './OnboardingIcons';

// Screen components (lazy-loaded by the engine)
export { SplashScreen } from './SplashScreen';
export { IntentSelector } from './IntentSelector';
export { PersonalizationForm } from './PersonalizationForm';
export { BirthdayProvocation } from './BirthdayProvocation';
export { TheBreakdown } from './TheBreakdown';
export { GridReveal } from './GridReveal';
export { DayPanelDiscovery } from './DayPanelDiscovery';
export { FirstNoteRitual } from './FirstNoteRitual';
export { SyncTrueDemo } from './SyncTrueDemo';
export { OraclePreview } from './OraclePreview';
export { StarsPreview } from './StarsPreview';
export { CirclePreview } from './CirclePreview';
export { TrackerPreview } from './TrackerPreview';
export { CommunityPreview } from './CommunityPreview';
export { HeaiAIPreview } from './HeaiAIPreview';
export { CovenantScreen } from './CovenantScreen';
export { OnboardingShell } from './OnboardingShell';
export { ONBOARDING_V2_STORAGE_KEY, ONBOARDING_V2_VERSION_KEY } from '../../../types/onboardingV2';
