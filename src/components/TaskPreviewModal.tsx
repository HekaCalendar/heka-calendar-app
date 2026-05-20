/**
 * Task Preview Modal
 * Shows task details for users who received a task share link
 * Allows accepting/declining before or after authentication
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { setAuthenticated } from '../store';
import { 
  TaskShareService, 
  type TaskPreview 
} from '../services/taskShareService';
import { getCurrentUser, signUp, logIn } from '../services/firebase';
import { ProfileSetupModal } from './ProfileSetupModal';
import { getErrorMessage } from '../utils/errorUtils';

interface TaskPreviewModalProps {
  shareCode: string;
  isOpen: boolean;
  onClose: () => void;
  onAccepted: () => void;
}

type ViewState = 'preview' | 'signup' | 'login' | 'setup' | 'accepting' | 'result';

export const TaskPreviewModal: React.FC<TaskPreviewModalProps> = ({
  shareCode,
  isOpen,
  onClose,
  onAccepted,
}) => {
  const { t } = useTranslation('circle');
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.calendar.auth);
  
  const [viewState, setViewState] = useState<ViewState>('preview');
  const [task, setTask] = useState<TaskPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; friendshipCreated?: boolean; message?: string } | null>(null);
  
  // Auth form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Load task preview
  useEffect(() => {
    if (!isOpen || !shareCode) return;
    
    const loadTask = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const preview = await TaskShareService.getTaskPreview(shareCode);
        if (preview) {
          setTask(preview);
          if (preview.isExpired) {
            setError(t('taskPreview.expired'));
          } else if (preview.isAccepted) {
            setError(t('taskPreview.alreadyAccepted'));
          }
        } else {
          setError(t('taskPreview.notFound'));
        }
      } catch (err) {
        setError(t('taskPreview.failedToLoad'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTask();
  }, [isOpen, shareCode]);

  // Check if user is already logged in
  useEffect(() => {
    if (isOpen && auth.isAuthenticated && viewState === 'preview') {
      // User is logged in, show accept option directly
      handleAccept();
    }
  }, [isOpen, auth.isAuthenticated, viewState]);

  const handleAccept = useCallback(async () => {
    if (!task) return;
    
    setViewState('accepting');
    setIsLoading(true);
    
    try {
      const user = getCurrentUser();
      if (!user) {
        // Need to authenticate first
        setViewState('signup');
        setIsLoading(false);
        return;
      }
      
      const response = await TaskShareService.acceptSharedTask(shareCode);
      
      if (response.success) {
        setResult({
          success: true,
          friendshipCreated: response.friendshipCreated,
          message: response.friendshipCreated 
            ? t('taskPreview.acceptedWithFriend')
            : t('taskPreview.acceptedInCircle'),
        });
        setViewState('result');
        onAccepted();
      } else {
        setResult({
          success: false,
          message: response.error || t('taskPreview.failedToAccept'),
        });
        setViewState('result');
      }
    } catch (err) {
      setResult({
        success: false,
        message: getErrorMessage(err, t('taskPreview.genericError')),
      });
      setViewState('result');
    } finally {
      setIsLoading(false);
    }
  }, [shareCode, task, onAccepted]);

  const handleDecline = useCallback(async () => {
    if (!task) return;
    
    setIsLoading(true);
    
    try {
      await TaskShareService.declineSharedTask(shareCode);
      setResult({
        success: true,
        message: t('taskPreview.declined'),
      });
      setViewState('result');
    } catch (err) {
      setResult({
        success: false,
        message: getErrorMessage(err, t('taskPreview.failedToDecline')),
      });
      setViewState('result');
    } finally {
      setIsLoading(false);
    }
  }, [shareCode, task]);

  const handleSignup = useCallback(async () => {
    if (!email || !password || !displayName) {
      setAuthError(t('taskPreview.fillAllFields'));
      return;
    }
    
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const userCredential = await signUp(email, password, displayName);
      
      dispatch(setAuthenticated({
        userId: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      }));
      
      // After signup, go to profile setup, then accept
      setViewState('setup');
    } catch (err) {
      setAuthError(getErrorMessage(err, t('taskPreview.failedToCreateAccount')));
    } finally {
      setIsLoading(false);
    }
  }, [email, password, displayName, dispatch]);

  const handleLogin = useCallback(async () => {
    if (!email || !password) {
      setAuthError(t('taskPreview.enterEmailPassword'));
      return;
    }
    
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const userCredential = await logIn(email, password);
      
      dispatch(setAuthenticated({
        userId: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      }));
      
      // After login, try to accept immediately
      setViewState('accepting');
      const response = await TaskShareService.acceptSharedTask(shareCode);
      
      if (response.success) {
        setResult({
          success: true,
          friendshipCreated: response.friendshipCreated,
          message: response.friendshipCreated 
            ? 'Task accepted! You are now connected with the sender.'
            : 'Task accepted! You can find it in your Cosmic Circle.',
        });
        setViewState('result');
        onAccepted();
      } else {
        setResult({
          success: false,
          message: response.error || 'Failed to accept task',
        });
        setViewState('result');
      }
    } catch (err) {
      setAuthError(getErrorMessage(err, t('taskPreview.failedToSignIn')));
    } finally {
      setIsLoading(false);
    }
  }, [email, password, shareCode, dispatch, onAccepted]);

  const handleProfileSetupComplete = useCallback(async () => {
    // After profile setup, accept the task
    setViewState('accepting');
    setIsLoading(true);
    
    try {
      const response = await TaskShareService.acceptSharedTask(shareCode);
      
      if (response.success) {
        setResult({
          success: true,
          friendshipCreated: response.friendshipCreated,
          message: response.friendshipCreated 
            ? 'Task accepted! You are now connected with the sender.'
            : 'Task accepted! You can find it in your Cosmic Circle.',
        });
        setViewState('result');
        onAccepted();
      } else {
        setResult({
          success: false,
          message: response.error || 'Failed to accept task',
        });
        setViewState('result');
      }
    } catch (err) {
      setResult({
        success: false,
        message: getErrorMessage(err, 'An error occurred'),
      });
      setViewState('result');
    } finally {
      setIsLoading(false);
    }
  }, [shareCode, onAccepted]);

  if (!isOpen) return null;

  // Loading state
  if (isLoading && viewState === 'preview') {
    return (
      <div className="modal-overlay">
        <div className="modal" style={{ maxWidth: '400px', textAlign: 'center', padding: 'var(--space-6)' }}>
          <div className="spinner" style={{ marginBottom: 'var(--space-4)' }} />
          <p>{t('taskPreview.loading')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !task) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
          <div className="modal__header">
            <h2 className="modal__title">{t('taskPreview.unavailable')}</h2>
            <button className="modal__close" onClick={onClose} aria-label={t('close')}>×</button>
          </div>
          <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>😕</div>
            <p>{error}</p>
            <button className="btn btn--primary" onClick={onClose} style={{ marginTop: 'var(--space-4)' }}>
              {t('taskPreview.close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile Setup Modal
  if (viewState === 'setup') {
    return (
      <ProfileSetupModal
        isOpen={true}
        onComplete={handleProfileSetupComplete}
      />
    );
  }

  // Signup/Login View
  if (viewState === 'signup' || viewState === 'login') {
    const isSignup = viewState === 'signup';
    
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
          <div className="modal__header">
            <h2 className="modal__title">{isSignup ? t('taskPreview.createAccount') : t('taskPreview.signIn')}</h2>
            <button className="modal__close" onClick={() => setViewState('preview')} aria-label={t('close')}>×</button>
          </div>
          
          <div style={{ padding: 'var(--space-5)' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
              {isSignup 
                ? 'Create an account to accept this task' 
                : 'Sign in to accept this task'}
            </p>
            
            {authError && (
              <div style={{
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3)',
                color: '#ef4444',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-4)',
              }}>
                ⚠️ {authError}
              </div>
            )}
            
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
                {t('taskPreview.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('taskPreview.placeholderEmail')}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
            
            {isSignup && (
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
                  {t('taskPreview.yourName')}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('taskPreview.placeholderName')}
                  style={{
                    width: '100%',
                    padding: 'var(--space-3)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>
            )}
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
                {t('taskPreview.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('taskPreview.placeholderPassword')}
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)',
                }}
              />
            </div>
            
            <button
              className="btn btn--primary"
              onClick={isSignup ? handleSignup : handleLogin}
              disabled={isLoading}
              style={{ width: '100%', marginBottom: 'var(--space-3)' }}
            >
              {isLoading ? t('taskPreview.processing') : (isSignup ? t('taskPreview.createAccountBtn') : t('taskPreview.signInBtn'))}
            </button>
            
            <button
              className="btn btn--ghost"
              onClick={() => setViewState(isSignup ? 'login' : 'signup')}
              style={{ width: '100%' }}
            >
              {isSignup ? t('taskPreview.alreadyHaveAccount') : t('taskPreview.needAccount')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Accepting view
  if (viewState === 'accepting') {
    return (
      <div className="modal-overlay">
        <div className="modal" style={{ maxWidth: '400px', textAlign: 'center', padding: 'var(--space-6)' }}>
          <div className="spinner" style={{ marginBottom: 'var(--space-4)' }} />
          <p>{t('taskPreview.accepting')}</p>
        </div>
      </div>
    );
  }

  // Result view
  if (viewState === 'result' && result) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
          <div className="modal__header">
            <h2 className="modal__title">{result.success ? t('taskPreview.success') : t('taskPreview.error')}</h2>
            <button className="modal__close" onClick={onClose} aria-label={t('close')}>×</button>
          </div>
          <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>
              {result.success ? '🎉' : '😕'}
            </div>
            <p>{result.message}</p>
            {result.success && result.friendshipCreated && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                {t('taskPreview.friendshipCreated')}
              </p>
            )}
            <button className="btn btn--primary" onClick={onClose} style={{ marginTop: 'var(--space-4)' }}>
              {result.success ? t('taskPreview.goToCircle') : t('taskPreview.close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preview view (default)
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal task-preview-modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{t('taskPreview.taskInvitation')}</h2>
          <button className="modal__close" onClick={onClose} aria-label={t('common.close')}>×</button>
        </div>
        
        <div style={{ padding: 'var(--space-5)' }}>
          {/* Sender Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3)',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-gold-muted) 0%, rgba(212,175,55,0.2) 100%)',
              border: '2px solid var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}>
              {task?.creatorPhotoURL ? (
                task.creatorPhotoURL.startsWith('http') ? (
                  <img 
                    src={task.creatorPhotoURL} 
                    alt="" 
                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  task.creatorPhotoURL
                )
              ) : (
                '👤'
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-gold)' }}>
                {task?.creatorName || 'Unknown Sender'}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {t('taskPreview.sentTaskRitual')}
              </div>
            </div>
          </div>

          {/* Task Details */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-4)',
          }}>
            <h3 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'var(--text-xl)',
              marginBottom: 'var(--space-3)',
              color: 'var(--color-text)',
            }}>
              {task?.title}
            </h3>
            
            <p style={{ 
              color: 'var(--color-text-secondary)', 
              marginBottom: 'var(--space-3)',
              lineHeight: 1.6,
            }}>
              {task?.description}
            </p>
            
            {task?.hekaDate && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                background: 'rgba(201, 162, 39, 0.1)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
              }}>
                <span>📅</span>
                <span>
                  {t('taskPreview.dueDate', { month: task.hekaDate.month + 1, day: task.hekaDate.day, year: task.hekaDate.year })}
                </span>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--space-4)',
          }}>
            <p style={{ margin: 0 }}>
              💡 <strong>{t('taskPreview.whatHappens')}</strong>
            </p>
            <ul style={{ margin: 'var(--space-2) 0 0', paddingLeft: 'var(--space-4)' }}>
              <li>{t('taskPreview.addedToCircle')}</li>
              <li>{t('taskPreview.connectedWith', { name: task?.creatorName || t('taskPreview.unknownSender') })}</li>
              <li>{t('taskPreview.collaborate')}</li>
            </ul>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              className="btn btn--primary"
              onClick={handleAccept}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? t('taskPreview.processing') : t('taskPreview.acceptTask')}
            </button>
            <button
              className="btn"
              onClick={handleDecline}
              disabled={isLoading}
            >
              {t('taskPreview.decline')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPreviewModal;
