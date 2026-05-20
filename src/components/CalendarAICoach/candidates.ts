/**
 * Message Candidate Generator — Extracted from CalendarAICoach
 * Builds weighted candidate messages from the oracle context.
 */

import type { CandidateMessage, OracleContext } from '../../types/oracle';
import { getArchetypeDialect } from '../../oracle/archetypeEngine';
import {
  pickRandom,
  capitalize,
  getSignElement,
  getTimezoneName,
} from '../../utils/oracleUtils';
import { getTransitAdviceForTasks } from '../../services/transitService';
import {
  emitSelectDate,
  emitAddNote,
  emitCreateTask,
  emitJournal,
  emitNavigateToStars,
  emitTogglePureMode,
  emitOpenSearch,
  emitOpenStats,
  emitOpenCircle,
  emitOpenCommunity,
  emitOpenYear,
} from './emitters';

function makeCandidate(id: string, overrides: Partial<CandidateMessage>): CandidateMessage {
  return {
    id,
    type: 'insight',
    text: '',
    icon: '✨',
    color: '#d4af37',
    topic: 'general',
    weight: 50,
    ...overrides,
  } as CandidateMessage;
}

function withArchetypeDialect(
  ctx: OracleContext,
  type: Parameters<typeof getArchetypeDialect>[1],
  fallback: string
): string {
  if (ctx.archetype.confidence < 0.3) return fallback;
  return getArchetypeDialect(ctx.archetype.name, type) || fallback;
}

interface PromptTemplate {
  text: string;
  icon: string;
  topic: string;
  color: string;
  action?: { label: string; onClick: () => void };
}

