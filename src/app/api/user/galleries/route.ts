import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { getUserGalleriesList } from "@/lib/services/galleries";

export async function GET(req: Request) {
  try {
    // const session = await getServerSession(authOptions);

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const userIdParam = searchParams.get("userId");

    const userId = userIdParam;

    if (!userId)
      return NextResponse.json(
        { message: "Not authenticated or no user ID provided." },
        { status: 401 }
      );

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
    // const start = performance.now();
    const { galleries, nextCursor, totalResults } = await getUserGalleriesList(
      limit,
      parsedCursor,
      userId
    );
    // const end = performance.now();
    // console.log(`Fetched galleries in ${end - start}ms`);
    return NextResponse.json({
      galleries,
      nextCursor,
      totalResults,
    });
  } catch (error) {
    console.error("Error fetching user galleries", error);
    NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
