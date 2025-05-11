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
import { getUserDetails } from "@/lib/services/user";
import { getFollowerList, getFollowingList } from "@/lib/services/follow";

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

export async function fetchCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    let currentUser = null;
    if (session?.user.id) {
      currentUser = await getUserDetails(session.user.id);
    }

    return currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User not found");
  }
}

export async function fetchUserSession() {
  try {
    const session = await getServerSession(authOptions);

    let currentUser = null;
    if (session?.user.id) {
      currentUser = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        profilePic: session.user.image,
      };
    }

    return currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User session not found");
  }
}

export const fetchUserImages = async (
  userId: string | null = null,
  limit: number = 10,
  cursor: number | null = null
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
  userId: string | null = null,
  limit: number = 10,
  cursor: number | null = null
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
  userId: string | null = null,
  limit: number = 3,
  cursor: number | null = null
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
  userId: string | null = null,
  limit: number = 10,
  cursor: number | null = null
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

export const fetchFollowersList = async (
  userId: string,
  limit: number = 10,
  cursor: string | null = null
) => {
  try {
    // const session = await getServerSession(authOptions);

    const userIdParam = userId;

    if (!userIdParam) {
      throw new Error("Not authenticated or no user ID provided.");
    }

    return await getFollowerList(userIdParam, limit, cursor);
  } catch (error) {
    console.error("Error fetching user followers list:", error);
    throw new Error("Failed to fetch user followers list.");
  }
};

export const fetchFollowingList = async (
  userId: string,
  limit: number = 10,
  cursor: string | null = null
) => {
  try {
    // const session = await getServerSession(authOptions);

    const userIdParam = userId;

    if (!userIdParam) {
      throw new Error("Not authenticated or no user ID provided.");
    }

    return await getFollowingList(userIdParam, limit, cursor);
  } catch (error) {
    console.error("Error fetching user followers list:", error);
    throw new Error("Failed to fetch user followers list.");
  }
};
