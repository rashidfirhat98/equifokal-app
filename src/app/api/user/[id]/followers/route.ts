import { getFollowerList } from "@/lib/services/follow";
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
    const { followers, nextCursor } = await getFollowerList(id, limit, cursor);

    return NextResponse.json({ followers, nextCursor });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user followers list" },
      { status: 500 }
    );
  }
}
