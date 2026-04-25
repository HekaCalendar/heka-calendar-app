/**
 * Art Deco Template
 * Geometric sunburst patterns, gold/black high contrast, stepped borders
 */

import React from 'react';
import type { CertificateData, CertificateOptions } from '../certificateData';
import { formatHekaDate } from '../certificateData';

interface Props {
  data: CertificateData;
  options: CertificateOptions;
}

export const ArtDecoTemplate: React.FC<Props> = ({ data, options }) => {
  const hekaFormatted = formatHekaDate(data.hekaDate);
  const showHeka = options.showHekaDate && hekaFormatted && hekaFormatted !== data.civilDateFormatted;

  return (
    <div style={{ width: 850, height: 1200, background: 'linear-gradient(160deg, #0a0a0a 0%, #121212 50%, #0d0d0d 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Syncopate', 'Cinzel', sans-serif", color: '#f4d03f', boxSizing: 'border-box' }}>
      <svg style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', opacity: 0.06, width: 800, height: 400 }} viewBox="0 0 800 400">
        {[0,15,30,45,60,75,90,105,120,135,150,165,180].map((a, i) => (
          <line key={i} x1="400" y1="400" x2={400 + 400 * Math.cos((a - 90) * Math.PI / 180)} y2={400 + 400 * Math.sin((a - 90) * Math.PI / 180)} stroke="#f4d03f" strokeWidth="2" />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: 20, border: '3px solid #f4d03f', opacity: 0.25 }} />
      <div style={{ position: 'absolute', inset: 28, border: '1px solid #f4d03f', opacity: 0.15 }} />
      <div style={{ position: 'absolute', inset: 36, border: '1px solid #f4d03f', opacity: 0.08 }} />
      {[[32,32],[818,32],[32,1168],[818,1168]].map(([x,y],i) => (
        <div key={i} style={{ position: 'absolute', left: x-10, top: y-10, width: 20, height: 20, border: '2px solid rgba(244,208,63,0.3)', transform: `rotate(${i * 90}deg)` }} />
      ))}
      <div style={{ position: 'absolute', top: 180, left: 80, right: 80, height: 2, background: 'linear-gradient(90deg, transparent, rgba(244,208,63,0.3), transparent)' }} />
      <div style={{ position: 'absolute', bottom: 180, left: 80, right: 80, height: 2, background: 'linear-gradient(90deg, transparent, rgba(244,208,63,0.3), transparent)' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '100px 85px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 10, letterSpacing: 6, color: 'rgba(244,208,63,0.5)', textTransform: 'uppercase', marginBottom: 8 }}>Birth Certificate</div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.15)', marginBottom: 50, fontFamily: "'Inter', sans-serif" }}>Art Deco Collection</div>

        <div style={{ fontSize: 44, fontWeight: 700, color: '#f4d03f', textAlign: 'center', lineHeight: 1.15, marginBottom: 12, textShadow: '0 2px 10px rgba(244,208,63,0.1)', letterSpacing: 2 }}>{data.name}</div>
        <div style={{ width: 80, height: 3, background: '#f4d03f', opacity: 0.3, marginBottom: 40 }} />

        <div style={{ textAlign: 'center', marginBottom: 45 }}>
          <div style={{ fontSize: 14, color: '#e8e8e0', fontFamily: "'Inter', sans-serif", marginBottom: 6, letterSpacing: 0.5 }}>{data.civilDateFormatted}</div>
          {options.showTime && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>{data.birthTime}</div>}
          {options.showLocation && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>{data.locationName}</div>}
          {options.showCoordinates && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>{data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</div>}
          {showHeka && <div style={{ fontSize: 10, color: 'rgba(244,208,63,0.3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8, letterSpacing: 1 }}>HEKA {hekaFormatted}</div>}
        </div>

        {options.showAstrology && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, width: '100%', marginBottom: 45 }}>
            {[{ sym: data.sunSignSymbol, label: 'SUN', sign: data.sunSign, deg: data.sunDegree }, { sym: data.moonSignSymbol, label: 'MOON', sign: data.moonSign, deg: data.moonDegree }, { sym: data.risingSignSymbol, label: 'RISE', sign: data.risingSign, deg: data.risingDegree }].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: 2, background: 'linear-gradient(180deg, transparent, rgba(244,208,63,0.15), transparent)', margin: '0 35px' }} />}
                <div style={{ textAlign: 'center', padding: '0 5px' }}>
                  <div style={{ fontSize: 30, marginBottom: 6, color: '#f4d03f' }}>{item.sym}</div>
                  <div style={{ fontSize: 9, color: 'rgba(244,208,63,0.4)', letterSpacing: 4, marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 18, color: '#f4d03f', fontWeight: 700, letterSpacing: 1 }}>{item.sign}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>{item.deg}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {options.showMoonPhase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 35, border: '2px solid rgba(244,208,63,0.15)', padding: '16px 36px' }}>
            <span style={{ fontSize: 30 }}>{data.moonPhaseEmoji}</span>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(244,208,63,0.4)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Moon Phase</div>
              <div style={{ fontSize: 15, color: '#f4d03f', fontWeight: 600 }}>{data.moonPhase}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{data.moonIllumination}% illuminated</div>
            </div>
          </div>
        )}

        {options.showNakshatra && data.nakshatra && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 25, textAlign: 'center', letterSpacing: 2 }}>NAKSHATRA <span style={{ color: '#f4d03f' }}>{data.nakshatra}</span></div>
        )}

        {options.showChineseZodiac && data.chineseZodiacAnimal && (
          <div style={{ textAlign: 'center', marginBottom: 25 }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{data.chineseZodiacEmoji}</div>
            <div style={{ fontSize: 14, color: '#f4d03f', fontWeight: 600 }}>Year of the {data.chineseZodiacAnimal}</div>
          </div>
        )}

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 30, height: 2, background: 'rgba(244,208,63,0.2)' }} />
            <div style={{ width: 6, height: 6, background: '#f4d03f', opacity: 0.3, transform: 'rotate(45deg)' }} />
            <div style={{ width: 30, height: 2, background: 'rgba(244,208,63,0.2)' }} />
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: 3 }}>HEKA CALENDAR PRO</div>
        </div>
      </div>
    </div>
  );
};

export default ArtDecoTemplate;
