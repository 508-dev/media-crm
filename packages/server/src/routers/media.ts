import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  MediaItemCreate,
  MediaItemUpdate,
  MediaListFilter,
  type MediaItem,
} from "@media-crm/shared";
import {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
} from "../db";
import type { Media } from "../schema";

function toMediaItem(row: Media): MediaItem {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    status: row.status,
    rating: row.rating,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const mediaRouter = router({
  list: publicProcedure.input(MediaListFilter.optional()).query(({ input }) => {
    const rows = getAllMedia(input);
    return rows.map(toMediaItem);
  }),

  getById: publicProcedure.input(z.number()).query(({ input }) => {
    const row = getMediaById(input);
    if (!row) {
      throw new Error("Media item not found");
    }
    return toMediaItem(row);
  }),

  create: publicProcedure.input(MediaItemCreate).mutation(({ input }) => {
    const row = createMedia(input);
    return toMediaItem(row);
  }),

  update: publicProcedure
    .input(z.object({ id: z.number(), data: MediaItemUpdate }))
    .mutation(({ input }) => {
      const row = updateMedia(input.id, input.data);
      if (!row) {
        throw new Error("Media item not found");
      }
      return toMediaItem(row);
    }),

  delete: publicProcedure.input(z.number()).mutation(({ input }) => {
    const row = deleteMedia(input);
    if (!row) {
      throw new Error("Media item not found");
    }
    return toMediaItem(row);
  }),
});
