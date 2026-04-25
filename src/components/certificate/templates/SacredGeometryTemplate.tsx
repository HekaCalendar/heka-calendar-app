/**
 * Sacred Geometry Template
 * Flower of Life pattern, geometric borders, muted gold on charcoal
 */

import React from 'react';
import type { CertificateData, CertificateOptions } from '../certificateData';
import { formatHekaDate } from '../certificateData';

interface Props {
  data: CertificateData;
  options: CertificateOptions;
}

export const SacredGeometryTemplate: React.FC<Props> = ({ data, options }) => {
  const hekaFormatted = formatHekaDate(data.hekaDate);
  const showHeka = options.showHekaDate && hekaFormatted && hekaFormatted !== data.civilDateFormatted;

  return (
    <div style={{ width: 850, height: 1200, background: 'linear-gradient(150deg, #141428 0%, #1a1a2e 50%, #111122 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Orbitron', 'Inter', sans-serif", color: '#e8e8e0', boxSizing: 'border-box' }}>
      <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.035, width: 600, height: 600 }} viewBox="0 0 300 300">
        {[0,60,120,180,240,300].map((a) => (
          <circle key={a} cx={150 + 50 * Math.cos(a * Math.PI / 180)} cy={150 + 50 * Math.sin(a * Math.PI / 180)} r="50" fill="none" stroke="#c9a227" strokeWidth="0.8" />
        ))}
        <circle cx="150" cy="150" r="50" fill="none" stroke="#c9a227" strokeWidth="0.8" />
      </svg>
      <div style={{ position: 'absolute', inset: 30, border: '1px solid rgba(201,162,39,0.2)' }} />
      <div style={{ position: 'absolute', inset: 36, border: '1px solid rgba(201,162,39,0.08)' }} />
      {[[40,40],[810,40],[40,1160],[810,1160]].map(([x,y],i) => (
        <svg key={i} style={{ position: 'absolute', left: x-12, top: y-12, opacity: 0.3 }} width="24" height="24" viewBox="0 0 24 24">
          <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="none" stroke="#c9a227" strokeWidth="1" />
        </svg>
      ))}

      <div style={{ position: 'relative', zIndex: 2, padding: '90px 75px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" style={{ marginBottom: 16, opacity: 0.6 }}>
          <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="none" stroke="#c9a227" strokeWidth="1.5" />
        </svg>
        <div style={{ fontSize: 10, letterSpacing: 5, color: 'rgba(201,162,39,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>Certificate of Birth</div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.2)', marginBottom: 50, fontFamily: "'Inter', sans-serif" }}>Sacred Geometry Series</div>

        <div style={{ fontSize: 48, fontWeight: 700, color: '#c9a227', textAlign: 'center', lineHeight: 1.1, marginBottom: 8, fontFamily: "'Cinzel', serif" }}>{data.name}</div>
        <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, #c9a227, transparent)', marginBottom: 40, opacity: 0.5 }} />

        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{ fontSize: 14, color: '#e8e8e0', fontFamily: "'Inter', sans-serif", marginBottom: 6, letterSpacing: 0.5 }}>{data.civilDateFormatted}</div>
          {options.showTime && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif", letterSpacing: 0.5 }}>{data.birthTime}</div>}
          {options.showLocation && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>{data.locationName}</div>}
          {options.showCoordinates && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>{data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</div>}
          {showHeka && <div style={{ fontSize: 10, color: 'rgba(201,162,39,0.4)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8, letterSpacing: 1 }}>HEKA {hekaFormatted}</div>}
        </div>

        {options.showAstrology && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, width: '100%', marginBottom: 50 }}>
            {[{ sym: data.sunSignSymbol, label: 'SUN', sign: data.sunSign, deg: data.sunDegree }, { sym: data.moonSignSymbol, label: 'MOON', sign: data.moonSign, deg: data.moonDegree }, { sym: data.risingSignSymbol, label: 'ASC', sign: data.risingSign, deg: data.risingDegree }].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: 1, background: 'linear-gradient(180deg, transparent, rgba(201,162,39,0.2), transparent)', margin: '0 30px' }} />}
                <div style={{ textAlign: 'center', padding: '0 10px' }}>
                  <div style={{ fontSize: 26, marginBottom: 6 }}>{item.sym}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 16, color: '#c9a227', fontWeight: 600, fontFamily: "'Cinzel', serif" }}>{item.sign}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>{item.deg}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {options.showMoonPhase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40, border: '1px solid rgba(201,162,39,0.12)', padding: '18px 36px', borderRadius: 0 }}>
            <span style={{ fontSize: 28 }}>{data.moonPhaseEmoji}</span>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Lunar Phase</div>
              <div style={{ fontSize: 14, color: '#c9a227', fontWeight: 600 }}>{data.moonPhase}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{data.moonIllumination}% illumination</div>
            </div>
          </div>
        )}

        {options.showNakshatra && data.nakshatra && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 30, textAlign: 'center', letterSpacing: 1 }}>NAKSHATRA: <span style={{ color: '#c9a227' }}>{data.nakshatra}</span></div>
        )}

        {options.showChineseZodiac && data.chineseZodiacAnimal && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Chinese Zodiac</div>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{data.chineseZodiacEmoji}</div>
            <div style={{ fontSize: 14, color: '#c9a227', fontWeight: 600 }}>Year of the {data.chineseZodiacAnimal}</div>
          </div>
        )}

        {options.showElementalBalance && data.elementalBalance && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20, fontSize: 11 }}>
            <span style={{ color: '#ef4444' }}>🔥 {data.elementalBalance.fire}</span>
            <span style={{ color: '#22c55e' }}>🌍 {data.elementalBalance.earth}</span>
            <span style={{ color: '#3b82f6' }}>💨 {data.elementalBalance.air}</span>
            <span style={{ color: '#06b6d4' }}>💧 {data.elementalBalance.water}</span>
          </div>
        )}

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center' }}>
          <svg width="40" height="8" viewBox="0 0 40 8" style={{ marginBottom: 16, opacity: 0.3 }}>
            <line x1="0" y1="4" x2="16" y2="4" stroke="#c9a227" strokeWidth="0.5" />
            <polygon points="20,1 24,4 20,7 16,4" fill="#c9a227" />
            <line x1="24" y1="4" x2="40" y2="4" stroke="#c9a227" strokeWidth="0.5" />
          </svg>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: 3 }}>HEKA CALENDAR PRO · {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
};

export default SacredGeometryTemplate;
