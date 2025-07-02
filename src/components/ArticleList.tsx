"use client";

import { Article } from "@/models/Article";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import ProfilePictureIcon from "./ProfilePictureIcon";
import FollowButton from "./FollowButton";

type Props = {
  userId: string;
  currentUserId?: string;
};

export default function ArticleList({ userId, currentUserId }: Props) {
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
            <div key={article.id}>
              <div className="group relative my-3 p-3 md:p-6 border-b-2 overflow-hidden hidden md:block">
                {/* Slide-on-hover content */}
                <div className="transition-transform duration-300 ease-in-out group-hover:-translate-x-5">
                  <Link href={`/article/${article.id}`}>
                    <div className="grid grid-cols-12 gap-4 items-start">
                      {/* Text */}
                      <div className="col-span-8 flex flex-col justify-between">
                        <div>
                          <h1 className="heading-4 font-bold md:heading-2">
                            {article.title}
                          </h1>
                          <p className="muted md:lead">{article.description}</p>
                        </div>
                      </div>

                      {/* Image */}
                      <div className="col-span-4 ml-4 md:mx-6">
                        {article.coverImage && (
                          <div className="relative aspect-[5/3]">
                            <Image
                              fill
                              alt={article.coverImage.alt}
                              src={article.coverImage.url}
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Author Row */}
                  <div className="flex pt-3 items-center gap-4">
                    <ProfilePictureIcon
                      profilePic={article.user.profilePic}
                      width={30}
                      height={30}
                    />
                    <div>
                      <p className="text-sm font-semibold md:text-lg">
                        By {article.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground md:text-sm">
                        {article.createdAt}
                      </p>
                    </div>
                    {currentUserId && (
                      <FollowButton
                        followerId={article.user.id}
                        followingId={currentUserId}
                        isFollowingInitial={article.user.isFollowing}
                      />
                    )}
                  </div>
                </div>

                {/* Slide-in edit/delete */}
                <div
                  className={`
      absolute top-3 right-3 h-full w-[80px]
      flex flex-col justify-center items-end space-y-2
      opacity-0 translate-x-full pointer-events-none
      group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto
      transition-all duration-300 ease-in-out
    `}
                >
                  <button className="text-sm text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button className="text-sm text-red-600 hover:underline">
                    Delete
                  </button>
                </div>

                {/*Mobile view*/}
              </div>
              <div
                key={article.id}
                className="block md:hidden my-3 p-4 border-b"
              >
                <Link href={`/article/${article.id}`}>
                  <h2 className="text-lg font-bold">{article.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {article.description}
                  </p>

                  {article.coverImage && (
                    <div className="relative aspect-[5/3] mt-3">
                      <Image
                        fill
                        alt={article.coverImage.alt}
                        src={article.coverImage.url}
                        className="object-cover"
                      />
                    </div>
                  )}
                </Link>

                {/* Author */}
                <div className="flex pt-3 items-center gap-3">
                  <ProfilePictureIcon
                    profilePic={article.user.profilePic}
                    width={30}
                    height={30}
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      By {article.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {article.createdAt}
                    </p>
                  </div>
                </div>

                {/* Mobile action buttons (always visible or tucked in menu) */}
                <div className="mt-3 flex gap-4">
                  <button className="text-blue-600 text-sm">Edit</button>
                  <button className="text-red-600 text-sm">Delete</button>
                </div>
              </div>
            </div>
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
