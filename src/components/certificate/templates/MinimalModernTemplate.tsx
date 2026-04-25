/**
 * Minimal Modern Template
 * Clean lines, generous white space, modern sans-serif
 * DEFAULT: plain — name, date, location only
 */

import React from 'react';
import type { CertificateData, CertificateOptions } from '../certificateData';
import { formatHekaDate } from '../certificateData';

interface Props {
  data: CertificateData;
  options: CertificateOptions;
}

export const MinimalModernTemplate: React.FC<Props> = ({ data, options }) => {
  const hekaFormatted = formatHekaDate(data.hekaDate);
  const showHeka = options.showHekaDate && hekaFormatted && hekaFormatted !== data.civilDateFormatted;

  return (
    <div style={{ width: 850, height: 1200, background: '#f5f5f0', position: 'relative', overflow: 'hidden', fontFamily: "'Space Grotesk', 'Inter', sans-serif", color: '#1a1a2e', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: '#1a1a2e' }} />
      <div style={{ position: 'absolute', left: 70, top: 100, bottom: 100, width: 1, background: 'rgba(26,26,46,0.08)' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '100px 90px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(26,26,46,0.35)', textTransform: 'uppercase', marginBottom: 80 }}>Birth Certificate</div>

        <div style={{ fontSize: 56, fontWeight: 700, color: '#1a1a2e', lineHeight: 1.05, marginBottom: 16, letterSpacing: -1 }}>{data.name}</div>
        <div style={{ width: 40, height: 3, background: '#1a1a2e', marginBottom: 60 }} />

        <div style={{ marginBottom: 60 }}>
          <div style={{ fontSize: 15, color: '#1a1a2e', marginBottom: 4, fontWeight: 500 }}>{data.civilDateFormatted}</div>
          {options.showTime && <div style={{ fontSize: 13, color: 'rgba(26,26,46,0.45)' }}>{data.birthTime}</div>}
          {options.showLocation && <div style={{ fontSize: 13, color: 'rgba(26,26,46,0.45)' }}>{data.locationName}</div>}
          {options.showCoordinates && <div style={{ fontSize: 11, color: 'rgba(26,26,46,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>{data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</div>}
          {showHeka && <div style={{ fontSize: 11, color: 'rgba(26,26,46,0.3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>HEKA Date: {hekaFormatted}</div>}
        </div>

        {options.showAstrology && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginBottom: 50 }}>
            {[{ label: 'Sun', sym: data.sunSignSymbol, sign: data.sunSign, deg: data.sunDegree }, { label: 'Moon', sym: data.moonSignSymbol, sign: data.moonSign, deg: data.moonDegree }, { label: 'Rising', sym: data.risingSignSymbol, sign: data.risingSign, deg: data.risingDegree }].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(26,26,46,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{item.sym}</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a2e', marginBottom: 2 }}>{item.sign}</div>
                <div style={{ fontSize: 11, color: 'rgba(26,26,46,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>{item.deg}</div>
              </div>
            ))}
          </div>
        )}

        {options.showMoonPhase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <span style={{ fontSize: 24 }}>{data.moonPhaseEmoji}</span>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(26,26,46,0.3)', textTransform: 'uppercase' }}>Moon Phase</div>
              <div style={{ fontSize: 14, color: '#1a1a2e', fontWeight: 500 }}>{data.moonPhase} · {data.moonIllumination}%</div>
            </div>
          </div>
        )}

        {options.showNakshatra && data.nakshatra && (
          <div style={{ fontSize: 11, color: 'rgba(26,26,46,0.3)', marginBottom: 30 }}>Nakshatra: <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{data.nakshatra}</span></div>
        )}

        {options.showChineseZodiac && data.chineseZodiacAnimal && (
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(26,26,46,0.3)', textTransform: 'uppercase', marginBottom: 6 }}>Chinese Zodiac</div>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{data.chineseZodiacEmoji}</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Year of the {data.chineseZodiacAnimal}</div>
          </div>
        )}

        {options.showElementalBalance && data.elementalBalance && (
          <div style={{ display: 'flex', gap: 16, marginBottom: 20, fontSize: 12 }}>
            <span>🔥 {data.elementalBalance.fire}</span>
            <span>🌍 {data.elementalBalance.earth}</span>
            <span>💨 {data.elementalBalance.air}</span>
            <span>💧 {data.elementalBalance.water}</span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(26,26,46,0.25)', textTransform: 'uppercase' }}>HEKA Calendar Pro</div>
            <div style={{ fontSize: 9, color: 'rgba(26,26,46,0.2)', marginTop: 4 }}>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div style={{ fontSize: 24, opacity: 0.1 }}>✦</div>
        </div>
      </div>
    </div>
  );
};

export default MinimalModernTemplate;
