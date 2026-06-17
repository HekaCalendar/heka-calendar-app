/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PATTERN INTERPRETATION ENGINE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Transforms detected chart patterns (Grand Trines, T-Squares, Stelliums, etc.)
 * into rich, personalised narratives by combining pattern archetypes with
 * planet-specific template data.
 *
 * Core insight: A Grand Trine in Fire with Sun-Mars-Jupiter means something
 * radically different from a Grand Trine in Water with Moon-Neptune-Venus.
 * The pattern provides the structure; the planets provide the content.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { ChartPattern } from '../../calculations/patternDetection';


export interface EnrichedPattern {
  type: string;
  name: string;
  planets: string[];
  strength: number;
  narrative: string;
  advice: string[];
  elementalTheme?: string;
  modalTheme?: string;
  powerDynamics: string;
  shadowWarning: string;
}

/** Generate a rich interpretation of a detected pattern using template data */
export function interpretPattern(pattern: ChartPattern): EnrichedPattern {
  const planetData = pattern.planets.map(p => {
    // Find the template for this planet in its current sign
    // (Sign info must be provided externally or looked up from current positions)
    return { id: p, sign: '' }; // Sign will be injected by caller
  });

  switch (pattern.type) {
    case 'grand_trine':
      return interpretGrandTrine(pattern, planetData);
    case 't_square':
      return interpretTSquare(pattern, planetData);
    case 'yod':
      return interpretYod(pattern, planetData);
    case 'stellium':
      return interpretStellium(pattern, planetData);
    case 'grand_cross':
      return interpretGrandCross(pattern, planetData);
    case 'kite':
      return interpretKite(pattern, planetData);
    case 'mystic_rectangle':
      return interpretMysticRectangle(pattern, planetData);
    case 'cradle':
      return interpretCradle(pattern, planetData);
    case 'thors_hammer':
      return interpretThorsHammer(pattern, planetData);
    default:
      return interpretGeneric(pattern, planetData);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PATTERN-SPECIFIC INTERPRETERS
// ═══════════════════════════════════════════════════════════════════════════════

function interpretGrandTrine(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  const planets = pattern.planets;
  const element = extractElementFromPatternName(pattern.name);

  const elementNarratives: Record<string, string> = {
    fire: `A river of fire flows between ${joinPlanets(planets)}. This is not effort — it is birthright. What others struggle to ignite, you spark without thought. The danger is not failure but complacency: when everything comes easily, growth stops. Challenge yourself before life does.`,
    earth: `A triangle of stone anchors ${joinPlanets(planets)}. This is the architecture of mastery — what you build endures. Your gift is patience made tangible. The risk is rigidity: even mountains erode. Stay open to what cannot be planned.`,
    air: `A circuit of wind connects ${joinPlanets(planets)}. Ideas flow between you like breath. Your mind is a network that others tap into without knowing why. The trap is abstraction: genius that never lands is merely noise. Ground your insights in action.`,
    water: `A current of feeling circulates between ${joinPlanets(planets)}. You feel what others cannot name, heal what others cannot touch. Your depth is your gift. The shadow is drowning: empathy without boundaries is self-destruction. Learn to feel without absorbing.`,
    ether: `A bridge of quintessence links ${joinPlanets(planets)}. You move between worlds — seen and unseen, known and mysterious — with an ease that others call magic. Your gift is translation between dimensions. The challenge is grounding: even angels need roots.`,
  };

  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: elementNarratives[element] || elementNarratives.fire,
    advice: [
      'Your natural talent in this area is real — do not waste it.',
      'Seek challenges that force you out of this comfortable flow.',
      'Share your gift with others; it grows when given away.',
      'Watch for laziness disguised as ease.',
    ],
    elementalTheme: element,
    powerDynamics: 'Effortless flow and natural talent. The planets support each other without friction.',
    shadowWarning: 'Complacency. What comes easily is often taken for granted until it is gone.',
  };
}

function interpretTSquare(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  const apex = pattern.planets[0];
  const opposition = pattern.planets.slice(1);

  const apexNarratives: Record<string, string> = {
    sun: 'Your very identity is forged in conflict. The T-Square apex at the Sun means you become yourself through struggle. Each crisis reveals a deeper layer of who you are.',
    moon: 'Your emotional life is the battlefield. The Moon as apex means feelings are not safe — they are the site of your greatest growth. You heal others by healing what broke you.',
    mercury: 'Your mind is the pressure point. Mercury as apex thinks its way through impossible problems. Your greatest insights arrive in the middle of breakdown.',
    venus: 'Love is not comfort — it is crucible. Venus as apex means relationships force your evolution. You learn who you are through who you love and lose.',
    mars: 'Action is your only relief. Mars as apex must move, must fight, must push through. Your anger is information; your drive is medicine.',
    jupiter: 'Your faith is tested. Jupiter as apex means expansion comes through limitation. You grow most when you believe least.',
    saturn: 'You are the mountain that others climb. Saturn as apex means responsibility is not imposed — it is your nature. Your discipline is the resolution others seek.',
    uranus: 'Your difference is the solution. Uranus as apex means the unconventional approach is the only one that works. Rebel with purpose.',
    neptune: 'Your confusion is sacred. Neptune as apex dissolves what must dissolve. You find truth by letting go of the need to know.',
    pluto: 'Your destruction is creation. Pluto as apex transforms by burning. What dies through you is reborn through you.',
    chiron: 'Your wound is the doorway. Chiron as apex means healing happens by going deeper into pain, not away from it.',
    northNode: 'Your destiny is the fight. North Node as apex means the path forward is the most difficult one. Choose it anyway.',
    lilith: 'Your exile is your throne. Lilith as apex means what was banished becomes your power. Reclaim what they told you to hide.',
  };

  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: apexNarratives[apex] || `The apex planet (${apex}) is where the tension concentrates. This is not a flaw in your chart — it is the engine of your evolution.`,
    advice: [
      `Develop the qualities of ${apex} deliberately — this is your growth edge.`,
      `The empty leg opposite ${apex} holds what you need to integrate.`,
      'Crisis is not failure — it is the mechanism of this pattern.',
      'Channel tension into constructive action before it becomes destructive.',
    ],
    powerDynamics: `Dynamic tension between ${joinPlanets(opposition)} forces ${apex} to act. The pressure is constant but generative.`,
    shadowWarning: 'Burnout from perpetual crisis. The T-Square person must learn to rest without collapsing.',
  };
}

