import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting migration of image dimensions...");

  const imagesWithMetadata = await prisma.image.findMany({
    where: {
      metadata: {
        NOT: {
          width: null,
        },
      },
    },
    include: {
      metadata: true,
    },
  });

  let updatedCount = 0;

  for (const image of imagesWithMetadata) {
    const width = image.metadata?.width;
    const height = image.metadata?.height;

    if (width !== null && height !== null) {
      await prisma.image.update({
        where: { id: image.id },
        data: {
          width,
          height,
        },
      });
      updatedCount++;
    }
  }

  console.log(`✅ Done. Updated ${updatedCount} images with dimensions.`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
