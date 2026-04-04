# HEKA Calendar Print System Configuration
## Multi-Size Template - A4, A3, Letter (Portrait & Landscape)

### Overview
This document describes the complete print system architecture for the HEKA Calendar's default template, supporting multiple paper sizes (A4, A3, Letter) in both Portrait and Landscape orientations. The system generates pixel-perfect PDFs with arc-themed styling.

---

## Architecture

### 1. Dimension System

All dimensions calculated at 150 DPI for crisp printing.

#### A4 Portrait
| Property | Value | Calculation |
|----------|-------|-------------|
| Page Width | 1240px | 210mm at 150 DPI |
| Page Height | 1754px | 297mm at 150 DPI |
| Content Width | 1170px | 1240 - (35×2) |
| Content Height | 1684px | 1754 - (35×2) |

#### A4 Landscape
| Property | Value | Calculation |
|----------|-------|-------------|
| Page Width | 1754px | 297mm at 150 DPI |
| Page Height | 1240px | 210mm at 150 DPI |
| Content Width | 1684px | 1754 - (35×2) |
| Content Height | 1170px | 1240 - (35×2) |

#### A3 Portrait
| Property | Value | Calculation |
|----------|-------|-------------|
| Page Width | 1754px | 297mm at 150 DPI |
| Page Height | 2480px | 420mm at 150 DPI |
| Content Width | 1684px | 1754 - (35×2) |
| Content Height | 2410px | 2480 - (35×2) |

#### A3 Landscape
| Property | Value | Calculation |
|----------|-------|-------------|
| Page Width | 2480px | 420mm at 150 DPI |
| Page Height | 1754px | 297mm at 150 DPI |
| Content Width | 2410px | 2480 - (35×2) |
| Content Height | 1684px | 1754 - (35×2) |

#### Letter Portrait
| Property | Value | Calculation |
|----------|-------|-------------|
| Page Width | 1275px | 8.5" at 150 DPI |
| Page Height | 1650px | 11" at 150 DPI |
| Content Width | 1205px | 1275 - (35×2) |
| Content Height | 1580px | 1650 - (35×2) |

#### Letter Landscape
| Property | Value | Calculation |
|----------|-------|-------------|
| Page Width | 1650px | 11" at 150 DPI |
| Page Height | 1275px | 8.5" at 150 DPI |
| Content Width | 1580px | 1650 - (35×2) |
| Content Height | 1205px | 1275 - (35×2) |

**Note:** Border Inset is consistently 35px (~6mm) on all sides across all sizes.

### 2. Critical Bug Fix: Landscape Rendering

#### Problem
Landscape mode was printing as portrait because:
1. The `@page` CSS was hardcoded to `A4 portrait`
2. The Android PrintAttributes defaulted to portrait
3. The print dialog didn't receive orientation information

#### Solution
**Frontend (PrintPreview.tsx):**
```typescript
// Dynamic @page rule
@page { size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'}; margin: 0; }

// Dynamic media query
@media print {
  html, body { 
    width: ${PAGE_WIDTH}px; 
    height: ${PAGE_HEIGHT}px; 
  }
}
```

**Android (HekaPrintPlugin.java):**
```java
// Pass paper size and orientation to print dialog
PrintAttributes.Builder builder = new PrintAttributes.Builder();
PrintAttributes.MediaSize mediaSize = getMediaSize(paperSize, orientation);
builder.setMediaSize(mediaSize);
builder.setMinMargins(new PrintAttributes.Margins(0, 0, 0, 0));

// Media size helper
private PrintAttributes.MediaSize getMediaSize(String paperSize, String orientation) {
    PrintAttributes.MediaSize baseSize;
    switch (paperSize) {
        case "A3": baseSize = PrintAttributes.MediaSize.ISO_A3; break;
        case "Letter": baseSize = PrintAttributes.MediaSize.NA_LETTER; break;
        case "A4":
        default: baseSize = PrintAttributes.MediaSize.ISO_A4; break;
    }
    return "landscape".equals(orientation) ? baseSize.asLandscape() : baseSize;
}
```

**TypeScript Interface:**
```typescript
printPDF(options: { 
  filePath: string; 
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
}): Promise<void>;
```

### 3. Dimension Helper System

