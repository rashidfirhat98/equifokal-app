import GalleryList from "./GalleryList";
import Portfolio from "./Portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ArticleList from "./ArticleList";
import {
  fetchFollowersList,
  fetchFollowingList,
} from "@/app/dashboard/actions";
import { UserDetails } from "@/models/User";
import UserList from "./UserList";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  user: UserDetails;
};

export default async function DashboardTabs({ user }: Props) {
  const followerRes = await fetchFollowersList(user.id);
  const followingRes = await fetchFollowingList(user.id);
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
        <Suspense fallback={<LoadingSpinner />}>
          <Portfolio userId={user.id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="gallery">
        <Suspense fallback={<LoadingSpinner />}>
          <GalleryList userId={user.id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="article">
        <Suspense fallback={<LoadingSpinner />}>
          <ArticleList userId={user.id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="followers">
        <Suspense fallback={<LoadingSpinner />}>
          <UserList users={followerRes} />
        </Suspense>
      </TabsContent>
      <TabsContent value="following">
        <Suspense fallback={<LoadingSpinner />}>
          <UserList users={followingRes} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
