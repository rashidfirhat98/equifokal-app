import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { uploadImages } from "@/lib/services/uploadImages";
import { createArticle, getArticlesList } from "@/lib/services/articles";
import { extractUploadData } from "@/lib/utils/extractUploadData";

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

    const formData = await req.formData();

    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const galleryIdRaw = formData.get("galleryId")?.toString() || "[]";
    const galleryIds = JSON.parse(galleryIdRaw) as number[];

    const { filesWithMetadata, isPortfolio, isProfilePic } =
      extractUploadData(formData);
    if (!filesWithMetadata || filesWithMetadata.length === 0) {
      return NextResponse.json({ error: "No files found" }, { status: 400 });
    }

    const uploadResult = await uploadImages({
      files: filesWithMetadata,
      userId: session.user.id,
      isPortfolio,
      isProfilePic,
    });

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
