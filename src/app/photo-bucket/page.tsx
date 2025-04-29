import UploadForm from "@/components/UploadForm";
import { unauthorized } from "next/navigation";
import { fetchCurrentUser, fetchUserImages } from "./actions";
import PhotoList from "@/components/PhotoList";

export default async function UploadPage() {
  const user = await fetchCurrentUser();

  if (!user) {
    return unauthorized();
  }

  const res = await fetchUserImages();

  const { photos, nextCursor, totalResults } = res;

  if (!photos?.length) {
    return <UploadForm photosAmt={totalResults} />;
  } else {
    return (
      <section className="px-2 py-3">
        <h1 className="heading-2 my-8">Photo Bucket</h1>
        <UploadForm photosAmt={totalResults} />
        <div>
          <h2 className="heading-5 mt-10">Your Photos</h2>
          <PhotoList initialPhotos={photos} initialCursor={nextCursor} />
        </div>
      </section>
    );
  }
}
