/**
 * HEKA Calendar — Interactive App Preview
 * Self-contained vanilla JS implementation of the HEKA month grid + day panel.
 */

(function () {
  'use strict';

  const HEKA_MONTHS = [
    { index: 0, name: 'April', civilHint: 'Apr', arc: 'OPENING' },
    { index: 1, name: 'May', civilHint: 'May', arc: 'CORE' },
    { index: 2, name: 'June', civilHint: 'Jun', arc: 'CORE' },
    { index: 3, name: 'July', civilHint: 'Jul', arc: 'CORE' },
    { index: 4, name: 'August', civilHint: 'Aug', arc: 'CORE' },
    { index: 5, name: 'Hexa', civilHint: 'Aug/Sep', arc: 'CORE' },
    { index: 6, name: 'September', civilHint: 'Sep', arc: 'CORE' },
    { index: 7, name: 'October', civilHint: 'Oct', arc: 'CORE' },
    { index: 8, name: 'November', civilHint: 'Nov', arc: 'CORE' },
    { index: 9, name: 'December', civilHint: 'Dec', arc: 'CORE' },
    { index: 10, name: 'January', civilHint: 'Jan', arc: 'CLOSING' },
    { index: 11, name: 'February', civilHint: 'Feb', arc: 'CLOSING' },
    { index: 12, name: 'March', civilHint: 'Mar', arc: 'CLOSING' },
  ];

  const CIVIL_MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAYS_SHORT = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const ARC_STYLES = {
    OPENING: { label: 'Opening Arc', color: '#fca5a5', bg: 'rgba(220, 38, 38, 0.14)', border: 'rgba(220, 38, 38, 0.4)' },
    CORE: { label: 'Core Arc', color: '#86efac', bg: 'rgba(22, 163, 74, 0.14)', border: 'rgba(34, 197, 94, 0.4)' },
    CLOSING: { label: 'Closing Arc', color: '#c4b5fd', bg: 'rgba(124, 58, 237, 0.14)', border: 'rgba(124, 58, 237, 0.4)' },
  };

  function isGregorianLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function isHekaLeapMarch(hekaYear) {
    // SYNC mode: March has 30 days when the next Gregorian year is a leap year
    return isGregorianLeapYear(hekaYear + 1);
  }

  function getMarchLength(hekaYear) {
    return isHekaLeapMarch(hekaYear) ? 30 : 29;
  }

  function getDaysInMonth(hekaYear, monthIndex) {
    return monthIndex === 12 ? getMarchLength(hekaYear) : 28;
  }

  function getHekaYearStart(hekaYear) {
    // SYNC mode: HEKA year starts on Gregorian April 1
    return new Date(hekaYear, 3, 1);
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function getCivilStartOfHekaMonth(hekaYear, monthIndex) {
    const yearStart = getHekaYearStart(hekaYear);
    let daysToAdd = 0;
    for (let i = 0; i < monthIndex; i++) {
      daysToAdd += getDaysInMonth(hekaYear, i);
    }
    return addDays(yearStart, daysToAdd);
  }

  function hekaToCivil(hekaDate) {
    const monthStart = getCivilStartOfHekaMonth(hekaDate.year, hekaDate.month);
    return addDays(monthStart, hekaDate.day - 1);
  }

  function getArcType(monthIndex) {
    if (monthIndex === 0) return 'OPENING';
    if (monthIndex >= 10) return 'CLOSING';
    return 'CORE';
  }

  function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function generateMonthGrid(hekaYear, monthIndex, todayCivil) {
    const daysInMonth = getDaysInMonth(hekaYear, monthIndex);
    const firstDayCivil = getCivilStartOfHekaMonth(hekaYear, monthIndex);
    const firstDayOffset = (firstDayCivil.getDay() + 1) % 7; // Saturday-start
    const today = todayCivil ? stripTime(todayCivil) : stripTime(new Date());
    const grid = [];

    for (let i = 0; i < firstDayOffset; i++) {
      grid.push({ hekaDate: { year: hekaYear, month: monthIndex, day: 0 }, civilDate: addDays(firstDayCivil, -(firstDayOffset - i)) });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const civilDate = addDays(firstDayCivil, day - 1);
      grid.push({
        hekaDate: { year: hekaYear, month: monthIndex, day },
        civilDate,
        moonPhase: calculateMoonPhase(civilDate),
        isToday: stripTime(civilDate).getTime() === today.getTime(),
      });
    }

    const remaining = (7 - (grid.length % 7)) % 7;
    const lastDay = hekaToCivil({ year: hekaYear, month: monthIndex, day: daysInMonth });
    for (let i = 1; i <= remaining; i++) {
      grid.push({ hekaDate: { year: hekaYear, month: monthIndex, day: 0 }, civilDate: addDays(lastDay, i) });
    }

    return grid;
  }

  function calculateMoonPhase(date) {
    const synodicMonth = 29.53059;
    const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const daysSinceKnown = (utcDate.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    let moonAge = daysSinceKnown % synodicMonth;
    if (moonAge < 0) moonAge += synodicMonth;

    if (moonAge < 1) return { glyph: '🌑', name: 'New Moon' };
    if (moonAge < 6.5) return { glyph: '🌒', name: 'Waxing Crescent' };
    if (moonAge < 8.5) return { glyph: '🌓', name: 'First Quarter' };
    if (moonAge < 13.5) return { glyph: '🌔', name: 'Waxing Gibbous' };
    if (moonAge < 16) return { glyph: '🌕', name: 'Full Moon' };
    if (moonAge < 21) return { glyph: '🌖', name: 'Waning Gibbous' };
    if (moonAge < 23) return { glyph: '🌗', name: 'Last Quarter' };
    if (moonAge < 28) return { glyph: '🌘', name: 'Waning Crescent' };
    return { glyph: '🌑', name: 'New Moon' };
  }

  function getYearDisplay(hekaYear, monthIndex) {
    const arc = getArcType(monthIndex);
    return arc === 'CLOSING' ? `${hekaYear}–${hekaYear + 1}` : String(hekaYear);
  }

  // Sample data to make the preview feel alive
  const SAMPLE_NOTES = {
    '0-5': [{ content: 'Set quarterly intentions', tags: [] }, { content: 'Call mentor', tags: [] }],
    '0-12': [{ content: 'Review lunar goals', tags: [] }],
    '0-21': [{ content: 'Prepare closing report', tags: ['quick note'] }],
    '0-28': [{ content: 'Month-end reflection', tags: [] }],
    '1-8': [{ content: 'Team sync', tags: [] }],
    '1-14': [{ content: 'Plan long weekend', tags: ['quick note'] }],
    '2-3': [{ content: 'Start new journal', tags: [] }],
    '2-18': [{ content: 'Pay quarterly estimates', tags: [] }],
    '3-7': [{ content: 'Family dinner', tags: [] }],
    '3-22': [{ content: 'Launch blog post', tags: ['quick note'] }],
  };

  const SAMPLE_HOLIDAYS = {
    '2026-3-3': 'Good Friday',
    '2026-3-5': 'Easter Sunday',
    '2026-4-11': "Mother's Day (AU)",
    '2026-9-7': 'Labor Day (US)',
    '2026-11-26': 'Thanksgiving (US)',
    '2026-12-25': 'Christmas Day',
    '2026-12-31': "New Year's Eve",
    '2027-1-1': "New Year's Day",
    '2027-2-14': "Valentine's Day",
    '2027-3-17': "St Patrick's Day",
  };

  const SEASONS = {
    '04': 'Spring (Northern) / Autumn (Southern)',
    '05': 'Spring (Northern) / Autumn (Southern)',
    '06': 'Summer (Northern) / Winter (Southern)',
    '07': 'Summer (Northern) / Winter (Southern)',
    '08': 'Summer (Northern) / Winter (Southern)',
    '09': 'Autumn (Northern) / Spring (Southern)',
    '10': 'Autumn (Northern) / Spring (Southern)',
    '11': 'Autumn (Northern) / Spring (Southern)',
    '12': 'Winter (Northern) / Summer (Southern)',
    '01': 'Winter (Northern) / Summer (Southern)',
    '02': 'Winter (Northern) / Summer (Southern)',
    '03': 'Spring (Northern) / Autumn (Southern)',
  };

  function getNotesForDay(hekaDate) {
    const key = `${hekaDate.month}-${hekaDate.day}`;
    return SAMPLE_NOTES[key] || [];
  }

  function getHoliday(civilDate) {
    const k = `${civilDate.getFullYear()}-${String(civilDate.getMonth() + 1).padStart(2, '0')}-${String(civilDate.getDate()).padStart(2, '0')}`;
    return SAMPLE_HOLIDAYS[k] || null;
  }

  // UI State
  const state = {
    year: 2026,
    month: 0,
    selected: { year: 2026, month: 0, day: 5 },
    showCivil: true,
    showMoon: true,
    showHolidays: true,
    today: new Date(),
  };

  const els = {};

  function init() {
    els.monthName = document.getElementById('ap-month-name');
    els.yearDisplay = document.getElementById('ap-year-display');
    els.monthIndex = document.getElementById('ap-month-index');
    els.arcPill = document.getElementById('ap-arc-pill');
    els.grid = document.getElementById('ap-grid');
    els.dayPanel = document.getElementById('ap-day-panel');
    els.toast = document.getElementById('ap-toast');
    els.toastText = document.getElementById('ap-toast-text');

    bindControls();
    render();
  }

  function bindControls() {
    document.getElementById('ap-prev').addEventListener('click', () => navigate(-1));
    document.getElementById('ap-next').addEventListener('click', () => navigate(1));
    document.getElementById('ap-today').addEventListener('click', goToToday);

    ['civil', 'moon', 'holidays'].forEach((toggle) => {
      const btn = document.getElementById(`ap-toggle-${toggle}`);
      btn.addEventListener('click', () => {
        const key = toggle === 'civil' ? 'showCivil' : toggle === 'moon' ? 'showMoon' : 'showHolidays';
        state[key] = !state[key];
        btn.classList.toggle('btn--active', state[key]);
        render();
      });
    });

    // Preview-only feature buttons
    const previewButtons = document.querySelectorAll('[data-preview]');
    previewButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        showToast(btn.dataset.preview || 'Coming soon');
      });
    });
  }

  function navigate(delta) {
    let newMonth = state.month + delta;
    let newYear = state.year;
    if (newMonth < 0) {
      newMonth = 12;
      newYear--;
    } else if (newMonth > 12) {
      newMonth = 0;
      newYear++;
    }
    state.month = newMonth;
    state.year = newYear;
    render();
  }

  function goToToday() {
    const todayHeka = civilToHeka(state.today) || { year: 2026, month: 0, day: 1 };
    state.year = todayHeka.year;
    state.month = todayHeka.month;
    state.selected = todayHeka;
    render();
  }

  function civilToHeka(civilDate) {
    const target = stripTime(civilDate);
    let hekaYear = target.getMonth() < 3 ? target.getFullYear() - 1 : target.getFullYear();
    for (let offset = -2; offset <= 2; offset++) {
      const testYear = hekaYear + offset;
      const yearStart = getHekaYearStart(testYear);
      const yearEnd = addDays(getHekaYearStart(testYear + 1), -1);
      if (target >= yearStart && target <= yearEnd) {
        for (let m = 0; m < 13; m++) {
          const monthStart = getCivilStartOfHekaMonth(testYear, m);
          const monthLength = getDaysInMonth(testYear, m);
          const monthEnd = addDays(monthStart, monthLength - 1);
          if (target >= monthStart && target <= monthEnd) {
            const diff = Math.round((target - monthStart) / (1000 * 60 * 60 * 24));
            return { year: testYear, month: m, day: diff + 1 };
          }
        }
      }
    }
    return null;
  }

  function render() {
    const monthInfo = HEKA_MONTHS[state.month];
    const arc = getArcType(state.month);
    const arcStyle = ARC_STYLES[arc];

    els.monthName.textContent = monthInfo.name;
    els.yearDisplay.textContent = getYearDisplay(state.year, state.month);
    els.monthIndex.textContent = `Month ${state.month + 1} of 13`;
    els.arcPill.textContent = arcStyle.label;
    els.arcPill.style.background = arcStyle.bg;
    els.arcPill.style.borderColor = arcStyle.border;
    els.arcPill.style.color = arcStyle.color;
    els.arcPill.style.boxShadow = `0 0 15px ${arcStyle.bg}`;

    renderGrid();
    renderDayPanel();
  }

  function renderGrid() {
    const grid = generateMonthGrid(state.year, state.month, state.today);
    const weeks = chunk(grid, 7);

    els.grid.innerHTML = '';

    weeks.forEach((week) => {
      const weekEl = document.createElement('div');
      weekEl.className = 'calendar-grid__week';
      week.forEach((day) => {
        weekEl.appendChild(createDayCell(day));
      });
      els.grid.appendChild(weekEl);
    });
  }

  function createDayCell(day) {
    const isBlank = day.hekaDate.day === 0;
    const cell = document.createElement('button');
    cell.className = 'day-cell';
    cell.type = 'button';

    if (isBlank) {
      cell.classList.add('day-cell--blank');
      return cell;
    }

    const isSelected = state.selected &&
      state.selected.year === day.hekaDate.year &&
      state.selected.month === day.hekaDate.month &&
      state.selected.day === day.hekaDate.day;

    if (isSelected) cell.classList.add('day-cell--selected');
    if (day.isToday) cell.classList.add('day-cell--today');

    const notes = getNotesForDay(day.hekaDate);
    const holiday = state.showHolidays ? getHoliday(day.civilDate) : null;

    let html = `
      <div class="day-cell__header">
        <span class="day-cell__heka-num">${day.hekaDate.day}</span>
        <div class="day-cell__celestial-badges">
          ${state.showMoon && day.moonPhase ? `<span class="day-cell__moon" title="${day.moonPhase.name}">${day.moonPhase.glyph}</span>` : ''}
        </div>
      </div>
    `;

    if (state.showCivil) {
      html += `<div class="day-cell__civil">${day.civilDate.getDate()} ${CIVIL_MONTHS_SHORT[day.civilDate.getMonth()]}</div>`;
    }

    if (notes.length > 0) {
      html += `<div class="day-cell__note-preview">`;
      notes.slice(0, 1).forEach((note) => {
        const isQuick = note.tags && note.tags.includes('quick note');
        html += `
          <div class="note-preview-item">
            ${isQuick ? '<span class="note-preview-tag">Q</span>' : ''}
            <span class="note-preview-text">${escapeHtml(note.content)}</span>
          </div>
        `;
      });
      if (notes.length > 1) {
        html += `<div class="note-preview-item"><span class="note-preview-text">+${notes.length - 1} more</span></div>`;
      }
      html += `</div>`;
    }

    if (holiday) {
      html += `<div class="day-cell__holiday-indicator" title="${escapeHtml(holiday)}"></div>`;
    }

    cell.innerHTML = html;
    cell.addEventListener('click', () => {
      state.selected = day.hekaDate;
      render();
    });

    return cell;
  }

  function renderDayPanel() {
    if (!state.selected) {
      els.dayPanel.innerHTML = `
        <div class="app-day-panel--empty">
          <div>
            <div style="font-size: 2rem; margin-bottom: 12px;">👆</div>
            <p>Select any day to see the full HEKA Calendar day panel.</p>
          </div>
        </div>
      `;
      return;
    }

    const sel = state.selected;
    const civilDate = hekaToCivil(sel);
    const monthInfo = HEKA_MONTHS[sel.month];
    const moon = calculateMoonPhase(civilDate);
    const notes = getNotesForDay(sel);
    const holiday = state.showHolidays ? getHoliday(civilDate) : null;
    const season = SEASONS[String(civilDate.getMonth() + 1).padStart(2, '0')];
    const dayName = civilDate.toLocaleDateString(undefined, { weekday: 'long' });
    const civilFull = civilDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

    let notesHtml = '';
    if (notes.length > 0 || holiday) {
      notesHtml = `<div class="day-panel-card">
        <div class="day-panel-card__title">📝 Notes & Events</div>
        <div class="day-panel-card__content">`;
      if (holiday) {
        notesHtml += `
          <div class="day-panel-note">
            <span class="day-panel-note__icon">🎉</span>
            <span class="day-panel-note__text"><strong>${escapeHtml(holiday)}</strong></span>
          </div>`;
      }
      notes.forEach((note) => {
        const icon = note.tags && note.tags.includes('quick note') ? '⚡' : '📝';
        notesHtml += `
          <div class="day-panel-note">
            <span class="day-panel-note__icon">${icon}</span>
            <span class="day-panel-note__text">${escapeHtml(note.content)}</span>
          </div>`;
      });
      notesHtml += `</div></div>`;
    }

    els.dayPanel.innerHTML = `
      <div class="app-day-panel__header">
        <div class="app-day-panel__date">${monthInfo.name} ${sel.day}</div>
        <div class="app-day-panel__civil">${dayName} • ${civilFull}</div>
      </div>
      <div class="app-day-panel__body">
        <div class="day-panel-card">
          <div class="day-panel-card__title">${moon.glyph} Moon Phase</div>
          <div class="day-panel-card__content">
            <strong>${moon.name}</strong> today. The moon’s rhythm is one of the oldest timekeepers — reflected in both the app’s visual cues and optional celestial guidance.
          </div>
        </div>

        <div class="day-panel-card">
          <div class="day-panel-card__title">🌿 Season</div>
          <div class="day-panel-card__content">${season}</div>
        </div>

        <div class="day-panel-card">
          <div class="day-panel-card__title">📅 Day of the Week</div>
          <div class="day-panel-card__content">
            HEKA uses a Saturday-start week. In this calendar, <strong>${dayName}</strong> always falls on the same column for every month within the same year.
          </div>
        </div>

        ${notesHtml}

        <div class="day-panel-card" style="opacity: 0.8;">
          <div class="day-panel-card__title">✨ Celestial Guidance</div>
          <div class="day-panel-card__content" style="font-size: 0.82rem;">
            Birth charts, transits, lunar mansions and AI coaching are available in the full app. This preview shows the core calendar experience.
          </div>
        </div>
      </div>
    `;
  }

  function showToast(message) {
    els.toastText.textContent = message;
    els.toast.classList.add('app-preview-toast--visible');
    setTimeout(() => {
      els.toast.classList.remove('app-preview-toast--visible');
    }, 2400);
  }

  function chunk(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
