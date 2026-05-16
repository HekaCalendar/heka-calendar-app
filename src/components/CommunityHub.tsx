/**
 * Community Hub
 * Epic social center for Holidays & Features voting.
 */

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { trackFeatureDiscovery } from '../services/engagementService';
import i18n from '../i18n';
import { containsProfanity } from '../services/profanityFilter';
import {
  attachCommunityHolidaysListener,
  attachCommunityFeaturesListener,
  seedCommunityFeaturesIfNeeded,
  submitCommunityHoliday,
  voteHoliday,
  voteFeature,
  detachCommunityListeners,
  DEFAULT_FEATURES,
} from '../services/communityService';
import type { CommunityFeature } from '../types';

interface CommunityHubProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabKey = 'holidays' | 'features';

const CATEGORY_COLORS: Record<CommunityFeature['category'], string> = {
  social: '#a78bfa',
  astrology: '#f472b6',
  productivity: '#34d399',
  premium: '#fbbf24',
  integrations: '#60a5fa',
};

const getStatusKey = (status: CommunityFeature['status']) =>
  status === 'in-progress' ? 'inProgress' : status;

const STATUS_BADGE_BG: Record<CommunityFeature['status'], string> = {
  planned: 'rgba(167,139,250,0.15)',
  considering: 'rgba(96,165,250,0.15)',
  released: 'rgba(52,211,153,0.2)',
  'in-progress': 'rgba(251,191,36,0.2)',
};

