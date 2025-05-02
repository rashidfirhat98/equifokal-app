import GalleryForm from "./GalleryForm";
import GalleryList from "./GalleryList";
import Portfolio from "./Portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ArticleList from "./ArticleList";
import {
  fetchFollowersList,
  fetchFollowingList,
  fetchUserArticleList,
  fetchUserGalleriesList,
  fetchUserImages,
  fetchUserPortfolioImages,
} from "@/app/dashboard/actions";
import { User } from "next-auth";

type Props = {
  user: User;
};

export default async function DashboardTabs({ user }: Props) {
  const photosRes = await fetchUserImages(user.id);
  const galleriesRes = await fetchUserGalleriesList(user.id);
  const articlesRes = await fetchUserArticleList(user.id);
  const portfolioRes = await fetchUserPortfolioImages(user.id);
  const followerRes = await fetchFollowersList(user.id);
  const followingRes = await fetchFollowingList(user.id);

  console.log("followerRes:", followerRes);
  console.log("followingRes:", followingRes);
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
          userId={user.id}
        />
      </TabsContent>
      <TabsContent value="gallery">
        {galleries && galleries.length > 0 ? (
          <GalleryList
            initialGalleries={galleries}
            initialCursor={nextCursor}
            userId={user.id}
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
            userId={user.id}
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
