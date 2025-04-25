import prisma from "@/lib/prisma";
import * as z from "zod";
import { GalleriesSchemaWithImagesInfinite } from "@/models/Gallery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function getUserGalleries(
  limit: number = 10,
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

  const totalResults = await prisma.gallery.count({
    where: { userId: session.user.id },
  });

  const galleries = await prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        include: {
          image: true,
        },
      },
    },
    where: {
      userId: userIdParam,
    },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: parseInt(cursor) },
      skip: 1,
    }),
  });

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

  return NextResponse.json({
    galleries: formattedGalleries,
    nextCursor: hasNextPage ? trimmed[trimmed.length - 1].id : null,
    totalResults,
  });
}
