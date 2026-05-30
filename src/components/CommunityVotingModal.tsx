/**
 * Community Voting Modal
 * Holiday voting + feature voting — restored to the month header community button.
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

interface CommunityVotingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'holidays' | 'features';

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

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{ paddingTop: 'max(var(--space-8), 6vh)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto' }}>
        <div className="modal__header">
          <h2 className="modal__title">🌍 {t('features.communityHolidays')}</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
          <button
            className={`btn btn--sm ${activeTab === 'holidays' ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setActiveTab('holidays')}
          >
            🎉 Holidays
          </button>
          <button
            className={`btn btn--sm ${activeTab === 'features' ? 'btn--primary' : 'btn--ghost'}`}
            onClick={() => setActiveTab('features')}
          >
            🚀 Features
          </button>
        </div>

        {activeTab === 'holidays' && (
          <div>
            {/* Submit new holiday */}
            <form onSubmit={handleSubmitHoliday} style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                <input
                  className="input"
                  placeholder="Holiday name"
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday((p) => ({ ...p, name: e.target.value }))}
                  maxLength={60}
                />
                <input
                  className="input"
                  placeholder="Date (MM-DD)"
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday((p) => ({ ...p, date: e.target.value }))}
                  maxLength={5}
                />
                <input
                  className="input"
                  placeholder="Description (optional)"
                  value={newHoliday.description}
                  onChange={(e) => setNewHoliday((p) => ({ ...p, description: e.target.value }))}
                  maxLength={200}
                />
                <button className="btn btn--sm btn--primary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Suggest Holiday'}
                </button>
                {submitError && <div className="error-text" style={{ fontSize: '0.875rem' }}>{submitError}</div>}
              </div>
            </form>

            {/* Holidays list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {holidays.length === 0 && (
                <div className="empty-state" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🌑</div>
                  <p>No holidays yet. Be the first to suggest one.</p>
                </div>
              )}
              {holidays.map((h) => (
                <div
                  key={h.id}
                  className="card"
                  style={{
                    padding: 'var(--space-3)',
                    opacity: h.status === 'rejected' ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {h.name} <span style={{ opacity: 0.6, fontWeight: 400 }}>({h.date})</span>
                      </div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '2px' }}>{h.description}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '4px' }}>
                        By {h.suggestedBy} · {h.status}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <button
                        className={`btn btn--xs ${h.voterDirections?.[user?.uid || ''] === 'up' ? 'btn--primary' : 'btn--ghost'}`}
                        onClick={() => handleVoteHoliday(h.id, 'up')}
                        disabled={!user || votingId === h.id}
                        title="Upvote"
                      >
                        ▲ {h.votesUp}
                      </button>
                      <button
                        className={`btn btn--xs ${h.voterDirections?.[user?.uid || ''] === 'down' ? 'btn--danger' : 'btn--ghost'}`}
                        onClick={() => handleVoteHoliday(h.id, 'down')}
                        disabled={!user || votingId === h.id}
                        title="Downvote"
                      >
                        ▼ {h.votesDown}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {features.length === 0 && (
                <div className="empty-state" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>🚀</div>
                  <p>Loading features...</p>
                </div>
              )}
              {features.map((f) => (
                <div key={f.id} className="card" style={{ padding: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        <span style={{ marginRight: '6px' }}>{f.icon}</span>
                        {f.title}
                      </div>
                      <div style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '2px' }}>{f.description}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '4px' }}>
                        {f.category} · {f.status} · {f.votes} votes
                      </div>
                    </div>
                    <button
                      className={`btn btn--xs ${hasVotedFeature(f) ? 'btn--primary' : 'btn--ghost'}`}
                      onClick={() => handleVoteFeature(f.id)}
                      disabled={!user || votingId === f.id || hasVotedFeature(f)}
                      title={hasVotedFeature(f) ? 'Voted' : 'Vote'}
                    >
                      {hasVotedFeature(f) ? '✓' : '▲'} {f.votes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!user && (
          <div style={{ textAlign: 'center', padding: 'var(--space-3)', opacity: 0.6, fontSize: '0.875rem' }}>
            Sign in to vote and submit holidays.
          </div>
        )}
      </div>
    </div>
  );
};