function interpretYod(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  const apex = pattern.planets[0];

  const apexNarratives: Record<string, string> = {
    sun: 'Your very existence is the mission. The Yod apex at the Sun means your identity itself is the answer to a question the world has been asking.',
    moon: 'Your feelings are the compass. The Moon as apex means emotional truth — not logic — guides your fated path. Trust what you feel before you understand it.',
    mercury: 'Your words change worlds. Mercury as apex means communication is your spiritual assignment. Speak even when no one seems to listen.',
    venus: 'Your love is the healing. Venus as apex means relationship is not optional — it is the vehicle of your destiny.',
    mars: 'Your action is the prayer. Mars as apex means doing, not thinking, resolves the karmic equation. Move before you are ready.',
    jupiter: 'Your vision is the map. Jupiter as apex means faith — not evidence — is your navigational system. Believe bigger.',
    saturn: 'Your structure is the sanctuary. Saturn as apex means discipline becomes devotion. Build what outlasts your doubt.',
    uranus: 'Your difference is the design. Uranus as apex means the very thing that makes you strange is what the world needs most.',
    neptune: 'Your dream is the directive. Neptune as apex means the invisible guides the visible. Follow the thread that has no end.',
    pluto: 'Your death is the door. Pluto as apex means transformation is not an event — it is your address. Live where others fear to visit.',
    chiron: 'Your wound is the way. Chiron as apex means the healer heals by being healed. Your medicine is your own brokenness made whole.',
    northNode: 'Your future is the fix. North Node as apex means the path you fear most is the only one that leads home.',
    lilith: 'Your exile is the entrance. Lilith as apex means what was cast out becomes the key. Return to what you were forbidden.',
  };

  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: apexNarratives[apex] || `The Finger of God points to ${apex}. This is not a comfortable configuration — it is a compass that only points in one direction, and that direction is your soul's assignment.`,
    advice: [
      `The ${apex} area of your life carries fated significance — pay extraordinary attention.`,
      'The sextile base provides resources; the quincunxes demand constant adjustment.',
      'This pattern activates around ages 40-42 (Yod activation by transiting nodes).',
      'Your discomfort is not malfunction — it is the feeling of destiny knocking.',
    ],
    powerDynamics: 'Fated adjustment. The apex is constantly pressured to evolve in a specific direction.',
    shadowWarning: 'Avoidance of the calling. The Yod person who refuses the mission experiences perpetual restlessness.',
  };
}

