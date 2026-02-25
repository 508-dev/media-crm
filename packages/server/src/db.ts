import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq, desc, and, sql } from "drizzle-orm";
import path from "path";
import { fileURLToPath } from "url";
import { media, type NewMedia } from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "media.db");

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

// Create table if not exists (Drizzle doesn't auto-migrate)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    rating REAL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export function getAllMedia(filters?: { type?: string; status?: string }) {
  const conditions = [];

  if (filters?.type) {
    conditions.push(eq(media.type, filters.type as typeof media.type.enumValues[number]));
  }
  if (filters?.status) {
    conditions.push(eq(media.status, filters.status as typeof media.status.enumValues[number]));
  }

  if (conditions.length > 0) {
    return db
      .select()
      .from(media)
      .where(and(...conditions))
      .orderBy(desc(media.updatedAt))
      .all();
  }

  return db.select().from(media).orderBy(desc(media.updatedAt)).all();
}

export function getMediaById(id: number) {
  return db.select().from(media).where(eq(media.id, id)).get();
}

export function createMedia(data: NewMedia) {
  return db.insert(media).values(data).returning().get();
}

export function updateMedia(
  id: number,
  data: Partial<Omit<NewMedia, "id">>
) {
  const existing = getMediaById(id);
  if (!existing) return undefined;

  return db
    .update(media)
    .set({ ...data, updatedAt: sql`datetime('now')` })
    .where(eq(media.id, id))
    .returning()
    .get();
}

export function deleteMedia(id: number) {
  return db.delete(media).where(eq(media.id, id)).returning().get();
}
