/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PROFILE SELECTOR - Multi-Profile Management UI
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Elegant dropdown and card-based interface for switching between multiple
 * birth charts. Supports quick switching, profile creation, and visual previews.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { profileManager, type ProfileListItem } from '../../services/natal/profileManager';

interface ProfileSelectorProps {
  onProfileChange?: (profileId: string | null) => void;
  onAddProfile?: () => void;
  compact?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'inline-block',
    zIndex: 100,
  },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 14px',
    background: 'rgba(147, 51, 234, 0.15)',
    border: '1px solid rgba(147, 51, 234, 0.4)',
    borderRadius: '10px',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '14px',
    transition: 'all 0.2s ease',
  },
  triggerCompact: {
    padding: '6px 10px',
    fontSize: '13px',
  },
  avatar: {
    fontSize: '18px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
  },
  name: {
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  details: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  dropdown: {
    position: 'absolute' as const,
    top: 'calc(100% + 8px)',
    left: 0,
    width: 'min(280px, calc(100vw - 48px))',
    maxWidth: '280px',
    minWidth: '240px',
    background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.98), rgba(40, 30, 60, 0.98))',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    zIndex: 10000,
    overflow: 'hidden',
  },
  dropdownRight: {
    left: 'auto',
    right: 0,
  },
  dropdownHeader: {
    padding: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  addButton: {
    padding: '6px 12px',
    background: 'rgba(147, 51, 234, 0.3)',
    border: 'none',
    borderRadius: '6px',
    color: '#e9d5ff',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  profileList: {
    maxHeight: '320px',
    overflowY: 'auto' as const,
  },
  profileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
    borderLeft: '3px solid transparent',
  },
  profileItemActive: {
    background: 'rgba(147, 51, 234, 0.15)',
    borderLeftColor: '#9333ea',
  },
  profileItemDefault: {
    background: 'rgba(251, 191, 36, 0.05)',
  },
  profileAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.95)',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  profileSigns: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: '2px',
  },
  defaultBadge: {
    fontSize: '12px',
    padding: '2px 6px',
    background: 'rgba(251, 191, 36, 0.2)',
    color: '#fbbf24',
    borderRadius: '4px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  emptyState: {
    padding: '32px 16px',
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  emptyIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
};

const SIGN_SYMBOLS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  onProfileChange,
  onAddProfile,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profiles, setProfiles] = useState<ProfileListItem[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('celestial');

  // Load profiles
  const loadProfiles = useCallback(() => {
    const list = profileManager.listProfiles();
    setProfiles(list);
    
    const active = profileManager.getActiveProfile();
    setActiveProfileId(active?.id || null);
  }, []);

  useEffect(() => {
    loadProfiles();
    
    // Subscribe to profile events
    const unsubscribe = profileManager.subscribe((event) => {
      if (event.type === 'profile:created' || 
          event.type === 'profile:deleted' ||
          event.type === 'profile:updated') {
        loadProfiles();
      }
      if (event.type === 'profile:switched') {
        setActiveProfileId(event.profileId);
      }
    });

    return unsubscribe;
  }, [loadProfiles]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleProfileSelect = (profileId: string) => {
    profileManager.setActiveProfile(profileId);
    onProfileChange?.(profileId);
    setIsOpen(false);
  };

  const handleAddProfile = () => {
    setIsOpen(false);
    onAddProfile?.();
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  return (
    <div style={styles.container} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        style={{ ...styles.trigger, ...(compact && styles.triggerCompact) }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={styles.avatar}>{activeProfile?.avatar || '✨'}</span>
        {!compact && (
          <div style={styles.info}>
            <span style={styles.name}>{activeProfile?.name || t('profile.selectProfile')}</span>
            {activeProfile && (
              <span style={styles.details}>
                {SIGN_SYMBOLS[activeProfile.sunSign]} {activeProfile.sunSign.slice(0, 3)} • 
                {' '}{SIGN_SYMBOLS[activeProfile.moonSign]} {activeProfile.moonSign.slice(0, 3)}
              </span>
            )}
          </div>
        )}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{...styles.dropdown, ...(window.innerWidth < 400 && styles.dropdownRight)}}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>{t('profile.yourCharts')}</span>
            <button style={styles.addButton} onClick={handleAddProfile}>
              <span>+</span> {t('profile.addNew')}
            </button>
          </div>

          <div style={styles.profileList}>
            {profiles.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🌙</div>
                <div>{t('profile.noCharts')}</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>{t('profile.createFirst')}</div>
              </div>
            ) : (
              profiles.map((profile) => (
                <div
                  key={profile.id}
                  style={{
                    ...styles.profileItem,
                    ...(profile.id === activeProfileId && styles.profileItemActive),
                    ...(profile.isDefault && styles.profileItemDefault),
                  }}
                  onClick={() => handleProfileSelect(profile.id)}
                >
                  <div style={styles.profileAvatar}>{profile.avatar}</div>
                  <div style={styles.profileInfo}>
                    <div style={styles.profileName}>{profile.name}</div>
                    <div style={styles.profileSigns}>
                      ☉ {SIGN_SYMBOLS[profile.sunSign]} • 
                      {' '}☽ {SIGN_SYMBOLS[profile.moonSign]} • 
                      {' '}ASC {SIGN_SYMBOLS[profile.ascendantSign]}
                    </div>
                  </div>
                  {profile.isDefault && (
                    <span style={styles.defaultBadge}>{t('profile.default')}</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
