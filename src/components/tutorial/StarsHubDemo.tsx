/**
 * Stars Hub Demo
 * Shows birth charts and astrology features
 */
import React from 'react';
import './elite-visuals.css';

export const StarsHubDemo: React.FC = () => {
  return (
    <div className="elite-visual stars-hub-demo">
      <div className="stars-container">
        <div className="stars-header">
          <div className="stars-icon">✨</div>
          <div className="stars-title">Stars Hub</div>
          <div className="stars-subtitle">Your Cosmic Fingerprint</div>
        </div>
        
        <div className="birth-chart-preview">
          <div className="chart-wheel">
            <div className="wheel-center">★</div>
            <div className="wheel-ring">
              {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((sign, i) => (
                <div 
                  key={sign}
                  className="zodiac-marker"
                  style={{ transform: `rotate(${i * 30}deg) translateY(-60px)` }}
                >
                  {sign}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="stars-features">
          <div className="star-feature">
            <div className="star-icon">🌟</div>
            <div className="star-text">Natal Chart</div>
          </div>
          <div className="star-feature">
            <div className="star-icon">🪐</div>
            <div className="star-text">Transits</div>
          </div>
          <div className="star-feature">
            <div className="star-icon">💫</div>
            <div className="star-text">Compatibility</div>
          </div>
        </div>
        
        <div className="stars-note">
          Create your profile for personalized daily guidance
        </div>
      </div>
    </div>
  );
};
