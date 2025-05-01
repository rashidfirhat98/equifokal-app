import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import {
  deleteFollowerByFollowId,
  insertFollowerByFollowId,
} from "@/lib/db/follow";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const { followerId, followingId } = await req.json();

  if (!followingId || !followerId) {
    return NextResponse.json(
      { error: "Missing followerId or followingid" },
      { status: 400 }
    );
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.id !== followerId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.id === followingId) {
    return NextResponse.json(
      { error: "You cannot follow yourself" },
      { status: 400 }
    );
  }
  try {
    const res = await insertFollowerByFollowId({ followerId, followingId });

    if (!res) {
      throw new Error("Failed to follow");
    }

    return NextResponse.json({ message: "User Followed" }, { status: 200 });
  } catch (error) {
    console.error("Error following user", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const { followerId, followingId } = await req.json();

  if (!followingId || !followerId) {
    return NextResponse.json(
      { message: "Missing followerId or followingid" },
      { status: 400 }
    );
  }

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.id !== followerId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.id === followingId) {
    return NextResponse.json(
      { message: "You cannot follow yourself" },
      { status: 400 }
    );
  }
  try {
    const res = await deleteFollowerByFollowId;

    if (!res) {
      throw new Error("Failed to unfollow");
    }

    return NextResponse.json({ message: "User unfollowed" }, { status: 200 });
  } catch (error) {
    console.error("Error unfollowing user", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
