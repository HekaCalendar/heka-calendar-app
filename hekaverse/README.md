# Hekaverse

**hekaverse.com** — The universe where magic is real.

## Overview

The Hekaverse is not a company portfolio. It is a **temple** — a digital declaration that the ancient Egyptian concept of Heka (the primordial creative force that predated the gods) is alive, and that intention creates reality.

This single-page immersive experience guides visitors through the mythology of Heka, the Four Powers (Sia · Hu · Heka · Ren), the seven ventures of the Hekaverse, and an invitation to invest, collaborate, or amplify the mission.

## The Seven Ventures

| # | Name | Domain | URL |
|---|------|--------|-----|
| 1 | **Hekatae** | Message Keepsaking | [hekatae.com](https://hekatae.com) |
| 2 | **The Modern Heka Calendar** | Time & Cosmos | (app) |
| 3 | **Heka Time** | Horology | [hekatime.com](https://hekatime.com) |
| 4 | **Antidosis** | Barter & Exchange | [antidosis.com](https://antidosis.com) |
| 5 | **Stigmator** | Wearable Art | [stigmator.com](https://stigmator.com) |
| 6 | **Meek Meet** | Community Circles | [meekmeet.com](https://meekmeet.com) |
| 7 | **Srevol** | Travel for Lovers | [srevol.com](https://srevol.com) |

## File Structure

```
hekaverse/
├── index.html              # Main page structure
├── styles/
│   └── hekaverse.css       # Complete design system (~850 lines)
├── scripts/
│   ├── particles.js        # Canvas 2D particle system
│   └── scroll.js           # GSAP ScrollTrigger + interactions
├── assets/
│   ├── glyphs/             # SVG hieroglyphic motifs (future)
│   └── textures/           # Papyrus, gold-leaf textures (future)
└── README.md
```

## Design System: "Primordial Tech"

**Ancient Egypt meets Deep Space.** The aesthetic evokes discovering a temple built by a civilization that understood quantum mechanics 5,000 years ago.

### Colors
- `--nun` `#020203` — The primordial void
- `--gold` `#d4af37` — Solar gold, divine truth
- `--maat` `#c9b8e8` — Cosmic purple, divine order
- `--heka-flame` `#e86a3c` — The creative spark
- `--nile` `#2d7d8a` — Living water, technology

### Typography
- **Cinzel Decorative** — Display / mythology
- **Cormorant Garamond** — Philosophy / body
- **Space Grotesk** — Futuristic accents
- **Inter** — UI / navigation
- **JetBrains Mono** — Data / codes

### Key Features
- **Loading Ritual**: 3.5-second animation of golden point + hieroglyphic glyphs
- **Canvas Particle System**: 800 golden particles, cursor-reactive gravity
- **Scroll Narrative**: Each section reveals with GSAP ScrollTrigger
- **The Four Powers**: Interactive pillars (Sia, Hu, Heka, Ren) with glow effects
- **Venture Constellation**: 7 nodes connected by animated SVG lines
- **Custom Cursor**: Golden dot with trailing ring, blend-mode difference
- **Manifesto**: Scroll-triggered line-by-line revelation

## External Dependencies

- [GSAP 3.12.5](https://greensock.com/gsap/) (with ScrollTrigger + ScrollToPlugin)
- Google Fonts: Cinzel, Cinzel Decorative, Cormorant Garamond, Space Grotesk, Inter, JetBrains Mono

## Performance

- First Contentful Paint target: < 1.5s
- 60fps particle system with visibility API pausing
- Mobile: particles reduce to ~200, constellation hidden, responsive grid

## Deployment

Static site — upload to any web host or static platform (Vercel, Netlify, Cloudflare Pages).

---

*"Before the gods came into being, Heka was."*
