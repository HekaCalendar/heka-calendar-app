/**
 * HEKA Journal Templates
 * Pre-defined writing prompts and structures for celestial journaling
 */

export interface JournalTemplate {
  id: string;
  label: string;
  icon: string;
  description: string;
  content: string;
  tags: string[];
}

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'daily-reflection',
    label: 'Daily Reflection',
    icon: '🌅',
    description: 'Morning or evening check-in',
    tags: ['reflection', 'daily'],
    content: `## Today's Energy

**Mood:** 
**Body:** 
**Mind:** 

**What the sky is reflecting:**

**What I am releasing:**

**What I am calling in:**
`,
  },
  {
    id: 'new-moon-intentions',
    label: 'New Moon Intentions',
    icon: '🌑',
    description: 'Plant seeds under darkness',
    tags: ['new-moon', 'intentions'],
    content: `## New Moon in [Sign]

**What I am ready to begin:**

**This cycle, I commit to:**

**What I will no longer tolerate:**

**My affirmation for this lunation:**
`,
  },
  {
    id: 'full-moon-release',
    label: 'Full Moon Release',
    icon: '🌕',
    description: 'Let go under the light',
    tags: ['full-moon', 'release'],
    content: `## Full Moon in [Sign]

**What is illuminated in my life right now:**

**What I am grateful for:**

**What I am releasing with love:**

**How I am celebrating my growth:**
`,
  },
  {
    id: 'transit-tracking',
    label: 'Transit Journal',
    icon: '♃',
    description: 'Track major planetary transits',
    tags: ['transit', 'tracking'],
    content: `## Transit: [Planet] [Aspect] [Planet/Point]

**Exact date & time:**

**How this transit is showing up:**

**What area of life is being activated:**

**Actions I am taking:**

**Body sensations or dreams:**
`,
  },
  {
    id: 'dream-work',
    label: 'Dream Work',
    icon: '💤',
    description: 'Record and decode dreams',
    tags: ['dream', 'subconscious'],
    content: `## Dream Journal

**Date:** 
**Moon phase:** 

**The dream:**

**Key symbols & feelings:**

**Possible waking-life connection:**

**Action or inquiry:**
`,
  },
  {
    id: 'somatic-checkin',
    label: 'Somatic Check-In',
    icon: '🧘',
    description: 'Body-based awareness practice',
    tags: ['somatic', 'body'],
    content: `## Somatic Check-In

**Current body state:**

**Where tension lives:**

**Where ease lives:**

**What my body is asking for:**

**Grounding practice today:**
`,
  },
];
