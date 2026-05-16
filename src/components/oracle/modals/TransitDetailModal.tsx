import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PersonalTransit } from '../../../oracle/birthChartIntegration';

interface TransitDetailModalProps {
  transit: PersonalTransit | null;
  onClose: () => void;
}

export const TransitDetailModal: React.FC<TransitDetailModalProps> = ({ transit, onClose }) => {
  const { t } = useTranslation('journal');
  if (!transit) return null;
  
  return (
    <div className="transit-modal-overlay" onClick={onClose}>
      <div className="transit-modal" onClick={e => e.stopPropagation()}>
        <h3>{t('transit.title', { transitingPlanet: transit.transitingPlanet, aspect: transit.aspect, natalPlanet: transit.natalPlanet })}</h3>
        <div className="transit-orb">
          <span>{t('transit.orb', { orb: transit.orb.toFixed(1) })}</span>
          <span className="strength">{t('transit.strength', { strength: transit.strength })}</span>
        </div>
        <p className="transit-interpretation">{transit.interpretation}</p>
        <div className="transit-keywords">
          {transit.keywords.map((k, i) => <span key={i} className="keyword">{k}</span>)}
        </div>
        <button className="close-transit" onClick={onClose}>{t('transit.close')}</button>
      </div>
    </div>
  );
};
