"use client";

import ArticleList from "@/components/ArticleList";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSessionContext } from "@/components/SessionContext";
import React, { Suspense } from "react";

export default function ArticleListClientPage() {
  const session = useSessionContext();

  if (!session) {
    return <p className="large">User not Found</p>;
  }
  return (
    <section className="mx-2 pt-3">
      <h1 className="heading-2 my-8">Articles</h1>

      <h2 className="heading-5 mt-10">Your Articles</h2>
      <Suspense fallback={<LoadingSpinner />}>
        <ArticleList userId={session.user.id} />
      </Suspense>
    </section>
  );
}
