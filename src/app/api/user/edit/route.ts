import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { uploadImages } from "@/lib/uploadImages";
import { extractUploadData } from "@/lib/extractUploadData";
import { editUserDetails } from "@/lib/services/user";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const formData = await req.formData();

  let profilePicURL: string | null = null;

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

    const uploadResult = await uploadImages({
      files: filesWithMetadata,
      userId,
      isPortfolio,
      isProfilePic,
    });

    if (uploadResult.status === "success" && uploadResult.images?.length) {
      profilePicURL = uploadResult.images[0].url;
    }
  }

  try {
    const updatedUser = await editUserDetails({
      userId: session.user.id,
      name,
      email,
      bio,
      profilePicURL,
    });

    return NextResponse.json(updatedUser, { status: 201 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
