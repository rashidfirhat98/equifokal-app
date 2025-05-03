import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { uploadImages } from "@/lib/services/uploadImages";
import { extractUploadData } from "@/lib/utils/extractUploadData";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const formData = await req.formData();

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
    return NextResponse.json(uploadResult, { status: 201 });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
