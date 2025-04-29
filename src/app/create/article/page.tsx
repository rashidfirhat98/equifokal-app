import { fetchUserGalleriesList } from "@/app/gallery/actions";
import ArticleForm from "@/components/ArticleForm";

export default async function CreateArticlePage() {
  const galleriesRes = await fetchUserGalleriesList();
  const { galleries } = galleriesRes;
  return (
    <section className="mx-2 pt-3">
      <h1 className="heading-2 my-8">Create an article</h1>
      <ArticleForm galleries={galleries} />
    </section>
  );
}
