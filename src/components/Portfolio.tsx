"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/models/Images";
import ImgContainer from "./ImgContainer";
import { Loader2 } from "lucide-react";

type Props = {
  initialPhotos: Photo[];
  initialCursor: number | null;
};

export default function Portfolio({ initialPhotos, initialCursor }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [nextCursor, setNextCursor] = useState<number | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const hasFetched = useRef(false);

  const fetchMoreImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/portfolio?cursor=${nextCursor ?? ""}&limit=10`
      );
      const data = await res.json();

      setPhotos((prev) => [...prev, ...data.photos]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, [nextCursor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && nextCursor && !loading) {
          fetchMoreImages();
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [nextCursor, loading, fetchMoreImages]);

  return (
    <>
      <section className="px-2 my-3 grid grid-cols-gallery auto-rows-[10px]">
        {photos.map((photo) => (
          <ImgContainer key={photo.id} photo={photo} />
        ))}
      </section>
      <div ref={loaderRef} className="loader">
        {loading && (
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        )}
      </div>
    </>
  );
}
