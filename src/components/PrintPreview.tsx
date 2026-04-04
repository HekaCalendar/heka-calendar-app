import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setView } from '../store';
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
import { getHolidaysForDate, ARC_NAMES, NOTE_CATEGORIES } from '../types';
import { THEMES, FONTS } from '../types/themes';
import { generateThemeHTML, prepareYearData } from './PrintThemes';
import { PrintManager } from '../services/PrintManager';
import './PrintPreview.css';

const DEFAULT_OPTIONS: PrintOptions = {
  includeNotes: true,
  includeMoonPhases: true,
  includeCivilDates: true,
  includeSeasonalEvents: true,
  includeHolidays: true,
  paperSize: 'A4',
  orientation: 'portrait',
  theme: 'default',
};

const THEME_OPTIONS = [
  { value: 'default', label: 'Default', icon: '✦' },
  { value: 'minimalist', label: 'Minimalist', icon: '◯' },
  { value: 'sacred-geometry', label: 'Sacred Geometry', icon: '⬡' },
  { value: 'nature-organic', label: 'Nature', icon: '🌿' },
  { value: 'cyberpunk', label: 'Cyberpunk', icon: '⚡' },
  { value: 'ancient-egypt', label: 'Egyptian', icon: '𓂀' },
] as const;

const PAPER_SIZES = [
  { value: 'A4', label: 'A4', dimensions: '210 × 297 mm' },
  { value: 'A3', label: 'A3', dimensions: '297 × 420 mm' },
  { value: 'Letter', label: 'Letter', dimensions: '8.5 × 11 in' },
] as const;

// Paper dimensions at 150 DPI
// A4: 210×297mm
const A4_WIDTH = 1240;   // 210mm at 150 DPI
const A4_HEIGHT = 1754;  // 297mm at 150 DPI
// A3: 297×420mm (double A4)
const A3_WIDTH = 1754;   // 297mm at 150 DPI
const A3_HEIGHT = 2480;  // 420mm at 150 DPI
// Letter: 8.5×11in (215.9×279.4mm)
const LETTER_WIDTH = 1275;  // 8.5in at 150 DPI
const LETTER_HEIGHT = 1650; // 11in at 150 DPI
const MONTH_VIEW_INSET = 35; // 6mm in pixels at 150 DPI (~35px)

// Helper: Get page dimensions based on paper size and orientation
function getPageDimensions(paperSize: string, isLandscape: boolean): { width: number; height: number } {
  let width: number;
  let height: number;
  
  switch (paperSize) {
    case 'A3':
      width = A3_WIDTH;
      height = A3_HEIGHT;
      break;
    case 'Letter':
      width = LETTER_WIDTH;
      height = LETTER_HEIGHT;
      break;
    case 'A4':
    default:
      width = A4_WIDTH;
      height = A4_HEIGHT;
  }
  
  // Swap for landscape
  if (isLandscape) {
    return { width: height, height: width };
  }
  return { width, height };
}

// Helper: Get month view CSS overrides (used by both preview and PDF)
function getMonthViewOverrides(isLandscape: boolean = false, paperSize: string = 'A4'): string {
  const inset = MONTH_VIEW_INSET;
  const borderWidth = 3;
  const { width: pageWidth, height: pageHeight } = getPageDimensions(paperSize, isLandscape);
  const contentWidth = pageWidth - (inset * 2);
  const contentHeight = pageHeight - (inset * 2);
  const padding = inset - borderWidth;
  const cellWidth = Math.floor((contentWidth - (padding * 2) - 12) / 7);
  // Landscape: shorter cells to fit, Portrait: standard 155px
  const cellHeight = isLandscape ? 130 : 155;
  
  console.log(`[DEBUG getMonthViewOverrides] isLandscape=${isLandscape}, page=${pageWidth}x${pageHeight}, content=${contentWidth}x${contentHeight}, cell=${cellWidth}x${cellHeight}`);
  
  // Landscape needs smaller header text
  const headerScale = isLandscape ? 0.85 : 1;
  
  return `
/* Month View ${isLandscape ? 'Landscape' : 'Portrait'} Overrides */
.month-page { 
  box-sizing: border-box !important;
  width: ${contentWidth}px !important; 
  height: ${contentHeight}px !important;
  position: absolute !important; 
  top: ${inset}px !important; 
  left: ${inset}px !important;
  right: auto !important;
  bottom: auto !important;
  margin: 0 !important;
  padding: ${padding}px !important;
  transform: none !important;
  border: none !important; /* No border */
}
/* Arc header styling - NO BORDER on page */
.month-page[data-arc="opening"] .month-print-header { 
  color: #dc2626 !important; 
  border-bottom-color: #dc2626 !important;
}
.month-page[data-arc="core"] .month-print-header { 
  color: #16a34a !important; 
  border-bottom-color: #16a34a !important;
}
.month-page[data-arc="closing"] .month-print-header { 
  color: #7c3aed !important; 
  border-bottom-color: #7c3aed !important;
}
.month-page[data-arc="opening"] .month-header { 
  border: 2px solid #dc2626 !important;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
}
.month-page[data-arc="core"] .month-header { 
  border: 2px solid #16a34a !important;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
}
.month-page[data-arc="closing"] .month-header { 
  border: 2px solid #7c3aed !important;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%) !important;
}
/* Enhanced header styling */
.month-print-header {
  font-size: calc(14px * ${headerScale}) !important;
  letter-spacing: 8px !important;
  font-weight: 700 !important;
  margin-bottom: 16px !important;
  padding-bottom: 10px !important;
  border-bottom: 2px solid !important;
}
.month-header { 
  margin-bottom: 12px !important; 
  padding: 12px 20px !important;
  border-radius: 8px !important;
}
.calendar-grid { 
  grid-template-columns: repeat(7, ${cellWidth}px); 
  grid-auto-rows: ${cellHeight}px; 
  gap: 2px; 
}
.day-cell { height: ${cellHeight}px; }
.dow-row { 
  grid-template-columns: repeat(7, ${cellWidth}px); 
  gap: 2px; 
  padding: 6px 0; 
}`;
}

