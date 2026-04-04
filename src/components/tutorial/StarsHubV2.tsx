/**
 * Stars Hub V2 - ACCURATE
 */
import React from 'react';
import './elite-visuals.css';

export const StarsHubV2: React.FC = () => {
  return (
    <div className="elite-visual stars-hub-v2">
      <div className="v2-stars-container">
        <div className="v2-stars-header">
          <div className="v2-stars-icon">✨</div>
          <h3 className="v2-stars-title">Stars Hub</h3>
          <p className="v2-stars-subtitle">Your Cosmic Fingerprint</p>
        </div>
        
        <div className="v2-chart-preview">
          <div className="v2-wheel">
            <div className="v2-wheel-center">★</div>
            {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((sign, i) => (
              <div 
                key={sign}
                className="v2-zodiac-mark"
                style={{ transform: `rotate(${i * 30}deg) translateY(-50px)` }}
              >
                {sign}
              </div>
            ))}
          </div>
        </div>
        
        <div className="v2-stars-features">
          <div className="v2-star-item">
            <span>🌟</span> Natal Birth Chart
          </div>
          <div className="v2-star-item">
            <span>🪐</span> Planetary Transits
          </div>
          <div className="v2-star-item">
            <span>💫</span> Compatibility Analysis
          </div>
        </div>
        
        <p className="v2-stars-note">
          Create your profile for personalized daily guidance
        </p>
      </div>
    </div>
  );
};
