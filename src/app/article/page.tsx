import ArticleList from "@/components/ArticleList";
import React from "react";

export default function ArticleListPage() {
  return (
    <>
      <h1 className="heading-2 my-8">Articles</h1>
      <section className="px-2 my-3">
        <h2 className="heading-5 mt-10">Your Articles</h2>
        <ArticleList />
      </section>
    </>
  );
}
