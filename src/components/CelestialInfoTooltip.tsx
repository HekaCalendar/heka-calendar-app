/**
 * Celestial Info Tooltip Component
 * Provides educational information about celestial events on hover
 */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSeasonalEventInfo, getChineseZodiac, type CelestialEventInfo, type ZodiacInfo } from '../services/celestialInfoService';

interface CelestialInfoTooltipProps {
  eventName: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const CelestialInfoTooltip: React.FC<CelestialInfoTooltipProps> = ({
  eventName,
  children,
  position = 'top'
}) => {
  const { t } = useTranslation('celestial');
  const [isVisible, setIsVisible] = useState(false);
  const [info, setInfo] = useState<CelestialEventInfo | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const eventInfo = getSeasonalEventInfo(eventName);
    if (eventInfo) {
      setInfo(eventInfo);
    }
  }, [eventName]);

  // Don't render if no info available
  if (!info) return <>{children}</>;

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(true), 300);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsVisible(false), 100);
  };

  const positionStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-8px)' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(8px)' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-8px)' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(8px)' },
  };

  return (
    <div 
      className="celestial-tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <span className="celestial-tooltip-trigger">ⓘ</span>
      
      {isVisible && (
        <div 
          className={`celestial-tooltip celestial-tooltip--${position}`}
          style={positionStyles[position]}
        >
          <div className="celestial-tooltip__header">
            <span className="celestial-tooltip__symbol">{info?.symbol || '?'}</span>
            <span className="celestial-tooltip__title">{info.name}</span>
          </div>
          
          <div className="celestial-tooltip__section">
            <h4>{t('whatIsIt')}</h4>
            <p>{info.description}</p>
          </div>
          
          <div className="celestial-tooltip__section">
            <h4>{t('significance')}</h4>
            <p>{info.significance}</p>
          </div>
          
          <div className="celestial-tooltip__section">
            <h4>{t('howToObserve')}</h4>
            <p>{info.observance}</p>
          </div>
          
          {info.traditions.length > 0 && (
            <div className="celestial-tooltip__section">
              <h4>{t('traditions')}</h4>
              <ul>
                {info.traditions.slice(0, 3).map((tradition, i) => (
                  <li key={i}>{tradition}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Zodiac Card Component
interface ZodiacCardProps {
  zodiac: ZodiacInfo;
}

export const ZodiacCard: React.FC<ZodiacCardProps> = ({ zodiac }) => {
  const { t } = useTranslation('celestial');
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="zodiac-card">
      <div className="zodiac-card__header" onClick={() => setShowDetails(!showDetails)}>
        <span className="zodiac-card__symbol">{zodiac?.symbol || '?'}</span>
        <div className="zodiac-card__info">
          <span className="zodiac-card__sign">{zodiac.sign}</span>
          <span className="zodiac-card__dates">{zodiac.dates}</span>
        </div>
        <div className="zodiac-card__meta">
          <span className={`zodiac-card__element zodiac-card__element--${zodiac.element.toLowerCase()}`}>
            {zodiac.element}
          </span>
          <span className="zodiac-card__ruler">♦ {zodiac.rulingPlanet}</span>
        </div>
      </div>
      
      {showDetails && (
        <div className="zodiac-card__details">
          <p className="zodiac-card__description">{zodiac.description}</p>
          <div className="zodiac-card__traits">
            <span className="zodiac-card__label">{t('traits')}:</span>
            {zodiac.traits.map((trait, i) => (
              <span key={i} className="zodiac-card__trait">{trait}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Chinese Zodiac Card Component
interface ChineseZodiacCardProps {
  year?: number;
}

export const ChineseZodiacCard: React.FC<ChineseZodiacCardProps> = ({ year = new Date().getFullYear() }) => {
  const { t } = useTranslation('celestial');
  const [showDetails, setShowDetails] = useState(false);
  const zodiac = getChineseZodiac(year);

  return (
    <div className="chinese-zodiac-card">
      <div className="chinese-zodiac-card__header" onClick={() => setShowDetails(!showDetails)}>
        <span className="chinese-zodiac-card__animal">{zodiac.animal}</span>
        <span className="chinese-zodiac-card__year">{t('yearOfThe')} {zodiac.animal}</span>
        <div className="chinese-zodiac-card__meta">
          <span className="chinese-zodiac-card__element">{zodiac.element}</span>
          <span className="chinese-zodiac-card__yinyang">{zodiac.yinYang}</span>
        </div>
      </div>
      
      {showDetails && (
        <div className="chinese-zodiac-card__details">
          <p className="chinese-zodiac-card__description">{zodiac.description}</p>
          <div className="chinese-zodiac-card__characteristics">
            <strong>{t('characteristics')}:</strong> {zodiac.characteristics.join(', ')}
          </div>
          <div className="chinese-zodiac-card__lucky">
            <span>{t('luckyNumbers')}: {zodiac.luckyNumbers.join(', ')}</span>
            <span>{t('luckyColors')}: {zodiac.luckyColors.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CelestialInfoTooltip;
