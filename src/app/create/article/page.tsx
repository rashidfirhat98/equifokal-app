import { getGalleries } from "@/app/create/article/actions";
import {  GalleriesResultsInfinite } from "@/models/Gallery";
import ArticleForm from "@/components/ArticleForm";

const galleriesRes: GalleriesResultsInfinite | undefined = await getGalleries({});
console.log(galleriesRes)
export default function CreateArticlePage() {
  return (
    <ArticleForm galleries={galleriesRes?.galleries}/>
  )
}
