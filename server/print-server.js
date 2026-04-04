/**
 * Print Server - Server-side PDF Generation
 * Professional print quality with Puppeteer
 */

import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure temp directory exists
const TEMP_DIR = join(__dirname, 'temp');
await mkdir(TEMP_DIR, { recursive: true });

// Active jobs storage
const jobs = new Map();

// ============================================================================
// Calendar Constants (must match client-side)
// ============================================================================

const MONTHS = [
  { name: 'April', index: 0, arc: 'opening' },
  { name: 'May', index: 1, arc: 'core' },
  { name: 'June', index: 2, arc: 'core' },
  { name: 'July', index: 3, arc: 'core' },
  { name: 'August', index: 4, arc: 'core' },
  { name: 'Hexa', index: 5, arc: 'core' },
  { name: 'September', index: 6, arc: 'core' },
  { name: 'October', index: 7, arc: 'core' },
  { name: 'November', index: 8, arc: 'core' },
  { name: 'December', index: 9, arc: 'core' },
  { name: 'January', index: 10, arc: 'closing' },
  { name: 'February', index: 11, arc: 'closing' },
  { name: 'March', index: 12, arc: 'closing' },
];

// ============================================================================
// Time Mode Calculations
// ============================================================================

let currentTimeMode = 'SYNC';

function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function isTrueModeMarchCorrection(hekaYear) {
  // TRUE Mode: March correction every 4 years EXCEPT 128th
  const yearIndex = hekaYear >= 0 ? hekaYear : hekaYear + 1;
  const isFourthYear = (yearIndex % 4) === 3;
  const is128thYear = (yearIndex % 128) === 127;
  return isFourthYear && !is128thYear;
}

function isSyncModeMarchCorrection(hekaYear) {
  // SYNC Mode: Align with Gregorian
  return isGregorianLeapYear(hekaYear + 1);
}

function isHekaLeapMarch(hekaYear) {
  if (currentTimeMode === 'TRUE') {
    return isTrueModeMarchCorrection(hekaYear);
  }
  return isSyncModeMarchCorrection(hekaYear);
}

function getMarchLength(hekaYear) {
  return isHekaLeapMarch(hekaYear) ? 30 : 29;
}

function getDaysInMonth(hekaYear, monthIndex) {
  if (monthIndex === 12) return getMarchLength(hekaYear);
  return 28;
}

