
const handleOnchange = async(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    
        if (!file) return;
    



    try {
      let metadata = await exifr.parse(file);
      metadata = metadata || {};

      const img = new window.Image();
      img.src = URL.createObjectURL(file) as string;

      img.onload = () => {
        const exifMetadata = {
          height: metadata.ImageHeight ?? img.height,
          width: metadata.ImageWidth ?? img.width,
          model: metadata.Model ?? null,
          aperture: metadata.FNumber ?? null,
          focalLength: metadata.FocalLength ?? null,
          exposureTime: metadata.ExposureTime ?? null,
          iso: metadata.ISO ?? null,
          flash: metadata.Flash ?? null,
        };

        const photoDetail = {
          file,
          exifMetadata,
        };

        setPhotoDetails([photoDetail]);
        setCoverImage(photoDetail);
        setValue("coverImage", photoDetail, { shouldValidate: true });
      };
    } catch (error) {
      // Fallback: if EXIF fails, just get dimensions
      const img = new window.Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const exifMetadata = {
          height: img.height,
          width: img.width,
          model: null,
          aperture: null,
          focalLength: null,
          exposureTime: null,
          iso: null,
          flash: null,
        };

        const photoDetail = {
          file,
          exifMetadata,
        };

        setPhotoDetails([photoDetail]);
        setCoverImage(photoDetail);
        setValue("coverImage", photoDetail, { shouldValidate: true });
      };
    }
  };