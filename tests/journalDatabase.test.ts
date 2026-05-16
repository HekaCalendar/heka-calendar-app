/**
 * Journal Database Tests
 * Covers: CRUD, revisions, sync queue, migration, search
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  dbClearAllEntries,
  dbCreateEntry,
  dbUpdateEntry,
  dbDeleteEntry,
  dbGetAllEntries,
  dbGetRevisions,
  dbRestoreRevision,
  dbSearchEntries,
  dbGetSyncQueue,
  dbMigrateFromLocalStorage,
  MAX_ENTRY_SIZE_BYTES,
  type JournalEntry,
} from '../src/services/journalDatabase';

// Ensure clean state before each test
beforeEach(async () => {
  await dbClearAllEntries();
});

function makeEntry(overrides: Partial<JournalEntry> = {}): Omit<JournalEntry, 'revisionCount' | 'syncStatus'> {
  return {
    id: `test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    date: '2024-06-15',
    timestamp: new Date().toISOString(),
    content: 'Test journal entry content',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('Journal Database - CRUD', () => {
  it('creates and retrieves an entry', async () => {
    const entry = makeEntry({ content: 'Hello world' });
    const created = await dbCreateEntry(entry);
    expect(created.content).toBe('Hello world');
    expect(created.revisionCount).toBe(0);
    expect(created.syncStatus).toBe('pending');

    const all = await dbGetAllEntries();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(created.id);
  });

  it('updates an entry and creates a revision', async () => {
    const entry = makeEntry({ content: 'Original' });
    const created = await dbCreateEntry(entry);

    const updated = await dbUpdateEntry(created.id, { content: 'Updated' });
    expect(updated.content).toBe('Updated');
    expect(updated.revisionCount).toBe(1);

    const revisions = await dbGetRevisions(created.id);
    expect(revisions).toHaveLength(1);
    expect(revisions[0].content).toBe('Original');
  });

  it('deletes an entry and its revisions', async () => {
    const entry = makeEntry();
    const created = await dbCreateEntry(entry);
    await dbUpdateEntry(created.id, { content: 'Updated' });

    await dbDeleteEntry(created.id);
    const all = await dbGetAllEntries();
    expect(all).toHaveLength(0);

    const revisions = await dbGetRevisions(created.id);
    expect(revisions).toHaveLength(0);
  });

  it('enforces maximum entry size', async () => {
    const hugeContent = 'x'.repeat(MAX_ENTRY_SIZE_BYTES + 100);
    const entry = makeEntry({ content: hugeContent });
    await expect(dbCreateEntry(entry)).rejects.toThrow('maximum size');
  });
});

describe('Journal Database - Search', () => {
  it('finds entries by content', async () => {
    await dbCreateEntry(makeEntry({ content: 'I dreamt of flying last night' }));
    await dbCreateEntry(makeEntry({ content: 'Work was stressful today' }));

    const results = await dbSearchEntries('dream');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].preview).toContain('dream');
  });

  it('finds entries by tags', async () => {
    await dbCreateEntry(makeEntry({ content: 'Morning meditation', tags: ['meditation', 'morning'] }));

    const results = await dbSearchEntries('meditation');
    expect(results.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Journal Database - Sync Queue', () => {
  it('queues operations on create/update/delete', async () => {
    const entry = makeEntry();
    const created = await dbCreateEntry(entry);

    const queue = await dbGetSyncQueue();
    expect(queue.length).toBeGreaterThanOrEqual(1);
    expect(queue.some(q => q.entryId === created.id && q.operation === 'create')).toBe(true);
  });
});

describe('Journal Database - Revision History', () => {
  it('restores a previous revision', async () => {
    const entry = makeEntry({ content: 'Version 1' });
    const created = await dbCreateEntry(entry);
    await dbUpdateEntry(created.id, { content: 'Version 2' });
    await dbUpdateEntry(created.id, { content: 'Version 3' });

    const restored = await dbRestoreRevision(created.id, 1);
    expect(restored.content).toBe('Version 1');

    const revisions = await dbGetRevisions(created.id);
    expect(revisions.length).toBeGreaterThanOrEqual(3);
  });

  it('prunes excess revisions', async () => {
    const entry = makeEntry({ content: 'Start' });
    const created = await dbCreateEntry(entry);

    for (let i = 0; i < 55; i++) {
      await dbUpdateEntry(created.id, { content: `Edit ${i}` }, { saveRevision: true });
    }

    const revisions = await dbGetRevisions(created.id);
    expect(revisions.length).toBeLessThanOrEqual(50);
  });
});

describe('Journal Database - Migration', () => {
  it('migrates localStorage data once', async () => {
    const legacy = [
      { id: 'legacy-1', date: '2024-01-01', timestamp: new Date().toISOString(), content: 'Legacy entry', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
    localStorage.setItem('heka_diary_entries', JSON.stringify(legacy));

    const count = await dbMigrateFromLocalStorage();
    expect(count).toBe(1);

    // Second migration should skip (entries already exist)
    const count2 = await dbMigrateFromLocalStorage();
    expect(count2).toBe(0);

    // Cleanup
    localStorage.removeItem('heka_diary_entries');
    await dbClearAllEntries();
  });
});
