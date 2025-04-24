"use server";

import { authOptions } from "@/lib/authOptions";
import addBlurredDataUrls from "@/lib/getBase64";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function getUserImages(
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
    trimmedImages.map((image: any) => ({
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
