"use client";

import { Article } from "@/models/Article";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const hasFetched = useRef(false);

  const fetchMoreArticles = async () => {
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
  };

  useEffect(() => {
    if (!hasFetched.current && !articles.length) {
      hasFetched.current = true;
      fetchMoreArticles();
    }
  }, [articles.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && nextCursor && !loading) {
          fetchMoreArticles();
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
      <section className="px-2 my-3">
        {articles &&
          articles.map((article: any) => (
            <Link key={article.id} href={`/article/${article.id}`}>
              <div className="my-3 p-6 grid grid-cols-3 border-b-2">
                <div className="flex flex-col col-span-2 p-6">
                  <h1 className="heading-3">{article.title}</h1>
                  <p className="muted">{article.description}</p>
                  <p className="large"> By {article.createdBy}</p>
                </div>
                <div className="p-6 ml-6">
                  {article.coverImage && (
                    <Image
                      width={article.coverImage.width}
                      height={article.coverImage.height}
                      alt={article.coverImage.alt}
                      src={article.coverImage.src.large}
                    />
                  )}
                </div>
              </div>
            </Link>
          ))}
      </section>
      <div ref={loaderRef} className="loader my-6">
        {loading && (
          <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
        )}
      </div>
    </>
  );
}
