import {
  findGalleriesByUserIdAndCursor,
  findGalleriesByUserIdAndPage,
  insertUserGallery,
  totalGalleriesByUserId,
} from "../db/galleries";
import { GalleryFormData } from "@/models/Gallery";

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

export const getUserGalleriesListWithPagination = async (
  page: number,
  per_page: number,
  userId: string
) => {
  const offset = (page - 1) * per_page;
  if (offset < 0) {
    throw new Error("Invalid page number.");
  }
  const galleries = await findGalleriesByUserIdAndPage(
    userId,
    offset,
    per_page
  );

  if (!galleries) {
    throw new Error("No galleries found.");
  }

  const totalResults = await totalGalleriesByUserId(userId);

  const formattedGalleries = galleries.map((gallery) => ({
    id: gallery.id,
    title: gallery.title,
    description: gallery.description || undefined,
    images: gallery.images.map((galleryImage) => ({
      id: galleryImage.image.id,
      url: galleryImage.image.url,
      width: galleryImage.image.metadata?.width ?? 0,
      height: galleryImage.image.metadata?.height ?? 0,
      alt: galleryImage.image.fileName,
      src: { large: galleryImage.image.url },
      blurredDataUrl: undefined,
      metadata: galleryImage.image.metadata
        ? {
            model: galleryImage.image.metadata.model || undefined,
            aperture: galleryImage.image.metadata.aperture || undefined,
            focalLength: galleryImage.image.metadata.focalLength || undefined,
            exposureTime: galleryImage.image.metadata.exposureTime || undefined,
            iso: galleryImage.image.metadata.iso || undefined,
            flash: galleryImage.image.metadata.flash || undefined,
            height: galleryImage.image.metadata.height || undefined,
            width: galleryImage.image.metadata.width || undefined,
          }
        : undefined,
    })),
    createdAt: gallery.createdAt.toISOString(),
    updatedAt: gallery.updatedAt.toISOString(),
  }));

  return {
    page,
    per_page,
    totalResults,
    prev_page:
      page > 1
        ? `/api/galleries?page=${page - 1}&per_page=${per_page}`
        : undefined,
    next_page:
      page * per_page < totalResults
        ? `/api/galleries?page=${page + 1}&per_page=${per_page}`
        : undefined,
    galleries: formattedGalleries,
  };
};

export const createUserGallery = async (
  userId: string,
  galleryData: GalleryFormData
) => {
  const gallery = await insertUserGallery(userId, galleryData);
  return {
    gallery,
    status: "success",
    message: "Gallery created successfully",
  };
};
