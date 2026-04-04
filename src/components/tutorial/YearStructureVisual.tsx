/**
 * Year Structure Visual - 100% Accurate to HEKA System
 * Shows the real math: 12×28 + March(29/30) = 365/366 days
 */
import React from 'react';
import './year-structure-visual.css';

export const YearStructureVisual: React.FC = () => {
  return (
    <div className="ysv-visual">
      {/* Main Structure */}
      <div className="ysv-equation">
        <div className="ysv-part">
          <span className="ysv-num">12</span>
          <span className="ysv-label">months</span>
          <span className="ysv-sub">× 28 days</span>
        </div>
        <span className="ysv-op">+</span>
        <div className="ysv-part march">
          <span className="ysv-num">March</span>
          <span className="ysv-label">29/30 days</span>
          <span className="ysv-sub">leap correction</span>
        </div>
        <span className="ysv-op">=</span>
        <div className="ysv-part total">
          <span className="ysv-num">365/366</span>
          <span className="ysv-label">days</span>
          <span className="ysv-sub">solar year</span>
        </div>
      </div>

      {/* The Quarter Reality */}
      <div className="ysv-quarters">
        <div className="ysv-q">
          <span className="ysv-q-title">Q1</span>
          <span className="ysv-q-months">Apr-May-Jun</span>
          <span className="ysv-q-days">84 days</span>
        </div>
        <div className="ysv-q">
          <span className="ysv-q-title">Q2</span>
          <span className="ysv-q-months">Jul-Aug-Hex</span>
          <span className="ysv-q-days">84 days</span>
        </div>
        <div className="ysv-q">
          <span className="ysv-q-title">Q3</span>
          <span className="ysv-q-months">Sep-Oct-Nov</span>
          <span className="ysv-q-days">84 days</span>
        </div>
        <div className="ysv-q extended">
          <span className="ysv-q-title">Q4</span>
          <span className="ysv-q-months">Dec-Jan-Feb-Mar</span>
          <span className="ysv-q-days">113-114 days ★</span>
        </div>
      </div>

      {/* Benefits - Only Accurate Claims */}
      <div className="ysv-benefits">
        <div className="ysv-benefit">
          <span className="ysv-check">✓</span>
          <span>28-day months (12 perfect)</span>
        </div>
        <div className="ysv-benefit">
          <span className="ysv-check">✓</span>
          <span>Same weekday for each date within year</span>
        </div>
        <div className="ysv-benefit">
          <span className="ysv-check">✓</span>
          <span>Q4 extended for closing arc & holidays</span>
        </div>
      </div>
    </div>
  );
};

export default YearStructureVisual;
