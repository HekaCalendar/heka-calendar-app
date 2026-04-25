# OASIS Design System
## Celestial Guide Elite Redesign

### Philosophy
An oasis of beauty, wisdom, and tranquility. Every card should feel like stepping into a serene, information-rich sanctuary.

### Visual Language
- **Depth**: Layered cards with subtle shadows (0 4px 20px rgba(0,0,0,0.08))
- **Glass**: Translucent overlays with backdrop blur
- **Glow**: Soft colored glows for active elements
- **Breathing**: Generous padding, whitespace, air between elements

### Color Palette Per Card
1. **SunTimes**: Gold → Amber → Warm sunset gradient
2. **DigitalClock/Countdowns**: Indigo → Purple → Deep space
3. **Agricultural**: Fresh Green → Earth Brown → Life
4. **DayOfWeek**: Dynamic per planet (Sun=Gold, Moon=Silver, Mars=Red, etc)
5. **MoonPhase**: Deep Blue → Silver → Mystical
6. **Season**: Dynamic per season (Spring=Green, Summer=Gold, Autumn=Orange, Winter=Blue)

### Typography Scale
- **Hero Title**: 32px, 700 weight, tight letter-spacing
- **Section Title**: 14px, 600 weight, uppercase, 1px spacing
- **Body**: 13px, 400 weight, comfortable line-height
- **Micro**: 11px, 500 weight, uppercase, 0.5px spacing
- **Data/Numbers**: 16-24px, monospace for countdowns/times

### Interaction Patterns
- **Hover**: Subtle scale (1.01) + shadow increase
- **Expand**: Smooth height transition + content fade in
- **Live Updates**: Gentle pulse on changing numbers
- **Success State**: Soft gold glow pulse

### Card Anatomy
```
┌─ HEADER (Always Visible) ─────────────┐
│ [Icon] [Title + Subtitle]        [▼]  │
├─ COLLAPSED PREVIEW ───────────────────┤
│ Mini info / Progress / Status         │
└───────────────────────────────────────┘
┌─ EXPANDED CONTENT ────────────────────┐
│ Hero Section (Visual Anchor)          │
│ Live Data Section (Ticking/Counters)  │
│ Main Content (The Wisdom)             │
│ Footer (Location/Accuracy)            │
└───────────────────────────────────────┘
```

### Animation Standards
- **Expand Duration**: 300ms ease-out
- **Counter Update**: 150ms fade
- **Progress Bars**: Smooth 300ms transitions
- **Glow Pulses**: 2s infinite ease-in-out
