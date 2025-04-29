"use client";

import { Photo } from "@/models/Images";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

type Props = {
  initialPhotos: Photo[];
  initialCursor: number | null;
};

const PhotoList = ({ initialPhotos, initialCursor }: Props) => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [nextCursor, setNextCursor] = useState<number | null>(initialCursor);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);
  const isFetchingRef = useRef(false);
  const lastCursorRef = useRef<number | null>(null);
  const nextCursorRef = useRef<number | null>(initialCursor);

  const fetchMoreImages = useCallback(async () => {
    if (
      isFetchingRef.current ||
      !nextCursor ||
      nextCursor === lastCursorRef.current
    )
      return;

    isFetchingRef.current = true;
    lastCursorRef.current = nextCursor;
    setLoading(true);

    try {
      console.log("Requesting with cursor:", nextCursor);
      const res = await fetch(`/api/user/photos?cursor=${nextCursor}&limit=10`);
      const data = await res.json();
      console.log("Fetched nextCursor:", data.nextCursor);

      setPhotos((prev) => [...prev, ...data.photos]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [nextCursor]);

  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        console.log("Observer sees cursor:", nextCursorRef.current);

        if (
          didMountRef.current &&
          first.isIntersecting &&
          nextCursorRef.current &&
          !loading &&
          nextCursorRef.current !== lastCursorRef.current
        ) {
          fetchMoreImages();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    didMountRef.current = true;

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [loading, fetchMoreImages]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-8 my-4">
      {photos.map((photo) => (
        <div key={photo.id} className="flex flex-col items-center">
          <Image
            src={photo.src.large}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            className="rounded-md aspect-square object-cover"
          />
          <p className="small my-2">{photo.alt || "Untitled"}</p>
        </div>
      ))}

      <div ref={loaderRef} className="loader flex items-center justify-center">
        {loading && (
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        )}
      </div>
    </div>
  );
};

export default PhotoList;
