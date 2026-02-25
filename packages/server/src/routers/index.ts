import { router } from "../trpc";
import { mediaRouter } from "./media";

export const appRouter = router({
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;
