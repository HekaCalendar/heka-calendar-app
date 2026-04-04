/**
 * Production Print Renderer
 * Uses React components with design tokens for maintainable, type-safe print layouts
 */

import React from 'react';
import type { PrintTheme, YearData, MonthData, DayData } from './types';
import type { PrintOptions } from '../../types';

// ============================================================================
// UTILITY: Generate CSS from design tokens
// ============================================================================

function generateThemeCSS(theme: PrintTheme): string {
  const { colors, typography, spacing, effects } = theme;
  
  return `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=Inter:wght@300;400;500;600&family=Crimson+Pro:wght@400;600&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    :root {
      /* Colors */
      --color-primary: ${colors.primary};
      --color-primary-light: ${colors.primaryLight};
      --color-primary-dark: ${colors.primaryDark};
      --color-secondary: ${colors.secondary};
      --color-accent: ${colors.accent};
      
      --color-bg: ${colors.background};
      --color-surface: ${colors.surface};
      --color-surface-elevated: ${colors.surfaceElevated};
      
      --color-text: ${colors.text};
      --color-text-secondary: ${colors.textSecondary};
      --color-text-muted: ${colors.textMuted};
      
      --color-border: ${colors.border};
      --color-border-light: ${colors.borderLight};
      
      --color-arc-opening: ${colors.arcOpening};
      --color-arc-core: ${colors.arcCore};
      --color-arc-closing: ${colors.arcClosing};
      
      /* Typography */
      --font-display: ${typography.display.fontFamily};
      --font-body: ${typography.body.fontFamily};
      
      /* Spacing */
      --spacing-unit: ${spacing.unit}px;
      --spacing-xs: ${spacing.xs}px;
      --spacing-sm: ${spacing.sm}px;
      --spacing-md: ${spacing.md}px;
      --spacing-lg: ${spacing.lg}px;
      --spacing-xl: ${spacing.xl}px;
      --spacing-xxl: ${spacing.xxl}px;
      
      /* Effects */
      --shadow-sm: ${effects.shadowSm};
      --shadow-md: ${effects.shadowMd};
      --shadow-lg: ${effects.shadowLg};
      --glow-primary: ${effects.glowPrimary};
      --glow-accent: ${effects.glowAccent};
      
      --radius-sm: ${effects.borderRadius.sm};
      --radius-md: ${effects.borderRadius.md};
      --radius-lg: ${effects.borderRadius.lg};
    }
    
    body {
      font-family: var(--font-body);
      font-size: ${typography.body.fontSize};
      line-height: ${typography.body.lineHeight};
      color: var(--color-text);
      background: var(--color-bg);
    }
  `;
}

// ============================================================================
// YEAR COVER COMPONENT
// ============================================================================

interface YearCoverProps {
  year: number;
  theme: PrintTheme;
}

