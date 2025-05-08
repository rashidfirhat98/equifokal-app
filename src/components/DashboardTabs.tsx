import GalleryList from "./GalleryList";
import Portfolio from "./Portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ArticleList from "./ArticleList";
import { UserDetails } from "@/models/User";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

import UserList from "./UserList";

type Props = {
  user: UserDetails;
};

export default async function DashboardTabs({ user }: Props) {
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
          <UserList userId={user.id} type="follower" />
        </Suspense>
      </TabsContent>
      <TabsContent value="following">
        <Suspense fallback={<LoadingSpinner />}>
          <UserList userId={user.id} type="following" />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
