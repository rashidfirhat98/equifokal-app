"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ImagesResults } from "@/models/Images";
import * as z from "zod";

import {
  getUserImagesWithPagination,
  getUserPortfolioImages,
} from "@/lib/services/images";
import {
  getUserGalleriesList,
  getUserGalleriesListWithPagination,
} from "@/lib/services/galleries";
import { getArticlesList } from "@/lib/services/articles";
import { getUserById } from "@/lib/db/user";

const gallerySchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  photoIds: z.array(z.number()).min(1),
});

export async function getUserImages(
  page: number = 1,
  per_page: number = 10
): Promise<ImagesResults | undefined> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { photos: [], page, per_page, total_results: 0 };
  }

  const total_results = await prisma.image.count({
    where: { userId: session.user.id },
  });

  const images = await prisma.image.findMany({
    where: { userId: session.user.id },
    include: { metadata: true },
    orderBy: { createdAt: "desc" },
    take: per_page,
    skip: (page - 1) * per_page,
  });

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
}

export async function createGallery(data: z.infer<typeof gallerySchema>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { status: "error", message: "User not found" };
  }

  const validatedData = gallerySchema.parse(data);
  try {
    const gallery = await prisma.gallery.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        user: {
          connect: { id: session.user.id },
        },
        images: {
          create: validatedData.photoIds.map((imageId) => ({
            image: { connect: { id: imageId } },
          })),
        },
      },
    });
    return {
      gallery,
      status: "success",
      message: "Gallery created successfully",
    };
  } catch (error) {
    throw new Error("Failed to create gallery");
  }
}

// export async function getUserGalleries({
//   page = 1,
//   per_page = 10,
// }: {
//   page?: number;
//   per_page?: number;
// }): Promise<z.infer<typeof GalleriesSchemaWithImages>> {
//   const offset = (page - 1) * per_page;
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return { galleries: [], page, per_page, total_results: 0 };
//   }

//   // Fetch total gallery count for pagination
//   const total_results = await prisma.gallery.count();

//   // Fetch galleries with pagination
//   const galleries = await prisma.gallery.findMany({
//     skip: offset,
//     take: per_page,
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "desc" },
//     include: {
//       images: {
//         include: {
//           image: {
//             include: {
//               metadata: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   // Transform the data to match the Zod schema
//   const formattedGalleries = galleries.map((gallery) => ({
//     id: gallery.id,
//     title: gallery.title,
//     description: gallery.description || undefined,
//     images: gallery.images.map((galleryImage) => ({
//       id: galleryImage.image.id,
//       url: galleryImage.image.url,
//       width: galleryImage.image.metadata?.width ?? 0,
//       height: galleryImage.image.metadata?.height ?? 0,
//       alt: galleryImage.image.fileName,
//       src: { large: galleryImage.image.url },
//       blurredDataUrl: undefined,
//       metadata: galleryImage.image.metadata
//         ? {
//             model: galleryImage.image.metadata.model || undefined,
//             aperture: galleryImage.image.metadata.aperture || undefined,
//             focalLength: galleryImage.image.metadata.focalLength || undefined,
//             exposureTime: galleryImage.image.metadata.exposureTime || undefined,
//             iso: galleryImage.image.metadata.iso || undefined,
//             flash: galleryImage.image.metadata.flash || undefined,
//             height: galleryImage.image.metadata.height || undefined,
//             width: galleryImage.image.metadata.width || undefined,
//           }
//         : undefined,
//     })),
//     createdAt: gallery.createdAt.toISOString(),
//     updatedAt: gallery.updatedAt.toISOString(),
//   }));

//   return {
//     page,
//     per_page,
//     total_results,
//     prev_page:
//       page > 1
//         ? `/api/galleries?page=${page - 1}&per_page=${per_page}`
//         : undefined,
//     next_page:
//       page * per_page < total_results
//         ? `/api/galleries?page=${page + 1}&per_page=${per_page}`
//         : undefined,
//     galleries: formattedGalleries,
//   };
// }

// export async function getUserGalleries(
//   limit: number = 10,
//   cursor: string | null = null,
//   userId: string | null = null
// ) {
//   const session = await getServerSession(authOptions);

//   const userIdParam = userId ?? session?.user.id;

