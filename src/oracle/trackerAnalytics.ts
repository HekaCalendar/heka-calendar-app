/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    TRACKER ANALYTICS ENGINE - ELITE EDITION               ║
 * ║                                                                           ║
 * ║  Advanced pattern recognition, correlation analysis, and insights        ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { TrackerManager } from '../services/trackerManager';
import type { TrackerEntry, TrackerType, MenstrualData, MoodData, SleepData, EnergyData } from './trackerTypes';

// ═════════════════════════════════════════════════════════════════════════════
// ANALYTICS TYPES
// ═════════════════════════════════════════════════════════════════════════════

export interface CycleAnalytics {
  averageCycleLength: number;
  cycleLengthStdDev: number;
  shortestCycle: number;
  longestCycle: number;
  regularityScore: number; // 0-100
  cyclesAnalyzed: number;
}

export interface SymptomPattern {
  symptom: string;
  frequency: number; // % of cycles
  avgSeverity: number;
  peakDays: number[]; // days relative to period start
  correlationWithPhase: Record<string, number>;
}

export interface CrossCorrelation {
  metricA: string;
  metricB: string;
  correlation: number; // -1 to 1
  sampleSize: number;
  insight: string;
}

export interface TrendAnalysis {
  metric: string;
  direction: 'improving' | 'declining' | 'stable' | 'fluctuating';
  changePercent: number;
  confidence: number;
}

export interface FertilityWindow {
  date: string;
  probability: number; // 0-100
  type: 'low' | 'medium' | 'high' | 'peak';
}

export interface SmartInsight {
  id: string;
  type: 'pattern' | 'correlation' | 'prediction' | 'health' | 'suggestion';
  title: string;
  description: string;
  confidence: number;
  severity?: 'info' | 'warning' | 'alert';
  action?: string;
  dataPoints?: number;
  trend?: 'up' | 'down' | 'stable';
}

// ═════════════════════════════════════════════════════════════════════════════
// ANALYTICS ENGINE
// ═════════════════════════════════════════════════════════════════════════════

export class TrackerAnalytics {
  
  // ═════════════════════════════════════════════════════════════════════════
  // CYCLE ANALYTICS
  // ═════════════════════════════════════════════════════════════════════════
  
  static getCycleAnalytics(): CycleAnalytics {
    const stats = TrackerManager.getCycleStats();
    const entries = TrackerManager.getMenstrualEntries();
    
    // Calculate standard deviation
    const cycleLengths: number[] = [];
    const periodStarts = entries
      .filter(e => (e.data as MenstrualData).isPeriodStart)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (let i = 1; i < periodStarts.length; i++) {
      const prev = new Date(periodStarts[i - 1].date);
      const curr = new Date(periodStarts[i].date);
      const days = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (days > 14 && days < 50) {
        cycleLengths.push(days);
      }
    }
    
    const avg = stats.averageCycleLength;
    const variance = cycleLengths.length > 0
      ? cycleLengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / cycleLengths.length
      : 0;
    const stdDev = Math.sqrt(variance);
    
    // Regularity score (0-100, higher is more regular)
    const regularityScore = cycleLengths.length >= 3
      ? Math.max(0, 100 - (stdDev / avg) * 100)
      : 0;
    
    return {
      averageCycleLength: avg,
      cycleLengthStdDev: Math.round(stdDev * 10) / 10,
      shortestCycle: stats.shortestCycle,
      longestCycle: stats.longestCycle,
      regularityScore: Math.round(regularityScore),
      cyclesAnalyzed: stats.totalCycles,
    };
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // SYMPTOM PATTERNS
  // ═════════════════════════════════════════════════════════════════════════
  
  static getSymptomPatterns(): SymptomPattern[] {
    const entries = TrackerManager.getMenstrualEntries();
    const symptomMap = new Map<string, { count: number; totalSeverity: number; days: number[] }>();
    
    entries.forEach(entry => {
      const data = entry.data as MenstrualData;
      const cycleDay = this.getCycleDayForDate(entry.date);
      
      data.symptoms?.forEach(symptom => {
        if (!symptomMap.has(symptom)) {
          symptomMap.set(symptom, { count: 0, totalSeverity: 0, days: [] });
        }
        const record = symptomMap.get(symptom)!;
        record.count++;
        record.days.push(cycleDay);
      });
    });
    
    const totalCycles = TrackerManager.getCycleStats().totalCycles || 1;
    
    return Array.from(symptomMap.entries()).map(([symptom, data]) => ({
      symptom,
      frequency: Math.round((data.count / totalCycles) * 100),
      avgSeverity: 5, // Placeholder - would need severity tracking
      peakDays: this.calculatePeakDays(data.days),
      correlationWithPhase: this.calculatePhaseCorrelation(data.days),
    }));
  }
  
  private static getCycleDayForDate(dateStr: string): number {
    const date = new Date(dateStr);
    const entries = TrackerManager.getMenstrualEntries();
    
    // Find most recent period start before this date
    const periodStarts = entries
      .filter(e => (e.data as MenstrualData).isPeriodStart)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const start of periodStarts) {
      const startDate = new Date(start.date);
      if (startDate <= date) {
        return Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      }
    }
    
    return 0;
  }
  
