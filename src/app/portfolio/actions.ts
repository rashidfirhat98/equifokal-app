"use server";

import { authOptions } from "@/lib/authOptions";
import { getUserImagesWithPagination } from "@/lib/services/images";
import { getServerSession } from "next-auth";

export async function fetchUserImagesWithPage(
  page: number = 1,
  per_page: number = 10
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
      throw new Error("Not authenticated");
    }

    return await getUserImagesWithPagination(page, per_page, session.user.id);
  } catch (error) {
    console.error("Error fetching user images:", error);
    throw new Error("User images not found");
  }
}
