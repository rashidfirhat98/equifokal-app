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
