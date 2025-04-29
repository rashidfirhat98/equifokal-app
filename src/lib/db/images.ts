import prisma from "../prisma";

export const findUserPortfolioImages = async (
  userId: string,
  limit: number,
  cursor: number | null
) => {
  return await prisma.image.findMany({
    where: {
      userId,
      portfolio: true,
      // isPrivate: false, // future addition
    },
    include: { metadata: true },
    orderBy: [{ createdAt: "desc" }],
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });
};

export const findUserImages = async (
  userId: string,
  limit: number,
  cursor: number | null
) => {
  return prisma.image.findMany({
    where: {
      userId: userId,
    },
    include: { metadata: true },
    orderBy: [{ createdAt: "desc" }],
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });
};

export const findUserImagesWithPage = async (
  userId: string,
  offset: number,
  perPage: number
) => {
  return await prisma.image.findMany({
    skip: offset,
    take: perPage,
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      metadata: true,
    },
  });
};
export const totalImagesByUserId = async (userId: string) => {
  return await prisma.image.count({
    where: { userId },
  });
};
