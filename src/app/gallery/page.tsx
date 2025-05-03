import GalleryForm from "@/components/GalleryForm";
import GalleryList from "@/components/GalleryList";
import { fetchUserGalleriesList, fetchUserImages } from "./actions";
import { fetchCurrentUser } from "../article/actions";
import { unauthorized } from "next/navigation";

export default async function CreateGalleryPage() {
  const photos = await fetchUserImages();
  const galleriesRes = await fetchUserGalleriesList();
  const user = await fetchCurrentUser();

  if (!user) {
    return unauthorized();
  }

  const { galleries, totalResults, nextCursor } = galleriesRes;

  if (!galleries?.length) {
    return <GalleryForm photos={photos} galleriesAmt={totalResults} />;
  } else {
    return (
      <section>
        <h1 className="heading-2 px-2 my-8">Galleries</h1>
        <GalleryForm photos={photos} galleriesAmt={totalResults} />

        <h2 className="heading-5 px-2 mt-10">Your Galleries</h2>
        <GalleryList
          initialGalleries={galleries}
          initialCursor={nextCursor}
          userId={user.id}
        />
      </section>
    );
  }
}
