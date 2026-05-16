/**
 * Circle Settings Panel
 * Theme selector + notification toggles for Cosmic Circle.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { updateNotificationPreferences } from '../../store';
import { setCircleTheme } from '../../store/friendsSlice';
import type { CircleTheme } from '../../store/friendsSlice';

const CIRCLE_THEMES: { id: CircleTheme; name: string; emoji: string; colors: string[] }[] = [
  { id: 'nebula', name: 'Nebula', emoji: '🌌', colors: ['#1a0a2e', '#4a1a6b', '#16213e'] },
  { id: 'solar', name: 'Solar', emoji: '☀️', colors: ['#2d1b00', '#8b4513', '#d4a017'] },
  { id: 'void', name: 'Void', emoji: '🌑', colors: ['#0a0a0a', '#1a1a2e', '#000000'] },
  { id: 'aurora', name: 'Aurora', emoji: '✨', colors: ['#0a1a1a', '#1a3a3a', '#00d9a5'] },
  { id: 'quantum', name: 'Quantum', emoji: '⚛️', colors: ['#0a0a1a', '#1a1a3e', '#7c3aed'] },
];

interface CircleSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CircleSettings: React.FC<CircleSettingsProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('circle');
  const dispatch = useDispatch<AppDispatch>();
  const currentTheme = useSelector((state: RootState) => state.friends.circleTheme);
  const prefs = useSelector((state: RootState) => state.calendar.notificationPreferences.circle);
  const globalEnabled = useSelector((state: RootState) => state.calendar.notificationPreferences.globalEnabled);

  const [activeTab, setActiveTab] = useState<'themes' | 'notifications'>('themes');

  if (!isOpen) return null;

  const toggle = (key: keyof typeof prefs) => {
    dispatch(updateNotificationPreferences({
      section: 'circle',
      prefs: { [key]: !prefs[key] }
    }));
  };

  const Switch = ({ checked, onChange, label, description, tier }: { checked: boolean; onChange: () => void; label: string; description: string; tier?: string }) => (
    <label style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      cursor: globalEnabled ? 'pointer' : 'default',
      opacity: globalEnabled ? 1 : 0.4,
    }}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        <div style={{
          width: '40px',
          height: '22px',
          borderRadius: '11px',
          background: checked && globalEnabled ? '#c9a227' : 'rgba(255,255,255,0.15)',
          position: 'relative',
          transition: 'all 0.2s',
        }}>
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: '2px',
            left: checked && globalEnabled ? '20px' : '2px',
            transition: 'all 0.2s',
          }} />
        </div>
      </div>
      <input
        type="checkbox"
        checked={checked && globalEnabled}
        onChange={onChange}
        disabled={!globalEnabled}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 500, color: '#e0e0e0' }}>{label}</span>
          {tier && (
            <span style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              padding: '2px 6px',
              borderRadius: '4px',
              background: tier === 'core' ? 'rgba(239,68,68,0.2)' : tier === 'standard' ? 'rgba(201,162,39,0.2)' : 'rgba(59,130,246,0.2)',
              color: tier === 'core' ? '#fca5a5' : tier === 'standard' ? '#fde68a' : '#93c5fd',
            }}>
              {tier}
            </span>
          )}
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(224,224,224,0.5)', marginTop: '2px' }}>{description}</div>
      </div>
    </label>
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
    }} onClick={onClose}>
      <div style={{
        width: '90%',
        maxWidth: '420px',
        maxHeight: '80vh',
        background: '#0f0f1e',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#e0e0e0' }}>
            {t('settings.title')}
          </h2>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: 'rgba(224,224,224,0.6)',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {(['themes', 'notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '12px',
                background: 'none',
                border: 'none',
                color: activeTab === tab ? '#c9a227' : 'rgba(224,224,224,0.5)',
                fontSize: '14px',
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: 'pointer',
                borderBottom: activeTab === tab ? '2px solid #c9a227' : '2px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {tab === 'themes' ? t('settings.themesTab') : t('settings.notificationsTab')}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'themes' && (
            <div>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(224,224,224,0.5)' }}>
                {t('settings.themesDescription')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {CIRCLE_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => dispatch(setCircleTheme(theme.id))}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: currentTheme === theme.id ? '2px solid #c9a227' : '2px solid transparent',
                      background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{theme.emoji}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#e0e0e0' }}>{t(`settings.themes.${theme.id}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'rgba(224,224,224,0.5)' }}>
                {t('settings.notificationsDescription')}
              </p>
              <Switch
                checked={prefs.friendRequests}
                onChange={() => toggle('friendRequests')}
                label={t('settings.friendRequests')}
                description={t('settings.friendRequestsDesc')}
                tier={t('settings.tierCore')}
              />
              <Switch
                checked={prefs.taskRequests}
                onChange={() => toggle('taskRequests')}
                label={t('settings.taskRequests')}
                description={t('settings.taskRequestsDesc')}
                tier={t('settings.tierCore')}
              />
              {/* Messages toggle hidden — no trigger implementation yet */}
              <Switch
                checked={prefs.taskDueReminders}
                onChange={() => toggle('taskDueReminders')}
                label={t('settings.taskDueReminders')}
                description={t('settings.taskDueRemindersDesc')}
                tier={t('settings.tierStandard')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircleSettings;