**Frontend (PrintPreview.tsx):**
```typescript
function getPageDimensions(paperSize: string, isLandscape: boolean): { width: number; height: number } {
  switch (paperSize) {
    case 'A3':
      return isLandscape 
        ? { width: 2480, height: 1754 }  // A3 Landscape
        : { width: 1754, height: 2480 }; // A3 Portrait
    case 'Letter':
      return isLandscape
        ? { width: 1650, height: 1275 }  // Letter Landscape
        : { width: 1275, height: 1650 }; // Letter Portrait
    case 'A4':
    default:
      return isLandscape
        ? { width: 1754, height: 1240 }  // A4 Landscape
        : { width: 1240, height: 1754 }; // A4 Portrait
  }
}
```

**Android (HekaPrintPlugin.java):**
```java
// Pixel dimensions at 150 DPI for WebView rendering
private static final Map<String, PaperDimensions> PAPER_SIZES_PIXELS = new HashMap<>();
static {
    PAPER_SIZES_PIXELS.put("A4", new PaperDimensions(1240, 1754));    // 210x297mm
    PAPER_SIZES_PIXELS.put("A3", new PaperDimensions(1754, 2480));    // 297x420mm
    PAPER_SIZES_PIXELS.put("Letter", new PaperDimensions(1275, 1650)); // 8.5x11"
}
```

### 4. Styling Architecture

#### No Page Border Design
Previous versions had arc-colored borders around the entire page, causing:
- Alignment issues
- Inconsistent spacing
- Printer compatibility problems

**New Design:** Arc colors are applied to header elements only:
- `.month-print-header` - Arc-colored text and underline
- `.month-header` - Arc-colored border with tinted gradient background
- `.month-title` - Arc-colored text

#### Arc Color Coding
| Arc | Header Color | Background Gradient |
|-----|--------------|---------------------|
| Opening (Months 1-4) | `#dc2626` (Red) | `#fef2f2` → `#fee2e2` |
| Core (Months 5-9) | `#16a34a` (Green) | `#f0fdf4` → `#dcfce7` |
| Closing (Months 10-13) | `#7c3aed` (Purple) | `#f5f3ff` → `#ede9fe` |

#### Enhanced "The Modern HEKA Calendar" Header
```css
.month-print-header {
  font-size: 14px;        /* Increased from 10px */
  letter-spacing: 8px;    /* Increased from 4px */
  font-weight: 700;       /* Increased from 600 */
  border-bottom: 2px solid; /* Arc-colored */
}
```

#### Month Header Styling
```css
.month-header {
  border: 2px solid;      /* Arc-colored border */
  background: linear-gradient(135deg, [arc-tint] 0%, [arc-tint-darker] 100%);
  border-radius: 8px;
}
```

### 4. UX Flow

#### Generate Print Preview
1. Renders scaled preview (no file saved)
2. Scales to fit viewport: `transform: scale(calc((100vw - 40px) / PAGE_WIDTH))`
3. Shows in overlay modal

#### Download PDF
1. Generates PDF on-demand (not during preview)
2. Saves to `/storage/emulated/0/Download/HEKA_Calendar_*.pdf`
3. Shows toast notification: "PDF saved to Downloads"
4. Shows Android notification with "Tap to open"
5. Opens PDF viewer or share dialog

#### Print
1. Generates PDF if not already done
2. Opens Android Print Dialog
3. Respects orientation setting
4. Requires network connection

### 5. Technical Implementation

#### Frontend (PrintPreview.tsx)

**Dimension Constants:**
```typescript
const PAGE_WIDTH_PORTRAIT = 1240;
const PAGE_HEIGHT_PORTRAIT = 1754;
const PAGE_WIDTH_LANDSCAPE = 1754;
const PAGE_HEIGHT_LANDSCAPE = 1240;
const MONTH_VIEW_INSET = 35;
```

**Dynamic Override Function:**
```typescript
function getMonthViewOverrides(isLandscape: boolean = false): string {
  const pageWidth = isLandscape ? PAGE_WIDTH_LANDSCAPE : PAGE_WIDTH_PORTRAIT;
  const pageHeight = isLandscape ? PAGE_HEIGHT_LANDSCAPE : PAGE_HEIGHT_PORTRAIT;
  const contentWidth = pageWidth - (MONTH_VIEW_INSET * 2);
  const contentHeight = pageHeight - (MONTH_VIEW_INSET * 2);
  const cellWidth = Math.floor((contentWidth - 64 - 12) / 7);
  const cellHeight = isLandscape ? 130 : 155;
  
  // Returns CSS with dynamic values
}
```

