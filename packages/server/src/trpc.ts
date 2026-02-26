import { TRPCError, initTRPC } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getSessionUser } from "./auth";
import type { User } from "./schema";

export interface Context {
  user: User | null;
  sessionId: string | null;
}

export async function createContext({
  req,
}: CreateExpressContextOptions): Promise<Context> {
  const sessionId =
    req.cookies?.sessionId || req.headers.authorization?.replace("Bearer ", "");

  if (!sessionId) {
    return { user: null, sessionId: null };
  }

  const user = getSessionUser(sessionId) ?? null;
  return { user, sessionId };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
