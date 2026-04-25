/**
 * Void Moon Calendar Component
 * HEKA 13-Month Calendar (28 days each, March 29/30)
 * Void moons shown as horizontal bars within days
 */

import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import './VoidMoonCalendar.css';
import { useVoidMoon, useVoidMoonEvents } from '../../hooks/use-swiss';
import { getSignCount } from '../../services/swiss-ephemeris/engine';
import { VoidMoonEvent } from '../../types';
import { 
  getTimeMode, 
  isHekaLeapMarch,
  getSaturdayStartOffset,
  getCivilStartOfHekaMonth
} from '../../../services/calendarService';
import type { HekaMonthIndex } from '../../../types';

import { getSignFromLongitude } from '../../types/core';

// Zodiac signs (13-sign inclusive)
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Ophiuchus', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const SIGN_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '⛎', '♐', '♑', '♒', '♓'];

// HEKA weekdays starting Saturday
const HEKA_WEEKDAYS = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

// 13 HEKA month names
const HEKA_MONTHS = [
  'April', 'May', 'June', 'July', 'August', 'Hexa',
  'September', 'October', 'November', 'December', 'January', 'February', 'March'
];

// Month day counts - 28 days for all except March (29 or 30)
const getDaysInMonth = (year: number, month: number): number => {
  if (month === 12) return isHekaLeapMarch(year) ? 30 : 29; // March (index 12)
  return 28; // All other months have exactly 28 days
};

// Format time
const formatTime = (date: Date): string => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
};

// Get zodiac sign from longitude (respects 12/13-sign setting)
const getSign = (lng: number) => {
  const use13 = getSignCount() === 13;
  const sign = getSignFromLongitude(((lng % 360) + 360) % 360 as any, use13);
  const idx = use13 ? SIGNS.indexOf(sign.charAt(0).toUpperCase() + sign.slice(1)) : Math.floor(((lng % 360) + 360) % 360 / 30) % 12;
  const safeIdx = idx >= 0 ? idx : 0;
  return { name: SIGNS[safeIdx] || 'Aries', symbol: SIGN_SYMBOLS[safeIdx] || '♈', idx: safeIdx };
};

interface CalendarCell {
  date: Date;
  hekaYear: number;
  hekaMonth: number;
  hekaDay: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  voidEvents: VoidMoonEvent[];
}

