import prisma from "@/lib/prisma";

export const findArticleById = async (articleId: number) => {
  return prisma.article.findUnique({
    where: { id: articleId },
    include: {
      coverImage: {
        include: {
          metadata: true,
        },
      },
      user: true,
      galleries: {
        include: {
          gallery: {
            include: {
              images: {
                include: {
                  image: {
                    include: {
                      metadata: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

export const findArticlesByUserIdAndCursor = async (
  userId: string,
  cursor: number | null,
  limit: number
) => {
  return prisma.article.findMany({
    where: { userId },
    include: {
      coverImage: {
        include: {
          metadata: true,
        },
      },
      user: true,
      //   galleries: {
      //     include: {
      //       gallery: {
      //         include: {
      //           images: {
      //             include: {
      //               image: {
      //                 include: {
      //                   metadata: true,
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
    },
    orderBy: [{ createdAt: "desc" }],
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
  });
};
