import env from "@/lib/env";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { insertUserImage } from "../db/images";
import {
  UploadedImage,
  UploadImageArgs,
  UploadImageResult,
} from "@/models/ImageUploadSchema";

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

      const fileUrl = await uploadFileToS3(buffer, file.name);

      const createdImage = await insertUserImage({
        userId,
        url: fileUrl,
        fileName: file.name,
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
