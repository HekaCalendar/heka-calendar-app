# Heka Time

**hekatime.com** — A landing page for the Heka Time horological project.

## Overview

Heka Time is the mechanical expression of the Heka Calendar, inviting watch designers and horologists to create timepieces that follow the Heka rules for months, arcs, days, and leap time.

## What is Heka Time?

- **13 months** of exactly 28 days each (4 perfect weeks)
- **March** (the 13th month) contains 29 days, or 30 in leap years
- **Year begins April 1** — aligned with spring in the northern hemisphere
- **Saturday-start weeks** — Saturn's day begins the cycle
- **Fixed weekday alignment** — every month starts on the same day within a year
- **Three Arcs**: Opening (April/Red), Core (May–December/Green), Closing (January–March/Purple)
- **Two Leap Modes**: SYNC (civil alignment) and TRUE (astronomical precision)

## File Structure

```
heka-time/
├── index.html      # Complete landing page (HTML + CSS + JS)
├── assets/         # Future assets folder
└── README.md       # This file
```

The landing page is a single, self-contained HTML file with embedded styles and scripts. No build step required.

## Design System

Based on the OASIS Design System from the Heka Calendar app:

- **Background**: Deep void-black (`#050507`)
- **Accent**: Rich gold (`#d4af37`)
- **Typography**: Cinzel (display), Inter (body), JetBrains Mono (data)
- **Aesthetic**: Celestial Luxury — dark, immersive, glassmorphism, sacred geometry
- **Arc Colors**: Red (`#dc2626`) / Green (`#16a34a`) / Purple (`#7c3aed`)

## Deployment

This is a static site suitable for any web host. Simply upload `index.html` to your server or static hosting platform (Vercel, Netlify, Cloudflare Pages, etc.).

---

Part of the **Hekaverse** · [hekaverse.com](https://hekaverse.com)
