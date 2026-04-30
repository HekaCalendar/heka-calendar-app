/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHART SHAPE DETECTION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * The overall distribution of planets around the zodiac wheel reveals
 * fundamental life strategies and personality architectures:
 * - Bowl: 180° hemisphere — focused, self-contained, sees one half of life
 * - Bucket: Bowl + one planet opposite (handle) — the handle is the tool
 * - Locomotive: 240° arc + 120° gap — driven, dynamic, fills the void
 * - Seesaw: Two groups in opposition — negotiation, balance, mediation
 * - Splash: Even distribution — variety, scattered energy, adaptability
 * - Bundle: All within 120° — concentrated intensity, narrow focus
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export type ChartShape = 'bowl' | 'bucket' | 'locomotive' | 'seesaw' | 'splash' | 'bundle' | 'none';

export interface ShapeReading {
  shape: ChartShape;
  name: string;
  description: string;
  lifeStrategy: string;
  strength: string;
  challenge: string;
  handlePlanet?: string; // For bucket shape
  gapSign?: string;      // For locomotive shape
  occupiedHemisphere?: string; // For bowl shape
}

/** Calculate angular gaps between sorted planet longitudes */
function calculateGaps(longitudes: number[]): number[] {
  const sorted = [...longitudes].sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const next = sorted[(i + 1) % sorted.length];
    let gap = next - current;
    if (gap < 0) gap += 360;
    gaps.push(gap);
  }
  return gaps;
}

