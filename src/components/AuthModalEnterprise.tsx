/**
 * Enterprise Auth Modal - Production-Grade Authentication
 * Features: Password strength, security audit, session management, account controls
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setAuthenticated, setUnauthenticated, setSyncing, setSyncError, setLastSync } from '../store';
import { enterpriseAuth } from '../services/authEnterprise';
import {
  getKnownAccounts,
  saveKnownAccount,
  removeKnownAccount,
  type KnownAccount,
} from '../services/accountManager';
import { isFirebaseConfigured } from '../services/firebase';
import { syncToCloud, loadFromCloud, loadAllAstroData, syncAllAstroData } from '../services/firebase';
import { signInWithGoogleNative } from '../services/nativeAuth';
import { persistence, DEFAULT_PROFILE_PREFERENCES } from '../astrology/services/persistence';
import type { AstroProfile, NatalChart, ProfilePreferences } from '../astrology/types';
import { tutorialService } from '../services/tutorialService';
import { getErrorMessage, getErrorCode } from '../utils/errorUtils';
import { ConfirmDialog } from './ui/ConfirmDialog';


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot' | 'profile' | 'security' | 'delete-account' | 'account-picker' | 'not-configured';

// Password strength indicator
const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState({ score: 0, feedback: [] as string[], isValid: false });
  
  useEffect(() => {
    if (password) {
      setStrength(enterpriseAuth.validatePasswordStrength(password));
    } else {
      setStrength({ score: 0, feedback: [], isValid: false });
    }
  }, [password]);

  const colors = ['#ef4444', '#ef4444', '#f97316', '#eab308', '#22c55e', '#22c55e'];
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];

  return (
    <div className="password-strength">
      <div className="password-strength__bars">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className="password-strength__bar"
            style={{
              backgroundColor: level <= strength.score ? colors[strength.score] : 'rgba(255,255,255,0.1)'
            }}
          />
        ))}
      </div>
      <div className="password-strength__label" style={{ color: colors[strength.score] }}>
        {password ? labels[strength.score] : 'Enter password'}
      </div>
      {strength.feedback.length > 0 && (
        <ul className="password-strength__feedback">
          {strength.feedback.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const AuthModalEnterprise: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('auth');
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.calendar.auth);
  const calendarState = useSelector((state: RootState) => state.calendar);
  
  const [view, setView] = useState<AuthView>(
    auth.isAuthenticated ? 'profile' : (getKnownAccounts().length > 0 ? 'account-picker' : 'login')
  );
  const [knownAccounts, setKnownAccounts] = useState<KnownAccount[]>(() => getKnownAccounts());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, isValid: false });
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const firebaseConfigured = isFirebaseConfigured();

  // Update view based on auth state
  useEffect(() => {
    if (!firebaseConfigured) {
      setView('not-configured');
    } else if (auth.isAuthenticated && view !== 'profile' && view !== 'security') {
      setView('profile');
    } else if (!auth.isAuthenticated && ['profile', 'security'].includes(view)) {
      const accounts = getKnownAccounts();
      setKnownAccounts(accounts);
      setView(accounts.length > 0 ? 'account-picker' : 'login');
    }
  }, [auth.isAuthenticated, firebaseConfigured, view]);

  // Auth state listener
  useEffect(() => {
    if (!firebaseConfigured) return;
    
    const unsubscribe = enterpriseAuth.onAuthChange((user) => {
      if (user) {
        dispatch(setAuthenticated({
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName,
          photoURL: user.photoURL,
        }));
        handleSync(user.uid);
      } else {
        dispatch(setUnauthenticated());
      }
    });
    return () => unsubscribe();
  }, [dispatch, firebaseConfigured]);

  // Session activity tracker
  useEffect(() => {
    if (isOpen && auth.isAuthenticated) {
      enterpriseAuth.recordActivity();
    }
  }, [isOpen, auth.isAuthenticated]);

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
          const cloudProfiles = cloudAstro.profiles as unknown as AstroProfile[];
          const cloudCharts = cloudAstro.charts as unknown as NatalChart[];
          const localProfileMap = new Map(localProfiles.map(p => [p.id, p]));
          for (const cp of cloudProfiles) {
            const local = localProfileMap.get(cp.id);
            const cloudTime = new Date((cp as unknown as { _syncedAt?: string })._syncedAt || cp.updatedAt || 0).getTime();
            const localTime = local ? new Date((local as unknown as { updatedAt?: string }).updatedAt || 0).getTime() : 0;
            if (!local || cloudTime > localTime) {
              await persistence.saveProfile(cp as unknown as AstroProfile);
              localProfileMap.set(cp.id, cp as unknown as AstroProfile);
            }
          }
          const localChartMap = new Map(localCharts.map(c => [c.id, c]));
          for (const cc of cloudCharts) {
            const local = localChartMap.get(cc.id);
            const cloudTime = new Date((cc as unknown as { _syncedAt?: string })._syncedAt || cc.calculatedAt || 0).getTime();
            const localTime = local ? new Date((local as unknown as { calculatedAt?: string }).calculatedAt || 0).getTime() : 0;
            if (!local || cloudTime > localTime) {
              await persistence.saveChart(cc as unknown as NatalChart);
              localChartMap.set(cc.id, cc as unknown as NatalChart);
            }
          }
          if (cloudAstro.preferences) {
            const localP = await persistence.getPreferences();
            const cloudTime = new Date((cloudAstro.preferences as unknown as { _syncedAt?: string })._syncedAt || 0).getTime();
            const localTime = localP ? new Date((localP as unknown as { _syncedAt?: string })._syncedAt || 0).getTime() : 0;
            if (!localP || cloudTime > localTime) {
              await persistence.savePreferences(cloudAstro.preferences as unknown as ProfilePreferences);
            }
          }
          if (cloudAstro.selectedProfileId) {
            const localSel = await persistence.getSelectedProfile();
            if (!localSel) await persistence.setSelectedProfile(cloudAstro.selectedProfileId as import('../astrology/types').ProfileId);
          }
        }

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
        console.warn('[AuthModalEnterprise] Astrology sync failed:', astroErr);
      }
      
      dispatch(setLastSync(new Date().toISOString()));
    } catch (err) {
      dispatch(setSyncError(getErrorMessage(err, 'Sync failed')));
    } finally {
      dispatch(setSyncing(false));
    }
  }, [calendarState, dispatch]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const credential = await enterpriseAuth.logIn(email, password);
      if (credential.user) {
        saveKnownAccount({
          uid: credential.user.uid,
          email: credential.user.email || email,
          displayName: credential.user.displayName,
          photoURL: credential.user.photoURL,
        });
      }
      setSuccess('Welcome back!');
      setTimeout(() => {
        setView('profile');
        setSuccess(null);
        setPassword('');
      }, 1000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const credential = await signInWithGoogleNative();
      if (credential.user) {
        saveKnownAccount({
          uid: credential.user.uid,
          email: credential.user.email || '',
          displayName: credential.user.displayName,
          photoURL: credential.user.photoURL,
        });
      }
      setSuccess('Welcome!');
      setTimeout(() => {
        setView('profile');
        setSuccess(null);
      }, 1000);
    } catch (err) {
      if (getErrorCode(err) === 'auth/cancelled') {
        // User cancelled — no error message needed
      } else {
        setError(getErrorMessage(err, 'Google Sign-In failed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password match
    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }

    setIsLoading(true);
    
    try {
      const credential = await enterpriseAuth.signUp(email, password, displayName);
      if (credential.user) {
        saveKnownAccount({
          uid: credential.user.uid,
          email: credential.user.email || email,
          displayName: credential.user.displayName || displayName,
          photoURL: credential.user.photoURL,
        });
      }
      setSuccess('Account created successfully!');
      setTimeout(() => {
        setView('profile');
        setSuccess(null);
        setPassword('');
        setConfirmPassword('');
      }, 1000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      await enterpriseAuth.changePassword(password, newPassword);
      setSuccess('Password changed successfully!');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setView('profile');
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (deleteConfirm !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setIsLoading(true);
    
    try {
      const userEmail = auth.email;
      await enterpriseAuth.deleteAccount(password);
      if (userEmail) removeKnownAccount(userEmail);
      dispatch(setUnauthenticated());
      setSuccess('Account deleted successfully');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await enterpriseAuth.resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Remember this account so user can quickly log back in
      if (auth.userId && auth.email) {
        saveKnownAccount({
          uid: auth.userId,
          email: auth.email,
          displayName: auth.displayName,
          photoURL: auth.photoURL,
        });
      }
      await enterpriseAuth.signOut();
      const accounts = getKnownAccounts();
      setKnownAccounts(accounts);
      setView(accounts.length > 0 ? 'account-picker' : 'login');
    } catch (err) {
      setError(getErrorMessage(err));
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
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setDeleteConfirm('');
    // Scroll modal back to top so new views are visible
    if (modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  };

  const checkPasswordStrength = (pwd: string) => {
    setPasswordStrength(enterpriseAuth.validatePasswordStrength(pwd));
    setPassword(pwd);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} ref={modalRef}>
      <div className="auth-modal auth-modal--enterprise" onClick={(e) => e.stopPropagation()} ref={modalContentRef}>
        {/* Header */}
        <div className="auth-modal__header">
          <div className="auth-modal__brand">
            <span className="auth-modal__logo">❦</span>
            <div>
              <h2 className="auth-modal__title">
                {view === 'login' && t('signIn')}
                {view === 'signup' && t('signUp')}
                {view === 'forgot' && 'Reset Password'}
                {view === 'profile' && 'Account'}
                {view === 'security' && 'Security Settings'}
                {view === 'delete-account' && 'Delete Account'}
                {view === 'account-picker' && 'Welcome Back'}
                {view === 'not-configured' && 'Cloud Sync Setup'}
              </h2>
              {auth.isAuthenticated && view === 'profile' && (
                <div className="auth-modal__subtitle">{auth.email}</div>
              )}
            </div>
          </div>
          <button className="auth-modal__close" onClick={onClose} aria-label={t('close')}>×</button>
        </div>

        {/* Content */}
        <div className="auth-modal__content">
          {/* Alerts */}
          {error && (
            <div className="auth-alert auth-alert--error">
              <span className="auth-alert__icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="auth-alert auth-alert--success">
              <span className="auth-alert__icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          {/* Account Picker View */}
          {view === 'account-picker' && (
            <div className="auth-account-picker">
              <p className="auth-account-picker__subtitle">
                Select an account to sign in
              </p>
              <div className="auth-account-picker__list">
                {knownAccounts.map((account) => (
                  <div key={account.uid} className="auth-account-picker__item">
                    <div className="auth-account-picker__avatar">
                      {account.displayName?.charAt(0) || account.email?.charAt(0) || '?'}
                    </div>
                    <div className="auth-account-picker__info">
                      <div className="auth-account-picker__name">
                        {account.displayName || 'User'}
                      </div>
                      <div className="auth-account-picker__email">
                        {account.email}
                      </div>
                    </div>
                    <div className="auth-account-picker__actions">
                      <button
                        className="auth-account-picker__signin"
                        onClick={() => {
                          setEmail(account.email);
                          switchView('login');
                        }}
                      >
                        Sign in
                      </button>
                      <button
                        className="auth-account-picker__remove"
                        onClick={() => {
                          removeKnownAccount(account.email);
                          const remaining = getKnownAccounts();
                          setKnownAccounts(remaining);
                          if (remaining.length === 0) {
                            setEmail('');
                            switchView('login');
                          }
                        }}
                        aria-label={t('common.delete')}
                        title="Forget this account"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="auth-account-picker__footer">
                <button
                  className="auth-account-picker__add"
                  onClick={() => {
                    setEmail('');
                    switchView('login');
                  }}
                >
                  + Add account
                </button>
              </div>
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
                  placeholder={t('email')}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="auth-form__group">
                <label className="auth-form__label">{t('password')}</label>
                <div className="auth-form__password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-form__input"
                    placeholder={t('password')}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-form__toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button 
                type="submit" 
                className="auth-form__submit"
                disabled={isLoading}
              >
                {isLoading ? t('signingIn') : t('signIn')}
              </button>

              <div className="auth-divider">{t('or')}</div>

              <button
                type="button"
                className="auth-social-btn auth-social-btn--google"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <span className="auth-social-btn__icon">🔍</span>
                {t('continueWithGoogle')}
              </button>
              
              <div className="auth-form__links">
                <button type="button" className="auth-link" onClick={() => switchView('forgot')}>
                  {t('forgotPassword')}
                </button>
                <button type="button" className="auth-link" onClick={() => switchView('signup')}>
                  {t('createAccount')}
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
                  placeholder={t('displayName')}
                  autoComplete="name"
                  required
                />
              </div>
              <div className="auth-form__group">
                <label className="auth-form__label">{t('email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-form__input"
                  placeholder={t('email')}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="auth-form__group">
                <label className="auth-form__label">{t('password')}</label>
                <div className="auth-form__password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => checkPasswordStrength(e.target.value)}
                    className="auth-form__input"
                    placeholder={t('password')}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-form__toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <PasswordStrengthMeter password={password} />
              </div>
              <div className="auth-form__group">
                <label className="auth-form__label">{t('confirmPassword')}</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-form__input"
                  placeholder={t('passwordPlaceholder', 'Enter your password')}
                  autoComplete="new-password"
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <div className="auth-form__error">{t('passwordsDoNotMatch')}</div>
                )}
              </div>
              <button 
                type="submit" 
                className="auth-form__submit"
                disabled={isLoading || !passwordStrength.isValid}
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
                {t('continueWithGoogle')}
              </button>
              
              <div className="auth-form__links">
                <button type="button" className="auth-link" onClick={() => switchView('login')}>
                  Already have an account? Sign in
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password View */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="auth-form">
              <p className="auth-form__text">
                {t('forgotSubtitle')}
              </p>
              <div className="auth-form__group">
                <label className="auth-form__label">{t('email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-form__input"
                  placeholder={t('email')}
                  autoComplete="email"
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
                <button type="button" className="auth-link" onClick={() => switchView('login')}>
                  Back to sign in
                </button>
              </div>
            </form>
          )}

          {/* Profile View */}
          {view === 'profile' && auth.isAuthenticated && (
            <div className="auth-profile">
              <div className="auth-profile__user">
                <div className="auth-profile__avatar">
                  {auth.displayName?.charAt(0) || auth.email?.charAt(0) || '?'}
                </div>
                <div className="auth-profile__info">
                  <div className="auth-profile__name">{auth.displayName || 'User'}</div>
                  <div className="auth-profile__email">{auth.email}</div>
                  <div className="auth-profile__id">ID: {auth.userId?.slice(0, 8)}...</div>
                </div>
              </div>

              <div className="auth-profile__sync">
                <div className="auth-profile__sync-status">
                  {auth.isSyncing ? (
                    <span className="sync-indicator sync-indicator--active">
                      <span className="sync-spinner"></span> {t('syncingToCloud')}
                    </span>
                  ) : auth.lastSync ? (
                    <span className="sync-indicator sync-indicator--success">
                      ✓ Last synced: {new Date(auth.lastSync).toLocaleString()}
                    </span>
                  ) : (
                    <span className="sync-indicator">{t('notSyncedYet')}</span>
                  )}
                </div>
                
                {auth.syncError && (
                  <div className="auth-profile__sync-error">⚠️ {auth.syncError}</div>
                )}
                
                <button 
                  className="auth-profile__sync-btn"
                  onClick={handleManualSync}
                  disabled={auth.isSyncing}
                >
                  🔄 Sync Now
                </button>
              </div>

              <div className="auth-profile__menu">
                <button className="auth-profile__menu-item" onClick={() => switchView('security')}>
                  <span>🔐</span> Security Settings
                </button>
                <button 
                  className="auth-profile__menu-item" 
                  onClick={() => {
                    // Reset legacy tutorial
                    tutorialService.resetAllTutorials();
                    // Reset v2 onboarding
                    try {
                      localStorage.removeItem('heka-onboarding-v2-state');
                      localStorage.removeItem('heka-onboarding-v2-version');
                    } catch {
                      // Non-fatal
                    }
                    // Reset v3 interactive tutorial
                    try {
                      localStorage.removeItem('heka-tutorial-v3');
                    } catch {
                      // Non-fatal
                    }
                    onClose();
                    // Reload to trigger new onboarding
                    window.location.reload();
                  }}
                >
                  <span>🎓</span> Restart Tutorial
                </button>
                <button 
                  className="auth-profile__menu-item auth-profile__menu-item--danger"
                  onClick={() => setShowDeleteConfirmDialog(true)}
                >
                  <span>🗑️</span> {t('deleteAccount')}
                </button>
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

          {/* Security Settings View */}
          {view === 'security' && (
            <div className="auth-security">
              <button className="auth-back" onClick={() => switchView('profile')}>
                ← Back to Profile
              </button>
              
              <h3 className="auth-security__title">{t('changePassword')}</h3>
              
              <form onSubmit={handlePasswordChange} className="auth-form">
                <div className="auth-form__group">
                  <label className="auth-form__label">{t('currentPassword')}</label>
                  <div className="auth-form__password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-form__input"
                      placeholder={t('passwordPlaceholder', 'Enter your password')}
                      required
                    />
                    <button
                      type="button"
                      className="auth-form__toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                
                <div className="auth-form__group">
                  <label className="auth-form__label">{t('newPassword')}</label>
                  <div className="auth-form__password-wrapper">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordStrength(enterpriseAuth.validatePasswordStrength(e.target.value));
                      }}
                      className="auth-form__input"
                      placeholder={t('passwordPlaceholder', 'Enter your password')}
                      required
                    />
                    <button
                      type="button"
                      className="auth-form__toggle-password"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <PasswordStrengthMeter password={newPassword} />
                </div>
                
                <div className="auth-form__group">
                  <label className="auth-form__label">{t('confirmNewPassword')}</label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-form__input"
                    placeholder={t('passwordPlaceholder', 'Enter your password')}
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <div className="auth-form__error">{t('passwordsDoNotMatch')}</div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="auth-form__submit"
                  disabled={isLoading || !passwordStrength.isValid || newPassword !== confirmPassword}
                >
                  {isLoading ? t('updating') : t('changePassword')}
                </button>
              </form>
            </div>
          )}

          <ConfirmDialog
            isOpen={showDeleteConfirmDialog}
            onClose={() => setShowDeleteConfirmDialog(false)}
            onConfirm={() => {
              setShowDeleteConfirmDialog(false);
              switchView('delete-account');
            }}
            title={t('deleteAccount')}
            description={t('deleteConfirmPrompt', 'Are you sure you want to delete your account? This action cannot be undone.')}
            confirmText={t('deleteAccount')}
            variant="danger"
          />

          {/* Delete Account View */}
          {view === 'delete-account' && (
            <div className="auth-delete">
              <button className="auth-back" onClick={() => switchView('profile')}>
                ← Back to Profile
              </button>
              
              <div className="auth-delete__warning">
                <div className="auth-delete__icon">⚠️</div>
                <h3 className="auth-delete__title">{t('deleteTitle')}</h3>
                <p className="auth-delete__text">{t('deleteWarning')}</p>
              </div>
              
              <form onSubmit={handleDeleteAccount} className="auth-form">
                <div className="auth-form__group">
                  <label className="auth-form__label">{t('enterPasswordToConfirm')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-form__input"
                    placeholder={t('passwordPlaceholder', 'Enter your password')}
                    required
                  />
                </div>
                
                <div className="auth-form__group">
                  <label className="auth-form__label">
                    Type <strong>DELETE</strong> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className="auth-form__input auth-form__input--danger"
                    placeholder="DELETE"
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="auth-form__submit auth-form__submit--danger"
                  disabled={isLoading || deleteConfirm !== 'DELETE'}
                >
                  {isLoading ? t('deleting') : t('deleteAccount')}
                </button>
              </form>
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
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="auth-modal__footer">
          <div className="auth-modal__security-badges">
            <span>🔒 Secure Connection</span>
            <span>✓ Firebase Auth</span>
            <span>☁️ Cloud Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModalEnterprise;
