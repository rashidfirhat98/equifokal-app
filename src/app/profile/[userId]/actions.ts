import { authOptions } from "@/lib/authOptions";
import { getUserById } from "@/lib/getUserById";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function getProfileUser(userId: string) {
  if (!userId) throw new Error("User id not found");
  try {
    const user = await getUserById(userId);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User not found");
  }
}

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Session not found");
    if (!session?.user.id) throw new Error("User id not found");

    const currentUser = await getUserById(session.user.id);

    return currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User not found");
  }
}
