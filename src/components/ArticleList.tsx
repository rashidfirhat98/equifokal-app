"use client";

import { Article } from "@/models/Article";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import ProfilePictureIcon from "./ProfilePictureIcon";

type Props = {
  initialArticles: Article[];
  initialCursor: number | null;
};

export default function ArticleList({ initialArticles, initialCursor }: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [nextCursor, setNextCursor] = useState<number | null>(initialCursor);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const isFetchingRef = useRef(false);
  const didMountRef = useRef(false);
  const lastCursorRef = useRef<number | null>(null);
  const nextCursorRef = useRef<number | null>(initialCursor);

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
      <section className="px-2 mt-3 pb-3">
        {articles &&
          articles.map(
            (article) => (
              console.log("Image found:", article.coverImage),
              (
                <Link key={article.id} href={`/article/${article.id}`}>
                  <div className="my-3 p-3 md:p-6 border-b-2 ">
                    <div className="grid grid-cols-12 ">
                      <div className="flex justify-between flex-col col-span-8  ">
                        <div>
                          <h1 className="heading-4 font-bold md:heading-2">
                            {article.title}
                          </h1>
                          <p className="muted md:lead">{article.description}</p>
                        </div>
                      </div>
                      <div className="col-span-4 ml-4 md:mx-6">
                        {article.coverImage && (
                          <Image
                            width={article.coverImage.width}
                            height={article.coverImage.height}
                            alt={article.coverImage.alt}
                            src={article.coverImage.url}
                          />
                        )}
                      </div>
                      {/* <div className="col-span-1 flex flex-col justify-center items-end  py-6 ml-6">
                  <p className="muted">Publish</p>
                  <p className="muted">Edit</p>
                  <p className="muted">Delete</p>
                </div> */}
                    </div>
                    <div className="flex pt-3 items-center gap-4">
                      <ProfilePictureIcon
                        profilePicURL={article.profilePic}
                        width={40}
                        height={40}
                      />
                      <div>
                        <p className="text-sm font-semibold md:text-lg">
                          By {article.createdBy}
                        </p>
                        <p className="text-xs text-muted-foreground md:text-sm">
                          {article.createdAt}
                        </p>
                      </div>
                      {/* <Button variant={"outline"}>Follow</Button> */}
                    </div>
                  </div>
                </Link>
              )
            )
          )}
        <div ref={loaderRef} className="loader my-6">
          {loading && (
            <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
          )}
        </div>
      </section>
    </>
  );
}
