"use server";

import { authOptions } from "@/lib/authOptions";
import { getIsFollowing } from "@/lib/services/follow";
import { getUserDetails } from "@/lib/services/user";

import { getServerSession } from "next-auth";

export async function fetchProfileUser(userId: string) {
  if (!userId) throw new Error("User id not found");
  try {
    const user = await getUserDetails(userId);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User not found");
  }
}

export async function fetchCurrentUser() {
  try {
    const session = await getServerSession(authOptions);

    let currentUser = null;
    if (session?.user.id) {
      currentUser = await getUserDetails(session.user.id);
    }
    return currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User not found");
  }
}

export async function fetchIsFollowing(
  followingId: string,
  followerId?: string
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error("Unauthorized");
    }

    const currentUser = followerId ?? session.user.id;

    return await getIsFollowing(currentUser, followingId);
  } catch (error) {}
}
