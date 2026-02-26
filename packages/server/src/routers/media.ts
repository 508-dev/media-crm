import {
  MediaItemCreate,
  MediaItemUpdate,
  MediaListFilter,
} from "@media-crm/shared";
import { z } from "zod";
import {
  createMedia,
  deleteMedia,
  getAllMedia,
  getMediaById,
  updateMedia,
} from "../db";
import { protectedProcedure, router } from "../trpc";

export const mediaRouter = router({
  list: protectedProcedure
    .input(MediaListFilter.optional())
    .query(({ input, ctx }) => {
      const rows = getAllMedia(ctx.user.id, input);
      return rows;
    }),

  getById: protectedProcedure.input(z.number()).query(({ input, ctx }) => {
    const row = getMediaById(ctx.user.id, input);
    if (!row) {
      throw new Error("Media item not found");
    }
    return row;
  }),

  create: protectedProcedure
    .input(MediaItemCreate)
    .mutation(({ input, ctx }) => {
      const row = createMedia(ctx.user.id, input);
      return row;
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: MediaItemUpdate }))
    .mutation(({ input, ctx }) => {
      const row = updateMedia(ctx.user.id, input.id, input.data);
      if (!row) {
        throw new Error("Media item not found");
      }
      return row;
    }),

  delete: protectedProcedure.input(z.number()).mutation(({ input, ctx }) => {
    const row = deleteMedia(ctx.user.id, input);
    if (!row) {
      throw new Error("Media item not found");
    }
    return row;
  }),
});
