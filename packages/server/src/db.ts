import Database, { type Database as DatabaseType } from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.join(__dirname, "..", "media.db");

export const db: DatabaseType = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    rating REAL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

export function getAllMedia(filters?: { type?: string; status?: string }) {
  let query = "SELECT * FROM media";
  const conditions: string[] = [];
  const params: string[] = [];

  if (filters?.type) {
    conditions.push("type = ?");
    params.push(filters.type);
  }
  if (filters?.status) {
    conditions.push("status = ?");
    params.push(filters.status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY updated_at DESC";

  return db.prepare(query).all(...params);
}

export function getMediaById(id: number) {
  return db.prepare("SELECT * FROM media WHERE id = ?").get(id);
}

export function createMedia(data: {
  title: string;
  type: string;
  status: string;
  rating?: number | null;
  notes?: string;
}) {
  const stmt = db.prepare(`
    INSERT INTO media (title, type, status, rating, notes)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    data.title,
    data.type,
    data.status,
    data.rating ?? null,
    data.notes ?? null
  );
  return getMediaById(result.lastInsertRowid as number);
}

export function updateMedia(
  id: number,
  data: {
    title?: string;
    type?: string;
    status?: string;
    rating?: number | null;
    notes?: string;
  }
) {
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title);
  }
  if (data.type !== undefined) {
    fields.push("type = ?");
    values.push(data.type);
  }
  if (data.status !== undefined) {
    fields.push("status = ?");
    values.push(data.status);
  }
  if (data.rating !== undefined) {
    fields.push("rating = ?");
    values.push(data.rating);
  }
  if (data.notes !== undefined) {
    fields.push("notes = ?");
    values.push(data.notes);
  }

  if (fields.length === 0) {
    return getMediaById(id);
  }

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE media SET ${fields.join(", ")} WHERE id = ?`).run(
    ...values
  );

  return getMediaById(id);
}

export function deleteMedia(id: number) {
  const item = getMediaById(id);
  db.prepare("DELETE FROM media WHERE id = ?").run(id);
  return item;
}
