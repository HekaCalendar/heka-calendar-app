/**
 * Profile Setup Modal
 * Requires users to create a username before using Cosmic Circle
 */

import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { updateUserProfile } from '../store';
import { getCurrentUser, updateProfile } from '../services/firebase';
import { getErrorMessage } from '../utils/errorUtils';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const AVATAR_OPTIONS = [
  { emoji: '🌙', name: 'Moon' },
  { emoji: '☀️', name: 'Sun' },
  { emoji: '⭐', name: 'Star' },
  { emoji: '🌟', name: 'Bright Star' },
  { emoji: '🔥', name: 'Fire' },
  { emoji: '💧', name: 'Water' },
  { emoji: '🌍', name: 'Earth' },
  { emoji: '💨', name: 'Air' },
  { emoji: '🌌', name: 'Galaxy' },
  { emoji: '✨', name: 'Sparkles' },
  { emoji: '🦋', name: 'Butterfly' },
  { emoji: '🐉', name: 'Dragon' },
];

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const { t } = useTranslation('circle');
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.calendar.auth);
  
  const [username, setUsername] = useState(auth.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].emoji);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const validateUsername = (name: string): boolean => {
    if (!name.trim()) return false;
    if (name.length < 2) return false;
    if (name.length > 30) return false;
    // Only allow letters, numbers, spaces, and basic punctuation
    if (!/^[\w\s.-]+$/.test(name)) return false;
    return true;
  };

  

  const handleSubmit = useCallback(async () => {
    if (!validateUsername(username)) {
      setError(t('profileSetup.errorValidation'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = getCurrentUser();
      if (!user) {
        setError(t('profileSetup.errorNotLoggedIn'));
        return;
      }

      // Update Firebase profile
      const photoURL = selectedAvatar;
      await updateProfile(user, {
        displayName: username.trim(),
        photoURL: photoURL,
      });

      // Update Redux state
      dispatch(updateUserProfile({
        userId: user.uid,
        email: user.email || '',
        displayName: username.trim(),
        photoURL: photoURL,
      }));

      onComplete();
    } catch (err) {
      setError(getErrorMessage(err, t('profileSetup.errorUpdateFailed')));
    } finally {
      setIsLoading(false);
    }
  }, [username, selectedAvatar, dispatch, onComplete]);

  if (!isOpen) return null;

  const finalAvatar = selectedAvatar;

  return (
    <div className="modal-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal profile-setup-modal" style={{ maxWidth: '480px' }}>
        <div className="modal__header">
          <h2 className="modal__title">{t('profileSetup.title')}</h2>
        </div>
        
        <div className="profile-setup__content" style={{ padding: 'var(--space-6)' }}>
          <p className="profile-setup__intro" style={{ 
            textAlign: 'center', 
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-5)'
          }}>
            {t('profileSetup.intro')}
          </p>

          {/* Avatar Preview */}
          <div className="profile-setup__avatar-section" style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 'var(--space-5)'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-gold-muted) 0%, rgba(212,175,55,0.2) 100%)',
              border: '2px solid var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              overflow: 'hidden',
              marginBottom: 'var(--space-3)',
            }}>
              {finalAvatar}
            </div>
            

            
          </div>

          {/* Emoji Avatar Selection */}
          {
            <div className="profile-setup__emoji-grid" style={{ marginBottom: 'var(--space-5)' }}>
              <label style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-2)'
              }}>
                {t('profileSetup.chooseEmoji')}
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: 'var(--space-2)',
              }}>
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar.emoji}
                    onClick={() => setSelectedAvatar(avatar.emoji)}
                    style={{
                      padding: 'var(--space-2)',
                      fontSize: '1.5rem',
                      background: selectedAvatar === avatar.emoji 
                        ? 'var(--color-gold-muted)' 
                        : 'rgba(255,255,255,0.05)',
                      border: selectedAvatar === avatar.emoji 
                        ? '2px solid var(--color-gold)' 
                        : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    title={t(`profileSetup.avatars.${avatar.name.toLowerCase().replace(/\s+/g, '')}`)}
                  >
                    {avatar.emoji}
                  </button>
                ))}
              </div>
            </div>
          }

          {/* Username Input */}
          <div className="profile-setup__username" style={{ marginBottom: 'var(--space-4)' }}>
            <label 
              htmlFor="username"
              style={{ 
                display: 'block', 
                fontSize: 'var(--text-sm)', 
                color: 'var(--color-text)',
                marginBottom: 'var(--space-2)'
              }}
            >
              {t('profileSetup.cosmicName')}
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('profileSetup.placeholderName')}
              maxLength={30}
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                fontSize: 'var(--text-base)',
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${error ? '#ef4444' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text)',
              }}
            />
            <div style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-1)'
            }}>
              {t('profileSetup.nameHint')}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3)',
              color: '#ef4444',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-4)',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            className="btn btn--primary"
            onClick={handleSubmit}
            disabled={isLoading || !username.trim()}
            style={{ width: '100%', padding: 'var(--space-3)' }}
          >
            {isLoading ? t('profileSetup.creating') : t('profileSetup.enterCircle')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupModal;
