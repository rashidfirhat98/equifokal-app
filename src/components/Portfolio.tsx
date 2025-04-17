"use client"

import { useEffect, useRef, useState } from "react";
import fetchImages from "@/lib/fetchImages";
import type { ImagesResults, Photo } from "@/models/Images";
import ImgContainer from "./ImgContainer";
import addBlurredDataUrls from "@/lib/getBase64";
import getPrevNextPages from "@/lib/getPrevNextPages";
import Footer from "./Footer";
import { getUserImages } from "@/app/portfolio/actions";
import { Loader2 } from "lucide-react";

type Props = {
  topic?: string | undefined;
  page?: string | undefined;
};

export default function Portfolio({ topic = "curated", page }: Props) {

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const hasFetched = useRef(false);

  const fetchMoreImages = async () => {
    // if (loading || !nextCursor) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/portfolio?cursor=${nextCursor ?? ""}&limit=10`);
      const data = await res.json();

      setPhotos((prev) => [...prev, ...data.photos]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current && !photos.length) {
      hasFetched.current = true;
      fetchMoreImages();
    }
  }, [photos.length]);

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

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [nextCursor, loading]);

  return (
    <>
      <section className="px-2 my-3 grid grid-cols-gallery auto-rows-[10px]">
        {photos.map((photo) => (
          <ImgContainer key={photo.id} photo={photo} />
        ))}
      </section>
      <div ref={loaderRef} className="loader">
        {loading && <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />}
      </div>
    </>
  );
}
