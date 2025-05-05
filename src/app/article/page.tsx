import ArticleList from "@/components/ArticleList";
import React, { Suspense } from "react";
import { unauthorized } from "next/navigation";
import { fetchCurrentUser, fetchUserArticleCount } from "./actions";
import LoadingSpinner from "@/components/LoadingSpinner";

export default async function ArticleListPage() {
  const user = await fetchCurrentUser();
  if (!user) {
    return unauthorized();
  }

  const articleCount = await fetchUserArticleCount(user.id);

  return (
    <section className="mx-2 pt-3">
      <h1 className="heading-2 my-8">Articles</h1>
      {articleCount > 0 && (
        <div>
          <h2 className="heading-5 mt-10">Your Articles</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <ArticleList userId={user.id} />
          </Suspense>
        </div>
      )}
    </section>
  );
}
