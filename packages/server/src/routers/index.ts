import { router } from "../trpc";
import { authRouter } from "./auth";
import { mediaRouter } from "./media";

export const appRouter = router({
  auth: authRouter,
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;
