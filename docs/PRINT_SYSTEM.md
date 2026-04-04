# HEKA Calendar Print System Documentation

This document describes the complete print system architecture for the HEKA Calendar application. Refer to this when implementing print functionality for other calendars or troubleshooting print-related issues.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Print Flow](#print-flow)
4. [Frontend Implementation](#frontend-implementation)
5. [Android Native Implementation](#android-native-implementation)
6. [CSS Architecture](#css-architecture)
7. [Key Classes & Selectors](#key-classes--selectors)
8. [Common Pitfalls](#common-pitfalls)
9. [Testing Checklist](#testing-checklist)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRINT ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────────┐ │
│  │   React UI   │────▶│   WebView    │────▶│ Android Print   │ │
│  │  PrintPreview│     │   (iframe)   │     │   Activity      │ │
│  └──────────────┘     └──────────────┘     └─────────────────┘ │
│         │                    │                      │           │
│         ▼                    ▼                      ▼           │
│  ┌──────────────┐     ┌──────────────┐     ┌─────────────────┐ │
│  │ generateHTML │     │  Native JS   │────▶│ PrintManager    │ │
│  │   (CSS+HTML) │     │  Interface   │     │  (System)       │ │
│  └──────────────┘     └──────────────┘     └─────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Components:**
- **Frontend**: React + TypeScript generates HTML/CSS for print preview
- **WebView**: Android WebView renders the HTML for preview
- **Native Bridge**: JavaScript interface (`AndroidPrint`) triggers native print
- **Print Activity**: Android Activity handles system print dialog

---

## File Structure

```
heka-calendar-pro/
├── src/
│   └── components/
│       └── PrintPreview.tsx          # Main print component (CSS + HTML gen)
├── android/
│   └── app/
│       └── src/
│           └── main/
│               └── java/
│                   └── com/heka/calendar/
│                       ├── MainActivity.java    # JS interface + orientation detection
│                       └── PrintActivity.java   # Native print execution
└── docs/
    └── PRINT_SYSTEM.md               # This file
```

---

## Print Flow

### 1. User Initiates Print
```typescript
// PrintPreview.tsx
const handlePrint = () => {
  const printHtml = generateCalendarHTML(mode, viewDate, options, notes, location, theme.colors);
  
  if (window.AndroidPrint) {
    // Native Android print
    window.AndroidPrint.printHtml(printHtml);
  } else {
    // Browser print (desktop)
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printHtml);
    printWindow.document.close();
    printWindow.print();
  }
};
```

### 2. HTML Generation
The `generateCalendarHTML()` function creates a complete HTML document with:
- Embedded CSS for both screen and print media
- Calendar content (year cover + 13 month pages)
- JavaScript for close/print handlers

### 3. Native Bridge (MainActivity.java)
```java
@JavascriptInterface
public void printHtml(String html) {
    // CRITICAL: Detect orientation from @page rule, not class names
    String orientation = "portrait";
    if (html != null && html.contains("A4 landscape")) {
        orientation = "landscape";
    }
    
    Intent intent = new Intent(MainActivity.this, PrintActivity.class);
    intent.putExtra("html", html);
    intent.putExtra("orientation", orientation);
    startActivity(intent);
}
```

### 4. Print Execution (PrintActivity.java)
```java
PrintAttributes.Builder builder = new PrintAttributes.Builder();
if ("landscape".equals(orientation)) {
    builder.setMediaSize(PrintAttributes.MediaSize.ISO_A4.asLandscape());
} else {
    builder.setMediaSize(PrintAttributes.MediaSize.ISO_A4);
}
builder.setMinMargins(PrintAttributes.Margins.NO_MARGINS);
printManager.print(jobName, adapter, builder.build());
```

---

## Frontend Implementation

### HTML Structure
```html
<div class="output-preview">
  <div class="output-controls">
    <!-- Close and Print buttons -->
  </div>
  <div class="output-content ${landscape ? 'landscape-output' : ''}">
    <div class="output-container">
      
      <!-- Year Cover -->
      <div class="year-cover">
        <!-- Cover content -->
      </div>
      
      <!-- Month Pages (13x) -->
      <div class="month-page ${landscapeClass}" data-arc="${arc}">
        <div class="month-print-header">...</div>
        <div class="month-header">
          <div class="month-title">...</div>
          <div class="month-subtitle">...</div>
        </div>
        <div class="dow-row">
          <span>Saturday</span> ... <span>Friday</span>
        </div>
        <div class="calendar-grid">
          <div class="day-cell">...</div>
          <!-- 35-42 cells per month -->
        </div>
      </div>
      
    </div>
  </div>
</div>
```

### Dynamic CSS Generation
The CSS is generated as a template string with interpolated values:

```typescript
const landscapeClass = options.orientation === 'landscape' 
  ? 'landscape-wide landscape-wide'  // Double for specificity
  : '';

const html = `
  <style>
    /* Screen styles */
    .output-container {
      max-width: ${options.orientation === 'portrait' ? '900px' : '1400px'};
      margin: 0 auto;
      ${options.orientation === 'landscape' ? 'min-width: 1200px;' : ''}
    }
    
    /* Landscape preview - wider page */
    ${options.orientation === 'landscape' ? `
    .output-content {
      overflow-x: auto !important;
    }
    .month-page.landscape-wide.landscape-wide {
      width: 1100px;  /* Fixed width for preview */
      min-height: 780px;
      margin: 0 auto;
    }
    ` : ''}
    
    @media print {
      @page { size: ${options.paperSize} ${options.orientation}; margin: 8mm; }
      
      /* Reset for print */
      .output-container { max-width: none; }
      .landscape-output .output-container { 
        max-width: none !important; 
        min-width: auto !important; 
        width: 100% !important; 
      }
    }
  </style>
`;
```

---

## Android Native Implementation

### MainActivity.java
**Purpose**: JavaScript interface and orientation detection

```java
public class MainActivity extends BridgeActivity {
    
    public class PrintInterface {
        @JavascriptInterface
        public void printHtml(String html) {
            // CRITICAL: Use "A4 landscape" not just "landscape"
            // The CSS class "landscape-wide" exists in BOTH orientations!
            String orientation = "portrait";
            if (html != null && html.contains("A4 landscape")) {
                orientation = "landscape";
            }
            
            Intent intent = new Intent(MainActivity.this, PrintActivity.class);
            intent.putExtra("html", html);
            intent.putExtra("orientation", orientation);
            intent.putExtra("jobName", "HEKA Calendar");
            startActivity(intent);
        }
    }
    
    @Override
    public void onCreate(Bundle savedInstance) {
        super.onCreate(savedInstance);
        WebView webView = getBridge().getWebView();
        webView.addJavascriptInterface(new PrintInterface(), "AndroidPrint");
        // ... other config
    }
}
```

### PrintActivity.java
**Purpose**: Load HTML and trigger system print dialog

```java
public class PrintActivity extends Activity {
    private WebView webView;
    private static final int DELAY_MS = 500;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        String html = getIntent().getStringExtra("html");
        String orientation = getIntent().getStringExtra("orientation");
        String jobName = getIntent().getStringExtra("jobName");
        
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                handler.postDelayed(() -> doPrint(), DELAY_MS);
            }
        });
        
        webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
    }
    
    private void doPrint() {
        PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
        PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(jobName);
        
        PrintAttributes.Builder builder = new PrintAttributes.Builder();
        if ("landscape".equals(orientation)) {
            builder.setMediaSize(PrintAttributes.MediaSize.ISO_A4.asLandscape());
        } else {
            builder.setMediaSize(PrintAttributes.MediaSize.ISO_A4);
        }
        builder.setMinMargins(PrintAttributes.Margins.NO_MARGINS);
        
        printManager.print(jobName, adapter, builder.build());
    }
}
```

---

## CSS Architecture

### Media Query Structure
```css
/* ===== SCREEN STYLES (Preview) ===== */
.output-content { ... }
.output-container { ... }
.month-page { ... }

/* Landscape-specific screen styles */
.month-page.landscape-wide.landscape-wide {
  width: 1100px;  /* Fixed for preview scrolling */
}

/* ===== PRINT STYLES ===== */
@media print {
  @page { size: A4 portrait; margin: 8mm; }
  
  /* Reset container for print */
  .output-container { max-width: none; }
  
  /* Landscape-specific print overrides */
  .landscape-output .output-container {
    width: 100% !important;
    min-width: auto !important;
  }
  
  .month-page.landscape-wide.landscape-wide {
    width: 100% !important;  /* Override 1100px */
    padding: 6px 4px !important;
    border: none !important;
  }
}
```

### Arc Theme System
Months are color-coded by arc type using `data-arc` attribute:

```css
/* Opening Arc (April) - Red */
.month-page[data-arc="opening"] { border-top: 6px solid #dc2626; }
.month-page[data-arc="opening"] .month-print-header { color: #dc2626; }
.month-page[data-arc="opening"] .dow-row { background: rgba(220, 38, 38, 0.08); }

/* Core Arc (May-Dec) - Green */
.month-page[data-arc="core"] { border-top: 6px solid #16a34a; }
.month-page[data-arc="core"] .month-print-header { color: #16a34a; }
.month-page[data-arc="core"] .dow-row { background: rgba(22, 163, 74, 0.08); }

/* Closing Arc (Jan-Mar) - Purple */
.month-page[data-arc="closing"] { border-top: 6px solid #7c3aed; }
.month-page[data-arc="closing"] .month-print-header { color: #7c3aed; }
.month-page[data-arc="closing"] .dow-row { background: rgba(124, 58, 237, 0.08); }
```

### Specificity Strategy
Use double-class selector for landscape overrides:
```css
/* Base style */
.month-page { padding: 30px; }

/* Landscape override (higher specificity) */
.month-page.landscape-wide.landscape-wide {
  padding: 24px 40px;
}
```

---

## Key Classes & Selectors

### Container Classes
| Class | Purpose |
|-------|---------|
| `.output-preview` | Root wrapper for print preview UI |
| `.output-controls` | Header with Close/Print buttons |
| `.output-content` | Scrollable content area |
| `.output-container` | Centered content wrapper (max-width) |
| `.landscape-output` | Added to `.output-content` in landscape mode |

### Calendar Classes
| Class | Purpose |
|-------|---------|
| `.year-cover` | First page with year info |
| `.month-page` | Individual month container |
| `.landscape-wide.landscape-wide` | Double class for landscape specificity |
| `.month-print-header` | "The Modern HEKA Calendar" header |
| `.month-header` | Month title and subtitle container |
| `.dow-row` | Day of week header (Sat-Fri) |
| `.calendar-grid` | 7-column grid for days |
| `.day-cell` | Individual day container |
| `.day-number` | Heka day number (1-28) |
| `.heka-date` | Heka month/year text |
| `.civil-date` | Gregorian date text |
| `.day-notes` | Notes container |
| `.note-box` | Individual note item |
| `.holiday` | Holiday/observance marker |

### Data Attributes
| Attribute | Values | Purpose |
|-----------|--------|---------|
| `data-arc` | `opening`, `core`, `closing` | Arc theme color coding |

---

## Common Pitfalls

### 1. Orientation Detection Bug
**WRONG:**
```java
if (html.contains("landscape"))  // Matches "landscape-wide" CSS class!
```

**CORRECT:**
```java
if (html.contains("A4 landscape"))  // Only matches @page rule
```

### 2. CSS Specificity Issues
Screen styles use fixed widths that must be overridden in print:
```css
/* Screen - fixed width for preview */
.month-page.landscape-wide.landscape-wide { width: 1100px; }

/* Print - must override! */
@media print {
  .month-page.landscape-wide.landscape-wide { 
    width: 100% !important;  /* Don't forget !important */
  }
}
```

### 3. Container Width Bleed
The `.output-container` has different constraints in screen vs print:
- **Screen**: `max-width: 900px` (portrait) or `min-width: 1200px` (landscape)
- **Print**: Must reset both with `!important` for landscape only

### 4. Page Break Issues
Always use `page-break-after: always` for multi-page output:
```css
.month-page, .year-cover {
  page-break-after: always;
}
.month-page:last-child {
  page-break-after: auto;  /* Don't break after last page */
}
```

### 5. WebView Load Timing
HTML must be fully rendered before printing:
```java
webView.setWebViewClient(new WebViewClient() {
    @Override
    public void onPageFinished(WebView view, String url) {
        handler.postDelayed(() -> doPrint(), 500);
    }
});
```

---

## Testing Checklist

### Portrait Mode
- [ ] All 7 columns visible (Sat-Fri)
- [ ] All 5-6 rows visible
- [ ] Page breaks after each month
- [ ] Arc colors correct (Jan-Mar purple, Apr red, May-Dec green)
- [ ] Header text centered
- [ ] No horizontal overflow

### Landscape Mode
- [ ] All 7 columns visible (Sat-Fri)
- [ ] Friday column not cut off
- [ ] Content centered on page
- [ ] Page breaks after each month
- [ ] Arc colors correct
- [ ] Grid fits within page boundaries

### Native Print (Android)
- [ ] Portrait detected correctly
- [ ] Landscape detected correctly
- [ ] Print dialog shows correct paper size
- [ ] PDF output matches preview

### Browser Print (Desktop)
- [ ] Print preview shows correct layout
- [ ] Paper size matches selection
- [ ] No browser-specific styling issues

---

## Implementation Notes for Other Calendars

When implementing print for a new calendar type:

1. **Copy the structure** from `PrintPreview.tsx`
2. **Keep the CSS architecture** (screen vs print media queries)
3. **Use the same Android native code** (MainActivity.java, PrintActivity.java)
4. **Test both orientations** thoroughly
5. **Verify orientation detection** in MainActivity.java works with your HTML

The key is generating HTML with embedded CSS that works in both preview (screen) and print modes, then using the Android native bridge to trigger system print with correct orientation.

### Theme-Specific Requirements (for PrintThemes.tsx)

Themes in `PrintThemes.tsx` are **self-contained** and must include ALL necessary CSS themselves:

```typescript
function generateThemeName(data: YearData, options: PrintOptions): string {
  // 1. Check orientation
  const isLandscape = options.orientation === 'landscape';
  const landscapeClass = isLandscape ? 'landscape-wide landscape-wide' : '';
  
  return `
    <style>
      /* 2. Base styles */
      .theme-month { ... }
      
      /* 3. Arc colors via data-arc attribute */
      .theme-month[data-arc="opening"] .theme-header { border-color: #dc2626; }
      .theme-month[data-arc="core"] .theme-header { border-color: #16a34a; }
      .theme-month[data-arc="closing"] .theme-header { border-color: #7c3aed; }
      
      /* 4. Landscape screen preview (conditional) */
      ${isLandscape ? `
      .theme-month.landscape-wide.landscape-wide {
        width: 1100px;
        min-height: 780px;
        margin: 0 auto;
      }
      ` : ''}
      
      @media print {
        /* 5. @page directive (CRITICAL for orientation detection) */
        @page { size: ${options.paperSize} ${options.orientation}; margin: 8mm; }
        
        /* 6. Print page breaks */
        .theme-month { page-break-after: always; }
        
        /* 7. Landscape print overrides (conditional) */
        ${isLandscape ? `
        .theme-month.landscape-wide.landscape-wide {
          width: 100% !important;
          max-width: 100% !important;
          padding: 6px 4px !important;
        }
        .theme-grid { gap: 2px !important; }
        ` : ''}
      }
    </style>
    
    <!-- 8. Apply landscape class and data-arc to HTML -->
    ${data.months.map(m => `
      <div class="theme-month ${landscapeClass}" data-arc="${m.arc.toLowerCase()}">
        ...
      </div>
    `).join('')}
  `;
}
```

**Critical Checklist for Theme Authors:**
- [ ] Read `options.orientation` and create `landscapeClass`
- [ ] Include `@page { size: A4 landscape/portrait }` directive
- [ ] Add landscape screen styles (1100px width for preview)
- [ ] Add landscape print overrides (100% width, reduced gaps)
- [ ] Use `data-arc` attribute for arc colors (not inline styles)
- [ ] Apply `landscape-wide landscape-wide` class to month containers
- [ ] Include `page-break-after: always` for pagination
- [ ] Test BOTH portrait and landscape before committing

---

## Version History

| Date | Change |
|------|--------|
| 2026-02-07 | Initial documentation created |
| 2026-02-07 | Fixed orientation detection bug (`contains("A4 landscape")` vs `contains("landscape")`) |
| 2026-02-07 | Fixed landscape width overflow (added `width: 100% !important` in print) |
| 2026-02-07 | Fixed Friday column cutoff (reduced gaps and padding) |
| 2026-02-07 | Integrated minimalist theme with full print system (orientation support, arc colors, landscape overrides) |
| 2026-02-07 | Fixed minimalist portrait horizontal scroll (removed `aspect-ratio: 1`, added width constraints) |
| 2026-02-07 | Added Portrait Mode CSS Requirements section documenting the aspect-ratio issue |
| 2026-02-07 | **CRITICAL FIX**: Fixed year print clipping - month pages now use orientation-aware heights (265mm portrait / 190mm landscape) with max-height constraints |

---

## Portrait Mode CSS Requirements

When implementing a print theme that supports portrait orientation, special care must be taken to ensure the 7-column grid fits within A4 portrait width without triggering horizontal scrolling.

### The Aspect-Ratio Problem

**DO NOT use `aspect-ratio: 1` on grid cells in portrait mode.**

```css
/* WRONG - Causes horizontal overflow in portrait */
.day-cell {
  aspect-ratio: 1;  /* Forces square cells that expand width */
}
```

```css
/* CORRECT - Portrait-safe cell sizing */
.day-cell {
  aspect-ratio: auto;        /* Remove square constraint */
  min-height: 80px;          /* Maintain consistent height instead */
}
```

### Required Portrait Screen Styles

```css
/* Portrait screen preview - prevent overflow */
${!isLandscape ? `
.theme-month {
  max-width: 900px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow: hidden;          /* Prevent content spill */
}

.theme-grid { 
  gap: 6px;                  /* Tighter gaps for portrait */
  width: 100%;               /* Constrain to container */
  max-width: 100%;
}

.theme-dow { 
  gap: 6px;
  width: 100%;
  max-width: 100%;
}

.theme-day { 
  aspect-ratio: auto;        /* Critical: remove square constraint */
  min-height: 80px;          /* Alternative height control */
}
` : ''}
```

### Required Portrait Print Styles

```css
@media print {
  @page { size: A4 portrait; margin: 8mm; }
  
  ${!isLandscape ? `
  /* Tighten gaps to fit 7 columns within ~190mm printable width */
  .theme-grid { gap: 4px !important; }
  .theme-dow { gap: 4px !important; }
  .theme-day { padding: 8px !important; }
  ` : ''}
}
```

### Why This Matters

- **A4 Portrait** has only ~190mm printable width after margins
- **7 columns** with gaps and padding must fit within this width
- **Aspect-ratio: 1** forces cells to expand horizontally to maintain square proportions
- **Result:** Grid overflows container → horizontal scrollbar appears

### Checklist for Portrait Themes

- [ ] Remove `aspect-ratio` from day cells in portrait mode
- [ ] Add `min-height` as alternative height control
- [ ] Constrain grid with `width: 100%` and `max-width: 100%`
- [ ] Add `overflow: hidden` to month container
- [ ] Use tighter gaps (4-6px) in portrait vs landscape (8px+)
- [ ] Test both orientations - portrait should NOT horizontally scroll

---

## Year Print Mode - Critical Height Requirements

When printing a full year (cover + 13 months), proper page height constraints are essential to prevent content clipping.

### The Height Mismatch Bug

**Problem:** Using a fixed `min-height: 265mm` for month pages in BOTH orientations causes clipping:
- **Portrait A4**: ~265mm printable height ✓ Works
- **Landscape A4**: ~190mm printable height ✗ Clipping!

```css
/* WRONG - Causes clipping in landscape */
.month-page {
  min-height: 265mm;  /* Too tall for landscape! */
  height: auto;
}
```

### Solution: CSS-Only Orientation Handling

Use the parent container class to target landscape mode without template literals:

```css
/* Base - Portrait heights */
.month-page {
  min-height: 265mm;
  height: auto;
  page-break-after: always;
}

/* Landscape - Shorter pages */
.landscape-output .month-page {
  min-height: 190mm !important;
  max-height: 190mm !important;
  height: 190mm !important;
  overflow: hidden !important;
  box-sizing: border-box !important;
}
```

### Why This Matters for Year Print

| Mode | Pages | Height per Page | Issue if Wrong |
|------|-------|-----------------|----------------|
| Month | 1 | Any height | No page break issues |
| Year | 14 | Must match paper | Content clipping |

In year mode, each month MUST fit on exactly one page. If the height is wrong:
- Content bleeds into next page
- Calendar grid gets cut off
- Bottom rows disappear

### Checklist for Year Print

- [ ] Cover uses orientation-aware height (265mm / 190mm)
- [ ] Month pages use `.landscape-output` parent class for landscape overrides
- [ ] Add `max-height` in landscape to prevent overflow
- [ ] Add `overflow: hidden` to clip excess content
- [ ] Add `box-sizing: border-box` for proper sizing
- [ ] Test year print in BOTH orientations
- [ ] Verify all 6 calendar rows are visible

---

**Maintainer**: Keep this document updated when making changes to the print system!
