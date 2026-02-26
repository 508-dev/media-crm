import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  MediaItemCreate,
  MediaItemUpdate,
  MediaListFilter,
} from "@media-crm/shared";
import {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
} from "../db";


export const mediaRouter = router({
  list: publicProcedure.input(MediaListFilter.optional()).query(({ input }) => {
    const rows = getAllMedia(input);
    return rows;
  }),

  getById: publicProcedure.input(z.number()).query(({ input }) => {
    const row = getMediaById(input);
    if (!row) {
      throw new Error("Media item not found");
    }
    return row;
  }),

  create: publicProcedure.input(MediaItemCreate).mutation(({ input }) => {
    const row = createMedia(input);
    return row;
  }),

  update: publicProcedure
    .input(z.object({ id: z.number(), data: MediaItemUpdate }))
    .mutation(({ input }) => {
      const row = updateMedia(input.id, input.data);
      if (!row) {
        throw new Error("Media item not found");
      }
      return row;
    }),

  delete: publicProcedure.input(z.number()).mutation(({ input }) => {
    const row = deleteMedia(input);
    if (!row) {
      throw new Error("Media item not found");
    }
    return row;
  }),
});
