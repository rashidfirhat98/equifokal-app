"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Photo } from "@/models/Images";

export default function PhotoModal() {
  const router = useRouter();
  const params = useParams();

  // State for the photo
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch the photo data
  useEffect(() => {
    async function fetchPhoto() {
      try {
        const res = await fetch(`/api/photo/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch photo");

        const data = await res.json();
        setPhoto(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPhoto();
  }, [params.id]);

  if (loading) return null; // Prevent flickering
  if (error || !photo) return null; // Don't show modal if there's an error

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent>
        <DialogTitle>{photo.alt}</DialogTitle>
        <Image
          src={photo.src.large}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="rounded-lg"
        />
        <DialogDescription>{photo.photographer}</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