function interpretStellium(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  const sign = extractSignFromPatternName(pattern.name);
  const planets = pattern.planets;

  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: `A constellation of ${planets.length} planets converges in ${sign}. This is not concentration — it is supernova. The ${sign} area of your life dominates your chart like a sun dominates its system. You cannot escape it, and you were never meant to. Your mastery here is extraordinary; your blindness here is equally total. What you see most clearly, you see alone. What you miss, everyone else sees.`,
    advice: [
      `This stellium is your superpower and your blindspot. Cultivate both awareness and humility.`,
      'The concentration of energy here can overshadow other life areas — make conscious space for balance.',
      'Your authority in this domain is real. Do not apologise for what you know.',
      'Seek feedback from those who lack this concentration — they see what you cannot.',
    ],
    powerDynamics: `Extraordinary focus of ${planets.length} planetary energies in one sign. Total immersion.`,
    shadowWarning: 'Imbalance and the neglect of everything outside the stellium. Narrow brilliance can become narrow blindness.',
  };
}

function interpretGrandCross(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: `Four forces pull at you simultaneously: ${joinPlanets(pattern.planets)}. This is not a chart — it is a crucible. Every direction is correct; every direction is wrong. The Grand Cross does not ask you to choose; it asks you to become large enough to hold all four. You are not meant to resolve the tension but to transmute it.`,
    advice: [
      'You are stronger than you believe. This pattern forges resilience through constant challenge.',
      'Each arm of the cross is a teacher. Do not abandon any of them.',
      'Retreat is not escape — it is necessary maintenance. Schedule it.',
      'Your greatest achievements come from integrating opposites, not choosing between them.',
    ],
    powerDynamics: 'Four-way tension requiring constant balance. Immense resilience potential.',
    shadowWarning: 'Exhaustion from perpetual crisis management. The Grand Cross person must learn that not every fire needs fighting.',
  };
}

function interpretKite(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: `The Grand Trine's lazy talent finds its purpose through the opposition. What flows effortlessly now has direction — the Kite transforms blessing into mission. ${joinPlanets(pattern.planets)} work together not merely to bless you, but to give your gifts away.`,
    advice: [
      'Your natural talent has found its outlet. Use it deliberately.',
      'The opposition is not a problem — it is the purpose. It gives your flow a destination.',
      'Do not take your gifts for granted. What comes easily is still sacred.',
      'Share your talent. The Kite is made to fly, not to stay grounded.',
    ],
    powerDynamics: 'Natural flow (trine) directed by tension (opposition) into purposeful expression.',
    shadowWarning: 'Still at risk of complacency. The Kite flies only when the wind of intention blows.',
  };
}

