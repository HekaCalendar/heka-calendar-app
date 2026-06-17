import React from 'react';
import { useTranslation } from 'react-i18next';

interface OracleHeaderProps {
  onClose: () => void;
  hasBirthChart: boolean;
  effectiveProfile: { name: string | null } | null;
}

export const OracleHeader: React.FC<OracleHeaderProps> = ({
  onClose,
  hasBirthChart,
  effectiveProfile,
}) => {
  const { t } = useTranslation('journal');

  return (
    <div className="oracle-header-mast">
      {/* Back Button */}
      <button className="back-btn" onClick={onClose} title={t('oracle.backToCalendar')}>
        <span>←</span>
        <span className="back-label">{t('oracle.back')}</span>
      </button>

      <div className="oracle-logo">
        <span className="oracle-logo-icon">✨</span>
        <div className="oracle-logo-text">
          <h1>{t('oracle.title')}</h1>
          <span className="oracle-logo-subtitle">
            {hasBirthChart && effectiveProfile
              ? t('oracle.personalGuidance', { name: effectiveProfile.name })
              : t('oracle.generalGuidance')}
          </span>
        </div>
      </div>

      <div className="oracle-celestial-status">
        <div className="celestial-bubble" title={t('oracle.dailyDrawTooltip')}>
          <span className="celestial-icon">🔮</span>
          <span className="celestial-value">{t('oracle.daily')}</span>
        </div>
      </div>
    </div>
  );
};
