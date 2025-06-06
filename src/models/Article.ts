import { z } from "zod";
import { PhotoSchema } from "./Images";
import { GallerySchema } from "./Gallery";

const BasicArticleSchema = z.object({
  page: z.number(),
  per_page: z.number(),
  prev_page: z.string().optional(),
  next_page: z.string().optional(),
  total_results: z.number(),
});

export const ArticleSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  description: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    profilePic: z.string().nullable(),
    isFollowing: z.boolean().optional(),
  }),
  coverImage: z
    .object({
      id: z.number(),
      width: z.number(),
      height: z.number(),
      url: z.string(),
      src: z.object({
        large: z.string(),
      }),
      alt: z.string(),
      blurredDataUrl: z.string().optional(),
    })
    .optional(),
  galleries: z.array(GallerySchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ArticleSchemaResults = BasicArticleSchema.extend({
  articles: z.array(ArticleSchema),
});

export const ArticleSchemaResultsInfinite = z.object({
  articles: z.array(ArticleSchema),
  nextCursor: z.number().nullable(),
});

export type Article = z.infer<typeof ArticleSchema>;
export type ArticlesResults = z.infer<typeof ArticleSchemaResults>;
export type ArticlesResultsInfinite = z.infer<
  typeof ArticleSchemaResultsInfinite
>;
