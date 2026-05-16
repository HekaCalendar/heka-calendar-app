/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    TRACKER CHARTS - PREMIUM VISUALIZATIONS                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { useMemo } from 'react';
import i18n from '../../i18n';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  ComposedChart,
} from 'recharts';
import { TrackerManager } from '../../services/trackerManager';
import { TrackerAnalytics } from '../../oracle/trackerAnalytics';
import './tracker-charts.css';

// ═════════════════════════════════════════════════════════════════════════════
// CYCLE LENGTH CHART
// ═════════════════════════════════════════════════════════════════════════════

export const CycleLengthChart: React.FC = () => {
  const data = useMemo(() => {
    const entries = TrackerManager.getMenstrualEntries();
    const periodStarts = entries
      .filter(e => (e.data as any).isPeriodStart)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const cycleData = [];
    for (let i = 1; i < periodStarts.length; i++) {
      const prev = new Date(periodStarts[i - 1].date);
      const curr = new Date(periodStarts[i].date);
      const days = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (days > 14 && days < 50) {
        cycleData.push({
          cycle: i,
          length: days,
          date: new Intl.DateTimeFormat(i18n.language || 'en', { month: 'short', day: 'numeric' }).format(curr),
        });
      }
    }
    return cycleData;
  }, []);
  
  const avg = useMemo(() => {
    if (data.length === 0) return 28;
    return Math.round(data.reduce((a, b) => a + b.length, 0) / data.length);
  }, [data]);
  
  if (data.length < 2) {
    return (
      <div className="tracker-chart-empty">
        <div className="tracker-chart-empty__icon">📊</div>
        <p>Track at least 2 cycles to see length trends</p>
      </div>
    );
  }
  
  return (
    <div className="tracker-chart">
      <h4 className="tracker-chart__title">Cycle Length History</h4>
      <div className="tracker-chart__container">
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cycleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#71717a', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#71717a', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#1a1a24', 
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#a1a1aa' }}
            />
            <Area 
              type="monotone" 
              dataKey="length" 
              stroke="#7c3aed" 
              strokeWidth={2}
              fill="url(#cycleGradient)" 
            />
            <ReferenceLine y={avg} stroke="#f43f5e" strokeDasharray="5 5" />
            <ReferenceLine y={28} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="tracker-chart__legend">
        <span><span className="dot purple" /> Your cycles</span>
        <span><span className="dot red" /> Average ({avg} days)</span>
        <span><span className="dot green" /> Typical (28 days)</span>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SYMPTOM HEATMAP
// ═════════════════════════════════════════════════════════════════════════════

export const SymptomHeatmap: React.FC = () => {
  const patterns = useMemo(() => {
    return TrackerAnalytics.getSymptomPatterns();
  }, []);
  
  if (patterns.length === 0) {
    return (
      <div className="tracker-chart-empty">
        <div className="tracker-chart-empty__icon">🔥</div>
        <p>Log symptoms to see pattern analysis</p>
      </div>
    );
  }
  
  return (
    <div className="tracker-chart">
      <h4 className="tracker-chart__title">Symptom Frequency</h4>
      <div className="tracker-symptom-heatmap">
        {patterns.slice(0, 6).map(pattern => (
          <div key={pattern.symptom} className="tracker-symptom-bar">
            <div className="tracker-symptom-bar__label">
              <span>{pattern.symptom.replace('-', ' ')}</span>
              <span>{pattern.frequency}%</span>
            </div>
            <div className="tracker-symptom-bar__track">
              <div 
                className="tracker-symptom-bar__fill"
                style={{ 
                  width: `${pattern.frequency}%`,
                  background: pattern.frequency > 70 
                    ? '#f43f5e' 
                    : pattern.frequency > 40 
                    ? '#f59e0b' 
                    : '#10b981'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MOOD TREND CHART
// ═════════════════════════════════════════════════════════════════════════════

export const MoodTrendChart: React.FC = () => {
  const data = useMemo(() => {
    const entries = TrackerManager.getEntriesByType('mood')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30);
    
    return entries.map(entry => ({
      date: new Intl.DateTimeFormat(i18n.language || 'en', { month: 'short', day: 'numeric' }).format(new Date(entry.date)),
      rating: (entry.data as any).rating,
      cycleDay: TrackerManager.getFertilityStatus(entry.date).dayOfCycle,
    }));
  }, []);
  
  if (data.length < 3) {
    return (
      <div className="tracker-chart-empty">
        <div className="tracker-chart-empty__icon">🎭</div>
        <p>Log mood entries to see trends</p>
      </div>
    );
  }
  
  return (
    <div className="tracker-chart">
      <h4 className="tracker-chart__title">Mood Trend (Last 30 Days)</h4>
      <div className="tracker-chart__container">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#71717a', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(data.length / 5)}
            />
            <YAxis 
              tick={{ fill: '#71717a', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[1, 10]}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#1a1a24', 
                border: '1px solid rgba(167,139,250,0.3)',
                borderRadius: '8px',
              }}
            />
            <Area 
              type="monotone" 
              dataKey="rating" 
              stroke="#a78bfa" 
              strokeWidth={2}
              fill="url(#moodGradient)" 
            />
            <ReferenceLine y={5} stroke="#71717a" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// SLEEP QUALITY VS CYCLE PHASE
// ═════════════════════════════════════════════════════════════════════════════

export const SleepPhaseChart: React.FC = () => {
  const data = useMemo(() => {
    const entries = TrackerManager.getEntriesByType('sleep');
    const byPhase: Record<string, number[]> = {
      Menstrual: [],
      Follicular: [],
      Ovulation: [],
      Luteal: [],
    };
    
    entries.forEach(entry => {
      const status = TrackerManager.getFertilityStatus(entry.date);
      const phase = status.phase.charAt(0).toUpperCase() + status.phase.slice(1);
      const quality = (entry.data as any).quality;
      if (byPhase[phase]) {
        byPhase[phase].push(quality);
      }
    });
    
    return Object.entries(byPhase).map(([phase, qualities]) => ({
      phase,
      avgQuality: qualities.length > 0 
        ? Math.round((qualities.reduce((a, b) => a + b, 0) / qualities.length) * 10) / 10
        : 0,
      count: qualities.length,
    })).filter(d => d.count > 0);
  }, []);
  
  if (data.length < 2) {
    return (
      <div className="tracker-chart-empty">
        <div className="tracker-chart-empty__icon">😴</div>
        <p>Log sleep data across different cycle phases</p>
      </div>
    );
  }
  
  const colors = ['#f43f5e', '#3b82f6', '#8b5cf6', '#f59e0b'];
  
  return (
    <div className="tracker-chart">
      <h4 className="tracker-chart__title">Sleep Quality by Cycle Phase</h4>
      <div className="tracker-chart__container">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="phase" 
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#71717a', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 5]}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#1a1a24', 
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="avgQuality" radius={[6, 6, 0, 0]}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// CORRELATION MATRIX VISUALIZATION
// ═════════════════════════════════════════════════════════════════════════════

export const CorrelationMatrix: React.FC = () => {
  const correlations = useMemo(() => {
    return TrackerAnalytics.getCrossCorrelations();
  }, []);
  
  if (correlations.length === 0) {
    return (
      <div className="tracker-chart-empty">
        <div className="tracker-chart-empty__icon">🔗</div>
        <p>More data needed for correlation analysis</p>
      </div>
    );
  }
  
  return (
    <div className="tracker-chart">
      <h4 className="tracker-chart__title">Pattern Correlations</h4>
      <div className="tracker-correlation-list">
        {correlations.map((corr, idx) => (
          <div key={idx} className="tracker-correlation-item">
            <div className="tracker-correlation-item__metrics">
              <span>{corr.metricA}</span>
              <span className="tracker-correlation-item__arrow">→</span>
              <span>{corr.metricB}</span>
            </div>
            <div className="tracker-correlation-item__bar">
              <div 
                className="tracker-correlation-item__fill"
                style={{ 
                  width: `${Math.abs(corr.correlation) * 100}%`,
                  background: corr.correlation > 0 
                    ? `linear-gradient(90deg, #10b981, #34d399)`
                    : `linear-gradient(90deg, #f43f5e, #fb7185)`,
                  marginLeft: corr.correlation < 0 ? 'auto' : 0,
                  marginRight: corr.correlation > 0 ? 'auto' : 0,
                }}
              />
            </div>
            <div className="tracker-correlation-item__value">
              {corr.correlation > 0 ? '+' : ''}{Math.round(corr.correlation * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// PHASE DISTRIBUTION PIE CHART
// ═════════════════════════════════════════════════════════════════════════════

export const PhaseDistribution: React.FC = () => {
  const data = useMemo(() => {
    const entries = TrackerManager.getAllEntries();
    const phases: Record<string, number> = {};
    
    entries.forEach(entry => {
      const status = TrackerManager.getFertilityStatus(entry.date);
      const phase = status.phase.charAt(0).toUpperCase() + status.phase.slice(1);
      phases[phase] = (phases[phase] || 0) + 1;
    });
    
    return Object.entries(phases)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, []);
  
  if (data.length === 0) {
    return (
      <div className="tracker-chart-empty">
        <div className="tracker-chart-empty__icon">🥧</div>
        <p>No data to display</p>
      </div>
    );
  }
  
  const colors = {
    Menstrual: '#f43f5e',
    Follicular: '#3b82f6',
    Ovulation: '#8b5cf6',
    Luteal: '#f59e0b',
    Unknown: '#71717a',
  };
  
  return (
    <div className="tracker-chart">
      <h4 className="tracker-chart__title">Entries by Cycle Phase</h4>
      <div className="tracker-chart__container" style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[entry.name as keyof typeof colors] || '#71717a'} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                background: '#1a1a24', 
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: '8px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="tracker-chart__legend" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.map(item => (
          <span key={item.name}>
            <span 
              className="dot" 
              style={{ background: colors[item.name as keyof typeof colors] || '#71717a' }}
            /> 
            {item.name} ({item.value})
          </span>
        ))}
      </div>
    </div>
  );
};

export default {
  CycleLengthChart,
  SymptomHeatmap,
  MoodTrendChart,
  SleepPhaseChart,
  CorrelationMatrix,
  PhaseDistribution,
};