/** Detect chart shape from planet longitudes */
export function detectChartShape(
  positions: Record<string, { longitude: number }>
): ShapeReading {
  const entries = Object.entries(positions);
  if (entries.length < 6) {
    return { shape: 'none', name: 'Undetermined', description: '', lifeStrategy: '', strength: '', challenge: '' };
  }

  const longitudes = entries.map(([, p]) => p.longitude);
  const gaps = calculateGaps(longitudes);
  const maxGap = Math.max(...gaps);
  const maxGapIndex = gaps.indexOf(maxGap);
  const sorted = [...longitudes].sort((a, b) => a - b);

  // BUNDLE: All planets within 120°
  const circularSpan = 360 - maxGap;
  if (circularSpan <= 120) {
    return {
      shape: 'bundle',
      name: 'Bundle',
      description: `All planets concentrated within a ${Math.round(circularSpan)}° arc — a life of intense, narrow focus.`,
      lifeStrategy: 'You dive deep rather than wide. Your energy is not scattered but laser-focused on a few key domains. You may not see what others see, but what you see, you see completely.',
      strength: 'Extraordinary depth and mastery in your chosen areas. When you commit, you commit fully.',
      challenge: 'Blind spots outside your focus area. You may miss opportunities that require breadth rather than depth.',
    };
  }

  // SPLASH: Planets evenly distributed (no gap > 90°)
  if (maxGap <= 90 && entries.length >= 8) {
    return {
      shape: 'splash',
      name: 'Splash',
      description: 'Planets distributed across the entire wheel — a life of variety and multifaceted experience.',
      lifeStrategy: 'You are a generalist in a world of specialists. Your gift is adaptability — you can move between worlds, languages, and paradigms with ease.',
      strength: 'Versatility and resilience. When one area is blocked, you have seven others to draw from.',
      challenge: 'Scattered energy and difficulty committing. You may feel like you never go deep enough.',
    };
  }

  // BOWL: All planets in 180° hemisphere
  if (circularSpan <= 180) {
    const occupiedStart = sorted[(maxGapIndex + 1) % sorted.length];
    const occupiedEnd = sorted[maxGapIndex];
    const center = occupiedStart + (occupiedEnd >= occupiedStart
      ? (occupiedEnd - occupiedStart) / 2
      : (occupiedEnd + 360 - occupiedStart) / 2);
    const hemisphere = longitudeToSignName(center % 360);
    const emptyCenter = (occupiedStart + (occupiedEnd >= occupiedStart
      ? (occupiedEnd - occupiedStart) / 2 + 180
      : (occupiedEnd + 360 - occupiedStart) / 2 + 180)) % 360;

    return {
      shape: 'bowl',
      name: 'Bowl',
      description: `All planets occupy one hemisphere — a self-contained life focused on the ${hemisphere} side of experience.`,
      lifeStrategy: 'You live within a defined world. What is inside the bowl is rich and full; what is outside barely registers. Your task is to recognise the existence of the other half.',
      strength: 'Deep cultivation of your chosen domains. You build complete worlds within your sphere.',
      challenge: `The empty hemisphere holds what you neglect. Growth requires venturing into ${longitudeToSignName(emptyCenter)} territory.`,
      occupiedHemisphere: hemisphere,
    };
  }

  // BUCKET: Bowl with one planet opposite (the handle)
  // Check if there's a single planet opposite the main cluster
  const handleCandidates = entries.filter(([, p]) => {
    const gapToCluster = Math.min(
      ...sorted.filter(l => Math.abs(l - p.longitude) > 90).map(l => {
        const d = Math.abs(l - p.longitude);
        return Math.min(d, 360 - d);
      })
    );
    return gapToCluster > 90;
  });

  if (handleCandidates.length === 1 && circularSpan > 180 && circularSpan <= 240) {
    const handlePlanet = handleCandidates[0][0];
    return {
      shape: 'bucket',
      name: 'Bucket',
      description: `Most planets clustered together with ${handlePlanet} as the handle — the tool you use to engage the world.`,
      lifeStrategy: 'You carry a specific tool into every situation. Whatever the handle planet represents is how you reach for what you need, how you assert yourself, and how you make things happen.',
      strength: 'Singular effectiveness. You know what you bring, and you bring it consistently.',
      challenge: 'Over-reliance on one approach. Not every problem can be solved with the same tool.',
      handlePlanet,
    };
  }

  // LOCOMOTIVE: 240° arc with 120° gap
  if (circularSpan >= 200 && circularSpan <= 260 && maxGap >= 100 && maxGap <= 140) {
    const gapStart = sorted[maxGapIndex];
    const gapCenter = (gapStart + maxGap / 2) % 360;
    const gapSign = longitudeToSignName(gapCenter);

    return {
      shape: 'locomotive',
      name: 'Locomotive',
      description: `Planets span ${Math.round(circularSpan)}° with a ${Math.round(maxGap)}° gap — a driven life that compulsively fills empty space.`,
      lifeStrategy: 'You are momentum incarnate. The gap in your chart is not absence but destination — you are constantly moving toward what is missing, driven by an inner engine that never idles.',
      strength: 'Unstoppable drive and the ability to accomplish what others abandon. You finish what you start.',
      challenge: `The ${gapSign} area is where you feel incomplete. You may overcompensate by chasing what can only be found within.`,
      gapSign,
    };
  }

  // SEESAW: Two distinct groups in opposition
  const group1: number[] = [];
  const group2: number[] = [];
  const midpoint = sorted[0] + 180;
  for (const lon of sorted) {
    const dist = ((lon - midpoint + 540) % 360) - 180;
    if (dist < 0) group1.push(lon);
    else group2.push(lon);
  }
  if (group1.length >= 3 && group2.length >= 3 && group1.length <= group2.length + 2 && group2.length <= group1.length + 2) {
    return {
      shape: 'seesaw',
      name: 'Seesaw',
      description: 'Two groups of planets in dynamic opposition — a life of negotiation and balancing forces.',
      lifeStrategy: 'You are the mediator between worlds. Your life is a constant negotiation between opposing needs, and your greatest skill is finding the point of balance that honours both.',
      strength: 'Diplomacy and the ability to see all sides. You are the bridge others walk across.',
      challenge: 'Indecision and the exhaustion of perpetual compromise. Sometimes a side must be chosen.',
    };
  }

  return {
    shape: 'none',
    name: 'Open Pattern',
    description: 'Planets distributed without a dominant shape — a flexible, adaptive life architecture.',
    lifeStrategy: 'You are not bound by a single strategy. Your chart invites improvisation, responding to circumstance rather than following a fixed pattern.',
    strength: 'Freedom and adaptability. You can be whoever the moment requires.',
    challenge: 'Lack of clear direction. The absence of structure can feel like the absence of purpose.',
  };
}

/** Convert longitude to sign name (approximate) */
function longitudeToSignName(longitude: number): string {
  const signs = [
    'aries', 'taurus', 'gemini', 'cancer',
    'leo', 'virgo', 'libra', 'scorpio',
    'ophiuchus', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ];
  // 13-sign approx: 360 / 13 ≈ 27.69° per sign, but actual boundaries vary
  // Using simplified 13-sign mapping for shape descriptions
  const idx = Math.floor(((longitude % 360) / 360) * 13) % 13;
  return signs[idx];
}
