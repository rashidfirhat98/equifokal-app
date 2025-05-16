import { notFound } from "next/navigation";

import ArticleSection from "@/components/ArticleSection";
import { fetchArticlePost, fetchUserSession } from "../actions";

export default async function ArticleByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await fetchUserSession();

  const res = await fetchArticlePost(id);

  const article = res?.article;

  if (!article) {
    return notFound();
  }

  return <ArticleSection article={article} currentUserId={user?.id} />;
}
