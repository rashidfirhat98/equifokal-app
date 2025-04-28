import {
  findGalleriesByUserIdAndCursor,
  totalGalleriesByUserId,
} from "../db/galleries";

export const getUserGalleriesList = async (
  limit: number,
  cursor: number | null,
  userId: string
) => {
  const totalResults = await totalGalleriesByUserId(userId);

  const galleries = await findGalleriesByUserIdAndCursor(userId, limit, cursor);

  if (!galleries) {
    throw new Error("No galleries found.");
  }

  const hasNextPage = galleries.length > limit;
  const trimmed = hasNextPage ? galleries.slice(0, -1) : galleries;

  const formattedGalleries = trimmed.map((gallery) => ({
    id: gallery.id,
    title: gallery.title,
    description: gallery.description || undefined,
    createdAt: gallery.createdAt.toISOString(),
    updatedAt: gallery.updatedAt.toISOString(),
    images: gallery.images.map((gi) => ({
      id: gi.image.id,
      url: gi.image.url,
      alt: gi.image.fileName,
      width: 0,
      height: 0,
      src: { large: gi.image.url },
      blurredDataUrl: undefined,
    })),
  }));

  return {
    galleries: formattedGalleries,
    nextCursor: hasNextPage ? trimmed[trimmed.length - 1].id : null,
    totalResults,
  };
};
