"use client";

import { GalleriesResults, Gallery } from "@/models/Gallery";
import GalleryCard from "./GalleryCard";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  initialGalleries: Gallery[] | undefined;
  initialCursor: number | null;
};

export default function GalleryList({
  initialGalleries,
  initialCursor,
}: Props) {
  const [galleries, setGalleries] = useState<Gallery[]>(initialGalleries || []);
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
      const res = await fetch(
        `/api/user/galleries?cursor=${nextCursor}&limit=10`
      );
      const data = await res.json();
      console.log("Fetched nextCursor:", data.nextCursor);

      setGalleries((prev) => [...prev, ...data.galleries]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [nextCursor]);

  // Update the ref whenever the state changes
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
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 my-3">
      {galleries &&
        galleries.map((gallery) => (
          <Link key={gallery.id} href={`/gallery/${gallery.id}`}>
            <GalleryCard key={gallery.id} gallery={gallery} />
          </Link>
        ))}
      <div ref={loaderRef} className="loader flex items-center justify-center">
        {loading && (
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        )}
      </div>
    </section>
  );
}
