import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { uploadImagesNew } from "@/lib/services/uploadImages";
import { UploadImageResult } from "@/models/ImageUploadSchema";

export async function POST(
  req: NextRequest
): Promise<NextResponse<UploadImageResult | { error: string }>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { files, isPortfolio, isProfilePic = false } = await req.json();

    if (!files) {
      return NextResponse.json({ error: "Files not found" }, { status: 400 });
    }

    const uploadResult = await uploadImagesNew({
      files,
      userId,
      isPortfolio,
      isProfilePic,
    });
    return NextResponse.json(uploadResult, { status: 201 });
  } catch (error) {
    console.error("Metadata upload failed:", error);
    return NextResponse.json(
      { status: "error", message: "Metadata upload failed" },
      { status: 500 }
    );
  }
}
