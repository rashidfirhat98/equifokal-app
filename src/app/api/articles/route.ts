import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  createArticle,
  getArticlesList,
  updateArticleGalleries,
  updateUserArticle,
} from "@/lib/services/articles";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const EditArticleSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(50),
  description: z.string().min(30).max(140),
  galleryIds: z.array(z.number()).optional(),
  uploadResult: z
    .object({
      id: z.number(),
      url: z.string().url(),
      fileName: z.string(),
      metadata: z.any().optional(),
    })
    .optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const userIdParam = searchParams.get("userId");

    const userId = userIdParam ?? session?.user.id;
    const cursorId = cursor ? parseInt(cursor) : null;

    if (!userId) {
      return NextResponse.json(
        { message: "Not authenticated or no user ID provided." },
        { status: 401 }
      );
    }

    const results = await getArticlesList(limit, cursorId, userId);
    return NextResponse.json(results, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, description, galleryIds, uploadResult } =
      await req.json();

    // const formData = await req.formData();

    // const { filesWithMetadata, isPortfolio, isProfilePic } =
    //   extractUploadData(formData);
    // if (!filesWithMetadata || filesWithMetadata.length === 0) {
    //   return NextResponse.json({ error: "No files found" }, { status: 400 });
    // }

    // const uploadResult = await uploadImages({
    //   files: filesWithMetadata,
    //   userId: session.user.id,
    //   isPortfolio,
    //   isProfilePic,
    // });

    const article = await createArticle({
      userId: session.user.id,
      title,
      content,
      description,
      galleryIds,
      uploadResult,
    });
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const articleId = Number(params.id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    const { title, content, description, galleryIds, uploadResult } =
      await req.json();

    const article = await updateUserArticle({
      articleId,
      userId: session.user.id,
      title,
      content,
      description,
      uploadResult,
    });

    if (galleryIds?.length) {
      await updateArticleGalleries({
        articleId,
        galleryIds,
      });
    }

    return NextResponse.json({ article }, { status: 200 });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
