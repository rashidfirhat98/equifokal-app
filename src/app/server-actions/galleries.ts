import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getUserGalleriesList } from "@/lib/services/galleries";

export async function fetchUserGalleriesList(
  limit: number = 10,
  cursor: number | null = null,
  userId: string | null = null
) {
  try {
    const session = await getServerSession(authOptions);

    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam || !session)
      throw new Error("Not authenticated or no user ID provided.");

    return await getUserGalleriesList(limit, cursor, userIdParam);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    throw new Error("Galleries not found");
  }
}
