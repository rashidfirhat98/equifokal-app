import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const photo = await prisma.image.findUnique({
      where: { id: Number(id) },
      include: {
        metadata: true,
        user: true,
      },
    });

    console.log(photo);

    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: photo.id,
      url: photo.url,
      width: 800, // Set a default width (or use metadata)
      height: 600, // Set a default height (or use metadata)
      alt: photo.fileName || "Uploaded Image",
      src: { large: photo.url },
      photographer: photo.user.name || "Photographer",
      photographer_url: `/user/${photo.userId}`,
      photographer_id: photo.userId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
