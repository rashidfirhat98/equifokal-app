"use client";

import GalleryList from "./GalleryList";
import Portfolio from "./Portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ArticleList from "./ArticleList";
import { UserDetails } from "@/models/User";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import UserList from "./UserList";
import { useSessionContext } from "./SessionContext";
import { useSession } from "next-auth/react";

type Props = {
  user?: UserDetails;
  currentUser?: UserDetails;
};

export default function DashboardTabs({ user, currentUser }: Props) {
  const { data: session } = useSession();
  const sessionUser = user ?? session?.user;

  if (!sessionUser) {
    return <p>Error: User not found.</p>;
  }

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
          <Portfolio userId={sessionUser.id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="gallery">
        <Suspense fallback={<LoadingSpinner />}>
          <GalleryList userId={sessionUser.id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="article">
        <Suspense fallback={<LoadingSpinner />}>
          <ArticleList userId={sessionUser.id} />
        </Suspense>
      </TabsContent>
      <TabsContent value="followers">
        <Suspense fallback={<LoadingSpinner />}>
          <UserList
            userId={sessionUser.id}
            currentUserId={currentUser?.id ?? session?.user.id}
            type="follower"
          />
        </Suspense>
      </TabsContent>
      <TabsContent value="following">
        <Suspense fallback={<LoadingSpinner />}>
          <UserList
            userId={sessionUser.id}
            currentUserId={currentUser?.id ?? session?.user.id}
            type="following"
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
