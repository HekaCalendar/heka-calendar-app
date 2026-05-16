/**
 * Certificate Preview
 * Full-size certificate renderer with astrological data sidebar + toggle panel
 */

import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CertificateData, CertificateOptions, TemplateId } from './certificateData';
import { getEffectiveOptions } from './certificateData';
import { CelestialGoldTemplate } from './templates/CelestialGoldTemplate';
import { SacredGeometryTemplate } from './templates/SacredGeometryTemplate';
import { MinimalModernTemplate } from './templates/MinimalModernTemplate';
import { AncientParchmentTemplate } from './templates/AncientParchmentTemplate';
import { CosmicNebulaTemplate } from './templates/CosmicNebulaTemplate';
import { ArtDecoTemplate } from './templates/ArtDecoTemplate';
import { NakshatraVedicTemplate } from './templates/NakshatraVedicTemplate';
import { ChineseZodiacTemplate } from './templates/ChineseZodiacTemplate';
import { MoonPhaseTemplate } from './templates/MoonPhaseTemplate';
import { TogglePanel } from './TogglePanel';

interface Props {
  data: CertificateData;
  templateId: TemplateId;
  options: CertificateOptions;
  onOptionsChange: (options: CertificateOptions) => void;
}

const TEMPLATE_MAP: Record<TemplateId, React.FC<{ data: CertificateData; options: CertificateOptions }>> = {
  'celestial-gold': CelestialGoldTemplate,
  'sacred-geometry': SacredGeometryTemplate,
  'minimal-modern': MinimalModernTemplate,
  'ancient-parchment': AncientParchmentTemplate,
  'cosmic-nebula': CosmicNebulaTemplate,
  'art-deco': ArtDecoTemplate,
  'nakshatra-vedic': NakshatraVedicTemplate,
  'chinese-zodiac': ChineseZodiacTemplate,
  'moon-phase': MoonPhaseTemplate,
};

export const CertificatePreview: React.FC<Props> = ({ data, templateId, options, onOptionsChange }) => {
  const { t } = useTranslation('certificate');
  const certRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const TemplateComponent = TEMPLATE_MAP[templateId] || CelestialGoldTemplate;
  const effectiveOptions = getEffectiveOptions(templateId, options);

  useEffect(() => {
    const calculateScale = () => {
      if (!certRef.current) return;
      const container = certRef.current.parentElement;
      if (!container) return;
      const containerWidth = container.clientWidth - 40;
      const certWidth = 850;
      const newScale = Math.min(1, containerWidth / certWidth);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div className="cert-preview-area cert-fade-in">
      <div className="cert-preview-frame">
        <div
          ref={certRef}
          className="cert-preview-scaler"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
        >
          <TemplateComponent data={data} options={effectiveOptions} />
        </div>
      </div>

      {/* Astrological data sidebar */}
      <div className="cert-preview-data">
        <div className="cert-preview-data-title">{t('celestialData')}</div>

        <div className="cert-preview-data-row">
          <span className="cert-preview-data-label">{t('sun')}</span>
          <span className="cert-preview-data-value">
            {data.sunSignSymbol} {data.sunSign} <span style={{ color: '#71717a' }}>{data.sunDegree}</span>
          </span>
        </div>

        <div className="cert-preview-data-row">
          <span className="cert-preview-data-label">{t('moon')}</span>
          <span className="cert-preview-data-value">
            {data.moonSignSymbol} {data.moonSign} <span style={{ color: '#71717a' }}>{data.moonDegree}</span>
          </span>
        </div>

        <div className="cert-preview-data-row">
          <span className="cert-preview-data-label">{t('rising')}</span>
          <span className="cert-preview-data-value">
            {data.risingSignSymbol} {data.risingSign} <span style={{ color: '#71717a' }}>{data.risingDegree}</span>
          </span>
        </div>

        <div className="cert-preview-data-row">
          <span className="cert-preview-data-label">{t('moonPhase')}</span>
          <span className="cert-preview-data-value">
            {data.moonPhaseEmoji} {data.moonPhase} ({data.moonIllumination}%)
          </span>
        </div>

        {data.nakshatra && (
          <div className="cert-preview-data-row">
            <span className="cert-preview-data-label">{t('nakshatra')}</span>
            <span className="cert-preview-data-value">
              {data.nakshatraSymbol} {data.nakshatra}
            </span>
          </div>
        )}

        {data.hekaDate && (
          <div className="cert-preview-data-row">
            <span className="cert-preview-data-label">{t('hekaDate')}</span>
            <span className="cert-preview-data-value" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              {data.hekaDate}
            </span>
          </div>
        )}

        {data.chineseZodiacAnimal && (
          <div className="cert-preview-data-row">
            <span className="cert-preview-data-label">{t('chineseZodiac')}</span>
            <span className="cert-preview-data-value">
              {data.chineseZodiacEmoji} {data.chineseZodiacAnimal} ({data.chineseZodiacElement})
            </span>
          </div>
        )}

        {data.elementalBalance && (
          <div className="cert-preview-data-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <span className="cert-preview-data-label">{t('elementalBalance')}</span>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              <span style={{ color: '#ef4444' }}>🔥 {data.elementalBalance.fire}</span>
              <span style={{ color: '#22c55e' }}>🌍 {data.elementalBalance.earth}</span>
              <span style={{ color: '#3b82f6' }}>💨 {data.elementalBalance.air}</span>
              <span style={{ color: '#06b6d4' }}>💧 {data.elementalBalance.water}</span>
            </div>
          </div>
        )}
      </div>

      {/* Toggle panel */}
      <TogglePanel options={options} templateId={templateId} onChange={onOptionsChange} />
    </div>
  );
};

export default CertificatePreview;
