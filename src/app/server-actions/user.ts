import { authOptions } from "@/lib/authOptions";
import { getUserById } from "@/lib/getUserById";
import { getServerSession } from "next-auth";

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    let currentUser = null;
    if (session?.user.id) {
      currentUser = await getUserById(session.user.id);
    }
    return currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User not found");
  }
}
