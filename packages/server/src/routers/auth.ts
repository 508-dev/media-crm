import { UserLogin, UserSignup } from "@media-crm/shared";
import { TRPCError } from "@trpc/server";
import {
  createSession,
  createUser,
  deleteSession,
  getUserByEmail,
  hashPassword,
  verifyPassword,
} from "../auth";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  signup: publicProcedure.input(UserSignup).mutation(async ({ input }) => {
    const existing = getUserByEmail(input.email);
    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already registered",
      });
    }

    const passwordHash = await hashPassword(input.password);
    const user = createUser(input.email, passwordHash, input.displayName);
    const sessionId = createSession(user.id);

    return {
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
      },
    };
  }),

  login: publicProcedure.input(UserLogin).mutation(async ({ input }) => {
    const user = getUserByEmail(input.email);
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }

    const sessionId = createSession(user.id);

    return {
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
      },
    };
  }),

  logout: protectedProcedure.mutation(({ ctx }) => {
    if (ctx.sessionId) {
      deleteSession(ctx.sessionId);
    }
    return { success: true };
  }),

  me: publicProcedure.query(({ ctx }) => {
    if (!ctx.user) {
      return null;
    }
    return {
      id: ctx.user.id,
      email: ctx.user.email,
      displayName: ctx.user.displayName,
      createdAt: ctx.user.createdAt,
    };
  }),
});
