import { router } from "../trpc.js";
import { mediaRouter } from "./media.js";

export const appRouter = router({
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;
