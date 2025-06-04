import { UploadImageResult } from "@/models/ImageUploadSchema";
import {
  findArticleById,
  findArticlesByUserIdAndCursor,
  insertArticleGalleryByGalleryIds,
  insertUserArticle,
  totalArticlesByUserId,
} from "../db/articles";
import convertToCDNUrl from "../utils/convertToCDNUrl";
import { findIsFollowingByFollowId, isFollowingRelations } from "../db/follow";

type CreateArticleInput = {
  title: string;
  content: string;
  description: string;
  galleryIds: number[];
  uploadResult: UploadImageResult;
  userId: string;
};

export const getArticlePostDetails = async (
  articleId: number,
  viewingUserId?: string
) => {
  const article = await findArticleById(articleId);

  if (!article) {
    throw new Error("Article not found.");
  }

  let isFollowing;

  if (viewingUserId) {
    isFollowing = await findIsFollowingByFollowId({
      followerId: viewingUserId,
      followingId: article.user.id,
    });
  }

  return {
    article: {
      id: article.id,
      title: article.title,
      content: article.content,
      description: article.description,
      createdAt: new Date(article.createdAt).toLocaleString(),
      updatedAt: new Date(article.updatedAt).toLocaleString(),
      user: {
        ...article.user,
        isFollowing: viewingUserId ? isFollowing : undefined,
      },
      coverImage: article.coverImage
        ? {
            id: article.coverImage.id,
            width: article.coverImage.width || 0,
            height: article.coverImage.height || 0,
            url: convertToCDNUrl(article.coverImage.url),
            src: { large: convertToCDNUrl(article.coverImage.url) },
            alt: article.coverImage.fileName,
            blurredDataUrl: article.coverImage.blurDataUrl || undefined,
            // metadata: article.coverImage.metadata
            //   ? {
            //       model: article.coverImage.metadata.model || undefined,
            //       aperture:
            //         article.coverImage.metadata.aperture || undefined,
            //       focalLength:
            //         article.coverImage.metadata.focalLength || undefined,
            //       exposureTime:
            //         article.coverImage.metadata.exposureTime || undefined,
            //       iso: article.coverImage.metadata.iso || undefined,
            //       flash: article.coverImage.metadata.flash || undefined,
            //     }
            //   : undefined,
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
    },
  };
};

export const getArticlesList = async (
  limit: number,
  cursor: number | null = null,
  userId: string,
  viewingUserId?: string
) => {
  if (!userId) {
    throw new Error("Not authenticated or no user ID provided.");
  }

  const articles = await findArticlesByUserIdAndCursor(userId, cursor, limit);

  if (!articles) {
    throw new Error("No articles found.");
  }

  let followingMap: Record<string, boolean> = {};
  if (viewingUserId) {
    const authorIds = [...new Set(articles.map((a) => a.user.id))];

    const followings = await isFollowingRelations(authorIds, viewingUserId);

    followingMap = Object.fromEntries(
      followings.map((f) => [f.followingId, true])
    );
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
      user: {
        ...article.user,
        isFollowing: viewingUserId
          ? followingMap[article.user.id] ?? false
          : undefined,
      },
      createdAt: new Date(article.createdAt).toLocaleString(),
      updatedAt: new Date(article.updatedAt).toLocaleString(),
      coverImage: article.coverImage
        ? {
            id: article.coverImage.id,
            width: article.coverImage.width || 0,
            height: article.coverImage.height || 0,
            url: convertToCDNUrl(article.coverImage.url),
            src: { large: convertToCDNUrl(article.coverImage.url) },
            alt: article.coverImage.fileName,
            blurredDataUrl: article.coverImage.blurDataUrl || undefined,
            //     metadata: article.coverImage.metadata
            //       ? {
            //           model: article.coverImage.metadata.model || undefined,
            //           aperture: article.coverImage.metadata.aperture || undefined,
            //           focalLength:
            //             article.coverImage.metadata.focalLength || undefined,
            //           exposureTime:
            //             article.coverImage.metadata.exposureTime || undefined,
            //           iso: article.coverImage.metadata.iso || undefined,
            //           flash: article.coverImage.metadata.flash || undefined,
            //         }
            //       : undefined,
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

  return count;
};

export const updateUserArticle = async ({
  articleId,
  userId,
  title,
  content,
  description,
  uploadResult,
}: {
  articleId: number;
  userId: string;
  title: string;
  content: string;
  description: string;
  uploadResult: any;
}) => {
  const existing = await prisma.article.findFirst({
    where: { id: articleId, userId },
  });

  if (!existing) {
    throw new Error("Article not found or unauthorized");
  }

  let coverImageId = existing.coverImageId || null;

  if (uploadResult?.status === "success" && uploadResult.images?.length) {
    coverImageId = uploadResult.images[0].id;
  }

  const updated = await prisma.article.update({
    where: { id: articleId },
    data: {
      title,
      content,
      description,
      coverImage: coverImageId ? { connect: { id: coverImageId } } : undefined,
    },
  });

  return updated;
};

export const updateArticleGalleries = async ({
  articleId,
  galleryIds,
}: {
  articleId: number;
  galleryIds: number[];
}) => {
  // Clear existing mappings
  await prisma.articleGallery.deleteMany({
    where: { articleId },
  });

  // Insert new ones
  return await prisma.articleGallery.createMany({
    data: galleryIds.map((galleryId) => ({
      articleId,
      galleryId,
    })),
    skipDuplicates: true,
  });
};
