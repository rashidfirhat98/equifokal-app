import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  try {
    const gallery = await prisma.gallery.findUnique({
      where: { id: Number(id) },
      include: {
        images: {
          include: {
            image: {
              include: {
                metadata: true,
                user: true,
              },
            },
          },
        },
      },
    });

    if (!gallery) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: gallery.id,
      title: gallery.title,
      description: gallery.description || undefined,
      images: gallery.images.map((galleryImage) => ({
        id: galleryImage.image.id,
        url: galleryImage.image.url,
        width: galleryImage.image.metadata?.width ?? 0,
        height: galleryImage.image.metadata?.height ?? 0,
        alt: galleryImage.image.fileName,
        src: { large: galleryImage.image.url },
        blurredDataUrl: undefined,
        metadata: galleryImage.image.metadata
          ? {
              model: galleryImage.image.metadata.model || undefined,
              aperture: galleryImage.image.metadata.aperture || undefined,
              focalLength: galleryImage.image.metadata.focalLength || undefined,
              exposureTime:
                galleryImage.image.metadata.exposureTime || undefined,
              iso: galleryImage.image.metadata.iso || undefined,
              flash: galleryImage.image.metadata.flash || undefined,
              height: galleryImage.image.metadata.height || undefined,
              width: galleryImage.image.metadata.width || undefined,
            }
          : undefined,
      })),
      createdAt: gallery.createdAt.toISOString(),
      updatedAt: gallery.updatedAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
