/**
 * ENTERPRISE PRINT ENGINE
 * Self-contained page model: one page = one complete HTML document
 * Handles A4/A3/Letter × Portrait/Landscape at 150 DPI
 */



export interface PrintDimensions {
  width: number;   // pixels at 150 DPI
  height: number;  // pixels at 150 DPI
  pointsWidth: number;  // PDF points at 72 DPI
  pointsHeight: number; // PDF points at 72 DPI
}

export const PAPER_DIMENSIONS: Record<string, Omit<PrintDimensions, 'width' | 'height' | 'pointsWidth' | 'pointsHeight'> & { width: number; height: number; pointsWidth: number; pointsHeight: number }> = {
  A4: {
    width: 1240,   // 210mm @ 150 DPI
    height: 1754,  // 297mm @ 150 DPI
    pointsWidth: 595,
    pointsHeight: 842,
  },
  A3: {
    width: 1754,   // 297mm @ 150 DPI
    height: 2480,  // 420mm @ 150 DPI
    pointsWidth: 842,
    pointsHeight: 1191,
  },
  Letter: {
    width: 1275,   // 8.5" @ 150 DPI
    height: 1650,  // 11" @ 150 DPI
    pointsWidth: 612,
    pointsHeight: 792,
  },
};

export function getPrintDimensions(paperSize: string, isLandscape: boolean): PrintDimensions {
  const base = PAPER_DIMENSIONS[paperSize] || PAPER_DIMENSIONS.A4;
  if (isLandscape) {
    return {
      width: base.height,
      height: base.width,
      pointsWidth: base.pointsHeight,
      pointsHeight: base.pointsWidth,
    };
  }
  return {
    width: base.width,
    height: base.height,
    pointsWidth: base.pointsWidth,
    pointsHeight: base.pointsHeight,
  };
}

export interface WrappedPageOptions {
  paperSize: string;
  orientation: 'portrait' | 'landscape';
  title?: string;
  extraCss?: string;
  /** If true, adds print-ready meta viewport and color-adjust */
  isPrintMode?: boolean;
}

/**
 * Wraps inner HTML into a self-contained, pixel-perfect HTML document.
 * This is the ONLY wrapper in the system. No regex splitting. No second-pass wrapping.
 */
export function wrapPage(contentHtml: string, options: WrappedPageOptions): string {
  const isLandscape = options.orientation === 'landscape';
  const dims = getPrintDimensions(options.paperSize, isLandscape);
  const { width, height } = dims;
  const title = options.title || 'HEKA Calendar';
  const printMeta = options.isPrintMode
    ? `<meta name="viewport" content="width=${width}, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
${printMeta}
<title>${title}</title>
<style>
@page { size: ${options.paperSize} ${options.orientation}; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
html, body {
  width: ${width}px;
  height: ${height}px;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #ffffff;
}
.page-root {
  width: ${width}px;
  height: ${height}px;
  position: relative;
  overflow: hidden;
}
${options.extraCss || ''}
</style>
</head>
<body>
<div class="page-root">
${contentHtml}
</div>
</body>
</html>`;
}

/**
 * iframe srcDoc for preview. Uses the same wrapPage but with scaling handled by the iframe container.
 */
export function wrapPreviewPage(contentHtml: string, options: WrappedPageOptions): string {
  return wrapPage(contentHtml, { ...options, isPrintMode: false });
}

/**
 * PDF generation page. Same HTML but flagged for print mode meta tags.
 */
export function wrapPdfPage(contentHtml: string, options: WrappedPageOptions): string {
  return wrapPage(contentHtml, { ...options, isPrintMode: true });
}
