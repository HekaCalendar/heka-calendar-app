/**
 * Nakshatra Vedic Template
 * Lotus mandala motif, chakra color accents, warm saffron and indigo palette
 * LOCKED: Nakshatra always shown
 */

import React from 'react';
import type { CertificateData, CertificateOptions } from '../certificateData';
import { formatHekaDate } from '../certificateData';

interface Props {
  data: CertificateData;
  options: CertificateOptions;
}

export const NakshatraVedicTemplate: React.FC<Props> = ({ data, options }) => {
  const hekaFormatted = formatHekaDate(data.hekaDate);
  const showHeka = options.showHekaDate && hekaFormatted && hekaFormatted !== data.civilDateFormatted;

  return (
    <div style={{ width: 850, height: 1200, background: 'linear-gradient(160deg, #1a0a00 0%, #2d1b00 30%, #1a0a2e 70%, #0d0520 100%)', position: 'relative', overflow: 'hidden', fontFamily: "'Cinzel', 'Cormorant Garamond', serif", color: '#f0e6d3', boxSizing: 'border-box' }}>
      <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.04, width: 500, height: 500 }} viewBox="0 0 200 200">
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
          <ellipse key={i} cx="100" cy="100" rx="60" ry="25" fill="none" stroke="#ff9933" strokeWidth="0.8" transform={`rotate(${a} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="20" fill="none" stroke="#ff9933" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="8" fill="#ff9933" opacity="0.3" />
      </svg>
      <div style={{ position: 'absolute', top: '15%', left: '10%', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(75,0,130,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }} />
      <div style={{ position: 'absolute', inset: 26, border: '2px solid rgba(255,153,51,0.2)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', inset: 34, border: '1px solid rgba(147,51,234,0.1)' }} />
      {[[30,30],[820,30],[30,1170],[820,1170]].map(([x,y],i) => (
        <div key={i} style={{ position: 'absolute', left: x-6, top: y-6, fontSize: 16, opacity: 0.4 }}>☸</div>
      ))}

      <div style={{ position: 'relative', zIndex: 2, padding: '90px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: 'rgba(255,153,51,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>✦ Jyotish Birth Record ✦</div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.15)', marginBottom: 50, fontFamily: "'Inter', sans-serif" }}>Nakshatra Series</div>

        <div style={{ fontSize: 48, fontWeight: 700, color: '#ffcc66', textAlign: 'center', lineHeight: 1.1, marginBottom: 10, textShadow: '0 2px 15px rgba(255,153,51,0.15)' }}>{data.name}</div>
        <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,153,51,0.4), transparent)', marginBottom: 40 }} />

        <div style={{ textAlign: 'center', marginBottom: 45 }}>
          <div style={{ fontSize: 15, color: '#f0e6d3', fontFamily: "'Inter', sans-serif", marginBottom: 6 }}>{data.civilDateFormatted}</div>
          {options.showTime && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>{data.birthTime}</div>}
          {options.showLocation && <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>{data.locationName}</div>}
          {options.showCoordinates && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>{data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°</div>}
          {showHeka && <div style={{ fontSize: 11, color: 'rgba(255,153,51,0.35)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>HEKA {hekaFormatted}</div>}
        </div>

        {options.showAstrology && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 30, width: '100%', marginBottom: 40 }}>
            {[{ label: 'Surya', sym: data.sunSignSymbol, sign: data.sunSign, deg: data.sunDegree, color: '#ff9933' }, { label: 'Chandra', sym: data.moonSignSymbol, sign: data.moonSign, deg: data.moonDegree, color: '#c0c0c0' }, { label: 'Lagna', sym: data.risingSignSymbol, sign: data.risingSign, deg: data.risingDegree, color: '#ffcc66' }].map((item, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px 8px', background: 'linear-gradient(180deg, rgba(255,153,51,0.05), rgba(75,0,130,0.03))', border: `1px solid ${item.color}20`, borderRadius: 8 }}>
                <div style={{ fontSize: 9, color: 'rgba(255,153,51,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>{item.label}</div>
                <div style={{ fontSize: 26, marginBottom: 4 }}>{item.sym}</div>
                <div style={{ fontSize: 17, color: item.color, fontWeight: 600 }}>{item.sign}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>{item.deg}</div>
              </div>
            ))}
          </div>
        )}

        {/* Nakshatra — LOCKED, always shown */}
        {data.nakshatra && (
          <div style={{ textAlign: 'center', marginBottom: 30, background: 'linear-gradient(135deg, rgba(255,153,51,0.08), rgba(75,0,130,0.05))', border: '1px solid rgba(255,153,51,0.12)', borderRadius: 12, padding: '16px 40px' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,153,51,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Lunar Mansion</div>
            <div style={{ fontSize: 22, color: '#ffcc66', fontWeight: 600 }}>{data.nakshatraSymbol} {data.nakshatra}</div>
          </div>
        )}

        {options.showMoonPhase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
            <span style={{ fontSize: 28 }}>{data.moonPhaseEmoji}</span>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 2, textTransform: 'uppercase' }}>Moon Phase</div>
              <div style={{ fontSize: 14, color: '#f0e6d3' }}>{data.moonPhase} · {data.moonIllumination}%</div>
            </div>
          </div>
        )}

        {options.showElementalBalance && data.elementalBalance && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 20, fontSize: 11 }}>
            <span style={{ color: '#ef4444' }}>🔥 {data.elementalBalance.fire}</span>
            <span style={{ color: '#22c55e' }}>🌍 {data.elementalBalance.earth}</span>
            <span style={{ color: '#3b82f6' }}>💨 {data.elementalBalance.air}</span>
            <span style={{ color: '#06b6d4' }}>💧 {data.elementalBalance.water}</span>
          </div>
        )}

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'rgba(255,153,51,0.3)', letterSpacing: 2, marginBottom: 4 }}>☸</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.12)', letterSpacing: 2 }}>HEKA CALENDAR PRO · SWISS EPHEMERIS PRECISION</div>
        </div>
      </div>
    </div>
  );
};

export default NakshatraVedicTemplate;
