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

export const insertUserArticle = async ({
  title,
  content,
  description,
  coverImageId,
  userId,
}: {
  title: string;
  content: string;
  description: string;
  coverImageId: number | undefined;
  userId: string;
}) => {
  return await prisma.article.create({
    data: {
      title,
      content,
      description,
      user: { connect: { id: userId } },
      ...(coverImageId && {
        coverImage: { connect: { id: coverImageId } },
      }),
    },
  });
};

export const insertArticleGalleryByGalleryIds = async ({
  articleId,
  galleryIds,
}: {
  articleId: number;
  galleryIds: number[];
}) => {
  return await prisma.articleGallery.createMany({
    data: galleryIds.map((galleryId) => ({
      articleId: articleId,
      galleryId,
    })),
    skipDuplicates: true,
  });
};
