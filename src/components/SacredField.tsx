/**
 * SacredField — Massive viewport-filling sacred geometry tapestry
 *
 * A hexagonal grid of large overlapping circles (Seed of Life extended)
 * that fills the entire viewport and extends beyond the edges.
 *
 * Only two animations, both on the container:
 *   1. Slow opacity pulse (breathing)
 *   2. Very slow rotation (imperceptible cosmic drift)
 *
 * No filters. No scale transforms. No individual element animations.
 */

import { memo } from 'react';

const R = 85;                          // circle radius
const SPACING = R * 1.35;              // center-to-center distance (slight gap so arcs show)
const ROW_H = SPACING * 0.866;         // vertical distance between rows (√3/2 factor)
const OFFSET = SPACING / 2;            // horizontal offset for odd rows
const CX = 400;                        // viewBox center x
const CY = 400;                        // viewBox center y
const MAX_DIST = 520;                  // include circles this far from center

/** Generate a hexagonal grid of circles covering the viewport */
function generateCircles(): Array<{ cx: number; cy: number; r: number }> {
  const circles: Array<{ cx: number; cy: number; r: number }> = [];

  for (let row = -4; row <= 4; row++) {
    const y = CY + row * ROW_H;
    const rowOffset = (row % 2 !== 0) ? OFFSET : 0;

    for (let col = -3; col <= 3; col++) {
      const x = CX + col * SPACING + rowOffset;
      const dist = Math.sqrt((x - CX) ** 2 + (y - CY) ** 2);
      if (dist < MAX_DIST) {
        circles.push({ cx: x, cy: y, r: R });
      }
    }
  }

  return circles;
}

const CIRCLES = generateCircles();

/** Pack many circles into a single <path> d attribute to reduce DOM node count. */
function circlesToPath(circles: Array<{ cx: number; cy: number; r: number }>): string {
  const parts: string[] = new Array(circles.length);
  for (let i = 0; i < circles.length; i++) {
    const c = circles[i];
    parts[i] =
      `M ${c.cx + c.r} ${c.cy} ` +
      `A ${c.r} ${c.r} 0 1 0 ${c.cx - c.r} ${c.cy} ` +
      `A ${c.r} ${c.r} 0 1 0 ${c.cx + c.r} ${c.cy}`;
  }
  return parts.join(' ');
}

const CIRCLE_PATH = circlesToPath(CIRCLES);

export const SacredField = memo(() => {
  return (
    <div className="sacred-field" aria-hidden="true">
      <svg
        className="sacred-field__svg"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Single path replaces dozens of <circle> nodes */}
        <g className="sacred-field__grid">
          <path
            d={CIRCLE_PATH}
            fill="none"
            stroke="var(--sacred-primary)"
            strokeWidth="0.7"
            strokeOpacity="0.32"
          />
        </g>
      </svg>
    </div>
  );
});

SacredField.displayName = 'SacredField';

export default SacredField;
