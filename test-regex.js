const css = `
.month-page { 
  width: 195mm;
  height: 285mm;
  background: #fefefe;
  padding: 30px;
  margin: 6mm auto;
}
`;

const width = 1000;
const height = 1460;

const cssProcessed = css.replace(/width: 195mm;?\s*height: 285mm;?/g, `width: ${width}px; height: ${height}px;`)
                        .replace(/margin: 6mm auto[^;]*;/g, 'margin: 0 auto;');

console.log('After first replace:');
console.log(cssProcessed);

const isMonthView = true;
const monthPageWidth = isMonthView ? '940px' : `${width}px`;
const monthPageHeight = isMonthView ? '1400px' : `${height}px`;

const finalCSS = cssProcessed.replace(/width: 1000px; height: 1460px;/g, `width: ${monthPageWidth}; height: ${monthPageHeight};`);

console.log('\nAfter second replace:');
console.log(finalCSS);
