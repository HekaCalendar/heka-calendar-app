/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    HEKA JOURNAL DATABASE — ENTERPRISE LAYER               ║
 * ║                                                                           ║
 * ║  Dexie.js IndexedDB backend replacing localStorage.                       ║
 * ║  Features: revision history, sync queue, search index, size limits.       ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import Dexie, { type Table } from 'dexie';
import type { DiaryEntry } from '../oracle/diaryTypes';

// ─── Extended Entry (stored in DB) ───────────────────────────────────────────

export interface JournalEntry extends DiaryEntry {
  /** User-defined tags */
  tags?: string[];
  /** Revision count */
  revisionCount: number;
  /** Sync status */
  syncStatus: 'synced' | 'pending' | 'failed';
  /** Last sync attempt */
  lastSyncAt?: string;
  /** Whether content is markdown */
  isMarkdown?: boolean;
}

// ─── Revision History ────────────────────────────────────────────────────────

export interface EntryRevision {
  id: string;           // composite: entryId + '#' + revNumber
  entryId: string;
  revNumber: number;    // 0 = original, increments
  content: string;
  timestamp: string;
  changeDescription?: string;
}

// ─── Sync Queue ──────────────────────────────────────────────────────────────

export type SyncOperation = 'create' | 'update' | 'delete';

export interface SyncQueueItem {
  id: string;           // auto-generated
  entryId: string;
  operation: SyncOperation;
  payload: Partial<JournalEntry> | null;
  attempts: number;
  createdAt: string;
  lastAttempt?: string;
  errorMessage?: string;
}

// ─── Full-Text Search Index ──────────────────────────────────────────────────

export interface SearchIndexDoc {
  entryId: string;
  words: string[];      // tokenized, normalized words
  contentPreview: string;
  updatedAt: string;
}

// ─── Dexie Schema ────────────────────────────────────────────────────────────

class JournalDatabase extends Dexie {
  entries!: Table<JournalEntry, string>;
  revisions!: Table<EntryRevision, string>;
  syncQueue!: Table<SyncQueueItem, string>;
  searchIndex!: Table<SearchIndexDoc, string>;
  oracleCards!: Table<import('../components/oracle/dailyOracle/cardEngine').DailyOracleCard, string>;

  constructor() {
    super('HekaJournalDB');
    this.version(3).stores({
      entries: 'id, date, timestamp, [date+timestamp], syncStatus, *tags',
      revisions: 'id, entryId, [entryId+revNumber]',
      syncQueue: 'id, entryId, createdAt',
      searchIndex: 'entryId, *words',
      oracleCards: 'date, archetypeId, element',
    }).upgrade((trans) => {
      // Remove the orphaned attachments object store from older installs.
      const idb = trans.idbtrans.db;
      if (idb.objectStoreNames.contains('attachments')) {
        idb.deleteObjectStore('attachments');
      }
    });
  }
}

const db = new JournalDatabase();

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_ENTRY_SIZE_BYTES = 500_000;           // ~500 KB per entry
const MAX_REVISIONS_PER_ENTRY = 50;

// ─── Tokenizer for search ────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')  // keep letters & numbers
    .split(/\s+/)
    .filter(w => w.length >= 2)
    .filter((w, i, arr) => arr.indexOf(w) === i);  // dedupe
}

// ─── Entry CRUD ──────────────────────────────────────────────────────────────

export async function dbGetAllEntries(): Promise<JournalEntry[]> {
  return db.entries.toArray();
}

export async function dbGetEntryById(id: string): Promise<JournalEntry | undefined> {
  return db.entries.get(id);
}

export async function dbGetEntriesByDate(date: string): Promise<JournalEntry[]> {
  return db.entries.where('date').equals(date).sortBy('timestamp');
}

export async function dbGetEntriesPaginated(
  offset: number,
  limit: number,
  direction: 'asc' | 'desc' = 'desc'
): Promise<JournalEntry[]> {
  const coll = db.entries.orderBy('timestamp');
  const items = direction === 'desc' ? await coll.reverse().offset(offset).limit(limit).toArray()
                                     : await coll.offset(offset).limit(limit).toArray();
  return items;
}

