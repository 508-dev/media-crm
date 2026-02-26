import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { type NewMedia, media } from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "media.db");

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);

// Run migrations
migrate(db, { migrationsFolder: path.join(__dirname, "..", "drizzle") });

export function getAllMedia(
  userId: number,
  filters?: { type?: string; status?: string },
) {
  const conditions = [eq(media.userId, userId)];

  if (filters?.type) {
    conditions.push(
      eq(media.type, filters.type as (typeof media.type.enumValues)[number]),
    );
  }
  if (filters?.status) {
    conditions.push(
      eq(
        media.status,
        filters.status as (typeof media.status.enumValues)[number],
      ),
    );
  }

  return db
    .select()
    .from(media)
    .where(and(...conditions))
    .orderBy(desc(media.updatedAt))
    .all();
}

export function getMediaById(userId: number, id: number) {
  return db
    .select()
    .from(media)
    .where(and(eq(media.id, id), eq(media.userId, userId)))
    .get();
}

export function createMedia(userId: number, data: Omit<NewMedia, "userId">) {
  return db
    .insert(media)
    .values({ ...data, userId })
    .returning()
    .get();
}

export function updateMedia(
  userId: number,
  id: number,
  data: Partial<Omit<NewMedia, "id" | "userId">>,
) {
  const existing = getMediaById(userId, id);
  if (!existing) return undefined;

  return db
    .update(media)
    .set({ ...data, updatedAt: sql`datetime('now')` })
    .where(and(eq(media.id, id), eq(media.userId, userId)))
    .returning()
    .get();
}

export function deleteMedia(userId: number, id: number) {
  return db
    .delete(media)
    .where(and(eq(media.id, id), eq(media.userId, userId)))
    .returning()
    .get();
}
