/**
 * Celestial Guide Demo
 * Shows the AI astrology assistant
 */
import React from 'react';
import './elite-visuals.css';

export const CelestialGuideDemo: React.FC = () => {
  return (
    <div className="elite-visual celestial-guide-demo">
      <div className="guide-container">
        <div className="guide-header">
          <div className="guide-icon">🔮</div>
          <div className="guide-title">Celestial Guide</div>
          <div className="guide-subtitle">AI-Powered Astrology</div>
        </div>
        
        <div className="guide-chat-preview">
          <div className="chat-bubble guide">
            <div className="chat-avatar">🔮</div>
            <div className="chat-text">
              The Moon in Libra harmonizes with your Sun today. 
              A good time for partnerships and balance.
            </div>
          </div>
          
          <div className="chat-bubble user">
            <div className="chat-text">
              What about my career?
            </div>
          </div>
          
          <div className="chat-bubble guide">
            <div className="chat-avatar">🔮</div>
            <div className="chat-text">
              Mars energizes your 10th house. Take initiative 
              on professional goals today.
            </div>
          </div>
        </div>
        
        <div className="guide-features">
          <div className="guide-feature">
            <span className="guide-check">⚡</span>
            <span>Instant interpretations</span>
          </div>
          <div className="guide-feature">
            <span className="guide-check">🎯</span>
            <span>Personalized insights</span>
          </div>
          <div className="guide-feature">
            <span className="guide-check">💬</span>
            <span>Ask anything</span>
          </div>
        </div>
      </div>
    </div>
  );
};
