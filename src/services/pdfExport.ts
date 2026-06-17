/**
 * PDF Export Service
 * Generates beautifully formatted PDF exports of diary entries
 */

import type { DiaryEntry, JournalTheme, JournalFont } from '../oracle/diaryTypes';
import { escapeHtml } from '../utils/htmlEscape';

interface PDFExportOptions {
  title?: string;
  includeInsights?: boolean;
  dateRange?: { start: string; end: string };
}

/**
 * Generate a styled HTML string for PDF export
 */
export function generateDiaryPDF(
  entries: DiaryEntry[],
  options: PDFExportOptions = {}
): string {
  const { title = 'HEKA Journal', includeInsights = true } = options;

  // Sort entries by date
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Group by month
  const grouped = sortedEntries.reduce((groups, entry) => {
    const date = new Date(entry.date);
    const monthKey = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(entry);
    return groups;
  }, {} as Record<string, DiaryEntry[]>);

  // Get theme styles
  const getThemeStyles = (theme: JournalTheme): string => {
    const styles: Record<JournalTheme, string> = {
      plain: `
        background: #ffffff;
        color: #1a1a1a;
        line-height: 1.8;
      `,
      night: `
        background: #1a1a2e;
        color: #e8e8e8;
        line-height: 1.8;
      `,
      parchment: `
        background: #f5f0e1;
        color: #4a3c2a;
        line-height: 1.8;
      `,
      celestial: `
        background: linear-gradient(135deg, #1a1a28 0%, #2d1f3d 100%);
        color: #e8e8e8;
        line-height: 1.8;
        border: 1px solid rgba(202, 162, 74, 0.2);
      `,
    };
    return styles[theme] || styles.plain;
  };

  // Get font family
  const getFontFamily = (font: JournalFont): string => {
    const fonts: Record<JournalFont, string> = {
      serif: 'Georgia, "Times New Roman", serif',
      clean: 'Inter, Roboto, -apple-system, sans-serif',
      handwritten: '"Brush Script MT", cursive',
      typewriter: '"Courier New", Courier, monospace',
      elegant: '"Playfair Display", Georgia, serif',
      journal: 'Quicksand, "Open Sans", sans-serif',
    };
    return fonts[font] || fonts.serif;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Generate HTML
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Inter:wght@400;500;600&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #f5f5f5;
      padding: 40px 20px;
    }
    
    .journal {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    .journal-header {
      background: linear-gradient(135deg, #1a1a2e 0%, #2d1f3d 100%);
      color: #caa24a;
      padding: 40px;
      text-align: center;
    }
    
    .journal-header h1 {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 2px;
    }
    
    .journal-header .subtitle {
      color: rgba(255,255,255,0.7);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    
    .journal-meta {
      padding: 20px 40px;
      background: #fafafa;
      border-bottom: 1px solid #e0e0e0;
      font-size: 0.875rem;
      color: #666;
      display: flex;
      justify-content: space-between;
    }
    
    .month-section {
      padding: 30px 40px;
    }
    
    .month-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      color: #2d1f3d;
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 2px solid #caa24a;
    }
    
    .entry {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(202, 162, 74, 0.3);
    }
    
    .entry-date {
      font-weight: 600;
      color: #2d1f3d;
    }
    
    .entry-time {
      font-size: 0.875rem;
      color: #888;
    }
    
    .entry-content {
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 16px;
      white-space: pre-wrap;
    }
    
    .entry-insight {
      background: linear-gradient(135deg, rgba(202, 162, 74, 0.1) 0%, rgba(147, 112, 219, 0.05) 100%);
      border-left: 3px solid #caa24a;
      padding: 16px 20px;
      border-radius: 0 8px 8px 0;
      margin-top: 16px;
    }
    
    .entry-insight-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #caa24a;
      margin-bottom: 8px;
    }
    
    .entry-insight-text {
      font-style: italic;
      color: #555;
      line-height: 1.7;
    }
    
    .entry-insight-context {
      margin-top: 12px;
      font-size: 0.875rem;
      color: #888;
    }
    
    .celestial-context {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .celestial-item {
      background: rgba(202, 162, 74, 0.1);
      padding: 4px 12px;
      border-radius: 100px;
      font-size: 0.75rem;
    }
    
    .journal-footer {
      padding: 30px 40px;
      text-align: center;
      background: #fafafa;
      border-top: 1px solid #e0e0e0;
      color: #888;
      font-size: 0.875rem;
    }
    
    .journal-footer .logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.25rem;
      color: #2d1f3d;
      margin-bottom: 8px;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .journal {
        box-shadow: none;
        border-radius: 0;
      }
      
      .month-section {
        page-break-before: always;
      }
      
      .month-section:first-child {
        page-break-before: auto;
      }
    }
  </style>
</head>
<body>
  <div class="journal">
    <header class="journal-header">
      <h1>✦ HEKA ✦</h1>
      <p class="subtitle">${title}</p>
    </header>
    
    <div class="journal-meta">
      <span>${sortedEntries.length} entries</span>
      <span>Exported ${new Date().toLocaleDateString()}</span>
    </div>
    
    ${Object.entries(grouped).map(([month, monthEntries]) => `
      <section class="month-section">
        <h2 class="month-title">${month}</h2>
        
        ${monthEntries.map(entry => `
          <article class="entry">
            <div class="entry-header">
              <span class="entry-date">${formatDate(entry.date)}</span>
              <span class="entry-time">${formatTime(entry.timestamp)}</span>
            </div>
            
            <div class="entry-content" style="${getThemeStyles(entry.theme || 'plain')} font-family: ${getFontFamily(entry.font || 'serif')}; font-size: 14px;">
              ${escapeHtml(entry.content).replace(/\n/g, '<br>')}
            </div>
            
            ${includeInsights && entry.insight ? `
              <div class="entry-insight">
                <div class="entry-insight-label">✨ Celestial Guidance</div>
                <p class="entry-insight-text">${escapeHtml(entry.insight.text)}</p>
                
                ${entry.celestialContext ? `
                  <div class="entry-insight-context">
                    <div class="celestial-context">
                      ${entry.celestialContext.moonPhase ? `
                        <span class="celestial-item">🌙 ${escapeHtml(String(entry.celestialContext.moonPhase.phase || entry.celestialContext.moonPhase))}</span>
                      ` : ''}
                    </div>
                  </div>
                ` : ''}
              </div>
            ` : ''}
          </article>
        `).join('')}
      </section>
    `).join('')}
    
    <footer class="journal-footer">
      <div class="logo">✦ HEKA ✦</div>
      <p>Where words and stars align</p>
      <p style="margin-top: 8px; font-size: 0.75rem;">
        Generated from HEKA Calendar Pro
      </p>
    </footer>
  </div>
</body>
</html>
  `;

  return html;
}

/**
 * Open the PDF export in a new window for printing/saving
 */
export function exportToPDFWindow(
  entries: DiaryEntry[],
  options: PDFExportOptions = {}
): void {
  const html = generateDiaryPDF(entries, options);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for styles to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } else {
    console.error('Failed to open print window - popup blocker?');
  }
}

export default {
  generateDiaryPDF,
  exportToPDFWindow,
};
