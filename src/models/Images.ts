import { Image, Metadata } from "@prisma/client";
import { z } from "zod";

const BasicImageSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  prev_page: z.string().optional(),
  next_page: z.string().optional(),
  total_results: z.number(),
});

export const BasicPhotoSchema = z.object({
  id: z.number(),
  width: z.number(),
  height: z.number(),
  url: z.string(),
  alt: z.string(),
  src: z.object({
    large: z.string(),
  }),
  portfolio: z.boolean().optional(),
  profilePic: z.boolean().optional(),
});

export const PhotoSchema = BasicPhotoSchema.extend({
  photographer: z.string().optional(),
  photographer_url: z.string().optional(),
  photographer_id: z.number().optional(),
  blurredDataUrl: z.string().optional(),
  metadata: z
    .object({
      model: z.string().optional(),
      aperture: z.number().optional(),
      focalLength: z.number().optional(),
      exposureTime: z.number().optional(),
      iso: z.number().optional(),
      flash: z.string().optional(),
    })
    .optional(),
});

export const ImagesSchemaWithPhotos = BasicImageSchema.extend({
  photos: z.array(PhotoSchema),
});

export const InfiniteImagesSchemaWithPhotos = z.object({
  photos: z.array(PhotoSchema),
  nextCursor: z.number().nullable(),
});

export type Photo = z.infer<typeof PhotoSchema>;

export type ImagesResults = z.infer<typeof ImagesSchemaWithPhotos>;

export type ImagesInfiniteResults = z.infer<
  typeof InfiniteImagesSchemaWithPhotos
>;
