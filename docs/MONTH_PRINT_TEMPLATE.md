# HEKA Calendar - Month Print Template (A4 Portrait)

**Status**: ✅ PRODUCTION READY - DO NOT MODIFY

This document captures the exact CSS and configuration for the working month print template.

## Dimensions

| Property | Value |
|----------|-------|
| Page Size (CSS) | 195mm × 285mm |
| Page Size (PDF px) | 1000px × 1460px |
| Margin | 6mm (30px in PDF) |
| Border | 3px solid (arc color) |
| Cell Height | 160px |

## Key CSS Selectors

```css
/* Month Page Container */
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

/* Arc Color Borders - All 4 sides */
.month-page[data-arc="opening"] { border: 3px solid #dc2626; }
.month-page[data-arc="core"] { border: 3px solid #16a34a; }
.month-page[data-arc="closing"] { border: 3px solid #7c3aed; }

/* Header */
.month-header { 
  margin-bottom: 16px; 
  padding: 16px 24px;
  text-align: center;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-radius: 6px;
  border: 1px solid #eaeaea;
}

.month-title { 
  font-family: Georgia, serif; 
  font-size: 52px; 
  font-weight: 600; 
  margin: 0 0 8px 0;
  color: #1a1a1a;
  letter-spacing: 5px;
}

.month-page[data-arc="opening"] .month-title { color: #b91c1c; }
.month-page[data-arc="core"] .month-title { color: #15803d; }
.month-page[data-arc="closing"] .month-title { color: #7c3aed; }

.month-subtitle { 
  font-size: 12px; 
  letter-spacing: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.month-page[data-arc="opening"] .month-subtitle { color: #dc2626; }
.month-page[data-arc="core"] .month-subtitle { color: #16a34a; }
.month-page[data-arc="closing"] .month-subtitle { color: #7c3aed; }

/* Day of Week Header */
.dow-row { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  gap: 2px; 
  margin-bottom: 8px;
  background: #f5f5f5;
  padding: 6px 2px;
  border-radius: 2px;
}

.dow-row span { 
  text-align: center; 
  font-size: 9px; 
  font-weight: 700; 
  color: #444;
  text-transform: uppercase; 
  letter-spacing: 1.5px; 
  padding: 4px 2px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.dow-row span:first-child,
.dow-row span:last-child { color: #999; }

/* Calendar Grid */
.calendar-grid { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  grid-auto-rows: 160px;
  gap: 2px; 
}

/* Day Cells */
.day-cell { 
  background: #fff; 
  border: 1px solid #e0e0e0; 
  border-radius: 2px; 
  height: 160px;
  padding: 8px 10px; 
  display: flex; 
  flex-direction: column;
  font-size: 11px;
  overflow: hidden;
}

.day-cell--empty { 
  background: #f9f9f9; 
  border-color: #eaeaea; 
}

/* Cell Content */
.day-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: 4px; 
  line-height: 1;
}

.day-number { 
  font-size: 18px; 
  font-weight: 600; 
  color: #333;
  font-family: Georgia, serif;
}

.moon-phase { 
  font-size: 14px; 
  opacity: 0.7;
}

.civil-date { 
  font-size: 9px; 
  color: #aaa; 
  margin-bottom: 4px; 
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.notes-area { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  gap: 2px;
  overflow: hidden;
}

.note-box { 
  background: #f8f8f8; 
  border-radius: 3px; 
  padding: 3px 5px; 
  font-size: 9px;
  color: #555;
  line-height: 1.2;
  border-left: 2px solid #c9a227;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.holiday { 
  margin-top: 3px; 
  padding: 3px 5px; 
  background: rgba(220, 38, 38, 0.06); 
  border-radius: 3px; 
  font-size: 8px;
  line-height: 1.2;
  color: #c41e3a; 
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.3px;
}
```

## PDF Generation (TypeScript)

```typescript
// For PDF generation
return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1000, initial-scale=1.0">
<style>
@page { size: A4; margin: 0; }
* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
body { margin: 0; padding: 0; background: white; width: 1000px; height: 1460px; overflow: hidden; }
.page-wrapper { width: 1000px; height: 1460px; position: relative; overflow: hidden; background: #fefefe; }
${css.replace(/width: 195mm;?\s*height: 285mm;?/g, 'width: 1000px; height: 1460px;')
     .replace(/margin: 6mm auto;?/g, 'margin: 30px auto;')}
</style>
</head>
<body>
<div class="page-wrapper">
${content}
</div>
</body>
</html>`;
```

## Android PDF Dimensions

```java
// A4 content area at 144 DPI
private static final int PAGE_WIDTH_PX = 1000;  // ~195mm
private static final int PAGE_HEIGHT_PX = 1460; // ~285mm
```

## Visual Characteristics

- **Border**: 3px solid arc color on all 4 sides (red/green/purple)
- **Inset**: Equal 6mm margin from all A4 page edges
- **Header**: Large 52px title with arc-colored subtitle
- **Cells**: 160px height, clean borders, proper content spacing
- **Overall**: Professional, balanced, premium appearance

## Notes for Year View Implementation

When implementing year view:
1. Use SEPARATE CSS selectors (e.g., `.year-month-page`)
2. Do NOT modify `.month-page` or any selectors above
3. Year view may need different dimensions (smaller cells, 13 pages)
4. Consider using `scale()` for year view to fit more content

---
**Last Updated**: 2026-02-12
**Template Version**: 1.0
