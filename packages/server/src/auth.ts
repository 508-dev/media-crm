import { randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { and, eq, gt } from "drizzle-orm";
import { db } from "./db";
import { type User, sessions, users } from "./schema";

const SALT_ROUNDS = 10;
const SESSION_DURATION_DAYS = 30;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function generateSessionId(): string {
  return randomBytes(32).toString("hex");
}

function getExpirationDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + SESSION_DURATION_DAYS);
  return date.toISOString();
}

export function createSession(userId: number): string {
  const sessionId = generateSessionId();
  const expiresAt = getExpirationDate();

  db.insert(sessions).values({ id: sessionId, userId, expiresAt }).run();

  return sessionId;
}

export function getSessionUser(sessionId: string): User | undefined {
  const now = new Date().toISOString();

  const result = db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      displayName: users.displayName,
      createdAt: users.createdAt,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, now)))
    .get();

  return result;
}

export function deleteSession(sessionId: string): void {
  db.delete(sessions).where(eq(sessions.id, sessionId)).run();
}

export function getUserByEmail(email: string): User | undefined {
  return db.select().from(users).where(eq(users.email, email)).get();
}

export function createUser(
  email: string,
  passwordHash: string,
  displayName?: string,
): User {
  return db
    .insert(users)
    .values({ email, passwordHash, displayName: displayName ?? null })
    .returning()
    .get();
}
