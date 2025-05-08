"use client";

import { Photo } from "@/models/Images";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect, useCallback } from "react";

type Props = {
  userId: string;
};

const PhotoList = ({ userId }: Props) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);
  const isFetchingRef = useRef(false);
  const hasFetched = useRef(false);

  const fetchMoreImages = useCallback(async () => {
    if (isFetchingRef.current || (hasLoaded && !nextCursor)) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/user/photos?userId=${userId}&cursor=${nextCursor ?? ""}&limit=10`
      );
      const data = await res.json();

      setPhotos((prev) => [...prev, ...data.photos]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
      isFetchingRef.current = false;
    }
  }, [nextCursor, hasLoaded, userId]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchMoreImages();
      hasFetched.current = true;
    }
  }, [fetchMoreImages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && nextCursor) {
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
  }, [loading, fetchMoreImages, nextCursor]);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-8 gap-8 my-4">
      {!hasLoaded ? (
        <div className="col-span-full text-center py-8">
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        </div>
      ) : (
        photos.map((photo) => (
          <div key={photo.id} className="flex flex-col items-center">
            <div className="relative aspect-[1] w-full">
              <Image
                src={photo.src.large}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 30vw, (max-width: 1200px) 10vw, 200px"
                className="rounded-md aspect-square object-cover"
              />
            </div>
            <p className="small my-2">{photo.alt || "Untitled"}</p>
          </div>
        ))
      )}

      <div ref={loaderRef} className="loader flex items-center justify-center">
        {loading && hasLoaded && (
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        )}
      </div>
    </div>
  );
};

export default PhotoList;
