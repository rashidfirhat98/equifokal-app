import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 404 });
  }
  const id = parseInt(params.id);
  const { fileName, isPortfolio, isProfilePic } = await req.json();

  if (!id || typeof fileName !== "string") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const updated = await prisma.image.update({
    where: { id },
    data: {
      fileName,
      portfolio: isPortfolio,
      profilePic: isProfilePic,
    },
  });

  const userUpdated = await prisma.user;

  return NextResponse.json(updated);
}
