/**
 * PREMIUM PRINT THEME SYSTEM
 * Enterprise-grade: every theme returns string[] of self-contained HTML pages.
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
import { getHolidaysForDate, NOTE_CATEGORIES } from '../types';
import { wrapPage, getPrintDimensions } from '../services/printEngine';
import i18n from '../i18n';

function getMonthName(index: number): string {
  return i18n.t(`calendar:months.${index}`, { lng: i18n.language || 'en' });
}

function getDayShortName(index: number): string {
  return i18n.t(`calendar:daysShort.${index}`, { lng: i18n.language || 'en' });
}

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

export interface MonthData {
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
      arcLabel: i18n.t('calendar:arcs.' + arc.toLowerCase(), { lng: i18n.language || 'en' }),
      days,
      startDayOffset,
    });
  }
  return { year, months };
}

// ============================================================================
// SHARED HELPERS
// ============================================================================

function getPageCss(options: PrintOptions): { width: number; height: number; inset: number; isLandscape: boolean } {
  const isLandscape = options.orientation === 'landscape';
  const dims = getPrintDimensions(options.paperSize, isLandscape);
  return { width: dims.width, height: dims.height, inset: 35, isLandscape };
}

function defaultMonthPageCss(options: PrintOptions): string {
  const { width, height, inset, isLandscape } = getPageCss(options);
  const contentWidth = width - inset * 2;
  const contentHeight = height - inset * 2;
  const padding = inset - 3;
  const cellWidth = Math.floor((contentWidth - (padding * 2) - 12) / 7);
  // Max rows needed = 6 (30 days + 6 offset = 36 cells / 7 cols = 5.14 → 6 rows)
  const headerSpace = isLandscape ? 90 : 100;
  const cellHeight = Math.max(110, Math.floor((contentHeight - headerSpace) / 6));
  const headerScale = isLandscape ? 0.9 : 1;

  return `
    .month-page {
      box-sizing: border-box !important;
      width: ${contentWidth}px !important;
      height: ${contentHeight}px !important;
      position: absolute !important;
      top: ${inset}px !important;
      left: ${inset}px !important;
      margin: 0 !important;
      padding: ${padding}px !important;
      border: none !important;
      display: flex;
      flex-direction: column;
    }
    .month-print-header {
      font-size: calc(14px * ${headerScale}) !important;
      letter-spacing: 8px !important;
      font-weight: 700 !important;
      margin-bottom: 16px !important;
      padding-bottom: 10px !important;
      border-bottom: 2px solid !important;
      text-align: center;
      font-family: 'Segoe UI', system-ui, sans-serif;
      text-transform: uppercase;
    }
    .month-header {
      margin-bottom: 12px !important;
      padding: 12px 20px !important;
      border-radius: 8px !important;
      text-align: center;
      background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
      border: 1px solid #eaeaea;
    }
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, ${cellWidth}px);
      grid-auto-rows: ${cellHeight}px;
      gap: 2px;
    }
    .day-cell { height: ${cellHeight}px; }
    .dow-row {
      display: grid;
      grid-template-columns: repeat(7, ${cellWidth}px);
      gap: 2px;
      padding: 6px 0;
      margin-bottom: 8px;
      background: #f5f5f5;
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
    .month-page[data-arc="opening"] .month-print-header { color: #dc2626 !important; border-bottom-color: #dc2626 !important; }
    .month-page[data-arc="core"] .month-print-header { color: #16a34a !important; border-bottom-color: #16a34a !important; }
    .month-page[data-arc="closing"] .month-print-header { color: #7c3aed !important; border-bottom-color: #7c3aed !important; }
    .month-page[data-arc="opening"] .month-header { border: 2px solid #dc2626 !important; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important; }
    .month-page[data-arc="core"] .month-header { border: 2px solid #16a34a !important; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important; }
    .month-page[data-arc="closing"] .month-header { border: 2px solid #7c3aed !important; background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%) !important; }
    .month-title { font-family: Georgia, serif; font-size: ${isLandscape ? 46 : 52}px; font-weight: 600; margin: 0 0 8px 0; color: #1a1a1a; letter-spacing: 5px; }
    .month-page[data-arc="opening"] .month-title { color: #b91c1c; }
    .month-page[data-arc="core"] .month-title { color: #15803d; }
    .month-page[data-arc="closing"] .month-title { color: #7c3aed; }
    .month-subtitle { font-size: 12px; letter-spacing: 4px; font-weight: 600; text-transform: uppercase; }
    .month-page[data-arc="opening"] .month-subtitle { color: #dc2626; }
    .month-page[data-arc="core"] .month-subtitle { color: #16a34a; }
    .month-page[data-arc="closing"] .month-subtitle { color: #7c3aed; }
    .day-cell { background: #fff; border: 1px solid #e0e0e0; border-radius: 2px; padding: 8px 10px; display: flex; flex-direction: column; font-size: 11px; overflow: hidden; }
    .day-cell--empty { background: #f9f9f9; border-color: #eaeaea; }
    .day-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; line-height: 1; }
    .day-number { font-size: ${isLandscape ? 20 : 18}px; font-weight: 600; color: #333; font-family: Georgia, serif; }
    .moon-phase { font-size: 14px; opacity: 0.7; }
    .civil-date { font-size: 9px; color: #aaa; margin-bottom: 4px; font-family: 'Segoe UI', system-ui, sans-serif; }
    .notes-area { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
    .note-box { background: #f8f8f8; border-radius: 3px; padding: 3px 5px; font-size: 9px; color: #555; line-height: 1.2; border-left: 2px solid #c9a227; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .holiday { margin-top: 3px; padding: 3px 5px; background: rgba(220, 38, 38, 0.06); border-radius: 3px; font-size: 8px; line-height: 1.2; color: #c41e3a; font-weight: 500; text-align: center; letter-spacing: 0.3px; }
    .dow-row span:first-child, .dow-row span:last-child { color: #999; }
  `;
}

function defaultCoverPage(year: number, timeMode: string): string {
  return `
    <div class="year-cover">
      <div class="year-cover__content">
        <div class="year-cover__header-section">
          <div class="year-cover__title-year">THE</div>
          <div class="year-cover__title-main">MODERN <span class="year-cover__title-accent">HEKA</span></div>
          <div class="year-cover__title-sub">CALENDAR</div>
          <div class="year-cover__subtitle">A Sacred 13-Month Journey Through Time</div>
        </div>
        <div class="year-cover__year-section">
          <div class="year-cover__year-ring">
            <span class="year-cover__year-label">Year</span>
            <span class="year-cover__year-number">${year}</span>
          </div>
          <div class="year-cover__year-span">
            <span class="year-cover__year-start">${getMonthName(0)} ${year}</span>
            <span class="year-cover__year-arrow">→</span>
            <span class="year-cover__year-end">${getMonthName(12)} ${year + 1}</span>
          </div>
        </div>
        <div class="year-cover__arcs-grid">
          <div class="year-cover__arc-card year-cover__arc-card--opening">
            <div class="year-cover__arc-name">OPENING</div>
            <div class="year-cover__arc-months">${getMonthName(0)}</div>
          </div>
          <div class="year-cover__arc-card year-cover__arc-card--core">
            <div class="year-cover__arc-name">CORE</div>
            <div class="year-cover__arc-months">${getMonthName(1)} – ${getMonthName(9)}</div>
          </div>
          <div class="year-cover__arc-card year-cover__arc-card--closing">
            <div class="year-cover__arc-name">CLOSING</div>
            <div class="year-cover__arc-months">${getMonthName(10)} – ${getMonthName(12)}</div>
          </div>
        </div>
        <div class="year-cover__week-grid">
          <div class="year-cover__week-day year-cover__week-day--weekend"><span class="year-cover__week-name">${getDayShortName(6)}</span></div>
          <div class="year-cover__week-day year-cover__week-day--weekend"><span class="year-cover__week-name">${getDayShortName(0)}</span></div>
          <div class="year-cover__week-day"><span class="year-cover__week-name">${getDayShortName(1)}</span></div>
          <div class="year-cover__week-day"><span class="year-cover__week-name">${getDayShortName(2)}</span></div>
          <div class="year-cover__week-day"><span class="year-cover__week-name">${getDayShortName(3)}</span></div>
          <div class="year-cover__week-day"><span class="year-cover__week-name">${getDayShortName(4)}</span></div>
          <div class="year-cover__week-day year-cover__week-day--weekend"><span class="year-cover__week-name">${getDayShortName(5)}</span></div>
        </div>
        <div class="year-cover__footer-meta">
          <span>13 Months</span><span>◆</span><span>28 Days + ${getMonthName(12)} 29/30</span><span>◆</span><span>Mode: ${timeMode}</span>
        </div>
      </div>
    </div>
  `;
}

function defaultCoverCss(isLandscape: boolean = false): string {
  return `
    .year-cover {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      background: linear-gradient(165deg, #fdfcf7 0%, #f8f4e8 30%, #f3edd8 50%, #eae3cf 70%, #e8e0c5 100%);
      padding: 30px;
    }
    .year-cover__content { width: 92%; max-width: 850px; }
    .year-cover__header-section { margin-bottom: ${isLandscape ? 16 : 25}px; }
    .year-cover__title-year { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 22px; font-weight: 400; letter-spacing: 24px; color: #8a8075; text-transform: uppercase; margin-bottom: 12px; }
    .year-cover__title-main { font-family: Georgia, serif; font-size: ${isLandscape ? 68 : 96}px; font-weight: 400; letter-spacing: ${isLandscape ? 12 : 16}px; color: #1a1816; line-height: 1.0; margin-bottom: 10px; }
    .year-cover__title-accent { color: #b8941f; font-weight: 600; }
    .year-cover__title-sub { font-family: Georgia, serif; font-size: ${isLandscape ? 52 : 78}px; font-weight: 300; letter-spacing: ${isLandscape ? 20 : 28}px; color: #3a3530; line-height: 1; }
    .year-cover__subtitle { font-family: Georgia, serif; font-size: 24px; font-style: italic; color: #7a7065; letter-spacing: 6px; margin-top: 28px; }
    .year-cover__year-section { margin-bottom: ${isLandscape ? 18 : 28}px; padding: ${isLandscape ? '14px' : '20px'} 0; border-top: 1px solid rgba(0,0,0,0.08); border-bottom: 1px solid rgba(0,0,0,0.08); }
    .year-cover__year-ring { display: flex; flex-direction: column; align-items: center; margin-bottom: 12px; }
    .year-cover__year-label { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 12px; letter-spacing: 8px; color: #9a9085; text-transform: uppercase; font-weight: 500; margin-bottom: 4px; }
    .year-cover__year-number { font-family: Georgia, serif; font-size: ${isLandscape ? 80 : 110}px; font-weight: 400; line-height: 1; color: #1a1816; letter-spacing: -4px; }
    .year-cover__year-span { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 8px; }
    .year-cover__year-start, .year-cover__year-end { font-family: Georgia, serif; font-size: 18px; color: #5a5045; letter-spacing: 2px; }
    .year-cover__year-arrow { font-size: 16px; color: #b8941f; opacity: 0.6; }
    .year-cover__arcs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: ${isLandscape ? 16 : 28}px; }
    .year-cover__arc-card { display: flex; flex-direction: column; align-items: center; padding: 24px 18px; background: rgba(255,255,255,0.7); border: 1px solid rgba(0,0,0,0.06); border-top: 4px solid transparent; }
    .year-cover__arc-card--opening { border-top-color: #a85c5c; }
    .year-cover__arc-card--core { border-top-color: #4a8a6a; }
    .year-cover__arc-card--closing { border-top-color: #6a5aa0; }
    .year-cover__arc-name { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 4px; margin-bottom: 10px; }
    .year-cover__arc-card--opening .year-cover__arc-name { color: #8a4a4a; }
    .year-cover__arc-card--core .year-cover__arc-name { color: #3a7a5a; }
    .year-cover__arc-card--closing .year-cover__arc-name { color: #5a4a8a; }
    .year-cover__arc-months { font-size: 14px; color: #5a5045; letter-spacing: 1px; font-weight: 500; margin-bottom: 5px; }
    .year-cover__week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 14px; margin-bottom: ${isLandscape ? 10 : 16}px; }
    .year-cover__week-day { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 18px 10px; background: rgba(255,255,255,0.8); border: 1px solid rgba(0,0,0,0.04); }
    .year-cover__week-day--weekend { background: rgba(184,148,31,0.08); border-color: rgba(184,148,31,0.15); }
    .year-cover__week-name { font-size: 14px; font-weight: 600; color: #4a453f; letter-spacing: 1px; }
    .year-cover__week-day--weekend .year-cover__week-name { color: #8a7020; }
    .year-cover__footer-meta { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 20px; flex-wrap: wrap; font-size: 14px; color: #7a7065; letter-spacing: 3px; text-transform: uppercase; font-weight: 500; }
  `;
}

function generateDefaultMonth(m: MonthData, options: PrintOptions): string {
  let daysHTML = '';
  for (let i = 0; i < m.startDayOffset; i++) {
    daysHTML += `<div class="day-cell day-cell--empty"><div class="day-content"></div></div>`;
  }
  for (const day of m.days) {
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
    <div class="month-page" data-arc="${m.arc.toLowerCase()}">
      <div class="month-print-header">The Modern HEKA Calendar</div>
      <div class="month-header">
        <div class="month-header-content">
          <div>
            <h2 class="month-title">${getMonthName(m.monthIndex)}</h2>
            <div class="month-subtitle">Month ${m.monthNumber} of 13 · ${m.arcLabel} Arc</div>
          </div>
        </div>
      </div>
      <div class="dow-row">
        <span>${getDayShortName(6)}</span><span>${getDayShortName(0)}</span><span>${getDayShortName(1)}</span><span>${getDayShortName(2)}</span><span>${getDayShortName(3)}</span><span>${getDayShortName(4)}</span><span>${getDayShortName(5)}</span>
      </div>
      <div class="calendar-grid">${daysHTML}</div>
    </div>
  `;
}

// ============================================================================
// THEME: DEFAULT
// ============================================================================

function generateDefault(data: YearData, options: PrintOptions, mode: 'month' | 'year', timeMode: string = 'SYNC'): string[] {
  const pages: string[] = [];
  const wrap = (html: string, title?: string) => wrapPage(html, {
    paperSize: options.paperSize,
    orientation: options.orientation,
    title,
    extraCss: defaultCoverCss(options.orientation === 'landscape') + defaultMonthPageCss(options),
    isPrintMode: true,
  });

  if (mode === 'year') {
    pages.push(wrap(defaultCoverPage(data.year, timeMode), `HEKA Calendar ${data.year}`));
    for (const m of data.months) {
      pages.push(wrap(generateDefaultMonth(m, options), getMonthName(m.monthIndex)));
    }
  } else {
    pages.push(wrap(generateDefaultMonth(data.months[0], options), getMonthName(data.months[0].monthIndex)));
  }
  return pages;
}


// ============================================================================
// THEME: MINIMALIST
// ============================================================================

function generateMinimalist(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string[] {
  const isMonthMode = mode === 'month' || data.months.length === 1;

  const generateMonth = (m: MonthData): string => {
    let daysHTML = '';
    for (let i = 0; i < m.startDayOffset; i++) {
      daysHTML += '<div class="min-day min-empty"><div class="min-empty-inner"></div></div>';
    }
    for (const day of m.days) {
      let notesHTML = '';
      if (day.notes.length > 0 && options.includeNotes) {
        for (const note of day.notes.slice(0, 3)) {
          notesHTML += `<div class="min-note">${note.content.substring(0, 18)}${note.content.length > 18 ? '..' : ''}</div>`;
        }
      }
      daysHTML += `
        <div class="min-day">
          <div class="min-day-header">
            <span class="min-day-num">${day.day}</span>
            ${day.moonPhase && options.includeMoonPhases ? `<span class="min-moon">${day.moonPhase.glyph}</span>` : ''}
          </div>
          ${options.includeCivilDates ? `<div class="min-civil">${day.civilDate.getDate()}/${day.civilDate.getMonth() + 1}</div>` : ''}
          ${notesHTML ? `<div class="min-notes">${notesHTML}</div>` : ''}
          ${day.holidays.length > 0 && options.includeHolidays ? `<div class="min-holiday">${day.holidays[0].name.substring(0, 22)}${day.holidays[0].name.length > 22 ? '..' : ''}</div>` : ''}
        </div>
      `;
    }
    return `
      <div class="min-month" data-arc="${m.arc.toLowerCase()}">
        <div class="min-header">
          <div class="min-header-top">
            <span class="min-brand">The Modern HEKA Calendar</span>
            <span class="min-arc">${m.arcLabel} Arc</span>
          </div>
          <div class="min-header-main">
            <h2 class="min-month-name">${getMonthName(m.monthIndex)}</h2>
            <span class="min-month-num">Month ${m.monthNumber} of 13</span>
          </div>
        </div>
        <div class="min-dow">
          <span>${getDayShortName(6)}</span><span>${getDayShortName(0)}</span><span>${getDayShortName(1)}</span><span>${getDayShortName(2)}</span><span>${getDayShortName(3)}</span><span>${getDayShortName(4)}</span><span>${getDayShortName(5)}</span>
        </div>
        <div class="min-grid">${daysHTML}</div>
      </div>
    `;
  };

  const extraCss = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', system-ui, sans-serif; background: #ffffff; color: #1a1a1a; line-height: 1.4; }
    .min-cover { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; background: #ffffff; }
    .min-cover-line { width: 60px; height: 1px; background: #1a1a1a; margin: 20px 0; }
    .min-cover-brand { font-size: 11px; letter-spacing: 6px; color: #666; margin-bottom: 10px; text-transform: uppercase; }
    .min-cover-year { font-size: clamp(80px, 14vmin, 160px); font-weight: 200; color: #1a1a1a; line-height: 1; margin: 15px 0; letter-spacing: -4px; }
    .min-cover-subtitle { font-size: 13px; color: #888; letter-spacing: 1px; margin: 4px 0; }
    .min-cover-arcs { margin-top: 30px; display: flex; flex-direction: column; gap: 8px; }
    .min-arc-item { font-size: 12px; color: #555; display: flex; align-items: center; gap: 8px; }
    .min-arc-dot { width: 8px; height: 8px; border-radius: 50%; }
    .min-month { height: 100%; display: flex; flex-direction: column; padding: 30px 20px; max-width: 100%; width: 100%; }
    .min-header { margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e5e5e5; }
    .min-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .min-brand { font-size: 10px; letter-spacing: 2px; color: #999; }
    .min-arc { font-size: 10px; letter-spacing: 1px; color: #666; padding: 3px 10px; border: 1px solid #e5e5e5; border-radius: 20px; }
    .min-header-main { display: flex; align-items: baseline; gap: 12px; }
    .min-month-name { font-size: clamp(28px, 4vmin, 48px); font-weight: 300; color: #1a1a1a; letter-spacing: -1px; }
    .min-month-num { font-size: clamp(11px, 1.4vmin, 14px); color: #888; }
    .min-dow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 6px; }
    .min-dow span { text-align: center; padding: 8px 2px; font-size: 10px; letter-spacing: 1px; color: #666; font-weight: 500; text-transform: uppercase; }
    .min-grid { flex: 1; display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 1fr; gap: 6px; width: 100%; max-width: 100%; }
    .min-day { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 4px; padding: 8px; display: flex; flex-direction: column; min-height: 85px; }
    .min-day.min-empty { background: #fdfdfd; border-color: #f0f0f0; }
    .min-empty-inner { width: 100%; height: 100%; border: 1px dashed #e5e5e5; border-radius: 4px; }
    .min-day-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .min-day-num { font-size: clamp(14px, 2vmin, 22px); font-weight: 500; color: #1a1a1a; }
    .min-moon { font-size: 12px; }
    .min-civil { font-size: clamp(7px, 1vmin, 11px); color: #aaa; margin: 2px 0 4px; }
    .min-notes { display: flex; flex-direction: column; gap: 2px; margin-top: 2px; }
    .min-note { font-size: clamp(7px, 0.95vmin, 11px); color: #555; background: #f5f5f5; padding: 2px 4px; border-radius: 3px; line-height: 1.2; }
    .min-holiday { font-size: clamp(7px, 0.95vmin, 11px); padding: 2px 4px; border-radius: 3px; margin-top: 2px; line-height: 1.2; color: #c41e3a; background: rgba(220,38,38,0.04); }
    .min-month[data-arc="opening"] .min-day-num { color: #dc2626; }
    .min-month[data-arc="core"] .min-day-num { color: #16a34a; }
    .min-month[data-arc="closing"] .min-day-num { color: #7c3aed; }
    .min-month { width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; }
    .min-grid { gap: 5px; width: 100%; max-width: 100%; }
    .min-dow { gap: 5px; width: 100%; max-width: 100%; }
  `;

  const pages: string[] = [];
  const wrap = (html: string, title?: string) => wrapPage(html, {
    paperSize: options.paperSize,
    orientation: options.orientation,
    title,
    extraCss,
    isPrintMode: true,
  });

  if (!isMonthMode) {
    pages.push(wrap(`
      <div class="min-cover">
        <div class="min-cover-line"></div>
        <span class="min-cover-brand">The Modern HEKA Calendar</span>
        <h1 class="min-cover-year">${data.year}</h1>
        <div class="min-cover-subtitle">${getMonthName(0)} ${data.year} - ${getMonthName(12)} ${data.year + 1}</div>
        <div class="min-cover-subtitle">13 Months · 28 Days + ${getMonthName(12)} 29/30</div>
        <div class="min-cover-arcs">
          <div class="min-arc-item"><span class="min-arc-dot" style="background:#dc2626"></span>Opening Arc · ${getMonthName(0)}</div>
          <div class="min-arc-item"><span class="min-arc-dot" style="background:#16a34a"></span>Core Arc · ${getMonthName(1)}-${getMonthName(9)}</div>
          <div class="min-arc-item"><span class="min-arc-dot" style="background:#7c3aed"></span>Closing Arc · ${getMonthName(10)}-${getMonthName(12)}</div>
        </div>
        <div class="min-cover-line"></div>
      </div>
    `, `HEKA Calendar ${data.year}`));
  }

  for (const m of data.months) {
    pages.push(wrap(generateMonth(m), getMonthName(m.monthIndex)));
  }

  return pages;
}


// ============================================================================
// THEME: SACRED GEOMETRY
// ============================================================================

function generateSacredGeometry(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string[] {
  const isMonthMode = mode === 'month' || data.months.length === 1;
  const arcColors = { OPENING: '#dc2626', CORE: '#16a34a', CLOSING: '#7c3aed' };
  const formatDate = (d: Date) => new Intl.DateTimeFormat(i18n.language || 'en', { day: 'numeric', month: 'short' }).format(d);

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
      daysHTML += `<div class="sg-cell"><div class="sg-circle" style="border-color:${color}">${cellContent}</div></div>`;
    }
    let moonHTML = '';
    if (options.includeMoonPhases && m.days.some(d => d.moonPhase)) {
      const moonDays = m.days.filter(d => d.moonPhase && [1, 14, 21, 28].includes(d.day));
      moonHTML = `<div class="sg-moons">`;
      for (const day of moonDays.slice(0, 4)) {
        if (day.moonPhase) {
          moonHTML += `<div class="sg-moon-item"><span class="sg-moon-glyph">${day.moonPhase.glyph}</span><span class="sg-moon-day">Day ${day.day}</span><span class="sg-moon-name">${day.moonPhase.phase}</span></div>`;
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
            <h2 class="sg-name" style="color:${color}">${getMonthName(m.monthIndex)}</h2>
            <div class="sg-tag" style="border-color:${color};color:${color}">${m.arcLabel.toUpperCase()} ARC — MONTH ${m.monthNumber}/13</div>
            ${civilRange ? `<div class="sg-civil-range">${civilRange}</div>` : ''}
          </div>
          <span class="sg-hex">⬡</span>
        </div>
        <div class="sg-dow">
          <span style="color:${color}">SAT</span><span style="color:${color}">SUN</span><span style="color:${color}">MON</span>
          <span style="color:${color}">TUE</span><span style="color:${color}">WED</span><span style="color:${color}">THU</span><span style="color:${color}">FRI</span>
        </div>
        <div class="sg-grid">${daysHTML}</div>
        ${moonHTML}
      </div>
    `;
  };

  const extraCss = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; background: #faf8f5; color: #1a1a1a; }
    .sg-cover { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; text-align: center; background: #0a0a0f; position: relative; }
    .sg-cover-icon { font-size: 100px; color: #c9a227; margin-bottom: 30px; }
    .sg-cover-brand { font-size: 14px; letter-spacing: 8px; color: #c9a227; margin-bottom: 20px; }
    .sg-cover-year { font-size: 140px; font-weight: 700; color: #c9a227; line-height: 1; margin: 20px 0; }
    .sg-cover-info { font-size: 13px; color: #666; letter-spacing: 3px; margin: 8px 0; }
    .sg-arcs { display: flex; justify-content: center; gap: 60px; margin-top: 60px; }
    .sg-arc-item { display: flex; align-items: center; gap: 12px; font-size: 13px; letter-spacing: 2px; }
    .sg-arc-dot { width: 16px; height: 16px; border-radius: 50%; }
    .sg-month { width: 100%; height: 100%; display: flex; flex-direction: column; background: #faf8f5; border: 1px solid #d4c9a8; border-radius: 8px; padding: 20px; }
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
    .sg-grid { flex: 1; display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 1fr; gap: 8px; }
    .sg-cell { min-height: 100px; padding: 6px; display: flex; align-items: center; justify-content: center; }
    .sg-cell.sg-empty { opacity: 0.4; }
    .sg-circle { width: clamp(60px, 11vmin, 160px); height: clamp(60px, 11vmin, 160px); border-radius: 50%; border: 2px solid; background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .sg-empty-circle { width: clamp(60px, 11vmin, 160px); height: clamp(60px, 11vmin, 160px); border-radius: 50%; border: 2px dashed #ccc; }
    .sg-daynum { font-size: clamp(16px, 2.2vmin, 28px); font-weight: 700; line-height: 1; }
    .sg-notes { margin-top: 3px; width: 100%; padding: 0 2px; }
    .sg-note { font-size: clamp(6px, 1vmin, 11px); color: #444; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sg-holiday { font-size: clamp(5px, 0.9vmin, 10px); font-weight: 600; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90%; letter-spacing: 0.2px; }
    .sg-moons { display: flex; justify-content: center; gap: 30px; padding: 15px; background: rgba(201, 162, 39, 0.08); border-radius: 10px; margin-top: 20px; border: 1px solid rgba(201, 162, 39, 0.2); }
    .sg-moon-item { display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .sg-moon-glyph { font-size: 20px; }
    .sg-moon-day { font-size: 9px; color: #666; letter-spacing: 1px; }
    .sg-moon-name { font-size: 8px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  `;

  const pages: string[] = [];
  const wrap = (html: string, title?: string) => wrapPage(html, {
    paperSize: options.paperSize,
    orientation: options.orientation,
    title,
    extraCss,
    isPrintMode: true,
  });

  if (!isMonthMode) {
    pages.push(wrap(`
      <div class="sg-cover">
        <div class="sg-cover-icon">◈</div>
        <div class="sg-cover-brand">THE MODERN HEKA CALENDAR</div>
        <h1 class="sg-cover-year">${data.year}</h1>
        <div class="sg-cover-info">${getMonthName(0).toUpperCase()} ${data.year} — ${getMonthName(12).toUpperCase()} ${data.year + 1}</div>
        <div class="sg-arcs">
          <div class="sg-arc-item"><span class="sg-arc-dot" style="background:#dc2626"></span>OPENING ARC</div>
          <div class="sg-arc-item"><span class="sg-arc-dot" style="background:#16a34a"></span>CORE ARC</div>
          <div class="sg-arc-item"><span class="sg-arc-dot" style="background:#7c3aed"></span>CLOSING ARC</div>
        </div>
      </div>
    `, `HEKA Calendar ${data.year}`));
  }

  for (const m of data.months) {
    pages.push(wrap(generateMonth(m), getMonthName(m.monthIndex)));
  }

  return pages;
}


// ============================================================================
// THEME: CYBERPUNK
// ============================================================================

function generateCyberpunk(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string[] {
  const isMonthMode = mode === 'month' || data.months.length === 1;

  const generateMonth = (m: MonthData): string => {
    let daysHTML = '';
    for (let i = 0; i < m.startDayOffset; i++) {
      daysHTML += '<div class="cb-day cb-empty"><div class="cb-empty-inner"></div></div>';
    }
    for (const day of m.days) {
      let notesHTML = '';
      if (day.notes.length > 0 && options.includeNotes) {
        for (const note of day.notes.slice(0, 3)) {
          notesHTML += `<div class="cb-note">${note.content.substring(0, 18)}${note.content.length > 18 ? '..' : ''}</div>`;
        }
      }
      daysHTML += `
        <div class="cb-day">
          <div class="cb-day-header">
            <span class="cb-day-num">${day.day}</span>
            ${day.moonPhase && options.includeMoonPhases ? `<span class="cb-moon">${day.moonPhase.glyph}</span>` : ''}
          </div>
          ${options.includeCivilDates ? `<div class="cb-civil">${day.civilDate.getDate()}/${day.civilDate.getMonth() + 1}</div>` : ''}
          ${notesHTML ? `<div class="cb-notes">${notesHTML}</div>` : ''}
          ${day.holidays.length > 0 && options.includeHolidays ? `<div class="cb-holiday">${day.holidays[0].name.substring(0, 22)}${day.holidays[0].name.length > 22 ? '..' : ''}</div>` : ''}
        </div>
      `;
    }
    return `
      <div class="cb-month" data-arc="${m.arc.toLowerCase()}">
        <div class="cb-header">
          <div class="cb-header-top">
            <span class="cb-brand">◈ HEKA CALENDAR ◈</span>
            <span class="cb-arc">${m.arcLabel.toUpperCase()} ARC</span>
          </div>
          <div class="cb-header-main">
            <h2 class="cb-month-name">${getMonthName(m.monthIndex)}</h2>
            <span class="cb-month-num">MONTH ${m.monthNumber}/13</span>
          </div>
        </div>
        <div class="cb-dow">
          <span>SAT</span><span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span>
        </div>
        <div class="cb-grid">${daysHTML}</div>
      </div>
    `;
  };

  const extraCss = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Rajdhani:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Rajdhani', system-ui, sans-serif; background: #050508; color: #e0e0ff; line-height: 1.4; }
    .cb-cover { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; background: #050508; position: relative; overflow: hidden; }
    .cb-cover::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px); pointer-events: none; }
    .cb-cover-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(255,0,255,0.15) 0%, transparent 60%); pointer-events: none; }
    .cb-cover-icon { font-size: 80px; margin-bottom: 20px; color: #ff00ff; text-shadow: 0 0 30px #ff00ff; position: relative; z-index: 1; }
    .cb-cover-brand { font-family: 'Orbitron', sans-serif; font-size: 12px; letter-spacing: 6px; color: #00ffff; text-shadow: 0 0 10px #00ffff; margin-bottom: 20px; position: relative; z-index: 1; }
    .cb-cover-year { font-family: 'Orbitron', sans-serif; font-size: clamp(70px, 11vmin, 140px); font-weight: 700; color: #ff00ff; text-shadow: 0 0 40px #ff00ff; line-height: 1; margin: 15px 0; position: relative; z-index: 1; }
    .cb-cover-sub { font-size: 14px; color: #8888cc; letter-spacing: 3px; margin: 6px 0; position: relative; z-index: 1; }
    .cb-cover-arcs { margin-top: 40px; display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1; }
    .cb-arc-item { font-size: 13px; color: #a0a0dd; display: flex; align-items: center; gap: 10px; letter-spacing: 1px; }
    .cb-arc-dot { width: 10px; height: 10px; border-radius: 2px; box-shadow: 0 0 8px currentColor; }
    .cb-month { height: 100%; display: flex; flex-direction: column; padding: 30px 20px; max-width: 100%; width: 100%; background: #0a0a0f; }
    .cb-header { margin-bottom: 20px; padding: 16px; border: 1px solid #ff00ff; box-shadow: 0 0 12px rgba(255,0,255,0.15); background: rgba(255,0,255,0.03); }
    .cb-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .cb-brand { font-family: 'Orbitron', sans-serif; font-size: 9px; letter-spacing: 2px; color: #00ffff; }
    .cb-arc { font-family: 'Orbitron', sans-serif; font-size: 10px; letter-spacing: 1px; color: #ff00ff; padding: 3px 10px; border: 1px solid #ff00ff; border-radius: 2px; box-shadow: 0 0 8px rgba(255,0,255,0.2); }
    .cb-header-main { display: flex; align-items: baseline; gap: 15px; }
    .cb-month-name { font-family: 'Orbitron', sans-serif; font-size: clamp(24px, 3.5vmin, 44px); font-weight: 600; letter-spacing: 2px; color: #00ffff; text-shadow: 0 0 12px rgba(0,255,255,0.3); }
    .cb-month-num { font-size: clamp(11px, 1.4vmin, 14px); color: #8888cc; letter-spacing: 1px; }
    .cb-dow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 6px; }
    .cb-dow span { text-align: center; padding: 8px 2px; font-family: 'Orbitron', sans-serif; font-size: 9px; letter-spacing: 1px; color: #00ffff; background: rgba(0,255,255,0.06); border: 1px solid rgba(0,255,255,0.15); }
    .cb-grid { flex: 1; display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 1fr; gap: 6px; width: 100%; max-width: 100%; }
    .cb-day { background: rgba(10,10,15,0.8); border: 1px solid rgba(0,255,255,0.2); padding: 8px; display: flex; flex-direction: column; min-height: 85px; }
    .cb-day.cb-empty { background: rgba(5,5,8,0.5); border-color: rgba(255,0,255,0.1); }
    .cb-empty-inner { width: 100%; height: 100%; border: 1px dashed rgba(255,0,255,0.15); }
    .cb-day-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .cb-day-num { font-family: 'Orbitron', sans-serif; font-size: clamp(14px, 2vmin, 22px); font-weight: 600; color: #e0e0ff; }
    .cb-moon { font-size: clamp(10px, 1.4vmin, 16px); }
    .cb-civil { font-size: clamp(7px, 1vmin, 11px); color: #8888cc; margin: 2px 0 4px; }
    .cb-notes { display: flex; flex-direction: column; gap: 2px; margin-top: 2px; }
    .cb-note { font-size: clamp(7px, 0.95vmin, 11px); color: #cc88cc; background: rgba(255,0,255,0.08); padding: 2px 4px; border-radius: 2px; border-left: 2px solid #ff00ff; line-height: 1.2; }
    .cb-holiday { font-size: clamp(7px, 0.95vmin, 11px); padding: 2px 4px; border-radius: 2px; margin-top: 2px; line-height: 1.2; color: #00ffff; background: rgba(0,255,255,0.08); border: 1px solid rgba(0,255,255,0.2); }
    .cb-month[data-arc="opening"] .cb-header { border-color: #ff0055; box-shadow: 0 0 12px rgba(255,0,85,0.2); }
    .cb-month[data-arc="opening"] .cb-day-num { color: #ff0055; text-shadow: 0 0 8px rgba(255,0,85,0.4); }
    .cb-month[data-arc="core"] .cb-header { border-color: #00ffaa; box-shadow: 0 0 12px rgba(0,255,170,0.15); }
    .cb-month[data-arc="core"] .cb-day-num { color: #00ffaa; text-shadow: 0 0 8px rgba(0,255,170,0.3); }
    .cb-month[data-arc="closing"] .cb-header { border-color: #aa00ff; box-shadow: 0 0 12px rgba(170,0,255,0.2); }
    .cb-month[data-arc="closing"] .cb-day-num { color: #aa00ff; text-shadow: 0 0 8px rgba(170,0,255,0.4); }
    .cb-month { width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; }
    .cb-grid { gap: 5px; width: 100%; max-width: 100%; }
    .cb-dow { gap: 5px; width: 100%; max-width: 100%; }
  `;

  const pages: string[] = [];
  const wrap = (html: string, title?: string) => wrapPage(html, {
    paperSize: options.paperSize,
    orientation: options.orientation,
    title,
    extraCss,
    isPrintMode: true,
  });

  if (!isMonthMode) {
    pages.push(wrap(`
      <div class="cb-cover">
        <div class="cb-cover-glow"></div>
        <div class="cb-cover-icon">⚡</div>
        <div class="cb-cover-brand">◈ THE MODERN HEKA CALENDAR ◈</div>
        <h1 class="cb-cover-year">${data.year}</h1>
        <div class="cb-cover-sub">${getMonthName(0).toUpperCase()} ${data.year} — ${getMonthName(12).toUpperCase()} ${data.year + 1}</div>
        <div class="cb-cover-sub">13 MONTHS · 28 DAYS · CYBERPUNK EDITION</div>
        <div class="cb-cover-arcs">
          <div class="cb-arc-item"><span class="cb-arc-dot" style="background:#ff0055;box-shadow:0 0 8px #ff0055"></span>OPENING ARC · APRIL</div>
          <div class="cb-arc-item"><span class="cb-arc-dot" style="background:#00ffaa;box-shadow:0 0 8px #00ffaa"></span>CORE ARC · MAY-DEC</div>
          <div class="cb-arc-item"><span class="cb-arc-dot" style="background:#aa00ff;box-shadow:0 0 8px #aa00ff"></span>CLOSING ARC · JAN-MARCH</div>
        </div>
      </div>
    `, `HEKA Calendar ${data.year}`));
  }

  for (const m of data.months) {
    pages.push(wrap(generateMonth(m), getMonthName(m.monthIndex)));
  }

  return pages;
}


// ============================================================================
// THEME: NATURE ORGANIC
// ============================================================================

function generateNatureOrganic(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string[] {
  const isMonthMode = mode === 'month' || data.months.length === 1;

  const generateMonth = (m: MonthData): string => {
    let daysHTML = '';
    for (let i = 0; i < m.startDayOffset; i++) {
      daysHTML += '<div class="nt-day nt-empty"><div class="nt-empty-leaf"></div></div>';
    }
    for (const day of m.days) {
      let notesHTML = '';
      if (day.notes.length > 0 && options.includeNotes) {
        for (const note of day.notes.slice(0, 3)) {
          notesHTML += `<div class="nt-note">${note.content.substring(0, 18)}${note.content.length > 18 ? '..' : ''}</div>`;
        }
      }
      daysHTML += `
        <div class="nt-day">
          <div class="nt-day-header">
            <span class="nt-day-num">${day.day}</span>
            ${day.moonPhase && options.includeMoonPhases ? `<span class="nt-moon">${day.moonPhase.glyph}</span>` : ''}
          </div>
          ${options.includeCivilDates ? `<div class="nt-civil">${day.civilDate.getDate()}/${day.civilDate.getMonth() + 1}</div>` : ''}
          ${notesHTML ? `<div class="nt-notes">${notesHTML}</div>` : ''}
          ${day.holidays.length > 0 && options.includeHolidays ? `<div class="nt-holiday">${day.holidays[0].name.substring(0, 22)}${day.holidays[0].name.length > 22 ? '..' : ''}</div>` : ''}
        </div>
      `;
    }
    return `
      <div class="nt-month" data-arc="${m.arc.toLowerCase()}">
        <div class="nt-header">
          <div class="nt-header-top">
            <span class="nt-brand">🌿 The Modern HEKA Calendar</span>
            <span class="nt-arc">${m.arcLabel} Arc</span>
          </div>
          <div class="nt-header-main">
            <h2 class="nt-month-name">${getMonthName(m.monthIndex)}</h2>
            <span class="nt-month-num">Month ${m.monthNumber} of 13</span>
          </div>
        </div>
        <div class="nt-dow">
          <span>${getDayShortName(6)}</span><span>${getDayShortName(0)}</span><span>${getDayShortName(1)}</span><span>${getDayShortName(2)}</span><span>${getDayShortName(3)}</span><span>${getDayShortName(4)}</span><span>${getDayShortName(5)}</span>
        </div>
        <div class="nt-grid">${daysHTML}</div>
      </div>
    `;
  };

  const extraCss = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Quicksand:wght@300;400;500;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Quicksand', system-ui, sans-serif; background: #f8f9f4; color: #2c3e2c; line-height: 1.4; }
    .nt-cover { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; background: linear-gradient(165deg, #f8f9f4 0%, #e8f0e0 40%, #ddecd5 100%); position: relative; overflow: hidden; }
    .nt-cover::before { content: ''; position: absolute; top: -50%; right: -20%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(124,179,66,0.12) 0%, transparent 60%); pointer-events: none; }
    .nt-cover::after { content: ''; position: absolute; bottom: -30%; left: -10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(85,139,47,0.08) 0%, transparent 60%); pointer-events: none; }
    .nt-cover-icon { font-size: 90px; margin-bottom: 20px; position: relative; z-index: 1; }
    .nt-cover-brand { font-family: 'Cormorant Garamond', serif; font-size: 14px; letter-spacing: 5px; color: #558b2f; margin-bottom: 15px; position: relative; z-index: 1; }
    .nt-cover-year { font-family: 'Cormorant Garamond', serif; font-size: clamp(80px, 13vmin, 150px); font-weight: 600; color: #33691e; line-height: 1; margin: 10px 0; position: relative; z-index: 1; }
    .nt-cover-sub { font-size: 14px; color: #689f38; letter-spacing: 2px; margin: 6px 0; position: relative; z-index: 1; }
    .nt-cover-arcs { margin-top: 40px; display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }
    .nt-arc-item { font-size: 14px; color: #558b2f; display: flex; align-items: center; gap: 10px; }
    .nt-arc-dot { width: 10px; height: 10px; border-radius: 50%; }
    .nt-month { height: 100%; display: flex; flex-direction: column; padding: 30px 20px; max-width: 100%; width: 100%; background: #f8f9f4; }
    .nt-header { margin-bottom: 20px; padding: 16px 20px; background: #ffffff; border-radius: 16px; box-shadow: 0 2px 12px rgba(124,179,66,0.1); border: 1px solid #e8f5e9; }
    .nt-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .nt-brand { font-size: 11px; letter-spacing: 2px; color: #7cb342; font-weight: 500; }
    .nt-arc { font-size: 11px; letter-spacing: 1px; color: #558b2f; padding: 4px 12px; background: #e8f5e9; border-radius: 20px; font-weight: 500; }
    .nt-header-main { display: flex; align-items: baseline; gap: 15px; }
    .nt-month-name { font-family: 'Cormorant Garamond', serif; font-size: clamp(30px, 4vmin, 52px); font-weight: 600; color: #33691e; }
    .nt-month-num { font-size: clamp(11px, 1.4vmin, 15px); color: #7cb342; font-weight: 500; }
    .nt-dow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 6px; }
    .nt-dow span { text-align: center; padding: 8px 2px; font-size: 10px; letter-spacing: 1px; color: #558b2f; font-weight: 600; text-transform: uppercase; background: #e8f5e9; border-radius: 8px; }
    .nt-grid { flex: 1; display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 1fr; gap: 6px; width: 100%; max-width: 100%; }
    .nt-day { background: #ffffff; border: 1px solid #dcedc8; border-radius: 10px; padding: 8px; display: flex; flex-direction: column; min-height: 85px; box-shadow: 0 1px 3px rgba(124,179,66,0.06); }
    .nt-day.nt-empty { background: rgba(255,255,255,0.5); border-color: #e8f5e9; }
    .nt-empty-leaf { width: 100%; height: 100%; border: 1px dashed #c5e1a5; border-radius: 10px; }
    .nt-day-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .nt-day-num { font-family: 'Cormorant Garamond', serif; font-size: clamp(15px, 2vmin, 24px); font-weight: 600; color: #33691e; }
    .nt-moon { font-size: clamp(10px, 1.4vmin, 16px); }
    .nt-civil { font-size: clamp(7px, 1vmin, 11px); color: #8bc34a; margin: 2px 0 4px; }
    .nt-notes { display: flex; flex-direction: column; gap: 2px; margin-top: 2px; }
    .nt-note { font-size: clamp(7px, 0.95vmin, 11px); color: #558b2f; background: #f1f8e9; padding: 2px 4px; border-radius: 4px; border-left: 2px solid #7cb342; line-height: 1.2; }
    .nt-holiday { font-size: clamp(7px, 0.95vmin, 11px); padding: 2px 4px; border-radius: 4px; margin-top: 2px; line-height: 1.2; color: #33691e; background: #e8f5e9; border: 1px solid #c5e1a5; }
    .nt-month[data-arc="opening"] .nt-header { border-color: #ff8a80; box-shadow: 0 2px 12px rgba(255,138,128,0.1); }
    .nt-month[data-arc="opening"] .nt-day-num { color: #d32f2f; }
    .nt-month[data-arc="core"] .nt-header { border-color: #a5d6a7; box-shadow: 0 2px 12px rgba(165,214,167,0.15); }
    .nt-month[data-arc="core"] .nt-day-num { color: #388e3c; }
    .nt-month[data-arc="closing"] .nt-header { border-color: #ce93d8; box-shadow: 0 2px 12px rgba(206,147,216,0.1); }
    .nt-month[data-arc="closing"] .nt-day-num { color: #7b1fa2; }
    .nt-month { width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; }
    .nt-grid { gap: 5px; width: 100%; max-width: 100%; }
    .nt-dow { gap: 5px; width: 100%; max-width: 100%; }
  `;

  const pages: string[] = [];
  const wrap = (html: string, title?: string) => wrapPage(html, {
    paperSize: options.paperSize,
    orientation: options.orientation,
    title,
    extraCss,
    isPrintMode: true,
  });

  if (!isMonthMode) {
    pages.push(wrap(`
      <div class="nt-cover">
        <div class="nt-cover-icon">🌿</div>
        <div class="nt-cover-brand">THE MODERN HEKA CALENDAR</div>
        <h1 class="nt-cover-year">${data.year}</h1>
        <div class="nt-cover-sub">${getMonthName(0)} ${data.year} — ${getMonthName(12)} ${data.year + 1}</div>
        <div class="nt-cover-sub">13 Months · 28 Days + ${getMonthName(12)} 29/30 · Nature Edition</div>
        <div class="nt-cover-arcs">
          <div class="nt-arc-item"><span class="nt-arc-dot" style="background:#d32f2f"></span>Opening Arc · ${getMonthName(0)}</div>
          <div class="nt-arc-item"><span class="nt-arc-dot" style="background:#388e3c"></span>Core Arc · ${getMonthName(1)}-${getMonthName(9)}</div>
          <div class="nt-arc-item"><span class="nt-arc-dot" style="background:#7b1fa2"></span>Closing Arc · ${getMonthName(10)}-${getMonthName(12)}</div>
        </div>
      </div>
    `, `HEKA Calendar ${data.year}`));
  }

  for (const m of data.months) {
    pages.push(wrap(generateMonth(m), getMonthName(m.monthIndex)));
  }

  return pages;
}


// ============================================================================
// THEME: ANCIENT EGYPT
// ============================================================================

function generateAncientEgypt(data: YearData, options: PrintOptions, mode: 'month' | 'year' = 'year'): string[] {
  const isMonthMode = mode === 'month' || data.months.length === 1;

  const generateMonth = (m: MonthData): string => {
    let daysHTML = '';
    for (let i = 0; i < m.startDayOffset; i++) {
      daysHTML += '<div class="ae-day ae-empty"><div class="ae-empty-papyrus"></div></div>';
    }
    for (const day of m.days) {
      let notesHTML = '';
      if (day.notes.length > 0 && options.includeNotes) {
        for (const note of day.notes.slice(0, 3)) {
          notesHTML += `<div class="ae-note">${note.content.substring(0, 18)}${note.content.length > 18 ? '..' : ''}</div>`;
        }
      }
      daysHTML += `
        <div class="ae-day">
          <div class="ae-day-header">
            <span class="ae-day-num">${day.day}</span>
            ${day.moonPhase && options.includeMoonPhases ? `<span class="ae-moon">${day.moonPhase.glyph}</span>` : ''}
          </div>
          ${options.includeCivilDates ? `<div class="ae-civil">${day.civilDate.getDate()}/${day.civilDate.getMonth() + 1}</div>` : ''}
          ${notesHTML ? `<div class="ae-notes">${notesHTML}</div>` : ''}
          ${day.holidays.length > 0 && options.includeHolidays ? `<div class="ae-holiday">${day.holidays[0].name.substring(0, 22)}${day.holidays[0].name.length > 22 ? '..' : ''}</div>` : ''}
        </div>
      `;
    }
    return `
      <div class="ae-month" data-arc="${m.arc.toLowerCase()}">
        <div class="ae-header">
          <div class="ae-header-top">
            <span class="ae-brand">𓂀 THE MODERN HEKA CALENDAR</span>
            <span class="ae-arc">${m.arcLabel.toUpperCase()} ARC</span>
          </div>
          <div class="ae-header-main">
            <h2 class="ae-month-name">${getMonthName(m.monthIndex)}</h2>
            <span class="ae-month-num">MONTH ${m.monthNumber} / 13</span>
          </div>
        </div>
        <div class="ae-dow">
          <span>SAT</span><span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span>
        </div>
        <div class="ae-grid">${daysHTML}</div>
      </div>
    `;
  };

  const extraCss = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400;700&family=Sorts+Mill+Goudy:ital@0;1&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Sorts Mill Goudy', Georgia, serif; background: #f5e6c8; color: #1a2332; line-height: 1.4; }
    .ae-cover { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; background: linear-gradient(165deg, #f5e6c8 0%, #ebd5a8 40%, #e0c48a 100%); position: relative; overflow: hidden; }
    .ae-cover::before { content: ''; position: absolute; inset: 20px; border: 3px double #b8941f; pointer-events: none; }
    .ae-cover::after { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 300px; height: 300px; background: radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 60%); pointer-events: none; }
    .ae-cover-icon { font-size: 90px; margin-bottom: 20px; color: #1a3a5c; position: relative; z-index: 1; text-shadow: 1px 1px 0 #d4af37; }
    .ae-cover-brand { font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 6px; color: #b8941f; margin-bottom: 20px; position: relative; z-index: 1; }
    .ae-cover-year { font-family: 'Cinzel Decorative', serif; font-size: clamp(80px, 13vmin, 150px); font-weight: 400; color: #1a3a5c; line-height: 1; margin: 15px 0; position: relative; z-index: 1; text-shadow: 2px 2px 0 rgba(212,175,55,0.3); }
    .ae-cover-sub { font-size: 14px; color: #5a4a3a; letter-spacing: 2px; margin: 6px 0; position: relative; z-index: 1; font-style: italic; }
    .ae-cover-arcs { margin-top: 40px; display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }
    .ae-arc-item { font-size: 14px; color: #3a3020; display: flex; align-items: center; gap: 10px; letter-spacing: 1px; }
    .ae-arc-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid #d4af37; }
    .ae-month { height: 100%; display: flex; flex-direction: column; padding: 30px 20px; max-width: 100%; width: 100%; background: #f5e6c8; }
    .ae-header { margin-bottom: 20px; padding: 16px 20px; background: linear-gradient(135deg, #fdf5e6 0%, #f5e6c8 100%); border: 3px double #d4af37; box-shadow: 0 2px 12px rgba(184,148,31,0.15); position: relative; }
    .ae-header::before { content: '◈'; position: absolute; top: 8px; left: 12px; font-size: 10px; color: #b8941f; }
    .ae-header::after { content: '◈'; position: absolute; top: 8px; right: 12px; font-size: 10px; color: #b8941f; }
    .ae-header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .ae-brand { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 2px; color: #b8941f; }
    .ae-arc { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 1px; color: #1a3a5c; padding: 3px 10px; border: 1px solid #d4af37; background: rgba(212,175,55,0.1); }
    .ae-header-main { display: flex; align-items: baseline; gap: 15px; }
    .ae-month-name { font-family: 'Cinzel Decorative', serif; font-size: clamp(30px, 4vmin, 52px); font-weight: 400; color: #1a3a5c; letter-spacing: 1px; }
    .ae-month-num { font-size: clamp(11px, 1.4vmin, 15px); color: #b8941f; letter-spacing: 1px; font-style: italic; }
    .ae-dow { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; margin-bottom: 6px; }
    .ae-dow span { text-align: center; padding: 8px 2px; font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 1px; color: #1a3a5c; font-weight: 600; background: rgba(212,175,55,0.15); border: 1px solid #d4af37; }
    .ae-grid { flex: 1; display: grid; grid-template-columns: repeat(7, 1fr); grid-auto-rows: 1fr; gap: 6px; width: 100%; max-width: 100%; }
    .ae-day { background: #fdf5e6; border: 1px solid #d4c9a8; padding: 8px; display: flex; flex-direction: column; min-height: 85px; box-shadow: inset 0 0 0 1px #f5e6c8; }
    .ae-day.ae-empty { background: rgba(253,245,230,0.5); border-color: #e0c48a; }
    .ae-empty-papyrus { width: 100%; height: 100%; border: 1px dashed #d4c9a8; background: rgba(245,230,200,0.2); }
    .ae-day-header { display: flex; justify-content: space-between; align-items: flex-start; }
    .ae-day-num { font-family: 'Cinzel', serif; font-size: clamp(15px, 2vmin, 24px); font-weight: 600; color: #1a3a5c; }
    .ae-moon { font-size: clamp(10px, 1.4vmin, 16px); }
    .ae-civil { font-size: clamp(7px, 1vmin, 11px); color: #b8941f; margin: 2px 0 4px; font-style: italic; }
    .ae-notes { display: flex; flex-direction: column; gap: 2px; margin-top: 2px; }
    .ae-note { font-size: clamp(7px, 0.95vmin, 11px); color: #3a3020; background: rgba(212,175,55,0.1); padding: 2px 4px; border-radius: 2px; border-left: 2px solid #d4af37; line-height: 1.2; }
    .ae-holiday { font-size: clamp(7px, 0.95vmin, 11px); padding: 2px 4px; border-radius: 2px; margin-top: 2px; line-height: 1.2; color: #1a3a5c; background: rgba(212,175,55,0.15); border: 1px solid #d4af37; }
    .ae-month[data-arc="opening"] .ae-header { border-color: #c62828; }
    .ae-month[data-arc="opening"] .ae-day-num { color: #c62828; }
    .ae-month[data-arc="core"] .ae-header { border-color: #2e7d32; }
    .ae-month[data-arc="core"] .ae-day-num { color: #2e7d32; }
    .ae-month[data-arc="closing"] .ae-header { border-color: #6a1b9a; }
    .ae-month[data-arc="closing"] .ae-day-num { color: #6a1b9a; }
    .ae-month { width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; }
    .ae-grid { gap: 5px; width: 100%; max-width: 100%; }
    .ae-dow { gap: 5px; width: 100%; max-width: 100%; }
  `;

  const pages: string[] = [];
  const wrap = (html: string, title?: string) => wrapPage(html, {
    paperSize: options.paperSize,
    orientation: options.orientation,
    title,
    extraCss,
    isPrintMode: true,
  });

  if (!isMonthMode) {
    pages.push(wrap(`
      <div class="ae-cover">
        <div class="ae-cover-icon">𓂀</div>
        <div class="ae-cover-brand">THE MODERN HEKA CALENDAR</div>
        <h1 class="ae-cover-year">${data.year}</h1>
        <div class="ae-cover-sub">${getMonthName(0)} ${data.year} — ${getMonthName(12)} ${data.year + 1}</div>
        <div class="ae-cover-sub">13 Months · 28 Days + ${getMonthName(12)} 29/30 · Egyptian Edition</div>
        <div class="ae-cover-arcs">
          <div class="ae-arc-item"><span class="ae-arc-dot" style="background:#c62828;border-color:#c62828"></span>Opening Arc · ${getMonthName(0)}</div>
          <div class="ae-arc-item"><span class="ae-arc-dot" style="background:#2e7d32;border-color:#2e7d32"></span>Core Arc · ${getMonthName(1)}-${getMonthName(9)}</div>
          <div class="ae-arc-item"><span class="ae-arc-dot" style="background:#6a1b9a;border-color:#6a1b9a"></span>Closing Arc · ${getMonthName(10)}-${getMonthName(12)}</div>
        </div>
      </div>
    `, `HEKA Calendar ${data.year}`));
  }

  for (const m of data.months) {
    pages.push(wrap(generateMonth(m), getMonthName(m.monthIndex)));
  }

  return pages;
}


// ============================================================================
// THEME ROUTER
// ============================================================================

export function generateThemeHTML(
  theme: string,
  data: YearData,
  options: PrintOptions,
  mode: 'month' | 'year' = 'year',
  timeMode: string = 'SYNC'
): string[] {
  switch (theme) {
    case 'default':
      return generateDefault(data, options, mode, timeMode);
    case 'minimalist':
      return generateMinimalist(data, options, mode);
    case 'sacred-geometry':
      return generateSacredGeometry(data, options, mode);
    case 'cyberpunk':
      return generateCyberpunk(data, options, mode);
    case 'nature-organic':
      return generateNatureOrganic(data, options, mode);
    case 'ancient-egypt':
      return generateAncientEgypt(data, options, mode);
    default:
      return generateDefault(data, options, mode, timeMode);
  }
}
