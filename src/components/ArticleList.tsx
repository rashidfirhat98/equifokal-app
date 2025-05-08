"use client";

import { Article } from "@/models/Article";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ProfilePictureIcon from "./ProfilePictureIcon";

type Props = {
  userId: string;
};

export default function ArticleList({ userId }: Props) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const didMountRef = useRef(false);
  const isFetchingRef = useRef(false);
  const hasFetched = useRef(false);

  const fetchMoreArticles = useCallback(async () => {
    if (isFetchingRef.current) return;

    if (hasLoaded && nextCursor === null) return;

    isFetchingRef.current = true;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/user/articles?userId=${userId}&cursor=${
          nextCursor ?? ""
        }&limit=10`
      );
      const data = await res.json();
      setArticles((prev) => [...prev, ...data.articles]);
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
      fetchMoreArticles();
      hasFetched.current = true;
    }
  }, [fetchMoreArticles]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && nextCursor) {
          fetchMoreArticles();
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
  }, [nextCursor, loading, fetchMoreArticles]);
  return (
    <>
      <section className="px-2 mt-3 pb-3">
        {!hasLoaded ? (
          <div className="col-span-full text-center py-8">
            <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
          </div>
        ) : articles.length > 0 ? (
          articles.map((article) => (
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
                      <div className="relative aspect-[5/3]">
                        <Image
                          fill
                          alt={article.coverImage.alt}
                          src={article.coverImage.url}
                          sizes="(max-width: 768px) 25vw, (max-width: 1200px) 5vw, 200px"
                          className="object-cover"
                        />
                      </div>
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
                    profilePic={article.profilePic}
                    width={30}
                    height={30}
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
          ))
        ) : (
          <div className="text-center large">No article found</div>
        )}
        <div ref={loaderRef} className="loader my-6">
          {loading && hasLoaded && (
            <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
          )}
        </div>
      </section>
    </>
  );
}
