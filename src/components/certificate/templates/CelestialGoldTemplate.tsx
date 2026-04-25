/**
 * Celestial Gold Template
 * Ornate gold filigree, zodiac wheel watermark, deep navy base
 */

import React from 'react';
import type { CertificateData, CertificateOptions } from '../certificateData';
import { formatHekaDate } from '../certificateData';

interface Props {
  data: CertificateData;
  options: CertificateOptions;
}

export const CelestialGoldTemplate: React.FC<Props> = ({ data, options }) => {
  const hekaFormatted = formatHekaDate(data.hekaDate);
  const showHeka = options.showHekaDate && hekaFormatted && hekaFormatted !== data.civilDateFormatted;

  return (
    <div
      style={{
        width: 850, height: 1200,
        background: 'linear-gradient(160deg, #0a0a1a 0%, #12122e 40%, #0d0d1f 100%)',
        position: 'relative', overflow: 'hidden',
        fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
        color: '#f8f7f5', boxSizing: 'border-box',
      }}
    >
      {/* Zodiac wheel watermark */}
      <svg style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', opacity: 0.04, width: 500, height: 500 }} viewBox="-200 -200 400 400">
        <circle cx="0" cy="0" r="180" fill="none" stroke="#d4af37" strokeWidth="1" />
        <circle cx="0" cy="0" r="150" fill="none" stroke="#d4af37" strokeWidth="0.5" />
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => (
          <line key={i} x1={0} y1={-180} x2={0} y2={-150} transform={`rotate(${a})`} stroke="#d4af37" strokeWidth="0.5" />
        ))}
        {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((s, i) => (
          <text key={i} x={0} y={-162} textAnchor="middle" fill="#d4af37" fontSize="14" transform={`rotate(${i * 30})`}>{s}</text>
        ))}
      </svg>

      {/* Borders */}
      <div style={{ position: 'absolute', inset: 24, border: '2px solid rgba(212,175,55,0.3)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', inset: 32, border: '1px solid rgba(212,175,55,0.15)', borderRadius: 2 }} />
      {[[24,24],[826,24],[24,1176],[826,1176]].map(([x,y],i) => (
        <div key={i} style={{ position: 'absolute', left: x-8, top: y-8, width: 16, height: 16, border: '2px solid #d4af37', borderRadius: '50%', opacity: 0.6 }} />
      ))}

      <div style={{ position: 'relative', zIndex: 2, padding: '80px 70px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ width: 120, height: 2, background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', marginBottom: 30 }} />
        <div style={{ fontSize: 11, letterSpacing: 4, color: 'rgba(212,175,55,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>✦ Certificate of Celestial Birth ✦</div>
        <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', marginBottom: 50 }}>HEKA Calendar Pro</div>

        {/* Name — ALWAYS */}
        <div style={{ fontSize: 52, fontWeight: 700, color: '#d4af37', textAlign: 'center', lineHeight: 1.15, marginBottom: 12, textShadow: '0 2px 20px rgba(212,175,55,0.2)' }}>{data.name}</div>
        <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)', marginBottom: 40 }} />

        {/* Birth date — ALWAYS */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Born Under the Stars</div>
          <div style={{ fontSize: 16, color: '#f8f7f5', fontFamily: "'Inter', sans-serif", marginBottom: 6 }}>{data.civilDateFormatted}</div>
          {options.showTime && (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>{data.birthTime}</div>
          )}
          {options.showLocation && (
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif", marginTop: 4 }}>{data.locationName}</div>
          )}
          {options.showCoordinates && (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
              {data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°
            </div>
          )}
          {showHeka && (
            <div style={{ fontSize: 11, color: 'rgba(212,175,55,0.5)', fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>HEKA: {hekaFormatted}</div>
          )}
        </div>

        {/* Astrology */}
        {options.showAstrology && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 30, width: '100%', marginBottom: 40 }}>
            <AstrologyCol symbol={data.sunSignSymbol} label="Sun" sign={data.sunSign} degree={data.sunDegree} />
            <AstrologyCol symbol={data.moonSignSymbol} label="Moon" sign={data.moonSign} degree={data.moonDegree} />
            <AstrologyCol symbol={data.risingSignSymbol} label="Rising" sign={data.risingSign} degree={data.risingDegree} />
          </div>
        )}

        {/* Moon phase */}
        {options.showMoonPhase && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40,
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02))',
            border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: '16px 32px' }}>
            <span style={{ fontSize: 32 }}>{data.moonPhaseEmoji}</span>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Moon Phase at Birth</div>
              <div style={{ fontSize: 15, color: '#d4af37', fontWeight: 600 }}>{data.moonPhase}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{data.moonIllumination}% illuminated</div>
            </div>
          </div>
        )}

        {/* Nakshatra */}
        {options.showNakshatra && data.nakshatra && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 30, textAlign: 'center' }}>
            Lunar Mansion: <span style={{ color: '#d4af37' }}>{data.nakshatraSymbol} {data.nakshatra}</span>
          </div>
        )}

        {/* Chinese Zodiac */}
        {options.showChineseZodiac && data.chineseZodiacAnimal && (
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Chinese Zodiac</div>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{data.chineseZodiacEmoji}</div>
            <div style={{ fontSize: 16, color: '#d4af37', fontWeight: 600 }}>Year of the {data.chineseZodiacAnimal}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{data.chineseZodiacElement} Element</div>
          </div>
        )}

        {/* Elemental balance */}
        {options.showElementalBalance && data.elementalBalance && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 30, fontSize: 12 }}>
            <span style={{ color: '#ef4444' }}>🔥 {data.elementalBalance.fire}</span>
            <span style={{ color: '#22c55e' }}>🌍 {data.elementalBalance.earth}</span>
            <span style={{ color: '#3b82f6' }}>💨 {data.elementalBalance.air}</span>
            <span style={{ color: '#06b6d4' }}>💧 {data.elementalBalance.water}</span>
          </div>
        )}

        {/* House cusps */}
        {options.showHouseCusps && data.houseCusps && (
          <div style={{ marginBottom: 30, textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>House Cusps</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              {data.houseCusps.map((c, i) => (
                <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  H{c.house}: {c.signSymbol} {c.sign} {c.degree}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ flex: 1 }} />

        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: 1.5 }}>GENERATED BY HEKA CALENDAR PRO</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', marginTop: 4 }}>
            {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

const AstrologyCol: React.FC<{ symbol: string; label: string; sign: string; degree: string }> =
  ({ symbol, label, sign, degree }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 28, marginBottom: 4 }}>{symbol}</div>
    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 18, color: '#d4af37', fontWeight: 600, marginBottom: 2 }}>{sign}</div>
    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>{degree}</div>
  </div>
);

export default CelestialGoldTemplate;