**Wrap Page Function:**
```typescript
function wrapPage(
  content: string, 
  css: string, 
  isPreview: boolean = false, 
  isYearView: boolean = false, 
  isLandscape: boolean = false
): string
```

#### Android (HekaPrintPlugin.java)

**PDF Generation:**
```java
private void renderPageToPdf(
    String html, 
    PdfDocument pdfDocument, 
    int pageWidth,      // Dynamic based on orientation
    int pageHeight,     // Dynamic based on orientation
    PdfPageCallback callback
) {
    WebView webView = createPrintWebView(pageWidth, pageHeight);
    // ... measure, layout, capture to Picture, draw to PDF
}
```

**WebView Sizing:**
```java
private WebView createPrintWebView(int pageWidth, int pageHeight) {
    WebView webView = new WebView(getContext());
    webView.setLayoutParams(
        new LayoutParams(pageWidth, pageHeight)
    );
    // ... settings
}
```

**Print with Orientation:**
```java
private void printExistingPDF(
    File pdfFile, 
    String orientation,  // "portrait" or "landscape"
    PluginCall call
) {
    PrintAttributes.Builder builder = new PrintAttributes.Builder();
    if ("landscape".equals(orientation)) {
        builder.setMediaSize(PrintAttributes.MediaSize.ISO_A4.asLandscape());
    } else {
        builder.setMediaSize(PrintAttributes.MediaSize.ISO_A4);
    }
    // ... print
}
```

### 6. File Structure

```
src/
├── components/
│   └── PrintPreview.tsx          # Main print UI & HTML generation
├── services/
│   ├── PrintManager.ts           # TypeScript print interface
│   └── calendarService.ts        # Calendar data
android/
└── app/src/main/java/com/heka/calendar/
    └── HekaPrintPlugin.java      # Android PDF generation & printing
docs/
└── PRINT_SYSTEM_CONFIG.md        # This file
```

### 7. Key Implementation Details

#### MM to PX Replacement
The system aggressively replaces all mm values with px:
```typescript
let processedCSS = css
  .replace(/width:\s*\d+mm;?\s*height:\s*\d+mm;?/gi, `width: ${PAGE_WIDTH}px; height: ${PAGE_HEIGHT}px;`)
  .replace(/width:\s*195mm;?/gi, `width: ${PAGE_WIDTH}px`)
  .replace(/height:\s*285mm;?/gi, `height: ${PAGE_HEIGHT}px`);
```

#### Picture-based Rendering
WebView is captured to a `Picture` object before drawing to PDF:
```java
Picture picture = new Picture();
Canvas pictureCanvas = picture.beginRecording(pageWidth, pageHeight);
view.draw(pictureCanvas);
picture.endRecording();
canvas.drawPicture(picture);
```

This ensures clean, vector-accurate rendering without ongoing WebView updates.

#### Notification System
After PDF save:
```java
NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
    .setContentTitle("Calendar PDF saved")
    .setContentText(filename + " saved to Downloads")
    .setContentIntent(pendingIntent);  // Opens PDF on tap
```

### 8. Testing Checklist

- [ ] Portrait preview shows 1240×1754 scaled to fit
- [ ] Landscape preview shows 1754×1240 scaled to fit
- [ ] Portrait PDF prints at 1240×1754
- [ ] Landscape PDF prints at 1754×1240 (not portrait)
- [ ] Arc colors applied to headers only (no page border)
- [ ] "The Modern HEKA Calendar" larger with more letter spacing
- [ ] Download notification appears
- [ ] Print dialog respects orientation

### 9. Known Limitations

1. **Print Service Dependency**: Printing requires Google Cloud Print or Android Print Service
2. **PDF Viewer Requirement**: Opening PDF requires installed PDF viewer
3. **Storage Permission**: PDF saves to public Downloads folder
4. **150 DPI Fixed**: Resolution not configurable per device

### 10. Future Enhancements

Potential improvements for v2:
- Custom paper sizes (Letter, Legal)
- User-adjustable cell heights
- Photo/background support
- Multiple month layouts per page
- Theme system extension

---

## Changelog

### v2.0 (Current)
- Fixed landscape printing (critical bug fix)
- Removed page borders (design improvement)
- Added arc-colored header styling
- Enhanced "The Modern HEKA Calendar" typography
- Added notification system
- Separated preview from download actions

### v1.0
- Initial implementation
- Portrait only
- Page borders caused alignment issues

---

**DO NOT MODIFY** these settings without updating this documentation.
For other templates (minimalist, sacred geometry, etc.), create separate configurations.
