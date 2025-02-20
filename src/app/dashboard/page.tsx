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
import Gallery from "@/components/Gallery";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UploadForm from "@/components/UploadForm";

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

      <Tabs orientation="vertical" defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="bucket">Bucket</TabsTrigger>
          <TabsTrigger value="article">Article</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio">
          <Gallery />
        </TabsContent>
        <TabsContent value="gallery">
          <Card className="mx-3">
            <CardHeader>
              <CardTitle>Create a gallery</CardTitle>
              <CardDescription>
                Add a photos from your bucket to create a gallery here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Gallery title</Label>
                <Input id="current" type="text" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Select photos</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>North America</SelectLabel>
                      <SelectItem value="est">
                        Eastern Standard Time (EST)
                      </SelectItem>
                      <SelectItem value="cst">
                        Central Standard Time (CST)
                      </SelectItem>
                      <SelectItem value="mst">
                        Mountain Standard Time (MST)
                      </SelectItem>
                      <SelectItem value="pst">
                        Pacific Standard Time (PST)
                      </SelectItem>
                      <SelectItem value="akst">
                        Alaska Standard Time (AKST)
                      </SelectItem>
                      <SelectItem value="hst">
                        Hawaii Standard Time (HST)
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Europe & Africa</SelectLabel>
                      <SelectItem value="gmt">
                        Greenwich Mean Time (GMT)
                      </SelectItem>
                      <SelectItem value="cet">
                        Central European Time (CET)
                      </SelectItem>
                      <SelectItem value="eet">
                        Eastern European Time (EET)
                      </SelectItem>
                      <SelectItem value="west">
                        Western European Summer Time (WEST)
                      </SelectItem>
                      <SelectItem value="cat">
                        Central Africa Time (CAT)
                      </SelectItem>
                      <SelectItem value="eat">
                        East Africa Time (EAT)
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Asia</SelectLabel>
                      <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                      <SelectItem value="ist">
                        India Standard Time (IST)
                      </SelectItem>
                      <SelectItem value="cst_china">
                        China Standard Time (CST)
                      </SelectItem>
                      <SelectItem value="jst">
                        Japan Standard Time (JST)
                      </SelectItem>
                      <SelectItem value="kst">
                        Korea Standard Time (KST)
                      </SelectItem>
                      <SelectItem value="ist_indonesia">
                        Indonesia Central Standard Time (WITA)
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save gallery</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="bucket">
          <UploadForm />
        </TabsContent>
        <TabsContent value="followers">
          <div>Insert Follower list here</div>
        </TabsContent>
      </Tabs>
    </>
  );
}
