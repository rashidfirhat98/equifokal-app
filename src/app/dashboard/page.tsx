import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { unauthorized } from "next/navigation";
import profilePic from "@/assets/images/EQFKL_logo.jpg";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Gallery from "@/components/Gallery";

const getCurrentUser = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return;
    const currentUser = await prisma.user.findUnique({
      where: { email: session?.user.email || undefined },
    });
    console.log("user:" + currentUser);
    if (!currentUser) return;

    return currentUser;
  } catch (error) {
    console.log(error);
    return;
  }
};
export default async function DashboardPage() {
  const user = await getCurrentUser();
  console.log(user);
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
                <p className="text-xs font-thin text-gray-600 whitespace-nowrap">
                  FOLLOWING
                </p>
                <h4 className="font-semibold">30</h4>
              </div>
            </div>
            <div>
              <p>
                Insert bio here - just your friendly neighborhood photographer
              </p>
            </div>
          </div>
        </div>
      </section>

      <Tabs orientation="vertical" defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="password">Portfolio</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
        </TabsList>
        <TabsContent value="gallery">
          <Gallery />
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Current password</Label>
                <Input id="current" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">New password</Label>
                <Input id="new" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="followers">
          <div>Insert Follower list here</div>
        </TabsContent>
      </Tabs>
    </>
  );
}
