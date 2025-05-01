import { getGalleryWithImageMetadataById } from "@/lib/services/galleries";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();
  if (!id) {
    return NextResponse.json(
      { error: "Gallery id not found" },
      { status: 404 }
    );
  }

  const galleryId = parseInt(id);

  if (isNaN(galleryId)) {
    return NextResponse.json({ error: "Invalid gallery id" }, { status: 400 });
  }

  try {
    const gallery = await getGalleryWithImageMetadataById(galleryId);

    return NextResponse.json(gallery, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
