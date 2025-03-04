import { notFound } from "next/navigation";
import Image from "next/image";
import env from "@/lib/env";
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

export default async function GalleryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_CLIENT_URL}/api/gallery/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch gallery:", res.statusText);
      return notFound();
    }

    const gallery: Gallery = await res.json();

    return (
      <div className="flex flex-col items-center min-h-screen p-4">
        <h1 className="text-3xl font-bold mb-4">{gallery.title}</h1>
        {gallery.description && (
          <p className="text-gray-600 mb-8">{gallery.description}</p>
        )}
        <div className="relative w-full max-w-4xl">
          <GalleryCarousel images={gallery.images} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return <h2 className="m-4 text-2xl font-bold">Gallery not found</h2>;
  }
}

function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  if (images.length === 0) {
    return <p className="text-center">No images in this gallery</p>;
  }

  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image) => (
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
        {images.map((image) => (
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
  );
}
