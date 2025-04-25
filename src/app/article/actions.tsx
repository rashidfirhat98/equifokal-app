"use server";

import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const getArticleById = async (id: string) => {
  const articleId = parseInt(id);
  const session = await getServerSession(authOptions);
  if (isNaN(articleId)) {
    return NextResponse.json(
      { message: "Invalid articleById ID." },
      { status: 400 }
    );
  }

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const articleById = await prisma.article.findUnique({
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

  if (!articleById) {
    return NextResponse.json(
      { message: "Article not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    article: {
      id: articleById.id,
      title: articleById.title,
      content: articleById.content,
      description: articleById.description,
      createdBy: articleById.user.name,
      profilePic: articleById.user.profilePic,
      createdAt: new Date(articleById.createdAt).toLocaleString(),
      updatedAt: new Date(articleById.updatedAt).toLocaleString(),
      coverImage: articleById.coverImage
        ? {
            id: articleById.coverImage.id,
            width: articleById.coverImage.metadata?.width || 0,
            height: articleById.coverImage.metadata?.height || 0,
            url: articleById.coverImage.url,
            src: { large: articleById.coverImage.url },
            alt: articleById.coverImage.fileName,
            metadata: articleById.coverImage.metadata
              ? {
                  model: articleById.coverImage.metadata.model || undefined,
                  aperture:
                    articleById.coverImage.metadata.aperture || undefined,
                  focalLength:
                    articleById.coverImage.metadata.focalLength || undefined,
                  exposureTime:
                    articleById.coverImage.metadata.exposureTime || undefined,
                  iso: articleById.coverImage.metadata.iso || undefined,
                  flash: articleById.coverImage.metadata.flash || undefined,
                }
              : undefined,
          }
        : undefined,
      // galleries: articleById.galleries?.map(({ gallery }) => ({
      //   id: gallery.id,
      //   title: gallery.title,
      //   createdAt: gallery.createdAt.toISOString(),
      //   updatedAt: gallery.updatedAt.toISOString(),
      //   images: gallery.images?.map(({ image }) => ({
      //     id: image.id,
      //     width: image.metadata?.width || 0,
      //     height: image.metadata?.height || 0,
      //     url: image.url,
      //     src: { large: image.url },
      //     alt: image.fileName,
      //     // metadata: image.metadata ? {
      //     //   model: image.metadata.model || undefined,
      //     //   aperture: image.metadata.aperture || undefined,
      //     //   focalLength: image.metadata.focalLength || undefined,
      //     //   exposureTime: image.metadata.exposureTime || undefined,
      //     //   iso: image.metadata.iso || undefined,
      //     //   flash: image.metadata.flash || undefined
      //     // } : undefined
      //   })) || []
      // })) || []
    },
  });
};

export const getUserArticles = async (
  limit: number = 10,
  cursor: string | null = null,
  userId: string | null = null
) => {
  const session = await getServerSession(authOptions);
  const userIdParam = userId ?? session?.user.id;

  if (!userIdParam || !session)
    return NextResponse.json(
      { message: "Not authenticated or no user ID provided." },
      { status: 401 }
    );

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const articles = await prisma.article.findMany({
    where: { userId: session.user.id },
    include: {
      coverImage: {
        include: {
          metadata: true,
        },
      },
      user: true,
      // galleries: {
      //   include: {
      //     gallery: {
      //       include: {
      //         images: {
      //           include: {
      //             image: {
      //               include: {
      //                 metadata: true,
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor && {
      cursor: { id: parseInt(cursor) },
      skip: 1,
    }),
  });

  const hasNextPage = articles.length > limit;
  const trimmedArticles = hasNextPage ? articles.slice(0, -1) : articles;
  const nextCursor = hasNextPage
    ? trimmedArticles[trimmedArticles.length - 1].id
    : null;

  // const createdAt = new Date(article.createdAt.toISOString());

  return NextResponse.json({
    articles: trimmedArticles.map((article) => ({
      id: article.id,
      title: article.title,
      content: article.content,
      description: article.description,
      createdBy: article.user.name,
      profilePic: article.user.profilePic,
      createdAt: new Date(article.createdAt).toLocaleString(),
      updatedAt: new Date(article.updatedAt).toLocaleString(),
      coverImage: article.coverImage
        ? {
            id: article.coverImage.id,
            width: article.coverImage.metadata?.width || 0,
            height: article.coverImage.metadata?.height || 0,
            url: article.coverImage.url,
            src: { large: article.coverImage.url },
            alt: article.coverImage.fileName,
            metadata: article.coverImage.metadata
              ? {
                  model: article.coverImage.metadata.model || undefined,
                  aperture: article.coverImage.metadata.aperture || undefined,
                  focalLength:
                    article.coverImage.metadata.focalLength || undefined,
                  exposureTime:
                    article.coverImage.metadata.exposureTime || undefined,
                  iso: article.coverImage.metadata.iso || undefined,
                  flash: article.coverImage.metadata.flash || undefined,
                }
              : undefined,
          }
        : undefined,
      // galleries: article.galleries?.map(({ gallery }) => ({
      //   id: gallery.id,
      //   title: gallery.title,
      //   createdAt: gallery.createdAt.toISOString(),
      //   updatedAt: gallery.updatedAt.toISOString(),
      //   images: gallery.images?.map(({ image }) => ({
      //     id: image.id,
      //     width: image.metadata?.width || 0,
      //     height: image.metadata?.height || 0,
      //     url: image.url,
      //     src: { large: image.url },
      //     alt: image.fileName,
      //     // metadata: image.metadata ? {
      //     //   model: image.metadata.model || undefined,
      //     //   aperture: image.metadata.aperture || undefined,
      //     //   focalLength: image.metadata.focalLength || undefined,
      //     //   exposureTime: image.metadata.exposureTime || undefined,
      //     //   iso: image.metadata.iso || undefined,
      //     //   flash: image.metadata.flash || undefined
      //     // } : undefined
      //   })) || []
      // })) || []
    })),
    nextCursor,
  });
};
