import prisma from "@/lib/prisma";
import * as z from "zod";
import { GalleriesSchemaWithImagesInfinite } from "@/models/Gallery";

export async function getGalleries({
  cursor,
  limit = 10,
}: {
  cursor?: number;
  limit?: number;
}): Promise<{
  galleries: z.infer<typeof GalleriesSchemaWithImagesInfinite>["galleries"];
  nextCursor: number | null;
}> {
  const galleries = await prisma.gallery.findMany({
    take: limit + 1, // Fetch one extra to check if there's a next page
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        include: {
          image: true, // No metadata needed
        },
      },
    },
  });

  const hasNextPage = galleries.length > limit;
  const trimmed = hasNextPage ? galleries.slice(0, -1) : galleries;

  const formattedGalleries = trimmed.map((gallery: any) => ({
    id: gallery.id,
    title: gallery.title,
    description: gallery.description || undefined,
    createdAt: gallery.createdAt.toISOString(),
    updatedAt: gallery.updatedAt.toISOString(),
    images: gallery.images.map((gi: any) => ({
      id: gi.image.id,
      url: gi.image.url,
      alt: gi.image.fileName,
      width: 0,
      height: 0,
      src: { large: gi.image.url },
      blurredDataUrl: undefined,
    })),
  }));

  return {
    galleries: formattedGalleries,
    nextCursor: hasNextPage ? trimmed[trimmed.length - 1].id : null,
  };
}
