/**
 * PREMIUM PRINT THEME SYSTEM
 */

import type { PrintOptions } from '../types';
import {
  HEKA_MONTHS,
  getArcType,
  getDaysInMonth,
  getCivilStartOfHekaMonth,
  getNoteKey,
  hekaToCivil,
} from '../services/calendarService';
import { getMoonPhase } from '../services/astronomyService';
import { getHolidaysForDate, ARC_NAMES } from '../types';

// ============================================================================
// DATA PREPARATION
// ============================================================================

interface DayData {
  day: number;
  civilDate: Date;
  moonPhase: ReturnType<typeof getMoonPhase> | null;
  holidays: ReturnType<typeof getHolidaysForDate>;
  notes: any[];
}

interface MonthData {
  month: typeof HEKA_MONTHS[0];
  monthIndex: number;
  monthNumber: number;
  arc: 'OPENING' | 'CORE' | 'CLOSING';
  arcLabel: string;
  days: DayData[];
  startDayOffset: number;
}

export interface YearData {
  year: number;
  months: MonthData[];
}

export function prepareYearData(
  year: number,
  options: PrintOptions,
  notes: Record<string, any[]>,
  location: string
): YearData {
  const months: MonthData[] = [];
  
  for (let i = 0; i < 13; i++) {
    const month = HEKA_MONTHS[i];
    const arc = getArcType(i as any);
    const daysInMonth = getDaysInMonth(year, i as any);
    const firstDayCivil = getCivilStartOfHekaMonth(year, i as any);
    const startDayOffset = (firstDayCivil.getDay() + 1) % 7;

    const days: DayData[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const civilDate = hekaToCivil({ year, month: i as any, day });
      const noteKey = getNoteKey(year, i, day);
      
      days.push({
        day,
        civilDate,
        moonPhase: options.includeMoonPhases ? getMoonPhase(civilDate, 'N') : null,
        holidays: options.includeHolidays && location !== 'NONE' 
          ? getHolidaysForDate(civilDate, location as any) 
          : [],
        notes: options.includeNotes ? (notes[noteKey] || []) : [],
      });
    }

    months.push({
      month,
      monthIndex: i,
      monthNumber: i + 1,
      arc,
      arcLabel: ARC_NAMES[arc],
      days,
      startDayOffset,
    });
  }
  
  return { year, months };
}

// ============================================================================
// THEME 1: MINIMALIST
// ============================================================================

