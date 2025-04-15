import { z } from "zod";

const acceptedImageTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "image/gif",
];

export const AcceptedImageTypeSchema = z.object({
  img_uploads: z
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
    ),
});

export const AcceptedCoverImageSchema = z.object({
  file: z.instanceof(File).refine((file) => acceptedImageTypes.includes(file.type), { message: "invalid image file type" }),
  exifMetadata: z.object({
    height: z.number(),
    width: z.number(),
    model: z.string().optional().nullable(),
    aperture: z.number().optional().nullable(),
    focalLength: z.number().optional().nullable(),
    exposureTime: z.number().optional().nullable(),
    iso: z.number().optional().nullable(),
    flash: z.string().optional().nullable(),
  })


})

export type AcceptedImageUploads = z.infer<typeof AcceptedImageTypeSchema>;
