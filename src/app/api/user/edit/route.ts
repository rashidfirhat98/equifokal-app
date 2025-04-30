import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { uploadImages } from "@/lib/uploadImages";
import { extractUploadData } from "@/lib/extractUploadData";

//TODO:Test this endpoint later
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const formData = await req.formData();

  let profilePicURL: string | undefined;

  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const bio = formData.get("bio")?.toString() || "";
  const files = formData.getAll("files");

  if (files.length > 0) {
    const { filesWithMetadata, isPortfolio, isProfilePic } =
      extractUploadData(formData);
    if (!filesWithMetadata || filesWithMetadata.length === 0) {
      return NextResponse.json({ error: "No files found" }, { status: 400 });
    }

    console.log(isPortfolio, isProfilePic);

    const uploadResult = await uploadImages({
      files: filesWithMetadata,
      userId,
      isPortfolio,
      isProfilePic,
    });

    if (uploadResult.status === "success" && uploadResult.images?.length) {
      profilePicURL = uploadResult.images[0].url;
    }
    console.log(uploadResult, profilePicURL);
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        bio,
        profilePic: profilePicURL,
      },
    });

    return NextResponse.json(updatedUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
