"use server";
import { authOptions } from "@/lib/authOptions";
import {
  createUserGallery,
  getUserGalleriesList,
  getUserGalleriesListWithPagination,
} from "@/lib/services/galleries";
import { getUserPortfolioImages } from "@/lib/services/images";
import { GalleryFormData, GalleryFormDataSchema } from "@/models/Gallery";
import { getServerSession } from "next-auth";

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

    return await getUserPortfolioImages(userIdParam, limit, cursor);
  } catch (error) {
    console.error("Error fetching portfolio images:", error);
    throw new Error("Portfolio images not found");
  }
};

export async function fetchUserGalleriesList(
  limit: number = 3,
  cursor: number | null = null,
  userId: string | null = null
) {
  try {
    const session = await getServerSession(authOptions);

    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam || !session?.user.id)
      throw new Error("Not authenticated or no user ID provided.");

    return await getUserGalleriesList(limit, cursor, userIdParam);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    throw new Error("Galleries not found");
  }
}

export async function fetchUserGalleriesListWithPagination(
  page: number = 1,
  per_page: number = 10,
  userId: string | null = null
) {
  try {
    const session = await getServerSession(authOptions);

    const userIdParam = userId ?? session?.user.id;

    if (!userIdParam || !session?.user.id)
      throw new Error("Not authenticated or no user ID provided.");

    return await getUserGalleriesListWithPagination(
      page,
      per_page,
      userIdParam
    );
  } catch (error) {
    console.error("Error fetching galleries:", error);
    throw new Error("Galleries not found");
  }
}

export const submitGalleryData = async (data: GalleryFormData) => {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user.id;
    if (!userId) {
      throw new Error("User ID not found in session.");
    }

    const validatedData = GalleryFormDataSchema.parse(data);
    if (!validatedData) {
      throw new Error("Invalid gallery data.");
    }

    return await createUserGallery(userId, validatedData);
  } catch (error) {
    console.error("Error creating gallery:", error);
    throw new Error("Failed to create gallery");
  }
};
