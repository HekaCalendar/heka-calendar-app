/* ============================================================
   HOME PAGE SCRIPTS
   ============================================================ */

// ============================================================
// LIVE TIME
// ============================================================
function updateTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const liveTime = document.getElementById('liveTime');
  if (liveTime) {
    liveTime.textContent = `${hours}:${minutes}`;
  }

  // Heka date calculation (approximate for display)
  const civilMonth = now.getMonth(); // 0-11
  const civilDate = now.getDate();
  const hekaMonths = ['Apr','May','Jun','Jul','Aug','Hex','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
  let hekaMonthIdx, hekaDay;

  // April starts at civil month 3 (index 3)
  if (civilMonth === 3) { // April
    hekaMonthIdx = 0; hekaDay = civilDate;
  } else if (civilMonth === 4) { // May
    hekaMonthIdx = 1; hekaDay = civilDate;
  } else if (civilMonth === 5) { // June
    hekaMonthIdx = 2; hekaDay = civilDate;
  } else if (civilMonth === 6) { // July
    hekaMonthIdx = 3; hekaDay = civilDate;
  } else if (civilMonth === 7) { // August
    hekaMonthIdx = 4; hekaDay = civilDate;
  } else if (civilMonth === 8) { // September -> Hexa is month 5
    if (civilDate <= 28) { hekaMonthIdx = 5; hekaDay = civilDate; }
    else { hekaMonthIdx = 6; hekaDay = civilDate - 28; }
  } else if (civilMonth === 9) { // October
    hekaMonthIdx = 6; hekaDay = civilDate;
  } else if (civilMonth === 10) { // November
    hekaMonthIdx = 7; hekaDay = civilDate;
  } else if (civilMonth === 11) { // December
    hekaMonthIdx = 8; hekaDay = civilDate;
  } else if (civilMonth === 0) { // January
    hekaMonthIdx = 9; hekaDay = civilDate;
  } else if (civilMonth === 1) { // February
    hekaMonthIdx = 10; hekaDay = civilDate;
  } else if (civilMonth === 2) { // March
    hekaMonthIdx = 11; hekaDay = civilDate;
  }

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const day = dayNames[now.getDay()];
  const liveDate = document.getElementById('liveDate');
  if (liveDate) {
    liveDate.textContent = `${day} · ${hekaDay} ${hekaMonths[hekaMonthIdx]}`;
  }
}
updateTime();
setInterval(updateTime, 1000);

// ============================================================
// WATCH MONTH RING (Hero)
// ============================================================
const monthRing = document.getElementById('monthRing');
if (monthRing) {
  const monthNamesShort = ['Apr','May','Jun','Jul','Aug','Hex','Sep','Oct','Nov','Dec','Jan','Feb','Mar'];
  const monthArcs = ['opening','core','core','core','core','hexa','core','core','core','core','closing','closing','closing'];
  for (let i = 0; i < 13; i++) {
    const angle = (i * 360 / 13) - 90;
    const tick = document.createElement('div');
    tick.className = `month-tick ${monthArcs[i]}`;
    tick.style.transform = `rotate(${angle}deg)`;
    tick.style.transformOrigin = '50% 116px';
    monthRing.appendChild(tick);

    const label = document.createElement('div');
    label.className = 'month-label';
    label.textContent = monthNamesShort[i];
    if (i === 5) label.style.color = 'var(--gold)';
    const rad = (angle * Math.PI) / 180;
    const x = Math.cos(rad) * 100;
    const y = Math.sin(rad) * 100;
    label.style.left = `calc(50% + ${x}px)`;
    label.style.top = `calc(50% + ${y}px)`;
    label.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;
    monthRing.appendChild(label);
  }
}
