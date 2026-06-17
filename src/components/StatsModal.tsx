/**
 * Statistics Modal Component
 * Shows usage analytics, streaks, and personal insights
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../store';
import { resetStatistics } from '../store';
import { NOTE_CATEGORIES } from '../types';
import { dialogService } from './ui/DialogProvider';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['stats', 'common']);
  const dispatch = useDispatch();
  const stats = useSelector((state: RootState) => state.calendar.statistics);
  const [, setTick] = useState(0);

  if (!isOpen) return null;

  // Calculate additional metrics
  const categoryData = NOTE_CATEGORIES.map(cat => ({
    ...cat,
    name: t(`stats:categories.${cat.id}`),
    count: stats.notesByCategory[cat.id] || 0,
  })).sort((a, b) => b.count - a.count);

  const totalCategoryNotes = categoryData.reduce((sum, cat) => sum + cat.count, 0);

  // Get monthly data for the chart
  const monthlyData = Object.entries(stats.notesByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12); // Last 12 months

  const maxMonthlyCount = Math.max(...monthlyData.map(([, count]) => count), 1);

  // Achievement badges
  const badges = [
    { id: 'first-note', icon: '📝', earned: stats.totalNotes > 0 },
    { id: 'week-streak', icon: '🔥', earned: stats.currentStreak >= 7 },
    { id: 'month-streak', icon: '📅', earned: stats.currentStreak >= 30 },
    { id: 'century', icon: '💯', earned: stats.totalNotes >= 100 },
    { id: 'archivist', icon: '📚', earned: stats.totalWords >= 10000 },
    { id: 'explorer', icon: '🧭', earned: Object.keys(stats.notesByMonth).length >= 13 },
  ];

  const earnedBadges = badges.filter(b => b.earned);
  const progressToNext = stats.totalNotes < 100 ? (stats.totalNotes / 100) * 100 : 100;

  const handleReset = async () => {
    const confirmed = await dialogService.showConfirm({
      title: t('stats:resetConfirmTitle'),
      description: t('stats:resetConfirmDescription'),
      confirmText: t('stats:resetConfirm'),
      cancelText: t('common:cancel'),
      variant: 'danger',
    });
    if (confirmed) {
      dispatch(resetStatistics());
      setTick(v => v + 1);
    }
  };

  return (
    <div
      className="modal-overlay stats-modal-overlay"
      style={{ paddingTop: 'max(var(--space-8), 8vh)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal stats-modal" style={{ maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="modal__header">
          <h2 className="modal__title">📊 {t('stats:title')}</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label={t('common:close')}>
            ×
          </button>
        </div>

        {/* Overview Stats */}
        <div className="stats-overview">
          <div className="stat-card stat-card--primary">
            <div className="stat-value">{stats.totalNotes}</div>
            <div className="stat-label">{t('stats:totalNotes')}</div>
          </div>
          <div className="stat-card stat-card--fire">
            <div className="stat-value">{stats.currentStreak}</div>
            <div className="stat-label">{t('stats:dayStreak')}</div>
            {stats.longestStreak > stats.currentStreak && (
              <div className="stat-sublabel">{t('stats:best', { count: stats.longestStreak })}</div>
            )}
          </div>
          <div className="stat-card stat-card--words">
            <div className="stat-value">{stats.totalWords.toLocaleString()}</div>
            <div className="stat-label">{t('stats:wordsWritten')}</div>
          </div>
          <div className="stat-card stat-card--mood">
            <div className="stat-value">{stats.moodAverage > 0 ? stats.moodAverage.toFixed(1) : '-'}</div>
            <div className="stat-label">{t('stats:avgMood')}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="stats-progress-section">
          <div className="stats-progress-label">
            <span>{t('stats:progressToCentury')}</span>
            <span>{t('stats:progressRatio', { current: stats.totalNotes, target: 100 })}</span>
          </div>
          <div className="stats-progress-bar">
            <div
              className="stats-progress-fill"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="stats-section">
          <h3 className="stats-section-title">{t('stats:notesByCategory')}</h3>
          <div className="category-grid">
            {categoryData.map(cat => (
              <div key={cat.id} className="category-bar-item">
                <div className="category-bar-header">
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.count}</span>
                </div>
                <div className="category-bar-track">
                  <div
                    className="category-bar-fill"
                    style={{
                      width: totalCategoryNotes > 0 ? `${(cat.count / totalCategoryNotes) * 100}%` : '0%',
                      background: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Activity Chart */}
        {monthlyData.length > 0 && (
          <div className="stats-section">
            <h3 className="stats-section-title">{t('stats:monthlyActivity')}</h3>
            <div className="monthly-chart">
              {monthlyData.map(([month, count]) => {
                const [year, mon] = month.split('-');
                const monthIndex = parseInt(mon, 10) - 1;
                const monthName = t(`calendar:civilMonths.${monthIndex}`);
                const height = maxMonthlyCount > 0 ? (count / maxMonthlyCount) * 100 : 0;

                return (
                  <div key={month} className="monthly-bar">
                    <div
                      className="monthly-bar-fill"
                      style={{ height: `${Math.max(height, 5)}%` }}
                      title={t('stats:monthlyTooltip', { month: monthName, year, count })}
                    />
                    <div className="monthly-bar-label">{monthName}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Achievement Badges */}
        <div className="stats-section">
          <h3 className="stats-section-title">
            {t('stats:achievements', { earned: earnedBadges.length, total: badges.length })}
          </h3>
          <div className="badges-grid">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}
              >
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-name">{t(`stats:badges.${badge.id}.name`)}</div>
                {!badge.earned && <div className="badge-lock">🔒</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        {stats.mostActiveMonth.month && (
          <div className="stats-insight">
            <span className="insight-icon">💡</span>
            <span dangerouslySetInnerHTML={{
              __html: t('stats:mostActiveMonth', {
                month: stats.mostActiveMonth.month,
                count: stats.mostActiveMonth.count,
              }),
            }} />
          </div>
        )}

        {/* Actions */}
        <div className="stats-actions">
          <button
            className="btn"
            onClick={handleReset}
          >
            {t('stats:reset')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
