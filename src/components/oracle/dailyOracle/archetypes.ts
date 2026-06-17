/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║              DAILY ORACLE — CARD ARCHETYPES                               ║
 * ║                                                                           ║
 * ║  24 celestial archetypes. Each maps to a pattern in the sky and           ║
 * ║  carries its own symbolism, poetry, and journaling invitation.            ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

export interface OracleArchetype {
  id: string;
  name: string;
  names: string[];           // pool of poetic titles
  number: number;            // 0-23, like tarot numbering
  element: 'fire' | 'water' | 'air' | 'earth' | 'void';
  modality: 'cardinal' | 'fixed' | 'mutable' | 'void';
  keywords: string[];
  symbol: string;            // unicode or emoji

  // Artwork DNA
  artwork: {
    baseShape: 'circle' | 'triangle' | 'square' | 'diamond' | 'star' | 'crescent' | 'spiral' | 'eye' | 'lotus' | 'flame' | 'wave' | 'mountain';
    primaryGradient: [string, string]; // [start, end] CSS colors
    secondaryGradient: [string, string];
    particleCount: number;   // number of floating dots/orbs
    hasRing: boolean;
    hasRays: boolean;
    hasMandala: boolean;
  };

  // Content pools
  insights: string[];
  shadows: string[];          // what to watch out for
  invitations: string[];      // calls to action
  journalPrompts: string[];
  affirmations: string[];
}

