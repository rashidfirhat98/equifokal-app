"use client"

import { z } from "zod";

const acceptedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "image/gif",
];

export const AcceptedImageTypeSchema = typeof window !== 'undefined' ?
  z.instanceof(FileList)
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

export const AcceptedCoverImageSchema = typeof window !== 'undefined' ? z.object({
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
}) : z.any();

export type AcceptedImageUploads = z.infer<typeof AcceptedImageTypeSchema>;
export type AcceptedCoverImageUploads = z.infer<typeof AcceptedCoverImageSchema>;
