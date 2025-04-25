import { notFound } from "next/navigation";
import { getArticleById } from "../actions";
import ArticleSection from "@/components/ArticleSection";

export default async function ArticleByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await getArticleById(id);

  if (res.status === 404) {
    return notFound();
  }
  const { article } = await res.json();
  console.log(article);

  if (!article) {
    return <div>Article not found</div>;
  }

  return <ArticleSection article={article} />;
}
