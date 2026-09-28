import Dexie, { Table } from 'dexie';
import { Card, Deck, StudySessionLog } from '../types';

export class RecallDatabase extends Dexie {
  decks!: Table<Deck, number>;
  cards!: Table<Card, number>;
  studyLogs!: Table<StudySessionLog, number>;

  constructor() {
    super('RecallDatabase');
    this.version(1).stores({
      decks: '++id, title, createdAt, updatedAt',
      cards: '++id, deckId, type, difficulty, dueDate, repetitions, starred',
      studyLogs: '++id, deckId, date, mode',
    });
    this.version(2).stores({
      decks: '++id, title, createdAt, updatedAt',
      cards: '++id, deckId, type, difficulty, dueDate, repetitions, starred, bookmarked',
      studyLogs: '++id, deckId, date, mode',
    });
  }
}

export const db = new RecallDatabase();

export async function createDeckWithCards(
  deckData: Omit<Deck, 'id' | 'totalCards' | 'createdAt' | 'updatedAt'>,
  cardsData: Omit<Card, 'id' | 'deckId'>[]
): Promise<number> {
  const now = new Date().toISOString();
  return await db.transaction('rw', db.decks, db.cards, async () => {
    const deckId = await db.decks.add({
      ...deckData,
      totalCards: cardsData.length,
      createdAt: now,
      updatedAt: now,
    } as Deck);

    const cardsToInsert = cardsData.map(c => ({
      ...c,
      deckId,
    }));

    await db.cards.bulkAdd(cardsToInsert as Card[]);
    return deckId;
  });
}

export async function deleteDeck(deckId: number): Promise<void> {
  await db.transaction('rw', db.decks, db.cards, db.studyLogs, async () => {
    await db.cards.where('deckId').equals(deckId).delete();
    await db.studyLogs.where('deckId').equals(deckId).delete();
    await db.decks.delete(deckId);
  });
}

export async function getDueCardsForDeck(deckId: number): Promise<Card[]> {
  const today = new Date().toISOString().slice(0, 10);
  return await db.cards
    .where('deckId')
    .equals(deckId)
    .and(c => c.dueDate <= today)
    .toArray();
}

export async function getAllDueCards(): Promise<Card[]> {
  const today = new Date().toISOString().slice(0, 10);
  return await db.cards
    .filter(c => c.dueDate <= today)
    .toArray();
}

export async function getBookmarkedCards(): Promise<Card[]> {
  return await db.cards
    .filter(c => !!c.bookmarked)
    .toArray();
}

export async function toggleCardBookmark(cardId: number, isBookmarked: boolean): Promise<void> {
  await db.cards.update(cardId, {
    bookmarked: isBookmarked,
    bookmarkedAt: isBookmarked ? new Date().toISOString() : undefined,
  });
}

