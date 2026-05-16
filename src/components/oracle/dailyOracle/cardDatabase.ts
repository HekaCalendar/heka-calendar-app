/**
 * Daily Oracle Card — IndexedDB persistence
 */

import { db } from '../../../services/journalDatabase';
import type { DailyOracleCard } from './cardEngine';

const CARDS_TABLE = 'oracleCards';

export async function dbSaveCard(card: DailyOracleCard): Promise<void> {
  await db.table(CARDS_TABLE).put(card);
}

export async function dbGetTodaysCard(): Promise<DailyOracleCard | undefined> {
  const today = new Date().toISOString().split('T')[0];
  return db.table(CARDS_TABLE).get(today);
}

export async function dbGetCardByDate(date: string): Promise<DailyOracleCard | undefined> {
  return db.table(CARDS_TABLE).get(date);
}

export async function dbGetAllCards(): Promise<DailyOracleCard[]> {
  return db.table(CARDS_TABLE).orderBy('date').reverse().toArray();
}

export async function dbGetCardsByArchetype(archetypeId: string): Promise<DailyOracleCard[]> {
  return db.table(CARDS_TABLE).where('archetypeId').equals(archetypeId).reverse().toArray();
}

export async function dbGetCardsByElement(element: string): Promise<DailyOracleCard[]> {
  return db.table(CARDS_TABLE).where('element').equals(element).reverse().toArray();
}
