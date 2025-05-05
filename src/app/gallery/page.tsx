import GalleryForm from "@/components/GalleryForm";
import GalleryList from "@/components/GalleryList";
import { fetchUserGalleryCount } from "./actions";
import { fetchCurrentUser } from "../article/actions";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default async function CreateGalleryPage() {
  const user = await fetchCurrentUser();

  if (!user) {
    return unauthorized();
  }

  const galleryCount = await fetchUserGalleryCount(user.id);

  return (
    <section className="px-2 py-3">
      <h1 className="heading-2 my-8">Galleries</h1>
      <GalleryForm galleriesAmt={galleryCount} />
      {galleryCount > 0 && (
        <div>
          <h2 className="heading-5 mt-10">Your Galleries</h2>
          <Suspense fallback={<LoadingSpinner />}>
            <GalleryList userId={user.id} />
          </Suspense>
        </div>
      )}
    </section>
  );
}
