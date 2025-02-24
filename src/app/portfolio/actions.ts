"use server";

import prisma from "@/lib/prisma";

export async function getUploadedImages() {
  const images = await prisma.image.findMany({
    select: {
      id: true,
      url: true, // Only fetch the necessary fields
    },
    orderBy: { createdAt: "desc" }, // Optional: Order by latest images first
  });

  return images;
}
