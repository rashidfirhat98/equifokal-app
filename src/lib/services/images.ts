import { Photo } from "@/models/Images";
import {
  findImageById,
  findUserImages,
  findUserImagesWithPage,
  findUserPortfolioImages,
  totalImagesByUserId,
} from "../db/images";
import addBlurredDataUrls from "../utils/getBase64";
import convertToCDNUrl from "../utils/convertToCDNUrl";

export const getUserPortfolioImages = async (
  userId: string,
  limit: number,
  cursor: number | null
): Promise<{ photos: Photo[]; nextCursor: number | null }> => {
  const images = await findUserPortfolioImages({ userId, limit, cursor });
  if (!images) {
    throw new Error("No images found");
  }

  const hasNextPage = images.length > limit;
  const trimmedImages = hasNextPage ? images.slice(0, -1) : images;
  const nextCursor = hasNextPage
    ? trimmedImages[trimmedImages.length - 1].id
    : null;

  const blurStart = performance.now();
  const photosWithBlur: Photo[] = await Promise.all(
    trimmedImages.map((image) => ({
      id: image.id,
      url: `/photo/${image.id}`,
      height: image.metadata?.height || 1000,
      width: image.metadata?.width || 1000,
      alt: image.fileName,
      src: {
        large: convertToCDNUrl(image.url),
      },
      blurredDataUrl: image.blurDataUrl || undefined,
    }))
  );

  const blurEnd = performance.now();
  console.log(`Blurred data URLs generated in ${blurEnd - blurStart}ms`);

  return {
    photos: photosWithBlur,
    nextCursor,
  };
};

export const getUserImagesWithPagination = async (
  page: number,
  per_page: number,
  userId: string
) => {
  const total_results = await totalImagesByUserId(userId);

  if (!total_results) {
    throw new Error("No images found");
  }

  const offset = (page - 1) * per_page;
  if (offset < 0) {
    throw new Error("Invalid page number.");
  }

  const images = await findUserImagesWithPage(userId, offset, per_page);

  return {
    page,
    per_page,
    total_results,
    photos: images.map((image) => ({
      id: image.id,
      url: `/photo/${image.id}`,
      height: image.metadata?.height || 2000,
      width: image.metadata?.width || 2000,
      alt: image.fileName,
      src: {
        large: convertToCDNUrl(image.url),
      },
    })),
    prev_page:
      page > 1
        ? `/api/images?page=${page - 1}&per_page=${per_page}`
        : undefined,
    next_page:
      page * per_page < total_results
        ? `/api/images?page=${page + 1}&per_page=${per_page}`
        : undefined,
  };
};

export const getUserImages = async (
  userId: string,
  limit: number,
  cursor: number | null
) => {
  const totalResults = await totalImagesByUserId(userId);

  const images = await findUserImages({ userId, limit, cursor });

  if (!images) {
    throw new Error("No images found");
  }

  const hasNextPage = images.length > limit;
  const trimmedImages = hasNextPage ? images.slice(0, -1) : images;
  const nextCursor = hasNextPage
    ? trimmedImages[trimmedImages.length - 1].id
    : null;

  const photosWithBlur = await addBlurredDataUrls(
    trimmedImages.map((image) => ({
      id: image.id,
      url: `/photo/${image.id}`,
      height: image.metadata?.height || 1000,
      width: image.metadata?.width || 1000,
      alt: image.fileName,
      src: {
        large: convertToCDNUrl(image.url),
      },
    }))
  );

  return {
    photos: photosWithBlur,
    nextCursor,
    totalResults,
  };
};

export const getImageWithMetadataById = async (id: number) => {
  const photo = await findImageById(id);

  if (!photo) {
    throw new Error("Photo not found");
  }

  return {
    id: photo.id,
    url: convertToCDNUrl(photo.url),
    height: photo.metadata?.height || 1000,
    width: photo.metadata?.width || 1000,
    alt: photo.fileName || "Uploaded Image",
    src: { large: convertToCDNUrl(photo.url) },
    photographer: photo.user.name || "Photographer",
    photographer_url: `/user/${photo.userId}`,
    photographer_id: photo.userId,
    metadata: photo.metadata
      ? {
          model: photo.metadata?.model,
          aperture: photo.metadata?.aperture,
          focalLength: photo.metadata?.focalLength,
          exposureTime: photo.metadata?.exposureTime,
          iso: photo.metadata?.iso,
          flash: photo.metadata?.flash,
          height: photo.metadata?.height,
          width: photo.metadata?.width,
        }
      : undefined,
    createdAt: photo.createdAt.toISOString(),
    // updatedAt: photo.updatedAt.toISOString(),
  };
};

export const getUserPhotoCount = async (userId: string) => {
  const count = await totalImagesByUserId(userId);

  return count;
};
