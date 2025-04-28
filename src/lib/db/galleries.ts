import prisma from "@/lib/prisma";

export const totalGalleriesByUserId = async (userId: string) => {
  return await prisma.gallery.count({
    where: { userId },
  });
};

export const findGalleriesByUserIdAndCursor = async (
  userId: string,
  limit: number,
  cursor: number | null
) => {
  return prisma.gallery.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: {
        include: {
          image: true,
        },
      },
    },
    where: {
      userId: userId,
    },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });
};
