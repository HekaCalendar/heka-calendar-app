/**
 * Energy Vote Card Component
 * Allows users to vote on daily energy (1-10) and see community results
 */

import { useState, useEffect } from 'react';
import { 
  castVote, 
  getDailyEnergyResult, 
  getEnergyLevelDescription,
  getCommunityGuidance,
  type DailyEnergyResult 
} from '../services/energyVoteService';

interface EnergyVoteCardProps {
  date?: Date;
}

export const EnergyVoteCard: React.FC<EnergyVoteCardProps> = ({ date = new Date() }) => {
  const [result, setResult] = useState<DailyEnergyResult | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showVoteForm, setShowVoteForm] = useState(false);
  
  useEffect(() => {
    const data = getDailyEnergyResult(date);
    setResult(data);
    if (data.userVote) {
      setSelectedRating(data.userVote);
      setHasVoted(true);
    }
  }, [date]);
  
  const handleVote = () => {
    if (selectedRating && castVote(selectedRating, date)) {
      setHasVoted(true);
      setResult(getDailyEnergyResult(date));
      setShowVoteForm(false);
    }
  };
  
  if (!result) return null;
  
  // Check if we have actual vote data
  const hasVotes = result.averageRating !== null && result.totalVotes > 0;
  
  const energyLevel = hasVotes ? getEnergyLevelDescription(result.averageRating!) : null;
  const communityGuidance = hasVotes ? getCommunityGuidance(result.averageRating!) : null;
  
  // Calculate percentage for visual bar
  const percentage = hasVotes ? (result.averageRating! / 10) * 100 : 0;
  
  return (
    <div className="energy-vote-card">
      <div className="energy-vote-card__header">
        <span className="energy-vote-card__icon">🌍</span>
        <div className="energy-vote-card__title-group">
          <span className="energy-vote-card__title">Community Energy</span>
          <span className="energy-vote-card__subtitle">
            {result.totalVotes} contributors worldwide
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
            <span className="energy-vote-emoji">{energyLevel!.emoji}</span>
            <span className="energy-vote-label" style={{ color: energyLevel!.color }}>
              {energyLevel!.label}
            </span>
          </div>
          
          {/* Visual Bar */}
          <div className="energy-vote-bar-container">
            <div className="energy-vote-bar-bg">
              <div 
                className="energy-vote-bar-fill"
                style={{ 
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, ${energyLevel!.color}80, ${energyLevel!.color})`
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
            <span className="energy-vote-empty-text">No energy votes recorded</span>
          </div>
        </div>
      )}
      
      {/* Community Guidance - only show when we have votes */}
      {hasVotes && (
        <div className="energy-vote-guidance">
          <p>{communityGuidance}</p>
        </div>
      )}
      
      {/* Voting Section */}
      {result.votingOpen ? (
        <div className="energy-vote-section">
          {hasVoted ? (
            <div className="energy-vote-thanks">
              <span className="energy-vote-check">✓</span>
              <span>Thank you for voting! Results shared tomorrow.</span>
            </div>
          ) : showVoteForm ? (
            <div className="energy-vote-form">
              <p className="energy-vote-question">How was your energy today? (1-10)</p>
              <div className="energy-vote-options">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    className={`energy-vote-option ${selectedRating === num ? 'selected' : ''}`}
                    onClick={() => setSelectedRating(num)}
                    title={getEnergyLevelDescription(num).label}
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
              <p>Voting closes at {result.votingClosesAt}</p>
              <button 
                className="btn btn--primary energy-vote-btn"
                onClick={() => setShowVoteForm(true)}
              >
                🗳️ Vote Your Energy
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="energy-vote-closed">
          <p>Voting closed at {result.votingClosesAt}</p>
          <p className="energy-vote-next">Tomorrow's voting opens at midnight</p>
        </div>
      )}
    </div>
  );
};

export default EnergyVoteCard;
