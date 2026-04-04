const css = `
    /* Month Pages - Premium Design */
    .month-page { 
      width: 195mm;
      height: 285mm;
      background: #fefefe;
      border-radius: 0; 
      padding: 30px;
      margin: 6mm auto;
      box-shadow: none;
      page-break-after: always;
      break-after: page;
      display: flex;
      flex-direction: column;
      position: relative;
    }
`;

const width = 1000;
const height = 1460;
const isMonthView = true;

const cssProcessed = css.replace(/width: 195mm;?\s*height: 285mm;?/g, `width: ${width}px; height: ${height}px;`)
                        .replace(/margin: 6mm auto[^;]*;/g, isMonthView ? '' : 'margin: 0 auto;');

console.log('cssProcessed:');
console.log(cssProcessed);

const monthPageWidth = isMonthView ? '940px' : `${width}px`;
const monthPageHeight = isMonthView ? '1400px' : `${height}px`;

const finalCSS = cssProcessed.replace(/width: 1000px; height: 1460px;/g, `width: ${monthPageWidth}; height: ${monthPageHeight};`);

console.log('\nfinalCSS:');
console.log(finalCSS);

console.log('\n--- Full output with overrides ---');
console.log(`.month-page { overflow: hidden; }
${finalCSS}
/* Month view overrides - wrapper handles padding */
.month-page { padding: 0 !important; width: 940px !important; height: 1400px !important; }
.month-print-header, .month-header, .dow-row, .calendar-grid { margin-left: 30px; margin-right: 30px; width: 880px; }
.month-print-header { margin-top: 30px; }
.calendar-grid { margin-bottom: 30px; grid-template-columns: repeat(7, 124px); }
.dow-row { grid-template-columns: repeat(7, 124px); }`);
