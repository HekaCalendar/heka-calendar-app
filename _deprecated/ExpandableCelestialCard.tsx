/**
 * Expandable Celestial Card Component
 * Click to expand and see full information about celestial events
 */

import { useState } from 'react';

interface ExpandableCelestialCardProps {
  title: string;
  subtitle?: string;
  icon: string;
  accentColor?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const ExpandableCelestialCard: React.FC<ExpandableCelestialCardProps> = ({
  title,
  subtitle,
  icon,
  accentColor = 'var(--color-gold)',
  children,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div 
      className={`celestial-expandable-card ${isExpanded ? 'expanded' : ''}`}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <div 
        className="celestial-expandable-card__header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="celestial-expandable-card__icon">{icon}</span>
        <div className="celestial-expandable-card__title-group">
          <span className="celestial-expandable-card__title">{title}</span>
          {subtitle && (
            <span className="celestial-expandable-card__subtitle">{subtitle}</span>
          )}
        </div>
        <span className={`celestial-expandable-card__chevron ${isExpanded ? 'rotated' : ''}`}>
          ▼
        </span>
      </div>
      
      {isExpanded && (
        <div className="celestial-expandable-card__content">
          {children}
        </div>
      )}
    </div>
  );
};

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ title, children }) => (
  <div className="celestial-info-section">
    <h4 className="celestial-info-section__title">{title}</h4>
    <div className="celestial-info-section__content">
      {children}
    </div>
  </div>
);

interface InfoListProps {
  items: string[];
}

export const InfoList: React.FC<InfoListProps> = ({ items }) => (
  <ul className="celestial-info-list">
    {items.map((item, i) => (
      <li key={i} className="celestial-info-list__item">{item}</li>
    ))}
  </ul>
);

interface InfoBadgeProps {
  label: string;
  value: string;
  color?: string;
}

export const InfoBadge: React.FC<InfoBadgeProps> = ({ label, value, color }) => (
  <div className="celestial-info-badge" style={color ? { borderColor: color } : undefined}>
    <span className="celestial-info-badge__label">{label}</span>
    <span className="celestial-info-badge__value" style={color ? { color } : undefined}>
      {value}
    </span>
  </div>
);

export default ExpandableCelestialCard;
