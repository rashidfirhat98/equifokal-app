import ArticleList from "@/components/ArticleList";
import React from "react";
import { unauthorized } from "next/navigation";
import { fetchUserArticleList } from "../server-actions/articles";
import { getCurrentUser } from "../server-actions/user";

export default async function ArticleListPage() {
  const user = getCurrentUser();
  if (!user) {
    return unauthorized();
  }

  const res = await fetchUserArticleList();
  const { articles, nextCursor } = res;
  if (!articles?.length) {
    return <div>No articles found</div>;
  }
  return (
    <>
      <section className="mx-2 pt-3">
        <h1 className="heading-2 my-8">Articles</h1>
        <h2 className="heading-5 mt-10">Your Articles</h2>
      </section>
      <ArticleList initialArticles={articles} initialCursor={nextCursor} />
    </>
  );
}
