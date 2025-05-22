import { InsertUserImage } from "@/models/ImageUploadSchema";
import prisma from "../prisma";

type FindImagesByUserIdCursor = {
  userId: string;
  limit: number;
  cursor: number | null;
};

export const findUserPortfolioImages = async ({
  userId,
  limit,
  cursor,
}: FindImagesByUserIdCursor) => {
  return await prisma.image.findMany({
    where: {
      userId,
      portfolio: true,
      // isPrivate: false, // future addition
    },
    select: {
      id: true,
      url: true,
      blurDataUrl: true,
      fileName: true,
      createdAt: true,
      metadata: {
        select: {
          width: true,
          height: true,
        },
      },
    },
    orderBy: { id: "desc" },
    take: limit + 1,
    ...(cursor && {
      cursor: cursor ? { id: cursor } : undefined,
      skip: 1,
    }),
  });
};

export const findUserImages = async ({
  userId,
  limit,
  cursor,
}: FindImagesByUserIdCursor) => {
  return prisma.image.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      url: true,
      blurDataUrl: true,
      fileName: true,
      createdAt: true,
      portfolio: true,
      metadata: {
        select: {
          width: true,
          height: true,
        },
      },
    },
    orderBy: [{ id: "desc" }],
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });
};

export const findUserImagesWithPage = async (
  userId: string,
  offset: number,
  perPage: number
) => {
  return await prisma.image.findMany({
    skip: offset,
    take: perPage,
    where: { userId: userId },
    select: {
      id: true,
      url: true,
      blurDataUrl: true,
      fileName: true,
      createdAt: true,
      metadata: {
        select: {
          width: true,
          height: true,
        },
      },
    },
    orderBy: [{ id: "desc" }],
  });
};

export const findImageById = async (id: number) => {
  return await prisma.image.findUnique({
    where: { id },
    include: {
      metadata: true,
      user: true,
    },
  });
};

export const totalImagesByUserId = async (userId: string) => {
  return await prisma.image.count({
    where: { userId },
  });
};

export const insertUserImage = async ({
  userId,
  url,
  fileName,
  isPortfolio,
  isProfilePic,
  blurDataUrl,
  metadata,
}: InsertUserImage) => {
  return await prisma.image.create({
    data: {
      userId,
      url,
      fileName,
      blurDataUrl,
      width: metadata?.width,
      height: metadata?.height,
      ...(isPortfolio ? { portfolio: true } : {}),
      ...(isProfilePic ? { profilePic: true } : {}),
      metadata: metadata
        ? {
            create: {
              model: metadata.model,
              aperture: metadata.aperture,
              focalLength: metadata.focalLength,
              exposureTime: metadata.exposureTime,
              iso: metadata.iso,
              flash: metadata.flash,
              width: metadata.width,
              height: metadata.height,
            },
          }
        : undefined,
    },
    select: {
      id: true,
      url: true,
      fileName: true,
    },
  });
};
