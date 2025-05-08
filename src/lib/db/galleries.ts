import prisma from "@/lib/prisma";
import { GalleryFormData } from "@/models/Gallery";

export const totalGalleriesByUserId = async (userId: string) => {
  return await prisma.gallery.count({
    where: { userId },
  });
};

export const findGalleriesByUserIdAndCursor = async (
  userId: string,
  limit: number,
  cursor: number | null
) => {
  return prisma.gallery.findMany({
    where: {
      userId: userId,
    },
    include: {
      images: {
        include: {
          image: {
            select: {
              id: true,
              url: true,
              fileName: true,
              width: true,
              height: true,
              blurDataUrl: true,
            },
          },
        },
      },
    },
    orderBy: { id: "desc" },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });
};

export const findGalleriesByUserIdAndPage = async (
  userId: string,
  offset: number,
  perPage: number
) => {
  return await prisma.gallery.findMany({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        include: {
          image: {
            select: {
              id: true,
              url: true,
              fileName: true,
              width: true,
              height: true,
              blurDataUrl: true,
            },
          },
        },
      },
    },
    skip: offset,
    take: perPage,
  });
};

export const findGalleryWithImageMetadataById = async (id: number) => {
  return prisma.gallery.findUnique({
    where: { id },
    include: {
      images: {
        include: {
          image: {
            include: {
              metadata: true,
              user: true,
            },
          },
        },
      },
    },
  });
};

export const insertUserGallery = async (
  userId: string,
  galleryData: GalleryFormData
) => {
  const { title, description, photoIds } = galleryData;

  await prisma.gallery.create({
    data: {
      title,
      description,
      user: {
        connect: { id: userId },
      },
      images: {
        create: photoIds.map((imageId) => ({
          image: { connect: { id: imageId } },
        })),
      },
    },
  });
};
