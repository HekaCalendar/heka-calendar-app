/**
 * Auth Modal - Beautiful Authentication Interface
 * Sophisticated login/signup with smooth animations
 */

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setAuthenticated, setUnauthenticated, setSyncing, setSyncError, setLastSync } from '../store';
import { 
  signUp, 
  logIn, 
  logOut, 
  resetPassword, 
  onAuthChange,
  syncToCloud,
  loadFromCloud,
  loadAllAstroData,
  syncAllAstroData,
  isFirebaseConfigured
} from '../services/firebase';
import { signInWithGoogleNative } from '../services/nativeAuth';
import { persistence, DEFAULT_PROFILE_PREFERENCES } from '../astrology/services/persistence';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot' | 'profile' | 'not-configured';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('auth');
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.calendar.auth);
  const calendarState = useSelector((state: RootState) => state.calendar);
  
  const [view, setView] = useState<AuthView>(auth.isAuthenticated ? 'profile' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if Firebase is configured
  const firebaseConfigured = isFirebaseConfigured();
  
  // Update view when auth state changes (while modal is open)
  useEffect(() => {
    if (!firebaseConfigured) {
      setView('not-configured');
    } else if (auth.isAuthenticated && view !== 'profile') {
      setView('profile');
    } else if (!auth.isAuthenticated && view === 'profile') {
      setView('login');
    }
  }, [auth.isAuthenticated, firebaseConfigured, view]);
  
  // Listen to auth state changes
  useEffect(() => {
    if (!firebaseConfigured) {
      return;
    }
    
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        dispatch(setAuthenticated({
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
        // Auto-sync after login
        handleSync(user.uid);
      } else {
        dispatch(setUnauthenticated());
      }
    });
    return () => unsubscribe();
  }, [dispatch, firebaseConfigured]);

  const handleSync = useCallback(async (userId: string) => {
    if (!userId) return;
    
    dispatch(setSyncing(true));
    dispatch(setSyncError(null));
    
    try {
      // ── Calendar data sync ──────────────────────────────────────────────
      const cloudData = await loadFromCloud(userId);
      
      if (cloudData) {
        await syncToCloud(userId, {
          notes: { ...cloudData.notes, ...calendarState.notes },
          statistics: calendarState.statistics,
          settings: {
            theme: calendarState.theme,
            font: calendarState.font,
            location: calendarState.location,
            subRegion: calendarState.subRegion,
            timeMode: calendarState.timeMode,
            display: calendarState.display,
          }
        });
      } else {
        await syncToCloud(userId, {
          notes: calendarState.notes,
          statistics: calendarState.statistics,
          settings: {
            theme: calendarState.theme,
            font: calendarState.font,
            location: calendarState.location,
            subRegion: calendarState.subRegion,
            timeMode: calendarState.timeMode,
            display: calendarState.display,
          }
        });
      }

      // ── Astrology data sync ─────────────────────────────────────────────
      try {
        const cloudAstro = await loadAllAstroData(userId);
        const localProfiles = await persistence.getAllProfiles();
        const localCharts = await Promise.all(
          localProfiles.map(p => persistence.getChartsForProfile(p.id))
        ).then(arr => arr.flat());

        if (cloudAstro.profiles.length > 0 || cloudAstro.charts.length > 0) {
          // Merge: cloud wins if newer
          const localProfileMap = new Map(localProfiles.map(p => [p.id, p]));
          for (const cp of cloudAstro.profiles) {
            const local = localProfileMap.get(cp.id);
            const cloudTime = new Date(cp._syncedAt || cp.updatedAt || 0).getTime();
            const localTime = local ? new Date((local as any).updatedAt || 0).getTime() : 0;
            if (!local || cloudTime > localTime) {
              await persistence.saveProfile(cp);
              localProfileMap.set(cp.id, cp);
            }
          }
          const localChartMap = new Map(localCharts.map(c => [c.id, c]));
          for (const cc of cloudAstro.charts) {
            const local = localChartMap.get(cc.id);
            const cloudTime = new Date(cc._syncedAt || cc.calculatedAt || 0).getTime();
            const localTime = local ? new Date((local as any).calculatedAt || 0).getTime() : 0;
            if (!local || cloudTime > localTime) {
              await persistence.saveChart(cc);
              localChartMap.set(cc.id, cc);
            }
          }
          if (cloudAstro.preferences) {
            const localP = await persistence.getPreferences();
            const cloudTime = new Date(cloudAstro.preferences._syncedAt || 0).getTime();
            const localTime = localP ? new Date((localP as any)._syncedAt || 0).getTime() : 0;
            if (!localP || cloudTime > localTime) {
              await persistence.savePreferences(cloudAstro.preferences);
            }
          }
          if (cloudAstro.selectedProfileId) {
            const localSel = await persistence.getSelectedProfile();
            if (!localSel) await persistence.setSelectedProfile(cloudAstro.selectedProfileId as import('../astrology/types').ProfileId);
          }
        }

        // Push merged local state to cloud
        const finalProfiles = await persistence.getAllProfiles();
        const finalCharts = await Promise.all(
          finalProfiles.map(p => persistence.getChartsForProfile(p.id))
        ).then(arr => arr.flat());
        const finalPrefs = await persistence.getPreferences();
        const finalSelected = await persistence.getSelectedProfile();
        if (finalProfiles.length > 0) {
          await syncAllAstroData(userId, {
            profiles: finalProfiles,
            charts: finalCharts,
            preferences: finalPrefs || DEFAULT_PROFILE_PREFERENCES,
            selectedProfileId: finalSelected,
          });
        }
      } catch (astroErr) {
        console.warn('[AuthModal] Astrology sync failed:', astroErr);
      }
      
      dispatch(setLastSync(new Date().toISOString()));
    } catch (err: any) {
      dispatch(setSyncError(err.message || 'Sync failed'));
    } finally {
      dispatch(setSyncing(false));
    }
  }, [calendarState, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await logIn(email, password);
      setSuccess('Welcome back!');
      setTimeout(() => {
        setView('profile');
        setSuccess(null);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogleNative();
      setSuccess('Welcome!');
      setTimeout(() => {
        setView('profile');
        setSuccess(null);
      }, 1000);
    } catch (err: any) {
      if (err.code === 'auth/cancelled') {
        // User cancelled — no error message needed
      } else {
        setError(err.message || 'Google Sign-In failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await signUp(email, password, displayName);
      setSuccess('Account created successfully!');
      setTimeout(() => {
        setView('profile');
        setSuccess(null);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setSuccess('Password reset email sent!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logOut();
      setView('login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    if (auth.userId) {
      await handleSync(auth.userId);
    }
  };

  const switchView = (newView: AuthView) => {
    setView(newView);
    setError(null);
    setSuccess(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal__header">
          <div className="auth-modal__brand">
            <span className="auth-modal__logo">❦</span>
            <h2 className="auth-modal__title">
              {view === 'login' && 'Welcome Back'}
              {view === 'signup' && 'Create Account'}
              {view === 'forgot' && 'Reset Password'}
              {view === 'profile' && 'Your Profile'}
              {view === 'not-configured' && 'Cloud Sync Setup'}
            </h2>
          </div>
          <button className="auth-modal__close" onClick={onClose} aria-label={t('close')}>×</button>
        </div>

        {/* Content */}
        <div className="auth-modal__content">
          {/* Error/Success Messages */}
          {error && (
            <div className="auth-message auth-message--error">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="auth-message auth-message--success">
              <span>✓</span> {success}
            </div>
          )}

          {/* Login View */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-form__group">
                <label className="auth-form__label">{t('email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-form__input"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="auth-form__group">
                <label className="auth-form__label">{t('password')}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-form__input"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="auth-form__submit"
                disabled={isLoading}
              >
                {isLoading ? t('signingIn') : t('signIn')}
              </button>

              <div className="auth-divider">or</div>

              <button
                type="button"
                className="auth-social-btn auth-social-btn--google"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <span className="auth-social-btn__icon">🔍</span>
                Continue with Google
              </button>
              
              <div className="auth-form__links">
                <button 
                  type="button" 
                  className="auth-link"
                  onClick={() => switchView('forgot')}
                >
                  Forgot password?
                </button>
                <button 
                  type="button" 
                  className="auth-link"
                  onClick={() => switchView('signup')}
                >
                  Create account
                </button>
              </div>
            </form>
          )}

          {/* Signup View */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="auth-form__group">
                <label className="auth-form__label">{t('displayName')}</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="auth-form__input"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="auth-form__group">
                <label className="auth-form__label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-form__input"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="auth-form__group">
                <label className="auth-form__label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-form__input"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <span className="auth-form__hint">At least 6 characters</span>
              </div>
              <button 
                type="submit" 
                className="auth-form__submit"
                disabled={isLoading}
              >
                {isLoading ? t('creatingAccount') : t('signUp')}
              </button>
              
              <div className="auth-divider">or</div>

              <button
                type="button"
                className="auth-social-btn auth-social-btn--google"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <span className="auth-social-btn__icon">🔍</span>
                Continue with Google
              </button>

              <div className="auth-form__links">
                <button 
                  type="button" 
                  className="auth-link"
                  onClick={() => switchView('login')}
                >
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password View */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="auth-form">
              <p className="auth-form__text">
                Enter your email and we'll send you a password reset link.
              </p>
              <div className="auth-form__group">
                <label className="auth-form__label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-form__input"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="auth-form__submit"
                disabled={isLoading}
              >
                {isLoading ? t('sending') : t('sendResetLink')}
              </button>
              
              <div className="auth-form__links">
                <button 
                  type="button" 
                  className="auth-link"
                  onClick={() => switchView('login')}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}

          {/* Profile View */}
          {view === 'profile' && auth.isAuthenticated && (
            <div className="auth-profile">
              <div className="auth-profile__avatar">
                {auth.photoURL ? (
                  <img src={auth.photoURL} alt="Profile" />
                ) : (
                  <span>{auth.displayName?.charAt(0) || auth.email?.charAt(0) || '?'}</span>
                )}
              </div>
              
              <div className="auth-profile__info">
                <h3 className="auth-profile__name">{auth.displayName || 'User'}</h3>
                <p className="auth-profile__email">{auth.email}</p>
              </div>

              <div className="auth-profile__sync">
                <div className="auth-profile__sync-status">
                  {auth.isSyncing ? (
                    <span className="sync-indicator sync-indicator--active">
                      <span className="sync-spinner"></span> Syncing...
                    </span>
                  ) : auth.lastSync ? (
                    <span className="sync-indicator sync-indicator--success">
                      ✓ Last synced: {new Date(auth.lastSync).toLocaleString()}
                    </span>
                  ) : (
                    <span className="sync-indicator">{t('notSyncedYet')}</span>
                  )}
                </div>
                
                <button 
                  className="auth-profile__sync-btn"
                  onClick={handleManualSync}
                  disabled={auth.isSyncing}
                >
                  🔄 Sync Now
                </button>
                
                {auth.syncError && (
                  <p className="auth-profile__sync-error">⚠️ {auth.syncError}</p>
                )}
              </div>

              <div className="auth-profile__data">
                <h4 className="auth-profile__section-title">{t('syncedData')}</h4>
                <ul className="auth-profile__data-list">
                  <li>📔 Journal Notes</li>
                  <li>📊 Statistics</li>
                  <li>⚙️ Settings (Theme, Location, etc.)</li>
                </ul>
                <p className="auth-profile__data-hint">
                  Your data is automatically synced when you make changes.
                </p>
              </div>

              <button 
                className="auth-profile__logout"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? t('signingOut') : t('signOut')}
              </button>
            </div>
          )}
          
          {/* Not Configured View */}
          {view === 'not-configured' && (
            <div className="auth-not-configured">
              <div className="auth-not-configured__icon">☁️</div>
              <h3 className="auth-not-configured__title">{t('cloudSyncNotConfigured')}</h3>
              <p className="auth-not-configured__text">
                Firebase authentication is not set up yet. The app works fully offline, 
                but to enable cloud backup and sync across devices, Firebase needs to be configured.
              </p>
              <div className="auth-not-configured__steps">
                <p>{t('toEnableCloudSync')}</p>
                <ol>
                  <li>{t('firebaseProjectStep')}</li>
                  <li>{t('addWebAppStep')}</li>
                  <li>{t('copyConfigStep')}</li>
                  <li>{t('envFileStep')}</li>
                </ol>
              </div>
              <div className="auth-not-configured__hint">
                <p>Your data is still saved locally and will persist on this device.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="auth-modal__footer">
          <p>🔒 Your data is securely synced to the cloud</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
