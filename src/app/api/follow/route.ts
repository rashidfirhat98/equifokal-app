import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
    const res = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    if (!res) {
      throw new Error("Failed to follow");
    }

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
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
    const res = await prisma.follow.deleteMany({
      where: {
        followerId,
        followingId,
      },
    });

    if (!res) {
      throw new Error("Failed to unfollow");
    }

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
