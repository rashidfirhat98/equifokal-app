import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { getUserPortfolioImages } from "@/lib/services/images";

export async function GET(req: Request) {
  try {
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

    let parsedCursor = null;
    if (cursor) {
      parsedCursor = parseInt(cursor);
      if (isNaN(parsedCursor)) {
        return NextResponse.json({
          error: "Invalid cursor value",
          status: 400,
        });
      }
    }

    const { photos, nextCursor } = await getUserPortfolioImages(
      userId,
      limit,
      parsedCursor
    );
    return NextResponse.json({
      photos,
      nextCursor,
    });
  } catch (error) {
    console.error("Error fetching portfolio images:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
