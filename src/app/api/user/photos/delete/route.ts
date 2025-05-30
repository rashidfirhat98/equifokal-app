import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
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

  // Get photo URLs for photoIds (for profilePic check)
  try {
    const photos = await prisma.image.findMany({
      where: { id: { in: photoIds } },
      select: { id: true, url: true, fileName: true },
    });

    // const usedPhotos = await prisma.image.findMany({
    //   where: {
    //     id: { in: photoIds },
    //     OR: [
    //       { portfolio: true },
    //       { Article: { some: {} } },
    //       { galleries: { some: {} } },
    //       { url: user?.profilePic ?? "__never__" },
    //     ],
    //   },
    //   select: { id: true },
    // });

    // const usedIds = new Set(usedPhotos.map((photo) => photo.id));
    const deletablePhotos = photos.map((p) => {
      return { id: p.id, fileName: p.fileName, url: p.url };
    });
    // .filter((p) => !usedIds.has(p.id));

    const deletableIds = deletablePhotos.map((d) => d.id);

    // if (deletableIds.length === 0) {
    //   return NextResponse.json({
    //     message: "No photos deleted. All selected photos are still in use.",
    //     usedPhotoIds: Array.from(usedIds),
    //   });
    // }

    const isProfilePicBeingDeleted = deletablePhotos.some((p) => {
      return p.url === session.user.profilePic;
    });

    if (isProfilePicBeingDeleted) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { profilePic: null },
      });
    }

    const deleted = await prisma.image.deleteMany({
      where: { id: { in: deletableIds } },
    });

    return NextResponse.json({
      deleted,
      deletedPhotos: deletablePhotos,
      // notDeleted: Array.from(usedIds),
      clearedProfilePic: isProfilePicBeingDeleted,
      message: "Some photos were not deleted as they are in use.",
    });
  } catch (error) {
    console.error("Error deleting photos:", error);
    return NextResponse.json(
      { error: "Failed to delete photos" },
      { status: 500 }
    );
  }
}
