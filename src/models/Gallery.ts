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
  createdAt: z.string(),
  updatedAt: z.string(),
  images: z.array(
    z.object({
      id: z.number(),
      url: z.string(),
      alt: z.string(),
      width: z.number(),
      height: z.number(),
      src: z.object({ large: z.string() }),
      blurredDataUrl: z.string().optional(),
    })
  ),
});

export const GalleriesSchemaWithImages = BasicGallerySchema.extend({
  galleries: z.array(GallerySchema),
});

export const GalleriesSchemaWithImagesInfinite = z.object({
  galleries: z.array(GallerySchema),
  nextCursor: z.number().nullable(),
  totalResults: z.number(),
});

export const GalleryFormDataSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  photoIds: z.array(z.number()).min(1),
});

export type Gallery = z.infer<typeof GallerySchema>;
export type GalleriesResults = z.infer<typeof GalleriesSchemaWithImages>;
export type GalleriesResultsInfinite = z.infer<
  typeof GalleriesSchemaWithImagesInfinite
>;
export type GalleryFormData = z.infer<typeof GalleryFormDataSchema>;
