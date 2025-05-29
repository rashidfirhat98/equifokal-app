import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }
  const { id } = await params;

  const photoId = parseInt(id);

  if (isNaN(photoId)) {
    return NextResponse.json({ error: "Invalid photo id" }, { status: 400 });
  }
  const { fileName, isPortfolio, isProfilePic } = await req.json();

  if (!id || typeof fileName !== "string") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const [photo, user] = await Promise.all([
    prisma.image.findUnique({ where: { id: photoId } }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { profilePic: true },
    }),
  ]);

  if (!photo || !user) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  const isChangingProfilePic = isProfilePic && user?.profilePic !== photo.url;

  const updatedImage = await prisma.image.update({
    where: { id: photoId },
    data: {
      fileName,
      portfolio: isPortfolio,
      profilePic: isProfilePic,
    },
  });

  let changedProfilePic = false;

  if (isChangingProfilePic) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { profilePic: updatedImage.url },
    });
    changedProfilePic = true;
  }

  return NextResponse.json({ updatedImage, changedProfilePic });
}
