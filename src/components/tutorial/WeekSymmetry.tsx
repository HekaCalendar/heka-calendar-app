/**
 * Week Symmetry Visual
 * Shows 52 perfect weeks, quarterly breakdown
 */
import React from 'react';
import './week-symmetry.css';

export const WeekSymmetry: React.FC = () => {
  return (
    <div className="ws-visual">
      {/* Main Math */}
      <div className="ws-equation">
        <div className="ws-part">
          <span className="ws-number">13</span>
          <span className="ws-label">months</span>
        </div>
        <span className="ws-operator">×</span>
        <div className="ws-part">
          <span className="ws-number">4</span>
          <span className="ws-label">weeks</span>
        </div>
        <span className="ws-operator">=</span>
        <div className="ws-part result">
          <span className="ws-number">52</span>
          <span className="ws-label">perfect weeks</span>
        </div>
      </div>

      {/* Benefits */}
      <div className="ws-benefits">
        <div className="ws-benefit">
          <span className="ws-icon">📅</span>
          <span className="ws-text">No fractional days</span>
        </div>
        <div className="ws-benefit">
          <span className="ws-icon">🎯</span>
          <span className="ws-text">13-week quarters</span>
        </div>
        <div className="ws-benefit">
          <span className="ws-icon">🎂</span>
          <span className="ws-text">Same day, same weekday within each year</span>
        </div>
      </div>

      {/* Quarter visualization - Q4 is longer due to March */}
      <div className="ws-quarters">
        <div className="ws-quarter q1">
          <span className="ws-q-num">Q1</span>
          <span className="ws-q-range">Apr — Jun</span>
          <span className="ws-q-days">84 days</span>
        </div>
        <div className="ws-quarter q2">
          <span className="ws-q-num">Q2</span>
          <span className="ws-q-range">Jul — Hex</span>
          <span className="ws-q-days">84 days</span>
        </div>
        <div className="ws-quarter q3">
          <span className="ws-q-num">Q3</span>
          <span className="ws-q-range">Sep — Nov</span>
          <span className="ws-q-days">84 days</span>
        </div>
        <div className="ws-quarter q4 extended">
          <span className="ws-q-num">Q4</span>
          <span className="ws-q-range">Dec — Mar</span>
          <span className="ws-q-days">113-114 days ★</span>
        </div>
      </div>

      {/* Q4 Note */}
      <div className="ws-q4-note">
        <span>★ Q4 includes March's 29/30 days — the closing arc with holidays & reflection time</span>
      </div>
    </div>
  );
};

export default WeekSymmetry;
