import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  MediaItemCreate,
  MediaItemUpdate,
  MediaListFilter,
  MediaItem,
} from "@media-crm/shared";
import {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
} from "../db";

function toMediaItem(row: unknown): MediaItem {
  const r = row as {
    id: number;
    title: string;
    type: string;
    status: string;
    rating: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
  };
  return {
    id: r.id,
    title: r.title,
    type: r.type as MediaItem["type"],
    status: r.status as MediaItem["status"],
    rating: r.rating,
    notes: r.notes ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export const mediaRouter = router({
  list: publicProcedure.input(MediaListFilter.optional()).query(({ input }) => {
    const rows = getAllMedia(input);
    return (rows as unknown[]).map(toMediaItem);
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
      const existing = getMediaById(input.id);
      if (!existing) {
        throw new Error("Media item not found");
      }
      const row = updateMedia(input.id, input.data);
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
