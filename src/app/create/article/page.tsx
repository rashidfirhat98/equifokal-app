import ArticleForm from "@/components/ArticleForm";
import { getUserGalleries } from "../../gallery/actions";

export default async function CreateArticlePage() {
  const galleriesRes = await getUserGalleries();
  const { galleries } = await galleriesRes.json();
  return (
    <section className="mx-2 pt-3">
      <h1 className="heading-2 my-8">Create an article</h1>
      <ArticleForm galleries={galleries} />
    </section>
  );
}