// Helper: wrap a single page content in a complete HTML document
function wrapPage(content: string, css: string, isPreview: boolean = false, isYearView: boolean = false, isLandscape: boolean = false, paperSize: string = 'A4'): string {
  const yearWrapperClass = isYearView ? `year-view${isLandscape ? ' landscape' : ''}` : '';
  const isMonthView = !isYearView;
  const { width: PAGE_WIDTH, height: PAGE_HEIGHT } = getPageDimensions(paperSize, isLandscape);
  
  // FORCE all dimensions to exact pixels - kill all mm references
  let processedCSS = css
    .replace(/width:\s*\d+mm;?\s*height:\s*\d+mm;?/gi, `width: ${PAGE_WIDTH}px; height: ${PAGE_HEIGHT}px;`)
    .replace(/width:\s*195mm;?/gi, `width: ${PAGE_WIDTH}px`)
    .replace(/height:\s*285mm;?/gi, `height: ${PAGE_HEIGHT}px`)
    .replace(/width:\s*210mm;?/gi, `width: ${PAGE_WIDTH}px`)
    .replace(/height:\s*297mm;?/gi, `height: ${PAGE_HEIGHT}px`)
    .replace(/margin:\s*6mm\s+auto[^;]*;/gi, '');
  
  // Debug: Log dimensions
  const contentWidth = PAGE_WIDTH - 70;
  const contentHeight = PAGE_HEIGHT - 70;
  console.log(`[DEBUG] ${isLandscape ? 'Landscape' : 'Portrait'} mode: PAGE ${PAGE_WIDTH}x${PAGE_HEIGHT}, Content ${contentWidth}x${contentHeight}`);
  
  if (isPreview) {
    // Preview mode: Scale pages to fit viewport
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
html, body { 
  background: #e5e5e5; 
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.5;
  min-height: 100vh;
  padding: 10px 0;
}
.page-scaler {
  width: fit-content;
  margin: 0 auto 15px;
  transform: scale(calc((100vw - 20px) / ${PAGE_WIDTH}));
  transform-origin: top center;
}
.page-wrapper {
  width: ${PAGE_WIDTH}px !important;
  height: ${PAGE_HEIGHT}px !important;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
}
/* FORCE: Override any mm values in template */
.month-page, .year-cover { width: ${PAGE_WIDTH}px !important; height: ${PAGE_HEIGHT}px !important; }
${processedCSS}
${isMonthView ? getMonthViewOverrides(isLandscape, paperSize) : ''}
</style>
</head>
<body>
<div class="page-scaler">
  <div class="page-wrapper ${yearWrapperClass}">
    ${content}
  </div>
</div>
</body>
</html>`;
  }
  
  // PDF generation mode: pixel-perfect A4 rendering
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=${PAGE_WIDTH}, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<style>
@page { size: ${paperSize} ${isLandscape ? 'landscape' : 'portrait'}; margin: 0; }
@media print {
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  html, body { width: ${PAGE_WIDTH}px; height: ${PAGE_HEIGHT}px; margin: 0; padding: 0; }
}
* { box-sizing: border-box; }
html, body { 
  margin: 0; 
  padding: 0; 
  background: white; 
  width: ${PAGE_WIDTH}px; 
  height: ${PAGE_HEIGHT}px; 
  overflow: hidden;
}
.page-wrapper { 
  width: ${PAGE_WIDTH}px; 
  height: ${PAGE_HEIGHT}px; 
  position: relative; 
  overflow: hidden; 
  background: white; 
}
${processedCSS}
${isMonthView ? getMonthViewOverrides(isLandscape, paperSize) : ''}
</style>
</head>
<body>
<div class="page-wrapper ${yearWrapperClass}">
${content}
</div>
</body>
</html>`;
}

// Generate calendar HTML for preview and printing
function generateCalendarHTML(
  mode: 'month' | 'year',
  viewDate: { year: number; month: number },
  options: PrintOptions,
  notes: Record<string, any[]>,
  location: string,
  _themeColors: any,
  timeMode: string = 'SYNC'
): { preview: string; pages: string[] } {
  const year = viewDate.year;
  
  const getMonthData = (monthIndex: number) => {
    const month = HEKA_MONTHS[monthIndex];
    const arc = getArcType(monthIndex as any);
    const daysInMonth = getDaysInMonth(year, monthIndex as any);
    const firstDayCivil = getCivilStartOfHekaMonth(year, monthIndex as any);
    const startDayOffset = (firstDayCivil.getDay() + 1) % 7;
    
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const civilDate = hekaToCivil({ year, month: monthIndex as any, day });
      const noteKey = getNoteKey(year, monthIndex, day);
      
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
    
    return { month, monthIndex, arc, days, startDayOffset, monthNumber: monthIndex + 1 };
  };
  
  const generateYearCover = (timeMode: string = 'SYNC') => `
    <div class="year-cover">
      <div class="year-cover__corner year-cover__corner--tl">❧</div>
      <div class="year-cover__corner year-cover__corner--tr">❧</div>
      <div class="year-cover__corner year-cover__corner--bl">❧</div>
      <div class="year-cover__corner year-cover__corner--br">❧</div>
      <div class="year-cover__bg-glow"></div>
      <div class="year-cover__geometric-pattern"></div>
      <div class="year-cover__sacred-geometry"></div>
      <div class="year-cover__mandala"></div>
      <div class="year-cover__merkaba">
        <svg viewBox="0 0 580 750" xmlns="http://www.w3.org/2000/svg">
          <!-- Upward pointing triangle -->
          <path d="M290 50 L530 550 L50 550 Z" fill="none" stroke="#b8941f" stroke-width="2"/>
          <!-- Downward pointing triangle (Merkaba) -->
          <path d="M290 700 L50 200 L530 200 Z" fill="none" stroke="#b8941f" stroke-width="2"/>
          <!-- Inner upward triangle -->
          <path d="M290 150 L430 400 L150 400 Z" fill="none" stroke="#b8941f" stroke-width="1" opacity="0.6"/>
          <!-- Inner downward triangle -->
          <path d="M290 600 L150 350 L430 350 Z" fill="none" stroke="#b8941f" stroke-width="1" opacity="0.6"/>
          <!-- Center circle -->
          <circle cx="290" cy="375" r="60" fill="none" stroke="#b8941f" stroke-width="1" opacity="0.5"/>
          <!-- Corner circles -->
          <circle cx="290" cy="50" r="15" fill="none" stroke="#b8941f" stroke-width="1" opacity="0.4"/>
          <circle cx="50" cy="550" r="15" fill="none" stroke="#b8941f" stroke-width="1" opacity="0.4"/>
          <circle cx="530" cy="550" r="15" fill="none" stroke="#b8941f" stroke-width="1" opacity="0.4"/>
          <circle cx="290" cy="700" r="15" fill="none" stroke="#b8941f" stroke-width="1" opacity="0.4"/>
          <circle cx="50" cy="200" r="15" fill="none" stroke="#b8941f" stroke-width="1" opacity="0.4"/>
          <circle cx="530" cy="200" r="15" fill="none" stroke="#b8941f" stroke-width="1" opacity="0.4"/>
        </svg>
      </div>
      <div class="year-cover__content">
        
        <!-- DRAMATIC HEADER -->
        <div class="year-cover__header-section">
          <div class="year-cover__header-rule">
            <span class="year-cover__header-ornament">◈</span>
            <span class="year-cover__header-line"></span>
            <span class="year-cover__header-ornament">◈</span>
          </div>
          <div class="year-cover__title-block">
            <div class="year-cover__title-year">THE</div>
            <div class="year-cover__title-main">MODERN <span class="year-cover__title-accent">HEKA</span></div>
            <div class="year-cover__title-sub">CALENDAR</div>
          </div>
          <div class="year-cover__header-rule">
            <span class="year-cover__header-ornament">◈</span>
            <span class="year-cover__header-line"></span>
            <span class="year-cover__header-ornament">◈</span>
          </div>
          <div class="year-cover__subtitle">A Sacred 13-Month Journey Through Time</div>
        </div>
        
        <!-- YEAR DISPLAY -->
        <div class="year-cover__year-section">
          <div class="year-cover__year-ring">
            <span class="year-cover__year-label">Year</span>
            <span class="year-cover__year-number">${year}</span>
          </div>
          <div class="year-cover__year-span">
            <span class="year-cover__year-start">April ${year}</span>
            <span class="year-cover__year-arrow">→</span>
            <span class="year-cover__year-end">March ${year}</span>
          </div>
          <div class="year-cover__year-note">Begins with the Month of April • Concludes with the Month of March</div>
        </div>
        
        <!-- THREE ARCS -->
        <div class="year-cover__section year-cover__section--arcs">
          <div class="year-cover__section-header">
            <span class="year-cover__section-line"></span>
            <span class="year-cover__section-icon">◈</span>
            <span class="year-cover__section-title">THE THREE ARCS</span>
            <span class="year-cover__section-icon">◈</span>
            <span class="year-cover__section-line"></span>
          </div>
          <div class="year-cover__arcs-grid">
            <div class="year-cover__arc-card year-cover__arc-card--opening">
              <div class="year-cover__arc-symbol">
                <div class="year-cover__arc-shape">◈</div>
                <div class="year-cover__arc-ring"></div>
              </div>
              <div class="year-cover__arc-content">
                <div class="year-cover__arc-name">OPENING</div>
                <div class="year-cover__arc-months">April</div>
                <div class="year-cover__arc-desc">The First Month</div>
              </div>
            </div>
            <div class="year-cover__arc-card year-cover__arc-card--core">
              <div class="year-cover__arc-symbol">
                <div class="year-cover__arc-shape">◉</div>
                <div class="year-cover__arc-ring"></div>
              </div>
              <div class="year-cover__arc-content">
                <div class="year-cover__arc-name">CORE</div>
                <div class="year-cover__arc-months">May – December</div>
                <div class="year-cover__arc-desc">Eight Months of Being</div>
              </div>
            </div>
            <div class="year-cover__arc-card year-cover__arc-card--closing">
              <div class="year-cover__arc-symbol">
                <div class="year-cover__arc-shape">◐</div>
                <div class="year-cover__arc-ring"></div>
              </div>
              <div class="year-cover__arc-content">
                <div class="year-cover__arc-name">CLOSING</div>
                <div class="year-cover__arc-months">January – March</div>
                <div class="year-cover__arc-desc">Final Three Months</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- THE HEKA WEEK -->
        <div class="year-cover__section year-cover__section--week">
          <div class="year-cover__section-header">
            <span class="year-cover__section-line"></span>
            <span class="year-cover__section-icon">◉</span>
            <span class="year-cover__section-title">THE HEKA WEEK</span>
            <span class="year-cover__section-icon">◉</span>
            <span class="year-cover__section-line"></span>
          </div>
          <div class="year-cover__week-grid">
            <div class="year-cover__week-day year-cover__week-day--weekend">
              <span class="year-cover__week-dot"></span>
              <span class="year-cover__week-name">Sat</span>
            </div>
            <div class="year-cover__week-day year-cover__week-day--weekend">
              <span class="year-cover__week-dot"></span>
              <span class="year-cover__week-name">Sun</span>
            </div>
            <div class="year-cover__week-day">
              <span class="year-cover__week-dot"></span>
              <span class="year-cover__week-name">Mon</span>
            </div>
            <div class="year-cover__week-day">
              <span class="year-cover__week-dot"></span>
              <span class="year-cover__week-name">Tue</span>
            </div>
            <div class="year-cover__week-day">
              <span class="year-cover__week-dot"></span>
              <span class="year-cover__week-name">Wed</span>
            </div>
            <div class="year-cover__week-day">
              <span class="year-cover__week-dot"></span>
              <span class="year-cover__week-name">Thu</span>
            </div>
            <div class="year-cover__week-day year-cover__week-day--weekend">
              <span class="year-cover__week-dot"></span>
              <span class="year-cover__week-name">Fri</span>
            </div>
          </div>
          <div class="year-cover__week-note">Four Days Work • Three Days Rest</div>
        </div>
        
        <!-- FOOTER META -->
        <div class="year-cover__footer">
          <div class="year-cover__footer-line"></div>
          <div class="year-cover__footer-meta">
            <span class="year-cover__footer-item">13 Months</span>
            <span class="year-cover__footer-divider">◆</span>
            <span class="year-cover__footer-item">28 Days Each</span>
            <span class="year-cover__footer-divider">◆</span>
            <span class="year-cover__footer-item">March: 29 or 30 Days</span>
            <span class="year-cover__footer-divider">◆</span>
            <span class="year-cover__footer-item">Mode: ${timeMode}</span>
          </div>
          <div class="year-cover__footer-motto">Time is a Circle, Not a Line</div>
        </div>
        
      </div>
    </div>
  `;
  
  const generateMonth = (monthIndex: number) => {
    const { month, arc, days, startDayOffset, monthNumber } = getMonthData(monthIndex);
    
    let daysHTML = '';
    
    for (let i = 0; i < startDayOffset; i++) {
      daysHTML += `<div class="day-cell day-cell--empty"><div class="day-content"></div></div>`;
    }
    
    for (const day of days) {
      const noteContent = day.notes.length > 0 && options.includeNotes 
        ? day.notes.slice(0, 3).map(n => {
            const categoryColor = NOTE_CATEGORIES.find(c => c.id === n.category)?.color || '#c9a227';
            return `<div class="note-box" style="border-left-color: ${categoryColor};">${n.content.substring(0, 25)}${n.content.length > 25 ? '...' : ''}</div>`;
          }).join('')
        : '';
      
      const holidayContent = day.holidays.length > 0 && options.includeHolidays
        ? `<div class="holiday">${day.holidays[0].name.substring(0, 30)}${day.holidays[0].name.length > 30 ? '...' : ''}</div>`
        : '';
      
      const moonDisplay = day.moonPhase && options.includeMoonPhases
        ? `<span class="moon-phase">${day.moonPhase.glyph}</span>` : '';
      
      const civilDisplay = options.includeCivilDates
        ? `<div class="civil-date">${day.civilDate.getDate()}/${day.civilDate.getMonth() + 1}</div>`
        : '';
      
      daysHTML += `
        <div class="day-cell">
          <div class="day-content">
            <div class="day-header">
              <span class="day-number">${day.day}</span>
              ${moonDisplay}
            </div>
            ${civilDisplay}
            ${noteContent ? `<div class="notes-area">${noteContent}</div>` : ''}
            ${holidayContent}
          </div>
        </div>
      `;
    }
    
    return `
      <div class="month-page" data-arc="${arc.toLowerCase()}">
        <div class="month-print-header">The Modern HEKA Calendar</div>
        <div class="month-header">
          <div class="month-header-content">
            <div>
              <h2 class="month-title">${month.name}</h2>
              <div class="month-subtitle">Month ${monthNumber} of 13 · ${ARC_NAMES[arc]} Arc</div>
            </div>
          </div>
        </div>
        <div class="dow-row">
          <span>Sat</span><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
        </div>
        <div class="calendar-grid">${daysHTML}</div>
      </div>
    `;
  };

  // Detect orientation
  const isLandscape = options.orientation === 'landscape';
  console.log(`[DEBUG generateCalendarHTML] orientation=${options.orientation}, isLandscape=${isLandscape}`);
  
  // Generate content HTML
  const pages: string[] = [];
  
  // Get the FULL beautiful CSS
  const fullCSS = getFullPrintStyles();
  
  if (options.theme !== 'default') {
    const yearData = prepareYearData(year, options, notes, location);
    if (mode === 'month') {
      const singleMonthData = { ...yearData, months: [yearData.months[viewDate.month]] };
      const contentHTML = generateThemeHTML(options.theme, singleMonthData, options, mode);
      // For non-default themes, wrap in single page
      pages.push(wrapPage(contentHTML, fullCSS, false, false, isLandscape, options.paperSize));
    } else {
      const contentHTML = generateThemeHTML(options.theme, yearData, options, mode);
      // Split by pages
      const splits = contentHTML.split(/(?=<div[^>]*class="min-cover"[^>]*>)/);
      for (const split of splits) {
        if (split.trim()) {
          pages.push(wrapPage(split, fullCSS, false, false, isLandscape, options.paperSize));
        }
      }
    }
  } else {
    // Default theme - generate year cover and months as separate pages
    if (mode === 'year') {
      pages.push(wrapPage(generateYearCover(timeMode), fullCSS, false, true, isLandscape, options.paperSize)); // Year cover
      for (let i = 0; i < 13; i++) {
        pages.push(wrapPage(generateMonth(i), fullCSS, false, true, isLandscape, options.paperSize)); // Year view months
      }
    } else {
      pages.push(wrapPage(generateMonth(viewDate.month), fullCSS, false, false, isLandscape, options.paperSize)); // Single month
    }
  }

  // Generate preview HTML with pixel-based dimensions for display
  const previewPages: string[] = [];
  
  if (options.theme !== 'default') {
    const yearData = prepareYearData(year, options, notes, location);
    if (mode === 'month') {
      const singleMonthData = { ...yearData, months: [yearData.months[viewDate.month]] };
      const contentHTML = generateThemeHTML(options.theme, singleMonthData, options, mode);
      previewPages.push(wrapPage(contentHTML, fullCSS, true, false, isLandscape, options.paperSize));
    } else {
      const contentHTML = generateThemeHTML(options.theme, yearData, options, mode);
      const splits = contentHTML.split(/(?=<div[^>]*class="min-cover"[^>]*>)/);
      for (const split of splits) {
        if (split.trim()) {
          previewPages.push(wrapPage(split, fullCSS, true, false, isLandscape, options.paperSize));
        }
      }
    }
  } else {
    if (mode === 'year') {
      previewPages.push(wrapPage(generateYearCover(timeMode), fullCSS, true, true, isLandscape, options.paperSize)); // Year cover
      for (let i = 0; i < 13; i++) {
        previewPages.push(wrapPage(generateMonth(i), fullCSS, true, true, isLandscape, options.paperSize));
      }
    } else {
      previewPages.push(wrapPage(generateMonth(viewDate.month), fullCSS, true, false, isLandscape, options.paperSize));
    }
  }
  
  // Build preview pages - each with proper wrapper classes
  const isMonthView = mode === 'month';
  const { width: previewWidth, height: previewHeight } = getPageDimensions(options.paperSize, isLandscape);
  
  // Determine wrapper class for each page type
  const getWrapperClass = (pageIndex: number) => {
    if (isMonthView) return ''; // Single month has no special class
    // Year mode: first page (index 0) is cover, rest are months
    if (pageIndex === 0) return `year-view${isLandscape ? ' landscape' : ''}`;
    return `year-view${isLandscape ? ' landscape' : ''}`; // Month pages also need year-view for consistent sizing
  };
  
  const previewContent = previewPages.map((p, i) => {
    // Extract the inner content from the page-wrapper
    // Use a more robust approach: find the page-wrapper div and extract its content
    const wrapperStartMatch = p.match(/<div class="page-wrapper[^"]*">/);
    const wrapperEndMatch = p.match(/<\/div>\s*<\/body>/);
    
    let innerContent;
    if (wrapperStartMatch && wrapperEndMatch) {
      const startIdx = wrapperStartMatch.index! + wrapperStartMatch[0].length;
      const endIdx = wrapperEndMatch.index!;
      innerContent = p.slice(startIdx, endIdx).trim();
    } else {
      innerContent = extractBody(p);
    }
    
    const wrapperClass = getWrapperClass(i);
    const pageBreak = i < previewPages.length - 1 ? '\n<div style="page-break-after: always; height: 20px;"></div>\n' : '';
    
    return `<div class="page-scaler"><div class="page-wrapper ${wrapperClass}">${innerContent}</div></div>${pageBreak}`;
  }).join('');
  
  console.log(`[DEBUG preview] isLandscape=${isLandscape}, mode=${mode}, preview dimensions=${previewWidth}x${previewHeight}`);
  
  // Preview HTML - pages displayed at full size in scrollable view
  const preview = `<!DOCTYPE html>
<html>
<head>
  <title>HEKA Calendar ${year}</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { 
      font-family: Georgia, 'Times New Roman', serif;
      background: #e5e5e5;
      line-height: 1.5;
      padding: 0;
      margin: 0;
    }
    .preview-container {
      padding: 20px 10px;
    }
    .page-scaler {
      width: fit-content;
      height: fit-content;
      margin: 0 auto 20px;
      /* Scale to fit viewport */
      transform: scale(calc((100vw - 40px) / ${previewWidth}));
      transform-origin: top center;
    }
    .page-wrapper {
      width: ${previewWidth}px !important;
      height: ${previewHeight}px !important;
      background: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      position: relative;
      overflow: visible;
    }
    .page-wrapper:last-child {
      margin-bottom: 0;
    }
    /* KILL ALL MM VALUES - FORCE PX */
    .month-page, .year-cover { width: ${previewWidth}px !important; height: ${previewHeight}px !important; }
    ${fullCSS.replace(/width:\s*\d+mm;?\s*height:\s*\d+mm;?/gi, `width: ${previewWidth}px; height: ${previewHeight}px;`)
             .replace(/width:\s*195mm;?/gi, `width: ${previewWidth}px`)
             .replace(/height:\s*285mm;?/gi, `height: ${previewHeight}px`)
             .replace(/width:\s*210mm;?/gi, `width: ${previewWidth}px`)
             .replace(/height:\s*297mm;?/gi, `height: ${previewHeight}px`)
             .replace(/width:\s*180mm;?/gi, `width: ${previewWidth}px`)
             .replace(/height:\s*270mm;?/gi, `height: ${previewHeight}px`)}
    ${isMonthView ? getMonthViewOverrides(isLandscape, options.paperSize) : ''}
  </style>
</head>
<body>
  <div class="preview-container">
    ${previewContent}
  </div>
</body>
</html>`;

  return { preview, pages };
}

// Helper: extract body content from HTML document
function extractBody(html: string): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  const bodyContent = bodyMatch ? bodyMatch[1].trim() : html;
  // Return the full page-outer + page-wrapper structure for preview
  return bodyContent;
}

