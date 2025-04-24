import { GalleriesResultsInfinite } from "@/models/Gallery";
import ArticleForm from "@/components/ArticleForm";
import { getUserGalleries } from "../../gallery/actions";

const galleriesRes = await getUserGalleries();

const { galleries } = await galleriesRes.json();

export default function CreateArticlePage() {
  return <ArticleForm galleries={galleries} />;
}
