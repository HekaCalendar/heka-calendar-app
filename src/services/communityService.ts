/**
 * Community Service
 * Firestore-powered public voting for holidays and features.
 */

import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  runTransaction,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, getCurrentUser } from './firebase';
import { store } from '../store';
import i18n from '../i18n';
import {
  setCommunityHolidays,
  addCommunityHoliday,
  updateCommunityHoliday,
  setCommunityFeatures,
  addCommunityFeature,
  updateCommunityFeature,
} from '../store';
import type { CommunityHoliday, CommunityFeature } from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT FEATURES
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULT_FEATURES: Omit<CommunityFeature, 'createdAt'>[] = [
  {
    id: 'birth-chart-sharing',
    title: 'Birth Chart Sharing',
    description: 'Share your natal chart with friends in your Cosmic Circle and compare planetary alignments.',
    icon: '🔮',
    category: 'social',
    votes: 0,
    status: 'planned',
  },
  {
    id: 'ai-voice-guidance',
    title: 'AI Voice Guidance',
    description: 'Listen to your daily celestial guidance narrated by a soothing AI voice.',
    icon: '🎙️',
    category: 'premium',
    votes: 0,
    status: 'considering',
  },
  {
    id: 'wearable-widgets',
    title: 'Wearable Widgets',
    description: 'Glanceable HEKA date, moon phase & planetary hours on Apple Watch and Wear OS.',
    icon: '⌚',
    category: 'integrations',
    votes: 0,
    status: 'planned',
  },
  {
    id: 'ical-google-sync',
    title: 'iCal & Google Sync',
    description: 'Synchronize your HEKA tasks and intentions with external calendar apps.',
    icon: '📅',
    category: 'integrations',
    votes: 0,
    status: 'in-progress',
  },
  {
    id: 'theme-marketplace',
    title: 'Theme Marketplace',
    description: 'Download and share community-created color themes and celestial palettes.',
    icon: '🎨',
    category: 'social',
    votes: 0,
    status: 'considering',
  },
  {
    id: 'group-rituals',
    title: 'Group Rituals',
    description: 'Schedule synchronized intention-setting sessions with your cosmic circle.',
    icon: '🔥',
    category: 'social',
    votes: 0,
    status: 'planned',
  },
  {
    id: 'dream-journal',
    title: 'Dream Journal',
    description: 'Log your dreams with automatic lunar phase and sign tagging for pattern insights.',
    icon: '🌙',
    category: 'astrology',
    votes: 0,
    status: 'considering',
  },
  {
    id: 'yearly-astro-report',
    title: 'Yearly Astrology Report',
    description: 'Generate a beautiful printable PDF with your annual celestial forecast.',
    icon: '📊',
    category: 'premium',
    votes: 0,
    status: 'planned',
  },
  {
    id: 'smart-notifications',
    title: 'Smart Notification Hub',
    description: 'Custom reminder rules triggered by upcoming transits and void-of-course moons.',
    icon: '🔔',
    category: 'productivity',
    votes: 0,
    status: 'in-progress',
  },
  {
    id: 'local-events',
    title: 'Local Community Events',
    description: 'Discover nearby full moon circles, astrology meetups, and celestial gatherings.',
    icon: '🌍',
    category: 'social',
    votes: 0,
    status: 'considering',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HOLIDAYS
// ═══════════════════════════════════════════════════════════════════════════════

let holidayUnsub: Unsubscribe | null = null;

export function attachCommunityHolidaysListener(): Unsubscribe {
  if (holidayUnsub) holidayUnsub();

  const q = query(collection(db, 'communityHolidays'), orderBy('createdAt', 'desc'));
  holidayUnsub = onSnapshot(
    q,
    (snap) => {
      const holidays: CommunityHoliday[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<CommunityHoliday, 'id'>),
      }));
      store.dispatch(setCommunityHolidays(holidays));
    },
    (err) => {
      console.error('[CommunityService] Holidays listener error:', err);
    }
  );

  return holidayUnsub;
}

export async function submitCommunityHoliday(
  holiday: Pick<CommunityHoliday, 'name' | 'date' | 'description' | 'suggestedBy'>
): Promise<string> {
  const user = getCurrentUser();
  if (!user) throw new Error(i18n.t('errors.notAuthenticated', { ns: 'circle' }));

  const ref = doc(collection(db, 'communityHolidays'));
  const payload: Omit<CommunityHoliday, 'id'> = {
    ...holiday,
    suggestedByUid: user.uid,
    votesUp: 0,
    votesDown: 0,
    status: 'pending',
    profanityChecked: true,
    voterUids: [],
    createdAt: new Date().toISOString(),
  };

  await setDoc(ref, {
    ...payload,
    createdAt: serverTimestamp(),
  });

  store.dispatch(addCommunityHoliday({ id: ref.id, ...payload, createdAt: new Date().toISOString() }));
  return ref.id;
}

const APPROVAL_THRESHOLD = 10;
const REJECTION_THRESHOLD = -5;

