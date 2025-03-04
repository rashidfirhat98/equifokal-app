import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { unauthorized } from "next/navigation";
import profilePic from "@/assets/images/EQFKL_logo.jpg";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadForm from "@/components/UploadForm";
import Portfolio from "@/components/Portfolio";
import GalleryForm from "@/components/GalleryForm";
import { ImagesResults } from "@/models/Images";
import { getGalleries, getUserImages } from "./actions";
import GalleryList from "@/components/GalleryList";
import { GalleriesResults } from "@/models/Gallery";
import DashboardTabs from "@/components/DashboardTabs";

const getCurrentUser = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return;
    const currentUser = await prisma.user.findUnique({
      where: { email: session?.user.email || undefined },
    });
    if (!currentUser) return;

    return currentUser;
  } catch (error) {
    console.log(error);
    return;
  }
};
export default async function DashboardPage() {
  const user = await getCurrentUser();

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
              src={profilePic}
              className="rounded-full"
            />
          </div>
          <div className="col-span-3 h-full flex flex-col items-start pl-4 border-l-2 border-gray-100 ">
            <div className="flex sm:flex-row items-center gap-4 mb-4">
              <h1 className="text-l sm:text-xl text-center font-semibold">
                User Name
              </h1>
              <Button variant="outline">Edit Profile</Button>
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
              <p>
                Insert bio here - just your friendly neighborhood photographer
                and traveller in town
              </p>
            </div>
          </div>
        </div>
      </section>

      <DashboardTabs />
    </>
  );
}
