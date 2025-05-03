import { Metadata } from "@prisma/client";

type FileWithMetadata = {
  file: File;
  metadata: ExtractedMetadata | null;
};

type ExtractedUploadData = {
  filesWithMetadata: FileWithMetadata[];
  isPortfolio: boolean;
  isProfilePic: boolean;
};

type ExtractedMetadata = {
  model?: string;
  aperture?: number;
  focalLength?: number;
  exposureTime?: number;
  iso?: number;
  flash?: string;
  width?: number;
  height?: number;
} | null;

export const extractUploadData = (formData: FormData): ExtractedUploadData => {
  const files = formData.getAll("files") as File[]; // Ensure this is an array of File objects

  const filesWithMetadata = files.map((file, index) => {
    const rawMetadata = formData.get(`metadata[${index}]`);
    let metadata: ExtractedMetadata = null;

    if (rawMetadata) {
      try {
        metadata = JSON.parse(rawMetadata.toString());
      } catch (e) {
        console.warn(`Invalid metadata at index ${index}`, rawMetadata);
      }
    }

    return { file, metadata };
  });

  const isPortfolio = formData.get("isPortfolio") === "true";
  const isProfilePic = formData.get("isProfilePic") === "true";

  return {
    filesWithMetadata,
    isPortfolio,
    isProfilePic,
  };
};
