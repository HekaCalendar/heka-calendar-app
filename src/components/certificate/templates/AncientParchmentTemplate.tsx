/**
 * Ancient Parchment Template
 * Aged cream tones, calligraphic feel, decorative corner ornaments
 */

import React from 'react';
import type { CertificateData, CertificateOptions } from '../certificateData';
import { formatHekaDate } from '../certificateData';
import i18n from '../../../i18n';

interface Props {
  data: CertificateData;
  options: CertificateOptions;
}

export const AncientParchmentTemplate: React.FC<Props> = ({ data, options }) => {
  const hekaFormatted = formatHekaDate(data.hekaDate);
  const showHeka = options.showHekaDate && hekaFormatted && hekaFormatted !== data.civilDateFormatted;

  return (
    <div style={{ width: 850, height: 1200, background: 'linear-gradient(160deg, #e8dcc8 0%, #ddd0b8 30%, #d4c4a8 60%, #cbb898 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Cormorant Garamond', 'Georgia', serif", color: '#3d2b1f', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #3d2b1f 2px, #3d2b1f 3px)' }} />
      <div style={{ position: 'absolute', inset: 28, border: '3px double rgba(139,69,19,0.3)', borderRadius: 2 }} />
      <div style={{ position: 'absolute', inset: 36, border: '1px solid rgba(139,69,19,0.12)' }} />
      {[[28,28],[822,28],[28,1172],[822,1172]].map(([x,y],i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: y, width: 40, height: 40,
          border: i % 2 === 0 ? '2px solid rgba(139,69,19,0.25)' : '2px solid rgba(139,69,19,0.25)',
          borderRadius: i < 2 ? (i === 0 ? '0 0 20px 0' : '0 0 0 20px') : (i === 2 ? '0 20px 0 0' : '20px 0 0 0'),
          borderLeft: i % 2 === 1 ? 'none' : undefined, borderRight: i % 2 === 0 ? 'none' : undefined,
          borderTop: i > 1 ? 'none' : undefined, borderBottom: i < 2 ? 'none' : undefined,
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 2, padding: '100px 85px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px double rgba(139,69,19,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 24 }}>✦</span>
        </div>
        <div style={{ fontSize: 12, letterSpacing: 4, color: 'rgba(139,69,19,0.5)', textTransform: 'uppercase', marginBottom: 8, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>Certificate of Birth</div>
        <div style={{ fontSize: 11, color: 'rgba(139,69,19,0.35)', marginBottom: 50, fontStyle: 'italic' }}>Recorded in the Celestial Archives</div>

        <div style={{ fontSize: 54, fontWeight: 700, color: '#3d2b1f', textAlign: 'center', lineHeight: 1.1, marginBottom: 12, textShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>{data.name}</div>
        <div style={{ width: 100, height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,69,19,0.3), transparent)', marginBottom: 40 }} />

        <div style={{ textAlign: 'center', marginBottom: 45, fontSize: 16, color: '#3d2b1f', lineHeight: 1.6 }}>
          <div style={{ marginBottom: 4 }}>{data.civilDateFormatted}</div>
          {options.showTime && <div style={{ fontSize: 14, color: 'rgba(61,43,31,0.6)' }}>at {data.birthTime}</div>}
          {options.showLocation && <div style={{ fontSize: 14, color: 'rgba(61,43,31,0.6)' }}>{data.locationName}</div>}
          {options.showCoordinates && <div style={{ fontSize: 12, color: 'rgba(139,69,19,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>{data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</div>}
          {showHeka && <div style={{ fontSize: 12, color: 'rgba(139,69,19,0.45)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>HEKA Date: {hekaFormatted}</div>}
        </div>

        {options.showAstrology && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 50, marginBottom: 45, width: '100%' }}>
            {[{ sym: data.sunSignSymbol, label: 'Sun', sign: data.sunSign, deg: data.sunDegree }, { sym: data.moonSignSymbol, label: 'Moon', sign: data.moonSign, deg: data.moonDegree }, { sym: data.risingSignSymbol, label: 'Ascendant', sign: data.risingSign, deg: data.risingDegree }].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 6, color: 'rgba(139,69,19,0.6)' }}>{item.sym}</div>
                <div style={{ fontSize: 10, color: 'rgba(139,69,19,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#3d2b1f' }}>{item.sign}</div>
                <div style={{ fontSize: 11, color: 'rgba(139,69,19,0.45)', fontFamily: "'JetBrains Mono', monospace" }}>{item.deg}</div>
              </div>
            ))}
          </div>
        )}

        {options.showMoonPhase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 35, border: '1px solid rgba(139,69,19,0.15)', padding: '14px 28px', background: 'rgba(255,255,255,0.2)' }}>
            <span style={{ fontSize: 28 }}>{data.moonPhaseEmoji}</span>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(139,69,19,0.4)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>Moon Phase</div>
              <div style={{ fontSize: 15, color: '#3d2b1f', fontWeight: 600 }}>{data.moonPhase}</div>
              <div style={{ fontSize: 11, color: 'rgba(139,69,19,0.4)' }}>{data.moonIllumination}% illuminated</div>
            </div>
          </div>
        )}

        {options.showNakshatra && data.nakshatra && (
          <div style={{ fontSize: 12, color: 'rgba(139,69,19,0.4)', marginBottom: 25, textAlign: 'center', fontStyle: 'italic' }}>
            Lunar Mansion: <span style={{ color: '#3d2b1f', fontWeight: 600, fontStyle: 'normal' }}>{data.nakshatra}</span>
          </div>
        )}

        {options.showChineseZodiac && data.chineseZodiacAnimal && (
          <div style={{ textAlign: 'center', marginBottom: 25 }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{data.chineseZodiacEmoji}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Year of the {data.chineseZodiacAnimal}</div>
          </div>
        )}

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'rgba(139,69,19,0.3)', letterSpacing: 1.5, fontFamily: "'Inter', sans-serif" }}>SEALED BY HEKA CALENDAR PRO</div>
          <div style={{ fontSize: 9, color: 'rgba(139,69,19,0.2)', marginTop: 4 }}>
            {new Intl.DateTimeFormat(i18n.language || 'en', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AncientParchmentTemplate;
