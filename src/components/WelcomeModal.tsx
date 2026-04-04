import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { acceptInvite } from '../store/friendsSlice';
import { clearPendingInvite } from '../services/deepLinkService';
import { tutorialService } from '../services/tutorialService';

interface WelcomeModalProps {
  isOpen: boolean;
  inviteCode: string | null;
  onClose: () => void;
  onAccepted: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  inviteCode,
  onClose,
  onAccepted,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');

  const handleAccept = useCallback(async (code: string) => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await dispatch(acceptInvite(code.trim())).unwrap();
      // If we get here, the invite was accepted successfully
      clearPendingInvite();
      onAccepted();
    } catch (err: any) {
      setError(err?.message || 'Failed to accept invitation. Please check the code and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, onAccepted]);

  const handleManualSubmit = useCallback(() => {
    void handleAccept(manualCode);
  }, [handleAccept, manualCode]);

  const handleSkip = useCallback(() => {
    clearPendingInvite();
    // Mark onboarding as skipped so user doesn't see tutorial AND welcome at same time later
    tutorialService.updatePreferences({ skipOnboarding: true });
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleSkip}>
      <div className="modal welcome-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">✨ Welcome to the Circle</h2>
          <button className="modal__close" onClick={handleSkip}>×</button>
        </div>
        
        <div className="welcome-modal__content">
          <div className="welcome-modal__icon">🌙</div>
          
          <p className="welcome-modal__intro">
            You've been invited to join a Cosmic Circle!
          </p>

          {inviteCode && (
            <div className="welcome-modal__invite-info">
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                Invite Code Detected:
              </p>
              <code className="welcome-modal__code">{inviteCode}</code>
              
              <button
                className="btn btn--primary welcome-modal__accept-btn"
                onClick={() => handleAccept(inviteCode)}
                disabled={isLoading}
              >
                {isLoading ? '✨ Connecting...' : '🌟 Join the Circle'}
              </button>
            </div>
          )}

          <div className="welcome-modal__divider">
            <span>or enter code manually</span>
          </div>

          <div className="welcome-modal__manual">
            <input
              type="text"
              className="input"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="Enter invite code (e.g., ABC-DEF-GHI)"
              maxLength={12}
              disabled={isLoading}
              style={{ textAlign: 'center', textTransform: 'uppercase' }}
            />
            <button
              className="btn btn--secondary"
              onClick={handleManualSubmit}
              disabled={!manualCode.trim() || isLoading}
            >
              Submit
            </button>
          </div>

          {error && (
            <div className="welcome-modal__error">
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSkip} className="welcome-modal__skip">
            Skip for now
          </button>

          <div className="welcome-modal__info">
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '0 0 var(--space-2)' }}>
              Joining a Circle allows you to:
            </p>
            <ul className="welcome-modal__features">
              <li>📜 Send and receive Task Rituals</li>
              <li>💬 Message through cosmic channels</li>
              <li>🗓️ Align on HEKA dates together</li>
              <li>✨ Share celestial insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
