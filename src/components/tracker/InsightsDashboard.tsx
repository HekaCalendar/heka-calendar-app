/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    INSIGHTS DASHBOARD - ELITE EDITION                     ║
 * ║                                                                           ║
 * ║  Comprehensive analytics, patterns, and actionable intelligence          ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import i18n from '../../i18n';
import { useState, useMemo } from 'react';
import { TrackerAnalytics, type SmartInsight } from '../../oracle/trackerAnalytics';
import { TrackerManager } from '../../services/trackerManager';
import {
  CycleLengthChart,
  SymptomHeatmap,
  MoodTrendChart,
  SleepPhaseChart,
  CorrelationMatrix,
  PhaseDistribution,
} from './TrackerCharts';
import './insights-dashboard.css';

// ═════════════════════════════════════════════════════════════════════════════
// INSIGHT CARD COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

interface InsightCardProps {
  insight: SmartInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getSeverityColor = () => {
    switch (insight.severity) {
      case 'alert': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const getTypeIcon = () => {
    switch (insight.type) {
      case 'pattern': return '📊';
      case 'correlation': return '🔗';
      case 'prediction': return '🔮';
      case 'health': return '⚕️';
      case 'suggestion': return '💡';
      default: return '✨';
    }
  };

  return (
    <div className="insight-card" style={{ borderLeftColor: getSeverityColor() }}>
      <div className="insight-card__header">
        <span className="insight-card__icon">{getTypeIcon()}</span>
        <span 
          className="insight-card__confidence"
          style={{ color: getSeverityColor() }}
        >
          {insight.confidence}% confidence
        </span>
      </div>
      <h4 className="insight-card__title">{insight.title}</h4>
      <p className="insight-card__description">{insight.description}</p>
      {insight.action && (
        <div className="insight-card__action">
          <span className="insight-card__action-icon">→</span>
          {insight.action}
        </div>
      )}
      {insight.dataPoints && (
        <div className="insight-card__meta">
          Based on {insight.dataPoints} data points
        </div>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// METRIC CARD COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtext, trend, trendValue }) => {
  return (
    <div className="metric-card">
      <div className="metric-card__label">{label}</div>
      <div className="metric-card__value">{value}</div>
      {subtext && <div className="metric-card__subtext">{subtext}</div>}
      {trend && (
        <div className={`metric-card__trend metric-card__trend--${trend}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
        </div>
      )}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

interface InsightsDashboardProps {
  onClose: () => void;
}

export const InsightsDashboard: React.FC<InsightsDashboardProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cycles' | 'patterns' | 'correlations'>('overview');

  // Data fetching
  const analytics = useMemo(() => TrackerAnalytics.getCycleAnalytics(), []);
  const insights = useMemo(() => TrackerAnalytics.generateSmartInsights(), []);
  const correlations = useMemo(() => TrackerAnalytics.getCrossCorrelations(), []);
  const prediction = useMemo(() => TrackerManager.getCyclePrediction(), []);

  // Trend analysis
  const moodTrend = useMemo(() => TrackerAnalytics.getTrendAnalysis('mood'), []);
  const sleepTrend = useMemo(() => TrackerAnalytics.getTrendAnalysis('sleep'), []);
  const energyTrend = useMemo(() => TrackerAnalytics.getTrendAnalysis('energy'), []);

  const renderOverview = () => (
    <>
      {/* Key Metrics */}
      <div className="insights-section">
        <h3 className="insights-section__title">Cycle Health</h3>
        <div className="metrics-grid">
          <MetricCard
            label="Average Cycle"
            value={`${analytics.averageCycleLength} days`}
            subtext={`Range: ${analytics.shortestCycle}-${analytics.longestCycle}`}
            trend={analytics.regularityScore > 70 ? 'stable' : 'down'}
            trendValue={`${analytics.regularityScore}% regular`}
          />
          <MetricCard
            label="Cycles Tracked"
            value={analytics.cyclesAnalyzed}
            subtext="Historical data"
          />
          <MetricCard
            label="Next Period"
            value={prediction ? new Intl.DateTimeFormat(i18n.language || 'en', { month: 'short', day: 'numeric' }).format(new Date(prediction.nextPeriodStart)) : '--'}
            subtext={prediction ? `${prediction.confidence} confidence` : 'Not enough data'}
          />
          <MetricCard
            label="Data Points"
            value={TrackerManager.getAllEntries().length}
            subtext="Total entries"
          />
        </div>
      </div>

      {/* Trend Summary */}
      <div className="insights-section">
        <h3 className="insights-section__title">Recent Trends (4 weeks)</h3>
        <div className="trends-row">
          {moodTrend && (
            <div className={`trend-pill trend-pill--${moodTrend.direction}`}>
              <span className="trend-pill__icon">🎭</span>
              <span className="trend-pill__label">Mood</span>
              <span className="trend-pill__value">
                {moodTrend.direction === 'improving' ? '+' : ''}{moodTrend.changePercent}%
              </span>
            </div>
          )}
          {sleepTrend && (
            <div className={`trend-pill trend-pill--${sleepTrend.direction}`}>
              <span className="trend-pill__icon">😴</span>
              <span className="trend-pill__label">Sleep</span>
              <span className="trend-pill__value">
                {sleepTrend.direction === 'improving' ? '+' : ''}{sleepTrend.changePercent}%
              </span>
            </div>
          )}
          {energyTrend && (
            <div className={`trend-pill trend-pill--${energyTrend.direction}`}>
              <span className="trend-pill__icon">⚡</span>
              <span className="trend-pill__label">Energy</span>
              <span className="trend-pill__value">
                {energyTrend.direction === 'improving' ? '+' : ''}{energyTrend.changePercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Top Insights */}
      <div className="insights-section">
        <h3 className="insights-section__title">Smart Insights</h3>
        <div className="insights-grid">
          {insights.slice(0, 4).map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>

      {/* Quick Charts */}
      <div className="insights-section">
        <h3 className="insights-section__title">Visual Summary</h3>
        <div className="charts-grid">
          <div className="chart-cell">
            <PhaseDistribution />
          </div>
          <div className="chart-cell">
            <SymptomHeatmap />
          </div>
        </div>
      </div>
    </>
  );

  const renderCycles = () => (
    <>
      <div className="insights-section">
        <h3 className="insights-section__title">Cycle Length History</h3>
        <CycleLengthChart />
      </div>

      <div className="insights-section">
        <h3 className="insights-section__title">Mood Throughout Cycles</h3>
        <MoodTrendChart />
      </div>

      <div className="insights-section">
        <h3 className="insights-section__title">Sleep Quality by Phase</h3>
        <SleepPhaseChart />
      </div>
    </>
  );

  const renderPatterns = () => (
    <>
      <div className="insights-section">
        <h3 className="insights-section__title">Symptom Patterns</h3>
        <div className="pattern-analysis">
          <SymptomHeatmap />
        </div>
      </div>

      <div className="insights-section">
        <h3 className="insights-section__title">All Insights</h3>
        <div className="insights-list">
          {insights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </>
  );

  const renderCorrelations = () => (
    <>
      <div className="insights-section">
        <h3 className="insights-section__title">Metric Correlations</h3>
        <CorrelationMatrix />
      </div>

      <div className="insights-section">
        <h3 className="insights-section__title">Correlation Details</h3>
        <div className="correlation-details">
          {correlations.map((corr, idx) => (
            <div key={idx} className="correlation-detail-card">
              <div className="correlation-detail-card__header">
                <span>{corr.metricA}</span>
                <span className="correlation-detail-card__arrow">↔</span>
                <span>{corr.metricB}</span>
              </div>
              <div 
                className="correlation-detail-card__strength"
                style={{ 
                  color: Math.abs(corr.correlation) > 0.5 ? '#10b981' : '#a1a1aa'
                }}
              >
                {Math.abs(corr.correlation) > 0.7 ? 'Strong' : Math.abs(corr.correlation) > 0.4 ? 'Moderate' : 'Weak'} 
                {' '}correlation ({Math.round(corr.correlation * 100)}%)
              </div>
              <p className="correlation-detail-card__insight">{corr.insight}</p>
              <div className="correlation-detail-card__sample">
                Based on {corr.sampleSize} overlapping entries
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="insights-dashboard">
      {/* Header */}
      <header className="insights-header">
        <div className="insights-header__brand">
          <div className="insights-header__icon">📊</div>
          <h1 className="insights-header__title">
            Insights <span>Dashboard</span>
          </h1>
        </div>
        <button className="insights-header__close" onClick={onClose}>
          <span>←</span>
          <span>Back</span>
        </button>
      </header>

      {/* Navigation */}
      <nav className="insights-nav">
        {[
          { id: 'overview', label: 'Overview', icon: '📋' },
          { id: 'cycles', label: 'Cycles', icon: '🔄' },
          { id: 'patterns', label: 'Patterns', icon: '🔍' },
          { id: 'correlations', label: 'Correlations', icon: '🔗' },
        ].map(tab => (
          <button
            key={tab.id}
            className={`insights-nav__tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="insights-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'cycles' && renderCycles()}
        {activeTab === 'patterns' && renderPatterns()}
        {activeTab === 'correlations' && renderCorrelations()}
      </main>
    </div>
  );
};

export default InsightsDashboard;
