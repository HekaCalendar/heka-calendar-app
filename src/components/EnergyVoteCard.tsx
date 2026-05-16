/**
 * Energy Vote Card Component
 * Allows users to vote on daily energy (1-10) and see community results
 * Shows real-time aggregated data from Firebase when available
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Unsubscribe } from 'firebase/firestore';
import { 
  castVote, 
  getDailyEnergyResult, 
  subscribeToCommunityEnergy,
  getEnergyLevelDescription,
  getCommunityGuidance,
  type DailyEnergyResult 
} from '../services/energyVoteService';

interface EnergyVoteCardProps {
  date?: Date;
}

export const EnergyVoteCard: React.FC<EnergyVoteCardProps> = ({ date = new Date() }) => {
  const { t } = useTranslation('circle');
  const [result, setResult] = useState<DailyEnergyResult | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showVoteForm, setShowVoteForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const unsubRef = useRef<Unsubscribe | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Start with local data for immediate render
    const localData = getDailyEnergyResult(date);
    setResult(localData);
    if (localData.userVote) {
      setSelectedRating(localData.userVote);
      setHasVoted(true);
    }
    setIsLoading(false);
    
    // Subscribe to real-time community data from Firebase
    const unsub = subscribeToCommunityEnergy(date, (communityData) => {
      setResult(communityData);
      if (communityData.userVote) {
        setSelectedRating(communityData.userVote);
        setHasVoted(true);
      }
    });
    
    if (unsub) {
      unsubRef.current = unsub;
    }
    
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [date]);
  
  const handleVote = () => {
    if (selectedRating && castVote(selectedRating, date)) {
      setHasVoted(true);
      // Optimistically update the local result
      setResult(getDailyEnergyResult(date));
      setShowVoteForm(false);
    }
  };
  
  if (isLoading || !result) return null;
  
  // Check if we have actual vote data
  const hasVotes = result.averageRating !== null && result.totalVotes > 0;
  
  const energyLevelKey = hasVotes ? getEnergyLevelDescription(result.averageRating!) : null;
  const communityGuidanceKey = hasVotes ? getCommunityGuidance(result.averageRating!) : null;
  
  // Calculate percentage for visual bar
  const percentage = hasVotes ? (result.averageRating! / 10) * 100 : 0;
  
  return (
    <div className="energy-vote-card">
      <div className="energy-vote-card__header">
        <span className="energy-vote-card__icon">🌍</span>
        <div className="energy-vote-card__title-group">
          <span className="energy-vote-card__title">{t('voting.title')}</span>
          <span className="energy-vote-card__subtitle">
            {t('voting.contributors', { count: result.totalVotes })}
          </span>
        </div>
      </div>
      
      {/* Energy Display */}
      {hasVotes ? (
        <div className="energy-vote-display">
          <div className="energy-vote-rating">
            <span className="energy-vote-number">{result.averageRating!.toFixed(1)}</span>
            <span className="energy-vote-outof">/10</span>
          </div>
          <div className="energy-vote-level">
            <span className="energy-vote-emoji">{energyLevelKey!.emoji}</span>
            <span className="energy-vote-label" style={{ color: energyLevelKey!.color }}>
              {t(energyLevelKey!.label)}
            </span>
          </div>
          
          {/* Visual Bar */}
          <div className="energy-vote-bar-container">
            <div className="energy-vote-bar-bg">
              <div 
                className="energy-vote-bar-fill"
                style={{ 
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, ${energyLevelKey!.color}80, ${energyLevelKey!.color})`
                }}
              />
            </div>
            <div className="energy-vote-scale">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="energy-vote-display energy-vote-display--empty">
          <div className="energy-vote-empty">
            <span className="energy-vote-empty-icon">🌍</span>
            <span className="energy-vote-empty-text">{t('voting.noVotes')}</span>
          </div>
        </div>
      )}
      
      {/* Community Guidance - only show when we have votes */}
      {hasVotes && (
        <div className="energy-vote-guidance">
          <p>{communityGuidanceKey ? t(communityGuidanceKey) : ''}</p>
        </div>
      )}
      
      {/* Voting Section */}
      {result.votingOpen ? (
        <div className="energy-vote-section">
          {hasVoted ? (
            <div className="energy-vote-thanks">
              <span className="energy-vote-check">✓</span>
              <span>{t('voting.thanks')}</span>
            </div>
          ) : showVoteForm ? (
            <div className="energy-vote-form">
              <p className="energy-vote-question">{t('voting.question')}</p>
              <div className="energy-vote-options">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    className={`energy-vote-option ${selectedRating === num ? 'selected' : ''}`}
                    onClick={() => setSelectedRating(num)}
                    title={t(getEnergyLevelDescription(num).label)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="energy-vote-actions">
                <button 
                  className="btn btn--primary"
                  onClick={handleVote}
                  disabled={!selectedRating}
                >
                  Submit Vote
                </button>
                <button 
                  className="btn"
                  onClick={() => setShowVoteForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="energy-vote-cta">
              <p>{t('voting.closesAt', { time: result.votingClosesAt })}</p>
              <button 
                className="btn btn--primary energy-vote-btn"
                onClick={() => setShowVoteForm(true)}
              >
                {t('voting.cta')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="energy-vote-closed">
          <p>{t('voting.closedAt', { time: result.votingClosesAt })}</p>
          <p className="energy-vote-next">{t('voting.opensTomorrow')}</p>
        </div>
      )}
    </div>
  );
};

export default EnergyVoteCard;