export async function voteHoliday(holidayId: string, direction: 'up' | 'down'): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const ref = doc(db, 'communityHolidays', holidayId);

  const result = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) {
      throw new Error(i18n.t('errors.holidayNotFound', { ns: 'circle' }));
    }

    const data = snap.data() as CommunityHoliday;
    const voterDirections: Record<string, 'up' | 'down'> = data.voterDirections || {};
    const existingDirection = voterDirections[user.uid];

    // Already voted same direction — no-op
    if (existingDirection === direction) {
      return { action: 'noop' as const, data };
    }

    let votesUp = data.votesUp || 0;
    let votesDown = data.votesDown || 0;

    // Switching direction: decrement old, increment new
    if (existingDirection) {
      if (existingDirection === 'up') votesUp = Math.max(0, votesUp - 1);
      else votesDown = Math.max(0, votesDown - 1);
    }

    if (direction === 'up') votesUp++;
    else votesDown++;

    voterDirections[user.uid] = direction;

    // Evaluate auto-approval/rejection
    const score = votesUp - votesDown;
    let newStatus = data.status;
    if (data.status === 'pending') {
      if (score >= APPROVAL_THRESHOLD) newStatus = 'approved';
      else if (score <= REJECTION_THRESHOLD) newStatus = 'rejected';
    }

    const update: Record<string, unknown> = {
      votesUp,
      votesDown,
      voterDirections,
    };

    // Keep voterUids in sync for backwards compatibility
    const voterUids = Object.keys(voterDirections);
    update.voterUids = voterUids;

    if (newStatus !== data.status) {
      update.status = newStatus;
    }

    transaction.update(ref, update);

    return {
      action: 'voted' as const,
      data: { ...data, id: holidayId, votesUp, votesDown, voterDirections, voterUids, status: newStatus },
    };
  });

  if (result.action === 'voted') {
    store.dispatch(updateCommunityHoliday(result.data));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FEATURES
// ═══════════════════════════════════════════════════════════════════════════════

let featureUnsub: Unsubscribe | null = null;

export async function seedCommunityFeaturesIfNeeded(): Promise<void> {
  const { getDocs } = await import('firebase/firestore');
  const snap = await getDocs(collection(db, 'communityFeatures'));
  if (!snap.empty) return;

  for (const f of DEFAULT_FEATURES) {
    // Use deterministic ID so we don't duplicate on re-seed attempts
    const ref = doc(db, 'communityFeatures', f.id);
    await setDoc(ref, {
      ...f,
      voterUids: [],
      createdAt: serverTimestamp(),
    });
  }
}

export function attachCommunityFeaturesListener(): Unsubscribe {
  if (featureUnsub) featureUnsub();

  const q = query(collection(db, 'communityFeatures'), orderBy('votes', 'desc'));
  featureUnsub = onSnapshot(
    q,
    (snap) => {
      const features: CommunityFeature[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<CommunityFeature, 'id'>),
      }));
      store.dispatch(setCommunityFeatures(features));
    },
    (err) => {
      console.error('[CommunityService] Features listener error:', err);
    }
  );

  return featureUnsub;
}

export async function voteFeature(featureId: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const ref = doc(db, 'communityFeatures', featureId);

  try {
    const result = await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(ref);

      if (!snap.exists()) {
        // On-demand seed if this feature hasn't been written to Firestore yet
        const defaultFeature = DEFAULT_FEATURES.find((f) => f.id === featureId);
        if (defaultFeature) {
          const seeded = {
            ...defaultFeature,
            voterUids: [user.uid],
            votes: 1,
            createdAt: serverTimestamp(),
          };
          transaction.set(ref, seeded);
          return { action: 'seeded' as const, data: { ...defaultFeature, voterUids: [user.uid], votes: 1, createdAt: new Date().toISOString() } as CommunityFeature };
        }
        throw new Error(i18n.t('errors.featureNotFound', { ns: 'circle' }));
      }

      const data = snap.data() as CommunityFeature;
      const voterUids = data.voterUids || [];

      // Already voted — no-op
      if (voterUids.includes(user.uid)) {
        return { action: 'noop' as const, data };
      }

      const votes = (data.votes || 0) + 1;
      voterUids.push(user.uid);

      transaction.update(ref, { votes, voterUids });

      return {
        action: 'voted' as const,
        data: { ...data, id: featureId, votes, voterUids } as CommunityFeature,
      };
    });

    if (result.action === 'seeded') {
      store.dispatch(addCommunityFeature(result.data));
    } else if (result.action === 'voted') {
      store.dispatch(updateCommunityFeature(result.data));
    }
    // noop: don't dispatch anything
  } catch (err: any) {
    console.error('[CommunityService] voteFeature failed:', err?.code, err?.message, err);
    throw err;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════════════════════════════════════════

export function detachCommunityListeners(): void {
  if (holidayUnsub) {
    holidayUnsub();
    holidayUnsub = null;
  }
  if (featureUnsub) {
    featureUnsub();
    featureUnsub = null;
  }
}
