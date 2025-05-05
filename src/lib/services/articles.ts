import { UploadImageResult } from "@/models/ImageUploadSchema";
import {
  findArticleById,
  findArticlesByUserIdAndCursor,
  insertArticleGalleryByGalleryIds,
  insertUserArticle,
  totalArticlesByUserId,
} from "../db/articles";

type CreateArticleInput = {
  title: string;
  content: string;
  description: string;
  galleryIds: number[];
  uploadResult: UploadImageResult;
  userId: string;
};

export const getArticlePostDetails = async (articleId: number) => {
  const articleById = await findArticleById(articleId);

  if (!articleById) {
    throw new Error("Article not found.");
  }

  return {
    article: {
      id: articleById.id,
      title: articleById.title,
      content: articleById.content,
      description: articleById.description,
      createdBy: articleById.user.name,
      profilePic: articleById.user.profilePic,
      createdAt: new Date(articleById.createdAt).toLocaleString(),
      updatedAt: new Date(articleById.updatedAt).toLocaleString(),
      coverImage: articleById.coverImage
        ? {
            id: articleById.coverImage.id,
            width: articleById.coverImage.metadata?.width || 0,
            height: articleById.coverImage.metadata?.height || 0,
            url: articleById.coverImage.url,
            src: { large: articleById.coverImage.url },
            alt: articleById.coverImage.fileName,
            metadata: articleById.coverImage.metadata
              ? {
                  model: articleById.coverImage.metadata.model || undefined,
                  aperture:
                    articleById.coverImage.metadata.aperture || undefined,
                  focalLength:
                    articleById.coverImage.metadata.focalLength || undefined,
                  exposureTime:
                    articleById.coverImage.metadata.exposureTime || undefined,
                  iso: articleById.coverImage.metadata.iso || undefined,
                  flash: articleById.coverImage.metadata.flash || undefined,
                }
              : undefined,
          }
        : undefined,
      // galleries: articleById.galleries?.map(({ gallery }) => ({
      //   id: gallery.id,
      //   title: gallery.title,
      //   createdAt: gallery.createdAt.toISOString(),
      //   updatedAt: gallery.updatedAt.toISOString(),
      //   images: gallery.images?.map(({ image }) => ({
      //     id: image.id,
      //     width: image.metadata?.width || 0,
      //     height: image.metadata?.height || 0,
      //     url: image.url,
      //     src: { large: image.url },
      //     alt: image.fileName,
      //     // metadata: image.metadata ? {
      //     //   model: image.metadata.model || undefined,
      //     //   aperture: image.metadata.aperture || undefined,
      //     //   focalLength: image.metadata.focalLength || undefined,
      //     //   exposureTime: image.metadata.exposureTime || undefined,
      //     //   iso: image.metadata.iso || undefined,
      //     //   flash: image.metadata.flash || undefined
      //     // } : undefined
      //   })) || []
      // })) || []
    },
  };
};

export const getArticlesList = async (
  limit: number,
  cursor: number | null = null,
  userId: string
) => {
  if (!userId) {
    throw new Error("Not authenticated or no user ID provided.");
  }

  const articles = await findArticlesByUserIdAndCursor(userId, cursor, limit);

  if (!articles) {
    throw new Error("No articles found.");
  }

  const hasNextPage = articles.length > limit;
  const trimmedArticles = hasNextPage ? articles.slice(0, -1) : articles;
  const nextCursor = hasNextPage
    ? trimmedArticles[trimmedArticles.length - 1].id
    : null;

  return {
    articles: trimmedArticles.map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      description: article.description,
      createdBy: article.user.name,
      profilePic: article.user.profilePic,
      createdAt: new Date(article.createdAt).toLocaleString(),
      updatedAt: new Date(article.updatedAt).toLocaleString(),
      coverImage: article.coverImage
        ? {
            id: article.coverImage.id,
            width: article.coverImage.metadata?.width || 0,
            height: article.coverImage.metadata?.height || 0,
            url: article.coverImage.url,
            src: { large: article.coverImage.url },
            alt: article.coverImage.fileName,
            metadata: article.coverImage.metadata
              ? {
                  model: article.coverImage.metadata.model || undefined,
                  aperture: article.coverImage.metadata.aperture || undefined,
                  focalLength:
                    article.coverImage.metadata.focalLength || undefined,
                  exposureTime:
                    article.coverImage.metadata.exposureTime || undefined,
                  iso: article.coverImage.metadata.iso || undefined,
                  flash: article.coverImage.metadata.flash || undefined,
                }
              : undefined,
          }
        : undefined,
      // galleries: article.galleries?.map(({ gallery }) => ({
      //   id: gallery.id,
      //   title: gallery.title,
      //   createdAt: gallery.createdAt.toISOString(),
      //   updatedAt: gallery.updatedAt.toISOString(),
      //   images: gallery.images?.map(({ image }) => ({
      //     id: image.id,
      //     width: image.metadata?.width || 0,
      //     height: image.metadata?.height || 0,
      //     url: image.url,
      //     src: { large: image.url },
      //     alt: image.fileName,
      //     // metadata: image.metadata ? {
      //     //   model: image.metadata.model || undefined,
      //     //   aperture: image.metadata.aperture || undefined,
      //     //   focalLength: image.metadata.focalLength || undefined,
      //     //   exposureTime: image.metadata.exposureTime || undefined,
      //     //   iso: image.metadata.iso || undefined,
      //     //   flash: image.metadata.flash || undefined
      //     // } : undefined
      //   })) || []
      // })) || []
    })),
    nextCursor,
  };
};

export const createArticle = async ({
  userId,
  title,
  content,
  description,
  galleryIds,
  uploadResult,
}: CreateArticleInput) => {
  let coverImageId: number | undefined = undefined;

  if (uploadResult.status === "success" && uploadResult.images?.length) {
    coverImageId = uploadResult.images[0].id;
  }

  const article = await insertUserArticle({
    title,
    content,
    description,
    userId,
    coverImageId,
  });

  if (galleryIds.length > 0) {
    await insertArticleGalleryByGalleryIds({
      articleId: article.id,
      galleryIds,
    });
  }

  return { article };
};

export const getUserArticleCount = async (userId: string) => {
  const count = await totalArticlesByUserId(userId);

  if (!count) {
    throw new Error("Article count not found");
  }
  return count;
};
