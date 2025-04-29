import { notFound } from "next/navigation";

import ArticleSection from "@/components/ArticleSection";
import { fetchArticlePost } from "../actions";

export default async function ArticleByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetchArticlePost(id);

  const article = res?.article;
  console.log(article);

  if (!article) {
    return notFound();
  }

  return <ArticleSection article={article} />;
}
