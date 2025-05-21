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

  const updated = await prisma.image.update({
    where: { id: photoId },
    data: {
      fileName,
      portfolio: isPortfolio,
      profilePic: isProfilePic,
    },
  });

  const userUpdated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      profilePic: updated.url,
    },
  });

  return NextResponse.json({ updatedImage: updated, user: userUpdated });
}
