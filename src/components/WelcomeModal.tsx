import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('common');
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const handleAccept = useCallback(async (code: string) => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await dispatch(acceptInvite(code.trim())).unwrap();
      // Creates a pending friendship — the inviter will need to accept
      clearPendingInvite();
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || t('failedToSendFriendRequest'));
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

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
          <h2 className="modal__title">{t('welcomeToTheCircle')}</h2>
          <button className="modal__close" onClick={handleSkip} aria-label={t('close')}>×</button>
        </div>
        
        <div className="welcome-modal__content">
          <div className="welcome-modal__icon">🌙</div>
          
          <p className="welcome-modal__intro">
            {t('enterInviteCode')}
          </p>

          {inviteCode && (
            <div className="welcome-modal__invite-info">
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                {t('inviteCodeDetected')}
              </p>
              <code className="welcome-modal__code">{inviteCode}</code>
              
              <button
                className="btn btn--primary welcome-modal__accept-btn"
                onClick={() => handleAccept(inviteCode)}
                disabled={isLoading}
              >
                {isLoading ? t('sending') : t('sendFriendRequest')}
              </button>
            </div>
          )}

          <div className="welcome-modal__divider">
            <span>{t('orEnterCodeManually')}</span>
          </div>

          <div className="welcome-modal__manual">
            <input
              type="text"
              className="input"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder={t('inviteCodePlaceholder')}
              maxLength={12}
              disabled={isLoading}
              style={{ textAlign: 'center', textTransform: 'uppercase' }}
            />
            <button
              className="btn btn--secondary"
              onClick={handleManualSubmit}
              disabled={!manualCode.trim() || isLoading}
            >
              {t('sendRequest')}
            </button>
          </div>

          {success && (
            <div className="welcome-modal__success" style={{ color: 'var(--color-success)', textAlign: 'center', padding: 'var(--space-3)', background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius-lg)' }}>
              {t('friendRequestSent')}
              <button
                className="btn btn--primary"
                style={{ marginTop: 'var(--space-3)' }}
                onClick={onAccepted}
              >
                {t('openCosmicCircle')}
              </button>
            </div>
          )}

          {error && (
            <div className="welcome-modal__error">
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSkip} className="welcome-modal__skip">
            {t('skipForNow')}
          </button>

          <div className="welcome-modal__info">
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: '0 0 var(--space-2)' }}>
              {t('joiningCircleAllows')}
            </p>
            <ul className="welcome-modal__features">
              <li>{t('sendReceiveTaskRituals')}</li>
              <li>{t('messageCosmicChannels')}</li>
              <li>{t('alignHekaDates')}</li>
              <li>{t('shareCelestialInsights')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
