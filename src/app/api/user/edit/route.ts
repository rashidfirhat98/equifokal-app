import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { editUserDetails } from "@/lib/services/user";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const { name, email, bio, uploadResult, existingProfilePicURL } =
    await req.json();

  let profilePicURL: string | null = existingProfilePicURL;
  if (uploadResult.status === "success" && uploadResult.images?.length) {
    profilePicURL = uploadResult.images[0].url;
  }

  try {
    const updatedUser = await editUserDetails({
      userId,
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
