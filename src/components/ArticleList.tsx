"use client";

import { Article } from "@/models/Article";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

type Props = {
  initialArticles: Article[];
  initialCursor: string | null;
};

export default function ArticleList({ initialArticles, initialCursor }: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [nextCursor, setNextCursor] = useState<string | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const didMountRef = useRef(false);
  const lastCursorRef = useRef<string | null>(null);
  const nextCursorRef = useRef<string | null>(initialCursor);

  const fetchMoreArticles = useCallback(async () => {
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
      const res = await fetch(
        `/api/articles?cursor=${nextCursor ?? ""}&limit=10`
      );
      const data = await res.json();
      console.log(data);
      setArticles((prev) => [...prev, ...data.articles]);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  }, [nextCursor]);

  useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        console.log("Observer sees cursor:", nextCursor);
        const first = entries[0];
        if (
          didMountRef.current &&
          first.isIntersecting &&
          nextCursorRef.current &&
          !loading &&
          nextCursorRef.current !== lastCursorRef.current
        ) {
          fetchMoreArticles();
        }
        console.log("Observer unobserved cursor:", nextCursor);
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    didMountRef.current = true;

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [nextCursor, loading, fetchMoreArticles]);
  return (
    <>
      <section className="px-2 my-3">
        {articles &&
          articles.map((article) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <div className="my-3 p-6 grid grid-cols-12 border-b-2">
                <div className="flex justify-between flex-col col-span-8 p-6">
                  <div>
                    <h1 className="heading-2">{article.title}</h1>
                    <p className="lead">{article.description}</p>
                  </div>
                  <div className="flex pt-6 items-center gap-4">
                    <Image
                      src={article.profilePic}
                      alt={article.profilePic}
                      loading="lazy"
                      width={50}
                      height={50}
                      className="aspect-square object-cover rounded-full"
                    />
                    <div>
                      <p className="large"> By {article.createdBy}</p>
                      <p className="muted">{article.createdAt}</p>
                    </div>
                    {/* <Button variant={"outline"}>Follow</Button> */}
                  </div>
                </div>
                <div className="col-span-3 py-6 ml-6">
                  {article.coverImage && (
                    <Image
                      width={article.coverImage.width}
                      height={article.coverImage.height}
                      alt={article.coverImage.alt}
                      src={article.coverImage.src.large}
                    />
                  )}
                </div>
                {/* <div className="col-span-1 flex flex-col justify-center items-end  py-6 ml-6">
                  <p className="muted">Publish</p>
                  <p className="muted">Edit</p>
                  <p className="muted">Delete</p>
                </div> */}
              </div>
            </Link>
          ))}
        <div ref={loaderRef} className="loader my-6">
          {loading && (
            <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
          )}
        </div>
      </section>
    </>
  );
}
