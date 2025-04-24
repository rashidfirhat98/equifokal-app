import { GalleriesResultsInfinite } from "@/models/Gallery";
import ArticleForm from "@/components/ArticleForm";
import { getUserGalleries } from "../../gallery/actions";

const galleriesRes = await getUserGalleries();

const { galleries } = await galleriesRes.json();

export default function CreateArticlePage() {
  return (
    <>
      <h1 className="heading-2 my-8">Create an article</h1>
      <ArticleForm galleries={galleries} />
    </>
  );
}
