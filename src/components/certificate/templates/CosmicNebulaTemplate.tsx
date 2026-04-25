/**
 * Cosmic Nebula Template
 * Deep space aurora background, constellation dot patterns, ethereal glow
 */

import React from 'react';
import type { CertificateData, CertificateOptions } from '../certificateData';
import { formatHekaDate } from '../certificateData';

interface Props {
  data: CertificateData;
  options: CertificateOptions;
}

export const CosmicNebulaTemplate: React.FC<Props> = ({ data, options }) => {
  const dots = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      arr.push({ x: Math.random() * 850, y: Math.random() * 1200, r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.3 + 0.1 });
    }
    return arr;
  }, []);

  const hekaFormatted = formatHekaDate(data.hekaDate);
  const showHeka = options.showHekaDate && hekaFormatted && hekaFormatted !== data.civilDateFormatted;

  return (
    <div style={{ width: 850, height: 1200, background: 'linear-gradient(160deg, #080818 0%, #0d0d2e 30%, #120a2e 60%, #080818 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Rajdhani', 'Inter', sans-serif", color: '#e0e0f0', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', top: -200, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(147,51,234,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: -200, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      {dots.map((dot, i) => (
        <div key={i} style={{ position: 'absolute', left: dot.x, top: dot.y, width: dot.r * 2, height: dot.r * 2, borderRadius: '50%', background: '#fff', opacity: dot.o }} />
      ))}
      <div style={{ position: 'absolute', inset: 28, border: '1px solid rgba(167,139,250,0.12)', borderRadius: 4 }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '90px 75px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: 'rgba(167,139,250,0.5)', textTransform: 'uppercase', marginBottom: 6 }}>Celestial Birth Record</div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,0.15)', marginBottom: 50, fontFamily: "'Inter', sans-serif" }}>Coordinates Verified</div>

        <div style={{ fontSize: 50, fontWeight: 700, color: '#e0e0f0', textAlign: 'center', lineHeight: 1.1, marginBottom: 8, textShadow: '0 0 40px rgba(167,139,250,0.15)' }}>{data.name}</div>
        <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)', marginBottom: 40 }} />

        <div style={{ textAlign: 'center', marginBottom: 45 }}>
          <div style={{ fontSize: 15, color: '#e0e0f0', fontFamily: "'Inter', sans-serif", marginBottom: 6 }}>{data.civilDateFormatted}</div>
          {options.showTime && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: "'Rajdhani', sans-serif", letterSpacing: 0.5 }}>{data.birthTime}</div>}
          {options.showLocation && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{data.locationName}</div>}
          {options.showCoordinates && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>{data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</div>}
          {showHeka && <div style={{ fontSize: 11, color: 'rgba(167,139,250,0.4)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8, letterSpacing: 1 }}>HEKA {hekaFormatted}</div>}
        </div>

        {options.showAstrology && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 35, width: '100%', marginBottom: 45 }}>
            {[{ label: 'SUN', sym: data.sunSignSymbol, sign: data.sunSign, deg: data.sunDegree }, { label: 'MOON', sym: data.moonSignSymbol, sign: data.moonSign, deg: data.moonDegree }, { label: 'RISING', sym: data.risingSignSymbol, sign: data.risingSign, deg: data.risingDegree }].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '18px 10px', background: 'linear-gradient(180deg, rgba(167,139,250,0.06), rgba(167,139,250,0.02))', border: '1px solid rgba(167,139,250,0.08)', borderRadius: 8 }}>
                <div style={{ fontSize: 9, color: 'rgba(167,139,250,0.5)', letterSpacing: 3, marginBottom: 8 }}>{item.label}</div>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{item.sym}</div>
                <div style={{ fontSize: 17, color: '#e0e0f0', fontWeight: 600 }}>{item.sign}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>{item.deg}</div>
              </div>
            ))}
          </div>
        )}

        {options.showMoonPhase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 35, background: 'linear-gradient(135deg, rgba(167,139,250,0.08), rgba(59,130,246,0.04))', border: '1px solid rgba(167,139,250,0.1)', borderRadius: 12, padding: '16px 32px' }}>
            <span style={{ fontSize: 32, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}>{data.moonPhaseEmoji}</span>
            <div>
              <div style={{ fontSize: 9, color: 'rgba(167,139,250,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Lunar Phase at Birth</div>
              <div style={{ fontSize: 15, color: '#e0e0f0', fontWeight: 600 }}>{data.moonPhase}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{data.moonIllumination}% illumination</div>
            </div>
          </div>
        )}

        {options.showNakshatra && data.nakshatra && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 25, textAlign: 'center', letterSpacing: 1 }}>NAKSHATRA: <span style={{ color: '#a78bfa' }}>{data.nakshatra}</span></div>
        )}

        {options.showChineseZodiac && data.chineseZodiacAnimal && (
          <div style={{ textAlign: 'center', marginBottom: 25 }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{data.chineseZodiacEmoji}</div>
            <div style={{ fontSize: 14, color: '#e0e0f0', fontWeight: 600 }}>Year of the {data.chineseZodiacAnimal}</div>
          </div>
        )}

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.2), transparent)', margin: '0 auto 12px' }} />
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: 3 }}>HEKA CALENDAR PRO · ASTROLOGICAL DATA VIA SWISS EPHEMERIS</div>
        </div>
      </div>
    </div>
  );
};

export default CosmicNebulaTemplate;
