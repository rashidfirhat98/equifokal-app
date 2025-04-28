"use server";

import { authOptions } from "@/lib/authOptions";
import {
  getArticlePostDetails,
  getArticlesList,
} from "@/lib/services/articles";

import { getServerSession } from "next-auth";

export const fetchArticlePost = async (id: string) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

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

export const fetchUserArticleList = async (
  limit: number = 10,
  cursor: number | null = null,
  userId: string | null = null
) => {
  console.log("Fetching user article list...");
  console.log("Cursor type:", typeof cursor);
  try {
    const session = await getServerSession(authOptions);
    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam || !session)
      throw new Error("Not authenticated or no user ID provided.");

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    return await getArticlesList(limit, cursor, userIdParam);
  } catch (error) {
    console.error("Error fetching user article list:", error);
    throw new Error("Failed to fetch user article list.");
  }
};
