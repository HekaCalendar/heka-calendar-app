/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VOID MOON SANCTUARY - POETIC NARRATIVES & EDUCATIONAL CONTENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * The Moon is the fastest body in the heavens.
 * She completes her circuit in 27.3 days, touching every planet,
 * every degree, every house of the chart.
 * 
 * She is the hand on the cosmic clock.
 * She is the messenger who carries our intentions to the gods.
 * 
 * When she goes void, she walks alone.
 * This is not absence. This is presence without agenda.
 * This is the breath between worlds.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// THE MOON'S ROLE - Educational Foundation
// ═══════════════════════════════════════════════════════════════════════════════

export const moonTeachings = {
  title: "The Moon as Messenger",
  essence: `The Moon is the fastest traveler in the zodiac. While Saturn takes 
two and a half years to circle the heavens, the Moon completes her journey 
in just 27.3 days. She is the cosmic pulse, the celestial heartbeat that 
reminds us time is not linear—it is cyclic, spiraling, returning.`,
  
  theDailyJourney: {
    title: "Her Daily Conversations",
    content: `Every 2.5 days, the Moon enters a new zodiac sign. In that time, 
she forms aspects—geometric relationships—with every planet in the sky. 
These are not abstract measurements. They are conversations.

When the Moon sextiles Venus, she carries messages of beauty and connection.
When she squares Mars, she meets resistance and must choose her battles.
When she trines Jupiter, she expands, magnifies, receives blessing.

Each aspect is a dialogue. The Moon asks, the planet responds. 
Together, they weave the fabric of each day.`,
  },
  
  theVoid: {
    title: "When the Conversation Ends",
    content: `In the final degrees of each sign, the Moon forms her last aspect. 
After that moment, she walks alone. She is still moving—always moving—but 
no one is answering her calls. She travels through the remaining degrees 
in silence.

This is the Void of Course Moon.

Not empty. Not broken. Simply uncommitted. Like a seed in winter soil, 
like the pause between exhale and inhale, like the moment after a door 
closes but before the next opens.`,
  },
  
  theWisdom: {
    title: "Why This Matters",
    content: `Traditional astrology understood something our productivity culture 
has forgotten: not everything needs to be pushed forward.

When the Moon is void, intentions launched into the world find no planetary 
witness to anchor them. They drift, untethered. This is not punishment—
it is instruction. The void teaches us that some things need to gestate 
in darkness before they can emerge.

The farmer knows this. You do not pull seedlings to check their growth. 
You trust the darkness. You trust the waiting. You trust that what is 
happening beneath the surface is as real as what appears above it.`,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ASPECT AS CONVERSATION - The Qualities of Each Dialogue
// ═══════════════════════════════════════════════════════════════════════════════

export interface AspectConversation {
  aspect: string;
  angle: number;
  nature: string;
  dialogue: string;
  lunarExperience: string;
  voidQuality: string;
  guidance: string;
  image: string;
}

export const aspectConversations: Record<string, AspectConversation> = {
  conjunction: {
    aspect: "Conjunction",
    angle: 0,
    nature: "Union",
    dialogue: "We merge. I become you. You become me. For this moment, there is no separation.",
    lunarExperience: "The Moon meets another body in the same degree. Energies fuse completely.",
    voidQuality: "Profoundly fertile void—what was seeded carries the full power of both bodies.",
    guidance: "The work begun now carries intensity. Guard what you plant carefully.",
    image: "Two rivers flowing into one",
  },
  
  sextile: {
    aspect: "Sextile",
    angle: 60,
    nature: "Collaboration",
    dialogue: "I see your gift. You see mine. Together, we build something neither could alone.",
    lunarExperience: "Flowing ease between complementary energies. Opportunity knocks gently.",
    voidQuality: "Gentle, supportive void—like lowering a sail in calm waters.",
    guidance: "Trust the ease. What comes naturally now carries blessing.",
    image: "Two hands weaving a basket",
  },
  
  square: {
    aspect: "Square",
    angle: 90,
    nature: "Tension",
    dialogue: "You challenge me. I resist you. From this friction, something new is born—or breaks.",
    lunarExperience: "Dynamic stress requiring adjustment. The Moon must adapt or overcome.",
    voidQuality: "Restless void—energy needs outlet, but direction is unclear.", 
    guidance: "Let the tension dissolve before acting. What feels urgent may not be important.",
    image: "Lightning finding its path to ground",
  },
  
  trine: {
    aspect: "Trine",
    angle: 120,
    nature: "Flow",
    dialogue: "We speak the same language. Gifts flow between us like water downhill.",
    lunarExperience: "Harmonious resonance. Natural talents and luck are amplified.",
    voidQuality: "Blessed void—grace lingers, carrying warmth into the silence.",
    guidance: "Receive what is offered. The universe is handing you something precious.",
    image: "A river flowing to the sea",
  },
  
  opposition: {
    aspect: "Opposition",
    angle: 180,
    nature: "Reflection",
    dialogue: "You stand opposite me, showing me what I cannot see in myself.",
    lunarExperience: "Full awareness through contrast. Relationship as mirror.",
    voidQuality: "Clarifying void—polarities resolve into understanding.",
    guidance: "Integration is possible now. Hold both sides without choosing.",
    image: "The full moon reflecting the sun",
  },
  
  quincunx: {
    aspect: "Quincunx",
    angle: 150,
    nature: "Adjustment",
    dialogue: "We do not understand each other. Something must shift for us to meet.",
    lunarExperience: "Awkward energy requiring compromise and adaptation.",
    voidQuality: "Uneasy void—something feels off, but the source is unclear.",
    guidance: "Let go of expectations. Adaptation is the only way through.",
    image: "A bridge being built between distant shores",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLANETARY VOICES - How Each Planet Speaks to the Moon
// ═══════════════════════════════════════════════════════════════════════════════

export interface PlanetaryVoice {
  planet: string;
  symbol: string;
  essence: string;
  conversationStyle: string;
  giftToMoon: string;
  shadowTeaching: string;
  color: string;
  element: string;
}

export const planetaryVoices: Record<string, PlanetaryVoice> = {
  sun: {
    planet: "Sun",
    symbol: "☉",
    essence: "Core self, vitality, purpose",
    conversationStyle: "The Sun does not ask. He shines. The Moon reflects his light and asks: 'Who are you becoming?'",
    giftToMoon: "Identity and direction. When the Moon speaks with the Sun, our feelings align with our purpose.",
    shadowTeaching: "Ego inflation. The void after Sun contact asks: Can you shine without being seen?",
    color: "#fbbf24", // Gold
    element: "fire",
  },
  
  moon: {
    planet: "Moon",
    symbol: "☽",
    essence: "Feelings, instincts, the body",
    conversationStyle: "The Moon speaks to herself in moments of introspection, honoring the cycles of feeling.",
    giftToMoon: "Self-nurturing and emotional authenticity. The Moon knows herself best in solitude.",
    shadowTeaching: "Emotional overwhelm. The void after lunar focus asks: Can you mother yourself?",
    color: "#c4b5fd", // Soft violet
    element: "water",
  },
  
  mercury: {
    planet: "Mercury",
    symbol: "☿",
    essence: "Mind, communication, perception",
    conversationStyle: "Mercury chatters, questions, analyzes. The Moon brings him feeling; he gives her words.",
    giftToMoon: "Clarity and articulation. The mind finally understands what the heart has known.",
    shadowTeaching: "Overthinking. The void after Mercury asks: Can you feel without needing to name it?",
    color: "#94a3b8", // Silver-grey
    element: "air",
  },
  
  venus: {
    planet: "Venus",
    symbol: "♀",
    essence: "Love, beauty, values, connection",
    conversationStyle: "Venus receives. She invites. She reminds the Moon that feeling is the foundation of relating.",
    giftToMoon: "Harmony and aesthetic appreciation. The heart opens to beauty and love.",
    shadowTeaching: "People-pleasing. The void after Venus asks: Can you hold your own value without reflection?",
    color: "#f472b6", // Rose
    element: "earth",
  },
  
  mars: {
    planet: "Mars",
    symbol: "♂",
    essence: "Drive, assertion, desire, conflict",
    conversationStyle: "Mars acts first, questions later. The Moon brings him the why; he gives her the how.",
    giftToMoon: "Courage and vitality. The energy to act on what we feel.",
    shadowTeaching: "Impulsive reaction. The void after Mars asks: Can you want without needing to have?",
    color: "#ef4444", // Red
    element: "fire",
  },
  
  jupiter: {
    planet: "Jupiter",
    symbol: "♃",
    essence: "Expansion, wisdom, faith, abundance",
    conversationStyle: "Jupiter laughs and says 'Yes, and...' He magnifies whatever the Moon brings him.",
    giftToMoon: "Optimism and meaning. Feelings expand into understanding; experiences become wisdom.",
    shadowTeaching: "Excess and overconfidence. The void after Jupiter asks: Can you trust without knowing why?",
    color: "#a78bfa", // Purple
    element: "air",
  },
  
  saturn: {
    planet: "Saturn",
    symbol: "♄",
    essence: "Structure, limitation, mastery, time",
    conversationStyle: "Saturn listens in silence. He asks only: 'Is this real? Will it last?'",
    giftToMoon: "Maturity and resilience. Feelings find form; dreams become foundations.",
    shadowTeaching: "Fear and restriction. The void after Saturn asks: Can you carry weight with grace?",
    color: "#64748b", // Slate
    element: "earth",
  },
  
  uranus: {
    planet: "Uranus",
    symbol: "♅",
    essence: "Awakening, revolution, individuality",
    conversationStyle: "Uranus interrupts. He shocks. He reminds the Moon that freedom is worth disruption.",
    giftToMoon: "Liberation and insight. Breakthroughs that change everything.",
    shadowTeaching: "Chaos and alienation. The void after Uranus asks: Can you be different and still belong?",
    color: "#22d3ee", // Electric blue
    element: "air",
  },
  
  neptune: {
    planet: "Neptune",
    symbol: "♆",
    essence: "Dreams, spirituality, dissolution, transcendence",
    conversationStyle: "Neptune dissolves boundaries. He whispers: 'All is one. You are the ocean, not the wave.'",
    giftToMoon: "Imagination and compassion. The ego dissolves into universal love.",
    shadowTeaching: "Delusion and escape. The void after Neptune asks: Can you dream and still stay grounded?",
    color: "#60a5fa", // Ocean blue
    element: "water",
  },
  
  pluto: {
    planet: "Pluto",
    symbol: "♇",
    essence: "Transformation, power, the underworld",
    conversationStyle: "Pluto sees through everything. He asks: 'What are you willing to die for? To be reborn?'",
    giftToMoon: "Depth and regeneration. Feelings become vehicles for profound change.",
    shadowTeaching: "Obsession and control. The void after Pluto asks: Can you let go of what must transform?",
    color: "#7c3aed", // Deep violet
    element: "water",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// THE SIGNATURES OF VOID - Qualities Based on Departing Aspect
// ═══════════════════════════════════════════════════════════════════════════════

export interface VoidSignature {
  aspect: string;
  planet: string;
  title: string;
  atmosphere: string;
  description: string;
  guidance: string[];
  practices: string[];
  journalPrompts: string[];
  color: string;
  temperature: 'warm' | 'cool' | 'neutral';
  texture: string;
}

export function generateVoidSignature(planet: string, aspect: string): VoidSignature {
  const voice = planetaryVoices[planet] || planetaryVoices.sun;
  const conversation = aspectConversations[aspect] || aspectConversations.sextile;
  
  const signatures: Record<string, Record<string, Partial<VoidSignature>>> = {
    sun: {
      conjunction: {
        title: "The Solar Threshold",
        atmosphere: "Like standing in a doorway between who you were and who you're becoming.",
        color: "#f59e0b",
        temperature: "warm",
        texture: "Radiant darkness",
      },
      trine: {
        title: "The Golden Path",
        atmosphere: "Confidence lingers like sunlight on your skin.",
        color: "#fcd34d",
        temperature: "warm",
        texture: "Woven light",
      },
      square: {
        title: "The Crucible",
        atmosphere: "Tension between heart and will. Something must give.",
        color: "#dc2626",
        temperature: "warm",
        texture: "Cracked earth",
      },
    },
    moon: {
      conjunction: {
        title: "The Dark Mirror",
        atmosphere: "Introspection so deep it becomes meditation.",
        color: "#8b5cf6",
        temperature: "cool",
        texture: "Still water",
      },
    },
    mercury: {
      sextile: {
        title: "The Gentle Understanding",
        atmosphere: "Thoughts settle like snow. Clarity emerges from silence.",
        color: "#94a3b8",
        temperature: "cool",
        texture: "Frost on glass",
      },
      square: {
        title: "The Unspoken",
        atmosphere: "Words fail. The body knows what the mind cannot name.",
        color: "#475569",
        temperature: "cool",
        texture: "Static on radio",
      },
    },
    venus: {
      trine: {
        title: "The Soft Release",
        atmosphere: "Love lingers like perfume. Beauty holds you without grasping.",
        color: "#f472b6",
        temperature: "warm",
        texture: "Rose petals",
      },
      sextile: {
        title: "The Quiet Invitation",
        atmosphere: "Connection ripples outward, touching everything gently.",
        color: "#fbcfe8",
        temperature: "warm",
        texture: "Silk",
      },
    },
    mars: {
      square: {
        title: "The Cooling Fire",
        atmosphere: "Battle energy dissipates. The warrior lays down arms.",
        color: "#991b1b",
        temperature: "neutral",
        texture: "Cooling embers",
      },
      trine: {
        title: "The Directed Will",
        atmosphere: "Purpose remains, but urgency fades. Steady, not striving.",
        color: "#ea580c",
        temperature: "warm",
        texture: "Forged metal",
      },
    },
    jupiter: {
      sextile: {
        title: "The Expanding Silence",
        atmosphere: "Possibility opens in all directions. Trust the widening.",
        color: "#a78bfa",
        temperature: "warm",
        texture: "Open sky",
      },
      trine: {
        title: "The Blessed Drift",
        atmosphere: "Grace carries you. You do not need to paddle.",
        color: "#8b5cf6",
        temperature: "warm",
        texture: "Warm wind",
      },
    },
    saturn: {
      conjunction: {
        title: "The Solemn Threshold",
        atmosphere: "Weight becomes wisdom. Structure stands, even when empty.",
        color: "#475569",
        temperature: "cool",
        texture: "Stone",
      },
      sextile: {
        title: "The Patient Craft",
        atmosphere: "Discipline softens into dedication. Work becomes devotion.",
        color: "#64748b",
        temperature: "cool",
        texture: "Carved wood",
      },
    },
  };
  
  const specific = signatures[planet]?.[aspect] || {};
  
  return {
    aspect,
    planet,
    title: specific.title || `The ${voice.planet} Release`,
    atmosphere: specific.atmosphere || "A space of transition. The old conversation has ended; the new has not begun.",
    description: `The Moon's last conversation was a ${conversation.aspect} with ${voice.planet}. ${conversation.dialogue} Now she walks alone through ${voice.essence.toLowerCase()}, carrying that resonance into silence.`,
    guidance: [
      `Honor what ${voice.planet} offered: ${voice.giftToMoon}`,
      `Watch for the shadow: ${voice.shadowTeaching}`,
      `In this void, practice: ${conversation.voidQuality}`,
    ],
    practices: generatePractices(planet, aspect),
    journalPrompts: generateJournalPrompts(planet, aspect),
    color: specific.color || voice.color,
    temperature: specific.temperature || "neutral",
    texture: specific.texture || "Breath",
  };
}

function generatePractices(planet: string, _aspect: string): string[] {
  const practices: Record<string, string[]> = {
    sun: ["Solar meditation: Feel the warmth at your solar plexus", "Set intentions without attachment to outcome", "Practice being seen without performing"],
    moon: ["Lunar bath: Water ritual for emotional cleansing", "Track your dreams tonight", "Ask your body what it needs"],
    mercury: ["Write without editing—three pages of stream of consciousness", "Practice silence for one hour", "Read poetry aloud"],
    venus: ["Beauty appreciation: Notice five beautiful things", "Self-touch: Massage your own hands or feet", "Create something without sharing it"],
    mars: ["Physical movement without goal—dance or walk aimlessly", "Cold water immersion or contrast shower", "Scream into a pillow, then rest"],
    jupiter: ["Gratitude practice: Name ten unexpected blessings", "Study something just for joy, not utility", "Give something away freely"],
    saturn: ["Structured rest: Set a timer and do nothing", "Tend to neglected responsibilities without rush", "Sit with discomfort without fixing it"],
    uranus: ["Break one small routine deliberately", "Free-write starting with 'What if everything changed?'", "Move your body in ways it never has"],
    neptune: ["Water meditation: Float or bathe with awareness", "Listen to music with eyes closed, fully absorbed", "Practice compassion without boundaries"],
    pluto: ["Shadow journaling: What are you avoiding?", "Release ritual: Burn or bury something symbolic", "Deep rest: Nap or savasana for 20+ minutes"],
  };
  return practices[planet] || ["Breathe consciously for five minutes", "Notice without labeling", "Rest as a sacred act"];
}

function generateJournalPrompts(planet: string, _aspect: string): string[] {
  const prompts: Record<string, string[]> = {
    sun: ["Who am I when no one is watching?", "What wants to be illuminated in my life?", "Where am I seeking external validation?"],
    moon: ["What did I feel today that I didn't name?", "What does my body need that I'm not giving it?", "When did I last truly rest?"],
    mercury: ["What thoughts keep circling that might not be true?", "What would I say if I knew I'd be understood?", "What am I overthinking?"],
    venus: ["Where do I hold my own value? Where do I outsource it?", "What relationships need tending without fixing?", "What is beautiful in my life right now?"],
    mars: ["What am I fighting that might not need to be fought?", "Where does my anger point to my needs?", "What desire am I afraid to name?"],
    jupiter: ["What is expanding in my life? Is it welcome?", "Where do I need more faith?", "What abundance am I not seeing?"],
    saturn: ["What responsibility is mine? What is not?", "Where do I need more structure? Where less?", "What have I mastered that I don't acknowledge?"],
    uranus: ["Where am I conforming when I want to rebel?", "What truth am I afraid to speak?", "How might I be more authentically myself?"],
    neptune: ["What am I escaping that needs facing?", "Where do boundaries blur that need clarity?", "What dream wants to be born through me?"],
    pluto: ["What needs to die so something new can live?", "Where do I give away my power?", "What transformation am I resisting?"],
  };
  return prompts[planet] || ["What is present right now?", "What wants to be released?", "What is waiting to be born?"];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ZODIAC SIGN POETRY - The Feel of Each Sign
// ═══════════════════════════════════════════════════════════════════════════════

export interface SignEssence {
  sign: string;
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water' | 'ether';
  modality: 'cardinal' | 'fixed' | 'mutable';
  essence: string;
  voidAtmosphere: string;
  color: string;
  landscape: string;
}

export const signEssences: Record<string, SignEssence> = {
  aries: { sign: "Aries", symbol: "♈", element: "fire", modality: "cardinal", essence: "The spark of initiation, raw and unrefined", voidAtmosphere: "Like a held breath before the battle cry", color: "#dc2626", landscape: "Volcanic plain at dawn" },
  taurus: { sign: "Taurus", symbol: "♉", element: "earth", modality: "fixed", essence: "The steady building, sensual and enduring", voidAtmosphere: "Like fertile soil waiting for seed", color: "#16a34a", landscape: "Lush valley in late spring" },
  gemini: { sign: "Gemini", symbol: "♊", element: "air", modality: "mutable", essence: "The gathering of information, curious and quick", voidAtmosphere: "Like wind in a silent room", color: "#facc15", landscape: "Library at midnight" },
  cancer: { sign: "Cancer", symbol: "♋", element: "water", modality: "cardinal", essence: "The nesting, the feeling, the protecting", voidAtmosphere: "Like tide pools at low tide", color: "#64748b", landscape: "Seaside cottage in fog" },
  leo: { sign: "Leo", symbol: "♌", element: "fire", modality: "fixed", essence: "The creative expression, radiant and proud", voidAtmosphere: "Like an empty stage with lights still warm", color: "#f97316", landscape: "Sun-drenched amphitheater" },
  virgo: { sign: "Virgo", symbol: "♍", element: "earth", modality: "mutable", essence: "The refining, the serving, the perfecting", voidAtmosphere: "Like a workshop with tools laid out", color: "#65a30d", landscape: "Herb garden at dusk" },
  libra: { sign: "Libra", symbol: "♎", element: "air", modality: "cardinal", essence: "The relating, the balancing, the beautifying", voidAtmosphere: "Like scales perfectly still", color: "#ec4899", landscape: "Marble courtyard at twilight" },
  scorpio: { sign: "Scorpio", symbol: "♏", element: "water", modality: "fixed", essence: "The penetrating, the transforming, the merging", voidAtmosphere: "Like deep water over hidden treasure", color: "#7c2d12", landscape: "Underground spring in darkness" },
  ophiuchus: { sign: "Ophiuchus", symbol: "⛎", element: "ether", modality: "fixed", essence: "The healing, the wisdom-keeping, the serpent-bearer", voidAtmosphere: "Like a medicine bag in silence", color: "#059669", landscape: "Ancient healing temple at dusk" },
  sagittarius: { sign: "Sagittarius", symbol: "♐", element: "fire", modality: "mutable", essence: "The seeking, the meaning-making, the expanding", voidAtmosphere: "Like a campfire after everyone has left", color: "#a855f7", landscape: "Mountain peak above clouds" },
  capricorn: { sign: "Capricorn", symbol: "♑", element: "earth", modality: "cardinal", essence: "The building, the mastering, the enduring", voidAtmosphere: "Like stone carved and waiting", color: "#374151", landscape: "Ancient temple on cliff" },
  aquarius: { sign: "Aquarius", symbol: "♒", element: "air", modality: "fixed", essence: "The innovating, the detaching, the humanitarian", voidAtmosphere: "Like static electricity in clear sky", color: "#06b6d4", landscape: "Observatory under starfield" },
  pisces: { sign: "Pisces", symbol: "♓", element: "water", modality: "mutable", essence: "The dissolving, the dreaming, the unifying", voidAtmosphere: "Like the horizon where sea meets sky", color: "#3b82f6", landscape: "Mist-covered ocean at dawn" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// THE MOON'S PATH - Educational Journey Content
// ═══════════════════════════════════════════════════════════════════════════════

export const moonJourneyContent = {
  title: "The Moon's Path Through the Zodiac",
  introduction: `Imagine the zodiac as a grand palace with twelve rooms. The Moon 
is a messenger who visits each room for just two and a half days. In each 
room, she meets the other planetary residents, exchanging information and 
energy before moving on.

When she has visited every room in the palace—completing her circuit 
in about 27.3 days—she has touched every part of your chart. Every planet. 
Every house. Every degree.

This is why the Moon is called the 'trigger' of the chart. She activates 
what the slower planets have set up. She brings the cosmic weather down 
to earth, into your body, into your daily experience.`,
  
  theDailyCycle: {
    title: "A Day in the Moon's Life",
    content: `In a single day, the Moon travels approximately 13 degrees. She 
may form several aspects or none, depending on where the other planets are 
positioned.

When she moves quickly, events unfold rapidly. When she slows (near her 
station), time seems to thicken.

Each morning, she rises in a new phase of relationship to the planets 
she encountered during the night. Each evening, she carries the day's 
exhaustion into darkness, releasing it as she goes void.`,
  },
  
  theVoidTeaches: {
    title: "What the Void Teaches Us",
    content: `The void of course Moon is not an absence. It is a completion 
cycle. It is the moment after the harvest and before the planting.

In agricultural societies, this was understood as sacred rest. The field 
must lie fallow. The soil must restore itself. If you plant during this 
time, your crops will not thrive—not because of punishment, but because 
the conditions are not yet right.

Modern life has forgotten this rhythm. We push constantly. The void Moon 
reminds us that there are times to act and times to allow. Times to speak 
and times to listen. Times to build and times to be still.

Learning to work with the void is learning to work with natural cycles 
rather than against them. It is the wisdom of patience.`,
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PERSONAL VOID PATTERNS - Natal Void Analysis
// ═══════════════════════════════════════════════════════════════════════════════

export interface NatalVoidPattern {
  description: string;
  gifts: string[];
  challenges: string[];
  integration: string;
}

export function generateNatalVoidPattern(moonSign: string, voidMoon: boolean): NatalVoidPattern {
  if (voidMoon) {
    return {
      description: `You were born during a Void of Course Moon in ${moonSign}. This is a rare and potent placement. From your first breath, you entered the world in a liminal state—between the old and the new, the finished and the beginning.

People born during void Moon often feel like they don't quite fit the world's timing. You may have learned that your natural rhythm differs from others. You might find that things you initiate don't always unfold as expected—or they unfold in unexpected ways.

This is not a flaw. It is a different way of moving through time. You are a bridge between worlds, comfortable in the spaces others rush through.`,
      gifts: [
        "Natural comfort with uncertainty and transition",
        "Ability to hold space for others in liminal times",
        "Creative insights that emerge from 'nowhere'",
        "Flexibility and adaptability to changing circumstances",
        "Deep understanding of the value of rest and gestation",
      ],
      challenges: [
        "May struggle with traditional productivity expectations",
        "Projects initiated might need multiple revisions or take unexpected turns",
        "Can feel out of sync with collective timing",
        "May be seen as 'slow' or 'uncertain' when actually processing deeply",
      ],
      integration: "Honor your different relationship with time. Don't force yourself into productivity models that don't fit. Instead, learn to use the void consciously—initiate before it begins, or wait until after it ends. Trust that your way of moving through the world has its own wisdom, even when others don't understand it.",
    };
  }
  
  const signEssence = signEssences[moonSign] || signEssences.aries;
  
  return {
    description: `You were born with the Moon in ${signEssence.sign}, connected and conversing with the other planets. From your first breath, you entered the world with the Moon actively engaged—receiving, responding, relating.

This suggests an emotional nature that naturally connects. You likely feel most alive when in relationship—whether with people, ideas, or creative projects. The Moon's aspects at your birth colored how you experience feeling itself.

When the Moon goes void now, you may feel it as a subtle disconnection—a sense that the 'phone lines' are down between you and the world. This is not malfunction; it is a reminder that even the most connected among us need times of solitude.`,
    gifts: [
      "Natural emotional responsiveness and attunement to others",
      "Ability to act on feelings with planetary support",
      "Strong connection between heart and world",
      "Projects initiated during active Moon periods likely to find support",
    ],
    challenges: [
      "May feel uncomfortable during void Moon periods—restlessness or disconnection",
      "Can over-rely on external validation or feedback",
      "Might struggle with true stillness when Moon is void",
    ],
    integration: "Learn to recognize when the Moon is void as a signal for you to turn inward. Your natural state is connection; the void offers you a different gift—the ability to connect with yourself. Use these times for introspection rather than external pursuit. The silence is not empty; it is full of you.",
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT ALL FOR USE IN SANCTUARY
// ═══════════════════════════════════════════════════════════════════════════════

export const sanctuaryContent = {
  moonTeachings,
  aspectConversations,
  planetaryVoices,
  signEssences,
  moonJourneyContent,
  generateVoidSignature,
  generateNatalVoidPattern,
};

export default sanctuaryContent;