export const ORACLE_ARCHETYPES: OracleArchetype[] = [
  {
    id: 'new-moon',
    name: 'The Seed',
    names: ['The Seed', 'The Dark Gate', 'Void of Beginning', 'The Unspoken'],
    number: 0,
    element: 'void',
    modality: 'void',
    keywords: ['beginning', 'potential', 'sowing', 'intention', 'darkness'],
    symbol: '🌑',
    artwork: {
      baseShape: 'crescent',
      primaryGradient: ['#0a0a1a', '#1a1a3e'],
      secondaryGradient: ['#2a2a5e', '#0f0f2e'],
      particleCount: 3,
      hasRing: false,
      hasRays: false,
      hasMandala: false,
    },
    insights: [
      'Before the first breath, there is the intention. What are you planting in the dark?',
      'The soil does not ask what the seed will become. It simply holds it.',
      'Every visible thing was once invisible. Trust the germination.',
    ],
    shadows: [
      'Impatience with the gestation period. Wanting to see results before roots have formed.',
      'Starting too many seeds in too-small pots. Scattered energy.',
    ],
    invitations: [
      'Write one sentence that describes the version of you this cycle is growing toward.',
      'Plant a physical or metaphorical seed today.',
    ],
    journalPrompts: [
      'If I could begin one thing in complete secrecy, knowing no one would see it until it was ready, what would it be?',
      'What am I ready to gestate? What needs darkness to grow?',
      'The void is not empty — it is full of possibility. What possibility am I afraid to name?',
    ],
    affirmations: [
      'I trust the unseen work happening beneath the surface.',
      'My intentions are seeds. The dark is their ally.',
    ],
  },

  {
    id: 'full-moon',
    name: 'The Mirror',
    names: ['The Mirror', 'The Revelator', 'Silver Apex', 'The Unveiling'],
    number: 1,
    element: 'water',
    modality: 'fixed',
    keywords: ['illumination', 'completion', 'emotion', 'harvest', 'truth'],
    symbol: '🌕',
    artwork: {
      baseShape: 'circle',
      primaryGradient: ['#f5f0e1', '#e8dcc4'],
      secondaryGradient: ['#d4c4a8', '#c9b896'],
      particleCount: 12,
      hasRing: true,
      hasRays: true,
      hasMandala: true,
    },
    insights: [
      'What was hidden in shadow six months ago now stands in silver light. Look clearly.',
      'The Full Moon does not create what it reveals. It only offers the light to see it.',
      'Harvest is not just gathering. It is also the courage to look at what grew.',
    ],
    shadows: [
      'Illuminating others\' faults while avoiding your own reflection.',
      'Emotional overwhelm that drowns clarity.',
    ],
    invitations: [
      'Name one thing that has come to fruition since the last New Moon.',
      'Release one pattern that the light has exposed as no longer yours.',
    ],
    journalPrompts: [
      'What truth has been waiting for enough light to be seen?',
      'If my life right now is a harvest, what is ripe? What is overripe? What never grew?',
      'What do I see in others that I am not yet willing to see in myself?',
    ],
    affirmations: [
      'I receive the truth that the light reveals, even when it illuminates my shadow.',
      'What is ripe, I harvest. What is finished, I release.',
    ],
  },

  {
    id: 'mercury-retrograde',
    name: 'The Scribe Reversed',
    names: ['The Scribe Reversed', 'The Rewind', 'Mercury in the Underworld', 'The Unsending'],
    number: 2,
    element: 'air',
    modality: 'mutable',
    keywords: ['review', 'revision', 'miscommunication', 'return', 'reconsider'],
    symbol: '☿',
    artwork: {
      baseShape: 'spiral',
      primaryGradient: ['#1e3a5f', '#2d4a6f'],
      secondaryGradient: ['#4a6741', '#3a5731'],
      particleCount: 7,
      hasRing: true,
      hasRays: false,
      hasMandala: true,
    },
    insights: [
      'Not all forward motion is progress. Some doors must be walked back through.',
      'The word you are searching for was spoken already. Listen backward.',
      'What feels like delay is often realignment. Trust the loop.',
    ],
    shadows: [
      'Using retrograde as an excuse to avoid necessary conversations.',
      'Obsessive over-analysis that paralyzes decision-making.',
    ],
    invitations: [
      'Re-read something you wrote six months ago. What would you unsay?',
      'Reach out to someone from your past with no agenda.',
    ],
    journalPrompts: [
      'If I could revise one conversation from this month, which one? What would I say differently?',
      'What have I been rushing past that wants me to look again?',
      'What message from my past self am I finally ready to hear?',
    ],
    affirmations: [
      'I trust the wisdom of the backward glance.',
      'What returns to me comes with new eyes.',
    ],
  },

  {
    id: 'venus-transit',
    name: 'The Lover\'s Key',
    names: ['The Lover\'s Key', 'The Golden Door', 'Aphrodite\'s Mirror', 'The Invitation'],
    number: 3,
    element: 'water',
    modality: 'fixed',
    keywords: ['love', 'value', 'beauty', 'attraction', 'worth'],
    symbol: '♀',
    artwork: {
      baseShape: 'lotus',
      primaryGradient: ['#7b2d8e', '#a855a8'],
      secondaryGradient: ['#d4a5a5', '#c49494'],
      particleCount: 8,
      hasRing: true,
      hasRays: false,
      hasMandala: true,
    },
    insights: [
      'What you desire is also a map of what you believe you deserve.',
      'Venus does not ask if you are worthy of love. She asks if you are willing to receive it.',
      'Beauty is not decoration. It is intelligence made visible.',
    ],
    shadows: [
      'Seeking validation through others\' desire rather than self-regard.',
      'Confusing pleasure with nourishment.',
    ],
    invitations: [
      'Write a love letter to your body.',
      'Invest in one thing that makes your environment more beautiful.',
    ],
    journalPrompts: [
      'What do I want that I have told myself I cannot have?',
      'How do I withhold love from myself in the name of productivity or discipline?',
      'What would my life look like if I truly believed I was worthy of beauty?',
    ],
    affirmations: [
      'I am worthy of receiving what I desire.',
      'My value is not negotiable.',
    ],
  },

  {
    id: 'mars-square',
    name: 'The Forge',
    names: ['The Forge', 'The Crucible', 'Mars Unleashed', 'The Blade'],
    number: 4,
    element: 'fire',
    modality: 'cardinal',
    keywords: ['action', 'conflict', 'courage', 'drive', 'anger'],
    symbol: '♂',
    artwork: {
      baseShape: 'flame',
      primaryGradient: ['#8b2500', '#c43e00'],
      secondaryGradient: ['#e86a33', '#ff8c5a'],
      particleCount: 6,
      hasRing: false,
      hasRays: true,
      hasMandala: false,
    },
    insights: [
      'Friction creates heat. Heat creates change. You are not being attacked; you are being forged.',
      'Anger is not the enemy. Misdirected anger is. Where does your fire want to go?',
      'Courage is not the absence of fear. It is fear that has chosen a direction.',
    ],
    shadows: [
      'Impulsive action that burns bridges unnecessarily.',
      'Suppressing righteous anger until it explodes.',
    ],
    invitations: [
      'Do one thing today that requires physical courage.',
      'Name the boundary you have been avoiding asserting.',
    ],
    journalPrompts: [
      'What am I angry about, and what is the anger trying to protect?',
      'Where in my life have I been waiting for permission to act?',
      'If fear were not a factor, what would I do before sundown?',
    ],
    affirmations: [
      'My anger is sacred information. I listen to it.',
      'I am forged, not broken, by friction.',
    ],
  },

  {
    id: 'jupiter-blessing',
    name: 'The Open Hand',
    names: ['The Open Hand', 'The Great Yes', 'Jupiter\'s Crown', 'The Expansion'],
    number: 5,
    element: 'fire',
    modality: 'mutable',
    keywords: ['growth', 'abundance', 'faith', 'optimism', 'luck'],
    symbol: '♃',
    artwork: {
      baseShape: 'star',
      primaryGradient: ['#1a3a2a', '#2d5a3a'],
      secondaryGradient: ['#c9a84c', '#e8c76b'],
      particleCount: 15,
      hasRing: true,
      hasRays: true,
      hasMandala: true,
    },
    insights: [
      'Abundance is not about having more. It is about believing you are allowed to want.',
      'Jupiter expands whatever it touches. Make sure you are watering the right garden.',
      'The universe is not stingy. Your cup is just smaller than you think.',
    ],
    shadows: [
      'Overextension — saying yes to everything and committing to nothing.',
      'Spiritual bypassing: using optimism to avoid grief.',
    ],
    invitations: [
      'Say yes to one thing that scares you because it is bigger than your current container.',
      'Give something away without expectation of return.',
    ],
    journalPrompts: [
      'What would I do if I knew I could not fail?',
      'Where have I been playing small out of fear of outgrowing my relationships?',
      'What is one area of my life that is ready to expand, and what is holding it back?',
    ],
    affirmations: [
      'I am a vessel for abundance. The universe pours through me.',
      'Growth is my birthright. I do not shrink to make others comfortable.',
    ],
  },

  {
    id: 'saturn-lesson',
    name: 'The Threshold',
    names: ['The Threshold', 'The Stone Teacher', 'Saturn\'s Gate', 'The Necessary No'],
    number: 6,
    element: 'earth',
    modality: 'cardinal',
    keywords: ['discipline', 'limitation', 'maturity', 'structure', 'karma'],
    symbol: '♄',
    artwork: {
      baseShape: 'mountain',
      primaryGradient: ['#2a2a2a', '#3d3d3d'],
      secondaryGradient: ['#5a5a5a', '#707070'],
      particleCount: 4,
      hasRing: true,
      hasRays: false,
      hasMandala: false,
    },
    insights: [
      'The boundary is not the enemy. The boundary is the container that makes growth possible.',
      'Saturn does not punish. He teaches. The lesson is usually: you already knew.',
      'Maturity is choosing the difficult right over the easy wrong, even when no one is watching.',
    ],
    shadows: [
      'Rigid control that crushes spontaneity and joy.',
      'Using responsibility as an identity to avoid intimacy.',
    ],
    invitations: [
      'Commit to one disciplined practice for the next 28 days.',
      'Have the difficult conversation you have been postponing.',
    ],
    journalPrompts: [
      'What boundary have I been avoiding setting, and what is the cost?',
      'Where am I still acting from a place of childish rebellion rather than adult choice?',
      'What structure would actually free me, if I allowed it?',
    ],
    affirmations: [
      'I am the architect of my own limitations, and I can redesign.',
      'Discipline is freedom in disguise.',
    ],
  },

  {
    id: 'uranus-shock',
    name: 'The Lightning Rod',
    names: ['The Lightning Rod', 'The Sudden Door', 'Uranus Uncaged', 'The Break'],
    number: 7,
    element: 'air',
    modality: 'fixed',
    keywords: ['liberation', 'sudden change', 'innovation', 'rebellion', 'awakening'],
    symbol: '♅',
    artwork: {
      baseShape: 'diamond',
      primaryGradient: ['#00bcd4', '#006064'],
      secondaryGradient: ['#80deea', '#4dd0e1'],
      particleCount: 20,
      hasRing: false,
      hasRays: true,
      hasMandala: false,
    },
    insights: [
      'The tower does not fall because it is weak. It falls because lightning found the crack.',
      'You cannot plan a breakthrough. You can only prepare to be brave when it arrives.',
      'What feels like chaos is often the universe rerouting you around a dead end.',
    ],
    shadows: [
      'Disrupting stability for the thrill of chaos, not for growth.',
      'Rejecting all tradition without examining what wisdom it carries.',
    ],
    invitations: [
      'Break one routine today, deliberately.',
      'Tell someone a truth you have been protecting them from.',
    ],
    journalPrompts: [
      'What structure in my life is begging to be shattered?',
      'What truth have I known for years but have not had the courage to act on?',
      'If my life were struck by lightning, what would I be relieved to lose?',
    ],
    affirmations: [
      'I welcome the unexpected as a messenger, not a threat.',
      'My liberation is more important than my comfort.',
    ],
  },

  {
    id: 'neptune-dream',
    name: 'The Mist',
    names: ['The Mist', 'The Dissolving', 'Neptune\'s Veil', 'The Unknowing'],
    number: 8,
    element: 'water',
    modality: 'mutable',
    keywords: ['dreams', 'illusion', 'spirituality', 'dissolution', 'compassion'],
    symbol: '♆',
    artwork: {
      baseShape: 'wave',
      primaryGradient: ['#1a237e', '#283593'],
      secondaryGradient: ['#7986cb', '#9fa8da'],
      particleCount: 10,
      hasRing: true,
      hasRays: false,
      hasMandala: true,
    },
    insights: [
      'Not everything that dissolves is lost. Some things must become liquid to find their true shape.',
      'The dream you are chasing may be a distortion. What if the real desire is simpler?',
      'Compassion without boundaries is not compassion. It is self-erasure.',
    ],
    shadows: [
      'Escaping reality through fantasy, substances, or spiritual bypassing.',
      'Confusing pity with love.',
    ],
    invitations: [
      'Spend time near water today, even a sink. Let something dissolve.',
      'Write down a dream from last night, even fragments.',
    ],
    journalPrompts: [
      'What illusion am I most attached to maintaining?',
      'If I stopped pretending, what would my life actually look like?',
      'What am I trying to escape, and what would happen if I turned toward it?',
    ],
    affirmations: [
      'I trust the fog. I do not need to see the whole path to take one step.',
      'My sensitivity is a gift, not a weakness.',
    ],
  },

  {
    id: 'pluto-death',
    name: 'The Phoenix',
    names: ['The Phoenix', 'The Underworld', 'Pluto\'s Embrace', 'The Rebirth'],
    number: 9,
    element: 'water',
    modality: 'fixed',
    keywords: ['transformation', 'power', 'shadow', 'death', 'rebirth'],
    symbol: '♇',
    artwork: {
      baseShape: 'eye',
      primaryGradient: ['#1a0000', '#2e0000'],
      secondaryGradient: ['#6a1b1b', '#8b0000'],
      particleCount: 5,
      hasRing: true,
      hasRays: false,
      hasMandala: true,
    },
    insights: [
      'You cannot become who you are meant to be without killing who you have been.',
      'Power is not dominance. Power is the willingness to hold your own darkness without flinching.',
      'What dies today was already dead. You are just finally burying it.',
    ],
    shadows: [
      'Using power to control others as a substitute for self-mastery.',
      'Obsessive focus on the shadow that prevents growth toward the light.',
    ],
    invitations: [
      'Burn one thing — a letter, a list, a photograph — that represents what you are releasing.',
      'Name one pattern that died this month. Hold a funeral for it in your journal.',
    ],
    journalPrompts: [
      'What part of me needs to die so that something truer can be born?',
      'Where have I given my power away, and how do I reclaim it?',
      'What am I afraid to lose that is actually already lost?',
    ],
    affirmations: [
      'I am not afraid of endings. I am the Phoenix.',
      'My shadow is not my enemy. It is the compost for my becoming.',
    ],
  },

  {
    id: 'solar-return',
    name: 'The Renewal',
    names: ['The Renewal', 'The Solar Gate', 'Helios Returns', 'The Birthday'],
    number: 10,
    element: 'fire',
    modality: 'cardinal',
    keywords: ['rebirth', 'vitality', 'identity', 'purpose', 'celebration'],
    symbol: '☉',
    artwork: {
      baseShape: 'circle',
      primaryGradient: ['#ff9800', '#f57c00'],
      secondaryGradient: ['#ffeb3b', '#ffc107'],
      particleCount: 18,
      hasRing: true,
      hasRays: true,
      hasMandala: true,
    },
    insights: [
      'The sun returns to where it was when you were born. What have you become since then?',
      'Your birthday is not just aging. It is a personal new year. Treat it as such.',
      'The solar return asks: are you living your chart, or are you living someone else\'s expectations?',
    ],
    shadows: [
      'Birthday depression from comparing your life to imagined milestones.',
      'Narcissistic self-focus that ignores communal responsibility.',
    ],
    invitations: [
      'Write a letter to yourself one year from now. Seal it.',
      'Celebrate one thing about yourself that no one else knows.',
    ],
    journalPrompts: [
      'What would the child I was think of the adult I have become?',
      'If this year were a chapter, what would its title be?',
      'What am I ready to step into that I was not ready for last year?',
    ],
    affirmations: [
      'I am the sun of my own sky. I rise again.',
      'Every year is a new incarnation. I choose who I become.',
    ],
  },

  {
    id: 'lunar-eclipse',
    name: 'The Blood Gate',
    names: ['The Blood Gate', 'The Shadow Moon', 'Luna Obscured', 'The Reckoning'],
    number: 11,
    element: 'water',
    modality: 'fixed',
    keywords: ['shadow', 'release', 'crisis', 'ending', 'karmic'],
    symbol: '🌒',
    artwork: {
      baseShape: 'crescent',
      primaryGradient: ['#1a0a0a', '#2e1515'],
      secondaryGradient: ['#5a1a1a', '#3d0f0f'],
      particleCount: 6,
      hasRing: true,
      hasRays: false,
      hasMandala: true,
    },
    insights: [
      'The eclipse does not ask permission. It simply turns out the lights so you can see what glows in the dark.',
      'What collapses during an eclipse was never as solid as it seemed.',
      'Karma is not punishment. It is pattern recognition at the soul level.',
    ],
    shadows: [
      'Dramatizing minor endings into cosmic catastrophes.',
      'Using eclipse energy to justify impulsive destructive behavior.',
    ],
    invitations: [
      'Write a list of what you are ready to release. Burn it.',
      'Sit in complete darkness for five minutes. Let something surface.',
    ],
    journalPrompts: [
      'What has been hiding in my shadow that I am no longer willing to feed?',
      'If the universe forced an ending in my life right now, what would I secretly be relieved to lose?',
      'What karmic pattern am I ready to close the door on?',
    ],
    affirmations: [
      'I welcome endings as the midwives of new beginnings.',
      'What leaves me was never mine to keep.',
    ],
  },

  {
    id: 'stellium',
    name: 'The Convergence',
    names: ['The Convergence', 'The Many Become One', 'The Cluster', 'The Focus'],
    number: 12,
    element: 'void',
    modality: 'void',
    keywords: ['concentration', 'intensity', 'overload', 'fusion', 'specialization'],
    symbol: '✦',
    artwork: {
      baseShape: 'star',
      primaryGradient: ['#311b92', '#4527a0'],
      secondaryGradient: ['#7e57c2', '#9575cd'],
      particleCount: 25,
      hasRing: true,
      hasRays: true,
      hasMandala: true,
    },
    insights: [
      'When many forces gather in one place, something new is born. Do not resist the intensity.',
      'A stellium is not overload. It is the universe saying: this area of your life is a forge.',
      'What feels like chaos is often just too much truth arriving at once.',
    ],
    shadows: [
      'Neglecting all other life areas while obsessing over the stellium house.',
      'Burnout from trying to control forces that want to converge.',
    ],
    invitations: [
      'Identify the one area of your life that is demanding all your energy. Give it your full attention for one day.',
      'Say no to three things so you can say yes to the one thing that matters.',
    ],
    journalPrompts: [
      'What part of my life feels like it is on fire right now? Is it burning me, or is it forging me?',
      'Where am I scattered, and what would focused devotion look like?',
      'What would happen if I stopped managing the intensity and simply surrendered to it?',
    ],
    affirmations: [
      'I am a vessel for concentrated force. I can hold it.',
      'What converges in me becomes something new.',
    ],
  },

  {
    id: 'grand-trine',
    name: 'The River',
    names: ['The River', 'The Flow State', 'The Triangle of Grace', 'The Easy Gift'],
    number: 13,
    element: 'void',
    modality: 'void',
    keywords: ['flow', 'harmony', 'gift', 'effortlessness', 'creativity'],
    symbol: '△',
    artwork: {
      baseShape: 'triangle',
      primaryGradient: ['#004d40', '#00695c'],
      secondaryGradient: ['#4db6ac', '#80cbc4'],
      particleCount: 9,
      hasRing: false,
      hasRays: false,
      hasMandala: true,
    },
    insights: [
      'Not all good things require struggle. Some arrive like water finding its level.',
      'The grand trine is a gift, but gifts unopened are not really gifts. What have you been refusing to receive?',
      'Flow is not laziness. It is alignment made visible.',
    ],
    shadows: [
      'Taking the easy path so habitually that you never develop resilience.',
      'Missing opportunities because things feel "too easy" to be valuable.',
    ],
    invitations: [
      'Do one thing today that feels effortless and do more of it.',
      'Receive a compliment without deflecting it.',
    ],
    journalPrompts: [
      'What comes easily to me that I have been undervaluing?',
      'Where in my life am I fighting the current instead of swimming with it?',
      'What gift has the universe been trying to hand me that I keep refusing?',
    ],
    affirmations: [
      'I allow ease. I do not need to suffer to deserve good things.',
      'The river carries me. I trust the flow.',
    ],
  },

  {
    id: 't-square',
    name: 'The Crossroads',
    names: ['The Crossroads', 'The Pressure Point', 'The Apex', 'The Crisis'],
    number: 14,
    element: 'void',
    modality: 'void',
    keywords: ['tension', 'conflict', 'decision', 'pressure', 'growth'],
    symbol: '⊕',
    artwork: {
      baseShape: 'square',
      primaryGradient: ['#bf360c', '#e65100'],
      secondaryGradient: ['#ff8a65', '#ffab91'],
      particleCount: 8,
      hasRing: true,
      hasRays: true,
      hasMandala: false,
    },
    insights: [
      'The T-Square is not broken. It is a bow being drawn. Something is about to fly.',
      'You are at a crossroads not because you failed, but because you outgrew the road.',
      'Pressure reveals structure. What bends and what breaks tells you what you are made of.',
    ],
    shadows: [
      'Chronic indecision that turns crossroads into parking lots.',
      'Creating artificial crises to feel alive.',
    ],
    invitations: [
      'Make one decision today that you have been postponing.',
      'Identify the "missing leg" of your T-Square — what skill or resource would resolve the tension?',
    ],
    journalPrompts: [
      'What two forces in my life are pulling in opposite directions, and what is the third point that could resolve them?',
      'What decision am I avoiding because both options require loss?',
      'If pressure is a teacher, what is it trying to teach me right now?',
    ],
    affirmations: [
      'I am the bow. The tension is my power.',
      'I do not fear crossroads. I am the compass.',
    ],
  },

  {
    id: 'yod',
    name: 'The Finger of God',
    names: ['The Finger of God', 'The Pointer', 'The Fated Turn', 'The Adjustment'],
    number: 15,
    element: 'void',
    modality: 'void',
    keywords: ['fate', 'adjustment', 'destiny', 'surrender', 'correction'],
    symbol: '☝',
    artwork: {
      baseShape: 'triangle',
      primaryGradient: ['#4a148c', '#6a1b9a'],
      secondaryGradient: ['#ab47bc', '#ce93d8'],
      particleCount: 11,
      hasRing: true,
      hasRays: false,
      hasMandala: true,
    },
    insights: [
      'The Yod does not ask what you want. It points to what you must become.',
      'Fate is not a prison. It is a compass that ignores your preferences.',
      'What feels like a correction is often a redirection toward your true path.',
    ],
    shadows: [
      'Fatalism — using "fate" as an excuse to avoid agency.',
      'Resisting the correction so hard that the universe has to break you open.',
    ],
    invitations: [
      'Follow one intuitive hit today, even if it makes no logical sense.',
      'Surrender one plan that is not working and ask: what wants to happen instead?',
    ],
    journalPrompts: [
      'What keeps showing up in my life that I keep trying to ignore?',
      'If the universe were pointing at one area of my life saying "this," where would the finger land?',
      'What would I do differently if I truly believed I was being guided?',
    ],
    affirmations: [
      'I surrender my plan to a greater design.',
      'The finger of fate points me home. I follow.',
    ],
  },

  {
    id: 'void-moon',
    name: 'The Pause',
    names: ['The Pause', 'The Empty Vessel', 'Luna in Limbo', 'The Breath Between'],
    number: 16,
    element: 'void',
    modality: 'void',
    keywords: ['rest', 'liminality', 'pause', 'emptiness', 'integration'],
    symbol: '⦿',
    artwork: {
      baseShape: 'circle',
      primaryGradient: ['#263238', '#37474f'],
      secondaryGradient: ['#78909c', '#90a4ae'],
      particleCount: 2,
      hasRing: false,
      hasRays: false,
      hasMandala: false,
    },
    insights: [
      'The void moon is not empty. It is full of everything that has not yet been named.',
      'In the space between exhale and inhale, the whole universe waits.',
      'Rest is not the absence of action. It is the presence of preparation.',
    ],
    shadows: [
      'Filling every silence with noise because the void feels threatening.',
      'Using "rest" as procrastination.',
    ],
    invitations: [
      'Do nothing productive for one hour. Notice what arises.',
      'Sit in silence for ten minutes. Do not journal. Do not think. Just be.',
    ],
    journalPrompts: [
      'What am I afraid will happen if I stop moving?',
      'What is trying to integrate in me that I keep interrupting with action?',
      'If I truly rested, what would I have to feel?',
    ],
    affirmations: [
      'The void is my ally. In emptiness, I am remade.',
      'I do not need to earn rest. I am a human being, not a human doing.',
    ],
  },

  {
    id: 'cazimi',
    name: 'The Heart of the Sun',
    names: ['The Heart of the Sun', 'The Perfection', 'The Alchemical Marriage', 'The Core'],
    number: 17,
    element: 'fire',
    modality: 'fixed',
    keywords: ['perfection', 'power', 'clarity', 'sacred marriage', 'peak'],
    symbol: '☉',
    artwork: {
      baseShape: 'circle',
      primaryGradient: ['#ff6f00', '#ff8f00'],
      secondaryGradient: ['#ffd54f', '#ffecb3'],
      particleCount: 30,
      hasRing: true,
      hasRays: true,
      hasMandala: true,
    },
    insights: [
      'Cazimi means "in the heart of the sun." What is burning in you is not destroying you. It is completing you.',
      'There is a moment when the metal becomes gold. You are in that moment.',
      'Perfection is not the absence of flaw. It is the presence of complete alignment.',
    ],
    shadows: [
      'Hubris — believing the peak means you are above the cycle.',
      'Burning so brightly that you blind yourself to what is still in shadow.',
    ],
    invitations: [
      'Do one thing with complete, undivided attention today.',
      'Speak one truth that requires every ounce of your courage.',
    ],
    journalPrompts: [
      'What in me is being purified by fire right now?',
      'If I were truly aligned, what decision would be obvious?',
      'What does my soul know that my mind is still arguing with?',
    ],
    affirmations: [
      'I am in the heart of the fire, and I am not consumed.',
      'What burns away is not me. What remains is gold.',
    ],
  },

  {
    id: 'combust',
    name: 'The Overwhelm',
    names: ['The Overwhelm', 'The Too-Much', 'The Drowning Light', 'The Burnout'],
    number: 18,
    element: 'fire',
    modality: 'fixed',
    keywords: ['excess', 'overwhelm', 'burnout', 'loss of self', 'solar fatigue'],
    symbol: '☀',
    artwork: {
      baseShape: 'flame',
      primaryGradient: ['#b71c1c', '#c62828'],
      secondaryGradient: ['#ef5350', '#e57373'],
      particleCount: 14,
      hasRing: false,
      hasRays: true,
      hasMandala: false,
    },
    insights: [
      'Combustion is not failure. It is the signal that you have been too close to the fire for too long.',
      'The sun does not mean to burn you. But you are not meant to live inside it.',
      'Sometimes the most courageous thing is to step back from the light and recover in shadow.',
    ],
    shadows: [
      'Pushing through burnout as a virtue signal.',
      'Blaming yourself for needing rest.',
    ],
    invitations: [
      'Cancel one obligation today. Protect your energy.',
      'Spend time in shade, literal or metaphorical.',
    ],
    journalPrompts: [
      'What am I doing that is burning me out, and why do I keep doing it?',
      'Whose fire am I standing too close to?',
      'What would my life look like if I gave myself permission to be less visible?',
    ],
    affirmations: [
      'I step back from the fire to remember who I am without the heat.',
      'My worth is not measured by my output.',
    ],
  },

  {
    id: 'reception',
    name: 'The Exchange',
    names: ['The Exchange', 'The Mutual Gift', 'The Hospitality', 'The Welcome'],
    number: 19,
    element: 'void',
    modality: 'void',
    keywords: ['reciprocity', 'exchange', 'hospitality', 'mutual benefit', 'flow'],
    symbol: '⇄',
    artwork: {
      baseShape: 'diamond',
      primaryGradient: ['#33691e', '#558b2f'],
      secondaryGradient: ['#aed581', '#c5e1a5'],
      particleCount: 10,
      hasRing: true,
      hasRays: false,
      hasMandala: true,
    },
    insights: [
      'Reception means: I am in your house, and you feed me. You are in my house, and I feed you. The feeding is the relationship.',
      'Not all exchanges are transactional. Some are alchemical.',
      'What you give away freely returns to you transformed.',
    ],
    shadows: [
      'Keeping score in relationships until the scoreboard becomes the relationship.',
      'Giving to receive, which is not giving at all.',
    ],
    invitations: [
      'Offer help to someone without expecting anything in return.',
      'Receive help from someone without diminishing yourself.',
    ],
    journalPrompts: [
      'Where am I keeping score in a relationship, and what would happen if I stopped?',
      'What do I give easily, and what do I withhold? What does that pattern reveal?',
      'Who has been hospitable to my soul, and have I thanked them?',
    ],
    affirmations: [
      'I give freely. I receive gracefully. The exchange is sacred.',
      'What flows through me does not deplete me. It renews me.',
    ],
  },

  {
    id: 'mutual-application',
    name: 'The Meeting',
    names: ['The Meeting', 'The Convergence', 'The Appointment', 'The Dance'],
    number: 20,
    element: 'void',
    modality: 'void',
    keywords: ['union', 'timing', 'convergence', 'synchronicity', 'arrival'],
    symbol: '⚹',
    artwork: {
      baseShape: 'circle',
      primaryGradient: ['#006064', '#00838f'],
      secondaryGradient: ['#4dd0e1', '#80deea'],
      particleCount: 12,
      hasRing: true,
      hasRays: false,
      hasMandala: true,
    },
    insights: [
      'Two planets moving toward each other do not ask permission. They simply arrive.',
      'Synchronicity is not coincidence. It is the universe whispering: pay attention.',
      'The meeting that changes everything often looks like an ordinary Tuesday.',
    ],
    shadows: [
      'Forcing meetings before their time.',
      'Missing the convergence because you are looking at your phone.',
    ],
    invitations: [
      'Show up somewhere you would not normally go. See who shows up with you.',
      'Reach out to someone you have been thinking about. They may have been thinking about you.',
    ],
    journalPrompts: [
      'What meeting is approaching in my life that I need to prepare for?',
      'What synchronous events have I been dismissing as coincidence?',
      'If the universe were arranging a meeting between me and my future self, what would she say?',
    ],
    affirmations: [
      'I am exactly where I need to be for what is coming next.',
      'What is meant for me finds me. I do not chase. I arrive.',
    ],
  },

  {
    id: 'partile-exact',
    name: 'The Culmination',
    names: ['The Culmination', 'The Exact Moment', 'The Peak', 'The Perfect Degree'],
    number: 21,
    element: 'void',
    modality: 'void',
    keywords: ['peak', 'exactitude', 'climax', 'precision', 'arrival'],
    symbol: '⊙',
    artwork: {
      baseShape: 'circle',
      primaryGradient: ['#880e4f', '#ad1457'],
      secondaryGradient: ['#f06292', '#f48fb1'],
      particleCount: 16,
      hasRing: true,
      hasRays: true,
      hasMandala: true,
    },
    insights: [
      'Partile means exact to the degree. There is no more waiting. The moment is now.',
      'The peak is not the end. It is the view from which you choose your next mountain.',
      'Precision is not rigidity. It is the moment when everything aligns.',
    ],
    shadows: [
      'Believing the peak is permanent and being unprepared for the descent.',
      'Missing the moment by worrying about the next one.',
    ],
    invitations: [
      'Acknowledge one thing that has reached its exact moment of ripeness.',
      'Celebrate a peak before planning the next climb.',
    ],
    journalPrompts: [
      'What in my life has reached its exact moment of readiness?',
      'What have I been waiting for that is actually already here?',
      'If this is the peak, what do I want to remember about the view?',
    ],
    affirmations: [
      'I am present at the peak. I do not rush past my own arrival.',
      'The exact moment is now. I meet it fully.',
    ],
  },

  {
    id: 'separating',
    name: 'The Release',
    names: ['The Release', 'The Unwinding', 'The Letting Go', 'The After'],
    number: 22,
    element: 'void',
    modality: 'void',
    keywords: ['release', 'integration', 'aftermath', 'integration', 'completion'],
    symbol: '⟩',
    artwork: {
      baseShape: 'spiral',
      primaryGradient: ['#3e2723', '#4e342e'],
      secondaryGradient: ['#8d6e63', '#a1887f'],
      particleCount: 5,
      hasRing: false,
      hasRays: false,
      hasMandala: false,
    },
    insights: [
      'Separating does not mean the magic is over. It means the magic is now inside you.',
      'The aftermath is where integration happens. Do not skip it.',
      'What is leaving you was only ever on loan. Gratitude, not grief, is the proper farewell.',
    ],
    shadows: [
      'Nostalgia that prevents moving forward.',
      'Dismissing the integration period as "boring."',
    ],
    invitations: [
      'Write a thank-you letter to something that is leaving your life.',
      'Take one day to simply integrate before planning what is next.',
    ],
    journalPrompts: [
      'What am I holding on to that has already separated from me?',
      'What gift did the thing that is leaving give me that I get to keep?',
      'What does my body need to integrate what my mind has already processed?',
    ],
    affirmations: [
      'I release with gratitude. What leaves makes space for what arrives.',
      'The separation is not loss. It is the moment the lesson becomes mine.',
    ],
  },

  {
    id: 'solar-eclipse',
    name: 'The Crown',
    names: ['The Crown', 'The Solar Gate', 'The Shadow King', 'The Power Shift'],
    number: 23,
    element: 'fire',
    modality: 'cardinal',
    keywords: ['power', 'identity', 'leadership', 'visibility', 'authority'],
    symbol: '🌑',
    artwork: {
      baseShape: 'eye',
      primaryGradient: ['#212121', '#424242'],
      secondaryGradient: ['#f5f5f5', '#e0e0e0'],
      particleCount: 8,
      hasRing: true,
      hasRays: true,
      hasMandala: true,
    },
    insights: [
      'The solar eclipse asks: who are you when the light is taken away?',
      'Power is not given. It is revealed when the old structures collapse.',
      'The shadow that eclipses the sun is your own. Meet it.',
    ],
    shadows: [
      'Using a power shift to dominate rather than liberate.',
      'Fear of visibility that causes self-sabotage.',
    ],
    invitations: [
      'Step into one role you have been avoiding.',
      'Speak with authority on something you know to be true.',
    ],
    journalPrompts: [
      'Who am I when no one is watching, and is that person ready to lead?',
      'What power have I been denying because I am afraid of what comes with it?',
      'If I were crowned today, what would my first decree be?',
    ],
    affirmations: [
      'I am the sun and the shadow that eclipses it. I contain both.',
      'My power does not require permission. It requires ownership.',
    ],
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

export function getArchetypeById(id: string): OracleArchetype | undefined {
  return ORACLE_ARCHETYPES.find(a => a.id === id);
}

export function getArchetypeByNumber(num: number): OracleArchetype | undefined {
  return ORACLE_ARCHETYPES.find(a => a.number === num % ORACLE_ARCHETYPES.length);
}

export function pickFromPool<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}
