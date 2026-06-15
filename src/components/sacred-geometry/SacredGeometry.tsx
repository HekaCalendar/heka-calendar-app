/**
 * SacredGeometry — Master renderer for all 12 sacred geometry patterns
 *
 * Header variants: 300×300 viewBox, subtle opacity
 * Background variants: 800×800 viewBox, massive scale
 */

import React from 'react';
import type { GeometryPattern, BackgroundGeometryPattern } from '../../types/themes';

interface Props {
  pattern: GeometryPattern | BackgroundGeometryPattern;
  variant: 'header' | 'background';
}

/* ─── Helper: generate circles for Flower/Seed/Fruit of Life ─── */
function flowerOfLifeCircles(cx: number, cy: number, r: number, rings: number): Array<{ cx: number; cy: number; r: number }> {
  const circles = [{ cx, cy, r }];
  for (let ring = 1; ring <= rings; ring++) {
    const count = ring === 4 ? 12 : 6;
    const dist = ring === 1 ? r : ring === 2 ? r * Math.sqrt(3) : ring === 3 ? 2 * r : ring === 4 ? r * Math.sqrt(7) : 3 * r;
    for (let i = 0; i < count; i++) {
      const angle = ((i * 360) / count - 90) * (Math.PI / 180);
      circles.push({ cx: cx + dist * Math.cos(angle), cy: cy + dist * Math.sin(angle), r });
    }
  }
  return circles;
}

/* ─── Helper: hex grid for backgrounds ─── */
function hexGrid(cx: number, cy: number, r: number, rows: number, cols: number, spacing: number): Array<{ cx: number; cy: number; r: number }> {
  const circles: Array<{ cx: number; cy: number; r: number }> = [];
  const rowH = spacing * 0.866;
  const offset = spacing / 2;
  for (let row = -rows; row <= rows; row++) {
    for (let col = -cols; col <= cols; col++) {
      const x = cx + col * spacing + (row % 2 !== 0 ? offset : 0);
      const y = cy + row * rowH;
      circles.push({ cx: x, cy: y, r });
    }
  }
  return circles;
}

/* ─── Helper: pack many circles into a single <path> d attribute
    Reduces DOM node count from N <circle> elements to 1 <path>.
    All circles share the same stroke / stroke-width / stroke-opacity. ─── */
function circlesToPath(circles: Array<{ cx: number; cy: number; r: number }>): string {
  // Pre-size the array to avoid reallocation growth on large geometries.
  const parts: string[] = new Array(circles.length);
  for (let i = 0; i < circles.length; i++) {
    const c = circles[i];
    // Full circle as two 180° arcs starting/ending at the rightmost point.
    parts[i] =
      `M ${c.cx + c.r} ${c.cy} ` +
      `A ${c.r} ${c.r} 0 1 0 ${c.cx - c.r} ${c.cy} ` +
      `A ${c.r} ${c.r} 0 1 0 ${c.cx + c.r} ${c.cy}`;
  }
  return parts.join(' ');
}

/* ─── HEADER: Flower of Life ─── */
function HeaderFlowerOfLife(): React.ReactElement {
  const c = flowerOfLifeCircles(150, 150, 30, 2);
  return (
    <g>
      {c.map((circle, i) => (
        <circle key={i} cx={circle.cx} cy={circle.cy} r={circle.r} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.8" strokeOpacity="0.45" />
      ))}
    </g>
  );
}

/* ─── HEADER: Seed of Life ─── */
function HeaderSeedOfLife(): React.ReactElement {
  const c = flowerOfLifeCircles(150, 150, 50, 1);
  return (
    <g>
      {c.map((circle, i) => (
        <circle key={i} cx={circle.cx} cy={circle.cy} r={circle.r} fill="none" stroke="var(--sacred-primary)" strokeWidth="1" strokeOpacity="0.5" />
      ))}
    </g>
  );
}

