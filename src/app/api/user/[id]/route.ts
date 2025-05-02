import { getUserDetails } from "@/lib/services/user";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").pop();

  console.log(id);

  if (!id) {
    return NextResponse.json({ error: "User id not found", status: 404 });
  }

  try {
    const photo = await getUserDetails(id);
    return NextResponse.json(photo, { status: 200 });
  } catch (error) {
    console.error("Error fetching image", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