//   if (!userIdParam || !session)
//     return NextResponse.json(
//       { message: "Not authenticated or no user ID provided." },
//       { status: 401 }
//     );

//   const totalResults = await prisma.gallery.count({
//     where: { userId: session.user.id },
//   });

//   const galleries = await prisma.gallery.findMany({
//     orderBy: { createdAt: "desc" },
//     include: {
//       images: {
//         include: {
//           image: true,
//         },
//       },
//     },
//     where: {
//       userId: userIdParam,
//     },
//     take: limit + 1,
//     ...(cursor && {
//       cursor: { id: parseInt(cursor) },
//       skip: 1,
//     }),
//   });

//   const hasNextPage = galleries.length > limit;
//   const trimmed = hasNextPage ? galleries.slice(0, -1) : galleries;

//   const formattedGalleries = trimmed.map((gallery) => ({
//     id: gallery.id,
//     title: gallery.title,
//     description: gallery.description || undefined,
//     createdAt: gallery.createdAt.toISOString(),
//     updatedAt: gallery.updatedAt.toISOString(),
//     images: gallery.images.map((gi) => ({
//       id: gi.image.id,
//       url: gi.image.url,
//       alt: gi.image.fileName,
//       width: 0,
//       height: 0,
//       src: { large: gi.image.url },
//       blurredDataUrl: undefined,
//     })),
//   }));

//   return NextResponse.json({
//     galleries: formattedGalleries,
//     nextCursor: hasNextPage ? trimmed[trimmed.length - 1].id : null,
//     totalResults,
//   });
// }

export async function fetchCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    let currentUser = null;
    if (session?.user.id) {
      currentUser = await getUserById(session.user.id);
    }
    return currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User not found");
  }
}

export const fetchUserImages = async (
  limit: number = 10,
  cursor: number | null = null,
  userId: string | null = null
) => {
  try {
    const session = await getServerSession(authOptions);

    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam) {
      throw new Error("Not authenticated or no user ID provided.");
    }

    return await getUserPortfolioImages(userIdParam, limit, cursor);
  } catch (error) {
    console.error("Error fetching portfolio images:", error);
    throw new Error("Portfolio images not found");
  }
};

export const fetchUserPortfolioImages = async (
  limit: number = 10,
  cursor: number | null = null,
  userId: string | null = null
) => {
  try {
    const session = await getServerSession(authOptions);

    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam) {
      throw new Error("Not authenticated or no user ID provided.");
    }

    return await getUserPortfolioImages(userIdParam, limit, cursor);
  } catch (error) {
    console.error("Error fetching portfolio images:", error);
    throw new Error("Portfolio images not found");
  }
};

export async function fetchUserImagesWithPage(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      throw new Error("Not authenticated");
    }

    return await getUserImagesWithPagination(page, per_page, session.user.id);
  } catch (error) {
    console.error("Error fetching user images:", error);
    throw new Error("User images not found");
  }
}

export async function fetchUserGalleriesList(
  limit: number = 3,
  cursor: number | null = null,
  userId: string | null = null
) {
  try {
    const session = await getServerSession(authOptions);

    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam || !session?.user.id)
      throw new Error("Not authenticated or no user ID provided.");

    return await getUserGalleriesList(limit, cursor, userIdParam);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    throw new Error("Galleries not found");
  }
}

export async function fetchUserGalleriesListWithPagination(
  page: number = 1,
  per_page: number = 10,
  userId: string | null = null
) {
  try {
    const session = await getServerSession(authOptions);

    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam || !session?.user.id)
      throw new Error("Not authenticated or no user ID provided.");

    return await getUserGalleriesListWithPagination(
      page,
      per_page,
      userIdParam
    );
  } catch (error) {
    console.error("Error fetching galleries:", error);
    throw new Error("Galleries not found");
  }
}

export const fetchUserArticleList = async (
  limit: number = 10,
  cursor: number | null = null,
  userId: string | null = null
) => {
  try {
    const session = await getServerSession(authOptions);
    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam || !session?.user.id)
      throw new Error("Not authenticated or no user ID provided.");

    if (!session.user.id) {
      throw new Error("Unauthorized");
    }

    return await getArticlesList(limit, cursor, userIdParam);
  } catch (error) {
    console.error("Error fetching user article list:", error);
    throw new Error("Failed to fetch user article list.");
  }
};