// Helper function for FULL beautiful print styles
function getFullPrintStyles(): string {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    
    body { 
      font-family: Georgia, 'Times New Roman', serif; 
      background: white; 
      color: #1a1a1a;
      line-height: 1.5;
    }
    
    /* Year Cover - MAXIMUM IMPACT DESIGN */
    .year-cover { 
      background: 
        radial-gradient(ellipse 120% 100% at 50% 0%, rgba(255, 248, 225, 0.8) 0%, transparent 50%),
        radial-gradient(ellipse 80% 60% at 20% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 40%),
        radial-gradient(ellipse 80% 60% at 80% 80%, rgba(184, 148, 31, 0.12) 0%, transparent 40%),
        linear-gradient(165deg, #fdfcf7 0%, #f8f4e8 30%, #f3edd8 50%, #eae3cf 70%, #e8e0c5 100%);
      border: none;
      border-radius: 0; 
      padding: 0; 
      text-align: center; 
      width: 100%;
      height: 100%;
      display: flex; 
      flex-direction: column;
      justify-content: center; 
      align-items: center;
      position: relative; 
      overflow: visible;
      page-break-after: always;
      break-after: page;
    }
    
    /* Corner Ornaments */
    .year-cover__corner {
      position: absolute;
      font-size: 28px;
      color: #b8941f;
      opacity: 0.4;
      z-index: 10;
    }
    .year-cover__corner--tl { top: 25px; left: 25px; transform: rotate(0deg); }
    .year-cover__corner--tr { top: 25px; right: 25px; transform: rotate(90deg); }
    .year-cover__corner--bl { bottom: 25px; left: 25px; transform: rotate(-90deg); }
    .year-cover__corner--br { bottom: 25px; right: 25px; transform: rotate(180deg); }
    
    /* Merkaba/Triangle Frame around content */
    .year-cover__merkaba {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 580px;
      height: 750px;
      pointer-events: none;
      z-index: 2;
      opacity: 0.15;
    }
    
    .year-cover__merkaba svg {
      width: 100%;
      height: 100%;
    }
    
    .year-cover__bg-glow {
      position: absolute;
      inset: -30%;
      background: 
        radial-gradient(ellipse 100% 70% at 50% 10%, rgba(218, 165, 32, 0.2) 0%, transparent 55%),
        radial-gradient(ellipse 60% 50% at 15% 85%, rgba(184, 134, 11, 0.15) 0%, transparent 45%),
        radial-gradient(ellipse 60% 50% at 85% 85%, rgba(218, 165, 32, 0.12) 0%, transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(255, 248, 220, 0.3) 0%, transparent 50%);
      pointer-events: none;
    }
    
    .year-cover__geometric-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(184, 148, 31, 0.05) 0%, transparent 25%),
        radial-gradient(circle at 85% 85%, rgba(184, 148, 31, 0.05) 0%, transparent 25%),
        radial-gradient(circle at 50% 50%, rgba(90, 79, 207, 0.04) 0%, transparent 30%);
      pointer-events: none;
    }
    
    /* Combined Sacred Geometry Background */
    .year-cover__sacred-geometry {
      position: absolute;
      inset: 0;
      background-image: 
        /* Vesica Piscis top */
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Cg fill='none' stroke='%23b8941f' stroke-width='0.8' opacity='0.15'%3E%3Ccircle cx='35' cy='30' r='25'/%3E%3Ccircle cx='65' cy='30' r='25'/%3E%3C/g%3E%3C/svg%3E"),
        /* Seed of Life bottom */
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23b8941f' stroke-width='0.6' opacity='0.12'%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3Ccircle cx='50' cy='30' r='20'/%3E%3Ccircle cx='67' cy='40' r='20'/%3E%3Ccircle cx='67' cy='60' r='20'/%3E%3Ccircle cx='50' cy='70' r='20'/%3E%3Ccircle cx='33' cy='60' r='20'/%3E%3Ccircle cx='33' cy='40' r='20'/%3E%3C/g%3E%3C/svg%3E"),
        /* Platonic Solid - Tetrahedron left side */
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23b8941f' stroke-width='0.7' opacity='0.1'%3E%3Cpath d='M40 10 L70 60 L10 60 Z'/%3E%3Cpath d='M40 10 L40 70'/%3E%3Cpath d='M70 60 L40 70 L10 60'/%3E%3C/g%3E%3C/svg%3E"),
        /* Platonic Solid - Hexagon right side */
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23b8941f' stroke-width='0.7' opacity='0.1'%3E%3Cpath d='M40 5 L68 20 L68 52 L40 67 L12 52 L12 20 Z'/%3E%3Cpath d='M40 5 L40 67'/%3E%3Cpath d='M12 20 L68 52'/%3E%3Cpath d='M68 20 L12 52'/%3E%3C/g%3E%3C/svg%3E"),
        /* Sri Yantra elements */
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23b8941f' stroke-width='0.5' opacity='0.08'%3E%3Cpath d='M50 10 L90 80 L10 80 Z'/%3E%3Cpath d='M50 90 L20 30 L80 30 Z'/%3E%3Ccircle cx='50' cy='50' r='15'/%3E%3C/g%3E%3C/svg%3E"),
        /* Metatron's Cube fragment */
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%23b8941f' stroke-width='0.5' opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3Ccircle cx='30' cy='10' r='10'/%3E%3Ccircle cx='47' cy='20' r='10'/%3E%3Ccircle cx='47' cy='40' r='10'/%3E%3Ccircle cx='30' cy='50' r='10'/%3E%3Ccircle cx='13' cy='40' r='10'/%3E%3Ccircle cx='13' cy='20' r='10'/%3E%3C/g%3E%3C/svg%3E");
      background-position: 
        10% 15%,
        85% 85%,
        5% 50%,
        95% 40%,
        50% 95%,
        80% 10%;
      background-size: 120px 80px, 100px 100px, 80px 80px, 80px 80px, 100px 100px, 60px 60px;
      background-repeat: no-repeat;
      pointer-events: none;
      z-index: 1;
    }
    
    /* Additional geometric overlay */
    .year-cover__mandala {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 600px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cg fill='none' stroke='%23b8941f' stroke-width='1.2' opacity='0.12'%3E%3Ccircle cx='100' cy='100' r='95'/%3E%3Ccircle cx='100' cy='100' r='80'/%3E%3Ccircle cx='100' cy='100' r='65'/%3E%3Ccircle cx='100' cy='100' r='50'/%3E%3Ccircle cx='100' cy='100' r='35'/%3E%3Cpath d='M100 5 L100 195 M5 100 L195 100 M15 15 L185 185 M15 185 L185 15'/%3E%3Cpath d='M100 25 L135 70 L175 85 L150 125 L160 170 L100 150 L40 170 L50 125 L25 85 L65 70 Z'/%3E%3C/g%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      pointer-events: none;
      z-index: 1;
    }
    
    .year-cover__content {
      position: relative;
      z-index: 10;
      width: 92%;
      max-width: 850px;
      padding: 20px 30px;
    }
    
    /* ===== DRAMATIC HEADER SECTION ===== */
    .year-cover__header-section {
      margin-bottom: 25px;
      margin-top: -100px;
    }
    
    .year-cover__header-rule {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin: 12px 0;
    }
    
    .year-cover__header-ornament {
      font-size: 14px;
      color: #b8941f;
      opacity: 0.6;
    }
    
    .year-cover__header-line {
      flex: 1;
      max-width: 220px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #b8941f 20%, #b8941f 80%, transparent);
    }
    
    .year-cover__title-block {
      margin: 20px 0;
    }
    
    .year-cover__title-year {
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 22px;
      font-weight: 400;
      letter-spacing: 24px;
      color: #8a8075;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    
    .year-cover__title-main {
      font-family: Georgia, serif;
      font-size: 96px;
      font-weight: 400;
      letter-spacing: 16px;
      color: #1a1816;
      line-height: 1.0;
      margin-bottom: 10px;
    }
    
    .year-cover__title-accent {
      color: #b8941f;
      font-weight: 600;
      text-shadow: 0 3px 12px rgba(184, 148, 31, 0.3);
    }
    
    .year-cover__title-sub {
      font-family: Georgia, serif;
      font-size: 78px;
      font-weight: 300;
      letter-spacing: 28px;
      color: #3a3530;
      line-height: 1;
    }
    
    .year-cover__subtitle {
      font-family: Georgia, serif;
      font-size: 24px;
      font-style: italic;
      color: #7a7065;
      letter-spacing: 6px;
      margin-top: 28px;
    }
    
    /* ===== YEAR SECTION ===== */
    .year-cover__year-section {
      margin-bottom: 28px;
      padding: 20px 0;
      border-top: 1px solid rgba(0,0,0,0.08);
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    
    .year-cover__year-ring {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .year-cover__year-label {
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 12px;
      letter-spacing: 8px;
      color: #9a9085;
      text-transform: uppercase;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .year-cover__year-number { 
      font-family: Georgia, serif; 
      font-size: 110px; 
      font-weight: 400; 
      line-height: 1; 
      color: #1a1816;
      letter-spacing: -4px;
    }
    
    .year-cover__year-span {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 8px;
    }
    
    .year-cover__year-start, .year-cover__year-end {
      font-family: Georgia, serif;
      font-size: 18px;
      color: #5a5045;
      letter-spacing: 2px;
    }
    
    .year-cover__year-arrow {
      font-size: 16px;
      color: #b8941f;
      opacity: 0.6;
    }
    
    .year-cover__year-note {
      font-size: 10px;
      color: #9a9085;
      letter-spacing: 1px;
      font-style: italic;
    }
    
    /* ===== SECTION CONTAINERS (ALIGNED) ===== */
    .year-cover__section {
      width: 100%;
      max-width: 780px;
      margin: 0 auto 28px auto;
      padding: 28px 36px;
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }
    
    .year-cover__section-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    
    .year-cover__section-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,0,0,0.15), transparent);
      max-width: 60px;
    }
    
    .year-cover__section-icon {
      font-size: 10px;
      color: #b8941f;
      opacity: 0.7;
    }
    
    .year-cover__section-title {
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 8px;
      color: #5a5045;
      text-transform: uppercase;
    }
    
    /* ===== THREE ARCS ===== */
    .year-cover__arcs-grid { 
      display: grid; 
      grid-template-columns: repeat(3, 1fr); 
      gap: 10px; 
    }
    
    .year-cover__arc-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 18px;
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-top: 4px solid transparent;
    }
    
    .year-cover__arc-card--opening { border-top-color: #a85c5c; }
    .year-cover__arc-card--core { border-top-color: #4a8a6a; }
    .year-cover__arc-card--closing { border-top-color: #6a5aa0; }
    
    .year-cover__arc-symbol {
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }
    
    .year-cover__arc-shape {
      font-size: 36px;
      z-index: 2;
    }
    
    .year-cover__arc-card--opening .year-cover__arc-shape { color: #a85c5c; }
    .year-cover__arc-card--core .year-cover__arc-shape { color: #4a8a6a; }
    .year-cover__arc-card--closing .year-cover__arc-shape { color: #6a5aa0; }
    
    .year-cover__arc-ring {
      position: absolute;
      inset: 0;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 50%;
    }
    
    .year-cover__arc-content {
      text-align: center;
    }
    
    .year-cover__arc-name { 
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 16px; 
      font-weight: 700; 
      letter-spacing: 4px;
      margin-bottom: 10px;
    }
    
    .year-cover__arc-card--opening .year-cover__arc-name { color: #8a4a4a; }
    .year-cover__arc-card--core .year-cover__arc-name { color: #3a7a5a; }
    .year-cover__arc-card--closing .year-cover__arc-name { color: #5a4a8a; }
    
    .year-cover__arc-months {
      font-size: 14px;
      color: #5a5045;
      letter-spacing: 1px;
      font-weight: 500;
      margin-bottom: 5px;
    }
    
    .year-cover__arc-desc {
      font-size: 12px;
      color: #8a8075;
      letter-spacing: 1px;
    }
    
    /* ===== THE HEKA WEEK ===== */
    .year-cover__week-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 14px;
      margin-bottom: 16px;
    }
    
    .year-cover__week-day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 18px 10px;
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(0,0,0,0.04);
    }
    
    .year-cover__week-day--weekend {
      background: rgba(184, 148, 31, 0.08);
      border-color: rgba(184, 148, 31, 0.15);
    }
    
    .year-cover__week-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #a0a0a0;
    }
    
    .year-cover__week-day--weekend .year-cover__week-dot {
      background: #b8941f;
    }
    
    .year-cover__week-name {
      font-size: 14px;
      font-weight: 600;
      color: #4a453f;
      letter-spacing: 1px;
    }
    
    .year-cover__week-day--weekend .year-cover__week-name {
      color: #8a7020;
    }
    
    .year-cover__week-note {
      font-size: 14px;
      color: #8a8075;
      letter-spacing: 2px;
      font-style: italic;
    }
    
    /* ===== FOOTER ===== */
    .year-cover__footer {
      margin-top: 16px;
      text-align: center;
    }
    
    .year-cover__footer-line {
      width: 100px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(184, 148, 31, 0.4), transparent);
      margin: 0 auto 12px auto;
    }
    
    .year-cover__footer-meta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    
    .year-cover__footer-item {
      font-size: 14px;
      color: #7a7065;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-weight: 500;
    }
    
    .year-cover__footer-divider {
      font-size: 8px;
      color: #b8941f;
      opacity: 0.6;
    }
    
    .year-cover__footer-motto {
      font-family: Georgia, serif;
      font-size: 18px;
      font-style: italic;
      color: #6a6055;
      letter-spacing: 3px;
    }
    
    /* ===== LANDSCAPE MODE OVERRIDES ===== */
    .year-view.landscape .year-cover {
        justify-content: flex-start !important;
        padding-top: 80px !important;
      }
      
    .year-view.landscape .year-cover__content {
        width: 95% !important;
        max-width: 1100px !important;
        padding: 0 20px !important;
      }
      
      .year-view.landscape .year-cover__header-section {
        margin-top: 0 !important;
        margin-bottom: 8px !important;
      }
      
      .year-view.landscape .year-cover__header-rule {
        margin: 6px 0 !important;
      }
      
      .year-view.landscape .year-cover__title-year {
        font-size: 20px !important;
        letter-spacing: 32px !important;
        margin-bottom: 6px !important;
      }
      
      .year-view.landscape .year-cover__title-main {
        font-size: 76px !important;
        letter-spacing: 28px !important;
        margin-bottom: 0 !important;
        line-height: 1.1 !important;
      }
      
      .year-view.landscape .year-cover__title-sub {
        font-size: 62px !important;
        letter-spacing: 40px !important;
        line-height: 1.1 !important;
      }
      
      .year-view.landscape .year-cover__subtitle {
        font-size: 12px !important;
        letter-spacing: 4px !important;
        margin-top: 4px !important;
      }
      
      .year-view.landscape .year-cover__year-section {
        margin-bottom: 10px !important;
        padding: 6px 0 !important;
      }
      
      .year-view.landscape .year-cover__year-number {
        font-size: 120px !important;
        letter-spacing: -2px !important;
        line-height: 1 !important;
      }
      
      .year-view.landscape .year-cover__year-start, .year-view.landscape .year-cover__year-end {
        font-size: 14px !important;
        letter-spacing: 4px !important;
      }
      
      .year-view.landscape .year-cover__section {
        max-width: 900px !important;
        margin-bottom: 8px !important;
        padding: 12px 18px !important;
      }
      
      .year-view.landscape .year-cover__section-title {
        font-size: 12px !important;
        letter-spacing: 8px !important;
        margin-bottom: 8px !important;
      }
      
      .year-view.landscape .year-cover__arcs-grid {
        gap: 18px !important;
      }
      
      .year-view.landscape .year-cover__arc-card {
        padding: 14px 16px !important;
      }
      
      .year-view.landscape .year-cover__arc-shape {
        font-size: 24px !important;
      }
      
      .year-view.landscape .year-cover__arc-name {
        font-size: 12px !important;
        letter-spacing: 5px !important;
        margin-bottom: 6px !important;
      }
      
      .year-view.landscape .year-cover__arc-months {
        font-size: 10px !important;
      }
      
      .year-view.landscape .year-cover__week-grid {
        gap: 12px !important;
        margin-bottom: 8px !important;
      }
      
      .year-view.landscape .year-cover__week-day {
        padding: 10px 6px !important;
        gap: 4px !important;
      }
      
      .year-view.landscape .year-cover__week-name {
        font-size: 11px !important;
      }
      
      .year-view.landscape .year-cover__merkaba {
        width: 400px !important;
        height: 520px !important;
      }
      
      .year-view.landscape .year-cover__mandala {
        width: 320px !important;
        height: 320px !important;
      }
      
      .year-view.landscape .year-cover__footer-meta {
        gap: 12px !important;
        margin-top: 20px !important;
      }
      
      .year-view.landscape .year-cover__footer-item {
        font-size: 11px;
      }
      
      .year-view.landscape .year-cover__footer-motto {
        font-size: 13px;
      }
    
    /* Month Pages - Premium Design - NO BORDER, arc colors in header instead */
    .month-page { 
      width: 100%;
      height: 100%;
      background: #fefefe;
      border-radius: 0; 
      padding: 30px;
      margin: 0;
      box-shadow: none;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
      position: relative;
      border: none !important; /* Explicitly remove border */
    }
    
    /* === YEAR VIEW SPECIFIC - Scaled down for 13 pages === */
    .year-view .month-page { 
      width: 100%;
      height: 100%;
      padding: 20px;
      margin: 0;
    }
    
    .year-view .month-title { 
      font-size: 38px; 
      letter-spacing: 3px;
    }
    
    .year-view .month-header { 
      padding: 10px 16px;
      margin-bottom: 10px;
    }
    
    .year-view .calendar-grid { 
      grid-auto-rows: 115px;
      gap: 1px;
    }
    
    .year-view .day-cell { 
      height: 115px;
      padding: 5px 6px;
      font-size: 9px;
    }
    
    .year-view .day-number { 
      font-size: 14px; 
    }
    
    .year-view .dow-row { 
      padding: 4px 2px;
      margin-bottom: 4px;
    }
    
    .year-view .dow-row span { 
      font-size: 8px; 
      padding: 2px;
    }
    
    .month-print-header {
      text-align: center;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #666;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
      text-transform: uppercase;
    }
    
    /* Arc-colored header styling */
    .month-page[data-arc="opening"] .month-print-header { 
      color: #dc2626; 
      border-bottom-color: #dc2626;
    }
    .month-page[data-arc="core"] .month-print-header { 
      color: #16a34a; 
      border-bottom-color: #16a34a;
    }
    .month-page[data-arc="closing"] .month-print-header { 
      color: #7c3aed; 
      border-bottom-color: #7c3aed;
    }
    
    .month-header { 
      margin-bottom: 16px; 
      padding: 16px 24px;
      text-align: center;
      background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
      border-radius: 8px;
      border: 1px solid #eaeaea;
    }
    
    /* Arc-colored month header borders */
    .month-page[data-arc="opening"] .month-header { 
      border: 2px solid #dc2626;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    }
    .month-page[data-arc="core"] .month-header { 
      border: 2px solid #16a34a;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }
    .month-page[data-arc="closing"] .month-header { 
      border: 2px solid #7c3aed;
      background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
    }
    
    .month-title { 
      font-family: Georgia, serif; 
      font-size: 52px; 
      font-weight: 600; 
      margin: 0 0 8px 0;
      color: #1a1a1a;
      letter-spacing: 5px;
    }
    
    .month-page[data-arc="opening"] .month-title { color: #b91c1c; }
    .month-page[data-arc="core"] .month-title { color: #15803d; }
    .month-page[data-arc="closing"] .month-title { color: #7c3aed; }
    
    .month-subtitle { 
      font-size: 12px; 
      letter-spacing: 4px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    /* Arc-specific subtitle colors */
    .month-page[data-arc="opening"] .month-subtitle { color: #dc2626; }
    .month-page[data-arc="core"] .month-subtitle { color: #16a34a; }
    .month-page[data-arc="closing"] .month-subtitle { color: #7c3aed; }
    
    /* Day of week header - premium styling */
    .dow-row { 
      display: grid; 
      grid-template-columns: repeat(7, 1fr); 
      gap: 2px; 
      margin-bottom: 8px;
      background: #f5f5f5;
      padding: 6px 0px;
      border-radius: 2px;
    }
    
    .dow-row span { 
      text-align: center; 
      font-size: 9px; 
      font-weight: 700; 
      color: #444;
      text-transform: uppercase; 
      letter-spacing: 1.5px; 
      padding: 4px 2px;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    
    .dow-row span:first-child,
    .dow-row span:last-child { color: #999; } /* Weekend styling */
    
    /* Calendar grid - rows close together, cells at proper height */
    .calendar-grid { 
      display: grid; 
      grid-template-columns: repeat(7, 1fr); 
      grid-auto-rows: 160px; /* Double height for proper content display */
      gap: 2px;
    }
    
    .day-cell { 
      background: #fff; 
      border: 1px solid #e0e0e0; 
      border-radius: 2px; 
      height: 160px; /* Double height */
      padding: 8px 10px; 
      display: flex; 
      flex-direction: column;
      font-size: 11px;
      overflow: hidden;
    }
    
    .day-cell--empty { 
      background: #f9f9f9; 
      border-color: #eaeaea; 
    }
    
    /* Day cell content - clean layout */
    .day-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start; 
      margin-bottom: 4px; 
      line-height: 1;
    }
    
    .day-number { 
      font-size: 18px; 
      font-weight: 600; 
      color: #333;
      font-family: Georgia, serif;
    }
    
    .moon-phase { 
      font-size: 14px; 
      opacity: 0.7;
    }
    
    .civil-date { 
      font-size: 9px; 
      color: #aaa; 
      margin-bottom: 4px; 
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    
    .notes-area { 
      flex: 1; 
      display: flex; 
      flex-direction: column; 
      gap: 2px;
      overflow: hidden;
    }
    
    .note-box { 
      background: #f8f8f8; 
      border-radius: 3px; 
      padding: 3px 5px; 
      font-size: 9px;
      color: #555;
      line-height: 1.2;
      border-left: 2px solid #c9a227;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .holiday { 
      margin-top: 3px; 
      padding: 3px 5px; 
      background: rgba(220, 38, 38, 0.06); 
      border-radius: 3px; 
      font-size: 8px;
      line-height: 1.2;
      color: #c41e3a; 
      font-weight: 500;
      text-align: center;
      letter-spacing: 0.3px;
    }
    
    /* Print-specific adjustments */
    @media print {
      .month-page { page-break-after: always; }
      .year-cover { page-break-after: always; }
    }
  `;
}

export function PrintPreview() {
  const dispatch = useDispatch();
  const viewDate = useSelector((state: RootState) => state.calendar.viewDate);
  const notes = useSelector((state: RootState) => state.calendar.notes);
  const location = useSelector((state: any) => state.user?.location || 'AU');
  const currentThemeId = useSelector((state: RootState) => state.calendar.theme);
  const currentFontId = useSelector((state: RootState) => state.calendar.font);
  const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
  
  const theme = THEMES[currentThemeId] || THEMES['egyptian-gold'];
  const fontTheme = FONTS[currentFontId] || FONTS['elegant'];

  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'month' | 'year'>('month');
  const [showOverlay, setShowOverlay] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [pdfFilePath, setPdfFilePath] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [options, setOptions] = useState<PrintOptions>(DEFAULT_OPTIONS);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printStatus, setPrintStatus] = useState<string>('');
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Check network status on mount
  useEffect(() => {
    const checkNetwork = async () => {
      const online = await PrintManager.isOnline();
      setIsOnline(online);
    };
    checkNetwork();
    
    // Also listen to browser online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Store pages for later PDF generation
  const pagesRef = useRef<string[]>([]);

  // Generate preview only (no file save)
  const generatePreview = useCallback(async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const { preview, pages } = generateCalendarHTML(mode, viewDate, options, notes, location, theme.colors, timeMode);
      setPreviewHtml(preview);
      pagesRef.current = pages; // Store for later download
      setPdfFilePath(null); // Clear any previous PDF
      
      setShowOverlay(true);
    } catch (error) {
      console.error('[PrintPreview] Preview generation error:', error);
      alert('Failed to generate preview. Please try again.');
    }
    setIsGenerating(false);
  }, [mode, viewDate, options, notes, location, theme, timeMode, isGenerating]);

  // Download PDF (only when user explicitly requests)
  const downloadPDF = useCallback(async () => {
    if (!pagesRef.current.length) {
      alert('Please generate preview first');
      return;
    }
    
    setIsGenerating(true);
    try {
      console.log('[PrintPreview] Generating PDF...');
      const result = await PrintManager.generatePDF(pagesRef.current, options.orientation, options.paperSize || 'A4');
      setPdfFilePath(result.filePath);
      console.log('[PrintPreview] PDF saved to:', result.filePath);
      
      // Show success toast
      const filename = result.filePath.split('/').pop();
      alert(`✓ PDF saved to Downloads\n\nFile: ${filename}\n\nSelect an app below to open your PDF.`);
      
      // Open the PDF after download
      try {
        await PrintManager.openPDF(result.filePath, `HEKA_Calendar_${new Date().getFullYear()}.pdf`);
      } catch (e: any) {
        // No PDF viewer - fall back to share
        console.log('[PrintPreview] No PDF viewer, falling back to share');
        await PrintManager.sharePDF(result.filePath, `HEKA_Calendar_${new Date().getFullYear()}.pdf`);
      }
    } catch (error) {
      console.error('[PrintPreview] PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
    setIsGenerating(false);
  }, [options.orientation, options.paperSize]);

  // Handle print (requires network) - generates PDF if needed first
  const handlePrint = useCallback(async () => {
    if (!isOnline) {
      alert('Internet connection required for printing. Please connect to WiFi or mobile data.');
      return;
    }
    
    // Show printing overlay
    setIsPrinting(true);
    
    // Generate PDF if not already done
    let filePath = pdfFilePath;
    if (!filePath) {
      if (!pagesRef.current.length) {
        setIsPrinting(false);
        alert('Please generate preview first');
        return;
      }
      
      setPrintStatus('Generating PDF...');
      try {
        console.log('[PrintPreview] Generating PDF for print...');
        const result = await PrintManager.generatePDF(pagesRef.current, options.orientation, options.paperSize || 'A4');
        setPdfFilePath(result.filePath);
        filePath = result.filePath;
        console.log('[PrintPreview] PDF generated:', result.filePath);
      } catch (error) {
        console.error('[PrintPreview] PDF generation error:', error);
        setIsPrinting(false);
        alert('Failed to generate PDF for printing. Please try again.');
        return;
      }
    }
    
    setPrintStatus('Sending to printer...');
    try {
      console.log('[PrintPreview] Printing PDF...');
      await PrintManager.printPDF(filePath, options.orientation, options.paperSize || 'A4');
      console.log('[PrintPreview] Print job sent');
    } catch (e: any) {
      console.error('[PrintPreview] Print error:', e);
      alert('Print failed: ' + (e?.message || 'Unknown error'));
    } finally {
      setIsPrinting(false);
      setPrintStatus('');
    }
  }, [pdfFilePath, isOnline, options.orientation, options.paperSize]);

  const handleClose = () => {
    if (showOverlay) {
      setShowOverlay(false);
    } else {
      dispatch(setView('year'));
    }
  };

  // Build dynamic styles based on current theme
  const themeStyles: React.CSSProperties = {
    backgroundColor: theme.colors.bg,
    fontFamily: fontTheme.fonts.body,
    ['--po-font-display' as string]: fontTheme.fonts.display,
    ['--po-font-heading' as string]: fontTheme.fonts.heading,
    ['--po-font-body' as string]: fontTheme.fonts.body,
    ['--po-accent' as string]: theme.colors.primary,
    ['--po-accent-light' as string]: theme.colors.primaryLight,
    ['--po-accent-dark' as string]: theme.colors.primaryDark,
    ['--po-accent-muted' as string]: theme.colors.primaryMuted,
    ['--po-accent-glow' as string]: theme.colors.primaryGlow,
    ['--po-bg' as string]: theme.colors.bg,
    ['--po-bg-elevated' as string]: theme.colors.bgElevated,
    ['--po-bg-card' as string]: theme.colors.bgCard,
    ['--po-text' as string]: theme.colors.text,
    ['--po-text-secondary' as string]: theme.colors.textSecondary,
    ['--po-text-muted' as string]: theme.colors.textMuted,
    ['--po-border' as string]: theme.colors.border,
    ['--po-border-hover' as string]: theme.colors.borderHover,
  };

  return (
    <div className="print-options" style={themeStyles}>
      {/* Header */}
      <div className="print-options__header" style={{ backgroundColor: theme.colors.bgElevated, borderBottomColor: theme.colors.border }}>
        <button 
          className="print-options__back" 
          onClick={handleClose}
          disabled={isPrinting}
          style={{ opacity: isPrinting ? 0.5 : 1, cursor: isPrinting ? 'not-allowed' : 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="print-options__title">Print Calendar</h1>
        <div className="print-options__spacer" />
      </div>

      {/* Main Content */}
      <div className="print-options__content">
        {/* Print Range */}
        <section className="print-options__section">
          <h3 className="print-options__section-title">Print Range</h3>
          <div className="print-options__toggle-group">
            <button 
              className={`print-options__toggle ${mode === 'month' ? 'active' : ''}`}
              onClick={() => setMode('month')}
            >
              <span className="print-options__toggle-icon">📅</span>
              <span className="print-options__toggle-label">Current Month</span>
            </button>
            <button 
              className={`print-options__toggle ${mode === 'year' ? 'active' : ''}`}
              onClick={() => setMode('year')}
            >
              <span className="print-options__toggle-icon">📆</span>
              <span className="print-options__toggle-label">Full Year</span>
            </button>
          </div>
        </section>

        {/* Paper Size */}
        <section className="print-options__section">
          <h3 className="print-options__section-title">Paper Size</h3>
          <div className="print-options__card-group">
            {PAPER_SIZES.map((paper) => (
              <button
                key={paper.value}
                className={`print-options__card ${options.paperSize === paper.value ? 'active' : ''}`}
                onClick={() => setOptions({ ...options, paperSize: paper.value as 'A4' | 'Letter' })}
              >
                <span className="print-options__card-label">{paper.label}</span>
                <span className="print-options__card-sublabel">{paper.dimensions}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Orientation */}
        <section className="print-options__section">
          <h3 className="print-options__section-title">Orientation</h3>
          <div className="print-options__toggle-group">
            <button 
              className={`print-options__toggle ${options.orientation === 'portrait' ? 'active' : ''}`}
              onClick={() => setOptions({ ...options, orientation: 'portrait' })}
            >
              <span className="print-options__toggle-icon">📄</span>
              <span className="print-options__toggle-label">Portrait</span>
            </button>
            <button 
              className={`print-options__toggle ${options.orientation === 'landscape' ? 'active' : ''}`}
              onClick={() => setOptions({ ...options, orientation: 'landscape' })}
            >
              <span className="print-options__toggle-icon">📃</span>
              <span className="print-options__toggle-label">Landscape</span>
            </button>
          </div>
        </section>

        {/* Theme Selection */}
        <section className="print-options__section">
          <h3 className="print-options__section-title">Theme</h3>
          <div className="print-options__theme-grid">
            {THEME_OPTIONS.map((theme) => (
              <button
                key={theme.value}
                className={`print-options__theme ${options.theme === theme.value ? 'active' : ''}`}
                onClick={() => setOptions({ ...options, theme: theme.value })}
              >
                <span className="print-options__theme-icon">{theme.icon}</span>
                <span className="print-options__theme-label">{theme.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Include Options */}
        <section className="print-options__section">
          <h3 className="print-options__section-title">Include</h3>
          <div className="print-options__checkbox-list">
            <label className="print-options__checkbox">
              <input 
                type="checkbox" 
                checked={options.includeNotes} 
                onChange={(e) => setOptions({ ...options, includeNotes: e.target.checked })} 
              />
              <span className="print-options__checkbox-check">✓</span>
              <span className="print-options__checkbox-label">Notes</span>
            </label>
            <label className="print-options__checkbox">
              <input 
                type="checkbox" 
                checked={options.includeMoonPhases} 
                onChange={(e) => setOptions({ ...options, includeMoonPhases: e.target.checked })} 
              />
              <span className="print-options__checkbox-check">✓</span>
              <span className="print-options__checkbox-label">Moon Phases</span>
            </label>
            <label className="print-options__checkbox">
              <input 
                type="checkbox" 
                checked={options.includeCivilDates} 
                onChange={(e) => setOptions({ ...options, includeCivilDates: e.target.checked })} 
              />
              <span className="print-options__checkbox-check">✓</span>
              <span className="print-options__checkbox-label">Civil Dates</span>
            </label>
            <label className="print-options__checkbox">
              <input 
                type="checkbox" 
                checked={options.includeHolidays} 
                onChange={(e) => setOptions({ ...options, includeHolidays: e.target.checked })} 
              />
              <span className="print-options__checkbox-check">✓</span>
              <span className="print-options__checkbox-label">Holidays</span>
            </label>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="print-options__footer">
        <button 
          className="print-options__generate" 
          onClick={generatePreview} 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="print-options__spinner" />
              Generating Preview...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Generate Print Preview
            </>
          )}
        </button>
      </div>

      {/* Preview Overlay */}
      {showOverlay && (
        <div 
          ref={overlayRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: theme.colors.bg,
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Controls Header - Optimized position */}
          <div style={{
            padding: '84px 16px 12px',
            background: `linear-gradient(180deg, ${theme.colors.bgElevated} 0%, ${theme.colors.bg} 100%)`,
            borderBottom: `1px solid ${theme.colors.border}`,
            boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '16px', 
              color: theme.colors.primary,
              fontFamily: fontTheme.fonts.display,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>📄 Output Preview</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowOverlay(false)}
                disabled={isPrinting}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: `1px solid ${isPrinting ? theme.colors.textMuted : theme.colors.border}`,
                  background: isPrinting ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.08)',
                  color: isPrinting ? theme.colors.textMuted : theme.colors.textSecondary,
                  cursor: isPrinting ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  opacity: isPrinting ? 0.6 : 1,
                }}
              >
                ✕ Close
              </button>
              <button
                onClick={downloadPDF}
                disabled={isPrinting}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: `1px solid ${isPrinting ? theme.colors.textMuted : theme.colors.primary}`,
                  background: isPrinting ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                  color: isPrinting ? theme.colors.textMuted : theme.colors.primary,
                  cursor: isPrinting ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  opacity: isPrinting ? 0.6 : 1,
                }}
              >
                {isPrinting ? '⏳ Please wait...' : '💾 Download PDF'}
              </button>
              {isOnline && (
                <button
                  onClick={handlePrint}
                  disabled={isPrinting}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isPrinting 
                      ? `linear-gradient(135deg, ${theme.colors.textMuted} 0%, ${theme.colors.textSecondary} 100%)`
                      : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
                    color: '#000',
                    cursor: isPrinting ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    opacity: isPrinting ? 0.7 : 1,
                  }}
                >
                  {isPrinting ? '⏳ Printing...' : '🖨️ Print'}
                </button>
              )}
            </div>
          </div>
          {!isOnline && (
            <div style={{
              padding: '8px 16px',
              background: 'rgba(234, 179, 8, 0.1)',
              borderBottom: '1px solid rgba(234, 179, 8, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#eab308',
            }}>
              <span>⚠️</span>
              <span>Click Download PDF to save to device</span>
            </div>
          )}

          {/* Preview Content */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '16px',
            paddingTop: '8px',
          }}>
            <iframe
              srcDoc={previewHtml}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: theme.colors.bg,
              }}
              title="Print Preview"
            />
          </div>

          {/* Printing Overlay */}
          {isPrinting && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000,
              gap: '24px',
            }}>
              {/* Animated Spinner */}
              <div style={{
                width: '64px',
                height: '64px',
                border: `4px solid ${theme.colors.primaryMuted}`,
                borderTopColor: theme.colors.primary,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }} />
              
              {/* Status Text */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: theme.colors.text,
                  letterSpacing: '1px',
                }}>
                  {printStatus || 'Preparing to print...'}
                </span>
                <span style={{
                  fontSize: '14px',
                  color: theme.colors.textSecondary,
                }}>
                  Please wait, this may take a moment
                </span>
              </div>

              {/* Progress dots */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
              }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: theme.colors.primary,
                      opacity: 0.4,
                      animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Keyframe animations */}
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default PrintPreview;
