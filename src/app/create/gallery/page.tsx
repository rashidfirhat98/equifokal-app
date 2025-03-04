import { getUserImages } from "@/app/dashboard/actions";
import GalleryForm from "@/components/GalleryForm";
import { ImagesResults } from "@/models/Images";


export default async function CreateGalleryPage() {
    const photos: ImagesResults | undefined = await getUserImages();
  
    return <GalleryForm photos={photos}/>;
}
