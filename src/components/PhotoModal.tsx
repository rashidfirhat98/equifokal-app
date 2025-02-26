"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Photo } from "@/models/Images";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PhotoModal({ photo }: { photo: Photo }) {
  const router = useRouter();
  const params = useParams();
  //   const [photo, setPhoto] = useState<Photo | null>(null);

  console.log(params.id);

  //   useEffect(() => {
  //     async function fetchPhoto() {
  //       try {
  //         const res = await fetch(`/api/photo/${params.id}`);
  //         if (!res.ok) throw new Error();
  //         const data = await res.json();
  //         setPhoto(data);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }

  //     fetchPhoto();
  //   }, [params.id]);

  // Close modal and navigate back
  const handleClose = () => router.back();

  if (!photo) {
    return null; // Avoid rendering if no data yet
  }
  return (
    <Dialog open onOpenChange={handleClose}>
      {photo && (
        <DialogContent className="min-w-">
          <DialogTitle>{photo.alt}</DialogTitle>
          <div className="flex flex-row">
            <div className="img-container">
              <Image
                src={photo.src.large}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto"
              />
            </div>
            <div>Description box</div>
          </div>

          <DialogDescription>{photo.alt}</DialogDescription>
        </DialogContent>
      )}
    </Dialog>
  );
}