export const CommunityHub: React.FC<CommunityHubProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('circle');
  const dispatch = useDispatch<AppDispatch>();
  const holidays = useSelector((state: RootState) => state.calendar.communityHolidays);
  const features = useSelector((state: RootState) => state.calendar.communityFeatures);
  const auth = useSelector((state: RootState) => state.calendar.auth);
  const [activeTab, setActiveTab] = useState<TabKey>('holidays');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<{
    holidays: Record<string, 'up' | 'down'>;
    features: Record<string, boolean>;
  }>({ holidays: {}, features: {} });

  // Form state
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const [holidayForm, setHolidayForm] = useState({ name: '', date: '', description: '' });

  // Fallback to default features if Firestore hasn't synced yet
  const displayFeatures = useMemo<CommunityFeature[]>(() => {
    if (features.length > 0) return features;
    return DEFAULT_FEATURES.map((f) => ({ ...f, createdAt: new Date().toISOString() }));
  }, [features]);


  const currentUser = auth.isAuthenticated ? { uid: auth.userId, displayName: auth.displayName } : null;

  useEffect(() => {
    if (!isOpen) return;
    attachCommunityHolidaysListener();
    attachCommunityFeaturesListener();
    seedCommunityFeaturesIfNeeded().catch(() => {});

    // Track discovery
    trackFeatureDiscovery(dispatch, () => ({ calendar: { progress: { featureDiscovery: {} } } } as any), 'viewedCommunityHolidays');

    return () => {
      detachCommunityListeners();
    };
  }, [isOpen, dispatch]);

  // Derive user votes from global state + local memory
  useEffect(() => {
    const uid = currentUser?.uid;
    if (!uid) return;
    const hv: Record<string, 'up' | 'down'> = {};
    holidays.forEach((h) => {
      // Use voterDirections (new schema) first, fall back to voterUids (legacy schema)
      if (h.voterDirections && h.voterDirections[uid]) {
        hv[h.id] = h.voterDirections[uid];
      } else if (h.voterUids?.includes(uid)) {
        hv[h.id] = 'up'; // legacy data: assume upvote
      }
    });
    const fv: Record<string, boolean> = {};
    features.forEach((f) => {
      if (f.voterUids?.includes(uid)) fv[f.id] = true;
    });
    setUserVotes((prev) => ({
      holidays: { ...hv, ...prev.holidays },
      features: { ...fv, ...prev.features },
    }));
  }, [holidays, features, currentUser?.uid]);

  const approvedHolidays = useMemo(
    () => holidays.filter((h) => h.status === 'approved').sort((a, b) => b.votesUp - a.votesUp),
    [holidays]
  );
  const pendingHolidays = useMemo(
    () => holidays.filter((h) => h.status === 'pending').sort((a, b) => b.votesUp - a.votesUp),
    [holidays]
  );

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleHolidaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayForm.name || !holidayForm.date) {
      showToast(t('community.toast.fillNameDate'));
      return;
    }
    // Validate MM-DD format loosely
    const dateClean = holidayForm.date.trim();
    if (!/^\d{1,2}-\d{1,2}$/.test(dateClean)) {
      showToast(t('community.toast.dateFormat'));
      return;
    }
    if (!currentUser) {
      showToast(t('community.toast.signInToSuggest'));
      return;
    }
    if (containsProfanity(holidayForm.name) || containsProfanity(holidayForm.description)) {
      showToast(t('community.toast.keepRespectful'));
      return;
    }
    setIsSubmitting(true);
    try {
      await submitCommunityHoliday({
        name: holidayForm.name.trim(),
        date: dateClean,
        description: holidayForm.description.trim(),
        suggestedBy: currentUser?.displayName || t('community.anonymousStar'),
      });
      trackFeatureDiscovery(dispatch, () => ({ calendar: { progress: { featureDiscovery: {} } } } as any), 'suggestedHoliday');
      setHolidayForm({ name: '', date: '', description: '' });
      setShowHolidayForm(false);
      showToast(t('community.toast.submitted'));
    } catch (err: any) {
      showToast(err?.message || t('community.toast.submitFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHolidayVote = async (id: string, dir: 'up' | 'down') => {
    if (!currentUser) {
      showToast(t('community.toast.signInToVote'));
      return;
    }
    if (userVotes.holidays[id]) return;
    try {
      await voteHoliday(id, dir);
      setUserVotes((prev) => ({ ...prev, holidays: { ...prev.holidays, [id]: dir } }));
    } catch (err: any) {
      console.error('[CommunityHub] Holiday vote error:', err);
      showToast(err?.message || t('community.toast.voteFailed'));
    }
  };

  const handleFeatureVote = async (id: string) => {
    if (!currentUser) {
      showToast(t('community.toast.signInToVote'));
      return;
    }
    if (userVotes.features[id]) return;
    try {
      await voteFeature(id);
      setUserVotes((prev) => ({ ...prev, features: { ...prev.features, [id]: true } }));
    } catch (err: any) {
      console.error('[CommunityHub] Feature vote error:', err);
      showToast(err?.message || t('community.toast.voteFailed'));
    }
  };

  const formatDate = (mmdd: string) => {
    const [m, d] = mmdd.split('-');
    const date = new Date(2024, parseInt(m) - 1, parseInt(d));
    return new Intl.DateTimeFormat(i18n.language || 'en', { month: 'long', day: 'numeric' }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '720px', padding: 0, overflow: 'hidden', border: '1px solid rgba(201,162,74,0.25)' }}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>🌌 {t('community.title')}</h2>
            <p style={styles.subtitle}>{t('community.subtitle')}</p>
          </div>
          <button className="btn btn--icon" onClick={onClose} aria-label={t('community.close')} style={{ color: '#e5e5e5' }}>
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabBar}>
          <button
            onClick={() => setActiveTab('holidays')}
            style={{ ...styles.tab, ...(activeTab === 'holidays' ? styles.tabActive : {}) }}
          >
            {t('community.holidaysTab')}
          </button>
          <button
            onClick={() => setActiveTab('features')}
            style={{ ...styles.tab, ...(activeTab === 'features' ? styles.tabActive : {}) }}
          >
            {t('community.featuresTab')}
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'holidays' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Submit Button */}
              <button
                className="btn btn--primary"
                onClick={() => setShowHolidayForm((s) => !s)}
                style={{ width: '100%' }}
              >
                {showHolidayForm ? t('community.cancel') : t('community.suggestHoliday')}
              </button>

              {/* Holiday Form */}
              {showHolidayForm && (
                <form onSubmit={handleHolidaySubmit} style={styles.glassPanel}>
                  <div style={styles.formGrid}>
                    <div style={styles.field}>
                      <label style={styles.label}>{t('community.holidayName')}</label>
                      <input
                        type="text"
                        value={holidayForm.name}
                        onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
                        placeholder={t('community.placeholderHolidayName')}
                        required
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.field}>
                      <label style={styles.label}>{t('community.dateLabel')}</label>
                      <input
                        type="text"
                        value={holidayForm.date}
                        onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
                        placeholder={t('community.placeholderDate')}
                        required
                        style={styles.input}
                      />
                    </div>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>{t('community.description')}</label>
                    <textarea
                      value={holidayForm.description}
                      onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
                      placeholder={t('community.placeholderDescription')}
                      rows={3}
                      style={styles.textarea}
                    />
                  </div>
                  <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                    {isSubmitting ? t('community.submitting') : t('community.submitSuggestion')}
                  </button>
                </form>
              )}

              {/* Approved Holidays */}
              {approvedHolidays.length > 0 && (
                <div>
                  <h3 style={styles.sectionTitle}>{t('community.officialHolidays')}</h3>
                  <div style={styles.list}>
                    {approvedHolidays.map((h) => (
                      <div key={h.id} style={{ ...styles.card, borderLeft: '4px solid #22c55e' }}>
                        <div style={styles.cardContent}>
                          <div style={styles.cardMeta}>{formatDate(h.date)}</div>
                          <div style={styles.cardTitle}>{h.name}</div>
                          <div style={styles.cardDesc}>{h.description}</div>
                        </div>
                        <div style={styles.voteCol}>
                          <button
                            className="vote-btn"
                            onClick={() => handleHolidayVote(h.id, 'up')}
                            disabled={!!userVotes.holidays[h.id]}
                            style={styles.voteBtn}
                          >
                            ▲
                          </button>
                          <span style={styles.voteCount}>{h.votesUp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Holidays */}
              {pendingHolidays.length > 0 && (
                <div>
                  <h3 style={styles.sectionTitle}>{t('community.pendingSuggestions')}</h3>
                  <div style={styles.list}>
                    {pendingHolidays.map((h) => {
                      const score = h.votesUp - h.votesDown;
                      return (
                        <div key={h.id} style={{ ...styles.card, borderLeft: '4px solid #eab308' }}>
                          <div style={styles.cardContent}>
                            <div style={styles.cardMeta}>{formatDate(h.date)}</div>
                            <div style={styles.cardTitle}>{h.name}</div>
                            <div style={styles.cardDesc}>{h.description}</div>
                            <div style={styles.cardMeta}>{t('community.suggestedBy', { name: h.suggestedBy })}</div>
                            <div style={styles.progressWrap}>
                              <div style={styles.progressTrack}>
                                <div
                                  style={{
                                    ...styles.progressBar,
                                    width: `${Math.min(100, Math.max(0, (h.votesUp / 10) * 100))}%`,
                                    background: '#eab308',
                                  }}
                                />
                              </div>
                              <span style={styles.progressLabel}>{t('community.approvalProgress', { score })}</span>
                            </div>
                          </div>
                          <div style={styles.voteCol}>
                            <button
                              className="vote-btn"
                              onClick={() => handleHolidayVote(h.id, 'up')}
                              disabled={!!userVotes.holidays[h.id]}
                              style={{ ...styles.voteBtn, color: '#22c55e' }}
                            >
                              ▲
                            </button>
                            <span style={styles.voteCount}>{h.votesUp}</span>
                            <button
                              className="vote-btn"
                              onClick={() => handleHolidayVote(h.id, 'down')}
                              disabled={!!userVotes.holidays[h.id]}
                              style={{ ...styles.voteBtn, color: '#ef4444' }}
                            >
                              ▼
                            </button>
                            <span style={{ ...styles.voteCount, color: '#ef4444' }}>{h.votesDown}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {approvedHolidays.length === 0 && pendingHolidays.length === 0 && (
                <div style={styles.empty}>
                  <div style={styles.emptyIcon}>🌱</div>
                  <p>{t('community.noHolidays')}</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Intro */}
              <div style={styles.heroBanner}>
                <div style={styles.heroTitle}>{t('community.heroTitle')}</div>
                <div style={styles.heroSub}>{t('community.heroSubtitle')}</div>
              </div>

              {/* Features Grid */}
              <div style={styles.featuresGrid}>
                {displayFeatures.map((f) => {
                  const hasVoted = !!userVotes.features[f.id];
                  return (
                    <div key={f.id} style={styles.featureCard}>
                      <div style={styles.featureHeader}>
                        <span style={styles.featureIcon}>{f.icon}</span>
                        <span
                          style={{
                            ...styles.badge,
                            background: STATUS_BADGE_BG[f.status],
                            color: CATEGORY_COLORS[f.category],
                          }}
                        >
                          {t(`community.status.${getStatusKey(f.status)}`)}
                        </span>
                      </div>
                      <div style={styles.featureTitle}>{f.title}</div>
                      <div style={styles.featureDesc}>{f.description}</div>
                      <div style={styles.featureFooter}>
                        <span style={{ ...styles.categoryPill, color: CATEGORY_COLORS[f.category], borderColor: CATEGORY_COLORS[f.category] }}>
                          {t(`community.category.${f.category}`)}
                        </span>
                        <button
                          className="btn btn--primary"
                          onClick={() => handleFeatureVote(f.id)}
                          disabled={hasVoted}
                          style={{
                            background: hasVoted ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #c9a227 0%, #a67c00 100%)',
                            color: hasVoted ? '#9ca3af' : '#0a0a0c',
                            border: 'none',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '999px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: hasVoted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          {hasVoted ? t('community.voted') : t('community.vote')}
                          <span style={{ opacity: 0.9 }}>{f.votes}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {features.length === 0 && (
                <div style={styles.empty}>
                  <div style={styles.emptyIcon}>✨</div>
                  <p>{t('community.noFeatures')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={styles.toast}>
          {toast}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    padding: '1.25rem 1.5rem',
    background: 'linear-gradient(135deg, rgba(201,162,74,0.15) 0%, rgba(0,0,0,0) 60%)',
    borderBottom: '1px solid rgba(201,162,74,0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    margin: 0,
    fontSize: '1.35rem',
    fontWeight: 700,
    background: 'linear-gradient(90deg, #f5d78e 0%, #c9a227 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    margin: '0.25rem 0 0',
    fontSize: '0.85rem',
    opacity: 0.85,
    color: '#d4d4d8',
  },
  tabBar: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.2)',
  },
  tab: {
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem 0.5rem 0 0',
    border: 'none',
    background: 'transparent',
    color: '#a1a1aa',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all .2s ease',
  },
  tabActive: {
    color: '#f5d78e',
    background: 'rgba(201,162,74,0.12)',
    boxShadow: '0 -2px 0 #c9a227 inset',
  },
  content: {
    padding: '1.25rem 1.5rem 1.75rem',
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  glassPanel: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '0.75rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#d4d4d8',
  },
  input: {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '0.5rem',
    padding: '0.55rem 0.7rem',
    color: '#f4f4f5',
    fontSize: '0.9rem',
    outline: 'none',
  },
  textarea: {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '0.5rem',
    padding: '0.55rem 0.7rem',
    color: '#f4f4f5',
    fontSize: '0.9rem',
    outline: 'none',
    resize: 'vertical',
    minHeight: '4.5rem',
  },
  sectionTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#e4e4e7',
    margin: '0.25rem 0 0.5rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '0.75rem',
    padding: '0.9rem 1rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    transition: 'transform .15s ease, box-shadow .15s ease',
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  cardMeta: {
    fontSize: '0.75rem',
    color: '#a1a1aa',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#f4f4f5',
  },
  cardDesc: {
    fontSize: '0.85rem',
    color: '#d4d4d8',
    lineHeight: 1.35,
  },
  voteCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.15rem',
    minWidth: '2.5rem',
  },
  voteBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '0.2rem',
    color: '#c9a227',
    opacity: 0.9,
  },
  voteCount: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#f4f4f5',
  },
  progressWrap: {
    marginTop: '0.35rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  progressTrack: {
    flex: 1,
    height: '6px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width .4s ease',
  },
  progressLabel: {
    fontSize: '0.7rem',
    color: '#a1a1aa',
    whiteSpace: 'nowrap',
  },
  empty: {
    textAlign: 'center',
    padding: '2rem 1rem',
    color: '#a1a1aa',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  },
  heroBanner: {
    background: 'linear-gradient(135deg, rgba(201,162,74,0.12) 0%, rgba(139,92,246,0.08) 100%)',
    border: '1px solid rgba(201,162,74,0.18)',
    borderRadius: '0.75rem',
    padding: '1rem 1.25rem',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#f5d78e',
    marginBottom: '0.25rem',
  },
  heroSub: {
    fontSize: '0.85rem',
    color: '#d4d4d8',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '0.9rem',
  },
  featureCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '0.85rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    transition: 'transform .15s ease, box-shadow .15s ease',
  },
  featureHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: '1.6rem',
  },
  badge: {
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '0.2rem 0.5rem',
    borderRadius: '999px',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  featureTitle: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#f4f4f5',
  },
  featureDesc: {
    fontSize: '0.8rem',
    color: '#d4d4d8',
    lineHeight: 1.4,
    flex: 1,
  },
  featureFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.25rem',
  },
  categoryPill: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
    border: '1px solid',
    opacity: 0.9,
  },
  toast: {
    position: 'fixed',
    bottom: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(10,10,12,0.95)',
    color: '#f4f4f5',
    padding: '0.7rem 1.25rem',
    borderRadius: '999px',
    border: '1px solid rgba(201,162,74,0.4)',
    fontSize: '0.9rem',
    fontWeight: 600,
    zIndex: 9999,
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
    pointerEvents: 'none',
  },
};

export default CommunityHub;
