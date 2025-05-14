import { fetchUserPhotoCount } from "@/app/(auth)/photo-bucket/actions";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    if (!id) return NextResponse.json({ count: 0 });

    const count = await fetchUserPhotoCount(id);

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user photos count" },
      { status: 500 }
    );
  }
}