function interpretMysticRectangle(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: `Opposition and harmony dance together through ${joinPlanets(pattern.planets)}. This is the pattern of the diplomat, the healer, the one who sees all sides and finds the path between. Your life is not free of conflict — but conflict resolves around you with an ease that others find mysterious.`,
    advice: [
      'Your gift is graceful problem-solving. Do not waste it on problems that are not yours.',
      'The oppositions are real — do not pretend they do not exist. Your skill is in navigating them, not denying them.',
      'Others will seek your mediation. Choose when to say yes and when to protect your energy.',
      'Your peace is a practice, not a given. Maintain it with intention.',
    ],
    powerDynamics: 'Opposing forces gracefully mediated by harmonious aspects. Natural diplomacy.',
    shadowWarning: 'Conflict avoidance disguised as harmony. Not every problem wants to be solved gracefully.',
  };
}

function interpretCradle(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: `Three sextiles and a trine embrace ${joinPlanets(pattern.planets)} in a protective container. You are held. The Cradle is the pattern of the favoured child — not because life is easy, but because support arrives before you know you need it. Your challenge is to grow beyond the container.`,
    advice: [
      'Your support system is real and present. Do not isolate from it.',
      'The container that protects you can also limit you. Know when to break the shell.',
      'Your natural charm opens doors. Make sure you walk through them.',
      'Comfort is not the enemy — but neither is it the destination.',
    ],
    powerDynamics: 'Supportive container that protects and nurtures. Natural charm and likeability.',
    shadowWarning: 'Staying too long in safety. The Cradle person must eventually leave the nest.',
  };
}

function interpretThorsHammer(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: `Two squares and a sesquiquadrate form a hammer through ${joinPlanets(pattern.planets)}. This is not gentle persuasion — it is the force that breaks stone. You possess an almost obsessive drive to shatter obstacles. Used consciously, you are unstoppable. Used unconsciously, you are destructive.`,
    advice: [
      'Channel the hammer, do not swing it blindly. Know what deserves breaking.',
      'Your drive is real and powerful. Give it worthy targets.',
      'The sesquiquadrate creates urgency without completion. Build the structure to finish what you start.',
      'Rest is not surrender. Even Thor puts down his hammer.',
    ],
    powerDynamics: 'Intense driving force capable of breakthrough. Obsessive energy.',
    shadowWarning: 'Destructive force when misdirected. The hammer breaks what it touches.',
  };
}

function interpretGeneric(
  pattern: ChartPattern,
  _planetData: Array<{ id: string; sign: string }>
): EnrichedPattern {
  return {
    type: pattern.type,
    name: pattern.name,
    planets: pattern.planets as string[],
    strength: pattern.strength,
    narrative: pattern.interpretation || `${pattern.name} involves ${joinPlanets(pattern.planets)}. This configuration shapes your experience in significant ways.`,
    advice: pattern.lifeThemes || ['Pay attention to this pattern in your life.', 'Notice where it repeats.', 'Work with it consciously.'],
    powerDynamics: 'Significant planetary configuration affecting life themes.',
    shadowWarning: 'Unconscious patterns repeat until they are recognised.',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function joinPlanets(planets: readonly string[]): string {
  if (planets.length === 0) return '';
  if (planets.length === 1) return planets[0];
  if (planets.length === 2) return `${planets[0]} and ${planets[1]}`;
  return `${planets.slice(0, -1).join(', ')}, and ${planets[planets.length - 1]}`;
}

function extractElementFromPatternName(name: string): string {
  const match = name.match(/in\s+(Fire|Earth|Air|Water|Ether)/i);
  return match ? match[1].toLowerCase() : 'fire';
}

function extractSignFromPatternName(name: string): string {
  const match = name.match(/(\w+)\s+Stellium/);
  return match ? match[1] : 'unknown';
}

/** Batch-interpret multiple patterns, returning the most significant ones */
export function interpretAllPatterns(
  patterns: ChartPattern[],
  maxResults = 5
): EnrichedPattern[] {
  const enriched = patterns.map(p => interpretPattern(p));
  // Sort by strength and deduplicate by type
  const seen = new Set<string>();
  return enriched
    .sort((a, b) => b.strength - a.strength)
    .filter(p => {
      const key = `${p.type}-${p.planets.sort().join('-')}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, maxResults);
}
