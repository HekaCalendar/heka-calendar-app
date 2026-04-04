# HEKA Calendar Scroll Issue - Deep Audit & Fixes

## Problem Summary
- **Issue**: Vertical scroll blocking in day panel and celestial guide cards
- **Affects**: BOTH portrait and landscape orientations
- **Scope**: Day panel content and celestial guide cards
- **History**: Issue existed BEFORE tutorial system was created

## Root Causes Identified & Fixed

### FIX 1: Celestial Cards Overflow (global.css lines 4015-4016) ✅
**Problem**: Cards had `overflow-y: auto !important` which made them internal scroll containers, blocking page scroll.

**Before**:
```css
.celestial-panel .celestial-expandable-card {
  /* CRITICAL: Contain content within card */
  overflow-x: hidden !important;
  overflow-y: auto !important;
}
```

**After**:
```css
.celestial-panel .celestial-expandable-card {
  /* FIXED: Let content expand naturally - DON'T make cards scroll containers */
  overflow: visible !important;
  /* FIXED: Ensure cards don't intercept vertical scroll gestures */
  touch-action: pan-x pan-y !important;
}
```

### FIX 2: Day Panel Max-Height (responsive-fixes.css lines 249-256) ✅
**Problem**: Day panel had `max-height: 50vh` and `overflow-y: auto`, making it a limited-height scroll container.

**Before**:
```css
.day-panel {
  max-height: 50vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

**After**:
```css
.day-panel {
  /* FIXED: Let content expand naturally for page scroll */
  max-height: none;
  overflow: visible;
  touch-action: pan-y;
}
```

### FIX 3: Day Panel Overscroll Behavior (global.css lines 4383-4392) ✅
**Problem**: `overscroll-behavior: contain` and `overflow-y: auto` prevented scroll chaining and made panel scroll independently.

**Before**:
```css
.day-panel {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y pinch-zoom;
}
```

**After**:
```css
.day-panel {
  /* FIXED: overflow: visible lets page scroll instead of panel scrolling */
  overflow: visible;
  touch-action: pan-y;
}
```

### FIX 4: Celestial Card Headers (NEW) ✅
**Problem**: Card headers have `onClick` handlers in React which can intercept touch events, preventing scroll when touching the header area.

**Fix Applied to**: `celestial-landscape.css`, `android-scroll-fix.css`, `global.css`

```css
.celestial-panel .celestial-expandable-card__header {
  /* CRITICAL: Allow vertical scroll to pass through */
  touch-action: pan-y !important;
  user-select: none !important;
}

/* ALL card children must allow vertical scroll */
.celestial-panel .celestial-expandable-card *,
.celestial-panel .celestial-info-section *,
.celestial-panel .celestial-info-list *,
.celestial-panel .celestial-info-badge * {
  touch-action: pan-y !important;
}
```

## Key Insight

The fundamental issue was that **day-panel and celestial cards were being turned into scroll containers** with:
1. `overflow-y: auto` (creates scroll container)
2. `max-height` constraints (forces scrolling)
3. `overscroll-behavior: contain` (prevents scroll chaining)

Additionally, **celestial card headers** with click handlers were intercepting touch events.

By changing these to `overflow: visible` and adding comprehensive `touch-action` rules, the **page itself** scrolls naturally rather than individual panels trying to scroll internally.

## Files Modified

1. `src/styles/global.css` - Fixed celestial cards overflow, day-panel scroll, card header touch-action
2. `src/styles/responsive-fixes.css` - Fixed day-panel max-height constraint
3. `src/styles/android-scroll-fix.css` - Fixed day-panel overflow, added comprehensive card rules
4. `src/styles/celestial-landscape.css` - Added card header and all-descendants touch-action rules

## Testing Recommendations

1. **Portrait Mode**: Scroll down through day panel content - should scroll smoothly with page
2. **Landscape Mode**: 
   - Horizontal swipe on celestial cards should scroll cards left/right
   - Vertical scroll should scroll entire page up/down
3. **Both Orientations**: 
   - Touching card headers should allow page scroll
   - Tapping card headers should still expand/collapse cards
   - No "scroll traps" where gestures get stuck
