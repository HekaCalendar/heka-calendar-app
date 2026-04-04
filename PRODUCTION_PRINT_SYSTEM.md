# Production Print System for HEKA Calendar

This document describes the enterprise-grade print system architecture and implementation guide.

---

## 🎯 Overview

The production print system replaces the string-concatenation HTML generation with:

1. **Design Token-Based Theming** - Consistent, maintainable styles
2. **Component-Based Rendering** - React components instead of string templates
3. **True PDF Generation** - Client-side PDF creation with html2canvas + jsPDF
4. **Real PDF Preview** - PDF.js integration for accurate print preview
5. **Progress Tracking** - For large documents (year calendars)

---

## 📦 Installation

### 1. Install Dependencies

```bash
npm install html2canvas jspdf pdfjs-dist
```

### 2. Copy PDF.js Worker (Important!)

Copy the PDF.js worker to your public folder:

```bash
cp node_modules/pdfjs-dist/build/pdf.worker.min.js public/
```

Or update the worker URL in `PDFPreview.tsx` to use CDN.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ Print       │───▶│ Generate     │───▶│ PDF Preview      │   │
│  │ Options UI  │    │ Print        │    │ (PDF.js)         │   │
│  │             │    │ Document     │    │                  │   │
│  └─────────────┘    └──────────────┘    └────────┬─────────┘   │
│         │                                        │              │
│         │           Design Tokens                │              │
│         │           Component Rendering          ▼              │
│         │                              ┌──────────────────┐    │
│         │                              │ User Actions:    │    │
│         │                              │ • Print          │    │
│         │                              │ • Download PDF   │    │
│         │                              │ • Navigate pages │    │
│         │                              └──────────────────┘    │
│         │                                                       │
│         └───────────────────────────────────────────────────────┘
│                              HTML Generation
│                         (for browser print fallback)
│
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design Token System

### Available Themes

| Theme ID | Name | Description |
|----------|------|-------------|
| `default` | Elegant Gold | Premium gold design with arc colors |
| `minimalist` | Minimalist | Clean, modern, maximum whitespace |
| `sacred-geometry` | Sacred Geometry | Mystical dark theme with hexagons |

### Token Structure

```typescript
interface PrintTheme {
  id: string;
  name: string;
  colors: ColorPalette;        // All color values
  typography: TypographyScale; // Font families, sizes
  spacing: SpacingScale;       // Padding, margins, gaps
  effects: EffectTokens;       // Shadows, glows, radii
  layouts: {                   // Layout-specific configs
    yearCover: YearCoverLayout;
    monthPage: MonthPageLayout;
    dayCell: DayCellLayout;
  };
}
```

### Adding a New Theme

```typescript
// src/types/printThemes.ts
export const THEMES: Record<string, PrintTheme> = {
  myTheme: {
    id: 'my-theme',
    name: 'My Theme',
    description: 'Description here',
    preview: '🎨',
    
    colors: {
      primary: '#your-color',
      // ... all colors
    },
    
    typography: {
      display: { fontFamily: "'Your Font', serif", /* ... */ },
      // ... all typography
    },
    
    // ... rest of tokens
    
    layouts: {
      yearCover: { enabled: true, showArcs: true, /* ... */ },
      monthPage: { headerStyle: 'standard', /* ... */ },
      dayCell: { showMoonPhase: true, /* ... */ }
    }
  }
};
```

---

## 🔌 Usage Example

### Basic PDF Generation

```tsx
import { 
  PrintDocument, 
  generatePDF, 
  downloadPDF,
  THEMES 
} from './components/print';

// In your component:
const handleGeneratePDF = async () => {
  // 1. Get your calendar data
  const yearData = prepareYearData(year, options, notes, location);
  
  // 2. Select theme
  const theme = THEMES['default'];
  
  // 3. Generate HTML (for preview or direct print)
  const html = ReactDOMServer.renderToStaticMarkup(
    <PrintDocument 
      yearData={yearData}
      theme={theme}
      options={options}
    />
  );
  
  // 4. Generate actual PDF blob
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  
  const pdfBlob = await generatePDF(container, {
    filename: `HEKA-Calendar-${year}`,
    paperSize: options.paperSize,
    orientation: options.orientation,
    quality: 2
  });
  
  document.body.removeChild(container);
  
  // 5. Show PDF preview or download
  setPdfBlob(pdfBlob);
};
```

### With Progress Tracking (Year Documents)

```tsx
import { generatePDFWithProgress } from './components/print';

const handleGenerateWithProgress = async () => {
  const yearData = prepareYearData(year, options, notes, location);
  const pages = yearData.months.map((month, i) => {
    // Create individual page elements
    const container = document.createElement('div');
    // ... render month page
    return container;
  });
  
  const pdfBlob = await generatePDFWithProgress(
    pages,
    {
      filename: `HEKA-${year}`,
      paperSize: 'A4',
      orientation: 'portrait',
      quality: 2
    },
    (current, total) => {
      setProgress(Math.round((current / total) * 100));
    }
  );
};
```