export function candidatesFromContext(ctx: OracleContext): CandidateMessage[] {
  const c: CandidateMessage[] = [];
  const { celestial, user, timeLabel, todayIso, dateKey } = ctx;

  // Bind emitters to the context's focused date so candidates are pure data
  const boundSelectDate = () => emitSelectDate(ctx.focusDate);
  const boundAddNote = () => emitAddNote(ctx.focusDate);
  const boundCreateTask = (suggested?: string) => emitCreateTask(ctx.focusDate, suggested);

  // ── STREAK DANGER (Highest Priority) ──────────────────────────────────────
  if (ctx.streakDanger) {
    c.push(makeCandidate(`streak-danger-${dateKey}`, {
      type: 'nudge',
      text: ctx.streakDanger.text,
      icon: ctx.streakDanger.icon,
      color: ctx.streakDanger.color,
      topic: 'streak-danger',
      weight: 110,
      action: { label: 'Save Streak', onClick: () => boundSelectDate() },
    }));
  }

  // ── MOOD SUPPORT (High Priority when declining) ───────────────────────────
  if (ctx.mood.shouldOfferSupport) {
    const moodMessages: Record<typeof ctx.mood.tone, string[]> = {
      gentle: [
        'I have been reading your recent entries. The weight is real, and you do not have to carry it alone today.',
        'The cosmos does not demand greatness from you every day. Sometimes presence is enough.',
        'I see the dimming. Please be as gentle with yourself as you would be with a friend.',
        'Your journal has whispered of struggle. Today, let one small kindness to yourself be the only task.',
      ],
      prophetic: [
        'Darkness is not the enemy; it is the womb of all becoming.',
        'The phoenix knows: the fire that burns also prepares the ground for renewal.',
      ],
      playful: [
        'Even the Moon takes a break from being full. You\'re allowed to be a crescent right now.',
        'The universe called. It said you\'re doing better than you think.',
      ],
      stern: [
        'The feeling is real, but it is not the final truth. Move one inch forward.',
        'You have survived every hard day so far. Do not quit on yourself now.',
      ],
      mysterious: [
        'There is a kind of alchemy that happens only in the dark. Trust the process you cannot yet see.',
        'Something is being rewritten in you. It hurts because it is important.',
      ],
    };
    c.push(makeCandidate(`mood-support-${dateKey}`, {
      type: 'nudge',
      text: pickRandom(moodMessages[ctx.mood.tone]),
      icon: '🫂',
      color: '#ec4899',
      topic: 'mood-support',
      weight: ctx.mood.declineSeverity === 'severe' ? 100 : 85,
      action: { label: 'Write It Out', onClick: () => emitJournal('What I need right now: ') },
    }));
  }

  // ── ARCHETYPE GREETING (Occasional, when confidence is high) ──────────────
  if (ctx.archetype.confidence >= 0.5) {
    const greeting = withArchetypeDialect(ctx, 'greeting', ctx.greeting);
    if (greeting !== ctx.greeting) {
      c.push(makeCandidate(`archetype-greeting-${dateKey}`, {
        type: 'insight',
        text: greeting,
        icon: '🔮',
        color: '#d946ef',
        topic: 'archetype',
        weight: 35,
      }));
    }
  }

  // ── VOID MOON FILTER ──────────────────────────────────────────────────────
  if (ctx.isVoidMoon) {
    const vocText = ctx.timeMode === 'TRUE'
      ? `The Moon is void of course by the fixed stars. In TRUE HEKA time, this wandering is not error — it is the universe breathing between breaths. Finish what is already in motion.`
      : `The Moon is void of course. New beginnings cast now may wander. Finish what is already in motion.`;
    c.push(makeCandidate(`voc-${dateKey}`, {
      type: 'celestial',
      text: vocText,
      icon: '🌫️',
      color: '#a1a1aa',
      topic: 'void-moon',
      weight: 40,
      action: { label: 'Complete a Task', onClick: () => boundSelectDate() },
    }));
  }

  // ── PERSONAL TRANSITS ────────────────────────────────────────────────────
  if (ctx.transit.hasBirthChart && ctx.transit.topTransit) {
    const top = ctx.transit.topTransit;
    const planetEmoji: Record<string, string> = {
      sun: '☀️', moon: '🌙', mercury: '☿️', venus: '♀️', mars: '♂️',
      jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
    };
    const aspectVerb: Record<string, string> = {
      conjunction: 'is conjunct',
      opposition: 'opposes',
      trine: 'trines',
      square: 'squares',
      sextile: 'forms a sextile to',
    };
    const transitVerb = aspectVerb[top.aspect.toLowerCase()] || `${top.aspect}s`;
    c.push(makeCandidate(`transit-${top.transitingPlanet}-${top.natalPlanet}-${dateKey}`, {
      type: 'celestial',
      text: top.interpretation,
      icon: planetEmoji[top.transitingPlanet.toLowerCase()] || '✨',
      color: top.isChallenging ? '#f59e0b' : top.isSupportive ? '#22c55e' : '#8b5cf6',
      topic: 'transit',
      weight: top.strength > 70 ? 65 : 55,
      action: { label: 'Reflect', onClick: () => emitJournal(`${top.transitingPlanet} ${transitVerb} my natal ${top.natalPlanet}:\n\n`) },
    }));

    // Transit-based task advice
    const transitAdvice = getTransitAdviceForTasks(ctx.transit);
    c.push(makeCandidate(`transit-advice-${dateKey}`, {
      type: 'plan',
      text: transitAdvice,
      icon: '📅',
      color: ctx.transit.overallTone === 'friction' ? '#ef4444' : ctx.transit.overallTone === 'flow' ? '#22c55e' : '#3b82f6',
      topic: 'transit',
      weight: 55,
      action: { label: 'Plan Today', onClick: () => boundSelectDate() },
    }));
  }

  // ── CELESTIAL PRIORITIES ─────────────────────────────────────────────────

  // Expanded moon phase insights with distinct topics so they don't block each other
  const moonPhaseMap: Record<string, { icon: string; color: string; texts: string[]; topics: string[] }> = {
    full: {
      icon: '🌕', color: '#fbbf24',
      texts: [
        `The Full Moon burns in ${celestial.moonSign}. What has been hidden in shadow now demands to be seen.`,
        `Illumination peaks in ${celestial.moonSign}. This is the hour of culmination, not concealment.`,
      ],
      topics: ['moon-full', 'moon-full-2'],
    },
    new: {
      icon: '🌑', color: '#a1a1aa',
      texts: [
        `The sky is dark. The New Moon in ${celestial.moonSign} is the most potent moment to whisper a wish to the void.`,
        `A blank slate in ${celestial.moonSign}. Plant one seed before dawn breaks again.`,
      ],
      topics: ['moon-new', 'moon-new-2'],
    },
    waxing_crescent: {
      icon: '🌒', color: '#f59e0b',
      texts: [
        `The Moon is a thin blade of light in ${celestial.moonSign}. Gather your resources. The real push comes later.`,
        `Waxing crescent in ${celestial.moonSign}. Hope is not naive here — it is structural.`,
      ],
      topics: ['moon-waxing-crescent', 'moon-waxing-crescent-2'],
    },
    first_quarter: {
      icon: '🌓', color: '#f59e0b',
      texts: [
        `First Quarter Moon in ${celestial.moonSign}. Crisis of action. You must decide and move.`,
        `Half-lit in ${celestial.moonSign}. The obstacle is not the enemy; it is the test.`,
      ],
      topics: ['moon-first-quarter', 'moon-first-quarter-2'],
    },
    waxing_gibbous: {
      icon: '🌔', color: '#fbbf24',
      texts: [
        `Waxing gibbous in ${celestial.moonSign}. Refine what you have built. Perfection is the final spell.`,
        `The light is almost complete in ${celestial.moonSign}. What detail have you been avoiding?`,
      ],
      topics: ['moon-waxing-gibbous', 'moon-waxing-gibbous-2'],
    },
    waning_gibbous: {
      icon: '🌖', color: '#8b5cf6',
      texts: [
        `Waning gibbous in ${celestial.moonSign}. Gratitude is a form of magic. What has already come true?`,
        `The light begins to recede in ${celestial.moonSign}. Share what you know before it fades.`,
      ],
      topics: ['moon-waning-gibbous', 'moon-waning-gibbous-2'],
    },
    last_quarter: {
      icon: '🌗', color: '#6366f1',
      texts: [
        `Last Quarter Moon in ${celestial.moonSign}. Release what you cannot carry into the next cycle.`,
        `Half-shadow in ${celestial.moonSign}. The crisis now is one of letting go, not holding on.`,
      ],
      topics: ['moon-last-quarter', 'moon-last-quarter-2'],
    },
    waning_crescent: {
      icon: '🌘', color: '#6366f1',
      texts: [
        `Waning crescent in ${celestial.moonSign}. Rest is not surrender — it is preparation.`,
        `The old moon breathes in ${celestial.moonSign}. Dream, restore, and wait for the dark to turn.`,
      ],
      topics: ['moon-waning-crescent', 'moon-waning-crescent-2'],
    },
    waxing: {
      icon: '🌒', color: '#f59e0b',
      texts: [
        `The Moon is waxing in ${celestial.moonSign}. Energy is building. What are you growing?`,
        `Increasing light in ${celestial.moonSign}. Add, expand, and believe in momentum.`,
      ],
      topics: ['moon-waxing', 'moon-waxing-2'],
    },
    waning: {
      icon: '🌖', color: '#8b5cf6',
      texts: [
        `The Moon is waning in ${celestial.moonSign}. Subtract, simplify, and give thanks.`,
        `Decreasing light in ${celestial.moonSign}. What can you release before the sky goes dark?`,
      ],
      topics: ['moon-waning', 'moon-waning-2'],
    },
  };

  const moonData = moonPhaseMap[celestial.moonPhase];
  if (moonData) {
    moonData.texts.forEach((text, i) => {
      c.push(makeCandidate(`${moonData.topics[i]}-${dateKey}`, {
        type: 'celestial',
        text,
        icon: moonData.icon,
        color: moonData.color,
        topic: moonData.topics[i],
        weight: 45,
        action: { label: 'Write Reflection', onClick: () => emitJournal(`Moon reflection:

`) },
      }));
    });
  }

  // Retrograde insights
  if (celestial.retrogrades.length > 0) {
    celestial.retrogrades.forEach((planet, i) => {
      if (i > 1) return; // max 2 retrograde messages
      const retroTexts: Record<string, string[]> = {
        mercury: ctx.timeMode === 'TRUE' ? [
          `Mercury retrograde by the fixed stars. The messenger asks you to re-read what you thought you understood.`,
          `In TRUE mode, Mercury's backward dance is not confusion — it is the stars editing your script.`,
        ] : [
          `Mercury moves backward. Do not see this as delay — see it as the universe asking you to read the footnotes.`,
          `Mercury retrograde. Sentences unsent, plans revised, old messages resurfacing. Read twice, send once.`,
        ],
        venus: ctx.timeMode === 'TRUE' ? [
          `Venus retrograde in the sidereal sky. Love that you thought was finished may be waiting among the stars.`,
          `The fixed stars turn Venus back. What did you call beautiful before the world taught you otherwise?`,
        ] : [
          `Venus retrograde. Old loves, old values, old art. What is returning for a second look?`,
          `Venus turns back. Reconsider what you have called beautiful.`,
        ],
        mars: ctx.timeMode === 'TRUE' ? [
          `Mars retrograde under the fixed stars. Force will fail; strategy, patience, and stellar timing will not.`,
          `The warrior planet retreats in the true sky. Choose your battles with the precision of an astronomer.`,
        ] : [
          `Mars retrograde. Force will fail you now, but strategy will not.`,
          `Mars moves backward. Pick your battles with twice the care.`,
        ],
        jupiter: [
          `Jupiter turns back. A belief you abandoned may deserve reconsideration.`,
          `Jupiter retrograde. Where did you stop expanding because you grew afraid?`,
        ],
        saturn: [
          `Saturn retrograde. The boundaries you built — are they still yours?`,
          `Saturn moves backward. Structure is being tested, not destroyed.`,
        ],
      };
      const texts = retroTexts[planet] || [`${planet} is retrograde. Review rather than initiate.`];
      texts.forEach((text, idx) => {
        c.push(makeCandidate(`retro-${planet}-${idx}-${dateKey}`, {
          type: 'celestial',
          text,
          icon: '℞',
          color: '#ef4444',
          topic: `retrograde-${planet}-${idx}`,
          weight: 40 - (idx * 3),
          action: { label: 'Reflect', onClick: () => emitJournal(`Reviewing ${planet} retrograde: `) },
        }));
      });
    });
  }

  // Element-based insight
  if (celestial.dominantElement !== 'unknown') {
    const elementTexts: Record<string, string[]> = ctx.timeMode === 'TRUE' ? {
      fire: [
        `The Sun burns in fire by the fixed stars. Your sidereal fire demands direction — aim the flame precisely.`,
        `TRUE mode fire day. The stars do not bless reckless action; they bless conscious ignition.`,
      ],
      water: [
        `The day's element is water in the true sky. Emotions are stellar currents — swim with the fixed stars.`,
        `Water day under the fixed stars. Intuition is not imagination; it is memory of the cosmos.`,
      ],
      earth: [
        `Earth rules the sidereal sky today. Build something the stars can anchor to.`,
        `TRUE mode earth day. Ground yourself in what the fixed stars have always known.`,
      ],
      air: [
        `Air dominates the true sky. Ideas travel at the speed of starlight. Capture one before it reaches another mind.`,
        `Air day in sidereal time. Words are not spells — they are coordinates in the celestial map.`,
      ],
    } : {
      fire: [
        `The Sun burns in fire. Passion is available, but it needs a direction. Where will you aim the flame?`,
        `Fire day. Action is blessed, but only if it is conscious. Strike the match with intention.`,
      ],
      water: [
        `The day's element is water. Emotions are currents — swim with them, not against.`,
        `Water day. Intuition is louder than logic right now. Listen beneath the surface.`,
      ],
      earth: [
        `Earth rules the sky today. Build something tangible. The abstract can wait.`,
        `Earth day. Ground yourself in the senses. One practical step outweighs a thousand plans.`,
      ],
      air: [
        `Air dominates. Ideas travel fast. Capture one before it dissipates.`,
        `Air day. Words are spells. Speak with precision and kindness.`,
      ],
    };
    elementTexts[celestial.dominantElement].forEach((text, i) => {
      c.push(makeCandidate(`element-${celestial.dominantElement}-${i}-${dateKey}`, {
        type: 'insight',
        text,
        icon: celestial.dominantElement === 'fire' ? '🔥' : celestial.dominantElement === 'water' ? '🌊' : celestial.dominantElement === 'earth' ? '🏔️' : '💨',
        color: '#8b5cf6',
        topic: `element-${celestial.dominantElement}-${i}`,
        weight: 55,
      }));
    });
  }

  // Day-of-week planetary ruler
  const dayOfWeek = new Date().getDay();
  const dowPlanets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'];
  const dowSymbols: Record<string, string> = { sun: '☉', moon: '☽', mars: '♂', mercury: '☿', jupiter: '♃', venus: '♀', saturn: '♄' };
  const dowMessages: Record<string, string[]> = {
    sun: ['Sunday belongs to the Sun. Visibility, vitality, and leadership are favored. Shine deliberately.'],
    moon: ['Monday is the Moon\'s day. Tend to emotional housekeeping and intuitive work.'],
    mars: ['Tuesday is Mars\' day. Courage and competition are available — use them, do not waste them.'],
    mercury: ['Wednesday is Mercury\'s day. Words, contracts, and quick thinking travel farthest now.'],
    jupiter: ['Thursday is Jupiter\'s day. Expand something: your mind, your generosity, or your vision.'],
    venus: ['Friday is Venus\' day. Beauty, connection, and pleasure are not luxuries today — they are rites.'],
    saturn: ['Saturday is Saturn\'s day. Structure, discipline, and completion. Do what you have been avoiding.'],
  };
  const dowPlanet = dowPlanets[dayOfWeek];
  dowMessages[dowPlanet].forEach((text) => {
    c.push(makeCandidate(`dow-${dowPlanet}-${dateKey}`, {
      type: 'insight',
      text,
      icon: dowSymbols[dowPlanet] || '✨',
      color: '#d4af37',
      topic: `dow-${dowPlanet}`,
      weight: 30,
    }));
  });

  // Zodiac season / Sun sign insight
  if (celestial.sunSign) {
    const sunSignMessages: Record<string, string[]> = {
      aries: ['The Sun is in Aries. Beginnings are not just allowed — they are commanded.'],
      taurus: ['The Sun is in Taurus. Slow down. What you build with patience will outlast what you rush.'],
      gemini: ['The Sun is in Gemini. Curiosity is the highest form of respect today.'],
      cancer: ['The Sun is in Cancer. Nourishment — of self, of home, of memory — is the real work.'],
      leo: ['The Sun is in Leo. You do not need permission to take up space.'],
      virgo: ['The Sun is in Virgo. Order is not obsession; it is a kindness to your future self.'],
      libra: ['The Sun is in Libra. Every choice is a vote for the kind of world you want to live in.'],
      scorpio: ['The Sun is in Scorpio. Surface-level will not satisfy you today. Go deeper.'],
      ophiuchus: ['The Sun is in Ophiuchus. Healing is not a destination — it is a frequency you learn to hold.'],
      sagittarius: ['The Sun is in Sagittarius. The horizon is not an escape — it is a destination.'],
      capricorn: ['The Sun is in Capricorn. Climb, but climb with integrity. The summit remembers how you got there.'],
      aquarius: ['The Sun is in Aquarius. The future is not a place; it is a decision made repeatedly.'],
      pisces: ['The Sun is in Pisces. Boundaries dissolve today. Art, dreams, and compassion are portals.'],
    };
    (sunSignMessages[celestial.sunSign] || ['The Sun is traveling through the zodiac. Every season has its secret.']).forEach((text) => {
      c.push(makeCandidate(`sun-sign-${celestial.sunSign}-${dateKey}`, {
        type: 'insight',
        text,
        icon: '☉',
        color: '#f59e0b',
        topic: `sun-sign-${celestial.sunSign}`,
        weight: 48,
      }));
    });
  }

  // ── ADVANCED CELESTIAL INSIGHTS (Swiss Ephemeris) ────────────────────────

  // Live planetary aspects
  if (celestial.currentAspects && celestial.currentAspects.length > 0) {
    const topAspects = celestial.currentAspects.slice(0, 3);
    topAspects.forEach((asp, i) => {
      const qualityColor = asp.nature === 'harmonious' ? '#22c55e' : asp.nature === 'challenging' ? '#f59e0b' : '#a1a1aa';
      c.push(makeCandidate(`aspect-${asp.planet1}-${asp.planet2}-${dateKey}`, {
        type: 'celestial',
        text: `${capitalize(asp.planet1)} ${asp.aspect}s ${capitalize(asp.planet2)} with an orb of ${Math.round(asp.orb * 100) / 100}°. ${asp.description}`,
        icon: '⚹',
        color: qualityColor,
        topic: `aspect-${asp.planet1}-${asp.planet2}`,
        weight: 45 - (i * 3),
        action: { label: 'Reflect', onClick: () => emitJournal(`${capitalize(asp.planet1)} ${asp.aspect} ${capitalize(asp.planet2)}:\n\n`) },
      }));
    });
  }

  // Critical degrees
  if (celestial.criticalDegrees && celestial.criticalDegrees.length > 0) {
    const topCritical = celestial.criticalDegrees[0];
    const isAnaretic = topCritical.type === 'anaretic';
    c.push(makeCandidate(`critical-degree-${topCritical.planet}-${dateKey}`, {
      type: 'celestial',
      text: `${capitalize(topCritical.planet)} sits at ${Math.round(topCritical.degree * 100) / 100}° — a ${topCritical.type} degree.${isAnaretic ? ' Urgency and culmination hang in the air.' : ' A threshold is being crossed.'} ${topCritical.description}`,
      icon: '🔥',
      color: isAnaretic ? '#ef4444' : '#f59e0b',
      topic: `critical-degree-${topCritical.planet}`,
      weight: isAnaretic ? 55 : 50,
      action: { label: 'Journal This', onClick: () => emitJournal(`${capitalize(topCritical.planet)} at a ${topCritical.type} degree:\n\n`) },
    }));
  }

  // Moon illumination & speed insights
  if (celestial.moonDetails) {
    const { illumination, speed } = celestial.moonDetails;
    if (illumination > 98) {
      c.push(makeCandidate(`moon-illumination-full-${dateKey}`, {
        type: 'celestial',
        text: `The Moon is ${illumination}% illuminated — almost perfectly full. Emotions run high and truths surface quickly.`,
        icon: '🌕',
        color: '#fbbf24',
        topic: 'moon-illumination',
        weight: 40,
      }));
    } else if (illumination < 2) {
      c.push(makeCandidate(`moon-illumination-new-${dateKey}`, {
        type: 'celestial',
        text: `The Moon is nearly dark — ${illumination}% illuminated. The void is fertile for seeds you plant in silence.`,
        icon: '🌑',
        color: '#a1a1aa',
        topic: 'moon-illumination',
        weight: 40,
      }));
    }
    if (Math.abs(speed) > 14) {
      c.push(makeCandidate(`moon-fast-${dateKey}`, {
        type: 'celestial',
        text: `The Moon is moving rapidly (${speed}°/day). Events accelerate; moods shift quickly. Ride the current without oversteering.`,
        icon: '💨',
        color: '#3b82f6',
        topic: 'moon-speed',
        weight: 30,
      }));
    } else if (Math.abs(speed) < 12) {
      c.push(makeCandidate(`moon-slow-${dateKey}`, {
        type: 'celestial',
        text: `The Moon is slow today (${speed}°/day). Feelings linger; depth replaces speed. Sit with what arises.`,
        icon: '🐢',
        color: '#8b5cf6',
        topic: 'moon-speed',
        weight: 30,
      }));
    }
  }

  // Lunar nodes
  if (celestial.lunarNodes && celestial.lunarNodes.north) {
    c.push(makeCandidate(`lunar-nodes-${dateKey}`, {
      type: 'insight',
      text: `The North Node calls from ${capitalize(celestial.lunarNodes.north)}. Growth lies in that direction. The South Node in ${capitalize(celestial.lunarNodes.south)} holds your familiar past — visit, but do not stay.`,
      icon: '☊',
      color: '#d946ef',
      topic: 'lunar-nodes',
      weight: 25,
      action: { label: 'Write the Path', onClick: () => emitJournal('The North Node asks me to grow toward:\n\n') },
    }));
  }

  // Chiron
  if (celestial.chiron) {
    c.push(makeCandidate(`chiron-${dateKey}`, {
      type: 'insight',
      text: `Chiron, the wounded healer, moves through ${capitalize(celestial.chiron.sign)} at ${celestial.chiron.degree}°. Where you have been hurt, you may also become medicine.`,
      icon: '🗝️',
      color: '#14b8a6',
      topic: 'chiron',
      weight: 30,
      action: { label: 'Heal in Journal', onClick: () => emitJournal('A wound I am learning to turn into medicine:\n\n') },
    }));
  }

  // ── TASK CELEBRATIONS ────────────────────────────────────────────────────

  if (user.todayCompleted > 0) {
    const archetypeCelebration = withArchetypeDialect(ctx, 'celebration', '');
    const celebrations = archetypeCelebration
      ? [
          archetypeCelebration,
          'I felt that completion from here. The celestial ledger has been updated.',
          `You moved energy today under a ${celestial.moonPhase.replace('-', ' ')} moon. That timing matters.`,
        ]
      : [
          'The loom trembled. You have woven another thread into the tapestry.',
          'I felt that completion from here. The celestial ledger has been updated.',
          'Task finished. Watch how the universe begins to trust you more.',
          'One sacred step closer. Mars nods in approval.',
          `You moved energy today under a ${celestial.moonPhase.replace('-', ' ')} moon. That timing matters.`,
        ];
    c.push(makeCandidate(`celebrate-task-${dateKey}`, {
      type: 'celebration',
      text: pickRandom(celebrations),
      icon: '✨',
      color: '#22c55e',
      topic: 'celebration',
      weight: 80,
    }));
  }

  if (user.streak >= 2) {
    const streakTexts: Record<number, string> = {
      3: 'Three days. A triangle of will. What are you stabilizing?',
      5: 'Five days. A pentagram of discipline. What are you summoning?',
      7: 'Seven days strong. The stars are watching.',
      14: 'Two weeks of showing up. You are becoming unavoidable to your own destiny.',
      21: 'Twenty-one days — a habit is being born in fire.',
      30: 'Thirty days. You have become the ritual itself.',
    };
    const milestone = Object.keys(streakTexts).map(Number).filter((n) => n <= user.streak).pop() || user.streak;
    const text = streakTexts[milestone] || `${user.streak}-day streak. Keep the flame alive.`;
    c.push(makeCandidate(`celebrate-streak-${user.streak}-${dateKey}`, {
      type: 'celebration',
      text,
      icon: '🔥',
      color: '#f97316',
      topic: 'streak',
      weight: 85,
    }));
  }

  // ── PENDING TASKS ────────────────────────────────────────────────────────

  if (user.pendingTasks > 0) {
    const pendingOpeners = [
      `The ${celestial.moonPhase.replace('-', ' ') || 'current'} moon illuminates unfinished work.`,
      `With the Sun in ${celestial.sunSign}, momentum favors completion over initiation.`,
      `The cosmos whispers: what is begun must be finished.`,
      `Your celestial queue is calling.`,
    ];
    const opener = pickRandom(pendingOpeners);
    const verbs = user.pendingTasks >= 3 ? ['conquer', 'tame', 'master'] : ['tend to', 'complete', 'honor'];
    const verb = pickRandom(verbs);
    c.push(makeCandidate(`pending-${user.pendingTasks}-${dateKey}`, {
      type: 'task',
      text: `${opener} You have ${user.pendingTasks} sacred task${user.pendingTasks === 1 ? '' : 's'} waiting to be ${verb}.`,
      icon: user.pendingTasks >= 3 ? '🔥' : '📋',
      color: user.pendingTasks >= 3 ? '#f59e0b' : '#3b82f6',
      topic: 'pending',
      weight: user.pendingTasks >= 3 ? 80 : 70,
      action: { label: user.pendingTasks >= 3 ? 'Tame the List' : 'Plan Today', onClick: () => boundSelectDate() },
    }));
  }

  // ── TASK SUGGESTIONS (only when appropriate) ─────────────────────────────

  if (!user.hasCreatedFirstTask) {
    c.push(makeCandidate(`first-task-${dateKey}`, {
      type: 'task',
      text: `Welcome to your celestial planning. The ${celestial.moonPhase?.replace('-', ' ') || 'current'} moon and the Sun in ${celestial.sunSign || 'the heavens'} invite you to begin. Cast your first intention.`,
      icon: '🌟',
      color: '#d4af37',
      topic: 'task-suggest',
      weight: 90,
      action: { label: 'Begin Your Journey', onClick: () => boundCreateTask() },
    }));
  } else if (user.pendingTasks === 0 && user.lastTaskCreationDate !== todayIso) {
    const suggestions = ctx.isVoidMoon
      ? [
          `The Moon is void and your slate is clean. This is a moment for rest, not planting.`,
          `A void Moon and an empty list. The universe whispers: wait before you begin.`,
        ]
      : [
          `The Sun burns in ${celestial.sunSign} and your slate is clean. What fire will you tend to?`,
          `With Mercury still in the sky, words become tasks. Speak one into existence.`,
          `No threads hang loose. The cosmos asks: what new pattern will you weave?`,
          `Your task list is empty — a rare alignment. Plant something before the moon shifts.`,
        ];
    c.push(makeCandidate(`suggest-${dateKey}`, {
      type: 'task',
      text: pickRandom(suggestions),
      icon: ctx.isVoidMoon ? '🌫️' : '💫',
      color: '#8b5cf6',
      topic: 'task-suggest',
      weight: ctx.isVoidMoon ? 35 : 65,
      action: { label: ctx.isVoidMoon ? 'Rest or Reflect' : 'Create Task', onClick: () => ctx.isVoidMoon ? emitJournal('While the Moon is void, I choose to: ') : boundCreateTask() },
    }));
  } else if (user.pendingTasks > 0 && user.lastTaskCreationDate !== todayIso) {
    c.push(makeCandidate(`suggest-focus-${dateKey}`, {
      type: 'task',
      text: ctx.isVoidMoon
        ? `The Moon is void of course and you have ${user.pendingTasks} thread${user.pendingTasks === 1 ? '' : 's'} waiting. Complete rather than begin.`
        : `The cosmos favors action, but you already have ${user.pendingTasks} thread${user.pendingTasks === 1 ? '' : 's'} in motion. Complete one before beginning anew.`,
      icon: ctx.isVoidMoon ? '🌫️' : '⚖️',
      color: '#8b5cf6',
      topic: 'task-suggest',
      weight: ctx.isVoidMoon ? 70 : 60,
      action: { label: 'View Tasks', onClick: () => boundSelectDate() },
    }));
  }

  // ── LOW MOTIVATION INTERVENTION ──────────────────────────────────────────

  if (user.pendingTasks > 0 && user.todayCompleted === 0) {
    const lastDate = user.lastTaskContent ? undefined : user.lastTaskCreationDate;
    let daysSince = 0;
    if (lastDate) {
      daysSince = Math.floor((Date.now() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
    }
    if (daysSince >= 1 || user.pendingTasks >= 3) {
      const archetypeMotivation = withArchetypeDialect(ctx, 'motivation', '');
      const motivators = archetypeMotivation
        ? [
            archetypeMotivation,
            'Energy feels scattered. But even a single completed task is a star in an otherwise empty sky.',
            'I see the weight of the unfinished. Pick the smallest thread and pull it.',
          ]
        : [
            'Energy feels scattered. But even a single completed task is a star in an otherwise empty sky.',
            'The planets do not always burn brightly. On dim days, small actions are spells.',
            'I see the weight of the unfinished. Pick the smallest thread and pull it.',
            'Momentum is a shy creature. One tiny step, and it will follow you home.',
          ];
      c.push(makeCandidate(`motivation-${dateKey}`, {
        type: 'nudge',
        text: pickRandom(motivators),
        icon: '⚡',
        color: '#eab308',
        topic: 'motivation',
        weight: user.pendingTasks >= 3 ? 75 : 60,
        action: { label: 'Create Micro-Task', onClick: () => boundCreateTask() },
      }));
    }
  }

  // ── JOURNAL NUDGES ───────────────────────────────────────────────────────

  if (user.daysSinceJournal >= 1) {
    const theme = user.lastJournalThemes[0];
    const journalPrompts = [
      theme ? `You last wrote about ${theme}. The moon has shifted since then — what does it see now?` : 'The pages miss your voice. A single sentence is enough to anchor a memory.',
      user.daysSinceJournal > 3 ? 'Four days of silence. Even oracles need to hear your voice.' : 'Capture today\'s energy before it fades.',
      'The journal is a mirror. Without your words, it remains fogged.',
      `Your last entry was ${user.daysSinceJournal} day${user.daysSinceJournal === 1 ? '' : 's'} ago. The cosmos has moved. Have you?`,
    ];
    c.push(makeCandidate(`habit-${dateKey}`, {
      type: 'nudge',
      text: pickRandom(journalPrompts),
      icon: '✍️',
      color: '#3b82f6',
      topic: 'journal',
      weight: user.daysSinceJournal >= 3 ? 75 : 55,
      action: { label: 'Open Journal', onClick: () => emitJournal() },
    }));
  }

  // ── APP FEATURE DISCOVERY ────────────────────────────────────────────────

  // Birth chart nudge
  if (!ctx.transit.hasBirthChart) {
    const chartPrompts = [
      `Your birth chart is the sky's fingerprint of your soul. Add it once, and every prompt becomes personal.`,
      `The stars speak to everyone, but they speak in your native tongue only when your birth chart is known.`,
    ];
    chartPrompts.forEach((text, i) => {
      c.push(makeCandidate(`feature-chart-${i}-${dateKey}`, {
        type: 'insight',
        text,
        icon: '✦',
        color: '#d946ef',
        topic: `feature-chart-${i}`,
        weight: 40,
        action: { label: 'Create Chart', onClick: () => emitNavigateToStars('chart') },
      }));
    });
  }

  // Oracle Journal nudge
  const journalPromptsFeature = [
    `The Oracle Journal remembers what you forget. Patterns emerge only when words are saved.`,
    `A single sentence in the journal is a star in your personal constellation.`,
  ];
  journalPromptsFeature.forEach((text, i) => {
    c.push(makeCandidate(`feature-journal-${i}-${dateKey}`, {
      type: 'nudge',
      text,
      icon: '📜',
      color: '#3b82f6',
      topic: `feature-journal-${i}`,
      weight: 38,
      action: { label: 'Open Journal', onClick: () => emitJournal() },
    }));
  });

  // Calendar / Notes nudge
  c.push(makeCandidate(`feature-calendar-${dateKey}`, {
    type: 'nudge',
    text: `Each day in HEKA carries two calendars: the civil and the celestial. Notes you leave here become a map of both.`,
    icon: '📅',
    color: '#14b8a6',
    topic: 'feature-calendar',
    weight: 36,
    action: { label: 'Explore Calendar', onClick: () => boundSelectDate() },
  }));

  // Additional feature discovery prompts (implicit tutorials)
  c.push(makeCandidate(`feature-stars-${dateKey}`, {
    type: 'nudge',
    text: 'The Stars view holds your celestial weather, transits, and birth chart. The sky has more to say than the moon phase alone.',
    icon: '🔭',
    color: '#a78bfa',
    topic: 'feature-stars',
    weight: 36,
    action: { label: 'Explore Stars', onClick: () => emitNavigateToStars() },
  }));

  c.push(makeCandidate(`feature-pure-${dateKey}`, {
    type: 'nudge',
    text: 'Need space? Pure Mode removes everything but the essential. One breath, one date, one intention.',
    icon: '🍃',
    color: '#14b8a6',
    topic: 'feature-pure',
    weight: 34,
    action: { label: 'Try Pure Mode', onClick: () => emitTogglePureMode() },
  }));

  c.push(makeCandidate(`feature-search-${dateKey}`, {
    type: 'nudge',
    text: 'Looking for a past note or task? The Search orb can find a single word across your entire timeline.',
    icon: '🔍',
    color: '#8b5cf6',
    topic: 'feature-search',
    weight: 34,
    action: { label: 'Open Search', onClick: () => emitOpenSearch() },
  }));

  c.push(makeCandidate(`feature-stats-${dateKey}`, {
    type: 'nudge',
    text: 'Your personal dashboard awaits in Stats. Streaks, mood patterns, and celestial alignment — all in one place.',
    icon: '📊',
    color: '#22c55e',
    topic: 'feature-stats',
    weight: 34,
    action: { label: 'View Stats', onClick: () => emitOpenStats() },
  }));

  c.push(makeCandidate(`feature-circle-${dateKey}`, {
    type: 'nudge',
    text: 'A circle of one is still a circle. Add a friend to share celestial timing and keep each other aligned.',
    icon: '🔗',
    color: '#ec4899',
    topic: 'feature-circle',
    weight: 34,
    action: { label: 'Open Circle', onClick: () => emitOpenCircle() },
  }));

  c.push(makeCandidate(`feature-energy-${dateKey}`, {
    type: 'nudge',
    text: 'How does the community feel tonight? Cast your energy vote and see the collective pulse in real time.',
    icon: '💫',
    color: '#f59e0b',
    topic: 'feature-energy',
    weight: 34,
    action: { label: 'Cast Vote', onClick: () => emitOpenCommunity() },
  }));

  c.push(makeCandidate(`feature-year-${dateKey}`, {
    type: 'nudge',
    text: 'The year view is a telescope for your plans. Spot empty quarters and anchor long-term goals at a glance.',
    icon: '🔭',
    color: '#3b82f6',
    topic: 'feature-year',
    weight: 34,
    action: { label: 'Open Year View', onClick: () => emitOpenYear() },
  }));

  // ── WISDOM ───────────────────────────────────────────────────────────────

  const wisdoms = [
    { text: 'The soul becomes dyed with the colour of its thoughts.', source: 'Marcus Aurelius' },
    { text: 'He who has a why to live can bear almost any how.', source: 'Nietzsche' },
    { text: 'Act without expectation.', source: 'Lao Tzu' },
    { text: 'No man ever steps in the same river twice.', source: 'Heraclitus' },
    { text: 'As above, so below, as within, so without.', source: 'The Emerald Tablet' },
    { text: 'The present moment is filled with joy and happiness.', source: 'Thich Nhat Hanh' },
    { text: 'You are the universe experiencing itself.', source: 'Alan Watts' },
    { text: 'What you seek is seeking you.', source: 'Rumi' },
    { text: 'The cave you fear to enter holds the treasure you seek.', source: 'Joseph Campbell' },
    { text: 'We are such stuff as dreams are made on.', source: 'Shakespeare' },
    { text: 'The privilege of a lifetime is to become who you truly are.', source: 'Jung' },
    { text: 'Do not go gentle into that good night.', source: 'Dylan Thomas' },
    { text: 'In the middle of difficulty lies opportunity.', source: 'Einstein' },
  ];
  wisdoms.forEach((quote) => {
    c.push(makeCandidate(`wisdom-${quote.source}-${dateKey}`, {
      type: 'wisdom',
      text: `"${quote.text}" — ${quote.source}`,
      icon: '📜',
      color: '#d4af37',
      topic: `wisdom-${quote.source}`,
      weight: 45,
      action: { label: 'Contemplate', onClick: () => emitJournal(`Wisdom from ${quote.source}:\n"${quote.text}"\n\nMy reflection:\n`) },
    }));
  });

  // ── NON-CELESTIAL INSIGHTS ──────────────────────────────────────────────

  // Productivity
  const productivityInsights = [
    { text: 'Deep work is a sanctuary. Protect one uninterrupted block today.', topic: 'productivity-deep', icon: '🎯', color: '#3b82f6' },
    { text: 'Multitasking is a myth. One thing done well outweighs ten begun.', topic: 'productivity-focus', icon: '🔍', color: '#60a5fa' },
    { text: 'Energy management beats time management. Do the hard thing when your energy peaks.', topic: 'productivity-energy', icon: '⚡', color: '#f59e0b' },
    { text: 'A two-minute task left undone becomes a mental stone. Clear it now.', topic: 'productivity-quick', icon: '⏱️', color: '#22c55e' },
    { text: 'Your attention is the scarcest resource. Spend it deliberately.', topic: 'productivity-attention', icon: '🧠', color: '#a78bfa' },
  ];
  productivityInsights.forEach((insight) => {
    c.push(makeCandidate(`${insight.topic}-${dateKey}`, {
      type: 'insight',
      text: insight.text,
      icon: insight.icon,
      color: insight.color,
      topic: insight.topic,
      weight: 55,
      action: { label: 'Plan Today', onClick: () => boundSelectDate() },
    }));
  });

  // Wellness
  const wellnessInsights = [
    { text: 'Your body is the vessel. Drink water before you reach for another screen.', topic: 'wellness-hydrate', icon: '💧', color: '#06b6d4' },
    { text: 'Movement is medicine. A single walk can untangle a knotted mind.', topic: 'wellness-move', icon: '🚶', color: '#84cc16' },
    { text: 'Three slow breaths. That is all it takes to shift from reaction to response.', topic: 'wellness-breathe', icon: '🌬️', color: '#14b8a6' },
    { text: 'Sleep is not lost time; it is when the mind sorts its archives.', topic: 'wellness-sleep', icon: '🛌', color: '#6366f1' },
    { text: 'A digital sunset — turning screens off an hour before bed — is a modern ritual worth keeping.', topic: 'wellness-detox', icon: '🌅', color: '#f59e0b' },
  ];
  wellnessInsights.forEach((insight) => {
    c.push(makeCandidate(`${insight.topic}-${dateKey}`, {
      type: 'nudge',
      text: insight.text,
      icon: insight.icon,
      color: insight.color,
      topic: insight.topic,
      weight: 50,
      action: { label: 'Self-Care Check', onClick: () => emitJournal('One thing I can do for my wellbeing today: ') },
    }));
  });

  // Creativity
  const creativityInsights = [
    { text: 'Creativity is not a bolt of lightning; it is a habit of noticing.', topic: 'creativity-notice', icon: '👁️', color: '#ec4899' },
    { text: 'Write one true sentence. It does not have to be beautiful; it has to be honest.', topic: 'creativity-write', icon: '✍️', color: '#f43f5e' },
    { text: 'Constraints breed invention. What limit can you turn into a rule for play?', topic: 'creativity-constraint', icon: '🎨', color: '#d946ef' },
    { text: 'Borrow from one discipline to solve a problem in another. Translation is innovation.', topic: 'creativity-remix', icon: '🔀', color: '#8b5cf6' },
  ];
  creativityInsights.forEach((insight) => {
    c.push(makeCandidate(`${insight.topic}-${dateKey}`, {
      type: 'insight',
      text: insight.text,
      icon: insight.icon,
      color: insight.color,
      topic: insight.topic,
      weight: 48,
      action: { label: 'Create', onClick: () => emitJournal('One idea I want to play with today: ') },
    }));
  });

  // Learning & Curiosity
  const learningInsights = [
    { text: 'Ask one question today that you do not know the answer to. Curiosity is a muscle.', topic: 'learning-question', icon: '❓', color: '#f59e0b' },
    { text: 'Teaching is the final stage of learning. Explain something you learned recently to yourself out loud.', topic: 'learning-teach', icon: '📚', color: '#d4af37' },
    { text: 'Read one page. Momentum is built from atoms of action.', topic: 'learning-read', icon: '📖', color: '#22c55e' },
    { text: 'The beginner\'s mind sees infinite paths. The expert sees one. Which will you choose today?', topic: 'learning-beginner', icon: '🌱', color: '#84cc16' },
  ];
  learningInsights.forEach((insight) => {
    c.push(makeCandidate(`${insight.topic}-${dateKey}`, {
      type: 'insight',
      text: insight.text,
      icon: insight.icon,
      color: insight.color,
      topic: insight.topic,
      weight: 46,
      action: { label: 'Learn', onClick: () => emitJournal('Something I am curious about today: ') },
    }));
  });

  // Social & Connection
  const socialInsights = [
    { text: 'Send one message of gratitude to someone who does not expect it.', topic: 'social-gratitude', icon: '💌', color: '#ec4899' },
    { text: 'Quality of attention is the greatest gift you can give another person.', topic: 'social-attention', icon: '🤝', color: '#f43f5e' },
    { text: 'A difficult conversation avoided is a wall built. One honest word can become a door.', topic: 'social-honesty', icon: '🚪', color: '#f97316' },
    { text: 'When did you last tell someone what you admire about them?', topic: 'social-admire', icon: '⭐', color: '#fbbf24' },
  ];
  socialInsights.forEach((insight) => {
    c.push(makeCandidate(`${insight.topic}-${dateKey}`, {
      type: 'nudge',
      text: insight.text,
      icon: insight.icon,
      color: insight.color,
      topic: insight.topic,
      weight: 47,
      action: { label: 'Connect', onClick: () => emitJournal('Someone I appreciate and why: ') },
    }));
  });

  // ── ZONE-SPECIFIC CANDIDATES ────────────────────────────────────────────

  if (ctx.zone === 'main-calendar') {
    const mainPrompts: PromptTemplate[] = [
      { text: 'The calendar is your map. Mark one note today — future-you will thank you.', icon: '📌', topic: 'main-note', color: '#f59e0b' },
      { text: 'Try a new view. The year modal holds patterns the month view cannot see.', icon: '👁️', topic: 'main-explore', color: '#8b5cf6', action: { label: 'Open Year', onClick: () => emitOpenYear() } },
      { text: 'One task cast into the grid is a promise made to time itself.', icon: '✍️', topic: 'main-task', color: '#22c55e', action: { label: 'Add Task', onClick: () => boundCreateTask() } },
      { text: 'Have you checked the stars today? Sometimes the sky has something to say.', icon: '✨', topic: 'main-stars-nudge', color: '#d4af37', action: { label: 'View Stars', onClick: () => emitNavigateToStars() } },
      { text: 'Duplicate notes are a sign of importance. If it repeats, it matters.', icon: '🔄', topic: 'main-duplicate', color: '#3b82f6' },
      { text: 'Tap any day to reveal its celestial signature. Every date carries a secret.', icon: '🌙', topic: 'main-tap-day', color: '#a78bfa', action: { label: 'Try It', onClick: () => boundSelectDate() } },
      { text: 'Long-press a day to quickly add a note. Speed is its own kind of magic.', icon: '⚡', topic: 'main-longpress', color: '#f59e0b' },
      { text: 'The best planners leave breadcrumbs. A single note can guide a whole month.', icon: '🍞', topic: 'main-breadcrumb', color: '#d4af37' },
      { text: 'Your tasks and notes echo the rhythm of the moon. Watch the pattern emerge.', icon: '🔮', topic: 'main-rhythm', color: '#6366f1' },
      { text: 'Swipe between months to feel time as a river rather than a grid.', icon: '🌊', topic: 'main-swipe', color: '#06b6d4' },
      { text: 'Rituals anchor intention. Create a recurring task and let the calendar hold it.', icon: '⏳', topic: 'main-ritual', color: '#ec4899' },
      { text: 'The moon phase at the top is not decoration — it is a timing compass.', icon: '🧭', topic: 'main-moon-compass', color: '#fbbf24' },
    ];
    mainPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'nudge', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 60, action: p.action }));
    });

    // Evening wind-down nudges in main calendar
    if (ctx.timeLabel === 'evening' || ctx.hour >= 19) {
      const eveningPrompts: PromptTemplate[] = [
        { text: 'Evening settles. How are you winding down tonight? The community is sharing energy votes.', icon: '🌇', topic: 'evening-wind-down', color: '#8b5cf6', action: { label: 'Cast Vote', onClick: () => emitOpenCommunity() } },
        { text: 'The day is closing its ledger. One journal sentence can seal it gracefully.', icon: '📜', topic: 'evening-reflect', color: '#6366f1', action: { label: 'Reflect', onClick: () => emitJournal('This evening, I am letting go of:\n\n') } },
        { text: 'Before the screen dims, check what you completed today. Completion is a lullaby.', icon: '✅', topic: 'evening-complete', color: '#22c55e', action: { label: 'Review Day', onClick: () => boundSelectDate() } },
        { text: 'Night favors preparation over initiation. What is the first thread you will pull tomorrow?', icon: '🌙', topic: 'evening-prep', color: '#3b82f6', action: { label: 'Plan Tomorrow', onClick: () => boundCreateTask('Tomorrow I will begin: ') } },
        { text: 'Community energy shifts at dusk. See how others are feeling tonight.', icon: '💫', topic: 'evening-community', color: '#f59e0b', action: { label: 'Explore', onClick: () => emitOpenCommunity() } },
        { text: 'Your calendar holds the shape of the day. Add one feeling-note before sleep.', icon: '📝', topic: 'evening-note', color: '#ec4899', action: { label: 'Add Note', onClick: () => boundAddNote() } },
      ];
      eveningPrompts.forEach((p) => {
        c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'nudge', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 64, action: p.action }));
      });
    }
  }

  if (ctx.zone === 'day-panel') {
    const dayPrompts: PromptTemplate[] = [
      { text: 'This day is a single bead on the necklace of your year. How will you shape it?', icon: '📅', topic: 'day-seize', color: '#f59e0b' },
      { text: 'A note left here becomes a landmark. What do you want to remember about today?', icon: '📝', topic: 'day-note', color: '#3b82f6', action: { label: 'Add Note', onClick: () => boundAddNote() } },
      { text: 'Finish one thread for this day before beginning another. Completion is a spell.', icon: '✅', topic: 'day-complete', color: '#22c55e' },
      { text: 'Look at the celestial data for this date. The sky was different then.', icon: '🌙', topic: 'day-celestial', color: '#a78bfa' },
      { text: 'A task anchored to a specific day is far more likely to sail.', icon: '⚓', topic: 'day-anchor', color: '#06b6d4', action: { label: 'Anchor Task', onClick: () => boundCreateTask() } },
      { text: 'How did you feel when you woke up? Mood tracking begins with a single tap.', icon: '🌈', topic: 'day-mood', color: '#ec4899' },
      { text: 'You can share this day with your circle. Some moments are better together.', icon: '🔗', topic: 'day-share', color: '#f43f5e', action: { label: 'Share', onClick: () => emitOpenCircle() } },
      { text: 'The planetary hour for this moment is woven into the day. Check the celestial guide.', icon: '⏰', topic: 'day-hour', color: '#d4af37' },
      { text: 'Every day panel has a hidden starfield. Look for the celestial icon.', icon: '✨', topic: 'day-stars', color: '#fbbf24', action: { label: 'View Stars', onClick: () => emitNavigateToStars() } },
      { text: 'If this day feels heavy, try Pure Mode. It strips everything back to breath.', icon: '🍃', topic: 'day-pure', color: '#14b8a6', action: { label: 'Enter Pure Mode', onClick: () => emitTogglePureMode() } },
    ];
    dayPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'nudge', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 62, action: p.action }));
    });
  }

  if (ctx.zone === 'journal') {
    const journalPrompts: PromptTemplate[] = [
      { text: 'Tracking events in your journal is like planting signposts in a forest. Eventually, a path appears.', icon: '📜', topic: 'journal-track', color: '#d4af37' },
      { text: 'Write one sentence about how you felt today. That is enough to begin a practice.', icon: '✍️', topic: 'journal-start', color: '#14b8a6' },
      { text: 'Patterns emerge only when words are saved. What pattern do you suspect is forming?', icon: '🔍', topic: 'journal-pattern', color: '#8b5cf6' },
      { text: 'Your notes are a conversation with your future self. What do you want them to know?', icon: '💬', topic: 'journal-future', color: '#ec4899' },
      { text: 'Growth is invisible until it is written down. Document one small win.', icon: '🌱', topic: 'journal-growth', color: '#22c55e' },
      { text: 'The Oracle Journal reads between the lines. Over time, it learns your celestial language.', icon: '🔮', topic: 'journal-oracle', color: '#6366f1' },
      { text: 'Tag an entry with a mood or theme. Tags become constellations of meaning.', icon: '🏷️', topic: 'journal-tag', color: '#f59e0b' },
      { text: 'If words feel too heavy, try a single emoji. The journal accepts all dialects.', icon: '😌', topic: 'journal-emoji', color: '#fbbf24' },
      { text: 'Re-read an entry from last month. The distance will teach you something.', icon: '⏳', topic: 'journal-revisit', color: '#a78bfa' },
      { text: 'A question written down is already half answered. What are you trying to understand?', icon: '❓', topic: 'journal-question', color: '#3b82f6' },
      { text: 'Your journal is a safe room. Lock the door behind you and say the true thing.', icon: '🚪', topic: 'journal-truth', color: '#f43f5e' },
      { text: 'Dreams fade fast. If you remember even a fragment, capture it before breakfast.', icon: '💤', topic: 'journal-dream', color: '#8b5cf6' },
    ];
    journalPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'nudge', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 70, action: p.action }));
    });
  }

  if (ctx.zone === 'circle') {
    const circlePrompts: PromptTemplate[] = [
      { text: 'Share one task with the circle. Accountability multiplies intention.', icon: '🔗', topic: 'circle-share', color: '#3b82f6' },
      { text: 'When did you last reach out? A single message can realign a friendship.', icon: '💬', topic: 'circle-reach', color: '#ec4899' },
      { text: 'The circle grows stronger when everyone contributes. What can you offer today?', icon: '🤝', topic: 'circle-give', color: '#f59e0b' },
      { text: 'Collaboration is a form of magic. Invite someone into one of your goals.', icon: '✨', topic: 'circle-collab', color: '#d4af37' },
      { text: 'Gratitude shared is gratitude doubled. Tell someone in your circle what they mean to you.', icon: '💌', topic: 'circle-gratitude', color: '#f43f5e' },
      { text: 'A circle of one is still a circle. Add a friend when you are ready.', icon: '👋', topic: 'circle-add', color: '#22c55e', action: { label: 'Invite', onClick: () => emitOpenCircle() } },
      { text: 'Shared celestial events create shared timing. Send today\'s moon phase to someone.', icon: '🌙', topic: 'circle-moon', color: '#a78bfa' },
      { text: 'Your friends can see your public wins. Celebrate a completion here.', icon: '🏆', topic: 'circle-celebrate', color: '#fbbf24' },
      { text: 'Need support? The circle is a soft place to land. Ask for what you need.', icon: '🕊️', topic: 'circle-support', color: '#14b8a6' },
    ];
    circlePrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'nudge', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 65, action: p.action }));
    });
  }

  if (ctx.zone === 'pure-mode') {
    const purePrompts: PromptTemplate[] = [
      { text: 'In the quiet, clarity arrives. You do not need to do anything right now.', icon: '🍃', topic: 'pure-quiet', color: '#14b8a6' },
      { text: 'One breath. One moment. The calendar will wait for you.', icon: '🌬️', topic: 'pure-breathe', color: '#22c55e' },
      { text: 'Minimalism is not emptiness; it is room for what matters.', icon: '⬜', topic: 'pure-minimal', color: '#a1a1aa' },
      { text: 'Let the noise fall away. What remains is yours.', icon: '🕯️', topic: 'pure-zen', color: '#fbbf24' },
      { text: 'Rest is not a reward; it is a requirement.', icon: '🛌', topic: 'pure-rest', color: '#6366f1' },
      { text: 'Pure Mode is a sanctuary. Stay as long as you need.', icon: '🏛️', topic: 'pure-sanctuary', color: '#d4af37' },
      { text: 'Even a single intention is enough. Do not confuse volume with value.', icon: '💎', topic: 'pure-intention', color: '#ec4899' },
      { text: 'The stars do not hurry. Neither must you.', icon: '✨', topic: 'pure-patience', color: '#8b5cf6' },
      { text: 'Close your eyes for three breaths. The calendar will still be here.', icon: '👁️', topic: 'pure-eyes', color: '#3b82f6' },
    ];
    purePrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'nudge', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 68, action: p.action }));
    });
  }

  if (ctx.zone === 'settings') {
    const settingsPrompts: PromptTemplate[] = [
      { text: 'Small tweaks to the interface can change how you relate to time. Experiment freely.', icon: '🎛️', topic: 'settings-tweak', color: '#8b5cf6' },
      { text: 'Themes are not just colors; they are moods. Which mood do you want to work in?', icon: '🎨', topic: 'settings-theme', color: '#ec4899' },
      { text: 'A font change can make the calendar feel like a new room. Explore the options.', icon: '🔤', topic: 'settings-font', color: '#3b82f6' },
      { text: 'You can toggle celestial cards on and off. Customize the sky to your liking.', icon: '⭐', topic: 'settings-celestial', color: '#fbbf24' },
      { text: 'Privacy settings are like wards. Check them periodically.', icon: '🛡️', topic: 'settings-privacy', color: '#22c55e' },
      { text: 'Your archetype shapes the oracle\'s voice. Change it and HEKA will speak differently.', icon: '🎭', topic: 'settings-archetype', color: '#d946ef' },
      { text: 'Notifications can be gentle nudges or silent stars. You choose the volume.', icon: '🔔', topic: 'settings-notify', color: '#f59e0b' },
      { text: 'Export your journal when you need a backup. Your words are yours forever.', icon: '📤', topic: 'settings-export', color: '#a78bfa' },
    ];
    settingsPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'insight', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 58, action: p.action }));
    });
  }

  if (ctx.zone === 'stars') {
    const starsPrompts: PromptTemplate[] = [
      { text: 'The current sky is a living document. Read it like a weather report for the soul.', icon: '🔭', topic: 'stars-read', color: '#a78bfa' },
      { text: 'Transits are temporary, but they teach permanent lessons. What is the sky asking you to learn?', icon: '✨', topic: 'stars-transit', color: '#d4af37' },
      { text: 'Your birth chart is a fingerprint. No one else has ever stood under the same sky in the same way.', icon: '🌌', topic: 'stars-chart', color: '#fbbf24' },
      { text: 'Watch the void moon. It is a reminder that not every moment is for action.', icon: '🌑', topic: 'stars-void', color: '#6366f1' },
      { text: 'Each planet is a voice in the choir. Which one is loudest today?', icon: '🎵', topic: 'stars-choir', color: '#ec4899' },
      { text: 'Retrograde is not a curse — it is a review. What needs revisiting?', icon: '↩️', topic: 'stars-retrograde', color: '#f59e0b' },
      { text: 'Aspects are conversations between planets. Eavesdrop on the dialogue.', icon: '💬', topic: 'stars-aspect', color: '#14b8a6' },
      { text: 'The north node points to your growing edge. Face it, even briefly.', icon: '☊', topic: 'stars-node', color: '#d946ef' },
      { text: 'Chiron shows where your medicine lives. The wound and the remedy share the same address.', icon: '🗝️', topic: 'stars-chiron', color: '#22c55e' },
      { text: 'If the symbols feel foreign, start with the Moon. She is the most human planet.', icon: '🌙', topic: 'stars-begin', color: '#3b82f6' },
    ];
    starsPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'celestial', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 75, action: p.action }));
    });
  }

  if (ctx.zone === 'stats') {
    const statsPrompts: PromptTemplate[] = [
      { text: 'Numbers are just one language. Your consistency tells a story the graph cannot fully capture.', icon: '📊', topic: 'stats-story', color: '#8b5cf6' },
      { text: 'Streaks are proof of trust between you and your future self.', icon: '🔥', topic: 'stats-streak', color: '#f97316' },
      { text: 'Look for the moon-mood correlation. The data may surprise you.', icon: '🌙', topic: 'stats-moon', color: '#a78bfa' },
      { text: 'A single dip in the graph is not failure; it is rest.', icon: '📉', topic: 'stats-rest', color: '#22c55e' },
      { text: 'Your productivity trends mirror the seasons. Are you trying to harvest in winter?', icon: '🍂', topic: 'stats-season', color: '#f59e0b' },
      { text: 'Compare this week to last. Small deltas compound into transformation.', icon: '⚖️', topic: 'stats-compare', color: '#3b82f6' },
      { text: 'The stats page holds your celestial-productivity score. See how the sky and your actions align.', icon: '⭐', topic: 'stats-align', color: '#d4af37' },
      { text: 'Celebrate the longest streak you see. That version of you is real.', icon: '🏆', topic: 'stats-celebrate', color: '#ec4899' },
      { text: 'Data becomes wisdom when you act on it. Pick one insight and test it this week.', icon: '💡', topic: 'stats-act', color: '#14b8a6' },
    ];
    statsPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'insight', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 62, action: p.action }));
    });
  }

  if (ctx.zone === 'search') {
    const searchPrompts: PromptTemplate[] = [
      { text: 'Search is a time machine. Type a word and travel back to when you first wrote it.', icon: '🔍', topic: 'search-time', color: '#8b5cf6' },
      { text: 'Looking for a lost task? The search orb remembers what you forgot.', icon: '🔮', topic: 'search-task', color: '#a78bfa' },
      { text: 'Try searching for a mood or theme. Your journal may hold patterns you have not named.', icon: '🌈', topic: 'search-theme', color: '#ec4899' },
      { text: 'A single keyword can resurrect an entire month. What do you want to revisit?', icon: '🔑', topic: 'search-keyword', color: '#f59e0b' },
      { text: 'Search your notes before creating a new one. Avoid the duplicate spiral.', icon: '🌀', topic: 'search-duplicate', color: '#3b82f6' },
      { text: 'The search results include celestial context. A note written under a full moon hits differently.', icon: '🌕', topic: 'search-moon', color: '#fbbf24' },
      { text: 'Your past self left clues. Use search to follow them.', icon: '🗺️', topic: 'search-clue', color: '#22c55e' },
    ];
    searchPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'insight', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 64, action: p.action }));
    });
  }

  if (ctx.zone === 'year-modal') {
    const yearPrompts: PromptTemplate[] = [
      { text: 'The year view is a telescope. Zoom out to see the architecture of your plans.', icon: '🔭', topic: 'year-telescope', color: '#8b5cf6' },
      { text: 'Look for the months with the most notes. That is where your energy naturally flows.', icon: '⚡', topic: 'year-energy', color: '#f59e0b' },
      { text: 'An empty quarter is not failure — it is unclaimed land.', icon: '🏞️', topic: 'year-empty', color: '#22c55e' },
      { text: 'Tap any month to drop back into detail. The telescope becomes a microscope.', icon: '🔬', topic: 'year-detail', color: '#ec4899' },
      { text: 'What is one goal you want to anchor in the next quarter? Write it on a distant month.', icon: '⚓', topic: 'year-goal', color: '#06b6d4', action: { label: 'Plan Ahead', onClick: () => emitOpenYear() } },
      { text: 'The year wheel turns with the zodiac. Notice which sign rules each month.', icon: '♈', topic: 'year-zodiac', color: '#f43f5e' },
      { text: 'Long-term tasks look smaller from here, but they are no less important.', icon: '📍', topic: 'year-long', color: '#a78bfa' },
      { text: 'Use the year view to spot your personal seasons of activity and rest.', icon: '📊', topic: 'year-season', color: '#14b8a6' },
    ];
    yearPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'insight', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 64, action: p.action }));
    });
  }

  if (ctx.zone === 'community') {
    const communityPrompts: PromptTemplate[] = [
      { text: 'Energy is contagious. Cast your vote and see the collective mood shift.', icon: '💫', topic: 'community-vote', color: '#f59e0b', action: { label: 'Vote', onClick: () => emitOpenCommunity() } },
      { text: 'The community pulse reflects the moon. See if others feel what you feel.', icon: '🌙', topic: 'community-pulse', color: '#a78bfa' },
      { text: 'A single encouraging comment can change someone\'s trajectory. Leave a kind word.', icon: '💬', topic: 'community-kind', color: '#ec4899' },
      { text: 'Shared celestial events bind strangers into temporary constellations.', icon: '✨', topic: 'community-constellation', color: '#d4af37' },
      { text: 'Check the top energy of the week. It may mirror your own invisible weather.', icon: '🌦️', topic: 'community-weather', color: '#3b82f6' },
      { text: 'Voting on community energy is a ritual of belonging. Make it yours.', icon: '🗳️', topic: 'community-ritual', color: '#22c55e' },
      { text: 'Your voice is a data point in the communal oracle. Speak it.', icon: '📢', topic: 'community-voice', color: '#f43f5e' },
      { text: 'See who else is winding down tonight. You are not alone in the quiet.', icon: '🕯️', topic: 'community-quiet', color: '#6366f1' },
    ];
    communityPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'nudge', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 66, action: p.action }));
    });
  }

  if (ctx.zone === 'info') {
    const infoPrompts: PromptTemplate[] = [
      { text: 'Knowledge is a lantern, not a destination. Carry what serves you and leave the rest.', icon: '🏮', topic: 'info-lantern', color: '#f59e0b' },
      { text: 'The info section is a living library. Return when you need a refresher.', icon: '📚', topic: 'info-library', color: '#8b5cf6' },
      { text: 'Every symbol in HEKA has a meaning. Curiosity is the key that unlocks it.', icon: '🔑', topic: 'info-symbol', color: '#d4af37' },
      { text: 'If something confuses you, that is the edge of your growth. Stay there a moment.', icon: '🌱', topic: 'info-growth', color: '#22c55e' },
      { text: 'The FAQ holds questions you have not asked yet. Browse when you have a spare minute.', icon: '❓', topic: 'info-faq', color: '#3b82f6' },
      { text: 'Understanding the calendar\'s logic deepens your trust in its timing.', icon: '⏳', topic: 'info-trust', color: '#a78bfa' },
      { text: 'Share the info you find helpful. Teaching is the final stage of learning.', icon: '📢', topic: 'info-share', color: '#ec4899' },
    ];
    infoPrompts.forEach((p) => {
      c.push(makeCandidate(`${p.topic}-${dateKey}`, { type: 'insight', text: p.text, icon: p.icon, color: p.color, topic: p.topic, weight: 58, action: p.action }));
    });
  }

  // ── SUNRISE / SUNSET BOUNDARY AWARENESS ────────────────────────────────
  if (ctx.location.hasLocation && ctx.sunTimes.sunrise && ctx.sunTimes.sunset) {
    const now = Date.now();
    const sunrise = ctx.sunTimes.sunrise.getTime();
    const sunset = ctx.sunTimes.sunset.getTime();
    const minsToSunrise = (sunrise - now) / (1000 * 60);
    const minsSinceSunrise = (now - sunrise) / (1000 * 60);
    const minsToSunset = (sunset - now) / (1000 * 60);
    const minsSinceSunset = (now - sunset) / (1000 * 60);

    if (minsToSunrise > 0 && minsToSunrise <= 60) {
      c.push(makeCandidate(`sun-boundary-${dateKey}`, {
        type: 'insight',
        text: `Dawn is approaching in ${ctx.location.name}. The Sun will rise in about ${Math.round(minsToSunrise)} minutes. Use this twilight to prepare, not to push.`,
        icon: '🌅',
        color: '#f59e0b',
        topic: 'sun-boundary',
        weight: 45,
        action: { label: 'Gentle Start', onClick: () => emitJournal('Before the Sun rises, I feel: ') },
      }));
    } else if (minsSinceSunrise > 0 && minsSinceSunrise <= 60) {
      c.push(makeCandidate(`sun-boundary-${dateKey}`, {
        type: 'insight',
        text: `The Sun has just risen over ${ctx.location.name}. New beginnings cast now carry the full force of the day.`,
        icon: '☀️',
        color: '#f59e0b',
        topic: 'sun-boundary',
        weight: 42,
        action: { label: 'Set Intention', onClick: () => boundCreateTask() },
      }));
    } else if (minsToSunset > 0 && minsToSunset <= 60) {
      c.push(makeCandidate(`sun-boundary-${dateKey}`, {
        type: 'insight',
        text: `The Sun will set in ${ctx.location.name} within the hour. This is the time to finish, not to begin.`,
        icon: '🌇',
        color: '#8b5cf6',
        topic: 'sun-boundary',
        weight: 43,
        action: { label: 'Complete Tasks', onClick: () => boundSelectDate() },
      }));
    } else if (minsSinceSunset > 0 && minsSinceSunset <= 60) {
      c.push(makeCandidate(`sun-boundary-${dateKey}`, {
        type: 'insight',
        text: `Night has fallen in ${ctx.location.name}. The day is closing its ledger. Rest and reflection are the only tasks that matter now.`,
        icon: '🌙',
        color: '#6366f1',
        topic: 'sun-boundary',
        weight: 40,
        action: { label: 'Reflect', onClick: () => emitJournal('As night falls, I release: ') },
      }));
    }
  }

  // ── PLANETARY HOUR INSIGHT ───────────────────────────────────────────────
  if (ctx.planetaryHour) {
    const ph = ctx.planetaryHour;
    const planetEmojis: Record<string, string> = {
      saturn: '🪐', jupiter: '♃', mars: '♂️', sun: '☀️', venus: '♀️', mercury: '☿️', moon: '🌙',
    };
    const activityText = ph.activities.slice(0, 3).join(', ');
    c.push(makeCandidate(`planetary-hour-${dateKey}`, {
      type: 'insight',
      text: `It is the hour of ${ph.planet} ${planetEmojis[ph.planet] || '✨'}. The current celestial window favors ${activityText}.`,
      icon: planetEmojis[ph.planet] || '✨',
      color: ph.isDay ? '#f59e0b' : '#6366f1',
      topic: 'planetary-hour',
      weight: 35,
      action: { label: 'Align a Task', onClick: () => boundCreateTask(`Aligned with the hour of ${ph.planet}`) },
    }));
  }

  // ── TIME-OF-DAY INSIGHT ─────────────────────────────────────────────────

  const timeInsights: Record<string, string[]> = {
    morning: [
      'Dawn breaks. The eastern horizon favors new beginnings — your will is a blade, sharpened by sleep.',
      'Morning is when the gods are most persuadable. Ask for what you need.',
    ],
    afternoon: [
      'Momentum is building. Tackle the most important task before the day wanes.',
      'The Sun is at its height. This is the hour of execution, not deliberation.',
    ],
    evening: [
      'The Sun descends. This is the hour of integration, not expansion. What will you carry into the dark?',
      'Evening is for gathering the scattered pieces of the day into meaning.',
    ],
    night: [
      'The subconscious is awake. Dream, reflect, or rest deeply.',
      'Night is not empty. It is where the unspoken things arrange themselves.',
    ],
  };
  c.push(makeCandidate(`time-${timeLabel}-${dateKey}`, {
    type: 'insight',
    text: pickRandom(timeInsights[timeLabel]),
    icon: timeLabel === 'morning' ? '🌅' : timeLabel === 'afternoon' ? '☀️' : timeLabel === 'evening' ? '🌇' : '🌙',
    color: timeLabel === 'morning' ? '#f59e0b' : timeLabel === 'afternoon' ? '#ef4444' : timeLabel === 'evening' ? '#8b5cf6' : '#6366f1',
    topic: 'time',
    weight: 35,
    action: { label: 'Write Reflection', onClick: () => emitJournal(`${ctx.greeting} reflection:\n\n`) },
  }));

  // ── SYNCHRONICITY (rare, magical moments) ────────────────────────────────

  // Synchronicity: journal theme matches current moon sign element
  if (user.lastJournalThemes.length > 0 && celestial.moonSign) {
    const moonElement = getSignElement(celestial.moonSign);
    const theme = user.lastJournalThemes[0].toLowerCase();
    const waterThemes = ['water', 'emotion', 'feeling', 'flow', 'tears', 'ocean', 'river'];
    const fireThemes = ['fire', 'passion', 'anger', 'desire', 'burn', 'light', 'heat'];
    const earthThemes = ['earth', 'ground', 'body', 'money', 'food', 'home', 'root'];
    const airThemes = ['air', 'thought', 'idea', 'communication', 'wind', 'breath', 'mind'];

    const matchesElement =
      (moonElement === 'water' && waterThemes.some((t) => theme.includes(t))) ||
      (moonElement === 'fire' && fireThemes.some((t) => theme.includes(t))) ||
      (moonElement === 'earth' && earthThemes.some((t) => theme.includes(t))) ||
      (moonElement === 'air' && airThemes.some((t) => theme.includes(t)));

    if (matchesElement) {
      c.push(makeCandidate(`sync-journal-${dateKey}`, {
        type: 'synchronicity',
        text: `Your last journal spoke of ${user.lastJournalThemes[0]}. Tonight the Moon swims in ${celestial.moonSign}. I do not believe in coincidence.`,
        icon: '🔮',
        color: '#d946ef',
        topic: 'synchronicity',
        weight: 100,
        isSynchronicity: true,
        action: { label: 'Explore in Journal', onClick: () => emitJournal() },
      }));
    }
  }

  // Synchronicity: task creation element matches sun sign
  if (user.lastTaskContent && celestial.sunSign) {
    const content = user.lastTaskContent.toLowerCase();
    const sunElement = getSignElement(celestial.sunSign);
    const fireWords = ['start', 'launch', 'create', 'build', 'ignite'];
    const waterWords = ['heal', 'feel', 'cleanse', 'release', 'flow'];
    const earthWords = ['organize', 'plan', 'save', 'finish', 'structure'];
    const airWords = ['write', 'call', 'speak', 'learn', 'share'];

    const elementWords: Record<string, string[]> = {
      fire: fireWords, water: waterWords, earth: earthWords, air: airWords,
    };

    if (sunElement !== 'unknown' && elementWords[sunElement].some((w) => content.includes(w))) {
      c.push(makeCandidate(`sync-task-${dateKey}`, {
        type: 'synchronicity',
        text: `Your last task — "${user.lastTaskContent}" — resonates perfectly with the ${celestial.sunSign} Sun. You are moving with the current, not against it.`,
        icon: '✨',
        color: '#f59e0b',
        topic: 'synchronicity',
        weight: 100,
        isSynchronicity: true,
        action: { label: 'View Tasks', onClick: () => boundSelectDate() },
      }));
    }
  }

  // ── DAY PLAN (comprehensive overview) ────────────────────────────────────

  if (celestial.sunSign && celestial.moonSign) {
    const tz = getTimezoneName();
    const seasonPart = ctx.season
      ? ` In the ${ctx.season.season} of the ${ctx.season.hemisphere} hemisphere, nature favors ${ctx.season.season === 'spring' || ctx.season.season === 'summer' ? 'growth and outward expression' : 'harvest and inward turning'}.`
      : '';
    const timeModePart = ctx.timeMode === 'TRUE'
      ? ' You are tracking TRUE HEKA time — the calendar of the stars themselves.'
      : '';
    c.push(makeCandidate(`plan-${dateKey}`, {
      type: 'plan',
      text: `${ctx.greeting}. The Sun is in ${celestial.sunSign} and the Moon is ${celestial.moonPhase.replace('-', ' ')} in ${celestial.moonSign}. In ${tz}, the prevailing energy favors ${celestial.dominantElement === 'fire' ? 'bold action' : celestial.dominantElement === 'water' ? 'emotional clarity' : celestial.dominantElement === 'earth' ? 'practical construction' : celestial.dominantElement === 'air' ? 'intellectual exchange' : 'balanced awareness'}.${seasonPart}${timeModePart}`,
      icon: '📅',
      color: '#f59e0b',
      topic: 'plan',
      weight: 25,
      action: { label: 'Plan Today', onClick: () => boundSelectDate() },
    }));
  }

  // ── JOURNAL PROMPTS ──────────────────────────────────────────────────────

  const promptPool: { text: string; topic: string }[] = [
    { text: 'What is one thing you are proud of from yesterday?', topic: 'journal-gratitude' },
    { text: 'If your future self could send you one sentence today, what would it say?', topic: 'journal-vision' },
    { text: 'What energy do you want to carry into every interaction today?', topic: 'journal-intention' },
    { text: 'Describe your current emotional weather in three words.', topic: 'journal-mood' },
    { text: 'What is one small fear you are ready to dissolve?', topic: 'journal-release' },
    { text: 'What did you learn about yourself this week?', topic: 'journal-insight' },
    { text: 'Write a thank-you note to your body for something it did today.', topic: 'journal-gratitude' },
    { text: 'What boundary do you want to honor more clearly?', topic: 'journal-boundary' },
    { text: 'If your mood were a landscape, what would it look like right now?', topic: 'journal-mood' },
    { text: 'What is a belief you are outgrowing?', topic: 'journal-belief' },
    { text: 'Describe a recent dream fragment and the feeling it left behind.', topic: 'journal-dream' },
    { text: 'What are you currently tolerating that you no longer need to?', topic: 'journal-clarity' },
    { text: 'What would you do today if you trusted yourself completely?', topic: 'journal-trust' },
    { text: 'Name three small beauties you noticed recently.', topic: 'journal-beauty' },
    { text: 'What does rest actually look like for you?', topic: 'journal-rest' },
    { text: 'What is something you have been avoiding saying?', topic: 'journal-truth' },
    { text: 'How do you want to feel by the end of today?', topic: 'journal-intention' },
    { text: 'What part of you is asking for attention right now?', topic: 'journal-self' },
    { text: 'Write a permission slip for something you have denied yourself.', topic: 'journal-permission' },
    { text: 'What pattern are you ready to interrupt?', topic: 'journal-pattern' },
  ];
  const selectedPrompt = pickRandom(promptPool);
  c.push(makeCandidate(`prompt-${selectedPrompt.topic}-${dateKey}`, {
    type: 'question',
    text: selectedPrompt.text,
    icon: '💭',
    color: '#14b8a6',
    topic: selectedPrompt.topic,
    weight: 45,
    action: { label: 'Answer in Journal', onClick: () => emitJournal(selectedPrompt.text + '\n\n') },
  }));

  // ── CALENDAR NOTE NUDGE ──────────────────────────────────────────────────

  c.push(makeCandidate(`note-${dateKey}`, {
    type: 'nudge',
    text: "Today's energy is unique. Leave a note on your calendar so future-you can trace the pattern of your growth.",
    icon: '📌',
    color: '#f43f5e',
    topic: 'note',
    weight: 20,
    action: { label: 'Add Note', onClick: () => boundAddNote() },
  }));

  // Solar return / birthday candidates
  if (ctx.solarReturn?.isToday) {
    c.push(makeCandidate('solar-return-today', {
      type: 'celebration',
      text: ctx.solarReturn.sign
        ? `Happy Solar Return. The Sun returns to your natal ${ctx.solarReturn.sign} today — a new year of your soul's journey begins.`
        : 'Happy Solar Return. The Sun completes another circle of your life today.',
      icon: '☀️',
      topic: 'solar-return',
      weight: 95,
      color: '#f59e0b',
    }));
  }

  if (ctx.solarReturn?.isApproaching) {
    c.push(makeCandidate('solar-return-approaching', {
      type: 'celestial',
      text: ctx.solarReturn.sign
        ? `Your solar return approaches in ${ctx.solarReturn.daysUntil} day${ctx.solarReturn.daysUntil > 1 ? 's' : ''}. The Sun will soon realign with your natal ${ctx.solarReturn.sign}. A good time to set intentions.`
        : `Your solar return approaches in ${ctx.solarReturn.daysUntil} day${ctx.solarReturn.daysUntil > 1 ? 's' : ''}. A good time to set intentions.`,
      icon: '🌅',
      topic: 'solar-return-approaching',
      weight: 60,
      color: '#fbbf24',
    }));
  }

  return c;
}
