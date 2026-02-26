import { MediaStatus, MediaType } from "@media-crm/shared";
import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Extract enum values from Zod schemas - single source of truth
const mediaTypes = MediaType.options;
const mediaStatuses = MediaStatus.options;

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  displayName: text("displayName"),
  createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expiresAt").notNull(),
  createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
});

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type", { enum: mediaTypes }).notNull(),
  status: text("status", { enum: mediaStatuses }).notNull(),
  rating: real("rating"),
  notes: text("notes"),
  createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
  updatedAt: text("updatedAt").notNull().default(sql`(datetime('now'))`),
  completedAt: text("completedAt"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