export async function dbCreateEntry(entry: Omit<JournalEntry, 'revisionCount' | 'syncStatus'>): Promise<JournalEntry> {
  const size = new Blob([entry.content]).size;
  if (size > MAX_ENTRY_SIZE_BYTES) {
    throw new Error(`Entry exceeds maximum size of ${MAX_ENTRY_SIZE_BYTES} bytes`);
  }

  const journalEntry: JournalEntry = {
    ...entry,
    revisionCount: 0,
    syncStatus: 'pending',
  };

  await db.entries.put(journalEntry);

  // Index for search
  await dbIndexEntry(journalEntry);

  // Add to sync queue
  await dbEnqueueSync(entry.id, 'create', journalEntry);

  return journalEntry;
}

export async function dbUpdateEntry(
  entryId: string,
  updates: Partial<JournalEntry>,
  options?: { saveRevision?: boolean; revisionNote?: string }
): Promise<JournalEntry> {
  const existing = await db.entries.get(entryId);
  if (!existing) throw new Error('Entry not found');

  const newContent = updates.content ?? existing.content;
  const size = new Blob([newContent]).size;
  if (size > MAX_ENTRY_SIZE_BYTES) {
    throw new Error(`Entry exceeds maximum size of ${MAX_ENTRY_SIZE_BYTES} bytes`);
  }

  const opts = { saveRevision: true, ...options };

  // Save revision before updating
  if (opts.saveRevision && updates.content !== undefined && updates.content !== existing.content) {
    const revNumber = (existing.revisionCount || 0) + 1;
    const revision: EntryRevision = {
      id: `${entryId}#${revNumber}`,
      entryId,
      revNumber,
      content: existing.content,
      timestamp: new Date().toISOString(),
      changeDescription: opts.revisionNote,
    };
    await db.revisions.put(revision);

    // Prune old revisions
    const revCount = await db.revisions.where('entryId').equals(entryId).count();
    if (revCount > MAX_REVISIONS_PER_ENTRY) {
      const oldest = await db.revisions.where('entryId').equals(entryId).sortBy('revNumber');
      const toDelete = oldest.slice(0, revCount - MAX_REVISIONS_PER_ENTRY);
      await db.revisions.bulkDelete(toDelete.map(r => r.id));
    }
  }

  const updated: JournalEntry = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
    revisionCount: (existing.revisionCount || 0) + (opts.saveRevision && updates.content !== existing.content ? 1 : 0),
    syncStatus: 'pending',
  };

  await db.entries.put(updated);
  await dbIndexEntry(updated);
  await dbEnqueueSync(entryId, 'update', updated);

  return updated;
}

export async function dbDeleteEntry(entryId: string): Promise<void> {
  await db.entries.delete(entryId);
  await db.revisions.where('entryId').equals(entryId).delete();
  await db.searchIndex.delete(entryId);
  await dbEnqueueSync(entryId, 'delete', null);
}

export async function dbClearAllEntries(): Promise<void> {
  await db.entries.clear();
  await db.revisions.clear();
  await db.searchIndex.clear();
  await db.syncQueue.clear();
}

export async function dbCountEntries(): Promise<number> {
  return db.entries.count();
}

// ─── Revisions ───────────────────────────────────────────────────────────────

export async function dbGetRevisions(entryId: string): Promise<EntryRevision[]> {
  return db.revisions.where('entryId').equals(entryId).sortBy('revNumber');
}

export async function dbRestoreRevision(entryId: string, revNumber: number): Promise<JournalEntry> {
  const revision = await db.revisions.get(`${entryId}#${revNumber}`);
  if (!revision) throw new Error('Revision not found');

  return dbUpdateEntry(entryId, { content: revision.content }, {
    saveRevision: true,
    revisionNote: `Restored from revision ${revNumber}`,
  });
}

// ─── Sync Queue ──────────────────────────────────────────────────────────────

