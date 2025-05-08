import prisma from "@/lib/prisma";

export const findArticleById = async (articleId: number) => {
  return prisma.article.findUnique({
    where: { id: articleId },
    include: {
      coverImage: {
        select: {
          id: true,
          url: true,
          fileName: true,
          width: true,
          height: true,
          blurDataUrl: true,
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
                    select: {
                      id: true,
                      url: true,
                      fileName: true,
                      width: true,
                      height: true,
                      blurDataUrl: true,
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
    select: {
      id: true,
      title: true,
      content: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          profilePic: true,
        },
      },
      coverImage: {
        select: {
          id: true,
          url: true,
          fileName: true,
          width: true,
          height: true,
          blurDataUrl: true,
        },
      },
    },
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

    orderBy: [{ id: "desc" }],
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

export const totalArticlesByUserId = async (userId: string) => {
  return await prisma.article.count({
    where: { userId },
  });
};
