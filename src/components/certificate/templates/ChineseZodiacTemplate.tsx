/**
 * Chinese Zodiac Template
 * Traditional red and gold palette, animal guardian focus, elemental essence
 * LOCKED: Chinese Zodiac always shown
 */

import React from 'react';
import type { CertificateData, CertificateOptions } from '../certificateData';
import { formatHekaDate } from '../certificateData';

interface Props {
  data: CertificateData;
  options: CertificateOptions;
}

export const ChineseZodiacTemplate: React.FC<Props> = ({ data, options }) => {
  const animal = data.chineseZodiacAnimal || 'Dragon';
  const element = data.chineseZodiacElement || 'Wood';
  const emoji = data.chineseZodiacEmoji || '🐉';
  const hekaFormatted = formatHekaDate(data.hekaDate);
  const showHeka = options.showHekaDate && hekaFormatted && hekaFormatted !== data.civilDateFormatted;

  return (
    <div style={{ width: 850, height: 1200, background: 'linear-gradient(160deg, #6b0000 0%, #8b0000 30%, #6b0000 60%, #4a0000 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Cinzel', 'Georgia', serif", color: '#f8f0d8', boxSizing: 'border-box' }}>
      <svg style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: 0.06, width: 850, height: 300 }} viewBox="0 0 850 300">
        {[...Array(8)].map((_, i) => (
          <ellipse key={i} cx={100 + i * 110} cy={50 + (i % 3) * 40} rx="60" ry="25" fill="none" stroke="#d4af37" strokeWidth="1.5" />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: 24, border: '3px double rgba(212,175,55,0.35)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', inset: 34, border: '1px solid rgba(212,175,55,0.12)' }} />
      {[[28,28],[822,28],[28,1172],[822,1172]].map(([x,y],i) => (
        <div key={i} style={{ position: 'absolute', left: x-8, top: y-8, width: 16, height: 16, border: '2px solid rgba(212,175,55,0.4)', transform: 'rotate(45deg)' }} />
      ))}

      <div style={{ position: 'relative', zIndex: 2, padding: '80px 75px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 11, letterSpacing: 5, color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>生辰八字 · Birth Record</div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.2)', marginBottom: 40, fontFamily: "'Inter', sans-serif" }}>Chinese Zodiac Collection</div>

        {/* Chinese Zodiac — LOCKED, always shown */}
        <div style={{ fontSize: 80, marginBottom: 8, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>{emoji}</div>
        <div style={{ fontSize: 14, color: '#d4af37', fontWeight: 600, marginBottom: 4, letterSpacing: 2 }}>Year of the {animal}</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>{element} Element</div>

        <div style={{ fontSize: 42, fontWeight: 700, color: '#f8f0d8', textAlign: 'center', lineHeight: 1.15, marginBottom: 8 }}>{data.name}</div>
        <div style={{ width: 100, height: 2, background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', marginBottom: 35 }} />

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 15, color: '#f8f0d8', fontFamily: "'Inter', sans-serif", marginBottom: 6 }}>{data.civilDateFormatted}</div>
          {options.showTime && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>{data.birthTime}</div>}
          {options.showLocation && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>{data.locationName}</div>}
          {options.showCoordinates && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>{data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</div>}
          {showHeka && <div style={{ fontSize: 11, color: 'rgba(212,175,55,0.35)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>HEKA {hekaFormatted}</div>}
        </div>

        {options.showAstrology && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, width: '100%', marginBottom: 40 }}>
            {[{ sym: data.sunSignSymbol, label: 'SUN', sign: data.sunSign, deg: data.sunDegree }, { sym: data.moonSignSymbol, label: 'MOON', sign: data.moonSign, deg: data.moonDegree }, { sym: data.risingSignSymbol, label: 'RISING', sign: data.risingSign, deg: data.risingDegree }].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: 1, background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.15), transparent)', margin: '0 30px' }} />}
                <div style={{ textAlign: 'center', padding: '0 10px' }}>
                  <div style={{ fontSize: 24, marginBottom: 4, color: '#d4af37' }}>{item.sym}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 16, color: '#f8f0d8', fontWeight: 600 }}>{item.sign}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>{item.deg}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {options.showMoonPhase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30, background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: 10, padding: '14px 28px' }}>
            <span style={{ fontSize: 28 }}>{data.moonPhaseEmoji}</span>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, textTransform: 'uppercase' }}>Moon Phase</div>
              <div style={{ fontSize: 14, color: '#d4af37' }}>{data.moonPhase} · {data.moonIllumination}%</div>
            </div>
          </div>
        )}

        {options.showNakshatra && data.nakshatra && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 20, textAlign: 'center' }}>Nakshatra: <span style={{ color: '#d4af37' }}>{data.nakshatra}</span></div>
        )}

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, color: '#d4af37', opacity: 0.3, marginBottom: 8 }}>福</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: 2 }}>HEKA CALENDAR PRO · {new Date().getFullYear()}</div>
        </div>
      </div>
    </div>
  );
};

export default ChineseZodiacTemplate;
