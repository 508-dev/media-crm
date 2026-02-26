import { z } from "zod";

export const MEDIA_TYPES = ["book", "movie", "tv_show", "game", "podcast"] as const;
export const MediaType = z.enum(MEDIA_TYPES);
export type MediaType = z.infer<typeof MediaType>;

export const MEDIA_STATUSES = ["want_to_consume", "in_progress", "completed", "dropped"] as const;
export const MediaStatus = z.enum(MEDIA_STATUSES);
export type MediaStatus = z.infer<typeof MediaStatus>;

export const MediaItemBase = z.object({
  title: z.string().min(1, "Title is required"),
  type: MediaType,
  status: MediaStatus,
  rating: z.number().min(0).max(10).nullable(),
  notes: z.string().nullable(),
});

export const MediaItemCreate = MediaItemBase;
export type MediaItemCreate = z.infer<typeof MediaItemCreate>;

export const MediaItemUpdate = MediaItemBase.partial();
export type MediaItemUpdate = z.infer<typeof MediaItemUpdate>;

export const MediaItem = MediaItemBase.extend({
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type MediaItem = z.infer<typeof MediaItem>;

export const MediaListFilter = z.object({
  type: MediaType.optional(),
  status: MediaStatus.optional(),
});
export type MediaListFilter = z.infer<typeof MediaListFilter>;
