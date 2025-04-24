import { z } from "zod";
import { PhotoSchema } from "./Images";

const BasicGallerySchema = z.object({
  page: z.number(),
  per_page: z.number(),
  prev_page: z.string().optional(),
  next_page: z.string().optional(),
  total_results: z.number(),
});

export const GallerySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  images: z.array(PhotoSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const GalleriesSchemaWithImages = BasicGallerySchema.extend({
  galleries: z.array(GallerySchema),
});

export const GalleriesSchemaWithImagesInfinite = z.object({
  galleries: z.array(GallerySchema),
  nextCursor: z.number().nullable(),
  totalResults: z.number(),
});

// Type inference
export type Gallery = z.infer<typeof GallerySchema>;
export type GalleriesResults = z.infer<typeof GalleriesSchemaWithImages>;
export type GalleriesResultsInfinite = z.infer<
  typeof GalleriesSchemaWithImagesInfinite
>;
