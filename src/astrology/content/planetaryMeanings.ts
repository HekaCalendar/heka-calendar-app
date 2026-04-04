/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PLANETARY MEANINGS - The Celestial Codex Content Engine
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Comprehensive astrological content for all planet/sign combinations.
 * Structured for maximum educational impact and personalization.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface PlanetSignContent {
  planet: string;
  sign: string;
  archetype: string;
  tagline: string;
  element: string;
  modality: string;
  
  // Core meaning
  essence: string[];
  
  // Shadow work
  shadow: {
    description: string;
    triggers: string[];
    growthPath: string;
    affirmation: string;
  };
  
  // Real world manifestations
  realWorld: {
    careers: string[];
    relationships: string;
    challenges: string[];
    strengths: string[];
  };
  
  // Famous examples
  famousExamples: Array<{
    name: string;
    note: string;
  }>;
  
  // Practical application
  journalPrompts: string[];
  practices: string[];
  
  // House-specific additions (applied at runtime)
  houseAmplifiers?: Record<number, string>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUN SIGN MEANINGS - Complete
// ═══════════════════════════════════════════════════════════════════════════════

export const sunMeanings: Record<string, PlanetSignContent> = {
  aries: {
    planet: 'sun',
    sign: 'aries',
    archetype: 'The Pioneer',
    tagline: 'Courage is your birthright',
    element: 'fire',
    modality: 'cardinal',
    essence: [
      'You are here to initiate, lead, and blaze new trails',
      'Your identity thrives on challenge, competition, and conquest',
      'You have an innate need to be first, best, and recognized',
      'Your vitality surges when you pursue bold, daring goals',
      'You are a natural warrior with an unshakeable will'
    ],
    shadow: {
      description: 'Your fire can burn bridges. Impulsiveness may lead to starting what you cannot finish. Anger flares hot but fades fast.',
      triggers: ['Being ignored', 'Losing', 'Waiting', 'Being told "no"', 'Feeling powerless'],
      growthPath: 'Practice patience as a skill, not a punishment. Channel your fire into sustained efforts. Before acting, take three breaths.',
      affirmation: 'I am strong enough to wait. My power grows through persistence.'
    },
    realWorld: {
      careers: ['Entrepreneur', 'Athlete', 'Surgeon', 'Military Leader', 'Startup Founder', 'Emergency Responder'],
      relationships: 'You pursue love with the same intensity as everything else. You need a partner who respects your independence and can keep up with your energy. You show love through action and protection.',
      challenges: ['Finishing projects', 'Listening before speaking', 'Managing anger', 'Considering others\' timing'],
      strengths: ['Leadership', 'Courage', 'Initiative', 'Enthusiasm', 'Independence']
    },
    famousExamples: [
      { name: 'Lady Gaga', note: 'Reinvents herself constantly, fearless performer' },
      { name: 'Robert Downey Jr.', note: 'Comeback warrior, charismatic leader' },
      { name: 'Steve Jobs', note: 'Visionary who demanded excellence' },
      { name: 'Maya Angelou', note: 'Pioneering voice, civil rights warrior' }
    ],
    journalPrompts: [
      'What would I do if I knew I could not fail?',
      'Where in my life am I waiting for permission?',
      'How can I channel my competitive drive constructively?',
      'What does courage look like in my daily life?'
    ],
    practices: [
      'Physical exercise daily - your fire needs an outlet',
      'Practice "pause before reacting" - count to 5',
      'Set one bold goal per month and see it through',
      'Compete only with your previous self'
    ]
  },
  
  taurus: {
    planet: 'sun',
    sign: 'taurus',
    archetype: 'The Builder',
    tagline: 'Your presence is your power',
    element: 'earth',
    modality: 'fixed',
    essence: [
      'You are here to create, cultivate, and build lasting value',
      'Your identity thrives on stability, beauty, and sensual pleasure',
      'You have an innate connection to the physical world and nature',
      'Your patience allows you to achieve what others abandon',
      'You are a grounding force, unshakeable in your convictions'
    ],
    shadow: {
      description: 'Your need for security can become stubbornness. You may resist necessary change and stay in comfort zones too long. Possessiveness can limit growth.',
      triggers: ['Sudden change', 'Financial insecurity', 'Rushed decisions', 'Disrespect of boundaries', 'Ugliness or chaos'],
      growthPath: 'Practice releasing one attachment per week. Embrace small changes as experiments. Your stability comes from within, not external circumstances.',
      affirmation: 'I am safe even in change. My worth is not my possessions.'
    },
    realWorld: {
      careers: ['Architect', 'Chef', 'Financial Advisor', 'Landscape Designer', 'Musician', 'Luxury Brand Manager'],
      relationships: 'You are loyal, devoted, and sensual. You need physical affection and consistency. Once committed, you are unshakeable. You show love through touch, gifts, and presence.',
      challenges: ['Adapting to change', 'Letting go of the past', 'Sharing possessions', 'Moving quickly when needed'],
      strengths: ['Reliability', 'Patience', 'Practical wisdom', 'Artistic sensibility', 'Determination']
    },
    famousExamples: [
      { name: 'Adele', note: 'Soulful voice, built career steadily' },
      { name: 'Dwayne "The Rock" Johnson', note: 'Built empire through consistent work' },
      { name: 'William Shakespeare', note: 'Timeless creator of lasting beauty' },
      { name: 'Audrey Hepburn', note: 'Elegant, timeless, grounded grace' }
    ],
    journalPrompts: [
      'What am I holding onto that no longer serves me?',
      'How do I define security, and is it serving my growth?',
      'What would I create if I had unlimited resources?',
      'Where in my life do I need more patience?'
    ],
    practices: [
      'Garden or care for plants - connect with growth cycles',
      'Cook with intention, savoring each flavor',
      'Create something tangible: art, craft, or organization',
      'Practice grounding meditation in nature'
    ]
  },
  
  gemini: {
    planet: 'sun',
    sign: 'gemini',
    archetype: 'The Messenger',
    tagline: 'Your curiosity is your compass',
    element: 'air',
    modality: 'mutable',
    essence: [
      'You are here to communicate, connect, and synthesize information',
      'Your identity thrives on variety, mental stimulation, and social exchange',
      'You have an innate gift for language, teaching, and translation',
      'Your adaptability lets you navigate any social situation',
      'You are a bridge-builder, connecting people and ideas'
    ],
    shadow: {
      description: 'Your mind moves so fast you may skim the surface. Restlessness can prevent depth. You may say things without considering impact.',
      triggers: ['Boredom', 'Repetition', 'Being misunderstood', 'Intellectual constraints', 'Emotional intensity'],
      growthPath: 'Practice deep listening. Choose one subject to study in depth. Finish conversations before starting new ones. Your gift is connection, not just collection.',
      affirmation: 'I am present in each moment. Depth enriches my breadth.'
    },
    realWorld: {
      careers: ['Journalist', 'Teacher', 'Translator', 'Public Relations', 'Social Media Manager', 'Writer'],
      relationships: 'You need mental connection above all. You are playful, curious, and need variety. You show love through words, ideas, and shared experiences. You need space to explore.',
      challenges: ['Commitment', 'Emotional depth', 'Finishing projects', 'Focusing on one thing'],
      strengths: ['Communication', 'Adaptability', 'Curiosity', 'Quick thinking', 'Social intelligence']
    },
    famousExamples: [
      { name: 'Kanye West', note: 'Controversial communicator, boundary-pusher' },
      { name: 'Marilyn Monroe', note: 'Chameleon-like performer, magnetic presence' },
      { name: 'Bob Dylan', note: 'Voice of a generation, master wordsmith' },
      { name: 'Angelina Jolie', note: 'Multi-faceted activist and actress' }
    ],
    journalPrompts: [
      'What have I been avoiding feeling by staying busy?',
      'Where could I benefit from going deeper instead of wider?',
      'How can I use my words to heal rather than distract?',
      'What single subject calls for my focused attention?'
    ],
    practices: [
      'Learn something new each week, then teach it to someone',
      'Practice "single-tasking" - one thing at a time',
      'Write daily: observations, ideas, stories',
      'Have one deep conversation without changing the subject'
    ]
  },
  
  cancer: {
    planet: 'sun',
    sign: 'cancer',
    archetype: 'The Nurturer',
    tagline: 'Your heart is your home',
    element: 'water',
    modality: 'cardinal',
    essence: [
      'You are here to nurture, protect, and create emotional safety',
      'Your identity thrives on deep connections, home, and belonging',
      'You have an innate gift for emotional intuition and care',
      'Your sensitivity is your superpower - you feel what others miss',
      'You are the heart of any family or community'
    ],
    shadow: {
      description: 'Your protective shell can become isolation. You may cling to the past or people. Emotional walls keep out the good with the bad.',
      triggers: ['Rejection', 'Criticism of loved ones', 'Feeling unsafe', 'Abandonment', 'Public exposure'],
      growthPath: 'Practice receiving care as well as giving it. Release one sentimental item. Your strength includes vulnerability.',
      affirmation: 'I am safe to be soft. My sensitivity is my gift.'
    },
    realWorld: {
      careers: ['Therapist', 'Chef', 'Real Estate Agent', 'Teacher', 'Social Worker', 'Interior Designer'],
      relationships: 'You are devoted, protective, and deeply caring. You need emotional security and trust. You show love through nurturing acts, cooking, and creating safe spaces. You never forget a slight or a kindness.',
      challenges: ['Letting go', 'Setting boundaries without walls', 'Moving forward', 'Dealing with conflict directly'],
      strengths: ['Emotional intelligence', 'Nurturing', 'Loyalty', 'Intuition', 'Creating comfort']
    },
    famousExamples: [
      { name: 'Princess Diana', note: 'The People\'s Princess, nurturing humanitarian' },
      { name: 'Tom Hanks', note: 'America\'s dad, beloved by all' },
      { name: 'Frida Kahlo', note: 'Art born from emotional depth' },
      { name: 'Meryl Streep', note: 'Chameleon of human emotion' }
    ],
    journalPrompts: [
      'What am I protecting myself from, and is it still a threat?',
      'How can I honor my past without living in it?',
      'Where do I need to receive more nurturing?',
      'What does "home" mean beyond a physical place?'
    ],
    practices: [
      'Create a sanctuary space in your home',
      'Cook a meal with love and intention',
      'Practice saying "I need" instead of "I\'m fine"',
      'Release one item from the past with gratitude'
    ]
  },
  
  leo: {
    planet: 'sun',
    sign: 'leo',
    archetype: 'The Sovereign',
    tagline: 'Your light is meant to shine',
    element: 'fire',
    modality: 'fixed',
    essence: [
      'You are here to create, lead with heart, and inspire others',
      'Your identity thrives on self-expression, recognition, and play',
      'You have an innate regal presence and creative brilliance',
      'Your generosity knows no bounds - you give from abundance',
      'You are meant to be seen, celebrated, and to celebrate life'
    ],
    shadow: {
      description: 'Your need for applause can become desperation for attention. Pride may prevent asking for help. You may demand loyalty without earning it.',
      triggers: ['Being ignored', 'Disrespect', 'Feeling irrelevant', 'Criticism of performance', 'Being upstaged'],
      growthPath: 'Practice creating without audience. Share credit generously. Your worth is intrinsic, not based on applause.',
      affirmation: 'I am enough even in silence. My value needs no audience.'
    },
    realWorld: {
      careers: ['Actor', 'CEO', 'Event Planner', 'Fashion Designer', 'Public Speaker', 'Creative Director'],
      relationships: 'You are warm, generous, and fiercely loyal. You need admiration and romance. You show love through grand gestures, protection, and making your person feel special. You expect loyalty and give it completely.',
      challenges: ['Sharing spotlight', 'Handling criticism', 'Humility', 'Accepting help'],
      strengths: ['Charisma', 'Creativity', 'Generosity', 'Leadership', 'Warmth']
    },
    famousExamples: [
      { name: 'Barack Obama', note: 'Charismatic leader, inspiring orator' },
      { name: 'Madonna', note: 'Queen of reinvention, relentless creator' },
      { name: 'Coco Chanel', note: 'Revolutionary fashion icon' },
      { name: 'Whitney Houston', note: 'Voice of a generation' }
    ],
    journalPrompts: [
      'What would I create if no one would see it?',
      'Where does my need for recognition hold me back?',
      'How can I celebrate others\' success as my own?',
      'What is my heart calling me to express?'
    ],
    practices: [
      'Create something and share it vulnerably',
      'Give someone else the spotlight',
      'Practice receiving compliments with "thank you" only',
      'Dance, sing, play - express joy daily'
    ]
  },
  
  virgo: {
    planet: 'sun',
    sign: 'virgo',
    archetype: 'The Alchemist',
    tagline: 'Excellence is your devotion',
    element: 'earth',
    modality: 'mutable',
    essence: [
      'You are here to refine, improve, and be of service',
      'Your identity thrives on mastery, analysis, and useful work',
      'You have an innate gift for seeing what others miss',
      'Your dedication to excellence elevates everything you touch',
      'You are here to heal through practical wisdom'
    ],
    shadow: {
      description: 'Your high standards can become self-criticism. You may get lost in details and miss the big picture. Anxiety about imperfection can paralyze you.',
      triggers: ['Chaos', 'Sloppiness', 'Being wrong', 'Feeling useless', 'Criticism of your work'],
      growthPath: 'Practice "good enough" as a skill. Your worth is not your productivity. Mistakes are data, not definitions.',
      affirmation: 'I am worthy even in my imperfections. Progress over perfection.'
    },
    realWorld: {
      careers: ['Editor', 'Healthcare Professional', 'Analyst', 'Nutritionist', 'Craftsperson', 'Researcher'],
      relationships: 'You show love through helpful acts and practical care. You need mental stimulation and appreciate competence. You may struggle to receive help. You notice everything about your person.',
      challenges: ['Perfectionism', 'Receiving help', 'Relaxing', 'Seeing the big picture'],
      strengths: ['Attention to detail', 'Problem-solving', 'Reliability', 'Practical wisdom', 'Service']
    },
    famousExamples: [
      { name: 'Beyoncé', note: 'Perfectionist performer, relentless work ethic' },
      { name: 'Michael Jackson', note: 'Meticulous artist, attention to every detail' },
      { name: 'Mother Teresa', note: 'Service as spiritual practice' },
      { name: 'Freddie Mercury', note: 'Technical mastery combined with showmanship' }
    ],
    journalPrompts: [
      'What would "good enough" look like in my current project?',
      'Where does my inner critic speak loudest?',
      'How can I be of service without depleting myself?',
      'What is perfect exactly as it is?'
    ],
    practices: [
      'Complete something imperfectly and release it',
      'Create systems and routines that support you',
      'Practice receiving help with gratitude',
      'Meditate on the beauty of imperfection'
    ]
  },
  
  libra: {
    planet: 'sun',
    sign: 'libra',
    archetype: 'The Diplomat',
    tagline: 'Harmony is your art',
    element: 'air',
    modality: 'cardinal',
    essence: [
      'You are here to create beauty, balance, and right relationship',
      'Your identity thrives on partnership, art, and social grace',
      'You have an innate gift for seeing all sides and finding middle ground',
      'Your aesthetic sense refines the world around you',
      'You are a peacemaker, bringing people together'
    ],
    shadow: {
      description: 'Your desire for harmony can become people-pleasing. Indecision may paralyze you. You may avoid necessary conflict and sacrifice authenticity for peace.',
      triggers: ['Conflict', 'Ugly environments', 'Injustice', 'Being alone', 'Having to choose sides'],
      growthPath: 'Practice making quick decisions. Conflict can lead to deeper intimacy. Your peace is not worth your truth.',
      affirmation: 'I can handle discord. My truth creates true harmony.'
    },
    realWorld: {
      careers: ['Diplomat', 'Designer', 'Lawyer', 'Couples Therapist', 'Art Curator', 'Event Planner'],
      relationships: 'You are romantic, charming, and deeply committed to partnership. You need beauty and intellectual connection. You may lose yourself in relationships. You show love through attention and creating beautiful experiences.',
      challenges: ['Decision-making', 'Standing alone', 'Confronting issues', 'Knowing your own mind'],
      strengths: ['Diplomacy', 'Aesthetic sense', 'Fairness', 'Charm', 'Collaboration']
    },
    famousExamples: [
      { name: 'Kim Kardashian', note: 'Built empire on aesthetics and relationships' },
      { name: 'John Lennon', note: 'Voice for peace and partnership' },
      { name: 'Catherine Zeta-Jones', note: 'Grace, beauty, and partnership' },
      { name: 'Hugh Jackman', note: 'Charming, diplomatic leading man' }
    ],
    journalPrompts: [
      'What truth am I avoiding to keep the peace?',
      'Who am I when I am completely alone?',
      'What decision have I been avoiding?',
      'How can I create beauty in a mundane moment?'
    ],
    practices: [
      'Make one decision quickly without second-guessing',
      'Create beauty in your environment daily',
      'Practice having a difficult conversation',
      'Spend time alone and enjoy your own company'
    ]
  },
  
  scorpio: {
    planet: 'sun',
    sign: 'scorpio',
    archetype: 'The Alchemist',
    tagline: 'Transformation is your nature',
    element: 'water',
    modality: 'fixed',
    essence: [
      'You are here to transform, heal, and penetrate surface realities',
      'Your identity thrives on depth, intensity, and authentic power',
      'You have an innate gift for seeing through deception and facades',
      'Your emotional courage allows you to go where others fear',
      'You are a phoenix - destruction and rebirth are your cycles'
    ],
    shadow: {
      description: 'Your intensity can overwhelm. You may seek control as safety. Suspicion can isolate you. Revenge poisons the vessel that holds it.',
      triggers: ['Betrayal', 'Superficiality', 'Loss of control', 'Being exposed', 'Invasion of privacy'],
      growthPath: 'Practice vulnerability as strength. Forgiveness frees you. Your power increases when you let go of control.',
      affirmation: 'I am safe in my vulnerability. I transform rather than destroy.'
    },
    realWorld: {
      careers: ['Psychologist', 'Surgeon', 'Detective', 'Crisis Manager', 'Research Scientist', 'Occultist'],
      relationships: 'You are all-or-nothing in love. You need depth, loyalty, and psychological intimacy. You are fiercely protective and may be possessive. You show love through total presence and transformative support.',
      challenges: ['Trust', 'Letting go', 'Forgiveness', 'Moderation', 'Vulnerability'],
      strengths: ['Emotional depth', 'Resilience', 'Intuition', 'Determination', 'Healing ability']
    },
    famousExamples: [
      { name: 'Leonardo DiCaprio', note: 'Intense commitment to craft and causes' },
      { name: 'Marie Curie', note: 'Pioneer who risked everything for discovery' },
      { name: 'Bill Gates', note: 'Transformed wealth into world-changing philanthropy' },
      { name: 'Hillary Clinton', note: 'Resilient through intense public scrutiny' }
    ],
    journalPrompts: [
      'What am I trying to control that I need to release?',
      'Where have I been avoiding emotional depth?',
      'What needs to die so something new can be born?',
      'How can I use my intensity as a healing force?'
    ],
    practices: [
      'Practice radical honesty with someone you trust',
      'Release one grudge through forgiveness',
      'Explore shadow work or depth psychology',
      'Transform something: compost, art, or a habit'
    ]
  },
  
  sagittarius: {
    planet: 'sun',
    sign: 'sagittarius',
    archetype: 'The Seeker',
    tagline: 'Your journey is the destination',
    element: 'fire',
    modality: 'mutable',
    essence: [
      'You are here to explore, expand, and seek truth',
      'Your identity thrives on freedom, adventure, and meaning',
      'You have an innate gift for seeing the big picture and inspiring others',
      'Your optimism is contagious - you light up rooms with possibility',
      'You are a philosopher, forever questioning and questing'
    ],
    shadow: {
      description: 'Your quest for freedom can become commitment-phobia. You may preach without practicing. Bluntness can wound. You may chase novelty over depth.',
      triggers: ['Feeling trapped', 'Boredom', 'Small-mindedness', 'Dishonesty', 'Routine'],
      growthPath: 'Practice staying when you want to run. Your truth is richer with lived experience. Commitment is not a cage but a container for growth.',
      affirmation: 'I find freedom within commitment. Depth expands my horizons.'
    },
    realWorld: {
      careers: ['Professor', 'Travel Writer', 'Philosopher', 'Entrepreneur', 'Motivational Speaker', 'Adventure Guide'],
      relationships: 'You need a partner who is also a fellow adventurer. You value honesty and hate feeling confined. You show love through shared experiences and philosophical connection. You need space to roam.',
      challenges: ['Commitment', 'Details and follow-through', 'Tact', 'Staying present'],
      strengths: ['Optimism', 'Vision', 'Honesty', 'Adventure', 'Teaching ability']
    },
    famousExamples: [
      { name: 'Taylor Swift', note: 'Storyteller who evolves constantly' },
      { name: 'Brad Pitt', note: 'Chameleon explorer of roles and cultures' },
      { name: 'Walt Disney', note: 'Dreamer who built impossible worlds' },
      { name: 'Jane Austen', note: 'Truth-teller through fiction' }
    ],
    journalPrompts: [
      'What am I running from that I need to face?',
      'Where could I benefit from staying instead of seeking?',
      'What truth have I been avoiding in myself?',
      'What does freedom actually mean to me?'
    ],
    practices: [
      'Commit to one thing for 30 days',
      'Travel physically or intellectually to somewhere new',
      'Share your wisdom by teaching someone',
      'Practice speaking truth with compassion'
    ]
  },
  
  capricorn: {
    planet: 'sun',
    sign: 'capricorn',
    archetype: 'The Master',
    tagline: 'Excellence takes time',
    element: 'earth',
    modality: 'cardinal',
    essence: [
      'You are here to achieve mastery and build lasting legacy',
      'Your identity thrives on ambition, responsibility, and tangible success',
      'You have an innate gift for strategy, patience, and climbing any mountain',
      'Your determination outlasts obstacles that stop others',
      'You are an elder soul, wise beyond your years'
    ],
    shadow: {
      description: 'Your drive for success can become workaholism. You may prioritize status over happiness. Cold pragmatism can isolate you. You may never feel "enough."',
      triggers: ['Failure', 'Public humiliation', 'Wasted time', 'Disrespect', 'Instability'],
      growthPath: 'Practice celebrating small wins. Your worth is not your achievements. Emotion is not weakness. Play is productive.',
      affirmation: 'I am enough as I am. My value exceeds my accomplishments.'
    },
    realWorld: {
      careers: ['CEO', 'Architect', 'Investment Banker', 'Government Official', 'Engineer', 'Executive Coach'],
      relationships: 'You are loyal, reliable, and take commitment seriously. You may prioritize work over relationships. You show love through provision and protection. You need a partner who respects your ambition.',
      challenges: ['Work-life balance', 'Vulnerability', 'Play and spontaneity', 'Receiving help'],
      strengths: ['Ambition', 'Discipline', 'Responsibility', 'Practical wisdom', 'Leadership']
    },
    famousExamples: [
      { name: 'Michelle Obama', note: 'Achieved excellence while maintaining grace' },
      { name: 'Jeff Bezos', note: 'Built empire through relentless strategy' },
      { name: 'David Bowie', note: 'Reinvented himself across decades' },
      { name: 'Martin Luther King Jr.', note: 'Climbed mountain for justice' }
    ],
    journalPrompts: [
      'Who am I when I am not achieving?',
      'What would I do if success was guaranteed?',
      'Where have I sacrificed joy for status?',
      'What legacy do I want to leave beyond career?'
    ],
    practices: [
      'Take a day off without guilt',
      'Set one goal for joy, not achievement',
      'Ask for and receive help',
      'Celebrate a small win with presence'
    ]
  },
  
  aquarius: {
    planet: 'sun',
    sign: 'aquarius',
    archetype: 'The Visionary',
    tagline: 'Your difference is your gift',
    element: 'air',
    modality: 'fixed',
    essence: [
      'You are here to innovate, liberate, and envision the future',
      'Your identity thrives on originality, community, and humanitarian ideals',
      'You have an innate gift for seeing possibilities others miss',
      'Your detachment allows objective insight and radical ideas',
      'You are here to shake up the status quo for the greater good'
    ],
    shadow: {
      description: 'Your detachment can become emotional distance. You may prioritize ideas over people. Rebellion without cause wastes energy. You may feel alienated by your own choosing.',
      triggers: ['Conformity pressure', 'Emotional demands', 'Being ordinary', 'Outdated rules', 'Loss of autonomy'],
      growthPath: 'Practice emotional presence. Your ideas need human connection to land. Rebellion is more powerful with purpose.',
      affirmation: 'I belong even in my uniqueness. My heart connects my visions.'
    },
    realWorld: {
      careers: ['Tech Innovator', 'Social Activist', 'Scientist', 'Humanitarian', 'Futurist', 'Community Organizer'],
      relationships: 'You need intellectual connection and freedom. You may struggle with emotional intimacy. You show love through friendship, shared causes, and accepting someone\'s weirdness completely. You need space.',
      challenges: ['Emotional intimacy', 'Conventional expectations', 'Staying grounded', 'Finishing projects'],
      strengths: ['Innovation', 'Objectivity', 'Humanitarian vision', 'Originality', 'Intellectual independence']
    },
    famousExamples: [
      { name: 'Oprah Winfrey', note: 'Revolutionized media and philanthropy' },
      { name: 'Steve Jobs', note: 'Visionary who saw what others could not' },
      { name: 'Galileo', note: 'Pioneer who challenged conventional wisdom' },
      { name: 'Ellen DeGeneres', note: 'Broke barriers with authenticity' }
    ],
    journalPrompts: [
      'What conventional belief am I ready to challenge?',
      'Where do I use "being different" as isolation?',
      'How can I make my vision accessible to others?',
      'What emotion have I been avoiding through intellect?'
    ],
    practices: [
      'Join or create a community for a cause you believe in',
      'Have a conversation about feelings, not ideas',
      'Create something that challenges the norm',
      'Practice grounding: feet on earth, breath in body'
    ]
  },
  
  pisces: {
    planet: 'sun',
    sign: 'pisces',
    archetype: 'The Mystic',
    tagline: 'Your imagination is real',
    element: 'water',
    modality: 'mutable',
    essence: [
      'You are here to dissolve boundaries and channel the divine',
      'Your identity thrives on creativity, compassion, and spiritual connection',
      'You have an innate gift for empathy that transcends the personal',
      'Your imagination is a portal to other dimensions of experience',
      'You are a vessel for universal love and artistic expression'
    ],
    shadow: {
      description: 'Your permeability can become confusion. You may escape reality through addiction or fantasy. Boundaries dissolve until you are lost. Your empathy can deplete you.',
      triggers: ['Harsh reality', 'Cruelty', 'Being pinned down', 'Material focus', 'Disillusionment'],
      growthPath: 'Practice discernment as a spiritual practice. Your sensitivity needs protection. Art is your medicine. Ground your dreams in action.',
      affirmation: 'I can be compassionate without being consumed. My dreams have form.'
    },
    realWorld: {
      careers: ['Artist', 'Musician', 'Healer', 'Therapist', 'Filmmaker', 'Spiritual Teacher'],
      relationships: 'You are a chameleon, merging with your beloved. You need spiritual and artistic connection. You may lose yourself in relationships. You show love through sacrifice, presence, and creative expression.',
      challenges: ['Boundaries', 'Practical matters', 'Discernment', 'Self-identity', 'Escapism'],
      strengths: ['Creativity', 'Compassion', 'Intuition', 'Artistic vision', 'Spiritual connection']
    },
    famousExamples: [
      { name: 'Rihanna', note: 'Chameleon artist, boundary-dissolving presence' },
      { name: 'Albert Einstein', note: 'Imagination more important than knowledge' },
      { name: 'Elizabeth Taylor', note: 'Lived large, loved deeply, transcended' },
      { name: 'Kurt Cobain', note: 'Channelled collective pain into art' }
    ],
    journalPrompts: [
      'Where am I escaping instead of facing?',
      'What boundary do I need to create with love?',
      'What is my art asking to be expressed?',
      'How can I ground my spiritual insights in action?'
    ],
    practices: [
      'Create art daily: music, writing, visual, movement',
      'Meditate or pray to connect with something greater',
      'Practice saying "no" with compassion',
      'Ground yourself: eat root vegetables, walk barefoot'
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT ACCESS FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getPlanetSignContent(planet: string, sign: string): PlanetSignContent | null {
  const normalizedPlanet = planet.toLowerCase();
  const normalizedSign = sign.toLowerCase();
  
  // For now, we have Sun meanings. In full implementation, expand to all planets
  if (normalizedPlanet === 'sun') {
    return sunMeanings[normalizedSign] || null;
  }
  
  // Return Sun content as fallback for now (expand later)
  return sunMeanings[normalizedSign] || null;
}

export function getPlanetArchetype(planet: string, sign: string): string {
  const content = getPlanetSignContent(planet, sign);
  return content?.archetype || 'The Seeker';
}

export function getPlanetTagline(planet: string, sign: string): string {
  const content = getPlanetSignContent(planet, sign);
  return content?.tagline || 'Your journey unfolds';
}

export function getAllSignsForPlanet(planet: string): string[] {
  if (planet.toLowerCase() === 'sun') {
    return Object.keys(sunMeanings);
  }
  return [];
}
