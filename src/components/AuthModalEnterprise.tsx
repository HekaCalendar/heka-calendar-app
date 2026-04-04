/**
 * Enterprise Auth Modal - Production-Grade Authentication
 * Features: Password strength, security audit, session management, account controls
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { setAuthenticated, setUnauthenticated, setSyncing, setSyncError, setLastSync } from '../store';
import { enterpriseAuth } from '../services/authEnterprise';
import { isFirebaseConfigured } from '../services/firebase';
import { syncToCloud, loadFromCloud } from '../services/firebase';
import { tutorialService } from '../services/tutorialService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = 'login' | 'signup' | 'forgot' | 'profile' | 'security' | 'audit' | 'delete-account' | 'not-configured';

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

// Session info display
const SessionInfo = () => {
  const session = enterpriseAuth.getSessionInfo();
  if (!session) return null;

  const duration = Math.floor((Date.now() - new Date(session.startedAt).getTime()) / 60000);

  return (
    <div className="session-info">
      <div className="session-info__icon">🔒</div>
      <div className="session-info__details">
        <div className="session-info__status">Session Active</div>
        <div className="session-info__meta">
          Duration: {duration}m • {session.deviceInfo}
        </div>
      </div>
    </div>
  );
};

export const AuthModalEnterprise: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.calendar.auth);
  const calendarState = useSelector((state: RootState) => state.calendar);
  
  const [view, setView] = useState<AuthView>(auth.isAuthenticated ? 'profile' : 'login');
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
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const firebaseConfigured = isFirebaseConfigured();

  // Update view based on auth state
  useEffect(() => {
    if (!firebaseConfigured) {
      setView('not-configured');
    } else if (auth.isAuthenticated && view !== 'profile' && view !== 'security' && view !== 'audit') {
      setView('profile');
    } else if (!auth.isAuthenticated && ['profile', 'security', 'audit'].includes(view)) {
      setView('login');
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
      await enterpriseAuth.logIn(email, password);
      setSuccess('Welcome back!');
      setTimeout(() => {
        setView('profile');
        setSuccess(null);
        setPassword('');
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      await enterpriseAuth.signUp(email, password, displayName);
      setSuccess('Account created successfully!');
      setTimeout(() => {
        setView('profile');
        setSuccess(null);
        setPassword('');
        setConfirmPassword('');
      }, 1000);
    } catch (err: any) {
      setError(err.message);
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
    } catch (err: any) {
      setError(err.message);
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
      await enterpriseAuth.deleteAccount(password);
      setSuccess('Account deleted successfully');
      setTimeout(() => {
        onClose();
      }, 1500);
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
      await enterpriseAuth.resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await enterpriseAuth.signOut();
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

  const loadAuditLog = () => {
    setAuditLog(enterpriseAuth.getAuditLog());
    setView('audit');
  };

  const switchView = (newView: AuthView) => {
    setView(newView);
    setError(null);
    setSuccess(null);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setDeleteConfirm('');
  };

  const checkPasswordStrength = (pwd: string) => {
    setPasswordStrength(enterpriseAuth.validatePasswordStrength(pwd));
    setPassword(pwd);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} ref={modalRef}>
      <div className="auth-modal auth-modal--enterprise" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal__header">
          <div className="auth-modal__brand">
            <span className="auth-modal__logo">❦</span>
            <div>
              <h2 className="auth-modal__title">
                {view === 'login' && 'Sign In'}
                {view === 'signup' && 'Create Account'}
                {view === 'forgot' && 'Reset Password'}
                {view === 'profile' && 'Account'}
                {view === 'security' && 'Security Settings'}
                {view === 'audit' && 'Security Audit'}
                {view === 'delete-account' && 'Delete Account'}
                {view === 'not-configured' && 'Cloud Sync Setup'}
              </h2>
              {auth.isAuthenticated && view === 'profile' && (
                <div className="auth-modal__subtitle">{auth.email}</div>
              )}
            </div>
          </div>
          <button className="auth-modal__close" onClick={onClose}>×</button>
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

          {/* Login View */}
          {view === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-form__group">
                <label className="auth-form__label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-form__input"
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="auth-form__group">
                <label className="auth-form__label">Password</label>
                <div className="auth-form__password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-form__input"
                    placeholder="••••••••"
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
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
              
              <div className="auth-form__links">
                <button type="button" className="auth-link" onClick={() => switchView('forgot')}>
                  Forgot password?
                </button>
                <button type="button" className="auth-link" onClick={() => switchView('signup')}>
                  Create account
                </button>
              </div>
            </form>
          )}

          {/* Signup View */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="auth-form__group">
                <label className="auth-form__label">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="auth-form__input"
                  placeholder="Your name"
                  autoComplete="name"
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
                  autoComplete="email"
                  required
                />
              </div>
              <div className="auth-form__group">
                <label className="auth-form__label">Password</label>
                <div className="auth-form__password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => checkPasswordStrength(e.target.value)}
                    className="auth-form__input"
                    placeholder="••••••••"
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
                <label className="auth-form__label">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-form__input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <div className="auth-form__error">Passwords do not match</div>
                )}
              </div>
              <button 
                type="submit" 
                className="auth-form__submit"
                disabled={isLoading || !passwordStrength.isValid}
              >
                {isLoading ? 'Creating...' : 'Create Account'}
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
                  autoComplete="email"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="auth-form__submit"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
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
              <SessionInfo />
              
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
                      <span className="sync-spinner"></span> Syncing to cloud...
                    </span>
                  ) : auth.lastSync ? (
                    <span className="sync-indicator sync-indicator--success">
                      ✓ Last synced: {new Date(auth.lastSync).toLocaleString()}
                    </span>
                  ) : (
                    <span className="sync-indicator">Not synced yet</span>
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
                <button className="auth-profile__menu-item" onClick={loadAuditLog}>
                  <span>📋</span> Security Audit Log
                </button>
                <button 
                  className="auth-profile__menu-item" 
                  onClick={() => {
                    tutorialService.resetAllTutorials();
                    tutorialService.startTutorial('elite-onboarding');
                    onClose();
                  }}
                >
                  <span>🎓</span> Restart Tutorial
                </button>
                <button className="auth-profile__menu-item auth-profile__menu-item--danger" onClick={() => switchView('delete-account')}>
                  <span>🗑️</span> Delete Account
                </button>
              </div>

              <button 
                className="auth-profile__logout"
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          )}

          {/* Security Settings View */}
          {view === 'security' && (
            <div className="auth-security">
              <button className="auth-back" onClick={() => switchView('profile')}>
                ← Back to Profile
              </button>
              
              <h3 className="auth-security__title">Change Password</h3>
              
              <form onSubmit={handlePasswordChange} className="auth-form">
                <div className="auth-form__group">
                  <label className="auth-form__label">Current Password</label>
                  <div className="auth-form__password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-form__input"
                      placeholder="••••••••"
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
                  <label className="auth-form__label">New Password</label>
                  <div className="auth-form__password-wrapper">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setPasswordStrength(enterpriseAuth.validatePasswordStrength(e.target.value));
                      }}
                      className="auth-form__input"
                      placeholder="••••••••"
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
                  <label className="auth-form__label">Confirm New Password</label>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="auth-form__input"
                    placeholder="••••••••"
                    required
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <div className="auth-form__error">Passwords do not match</div>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  className="auth-form__submit"
                  disabled={isLoading || !passwordStrength.isValid || newPassword !== confirmPassword}
                >
                  {isLoading ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {/* Audit Log View */}
          {view === 'audit' && (
            <div className="auth-audit">
              <button className="auth-back" onClick={() => switchView('profile')}>
                ← Back to Profile
              </button>
              
              <h3 className="auth-audit__title">Security Audit Log</h3>
              
              <div className="auth-audit__list">
                {auditLog.length === 0 ? (
                  <p className="auth-audit__empty">No audit entries yet</p>
                ) : (
                  auditLog.slice().reverse().map((entry, idx) => (
                    <div key={idx} className={`auth-audit__item ${entry.success ? '' : 'auth-audit__item--failed'}`}>
                      <div className="auth-audit__action">
                        <span className={`auth-audit__status ${entry.success ? 'success' : 'failed'}`}>
                          {entry.success ? '✓' : '✗'}
                        </span>
                        {entry.action}
                      </div>
                      <div className="auth-audit__time">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                      {entry.details && (
                        <div className="auth-audit__details">{entry.details}</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Delete Account View */}
          {view === 'delete-account' && (
            <div className="auth-delete">
              <button className="auth-back" onClick={() => switchView('profile')}>
                ← Back to Profile
              </button>
              
              <div className="auth-delete__warning">
                <div className="auth-delete__icon">⚠️</div>
                <h3 className="auth-delete__title">Delete Account</h3>
                <p className="auth-delete__text">
                  This will permanently delete your account and all associated data. 
                  This action cannot be undone.
                </p>
              </div>
              
              <form onSubmit={handleDeleteAccount} className="auth-form">
                <div className="auth-form__group">
                  <label className="auth-form__label">Enter your password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-form__input"
                    placeholder="••••••••"
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
                  {isLoading ? 'Deleting...' : 'Permanently Delete Account'}
                </button>
              </form>
            </div>
          )}

          {/* Not Configured View */}
          {view === 'not-configured' && (
            <div className="auth-not-configured">
              <div className="auth-not-configured__icon">☁️</div>
              <h3 className="auth-not-configured__title">Cloud Sync Not Configured</h3>
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