export async function dbEnqueueSync(
  entryId: string,
  operation: SyncOperation,
  payload: Partial<JournalEntry> | null
): Promise<void> {
  // Deduplicate: remove existing pending items for this entry
  await db.syncQueue.where('entryId').equals(entryId).delete();

  const item: SyncQueueItem = {
    id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    entryId,
    operation,
    payload,
    attempts: 0,
    createdAt: new Date().toISOString(),
  };
  await db.syncQueue.put(item);
}

export async function dbGetSyncQueue(): Promise<SyncQueueItem[]> {
  return db.syncQueue.orderBy('createdAt').toArray();
}

export async function dbMarkSyncSuccess(itemId: string): Promise<void> {
  const item = await db.syncQueue.get(itemId);
  if (!item) return;
  await db.entries.update(item.entryId, { syncStatus: 'synced', lastSyncAt: new Date().toISOString() });
  await db.syncQueue.delete(itemId);
}

export async function dbMarkSyncFailed(itemId: string, error: string): Promise<void> {
  const item = await db.syncQueue.get(itemId);
  if (!item) return;
  await db.syncQueue.update(itemId, {
    attempts: item.attempts + 1,
    lastAttempt: new Date().toISOString(),
    errorMessage: error,
  });
  await db.entries.update(item.entryId, { syncStatus: 'failed' });
}

export async function dbClearSyncQueue(): Promise<void> {
  await db.syncQueue.clear();
}

// ─── Search Index ────────────────────────────────────────────────────────────

async function dbIndexEntry(entry: JournalEntry): Promise<void> {
  const text = `${entry.content} ${entry.tags?.join(' ') ?? ''} ${entry.insight?.text ?? ''}`;
  const words = tokenize(text);
  const preview = entry.content.slice(0, 200).replace(/\s+/g, ' ').trim();

  await db.searchIndex.put({
    entryId: entry.id,
    words,
    contentPreview: preview,
    updatedAt: new Date().toISOString(),
  });
}

export async function dbSearchEntries(query: string): Promise<{ entryId: string; preview: string }[]> {
  const qWords = tokenize(query);
  if (qWords.length === 0) return [];

  // Find docs that contain ANY of the query words
  const allDocs = await db.searchIndex.toArray();
  const scored = allDocs.map(doc => {
    const matches = qWords.filter(qw => doc.words.some(dw => dw.includes(qw) || qw.includes(dw)));
    return {
      entryId: doc.entryId,
      preview: doc.contentPreview,
      score: matches.length,
    };
  }).filter(s => s.score > 0);

  return scored.sort((a, b) => b.score - a.score);
}

// ─── Tags ────────────────────────────────────────────────────────────────────

export async function dbGetAllTags(): Promise<string[]> {
  const all = await db.entries.toArray();
  const tagSet = new Set<string>();
  all.forEach(e => e.tags?.forEach(t => tagSet.add(t)));
  return [...tagSet].sort();
}

export async function dbGetEntriesByTag(tag: string): Promise<JournalEntry[]> {
  return db.entries.where('tags').equals(tag).toArray();
}

// ─── Migration from localStorage ─────────────────────────────────────────────

export async function dbMigrateFromLocalStorage(): Promise<number> {
  try {
    const raw = localStorage.getItem('heka_diary_entries');
    if (!raw) return 0;

    const parsed: DiaryEntry[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;

    // Check if already migrated
    const existingCount = await db.entries.count();
    if (existingCount > 0) return 0; // Already has data, skip

    const entries: JournalEntry[] = parsed.map(e => ({
      ...e,
      revisionCount: 0,
      syncStatus: 'synced' as const,
      tags: [],
    }));

    await db.entries.bulkPut(entries);

    // Index all
    for (const entry of entries) {
      await dbIndexEntry(entry);
    }

    // Optionally clear localStorage after migration
    // localStorage.removeItem('heka_diary_entries');

    return entries.length;
  } catch (e) {
    console.error('[JournalDB] Migration failed:', e);
    return 0;
  }
}

// ─── Export ──────────────────────────────────────────────────────────────────

export { db };
export { MAX_ENTRY_SIZE_BYTES, MAX_REVISIONS_PER_ENTRY };
