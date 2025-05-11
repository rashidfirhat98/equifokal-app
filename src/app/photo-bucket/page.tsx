import UploadForm from "@/components/UploadForm";
import { unauthorized } from "next/navigation";
import { fetchUserPhotoCount, fetchUserSession } from "./actions";
import PhotoList from "@/components/PhotoList";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default async function UploadPage() {
  const user = await fetchUserSession();

  if (!user) {
    return unauthorized();
  }

  const photoCount = await fetchUserPhotoCount(user.id);

  return (
    <section className="px-2 py-3">
      <h1 className="heading-2 my-8">Photo Bucket</h1>
      <UploadForm photosAmt={photoCount} />
      {photoCount > 0 && (
        <div>
          <h2 className="heading-5 mt-10">Your Photos</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <PhotoList userId={user.id} />
          </Suspense>
        </div>
      )}
    </section>
  );
}
