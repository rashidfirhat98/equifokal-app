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

export type AcceptedImageUploads = z.infer<typeof AcceptedImageTypeSchema>;
