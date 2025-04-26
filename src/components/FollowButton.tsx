"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function FollowButton({
  followerId,
  followingId,
  isFollowingInitial,
}: {
  followerId: string;
  followingId: string;
  isFollowingInitial: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);

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
