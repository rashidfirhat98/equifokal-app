"use client";

import { z } from "zod";

const acceptedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
];

export const AcceptedImageTypeSchema =
  typeof window !== "undefined"
    ? z
        .instanceof(FileList)
        .refine((fileList) => fileList.length > 0, {
          message: "At least one image is required",
        })
        .refine(
          (fileList) =>
            Array.from(fileList).every((file) =>
              acceptedImageTypes.includes(file.type)
            ),
          { message: "Invalid image file type" }
        )
    : z.any();

export const AcceptedCoverImageSchema =
  typeof window !== "undefined"
    ? z.object({
        file: z
          .instanceof(File)
          .refine((file) => acceptedImageTypes.includes(file.type), {
            message: "Invalid image file type",
          }),
        exifMetadata: z.object({
          height: z.number(),
          width: z.number(),
          model: z.string().nullable(),
          aperture: z.number().nullable(),
          focalLength: z.number().nullable(),
          exposureTime: z.number().nullable(),
          iso: z.number().nullable(),
          flash: z.string().nullable(),
        }),
      })
    : z.any();

export type AcceptedImageUploads = z.infer<typeof AcceptedImageTypeSchema>;
export type AcceptedCoverImageUploads = z.infer<
  typeof AcceptedCoverImageSchema
>;

export type UploadMetadata = {
  model?: string;
  aperture?: number;
  focalLength?: number;
  exposureTime?: number;
  iso?: number;
  flash?: string;
  width?: number;
  height?: number;
};

export type UploadImageResponse = {
  id: number;
  url: string;
  fileName: string;
};

export type FileWithMetadata = {
  file: File;
  metadata: UploadMetadata | null;
};

export type UploadImageArgs = {
  files: FileWithMetadata[];
  userId: string;
  isPortfolio?: boolean;
  isProfilePic?: boolean;
};

export type FileWithMetadataNew = {
  fileName: string;
  url: string;
  metadata: UploadMetadata | null;
};

export type UploadImageNewArgs = {
  files: FileWithMetadataNew[];
  userId: string;
  isPortfolio?: boolean;
  isProfilePic?: boolean;
};

export type UploadedImage = {
  id: number;
  url: string;
  fileName: string;
};

export type UploadImageResult = {
  status: string;
  message: string;
  images?: UploadedImage[];
};
export type InsertUserImage = {
  userId: string;
  url: string;
  fileName: string;
  blurDataUrl?: string;
  width?: number;
  height?: number;
  isPortfolio?: boolean;
  isProfilePic?: boolean;
  metadata?: UploadMetadata | null;
};
