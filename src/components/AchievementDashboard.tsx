/**
 * Achievement Dashboard - Phase 1 Gamification
 * 
 * Displays user achievements, progress, and engagement stats
 * Categories: beginner, intermediate, advanced, master, special, explorer, discoverer, engager
 */

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGamification, useUserLevel } from '../hooks/useGamification';
import { ACHIEVEMENTS, getAchievementsByCategory, type AchievementCategory } from '../services/gamificationService';
import './achievement-dashboard.css';

// Category display configuration (labels come from i18n)
const CATEGORY_CONFIG: Record<AchievementCategory, { color: string; icon: string }> = {
  beginner: { color: '#22c55e', icon: '🌱' },
  intermediate: { color: '#3b82f6', icon: '🌿' },
  advanced: { color: '#8b5cf6', icon: '🌳' },
  master: { color: '#d4af37', icon: '👑' },
  special: { color: '#ec4899', icon: '✨' },
  explorer: { color: '#f59e0b', icon: '🔭' },
  discoverer: { color: '#14b8a6', icon: '🔍' },
  engager: { color: '#ef4444', icon: '🔥' },
};

interface AchievementCardProps {
  achievement: typeof ACHIEVEMENTS[0];
  unlocked: boolean;
  unlockedAt?: string;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, unlocked, unlockedAt }) => {
  const { t } = useTranslation('achievements');
  const category = CATEGORY_CONFIG[achievement.category];
  
  return (
    <div 
      className={`achievement-card ${unlocked ? 'achievement-card--unlocked' : 'achievement-card--locked'} ${achievement.secret && !unlocked ? 'achievement-card--secret' : ''}`}
    >
      <div className="achievement-card__icon" style={{ background: category.color }}>
        {achievement.secret && !unlocked ? '❓' : achievement.icon}
      </div>
      <div className="achievement-card__content">
        <div className="achievement-card__name">
          {achievement.secret && !unlocked ? t('hiddenAchievement') : achievement.name}
          {achievement.secret && unlocked && <span className="achievement-card__secret-badge">{t('secret')}</span>}
        </div>
        <div className="achievement-card__description">
          {achievement.secret && !unlocked ? '???' : achievement.description}
        </div>
        <div className="achievement-card__meta">
          <span className="achievement-card__category" style={{ color: category.color }}>
            {category.icon} {t(`categoryLabels.${achievement.category}`)}
          </span>
          {achievement.tier && (
            <span className="achievement-card__tier">
              {'⭐'.repeat(achievement.tier)}
            </span>
          )}
        </div>
        {unlocked && unlockedAt && (
          <div className="achievement-card__unlocked">
            {t('unlocked')} {new Date(unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export const AchievementDashboard: React.FC = () => {
  const { t } = useTranslation('achievements');
  const [activeTab, setActiveTab] = useState<'all' | AchievementCategory>('all');
  const [showSecret, setShowSecret] = useState(false);
  
  const { 
    allAchievements, 
    unlockedAchievements,
    unlockedIds,
    engagementStats,
    discoveryProgress,
  } = useGamification();
  
  const userLevel = useUserLevel();
  
  // Filter achievements based on active tab
  const filteredAchievements = useMemo(() => {
    let achievements = allAchievements;
    
    if (activeTab !== 'all') {
      achievements = achievements.filter(a => a.category === activeTab);
    }
    
    if (!showSecret) {
      achievements = achievements.filter(a => !a.secret || unlockedIds.includes(a.id));
    }
    
    // Sort: unlocked first, then by tier
    return achievements.sort((a, b) => {
      const aUnlocked = unlockedIds.includes(a.id);
      const bUnlocked = unlockedIds.includes(b.id);
      
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      
      return (b.tier || 0) - (a.tier || 0);
    });
  }, [allAchievements, activeTab, showSecret, unlockedIds]);
  
  // Stats
  const stats = useMemo(() => {
    const total = ACHIEVEMENTS.filter(a => !a.secret || unlockedIds.includes(a.id)).length;
    const unlocked = unlockedAchievements.length;
    const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;
    
    const byCategory = Object.entries(CATEGORY_CONFIG).map(([category, config]) => {
      const categoryAchievements = getAchievementsByCategory(category as AchievementCategory)
        .filter(a => !a.secret || unlockedIds.includes(a.id));
      const unlockedInCategory = categoryAchievements.filter(a => 
        unlockedIds.includes(a.id)
      ).length;
      
      return {
        category: category as AchievementCategory,
        config,
        total: categoryAchievements.length,
        unlocked: unlockedInCategory,
        progress: categoryAchievements.length > 0 
          ? Math.round((unlockedInCategory / categoryAchievements.length) * 100)
          : 0,
      };
    });
    
    return { total, unlocked, progress, byCategory };
  }, [unlockedAchievements.length, unlockedIds]);
  
  return (
    <div className="achievement-dashboard">
      {/* Header */}
      <div className="achievement-dashboard__header">
        <h2 className="achievement-dashboard__title">🏆 {t('title')}</h2>
        <div className="achievement-dashboard__subtitle">
          {stats.unlocked} of {stats.total} unlocked ({stats.progress}%)
        </div>
      </div>
      
      {/* User Level Card */}
      <div className="achievement-dashboard__level-card">
        <div className="level-display">
          <div className="level-display__badge" style={{ color: userLevel.color }}>
            <span className="level-display__level">{userLevel.level}</span>
            <span className="level-display__title">{userLevel.title}</span>
          </div>
          <div className="level-display__progress">
            <div className="level-display__progress-bar">
              <div 
                className="level-display__progress-fill" 
                style={{ width: `${userLevel.progress.progress}%`, background: userLevel.color }}
              />
            </div>
            <div className="level-display__progress-text">
              {userLevel.progress.progress.toFixed(0)}% to next level
            </div>
          </div>
        </div>
      </div>
      
      {/* Engagement Stats */}
      <div className="achievement-dashboard__stats">
        <div className="stat-card">
          <div className="stat-card__value">{engagementStats.totalAppOpens}</div>
          <div className="stat-card__label">{t('stats.appOpens')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{engagementStats.longestOpenStreak}</div>
          <div className="stat-card__label">{t('stats.dayStreak')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{Math.floor(engagementStats.totalTimeSpent / 60)}</div>
          <div className="stat-card__label">{t('stats.hoursSpent')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{discoveryProgress}%</div>
          <div className="stat-card__label">{t('stats.featuresFound')}</div>
        </div>
      </div>
      
      {/* Category Progress */}
      <div className="achievement-dashboard__categories">
        {stats.byCategory.map(({ category, config, unlocked, total, progress }) => (
          <button
            key={category}
            className={`category-pill ${activeTab === category ? 'category-pill--active' : ''}`}
            onClick={() => setActiveTab(activeTab === category ? 'all' : category)}
            style={{ 
              '--category-color': config.color,
            } as React.CSSProperties}
          >
            <span className="category-pill__icon">{config.icon}</span>
            <span className="category-pill__label">{t(`categoryLabels.${category}`)}</span>
            <span className="category-pill__count">{unlocked}/{total}</span>
            <div className="category-pill__progress" style={{ width: `${progress}%` }} />
          </button>
        ))}
      </div>
      
      {/* Filters */}
      <div className="achievement-dashboard__filters">
        <button 
          className={`filter-btn ${activeTab === 'all' ? 'filter-btn--active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t('all')}
        </button>
        <label className="filter-checkbox">
          <input 
            type="checkbox" 
            checked={showSecret}
            onChange={(e) => setShowSecret(e.target.checked)}
          />
          {t('showHidden')}
        </label>
      </div>
      
      {/* Achievement Grid */}
      <div className="achievement-dashboard__grid">
        {filteredAchievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            unlocked={unlockedIds.includes(achievement.id)}
            unlockedAt={unlockedAchievements.find(a => a.id === achievement.id)?.unlockedAt}
          />
        ))}
      </div>
      
      {filteredAchievements.length === 0 && (
        <div className="achievement-dashboard__empty">
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <div className="empty-state__text">{t('noAchievements')}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementDashboard;