### Real PDF Preview

```tsx
import { PDFPreview } from './components/print';

// Show preview modal
{pdfBlob && (
  <PDFPreview
    printJob={{
      id: 'job-1',
      filename: 'HEKA-2026.pdf',
      status: 'completed',
      progress: 100,
      totalPages: 14,
      completedPages: 14,
      blob: pdfBlob
    }}
    onClose={() => setPdfBlob(null)}
    onPrint={() => window.print()}
    onDownload={() => downloadPdfBlob(pdfBlob, 'HEKA-2026.pdf')}
  />
)}
```

---

## 🎭 Theme Configuration

### Layout Options

```typescript
// Year Cover
{
  enabled: boolean;           // Show year cover page
  showArcs: boolean;          // Show three arcs section
  showWeekdayLegend: boolean; // Show weekday explanation
  backgroundStyle: 'gradient' | 'solid' | 'pattern';
}

// Month Page
{
  headerStyle: 'standard' | 'minimal' | 'banner';
  showArcIndicator: boolean;  // Show "OPENING/CORE/CLOSING ARC" badge
  showCivilRange: boolean;    // Show "Apr 1 - Apr 28" range
  gridStyle: 'standard' | 'compact' | 'spacious';
}

// Day Cell
{
  showMoonPhase: boolean;
  showCivilDate: boolean;
  showNoteIndicators: boolean;
  maxNotesVisible: number;    // 2, 3, etc.
  noteDisplayStyle: 'badge' | 'dot' | 'full';
}
```

---

## 📱 Mobile Considerations

### Android (Capacitor)

Use the existing `AndroidPrint` interface for native printing:

```typescript
// Already implemented in PrintRenderer.tsx
if (window.AndroidPrint) {
  window.AndroidPrint.printHtml(html);
}
```

### iOS

Safari handles PDF generation well. For native printing:

```typescript
// Use AirPrint via Capacitor Share plugin
import { Share } from '@capacitor/share';

const sharePdf = async (blob: Blob) => {
  const file = new File([blob], 'calendar.pdf', { type: 'application/pdf' });
  await Share.share({
    files: [file],
    title: 'HEKA Calendar'
  });
};
```

---

## ⚡ Performance Optimizations

### 1. Lazy Loading

```tsx
const PDFPreview = lazy(() => import('./components/print/PDFPreview'));
```

### 2. Worker-Based PDF Generation (Advanced)

For very large documents, move PDF generation to a Web Worker:

```typescript
// pdfWorker.ts
self.onmessage = async (e) => {
  const { html, options } = e.data;
  const pdf = await generatePDFInWorker(html, options);
  self.postMessage({ blob: pdf }, [pdf]);
};
```

### 3. Debounced Preview

Don't regenerate PDF on every option change:

```typescript
const debouncedGenerate = useDebouncedCallback(generatePDF, 500);
```

---

## 🔧 Migration from Old System

### Old Way (String Concatenation)

```typescript
// ❌ DON'T DO THIS
let html = `<div class="month">`;
html += `<h2>${month.name}</h2>`;
// ... hundreds of lines of string concatenation
```

### New Way (Component-Based)

```typescript
// ✅ DO THIS
<MonthPage 
  monthData={monthData}
  theme={theme}
  options={options}
/>
```

### Step-by-Step Migration

1. **Install dependencies** (see Installation)
2. **Create new print options UI** using the component structure
3. **Migrate themes** to design token format
4. **Replace HTML generation** with `PrintDocument` component
5. **Add PDF preview** using `PDFPreview` component
6. **Test thoroughly** across different browsers
7. **Remove old string-based templates**

---

## 🧪 Testing Checklist

- [ ] All themes render correctly
- [ ] Portrait and landscape orientations work
- [ ] Year and month modes work
- [ ] PDF downloads correctly
- [ ] Print dialog opens correctly
- [ ] Preview navigation (next/prev page) works
- [ ] Zoom controls work
- [ ] Mobile (Android/iOS) printing works
- [ ] Progress indicator shows for year documents
- [ ] Error handling works (cancelled renders, etc.)

---

## 📝 Browser Support

| Feature | Chrome | Firefox | Safari | Edge | iOS Safari |
|---------|--------|---------|--------|------|------------|
| html2canvas | ✅ | ✅ | ✅ | ✅ | ✅ |
| jsPDF | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| PDF.js | ✅ | ✅ | ✅ | ✅ | ✅ |
| Print API | ✅ | ✅ | ✅ | ✅ | ⚠️ |

*Note: iOS Safari has limitations with PDF downloads - use Share API instead.*

---

## 🤝 Contributing

When adding new themes:

1. Define all design tokens completely
2. Test at multiple scales (75%, 100%, 150%)
3. Test both portrait and landscape
4. Verify print accuracy (colors, fonts, spacing)
5. Add theme to `AVAILABLE_THEMES` export

---

## 📄 License

Part of the HEKA Calendar project.
