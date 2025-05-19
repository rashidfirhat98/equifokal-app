import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSignedS3Url } from "@/lib/services/s3";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { fileName, fileType } = await req.json();

    const signedUrl = await getSignedS3Url(fileName, fileType);

    return NextResponse.json({ ...signedUrl, status: 201 });
  } catch (error) {
    console.error("Metadata upload failed:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to get signed #3 URL" },
      { status: 500 }
    );
  }
}
