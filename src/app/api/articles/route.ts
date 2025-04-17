import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { uploadImage } from "@/lib/uploadImage";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const title = formData.get("title")?.toString() || "";
  const content = formData.get("content")?.toString() || "";

  const galleryIdRaw = formData.get("galleryId")?.toString() || "[]";
  const galleryIds = JSON.parse(galleryIdRaw) as number[];

  let coverImageId: number | undefined;

  // Upload image if provided
  const files = formData.getAll("files");

  console.log(files)
  if (files.length > 0) {
    const uploadResult = await uploadImage(formData);

    console.log("uploadResult", uploadResult)

    if (uploadResult.status === "success" && uploadResult.images?.length) {
      coverImageId = uploadResult.images[0].id;
    }
  }

  try {

    // Create article
    const article = await prisma.article.create({
      data: {
        title,
        content,
        user: { connect: { id: session.user.id } },
        ...(coverImageId && {
          coverImage: { connect: { id: coverImageId } }
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
    console.error(error)
    return NextResponse.json({ error }, { status: 500 });
  }
}