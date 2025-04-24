import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import addBlurredDataUrls from "@/lib/getBase64";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const userIdParam = searchParams.get("userId");

  const userId = userIdParam ?? session?.user.id;

  if (!userId || !session)
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
      userId,
    },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: parseInt(cursor) },
      skip: 1,
    }),
  });

  const hasNextPage = galleries.length > limit;
  const trimmed = hasNextPage ? galleries.slice(0, -1) : galleries;

  const formattedGalleries = trimmed.map((gallery: any) => ({
    id: gallery.id,
    title: gallery.title,
    description: gallery.description || undefined,
    createdAt: gallery.createdAt.toISOString(),
    updatedAt: gallery.updatedAt.toISOString(),
    images: gallery.images.map((gi: any) => ({
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
