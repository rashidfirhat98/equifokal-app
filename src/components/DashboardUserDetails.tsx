import Image from "next/image";

import profilePic from "@/assets/images/EQFKL_logo.jpg";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import Link from "next/link";

type Props = {
  user: User;
};

export default function DashboardUserDetails({ user }: Props) {
  const profilePicURL = user?.profilePic || profilePic;
  return (
    <section className="px-4 py-12">
      <div className="sm:grid sm:grid-cols-4 gap-4 sm:gap-3 flex flex-col justify-center items-center">
        <div className="col-span-1 flex items-center justify-center">
          <Image
            width={100}
            height={100}
            alt="profile-pic"
            src={profilePicURL}
            className="rounded-full aspect-square object-cover"
          />
        </div>
        <div className="w-full col-span-3 h-full flex flex-col items-center md:items-start md:pl-4 md:border-l-2 border-gray-100 ">
          <div className="flex flex-col justify-center sm:flex-row items-center gap-4 mb-4">
            <h1 className="text-l sm:text-xl text-center font-semibold">
              {user.name}
            </h1>
            <Link href={"/profile/edit"}>
              <Button variant="outline">Edit Profile</Button>
            </Link>
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
              <h4 className="font-semibold">30</h4>
            </div>
            <div className="flex flex-col md:items-start items-center">
              <p className="text-xs font-thin muted whitespace-nowrap">
                FOLLOWING
              </p>
              <h4 className="font-semibold">30</h4>
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
