"use server";

import { authOptions } from "@/lib/authOptions";
import addBlurredDataUrls from "@/lib/getBase64";
import { getUserById } from "@/lib/getUserById";
import prisma from "@/lib/prisma";
import {
  getUserImages,
  getUserImagesWithPagination,
  getUserPortfolioImages,
} from "@/lib/services/images";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function getUserblaImages(
  limit: number = 1,
  cursor: string | null = null,
  userId: string | null = null
) {
  const session = await getServerSession(authOptions);

  const userIdParam = userId ?? session?.user.id;

  if (!userIdParam || !session)
    return NextResponse.json(
      { message: "Not authenticated or no user ID provided." },
      { status: 401 }
    );

  const totalResults = await prisma.image.count({
    where: { userId: session.user.id },
  });

  const images = await prisma.image.findMany({
    where: {
      userId: userIdParam,
    },
    include: { metadata: true },
    orderBy: [{ createdAt: "desc" }],
    take: limit + 1,
    ...(cursor && {
      cursor: { id: parseInt(cursor) },
      skip: 1,
    }),
  });

  const hasNextPage = images.length > limit;
  const trimmedImages = hasNextPage ? images.slice(0, -1) : images;
  const nextCursor = hasNextPage
    ? trimmedImages[trimmedImages.length - 1].id
    : null;

  const photosWithBlur = await addBlurredDataUrls(
    trimmedImages.map((image) => ({
      id: image.id,
      url: `/photo/${image.id}`,
      height: image.metadata?.height || 2000,
      width: image.metadata?.width || 2000,
      alt: image.fileName,
      src: {
        large: image.url,
      },
    }))
  );

  return NextResponse.json({
    photos: photosWithBlur,
    nextCursor,
    totalResults,
  });
}

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

    return await getUserImages(userIdParam, limit, cursor);
  } catch (error) {
    console.error("Error fetching user images:", error);
    throw new Error("User images not found");
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
