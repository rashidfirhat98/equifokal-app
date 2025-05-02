"use client";

import { SetStateAction } from "react";
import { Button } from "./ui/button";

export default function FollowButton({
  followerId,
  followingId,
  isFollowing,
  setIsFollowing,
}: {
  followerId: string;
  followingId: string;
  isFollowing: boolean;
  setIsFollowing: React.Dispatch<SetStateAction<boolean>>;
}) {
  async function toggleFollow() {
    await fetch("/api/follow", {
      method: isFollowing ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId, followingId }),
    });

    setIsFollowing(!isFollowing);
  }

  return (
    <Button
      onClick={toggleFollow}
      variant={isFollowing ? "outline" : "default"}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
