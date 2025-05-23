import env from "@/lib/env";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { insertUserImage } from "../db/images";
import {
  UploadedImage,
  UploadImageArgs,
  UploadImageNewArgs,
  UploadImageResult,
} from "@/models/ImageUploadSchema";

import { getPlaiceholder } from "plaiceholder"; // or your current blur lib

async function generateBlurDataUrl(imageBuffer: Buffer): Promise<string> {
  const { base64 } = await getPlaiceholder(imageBuffer);
  return base64;
}

const s3Client = new S3Client({
  region: env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(buffer: Buffer, fileName: string) {
  const key = `uploads/${fileName}`;
  const params = {
    Bucket: env.NEXT_AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: "image/jpeg",
    CacheControl: "public, max-age=31536000, immutable",
  };

  const command = new PutObjectCommand(params);
  try {
    const response = await s3Client.send(command);
    console.log("File uploaded successfully", response);
    const fileUrl = `${env.NEXT_PUBLIC_AWS_CDN_URL}/${key}`;

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
}

export async function uploadImages({
  files,
  userId,
  isPortfolio,
  isProfilePic,
}: UploadImageArgs): Promise<UploadImageResult> {
  try {
    const uploadedImages: UploadedImage[] = [];

    for (const { file, metadata } of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const blurDataUrl = await generateBlurDataUrl(buffer);

      const fileUrl = await uploadFileToS3(buffer, file.name);

      const createdImage = await insertUserImage({
        userId,
        url: fileUrl,
        fileName: file.name,
        blurDataUrl,
        width: metadata?.width,
        height: metadata?.height,
        metadata: {
          model: metadata?.model,
          aperture: metadata?.aperture,
          focalLength: metadata?.focalLength,
          exposureTime: metadata?.exposureTime,
          iso: metadata?.iso,
          flash: metadata?.flash,
          width: metadata?.width,
          height: metadata?.height,
        },
        isPortfolio: isPortfolio,
        isProfilePic: isProfilePic,
      });

      uploadedImages.push(createdImage);
    }
    return {
      status: "success",
      message: "Images uploaded successfully",
      images: uploadedImages,
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { status: "error", message: "Failed to upload images" };
  }
}

export async function uploadImagesNew({
  files,
  userId,
  isPortfolio,
  isProfilePic,
}: UploadImageNewArgs): Promise<UploadImageResult> {
  try {
    const uploadedImages: UploadedImage[] = [];

    for (const { url, fileName, metadata } of files) {
      const imageRes = await fetch(url);

      if (!imageRes.ok) {
        throw new Error(`Failed to fetch image: ${imageRes.statusText}`);
      }

      const contentType = imageRes.headers.get("content-type");
      if (!contentType?.startsWith("image/")) {
        throw new Error(`Invalid content type: ${contentType}`);
      }

      const buffer = Buffer.from(await imageRes.arrayBuffer());
      const blurDataUrl = await generateBlurDataUrl(buffer);

      const createdImage = await insertUserImage({
        userId,
        url,
        fileName,
        blurDataUrl,
        width: metadata?.width,
        height: metadata?.height,
        metadata: {
          model: metadata?.model,
          aperture: metadata?.aperture,
          focalLength: metadata?.focalLength,
          exposureTime: metadata?.exposureTime,
          iso: metadata?.iso,
          flash: metadata?.flash,
          width: metadata?.width,
          height: metadata?.height,
        },
        isPortfolio: isPortfolio,
        isProfilePic: isProfilePic,
      });

      uploadedImages.push(createdImage);
    }
    return {
      status: "success",
      message: "Images uploaded successfully",
      images: uploadedImages,
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { status: "error", message: "Failed to upload images" };
  }
}