function generateMinimalist(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string {
  const isLandscape = options.orientation === 'landscape';
  const landscapeClass = isLandscape ? 'landscape-wide landscape-wide' : '';
  const isMonthMode = mode === 'month' || data.months.length === 1;

  const generateMonth = (m: MonthData): string => {
    let daysHTML = '';
    
    for (let i = 0; i < m.startDayOffset; i++) {
      daysHTML += '<div class="min-day min-empty"></div>';
    }
    
    for (const day of m.days) {
      let notesHTML = '';
      if (day.notes.length > 0 && options.includeNotes) {
        for (const note of day.notes.slice(0, 3)) {
          notesHTML += `<div class="min-note">${note.content.substring(0, 16)}${note.content.length > 16 ? '..' : ''}</div>`;
        }
      }

      daysHTML += `
        <div class="min-day">
          <div class="min-cell-top">
            <span class="min-day-num">${day.day}</span>
            ${day.moonPhase && options.includeMoonPhases ? `<span class="min-moon">${day.moonPhase.glyph}</span>` : ''}
          </div>
          ${options.includeCivilDates ? `<div class="min-civil">${day.civilDate.getDate()}/${day.civilDate.getMonth() + 1}</div>` : ''}
          ${notesHTML ? `<div class="min-notes">${notesHTML}</div>` : ''}
          ${day.holidays.length > 0 && options.includeHolidays ? `<div class="min-holiday">${day.holidays[0].name.substring(0, 20)}${day.holidays[0].name.length > 20 ? '..' : ''}</div>` : ''}
        </div>
      `;
    }

    return `
      <div class="min-month ${landscapeClass}" data-arc="${m.arc.toLowerCase()}">
        <div class="min-header">
          <div class="min-header-top">
            <span class="min-brand">The Modern HEKA Calendar</span>
            <span class="min-arc">${m.arcLabel} Arc</span>
          </div>
          <div class="min-header-main">
            <h2 class="min-month-name">${m.month.name}</h2>
            <span class="min-month-num">Month ${m.monthNumber}/13</span>
          </div>
        </div>
        <div class="min-dow">
          <span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
        </div>
        <div class="min-grid">${daysHTML}</div>
      </div>
    `;
  };

  return `
    <style>
      /* Using system fonts for reliability */
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #1a1a1a; line-height: 1.5; }
      
      /* Arc color system via data attributes */
      .min-month[data-arc="opening"] .min-header { border-left-color: #dc2626; }
      .min-month[data-arc="opening"] .min-day-num { color: #dc2626; }
      .min-month[data-arc="opening"] .min-arc { color: #dc2626; background: #fee2e2; }
      .min-month[data-arc="opening"] .min-holiday { background: #fee2e2; color: #dc2626; }
      .min-month[data-arc="opening"] .min-day { border-top: 3px solid #dc2626; }
      
      .min-month[data-arc="core"] .min-header { border-left-color: #16a34a; }
      .min-month[data-arc="core"] .min-day-num { color: #16a34a; }
      .min-month[data-arc="core"] .min-arc { color: #16a34a; background: #dcfce7; }
      .min-month[data-arc="core"] .min-holiday { background: #dcfce7; color: #16a34a; }
      .min-month[data-arc="core"] .min-day { border-top: 3px solid #16a34a; }
      
      .min-month[data-arc="closing"] .min-header { border-left-color: #7c3aed; }
      .min-month[data-arc="closing"] .min-day-num { color: #7c3aed; }
      .min-month[data-arc="closing"] .min-arc { color: #7c3aed; background: #ede9fe; }
      .min-month[data-arc="closing"] .min-holiday { background: #ede9fe; color: #7c3aed; }
      .min-month[data-arc="closing"] .min-day { border-top: 3px solid #7c3aed; }
      
      .min-cover { min-height: 700px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; border-bottom: 2px solid #eee; }
      .min-cover-line { width: 60px; height: 1px; background: #ddd; margin: 25px 0; }
      .min-cover-brand { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: #888; }
      .min-cover-year { font-size: 120px; font-weight: 200; letter-spacing: -6px; line-height: 1; margin: 15px 0; }
      .min-cover-subtitle { font-size: 13px; color: #666; margin: 6px 0; }
      .min-cover-arcs { margin-top: 40px; display: flex; flex-direction: column; gap: 10px; }
      .min-arc-item { font-size: 12px; color: #555; display: flex; align-items: center; gap: 10px; }
      .min-arc-dot { width: 8px; height: 8px; border-radius: 50%; }
      
      .min-month { padding: 30px 20px; border-bottom: 2px solid #eee; max-width: 100%; }
      .min-header { margin-bottom: 20px; padding: 0 0 15px 15px; border-left: 4px solid; }
      .min-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
      .min-brand { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #999; }
      .min-arc { font-size: 10px; letter-spacing: 1px; text-transform: uppercase; padding: 3px 10px; border-radius: 12px; }
      .min-header-main { display: flex; align-items: baseline; gap: 15px; }
      .min-month-name { font-size: 36px; font-weight: 300; letter-spacing: -1px; }
      .min-month-num { font-size: 12px; color: #888; }
      
      .min-dow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 6px; }
      .min-dow span { text-align: center; padding: 8px 2px; font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: #999; }
      .min-grid { display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 1fr; gap: 8px; width: 100%; max-width: 100%; }
      .min-day { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 10px; aspect-ratio: 1; display: flex; flex-direction: column; }
      .min-day.empty { background: #fafafa; }
      .min-cell-top { display: flex; justify-content: space-between; align-items: flex-start; }
      .min-day-num { font-size: 18px; font-weight: 400; }
      .min-moon { font-size: 13px; }
      .min-civil { font-size: 8px; color: #bbb; margin: 2px 0 4px; }
      .min-notes { display: flex; flex-direction: column; gap: 2px; }
      .min-note { font-size: 8px; color: #555; background: #f5f5f5; padding: 2px 4px; border-radius: 3px; line-height: 1.2; }
      .min-holiday { font-size: 8px; padding: 2px 4px; border-radius: 3px; margin-top: 2px; line-height: 1.2; }
      
      /* Portrait screen preview - constrain to container */
      ${!isLandscape ? `
      .min-month {
        max-width: 900px;
        margin: 0 auto;
        box-sizing: border-box;
        overflow: hidden;
      }
      .min-grid { gap: 6px; width: 100%; max-width: 100%; }
      .min-dow { gap: 6px; width: 100%; max-width: 100%; }
      .min-day { aspect-ratio: auto; min-height: 80px; }
      ` : ''}
      
      /* Landscape screen preview styles */
      ${isLandscape ? `
      .min-month.landscape-wide.landscape-wide {
        width: 1100px;
        min-height: 780px;
        margin: 0 auto;
      }
      ` : ''}
      
      @media print {
        @page { size: ${options.paperSize} ${options.orientation}; margin: 8mm; }
        
        .min-cover { min-height: 265mm; page-break-after: always; }
        .min-month { 
          min-height: 265mm; 
          page-break-after: always; 
          padding: 30px;
          max-width: none !important;
        }
        .min-day { min-height: 95px; }
        
        /* Portrait print - tighter gaps to fit Friday column */
        ${!isLandscape ? `
        .min-grid { gap: 4px !important; }
        .min-dow { gap: 4px !important; }
        .min-day { padding: 8px !important; }
        ` : ''}
        
        /* Landscape print overrides */
        ${isLandscape ? `
        .min-month.landscape-wide.landscape-wide {
          width: 100% !important;
          max-width: 100% !important;
          min-height: auto !important;
          height: auto !important;
          padding: 12px 16px !important;
          margin: 0 auto !important;
          box-sizing: border-box !important;
        }
        .min-header { margin-bottom: 10px !important; padding: 10px 12px !important; }
        .min-month-name { font-size: 32px !important; }
        .min-dow { gap: 6px !important; margin-bottom: 6px !important; padding: 8px !important; }
        .min-dow span { padding: 6px 2px !important; font-size: 9px !important; }
        .min-grid { gap: 6px !important; }
        .min-day { padding: 6px !important; min-height: 95px !important; aspect-ratio: auto !important; }
        .min-day-num { font-size: 16px !important; }
        ` : ''}
      }
    </style>
    ${isMonthMode ? '' : `
    <div class="min-cover">
      <div class="min-cover-line"></div>
      <span class="min-cover-brand">The Modern HEKA Calendar</span>
      <h1 class="min-cover-year">${data.year}</h1>
      <div class="min-cover-subtitle">April ${data.year} - March ${data.year}-${(data.year + 1).toString().slice(-2)}</div>
      <div class="min-cover-subtitle">12 Months · 28 Days + March 29/30</div>
      <div class="min-cover-arcs">
        <div class="min-arc-item"><span class="min-arc-dot" style="background:#dc2626"></span>Opening Arc · April</div>
        <div class="min-arc-item"><span class="min-arc-dot" style="background:#16a34a"></span>Core Arc · May-Dec</div>
        <div class="min-arc-item"><span class="min-arc-dot" style="background:#7c3aed"></span>Closing Arc · Jan-March</div>
      </div>
      <div class="min-cover-line"></div>
    </div>
    `}
    ${data.months.map(generateMonth).join('')}
  `;
}

// ============================================================================
// THEME 2: SACRED GEOMETRY
// ============================================================================

function generateSacredGeometry(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string {
  const isMonthMode = mode === 'month' || data.months.length === 1;
  const arcColors = {
    OPENING: '#dc2626',
    CORE: '#16a34a',
    CLOSING: '#7c3aed'
  };

  const formatDate = (d: Date) => `${d.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]}`;

  const generateMonth = (m: MonthData): string => {
    const color = arcColors[m.arc];
    
    const firstCivil = m.days[0]?.civilDate;
    const lastCivil = m.days[m.days.length - 1]?.civilDate;
    const civilRange = firstCivil && lastCivil ? `${formatDate(firstCivil)} — ${formatDate(lastCivil)}` : '';
    
    let daysHTML = '';
    
    for (let i = 0; i < m.startDayOffset; i++) {
      daysHTML += '<div class="sg-cell sg-empty"><div class="sg-empty-circle"></div></div>';
    }
    
    for (const day of m.days) {
      let cellContent = `<div class="sg-daynum" style="color:${color}">${day.day}</div>`;
      
      if (day.notes.length > 0 && options.includeNotes) {
        cellContent += `<div class="sg-notes">`;
        for (const note of day.notes.slice(0, 2)) {
          cellContent += `<div class="sg-note">${note.content.substring(0, 14)}${note.content.length > 14 ? '..' : ''}</div>`;
        }
        cellContent += `</div>`;
      }
      
      if (day.holidays.length > 0 && options.includeHolidays) {
        cellContent += `<div class="sg-holiday" style="color:${color}">${day.holidays[0].name.substring(0, 16)}${day.holidays[0].name.length > 16 ? '..' : ''}</div>`;
      }
      
      daysHTML += `
        <div class="sg-cell">
          <div class="sg-circle" style="border-color:${color}">${cellContent}</div>
        </div>
      `;
    }

    let moonHTML = '';
    if (options.includeMoonPhases && m.days.some(d => d.moonPhase)) {
      const moonDays = m.days.filter(d => d.moonPhase && [1, 14, 21, 28].includes(d.day));
      const uniqueMoons = moonDays.slice(0, 4);
      
      moonHTML = `<div class="sg-moons">`;
      for (const day of uniqueMoons) {
        if (day.moonPhase) {
          moonHTML += `
            <div class="sg-moon-item">
              <span class="sg-moon-glyph">${day.moonPhase.glyph}</span>
              <span class="sg-moon-day">Day ${day.day}</span>
              <span class="sg-moon-name">${day.moonPhase.phase}</span>
            </div>
          `;
        }
      }
      moonHTML += `</div>`;
    }

    return `
      <div class="sg-month">
        <div class="sg-bar" style="background:${color}"></div>
        <div class="sg-head">
          <span class="sg-hex">⬡</span>
          <div class="sg-mid">
            <div class="sg-small">THE MODERN HEKA CALENDAR</div>
            <h2 class="sg-name" style="color:${color}">${m.month.name}</h2>
            <div class="sg-tag" style="border-color:${color};color:${color}">${m.arcLabel.toUpperCase()} ARC — MONTH ${m.monthNumber}/13</div>
            ${civilRange ? `<div class="sg-civil-range">${civilRange}</div>` : ''}
          </div>
          <span class="sg-hex">⬡</span>
        </div>
        <div class="sg-dow">
          <span style="color:${color}">SAT</span>
          <span style="color:${color}">SUN</span>
          <span style="color:${color}">MON</span>
          <span style="color:${color}">TUE</span>
          <span style="color:${color}">WED</span>
          <span style="color:${color}">THU</span>
          <span style="color:${color}">FRI</span>
        </div>
        <div class="sg-grid">${daysHTML}</div>
        ${moonHTML}
      </div>
    `;
  };

  return `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: Georgia, serif; background: #faf8f5; color: #1a1a1a; }
      
      .sg-cover {
        min-height: 650px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
        background: #0a0a0f;
        position: relative;
      }
      
      .sg-cover-icon { font-size: 100px; color: #c9a227; margin-bottom: 30px; }
      .sg-cover-brand { font-size: 14px; letter-spacing: 8px; color: #c9a227; margin-bottom: 20px; }
      .sg-cover-year { font-size: 140px; font-weight: 700; color: #c9a227; line-height: 1; margin: 20px 0; }
      .sg-cover-info { font-size: 13px; color: #666; letter-spacing: 3px; margin: 8px 0; }
      .sg-arcs { display: flex; justify-content: center; gap: 60px; margin-top: 60px; }
      .sg-arc-item { display: flex; align-items: center; gap: 12px; font-size: 13px; letter-spacing: 2px; }
      .sg-arc-dot { width: 16px; height: 16px; border-radius: 50%; }
      
      .sg-month {
        min-height: 600px;
        margin-bottom: 24px;
        background: #faf8f5;
        border: 1px solid #d4c9a8;
        border-radius: 8px;
        padding: 20px;
      }
      
      .sg-bar { height: 4px; margin-bottom: 18px; }
      .sg-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #d4c9a8; }
      .sg-hex { font-size: 36px; color: #c9a227; opacity: 0.4; }
      .sg-mid { text-align: center; flex: 1; }
      .sg-small { font-size: 10px; letter-spacing: 4px; color: #888; margin-bottom: 6px; }
      .sg-name { font-size: 42px; font-weight: 600; margin: 6px 0; }
      .sg-tag { display: inline-block; padding: 6px 16px; border: 1px solid; border-radius: 20px; font-size: 11px; letter-spacing: 2px; margin-top: 8px; }
      .sg-civil-range { font-size: 11px; color: #666; margin-top: 10px; letter-spacing: 1px; font-style: italic; }
      
      .sg-dow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; margin-bottom: 8px; }
      .sg-dow span { text-align: center; font-size: 11px; letter-spacing: 2px; padding: 8px 4px; font-weight: 600; }
      
      .sg-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; }
      .sg-cell { min-height: 100px; padding: 6px; display: flex; align-items: center; justify-content: center; }
      .sg-cell.sg-empty { opacity: 0.4; }
      
      .sg-circle { width: 80px; height: 80px; border-radius: 50%; border: 2px solid; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
      .sg-empty-circle { width: 80px; height: 80px; border-radius: 50%; border: 2px dashed #ccc; }
      
      .sg-daynum { font-size: 20px; font-weight: 700; line-height: 1; }
      .sg-notes { margin-top: 3px; width: 100%; padding: 0 2px; }
      .sg-note { font-size: 7px; color: #444; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sg-holiday { font-size: 6px; font-weight: 600; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90%; letter-spacing: 0.2px; }
      
      .sg-moons { display: flex; justify-content: center; gap: 30px; padding: 15px; background: rgba(201, 162, 39, 0.08); border-radius: 10px; margin-top: 20px; border: 1px solid rgba(201, 162, 39, 0.2); }
      .sg-moon-item { display: flex; flex-direction: column; align-items: center; gap: 3px; }
      .sg-moon-glyph { font-size: 20px; }
      .sg-moon-day { font-size: 9px; color: #666; letter-spacing: 1px; }
      .sg-moon-name { font-size: 8px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
      
      @media print {
        .sg-cover { min-height: 265mm; page-break-after: always; background: #0a0a0f !important; }
        .sg-month { min-height: 265mm; height: 265mm; page-break-after: always; margin-bottom: 0; }
        .sg-circle { background: #fff !important; }
        body { background: #fff !important; }
      }
    </style>
    
    ${isMonthMode ? '' : `
    <div class="sg-cover">
      <div class="sg-cover-icon">◈</div>
      <div class="sg-cover-brand">THE MODERN HEKA CALENDAR</div>
      <h1 class="sg-cover-year">${data.year}</h1>
      <div class="sg-cover-info">APRIL ${data.year} — MARCH ${data.year + 1}</div>
      <div class="sg-arcs">
        <div class="sg-arc-item"><span class="sg-arc-dot" style="background:#dc2626"></span>OPENING ARC</div>
        <div class="sg-arc-item"><span class="sg-arc-dot" style="background:#16a34a"></span>CORE ARC</div>
        <div class="sg-arc-item"><span class="sg-arc-dot" style="background:#7c3aed"></span>CLOSING ARC</div>
      </div>
    </div>
    `}
    ${data.months.map(generateMonth).join('')}
  `;
}

// ============================================================================
// THEME 3: NATURE ORGANIC (Placeholder - returns minimalist for now)
// ============================================================================

function generateNatureOrganic(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string {
  // Placeholder - uses minimalist as base
  return generateMinimalist(data, options, mode);
}

// ============================================================================
// THEME 4: CYBERPUNK (Placeholder - returns minimalist for now)
// ============================================================================

function generateCyberpunk(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string {
  // Placeholder - uses minimalist as base
  return generateMinimalist(data, options, mode);
}

// ============================================================================
// THEME 5: ANCIENT EGYPT (Placeholder - returns minimalist for now)
// ============================================================================

function generateAncientEgypt(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string {
  // Placeholder - uses minimalist as base
  return generateMinimalist(data, options, mode);
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

export function generateThemeHTML(theme: string, data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string {
  switch (theme) {
    case 'minimalist':
      return generateMinimalist(data, options, mode);
    case 'sacred-geometry':
      return generateSacredGeometry(data, options, mode);
    case 'nature-organic':
      return generateNatureOrganic(data, options, mode);
    case 'cyberpunk':
      return generateCyberpunk(data, options, mode);
    case 'ancient-egypt':
      return generateAncientEgypt(data, options, mode);
    default:
      return '';
  }
}
