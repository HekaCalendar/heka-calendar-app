import React from 'react';
import type { PersonalTransit } from '../../../oracle/birthChartIntegration';

interface TransitDetailModalProps {
  transit: PersonalTransit | null;
  onClose: () => void;
}

export const TransitDetailModal: React.FC<TransitDetailModalProps> = ({ transit, onClose }) => {
  if (!transit) return null;
  
  return (
    <div className="transit-modal-overlay" onClick={onClose}>
      <div className="transit-modal" onClick={e => e.stopPropagation()}>
        <h3>{transit.transitingPlanet} {transit.aspect} Natal {transit.natalPlanet}</h3>
        <div className="transit-orb">
          <span>Orb: {transit.orb.toFixed(1)}°</span>
          <span className="strength">Strength: {transit.strength}%</span>
        </div>
        <p className="transit-interpretation">{transit.interpretation}</p>
        <div className="transit-keywords">
          {transit.keywords.map((k, i) => <span key={i} className="keyword">{k}</span>)}
        </div>
        <button className="close-transit" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
