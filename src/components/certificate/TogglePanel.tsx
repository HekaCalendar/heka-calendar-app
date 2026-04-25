/**
 * Toggle Panel
 * Allows users to turn certificate fields on/off per template
 * Locked fields (theme-specific) are shown but disabled
 */

import React from 'react';
import type { CertificateOptions, TemplateId } from './certificateData';
import { getTemplateMeta, OPTION_LABELS, type TemplateLocks } from './certificateData';

interface Props {
  options: CertificateOptions;
  templateId: TemplateId;
  onChange: (options: CertificateOptions) => void;
}

export const TogglePanel: React.FC<Props> = ({ options, templateId, onChange }) => {
  const meta = getTemplateMeta(templateId);
  const locks: TemplateLocks = meta.lockedOptions;

  const toggle = (key: keyof CertificateOptions) => {
    if (locks[key]) return; // locked
    onChange({ ...options, [key]: !options[key] });
  };

  const optionKeys = Object.keys(OPTION_LABELS) as (keyof CertificateOptions)[];

  return (
    <div className="cert-fade-in" style={{
      width: '100%',
      maxWidth: 400,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: 20,
      marginTop: 16,
    }}>
      <div style={{
        fontFamily: "'Cinzel', serif",
        fontSize: 12,
        color: '#d4af37',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        Customize Display
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {optionKeys.map(key => {
          const isLocked = locks[key] === true;
          const isOn = options[key];
          const label = OPTION_LABELS[key];

          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              disabled={isLocked}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
                background: isOn ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                cursor: isLocked ? 'default' : 'pointer',
                opacity: isLocked ? 0.6 : 1,
                transition: 'all 0.2s ease',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#e0e0e0' }}>
                <span style={{ fontSize: 16 }}>{label.icon}</span>
                {label.label}
                {isLocked && <span style={{ fontSize: 10, color: '#d4af37', marginLeft: 4 }}>✦</span>}
              </span>
              <div style={{
                width: 36,
                height: 20,
                borderRadius: 10,
                background: isOn ? '#d4af37' : 'rgba(255,255,255,0.1)',
                position: 'relative',
                transition: 'background 0.2s ease',
                flexShrink: 0,
              }}>
                <div style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 2,
                  left: isOn ? 18 : 2,
                  transition: 'left 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }} />
              </div>
            </button>
          );
        })}
      </div>

      {Object.keys(locks).length > 0 && (
        <div style={{ fontSize: 11, color: '#71717a', marginTop: 12, textAlign: 'center' }}>
          ✦ = Required by this theme
        </div>
      )}
    </div>
  );
};

export default TogglePanel;
