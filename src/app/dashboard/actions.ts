"use server";

import env from "@/lib/env";
import { revalidatePath } from "next/cache";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
    return fileName;
  } catch (error) {
    throw error;
  }
}

export async function uploadImage(prevState: any, formData: FormData) {
  try {
    const files = formData.getAll("files"); // Get all uploaded files
    console.log(formData);
    if (!files.length) {
      return { status: "error", message: "Please select at least one file" };
    }

    for (const file of files) {
      if (!(file instanceof Blob)) continue; // Ensure it's a File object

      const buffer: Buffer = Buffer.from(await file.arrayBuffer());
      const fileName = (file as any).name || `file-${Date.now()}`;
      await uploadFileToS3(buffer, fileName);
    }

    revalidatePath("/");
    return { status: "success", message: "Images have been uploaded" };
  } catch (error) {
    console.error("Upload Error:", error);
    return { status: "error", message: "Something went wrong during upload" };
  }
}
