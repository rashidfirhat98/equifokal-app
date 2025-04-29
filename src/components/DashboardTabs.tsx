import GalleryForm from "./GalleryForm";
import GalleryList from "./GalleryList";
import Portfolio from "./Portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ArticleList from "./ArticleList";
import {
  fetchUserArticleList,
  fetchUserGalleriesList,
  fetchUserImages,
  fetchUserPortfolioImages,
} from "@/app/dashboard/actions";

export default async function DashboardTabs() {
  const photosRes = await fetchUserImages();
  const galleriesRes = await fetchUserGalleriesList();
  const articlesRes = await fetchUserArticleList();
  const portfolioRes = await fetchUserPortfolioImages();

  const { galleries, nextCursor } = galleriesRes;
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
        <Portfolio
          initialPhotos={portfolioRes.photos}
          initialCursor={portfolioRes.nextCursor}
        />
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
        {articlesRes.articles.length && articlesRes.articles.length > 0 ? (
          <ArticleList
            initialArticles={articlesRes.articles}
            initialCursor={articlesRes.nextCursor}
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
