"use client";

import Link from "next/link";
import ProfilePictureIcon from "./ProfilePictureIcon";
import { User } from "@prisma/client";
import FollowButton from "./FollowButton";

type Props = {
  user: User | Follower;
  currentUserId?: string;
  isFollowingInitial?: boolean;
};

type Follower = {
  id: string;
  name: string;
  profilePic: string;
  bio?: string;
};

export default function UserListItem({
  user,
  currentUserId,
  isFollowingInitial = false,
}: Props) {
  return (
    <>
      <div className="flex items-center gap-2">
        <ProfilePictureIcon
          profilePic={user.profilePic}
          width={30}
          height={30}
        />
        <div className="text-container flex-1 min-w-0">
          <Link href={`/profile/${user.id}`}>
            <p className="text-sm font-semibold md:text-lg">{user.name}</p>
            <p className=" text-xs text-muted-foreground md:text-sm min-h-5 truncate">
              {user.bio || ""}
            </p>
          </Link>
        </div>

        {currentUserId && currentUserId !== user.id && (
          <FollowButton
            followerId={currentUserId}
            followingId={user.id}
            isFollowingInitial={isFollowingInitial}
          />
        )}
      </div>
    </>
  );
}
