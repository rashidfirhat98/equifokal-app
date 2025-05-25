import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { photoIds } = await req.json();

  if (
    !Array.isArray(photoIds) ||
    photoIds.some((id) => typeof id !== "number")
  ) {
    return NextResponse.json({ error: "Invalid photoIds" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { profilePic: true },
  });

  const usedPhotos = await prisma.image.findMany({
    where: {
      id: { in: photoIds },
      OR: [
        { portfolio: true },
        { Article: { some: {} } },
        { galleries: { some: {} } },
        { url: user?.profilePic ?? "__NULL__" },
      ],
    },
    select: {
      id: true,
      portfolio: true,
      url: true,
      Article: { select: { id: true, title: true } },
      galleries: { select: { gallery: { select: { id: true, title: true } } } },
    },
  });

  return NextResponse.json({ usedPhotos });
}
