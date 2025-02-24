"use server";

import env from "@/lib/env";
import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const s3Client = new S3Client({
  region: env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
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
      if (session) {
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
                  },
                }
              : undefined,
          },
          include: {
            metadata: true,
          },
        });
      }

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
