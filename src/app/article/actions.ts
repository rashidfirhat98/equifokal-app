"use server";

import { authOptions } from "@/lib/authOptions";

import {
  getArticlePostDetails,
  getArticlesList,
  getUserArticleCount,
} from "@/lib/services/articles";
import { getUserDetails } from "@/lib/services/user";
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

export const fetchUserArticleList = async (
  limit: number = 10,
  cursor: number | null = null,
  userId: string | null = null
) => {
  try {
    const session = await getServerSession(authOptions);
    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam || !session?.user.id)
      throw new Error("Not authenticated or no user ID provided.");

    if (!session?.user.id) {
      throw new Error("Unauthorized");
    }

    return await getArticlesList(limit, cursor, userIdParam);
  } catch (error) {
    console.error("Error fetching user article list:", error);
    throw new Error("Failed to fetch user article list.");
  }
};

export const fetchArticlePost = async (id: string) => {
  try {
    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      throw new Error("Invalid articleById ID.");
    }

    return getArticlePostDetails(articleId);
  } catch (error) {
    console.error("Error fetching article post:", error);
    throw new Error("Failed to fetch article post.");
  }
};

export async function fetchUserArticleCount(userId: string) {
  try {
    if (!userId) {
      throw new Error("Not authenticated or no user ID provided.");
    }

    return await getUserArticleCount(userId);
  } catch (error) {
    console.error("Error fetching user article count:", error);
    throw new Error("User article count not found");
  }
}
