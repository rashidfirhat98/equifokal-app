import { getFollowingList } from "@/lib/services/follow";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);

  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const cursor = searchParams.get("cursor") || null;

  try {
    const { followings, nextCursor } = await getFollowingList(
      id,
      limit,
      cursor
    );

    return NextResponse.json({ followings, nextCursor });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user following list" },
      { status: 500 }
    );
  }
}
