# HEKA Oracle Diary System

A celestial journaling experience that connects your words with the wisdom of the stars.

## Features

### ✨ Oracle Engine
- **Content Analysis**: 200+ keyword mappings across 14 archetypes
- **Celestial Context**: Real-time moon phase, planetary positions
- **Birth Chart Integration**: Personal transits and house activations
- **Insight Generation**: AI-powered guidance based on celestial synchronicity

### 📖 Dual Journal Modes
- **Timeline View**: Chronological browsing with celestial context
- **Editor**: Rich writing experience with 6 themes and 6 fonts
- **Auto-save**: Automatic draft preservation

### ✦ Personal Transits
- **Transit Timeline**: Visual calendar of upcoming transits
- **Strength Scoring**: 0-100 scoring based on orb precision
- **House Activations**: Whole Sign house system
- **Chart Ruler Tracking**: Ascendant ruler status and aspects
- **Real-time Notifications**: Alerts for significant transits

### 🔍 Search & Discovery
- **Full-text Search**: Search across all entries and insights
- **Filter Options**: With insights, highly rated, date ranges
- **Highlighted Results**: Search term highlighting

### 📄 Export
- **PDF Generation**: Beautiful formatted exports
- **Theme Preservation**: Your chosen theme in the export
- **Insight Inclusion**: Optional insight export

## Architecture

```
src/oracle/
├── oracleEngine.ts           # Core insight generation
├── birthChartIntegration.ts  # Personal transit calculations
├── diaryTypes.ts             # Type definitions
└── README.md                 # This file

src/components/
├── DiaryPage.tsx             # Main diary interface
├── JournalEditor.tsx         # Writing interface
├── JournalSettings.tsx       # Theme/font settings
├── InsightDisplay.tsx        # Insight visualization
├── DiaryTimeline.tsx         # Entry timeline
├── TransitTimeline.tsx       # Transit calendar
├── TransitNotifications.tsx  # Real-time alerts
├── DiarySearch.tsx           # Full-text search
└── DiaryMobileNav.tsx        # Mobile navigation

src/hooks/
└── useDiary.ts               # React hooks for diary operations
```

## Usage

### Basic Usage

```tsx
import { DiaryPage } from './components/diary';

function App() {
  return <DiaryPage />;
}
```

### With Birth Chart

```tsx
import { useSelector } from 'react-redux';
import { calculatePersonalTransits } from './oracle/birthChartIntegration';

const birthChart = useSelector(state => 
  state.calendar.astroProfiles.find(p => p.id === selectedId)?.natalChart
);

const transits = calculatePersonalTransits(birthChart, currentPositions);
```

### Custom Hooks

```tsx
import { useDiaryEntries, useDiaryStats } from './components/diary';

function MyComponent() {
  const { entries, create, update } = useDiaryEntries();
  const stats = useDiaryStats();
  
  return (
    <div>
      <p>Total entries: {stats.totalEntries}</p>
      <p>Current streak: {stats.currentStreak} days</p>
    </div>
  );
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save entry |
| `Ctrl/Cmd + K` | Open search |
| `Escape` | Close modals |

## Themes

### Journal Themes
- **Lined**: Classic notebook with blue lines
- **Plain**: Clean white space
- **Grid**: Dot grid for bullet journaling
- **Night**: Dark mode for evening writing
- **Parchment**: Aged paper with vintage feel
- **Celestial**: Deep indigo with subtle stars

### Fonts
- **Serif**: Classic, academic, timeless
- **Clean**: Modern, crisp, professional
- **Handwritten**: Personal, intimate, warm
- **Typewriter**: Retro, raw, authentic
- **Elegant**: Refined, luxurious, poetic
- **Journal**: Friendly, approachable, casual

## API Reference

### Oracle Engine

```typescript
// Analyze content for themes
const themes = OracleEngine.analyzeContent(content);

// Get current celestial state
const celestialState = await OracleEngine.getCurrentCelestialState();

// Generate insights
const insights = OracleEngine.generateInsights(themes, celestialState, birthChart);

// Select best insight
const bestInsight = OracleEngine.selectBestInsight(insights);
```

### Birth Chart Integration

```typescript
// Calculate personal transits
const transits = calculatePersonalTransits(birthChart, currentPositions);

// Get chart ruler status
const rulerStatus = calculateChartRulerStatus(birthChart, currentPositions);

// Get real planetary positions
const positions = await getCurrentPlanetaryPositions();
```

## Integration Points

### Redux Store
The diary system integrates with the existing Redux store:

```typescript
interface RootState {
  calendar: CalendarState;
  astrology: AstrologyState;
  diary: DiaryState;  // New
}
```

### Persistence
- Entries: localStorage + Firestore (when authenticated)
- Preferences: localStorage
- Sync: Automatic cloud sync for authenticated users

### Astrology Integration
- Uses existing `astroProfiles` from calendar state
- Connects to Swiss Ephemeris for real positions
- Respects user's selected profile

## Mobile Support

The diary system is fully responsive:
- Bottom tab navigation on mobile
- Touch-optimized controls
- Swipe gestures (future enhancement)
- Safe area insets for notched devices

## Future Enhancements

- [ ] Voice-to-text entry
- [ ] Image attachments
- [ ] Mood tracking charts
- [ ] Advanced transit filtering
- [ ] Export to more formats (Markdown, JSON)
- [ ] Collaborative journals
- [ ] AI writing assistant

## Credits

Built with:
- Swiss Ephemeris for astronomical calculations
- React + TypeScript + Vite
- Redux Toolkit for state management
- HEKA Calendar Pro architecture
