/**
 * Natal Chart Summary Component (Stub)
 * Simplified version for build compatibility
 */

import React from 'react';
import { NatalChart } from '../../types/astrology';

interface NatalChartSummaryProps {
  chart: NatalChart;
}

export const NatalChartSummary: React.FC<NatalChartSummaryProps> = ({ chart }) => {
  const sun = chart.positions.find(p => p.planet === 'sun');
  const moon = chart.positions.find(p => p.planet === 'moon');
  
  return (
    <div style={{ padding: '20px', background: '#242424', borderRadius: '12px', color: '#f5f5f5' }}>
      <h3>🌟 Natal Chart Summary</h3>
      {sun?.degree != null && (
        <p>Sun: {sun.sign} {(sun.degree ?? 0).toFixed(1)}°</p>
      )}
      {moon?.degree != null && (
        <p>Moon: {moon.sign} {(moon.degree ?? 0).toFixed(1)}°</p>
      )}
      <p>Full chart interpretation coming soon...</p>
    </div>
  );
};

export default NatalChartSummary;
