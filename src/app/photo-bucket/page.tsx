import UploadForm from "@/components/UploadForm";
import { getCurrentUser } from "../dashboard/actions";
import { unauthorized } from "next/navigation";
import { getUserImages } from "./actions";
import PhotoList from "@/components/PhotoList";

export default async function UploadPage() {
  const user = await getCurrentUser();

  if (!user) {
    return unauthorized();
  }

  const res = await getUserImages(10, "");

  const { photos, nextCursor, totalResults } = await res.json();

  if (!photos?.length) {
    return <UploadForm photosAmt={totalResults} />;
  } else {
    return (
      <>
        <h1 className="heading-2 my-8">Photo Bucket</h1>
        <UploadForm photosAmt={totalResults} />
        <section className="px-2 my-3">
          <h2 className="heading-5 mt-10">Your Photos</h2>
          <PhotoList initialPhotos={photos} initialCursor={nextCursor} />
        </section>
      </>
    );
  }
}