  private static calculatePeakDays(days: number[]): number[] {
    const dayCounts = new Map<number, number>();
    days.forEach(day => {
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    });
    
    return Array.from(dayCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([day]) => day);
  }
  
  private static calculatePhaseCorrelation(days: number[]): Record<string, number> {
    const phases = { menstrual: 0, follicular: 0, ovulation: 0, luteal: 0 };
    
    days.forEach(day => {
      if (day <= 5) phases.menstrual++;
      else if (day <= 14) phases.follicular++;
      else if (day <= 16) phases.ovulation++;
      else phases.luteal++;
    });
    
    const total = days.length || 1;
    return {
      menstrual: Math.round((phases.menstrual / total) * 100),
      follicular: Math.round((phases.follicular / total) * 100),
      ovulation: Math.round((phases.ovulation / total) * 100),
      luteal: Math.round((phases.luteal / total) * 100),
    };
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // CROSS-CORRELATION ANALYSIS
  // ═════════════════════════════════════════════════════════════════════════
  
  static getCrossCorrelations(): CrossCorrelation[] {
    const correlations: CrossCorrelation[] = [];
    
    // Sleep vs Mood correlation
    const sleepMoodCorr = this.calculateMetricCorrelation('sleep', 'mood');
    if (sleepMoodCorr) {
      correlations.push({
        metricA: 'Sleep Quality',
        metricB: 'Mood',
        correlation: sleepMoodCorr,
        sampleSize: this.getSampleSize('sleep', 'mood'),
        insight: sleepMoodCorr > 0.3 
          ? 'Better sleep strongly correlates with improved mood'
          : sleepMoodCorr < -0.3
          ? 'Poor sleep significantly impacts your mood'
          : 'Sleep and mood show moderate connection',
      });
    }
    
    // Sleep vs Cycle Phase
    const sleepPhaseCorr = this.calculateSleepPhaseCorrelation();
    if (sleepPhaseCorr !== null) {
      correlations.push({
        metricA: 'Sleep Quality',
        metricB: 'Menstrual Phase',
        correlation: sleepPhaseCorr,
        sampleSize: TrackerManager.getMenstrualEntries().length,
        insight: sleepPhaseCorr < -0.2
          ? 'Sleep quality tends to decrease during menstruation'
          : 'Sleep patterns are relatively consistent across your cycle',
      });
    }
    
    // Energy vs Mood
    const energyMoodCorr = this.calculateMetricCorrelation('energy', 'mood');
    if (energyMoodCorr) {
      correlations.push({
        metricA: 'Energy Level',
        metricB: 'Mood',
        correlation: energyMoodCorr,
        sampleSize: this.getSampleSize('energy', 'mood'),
        insight: energyMoodCorr > 0.4
          ? 'High energy days strongly coincide with positive moods'
          : 'Energy and mood show independent patterns',
      });
    }
    
    return correlations;
  }
  
  private static calculateMetricCorrelation(typeA: TrackerType, typeB: TrackerType): number | null {
    const entriesA = TrackerManager.getEntriesByType(typeA);
    const entriesB = TrackerManager.getEntriesByType(typeB);
    
    const pairs: { a: number; b: number }[] = [];
    
    entriesA.forEach(entryA => {
      const entryB = entriesB.find(e => e.date === entryA.date);
      if (entryB) {
        const valA = this.extractNumericValue(entryA);
        const valB = this.extractNumericValue(entryB);
        if (valA !== null && valB !== null) {
          pairs.push({ a: valA, b: valB });
        }
      }
    });
    
    if (pairs.length < 3) return null;
    
    // Pearson correlation
    const meanA = pairs.reduce((sum, p) => sum + p.a, 0) / pairs.length;
    const meanB = pairs.reduce((sum, p) => sum + p.b, 0) / pairs.length;
    
    let numerator = 0;
    let denomA = 0;
    let denomB = 0;
    
    pairs.forEach(p => {
      const diffA = p.a - meanA;
      const diffB = p.b - meanB;
      numerator += diffA * diffB;
      denomA += diffA * diffA;
      denomB += diffB * diffB;
    });
    
    const correlation = numerator / Math.sqrt(denomA * denomB);
    return Math.round(correlation * 100) / 100;
  }
  
  private static calculateSleepPhaseCorrelation(): number | null {
    const sleepEntries = TrackerManager.getEntriesByType('sleep');
    const sleepByPhase: Record<string, number[]> = {
      menstrual: [],
      follicular: [],
      ovulation: [],
      luteal: [],
    };
    
    sleepEntries.forEach(entry => {
      const status = TrackerManager.getFertilityStatus(entry.date);
      const quality = (entry.data as SleepData).quality;
      sleepByPhase[status.phase]?.push(quality);
    });
    
    // Compare menstrual vs other phases
    const menstrualAvg = sleepByPhase.menstrual.length > 0
      ? sleepByPhase.menstrual.reduce((a, b) => a + b, 0) / sleepByPhase.menstrual.length
      : 0;
    
    const otherValues = [
      ...sleepByPhase.follicular,
      ...sleepByPhase.ovulation,
      ...sleepByPhase.luteal,
    ];
    const otherAvg = otherValues.length > 0
      ? otherValues.reduce((a, b) => a + b, 0) / otherValues.length
      : 0;
    
    if (menstrualAvg === 0 || otherAvg === 0) return null;
    
    return (menstrualAvg - otherAvg) / 5; // Normalize to roughly -1 to 1
  }
  
  private static extractNumericValue(entry: TrackerEntry): number | null {
    switch (entry.type) {
      case 'sleep':
        return (entry.data as SleepData).quality;
      case 'mood':
        return (entry.data as MoodData).rating;
      case 'energy':
        return (entry.data as EnergyData).level;
      default:
        return null;
    }
  }
  
  private static getSampleSize(typeA: TrackerType, typeB: TrackerType): number {
    const entriesA = TrackerManager.getEntriesByType(typeA);
    const entriesB = TrackerManager.getEntriesByType(typeB);
    return entriesA.filter(a => entriesB.some(b => b.date === a.date)).length;
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // SMART INSIGHTS
  // ═════════════════════════════════════════════════════════════════════════
  
  static generateSmartInsights(): SmartInsight[] {
    const insights: SmartInsight[] = [];
    const analytics = this.getCycleAnalytics();
    const correlations = this.getCrossCorrelations();
    const symptoms = this.getSymptomPatterns();
    
    // Cycle regularity insight
    if (analytics.cyclesAnalyzed >= 3) {
      if (analytics.regularityScore < 50) {
        insights.push({
          id: 'irregular-cycles',
          type: 'health',
          title: 'Irregular Cycle Pattern Detected',
          description: `Your cycles vary by ${analytics.cycleLengthStdDev} days on average. This could be due to stress, lifestyle changes, or hormonal factors.`,
          confidence: Math.round(analytics.regularityScore),
          severity: 'warning',
          action: 'Consider tracking lifestyle factors to identify triggers',
          dataPoints: analytics.cyclesAnalyzed,
        });
      } else if (analytics.regularityScore > 80) {
        insights.push({
          id: 'regular-cycles',
          type: 'pattern',
          title: 'Highly Regular Cycles',
          description: `Your ${analytics.averageCycleLength}-day cycle is remarkably consistent. This indicates good hormonal balance.`,
          confidence: analytics.regularityScore,
          severity: 'info',
          dataPoints: analytics.cyclesAnalyzed,
        });
      }
    }
    
    // Symptom insights
    const topSymptom = symptoms.sort((a, b) => b.frequency - a.frequency)[0];
    if (topSymptom && topSymptom.frequency > 50) {
      insights.push({
        id: 'common-symptom',
        type: 'pattern',
        title: `Frequent ${topSymptom.symptom}`,
        description: `You experience ${topSymptom.symptom} in ${topSymptom.frequency}% of your cycles, most commonly on day${topSymptom.peakDays.length > 1 ? 's' : ''} ${topSymptom.peakDays.join(', ')}.`,
        confidence: topSymptom.frequency,
        severity: 'info',
        action: 'Consider preventive measures 1-2 days before expected onset',
        dataPoints: topSymptom.frequency,
      });
    }
    
    // Correlation insights
    correlations.forEach(corr => {
      if (Math.abs(corr.correlation) > 0.3) {
        insights.push({
          id: `correlation-${corr.metricA}-${corr.metricB}`,
          type: 'correlation',
          title: `${corr.metricA} ↔ ${corr.metricB} Connection`,
          description: corr.insight,
          confidence: Math.round(Math.abs(corr.correlation) * 100),
          severity: 'info',
          dataPoints: corr.sampleSize,
          trend: corr.correlation > 0 ? 'up' : 'down',
        });
      }
    });
    
    // Prediction insights
    const prediction = TrackerManager.getCyclePrediction();
    if (prediction) {
      const daysUntil = Math.floor(
        (new Date(prediction.nextPeriodStart).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysUntil <= 3 && daysUntil >= 0) {
        insights.push({
          id: 'period-soon',
          type: 'prediction',
          title: `Period Expected in ${daysUntil} Day${daysUntil !== 1 ? 's' : ''}`,
          description: `Based on your ${prediction.cyclesAnalyzed} tracked cycles, your next period is predicted to start on ${prediction.nextPeriodStart}.`,
          confidence: prediction.confidence === 'high' ? 85 : prediction.confidence === 'medium' ? 65 : 45,
          severity: 'info',
          action: 'Have supplies ready and consider self-care preparation',
        });
      }
    }
    
    return insights.sort((a, b) => (b.confidence || 0) - (a.confidence || 0));
  }
  
  // ═════════════════════════════════════════════════════════════════════════
  // TREND ANALYSIS
  // ═════════════════════════════════════════════════════════════════════════
  
  static getTrendAnalysis(metric: 'mood' | 'sleep' | 'energy', weeks = 4): TrendAnalysis | null {
    const entries = TrackerManager.getEntriesByType(metric);
    if (entries.length < 7) return null;
    
    const sorted = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recent = sorted.slice(-Math.min(7 * weeks, sorted.length));
    const older = sorted.slice(0, Math.max(0, sorted.length - 7 * weeks));
    
    if (older.length < 7) return null;
    
    const recentAvg = recent.reduce((sum, e) => sum + (this.extractNumericValue(e) || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum, e) => sum + (this.extractNumericValue(e) || 0), 0) / older.length;
    
    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    let direction: TrendAnalysis['direction'];
    if (Math.abs(changePercent) < 5) direction = 'stable';
    else if (changePercent > 0) direction = 'improving';
    else direction = 'declining';
    
    return {
      metric,
      direction: direction === 'improving' || direction === 'declining' ? direction : 'fluctuating',
      changePercent: Math.round(changePercent * 10) / 10,
      confidence: Math.min(100, recent.length * 5),
    };
  }
}

export default TrackerAnalytics;