const YearCover: React.FC<YearCoverProps> = ({ year, theme }) => {
  const { layouts } = theme;
  
  return (
    <div className="print-page year-cover" data-theme={theme.id}>
      <div className="year-cover-content">
        <div className="year-cover-badge">THE MODERN HEKA CALENDAR</div>
        
        <div className="year-cover-year">
          <span className="year-label">Year</span>
          <span className="year-number">{year}</span>
        </div>
        
        <div className="year-cover-range">
          April {year} — March {year + 1}
        </div>
        
        <div className="year-cover-meta">
          <span>13 Months</span>
          <span className="meta-dot">·</span>
          <span>28 Days</span>
          <span className="meta-dot">·</span>
          <span className="meta-motto">Time is a circle, not a line</span>
        </div>
        
        {layouts.yearCover.showArcs && (
          <div className="year-cover-arcs">
            <div className="arcs-title">
              <span className="title-line" />
              <span className="title-text">The Three Arcs</span>
              <span className="title-line" />
            </div>
            <div className="arcs-grid">
              <div className="arc-card arc-opening">
                <div className="arc-glow" />
                <span className="arc-icon">🌅</span>
                <span className="arc-name">OPENING</span>
                <span className="arc-divider" />
                <span className="arc-months">April</span>
                <span className="arc-desc">New Beginnings</span>
              </div>
              <div className="arc-card arc-core">
                <div className="arc-glow" />
                <span className="arc-icon">☀️</span>
                <span className="arc-name">CORE</span>
                <span className="arc-divider" />
                <span className="arc-months">May – December</span>
                <span className="arc-desc">Growth & Abundance</span>
              </div>
              <div className="arc-card arc-closing">
                <div className="arc-glow" />
                <span className="arc-icon">🌙</span>
                <span className="arc-name">CLOSING</span>
                <span className="arc-divider" />
                <span className="arc-months">January – March</span>
                <span className="arc-desc">Reflection & Rest</span>
              </div>
            </div>
          </div>
        )}
        
        {layouts.yearCover.showWeekdayLegend && (
          <div className="year-cover-weekdays">
            <span className="weekdays-label">The HEKA Week</span>
            <div className="weekdays-grid">
              {['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, i) => (
                <div key={day} className="weekday-item">
                  <span className={`weekday-dot ${i === 0 || i === 1 || i === 6 ? 'weekend' : 'workday'}`} />
                  <span className="weekday-name">{day}</span>
                  <span className="weekday-type">{i === 0 || i === 1 || i === 6 ? 'Weekend' : 'Work'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .year-cover {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          background: 
            radial-gradient(ellipse at 0% 0%, color-mix(in srgb, var(--color-primary) 15%, transparent) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, color-mix(in srgb, var(--color-secondary) 10%, transparent) 0%, transparent 50%),
            var(--color-bg);
          position: relative;
          page-break-after: always;
        }
        
        .year-cover-content {
          text-align: center;
          max-width: 700px;
        }
        
        .year-cover-badge {
          display: inline-block;
          padding: var(--spacing-sm) var(--spacing-lg);
          border: 2px solid var(--color-primary);
          border-radius: var(--radius-lg);
          font-family: var(--font-display);
          font-size: var(--font-size-xs);
          letter-spacing: 0.3em;
          color: var(--color-primary-dark);
          margin-bottom: var(--spacing-xl);
        }
        
        .year-cover-year {
          margin-bottom: var(--spacing-md);
        }
        
        .year-label {
          display: block;
          font-family: var(--font-display);
          font-size: 14px;
          letter-spacing: 0.5em;
          color: var(--color-text-muted);
          margin-bottom: var(--spacing-sm);
        }
        
        .year-number {
          display: block;
          font-family: var(--font-display);
          font-size: ${theme.typography.display.fontSize};
          font-weight: ${theme.typography.display.fontWeight};
          color: var(--color-primary);
          text-shadow: var(--glow-primary);
          line-height: 1;
        }
        
        .year-cover-range {
          font-family: var(--font-display);
          font-size: 16px;
          letter-spacing: 0.15em;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-sm);
        }
        
        .year-cover-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xxl);
          font-size: 12px;
          letter-spacing: 0.2em;
          color: var(--color-text-muted);
        }
        
        .meta-dot { color: var(--color-primary); }
        .meta-motto { color: var(--color-primary-dark); font-style: italic; }
        
        .year-cover-arcs {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }
        
        .arcs-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }
        
        .title-line {
          flex: 1;
          height: 1px;
          max-width: 80px;
          background: linear-gradient(90deg, transparent, var(--color-border), transparent);
        }
        
        .title-text {
          font-family: var(--font-display);
          font-size: 12px;
          letter-spacing: 0.2em;
          color: var(--color-primary-dark);
        }
        
        .arcs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
        }
        
        .arc-card {
          position: relative;
          background: var(--color-surface-elevated);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xs);
          border: 1px solid var(--color-border-light);
          overflow: hidden;
        }
        
        .arc-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }
        
        .arc-opening .arc-glow { background: var(--color-arc-opening); box-shadow: 0 0 20px var(--color-arc-opening); }
        .arc-core .arc-glow { background: var(--color-arc-core); box-shadow: 0 0 20px var(--color-arc-core); }
        .arc-closing .arc-glow { background: var(--color-arc-closing); box-shadow: 0 0 20px var(--color-arc-closing); }
        
        .arc-icon { font-size: 28px; margin-bottom: var(--spacing-xs); }
        
        .arc-name {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
        }
        
        .arc-opening .arc-name { color: var(--color-arc-opening); }
        .arc-core .arc-name { color: var(--color-arc-core); }
        .arc-closing .arc-name { color: var(--color-arc-closing); }
        
        .arc-divider {
          width: 20px;
          height: 1px;
          background: var(--color-border);
          margin: var(--spacing-xs) 0;
        }
        
        .arc-months {
          font-size: 11px;
          color: var(--color-text-secondary);
        }
        
        .arc-desc {
          font-size: 10px;
          color: var(--color-text-muted);
          font-style: italic;
        }
        
        .year-cover-weekdays {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          padding: var(--spacing-lg);
        }
        
        .weekdays-label {
          display: block;
          font-family: var(--font-display);
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--color-primary-dark);
          margin-bottom: var(--spacing-md);
        }
        
        .weekdays-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: var(--spacing-sm);
        }
        
        .weekday-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: var(--spacing-sm);
          background: var(--color-surface-elevated);
          border-radius: var(--radius-sm);
        }
        
        .weekday-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }
        
        .weekday-dot.weekend { background: var(--color-primary); }
        .weekday-dot.workday { background: var(--color-text-muted); }
        
        .weekday-name {
          font-size: 10px;
          font-weight: 500;
          color: var(--color-text);
        }
        
        .weekday-type {
          font-size: 8px;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// MONTH PAGE COMPONENT
// ============================================================================

interface MonthPageProps {
  monthData: MonthData;
  theme: PrintTheme;
  options: PrintOptions;
}

const MonthPage: React.FC<MonthPageProps> = ({ monthData, theme, options }) => {
  const { month, monthIndex, arc, days, startDayOffset } = monthData;
  const { layouts, typography, spacing } = theme;
  
  const arcColors = {
    OPENING: theme.colors.arcOpening,
    CORE: theme.colors.arcCore,
    CLOSING: theme.colors.arcClosing
  };
  
  const arcColor = arcColors[arc];
  
  return (
    <div 
      className="print-page month-page" 
      data-theme={theme.id}
      data-arc={arc.toLowerCase()}
    >
      <div className="month-header">
        <span className="brand">THE MODERN HEKA CALENDAR</span>
        <h2 className="month-title">{month.name}</h2>
        <div className="month-meta">
          {layouts.monthPage.showArcIndicator && (
            <span className="arc-badge" style={{ color: arcColor, borderColor: arcColor }}>
              {arc} ARC
            </span>
          )}
          <span className="month-number">Month {monthIndex + 1} of 13</span>
        </div>
      </div>
      
      <div className="calendar-grid">
        {/* Day of week headers */}
        {['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((dow, i) => (
          <div 
            key={dow} 
            className={`dow-header ${i === 0 || i === 1 || i === 6 ? 'weekend' : ''}`}
            style={{ color: arcColor }}
          >
            {dow}
          </div>
        ))}
        
        {/* Empty cells for offset */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="day-cell empty" />
        ))}
        
        {/* Day cells */}
        {days.map((day) => (
          <DayCell 
            key={day.day} 
            dayData={day} 
            theme={theme}
            options={options}
            arcColor={arcColor}
          />
        ))}
      </div>
      
      <style>{`
        .month-page {
          min-height: 100vh;
          padding: ${spacing.pagePadding}px;
          background: var(--color-bg);
          page-break-after: always;
          display: flex;
          flex-direction: column;
        }
        
        .month-header {
          text-align: center;
          margin-bottom: ${spacing.lg}px;
          padding: ${spacing.md}px;
          background: var(--color-surface);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }
        
        .brand {
          display: block;
          font-family: var(--font-display);
          font-size: ${typography.label.fontSize};
          letter-spacing: ${typography.label.letterSpacing};
          color: var(--color-primary);
          margin-bottom: ${spacing.sm}px;
        }
        
        .month-title {
          font-family: var(--font-display);
          font-size: ${typography.h2.fontSize};
          font-weight: ${typography.h2.fontWeight};
          color: var(--color-text);
          margin-bottom: ${spacing.sm}px;
        }
        
        .month-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: ${spacing.md}px;
        }
        
        .arc-badge {
          padding: 2px ${spacing.sm}px;
          border: 1px solid;
          border-radius: var(--radius-full);
          font-size: 9px;
          letter-spacing: 0.1em;
          font-weight: 600;
        }
        
        .month-number {
          font-size: ${typography.caption.fontSize};
          color: var(--color-text-muted);
          letter-spacing: 0.05em;
        }
        
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: ${spacing.gridGap}px;
          flex: 1;
        }
        
        .dow-header {
          text-align: center;
          padding: ${spacing.sm}px;
          font-family: var(--font-display);
          font-size: 10px;
          letter-spacing: 0.1em;
          font-weight: 600;
          text-transform: uppercase;
          background: color-mix(in srgb, ${arcColor} 8%, transparent);
          border-radius: var(--radius-sm);
        }
        
        .dow-header.weekend {
          background: color-mix(in srgb, var(--color-primary) 10%, transparent);
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// DAY CELL COMPONENT
// ============================================================================

interface DayCellProps {
  dayData: DayData;
  theme: PrintTheme;
  options: PrintOptions;
  arcColor: string;
}

const DayCell: React.FC<DayCellProps> = ({ dayData, theme, options, arcColor }) => {
  const { day, moonPhase, holidays, notes, civilDate } = dayData;
  const { layouts, spacing } = theme;
  
  return (
    <div className="day-cell">
      <div className="day-header">
        <span className="day-number">{day}</span>
        {options.includeMoonPhases && moonPhase && (
          <span className="moon-phase">{moonPhase.glyph}</span>
        )}
      </div>
      
      {options.includeCivilDates && (
        <div className="civil-date">
          {civilDate.getDate()}/{civilDate.getMonth() + 1}
        </div>
      )}
      
      {options.includeNotes && notes.length > 0 && (
        <div className="notes-area">
          {notes.slice(0, layouts.dayCell.maxNotesVisible).map((note, i) => (
            <div 
              key={i} 
              className="note-item"
              style={{ 
                borderLeftColor: arcColor,
                display: layouts.dayCell.noteDisplayStyle === 'dot' ? 'none' : 'block'
              }}
            >
              {note.content.substring(0, 20)}
              {note.content.length > 20 ? '...' : ''}
            </div>
          ))}
          {layouts.dayCell.noteDisplayStyle === 'dot' && notes.length > 0 && (
            <div className="note-dots">
              {notes.slice(0, 3).map((_, i) => (
                <span key={i} className="note-dot" />
              ))}
            </div>
          )}
        </div>
      )}
      
      {options.includeHolidays && holidays.length > 0 && (
        <div className="holiday-badge">
          {holidays[0].name.substring(0, 15)}
          {holidays[0].name.length > 15 ? '...' : ''}
        </div>
      )}
      
      <style>{`
        .day-cell {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          padding: ${spacing.cellPadding}px;
          display: flex;
          flex-direction: column;
          min-height: 100px;
        }
        
        .day-cell.empty {
          background: transparent;
          border-color: transparent;
        }
        
        .day-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        
        .day-number {
          font-size: 16px;
          font-weight: 700;
          color: var(--color-text);
        }
        
        .moon-phase {
          font-size: 12px;
        }
        
        .civil-date {
          font-size: 9px;
          color: var(--color-text-muted);
          margin-bottom: 4px;
        }
        
        .notes-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        
        .note-item {
          font-size: 8px;
          color: var(--color-text-secondary);
          background: var(--color-surface-elevated);
          padding: 2px 4px;
          border-radius: 2px;
          border-left: 2px solid;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .note-dots {
          display: flex;
          gap: 3px;
          margin-top: auto;
        }
        
        .note-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${arcColor};
        }
        
        .holiday-badge {
          margin-top: auto;
          padding: 2px 4px;
          background: color-mix(in srgb, ${arcColor} 10%, transparent);
          border: 1px solid color-mix(in srgb, ${arcColor} 30%, transparent);
          border-radius: var(--radius-sm);
          font-size: 7px;
          color: ${arcColor};
          text-align: center;
          line-height: 1.2;
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// MAIN EXPORT: Complete Print Document
// ============================================================================

interface PrintDocumentProps {
  yearData: YearData;
  theme: PrintTheme;
  options: PrintOptions;
  showYearCover?: boolean;
}

export const PrintDocument: React.FC<PrintDocumentProps> = ({
  yearData,
  theme,
  options,
  showYearCover = true
}) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>HEKA Calendar {yearData.year}</title>
        <style dangerouslySetInnerHTML={{ 
          __html: generateThemeCSS(theme) 
        }} />
        <style>{`
          @page {
            size: ${options.paperSize} ${options.orientation};
            margin: 8mm;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .print-page {
              page-break-after: always;
            }
            
            .print-page:last-child {
              page-break-after: auto;
            }
          }
          
          .print-page {
            width: 100%;
            box-sizing: border-box;
          }
        `}</style>
      </head>
      <body>
        {showYearCover && theme.layouts.yearCover.enabled && (
          <YearCover year={yearData.year} theme={theme} />
        )}
        
        {yearData.months.map((monthData) => (
          <MonthPage 
            key={monthData.monthIndex}
            monthData={monthData}
            theme={theme}
            options={options}
          />
        ))}
      </body>
    </html>
  );
};

export default PrintDocument;
