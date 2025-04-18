import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { uploadImage } from "@/lib/uploadImage";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const userIdParam = searchParams.get("userId");

  const userId = userIdParam ?? session?.user.id;

  if (!userId) {
    return NextResponse.json(
      { message: "Not authenticated or no user ID provided." },
      { status: 401 }
    );
  }

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
      //profilePic
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
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const title = formData.get("title")?.toString() || "";
  const content = formData.get("content")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const galleryIdRaw = formData.get("galleryId")?.toString() || "[]";
  const galleryIds = JSON.parse(galleryIdRaw) as number[];
  const files = formData.getAll("files");
  let coverImageId: number | undefined;

  if (files.length > 0) {
    const uploadResult = await uploadImage(formData);

    if (uploadResult.status === "success" && uploadResult.images?.length) {
      coverImageId = uploadResult.images[0].id;
    }
  }

  try {
    const article = await prisma.article.create({
      data: {
        title,
        content,
        description,
        user: { connect: { id: session.user.id } },
        ...(coverImageId && {
          coverImage: { connect: { id: coverImageId } },
        }),
      },
    });

    // Link to galleries
    if (galleryIds.length > 0) {
      await prisma.articleGallery.createMany({
        data: galleryIds.map((galleryId) => ({
          articleId: article.id,
          galleryId,
        })),
        skipDuplicates: true,
      });
    }
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
