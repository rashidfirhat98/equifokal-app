import * as exifr from "exifr";

export type ExifMetadata = {
  height: number;
  width: number;
  model: string | null;
  aperture: number | null;
  focalLength: number | null;
  exposureTime: number | null;
  iso: number | null;
  flash: string | null;
};

export type PhotoDetails = {
  file: File;
  exifMetadata: ExifMetadata;
};

export const extractPhotoDetails = (file: File): Promise<PhotoDetails> => {
  return new Promise((resolve) => {
    exifr
      .parse(file)
      .then((metadata) => {
        metadata = metadata || {};

        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          resolve({
            file,
            exifMetadata: {
              height: metadata.ImageHeight ?? img.height,
              width: metadata.ImageWidth ?? img.width,
              model: metadata.Model ?? null,
              aperture: metadata.FNumber ?? null,
              focalLength: metadata.FocalLength ?? null,
              exposureTime: metadata.ExposureTime ?? null,
              iso: metadata.ISO ?? null,
              flash: metadata.Flash ?? null,
            },
          });
        };
      })
      .catch(() => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
          resolve({
            file,
            exifMetadata: {
              height: img.height,
              width: img.width,
              model: null,
              aperture: null,
              focalLength: null,
              exposureTime: null,
              iso: null,
              flash: null,
            },
          });
        };
      });
  });
};
