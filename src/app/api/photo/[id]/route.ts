import { getImageWithMetadataById } from "@/lib/services/images";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Image id not found", status: 404 });
  }

  const imageId = parseInt(id);

  if (isNaN(imageId)) {
    return NextResponse.json({ error: "Invalid image id" }, { status: 400 });
  }

  try {
    const photo = await getImageWithMetadataById(imageId);
    return NextResponse.json(photo, { status: 200 });
  } catch (error) {
    console.error("Error fetching image", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
