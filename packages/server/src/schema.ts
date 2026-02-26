import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { MediaType, MediaStatus } from "@media-crm/shared";

// Extract enum values from Zod schemas - single source of truth
const mediaTypes = MediaType.options;
const mediaStatuses = MediaStatus.options;

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type", { enum: mediaTypes }).notNull(),
  status: text("status", { enum: mediaStatuses }).notNull(),
  rating: real("rating"),
  notes: text("notes"),
  createdAt: text("createdAt")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updatedAt")
    .notNull()
    .default(sql`(datetime('now'))`),
  completedAt: text("completedAt"),
});

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
