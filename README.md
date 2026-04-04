# HEKA Calendar Pro

A professional-grade 13-month calendar application built with modern React, TypeScript, and Redux Toolkit. Features server-side PDF generation for reliable printing.

## Architecture Overview

```
heka-calendar-pro/
├── src/
│   ├── components/        # React components
│   ├── store/            # Redux state management
│   ├── services/         # Pure calendar logic
│   ├── types/            # TypeScript definitions
│   ├── styles/           # CSS styles
│   └── main.tsx          # Entry point
├── server/
│   └── print-server.js   # Puppeteer PDF generation
├── tests/                # Test suites
└── package.json
```

## Key Improvements Over Original

### 1. State Management

**Before:** Direct mutation, 50+ locations
```javascript
state.showMoonMonth = !state.showMoonMonth; // Scattered everywhere
```

**After:** Centralized Redux with actions
```typescript
dispatch(toggleDisplay('showMoonPhases')); // Single source of truth
```

### 2. Print System

**Before:** CSS `page-break` with timeouts
```javascript
setTimeout(() => window.print(), 1800); // Race conditions
```

**After:** Server-side PDF generation
```typescript
const pdf = await fetch('/api/print', { body: JSON.stringify(options) });
```

### 3. Type Safety

**Before:** No types, runtime errors
```javascript
function hekaToCivil(date) { /* no validation */ }
```

**After:** Full TypeScript coverage
```typescript
function hekaToCivil(date: HekaDate): Date { /* validated */ }
```

### 4. Component Architecture

**Before:** Single file, 7000+ lines, DOM manipulation
```javascript
// Direct DOM manipulation
calEl.innerHTML = ''; // Clears everything
```

**After:** React components with proper lifecycle
```typescript
// Declarative, efficient updates
<CalendarGrid days={days} onDayClick={handleClick} />
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start print server (in another terminal)
npm run server

# Build for production
npm run build
```

### Print Server Setup

The print server requires Puppeteer with Chromium:

```bash
# Puppeteer installs Chromium automatically
npm install puppeteer

# Start the print server
node server/print-server.js
```

## Professional Features

### 1. Server-Side PDF Generation
- **Technology:** Puppeteer + headless Chrome
- **Reliability:** 100% consistent page breaks
- **Mobile Support:** Works identically on all devices
- **Quality:** Vector graphics, selectable text

### 2. State Persistence
- Notes saved to localStorage
- Display preferences restored
- No data loss on refresh

### 3. Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible

### 4. Performance
- Memoized selectors prevent unnecessary renders
- Component-level code splitting ready
- Optimized bundle with manual chunks

## API Endpoints

### POST /api/print
Generate a PDF print job.

```typescript
interface GeneratePdfRequest {
  mode: 'month' | 'year';
  year: number;
  month?: number; // Required for month mode
  options: {
    includeNotes: boolean;
    includeMoonPhases: boolean;
    includeCivilDates: boolean;
    paperSize: 'A4' | 'Letter';
    orientation: 'portrait' | 'landscape';
  };
}
```

### GET /api/print/:jobId/status
Check job status.

### GET /api/download/:jobId
Download completed PDF.

## Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage
```

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Print Server (Render/Heroku)
```bash
# Set environment variables
NODE_ENV=production
PORT=3001

# Deploy server/ folder
```

## Comparison: Old vs New

| Feature | Original | Professional |
|---------|----------|--------------|
| **Lines of Code** | 7,185 (single file) | ~2,500 (modular) |
| **State Management** | Direct mutation | Redux Toolkit |
| **Type Safety** | None | Full TypeScript |
| **Print System** | CSS page-break (broken) | Puppeteer PDF (reliable) |
| **Testing** | None | Vitest ready |
| **Mobile Print** | 1.8s timeout hack | Server-side render |
| **Event Cleanup** | Memory leaks | Proper unmount |
| **CSS** | !important wars | CSS variables |

## Calendar Calculations

All calendar math is pure functions in `services/calendarService.ts`:

```typescript
// Pure function - same input, same output
export function getDaysInMonth(year: number, month: HekaMonthIndex): number {
  if (month === 12) { // Hinge month
    return isGregorianLeapYear(year + 1) ? 29 : 28;
  }
  return 28;
}

// No side effects, testable
export function hekaToCivil(hekaDate: HekaDate): Date {
  // ... calculation
}
```

## License

MIT

## Credits

Rebuilt from the ground up based on the original HEKA Calendar concept.
