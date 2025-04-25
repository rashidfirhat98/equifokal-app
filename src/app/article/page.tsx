import ArticleList from "@/components/ArticleList";
import React from "react";
import { getCurrentUser } from "../dashboard/actions";
import { unauthorized } from "next/navigation";
import { getUserArticles } from "./actions";

export default async function ArticleListPage() {
  const user = getCurrentUser();
  if (!user) {
    return unauthorized();
  }

  const res = await getUserArticles();
  const { articles, nextCursor } = await res.json();
  if (!articles?.length) {
    return <div>No articles found</div>;
  }
  return (
    <>
      <h1 className="heading-2 my-8">Articles</h1>
      <section className="px-2 my-3">
        <h2 className="heading-5 mt-10">Your Articles</h2>
        <ArticleList initialArticles={articles} initialCursor={nextCursor} />
      </section>
    </>
  );
}
