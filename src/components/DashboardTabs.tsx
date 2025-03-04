import { GalleriesResults } from "@/models/Gallery";
import GalleryForm from "./GalleryForm";
import GalleryList from "./GalleryList";
import Portfolio from "./Portfolio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import UploadForm from "./UploadForm";
import { getGalleries, getUserImages } from "@/app/dashboard/actions";
import { ImagesResults } from "@/models/Images";

export default async function DashboardTabs() {
    const photosRes: ImagesResults | undefined = await getUserImages();
    const galleriesRes: GalleriesResults | undefined = await getGalleries({});
    
  return (
    <Tabs orientation="vertical" defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="article">Article</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        <TabsContent value="portfolio">
          <Portfolio />
        </TabsContent>
        <TabsContent value="gallery">
          {galleriesRes && galleriesRes.galleries.length > 0 ? (
            <GalleryList galleries={galleriesRes} />
          ) : (
            <GalleryForm photos={photosRes} />
          )}
        </TabsContent>
        <TabsContent value="followers">
          <div>Insert Follower list here</div>
        </TabsContent>
      </Tabs>   
  )
}