/* ─── HEADER: Metatron's Cube ─── */
function HeaderMetatronsCube(): React.ReactElement {
  const { circles, lines } = React.useMemo(() => {
    const r = 35;
    const cx = 150, cy = 150;
    const circles = [{ cx, cy, r }];
    // Inner ring (6)
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 90) * (Math.PI / 180);
      circles.push({ cx: cx + r * Math.cos(angle), cy: cy + r * Math.sin(angle), r });
    }
    // Outer ring (6) at distance 2r
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 90) * (Math.PI / 180);
      circles.push({ cx: cx + 2 * r * Math.cos(angle), cy: cy + 2 * r * Math.sin(angle), r });
    }
    // Key lines: connect center to all, and inner ring to outer ring
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    const centers = circles.map(c => ({ x: c.cx, y: c.cy }));
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        const dx = centers[i].x - centers[j].x;
        const dy = centers[i].y - centers[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= 2.1 * r) {
          lines.push({ x1: centers[i].x, y1: centers[i].y, x2: centers[j].x, y2: centers[j].y });
        }
      }
    }
    return { circles, lines };
  }, []);
  return (
    <g>
      {lines.map((l, i) => (
        <line key={`l-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="var(--sacred-primary)" strokeWidth="0.5" strokeOpacity="0.3" />
      ))}
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.8" strokeOpacity="0.45" />
      ))}
    </g>
  );
}

/* ─── HEADER: Sri Yantra (simplified — 9 triangles + bindu) ─── */
function HeaderSriYantra(): React.ReactElement {
  const cx = 150, cy = 150, s = 120;
  const triangles = [
    // Downward triangles (Shakti)
    { pts: [[cx, cy - s * 0.85], [cx - s * 0.75, cy + s * 0.4], [cx + s * 0.75, cy + s * 0.4]], down: true },
    { pts: [[cx, cy - s * 0.35], [cx - s * 0.5, cy + s * 0.65], [cx + s * 0.5, cy + s * 0.65]], down: true },
    { pts: [[cx, cy + s * 0.05], [cx - s * 0.3, cy + s * 0.75], [cx + s * 0.3, cy + s * 0.75]], down: true },
    { pts: [[cx, cy + s * 0.3], [cx - s * 0.18, cy + s * 0.82], [cx + s * 0.18, cy + s * 0.82]], down: true },
    { pts: [[cx, cy + s * 0.5], [cx - s * 0.1, cy + s * 0.88], [cx + s * 0.1, cy + s * 0.88]], down: true },
    // Upward triangles (Shiva)
    { pts: [[cx, cy + s * 0.85], [cx - s * 0.75, cy - s * 0.4], [cx + s * 0.75, cy - s * 0.4]], down: false },
    { pts: [[cx, cy + s * 0.35], [cx - s * 0.5, cy - s * 0.65], [cx + s * 0.5, cy - s * 0.65]], down: false },
    { pts: [[cx, cy - s * 0.05], [cx - s * 0.3, cy - s * 0.75], [cx + s * 0.3, cy - s * 0.75]], down: false },
    { pts: [[cx, cy - s * 0.3], [cx - s * 0.18, cy - s * 0.82], [cx + s * 0.18, cy - s * 0.82]], down: false },
  ];
  return (
    <g>
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={s} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.8" strokeOpacity="0.35" />
      {/* Triangles */}
      {triangles.map((t, i) => (
        <polygon
          key={i}
          points={t.pts.map(p => p.join(',')).join(' ')}
          fill="none"
          stroke="var(--sacred-primary)"
          strokeWidth="0.7"
          strokeOpacity={t.down ? '0.4' : '0.35'}
        />
      ))}
      {/* Bindu (center dot) */}
      <circle cx={cx} cy={cy} r="3" fill="var(--sacred-primary)" fillOpacity="0.6" />
    </g>
  );
}

/* ─── HEADER: Merkaba (Star Tetrahedron) ─── */
function HeaderMerkaba(): React.ReactElement {
  const cx = 150, cy = 150, r = 70;
  const s3 = Math.sqrt(3);
  // Upward triangle
  const up = [
    [cx, cy - r],
    [cx + r * s3 / 2, cy + r / 2],
    [cx - r * s3 / 2, cy + r / 2],
  ];
  // Downward triangle
  const down = [
    [cx, cy + r],
    [cx + r * s3 / 2, cy - r / 2],
    [cx - r * s3 / 2, cy - r / 2],
  ];
  return (
    <g>
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.6" strokeOpacity="0.25" />
      {/* Triangles */}
      <polygon points={up.map(p => p.join(',')).join(' ')} fill="none" stroke="var(--sacred-primary)" strokeWidth="1" strokeOpacity="0.5" />
      <polygon points={down.map(p => p.join(',')).join(' ')} fill="none" stroke="var(--sacred-primary)" strokeWidth="1" strokeOpacity="0.5" />
      {/* Depth lines — connect each apex to opposite base vertices */}
      <line x1={up[0][0]} y1={up[0][1]} x2={down[1][0]} y2={down[1][1]} stroke="var(--sacred-primary)" strokeWidth="0.6" strokeOpacity="0.3" />
      <line x1={up[0][0]} y1={up[0][1]} x2={down[2][0]} y2={down[2][1]} stroke="var(--sacred-primary)" strokeWidth="0.6" strokeOpacity="0.3" />
      <line x1={down[0][0]} y1={down[0][1]} x2={up[1][0]} y2={up[1][1]} stroke="var(--sacred-primary)" strokeWidth="0.6" strokeOpacity="0.3" />
      <line x1={down[0][0]} y1={down[0][1]} x2={up[2][0]} y2={up[2][1]} stroke="var(--sacred-primary)" strokeWidth="0.6" strokeOpacity="0.3" />
    </g>
  );
}

/* ─── HEADER: Fruit of Life ─── */
function HeaderFruitOfLife(): React.ReactElement {
  const circles = React.useMemo(() => {
    const r = 30;
    const cx = 150, cy = 150;
    const circles = [{ cx, cy, r }];
    // Inner ring (6) at distance r
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 90) * (Math.PI / 180);
      circles.push({ cx: cx + r * Math.cos(angle), cy: cy + r * Math.sin(angle), r });
    }
    // Outer ring (6) at distance 2r
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 - 90) * (Math.PI / 180);
      circles.push({ cx: cx + 2 * r * Math.cos(angle), cy: cy + 2 * r * Math.sin(angle), r });
    }
    return circles;
  }, []);
  return (
    <g>
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.9" strokeOpacity="0.5" />
      ))}
    </g>
  );
}

/* ─── HEADER: Golden Spiral ─── */
function HeaderGoldenSpiral(): React.ReactElement {
  const { pts, pts2 } = React.useMemo(() => {
    const cx = 150, cy = 150;
    const PHI = 1.618033988749895;
    const turns = 3.5;
    const steps = 200;
    // Logarithmic spiral: r = a * e^(b*θ), growing by φ per half-turn
    const b = Math.log(PHI) / Math.PI;
    const a = 3;
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * 2 * Math.PI;
      const r = a * Math.exp(b * t);
      const x = cx + r * Math.cos(t);
      const y = cy + r * Math.sin(t);
      pts.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    // Counter-spiral for visual balance
    const pts2: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * 2 * Math.PI;
      const r = a * Math.exp(b * t);
      const x = cx + r * Math.cos(-t);
      const y = cy + r * Math.sin(-t);
      pts2.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return { pts, pts2 };
  }, []);
  const cx = 150, cy = 150;
  return (
    <g>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={135} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.5" strokeOpacity="0.2" />
      {/* Main spiral */}
      <polyline points={pts.join(' ')} fill="none" stroke="var(--sacred-primary)" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
      {/* Counter spiral */}
      <polyline points={pts2.join(' ')} fill="none" stroke="var(--sacred-primary)" strokeWidth="1.2" strokeOpacity="0.5" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="4" fill="var(--sacred-primary)" fillOpacity="0.6" />
    </g>
  );
}

/* ─── BACKGROUND: Phyllotaxis Field ─── */
function BackgroundPhyllotaxis(): React.ReactElement {
  const { dotPath, spirals } = React.useMemo(() => {
    const cx = 400, cy = 400;
    const PHI = 1.618033988749895;
    const goldenAngle = (2 * Math.PI) / (PHI * PHI); // ~137.5° in radians
    const count = 800; // Reduced from 1400: still dense, far fewer DOM nodes
    const c = 12.5; // scaling factor
    const circles: Array<{ cx: number; cy: number; r: number }> = new Array(count);
    for (let n = 0; n < count; n++) {
      const angle = n * goldenAngle;
      const radius = c * Math.sqrt(n);
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      // Vary dot size — tiny in centre, slightly larger outward
      const dotR = Math.max(1.8, Math.min(4.2, 1.8 + radius / 220));
      circles[n] = { cx: x, cy: y, r: dotR };
    }
    // Fibonacci spiral guides — connect every fibonacci-th point
    const fibs = [13, 21, 34, 55, 89];
    const spirals: string[] = [];
    for (const f of fibs) {
      const pts: string[] = [];
      for (let n = f; n < count; n += f) {
        const angle = n * goldenAngle;
        const radius = c * Math.sqrt(n);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      if (pts.length > 10) spirals.push(pts.join(' '));
    }
    return { dotPath: circlesToPath(circles), spirals };
  }, []);
  return (
    <g>
      {/* Single path replaces 800 individual <circle> nodes */}
      <path
        d={dotPath}
        fill="none"
        stroke="var(--sacred-primary)"
        strokeWidth="0.5"
        strokeOpacity="0.18"
      />
      {spirals.map((pts, i) => (
        <polyline key={`s-${i}`} points={pts} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.6" strokeOpacity="0.12" strokeLinecap="round" />
      ))}
    </g>
  );
}

/* ─── BACKGROUND: Hex Flower Grid ─── */
function BackgroundHexFlower(): React.ReactElement {
  const circles = React.useMemo(() => hexGrid(400, 400, 85, 4, 3, 85 * 1.35), []);
  return (
    <g>
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.7" strokeOpacity="0.32" />
      ))}
    </g>
  );
}

/* ─── BACKGROUND: Metatron's Lattice ─── */
function BackgroundMetatronLattice(): React.ReactElement {
  const dotPath = React.useMemo(() => {
    const r = 70;
    const spacing = r * 2.8;
    const rowH = spacing * 0.866;
    const offset = spacing / 2;
    const circles: Array<{ cx: number; cy: number; r: number }> = [];

    // 5×5 grid still extends past the visible viewport slice while cutting
    // DOM count ~70 % versus the previous 9×9 grid (325 vs 1 053 circles).
    for (let row = -2; row <= 2; row++) {
      for (let col = -2; col <= 2; col++) {
        const ux = 400 + col * spacing + (row % 2 !== 0 ? offset : 0);
        const uy = 400 + row * rowH;
        // Fruit of Life unit: 1 center + 6 inner + 6 outer
        circles.push({ cx: ux, cy: uy, r });
        for (let i = 0; i < 6; i++) {
          const a = (i * 60 - 90) * (Math.PI / 180);
          circles.push({ cx: ux + r * Math.cos(a), cy: uy + r * Math.sin(a), r });
          circles.push({ cx: ux + 2 * r * Math.cos(a), cy: uy + 2 * r * Math.sin(a), r });
        }
      }
    }
    return circlesToPath(circles);
  }, []);

  return (
    <g>
      {/* Single path replaces hundreds of individual <circle> nodes */}
      <path
        d={dotPath}
        fill="none"
        stroke="var(--sacred-primary)"
        strokeWidth="0.5"
        strokeOpacity="0.22"
      />
    </g>
  );
}

/* ─── BACKGROUND: Sri Yantra Mandala ─── */
function BackgroundSriYantra(): React.ReactElement {
  const cx = 400, cy = 400, s = 420;
  const triangles = [
    { pts: [[cx, cy - s * 0.85], [cx - s * 0.75, cy + s * 0.4], [cx + s * 0.75, cy + s * 0.4]], down: true },
    { pts: [[cx, cy - s * 0.35], [cx - s * 0.5, cy + s * 0.65], [cx + s * 0.5, cy + s * 0.65]], down: true },
    { pts: [[cx, cy + s * 0.05], [cx - s * 0.3, cy + s * 0.75], [cx + s * 0.3, cy + s * 0.75]], down: true },
    { pts: [[cx, cy + s * 0.3], [cx - s * 0.18, cy + s * 0.82], [cx + s * 0.18, cy + s * 0.82]], down: true },
    { pts: [[cx, cy + s * 0.5], [cx - s * 0.1, cy + s * 0.88], [cx + s * 0.1, cy + s * 0.88]], down: true },
    { pts: [[cx, cy + s * 0.85], [cx - s * 0.75, cy - s * 0.4], [cx + s * 0.75, cy - s * 0.4]], down: false },
    { pts: [[cx, cy + s * 0.35], [cx - s * 0.5, cy - s * 0.65], [cx + s * 0.5, cy - s * 0.65]], down: false },
    { pts: [[cx, cy - s * 0.05], [cx - s * 0.3, cy - s * 0.75], [cx + s * 0.3, cy - s * 0.75]], down: false },
    { pts: [[cx, cy - s * 0.3], [cx - s * 0.18, cy - s * 0.82], [cx + s * 0.18, cy - s * 0.82]], down: false },
  ];
  // Concentric rings — extend further so no hard outer edge
  const rings = [140, 240, 340, 440, 540];
  return (
    <g>
      {rings.map((r, i) => (
        <circle key={`ring-${i}`} cx={cx} cy={cy} r={r} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.5" strokeOpacity="0.15" />
      ))}
      {triangles.map((t, i) => (
        <polygon
          key={i}
          points={t.pts.map(p => p.join(',')).join(' ')}
          fill="none"
          stroke="var(--sacred-primary)"
          strokeWidth="0.8"
          strokeOpacity={t.down ? '0.3' : '0.25'}
        />
      ))}
      <circle cx={cx} cy={cy} r="5" fill="var(--sacred-primary)" fillOpacity="0.5" />
    </g>
  );
}

/* ─── BACKGROUND: Torus Field ─── */
function BackgroundTorus(): React.ReactElement {
  const { rings, spirals } = React.useMemo(() => {
    const cx = 400, cy = 400;
    // Extend rings well past visible viewport slice
    const rings = [40, 100, 160, 220, 280, 340, 400, 460, 520, 580, 640];
    // 6 spirals extending far beyond viewBox so endpoints are never visible
    const spirals = [];
    for (let s = 0; s < 6; s++) {
      const pts: string[] = [];
      for (let t = 0; t < 280; t++) {
        const angle = (t * 0.12) + (s * Math.PI / 3);
        const radius = 30 + t * 2.6;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        pts.push(`${x},${y}`);
      }
      spirals.push(pts.join(' '));
    }
    return { rings, spirals };
  }, []);
  const cx = 400, cy = 400;
  return (
    <g>
      {rings.map((r, i) => (
        <circle key={`ring-${i}`} cx={cx} cy={cy} r={r} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.6" strokeOpacity="0.2" />
      ))}
      {spirals.map((pts, i) => (
        <polyline key={`spiral-${i}`} points={pts} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.9" strokeOpacity="0.22" strokeLinecap="round" />
      ))}
    </g>
  );
}

/* ─── BACKGROUND: Tree of Life ─── */
function BackgroundTreeOfLife(): React.ReactElement {
  // Scale up 1.6× so the tree extends past any visible viewport slice at 180vmax
  const cx = 400, cy = 400, h = 560, w = 448;
  // Sephirot positions (standard Golden Dawn arrangement)
  const nodes = [
    { x: cx, y: cy - h * 0.45, r: 28, n: 1 },      // Kether
    { x: cx + w * 0.35, y: cy - h * 0.28, r: 28, n: 2 }, // Chokmah
    { x: cx - w * 0.35, y: cy - h * 0.28, r: 28, n: 3 }, // Binah
    { x: cx + w * 0.35, y: cy - h * 0.05, r: 28, n: 4 }, // Chesed
    { x: cx - w * 0.35, y: cy - h * 0.05, r: 28, n: 5 }, // Geburah
    { x: cx, y: cy, r: 32, n: 6 },                   // Tiferet
    { x: cx + w * 0.35, y: cy + h * 0.22, r: 28, n: 7 },  // Netzach
    { x: cx - w * 0.35, y: cy + h * 0.22, r: 28, n: 8 },  // Hod
    { x: cx, y: cy + h * 0.35, r: 28, n: 9 },       // Yesod
    { x: cx, y: cy + h * 0.48, r: 32, n: 10 },      // Malkuth
  ];
  const paths = [
    [0, 1], [0, 2], [0, 5], [1, 2], [1, 5], [1, 3], [2, 5], [2, 4],
    [3, 4], [3, 5], [3, 6], [4, 5], [4, 7], [5, 6], [5, 8], [5, 7],
    [6, 7], [6, 8], [6, 9], [7, 8], [7, 9], [8, 9],
  ];
  return (
    <g>
      {paths.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="var(--sacred-primary)" strokeWidth="1" strokeOpacity="0.3" />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r} fill="none" stroke="var(--sacred-primary)" strokeWidth="1.2" strokeOpacity="0.45" />
          <circle cx={n.x} cy={n.y} r={n.r * 0.4} fill="var(--sacred-primary)" fillOpacity="0.15" />
        </g>
      ))}
    </g>
  );
}

/* ─── BACKGROUND: Vesica Wave ─── */
function BackgroundVesicaWave(): React.ReactElement {
  const circles = React.useMemo(() => {
    const r = 65;
    const circles: Array<{ cx: number; cy: number; r: number }> = [];
    // Expand grid so pattern extends well past visible viewport slice
    for (let row = -7; row <= 7; row++) {
      const y = 400 + row * r * 0.9;
      const offset = (row % 2 !== 0) ? r * 0.5 : 0;
      for (let col = -8; col <= 8; col++) {
        const x = 400 + col * r + offset;
        circles.push({ cx: x, cy: y, r });
      }
    }
    return circles;
  }, []);
  return (
    <g>
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="none" stroke="var(--sacred-primary)" strokeWidth="0.7" strokeOpacity="0.28" />
      ))}
    </g>
  );
}

/* ─── Master Component ─── */
const SacredGeometryBase: React.FC<Props> = ({ pattern, variant }) => {
  const isHeader = variant === 'header';
  const vb = isHeader ? '0 0 300 300' : '0 0 800 800';

  const patternElement = React.useMemo(() => {
    switch (pattern) {
      // Header patterns
      case 'flower-of-life':
        return isHeader ? <HeaderFlowerOfLife /> : <BackgroundHexFlower />;
      case 'seed-of-life':
        return isHeader ? <HeaderSeedOfLife /> : <BackgroundMetatronLattice />;
      case 'metatrons-cube':
        return isHeader ? <HeaderMetatronsCube /> : <BackgroundSriYantra />;
      case 'sri-yantra':
        return isHeader ? <HeaderSriYantra /> : <BackgroundTorus />;
      case 'merkaba':
        return isHeader ? <HeaderMerkaba /> : <BackgroundTreeOfLife />;
      case 'fruit-of-life':
        return isHeader ? <HeaderFruitOfLife /> : <BackgroundVesicaWave />;
      case 'golden-spiral':
        return isHeader ? <HeaderGoldenSpiral /> : <BackgroundPhyllotaxis />;
      // Background-only patterns
      case 'hex-flower-grid':
        return <BackgroundHexFlower />;
      case 'metatrons-lattice':
        return <BackgroundMetatronLattice />;
      case 'sri-yantra-mandala':
        return <BackgroundSriYantra />;
      case 'torus-field':
        return <BackgroundTorus />;
      case 'tree-of-life':
        return <BackgroundTreeOfLife />;
      case 'vesica-wave':
        return <BackgroundVesicaWave />;
      case 'phyllotaxis-field':
        return <BackgroundPhyllotaxis />;
      // Disabled
      case 'none':
        return null;
      default:
        return isHeader ? <HeaderFlowerOfLife /> : <BackgroundHexFlower />;
    }
  }, [pattern, isHeader]);

  return (
    <svg
      viewBox={vb}
      preserveAspectRatio="xMidYMid slice"
      className={isHeader ? 'sacred-geometry--header' : 'sacred-geometry--background'}
      pointerEvents="none"
    >
      {isHeader ? patternElement : (
        <g className="sacred-geometry__group">
          {patternElement}
        </g>
      )}
    </svg>
  );
};

export const SacredGeometry = React.memo(SacredGeometryBase);

export default SacredGeometry;