export const VoidMoonCalendar: React.FC = () => {
  // Initialize to current HEKA month
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    const civilMonth = now.getMonth();
    const civilYear = now.getFullYear();
    // Map civil month to HEKA month
    const map = [10, 11, 12, 0, 1, 2, 3, 4, 6, 7, 8, 9]; // Apr=0, Hexa=5, Mar=12
    const hekaMonth = map[civilMonth];
    const hekaYear = civilMonth >= 3 ? civilYear : civilYear - 1;
    return { year: hekaYear, month: hekaMonth };
  });

  const timeMode = useSelector((state: any) => state.calendar?.timeMode) || getTimeMode();
  const { data: voidStatus, isLoading: statusLoading } = useVoidMoon();
  const { data: events, isLoading: eventsLoading } = useVoidMoonEvents(30);

  const isLoading = statusLoading || eventsLoading;
  const isVoid = voidStatus?.isVoid ?? false;

  // Generate 13-month calendar grid (always 4 weeks = 28 cells for non-March months)
  const calendarCells = useMemo((): CalendarCell[] => {
    const { year, month } = currentMonth;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayCivil = getCivilStartOfHekaMonth(year, month as HekaMonthIndex);
    const saturdayOffset = getSaturdayStartOffset({ year, month: month as HekaMonthIndex, day: 1 });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells: CalendarCell[] = [];

    // Previous month padding to reach Saturday
    for (let i = 0; i < saturdayOffset; i++) {
      const prevDate = new Date(firstDayCivil);
      prevDate.setDate(prevDate.getDate() - (saturdayOffset - i));
      cells.push({
        date: prevDate,
        hekaYear: month === 0 ? year - 1 : year,
        hekaMonth: month === 0 ? 12 : month - 1,
        hekaDay: getDaysInMonth(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1) - (saturdayOffset - i) + 1,
        isCurrentMonth: false,
        isToday: false,
        voidEvents: [],
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const civilDate = new Date(firstDayCivil);
      civilDate.setDate(civilDate.getDate() + day - 1);
      const isToday = civilDate.getTime() === today.getTime();
      
      const dayEvents = events?.filter(e => {
        const eDate = new Date(e.startTime);
        return eDate.toDateString() === civilDate.toDateString();
      }) || [];

      cells.push({
        date: civilDate,
        hekaYear: year,
        hekaMonth: month,
        hekaDay: day,
        isCurrentMonth: true,
        isToday,
        voidEvents: dayEvents,
      });
    }

    // Fill to complete 4 rows (28 cells) or 5 rows for March (35 cells)
    const targetCells = daysInMonth === 28 ? 28 : 35;
    const remaining = targetCells - cells.length;
    
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(firstDayCivil);
      nextDate.setDate(nextDate.getDate() + daysInMonth + i - 1);
      cells.push({
        date: nextDate,
        hekaYear: month === 11 ? year + 1 : year,
        hekaMonth: month === 12 ? 0 : month + 1,
        hekaDay: i,
        isCurrentMonth: false,
        isToday: false,
        voidEvents: [],
      });
    }

    return cells;
  }, [currentMonth, events]);

  // Navigation
  const prevMonth = () => setCurrentMonth(prev => {
    let m = prev.month - 1;
    let y = prev.year;
    if (m < 0) { m = 12; y--; }
    return { year: y, month: m };
  });

  const nextMonth = () => setCurrentMonth(prev => {
    let m = prev.month + 1;
    let y = prev.year;
    if (m > 12) { m = 0; y++; }
    return { year: y, month: m };
  });

  const goToToday = () => {
    const now = new Date();
    const map = [10, 11, 12, 0, 1, 2, 3, 4, 6, 7, 8, 9];
    setCurrentMonth({
      year: now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1,
      month: map[now.getMonth()]
    });
  };

  // Get next 3 upcoming voids for the status banner
  const upcomingVoids = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    return events.filter(e => e.endTime > now).slice(0, 3);
  }, [events]);

  if (isLoading) {
    return (
      <div className="vm-calendar">
        <div className="vm-header">
          <h3>🌑 Void Moon Calendar</h3>
          <p>Calculating astronomical data...</p>
        </div>
      </div>
    );
  }

  const isMarch = currentMonth.month === 12;
  const isLeap = isMarch && isHekaLeapMarch(currentMonth.year);

  return (
    <div className="vm-calendar">
      {/* Header */}
      <div className="vm-header">
        <div className="vm-title-section">
          <h3>🌑 Void Moon Calendar</h3>
          <div className="vm-subtitle">
            <span className="vm-month-year">{HEKA_MONTHS[currentMonth.month]} {currentMonth.year}</span>
            <span className="vm-mode-badge">{timeMode}</span>
            {isMarch && <span className={`vm-leap-badge ${isLeap ? 'leap' : ''}`}>{isLeap ? '30 days' : '29 days'}</span>}
          </div>
        </div>
        
        <div className="vm-nav">
          <button onClick={prevMonth} className="vm-nav-btn">←</button>
          <button onClick={goToToday} className="vm-nav-btn today">Today</button>
          <button onClick={nextMonth} className="vm-nav-btn">→</button>
        </div>
      </div>

      {/* Current Status */}
      <div className={`vm-status ${isVoid ? 'void' : 'clear'}`}>
        <div className="vm-status-main">
          <span className="vm-status-icon">{isVoid ? '🌑' : '🌕'}</span>
          <div className="vm-status-text">
            <h4>{isVoid ? 'Void Moon Active' : 'Moon Active'}</h4>
            <p>{isVoid ? 'Avoid new beginnings • Rest and reflect' : 'Good for new projects • Make decisions'}</p>
          </div>
        </div>
        <div className="vm-status-time">
          <span className="vm-status-label">{isVoid ? 'Ends in' : 'Next void'}</span>
          <span className="vm-status-value">
            {isVoid 
              ? formatDuration(voidStatus?.remainingMinutes || 0)
              : voidStatus?.nextVoidStart ? formatTime(voidStatus.nextVoidStart) : '--'
            }
          </span>
        </div>
      </div>

      {/* What is Void Moon? - Educational */}
      <div className="vm-education">
        <details className="vm-edu-details">
          <summary>What is a Void Moon?</summary>
          <div className="vm-edu-content">
            <p><strong>Void of Course Moon</strong> occurs when the Moon makes its last major aspect before changing zodiac signs. During this time, the Moon is "void" — not forming new connections with other planets.</p>
            <div className="vm-edu-grid">
              <div className="vm-edu-item avoid">
                <h5>🚫 Avoid</h5>
                <ul>
                  <li>Starting new projects</li>
                  <li>Signing contracts</li>
                  <li>First meetings</li>
                  <li>Major purchases</li>
                  <li>Launches & openings</li>
                </ul>
              </div>
              <div className="vm-edu-item favor">
                <h5>✓ Favor</h5>
                <ul>
                  <li>Rest & relaxation</li>
                  <li>Completing tasks</li>
                  <li>Research & planning</li>
                  <li>Meditation</li>
                  <li>Letting go</li>
                </ul>
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* Calendar Grid */}
      <div className="vm-grid-container">
        <div className="vm-weekdays">
          {HEKA_WEEKDAYS.map(d => <div key={d} className="vm-wd">{d}</div>)}
        </div>
        
        <div className={`vm-days ${isMarch ? 'march' : 'standard'}`}>
          {calendarCells.map((cell, idx) => {
            const hasVoid = cell.voidEvents.length > 0;
            const isWeekend = idx % 7 === 0 || idx % 7 === 1 || idx % 7 === 6; // Sat, Sun, Fri
            
            return (
              <div 
                key={idx}
                className={`vm-cell ${!cell.isCurrentMonth ? 'other' : ''} ${cell.isToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''} ${hasVoid ? 'has-void' : ''}`}
              >
                <div className="vm-cell-day">{cell.hekaDay}</div>
                
                {/* Void indicators as horizontal bars */}
                {hasVoid && (
                  <div className="vm-void-bars">
                    {cell.voidEvents.map((evt, i) => {
                      const from = getSign(evt.fromSignLongitude);
                      const to = getSign(evt.toSignLongitude);
                      const startPct = (evt.startTime.getHours() * 60 + evt.startTime.getMinutes()) / 1440 * 100;
                      const endPct = (evt.endTime.getHours() * 60 + evt.endTime.getMinutes()) / 1440 * 100;
                      
                      return (
                        <div key={i} className="vm-void-wrapper">
                          <div 
                            className="vm-void-bar"
                            style={{ 
                              left: `${startPct}%`, 
                              width: `${Math.max(8, endPct - startPct)}%` 
                            }}
                            title={`Void: ${formatTime(evt.startTime)}-${formatTime(evt.endTime)} • ${from.symbol}→${to.symbol}`}
                          />
                          <div className="vm-void-tooltip">
                            <strong>🌑 Void Moon</strong>
                            <span>{formatTime(evt.startTime)} – {formatTime(evt.endTime)}</span>
                            <span>Moon leaves {from.name} {from.symbol} → enters {to.name} {to.symbol}</span>
                            <span className="vm-void-dur">Duration: {formatDuration(evt.durationMinutes)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="vm-legend">
        <div className="vm-legend-item">
          <div className="vm-legend-bar void"></div>
          <span>Void Period</span>
        </div>
        <div className="vm-legend-item">
          <div className="vm-legend-bar active"></div>
          <span>Moon Active</span>
        </div>
        <div className="vm-legend-note">Hover over bars for details</div>
      </div>

      {/* Upcoming Voids - Compact horizontal list */}
      {upcomingVoids.length > 0 && (
        <div className="vm-upcoming">
          <h4>◈ Upcoming Void Periods</h4>
          <div className="vm-upcoming-list">
            {upcomingVoids.map((evt, i) => {
              const date = new Date(evt.startTime);
              const hekaMonth = [10, 11, 12, 0, 1, 2, 3, 4, 6, 7, 8, 9][date.getMonth()];
              const hekaDay = date.getDate(); // Simplified
              const from = getSign(evt.fromSignLongitude);
              const to = getSign(evt.toSignLongitude);
              
              return (
                <div key={i} className="vm-up-item">
                  <span className="vm-up-date">{HEKA_MONTHS[hekaMonth]} {hekaDay}</span>
                  <span className="vm-up-time">{formatTime(evt.startTime)}-{formatTime(evt.endTime)}</span>
                  <span className="vm-up-signs">{from.symbol}→{to.symbol}</span>
                  <span className="vm-up-dur">{formatDuration(evt.durationMinutes)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoidMoonCalendar;
