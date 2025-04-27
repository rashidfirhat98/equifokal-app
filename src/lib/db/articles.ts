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
