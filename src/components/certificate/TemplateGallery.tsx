/**
 * Template Gallery
 * Grid of template thumbnails for selection
 */

import React from 'react';
import { CERTIFICATE_TEMPLATES, type TemplateId } from './certificateData';

interface Props {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
}

export const TemplateGallery: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="cert-gallery cert-fade-in">
      {CERTIFICATE_TEMPLATES.map(template => (
        <div
          key={template.id}
          className={`cert-gallery-card ${selected === template.id ? 'is-selected' : ''}`}
          onClick={() => onSelect(template.id)}
        >
          <div
            className="cert-gallery-card-thumb"
            style={{ background: template.thumbnailGradient }}
          >
            <span className="cert-gallery-card-icon" style={{ color: template.accentColor }}>
              {getTemplateEmoji(template.id)}
            </span>
            {selected === template.id && (
              <div style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#d4af37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
              }}>
                ✓
              </div>
            )}
          </div>
          <div className="cert-gallery-card-info">
            <div className="cert-gallery-card-name">{template.name}</div>
            <div className="cert-gallery-card-desc">{template.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

function getTemplateEmoji(id: TemplateId): string {
  const map: Record<TemplateId, string> = {
    'celestial-gold': '✦',
    'sacred-geometry': '⬡',
    'minimal-modern': '▢',
    'ancient-parchment': '📜',
    'cosmic-nebula': '🌌',
    'art-deco': '◆',
    'nakshatra-vedic': '☸',
    'chinese-zodiac': '🐉',
    'moon-phase': '🌙',
  };
  return map[id] || '✦';
}

export default TemplateGallery;
