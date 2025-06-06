"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { UserDetails } from "@/models/User";
import { useEffect, useState } from "react";
import ProfilePictureIcon from "./ProfilePictureIcon";
import { useSessionContext } from "./SessionContext";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

type Props = {
  user?: UserDetails;
  currentUser?: UserDetails;
  isFollowingInitial?: boolean;
};

export default function DashboardUserDetails({
  user,
  currentUser,
  isFollowingInitial = false,
}: Props) {
  const { data: session } = useSession();
  const initialUser = user ?? session?.user;
  const [profileUser, setProfileUser] = useState(initialUser);
  const [isFollowing, setIsFollowing] = useState(isFollowingInitial);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!initialUser?.id) return;
      try {
        const res = await fetch(`/api/user/${initialUser.id}`);

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
  }, [isFollowing, initialUser?.id]);

  if (!initialUser) {
    return <p>Error: User not found.</p>;
  }

  if (!profileUser) {
    return (
      <div className="loader flex items-center justify-center">
        <p>Loading profile...</p>;
        <Loader2 className="animate-spin text-gray-500 w-8 h-8 mx-auto" />
      </div>
    );
  }

  return (
    <section className="px-4 py-12">
      <div className="md:grid md:grid-cols-4 gap-4 md:gap-3 flex flex-col justify-center items-center">
        <div className="col-span-1 flex items-center justify-center">
          <ProfilePictureIcon
            profilePic={profileUser.profilePic ?? null}
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
              <Link href={"edit/profile"}>
                <Button variant="outline">Edit Profile</Button>
              </Link>
            ) : (
              <FollowButton
                followingId={profileUser.id}
                followerId={currentUser.id}
                isFollowingInitial={isFollowing}
                onFollowToggle={() => setIsFollowing((prev) => !prev)}
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
