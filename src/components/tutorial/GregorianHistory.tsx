/**
 * Gregorian History Visual
 * March was first, Sept=7, Oct=8, April Fools history
 */
import React from 'react';
import './gregorian-history.css';

export const GregorianHistory: React.FC = () => {
  return (
    <div className="gh-visual">
      {/* Original Calendar */}
      <div className="gh-original">
        <div className="gh-title">Original Roman Calendar</div>
        <div className="gh-march-first">
          <span className="gh-martius">MARTIUS</span>
          <span className="gh-god">⚔️ Mars</span>
          <span className="gh-note">The First Month</span>
        </div>
        
        <div className="gh-months-row">
          <div className="gh-month-box">
            <span className="gh-num">I</span>
            <span className="gh-name">March</span>
          </div>
          <div className="gh-month-box">
            <span className="gh-num">II</span>
            <span className="gh-name">April</span>
          </div>
          <div className="gh-month-box">
            <span className="gh-num">III</span>
            <span className="gh-name">May</span>
          </div>
          <div className="gh-month-box">
            <span className="gh-num">IV</span>
            <span className="gh-name">June</span>
          </div>
        </div>
      </div>

      {/* The Number Shift */}
      <div className="gh-numbers-lie">
        <div className="gh-section-title">The Number Shift</div>
        <div className="gh-number-grid">
          <div className="gh-num-item">
            <span className="gh-roman">SEPT</span>
            <span className="gh-meaning">7</span>
            <span className="gh-position">9th month</span>
          </div>
          <div className="gh-num-item">
            <span className="gh-roman">OCT</span>
            <span className="gh-meaning">8</span>
            <span className="gh-position">10th month</span>
          </div>
          <div className="gh-num-item">
            <span className="gh-roman">NOV</span>
            <span className="gh-meaning">9</span>
            <span className="gh-position">11th month</span>
          </div>
          <div className="gh-num-item">
            <span className="gh-roman">DEC</span>
            <span className="gh-meaning">10</span>
            <span className="gh-position">12th month</span>
          </div>
        </div>
      </div>

      {/* April Fools */}
      <div className="gh-april-fools">
        <div className="gh-fools-header">
          <span className="gh-fools-emoji">🃏</span>
          <span className="gh-fools-title">April Fools' Day</span>
        </div>
        <div className="gh-fools-story">
          <div className="gh-story-part">
            <span className="gh-year">Before 1564</span>
            <span className="gh-event">New Year celebrated in April</span>
          </div>
          <div className="gh-arrow">⬇️</div>
          <div className="gh-story-part">
            <span className="gh-year">1564</span>
            <span className="gh-event">King Charles IX moved it to January</span>
          </div>
          <div className="gh-arrow">⬇️</div>
          <div className="gh-story-part">
            <span className="gh-year">After</span>
            <span className="gh-event">"Fools" still celebrated in April</span>
          </div>
        </div>
      </div>

      {/* Alternative Rhythm */}
      <div className="gh-cost">
        <span className="gh-cost-text">HEKA offers a return to cosmic alignment</span>
      </div>
    </div>
  );
};

export default GregorianHistory;
