"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gallery } from "@/models/Gallery";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./ui/carousel";

type Props = {
  gallery: Gallery;
};

export default function GalleryCard({ gallery }: Props) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle>{gallery.title}</CardTitle>
        {gallery.description && (
          <p className="text-sm text-gray-500">{gallery.description}</p>
        )}
      </CardHeader>

      {/* Gallery Images */}
      <CardContent>
      { gallery.images.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {gallery.images.map((image) => (
            <div key={image.id} className="relative aspect-square w-full">
              <Image
                src={image.src.large}
                alt={image.alt}
                fill
                className="rounded-md object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No images available.</p>
      )}

      </CardContent>

      {/* Footer (Optional for Actions) */}
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <span>{gallery.images.length} images</span>
        <span>{new Date(gallery.createdAt).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );
}
