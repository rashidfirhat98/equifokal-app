import { notFound } from "next/navigation";
import { getArticleById } from "../actions";

export default async function ArticleByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = (await params) as { id: string };

  const res = await getArticleById(id);

  if (res.status === 404) {
    return notFound();
  }
  const { article } = await res.json();
  console.log(article);

  return (
    <div>
      <h1 className="heading-1">{article.title}</h1>
    </div>
  );
}
