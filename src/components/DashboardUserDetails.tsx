import Image from "next/image";
import profilePic from "@/assets/images/EQFKL_logo.jpg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import FollowButton from "./FollowButton";
import { UserDetails } from "@/models/User";

type Props = {
  user: UserDetails;
  currentUser?: UserDetails;
  isFollowingInitial?: boolean;
};

export default function DashboardUserDetails({
  user,
  currentUser,
  isFollowingInitial,
}: Props) {
  const profilePicURL = user?.profilePic || profilePic;
  return (
    <section className="px-4 py-12">
      <div className="md:grid md:grid-cols-4 gap-4 md:gap-3 flex flex-col justify-center items-center">
        <div className="col-span-1 flex items-center justify-center">
          <Image
            width={90}
            height={90}
            alt="profile-pic"
            src={profilePicURL}
            className="rounded-full aspect-square object-cover"
          />
        </div>
        <div className="w-full col-span-3 h-full flex flex-col items-center md:items-start md:pl-4 md:border-l-2 border-gray-100 ">
          <div className="flex flex-col justify-center md:flex-row items-center gap-4 mb-4">
            <h1 className="text-l md:text-xl text-center font-semibold">
              {user.name}
            </h1>
            {!currentUser ? (
              <Link href={"/profile/edit"}>
                <Button variant="outline">Edit Profile</Button>
              </Link>
            ) : (
              <FollowButton
                followingId={user.id}
                followerId={currentUser.id}
                isFollowingInitial={isFollowingInitial}
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2  ">
            <div className="flex flex-col md:items-start items-center">
              <p className="text-xs font-thin muted whitespace-nowrap">POSTS</p>
              <h4 className="font-semibold">30</h4>
            </div>
            <div className="flex flex-col md:items-start items-center mb-3">
              <p className="text-xs font-thin muted whitespace-nowrap">
                FOLLOWERS
              </p>
              <h4 className="font-semibold">{user.followerCount}</h4>
            </div>
            <div className="flex flex-col md:items-start items-center">
              <p className="text-xs font-thin muted whitespace-nowrap">
                FOLLOWING
              </p>
              <h4 className="font-semibold">{user.followingCount}</h4>
            </div>
          </div>
          <div className="w-full">
            <p className="text-center md:text-left break-words whitespace-normal">
              {user.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
