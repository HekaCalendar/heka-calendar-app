import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import type { PrintOptions } from '../types';
import { THEMES, FONTS } from '../types/themes';
import { generateThemeHTML, prepareYearData } from './PrintThemes';
import { PrintManager } from '../services/PrintManager';
import { getPrintDimensions } from '../services/printEngine';
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

function buildPreviewHtml(pages: string[], pageWidth: number, pageHeight: number): string {
  if (!pages.length) return '';
  const firstPage = pages[0];
  const styleMatch = firstPage.match(/<style>([\s\S]*?)<\/style>/);
  let sharedCss = styleMatch ? styleMatch[1] : '';
  sharedCss = sharedCss
    .replace(/@page\s*\{[^}]*\}/g, '')
    .replace(/html\s*,\s*body\s*\{[^{}]*width:\s*\d+px;[^{}]*height:\s*\d+px;[^{}]*\}/g, 'html, body { margin: 0; padding: 0; background: #e5e5e5; }');

  const pageContents = pages.map((html) => {
    const match = html.match(/<div class="page-root">([\s\S]*?)<\/div>\s*<\/body>/);
    const content = match ? match[1].trim() : '';
    return `<div class="preview-scaler"><div class="preview-page">${content}</div></div>`;
  }).join('\n<div style="page-break-after: always; height: 20px;"></div>\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
html, body { margin: 0; padding: 0; background: #e5e5e5; font-family: Georgia, 'Times New Roman', serif; }
.preview-container { padding: 20px 10px; }
.preview-scaler { width: fit-content; margin: 0 auto 20px; transform: scale(calc((100vw - 40px) / ${pageWidth})); transform-origin: top center; }
.preview-page { width: ${pageWidth}px; height: ${pageHeight}px; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.15); position: relative; overflow: hidden; }
${sharedCss}
</style>
</head>
<body>
<div class="preview-container">
${pageContents}
</div>
</body>
</html>`;
}

function generatePrintJob(
  mode: 'month' | 'year',
  viewDate: { year: number; month: number },
  options: PrintOptions,
  notes: Record<string, any[]>,
  location: string,
  timeMode: string
): { previewHtml: string; pages: string[] } {
  const yearData = prepareYearData(viewDate.year, options, notes, location);
  const dims = getPrintDimensions(options.paperSize, options.orientation === 'landscape');
  if (mode === 'month') {
    const singleMonthData = { ...yearData, months: [yearData.months[viewDate.month]] };
    const pages = generateThemeHTML(options.theme, singleMonthData, options, 'month', timeMode);
    return { previewHtml: buildPreviewHtml(pages, dims.width, dims.height), pages };
  }
  const pages = generateThemeHTML(options.theme, yearData, options, 'year', timeMode);
  return { previewHtml: buildPreviewHtml(pages, dims.width, dims.height), pages };
}

export function PrintPreview() {
  const navigate = useNavigate();
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
  const [printProgress, setPrintProgress] = useState(0);
  const [printCurrentPage, setPrintCurrentPage] = useState(0);
  const [printTotalPages, setPrintTotalPages] = useState(0);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkNetwork = async () => {
      const online = await PrintManager.isOnline();
      setIsOnline(online);
    };
    checkNetwork();
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const pagesRef = useRef<string[]>([]);

  const generatePreview = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const { previewHtml, pages } = generatePrintJob(mode, viewDate, options, notes, location, timeMode);
      setPreviewHtml(previewHtml);
      pagesRef.current = pages;
      setPdfFilePath(null);
      setShowOverlay(true);
    } catch (error) {
      console.error('[PrintPreview] Preview generation error:', error);
      alert('Failed to generate preview. Please try again.');
    }
    setIsGenerating(false);
  }, [mode, viewDate, options, notes, location, timeMode, isGenerating]);

  const downloadPDF = useCallback(async () => {
    if (!pagesRef.current.length) {
      alert('Please generate preview first');
      return;
    }
    setIsGenerating(true);
    setPrintTotalPages(pagesRef.current.length);
    setPrintCurrentPage(0);
    setPrintProgress(0);
    try {
      const result = await PrintManager.generatePDF(pagesRef.current, options.orientation, options.paperSize || 'A4', true, (event) => {
        setPrintCurrentPage(event.currentPage);
        setPrintProgress(event.progress);
        const remaining = event.totalPages - event.currentPage;
        const seconds = Math.ceil(remaining * 2.5);
        setPrintStatus(`Generating page ${event.currentPage} of ${event.totalPages}... Please stay on this page. About ${seconds}s remaining.`);
      });
      setPdfFilePath(result.filePath);
      const filename = result.filePath.split('/').pop();
      alert(`✓ PDF saved to Downloads\n\nFile: ${filename}\n\nSelect an app below to open your PDF.`);
      try {
        await PrintManager.openPDF(result.filePath, `HEKA_Calendar_${new Date().getFullYear()}.pdf`);
      } catch (e: any) {
        await PrintManager.sharePDF(result.filePath, `HEKA_Calendar_${new Date().getFullYear()}.pdf`);
      }
    } catch (error) {
      console.error('[PrintPreview] PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
    setIsGenerating(false);
    setPrintTotalPages(0);
    setPrintStatus('');
  }, [options.orientation, options.paperSize]);

  const handlePrint = useCallback(async () => {
    if (!isOnline) {
      alert('Internet connection required for printing. Please connect to WiFi or mobile data.');
      return;
    }
    setIsPrinting(true);
    let filePath = pdfFilePath;
    if (!filePath) {
      if (!pagesRef.current.length) {
        setIsPrinting(false);
        alert('Please generate preview first');
        return;
      }
      setPrintTotalPages(pagesRef.current.length);
      setPrintCurrentPage(0);
      setPrintProgress(0);
      try {
        const result = await PrintManager.generatePDF(pagesRef.current, options.orientation, options.paperSize || 'A4', false, (event) => {
          setPrintCurrentPage(event.currentPage);
          setPrintProgress(event.progress);
          const remaining = event.totalPages - event.currentPage;
          const seconds = Math.ceil(remaining * 2.5);
          setPrintStatus(`Generating page ${event.currentPage} of ${event.totalPages}... Please stay on this page. About ${seconds}s remaining.`);
        });
        setPdfFilePath(result.filePath);
        filePath = result.filePath;
      } catch (error) {
        console.error('[PrintPreview] PDF generation error:', error);
        setIsPrinting(false);
        setPrintTotalPages(0);
        setPrintStatus('');
        alert('Failed to generate PDF for printing. Please try again.');
        return;
      }
    }
    setPrintStatus('Sending to printer...');
    try {
      await PrintManager.printPDF(filePath, options.orientation, options.paperSize || 'A4');
    } catch (e: any) {
      console.error('[PrintPreview] Print error:', e);
      alert('Print failed: ' + (e?.message || 'Unknown error'));
    } finally {
      setIsPrinting(false);
      setPrintTotalPages(0);
      setPrintStatus('');
    }
  }, [pdfFilePath, isOnline, options.orientation, options.paperSize]);

  const handleClose = () => {
    if (showOverlay) {
      setShowOverlay(false);
    } else {
      navigate('/');
    }
  };

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
      <div className="print-options__header" style={{ backgroundColor: theme.colors.bgElevated, borderBottomColor: theme.colors.border }}>
        <button className="print-options__back" onClick={handleClose} disabled={isPrinting} style={{ opacity: isPrinting ? 0.5 : 1, cursor: isPrinting ? 'not-allowed' : 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="print-options__title">Print Calendar</h1>
        <div className="print-options__spacer" />
      </div>

      <div className="print-options__content">
        <section className="print-options__section">
          <h3 className="print-options__section-title">Print Range</h3>
          <div className="print-options__toggle-group">
            <button className={`print-options__toggle ${mode === 'month' ? 'active' : ''}`} onClick={() => setMode('month')}>
              <span className="print-options__toggle-icon">📅</span>
              <span className="print-options__toggle-label">Current Month</span>
            </button>
            <button className={`print-options__toggle ${mode === 'year' ? 'active' : ''}`} onClick={() => setMode('year')}>
              <span className="print-options__toggle-icon">📆</span>
              <span className="print-options__toggle-label">Full Year</span>
            </button>
          </div>
        </section>

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

        <section className="print-options__section">
          <h3 className="print-options__section-title">Orientation</h3>
          <div className="print-options__toggle-group">
            <button className={`print-options__toggle ${options.orientation === 'portrait' ? 'active' : ''}`} onClick={() => setOptions({ ...options, orientation: 'portrait' })}>
              <span className="print-options__toggle-icon">📄</span>
              <span className="print-options__toggle-label">Portrait</span>
            </button>
            <button className={`print-options__toggle ${options.orientation === 'landscape' ? 'active' : ''}`} onClick={() => setOptions({ ...options, orientation: 'landscape' })}>
              <span className="print-options__toggle-icon">📃</span>
              <span className="print-options__toggle-label">Landscape</span>
            </button>
          </div>
        </section>

        <section className="print-options__section">
          <h3 className="print-options__section-title">Theme</h3>
          <div className="print-options__theme-grid">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.value}
                className={`print-options__theme ${options.theme === t.value ? 'active' : ''}`}
                onClick={() => setOptions({ ...options, theme: t.value })}
              >
                <span className="print-options__theme-icon">{t.icon}</span>
                <span className="print-options__theme-label">{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="print-options__section">
          <h3 className="print-options__section-title">Include</h3>
          <div className="print-options__checkbox-list">
            <label className="print-options__checkbox">
              <input type="checkbox" checked={options.includeNotes} onChange={(e) => setOptions({ ...options, includeNotes: e.target.checked })} />
              <span className="print-options__checkbox-check">✓</span>
              <span className="print-options__checkbox-label">Notes</span>
            </label>
            <label className="print-options__checkbox">
              <input type="checkbox" checked={options.includeMoonPhases} onChange={(e) => setOptions({ ...options, includeMoonPhases: e.target.checked })} />
              <span className="print-options__checkbox-check">✓</span>
              <span className="print-options__checkbox-label">Moon Phases</span>
            </label>
            <label className="print-options__checkbox">
              <input type="checkbox" checked={options.includeCivilDates} onChange={(e) => setOptions({ ...options, includeCivilDates: e.target.checked })} />
              <span className="print-options__checkbox-check">✓</span>
              <span className="print-options__checkbox-label">Civil Dates</span>
            </label>
            <label className="print-options__checkbox">
              <input type="checkbox" checked={options.includeHolidays} onChange={(e) => setOptions({ ...options, includeHolidays: e.target.checked })} />
              <span className="print-options__checkbox-check">✓</span>
              <span className="print-options__checkbox-label">Holidays</span>
            </label>
          </div>
        </section>
      </div>

      <div className="print-options__footer">
        <button className="print-options__generate" onClick={generatePreview} disabled={isGenerating}>
          {isGenerating ? (
            <><span className="print-options__spinner" />Generating Preview...</>
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

      {showOverlay && (
        <div ref={overlayRef} style={{ position: 'fixed', inset: 0, background: theme.colors.bg, zIndex: 99999, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '84px 16px 12px', background: `linear-gradient(180deg, ${theme.colors.bgElevated} 0%, ${theme.colors.bg} 100%)`, borderBottom: `1px solid ${theme.colors.border}`, boxShadow: '0 2px 16px rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <h2 style={{ margin: 0, fontSize: '16px', color: theme.colors.primary, fontFamily: fontTheme.fonts.display, display: 'flex', alignItems: 'center', gap: '8px' }}>📄 Output Preview</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowOverlay(false)} disabled={isPrinting} style={{ padding: '10px 18px', borderRadius: '10px', border: `1px solid ${isPrinting ? theme.colors.textMuted : theme.colors.border}`, background: isPrinting ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.08)', color: isPrinting ? theme.colors.textMuted : theme.colors.textSecondary, cursor: isPrinting ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, opacity: isPrinting ? 0.6 : 1 }}>✕ Close</button>
              <button onClick={downloadPDF} disabled={isPrinting || isGenerating} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: theme.colors.primary, color: '#fff', cursor: (isPrinting || isGenerating) ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, opacity: (isPrinting || isGenerating) ? 0.6 : 1 }}>{isGenerating && printTotalPages > 0 ? '⏳ Generating...' : '⬇ Download PDF'}</button>
              <button onClick={handlePrint} disabled={isPrinting || !isOnline || isGenerating} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: isOnline ? '#22c55e' : '#666', color: '#fff', cursor: (isPrinting || !isOnline || isGenerating) ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600, opacity: (isPrinting || !isOnline || isGenerating) ? 0.6 : 1 }}>{isPrinting ? '⏳ Please wait...' : '🖨 Print'}</button>
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '16px', paddingTop: '8px' }}>
            <iframe
              srcDoc={previewHtml}
              style={{ width: '100%', height: '100%', border: 'none', background: theme.colors.bg }}
              title="Print Preview"
            />
          </div>

          {(isGenerating || isPrinting) && printTotalPages > 0 && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)', zIndex: 100000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '24px' }}>
              <div style={{ width: '64px', height: '64px', border: `4px solid ${theme.colors.primaryMuted}`, borderTopColor: theme.colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <div style={{ textAlign: 'center', maxWidth: '340px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '16px', lineHeight: 1.5 }}>
                  {printStatus || 'Please wait...'}
                </div>
                <div style={{ width: '280px', height: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${printProgress * 100}%`, height: '100%', background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`, transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: theme.colors.textMuted }}>
                  Page {printCurrentPage} of {printTotalPages}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
