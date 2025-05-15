"use client";

import { SetStateAction, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function FollowButton({
  followerId,
  followingId,
  isFollowingInitial,
  onFollowToggle,
}: {
  followerId: string;
  followingId: string;
  isFollowingInitial?: boolean;
  onFollowToggle?: (newState: boolean) => void;
}) {
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial ?? false);
  const [loading, setLoading] = useState(false);

  async function toggleFollow() {
    setLoading(true);
    await fetch("/api/follow", {
      method: isFollowing ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId, followingId }),
    });

    const newState = !isFollowing;
    setIsFollowing(newState);
    onFollowToggle?.(newState);
    setLoading(false);
  }

  return (
    <>
      {followerId !== followingId && (
        <Button
          onClick={toggleFollow}
          variant={isFollowing ? "outline" : "default"}
          disabled={loading}
        >
          {isFollowing ? "Unfollow" : "Follow"}
          {loading && (
            <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
          )}
        </Button>
      )}
    </>
  );
}
