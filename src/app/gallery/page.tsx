import { getUserImages } from "@/app/dashboard/actions";
import GalleryForm from "@/components/GalleryForm";
import { ImagesResults } from "@/models/Images";
import { getUserGalleries } from "./actions";
import GalleryList from "@/components/GalleryList";

export default async function CreateGalleryPage() {
  const photos: ImagesResults | undefined = await getUserImages();
  const galleriesRes = await getUserGalleries();

  const { galleries, totalResults, nextCursor } = await galleriesRes.json();

  if (!galleries?.length) {
    return <GalleryForm photos={photos} galleriesAmt={totalResults} />;
  } else {
    return (
      <section>
        <h1 className="heading-2 px-2 my-8">Galleries</h1>
        <GalleryForm photos={photos} galleriesAmt={totalResults} />

        <h2 className="heading-5 px-2 mt-10">Your Galleries</h2>
        <GalleryList initialGalleries={galleries} initialCursor={nextCursor} />
      </section>
    );
  }
}
