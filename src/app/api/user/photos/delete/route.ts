import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { photoIds } = await req.json();

  if (
    !Array.isArray(photoIds) ||
    photoIds.some((id) => typeof id !== "number")
  ) {
    return NextResponse.json({ error: "Invalid photoIds" }, { status: 400 });
  }

  try {
    const deleted = await prisma.image.deleteMany({
      where: { id: { in: photoIds } },
    });

    return NextResponse.json({ deleted });
  } catch (error) {
    console.error("Error deleting photos:", error);
    return NextResponse.json(
      { error: "Failed to delete photos" },
      { status: 500 }
    );
  }
}
