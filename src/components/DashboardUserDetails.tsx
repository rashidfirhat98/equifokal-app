"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { UserDetails } from "@/models/User";
import { useEffect, useState } from "react";
import { profilePicURL } from "@/lib/utils/profilePic";
import ProfilePictureIcon from "./ProfilePictureIcon";

type Props = {
  user: UserDetails;
  currentUser?: UserDetails;
  isFollowingInitial?: boolean;
};

export default function DashboardUserDetails({
  user,
  currentUser,
  isFollowingInitial = false,
}: Props) {
  const [profileUser, setProfileUser] = useState(user);
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/user/${user.id}`);

        if (!res.ok) {
          console.error("Failed to fetch user details");
          return;
        }
        const data = await res.json();
        setProfileUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [isFollowing, user.id]);

  return (
    <section className="px-4 py-12">
      <div className="md:grid md:grid-cols-4 gap-4 md:gap-3 flex flex-col justify-center items-center">
        <div className="col-span-1 flex items-center justify-center">
          <ProfilePictureIcon
            profilePic={user.profilePic}
            width={100}
            height={100}
          />
        </div>
        <div className="w-full col-span-3 h-full flex flex-col items-center md:items-start md:pl-4 md:border-l-2 border-gray-100 ">
          <div className="flex flex-col justify-center md:flex-row items-center gap-4 mb-4">
            <h1 className="text-l md:text-xl text-center font-semibold">
              {profileUser.name}
            </h1>
            {!currentUser ? (
              <Link href={"/profile/edit"}>
                <Button variant="outline">Edit Profile</Button>
              </Link>
            ) : (
              <FollowButton
                followingId={profileUser.id}
                followerId={currentUser.id}
                isFollowing={isFollowing}
                setIsFollowing={setIsFollowing}
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2  ">
            <div className="flex flex-col md:items-start items-center">
              <p className="text-xs font-thin muted whitespace-nowrap">POSTS</p>
              <h4 className="font-semibold">{profileUser.postCount}</h4>
            </div>
            <div className="flex flex-col md:items-start items-center mb-3">
              <p className="text-xs font-thin muted whitespace-nowrap">
                FOLLOWERS
              </p>
              <h4 className="font-semibold">{profileUser.followerCount}</h4>
            </div>
            <div className="flex flex-col md:items-start items-center">
              <p className="text-xs font-thin muted whitespace-nowrap">
                FOLLOWING
              </p>
              <h4 className="font-semibold">{profileUser.followingCount}</h4>
            </div>
          </div>
          <div className="w-full">
            <p className="text-center md:text-left break-words whitespace-normal">
              {profileUser.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
