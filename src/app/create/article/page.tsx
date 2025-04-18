import { GalleriesResultsInfinite } from "@/models/Gallery";
import ArticleForm from "@/components/ArticleForm";
import { getGalleries } from "../actions";

const galleriesRes: GalleriesResultsInfinite | undefined = await getGalleries(
  {}
);

export default function CreateArticlePage() {
  return <ArticleForm galleries={galleriesRes?.galleries} />;
}
