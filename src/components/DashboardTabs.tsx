import { GalleriesResults, GalleriesResultsInfinite } from "@/models/Gallery";
import GalleryForm from "./GalleryForm";
import GalleryList from "./GalleryList";
import Portfolio from "./Portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getUserGalleries, getUserImages } from "@/app/dashboard/actions";
import { ImagesResults } from "@/models/Images";
import ArticleList from "./ArticleList";
import { getUserArticles } from "@/app/article/actions";

export default async function DashboardTabs() {
  const photosRes: ImagesResults | undefined = await getUserImages();
  const galleriesRes = await getUserGalleries();
  const articlesRes = await getUserArticles();
  const { galleries, nextCursor } = await galleriesRes.json();
  const articlesBody = await articlesRes.json();
  return (
    <Tabs orientation="vertical" defaultValue="portfolio" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        <TabsTrigger value="gallery">Gallery</TabsTrigger>
        <TabsTrigger value="article">Article</TabsTrigger>
        <TabsTrigger value="followers">Followers</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>
      <TabsContent value="portfolio">
        <Portfolio />
      </TabsContent>
      <TabsContent value="gallery">
        {galleries && galleries.length > 0 ? (
          <GalleryList
            initialGalleries={galleries}
            initialCursor={nextCursor}
          />
        ) : (
          <GalleryForm photos={photosRes} />
        )}
      </TabsContent>
      <TabsContent value="article">
        {articlesBody.articles.length && articlesBody.articles.length > 0 ? (
          <ArticleList
            initialArticles={articlesBody.articles}
            initialCursor={articlesBody.nextCursor}
          />
        ) : (
          <div className="text-center">No articles found</div>
        )}
      </TabsContent>
      <TabsContent value="followers">
        <div>Insert Follower list here</div>
      </TabsContent>
    </Tabs>
  );
}
