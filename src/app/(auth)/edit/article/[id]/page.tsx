import { fetchArticlePost, fetchUserSession } from "@/app/article/actions";
import { fetchUserGalleriesList } from "@/app/gallery/actions";

import ArticleForm from "@/components/ArticleForm";
import { notFound, unauthorized } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const user = await fetchUserSession();
  if (!user) return unauthorized();

  const { id } = await params;

  const { article } = await fetchArticlePost(id);
  if (!article || article.user.id !== user.id) return notFound();

  const galleriesRes = await fetchUserGalleriesList(user.id);
  const { galleries } = galleriesRes;

  return (
    <section className="mx-2 pt-3">
      <h1 className="heading-2 my-8">Edit article</h1>
      <ArticleForm galleries={galleries} existingArticle={article} />
    </section>
  );
}
