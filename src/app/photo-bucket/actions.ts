"use server";

import { authOptions } from "@/lib/authOptions";
import {
  getUserImages,
  getUserImagesWithPagination,
  getUserPhotoCount,
} from "@/lib/services/images";
import { getUserDetails } from "@/lib/services/user";
import { profilePicURL } from "@/lib/utils/profilePic";
import { getServerSession } from "next-auth";

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

export async function fetchUserSession() {
  try {
    const session = await getServerSession(authOptions);

    let currentUser = null;
    if (session?.user.id) {
      currentUser = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        profilePic: session.user.image,
      };
    }

    return currentUser;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("User session not found");
  }
}

export const fetchUserImages = async (
  limit: number = 10,
  cursor: number | null = null,
  userId: string | null = null
) => {
  try {
    const session = await getServerSession(authOptions);

    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam) {
      throw new Error("Not authenticated or no user ID provided.");
    }

    return await getUserImages(userIdParam, limit, cursor);
  } catch (error) {
    console.error("Error fetching user images:", error);
    throw new Error("User images not found");
  }
};

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

export async function fetchUserPhotoCount(userId: string) {
  try {
    if (!userId) {
      throw new Error("Not authenticated or no user ID provided.");
    }

    return await getUserPhotoCount(userId);
  } catch (error) {
    console.error("Error fetching user photo count:", error);
    throw new Error("User photo count not found");
  }
}
