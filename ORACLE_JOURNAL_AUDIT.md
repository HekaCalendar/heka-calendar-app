# Oracle Journal - Performance & Bug Audit

## 🐛 Critical Bug: [object Object] Display

**Status:** Investigating - Likely in theme/style handling

**Suspected Locations:**
1. Line 173-174: `journal-theme-${safeTheme}` className construction
2. Line 711: `theme-${moduleTheme}` className 
3. Line 723: `theme-${moduleTheme}` className
4. Line 725: `style={{ fontFamily: currentFont.cssValue }}`

**Root Cause:** The `theme` prop passed to DiarySearch may be an object instead of string, or `currentFont.cssValue` may be undefined.

## 🔴 Performance Issues Found

### 1. **Expensive Effects Run Too Frequently**
**Location:** Lines 501-517
```javascript
useEffect(() => {
  if (!isOpen) return;
  loadCelestialData();
  calculatePersonalTransitsData();
  
  refreshInterval.current = setInterval(() => {
    loadCelestialData();        // ← Runs every 60s while open
    calculatePersonalTransitsData();  // ← Runs every 60s while open
  }, 60000);
}, [isOpen, loadCelestialData, calculatePersonalTransitsData]);
```
**Issue:** Transits don't change meaningfully every minute. Should be 5-15 minutes.

### 2. **Expensive Object Transformations in useMemo**
**Location:** Lines 282-366 - `birthChartData` useMemo
- Transforms birth chart data on every render if `effectiveProfile` changes
- Complex nested object traversal
- Three different format handlers running every time

### 3. **Calendar Notes Conversion on Every Render**
**Location:** Lines 523-545
```javascript
const calendarNoteEntries = useMemo(() => {
  // Creates new array and objects on every calendarNotes change
  // Sorts with Date comparison
}, [calendarNotes]);
```
**Issue:** Creates new objects for every note even if nothing changed.

### 4. **Unnecessary Redux Selector Calls**
**Location:** Lines 159-163, 245-247
```javascript
const entries = useSelector((state: RootState) => selectAllEntries(state));
const preferences = useSelector((state: RootState) => state.diary.preferences);
const calendarNotes = useSelector((state: RootState) => state.calendar.notes);
const timeMode = useSelector((state: RootState) => state.calendar.timeMode);
const displaySettings = useSelector((state: RootState) => state.calendar.display);
```
**Issue:** These create new function references on every render, though Redux optimizes this.

### 5. **Multiple Birth Chart Data Sources**
**Location:** Lines 165-277
- Direct localStorage read on mount
- Redux store subscription
- Complex merge logic in `effectiveProfile` useMemo
**Issue:** Creates race conditions and unnecessary recomputation.

### 6. **Expensive Stats Calculation**
**Location:** Lines 551-558
```javascript
const stats = useMemo(() => ({
  totalEntries: entries.length,
  entriesWithInsights: entries.filter(e => e.insight).length,  // ← O(n) scan
  calendarNotes: calendarNoteEntries.length,
  activeTransits: personalTransits.filter(t => t.strength >= 60).length,  // ← O(n) scan
  majorTransits: personalTransits.filter(t => t.strength >= 80).length,  // ← O(n) scan
  streak: calculateStreak(entries),  // ← O(n log n) sort
}), [entries, calendarNoteEntries.length, personalTransits]);
```
**Issue:** Multiple O(n) scans of entries array.

### 7. **Inline Object/Array Creation in JSX**
**Location:** Lines 665-675
```javascript
const searchCalendarNotes = useMemo(() =>
  calendarNoteEntries.map(n => ({
    id: n.id,
    date: n.date,
    // ... creates new objects
  })),
[calendarNoteEntries]);
```
**Issue:** Creates new objects even when mapping same data.

### 8. **Missing useCallback for Event Handlers in Loops**
**Location:** Lines 961-1002
Handlers created inline in `.map()` calls may cause unnecessary re-renders of child components.

### 9. **Excessive Console Logging**
**Location:** Throughout file (lines 185-189, 198, 214, 222-223, 251-267, etc.)
Multiple console.log statements in render path.

### 10. **Large Component File**
**Size:** ~1250 lines
**Issue:** Monolithic component doing too much - state management, data transformation, rendering, and business logic all in one file.

## 🟡 Minor Issues

1. **Unused Imports:** `JOURNAL_FONTS` imported but only `currentFont` used
2. **Type Casting:** Excessive `as any` casts (lines 289, 306, 322, etc.)
3. **Missing Cleanup:** Some intervals may not clear properly on rapid open/close

## 📋 Recommended Fixes

### Immediate (Bug Fix)
1. Add type guard for theme prop in DiarySearch
2. Ensure `currentFont.cssValue` has fallback
3. Add error boundary for journal

### Short-term (Performance)
1. Reduce transit refresh interval to 5 minutes
2. Memoize birth chart format conversion
3. Use Reselect for stats calculations
4. Split component into smaller sub-components

### Long-term (Architecture)
1. Move birth chart logic to custom hook
2. Create separate components for each mode (oracle/entries/celestial/scribe)
3. Use virtualized lists for large entry lists
4. Implement proper loading states with skeletons
