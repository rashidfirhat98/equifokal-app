"use server";

import env from "@/lib/env";
import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ImagesResults } from "@/models/Images";
import * as z from "zod";

const s3Client = new S3Client({
  region: env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

const gallerySchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  photoIds: z.array(z.number()).min(1),
});

async function uploadFileToS3(buffer: Buffer, fileName: string) {
  const params = {
    Bucket: env.NEXT_AWS_S3_BUCKET_NAME,
    Key: `${fileName}`,
    Body: buffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully", response);
    const fileUrl = `https://${env.NEXT_AWS_S3_BUCKET_NAME}.s3.${env.NEXT_AWS_S3_REGION}.amazonaws.com/${fileName}`;

    return fileUrl; // ✅ Return the file's URL
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

export async function uploadImage(formData: FormData) {
  const session = await getServerSession(authOptions);
  try {
    const files = formData.getAll("files"); // Retrieve all files
    if (!files.length) {
      return { status: "error", message: "No files found" };
    }

    // Extract metadata dynamically using the keys
    const metadataList = [];
    for (let i = 0; i < files.length; i++) {
      const metadataString = formData.get(`metadata[${i}]`);
      metadataList.push(
        metadataString ? JSON.parse(metadataString as string) : null
      );
    }

    console.log("Extracted Metadata:", metadataList);

    for (let index = 0; index < files.length; index++) {
      const file = files[index] as File;
      const metadata = metadataList[index]; // Ensure we match file with its metadata
      const buffer = Buffer.from(await file.arrayBuffer());
      // Upload file to S3 and get the URL
      if (!session) {
        return { status: "error", message: "User not found" };
      }
      const fileUrl = await uploadFileToS3(buffer, file.name);

      // Save to database
      await prisma.image.create({
        data: {
          userId: session.user.id, // Ensure this comes from session/auth
          url: fileUrl,
          fileName: file.name,
          metadata: metadata
            ? {
                create: {
                  model: metadata.model,
                  aperture: metadata.aperture,
                  focalLength: metadata.focalLength,
                  exposureTime: metadata.exposureTime,
                  iso: metadata.iso,
                  flash: metadata.flash,
                  width: metadata.width,
                  height: metadata.height,
                },
              }
            : undefined,
        },
        include: {
          metadata: true,
        },
      });

      revalidatePath("/");
    }
    return {
      status: "success",
      message: "Images uploaded successfully",
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { status: "error", message: "Failed to upload images" };
  }
}

export async function getUserImages(
  page: number = 1,
  per_page: number = 10
): Promise<ImagesResults | undefined> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { photos: [], page, per_page, total_results: 0 };
  }

  const total_results = await prisma.image.count({
    where: { userId: session.user.id },
  });

  const images = await prisma.image.findMany({
    where: { userId: session.user.id },
    include: { metadata: true },
    orderBy: { createdAt: "desc" },
    take: per_page,
    skip: (page - 1) * per_page,
  });

  return {
    page,
    per_page,
    total_results,
    photos: images.map((image) => ({
      id: image.id,
      url: `/photo/${image.id}`,
      height: image.metadata?.height || 2000,
      width: image.metadata?.width || 2000,
      alt: image.fileName,
      src: {
        large: image.url, // Adjust based on your storage
      },
    })),
    prev_page:
      page > 1
        ? `/api/images?page=${page - 1}&per_page=${per_page}`
        : undefined,
    next_page:
      page * per_page < total_results
        ? `/api/images?page=${page + 1}&per_page=${per_page}`
        : undefined,
  };
}

export async function createGallery(data: z.infer<typeof gallerySchema>) {
  const validatedData = gallerySchema.parse(data);

  try {
    const gallery = await prisma.gallery.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        images: {
          create: validatedData.photoIds.map((imageId) => ({
            image: { connect: { id: imageId } },
          })),
        },
      },
    });
    return {
      gallery,
      status: "success",
      message: "Gallery created successfully",
    };
  } catch (error) {
    throw new Error("Failed to create gallery");
  }
}
