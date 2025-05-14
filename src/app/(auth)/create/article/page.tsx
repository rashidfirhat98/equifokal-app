import { fetchUserGalleriesList } from "@/app/gallery/actions";
import ArticleForm from "@/components/ArticleForm";
import { unauthorized } from "next/navigation";
import { fetchUserSession } from "../../dashboard/actions";

export default async function CreateArticlePage() {
  const user = await fetchUserSession();

  if (!user) {
    return unauthorized();
  }
  const galleriesRes = await fetchUserGalleriesList(user.id);
  const { galleries } = galleriesRes;
  return (
    <section className="mx-2 pt-3">
      <h1 className="heading-2 my-8">Create an article</h1>
      <ArticleForm galleries={galleries} />
    </section>
  );
}
