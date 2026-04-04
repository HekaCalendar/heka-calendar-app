/**
 * Community Holidays Component
 * Browse, vote on, and suggest community holidays
 */

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { addCommunityHoliday, voteForHoliday } from '../store';
import type { CommunityHoliday } from '../types';

interface CommunityHolidaysProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityHolidays: React.FC<CommunityHolidaysProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const holidays = useSelector((state: RootState) => state.calendar.communityHolidays);
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    description: '',
  });
  
  if (!isOpen) return null;
  
  // Sort holidays by votes
  const sortedHolidays = [...holidays].sort((a, b) => b.votes - a.votes);
  const approvedHolidays = sortedHolidays.filter(h => h.approved);
  const pendingHolidays = sortedHolidays.filter(h => !h.approved);
  
  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoliday.name || !newHoliday.date) return;
    
    const holiday: CommunityHoliday = {
      id: Date.now().toString(),
      name: newHoliday.name,
      date: newHoliday.date, // MM-DD format
      description: newHoliday.description,
      suggestedBy: 'You',
      votes: 1,
      approved: false,
      createdAt: new Date().toISOString(),
    };
    
    dispatch(addCommunityHoliday(holiday));
    setNewHoliday({ name: '', date: '', description: '' });
    setShowSuggestionForm(false);
  };
  
  const formatDate = (mmdd: string) => {
    const [month, day] = mmdd.split('-');
    const date = new Date(2024, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };
  
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: '600px' }}>
        <div className="modal__header">
          <h2 className="modal__title">🌍 Community Holidays</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        {/* Description */}
        <div className="community-intro">
          <p>
            Suggest and vote on new observances for the HEKA calendar. 
            Top-voted suggestions become official community holidays.
          </p>
        </div>
        
        {/* Suggestion Button */}
        <button
          className="btn btn--primary"
          onClick={() => setShowSuggestionForm(!showSuggestionForm)}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {showSuggestionForm ? 'Cancel' : '+ Suggest New Holiday'}
        </button>
        
        {/* Suggestion Form */}
        {showSuggestionForm && (
          <form onSubmit={handleSubmitSuggestion} className="suggestion-form">
            <div className="form-group">
              <label>Holiday Name</label>
              <input
                type="text"
                value={newHoliday.name}
                onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                placeholder="e.g., Global Meditation Day"
                required
              />
            </div>
            <div className="form-group">
              <label>Date (MM-DD)</label>
              <input
                type="text"
                value={newHoliday.date}
                onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                placeholder="e.g., 04-22"
                pattern="\d{2}-\d{2}"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newHoliday.description}
                onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })}
                placeholder="Why should this be a HEKA holiday?"
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn--primary">
              Submit Suggestion
            </button>
          </form>
        )}
        
        {/* Approved Holidays */}
        {approvedHolidays.length > 0 && (
          <div className="holidays-section">
            <h3 className="holidays-section-title">✓ Official Community Holidays</h3>
            <div className="holidays-list">
              {approvedHolidays.map(holiday => (
                <div key={holiday.id} className="holiday-card approved">
                  <div className="holiday-info">
                    <div className="holiday-date">{formatDate(holiday.date)}</div>
                    <div className="holiday-name">{holiday.name}</div>
                    <div className="holiday-description">{holiday.description}</div>
                  </div>
                  <div className="holiday-votes">
                    <button 
                      className="vote-btn"
                      onClick={() => dispatch(voteForHoliday(holiday.id))}
                    >
                      ▲
                    </button>
                    <span className="vote-count">{holiday.votes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Pending Suggestions */}
        {pendingHolidays.length > 0 && (
          <div className="holidays-section">
            <h3 className="holidays-section-title">🗳️ Pending Suggestions</h3>
            <div className="holidays-list">
              {pendingHolidays.map(holiday => (
                <div key={holiday.id} className="holiday-card pending">
                  <div className="holiday-info">
                    <div className="holiday-date">{formatDate(holiday.date)}</div>
                    <div className="holiday-name">{holiday.name}</div>
                    <div className="holiday-description">{holiday.description}</div>
                    <div className="holiday-author">Suggested by {holiday.suggestedBy}</div>
                  </div>
                  <div className="holiday-votes">
                    <button 
                      className="vote-btn"
                      onClick={() => dispatch(voteForHoliday(holiday.id))}
                    >
                      ▲
                    </button>
                    <span className="vote-count">{holiday.votes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {holidays.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <p>No community holidays yet. Be the first to suggest one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityHolidays;
