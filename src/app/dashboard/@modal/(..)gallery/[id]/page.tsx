"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

interface GalleryImage {
  id: number;
  url: string;
  width: number;
  height: number;
  alt: string;
  src: { large: string };
  metadata?: {
    model?: string;
    aperture?: string;
    focalLength?: string;
    exposureTime?: string;
    iso?: string;
    flash?: string;
    height?: number;
    width?: number;
  };
}

interface Gallery {
  id: number;
  title: string;
  description?: string;
  images: GalleryImage[];
  createdAt: string;
  updatedAt: string;
}

export default function GalleryModal() {
  const router = useRouter();
  const params = useParams();

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch(`/api/gallery/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch gallery");

        const data = await res.json();
        setGallery(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, [params.id]);

  if (loading) return null;
  if (error || !gallery) return null;

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{gallery.title}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {gallery.images.map((image) => (
                <CarouselItem key={image.id}>
                  <Card className="p-1">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={image.src.large}
                        alt={image.alt}
                        fill
                        className="object-contain rounded-lg"
                        priority
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>

          {/* Thumbnail strip */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {gallery.images.map((image) => (
              <div
                key={image.id}
                className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden"
              >
                <Image
                  src={image.src.large}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 