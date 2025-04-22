import Image from "next/image";
import { unauthorized } from "next/navigation";
import profilePic from "@/assets/images/EQFKL_logo.jpg";
import { Button } from "@/components/ui/button";
import DashboardTabs from "@/components/DashboardTabs";
import Link from "next/link";
import { getCurrentUser } from "./actions";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const profilePicURL = user?.profilePic || profilePic;

  if (!user) {
    unauthorized();
  }
  return (
    <>
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
          <div className="col-span-3 h-full flex flex-col items-start pl-4 border-l-2 border-gray-100 ">
            <div className="flex sm:flex-row items-center gap-4 mb-4">
              <h1 className="text-l sm:text-xl text-center font-semibold">
                {user.name}
              </h1>
              <Link href={"/profile/edit"}>
                <Button variant="outline">Edit Profile</Button>
              </Link>
            </div>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col items-center">
                <p className="text-xs font-thin text-gray-600 whitespace-nowrap">
                  POSTS
                </p>
                <h4 className="font-semibold">30</h4>
              </div>
              <div className="flex flex-col items-center mb-3">
                <p className="text-xs font-thin text-gray-600 whitespace-nowrap">
                  FOLLOWERS
                </p>
                <h4 className="font-semibold">30</h4>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs font-thin text-muted-foreground whitespace-nowrap">
                  FOLLOWING
                </p>
                <h4 className="font-semibold">30</h4>
              </div>
            </div>
            <div>
              <p>{user.bio}</p>
            </div>
          </div>
        </div>
      </section>

      <DashboardTabs />
    </>
  );
}
