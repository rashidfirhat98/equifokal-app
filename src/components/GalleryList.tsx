"use client";

import { Gallery } from "@/models/Gallery";
import GalleryCard from "./GalleryCard";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import GalleryForm from "./GalleryForm";

type Props = {
  userId: string;
};

export default function GalleryList({ userId }: Props) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);
  const isFetchingRef = useRef(false);
  const hasFetched = useRef(false);

  const fetchMoreGalleries = useCallback(async () => {
    if (isFetchingRef.current || (hasLoaded && !nextCursor)) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/user/galleries?userId=${userId}&cursor=${
          nextCursor ?? ""
        }&limit=10`
      );
      const data = await res.json();

      setGalleries((prev) => [...prev, ...data.galleries]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
      setHasLoaded(true);
      isFetchingRef.current = false;
    }
  }, [nextCursor, userId, hasLoaded]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchMoreGalleries();
      hasFetched.current = true;
    }
  }, [fetchMoreGalleries]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && nextCursor) {
          fetchMoreGalleries();
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
  }, [loading, fetchMoreGalleries, nextCursor]);
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-3">
      {!hasLoaded ? (
        <div className="col-span-full text-center py-8">
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        </div>
      ) : galleries ? (
        galleries.map((gallery) => (
          <Link key={gallery.id} href={`/gallery/${gallery.id}`}>
            <GalleryCard key={gallery.id} gallery={gallery} />
          </Link>
        ))
      ) : (
        <GalleryForm />
      )}
      <div ref={loaderRef} className="loader flex items-center justify-center">
        {loading && hasLoaded && (
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        )}
      </div>
    </section>
  );
}
