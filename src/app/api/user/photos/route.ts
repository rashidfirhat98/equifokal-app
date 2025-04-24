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

  if (!userId) {
    return NextResponse.json(
      { message: "Not authenticated or no user ID provided." },
      { status: 401 }
    );
  }

  const images = await prisma.image.findMany({
    where: {
      userId,
      // isPrivate: false, // future addition
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
  });
}
