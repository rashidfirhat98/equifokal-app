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
import { UserDetails } from "@/models/User";
import UserList from "./UserList";

type Props = {
  user: UserDetails;
};

export default async function DashboardTabs({ user }: Props) {
  const photosRes = await fetchUserImages(user.id);
  const galleriesRes = await fetchUserGalleriesList(user.id);
  const articlesRes = await fetchUserArticleList(user.id);
  const portfolioRes = await fetchUserPortfolioImages(user.id);
  const followerRes = await fetchFollowersList(user.id);
  const followingRes = await fetchFollowingList(user.id);
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
        {portfolioRes.photos.length > 0 ? (
          <Portfolio
            initialPhotos={portfolioRes.photos}
            initialCursor={portfolioRes.nextCursor}
            userId={user.id}
          />
        ) : (
          <div className="text-center large">No photos found</div>
        )}
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
          <div className="text-center large">No articles found</div>
        )}
      </TabsContent>
      <TabsContent value="followers">
        {followerRes.length > 0 ? (
          <UserList users={followerRes} />
        ) : (
          <div className="text-center large">
            User does not have any followers yet
          </div>
        )}
      </TabsContent>
      <TabsContent value="following">
        {followingRes.length > 0 ? (
          <UserList users={followingRes} />
        ) : (
          <div className="text-center large">
            User is not following anyone yet
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
