/* ============================================================
   WATCH PAGE SCRIPTS
   ============================================================ */

// ============================================================
// DIAL MONTH MARKERS (SVG) — Arc Colored
// ============================================================
const dialMonthTicks = document.getElementById('dialMonthTicks');
const dialMonthLabels = document.getElementById('dialMonthLabels');

if (dialMonthTicks && dialMonthLabels) {
  const svgMonths = ['APR','MAY','JUN','JUL','AUG','HEX','SEP','OCT','NOV','DEC','JAN','FEB','MAR'];
  const svgArcColors = [
    '#dc2626', '#16a34a', '#16a34a', '#16a34a', '#16a34a',
    '#d4af37',
    '#16a34a', '#16a34a', '#16a34a', '#16a34a',
    '#7c3aed', '#7c3aed', '#7c3aed'
  ];
  const svgArcGlows = [
    'url(#glow-red)', 'url(#glow-green)', 'url(#glow-green)', 'url(#glow-green)', 'url(#glow-green)',
    'url(#glow-gold)',
    'url(#glow-green)', 'url(#glow-green)', 'url(#glow-green)', 'url(#glow-green)',
    'url(#glow-purple)', 'url(#glow-purple)', 'url(#glow-purple)'
  ];

  svgMonths.forEach((name, i) => {
    const angle = (i * 360 / 13) - 90;
    const rad = (angle * Math.PI) / 180;

    // Tick — longer arc-colored marker
    const tx1 = 200 + Math.cos(rad) * 154;
    const ty1 = 200 + Math.sin(rad) * 154;
    const tx2 = 200 + Math.cos(rad) * 168;
    const ty2 = 200 + Math.sin(rad) * 168;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', tx1);
    line.setAttribute('y1', ty1);
    line.setAttribute('x2', tx2);
    line.setAttribute('y2', ty2);
    line.setAttribute('stroke', svgArcColors[i]);
    line.setAttribute('stroke-width', i === 5 ? '3' : '2.5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('filter', svgArcGlows[i]);
    line.setAttribute('opacity', '0.8');
    dialMonthTicks.appendChild(line);

    // Label
    const lx = 200 + Math.cos(rad) * 142;
    const ly = 200 + Math.sin(rad) * 142;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', lx);
    text.setAttribute('y', ly);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', i === 5 ? '#d4af37' : 'rgba(255,255,255,0.25)');
    text.setAttribute('font-family', 'JetBrains Mono');
    text.setAttribute('font-size', '5.5');
    text.setAttribute('letter-spacing', '0.5');
    text.setAttribute('transform', `rotate(${angle + 90} ${lx} ${ly})`);
    text.textContent = name;
    dialMonthLabels.appendChild(text);
  });
}