function getTrueModeYearStart(hekaYear) {
  const BASE_HEKA_YEAR = 2026;
  const BASE_GREGORIAN_YEAR = 2026;
  
  let daysOffset = 0;
  
  if (hekaYear >= BASE_HEKA_YEAR) {
    for (let y = BASE_HEKA_YEAR; y < hekaYear; y++) {
      daysOffset += isHekaLeapMarch(y) ? 366 : 365;
    }
  } else {
    for (let y = hekaYear; y < BASE_HEKA_YEAR; y++) {
      daysOffset -= isHekaLeapMarch(y) ? 366 : 365;
    }
  }
  
  const baseDate = new Date(BASE_GREGORIAN_YEAR, 3, 1);
  return new Date(baseDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
}

function getSyncModeYearStart(hekaYear) {
  return new Date(hekaYear, 3, 1);
}

function getHekaYearStart(hekaYear) {
  if (currentTimeMode === 'TRUE') {
    return getTrueModeYearStart(hekaYear);
  }
  return getSyncModeYearStart(hekaYear);
}

function getCivilStartOfHekaMonth(hekaYear, monthIndex) {
  const yearStart = getHekaYearStart(hekaYear);
  let daysToAdd = 0;
  for (let i = 0; i < monthIndex; i++) {
    daysToAdd += getDaysInMonth(hekaYear, i);
  }
  const result = new Date(yearStart);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

function hekaToCivil(hekaYear, monthIndex, day) {
  const monthStart = getCivilStartOfHekaMonth(hekaYear, monthIndex);
  const result = new Date(monthStart);
  result.setDate(result.getDate() + day - 1);
  return result;
}

function getSaturdayStartOffset(hekaYear, monthIndex) {
  const firstDay = getCivilStartOfHekaMonth(hekaYear, monthIndex);
  return (firstDay.getDay() + 1) % 7;
}

// Moon phase calculation
function calculateMoonPhase(civilDate) {
  const synodicMonth = 29.53059;
  const knownNewMoon = new Date('2000-01-06T00:00:00Z');
  const daysSinceKnown = (civilDate.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const moonAge = daysSinceKnown % synodicMonth;
  const normalizedAge = moonAge < 0 ? moonAge + synodicMonth : moonAge;
  
  if (normalizedAge < 1 || normalizedAge > 28.5) return '🌑';
  if (normalizedAge < 6) return '🌒';
  if (normalizedAge < 9) return '🌓';
  if (normalizedAge < 13) return '🌔';
  if (normalizedAge < 16) return '🌕';
  if (normalizedAge < 20) return '🌖';
  if (normalizedAge < 23) return '🌗';
  return '🌘';
}

function formatCivilDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}

function getYearLabel(year, monthIndex) {
  if (monthIndex >= 10) return `${year}–${year + 1}`;
  return String(year);
}

// ============================================================================
// Generate Calendar Grid Data
// ============================================================================

function generateMonthGrid(hekaYear, monthIndex) {
  const daysInMonth = getDaysInMonth(hekaYear, monthIndex);
  const firstDayOffset = getSaturdayStartOffset(hekaYear, monthIndex);
  const days = [];
  
  for (let i = 0; i < firstDayOffset; i++) {
    days.push({ isBlank: true });
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    const civilDate = hekaToCivil(hekaYear, monthIndex, d);
    days.push({
      hekaDay: d,
      civilDate: formatCivilDate(civilDate),
      moonGlyph: calculateMoonPhase(civilDate),
      isBlank: false,
    });
  }
  
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 0; i < remaining; i++) {
    days.push({ isBlank: true });
  }
  
  return days;
}

// ============================================================================
// PDF Generation Templates
// ============================================================================

function generateMonthHTML(year, monthIndex, options, timeMode, notes = {}) {
  const month = MONTHS[monthIndex];
  const days = generateMonthGrid(year, monthIndex);
  const yearLabel = getYearLabel(year, monthIndex);
  
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  
  const gridHTML = weeks.map(week => {
    const cells = week.map(day => {
      if (day.isBlank) {
        return '<div class="cell blank"></div>';
      }
      
      // Get note for this day
      let noteHTML = '';
      if (options.includeNotes) {
        const noteKey = `heka:${year}:${monthIndex}:${day.hekaDay}`;
        const dayNotes = notes[noteKey];
        if (dayNotes && dayNotes.length > 0) {
          const noteText = dayNotes[0].text || dayNotes[0].content || '';
          const truncatedNote = noteText.length > 25 ? noteText.substring(0, 25) + '...' : noteText;
          noteHTML = `<div class="day-note" title="${noteText.replace(/"/g, '&quot;')}">${truncatedNote}</div>`;
        }
      }
      
      return `
        <div class="cell day">
          <div class="cell-header">
            <span class="heka-num">${day.hekaDay}</span>
            ${options.includeMoonPhases ? `<span class="moon">${day.moonGlyph}</span>` : ''}
          </div>
          ${options.includeCivilDates ? `<div class="civil-date">${day.civilDate}</div>` : ''}
          ${noteHTML}
        </div>
      `;
    }).join('');
    return `<div class="week">${cells}</div>`;
  }).join('');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: ${options.paperSize} ${options.orientation};
      margin: 15mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Cinzel', Georgia, serif;
      color: #1a1a1a;
      background: white;
    }
    .main-header {
      text-align: center;
      padding: 10px 0;
      border-bottom: 3px double #1a1a1a;
      margin-bottom: 15px;
    }
    .main-title {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 5px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #1a1a1a;
    }
    .month-title {
      font-size: 36px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .year-label {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
      font-family: ui-monospace, monospace;
      letter-spacing: 0.1em;
    }
    .arc-indicator {
      display: inline-block;
      margin-top: 8px;
      padding: 4px 12px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border-radius: 4px;
    }
    .arc-indicator.opening { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .arc-indicator.core { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .arc-indicator.closing { background: #ede9fe; color: #5b21b6; border: 1px solid #ddd6fe; }
    .dow-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      margin-bottom: 8px;
    }
    .dow-header > div {
      text-align: center;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #666;
      padding: 8px;
      font-family: ui-monospace, monospace;
    }
    .grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .week {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
    }
    .cell {
      border: 1px solid #ddd;
      border-radius: 8px;
      min-height: 100px;
      height: 100px;
      padding: 8px;
      display: flex;
      flex-direction: column;
    }
    .cell.blank {
      border-color: transparent;
      background: #f9f9f9;
    }
    .cell-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .heka-num {
      font-size: 18px;
      font-weight: 700;
    }
    .moon {
      font-size: 16px;
    }
    .civil-date {
      font-size: 10px;
      color: #666;
      font-family: ui-monospace, monospace;
    }
    .day-note {
      font-size: 8px;
      color: #444;
      font-family: ui-sans-serif, system-ui, sans-serif;
      margin-top: auto;
      padding-top: 4px;
      line-height: 1.3;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      max-height: 22px;
    }
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 8px;
      color: #999;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    @media print {
      .cell { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="main-header">
    <div class="main-title">The Modern HEKA Calendar</div>
  </div>
  <div class="header">
    <div class="month-title">${month.name}</div>
    <div class="year-label">HEKA Year ${yearLabel} • Month ${monthIndex + 1} / 13</div>
    <div class="arc-indicator ${month.arc}">${month.arc} Arc</div>
  </div>
  <div class="dow-header">
    <div>Sat</div>
    <div>Sun</div>
    <div>Mon</div>
    <div>Tue</div>
    <div>Wed</div>
    <div>Thu</div>
    <div>Fri</div>
  </div>
  <div class="grid">
    ${gridHTML}
  </div>
  <div class="footer">
    ${timeMode === 'TRUE' ? 'True HEKA Timekeeping • March correction (4-year, except 128th)' : 'Gregorian SYNC Mode • Aligned with civil calendar'}
  </div>
</body>
</html>
  `;
}

function generateYearHTML(year, options, timeMode, notes = {}) {
  const pages = MONTHS.map((month, monthIndex) => {
    const days = generateMonthGrid(year, monthIndex);
    const yearLabel = getYearLabel(year, monthIndex);
    
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    const gridHTML = weeks.map(week => {
      const cells = week.map(day => {
        if (day.isBlank) {
          return '<div class="cell blank"></div>';
        }
        
        // Get note for this day
        let noteHTML = '';
        if (options.includeNotes) {
          const noteKey = `heka:${year}:${monthIndex}:${day.hekaDay}`;
          const dayNotes = notes[noteKey];
          if (dayNotes && dayNotes.length > 0) {
            const noteText = dayNotes[0].text || dayNotes[0].content || '';
            const truncatedNote = noteText.length > 25 ? noteText.substring(0, 25) + '...' : noteText;
            noteHTML = `<div class="day-note" title="${noteText.replace(/"/g, '&quot;')}">${truncatedNote}</div>`;
          }
        }
        
        return `
          <div class="cell day">
            <div class="cell-header">
              <span class="heka-num">${day.hekaDay}</span>
              ${options.includeMoonPhases ? `<span class="moon">${day.moonGlyph}</span>` : ''}
            </div>
            ${options.includeCivilDates ? `<div class="civil-date">${day.civilDate}</div>` : ''}
            ${noteHTML}
          </div>
        `;
      }).join('');
      return `<div class="week">${cells}</div>`;
    }).join('');
    
    return `
      <div class="page">
        <div class="page-header">
          <div class="brand">The Modern HEKA Calendar</div>
        </div>
        <div class="header">
          <div class="header-top">
            <div class="month-section">
              <span class="month-name">${month.name}</span>
              <span class="month-order">${monthIndex + 1} / 13</span>
            </div>
            <div class="year-tag">HEKA Year ${yearLabel}</div>
          </div>
          <div class="arc-section">
            <span class="arc-pill ${month.arc}">${month.arc} Arc</span>
          </div>
        </div>
        <div class="dow-header">
          <div>Sat</div><div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div>
        </div>
        <div class="grid">
          ${gridHTML}
        </div>
        <div class="page-footer">
          ${timeMode === 'TRUE' ? '⚡ TRUE HEKA • Independent astronomical timekeeping' : '🌐 SYNC • Gregorian calendar aligned'}
        </div>
      </div>
    `;
  }).join('\n<div class="page-break"></div>\n');
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: ${options.paperSize} ${options.orientation};
      margin: 10mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Cinzel', Georgia, serif;
      color: #1a1a1a;
      background: white;
    }
    .page {
      page-break-after: always;
      break-after: page;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .page:last-child {
      page-break-after: auto;
    }
    .page-break {
      page-break-before: always;
      break-before: page;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #ddd;
      margin-bottom: 10px;
    }
    .brand {
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #666;
    }
    .header {
      border: 1px solid #ccc;
      border-radius: 8px 8px 0 0;
      background: linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%);
      padding: 12px;
      margin-bottom: 0;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: 2px solid #1a1a1a;
    }
    .month-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .month-name {
      font-size: 22px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .month-order {
      font-size: 11px;
      font-weight: 600;
      color: #666;
      background: #fff;
      padding: 3px 8px;
      border-radius: 999px;
      border: 1px solid #ccc;
      font-family: ui-monospace, monospace;
    }
    .year-tag {
      font-family: ui-monospace, monospace;
      font-size: 8pt;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #333;
      padding: 4px 10px;
      border: 1px solid #999;
      border-radius: 4px;
      background: #fff;
    }
    .arc-section {
      margin-top: 6px;
    }
    .arc-pill {
      font-family: ui-monospace, monospace;
      font-size: 8px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 999px;
      border: 2px solid;
      font-weight: 700;
    }
    .arc-pill.opening { border-color: #ef4444; background: #fef2f2; color: #991b1b; }
    .arc-pill.core { border-color: #22c55e; background: #f0fdf4; color: #166534; }
    .arc-pill.closing { border-color: #8b5cf6; background: #faf5ff; color: #5b21b6; }
    .dow-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0;
      background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
      border: 1px solid #ccc;
      border-bottom: none;
    }
    .dow-header > div {
      text-align: center;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      padding: 6px;
      color: #333;
      font-family: ui-monospace, monospace;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0;
      border: 1px solid #ccc;
      border-top: none;
      flex: 1;
    }
    .week {
      display: contents;
    }
    .cell {
      border: 0.5px solid #ddd;
      min-height: 24mm;
      padding: 5px;
      background: #fff;
      page-break-inside: avoid;
    }
    .cell.blank {
      background: #fafafa;
    }
    .cell-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .heka-num {
      font-size: 14px;
      font-weight: 700;
    }
    .moon {
      font-size: 12px;
    }
    .civil-date {
      font-size: 8px;
      color: #555;
      font-family: ui-monospace, monospace;
    }
    .day-note {
      font-size: 7px;
      color: #333;
      font-family: ui-sans-serif, system-ui, sans-serif;
      margin-top: auto;
      padding-top: 2px;
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      max-height: 18px;
    }
    .page-footer {
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 7px;
      color: #888;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-family: ui-monospace, monospace;
    }
  </style>
</head>
<body>
  ${pages}
</body>
</html>
  `;
}

// ============================================================================
// PDF Generation Endpoint
// ============================================================================

app.post('/api/print', async (req, res) => {
  const jobId = randomUUID();
  const { mode, year, month, options, timeMode, notes } = req.body;
  
  // Set the time mode for calculations
  currentTimeMode = timeMode || 'SYNC';
  
  console.log(`[${jobId}] Starting ${mode} print job for year ${year} (${currentTimeMode} mode)`);
  
  jobs.set(jobId, {
    id: jobId,
    status: 'processing',
    createdAt: new Date(),
  });
  
  res.json({ jobId, status: 'processing' });
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    
    const page = await browser.newPage();
    
    let html;
    if (mode === 'month') {
      const monthIndex = month !== undefined ? month : 0;
      html = generateMonthHTML(year, monthIndex, options, currentTimeMode, notes);
    } else {
      html = generateYearHTML(year, options, currentTimeMode, notes);
    }
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfPath = join(TEMP_DIR, `${jobId}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: options.paperSize,
      landscape: options.orientation === 'landscape',
      printBackground: true,
      preferCSSPageSize: true,
    });
    
    await browser.close();
    
    jobs.set(jobId, {
      ...jobs.get(jobId),
      status: 'completed',
      pdfUrl: `/api/download/${jobId}`,
      completedAt: new Date(),
    });
    
    console.log(`[${jobId}] PDF generation completed`);
    
    setTimeout(async () => {
      try {
        await unlink(pdfPath);
        jobs.delete(jobId);
        console.log(`[${jobId}] Cleaned up`);
      } catch (err) {}
    }, 60 * 60 * 1000);
    
  } catch (error) {
    console.error(`[${jobId}] Error:`, error);
    jobs.set(jobId, {
      ...jobs.get(jobId),
      status: 'failed',
      error: error.message,
    });
  }
});

// ============================================================================
// Job Status & Download Endpoints
// ============================================================================

app.get('/api/print/:jobId/status', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({
    id: job.id,
    status: job.status,
    pdfUrl: job.pdfUrl,
    error: job.error,
  });
});

app.get('/api/download/:jobId', async (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job || job.status !== 'completed') {
    return res.status(404).json({ error: 'PDF not ready' });
  }
  
  const pdfPath = join(TEMP_DIR, `${req.params.jobId}.pdf`);
  res.download(pdfPath, `heka-calendar-${req.params.jobId}.pdf`);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', activeJobs: jobs.size });
});

// Start server
app.listen(PORT, () => {
  console.log(`Print server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
