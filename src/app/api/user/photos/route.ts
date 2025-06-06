import { NextResponse } from "next/server";
import { getUserImages } from "@/lib/services/images";

export async function GET(req: Request) {
  // const session = await getServerSession(authOptions);

  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const userIdParam = searchParams.get("userId");

  const userId = userIdParam;

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

  const { photos, nextCursor } = await getUserImages(
    userId,
    limit,
    parsedCursor
  );

  return NextResponse.json({
    photos,
    nextCursor,
  });
}
