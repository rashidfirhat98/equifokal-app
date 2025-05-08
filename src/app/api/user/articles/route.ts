import { getArticlesList } from "@/lib/services/articles";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const userIdParam = searchParams.get("userId");

    const userId = userIdParam;
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
