import { Photo } from "@/models/Images";
import {
  findUserImages,
  findUserImagesWithPage,
  findUserPortfolioImages,
  totalImagesByUserId,
} from "../db/images";
import addBlurredDataUrls from "../getBase64";

export const getUserPortfolioImages = async (
  userId: string,
  limit: number,
  cursor: number | null
) => {
  const images = await findUserPortfolioImages(userId, limit, cursor);
  if (!images) {
    throw new Error("No images found");
  }

  const hasNextPage = images.length > limit;
  const trimmedImages = hasNextPage ? images.slice(0, -1) : images;
  const nextCursor = hasNextPage
    ? trimmedImages[trimmedImages.length - 1].id
    : null;

  const photosWithBlur: Photo[] = await addBlurredDataUrls(
    trimmedImages.map((image) => ({
      id: image.id,
      url: `/photo/${image.id}`,
      height: image.metadata?.height || 1000,
      width: image.metadata?.width || 1000,
      alt: image.fileName,
      src: {
        large: image.url,
      },
    }))
  );

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
        large: image.url, // Adjust based on your storage
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

  const images = await findUserImages(userId, limit, cursor);

  if (!images) {
    throw new Error("No images found");
  }

  const hasNextPage = images.length > limit;
  const trimmedImages = hasNextPage ? images.slice(0, -1) : images;
  const nextCursor = hasNextPage
    ? trimmedImages[trimmedImages.length - 1].id
    : null;

  const photosWithBlur: Photo[] = await addBlurredDataUrls(
    trimmedImages.map((image) => ({
      id: image.id,
      url: `/photo/${image.id}`,
      height: image.metadata?.height || 1000,
      width: image.metadata?.width || 1000,
      alt: image.fileName,
      src: {
        large: image.url,
      },
    }))
  );

  return {
    photos: photosWithBlur,
    nextCursor,
    totalResults,
  };
};
