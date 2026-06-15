/**
 * Community Voting Modal
 * Holiday voting + feature voting — enterprise-grade redesign.
 */

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '../store';
import type { CommunityFeature } from '../types';
import {
  attachCommunityHolidaysListener,
  attachCommunityFeaturesListener,
  detachCommunityListeners,
  voteHoliday,
  voteFeature,
  submitCommunityHoliday,
  seedCommunityFeaturesIfNeeded,
} from '../services/communityService';
import { getCurrentUser } from '../services/firebase';
import '../styles/community-voting.css';

interface CommunityVotingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'holidays' | 'features';

const BallotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M12 3v5" />
    <path d="M8 8l4-4 4 4" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const statusBadgeClass = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'approved': return 'voting-card__badge--approved';
    case 'rejected': return 'voting-card__badge--rejected';
    case 'planned': return 'voting-card__badge--planned';
    default: return 'voting-card__badge--pending';
  }
};

const statusLabel = (status?: string) => {
  if (!status) return 'Pending';
  return status.charAt(0).toUpperCase() + status.slice(1);
};

export const CommunityVotingModal: React.FC<CommunityVotingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation('calendar');
  const [activeTab, setActiveTab] = useState<Tab>('holidays');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', description: '' });
  const [votingId, setVotingId] = useState<string | null>(null);

  const holidays = useSelector((state: RootState) => state.calendar.communityHolidays);
  const features = useSelector((state: RootState) => state.calendar.communityFeatures);
  const user = getCurrentUser();

  useEffect(() => {
    if (!isOpen) return;
    attachCommunityHolidaysListener();
    attachCommunityFeaturesListener();
    seedCommunityFeaturesIfNeeded().catch(() => {});
    return () => {
      detachCommunityListeners();
    };
  }, [isOpen]);

  const handleVoteHoliday = useCallback(
    async (id: string, direction: 'up' | 'down') => {
      if (!user || votingId) return;
      setVotingId(id);
      try {
        await voteHoliday(id, direction);
      } catch (err) {
        console.error('Vote failed:', err);
      } finally {
        setVotingId(null);
      }
    },
    [user, votingId]
  );

  const handleVoteFeature = useCallback(
    async (id: string) => {
      if (!user || votingId) return;
      setVotingId(id);
      try {
        await voteFeature(id);
      } catch (err) {
        console.error('Vote failed:', err);
      } finally {
        setVotingId(null);
      }
    },
    [user, votingId]
  );

  const handleSubmitHoliday = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
        setSubmitError(t('errors.notAuthenticated', { ns: 'circle' }) || 'Please sign in to submit.');
        return;
      }
      if (!newHoliday.name.trim() || !newHoliday.date.trim()) return;

      setIsSubmitting(true);
      setSubmitError(null);
      try {
        await submitCommunityHoliday({
          name: newHoliday.name.trim(),
          date: newHoliday.date.trim(),
          description: newHoliday.description.trim(),
          suggestedBy: user.displayName || user.email || 'Anonymous',
        });
        setNewHoliday({ name: '', date: '', description: '' });
      } catch (err) {
        setSubmitError((err as Error).message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, newHoliday, t]
  );

  const hasVotedFeature = (f: CommunityFeature) => {
    if (!user) return false;
    return f.voterUids?.includes(user.uid);
  };

  const hasVotedHoliday = (h: any, direction: 'up' | 'down') => {
    if (!user) return false;
    return h.voterDirections?.[user.uid] === direction;
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{ paddingTop: 'max(var(--space-8), 6vh)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="voting-modal">
        {/* Header */}
        <div className="voting-modal__header">
          <h2 className="voting-modal__title">
            <span className="voting-modal__title-icon">
              <BallotIcon />
            </span>
            {t('features.vote', 'Vote')}
          </h2>
          <button className="voting-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="voting-modal__body">
          {/* Tabs */}
          <div className="voting-tabs">
            <button
              className={`voting-tab ${activeTab === 'holidays' ? 'voting-tab--active' : ''}`}
              onClick={() => setActiveTab('holidays')}
            >
              <span className="voting-tab__icon">🎉</span>
              Holidays
            </button>
            <button
              className={`voting-tab ${activeTab === 'features' ? 'voting-tab--active' : ''}`}
              onClick={() => setActiveTab('features')}
            >
              <span className="voting-tab__icon">🚀</span>
              Features
            </button>
          </div>

          {/* Holidays Tab */}
          {activeTab === 'holidays' && (
            <div>
              {/* Submit Form */}
              <form onSubmit={handleSubmitHoliday} className="voting-form">
                <div className="voting-form__grid">
                  <div className="voting-form__row">
                    <input
                      className="voting-input"
                      placeholder="Holiday name"
                      value={newHoliday.name}
                      onChange={(e) => setNewHoliday((p) => ({ ...p, name: e.target.value }))}
                      maxLength={60}
                    />
                    <input
                      className="voting-input"
                      placeholder="Date (MM-DD)"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday((p) => ({ ...p, date: e.target.value }))}
                      maxLength={5}
                    />
                  </div>
                  <input
                    className="voting-input"
                    placeholder="Description (optional)"
                    value={newHoliday.description}
                    onChange={(e) => setNewHoliday((p) => ({ ...p, description: e.target.value }))}
                    maxLength={200}
                  />
                  <button className="voting-form__submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting…' : 'Suggest Holiday'}
                  </button>
                  {submitError && <div className="voting-form__error">{submitError}</div>}
                </div>
              </form>

              {/* Holidays List */}
              <div className="voting-list">
                {holidays.length === 0 && (
                  <div className="voting-empty">
                    <div className="voting-empty__icon">🌑</div>
                    <div className="voting-empty__title">No holidays yet</div>
                    <div className="voting-empty__desc">Be the first to suggest a community holiday.</div>
                  </div>
                )}
                {holidays.map((h) => (
                  <div
                    key={h.id}
                    className={`voting-card ${h.status === 'rejected' ? 'voting-card--rejected' : ''}`}
                  >
                    <div className="voting-card__row">
                      <div className="voting-card__content">
                        <div className="voting-card__title">
                          {h.name}{' '}
                          <span style={{ opacity: 0.55, fontWeight: 400 }}>({h.date})</span>
                        </div>
                        {h.description && (
                          <div className="voting-card__desc">{h.description}</div>
                        )}
                        <div className="voting-card__byline">
                          <span>By {h.suggestedBy}</span>
                          <span className="voting-card__byline-dot" />
                          <span className={`voting-card__badge ${statusBadgeClass(h.status)}`}>
                            {statusLabel(h.status)}
                          </span>
                        </div>
                      </div>
                      <div className="voting-actions">
                        <button
                          className={`vote-btn vote-btn--up ${hasVotedHoliday(h, 'up') ? 'vote-btn--active' : ''}`}
                          onClick={() => handleVoteHoliday(h.id, 'up')}
                          disabled={!user || votingId === h.id}
                          title="Upvote"
                        >
                          <span className="vote-btn__icon">
                            <ChevronUpIcon />
                          </span>
                          {h.votesUp}
                        </button>
                        <button
                          className={`vote-btn vote-btn--down ${hasVotedHoliday(h, 'down') ? 'vote-btn--active' : ''}`}
                          onClick={() => handleVoteHoliday(h.id, 'down')}
                          disabled={!user || votingId === h.id}
                          title="Downvote"
                        >
                          <span className="vote-btn__icon">
                            <ChevronDownIcon />
                          </span>
                          {h.votesDown}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div>
              <div className="voting-list">
                {features.length === 0 && (
                  <div className="voting-empty">
                    <div className="voting-empty__icon">🚀</div>
                    <div className="voting-empty__title">Loading features…</div>
                    <div className="voting-empty__desc">Community feature requests will appear here.</div>
                  </div>
                )}
                {features.map((f) => (
                  <div key={f.id} className="voting-card">
                    <div className="voting-card__row">
                      <div className="voting-card__content">
                        <div className="voting-card__title">
                          <span style={{ marginRight: '6px' }}>{f.icon}</span>
                          {f.title}
                        </div>
                        <div className="voting-card__desc">{f.description}</div>
                        <div className="voting-card__byline">
                          <span>{f.category}</span>
                          <span className="voting-card__byline-dot" />
                          <span className={`voting-card__badge ${statusBadgeClass(f.status)}`}>
                            {statusLabel(f.status)}
                          </span>
                          <span className="voting-card__byline-dot" />
                          <span>{f.votes} votes</span>
                        </div>
                      </div>
                      <div className="voting-actions">
                        <button
                          className={`vote-btn vote-btn--feature ${hasVotedFeature(f) ? 'vote-btn--active' : ''}`}
                          onClick={() => handleVoteFeature(f.id)}
                          disabled={!user || votingId === f.id || hasVotedFeature(f)}
                          title={hasVotedFeature(f) ? 'Voted' : 'Vote'}
                        >
                          <span className="vote-btn__icon">
                            {hasVotedFeature(f) ? <CheckIcon /> : <ChevronUpIcon />}
                          </span>
                          {f.votes}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auth Banner */}
          {!user && (
            <div className="voting-auth-banner">
              <span>🔒</span>
              <span>Sign in to vote and submit holidays.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityVotingModal;
