// src/scripts/backfill-blur.ts
import { PrismaClient } from "@prisma/client";
import { getPlaiceholder } from "plaiceholder";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function getBase64(imageUrl) {
  try {
    const res = await fetch(imageUrl);

    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer();

    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return base64;
  } catch (e) {
    if (e instanceof Error) console.log(e);
  }
}

async function addBlurredDataUrls(images) {
  // Make all requests at once instead of awaiting each one - avoiding a waterfall
  const base64Promises = images.map((photo) => getBase64(photo.src.large));

  // Resolve all requests in order
  const base64Results = await Promise.all(base64Promises);

  const photosWithBlur = images.map((photo, i) => {
    photo.blurredDataUrl = base64Results[i];
    return photo;
  });

  return photosWithBlur;
}

function convertToCDNUrl(s3Url) {
  // your logic here
  return s3Url.replace(
    `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}`,
    `${process.env.NEXT_PUBLIC_AWS_CDN_URL}`
  );
}

async function backfillBlur() {
  const images = await prisma.image.findMany({
    where: { blurDataUrl: null },
    select: { id: true, url: true },
  });

  console.log(`Found ${images.length} images to backfill`);

  for (const image of images) {
    try {
      const photosWithBlur = await addBlurredDataUrls([
        { src: { large: convertToCDNUrl(image.url) } },
      ]);

      await prisma.image.update({
        where: { id: image.id },
        data: { blurDataUrl: photosWithBlur[0].blurredDataUrl },
      });

      console.log(`✅ Backfilled image ${image.id}`);
    } catch (err) {
      console.error(`❌ Failed to process image ${image.id}:`, err);
    }
  }
}

console.log("🎉 Backfill complete");

// Only run if this file is being executed directly (not imported)
backfillBlur()
  .then(() => {
    console.log("All images processed!");
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error("Error during backfilling:", err);
    prisma.$disconnect();
  });
