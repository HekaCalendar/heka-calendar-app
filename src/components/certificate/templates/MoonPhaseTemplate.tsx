/**
 * Moon Phase Template
 * Dark lunar theme, exact moon illumination, celestial coordinates
 * LOCKED: Moon phase always shown
 */

import React from 'react';
import type { CertificateData, CertificateOptions } from '../certificateData';
import { formatHekaDate } from '../certificateData';

interface Props {
  data: CertificateData;
  options: CertificateOptions;
}

export const MoonPhaseTemplate: React.FC<Props> = ({ data, options }) => {
  const illumination = data.moonIllumination || 0;
  const isWaxing = illumination < 50;
  const hekaFormatted = formatHekaDate(data.hekaDate);
  const showHeka = options.showHekaDate && hekaFormatted && hekaFormatted !== data.civilDateFormatted;

  return (
    <div style={{ width: 850, height: 1200, background: 'linear-gradient(170deg, #050510 0%, #0a0a1a 40%, #080818 70%, #050510 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Rajdhani', 'Inter', sans-serif", color: '#e0e0e8', boxSizing: 'border-box' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle at ${isWaxing ? '35%' : '65%'} 50%, rgba(200,200,210,${0.03 + illumination/3000}) 0%, transparent 60%)`, filter: 'blur(40px)' }} />
      {[...Array(40)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', left: `${(i * 37 + 13) % 100}%`, top: `${(i * 23 + 7) % 100}%`, width: (i % 3) + 1, height: (i % 3) + 1, borderRadius: '50%', background: '#fff', opacity: 0.1 + (i % 5) * 0.05 }} />
      ))}
      <div style={{ position: 'absolute', inset: 28, border: '1px solid rgba(200,200,210,0.08)', borderRadius: '50%' }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '90px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 10, letterSpacing: 5, color: 'rgba(200,200,210,0.4)', textTransform: 'uppercase', marginBottom: 6 }}>Lunar Birth Record</div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.1)', marginBottom: 40 }}>Exact Celestial Coordinates</div>

        {/* Moon phase — LOCKED, always shown */}
        <div style={{ marginBottom: 30, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: `radial-gradient(circle at ${isWaxing ? '30%' : '70%'} 50%, #d0d0d8 0%, #a0a0a8 100%)`, boxShadow: `0 0 60px rgba(200,200,210,${0.1 + illumination/400}), inset -10px 0 20px rgba(0,0,0,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: illumination < 50 ? `radial-gradient(circle at ${isWaxing ? '70%' : '30%'} 50%, rgba(0,0,0,0.7) 0%, transparent 60%)` : `radial-gradient(circle at ${isWaxing ? '30%' : '70%'} 50%, transparent 40%, rgba(0,0,0,0.7) 100%)` }} />
            <span style={{ fontSize: 48, position: 'relative', zIndex: 2 }}>{data.moonPhaseEmoji}</span>
          </div>
          <div style={{ fontSize: 20, color: '#e0e0e8', fontWeight: 600, marginTop: 16, letterSpacing: 2 }}>{data.moonPhase}</div>
          <div style={{ fontSize: 13, color: 'rgba(200,200,210,0.4)', marginTop: 4 }}>{data.moonIllumination}% illuminated</div>
        </div>

        <div style={{ fontSize: 38, fontWeight: 700, color: '#e0e0e8', textAlign: 'center', lineHeight: 1.15, marginBottom: 8, fontFamily: "'Cinzel', serif" }}>{data.name}</div>
        <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,200,210,0.3), transparent)', marginBottom: 35 }} />

        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 14, color: '#e0e0e8', fontFamily: "'Inter', sans-serif", marginBottom: 6 }}>{data.civilDateFormatted}</div>
          {options.showTime && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>{data.birthTime}</div>}
          {options.showLocation && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{data.locationName}</div>}
          {options.showCoordinates && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>{data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</div>}
          {showHeka && <div style={{ fontSize: 11, color: 'rgba(200,200,210,0.3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>HEKA {hekaFormatted}</div>}
        </div>

        {options.showAstrology && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 25, width: '100%', marginBottom: 35 }}>
            {[{ label: 'SUN', sym: data.sunSignSymbol, sign: data.sunSign, deg: data.sunDegree }, { label: 'MOON', sym: data.moonSignSymbol, sign: data.moonSign, deg: data.moonDegree }, { label: 'RISING', sym: data.risingSignSymbol, sign: data.risingSign, deg: data.risingDegree }].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: 'rgba(200,200,210,0.3)', letterSpacing: 3, marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{item.sym}</div>
                <div style={{ fontSize: 16, color: '#e0e0e8', fontWeight: 600 }}>{item.sign}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>{item.deg}</div>
              </div>
            ))}
          </div>
        )}

        {/* Moon-specific details — LOCKED */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 30, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(200,200,210,0.06)', borderRadius: 10, padding: '16px 28px', width: '100%', maxWidth: 400 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'rgba(200,200,210,0.4)' }}>Moon Sign</span>
            <span style={{ color: '#e0e0e8', fontWeight: 500 }}>{data.moonSignSymbol} {data.moonSign} {data.moonDegree}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'rgba(200,200,210,0.4)' }}>Illumination</span>
            <span style={{ color: '#e0e0e8', fontWeight: 500 }}>{data.moonIllumination}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'rgba(200,200,210,0.4)' }}>Phase</span>
            <span style={{ color: '#e0e0e8', fontWeight: 500 }}>{data.moonPhase}</span>
          </div>
        </div>

        {options.showNakshatra && data.nakshatra && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 20, textAlign: 'center' }}>Nakshatra: <span style={{ color: '#e0e0e8' }}>{data.nakshatra}</span></div>
        )}

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'rgba(200,200,210,0.15)', letterSpacing: 3 }}>HEKA CALENDAR PRO · LUNAR DATA VIA SWISS EPHEMERIS</div>
        </div>
      </div>
    </div>
  );
};

export default MoonPhaseTemplate;
