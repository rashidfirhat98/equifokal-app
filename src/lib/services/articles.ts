import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";
import { findArticleById } from "../db/articles";

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
